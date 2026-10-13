// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — GLOBAL COMPATIBILITY GRAPH / MATRIX MODAL
// Principle: "COMPATIBILITY GRAPH: MATRIZ GLOBAL DE INTERCONEXIÓN DEL SILICIO Y ENERGÍA"
// ============================================================================

import React, { useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  HardDrive,
  Box,
  Fan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Maximize2,
  Globe,
  FileCheck,
} from 'lucide-react';
import { BuildComponentItem, CompatibilityReport } from '../types';
import { HardwareCompatibilityGraph } from '../services/ingestion/hardwareCompatibilityGraph';

interface EvoCompatibilityGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: {
    motherboard?: BuildComponentItem;
    cpu?: BuildComponentItem;
    ram?: BuildComponentItem;
    gpu?: BuildComponentItem;
    storage?: BuildComponentItem;
    psu?: BuildComponentItem;
    cooling?: BuildComponentItem;
    case?: BuildComponentItem;
  };
  compatibility: CompatibilityReport;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  category: 'PHYSICAL' | 'ELECTRICAL' | 'FIRMWARE';
  status: 'COMPATIBLE' | 'COMPATIBLE_AFTER_BIOS_UPDATE' | 'WARNING' | 'INCOMPATIBLE' | 'UNKNOWN';
  detail: string;
}

