/**
 * EVO LABS — Master Inventory Data Structure
 * Source of Truth for all Laboratories, Tools, Simulators, Games, and Diagnostic Modules.
 * 
 * Lema: NO LO CREAS. COMPROBALO.
 * Repository: EvoMaxPC/Magazine-EvoLabs
 * Canonical Branch: main
 */

export type InventoryType = 'LABORATORIO' | 'HERRAMIENTA' | 'JUEGO' | 'SIMULADOR' | 'DIAGNÓSTICO' | 'MÓDULO';
export type InventoryStatus = 'OPERATIVO' | 'EN_DESARROLLO' | 'PLANIFICADO';
export type DataProvenance =
  | 'SYSTEM_REPORTED'
  | 'MEASURED'
  | 'MEDIDO'
  | 'CALCULATED'
  | 'CALCULADO'
  | 'ESTIMATED'
  | 'ESTIMADO'
  | 'SIMULATED'
  | 'SIMULADO'
  | 'UNKNOWN'
  | 'DESCONOCIDO'
  | 'USER_ENTERED';

export interface InventoryItem {
  id: string;
  name: string;
  type: InventoryType;
  tomoId: string | null; // '01' through '12', or null if platform-wide
  category: string;
  status: InventoryStatus;
  provenance: DataProvenance;
  sourceFile: string;
  dependencies: string[];
  functionality: string;
  usageInstructions?: string;
  canonicalRoute?: string;
}

export interface TomeInventorySummary {
  tomoId: string;
  title: string;
  levelName: string;
  labsCount: number;
  toolsCount: number;
  gamesCount: number;
  status: string;
}

export interface InventoryStats {
  totalItems: number;
  totalLabs: number;
  totalTools: number;
  totalGames: number;
  totalSimulators: number;
  totalDiagnostics: number;
  operativosCount: number;
  enDesarrolloCount: number;
}

export interface InventoryDataStructure {
  metadata: {
    version: string;
    lastUpdated: string;
    platform: string;
    repository: string;
    canonicalBranch: string;
    totalItemsCount: number;
  };
  tomos: TomeInventorySummary[];
  items: InventoryItem[];
}

export const EVO_TOMO_SUMMARIES: TomeInventorySummary[] = [
  {
    tomoId: '01',
    title: 'Conocé tu PC',
    levelName: 'NIVEL 1: CONOCER LA PC',
    labsCount: 7,
    toolsCount: 6,
    gamesCount: 6,
    status: 'PUBLICADO',
  },
  {
    tomoId: '02',
    title: 'La Biblia Negra de Windows',
    levelName: 'NIVEL 2: WINDOWS Y KERNEL',
    labsCount: 12,
    toolsCount: 5,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '03',
    title: 'Reparación de PC',
    levelName: 'NIVEL 3: DIAGNÓSTICO Y REPARACIÓN',
    labsCount: 5,
    toolsCount: 4,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '04',
    title: 'Reparación de Notebooks',
    levelName: 'NIVEL 3: DIAGNÓSTICO Y REPARACIÓN',
    labsCount: 2,
    toolsCount: 2,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '05',
    title: 'Redes y Telecomunicaciones',
    levelName: 'NIVEL 4: REDES Y SEGURIDAD',
    labsCount: 6,
    toolsCount: 3,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '06',
    title: 'Ciberseguridad y Hardening',
    levelName: 'NIVEL 4: REDES Y SEGURIDAD',
    labsCount: 6,
    toolsCount: 2,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '07',
    title: 'Gaming Pro / Rendimiento',
    levelName: 'NIVEL 5: RENDIMIENTO Y GAMING',
    labsCount: 6,
    toolsCount: 3,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '08',
    title: 'Arranque y Diagnóstico UEFI',
    levelName: 'NIVEL 2: WINDOWS Y KERNEL',
    labsCount: 2,
    toolsCount: 3,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '09',
    title: 'Programación desde Cero',
    levelName: 'NIVEL 6: SISTEMAS Y KERNEL',
    labsCount: 6,
    toolsCount: 1,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '10',
    title: 'Prompt e IA Avanzada',
    levelName: 'NIVEL 6: SISTEMAS Y KERNEL',
    labsCount: 6,
    toolsCount: 2,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '11',
    title: 'Electrónica Aplicada a la Informática',
    levelName: 'NIVEL 7: ELECTRÓNICA Y HARDWARE',
    labsCount: 3,
    toolsCount: 2,
    gamesCount: 0,
    status: 'PUBLICADO',
  },
  {
    tomoId: '12',
    title: 'Ingeniería y Creación de Videojuegos',
    levelName: 'NIVEL 8: GAME FORGE Y SIMULACIÓN',
    labsCount: 3,
    toolsCount: 1,
    gamesCount: 1,
    status: 'PUBLICADO',
  },
];

