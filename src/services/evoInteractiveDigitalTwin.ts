// ============================================================================
// EVO LABS // INTERACTIVE DIGITAL TWIN ENGINE (FASE 04)
// Causal state model connecting 12 hardware & software systems with
// conceptual zoom levels, 4 operating modes, and educational evidence feedback.
// ============================================================================

export type ZoomLevel = 'PC_GLOBAL' | 'MOTHERBOARD' | 'FIRMWARE_KERNEL' | 'OS_SERVICES';

export type OperatingMode = 'OBSERVAR' | 'INTERVENIR' | 'FALLAR' | 'RECUPERAR';

export type SystemHealthState = 'OPERATIVO' | 'DEGRADADO' | 'ANOMALÍA' | 'FALLO_CRÍTICO';

export interface SystemNodeState {
  id: string;
  name: string;
  category: 'HARDWARE' | 'FIRMWARE' | 'KERNEL' | 'SOFTWARE';
  health: SystemHealthState;
  statusLabel: string;
  primaryMetric: string;
  details: string;
  dependencies: string[]; // IDs of nodes this system depends on
  dependents: string[]; // IDs of nodes that depend on this system
}

export interface CausalInterventionLog {
  id: string;
  timestamp: string;
  actionTitle: string;
  whatChanged: string;
  whatDependedOnIt: string;
  evidenceGenerated: string;
  affectedNodeIds: string[];
}

export interface DigitalTwinState {
  zoomLevel: ZoomLevel;
  mode: OperatingMode;
  isSimulatedFlag: boolean; // Always true ("SIMULACIÓN EDUCATIVA")
  postStateIndex: number; // 0 to 35 POST sequence steps
  nodes: Record<string, SystemNodeState>;
  history: CausalInterventionLog[];
  overallSystemHealth: SystemHealthState;
  activeAnomalyDescription?: string;
}

