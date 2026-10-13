import React from 'react';
import { BookOpen, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface WorkshopCaseItem {
  id: string;
  title: string;
  symptom: string;
  userBelief: string;
  realHypothesis: string;
  provingTest: string;
  appliedSolution: string;
  categoryTag: string;
}

export const WORKSHOP_CASES: WorkshopCaseItem[] = [
  {
    id: 'case-1',
    title: 'CASO 01 // FPS ALTOS, PERO TIRONES CONSTANTES',
    symptom: '165 FPS promedio en CS2/VALORANT pero microcongelamientos cada 10 segundos.',
    userBelief: '“La placa de video no sirve o tengo que formatear.”',
    realHypothesis: 'Dispersión de frametime provocada por un launcher secundario sincronizando partidas en segundo plano.',
    provingTest: 'Monitoreo de 1% Low y corte de tareas secundarias (Epic Launcher + OneDrive).',
    appliedSolution: 'Cierre de launchers no esenciales. El 1% Low subió de 42 a 130 FPS. Cadencia estabilizada.',
    categoryTag: 'RENDIMIENTO / FRAMETIME',
  },
  {
    id: 'case-2',
    title: 'CASO 02 // PC SE REINICIA TRAS 20 MINUTOS DE JUEGO',
    symptom: 'Apagado súbito como si se cortara la luz tras media hora en Warzone.',
    userBelief: '“Es la fuente de poder que no aguanta.”',
    realHypothesis: 'Disipador de CPU con traba suelta o pelusa obstruyendo el flujo de aire (corte térmico a 100°C).',
    provingTest: 'HWiNFO64 registró 99°C en Package CPU segundos antes del corte. Los voltajes de la fuente eran estables.',
    appliedSolution: 'Limpieza de filtro frontal y reajuste del anclaje del disipador. Temperatura máxima bajó a 72°C.',
    categoryTag: 'TEMPERATURA / ENERGÍA',
  },
  {
    id: 'case-3',
    title: 'CASO 03 // VENTILADORES GIRAN PERO NO HAY VIDEO',
    symptom: 'La PC enciende luces y ventiladores a fondo, pero el monitor reporta "Sin señal".',
    userBelief: '“Se quemó la placa madre o la placa de video.”',
    realHypothesis: 'Módulo de RAM desplazado ligeramente durante el traslado del gabinete o polvo en el slot.',
    provingTest: 'Prueba de descarte con un solo módulo en el slot 2. Con un módulo dio video de inmediato.',
    appliedSolution: 'Limpieza con aire comprimido del slot 4 y reasentamiento firme con doble clic. 16 GB reconocidos.',
    categoryTag: 'POST / MEMORIA RAM',
  },
  {
    id: 'case-4',
    title: 'CASO 04 // 16 GB FÍSICOS PERO SÓLO 7.9 GB UTILIZABLES',
    symptom: 'Windows reporta "16 GB (7.9 GB utilizables)" y el resto como "Reservada para hardware".',
    userBelief: '“Windows 11 está roto o un módulo vino fallado.”',
    realHypothesis: 'Módulos colocados en slots contiguos (A1-A2) en vez de alternados (A2-B2), desactivando Dual Channel.',
    provingTest: 'msinfo32 detectaba ambos módulos SPD pero la placa madre los operaba en modo de compatibilidad de canal simple.',
    appliedSolution: 'Mover el segundo módulo a la ranura B2 indicada en el manual. 15.9 GB utilizables en Dual Channel.',
    categoryTag: 'CONFIGURACIÓN / DUAL CHANNEL',
  },
  {
    id: 'case-5',
    title: 'CASO 05 // DISCO AL 100 % CONSTANTE EN ESCRITORIO',
    symptom: 'La máquina tarda 10 minutos en abrir Chrome y el disco no baja de 100% de uso.',
    userBelief: '“Tengo un virus minero o el disco se rompió.”',
    realHypothesis: 'Windows 11 instalado sobre un disco mecánico rígido (HDD) saturado por Windows Search y SysMain.',
    provingTest: 'El Administrador de tareas mostró cola de disco de 4.8 con apenas 1.2 MB/s de tasa de transferencia.',
    appliedSolution: 'Migración del sistema operativo a un SSD SATA/NVMe básico. Tiempo de arranque bajó de 4 minutos a 14 segundos.',
    categoryTag: 'ALMACENAMIENTO / I/O',
  },
  {
    id: 'case-6',
    title: 'CASO 06 // EL JUEGO SE CIERRA SOLO AL ESCRITORIO',
    symptom: 'Cyberpunk 2077 se cierra sin cartel de error exactamente al entrar a zonas densas.',
    userBelief: '“El juego vino mal programado.”',
    realHypothesis: 'Memoria virtual (archivo de paginación pagefile.sys) desactivada manualmente o limitada a 512 MB.',
    provingTest: 'Visor de Eventos registró advertencia "Windows successfully diagnosed a low virtual memory condition".',
    appliedSolution: 'Configurar el archivo de paginación en "Administrado por el sistema". Cero cierres posteriores.',
    categoryTag: 'MEMORIA VIRTUAL / CRASH',
  },
  {
    id: 'case-7',
    title: 'CASO 07 // WINDOWS TARDA 3 MINUTOS EN ARRANCAR',
    symptom: 'Aunque tiene SSD, desde el logo de Windows hasta que responde el mouse pasan minutos.',
    userBelief: '“Hay que reinstalar Windows desde cero.”',
    realHypothesis: '9 aplicaciones habilitadas en inicio automático compitiendo por inicialización simultánea.',
    provingTest: 'Pestaña "Inicio" del Administrador de tareas reveló launchers, software RGB, sincronizadores y Discord.',
    appliedSolution: 'Deshabilitar arranque automático de launchers y utilitarios secundarios. Tiempo de booteo: 18 segundos.',
    categoryTag: 'INICIO / PROCESOS',
  },
  {
    id: 'case-8',
    title: 'CASO 08 // LAG Y TELETRANSPORTACIÓN EN JUEGOS',
    symptom: 'Ping estable de 45 ms pero cada 30 segundos el juego congela y teletransporta personajes.',
    userBelief: '“La placa de red integrada se rompió.”',
    realHypothesis: 'Interferencia intermitente en enlace Wi-Fi de 2.4 GHz por escaneo periódico de redes de Windows.',
    provingTest: 'ping 192.168.1.1 -n 50 mostró 98% de pings a 2 ms y picos repentinos de 600 ms con pérdida de paquetes.',
    appliedSolution: 'Conexión mediante cable Ethernet Cat 6 directo al router. Pérdida de paquetes reducida a 0.0%.',
    categoryTag: 'RED / JITTER WI-FI',
  },
  {
    id: 'case-9',
    title: 'CASO 09 // VENTILADORES AL MÁXIMO EN EL ESCRITORIO',
    symptom: 'Sin ningún juego abierto, los ventiladores suenan como turbina de avión.',
    userBelief: '“El gabinete tiene poco flujo de aire.”',
    realHypothesis: 'Proceso de telemetría o actualización en bucle reteniendo un núcleo de CPU al 100%.',
    provingTest: 'Get-Process en PowerShell ordenado por CPU reveló un proceso "SearchIndexer.exe" consumiendo 25% constante (1 núcleo completo).',
    appliedSolution: 'Reconstrucción del índice de búsqueda desde el Panel de Control. Consumo en reposo bajó a 1%.',
    categoryTag: 'PROCESOS / TELEMETRÍA',
  },
  {
    id: 'case-10',
    title: 'CASO 10 // TECLADO Y MOUSE SE DESCONECTAN 1 SEGUNDO',
    symptom: 'En pleno juego suena el pitido de USB desconectado de Windows y el mouse se congela 1 segundo.',
    userBelief: '“El mouse se rompió por dentro.”',
    realHypothesis: 'Administración de energía de Windows apagando el concentrador USB raíz para ahorrar batería.',
    provingTest: 'Ocurre con cualquier mouse conectado a los puertos USB frontales del gabinete.',
    appliedSolution: 'Desmarcar "Permitir que el equipo apague este dispositivo para ahorrar energía" en Administrador de dispositivos.',
    categoryTag: 'PERIFÉRICOS / ENERGÍA USB',
  },
];

interface WorkshopCasesLibraryProps {
  onSelectCasePrompt?: (promptText: string) => void;
}

export const WorkshopCasesLibrary: React.FC<WorkshopCasesLibraryProps> = ({ onSelectCasePrompt }) => {
  return (
    <div id="biblioteca-casos-taller" className="space-y-6 pt-4">
      <div className="flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-yellow-400" />
        <div>
          <span className="font-mono-tech text-[10px] text-zinc-400 uppercase tracking-widest block">
            ARCHIVO TÉCNICO // APRENDER DE LA EXPERIENCIA
          </span>
          <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
            CASOS REALES DEL TALLER EVO
          </h3>
        </div>
      </div>

      <p className="font-sans-editorial text-sm text-zinc-300 leading-relaxed max-w-3xl">
        Cada uno de estos casos parecía una falla grave o cara al principio.
        En todos ellos, el método deductivo demostró que la causa real era distinta a la primera suposición intuitiva.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WORKSHOP_CASES.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-black/40 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-mono-tech text-[10px] uppercase font-bold">
                  {item.categoryTag}
                </span>
                <span className="text-zinc-500 font-mono-tech text-[10px]">TALLER EVO</span>
              </div>

              <h4 className="font-display font-bold text-white text-base">
                {item.title}
              </h4>

              <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80 font-sans-editorial text-xs text-zinc-300 space-y-1">
                <strong className="text-zinc-400 block text-[10px] font-mono-tech uppercase">SÍNTOMA:</strong>
                <p>{item.symptom}</p>
              </div>

              <div className="space-y-1.5 font-mono-tech text-xs text-zinc-400">
                <div>
                  <span className="text-rose-400 text-[10px] font-bold block">LO QUE SE CREÍA:</span>
                  <p className="italic text-zinc-300 font-sans-editorial">{item.userBelief}</p>
                </div>
                <div>
                  <span className="text-sky-400 text-[10px] font-bold block">CAUSA REAL:</span>
                  <p className="text-zinc-200 font-sans-editorial">{item.realHypothesis}</p>
                </div>
                <div>
                  <span className="text-emerald-400 text-[10px] font-bold block">SOLUCIÓN COMPROBADA:</span>
                  <p className="text-zinc-300 font-sans-editorial">{item.appliedSolution}</p>
                </div>
              </div>
            </div>

            {onSelectCasePrompt && (
              <div className="pt-2 border-t border-zinc-800/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => onSelectCasePrompt(item.symptom)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-yellow-400 hover:text-yellow-300 font-bold uppercase transition-colors cursor-pointer"
                >
                  <span>Cargar caso en el taller</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