export const EVO_MASTER_INVENTORY: InventoryItem[] = [
  // =========================================================================
  // TOMO 01 — LABORATORIOS FUNDAMENTALES Y HERRAMIENTAS
  // =========================================================================
  {
    id: 'lab-f01-encoding',
    name: 'Codificación y Unidades (SI Base 10 vs IEC Base 2)',
    type: 'LABORATORIO',
    tomoId: '01',
    category: 'Representación de Información',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/fundamentals/InfoRepresentationLab.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts', 'src/components/common/ProvenanceBadge.tsx'],
    functionality:
      'Codificación e inspección de cadenas en UTF-8/ASCII byte a byte, descomposiciones hex y calculadora de discrepancia comercial de almacenamiento (1000^3 vs 1024^3).',
    usageInstructions: 'Seleccioná un preset o ingresá texto personalizado. Inspeccioná los bytes codificados y variá el tamaño de almacenamiento en GB.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'lab-f02-binary-arithmetic',
    name: 'Aritmética Binaria y ALU de Silicio',
    type: 'LABORATORIO',
    tomoId: '01',
    category: 'Lógica Digital y ALU',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/fundamentals/BinaryArithmeticLab.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts', 'src/components/common/ProvenanceBadge.tsx'],
    functionality:
      'Sumador/Restador de 8, 16 y 32 bits con banderas de hardware (ZF, SF, CF, OF), acarreo fila a fila y complemento a dos.',
    usageInstructions: 'Configurá el ancho de palabra, seleccioná la operación ALU (ADD, SUB, AND, OR, XOR) y conmutá los bits individuales.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'lab-f03-circuits',
    name: 'Electricidad en PC, Ley de Ohm y Efecto Joule',
    type: 'LABORATORIO',
    tomoId: '01',
    category: 'Circuitos y Disipación',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/fundamentals/ElectricCircuitsLab.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts', 'src/components/common/ProvenanceBadge.tsx'],
    functionality:
      'Modelado de topologías en Serie, Paralelo, Mixtas, Cortocircuito con protección OCP y disipación térmica de pistas de cobre por Ley de Joule (P=I²·R).',
    usageInstructions: 'Modificá la tensión de la fuente ATX, ajustá la resistencia de carga de cada rama y observá la elevación de temperatura estimada.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'lab-f04-digital-signals',
    name: 'Señales Digitales, Niveles Lógicos y Osciloscopio',
    type: 'LABORATORIO',
    tomoId: '01',
    category: 'Señales Digitales',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/fundamentals/DigitalSignalsLab.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts', 'src/components/common/ProvenanceBadge.tsx'],
    functionality:
      'Generador de reloj de 0.5 GHz a 5.5 GHz, traza en canvas de osciloscopio en tiempo real, jitter en picosegundos, duty cycle y márgenes de ruido por perfil de silicio (TTL, CMOS, DDR5, FinFET).',
    usageInstructions: 'Ajustá la frecuencia de bus, inyectá jitter o alterá el ciclo de trabajo para observar las advertencias de inestabilidad de reloj.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'lab-f05-basic-cpu',
    name: 'Simulador Didáctico de CPU (Arquitectura Von Neumann)',
    type: 'SIMULADOR',
    tomoId: '01',
    category: 'Arquitectura de Computadoras',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/fundamentals/BasicCpuSimulatorLab.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts', 'src/components/common/ProvenanceBadge.tsx'],
    functionality:
      'Bucle de instrucción Fetch-Decode-Execute, registros PC, IR, A, B, banderas, buses de datos/dirección y matriz de RAM de 16 bytes editable en tiempo real.',
    usageInstructions: 'Cargá programas preconfigurados o editá los bytes hexadecimales en la RAM. Utilizá el botón Auto Reloj para animación interactiva.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'lab-f06-ram-latency',
    name: 'Calculador y Explorador de Latencias de Memoria RAM',
    type: 'LABORATORIO',
    tomoId: '01',
    category: 'Memorias y Buses',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/fundamentals/RamLatencyExplorerLab.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts', 'src/components/common/ProvenanceBadge.tsx'],
    functionality:
      'Cálculo de latencia real en nanosegundos ((tCL * 2000) / MT/s), tiempos de ciclo de fila tRC, ancho de banda multi-canal y simulador de impacto en FPS mínimos 1% Low.',
    usageInstructions: 'Seleccioná presets de memoria (DDR4/DDR5) o ajustá manualmente velocidad (MT/s) y timings. Conmutá entre canal único y canal doble.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'lab-f07-pcie-bandwidth',
    name: 'Analizador de Pistas PCIe y Ancho de Banda por Línea',
    type: 'LABORATORIO',
    tomoId: '01',
    category: 'Buses de Expansión',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/fundamentals/PcieBandwidthLab.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts', 'src/components/common/ProvenanceBadge.tsx'],
    functionality:
      'Topología PCI Express Gen 1 a Gen 6 en líneas x1, x4, x8 y x16, pérdidas de codificación (8b/10b vs 128b/130b vs 242b/256b) y comparador de velocidad DirectStorage.',
    usageInstructions: 'Seleccioná generación y número de líneas, inyectá tráfico de trabajo (DirectStorage / Ray Tracing) y medí el cuello de botella.',
    canonicalRoute: '/aprender/tomo-01',
  },

  // =========================================================================
  // TOMO 01 — JUEGOS EDUCATIVOS
  // =========================================================================
  {
    id: 'game-01-binary-quest',
    name: 'Binary Quest: Desafío de Conversión Rápida',
    type: 'JUEGO',
    tomoId: '01',
    category: 'Juegos Educativos',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/games/BinaryQuestGame.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts', 'src/components/common/ProvenanceBadge.tsx'],
    functionality:
      'Reto contrarreloj de conversiones entre binario, decimal y hexadecimal con multiplicadores de racha y selección de dificultad por nivel de bits.',
    usageInstructions: 'Iniciá el juego, respondé las conversiones antes de que venza el tiempo de 15s y acumulá puntos por aciertos consecutivos.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'game-02-logic-factory',
    name: 'Logic Factory: Compuertas y Tablas de Verdad',
    type: 'JUEGO',
    tomoId: '01',
    category: 'Juegos Educativos',
    status: 'OPERATIVO',
    provenance: 'SIMULATED',
    sourceFile: 'src/components/tomo01/games/LogicFactoryGame.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts'],
    functionality:
      'Puzzle de circuitos lógicos con compuertas AND, OR, NOT, XOR, NAND y evaluación automática de tablas de verdad.',
    usageInstructions: 'Seleccioná las compuertas lógicas necesarias para procesar las entradas digitales hasta completar la salida esperada.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'game-03-cpu-mission',
    name: 'CPU Mission: Control de Registros y Ciclos',
    type: 'JUEGO',
    tomoId: '01',
    category: 'Juegos Educativos',
    status: 'OPERATIVO',
    provenance: 'SIMULATED',
    sourceFile: 'src/components/tomo01/games/CpuMissionGame.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts'],
    functionality:
      'Juego de microcódigo de bajo nivel donde se manipulan registros A, B, C utilizando instrucciones máquina optimizando el número de ciclos.',
    usageInstructions: 'Cargá las instrucciones requeridas para alcanzar la meta numérica en los registros en la menor cantidad de pasos.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'game-04-hardware-rescue',
    name: 'Hardware Rescue: Peritaje Deductivo en Banco',
    type: 'JUEGO',
    tomoId: '01',
    category: 'Juegos Educativos',
    status: 'OPERATIVO',
    provenance: 'MEASURED',
    sourceFile: 'src/components/tomo01/games/HardwareRescueGame.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts'],
    functionality:
      'Simulador de peritaje de taller donde se identifican componentes fallados mediante instrumental virtual (multímetro, cámara térmica, visor POST).',
    usageInstructions: 'Analizá el caso del cliente, aplicá instrumental de prueba sobre los componentes sospechosos y emití el dictamen final.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'game-05-memory-match',
    name: 'Silicon Memory Match: Desafío de Subtimings',
    type: 'JUEGO',
    tomoId: '01',
    category: 'Juegos Educativos',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/games/MemoryMatchGame.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts'],
    functionality:
      'Sintonización fina de perfiles XMP/EXPO ajustando velocidad MT/s, latencias tCL/tRCD/tRP y voltaje seguro VDDQ.',
    usageInstructions: 'Equilibrá los parámetros de memoria hasta lograr la meta de latencia sin superar los límites térmicos y de estabilidad.',
    canonicalRoute: '/aprender/tomo-01',
  },
  {
    id: 'game-06-vrm-stress',
    name: 'VRM Thermal Runaway: Equilibrio de Fases',
    type: 'JUEGO',
    tomoId: '01',
    category: 'Juegos Educativos',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/tomo01/games/VrmStressGame.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts'],
    functionality:
      'Juego de simulación térmica en tiempo real de etapas DrMOS bajo picos transitorios de hasta 240A con protección por sobrecalentamiento OTP.',
    usageInstructions: 'Iniciá la prueba de estrés de 20s, balanceá el número de fases activas, la frecuencia PWM y la velocidad de los ventiladores.',
    canonicalRoute: '/aprender/tomo-01',
  },

  // =========================================================================
  // TOMO 01 — HERRAMIENTAS Y VISTAS ESPECIALIZADAS
  // =========================================================================
  {
    id: 'tool-post-diag',
    name: 'Diagnóstico Físico & Códigos POST en Tiempo Real',
    type: 'HERRAMIENTA',
    tomoId: '01',
    category: 'Diagnóstico Físico',
    status: 'OPERATIVO',
    provenance: 'MEASURED',
    sourceFile: 'src/components/world/labs/EvoHardwarePostDiagnosticsLab.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts'],
    functionality:
      'Monitoreo multimetrológico en vivo de rieles ATX (+12V, +5V, +3.3V, VCore), comprobación de señales de arranque (PS_ON#, PWR_OK) y decodificador de códigos POST UEFI en eSPI.',
    canonicalRoute: '/herramientas/diag-post-hardware',
  },
  {
    id: 'tool-motherboard-canvas',
    name: 'PCB Canvas: Placa Madre Interactiva y Pistas VRM',
    type: 'HERRAMIENTA',
    tomoId: '01',
    category: 'Arquitectura Hardware',
    status: 'OPERATIVO',
    provenance: 'SIMULATED',
    sourceFile: 'src/components/world/labs/EvoMotherboardCanvas.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Esquemático interactivo 2D/3D con rayos X de capas de cobre, trazado de pistas VRM, líneas PCIe y flujo de datos chipset-CPU.',
    canonicalRoute: '/herramientas/i',
  },
  {
    id: 'tool-ultimate-sandbox',
    name: 'Ultimate Hardware Sandbox & Simulador de Juegos',
    type: 'HERRAMIENTA',
    tomoId: '01',
    category: 'Rendimiento y Gaming',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/world/labs/EvoUltimateSandbox.tsx',
    dependencies: ['lucide-react', '@google/genai'],
    functionality:
      'Simulador masivo con selección amplia de CPUs (Intel/AMD), GPUs (NVIDIA/AMD/Intel), memoria DDR4/DDR5 en varios canales y endpoint de IA Gemini 2.5/3.8 Flash para benchmarks de juegos (Valorant, CS2, Cyberpunk).',
    canonicalRoute: '/herramientas/sandbox-ultimate',
  },

  // =========================================================================
  // TOMO 02 — WINDOWS, KERNEL Y REPARACIÓN FORENSE
  // =========================================================================
  {
    id: 'tool-bsod-repair',
    name: 'Solucionador y Decodificador de Pantallazos Azules (BSOD)',
    type: 'HERRAMIENTA',
    tomoId: '02',
    category: 'Reparación de Kernel',
    status: 'OPERATIVO',
    provenance: 'SYSTEM_REPORTED',
    sourceFile: 'src/components/tools/EvoBsodRepairView.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Análisis forense de códigos Bugcheck (PAGE_FAULT_IN_NONPAGED_AREA, KMODE_EXCEPTION_NOT_HANDLED), identificación de módulos .sys y procedimiento de recuperación paso a paso.',
    canonicalRoute: '/herramientas/diag-bsod-decoder',
  },
  {
    id: 'tool-windows-error-analyzer',
    name: 'Analizador Forense de Errores de Windows',
    type: 'HERRAMIENTA',
    tomoId: '02',
    category: 'Diagnóstico Forense',
    status: 'OPERATIVO',
    provenance: 'SYSTEM_REPORTED',
    sourceFile: 'src/components/tools/EvoWindowsErrorAnalyzerView.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Buscador e intérprete de EventIDs del Visor de Eventos de Windows, errores de servicios svchost y conflictos DLL en System32.',
    canonicalRoute: '/herramientas/diag-incident-events',
  },
  {
    id: 'lab-windows-services',
    name: 'Optimizador Forense de Procesos y Servicios Windows',
    type: 'LABORATORIO',
    tomoId: '02',
    category: 'Kernel y Servicios',
    status: 'OPERATIVO',
    provenance: 'SYSTEM_REPORTED',
    sourceFile: 'src/components/chapter02/EvoChapter02LabView.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Auditoría de procesos svchost.exe, aislamiento de SysMain, telemetría de Windows y depuración de servicios parásitos.',
    canonicalRoute: '/aprender/tomo-02',
  },

  // =========================================================================
  // TOMO 08 — ARRANQUE Y DIAGNÓSTICO UEFI
  // =========================================================================
  {
    id: 'lab-boot-seq',
    name: 'Simulador de Secuencia de Boot y 35 Estados POST',
    type: 'SIMULADOR',
    tomoId: '08',
    category: 'Arranque y Firmware',
    status: 'OPERATIVO',
    provenance: 'MEASURED',
    sourceFile: 'src/components/chapter08/EvoBootLab.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Cronología de encendido desde riel standby 5VSB, Power Good, inicialización de silicio, carga de código UEFI hasta el hand-off al Boot Manager.',
    canonicalRoute: '/aprender/tomo-08',
  },

  // =========================================================================
  // TOMO 05, 06, 07, 09, 10, 11, 12 — EMBEDDED LAB ENGINES
  // =========================================================================
  {
    id: 'engine-network-lab',
    name: 'Motor Integrado de Laboratorios de Redes (Tomo 05)',
    type: 'MÓDULO',
    tomoId: '05',
    category: 'Redes y Telecomunicaciones',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/labs/EvoNetworkLabEngine.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Comprende 6 módulos interactivos: Mapa de topología L1-L3, analizador de latencia Hop-by-Hop, bufferbloat, inspección DNS, espectro WiFi e inspector de paquetes L2-L7.',
    canonicalRoute: '/practicar',
  },
  {
    id: 'engine-security-lab',
    name: 'Motor Integrado de Laboratorios de Ciberseguridad (Tomo 06)',
    type: 'MÓDULO',
    tomoId: '06',
    category: 'Ciberseguridad y Hardening',
    status: 'OPERATIVO',
    provenance: 'SYSTEM_REPORTED',
    sourceFile: 'src/components/labs/EvoSecurityLabEngine.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Comprende 6 módulos: Mapa de superficie de ataque, comparador de hardening, triaje de logs, simulador de respuesta a incidentes en 6 fases, inspección heurística de phishing y prueba RPO/RTO de backups.',
    canonicalRoute: '/practicar',
  },
  {
    id: 'engine-performance-lab',
    name: 'Motor Integrado de Metrología de Rendimiento (Tomo 07)',
    type: 'MÓDULO',
    tomoId: '07',
    category: 'Metrología y Gaming Pro',
    status: 'OPERATIVO',
    provenance: 'MEASURED',
    sourceFile: 'src/components/labs/EvoPerformanceLabEngine.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Metrología de series temporales de frametimes, percentiles 1% / 0.1% Low, analisis de frame pacing, investigación multidimensional de cuello de botella, bench A/B con x3 repeticiones e inspección del pipeline de input lag.',
    canonicalRoute: '/practicar',
  },
  {
    id: 'engine-code-lab',
    name: 'Motor Integrado de Programación y Código (Tomo 09)',
    type: 'MÓDULO',
    tomoId: '09',
    category: 'Sistemas y Programación',
    status: 'OPERATIVO',
    provenance: 'CALCULADO',
    sourceFile: 'src/components/labs/EvoCodeLabEngine.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Visualizador paso a paso de pila de llamadas, depurador pericial con breakpoints, analizador de complejidad Big-O, transformaciones puras de datos, simulador de grafo Git y corredor de unit tests.',
    canonicalRoute: '/practicar',
  },
  {
    id: 'engine-ai-lab',
    name: 'Motor Integrado de Prompt e IA Avanzada (Tomo 10)',
    type: 'MÓDULO',
    tomoId: '10',
    category: 'Inteligencia Artificial',
    status: 'OPERATIVO',
    provenance: 'SYSTEM_REPORTED',
    sourceFile: 'src/components/labs/EvoAiLabEngine.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Bench A/B de prompts cuantitativo, ingeniería de contexto (Lost in the Middle / Aguja en el Pajar), detector de alucinaciones, creador de flujos autónomos multi-paso, visualizador RAG con similitud coseno y golden set de evaluación.',
    canonicalRoute: '/practicar',
  },
  {
    id: 'engine-electronics-lab',
    name: 'Motor Integrado de Electrónica de Hardware (Tomo 11)',
    type: 'MÓDULO',
    tomoId: '11',
    category: 'Electrónica Aplicada',
    status: 'OPERATIVO',
    provenance: 'MEASURED',
    sourceFile: 'src/components/labs/EvoElectronicsLabEngine.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Multímetro virtual con medición de diodo/resistencia/voltaje, banco de Ley de Ohm y módulo de diagnóstico de rieles standby, VCore y VDDQ en motherboards.',
    canonicalRoute: '/practicar',
  },
  {
    id: 'engine-game-forge-lab',
    name: 'EVO Game Forge & Proyecto Mundo Max (Tomo 12)',
    type: 'MÓDULO',
    tomoId: '12',
    category: 'Ingeniería de Videojuegos',
    status: 'OPERATIVO',
    provenance: 'SIMULATED',
    sourceFile: 'src/components/labs/EvoGameForgeLabEngine.tsx',
    dependencies: ['lucide-react'],
    functionality:
      'Simulador de Game Loop independiente de framerate (Delta Time), álgebra vectorial 2D/3D (producto escalar, campo de visión) y entorno interactivo Mundo Max Studio.',
    canonicalRoute: '/practicar',
  },

  // =========================================================================
  // MÓDULOS DE TELEMETRÍA Y PLATAFORMA
  // =========================================================================
  {
    id: 'module-hardware-telemetry',
    name: 'Agente Local de Telemetría Real de Windows',
    type: 'DIAGNÓSTICO',
    tomoId: null,
    category: 'Analizar mi PC',
    status: 'OPERATIVO',
    provenance: 'SYSTEM_REPORTED',
    sourceFile: 'src/components/home/EvoAnalyzeMyPcView.tsx',
    dependencies: ['lucide-react', 'src/utils/provenance.ts'],
    functionality:
      'Comunicación en vivo con el EVO Local Agent mediante WebSocket/HTTP para lectura transparente de sensores físicos de hardware (temperatura, RPM, relojes, voltajes).',
    usageInstructions: 'Navegá a la sección "Analizar mi PC" y hacé clic en "ACTUALIZAR DETECCIÓN" para iniciar el escaneo físico.',
    canonicalRoute: '/analizar-mi-pc',
  },
];

