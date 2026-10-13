import { Cpu, Wrench, ShieldCheck, Gamepad2, Sliders, Binary, Sparkles, Layers, BookOpen, Radio, Terminal, Laptop, Power, Network, Shield, Gauge } from 'lucide-react';

export interface EvoSchoolLevel {
  levelNumber: number;
  id: string;
  title: string;
  subtitle: string;
  objective: string;
  tomos: string[]; // e.g. ['01'] or ['02', '08']
  accentColor: string;
  iconName: string;
  recommendedTag: string;
}

export interface EvoTomePedagogicalProfile {
  tomoId: string;
  tomoNumber: string;
  title: string;
  levelNumber: number;
  levelName: string;
  tagline: string;
  whatYouWillLearn: string[];
  whyItMatters: string;
  recommendedPrerequisites: string[];
  associatedMagazine: string;
  associatedLabTitle: string;
  associatedLabStatus: 'ACTIVO' | 'EN DESARROLLO';
  associatedLabId?: string;
  expectedOutcome: string;
  methodSteps: {
    stage: 'ENTENDER' | 'LEER' | 'PREPARARSE' | 'PRACTICAR' | 'DIAGNOSTICAR' | 'COMPROBAR';
    description: string;
  }[];
}

export interface EvoLabPedagogicalGuide {
  id: string;
  name: string;
  category: 'guiado' | 'tecnico' | 'operaciones';
  relatedTomoId?: string;
  relatedTomoTitle?: string;
  whatIsThisLab: string;
  whatYouWillPractice: string;
  whatToKnowBefore: string;
  howToUse: string;
  whatToObserve: string;
  whatToProve: string;
  whatToDoWhenFinished: string;
  whenToUse: string;
  whatOutputDelivers: string;
  actionKey: 'boot-lab' | 'hardware' | 'silicon' | 'metrology' | 'software-kernel' | 'telemetry' | 'windows-matrix' | 'operaciones' | 'consola' | 'core';
  status: 'ACTIVO' | 'DISPONIBLE' | 'EN DESARROLLO';
  accentColor: string;
}

// =========================================================================
// 1. NIVELES PEDAGÓGICOS OFICIALES DE LA ESCUELA EVO (NIVEL 0 A NIVEL 6)
// =========================================================================
export const EVO_SCHOOL_LEVELS: EvoSchoolLevel[] = [
  {
    levelNumber: 0,
    id: 'nivel-0',
    title: 'CÓMO USAR EVO LABS',
    subtitle: 'Metodología, anatomía de la plataforma y filosofía de aprendizaje técnico.',
    objective: 'Entender cómo funciona la escuela, qué es un Tomo, qué es un Laboratorio Guiado, qué es un Laboratorio Técnico, qué es un Caso EVO y cómo registrar progreso demostrable.',
    tomos: [],
    accentColor: '#38BDF8',
    iconName: 'Compass',
    recommendedTag: 'INICIO OBLIGATORIO SUGERIDO',
  },
  {
    levelNumber: 1,
    id: 'nivel-1',
    title: 'CONOCER LA PC',
    subtitle: 'Arquitectura física, silicio, buses de datos e interconexión interna.',
    objective: 'Comprender componentes, hardware y funcionamiento básico de la máquina desde el silicio hasta la placa madre.',
    tomos: ['01'],
    accentColor: '#EAB308',
    iconName: 'Cpu',
    recommendedTag: 'FUNDAMENTOS',
  },
  {
    levelNumber: 2,
    id: 'nivel-2',
    title: 'ENTENDER WINDOWS Y EL ARRANQUE',
    subtitle: 'Desde el pulso eléctrico de POWER hasta los anillos profundos de Windows.',
    objective: 'Comprender desde firmware, señales standby y secuencia POST de arranque hasta el funcionamiento interno del kernel de Windows.',
    tomos: ['02', '08'],
    accentColor: '#10B981',
    iconName: 'Power',
    recommendedTag: 'SECUENCIA & SISTEMA',
  },
  {
    levelNumber: 3,
    id: 'nivel-3',
    title: 'DIAGNÓSTICO Y REPARACIÓN',
    subtitle: 'Metodología pericial deductiva para computadoras de escritorio y portátiles.',
    objective: 'Transformar conocimiento teórico en metodología comprobable de diagnóstico físico, descarte y reparación de banco.',
    tomos: ['03', '04', '11'],
    accentColor: '#F59E0B',
    iconName: 'Wrench',
    recommendedTag: 'TALLER & BANCO',
  },
  {
    levelNumber: 4,
    id: 'nivel-4',
    title: 'REDES Y SEGURIDAD',
    subtitle: 'Comunicaciones de datos, análisis de paquetes, tráfico IP y ciberseguridad defensiva.',
    objective: 'Comprender cómo viajan los paquetes en red local e Internet, protocolos TCP/UDP y contramedidas de mitigación en sistemas.',
    tomos: ['05', '06'],
    accentColor: '#06B6D4',
    iconName: 'ShieldCheck',
    recommendedTag: 'INFRAESTRUCTURA',
  },
  {
    levelNumber: 5,
    id: 'nivel-5',
    title: 'RENDIMIENTO Y GAMING',
    subtitle: 'Metrología científica de frametimes, percentiles 1% low y latencias de sistema.',
    objective: 'Medir, comparar y optimizar el rendimiento de la PC con evidencia experimental objetiva sin placebos.',
    tomos: ['07'],
    accentColor: '#EC4899',
    iconName: 'Gauge',
    recommendedTag: 'METROLOGÍA PRO',
  },
  {
    levelNumber: 6,
    id: 'nivel-6',
    title: 'SISTEMAS, KERNEL Y FORENSE',
    subtitle: 'Gobernanza del kernel monolítico, ingeniería inversa y análisis de evidencia digital.',
    objective: 'Comprender las capas más profundas del sistema operativo y reconstruir incidentes técnicos a partir de evidencias periciales.',
    tomos: ['09', '10', '12'],
    accentColor: '#A855F7',
    iconName: 'Binary',
    recommendedTag: 'ESPECIALIZACIÓN FORENSE',
  },
];

