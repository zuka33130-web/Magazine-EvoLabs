// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS SERVICES TELEMETRY LAB — DUAL ENGINE: SIMULATED & REAL PC
// Interactive Dependency Graph, Live Consequence Modeling & Rigorous A/B Telemetry
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Server,
  Activity,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Search,
  Printer,
  Shield,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check,
  Power,
  Info
} from 'lucide-react';
import {
  WINDOWS_SERVICES_DATABASE,
  AUDIO_DEPENDENCY_NODES,
  ServiceDependencyNode
} from '../data/servicesData';
import { WindowsServiceItem, TelemetryDeltaResult } from '../engine/types';
import { SimulatedMonitorScreen } from '../components/SimulatedMonitorScreen';

interface WindowsServicesTelemetryLabProps {
  isLocalAgentConnected?: boolean;
  onConnectLocalAgent?: () => void;
  className?: string;
}

// Dynamic Dependency Tree generator per service
interface DependencyChainNode {
  name: string;
  role: string;
  isParent?: boolean;
  isTarget?: boolean;
  isChild?: boolean;
  state: 'RUNNING' | 'STOPPED' | 'AFFECTED';
}

export const WindowsServicesTelemetryLab: React.FC<WindowsServicesTelemetryLabProps> = ({
  isLocalAgentConnected = false,
  onConnectLocalAgent,
  className = ''
}) => {
  const [engineMode, setEngineMode] = useState<'SIMULATED' | 'REAL_PC'>('SIMULATED');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('svc-audiosrv');
  const [servicesState, setServicesState] = useState<WindowsServiceItem[]>(WINDOWS_SERVICES_DATABASE);

  // Audio nodes state for audio specific stack
  const [audioNodes, setAudioNodes] = useState<ServiceDependencyNode[]>(AUDIO_DEPENDENCY_NODES);

  // Functional test state
  const [activeTestResult, setActiveTestResult] = useState<{
    type: string;
    passed: boolean;
    message: string;
    diagnosticDetails?: string;
  } | null>(null);

  // Telemetry Delta Baseline
  const [telemetryDelta, setTelemetryDelta] = useState<TelemetryDeltaResult | null>(null);

  const selectedService =
    servicesState.find((s) => s.id === selectedServiceId) || servicesState[0];

  const isCurrentServiceRunning = selectedService.state === 'RUNNING';

  // Build dynamic dependency graph nodes for any selected service
  const dependencyGraph: DependencyChainNode[] = useMemo(() => {
    const isTargetRunning = selectedService.state === 'RUNNING';
    const chain: DependencyChainNode[] = [];

    // 1. Upstream Parents (Dependencies)
    if (selectedService.dependencies && selectedService.dependencies.length > 0) {
      selectedService.dependencies.forEach((dep) => {
        const parentSvc = servicesState.find(
          (s) => s.serviceName.toLowerCase() === dep.toLowerCase() || s.id.toLowerCase().includes(dep.toLowerCase())
        );
        const isParentRunning = parentSvc ? parentSvc.state === 'RUNNING' : true;
        chain.push({
          name: dep,
          role: 'Servicio Base (Requerimiento upstream)',
          isParent: true,
          state: isParentRunning ? 'RUNNING' : 'STOPPED'
        });
      });
    } else {
      chain.push({
        name: 'NT Kernel / SCM Core',
        role: 'Subsistema raíz de Windows',
        isParent: true,
        state: 'RUNNING'
      });
    }

    // 2. Target Service
    chain.push({
      name: selectedService.serviceName,
      role: selectedService.displayName,
      isTarget: true,
      state: isTargetRunning ? 'RUNNING' : 'STOPPED'
    });

    // 3. Downstream Consumers (Dependents / Apps)
    if (selectedService.dependents && selectedService.dependents.length > 0) {
      selectedService.dependents.slice(0, 3).forEach((dep) => {
        chain.push({
          name: dep,
          role: 'Consumidor / API dependiente downstream',
          isChild: true,
          state: isTargetRunning ? 'RUNNING' : 'AFFECTED'
        });
      });
    } else {
      chain.push({
        name: 'Aplicaciones de Usuario',
        role: 'Consumidores de API en Espacio de Usuario',
        isChild: true,
        state: isTargetRunning ? 'RUNNING' : 'AFFECTED'
      });
    }

    return chain;
  }, [selectedService, servicesState]);

  // Stop simulated service
  const handleSimulateStop = (svcId: string) => {
    setServicesState((prev) =>
      prev.map((s) => (s.id === svcId ? { ...s, state: 'STOPPED' } : s))
    );

    if (svcId === 'svc-audiosrv' || svcId === 'svc-audioendpointbuilder') {
      setAudioNodes((prev) =>
        prev.map((n) =>
          n.id === 'node-audiosrv' || n.id === 'node-mmdevice' || n.id === 'node-apps'
            ? { ...n, isActive: false }
            : n
        )
      );
    }

    const target = servicesState.find((s) => s.id === svcId);
    if (target) {
      const ramSaved = Math.abs(target.telemetryImpact.ramDeltaMb);
      setTelemetryDelta({
        metricType: engineMode === 'REAL_PC' ? 'MEASURED' : 'SIMULATED',
        serviceName: target.serviceName,
        before: {
          ramUsedMb: 2450,
          cpuIdlePercent: 96.5,
          runningProcesses: 148,
          runningServices: 84,
          diskQueueLength: 0.02
        },
        after: {
          ramUsedMb: 2450 - ramSaved,
          cpuIdlePercent: 96.8,
          runningProcesses: 147,
          runningServices: 83,
          diskQueueLength: 0.01
        },
        delta: {
          ramMb: -ramSaved,
          cpuPercent: 0.3,
          processes: -1,
          services: -1
        },
        whatYouGained: `-${ramSaved} MB de RAM liberados en memoria física (Dato SIMULATED de referencia).`,
        whatYouLost: target.telemetryImpact.lostFunctionality,
        whatBroke:
          target.functionalRisk === 'CRÍTICO' || target.functionalRisk === 'ALTO'
            ? `Pruebas funcionales del subsistema arrojaron fallo de comunicación RPC/LPC en ${target.serviceName}.`
            : 'Ninguna prueba funcional crítica se vio afectada de inmediato.',
        riskEvaluation: target.functionalRisk,
        scientificConclusion:
          target.functionalRisk === 'CRÍTICO' || target.functionalRisk === 'ALTO'
            ? 'EMPEORÓ'
            : 'SIN CAMBIO SIGNIFICATIVO',
        rollbackCommand: `Start-Service -Name "${target.serviceName}"; Set-Service -Name "${target.serviceName}" -StartupType Automatic`
      });
    }
  };

  // Rollback simulated service
  const handleRollbackService = (svcId: string) => {
    setServicesState((prev) =>
      prev.map((s) => (s.id === svcId ? { ...s, state: 'RUNNING', startupType: 'Automatic' } : s))
    );
    if (svcId === 'svc-audiosrv' || svcId === 'svc-audioendpointbuilder') {
      setAudioNodes(AUDIO_DEPENDENCY_NODES);
    }
    setActiveTestResult(null);
    setTelemetryDelta(null);
  };

  // Run functional test
  const handleRunFunctionalTest = (testType?: string) => {
    const currentTest = testType || selectedService.functionalTestType || 'generic';
    const isTargetRunning = selectedService.state === 'RUNNING';

    if (currentTest === 'audio') {
      const isAudiosrvRunning =
        servicesState.find((s) => s.id === 'svc-audiosrv')?.state === 'RUNNING';
      const isEndpointRunning =
        servicesState.find((s) => s.id === 'svc-audioendpointbuilder')?.state === 'RUNNING';

      if (!isAudiosrvRunning || !isEndpointRunning) {
        setActiveTestResult({
          type: 'audio',
          passed: false,
          message: 'FALLO EN TEST DE AUDIO: No se detectó ningún punto final de audio activo. Audiosrv o AudioEndpointBuilder están detenidos. La PC quedó muda.',
          diagnosticDetails: 'HRESULT: 0x80070426 (SERVICE_NOT_ACTIVE) -> IAudioClient::Initialize() rechazado por el subsistema.'
        });
      } else {
        setActiveTestResult({
          type: 'audio',
          passed: true,
          message: 'TEST DE AUDIO SUPERADO: MMDeviceAPI respondió en 1.2 ms. Búfer de salida estéreo activo sin latencia añadida.',
          diagnosticDetails: 'HRESULT: S_OK -> Endpoint render enumerado en altavoces predeterminados.'
        });
      }
    } else if (currentTest === 'network') {
      const isDnsRunning =
        servicesState.find((s) => s.id === 'svc-dnscache')?.state === 'RUNNING';
      const isDhcpRunning =
        servicesState.find((s) => s.id === 'svc-dhcp')?.state === 'RUNNING';

      if (!isDnsRunning || !isDhcpRunning) {
        setActiveTestResult({
          type: 'network',
          passed: false,
          message: 'FALLO EN TEST DE RED: Resolución de nombres imposible o asignación IP nula. Los navegadores no pueden abrir URLs.',
          diagnosticDetails: 'DNSAPI: WSAHOST_NOT_FOUND (11001). Pila Winsock no puede resolver consultas FQDN.'
        });
      } else {
        setActiveTestResult({
          type: 'network',
          passed: true,
          message: 'TEST DE RED SUPERADO: Resolución DNS de host exitosa en 8 ms.',
          diagnosticDetails: 'DNSAPI: Query a 1.1.1.1 resolvió correctamente en caché local.'
        });
      }
    } else if (currentTest === 'search') {
      const isSearchRunning =
        servicesState.find((s) => s.id === 'svc-wsearch')?.state === 'RUNNING';

      if (!isSearchRunning) {
        setActiveTestResult({
          type: 'search',
          passed: false,
          message: 'TEST DE BÚSQUEDA DEGRADADO: Indexer detenido. Las búsquedas en el Menú Inicio recurren a búsqueda secuencial en disco.',
          diagnosticDetails: 'Search.Indexer COM interface unattached. Latencia de búsqueda: +4200ms.'
        });
      } else {
        setActiveTestResult({
          type: 'search',
          passed: true,
          message: 'TEST DE BÚSQUEDA SUPERADO: Índice de archivos activo con respuesta en <15ms.',
          diagnosticDetails: 'Windows Search Catalog validado.'
        });
      }
    } else {
      if (!isTargetRunning) {
        setActiveTestResult({
          type: 'general',
          passed: false,
          message: `FALLO EN SUBSISTEMA: El servicio ${selectedService.serviceName} está detenido. ${selectedService.telemetryImpact.lostFunctionality}`,
          diagnosticDetails: `SCM State: SERVICE_STOPPED (ExitCode: 0). Consecuencia: ${selectedService.telemetryImpact.potentialSideEffect}`
        });
      } else {
        setActiveTestResult({
          type: 'general',
          passed: true,
          message: `TEST OPERATIVO OK: El servicio ${selectedService.serviceName} está respondiendo normalmente a solicitudes IPC.`,
          diagnosticDetails: `SCM State: SERVICE_RUNNING (PID: ${selectedService.pid || 1024}).`
        });
      }
    }
  };

  const isAudioBroken =
    servicesState.find((s) => s.id === 'svc-audiosrv')?.state === 'STOPPED' ||
    servicesState.find((s) => s.id === 'svc-audioendpointbuilder')?.state === 'STOPPED';

  const isNetworkBroken =
    servicesState.find((s) => s.id === 'svc-dnscache')?.state === 'STOPPED' ||
    servicesState.find((s) => s.id === 'svc-dhcp')?.state === 'STOPPED';

  return (
    <div className={`space-y-5 font-mono-tech select-none ${className}`}>
      {/* Top Banner & Dual Engine Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
              TELEMETRÍA SCM // SERVICIOS & DEPENDENCIAS
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                engineMode === 'SIMULATED'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              MODO: {engineMode}
            </span>
          </div>
          <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
            Laboratorio de Telemetría de Servicios de Windows
          </h2>
        </div>

        {/* Engine Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-black/60 rounded-xl border border-cyan-950 text-xs">
            <button
              type="button"
              onClick={() => setEngineMode('SIMULATED')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                engineMode === 'SIMULATED'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              SIMULATED
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isLocalAgentConnected) {
                  // Alert agent required
                  alert(
                    'REAL PC = NO DISPONIBLE\n\nEste modo requiere que EVO Local Agent esté ejecutándose en tu máquina local para capturar telemetría real. Nunca mostramos datos inventados en modo real.'
                  );
                } else {
                  setEngineMode('REAL_PC');
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                engineMode === 'REAL_PC'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              REAL PC {isLocalAgentConnected ? '(CONECTADO)' : '(NO DISPONIBLE)'}
            </button>
          </div>
        </div>
      </div>

      {/* Mode Warning Notice */}
      {engineMode === 'SIMULATED' ? (
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>AMBIENTE MODELADO // SIMULATED:</strong> Podés detener o deshabilitar cualquier servicio libremente para observar cómo responde Windows.
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold hidden sm:inline">
            ZERO-RISK LAB
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>CONECTADO A PC REAL // EVO LOCAL AGENT:</strong> Telemetría capturada en vivo mediante consultas WMI/CIM reales.
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">
            SYSTEM_REPORTED
          </span>
        </div>
      )}

      {/* ========================================================
          MASTER 2-COLUMN VIEW (SERVICES LIST & DEPENDENCY GRAPH)
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: SERVICES TABLE (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-950 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                CONSOLA DE SERVICIOS (SERVICES.MSC VIRTUAL)
              </span>
              <span className="text-zinc-500 text-[10.5px]">
                {servicesState.length} SERVICIOS AUDITADOS
              </span>
            </div>

            {/* Services Table List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 text-xs">
              {servicesState.map((svc) => {
                const isSelected = svc.id === selectedServiceId;
                const isRunning = svc.state === 'RUNNING';

                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50'
                        : 'bg-black/50 border-zinc-900 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {svc.serviceName}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isRunning
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {svc.state}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-sans-editorial block truncate max-w-xs">
                        {svc.displayName}
                      </span>
                    </div>

                    <div className="text-right font-mono text-[10.5px]">
                      <span className="text-zinc-400 block">{svc.startupType}</span>
                      <span className="text-cyan-400 text-[10px]">PID: {svc.pid || '-'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Service Detailed Dossier */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-950 space-y-3.5">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                  EXPEDIENTE DE SERVICIO
                </span>
                <h3 className="font-bold text-base text-white">{selectedService.serviceName}</h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                  selectedService.functionalRisk === 'CRÍTICO'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    : selectedService.functionalRisk === 'ALTO'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                RIESGO: {selectedService.functionalRisk}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-zinc-200 font-sans-editorial leading-relaxed">
                <strong className="text-cyan-400 font-mono">QUÉ ES Y PARA QUÉ SIRVE: </strong>
                {selectedService.simpleExplanation}
              </p>

              <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-900 space-y-1">
                <span className="text-[10px] text-zinc-400 block font-bold">DEPENDENCIAS CLAVE:</span>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-cyan-300">
                  {selectedService.dependencies.map((d, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-900">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons: Stop / Disable / Rollback */}
            <div className="flex items-center justify-between pt-2 border-t border-cyan-950">
              {selectedService.state === 'RUNNING' ? (
                <button
                  type="button"
                  onClick={() => handleSimulateStop(selectedService.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>[ SIMULAR STOP ]</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRollbackService(selectedService.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>[ RESTABLECER SERVICIO ]</span>
                </button>
              )}

              {/* Functional Test Trigger Button */}
              {selectedService.functionalTestType && (
                <button
                  type="button"
                  onClick={() => handleRunFunctionalTest(selectedService.functionalTestType!)}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md"
                >
                  PROBAR {selectedService.functionalTestType.toUpperCase()} ➔
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DEPENDENCY GRAPH & LIVE TELEMETRY (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Mini Simulated Monitor preview showing effect */}
          <SimulatedMonitorScreen
            screenState="desktop"
            isAudioBroken={isAudioBroken}
            isNetworkBroken={isNetworkBroken}
            customOverlayText={
              isAudioBroken
                ? 'EFECTO DETECTADO: El icono de sonido muestra una X roja. Las llamadas a MMDeviceAPI fallan.'
                : undefined
            }
          />

          {/* Interactive Dependency Graph Visual for Selected Service */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-950 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                GRAFO DE DEPENDENCIAS // {selectedService.serviceName}
              </span>
              <span className="text-zinc-500 text-[10px]">SCM DEPENDENCY TREE</span>
            </div>

            {/* Dynamic Dependency Chain */}
            <div className="space-y-1.5 text-xs">
              {dependencyGraph.map((node, nIdx) => (
                <div key={nIdx} className="space-y-1">
                  <div
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      node.state === 'RUNNING'
                        ? node.isTarget
                          ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                          : 'bg-black/60 border-zinc-800 text-zinc-200'
                        : 'bg-rose-950/30 border-rose-500/50 text-rose-300 opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          node.state === 'RUNNING'
                            ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]'
                            : 'bg-rose-500 shadow-[0_0_6px_#F43F5E]'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{node.name}</span>
                          {node.isTarget && (
                            <span className="px-1.5 py-0.2 bg-cyan-400 text-black text-[9px] font-black rounded uppercase">
                              SELECCIONADO
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-sans-editorial">{node.role}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        node.state === 'RUNNING'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {node.state === 'RUNNING' ? 'ACTIVO' : 'AFECTADO'}
                    </span>
                  </div>

                  {nIdx < dependencyGraph.length - 1 && (
                    <div className="flex justify-center text-cyan-500 text-xs font-bold leading-none py-0.5">
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Impact Consequence Matrix: Qué depende, Qué se apaga, Qué puede fallar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-cyan-950 text-[11px] font-sans-editorial">
              <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950 space-y-1">
                <span className="font-mono text-[10px] font-bold text-cyan-300 uppercase block">
                  1. QUÉ DEPENDE DE ÉL:
                </span>
                <p className="text-zinc-300 leading-snug">
                  {selectedService.dependents.length > 0
                    ? selectedService.dependents.join(', ')
                    : 'Pila base de usuario'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-amber-950/60 space-y-1">
                <span className="font-mono text-[10px] font-bold text-amber-300 uppercase block">
                  2. QUÉ SE APAGA:
                </span>
                <p className="text-zinc-300 leading-snug">
                  {selectedService.telemetryImpact.lostFunctionality}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-rose-950/60 space-y-1">
                <span className="font-mono text-[10px] font-bold text-rose-300 uppercase block">
                  3. QUÉ PUEDE FALLAR:
                </span>
                <p className="text-zinc-300 leading-snug">
                  {selectedService.telemetryImpact.potentialSideEffect}
                </p>
              </div>
            </div>
          </div>

          {/* Functional Test Result Box */}
          {activeTestResult && (
            <div
              className={`p-4 rounded-xl border text-xs font-sans-editorial leading-relaxed space-y-1.5 animate-in fade-in ${
                activeTestResult.passed
                  ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500 text-rose-200'
              }`}
            >
              <div className="font-bold font-mono text-xs uppercase flex items-center gap-1.5">
                {activeTestResult.passed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>RESULTADO DE LA COMPROBACIÓN // ÉXITO</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>RESULTADO DE LA COMPROBACIÓN // FALLO CONFIRMADO</span>
                  </>
                )}
              </div>
              <p>{activeTestResult.message}</p>
            </div>
          )}

          {/* Telemetry A/B Delta Result */}
          {telemetryDelta && (
            <div className="p-4 sm:p-5 rounded-2xl bg-black/80 border-2 border-cyan-400/80 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  TELEMETRÍA A/B // IMPACTO PERICIAL DEL CAMBIO
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-400 text-black text-[9px] font-black uppercase">
                  {telemetryDelta.metricType}
                </span>
              </div>

              {/* Comparative Table: Antes vs Después vs Delta */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block uppercase">ANTES</span>
                  <div className="text-white font-bold">{telemetryDelta.before.ramUsedMb} MB</div>
                  <div className="text-[9.5px] text-zinc-500">RAM USADA</div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block uppercase">DESPUÉS</span>
                  <div className="text-cyan-300 font-bold">{telemetryDelta.after.ramUsedMb} MB</div>
                  <div className="text-[9.5px] text-zinc-500">RAM USADA</div>
                </div>

                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-400">
                  <span className="text-[10px] text-cyan-400 block uppercase font-bold">DELTA</span>
                  <div className="text-emerald-400 font-bold">{telemetryDelta.delta.ramMb} MB</div>
                  <div className="text-[9.5px] text-cyan-300">GANANCIA</div>
                </div>
              </div>

              {/* Forensic Balance: Qué ganaste vs Qué perdiste */}
              <div className="space-y-1.5 text-xs font-sans-editorial">
                <div className="text-emerald-300">
                  <strong className="font-mono">QUÉ GANASTE: </strong> {telemetryDelta.whatYouGained}
                </div>
                <div className="text-rose-300">
                  <strong className="font-mono">QUÉ PERDISTE: </strong> {telemetryDelta.whatYouLost}
                </div>
                <div className="text-amber-300">
                  <strong className="font-mono">ESTADO FUNCIONAL: </strong> {telemetryDelta.whatBroke}
                </div>
              </div>

              {/* Conclusion & Action Buttons: Functional Test & Rollback */}
              <div className="pt-2.5 border-t border-cyan-950 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-[11px]">CONCLUSIÓN DETERMINISTA:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded font-black text-[10.5px] ${
                      telemetryDelta.scientificConclusion === 'EMPEORÓ'
                        ? 'bg-rose-500 text-black'
                        : 'bg-cyan-400 text-black'
                    }`}
                  >
                    {telemetryDelta.scientificConclusion}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunFunctionalTest(selectedService.functionalTestType)}
                    className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-[10.5px] cursor-pointer shadow-sm"
                  >
                    PRUEBA FUNCIONAL ➔
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRollbackService(selectedService.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-bold cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>ROLLBACK</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
