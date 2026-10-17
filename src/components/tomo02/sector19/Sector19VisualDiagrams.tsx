import React, { useState } from 'react';
import {
  Zap,
  Battery,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Shield,
  Cpu,
  Clock,
  Thermometer,
} from 'lucide-react';

export const Sector19VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'ACPI_C_STATES' | 'SPEED_SHIFT_HWP' | 'MODERN_STANDBY_S0IX' | 'THERMAL_HEADROOM_PARADOX'
  >('ACPI_C_STATES');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 19</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              ARQUITECTURA DE ENERGÍA, ACPI, C-STATES Y CONTROL TÉRMICO
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Jerarquía de estados C0 a C10, modulación autónoma Speed Shift (HWP), Modern Standby S0ix y la paradoja térmica de clocks fijos
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('ACPI_C_STATES')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'ACPI_C_STATES'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              1. C-States (C0 - C10)
            </button>
            <button
              onClick={() => setActiveDiagram('SPEED_SHIFT_HWP')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'SPEED_SHIFT_HWP'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Speed Shift (1ms)
            </button>
            <button
              onClick={() => setActiveDiagram('MODERN_STANDBY_S0IX')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'MODERN_STANDBY_S0IX'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              3. S3 vs S0ix Standby
            </button>
            <button
              onClick={() => setActiveDiagram('THERMAL_HEADROOM_PARADOX')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeDiagram === 'THERMAL_HEADROOM_PARADOX'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              4. Paradoja Térmica
            </button>
          </div>
        </div>

        {/* Diagram 1: ACPI C-States */}
        {activeDiagram === 'ACPI_C_STATES' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[JERARQUÍA DE ESTADOS C DE REPOSO]:</strong> Los C-States apagan circuitos progresivamente para reducir el consumo del CPU de 65W a 0.5W. A mayor número de estado, mayor ahorro pero mayor latencia de reactivación.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-2">
                <div className="text-cyan-400 font-bold">C0: Activo</div>
                <div className="text-slate-400 text-[11px]">Núcleo ejecutando instrucciones. 100% de voltaje y frecuencia máxima.</div>
                <div className="text-emerald-400 text-[10px]">Latencia: 0 µs</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-200 font-bold">C1 / C1E: Halt</div>
                <div className="text-slate-400 text-[11px]">Reloj detenido (Clock gating). Registros y cachés intactos.</div>
                <div className="text-cyan-300 text-[10px]">Latencia: ~1 µs</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-200 font-bold">C3: Sleep</div>
                <div className="text-slate-400 text-[11px]">Caché L1/L2 volcado a L3. Generador de reloj apagado.</div>
                <div className="text-amber-300 text-[10px]">Latencia: ~10 µs</div>
              </div>

              <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="text-emerald-400 font-bold">C6 / C7: Deep Power Down</div>
                <div className="text-slate-400 text-[11px]">Voltaje del núcleo reducido a 0V (Power gating).</div>
                <div className="text-amber-400 text-[10px]">Latencia: ~30-50 µs</div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 2: Speed Shift */}
        {activeDiagram === 'SPEED_SHIFT_HWP' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[SPEED SHIFT (HWP) vs LEGACY DVFS]:</strong> Antes de Speed Shift, el kernel de Windows muestreaba la carga cada 30 ms para cambiar de frecuencia. HWP delega la decisión a la lógica del silicio, respondiendo en 1 ms.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-rose-900/30 rounded-xl space-y-2">
                <div className="text-rose-400 font-mono font-bold text-xs uppercase">Control por Software (Legacy ~30ms)</div>
                <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">1. Proceso genera carga de trabajo</div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">2. Kernel de Windows sondea uso de CPU tras 30 ms</div>
                  <div className="p-2 bg-rose-950/40 rounded border border-rose-800/40 text-rose-200">3. Driver emite solicitud ACPI para elevar P-State</div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">4. CPU finalmente acelera (Ramp-up lento)</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-emerald-900/30 rounded-xl space-y-2">
                <div className="text-emerald-400 font-mono font-bold text-xs uppercase">Speed Shift Autónomo (HWP ~1ms)</div>
                <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">1. Proceso genera carga de trabajo</div>
                  <div className="p-2 bg-emerald-950/40 rounded border border-emerald-800/40 text-emerald-200">2. Silicio analiza registros de instrucciones en tiempo real</div>
                  <div className="p-2 bg-emerald-950/40 rounded border border-emerald-800/40 text-emerald-200">3. Multiplicador y voltaje se elevan en 1 ms</div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">4. Máximo boost instantáneo y enfriamiento rápido</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 3: Modern Standby */}
        {activeDiagram === 'MODERN_STANDBY_S0IX' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[SUSPENSIÓN CLÁSICA S3 vs MODERN STANDBY S0ix]:</strong> En S3 todo el hardware se apaga excepto la memoria RAM. En Modern Standby el sistema nunca duerme: sigue conectado a la red, ejecutando tareas y descargando actualizaciones.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 font-mono font-bold text-xs">Suspensión Clásica S3 (Suspend to RAM)</div>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>CPU apagado al 100%. Cero cómputo en segundo plano.</li>
                  <li>RAM en auto-refresh consumiendo ~1.5W.</li>
                  <li>Seguro para guardar la laptop en mochilas.</li>
                  <li>Tiempo de despertar: ~2.5 segundos.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-xl space-y-2">
                <div className="text-amber-400 font-mono font-bold text-xs">Modern Standby S0ix (Connected Standby)</div>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>CPU encendido en estado de bajo consumo pero activo.</li>
                  <li>Mantiene Wi-Fi activo, reproduce música, recibe notificaciones.</li>
                  <li>Riesgo de sobrecalentamiento si un driver falla al dormir.</li>
                  <li>Tiempo de despertar: &lt; 500 milisegundos.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: Thermal Headroom Paradox */}
        {activeDiagram === 'THERMAL_HEADROOM_PARADOX' && (
          <div className="pt-6 space-y-6 animate-fadeIn">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
              <strong className="text-cyan-400">[LA PARADOJA TÉRMICA]:</strong> ¿Por qué forzar 100% de frecuencia en "Alto Rendimiento" rinde menos en juegos largos que el plan "Equilibrado"?
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-rose-900/30 rounded-xl space-y-2">
                <div className="text-rose-400 font-mono font-bold text-xs">Plan Alto Rendimiento (Frecuencia Fija)</div>
                <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                  <div>- Voltaje alto continuo: 1.35V en todo momento</div>
                  <div>- Calor acumulado satura los heatpipes en 15 min</div>
                  <div>- Temperatura llega al límite TJMax (95°C - 100°C)</div>
                  <div className="p-2 bg-rose-950/40 rounded text-rose-300 font-bold">- Thermal Throttling severo: clocks caen a 2.4 GHz</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-emerald-900/30 rounded-xl space-y-2">
                <div className="text-emerald-400 font-mono font-bold text-xs">Plan Equilibrado (Descansos Dinámicos)</div>
                <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                  <div>- Voltaje oscila entre 0.7V (reposo) y 1.35V (boost)</div>
                  <div>- Micro-descansos entre frames enfrían el disipador</div>
                  <div>- Margen térmico (headroom) preservado</div>
                  <div className="p-2 bg-emerald-950/40 rounded text-emerald-300 font-bold">- Clocks sostenidos de 4.8 GHz durante horas sin caídas</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