// =========================================================================
// 2. FICHAS PEDAGÓGICAS DE LOS 10 TOMOS
// =========================================================================
export const EVO_TOMES_PEDAGOGY: Record<string, EvoTomePedagogicalProfile> = {
  '01': {
    tomoId: 'tomo-01',
    tomoNumber: '01',
    title: 'EVO LABS // CONOCÉ TU PC',
    levelNumber: 1,
    levelName: 'NIVEL 1: CONOCER LA PC',
    tagline: 'Entendé tu máquina desde adentro.',
    whatYouWillLearn: [
      'Identificar la topología exacta de los componentes de tu equipo.',
      'Comprender el diálogo e intercambio de datos entre CPU, memoria RAM, GPU y bus PCIe.',
      'Analizar las latencias reales frente a las velocidades teóricas de catálogo.',
      'Detectar cuellos de botella térmicos y de saturación de bus.',
    ],
    whyItMatters:
      'Ninguna reparación ni optimización seria puede hacerse sin saber con exactitud qué máquina tenés frente a vos y cómo dialogan sus componentes.',
    recommendedPrerequisites: [
      'Nivel 0: Metodología EVO LABS completada o leída.',
      'Conceptos elementales de hardware (fuente, placa madre, memoria).',
    ],
    associatedMagazine: 'Tomo 01 // Revista Técnica A4 (Capítulos 01 al 07)',
    associatedLabTitle: 'Laboratorio de Silicio y Peritaje de Hardware',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Capacidad de auditar cualquier PC real, generar su pasaporte de hardware y diagnosticar desacoples de rendimiento entre procesador y memoria.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Reconocer qué hace cada componente antes de abrir una sola herramienta.' },
      { stage: 'LEER', description: 'Estudiar los 7 capítulos editoriales del Tomo 01 con diagramas de silicio.' },
      { stage: 'PREPARARSE', description: 'Configurar herramientas de auditoría pericial y pasaporte de hardware.' },
      { stage: 'PRACTICAR', description: 'Mapear transferencias de buses y monitorear telemetría de reloj en vivo.' },
      { stage: 'DIAGNOSTICAR', description: 'Localizar el componente que satura primero bajo carga real.' },
      { stage: 'COMPROBAR', description: 'Verificar la mejora mediante prueba controlada A/B sin sesgo comercial.' },
    ],
  },
  '02': {
    tomoId: 'tomo-02',
    tomoNumber: '02',
    title: 'EVO LABS // LA BIBLIA NEGRA DE WINDOWS',
    levelNumber: 2,
    levelName: 'NIVEL 2: ENTENDER WINDOWS Y EL ARRANQUE',
    tagline: 'El lado oculto de Windows. Descubrilo.',
    whatYouWillLearn: [
      'Arquitectura de Ring 0 vs Ring 3 y despacho de rutinas DPC e ISR.',
      'Gestión de memoria virtual, working set, paged pool y standby list.',
      'Afinamiento del temporizador del sistema (timer resolution a 0.5ms).',
      'Auditoría forense del Registro de Windows y depuración de subprocesos.',
    ],
    whyItMatters:
      'Windows gobierna directamente el hardware. Si no entendés el kernel ni el scheduler de subprocesos, cualquier ajuste es puramente placebo.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC (Comprensión de CPU, RAM y buses).',
    ],
    associatedMagazine: 'Tomo 02 // Edición Maestra de Kernel NT 2026',
    associatedLabTitle: 'Laboratorio de Windows NT y Scheduler Híbrido',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Control total de los procesos en segundo plano, eliminación de micro-tirones por DPC latency y configuración de Windows basada en telemetría de kernel.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Comprender cómo el kernel NT administra memoria física y despacho de hilos.' },
      { stage: 'LEER', description: 'Revisar la guía profunda de subprocesos, servicios y Registro de Windows.' },
      { stage: 'PREPARARSE', description: 'Abrir herramientas de medición de latencia y monitores de DPC.' },
      { stage: 'PRACTICAR', description: 'Aislar drivers lentos y medir la respuesta del scheduler en nanosegundos.' },
      { stage: 'DIAGNOSTICAR', description: 'Descubrir qué servicio o controlador genera picos de latencia de kernel.' },
      { stage: 'COMPROBAR', description: 'Medir la reducción comprobable de latencia con telemetría objetiva.' },
    ],
  },
  '03': {
    tomoId: 'tomo-03',
    tomoNumber: '03',
    title: 'REPARACIÓN DE PC // SISTEMA EVO LABS',
    levelNumber: 3,
    levelName: 'NIVEL 3: DIAGNÓSTICO Y REPARACIÓN',
    tagline: 'Nunca estuviste mejor guiado.',
    whatYouWillLearn: [
      'Método pericial deductivo para separar síntoma de causa raíz.',
      'Uso del multímetro digital para medir rieles de 12V, 5V, 3.3V y standby de fuentes ATX.',
      'Decodificación de códigos beep del buzzer BIOS y códigos POST hexadecimales.',
      'Resolución de bucles de reinicio (bootloops), pantallas negras y problemas de VRM.',
    ],
    whyItMatters:
      'Reemplazar piezas al azar cuesta dinero y tiempo. Un técnico profesional formula hipótesis y comprueba con mediciones antes de cambiar nada.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC.',
      'Tomo 08: Sistema de Arranque y Diagnóstico.',
    ],
    associatedMagazine: 'Tomo 03 // Edición de Taller y Protocolos de Banco 2026',
    associatedLabTitle: 'Banco de Reparación de PC y Multímetro ATX',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Habilidad para diagnosticar cualquier fallo de hardware en computadoras de escritorio siguiendo un árbol de decisiones con multímetro y descarte metódico.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Estudiar las leyes eléctricas básicas de alimentación de la placa madre.' },
      { stage: 'LEER', description: 'Aprender los protocolos de descarte y el mapa de fallas frecuentes.' },
      { stage: 'PREPARARSE', description: 'Alistar multímetro, tester digital y banco de prueba aislado.' },
      { stage: 'PRACTICAR', description: 'Medir voltajes en rieles ATX y analizar secuencias de POST.' },
      { stage: 'DIAGNOSTICAR', description: 'Aislar el componente defectuoso descartando falsos positivos.' },
      { stage: 'COMPROBAR', description: 'Encender y realizar prueba de estrés para validar la estabilidad final.' },
    ],
  },
  '04': {
    tomoId: 'tomo-04',
    tomoNumber: '04',
    title: 'REPARACIÓN DE NOTEBOOKS // SISTEMA EVO LABS',
    levelNumber: 3,
    levelName: 'NIVEL 3: DIAGNÓSTICO Y REPARACIÓN',
    tagline: 'Diagnóstico real, paso a paso.',
    whatYouWillLearn: [
      'Desmontaje metódico sin dañar carcasas, trabas ni flex de pantalla.',
      'Línea de entrada DC Jack, mosfets conmutadores y cargadores con sensor de aguja.',
      'Diagnóstico de baterías Li-Po/Li-Ion hinchadas o con celdas desbalanceadas.',
      'Detección de fallas en bus eDP (pantalla), backlight e inversores.',
    ],
    whyItMatters:
      'Las portátiles integran todo en una sola placa con tolerancias térmicas mínimas; un error de manipulación puede inutilizar el equipo completo.',
    recommendedPrerequisites: [
      'Tomo 03: Reparación de PC (Metodología de diagnóstico deductivo).',
    ],
    associatedMagazine: 'Tomo 04 // Edición Micromecánica y Portátiles 2026',
    associatedLabTitle: 'Banco de Micromecánica Portátil y Diagnóstico eDP',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Capacidad para desarmar, diagnosticar líneas de alimentación portátiles y resolver problemas térmicos y de pantalla en laptops modernas.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Comprender la arquitectura compacta y la gestión de energía en portátiles.' },
      { stage: 'LEER', description: 'Estudiar los pasos seguros de desmontaje y precauciones electrostáticas.' },
      { stage: 'PREPARARSE', description: 'Organizar herramientas antiestáticas, espátulas plásticas y multímetro.' },
      { stage: 'PRACTICAR', description: 'Revisar continuidad en conector DC Jack y rieles de carga de batería.' },
      { stage: 'DIAGNOSTICAR', description: 'Determinar si la falla es de panel, cable flex o etapa de alimentación.' },
      { stage: 'COMPROBAR', description: 'Armar y verificar ciclos térmicos completos en prueba de carga.' },
    ],
  },
  '05': {
    tomoId: 'tomo-05',
    tomoNumber: '05',
    title: 'SISTEMA EVO LABS DE REDES',
    levelNumber: 4,
    levelName: 'NIVEL 4: REDES Y SEGURIDAD',
    tagline: 'Entendé cómo se comunica tu PC, cómo viaja Internet y descubrí secretos PRO.',
    whatYouWillLearn: [
      'El modelo OSI y la pila TCP/IP explicados con tráfico real.',
      'Diferencias críticas de latencia y jitter entre Ethernet cableado y Wi-Fi.',
      'Resolución DNS, handshake de 3 vías TCP y encapsulación de tramas.',
      'Captura e inspección pericial de paquetes con Wireshark.',
    ],
    whyItMatters:
      'Una PC aislada no existe en la actualidad; entender cómo viaja cada paquete es indispensable para resolver problemas de conexión, lag y seguridad.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC (Hardware de red y buses).',
    ],
    associatedMagazine: 'Tomo 05 // Edición Redes & Análisis de Paquetes 2026',
    associatedLabTitle: 'Laboratorio Forense de Redes y Captura de Paquetes',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Capacidad de diagnosticar pérdidas de paquetes, cuellos de botella de red, fallos de DNS y optimizar la conexión para mínima latencia.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Asimilar cómo viajan los datos divididos en paquetes a través de la red.' },
      { stage: 'LEER', description: 'Analizar las capas de transporte y direccionamiento de Internet.' },
      { stage: 'PREPARARSE', description: 'Disponer de analizadores de paquetes y terminal de comandos de red.' },
      { stage: 'PRACTICAR', description: 'Capturar el tráfico durante una solicitud HTTP/DNS en vivo.' },
      { stage: 'DIAGNOSTICAR', description: 'Identificar si una pérdida de datos proviene del router, cable o ISP.' },
      { stage: 'COMPROBAR', description: 'Medir el impacto de un cambio de MTU o ruta con ping y traceroute.' },
    ],
  },
  '06': {
    tomoId: 'tomo-06',
    tomoNumber: '06',
    title: 'CIBERSEGURIDAD // SISTEMA EVO LABS',
    levelNumber: 4,
    levelName: 'NIVEL 4: REDES Y SEGURIDAD',
    tagline: 'Desde cero hasta dominar tu red.',
    whatYouWillLearn: [
      'Mapeo de superficie de ataque y puertos expuestos.',
      'Mecanismos de persistencia de malware (claves Run, servicios, tareas programadas).',
      'Técnicas de defensa en profundidad y segmentación de red.',
      'Auditoría y análisis dinámico de procesos sospechosos en entorno controlado.',
    ],
    whyItMatters:
      'La seguridad no se compra con un antivirus; es una postura metodológica de auditoría continua sobre lo que corre y se comunica en tu máquina.',
    recommendedPrerequisites: [
      'Tomo 02: La Biblia Negra de Windows.',
      'Tomo 05: Sistema de Redes.',
    ],
    associatedMagazine: 'Tomo 06 // Edición Ciberseguridad & Defensa en Profundidad 2026',
    associatedLabTitle: 'Laboratorio de Superficie de Ataque y Defensa',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Capacidad para auditar la seguridad de un equipo, descubrir canales de comunicación encubiertos y aislar amenazas sin formatear innecesariamente.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Comprender los vectores de ataque más comunes y la anatomía de una brecha.' },
      { stage: 'LEER', description: 'Estudiar las técnicas de persistencia y evasión de análisis.' },
      { stage: 'PREPARARSE', description: 'Aislar un entorno sandbox seguro para pruebas de comportamiento.' },
      { stage: 'PRACTICAR', description: 'Escanear puertos locales y auditar conexiones salientes activas.' },
      { stage: 'DIAGNOSTICAR', description: 'Identificar el vector de entrada y el punto de anclaje de la amenaza.' },
      { stage: 'COMPROBAR', description: 'Validar la erradicación y verificar que no queden puertas traseras.' },
    ],
  },
  '07': {
    tomoId: 'tomo-07',
    tomoNumber: '07',
    title: 'SISTEMA EVO LABS // GAMING PRO',
    levelNumber: 5,
    levelName: 'NIVEL 5: RENDIMIENTO Y GAMING',
    tagline: 'Optimizamos de verdad. Sin secretos.',
    whatYouWillLearn: [
      'La falacia del promedio de FPS frente a la distribución de frametimes.',
      'Cálculo e interpretación de percentiles 1% low y 0.1% low.',
      'Técnicas de sincronización (G-Sync, FreeSync, V-Sync) e input lag.',
      'Frame pacing, shaders compilation stutter y estabilidad bajo estrés térmico prolongado.',
    ],
    whyItMatters:
      'Un juego con 140 FPS de promedio puede sentirse entrecortado e injugable si la entrega de cuadros es irregular. La fluidez real se mide en frametime.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC (GPU, CPU y memoria).',
      'Tomo 02: La Biblia Negra de Windows (Latencias DPC).',
    ],
    associatedMagazine: 'Tomo 07 // Edición Gaming Pro & Metrología Competitiva 2026',
    associatedLabTitle: 'Banco Metrológico de Gaming, Frametimes y Latencias',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Dominio de la telemetría metrológica para lograr frametimes planos y consistentes, eliminando el stuttering sin caer en optimizaciones placebo.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Comprender por qué la consistencia de milisegundos supera al promedio de FPS.' },
      { stage: 'LEER', description: 'Revisar la guía de frame pacing, límites de GPU y cuello de botella de CPU.' },
      { stage: 'PREPARARSE', description: 'Instalar capturadores de frametimes de microsegundo a microsegundo.' },
      { stage: 'PRACTICAR', description: 'Registrar partidas completas y exportar curvas de percentiles.' },
      { stage: 'DIAGNOSTICAR', description: 'Aislar si un tirón proviene de carga de texturas, shaders o kernel.' },
      { stage: 'COMPROBAR', description: 'Comparar el antes y el después con gráficos de dispersión milimétricos.' },
    ],
  },
  '08': {
    tomoId: 'tomo-08',
    tomoNumber: '08',
    title: 'SISTEMA EVO LABS DE ARRANQUE Y DIAGNÓSTICO',
    levelNumber: 2,
    levelName: 'NIVEL 2: ENTENDER WINDOWS Y EL ARRANQUE',
    tagline: 'Del botón POWER a Windows, paso a paso.',
    whatYouWillLearn: [
      'Los 35 estados cronológicos desde la alimentación de espera (standby) hasta el escritorio de Windows.',
      'Líneas de control: PS_ON#, PWR_OK, VRM Enable, CPU Reset y Clock Generator.',
      'Fase firmware: SEC, PEI, DXE, BDS y entrega de control al bootloader.',
      'Diagnóstico físico con multímetro, tester digital y buzzer ante cualquier punto de bloqueo.',
    ],
    whyItMatters:
      'Cuando una PC no enciende o se congela, saber en cuál de los 35 estados se interrumpió la señal permite dar un diagnóstico exacto en minutos sin adivinar.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC (Componentes y placa madre).',
      'Nivel 0: Metodología pedagógica EVO LABS.',
    ],
    associatedMagazine: 'Tomo 08 // Revista A4: Sistema de Arranque y Diagnóstico',
    associatedLabTitle: 'Laboratorio de Arranque y Fallas Guiado',
    associatedLabStatus: 'ACTIVO',
    associatedLabId: 'boot-lab',
    expectedOutcome:
      'Capacidad demostrada para seguir paso a paso cualquier PC que no arranca, identificar el estado exacto donde falla y comprobar la solución en el banco interactivo.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Comprender la secuencia de señales eléctricas previas al encendido del procesador.' },
      { stage: 'LEER', description: 'Estudiar los 35 estados explicados en la revista técnica A4 del Tomo 08.' },
      { stage: 'PREPARARSE', description: 'Configurar el banco interactivo con gabinete abierto, multímetro y osciloscopio.' },
      { stage: 'PRACTICAR', description: 'Navegar los 35 estados (00 al 34) en el Laboratorio de Arranque y Fallas Guiado.' },
      { stage: 'DIAGNOSTICAR', description: 'Resolver fallas simuladas y expedientes reales de PC misteriosa.' },
      { stage: 'COMPROBAR', description: 'Medir la señal recuperada y validar el booteo completo exitoso.' },
    ],
  },
  '09': {
    tomoId: 'tomo-09',
    tomoNumber: '09',
    title: 'EVO LABS // PROGRAMACIÓN DESDE CERO',
    levelNumber: 6,
    levelName: 'NIVEL 6: DESARROLLO, CÓDIGO E INTELIGENCIA ARTIFICIAL',
    tagline: 'Empezá sin saber programar. Creá tus primeras herramientas.',
    whatYouWillLearn: [
      'Fundamentos de lógica algorítmica, variables y estructuras de control.',
      'Desarrollo moderno con JavaScript, TypeScript y consumo de APIs.',
      'Scripting práctico en Python para automatización técnica.',
      'Flujo de trabajo colaborativo profesional con Git y GitHub.',
    ],
    whyItMatters:
      'Aprender a programar te da control total sobre tu PC: podés automatizar tareas, consultar telemetría por API y crear tus propias utilidades.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC.',
      'Tomo 02: La Biblia Negra de Windows.',
    ],
    associatedMagazine: 'Tomo 09 // Edición Programación desde Cero 2026',
    associatedLabTitle: 'Laboratorio de Algoritmos, APIs y Código',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Comprensión sólida de la programación moderna, capacidad de construir scripts y colaborar en repositorios de código.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Comprender cómo la CPU ejecuta instrucciones y flujos de lógica.' },
      { stage: 'LEER', description: 'Aprender la sintaxis moderna de TypeScript y Python paso a paso.' },
      { stage: 'PREPARARSE', description: 'Instalar entorno de ejecución Node.js, Python y configurar Git.' },
      { stage: 'PRACTICAR', description: 'Escribir algoritmos interactivos y consumir endpoints de prueba.' },
      { stage: 'DIAGNOSTICAR', description: 'Depurar errores de sintaxis y trazas de excepciones de código.' },
      { stage: 'COMPROBAR', description: 'Validar la salida esperada del programa con pruebas unitarias.' },
    ],
  },
  '10': {
    tomoId: 'tomo-10',
    tomoNumber: '10',
    title: 'EVO LABS // PROMPT E IA AVANZADA',
    levelNumber: 6,
    levelName: 'NIVEL 6: DESARROLLO, CÓDIGO E INTELIGENCIA ARTIFICIAL',
    tagline: 'Aprendé a dirigir la IA con rigor técnico, contexto y metodología.',
    whatYouWillLearn: [
      'Arquitectura de transformers, tokens y ventana de contexto en LLMs.',
      'Técnicas de prompting estructurado (CoT, Few-Shot, roles de sistema).',
      'Function calling, integración de herramientas y generación aumentada por recuperación (RAG).',
      'Diseño y supervisión de agentes autónomos con verificación empírica.',
    ],
    whyItMatters:
      'No se trata de pedirle cosas mágicas a la IA, sino de dirigir modelos con precisión de ingeniería, validando cada resultado con rigor.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC.',
      'Tomo 09: Programación desde Cero.',
    ],
    associatedMagazine: 'Tomo 10 // Edición Prompt e IA Avanzada 2026',
    associatedLabTitle: 'Laboratorio de Ingeniería de Prompts y Agentes',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Capacidad para orquestar modelos de lenguaje, crear flujos con tool calling y auditar la fiabilidad de agentes inteligentes.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Asimilar cómo calculan probabilidades los modelos de lenguaje sobre tokens.' },
      { stage: 'LEER', description: 'Estudiar patrones de prompting sistemático y arquitectura de agentes.' },
      { stage: 'PREPARARSE', description: 'Configurar parámetros de inferencia y esquemas estructurados de salida.' },
      { stage: 'PRACTICAR', description: 'Diseñar prompts con delimitadores claros y razonamiento guiado.' },
      { stage: 'DIAGNOSTICAR', description: 'Identificar alucinaciones, derivas de contexto y sesgos de respuesta.' },
      { stage: 'COMPROBAR', description: 'Comprobar empíricamente las respuestas frente a fuentes de verdad verificables.' },
    ],
  },
  '11': {
    tomoId: 'tomo-11',
    tomoNumber: '11',
    title: 'EVO LABS // ELECTRÓNICA APLICADA A LA INFORMÁTICA',
    levelNumber: 3,
    levelName: 'NIVEL 3: DIAGNÓSTICO Y REPARACIÓN',
    tagline: 'Desde la física del electrón hasta el diagnóstico a nivel componente.',
    whatYouWillLearn: [
      'Leyes de Ohm y Kirchhoff aplicadas a rieles de alimentación de 180A.',
      'Física de semiconductores, diodos Schottky y transistores MOSFET de potencia.',
      'Controladores PWM, convertidores Buck DC-DC y filtrado de rizado en VRM.',
      'Metrología de banco con multímetro en escala de diodo y osciloscopio digital.',
    ],
    whyItMatters:
      'Sin comprender cómo viajan los electrones por el cobre ni cómo conmuta un MOSFET, el diagnóstico de placas madre es pura conjetura.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC.',
      'Tomo 03: Reparación de PC.',
    ],
    associatedMagazine: 'Tomo 11 // Edición Microelectrónica & VRMs 2026',
    associatedLabTitle: 'Electronics Lab Hub & Mediciones VRM',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Capacidad para auditar rieles de tensión en motherboard y GPU, medir caídas en diodo y aislar cortocircuitos de banco.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Comprender la física de la corriente y la caída de potencial en conductores.' },
      { stage: 'LEER', description: 'Estudiar la topología de convertidores reductores Buck y control PWM.' },
      { stage: 'PREPARARSE', description: 'Alistar multímetro con puntas de aguja finas y fuente de alimentación regulada.' },
      { stage: 'PRACTICAR', description: 'Medir resistencia a masa de rieles principales y comparar con tolerancias.' },
      { stage: 'DIAGNOSTICAR', description: 'Localizar componentes en fuga o conmutaciones anómalas en fases VRM.' },
      { stage: 'COMPROBAR', description: 'Verificar la estabilización de voltaje bajo osciloscopio en carga.' },
    ],
  },
  '12': {
    tomoId: 'tomo-12',
    tomoNumber: '12',
    title: 'EVO LABS // INGENIERÍA Y CREACIÓN DE VIDEOJUEGOS',
    levelNumber: 6,
    levelName: 'NIVEL 6: DESARROLLO, CÓDIGO E INTELIGENCIA ARTIFICIAL',
    tagline: 'EVO Game Forge: De las matemáticas vectoriales al proyecto Mundo Max.',
    whatYouWillLearn: [
      'Arquitectura de game loop desacoplado con timestep fijo para física y variable para render.',
      'Álgebra lineal, matrices de proyección y vectores para transformaciones espaciales.',
      'Detección de colisiones mediante teorema de separación de ejes (SAT).',
      'Shaders GLSL, pipelines gráficos y desarrollo del motor para el proyecto Mundo Max.',
    ],
    whyItMatters:
      'Un videojuego exige el máximo rigor de sincronía de hardware y software; dominar el motor lúdico capacita para cualquier software de alta exigencia.',
    recommendedPrerequisites: [
      'Tomo 01: Conocé tu PC (GPU y buses).',
      'Tomo 09: Programación desde Cero.',
    ],
    associatedMagazine: 'Tomo 12 // Edición EVO Game Forge & Mundo Max 2026',
    associatedLabTitle: 'EVO Game Forge Studio & Simulación Física',
    associatedLabStatus: 'ACTIVO',
    expectedOutcome:
      'Capacidad para construir motores lúdicos interactivos, simular físicas deterministas y programar shaders optimizados.',
    methodSteps: [
      { stage: 'ENTENDER', description: 'Comprender la diferencia entre tiempo de simulación física y tasa de refresco.' },
      { stage: 'LEER', description: 'Revisar la arquitectura del game loop determinista y matrices de proyección.' },
      { stage: 'PREPARARSE', description: 'Disponer del canvas gráfico WebGL y perfiles de framerate.' },
      { stage: 'PRACTICAR', description: 'Implementar cálculo vectorial de aceleración, colisión y rebotes.' },
      { stage: 'DIAGNOSTICAR', description: 'Depurar desincronizaciones de delta time y cuellos de botella de draw calls.' },
      { stage: 'COMPROBAR', description: 'Validar la fluidez a 60 FPS estables con telemetría de frametimes planos.' },
    ],
  },
};

