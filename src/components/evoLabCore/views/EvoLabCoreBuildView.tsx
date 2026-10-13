// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — PROFESSIONAL PC BUILDER VIEW
// Principle: "ARMAR / CARGAR PC DEBE FUNCIONAR REALMENTE. UNA SOLA MACHINE."
// Architecture: MachineCompletenessEngine + Impact Analysis + Flexible Build Order
//               + Owned Components ("YA TENGO...") + Compatibility Graph
//               + Workload Targets ("¿PARA QUÉ LA QUERÉS?") + Budget Profile
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  Cpu,
  Tv,
  HardDrive,
  Zap,
  Fan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  ShieldCheck,
  DollarSign,
  Globe,
  Search,
  Box,
  Sliders,
  SlidersHorizontal,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Mic,
  Camera,
  Wifi,
  Trash2,
  Save,
  Activity,
  Info,
  Laptop,
  Server,
  Target,
  Wrench,
  Radio,
} from 'lucide-react';
import {
  BuildComponentItem,
  BuildRequirements,
  BuildPurpose,
  CompatibilityReport,
  CompatibilityCheck,
  ComponentValueRating,
  Machine,
  SubsystemType,
  MachinePeripherals,
  MachineArchetype,
  ComponentOwnershipState,
  WorkloadTarget,
  BudgetProfile,
  ComponentImpactAssessment,
  MachineCompletenessReport,
  MachineDisplayDetailed,
} from '../types';
import { DeterministicCompatibilityEngine } from '../services/compatibilityEngine';
import { HardwareCatalogProvider, HardwareComponent } from '../services/hardwareCatalog';
import { MachineCompletenessEngine } from '../services/machineCompletenessEngine';
import { PRESET_WORKLOAD_TARGETS, WorkloadEngine } from '../services/workloadEngine';
import { EvoHardwareDiscoveryModal } from '../components/EvoHardwareDiscoveryModal';
import { EvoLearnMoreCallout } from '../components/EvoLearnMoreCallout';
import { EvoBuildVisualCanvas } from '../components/EvoBuildVisualCanvas';
import { EvoComponentDetailsModal } from '../components/EvoComponentDetailsModal';
import { EvoImpactAnalysisModal } from '../components/EvoImpactAnalysisModal';
import { EvoCompatibilityGraphModal } from '../components/EvoCompatibilityGraphModal';
import { EvoWorkloadTargetSelector } from '../components/EvoWorkloadTargetSelector';
import { EvoBudgetProfileBar } from '../components/EvoBudgetProfileBar';

interface EvoLabCoreBuildViewProps {
  machine: Machine;
  onNavigateHome: () => void;
  onNavigateToTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
  onChangeMachineRequested?: () => void;
  onSaveMachine?: (updated: Machine) => void;
}

export type BuildStepKey =
  | 'motherboard'
  | 'cpu'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'cooling'
  | 'case'
  | 'fans'
  | 'expansion'
  | 'peripherals';

interface StepDefinition {
  key: BuildStepKey;
  label: string;
  category: SubsystemType;
  icon: React.ReactNode;
  hint: string;
}

const BUILD_STEPS: StepDefinition[] = [
  { key: 'motherboard', label: '1. Motherboard', category: 'motherboard', icon: <Layers className="w-4 h-4" />, hint: 'Placa base (Socket, Chipset, Generación RAM)' },
  { key: 'cpu', label: '2. CPU', category: 'cpu', icon: <Cpu className="w-4 h-4" />, hint: 'Procesador (Núcleos, TDP, Socket, iGPU)' },
  { key: 'ram', label: '3. RAM', category: 'ram', icon: <Sliders className="w-4 h-4" />, hint: 'Módulos de memoria (DDR4 / DDR5, Frecuencia)' },
  { key: 'gpu', label: '4. GPU', category: 'gpu', icon: <Tv className="w-4 h-4" />, hint: 'Placa de video (VRAM, Consumo, Largo, Conectores)' },
  { key: 'storage', label: '5. Storage', category: 'storage', icon: <HardDrive className="w-4 h-4" />, hint: 'Almacenamiento (NVMe M.2 / SATA SSD)' },
  { key: 'psu', label: '6. PSU', category: 'psu', icon: <Zap className="w-4 h-4" />, hint: 'Fuente de poder (Potencia, Certificación, Conectores)' },
  { key: 'cooling', label: '7. Cooling', category: 'cooling', icon: <Fan className="w-4 h-4" />, hint: 'Refrigeración (Aire / Líquida AIO, Capacidad TDP)' },
  { key: 'case', label: '8. Case', category: 'case', icon: <Box className="w-4 h-4" />, hint: 'Gabinete (Clearance GPU, Altura Cooler)' },
  { key: 'fans', label: '9. Case Fans', category: 'fans', icon: <Fan className="w-4 h-4" />, hint: 'Ventilación adicional de chasis' },
  { key: 'expansion', label: '10. Expansion', category: 'expansion', icon: <SlidersHorizontal className="w-4 h-4" />, hint: 'Capturadoras, Wi-Fi PCIe, Sonido' },
  { key: 'peripherals', label: 'Periféricos', category: 'peripherals', icon: <Monitor className="w-4 h-4" />, hint: 'Monitor, Teclado, Mouse, Audio, UPS' },
];

