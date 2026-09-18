import React, { useState } from 'react';
import {
  Layers,
  Zap,
  Clock,
  Truck,
  Car,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { UserPcSpec, UserPcEvidenceMap } from '../../types';

interface Station02MemoryProps {
  specs: UserPcSpec;
  evidenceMap?: UserPcEvidenceMap;
  onComplete: () => void;
  isCompleted: boolean;
}

export const Station02Memory: React.FC<Station02MemoryProps> = ({
  specs,
  evidenceMap,
  onComplete,
  isCompleted,
}) => {
  const [selectedHierarchy, setSelectedHierarchy] = useState<'registros' | 'cache' | 'ram' | 'disco'>('cache');
  const [analogiaTab, setAnalogiaTab] = useState<'latencia' | 'ancho_de_banda'>('latencia');

  const cpuText = specs.cpu?.trim() || 'tu procesador';
  const ramText = specs.ram?.trim() || 'tu memoria RAM';
  const gpuText = specs.gpu?.trim() || '';

  // Check if integrated graphics might be present
  const isIntegratedSuspected =
    /intel.*(uhd|hd|iris)|radeon.*(vega|graphics)|integrated/i.test(gpuText) ||
    /intel.*(uhd|hd|iris)|radeon.*(vega|graphics)|integrated/i.test(cpuText);

  // Check channel mode from evidence details if available
  const channelModeReported = evidenceMap?.ram.details?.channelMode as string | undefined;
  const channelModeDisplay = channelModeReported?.trim() || 'NO DETERMINADO';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-xs font-mono-tech tracking-wider uppercase font-bold">
          <span>ESTACIÓN 02 // CPU + RAM</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-tight">
          CUANDO EL PROCESADOR NECESITA DATOS
        </h2>

        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl">
          El procesador es capaz de realizar miles de millones de operaciones matemáticas por segundo. Sin embargo, su mayor enemigo no es la complejidad del cálculo, sino la distancia hasta donde están guardados los números que debe sumar.
        </p>

        {specs.cpu && specs.ram && (
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-xs font-mono-tech text-zinc-300">
            <span className="text-yellow-400 font-bold uppercase">En tu máquina: </span>
            <span className="text-white font-bold">{cpuText}</span> debe buscar continuamente sus instrucciones en{' '}
            <span className="text-white font-bold">{ramText}</span> atravesando el controlador de memoria integrado.
          </div>
        )}
      </div>

      {/* Jerarquía de memoria */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-zinc-300">
            LA PIRÁMIDE DE DISTANCIAS // JERARQUÍA DE MEMORIA
          </span>
          <span className="text-[11px] font-mono-tech text-zinc-400">
            Seleccioná un estrato para ver velocidad vs capacidad
          </span>
        </div>

        {/* Hierarchy steps visual */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
          <button
            type="button"
            onClick={() => setSelectedHierarchy('registros')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedHierarchy === 'registros'
                ? 'bg-yellow-400 text-black border-yellow-400 font-bold shadow-lg ring-2 ring-yellow-400/40'
                : 'bg-black/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1 text-[10px] uppercase opacity-70">
              <span>Nivel 01</span>
              <span>~0.5 ns</span>
            </div>
            <span className="font-black text-sm uppercase block">REGISTROS</span>
            <span className="text-[11px] opacity-80 block mt-1">Dentro del núcleo CPU</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedHierarchy('cache')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedHierarchy === 'cache'
                ? 'bg-yellow-400 text-black border-yellow-400 font-bold shadow-lg ring-2 ring-yellow-400/40'
                : 'bg-black/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1 text-[10px] uppercase opacity-70">
              <span>Nivel 02</span>
              <span>1 - 12 ns</span>
            </div>
            <span className="font-black text-sm uppercase block">CACHÉ L1 / L2 / L3</span>
            <span className="text-[11px] opacity-80 block mt-1">En el encapsulado de CPU</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedHierarchy('ram')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedHierarchy === 'ram'
                ? 'bg-yellow-400 text-black border-yellow-400 font-bold shadow-lg ring-2 ring-yellow-400/40'
                : 'bg-black/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1 text-[10px] uppercase opacity-70">
              <span>Nivel 03</span>
              <span>50 - 80 ns</span>
            </div>
            <span className="font-black text-sm uppercase block">MEMORIA RAM</span>
            <span className="text-[11px] opacity-80 block mt-1">Módulos en placa madre</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedHierarchy('disco')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedHierarchy === 'disco'
                ? 'bg-yellow-400 text-black border-yellow-400 font-bold shadow-lg ring-2 ring-yellow-400/40'
                : 'bg-black/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1 text-[10px] uppercase opacity-70">
              <span>Nivel 04</span>
              <span>20.000 - 10.000.000 ns</span>
            </div>
            <span className="font-black text-sm uppercase block">ALMACENAMIENTO</span>
            <span className="text-[11px] opacity-80 block mt-1">SSD NVMe / SATA / HDD</span>
          </button>
        </div>

        {/* Hierarchy details panel */}
        <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
          {selectedHierarchy === 'registros' && (
            <>
              <div className="text-yellow-400 font-mono-tech text-xs uppercase font-bold">
                REGISTROS INTERNOS // TIEMPO DE RESPUESTA: INMEDIATO (&lt;1 CICLO)
              </div>
              <p className="font-sans-editorial text-zinc-300 text-sm leading-relaxed">
                Son las celdas de almacenamiento físico más diminutas, ubicadas directamente dentro de las unidades lógicas y aritméticas (ALU). Su capacidad total suele ser de apenas unos pocos kilobytes, pero responden al mismo ritmo de los gigahercios del procesador.
              </p>
            </>
          )}

          {selectedHierarchy === 'cache' && (
            <>
              <div className="text-yellow-400 font-mono-tech text-xs uppercase font-bold">
                CACHÉ L1, L2 Y L3 // EL AMORTIGUADOR SILENCIOSO
              </div>
              <p className="font-sans-editorial text-zinc-300 text-sm leading-relaxed">
                La CPU posee cachés extremadamente rápidas pero de tamaño reducido (desde unos 64 KB de L1 por núcleo hasta decenas de MB de L3 compartida). Cuando la información solicitada se encuentra en la caché (un <em>cache hit</em>), el procesador casi no pierde tiempo. Cuando no está allí (un <em>cache miss</em>), debe frenar y pedir auxilio a la RAM.
              </p>
            </>
          )}

          {selectedHierarchy === 'ram' && (
            <>
              <div className="text-yellow-400 font-mono-tech text-xs uppercase font-bold">
                MEMORIA PRINCIPAL (DRAM) // EL GRAN ESPACIO DE TRABAJO
              </div>
              <p className="font-sans-editorial text-zinc-300 text-sm leading-relaxed">
                Ofrece decenas de gigabytes de capacidad para albergar el sistema operativo y las aplicaciones activas. Sin embargo, para la escala temporal de la CPU, los 50 a 80 nanosegundos que tarda en llegar un dato desde la RAM equivalen a cientos de ciclos de inactividad obligada.
              </p>
            </>
          )}

          {selectedHierarchy === 'disco' && (
            <>
              <div className="text-yellow-400 font-mono-tech text-xs uppercase font-bold">
                ALMACENAMIENTO NO VOLÁTIL // LA BIBLIOTECA PERMANENTE
              </div>
              <p className="font-sans-editorial text-zinc-300 text-sm leading-relaxed">
                Incluso el SSD NVMe más moderno del mundo tarda unas 20 a 50 microsegundos en entregar su primer bloque (unas 500 a 1000 veces más lento que la RAM). Si la CPU tuviera que esperar directamente al disco sin pasar por la RAM, el sistema se congelaría por completo.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Latencia vs Ancho de Banda */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-zinc-300">
            PIEZA EDITORIAL // LATENCIA VS ANCHO DE BANDA
          </span>
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/60 border border-zinc-800 font-mono-tech text-xs">
            <button
              type="button"
              onClick={() => setAnalogiaTab('latencia')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                analogiaTab === 'latencia' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              LATENCIA
            </button>
            <button
              type="button"
              onClick={() => setAnalogiaTab('ancho_de_banda')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                analogiaTab === 'ancho_de_banda' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ANCHO DE BANDA
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Visual card for latency */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              analogiaTab === 'latencia'
                ? 'bg-black/80 border-yellow-400 shadow-xl shadow-yellow-400/10'
                : 'bg-black/40 border-zinc-800 opacity-70'
            } space-y-3`}
          >
            <div className="flex items-center gap-3 text-yellow-400">
              <Clock className="w-5 h-5" />
              <span className="font-mono-tech font-bold text-sm tracking-wider uppercase">
                LATENCIA (EL TIEMPO DE REACCIÓN)
              </span>
            </div>
            <p className="font-display font-bold text-lg text-white">
              ¿Cuánto tarda en llegar el primer dato?
            </p>
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-mono-tech text-zinc-300 flex items-center gap-3">
              <Car className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>
                <strong>ANALOGÍA:</strong> El tiempo que demora en llegar el primer vehículo desde que se le dio la orden de salida.
              </span>
            </div>
            <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
              En memorias se mide en nanosegundos (ns) o ciclos de reloj (CL / CAS Latency). Es crucial para tareas impredecibles como la lógica de un juego o físicas.
            </p>
          </div>

          {/* Visual card for bandwidth */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              analogiaTab === 'ancho_de_banda'
                ? 'bg-black/80 border-yellow-400 shadow-xl shadow-yellow-400/10'
                : 'bg-black/40 border-zinc-800 opacity-70'
            } space-y-3`}
          >
            <div className="flex items-center gap-3 text-yellow-400">
              <Truck className="w-5 h-5" />
              <span className="font-mono-tech font-bold text-sm tracking-wider uppercase">
                ANCHO DE BANDA (EL VOLUMEN DE CARGA)
              </span>
            </div>
            <p className="font-display font-bold text-lg text-white">
              ¿Cuántos datos pueden moverse durante un período?
            </p>
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-mono-tech text-zinc-300 flex items-center gap-3">
              <Truck className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>
                <strong>ANALOGÍA:</strong> La cantidad de camiones y carga total que la autopista puede transportar por hora.
              </span>
            </div>
            <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
              Se expresa en GB/s o transferencias por segundo (MT/s). Es vital para mover grandes bloques contiguos de texturas, video y buffers gráficos.
            </p>
          </div>
        </div>
      </div>

      {/* ¿SABÍAS QUE...? & CANALES DE MEMORIA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Curiosidad técnica: MT/s vs MHz */}
        <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs uppercase font-bold">
            <Zap className="w-4 h-4" />
            <span>¿SABÍAS QUE...? // MT/S VS MHZ</span>
          </div>

          <p className="font-sans-editorial text-sm sm:text-base text-zinc-200 leading-relaxed">
            DDR5-4800 o DDR4-3200 expresa una tasa efectiva de transferencia de aproximadamente <strong>4800 MT/s</strong> o <strong>3200 MT/s</strong> (Megatransferencias por segundo).
          </p>

          <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
            Las memorias DDR (<em>Double Data Rate</em>) transmiten datos tanto en el flanco de subida como en el de bajada de la señal de reloj. Por lo tanto, un módulo a 3200 MT/s opera internamente con un reloj real de 1600 MHz. <strong>MT/s y MHz no son exactamente lo mismo.</strong>
          </p>
        </div>

        {/* Canales de memoria: Rigor obligatorio */}
        <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs uppercase font-bold">
              <Layers className="w-4 h-4" />
              <span>CANALES DE MEMORIA // RUTAS SIMULTÁNEAS</span>
            </div>
            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
              ESTADO: {channelModeDisplay}
            </span>
          </div>

          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Un solo canal (<strong>Single Channel</strong>) ofrece un ancho de bus de 64 bits hacia la CPU. Al habilitar <strong>Dual Channel</strong>, el controlador duplica el ancho del bus a 128 bits (o dos canales independientes de 32 bits en DDR5), permitiendo duplicar el ancho de banda teórico.
          </p>

          <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 text-xs font-mono-tech text-zinc-400 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">RIGOR EDITORIAL EVO:</strong> No determinamos automáticamente Dual Channel únicamente porque existan dos módulos físicos en el gabinete. Requiere que estén instalados en las ranuras emparejadas designadas por el fabricante de la placa madre.
            </span>
          </div>
        </div>
      </div>

      {/* CASO ESPECIAL // GRÁFICOS INTEGRADOS */}
      {isIntegratedSuspected && (
        <div className="p-6 rounded-2xl bg-yellow-400/5 border border-yellow-400/40 space-y-3">
          <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs uppercase font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>CASO ESPECIAL // GRÁFICOS INTEGRADOS DETECTADOS</span>
          </div>

          <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed">
            Una GPU integrada suele utilizar la propia memoria del sistema (RAM) para almacenar texturas, geometrías y su framebuffer de salida.
          </p>

          <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
            Por esta razón, la velocidad de la RAM y la activación de canales paralelos (Dual Channel) afecta dramáticamente el rendimiento en juegos y aplicaciones 3D en máquinas con gráficos integrados: el procesador central y el gráfico deben competir por el mismo ancho de banda de la memoria del sistema.
          </p>

          <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 text-[11px] font-mono-tech text-zinc-400">
            <strong className="text-yellow-400">PRECISIÓN: </strong>
            No toda la memoria compartida mostrada por Windows está reservada de forma permanente; el sistema operativo asigna y libera espacio dinámicamente según la demanda gráfica del momento.
          </div>
        </div>
      )}

      {/* MITO VS EVIDENCIA */}
      <div className="p-5 sm:p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400">
            MITO VS EVIDENCIA // LA VELOCIDAD DE MEMORIA
          </span>
          <span className="text-[10px] font-mono-tech text-zinc-500 uppercase">
            DESMITIFICACIÓN EVO
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
          <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-1">
            <span className="text-red-400 font-bold uppercase block text-[10px]">EL MITO:</span>
            <p className="font-sans-editorial text-zinc-300 text-xs">
              “Más MHz o más MT/s en la RAM siempre significa automáticamente más FPS en todos los juegos.”
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1">
            <span className="text-emerald-400 font-bold uppercase block text-[10px]">LA EVIDENCIA:</span>
            <p className="font-sans-editorial text-zinc-300 text-xs">
              “El rendimiento de memoria depende del balance entre latencia efectiva (CL), cantidad de canales activos, controlador de memoria en la CPU, tamaño de la caché L3 y la naturaleza de la carga.”
            </p>
          </div>
        </div>
      </div>

      {/* Advance Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <div className="text-xs font-mono-tech text-zinc-400">
          Entendiste cómo la memoria alimenta a la CPU. Siguiente paso: la relación entre procesador y gráficos.
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-white text-black hover:bg-yellow-400 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group shrink-0"
        >
          <span>{isCompleted ? 'REVISADO • AVANZAR A GRÁFICOS' : 'SEGUIR EL FLUJO: CPU + GPU'}</span>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
