import React, { useState } from 'react';
import {
  X,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  Sliders,
  Layers,
  RotateCcw,
  Sparkles,
  Database,
  Terminal,
  Compass,
  CheckCircle2,
  FileText,
  HardDrive,
  Wifi,
  Power,
  Eye,
  Wrench,
} from 'lucide-react';
import {
  EvoInteractiveDigitalTwin,
  DigitalTwinState,
  ZoomLevel,
  OperatingMode,
  SystemHealthState,
  SystemNodeState,
} from '../../services/evoInteractiveDigitalTwin';

interface EvoDigitalTwinViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvoDigitalTwinViewerModal: React.FC<EvoDigitalTwinViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [twinState, setTwinState] = useState<DigitalTwinState>(() =>
    EvoInteractiveDigitalTwin.createInitialState()
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('boot');

  if (!isOpen) return null;

  const handleSetZoom = (level: ZoomLevel) => {
    setTwinState((prev) => ({ ...prev, zoomLevel: level }));
  };

  const handleSetMode = (mode: OperatingMode) => {
    setTwinState((prev) => ({ ...prev, mode }));
  };

  const handleInjectStorageFailure = () => {
    const updated = EvoInteractiveDigitalTwin.evaluateCausalChain(twinState, {
      actionTitle: 'INDUCIR FALLO EN ALMACENAMIENTO (BCD CORRUPTO / DISCO DESCONECTADO)',
      targetNodeId: 'storage',
      newHealth: 'FALLO_CRÍTICO',
      customMetric: 'Salud SMART: Indefinida | BCD Store: Inaccesible',
      customDetails: 'Partición EFI no responde a llamadas de montado winload.efi.',
      explanationWhatChanged:
        'Se interrumpió el enlace lógico al almacén BCD de la partición FAT32 de arranque.',
    });
    setTwinState(updated);
  };

  const handleInjectDriverFailure = () => {
    const updated = EvoInteractiveDigitalTwin.evaluateCausalChain(twinState, {
      actionTitle: 'DESHABILITAR CONTROLADOR DE GPU (DRIVER GRÁFICO GENÉRICO)',
      targetNodeId: 'drivers',
      newHealth: 'ANOMALÍA',
      customMetric: 'Driver: BasicDisplay.sys | Sin WDDM 3.1',
      customDetails: 'Dispositivo degradado al adaptador genérico de Microsoft.',
      explanationWhatChanged:
        'Se deshabilitó el controlador WDDM dedicado firmado por el fabricante.',
    });
    setTwinState(updated);
  };

  const handleInjectNcsiFailure = () => {
    const updated = EvoInteractiveDigitalTwin.evaluateCausalChain(twinState, {
      actionTitle: 'DETENER SERVICIO NCSI DE RED',
      targetNodeId: 'services',
      newHealth: 'DEGRADADO',
      customMetric: 'Servicio NCSI: Stopped | Sockets: Inactivos',
      customDetails: 'El servicio de indicador de conectividad NT no responde.',
      explanationWhatChanged:
        'Se detuvo el servicio de resolución de conectividad a la red.',
    });
    setTwinState(updated);
  };

  const handleInjectRamPressure = () => {
    const updated = EvoInteractiveDigitalTwin.evaluateCausalChain(twinState, {
      actionTitle: 'DESHABILITAR MÓDULO RAM B2 (MODO SINGLE CHANNEL)',
      targetNodeId: 'ram',
      newHealth: 'ANOMALÍA',
      customMetric: '8 GB DDR4 | Single Channel (64-bit)',
      customDetails: 'Ancho de banda reducido al 50% con paginación activa en C:\\pagefile.sys.',
      explanationWhatChanged:
        'Se retiró virtualmente un módulo de memoria RAM de la motherboard.',
    });
    setTwinState(updated);
  };

  const handleRecoverBaseline = () => {
    const recovered = EvoInteractiveDigitalTwin.recoverToBaseline(twinState);
    setTwinState(recovered);
  };

  const getNodeHealthColor = (health: SystemHealthState) => {
    switch (health) {
      case 'OPERATIVO':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'DEGRADADO':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'ANOMALÍA':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'FALLO_CRÍTICO':
        return 'bg-red-500/15 text-red-300 border-red-500/30 animate-pulse';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  // Filter nodes according to Zoom Level
  const nodeEntries = Object.values(twinState.nodes) as SystemNodeState[];
  const filteredNodes = nodeEntries.filter((n: SystemNodeState) => {
    if (twinState.zoomLevel === 'PC_GLOBAL') return n.category === 'HARDWARE';
    if (twinState.zoomLevel === 'MOTHERBOARD') return n.category === 'HARDWARE' || n.category === 'FIRMWARE';
    if (twinState.zoomLevel === 'FIRMWARE_KERNEL') return n.category === 'FIRMWARE' || n.category === 'KERNEL';
    return true; // OS_SERVICES shows all 12 nodes
  });

  const selectedNode = selectedNodeId ? twinState.nodes[selectedNodeId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl rounded-2xl bg-[#090c13] border border-cyan-500/30 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                DIGITAL TWIN // FASE 04
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                SIMULACIÓN EDUCATIVA
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase border ${getNodeHealthColor(
                  twinState.overallSystemHealth
                )}`}
              >
                ESTADO GENERAL: {twinState.overallSystemHealth}
              </span>
            </div>
            <h2 className="font-display font-black text-lg sm:text-2xl text-white uppercase tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>INTERACTIVE COMPUTER MODEL // GEMELO DIGITAL DE PC</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS BAR: OPERATING MODE & CONCEPTUAL ZOOM */}
        <div className="px-4 py-3 bg-zinc-950/90 border-b border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0 text-xs font-mono-tech">
          {/* OPERATING MODES */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">MODO OPERATIVO:</span>
            {[
              { id: 'OBSERVAR', label: 'OBSERVAR', icon: <Eye className="w-3.5 h-3.5" /> },
              { id: 'INTERVENIR', label: 'INTERVENIR', icon: <Sliders className="w-3.5 h-3.5" /> },
              { id: 'FALLAR', label: 'FALLAR', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
              { id: 'RECUPERAR', label: 'RECUPERAR', icon: <RotateCcw className="w-3.5 h-3.5" /> },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSetMode(m.id as OperatingMode)}
                className={`px-3 py-1.5 rounded-lg border font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer text-[10px] ${
                  twinState.mode === m.id
                    ? 'bg-amber-400 text-black border-amber-400'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* CONCEPTUAL ZOOM LEVELS */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">ZOOM CONCEPTUAL:</span>
            {[
              { id: 'PC_GLOBAL', label: '1. PC GLOBAL' },
              { id: 'MOTHERBOARD', label: '2. MOTHERBOARD' },
              { id: 'FIRMWARE_KERNEL', label: '3. FIRMWARE & KERNEL' },
              { id: 'OS_SERVICES', label: '4. SO & SERVICIOS' },
            ].map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => handleSetZoom(z.id as ZoomLevel)}
                className={`px-2.5 py-1 rounded-lg border font-bold uppercase transition-colors cursor-pointer text-[9.5px] ${
                  twinState.zoomLevel === z.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN DISPLAY AREA - SCROLLABLE */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto font-sans-editorial text-xs text-zinc-300">
          {/* BOOT DIGITAL TWIN REFERENCIA - TIMELINE POST */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3 font-mono-tech">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                <Zap className="w-4 h-4 text-amber-400" />
                BOOT DIGITAL TWIN // SECUENCIA CRONOLÓGICA DE ARRANQUE (35 ESTADOS POST)
              </span>
              <span className="text-[10px] text-zinc-500">
                PASO: {twinState.postStateIndex} DE 35
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="35"
                value={twinState.postStateIndex}
                onChange={(e) =>
                  setTwinState((prev) => ({ ...prev, postStateIndex: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-amber-400 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                <span>01. POWER ON (12V)</span>
                <span>12. BIOS POST & RAM</span>
                <span>24. MOUNT EFI BCD</span>
                <span>35. WINDOWS KERNEL NT</span>
              </div>
            </div>
          </div>

          {/* INTERACTION ACTION CONTROLS WHEN IN 'FALLAR' OR 'INTERVENIR' MODE */}
          {(twinState.mode === 'FALLAR' || twinState.mode === 'INTERVENIR' || twinState.mode === 'RECUPERAR') && (
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-400/30 space-y-3 font-mono-tech">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                <Wrench className="w-4 h-4" />
                <span>ACCIONES DE INTERVENCIÓN Y SIMULACIÓN DE FALLAS EN CASCADA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={handleInjectStorageFailure}
                  className="p-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-500/40 font-bold uppercase transition-colors cursor-pointer text-left space-y-1"
                >
                  <span className="block text-red-400 font-black">1. CORROMPER ALMACÉN BCD</span>
                  <span className="block text-zinc-400 font-normal font-sans-editorial text-[9.5px]">
                    Induce fallo de arranque y redirige a WinRE.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleInjectDriverFailure}
                  className="p-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/40 font-bold uppercase transition-colors cursor-pointer text-left space-y-1"
                >
                  <span className="block text-cyan-400 font-black">2. REMOVER DRIVER WDDM</span>
                  <span className="block text-zinc-400 font-normal font-sans-editorial text-[9.5px]">
                    Degrada la pantalla a resolución básica.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleInjectNcsiFailure}
                  className="p-2.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-500/40 font-bold uppercase transition-colors cursor-pointer text-left space-y-1"
                >
                  <span className="block text-amber-400 font-black">3. DETENER SERVICIO NCSI</span>
                  <span className="block text-zinc-400 font-normal font-sans-editorial text-[9.5px]">
                    Provoca conectividad limitada en la red.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleInjectRamPressure}
                  className="p-2.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-bold uppercase transition-colors cursor-pointer text-left space-y-1"
                >
                  <span className="block text-purple-400 font-black">4. REMOVER MÓDULO RAM B2</span>
                  <span className="block text-zinc-400 font-normal font-sans-editorial text-[9.5px]">
                    Reduce memoria a 8GB e incrementa paging.
                  </span>
                </button>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleRecoverBaseline}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider transition-colors cursor-pointer text-xs flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESTAURAR SISTEMA COMPLETO A 100% OPERATIVO →</span>
                </button>
              </div>
            </div>
          )}

          {/* 12-NODE CAUSAL ARCHITECTURE GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono-tech border-b border-zinc-800 pb-2">
              <span className="text-cyan-400 font-bold text-xs uppercase flex items-center gap-2">
                <Layers className="w-4 h-4" />
                MATRIZ CAUSAL DE NULOS Y SUBSISTEMAS ({filteredNodes.length} MOSTRADOS DE 12)
              </span>
              <span className="text-[10px] text-zinc-500">
                HAGA CLIC EN UN NODO PARA INSPECCIONAR DEPENDENCIAS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono-tech">
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-900 border-amber-400 shadow-lg shadow-amber-400/10'
                        : 'bg-zinc-950/90 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-white uppercase tracking-tight">
                          {node.name}
                        </span>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded text-[8.5px] font-bold uppercase border ${getNodeHealthColor(
                            node.health
                          )}`}
                        >
                          {node.health}
                        </span>
                      </div>

                      <p className="text-[11px] text-amber-300/90 font-bold leading-tight">
                        {node.statusLabel}
                      </p>

                      <div className="text-[10px] text-zinc-400 font-sans-editorial">
                        {node.primaryMetric}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[9px] text-zinc-500">
                      <span>CATEGORÍA: {node.category}</span>
                      <span className="text-cyan-400 font-bold">VER DEPENDENCIAS →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INSPECTED NODE DETAILS & DEPENDENCY GRAPH */}
          {selectedNode && (
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono-tech text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-white font-bold text-sm uppercase flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  INSPECCIÓN DEL SUBSISTEMA: {selectedNode.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getNodeHealthColor(selectedNode.health)}`}>
                  ESTADO: {selectedNode.health}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-amber-400 font-bold uppercase text-[10px] block">
                    DETALLES Y TELEMETRÍA DEL NODO:
                  </span>
                  <p className="text-zinc-300 font-sans-editorial">{selectedNode.details}</p>
                  <p className="text-zinc-400 font-sans-editorial pt-1 border-t border-zinc-900">
                    Métrica Principal: {selectedNode.primaryMetric}
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-cyan-400 font-bold uppercase text-[10px] block">
                    MAPA DE CAUSALIDAD Y DEPENDENCIAS:
                  </span>
                  <div className="space-y-1 text-[10px]">
                    <div>
                      <strong className="text-zinc-500 uppercase">DEPENDE DE:</strong>{' '}
                      <span className="text-zinc-300 font-bold">
                        {selectedNode.dependencies.length > 0 ? selectedNode.dependencies.join(', ') : 'Ninguno (Nodo Raíz)'}
                      </span>
                    </div>
                    <div>
                      <strong className="text-zinc-500 uppercase">AFECTA A:</strong>{' '}
                      <span className="text-zinc-300 font-bold">
                        {selectedNode.dependents.length > 0 ? selectedNode.dependents.join(', ') : 'Nodo Hoja'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOG HISTORIAL DE INTERVENCIONES & EVIDENCIA Y CAUSALIDAD */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3 font-mono-tech text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <FileText className="w-4 h-4" />
                HISTORIAL DE CAUSALIDAD Y EVIDENCIA GENERADA ({twinState.history.length} EVENTOS)
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {twinState.history.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-black/60 border border-zinc-800/80 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-white uppercase">{log.actionTitle}</span>
                    <span className="text-[9.5px] text-zinc-500">{log.timestamp}</span>
                  </div>
                  <div className="text-zinc-300 font-sans-editorial">
                    <strong className="text-amber-400 font-mono-tech uppercase text-[9.5px]">QUÉ CAMBIA:</strong>{' '}
                    {log.whatChanged}
                  </div>
                  <div className="text-zinc-400 font-sans-editorial">
                    <strong className="text-cyan-400 font-mono-tech uppercase text-[9.5px]">QUÉ DEPENDÍA DE ESO:</strong>{' '}
                    {log.whatDependedOnIt}
                  </div>
                  <div className="text-emerald-300 font-mono text-[10px] bg-zinc-950 p-1.5 rounded border border-zinc-900 mt-1">
                    <strong className="text-emerald-400 uppercase text-[9px]">EVIDENCIA GENERADA:</strong>{' '}
                    {log.evidenceGenerated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