export const EvoLabCoreBuildView: React.FC<EvoLabCoreBuildViewProps> = ({
  machine,
  onNavigateHome,
  onNavigateToTomo,
  onChangeMachineRequested,
  onSaveMachine,
}) => {
  // Primary View Mode: 'BUILDER' vs 'WORKLOADS'
  const [activeTab, setActiveTab] = useState<'BUILDER' | 'WORKLOADS'>('BUILDER');

  // Machine Archetype
  const [archetype, setArchetype] = useState<MachineArchetype>(
    machine.machineType || 'CUSTOM_DESKTOP'
  );

  // Stepper State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentStep = BUILD_STEPS[currentStepIndex];

  // Requirements & Workloads
  const [selectedWorkloads, setSelectedWorkloads] = useState<WorkloadTarget[]>(
    machine.workloadTargets && machine.workloadTargets.length > 0
      ? machine.workloadTargets
      : [PRESET_WORKLOAD_TARGETS[0]]
  );

  // Budget Profile
  const [budget, setBudget] = useState<BudgetProfile>(
    machine.budget || {
      currency: 'USD',
      maxBudget: 1600,
      alreadyOwnedValueExcluded: true,
    }
  );

  // Search and Filters inside step
  const [searchFilter, setSearchFilter] = useState('');
  const [filterOnlyCompatible, setFilterOnlyCompatible] = useState(true);

  // Component selections (Stateful across steps)
  const [selectedMb, setSelectedMb] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedCpu, setSelectedCpu] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedRam, setSelectedRam] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedGpu, setSelectedGpu] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedStorage, setSelectedStorage] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedPsu, setSelectedPsu] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedCooling, setSelectedCooling] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedCase, setSelectedCase] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedFans, setSelectedFans] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedExpansion, setSelectedExpansion] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedPeripherals, setSelectedPeripherals] = useState<Record<string, BuildComponentItem>>({});

  // Display Specifications (Sync with monitor)
  const [displayDetails, setDisplayDetails] = useState<MachineDisplayDetailed | undefined>(
    machine.displayDetailed
  );

  // Modals state
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [discoveryInitialQuery, setDiscoveryInitialQuery] = useState('');
  const [discoveryCategory, setDiscoveryCategory] = useState<SubsystemType | undefined>(undefined);
  const [catalogVersion, setCatalogVersion] = useState(0);

  const [detailsModalItem, setDetailsModalItem] = useState<BuildComponentItem | undefined>(undefined);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  // Impact Analysis state
  const [impactAssessment, setImpactAssessment] = useState<ComponentImpactAssessment | undefined>(undefined);
  const [pendingComponentChange, setPendingComponentChange] = useState<{
    step: BuildStepKey;
    item: BuildComponentItem | undefined;
  } | null>(null);

  // Notification / Alert message
  const [ignitionErrorAlert, setIgnitionErrorAlert] = useState<string | null>(null);

  // Seed with initial machine if available
  useEffect(() => {
    if (machine) {
      if (machine.motherboard?.model && machine.motherboard.model !== 'Motherboard No Especificada') {
        const foundMb = HardwareCatalogProvider.getAllComponents().find(
          (c) => c.category === 'motherboard' && c.model.toLowerCase().includes(machine.motherboard.model.toLowerCase())
        );
        if (foundMb) setSelectedMb(HardwareCatalogProvider.toBuildItem(foundMb));
      }
      if (machine.cpu?.model && machine.cpu.model !== 'CPU No Especificada') {
        const foundCpu = HardwareCatalogProvider.getAllComponents().find(
          (c) => c.category === 'cpu' && c.model.toLowerCase().includes(machine.cpu.model.split('@')[0].trim().toLowerCase())
        );
        if (foundCpu) setSelectedCpu(HardwareCatalogProvider.toBuildItem(foundCpu));
      }
      if (machine.gpu?.model && !machine.gpu.model.includes('No Especificada')) {
        const foundGpu = HardwareCatalogProvider.getAllComponents().find(
          (c) => c.category === 'gpu' && c.model.toLowerCase().includes(machine.gpu.model.toLowerCase())
        );
        if (foundGpu) setSelectedGpu(HardwareCatalogProvider.toBuildItem(foundGpu));
      }
      if (machine.ram?.sizeGb) {
        const foundRam = HardwareCatalogProvider.getAllComponents().find(
          (c) => c.category === 'ram' && c.specsSummary.includes(`${machine.ram.sizeGb}GB`)
        );
        if (foundRam) setSelectedRam(HardwareCatalogProvider.toBuildItem(foundRam));
      }
      if (machine.storage?.model) {
        const foundSsd = HardwareCatalogProvider.getAllComponents().find(
          (c) => c.category === 'storage' && c.model.toLowerCase().includes(machine.storage.model!.toLowerCase())
        );
        if (foundSsd) setSelectedStorage(HardwareCatalogProvider.toBuildItem(foundSsd));
      }
    }
  }, []);

  // Listen to catalog updates
  useEffect(() => {
    const handleCatalogUpdate = () => setCatalogVersion((v) => v + 1);
    window.addEventListener('evo_catalog_updated', handleCatalogUpdate);
    return () => window.removeEventListener('evo_catalog_updated', handleCatalogUpdate);
  }, []);

  // Real-time deterministic compatibility engine
  const engine = useMemo(() => new DeterministicCompatibilityEngine(), []);

  const currentComponentsMap = useMemo(() => {
    return {
      motherboard: selectedMb,
      cpu: selectedCpu,
      ram: selectedRam,
      gpu: selectedGpu,
      storage: selectedStorage,
      psu: selectedPsu,
      cooling: selectedCooling,
      case: selectedCase,
      fans: selectedFans,
      expansion: selectedExpansion,
      peripherals: selectedPeripherals,
    };
  }, [
    selectedMb,
    selectedCpu,
    selectedRam,
    selectedGpu,
    selectedStorage,
    selectedPsu,
    selectedCooling,
    selectedCase,
    selectedFans,
    selectedExpansion,
    selectedPeripherals,
  ]);

  const compatibility: CompatibilityReport = useMemo(() => {
    return engine.evaluateCompatibility(currentComponentsMap as any);
  }, [engine, currentComponentsMap]);

  // Real-time Machine Completeness Engine
  const completenessReport: MachineCompletenessReport = useMemo(() => {
    return MachineCompletenessEngine.evaluateCompleteness(
      currentComponentsMap,
      archetype,
      selectedWorkloads,
      compatibility
    );
  }, [currentComponentsMap, archetype, selectedWorkloads, compatibility]);

  // All selected components array
  const allSelectedList = useMemo(() => {
    const list: BuildComponentItem[] = [];
    if (selectedMb) list.push(selectedMb);
    if (selectedCpu) list.push(selectedCpu);
    if (selectedRam) list.push(selectedRam);
    if (selectedGpu) list.push(selectedGpu);
    if (selectedStorage) list.push(selectedStorage);
    if (selectedPsu) list.push(selectedPsu);
    if (selectedCooling) list.push(selectedCooling);
    if (selectedCase) list.push(selectedCase);
    if (selectedFans) list.push(selectedFans);
    if (selectedExpansion) list.push(selectedExpansion);
    (Object.values(selectedPeripherals) as BuildComponentItem[]).forEach((p) => list.push(p));
    return list;
  }, [
    selectedMb,
    selectedCpu,
    selectedRam,
    selectedGpu,
    selectedStorage,
    selectedPsu,
    selectedCooling,
    selectedCase,
    selectedFans,
    selectedExpansion,
    selectedPeripherals,
  ]);

  // Cost calculations (Total vs Owned vs To Buy)
  const totalBuildCostUsd = useMemo(() => {
    return allSelectedList.reduce((sum, item) => sum + (item.estimatedPriceUsd || 0), 0);
  }, [allSelectedList]);

  const ownedCostUsd = useMemo(() => {
    return allSelectedList
      .filter((item) => item.ownershipState === 'OWNED')
      .reduce((sum, item) => sum + (item.estimatedPriceUsd || 0), 0);
  }, [allSelectedList]);

  const toBuyCostUsd = Math.max(0, totalBuildCostUsd - ownedCostUsd);

  // Dynamic Candidate Compatibility
  const getCandidateCompatibility = (item: BuildComponentItem): { status: string; label: string } => {
    // 1. Motherboard selected -> check socket on CPU
    if (currentStep.key === 'cpu' && selectedMb) {
      const mbSocket = (selectedMb.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      const cpuSocket = (item.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      if (mbSocket && cpuSocket && mbSocket.toUpperCase() !== cpuSocket.toUpperCase()) {
        return { status: 'INCOMPATIBLE', label: `Incompatible (${cpuSocket} ≠ ${mbSocket})` };
      }
      if (/9800x3d|9950x|9900x/i.test(item.model) && /b650|x670/i.test(selectedMb.model)) {
        return { status: 'COMPATIBLE_AFTER_BIOS_UPDATE', label: 'Requiere BIOS Update' };
      }
      return { status: 'COMPATIBLE', label: 'Socket Compatible' };
    }

    // 2. CPU selected first -> check socket on Motherboard
    if (currentStep.key === 'motherboard' && selectedCpu) {
      const cpuSocket = (selectedCpu.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      const mbSocket = (item.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      if (cpuSocket && mbSocket && cpuSocket.toUpperCase() !== mbSocket.toUpperCase()) {
        return { status: 'INCOMPATIBLE', label: `Socket Incompatible (${mbSocket} ≠ ${cpuSocket})` };
      }
      return { status: 'COMPATIBLE', label: 'Socket Compatible' };
    }

    // 3. Motherboard selected -> check RAM generation
    if (currentStep.key === 'ram' && selectedMb) {
      const mbIsDdr5 = selectedMb.specsSummary.includes('DDR5');
      const mbIsDdr4 = selectedMb.specsSummary.includes('DDR4');
      const ramIsDdr5 = item.specsSummary.includes('DDR5');
      const ramIsDdr4 = item.specsSummary.includes('DDR4');
      if (mbIsDdr5 && ramIsDdr4) return { status: 'INCOMPATIBLE', label: 'Incompatible (Placa DDR5 ≠ Módulo DDR4)' };
      if (mbIsDdr4 && ramIsDdr5) return { status: 'INCOMPATIBLE', label: 'Incompatible (Placa DDR4 ≠ Módulo DDR5)' };
      return { status: 'COMPATIBLE', label: 'DDR Compatible' };
    }

    // 4. Case selected first -> check GPU length clearance
    if (currentStep.key === 'gpu' && selectedCase) {
      const caseClearanceMatch = selectedCase.specsSummary.match(/Max\s*GPU\s*:\s*(\d+)\s*mm/i);
      const gpuLengthMatch = item.specsSummary.match(/Largo\s*:\s*(\d+)\s*mm/i);
      if (caseClearanceMatch && gpuLengthMatch) {
        const clearanceMm = parseInt(caseClearanceMatch[1], 10);
        const lengthMm = parseInt(gpuLengthMatch[1], 10);
        if (lengthMm > clearanceMm) {
          return { status: 'INCOMPATIBLE', label: `Excede Gabinete (${lengthMm}mm > ${clearanceMm}mm)` };
        }
      }
    }

    // 5. Case selected first -> check Cooler height clearance
    if (currentStep.key === 'cooling' && selectedCase) {
      const caseClearanceMatch = selectedCase.specsSummary.match(/Max\s*Cooler\s*CPU\s*:\s*(\d+)\s*mm/i);
      const coolerHeightMatch = item.specsSummary.match(/Altura\s*:\s*(\d+)\s*mm/i);
      if (caseClearanceMatch && coolerHeightMatch) {
        const clearanceMm = parseInt(caseClearanceMatch[1], 10);
        const heightMm = parseInt(coolerHeightMatch[1], 10);
        if (heightMm > clearanceMm) {
          return { status: 'INCOMPATIBLE', label: `Excede Altura (${heightMm}mm > ${clearanceMm}mm)` };
        }
      }
    }

    return { status: 'COMPATIBLE', label: 'Compatible' };
  };

  // Filtered available items for active step
  const availableItemsForStep = useMemo(() => {
    const items = HardwareCatalogProvider.getBuildItemsByCategory(currentStep.category);
    let filtered = items;

    // Search query filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      filtered = filtered.filter(
        (i) =>
          i.model.toLowerCase().includes(q) ||
          i.specsSummary.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          (i.partNumber && i.partNumber.toLowerCase().includes(q))
      );
    }

    // Dynamic Filter: Sockets / DDR Match if enabled
    if (filterOnlyCompatible) {
      if (currentStep.key === 'cpu' && selectedMb) {
        const mbSocketMatch = selectedMb.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i);
        if (mbSocketMatch) {
          const socket = mbSocketMatch[1].toUpperCase();
          filtered = filtered.filter((i) => i.specsSummary.toUpperCase().includes(socket));
        }
      } else if (currentStep.key === 'motherboard' && selectedCpu) {
        const cpuSocketMatch = selectedCpu.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i);
        if (cpuSocketMatch) {
          const socket = cpuSocketMatch[1].toUpperCase();
          filtered = filtered.filter((i) => i.specsSummary.toUpperCase().includes(socket));
        }
      } else if (currentStep.key === 'ram' && selectedMb) {
        const isMbDdr5 = selectedMb.specsSummary.toUpperCase().includes('DDR5');
        const isMbDdr4 = selectedMb.specsSummary.toUpperCase().includes('DDR4');
        if (isMbDdr5 && !isMbDdr4) {
          filtered = filtered.filter((i) => i.specsSummary.toUpperCase().includes('DDR5'));
        } else if (isMbDdr4 && !isMbDdr5) {
          filtered = filtered.filter((i) => i.specsSummary.toUpperCase().includes('DDR4'));
        }
      }
    }

    return filtered;
  }, [currentStep, searchFilter, filterOnlyCompatible, selectedMb, selectedCpu, catalogVersion]);

  // Request assignment of a component (with Impact Analysis check)
  const handleRequestAssign = (step: BuildStepKey, item: BuildComponentItem | undefined) => {
    setIgnitionErrorAlert(null);
    const existing = getSelectedForStep(step);

    // If removing or unselecting
    if (!item) {
      executeAssign(step, undefined);
      return;
    }

    // If replacing an existing piece, perform impact assessment
    if (existing && existing.id !== item.id) {
      const assessment = DeterministicCompatibilityEngine.assessImpact(
        item,
        currentStep.category,
        currentComponentsMap as any
      );

      if (assessment.affectedSubsystems.length > 0) {
        setImpactAssessment(assessment);
        setPendingComponentChange({ step, item });
        return;
      }
    }

    // Directly assign if no impact conflicts
    executeAssign(step, item);
  };

  // Execute assignment directly
  const executeAssign = (step: BuildStepKey, item: BuildComponentItem | undefined) => {
    switch (step) {
      case 'motherboard':
        setSelectedMb(item);
        break;
      case 'cpu':
        setSelectedCpu(item);
        break;
      case 'ram':
        setSelectedRam(item);
        break;
      case 'gpu':
        setSelectedGpu(item);
        break;
      case 'storage':
        setSelectedStorage(item);
        break;
      case 'psu':
        setSelectedPsu(item);
        break;
      case 'cooling':
        setSelectedCooling(item);
        break;
      case 'case':
        setSelectedCase(item);
        break;
      case 'fans':
        setSelectedFans(item);
        break;
      case 'expansion':
        setSelectedExpansion(item);
        break;
      case 'peripherals':
        if (item) {
          setSelectedPeripherals((prev) => ({ ...prev, [item.id]: item }));
          // If it's a monitor, extract details
          if (item.specsSummary.includes('Monitor') || item.model.includes('Monitor') || item.specsSummary.includes('Hz')) {
            const resMatch = item.specsSummary.match(/(\d+x\d+)/);
            const hzMatch = item.specsSummary.match(/(\d+)\s*Hz/i);
            const isOled = item.specsSummary.includes('OLED');
            const isGsync = item.specsSummary.includes('G-SYNC');
            setDisplayDetails({
              model: item.model,
              resolution: resMatch ? resMatch[1] : '2560x1440',
              refreshHz: hzMatch ? parseInt(hzMatch[1], 10) : 144,
              panelType: isOled ? 'OLED' : 'IPS',
              adaptiveSync: isGsync ? 'G-SYNC' : 'FreeSync',
              provenance: 'ESTIMATED',
            });
          }
        }
        break;
    }
  };

  const getSelectedForStep = (step: BuildStepKey): BuildComponentItem | undefined => {
    switch (step) {
      case 'motherboard':
        return selectedMb;
      case 'cpu':
        return selectedCpu;
      case 'ram':
        return selectedRam;
      case 'gpu':
        return selectedGpu;
      case 'storage':
        return selectedStorage;
      case 'psu':
        return selectedPsu;
      case 'cooling':
        return selectedCooling;
      case 'case':
        return selectedCase;
      case 'fans':
        return selectedFans;
      case 'expansion':
        return selectedExpansion;
      default:
        return undefined;
    }
  };

  // Toggle ownership state ("YA TENGO ESTE COMPONENTE")
  const handleToggleOwnershipForStep = (step: BuildStepKey, newState: ComponentOwnershipState) => {
    const current = getSelectedForStep(step);
    if (!current) return;
    const updated: BuildComponentItem = {
      ...current,
      ownershipState: newState,
    };
    executeAssign(step, updated);
  };

  // Open Discovery modal for missing model
  const handleOpenDiscovery = (query: string) => {
    setDiscoveryInitialQuery(query);
    setDiscoveryCategory(currentStep.category);
    setIsDiscoveryModalOpen(true);
  };

  // Incorporate component from Discovery modal
  const handleComponentIncorporated = (comp: HardwareComponent) => {
    const item = HardwareCatalogProvider.toBuildItem(comp);
    executeAssign(currentStep.key, item);
  };

  // Quick Preset Configurations
  const loadPreset = (presetName: string) => {
    const all = HardwareCatalogProvider.getAllComponents();
    if (presetName === 'AM5_GAMING') {
      const mb = all.find((c) => c.id === 'mb-msi-pro-b650-p-wifi');
      const cpu = all.find((c) => c.id === 'cpu-amd-ryzen-7-7800x3d');
      const ram = all.find((c) => c.id === 'ram-corsair-vengeance-32gb-6000-cl30');
      const gpu = all.find((c) => c.id === 'gpu-nvidia-geforce-rtx-4070-super');
      const ssd = all.find((c) => c.id === 'ssd-wd-black-sn770-1tb');
      const psu = all.find((c) => c.id === 'psu-corsair-rm750e-atx3');
      const cool = all.find((c) => c.id === 'cooler-thermalright-peerless-assassin-120-se');
      const kase = all.find((c) => c.id === 'case-corsair-4000d-airflow');

      if (mb) setSelectedMb(HardwareCatalogProvider.toBuildItem(mb));
      if (cpu) setSelectedCpu(HardwareCatalogProvider.toBuildItem(cpu));
      if (ram) setSelectedRam(HardwareCatalogProvider.toBuildItem(ram));
      if (gpu) setSelectedGpu(HardwareCatalogProvider.toBuildItem(gpu));
      if (ssd) setSelectedStorage(HardwareCatalogProvider.toBuildItem(ssd));
      if (psu) setSelectedPsu(HardwareCatalogProvider.toBuildItem(psu));
      if (cool) setSelectedCooling(HardwareCatalogProvider.toBuildItem(cool));
      if (kase) setSelectedCase(HardwareCatalogProvider.toBuildItem(kase));
    } else if (presetName === 'INTEL_BUDGET') {
      const mb = all.find((c) => c.id === 'mb-asus-prime-b760m-a-wifi-d4');
      const cpu = all.find((c) => c.id === 'cpu-intel-core-i5-13400f');
      const ram = all.find((c) => c.id === 'ram-corsair-vengeance-lpx-16gb-3200-cl16');
      const gpu = all.find((c) => c.id === 'gpu-nvidia-geforce-rtx-4060');
      const ssd = all.find((c) => c.id === 'ssd-wd-black-sn770-1tb');
      const psu = all.find((c) => c.id === 'psu-cooler-master-mwe-650-bronze');
      const cool = all.find((c) => c.id === 'cooler-thermalright-peerless-assassin-120-se');
      const kase = all.find((c) => c.id === 'case-asus-prime-ap201');

      if (mb) setSelectedMb(HardwareCatalogProvider.toBuildItem(mb));
      if (cpu) setSelectedCpu(HardwareCatalogProvider.toBuildItem(cpu));
      if (ram) setSelectedRam(HardwareCatalogProvider.toBuildItem(ram));
      if (gpu) setSelectedGpu(HardwareCatalogProvider.toBuildItem(gpu));
      if (ssd) setSelectedStorage(HardwareCatalogProvider.toBuildItem(ssd));
      if (psu) setSelectedPsu(HardwareCatalogProvider.toBuildItem(psu));
      if (cool) setSelectedCooling(HardwareCatalogProvider.toBuildItem(cool));
      if (kase) setSelectedCase(HardwareCatalogProvider.toBuildItem(kase));
    } else if (presetName === 'CLEAR_ALL') {
      setSelectedMb(undefined);
      setSelectedCpu(undefined);
      setSelectedRam(undefined);
      setSelectedGpu(undefined);
      setSelectedStorage(undefined);
      setSelectedPsu(undefined);
      setSelectedCooling(undefined);
      setSelectedCase(undefined);
      setSelectedFans(undefined);
      setSelectedExpansion(undefined);
      setSelectedPeripherals({});
    }
  };

  // Save assembled PC to canonical Machine entity with Completeness Enforcement
  const handleSaveToMachine = () => {
    // Enforcement: Check if ignition is allowed
    if (!completenessReport.isIgnitionAllowed) {
      const blockersText = completenessReport.ignitionBlockers.join(' • ');
      setIgnitionErrorAlert(
        `BLOQUEO TÉCNICO DE ENCENDIDO: ${blockersText || 'La máquina carece de componentes indispensables.'}`
      );
      return;
    }

    const updated: Machine = {
      ...machine,
      alias: selectedCpu && selectedGpu ? `${selectedCpu.model} • ${selectedGpu.model}` : machine.alias,
      machineType: archetype,
      source: 'MANUAL_BUILD',
      updatedAt: new Date().toISOString(),
      overallProvenance: 'ESTIMATED',
      budget,
      workloadTargets: selectedWorkloads,
      motherboard: {
        ...machine.motherboard,
        model: selectedMb?.model || machine.motherboard.model,
        socket: (selectedMb?.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || machine.motherboard.socket,
        replaceability: selectedMb?.replaceability || 'REPLACEABLE',
        provenance: 'ESTIMATED',
      },
      cpu: {
        ...machine.cpu,
        model: selectedCpu?.model || machine.cpu.model,
        socket: (selectedCpu?.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || machine.cpu.socket,
        cores: parseInt((selectedCpu?.specsSummary.match(/(\d+)\s*Cores/i) || [])[1] || '8', 10),
        threads: parseInt((selectedCpu?.specsSummary.match(/(\d+)\s*Threads/i) || [])[1] || '16', 10),
        tdpW: parseInt((selectedCpu?.specsSummary.match(/(\d+)\s*W\s*TDP/i) || [])[1] || '120', 10),
        hasIGPU: !!(selectedCpu?.specsSummary.toLowerCase().includes('igpu') || selectedCpu?.specsSummary.toLowerCase().includes('uhd')),
        replaceability: archetype === 'LAPTOP' ? 'SOLDERED' : selectedCpu?.replaceability || 'REPLACEABLE',
        provenance: 'ESTIMATED',
      },
      ram: {
        ...machine.ram,
        type: selectedRam?.specsSummary.includes('DDR5') ? 'DDR5' : selectedRam?.specsSummary.includes('DDR4') ? 'DDR4' : machine.ram.type,
        sizeGb: parseInt((selectedRam?.specsSummary.match(/(\d+)\s*GB/i) || [])[1] || '32', 10),
        configuredSpeedMts: parseInt((selectedRam?.specsSummary.match(/(\d+)\s*MT\/s/i) || [])[1] || '6000', 10),
        provenance: 'ESTIMATED',
      },
      gpu: {
        ...machine.gpu,
        model: selectedGpu?.model || (selectedCpu?.specsSummary.includes('iGPU') ? 'Gráficos Integrados de CPU' : machine.gpu.model),
        vramGb: parseInt((selectedGpu?.specsSummary.match(/(\d+)\s*GB/i) || [])[1] || '0', 10),
        powerW: parseInt((selectedGpu?.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '0', 10),
        isDedicated: !!selectedGpu,
        provenance: 'ESTIMATED',
      },
      storage: {
        ...machine.storage,
        model: selectedStorage?.model || machine.storage.model,
        capacityGb: parseInt((selectedStorage?.specsSummary.match(/(\d+)\s*TB/i) || [])[1] || '1', 10) * 1000,
        type: selectedStorage?.specsSummary.includes('NVMe') ? 'NVMe M.2' : 'SATA SSD',
        provenance: 'ESTIMATED',
      },
      psu: {
        ...machine.psu,
        wattageW: parseInt((selectedPsu?.specsSummary.match(/(\d+)\s*W/i) || [])[1] || (archetype === 'LAPTOP' ? '180' : '750'), 10),
        rating: selectedPsu?.specsSummary.match(/80\+\s*[\w]+/i)?.[0] || '80+ Gold',
        replaceability: archetype === 'OEM_DESKTOP' ? 'PROPRIETARY' : 'REPLACEABLE',
        provenance: 'ESTIMATED',
      },
      cooling: {
        ...machine.cooling,
        type: selectedCooling?.specsSummary.includes('Líquida') ? 'AIO Liquid 360mm' : 'Air Tower',
        tdpCapacityW: parseInt((selectedCooling?.specsSummary.match(/(\d+)\s*W\s*TDP/i) || [])[1] || '245', 10),
        provenance: 'ESTIMATED',
      },
      chassis: selectedCase
        ? {
            model: selectedCase.model,
            formFactor: selectedCase.specsSummary.includes('Micro-ATX') ? 'Micro-ATX' : 'ATX',
            gpuClearanceMm: parseInt((selectedCase.specsSummary.match(/Max\s*GPU\s*:\s*(\d+)\s*mm/i) || [])[1] || '360', 10),
            coolerClearanceMm: parseInt((selectedCase.specsSummary.match(/Max\s*Cooler\s*CPU\s*:\s*(\d+)\s*mm/i) || [])[1] || '170', 10),
            provenance: 'ESTIMATED',
          }
        : machine.chassis,
      peripherals: {
        ...machine.peripherals,
        ...Object.fromEntries(
          (Object.values(selectedPeripherals) as BuildComponentItem[]).map((p) => [p.subsystem, p.model])
        ),
      },
      displayDetailed: displayDetails || machine.displayDetailed,
    };

    if (onSaveMachine) {
      onSaveMachine(updated);
    }
    onNavigateHome();
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 font-mono-tech select-none">
      {/* TOP HEADER & ARCHETYPE SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0d1017] border border-zinc-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
              MODO ARMADO // PROFESSIONAL PC BUILDER
            </span>

            {/* Archetype Picker */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-[10px]">
              {(
                [
                  { id: 'CUSTOM_DESKTOP', label: 'DESKTOP ATX' },
                  { id: 'OEM_DESKTOP', label: 'OEM PREBUILT' },
                  { id: 'LAPTOP', label: 'NOTEBOOK' },
                  { id: 'MINI_PC', label: 'MINI PC' },
                  { id: 'WORKSTATION', label: 'WORKSTATION' },
                ] as const
              ).map((arch) => (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setArchetype(arch.id as MachineArchetype)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    archetype === arch.id
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {arch.label}
                </button>
              ))}
            </div>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            ARMAR & CARGAR ESPECIFICACIÓN DE COMPUTADORA
          </h1>
          <p className="text-xs text-zinc-400 font-sans-editorial">
            Constructor libre no lineal. Empezá por cualquier componente que ya tengas o desees. Cada elección actualiza la misma Machine en tiempo real.
          </p>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsGraphModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>GRAFO DE COMPATIBILIDAD</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('AM5_GAMING')}
            className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all cursor-pointer"
          >
            PRESET AM5
          </button>
          <button
            type="button"
            onClick={() => loadPreset('INTEL_BUDGET')}
            className="px-3 py-1.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all cursor-pointer"
          >
            PRESET INTEL
          </button>
          <button
            type="button"
            onClick={() => loadPreset('CLEAR_ALL')}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            DESPEJAR
          </button>
        </div>
      </div>

      {/* LIVE BUDGET PROFILE BAR */}
      <EvoBudgetProfileBar
        budget={budget}
        onChangeBudget={setBudget}
        totalBuildCostUsd={totalBuildCostUsd}
        ownedCostUsd={ownedCostUsd}
        toBuyCostUsd={toBuyCostUsd}
      />

      {/* TOP VIEW MODE TOGGLE: [TALLER DE COMPONENTES] vs [¿PARA QUÉ LA QUERÉS? (WORKLOADS)] */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('BUILDER')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'BUILDER'
                ? 'bg-purple-500 text-black shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>TALLER DE COMPONENTES</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('WORKLOADS')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'WORKLOADS'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>¿PARA QUÉ LA QUERÉS? ({selectedWorkloads.length})</span>
          </button>
        </div>

        {/* Machine Completeness Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-mono uppercase hidden sm:inline">
            INTEGRIDAD DE SILICIO:
          </span>
          <span
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
              completenessReport.status === 'COMPLETE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : completenessReport.status === 'MISSING_RECOMMENDED'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-red-500/20 text-red-300 border-red-500/40'
            }`}
          >
            {completenessReport.status}
          </span>
        </div>
      </div>

      {/* IGNITION BLOCKER ALERT BANNER */}
      {ignitionErrorAlert && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 flex items-start justify-between gap-3 animate-in shake">
          <div className="flex items-start gap-2.5">
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs uppercase block">ENCENDIDO RECHAZADO POR SEGURIDAD FÍSICA</span>
              <p className="text-xs text-red-300/90 font-sans-editorial">{ignitionErrorAlert}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIgnitionErrorAlert(null)}
            className="text-red-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            CERRAR
          </button>
        </div>
      )}

      {/* WORKLOADS VIEW */}
      {activeTab === 'WORKLOADS' && (
        <EvoWorkloadTargetSelector
          selectedTargets={selectedWorkloads}
          onToggleTarget={(target) => {
            setSelectedWorkloads((prev) =>
              prev.some((t) => t.id === target.id)
                ? prev.filter((t) => t.id !== target.id)
                : [...prev, target]
            );
          }}
          components={currentComponentsMap}
          compatibility={compatibility}
          display={displayDetails}
        />
      )}

      {/* BUILDER VIEW */}
      {activeTab === 'BUILDER' && (
        <>
          {/* FLEXIBLE BUILD ORDER BANNER: YA TENGO UNA PIEZA */}
          <div className="p-3.5 rounded-2xl bg-[#0f131d] border border-zinc-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>
                <strong>ORDEN LIBRE:</strong> Podés arrancar por cualquier componente.
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="text-zinc-500">Comenzar por:</span>
              <button
                type="button"
                onClick={() => setCurrentStepIndex(3)} // GPU
                className="px-2 py-0.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-700 cursor-pointer"
              >
                GPU ("YA TENGO PLACA")
              </button>
              <button
                type="button"
                onClick={() => setCurrentStepIndex(1)} // CPU
                className="px-2 py-0.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-700 cursor-pointer"
              >
                CPU PRIMERO
              </button>
              <button
                type="button"
                onClick={() => setCurrentStepIndex(7)} // Case
                className="px-2 py-0.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-700 cursor-pointer"
              >
                GABINETE PRIMERO
              </button>
            </div>
          </div>

          {/* Stepper Navigation Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {BUILD_STEPS.map((step, idx) => {
              const isSelected = getSelectedForStep(step.key);
              const isCurrent = currentStepIndex === idx;
              const isPeripherals = step.key === 'peripherals';
              const periphCount = Object.keys(selectedPeripherals).length;
              const isOwned = isSelected?.ownershipState === 'OWNED';

              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setSearchFilter('');
                  }}
                  className={`px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                    isCurrent
                      ? 'border-purple-400 bg-purple-500/20 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      : isSelected || (isPeripherals && periphCount > 0)
                      ? isOwned
                        ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400'
                        : 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span>{step.label}</span>
                  {isSelected ? (
                    isOwned ? (
                      <span className="text-[9px] px-1 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                        TENGO
                      </span>
                    ) : (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )
                  ) : isPeripherals && periphCount > 0 ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-mono">
                      {periphCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Main Grid: Left Panel (Picker & Search) vs Right Panel (Canvas & Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: ACTIVE STEP SELECTOR & DISCOVERY (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
              {/* STEP HEADER & SEARCH / FILTER BAR */}
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                      PASO {currentStepIndex + 1} DE {BUILD_STEPS.length}
                    </span>
                    <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase flex items-center gap-2">
                      <span>{currentStep.icon}</span>
                      <span>{currentStep.label}</span>
                    </h2>
                    <p className="text-xs text-zinc-400 font-sans-editorial">{currentStep.hint}</p>
                  </div>

                  {/* Step Navigation Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentStepIndex === 0}
                      onClick={() => {
                        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                        setSearchFilter('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>ANTERIOR</span>
                    </button>
                    <button
                      type="button"
                      disabled={currentStepIndex === BUILD_STEPS.length - 1}
                      onClick={() => {
                        setCurrentStepIndex((prev) => Math.min(BUILD_STEPS.length - 1, prev + 1));
                        setSearchFilter('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
                    >
                      <span>SIGUIENTE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* MANDATORY RULE BANNER: ¿NO ENCONTRÁS TU MODELO? */}
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-cyan-950/20 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="font-display font-black text-xs sm:text-sm text-cyan-300 uppercase tracking-tight">
                        ¿NO ENCONTRÁS TU MODELO O PART NUMBER?
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">TIER 1 FABRICANTE OFICIAL</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed">
                    El catálogo nunca es un límite. Escribí la marca, modelo o Part Number exacto (ej:{' '}
                    <strong className="text-white">ASUS PRIME B760M-A WIFI D4</strong>,{' '}
                    <strong className="text-white">KF556C40BBAK2-32</strong>,{' '}
                    <strong className="text-white">DeepCool AK620 Digital</strong> o{' '}
                    <strong className="text-white">GV-N5070GAMING OC-12GD</strong>) y EVO AI lo investigará e incorporará con rigor técnico.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Marca, modelo o Part Number exacto..."
                      value={discoveryInitialQuery}
                      onChange={(e) => setDiscoveryInitialQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleOpenDiscovery(discoveryInitialQuery);
                      }}
                      className="flex-1 bg-black/50 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleOpenDiscovery(discoveryInitialQuery)}
                      className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>BUSCAR CON EVO AI</span>
                    </button>
                  </div>
                </div>

                {/* SEARCH AND FILTER TOOLS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Buscar en catálogo de ${currentStep.category}...`}
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400 font-mono"
                    />
                  </div>

                  {/* Dynamic Compatibility Toggle */}
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterOnlyCompatible}
                      onChange={(e) => setFilterOnlyCompatible(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-purple-500 focus:ring-0"
                    />
                    <span>Filtrar solo compatibles con piezas ya elegidas</span>
                  </label>
                </div>
              </div>

              {/* COMPONENT CARDS LIST */}
              <div className="space-y-3">
                {availableItemsForStep.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#0d1017] border border-zinc-800 text-center space-y-3">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                    <h3 className="font-bold text-sm text-white">No hay modelos que coincidan con la búsqueda</h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      Podés incorporar cualquier modelo faltante utilizando el botón de EVO AI arriba.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenDiscovery(searchFilter)}
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all cursor-pointer"
                    >
                      Buscar "{searchFilter}" con EVO AI
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {availableItemsForStep.map((item) => {
                      const isChosen =
                        currentStep.key === 'peripherals'
                          ? !!selectedPeripherals[item.id]
                          : getSelectedForStep(currentStep.key)?.id === item.id;

                      const candidate = getCandidateCompatibility(item);
                      const isOwned = item.ownershipState === 'OWNED';
                      const isBaseModel = item.kind === 'BASE_MODEL';

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 group ${
                            isChosen
                              ? isOwned
                                ? 'border-cyan-400 bg-cyan-950/25 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                : 'border-purple-400 bg-purple-950/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                              : candidate.status === 'INCOMPATIBLE'
                              ? 'border-red-900/50 bg-red-950/10 hover:border-red-700/60 opacity-80'
                              : 'border-zinc-800 bg-[#0d1017] hover:border-zinc-700 hover:bg-[#111520]'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-bold text-white text-xs sm:text-sm group-hover:text-purple-300 transition-colors block">
                                  {item.model}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono mt-0.5">
                                  {isBaseModel ? (
                                    <span className="text-amber-400">BASE MODEL</span>
                                  ) : (
                                    <span>EXACT SKU</span>
                                  )}
                                  {item.revision && <span>• Rev {item.revision}</span>}
                                  {item.partNumber && <span>• {item.partNumber}</span>}
                                </div>
                              </div>

                              <span className="font-mono text-emerald-400 font-bold text-xs shrink-0">
                                {isOwned
                                  ? 'YA POSEÍDO ($0)'
                                  : item.estimatedPriceUsd === 0
                                  ? 'Sin costo'
                                  : `$${item.estimatedPriceUsd}`}
                              </span>
                            </div>

                            <p className="text-[11px] text-zinc-300 font-sans-editorial leading-tight">
                              {item.specsSummary}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] flex-wrap gap-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded font-bold ${
                                  candidate.status === 'INCOMPATIBLE'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : candidate.status === 'COMPATIBLE_AFTER_BIOS_UPDATE'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {candidate.label}
                              </span>

                              <button
                                type="button"
                                onClick={() => setDetailsModalItem(item)}
                                className="p-1 rounded text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer"
                                title="Ver Ficha Técnica Profesional"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Ownership fast toggle */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRequestAssign(currentStep.key, {
                                    ...item,
                                    ownershipState: isOwned ? 'TO_BUY' : 'OWNED',
                                  });
                                }}
                                className={`px-2 py-0.5 rounded font-bold uppercase cursor-pointer border ${
                                  isChosen && isOwned
                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                                }`}
                                title="Marcar que ya tienes esta pieza física"
                              >
                                {isChosen && isOwned ? 'TENGO ESTA PIEZA' : 'YA LA TENGO'}
                              </button>

                              {/* Select / Deselect Button */}
                              <button
                                type="button"
                                onClick={() => handleRequestAssign(currentStep.key, isChosen ? undefined : item)}
                                className={`font-black flex items-center gap-1 cursor-pointer ${
                                  isChosen ? 'text-purple-400' : 'text-zinc-500 group-hover:text-zinc-300'
                                }`}
                              >
                                {isChosen ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>QUITAR</span>
                                  </>
                                ) : (
                                  <span>ELEGIR</span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME MACHINE INTEGRITY & ACTIONS (4 COLS) */}
            <div className="lg:col-span-4 space-y-5">
              {/* ACTION CARD: GUARDAR PC EN EL LABORATORIO */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#121622] to-[#0d1017] border border-purple-500/40 space-y-4 shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-400 font-black uppercase tracking-wider block">
                      COMPROMISO DE ENTRADA AL LABORATORIO
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {archetype}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-lg text-white uppercase">
                    CONFIRMAR PC EN BANCO
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans-editorial">
                    Guarda esta configuración en la entidad canónica Machine y la enciende en el banco para la prueba baseline.
                  </p>
                </div>

                {/* Price and Power Breakdown */}
                <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Costo Total Máquina:</span>
                    <span className="font-mono text-zinc-300">${totalBuildCostUsd} USD</span>
                  </div>
                  {ownedCostUsd > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Piezas que ya tenés:</span>
                      <span className="font-mono">-${ownedCostUsd} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-zinc-900">
                    <span>A Comprar Real:</span>
                    <span className="text-purple-300 font-mono text-sm">${toBuyCostUsd} USD</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 pt-1 border-t border-zinc-900">
                    <span>Consumo Pico Estimado:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      ~{compatibility.totalPowerDrawW}W
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Margen Fuente (PSU):</span>
                    <span className="font-bold text-zinc-200 font-mono">
                      {compatibility.psuMarginW > 0 ? `+${compatibility.psuMarginW}W` : `${compatibility.psuMarginW}W`}
                    </span>
                  </div>
                </div>

                {/* Completeness Checklist Summary */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-bold uppercase">Estado de Encendido:</span>
                    <span
                      className={`font-mono font-bold uppercase ${
                        completenessReport.isIgnitionAllowed ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {completenessReport.isIgnitionAllowed ? 'HABILITADO PARA ENCENDIDO' : 'BLOQUEADO'}
                    </span>
                  </div>

                  {!completenessReport.isIgnitionAllowed && completenessReport.missingRequired.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-[10px] space-y-1">
                      <span className="font-bold block">Faltan piezas requeridas:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {completenessReport.missingRequired.map((m, idx) => (
                          <li key={idx}>{m.label}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveToMachine}
                  disabled={!completenessReport.isIgnitionAllowed}
                  className="w-full py-3.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR & ENCENDER EN LABORATORIO</span>
                </button>
              </div>

              {/* DYNAMIC COMPATIBILITY REPORT CARD */}
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <h4 className="font-display font-black text-xs uppercase text-white">
                      AUDITORÍA DE COMPATIBILIDAD
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      compatibility.overallStatus === 'COMPATIBLE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : compatibility.overallStatus === 'COMPATIBLE_AFTER_BIOS_UPDATE'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {compatibility.overallStatus}
                  </span>
                </div>

                {/* Checks List */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin text-xs">
                  {compatibility.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className={`p-2.5 rounded-xl border space-y-1 ${
                        chk.status === 'INCOMPATIBLE'
                          ? 'border-red-500/40 bg-red-950/20 text-red-300'
                          : chk.status === 'COMPATIBLE_AFTER_BIOS_UPDATE'
                          ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                          : chk.status === 'WARNING'
                          ? 'border-yellow-500/40 bg-yellow-950/20 text-yellow-300'
                          : 'border-zinc-800 bg-zinc-950/50 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span>{chk.title}</span>
                        <span className="font-mono text-[9px] uppercase">{chk.status}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                        {chk.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIVE SELECTIONS CHECKLIST */}
              <div className="p-4 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-3 shadow-xl text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-400 uppercase text-[10px]">
                    COMPONENTES EN LA MACHINE
                  </span>
                  <span className="text-[10px] text-zinc-500">Mapeo Universal</span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  {BUILD_STEPS.map((s) => {
                    const comp = getSelectedForStep(s.key);
                    if (s.key === 'peripherals') {
                      const pCount = Object.keys(selectedPeripherals).length;
                      return (
                        <div
                          key={s.key}
                          onClick={() => setCurrentStepIndex(10)}
                          className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
                        >
                          <span className="text-zinc-500">{s.label}:</span>
                          <span className={pCount > 0 ? 'text-white truncate max-w-[160px]' : 'text-zinc-600'}>
                            {pCount > 0 ? `${pCount} periférico(s)` : 'Opcional'}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={s.key}
                        onClick={() => {
                          const stepIdx = BUILD_STEPS.findIndex((st) => st.key === s.key);
                          if (stepIdx >= 0) setCurrentStepIndex(stepIdx);
                          if (comp) setDetailsModalItem(comp);
                        }}
                        className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer group"
                      >
                        <span className="text-zinc-500 group-hover:text-purple-300">
                          {s.label.split('.')[1] || s.label}:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {comp?.ownershipState === 'OWNED' && (
                            <span className="text-[8px] px-1 rounded bg-cyan-500/20 text-cyan-300">
                              TENGO
                            </span>
                          )}
                          <span
                            className={`truncate max-w-[150px] ${comp ? 'text-white' : 'text-zinc-600'}`}
                            title={comp?.model}
                          >
                            {comp ? comp.model : 'Sin elegir'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Learn More Reference Callout */}
      <EvoLearnMoreCallout
        reference={{
          tomoId: '01',
          tomoTitle: 'Conocé tu PC // Hardware',
          chapterNumber: '01',
          chapterTitle: 'Arquitectura de Computadoras y Selección de Silicio',
          concept: 'Equilibrio de subsistemas (System Bottleneck Balancing)',
          pedagogicalSummary:
            'Una computadora es un circuito en serie: el rendimiento global está gobernado por el componente más lento. Comprar un CPU de gama ultra con una GPU básica es un desperdicio de capital.',
          actionPrompt: 'APRENDER EN TOMO 01 // ARQUITECTURA',
        }}
        onNavigateToTomo={onNavigateToTomo}
      />

      {/* Universal Discovery Modal */}
      <EvoHardwareDiscoveryModal
        isOpen={isDiscoveryModalOpen}
        onClose={() => setIsDiscoveryModalOpen(false)}
        initialQuery={discoveryInitialQuery}
        categoryFilter={discoveryCategory}
        onComponentIncorporated={handleComponentIncorporated}
      />

      {/* Professional Component Ficha Details Modal */}
      <EvoComponentDetailsModal
        isOpen={!!detailsModalItem}
        onClose={() => setDetailsModalItem(undefined)}
        component={detailsModalItem}
        compatibilityChecks={compatibility.checks}
        onToggleOwnership={(newState) => {
          if (detailsModalItem) {
            handleToggleOwnershipForStep(detailsModalItem.subsystem as BuildStepKey, newState);
            setDetailsModalItem({ ...detailsModalItem, ownershipState: newState });
          }
        }}
        onRemoveComponent={() => {
          if (detailsModalItem) {
            executeAssign(detailsModalItem.subsystem as BuildStepKey, undefined);
            setDetailsModalItem(undefined);
          }
        }}
        onChangeComponent={() => {
          if (detailsModalItem) {
            const stepIdx = BUILD_STEPS.findIndex((st) => st.key === detailsModalItem.subsystem);
            if (stepIdx >= 0) setCurrentStepIndex(stepIdx);
            setDetailsModalItem(undefined);
          }
        }}
      />

      {/* Impact Analysis Modal */}
      <EvoImpactAnalysisModal
        isOpen={!!impactAssessment}
        onClose={() => {
          setImpactAssessment(undefined);
          setPendingComponentChange(null);
        }}
        assessment={impactAssessment}
        onConfirmChange={() => {
          if (pendingComponentChange) {
            executeAssign(pendingComponentChange.step, pendingComponentChange.item);
          }
          setImpactAssessment(undefined);
          setPendingComponentChange(null);
        }}
      />

      {/* Global Compatibility Graph Modal */}
      <EvoCompatibilityGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        components={currentComponentsMap}
        compatibility={compatibility}
      />
    </div>
  );
};
