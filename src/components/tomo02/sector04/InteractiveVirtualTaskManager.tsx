import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Wifi,
  HardDrive,
  Users as UsersIcon,
  List,
  Layers,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  Search,
  Sliders,
  X,
  FileCode,
  Lock,
} from 'lucide-react';

export type TaskManagerScenario =
  | 'NORMAL'
  | 'CASE_1_SINGLE_THREAD'
  | 'CASE_2_DISK_100'
  | 'CASE_3_RAM_LEAK'
  | 'CASE_4_GPU_SHARED'
  | 'CASE_5_SUSPICIOUS';

export type TaskManagerTab =
  | 'processes'
  | 'performance'
  | 'app_history'
  | 'startup'
  | 'users'
  | 'details'
  | 'services';

export type PerformanceSubTab = 'cpu' | 'memory' | 'disk' | 'network' | 'gpu';

interface SimulatedProcess {
  pid: number;
  ppid: number;
  name: string;
  category: 'App' | 'Background' | 'Windows';
  user: string;
  cpuPercent: number; // e.g. 12.5
  memorySetMB: number; // Working Set MB
  privateBytesMB: number; // Private Bytes MB
  diskMBps: number; // MB/s
  diskLatencyMs: number;
  networkMbps: number;
  gpuPercent: number;
  gpuEngine: '3D' | '2D' | 'Video Decode' | 'Compute' | 'Copy';
  vramDedicatedMB: number;
  vramSharedMB: number;
  threads: number;
  handles: number;
  commandLine: string;
  status: 'Running' | 'Suspended';
  isSystem32: boolean;
  signature: 'Microsoft Verified' | 'Verified Publisher' | 'Unsigned / Suspicious';
}

interface SimulatedService {
  name: string;
  pid: number | null;
  displayName: string;
  status: 'Running' | 'Stopped';
  group: string;
}

interface InteractiveVirtualTaskManagerProps {
  onBackToTheory?: () => void;
  onScenarioCompleted?: (scenario: TaskManagerScenario) => void;
}

