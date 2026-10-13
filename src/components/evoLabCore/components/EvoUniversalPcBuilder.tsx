// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — CONSTRUCTOR UNIVERSAL DE PC
// Principle: "CONSTRUCTOR COMPLETO DONDE EL USUARIO PUEDE SELECCIONAR O ESCRIBIR
//              TODOS LOS ELEMENTOS DE LA COMPUTADORA. NINGÚN COMPONENTE BLOQUEADO."
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Cpu,
  Tv,
  HardDrive,
  Zap,
  Fan,
  Box,
  Sliders,
  SlidersHorizontal,
  Wifi,
  Volume2,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Mic,
  Camera,
  Search,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowRight,
  Save,
  Globe,
  Radio,
  FileCode,
} from 'lucide-react';
import {
  Machine,
  BuildComponentItem,
  CompatibilityReport,
  CompatibilityCheck,
  SubsystemType,
  ComponentOwnershipState,
  ComponentImpactAssessment,
} from '../types';
import { HardwareCatalogProvider, HardwareComponent } from '../services/hardwareCatalog';
import { DeterministicCompatibilityEngine } from '../services/compatibilityEngine';
import { HardwareFuzzyMatcher, TypoSuggestion } from '../services/hardwareFuzzyMatcher';
import { EvoHardwareDiscoveryModal } from './EvoHardwareDiscoveryModal';
import { EvoComponentDetailsModal } from './EvoComponentDetailsModal';
import { EvoImpactAnalysisModal } from './EvoImpactAnalysisModal';
import { EvoCompatibilityGraphModal } from './EvoCompatibilityGraphModal';

interface EvoUniversalPcBuilderProps {
  initialMachine?: Machine;
  onConfirmAndAssemble: (configuredMachine: Machine) => void;
  onCancelToSelectPc: () => void;
}

export type UniversalCategoryKey =
  | 'motherboard'
  | 'cpu'
  | 'gpu'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'cooling'
  | 'case'
  | 'fans'
  | 'bios'
  | 'network'
  | 'audio'
  | 'peripherals'
  | 'expansion';

interface CategoryTabDef {
  key: UniversalCategoryKey;
  label: string;
  group: 'SISTEMA' | 'FIRMWARE' | 'CONECTIVIDAD' | 'PERIFÉRICOS';
  subsystem: SubsystemType;
  icon: React.ReactNode;
}

const CATEGORY_TABS: CategoryTabDef[] = [
  { key: 'motherboard', label: 'Motherboard', group: 'SISTEMA', subsystem: 'motherboard', icon: <Layers className="w-4 h-4" /> },
  { key: 'cpu', label: 'CPU', group: 'SISTEMA', subsystem: 'cpu', icon: <Cpu className="w-4 h-4" /> },
  { key: 'gpu', label: 'GPU / Gráficos', group: 'SISTEMA', subsystem: 'gpu', icon: <Tv className="w-4 h-4" /> },
  { key: 'ram', label: 'Memoria RAM', group: 'SISTEMA', subsystem: 'ram', icon: <Sliders className="w-4 h-4" /> },
  { key: 'storage', label: 'Almacenamiento', group: 'SISTEMA', subsystem: 'storage', icon: <HardDrive className="w-4 h-4" /> },
  { key: 'psu', label: 'Fuente (PSU)', group: 'SISTEMA', subsystem: 'psu', icon: <Zap className="w-4 h-4" /> },
  { key: 'cooling', label: 'Cooler CPU', group: 'SISTEMA', subsystem: 'cooling', icon: <Fan className="w-4 h-4" /> },
  { key: 'case', label: 'Gabinete (Case)', group: 'SISTEMA', subsystem: 'case', icon: <Box className="w-4 h-4" /> },
  { key: 'fans', label: 'Ventiladores Fans', group: 'SISTEMA', subsystem: 'fans', icon: <Fan className="w-4 h-4" /> },
  { key: 'bios', label: 'Motherboard BIOS', group: 'FIRMWARE', subsystem: 'motherboard', icon: <FileCode className="w-4 h-4" /> },
  { key: 'network', label: 'Red (Ethernet/Wi-Fi)', group: 'CONECTIVIDAD', subsystem: 'peripherals', icon: <Wifi className="w-4 h-4" /> },
  { key: 'audio', label: 'Audio / DAC', group: 'CONECTIVIDAD', subsystem: 'peripherals', icon: <Volume2 className="w-4 h-4" /> },
  { key: 'peripherals', label: 'Monitor & Periféricos', group: 'PERIFÉRICOS', subsystem: 'peripherals', icon: <Monitor className="w-4 h-4" /> },
  { key: 'expansion', label: 'Tarjetas de Expansión', group: 'PERIFÉRICOS', subsystem: 'expansion', icon: <SlidersHorizontal className="w-4 h-4" /> },
];