/**
 * Retorna las estadísticas consolidadas del inventario de EVO LABS.
 */
export function getInventoryStats(): InventoryStats {
  const totalItems = EVO_MASTER_INVENTORY.length;
  const totalLabs = EVO_MASTER_INVENTORY.filter((i) => i.type === 'LABORATORIO').length;
  const totalTools = EVO_MASTER_INVENTORY.filter((i) => i.type === 'HERRAMIENTA').length;
  const totalGames = EVO_MASTER_INVENTORY.filter((i) => i.type === 'JUEGO').length;
  const totalSimulators = EVO_MASTER_INVENTORY.filter((i) => i.type === 'SIMULADOR').length;
  const totalDiagnostics = EVO_MASTER_INVENTORY.filter((i) => i.type === 'DIAGNÓSTICO').length;
  const operativosCount = EVO_MASTER_INVENTORY.filter((i) => i.status === 'OPERATIVO').length;
  const enDesarrolloCount = EVO_MASTER_INVENTORY.filter((i) => i.status === 'EN_DESARROLLO').length;

  return {
    totalItems,
    totalLabs,
    totalTools,
    totalGames,
    totalSimulators,
    totalDiagnostics,
    operativosCount,
    enDesarrolloCount,
  };
}

/**
 * Filtra los elementos del inventario pertenecientes a un Tomo específico.
 */
