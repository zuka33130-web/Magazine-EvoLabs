import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Activity,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { FinalComparisonData, OptimizationMetricsSnapshot } from '../../types';

interface Station08NormalVsCleanProps {
  initialComparison?: FinalComparisonData;
  onSaveComparison: (data: FinalComparisonData) => void;
  onFinishLaboratorio: () => void;
}

export const Station08NormalVsClean: React.FC<Station08NormalVsCleanProps> = ({
  initialComparison,
  onSaveComparison,
  onFinishLaboratorio,
}) => {
  const defaultComparison: FinalComparisonData = {
    game: 'VALORANT',
    resolution: '1280×720',
    variablesControlledChecklist: {
      sameGame: true,
      sameResolution: true,
      sameQuality: true,
      sameFpsCap: true,
      sameScene: true,
      sameDriver: true,
      sameSettings: true,
      sameDuration: true,
    },
    isComparable: true,
    normalMode: {
      processes: 108,
      ramGb: 5.4,
      fps: 171,
      onePctLow: 118,
      symptoms: ['Microtirones esporádicos al inicio de ronda'],
    },
    cleanMode: {
      processes: 91,
      ramGb: 4.6,
      fps: 176,
      onePctLow: 134,
      symptoms: ['Mayor suavidad en giros rápidos y combates densos'],
    },
    conclusion: {
      freedResources: '0.8 GB de memoria RAM liberados y 17 procesos de fondo eliminados.',
      performance: 'Cambio modesto en FPS promedio (+5 FPS / +2.9%).',
      stability: 'Mejora observable en 1% Low (+16 FPS / +13.5%).',
      perceivedExperience: 'Disminución apreciable de interrupciones repentinas de cadencia.',
    },
  };

  const [comparison, setComparison] = useState<FinalComparisonData>(
    initialComparison || defaultComparison
  );

  const handleToggleChecklist = (
    key: keyof FinalComparisonData['variablesControlledChecklist']
  ) => {
    setComparison((prev) => {
      const nextChecklist = {
        ...prev.variablesControlledChecklist,
        [key]: !prev.variablesControlledChecklist[key],
      };
      const allControlled = Object.values(nextChecklist).every(Boolean);
      return {
        ...prev,
        variablesControlledChecklist: nextChecklist,
        isComparable: allControlled,
      };
    });
  };

  const handleNormalMetricChange = (key: keyof OptimizationMetricsSnapshot, value: any) => {
    setComparison((prev) => ({
      ...prev,
      normalMode: { ...prev.normalMode, [key]: value },
    }));
  };

  const handleCleanMetricChange = (key: keyof OptimizationMetricsSnapshot, value: any) => {
    setComparison((prev) => ({
      ...prev,
      cleanMode: { ...prev.cleanMode, [key]: value },
    }));
  };

  const handleFinalSave = () => {
    onSaveComparison(comparison);
    onFinishLaboratorio();
  };

  const ramDelta = Number((comparison.normalMode.ramGb - comparison.cleanMode.ramGb).toFixed(2));
  const procDelta = comparison.normalMode.processes - comparison.cleanMode.processes;
  const fpsDelta = (comparison.cleanMode.fps ?? 0) - (comparison.normalMode.fps ?? 0);
  const oneLowDelta =
    (comparison.cleanMode.onePctLow ?? 0) - (comparison.normalMode.onePctLow ?? 0);

  return (
    <section
      id="estacion-08-modo-normal-vs-modo-limpio"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">ESTACIÓN 08 // 08</span>
          <span>•</span>
          <span>LA PRUEBA FINAL EN JUEGO</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          08 // MODO NORMAL VS MODO LIMPIO
        </h2>
        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
          “Misma PC. Mismo juego. Misma escena. Distinto ruido de fondo.”
        </p>
      </div>

      {/* Context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-zinc-800/80 font-sans-editorial text-sm text-zinc-300 leading-relaxed space-y-3">
        <p>
          Llegó el momento de la verdad empírica: no probamos en un benchmark sintético ni nos dejamos
          llevar por la sugestión psicológica del “efecto placebo”.
        </p>
        <p className="text-white font-medium">
          Vamos a contrastar el <strong>Modo Normal</strong> (tu entorno cotidiano con launchers,
          sincronizadores y navegadores abiertos) contra el <strong>Modo Limpio EVO</strong> (donde
          únicamente aplicaste las intervenciones controladas y medidas en este laboratorio).
        </p>
      </div>

      {/* Checklist de Variables Controladas */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/30 space-y-4 font-mono-tech text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
          <span className="text-yellow-400 font-bold uppercase flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            CONTROL DE VARIABLES EXPERIMENTALES (ISO-CONDICIÓN)
          </span>
          <span
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
              comparison.isComparable
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}
          >
            {comparison.isComparable ? 'PRUEBA ALTAMENTE COMPARABLE' : 'PRUEBA CON VARIACIÓN EXTERNA'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'sameGame', label: 'Mismo juego' },
            { key: 'sameResolution', label: 'Misma resolución' },
            { key: 'sameQuality', label: 'Misma calidad' },
            { key: 'sameFpsCap', label: 'Mismo límite FPS' },
            { key: 'sameScene', label: 'Mismo mapa / escena' },
            { key: 'sameDriver', label: 'Mismo driver GPU' },
            { key: 'sameSettings', label: 'Mismo plan de energía' },
            { key: 'sameDuration', label: 'Misma duración corrida' },
          ].map(({ key, label }) => {
            const isChecked =
              comparison.variablesControlledChecklist[
                key as keyof FinalComparisonData['variablesControlledChecklist']
              ];
            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  handleToggleChecklist(
                    key as keyof FinalComparisonData['variablesControlledChecklist']
                  )
                }
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-black/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-black/20 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                    isChecked ? 'bg-emerald-400 text-black' : 'border border-zinc-700'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] font-bold truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Modo Normal vs Modo Limpio EVO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono-tech text-xs">
        {/* Modo Normal */}
        <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-zinc-300 uppercase">PRUEBA A // MODO NORMAL</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 font-bold">
              RUIDO HABITUAL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">PROCESOS TOTALES</span>
              <input
                type="number"
                value={comparison.normalMode.processes}
                onChange={(e) =>
                  handleNormalMetricChange('processes', Number(e.target.value) || 0)
                }
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">RAM REPOSO (GB)</span>
              <input
                type="number"
                step="0.1"
                value={comparison.normalMode.ramGb}
                onChange={(e) => handleNormalMetricChange('ramGb', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">FPS PROMEDIO</span>
              <input
                type="number"
                value={comparison.normalMode.fps ?? 171}
                onChange={(e) => handleNormalMetricChange('fps', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">1% LOW (ESTABILIDAD)</span>
              <input
                type="number"
                value={comparison.normalMode.onePctLow ?? 118}
                onChange={(e) =>
                  handleNormalMetricChange('onePctLow', Number(e.target.value) || 0)
                }
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modo Limpio EVO */}
        <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/40 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-yellow-400 uppercase">PRUEBA B // MODO LIMPIO EVO</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-400/10 text-yellow-400 font-bold border border-yellow-400/30">
              OPTIMIZACIÓN CONTROLADA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">PROCESOS TOTALES</span>
              <input
                type="number"
                value={comparison.cleanMode.processes}
                onChange={(e) =>
                  handleCleanMetricChange('processes', Number(e.target.value) || 0)
                }
                className="w-full bg-transparent text-emerald-400 font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">RAM REPOSO (GB)</span>
              <input
                type="number"
                step="0.1"
                value={comparison.cleanMode.ramGb}
                onChange={(e) => handleCleanMetricChange('ramGb', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-emerald-400 font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">FPS PROMEDIO</span>
              <input
                type="number"
                value={comparison.cleanMode.fps ?? 176}
                onChange={(e) => handleCleanMetricChange('fps', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-yellow-400 font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">1% LOW (ESTABILIDAD)</span>
              <input
                type="number"
                value={comparison.cleanMode.onePctLow ?? 134}
                onChange={(e) =>
                  handleCleanMetricChange('onePctLow', Number(e.target.value) || 0)
                }
                className="w-full bg-transparent text-emerald-400 font-bold text-lg focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desglose Pericial en 4 Bloques */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121319] to-black border border-yellow-400/50 space-y-4 font-mono-tech text-xs">
        <span className="font-bold text-yellow-400 uppercase block tracking-wider">
          BALANCE PERICIAL FINAL // ANTES VS DESPUÉS
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-black/50 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">
              1. RECURSOS LIBERADOS
            </span>
            <span className="text-emerald-400 font-bold text-base block">
              {ramDelta > 0 ? `+${ramDelta}` : ramDelta} GB RAM
            </span>
            <span className="text-zinc-400 text-[11px] block">
              {procDelta > 0 ? `-${procDelta}` : procDelta} procesos eliminados
            </span>
          </div>

          <div className="p-4 bg-black/50 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">
              2. RENDIMIENTO PROMEDIO
            </span>
            <span className="text-yellow-400 font-bold text-base block">
              {fpsDelta >= 0 ? `+${fpsDelta}` : fpsDelta} FPS ({((fpsDelta / (comparison.normalMode.fps || 1)) * 100).toFixed(1)}%)
            </span>
            <span className="text-zinc-400 text-[11px] block">Cambio modesto esperado</span>
          </div>

          <div className="p-4 bg-black/50 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">
              3. ESTABILIDAD (1% LOW)
            </span>
            <span className="text-emerald-400 font-bold text-base block">
              {oneLowDelta >= 0 ? `+${oneLowDelta}` : oneLowDelta} FPS ({((oneLowDelta / (comparison.normalMode.onePctLow || 1)) * 100).toFixed(1)}%)
            </span>
            <span className="text-zinc-400 text-[11px] block">Mejora tangible en tirones</span>
          </div>

          <div className="p-4 bg-black/50 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">
              4. EXPERIENCIA
            </span>
            <span className="text-white font-bold text-xs block truncate mt-1">
              Mayor consistencia
            </span>
            <span className="text-zinc-400 text-[11px] block">Sin micro-congelamientos</span>
          </div>
        </div>
      </div>

      {/* Aprendizaje Fundamental */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border-l-4 border-yellow-400 space-y-2">
        <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400 tracking-wider block">
          APRENDIZAJE FUNDAMENTAL DEL CAPÍTULO 05
        </span>
        <p className="font-sans-editorial text-base sm:text-lg text-white font-semibold italic leading-relaxed">
          “Liberar recursos sólo es útil para el rendimiento si esos recursos estaban participando activamente en la limitación observada.”
        </p>
        <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
          Si tu PC estaba limitada por la GPU a 100%, cerrar un launcher en segundo plano no aumentará
          mágicamente la tasa máxima de cuadros de la tarjeta gráfica. Lo que sí hace es liberar al
          procesador de interrupciones repentinas, garantizando que el flujo de cuadros entregado a la
          pantalla sea regular, suave y predecible.
        </p>
      </div>

      {/* Action to proceed */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          id="btn-finalizar-laboratorio-c05"
          onClick={handleFinalSave}
          className="px-7 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-all shadow-xl hover:shadow-yellow-400/30 flex items-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4 text-black" />
          <span>FINALIZAR EXPERIMENTO // GENERAR ARTEFACTOS EVO →</span>
        </button>
      </div>
    </section>
  );
};
