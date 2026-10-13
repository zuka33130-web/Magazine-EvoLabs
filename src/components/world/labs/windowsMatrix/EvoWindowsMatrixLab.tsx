import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Gauge,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Zap,
  Sparkles,
  Info,
  Server,
  Layers,
  ArrowRight,
  Clock,
  HardDrive,
  Lock,
  Download,
  Copy,
  Check,
  HelpCircle,
  Search,
  X,
  FileText,
  Gamepad2,
  Briefcase,
  Monitor,
  Code2,
  Music,
  AlertOctagon,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import { useEvoOperatingMode } from '../../../../hooks/useEvoOperatingMode';
import { EvoOperatingModeSelector } from '../../../common/EvoOperatingModeSelector';
import { WindowsBootExperienceLab } from './boot/WindowsBootExperienceLab';
import { WindowsInstallExperienceLab } from './install/WindowsInstallExperienceLab';
import { WindowsServicesTelemetryLab } from './services/WindowsServicesTelemetryLab';
import { WindowsFailureRepairLab } from './repair/WindowsFailureRepairLab';
import { EvoWindowsXRayLab } from './EvoWindowsXRayLab';

export interface EvoWindowsMatrixLabProps {
  initialBuild?: 'win10-22h2' | 'win10-ltsc' | 'win11-23h2' | 'win11-24h2';
  initialSilicon?: 'hybrid' | 'vcache' | 'monolithic';
  initialScenario?: string;
  onNavigateToHardwareBench?: () => void;
  onOpenTomo?: (tomoId: string) => void;
}

// Windows Lifecycle Reference Data (Microsoft Lifecycle Cutoff: 2026-10-03)
export interface WindowsVersionLifecycle {
  id: string;
  name: string;
  codename: string;
  buildNumber: string;
  supportEnd: string;
  supportStatus: 'SOPORTADO' | 'MUY_CERCA_FIN_SOPORTE' | 'FUERA_DE_SOPORTE' | 'SOPORTE_LTSC_ESPECIFICO' | 'CASO_ESPECIAL';
  statusBadge: string;
  badgeColor: string;
  useCase: string;
  observation: string;
  minRamGb: number;
  requiresTpm: boolean;
}

export const MICROSOFT_LIFECYCLE_SNAPSHOT: Record<string, WindowsVersionLifecycle> = {
  'win10-22h2': {
    id: 'win10-22h2',
    name: 'Windows 10 Home/Pro 22H2',
    codename: '22H2 (Vibranium)',
    buildNumber: 'Build 19045',
    supportEnd: '2025-10-14',
    supportStatus: 'FUERA_DE_SOPORTE',
    statusBadge: 'FUERA DE SOPORTE GENERAL',
    badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-600/50',
    useCase: 'Legacy / Compatibilidad histórica en equipos aislados',
    observation: 'Soporte oficial de seguridad finalizado el 14 de octubre de 2025. No recibe correcciones ni parches mensuales.',
    minRamGb: 2,
    requiresTpm: false
  },
  'win10-ltsc': {
    id: 'win10-ltsc',
    name: 'Windows 10 Enterprise LTSC 2021',
    codename: '21H2 LTSC',
    buildNumber: 'Build 19044',
    supportEnd: '2027-01-12 (2032 IoT)',
    supportStatus: 'SOPORTE_LTSC_ESPECIFICO',
    statusBadge: 'SOPORTE LTSC ESPECÍFICO',
    badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-600/50',
    useCase: 'Escenarios de ciclo largo, equipos de bajos recursos o industriales',
    observation: 'Edición Enterprise orientada a estabilidad prolongada sin tienda ni UWP preinstaladas. Licenciamiento y canal de servicio distinto de Home/Pro.',
    minRamGb: 2,
    requiresTpm: false
  },
  'win11-23h2': {
    id: 'win11-23h2',
    name: 'Windows 11 Home/Pro 23H2',
    codename: 'Sun Valley 2',
    buildNumber: 'Build 22631',
    supportEnd: '2025-11-11',
    supportStatus: 'FUERA_DE_SOPORTE',
    statusBadge: 'FUERA DE SOPORTE',
    badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-600/50',
    useCase: 'Sistemas pendientes de actualización a 24H2/25H2',
    observation: 'Soporte general finalizado en noviembre de 2025.',
    minRamGb: 4,
    requiresTpm: true
  },
  'win11-24h2': {
    id: 'win11-24h2',
    name: 'Windows 11 Home/Pro 24H2',
    codename: 'Germanium / Hudson Valley',
    buildNumber: 'Build 26100',
    supportEnd: '2026-10-13',
    supportStatus: 'MUY_CERCA_FIN_SOPORTE',
    statusBadge: 'MUY CERCA DEL FIN DE SOPORTE',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-600/50',
    useCase: 'Compatibilidad x86/ARM64 moderna',
    observation: 'Soporte general finaliza en octubre de 2026. Se sugiere proyectar migración a 25H2.',
    minRamGb: 4,
    requiresTpm: true
  },
  'win11-25h2': {
    id: 'win11-25h2',
    name: 'Windows 11 Home/Pro 25H2',
    codename: '25H2 Feature Update',
    buildNumber: 'Build 26200+',
    supportEnd: '2027-10-12',
    supportStatus: 'SOPORTADO',
    statusBadge: 'VERSIÓN SOPORTADA ACTUALLY',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50',
    useCase: 'Estándar para PC gamer, oficina, creación y desarrollo',
    observation: 'Soporte oficial vigente hasta octubre de 2027.',
    minRamGb: 8,
    requiresTpm: true
  },
  'win11-26h2': {
    id: 'win11-26h2',
    name: 'Windows 11 Home/Pro 26H2',
    codename: '26H2 Update',
    buildNumber: 'Build 27xxx',
    supportEnd: '2028-10-10',
    supportStatus: 'SOPORTADO',
    statusBadge: 'VERSIÓN SOPORTADA ACTUALLY',
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-600/50',
    useCase: 'Hardware moderno validado con drivers del fabricante',
    observation: 'Versión soportada actualmente. Validar disponibilidad de drivers antes de migrar.',
    minRamGb: 8,
    requiresTpm: true
  },
  'win11-26h1': {
    id: 'win11-26h1',
    name: 'Windows 11 26H1 (Copilot+ / Silicon Espećifico)',
    codename: 'Dilithium',
    buildNumber: 'Build 26120+',
    supportEnd: '2028-05-30',
    supportStatus: 'CASO_ESPECIAL',
    statusBadge: 'CASO ESPECIAL / DISPONIBILIDAD DE HARDWARE',
    badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-600/50',
    useCase: 'Equipos con NPU dedicada (>40 TOPS) y arquitecturas ARM64 / Silicon específico',
    observation: 'Rama orientada a hardware específico con NPU. No recomendada como ISO genérica.',
    minRamGb: 16,
    requiresTpm: true
  }
};