export class EvoInteractiveDigitalTwin {
  /**
   * Initializes the 12-system Causal Digital Twin in healthy baseline state.
   */
  public static createInitialState(): DigitalTwinState {
    return {
      zoomLevel: 'PC_GLOBAL',
      mode: 'OBSERVAR',
      isSimulatedFlag: true,
      postStateIndex: 35, // Fully booted by default
      overallSystemHealth: 'OPERATIVO',
      history: [
        {
          id: 'init-0',
          timestamp: new Date().toLocaleTimeString(),
          actionTitle: 'INICIALIZACIÓN DE GEMELO DIGITAL',
          whatChanged: 'Se cargó la configuración base de hardware y software del sistema.',
          whatDependedOnIt: 'Todos los 12 subsistemas en estado nominal.',
          evidenceGenerated: 'SIMULACIÓN EDUCATIVA: Estado 100% verificado en Ring 0 / UEFI.',
          affectedNodeIds: ['cpu', 'ram', 'gpu', 'storage', 'motherboard', 'psu', 'bios', 'boot', 'windows', 'drivers', 'services', 'network'],
        },
      ],
      nodes: {
        cpu: {
          id: 'cpu',
          name: 'CPU (Procesador)',
          category: 'HARDWARE',
          health: 'OPERATIVO',
          statusLabel: 'AMD Ryzen 5 5600X @ 3.7 GHz',
          primaryMetric: 'Temperatura: 38 °C | Carga: 12%',
          details: '6 Núcleos / 12 Hilos en Ring 0. Raíl VCORE nominal 1.20V.',
          dependencies: ['motherboard', 'psu'],
          dependents: ['bios', 'boot', 'windows'],
        },
        ram: {
          id: 'ram',
          name: 'RAM (Memoria Principal)',
          category: 'HARDWARE',
          health: 'OPERATIVO',
          statusLabel: '16 GB DDR4 3200 MHz (Dual Channel)',
          primaryMetric: 'Uso: 4.2 GB / 16 GB (Presión: Baja)',
          details: 'Módulos A2 y B2 activos. Tiempos CL16 sin errores WHEA.',
          dependencies: ['motherboard', 'psu'],
          dependents: ['boot', 'windows'],
        },
        gpu: {
          id: 'gpu',
          name: 'GPU (Tarjeta Gráfica)',
          category: 'HARDWARE',
          health: 'OPERATIVO',
          statusLabel: 'NVIDIA RTX 3060 12GB (PCIe 4.0 x16)',
          primaryMetric: '1920x1080 @ 144Hz | VRAM: 1.8 GB / 12 GB',
          details: 'Aceleración hardware D3D12 activa. Temperatura: 42 °C.',
          dependencies: ['motherboard', 'psu', 'drivers'],
          dependents: ['windows'],
        },
        storage: {
          id: 'storage',
          name: 'STORAGE (SSD NVMe M.2)',
          category: 'HARDWARE',
          health: 'OPERATIVO',
          statusLabel: 'NVMe SSD 512GB (Partición EFI FAT32 + C: NTFS)',
          primaryMetric: 'Salud SMART: 98% | Lectura: 3200 MB/s',
          details: 'Almacén BCD presente en \\EFI\\Microsoft\\Boot\\BCD.',
          dependencies: ['motherboard', 'psu'],
          dependents: ['boot', 'windows'],
        },
        motherboard: {
          id: 'motherboard',
          name: 'MOTHERBOARD (Placa Base B550)',
          category: 'HARDWARE',
          health: 'OPERATIVO',
          statusLabel: 'Chipset B550 Pro (Bus PCIe 4.0)',
          primaryMetric: 'Reloj de Bus: 100 MHz | Temp VRM: 45 °C',
          details: 'Conectores ATX 24p y EPS 8p alimentados correctamente.',
          dependencies: ['psu'],
          dependents: ['cpu', 'ram', 'gpu', 'storage', 'bios'],
        },
        psu: {
          id: 'psu',
          name: 'PSU (Fuente de Alimentación)',
          category: 'HARDWARE',
          health: 'OPERATIVO',
          statusLabel: 'Fuente 650W 80+ Gold',
          primaryMetric: 'Raíl +12V: 12.08V | Raíl +5V: 5.02V',
          details: 'Suministro eléctrico nominal sin sobrecargas.',
          dependencies: [],
          dependents: ['motherboard', 'cpu', 'gpu', 'storage'],
        },
        bios: {
          id: 'bios',
          name: 'BIOS / UEFI FIRMWARE',
          category: 'FIRMWARE',
          health: 'OPERATIVO',
          statusLabel: 'UEFI Mode (Secure Boot: Active, CSM: Off)',
          primaryMetric: 'Orden de Arranque: Windows Boot Manager',
          details: 'Tabla SMBIOS montada. Inicialización POST completa.',
          dependencies: ['motherboard', 'cpu', 'ram'],
          dependents: ['boot'],
        },
        boot: {
          id: 'boot',
          name: 'BOOT PIPELINE (POST & BCD)',
          category: 'FIRMWARE',
          health: 'OPERATIVO',
          statusLabel: 'Estado 35/35: Transición a Windows Kernel NT',
          primaryMetric: 'Latencia POST: 4.8s | BCD Status: OK',
          details: 'Cargador winload.efi ejecutado correctamente.',
          dependencies: ['bios', 'storage'],
          dependents: ['windows'],
        },
        windows: {
          id: 'windows',
          name: 'WINDOWS NT KERNEL',
          category: 'KERNEL',
          health: 'OPERATIVO',
          statusLabel: 'Windows 11 Pro 22H2 (Ring 0 / Ring 3 Active)',
          primaryMetric: 'Latencia DPC: 120 µs | Threads: 1840',
          details: 'Explorador de Windows y Subsystema Win32 operativos.',
          dependencies: ['boot', 'cpu', 'ram', 'storage'],
          dependents: ['drivers', 'services'],
        },
        drivers: {
          id: 'drivers',
          name: 'DRIVERS (Controladores de Sistema)',
          category: 'KERNEL',
          health: 'OPERATIVO',
          statusLabel: 'Controladores WDDM 3.1 & NVMe stornvme.sys',
          primaryMetric: 'Firmas Digitales: 100% Válidas',
          details: 'Sin conflictos en el Administrador de Dispositivos.',
          dependencies: ['windows'],
          dependents: ['gpu', 'network'],
        },
        services: {
          id: 'services',
          name: 'SERVICES (Servicios de Sistema NT)',
          category: 'SOFTWARE',
          health: 'OPERATIVO',
          statusLabel: 'NCSI, Spooler, AudioSrv, WMI Activos',
          primaryMetric: 'Servicios en ejecución: 142',
          details: 'Todos los servicios críticos en estado Running.',
          dependencies: ['windows'],
          dependents: ['network'],
        },
        network: {
          id: 'network',
          name: 'NETWORK (Interfaz de Red & Sockets)',
          category: 'SOFTWARE',
          health: 'OPERATIVO',
          statusLabel: 'Ethernet Gigabit (Get-NetAdapter: Active)',
          primaryMetric: 'Estado NCSI: Conectado a Internet (Ping: 12ms)',
          details: 'Conexión por cable con dirección IP asignada por DHCP.',
          dependencies: ['services', 'drivers'],
          dependents: [],
        },
      },
    };
  }

