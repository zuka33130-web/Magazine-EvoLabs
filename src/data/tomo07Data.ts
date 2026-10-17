// TOMO 07: GAMING PRO / RENDIMIENTO // METROLOGÍA DE FRAMETIMES, LATENCIA & RENDIMIENTO REAL
// Contenido Editorial Maestro, Capítulos Técnicos, Prácticas, Casos Reales y Fuentes Oficiales

export interface Tomo07Chapter {
  id: string;
  moduleNumber: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  readTime: string;
  topicsCovered: string[];
  capa1Explicacion: string;
  capa2DetalleTecnico: string;
  capa3PracticaMedicion: string;
  microformatos: {
    mito: string;
    errorComun: string;
    comprobalo: string;
    paraTecnicos: string;
    conclusionEvo: string;
  };
  decisionRule: string;
  benchTarget?: {
    labView: 'windows-matrix' | 'hotswap-lab';
    scenario: string;
    badgeLabel: string;
  };
}

export interface Tomo07CaseStudy {
  id: string;
  title: string;
  symptom: string;
  telemetryMeasured: string;
  methodologyApplied: string;
  discardedHypothesis: string;
  rootCause: string;
  evidenceConclusion: string;
  verificationMetric: string;
}

export interface Tomo07GlossaryItem {
  term: string;
  metricOrStandard: string;
  definition: string;
  measurementProtocol: string;
}

export const TOMO_07_META = {
  number: '07',
  volumeLabel: 'Tomo 07',
  title: 'GAMING PRO / RENDIMIENTO',
  subtitle: 'Optimizamos de verdad. Sin secretos ni placebos.',
  themeColor: '#F59E0B',
  secondaryColor: '#D97706',
  badge: 'METROLOGÍA DE FRAME PACING & PIPELINE DE RENDERIZADO',
  edition: 'Edición Técnica de Rendimiento 2026',
  totalPages: 48,
  manifestoPhrase: 'LOS FPS PROMEDIO SON UNA FICCIÓN MATEMÁTICA: LA FLUIDEZ REAL SE MIDE EN LA CONSISTENCIA DE CADA MILISEGUNDO DE FRAMETIME.',
  description: 'Tratado científico y metrológico sobre el rendimiento en videojuegos y aplicaciones en tiempo real. Análisis empírico de frametimes, percentiles 1% y 0.1% low, latencia de entrada (Input Lag), sincronización VRR/G-Sync, desbordamiento de VRAM, contención DPC y aislamiento metrológico de cuellos de botella.',
  sources: [
    'Intel PresentMon Architecture & Open-Source Telemetry (GPU Busy / Frame Pacing)',
    'NVIDIA Reflex SDK & Latency FleX Metering Documentation',
    'VESA Adaptive-Sync / DisplayPort Standard Specification',
    'AMD FreeSync & Anti-Lag 2 Technical Whitepapers',
    'Microsoft DirectX 12 Agility SDK - Present Multiplexing & Flip Model',
    'CapFrameX Performance Benchmarking & Frame Time Analysis Methodology',
    'Blur Busters - G-SYNC 101: Optimal Settings & Input Lag Breakdown',
  ],
};

