import React, { useState } from 'react';
import {
  HardDrive,
  Layers,
  Cpu,
  Monitor,
  ArrowRight,
  ArrowDown,
  Layers as Chipset,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { UserPcSpec } from '../../types';

interface Station04StorageProps {
  specs: UserPcSpec;
  onComplete: () => void;
  isCompleted: boolean;
}

export const Station04Storage: React.FC<Station04StorageProps> = ({
  specs,
  onComplete,
  isCompleted,
}) => {
  const [activeMoment, setActiveMoment] = useState<'carga' | 'ejecucion'>('carga');
  const [showDeepArchitecture, setShowDeepArchitecture] = useState<boolean>(false);

  const storageText = specs.storage?.trim() || 'tu disco o SSD';
  const ramText = specs.ram?.trim() || 'la memoria RAM';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-xs font-mono-tech tracking-wider uppercase font-bold">
          <span>ESTACIÓN 04 // ALMACENAMIENTO + RAM</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-tight">
          LOS DATOS NO NACEN EN LA RAM
        </h2>

        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl">
          La memoria RAM es volátil: al apagar la computadora se borra por completo. Por eso, antes de que cualquier byte sea procesado, debe viajar desde las pistas magnéticas o las celdas flash de tu almacenamiento permanente.
        </p>

        {specs.storage && (
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-xs font-mono-tech text-zinc-300">
            <span className="text-yellow-400 font-bold uppercase">En tu máquina: </span>
            Los archivos residen en <span className="text-white font-bold">{storageText}</span> y se transfieren a{' '}
            <span className="text-white font-bold">{ramText}</span> cada vez que iniciás el sistema o abrís una aplicación.
          </div>
        )}
      </div>

      {/* Visual Pipeline: SSD/HDD -> RAM -> CPU/GPU */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-zinc-300">
            RUTA FUNDAMENTAL DEL ALMACENAMIENTO
          </span>
          <span className="text-[11px] font-mono-tech text-zinc-400">
            De la persistencia al procesamiento en caliente
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Step 1: Storage */}
          <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2 text-center">
            <HardDrive className="w-8 h-8 text-yellow-400 mx-auto" />
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-white block">
              01. SSD / HDD
            </span>
            <span className="text-[11px] font-mono-tech text-zinc-500 uppercase block">
              GIGABYTES PERMANENTES
            </span>
            <p className="font-sans-editorial text-xs text-zinc-400 leading-snug">
              Archivos ejecutables, texturas comprimidas, librerías y datos de guardado en reposo permanente.
            </p>
          </div>

          {/* Step 2: RAM */}
          <div className="p-5 rounded-xl bg-black/60 border border-yellow-400/40 space-y-2 text-center relative">
            <Layers className="w-8 h-8 text-yellow-400 mx-auto" />
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-white block">
              02. MEMORIA RAM
            </span>
            <span className="text-[11px] font-mono-tech text-yellow-400 uppercase block">
              DESCOMPRESIÓN & BUFFER ACTIVO
            </span>
            <p className="font-sans-editorial text-xs text-zinc-300 leading-snug">
              Recibe los bloques descomprimidos y mantiene las estructuras activas accesibles a nanosegundos.
            </p>
          </div>

          {/* Step 3: CPU / GPU */}
          <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Cpu className="w-6 h-6" />
              <Monitor className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-white block">
              03. CPU / GPU
            </span>
            <span className="text-[11px] font-mono-tech text-zinc-500 uppercase block">
              CÓMPUTO & RENDERIZADO
            </span>
            <p className="font-sans-editorial text-xs text-zinc-400 leading-snug">
              Consumen datos listos directamente desde la RAM o los transfieren a la VRAM gráfica.
            </p>
          </div>
        </div>
      </div>

      {/* DISTINGUIR DOS MOMENTOS: CARGA VS EJECUCIÓN */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-zinc-300">
            DISTINGUIR DOS MOMENTOS CRUCIALES
          </span>
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/60 border border-zinc-800 font-mono-tech text-xs">
            <button
              type="button"
              onClick={() => setActiveMoment('carga')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                activeMoment === 'carga' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              MOMENTO 1: CARGA
            </button>
            <button
              type="button"
              onClick={() => setActiveMoment('ejecucion')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                activeMoment === 'ejecucion' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              MOMENTO 2: EJECUCIÓN
            </button>
          </div>
        </div>

        {activeMoment === 'carga' ? (
          <div className="p-6 rounded-xl bg-black/60 border border-yellow-400/40 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs uppercase font-bold">
              <span>FASE A // CARGA INICIAL DE DATOS</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white uppercase">
              ABRIR APLICACIÓN, CARGAR MAPAS Y LEER ARCHIVOS
            </h3>
            <p className="font-sans-editorial text-zinc-300 text-sm leading-relaxed">
              Durante la carga, el almacenamiento es el protagonista casi absoluto: se leen cientos de megabytes o gigabytes por segundo. Un SSD NVMe veloz puede reducir una pantalla de carga de 60 segundos a sólo 6 segundos.
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono-tech text-zinc-300">
              <strong className="text-yellow-400">PRINCIPIO CLAVE:</strong> Un SSD más rápido reduce drásticamente los tiempos de carga iniciales. <em>Eso NO significa automáticamente que aumente los FPS promedio una vez que todo el escenario ya está cargado en la memoria RAM.</em>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-black/60 border border-yellow-400/40 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs uppercase font-bold">
              <span>FASE B // EJECUCIÓN ACTIVA</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white uppercase">
              PROCESAR LÓGICA, RENDERIZAR Y RESPONDER AL USUARIO
            </h3>
            <p className="font-sans-editorial text-zinc-300 text-sm leading-relaxed">
              Una vez cargada la partida o el proyecto, la CPU y la GPU trabajan casi exclusivamente con los datos ya alojados en la RAM y la VRAM. El uso de disco cae abruptamente hacia niveles mínimos.
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono-tech text-zinc-300">
              <strong className="text-yellow-400">LA EXCEPCIÓN DEL STREAMING:</strong> En juegos de mundo abierto (Open World) con mapas inmensos, el juego lee assets continuamente en segundo plano a medida que te desplazás. Si el almacenamiento es un HDD mecánico o está saturado por descargas, esta transferencia puede provocar tirones (<em>asset streaming stutter</em>) temporales.
            </div>
          </div>
        )}
      </div>

      {/* MITO VS EVIDENCIA */}
      <div className="p-5 sm:p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400">
            MITO VS EVIDENCIA // SSD Y FPS
          </span>
          <span className="text-[10px] font-mono-tech text-zinc-500 uppercase">
            DESMITIFICACIÓN EVO
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
          <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-1">
            <span className="text-red-400 font-bold uppercase block text-[10px]">EL MITO:</span>
            <p className="font-sans-editorial text-zinc-300 text-xs">
              “Cambiar un disco duro HDD por un SSD NVMe ultra veloz siempre aumenta automáticamente los FPS máximos de mi PC.”
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1">
            <span className="text-emerald-400 font-bold uppercase block text-[10px]">LA EVIDENCIA:</span>
            <p className="font-sans-editorial text-zinc-300 text-xs">
              “El cambio mejora radicalmente los tiempos de inicio de Windows, tiempos de acceso y pantallas de carga. Su efecto sobre los FPS promedio sostenidos es marginal, salvo que existiera stuttering por streaming de texturas.”
            </p>
          </div>
        </div>
      </div>

      {/* LA PLACA BASE COMO INFRAESTRUCTURA */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs uppercase font-bold">
          <Chipset className="w-4 h-4" />
          <span>LA PLACA BASE // INFRAESTRUCTURA DE INTERCONEXIÓN</span>
        </div>

        <h3 className="font-display font-bold text-xl text-white uppercase">
          NO TODO ES UN SIMPLE CABLE
        </h3>

        <p className="font-sans-editorial text-sm text-zinc-300 leading-relaxed">
          En las computadoras suele usarse la palabra “bus” de manera genérica, pero la realidad de una plataforma moderna es mucho más rica:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono-tech">
          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
            <span className="text-yellow-400 font-bold uppercase text-[10px] block">LÍNEAS PCIE DIRECTAS</span>
            <p className="text-zinc-300 text-xs font-sans-editorial">
              Conectan directamente el slot principal de la GPU y el primer puerto SSD M.2 con los pines del procesador.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
            <span className="text-yellow-400 font-bold uppercase text-[10px] block">CHIPSET / PUENTE</span>
            <p className="text-zinc-300 text-xs font-sans-editorial">
              Concentrador que agrupa puertos SATA, USB, audio, red y ranuras secundarias, compartiendo un enlace único hacia la CPU.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
            <span className="text-yellow-400 font-bold uppercase text-[10px] block">CONTROLADORES DEDICADOS</span>
            <p className="text-zinc-300 text-xs font-sans-editorial">
              Chips específicos que gestionan periféricos, audio de alta definición y controladores de almacenamiento sin saturar a la CPU.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
            <span className="text-yellow-400 font-bold uppercase text-[10px] block">VRM / ENERGÍA</span>
            <p className="text-zinc-300 text-xs font-sans-editorial">
              Módulos de regulación de voltaje que transforman los 12V de la fuente en el milivoltaje exacto y estable que requiere el silicio.
            </p>
          </div>
        </div>
      </div>

      {/* CAPA 2 // PROFUNDIZAR // ARQUITECTURA DEL FLUJO (DESPLEGABLE OPCIONAL) */}
      <div className="p-5 rounded-2xl bg-black/50 border border-zinc-800 space-y-3">
        <button
          type="button"
          onClick={() => setShowDeepArchitecture(!showDeepArchitecture)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-zinc-300 group-hover:text-yellow-400 transition-colors">
            <span className="w-2 h-2 bg-yellow-400 inline-block" />
            <span>CAPA 2 // PROFUNDIZAR: GLOSARIO DE ARQUITECTURA DEL FLUJO (OPCIONAL)</span>
          </div>
          <div className="text-zinc-400 group-hover:text-white transition-colors">
            {showDeepArchitecture ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDeepArchitecture && (
          <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech animate-in fade-in duration-200">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px] uppercase">CACHÉ L1 / L2 / L3</span>
              <p className="font-sans-editorial text-zinc-300 text-xs">
                SRAM ultrarrápida integrada en el silicio que almacena temporalmente los datos e instrucciones más frecuentes para reducir las esperas hacia la memoria RAM externa.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px] uppercase">CONTROLADOR DE MEMORIA (IMC)</span>
              <p className="font-sans-editorial text-zinc-300 text-xs">
                Circuito dentro de la CPU que orquesta los ciclos de lectura/escritura hacia los módulos RAM, gobernando la frecuencia, voltajes y canales de memoria.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px] uppercase">PCI EXPRESS (PCIE)</span>
              <p className="font-sans-editorial text-zinc-300 text-xs">
                Interconexión punto a punto de altísima velocidad basada en carriles serie (lanes x1 a x16) que vincula directamente la GPU y los discos SSD NVMe con la CPU.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px] uppercase">VRAM (MEMORIA DE VIDEO)</span>
              <p className="font-sans-editorial text-zinc-300 text-xs">
                Memoria de ancho de banda masivo soldada en la tarjeta gráfica para alimentar instantáneamente los miles de núcleos de sombreado con texturas y geometría.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px] uppercase">MEMORIA COMPARTIDA</span>
              <p className="font-sans-editorial text-zinc-300 text-xs">
                Porción de la memoria RAM del sistema direccionable por el controlador gráfico cuando la VRAM dedicada se satura o cuando se utiliza una GPU integrada.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px] uppercase">DMA (DIRECT MEMORY ACCESS)</span>
              <p className="font-sans-editorial text-zinc-300 text-xs">
                Capacidad de los dispositivos de almacenamiento y periféricos para transferir datos directamente hacia la RAM sin tener que consumir ciclos de procesamiento de la CPU.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 md:col-span-2">
              <span className="text-yellow-400 font-bold block text-[10px] uppercase">COLAS DE TRABAJO (QUEUES)</span>
              <p className="font-sans-editorial text-zinc-300 text-xs">
                Buffers secuenciales donde las instrucciones pendientes esperan su turno de ejecución, garantizando que el hardware nunca se quede inactivo entre llamadas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Advance Button to Station 05 (Lab) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <div className="text-xs font-mono-tech text-zinc-400">
          La teoría del flujo está clara. Ahora vamos a ver cómo se comporta tu propia máquina en tiempo real.
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-white text-black hover:bg-yellow-400 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group shrink-0"
        >
          <span>{isCompleted ? 'REVISADO • IR AL LABORATORIO' : 'IR AL LABORATORIO: SEGUÍ EL FLUJO'}</span>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