  /**
   * Evaluates causal propagation whenever a node parameter is altered.
   */
  public static evaluateCausalChain(
    currentState: DigitalTwinState,
    action: {
      actionTitle: string;
      targetNodeId: string;
      newHealth: SystemHealthState;
      customMetric?: string;
      customDetails?: string;
      explanationWhatChanged: string;
    }
  ): DigitalTwinState {
    const updatedNodes = { ...currentState.nodes };
    const targetNode = updatedNodes[action.targetNodeId];
    if (!targetNode) return currentState;

    // Apply primary change
    updatedNodes[action.targetNodeId] = {
      ...targetNode,
      health: action.newHealth,
      primaryMetric: action.customMetric || targetNode.primaryMetric,
      details: action.customDetails || targetNode.details,
    };

    let whatDependedOnIt = '';
    let evidenceGenerated = '';
    const affectedNodeIds: string[] = [action.targetNodeId];

    // Causal Propagation Rules
    if (action.targetNodeId === 'storage' && action.newHealth === 'FALLO_CRÍTICO') {
      // Unplugged or corrupted storage -> Boot fails, Windows in WinRE
      updatedNodes['boot'] = {
        ...updatedNodes['boot'],
        health: 'FALLO_CRÍTICO',
        statusLabel: 'ERROR DE ARRANQUE: No Boot Device / BCD Corrupto',
        primaryMetric: 'Estado 18/35: Fallo al abrir BCD Store',
        details: 'El cargador winload.efi no encuentra el almacén de configuración en la partición EFI.',
      };
      updatedNodes['windows'] = {
        ...updatedNodes['windows'],
        health: 'FALLO_CRÍTICO',
        statusLabel: 'Windows Entorno de Recuperación (WinRE)',
        primaryMetric: 'SrtTrail.txt registrado',
        details: 'El Kernel NT no pudo montarse y redirigió a la consola de recuperación.',
      };
      whatDependedOnIt = 'La secuencia de BOOT y el montaje del Kernel de WINDOWS dependen directamente de STORAGE.';
      evidenceGenerated = 'SrtTrail.txt indica "Boot configuration file (BCD) contains invalid entries or store is missing".';
      affectedNodeIds.push('boot', 'windows');
    } else if (action.targetNodeId === 'drivers' && action.newHealth === 'ANOMALÍA') {
      // Driver GPU replaced with basic display adapter -> GPU degraded
      updatedNodes['gpu'] = {
        ...updatedNodes['gpu'],
        health: 'DEGRADADO',
        statusLabel: 'Adaptador de Pantalla Básico de Microsoft',
        primaryMetric: '800x600 @ 60Hz | Sin Aceleración D3D12',
        details: 'Controlador genérico sin soporte para sombreadores avanzados ni VRAM dedicada.',
      };
      whatDependedOnIt = 'La GPU depende del controlador firmado WDDM para activar la aceleración gráfica.';
      evidenceGenerated = 'Administrador de Dispositivos muestra signo de advertencia amarillo en el controlador gráfico.';
      affectedNodeIds.push('gpu');
    } else if (action.targetNodeId === 'services' && action.newHealth === 'DEGRADADO') {
      // NCSI service stopped -> Network limited
      updatedNodes['network'] = {
        ...updatedNodes['network'],
        health: 'ANOMALÍA',
        statusLabel: 'Conectividad Limitada / Sin Internet',
        primaryMetric: 'Estado NCSI: Disconnected',
        details: 'El servicio Indicador de Estado de Conectividad de Red está detenido.',
      };
      whatDependedOnIt = 'El subsistema de NETWORK requiere del servicio NCSI para diagnosticar el enlace a Internet.';
      evidenceGenerated = 'Icono de barra de tareas muestra planeta con símbolo de advertencia "Sin acceso a Internet".';
      affectedNodeIds.push('network');
    } else if (action.targetNodeId === 'ram' && action.newHealth === 'ANOMALÍA') {
      // Single channel / RAM removed -> High memory pressure
      updatedNodes['ram'] = {
        ...updatedNodes['ram'],
        health: 'ANOMALÍA',
        statusLabel: '8 GB DDR4 (Single Channel)',
        primaryMetric: 'Uso: 7.6 GB / 8 GB (Presión: ALTA - Paging Activo)',
        details: 'Módulo B2 deshabilitado. Ancho de banda de memoria reducido al 50%.',
      };
      whatDependedOnIt = 'El Kernel NT y las aplicaciones dependen del ancho de banda y capacidad del bus de RAM.';
      evidenceGenerated = 'Monitor de Recursos registra escrituras constantes en C:\\pagefile.sys.';
      affectedNodeIds.push('ram');
    } else {
      whatDependedOnIt = `Los nodos [${targetNode.dependents.join(', ')}] reciben telemetría del subsistema ${targetNode.name}.`;
      evidenceGenerated = `SIMULACIÓN EDUCATIVA: Registro de cambio en estado de ${targetNode.name}.`;
    }

    // Determine overall system health
    const nodeValues = Object.values(updatedNodes);
    let overallHealth: SystemHealthState = 'OPERATIVO';
    if (nodeValues.some((n) => n.health === 'FALLO_CRÍTICO')) {
      overallHealth = 'FALLO_CRÍTICO';
    } else if (nodeValues.some((n) => n.health === 'ANOMALÍA')) {
      overallHealth = 'ANOMALÍA';
    } else if (nodeValues.some((n) => n.health === 'DEGRADADO')) {
      overallHealth = 'DEGRADADO';
    }

    const newLog: CausalInterventionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actionTitle: action.actionTitle,
      whatChanged: action.explanationWhatChanged,
      whatDependedOnIt,
      evidenceGenerated,
      affectedNodeIds,
    };