export const TOMO_07_CHAPTERS: Tomo07Chapter[] = [
  {
    id: 't07-c01',
    moduleNumber: 'M01',
    chapterNumber: '01',
    title: 'La Ilusión de los FPS vs Metrología de Frametime',
    subtitle: 'Por qué el promedio de FPS engaña: percentiles 1% low, 0.1% low y micro-stuttering',
    readTime: '13 min',
    topicsCovered: ['01 FPS', '02 Frametime', '03 Promedio', '04 1% low', '05 Percentiles', '06 Stutter'],
    capa1Explicacion:
      'Imaginá un colectivo que viaja a "60 km/h de promedio". Suena bien, pero si estuvo 59 minutos detenido y en el último minuto aceleró a 3600 km/h, el promedio sigue siendo 60, pero la experiencia fue un desastre. Con los FPS pasa exactamente lo mismo: una computadora puede reportar "144 FPS promedio", pero si un cuadro tarda 6.9 milisegundos y el siguiente tarda 85 milisegundos, tus ojos perciben un tirón brutal (stutter). La métrica real de fluidez no son los FPS, sino el Frametime: el tiempo exacto en milisegundos que tarda la máquina en renderizar cada fotograma individual.',
    capa2DetalleTecnico:
      'La relación matemática es `Frametime (ms) = 1000 / FPS`. A 60 FPS fijos, cada cuadro debe tardar exactamente 16.66 ms; a 144 FPS, 6.94 ms; a 240 FPS, 4.16 ms. Los percentiles ordenan matemáticamente todos los cuadros de una sesión de menor a mayor duración. El percentil 99th de frametime (equivalente al 1% low) representa el promedio del 1% de los cuadros más lentos de la sesión. Si tus FPS promedio son 160 pero tu 1% low es de 35 FPS, el motor está sufriendo pausas intermitentes causadas por recolección de basura, carga de texturas o colas de hilos desbalanceadas.',
    capa3PracticaMedicion:
      'Medición profesional con CapFrameX o Intel PresentMon: capturar una pasada de juego idéntica de 60 segundos. Graficar la línea de frametimes: una línea plana y horizontal indica fluidez cinematográfica perfecta; picos verticales hacia arriba representan congelamientos perceptibles.',
    microformatos: {
      mito: 'Mito: "Si mi contador de FPS en la esquina dice 200, el juego no puede tener tirones."',
      errorComun: 'Confiar en los contadores de FPS integrados de los juegos o de Steam: actualizan el número cada 500-1000 ms promediando cientos de cuadros, ocultando por completo micro-congelamientos de 40 ms.',
      comprobalo: 'Abrí CapFrameX o PresentMon, activá el gráfico de frametime en pantalla y observá cómo un solo cuadro de 50 ms arruina la sensación de fluidez aunque el contador de FPS promedio no baje de 120.',
      paraTecnicos: 'La desviación estándar de los frametimes (Frame Time Variance / Jitter) es el indicador estadístico puro de consistencia. Valores de varianza > 2.5 ms en monitores de alta tasa de refresco degradan severamente el seguimiento visual en shooters competitivos.',
      conclusionEvo: 'No optimices para el promedio de FPS: optimizá para elevar el 1% y 0.1% low y aplanar la curva de frametimes.',
    },
    decisionRule: 'Cualquier modificación o ajuste de configuración debe evaluarse comparando el percentil 1% low y la varianza de frametime, jamás el FPS promedio aislado.',
    benchTarget: {
      labView: 'hotswap-lab',
      scenario: 'ab-bench',
      badgeLabel: 'METROLOGÍA DE FRAMETIME',
    },
  },
  {
    id: 't07-c02',
    moduleNumber: 'M01',
    chapterNumber: '02',
    title: 'Cuellos de Botella: CPU Limit vs GPU Limit',
    subtitle: 'Aislamiento riguroso del componente limitante sin adivinanzas',
    readTime: '15 min',
    topicsCovered: ['07 CPU limit', '08 GPU limit', '09 RAM limit', '10 VRAM', '11 Almacenamiento', '12 Streaming de assets'],
    capa1Explicacion:
      'Toda computadora tiene un componente que trabaja más que los demás y fija el techo máximo de rendimiento: eso es un cuello de botella y es completamente normal. El error es no saber cuál es. Si la tarjeta de video (GPU) está al 98% de uso, estás limitado por la GPU (GPU Bound), lo cual es ideal en juegos porque aprovechás todo tu hardware gráfico. Si tu GPU está al 60% y los FPS no suben, estás limitado por el procesador (CPU Bound), la memoria RAM o el motor del juego.',
    capa2DetalleTecnico:
      'En el pipeline de renderizado moderno, la CPU ejecuta la lógica del juego, física, animaciones y construye las listas de comandos (Draw Calls). Luego se las envía a la GPU para que rasterice o aplique Ray Tracing a los píxeles. Intel PresentMon introdujo la métrica definitiva: `GPU Busy`. Si el tiempo que la GPU tarda en renderizar el cuadro (`GPU Busy`) es casi idéntico al frametime total, el sistema está 100% limitado por la GPU. Si el frametime total es de 14 ms pero `GPU Busy` es de solo 6 ms, la GPU estuvo esperando 8 ms a que la CPU terminara de preparar la escena.',
    capa3PracticaMedicion:
      'Prueba de cambio de resolución: reducir la resolución del juego de 1440p a 720p. Si los FPS se duplican, estabas 100% limitado por GPU. Si los FPS se quedan exactamente iguales, estabas 100% limitado por CPU o velocidad/latencia de la memoria RAM.',
    microformatos: {
      mito: 'Mito: "Si mi CPU de 12 núcleos está al 35% de uso total en el Administrador de Tareas, no tengo cuello de botella de CPU."',
      errorComun: 'Mirar el porcentaje global de CPU: la mayoría de los motores de juegos dependen críticamente de 1 o 2 hilos principales (Render Thread y Game Thread). Si el hilo principal está al 100%, la CPU está saturada aunque los otros 10 núcleos estén durmiendo.',
      comprobalo: 'En el Administrador de Tareas, hacé clic derecho en el gráfico de CPU → "Cambiar gráfico a" → "Procesadores lógicos" y observá si hay un núcleo saturado al 100%.',
      paraTecnicos: 'La velocidad de la memoria RAM (MT/s) y los sub-timings primarios/secundarios (tRFC, tFAW) impactan drásticamente en escenarios de CPU-bound al reducir los ciclos de espera por fallos de caché (Cache Misses).',
      conclusionEvo: 'Un cuello de botella no es una falla de la máquina: es la frontera física que te indica exactamente qué componente debés ajustar.',
    },
    decisionRule: 'Si una reducción drástica de resolución no altera los FPS, el cuello de botella reside en CPU/RAM; subir la calidad gráfica de texturas o resolución en ese estado no penalizará los FPS.',
    benchTarget: {
      labView: 'hotswap-lab',
      scenario: 'ab-bench',
      badgeLabel: 'GPU BUSY & BOTTLENECK',
    },
  },
  {
    id: 't07-c03',
    moduleNumber: 'M02',
    chapterNumber: '03',
    title: 'VRAM, Texturas & Desbordamiento por PCIe',
    subtitle: 'La frontera de memoria de video, compresión de texturas y degradación abrupta',
    readTime: '13 min',
    topicsCovered: ['10 VRAM', '11 Almacenamiento', '12 Streaming de assets', '15 Frecuencia', '16 Resolución', '17 Calidad gráfica'],
    capa1Explicacion:
      'La memoria VRAM de la placa de video funciona como una mesa de trabajo ultra-rápida (ancho de banda de 300 a 1000 GB/s) donde se guardan las texturas, modelos y búferes de renderizado. Mientras todo entre en la mesa, el juego vuela. Pero en cuanto el juego necesita 8.5 GB y tu tarjeta solo tiene 8.0 GB, la placa se ve obligada a guardar el sobrante en la memoria RAM del sistema a través de las líneas del bus PCIe.',
    capa2DetalleTecnico:
      'El bus PCIe 4.0 x16 transmite a ~31.5 GB/s, y el bus PCIe 4.0 x8 a ~15.7 GB/s: esto es entre 15 y 30 veces más lento que la memoria GDDR6/GDDR6X integrada en la GPU. Cuando ocurre el desbordamiento de VRAM (Over-allocation), el motor debe hacer "swapping" de texturas en caliente por PCIe cada vez que la cámara gira o se entra a una zona nueva. Esto provoca caídas instantáneas a 3-5 FPS durante 500 ms (hiccups severos) mientras los FPS promedio siguen pareciendo aceptables.',
    capa3PracticaMedicion:
      'Monitoreo con MSI Afterburner / RivaTuner o CapFrameX: agregar la métrica "Uso de memoria de proceso" y "Uso de VRAM dedicado". Si la VRAM dedicada roza el 95-98% del total físico y se observan picos de frametime sincronizados con movimiento de cámara, hay saturación de VRAM.',
    microformatos: {
      mito: 'Mito: "Tener texturas en Ultra solo afecta la VRAM, no los FPS."',
      errorComun: 'Configurar texturas en Ultra o activar Ray Tracing (que requiere gigabytes adicionales para estructuras BVH) en tarjetas con 8 GB de VRAM a 1440p o 4K, arruinando la estabilidad.',
      comprobalo: 'Bajá la calidad de texturas de Ultra a Alta: en el 90% de los juegos la diferencia visual es imperceptible a distancia de juego pero libera entre 1.5 y 2.5 GB de VRAM, eliminando por completo los tirones por PCIe.',
      paraTecnicos: 'DirectStorage y Sampler Feedback Streaming mitigan la latencia cargando porciones de texturas directamente desde SSDs NVMe Gen4 hacia la GPU, pero no reemplazan la necesidad de capacidad nativa en resoluciones nativas altas.',
      conclusionEvo: 'Respetá el límite físico de VRAM de tu GPU: un juego en calidad Alta sin desbordamiento se siente diez veces más fluido que un juego en Ultra con tirones por paginación en PCIe.',
    },
    decisionRule: 'Ante tirones de frametime que ocurren exclusivamente al girar la cámara hacia escenarios nuevos, reducir un escalón la calidad de texturas antes de tocar cualquier otro ajuste.',
    benchTarget: {
      labView: 'hotswap-lab',
      scenario: 'vrm-short',
      badgeLabel: 'VRAM SATURATION TRACE',
    },
  },
  {
    id: 't07-c04',
    moduleNumber: 'M02',
    chapterNumber: '04',
    title: 'Temperatura, Curvas VRM & Throttling Térmico',
    subtitle: 'Cómo el calor degrada las frecuencias de reloj boost en silencio',
    readTime: '13 min',
    topicsCovered: ['13 Temperatura', '14 Throttling', '15 Frecuencia', '37 Estabilidad'],
    capa1Explicacion:
      'Los procesadores y tarjetas gráficas modernas ya no funcionan a una velocidad fija: tienen algoritmos inteligentes que suben su velocidad (boost) al máximo posible mientras la temperatura y el consumo eléctrico estén bajo control. Si el disipador se llena de polvo, la pasta térmica se seca o la ventilación del gabinete es pobre, el silicio reduce automáticamente su velocidad para no quemarse: este fenómeno se llama Thermal Throttling.',
    capa2DetalleTecnico:
      'NVIDIA GPU Boost escala la frecuencia de reloj hacia abajo en pasos de 15 MHz cada vez que la temperatura de la GPU supera escalones térmicos (ej. 65 °C, 75 °C, 83 °C). El punto crítico es la temperatura de Hotspot (unión más caliente del silicio) y la temperatura de las memorias GDDR6X, que pueden superar los 105 °C provocando caídas violentas de reloj mientras la temperatura promedio parece segura a 70 °C. En CPU (Intel Thermal Velocity Boost / AMD Precision Boost 2), alcanzar 95-100 °C colapsa las frecuencias de los núcleos de 5.2 GHz a 3.8 GHz en cuestión de segundos.',
    capa3PracticaMedicion:
      'Auditar con HWFiFO / HWiNFO64 en modo sensores: registrar "Frecuencia efectiva de reloj", "Temperatura GPU Hotspot", "GPU Memory Junction Temperature" y los flags de estado "Performance Limit Reasons" (Thermal, Power, Reliability Voltage).',
    microformatos: {
      mito: 'Mito: "Mientras la PC no se apague sola por calor, el rendimiento es el mismo."',
      errorComun: 'Probar la temperatura durante solo 30 segundos: la masa térmica del disipador tarda entre 10 y 20 minutos en saturarse por completo de calor; un benchmark válido debe durar al menos 15 minutos continuos.',
      comprobalo: 'Ejecutá un loop de benchmark en HWiNFO64: si el gráfico de frecuencia de la GPU muestra una caída escalonada a medida que la temperatura sube de 60 a 82 °C, estás perdiendo entre un 8% y un 15% de rendimiento real.',
      paraTecnicos: 'El thermal throttling en los módulos VRM de la placa madre (fases de alimentación de CPU) provoca caídas abruptas del multiplicador del procesador a 800 MHz (PROCHOT# forzado por el circuito de protección).',
      conclusionEvo: 'Un sistema frío no solo dura más años: entrega frecuencias de reloj sostenidas y un pacing de cuadros uniforme sin valles de rendimiento.',
    },
    decisionRule: 'Si las frecuencias de reloj caen con el tiempo de juego transcurrido, resolver la curva de ventilación o repastado térmico antes de modificar overclocking de software.',
    benchTarget: {
      labView: 'hotswap-lab',
      scenario: 'vrm-short',
      badgeLabel: 'THERMAL THROTTLING LOG',
    },
  },
  {
    id: 't07-c05',
    moduleNumber: 'M03',
    chapterNumber: '05',
    title: 'Pipeline de Latencia de Entrada (Input Lag)',
    subtitle: 'De la presión del switch del mouse al primer píxel iluminado en el monitor',
    readTime: '15 min',
    topicsCovered: ['18 Render queue', '19 Input latency', '20 Mouse latency', '21 Polling rate', '22 Monitor Hz', '26 Frame caps'],
    capa1Explicacion:
      'El rendimiento no es solo lo que ves en pantalla: es la rapidez con la que el juego responde a tus manos. La latencia del sistema (Input Lag total) es el tiempo que pasa desde que tu dedo hace clic en el mouse hasta que el arma dispara y la bala se ve en pantalla. Si tenés muchos FPS pero la latencia de entrada es alta, el mouse se siente "pesado" o "flotante", como si estuvieras jugando sobre hielo.',
    capa2DetalleTecnico:
      'El pipeline de latencia de extremo a extremo abarca: 1. Latencia del periférico (Switch mecánico/óptico + Polling Rate del mouse, ej. 1000 Hz = 1 ms, 4000 Hz = 0.25 ms), 2. Procesamiento del sistema operativo y cola de eventos de Windows, 3. Render Queue de DirectX (si la GPU está saturada al 100%, Windows encola 1 a 3 cuadros previos, agregando de 15 a 45 ms de retardo puro), 4. Tiempo de renderizado de la GPU, 5. Latencia de escaneo y transición del panel del monitor (Monitor Scanout + píxeles GtG).',
    capa3PracticaMedicion:
      'Medición con NVIDIA Reflex Analyzer o LatencyFleX: auditar la métrica "PC Latency". Activar tecnologías de bajo retardo como NVIDIA Reflex o AMD Anti-Lag 2, que vacían la cola de renderizado (Render Queue = 0) sincronizando la CPU con el momento exacto en que la GPU está lista para procesar el nuevo cuadro.',
    microformatos: {
      mito: 'Mito: "Tener un mouse de 8000 Hz de polling rate soluciona el input lag en cualquier PC."',
      errorComun: 'Usar un mouse a 8000 Hz en una CPU con baja potencia por núcleo o juegos antiguos: el bombardeo de interrupciones de hardware (8000 por segundo) satura el hilo principal del procesador, provocando tirones masivos de frametime.',
      comprobalo: 'Con la GPU al 99% de uso, activá NVIDIA Reflex / Anti-Lag en el menú del juego: los FPS se mantendrán casi iguales pero la latencia del sistema caerá a la mitad (de 45 ms a 22 ms).',
      paraTecnicos: 'El modo de baja latencia "Ultra" en el panel de control del driver fuerza la profundidad máxima de pre-renderizado a 1 cuadro, pero Reflex es superior porque desacopla la sincronía dinámicamente desde el motor del juego.',
      conclusionEvo: 'La sincronización entre periférico, hilo de renderizado y presentación al monitor define la precisión competitiva mucho más que los FPS en bruto.',
    },
    decisionRule: 'En juegos competitivos donde la GPU alcanza el 99% de uso, activar siempre NVIDIA Reflex / AMD Anti-Lag para eliminar el retardo de encolamiento de cuadros en el búfer de DirectX.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'timer-resolution',
      badgeLabel: 'INPUT PIPELINE LATENCY',
    },
  },
  {
    id: 't07-c06',
    moduleNumber: 'M03',
    chapterNumber: '06',
    title: 'Sincronización Perfecta: VRR, G-Sync, FreeSync & V-Sync',
    subtitle: 'La fórmula Blur Busters: cómo eliminar el desgarro sin pagar penalización de latencia',
    readTime: '15 min',
    topicsCovered: ['22 Monitor Hz', '23 VRR', '24 V-Sync', '25 FreeSync / G-Sync', '26 Frame caps'],
    capa1Explicacion:
      'Un monitor tradicional refresca su pantalla a un ritmo fijo (ej. 144 veces por segundo). La tarjeta gráfica renderiza a ritmo variable. Si no se sincronizan, el monitor muestra partes de dos cuadros distintos en el mismo escaneo: una línea horizontal molesta que corta la imagen al mover la cámara (Tearing / Desgarro). V-Sync clásico eliminaba el desgarro pero a costa de introducir un retardo de entrada gigante. La tecnología VRR (Variable Refresh Rate / G-Sync / FreeSync) cambió todo: hace que sea el monitor el que adapte su velocidad al ritmo de la tarjeta gráfica.',
    capa2DetalleTecnico:
      'G-Sync/FreeSync opera dentro de una ventana de frecuencias (VRR Range, ej. 48 Hz a 144 Hz). Si los FPS superan los 144 FPS, el sistema se sale del rango VRR y vuelve a ocurrir tearing o se activa el V-Sync clásico con su búfer acumulativo. La investigación de referencia de Blur Busters ("G-SYNC 101") determinó la configuración universalmente óptima: 1. Activar G-Sync/FreeSync en el monitor, 2. Activar V-Sync en el panel de control del driver (compensa los desfases de escaneo de los bordes inferiores del panel dentro del rango VRR sin añadir retardo), 3. Fijar un límite de cuadros (Frame Rate Cap) a 3 o 4 FPS por debajo del refresco máximo (ej. 141 FPS en 144 Hz, 236 FPS en 240 Hz).',
    capa3PracticaMedicion:
      'Prueba visual con G-SYNC Pendulum Demo o pruebas de seguimiento en juegos con cámara lateral. Verificar que el monitor dinámicamente reporte los Hz oscilando exactamente al compás de los FPS en su menú OSD interno.',
    microformatos: {
      mito: 'Mito: "V-Sync siempre agrega 50 ms de input lag y nunca debe usarse con G-Sync."',
      errorComun: 'Activar G-Sync sin limitar los FPS: en cuanto los FPS superan los Hz del monitor, se sale del rango de tasa variable y se producen tirones violentos o desgarros en el borde superior de la pantalla.',
      comprobalo: 'Configurá tu monitor de 144 Hz con G-Sync + V-Sync del driver + límite a 141 FPS con RTSS: cero desgarro, fluidez cristalina y latencia idéntica a jugar sin sincronización.',
      paraTecnicos: 'El límite de FPS debe fijarse preferentemente desde el motor del juego o con RivaTuner Statistics Server (RTSS), ya que los limitadores por software de drivers antiguos introducían ligeros desfases de temporizador de 1 frame.',
      conclusionEvo: 'VRR + V-Sync de driver + Frame Cap (-3 FPS) es el estándar científico para eliminar tearing con la menor latencia físicamente posible.',
    },
    decisionRule: 'En cualquier monitor con soporte de tasa de refresco variable (G-Sync/FreeSync), limitar siempre los FPS máximos a 3 FPS por debajo del refresco nativo del panel.',
    benchTarget: {
      labView: 'hotswap-lab',
      scenario: 'ab-bench',
      badgeLabel: 'VRR & FRAME PACING SYNC',
    },
  },
  {
    id: 't07-c07',
    moduleNumber: 'M04',
    chapterNumber: '07',
    title: 'Metodología Científica de Benchmarking & Optimización Real',
    subtitle: 'El protocolo A/B: línea de base, una sola variable, re-medición y descarte de placebos',
    readTime: '16 min',
    topicsCovered: ['28 DPC / ISR', '29 Procesos de fondo', '30 Scheduler', '34 PresentMon', '35 Metodología de benchmark', '36 Comparación A/B', '38 Optimización con evidencia'],
    capa1Explicacion:
      'Internet está lleno de "optimizaciones mágicas": scripts de PowerShell de dudosa procedencia, desactivar servicios esenciales de Windows, toquetear temporizadores o instalar "boosters de FPS". En el 95% de los casos son placebos o empeoran la estabilidad del sistema. La ingeniería de rendimiento de EVO LABS se rige por el método científico: medir una línea de base, alterar una única variable a la vez, volver a medir bajo condiciones idénticas y concluir con evidencia.',
    capa2DetalleTecnico:
      'Protocolo de Benchmark A/B riguroso: 1. Cerrar procesos aleatorios de fondo (actualizaciones de Windows pausadas, clientes de descarga cerrados), 2. Establecer una ruta reproducible en el juego (Replay fijo o benchmark integrado con cámara cinemática determinista), 3. Ejecutar 3 pasadas consecutivas para descartar compilación de shaders en caliente (Shader Caching) y calcular la media matemática, 4. Aplicar un único cambio técnico (ej. cambio de timing tRFC o activación de ReBAR), 5. Volver a ejecutar 3 pasadas, 6. Comparar media de 1% low, varianza de frametimes y temperatura. Si el cambio está dentro del ±1.5% de margen de error estadístico, se concluye: Placebo.',
    capa3PracticaMedicion:
      'Auditar latencias del kernel antes de jugar con LatencyMon: verificar que ningún controlador de terceros (como `ndis.sys`, `nvlddmkm.sys` o drivers de audio USB) genere ejecuciones DPC (Deferred Procedure Call) superiores a 1000 microsegundos, las cuales interrumpen el hilo de renderizado del motor.',
    microformatos: {
      mito: 'Mito: "Desactivar la telemetría y borrar servicios de Windows aumenta 20 FPS en juegos."',
      errorComun: 'Descargar scripts de optimización "Windows Debloater" que rompen dependencias de DirectX, Xbox Game Bar (esencial para el scheduler de núcleos híbridos de Intel y AMD 3D V-Cache) y causan inestabilidad.',
      comprobalo: 'Medí con CapFrameX antes y después de aplicar un "optimizador de registro": comprobarás que los FPS promedio son idénticos pero el 0.1% low empeoró por contención de dependencias del kernel.',
      paraTecnicos: 'El scheduler de Windows 11 junto con Intel Thread Director o el driver de chipset AMD 3D V-Cache asigna automáticamente los hilos pesados de juegos a los núcleos con caché 3D o núcleos P; romper los servicios del sistema anula esta telemetría y degrada el rendimiento.',
      conclusionEvo: 'Toda optimización sin telemetría comparativa documentada es mitología. Medí, compará, comprobá y descartá el placebo.',
    },
    decisionRule: 'Nunca adoptar una supuesta optimización sin un informe A/B de al menos 3 pasadas que demuestre mejora estadística verificable en el percentil 1% low.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'timer-resolution',
      badgeLabel: 'PROTOCOLO A/B CAPFRAMEX',
    },
  },
];