export const EvoWindowsMatrixLab: React.FC<EvoWindowsMatrixLabProps> = ({
  initialScenario,
}) => {
  const { mode: evoMode } = useEvoOperatingMode();

  // Active View Tab: 'advisor' (Advisor 3 pasos), 'matrix' (Comparar versiones), 'deep' (Profundizar Labs)
  const [activeTab, setActiveTab] = useState<'advisor' | 'matrix' | 'deep'>(() => {
    if (initialScenario === 'matrix') return 'matrix';
    if (initialScenario === 'advisor') return 'advisor';
    if (['boot', 'install', 'services', 'repair', 'scheduler', 'scheduler-hybrid', 'xray', 'kernel-crash', 'crash-repair', 'bsod', 'diag-bsod-decoder'].includes(initialScenario || '')) {
      return 'deep';
    }
    return 'advisor';
  });

  const [deepLabSubTab, setDeepLabSubTab] = useState<'boot' | 'install' | 'services' | 'repair' | 'scheduler' | 'xray'>(() => {
    if (initialScenario === 'boot') return 'boot';
    if (initialScenario === 'install') return 'install';
    if (initialScenario === 'services') return 'services';
    if (['repair', 'crash-repair', 'bsod', 'diag-bsod-decoder'].includes(initialScenario || '')) return 'repair';
    if (['xray', 'kernel-crash'].includes(initialScenario || '')) return 'xray';
    if (['scheduler', 'scheduler-hybrid'].includes(initialScenario || '')) return 'scheduler';
    return 'scheduler';
  });

  React.useEffect(() => {
    if (!initialScenario) return;
    if (initialScenario === 'matrix') {
      setActiveTab('matrix');
    } else if (initialScenario === 'advisor') {
      setActiveTab('advisor');
    } else if (['boot', 'install', 'services', 'repair', 'scheduler', 'scheduler-hybrid', 'xray', 'kernel-crash', 'crash-repair', 'bsod', 'diag-bsod-decoder'].includes(initialScenario)) {
      setActiveTab('deep');
      if (initialScenario === 'boot') setDeepLabSubTab('boot');
      else if (initialScenario === 'install') setDeepLabSubTab('install');
      else if (initialScenario === 'services') setDeepLabSubTab('services');
      else if (['repair', 'crash-repair', 'bsod', 'diag-bsod-decoder'].includes(initialScenario)) setDeepLabSubTab('repair');
      else if (['xray', 'kernel-crash'].includes(initialScenario)) setDeepLabSubTab('xray');
      else if (['scheduler', 'scheduler-hybrid'].includes(initialScenario)) setDeepLabSubTab('scheduler');
    }
  }, [initialScenario]);

  // Step 1: User Hardware Input
  const [cpuCategory, setCpuCategory] = useState<string>('');
  const [ramAmount, setRamAmount] = useState<string>('');
  const [storageType, setStorageType] = useState<string>('');
  const [tpmStatus, setTpmStatus] = useState<string>('');
  const [secureBoot, setSecureBoot] = useState<string>('');
  const [uefiStatus, setUefiStatus] = useState<string>('');

  // Step 2: Usage Chips
  const [selectedUsages, setSelectedUsages] = useState<string[]>([]);

  // Modals & UI States
  const [showHowToCheckModal, setShowHowToCheckModal] = useState<boolean>(false);
  const [showGlossaryModal, setShowGlossaryModal] = useState<boolean>(false);

  // Analysis Trigger
  const [analyzed, setAnalyzed] = useState<boolean>(false);

  // Toggle usage chips
  const toggleUsage = (id: string) => {
    setSelectedUsages(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  // Scheduler Lab State
  const [schedulerArch, setSchedulerArch] = useState<'hybrid' | 'vcache' | 'monolithic'>('hybrid');
  const [schedulerWorkload, setSchedulerWorkload] = useState<'foreground' | 'app' | 'background' | 'maintenance'>('foreground');
  const [showSchedulerDeepDive, setShowSchedulerDeepDive] = useState<boolean>(false);

  // Missing fields helper
  const missingFields = useMemo(() => {
    const list: string[] = [];
    if (!cpuCategory) list.push('Procesador (CPU)');
    if (!ramAmount) list.push('Memoria RAM');
    if (!storageType) list.push('Almacenamiento (HDD/SSD)');
    if (!tpmStatus) list.push('TPM 2.0');
    if (!secureBoot) list.push('Secure Boot');
    if (!uefiStatus) list.push('Firmware UEFI / BIOS');
    return list;
  }, [cpuCategory, ramAmount, storageType, tpmStatus, secureBoot, uefiStatus]);

  // Confidence Level Calculation
  const confidenceLevel = useMemo(() => {
    if (missingFields.length === 0) return 'DATOS SUFICIENTES';
    if (missingFields.length <= 3) return 'DATOS PARCIALES';
    return 'DATOS INSUFICIENTES';
  }, [missingFields]);

  // Windows 11 Specs Compliance Evaluation
  const win11Compatibility = useMemo(() => {
    if (confidenceLevel !== 'DATOS SUFICIENTES') {
      return { 
        status: 'DATOS INSUFICIENTES', 
        text: `Faltan ingresar datos esenciales: ${missingFields.join(', ')}`, 
        color: 'text-zinc-400 bg-zinc-800' 
      };
    }

    const cpuOk = cpuCategory === 'intel-hybrid' || cpuCategory === 'amd-modern' || cpuCategory === 'quad-standard';
    const ramOk = ramAmount === '8gb' || ramAmount === '16gb' || ramAmount === '32gb';
    const storageOk = storageType === 'ssd-nvme' || storageType === 'ssd-sata';
    const tpmOk = tpmStatus === 'active';
    const uefiOk = uefiStatus === 'uefi';
    const secureBootOk = secureBoot === 'enabled';

    if (cpuOk && ramOk && storageOk && tpmOk && uefiOk && secureBootOk) {
      return { status: 'CUMPLE', text: 'Cumple todos los requisitos de Windows 11 declarados', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-600/50' };
    }

    if (tpmStatus === 'absent' || cpuCategory === 'cpu-legacy' || ramAmount === '4gb' || storageType === 'hdd-legacy') {
      return { status: 'NO CUMPLE', text: 'No cumple requisitos nativos de Windows 11 de origen', color: 'text-rose-300 bg-rose-950/80 border-rose-600/50' };
    }

    return { status: 'NO CUMPLE', text: 'Faltan verificar configuraciones en BIOS/Firmware', color: 'text-amber-300 bg-amber-950/80 border-amber-600/50' };
  }, [confidenceLevel, missingFields, cpuCategory, ramAmount, storageType, tpmStatus, uefiStatus, secureBoot]);

  // Transparent Recommendation Rules
  const recommendationResult = useMemo(() => {
    if (!analyzed) return null;

    if (confidenceLevel !== 'DATOS SUFICIENTES') {
      return {
        bestFit: 'DATOS INSUFICIENTES',
        whyFit: [
          `No se puede determinar la compatibilidad debido a que faltan datos esenciales de hardware:`,
          ...missingFields.map(f => `• Falta ingresar: ${f}`)
        ],
        keepInMind: ['Sin datos de hardware completos no podemos prejuzgar la compatibilidad de forma veraz.'],
        checkBefore: ['Usa el botón "[ ¿DÓNDE VEO MI HARDWARE? ]" para conocer los componentes de tu equipo.'],
        alternative: 'N/A',
        legacyAlert: null
      };
    }

    const isNonCompliant = win11Compatibility.status === 'NO CUMPLE';

    if (isNonCompliant) {
      return {
        bestFit: 'Evaluación Especial Requerida (Hardware limitado para Win 11)',
        whyFit: [
          'Este equipo no cumple los requisitos nativos declarados para Windows 11.',
          'Windows 10 Home/Pro 22H2 ya está FUERA DE SOPORTE oficial desde octubre de 2025.'
        ],
        keepInMind: [
          'Windows 10 Enterprise LTSC 2021 puede ser considerado para escenarios de ciclo largo en hardware antiguo por tener soporte hasta 2027.',
          'No instalar Windows 10 22H2 en equipos conectados a internet sin entender los riesgos de seguridad por falta de parches.'
        ],
        checkBefore: [
          'Verificar si TPM 2.0 y Secure Boot están deshabilitados en BIOS antes de descartar Windows 11.',
          'Revisar si el procesador soporta virtualización e instrucciones SSE4.2.'
        ],
        alternative: 'Windows 10 Enterprise LTSC 2021 (Soporte extendido hasta 2027)',
        legacyAlert: 'AVISO DE SOPORTE: Windows 10 Home/Pro ya no recibe parches mensuales. Evaluar actualización de equipo o LTSC.'
      };
    }

    // Modern Compliant PC
    return {
      bestFit: MICROSOFT_LIFECYCLE_SNAPSHOT['win11-25h2'].name,
      whyFit: [
        'Compatible con el hardware declarado y requisitos de seguridad TPM 2.0 / Secure Boot.',
        'Versión oficialmente soportada por Microsoft hasta octubre de 2027.',
        'Optimizada para software, drivers y juegos modernos.'
      ],
      keepInMind: [
        'Confirmar disponibilidad de drivers oficiales en el sitio web del fabricante.',
        'Windows 11 24H2 está muy cerca de finalizar su ciclo de soporte general (octubre 2026).'
      ],
      checkBefore: [
        'Validar compatibilidad de aplicaciones de trabajo o antivirus antes de actualizar.',
        'Realizar respaldo de datos antes de una instalación limpia.'
      ],
      alternative: MICROSOFT_LIFECYCLE_SNAPSHOT['win11-26h2'].name + ' (Si los drivers ya están validados por el fabricante)',
      legacyAlert: null
    };
  }, [analyzed, confidenceLevel, missingFields, win11Compatibility]);

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-6 space-y-6 font-sans">
      
      {/* 1. NUEVO ENCABEZADO */}
      <div className="border border-cyan-500/30 bg-zinc-900/90 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                EVO WINDOWS ADVISOR
              </span>
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                SNAPSHOT LIFECYCLE: 2026-10-03
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              ¿QUÉ WINDOWS ME CONVIENE PARA MI PC?
            </h1>
            <p className="text-zinc-300 text-sm max-w-3xl leading-relaxed">
              Analizamos compatibilidad, soporte, hardware y uso. No elegimos por moda: elegimos por evidencia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <EvoOperatingModeSelector />
            <button
              onClick={() => setShowGlossaryModal(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              EXPLICÁMELO SIMPLE
            </button>
          </div>
        </div>

        {/* MÓDULOS TÉCNICOS SECUNDARIOS */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-zinc-800">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'advisor'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'bg-zinc-800/60 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            EVALUACIÓN DE MI PC
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'bg-zinc-800/60 text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            MATRIZ DE VERSIONES & LIFECYCLE
          </button>

          <button
            onClick={() => setActiveTab('deep')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'deep'
                ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                : 'bg-zinc-800/60 text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            [ PROFUNDIZAR: PLANIFICADOR & SILICIO ]
          </button>
        </div>
      </div>

      {/* 2. EXPERIENCIA EN 3 PASOS */}
      {activeTab === 'advisor' && (
        <div className="space-y-8">
          
          {/* PASO 1: TU PC */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-cyan-500 text-zinc-950 font-mono font-black flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">PASO 1: TU PC</h2>
                  <p className="text-xs text-zinc-400">Ingresa los componentes o datos conocidos de tu equipo</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  ORIGEN: ENTRADA DEL USUARIO
                </span>
                <button
                  onClick={() => setShowHowToCheckModal(true)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border border-zinc-700 rounded text-xs font-mono flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  [ ¿DÓNDE VEO MI HARDWARE? ]
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* CPU */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300">Procesador (CPU)</label>
                <select
                  value={cpuCategory}
                  onChange={(e) => setCpuCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 text-zinc-100 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="intel-hybrid">Intel Moderno / Híbrido (12ª Gen+)</option>
                  <option value="amd-modern">AMD Moderno (Ryzen 3000-9000)</option>
                  <option value="quad-standard">Intel 8ª-11ª Gen / Ryzen 1000-2000</option>
                  <option value="cpu-legacy">CPU Monolítica / Legacy (&lt; 2018)</option>
                  <option value="unknown">Desconocido</option>
                </select>
              </div>

              {/* RAM */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300">Memoria RAM</label>
                <select
                  value={ramAmount}
                  onChange={(e) => setRamAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 text-zinc-100 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="4gb">4 GB o menos</option>
                  <option value="8gb">8 GB</option>
                  <option value="16gb">16 GB</option>
                  <option value="32gb">32 GB o más</option>
                  <option value="unknown">Desconocido</option>
                </select>
              </div>

              {/* Storage */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300">Almacenamiento</label>
                <select
                  value={storageType}
                  onChange={(e) => setStorageType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 text-zinc-100 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="ssd-nvme">SSD NVMe M.2</option>
                  <option value="ssd-sata">SSD SATA</option>
                  <option value="hdd-legacy">HDD Mecánico</option>
                  <option value="unknown">Desconocido</option>
                </select>
              </div>

              {/* TPM 2.0 */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300">TPM 2.0</label>
                <select
                  value={tpmStatus}
                  onChange={(e) => setTpmStatus(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 text-zinc-100 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="active">Activo / Presente</option>
                  <option value="disabled">Deshabilitado en BIOS</option>
                  <option value="absent">Ausente</option>
                  <option value="unknown">No sé</option>
                </select>
              </div>

              {/* Secure Boot */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300">Secure Boot</label>
                <select
                  value={secureBoot}
                  onChange={(e) => setSecureBoot(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 text-zinc-100 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="enabled">Habilitado</option>
                  <option value="capable">Compatible deshabilitado</option>
                  <option value="unsupported">No soportado</option>
                  <option value="unknown">No sé</option>
                </select>
              </div>

              {/* Firmware UEFI */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300">Firmware</label>
                <select
                  value={uefiStatus}
                  onChange={(e) => setUefiStatus(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 text-zinc-100 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="uefi">UEFI Native</option>
                  <option value="legacy">Legacy BIOS / CSM</option>
                  <option value="unknown">No sé</option>
                </select>
              </div>

            </div>

            {/* STATUS BADGES & EVALUATION */}
            <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-zinc-400">Nivel de Confianza:</span>
                <span className={`px-2.5 py-0.5 rounded font-bold border ${
                  confidenceLevel === 'DATOS SUFICIENTES' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50' :
                  confidenceLevel === 'DATOS PARCIALES' ? 'bg-amber-950/80 text-amber-300 border-amber-600/50' :
                  'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {confidenceLevel}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span className="text-zinc-400">Requisitos Windows 11:</span>
                <span className={`px-2.5 py-0.5 rounded font-bold border ${win11Compatibility.color}`}>
                  {win11Compatibility.status}
                </span>
              </div>
            </div>
          </div>

          {/* PASO 2: TU USO */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <span className="w-7 h-7 rounded-full bg-cyan-500 text-zinc-950 font-mono font-black flex items-center justify-center text-sm">
                2
              </span>
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wide">PASO 2: ¿PARA QUÉ USÁS LA PC?</h2>
                <p className="text-xs text-zinc-400">Selecciona uno o varios chips de uso</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'daily', label: 'USO DIARIO' },
                { id: 'office', label: 'OFICINA / ESTUDIO' },
                { id: 'gaming', label: 'GAMING' },
                { id: 'low-res', label: 'PC DE BAJOS RECURSOS' },
                { id: 'content', label: 'CREACIÓN DE CONTENIDO' },
                { id: 'dev', label: 'DESARROLLO' },
                { id: 'audio', label: 'AUDIO / PRODUCCIÓN' },
                { id: 'workstation', label: 'ESTACIÓN DE TRABAJO' },
                { id: 'legacy', label: 'SOFTWARE LEGACY' },
                { id: 'max-compat', label: 'MÁXIMA COMPATIBILIDAD MODERNA' }
              ].map(item => {
                const isSelected = selectedUsages.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleUsage(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all border ${
                      isSelected
                        ? 'bg-cyan-500 text-zinc-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setAnalyzed(true)}
              className="px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold font-mono text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all uppercase tracking-wider flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              [ ANALIZAR MI PC Y VER RECOMENDACIÓN ]
            </button>
          </div>

          {/* PASO 3: RESULTADO EVO */}
          {analyzed && recommendationResult && (
            <div className="bg-zinc-900/90 border border-cyan-500/40 rounded-xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 text-zinc-950 font-mono font-black flex items-center justify-center text-base">
                    3
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">PASO 3: RESULTADO EVO</h2>
                    <p className="text-xs text-zinc-400">Derivado transparente basado en evidencia y reglas oficiales (DERIVED)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    DERIVED FROM USER_INPUT
                  </span>
                  <button
                    onClick={() => setShowGlossaryModal(true)}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border border-zinc-700 rounded text-xs font-mono"
                  >
                    EXPLICÁMELO SIMPLE
                  </button>
                </div>
              </div>

              {/* MAIN CONCLUSION PANEL */}
              <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-6 space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    MEJOR AJUSTE PARA ESTE PERFIL:
                  </span>
                  <h3 className="text-2xl font-black text-white">{recommendationResult.bestFit}</h3>
                </div>

                {recommendationResult.legacyAlert && (
                  <div className="p-3.5 bg-rose-950/80 border border-rose-600/50 rounded-lg text-xs text-rose-200 font-medium">
                    {recommendationResult.legacyAlert}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* POR QUÉ ENCAJA */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      POR QUÉ ENCAJA:
                    </h4>
                    <ul className="space-y-1 text-xs text-zinc-300 pl-5 list-disc">
                      {recommendationResult.whyFit.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* QUÉ DEBÉS SABER */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      QUÉ DEBÉS SABER / RIESGOS:
                    </h4>
                    <ul className="space-y-1 text-xs text-zinc-300 pl-5 list-disc">
                      {recommendationResult.keepInMind.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-800">
                  
                  {/* QUÉ VERIFICAR ANTES */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                      <Search className="w-4 h-4 text-cyan-400" />
                      QUÉ VERIFICAR ANTES:
                    </h4>
                    <ul className="space-y-1 text-xs text-zinc-300 pl-5 list-disc">
                      {recommendationResult.checkBefore.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* ALTERNATIVA RAZONABLE */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-purple-400 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      ALTERNATIVA RAZONABLE:
                    </h4>
                    <p className="text-xs text-zinc-300 pl-2">
                      {recommendationResult.alternative}
                    </p>
                  </div>

                </div>
              </div>

              {/* DISCREET DISCLAIMER */}
              <div className="text-[11px] text-zinc-500 font-sans text-center pt-2">
                EVO no reemplaza la validación del fabricante, Microsoft ni del proveedor de software. La recomendación se basa en los datos disponibles.
              </div>
            </div>
          )}

        </div>
      )}

      {/* 20. MATRIZ DE VERSIONES & LIFECYCLE (TAB 2) */}
      {activeTab === 'matrix' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-lg animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                MATRIZ DE VERSIONES & LIFECYCLE
              </h2>
              <p className="text-xs text-zinc-400">Fuente: Microsoft Lifecycle (Snapshot 2026-10-03)</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-950 text-zinc-400 font-mono font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3">VERSIÓN</th>
                  <th className="p-3">SOPORTE</th>
                  <th className="p-3">COMPATIBILIDAD</th>
                  <th className="p-3">CASO DE USO</th>
                  <th className="p-3">OBSERVACIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/40 text-zinc-300">
                {Object.values(MICROSOFT_LIFECYCLE_SNAPSHOT).map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3 font-bold text-white">{item.name}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                        {item.statusBadge}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-zinc-400">
                      RAM: {item.minRamGb} GB | TPM: {item.requiresTpm ? 'SÍ' : 'NO'}
                    </td>
                    <td className="p-3 text-zinc-300">{item.useCase}</td>
                    <td className="p-3 text-zinc-400 text-[11px]">{item.observation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROFUNDIZAR: PLANIFICADOR & SUB-LABS (TAB 3) */}
      {activeTab === 'deep' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* DEEP LABS SUB-NAVIGATION */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
            <button
              onClick={() => setDeepLabSubTab('scheduler')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                deepLabSubTab === 'scheduler' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              PLANIFICADOR & SILICIO (MODELO SIMULADO)
            </button>
            <button
              onClick={() => setDeepLabSubTab('boot')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                deepLabSubTab === 'boot' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              BOOT EXPERIENCIA
            </button>
            <button
              onClick={() => setDeepLabSubTab('install')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                deepLabSubTab === 'install' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              INSTALL EXPERIENCIA
            </button>
            <button
              onClick={() => setDeepLabSubTab('services')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                deepLabSubTab === 'services' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              SERVICES & TELEMETRÍA
            </button>
            <button
              onClick={() => setDeepLabSubTab('repair')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                deepLabSubTab === 'repair' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              REPAIR LAB
            </button>
            <button
              onClick={() => setDeepLabSubTab('xray')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                deepLabSubTab === 'xray' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              WINDOWS X-RAY
            </button>
          </div>

          {/* DEDICATED SCHEDULER & SILICON SIMULATOR (deepLabSubTab === 'scheduler') */}
          {deepLabSubTab === 'scheduler' && (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-6">
              
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    CÓMO WINDOWS DISTRIBUYE EL TRABAJO EN TU CPU
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Observá cómo el sistema operativo decide qué hilos ejecutar y qué factores pueden influir en esa decisión.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-600/50 self-start sm:self-auto">
                  SIMULATED / REFERENCE MODEL
                </span>
              </div>

              {/* FLOW DIAGRAM: TAREA ➔ PLANIFICADOR ➔ CPU ➔ NÚCLEOS / HILOS */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold">
                <div className="px-3 py-2 bg-zinc-900 border border-cyan-500/40 rounded text-cyan-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  1. TAREA / APLICACIÓN
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 hidden sm:block" />
                <div className="px-3 py-2 bg-zinc-900 border border-purple-500/40 rounded text-purple-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  2. PLANIFICADOR WINDOWS
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 hidden sm:block" />
                <div className="px-3 py-2 bg-zinc-900 border border-amber-500/40 rounded text-amber-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  3. CPU & FIRMWARE
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 hidden sm:block" />
                <div className="px-3 py-2 bg-zinc-900 border border-emerald-500/40 rounded text-emerald-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  4. NÚCLEOS & HILOS
                </div>
              </div>

              {/* CONTROLS: ARCHITECTURE & WORKLOAD SELECTOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* SELECTOR DE ARQUITECTURA */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-zinc-300 block">
                    SELECCIONAR ARQUITECTURA DE CPU:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'hybrid', label: 'CPU Híbrida', sub: 'P-Cores + E-Cores' },
                      { id: 'vcache', label: 'Multi-CCD', sub: 'V-Cache / Frequency' },
                      { id: 'monolithic', label: 'Monolítica', sub: 'Núcleos Uniformes' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSchedulerArch(item.id as any)}
                        className={`p-2.5 rounded-lg border text-left font-mono transition-all ${
                          schedulerArch === item.id
                            ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-zinc-500">{item.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SELECTOR DE CARGA / WORKLOAD */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-zinc-300 block">
                    SELECCIONAR TIPO DE CARGA:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'foreground', label: 'Juego / Foreground' },
                      { id: 'app', label: 'Aplicación' },
                      { id: 'background', label: 'Background' },
                      { id: 'maintenance', label: 'Mantenimiento' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSchedulerWorkload(item.id as any)}
                        className={`p-2 rounded-lg border text-center font-mono text-xs transition-all ${
                          schedulerWorkload === item.id
                            ? 'bg-cyan-500 text-zinc-950 font-bold border-cyan-400'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* SIMULATED THREAD DISTRIBUTION VISUALIZATION */}
              <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    MODELO SIMULADO DE DISTRIBUCIÓN DE HILOS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px]">
                    SIMULATED
                  </span>
                </div>

                {/* ARCHITECTURE VISUALIZATION CASES */}
                {schedulerArch === 'hybrid' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                      Intel Thread Director puede aportar información al sistema operativo para ayudar en decisiones de planificación en hardware compatible.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* P-CORES */}
                      <div className="p-4 bg-zinc-900/60 rounded-xl border border-cyan-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300">
                          <span>P-CORES (Alto Rendimiento)</span>
                          <span className="text-[10px] text-zinc-500">Threads Pesados</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map(num => (
                            <div
                              key={num}
                              className={`p-3 rounded text-center font-mono text-xs border ${
                                schedulerWorkload === 'foreground' || schedulerWorkload === 'app'
                                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 animate-pulse'
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                              }`}
                            >
                              Core P{num}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* E-CORES */}
                      <div className="p-4 bg-zinc-900/60 rounded-xl border border-purple-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-300">
                          <span>E-CORES (Eficiencia Energetica)</span>
                          <span className="text-[10px] text-zinc-500">Threads Secundarios</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map(num => (
                            <div
                              key={num}
                              className={`p-3 rounded text-center font-mono text-xs border ${
                                schedulerWorkload === 'background' || schedulerWorkload === 'maintenance'
                                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 animate-pulse'
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                              }`}
                            >
                              Core E{num}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {schedulerArch === 'vcache' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                      En procesadores AMD Multi-CCD con 3D V-Cache, el controlador del chipset orienta cargas sensibles a latencia de memoria hacia el CCD con cache L3 masivo.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900/60 rounded-xl border border-emerald-500/30 space-y-2">
                        <div className="text-xs font-mono font-bold text-emerald-300">CCD 0 (3D V-CACHE)</div>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map(num => (
                            <div key={num} className={`p-3 rounded text-center font-mono text-xs border ${schedulerWorkload === 'foreground' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                              Core {num}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-zinc-900/60 rounded-xl border border-amber-500/30 space-y-2">
                        <div className="text-xs font-mono font-bold text-amber-300">CCD 1 (Alta Frecuencia)</div>
                        <div className="grid grid-cols-4 gap-2">
                          {[5, 6, 7, 8].map(num => (
                            <div key={num} className={`p-3 rounded text-center font-mono text-xs border ${schedulerWorkload !== 'foreground' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                              Core {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {schedulerArch === 'monolithic' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                      En procesadores monolíticos con arquitectura simétrica, los hilos se distribuyen de forma balanceada entre todos los núcleos disponibles.
                    </div>

                    <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-700 space-y-2">
                      <div className="text-xs font-mono font-bold text-zinc-300">NÚCLEOS SIMÉTRICOS (UNIFORM CACHE/FREQ)</div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <div key={num} className="p-3 rounded text-center font-mono text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                            Core {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MANDATORY DISCLAIMER TEXT */}
                <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Esta visualización representa un modelo educativo. La decisión real del scheduler depende de hardware, firmware, carga, energía, prioridades, drivers y versión del sistema operativo.
                </div>
              </div>

              {/* FACTORES QUE INFLUYEN */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase block">
                  FACTORES TÉCNICOS QUE INFLUYEN EN LA PLANIFICACIÓN:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'PRIORIDAD', 'QoS', 'AFINIDAD', 'ESTADO ENERGÉTICO',
                    'CARGA', 'TOPOLOGÍA CPU', 'FIRMWARE', 'DRIVERS', 'TEMPERATURA'
                  ].map((factor, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] font-mono">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* TOGGLE PROFUNDIZAR */}
              <div className="pt-2 border-t border-zinc-800">
                <button
                  onClick={() => setShowSchedulerDeepDive(!showSchedulerDeepDive)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border border-zinc-700 rounded-lg text-xs font-mono transition-all flex items-center gap-2"
                >
                  {showSchedulerDeepDive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  [ PROFUNDIZAR: MECANISMOS INTERNOS ]
                </button>
              </div>

              {/* PROFUNDIZAR PANEL (CLOSED BY DEFAULT) */}
              {showSchedulerDeepDive && (
                <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800 space-y-4 animate-fade-in text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-mono font-bold text-white uppercase">MECANISMOS INTERNOS DE PLANIFICACIÓN</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">SIMULATED</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
                      <strong className="text-cyan-300 font-mono block">VBS / HVCI:</strong>
                      <p className="text-zinc-400 text-[11px]">Seguridad basada en virtualización e integridad de memoria por hipervisor.</p>
                    </div>

                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
                      <strong className="text-cyan-300 font-mono block">HAGS:</strong>
                      <p className="text-zinc-400 text-[11px]">Planificación de GPU acelerada por hardware para gestionar la VRAM directamente.</p>
                    </div>

                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
                      <strong className="text-cyan-300 font-mono block">FAST STARTUP:</strong>
                      <p className="text-zinc-400 text-[11px]">Inicio rápido mediante hibernación parcial de la sesión de kernel de Windows.</p>
                    </div>

                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
                      <strong className="text-cyan-300 font-mono block">SIMULACIÓN DPC / ISR:</strong>
                      <p className="text-zinc-400 text-[11px]">Deferred Procedure Calls e Interrupt Service Routines en el sub-sistema de controladores.</p>
                    </div>

                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
                      <strong className="text-cyan-300 font-mono block">TIMER RESOLUTION:</strong>
                      <p className="text-zinc-400 text-[11px]">Resolución del reloj del sistema (0.5ms vs 15.6ms estándar) para precisión en juegos y audio.</p>
                    </div>

                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
                      <strong className="text-cyan-300 font-mono block">SCHEDULER AFFINITY:</strong>
                      <p className="text-zinc-400 text-[11px]">Máscaras de afinidad asignadas por proceso para limitar la ejecución a hilos específicos.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* OTHER SUB-LABS REMAIN INTACT AND UNCHANGED */}
          {deepLabSubTab === 'boot' && <WindowsBootExperienceLab initialSilicon="hybrid" />}
          {deepLabSubTab === 'install' && <WindowsInstallExperienceLab />}
          {deepLabSubTab === 'services' && <WindowsServicesTelemetryLab />}
          {deepLabSubTab === 'repair' && <WindowsFailureRepairLab />}
          {deepLabSubTab === 'xray' && <EvoWindowsXRayLab initialScenario={initialScenario} />}

        </div>
      )}

      {/* MODAL: ¿DÓNDE VEO MI HARDWARE? */}
      {showHowToCheckModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-cyan-500/40 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowHowToCheckModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              ¿DÓNDE VEO LOS DATOS DE MI PC EN WINDOWS?
            </h3>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <strong className="text-cyan-300 block font-mono">1. PROCESADOR Y RAM:</strong>
                Presiona <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-mono">Win + Pause</kbd> o abre <em>Configuración ➔ Sistema ➔ Información</em>.
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <strong className="text-cyan-300 block font-mono">2. INFORMACIÓN COMPLETA DEL SISTEMA:</strong>
                Presiona <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-mono">Win + R</kbd>, escribe <code className="text-cyan-300">msinfo32</code> y presiona Enter. Verás el estado de UEFI, Secure Boot y TPM.
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <strong className="text-cyan-300 block font-mono">3. ESTADO DE TPM 2.0:</strong>
                Presiona <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded font-mono">Win + R</kbd>, escribe <code className="text-cyan-300">tpm.msc</code> para verificar si la especificación 2.0 está lista para usarse.
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setShowHowToCheckModal(false)}
                className="px-4 py-2 bg-cyan-500 text-zinc-950 font-bold font-mono text-xs rounded-lg"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPLICÁMELO SIMPLE */}
      {showGlossaryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-cyan-500/40 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowGlossaryModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              EXPLICACIÓN SIMPLE DE CONCEPTOS
            </h3>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <strong className="text-cyan-300 block font-mono">¿QUÉ ES TPM 2.0?</strong>
                Es un chip físico de seguridad en la placa madre que resguarda contraseñas y claves de cifrado.
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <strong className="text-cyan-300 block font-mono">¿QUÉ ES SECURE BOOT?</strong>
                Es una protección en el inicio de la PC que impide que malware infecte el sistema antes de encender.
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <strong className="text-cyan-300 block font-mono">¿QUÉ SIGNIFICA "SOPORTADO"?</strong>
                Que Microsoft envía actualizaciones de seguridad mensuales. Cuando finaliza el soporte, la PC queda expuesta a vulnerabilidades.
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <strong className="text-cyan-300 block font-mono">¿POR QUÉ NINGUNA VERSIÓN ES AUTOMÁTICAMENTE MEJOR?</strong>
                Porqué depende de la compatibilidad de controladores (drivers) de tu fabricante específico y del estado de tu hardware.
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setShowGlossaryModal(false)}
                className="px-4 py-2 bg-cyan-500 text-zinc-950 font-bold font-mono text-xs rounded-lg"
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
