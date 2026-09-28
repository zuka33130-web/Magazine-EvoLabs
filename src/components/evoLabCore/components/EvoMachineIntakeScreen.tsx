// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — INTAKE SCREEN: ¿QUÉ PC QUERÉS EVALUAR?
// Principle: "PRIMERO SE DEFINE LA MACHINE. NADA APARECE ANTES DE TENER UNA COMPUTADORA."
// Mandatory Intake: IMPORTAR ESTA PC strictly queries EVO LOCAL AGENT (127.0.0.1:43921).
// If agent does NOT respond: NO browser fallback completo, NO demo, NO fixture.
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Tv,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Copy,
  Trash2,
  Edit3,
  Globe,
  Radio,
  Plus,
  AlertTriangle,
  FolderOpen,
  Server,
  Terminal,
  RefreshCw,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Machine } from '../types';
import { HardwareSensorService, SiliconSensorReport } from '../services/hardwareSensorService';
import { MachineAdapter } from '../services/machineAdapter';
import { EvoCaseRepository } from '../services/caseRepository';
import { EvoAgentClient, AgentHealth, AgentMachineImportResult } from '../services/evoAgentClient';
import { useLabAestheticMode } from '../../../utils/labAestheticMode';

interface EvoMachineIntakeScreenProps {
  onImportThisPc: (detectedMachine: Machine) => void;
  onCreateNewPc: () => void;
  onSelectSavedMachine: (machine: Machine) => void;
}

