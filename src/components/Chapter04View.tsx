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
  Cpu,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import {
  UserPcSpec,
  Lab02ExperimentData,
  FluidezProfileData,
  AbExperimentData,
  LimitationMatrixData,
} from '../types';
import { ExpedienteAcumuladoBanner } from './chapter04/ExpedienteAcumuladoBanner';
import { Station01WrongSuspect } from './chapter04/Station01WrongSuspect';
import { Station02CpuGpuCadence } from './chapter04/Station02CpuGpuCadence';
import { Station03OtherLimiters } from './chapter04/Station03OtherLimiters';
import { Station04ControlledExperiment } from './chapter04/Station04ControlledExperiment';
import { Station05LimitationMatrix } from './chapter04/Station05LimitationMatrix';
import { EvoChapterNavigationFooter } from './tomo01/EvoChapterNavigationFooter';
import { EvoChapterCheckSection } from './tomo01/EvoChapterCheckSection';
import { TutorChapterBanner } from './tutor/TutorChapterBanner';

interface Chapter04ViewProps {
  onBackToIndex: () => void;
  onOpenChapter03?: () => void;
  onOpenChapter05?: () => void;
  onChapterCompleted?: () => void;
}

export const Chapter04View: React.FC<Chapter04ViewProps> = ({
  onBackToIndex,
  onOpenChapter03,
  onOpenChapter05,
  onChapterCompleted,
}) => {
  // Mark chapter 04 as started
  useEffect(() => {
    try {
      localStorage.setItem('evo_c04_started', 'true');
    } catch {
      // ignore
    }
  }, []);

  // 1. Inherited Evidence from C01, C02 and C03
  const [specs] = useState<Partial<UserPcSpec>>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_specs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [flowData] = useState<Lab02ExperimentData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c02_lab_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [fluidezData] = useState<FluidezProfileData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c03_fluidez_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Chapter 04 State & Persistence
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('evo_c04_status') === 'completed';
    } catch {
      return false;
    }
  });

  // Default A/B Experiment prefilled intelligently from C03 fluidez profile
  const initialExperiment: AbExperimentData = {
    game:
      fluidezData?.game === 'OTRO'
        ? fluidezData.customGameName || 'VALORANT'
        : fluidezData?.game || 'VALORANT',
    variableChanged: 'RESOLUCIÓN GRÁFICA // CARGA DE PÍXELES',
    scenarioA: {
      label: 'Escenario A (1080p Base)',
      resolution: fluidezData?.resolution || '1920×1080',
      quality: fluidezData?.quality || 'Baja',
      fps: fluidezData?.fpsHabituales ?? 144,
      gpuUsagePct: 96,
      cpuUsagePct: 45,
      tempC: 68,
      notes: 'Estado de referencia habitual.',
    },
    scenarioB: {
      label: 'Escenario B (720p / 50% Render)',
      resolution: '1280×720',
      quality: fluidezData?.quality || 'Baja',
      fps: 215,
      gpuUsagePct: 74,
      cpuUsagePct: 58,
      tempC: 65,
      notes: 'Resolución reducida a la mitad.',
    },
    fpsDeltaPct: 49.3,
    observedBehavior: 'SUBIERON_FPS_PROPORCIONAL',
    notes: 'Incremento sostenido de cuadros al reducir píxeles.',
  };

  const [experimentData, setExperimentData] = useState<AbExperimentData>(() => {
    try {
      const saved = localStorage.getItem('evo_c04_experiment_data');
      return saved ? JSON.parse(saved) : initialExperiment;
    } catch {
      return initialExperiment;
    }
  });

  // Persist experiment data whenever updated
  const handleUpdateExperiment = (newData: AbExperimentData) => {
    setExperimentData(newData);
    try {
      localStorage.setItem('evo_c04_experiment_data', JSON.stringify(newData));
    } catch {
      // ignore
    }
  };

  // Consolidation handler
  const handleConsolidate = () => {
    try {
      localStorage.setItem('evo_c04_status', 'completed');
      localStorage.setItem('evo_c04_experiment_data', JSON.stringify(experimentData));
      localStorage.setItem('evo_c05_unlocked', 'true');
    } catch {
      // ignore
    }

    setIsCompleted(true);

    if (onChapterCompleted) {
      onChapterCompleted();
    }
  };

  const handleResetTest = () => {
    setIsCompleted(false);
    const labEl = document.getElementById('estacion-04-experimento-controlado');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenChapter05 = () => {
    if (onChapterCompleted) {
      onChapterCompleted();
    } else {
      onBackToIndex();
    }
  };

  return (
    <div id="pantalla-capitulo-04" className="w-full min-h-screen py-6 sm:py-10 text-[#f4f4f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Navigation Top Bar */}
        <nav className="flex items-center justify-between pb-5 border-b border-zinc-800/60">
          <button
            type="button"
            onClick={onBackToIndex}
            className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
            id="btn-volver-indice-c04"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
            <span>← VOLVER A ÍNDICE DEL TOMO 01</span>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono-tech">
            <span className="w-2 h-2 bg-yellow-400 inline-block" />
            <span className="tracking-widest uppercase text-white font-bold">
              TOMO 01 // CAPÍTULO 04
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-yellow-400 font-semibold tracking-wider">
              LÍMITES FÍSICOS & CUELLO DE BOTELLA
            </span>
          </div>
        </nav>

        {/* Tutor EVO Chapter Permanent Orientation Banner */}
        <TutorChapterBanner
          chapterNumber="04"
          chapterTitle="LÍMITES REALES DE TU MÁQUINA"
          currentStage={isCompleted ? 'COMPROBAR' : 'DIAGNOSTICAR'}
          currentAction={
            isCompleted
              ? 'Revisá la matriz de limitaciones físicas consolidada y completá la comprobación.'
              : 'Ejecutá el experimento A/B variando resolución y carga gráfica para aislar el cuello de botella.'
          }
          tutorExplanation="El cuello de botella no es un error de fábrica: siempre hay un componente que llega al 100% de su capacidad primero y marca el límite de velocidad del sistema."
          nextStep={
            isCompleted
              ? 'Avanzá al Capítulo 05 (Telemetría de la Verdad).'
              : 'Analizá si el límite proviene de la CPU, la GPU, la RAM o el almacenamiento.'
          }
          whatToLookFor="Si al bajar la resolución los FPS suben, el límite es la GPU. Si los FPS se quedan clavados, el límite es la CPU."
        />

        {/* Inherited Evidence Banner (C01 + C02 + C03) */}
        <ExpedienteAcumuladoBanner
          specs={specs}
          hasPassport={Boolean(specs.cpu)}
          flowData={flowData}
          hasFlowMap={Boolean(flowData)}
          fluidezData={fluidezData}
          hasFluidez={Boolean(fluidezData)}
          onOpenChapter03={onOpenChapter03}
        />

        {/* Chapter Header */}
        <header className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-zinc-400">
            <span>TOMO 01 // CONOCÉ TU PC</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold">CAPÍTULO 04 // INVESTIGACIÓN PERICIAL</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
            ENCONTRÁ EL LÍMITE
          </h1>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border-l-4 border-yellow-400 space-y-3">
            <p className="font-sans-editorial text-lg sm:text-xl text-white font-medium italic leading-relaxed">
              “Un cuello de botella no es una etiqueta permanente de una computadora.
              <br />
              <span className="text-yellow-400 font-bold not-italic">
                Es una circunstancia dinámica que cambia con cada aplicación, resolución y escena.”
              </span>
            </p>
            <p className="text-xs font-mono-tech text-zinc-400 leading-relaxed">
              En los capítulos anteriores identificaste tu silicio (01), rastreaste su diálogo (02) y mediste la estabilidad de fotogramas (03).
              Ahora aprenderás a determinar con exactitud qué componente está obligando a los demás a esperar.
            </p>
          </div>
        </header>

        {/* 5 Stations Sequence Strip */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-mono-tech uppercase tracking-widest text-zinc-400">
            <span>ESTRUCTURA DE INVESTIGACIÓN // 5 ESTACIONES METÓDICAS</span>
            <span className="text-yellow-400 font-bold">MÉTODO CIENTÍFICO A/B</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs font-mono-tech">
            <div className="p-3 rounded-xl bg-[#121318] border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px]">01 // PRINCIPIO</span>
              <span className="text-white font-semibold block uppercase">El Sospechoso Equivocado</span>
              <span className="text-zinc-400 text-[11px] block">La falacia del 100% de CPU</span>
            </div>

            <div className="p-3 rounded-xl bg-[#121318] border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px]">02 // CADENCIA</span>
              <span className="text-white font-semibold block uppercase">CPU vs GPU</span>
              <span className="text-zinc-400 text-[11px] block">¿Quién espera a quién?</span>
            </div>

            <div className="p-3 rounded-xl bg-[#121318] border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px]">03 // INVISIBLES</span>
              <span className="text-white font-semibold block uppercase">Otros Limitadores</span>
              <span className="text-zinc-400 text-[11px] block">RAM, calor, disco y VRMs</span>
            </div>

            <div className="p-3 rounded-xl bg-[#121318] border border-zinc-800 space-y-1">
              <span className="text-yellow-400 font-bold block text-[10px]">04 // PROTOCOLO</span>
              <span className="text-white font-semibold block uppercase">Ensayo A/B</span>
              <span className="text-zinc-400 text-[11px] block">Una sola variable a la vez</span>
            </div>

            <div className="p-3 rounded-xl bg-[#121318] border border-yellow-400/50 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-yellow-400 font-bold block text-[10px]">05 // EXPEDIENTE</span>
              <span className="text-yellow-400 font-semibold block uppercase">Matriz EVO 001</span>
              <span className="text-zinc-400 text-[11px] block">Dictamen consolidado</span>
            </div>
          </div>
        </section>

        {/* STATION 01: The Wrong Suspect */}
        <Station01WrongSuspect />

        {/* STATION 02: CPU vs GPU Cadence */}
        <Station02CpuGpuCadence />

        {/* STATION 03: Other Limiters */}
        <Station03OtherLimiters specs={specs} />

        {/* STATION 04: Controlled A/B Experiment */}
        <Station04ControlledExperiment
          specs={specs}
          fluidezData={fluidezData}
          experimentData={experimentData}
          onUpdateExperiment={handleUpdateExperiment}
        />

        {/* STATION 05: Limitation Matrix & Consolidation */}
        <Station05LimitationMatrix
          specs={specs}
          fluidezData={fluidezData}
          experimentData={experimentData}
          isCompleted={isCompleted}
          onConsolidate={handleConsolidate}
          onResetTest={handleResetTest}
          onOpenChapter05={handleOpenChapter05}
          onBackToIndex={onBackToIndex}
        />

        {/* ACTIVIDAD DE COMPROBACIÓN // COMPROBÁ LO QUE APRENDISTE */}
        <EvoChapterCheckSection
          chapterNumber="04"
          chapterTitle="ENCONTRÁ EL LÍMITE"
          isAlreadyCompleted={isCompleted}
          onPassCheck={handleConsolidate}
        />

        {/* NAVEGACIÓN PEDAGÓGICA DEFINITIVA */}
        <EvoChapterNavigationFooter
          currentChapterNumber="04"
          currentChapterTitle="ENCONTRÁ EL LÍMITE"
          isCompleted={isCompleted}
          onMarkCompleted={handleConsolidate}
          onBackToIndex={onBackToIndex}
          onPreviousChapter={onOpenChapter03 || onBackToIndex}
          onNextChapter={onOpenChapter05 || handleOpenChapter05}
          previousChapterLabel="CAPÍTULO 03: CUANDO LOS FPS MIENTEN"
          nextChapterLabel="CAPÍTULO 05: WINDOWS Y SERVICIOS"
          isNextAvailable={true}
        />
      </div>
    </div>
  );
};
