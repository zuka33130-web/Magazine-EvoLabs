/**
 * EVO LABS — TOMO 01: CONTENIDO TÉCNICO DE PROFUNDIZACIÓN
 * 
 * Secciones maestras para el Magazine y la vista interactiva del Tomo 01:
 * 1. Arquitectura de Silicio & Microondas (Topología de die, caché, IMC y buses).
 * 2. Telemetría de Precisión & DPC Latency (Métricas reales vs promedios mentirosos).
 * 3. Protocolo de Diagnóstico Forense (Hardware antes de software, aislamiento pericial).
 */

export interface CacheLatencyLevel {
  level: string;
  sizeTypical: string;
  cycles: string;
  latencyNs: string;
  bandwidthGBs: string;
  role: string;
}

export interface SiliconArchitectureTopic {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  summary: string;
  keyConcepts: { title: string; description: string }[];
  technicalDetail: string;
  forensicNote: string;
}

export interface TelemetryMetricItem {
  id: string;
  metric: string;
  unit: string;
  whyAveragesLie: string;
  realMeasurementMethod: string;
  targetThreshold: string;
  criticalWarning: string;
}

export interface ForensicCaseStudy {
  id: string;
  symptom: string;
  initialMyth: string;
  forensicEvidence: string;
  rootCause: string;
  resolution: string;
  preventionRule: string;
}

// ==========================================
// 1. ARQUITECTURA DE SILICIO & MICROONDAS
// ==========================================

export const CACHE_HIERARCHY_DATA: CacheLatencyLevel[] = [
  {
    level: 'Registros CPU',
    sizeTypical: '1 - 2 KB',
    cycles: '0 - 1 ciclos',
    latencyNs: '< 0.3 ns',
    bandwidthGBs: '> 10,000 GB/s',
    role: 'Espacio de cálculo inmediato dentro de la ALU. Acceso en el mismo ciclo de reloj.',
  },
  {
    level: 'Caché L1 (L1d / L1i)',
    sizeTypical: '32 - 48 KB por núcleo',
    cycles: '4 - 5 ciclos',
    latencyNs: '0.8 - 1.2 ns',
    bandwidthGBs: '~4,500 GB/s',
    role: 'Separada estrictamente en Datos (L1d) e Instrucciones (L1i) para evitar contención de pipeline.',
  },
  {
    level: 'Caché L2',
    sizeTypical: '512 KB - 2 MB por núcleo',
    cycles: '12 - 14 ciclos',
    latencyNs: '2.5 - 4.0 ns',
    bandwidthGBs: '~1,800 GB/s',
    role: 'Búfer de contención no inclusivo o semi-inclusivo. Mantiene activas ramas de ejecución recientes.',
  },
  {
    level: 'Caché L3 (Unificada / 3D V-Cache)',
    sizeTypical: '16 - 96+ MB compartida',
    cycles: '35 - 50 ciclos',
    latencyNs: '10.5 - 14.0 ns',
    bandwidthGBs: '~800 GB/s',
    role: 'Piscina común de datos para todos los núcleos de un CCD/CCX. El 3D V-Cache apila silicio con TSVs reduciendo el acceso a DRAM.',
  },
  {
    level: 'Memoria DRAM (DDR4 / DDR5)',
    sizeTypical: '16 - 64 GB',
    cycles: '200 - 320 ciclos',
    latencyNs: '55.0 - 75.0 ns',
    bandwidthGBs: '45 - 90 GB/s',
    role: 'Memoria volátil del sistema fuera del die de la CPU. Cruza el controlador de memoria (IMC) y las trazas del PCB.',
  },
  {
    level: 'Almacenamiento NVMe PCIe 4.0/5.0',
    sizeTypical: '1 - 4 TB',
    cycles: '> 20,000 ciclos',
    latencyNs: '15,000 - 60,000 ns (15-60 µs)',
    bandwidthGBs: '5 - 14 GB/s',
    role: 'NAND Flash persistente. Aun el SSD más rápido del mundo es cientos de veces más lento que la DRAM en latencia aleatoria.',
  },
];

