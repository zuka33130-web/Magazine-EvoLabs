import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { AlertCircle, Waves, CheckCircle2 } from 'lucide-react';

export const Page05Mito01Ram: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-09"
      pageNumber={9}
      totalPages={46}
      sectionTitle="DESCUBRIMIENTO METROLÓGICO"
      subSlug="EXPEDIENTE MITO-01 // TOPOLOGÍA DE MEMORIA RAM"
      accentColor="#EAB308"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Full-Page Dedicated Internet Dice // Evo Mide Section */}
        <InternetDiceEvoMide
          idMito="MITO-01"
          consejoPopular="Poner la memoria RAM en los slots 1 y 3 da exactamente igual que en los slots 2 y 4: mientras hagan clic y Windows sume los GB, funcionan con el mismo rendimiento."
          fuentePopular="Comentarios habituales en videos de ensamblado y redes sociales"
          realidadTecnica="En muchas placas madre contemporáneas de 4 ranuras con topología Daisy-Chain, las pistas de señal del controlador de memoria se dirigen prioritariamente hacia el segundo módulo de cada canal (habitualmente slots A2 y B2). Instalar dos módulos en A1 y B1 deja los extremos de las trazas desocupados (stub traces), lo que puede generar reflexiones de señal electromagnética a alta frecuencia. Esto no destruye el hardware automáticamente, pero puede reducir el margen de estabilidad eléctrica, dificultar la activación de perfiles XMP/EXPO o limitar las frecuencias alcanzables según placa, CPU, memoria y BIOS. Regla EVO: siempre consultar el manual oficial de tu placa madre para confirmar la disposición primaria."
          experimento="Protocolo EVO didáctico: comparación de arranque y verificación de estabilidad de un kit de alta frecuencia instalado primero en slots A1/B1 y luego en la posición A2/B2 recomendada por el fabricante de la placa."
          herramientaMedicion="Prueba de memoria (MemTest86 o Windows Memory Diagnostic) + Monitor de errores de hardware (HWiNFO64 WHEA)"
          resultado="empeoro"
          resultadoDetalle="En slots A1/B1: en sistemas sensibles a alta frecuencia, el perfil XMP/EXPO puede fallar en el POST o arrojar errores de paridad bajo carga intensa. En slots A2/B2: la señal directa optimiza el margen de integridad de señal y permite validar la frecuencia indicada sin errores de paridad."
          riesgo="Inestabilidad intermitente, cierres inesperados de aplicaciones pesadas o menor margen de overclocking si se fuerza alta frecuencia fuera de los slots primarios recomendados."
          comoRevertirlo="Consultar el diagrama de slots en el manual de la placa madre. Si se utilizan dos módulos, instalarlos en las ranuras primarias recomendadas (en muchas plataformas: A2 y B2, habitualmente 2do y 4to slot contando desde el zócalo de la CPU)."
          fullPage={true}
        />

        {/* Technical Deep Dive: Daisy-Chain vs T-Topology */}
        <div className="p-3.5 bg-[#0e111a] border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-yellow-400">
            <Waves className="w-4 h-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">EL FENÓMENO FÍSICO: "STUB TRACE REFLECTION"</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-[11px] leading-tight max-w-xl">
            A frecuencias de 6000 MT/s, una pista de cobre de 3 centímetros sin terminar actúa como un espejo electromagnético: la onda de voltaje rebota y cancela los flancos de subida del pulso de reloj.
          </p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
