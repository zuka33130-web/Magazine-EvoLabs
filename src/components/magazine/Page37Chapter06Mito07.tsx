import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { ShieldCheck, HardDrive } from 'lucide-react';

export const Page37Chapter06Mito07: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-41"
      pageNumber={41}
      totalPages={46}
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
          realidadTecnica="Los instaladores oficiales de NVIDIA, AMD e Intel realizan habitualmente la sustitución de binarios y registros de forma ordenada sin requerir utilidades externas. DDU (Display Driver Uninstaller) es una herramienta excelente y muy útil para diagnóstico, resolución de conflictos graves o al realizar un cambio de fabricante de GPU. Sin embargo, utilizarla de manera obligatoria y rutinaria en cada actualización común es innecesario: elimina configuraciones personalizadas y borra cachés de sombreadores que luego deberán reconstruirse temporalmente. Para el mantenimiento habitual, la actualización oficial (o la opción de instalación limpia del propio instalador) resulta plenamente adecuada."
          experimento="Protocolo EVO: comparativa entre actualización estándar del controlador oficial frente a desinstalación profunda con DDU en Modo Seguro en actualizaciones consecutivas sobre el mismo hardware."
          herramientaMedicion="Herramienta de análisis de frametime (CapFrameX) + benchmark gráfico"
          resultado="no-cambio"
          resultadoDetalle="En un sistema sano, utilizar DDU de rutina no implica por sí mismo una mejora de rendimiento. Reservalo para escenarios donde exista una razón técnica para una desinstalación profunda."
          riesgo="Reinicio redundante en modo seguro, pérdida de perfiles de color o configuraciones personalizadas del panel de control y posibles tirones transitorios mientras se recompilan sombreadores."
          comoRevertirlo="Reservar el uso de DDU para situaciones justificadas: cambio de fabricante de tarjeta gráfica, resolución de fallos persistentes de pantalla azul o cuando una actualización falló y dejó registros corruptos. Para el día a día, emplear el instalador oficial."
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