// =========================================================================
// 3. GUÍAS PEDAGÓGICAS UNIVERSALES ANTES DE CADA LABORATORIO
// =========================================================================
export const EVO_LAB_GUIDES: Record<string, EvoLabPedagogicalGuide> = {
  'tech-boot': {
    id: 'tech-boot',
    name: 'LABORATORIO DE ARRANQUE Y FALLAS GUIADO',
    category: 'guiado',
    relatedTomoId: 'tomo-08',
    relatedTomoTitle: 'Tomo 08: Sistema EVO LABS de Arranque y Diagnóstico',
    whatIsThisLab:
      'Es un banco interactivo que simula una computadora abierta con gabinete transparente, multímetro de banco, tester digital, buzzer BIOS y osciloscopio en tiempo real.',
    whatYouWillPractice:
      'El recorrido cronológico de los 35 estados de arranque (desde la alimentación standby hasta el escritorio de Windows) y el diagnóstico de 15 fallas electrónicas y de software simuladas.',
    whatToKnowBefore:
      'Conceptos básicos de señales de hardware: Standby (5VSB), PS_ON#, PWR_OK, POST de BIOS, inicialización de memoria y carga del bootloader de Windows.',
    howToUse:
      'Seleccioná uno de los 4 modos: APRENDER (para avanzar estado por estado con explicaciones técnicas), FALLA SIMULADA (para diagnosticar fallas inducidas), CASO EVO o PC MISTERIOSA. Usá el multímetro y las sondas para medir tensiones.',
    whatToObserve:
      'Los leds de diagnóstico de la placa madre, las tensiones numéricas en voltios de cada pin y el punto exacto donde la secuencia se congela.',
    whatToProve:
      'Comprobar empíricamente que una falla no se resuelve cambiando piezas al azar, sino encontrando la primera señal que no cumple con su especificación de fábrica.',
    whatToDoWhenFinished:
      'Generá tu dictamen técnico en el expediente pericial y pasá a practicar en el Taller de Casos o leé el Tomo 08 para consolidar los 35 estados.',
    whenToUse:
      'Siempre que estudies el Tomo 08, recibas una PC que no enciende, o quieras dominar la secuencia de booteo completa.',
    whatOutputDelivers:
      'Historial de mediciones de voltaje, registro de estado de POST y dictamen de diagnóstico pericial verificado.',
    actionKey: 'boot-lab',
    status: 'ACTIVO',
    accentColor: '#10B981',
  },
  'tech-hardware': {
    id: 'tech-hardware',
    name: 'LABORATORIO DE HARDWARE (BANCO HOT-SWAP)',
    category: 'tecnico',
    relatedTomoId: 'tomo-01',
    relatedTomoTitle: 'Tomo 01: Conocé tu PC',
    whatIsThisLab:
      'Una herramienta transversal de análisis de hardware que permite intercambiar componentes (CPU, GPU, RAM, almacenamiento) en tiempo real y observar la compatibilidad y comportamiento físico resultante.',
    whatYouWillPractice:
      'Compatibilidad de zócalos (sockets), cálculo de requerimientos de potencia de fuente, carriles PCIe y temperaturas bajo distintas cargas.',
    whatToKnowBefore:
      'Especificaciones de buses (PCIe 3.0 vs 4.0 vs 5.0), estándares DDR4/DDR5 y consumos TDP en watts.',
    howToUse:
      'Accedé al banco Hot-Swap, seleccioná un componente en el panel lateral, arrastralo al zócalo de la placa madre y observá el panel de telemetría y alertas de incompatibilidad.',
    whatToObserve:
      'Las variaciones en las curvas de potencia, líneas PCIe saturadas y compatibilidad de perfiles de memoria.',
    whatToProve:
      'Comprobar antes de gastar dinero si una actualización de hardware generará un cuello de botella con el resto de tu plataforma.',
    whatToDoWhenFinished:
      'Guardá la configuración evaluada en tu libreta pericial y compará con las recomendaciones del Tomo 01.',
    whenToUse:
      'Al planificar un upgrade, evaluar componentes de clientes o comparar plataformas AMD vs Intel.',
    whatOutputDelivers:
      'Reporte de compatibilidad física, balanceo de potencia y mapa de líneas de bus de la placa.',
    actionKey: 'hardware',
    status: 'DISPONIBLE',
    accentColor: '#F59E0B',
  },
  'tech-silicon': {
    id: 'tech-silicon',
    name: 'LABORATORIO DE SILICIO',
    category: 'tecnico',
    relatedTomoId: 'tomo-01',
    relatedTomoTitle: 'Tomo 01: Conocé tu PC',
    whatIsThisLab:
      'Simulador interactivo de la arquitectura microscópica interna del CPU, caches L1/L2/L3, controlador de memoria integrado (IMC) e interconexiones de silicio.',
    whatYouWillPractice:
      'Observar la circulación de bytes a través de los buses internos, latencias de acceso a memoria y comportamiento de la memoria caché.',
    whatToKnowBefore:
      'Conceptos de frecuencia (GHz), nanosegundos (ns), ancho de banda (GB/s) y jerarquía de memoria.',
    howToUse:
      'Elegí un patrón de carga de trabajo (secuencial, aleatorio, multihilo) y mirá cómo viajan las transferencias en el mapa interactivo del chip.',
    whatToObserve:
      'La diferencia abismal de latencia entre un acierto en caché L1 (menos de 1ns) y un fallo que debe ir hasta la memoria RAM física (60–80ns).',
    whatToProve:
      'Comprobar por qué el tamaño y velocidad de la caché impacta más en la fluidez de muchas aplicaciones que los meros núcleos de catálogo.',
    whatToDoWhenFinished:
      'Revisá los capítulos 01 y 02 del Tomo 01 para consolidar la teoría de buses de silicio.',
    whenToUse:
      'Para comprender cuellos de botella de memoria, rendimiento en juegos y arquitectura de procesadores modernos.',
    whatOutputDelivers:
      'Gráficas de flujo de datos, latencias por nivel de caché y tasa de aciertos/fallos (cache hits/misses).',
    actionKey: 'silicon',
    status: 'DISPONIBLE',
    accentColor: '#EAB308',
  },
  'tech-metrology': {
    id: 'tech-metrology',
    name: 'LABORATORIO DE METROLOGÍA',
    category: 'tecnico',
    relatedTomoId: 'tomo-07',
    relatedTomoTitle: 'Tomo 07: Gaming Pro & Metrología',
    whatIsThisLab:
      'Suite de instrumentación para medir latencias, frametimes y percentiles con precisión de microsegundos, eliminando impresiones subjetivas.',
    whatYouWillPractice:
      'Captura y análisis de curvas de frametime, histogramas de distribución estadística y cálculo de percentiles 1% low y 0.1% low.',
    whatToKnowBefore:
      'Diferencia matemática entre el promedio aritmético de FPS y la consistencia en milisegundos de cada cuadro renderizado.',
    howToUse:
      'Cargá un perfil de prueba o ejecutá una simulación de carga continua; observá el trazado del gráfico y los picos de stuttering.',
    whatToObserve:
      'Picos verticales en el gráfico de frametime que indican cuadros demorados y pérdida de fluidez imperceptible en el contador de FPS promedio.',
    whatToProve:
      'Comprobar objetivamente si un cambio de configuración mejoró la suavidad del juego o sólo aumentó un número promedio sin valor práctico.',
    whatToDoWhenFinished:
      'Exportá las curvas de percentiles y registralas en tu Expediente Académico.',
    whenToUse:
      'Para evaluar optimizaciones, auditar micro-tirones o comparar configuraciones de memoria y controladores gráficos.',
    whatOutputDelivers:
      'Tabla de percentiles (Avg, 1% Low, 0.1% Low), varianza de frametime y gráfico de consistencia temporal.',
    actionKey: 'metrology',
    status: 'DISPONIBLE',
    accentColor: '#EC4899',
  },
  'tech-software-kernel': {
    id: 'tech-software-kernel',
    name: 'LABORATORIO DE SOFTWARE Y KERNEL',
    category: 'tecnico',
    relatedTomoId: 'tomo-02',
    relatedTomoTitle: 'Tomo 02: La Biblia Negra de Windows',
    whatIsThisLab:
      'Entorno de auditoría profunda que visualiza la interacción entre controladores de dispositivos (drivers), rutinas de interrupción (ISR), llamadas a procedimiento diferido (DPC) y el scheduler de Windows.',
    whatYouWillPractice:
      'Aislar controladores que bloquean núcleos de CPU, analizar la respuesta del scheduler híbrido y medir latencias del sistema operativo.',
    whatToKnowBefore:
      'Anillos de protección de la CPU (Ring 0 vs Ring 3) e interrupciones de hardware (IRQ).',
    howToUse:
      'Seleccioná un perfil de estrés de controladores y observá qué módulo genera mayor tiempo de ejecución acumulado en el panel DPC.',
    whatToObserve:
      'Controladores como storport.sys, ndis.sys o drivers gráficos que exceden el límite de 1000 microsegundos.',
    whatToProve:
      'Demostrar que los problemas de audio entrecortado o stuttering en juegos suelen deberse a drivers mal optimizados y no a falta de potencia de hardware.',
    whatToDoWhenFinished:
      'Aplicá las técnicas de depuración descritas en el Tomo 02.',
    whenToUse:
      'Ante fallas de latencia de audio, tirones intermitentes o bloqueos transitorios en Windows.',
    whatOutputDelivers:
      'Histograma de latencia DPC/ISR por controlador e informe de estabilidad de Ring 0.',
    actionKey: 'software-kernel',
    status: 'DISPONIBLE',
    accentColor: '#38BDF8',
  },
  'tech-telemetry': {
    id: 'tech-telemetry',
    name: 'LABORATORIO DE TELEMETRÍA (HUD EN VIVO)',
    category: 'tecnico',
    relatedTomoId: 'tomo-01',
    relatedTomoTitle: 'Tomo 01: Conocé tu PC',
    whatIsThisLab:
      'Consola de instrumentación en tiempo real que recolecta voltajes, frecuencias de reloj, temperaturas de diodo y consumo eléctrico de los sensores de la máquina.',
    whatYouWillPractice:
      'Monitoreo pericial de sensores de hardware y correlación de temperatura vs estrangulamiento térmico (thermal throttling).',
    whatToKnowBefore:
      'Lectura de grados Celsius, Watts, Amperes y frecuencias de reloj de núcleos de silicio.',
    howToUse:
      'Activá la consola de telemetría y conmutá entre vistas de voltajes, frecuencias y mapa térmico del sistema.',
    whatToObserve:
      'Caídas abruptas de frecuencia de reloj cuando la temperatura de juntura (TjMax) alcanza el límite de protección del fabricante.',
    whatToProve:
      'Identificar con precisión matemática si una pérdida de rendimiento proviene de pasta térmica degradada o insuficiente disipación.',
    whatToDoWhenFinished:
      'Verificá los límites térmicos en el Capítulo 04 del Tomo 01.',
    whenToUse:
      'En auditorías preventivas, pruebas de estabilidad bajo estrés o calibración de curvas de ventilación.',
    whatOutputDelivers:
      'Panel HUD con telemetría en nanosegundos, picos máximos/mínimos y alertas de estrangulamiento térmico.',
    actionKey: 'telemetry',
    status: 'ACTIVO',
    accentColor: '#06B6D4',
  },
  'tech-windows-kernel': {
    id: 'tech-windows-kernel',
    name: 'LABORATORIO DE WINDOWS Y KERNEL (MATRIZ NT)',
    category: 'tecnico',
    relatedTomoId: 'tomo-02',
    relatedTomoTitle: 'Tomo 02: La Biblia Negra de Windows',
    whatIsThisLab:
      'Matriz comparativa e interactiva de versiones de Windows, arquitectura del planificador de tareas, mitigaciones de seguridad (VBS, HVCI) y temporizadores.',
    whatYouWillPractice:
      'Evaluar el impacto de funciones del kernel (Core Isolation, VBS, Timer Resolution a 0.5ms vs 15.6ms por defecto).',
    whatToKnowBefore:
      'Diferencias entre versiones de Windows y gobernanza del kernel NT.',
    howToUse:
      'Seleccioná una versión o escenario en la matriz y conmutá módulos de kernel para observar el impacto en latencias y consumo de recursos.',
    whatToObserve:
      'El costo medible en nanosegundos que introducen ciertas capas de seguridad virtualizada frente a la ganancia de aislamiento.',
    whatToProve:
      'Comprender las compensaciones (trade-offs) reales de ingeniería entre máxima seguridad corporativa y mínima latencia competitiva.',
    whatToDoWhenFinished:
      'Contrastá tus observaciones con la guía maestra del Tomo 02.',
    whenToUse:
      'Para configurar estaciones de trabajo especializadas (audio, gaming competitivo, servidores de baja latencia).',
    whatOutputDelivers:
      'Matriz comparativa de rendimiento de kernel, estado del timer del sistema y reporte de mitigaciones activas.',
    actionKey: 'windows-matrix',
    status: 'DISPONIBLE',
    accentColor: '#00D2FF',
  },
  'tech-operaciones': {
    id: 'tech-operaciones',
    name: 'LABORATORIO DE OPERACIONES EVO',
    category: 'operaciones',
    whatIsThisLab:
      'Espacio técnico integral que agrupa el Esquemático PCB interactivo, los 8 Sectores de Taller pericial, la Consola EVO y las Workstations de especialidad.',
    whatYouWillPractice:
      'Exploración libre de las herramientas técnicas de EVO LABS fuera de una clase o recorrido específico.',
    whatToKnowBefore:
      'Conocimiento general de los diferentes sectores del taller y uso de la consola técnica.',
    howToUse:
      'Navegá entre el Esquemático PCB, seleccioná cualquiera de los 8 sectores o conmutá overlays (térmico, señales, energía).',
    whatToObserve:
      'La integración transversal de todos los sistemas de diagnóstico del campus en un solo plano interactivo.',
    whatToProve:
      'Demostrar la interconexión de todas las herramientas de la plataforma.',
    whatToDoWhenFinished:
      'Volvé a la ruta de tu Nivel o elegí un caso en el Taller de Expedientes.',
    whenToUse:
      'Para investigación libre, consultas puntuales de diagramas o exploración técnica autónoma.',
    whatOutputDelivers:
      'Inspección detallada de componentes, telemetría integrada y acceso directo a estaciones de trabajo.',
    actionKey: 'operaciones',
    status: 'DISPONIBLE',
    accentColor: '#A855F7',
  },
};

