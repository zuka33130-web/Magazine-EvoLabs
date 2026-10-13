// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS 11 SERVICES & TELEMETRY LAB — DUAL ENGINE: SIMULATED & REAL PC
// Complete Technical Catalog of Native Windows 11 Services Across 9 Domains
// Interactive Dependency Graph, Live Consequence Modeling, Telemetry & Restoration
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
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
  Info,
  X,
  Lock,
  Cpu,
  Filter,
  HardDrive,
  RefreshCw,
  AlertOctagon,
  Sparkles,
  Laptop
} from 'lucide-react';
import {
  WINDOWS_SERVICES_DATABASE,
  WINDOWS_SERVICE_CATEGORIES,
  AUDIO_DEPENDENCY_NODES,
  ServiceDependencyNode
} from '../data/servicesData';
import {
  WindowsServiceItem,
  WindowsServiceCategory,
  WindowsServiceKind,
  TelemetryDeltaResult
} from '../engine/types';
import { SimulatedMonitorScreen } from '../components/SimulatedMonitorScreen';
import {
  EvoAgentClient,
  AgentHealth,
  AgentWindowsService
} from '../../../../evoLabCore/services/evoAgentClient';

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

interface PendingRealAction {
  serviceName: string;
  displayName: string;
  action: 'STOP' | 'START';
  isRollback?: boolean;
  risk: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  dependencies: string[];
  lostFunctionality: string;
  sideEffect: string;
}

