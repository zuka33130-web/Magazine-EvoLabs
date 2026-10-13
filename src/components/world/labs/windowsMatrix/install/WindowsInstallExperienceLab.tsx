// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS INSTALLATION LAB — "DE UN DISCO VACÍO A WINDOWS FUNCIONAL (VERACIDAD Y COHERENCIA)"
// 100% Safe Virtual Disk Simulator (NVMe 1TB) & End-to-End Installation Flow
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Usb,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Activity,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  INITIAL_VIRTUAL_DISK_PARTITIONS,
  STANDARD_WINDOWS_GPT_PARTITIONS,
  INSTALL_CHALLENGES,
  POST_INSTALL_BASELINE_TASKS
} from '../data/installationData';
import { DiskPartitionItem } from '../engine/types';
import { SimulatedMonitorScreen } from '../components/SimulatedMonitorScreen';
import { EvoTutorModal } from '../components/EvoTutorModal';
import { TermGlossaryModal } from '../components/TermGlossaryModal';

type InstallMode = 'GUIDED_TUTORIAL' | 'CHALLENGE_ERRORS';

type InstallPhase =
  | 'NO_BOOT_DEVICE'
  | 'BOOT_MENU_USB'
  | 'SETUP_LANGUAGE'
  | 'SETUP_EDITION'
  | 'SETUP_TYPE'
  | 'DISK_MANAGER'
  | 'COPYING_FILES'
  | 'OOBE_SETUP'
  | 'POST_INSTALL_BASELINE'
  | 'SYSTEM_FINAL_STABLE';

interface PipelineStep {
  id: string;
  label: string;
  phases: InstallPhase[];
}

const PIPELINE_STEPS: PipelineStep[] = [
  { id: 'FIRMWARE', label: 'FIRMWARE', phases: ['NO_BOOT_DEVICE'] },
  { id: 'MEDIA', label: 'MEDIA', phases: ['BOOT_MENU_USB'] },
  { id: 'SETUP', label: 'SETUP', phases: ['SETUP_LANGUAGE', 'SETUP_EDITION', 'SETUP_TYPE'] },
  { id: 'DISK', label: 'DISK', phases: ['DISK_MANAGER'] },
  { id: 'IMAGE', label: 'IMAGE', phases: ['COPYING_FILES'] },
  { id: 'BOOT', label: 'BOOT', phases: ['OOBE_SETUP'] },
  { id: 'OOBE', label: 'OOBE', phases: ['OOBE_SETUP'] },
  { id: 'BASELINE', label: 'BASELINE', phases: ['POST_INSTALL_BASELINE'] },
  { id: 'STABLE', label: 'STABLE', phases: ['SYSTEM_FINAL_STABLE'] }
];

interface CleanXRayData {
  ahora: string;
  porDentro: string;
  queCambia: string;
  siguiente: string;
  deepDetails: {
    proceso: string;
    archivo: string;
    componente: string;
    bootChain: string;
    riesgo: string;
  };
}