export const EvoUniversalPcBuilder: React.FC<EvoUniversalPcBuilderProps> = ({
  initialMachine,
  onConfirmAndAssemble,
  onCancelToSelectPc,
}) => {
  const [activeCategoryKey, setActiveCategoryKey] = useState<UniversalCategoryKey>('motherboard');
  const activeTabDef = CATEGORY_TABS.find((t) => t.key === activeCategoryKey) || CATEGORY_TABS[0];

  // Search, filter, and typo states
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllIncompatible, setShowAllIncompatible] = useState(false);
  const [typoSuggestion, setTypoSuggestion] = useState<TypoSuggestion | null>(null);

  // Manual Component Input Form toggle
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualModel, setManualModel] = useState('');
  const [manualMfr, setManualMfr] = useState('');
  const [manualSocket, setManualSocket] = useState('UNKNOWN');
  const [manualSpecs, setManualSpecs] = useState('');

  // Modals state
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [discoveryQuery, setDiscoveryQuery] = useState('');
  const [detailsModalItem, setDetailsModalItem] = useState<BuildComponentItem | undefined>(undefined);
  const [impactAssessment, setImpactAssessment] = useState<ComponentImpactAssessment | undefined>(undefined);
  const [pendingChange, setPendingChange] = useState<{ key: UniversalCategoryKey; item: BuildComponentItem | undefined } | null>(null);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  // Machine Hardware State
  const [machineAlias, setMachineAlias] = useState(initialMachine?.alias || 'PC Personalizada');

  // Core Subsystems
  const [selectedMb, setSelectedMb] = useState<BuildComponentItem | undefined>(() => {
    if (initialMachine?.motherboard?.model && initialMachine.motherboard.model !== 'Motherboard No Especificada') {
      const match = HardwareCatalogProvider.getAllComponents().find((c) =>
        c.category === 'motherboard' && c.model.toLowerCase().includes(initialMachine.motherboard.model.toLowerCase())
      );
      if (match) return HardwareCatalogProvider.toBuildItem(match);
      return {
        id: 'mb-custom-init',
        subsystem: 'motherboard',
        model: initialMachine.motherboard.model,
        specsSummary: `Socket: ${initialMachine.motherboard.socket} • ${initialMachine.motherboard.ramType} • ${initialMachine.motherboard.formFactor}`,
        estimatedPriceUsd: 130,
        valueRating: 'BALANCED',
        valueRationale: 'Cargada de especificación inicial.',
      };
    }
    return undefined;
  });

  const [selectedCpu, setSelectedCpu] = useState<BuildComponentItem | undefined>(() => {
    if (initialMachine?.cpu?.model && initialMachine.cpu.model !== 'CPU No Especificada') {
      const match = HardwareCatalogProvider.getAllComponents().find((c) =>
        c.category === 'cpu' && c.model.toLowerCase().includes(initialMachine.cpu.model.split('@')[0].trim().toLowerCase())
      );
      if (match) return HardwareCatalogProvider.toBuildItem(match);
      return {
        id: 'cpu-custom-init',
        subsystem: 'cpu',
        model: initialMachine.cpu.model,
        specsSummary: `Socket: ${initialMachine.cpu.socket} • ${initialMachine.cpu.cores} Cores • ${initialMachine.cpu.tdpW}W TDP`,
        estimatedPriceUsd: 190,
        valueRating: 'BALANCED',
        valueRationale: 'Cargada de especificación inicial.',
      };
    }
    return undefined;
  });

  // Multiple GPUs
  const [selectedGpus, setSelectedGpus] = useState<BuildComponentItem[]>(() => {
    if (initialMachine?.gpu?.model && !initialMachine.gpu.model.includes('No Especificada')) {
      const match = HardwareCatalogProvider.getAllComponents().find((c) =>
        c.category === 'gpu' && c.model.toLowerCase().includes(initialMachine.gpu.model.toLowerCase())
      );
      if (match) return [HardwareCatalogProvider.toBuildItem(match)];
      return [{
        id: 'gpu-custom-init',
        subsystem: 'gpu',
        model: initialMachine.gpu.model,
        specsSummary: `${initialMachine.gpu.vramGb}GB VRAM • ${initialMachine.gpu.powerW}W`,
        estimatedPriceUsd: 300,
        valueRating: 'BALANCED',
        valueRationale: 'Cargada de especificación inicial.',
      }];
    }
    return [];
  });

  // Multiple RAM Modules
  const [ramModules, setRamModules] = useState<{ item: BuildComponentItem; quantity: number }[]>(() => {
    if (initialMachine?.ram?.sizeGb) {
      const match = HardwareCatalogProvider.getAllComponents().find((c) =>
        c.category === 'ram' && c.specsSummary.includes(`${initialMachine.ram.sizeGb}GB`)
      );
      if (match) return [{ item: HardwareCatalogProvider.toBuildItem(match), quantity: 1 }];
      return [{
        item: {
          id: 'ram-custom-init',
          subsystem: 'ram',
          model: `Memoria RAM ${initialMachine.ram.sizeGb}GB ${initialMachine.ram.type}`,
          specsSummary: `${initialMachine.ram.sizeGb}GB • ${initialMachine.ram.type} • ${initialMachine.ram.configuredSpeedMts} MT/s`,
          estimatedPriceUsd: 70,
          valueRating: 'BALANCED',
          valueRationale: 'Cargada de especificación inicial.',
        },
        quantity: 1,
      }];
    }
    return [];
  });

  // Multiple Storage Drives
  const [storageDrives, setStorageDrives] = useState<BuildComponentItem[]>(() => {
    if (initialMachine?.storage?.model) {
      const match = HardwareCatalogProvider.getAllComponents().find((c) =>
        c.category === 'storage' && c.model.toLowerCase().includes(initialMachine.storage.model!.toLowerCase())
      );
      if (match) return [HardwareCatalogProvider.toBuildItem(match)];
      return [{
        id: 'storage-custom-init',
        subsystem: 'storage',
        model: initialMachine.storage.model,
        specsSummary: `${initialMachine.storage.capacityGb}GB • ${initialMachine.storage.type}`,
        estimatedPriceUsd: 80,
        valueRating: 'BALANCED',
        valueRationale: 'Cargada de especificación inicial.',
      }];
    }
    return [];
  });

  // PSU, Cooling, Case
  const [selectedPsu, setSelectedPsu] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedCooling, setSelectedCooling] = useState<BuildComponentItem | undefined>(undefined);
  const [selectedCase, setSelectedCase] = useState<BuildComponentItem | undefined>(undefined);

  // Fans (Count + model)
  const [fanItem, setFanItem] = useState<BuildComponentItem | undefined>(undefined);
  const [fanQuantity, setFanQuantity] = useState<number>(3);

  // Firmware BIOS
  const [biosVersion, setBiosVersion] = useState<string>(initialMachine?.bios?.version || 'F.24 (Oficial)');
  const [biosDate, setBiosDate] = useState<string>(initialMachine?.bios?.releaseDate || '2024-08-15');
  const [biosUefi, setBiosUefi] = useState<boolean>(true);

  // Network & Audio
  const [ethernetModel, setEthernetModel] = useState<string>(initialMachine?.network?.ethernet?.[0] || 'Realtek RTL8125 2.5 GbE');
  const [wifiModel, setWifiModel] = useState<string>(initialMachine?.network?.wifi || 'Intel Wi-Fi 6E AX210 160MHz');
  const [audioModel, setAudioModel] = useState<string>(initialMachine?.audio?.integrated || 'Realtek ALC897 High Definition Audio');

  // Monitors (Array!)
  const [monitorsList, setMonitorsList] = useState<{ model: string; resolution: string; refreshHz: number; adaptiveSync: string }[]>([
    {
      model: initialMachine?.displayDetailed?.model || 'Monitor Gaming 24" 1080p 144Hz',
      resolution: initialMachine?.displayDetailed?.resolution || '1920x1080',
      refreshHz: initialMachine?.displayDetailed?.refreshHz || 144,
      adaptiveSync: initialMachine?.displayDetailed?.adaptiveSync || 'FreeSync',
    },
  ]);

  // Peripherals
  const [selectedPeripherals, setSelectedPeripherals] = useState<Record<string, BuildComponentItem>>({});

  // Dynamic compatibility evaluation
  const engine = useMemo(() => new DeterministicCompatibilityEngine(), []);

  const componentsForCompatibility = useMemo(() => {
    return {
      motherboard: selectedMb,
      cpu: selectedCpu,
      ram: ramModules[0]?.item,
      gpu: selectedGpus[0],
      storage: storageDrives[0],
      psu: selectedPsu,
      cooling: selectedCooling,
      case: selectedCase,
      fans: fanItem,
      expansion: undefined,
      peripherals: selectedPeripherals,
    };
  }, [selectedMb, selectedCpu, ramModules, selectedGpus, storageDrives, selectedPsu, selectedCooling, selectedCase, fanItem, selectedPeripherals]);

  const compatibility: CompatibilityReport = useMemo(() => {
    return engine.evaluateCompatibility(componentsForCompatibility as any);
  }, [engine, componentsForCompatibility]);

  // Handle Search Input Change with Typo Checking
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 3) {
      const suggestion = HardwareFuzzyMatcher.detectTypoAndSuggest(val, activeTabDef.subsystem);
      setTypoSuggestion(suggestion);
    } else {
      setTypoSuggestion(null);
    }
  };

  // Get catalog items for current category tab
  const catalogItemsForCurrentCategory = useMemo(() => {
    let items = HardwareCatalogProvider.getBuildItemsByCategory(activeTabDef.subsystem);

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.model.toLowerCase().includes(q) ||
          i.specsSummary.toLowerCase().includes(q) ||
          (i.partNumber && i.partNumber.toLowerCase().includes(q)) ||
          i.manufacturer?.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeTabDef, searchQuery]);

  // Check compatibility tag for a candidate item
  const checkCandidateCompatibility = (item: BuildComponentItem): { status: string; label: string; detail: string } => {
    if (activeCategoryKey === 'cpu' && selectedMb) {
      const mbSocket = (selectedMb.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      const cpuSocket = (item.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      if (mbSocket && cpuSocket && mbSocket.toUpperCase() !== cpuSocket.toUpperCase()) {
        return {
          status: 'INCOMPATIBLE',
          label: 'INCOMPATIBLE',
          detail: `Socket incompatible: CPU (${cpuSocket}) ≠ Motherboard (${mbSocket}).`,
        };
      }
      if (/9800x3d|9950x|9900x/i.test(item.model) && /b650|x670/i.test(selectedMb.model)) {
        return {
          status: 'COMPATIBLE_AFTER_BIOS_UPDATE',
          label: 'REQUIERE BIOS UPDATE',
          detail: 'Compatible tras actualizar BIOS a AGESA 1.2.0.0 o posterior.',
        };
      }
      return { status: 'COMPATIBLE', label: 'COMPATIBLE', detail: 'Socket nativo verificado.' };
    }

    if (activeCategoryKey === 'motherboard' && selectedCpu) {
      const cpuSocket = (selectedCpu.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      const mbSocket = (item.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || '';
      if (cpuSocket && mbSocket && cpuSocket.toUpperCase() !== mbSocket.toUpperCase()) {
        return {
          status: 'INCOMPATIBLE',
          label: 'INCOMPATIBLE',
          detail: `Socket incompatible: Motherboard (${mbSocket}) ≠ CPU (${cpuSocket}).`,
        };
      }
      return { status: 'COMPATIBLE', label: 'COMPATIBLE', detail: 'Socket nativo verificado.' };
    }

    if (activeCategoryKey === 'ram' && selectedMb) {
      const mbIsDdr5 = selectedMb.specsSummary.includes('DDR5');
      const mbIsDdr4 = selectedMb.specsSummary.includes('DDR4');
      const ramIsDdr5 = item.specsSummary.includes('DDR5');
      const ramIsDdr4 = item.specsSummary.includes('DDR4');
      if (mbIsDdr5 && ramIsDdr4) return { status: 'INCOMPATIBLE', label: 'INCOMPATIBLE', detail: 'Motherboard DDR5 ≠ Memoria DDR4.' };
      if (mbIsDdr4 && ramIsDdr5) return { status: 'INCOMPATIBLE', label: 'INCOMPATIBLE', detail: 'Motherboard DDR4 ≠ Memoria DDR5.' };
      return { status: 'COMPATIBLE', label: 'COMPATIBLE', detail: 'Generación DDR coincidente.' };
    }

    if (activeCategoryKey === 'gpu' && selectedCase) {
      const caseMatch = selectedCase.specsSummary.match(/Max\s*GPU\s*:\s*(\d+)\s*mm/i);
      const gpuMatch = item.specsSummary.match(/Largo\s*:\s*(\d+)\s*mm/i);
      if (caseMatch && gpuMatch) {
        const caseClearance = parseInt(caseMatch[1], 10);
        const gpuLength = parseInt(gpuMatch[1], 10);
        if (gpuLength > caseClearance) {
          return { status: 'INCOMPATIBLE', label: 'INCOMPATIBLE', detail: `Largo de GPU (${gpuLength}mm) excede gabinete (${caseClearance}mm).` };
        }
      }
    }

    return { status: 'COMPATIBLE', label: 'COMPATIBLE', detail: 'Sin advertencias detectadas.' };
  };

  // Add / Assign Component to the machine
  const handleAssignComponent = (item: BuildComponentItem | undefined) => {
    if (!item) {
      // Direct remove
      removeActiveCategoryItem();
      return;
    }

    // Impact assessment if replacing an already existing piece
    let currentOccupant: BuildComponentItem | undefined = undefined;
    if (activeCategoryKey === 'motherboard') currentOccupant = selectedMb;
    else if (activeCategoryKey === 'cpu') currentOccupant = selectedCpu;
    else if (activeCategoryKey === 'case') currentOccupant = selectedCase;

    if (currentOccupant && currentOccupant.id !== item.id) {
      const impact = DeterministicCompatibilityEngine.assessImpact(
        item,
        activeTabDef.subsystem,
        componentsForCompatibility as any
      );
      if (impact.affectedSubsystems.length > 0) {
        setImpactAssessment(impact);
        setPendingChange({ key: activeCategoryKey, item });
        return;
      }
    }

    executeAssignment(activeCategoryKey, item);
  };

  const executeAssignment = (key: UniversalCategoryKey, item: BuildComponentItem | undefined) => {
    switch (key) {
      case 'motherboard':
        setSelectedMb(item);
        break;
      case 'cpu':
        setSelectedCpu(item);
        break;
      case 'gpu':
        if (item) {
          setSelectedGpus((prev) => (prev.some((g) => g.id === item.id) ? prev : [...prev, item]));
        }
        break;
      case 'ram':
        if (item) {
          setRamModules((prev) => {
            const exists = prev.find((m) => m.item.id === item.id);
            if (exists) {
              return prev.map((m) => (m.item.id === item.id ? { ...m, quantity: m.quantity + 1 } : m));
            }
            return [...prev, { item, quantity: 2 }]; // Default 2 sticks
          });
        }
        break;
      case 'storage':
        if (item) {
          setStorageDrives((prev) => (prev.some((s) => s.id === item.id) ? prev : [...prev, item]));
        }
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
        setFanItem(item);
        break;
      case 'peripherals':
        if (item) {
          setSelectedPeripherals((prev) => ({ ...prev, [item.id]: item }));
        }
        break;
    }
  };

  const removeActiveCategoryItem = () => {
    switch (activeCategoryKey) {
      case 'motherboard':
        setSelectedMb(undefined);
        break;
      case 'cpu':
        setSelectedCpu(undefined);
        break;
      case 'psu':
        setSelectedPsu(undefined);
        break;
      case 'cooling':
        setSelectedCooling(undefined);
        break;
      case 'case':
        setSelectedCase(undefined);
        break;
      case 'fans':
        setFanItem(undefined);
        break;
    }
  };

  // Add Manual Component
  const handleSaveManualComponent = () => {
    if (!manualModel.trim()) return;
    const manualItem: BuildComponentItem = {
      id: `manual-${Date.now()}`,
      subsystem: activeTabDef.subsystem,
      model: manualModel.trim(),
      manufacturer: manualMfr.trim() || 'Desconocido',
      specsSummary: manualSpecs.trim() || `Socket: ${manualSocket} • Especificación manual ingresada por el usuario.`,
      estimatedPriceUsd: 100,
      ownershipState: 'USER_ENTERED' as any,
      valueRating: 'BALANCED',
      valueRationale: 'Componente personalizado ingresado manualmente con campos técnicos.',
      sources: ['Ingreso manual por operador'],
    };

    HardwareCatalogProvider.addComponent({
      id: manualItem.id,
      model: manualItem.model,
      manufacturer: manualItem.manufacturer || 'Desconocido',
      category: activeTabDef.subsystem,
      specsSummary: manualItem.specsSummary,
      specifications: { socket: manualSocket },
      aliases: [manualItem.model],
      sources: ['Ingreso manual'],
      confidence: 80,
      status: 'VERIFIED',
      retrievedAt: new Date().toISOString(),
    });

    handleAssignComponent(manualItem);
    setShowManualForm(false);
    setManualModel('');
    setManualMfr('');
    setManualSpecs('');
  };

  // Construct final Machine object and proceed to assembly
  const handleStartLab = () => {
    const totalRamGb = ramModules.reduce((sum, r) => {
      const match = r.item.specsSummary.match(/(\d+)\s*GB/i);
      const singleGb = match ? parseInt(match[1], 10) : 8;
      return sum + singleGb * r.quantity;
    }, 0);

    const primaryGpu = selectedGpus[0];
    const primaryStorage = storageDrives[0];

    const constructedMachine: Machine = {
      id: initialMachine?.id || `MCH-BLD-${Date.now()}`,
      alias: machineAlias.trim() || (selectedCpu ? `${selectedCpu.model} PC` : 'Mi PC Evaluada'),
      isDetected: initialMachine?.isDetected || false,
      source: 'MANUAL_BUILD',
      createdAt: initialMachine?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      overallProvenance: initialMachine?.overallProvenance || 'ESTIMATED',
      motherboard: {
        model: selectedMb?.model || 'Motherboard Genérica',
        socket: (selectedMb?.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || 'UNKNOWN',
        chipset: (selectedMb?.specsSummary.match(/Chipset\s*:\s*([\w\d-]+)/i) || [])[1] || 'B760',
        ramSlots: 4,
        ramType: selectedMb?.specsSummary.includes('DDR5') ? 'DDR5' : 'DDR4',
        pcieGen: 'PCIe 4.0',
        formFactor: selectedMb?.specsSummary.includes('Micro-ATX') ? 'Micro-ATX' : 'ATX',
        provenance: 'ESTIMATED',
      },
      cpu: {
        model: selectedCpu?.model || 'CPU Genérica',
        socket: (selectedCpu?.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i) || [])[1] || 'UNKNOWN',
        cores: parseInt((selectedCpu?.specsSummary.match(/(\d+)\s*Cores/i) || [])[1] || '6', 10),
        threads: parseInt((selectedCpu?.specsSummary.match(/(\d+)\s*Threads/i) || [])[1] || '12', 10),
        tdpW: parseInt((selectedCpu?.specsSummary.match(/(\d+)\s*W\s*TDP/i) || [])[1] || '65', 10),
        hasIGPU: !!(selectedCpu?.specsSummary.toLowerCase().includes('igpu') || selectedCpu?.specsSummary.toLowerCase().includes('uhd')),
        provenance: 'ESTIMATED',
      },
      ram: {
        sizeGb: totalRamGb > 0 ? totalRamGb : 16,
        configuredSpeedMts: 3200,
        type: ramModules[0]?.item.specsSummary.includes('DDR5') ? 'DDR5' : 'DDR4',
        channels: ramModules.length > 1 || (ramModules[0]?.quantity || 1) >= 2 ? 2 : 1,
        provenance: 'ESTIMATED',
      },
      ramModules: ramModules.map((r) => ({
        model: r.item.model,
        sizeGb: parseInt((r.item.specsSummary.match(/(\d+)\s*GB/i) || [])[1] || '8', 10),
        speedMts: parseInt((r.item.specsSummary.match(/(\d+)\s*MT\/s/i) || [])[1] || '3200', 10),
        type: r.item.specsSummary.includes('DDR5') ? 'DDR5' : 'DDR4',
        quantity: r.quantity,
      })),
      gpu: {
        model: primaryGpu?.model || (selectedCpu?.specsSummary.includes('iGPU') ? 'Gráficos Integrados de CPU' : 'GPU No Especificada'),
        vramGb: parseInt((primaryGpu?.specsSummary.match(/(\d+)\s*GB/i) || [])[1] || '0', 10),
        powerW: parseInt((primaryGpu?.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '0', 10),
        isDedicated: !!primaryGpu,
        provenance: 'ESTIMATED',
      },
      gpus: selectedGpus.map((g) => ({
        model: g.model,
        vramGb: parseInt((g.specsSummary.match(/(\d+)\s*GB/i) || [])[1] || '0', 10),
        powerW: parseInt((g.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '0', 10),
        isDedicated: true,
        provenance: 'ESTIMATED',
      })),
      storage: {
        type: primaryStorage?.specsSummary.includes('NVMe') ? 'NVMe M.2' : 'SATA SSD',
        capacityGb: parseInt((primaryStorage?.specsSummary.match(/(\d+)\s*(GB|TB)/i) || [])[1] || '500', 10),
        model: primaryStorage?.model,
        provenance: 'ESTIMATED',
      },
      storageDrives: storageDrives.map((s) => ({
        model: s.model,
        capacityGb: parseInt((s.specsSummary.match(/(\d+)\s*TB/i) || [])[1] || '0', 10) * 1000 || parseInt((s.specsSummary.match(/(\d+)\s*GB/i) || [])[1] || '500', 10),
        type: s.specsSummary.includes('NVMe') ? 'NVMe M.2' : 'SATA SSD',
      })),
      psu: {
        wattageW: parseInt((selectedPsu?.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '650', 10),
        rating: selectedPsu?.specsSummary.match(/80\+\s*[\w]+/i)?.[0] || '80+ Bronze',
        provenance: 'ESTIMATED',
      },
      cooling: {
        type: selectedCooling?.specsSummary.includes('Líquida') ? 'AIO Liquid 360mm' : 'Air Tower',
        tdpCapacityW: parseInt((selectedCooling?.specsSummary.match(/(\d+)\s*W\s*TDP/i) || [])[1] || '180', 10),
        provenance: 'ESTIMATED',
      },
      chassis: selectedCase
        ? {
            model: selectedCase.model,
            formFactor: selectedCase.specsSummary.includes('Micro-ATX') ? 'Micro-ATX' : 'ATX',
            gpuClearanceMm: parseInt((selectedCase.specsSummary.match(/Max\s*GPU\s*:\s*(\d+)\s*mm/i) || [])[1] || '360', 10),
            coolerClearanceMm: parseInt((selectedCase.specsSummary.match(/Max\s*Cooler\s*CPU\s*:\s*(\d+)\s*mm/i) || [])[1] || '165', 10),
            provenance: 'ESTIMATED',
          }
        : undefined,
      fans: fanItem ? { model: fanItem.model, count: fanQuantity, sizeMm: 120, provenance: 'ESTIMATED' } : undefined,
      bios: {
        motherboardModel: selectedMb?.model || 'Placa Base',
        version: biosVersion,
        releaseDate: biosDate,
        uefiMode: biosUefi,
        provenance: 'ESTIMATED',
      },
      network: {
        ethernet: [ethernetModel],
        wifi: wifiModel,
        provenance: 'ESTIMATED',
      },
      audio: {
        integrated: audioModel,
        provenance: 'ESTIMATED',
      },
      monitors: monitorsList,
      peripherals: Object.fromEntries(
        (Object.values(selectedPeripherals) as BuildComponentItem[]).map((p) => [p.subsystem, p.model])
      ),
    };

    onConfirmAndAssemble(constructedMachine);
  };

  return (
    <div className="space-y-6 font-mono-tech select-none animate-in fade-in duration-300 pb-20">
      {/* TOP HEADER */}
      <div className="p-6 rounded-3xl bg-[#0d1017] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              CONSTRUCTOR UNIVERSAL DE PC
            </span>
            <span className="text-xs text-zinc-500 font-mono">ARMAR / CARGAR MACHINE</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={machineAlias}
              onChange={(e) => setMachineAlias(e.target.value)}
              className="bg-transparent border-b border-zinc-700 hover:border-purple-400 focus:border-purple-400 text-xl sm:text-2xl font-display font-black text-white focus:outline-none uppercase"
              placeholder="Nombre de esta Computadora..."
            />
          </div>
          <p className="text-xs text-zinc-400 font-sans-editorial">
            Configuración exhaustiva de silicio, buses, firmware, red, audio y periféricos.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsGraphModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AUDITORÍA & GRAFO</span>
          </button>

          <button
            type="button"
            onClick={onCancelToSelectPc}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            VOLVER A SELECCIÓN
          </button>
        </div>
      </div>

      {/* CATEGORY SELECTOR TABS (GROUPED) */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORY_TABS.map((tab) => {
            const isCurrent = tab.key === activeCategoryKey;
            let isPopulated = false;
            if (tab.key === 'motherboard') isPopulated = !!selectedMb;
            else if (tab.key === 'cpu') isPopulated = !!selectedCpu;
            else if (tab.key === 'gpu') isPopulated = selectedGpus.length > 0;
            else if (tab.key === 'ram') isPopulated = ramModules.length > 0;
            else if (tab.key === 'storage') isPopulated = storageDrives.length > 0;
            else if (tab.key === 'psu') isPopulated = !!selectedPsu;
            else if (tab.key === 'cooling') isPopulated = !!selectedCooling;
            else if (tab.key === 'case') isPopulated = !!selectedCase;
            else if (tab.key === 'fans') isPopulated = !!fanItem;
            else if (tab.key === 'bios') isPopulated = !!biosVersion;
            else if (tab.key === 'network') isPopulated = !!ethernetModel;
            else if (tab.key === 'audio') isPopulated = !!audioModel;
            else if (tab.key === 'peripherals') isPopulated = Object.keys(selectedPeripherals).length > 0 || monitorsList.length > 0;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveCategoryKey(tab.key);
                  setSearchQuery('');
                  setTypoSuggestion(null);
                  setShowManualForm(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                  isCurrent
                    ? 'border-purple-400 bg-purple-500/20 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : isPopulated
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400'
                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {isPopulated && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSHOP LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE CATEGORY SELECTOR & CATALOG / MANUAL (8 COLS) */}
        <div className="lg:col-span-8 space-y-5">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="p-5 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                  CATEGORÍA ACTIVA
                </span>
                <h3 className="text-lg font-display font-black text-white uppercase flex items-center gap-2">
                  <span>{activeTabDef.icon}</span>
                  <span>{activeTabDef.label}</span>
                </h3>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualForm(!showManualForm)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-cyan-400 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {showManualForm ? 'VER CATÁLOGO' : 'INGRESAR MANUALMENTE'}
                </button>
              </div>
            </div>

            {/* MANDATORY BANNER: ¿NO ENCONTRÁS TU MODELO? */}
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
                <strong className="text-white">Kingston SA400S37480G</strong>,{' '}
                <strong className="text-white">ASUS PRIME B760M-A</strong>,{' '}
                <strong className="text-white">KF556C40BBAK2-32</strong>) y EVO AI lo investigará e incorporará con rigor técnico.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Marca, modelo o Part Number exacto..."
                  value={discoveryQuery}
                  onChange={(e) => setDiscoveryQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsDiscoveryOpen(true);
                    }
                  }}
                  className="flex-1 bg-black/50 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setIsDiscoveryOpen(true)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>BUSCAR CON EVO AI</span>
                </button>
              </div>
            </div>

            {/* TYPO CORRECTION CALLOUT */}
            {typoSuggestion && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-center justify-between gap-3 text-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    ¿Quisiste decir <strong className="text-white underline">{typoSuggestion.suggestedText}</strong>?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typoSuggestion.matchedComponent) {
                      handleAssignComponent(HardwareCatalogProvider.toBuildItem(typoSuggestion.matchedComponent));
                    }
                    setSearchQuery(typoSuggestion.suggestedText);
                    setTypoSuggestion(null);
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-500 text-black font-bold text-[11px] hover:bg-amber-400 transition-all cursor-pointer shrink-0"
                >
                  SELECCIONAR ESTE
                </button>
              </div>
            )}

            {/* SEARCH BAR & COMPATIBILITY FILTER TOGGLE */}
            {!showManualForm && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Buscar en catálogo de ${activeTabDef.label}...`}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showAllIncompatible}
                    onChange={(e) => setShowAllIncompatible(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-purple-500 focus:ring-0"
                  />
                  <span>Mostrar todos (incluir incompatibles)</span>
                </label>
              </div>
            )}
          </div>

          {/* MANUAL COMPONENT ENTRY FORM */}
          {showManualForm ? (
            <div className="p-6 rounded-2xl bg-[#0d1017] border border-cyan-500/40 space-y-4 shadow-xl">
              <div className="space-y-1">
                <h4 className="font-display font-black text-sm text-white uppercase">
                  CARGA MANUAL DE COMPONENTE ({activeTabDef.label.toUpperCase()})
                </h4>
                <p className="text-xs text-zinc-400 font-sans-editorial">
                  Si un campo es desconocido, se guardará como <strong>"UNKNOWN"</strong>. Nunca inventamos datos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">Marca / Fabricante:</label>
                  <input
                    type="text"
                    value={manualMfr}
                    onChange={(e) => setManualMfr(e.target.value)}
                    placeholder="ej: ASUS, Gigabyte, Kingston..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[11px]">Modelo exacto / SKU:</label>
                  <input
                    type="text"
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    placeholder="ej: PRIME B760M-A, SA400S37480G..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {(activeCategoryKey === 'motherboard' || activeCategoryKey === 'cpu' || activeCategoryKey === 'cooling') && (
                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[11px]">Socket:</label>
                    <input
                      type="text"
                      value={manualSocket}
                      onChange={(e) => setManualSocket(e.target.value)}
                      placeholder="ej: AM5, LGA1700, AM4..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                )}

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-zinc-400 text-[11px]">Especificaciones técnicas / Resumen:</label>
                  <textarea
                    rows={2}
                    value={manualSpecs}
                    onChange={(e) => setManualSpecs(e.target.value)}
                    placeholder="ej: 32GB DDR5 6000 MT/s CL30 • Form Factor ATX • PCIe 4.0..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  onClick={handleSaveManualComponent}
                  disabled={!manualModel.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40"
                >
                  GUARDAR & ASIGNAR A LA MACHINE
                </button>
              </div>
            </div>
          ) : (
            /* COMPONENT CARDS CATALOG LIST */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {catalogItemsForCurrentCategory.map((item) => {
                  const candidate = checkCandidateCompatibility(item);
                  if (candidate.status === 'INCOMPATIBLE' && !showAllIncompatible && !searchQuery.trim()) {
                    return null;
                  }

                  let isChosen = false;
                  if (activeCategoryKey === 'motherboard') isChosen = selectedMb?.id === item.id;
                  else if (activeCategoryKey === 'cpu') isChosen = selectedCpu?.id === item.id;
                  else if (activeCategoryKey === 'gpu') isChosen = selectedGpus.some((g) => g.id === item.id);
                  else if (activeCategoryKey === 'ram') isChosen = ramModules.some((m) => m.item.id === item.id);
                  else if (activeCategoryKey === 'storage') isChosen = storageDrives.some((s) => s.id === item.id);
                  else if (activeCategoryKey === 'psu') isChosen = selectedPsu?.id === item.id;
                  else if (activeCategoryKey === 'cooling') isChosen = selectedCooling?.id === item.id;
                  else if (activeCategoryKey === 'case') isChosen = selectedCase?.id === item.id;
                  else if (activeCategoryKey === 'fans') isChosen = fanItem?.id === item.id;
                  else if (activeCategoryKey === 'peripherals') isChosen = !!selectedPeripherals[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 group ${
                        isChosen
                          ? 'border-purple-400 bg-purple-950/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : candidate.status === 'INCOMPATIBLE'
                          ? 'border-red-900/60 bg-red-950/15 hover:border-red-700'
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
                              <span>{item.manufacturer || 'Oficial'}</span>
                              {item.partNumber && <span>• {item.partNumber}</span>}
                              {item.revision && <span>• Rev {item.revision}</span>}
                            </div>
                          </div>

                          <span className="font-mono text-emerald-400 font-bold text-xs shrink-0">
                            {item.estimatedPriceUsd === 0 ? 'Sin costo' : `$${item.estimatedPriceUsd}`}
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
                            title={candidate.detail}
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

                        <button
                          type="button"
                          onClick={() => handleAssignComponent(isChosen ? undefined : item)}
                          className={`font-black flex items-center gap-1 cursor-pointer px-3 py-1 rounded-lg ${
                            isChosen
                              ? 'bg-purple-500 text-black'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {isChosen ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>SELECCIONADO</span>
                            </>
                          ) : (
                            <span>ELEGIR ESTE</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PC EN CONSTRUCCIÓN (REAL-TIME STATUS & SUMMARY) (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          {/* PRIMARY CALL TO ACTION: INICIAR LABORATORIO CON ESTA PC */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141926] to-[#0c0f16] border border-purple-500/40 space-y-4 shadow-2xl">
            <div>
              <span className="text-[10px] text-purple-400 font-black uppercase tracking-wider block">
                COMPROMISO DE ARQUITECTURA
              </span>
              <h3 className="font-display font-black text-lg text-white uppercase">
                INICIAR LABORATORIO CON ESTA PC
              </h3>
              <p className="text-xs text-zinc-400 font-sans-editorial">
                Guarda la Machine, valida circuitos, ejecuta el armado visual determinista y abre el laboratorio pericial.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Estado de Circuitos:</span>
                <span
                  className={`font-bold uppercase ${
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
              <div className="flex justify-between text-zinc-400">
                <span>Consumo Pico:</span>
                <span className="text-amber-400 font-bold">~{compatibility.totalPowerDrawW}W</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Margen Fuente:</span>
                <span className="text-zinc-200">{compatibility.psuMarginW}W</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartLab}
              className="w-full py-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.35)]"
            >
              <Save className="w-4 h-4" />
              <span>INICIAR LABORATORIO CON ESTA PC</span>
            </button>
          </div>

          {/* REAL-TIME STATUS CHECKLIST: PC EN CONSTRUCCIÓN */}
          <div className="p-5 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-3 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-display font-black text-xs text-white uppercase tracking-wider">
                PC EN CONSTRUCCIÓN
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Estado en Vivo</span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              {/* Motherboard */}
              <div
                onClick={() => setActiveCategoryKey('motherboard')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">Motherboard:</span>
                <span className={`truncate max-w-[170px] ${selectedMb ? 'text-white' : 'text-zinc-600'}`}>
                  {selectedMb ? `✅ ${selectedMb.model}` : '⚠ Sin elegir'}
                </span>
              </div>

              {/* CPU */}
              <div
                onClick={() => setActiveCategoryKey('cpu')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">CPU:</span>
                <span className={`truncate max-w-[170px] ${selectedCpu ? 'text-white' : 'text-zinc-600'}`}>
                  {selectedCpu ? `✅ ${selectedCpu.model}` : '⚠ Sin elegir'}
                </span>
              </div>

              {/* RAM */}
              <div
                onClick={() => setActiveCategoryKey('ram')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">RAM:</span>
                <span className={`truncate max-w-[170px] ${ramModules.length > 0 ? 'text-white' : 'text-zinc-600'}`}>
                  {ramModules.length > 0
                    ? `✅ ${ramModules.map((m) => `${m.quantity}× ${m.item.model}`).join(', ')}`
                    : '⚠ Sin elegir'}
                </span>
              </div>

              {/* GPU */}
              <div
                onClick={() => setActiveCategoryKey('gpu')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">GPU:</span>
                <span className={`truncate max-w-[170px] ${selectedGpus.length > 0 ? 'text-white' : 'text-zinc-600'}`}>
                  {selectedGpus.length > 0
                    ? `✅ ${selectedGpus.map((g) => g.model).join(', ')}`
                    : selectedCpu?.specsSummary.includes('iGPU')
                    ? '✅ iGPU Integrada'
                    : '⚠ Sin elegir'}
                </span>
              </div>

              {/* Storage */}
              <div
                onClick={() => setActiveCategoryKey('storage')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">Storage:</span>
                <span className={`truncate max-w-[170px] ${storageDrives.length > 0 ? 'text-white' : 'text-zinc-600'}`}>
                  {storageDrives.length > 0
                    ? `✅ ${storageDrives.map((s) => s.model).join(', ')}`
                    : '⚠ Sin elegir'}
                </span>
              </div>

              {/* PSU */}
              <div
                onClick={() => setActiveCategoryKey('psu')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">PSU:</span>
                <span className={`truncate max-w-[170px] ${selectedPsu ? 'text-white' : 'text-zinc-600'}`}>
                  {selectedPsu ? `✅ ${selectedPsu.model}` : '⚠ Sin fuente'}
                </span>
              </div>

              {/* Cooling */}
              <div
                onClick={() => setActiveCategoryKey('cooling')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">Cooler:</span>
                <span className={`truncate max-w-[170px] ${selectedCooling ? 'text-white' : 'text-zinc-600'}`}>
                  {selectedCooling ? `✅ ${selectedCooling.model}` : '⚠ Sin disipador'}
                </span>
              </div>

              {/* Case */}
              <div
                onClick={() => setActiveCategoryKey('case')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">Case:</span>
                <span className={`truncate max-w-[170px] ${selectedCase ? 'text-white' : 'text-zinc-600'}`}>
                  {selectedCase ? `✅ ${selectedCase.model}` : '⚠ Sin chasis'}
                </span>
              </div>

              {/* Network */}
              <div
                onClick={() => setActiveCategoryKey('network')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">Red:</span>
                <span className="truncate max-w-[170px] text-white">
                  ✅ {ethernetModel.split(' ')[0]} / {wifiModel.split(' ')[0]}
                </span>
              </div>

              {/* Audio */}
              <div
                onClick={() => setActiveCategoryKey('audio')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">Audio:</span>
                <span className="truncate max-w-[170px] text-white">
                  ✅ {audioModel.split(' ')[0]}
                </span>
              </div>

              {/* Fans */}
              <div
                onClick={() => setActiveCategoryKey('fans')}
                className="flex items-center justify-between py-1 border-b border-zinc-900 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">Fans:</span>
                <span className="truncate max-w-[170px] text-zinc-300">
                  {fanItem ? `✅ ${fanQuantity}× ${fanItem.model}` : '⚠ Fans básicos'}
                </span>
              </div>

              {/* Monitor */}
              <div
                onClick={() => setActiveCategoryKey('peripherals')}
                className="flex items-center justify-between py-1 hover:bg-zinc-900/40 px-1 rounded cursor-pointer"
              >
                <span className="text-zinc-400">Monitor:</span>
                <span className="truncate max-w-[170px] text-white">
                  ✅ {monitorsList[0]?.resolution} @ {monitorsList[0]?.refreshHz}Hz
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Modal */}
      <EvoHardwareDiscoveryModal
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
        initialQuery={discoveryQuery}
        categoryFilter={activeTabDef.subsystem}
        onComponentIncorporated={(comp) => {
          const item = HardwareCatalogProvider.toBuildItem(comp);
          handleAssignComponent(item);
        }}
      />

      {/* Component Details Modal */}
      <EvoComponentDetailsModal
        isOpen={!!detailsModalItem}
        onClose={() => setDetailsModalItem(undefined)}
        component={detailsModalItem}
        compatibilityChecks={compatibility.checks}
        onRemoveComponent={() => {
          if (detailsModalItem) {
            handleAssignComponent(undefined);
            setDetailsModalItem(undefined);
          }
        }}
      />

      {/* Impact Analysis Modal */}
      <EvoImpactAnalysisModal
        isOpen={!!impactAssessment}
        onClose={() => {
          setImpactAssessment(undefined);
          setPendingChange(null);
        }}
        assessment={impactAssessment}
        onConfirmChange={() => {
          if (pendingChange) {
            executeAssignment(pendingChange.key, pendingChange.item);
          }
          setImpactAssessment(undefined);
          setPendingChange(null);
        }}
      />

      {/* Global Compatibility Graph Modal */}
      <EvoCompatibilityGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        components={componentsForCompatibility}
        compatibility={compatibility}
      />
    </div>
  );
};