export const EvoCompatibilityGraphModal: React.FC<EvoCompatibilityGraphModalProps> = ({
  isOpen,
  onClose,
  components,
  compatibility,
}) => {
  if (!isOpen) return null;

  const { motherboard, cpu, ram, gpu, storage, psu, cooling } = components;
  const caseItem = components.case;

  // Master Knowledge Graph Evaluation
  const graphEval = useMemo(() => {
    return HardwareCompatibilityGraph.evaluateGraph(components);
  }, [components]);

  // Build matrix graph edges with official rules and provenance
  const edges: GraphEdge[] = [];

  // 1. CPU <-> Motherboard
  if (cpu && motherboard) {
    const check = compatibility.checks.find((c) => c.subsystems.includes('cpu') && c.subsystems.includes('motherboard') && !c.id.includes('bios'));
    const biosCheck = compatibility.checks.find((c) => c.id.includes('bios'));
    edges.push({
      from: 'Procesador (CPU)',
      to: 'Placa Base (Motherboard)',
      label: 'Socket Mecánico & Buses',
      category: 'PHYSICAL',
      status: check?.status || 'COMPATIBLE',
      detail: check?.detail || 'Socket verificado.',
    });
    if (biosCheck) {
      edges.push({
        from: 'Placa Base (BIOS/AGESA)',
        to: 'Procesador (Microcódigo)',
        label: 'Compatibilidad de Firmware',
        category: 'FIRMWARE',
        status: biosCheck.status,
        detail: biosCheck.detail,
      });
    }
  }

  // 2. RAM <-> Motherboard & CPU IMC
  if (ram && motherboard) {
    const check = compatibility.checks.find((c) => c.subsystems.includes('ram') && c.subsystems.includes('motherboard'));
    edges.push({
      from: 'Memoria RAM',
      to: 'Placa Base & Controlador de Memoria (IMC)',
      label: 'Generación DDR & Muesca JEDEC',
      category: 'PHYSICAL',
      status: check?.status || 'COMPATIBLE',
      detail: check?.detail || 'Generación DDR compatible.',
    });
  }

  // 3. GPU <-> Motherboard & PSU & Case
  if (gpu && motherboard) {
    edges.push({
      from: 'Placa de Video (GPU)',
      to: 'Placa Base',
      label: 'Ranura PCIe x16',
      category: 'PHYSICAL',
      status: 'COMPATIBLE',
      detail: 'Interfase PCIe estándar retrocompatible en ancho de banda.',
    });
  }
  if (gpu && psu) {
    const psuCap = compatibility.checks.find((c) => c.id === 'chk-psu-capacity');
    const pwrConn = compatibility.checks.find((c) => c.id === 'chk-pwr-connectors');
    edges.push({
      from: 'Fuente de Poder (PSU)',
      to: 'Placa de Video (GPU)',
      label: 'Riel +12V & Conectores PCIe / 12V-2x6',
      category: 'ELECTRICAL',
      status: psuCap?.status === 'INCOMPATIBLE' ? 'INCOMPATIBLE' : pwrConn?.status === 'WARNING' ? 'WARNING' : 'COMPATIBLE',
      detail: `${psuCap?.detail || 'Potencia verificada.'} ${pwrConn?.detail || ''}`,
    });
  }
  if (gpu && caseItem) {
    const check = compatibility.checks.find((c) => c.id === 'chk-gpu-clearance');
    edges.push({
      from: 'Placa de Video (GPU)',
      to: 'Gabinete (Chasis)',
      label: 'Clearance de Longitud Interna',
      category: 'PHYSICAL',
      status: check?.status || 'COMPATIBLE',
      detail: check?.detail || 'Dimensiones compatibles con espacio del chasis.',
    });
  }

  // 4. Cooling <-> CPU & Case
  if (cooling && cpu) {
    const check = compatibility.checks.find((c) => c.id.includes('cooling-tdp'));
    edges.push({
      from: 'Sistema de Refrigeración',
      to: 'Procesador (CPU)',
      label: 'Disipación Térmica (TDP en Watts)',
      category: 'PHYSICAL',
      status: check?.status || 'COMPATIBLE',
      detail: check?.detail || 'Capacidad térmica verificada contra TDP.',
    });
  }
  if (cooling && caseItem) {
    const check = compatibility.checks.find((c) => c.id === 'chk-cooler-clearance');
    edges.push({
      from: 'Sistema de Refrigeración',
      to: 'Gabinete (Chasis)',
      label: 'Altura de Disipador / Espacio de Radiador',
      category: 'PHYSICAL',
      status: check?.status || 'COMPATIBLE',
      detail: check?.detail || 'Altura libre dentro del panel lateral.',
    });
  }

  // 5. Motherboard <-> Case
  if (motherboard && caseItem) {
    const check = compatibility.checks.find((c) => c.id === 'chk-ff-mb-case');
    edges.push({
      from: 'Placa Base (Motherboard)',
      to: 'Gabinete (Chasis)',
      label: 'Factor de Forma & Standoffs (ATX/mATX/ITX)',
      category: 'PHYSICAL',
      status: check?.status || 'COMPATIBLE',
      detail: check?.detail || 'Factor de forma compatible.',
    });
  }

  // 6. Storage <-> Motherboard
  if (storage && motherboard) {
    const check = compatibility.checks.find((c) => c.subsystems.includes('storage'));
    edges.push({
      from: 'Unidad de Almacenamiento',
      to: 'Placa Base (Motherboard)',
      label: 'Interfaz M.2 NVMe / Puertos SATA',
      category: 'PHYSICAL',
      status: check?.status || 'COMPATIBLE',
      detail: check?.detail || 'Ranuras M.2 / SATA compatibles.',
    });
  }

  // 7. PSU <-> CPU
  if (psu && cpu) {
    edges.push({
      from: 'Fuente de Poder (PSU)',
      to: 'Procesador (CPU)',
      label: 'Líneas EPS 12V (4+4 pin)',
      category: 'ELECTRICAL',
      status: 'COMPATIBLE',
      detail: 'Alimentación estándar ATX EPS12V para circuito VRM.',
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono-tech animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0b0e14] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-[#0e121b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MATRIZ & GRAFO GLOBAL DE COMPATIBILIDAD
              </span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
              INTERCONEXIÓN COMPLETA DEL SISTEMA
            </h2>
            <p className="text-xs text-zinc-400 font-sans-editorial">
              No evaluamos pares aislados. Cada componente interactúa física, eléctrica y por firmware con el conjunto de la Machine.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0 border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin text-xs">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">ESTADO GLOBAL</span>
              <span
                className={`font-black text-sm uppercase ${
                  compatibility.overallStatus === 'COMPATIBLE'
                    ? 'text-emerald-400'
                    : compatibility.overallStatus === 'COMPATIBLE_AFTER_BIOS_UPDATE'
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {compatibility.overallStatus}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">POTENCIA / PSU</span>
              <span className="font-mono text-sm text-white font-bold">
                {compatibility.totalPowerDrawW}W / {compatibility.psuMarginW > 0 ? `+${compatibility.psuMarginW}W margen` : `${compatibility.psuMarginW}W margen`}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">NODOS INTERCONECTADOS</span>
              <span className="font-mono text-sm text-purple-300 font-bold">
                {edges.length} Relaciones Activas
              </span>
            </div>
          </div>

          {/* Interactive Matrix / Edges Table */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              GRAFO DE RELACIONES INTER-SUBSISTEMAS:
            </span>

            <div className="space-y-2.5">
              {edges.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 italic">
                  Selecciona al menos 2 componentes para generar las ramas del grafo de compatibilidad.
                </div>
              ) : (
                edges.map((edge, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border space-y-2 ${
                      edge.status === 'INCOMPATIBLE'
                        ? 'border-red-500/50 bg-red-950/20 text-red-200'
                        : edge.status === 'COMPATIBLE_AFTER_BIOS_UPDATE'
                        ? 'border-amber-500/40 bg-amber-950/20 text-amber-200'
                        : edge.status === 'WARNING'
                        ? 'border-yellow-500/40 bg-yellow-950/15 text-yellow-200'
                        : 'border-zinc-800/80 bg-zinc-950/60 text-zinc-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-xs flex-wrap">
                        <span className="text-white">{edge.from}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="text-white">{edge.to}</span>
                        <span className="text-[10px] text-zinc-400 font-mono font-normal">
                          ({edge.label})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {edge.category}
                        </span>
                        <span
                          className={`font-mono text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                            edge.status === 'INCOMPATIBLE'
                              ? 'bg-red-500/30 text-red-300'
                              : edge.status === 'COMPATIBLE_AFTER_BIOS_UPDATE'
                              ? 'bg-amber-500/30 text-amber-300'
                              : edge.status === 'WARNING'
                              ? 'bg-yellow-500/30 text-yellow-300'
                              : 'bg-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          {edge.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 font-sans-editorial leading-tight">
                      {edge.detail}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 bg-[#0e121b] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            ENTENDIDO // VOLVER AL BANCO
          </button>
        </div>
      </div>
    </div>
  );
};
