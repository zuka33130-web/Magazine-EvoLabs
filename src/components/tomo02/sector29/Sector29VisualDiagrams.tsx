import React, { useState } from "react";
import {
  Activity,
  Zap,
  Gauge,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export const Sector29VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"PIPELINE" | "LATENCY_GAUGE" | "PACING_COMPARISON">("PIPELINE");
  const [interactiveLatency, setInteractiveLatency] = useState<number>(350);

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#080B10] p-5 my-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Laboratorio Visual: Arquitectura de Latencia DPC/ISR y Frame Pacing
          </h4>
        </div>
        <div className="flex rounded-lg bg-zinc-900/80 p-1 border border-zinc-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("PIPELINE")}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "PIPELINE"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Pipeline DPC/ISR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("LATENCY_GAUGE")}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "LATENCY_GAUGE"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Umbrales LatencyMon
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PACING_COMPARISON")}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === "PACING_COMPARISON"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            FPS vs Frametime
          </button>
        </div>
      </div>

      {activeTab === "PIPELINE" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            La secuencia en microsegundos que recorre cualquier evento de hardware antes de que tu aplicación reciba el control:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase">FASE 1: HARDWARE</div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Interrupción MSI-X
              </div>
              <p className="text-[11px] text-zinc-400">
                Paquete de datos en carril PCIe. Despierta al controlador APIC local.
              </p>
              <span className="text-[10px] font-mono text-amber-400 block pt-1">Duración: &lt; 2 µs</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-500/30 space-y-1.5">
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">FASE 2: DIRQL (3-11)</div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Rutina ISR
              </div>
              <p className="text-[11px] text-zinc-400">
                Reconoce la señal, silencia la alarma física y encola la estructura KDPC en el core.
              </p>
              <span className="text-[10px] font-mono text-cyan-300 block pt-1">Presupuesto: &lt; 25 µs</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-purple-500/30 space-y-1.5">
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">FASE 3: DISPATCH (2)</div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Rutina DPC
              </div>
              <p className="text-[11px] text-zinc-400">
                Copia buffers y procesa la I/O pesada. Prioridad absoluta sobre modo usuario.
              </p>
              <span className="text-[10px] font-mono text-purple-300 block pt-1">Presupuesto: &lt; 100 µs</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-1.5">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">FASE 4: PASSIVE (0)</div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                App / Render Thread
              </div>
              <p className="text-[11px] text-zinc-400">
                El scheduler reanuda el juego o DAW de audio. Si la DPC tardó 2ms, ¡aquí ocurre el tirón!
              </p>
              <span className="text-[10px] font-mono text-emerald-400 block pt-1">Entrega de Cuadro</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "LATENCY_GAUGE" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                Simulador de Carga DPC en Tiempo Real
              </span>
              <p className="text-xs text-zinc-400">
                Ajusta el tiempo de ejecución reportado por el driver para comprobar el veredicto técnico:
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={interactiveLatency}
                onChange={(e) => setInteractiveLatency(Number(e.target.value))}
                className="w-40 sm:w-56 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono font-bold text-sm text-cyan-300 w-20 text-right">
                {interactiveLatency} µs
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`p-4 rounded-xl border transition-all ${
              interactiveLatency < 500
                ? "bg-emerald-950/20 border-emerald-500/60 ring-2 ring-emerald-500/30"
                : "bg-zinc-950/50 border-zinc-800 opacity-50"
            }`}>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 mb-1">
                <span>&lt; 500 µs // ÓPTIMO</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-300">
                Apto para audio profesional de baja latencia (buffer 64/128) y gaming competitivo a 240+ Hz con frame pacing plano.
              </p>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              interactiveLatency >= 500 && interactiveLatency <= 1000
                ? "bg-amber-950/20 border-amber-500/60 ring-2 ring-amber-500/30"
                : "bg-zinc-950/50 border-zinc-800 opacity-50"
            }`}>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 mb-1">
                <span>500 - 1000 µs // ALERTA</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-300">
                Riesgo de micro-stuttering intermitente en cargas pesadas. Requiere elevar búfer de audio a 256/512 muestras.
              </p>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              interactiveLatency > 1000
                ? "bg-red-950/20 border-red-500/60 ring-2 ring-red-500/30"
                : "bg-zinc-950/50 border-zinc-800 opacity-50"
            }`}>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-red-400 mb-1">
                <span>&gt; 1000 µs // CRÍTICO</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-xs text-zinc-300">
                Chasquidos de audio (dropouts) garantizados y tirones visibles en pantalla. El driver infractor debe ser actualizado o aislado.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "PACING_COMPARISON" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            La falacia del promedio de FPS frente a la realidad física de los tiempos de entrega de cuadro (Frametime):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">CASO A: 60 FPS FLUIDOS</span>
                <span className="text-zinc-500">Frametime: 16.6 ms</span>
              </div>
              <div className="h-16 flex items-end gap-1.5 bg-black/40 p-2 rounded-lg border border-zinc-800">
                {[16.6, 16.5, 16.7, 16.6, 16.6, 16.8, 16.6, 16.5, 16.6, 16.7, 16.6, 16.6].map((v, i) => (
                  <div
                    key={i}
                    style={{ height: `${(v / 25) * 100}%` }}
                    className="flex-1 bg-emerald-500/60 rounded-t"
                  />
                ))}
              </div>
              <p className="text-[11px] text-zinc-400">
                Línea de cadencia perfectamente plana. El cerebro percibe una continuidad de movimiento impecable.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-red-400 font-bold">CASO B: 140 FPS CON STUTTER</span>
                <span className="text-zinc-500">Spike: 80 ms</span>
              </div>
              <div className="h-16 flex items-end gap-1.5 bg-black/40 p-2 rounded-lg border border-zinc-800">
                {[7.1, 7.2, 7.1, 80.0, 7.1, 7.3, 7.1, 7.0, 7.2, 7.1, 7.1, 7.2].map((v, i) => (
                  <div
                    key={i}
                    style={{ height: `${Math.min((v / 80) * 100, 100)}%` }}
                    className={`flex-1 rounded-t ${v > 20 ? "bg-red-500 animate-pulse" : "bg-cyan-500/60"}`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-zinc-400">
                El contador dice 138 FPS promedio, pero el cuadro 4 se congeló por 80ms: un tirón demoledor perceptible a simple vista.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
