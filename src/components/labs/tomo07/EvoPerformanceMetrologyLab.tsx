// ============================================================================
// EVO LABS // TOMO 07: EVO PERFORMANCE METROLOGY LAB
// 07A Frametime Lab | 07B Frame Pacing Analyzer | 07C Bottleneck Investigator
// 07D A/B Performance Bench | 07E Cap & Refresh Lab | 07F Input Pipeline
// ============================================================================

import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Cpu,
  Gauge,
  HardDrive,
  Layers,
  LineChart,
  Monitor,
  MousePointer,
  RotateCcw,
  Sparkles,
  Thermometer,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { EvoLabFramework } from '../framework/EvoLabFramework';
import {
  DataOrigin,
  GuidedCase,
  SubLabModule,
  VerdictType,
} from '../framework/types';

interface EvoPerformanceMetrologyLabProps {
  onClose?: () => void;
  initialSubLabId?: string;
}

const TOMO_07_SUBLABS: SubLabModule[] = [
  {
    id: '07a-frametime',
    code: '07A',
    title: 'FRAMETIME METROLOGY // FPS VS FRAMETIME',
    subtitle: 'Análisis de series temporales de cuadros, mediana y percentiles 1% / 0.1% Low',
    category: 'METROLOGÍA DE CUADROS',
    description:
      'Comprobá por qué el promedio de FPS oculta el micro-stuttering. Analizá series temporales completas de entrega de fotogramas, calculando la mediana real y los percentiles 1% Low y 0.1% Low según la especificación CapFrameX / PresentMon.',
    standardReference: 'PresentMon ETW Protocol / CapFrameX Metrology Standard',
    systemVariables: [
      { name: 'Carga Gráfica', description: 'Escena estable vs Escena con carga masiva de texturas y partículas' },
      { name: 'Configuración de Memoria', description: 'Dual Channel DDR5 CL30 vs Single Channel DDR5 CL40' },
      { name: 'Tasa de Muestreo', description: 'Captura continua de 1,000 fotogramas consecutivos' },
    ],
    metrics: [
      {
        key: 'frametime_median',
        name: 'Mediana de Frametime',
        unit: 'ms',
        whatIsIt: 'Tiempo representativo que tarda la GPU/CPU en renderizar un cuadro central.',
        whereItComesFrom: 'Mediana estadística del tiempo de presentación en pantalla.',
        whatItMeans: 'Fluidez visual percibida estable en el centro de la distribución.',
        whatItDoesNotMean: 'No garantiza que no existan tirones aislados en los percentiles inferiores.',
        formulaOrDetail: 'Frametime(ms) = 1000 / FPS_instantáneo',
        dataOrigin: 'SIMULATED',
      },
      {
        key: 'one_percent_low',
        name: 'Percentil 1% Low',
        unit: 'FPS',
        whatIsIt: 'Promedio del 1% de los cuadros más lentos durante la sesión de juego.',
        whereItComesFrom: 'Cálculo del percentil 99 de los tiempos de cuadro convertidos a FPS.',
        whatItMeans: 'Sensación de estabilidad y ausencia de micro-cortes perceptibles.',
        whatItDoesNotMean: 'No es la tasa mínima absoluta de un solo fotograma atípico.',
        formulaOrDetail: '1% Low = 1000 / Percentile(Frametimes, 0.99)',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La regularidad matemática con la que cada cuadro se entrega al monitor.',
      whyItMatters: 'Un juego a 140 FPS de promedio con 1% Low de 35 FPS se siente trabado y errático.',
      whatCanBeConcluded: 'Un frametime plano a 16.6 ms (60 FPS) ofrece una experiencia más suave que 120 FPS oscilando bruscamente entre 8ms y 35ms.',
      whatCannotBeConcluded: 'No concluyas que la GPU tiene la culpa si el 1% Low cae por contención en el hilo principal de la CPU.',
      evoGoldenRule: 'REGLA EVO: En rendimiento competitivo, la consistencia del 1% Low supera en importancia al pico de FPS promedio.',
    },
  },
  {
    id: '07b-pacing',
    code: '07B',
    title: 'FRAME PACING ANALYZER // STUTTER CLUSTERS',
    subtitle: 'Detección de patrones periódicos vs esporádicos de tartamudeo',
    category: 'ESTABILIDAD TEMPORAL',
    description:
      'Identificá la causa raíz del stuttering analizando su periodicidad: picos cada 60 segundos (recolector de basura de motor / guardado en disco) vs caídas aleatorias por contención de texturas en VRAM.',
    standardReference: 'DirectX 12 Swapchain Flip Model / Vulkan Presentation Engine',
    systemVariables: [
      { name: 'Periodicidad de Picos', description: 'Picos cada 1,000ms (Polling de software) vs Picos esporádicos (Shader Compilation)' },
      { name: 'Saturación de VRAM', description: '95% de uso de memoria de video con trasvase al bus PCIe' },
    ],
    metrics: [
      {
        key: 'stutter_rate',
        name: 'Índice de Inestabilidad (Stutter Rate)',
        unit: '%',
        whatIsIt: 'Porcentaje de cuadros cuya duración difiere en más de 4ms respecto al cuadro previo.',
        whereItComesFrom: 'Derivada discreta $|Frametime_{i} - Frametime_{i-1}| > 4.0\\text{ ms}$.',
        whatItMeans: 'Irregularidad en la cadencia de presentación que el ojo percibe como tirón.',
        whatItDoesNotMean: 'No significa fallo del monitor.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La cadencia rítmica de los cuadros y la agrupación de picos de retardo.',
      whyItMatters: 'Los picos periódicos delatan software en segundo plano (RGB, antivirus, telemetría) robando ciclos de CPU.',
      whatCanBeConcluded: 'Si los picos ocurren exactamente cada 30 segundos, el culpable es un proceso en segundo plano, no el motor gráfico.',
      whatCannotBeConcluded: 'No compres una placa de video más cara para solucionar un stuttering causado por una app en segundo plano.',
      evoGoldenRule: 'REGLA EVO: Analizá el ritmo de los picos; la periodicidad revela al culpable.',
    },
  },
  {
    id: '07c-bottleneck',
    code: '07C',
    title: 'BOTTLENECK INVESTIGATOR // SATURACIÓN',
    subtitle: 'Diagnóstico multidimensional sin reglas simplistas de porcentaje único',
    category: 'DIAGNÓSTICO DE SATURACIÓN',
    description:
      'Investigá cuellos de botella con rigor científico. Analizá por qué una CPU al 35% de uso global puede estar limitando la GPU si el hilo principal de render (Core 0) se encuentra al 100%.',
    standardReference: 'AMD / Intel Single-Thread Performance Spec / NVIDIA Nsight Graphics',
    systemVariables: [
      { name: 'Uso de GPU Core', description: '68% (Subutilizada por CPU) vs 99% (Saturación gráfica ideal)' },
      { name: 'Carga de CPU en Core 0', description: '100% en Hilo Principal de Render vs Carga distribuida' },
      { name: 'Ancho de Banda PCIe', description: 'PCIe 4.0 x16 (31.5 GB/s) vs PCIe 3.0 x4 (3.9 GB/s)' },
    ],
    metrics: [
      {
        key: 'gpu_utilization',
        name: 'Aprovechamiento de GPU',
        unit: '%',
        whatIsIt: 'Porcentaje de ciclos en los que los Compute Units de la GPU ejecutan shaders.',
        whereItComesFrom: 'Contadores de rendimiento del controlador gráfico.',
        whatItMeans: 'Eficiencia con la que la CPU alimenta de órdenes de dibujado (Draw Calls) a la GPU.',
        whatItDoesNotMean: 'No significa que el juego esté mal optimizado si el FPS está limitado por cap voluntario.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La sincronía entre el generador de órdenes (CPU) y el ejecutor de renderizado (GPU).',
      whyItMatters: 'Mirar solo el "Uso de CPU 30%" en el Administrador de Tareas engaña: un procesador de 16 núcleos puede tener 1 núcleo al 100% frenando todo.',
      whatCanBeConcluded: 'Si la GPU está al 65% y el Core 0 de la CPU al 100%, tenés un cuello de botella en hilo único de CPU.',
      whatCannotBeConcluded: 'No asumas que cambiar la resolución de 1080p a 4K aumentará los FPS si el límite es la CPU.',
      evoGoldenRule: 'REGLA EVO: En gaming, el cuello de botella de CPU se mide por el núcleo más cargado, nunca por el promedio global.',
    },
  },
  {
    id: '07d-ab-bench',
    code: '07D',
    title: 'A/B PERFORMANCE BENCH // COMPARATIVA 1 VARIABLE',
    subtitle: 'Pruebas controladas con repetición x3, cálculo de mediana y descarte de ruido',
    category: 'BENCHMARKING CIENTÍFICO',
    description:
      'Ejecutá benchmarks periciales modificando UNA SOLA variable por vez: RAM Dual Channel CL30 vs Single Channel CL40, Resizable BAR activado vs desactivado.',
    standardReference: 'JEDEC DDR5 Timing Specification / PCI-SIG Resizable BAR Spec',
    systemVariables: [
      { name: 'Variable de Prueba', description: 'Dual Channel RAM vs Resizable BAR vs Plan de Energía' },
      { name: 'Repeticiones', description: '3 ejecuciones consecutivas para cálculo de mediana y varianza' },
    ],
    metrics: [
      {
        key: 'fps_median_delta',
        name: 'Delta de Mediana de Rendimiento',
        unit: 'FPS',
        whatIsIt: 'Diferencia real entre la mediana de la Configuración B y el Baseline A.',
        whereItComesFrom: 'Mediana de 3 ejecuciones de 60 segundos cada una.',
        whatItMeans: 'Ganancia o pérdida estadística sólida libre de ruido aleatorio.',
        whatItDoesNotMean: 'No es una prueba basada en una única captura aislada.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'El impacto cuantificable de una modificación técnica aislada.',
      whyItMatters: 'Cambiar 5 cosas al mismo tiempo impide saber cuál de ellas mejoró o empeoró el sistema.',
      whatCanBeConcluded: 'Activar Resizable BAR en GPUs modernas aumenta el 1% Low entre un 8% y un 15% en motores DX12.',
      whatCannotBeConcluded: 'Una sola prueba no es evidencia; la varianza térmica puede alterar los resultados en +/- 3%.',
      evoGoldenRule: 'REGLA EVO: Modificá una sola variable por vez y calculá la mediana de 3 corridas.',
    },
  },
  {
    id: '07e-cap-refresh',
    code: '07E',
    title: 'CAP & REFRESH // TIEMPOS DE ESCANEO',
    subtitle: 'Matemática visual del refresco: 60Hz (16.6ms), 144Hz (6.9ms), 240Hz (4.1ms)',
    category: 'SINCRONIZACIÓN DE PANTALLA',
    description:
      'Comprobá la relación matemática entre tasa de refresco (Hz), límite de FPS (Cap), ventana de sincronización VRR (G-Sync/FreeSync) y latencia de V-Sync.',
    standardReference: 'VESA Adaptive-Sync Standard / CTA-861 Timing Extensions',
    systemVariables: [
      { name: 'Frecuencia de Monitor', description: '60 Hz (16.67ms) vs 144 Hz (6.94ms) vs 240 Hz (4.17ms)' },
      { name: 'Modo de Sincronización', description: 'Sin límite (Tearing) vs V-Sync Tradicional (Input Lag) vs VRR + Cap (-3 FPS)' },
    ],
    metrics: [
      {
        key: 'scanout_time',
        name: 'Tiempo de Escaneo de Cuadro',
        unit: 'ms',
        whatIsIt: 'Tiempo que tarda el panel del monitor en actualizar todos los píxeles de arriba hacia abajo.',
        whereItComesFrom: 'Cálculo físico $T = 1000 / \\text{RefreshRate(Hz)}$.',
        whatItMeans: 'Retardo físico inherente a la tasa de refresco del display.',
        whatItDoesNotMean: 'No es el tiempo de respuesta GtG (gris a gris) del píxel.',
        formulaOrDetail: '60Hz=16.67ms / 144Hz=6.94ms / 240Hz=4.17ms',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La sincronía temporal entre la GPU que genera el cuadro y el monitor que lo dibuja.',
      whyItMatters: 'En monitores G-Sync/FreeSync de 144Hz, limitar los FPS a 141 (-3 FPS) evita entrar en la cola de buffer de V-Sync, eliminando el input lag.',
      whatCanBeConcluded: 'A 240Hz, cada ciclo de escaneo dura solo 4.17ms, reduciendo la penalización temporal de cuadros desincronizados.',
      whatCannotBeConcluded: 'Subir a 240Hz no te hará jugar mejor si el juego sufre de micro-stuttering a nivel de motor.',
      evoGoldenRule: 'REGLA EVO: Para VRR óptimo: G-Sync ON + V-Sync ON en panel de control + FPS Cap a Refresco - 3 FPS en el juego.',
    },
  },
  {
    id: '07f-input-pipeline',
    code: '07F',
    title: 'INPUT PIPELINE // CADENA DE LATENCIA',
    subtitle: 'Desglose etapa por etapa: Mouse -> USB Polling -> Motor -> CPU -> GPU -> Display',
    category: 'LATENCIA DE ENTRADA',
    description:
      'Mapeá la canalización completa de latencia desde el click físico del ratón hasta el cambio de color en el píxel del monitor. Comprobá cuánto aporta el polling rate USB (1000Hz vs 8000Hz) vs la cola de renderizado.',
    standardReference: 'USB HID Specification / NVIDIA Reflex SDK / AMD Anti-Lag+',
    systemVariables: [
      { name: 'Polling Rate de Ratón', description: '125 Hz (8ms) vs 1000 Hz (1ms) vs 8000 Hz (0.125ms)' },
      { name: 'Cola de Renderizado Pre-Rendered Frames', description: '1 Cuadro (NVIDIA Reflex / Low Latency) vs 3 Cuadros de buffer' },
    ],
    metrics: [
      {
        key: 'end_to_end_latency',
        name: 'Latencia Total Click-to-Photon',
        unit: 'ms',
        whatIsIt: 'Tiempo acumulado desde que el micro-switch del ratón cierra contacto hasta que el monitor emite luz.',
        whereItComesFrom: 'Suma pericial de las 6 etapas del pipeline de renderizado.',
        whatItMeans: 'Inmediatez absoluta de control sentida por el jugador.',
        whatItDoesNotMean: 'No es la latencia de red (Ping/RTT) al servidor.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La suma acumulativa de retrasos en hardware y software antes de ver tu acción en pantalla.',
      whyItMatters: 'Pasar de 1000Hz a 8000Hz en el mouse solo ahorra 0.875 ms, mientras que activar NVIDIA Reflex / Low Latency ahorra hasta 25 ms al eliminar la cola de la GPU.',
      whatCanBeConcluded: 'El mayor cuello de botella de input lag suele estar en las colas de fotogramas prerenderizados, no en el sensor del mouse.',
      whatCannotBeConcluded: 'Tener 5 ms de latencia click-to-photon no te protege del lag de red si tu ping al servidor es de 120 ms.',
      evoGoldenRule: 'REGLA EVO: Optimizá primero la cola de render de la GPU antes de gastar en periféricos de 8000 Hz.',
    },
  },
];

const TOMO_07_GUIDED_CASES: GuidedCase[] = [
  {
    id: 'case-07-01',
    caseNumber: 'CASO 01',
    title: 'Micro-stuttering constante en DDR5 Single Channel con GPU de alta gama',
    symptom: 'El juego indica 120 FPS pero se sienten tirones continuos en movimientos de cámara.',
    evidence: 'Frametime median es 8.3 ms pero el 1% Low cae a 32 FPS con varianza de 14.5 ms².',
    hypothesis: 'La memoria RAM en Single Channel limita el ancho de banda del IMC del procesador, asfixiando los Draw Calls.',
    testAction: 'Instalar segundo módulo DDR5 en Dual Channel CL30 en el banco de pruebas A/B.',
    resultSummary: 'El 1% Low sube de 32 FPS a 98 FPS (+206% de estabilidad); micro-stuttering erradicado.',
    conclusion: 'El ancho de banda de memoria dual channel es mandatorio para alimentar motores gráficos modernos.',
    targetSubLabId: '07a-frametime',
  },
  {
    id: 'case-07-02',
    caseNumber: 'CASO 02',
    title: 'GPU al 68% de uso en 1080p con procesador de 16 núcleos',
    symptom: 'La GPU RTX no pasa del 68% de carga y los FPS no suben de 85 a pesar de bajar los gráficos.',
    evidence: 'El hilo principal de la CPU (Core 0) se encuentra al 100% de uso sostenido.',
    hypothesis: 'Cuello de botella en rendimiento monohilo de CPU: el motor gráfico depende de un hilo principal para despachar llamadas de dibujado.',
    testAction: 'Activar optimización de llamadas de render y ajuste de frecuencias P-Core en el Bottleneck Investigator.',
    resultSummary: 'Uso de GPU escala al 97%; tasa de cuadros aumenta a 138 FPS.',
    conclusion: 'El porcentaje global de CPU no sirve para diagnosticar cuellos de botella en juegos. El límite lo impone el hilo principal.',
    targetSubLabId: '07c-bottleneck',
  },
  {
    id: 'case-07-03',
    caseNumber: 'CASO 03',
    title: 'Caídas bruscas a 15 FPS tras 10 minutos de juego por Thermal Throttling de VRM',
    symptom: 'El juego inicia perfecto a 144 FPS pero tras 10 minutos cae a 15 FPS durante 8 segundos y luego se recupera cíclicamente.',
    evidence: 'La frecuencia del procesador colapsa repentinamente de 4.8 GHz a 800 MHz cuando los VRM superan los 105°C.',
    hypothesis: 'Fases de alimentación de la placa madre sin disipación activa entran en protección térmica (PROCHOT).',
    testAction: 'Simular refrigeración de flujo de aire sobre disipadores VRM en el banco de pruebas.',
    resultSummary: 'Frecuencia estable a 4.8 GHz sostenidos sin caídas a 800 MHz.',
    conclusion: 'El estrangulamiento térmico de las fases de la placa madre es una de las causas más comunes de tirones periódicos severos.',
    targetSubLabId: '07b-pacing',
  },
  {
    id: 'case-07-04',
    caseNumber: 'CASO 04',
    title: 'Ganancia del 14% en 1% Low tras habilitar Resizable BAR en DirectX 12',
    symptom: 'Tirones leves al cruzar zonas abiertas en títulos de mundo abierto con streaming masivo de texturas.',
    evidence: 'Las transferencias de CPU a VRAM se realizan en bloques pequeños de 256 MB por falta de BAR remapeable.',
    hypothesis: 'Habilitar Resizable BAR permite a la CPU direccionar toda la VRAM simultáneamente, acelerando la carga de shaders.',
    testAction: 'Activar Resizable BAR en el banco A/B Performance Bench.',
    resultSummary: '1% Low sube de 71 FPS a 82 FPS (+15.4%) y el frametime variance se reduce en 40%.',
    conclusion: 'Resizable BAR elimina el cuello de botella de trasvase PCIe en motores DirectX 12 modernos.',
    targetSubLabId: '07d-ab-bench',
  },
  {
    id: 'case-07-05',
    caseNumber: 'CASO 05',
    title: 'Input lag elevado (45 ms) en monitor de 144Hz por V-Sync sin limitador',
    symptom: 'El movimiento del ratón se siente "pesado" o "flotante" a pesar de tener 144 FPS en pantalla.',
    evidence: 'V-Sync tradicional genera una cola de 3 cuadros prerenderizados en el buffer de intercambio (Swapchain).',
    hypothesis: 'La GPU produce cuadros más rápido que el refresco, acumulando búferes y disparando la latencia de entrada.',
    testAction: 'Configurar VRR + Cap a 141 FPS (-3 FPS) y activar NVIDIA Reflex / Low Latency en el Input Pipeline.',
    resultSummary: 'Latencia click-to-photon desciende de 46 ms a 14 ms sin tearing visible.',
    conclusion: 'El combo VRR + FPS Cap por debajo del refresco elimina la cola de presentación, ofreciendo la menor latencia posible.',
    targetSubLabId: '07f-input-pipeline',
  },
];

export const EvoPerformanceMetrologyLab: React.FC<EvoPerformanceMetrologyLabProps> = ({
  onClose,
  initialSubLabId,
}) => {
  const [activeSubLabId, setActiveSubLabId] = useState<string>(() => TOMO_07_SUBLABS.some((lab) => lab.id === initialSubLabId) ? initialSubLabId! : '07a-frametime');

  // 07A Frametime State
  const [ramConfig, setRamConfig] = useState<'single_cl40' | 'dual_cl30'>('single_cl40');

  // 07B Pacing State
  const [bgPolluterActive, setBgPolluterActive] = useState<boolean>(true);

  // 07C Bottleneck State
  const [resolutionPreset, setResolutionPreset] = useState<'1080p' | '1440p' | '4k'>('1080p');

  // 07D A/B Bench State
  const [rebarEnabled, setRebarEnabled] = useState<boolean>(false);

  // 07E Cap & Refresh State
  const [refreshRateHz, setRefreshRateHz] = useState<number>(144);
  const [syncMode, setSyncMode] = useState<'uncapped' | 'vsync_buffer' | 'vrr_cap'>('vsync_buffer');

  // 07F Input Pipeline State
  const [mousePolling, setMousePolling] = useState<1000 | 8000>(1000);
  const [reflexEnabled, setReflexEnabled] = useState<boolean>(false);

  return (
    <EvoLabFramework
      tomeId="tomo-07"
      tomeNumber="07"
      tomeTitle="GAMING PRO // METROLOGÍA DE RENDIMIENTO & FRAME PACING"
      accentColor="#f59e0b"
      subLabs={TOMO_07_SUBLABS}
      guidedCases={TOMO_07_GUIDED_CASES}
      activeSubLabId={activeSubLabId}
      onSelectSubLab={setActiveSubLabId}
      onClose={onClose}
      renderExperimentStation={({ activeSubLab, isDeepMode, onRecordMeasurement }) => {
        // LAB 07A // FRAMETIME LAB
        if (activeSubLab.id === '07a-frametime') {
          const avgFps = ramConfig === 'single_cl40' ? 118 : 142;
          const onePercentLow = ramConfig === 'single_cl40' ? 34 : 96;
          const medianFrametime = (1000 / avgFps).toFixed(2);
          const variance = ramConfig === 'single_cl40' ? '14.8 ms²' : '1.2 ms²';

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase">
                    CONFIGURACIÓN DE MEMORIA RAM
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setRamConfig('single_cl40')}
                      className={`w-full p-2.5 rounded text-left font-mono-tech text-xs font-bold ${
                        ramConfig === 'single_cl40'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Single Channel DDR5 CL40 (Ancho de banda recortado al 50%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRamConfig('dual_cl30')}
                      className={`w-full p-2.5 rounded text-left font-mono-tech text-xs font-bold ${
                        ramConfig === 'dual_cl30'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Dual Channel DDR5 CL30 (Baja latencia & ancho de banda pleno)
                    </button>
                  </div>
                </div>

                {/* Metrics Box */}
                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 grid grid-cols-3 gap-2 font-mono-tech text-center">
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">FPS PROMEDIO</div>
                    <div className="text-lg font-bold text-white mt-0.5">{avgFps}</div>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">1% LOW FPS</div>
                    <div className={`text-lg font-bold mt-0.5 ${onePercentLow < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {onePercentLow}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">VARIANZA</div>
                    <div className="text-lg font-bold text-amber-400 mt-0.5">{variance}</div>
                  </div>
                </div>
              </div>

              {/* Simulated Frametime Time-Series Graph */}
              <div className="p-4 rounded-xl bg-black/90 border border-zinc-800 font-mono-tech space-y-2">
                <div className="text-[10px] text-zinc-400 uppercase flex items-center justify-between">
                  <span>SERIE TEMPORAL DE FRAMETIMES (1,000 CUADROS CAPTURA CAPFRAMEX)</span>
                  <span>MEDIANA: {medianFrametime} ms</span>
                </div>
                <div className="h-24 w-full flex items-end gap-1 bg-zinc-950 p-2 rounded border border-zinc-900 overflow-hidden">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const isSpike = ramConfig === 'single_cl40' && (i % 6 === 0);
                    const height = isSpike ? 85 : ramConfig === 'single_cl40' ? 40 + (i % 5) * 5 : 25 + (i % 3) * 2;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-t transition-all ${
                          isSpike ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400/80'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>0 ms (Ideal)</span>
                  <span>{ramConfig === 'single_cl40' ? '⚠️ Picos de hasta 32 ms detectados (Stutter)' : '✓ Frametime plano y consistente (<8.5 ms)'}</span>
                  <span>40 ms</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTABILIDAD PERCIBIDA: {ramConfig === 'dual_cl30' ? 'FLUIDEZ COMPETITIVA PURA' : 'MICRO-STUTTERING SEVERO'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Topología de Memoria RAM (${ramConfig === 'dual_cl30' ? 'Dual CL30' : 'Single CL40'})`,
                      baselineValue: 34,
                      experimentValue: onePercentLow,
                      deltaValue: onePercentLow - 34,
                      metricKey: 'one_percent_low',
                      metricUnit: 'FPS',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Captura de tiempos de presentación protocolo PresentMon.',
                      samples: [onePercentLow, onePercentLow + 2, onePercentLow - 1],
                      interpretation:
                        ramConfig === 'dual_cl30'
                          ? 'Dual Channel duplica el ancho de banda efectivo del IMC, elevando el 1% Low de 34 a 96 FPS (+182%).'
                          : 'Single Channel asfixia la cola de Draw Calls generando micro-stuttering.',
                      verdict: ramConfig === 'dual_cl30' ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'La memoria Dual Channel es mandatoria para estabilizar el 1% Low.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR METROLOGÍA DE CUADROS →
                </button>
              </div>
            </div>
          );
        }

        // LAB 07B // FRAME PACING
        if (activeSubLab.id === '07b-pacing') {
          const stutterRate = bgPolluterActive ? 18.5 : 1.1;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase">
                    PROCESOS EN SEGUNDO PLANO
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setBgPolluterActive(true)}
                      className={`w-full p-2.5 rounded text-left font-mono-tech text-xs font-bold ${
                        bgPolluterActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Software RGB + Antivirus ejecutando escaneo periódico en hilo
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgPolluterActive(false)}
                      className={`w-full p-2.5 rounded text-left font-mono-tech text-xs font-bold ${
                        !bgPolluterActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Entorno Limpio // Cero interrupciones DPC en segundo plano
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2 text-center flex flex-col justify-center">
                  <div className="text-[10px] text-zinc-500">ÍNDICE DE STUTTERING</div>
                  <div className={`text-3xl font-black ${stutterRate > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {stutterRate}% <span className="text-xs font-normal text-zinc-400">de cuadros irregulares</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-sans-editorial">
                    {bgPolluterActive
                      ? 'Picos periódicos cada 30 segundos delatan software de telemetría de terceros.'
                      : 'Cadencia métrica uniforme sin interrupciones del hilo de render.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: {bgPolluterActive ? 'RUIDO PERIÓDICO DETECTADO' : 'FRAME PACING DETERMINISTA'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Interrupciones en Segundo Plano (${bgPolluterActive ? 'Activas' : 'Limpias'})`,
                      baselineValue: 18.5,
                      experimentValue: stutterRate,
                      deltaValue: (stutterRate - 18.5).toFixed(1),
                      metricKey: 'stutter_rate',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Derivada de frametimes consecutivos PresentMon.',
                      samples: [stutterRate, stutterRate, stutterRate],
                      interpretation: !bgPolluterActive
                        ? 'Cerrar procesos de telemetría y software RGB erradicó los tirones periódicos.'
                        : 'El software en segundo plano genera picos cíclicos de interrupción DPC.',
                      verdict: !bgPolluterActive ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Análisis de clusters de stuttering completado.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR ANÁLISIS DE PACING →
                </button>
              </div>
            </div>
          );
        }

        // LAB 07C // BOTTLENECK
        if (activeSubLab.id === '07c-bottleneck') {
          const gpuUsage = resolutionPreset === '1080p' ? 68 : resolutionPreset === '1440p' ? 88 : 99;
          const cpuCore0 = resolutionPreset === '1080p' ? 100 : resolutionPreset === '1440p' ? 82 : 65;
          const isCpuBound = gpuUsage < 90;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase">
                    RESOLUCIÓN DE RENDER
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono-tech">
                    <button
                      type="button"
                      onClick={() => setResolutionPreset('1080p')}
                      className={`p-2 rounded font-bold ${
                        resolutionPreset === '1080p' ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      1080p (CPU Bound)
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolutionPreset('1440p')}
                      className={`p-2 rounded font-bold ${
                        resolutionPreset === '1440p' ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      1440p (Equilibrado)
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolutionPreset('4k')}
                      className={`p-2 rounded font-bold ${
                        resolutionPreset === '4k' ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      4K (GPU Bound)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">USO DE GPU:</span>
                    <span className={`font-bold ${gpuUsage > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {gpuUsage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">CPU CORE 0 (HILO PRINCIPAL):</span>
                    <span className={`font-bold ${cpuCore0 === 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {cpuCore0}% {cpuCore0 === 100 ? '(⚠️ Saturado)' : ''}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 text-[11px] font-sans-editorial text-zinc-300">
                    {isCpuBound
                      ? 'Cuello de botella en Core 0: el hilo de la CPU no despacha suficientes órdenes para llenar la GPU.'
                      : 'GPU al 99%: los recursos gráficos están plenamente aprovechados.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  DIAGNÓSTICO: {isCpuBound ? 'CPU BOUND (Monohilo)' : 'GPU BOUND (Saturación Óptima)'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Resolución de Renderizado (${resolutionPreset})`,
                      baselineValue: 68,
                      experimentValue: gpuUsage,
                      deltaValue: gpuUsage - 68,
                      metricKey: 'gpu_utilization',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Telemetría de contadores de shader units GPU.',
                      samples: [gpuUsage, gpuUsage, gpuUsage],
                      interpretation: isCpuBound
                        ? 'En 1080p la GPU rinde al 68% porque el Core 0 de la CPU alcanzó el 100% de ocupación en Draw Calls.'
                        : 'Al subir la carga gráfica a 4K, la GPU se satura al 99% alcanzando su máximo rendimiento.',
                      verdict: !isCpuBound ? 'MEJORA' : 'INCONCLUSO',
                      conclusion: 'Cuello de botella monohilo identificado metrológicamente.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR SATURACIÓN →
                </button>
              </div>
            </div>
          );
        }

        // LAB 07D // A/B PERFORMANCE BENCH
        if (activeSubLab.id === '07d-ab-bench') {
          const fpsA = 112;
          const fpsB = rebarEnabled ? 128 : 112;
          const lowA = 71;
          const lowB = rebarEnabled ? 84 : 71;

          return (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                <div className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase">
                  VARIABLE DE EXPERIMENTO: RESIZABLE BAR (PCIe)
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRebarEnabled(false)}
                    className={`flex-1 p-2.5 rounded font-mono-tech text-xs font-bold ${
                      !rebarEnabled ? 'bg-rose-500/20 text-rose-300 border border-rose-500' : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    Baseline A // Resizable BAR: OFF (Bloques de 256MB)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRebarEnabled(true)}
                    className={`flex-1 p-2.5 rounded font-mono-tech text-xs font-bold ${
                      rebarEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500' : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    Experimento B // Resizable BAR: ON (Acceso completo a VRAM)
                  </button>
                </div>
              </div>

              {/* A/B Table */}
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 grid grid-cols-2 gap-4 font-mono-tech text-center">
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">BASELINE (REBAR OFF)</div>
                  <div className="text-lg font-bold text-white mt-1">{fpsA} FPS avg // {lowA} 1% Low</div>
                </div>
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">EXPERIMENTO (REBAR ON)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{fpsB} FPS avg // {lowB} 1% Low</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  GANANCIA COMPROBADA: {rebarEnabled ? '+14.2% en 1% Low (+13 FPS)' : '0% (Sin cambios)'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Resizable BAR (${rebarEnabled ? 'Activado' : 'Desactivado'})`,
                      baselineValue: lowA,
                      experimentValue: lowB,
                      deltaValue: lowB - lowA,
                      metricKey: 'fps_median_delta',
                      metricUnit: 'FPS',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Benchmark de 3 ejecuciones de 60s en motor DirectX 12.',
                      samples: [lowB, lowB + 1, lowB - 1],
                      interpretation: rebarEnabled
                        ? 'Habilitar Resizable BAR aumentó el 1% Low de 71 a 84 FPS al eliminar el cuello de botella de transferencia de texturas en el bus PCIe.'
                        : 'El sistema opera en el baseline por defecto.',
                      verdict: rebarEnabled ? 'MEJORA' : 'SIN CAMBIO',
                      conclusion: 'Ganancia de estabilidad demostrada mediante benchmark A/B.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR BENCHMARK A/B →
                </button>
              </div>
            </div>
          );
        }

        // LAB 07E // CAP & REFRESH
        if (activeSubLab.id === '07e-cap-refresh') {
          const scanTime = (1000 / refreshRateHz).toFixed(2);
          const lagEstimate = syncMode === 'vsync_buffer' ? Number(scanTime) * 3 : syncMode === 'vrr_cap' ? Number(scanTime) * 1.1 : Number(scanTime) * 0.8;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">
                    TASA DE REFRESCO DEL MONITOR (HZ)
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[60, 144, 240].map((hz) => (
                      <button
                        key={hz}
                        type="button"
                        onClick={() => setRefreshRateHz(hz)}
                        className={`p-2 rounded font-bold ${
                          refreshRateHz === hz ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        {hz} Hz
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">MODO DE SINCRONIZACIÓN</div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setSyncMode('uncapped')}
                      className={`w-full p-2 rounded text-left ${
                        syncMode === 'uncapped' ? 'bg-amber-400 text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Sin Límite // Tearing Visible (Mínimo Input Lag)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSyncMode('vsync_buffer')}
                      className={`w-full p-2 rounded text-left ${
                        syncMode === 'vsync_buffer' ? 'bg-rose-500/20 text-rose-300 border border-rose-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      V-Sync Tradicional // Búfer de 3 Cuadros (+45ms Lag)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSyncMode('vrr_cap')}
                      className={`w-full p-2 rounded text-left ${
                        syncMode === 'vrr_cap' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      G-Sync / FreeSync + FPS Cap (-3 FPS) // Óptimo
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 grid grid-cols-2 gap-4 font-mono-tech text-center">
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">TIEMPO DE ESCANEO PANEL</div>
                  <div className="text-xl font-bold text-white mt-0.5">{scanTime} ms</div>
                </div>
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">PENALIZACIÓN DE LATENCIA</div>
                  <div className={`text-xl font-bold mt-0.5 ${lagEstimate > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ~{lagEstimate.toFixed(1)} ms
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  TIEMPO DE ESCANEO A {refreshRateHz} HZ: {scanTime} ms
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Frecuencia y Sincronización (${refreshRateHz} Hz // ${syncMode})`,
                      baselineValue: 16.67,
                      experimentValue: Number(scanTime),
                      deltaValue: (Number(scanTime) - 16.67).toFixed(2),
                      metricKey: 'scanout_time',
                      metricUnit: 'ms',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Ecuación física de escaneo VESA T=1000/Hz.',
                      samples: [Number(scanTime), Number(scanTime), Number(scanTime)],
                      interpretation: `A ${refreshRateHz} Hz cada barrido de pantalla toma ${scanTime} ms, reduciendo la demora física de presentación.`,
                      verdict: refreshRateHz > 60 ? 'MEJORA' : 'SIN CAMBIO',
                      conclusion: 'Metrología de escaneo de display completada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR TIEMPO DE ESCANEO →
                </button>
              </div>
            </div>
          );
        }

        // LAB 07F // INPUT PIPELINE
        if (activeSubLab.id === '07f-input-pipeline') {
          const usbDelay = mousePolling === 8000 ? 0.125 : 1.0;
          const engineDelay = reflexEnabled ? 4.2 : 28.5; // Reflex removes queue
          const totalDelay = (usbDelay + engineDelay + 6.94).toFixed(1);

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">POLLING RATE DEL RATÓN</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMousePolling(1000)}
                      className={`flex-1 p-2 rounded font-bold ${
                        mousePolling === 1000 ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      1000 Hz (1.0 ms)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMousePolling(8000)}
                      className={`flex-1 p-2 rounded font-bold ${
                        mousePolling === 8000 ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      8000 Hz (0.125 ms)
                    </button>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-sans-editorial">
                    Pasar de 1000Hz a 8000Hz solo ahorra 0.875 ms en hardware.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">COLA DE RENDER DE GPU</div>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-zinc-950">
                    <input
                      type="checkbox"
                      checked={reflexEnabled}
                      onChange={(e) => setReflexEnabled(e.target.checked)}
                      className="rounded accent-emerald-400"
                    />
                    <span className="text-zinc-200">Activar Low Latency / NVIDIA Reflex (Elimina búfer de GPU)</span>
                  </label>
                  <div className="text-[11px] text-zinc-400 font-sans-editorial">
                    {reflexEnabled
                      ? '✓ Búfer de GPU vaciado: la CPU despacha el cuadro justo a tiempo (-24 ms).'
                      : '⚠️ Búfer de 2-3 cuadros acumulados en la cola de la GPU (+28 ms).'}
                  </div>
                </div>
              </div>

              {/* Pipeline Breakdown */}
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2">
                <div className="text-[10px] text-zinc-400 uppercase flex items-center justify-between">
                  <span>DESGLOSE PASO A PASO (CLICK-TO-PHOTON)</span>
                  <span>TOTAL: <strong className="text-emerald-400 text-sm">{totalDelay} ms</strong></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded bg-zinc-950">
                    <span className="text-zinc-500 text-[10px] block">1. USB POLLING</span>
                    <strong className="text-white">{usbDelay} ms</strong>
                  </div>
                  <div className="p-2 rounded bg-zinc-950">
                    <span className="text-zinc-500 text-[10px] block">2. MOTOR + COLA GPU</span>
                    <strong className={reflexEnabled ? 'text-emerald-400' : 'text-rose-400'}>{engineDelay} ms</strong>
                  </div>
                  <div className="p-2 rounded bg-zinc-950">
                    <span className="text-zinc-500 text-[10px] block">3. DISPLAY ESCANEO</span>
                    <strong className="text-white">6.9 ms</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  IMPACTO CLAVE: {reflexEnabled ? 'COLA DE GPU OPTIMIZADA' : 'COLA DE RENDER SATURADA (+24 ms)'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Optimizador de Cola de Render (${reflexEnabled ? 'Reflex Activado' : 'Búfer Tradicional'})`,
                      baselineValue: 36.4,
                      experimentValue: Number(totalDelay),
                      deltaValue: (Number(totalDelay) - 36.4).toFixed(1),
                      metricKey: 'end_to_end_latency',
                      metricUnit: 'ms',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Pipeline de latencia de entrada NVIDIA Reflex / AMD Anti-Lag.',
                      samples: [Number(totalDelay), Number(totalDelay), Number(totalDelay)],
                      interpretation: reflexEnabled
                        ? 'Vaciar la cola de la GPU reduce la latencia click-to-photon de 36.4 ms a 12.2 ms (-66%).'
                        : 'El búfer tradicional añade 24 ms de retardo de entrada perceptible.',
                      verdict: reflexEnabled ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Optimización de la cadena de entrada completada con éxito.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR CADENA DE LATENCIA →
                </button>
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
};