export const SILICON_ARCHITECTURE_TOPICS: SiliconArchitectureTopic[] = [
  {
    id: 'die-topology',
    title: 'Topología de Silicio: Monolítico vs. Chiplets (MCM)',
    subtitle: 'El dilema físico entre rendimiento térmico, costo y latencia entre dados',
    tag: 'FÍSICA DEL SEMICONDUCTOR',
    summary:
      'En un diseño monolítico tradicional (ej. arquitectura móvil de Intel o APUs monolíticas), todos los núcleos, GPU integrada, controlador de memoria (IMC) y líneas PCIe residen en una única oblea de silicio continua. En un diseño por Chiplets (AMD Zen o Intel Core Ultra), la CPU se divide en dados de computación (CCD/Compute Tile) y un dado central de E/S (IOD/SoC Tile).',
    keyConcepts: [
      {
        title: 'Penalidad de Interconexión (Cross-Die Latency)',
        description:
          'Cuando un núcleo en un CCD necesita datos de la memoria RAM conectada al IOD, debe atravesar un puente físico (Infinity Fabric o Foveros). Esto añade entre 10 y 18 ns de latencia fija comparado con un die monolítico.',
      },
      {
        title: 'Through-Silicon Vias (TSV) y 3D V-Cache',
        description:
          'Para contrarrestar la lentitud de la RAM externa, se coloca un dado de memoria SRAM L3 adicional de 64 MB soldado directamente encima del CCD mediante miles de micro-pilares de cobre (TSV), triplicando la tasa de acierto de caché (Cache Hit Rate).',
      },
      {
        title: 'Degradación por Hotspots Térmicos',
        description:
          'Al reducir los nodos litográficos a 5nm, 4nm y 3nm, la densidad de calor por milímetro cuadrado supera a la de una tobera de reactor nuclear. El calor no se disipa de forma uniforme: se concentra en el CCD activo.',
      },
    ],
    technicalDetail:
      'La comunicación entre el controlador de memoria (UMC) y los núcleos se rige por la frecuencia del bus de fábrica (FCLK en AMD o Ring Bus en Intel). Cuando el ratio de FCLK a UCLK (reloj de memoria) deja de ser 1:1 y pasa a 1:2 para permitir DDR5 de 7000+ MT/s, la penalización de latencia del desacoplador puede anular cualquier ganancia de frecuencia bruta.',
    forensicNote:
      'Comprobación empírica: una memoria DDR5 a 6000 MT/s con latencia CAS 30 y ratio 1:1 entrega menores frametimes y mejor 1% Low que una memoria DDR5 a 7200 MT/s en ratio 1:2 desincronizado.',
  },
  {
    id: 'pcb-microwave-topology',
    title: 'Microondas en el PCB: Daisy-Chain vs. T-Topology',
    subtitle: 'Por qué instalar 2 módulos de RAM en los zócalos equivocados causa inestabilidad instantánea',
    tag: 'INTEGRIDAD DE SEÑAL DE ALTA FRECUENCIA',
    summary:
      'A frecuencias superiores a 3200 MHz en DDR4 y 6000 MHz en DDR5, las señales eléctricas en las pistas de cobre de la placa madre no se comportan como corriente continua en un cable, sino como ondas electromagnéticas de radiofrecuencia (microondas) sujetas a impedancia, reflexiones y diafonía (crosstalk).',
    keyConcepts: [
      {
        title: 'Topología Daisy-Chain (Predominante en placas modernas)',
        description:
          'Las pistas van desde el zócalo de la CPU primero al slot A1 y luego continúan hacia el slot A2 (y lo mismo para B1 y B2). El slot A2/B2 es el extremo final de la traza donde está la resistencia de terminación.',
      },
      {
        title: 'El Fenómeno del Stub Desconectado (Signal Reflection)',
        description:
          'Si colocás tu módulo en A1 en lugar de A2, la señal llega a A1, pero la pista de cobre vacía que continúa hasta A2 actúa como una antena abierta (Stub). La onda eléctrica rebota en el extremo y regresa a A1 en contrafase, corrompiendo los bits de datos.',
      },
      {
        title: 'T-Topology (Optimizada para 4 slots poblados)',
        description:
          'La pista se bifurca en forma de "T" con idéntica longitud milimétrica hacia A1 y A2. Es ideal para 4 módulos idénticos, pero no alcanza las frecuencias máximas que logra una Daisy-Chain con solo 2 módulos.',
      },
    ],
    technicalDetail:
      'Fórmula inquebrantable de latencia real: Latencia Absoluta (ns) = (CL × 2000) / Frecuencia Efectiva (MT/s). Un kit DDR4 3200 MHz CL14 tiene una latencia de 8.75 ns. Un kit DDR5 6000 MHz CL30 tiene una latencia de 10.00 ns. El DDR5 ofrece más de 2x ancho de banda bruto (GB/s), pero su latencia de primera palabra (First Word Latency) es ligeramente mayor.',
    forensicNote:
      'Regla EVO pericial: en cualquier placa madre de 4 ranuras con topología Daisy-Chain, los dos módulos deben ir OBLIGATORIAMENTE en los slots 2 y 4 (rotulados A2 y B2 en el PCB). Ignorar esto causa fallas de arranque o fallos aleatorios en MemTest86.',
  },
  {
    id: 'pcie-bus-negotiation',
    title: 'Negociación de Bus PCIe y Degeneración de Enlace',
    subtitle: 'Cómo un conector flojo o líneas compartidas reducen silenciosamente el rendimiento de la GPU a la mitad',
    tag: 'COMUNICACIÓN DE PLATAFORMA',
    summary:
      'La interfaz PCI Express es una conexión serie punto a punto bidireccional. La ranura principal de la tarjeta de video cuenta físicamente con 16 carriles de datos (x16). Sin embargo, la tarjeta y la placa madre negocian la velocidad (Gen 3, Gen 4, Gen 5) y el ancho de carril (x16, x8, x4, x1) de forma dinámica en cada inicio mediante paquetes de entrenamiento (Link Training).',
    keyConcepts: [
      {
        title: 'Bifurcación Indebida por Ranuras M.2 Compartidas',
        description:
          'En muchas placas base de gama media, instalar un segundo o tercer SSD NVMe M.2 activa un conmutador de hardware (lane switch) que divide los 16 carriles de la CPU en 8 carriles para la GPU y 4+4 para los SSDs.',
      },
      {
        title: 'GPU Sag (Pandeo por Peso) y Desconexión de Pines',
        description:
          'Tarjetas gráficas de más de 1.8 kg ejercen palanca mecánica sobre el slot PCIe. Con el tiempo, los pines dorados finales pierden contacto microscópico, forzando a Windows a degradar el enlace a x8 o x4 sin emitir advertencia al usuario.',
      },
      {
        title: 'Pines de Detección de Presencia (PRSNT1# / PRSNT2#)',
        description:
          'El slot PCIe utiliza los pines A1 y B17/B48/B81 para detectar cuántos carriles están físicamente conectados. Si hay grasa de dedos o polvo en esos contactos, el controlador degrada el ancho de banda automáticamente.',
      },
    ],
    technicalDetail:
      'Comando pericial PowerShell para auditar la negociación real de PCIe en Windows: Get-CimInstance Win32_VideoController | Select-Object Name, VideoProcessor, PNPDeviceID. Adicionalmente, herramientas como GPU-Z en su test de render revelan si el bus está operando a PCIe x16 4.0 @ x16 4.0 o si se encuentra degradado a x8 o x4.',
    forensicNote:
      'Evidencia física: una GPU que rinde un 15% menos de lo esperado en benchmarks suele tener su enlace degradado a x4 por pandeo mecánico o polvo en los pines dorados.',
  },
];

