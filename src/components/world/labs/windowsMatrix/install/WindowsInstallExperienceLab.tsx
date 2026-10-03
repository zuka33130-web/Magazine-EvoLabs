// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS INSTALLATION LAB — "DE UN DISCO VACÍO A WINDOWS FUNCIONAL"
// 100% Safe Virtual Disk Simulator (NVMe 1TB) & End-to-End Installation Flow
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Usb,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ArrowLeft,
  Terminal,
  HelpCircle,
  FileCheck2,
  ShieldCheck,
  Cpu,
  Monitor,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  INITIAL_VIRTUAL_DISK_PARTITIONS,
  STANDARD_WINDOWS_GPT_PARTITIONS,
  INSTALL_CHALLENGES,
  POST_INSTALL_BASELINE_TASKS,
  InstallErrorChallenge
} from '../data/installationData';
import { DiskPartitionItem } from '../engine/types';
import { SimulatedMonitorScreen } from '../components/SimulatedMonitorScreen';
import { EvoTutorModal } from '../components/EvoTutorModal';
import { TermGlossaryModal } from '../components/TermGlossaryModal';

type InstallMode = 'GUIDED_TUTORIAL' | 'CHALLENGE_ERRORS' | 'FREE_SIMULATOR';
type InstallPhase =
  | 'NO_BOOT_DEVICE'
  | 'BOOT_MENU_USB'
  | 'SETUP_LANGUAGE'
  | 'SETUP_EDITION'
  | 'SETUP_TYPE'
  | 'DISK_MANAGER'
  | 'COPYING_FILES'
  | 'OOBE_SETUP'
  | 'DESKTOP_READY'
  | 'POST_INSTALL_BASELINE'
  | 'SYSTEM_FINAL_STABLE';