// =========================================================================
// 4. PASOS SIGUIENTES RECOMENDADOS TRAS FINALIZAR ACTIVIDADES
// =========================================================================
export interface EvoNextStepRecommendation {
  completedLabel: string;
  nextLabel: string;
  nextLevel: number;
  nextTomoId?: string;
  actionText: string;
}

export const EVO_NEXT_RECOMMENDATIONS: Record<string, EvoNextStepRecommendation> = {
  'nivel-0': {
    completedLabel: 'Nivel 0: Cómo usar EVO LABS',
    nextLabel: 'Nivel 1: Conocer la PC // Tomo 01: Conocé tu PC',
    nextLevel: 1,
    nextTomoId: '01',
    actionText: 'COMENZAR NIVEL 1',
  },
  'tomo-01': {
    completedLabel: 'Tomo 01 // Conocé tu PC',
    nextLabel: 'Nivel 2: Entender Windows y el Arranque // Tomo 08: Del Botón POWER a Windows',
    nextLevel: 2,
    nextTomoId: '08',
    actionText: 'CONTINUAR A NIVEL 2 (TOMO 08)',
  },
  'tomo-08': {
    completedLabel: 'Tomo 08 // Sistema de Arranque y Laboratorio Guiado',
    nextLabel: 'Nivel 2 // Tomo 02: La Biblia Negra de Windows',
    nextLevel: 2,
    nextTomoId: '02',
    actionText: 'CONTINUAR CON TOMO 02',
  },
  'tomo-02': {
    completedLabel: 'Tomo 02 // La Biblia Negra de Windows',
    nextLabel: 'Nivel 3: Diagnóstico y Reparación // Tomo 03: Reparación de PC',
    nextLevel: 3,
    nextTomoId: '03',
    actionText: 'AVANZAR A NIVEL 3 (REPARACIÓN)',
  },
  'tomo-03': {
    completedLabel: 'Tomo 03 // Reparación de PC',
    nextLabel: 'Nivel 3 // Tomo 04: Reparación de Notebooks',
    nextLevel: 3,
    nextTomoId: '04',
    actionText: 'CONTINUAR CON NOTEBOOKS',
  },
  'tomo-04': {
    completedLabel: 'Tomo 04 // Reparación de Notebooks',
    nextLabel: 'Nivel 4: Redes y Seguridad // Tomo 05: Sistema de Redes',
    nextLevel: 4,
    nextTomoId: '05',
    actionText: 'AVANZAR A NIVEL 4 (REDES)',
  },
  'tomo-05': {
    completedLabel: 'Tomo 05 // Sistema EVO LABS de Redes',
    nextLabel: 'Nivel 4 // Tomo 06: Ciberseguridad',
    nextLevel: 4,
    nextTomoId: '06',
    actionText: 'CONTINUAR CON CIBERSEGURIDAD',
  },
  'tomo-06': {
    completedLabel: 'Tomo 06 // Ciberseguridad',
    nextLabel: 'Nivel 5: Rendimiento y Gaming // Tomo 07: Gaming Pro',
    nextLevel: 5,
    nextTomoId: '07',
    actionText: 'AVANZAR A NIVEL 5 (GAMING PRO)',
  },
  'tomo-07': {
    completedLabel: 'Tomo 07 // Gaming Pro / Rendimiento',
    nextLabel: 'Nivel 6: Código, Desarrollo e IA // Tomo 09: Programación desde Cero',
    nextLevel: 6,
    nextTomoId: '09',
    actionText: 'AVANZAR A NIVEL 6 (PROGRAMACIÓN & IA)',
  },
  'tomo-09': {
    completedLabel: 'Tomo 09 // Programación desde Cero',
    nextLabel: 'Nivel 6 // Tomo 10: Prompt e IA Avanzada',
    nextLevel: 6,
    nextTomoId: '10',
    actionText: 'CONTINUAR CON TOMO 10 (PROMPT & IA)',
  },
  'tomo-10': {
    completedLabel: 'Tomo 10 // Prompt e IA Avanzada',
    nextLabel: 'Taller de Casos y Expedientes Periciales',
    nextLevel: 6,
    actionText: 'RESOLVER CASOS REALES',
  },
};

