import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { AlertTriangle, Cpu, ShieldAlert } from 'lucide-react';

export const Page09Chapter01Mito02: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-13"
      pageNumber={13}
      totalPages={46}
      sectionTitle="DESCUBRIMIENTO METROLÓGICO"
      subSlug="EXPEDIENTE MITO-02 // GESTIÓN DE NÚCLEOS DE CPU"
      accentColor="#EAB308"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Full-Page Dedicated Internet Dice // Evo Mide Section */}
        <InternetDiceEvoMide
          idMito="MITO-02"
          consejoPopular="Entrá a MSConfig > Arranque > Opciones avanzadas, tildá la casilla 'Número de procesadores' y seleccioná el número máximo (8, 16 o 32) para obligar a Windows a usar todos los núcleos al 100% de potencia."
          fuentePopular="Tutoriales virales de 'optimización extrema' en YouTube y TikTok"
          realidadTecnica="Por arquitectura de diseño, el kernel de Windows detecta y utiliza de forma predeterminada todos los procesadores lógicos disponibles reportados por el firmware (ACPI MADT). El modificador numproc en los datos de configuración de arranque (BCD) está concebido como mecanismo de diagnóstico para desarrolladores y soporte técnico que requieren simular entornos con menos núcleos. Marcar esta casilla no desbloquea potencia oculta ni aumenta los FPS; por el contrario, fija un valor rígido que puede restringir la CPU si se cambia de procesador o interferir con la topología de núcleos de rendimiento y eficiencia."
          experimento="Protocolo EVO: comparación de rendimiento en benchmark multi-hilo (Cinebench) con la configuración predeterminada (casilla desmarcada) frente a casilla marcada manualmente con el número total de hilos."
          herramientaMedicion="Herramienta de estrés de CPU (Cinebench) + Administrador de tareas / Monitor de recursos"
          resultado="no-cambio"
          resultadoDetalle="Marcar manualmente 'Número de procesadores' no desbloquea rendimiento adicional: Windows ya utiliza de forma predeterminada los procesadores lógicos disponibles. La comparación debe realizarse en el equipo del lector si se desea comprobar el comportamiento."
          riesgo="Configurar límites de memoria o CPU en este panel puede restringir los recursos del sistema en el siguiente arranque, ocasionando fallos de inicio o pérdida de rendimiento. Si se modificó por error, debe restaurarse la configuración predeterminada."
          comoRevertirlo="Abrir msconfig > pestaña Arranque > Opciones avanzadas y desmarcar 'Número de procesadores' y 'Cantidad máxima de memoria'. Aceptar y reiniciar para que Windows vuelva a detectar la totalidad del hardware disponible."
          fullPage={true}
        />

        {/* Technical Callout */}
        <div className="p-3.5 bg-[#0e111a] border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-yellow-400">
            <Cpu className="w-4 h-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">EL PRINCIPIO DE ARQUITECTURA DE KERNEL:</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-[11px] leading-tight max-w-xl">
            El planificador de Windows (Windows Scheduler) mapea los núcleos en el arranque leyendo la tabla ACPI MADT. Forzar banderas manuales solo introduce rigidez en el arranque.
          </p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