export const TOMO_07_CASES: Tomo07CaseStudy[] = [
  {
    id: 'case-01',
    title: 'Caso 1: 240 FPS de promedio pero micro-tirones intolerables en shooter',
    symptom: 'El usuario juega a 240 FPS en monitor de 240 Hz pero reporta que los movimientos rápidos de cámara se sienten trabados y entrecortados.',
    telemetryMeasured: 'FPS promedio: 242. Percentil 1% low: 48 FPS. Picos de frametime de 45 a 65 ms cada 3 a 5 segundos.',
    methodologyApplied: 'Captura con CapFrameX de 60 segundos en partida privada con bot fijo.',
    discardedHypothesis: 'Se descartó fallo en la GPU (temperatura estable en 62 °C) y problemas de conexión a Internet.',
    rootCause: 'El usuario tenía el juego configurado con FPS desbloqueados (sin límite) alcanzando picos de 320 FPS en zonas livianas y 190 FPS en zonas pesadas, saturando el buffer de la cola de DirectX y saliéndose constantemente de la ventana VRR del monitor.',
    evidenceConclusion: 'Al fijar un límite de 236 FPS mediante RTSS con G-Sync activo, el frametime se aplanó en 4.23 ms constantes. El 1% low subió de 48 FPS a 228 FPS.',
    verificationMetric: 'Varianza de frametime cayó de 8.4 ms a 0.42 ms; fluidez percibida 100% estable.',
  },
  {
    id: 'case-02',
    title: 'Caso 2: Caídas violentas de 75 a 8 FPS al girar la vista en juego moderno',
    symptom: 'Juego AAA en 1440p con calidad Ultra funciona a 75 FPS en línea recta, pero al ingresar a una ciudad o girar bruscamente la cámara la pantalla se congela durante medio segundo.',
    telemetryMeasured: 'Uso de VRAM: 7980 MB constantes sobre una GPU física de 8192 MB (8 GB). Uso de bus PCIe: 84% de saturación con transferencias bidireccionales continuas.',
    methodologyApplied: 'Prueba comparativa A/B aislando exclusivamente la calidad de Texturas y el tamaño del búfer de sombras.',
    discardedHypothesis: 'Se sospechó de cuello de botella en el procesador Ryzen 5.',
    rootCause: 'Desbordamiento severo de VRAM (Over-allocation): las texturas en Ultra exigían 9.4 GB de espacio. La tarjeta paginaba 1.5 GB de texturas a través del bus PCIe hacia la RAM del sistema en cada giro de cámara.',
    evidenceConclusion: 'Reducir la calidad de texturas a "Alta" liberó 1.8 GB de VRAM (ocupación final 6.2 GB). Las caídas a 8 FPS desaparecieron por completo.',
    verificationMetric: 'El 0.1% low se elevó de 7.8 FPS a 61.2 FPS sin pérdida apreciable de fidelidad gráfica.',
  },
  {
    id: 'case-03',
    title: 'Caso 3: Tirones por latencia DPC causados por controlador de red obsoleto',
    symptom: 'Una PC de gama alta (RTX 4080 / i9) presenta micro-stuttering en todos los juegos independientemente de la resolución o calidad gráfica.',
    telemetryMeasured: 'PresentMon registra picos de frametime no correlacionados con carga gráfica. LatencyMon reporta que `ndis.sys` y el driver de la tarjeta de red Wi-Fi superan los 2400 µs de tiempo de ejecución DPC diferido.',
    methodologyApplied: 'Auditoría del subsistema de interrupciones de Windows (ISR/DPC) con LatencyMon en reposo y bajo carga de red.',
    discardedHypothesis: 'Se sospechó de problemas térmicos en el procesador o throttling de frecuencias.',
    rootCause: 'El controlador genérico de la placa de red Wi-Fi instalado por Windows Update generaba tormentas de interrupciones DPC que congelaban el hilo de renderizado del motor gráfico.',
    evidenceConclusion: 'Instalación del controlador oficial firmado por el fabricante del chip y desactivación de funciones de ahorro de energía agresivas de la interfaz.',
    verificationMetric: 'Tiempo máximo de DPC cayó de 2400 µs a 95 µs; los tirones en juegos desaparecieron totalmente.',
  },
];