export const InteractiveVirtualTaskManager: React.FC<InteractiveVirtualTaskManagerProps> = ({
  onBackToTheory,
  onScenarioCompleted,
}) => {
  // Scenario & View State
  const [activeScenario, setActiveScenario] = useState<TaskManagerScenario>('NORMAL');
  const [activeTab, setActiveTab] = useState<TaskManagerTab>('processes');
  const [perfSubTab, setPerfSubTab] = useState<PerformanceSubTab>('cpu');
  const [showLogicalCores, setShowLogicalCores] = useState(false);
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<'cpu' | 'memory' | 'disk' | 'net' | 'gpu'>('cpu');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Interactive Tools & Modals
  const [showPowerShellTerminal, setShowPowerShellTerminal] = useState(false);
  const [powerShellOutput, setPowerShellOutput] = useState<string | null>(null);
  const [showKillModal, setShowKillModal] = useState(false);
  const [killedPids, setKilledPids] = useState<number[]>([]);

  // Tutor EVO Diagnosis State per Scenario
  const [userHypothesis, setUserHypothesis] = useState<Record<string, string>>({});
  const [validatedScenarios, setValidatedScenarios] = useState<Record<string, boolean>>({});

  // Reset killed processes on scenario change
  useEffect(() => {
    setKilledPids([]);
    setSelectedPid(null);
  }, [activeScenario]);

  // Base processes mapping depending on Scenario
  const getSimulatedProcesses = (): SimulatedProcess[] => {
    const baseList: SimulatedProcess[] = [
      {
        pid: 4,
        ppid: 0,
        name: 'System',
        category: 'Windows',
        user: 'SYSTEM',
        cpuPercent: 0.1,
        memorySetMB: 12,
        privateBytesMB: 4,
        diskMBps: activeScenario === 'CASE_2_DISK_100' ? 1.2 : 0.01,
        diskLatencyMs: activeScenario === 'CASE_2_DISK_100' ? 240 : 2.1,
        networkMbps: 0,
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 240,
        handles: 4800,
        commandLine: 'ntoskrnl.exe',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      },
      {
        pid: 820,
        ppid: 4,
        name: 'smss.exe',
        category: 'Windows',
        user: 'SYSTEM',
        cpuPercent: 0,
        memorySetMB: 4,
        privateBytesMB: 2,
        diskMBps: 0,
        diskLatencyMs: 1,
        networkMbps: 0,
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 4,
        handles: 80,
        commandLine: '\\SystemRoot\\System32\\smss.exe',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      },
      {
        pid: 1024,
        ppid: 820,
        name: 'csrss.exe',
        category: 'Windows',
        user: 'SYSTEM',
        cpuPercent: 0.2,
        memorySetMB: 18,
        privateBytesMB: 8,
        diskMBps: 0,
        diskLatencyMs: 1,
        networkMbps: 0,
        gpuPercent: 0.5,
        gpuEngine: '2D',
        vramDedicatedMB: 10,
        vramSharedMB: 0,
        threads: 22,
        handles: 720,
        commandLine: '%SystemRoot%\\system32\\csrss.exe ObjectDirectory=\\Windows SharedSection=1024,20480,768',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      },
      {
        pid: 1450,
        ppid: 820,
        name: 'wininit.exe',
        category: 'Windows',
        user: 'SYSTEM',
        cpuPercent: 0,
        memorySetMB: 8,
        privateBytesMB: 3,
        diskMBps: 0,
        diskLatencyMs: 1,
        networkMbps: 0,
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 3,
        handles: 180,
        commandLine: 'wininit.exe',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      },
      {
        pid: 1890,
        ppid: 1450,
        name: 'services.exe',
        category: 'Windows',
        user: 'SYSTEM',
        cpuPercent: 0.1,
        memorySetMB: 14,
        privateBytesMB: 6,
        diskMBps: 0,
        diskLatencyMs: 1,
        networkMbps: 0,
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 12,
        handles: 420,
        commandLine: 'C:\\Windows\\system32\\services.exe',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      },
      {
        pid: 2100,
        ppid: 1890,
        name: 'svchost.exe (DcomLaunch)',
        category: 'Windows',
        user: 'SYSTEM',
        cpuPercent: 0.2,
        memorySetMB: 28,
        privateBytesMB: 14,
        diskMBps: 0,
        diskLatencyMs: 1,
        networkMbps: 0,
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 18,
        handles: 550,
        commandLine: 'C:\\Windows\\system32\\svchost.exe -k DcomLaunch -p',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      },
      {
        pid: 3400,
        ppid: 1450,
        name: 'explorer.exe',
        category: 'App',
        user: 'TECNICO_EVO',
        cpuPercent: 1.2,
        memorySetMB: 185,
        privateBytesMB: 90,
        diskMBps: 0.1,
        diskLatencyMs: 2,
        networkMbps: 0,
        gpuPercent: 1.5,
        gpuEngine: '3D',
        vramDedicatedMB: 45,
        vramSharedMB: 0,
        threads: 85,
        handles: 2100,
        commandLine: 'C:\\Windows\\explorer.exe',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      },
      {
        pid: 4890,
        ppid: 3400,
        name: 'chrome.exe',
        category: 'App',
        user: 'TECNICO_EVO',
        cpuPercent: 2.1,
        memorySetMB: 850,
        privateBytesMB: 620,
        diskMBps: 0.2,
        diskLatencyMs: 3,
        networkMbps: 2.4,
        gpuPercent: 4.2,
        gpuEngine: '3D',
        vramDedicatedMB: 220,
        vramSharedMB: 0,
        threads: 64,
        handles: 1450,
        commandLine: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --type=renderer',
        status: 'Running',
        isSystem32: false,
        signature: 'Verified Publisher',
      },
      {
        pid: 5120,
        ppid: 3400,
        name: 'taskmgr.exe',
        category: 'App',
        user: 'TECNICO_EVO',
        cpuPercent: 0.8,
        memorySetMB: 65,
        privateBytesMB: 35,
        diskMBps: 0,
        diskLatencyMs: 1,
        networkMbps: 0,
        gpuPercent: 0.8,
        gpuEngine: '3D',
        vramDedicatedMB: 18,
        vramSharedMB: 0,
        threads: 18,
        handles: 480,
        commandLine: '"C:\\Windows\\System32\\taskmgr.exe"',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      },
    ];

    // Modify or add specialized processes based on scenario
    if (activeScenario === 'CASE_1_SINGLE_THREAD') {
      baseList.push({
        pid: 7810,
        ppid: 3400,
        name: 'calc_worker.exe',
        category: 'App',
        user: 'TECNICO_EVO',
        cpuPercent: 12.5, // 100% of 1 core on an 8-thread logical CPU
        memorySetMB: 140,
        privateBytesMB: 120,
        diskMBps: 0,
        diskLatencyMs: 1,
        networkMbps: 0,
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 1, // Single Thread saturating 1 Core
        handles: 120,
        commandLine: '"C:\\Tools\\Math\\calc_worker.exe" --infinite-loop-test',
        status: 'Running',
        isSystem32: false,
        signature: 'Verified Publisher',
      });
    } else if (activeScenario === 'CASE_2_DISK_100') {
      baseList.push({
        pid: 8900,
        ppid: 1890,
        name: 'svchost.exe (sysmain)',
        category: 'Background',
        user: 'SYSTEM',
        cpuPercent: 1.5,
        memorySetMB: 210,
        privateBytesMB: 180,
        diskMBps: 1.1, // Low bandwidth MB/s
        diskLatencyMs: 285, // Extreme 100% active time latency in 4K random I/O
        networkMbps: 0,
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 28,
        handles: 890,
        commandLine: 'C:\\Windows\\system32\\svchost.exe -k LocalSystemNetworkRestricted -p -s SysMain',
        status: 'Running',
        isSystem32: true,
        signature: 'Microsoft Verified',
      });
    } else if (activeScenario === 'CASE_3_RAM_LEAK') {
      baseList.push({
        pid: 9240,
        ppid: 3400,
        name: 'AppWorkerService.exe',
        category: 'App',
        user: 'TECNICO_EVO',
        cpuPercent: 3.4,
        memorySetMB: 14200, // Extreme Working Set
        privateBytesMB: 13800, // Massive Private Bytes Memory Leak
        diskMBps: 0.5,
        diskLatencyMs: 8,
        networkMbps: 0.1,
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 14,
        handles: 18500, // Handle Leak too
        commandLine: '"C:\\Program Files\\AppWorker\\AppWorkerService.exe" --background-worker',
        status: 'Running',
        isSystem32: false,
        signature: 'Verified Publisher',
      });
    } else if (activeScenario === 'CASE_4_GPU_SHARED') {
      baseList.push({
        pid: 6100,
        ppid: 3400,
        name: 'blender_render.exe',
        category: 'App',
        user: 'TECNICO_EVO',
        cpuPercent: 8.5,
        memorySetMB: 2800,
        privateBytesMB: 2400,
        diskMBps: 0.2,
        diskLatencyMs: 4,
        networkMbps: 0,
        gpuPercent: 99.0, // GPU Maxed
        gpuEngine: '3D',
        vramDedicatedMB: 6144, // 100% of 6GB Dedicated VRAM
        vramSharedMB: 7200, // Overflow into Shared GPU System RAM
        threads: 48,
        handles: 1200,
        commandLine: '"C:\\Program Files\\Blender\\blender_render.exe" --engine CYCLES',
        status: 'Running',
        isSystem32: false,
        signature: 'Verified Publisher',
      });
    } else if (activeScenario === 'CASE_5_SUSPICIOUS') {
      baseList.push({
        pid: 9920,
        ppid: 3400, // Parent is explorer.exe instead of services.exe!
        name: 'svchost.exe', // Camouflaged name
        category: 'Background',
        user: 'TECNICO_EVO',
        cpuPercent: 5.2,
        memorySetMB: 88,
        privateBytesMB: 65,
        diskMBps: 0,
        diskLatencyMs: 1,
        networkMbps: 18.4, // Outbound network traffic
        gpuPercent: 0,
        gpuEngine: '3D',
        vramDedicatedMB: 0,
        vramSharedMB: 0,
        threads: 6,
        handles: 210,
        commandLine: 'C:\\Users\\TECNICO_EVO\\AppData\\Local\\Temp\\svchost.exe --connect 185.220.101.5:443', // NOT in System32!
        status: 'Running',
        isSystem32: false, // Out of System32 anomaly!
        signature: 'Unsigned / Suspicious',
      });
    }

    return baseList.filter((p) => !killedPids.includes(p.pid));
  };

  const currentProcesses = getSimulatedProcesses();

  // Calculate global hardware telemetries
  const totalCpuPercent = Math.min(
    100,
    currentProcesses.reduce((acc, p) => acc + p.cpuPercent, 0)
  );

  const totalRamUsedMB = currentProcesses.reduce((acc, p) => acc + p.memorySetMB, 0);
  const totalRamSystemMB = 16384; // 16 GB System RAM
  const totalCommitMB = currentProcesses.reduce((acc, p) => acc + p.privateBytesMB, 0) + 4000;
  const commitLimitMB = 24576; // 16GB RAM + 8GB Pagefile

  const maxDiskLatencyMs = Math.max(...currentProcesses.map((p) => p.diskLatencyMs), 2);
  const totalDiskMBps = currentProcesses.reduce((acc, p) => acc + p.diskMBps, 0);
  const diskActivePercent = activeScenario === 'CASE_2_DISK_100' ? 100 : Math.min(100, Math.round(totalDiskMBps * 12 + maxDiskLatencyMs / 3));

  const totalNetMbps = currentProcesses.reduce((acc, p) => acc + p.networkMbps, 0);
  const totalGpuPercent = Math.min(
    100,
    currentProcesses.reduce((acc, p) => acc + p.gpuPercent, 0)
  );
  const totalDedicatedVramMB = currentProcesses.reduce((acc, p) => acc + p.vramDedicatedMB, 0);
  const totalSharedVramMB = currentProcesses.reduce((acc, p) => acc + p.vramSharedMB, 0);

  // Sorting helper
  const sortedProcesses = [...currentProcesses].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortColumn === 'cpu') {
      valA = a.cpuPercent;
      valB = b.cpuPercent;
    } else if (sortColumn === 'memory') {
      valA = a.memorySetMB;
      valB = b.memorySetMB;
    } else if (sortColumn === 'disk') {
      valA = a.diskMBps;
      valB = b.diskMBps;
    } else if (sortColumn === 'net') {
      valA = a.networkMbps;
      valB = b.networkMbps;
    } else if (sortColumn === 'gpu') {
      valA = a.gpuPercent;
      valB = b.gpuPercent;
    }

    return sortDirection === 'desc' ? valB - valA : valA - valB;
  });

  const filteredProcesses = sortedProcesses.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.pid.toString().includes(searchFilter) ||
      p.commandLine.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.user.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const selectedProc = currentProcesses.find((p) => p.pid === selectedPid);

  const handleKillProcess = (pid: number) => {
    setKilledPids((prev) => [...prev, pid]);
    setShowKillModal(false);
  };

  const handleRunPowerShellAudit = (proc: SimulatedProcess) => {
    const output = `PS C:\\Windows\\System32> Get-Process -Id ${proc.pid} | Select-Object Id, ProcessName, Path, Company, Handles, WorkingSet64
Id           : ${proc.pid}
ProcessName  : ${proc.name}
Path         : ${proc.commandLine.split(' ')[0]}
Company      : ${proc.signature === 'Microsoft Verified' ? 'Microsoft Corporation' : proc.signature === 'Verified Publisher' ? 'Verified Publisher Inc.' : 'Unknown / Unsigned'}
Handles      : ${proc.handles}
WorkingSet64 : ${proc.memorySetMB * 1024 * 1024} Bytes (${proc.memorySetMB} MB)

PS C:\\Windows\\System32> Get-CimInstance Win32_Process -Filter "ProcessId = ${proc.pid}" | Select-Object ParentProcessId, CommandLine
ParentProcessId : ${proc.ppid}
CommandLine     : ${proc.commandLine}

PS C:\\Windows\\System32> Get-AuthenticodeSignature -FilePath "${proc.commandLine.split(' ')[0]}"
Status          : ${proc.signature === 'Microsoft Verified' || proc.signature === 'Verified Publisher' ? 'Valid' : 'NotSigned / Unknown'}
SignerCertificate : ${proc.signature === 'Microsoft Verified' ? 'CN=Microsoft Windows Production PCA 2011' : proc.signature === 'Verified Publisher' ? 'CN=GlobalSign CodeSigning CA' : 'None'}
`;
    setPowerShellOutput(output);
    setShowPowerShellTerminal(true);
  };

  // Scenario Verification questions
  const scenarioQuestions: Record<
    TaskManagerScenario,
    {
      title: string;
      question: string;
      options: { id: string; text: string; isCorrect: boolean; feedback: string }[];
    }
  > = {
    NORMAL: {
      title: 'ESCENARIO 00: LÍNEA DE BASE (BASELINE NORMAL)',
      question: '¿Cuál es el estado general del sistema en esta simulación de reposo?',
      options: [
        {
          id: 'opt1',
          text: 'Sistema saludable en reposo: CPU baja, RAM estable sin saturación y tiempos de respuesta de disco < 5ms.',
          isCorrect: true,
          feedback: '¡Correcto! Esta es tu telemetría de referencia (Baseline) para comparar ante fallas.',
        },
        { id: 'opt2', text: 'Hay un virus consumiendo la mitad del equipo.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    CASE_1_SINGLE_THREAD: {
      title: 'CASO 01: HILO SATURADO AL 100% EN 1 CORE',
      question: 'Task Manager marca 12.5% de CPU global, pero la app calc_worker.exe no responde. ¿Cuál es el diagnóstico pericial exacto?',
      options: [
        {
          id: 'opt1',
          text: 'El proceso calc_worker.exe tiene 1 solo hilo saturado al 100% en 1 núcleo lógico. En un CPU de 8 hilos (100%/8 = 12.5%), consume el máximo de 1 núcleo.',
          isCorrect: true,
          feedback: '¡Exacto! El promedio global de CPU oculta la saturación monohilo de un procesador lógico.',
        },
        { id: 'opt2', text: 'La memoria RAM se rompió físicamente.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    CASE_2_DISK_100: {
      title: 'CASO 02: DISCO AL 100% CON BAJA VELOCIDAD (MB/s)',
      question: 'El disco C: marca 100% Tiempo Activo, pero la transferencia es de apenas 1.1 MB/s. ¿Qué está saturando el almacenamiento?',
      options: [
        {
          id: 'opt1',
          text: 'Saturación de latencia de tiempo activo (285 ms) por peticiones de E/S aleatorias 4K en el disco, no por ancho de banda MB/s.',
          isCorrect: true,
          feedback: '¡Excelente! Muestra que el 100% de disco mide TIEMPO ACTIVO (latencia de cola) y no velocidad de megabytes.',
        },
        { id: 'opt2', text: 'El disco está descargando un video en 8K.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    CASE_3_RAM_LEAK: {
      title: 'CASO 03: CONSUMO ANORMAL DE RAM (MEMORY LEAK)',
      question: 'El proceso AppWorkerService.exe tiene 13,800 MB de Private Bytes y 18,500 Handles. ¿Qué diagnóstico corresponde?',
      options: [
        {
          id: 'opt1',
          text: 'Fuga masiva de memoria (Memory Leak) y Handle Leak en el código del proceso, acumulando reservaciones sin liberar al kernel.',
          isCorrect: true,
          feedback: '¡Impecable! La acumulación ininterrumpida de Private Bytes confirma la fuga de memoria privada.',
        },
        { id: 'opt2', text: 'Es un comportamiento normal de Windows.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    CASE_4_GPU_SHARED: {
      title: 'CASO 04: MEMORIA GPU COMPARTIDA VS DEDICADA',
      question: 'Blender utiliza 6,144 MB de VRAM Dedicada y desborda 7,200 MB a la Memoria GPU Compartida. ¿Qué síntoma experimenta el usuario?',
      options: [
        {
          id: 'opt1',
          text: 'Tirones y congelamientos brutales (Stuttering) porque las texturas sobrantes viajan por el bus PCIe hacia la RAM de sistema, que es mucho más lenta que la VRAM.',
          isCorrect: true,
          feedback: '¡Excelente! El desbordamiento de VRAM a memoria compartida provoca severa latencia PCIe.',
        },
        { id: 'opt2', text: 'Aumenta el rendimiento de los juegos.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    CASE_5_SUSPICIOUS: {
      title: 'CASO 05: AUDITORÍA DE PROCESO SOSPECHOSO',
      question: 'Un proceso llamado svchost.exe corre con PID 9920. ¿Qué 2 anomalías confirman que no es el svchost de Windows?',
      options: [
        {
          id: 'opt1',
          text: 'Su RUTA está en C:\\Users\\...\\AppData\\Local\\Temp (fuera de System32) y su PPID es explorer.exe (en lugar de services.exe).',
          isCorrect: true,
          feedback: '¡Análisis pericial concluyente! Violación de la Regla de Ruta y Regla de PPID.',
        },
        { id: 'opt2', text: 'El proceso consume muy poca memoria.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
  };

  const currentQ = scenarioQuestions[activeScenario];

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Top Banner & Scenario Selector */}
      <div className="p-5 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 space-y-4 shadow-[0_0_30px_rgba(0,164,239,0.1)] font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0078D4]/20 border border-[#00A4EF]/40 text-[#60CDFF]">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#60CDFF] font-bold uppercase tracking-wider">
                SIMULADOR INTERACTIVO FORENSE
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight font-sans">
                ADMINISTRADOR DE TAREAS VIRTUAL (WINDOWS 11 NT)
              </h2>
            </div>
          </div>

          {onBackToTheory && (
            <button
              type="button"
              onClick={onBackToTheory}
              className="px-3 py-1.5 rounded-xl bg-[#11161D] hover:bg-zinc-800 text-zinc-300 text-xs font-bold border border-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              VER 23 INVESTIGACIONES
            </button>
          )}
        </div>

        {/* Practical Cases Scenarios Selector */}
        <div className="space-y-2">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
            SELECCIONÁ UN CASO PRÁCTICO EN TIEMPO REAL:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {(
              [
                { id: 'NORMAL', label: '00. BASELINE NORMAL' },
                { id: 'CASE_1_SINGLE_THREAD', label: '01. HILO SATURADO' },
                { id: 'CASE_2_DISK_100', label: '02. DISCO 100%' },
                { id: 'CASE_3_RAM_LEAK', label: '03. LEAK DE RAM' },
                { id: 'CASE_4_GPU_SHARED', label: '04. VRAM OVERFLOW' },
                { id: 'CASE_5_SUSPICIOUS', label: '05. SOSPECHOSO' },
              ] as const
            ).map((s) => {
              const isSelected = activeScenario === s.id;
              const isDone = validatedScenarios[s.id];

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveScenario(s.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer font-bold ${
                    isSelected
                      ? 'bg-[#0078D4] border-[#60CDFF] text-white shadow-[0_0_15px_rgba(0,164,239,0.3)]'
                      : isDone
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#11161D] border-sky-500/20 text-zinc-400 hover:text-zinc-200 hover:border-sky-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] truncate">{s.label}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Task Manager Frame */}
      <div className="rounded-2xl bg-[#080B10] border border-[#00A4EF]/40 overflow-hidden shadow-[0_0_40px_rgba(0,120,212,0.15)] font-mono text-xs">
        {/* Title Bar (Simulated Windows 11 Task Manager Window Header) */}
        <div className="bg-[#0D1117] border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#60CDFF]" />
            <span className="font-bold text-zinc-200 text-xs tracking-wide">
              Administrador de tareas // Windows 11
            </span>
            <span className="text-[10px] text-zinc-500 bg-[#161B22] px-2 py-0.5 rounded border border-zinc-800">
              PID Host: 5120
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#161B22] border border-sky-500/20 rounded-lg px-2.5 py-1">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Filtrar por proceso o PID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none w-36 sm:w-48"
              />
            </div>
          </div>
        </div>

        {/* 7 Main Navigation Tabs */}
        <div className="bg-[#05070A] border-b border-zinc-800/80 px-2 sm:px-4 py-1.5 flex flex-wrap items-center gap-1 overflow-x-auto">
          {(
            [
              { id: 'processes', label: 'Procesos', icon: List },
              { id: 'performance', label: 'Rendimiento', icon: Cpu },
              { id: 'app_history', label: 'Historial de apps', icon: RotateCcw },
              { id: 'startup', label: 'Aplicaciones de arranque', icon: Play },
              { id: 'users', label: 'Usuarios', icon: UsersIcon },
              { id: 'details', label: 'Detalles', icon: Sliders },
              { id: 'services', label: 'Servicios', icon: Layers },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#0078D4] text-white shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#11161D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROCESOS */}
        {activeTab === 'processes' && (
          <div className="p-4 space-y-4">
            {/* Header Telemetry Cards Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-center text-xs">
              <div
                type="button"
                onClick={() => setSortColumn('cpu')}
                className={`p-2.5 rounded-xl border cursor-pointer ${
                  totalCpuPercent > 80
                    ? 'bg-red-950/40 border-red-500/50 text-red-300'
                    : 'bg-[#11161D] border-sky-500/20 text-zinc-300'
                }`}
              >
                <div className="text-[10px] text-zinc-400">CPU</div>
                <div className="text-base font-bold text-[#60CDFF]">{totalCpuPercent.toFixed(1)}%</div>
              </div>

              <div
                type="button"
                onClick={() => setSortColumn('memory')}
                className={`p-2.5 rounded-xl border cursor-pointer ${
                  totalRamUsedMB > 14000
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    : 'bg-[#11161D] border-sky-500/20 text-zinc-300'
                }`}
              >
                <div className="text-[10px] text-zinc-400">MEMORIA (RAM)</div>
                <div className="text-base font-bold text-[#60CDFF]">
                  {Math.round(totalRamUsedMB)} MB (
                  {Math.round((totalRamUsedMB / totalRamSystemMB) * 100)}%)
                </div>
              </div>

              <div
                type="button"
                onClick={() => setSortColumn('disk')}
                className={`p-2.5 rounded-xl border cursor-pointer ${
                  diskActivePercent >= 95
                    ? 'bg-red-950/40 border-red-500/50 text-red-300'
                    : 'bg-[#11161D] border-sky-500/20 text-zinc-300'
                }`}
              >
                <div className="text-[10px] text-zinc-400">DISCO (C:)</div>
                <div className="text-base font-bold text-[#60CDFF]">{diskActivePercent}%</div>
              </div>

              <div
                type="button"
                onClick={() => setSortColumn('net')}
                className="p-2.5 rounded-xl bg-[#11161D] border border-sky-500/20 text-zinc-300 cursor-pointer"
              >
                <div className="text-[10px] text-zinc-400">RED</div>
                <div className="text-base font-bold text-[#60CDFF]">{totalNetMbps.toFixed(1)} Mbps</div>
              </div>

              <div
                type="button"
                onClick={() => setSortColumn('gpu')}
                className="p-2.5 rounded-xl bg-[#11161D] border border-sky-500/20 text-zinc-300 cursor-pointer"
              >
                <div className="text-[10px] text-zinc-400">GPU</div>
                <div className="text-base font-bold text-[#60CDFF]">{totalGpuPercent.toFixed(1)}%</div>
              </div>
            </div>

            {/* Processes Table */}
            <div className="border border-sky-500/20 rounded-xl overflow-x-auto bg-[#05070A]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#0D1117] border-b border-zinc-800 text-zinc-400 text-[11px]">
                    <th className="p-2.5">Nombre del proceso</th>
                    <th className="p-2.5 text-right cursor-pointer" onClick={() => setSortColumn('cpu')}>
                      CPU {sortColumn === 'cpu' ? '▼' : ''}
                    </th>
                    <th className="p-2.5 text-right cursor-pointer" onClick={() => setSortColumn('memory')}>
                      Memoria {sortColumn === 'memory' ? '▼' : ''}
                    </th>
                    <th className="p-2.5 text-right cursor-pointer" onClick={() => setSortColumn('disk')}>
                      Disco {sortColumn === 'disk' ? '▼' : ''}
                    </th>
                    <th className="p-2.5 text-right cursor-pointer" onClick={() => setSortColumn('net')}>
                      Red {sortColumn === 'net' ? '▼' : ''}
                    </th>
                    <th className="p-2.5 text-right cursor-pointer" onClick={() => setSortColumn('gpu')}>
                      GPU {sortColumn === 'gpu' ? '▼' : ''}
                    </th>
                    <th className="p-2.5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs">
                  {filteredProcesses.map((p) => {
                    const isSelected = selectedPid === p.pid;
                    const isHighCpu = p.cpuPercent > 10;
                    const isHighRam = p.memorySetMB > 2000;
                    const isHighDisk = p.diskLatencyMs > 100;
                    const isAnomaly = !p.isSystem32 && p.signature === 'Unsigned / Suspicious';

                    return (
                      <tr
                        key={p.pid}
                        onClick={() => setSelectedPid(p.pid)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#0078D4]/20 border-l-4 border-l-[#00A4EF]'
                            : isAnomaly
                            ? 'bg-red-950/20 hover:bg-red-950/30'
                            : 'hover:bg-[#11161D]'
                        }`}
                      >
                        <td className="p-2.5 font-bold flex items-center gap-2">
                          {isAnomaly && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                          <span className={isAnomaly ? 'text-red-300 font-bold' : 'text-zinc-200'}>
                            {p.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-normal">PID: {p.pid}</span>
                        </td>
                        <td className={`p-2.5 text-right font-bold ${isHighCpu ? 'text-red-400' : 'text-zinc-300'}`}>
                          {p.cpuPercent > 0 ? `${p.cpuPercent.toFixed(1)}%` : '0%'}
                        </td>
                        <td className={`p-2.5 text-right font-bold ${isHighRam ? 'text-amber-400' : 'text-zinc-300'}`}>
                          {p.memorySetMB} MB
                        </td>
                        <td className={`p-2.5 text-right font-bold ${isHighDisk ? 'text-red-400' : 'text-zinc-300'}`}>
                          {p.diskMBps > 0 ? `${p.diskMBps.toFixed(1)} MB/s` : '0 MB/s'}
                        </td>
                        <td className="p-2.5 text-right text-zinc-300">
                          {p.networkMbps > 0 ? `${p.networkMbps.toFixed(1)} Mbps` : '0 Mbps'}
                        </td>
                        <td className="p-2.5 text-right text-zinc-300">
                          {p.gpuPercent > 0 ? `${p.gpuPercent.toFixed(1)}%` : '0%'}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPid(p.pid);
                              setShowKillModal(true);
                            }}
                            className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Finalizar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: RENDIMIENTO */}
        {activeTab === 'performance' && (
          <div className="p-4 space-y-4">
            {/* Sub-tabs for Performance metrics */}
            <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-2">
              {(
                [
                  { id: 'cpu', label: `CPU (${totalCpuPercent.toFixed(1)}%)`, icon: Cpu },
                  { id: 'memory', label: `Memoria (${Math.round(totalRamUsedMB)} MB)`, icon: Database },
                  { id: 'disk', label: `Disco C: (${diskActivePercent}%)`, icon: HardDrive },
                  { id: 'network', label: `Red (${totalNetMbps.toFixed(1)} Mbps)`, icon: Wifi },
                  { id: 'gpu', label: `GPU (${totalGpuPercent.toFixed(1)}%)`, icon: Activity },
                ] as const
              ).map((st) => {
                const Icon = st.icon;
                const isSelected = perfSubTab === st.id;

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setPerfSubTab(st.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0078D4] text-white shadow-[0_0_10px_rgba(0,164,239,0.3)]'
                        : 'bg-[#11161D] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Performance Detail Panes */}
            {perfSubTab === 'cpu' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 font-bold">PROCESADOR // CPU INTEL CORE I7 (8 PROCESADORES LÓGICOS)</span>
                  <button
                    type="button"
                    onClick={() => setShowLogicalCores(!showLogicalCores)}
                    className="px-3 py-1 rounded bg-[#11161D] hover:bg-zinc-800 border border-sky-500/30 text-[#60CDFF] text-xs font-bold transition-all cursor-pointer"
                  >
                    {showLogicalCores ? 'Ver Gráfico Global' : 'Cambiar a Procesadores Lógicos'}
                  </button>
                </div>

                {showLogicalCores ? (
                  /* 8 Logical Cores Grid Representation */
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((coreIdx) => {
                      // If single thread scenario, Core 0 is at 100%
                      const coreUsage =
                        activeScenario === 'CASE_1_SINGLE_THREAD' && coreIdx === 0
                          ? 100
                          : Math.max(2, Math.round(totalCpuPercent / 8 + (coreIdx % 2)));

                      return (
                        <div
                          key={coreIdx}
                          className={`p-3 rounded-xl border flex flex-col justify-between h-24 font-mono ${
                            coreUsage > 90
                              ? 'bg-red-950/60 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                              : 'bg-[#11161D] border-sky-500/20 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span>CPU {coreIdx}</span>
                            <span>{coreUsage}%</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-10 rounded overflow-hidden relative">
                            <div
                              className={`h-full transition-all duration-300 ${
                                coreUsage > 90 ? 'bg-red-500' : 'bg-[#0078D4]'
                              }`}
                              style={{ width: `${coreUsage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Single Global Graph Representation */
                  <div className="p-6 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Utilización de CPU Global:</span>
                      <span className="text-xl font-bold text-[#60CDFF]">{totalCpuPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-16 rounded-xl overflow-hidden p-1 border border-zinc-800">
                      <div
                        className="h-full bg-gradient-to-r from-[#0078D4] to-[#00A4EF] rounded transition-all duration-300"
                        style={{ width: `${totalCpuPercent}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-400 font-mono">
                      <div>Velocidad: <span className="text-white font-bold">3.80 GHz</span></div>
                      <div>Procesos: <span className="text-white font-bold">{currentProcesses.length}</span></div>
                      <div>Hilos: <span className="text-white font-bold">{currentProcesses.reduce((a, b) => a + b.threads, 0)}</span></div>
                      <div>Handles: <span className="text-white font-bold">{currentProcesses.reduce((a, b) => a + b.handles, 0)}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {perfSubTab === 'memory' && (
              <div className="p-6 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Uso de Memoria RAM Física (Working Set):</span>
                  <span className="text-xl font-bold text-[#60CDFF]">
                    {Math.round(totalRamUsedMB)} MB / {totalRamSystemMB} MB
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-12 rounded-xl overflow-hidden p-1 border border-zinc-800">
                  <div
                    className={`h-full rounded transition-all duration-300 ${
                      totalRamUsedMB > 14000 ? 'bg-amber-500' : 'bg-[#0078D4]'
                    }`}
                    style={{ width: `${(totalRamUsedMB / totalRamSystemMB) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800 text-xs">
                  <div className="p-3 rounded-lg bg-[#11161D] border border-sky-500/10 space-y-1">
                    <span className="text-amber-400 font-bold">MEMORIA COMPROMETIDA (COMMIT CHARGE):</span>
                    <p className="text-zinc-200 text-sm font-bold">{Math.round(totalCommitMB)} MB / {commitLimitMB} MB</p>
                    <p className="text-[10px] text-zinc-400">RAM Física + Archivo de paginación (pagefile.sys)</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#11161D] border border-sky-500/10 space-y-1">
                    <span className="text-[#60CDFF] font-bold">CACHÉ Y RESERVAS DEL KERNEL:</span>
                    <p className="text-zinc-200">Reserva paginada: 420 MB | Reserva no paginada: 180 MB</p>
                    <p className="text-[10px] text-zinc-400">Mantiene controladores e hilos de sistema</p>
                  </div>
                </div>
              </div>
            )}

            {perfSubTab === 'disk' && (
              <div className="p-6 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Disco 0 (C: - NVMe / HDD):</span>
                  <span className={`text-xl font-bold ${diskActivePercent >= 95 ? 'text-red-400' : 'text-[#60CDFF]'}`}>
                    Tiempo Activo: {diskActivePercent}%
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-12 rounded-xl overflow-hidden p-1 border border-zinc-800">
                  <div
                    className={`h-full rounded transition-all duration-300 ${
                      diskActivePercent >= 95 ? 'bg-red-500' : 'bg-[#0078D4]'
                    }`}
                    style={{ width: `${diskActivePercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800 text-xs">
                  <div className="p-3 rounded-lg bg-[#11161D] border border-sky-500/10">
                    <span className="text-zinc-400 block text-[10px]">TIEMPO DE RESPUESTA:</span>
                    <span className={`text-base font-bold ${maxDiskLatencyMs > 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {maxDiskLatencyMs.toFixed(1)} ms
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#11161D] border border-sky-500/10">
                    <span className="text-zinc-400 block text-[10px]">VELOCIDAD DE LECTURA:</span>
                    <span className="text-base font-bold text-white">{totalDiskMBps.toFixed(1)} MB/s</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#11161D] border border-sky-500/10">
                    <span className="text-zinc-400 block text-[10px]">COLA DE DISCO:</span>
                    <span className="text-base font-bold text-white">{diskActivePercent >= 95 ? '12 peticiones' : '0.1'}</span>
                  </div>
                </div>
              </div>
            )}

            {perfSubTab === 'gpu' && (
              <div className="p-6 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-bold">GPU 0 // NVIDIA GEFORCE RTX 3060 (6 GB VRAM DEDICADA)</span>
                  <span className="text-xl font-bold text-[#60CDFF]">{totalGpuPercent.toFixed(1)}%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 space-y-2">
                    <span className="text-[#60CDFF] font-bold block">MEMORIA DE GPU DEDICADA (VRAM REAL GDDR6):</span>
                    <div className="text-sm font-bold text-white">{totalDedicatedVramMB} MB / 6144 MB</div>
                    <div className="w-full bg-zinc-800 h-2 rounded overflow-hidden">
                      <div
                        className="h-full bg-[#0078D4]"
                        style={{ width: `${Math.min(100, (totalDedicatedVramMB / 6144) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/20 space-y-2">
                    <span className="text-amber-400 font-bold block">MEMORIA DE GPU COMPARTIDA (PRÉSTAMO PCIe RAM):</span>
                    <div className="text-sm font-bold text-white">{totalSharedVramMB} MB / 8192 MB</div>
                    <div className="w-full bg-zinc-800 h-2 rounded overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${Math.min(100, (totalSharedVramMB / 8192) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: DETALLES (PID, PPID, THREADS, HANDLES, COMMAND LINE, PRIVATE BYTES) */}
        {activeTab === 'details' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-bold uppercase">
                VISTA TÉCNICA FORENSE SIN FILTROS (MUESTRA EPROCESS DEL KERNEL NT)
              </span>
              <span className="text-zinc-500 text-[11px]">{filteredProcesses.length} PROCESOS MOSTRADOS</span>
            </div>

            <div className="border border-sky-500/20 rounded-xl overflow-x-auto bg-[#05070A]">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#0D1117] border-b border-zinc-800 text-zinc-400 text-[11px]">
                    <th className="p-2">Ejecutable</th>
                    <th className="p-2">PID</th>
                    <th className="p-2">PPID</th>
                    <th className="p-2">Usuario</th>
                    <th className="p-2 text-right">Hilos</th>
                    <th className="p-2 text-right">Handles</th>
                    <th className="p-2 text-right">Working Set</th>
                    <th className="p-2 text-right">Mem. Privada</th>
                    <th className="p-2">Línea de comandos</th>
                    <th className="p-2 text-center">Forense</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs">
                  {filteredProcesses.map((p) => {
                    const isSelected = selectedPid === p.pid;
                    const isAnomaly = !p.isSystem32 && p.signature === 'Unsigned / Suspicious';

                    return (
                      <tr
                        key={p.pid}
                        onClick={() => setSelectedPid(p.pid)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#0078D4]/20 border-l-4 border-l-[#00A4EF]'
                            : isAnomaly
                            ? 'bg-red-950/30 text-red-200'
                            : 'hover:bg-[#11161D]'
                        }`}
                      >
                        <td className="p-2 font-bold font-mono text-zinc-200">{p.name}</td>
                        <td className="p-2 text-[#60CDFF] font-bold">{p.pid}</td>
                        <td className="p-2 text-zinc-400">{p.ppid}</td>
                        <td className="p-2 text-zinc-300">{p.user}</td>
                        <td className="p-2 text-right text-zinc-300">{p.threads}</td>
                        <td className="p-2 text-right text-zinc-300">{p.handles}</td>
                        <td className="p-2 text-right text-zinc-300">{p.memorySetMB} MB</td>
                        <td className="p-2 text-right text-amber-300 font-bold">{p.privateBytesMB} MB</td>
                        <td className="p-2 text-[10px] text-zinc-400 max-w-xs truncate font-mono" title={p.commandLine}>
                          {p.commandLine}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRunPowerShellAudit(p);
                            }}
                            className="px-2 py-0.5 rounded bg-[#0078D4]/20 hover:bg-[#0078D4]/40 border border-[#00A4EF]/50 text-[#60CDFF] text-[10px] font-bold transition-all cursor-pointer"
                          >
                            PowerShell
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OTHER TABS: APP HISTORY, STARTUP, USERS, SERVICES (SIMULATED RENDER) */}
        {activeTab === 'app_history' && (
          <div className="p-6 space-y-4">
            <div className="text-xs text-zinc-300 font-bold">
              HISTORIAL DE APLICACIONES UWP Y TIENDA (CONSUMO ACUMULADO DESDE HACE 30 DÍAS)
            </div>
            <div className="p-4 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-2 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2 text-zinc-400 font-bold">
                <span>Aplicación</span>
                <span>Tiempo de CPU</span>
                <span>Red acumulada</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Microsoft News</span>
                <span>00:14:20</span>
                <span>450 MB</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Calculadora</span>
                <span>00:02:10</span>
                <span>0 MB</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Microsoft Store</span>
                <span>01:05:12</span>
                <span>2.4 GB</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'startup' && (
          <div className="p-6 space-y-4">
            <div className="text-xs text-zinc-300 font-bold">
              APLICACIONES CONFIGURADAS EN EL INICIO DE SESIÓN DE WINDOWS
            </div>
            <div className="p-4 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-2 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2 text-zinc-400 font-bold">
                <span>Nombre</span>
                <span>Editor</span>
                <span>Estado</span>
                <span>Impacto de inicio</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>OneDrive</span>
                <span>Microsoft Corporation</span>
                <span className="text-emerald-400 font-bold">Habilitado</span>
                <span className="text-amber-400 font-bold">Alto</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Spotify</span>
                <span>Spotify AB</span>
                <span className="text-zinc-500 font-bold">Deshabilitado</span>
                <span className="text-zinc-400">Bajo</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="text-zinc-300 font-bold">
              SESIONES DE USUARIOS ACTIVAS EN EL EQUIPO (DESGLOSE POR CUENTA)
            </div>
            <div className="p-4 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-2">
              <div className="flex justify-between text-white font-bold border-b border-zinc-800 pb-2">
                <span>TECNICO_EVO (Sesión 1 - Interactiva)</span>
                <span>RAM: {Math.round(totalRamUsedMB)} MB | CPU: {totalCpuPercent.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="text-zinc-300 font-bold">
              SERVICIOS DE SISTEMA DE WINDOWS (VINCULACIÓN CON PIDs DE SVCHOST)
            </div>
            <div className="p-4 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-2 font-mono">
              <div className="flex justify-between text-zinc-400 font-bold border-b border-zinc-800 pb-2">
                <span>Nombre</span>
                <span>PID</span>
                <span>Descripción</span>
                <span>Estado</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>Spooler</span>
                <span className="text-[#60CDFF] font-bold">1890</span>
                <span>Cola de impresión</span>
                <span className="text-emerald-400 font-bold">En ejecución</span>
              </div>
              <div className="flex justify-between text-zinc-200">
                <span>SysMain</span>
                <span className="text-[#60CDFF] font-bold">8900</span>
                <span>Mantiene y mejora el rendimiento del sistema</span>
                <span className="text-emerald-400 font-bold">En ejecución</span>
              </div>
            </div>
          </div>
        )}

        {/* Comparative Banner: Task Manager Native vs PowerShell / External Tools */}
        <div className="p-4 bg-[#0A0E17] border-t border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Info className="w-4 h-4 text-[#60CDFF] shrink-0" />
            <div>
              <span className="font-bold text-white">Diferencia técnica NATIVO vs POWERSHELL: </span>
              <span className="text-zinc-400">
                Task Manager te da la telemetría visual rápida. Para auditar firmas digitales, PPID, Handles exactos de archivo o token de privilegios, escalá a PowerShell o Process Explorer.
              </span>
            </div>
          </div>

          {selectedProc && (
            <button
              type="button"
              onClick={() => handleRunPowerShellAudit(selectedProc)}
              className="px-3 py-1.5 rounded-lg bg-[#0078D4] hover:bg-[#0067C0] text-white font-bold text-xs transition-all shrink-0 cursor-pointer"
            >
              Auditar PID {selectedProc.pid} con PowerShell
            </button>
          )}
        </div>
      </div>

      {/* Tutor EVO Scenario Validation Box */}
      <div className="p-5 rounded-2xl bg-[#080B10] border border-[#00A4EF]/40 space-y-4 font-mono text-xs shadow-[0_0_25px_rgba(0,164,239,0.15)]">
        <div className="flex items-center gap-2 text-white font-bold border-b border-zinc-800 pb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>COMPROBACIÓN TÉCNICA TUTOR EVO // DIAGNÓSTICO EN VIVO</span>
        </div>

        <p className="font-sans text-sm text-zinc-200 font-bold">{currentQ.question}</p>

        <div className="space-y-2">
          {currentQ.options.map((opt) => {
            const ansKey = activeScenario;
            const isSelected = userHypothesis[ansKey] === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setUserHypothesis((prev) => ({ ...prev, [ansKey]: opt.id }));
                  if (opt.isCorrect) {
                    setValidatedScenarios((prev) => ({ ...prev, [ansKey]: true }));
                    if (onScenarioCompleted) onScenarioCompleted(activeScenario);
                  }
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/60 border-red-500 text-red-200'
                    : 'bg-[#11161D] border-sky-500/10 text-zinc-300 hover:border-sky-500/30'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSelected && opt.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isSelected && !opt.isCorrect ? (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-600" />
                  )}
                </div>
                <div>
                  <div className="font-bold">{opt.text}</div>
                  {isSelected && (
                    <p className="text-xs text-zinc-300 font-sans mt-1.5 leading-relaxed">{opt.feedback}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PowerShell Modal Terminal Output */}
      {showPowerShellTerminal && powerShellOutput && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#012456] border border-[#00A4EF] rounded-2xl max-w-2xl w-full p-6 space-y-4 font-mono text-xs text-zinc-100 shadow-[0_0_50px_rgba(0,164,239,0.4)]">
            <div className="flex items-center justify-between border-b border-sky-400/30 pb-3">
              <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
                <Terminal className="w-4 h-4" />
                <span>PowerShell 7.4 (x64) Auditoría de Proceso</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPowerShellTerminal(false)}
                className="p-1 rounded hover:bg-white/10 text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#00102A] border border-sky-500/30 text-[#60CDFF] overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed">
              {powerShellOutput}
            </pre>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPowerShellTerminal(false)}
                className="px-4 py-2 rounded-xl bg-[#0078D4] hover:bg-[#0067C0] text-white font-bold cursor-pointer transition-all"
              >
                Cerrar Consola
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kill Process Modal */}
      {showKillModal && selectedProc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#080B10] border border-red-500/60 rounded-2xl max-w-md w-full p-6 space-y-4 font-mono text-xs text-zinc-100 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <div className="flex items-center gap-3 text-red-400 font-bold border-b border-red-500/30 pb-3">
              <AlertTriangle className="w-5 h-5" />
              <span>CONFIRMAR TERMINACIÓN FORZADA (TerminateProcess)</span>
            </div>

            <p className="font-sans text-xs text-zinc-300 leading-relaxed">
              ¿Estás seguro de enviar la llamada de kernel <code className="text-red-400">TerminateProcess</code> al PID <strong className="text-white">{selectedProc.pid}</strong> (<strong className="text-white">{selectedProc.name}</strong>)? Los datos no guardados se perderán inmediatamente.
            </p>

            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] text-red-300">
              Ruta: {selectedProc.commandLine}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowKillModal(false)}
                className="px-4 py-2 rounded-xl bg-[#11161D] text-zinc-300 hover:text-white border border-zinc-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleKillProcess(selectedProc.pid)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer transition-all"
              >
                Finalizar Tarea (PID {selectedProc.pid})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
