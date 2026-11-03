import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Terminal,
  Zap,
  Gauge,
  Sliders,
  Maximize2,
  FileText,
  Microscope,
  HardDrive,
  Monitor
} from 'lucide-react';
import {
  CACHE_HIERARCHY_DATA,
  SILICON_ARCHITECTURE_TOPICS,
  TELEMETRY_METRICS,
  FORENSIC_CASE_STUDIES,
  CacheLatencyLevel,
  SiliconArchitectureTopic,
  TelemetryMetricItem,
  ForensicCaseStudy
} from '../../data/tomo01TechnicalSections';

export type DossierTab = 'silicon' | 'telemetry' | 'forensics';

interface Tomo01TechnicalDossierProps {
  initialTab?: DossierTab;
  onJumpToPassport?: () => void;
}

export const Tomo01TechnicalDossier: React.FC<Tomo01TechnicalDossierProps> = ({
  initialTab = 'silicon',
  onJumpToPassport,
}) => {
  const [activeTab, setActiveTab] = useState<DossierTab>(initialTab);
  const [selectedCase, setSelectedCase] = useState<string>(FORENSIC_CASE_STUDIES[0].id);
  const [frametimeSimMode, setFrametimeSimMode] = useState<'stable' | 'stutter'>('stable');

  // Interactive Memory Latency Calculator State
  const [calcSpeed, setCalcSpeed] = useState<number>(6000);
  const [calcCas, setCalcCas] = useState<number>(30);

  // Latency Formula: (CL * 2000) / MT/s
  const calculatedLatencyNs = ((calcCas * 2000) / (calcSpeed || 1)).toFixed(2);

  // Reference comparison presets
  const presets = [
    { label: 'DDR4 3200 CL16', speed: 3200, cl: 16, note: 'Estándar balanceado DDR4' },
    { label: 'DDR4 3600 CL14', speed: 3600, cl: 14, note: 'B-Die ultra baja latencia' },
    { label: 'DDR5 5200 CL40', speed: 5200, cl: 40, note: 'DDR5 temprana (alta latencia)' },
    { label: 'DDR5 6000 CL30', speed: 6000, cl: 30, note: 'Punto óptimo DDR5 (Sweet Spot)' },
    { label: 'DDR5 7200 CL34', speed: 7200, cl: 34, note: 'Alta frecuencia (Gear 2 / 1:2)' },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Dossier Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#12141a] via-[#0d0e12] to-black border-2 border-yellow-400/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-sm animate-pulse" />
              <span className="font-mono-tech text-xs tracking-widest text-yellow-400 uppercase font-bold">
                EDICIÓN PERICIAL // TOMO 01 // MAGAZINE MASTER DOSSIER
              </span>
            </div>
            <span className="font-mono-tech text-[11px] px-3 py-1 rounded bg-black/60 border border-zinc-700 text-zinc-300 uppercase tracking-wider">
              METROLOGÍA & SILICIO // RING 0
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
              INVESTIGACIÓN TÉCNICA DE FONDO
            </h2>
            <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
              La diferencia entre un usuario engañado por folletos y un técnico forense radica en entender las leyes físicas:
              cómo viajan los electrones por el silicio, por qué los promedios de FPS ocultan la verdad y cómo aislar fallas físicas antes de tocar el sistema operativo.
            </p>
          </div>

          {/* Dossier Navigation Pills */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('silicon')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === 'silicon'
                  ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20'
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:border-yellow-400/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>01. ARQUITECTURA DE SILICIO & MICROONDAS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === 'telemetry'
                  ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20'
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:border-yellow-400/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>02. TELEMETRÍA DE PRECISIÓN & DPC LATENCY</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('forensics')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === 'forensics'
                  ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20'
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:border-yellow-400/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>03. PROTOCOLO DE DIAGNÓSTICO FORENSE</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN 1: ARQUITECTURA DE SILICIO & MICROONDAS           */}
      {/* ========================================================= */}
      {activeTab === 'silicon' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header of Section */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
              <Microscope className="w-4 h-4" />
              <span>FASCÍCULO ESPECIAL // FÍSICA DEL SEMICONDUCTOR</span>
            </div>
            <span className="text-[11px] font-mono-tech text-zinc-500 uppercase">NANOSEGUNDOS & PICOS DE COBRE</span>
          </div>

          {/* Module 1: The Cache Hierarchy with nanosecond physics */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111216] border border-zinc-800 space-y-6">
            <div className="space-y-1">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold block">
                JERARQUÍA DE MEMORIAS // EL ABISMO DE VELOCIDAD
              </span>
              <h3 className="font-display font-black text-2xl text-white uppercase">
                De los Registros de la ALU a la DRAM Externa
              </h3>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
                La CPU no puede esperar a que la memoria RAM responda para cada ciclo de cálculo. Por eso, el silicio moderno alberga múltiples capas de caché SRAM ultra densa. Si la información solicitada no está en L1 o L2, el procesador sufre una <strong className="text-yellow-400">falla de caché (Cache Miss)</strong> y debe detener su pipeline durante decenas de ciclos hasta que el controlador de memoria recupera los bytes.
              </p>
            </div>

            {/* Table of Cache Latencies */}
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left text-xs font-mono-tech">
                <thead className="bg-black/80 text-yellow-400 border-b border-zinc-800 text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Nivel de Silicio</th>
                    <th className="py-3 px-4">Tamaño Típico</th>
                    <th className="py-3 px-4">Latencia en Ciclos</th>
                    <th className="py-3 px-4">Latencia Real (ns)</th>
                    <th className="py-3 px-4">Ancho de Banda</th>
                    <th className="py-3 px-4">Rol en la Ejecución</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 bg-zinc-950/60">
                  {CACHE_HIERARCHY_DATA.map((row) => (
                    <tr key={row.level} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        <span>{row.level}</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">{row.sizeTypical}</td>
                      <td className="py-3 px-4 text-yellow-300 font-bold">{row.cycles}</td>
                      <td className="py-3 px-4 text-emerald-300 font-bold">{row.latencyNs}</td>
                      <td className="py-3 px-4 text-zinc-300">{row.bandwidthGBs}</td>
                      <td className="py-3 px-4 text-zinc-400 text-[11px] max-w-xs">{row.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex items-start gap-3 text-xs font-sans-editorial text-zinc-300">
              <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-yellow-400 font-mono-tech uppercase">Conclusión Forense:</strong> La diferencia entre acceder a L1 (0.9 ns) y buscar un dato en la DRAM externa (65 ns) es de más de <strong>70 veces</strong> en tiempo. Esta es la razón física exacta por la cual la tecnología 3D V-Cache (apilar 64 MB de L3 con micro-vías de silicio) transforma drásticamente los percentiles de 1% Low en simulaciones y videojuegos con grandes conjuntos de datos.
              </div>
            </div>
          </div>

          {/* Module 2: PCB Microondas & Daisy-Chain */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Asset & Forensic Observation */}
            <div className="p-6 rounded-2xl bg-[#111216] border border-zinc-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                    EVIDENCIA DE BANCO // TOPOLOGÍA DE PLACA
                  </span>
                  <span className="text-[10px] font-mono-tech text-zinc-400 bg-black px-2 py-0.5 rounded border border-zinc-800">
                    DISEÑO DAISY-CHAIN
                  </span>
                </div>
                <h4 className="font-display font-black text-xl text-white uppercase">
                  Pistas de Cobre y Stub Reflection
                </h4>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  A 6000 MT/s, la señal de reloj se conmuta 3 mil millones de veces por segundo. Las pistas de cobre de la placa madre operan en régimen de microondas. Si conectás un módulo en el zócalo A1, la pista vacía que continúa hasta A2 actúa como una antena abierta que refleja la onda eléctrica en contrafase.
                </p>
              </div>

              {/* Photo */}
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 group shadow-xl">
                <img
                  src="/assets/magazine/daisy_chain_pcb.jpg"
                  alt="Topología Daisy Chain PCB trazas de memoria"
                  className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-3.5">
                  <span className="text-[10px] font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
                    FOTOGRAFÍA FORENSE // RUTEO DE TRAZAS EN PLACA BASE
                  </span>
                  <span className="text-[11px] font-mono-tech text-zinc-200">
                    Alineación milimétrica para sincronización de fase entre zócalos A2 y B2.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-[11px] font-mono-tech text-zinc-400 space-y-1">
                <div className="text-yellow-400 font-bold uppercase">REGLA DE ENSAMBLE EVO:</div>
                <p>En placas de 4 ranuras, usá SIEMPRE los slots 2 y 4 (A2 y B2). Instalar en 1 y 3 (A1 y B1) es la causa #1 de fallas de arranque en memorias rápidas.</p>
              </div>
            </div>

            {/* Interactive Memory Latency Calculator */}
            <div className="p-6 rounded-2xl bg-[#111216] border border-zinc-800 space-y-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                    LABORATORIO MATEMÁTICO // METROLOGÍA DE LATENCIA
                  </span>
                  <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    FÓRMULA FÍSICA REAL
                  </span>
                </div>
                <h4 className="font-display font-black text-xl text-white uppercase">
                  Calculadora de Latencia Absoluta (ns)
                </h4>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  Muchos confunden <em>ancho de banda bruto</em> (GB/s) con <em>tiempo de respuesta de primera palabra</em> (nanosegundos). Calculá el tiempo exacto que tarda un kit en entregar su primer dato:
                </p>
              </div>

              {/* Formula Callout */}
              <div className="p-3 rounded-lg bg-black/70 border border-zinc-800 text-center font-mono-tech text-xs text-yellow-400 font-bold">
                Latencia (ns) = (CL × 2000) ÷ Velocidad Efectiva (MT/s)
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-tech">
                    <span className="text-zinc-400 uppercase">Velocidad de Memoria:</span>
                    <span className="text-white font-bold">{calcSpeed} MT/s</span>
                  </div>
                  <input
                    type="range"
                    min="2133"
                    max="8400"
                    step="133"
                    value={calcSpeed}
                    onChange={(e) => setCalcSpeed(Number(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-tech">
                    <span className="text-zinc-400 uppercase">Latencia CAS (CL):</span>
                    <span className="text-white font-bold">CL {calcCas}</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    step="1"
                    value={calcCas}
                    onChange={(e) => setCalcCas(Number(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Result Card */}
              <div className="p-4 rounded-xl bg-yellow-400/10 border-2 border-yellow-400/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-tech uppercase text-zinc-400 block">
                    LATENCIA DE ACCESO DE PRIMERA PALABRA
                  </span>
                  <span className="font-display font-black text-3xl text-yellow-400">
                    {calculatedLatencyNs} <span className="text-base font-mono-tech text-white">nanosegundos</span>
                  </span>
                </div>
                <div className="text-right text-[10px] font-mono-tech">
                  <span className="text-zinc-400 block">EVALUACIÓN EVO:</span>
                  <span className={`font-bold uppercase ${
                    Number(calculatedLatencyNs) < 9.5
                      ? 'text-emerald-400'
                      : Number(calculatedLatencyNs) < 11.5
                      ? 'text-yellow-400'
                      : 'text-amber-400'
                  }`}>
                    {Number(calculatedLatencyNs) < 9.5
                      ? 'Excelente (Respuesta Inmediata)'
                      : Number(calculatedLatencyNs) < 11.5
                      ? 'Equilibrado Moderno'
                      : 'Alta Latencia'}
                  </span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono-tech uppercase text-zinc-500 block">
                  PROBAR PRESETS DE REFERENCIA:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setCalcSpeed(p.speed);
                        setCalcCas(p.cl);
                      }}
                      className="p-2 rounded-lg bg-black/60 border border-zinc-800 hover:border-yellow-400/60 text-left transition-colors cursor-pointer"
                    >
                      <span className="font-mono-tech text-[10px] font-bold text-white block">{p.label}</span>
                      <span className="font-mono-tech text-[9px] text-zinc-500 truncate block">{p.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECCIÓN 2: TELEMETRÍA DE PRECISIÓN & DPC LATENCY           */}
      {/* ========================================================= */}
      {activeTab === 'telemetry' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
              <Activity className="w-4 h-4" />
              <span>METROLOGÍA DE SISTEMA // LA VERDAD DETRÁS DE LOS PROMEDIOS</span>
            </div>
            <span className="text-[11px] font-mono-tech text-zinc-500 uppercase">KERNEL RING 0 & FRAME PACING</span>
          </div>

          {/* Interactive Frametime Simulator */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111216] border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold block">
                  DEMOSTRACIÓN INTERACTIVA // FRAME PACING
                </span>
                <h3 className="font-display font-black text-2xl text-white uppercase">
                  ¿Por qué 120 FPS Promedio Pueden Sentirse Como 20 FPS?
                </h3>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-2 bg-black/80 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setFrametimeSimMode('stable')}
                  className={`px-4 py-2 rounded-lg text-xs font-mono-tech font-bold uppercase cursor-pointer transition-colors ${
                    frametimeSimMode === 'stable'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Cadencia Estable (16.6ms)
                </button>
                <button
                  type="button"
                  onClick={() => setFrametimeSimMode('stutter')}
                  className={`px-4 py-2 rounded-lg text-xs font-mono-tech font-bold uppercase cursor-pointer transition-colors ${
                    frametimeSimMode === 'stutter'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Microstuttering Severo
                </button>
              </div>
            </div>

            {/* Visual Graph Representation of Frametimes */}
            <div className="p-5 rounded-xl bg-black border border-zinc-800 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono-tech">
                <span className="text-zinc-400 uppercase">
                  SIMULACIÓN DE TIEMPO DE CUADRO (60 FOTOGRAMAS CONSECUTIVOS):
                </span>
                <span className="text-yellow-400 font-bold">
                  {frametimeSimMode === 'stable'
                    ? 'Línea de Cuadro Plana // 0 Stutter'
                    : 'Picos de Retención en Búfer // Caídas de 1% Low'}
                </span>
              </div>

              {/* Bars container simulating frametime bars */}
              <div className="h-32 flex items-end gap-1 pt-6 px-2 border-b border-zinc-800">
                {Array.from({ length: 48 }).map((_, idx) => {
                  let height = 30; // base ~16.6ms
                  let isSpike = false;

                  if (frametimeSimMode === 'stutter') {
                    if (idx === 12 || idx === 28 || idx === 42) {
                      height = 100; // 85ms massive stutter spike
                      isSpike = true;
                    } else if (idx % 4 === 0) {
                      height = 48; // irregular variance
                    } else {
                      height = 24;
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t transition-all duration-300 ${
                        isSpike
                          ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                          : frametimeSimMode === 'stable'
                          ? 'bg-emerald-400/80 hover:bg-emerald-300'
                          : 'bg-zinc-600'
                      }`}
                      style={{ height: `${height}%` }}
                      title={`Cuadro #${idx + 1}: ${isSpike ? '88.4 ms (Stutter)' : '16.6 ms'}`}
                    />
                  );
                })}
              </div>

              {/* Metrics comparison beneath */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono-tech">
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">FPS Promedio Informado:</span>
                  <span className="text-white text-base font-bold">
                    {frametimeSimMode === 'stable' ? '60.0 FPS' : '58.4 FPS (Parece bueno)'}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Percentil 1% Low (Real):</span>
                  <span className={`text-base font-bold ${
                    frametimeSimMode === 'stable' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {frametimeSimMode === 'stable' ? '59.2 FPS' : '11.3 FPS (Stutter visible)'}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Frame Jitter (Desviación):</span>
                  <span className={`text-base font-bold ${
                    frametimeSimMode === 'stable' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {frametimeSimMode === 'stable' ? '± 0.4 ms (Consistente)' : '± 34.2 ms (Errático)'}
                  </span>
                </div>
              </div>
            </div>

            <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
              <strong>Lección Metrológica:</strong> Si tu máquina reporta 140 FPS pero experimentás microtirones al girar la cámara o disparar, el culpable no es la potencia bruta de la GPU, sino la retención de cuadros en el búfer del controlador, picos de DPC Latency o saturación de canales de memoria.
            </p>
          </div>

          {/* DPC Latency & Kernel Ring 0 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#111216] border border-zinc-800 space-y-4">
              <div className="space-y-1">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold block">
                  AUDITORÍA DE KERNEL RING 0
                </span>
                <h4 className="font-display font-black text-xl text-white uppercase">
                  DPC Latency: Las Interrupciones que Congelan tu PC
                </h4>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  Cuando un controlador en Windows tarda demasiado en completar una rutina diferida (DPC), el procesador no puede atender las solicitudes del juego o de la tarjeta de sonido a tiempo. El resultado son chasquidos de audio (audio drops) y congelamientos de milisegundos invisibles para el Administrador de tareas.
                </p>
              </div>

              {/* Photo */}
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 group shadow-xl">
                <img
                  src="/assets/magazine/dpc_latency_ring0.jpg"
                  alt="DPC Latency osciloscopio e interrupciones en kernel ring 0"
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-3.5">
                  <span className="text-[10px] font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
                    OSCILOGRAMA FORENSE // LATENCIA DE DRIVER
                  </span>
                  <span className="text-[11px] font-mono-tech text-zinc-200">
                    Pico de ejecución de ISR en controlador de red superando 1400 microsegundos.
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono-tech">
                <div className="p-2.5 bg-black/60 rounded-lg border border-zinc-800 flex justify-between">
                  <span className="text-zinc-400">nvlddmkm.sys (Driver GPU NVIDIA):</span>
                  <span className="text-yellow-400 font-bold">Causado por gestión de energía</span>
                </div>
                <div className="p-2.5 bg-black/60 rounded-lg border border-zinc-800 flex justify-between">
                  <span className="text-zinc-400">ndis.sys (Driver Ethernet / WiFi):</span>
                  <span className="text-amber-400 font-bold">Interrupciones de red masivas</span>
                </div>
                <div className="p-2.5 bg-black/60 rounded-lg border border-zinc-800 flex justify-between">
                  <span className="text-zinc-400">wdf01000.sys (Driver Framework):</span>
                  <span className="text-sky-400 font-bold">Periféricos USB con sondeo a 8000 Hz</span>
                </div>
              </div>
            </div>

            {/* Real Telemetry Table */}
            <div className="p-6 rounded-2xl bg-[#111216] border border-zinc-800 space-y-4">
              <div className="space-y-1">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold block">
                  MATRIZ DE SENSORES CONFIABLES
                </span>
                <h4 className="font-display font-black text-xl text-white uppercase">
                  Qué Medir vs. Qué Ignorar
                </h4>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  Las métricas de software genérico engañan. Esta es la tabla pericial de parámetros reales que deben auditarse en un banco de diagnóstico:
                </p>
              </div>

              <div className="space-y-3 font-mono-tech text-xs">
                {TELEMETRY_METRICS.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white uppercase">{m.metric}</span>
                      <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
                        {m.unit}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans-editorial text-zinc-300 leading-relaxed">
                      <strong>Por qué mienten:</strong> {m.whyAveragesLie}
                    </p>
                    <div className="text-[10px] text-emerald-400 pt-0.5">
                      ✓ Umbral objetivo: {m.targetThreshold}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECCIÓN 3: PROTOCOLO DE DIAGNÓSTICO FORENSE               */}
      {/* ========================================================= */}
      {activeTab === 'forensics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>PERITAJE TÉCNICO // HARDWARE ANTES QUE SOFTWARE</span>
            </div>
            <span className="text-[11px] font-mono-tech text-zinc-500 uppercase">METODOLOGÍA DEDUCTIVA EVO</span>
          </div>

          {/* Core Axiom Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-black to-[#13141a] border border-amber-500/40 space-y-3">
            <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs font-bold uppercase">
              <Flame className="w-4 h-4" />
              <span>AXIOMA FUNDACIONAL EVO // NO LO CREAS. COMPROBALO.</span>
            </div>
            <p className="font-sans-editorial text-sm sm:text-base text-zinc-200 leading-relaxed font-medium">
              “NUNCA apliques un tweak de registro de Windows, formatees el disco ni culpes a un controlador sin antes haber descartado con certeza científica la integridad física de las capas de hardware.”
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono-tech text-zinc-400 pt-1">
              <span>1. Contacto térmico verificado</span>
              <span>•</span>
              <span>2. Líneas mecánicas PCIe sin pandeo</span>
              <span>•</span>
              <span>3. Pines de zócalo LGA inspeccionados</span>
              <span>•</span>
              <span>4. Sustitución cruzada A/B</span>
            </div>
          </div>

          {/* 4 Forensic Cases with Interactive Inspection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold">
                CASOS FORENSES REALES // SELECCIONÁ UN EXPEDIENTE DE BANCO
              </span>
              <span className="text-[10px] font-mono-tech text-yellow-400 font-semibold">
                EVIDENCIA COMPROBADA
              </span>
            </div>

            {/* Case Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {FORENSIC_CASE_STUDIES.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCase(c.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    selectedCase === c.id
                      ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-lg shadow-yellow-400/10'
                      : 'bg-[#111216] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono-tech">
                    <span className="text-yellow-400 font-bold">EXPEDIENTE 0{i + 1}</span>
                    <span className="text-zinc-500">AUTOPSIA</span>
                  </div>
                  <span className="font-mono-tech text-xs font-bold text-white line-clamp-2">
                    {c.symptom}
                  </span>
                  <div className="text-[10px] font-mono-tech text-zinc-500 flex items-center gap-1">
                    <span>Ver protocolo</span>
                    <ArrowRight className="w-3 h-3 text-yellow-400" />
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Case Detail View */}
            {(() => {
              const activeCase = FORENSIC_CASE_STUDIES.find((c) => c.id === selectedCase) || FORENSIC_CASE_STUDIES[0];

              return (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#111216] border-2 border-zinc-700 space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-2">
                    <div>
                      <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
                        ANÁLISIS PERICIAL DE FALLA // CASO ACTIVO
                      </span>
                      <h4 className="font-display font-black text-xl sm:text-2xl text-white uppercase mt-0.5">
                        {activeCase.symptom}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono-tech font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                      RESOLUCIÓN DEFINITIVA
                    </span>
                  </div>

                  {/* Visual Evidence Photo depending on case */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-3">
                      <div className="relative rounded-xl overflow-hidden border border-zinc-800 group shadow-xl">
                        <img
                          src={
                            activeCase.id === 'case-thermal-film'
                              ? '/assets/magazine/thermal_plastic_peel.jpg'
                              : activeCase.id === 'case-pcie-sag-x4'
                              ? '/assets/magazine/pcie_gpu_bus_forensic.jpg'
                              : activeCase.id === 'case-ram-channel-drop'
                              ? '/assets/magazine/daisy_chain_pcb.jpg'
                              : '/assets/magazine/dpc_latency_ring0.jpg'
                          }
                          alt="Evidencia pericial de hardware"
                          className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-3">
                          <span className="text-[10px] font-mono-tech text-yellow-400 font-bold uppercase">
                            REGISTRO FOTOGRÁFICO
                          </span>
                          <span className="text-[11px] font-mono-tech text-zinc-200">
                            Inspección física en banco de pruebas abierto.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-[11px] font-mono-tech text-zinc-400">
                        <span className="text-yellow-400 font-bold block mb-1">REGLA INQUEBRANTABLE:</span>
                        {activeCase.preventionRule}
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4 font-mono-tech text-xs">
                      {/* Myth vs Evidence */}
                      <div className="p-4 rounded-xl bg-black/60 border border-red-500/30 space-y-1">
                        <span className="text-red-400 font-bold uppercase block text-[10px]">
                          EL MITO O DIAGNÓSTICO ERRADO INICIAL:
                        </span>
                        <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                          {activeCase.initialMyth}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-black/60 border border-yellow-400/30 space-y-1">
                        <span className="text-yellow-400 font-bold uppercase block text-[10px]">
                          LA EVIDENCIA FÍSICA OBSERVADA EN BANCO:
                        </span>
                        <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                          {activeCase.forensicEvidence}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 space-y-1">
                        <span className="text-emerald-400 font-bold uppercase block text-[10px]">
                          CAUSA RAÍZ Y PROCEDIMIENTO CORRECTIVO:
                        </span>
                        <p className="font-sans-editorial text-xs text-zinc-200 leading-relaxed">
                          <strong className="text-white">Causa Raíz:</strong> {activeCase.rootCause}
                        </p>
                        <p className="font-sans-editorial text-xs text-emerald-300 leading-relaxed pt-1">
                          <strong className="text-emerald-400">Solución:</strong> {activeCase.resolution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Bottom Switch back to Passport */}
      {onJumpToPassport && (
        <div className="p-6 rounded-2xl bg-[#0f1014] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
              APLICAR LO APRENDIDO A TU MÁQUINA
            </span>
            <h4 className="font-display font-bold text-lg text-white uppercase">
              ¿Listo para completar el Pasaporte de tu propia PC?
            </h4>
            <p className="font-sans-editorial text-xs text-zinc-400">
              Contrastá la evidencia que devuelve Windows contra estos fundamentos técnicos.
            </p>
          </div>

          <button
            type="button"
            onClick={onJumpToPassport}
            className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-lg"
          >
            <span>VOLVER AL PASAPORTE DE MI PC</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