// ==========================================
// 2. TELEMETRÍA DE PRECISIÓN & DPC LATENCY
// ==========================================

export const TELEMETRY_METRICS: TelemetryMetricItem[] = [
  {
    id: 'frametime-vs-fps',
    metric: 'Frametime & Percentil 1% Low',
    unit: 'Milisegundos (ms)',
    whyAveragesLie:
      'El promedio de FPS es un simple cálculo aritmético (Frames Totales / Segundos Totales). Una máquina puede promediar 120 FPS pero tener 3 cuadros que tardaron 90 ms cada uno en dibujarse. El ojo humano percibe esos 90 ms como un congelamiento violento (stutter), mientras que el contador de FPS promedio sigue mostrando 118 FPS.',
    realMeasurementMethod:
      'Captura pericial de tiempo de cuadro por cuadro (Frametime Pacing) con CapFrameX o PresentMon. Cálculo del percentil 1% Low (el peor 1% de los cuadros) y 0.1% Low.',
    targetThreshold:
      'A 60 Hz: 16.6 ms continuos. A 144 Hz: 6.94 ms continuos. A 240 Hz: 4.16 ms continuos. Desviación estándar (Frame Jitter) < 1.2 ms.',
    criticalWarning:
      'Cualquier cuadro que supere los 33.3 ms genera una desincronización visible (judder) aunque el software de marketing afirme 100+ FPS.',
  },
  {
    id: 'dpc-latency-ring0',
    metric: 'Latencia DPC (Deferred Procedure Calls) e ISR',
    unit: 'Microsegundos (µs)',
    whyAveragesLie:
      'El Administrador de tareas de Windows no muestra la latencia de las interrupciones del kernel. Si un controlador (driver) mal programado se apropia de la CPU en el Anillo 0 (Ring 0) por más de 1000 µs, congela la cola de audio y video provocando chasquidos de sonido (audio crackling) y micro-pausas.',
    realMeasurementMethod:
      'Auditoría con LatencyMon durante 10 minutos bajo carga representativa. Inspección de tiempo de ejecución de ISR (Interrupt Service Routine) y rutinas DPC por driver específico.',
    targetThreshold:
      'Excelente: < 250 µs. Aceptable para gaming: < 800 µs. Crítico / Inaceptable: > 1000 µs (genera dropouts de buffer).',
    criticalWarning:
      'Los tres sospechosos habituales en Windows: nvlddmkm.sys (driver gráfico NVIDIA), ndis.sys (controlador de red Ethernet/WiFi) y wdf01000.sys (Kernel Mode Driver Framework).',
  },
  {
    id: 'vram-allocation-vs-commit',
    metric: 'VRAM Asignada (Allocated) vs. Comprometida (Dedicated)',
    unit: 'Megabytes / Gigabytes (MB/GB)',
    whyAveragesLie:
      'Muchos programas de monitoreo reportan la "Memoria de video asignada". Los motores de juegos modernos asignan preventivamente toda la VRAM libre aunque solo necesiten 4 GB. Pensar que "el juego consume 12 GB" suele ser una ilusión de la reserva preventiva del motor.',
    realMeasurementMethod:
      'Diferenciar entre "Dedicated VRAM Usage" (memoria física ocupada en los chips GDDR de la GPU) y "Shared System Memory" (páginas desbordadas a la memoria RAM del sistema a través del bus PCIe).',
    targetThreshold:
      'La memoria dedicada nunca debe exceder el 95% de la capacidad de la tarjeta. Si la memoria compartida (Shared) supera los 200 MB, el rendimiento cae de inmediato entre un 40% y un 80%.',
    criticalWarning:
      'Cuando la VRAM física se satura, el sistema recurre a la RAM del sistema mediante el bus PCIe a 30 GB/s en lugar de los 500+ GB/s de la GDDR6, provocando una caída catastrófica de FPS.',
  },
  {
    id: 'telemetry-polling-overhead',
    metric: 'Sobrecarga de Sondeo (Telemetry Polling Overhead)',
    unit: 'Interrupciones por segundo',
    whyAveragesLie:
      'Ejecutar simultáneamente cinco programas de monitoreo (HWiNFO, MSI Afterburner, iCUE, Armoury Crate y NZXT CAM) genera consultas constantes al bus SMBus y a los registros MSR de la CPU cada 100 ms. El propio acto de medir altera y perjudica la medición (Efecto Observador).',
    realMeasurementMethod:
      'Cerrar suites de telemetría redundantes. Utilizar únicamente un perfil de captura ligera con bajo muestreo (ej. 500-1000 ms) o telemetría asíncrona de GPU vía ETW (Event Tracing for Windows).',
    targetThreshold:
      'Uso de CPU de las herramientas de telemetría < 0.2%. Frecuencia de muestreo recomendada: 1000 ms para estabilidad térmica, 10 ms solo para ráfagas de benchmark específicas.',
    criticalWarning:
      'iCUE, Armoury Crate y Dragon Center son conocidos por despertar núcleos dormidos de la CPU permanentemente, impidiendo que el procesador entre en estados de reposo C-States (C6/C7).',
  },
];

