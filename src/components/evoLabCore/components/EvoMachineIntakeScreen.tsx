// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — INTAKE SCREEN: ¿QUÉ PC QUERÉS EVALUAR?
// Principle: "PRIMERO SE DEFINE LA MACHINE. NADA APARECE ANTES DE TENER UNA COMPUTADORA."
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
} from 'lucide-react';
import { Machine } from '../types';
import { HardwareSensorService } from '../services/hardwareSensorService';
import { MachineAdapter } from '../services/machineAdapter';
import { EvoCaseRepository } from '../services/caseRepository';

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
  const [isSamplingLive, setIsSamplingLive] = useState(false);
  const [savedMachines, setSavedMachines] = useState<Machine[]>([]);

  // Load saved machines from repository / localStorage
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
  }, []);

  const handleLiveDetect = async () => {
    setIsSamplingLive(true);
    try {
      const { machine } = await HardwareSensorService.sampleLiveSilicon();
      onImportThisPc(machine);
    } catch (err) {
      console.error('Sensor live sampling error:', err);
      // Fallback blank machine with detected tag
      const fallback = MachineAdapter.createBlankMachine('PC Detectada (Navegador)');
      fallback.isDetected = true;
      onImportThisPc(fallback);
    } finally {
      setIsSamplingLive(false);
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
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black tracking-wider uppercase">
              EVO CORE // PUNTO DE ENTRADA
            </span>
            <span className="text-xs text-zinc-500 font-mono">REGLA FUNDAMENTAL: LA PC ES LO PRIMERO</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            ¿QUÉ PC QUERÉS EVALUAR?
          </h1>

          <p className="text-zinc-300 text-xs sm:text-sm font-sans-editorial leading-relaxed">
            Antes de iniciar diagnósticos, reparaciones, pruebas de carga o análisis de cuellos de botella, definí la computadora que entrará al laboratorio. Nada aparece antes de tener una <strong>Machine</strong> activa.
          </p>
        </div>

        {/* PRIMARY HERO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* OPTION 1: IMPORTAR ESTA PC */}
          <div
            onClick={handleLiveDetect}
            className="p-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/30 hover:border-cyan-400 transition-all cursor-pointer flex flex-col justify-between space-y-5 group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Radio className={`w-6 h-6 ${isSamplingLive ? 'animate-spin' : ''}`} />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  SENSOR EN VIVO (1 CLIC)
                </span>
              </div>

              <div>
                <h3 className="font-display font-black text-lg text-white uppercase group-hover:text-cyan-300 transition-colors">
                  IMPORTAR ESTA PC
                </h3>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-1">
                  Lee la telemetría real del navegador y procesador físico (núcleos lógicos, memoria, renderizador GPU, resolución de pantalla, red) y abre el constructor para completar lo que Windows no revela (PSU, Cooler, Gabinete).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-cyan-500/30 text-xs font-bold text-cyan-300">
              <span>{isSamplingLive ? 'MUESTREANDO SILICIO...' : 'LEER ESTA COMPUTADORA'}</span>
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

      {/* DEMO FIXTURES (EXPLICITLY LABELED AS REFERENCE TEST MACHINES) */}
      <div className="space-y-3 pt-4 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>CONFIGURACIONES DE PRUEBA // FIXTURES DE REFERENCIA</span>
            </span>
            <p className="text-[11px] text-zinc-500 font-sans-editorial">
              No representan tu PC personal. Sirven para probar el laboratorio con distintos escenarios de silicio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                <span className="text-zinc-500">Demo Fixture</span>
                <span className="font-black text-cyan-400 group-hover:text-white flex items-center gap-1">
                  <span>CARGAR EN CONSTRUCTOR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
