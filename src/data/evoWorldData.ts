import { EvoNarrativeProfile, EvoProfileDetail, EvoLabZone } from '../types';

export const EVO_IDENTITY = {
  title: 'EVO LABS',
  tagline: 'MUNDO EVO V1 // PLATAFORMA DE INGENIERÍA Y DIAGNÓSTICO',
  identityPhrase: 'Hacemos milagros, pero los medimos.',
  manifesto: 'Esto no es una clase. Es un laboratorio. Tu PC no es una caja negra: es tu banco de pruebas.',
};

export const EVO_NARRATIVE_PROFILES: Record<EvoNarrativeProfile, EvoProfileDetail> = {
  investigador: {
    id: 'investigador',
    title: 'El Investigador',
    tagline: 'Forense de Sistemas & Detección Causal',
    badge: 'INVESTIGADOR // FORENSE',
    description:
      'Tu primer instinto ante cualquier anomalía no es entrar en pánico ni reiniciar a ciegas: es abrir telemetría, reconstruir la línea de tiempo y encontrar qué variable exacta cambió en las últimas 48 horas.',
    workstyle:
      'Aislar síntomas, contrastar hipótesis contra datos duros y no dar nada por resuelto hasta tener prueba reproducible.',
    motto: 'No existen los "se arregló solo". Todo tiene una causa medible.',
  },
  constructor: {
    id: 'constructor',
    title: 'El Constructor',
    tagline: 'Optimización Fisiológica & Rendimiento Físico',
    badge: 'CONSTRUCTOR // HARDWARE',
    description:
      'Ves tu computadora como un motor de combustión o un reactor: flujo de aire, curva de ventiladores, voltajes limpios y sincronización térmica. Te apasiona meter mano y sentir el cambio físico en la máquina.',
    workstyle:
      'Ajustar tolerancias mecánicas, mejorar la refrigeración, ordenar la arquitectura interna y exprimir cada watt con precisión.',
    motto: 'Si el silicio está frío y el flujo es laminar, el sistema vuela.',
  },
  explorador: {
    id: 'explorador',
    title: 'El Explorador',
    tagline: 'Frontera Experimental & Ensayos no Convencionales',
    badge: 'EXPLORADOR // EXPERIMENTAL',
    description:
      'Desconfiás de las recetas genéricas de internet. Te gusta bucear en repositorios de GitHub poco conocidos, probar flags experimentales en kernels o configuraciones atípicas para descubrir comportamientos ocultos.',
    workstyle:
      'Explorar límites desconocidos, someter componentes a escenarios atípicos y documentar hallazgos que los manuales omiten.',
    motto: 'Las reglas de fábrica son solo un piso, no el techo.',
  },
  tecnico: {
    id: 'tecnico',
    title: 'El Técnico',
    tagline: 'Protocolo de Laboratorio & Estabilidad Quirúrgica',
    badge: 'TÉCNICO // RIGOR METROLÓGICO',
    description:
      'Amante del orden y la metrología. Tu mantra es la repetibilidad: si una prueba no tiene condiciones de base idénticas, no sirve. Buscás sistemas sólidos como rocas que no fallen jamás bajo carga sostenida.',
    workstyle:
      'Checklists rigurosos, documentación metódica de versiones de controladores y pruebas A/B de una sola variable.',
    motto: 'Sin condiciones controladas y margen de error acotado, no hay ciencia.',
  },
};

export const EVO_INTRO_QUIZ_SCENARIO = {
  question: 'Tu PC pega un freeze de 3 segundos o un tirón brusco en el momento crítico. La temperatura subió 8°C de golpe sin razón aparente. ¿Cuál es tu reacción instintiva inmediata?',
  options: [
    {
      id: 'investigador' as EvoNarrativeProfile,
      label: 'Abro el Administrador de Tareas y el visor de eventos para ver qué proceso o hilo disparó el pico de interrupciones.',
      hint: 'Perfil analítico y forense. Buscás el culpable con datos.',
    },
    {
      id: 'constructor' as EvoNarrativeProfile,
      label: 'Reviso la curva de ventiladores, toco el gabinete para ver si el disipador acumuló calor y pienso en el flujo de aire.',
      hint: 'Perfil práctico e ingenieril. Pensás en la física y el ensamble.',
    },
    {
      id: 'explorador' as EvoNarrativeProfile,
      label: 'Tiro un comando de telemetría de baja latencia o pruebo aislar el comportamiento con una herramienta alternativa de GitHub.',
      hint: 'Perfil de vanguardia. Te gusta explorar más allá del estándar.',
    },
    {
      id: 'tecnico' as EvoNarrativeProfile,
      label: 'Anoto la versión exacta del driver, el reloj de memoria y replico el escenario tres veces para validar si es reproducible.',
      hint: 'Perfil metodológico estricto. La prueba controlada ante todo.',
    },
  ],
};

