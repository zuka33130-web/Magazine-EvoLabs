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
          realidadTecnica="Casi el 95% de las placas madre modernas utilizan topología Daisy-Chain en sus pistas de cobre. Las trazas eléctricas viajan del procesador directo hacia los slots 2 y 4 (A2/B2). Si instalás los módulos en 1 y 3, el tramo final de la pista de cobre queda vacío como una antena reflectora ('stub trace') que rebota la señal electromagnética a alta frecuencia, destruyendo la integridad eléctrica y corrompiendo perfiles EXPO/XMP."
          experimento="Ensayo pericial con kit DDR5-6000 CL30 en placa AM5: primero en slots A1/B1 (1 y 3), luego en A2/B2 (2 y 4), corriendo MemTest86 durante 4 ciclos completos y AIDA64 Memory Latency."
          herramientaMedicion="MemTest86 v10.6 + HWiNFO64 WHEA Bus Error Monitor"
          resultado="empeoro"
          resultadoDetalle="En slots 1 y 3: Falla el inicio con EXPO activo (código de error C5 en display de BIOS) o 24 errores de paridad WHEA en 10 minutos. En slots 2 y 4: 100% de estabilidad a 6000 MT/s, 0 errores y 63.8 ns de latencia."
          riesgo="Corrupción silenciosa de archivos de sistema en disco NTFS por errores de paridad en RAM no detectados a tiempo."
          comoRevertirlo="Apagar la máquina, desconectar la fuente de poder y recolocar los dos módulos de RAM exclusivamente en las ranuras A2 y B2 (habitualmente el 2do y 4to slot contando desde el socket del procesador hacia afuera)."
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