    return {
      ...currentState,
      nodes: updatedNodes,
      overallSystemHealth: overallHealth,
      history: [newLog, ...currentState.history],
      activeAnomalyDescription:
        overallHealth !== 'OPERATIVO'
          ? `Anomalía detectada en ${targetNode.name}: ${action.explanationWhatChanged}`
          : undefined,
    };
  }

  /**
   * Recovers the system back to fully operational baseline.
   */
  public static recoverToBaseline(currentState: DigitalTwinState): DigitalTwinState {
    const baseline = this.createInitialState();
    const recoveryLog: CausalInterventionLog = {
      id: `log-rec-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actionTitle: 'REPARACIÓN Y RESTAURACIÓN PERICIAL',
      whatChanged: 'Se restablecieron todos los 12 subsistemas a parámetros nominales de fábrica.',
      whatDependedOnIt: 'Secuencia de BOOT, controladores y servicios restablecidos.',
      evidenceGenerated: 'SIMULACIÓN EDUCATIVA: Sistema 100% OPERATIVO en Ring 0.',
      affectedNodeIds: Object.keys(baseline.nodes),
    };

    return {
      ...baseline,
      zoomLevel: currentState.zoomLevel,
      mode: 'RECUPERAR',
      history: [recoveryLog, ...currentState.history],
    };
  }
}
