import React, { useState } from 'react';
import {
  Monitor,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Zap,
  ArrowRight,
  Shield,
  Eye,
  Sliders,
  Tv,
} from 'lucide-react';

export const Sector18VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'HYBRID_TOPOLOGY' | 'FLIP_MODEL_PRESENTATION' | 'TDR_PIPELINE' | 'COLOR_PIPELINE'
  >('HYBRID_TOPOLOGY');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Monitor className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 18</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              PIPELINE GRÁFICO, DWM, COMPOSICIÓN Y SALIDA DE PANTALLA
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Topología híbrida MUX, presentación Flip Model sin copias intermedias, rescate por TDR y canal de color SDR/HDR
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('HYBRID_TOPOLOGY')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'HYBRID_TOPOLOGY'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Topología iGPU/dGPU
            </button>
            <button
              onClick={() => setActiveDiagram('FLIP_MODEL_PRESENTATION')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'FLIP_MODEL_PRESENTATION'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Modern Flip Model
            </button>
            <button
              onClick={() => setActiveDiagram('TDR_PIPELINE')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'TDR_PIPELINE'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Rescate TDR (Watchdog)
            </button>
            <button
              onClick={() => setActiveDiagram('COLOR_PIPELINE')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'COLOR_PIPELINE'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              4. Canal SDR vs HDR10
            </button>
          </div>
        </div>

        {/* Diagram 1: Hybrid Topology */}
        {activeDiagram === 'HYBRID_TOPOLOGY' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[TOPOLOGÍA ÓPTIMUS vs MUX SWITCH]:</strong> En notebooks estándar, la GPU dedicada (dGPU) no está conectada físicamente al panel; debe escribir en la memoria del sistema a través del bus PCIe para que la GPU integrada (iGPU) realice el refresco final de pantalla.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">dGPU (Dedicada)</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">Render 3D</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>- Procesa vértices y shaders a 140 FPS</div>
                  <div>- Escribe en backbuffer VRAM</div>
                  <div>- Copia vía PCIe Host-to-Device</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">Cuello de Botella PCIe</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">Copia de Frames</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>- Latencia agregada: +2 a 5 ms</div>
                  <div>- Consumo de ancho de banda PCIe</div>
                  <div>- MUX Switch elimina este paso</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">iGPU (Integrada)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">Display Scanout</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>- Transceiver físico conectado al panel</div>
                  <div>- Sincronización vertical eDP</div>
                  <div>- Mantiene el escritorio de bajo consumo</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 2: Flip Model */}
        {activeDiagram === 'FLIP_MODEL_PRESENTATION' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[MODERN FLIP vs BITBLT LEGACY]:</strong> El modelo clásico BitBlt copiaba píxeles al buffer de DWM antes de enviarlos a la pantalla. Modern Flip (FLIP_DISCARD) entrega el swap chain directamente al hardware de escaneo, permitiendo VRR y cero latencia de copia.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/30 space-y-2">
                <div className="text-rose-400 font-mono font-bold text-xs uppercase">BitBlt Legacy (Ventana Clásica)</div>
                <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">1. App renderiza en Backbuffer</div>
                  <div className="p-2 bg-rose-950/40 rounded border border-rose-800/40 text-rose-200">2. Copia intermedia a memoria de DWM (+1 cuadro de lag)</div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">3. DWM compone con otras ventanas y scanout</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/30 space-y-2">
                <div className="text-emerald-400 font-mono font-bold text-xs uppercase">Modern Flip Model (Bypass Directo)</div>
                <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">1. App renderiza en SwapChain Flip</div>
                  <div className="p-2 bg-emerald-950/40 rounded border border-emerald-800/40 text-emerald-200">2. DWM cede el scanout directamente a la GPU</div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">3. Latencia idéntica a pantalla exclusiva + Alt+Tab veloz</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 3: TDR Pipeline */}
        {activeDiagram === 'TDR_PIPELINE' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[TDR - TIMEOUT DETECTION AND RECOVERY]:</strong> WDDM monitorea los paquetes en la cola de la GPU. Si un comando no termina en 2 segundos, watchdog.sys interviene, resetea el planificador de la GPU y rescata el escritorio de Windows sin provocar pantallazo azul (BSOD).
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-cyan-400 font-bold">1. Envío</div>
                <div className="text-[11px] text-slate-400">Kernel envía paquete de comandos 3D a la GPU.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-amber-800/40 rounded-xl space-y-1">
                <div className="text-amber-400 font-bold">2. Timeout (2s)</div>
                <div className="text-[11px] text-slate-400">watchdog.sys detecta que la GPU no reportó finalización.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-cyan-800/40 rounded-xl space-y-1">
                <div className="text-cyan-400 font-bold">3. Reset Driver</div>
                <div className="text-[11px] text-slate-400">dxgkrnl resetea el contexto del adaptador. Pantalla negra 1s.</div>
              </div>
              <div className="p-3 bg-slate-950 border border-emerald-800/40 rounded-xl space-y-1">
                <div className="text-emerald-400 font-bold">4. Restauración</div>
                <div className="text-[11px] text-slate-400">DWM reconstruye las superficies y el usuario continúa trabajando.</div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: Color Pipeline */}
        {activeDiagram === 'COLOR_PIPELINE' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[CANAL DE COLOR SDR vs HDR10]:</strong> Comparación técnica entre el contenedor sRGB de 8 bits y el pipeline ST.2084 (PQ) de 10/12 bits con metadatos de luminancia para monitores con brillo extendido.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 font-mono font-bold text-xs">SDR (Estándar BT.709)</div>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>Profundidad: 8 bits por canal (16.7 millones de colores).</li>
                  <li>Curva Gamma 2.2 con rango nominal de 100 nits.</li>
                  <li>Bandas visibles (banding) en cielos y degradados sutiles.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-2">
                <div className="text-emerald-400 font-mono font-bold text-xs">HDR10 (Espacio BT.2020 / ST.2084)</div>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>Profundidad: 10 o 12 bits por canal (1070 millones de colores).</li>
                  <li>Curva PQ perceptual con picos de hasta 10.000 nits.</li>
                  <li>Tone mapping calibrado con la app oficial de Windows.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
