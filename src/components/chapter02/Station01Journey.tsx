import React, { useState } from 'react';
import {
  MousePointerClick,
  Cpu,
  Layers,
  Monitor,
  Tv,
  ArrowDown,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { UserPcSpec } from '../../types';

interface Station01JourneyProps {
  specs: UserPcSpec;
  onComplete: () => void;
  isCompleted: boolean;
}

type JourneyNodeId = 'ENTRADA' | 'CPU' | 'RAM' | 'GPU' | 'PANTALLA';

export const Station01Journey: React.FC<Station01JourneyProps> = ({
  specs,
  onComplete,
  isCompleted,
}) => {
  const [selectedNode, setSelectedNode] = useState<JourneyNodeId>('ENTRADA');
  const [visitedNodes, setVisitedNodes] = useState<Set<JourneyNodeId>>(
    new Set(['ENTRADA'])
  );

  const handleSelectNode = (node: JourneyNodeId) => {
    setSelectedNode(node);
    setVisitedNodes((prev) => new Set([...prev, node]));
  };

  const cpuText = specs?.cpu?.trim?.() || 'tu procesador';
  const gpuText = specs?.gpu?.trim?.() || 'tu tarjeta gráfica';
  const ramText = specs?.ram?.trim?.() || 'la memoria del sistema';

  const nodeDetails: Record<
    JourneyNodeId,
    {
      title: string;
      role: string;
      shortExplanation: string;
      personalizedNote: string;
      hardwareContext: string;
    }
  > = {
    ENTRADA: {
      title: '01. DISPOSITIVO DE ENTRADA / EVENTO',
      role: 'Generación de la señal física o interrupción de software',
      shortExplanation:
        'Mouse, teclado, joystick o una aplicación generan un evento, clic o solicitud física que el controlador de E/S convierte en paquetes de interrupción.',
      personalizedNote:
        'El controlador USB o de periféricos interrumpe a la CPU para notificar que un nuevo paquete de entrada está listo.',
      hardwareContext: 'Controlador USB / Buses E/S',
    },
    CPU: {
      title: '02. PROCESADOR CENTRAL (CPU)',
      role: 'Ejecución de lógica, simulación del mundo y coordinación',
      shortExplanation:
        'Ejecuta lógica, calcula físicas e inteligencia artificial, procesa la pulsación y coordina gran parte del trabajo general.',
      personalizedNote: `En tu máquina, ${cpuText} procesa la física del fotograma y prepara la lista de comandos (Draw Calls) que enviará a la GPU.`,
      hardwareContext: cpuText,
    },
    RAM: {
      title: '03. MEMORIA PRINCIPAL (RAM)',
      role: 'Almacenamiento volátil ultra rápido para datos en vuelo',
      shortExplanation:
        'Mantiene datos, buffers de geometrías, código e instrucciones disponibles inmediatamente para alimentar las cachés del procesador.',
      personalizedNote: `Los datos activos del nivel y las variables se mantienen en ${ramText} para evitar accesos al disco que demorarían miles de veces más.`,
      hardwareContext: ramText,
    },
    GPU: {
      title: '04. PROCESADOR GRÁFICO (GPU)',
      role: 'Cálculo masivo paralelo, shaders y rasterización',
      shortExplanation:
        'Procesa el trabajo gráfico que le corresponde: transforma coordenadas tridimensionales en el espacio, ejecuta shaders y colorea cada píxel.',
      personalizedNote: `En tu equipo, ${gpuText} toma los vértices preparados por la CPU y dibuja la escena en el framebuffer.`,
      hardwareContext: gpuText,
    },
    PANTALLA: {
      title: '05. MONITOR / PANTALLA',
      role: 'Conversión de la señal digital a luz visible',
      shortExplanation:
        'Muestra finalmente la imagen generada, leyendo el búfer de imagen final sincronizado con su tasa de refresco (Hz).',
      personalizedNote:
        'El monitor barre el framebuffer terminado a través de DisplayPort o HDMI, completando el viaje del clic al píxel visible.',
      hardwareContext: specs.monitor?.trim() || 'Panel DisplayPort / HDMI',
    },
  };

  const allVisited = visitedNodes.size >= 5;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-xs font-mono-tech tracking-wider uppercase font-bold">
          <span>ESTACIÓN 01 // EL VIAJE DE UN DATO</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-tight">
          DEL CLIC AL PÍXEL
        </h2>

        {/* The Hook Question */}
        <div className="p-6 rounded-2xl bg-black/60 border border-yellow-400/40 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
          <p className="font-sans-editorial text-lg sm:text-xl text-white font-medium italic leading-relaxed">
            “APRETÁS UNA TECLA. UN INSTANTE DESPUÉS, ALGO CAMBIA EN LA PANTALLA.
            <br />
            <span className="text-yellow-400 font-bold not-italic font-mono-tech block mt-2 text-base sm:text-lg">
              ¿QUÉ PASÓ EN EL MEDIO?
            </span>
          </p>
        </div>
      </div>

      {/* Interactive Pipeline Diagram */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-zinc-300">
            EL VIAJE DEL DATO // PIPELINE INTERACTIVO
          </span>
          <span className="text-[11px] font-mono-tech text-zinc-400">
            Tocá cada estación del viaje ({visitedNodes.size} de 5 exploradas)
          </span>
        </div>

        {/* Nodes Display - Horizontal on desktop, Vertical on mobile */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {(['ENTRADA', 'CPU', 'RAM', 'GPU', 'PANTALLA'] as JourneyNodeId[]).map(
            (nodeId, idx, arr) => {
              const isSelected = selectedNode === nodeId;
              const isVisited = visitedNodes.has(nodeId);

              const icons = {
                ENTRADA: <MousePointerClick className="w-5 h-5" />,
                CPU: <Cpu className="w-5 h-5" />,
                RAM: <Layers className="w-5 h-5" />,
                GPU: <Monitor className="w-5 h-5" />,
                PANTALLA: <Tv className="w-5 h-5" />,
              };

              return (
                <React.Fragment key={nodeId}>
                  <button
                    type="button"
                    onClick={() => handleSelectNode(nodeId)}
                    className={`w-full md:w-auto flex-1 p-4 rounded-xl border text-left transition-all cursor-pointer group relative ${
                      isSelected
                        ? 'bg-yellow-400 text-black border-yellow-400 shadow-xl shadow-yellow-400/15 ring-2 ring-yellow-400/50 scale-[1.02]'
                        : isVisited
                        ? 'bg-zinc-900/90 text-white border-zinc-700 hover:border-yellow-400/60'
                        : 'bg-black/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-mono-tech font-bold uppercase tracking-wider ${
                          isSelected ? 'text-black/80' : 'text-zinc-500 group-hover:text-yellow-400'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <div
                        className={`${
                          isSelected ? 'text-black' : 'text-yellow-400 group-hover:scale-110'
                        } transition-transform`}
                      >
                        {icons[nodeId]}
                      </div>
                    </div>

                    <span
                      className={`font-mono-tech font-black text-sm block tracking-wider uppercase ${
                        isSelected ? 'text-black' : 'text-white'
                      }`}
                    >
                      {nodeId}
                    </span>

                    <span
                      className={`text-[11px] font-sans-editorial block truncate mt-1 ${
                        isSelected ? 'text-black/80 font-medium' : 'text-zinc-400'
                      }`}
                    >
                      {nodeDetails[nodeId].hardwareContext}
                    </span>
                  </button>

                  {idx < arr.length - 1 && (
                    <div className="shrink-0 flex items-center justify-center text-zinc-600 my-1 md:my-0">
                      <ArrowDown className="w-4 h-4 md:hidden text-zinc-500" />
                      <ArrowRight className="w-4 h-4 hidden md:block text-zinc-500" />
                    </div>
                  )}
                </React.Fragment>
              );
            }
          )}
        </div>

        {/* Selected Node Detailed Explanation */}
        <div className="p-5 sm:p-6 rounded-xl bg-black/60 border border-zinc-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
            <span className="text-yellow-400 font-mono-tech text-xs uppercase font-bold tracking-wider">
              {nodeDetails[selectedNode].title}
            </span>
            <span className="text-zinc-500 font-mono-tech text-[11px] uppercase">
              {nodeDetails[selectedNode].role}
            </span>
          </div>

          <p className="font-sans-editorial text-sm sm:text-base text-zinc-200 leading-relaxed">
            {nodeDetails[selectedNode].shortExplanation}
          </p>

          <div className="pt-2 border-t border-zinc-800/80 flex items-start gap-2.5 text-xs font-mono-tech text-zinc-400">
            <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <span className="font-sans-editorial text-zinc-300">
              <strong className="text-white font-mono-tech uppercase">En tu hardware: </strong>
              {nodeDetails[selectedNode].personalizedNote}
            </span>
          </div>
        </div>

        {/* MODELO SIMPLIFICADO NOTICE */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono-tech text-zinc-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-zinc-300 font-bold uppercase tracking-wider block">
              MODELO SIMPLIFICADO DE ORIENTACIÓN
            </span>
            <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
              Las computadoras modernas realizan miles de operaciones simultáneamente en paralelo, con cachés multinivel, controladores de acceso directo (DMA) y colas de comandos asíncronas. Este mapa sirve para comprender el orden y las relaciones fundamentales antes de mirar los detalles internos.
            </p>
          </div>
        </div>
      </div>

      {/* DESCUBRIMIENTO 01 // PRINCIPIO EVO */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-yellow-400/10 via-zinc-900 to-black border-2 border-yellow-400/70 space-y-3">
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono-tech tracking-widest uppercase font-bold">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>DESCUBRIMIENTO 01 // PRINCIPIO FUNDAMENTAL EVO</span>
        </div>

        <blockquote className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight leading-snug">
          “EL RENDIMIENTO NO DEPENDE SOLAMENTE DE QUÉ TAN RÁPIDA ES CADA PIEZA.
          <br />
          <span className="text-yellow-400">
            TAMBIÉN DEPENDE DE QUÉ TAN RÁPIDO PUEDEN TRABAJAR JUNTAS.”
          </span>
        </blockquote>

        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 leading-relaxed">
          Una CPU de última generación conectada a una memoria lenta o mal configurada pasará cientos de ciclos desocupada esperando que los datos lleguen. Una GPU potente sin órdenes preparadas a tiempo estará forzada a esperar en silencio.
        </p>
      </div>

      {/* Advance Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <div className="text-xs font-mono-tech text-zinc-400">
          {allVisited
            ? '✓ Todos los nodos del pipeline explorados. Listo para investigar CPU y memoria.'
            : 'Explorá al menos un nodo para continuar al siguiente bloque.'}
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-white text-black hover:bg-yellow-400 transition-all cursor-pointer shadow-lg hover:shadow-yellow-400/20 group shrink-0"
        >
          <span>{isCompleted ? 'REVISADO • AVANZAR A MEMORIA' : 'SEGUIR EL FLUJO: CPU + RAM'}</span>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
