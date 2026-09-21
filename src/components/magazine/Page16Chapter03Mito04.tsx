import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { MousePointer, ShieldAlert, Monitor } from 'lucide-react';

export const Page16Chapter03Mito04: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-20"
      pageNumber={20}
      totalPages={46}
      sectionTitle="DESCUBRIMIENTO METROLÓGICO"
      subSlug="EXPEDIENTE MITO-04 // LATENCIA & SINCRONIZACIÓN"
      accentColor="#EF4444"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Full-Page Dedicated Internet Dice // Evo Mide Section */}
        <InternetDiceEvoMide
          idMito="MITO-04"
          consejoPopular="Desactivá por completo V-Sync, apagá G-Sync o FreeSync y dejá los FPS totalmente ilimitados: tener 240 FPS en un monitor de 144 Hz te dará la menor latencia de entrada posible."
          fuentePopular="Mito canónico repetido en canales de shooters competitivos y esports"
          realidadTecnica="En DirectX 11 y 12, si la GPU corre al 99-100% sin límite, el controlador de pantalla acumula de 1 a 3 fotogramas en cola para mantener saturados los núcleos de cómputo. Esa acumulación genera un búfer que retiene el input de tu mouse entre 20 y 40 milisegundos. Además, superar la tasa de refresco del monitor produce 'screen tearing' (cortes horizontales de imagen) y una varianza de fotogramas errática que perjudica la memoria muscular de puntería."
          experimento="Comparativa en banco de pruebas pericial: A) FPS desbloqueados con GPU al 99% vs. B) G-Sync activado + V-Sync forzado en el panel de control del driver + Cap de FPS a 3 cuadros por debajo del refresco (o NVIDIA Reflex / AMD Anti-Lag)."
          herramientaMedicion="NVIDIA LDAT v2 (Hardware Mouse Sensor) + CapFrameX"
          resultado="mejoro"
          resultadoDetalle="La latencia del clic cae de 44.8 ms a 18.4 ms (-59% de tiempo de respuesta). El 1% Low sube de 88 a 138 FPS. Fluidez absoluta y cero cortes de pantalla."
          riesgo="Si limitás los FPS con un limitador externo de baja calidad (sin CPU busy-sleep), podés introducir varianza adicional. Usar siempre el limitador in-game o RTSS."
          comoRevertirlo="Activar NVIDIA Reflex (Low Latency / On+Boost) en el menú del juego, o fijar el límite en RTSS (RivaTuner) exactamente a tu tasa de refresco menos 3 cuadros (ej: 141 FPS en 144 Hz, 237 FPS en 240 Hz)."
          fullPage={true}
        />

        {/* Technical Callout */}
        <div className="p-3.5 bg-[#140f12] border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-red-400">
            <Monitor className="w-4 h-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">LA FÓRMULA DE LABORATORIO:</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-[11px] leading-tight max-w-xl">
            G-Sync ON + V-Sync del Panel de Control ON + Reflex / Cap (-3 FPS). Esta tríada mantiene el refresco variable activo sin entrar jamás en la cola de retención de V-Sync tradicional.
          </p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
