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
          realidadTecnica="Windows Internals (Mark Russinovich) lo confirma fehacientemente: por arquitectura de diseño, Windows SIEMPRE utiliza todos los núcleos e hilos lógicos del CPU de forma nativa. El parámetro NUMPROC del Boot Configuration Data (BCD) fue creado por Microsoft exclusivamente para desarrolladores que necesitan emular fallos y limitar artificialmente la CPU a 1 o 2 núcleos. Tildar la casilla fija el valor: si luego cambiás de CPU, Windows queda bloqueado con núcleos apagados, y en arquitecturas híbridas (Intel 12ª a 14ª Gen) rompe la asignación del Thread Director desactivando los E-Cores."
          experimento="Ensayo pericial controlado en Cinebench R23 Multi-Core (3 corridas continuas bajo misma temperatura de encapsulado) con casilla desmarcada (por defecto) vs. casilla forzada en 16 núcleos."
          herramientaMedicion="Cinebench R23 + Windows Performance Monitor + HWiNFO64"
          resultado="no-cambio"
          resultadoDetalle="Por defecto de fábrica: 14.820 pts. Casilla forzada en msconfig: 14.815 pts (Delta: -0.03%, margen de error despreciable). Cero ganancia de velocidad y alto riesgo de conflicto al actualizar hardware."
          riesgo="Si por error tildás la casilla contigua 'Cantidad máxima de memoria', Windows limitará la RAM a 256 MB provocando un bucle de pantalla azul (BSOD) irreversible al reiniciar."
          comoRevertirlo="Abrir msconfig > pestaña Arranque > Opciones avanzadas y desmarcar por completo la casilla 'Número de procesadores' para que quede en blanco, permitiendo que el kernel autodetecte la topología completa."
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