export const TOMO_07_GLOSSARY: Tomo07GlossaryItem[] = [
  {
    term: 'Frametime (Tiempo de Cuadro)',
    metricOrStandard: 'Milisegundos (ms)',
    definition: 'El tiempo exacto que requiere el sistema de hardware y software para generar y presentar un fotograma individual en pantalla.',
    measurementProtocol: 'Se mide mediante PresentMon o CapFrameX calculando la diferencia temporal entre eventos sucesivos de presentación (Present API).',
  },
  {
    term: '1% Low (Percentil 99th de Frametime)',
    metricOrStandard: 'FPS equivalentes o ms',
    definition: 'El valor estadístico que representa la media del 1% de los cuadros más lentos de una sesión de prueba.',
    measurementProtocol: 'Ordena todos los frametimes de menor a mayor y toma el promedio del peor 1% para cuantificar el micro-stuttering.',
  },
  {
    term: 'GPU Busy',
    metricOrStandard: 'Intel PresentMon Telemetry',
    definition: 'El tiempo que la GPU estuvo efectivamente procesando comandos de renderizado para un cuadro específico, sin contar los tiempos de espera a la CPU.',
    measurementProtocol: 'Permite aislar con certeza absoluta si un desbalance es causado por saturación gráfica o por contención en el procesador.',
  },
  {
    term: 'Variable Refresh Rate (VRR / G-Sync / FreeSync)',
    metricOrStandard: 'VESA Adaptive-Sync',
    definition: 'Tecnología que sincroniza dinámicamente la tasa de escaneo del monitor con la tasa de cuadros producida por la tarjeta gráfica.',
    measurementProtocol: 'Elimina el desgarro (tearing) sin introducir los retardos masivos de búfer asociados al V-Sync convencional.',
  },
  {
    term: 'Input Lag del Sistema (System Latency)',
    metricOrStandard: 'Milisegundos (ms)',
    definition: 'El retardo total medido desde la activación física de un interruptor en el periférico de entrada hasta el cambio de luminosidad del primer píxel en pantalla.',
    measurementProtocol: 'Se audita mediante NVIDIA Reflex Analyzer o herramientas de fotodiodos ópticos sincronizados con el bus USB.',
  },
];
