import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sliders,
  Award,
  Terminal,
  Cpu,
  Eye,
  RotateCcw,
} from 'lucide-react';
import {
  UserPcSpec,
  Lab02ExperimentData,
  FluidezProfileData,
  AbExperimentData,
  BaselineMetrics,
  StartupAuditSummary,
  ProcessIdentityCard,
  ServiceInvestigation,
  ScheduledTaskInvestigation,
  NetworkInvestigation,
  ControlledInterventionData,
  FinalComparisonData,
  ActivityMapData,
  OptimizationLogData,
} from '../types';
import { ExpedienteAcumuladoC05Banner } from './chapter05/ExpedienteAcumuladoC05Banner';
import { Station01Baseline } from './chapter05/Station01Baseline';
import { Station02StartupAudit } from './chapter05/Station02StartupAudit';
import { Station03ProcessForensics } from './chapter05/Station03ProcessForensics';
import { Station04ServicesDeepDive } from './chapter05/Station04ServicesDeepDive';
import { Station05ScheduledTasks } from './chapter05/Station05ScheduledTasks';
import { Station06NetworkConnections } from './chapter05/Station06NetworkConnections';
import { Station07ControlledIntervention } from './chapter05/Station07ControlledIntervention';
import { Station08NormalVsClean } from './chapter05/Station08NormalVsClean';
import { ActivityMapArtifact } from './chapter05/ActivityMapArtifact';
import { OptimizationLogArtifact } from './chapter05/OptimizationLogArtifact';
import { EvoChapterNavigationFooter } from './tomo01/EvoChapterNavigationFooter';
import { EvoChapterCheckSection } from './tomo01/EvoChapterCheckSection';

interface Chapter05ViewProps {
  onBackToIndex: () => void;
  onOpenChapter04?: () => void;
  onOpenChapter06?: () => void;
  onChapterCompleted?: () => void;
}