const PHASE_CLEAN_XRAY: Record<InstallPhase, CleanXRayData> = {
  NO_BOOT_DEVICE: {
    ahora: 'Buscando un dispositivo de arranque en la PC.',
    porDentro: 'UEFI enumera discos NVMe, puertos SATA y controladores USB.',
    queCambia: 'Nada en el disco. La NVMe continúa 100% virgen e intacta.',
    siguiente: 'Conectar el pendrive USB de instalación virtual.',
    deepDetails: {
      proceso: 'SIMULATED EDUCATIONAL FLOW // UEFI BDS Enumeration',
      archivo: 'Primary Boot Block Scan',
      componente: 'Firmware Motherboard SPI Flash Model',
      bootChain: 'UEFI → NVMe Enum → Boot Fail → Halt',
      riesgo: 'NINGUNO (Escenario Simulado)'
    }
  },
  BOOT_MENU_USB: {
    ahora: 'Unidad USB detectada. Seleccionando medio de arranque.',
    porDentro: 'UEFI reconoce la partición ESP FAT32 del USB y ejecuta el cargador.',
    queCambia: 'Se carga el entorno comprimido Windows PE en la memoria RAM.',
    siguiente: 'Iniciar Windows Setup desde el pendrive USB.',
    deepDetails: {
      proceso: 'REFERENCE MODEL // UEFI Hand-off to Windows Boot Manager',
      archivo: '\\EFI\\BOOT\\BOOTX64.EFI',
      componente: 'RAMDisk Driver (X:\\) & Windows PE Kernel',
      bootChain: 'UEFI → USB ESP → BOOTX64.EFI → WinPE Kernel',
      riesgo: 'BAJO (Operación en RAM)'
    }
  },
  SETUP_LANGUAGE: {
    ahora: 'Iniciando el asistente de instalación de Windows.',
    porDentro: 'Setup.exe carga las variables regionales e idioma en memoria RAM.',
    queCambia: 'Sin modificaciones en el disco físico. Entorno localizado en RAM.',
    siguiente: 'Elegir edición de Windows e instalación limpia.',
    deepDetails: {
      proceso: 'SIMULATED EDUCATIONAL FLOW // WinPE Setup Init',
      archivo: 'X:\\Sources\\Setup.exe',
      componente: 'Windows Setup Engine & Language Packs',
      bootChain: 'WinPE Kernel → Setup.exe GUI',
      riesgo: 'NINGUNO (Entorno en RAMDisk)'
    }
  },
  SETUP_EDITION: {
    ahora: 'Seleccionando la edición del sistema operativo.',
    porDentro: 'Setup lee el catálogo de imágenes dentro del instalador en el USB.',
    queCambia: 'Se selecciona la imagen a aplicar en la partición destino.',
    siguiente: 'Seleccionar el tipo de instalación Personalizada.',
    deepDetails: {
      proceso: 'REFERENCE MODEL // WIM Image Index Catalog Selection',
      archivo: 'install.wim / install.esd (Windows 11 Pro)',
      componente: 'WIMGAPI / ImageX Engine',
      bootChain: 'Setup.exe → WIMGAPI Catalog',
      riesgo: 'NINGUNO'
    }
  },
  SETUP_TYPE: {
    ahora: 'Eligiendo el tipo de instalación de Windows.',
    porDentro: 'Al elegir Personalizada, Setup habilita el módulo de administración de discos.',
    queCambia: 'Se habilita el control para crear y formatear particiones en el SSD.',
    siguiente: 'Estructurar el mapa de particiones GPT en el gestor de discos.',
    deepDetails: {
      proceso: 'SIMULATED EDUCATIONAL FLOW // Custom Install Module Invocation',
      archivo: 'vds.exe / Storage Subsystem',
      componente: 'Partition Manager Interface',
      bootChain: 'Setup.exe → Custom Install Handler → VDS',
      riesgo: 'NINGUNO'
    }
  },
  DISK_MANAGER: {
    ahora: 'Estructurando el mapa de particiones GPT en el SSD.',
    porDentro: 'Windows Setup crea y prepara las estructuras GPT y las particiones necesarias del escenario simulado.',
    queCambia: 'SSD particionado en ESP (260MB), MSR (16MB), Windows (NTFS) y Recovery.',
    siguiente: 'Instalar Windows en la partición de Windows (NTFS).',
    deepDetails: {
      proceso: 'REFERENCE MODEL // GPT Header Creation & Partition Setup',
      archivo: 'vds.exe / Storage Subsystem Model',
      componente: 'Partition Manager Engine',
      bootChain: 'GPT Header Commit (Reference Model)',
      riesgo: 'ALTO EN PC REAL // ⚠️ SIMULATED EN ESTE ESCENARIO'
    }
  },
  COPYING_FILES: {
    ahora: 'Copiando y aplicando la imagen de Windows al SSD.',
    porDentro: 'Windows Setup aplica la imagen seleccionada a la partición de Windows.',
    queCambia: 'Partición de Windows poblada con archivos del sistema y BCD de arranque.',
    siguiente: 'Primer reinicio para iniciar la experiencia OOBE.',
    deepDetails: {
      proceso: 'SIMULATED EDUCATIONAL FLOW // Image Extraction & Bootloader Setup',
      archivo: 'install.wim / install.esd → Partición Windows (NTFS)',
      componente: 'Offline Servicing Engine & Boot Files',
      bootChain: 'USB PE → Image Extract → Write Bootloader (Reference Model)',
      riesgo: 'NINGUNO (Proceso aislado SIMULATED)'
    }
  },
  OOBE_SETUP: {
    ahora: 'Configuración inicial de usuario (OOBE).',
    porDentro: 'Boot Manager arranca el Kernel, inicializa servicios y lanza OOBE.',
    queCambia: 'Configuración de cuenta, actualización de seguridad y perfil de usuario.',
    siguiente: 'Ingresar al escritorio e iniciar la verificación Baseline.',
    deepDetails: {
      proceso: 'REPRESENTACIÓN EDUCATIVA SIMULADA // First Boot Initialization',
      archivo: '\\Windows\\System32\\oobe\\oobe.exe',
      componente: 'Winlogon / Security & Policy Manager',
      bootChain: 'BOOT MANAGER → LOADER → KERNEL → SERVICIOS DE SISTEMA → EXPERIENCIA OOBE',
      riesgo: 'NINGUNO'
    }
  },
  POST_INSTALL_BASELINE: {
    ahora: 'Verificando el estado del sistema en el escritorio.',
    porDentro: 'PnP Manager busca controladores WHQL y VSS crea un snapshot.',
    queCambia: 'DriverStore actualizado y punto de restauración guardado.',
    siguiente: 'Completar la checklist de verificación de estabilidad.',
    deepDetails: {
      proceso: 'REFERENCE MODEL // PnP Driver Installation & VSS Snapshot',
      archivo: 'drvinst.exe / vssvc.exe',
      componente: 'Plug and Play & Volume Shadow Copy',
      bootChain: 'Kernel → WHQL Drivers → Restore Point',
      riesgo: 'NINGUNO'
    }
  },
  SYSTEM_FINAL_STABLE: {
    ahora: 'Baseline simulado completado sin alertas detectadas.',
    porDentro: 'Kernel en reposo. Todos los servicios en estado normal simulado.',
    queCambia: 'SSD NVMe de la simulación listo con baseline guardado.',
    siguiente: 'Estado del Lab: COMPLETADO.',
    deepDetails: {
      proceso: 'SIMULATED EDUCATIONAL FLOW // Final Verification State',
      archivo: '\\Windows\\System32\\ntoskrnl.exe',
      componente: 'Windows NT Kernel Model',
      bootChain: 'UEFI → ESP Bootmgfw → Winload → Kernel → Shell',
      riesgo: 'SIMULATED SCENARIO COMPLETADO'
    }
  }
};

interface CleanPartitionDetail {
  name: string;
  type: string;
  fileSystem: string;
  usedBy: string;
  purpose: string;
  ifMissing: string;
}

const CLEAN_PARTITION_DETAILS: Record<string, CleanPartitionDetail> = {
  ESP: {
    name: 'ESP (260 MB - SIMULATED SCENARIO)',
    type: 'EFI System Partition',
    fileSystem: 'FAT32',
    usedBy: 'UEFI / Windows Boot Manager',
    purpose: 'Contiene el cargador de arranque bootmgfw.efi y la base BCD en la simulación.',
    ifMissing: 'La computadora no podrá iniciar Windows (Error 0xc000000e).'
  },
  MSR: {
    name: 'MSR (16 MB - SIMULATED SCENARIO)',
    type: 'Microsoft Reserved Partition',
    fileSystem: 'Sin formato de usuario (RAW / Reservado)',
    usedBy: 'Gestión interna GPT de Windows',
    purpose: 'Espacio reservado para metadatos y reestructuraciones del esquema GPT.',
    ifMissing: 'Sistemas dinámicos o reconfiguraciones de volumen pueden fallar.'
  },
  WINDOWS: {
    name: 'WINDOWS (952.8 GB - SIMULATED SCENARIO)',
    type: 'Primary Data Partition',
    fileSystem: 'NTFS',
    usedBy: 'Sistema Operativo, Usuarios y Programas',
    purpose: 'Almacena \\Windows, \\Users, \\Program Files y datos del usuario.',
    ifMissing: 'No existe sistema operativo instalado.'
  },
  RECOVERY: {
    name: 'RECOVERY (1000 MB - SIMULATED SCENARIO)',
    type: 'Windows Recovery Environment',
    fileSystem: 'NTFS',
    usedBy: 'WinRE (Entorno de Recuperación)',
    purpose: 'Permite reparar el inicio, restaurar el sistema o acceder a consola.',
    ifMissing: 'Se pierden las herramientas integradas de solución de problemas de inicio.'
  },
  UNALLOCATED: {
    name: 'UNALLOCATED (953.8 GB - SIMULATED SCENARIO)',
    type: 'Espacio no asignado',
    fileSystem: 'Sin formato',
    usedBy: 'Ningún servicio activo',
    purpose: 'Sector bruto del SSD listo para recibir tablas de particiones.',
    ifMissing: 'El disco completo debe ser dividido antes de poder escribir datos.'
  }
};

