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
          realidadTecnica="En escenarios donde la GPU opera al límite máximo de utilización (GPU-bound), el pipeline gráfico puede acumular cuadros pendientes en la cola del controlador, aumentando la latencia de entrada entre el mouse y la pantalla. Por otra parte, dejar los FPS completamente desincronizados por encima de la frecuencia de refresco puede producir desgarro de imagen (screen tearing) e irregularidades en la entrega de cuadros. Sin embargo, no existe una cifra universal de cuadros en cola o de milisegundos fijos: la implementación de tecnologías de baja latencia (como NVIDIA Reflex o AMD Anti-Lag), limitadores de fotogramas y monitores con refresco variable (VRR: G-Sync / FreeSync) modifican sustancialmente la respuesta del sistema."
          experimento="Protocolo EVO: evaluación comparativa de latencia de entrada y consistencia de frametime entre fotogramas ilimitados en saturación completa de GPU frente a sincronización VRR combinada con limitación de cuadros o tecnologías de baja latencia."
          herramientaMedicion="Monitor de latencia y consistencia de cuadros (PresentMon o CapFrameX)"
          resultado="mejoro"
          resultadoDetalle="Al evitar que la GPU acumule fotogramas en cola mediante tecnologías de baja latencia o limitadores adecuados, la respuesta de entrada se vuelve más predecible y se eliminan artefactos de desgarro de imagen sin penalizaciones de retardo."
          riesgo="Usar limitadores de fotogramas externos con temporización deficiente puede introducir fluctuaciones de frametime adicionales. Es preferible emplear limitadores integrados en el motor del juego o herramientas de bajo nivel reconocidas."
          comoRevertirlo="Habilitar tecnologías de baja latencia soportadas por el juego (como NVIDIA Reflex o AMD Anti-Lag). Si se cuenta con monitor VRR (G-Sync o FreeSync), limitar ligeramente por debajo del techo del refresco puede resultar útil en varios sistemas para evitar rebasar el rango de sincronización variable. Medir siempre el comportamiento en cada juego."
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