export const EVO_WORLD_ZONES: EvoLabZone[] = [
  {
    id: 'zona-1',
    number: '01',
    title: 'Central de Incidentes',
    subtitle: 'Sala de diagnóstico forense',
    keyPhrase: 'CUANDO ALGO NO ANDA BIEN.',
    aspect: 'Sala de diagnóstico forense y triage',
    elements: ['pantallas de monitoreo', 'alertas de fallo', 'timeline de eventos', 'lupa de inspección', 'expedientes periciales'],
    statusCode: 'in_construction',
    statusBadge: 'EN CONSTRUCCIÓN // TRIAGE',
    isInteractive: false,
    description:
      'Mesa de triage y respuesta a fallas críticas. Congelamientos súbitos, pantallas azules, apagados por protección térmica y comportamientos anómalos del sistema.',
    narrativeDetail:
      'En la Central de Incidentes no hay lugar para la adivinación. Cada incidente reportado se convierte en un expediente forense con timeline de eventos, síntomas aislados y descarte progresivo de sospechosos.',
    upcomingFeatures: [
      'Triage interactivo de pantallas azules (BSOD) con análisis de volcado minidump',
      'Protocolo de emergencia térmica: identificación de estrangulamiento térmico (Thermal Throttling)',
      'Simulador de incidentes en tiempo real con casos aportados por la comunidad EVO',
    ],
    examples: [
      'Triage forense de BSOD (pantallas azules) con aislamiento de driver culpable',
      'Protocolo de emergencia para frenar estrangulamiento térmico en 4 pasos',
      'Timeline de eventos de Windows para rastrear qué cambió antes del primer tirón',
    ],
    coordinates: {
      angleDeg: 315,
      orbitDistance: 'mid',
      gridArea: 'incidentes',
      positionPct: { x: 22, y: 22 },
    },
  },
  {
    id: 'zona-2',
    number: '02',
    title: 'Taller de Rendimiento',
    subtitle: 'Banco de pruebas y telemetría',
    keyPhrase: 'EXPRIMÍ TU PC. PERO MEDILO.',
    aspect: 'Banco de pruebas y telemetría de alta intensidad',
    elements: ['monitor FPS', 'frametime', 'ventiladores', 'GPU', 'CPU', 'temperaturas'],
    statusCode: 'in_construction',
    statusBadge: 'EN CONSTRUCCIÓN // BANCO',
    isInteractive: false,
    description:
      'Banco de pruebas de alta intensidad. Pruebas de estrés sostenido, optimización de frecuencias, curvas de ventilación personalizadas y análisis de estabilidad de voltajes.',
    narrativeDetail:
      'El taller donde se lleva la máquina a su límite operativo seguro. Acá se desmontan los mitos de "optimizar Windows con un clic" y se trabaja con mediciones directas de latencia y throughput.',
    upcomingFeatures: [
      'Generador de perfiles de estrés térmico continuo (CPU/GPU/VRAM)',
      'Optimizador de latencias DPC (Deferred Procedure Calls) para audio y gaming competitivo',
      'Auditoría de consistencia de frametimes (1% Lows vs Frecuencias de reloj)',
    ],
    examples: [
      'Auditoría de consistencia de frametimes y micro-stuttering en tiempo real',
      'Calibración de curvas acústicas de ventiladores y flujo laminar de aire',
      'Benchmarking relativo contra hardware idéntico de la base EVO',
    ],
    coordinates: {
      angleDeg: 0,
      orbitDistance: 'near',
      gridArea: 'rendimiento',
      positionPct: { x: 50, y: 14 },
    },
  },
  {
    id: 'zona-3',
    number: '03',
    title: 'Archivo EVO',
    subtitle: 'Archivo técnico / biblioteca secreta',
    keyPhrase: 'TODO LO QUE DESCUBRIMOS QUEDA ACÁ.',
    aspect: 'Archivo técnico y biblioteca secreta de investigación',
    elements: ['carpetas clasificadas', 'tomos de ingeniería', 'expedientes', 'planos de arquitectura'],
    statusCode: 'active',
    statusBadge: 'ACTIVO // TOMO 01 DISPONIBLE',
    isInteractive: true,
    ctaLabel: 'ENTRAR AL ARCHIVO EVO',
    description:
      'La biblioteca viva de la metodología EVO. En su núcleo reside el Tomo 01: la base fundamental donde aprendés a medir, diagnosticar y certificar tu propio hardware sin trucos.',
    narrativeDetail:
      'El Archivo EVO alberga las publicaciones maestras e investigaciones empíricas. El Tomo 01 es el punto de partida oficial: 7 capítulos interactivos donde tu propia computadora es el sujeto de estudio.',
    upcomingFeatures: [
      'Tomo 01: Conocé tu PC — Arquitectura, Flujo de Recursos y Diagnóstico Real (Activo)',
      'Tomo 02: Redes, Latencia Real y el Camino del Paquete (En redacción)',
      'Tomo 03: Firmware, BIOS, Microcódigo y Rieles de Energía (En investigación)',
    ],
    examples: [
      'TOMO 01 // CONOCÉ TU PC: 7 capítulos interactivos con datos de tu propia máquina',
      'Dossier Pericial y Pasaporte Técnico descargable con certificación de pruebas',
      'Bancos de datos con las limitaciones físicas de procesadores y memorias',
    ],
    coordinates: {
      angleDeg: 45,
      orbitDistance: 'mid',
      gridArea: 'archivo',
      positionPct: { x: 78, y: 22 },
    },
  },
  {
    id: 'zona-4',
    number: '04',
    title: 'Cámara de Experimentos',
    subtitle: 'Laboratorio de pruebas A/B',
    keyPhrase: 'CAMBIÁ UNA COSA. MEDÍ LO QUE PASÓ.',
    aspect: 'Laboratorio de pruebas científicas A/B',
    elements: ['dos estaciones A/B', 'gráficos de dispersión', 'interruptores', 'sensores'],
    statusCode: 'in_construction',
    statusBadge: 'EN CONSTRUCCIÓN // EXPERIMENTAL',
    isInteractive: false,
    description:
      'El santuario del método científico de EVO LABS. Un entorno controlado para diseñar pruebas comparativas estrictas: una variable modificada a la vez, medición ciega y registro de dispersión.',
    narrativeDetail:
      'Si cambiaste el driver de video, limpiaste el polvo y tocaste el perfil XMP todo el mismo día, no aprendiste nada. En la Cámara de Experimentos cada hipótesis se valida con rigor antes de declararse válida.',
    upcomingFeatures: [
      'Constructor guiado de matrices A/B con control estricto de variables parásitas',
      'Calculadora de significancia estadística para deltas de frametime y temperatura',
      'Registro automatizado de fotos de estado antes / después (hardware y software)',
    ],
    examples: [
      'Prueba comparativa A/B: Driver oficial vs Driver Studio con 1 sola variable cambiada',
      'Medición de impacto de temperatura ambiente en el Boost Clock sostenido',
      'Matriz de estabilidad con protocolo de reversibilidad en 1 clic',
    ],
    coordinates: {
      angleDeg: 90,
      orbitDistance: 'near',
      gridArea: 'experimentos',
      positionPct: { x: 84, y: 52 },
    },
  },
  {
    id: 'zona-5',
    number: '05',
    title: 'Sala de Máquinas',
    subtitle: 'Zona de construcción y automatización',
    keyPhrase: 'CONSTRUIR. AUTOMATIZAR. INVENTAR.',
    aspect: 'Zona de construcción y desarrollo de herramientas',
    elements: ['terminales PowerShell', 'scripts', 'herramientas de taller', 'placas electrónicas', 'automatización'],
    statusCode: 'in_construction',
    statusBadge: 'EN CONSTRUCCIÓN // WORKBENCH',
    isInteractive: false,
    description:
      'El taller de ingeniería de software para el fierrero. Creación de scripts livianos en PowerShell, colectores de telemetría sin telemetría espía y automatización de diagnósticos.',
    narrativeDetail:
      'Cansados de programas de 500 MB llenos de publicidad para medir un reloj, acá construimos nuestros propios colectores: código transparente, ejecutable localmente y con cero impacto en el rendimiento.',
    upcomingFeatures: [
      'Repositorio de scripts EVO verificados de 1 línea para auditoría de hardware',
      'Colector liviano de telemetría JSON compatible con el Pasaporte EVO',
      'Editor de automatizaciones para registrar caídas de FPS mientras jugás',
    ],
    examples: [
      'Colector liviano de telemetría en PowerShell puro (cero impacto en FPS)',
      'Linter de Windows: detector de telemetría basura y procesos fantasma',
      'Script de benchmarking repetible con exportación automática a formato EVO',
    ],
    coordinates: {
      angleDeg: 135,
      orbitDistance: 'mid',
      gridArea: 'maquinas',
      positionPct: { x: 76, y: 80 },
    },
  },
  {
    id: 'zona-6',
    number: '06',
    title: 'Zona Restringida',
    subtitle: 'Desafíos reales de laboratorio',
    keyPhrase: 'ACCESO RESTRINGIDO. DESAFÍOS EVO.',
    aspect: 'Puerta física cerrada con señalización EVO y bloqueo de seguridad',
    elements: ['compuerta blindada sellada', 'panel de advertencia', 'sellos de laboratorio', 'sensor bloqueado'],
    statusCode: 'restricted',
    statusBadge: 'BLOQUEADO // ACCESO RESTRINGIDO',
    isInteractive: false,
    description:
      'Casos complejos, situaciones límites y retos de diagnóstico forense de alta dificultad. Solo para operadores que dominaron los fundamentos.',
    narrativeDetail:
      'Componentes con fallas intermitentes imposibles de reproducir, degradación de silicio, rieles de 12V con rizado peligroso y escenarios donde todo parece indicar una pieza pero la culpable es otra.',
    upcomingFeatures: [
      'Casos misterio EVO: expedientes reales de computadoras con fallas complejas para resolver a ciegas',
      'Simulador de análisis con osciloscopio y cámara térmica',
      'Exámenes de certificación de Operador Pericial de Laboratorio EVO',
    ],
    examples: [
      'Expediente Misterioso #04: La PC que se apaga a los 42 minutos exactos',
      'Desafío de micro-soldadura virtual y diagnóstico de cortos en riel PCIe',
      'Certificación de Operador Pericial de Nivel 2',
    ],
    coordinates: {
      angleDeg: 180,
      orbitDistance: 'near',
      gridArea: 'restringida',
      positionPct: { x: 50, y: 86 },
    },
  },
  {
    id: 'zona-7',
    number: '07',
    title: 'Mi Laboratorio',
    subtitle: 'Mesa de trabajo y expedientes personales',
    keyPhrase: 'TODO LO TUYO, EN UN SOLO LUGAR.',
    aspect: 'Mesa personal de trabajo del operador',
    elements: ['estaciones PC', 'fichas técnicas', 'expedientes', 'resultados', 'proyectos'],
    statusCode: 'in_construction',
    statusBadge: 'EN CONSTRUCCIÓN // EXPEDIENTES',
    isInteractive: false,
    description:
      'Tu hangar personal dentro de EVO LABS. Almacena los pasaportes de tus diferentes computadoras, el historial de expedientes periciales cerrados y tu perfil narrativo activo.',
    narrativeDetail:
      'Cada computadora que pasa por tus manos merece su propio historial clínico. En Mi Laboratorio gestionás múltiples estaciones de trabajo, contrastás su evolución a lo largo del tiempo y calibrás tu perfil operativo.',
    upcomingFeatures: [
      'Hangar multi-máquina: gestioná tu PC principal, tu notebook y PCs de prueba',
      'Línea de tiempo de intervenciones de hardware y cambios de pasta/pads térmicos',
      'Recalibración de tu Perfil Narrativo EVO en cualquier momento con 1 clic',
    ],
    examples: [
      'Hangar con fichas clínicas para hasta 4 computadoras distintas',
      'Historial consolidado de pruebas y dossiers periciales generados',
      'Calibrador del estilo de trabajo de operador (Investigador, Constructor, etc.)',
    ],
    coordinates: {
      angleDeg: 225,
      orbitDistance: 'mid',
      gridArea: 'milaboratorio',
      positionPct: { x: 24, y: 80 },
    },
  },
  {
    id: 'zona-8',
    number: '08',
    title: 'Comunidad EVO',
    subtitle: 'Sala común de intercambio empírico',
    keyPhrase: 'NINGÚN LABORATORIO CRECE SOLO.',
    aspect: 'Sala común del laboratorio',
    elements: ['panel de casos reales', 'operadores en red', 'expedientes compartidos', 'descubrimientos'],
    statusCode: 'in_construction',
    statusBadge: 'EN CONSTRUCCIÓN // FRECUENCIA',
    isInteractive: false,
    description:
      'El punto de encuentro entre operadores, entusiastas y técnicos de campo. Discusión basada en mediciones empíricas, no en fanatismo de marcas.',
    narrativeDetail:
      'Una red de operadores que comparten una premisa elemental: ningún consejo tiene valor si no viene acompañado del método de prueba y el antes/después medido.',
    upcomingFeatures: [
      'Banco de casos resueltos: buscá problemas idénticos a los tuyos y mirá cómo se resolvieron con datos',
      'Base de datos de benchmarks reales de usuarios con idéntica combinación de CPU/GPU',
      'Foro de discusión técnica moderado con protocolo de evidencia obligatoria',
    ],
    examples: [
      'Banco de casos forenses resueltos y verificados por otros operadores',
      'Telemetría comparada entre usuarios con la misma tarjeta gráfica y procesador',
      'Canal de alertas tempranas sobre drivers y actualizaciones inestables',
    ],
    coordinates: {
      angleDeg: 270,
      orbitDistance: 'near',
      gridArea: 'comunidad',
      positionPct: { x: 16, y: 52 },
    },
  },
];

