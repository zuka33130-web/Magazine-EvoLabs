import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { ShieldCheck, HardDrive } from 'lucide-react';

export const Page37Chapter06Mito07: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-37"
      pageNumber={37}
      totalPages={41}
      sectionTitle="DESCUBRIMIENTO METROLÓGICO"
      subSlug="EXPEDIENTE MITO-07 // MANTENIMIENTO DE CONTROLADORES"
      accentColor="#10B981"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Full-Page Dedicated Internet Dice // Evo Mide Section */}
        <InternetDiceEvoMide
          idMito="MITO-07"
          consejoPopular="Cada vez que salga una nueva versión de drivers de tu placa de video, reiniciá obligatoriamente en Modo Seguro, pasá DDU para borrar todo rastro del sistema y reinstalá de cero: de lo contrario tendrás caídas de FPS y corrupción de texturas."
          fuentePopular="Recomendación omnipresente en comunidades de soporte técnico y foros"
          realidadTecnica="Los instaladores oficiales modernos de NVIDIA y AMD gestionan el reemplazo atómico de binarios y claves del registro de forma completamente limpia mediante la opción nativa 'Instalación limpia' (Clean Install). DDU borra de cuajo la caché compilada de sombreadores (DirectX Shader Cache), los perfiles de color ICC calibrados y las configuraciones específicas del panel. Al pasar DDU innecesariamente, la próxima vez que abras tus juegos sufrirás intensos micro-tirones (stuttering de compilación de shaders en tiempo real) durante las primeras horas de juego."
          experimento="Ensayo comparativo pericial durante 6 meses de actualizaciones continuas: A) Actualización estándar sobre el driver existente marcando 'Instalación limpia' vs. B) Pasada agresiva de DDU en Modo Seguro antes de cada versión."
          herramientaMedicion="CapFrameX Frametime Logger + 3DMark Time Spy Graphics Score"
          resultado="no-cambio"
          resultadoDetalle="Puntaje de 3DMark idéntico (18.450 vs 18.442 pts). Cero diferencia en rendimiento final. Sin embargo, el sistema sometido a DDU experimentó tartamudeos severos durante los primeros 15 minutos en cada juego mientras reconstruía la caché de shaders en disco."
          riesgo="Pérdida de calibraciones de pantalla, desconfiguración de perfiles de G-Sync y micro-stuttering por recompilación continua de sombreadores."
          comoRevertirlo="Usar DDU exclusivamente como herramienta de emergencia cuando cambiaste físicamente de fabricante de GPU (ej. de NVIDIA a AMD o viceversa) o si sufrís una pantalla azul atribuible directamente a nvlddmkm.sys o amdkmdag.sys que persiste tras reiniciar."
          fullPage={true}
        />

        {/* Technical Callout */}
        <div className="p-3.5 bg-[#0a1310] border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-emerald-400">
            <HardDrive className="w-4 h-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">EL CRITERIO QUIRÚRGICO DE LABORATORIO:</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-[11px] leading-tight max-w-xl">
            DDU es un bisturí de cirugía mayor para trasplantes de silicio o emergencias graves; no es una esponja de limpieza diaria.
          </p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