// ==========================================
// 3. PROTOCOLO DE DIAGNÓSTICO FORENSE
// ==========================================

export const FORENSIC_CASE_STUDIES: ForensicCaseStudy[] = [
  {
    id: 'case-thermal-film',
    symptom: 'La CPU alcanza instantáneamente 100°C al abrir cualquier aplicación liviana; ventiladores al 100% permanente.',
    initialMyth: '“Windows 11 tiene un virus minero en segundo plano o el disipador AIO de 360mm vino fallado de fábrica”.',
    forensicEvidence:
      'Al desmontar el bloque disipador, la pasta térmica no exhibe el patrón de aplastamiento radial contra el cobre, sino una huella perfectamente cuadrada y brillante con letras transparentes impresas.',
    rootCause:
      'El film protector plástico de polietileno transparente adherido a la base de cobre del cooler NO fue retirado antes de aplicar la pasta térmica. El plástico actúa como una barrera térmica con conductividad casi nula (~0.19 W/m·K vs 400 W/m·K del cobre).',
    resolution:
      'Retirar el film plástico adhesivo, limpiar la superficie con alcohol isopropílico al 99.9%, reaplicar una gota calibrada de pasta térmica no conductora y realizar torque en cruz con presión graduada.',
    preventionRule:
      'Regla EVO: NUNCA asumas que un cooler está listo para instalar sin inspeccionar visualmente y con luz rasante la base de cobre.',
  },
  {
    id: 'case-ram-channel-drop',
    symptom: 'Windows reporta 16 GB instalados pero solo "7.9 GB utilizables"; el administrador de tareas muestra "Reservado para hardware: 8.1 GB".',
    initialMyth: '“Hay que ejecutar msconfig y tildar la casilla de Memoria Máxima o reinstalar Windows limpio”.',
    forensicEvidence:
      'La inspección con Get-CimInstance Win32_PhysicalMemory revela que ambos módulos están energizados en los slots, pero el controlador de memoria integrado (IMC) no logra entrenar el Canal B (Memory Training Timeout). Al retirar la CPU del socket LGA, dos pines microscópicos de la esquina suroeste están desviados 0.3 mm por exceso de torque en el disipador.',
    rootCause:
      'Exceso de torque o presión asimétrica de los tornillos del cooler sobre el socket LGA (como LGA 1700 / LGA 1851), curvando el PCB del procesador y desalineando los pines dedicados a las líneas de datos del canal B de memoria.',
    resolution:
      'Aflojar el disipador, retirar la CPU, realinear los pines del socket con pinza de microprecisión bajo lupa estereoscópica (o instalar un Contact Frame corrector de curvatura) y apretar con torque cruzado de 0.6 Nm uniforme.',
    preventionRule:
      'Regla EVO: La casilla msconfig -> Memoria Máxima es un limitador de depuración para desarrolladores, JAMÁS una solución a problemas de hardware.',
  },
  {
    id: 'case-pcie-sag-x4',
    symptom: 'Una RTX 4070 Ti entrega la mitad de FPS en 1440p que las pruebas de referencia; micro-congelamientos al mover la cámara.',
    initialMyth: '“El driver de NVIDIA está corrupto, hay que pasar DDU 10 veces seguidas”.',
    forensicEvidence:
      'GPU-Z y PowerShell reportan que la interfaz de bus opera a "PCIe x4 4.0" en lugar de "PCIe x16 4.0". Al sostener la tarjeta gráfica con la mano hacia arriba 2 milímetros, la interfaz conmuta inmediatamente a "PCIe x16 4.0".',
    rootCause:
      'GPU Sag (pandeo por peso). El disipador masivo de 3 ventiladores ejerce un momento torsor sobre la ranura PCIe x16. Los pines dorados de transmisión de datos de los carriles 5 al 16 pierden contacto eléctrico en el peine de la placa madre.',
    resolution:
      'Instalar un soporte rígido antisag vertical de aluminio regulable debajo del extremo derecho de la GPU para mantenerla a 90 grados exactos respecto a la placa madre.',
    preventionRule:
      'Regla EVO: Auditar el estado de negociación del bus PCIe ANTES de culpar a la optimización del juego o reinstalar controladores.',
  },
  {
    id: 'case-dramless-ssd-stutter',
    symptom: 'En juegos de mundo abierto (Cyberpunk 2077, GTA V, Warzone), el juego se congela durante 1 a 2 segundos de forma aleatoria al doblar una esquina velozmente.',
    initialMyth: '“El procesador hace cuello de botella o falta memoria RAM”.',
    forensicEvidence:
      'El Administrador de tareas muestra el SSD principal al 100% de uso de tiempo activo con tiempos de respuesta que escalan de 2 ms a 1400 ms (1.4 segundos) exactamente en el momento del tirón, con tasa de lectura de apenas 8 MB/s.',
    rootCause:
      'SSD NVMe sin memoria DRAM dedicada (DRAM-less) de bajo costo. Al llenarse al 80% de su capacidad, la memoria caché SLC se agota. La controladora debe leer y escribir la tabla de mapeo Flash (FTL) directamente en la memoria NAND lenta, bloqueando todas las solicitudes I/O del motor del juego.',
    resolution:
      'Migrar el sistema y los juegos de alta tasa de streaming a una unidad SSD NVMe con DRAM dedicada integrada (ej. Samsung 980 Pro / 990 Pro, Kingston KC3000, WD Black SN850X) o asegurar que el Host Memory Buffer (HMB) en Windows esté habilitado.',
    preventionRule:
      'Regla EVO: La velocidad de lectura secuencial de folleto (ej. 7000 MB/s) no evita el stuttering. Lo que evita el stuttering es el tiempo de respuesta aleatorio en colas cortas (4K Random QD1) y la presencia de DRAM en el SSD.',
  },
];