export const WindowsInstallExperienceLab: React.FC = () => {
  const [labMode, setLabMode] = useState<InstallMode>('GUIDED_TUTORIAL');
  const [currentPhase, setCurrentPhase] = useState<InstallPhase>('NO_BOOT_DEVICE');
  const [virtualUsbConnected, setVirtualUsbConnected] = useState<boolean>(false);
  const [partitions, setPartitions] = useState<DiskPartitionItem[]>(INITIAL_VIRTUAL_DISK_PARTITIONS);
  const [selectedPartitionId, setSelectedPartitionId] = useState<string>('part-unallocated');

  // Copying Progress Animation
  const [copyProgress, setCopyProgress] = useState<number>(0);
  const [gettingReadyProgress, setGettingReadyProgress] = useState<number>(0);

  // Selected partition detail modal
  const [inspectedPartition, setInspectedPartition] = useState<DiskPartitionItem | null>(null);

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
          if (prev < 100) return prev + 25;
          return 100;
        });
        if (copyProgress >= 100) {
          setGettingReadyProgress((prev) => {
            if (prev < 100) return prev + 20;
            setCurrentPhase('OOBE_SETUP');
            return 100;
          });
        }
      }, 700);
    }
    return () => clearInterval(interval);
  }, [currentPhase, copyProgress]);

  // Actions for disk manager
  const handleCreateDefaultGptPartitions = () => {
    setPartitions(STANDARD_WINDOWS_GPT_PARTITIONS);
    setSelectedPartitionId('part-windows');
  };

  const handleDeletePartition = (id: string) => {
    if (partitions.length <= 1) {
      setPartitions(INITIAL_VIRTUAL_DISK_PARTITIONS);
      setSelectedPartitionId('part-unallocated');
      return;
    }
    const filtered = partitions.filter((p) => p.id !== id);
    setPartitions(filtered);
    setSelectedPartitionId(filtered[0]?.id || '');
  };

  const handleFormatPartition = (id: string) => {
    setPartitions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, fileSystem: p.type === 'ESP' ? 'FAT32' : 'NTFS' } : p))
    );
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

  return (
    <div className="space-y-5 font-mono-tech select-none">
      {/* Top Banner & Mode Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
              LABORATORIO DE INSTALACIÓN // DISCO VIRTUAL 1TB
            </span>
            <span className="text-zinc-500 text-[10.5px]">
              AMBIENTE SEGURO DE SIMULACIÓN
            </span>
          </div>
          <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
            De un Disco Vacío a Windows Estable
          </h2>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-cyan-950 text-xs">
          <button
            type="button"
            onClick={() => {
              setLabMode('GUIDED_TUTORIAL');
              handleResetVirtualDisk();
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              labMode === 'GUIDED_TUTORIAL'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            TUTORIAL GUIADO
          </button>

          <button
            type="button"
            onClick={() => setLabMode('CHALLENGE_ERRORS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              labMode === 'CHALLENGE_ERRORS'
                ? 'bg-rose-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            DESAFÍO DE ERRORES (8 CASOS)
          </button>

          <button
            type="button"
            onClick={handleResetVirtualDisk}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer ml-1"
            title="Reiniciar simulador de disco"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          MODE 1: GUIDED TUTORIAL & FREE SIMULATOR
      ======================================================== */}
      {labMode === 'GUIDED_TUTORIAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT: SIMULATED MONITOR VIEW (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <SimulatedMonitorScreen
              screenState={
                currentPhase === 'NO_BOOT_DEVICE'
                  ? 'black-screen-cursor'
                  : currentPhase === 'BOOT_MENU_USB'
                  ? 'boot-order'
                  : currentPhase === 'DISK_MANAGER' ||
                    currentPhase === 'SETUP_LANGUAGE' ||
                    currentPhase === 'SETUP_EDITION' ||
                    currentPhase === 'SETUP_TYPE'
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
                  ? `Instalando Windows... Archivos listos: ${gettingReadyProgress}%`
                  : undefined
              }
              diskLedActive={currentPhase === 'COPYING_FILES' || currentPhase === 'DISK_MANAGER'}
            />

            {/* Virtual Peripheral Rack: USB Drive Connector */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-950 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Usb
                  className={`w-5 h-5 ${
                    virtualUsbConnected ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'
                  }`}
                />
                <div>
                  <span className="text-white font-bold block text-xs">
                    PENDREIVE USB VIRTUAL EVO (32 GB)
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Windows 11 24H2 UEFI Bootable ISO (Ventoy/Rufus)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setVirtualUsbConnected(!virtualUsbConnected);
                  if (!virtualUsbConnected && currentPhase === 'NO_BOOT_DEVICE') {
                    setCurrentPhase('BOOT_MENU_USB');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  virtualUsbConnected
                    ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300 hover:bg-rose-900'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold shadow-md'
                }`}
              >
                {virtualUsbConnected ? 'DESCONECTAR USB' : 'CONECTAR USB'}
              </button>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE INSTALLATION ENGINE & DISK MANAGER (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Step Wizard Navigator Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-950 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
                    FASE: {currentPhase.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-zinc-500 text-[10.5px]">DISCO 0: 953.8 GiB NVMe</span>
              </div>

              {/* 1. NO BOOT DEVICE PHASE */}
              {currentPhase === 'NO_BOOT_DEVICE' && (
                <div className="p-4 rounded-xl bg-black/70 border border-amber-500/40 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        La PC está encendida pero no tiene sistema operativo.
                      </h4>
                      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-1">
                        El monitor muestra la pantalla negra con cursor parpadeante o "No bootable device". El disco NVMe está 100% virgen. Conectá el pendrive virtual a la izquierda para arrancar el instalador.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. BOOT MENU USB PHASE */}
              {currentPhase === 'BOOT_MENU_USB' && (
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
                  <h4 className="font-bold text-white text-sm">
                    Pendrive USB detectado por la placa madre.
                  </h4>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    Presioná el botón de arranque para que la BIOS cargue el instalador de Windows en modo nativo UEFI.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentPhase('SETUP_LANGUAGE')}
                    className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <span>ARRANCAR WINDOWS SETUP (UEFI) ➔</span>
                  </button>
                </div>
              )}

              {/* 3. SETUP LANGUAGE / EDITION */}
              {(currentPhase === 'SETUP_LANGUAGE' || currentPhase === 'SETUP_EDITION') && (
                <div className="p-4 rounded-xl bg-black/60 border border-cyan-950 space-y-3">
                  <h4 className="font-bold text-white text-sm">
                    Configuración regional y selección de edición
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                      Idioma: <span className="text-cyan-300 font-bold">Español (Latinoamérica)</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                      Edición: <span className="text-cyan-300 font-bold">Windows 11 Pro (x64)</span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentPhase('DISK_MANAGER')}
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      CONTINUAR AL GESTOR DE DISCOS ➔
                    </button>
                  </div>
                </div>
              )}

              {/* 4. DISK MANAGER (THE CORE VIRTUAL DISK CONTROLLER) */}
              {currentPhase === 'DISK_MANAGER' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">
                      GESTOR DE PARTICIONES DISCO 0 (953.8 GB NVMe GPT)
                    </span>
                    <button
                      type="button"
                      onClick={handleCreateDefaultGptPartitions}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>GENERAR PARTICIONES WINDOWS (AUTOMÁTICO)</span>
                    </button>
                  </div>

                  {/* Visual Partition Bar */}
                  <div className="w-full h-10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex p-1 gap-1">
                    {partitions.map((part) => {
                      let color = 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400';
                      if (part.type === 'ESP') color = 'bg-cyan-600 hover:bg-cyan-500 text-white';
                      if (part.type === 'MSR') color = 'bg-amber-600 hover:bg-amber-500 text-white';
                      if (part.type === 'WINDOWS') color = 'bg-blue-600 hover:bg-blue-500 text-white';
                      if (part.type === 'RECOVERY') color = 'bg-purple-600 hover:bg-purple-500 text-white';

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
                          className={`h-full rounded cursor-pointer transition-all flex items-center justify-center text-[10px] font-bold truncate px-1 ${color} ${
                            isSelected ? 'ring-2 ring-white shadow-lg' : ''
                          }`}
                        >
                          {part.type}
                        </div>
                      );
                    })}
                  </div>

                  {/* Partitions List Table */}
                  <div className="space-y-1.5 text-xs font-mono max-h-48 overflow-y-auto">
                    {partitions.map((p) => {
                      const isSelected = p.id === selectedPartitionId;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPartitionId(p.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-400 text-white'
                              : 'bg-black/40 border-zinc-900 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{p.name}</span>
                            <span className="text-[10px] text-zinc-400">({p.fileSystem})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-cyan-300">
                              {p.sizeMb > 1024 ? `${(p.sizeMb / 1024).toFixed(1)} GB` : `${p.sizeMb} MB`}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectedPartition(p);
                              }}
                              className="text-[10px] text-cyan-400 hover:underline"
                            >
                              [ VER MÁS ]
                            </button>
                            {p.canDelete && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePartition(p.id);
                                }}
                                className="text-rose-400 hover:text-rose-300 p-1"
                                title="Eliminar partición"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Partition Explanation Box */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1">
                    <div className="flex items-center justify-between text-cyan-300 font-bold text-[10.5px]">
                      <span>EXPLICACIÓN EVO: {activePartition.name}</span>
                      <span className="text-zinc-500">{activePartition.fileSystem}</span>
                    </div>
                    <p className="text-zinc-200 font-sans-editorial leading-relaxed">
                      {activePartition.explanation.simple}
                    </p>
                  </div>

                  {/* Disk Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-cyan-950">
                    <button
                      type="button"
                      onClick={() => handleCreateDefaultGptPartitions()}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-700"
                    >
                      Crear Nueva Partición
                    </button>

                    <button
                      type="button"
                      disabled={!partitions.some((p) => p.type === 'WINDOWS')}
                      onClick={() => setCurrentPhase('COPYING_FILES')}
                      className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <span>INSTALAR EN PARTICIÓN C: (NTFS) ➔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 5. COPYING FILES PHASE */}
              {currentPhase === 'COPYING_FILES' && (
                <div className="p-5 rounded-xl bg-black/70 border border-cyan-500/50 space-y-4 text-center">
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-base text-white uppercase">
                      Copiando Archivos de Windows al SSD NVMe
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Descompresión de install.wim e inyección de controladores en el volumen C:.
                    </p>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-2 max-w-md mx-auto text-left text-xs font-mono">
                    <div className="flex justify-between text-zinc-300">
                      <span>Copiando archivos:</span>
                      <span className="text-cyan-300 font-bold">{copyProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${copyProgress}%` }}
                        className="bg-cyan-400 h-full transition-all duration-300"
                      />
                    </div>

                    <div className="flex justify-between text-zinc-300 pt-2">
                      <span>Preparando archivos para instalación:</span>
                      <span className="text-emerald-300 font-bold">{gettingReadyProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${gettingReadyProgress}%` }}
                        className="bg-emerald-400 h-full transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. OOBE SETUP PHASE */}
              {currentPhase === 'OOBE_SETUP' && (
                <div className="p-4 rounded-xl bg-black/60 border border-cyan-950 space-y-3">
                  <h4 className="font-bold text-white text-sm">
                    Experiencia Fuera de la Caja (OOBE - Out of Box Experience)
                  </h4>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    Windows arrancó por primera vez desde el SSD. Configuración de país, distribución de teclado y cuenta local.
                  </p>
                  <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/40 text-xs">
                    <strong className="text-cyan-300 font-bold block mb-1">
                      TRUCO PERICIAL // CREAR CUENTA LOCAL SIN INTERNET:
                    </strong>
                    <code className="text-white bg-black px-2 py-0.5 rounded text-[11px] font-mono">
                      Shift+F10 ➔ OOBE\BYPASSNRO
                    </code>
                    <p className="text-zinc-400 text-[10.5px] mt-1">
                      Reinicia el asistente sin la exigencia obligatoria de cuenta Microsoft en línea.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentPhase('POST_INSTALL_BASELINE')}
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      ENTRAR AL ESCRITORIO // POST-INSTALACIÓN ➔
                    </button>
                  </div>
                </div>
              )}

              {/* 7. POST INSTALL BASELINE (DRIVERS & SYSTEM RESTORE) */}
              {currentPhase === 'POST_INSTALL_BASELINE' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">
                      Lista de Verificación Post-Instalación (EVO Baseline)
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Completá cada tarea técnica antes de considerar el equipo listo para producción:
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    {POST_INSTALL_BASELINE_TASKS.map((t) => {
                      const isDone = completedBaselineTasks.includes(t.id);
                      return (
                        <div
                          key={t.id}
                          onClick={() => toggleBaselineTask(t.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isDone
                              ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                              : 'bg-black/50 border-zinc-900 text-zinc-300 hover:border-cyan-500/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                                isDone
                                  ? 'bg-emerald-400 text-black border-emerald-400 font-bold'
                                  : 'border-zinc-700 bg-black'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{t.name}</span>
                              <span className="text-[10.5px] text-zinc-400 font-sans-editorial">
                                {t.description}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded ${
                              t.importance === 'CRÍTICA'
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                            }`}
                          >
                            {t.importance}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 8. SYSTEM FINAL STABLE */}
              {currentPhase === 'SYSTEM_FINAL_STABLE' && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-zinc-950 to-black border-2 border-emerald-500 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-base sm:text-lg text-white uppercase">
                    ¡Instalación 100% Completa & Verificada!
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans-editorial max-w-md mx-auto leading-relaxed">
                    El sistema cuenta con particionamiento GPT nativo, controladores WHQL sin advertencias y punto de restauración creado.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetVirtualDisk}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    REINICIAR EXPERIMENTO
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 2: CHALLENGE ERRORS (8 INSTALL FAILS)
      ======================================================== */}
      {labMode === 'CHALLENGE_ERRORS' && (
        <div className="space-y-4">
          {/* Challenge Selector Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
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
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg ring-1 ring-rose-400'
                      : 'bg-black/60 border-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-rose-400 block font-bold">
                    {ch.code}
                  </span>
                  <span className="font-bold text-xs text-white block mt-0.5 truncate">
                    {ch.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Challenge Diagnostic Workspace */}
          <div className="p-5 rounded-2xl bg-[#0b0e14] border border-rose-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-rose-950 pb-2.5">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase">
                ERROR REPORTADO POR EL INSTALADOR
              </span>
              <span className="text-zinc-500 text-xs">CÓDIGO: {activeChallenge.code}</span>
            </div>

            {/* Error Message Dialog Box (Windows Style) */}
            <div className="p-4 rounded-xl bg-black/80 border border-zinc-700 space-y-2 max-w-xl mx-auto shadow-inner text-left font-sans">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Instalación de Windows</span>
              </div>
              <p className="text-zinc-200 text-xs leading-relaxed italic">
                “{activeChallenge.errorDialogText}”
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-white block font-mono">
                ¿Cuál es la acción técnica correcta para resolver este bloqueo?
              </span>
              <div className="grid grid-cols-1 gap-2.5">
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
                    className="p-3.5 rounded-xl bg-black/60 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-left text-xs transition-colors cursor-pointer text-zinc-300 space-y-1"
                  >
                    <span className="font-bold text-white block">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Box */}
            {challengeFeedback && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed font-sans-editorial ${
                  challengeResolved
                    ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500 text-amber-200'
                }`}
              >
                <div className="font-bold font-mono text-xs uppercase mb-1">
                  {challengeResolved ? '✔ RESOLUCIÓN PERICIAL CORRECTA:' : '✖ ADVERTENCIA METODOLÓGICA:'}
                </div>
                <p>{challengeFeedback}</p>
                {challengeResolved && (
                  <p className="text-zinc-300 text-[11.5px] mt-2 pt-2 border-t border-emerald-500/30">
                    {activeChallenge.resolutionSummary}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Partition Deep Explanation Modal */}
      {inspectedPartition && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-[#0c1017] border border-cyan-400 p-6 space-y-4 text-white font-sans-editorial">
            <div className="flex justify-between items-center border-b border-cyan-950 pb-2">
              <h3 className="font-bold text-base text-cyan-300">
                {inspectedPartition.name}
              </h3>
              <button
                type="button"
                onClick={() => setInspectedPartition(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong className="text-cyan-400 font-mono">EN SIMPLE: </strong>
                {inspectedPartition.explanation.simple}
              </p>
              <p>
                <strong className="text-amber-400 font-mono">DETALLE TÉCNICO: </strong>
                {inspectedPartition.explanation.detailed}
              </p>
              <p>
                <strong className="text-emerald-400 font-mono">POR QUÉ ES NECESARIA: </strong>
                {inspectedPartition.explanation.whyNeeded}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInspectedPartition(null)}
              className="w-full py-2 bg-cyan-400 text-black font-extrabold text-xs rounded-xl"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* Tutor Modal */}
      <EvoTutorModal
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        stepName="Instalación de Windows"
        simpleExplanation="Instalar Windows es simplemente copiar los archivos del sistema a un disco y ordenarle a la computadora que arranque desde allí."
      />

      {/* Glossary Modal */}
      <TermGlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
};
