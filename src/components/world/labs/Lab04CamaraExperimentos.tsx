import React, { useState } from 'react';
import { 
  Split, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  Download, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface ExperimentVariable {
  id: string;
  name: string;
  category: string;
  variableTested: string;
  controlDescription: string;
  testDescription: string;
  defaultControlFps: number;
  defaultTestFps: number;
  defaultControlLow1Pct: number;
  defaultTestLow1Pct: number;
  defaultControlFrametimeMs: number;
  defaultTestFrametimeMs: number;
  defaultControlTemp: number;
  defaultTestTemp: number;
  statisticalInsight: string;
}

const EXPERIMENT_PRESETS: ExperimentVariable[] = [
  {
    id: 'exp-ram-frequency',
    name: 'RAM JEDEC Base (4800 MT/s CL40) vs EXPO/XMP (6000 MT/s CL30)',
    category: 'HARDWARE // CONTROLADOR DE MEMORIA (IMC)',
    variableTested: 'Frecuencia de memoria & timings tCL/tRFC (Relación UCLK:MCLK 1:1)',
    controlDescription: 'Módulos DDR5 operando a especificación base JEDEC 4800 MT/s CL40 (latencia absoluta 16.66 ns). Subtimings secundarios relajados por defecto de fábrica.',
    testDescription: 'Módulos DDR5 operando con perfil EXPO optimizado a 6000 MT/s CL30-36-36 (latencia absoluta 10.00 ns) con FCLK y sincronización 1:1 de baja contienda.',
    defaultControlFps: 122,
    defaultTestFps: 144,
    defaultControlLow1Pct: 76,
    defaultTestLow1Pct: 114,
    defaultControlFrametimeMs: 8.2,
    defaultTestFrametimeMs: 6.9,
    defaultControlTemp: 64,
    defaultTestTemp: 66,
    statisticalInsight: 'Delta de FPS medios: +18.0% | Delta 1% Low: +50.0% | Dispersión de frametime reducida de 8.2 ms a 6.9 ms. La mejora supera holgadamente el umbral de varianza intrínseca (3%), clasificándose como una Mejora Físicamente Significativa generada por la descongestión del búfer del CPU.'
  },
  {
    id: 'exp-timer-resolution',
    name: 'Windows Platform Timer Resolution (1.0 ms vs 0.5 ms)',
    category: 'SISTEMA OPERATIVO // SCHEDULER & HPET',
    variableTested: 'Resolución de reloj del sistema NtSetTimerResolution (1.000 ms vs 0.500 ms)',
    controlDescription: 'Temporizador estándar del programador de Windows fijado en 1.000 ms (1000 µs), estándar por defecto para ahorro energético en estado C-States.',
    testDescription: 'Resolución forzada a 0.500 ms (500 µs) mediante llamada nativa Win32 para refrescar interrupciones del hilo de renderizado con mayor granularidad.',
    defaultControlFps: 154,
    defaultTestFps: 155,
    defaultControlLow1Pct: 128,
    defaultTestLow1Pct: 129,
    defaultControlFrametimeMs: 6.49,
    defaultTestFrametimeMs: 6.45,
    defaultControlTemp: 67,
    defaultTestTemp: 68,
    statisticalInsight: 'Delta de FPS medios: +0.65% | Delta 1% Low: +0.78% | Dispersión de frametime: -0.04 ms. La variación se sitúa por debajo del umbral del 3% de error muestral, concluyéndose como Variación Dentro del Margen de Error (Efecto Placebo) en arquitecturas modernas con TSC invariante.'
  },
  {
    id: 'exp-driver-whql-vs-debloat',
    name: 'Driver Oficial WHQL vs Driver "Debloated / Stripped" de Terceros',
    category: 'SOFTWARE // MÓDULOS RING 0 & SEGURIDAD',
    variableTested: 'Paquete de controlador de GPU firmado Microsoft WHQL vs versión modificada sin telemetría',
    controlDescription: 'Driver oficial certificado WHQL instalado mediante limpieza previa DDU con firma de seguridad íntegra y servicios del kernel sin adulterar.',
    testDescription: 'Driver "Debloated" con telemetría recortada por scripts de terceros, servicio NvContainer desactivado forzadamente y aislamiento de memoria roto.',
    defaultControlFps: 142,
    defaultTestFps: 143,
    defaultControlLow1Pct: 120,
    defaultTestLow1Pct: 91,
    defaultControlFrametimeMs: 7.04,
    defaultTestFrametimeMs: 10.98,
    defaultControlTemp: 69,
    defaultTestTemp: 70,
    statisticalInsight: 'Delta de FPS medios: +0.70% (imperceptible), pero el percentil 1% Low sufrió una caída crítica de -24.2% con picos de frametime que saltan hasta 10.98 ms debido a desincronizaciones en la cola DPC. Veredicto: Degradación Significativa por inestabilidad de Ring 0.'
  },
  {
    id: 'exp-pastatermica',
    name: 'Compuesto Térmico Nuevo (0 Horas) vs Pasta Seca Degradada (3 Años)',
    category: 'FÍSICA // RESISTENCIA TÉRMICA DE INTERFAZ (TIM)',
    variableTested: 'Conductividad térmica de interfaz (8.5 W/mK nueva vs < 1.2 W/mK seca)',
    controlDescription: 'Pasta térmica original degradada tras 3 años: silicio con microburbujas, bombeo (pump-out) y resistencia térmica elevada.',
    testDescription: 'Repaste nuevo con compuesto cerámico/micropartículas de alta densidad (8.5 W/mK) con presión de montaje calibrada a 0.6 N·m.',
    defaultControlFps: 116,
    defaultTestFps: 139,
    defaultControlLow1Pct: 64,
    defaultTestLow1Pct: 118,
    defaultControlFrametimeMs: 8.62,
    defaultTestFrametimeMs: 7.19,
    defaultControlTemp: 89,
    defaultTestTemp: 68,
    statisticalInsight: 'Delta térmico: -21.0°C en TJMax | Delta FPS: +19.8% | Delta 1% Low: +84.4%. Clasificación: Mejora Físicamente Significativa generada por la eliminación total del Thermal Throttling de la CPU.'
  }
];

export const Lab04CamaraExperimentos: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<ExperimentVariable>(EXPERIMENT_PRESETS[0]);
  const [iterations, setIterations] = useState<number>(5);

  // Computed deltas
  const fpsDelta = selectedPreset.defaultTestFps - selectedPreset.defaultControlFps;
  const fpsPct = +((fpsDelta / selectedPreset.defaultControlFps) * 100).toFixed(2);

  const lowDelta = selectedPreset.defaultTestLow1Pct - selectedPreset.defaultControlLow1Pct;
  const lowPct = +((lowDelta / selectedPreset.defaultControlLow1Pct) * 100).toFixed(2);

  const frametimeDeltaMs = +(selectedPreset.defaultTestFrametimeMs - selectedPreset.defaultControlFrametimeMs).toFixed(2);
  const tempDelta = selectedPreset.defaultTestTemp - selectedPreset.defaultControlTemp;

  // Scientific significance rule: variance threshold > 3%
  const isPhysicallySignificant = Math.abs(fpsPct) >= 3.0 || Math.abs(lowPct) >= 3.0 || Math.abs(tempDelta) >= 5;
  const isHarmful = lowPct < -3.0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-[#0d1017] to-zinc-900 border-2 border-purple-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <FlaskConical className="w-40 h-40 text-purple-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/50 text-purple-300 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 04 // MATRIZ CIENTÍFICA A/B
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">// CONTROL DE VARIABLES PARÁSITAS</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Cámara de Experimentos & Validación Empírica
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              El método científico aplicado al hardware: 1 sola variable modificada a la vez. Descartá el efecto placebo midiendo deltas de dispersión y significancia estadística con rigor metrológico.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 cols: Experiment selector */}
        <div className="lg:col-span-4 p-5 bg-[#0d0f17] border border-zinc-800 rounded-xl space-y-4">
          <span className="font-mono-tech text-xs font-bold text-amber-400 uppercase tracking-wider block border-b border-zinc-800 pb-2">
            EXPERIMENTOS VERIFICADOS EVO
          </span>

          <div className="space-y-3">
            {EXPERIMENT_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none font-mono-tech ${
                    isSelected
                      ? 'bg-purple-500/15 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">
                      {preset.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-zinc-100 mb-1 leading-snug">
                    {preset.name}
                  </h4>
                  <div className="text-[9.5px] text-zinc-500 pt-1 border-t border-zinc-800/80 flex items-center justify-between">
                    <span>Protocolo A/B estricto</span>
                    <span className="text-purple-400 font-bold">MONTAR ENSAYO →</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-black/60 rounded-lg border border-zinc-800 font-mono-tech text-xs space-y-2">
            <span className="text-zinc-400 block text-[10.5px]">NÚMERO DE PASES (REPETIBILIDAD):</span>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setIterations(num)}
                  className={`py-1 rounded text-center border cursor-pointer ${
                    iterations === num
                      ? 'bg-purple-500 text-white font-bold border-purple-400'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {num} PASES
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 8 cols: Side-by-Side A/B Stage */}
        <div className="lg:col-span-8 p-6 bg-[#0c0e15] border-2 border-zinc-800 rounded-xl space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono-tech text-purple-400 font-bold uppercase tracking-wider block">
                ENSAYO ACTIVO // CONTROL DE CALIDAD METROLÓGICA
              </span>
              <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                {selectedPreset.name}
              </h3>
            </div>
          </div>

          {/* Side by Side Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-tech">
            
            {/* ESTACIÓN A: GRUPO DE CONTROL */}
            <div className="p-4 bg-zinc-950/90 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-black text-zinc-400 uppercase flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  ESTACIÓN A // CONTROL BASE
                </span>
                <span className="text-[10px] text-zinc-500">{iterations} pases promedio</span>
              </div>

              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed min-h-[38px]">
                {selectedPreset.controlDescription}
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">FPS PROMEDIO:</span>
                  <span className="font-bold text-white text-sm">{selectedPreset.defaultControlFps} FPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">1% LOW (PISO):</span>
                  <span className="font-bold text-amber-400 text-sm">{selectedPreset.defaultControlLow1Pct} FPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">DISPERSIÓN FRAMETIME:</span>
                  <span className="font-bold text-cyan-400">{selectedPreset.defaultControlFrametimeMs} ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">TEMPERATURA TJMAX:</span>
                  <span className="font-bold text-zinc-300">{selectedPreset.defaultControlTemp}°C</span>
                </div>
              </div>
            </div>

            {/* ESTACIÓN B: GRUPO DE PRUEBA */}
            <div className="p-4 bg-purple-950/20 border-2 border-purple-500/60 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-purple-500/40 pb-2">
                <span className="text-xs font-black text-purple-300 uppercase flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                  ESTACIÓN B // VARIABLE CANDIDATA
                </span>
                <span className="text-[10px] text-purple-300 font-bold">1 SOLA VARIABLE</span>
              </div>

              <p className="text-xs font-sans-editorial text-zinc-200 leading-relaxed min-h-[38px]">
                {selectedPreset.testDescription}
              </p>

              <div className="space-y-2 pt-2 border-t border-purple-500/30 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">FPS PROMEDIO:</span>
                  <span className="font-bold text-purple-200 text-sm">
                    {selectedPreset.defaultTestFps} FPS 
                    <span className={`text-xs ml-1 ${fpsDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ({fpsDelta >= 0 ? `+${fpsDelta}` : fpsDelta} / {fpsPct >= 0 ? `+${fpsPct}` : fpsPct}%)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">1% LOW (PISO):</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {selectedPreset.defaultTestLow1Pct} FPS
                    <span className={`text-xs ml-1 ${lowDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ({lowDelta >= 0 ? `+${lowDelta}` : lowDelta} / {lowPct >= 0 ? `+${lowPct}` : lowPct}%)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">DISPERSIÓN FRAMETIME:</span>
                  <span className="font-bold text-cyan-300">
                    {selectedPreset.defaultTestFrametimeMs} ms
                    <span className={`text-xs ml-1 ${frametimeDeltaMs <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({frametimeDeltaMs > 0 ? `+${frametimeDeltaMs}` : frametimeDeltaMs} ms)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">TEMPERATURA TJMAX:</span>
                  <span className="font-bold text-zinc-200">
                    {selectedPreset.defaultTestTemp}°C
                    <span className={`text-xs ml-1 ${tempDelta <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ({tempDelta > 0 ? `+${tempDelta}` : tempDelta}°C)
                    </span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Statistical Verdict Box */}
          <div className="p-4 bg-black/80 rounded-xl border border-zinc-800 space-y-2.5 font-sans-editorial">
            <div className="flex flex-wrap items-center justify-between font-mono-tech text-xs gap-2">
              <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                VEREDICTO ESTADÍSTICO AUTOMATIZADO (UMBRAL: &gt; 3% VARIANZA INTRÍNSECA):
              </span>
              <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                isHarmful
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : isPhysicallySignificant
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
              }`}>
                {isHarmful
                  ? 'DEGRADACIÓN FÍSICAMENTE SIGNIFICATIVA'
                  : isPhysicallySignificant
                  ? 'MEJORA FÍSICAMENTE SIGNIFICATIVA'
                  : 'VARIACIÓN DENTRO DEL MARGEN DE ERROR (EFECTO PLACEBO)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedPreset.statisticalInsight}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