export function getInventoryByTomo(tomoId: string): InventoryItem[] {
  return EVO_MASTER_INVENTORY.filter((i) => i.tomoId === tomoId);
}

/**
 * Filtra los elementos del inventario por categoría técnica.
 */
export function getInventoryByCategory(category: string): InventoryItem[] {
  return EVO_MASTER_INVENTORY.filter((i) => i.category.toLowerCase() === category.toLowerCase());
}

/**
 * Filtra los elementos del inventario por estado operativo.
 */
export function getInventoryByStatus(status: InventoryStatus): InventoryItem[] {
  return EVO_MASTER_INVENTORY.filter((i) => i.status === status);
}

/**
 * Exportación consolidada de la estructura de datos completa del inventario.
 */
export const EVO_FULL_INVENTORY_DATA: InventoryDataStructure = {
  metadata: {
    version: '2026.11.03',
    lastUpdated: '2026-11-03T18:43:00-08:00',
    platform: 'EVO LABS Technical Ecosystem',
    repository: 'EvoMaxPC/Magazine-EvoLabs',
    canonicalBranch: 'main',
    totalItemsCount: EVO_MASTER_INVENTORY.length,
  },
  tomos: EVO_TOMO_SUMMARIES,
  items: EVO_MASTER_INVENTORY,
};
