import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { ShieldAlert, Terminal } from 'lucide-react';

export const Page22Chapter05Mito06: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-22"
      pageNumber={22}
      totalPages={41}
      sectionTitle="DESCUBRIMIENTO METROLÓGICO"
      subSlug="EXPEDIENTE MITO-06 // OPTIMIZACIÓN DE SISTEMA OPERATIVO"
      accentColor="#3B82F6"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Full-Page Dedicated Internet Dice // Evo Mide Section */}
        <InternetDiceEvoMide
          idMito="MITO-06"
          consejoPopular="Ejecutá un script masivo de 'Windows Debloater' de GitHub o instalá una ISO modificada ('MiniOS', 'GhostSpectre') que elimine 80 servicios para duplicar tus FPS y reducir los procesos de Windows a menos de 40."
          fuentePopular="Comunidad de 'tweakers' en Discord y videos con títulos en mayúsculas"
          realidadTecnica="Los servicios modernos de Windows permanecen en estado 'Manual (Trigger Start)' o suspendidos en memoria paginada, consumiendo exactamente 0.0% de CPU. Al eliminarlos a ciegas con scripts destructivos, se rompen dependencias cruzadas de seguridad, autenticación de Xbox App / Game Pass, subsistemas de sincronización de Bluetooth, colas de impresión y mecanismos de actualización de seguridad. En LatencyMon, los errores por servicios faltantes intentando reiniciarse en bucle incrementan la latencia DPC promedio."
          experimento="Ensayo pericial comparativo: Windows 11 oficial limpio (con bloatware desinstalado manualmente desde Configuración) vs. Windows 11 sometido a un script 'DeepDebloat' agresivo de 1.400 líneas."
          herramientaMedicion="Windows Event Viewer (Eventos de error ID 7000/7001) + LatencyMon + 3DMark Time Spy"
          resultado="empeoro"
          resultadoDetalle="En 3DMark: 0.2% de diferencia (dentro del error experimental). En estabilidad del sistema: 1.420 eventos de error en el Visor de Eventos en 24 hs por llamadas RPC fallidas, imposibilidad de abrir la Microsoft Store y fallas al sincronizar auriculares Bluetooth."
          riesgo="Imposibilidad permanente de instalar actualizaciones acumulativas de seguridad, fallos al vincular cuentas de usuario y alto riesgo de malware embebido en ISOs modificadas por terceros."
          comoRevertirlo="Si usaste un script agresivo, la única forma científicamente garantizada de restaurar la integridad del almacén de componentes es abrir PowerShell como Administrador y ejecutar: 'DISM /Online /Cleanup-Image /RestoreHealth' seguido de 'sfc /scannow', o reinstalar una imagen oficial descargada directamente de los servidores de Microsoft."
          fullPage={true}
        />

        {/* Technical Callout */}
        <div className="p-3.5 bg-[#0a111e] border border-zinc-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-blue-400">
            <Terminal className="w-4 h-4 shrink-0" />
            <span className="font-bold uppercase tracking-wider">EL PRINCIPIO QUIRÚRGICO DE EVO LABS:</span>
          </div>
          <p className="text-zinc-300 font-sans-editorial text-[11px] leading-tight max-w-xl">
            La limpieza profesional no se hace con un martillo demoliendo el sistema. Se hace desinstalando lo innecesario de forma nativa desde la interfaz oficial y auditando el inicio.
          </p>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