export const WindowsInstallExperienceLab: React.FC = () => {
  const [labMode, setLabMode] = useState<InstallMode>('GUIDED_TUTORIAL');
  const [currentPhase, setCurrentPhase] = useState<InstallPhase>('NO_BOOT_DEVICE');
  const [virtualUsbConnected, setVirtualUsbConnected] = useState<boolean>(false);
  const [partitions, setPartitions] = useState<DiskPartitionItem[]>(INITIAL_VIRTUAL_DISK_PARTITIONS);
  const [selectedPartitionId, setSelectedPartitionId] = useState<string>('part-unallocated');

  // Progressive depth toggle (Collapsed by default)
  const [deepXRayOpen, setDeepXRayOpen] = useState<boolean>(false);
  const [rufusGuideOpen, setRufusGuideOpen] = useState<boolean>(false);

  // Copying Progress Animation
  const [copyProgress, setCopyProgress] = useState<number>(0);
  const [gettingReadyProgress, setGettingReadyProgress] = useState<number>(0);

  // Challenge mode state
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(INSTALL_CHALLENGES[0].id);
  const [challengeResolved, setChallengeResolved] = useState<boolean>(false);
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);

  // Post install tasks checklist
  const [completedBaselineTasks, setCompletedBaselineTasks] = useState<string[]>([]);

  // Modals
  const [tutorOpen, setTutorOpen] = useState<boolean>(false);
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);

  // Active partition
  const activePartition = partitions.find((p) => p.id === selectedPartitionId) || partitions[0];

  // Auto-progress in copying files phase
  useEffect(() => {
    let interval: any = null;
    if (currentPhase === 'COPYING_FILES') {
      interval = setInterval(() => {
        setCopyProgress((prev) => {
          const next = prev < 100 ? prev + 25 : 100;
          if (next >= 100) {
            setGettingReadyProgress((gPrev) => {
              if (gPrev < 100) return gPrev + 20;
              return 100;
            });
            setCurrentPhase('OOBE_SETUP');
          }
          return next;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [currentPhase]);

  // Actions for disk manager
  const handleCreateDefaultGptPartitions = () => {
    setPartitions(STANDARD_WINDOWS_GPT_PARTITIONS);
    setSelectedPartitionId('part-windows');
  };

  const handleResetVirtualDisk = () => {
    setPartitions(INITIAL_VIRTUAL_DISK_PARTITIONS);
    setSelectedPartitionId('part-unallocated');
    setCurrentPhase('NO_BOOT_DEVICE');
    setVirtualUsbConnected(false);
    setCopyProgress(0);
    setGettingReadyProgress(0);
    setCompletedBaselineTasks([]);
    setChallengeResolved(false);
    setChallengeFeedback(null);
    setDeepXRayOpen(false);
  };

  // Toggle baseline task
  const toggleBaselineTask = (taskId: string) => {
    if (completedBaselineTasks.includes(taskId)) {
      setCompletedBaselineTasks(completedBaselineTasks.filter((id) => id !== taskId));
    } else {
      const next = [...completedBaselineTasks, taskId];
      setCompletedBaselineTasks(next);
      if (next.length === POST_INSTALL_BASELINE_TASKS.length) {
        setCurrentPhase('SYSTEM_FINAL_STABLE');
      }
    }
  };

  const activeChallenge =
    INSTALL_CHALLENGES.find((c) => c.id === selectedChallengeId) || INSTALL_CHALLENGES[0];

  // Pipeline step calculations
  const getCurrentStepIndex = (phase: InstallPhase) => {
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      if (PIPELINE_STEPS[i].phases.includes(phase)) return i;
    }
    return 0;
  };

  const currentStepIdx = getCurrentStepIndex(currentPhase);
  const activeXRay = PHASE_CLEAN_XRAY[currentPhase] || PHASE_CLEAN_XRAY.NO_BOOT_DEVICE;
  const activePartitionDetail = CLEAN_PARTITION_DETAILS[activePartition?.type || 'UNALLOCATED'];

  return (
    <div className="space-y-3 font-mono-tech select-none">
      {/* HEADER PRINCIPAL LIMPIO */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0b0e14] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xl">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[9.5px] font-bold uppercase tracking-wider">
              INSTALL LAB // CLEAN X-RAY
            </span>
            <span className="text-zinc-500 text-[10px]">
              ESCENARIO SIMULADO NVMe 1TB
            </span>
          </div>
          <h2 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight">
            Instalación de Windows: De Disco Vacío a Sistema Estable
          </h2>
        </div>

        {/* MODOS Y CONTROLES SECUNDARIOS */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-cyan-950 text-xs">
          <button
            type="button"
            onClick={() => {
              setLabMode('GUIDED_TUTORIAL');
              handleResetVirtualDisk();
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              labMode === 'GUIDED_TUTORIAL'
                ? 'bg-cyan-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            TUTORIAL GUIADO
          </button>

          <button
            type="button"
            onClick={() => setLabMode('CHALLENGE_ERRORS')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              labMode === 'CHALLENGE_ERRORS'
                ? 'bg-rose-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            DESAFÍO DE ERRORES
          </button>

          <button
            type="button"
            onClick={handleResetVirtualDisk}
            className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer ml-1"
            title="Reiniciar simulador"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* BARRA DE PROGRESO DE ETAPAS DISCRETA (DISCRET ORIENTATION BAR) */}
      {labMode === 'GUIDED_TUTORIAL' && (
        <div className="p-2.5 rounded-xl bg-[#080b10] border border-cyan-950/80 shadow-md space-y-1.5">
          <div className="flex items-center justify-between text-[11px] border-b border-cyan-950/60 pb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                PROGRESO DE INSTALACIÓN
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 font-bold text-[10.5px]">
                ETAPA {currentStepIdx + 1}/{PIPELINE_STEPS.length}: {PIPELINE_STEPS[currentStepIdx].label}
              </span>
              <button
                type="button"
                onClick={() => setTutorOpen(true)}
                className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-bold transition-colors cursor-pointer ml-2 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>EXPLICÁMELO SIMPLE</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-9 gap-1">
            {PIPELINE_STEPS.map((step, idx) => {
              const isCurrent = idx === currentStepIdx;
              const isDone = idx < currentStepIdx;

              let color = 'bg-zinc-950 border-zinc-800 text-zinc-600';
              if (isDone) color = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 font-bold';
              if (isCurrent) color = 'bg-cyan-500 text-black border-cyan-300 font-black shadow';

              return (
                <div
                  key={step.id}
                  className={`py-1 px-0.5 rounded border text-center text-[9.5px] truncate transition-all ${color}`}
                >
                  <span className="truncate block">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 1: GUIDED TUTORIAL CLEAN LAYOUT (55% LEFT / 45% RIGHT)
      ======================================================== */}
      {labMode === 'GUIDED_TUTORIAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* ====================================================
              55% IZQUIERDA: SIMULACIÓN VISUAL (MONITOR + HERRAMIENTA CONTEXTUAL DE FASE)
          ==================================================== */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative">
              <SimulatedMonitorScreen
                screenState={
                  currentPhase === 'NO_BOOT_DEVICE'
                    ? 'black-screen-cursor'
                    : currentPhase === 'BOOT_MENU_USB'
                    ? 'boot-order'
                    : currentPhase === 'SETUP_LANGUAGE' ||
                      currentPhase === 'SETUP_EDITION' ||
                      currentPhase === 'SETUP_TYPE' ||
                      currentPhase === 'DISK_MANAGER'
                    ? 'windows-setup'
                    : currentPhase === 'COPYING_FILES'
                    ? 'boot-spinner'
                    : currentPhase === 'OOBE_SETUP'
                    ? 'login'
                    : 'desktop'
                }
                customOverlayText={
                  currentPhase === 'NO_BOOT_DEVICE'
                    ? 'REBOOT AND SELECT PROPER BOOT DEVICE OR INSERT BOOT MEDIA'
                    : currentPhase === 'COPYING_FILES'
                    ? `Instalando Windows... Aplicando imagen: ${gettingReadyProgress}%`
                    : undefined
                }
                diskLedActive={currentPhase === 'COPYING_FILES' || currentPhase === 'DISK_MANAGER'}
              />

              {/* 1. OVERLAY BOOT_MENU_USB EN EL MONITOR */}
              {currentPhase === 'BOOT_MENU_USB' && (
                <div className="absolute inset-x-4 top-10 bottom-16 rounded-xl bg-[#050810]/95 border-2 border-cyan-400 p-4 text-white z-40 flex flex-col justify-between shadow-2xl font-mono">
                  <div className="border-b border-cyan-800/80 pb-2 flex justify-between items-center text-xs">
                    <span className="font-bold text-cyan-400 uppercase">BOOT DEVICE SELECTION MENU</span>
                    <span className="text-[10px] text-zinc-400">UEFI FIRMWARE</span>
                  </div>

                  <div className="space-y-2 text-xs my-auto">
                    <div className="p-2.5 rounded bg-black/80 border border-rose-500/40 text-zinc-400 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-rose-400" />
                        SSD NVMe Samsung 990 PRO 1TB
                      </span>
                      <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-bold border border-rose-500/40">
                        SIN SO ARRANCABLE
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-cyan-950/80 border-2 border-cyan-400 text-white flex items-center justify-between font-bold shadow-lg">
                      <span className="flex items-center gap-2">
                        <Usb className="w-4 h-4 text-cyan-300 animate-pulse" />
                        UEFI USB Flash Drive (Windows 11 Setup)
                      </span>
                      <span className="text-[10px] bg-cyan-400 text-black px-1.5 py-0.5 rounded font-black">
                        DISPONIBLE / BOOTABLE
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cyan-900/80 flex justify-between items-center text-[10px] text-zinc-400">
                    <span>Único dispositivo arrancable válido: USB UEFI</span>
                    <span className="text-cyan-400 font-bold">[ENTER] Arrancar Setup ➔</span>
                  </div>
                </div>
              )}

              {/* OVERLAY SETUP_LANGUAGE */}
              {currentPhase === 'SETUP_LANGUAGE' && (
                <div className="absolute inset-x-4 top-10 bottom-16 rounded-xl bg-[#0a1c38]/95 border-2 border-cyan-400 p-4 text-white z-40 flex flex-col justify-between shadow-2xl font-sans">
                  <div className="border-b border-cyan-800/80 pb-2 flex justify-between items-center">
                    <span className="font-bold text-xs text-white">Instalación de Windows 11</span>
                    <span className="text-[10px] text-cyan-300 font-mono">WinPE Setup.exe</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <h3 className="font-bold text-sm text-cyan-200">Idioma y Formato Regional</h3>
                    <p className="text-[11px] text-zinc-300">
                      Seleccione las preferencias para la instalación:
                    </p>

                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <div className="p-1.5 rounded bg-black/60 border border-cyan-900 flex justify-between">
                        <span>Idioma que va a instalar:</span>
                        <span className="font-bold text-cyan-300">Español (España)</span>
                      </div>
                      <div className="p-1.5 rounded bg-black/60 border border-cyan-900 flex justify-between">
                        <span>Formato de hora y moneda:</span>
                        <span className="font-bold text-cyan-300">Español (Latinoamérica)</span>
                      </div>
                      <div className="p-1.5 rounded bg-black/60 border border-cyan-900 flex justify-between">
                        <span>Teclado o método de entrada:</span>
                        <span className="font-bold text-cyan-300">Latinoamericano</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cyan-900/80 flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400 text-[10px]">Windows PE en RAM • Disco sin modificar</span>
                    <span className="px-3 py-1 bg-[#0078D4] text-white font-bold rounded">Siguiente ➔</span>
                  </div>
                </div>
              )}

              {/* OVERLAY SETUP_EDITION */}
              {currentPhase === 'SETUP_EDITION' && (
                <div className="absolute inset-x-4 top-10 bottom-16 rounded-xl bg-[#0a1c38]/95 border-2 border-cyan-400 p-4 text-white z-40 flex flex-col justify-between shadow-2xl font-sans">
                  <div className="border-b border-cyan-800/80 pb-2 flex justify-between items-center">
                    <span className="font-bold text-xs text-white">Instalación de Windows 11</span>
                    <span className="text-[10px] text-cyan-300 font-mono">WinPE Setup.exe</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <h3 className="font-bold text-sm text-cyan-200">Seleccionar el sistema operativo a instalar</h3>

                    <div className="space-y-1 pt-1 text-[11px] font-mono">
                      <div className="p-1.5 rounded bg-black/40 border border-zinc-800 text-zinc-400">
                        Windows 11 Home (x64)
                      </div>
                      <div className="p-1.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold flex justify-between">
                        <span>Windows 11 Pro (x64)</span>
                        <span className="text-[9.5px] bg-cyan-400 text-black px-1.5 rounded font-black">SELECCIONADO</span>
                      </div>
                      <div className="p-1.5 rounded bg-black/40 border border-zinc-800 text-zinc-400">
                        Windows 11 Enterprise (x64)
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cyan-900/80 flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400 text-[10px]">Reference Model • Disco sin modificar</span>
                    <span className="px-3 py-1 bg-[#0078D4] text-white font-bold rounded">Siguiente ➔</span>
                  </div>
                </div>
              )}

              {/* OVERLAY SETUP_TYPE */}
              {currentPhase === 'SETUP_TYPE' && (
                <div className="absolute inset-x-4 top-10 bottom-16 rounded-xl bg-[#0a1c38]/95 border-2 border-cyan-400 p-4 text-white z-40 flex flex-col justify-between shadow-2xl font-sans">
                  <div className="border-b border-cyan-800/80 pb-2 flex justify-between items-center">
                    <span className="font-bold text-xs text-white">Instalación de Windows 11</span>
                    <span className="text-[10px] text-cyan-300 font-mono">WinPE Setup.exe</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <h3 className="font-bold text-sm text-cyan-200">¿Qué tipo de instalación deseas?</h3>

                    <div className="space-y-2 pt-1 text-[11px]">
                      <div className="p-2 rounded bg-black/40 border border-zinc-800 text-zinc-400 space-y-0.5">
                        <div className="font-bold text-zinc-300">Actualización: conservar archivos y configuración</div>
                        <div className="text-[10px] text-zinc-500 font-sans-editorial">
                          Requiere ejecución desde un Windows previamente instalado.
                        </div>
                      </div>

                      <div className="p-2 rounded bg-cyan-950/80 border-2 border-cyan-400 text-cyan-200 space-y-0.5 shadow-md">
                        <div className="font-bold text-cyan-300 flex justify-between">
                          <span>Personalizada: instalar solo Windows (avanzado)</span>
                          <span className="text-[9.5px] bg-cyan-400 text-black px-1.5 rounded font-black">RECOMENDADO</span>
                        </div>
                        <div className="text-[10px] text-zinc-300 font-sans-editorial">
                          Permite una instalación limpia desde cero y control total de particiones.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cyan-900/80 flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400 text-[10px]">Reference Model • Disco sin modificar</span>
                    <span className="px-3 py-1 bg-[#0078D4] text-white font-bold rounded">Siguiente ➔</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. USB CONTEXTUAL: MOSTRAR SOLO EN FIRMWARE / MEDIA / SETUP INICIAL */}
            {(currentPhase === 'NO_BOOT_DEVICE' || currentPhase === 'BOOT_MENU_USB' || currentPhase === 'SETUP_LANGUAGE' || currentPhase === 'SETUP_EDITION' || currentPhase === 'SETUP_TYPE') && (
              <div className="p-3 rounded-xl bg-black/70 border border-cyan-950 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Usb className={`w-4 h-4 ${virtualUsbConnected ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
                  <div>
                    <span className="text-white font-bold block text-xs">USB VIRTUAL EVO (32 GB)</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Windows 11 24H2 UEFI (GPT)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRufusGuideOpen(true)}
                    className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-900 text-[10px] font-bold cursor-pointer"
                  >
                    [ GUÍA RUFUS ]
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVirtualUsbConnected(!virtualUsbConnected);
                      if (!virtualUsbConnected && currentPhase === 'NO_BOOT_DEVICE') {
                        setCurrentPhase('BOOT_MENU_USB');
                      }
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                      virtualUsbConnected
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                        : 'bg-cyan-500 text-black font-extrabold'
                    }`}
                  >
                    {virtualUsbConnected ? 'DESCONECTAR' : 'CONECTAR'}
                  </button>
                </div>
              </div>
            )}

            {/* BOOT TARGETS (VISIBLE EN BOOT_MENU_USB) */}
            {currentPhase === 'BOOT_MENU_USB' && (
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-cyan-500/40 space-y-2.5">
                <span className="font-bold text-white text-xs block font-mono border-b border-cyan-950 pb-1">
                  SELECCIÓN DE ARRANQUE (BOOT MENU)
                </span>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="p-2 rounded bg-black/60 border border-rose-500/30 flex items-center justify-between">
                    <span className="text-zinc-300">SSD NVMe (Samsung 990 PRO 1TB)</span>
                    <span className="text-rose-400 font-bold text-[10px]">SIN SO ARRANCABLE</span>
                  </div>

                  <div className="p-2 rounded bg-cyan-950/60 border border-cyan-400 flex items-center justify-between">
                    <span className="text-white font-bold">UEFI USB Flash Drive (Windows Setup)</span>
                    <span className="bg-cyan-400 text-black px-1.5 py-0.5 rounded text-[9.5px] font-black">DISPONIBLE / BOOTABLE</span>
                  </div>
                </div>
              </div>
            )}

            {/* DISK MANAGER (MAPA VISUAL Y FICHA ÚNICA — VISIBLE SOLO EN DISK) */}
            {currentPhase === 'DISK_MANAGER' && (
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-white block">MAPA DE PARTICIONES SSD NVMe</span>
                    <span className="text-[9.5px] text-amber-300">TAMAÑOS: SIMULATED SCENARIO</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateDefaultGptPartitions}
                    className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold cursor-pointer"
                  >
                    + CREAR PARTICIONES GPT
                  </button>
                </div>

                {/* MAPA VISUAL */}
                <div className="w-full h-9 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 flex p-0.5 gap-1">
                  {partitions.map((part) => {
                    let color = 'bg-zinc-800 text-zinc-400';
                    if (part.type === 'ESP') color = 'bg-cyan-600 text-white';
                    if (part.type === 'MSR') color = 'bg-amber-600 text-white';
                    if (part.type === 'WINDOWS') color = 'bg-blue-600 text-white';
                    if (part.type === 'RECOVERY') color = 'bg-purple-600 text-white';

                    const isSelected = part.id === selectedPartitionId;

                    return (
                      <div
                        key={part.id}
                        onClick={() => setSelectedPartitionId(part.id)}
                        style={{
                          width:
                            part.type === 'WINDOWS'
                              ? '75%'
                              : part.type === 'UNALLOCATED'
                              ? '100%'
                              : '8%'
                        }}
                        className={`h-full rounded cursor-pointer transition-all flex items-center justify-center text-[9.5px] font-bold truncate px-1 ${color} ${
                          isSelected ? 'ring-2 ring-white' : ''
                        }`}
                      >
                        [{part.type}]
                      </div>
                    );
                  })}
                </div>

                {/* FICHA ÚNICA LIMPIA */}
                <div className="p-2.5 rounded-lg bg-black/80 border border-cyan-500/40 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between border-b border-cyan-950 pb-1">
                    <span className="font-bold text-cyan-300 text-xs">{activePartitionDetail.name}</span>
                    <span className="text-zinc-400 text-[10px]">FILESYSTEM: {activePartitionDetail.fileSystem}</span>
                  </div>

                  <div className="text-[11px] text-zinc-200">
                    <span className="text-zinc-500 text-[10px] block">USADA POR:</span>
                    <span className="text-cyan-300">{activePartitionDetail.usedBy}</span>
                  </div>

                  <div className="text-[11px] text-zinc-300 font-sans-editorial">
                    {activePartitionDetail.purpose}
                  </div>
                </div>

                <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>⚠️ SIMULATED ONLY // NO SE EJECUTA EN TU DISCO</span>
                </div>
              </div>
            )}

            {/* PIPELINE DE IMAGEN (VISIBLE SOLO EN IMAGE) */}
            {currentPhase === 'COPYING_FILES' && (
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-cyan-500/40 space-y-2.5">
                <span className="font-bold text-white text-xs block font-mono border-b border-cyan-950 pb-1">
                  APLICACIÓN DE IMAGEN
                </span>

                <div className="grid grid-cols-5 gap-1 text-[9px] font-mono text-center">
                  <div className="p-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold">IMAGE [OK]</div>
                  <div className="p-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold animate-pulse">FILES [ACTIVE]</div>
                  <div className={`p-1 rounded border text-zinc-400 ${copyProgress > 50 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-800'}`}>REGISTRY</div>
                  <div className={`p-1 rounded border text-zinc-400 ${copyProgress > 80 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-800'}`}>DRIVERS</div>
                  <div className={`p-1 rounded border text-zinc-400 ${gettingReadyProgress > 50 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-800'}`}>BCD</div>
                </div>

                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${copyProgress}%` }} className="bg-cyan-400 h-full transition-all duration-300" />
                </div>
              </div>
            )}

            {/* SECUENCIA DE BOOT (VISIBLE SOLO EN OOBE) */}
            {currentPhase === 'OOBE_SETUP' && (
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-cyan-500/40 space-y-2">
                <span className="font-bold text-white text-xs block font-mono border-b border-cyan-950 pb-1">
                  SECUENCIA DE PRIMER ARRANQUE (REPRESENTACIÓN EDUCATIVA SIMULADA)
                </span>
                <div className="p-2 rounded bg-black/80 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                  <span>BOOT MANAGER</span>➔<span>LOADER</span>➔<span>KERNEL</span>➔<span className="font-bold text-emerald-400">OOBE</span>
                </div>
              </div>
            )}

            {/* CHECKLIST (VISIBLE SOLO EN BASELINE) */}
            {currentPhase === 'POST_INSTALL_BASELINE' && (
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-cyan-500/40 space-y-2.5">
                <div className="p-1.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 text-center font-bold text-xs uppercase">
                  ESCRITORIO VISIBLE ≠ WINDOWS ESTABLE
                </div>

                <div className="space-y-1 text-xs font-mono">
                  {POST_INSTALL_BASELINE_TASKS.map((t) => {
                    const isDone = completedBaselineTasks.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleBaselineTask(t.id)}
                        className={`p-2 rounded border cursor-pointer flex items-center justify-between ${
                          isDone ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-black/60 border-zinc-900 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isDone ? 'bg-emerald-400 text-black border-emerald-400' : 'border-zinc-700 bg-black'}`}>
                            {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="font-bold text-xs text-white">{t.name}</span>
                        </div>
                        <span className="text-[9px] text-cyan-400 font-mono">{t.importance}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ====================================================
              45% DERECHA: EVO X-RAY // QUÉ ESTÁ HACIENDO WINDOWS
          ==================================================== */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090d14] border border-cyan-500/40 space-y-3 shadow-2xl">
              {/* HEADER Y ACCIÓN PROFUNDIZAR */}
              <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="font-bold text-cyan-300 text-xs tracking-wider uppercase">
                    EVO X-RAY // QUÉ ESTÁ HACIENDO WINDOWS
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setDeepXRayOpen(!deepXRayOpen)}
                  className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>[ PROFUNDIZAR ]</span>
                  {deepXRayOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* 4 BLOQUES LIMPIOS RIGUROSOS */}
              <div className="space-y-2 text-xs font-mono">
                <div className="pb-1.5 border-b border-zinc-900">
                  <span className="text-cyan-400 font-bold block text-[10px] uppercase">1. AHORA:</span>
                  <p className="text-white text-[11.5px] font-sans-editorial font-bold">{activeXRay.ahora}</p>
                </div>

                <div className="pb-1.5 border-b border-zinc-900">
                  <span className="text-zinc-400 font-bold block text-[10px] uppercase">2. POR DENTRO:</span>
                  <p className="text-zinc-200 text-[11px] font-sans-editorial leading-relaxed">{activeXRay.porDentro}</p>
                </div>

                <div className="pb-1.5 border-b border-zinc-900">
                  <span className="text-emerald-400 font-bold block text-[10px] uppercase">3. QUÉ CAMBIA:</span>
                  <p className="text-emerald-200 text-[11px] font-sans-editorial leading-relaxed">{activeXRay.queCambia}</p>
                </div>

                <div>
                  <span className="text-amber-400 font-bold block text-[10px] uppercase">4. SIGUIENTE:</span>
                  <p className="text-amber-200 text-[11px] font-sans-editorial leading-relaxed">{activeXRay.siguiente}</p>
                </div>
              </div>

              {/* DETALLE TÉCNICO PROFUNDIZAR (COLAPSADO POR DEFECTO) */}
              {deepXRayOpen && (
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-[10.5px] font-mono space-y-1.5 animate-fadeIn">
                  <span className="font-bold text-cyan-300 block text-[10.5px] uppercase border-b border-cyan-900 pb-1">
                    MODELO TÉCNICO DE REFERENCIA (SIMULATED)
                  </span>
                  <div>
                    <span className="text-zinc-500">PROCESO:</span> <span className="text-white">{activeXRay.deepDetails.proceso}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">ARCHIVO / MODELO:</span> <span className="text-cyan-200">{activeXRay.deepDetails.archivo}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">COMPONENTE:</span> <span className="text-white">{activeXRay.deepDetails.componente}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">CADENA BOOT:</span> <span className="text-amber-300">{activeXRay.deepDetails.bootChain}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">ESTADO DEL LAB:</span> <span className="text-emerald-400 font-bold">{activeXRay.deepDetails.riesgo}</span>
                  </div>
                </div>
              )}

              {/* RESUMEN FINAL STABLE (VISIBLE SOLO EN STABLE) */}
              {currentPhase === 'SYSTEM_FINAL_STABLE' && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/60 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-emerald-900 pb-1">
                    <span className="font-bold text-emerald-300">BASELINE SIMULADO COMPLETADO</span>
                    <span className="text-[10px] text-zinc-400">ESTADO LAB: COMPLETADO</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className="p-1 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">GPT: OK</div>
                    <div className="p-1 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">ESP: OK</div>
                    <div className="p-1 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">WINDOWS: OK</div>
                    <div className="p-1 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">BCD: OK</div>
                    <div className="p-1 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">WINRE: OK</div>
                    <div className="p-1 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">BASELINE: OK</div>
                  </div>

                  <p className="text-[9.5px] text-zinc-400 italic font-sans-editorial pt-0.5">
                    * Esto es una simulación educativa y no certifica la estabilidad de una PC real.
                  </p>
                </div>
              )}

              {/* ACCIÓN PRINCIPAL DOMINANTE ÚNICA */}
              <div className="pt-2 border-t border-cyan-950">
                {currentPhase === 'NO_BOOT_DEVICE' && (
                  <button
                    type="button"
                    onClick={() => {
                      setVirtualUsbConnected(true);
                      setCurrentPhase('BOOT_MENU_USB');
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>CONECTAR USB Y IR A BOOT MENU ➔</span>
                  </button>
                )}

                {currentPhase === 'BOOT_MENU_USB' && (
                  <button
                    type="button"
                    onClick={() => setCurrentPhase('SETUP_LANGUAGE')}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>ARRANCAR WINDOWS SETUP (UEFI) ➔</span>
                  </button>
                )}

                {currentPhase === 'SETUP_LANGUAGE' && (
                  <button
                    type="button"
                    onClick={() => setCurrentPhase('SETUP_EDITION')}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>CONTINUAR A ELECCIÓN DE EDICIÓN ➔</span>
                  </button>
                )}

                {currentPhase === 'SETUP_EDITION' && (
                  <button
                    type="button"
                    onClick={() => setCurrentPhase('SETUP_TYPE')}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>ELEGIR INSTALACIÓN PERSONALIZADA ➔</span>
                  </button>
                )}

                {currentPhase === 'SETUP_TYPE' && (
                  <button
                    type="button"
                    onClick={() => setCurrentPhase('DISK_MANAGER')}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>ABRIR GESTOR DE DISCOS ➔</span>
                  </button>
                )}

                {currentPhase === 'DISK_MANAGER' && (
                  <button
                    type="button"
                    disabled={!partitions.some((p) => p.type === 'WINDOWS')}
                    onClick={() => setCurrentPhase('COPYING_FILES')}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>INSTALAR EN PARTICIÓN DE WINDOWS (NTFS) ➔</span>
                  </button>
                )}

                {currentPhase === 'COPYING_FILES' && (
                  <div className="text-center text-[11px] text-cyan-300 font-mono py-1 animate-pulse">
                    Aplicando imagen de Windows a la partición destino...
                  </div>
                )}

                {currentPhase === 'OOBE_SETUP' && (
                  <button
                    type="button"
                    onClick={() => setCurrentPhase('POST_INSTALL_BASELINE')}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>ENTRAR AL ESCRITORIO // BASELINE ➔</span>
                  </button>
                )}

                {currentPhase === 'POST_INSTALL_BASELINE' && (
                  <button
                    type="button"
                    disabled={completedBaselineTasks.length < POST_INSTALL_BASELINE_TASKS.length}
                    onClick={() => setCurrentPhase('SYSTEM_FINAL_STABLE')}
                    className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>CONFIRMAR BASELINE COMPLETADO ➔</span>
                  </button>
                )}

                {currentPhase === 'SYSTEM_FINAL_STABLE' && (
                  <button
                    type="button"
                    onClick={handleResetVirtualDisk}
                    className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <span>FINALIZAR Y REINICIAR SIMULADOR ➔</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 2: CHALLENGE ERRORS (4 CASOS PRESERVADOS)
      ======================================================== */}
      {labMode === 'CHALLENGE_ERRORS' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {INSTALL_CHALLENGES.map((ch) => {
              const isSelected = ch.id === selectedChallengeId;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setSelectedChallengeId(ch.id);
                    setChallengeResolved(false);
                    setChallengeFeedback(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-white shadow ring-1 ring-rose-400'
                      : 'bg-black/60 border-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[9.5px] font-mono text-rose-400 block font-bold">
                    {ch.code}
                  </span>
                  <span className="font-bold text-xs text-white block truncate">
                    {ch.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-[#0b0e14] border border-rose-500/50 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-rose-950 pb-2">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase">
                ERROR REPORTADO POR EL INSTALADOR
              </span>
              <span className="text-zinc-500 text-xs">CÓDIGO: {activeChallenge.code}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-700 space-y-1.5 text-left font-sans">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Instalación de Windows</span>
              </div>
              <p className="text-zinc-200 text-xs leading-relaxed italic">
                “{activeChallenge.errorDialogText}”
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-xs text-white block font-mono">
                ¿Cuál es la acción técnica correcta para resolver este bloqueo?
              </span>
              <div className="grid grid-cols-1 gap-2">
                {activeChallenge.availableFixOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (opt.isCorrect) {
                        setChallengeResolved(true);
                      }
                      setChallengeFeedback(opt.explanation);
                    }}
                    className="p-3 rounded-xl bg-black/60 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-left text-xs transition-colors cursor-pointer text-zinc-300"
                  >
                    <span className="font-bold text-white block">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {challengeFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed font-sans-editorial ${
                  challengeResolved
                    ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500 text-amber-200'
                }`}
              >
                <div className="font-bold font-mono text-xs uppercase mb-1">
                  {challengeResolved ? '✔ RESOLUCIÓN PERICIAL CORRECTA:' : '✖ ADVERTENCIA METODOLÓGICA:'}
                </div>
                <p>{challengeFeedback}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RUFUS CREATION GUIDE MODAL */}
      {rufusGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#0c1017] border border-cyan-400 p-5 space-y-4 text-white font-mono shadow-2xl">
            <div className="flex justify-between items-center border-b border-cyan-950 pb-2">
              <div className="flex items-center gap-2">
                <Usb className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-cyan-300">
                  CREACIÓN DE USB BOOTEABLE (RUFUS)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRufusGuideOpen(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-black/60 border border-zinc-800 space-y-0.5">
                <span className="text-cyan-400 font-bold block text-[10px]">1. DESCARGAR WINDOWS:</span>
                <span className="text-zinc-300">Microsoft → Windows 11 ISO (Win11_x64.iso)</span>
              </div>

              <div className="p-2 rounded bg-black/60 border border-zinc-800 space-y-0.5">
                <span className="text-cyan-400 font-bold block text-[10px]">2. CONECTAR PENDRIVE:</span>
                <span className="text-zinc-300">Unidad USB 16 GB o 32 GB limpia</span>
              </div>

              <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-500/40 space-y-1">
                <span className="text-cyan-300 font-bold block text-[10px]">3. CONFIGURACIÓN EN RUFUS:</span>
                <div className="text-[10.5px] space-y-0.5 text-zinc-200">
                  <div>DISPOSITIVO: <span className="text-white font-bold">[ Kingston USB 32 GB ]</span></div>
                  <div>SELECCIÓN ARRANQUE: <span className="text-white font-bold">[ Win11_x64.iso ]</span></div>
                  <div>ESQUEMA DE PARTICIÓN: <span className="text-cyan-300 font-bold">[ GPT ]</span></div>
                  <div>SISTEMA DE DESTINO: <span className="text-cyan-300 font-bold">[ UEFI (no CSM) ]</span></div>
                </div>
              </div>

              <div className="p-2 rounded bg-amber-950/30 border border-amber-500/40 text-amber-200 text-[10.5px] space-y-0.5">
                <span className="font-bold block text-[10px]">4. EMPEZAR:</span>
                <span>⚠️ EL USB SERÁ PREPARADO Y SUS DATOS SERÁN BORRADOS</span>
              </div>

              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[10.5px] font-bold">
                5. USB BOOTEABLE LISTO
              </div>

              <div className="p-2 rounded bg-black/60 border border-zinc-800 text-[10.5px] text-zinc-300">
                6. REINICIAR PC ➔ PRESIONAR TECLA BOOT MENU (F8/F11/F12) ➔ SELECCIONAR UEFI USB
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRufusGuideOpen(false)}
              className="w-full py-2 bg-cyan-400 text-black font-extrabold text-xs rounded-xl cursor-pointer"
            >
              ENTENDIDO // CERRAR GUÍA RUFUS
            </button>
          </div>
        </div>
      )}

      {/* TUTOR MODAL */}
      <EvoTutorModal
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        stepName={`Instalación de Windows - Etapa: ${currentPhase.replace(/_/g, ' ')}`}
        simpleExplanation={activeXRay.ahora + " " + activeXRay.porDentro}
      />

      {/* GLOSSARY MODAL */}
      <TermGlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
};