export const EvoMachineIntakeScreen: React.FC<EvoMachineIntakeScreenProps> = ({
  onImportThisPc,
  onCreateNewPc,
  onSelectSavedMachine,
}) => {
  const { isElite } = useLabAestheticMode();
  const [isImporting, setIsImporting] = useState(false);
  const [agentHealth, setAgentHealth] = useState<AgentHealth | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [showAgentNotConnectedModal, setShowAgentNotConnectedModal] = useState<boolean>(false);
  const [showQuickDetectionModal, setShowQuickDetectionModal] = useState<boolean>(false);
  const [quickSensorReport, setQuickSensorReport] = useState<SiliconSensorReport | null>(null);
  const [showDevFixtures, setShowDevFixtures] = useState<boolean>(false);
  const [savedMachines, setSavedMachines] = useState<Machine[]>([]);

  // Load saved machines and verify initial EVO Local Agent status on 127.0.0.1:43921
  useEffect(() => {
    try {
      const raw = localStorage.getItem('evo_lab_core_saved_machines_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedMachines(parsed);
      }
    } catch (err) {
      console.warn('Error reading saved machines:', err);
    }

    // Ping EVO Local Agent on mount
    checkAgentStatus();
  }, []);

  const checkAgentStatus = async () => {
    try {
      const health = await EvoAgentClient.pingAgent(1200);
      setAgentHealth(health);
      if (health) {
        setAgentError(null);
      }
    } catch {
      setAgentHealth(null);
    }
  };

  /**
   * MANDATORY FLOW: IMPORTAR ESTA PC
   * 1. Comprobar http://127.0.0.1:43921/health
   * 2. Handshake (token de sesión)
   * 3. /v1/machine
   * 4. Validar respuesta
   * 5. MachineAdapter
   * 6. Canonical Machine
   * 7. Guardar Active Machine
   * 8. Mostrar Machine detectada.
   *
   * IF AGENT DOES NOT RESPOND:
   * STRICTLY NO browser fallback completo, NO demo, NO fixture.
   * Show: EVO AGENT NO CONECTADO.
   */
  const handleImportThisPcFlow = async () => {
    setIsImporting(true);
    setAgentError(null);

    try {
      const result: AgentMachineImportResult = await EvoAgentClient.importThisPc(5000);

      if (result.success && result.machine) {
        // Successful intake directly from Windows CIM/WMI
        setAgentHealth(result.health || null);
        onImportThisPc(result.machine);
      } else {
        // STRICT: Agent not reachable / error -> Show EVO AGENT NO CONECTADO
        setAgentError(result.error || 'EVO AGENT NO CONECTADO');
        setShowAgentNotConnectedModal(true);
        setAgentHealth(null);
      }
    } catch (err: any) {
      setAgentError(err?.message || 'EVO AGENT NO CONECTADO');
      setShowAgentNotConnectedModal(true);
      setAgentHealth(null);
    } finally {
      setIsImporting(false);
    }
  };

  /**
   * Quick Browser Silicon Diagnostics (SEPARATE FROM FULL MACHINE IMPORT)
   * Only displays partial browser runtime info (concurrency, webgl)
   * WITHOUT creating a full machine entity.
   */
  const handleOpenQuickDetection = async () => {
    try {
      const { report } = await HardwareSensorService.sampleLiveSilicon();
      setQuickSensorReport(report);
      setShowQuickDetectionModal(true);
    } catch (err) {
      console.warn('Quick detection sampling error:', err);
    }
  };

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedMachines.filter((m) => m.id !== id);
    setSavedMachines(updated);
    localStorage.setItem('evo_lab_core_saved_machines_v1', JSON.stringify(updated));
  };

  const handleDuplicateSaved = (machine: Machine, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: Machine = {
      ...machine,
      id: `MCH-DUP-${Date.now()}`,
      alias: `${machine.alias} (Copia)`,
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...savedMachines];
    setSavedMachines(updated);
    localStorage.setItem('evo_lab_core_saved_machines_v1', JSON.stringify(updated));
  };

  // 5 Explicit Test Fixtures as requested in prompt requirement 36
  const TEST_FIXTURES: { label: string; tag: string; description: string; machine: Machine }[] = [
    {
      label: 'MACHINE A: Intel Core i5 + GeForce RTX 4060',
      tag: 'INTEL + NVIDIA',
      description: 'Intel Core i5-12400 • ASUS PRIME B760M-A • 16GB DDR4 • RTX 4060 8GB • Kingston A400 480GB • 650W PSU',
      machine: {
        ...MachineAdapter.createBlankMachine('MACHINE A // Intel Core i5 + RTX 4060'),
        motherboard: {
          model: 'ASUS PRIME B760M-A WIFI D4',
          socket: 'LGA1700',
          chipset: 'B760',
          ramSlots: 4,
          ramType: 'DDR4',
          pcieGen: 'PCIe 4.0',
          formFactor: 'Micro-ATX',
          provenance: 'ESTIMATED',
        },
        cpu: {
          model: 'Intel Core i5-12400',
          socket: 'LGA1700',
          cores: 6,
          threads: 12,
          tdpW: 65,
          hasIGPU: true,
          provenance: 'ESTIMATED',
        },
        ram: {
          sizeGb: 16,
          configuredSpeedMts: 3200,
          type: 'DDR4',
          channels: 2,
          provenance: 'ESTIMATED',
        },
        gpu: {
          model: 'ASUS Dual GeForce RTX 4060 V2 OC Edition 8GB',
          vramGb: 8,
          isDedicated: true,
          powerW: 115,
          pcieGen: 'PCIe 4.0',
          provenance: 'ESTIMATED',
        },
        storage: {
          type: 'SATA SSD',
          capacityGb: 480,
          model: 'Kingston A400 480GB SATA SSD',
          provenance: 'ESTIMATED',
        },
        psu: {
          wattageW: 650,
          rating: '80+ Bronze',
          provenance: 'ESTIMATED',
        },
        cooling: {
          type: 'Air Tower',
          tdpCapacityW: 180,
          provenance: 'ESTIMATED',
        },
        chassis: {
          model: 'Corsair 4000D Airflow Tempered Glass Mid-Tower',
          formFactor: 'ATX',
          gpuClearanceMm: 360,
          coolerClearanceMm: 170,
          provenance: 'ESTIMATED',
        },
      },
    },
    {
      label: 'MACHINE B: AMD Ryzen 7 + Radeon RX 7800 XT',
      tag: 'AMD + RADEON',
      description: 'AMD Ryzen 7 7800X3D • MSI PRO B650-P WIFI • 32GB DDR5 • RX 7800 XT 16GB • WD Black SN770 1TB NVMe • 750W PSU',
      machine: {
        ...MachineAdapter.createBlankMachine('MACHINE B // Ryzen 7 + RX 7800 XT'),
        motherboard: {
          model: 'MSI PRO B650-P WIFI',
          socket: 'AM5',
          chipset: 'B650',
          ramSlots: 4,
          ramType: 'DDR5',
          pcieGen: 'PCIe 4.0',
          formFactor: 'ATX',
          provenance: 'ESTIMATED',
        },
        cpu: {
          model: 'AMD Ryzen 7 7800X3D',
          socket: 'AM5',
          cores: 8,
          threads: 16,
          tdpW: 120,
          hasIGPU: true,
          provenance: 'ESTIMATED',
        },
        ram: {
          sizeGb: 32,
          configuredSpeedMts: 6000,
          type: 'DDR5',
          channels: 2,
          provenance: 'ESTIMATED',
        },
        gpu: {
          model: 'PowerColor Hellhound AMD Radeon RX 7800 XT 16GB',
          vramGb: 16,
          isDedicated: true,
          powerW: 263,
          pcieGen: 'PCIe 4.0',
          provenance: 'ESTIMATED',
        },
        storage: {
          type: 'NVMe M.2',
          capacityGb: 1000,
          model: 'WD Black SN770 1TB NVMe M.2 SSD',
          provenance: 'ESTIMATED',
        },
        psu: {
          wattageW: 750,
          rating: '80+ Gold',
          provenance: 'ESTIMATED',
        },
        cooling: {
          type: 'Air Tower',
          tdpCapacityW: 245,
          provenance: 'ESTIMATED',
        },
        chassis: {
          model: 'NZXT H5 Flow Compact ATX Mid-Tower',
          formFactor: 'ATX',
          gpuClearanceMm: 365,
          coolerClearanceMm: 165,
          provenance: 'ESTIMATED',
        },
      },
    },
    {
      label: 'MACHINE C: PC con Gráficos Integrados (iGPU)',
      tag: 'iGPU / OFICINA',
      description: 'Intel Core i5-12400 (Intel UHD 730) • ASUS PRIME B760M-A • 16GB DDR4 • Sin GPU dedicada • Apta para tareas de oficina y multimedia.',
      machine: {
        ...MachineAdapter.createBlankMachine('MACHINE C // iGPU Intel UHD'),
        motherboard: {
          model: 'ASUS PRIME B760M-A WIFI D4',
          socket: 'LGA1700',
          chipset: 'B760',
          ramSlots: 4,
          ramType: 'DDR4',
          pcieGen: 'PCIe 4.0',
          formFactor: 'Micro-ATX',
          provenance: 'ESTIMATED',
        },
        cpu: {
          model: 'Intel Core i5-12400',
          socket: 'LGA1700',
          cores: 6,
          threads: 12,
          tdpW: 65,
          hasIGPU: true,
          provenance: 'ESTIMATED',
        },
        ram: {
          sizeGb: 16,
          configuredSpeedMts: 3200,
          type: 'DDR4',
          channels: 2,
          provenance: 'ESTIMATED',
        },
        gpu: {
          model: 'Intel UHD Graphics 730 (Integrada)',
          vramGb: 2,
          isDedicated: false,
          powerW: 15,
          provenance: 'ESTIMATED',
        },
        storage: {
          type: 'NVMe M.2',
          capacityGb: 500,
          model: 'Kingston NV2 500GB NVMe M.2 SSD',
          provenance: 'ESTIMATED',
        },
        psu: {
          wattageW: 500,
          rating: '80+ White',
          provenance: 'ESTIMATED',
        },
        cooling: {
          type: 'Stock Fan',
          tdpCapacityW: 65,
          provenance: 'ESTIMATED',
        },
        chassis: {
          model: 'Gabinete Genérico Micro-ATX',
          formFactor: 'Micro-ATX',
          gpuClearanceMm: 300,
          coolerClearanceMm: 150,
          provenance: 'ESTIMATED',
        },
      },
    },
    {
      label: 'MACHINE D: Configuración Incompatible (AM5 + LGA1700)',
      tag: 'INCOMPATIBLE',
      description: 'Placa Base MSI B650 (Socket AM5) con CPU Intel Core i7-14700K (Socket LGA1700). Demuestra la advertencia y detección pericial.',
      machine: {
        ...MachineAdapter.createBlankMachine('MACHINE D // Incompatible AM5 + LGA1700'),
        motherboard: {
          model: 'MSI PRO B650-P WIFI',
          socket: 'AM5',
          chipset: 'B650',
          ramSlots: 4,
          ramType: 'DDR5',
          pcieGen: 'PCIe 4.0',
          formFactor: 'ATX',
          provenance: 'ESTIMATED',
        },
        cpu: {
          model: 'Intel Core i7-14700K',
          socket: 'LGA1700',
          cores: 20,
          threads: 28,
          tdpW: 253,
          hasIGPU: true,
          provenance: 'ESTIMATED',
        },
        ram: {
          sizeGb: 32,
          configuredSpeedMts: 6000,
          type: 'DDR5',
          channels: 2,
          provenance: 'ESTIMATED',
        },
        gpu: {
          model: 'ASUS Dual GeForce RTX 4070 OC Edition 12GB',
          vramGb: 12,
          isDedicated: true,
          powerW: 200,
          pcieGen: 'PCIe 4.0',
          provenance: 'ESTIMATED',
        },
        storage: {
          type: 'NVMe M.2',
          capacityGb: 1000,
          model: 'Samsung 980 Pro 1TB NVMe M.2 SSD',
          provenance: 'ESTIMATED',
        },
        psu: {
          wattageW: 750,
          rating: '80+ Gold',
          provenance: 'ESTIMATED',
        },
        cooling: {
          type: 'Air Tower',
          tdpCapacityW: 245,
          provenance: 'ESTIMATED',
        },
        chassis: {
          model: 'Corsair 4000D Airflow Tempered Glass Mid-Tower',
          formFactor: 'ATX',
          gpuClearanceMm: 360,
          coolerClearanceMm: 170,
          provenance: 'ESTIMATED',
        },
      },
    },
    {
      label: 'MACHINE E: Componente Escrito Manualmente (Custom SKU)',
      tag: 'CUSTOM / MANUAL',
      description: 'Configuración personalizada con SSD Kingston SA400S37480G y piezas editadas a mano con campos UNKNOWN.',
      machine: {
        ...MachineAdapter.createBlankMachine('MACHINE E // Custom SKU Manual'),
        motherboard: {
          model: 'GIGABYTE B550 AORUS ELITE V2',
          socket: 'AM4',
          chipset: 'B550',
          ramSlots: 4,
          ramType: 'DDR4',
          pcieGen: 'PCIe 4.0',
          formFactor: 'ATX',
          provenance: 'USER_ENTERED',
        },
        cpu: {
          model: 'AMD Ryzen 5 5600X',
          socket: 'AM4',
          cores: 6,
          threads: 12,
          tdpW: 65,
          hasIGPU: false,
          provenance: 'USER_ENTERED',
        },
        ram: {
          sizeGb: 16,
          configuredSpeedMts: 3200,
          type: 'DDR4',
          channels: 2,
          provenance: 'USER_ENTERED',
        },
        gpu: {
          model: 'Sapphire PULSE AMD Radeon RX 6600 8GB',
          vramGb: 8,
          isDedicated: true,
          powerW: 140,
          pcieGen: 'PCIe 4.0',
          provenance: 'USER_ENTERED',
        },
        storage: {
          type: 'SATA SSD',
          capacityGb: 480,
          model: 'Kingston SA400S37480G 480GB SATA',
          provenance: 'USER_ENTERED',
        },
        psu: {
          wattageW: 600,
          rating: '80+ Bronze',
          provenance: 'USER_ENTERED',
        },
        cooling: {
          type: 'Air Tower',
          tdpCapacityW: 150,
          provenance: 'USER_ENTERED',
        },
        chassis: {
          model: 'DeepCool CC560 Mid-Tower ATX',
          formFactor: 'ATX',
          gpuClearanceMm: 370,
          coolerClearanceMm: 163,
          provenance: 'USER_ENTERED',
        },
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 font-mono-tech select-none animate-in fade-in duration-300 py-6">
      {/* HERO SECTION */}
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#0f1422] to-[#090c13] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black tracking-wider uppercase">
              EVO CORE // PUNTO DE ENTRADA
            </span>
            <span className="text-xs text-zinc-500 font-mono">REGLA FUNDAMENTAL: LA PC ES LO PRIMERO</span>

            {agentHealth ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                EVO LOCAL AGENT EN LÍNEA (127.0.0.1:43921)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-zinc-800/80 text-zinc-400 border border-zinc-700 text-xs font-mono">
                LOCAL AGENT: 127.0.0.1:43921
              </span>
            )}
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            ¿QUÉ PC QUERÉS EVALUAR?
          </h1>

          <p className="text-zinc-300 text-xs sm:text-sm font-sans-editorial leading-relaxed">
            Antes de iniciar diagnósticos, reparaciones, pruebas de carga o análisis de cuellos de botella, definí la computadora que entrará al laboratorio. Nada aparece antes de tener una <strong>Machine</strong> activa.
          </p>

          {agentError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-red-300 uppercase tracking-wider">
                    EVO AGENT NO CONECTADO
                  </span>
                  <p className="text-zinc-300 mt-1 font-sans-editorial">{agentError}</p>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    Para capturar el silicio real de Windows, iniciá el servicio ejecutando <code className="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">START-EVO-AGENT.cmd</code>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAgentNotConnectedModal(true)}
                className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 font-bold text-xs uppercase cursor-pointer shrink-0 border border-red-500/40 transition-colors"
              >
                VER GUÍA
              </button>
            </div>
          )}
        </div>

        {/* PRIMARY HERO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* OPTION 1: IMPORTAR ESTA PC (STRICTLY CONNECTS TO EVO LOCAL AGENT) */}
          <div
            onClick={handleImportThisPcFlow}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-5 group shadow-lg relative overflow-hidden ${
              agentHealth
                ? 'border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/30 hover:border-emerald-400'
                : 'border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/30 hover:border-cyan-400'
            }`}
          >
            {agentHealth && (
              <div className="absolute top-0 right-0 left-0 bg-emerald-500/20 border-b border-emerald-500/30 px-3 py-1 flex items-center justify-between text-[10px] font-mono text-emerald-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  EVO LOCAL AGENT ACTIVO (127.0.0.1:43921)
                </span>
                <span className="text-zinc-400">PID: {agentHealth.pid} • v{agentHealth.version}</span>
              </div>
            )}

            <div className={`space-y-3 ${agentHealth ? 'pt-4' : ''}`}>
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${
                    agentHealth
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                  }`}
                >
                  <Radio className={`w-6 h-6 ${isImporting ? 'animate-spin' : ''}`} />
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                    agentHealth
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  {agentHealth ? 'AGENT WMI NATIVO' : 'EVO LOCAL AGENT'}
                </span>
              </div>

              <div>
                <h3
                  className={`font-display font-black text-lg text-white uppercase transition-colors ${
                    agentHealth ? 'group-hover:text-emerald-300' : 'group-hover:text-cyan-300'
                  }`}
                >
                  IMPORTAR ESTA PC
                </h3>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-1">
                  Consulta el servicio local en <strong className="text-white">http://127.0.0.1:43921</strong> y extrae la telemetría real de Windows (Win32_Processor, BaseBoard, BIOS, PhysicalMemory, VideoController, Discos y Red) con procedencia <code className="text-cyan-300">SYSTEM_REPORTED</code> y cero componentes inventados.
                </p>
              </div>
            </div>

            <div
              className={`flex items-center justify-between pt-3 border-t text-xs font-bold ${
                agentHealth ? 'border-emerald-500/30 text-emerald-300' : 'border-cyan-500/30 text-cyan-300'
              }`}
            >
              <span>{isImporting ? 'CONECTANDO CON AGENTE (127.0.0.1:43921)...' : 'IMPORTAR DESDE EVO LOCAL AGENT'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* OPTION 2: CREAR / CARGAR OTRA PC */}
          <div
            onClick={onCreateNewPc}
            className="p-6 rounded-2xl border border-purple-500/40 bg-purple-950/20 hover:bg-purple-950/30 hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between space-y-5 group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  CONSTRUCTOR UNIVERSAL
                </span>
              </div>

              <div>
                <h3 className="font-display font-black text-lg text-white uppercase group-hover:text-purple-300 transition-colors">
                  CREAR / CARGAR OTRA PC
                </h3>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-1">
                  Arma una computadora desde cero o modifica una configuración existente. Seleccioná o escribí cada componente con búsqueda inteligente, autocompletado y catálogo desacoplado.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-500/30 text-xs font-bold text-purple-300">
              <span>ABRIR CONSTRUCTOR EN BLANCO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* QUICK SENSOR RUNTIME DIAGNOSTIC LINK (NON-INTRUSIVE) */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono text-[11px] text-zinc-500">
            ¿Querés ver qué expone tu navegador sin importar hardware completo?
          </span>
          <button
            type="button"
            onClick={handleOpenQuickDetection}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors text-xs"
          >
            <span>QUICK DETECTION (NAVEGADOR / PARCIAL)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SAVED MACHINES SECTION (IF ANY EXIST) */}
      {savedMachines.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-purple-400" />
              <span>MIS COMPUTADORAS GUARDADAS ({savedMachines.length})</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {savedMachines.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectSavedMachine(m)}
                className="p-4 rounded-2xl border border-zinc-800 bg-[#0d1017] hover:border-zinc-700 hover:bg-[#111520] transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs sm:text-sm group-hover:text-purple-300 transition-colors">
                      {m.alias}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {m.updatedAt ? new Date(m.updatedAt).toLocaleDateString() : 'Guardada'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial truncate">
                    {m.cpu?.model} • {m.gpu?.model} • {m.ram?.sizeGb}GB RAM
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDuplicateSaved(m, e)}
                      className="p-1 hover:text-cyan-400 transition-colors"
                      title="Duplicar esta Machine"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSaved(m.id, e)}
                      className="p-1 hover:text-red-400 transition-colors"
                      title="Eliminar de guardadas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-black text-purple-400 group-hover:text-white flex items-center gap-1">
                    <span>EVALUAR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEV / TEST ONLY: FIXTURES DE REFERENCIA (AISLADOS DEL FLUJO REGULAR DE PRODUCCIÓN) */}
      {Boolean((import.meta as any).env?.DEV) && (
        <div className="pt-4 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-display font-black text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                <span>ENTORNO DE PRUEBAS / DEV FIXTURES (SÓLO TEST)</span>
              </span>
              <p className="text-[11px] text-zinc-500 font-sans-editorial">
                Bancos de prueba sintéticos aislados exclusivamente para desarrollo y testing técnico.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDevFixtures(!showDevFixtures)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              {showDevFixtures ? 'OCULTAR FIXTURES DEV' : 'MOSTRAR FIXTURES DEV/TEST'}
            </button>
          </div>

          {showDevFixtures && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4 animate-in fade-in">
              {TEST_FIXTURES.map((fix, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectSavedMachine(fix.machine)}
                  className="p-4 rounded-2xl border border-zinc-800/80 bg-[#0c0f16] hover:border-zinc-700 hover:bg-[#10141f] transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                        {fix.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          fix.tag.includes('INCOMPATIBLE')
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {fix.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans-editorial leading-tight">
                      {fix.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500 font-mono">DEV TEST FIXTURE</span>
                    <span className="font-black text-cyan-400 group-hover:text-white flex items-center gap-1">
                      <span>CARGAR EN CONSTRUCTOR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: EVO AGENT NO CONECTADO */}
      {showAgentNotConnectedModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-red-500/40 bg-[#0f1218] shadow-2xl overflow-hidden font-mono-tech">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-red-500/30 bg-red-950/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                    FALLO DE CONEXIÓN CON SERVICIO LOCAL
                  </span>
                  <h3 className="font-display font-black text-white text-base sm:text-lg uppercase">
                    EVO AGENT NO CONECTADO
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAgentNotConnectedModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Endpoint Local:</span>
                  <code className="text-red-400 font-bold">http://127.0.0.1:43921/health</code>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Estado de Conexión:</span>
                  <span className="text-red-400 font-bold">DESCONECTADO / SIN RESPUESTA</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Regla Epistémica:</span>
                  <span className="text-amber-400">CERO FALLBACKS FALSOS NI MÁQUINAS DEMO</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white font-mono uppercase text-xs">
                  ¿CÓMO INICIAR EVO LOCAL AGENT?
                </h4>
                <p className="text-zinc-300">
                  El agente local es un servicio seguro que lee el hardware de Windows vía CIM/WMI y escucha exclusivamente en <code className="text-cyan-300 font-mono">127.0.0.1:43921</code>.
                </p>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 font-mono text-[11px] space-y-2">
                  <div className="text-zinc-400 font-bold">Opción A (1 Clic en Windows):</div>
                  <div className="text-cyan-300 bg-black/60 p-2 rounded border border-zinc-800 select-all">
                    START-EVO-AGENT.cmd
                  </div>
                  <div className="text-zinc-400 font-bold pt-1">Opción B (Terminal / Node):</div>
                  <div className="text-cyan-300 bg-black/60 p-2 rounded border border-zinc-800 select-all">
                    cd evo-agent && npm run dev
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 font-sans-editorial">
                EVO CORE no inventa componentes ni asume canales de memoria ni fuentes de poder. Si el agente no está activo, podés armar la PC manualmente en el constructor o iniciar el servicio y reintentar.
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#0a0c10] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
              <button
                type="button"
                onClick={() => {
                  setShowAgentNotConnectedModal(false);
                  onCreateNewPc();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                CREAR PC MANUALMENTE
              </button>

              <button
                type="button"
                onClick={async () => {
                  setShowAgentNotConnectedModal(false);
                  await handleImportThisPcFlow();
                }}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isImporting ? 'animate-spin' : ''}`} />
                <span>REINTENTAR CONEXIÓN CON AGENT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUICK DETECTION (NAVEGADOR / PARCIAL) */}
      {showQuickDetectionModal && quickSensorReport && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-[#0f1218] shadow-2xl overflow-hidden font-mono-tech">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#0a0d13] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    TELEMETRÍA PARCIAL DE NAVEGADOR
                  </span>
                  <h3 className="font-display font-black text-white text-base sm:text-lg uppercase">
                    QUICK DETECTION (SÓLO LECTURA)
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickDetectionModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs font-sans-editorial">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                <strong>Nota metodológica:</strong> Esta vista solo muestra las APIs limitadas expuestas por el navegador (concurrency, GPU WebGL). <strong>NO crea una Machine completa</strong>, ya que el navegador no puede leer placa madre, BIOS, RAM física granular ni módulos DIMM individuales.
              </div>

              <div className="grid grid-cols-2 gap-3 text-zinc-300 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">NÚCLEOS LÓGICOS (JS):</span>
                  <span className="text-white font-bold text-sm">
                    {quickSensorReport.cpu.logicalCores > 0 ? `${quickSensorReport.cpu.logicalCores} Threads` : 'No expuesto'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">MEMORIA ESTIMADA (JS):</span>
                  <span className="text-white font-bold text-sm">
                    {quickSensorReport.memory.deviceMemoryGb > 0 ? `${quickSensorReport.memory.deviceMemoryGb} GB` : 'No expuesto'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 col-span-2">
                  <span className="text-zinc-500 block text-[10px]">RENDERIZADOR GPU (WEBGL):</span>
                  <span className="text-white font-bold block truncate">
                    {quickSensorReport.gpu.cleanModel || quickSensorReport.gpu.rawRenderer}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 col-span-2">
                  <span className="text-zinc-500 block text-[10px]">PANTALLA:</span>
                  <span className="text-white font-bold">
                    {quickSensorReport.display.resolution} @ {quickSensorReport.display.refreshHz} Hz
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#0a0c10] flex items-center justify-between font-mono">
              <span className="text-[11px] text-zinc-500">Para importar hardware completo, usá EVO LOCAL AGENT.</span>
              <button
                type="button"
                onClick={() => setShowQuickDetectionModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
