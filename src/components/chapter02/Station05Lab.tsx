import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Activity,
  Cpu,
  Layers,
  Monitor,
  HardDrive,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Info,
  Lightbulb,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  UserPcSpec,
  Lab02InputMode,
  Lab02ExperimentData,
  ComponentPhaseMetrics,
  FlowMapExportSchema,
} from '../../types';

interface Station05LabProps {
  specs: UserPcSpec;
  initialLabData?: Lab02ExperimentData;
  onSaveLabData: (data: Lab02ExperimentData) => void;
  onFinishLab: () => void;
  isCompleted: boolean;
}

const DEFAULT_LOADS = [
  'JUEGO',
  'NAVEGADOR CON VARIAS PESTAÑAS',
  'EDITOR DE VIDEO',
  'PROGRAMA PESADO',
  'OTRA APLICACIÓN',
];

export const Station05Lab: React.FC<Station05LabProps> = ({
  specs,
  initialLabData,
  onSaveLabData,
  onFinishLab,
  isCompleted,
}) => {
  // Load category selection
  const [loadCategory, setLoadCategory] = useState<string>(
    initialLabData?.loadCategory || 'JUEGO'
  );
  const [loadCustomName, setLoadCustomName] = useState<string>(
    initialLabData?.loadCustomName || ''
  );

  // Input mode: NIVELES (Bajo/Medio/Alto) vs NUMEROS (%)
  const [inputMode, setInputMode] = useState<Lab02InputMode>(
    initialLabData?.inputMode || 'NIVELES'
  );

  // Metrics for the three moments
  const [reposo, setReposo] = useState<ComponentPhaseMetrics>(
    initialLabData?.reposo || { cpu: 'BAJO', ram: 'BAJO', gpu: 'BAJO', disco: 'BAJO' }
  );
  const [carga, setCarga] = useState<ComponentPhaseMetrics>(
    initialLabData?.carga || { cpu: 'ALTO', ram: 'MEDIO', gpu: 'MEDIO', disco: 'ALTO' }
  );
  const [actividad, setActividad] = useState<ComponentPhaseMetrics>(
    initialLabData?.actividad || { cpu: 'MEDIO', ram: 'MEDIO', gpu: 'ALTO', disco: 'BAJO' }
  );

  const [activeVisualPhase, setActiveVisualPhase] = useState<'reposo' | 'carga' | 'actividad'>('carga');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Auto-save on changes
  useEffect(() => {
    const currentData: Lab02ExperimentData = {
      loadCategory,
      loadCustomName,
      inputMode,
      reposo,
      carga,
      actividad,
      completedAt: new Date().toISOString(),
    };
    onSaveLabData(currentData);
  }, [loadCategory, loadCustomName, inputMode, reposo, carga, actividad]);

  const handleMetricChange = (
    phase: 'reposo' | 'carga' | 'actividad',
    component: keyof ComponentPhaseMetrics,
    val: string
  ) => {
    if (phase === 'reposo') setReposo((prev) => ({ ...prev, [component]: val }));
    if (phase === 'carga') setCarga((prev) => ({ ...prev, [component]: val }));
    if (phase === 'actividad') setActividad((prev) => ({ ...prev, [component]: val }));
  };

  // Switch between input modes with sensible defaults
  const handleToggleInputMode = (newMode: Lab02InputMode) => {
    setInputMode(newMode);
    if (newMode === 'NUMEROS') {
      // populate with realistic percentage approximations if they were still text
      if (reposo.cpu === 'BAJO') setReposo({ cpu: '8', ram: '35', gpu: '3', disco: '2' });
      if (carga.cpu === 'ALTO') setCarga({ cpu: '85', ram: '60', gpu: '45', disco: '95' });
      if (actividad.cpu === 'MEDIO') setActividad({ cpu: '45', ram: '65', gpu: '88', disco: '5' });
    } else {
      if (!isNaN(Number(reposo.cpu))) setReposo({ cpu: 'BAJO', ram: 'MEDIO', gpu: 'BAJO', disco: 'BAJO' });
      if (!isNaN(Number(carga.cpu))) setCarga({ cpu: 'ALTO', ram: 'MEDIO', gpu: 'MEDIO', disco: 'ALTO' });
      if (!isNaN(Number(actividad.cpu))) setActividad({ cpu: 'MEDIO', ram: 'MEDIO', gpu: 'ALTO', disco: 'BAJO' });
    }
  };

  // Interpretations based on the recorded values
  const getInterpretations = (): string[] => {
    const result: string[] = [];

    // Storage check: Disk high in carga, low in actividad
    const discoCarga = carga.disco.toUpperCase();
    const discoAct = actividad.disco.toUpperCase();
    const isDiscoCargaHigh = discoCarga === 'ALTO' || Number(discoCarga) >= 50;
    const isDiscoActLow = discoAct === 'BAJO' || Number(discoAct) <= 25;

    if (isDiscoCargaHigh && isDiscoActLow) {
      result.push(
        'DISCO SUBE DURANTE LA CARGA Y DESPUÉS BAJA: Comportamiento completamente compatible con lectura inicial intensiva de archivos de assets y librerías desde almacenamiento a la memoria RAM.'
      );
    } else if (isDiscoCargaHigh) {
      result.push(
        'DISCO ACTIVO EN CARGA: Alta transferencia de bloques iniciales hacia el bus del sistema.'
      );
    }

    // RAM check: Higher in actividad and stays elevated
    const ramRep = reposo.ram.toUpperCase();
    const ramAct = actividad.ram.toUpperCase();
    const isRamHigher =
      (ramAct === 'MEDIO' && ramRep === 'BAJO') ||
      (ramAct === 'ALTO' && (ramRep === 'BAJO' || ramRep === 'MEDIO')) ||
      Number(ramAct) > Number(ramRep);

    if (isRamHigher) {
      result.push(
        'RAM AUMENTA Y PERMANECE ELEVADA: La aplicación mantiene su espacio de trabajo y sus estructuras residentes en memoria principal para evitar esperas al disco.'
      );
    }

    // GPU check
    const gpuAct = actividad.gpu.toUpperCase();
    const isGpuHigh = gpuAct === 'ALTO' || Number(gpuAct) >= 60;
    if (isGpuHigh) {
      result.push(
        'GPU ELEVADA DURANTE ACTIVIDAD: La aplicación demanda un volumen considerable de rasterización, shaders o cálculo gráfico en tiempo real.'
      );
    }

    // CPU check
    const cpuCarga = carga.cpu.toUpperCase();
    const isCpuActive = cpuCarga === 'ALTO' || Number(cpuCarga) >= 50;
    if (isCpuActive) {
      result.push(
        'CPU AUMENTA AL ABRIR Y UTILIZAR: La CPU procesa la descompresión de datos, compilación de shaders y la inicialización de los hilos de ejecución.'
      );
    }

    if (result.length === 0) {
      result.push(
        'COMPORTAMIENTO HOMOGÉNEO REGISTRADO: Los componentes mantuvieron una distribución equilibrada de demanda durante las tres fases observadas.'
      );
    }

    return result;
  };

  const interpretations = getInterpretations();
  const currentVisualMetrics =
    activeVisualPhase === 'reposo'
      ? reposo
      : activeVisualPhase === 'carga'
      ? carga
      : actividad;

  // Artifact generation (.TXT and .JSON)
  const handleExportTxt = () => {
    const activeLoadName =
      loadCategory === 'OTRA APLICACIÓN' && loadCustomName
        ? `${loadCategory} (${loadCustomName})`
        : loadCategory;

    const content = `============================================================
EVO LABS // MAPA DE FLUJO 001
TOMO 01 // CAPÍTULO 02 // CÓMO TRABAJAN JUNTOS
============================================================
Generado: ${new Date().toLocaleString()}
Carga evaluada: ${activeLoadName}
Modalidad de registro: ${inputMode}

1. HARDWARE HEREDADO (PASAPORTE EVO)
------------------------------------------------------------
CPU:           ${specs.cpu || 'NO DISPONIBLE'}
RAM:           ${specs.ram || 'NO DISPONIBLE'}
GPU:           ${specs.gpu || 'NO DISPONIBLE'}
Almacenamiento:${specs.storage || 'NO DISPONIBLE'}
Plataforma:    ${specs.motherboard || 'NO DISPONIBLE'}

2. MATRIZ DE OBSERVACIÓN TEMPORAL (RENDIMIENTO REAL)
------------------------------------------------------------
COMPONENTE     REPOSO        CARGA         ACTIVIDAD
------------------------------------------------------------
CPU            ${reposo.cpu.padEnd(14)}${carga.cpu.padEnd(14)}${actividad.cpu}
RAM            ${reposo.ram.padEnd(14)}${carga.ram.padEnd(14)}${actividad.ram}
GPU            ${reposo.gpu.padEnd(14)}${carga.gpu.padEnd(14)}${actividad.gpu}
DISCO          ${reposo.disco.padEnd(14)}${carga.disco.padEnd(14)}${actividad.disco}

3. INTERPRETACIÓN EDITORIAL EVO
------------------------------------------------------------
${interpretations.map((i, idx) => `[0${idx + 1}] ${i}`).join('\n\n')}

4. PRINCIPIO METODOLÓGICO EVO
------------------------------------------------------------
* ESTAMOS OBSERVANDO COMPORTAMIENTO. TODAVÍA NO ESTAMOS DECLARANDO UN LIMITANTE.
* Cuando investigues rendimiento, cambiá una sola variable a la vez.
============================================================
EVO LABS RESEARCH EDITION // TOMO 01
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EVO-MAPA-DE-FLUJO-001.txt';
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('¡Mapa de flujo exportado en formato .TXT!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleExportJson = () => {
    const activeLoadName =
      loadCategory === 'OTRA APLICACIÓN' && loadCustomName
        ? `${loadCategory} (${loadCustomName})`
        : loadCategory;

    const exportData: FlowMapExportSchema = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      artifact: 'MAPA_DE_FLUJO_001',
      inheritedSpecs: specs,
      experiment: {
        loadCategory: activeLoadName,
        loadCustomName,
        inputMode,
        reposo,
        carga,
        actividad,
      },
      interpretations,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EVO-MAPA-DE-FLUJO-001.json';
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('¡Mapa de flujo exportado en formato .JSON estructurado!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-xs font-mono-tech tracking-wider uppercase font-bold">
          <FlaskConical className="w-4 h-4 text-yellow-400" />
          <span>ESTACIÓN 05 // LABORATORIO PRINCIPAL</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-tight">
          LABORATORIO 02: SEGUÍ EL FLUJO
        </h2>

        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl">
          Observar el comportamiento real de tus componentes durante tres momentos: cuando la máquina descansa, cuando abre una aplicación pesada y cuando está ejecutándola activamente.
        </p>
      </div>

      {/* METODOLOGÍA WINDOWS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs uppercase font-bold">
          <Activity className="w-4 h-4" />
          <span>MÉTODO DE LABORATORIO // HERRAMIENTAS NATIVAS DE WINDOWS</span>
        </div>

        {/* Shortcut banner */}
        <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">PASO 1: ABRIR INSTRUMENTO:</span>
            <kbd className="px-2 py-1 rounded bg-zinc-800 text-yellow-400 font-bold border border-zinc-700 shadow">
              Ctrl + Shift + Esc
            </kbd>
          </div>
          <div className="text-zinc-400">
            PASO 2: Hacé clic en la pestaña <strong className="text-white">Rendimiento</strong>
          </div>
        </div>

        {/* 3 Moments guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-tech">
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            <span className="text-yellow-400 font-bold block uppercase text-[11px]">
              MOMENTO A // REPOSO
            </span>
            <p className="font-sans-editorial text-zinc-300 text-xs leading-relaxed">
              Cerrá las aplicaciones de usuario que no necesites. Esperá unos 30 segundos sin mover el mouse. Observá los valores base de CPU, RAM, GPU y Disco.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            <span className="text-yellow-400 font-bold block uppercase text-[11px]">
              MOMENTO B // CARGA
            </span>
            <p className="font-sans-editorial text-zinc-300 text-xs leading-relaxed">
              Abrí la aplicación elegida. Durante sus primeros 5 a 15 segundos de inicio, observá qué componentes pegan un salto brusco en las gráficas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            <span className="text-yellow-400 font-bold block uppercase text-[11px]">
              MOMENTO C // ACTIVIDAD
            </span>
            <p className="font-sans-editorial text-zinc-300 text-xs leading-relaxed">
              Usá la aplicación activamente entre 30 y 60 segundos (navegá, jugá, editá). Volvé a mirar qué componentes se mantienen ocupados y cuáles bajan.
            </p>
          </div>
        </div>
      </div>

      {/* ELECCIÓN DE CARGA */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
        <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-zinc-300 block">
          ELEGÍ LA CARGA PARA TU EXPERIMENTO
        </span>

        <div className="flex flex-wrap gap-2.5">
          {DEFAULT_LOADS.map((load) => (
            <button
              key={load}
              type="button"
              onClick={() => setLoadCategory(load)}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase font-bold transition-all cursor-pointer ${
                loadCategory === load
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-black/50 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {load}
            </button>
          ))}
        </div>

        {loadCategory === 'OTRA APLICACIÓN' && (
          <div className="pt-2">
            <input
              type="text"
              placeholder="Escribí el nombre de la aplicación o juego (ej. Blender, Photoshop, CS2)..."
              value={loadCustomName}
              onChange={(e) => setLoadCustomName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white font-mono-tech text-xs focus:border-yellow-400 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* MATRIZ DE REGISTRO VISUAL (OBSERVACIÓN RÁPIDA) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-yellow-400 block">
              MATRIZ DE OBSERVACIÓN RÁPIDA
            </span>
            <span className="text-[11px] font-sans-editorial text-zinc-400">
              Anotá lo que viste en el Administrador de tareas. No se requiere precisión milimétrica.
            </span>
          </div>

          {/* Toggle NIVELES vs NUMEROS */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono-tech">
            <button
              type="button"
              onClick={() => handleToggleInputMode('NIVELES')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                inputMode === 'NIVELES'
                  ? 'bg-yellow-400 text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              MODO NIVELES (BAJO / MEDIO / ALTO)
            </button>
            <button
              type="button"
              onClick={() => handleToggleInputMode('NUMEROS')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                inputMode === 'NUMEROS'
                  ? 'bg-yellow-400 text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              MODO NÚMEROS (%)
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono-tech">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">COMPONENTE</th>
                <th className="py-3 px-4 font-bold text-center">MOMENTO A: REPOSO</th>
                <th className="py-3 px-4 font-bold text-center">MOMENTO B: CARGA</th>
                <th className="py-3 px-4 font-bold text-center">MOMENTO C: ACTIVIDAD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {(
                [
                  { key: 'cpu', label: 'CPU (PROCESADOR)', icon: <Cpu className="w-4 h-4 text-yellow-400" /> },
                  { key: 'ram', label: 'RAM (MEMORIA)', icon: <Layers className="w-4 h-4 text-yellow-400" /> },
                  { key: 'gpu', label: 'GPU (GRÁFICOS)', icon: <Monitor className="w-4 h-4 text-yellow-400" /> },
                  { key: 'disco', label: 'DISCO (ALMACENAMIENTO)', icon: <HardDrive className="w-4 h-4 text-yellow-400" /> },
                ] as const
              ).map((comp) => (
                <tr key={comp.key} className="hover:bg-zinc-900/30">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                    {comp.icon}
                    <span>{comp.label}</span>
                  </td>

                  {/* Reposo */}
                  <td className="py-3 px-4 text-center">
                    {inputMode === 'NIVELES' ? (
                      <div className="inline-flex gap-1">
                        {['BAJO', 'MEDIO', 'ALTO'].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => handleMetricChange('reposo', comp.key, level)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              reposo[comp.key] === level
                                ? level === 'ALTO'
                                  ? 'bg-amber-500 text-black'
                                  : level === 'MEDIO'
                                  ? 'bg-yellow-400 text-black'
                                  : 'bg-emerald-500 text-black'
                                : 'bg-black/60 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={reposo[comp.key]}
                          onChange={(e) => handleMetricChange('reposo', comp.key, e.target.value)}
                          className="w-16 px-2 py-1 rounded bg-black/60 border border-zinc-800 text-center text-white font-bold"
                        />
                        <span className="text-zinc-500">%</span>
                      </div>
                    )}
                  </td>

                  {/* Carga */}
                  <td className="py-3 px-4 text-center">
                    {inputMode === 'NIVELES' ? (
                      <div className="inline-flex gap-1">
                        {['BAJO', 'MEDIO', 'ALTO'].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => handleMetricChange('carga', comp.key, level)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              carga[comp.key] === level
                                ? level === 'ALTO'
                                  ? 'bg-amber-500 text-black'
                                  : level === 'MEDIO'
                                  ? 'bg-yellow-400 text-black'
                                  : 'bg-emerald-500 text-black'
                                : 'bg-black/60 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={carga[comp.key]}
                          onChange={(e) => handleMetricChange('carga', comp.key, e.target.value)}
                          className="w-16 px-2 py-1 rounded bg-black/60 border border-zinc-800 text-center text-white font-bold"
                        />
                        <span className="text-zinc-500">%</span>
                      </div>
                    )}
                  </td>

                  {/* Actividad */}
                  <td className="py-3 px-4 text-center">
                    {inputMode === 'NIVELES' ? (
                      <div className="inline-flex gap-1">
                        {['BAJO', 'MEDIO', 'ALTO'].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => handleMetricChange('actividad', comp.key, level)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              actividad[comp.key] === level
                                ? level === 'ALTO'
                                  ? 'bg-amber-500 text-black'
                                  : level === 'MEDIO'
                                  ? 'bg-yellow-400 text-black'
                                  : 'bg-emerald-500 text-black'
                                : 'bg-black/60 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={actividad[comp.key]}
                          onChange={(e) => handleMetricChange('actividad', comp.key, e.target.value)}
                          className="w-16 px-2 py-1 rounded bg-black/60 border border-zinc-800 text-center text-white font-bold"
                        />
                        <span className="text-zinc-500">%</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CORRELACIONES // TU FLUJO OBSERVADO */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-zinc-300">
            CORRELACIONES // TU FLUJO OBSERVADO
          </span>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-black/60 border border-zinc-800 text-xs font-mono-tech">
            <button
              type="button"
              onClick={() => setActiveVisualPhase('reposo')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                activeVisualPhase === 'reposo' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              VER REPOSO
            </button>
            <button
              type="button"
              onClick={() => setActiveVisualPhase('carga')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                activeVisualPhase === 'carga' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              VER CARGA
            </button>
            <button
              type="button"
              onClick={() => setActiveVisualPhase('actividad')}
              className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                activeVisualPhase === 'actividad' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              VER ACTIVIDAD
            </button>
          </div>
        </div>

        {/* Dynamic Topology Node Diagram */}
        <div className="p-6 rounded-xl bg-black/60 border border-zinc-800 text-center space-y-4">
          <span className="text-[10px] font-mono-tech text-yellow-400 uppercase tracking-widest block">
            ESTADO ACTIVO: FASE DE {activeVisualPhase.toUpperCase()}
          </span>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-mono-tech">
            {/* Disco */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                currentVisualMetrics.disco === 'ALTO' || Number(currentVisualMetrics.disco) >= 60
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold ring-2 ring-yellow-400/50'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800'
              }`}
            >
              <HardDrive className="w-5 h-5 mx-auto mb-1" />
              <span className="block uppercase text-[10px]">ALMACENAMIENTO</span>
              <span className="font-bold text-sm block">{currentVisualMetrics.disco}</span>
            </div>

            <span className="text-zinc-600 font-bold text-lg hidden md:inline">→</span>
            <span className="text-zinc-600 font-bold text-lg md:hidden">↓</span>

            {/* RAM */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                currentVisualMetrics.ram === 'ALTO' || Number(currentVisualMetrics.ram) >= 60
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold ring-2 ring-yellow-400/50'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800'
              }`}
            >
              <Layers className="w-5 h-5 mx-auto mb-1" />
              <span className="block uppercase text-[10px]">RAM DEL SISTEMA</span>
              <span className="font-bold text-sm block">{currentVisualMetrics.ram}</span>
            </div>

            <span className="text-zinc-600 font-bold text-lg hidden md:inline">⇄</span>
            <span className="text-zinc-600 font-bold text-lg md:hidden">↕</span>

            {/* CPU */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                currentVisualMetrics.cpu === 'ALTO' || Number(currentVisualMetrics.cpu) >= 60
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold ring-2 ring-yellow-400/50'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800'
              }`}
            >
              <Cpu className="w-5 h-5 mx-auto mb-1" />
              <span className="block uppercase text-[10px]">CPU</span>
              <span className="font-bold text-sm block">{currentVisualMetrics.cpu}</span>
            </div>

            <span className="text-zinc-600 font-bold text-lg hidden md:inline">⇄</span>
            <span className="text-zinc-600 font-bold text-lg md:hidden">↕</span>

            {/* GPU */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                currentVisualMetrics.gpu === 'ALTO' || Number(currentVisualMetrics.gpu) >= 60
                  ? 'bg-yellow-400 text-black border-yellow-400 font-bold ring-2 ring-yellow-400/50'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800'
              }`}
            >
              <Monitor className="w-5 h-5 mx-auto mb-1" />
              <span className="block uppercase text-[10px]">GPU</span>
              <span className="font-bold text-sm block">{currentVisualMetrics.gpu}</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERPRETACIÓN PRUDENTE AUTOMATIZADA */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-yellow-400 font-mono-tech text-xs uppercase font-bold">
          <Lightbulb className="w-4 h-4" />
          <span>INTERPRETACIÓN TÉCNICA // LECTURA DE COMPORTAMIENTO</span>
        </div>

        <div className="space-y-3">
          {interpretations.map((interp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-black/50 border border-zinc-800/80 text-xs font-mono-tech text-zinc-200 flex items-start gap-3"
            >
              <span className="text-yellow-400 font-bold shrink-0">0{idx + 1}.</span>
              <p className="font-sans-editorial text-xs leading-relaxed">{interp}</p>
            </div>
          ))}
        </div>

        {/* RIGOR OBLIGATORIO // NO DIAGNOSTICAR CUELLO DE BOTELLA */}
        <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/40 text-xs font-mono-tech text-yellow-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-yellow-400 uppercase tracking-wider block">
              PRUDENCIA DIAGNÓSTICA EVO
            </span>
            <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed font-bold">
              “ESTAMOS OBSERVANDO COMPORTAMIENTO. TODAVÍA NO ESTAMOS DECLARANDO UN LIMITANTE.”
            </p>
            <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
              Ver un componente alto o bajo en una prueba casera de un minuto describe cómo responde ante esa aplicación en particular. En los próximos capítulos aprenderemos a medir percentiles de frametime y telemetría de hilos antes de emitir un juicio definitivo de hardware.
            </p>
          </div>
        </div>
      </div>

      {/* RESULTADO DEL LABORATORIO // MAPA DE FLUJO EVO // 001 */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#181920] to-[#0d0e12] border-2 border-yellow-400/80 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-yellow-400" />
            <div>
              <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-white block">
                ARTEFACTO OFICIAL // MAPA DE FLUJO EVO 001
              </span>
              <span className="text-[10px] font-mono-tech text-yellow-400">
                REGISTRO PERMANENTE DE FLUJO EN TU PC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportTxt}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech text-xs font-bold uppercase transition-colors cursor-pointer border border-zinc-700"
            >
              <Download className="w-3.5 h-3.5 text-yellow-400" />
              <span>EXPORTAR .TXT</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech text-xs font-bold uppercase transition-colors cursor-pointer border border-zinc-700"
            >
              <Download className="w-3.5 h-3.5 text-yellow-400" />
              <span>EXPORTAR .JSON</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 text-xs font-mono-tech text-zinc-300 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-zinc-500 uppercase">Carga empleada:</span>{' '}
              <strong className="text-white">
                {loadCategory === 'OTRA APLICACIÓN' && loadCustomName
                  ? `${loadCategory} (${loadCustomName})`
                  : loadCategory}
              </strong>
            </div>
            <div>
              <span className="text-zinc-500 uppercase">CPU Detectada:</span>{' '}
              <strong className="text-white">{specs.cpu || 'NO DISPONIBLE'}</strong>
            </div>
            <div>
              <span className="text-zinc-500 uppercase">RAM Detectada:</span>{' '}
              <strong className="text-white">{specs.ram || 'NO DISPONIBLE'}</strong>
            </div>
            <div>
              <span className="text-zinc-500 uppercase">GPU Detectada:</span>{' '}
              <strong className="text-white">{specs.gpu || 'NO DISPONIBLE'}</strong>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono-tech text-zinc-400 italic">
          * La descarga de este archivo es completamente opcional. Tu Mapa de Flujo ya queda incorporado en el almacenamiento local de tu navegador.
        </p>
      </div>

      {/* CÁPSULAS: TALLER EVO + TIP EVO + MÉTODO EVO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TALLER EVO: ¿MÁS RAM? */}
        <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-3">
          <span className="text-yellow-400 font-mono-tech text-xs uppercase font-bold block">
            TALLER EVO // ¿MÁS RAM HACE MÁS RÁPIDA MI PC?
          </span>
          <p className="font-sans-editorial text-xs text-zinc-200 leading-relaxed font-bold">
            “Sólo si la cantidad o configuración actual es realmente una limitación para esa carga.”
          </p>
          <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
            Agregar 32 GB de memoria a una máquina que consume 10 GB durante sus juegos no convierte mágicamente al procesador ni a la GPU en componentes más rápidos. Más adelante aprenderemos a distinguir capacidad insuficiente de configuración ineficiente.
          </p>
        </div>

        {/* TIP EVO: UNA VARIABLE A LA VEZ */}
        <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-3">
          <span className="text-yellow-400 font-mono-tech text-xs uppercase font-bold block">
            TIP EVO // AISLAR VARIABLES
          </span>
          <p className="font-sans-editorial text-xs text-zinc-200 leading-relaxed font-bold">
            “Cuando investigues rendimiento, cambiá una sola variable a la vez.”
          </p>
          <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
            Si cambiás la resolución, cerrás aplicaciones de fondo, activás XMP y actualizás drivers al mismo tiempo, y el rendimiento sube, nunca sabrás cuál de las cuatro cosas produjo la mejora.
          </p>
        </div>

        {/* MÉTODO EVO */}
        <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-3">
          <span className="text-yellow-400 font-mono-tech text-xs uppercase font-bold block">
            EL MÉTODO EVO // CICLO CIENTÍFICO
          </span>
          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-[11px] font-mono-tech text-zinc-300 space-y-1">
            <div className="text-yellow-400 font-bold">1. OBSERVAR (Completado hoy)</div>
            <div className="text-zinc-500">2. FORMULAR HIPÓTESIS</div>
            <div className="text-zinc-500">3. CAMBIAR UNA VARIABLE</div>
            <div className="text-zinc-500">4. VOLVER A MEDIR</div>
            <div className="text-zinc-500">5. COMPARAR</div>
          </div>
          <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
            Hoy completamos la etapa de <strong>OBSERVAR</strong>. La optimización adaptativa e intervención vendrán más adelante.
          </p>
        </div>
      </div>

      {/* FINALIZAR LABORATORIO BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-800">
        <div className="text-xs font-mono-tech text-zinc-400">
          Experimento completado y Mapa de Flujo 001 consolidado.
        </div>

        <button
          type="button"
          onClick={onFinishLab}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-mono-tech font-bold text-xs uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all cursor-pointer shadow-xl hover:shadow-yellow-400/25 group shrink-0"
        >
          <span>FINALIZAR LABORATORIO // CONCLUIR CAPÍTULO 02</span>
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