export const WindowsServicesTelemetryLab: React.FC<WindowsServicesTelemetryLabProps> = ({
  isLocalAgentConnected: initialAgentConnected = false,
  onConnectLocalAgent,
  className = ''
}) => {
  const [engineMode, setEngineMode] = useState<'SIMULATED' | 'REAL_PC'>('SIMULATED');
  
  // State for simulated services database
  const [servicesState, setServicesState] = useState<WindowsServiceItem[]>(WINDOWS_SERVICES_DATABASE);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('svc-rpcss');

  // Category and Filter states
  const [activeCategory, setActiveCategory] = useState<WindowsServiceCategory | 'ALL'>('sistema-critico');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterKind, setFilterKind] = useState<'ALL' | WindowsServiceKind>('ALL');
  const [filterState, setFilterState] = useState<'ALL' | 'RUNNING' | 'STOPPED'>('ALL');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO'>('ALL');

  // Functional test state
  const [activeTestResult, setActiveTestResult] = useState<{
    type: string;
    passed: boolean;
    message: string;
    diagnosticDetails?: string;
  } | null>(null);

  // Telemetry Delta Baseline
  const [telemetryDelta, setTelemetryDelta] = useState<TelemetryDeltaResult | null>(null);

  // Real Agent State & Real Services
  const [agentHealth, setAgentHealth] = useState<AgentHealth | null>(null);
  const [isCheckingAgent, setIsCheckingAgent] = useState<boolean>(false);
  const [realServices, setRealServices] = useState<AgentWindowsService[]>([]);
  const [realAllowlist, setRealAllowlist] = useState<string[]>([]);
  const [isLoadingRealServices, setIsLoadingRealServices] = useState<boolean>(false);
  const [selectedRealServiceName, setSelectedRealServiceName] = useState<string>('SysMain');

  // Map storing initial state of real services before any experiment
  const [initialRealStateMap, setInitialRealStateMap] = useState<Record<string, 'RUNNING' | 'STOPPED'>>({});

  // Confirmation Modal for Real PC Experiments
  const [pendingRealAction, setPendingRealAction] = useState<PendingRealAction | null>(null);
  const [isExecutingRealAction, setIsExecutingRealAction] = useState<boolean>(false);

  // Check Agent Connection (Strictly: health.status === 'OK' && health.isWindows === true)
  const checkAgentConnection = async () => {
    setIsCheckingAgent(true);
    try {
      const health = await EvoAgentClient.pingAgent(1800);
      setAgentHealth(health);
      if (health && health.status === 'OK' && health.isWindows) {
        await loadRealServices();
      }
    } catch {
      setAgentHealth(null);
    } finally {
      setIsCheckingAgent(false);
    }
  };

  const loadRealServices = async () => {
    setIsLoadingRealServices(true);
    try {
      const res = await EvoAgentClient.fetchWindowsServices();
      if (res && res.services) {
        setRealServices(res.services);

        setInitialRealStateMap((prev) => {
          const updated = { ...prev };
          res.services.forEach((s) => {
            const normalizedName = s.name.toLowerCase();
            if (!updated[normalizedName]) {
              updated[normalizedName] = s.state.toLowerCase() === 'running' ? 'RUNNING' : 'STOPPED';
            }
          });
          return updated;
        });

        if (res.experimentAllowlist && Array.isArray(res.experimentAllowlist)) {
          setRealAllowlist(res.experimentAllowlist);
        }
      }
    } catch (err) {
      console.error('Error fetching real services:', err);
    } finally {
      setIsLoadingRealServices(false);
    }
  };

  useEffect(() => {
    checkAgentConnection();
  }, []);

  const isRealAgentActive = Boolean(
    agentHealth && agentHealth.status === 'OK' && agentHealth.isWindows === true
  );

  // Selected simulated service
  const selectedService = useMemo(() => {
    const found = servicesState.find((s) => s.id === selectedServiceId);
    return found || servicesState[0];
  }, [servicesState, selectedServiceId]);

  // Selected real service
  const selectedRealService = useMemo(() => {
    const found = realServices.find(
      (s) => s.name.toLowerCase() === selectedRealServiceName.toLowerCase()
    );
    return found || realServices[0];
  }, [realServices, selectedRealServiceName]);

  // Lookup reference service in catalog for selected real service
  const referenceService = useMemo(() => {
    if (engineMode !== 'REAL_PC' || !selectedRealService) return null;
    return (
      WINDOWS_SERVICES_DATABASE.find(
        (s) => s.serviceName.toLowerCase() === selectedRealService.name.toLowerCase()
      ) || null
    );
  }, [engineMode, selectedRealService]);

  // Category statistics and stopped counts
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; stopped: number }> = {};
    WINDOWS_SERVICE_CATEGORIES.forEach((cat) => {
      stats[cat.id] = { total: 0, stopped: 0 };
    });
    servicesState.forEach((svc) => {
      if (svc.category && stats[svc.category]) {
        stats[svc.category].total += 1;
        if (svc.state === 'STOPPED') {
          stats[svc.category].stopped += 1;
        }
      }
    });
    return stats;
  }, [servicesState]);

  // Total stopped count across the whole catalog
  const totalStoppedCount = useMemo(() => {
    return servicesState.filter((s) => s.state === 'STOPPED').length;
  }, [servicesState]);

  // Filtered services for current tab and search/filter criteria
  const filteredServices = useMemo(() => {
    if (engineMode === 'REAL_PC') {
      return realServices.filter((rSvc) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          rSvc.name.toLowerCase().includes(q) ||
          rSvc.displayName.toLowerCase().includes(q)
        );
      });
    }

    return servicesState.filter((svc) => {
      // 1. Category Tab Filter
      if (activeCategory !== 'ALL' && svc.category !== activeCategory) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = svc.serviceName.toLowerCase().includes(q);
        const matchDisplay = svc.displayName.toLowerCase().includes(q);
        const matchRole = svc.subsystemRole.toLowerCase().includes(q);
        const matchBinary = svc.binaryPath.toLowerCase().includes(q);
        const matchExplanation = svc.simpleExplanation.toLowerCase().includes(q);
        if (!matchName && !matchDisplay && !matchRole && !matchBinary && !matchExplanation) {
          return false;
        }
      }

      // 3. Service Kind Filter
      if (filterKind !== 'ALL' && svc.serviceKind !== filterKind) {
        return false;
      }

      // 4. State Filter
      if (filterState !== 'ALL' && svc.state !== filterState) {
        return false;
      }

      // 5. Risk Filter
      if (filterRisk !== 'ALL' && svc.functionalRisk !== filterRisk) {
        return false;
      }

      return true;
    });
  }, [
    engineMode,
    realServices,
    servicesState,
    activeCategory,
    searchQuery,
    filterKind,
    filterState,
    filterRisk
  ]);

  // Build dynamic dependency graph nodes for selected service or reference service
  const dependencyGraph: DependencyChainNode[] = useMemo(() => {
    const activeSvc = engineMode === 'REAL_PC' ? referenceService : selectedService;
    if (!activeSvc) return [];

    const isTargetRunning =
      engineMode === 'REAL_PC'
        ? selectedRealService?.state.toLowerCase() === 'running'
        : activeSvc.state === 'RUNNING';

    const chain: DependencyChainNode[] = [];

    // 1. Upstream Parents (Dependencies)
    if (activeSvc.dependencies && activeSvc.dependencies.length > 0) {
      activeSvc.dependencies.forEach((dep) => {
        const parentSvc = servicesState.find(
          (s) =>
            s.serviceName.toLowerCase() === dep.toLowerCase() ||
            s.id.toLowerCase().includes(dep.toLowerCase())
        );
        const isParentRunning = parentSvc ? parentSvc.state === 'RUNNING' : true;
        chain.push({
          name: dep,
          role: 'Servicio Base Requerido (Upstream)',
          isParent: true,
          state: isParentRunning ? 'RUNNING' : 'STOPPED'
        });
      });
    } else {
      chain.push({
        name: 'NT Kernel / SCM Core',
        role: 'Subsistema raíz de Windows NT',
        isParent: true,
        state: 'RUNNING'
      });
    }

    // 2. Target Service
    chain.push({
      name: activeSvc.serviceName,
      role: activeSvc.displayName,
      isTarget: true,
      state: isTargetRunning ? 'RUNNING' : 'STOPPED'
    });

    // 3. Downstream Consumers (Dependents / Apps)
    if (activeSvc.dependents && activeSvc.dependents.length > 0) {
      activeSvc.dependents.slice(0, 4).forEach((dep) => {
        chain.push({
          name: dep,
          role: 'Consumidor / Subsistema dependiente (Downstream)',
          isChild: true,
          state: isTargetRunning ? 'RUNNING' : 'AFFECTED'
        });
      });
    } else {
      chain.push({
        name: 'Aplicaciones de Usuario',
        role: 'Clientes de API en Modo Usuario',
        isChild: true,
        state: isTargetRunning ? 'RUNNING' : 'AFFECTED'
      });
    }

    return chain;
  }, [engineMode, referenceService, selectedService, selectedRealService, servicesState]);

  // Stop simulated service
  const handleSimulateStop = (svcId: string) => {
    const target = servicesState.find((s) => s.id === svcId);
    if (!target) return;

    setServicesState((prev) =>
      prev.map((s) => (s.id === svcId ? { ...s, state: 'STOPPED' } : s))
    );

    const ramGain = target.telemetryImpact.ramDeltaMb;
    const cpuGain = target.telemetryImpact.cpuDeltaPercent;

    setTelemetryDelta({
      metricType: 'SIMULATED',
      serviceName: target.serviceName,
      before: {
        ramUsedMb: 3420,
        cpuIdlePercent: 96.5,
        runningProcesses: 142,
        runningServices: servicesState.filter((s) => s.state === 'RUNNING').length,
        diskQueueLength: 0.02
      },
      after: {
        ramUsedMb: 3420 + ramGain,
        cpuIdlePercent: Math.min(100, +(96.5 - cpuGain).toFixed(1)),
        runningProcesses: 141,
        runningServices: servicesState.filter((s) => s.state === 'RUNNING').length - 1,
        diskQueueLength: 0.01
      },
      delta: {
        ramMb: ramGain,
        cpuPercent: cpuGain,
        processes: -1,
        services: -1
      },
      whatYouGained: `Memoria de proceso liberada: ${Math.abs(ramGain)} MB. Consumo de CPU reducido en ~${Math.abs(cpuGain)}%.`,
      whatYouLost: target.telemetryImpact.lostFunctionality,
      whatBroke: target.telemetryImpact.potentialSideEffect,
      riskEvaluation: target.functionalRisk,
      scientificConclusion:
        target.functionalRisk === 'CRÍTICO' || target.functionalRisk === 'ALTO'
          ? 'EMPEORÓ'
          : 'SIN CAMBIO SIGNIFICATIVO',
      rollbackCommand:
        target.restoration?.rollbackCommand || `Start-Service -Name "${target.serviceName}"`
    });

    setActiveTestResult(null);
  };

  // Rollback single simulated service
  const handleRollbackService = (svcId: string) => {
    const target = servicesState.find((s) => s.id === svcId);
    if (!target) return;

    setServicesState((prev) =>
      prev.map((s) => (s.id === svcId ? { ...s, state: 'RUNNING' } : s))
    );

    setTelemetryDelta(null);
    setActiveTestResult(null);
  };

  // Restore ALL simulated services to default state
  const handleRestoreAllSimulation = () => {
    setServicesState(WINDOWS_SERVICES_DATABASE);
    setTelemetryDelta(null);
    setActiveTestResult(null);
  };

  // Rollback real service via Agent
  const handleRollbackRealService = async (serviceName: string) => {
    const initial = initialRealStateMap[serviceName.toLowerCase()] || 'RUNNING';
    const action = initial === 'RUNNING' ? 'START' : 'STOP';

    try {
      const res = await EvoAgentClient.applyServiceExperiment(serviceName, action);
      if (res && res.success) {
        await loadRealServices();
        setTelemetryDelta(null);
      }
    } catch (err: any) {
      alert(`FALLO AL RESTAURAR: ${err?.message || 'Error en EVO Agent.'}`);
    }
  };

  // Request real action confirmation
  const handleRequestRealAction = (rSvc: AgentWindowsService, action: 'STOP' | 'START') => {
    const ref = WINDOWS_SERVICES_DATABASE.find(
      (s) => s.serviceName.toLowerCase() === rSvc.name.toLowerCase()
    );

    const risk = ref ? ref.functionalRisk : 'ALTO';
    const dependencies = ref ? ref.dependencies : ['Servicios del kernel NT'];
    const lostFunctionality = ref
      ? ref.telemetryImpact.lostFunctionality
      : 'Pérdida de la función del servicio en Windows.';
    const sideEffect = ref
      ? ref.telemetryImpact.potentialSideEffect
      : 'Posibles errores en cascada.';

    setPendingRealAction({
      serviceName: rSvc.name,
      displayName: rSvc.displayName,
      action,
      risk,
      dependencies,
      lostFunctionality,
      sideEffect
    });
  };

  // Confirm and execute real service action via Agent
  const handleConfirmRealAction = async () => {
    if (!pendingRealAction) return;
    setIsExecutingRealAction(true);

    try {
      const targetSvc = realServices.find(
        (s) => s.name.toLowerCase() === pendingRealAction.serviceName.toLowerCase()
      );
      const ramBefore = targetSvc ? targetSvc.workingSetMb : 0;

      const res = await EvoAgentClient.applyServiceExperiment(
        pendingRealAction.serviceName,
        pendingRealAction.action
      );

      if (res && res.success) {
        await loadRealServices();

        const latestInventory = await EvoAgentClient.fetchWindowsServices();
        const updatedSvc = latestInventory?.services?.find(
          (s) => s.name.toLowerCase() === pendingRealAction.serviceName.toLowerCase()
        );
        const ramAfter = updatedSvc ? updatedSvc.workingSetMb : 0;
        const ramDelta = ramAfter - ramBefore;

        setTelemetryDelta({
          metricType: 'SYSTEM_REPORTED',
          serviceName: res.serviceName,
          before: {
            ramUsedMb: ramBefore,
            cpuIdlePercent: -1,
            runningProcesses: -1,
            runningServices: -1,
            diskQueueLength: -1
          },
          after: {
            ramUsedMb: ramAfter,
            cpuIdlePercent: -1,
            runningProcesses: -1,
            runningServices: -1,
            diskQueueLength: -1
          },
          delta: {
            ramMb: +ramDelta.toFixed(1),
            cpuPercent: 0,
            processes: 0,
            services: 0
          },
          whatYouGained:
            pendingRealAction.action === 'STOP'
              ? `Memoria de proceso (WorkingSet) reportada por SO: -${Math.abs(ramDelta).toFixed(1)} MB`
              : `Servicio iniciado en SO. Memoria asignada: ${ramAfter} MB`,
          whatYouLost:
            pendingRealAction.action === 'STOP'
              ? pendingRealAction.lostFunctionality
              : 'Ninguna (Restaurado)',
          whatBroke:
            pendingRealAction.action === 'STOP'
              ? pendingRealAction.sideEffect
              : 'Ninguna (Operativo)',
          riskEvaluation: pendingRealAction.risk,
          scientificConclusion: 'NO HAY DATOS SUFICIENTES (INCONCLUSO)',
          rollbackCommand:
            pendingRealAction.action === 'STOP'
              ? `Start-Service -Name "${res.serviceName}"`
              : `Stop-Service -Name "${res.serviceName}"`
        });
      }
    } catch (err: any) {
      alert(`FALLO EN ACCIÓN REAL: ${err?.message || 'Error en EVO Agent.'}`);
    } finally {
      setIsExecutingRealAction(false);
      setPendingRealAction(null);
    }
  };

  // Run functional test
  const handleRunFunctionalTest = (testType?: string) => {
    const currentTest = testType || selectedService.functionalTestType || 'system';
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
          message:
            'FALLO EN TEST DE AUDIO: No se detectó ningún punto final de audio activo. Audiosrv o AudioEndpointBuilder están detenidos. La PC quedó muda.',
          diagnosticDetails:
            'HRESULT: 0x80070426 (SERVICE_NOT_ACTIVE) -> IAudioClient::Initialize() rechazado por el subsistema.'
        });
      } else {
        setActiveTestResult({
          type: 'audio',
          passed: true,
          message:
            'TEST DE AUDIO SUPERADO: MMDeviceAPI respondió en 1.2 ms. Búfer de salida estéreo activo sin latencia añadida.',
          diagnosticDetails:
            'HRESULT: S_OK -> Endpoint render enumerado en altavoces predeterminados.'
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
          message:
            'FALLO EN TEST DE RED: Resolución de nombres imposible o asignación IP nula. Los navegadores no pueden abrir URLs.',
          diagnosticDetails:
            'DNSAPI: WSAHOST_NOT_FOUND (11001). Pila Winsock no puede resolver consultas FQDN.'
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
          message:
            'TEST DE BÚSQUEDA DEGRADADO: Indexer detenido. Las búsquedas en el Menú Inicio recurren a búsqueda secuencial en disco.',
          diagnosticDetails:
            'Search.Indexer COM interface unattached. Latencia de búsqueda: +4200ms.'
        });
      } else {
        setActiveTestResult({
          type: 'search',
          passed: true,
          message: 'TEST DE BÚSQUEDA SUPERADO: Índice de archivos activo con respuesta en <15ms.',
          diagnosticDetails: 'Windows Search Catalog validado.'
        });
      }
    } else if (currentTest === 'security') {
      const isDefenderRunning =
        servicesState.find((s) => s.id === 'svc-windefend')?.state === 'RUNNING';
      const isBfeRunning =
        servicesState.find((s) => s.id === 'svc-bfe')?.state === 'RUNNING';

      if (!isDefenderRunning || !isBfeRunning) {
        setActiveTestResult({
          type: 'security',
          passed: false,
          message:
            'FALLO EN PROTECCIÓN DE SEGURIDAD: El motor de firmas en tiempo real o el Firewall WFP están desactivados. El sistema está expuesto.',
          diagnosticDetails:
            'WSC Status: WSC_SECURITY_PROVIDER_HEALTH_POOR. Alertas rojas en Centro de Seguridad.'
        });
      } else {
        setActiveTestResult({
          type: 'security',
          passed: true,
          message:
            'TEST DE SEGURIDAD SUPERADO: Motores de protección heurística y filtrado de red activos y vigilando.',
          diagnosticDetails: 'WSC Status: WSC_SECURITY_PROVIDER_HEALTH_GOOD (Firmas actualizadas).'
        });
      }
    } else if (currentTest === 'print') {
      const isSpoolerRunning =
        servicesState.find((s) => s.id === 'svc-spooler')?.state === 'RUNNING';

      if (!isSpoolerRunning) {
        setActiveTestResult({
          type: 'print',
          passed: false,
          message:
            'FALLO EN COLA DE IMPRESIÓN: El servicio Spooler está detenido. No se pueden generar documentos PDF ni imprimir.',
          diagnosticDetails:
            'Win32 Error: 1722 (RPC Server is unavailable) al llamar a OpenPrinterW().'
        });
      } else {
        setActiveTestResult({
          type: 'print',
          passed: true,
          message:
            'TEST DE IMPRESIÓN SUPERADO: Subproceso spoolsv.exe listo para aceptar colas de trabajos.',
          diagnosticDetails: 'Printer Driver Host listo.'
        });
      }
    } else if (currentTest === 'update') {
      const isUpdateRunning =
        servicesState.find((s) => s.id === 'svc-wuauserv')?.state === 'RUNNING';

      if (!isUpdateRunning) {
        setActiveTestResult({
          type: 'update',
          passed: false,
          message:
            'TEST DE ACTUALIZACIONES DETENIDO: Windows Update no puede comprobar firmas ni descargar parches de seguridad.',
          diagnosticDetails: 'WU Error: 0x8024D00E (WU_E_SETUP_REBOOTREQUIRED / Service Inactive).'
        });
      } else {
        setActiveTestResult({
          type: 'update',
          passed: true,
          message:
            'TEST DE ACTUALIZACIONES OK: Cliente de Windows Update listo para negociar catálogos seguros.',
          diagnosticDetails: 'WUA API operativa.'
        });
      }
    } else if (currentTest === 'hardware') {
      const isPlugPlayRunning =
        servicesState.find((s) => s.id === 'svc-plugplay')?.state === 'RUNNING';
      if (!isPlugPlayRunning || !isTargetRunning) {
        setActiveTestResult({
          type: 'hardware',
          passed: false,
          message: `DEGRADACIÓN EN ENUMERACIÓN DE HARDWARE: ${selectedService.serviceName} o Plug and Play están inactivos. ${selectedService.telemetryImpact.lostFunctionality}`,
          diagnosticDetails:
            'SetupAPI Error: 0xE000020B (ERROR_NO_SUCH_DEVINST). PnP Manager no puede resolver enumeradores de bus.'
        });
      } else {
        setActiveTestResult({
          type: 'hardware',
          passed: true,
          message: `TEST DE HARDWARE SUPERADO: ${selectedService.displayName} responde a peticiones de enumeración de dispositivos.`,
          diagnosticDetails:
            'SetupAPI S_OK: Controladores y dispositivos sincronizados en el árbol de hardware.'
        });
      }
    } else if (currentTest === 'ui') {
      const isThemesRunning =
        servicesState.find((s) => s.id === 'svc-themes')?.state === 'RUNNING';
      const isFontRunning =
        servicesState.find((s) => s.id === 'svc-fontcache')?.state === 'RUNNING';
      if (!isThemesRunning || !isFontRunning || !isTargetRunning) {
        setActiveTestResult({
          type: 'ui',
          passed: false,
          message: `ANOMALÍA EN EXPERIENCIA VISUAL: ${selectedService.serviceName} está detenido. ${selectedService.telemetryImpact.lostFunctionality}`,
          diagnosticDetails:
            'DWM/Shell Warning: Latencia de renderizado tipográfico o composición visual degradada.'
        });
      } else {
        setActiveTestResult({
          type: 'ui',
          passed: true,
          message:
            'TEST DE INTERFAZ SUPERADO: Estilos visuales, caché de glifos y composición de Windows 11 operando fluidamente.',
          diagnosticDetails: 'UX Subsystem S_OK: DWM y subsistema de ventanas sincronizados.'
        });
      }
    } else if (currentTest === 'optional') {
      if (!isTargetRunning) {
        setActiveTestResult({
          type: 'optional',
          passed: false,
          message: `SERVICIO OPCIONAL/USUARIO DETENIDO: ${selectedService.serviceName} inactivo. ${selectedService.telemetryImpact.lostFunctionality}`,
          diagnosticDetails: `SCM Status: SERVICE_STOPPED. Efecto: ${selectedService.telemetryImpact.potentialSideEffect}`
        });
      } else {
        setActiveTestResult({
          type: 'optional',
          passed: true,
          message: `SERVICIO OPCIONAL ACTIVO: ${selectedService.displayName} inicializado y atendiendo solicitudes.`,
          diagnosticDetails: `SCM Status: SERVICE_RUNNING (PID: ${selectedService.pid || 1024}).`
        });
      }
    } else {
      if (!isTargetRunning) {
        setActiveTestResult({
          type: 'system',
          passed: false,
          message: `FALLO EN SUBSISTEMA: El servicio ${selectedService.serviceName} está detenido. ${selectedService.telemetryImpact.lostFunctionality}`,
          diagnosticDetails: `SCM State: SERVICE_STOPPED. Consecuencia: ${selectedService.telemetryImpact.potentialSideEffect}`
        });
      } else {
        setActiveTestResult({
          type: 'system',
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

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server':
        return <Server className="w-3.5 h-3.5" />;
      case 'Shield':
        return <Shield className="w-3.5 h-3.5" />;
      case 'Wifi':
        return <Wifi className="w-3.5 h-3.5" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'Volume2':
        return <Volume2 className="w-3.5 h-3.5" />;
      case 'Layers':
        return <Layers className="w-3.5 h-3.5" />;
      case 'Clock':
        return <Clock className="w-3.5 h-3.5" />;
      case 'Activity':
        return <Activity className="w-3.5 h-3.5" />;
      case 'Sliders':
        return <Sliders className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={`space-y-5 font-mono-tech select-none ${className}`}>
      {/* Top Banner & Dual Engine Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
              TELEMETRÍA SCM // SERVICIOS & DEPENDENCIAS WINDOWS 11
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
            {totalStoppedCount > 0 && engineMode === 'SIMULATED' && (
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold animate-pulse">
                {totalStoppedCount} SERVICIOS DETENIDOS
              </span>
            )}
          </div>
          <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
            Laboratorio de Telemetría de Servicios de Windows 11
          </h2>
        </div>

        {/* Engine Mode Switcher & Global Restore Button */}
        <div className="flex flex-wrap items-center gap-2">
          {engineMode === 'SIMULATED' && totalStoppedCount > 0 && (
            <button
              type="button"
              onClick={handleRestoreAllSimulation}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Restaurar toda la simulación al estado inicial"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>RESTAURAR TODOS ({totalStoppedCount})</span>
            </button>
          )}

          <div className="flex items-center p-1 bg-black/60 rounded-xl border border-cyan-950 text-xs">
            <button
              type="button"
              onClick={() => {
                setEngineMode('SIMULATED');
                setTelemetryDelta(null);
              }}
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
              onClick={async () => {
                setEngineMode('REAL_PC');
                setTelemetryDelta(null);
                await checkAgentConnection();
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                engineMode === 'REAL_PC'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              REAL PC {isRealAgentActive ? '(CONECTADO)' : '(DESCONECTADO)'}
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
              <strong>CATÁLOGO TÉCNICO OFICIAL WINDOWS 11:</strong> Explorá los servicios organizados por dominios operativos. Podés simular su detención y observar cómo responde el Service Control Manager (SCM).
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold hidden sm:inline">
            ZERO-RISK LAB
          </span>
        </div>
      ) : isRealAgentActive ? (
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>CONECTADO A PC REAL // EVO LOCAL AGENT:</strong> Telemetría capturada en vivo (SYSTEM_REPORTED) mediante consultas WMI/CIM reales.
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">
            SYSTEM_REPORTED
          </span>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-rose-950/30 border-2 border-rose-500/50 space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-500/20 text-rose-300 font-bold text-xs uppercase border border-rose-500/40">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>REAL PC // NO DISPONIBLE</span>
          </div>
          <h3 className="font-display font-black text-lg text-white">EVO AGENT NO CONECTADO</h3>
          <p className="text-xs text-zinc-300 font-sans-editorial max-w-xl mx-auto leading-relaxed">
            El modo REAL PC requiere que <strong>EVO Local Agent</strong> esté ejecutándose localmente en <code>http://127.0.0.1:43921</code>.
            Por regla de veracidad, EVO jamás muestra datos inventados o simulados dentro de la vista REAL PC.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={checkAgentConnection}
              disabled={isCheckingAgent}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md flex items-center gap-2"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isCheckingAgent ? 'animate-spin' : ''}`} />
              <span>{isCheckingAgent ? 'VERIFICANDO...' : 'REINTENTAR CONEXIÓN CON EVO AGENT'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Real PC Actions */}
      {pendingRealAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0b0e14] border-2 border-amber-500/80 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-sm uppercase">
                  CONFIRMACIÓN DE EXPERIMENTO EN PC REAL
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPendingRealAction(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-bold uppercase">SERVICIO:</span>
                  <span className="text-white font-mono font-bold text-sm">
                    {pendingRealAction.serviceName} ({pendingRealAction.displayName})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-bold uppercase">ACCIÓN SOLICITADA:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-black uppercase text-[10px]">
                    {pendingRealAction.action}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-bold uppercase">RIESGO RATED:</span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold text-[10px]">
                    {pendingRealAction.risk}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 font-sans-editorial text-zinc-300">
                <p>
                  <strong className="text-cyan-400 font-mono">DEPENDENCIAS CONOCIDAS: </strong>
                  {pendingRealAction.dependencies.join(', ')}
                </p>
                <p>
                  <strong className="text-amber-400 font-mono">QUÉ PODRÍA DEJAR DE FUNCIONAR: </strong>
                  {pendingRealAction.lostFunctionality}
                </p>
                <p>
                  <strong className="text-emerald-400 font-mono">PLAN DE ROLLBACK: </strong>
                  Restablecer servicio con acción inversa ({pendingRealAction.action === 'STOP' ? 'START' : 'STOP'}) sin modificar StartupType.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setPendingRealAction(null)}
                disabled={isExecutingRealAction}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
              >
                CANCELAR
              </button>

              <button
                type="button"
                onClick={handleConfirmRealAction}
                disabled={isExecutingRealAction}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md flex items-center gap-2"
              >
                {isExecutingRealAction ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>EJECUTANDO EN PC REAL...</span>
                  </>
                ) : (
                  <span>CONFIRMAR Y EJECUTAR</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PESTAÑAS DE CATEGORÍAS (9 DOMINIOS OPERATIVOS)
      ======================================================== */}
      {engineMode === 'SIMULATED' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>DOMINIOS DE WINDOWS 11 (9 CATEGORÍAS TÉCNICAS)</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              TOTAL: {servicesState.length} SERVICIOS CATALOGADOS
            </span>
          </div>

          {/* Horizontal scrollable category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeCategory === 'ALL'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>TODOS</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                activeCategory === 'ALL' ? 'bg-black text-cyan-400' : 'bg-black/50 text-zinc-400'
              }`}>
                {servicesState.length}
              </span>
            </button>

            {WINDOWS_SERVICE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const stats = categoryStats[cat.id] || { total: 0, stopped: 0 };
              const hasStopped = stats.stopped > 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                      : hasStopped
                      ? 'bg-rose-950/40 text-rose-300 border border-rose-500/50 hover:bg-rose-900/40'
                      : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                    isActive
                      ? 'bg-black text-amber-300'
                      : hasStopped
                      ? 'bg-rose-900 text-white'
                      : 'bg-black/50 text-zinc-400'
                  }`}>
                    {hasStopped ? `! ${stats.stopped}/${stats.total}` : stats.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          BARRA DE BÚSQUEDA Y FILTROS AVANZADOS
      ======================================================== */}
      <div className="p-3.5 rounded-2xl bg-[#0b0e14] border border-cyan-950/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre real o interno (ej. RpcSs, BFE, Defender, SysMain, Spooler)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/60 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters in Simulated Mode */}
          {engineMode === 'SIMULATED' && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Kind Filter */}
              <select
                value={filterKind}
                onChange={(e) => setFilterKind(e.target.value as any)}
                className="px-2.5 py-2 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-bold text-zinc-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="ALL">TIPO: TODOS</option>
                <option value="NATIVO">NATIVOS</option>
                <option value="OPCIONAL">OPCIONALES</option>
                <option value="POR_USUARIO">POR USUARIO</option>
                <option value="TERCEROS">TERCEROS (NO NATIVOS)</option>
              </select>

              {/* State Filter */}
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value as any)}
                className="px-2.5 py-2 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-bold text-zinc-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="ALL">ESTADO: TODOS</option>
                <option value="RUNNING">EN EJECUCIÓN (RUNNING)</option>
                <option value="STOPPED">DETENIDOS (STOPPED)</option>
              </select>

              {/* Risk Filter */}
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as any)}
                className="px-2.5 py-2 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-bold text-zinc-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="ALL">RIESGO: TODOS</option>
                <option value="CRÍTICO">RIESGO: CRÍTICO</option>
                <option value="ALTO">RIESGO: ALTO</option>
                <option value="MEDIO">RIESGO: MEDIO</option>
                <option value="BAJO">RIESGO: BAJO</option>
              </select>
            </div>
          )}
        </div>

        {/* Filters summary bar */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-900">
          <span>
            MOSTRANDO <strong>{filteredServices.length}</strong> SERVICIOS FILTRADOS
            {activeCategory !== 'ALL' && (
              <span className="text-cyan-400 ml-1.5 font-bold">
                EN "{WINDOWS_SERVICE_CATEGORIES.find((c) => c.id === activeCategory)?.name}"
              </span>
            )}
          </span>

          {(searchQuery || filterKind !== 'ALL' || filterState !== 'ALL' || filterRisk !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterKind('ALL');
                setFilterState('ALL');
                setFilterRisk('ALL');
              }}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
            >
              LIMPIAR FILTROS
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          MASTER 2-COLUMN VIEW (SERVICES LIST & DEPENDENCY GRAPH)
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: SERVICES LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-950 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  CONSOLA DE SERVICIOS ({engineMode === 'REAL_PC' ? 'REAL PC' : 'SERVICES.MSC'})
                </span>
              </span>
              <span className="text-zinc-500 text-[10.5px]">
                {filteredServices.length} DISPONIBLES
              </span>
            </div>

            {/* Services Table List */}
            {engineMode === 'SIMULATED' ? (
              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1 text-xs">
                {filteredServices.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500 text-xs space-y-2">
                    <p>No se encontraron servicios con los filtros actuales.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('ALL');
                        setFilterKind('ALL');
                        setFilterState('ALL');
                        setFilterRisk('ALL');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-[10.5px] hover:text-white"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                ) : (
                  filteredServices.map((svc) => {
                    const isSelected = svc.id === selectedServiceId;
                    const isRunning = svc.state === 'RUNNING';

                    return (
                      <div
                        key={svc.id}
                        onClick={() => setSelectedServiceId(svc.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50'
                            : isRunning
                            ? 'bg-black/50 border-zinc-900 text-zinc-400 hover:border-zinc-700'
                            : 'bg-rose-950/20 border-rose-900/60 text-zinc-300 hover:border-rose-700'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-white text-xs sm:text-sm font-mono">
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
                            {svc.serviceKind && (
                              <span className={`text-[8.5px] font-bold px-1 rounded uppercase ${
                                svc.serviceKind === 'NATIVO'
                                  ? 'bg-zinc-800 text-zinc-300'
                                  : svc.serviceKind === 'POR_USUARIO'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : svc.serviceKind === 'TERCEROS'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-blue-950 text-blue-300 border border-blue-800'
                              }`}>
                                {svc.serviceKind}
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-zinc-400 font-sans-editorial block truncate">
                            {svc.displayName}
                          </span>
                        </div>

                        <div className="text-right font-mono text-[10px] shrink-0">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold block mb-0.5 ${
                            svc.functionalRisk === 'CRÍTICO'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : svc.functionalRisk === 'ALTO'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : svc.functionalRisk === 'MEDIO'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {svc.functionalRisk}
                          </span>
                          <span className="text-zinc-500 block">{svc.startupType}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : isRealAgentActive ? (
              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1 text-xs">
                {filteredServices.map((rSvc: any) => {
                  const isSelected = rSvc.name.toLowerCase() === selectedRealServiceName.toLowerCase();
                  const isRunning = rSvc.state.toLowerCase() === 'running';

                  return (
                    <div
                      key={rSvc.name}
                      onClick={() => setSelectedRealServiceName(rSvc.name)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400/50'
                          : 'bg-black/50 border-zinc-900 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm font-mono">
                            {rSvc.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              isRunning
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {rSvc.state.toUpperCase()}
                          </span>
                          {rSvc.experimentAllowed && (
                            <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[8.5px] font-black rounded uppercase">
                              ALLOWLIST
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-sans-editorial block truncate">
                          {rSvc.displayName}
                        </span>
                      </div>

                      <div className="text-right font-mono text-[10.5px] shrink-0">
                        <span className="text-zinc-400 block">{rSvc.startMode}</span>
                        <span className="text-emerald-400 text-[10px]">
                          {rSvc.workingSetMb} MB | PID: {rSvc.processId || 'N/A'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-zinc-500 text-xs">
                REAL PC NO DISPONIBLE — EVO Agent no conectado.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TECHNICAL DOSSIER, DEPENDENCY GRAPH & TELEMETRY (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Selected Service Detailed Dossier (FICHA TÉCNICA EXHAUSTIVA) */}
          {engineMode === 'SIMULATED' ? (
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-cyan-950 space-y-4 shadow-xl">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-cyan-950 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                      FICHA TÉCNICA OFICIAL // WINDOWS 11 SCM
                    </span>
                    {selectedService.serviceKind && (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        selectedService.serviceKind === 'NATIVO'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : selectedService.serviceKind === 'POR_USUARIO'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : selectedService.serviceKind === 'TERCEROS'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        {selectedService.serviceKind === 'TERCEROS' ? 'TERCEROS (NO NATIVO)' : selectedService.serviceKind}
                      </span>
                    )}
                    {selectedService.windows11Scope && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {selectedService.windows11Scope.editions && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-900 text-[9px] font-mono" title="Ediciones de Windows 11 compatibles">
                            EDICIONES: {selectedService.windows11Scope.editions.join(', ')}
                          </span>
                        )}
                        {selectedService.windows11Scope.versions && (
                          <span className="px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[9px] font-mono" title="Versiones de Windows 11 compatibles">
                            VER: {selectedService.windows11Scope.versions.join(', ')}
                          </span>
                        )}
                        {selectedService.windows11Scope.requiredFeature && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-300/90 border border-amber-900/60 text-[9px] font-mono" title="Característica o subsistema requerido">
                            {selectedService.windows11Scope.requiredFeature}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-black text-xl text-white">
                    {selectedService.displayName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-cyan-400 font-bold">
                      service_name: <code className="bg-black/60 px-1.5 py-0.5 rounded border border-cyan-900">{selectedService.serviceName}</code>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">PID: {selectedService.pid || 'svchost'}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">Cuenta: {selectedService.account}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                      selectedService.functionalRisk === 'CRÍTICO'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : selectedService.functionalRisk === 'ALTO'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : selectedService.functionalRisk === 'MEDIO'
                        ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    RIESGO: {selectedService.functionalRisk}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedService.state === 'RUNNING'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    ESTADO: {selectedService.state}
                  </span>
                </div>
              </div>

              {/* Critical Warning Banner if CRÍTICO or ALTO */}
              {(selectedService.functionalRisk === 'CRÍTICO' || selectedService.functionalRisk === 'ALTO') && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>DIRECTIVA DE ESTABILIDAD: NO SE RECOMIENDA DESHABILITAR</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed pl-6">
                    {selectedService.criticalRecommendation ||
                      'Este servicio es un pilar arquitectónico de Windows 11. Deshabilitarlo provocará inestabilidad en cadena o fallos irreversibles en el Service Control Manager.'}
                  </p>
                </div>
              )}

              {/* Función y Rol en el Subsistema */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-900 space-y-1.5">
                  <div className="text-zinc-400 font-bold uppercase text-[10.5px]">FUNCIÓN Y ARQUITECTURA TÉCNICA:</div>
                  <p className="text-zinc-200 font-sans-editorial leading-relaxed">
                    {selectedService.subsystemRole}
                  </p>
                  <p className="text-cyan-300 font-sans-editorial leading-relaxed pt-1 border-t border-zinc-900/60">
                    <strong className="text-cyan-400 font-mono">En palabras sencillas: </strong>
                    {selectedService.simpleExplanation}
                  </p>
                </div>

                {/* Grid con Parámetros SCM y Ejecutable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-lg bg-black/50 border border-zinc-900 space-y-0.5">
                    <span className="text-zinc-500 text-[10px] block">TIPO DE INICIO HABITUAL:</span>
                    <span className="text-white font-bold">{selectedService.startupType}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-zinc-900 space-y-0.5">
                    <span className="text-zinc-500 text-[10px] block">CONSUMO / IMPACTO BASE:</span>
                    <span className="text-emerald-400 font-bold">
                      ~{Math.abs(selectedService.telemetryImpact.ramDeltaMb)} MB RAM | {Math.abs(selectedService.telemetryImpact.cpuDeltaPercent)}% CPU
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-zinc-900 col-span-1 md:col-span-2 space-y-0.5">
                    <span className="text-zinc-500 text-[10px] block">RUTA DE EJECUTABLE BINARIO:</span>
                    <code className="text-zinc-300 text-[10px] break-all">{selectedService.binaryPath}</code>
                  </div>
                </div>

                {/* Dependencias y Dependientes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-900 space-y-1.5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block flex items-center gap-1">
                      <span>DEPENDENCIAS (UPSTREAM):</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedService.dependencies.length > 0 ? (
                        selectedService.dependencies.map((d, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-[10px]">
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-500 text-[10px]">Ninguna (Raíz del kernel NT)</span>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-900 space-y-1.5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                      DEPENDIENTES AFECTADOS (DOWNSTREAM):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedService.dependents.slice(0, 3).map((dep, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/80 text-amber-200 text-[10px]">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consecuencias si se detiene & Plan de Restauración */}
                <div className="p-3 rounded-xl bg-black/70 border border-zinc-900 space-y-2 text-xs font-sans-editorial">
                  <div>
                    <span className="text-amber-400 font-mono text-[10.5px] font-bold uppercase block">
                      ¿QUÉ OCURRE SI SE DETIENE O DESHABILITA?:
                    </span>
                    <p className="text-zinc-200 leading-snug">
                      {selectedService.telemetryImpact.lostFunctionality}
                    </p>
                  </div>

                  <div>
                    <span className="text-rose-400 font-mono text-[10.5px] font-bold uppercase block">
                      RIESGOS Y EFECTOS COLATERALES:
                    </span>
                    <p className="text-zinc-300 leading-snug">
                      {selectedService.telemetryImpact.potentialSideEffect}
                    </p>
                  </div>

                  {selectedService.restoration && (
                    <div className="pt-2 border-t border-zinc-800/80">
                      <span className="text-emerald-400 font-mono text-[10.5px] font-bold uppercase block">
                        POSIBILIDAD DE RESTAURACIÓN:
                      </span>
                      <p className="text-zinc-300 text-[11px] leading-snug mb-1">
                        {selectedService.restoration.canRestoreDirectly
                          ? '✅ Restaurable en caliente sin reiniciar el equipo.'
                          : '⚠️ Requiere reinicio o intervención en WinRE/Modo Seguro si el sistema queda inoperativo.'}
                      </p>
                      <div className="p-2 rounded bg-black border border-emerald-950 font-mono text-[10px] text-emerald-300 break-all">
                        {selectedService.restoration.rollbackCommand}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Stop / Disable / Rollback */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-cyan-950">
                {selectedService.state === 'RUNNING' ? (
                  <button
                    type="button"
                    onClick={() => handleSimulateStop(selectedService.id)}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>[ SIMULAR STOP ]</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRollbackService(selectedService.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>[ RESTABLECER SERVICIO ]</span>
                  </button>
                )}

                {/* Functional Test Trigger Button */}
                <button
                  type="button"
                  onClick={() => handleRunFunctionalTest(selectedService.functionalTestType)}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>PROBAR SUBSISTEMA ➔</span>
                </button>
              </div>
            </div>
          ) : isRealAgentActive && selectedRealService ? (
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-emerald-950 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                    EXPEDIENTE DE SERVICIO REAL // SYSTEM_REPORTED
                  </span>
                  <h3 className="font-bold text-base text-white">
                    {selectedRealService.name} ({selectedRealService.displayName})
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                    selectedRealService.experimentAllowed
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  ALLOWLIST: {selectedRealService.experimentAllowed ? 'PERMITIDO' : 'PROTEGIDO'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-black/60 border border-zinc-900">
                  <span className="text-zinc-500 text-[10px] block">ESTADO SO:</span>
                  <span className="text-white font-bold">{selectedRealService.state}</span>
                </div>

                <div className="p-2.5 rounded bg-black/60 border border-zinc-900">
                  <span className="text-zinc-500 text-[10px] block">TIPO INICIO:</span>
                  <span className="text-white font-bold">{selectedRealService.startMode}</span>
                </div>

                <div className="p-2.5 rounded bg-black/60 border border-zinc-900">
                  <span className="text-zinc-500 text-[10px] block">PID PROCESO:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedRealService.processId > 0 ? selectedRealService.processId : 'UNKNOWN'}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-black/60 border border-zinc-900">
                  <span className="text-zinc-500 text-[10px] block">RAM DE PROCESO:</span>
                  <span className="text-emerald-400 font-bold">{selectedRealService.workingSetMb} MB</span>
                </div>
              </div>

              {/* Action Buttons in Real PC Mode */}
              <div className="pt-2 border-t border-emerald-950 flex justify-between items-center">
                {selectedRealService.experimentAllowed ? (
                  selectedRealService.state.toLowerCase() === 'running' ? (
                    <button
                      type="button"
                      onClick={() => handleRequestRealAction(selectedRealService, 'STOP')}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>[ SOLICITAR STOP EN PC REAL ]</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestRealAction(selectedRealService, 'START')}
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>[ SOLICITAR START EN PC REAL ]</span>
                    </button>
                  )
                ) : (
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-[11px] font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>ACCIÓN REAL BLOQUEADA (SERVICIO FUERA DE ALLOWLIST DE EVO AGENT)</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Mini Simulated Monitor preview showing effect on screen */}
          <SimulatedMonitorScreen
            screenState="desktop"
            isAudioBroken={isAudioBroken}
            isNetworkBroken={isNetworkBroken}
            customOverlayText={
              isAudioBroken
                ? 'EFECTO DETECTADO: El icono de sonido muestra una X roja. Las llamadas a MMDeviceAPI fallan.'
                : isNetworkBroken
                ? 'EFECTO DETECTADO: El icono de red muestra "Sin Internet". Las consultas DNS no resuelven nombres.'
                : undefined
            }
          />

          {/* Interactive Dependency Graph Visual for Selected Service */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-950 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  GRAFO DE DEPENDENCIAS // {engineMode === 'REAL_PC' && selectedRealService ? selectedRealService.name : selectedService.serviceName}
                </span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${engineMode === 'REAL_PC' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'text-zinc-500'}`}>
                {engineMode === 'REAL_PC' ? 'REFERENCE // CATÁLOGO EVO' : 'SCM DEPENDENCY TREE'}
              </span>
            </div>

            {/* Dynamic Dependency Chain */}
            <div className="space-y-1.5 text-xs">
              {dependencyGraph.length > 0 ? (
                dependencyGraph.map((node, nIdx) => (
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
                ))
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center space-y-1 font-mono">
                  <span className="font-bold text-amber-400 text-xs uppercase block">REFERENCE NO DISPONIBLE</span>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial">
                    No existe catálogo pedagógico de referencia para el servicio {selectedRealService?.name || 'seleccionado'}.
                  </p>
                </div>
              )}
            </div>

            {/* Impact Consequence Matrix: Qué depende, Qué se apaga, Qué puede fallar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-cyan-950 text-[11px] font-sans-editorial">
              <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-cyan-300 uppercase block">
                    1. QUÉ DEPENDE DE ÉL:
                  </span>
                  {engineMode === 'REAL_PC' && (
                    <span className="text-[8px] font-mono font-bold text-amber-400 bg-amber-950 px-1 rounded border border-amber-800">
                      REFERENCE
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 leading-snug">
                  {engineMode === 'REAL_PC'
                    ? referenceService
                      ? referenceService.dependents.length > 0
                        ? referenceService.dependents.join(', ')
                        : 'Pila base de usuario'
                      : 'REFERENCE NO DISPONIBLE'
                    : selectedService.dependents.length > 0
                    ? selectedService.dependents.join(', ')
                    : 'Pila base de usuario'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-amber-950/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-amber-300 uppercase block">
                    2. QUÉ SE APAGA:
                  </span>
                  {engineMode === 'REAL_PC' && (
                    <span className="text-[8px] font-mono font-bold text-amber-400 bg-amber-950 px-1 rounded border border-amber-800">
                      REFERENCE
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 leading-snug">
                  {engineMode === 'REAL_PC'
                    ? referenceService
                      ? referenceService.telemetryImpact.lostFunctionality
                      : 'REFERENCE NO DISPONIBLE'
                    : selectedService.telemetryImpact.lostFunctionality}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-rose-950/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-rose-300 uppercase block">
                    3. QUÉ PUEDE FALLAR:
                  </span>
                  {engineMode === 'REAL_PC' && (
                    <span className="text-[8px] font-mono font-bold text-amber-400 bg-amber-950 px-1 rounded border border-amber-800">
                      REFERENCE
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 leading-snug">
                  {engineMode === 'REAL_PC'
                    ? referenceService
                      ? referenceService.telemetryImpact.potentialSideEffect
                      : 'REFERENCE NO DISPONIBLE'
                    : selectedService.telemetryImpact.potentialSideEffect}
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
              {activeTestResult.diagnosticDetails && (
                <div className="text-[10px] font-mono text-zinc-400 bg-black/60 p-2 rounded border border-zinc-800">
                  {activeTestResult.diagnosticDetails}
                </div>
              )}
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
                  <div className="text-white font-bold">
                    {telemetryDelta.before.ramUsedMb >= 0 ? `${telemetryDelta.before.ramUsedMb} MB` : 'UNKNOWN'}
                  </div>
                  <div className="text-[9.5px] text-zinc-500">RAM PROCESO</div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block uppercase">DESPUÉS</span>
                  <div className="text-cyan-300 font-bold">
                    {telemetryDelta.after.ramUsedMb >= 0 ? `${telemetryDelta.after.ramUsedMb} MB` : 'UNKNOWN'}
                  </div>
                  <div className="text-[9.5px] text-zinc-500">RAM PROCESO</div>
                </div>

                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-400">
                  <span className="text-[10px] text-cyan-400 block uppercase font-bold">DELTA</span>
                  <div className="text-emerald-400 font-bold">{telemetryDelta.delta.ramMb} MB</div>
                  <div className="text-[9.5px] text-cyan-300">DIFERENCIA</div>
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
                        : telemetryDelta.scientificConclusion === 'NO HAY DATOS SUFICIENTES (INCONCLUSO)'
                        ? 'bg-amber-500 text-black'
                        : 'bg-cyan-400 text-black'
                    }`}
                  >
                    {telemetryDelta.scientificConclusion}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (engineMode === 'SIMULATED') {
                        handleRollbackService(selectedService.id);
                      } else {
                        handleRollbackRealService(telemetryDelta.serviceName);
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-bold cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>REVERTIR AL ESTADO INICIAL</span>
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