export const Chapter05View: React.FC<Chapter05ViewProps> = ({
  onBackToIndex,
  onOpenChapter04,
  onOpenChapter06,
  onChapterCompleted,
}) => {
  // Mark chapter 05 as started
  useEffect(() => {
    try {
      localStorage.setItem('evo_c05_started', 'true');
    } catch {
      // ignore
    }
  }, []);

  // 1. Inherited Evidence from Chapters 01-04
  const [specs] = useState<Partial<UserPcSpec>>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_specs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
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

  const [limitationData] = useState<AbExperimentData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c04_experiment_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Chapter 05 Completion State
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('evo_c05_status') === 'completed';
    } catch {
      return false;
    }
  });

  // Current Station View tab
  const [currentStation, setCurrentStation] = useState<number>(1);

  // 3. Station Data Defaults & Persistence
  // Station 01: Baseline
  const [baselineData, setBaselineData] = useState<BaselineMetrics>(() => {
    const defaultBaseline: BaselineMetrics = {
      cpuPct: 3,
      ramUsedGb: 5.4,
      diskPct: 0,
      gpuPct: 1,
      processCount: 108,
      topConsumer: 'EpicGamesLauncher.exe / Antivirus',
      topCpu: ['System (0.8%)', 'DWM.exe (0.5%)', 'SearchIndexer.exe (0.3%)'],
      topRam: ['EpicGamesLauncher.exe (450 MB)', 'Discord.exe (320 MB)', 'Antivirus (280 MB)'],
      topDisk: ['System (0.1 MB/s)', 'Windows Search (0 MB/s)'],
      status: 'OBSERVADO',
      observedDurationSeconds: 120,
    };
    try {
      const saved = localStorage.getItem('evo_c05_baseline');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && typeof parsed.cpuPct === 'number') {
          return { ...defaultBaseline, ...parsed };
        }
      }
    } catch {}
    return defaultBaseline;
  });

  // Station 02: Startup Apps
  const [startupAudit, setStartupAudit] = useState<StartupAuditSummary>(() => {
    const defaultAudit: StartupAuditSummary = {
      total: 9,
      enabled: 5,
      disabled: 4,
      auditedApps: [
        {
          id: 'app-1',
          name: 'Epic Games Launcher',
          publisher: 'Epic Games Inc.',
          impact: 'ALTO',
          state: 'HABILITADO',
          userUsageOnBoot: 'PRESCINDIBLE',
          category: 'LAUNCHER',
        },
        {
          id: 'app-2',
          name: 'Discord',
          publisher: 'Discord Inc.',
          impact: 'MEDIO',
          state: 'HABILITADO',
          userUsageOnBoot: 'SI',
          category: 'APLICACION_USUARIO',
        },
        {
          id: 'app-3',
          name: 'Realtek Audio Universal Service',
          publisher: 'Realtek Semiconductor Corp.',
          impact: 'BAJO',
          state: 'HABILITADO',
          userUsageOnBoot: 'SI',
          category: 'DRIVER_HARDWARE',
        },
        {
          id: 'app-4',
          name: 'Microsoft OneDrive',
          publisher: 'Microsoft Corporation',
          impact: 'MEDIO',
          state: 'HABILITADO',
          userUsageOnBoot: 'PRESCINDIBLE',
          category: 'SINCRONIZACION',
        },
      ],
    };
    try {
      const saved = localStorage.getItem('evo_c05_startup_audit');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.auditedApps)) {
          return { ...defaultAudit, ...parsed };
        }
      }
    } catch {}
    return defaultAudit;
  });

  // Station 03: Process Forensics
  const [processData, setProcessData] = useState<ProcessIdentityCard>(() => {
    const defaultProcess: ProcessIdentityCard = {
      name: 'EpicGamesLauncher.exe',
      pid: '6420',
      path: 'C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe',
      publisher: 'Epic Games Inc.',
      signature: 'VALID',
      observedConsumption: '0.8% CPU, 452 MB RAM, 0 MB/s Disco',
      identificationResult: 'IDENTIFICADO',
      observation:
        'Launcher de tienda secundario ejecutándose en segundo plano con interfaz oculta.',
    };
    try {
      const saved = localStorage.getItem('evo_c05_process_forensics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name) {
          return { ...defaultProcess, ...parsed };
        }
      }
    } catch {}
    return defaultProcess;
  });

  // Station 04: Service Investigation
  const [serviceData, setServiceData] = useState<ServiceInvestigation>(() => {
    try {
      const saved = localStorage.getItem('evo_c05_service_deepdive');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      visibleName: 'Cola de impresión',
      serviceName: 'Spooler',
      state: 'RUNNING',
      startType: 'AUTOMATICO',
      description:
        'Carga los archivos en la memoria para imprimirlos más tarde en segundo plano.',
    };
  });

  // Station 05: Scheduled Tasks
  const [taskData, setTaskData] = useState<ScheduledTaskInvestigation>(() => {
    try {
      const saved = localStorage.getItem('evo_c05_scheduled_task');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      taskName: 'GoogleUpdateTaskMachineCore',
      taskPath: '\\Microsoft\\EdgeUpdate',
      state: 'READY',
      apparentOrigin: 'Google LLC / Software externo',
      functionDesc:
        'Mantiene el navegador actualizado comprobando versiones cuando el equipo está en reposo.',
      twoMinWatchResult: 'NO_SE_OBSERVO_ACTIVIDAD',
      detectedProcessOrActivity: 'Consumo plano sin ráfagas espontáneas observadas.',
    };
  });

  // Station 06: Network Investigation
  const [networkData, setNetworkData] = useState<NetworkInvestigation>(() => {
    const defaultNetwork: NetworkInvestigation = {
      evaluated: true,
      processName: 'Discord.exe',
      owningPid: '10424',
      localAddress: '192.168.1.50:52410',
      remoteAddress: '162.159.130.233 (Cloudflare / Discord Voice Gateway)',
      remotePort: '443',
      state: 'ESTABLISHED',
      status: 'IDENTIFICADO',
      contextNotes:
        'Socket HTTPS permanente para presencia en línea y mensajes instantáneos. Tráfico normal.',
    };
    try {
      const saved = localStorage.getItem('evo_c05_network');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.processName) {
          return { ...defaultNetwork, ...parsed };
        }
      }
    } catch {}
    return defaultNetwork;
  });

  // Station 07: Controlled Intervention
  const [interventionData, setInterventionData] = useState<ControlledInterventionData>(() => {
    try {
      const saved = localStorage.getItem('evo_c05_intervention');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      interventionType: 'CERRAR_LAUNCHER_SECUNDARIO',
      targetName: 'Epic Games Launcher + Sincronización en la nube',
      reason:
        'Eliminar trabajo secundario no esencial antes de ejecutar la partida de prueba.',
      reversible: true,
      howToRevert:
        'Volver a abrir el launcher desde el menú de inicio y reanudar sincronización.',
      before: {
        processes: 108,
        ramGb: 5.4,
        fps: 171,
        onePctLow: 118,
      },
      after: {
        processes: 91,
        ramGb: 4.6,
        fps: 176,
        onePctLow: 134,
      },
      delta: {
        ramGb: 0.8,
        processes: 17,
        fps: 5,
        onePctLow: 16,
      },
      interpretation: 'MEJORA_PRINCIPALMENTE_ESTABILIDAD',
      decision: 'CONSERVAR_CAMBIO',
    };
  });

  // Station 08: Final Comparison (Normal vs Clean)
  const [comparisonData, setComparisonData] = useState<FinalComparisonData>(() => {
    try {
      const saved = localStorage.getItem('evo_c05_comparison');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      game:
        fluidezData?.game === 'OTRO'
          ? fluidezData.customGameName || 'VALORANT'
          : fluidezData?.game || 'VALORANT',
      resolution: fluidezData?.resolution || '1280×720',
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
        symptoms: ['Microtirones esporádicos al inicio de ronda y combates densos'],
      },
      cleanMode: {
        processes: 91,
        ramGb: 4.6,
        fps: 176,
        onePctLow: 134,
        symptoms: ['Cadencia sostenida más suave, sin caídas repentinas de cuadros'],
      },
      conclusion: {
        freedResources: '0.8 GB de memoria RAM liberados y 17 procesos de fondo eliminados.',
        performance: 'Cambio modesto en FPS promedio (+5 FPS / +2.9%).',
        stability: 'Mejora observable en 1% Low (+16 FPS / +13.5%).',
        perceivedExperience: 'Disminución apreciable de interrupciones repentinas de cadencia.',
      },
    };
  });

  // Generated Artifacts State
  const [activityMap, setActivityMap] = useState<ActivityMapData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c05_activity_map');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [optimizationLog, setOptimizationLog] = useState<OptimizationLogData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c05_optimization_log');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save station handlers
  const handleSaveBaseline = (data: BaselineMetrics) => {
    setBaselineData(data);
    localStorage.setItem('evo_c05_baseline', JSON.stringify(data));
  };

  const handleSaveStartup = (data: StartupAuditSummary) => {
    setStartupAudit(data);
    localStorage.setItem('evo_c05_startup_audit', JSON.stringify(data));
  };

  const handleSaveProcess = (data: ProcessIdentityCard) => {
    setProcessData(data);
    localStorage.setItem('evo_c05_process_forensics', JSON.stringify(data));
  };

  const handleSaveService = (data: ServiceInvestigation) => {
    setServiceData(data);
    localStorage.setItem('evo_c05_service_deepdive', JSON.stringify(data));
  };

  const handleSaveTask = (data: ScheduledTaskInvestigation) => {
    setTaskData(data);
    localStorage.setItem('evo_c05_scheduled_task', JSON.stringify(data));
  };

  const handleSaveNetwork = (data: NetworkInvestigation) => {
    setNetworkData(data);
    localStorage.setItem('evo_c05_network', JSON.stringify(data));
  };

  const handleSaveIntervention = (data: ControlledInterventionData) => {
    setInterventionData(data);
    localStorage.setItem('evo_c05_intervention', JSON.stringify(data));
  };

  const handleSaveComparison = (data: FinalComparisonData) => {
    setComparisonData(data);
    localStorage.setItem('evo_c05_comparison', JSON.stringify(data));
  };

  // Final consolidation and generation of Artifacts
  const handleFinishLaboratorio = () => {
    const timestamp = new Date().toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. Generate Activity Map Artifact
    const mapData: ActivityMapData = {
      registeredAt: timestamp,
      baseline: baselineData,
      startup: startupAudit,
      investigatedProcess: processData,
      investigatedService: serviceData,
      investigatedTask: taskData,
      investigatedNetwork: networkData,
    };
    setActivityMap(mapData);
    localStorage.setItem('evo_c05_activity_map', JSON.stringify(mapData));

    // 2. Generate Optimization Log Artifact
    const logData: OptimizationLogData = {
      registeredAt: timestamp,
      intervention: interventionData,
      finalComparison: comparisonData,
    };
    setOptimizationLog(logData);
    localStorage.setItem('evo_c05_optimization_log', JSON.stringify(logData));

    // 3. Mark Chapter 05 as Completed
    localStorage.setItem('evo_c05_status', 'completed');
    setIsCompleted(true);

    if (onChapterCompleted) {
      onChapterCompleted();
    }

    // Scroll smoothly to artifacts
    setTimeout(() => {
      const artifactEl = document.getElementById('artefactos-capitulo-05');
      if (artifactEl) {
        artifactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleResetLab = () => {
    setIsCompleted(false);
    setCurrentStation(1);
    const topEl = document.getElementById('pantalla-capitulo-05');
    if (topEl) topEl.scrollIntoView({ behavior: 'smooth' });
  };

  const stationsMeta = [
    { num: 1, title: 'Línea Base en Reposo', short: '01 Línea Base' },
    { num: 2, title: 'Auditoría de Inicio', short: '02 Inicio' },
    { num: 3, title: 'Ficha de Proceso', short: '03 Proceso' },
    { num: 4, title: 'Servicios de Sistema', short: '04 Servicios' },
    { num: 5, title: 'Tareas Programadas', short: '05 Tareas' },
    { num: 6, title: 'Auditoría de Red', short: '06 Red' },
    { num: 7, title: 'Intervención Controlada', short: '07 Intervención' },
    { num: 8, title: 'Modo Normal vs Limpio', short: '08 Prueba Final' },
  ];

  return (
    <div id="pantalla-capitulo-05" className="w-full min-h-screen py-6 sm:py-10 text-[#f4f4f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Navigation Top Bar */}
        <nav className="flex items-center justify-between pb-5 border-b border-zinc-800/60">
          <button
            type="button"
            onClick={onBackToIndex}
            className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
            id="btn-volver-indice-c05"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
            <span>← VOLVER A ÍNDICE DEL TOMO 01</span>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono-tech">
            <span className="w-2 h-2 bg-yellow-400 inline-block" />
            <span className="tracking-widest uppercase text-white font-bold">
              TOMO 01 // CAPÍTULO 05
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-yellow-400 font-semibold tracking-wider">
              WINDOWS EN MOVIMIENTO
            </span>
          </div>
        </nav>

        {/* Inherited Evidence Banner */}
        <ExpedienteAcumuladoC05Banner
          specs={specs}
          fluidezProfile={fluidezData}
          limitationMatrix={limitationData}
          onOpenChapter04={onOpenChapter04}
        />

        {/* Chapter Header */}
        <header className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-zinc-400">
            <span>TOMO 01 // CONOCÉ TU PC</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold">
              CAPÍTULO 05 // LABORATORIO EXPERIMENTAL
            </span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
            WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO
          </h1>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border-l-4 border-yellow-400 space-y-3">
            <p className="font-sans-editorial text-lg sm:text-xl text-white font-medium italic leading-relaxed">
              “Optimizar no es desactivar más cosas. Optimizar es eliminar trabajo innecesario sin romper el trabajo necesario.”
            </p>
            <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs text-zinc-400">
              <span className="text-yellow-400 font-bold">MÉTODO EVO:</span>
              <span>OBSERVAR</span>
              <span>→</span>
              <span>DESCUBRIR</span>
              <span>→</span>
              <span>AISLAR</span>
              <span>→</span>
              <span>INTERVENIR</span>
              <span>→</span>
              <span>MEDIR</span>
              <span>→</span>
              <span>COMPARAR</span>
              <span>→</span>
              <span>CONSERVAR O REVERTIR</span>
            </div>
          </div>
        </header>

        {/* Station Navigation Strip */}
        <div className="p-3 bg-[#111218] border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between px-2 text-xs font-mono-tech text-zinc-400">
            <span className="uppercase font-bold text-white">ESTACIONES DEL LABORATORIO:</span>
            <span className="text-yellow-400">
              ESTACIÓN {currentStation} DE {stationsMeta.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 font-mono-tech text-xs">
            {stationsMeta.map((station) => {
              const isActive = currentStation === station.num;
              return (
                <button
                  key={station.num}
                  type="button"
                  onClick={() => setCurrentStation(station.num)}
                  className={`px-2 py-2 rounded-xl text-center transition-all cursor-pointer truncate ${
                    isActive
                      ? 'bg-yellow-400 text-black font-bold shadow-lg shadow-yellow-400/20'
                      : 'bg-black/40 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
                  }`}
                  title={station.title}
                >
                  <span className="block text-[10px] opacity-80">{station.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Render Active Station */}
        <div className="transition-all duration-300">
          {currentStation === 1 && (
            <Station01Baseline
              baseline={baselineData}
              initialMetrics={baselineData}
              onSaveBaseline={handleSaveBaseline}
              onSaveMetrics={handleSaveBaseline}
              onNextStation={() => setCurrentStation(2)}
            />
          )}

          {currentStation === 2 && (
            <Station02StartupAudit
              initialAudit={startupAudit}
              initialTotal={startupAudit?.total ?? 9}
              initialEnabled={startupAudit?.enabled ?? 5}
              auditedApps={startupAudit?.auditedApps ?? []}
              onSaveAudit={handleSaveStartup}
              onSaveStartupAudit={(total, enabled, apps) => {
                handleSaveStartup({
                  total,
                  enabled,
                  disabled: Math.max(0, total - enabled),
                  auditedApps: apps,
                });
              }}
              onNextStation={() => setCurrentStation(3)}
            />
          )}

          {currentStation === 3 && (
            <Station03ProcessForensics
              initialProcess={processData}
              initialCard={processData}
              onSaveProcess={handleSaveProcess}
              onSaveCard={handleSaveProcess}
              onNextStation={() => setCurrentStation(4)}
            />
          )}

          {currentStation === 4 && (
            <Station04ServicesDeepDive
              initialService={serviceData}
              onSaveService={handleSaveService}
              onNextStation={() => setCurrentStation(5)}
            />
          )}

          {currentStation === 5 && (
            <Station05ScheduledTasks
              initialTask={taskData}
              onSaveTask={handleSaveTask}
              onNextStation={() => setCurrentStation(6)}
            />
          )}

          {currentStation === 6 && (
            <Station06NetworkConnections
              initialNetwork={networkData}
              onSaveNetwork={handleSaveNetwork}
              onNextStation={() => setCurrentStation(7)}
            />
          )}

          {currentStation === 7 && (
            <Station07ControlledIntervention
              initialData={interventionData}
              onSaveIntervention={handleSaveIntervention}
              onNextStation={() => setCurrentStation(8)}
            />
          )}

          {currentStation === 8 && (
            <Station08NormalVsClean
              initialComparison={comparisonData}
              onSaveComparison={handleSaveComparison}
              onFinishLaboratorio={handleFinishLaboratorio}
            />
          )}
        </div>

        {/* Artifacts Section (Rendered when completed or if already stored) */}
        {(isCompleted || activityMap || optimizationLog) && (
          <div id="artefactos-capitulo-05" className="pt-8 space-y-10 border-t border-zinc-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>EXPEDIENTE CONSOLIDADO // CAPÍTULO 05 COMPLETADO</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                ARTEFACTOS DE OPTIMIZACIÓN CONTROLADA
              </h2>
              <p className="font-sans-editorial text-sm sm:text-base text-zinc-300">
                Has completado la investigación sistemática de procesos, servicios y sockets de tu sistema.
                Tus evidencias están consolidadas en dos artefactos listos para consulta y descarga.
              </p>
            </div>

            {/* 1. Mapa de Actividad EVO 001 */}
            {activityMap && (
              <ActivityMapArtifact activityMap={activityMap} specs={specs} />
            )}

            {/* 2. Registro de Optimización EVO 001 */}
            {optimizationLog && (
              <OptimizationLogArtifact optimizationLog={optimizationLog} specs={specs} />
            )}

            {/* Bottom Actions */}
            <div className="p-6 rounded-2xl bg-black/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-tech text-xs">
              <div className="space-y-1">
                <span className="text-white font-bold uppercase block">
                  EXPEDIENTE DE OPTIMIZACIÓN ALMACENADO LOCALMENTE
                </span>
                <p className="text-zinc-400 text-[11px] font-sans-editorial">
                  Tus mediciones continuarán enriqueciendo los diagnósticos y comparativas de los próximos tomos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetLab}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Revisar Estaciones</span>
                </button>
                <button
                  type="button"
                  onClick={onBackToIndex}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-white font-bold uppercase hover:bg-zinc-700 transition-all cursor-pointer"
                >
                  Volver al Índice
                </button>
                {onOpenChapter06 && (
                  <button
                    type="button"
                    onClick={onOpenChapter06}
                    className="px-6 py-2.5 rounded-xl bg-yellow-400 text-black font-bold uppercase hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Continuar al Capítulo 06</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* ACTIVIDAD DE COMPROBACIÓN // COMPROBÁ LO QUE APRENDISTE */}
        <EvoChapterCheckSection
          chapterNumber="05"
          chapterTitle="WINDOWS TAMBIÉN ES HARDWARE"
          isAlreadyCompleted={isCompleted}
          onPassCheck={handleFinishLaboratorio}
        />

        {/* NAVEGACIÓN PEDAGÓGICA DEFINITIVA */}
        <EvoChapterNavigationFooter
          currentChapterNumber="05"
          currentChapterTitle="WINDOWS Y PROCESOS"
          isCompleted={isCompleted}
          onMarkCompleted={handleFinishLaboratorio}
          onBackToIndex={onBackToIndex}
          onPreviousChapter={onOpenChapter04 || onBackToIndex}
          onNextChapter={onOpenChapter06 || onBackToIndex}
          previousChapterLabel="CAPÍTULO 04: ENCONTRÁ EL LÍMITE"
          nextChapterLabel="CAPÍTULO 06: TALLER DE DIAGNÓSTICO"
          isNextAvailable={true}
        />
      </div>
    </div>
  );
};
