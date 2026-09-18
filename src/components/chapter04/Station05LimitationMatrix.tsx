import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Flame,
  Layers,
  Award,
  Clock,
  Cpu,
  Zap,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  LimitationMatrixData,
  LimitationMatrixExportSchema,
  AbExperimentData,
  UserPcSpec,
  FluidezProfileData,
  LimitationType,
} from '../../types';

interface Station05LimitationMatrixProps {
  specs: Partial<UserPcSpec>;
  fluidezData: FluidezProfileData | null;
  experimentData: AbExperimentData;
  isCompleted: boolean;
  onConsolidate: () => void;
  onResetTest: () => void;
  onOpenChapter05: () => void;
  onBackToIndex: () => void;
}

export const Station05LimitationMatrix: React.FC<Station05LimitationMatrixProps> = ({
  specs,
  fluidezData,
  experimentData,
  isCompleted,
  onConsolidate,
  onResetTest,
  onOpenChapter05,
  onBackToIndex,
}) => {
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Determine Primary Limiter based on A/B Experiment
  const determineLimiter = (): {
    primary: LimitationType;
    label: string;
    rationale: string;
    secondary: string;
  } => {
    const delta = experimentData.fpsDeltaPct;
    const aGpu = experimentData.scenarioA.gpuUsagePct;
    const isIntegratedGpu =
      specs.gpuType === 'integrated' ||
      specs.gpu?.toLowerCase().includes('uhd') ||
      specs.gpu?.toLowerCase().includes('vega') ||
      specs.gpu?.toLowerCase().includes('iris') ||
      specs.gpu?.toLowerCase().includes('intel hd') ||
      specs.gpu?.toLowerCase().includes('radeon graphics') ||
      specs.gpu?.toLowerCase().includes('integrad');

    let secondaryNote = 'Ningún factor crítico secundario evidenciado';
    if (isIntegratedGpu) {
      secondaryNote =
        'Gráficos integrados (iGPU): comparte ancho de banda de memoria RAM y disipación con la CPU. La velocidad y Dual Channel de la RAM condicionan directamente el fillrate.';
    } else if (specs.ram?.toLowerCase().includes('single')) {
      secondaryNote =
        'Memoria en Single Channel detectada: riesgo de variabilidad y micro-stuttering en percentiles 1% Low.';
    }

    if (delta >= 18 || aGpu >= 94) {
      return {
        primary: 'GPU-BOUND',
        label: 'FACTOR LIMITANTE PROBABLE: RENDERIZADO GRÁFICO (GPU)',
        rationale:
          'Al reducir la demanda de píxeles, la cadencia de fotogramas escaló de forma sensible y la utilización gráfica en estado de base se mantuvo elevada. Los datos son consistentes con una limitación situada en el rasterizado o sombreado en esta configuración.',
        secondary: secondaryNote,
      };
    }

    if (delta <= 7 || aGpu <= 75) {
      return {
        primary: 'CPU-SINGLE-THREAD',
        label: 'FACTOR LIMITANTE PROBABLE: PLATAFORMA / CPU (Hilo de Render)',
        rationale:
          'Al reducir la carga de resolución, los fotogramas se mantuvieron prácticamente idénticos (+ ' +
          delta +
          '%). La GPU operó con margen de espera, indicando que el ritmo de entrega está condicionado por la CPU, sincronización o subsistema de memoria.',
        secondary: secondaryNote !== 'Ningún factor crítico secundario evidenciado' ? secondaryNote : 'Ancho de banda de memoria o latencia entre hilos en la escena',
      };
    }

    return {
      primary: 'BALANCED',
      label: 'RÉGIMEN DE TRANSICIÓN // CARGA COMPARTIDA',
      rationale:
        'La variación de fotogramas fue moderada (+ ' +
        delta +
        '%). En este punto de operación, la demanda fluctúa entre la carga gráfica y la lógica de la plataforma según la complejidad puntual de la escena.',
      secondary: secondaryNote,
    };
  };

  const limiterInfo = determineLimiter();

  // Strict EVO Editorial Rule Sentence
  const contextSentence = `En ${experimentData.game}, a ${experimentData.scenarioA.resolution} y calidad ${experimentData.scenarioA.quality}, la evidencia pericial es consistente con una limitación situada principalmente en ${
    limiterInfo.primary === 'GPU-BOUND'
      ? 'el PIPELINE DE RENDERIZADO GRÁFICO (GPU)'
      : limiterInfo.primary === 'CPU-SINGLE-THREAD'
      ? 'el SUBSISTEMA DE PLATAFORMA / PROCESADOR (CPU / Hilo de Render)'
      : 'un RÉGIMEN DE TRANSICIÓN HÍBRIDO'
  }.`;

  const matrixData: LimitationMatrixData = {
    primaryLimiter: limiterInfo.primary,
    secondaryLimiter: limiterInfo.secondary,
    confidenceScore: 'ALTA',
    contextSentence,
    scientificEvidence: [
      `Ensayo A/B: Escenario A (${experimentData.scenarioA.resolution}) ${experimentData.scenarioA.fps} FPS con ${experimentData.scenarioA.gpuUsagePct}% GPU.`,
      `Ensayo A/B: Escenario B (${experimentData.scenarioB.resolution}) ${experimentData.scenarioB.fps} FPS con ${experimentData.scenarioB.gpuUsagePct}% GPU.`,
      `Delta de escalabilidad por píxeles: ${experimentData.fpsDeltaPct >= 0 ? `+${experimentData.fpsDeltaPct}%` : `${experimentData.fpsDeltaPct}%`}.`,
      `Comportamiento registrado: ${limiterInfo.rationale}`,
    ],
    debunkedMyths: [
      limiterInfo.primary === 'GPU-BOUND'
        ? 'Mito: "Reemplazar el procesador por uno de gama entusiasta aumentará drásticamente los FPS en este juego a esta resolución". FALSO: en estas condiciones, la GPU ya opera en alta utilización y define la cadencia por cuadro.'
        : 'Mito: "Comprar una tarjeta gráfica de gama superior destrabará los FPS en este escenario". FALSO: con la GPU trabajando a ritmo moderado esperando órdenes, un nuevo silicio gráfico pasaría la mayor parte del tiempo en reposo.',
      'Mito: "Herramientas mágicas de limpieza de registro o boosters resuelven el cuello de botella". FALSO: ningún ajuste superficial de software altera las leyes de cadencia física entre núcleos y bus de datos.',
      'Mito: "Tu equipo tiene un porcentaje fijo de cuello de botella permanente". FALSO: el factor limitante se reubica dinámicamente al cambiar de motor, escena, resolución o configuración de calidad.',
    ],
    recommendedActions: [
      limiterInfo.primary === 'GPU-BOUND'
        ? 'Para aliviar el cuello de botella gráfico: aplicar tecnologías de reconstrucción temporal (DLSS, FSR, XeSS) o ajustar sombras, iluminación volumétrica y resolución.'
        : 'Para aliviar el factor plataforma: verificar configuración de memoria RAM (Dual Channel y perfil XMP/EXPO activo) y minimizar procesos intensivos en segundo plano.',
      'Monitorear temperaturas con HWiNFO para descartar thermal throttling en sesiones prolongadas bajo carga sostenida.',
      'Asegurar la instalación de títulos de mundo abierto en almacenamiento de estado sólido (SSD) para neutralizar caídas por streaming de activos.',
    ],
    counterproductiveActions: [
      'Gastar presupuesto en componentes sin haber medido primero el diálogo de cadencia.',
      'Tocar voltajes o multiplicadores a ciegas sin verificar la capacidad de los VRMs de la motherboard.',
      'Instalar software de optimización de terceros que agrega hilos en segundo plano.',
    ],
    registeredAt: new Date().toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  // Export to TXT format
  const handleExportTxt = () => {
    const lines = [
      '============================================================',
      'EVO LABS // EXPEDIENTE TÉCNICO // TOMO 01',
      'ARTEFACTO // MATRIZ DE LIMITACIÓN EVO 001',
      '============================================================',
      `FECHA DE REGISTRO: ${matrixData.registeredAt}`,
      '',
      '--- DICTAMEN PERICIAL CENTRAL (REGLA EDITORIAL EVO) ---',
      matrixData.contextSentence,
      '',
      `FACTOR LIMITANTE PRIMARIO: ${matrixData.primaryLimiter}`,
      `VULNERABILIDAD SECUNDARIA: ${matrixData.secondaryLimiter}`,
      `CONFIANZA DEL DIAGNÓSTICO: ${matrixData.confidenceScore}`,
      '',
      '--- CONTEXTO DE HARDWARE (HEREDADO C01) ---',
      `CPU: ${specs.cpu || 'No especificada'}`,
      `GPU: ${specs.gpu || 'No especificada'}`,
      `RAM: ${specs.ram || 'No especificada'}`,
      `ALMACENAMIENTO: ${specs.storage || 'No especificado'}`,
      '',
      '--- RESULTADOS DEL EXPERIMENTO CONTROLADO A/B (C04) ---',
      `JUEGO: ${experimentData.game}`,
      `VARIABLE ALTERADA: ${experimentData.variableChanged}`,
      `ESCENARIO A: ${experimentData.scenarioA.resolution} • ${experimentData.scenarioA.fps} FPS • ${experimentData.scenarioA.gpuUsagePct}% GPU`,
      `ESCENARIO B: ${experimentData.scenarioB.resolution} • ${experimentData.scenarioB.fps} FPS • ${experimentData.scenarioB.gpuUsagePct}% GPU`,
      `VARIACIÓN DE FPS: ${experimentData.fpsDeltaPct >= 0 ? `+${experimentData.fpsDeltaPct}%` : `${experimentData.fpsDeltaPct}%`}`,
      '',
      '--- EVIDENCIA CIENTÍFICA OBSERVADA ---',
      ...matrixData.scientificEvidence.map((e) => `• ${e}`),
      '',
      '--- MITOS Y PLACEBOS DESMENTIDOS ---',
      ...matrixData.debunkedMyths.map((m) => `[X] ${m}`),
      '',
      '--- ACCIONES TÉCNICAS RECOMENDADAS ---',
      ...matrixData.recommendedActions.map((a) => `[✓] ${a}`),
      '',
      '============================================================',
      'DOCUMENTO GENERADO POR EVO LABS // ARQUITECTURA DE COMPUTADORAS',
      '============================================================',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Matriz_Limitacion_EVO_001_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to JSON format
  const handleExportJson = () => {
    const exportSchema: LimitationMatrixExportSchema = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      artifact: 'MATRIZ DE LIMITACIÓN EVO 001',
      hardwareSpecs: specs,
      inheritedFluidez: fluidezData || undefined,
      experiment: experimentData,
      matrix: matrixData,
    };

    const blob = new Blob([JSON.stringify(exportSchema, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Matriz_Limitacion_EVO_001_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(
      `${matrixData.contextSentence}\n\nDiagnóstico: ${matrixData.primaryLimiter}\nEvidencia: ${matrixData.scientificEvidence.join(' | ')}`
    );
    setCopiedNotification('¡Dictamen copiado al portapapeles!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <section id="estacion-05-matriz-de-limitacion" className="space-y-6 pt-4">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase">
          <span className="text-yellow-400 font-bold">ESTACIÓN 05 // SÍNTESIS PERICIAL</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">MATRIZ DE LIMITACIÓN EVO 001</span>
        </div>
        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
          ARTEFACTO DE INVESTIGACIÓN CONSOLIDADO
        </span>
      </div>

      {/* Main Official Dossier Container */}
      <div
        id="artefacto-matriz-limitacion-evo-001"
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#121318] via-[#0f1014] to-[#0a0b0d] border-2 border-yellow-400/80 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]" />

        {/* Dossier Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold">
                EVO LABS // EXPEDIENTE TÉCNICO AUDITADO
              </span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Matriz de Limitación EVO 001
            </h3>
            <span className="text-xs font-mono-tech text-zinc-400 block">
              Registro pericial de cadencia y componentes limitantes.
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-tech uppercase font-bold tracking-widest bg-yellow-400 text-black shadow-md">
                <CheckCircle2 className="w-4 h-4 text-black" />
                CONSOLIDADO
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-tech uppercase font-bold tracking-widest bg-zinc-900 border border-yellow-400/50 text-yellow-400">
                LISTO PARA CONSOLIDAR
              </span>
            )}
          </div>
        </div>

        {/* Central Editorial Ruling (Mandatory Format) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-yellow-400/50 space-y-2">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
            DICTAMEN PERICIAL FORMAL
          </span>
          <p className="font-display font-black text-lg sm:text-xl md:text-2xl text-white uppercase tracking-tight leading-snug">
            “{matrixData.contextSentence}”
          </p>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
            {limiterInfo.rationale}
          </p>
        </div>

        {/* Primary and Secondary Limiter Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
            <span className="text-zinc-400 text-[10px] uppercase block">
              FACTOR LIMITANTE PRIMARIO
            </span>
            <span className="text-base font-bold text-yellow-400 block">
              {limiterInfo.label}
            </span>
            <span className="text-zinc-400 text-[11px] block">
              Determinado mediante prueba A/B de escala de píxeles.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
            <span className="text-zinc-400 text-[10px] uppercase block">
              RIESGO SECUNDARIO / PLATAFORMA
            </span>
            <span className="text-base font-bold text-white block">
              {matrixData.secondaryLimiter}
            </span>
            <span className="text-zinc-400 text-[11px] block">
              Monitoreo recomendado para evitar micro-stuttering.
            </span>
          </div>
        </div>

        {/* Empirical Evidence Points */}
        <div className="space-y-3 font-mono-tech text-xs">
          <span className="text-xs uppercase text-zinc-400 font-bold tracking-wider block">
            EVIDENCIA CIENTÍFICA OBSERVADA:
          </span>
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            {matrixData.scientificEvidence.map((ev, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                <span className="text-zinc-300">{ev}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Debunked Myths vs Concrete Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Myths */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono-tech text-rose-400 font-bold uppercase">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>MITOS DESMENTIDOS PARA TU CASO</span>
            </div>
            <div className="space-y-2 text-xs font-sans-editorial text-zinc-300">
              {matrixData.debunkedMyths.map((myth, idx) => (
                <p key={idx} className="leading-snug">
                  • {myth}
                </p>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono-tech text-emerald-400 font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ACCIONES TÉCNICAS FUNDADAS</span>
            </div>
            <div className="space-y-2 text-xs font-sans-editorial text-zinc-300">
              {matrixData.recommendedActions.map((action, idx) => (
                <p key={idx} className="leading-snug">
                  ✓ {action}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Export & Actions Row */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              type="button"
              id="btn-descargar-matriz-txt"
              onClick={handleExportTxt}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DESCARGAR .TXT</span>
            </button>
            <button
              type="button"
              id="btn-descargar-matriz-json"
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DESCARGAR .JSON</span>
            </button>
            <button
              type="button"
              id="btn-copiar-dictamen"
              onClick={handleCopyClipboard}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>COPIAR DICTAMEN</span>
            </button>
          </div>

          {copiedNotification && (
            <span className="text-emerald-400 text-xs font-mono-tech animate-in fade-in">
              {copiedNotification}
            </span>
          )}
        </div>

        {/* Big Consolidation Button */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono-tech text-zinc-400">
            {isCompleted
              ? 'Matriz guardada en tu expediente local. Capítulo 04 completado con éxito.'
              : 'Al consolidar, este diagnóstico se vinculará a tus próximos capítulos y desbloqueará el Capítulo 05.'}
          </div>

          {!isCompleted ? (
            <button
              type="button"
              id="btn-consolidar-capitulo-04"
              onClick={onConsolidate}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-xl shadow-yellow-400/20 hover:scale-[1.02] w-full sm:w-auto"
            >
              <span>CONSOLIDAR MATRIZ Y COMPLETAR CAPÍTULO 04</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                id="btn-rehacer-ensayo-c04"
                onClick={onResetTest}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono-tech text-xs uppercase bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>EDITAR ENSAYO</span>
              </button>
              <button
                type="button"
                id="btn-ir-capitulo-05"
                onClick={onOpenChapter05}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase bg-sky-400 text-black hover:bg-sky-300 transition-all cursor-pointer shadow-lg shadow-sky-400/20 w-full sm:w-auto"
              >
                <span>IR A CAPÍTULO 05 // WINDOWS EN MOVIMIENTO</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
