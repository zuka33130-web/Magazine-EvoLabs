import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Cpu,
  HardDrive,
  Flame,
  Activity,
  Zap,
  TrendingDown,
  Layers,
} from 'lucide-react';
import {
  FluidezGameOption,
  FluidezResolution,
  FluidezQuality,
  FluidezFpsLimit,
  FluidezVsync,
  FluidezSensacion,
  FluidezSintoma,
} from '../../types';

interface InterpretationStationProps {
  game: FluidezGameOption;
  customGameName: string;
  resolution: FluidezResolution;
  customResolution: string;
  quality: FluidezQuality;
  fpsLimit: FluidezFpsLimit;
  vsync: FluidezVsync;
  monitor: string;
  fpsHabituales: number | null;
  caidaObservada: number | null;
  sensacion: FluidezSensacion;
  sintomas: FluidezSintoma[];
  hasTelemetry: boolean;
  avgFps: number | null;
  onePercentLow: number | null;
  zeroPointOnePercentLow: number | null;
  frametimeAvgMs: number | null;
  frametimePeakMs: number | null;
}

export const InterpretationStation: React.FC<InterpretationStationProps> = ({
  game,
  customGameName,
  resolution,
  customResolution,
  quality,
  fpsLimit,
  vsync,
  monitor,
  fpsHabituales,
  caidaObservada,
  sensacion,
  sintomas,
  hasTelemetry,
  avgFps,
  onePercentLow,
  zeroPointOnePercentLow,
  frametimeAvgMs,
  frametimePeakMs,
}) => {
  const effectiveGameName = game === 'OTRO' && customGameName ? customGameName : game;
  const effectiveResolution = resolution === 'PERSONALIZADA' && customResolution ? customResolution : resolution;

  // Stability Classification (Qualitative, no arbitrary fake scores)
  let clasificacionEstabilidad = 'EVIDENCIA INSUFICIENTE PARA CLASIFICAR ESTABILIDAD TEMPORAL';
  let clasificacionColor = 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10';
  let clasificacionExplicacion =
    'Solo disponemos de lecturas en contador simple. Para diagnosticar la estabilidad temporal cuadro por cuadro se requiere telemetría con registro de percentiles o curvas de milisegundos.';

  if (hasTelemetry && avgFps && onePercentLow) {
    const ratio = onePercentLow / avgFps;
    if (ratio >= 0.85) {
      clasificacionEstabilidad = 'ENTREGA MUY ESTABLE';
      clasificacionColor = 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10';
      clasificacionExplicacion =
        'La dispersión entre los cuadros promedio y el peor 1% es mínima (<15%). La cadencia de fotogramas es altamente uniforme.';
    } else if (ratio >= 0.70) {
      clasificacionEstabilidad = 'ENTREGA ESTABLE';
      clasificacionColor = 'text-emerald-300 border-emerald-300/40 bg-emerald-300/10';
      clasificacionExplicacion =
        'Comportamiento predecible con variaciones moderadas en momentos de alta carga gráfica o efectos en pantalla.';
    } else if (ratio >= 0.50) {
      clasificacionEstabilidad = 'VARIACIÓN MODERADA';
      clasificacionColor = 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10';
      clasificacionExplicacion =
        'El peor 1% de los cuadros tarda significativamente más que el promedio. Esto coincide típicamente con micro-tirones perceptibles.';
    } else {
      clasificacionEstabilidad = 'VARIACIÓN IMPORTANTE';
      clasificacionColor = 'text-red-400 border-red-400/40 bg-red-400/10';
      clasificacionExplicacion =
        'El 1% Low cae a menos de la mitad del promedio. Existen congelamientos breves o pausas apreciables en la entrega de cuadros.';
    }
  } else if (fpsHabituales) {
    if (sensacion === 'MUY FLUIDA' && sintomas.includes('ninguno')) {
      clasificacionEstabilidad = 'APRECIACIÓN VISUAL MUY FLUIDA';
      clasificacionColor = 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10';
      clasificacionExplicacion =
        'La experiencia subjetiva no registró anomalías durante los 60 segundos de observación continua.';
    } else if (sensacion === 'TIRONES NOTORIOS' || sintomas.includes('congelamiento breve')) {
      clasificacionEstabilidad = 'SÍNTOMAS DE INESTABILIDAD OBSERVADOS';
      clasificacionColor = 'text-red-400 border-red-400/40 bg-red-400/10';
      clasificacionExplicacion =
        'Aunque el contador marque un número alto, los síntomas visuales indican pausas abruptas en el flujo de fotogramas.';
    }
  }

  // Telemetry dispersion calculation
  const dispersionGap =
    hasTelemetry && avgFps && onePercentLow ? (avgFps - onePercentLow).toFixed(1) : null;
  const dispersionPct =
    hasTelemetry && avgFps && onePercentLow
      ? (((avgFps - onePercentLow) / avgFps) * 100).toFixed(0)
      : null;

  return (
    <section id="seccion-estacion-06" className="space-y-8 pt-6">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-yellow-400 font-bold">
            <span>ESTACIÓN 06</span>
            <span>•</span>
            <span>INTERPRETACIÓN // LO QUE LOS DATOS DICEN Y LO QUE NO</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            Lectura analítica basada en tu evidencia
          </h2>
        </div>
        <span className="text-xs font-mono-tech px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold uppercase self-start sm:self-auto shrink-0">
          MÉTODO CIENTÍFICO EVO
        </span>
      </div>

      {/* Stability Classification Banner */}
      <div className={`p-5 rounded-2xl border ${clasificacionColor} space-y-2`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest font-bold">
            CLASIFICACIÓN CUALITATIVA DE REGULARIDAD
          </span>
          <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded bg-black/40 font-bold">
            SIN PUNTUAJES FICTICIOS
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight">
          {clasificacionEstabilidad}
        </div>
        <p className="font-sans-editorial text-xs sm:text-sm leading-relaxed opacity-90">
          {clasificacionExplicacion}
        </p>
      </div>

      {/* Two comparative columns: LO QUE SABEMOS vs LO QUE TODAVÍA NO SABEMOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LO QUE SABEMOS */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-emerald-400 tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>LO QUE SABEMOS CON CERTEZA</span>
          </div>

          <ul className="space-y-3 text-xs font-mono-tech text-zinc-300">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-white uppercase">Contexto evaluado:</strong> {effectiveGameName} a {effectiveResolution}, calidad {quality}, límite: {fpsLimit}.
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-white uppercase">Lectura de FPS habituales:</strong> {fpsHabituales ? `${fpsHabituales} FPS` : 'Pendiente de carga'}. Cadencia teórica estimada: {fpsHabituales ? `${(1000 / fpsHabituales).toFixed(2)} ms` : '--'}.
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-white uppercase">Sensación percibida:</strong> {sensacion} ({sintomas.length > 0 ? sintomas.join(', ') : 'sin síntomas registrados'}).
              </span>
            </li>

            {hasTelemetry && avgFps && onePercentLow && (
              <li className="flex items-start gap-2.5 pt-2 border-t border-zinc-800/80">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>
                  <strong className="text-white uppercase">Telemetría de alta resolución:</strong> AVG {avgFps} FPS con 1% Low de {onePercentLow} FPS (brecha de {dispersionGap} FPS, dispersión del {dispersionPct}%).
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* LO QUE TODAVÍA NO SABEMOS */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
            <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>LO QUE TODAVÍA NO SABEMOS</span>
          </div>

          <ul className="space-y-3 text-xs font-mono-tech text-zinc-300">
            {!hasTelemetry && (
              <li className="flex items-start gap-2.5">
                <span className="text-yellow-400 font-bold mt-0.5">?</span>
                <span>
                  <strong className="text-white uppercase">Distribución percentil exacta:</strong> Al usar solo contador en pantalla, no conocemos la duración exacta en ms de los cuadros más lentos.
                </span>
              </li>
            )}

            <li className="flex items-start gap-2.5">
              <span className="text-yellow-400 font-bold mt-0.5">?</span>
              <span>
                <strong className="text-white uppercase">Componente causante del cuello:</strong> Los FPS nos dicen <em>cuándo</em> hay una pausa, pero no demuestran <em>cuál</em> silicio se saturó primero (¿la CPU procesando llamadas de dibujo o la GPU completando sombreado?).
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="text-yellow-400 font-bold mt-0.5">?</span>
              <span>
                <strong className="text-white uppercase">Impacto térmico y frecuencias:</strong> Si el procesador o la gráfica bajaron su reloj dinámico por exceso de temperatura (thermal throttling) durante la prueba.
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="text-yellow-400 font-bold mt-0.5">?</span>
              <span>
                <strong className="text-white uppercase">Procesos invisibles de fondo:</strong> Si Windows ejecutó indexación, antivirus o tareas concurrentes mientras jugabas.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Dispersion Analysis (Only if Telemetry is present) */}
      {hasTelemetry && avgFps && onePercentLow && (
        <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="text-yellow-400 font-bold uppercase tracking-wider">
              CORRELACIÓN DISPERSIÓN TELEMÉTRICA // AVG VS 1% LOW
            </span>
            <span className="text-zinc-400">BRECHA: {dispersionGap} FPS ({dispersionPct}%)</span>
          </div>

          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed italic">
            “Existe una separación del {dispersionPct}% entre el rendimiento medio ({avgFps} FPS) y los cuadros más lentos ({onePercentLow} FPS). En la metodología EVO, esta brecha es un indicador de variabilidad rítmica, pero por sí sola no determina el culpable: se requiere correlacionar la carga física de cada silicio.”
          </p>
        </div>
      )}

      {/* Open Hypotheses Matrix (Prudent, non-absolute) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
            HIPÓTESIS DE INVESTIGACIÓN ABIERTAS
          </span>
          <h3 className="font-display font-bold text-lg text-white uppercase">
            Factores que pueden estar originando la variabilidad
          </h3>
          <p className="font-sans-editorial text-xs text-zinc-400">
            En lugar de culpar apresuradamente a una pieza, la ingeniería informática formula hipótesis verificables:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>CPU // HILOS Y DRAW CALLS</span>
            </div>
            <p className="text-[11px] font-sans-editorial text-zinc-300 leading-snug">
              Si un solo núcleo se satura calculando físicas o lógica de la partida, los cuadros se frenan antes de llegar a la placa.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>GPU // SHADERS Y VRAM</span>
            </div>
            <p className="text-[11px] font-sans-editorial text-zinc-300 leading-snug">
              Si la memoria de video se desborda, los cuadros deben esperar que la memoria RAM compense la transferencia lenta.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-bold">
              <HardDrive className="w-3.5 h-3.5" />
              <span>DISCO // TEXTURE STREAMING</span>
            </div>
            <p className="text-[11px] font-sans-editorial text-zinc-300 leading-snug">
              Al cruzar una puerta o girar la cámara hacia una zona nueva, el motor solicita modelos desde el almacenamiento.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>TEMPERATURA & WATTS</span>
            </div>
            <p className="text-[11px] font-sans-editorial text-zinc-300 leading-snug">
              Si el procesador o la tarjeta tocan límites térmicos, reducen MHz para protegerse (próximo Capítulo 04).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
