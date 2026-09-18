import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Gauge,
  Sliders,
  Award,
  AlertCircle,
  X,
  ArrowRight,
} from 'lucide-react';
import {
  UserPcSpec,
  FluidezGameOption,
  FluidezResolution,
  FluidezQuality,
  FluidezFpsLimit,
  FluidezVsync,
  FluidezSensacion,
  FluidezSintoma,
  FluidezProfileData,
} from '../types';
import { FlowMapModal } from './FlowMapModal';
import { FpsLabStation } from './chapter03/FpsLabStation';
import { InterpretationStation } from './chapter03/InterpretationStation';
import { FluidezProfileArtifact } from './chapter03/FluidezProfileArtifact';

interface Chapter03ViewProps {
  onBackToIndex: () => void;
  onOpenChapter02?: () => void;
  onChapterCompleted?: () => void;
}

export const Chapter03View: React.FC<Chapter03ViewProps> = ({
  onBackToIndex,
  onOpenChapter02,
  onChapterCompleted,
}) => {
  // Load inherited specs and flow map data
  const [specs] = useState<Partial<UserPcSpec>>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_specs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [hasFlowMap] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('evo_c02_status') === 'completed' ||
        Boolean(localStorage.getItem('evo_c02_lab_data'))
      );
    } catch {
      return false;
    }
  });

  const [simMode, setSimMode] = useState<'estable' | 'inestable'>('inestable');
  const [isFlowMapModalOpen, setIsFlowMapModalOpen] = useState(false);

  // Chapter 03 Lab State with localStorage hydration
  const [game, setGame] = useState<FluidezGameOption>(() => {
    try {
      const saved = localStorage.getItem('evo_c03_game');
      if (saved && ['VALORANT', 'COUNTER-STRIKE 2', 'FORTNITE', 'OTRO'].includes(saved)) {
        return saved as FluidezGameOption;
      }
    } catch {}
    return 'VALORANT';
  });

  const [customGameName, setCustomGameName] = useState<string>(() => {
    try {
      return localStorage.getItem('evo_c03_custom_game') || '';
    } catch {
      return '';
    }
  });

  const [resolution, setResolution] = useState<FluidezResolution>('1920×1080');
  const [customResolution, setCustomResolution] = useState<string>('');
  const [quality, setQuality] = useState<FluidezQuality>('BAJA');
  const [fpsLimit, setFpsLimit] = useState<FluidezFpsLimit>('SIN LÍMITE');
  const [customFpsLimit, setCustomFpsLimit] = useState<string>('');
  const [vsync, setVsync] = useState<FluidezVsync>('DESACTIVADO');

  const [monitor, setMonitor] = useState<string>(() => {
    if (specs.monitors) return specs.monitors;
    return '1920×1080 @ 144 Hz';
  });

  const [fpsHabituales, setFpsHabituales] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c03_fps_habituales');
      return saved ? Number(saved) : 144;
    } catch {
      return 144;
    }
  });

  const [caidaObservada, setCaidaObservada] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c03_caida_observada');
      return saved ? Number(saved) : 98;
    } catch {
      return 98;
    }
  });

  const [sensacion, setSensacion] = useState<FluidezSensacion>(() => {
    try {
      const saved = localStorage.getItem('evo_c03_sensacion');
      if (saved) return saved as FluidezSensacion;
    } catch {}
    return 'FLUIDA';
  });

  const [sintomas, setSintomas] = useState<FluidezSintoma[]>(() => {
    try {
      const saved = localStorage.getItem('evo_c03_sintomas');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['micro-stuttering'];
  });

  // Telemetry Mode
  const [hasTelemetry, setHasTelemetry] = useState<boolean>(false);
  const [avgFps, setAvgFps] = useState<number | null>(null);
  const [onePercentLow, setOnePercentLow] = useState<number | null>(null);
  const [zeroPointOnePercentLow, setZeroPointOnePercentLow] = useState<number | null>(null);
  const [frametimeAvgMs, setFrametimeAvgMs] = useState<number | null>(null);
  const [frametimePeakMs, setFrametimePeakMs] = useState<number | null>(null);
  const [captureDurationSeconds, setCaptureDurationSeconds] = useState<number | null>(60);

  // Completion status
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('evo_c03_status') === 'completed';
    } catch {
      return false;
    }
  });

  // Missing validation modal
  const [isMissingModalOpen, setIsMissingModalOpen] = useState(false);
  const [missingItemsList, setMissingItemsList] = useState<string[]>([]);
  const [highlightMissing, setHighlightMissing] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('evo_c03_game', game);
      if (customGameName) localStorage.setItem('evo_c03_custom_game', customGameName);
      if (fpsHabituales) localStorage.setItem('evo_c03_fps_habituales', String(fpsHabituales));
      if (caidaObservada) localStorage.setItem('evo_c03_caida_observada', String(caidaObservada));
      localStorage.setItem('evo_c03_sensacion', sensacion);
      localStorage.setItem('evo_c03_sintomas', JSON.stringify(sintomas));
    } catch {
      // ignore
    }
  }, [game, customGameName, fpsHabituales, caidaObservada, sensacion, sintomas]);

  const toggleSintoma = (sintomaId: FluidezSintoma) => {
    if (sintomaId === 'ninguno') {
      setSintomas(['ninguno']);
      return;
    }
    setSintomas((prev) => {
      const filtered = prev.filter((s) => s !== 'ninguno');
      if (filtered.includes(sintomaId)) {
        const next = filtered.filter((s) => s !== sintomaId);
        return next.length === 0 ? ['ninguno'] : next;
      }
      return [...filtered, sintomaId];
    });
  };

  // Compile current profile data
  const currentProfileData: FluidezProfileData = {
    game,
    customGameName: game === 'OTRO' ? customGameName : undefined,
    resolution,
    customResolution: resolution === 'PERSONALIZADA' ? customResolution : undefined,
    quality,
    fpsLimit,
    customFpsLimit: fpsLimit === 'PERSONALIZADO' ? customFpsLimit : undefined,
    vsync,
    monitor,
    fpsHabituales,
    caidaObservada,
    sensacion,
    sintomas,
    frametimeTeoricoMs: fpsHabituales && fpsHabituales > 0 ? Number((1000 / fpsHabituales).toFixed(2)) : null,
    hasTelemetry,
    avgFps,
    onePercentLow,
    zeroPointOnePercentLow,
    frametimeAvgMs,
    frametimePeakMs,
    captureDurationSeconds,
    method: hasTelemetry && avgFps ? 'CAPTURADO POR TELEMETRÍA' : 'OBSERVADO EN CONTADOR',
    registeredAt: new Date().toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  // Validate essentials before consolidation
  const handleConsolidateProfile = () => {
    const missing: string[] = [];
    if (!game || (game === 'OTRO' && !customGameName.trim())) {
      missing.push('Elegir juego de prueba');
    }
    if (!fpsHabituales || fpsHabituales <= 0) {
      missing.push('Registrar FPS observados');
    }
    if (!sensacion) {
      missing.push('Registrar sensación percibida');
    }

    if (missing.length > 0) {
      setMissingItemsList(missing);
      setIsMissingModalOpen(true);
      setHighlightMissing(true);
      return;
    }

    // Persist profile
    try {
      localStorage.setItem('evo_c03_fluidez_profile', JSON.stringify(currentProfileData));
      localStorage.setItem('evo_c03_status', 'completed');
      localStorage.setItem('evo_c04_unlocked', 'true');
    } catch {
      // ignore
    }

    setIsCompleted(true);
    setHighlightMissing(false);

    if (onChapterCompleted) {
      onChapterCompleted();
    }
  };

  const handleGoToMissingSection = () => {
    setIsMissingModalOpen(false);
    setHighlightMissing(true);
    const labEl = document.getElementById('seccion-estacion-05');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetTest = () => {
    setIsCompleted(false);
    const labEl = document.getElementById('seccion-estacion-05');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenChapter04 = () => {
    if (onChapterCompleted) {
      onChapterCompleted();
    } else {
      onBackToIndex();
    }
  };

  return (
    <div id="pantalla-capitulo-03" className="w-full min-h-screen py-6 sm:py-10 text-[#f4f4f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Navigation Top Bar */}
        <nav className="flex items-center justify-between pb-5 border-b border-zinc-800/60">
          <button
            type="button"
            onClick={onBackToIndex}
            className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
            id="btn-volver-indice-c03"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
            <span>← VOLVER A ÍNDICE DEL TOMO 01</span>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono-tech">
            <span className="w-2 h-2 bg-yellow-400 inline-block" />
            <span className="tracking-widest uppercase text-white font-bold">
              TOMO 01 // CAPÍTULO 03
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-yellow-400 font-semibold tracking-wider">
              TELEMETRÍA & FLUIDEZ
            </span>
          </div>
        </nav>

        {/* Inherited Evidence Card */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-mono-tech">
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 font-bold uppercase text-[10px]">
              EVIDENCIA HEREDADA
            </span>
            <span className="text-zinc-300">
              CPU: <strong className="text-white">{specs.cpu || 'Auditada en C01'}</strong> • GPU: <strong className="text-white">{specs.gpu || 'Auditada en C01'}</strong>
            </span>
          </div>
          {hasFlowMap && (
            <button
              type="button"
              id="btn-c03-consultar-mapa-flujo-top"
              onClick={() => setIsFlowMapModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
              <span>Mapa de Flujo 001 Vinculado</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 uppercase font-bold ml-1">
                CONSULTAR
              </span>
            </button>
          )}
        </div>

        {/* Chapter Header */}
        <header className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-zinc-400">
            <span>TOMO 01 // CONOCÉ TU PC</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold">CAPÍTULO 03 // INVESTIGACIÓN COMPLETA</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
            CUANDO LOS FPS MIENTEN
          </h1>

          <div className="p-5 rounded-2xl bg-[#121318] border-l-4 border-yellow-400 space-y-2">
            <p className="font-sans-editorial text-lg text-white font-medium italic">
              “Una tarjeta gráfica puede reportar 120 fotogramas por segundo mientras tus ojos sienten tirones continuos.
              <br />
              <span className="text-yellow-400 font-bold not-italic">
                El ojo humano no percibe promedios aritméticos; sufre la dispersión temporal entre cuadros.”
              </span>
            </p>
            <p className="text-xs font-mono-tech text-zinc-400">
              En el Capítulo 02 entendiste cómo se comunican las piezas. En el Capítulo 03 investigamos la regularidad con la que entregan cada imagen.
            </p>
          </div>
        </header>

        {/* Framing & 7 Stations Sequence */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono-tech uppercase tracking-widest text-zinc-400">
            <span>ESTRUCTURA DE INVESTIGACIÓN // 7 ESTACIONES METÓDICAS</span>
            <span className="text-yellow-400 font-bold">FLUJO COMPLETO: TEORÍA → ENSAYO → EXPEDIENTE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Station 01 */}
            <div className="p-4 rounded-xl bg-[#121318] border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                <span className="text-yellow-400 font-bold">01 // TEORÍA</span>
                <span>SEÑAL</span>
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase">
                La falacia del promedio
              </h3>
              <p className="font-sans-editorial text-xs text-zinc-400 leading-snug">
                Por qué 60 FPS sumados en un segundo ocultan si 50 cuadros salieron en 200 ms y la pantalla quedó pausada los restantes 800 ms.
              </p>
            </div>

            {/* Station 02 */}
            <div className="p-4 rounded-xl bg-[#121318] border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                <span className="text-yellow-400 font-bold">02 // ESTADÍSTICA</span>
                <span>PERCENTILES</span>
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase">
                1% Low y 0.1% Low
              </h3>
              <p className="font-sans-editorial text-xs text-zinc-400 leading-snug">
                Cómo aislar el peor 1% de los cuadros para cuantificar el stuttering real que arruina la precisión y la respuesta.
              </p>
            </div>

            {/* Station 03 */}
            <div className="p-4 rounded-xl bg-[#121318] border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                <span className="text-yellow-400 font-bold">03 // MÉTRICA</span>
                <span>FRAMETIME</span>
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase">
                El gráfico de Frametime
              </h3>
              <p className="font-sans-editorial text-xs text-zinc-400 leading-snug">
                La cadencia milisegundo a milisegundo. Una línea plana significa ritmo suave; picos hacia arriba son tirones directos.
              </p>
            </div>

            {/* Station 04 */}
            <div className="p-4 rounded-xl bg-[#121318] border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                <span className="text-yellow-400 font-bold">04 // TELEMETRÍA</span>
                <span>INSTRUMENTOS</span>
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase">
                PresentMon & CapFrameX
              </h3>
              <p className="font-sans-editorial text-xs text-zinc-400 leading-snug">
                Cómo medir la entrega real en la cola gráfica del sistema operativo sin depender de contadores visuales falsos.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ESTACIÓN 03 DEMOSTRADOR // DEMOSTRACIÓN EDUCATIVA */}
        {/* ============================================================ */}
        <section className="p-6 sm:p-7 rounded-2xl bg-black/40 border border-zinc-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
                  DEMOSTRACIÓN EDUCATIVA
                </span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                  NO CONFUNDIR CON TU TELEMETRÍA
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase mt-1">
                60 FPS Estables vs 60 FPS con Micro-Stuttering
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => setSimMode('inestable')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  simMode === 'inestable'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Inestable (Picos de Frametime)
              </button>
              <button
                type="button"
                onClick={() => setSimMode('estable')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  simMode === 'estable'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Estable (Ritmo Perfecto)
              </button>
            </div>
          </div>

          {/* Frametime Visual Bars */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
              <span>Entrega de 10 cuadros consecutivos (ms por cuadro):</span>
              <span className="text-white font-bold">
                {simMode === 'estable' ? 'Línea pareja (~16.6 ms)' : 'Picos erráticos (hasta 65 ms)'}
              </span>
            </div>

            <div className="h-28 flex items-end gap-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              {(simMode === 'estable'
                ? [16.6, 16.7, 16.5, 16.6, 16.7, 16.6, 16.5, 16.6, 16.7, 16.6]
                : [16.6, 17.1, 62.4, 8.2, 16.4, 48.0, 10.1, 16.8, 55.2, 16.6]
              ).map((ms, i) => {
                const heightPct = Math.min(100, (ms / 70) * 100);
                const isSpike = ms > 25;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span
                      className={`text-[10px] font-mono-tech ${
                        isSpike ? 'text-red-400 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      {ms.toFixed(0)}ms
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-300 ${
                        isSpike
                          ? 'bg-red-500 shadow-lg shadow-red-500/30'
                          : 'bg-emerald-500/80'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <p className="text-xs font-sans-editorial text-zinc-400 italic">
              {simMode === 'inestable'
                ? 'El contador de la esquina marca "60 FPS", pero cada pico de 50-65 ms provoca que tu cerebro perciba un micro-congelamiento notorio.'
                : 'A 16.6 ms constante por cuadro, la animación fluye con cadencia predecible y la vista experimenta confort visual absoluto.'}
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ESTACIÓN 05 // LABORATORIO FPS // MEDÍ TU JUEGO */}
        {/* ============================================================ */}
        <FpsLabStation
          game={game}
          setGame={setGame}
          customGameName={customGameName}
          setCustomGameName={setCustomGameName}
          resolution={resolution}
          setResolution={setResolution}
          customResolution={customResolution}
          setCustomResolution={setCustomResolution}
          quality={quality}
          setQuality={setQuality}
          fpsLimit={fpsLimit}
          setFpsLimit={setFpsLimit}
          customFpsLimit={customFpsLimit}
          setCustomFpsLimit={setCustomFpsLimit}
          vsync={vsync}
          setVsync={setVsync}
          monitor={monitor}
          setMonitor={setMonitor}
          fpsHabituales={fpsHabituales}
          setFpsHabituales={setFpsHabituales}
          caidaObservada={caidaObservada}
          setCaidaObservada={setCaidaObservada}
          sensacion={sensacion}
          setSensacion={setSensacion}
          sintomas={sintomas}
          toggleSintoma={toggleSintoma}
          hasTelemetry={hasTelemetry}
          setHasTelemetry={setHasTelemetry}
          avgFps={avgFps}
          setAvgFps={setAvgFps}
          onePercentLow={onePercentLow}
          setOnePercentLow={setOnePercentLow}
          zeroPointOnePercentLow={zeroPointOnePercentLow}
          setZeroPointOnePercentLow={setZeroPointOnePercentLow}
          frametimeAvgMs={frametimeAvgMs}
          setFrametimeAvgMs={setFrametimeAvgMs}
          frametimePeakMs={frametimePeakMs}
          setFrametimePeakMs={setFrametimePeakMs}
          captureDurationSeconds={captureDurationSeconds}
          setCaptureDurationSeconds={setCaptureDurationSeconds}
          highlightMissing={highlightMissing}
        />

        {/* ============================================================ */}
        {/* ESTACIÓN 06 // INTERPRETACIÓN */}
        {/* ============================================================ */}
        <InterpretationStation
          game={game}
          customGameName={customGameName}
          resolution={resolution}
          customResolution={customResolution}
          quality={quality}
          fpsLimit={fpsLimit}
          vsync={vsync}
          monitor={monitor}
          fpsHabituales={fpsHabituales}
          caidaObservada={caidaObservada}
          sensacion={sensacion}
          sintomas={sintomas}
          hasTelemetry={hasTelemetry}
          avgFps={avgFps}
          onePercentLow={onePercentLow}
          zeroPointOnePercentLow={zeroPointOnePercentLow}
          frametimeAvgMs={frametimeAvgMs}
          frametimePeakMs={frametimePeakMs}
        />

        {/* ============================================================ */}
        {/* ESTACIÓN 07 // ARTEFACTO // PERFIL DE FLUIDEZ EVO 001 */}
        {/* ============================================================ */}
        <FluidezProfileArtifact
          profileData={currentProfileData}
          specs={specs}
          isCompleted={isCompleted}
          onConsolidate={handleConsolidateProfile}
          onResetTest={handleResetTest}
          onOpenChapter04={handleOpenChapter04}
          onBackToIndex={onBackToIndex}
        />

        {/* Bottom Bar Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-zinc-800">
          <button
            type="button"
            onClick={onBackToIndex}
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-white hover:border-zinc-500 font-mono-tech font-bold text-xs uppercase cursor-pointer transition-colors"
          >
            VOLVER AL ÍNDICE DEL TOMO 01
          </button>

          <button
            type="button"
            id="btn-consultar-mapa-flujo"
            onClick={() => setIsFlowMapModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-bold text-xs uppercase cursor-pointer transition-colors shadow-lg inline-flex items-center justify-center gap-2"
          >
            <span>CONSULTAR MAPA DE FLUJO</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Modal / Visor de Consulta Contextual del Mapa de Flujo 001 */}
      <FlowMapModal
        isOpen={isFlowMapModalOpen}
        onClose={() => setIsFlowMapModalOpen(false)}
        specs={specs}
        onOpenFullChapter02={onOpenChapter02}
      />

      {/* Validation Dialog / Missing Requirements Modal */}
      {isMissingModalOpen && (
        <div
          id="modal-falta-completar-c03"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsMissingModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#121318] border-2 border-yellow-400 p-6 space-y-5 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono-tech font-bold text-yellow-400 uppercase">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span>EXPEDIENTE INCOMPLETO</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMissingModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono-tech uppercase tracking-widest text-zinc-300 font-bold block">
                TE FALTA:
              </span>
              <ul className="space-y-2 text-sm font-mono-tech text-white">
                {missingItemsList.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="font-sans-editorial text-xs text-zinc-400 italic">
              En EVO LABS no registramos conclusiones sin mediciones previas. Completá estos campos para certificar tu línea base.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                id="btn-ir-a-lo-que-falta"
                onClick={handleGoToMissingSection}
                className="flex-1 px-5 py-3 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-bold text-xs uppercase cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>IR A LO QUE FALTA</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
              <button
                type="button"
                onClick={() => setIsMissingModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono-tech uppercase cursor-pointer"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