// =========================================================================
// 5. HERRAMIENTAS TÉCNICAS EVO ORGANIZADAS POR INTENCIÓN Y NOMBRE SIMPLE
// =========================================================================
export interface EvoToolCardDefinition {
  id: string;
  simpleName: string;
  intentCategory: 'windows' | 'hardware' | 'rendimiento' | 'diagnostico' | 'experimentos';
  whatItDoes: string;
  whenToUse: string;
  concepts: string[];
  actionKey: 'boot-lab' | 'hardware' | 'silicon' | 'metrology' | 'software-kernel' | 'telemetry' | 'windows-matrix' | 'operaciones' | 'consola' | 'core';
  tomoId?: '01' | '02' | '03' | '04' | '08';
  subParam?: string;
  accentColor: string;
  inputReq?: string;
  outputArtifact?: string;
}

export const EVO_TOOLS_BY_INTENT: EvoToolCardDefinition[] = [
  // --- WINDOWS ---
  {
    id: 'win-01',
    simpleName: 'QUÉ WINDOWS ME CONVIENE',
    intentCategory: 'windows',
    whatItDoes: 'Evalúa la edición y configuración de Windows NT ideal para tu hardware y tareas.',
    whenToUse: 'Antes de instalar Windows o al optimizar un sistema para trabajo/juegos.',
    concepts: ['Versiones NT', 'Kernel', 'Timer Resolution'],
    actionKey: 'windows-matrix',
    tomoId: '02',
    accentColor: '#38BDF8',
  },
  {
    id: 'win-02',
    simpleName: 'INSTALAR WINDOWS',
    intentCategory: 'windows',
    whatItDoes: 'Guía de preparación, configuración e instalación limpia de Windows.',
    whenToUse: 'Al armar una PC nueva o formatear desde cero sin software innecesario.',
    concepts: ['Boot ISO', 'Particiones GPT', 'Drivers Iniciales'],
    actionKey: 'windows-matrix',
    tomoId: '02',
    accentColor: '#00D2FF',
  },
  {
    id: 'win-03',
    simpleName: 'VER QUÉ INICIA CON WINDOWS',
    intentCategory: 'windows',
    whatItDoes: 'Audita programas, tareas programadas y servicios de arranque.',
    whenToUse: 'Cuando Windows tarda mucho en iniciar o mostrar el escritorio.',
    concepts: ['Autoruns', 'Startup Delay', 'Servicios'],
    actionKey: 'software-kernel',
    tomoId: '02',
    accentColor: '#06B6D4',
  },
  {
    id: 'win-04',
    simpleName: 'SERVICIOS DE WINDOWS',
    intentCategory: 'windows',
    whatItDoes: 'Detecta y gestiona servicios de fondo que consumen RAM y CPU.',
    whenToUse: 'Cuando el equipo consume excesivos recursos en reposo.',
    concepts: ['Servicios NT', 'Memoria Fondo', 'Handles'],
    actionKey: 'software-kernel',
    tomoId: '02',
    accentColor: '#38BDF8',
  },
  {
    id: 'win-05',
    simpleName: 'VER QUÉ CONSUME MI PC',
    intentCategory: 'windows',
    whatItDoes: 'Identifica qué proceso o programa satura el procesador o disco.',
    whenToUse: 'Cuando la PC se vuelve lenta de repente o un juego da tirones.',
    concepts: ['Uso de CPU', 'RAM Asignada', 'Disk I/O'],
    actionKey: 'software-kernel',
    tomoId: '02',
    accentColor: '#10B981',
  },
  {
    id: 'win-06',
    simpleName: 'CÓMO WINDOWS USA LA CPU',
    intentCategory: 'windows',
    whatItDoes: 'Muestra cómo el scheduler híbrido reparte tareas entre núcleos.',
    whenToUse: 'Para entender por qué un programa no usa la CPU completa.',
    concepts: ['Scheduler NT', 'P-Core / E-Core', 'Subprocesos'],
    actionKey: 'software-kernel',
    tomoId: '02',
    accentColor: '#F59E0B',
  },
  {
    id: 'win-07',
    simpleName: 'ENCONTRAR LATENCIAS DE WINDOWS',
    intentCategory: 'windows',
    whatItDoes: 'Audita llamadas a procedimiento diferido (DPC) e interrupciones (ISR).',
    whenToUse: 'Ante problemas de audio entrecortado o micro-tirones en juegos.',
    concepts: ['DPC Latency', 'ISR Drivers', 'Ring 0'],
    actionKey: 'software-kernel',
    tomoId: '02',
    accentColor: '#EC4899',
  },
  {
    id: 'win-08',
    simpleName: 'REPARAR WINDOWS',
    intentCategory: 'windows',
    whatItDoes: 'Comprueba la integridad de archivos del sistema e inicia diagnóstico.',
    whenToUse: 'Ante pantallas azules, archivos corruptos o errores del sistema.',
    concepts: ['SFC / DISM', 'BCD Boot', 'Integridad NT'],
    actionKey: 'windows-matrix',
    tomoId: '02',
    accentColor: '#A855F7',
  },

  // --- HARDWARE ---
  {
    id: 'hw-01',
    simpleName: 'CONOCÉ LOS COMPONENTES DE TU PC',
    intentCategory: 'hardware',
    whatItDoes: 'Identifica la topología exacta y pasaporte técnico de tu equipo.',
    whenToUse: 'Para saber qué hardware exacto tenés y cómo están conectados.',
    concepts: ['Pasaporte Hardware', 'Sockets', 'Buses PCIe'],
    actionKey: 'hardware',
    tomoId: '01',
    accentColor: '#EAB308',
  },
  {
    id: 'hw-02',
    simpleName: 'PROBAR COMPONENTES',
    intentCategory: 'hardware',
    whatItDoes: 'Intercambia piezas virtualmente en el banco Hot-Swap y mide potencia.',
    whenToUse: 'Al planificar un upgrade o armar una computadora nueva.',
    concepts: ['Zócalo Socket', 'Líneas PCIe', 'Consumo Watts'],
    actionKey: 'hardware',
    tomoId: '01',
    accentColor: '#F59E0B',
  },
  {
    id: 'hw-03',
    simpleName: 'CÓMO TRABAJA EL PROCESADOR',
    intentCategory: 'hardware',
    whatItDoes: 'Visualiza el flujo interno de bytes en cachés L1/L2/L3 e IMC del silicio.',
    whenToUse: 'Para entender la velocidad real del CPU y cuellos de botella.',
    concepts: ['Silicio CPU', 'Caché L1/L2/L3', 'IMC Latencia'],
    actionKey: 'silicon',
    tomoId: '01',
    accentColor: '#EAB308',
  },
  {
    id: 'hw-04',
    simpleName: 'REVISÁ TU MEMORIA RAM',
    intentCategory: 'hardware',
    whatItDoes: 'Audita frecuencias, perfiles XMP/EXPO, canales y latencias de RAM.',
    whenToUse: 'Cuando sufrís inestabilidades o querés verificar el Dual Channel.',
    concepts: ['Frecuencia MHz', 'Timings ns', 'Dual Channel'],
    actionKey: 'hardware',
    subParam: 'memory',
    tomoId: '01',
    accentColor: '#10B981',
  },
  {
    id: 'hw-05',
    simpleName: 'VER SENSORES EN TIEMPO REAL',
    intentCategory: 'hardware',
    whatItDoes: 'Monitorea voltajes, frecuencias y temperaturas de diodo en vivo.',
    whenToUse: 'Para auditar la salud térmica y eléctrica de la máquina.',
    concepts: ['Grados °C', 'Voltios V', 'Frecuencia GHz'],
    actionKey: 'telemetry',
    tomoId: '01',
    accentColor: '#06B6D4',
  },
  {
    id: 'hw-06',
    simpleName: 'EXPLORAR LA MOTHERBOARD',
    intentCategory: 'hardware',
    whatItDoes: 'Esquemático interactivo PCB con capas de energía, VRM y señales.',
    whenToUse: 'Para inspeccionar componentes y pistas físicas de la placa madre.',
    concepts: ['Fases VRM', 'Pistas PCB', 'Sectores Taller'],
    actionKey: 'operaciones',
    tomoId: '01',
    accentColor: '#A855F7',
  },

  // --- RENDIMIENTO ---
  {
    id: 'perf-01',
    simpleName: 'MEDIR FPS Y TIRONES',
    intentCategory: 'rendimiento',
    whatItDoes: 'Detecta la inestabilidad que el promedio de FPS suele ocultar.',
    whenToUse: 'Cuando un juego marca buenos FPS pero la imagen da micro-tirones.',
    concepts: ['Frametime', '1% Low', 'Consistencia'],
    actionKey: 'metrology',
    accentColor: '#EC4899',
  },
  {
    id: 'perf-02',
    simpleName: 'ENCONTRÁ EL CUELLO DE BOTELLA',
    intentCategory: 'rendimiento',
    whatItDoes: 'Determina qué componente limita el rendimiento máximo en tu carga.',
    whenToUse: 'Cuando la tarjeta de video no llega al 100% de uso en juegos.',
    concepts: ['Uso GPU %', 'Saturación CPU', 'Ancho de Banda'],
    actionKey: 'silicon',
    tomoId: '01',
    accentColor: '#F59E0B',
  },
  {
    id: 'perf-03',
    simpleName: 'REVISAR TEMPERATURAS',
    intentCategory: 'rendimiento',
    whatItDoes: 'Comprueba si la CPU o GPU bajan su velocidad por exceso de calor.',
    whenToUse: 'Si el equipo levanta mucha temperatura o los ventiladores se aceleran.',
    concepts: ['TjMax', 'Thermal Throttling', 'Grados °C'],
    actionKey: 'telemetry',
    tomoId: '01',
    accentColor: '#06B6D4',
  },
  {
    id: 'perf-04',
    simpleName: 'COMPARÁ ANTES Y DESPUÉS',
    intentCategory: 'rendimiento',
    whatItDoes: 'Laboratorio A/B para contrastar métricas antes y después de un cambio.',
    whenToUse: 'Para verificar con evidencia objetiva si un ajuste realmente sirvió.',
    concepts: ['Cámara A/B', 'Delta %', 'Prueba Controlada'],
    actionKey: 'hardware',
    subParam: 'sandbox',
    accentColor: '#38BDF8',
  },
  {
    id: 'perf-05',
    simpleName: 'PROBAR UNA OPTIMIZACIÓN',
    intentCategory: 'rendimiento',
    whatItDoes: 'Evalúa configuraciones de rendimiento sin riesgos de estabilidad.',
    whenToUse: 'Al aplicar modificaciones en Windows o controladores.',
    concepts: ['Ajuste Real', 'Respuesta ms', 'Fluidez'],
    actionKey: 'software-kernel',
    tomoId: '02',
    accentColor: '#10B981',
  },

  // --- DIAGNÓSTICO ---
  {
    id: 'diag-01',
    simpleName: 'CÓMO ARRANCA UNA PC',
    intentCategory: 'diagnostico',
    whatItDoes: 'Recorrido interactivo por los 35 estados cronológicos de encendido.',
    whenToUse: 'Para dominar la secuencia desde la fuente hasta el sistema operativo.',
    concepts: ['35 Estados', 'Secuencia POST', 'Señales Standby'],
    actionKey: 'boot-lab',
    tomoId: '08',
    accentColor: '#10B981',
  },
  {
    id: 'diag-02',
    simpleName: 'DIAGNOSTICAR UNA PC QUE NO INICIA',
    intentCategory: 'diagnostico',
    whatItDoes: 'Banco con multímetro y osciloscopio para hallar fallas de encendido.',
    whenToUse: 'Cuando una PC no enciende, no da video o se congela en el arranque.',
    concepts: ['Multímetro', 'Códigos POST', 'Falla Inducida'],
    actionKey: 'boot-lab',
    tomoId: '08',
    accentColor: '#10B981',
  },
  {
    id: 'diag-03',
    simpleName: 'ANALIZAR UN PANTALLAZO AZUL',
    intentCategory: 'diagnostico',
    whatItDoes: 'Decodifica el código de error y el controlador que produjo el colapso.',
    whenToUse: 'Cuando sufrís pantallazos azules recurrentes (BSOD).',
    concepts: ['Bugcheck', 'Dump File', 'Driver Caudante'],
    actionKey: 'consola',
    accentColor: '#38BDF8',
  },
  {
    id: 'diag-04',
    simpleName: 'ANALIZAR ERRORES',
    intentCategory: 'diagnostico',
    whatItDoes: 'Examina eventos de incidentes del sistema para aislar la causa raíz.',
    whenToUse: 'Cuando programas se cierran solos o hay comportamientos anómalos.',
    concepts: ['Event Log', 'Consola Incidentes', 'Causa Raíz'],
    actionKey: 'consola',
    accentColor: '#A855F7',
  },
  {
    id: 'diag-05',
    simpleName: 'RESOLVER CASOS DIFÍCILES',
    intentCategory: 'diagnostico',
    whatItDoes: 'Taller de expedientes periciales reales con evidencia y dictamen.',
    whenToUse: 'Para resolver fallas reales de clientes y documentar soluciones.',
    concepts: ['Expedientes', 'Evidencias', 'Dictamen Técnico'],
    actionKey: 'operaciones',
    accentColor: '#EC4899',
  },

  // --- EXPERIMENTOS ---
  {
    id: 'exp-01',
    simpleName: 'SIMULAR OTRO HARDWARE',
    intentCategory: 'experimentos',
    whatItDoes: 'Prueba virtualmente cómo rendiría tu sistema con otros componentes.',
    whenToUse: 'Para proyectar una compra sin tener el hardware físicamente.',
    concepts: ['Rig Virtual', 'Proyección', 'Perfiles CPU/GPU'],
    actionKey: 'hardware',
    accentColor: '#F59E0B',
  },
  {
    id: 'exp-02',
    simpleName: 'DIGITAL TWIN (GEMELO DIGITAL)',
    intentCategory: 'experimentos',
    whatItDoes: 'Recrea la topología exacta de tu equipo en un entorno virtualizado.',
    whenToUse: 'Para experimentar con la arquitectura sin alterar tu PC real.',
    concepts: ['Gemelo Digital', 'Mapeo Topológico', 'Simulación'],
    actionKey: 'core',
    accentColor: '#00D2FF',
  },
  {
    id: 'exp-03',
    simpleName: 'ELEGIR UN BANCO DE TRABAJO',
    intentCategory: 'experimentos',
    whatItDoes: 'Accede a los 8 sectores especializados de taller e instrumentos.',
    whenToUse: 'Para investigación libre y uso de herramientas de laboratorio.',
    concepts: ['8 Sectores', 'Consola EVO', 'Taller'],
    actionKey: 'operaciones',
    accentColor: '#A855F7',
  },
  {
    id: 'exp-04',
    simpleName: 'REVISAR HARDWARE A FONDO',
    intentCategory: 'experimentos',
    whatItDoes: 'Inspección minuciosa de rieles de energía, bus de datos y temperaturas.',
    whenToUse: 'Para auditar a fondo una PC de escritorio o portátil.',
    concepts: ['Rieles ATX', 'Telemetría', 'Inspección'],
    actionKey: 'hardware',
    accentColor: '#10B981',
  },
];

