// TOMO 12: INGENIERÍA Y CREACIÓN DE VIDEOJUEGOS // EVO GAME FORGE
// Contenido Editorial Maestro, Capítulos Técnicos, Prácticas, Casos Reales y Fuentes Oficiales

export interface Tomo12Chapter {
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
}

export interface Tomo12CaseStudy {
  id: string;
  title: string;
  symptom: string;
  diagnosticLayer: string;
  telemetryMeasured: string;
  discardedHypothesis: string;
  rootCause: string;
  fixAction: string;
  verificationCmd: string;
}

export interface Tomo12GlossaryItem {
  term: string;
  rfcOrStandard: string;
  definition: string;
  practicalTip: string;
}

export const TOMO_12_META = {
  number: '12',
  volumeLabel: 'Tomo 12',
  title: 'INGENIERÍA Y CREACIÓN DE VIDEOJUEGOS',
  subtitle: 'EVO Game Forge: De las matemáticas vectoriales y shaders al desarrollo del proyecto Mundo Max.',
  themeColor: '#EC4899',
  secondaryColor: '#DB2777',
  badge: 'EVO GAME FORGE // MOTOR, FÍSICA & RENDER PIPELINE',
  edition: 'Edición Técnica de Desarrollo de Videojuegos 2026',
  totalPages: 68,
  manifestoPhrase: 'UN VIDEOJUEGO ES UN BUCLE INFINITO DE SIMULACIÓN DETERMINISTA QUE RENDERIZA CADA FRAME EN MENOS DE 16 MILISEGUNDOS.',
  description: 'Tratado completo sobre arquitectura de motores de juego, game loop, álgebra lineal aplicada (vectores, matrices, cuaterniones), pipelines gráficos con shaders, física de colisiones (AABB, SAT), audio espacial, inteligencia artificial (Behavior Trees, NavMesh) y profiling de rendimiento en tiempo real.',
  sources: [
    'Real-Time Rendering, 4th Edition - Tomas Akenine-Möller, Eric Haines, Naty Hoffman',
    'Game Engine Architecture, 3rd Edition - Jason Gregory',
    'Khronos Group Vulkan / OpenGL 4.6 Core Specification',
    'IEEE Transactions on Games - Deterministic Simulation & Networking in Real-Time Games',
  ],
};

export const TOMO_12_CHAPTERS: Tomo12Chapter[] = [
  {
    id: 't12-c01',
    moduleNumber: 'M01',
    chapterNumber: '01',
    title: 'Arquitectura del Game Loop & Simulación con Delta Time ($dt$)',
    subtitle: 'El bucle principal: Input → Update ($dt$) → Physics Step → Render',
    readTime: '15 min',
    topicsCovered: ['Bucle de juego (Game Loop)', 'Delta Time variable vs Fixed Timestep', 'Acumulador de física', 'Interpolación de cuadros'],
    capa1Explicacion:
      'Un videojuego no es una secuencia de páginas: es un bucle continuo que se repite 60, 120 o 240 veces por segundo. En cada vuelta (tick), el motor lee la entrada del teclado/mouse, actualiza las posiciones del mundo según el tiempo transcurrido (Delta Time, $dt$), calcula las colisiones y envía la geometría a la tarjeta gráfica para ser dibujada.',
    capa2DetalleTecnico:
      'Si el movimiento de un personaje se calcula como $x = x + v$, la velocidad dependerá de los FPS del monitor (un jugador a 144 Hz se moverá más del doble de rápido que uno a 60 Hz). La ecuación correcta es $x = x + v \\cdot dt$. Para física determinista, se utiliza un paso fijo (Fixed Timestep) de e.g. $16.67\\text{ ms}$ ($60\\text{ Hz}$) con un bucle acumulador: `while (accumulator >= dt) { physicsStep(dt); accumulator -= dt; }`.',
    capa3PracticaMedicion:
      'Comprobación en JavaScript / WebGL midiendo `performance.now()` entre fotogramas de `requestAnimationFrame`. Medición de desvíos de delta time y simulación con limitador de FPS artificial.',
    microformatos: {
      mito: 'Mito: "Calcular la física dentro del render loop a 240 FPS hace que el juego sea más preciso."',
      errorComun: 'Multiplicar por $dt$ dos veces al calcular aceleración y velocidad ($x += v \\cdot dt \\cdot dt$).',
      comprobalo: 'Cambiá la tasa de refresco de tu monitor de 60Hz a 144Hz en un juego mal programado y observá si la gravedad o velocidad se descontrolan.',
      paraTecnicos: 'El acumulador de física desacopla la tasa de refresco del display de la tasa de integración numérica de Euler o Verlet.',
      conclusionEvo: 'La consistencia temporal es la ley suprema del game dev: la física debe ser determinista e inmune a los altibajos de framerate.',
    },
    decisionRule: 'Nunca ejecutes lógica de simulación física en el hilo de render sin un Fixed Timestep con acumulador temporal.',
  },
  {
    id: 't12-c02',
    moduleNumber: 'M01',
    chapterNumber: '02',
    title: 'Matemáticas para Videojuegos: Vectores, Matrices y Trigonometría',
    subtitle: 'Producto escalar (Dot Product), producto vectorial (Cross Product) y normalización',
    readTime: '18 min',
    topicsCovered: ['Vectores 2D y 3D ($x, y, z$)', 'Magnitud y vector unitario (Normalización)', 'Producto punto (Dot Product) para ángulos y FOV', 'Producto cruz (Cross Product) para normales de superficie'],
    capa1Explicacion:
      'Los vectores representan tanto posiciones en el espacio como direcciones y velocidades. Si querés saber si un enemigo puede ver a tu personaje, calculás el producto escalar (Dot Product) entre el vector hacia donde mira el enemigo y el vector que va desde el enemigo hacia vos: si el resultado es mayor a cero, estás frente a él; si es menor a cero, estás a sus espaldas.',
    capa2DetalleTecnico:
      'El producto punto se define como $\\vec{A} \\cdot \\vec{B} = |A| |B| \\cos(\\theta)$. Al normalizar ambos vectores ($|A| = 1, |B| = 1$), $\\vec{A} \\cdot \\vec{B} = \\cos(\\theta)$. Un valor de $1.0$ indica dirección idéntica ($0^\\circ$), $0.0$ indica perpendicularidad ($90^\\circ$) y $-1.0$ indica dirección opuesta ($180^\\circ$). Las transformaciones espaciales (traslación, rotación, escala) se compactan en matrices homogéneas $4 \\times 4$.',
    capa3PracticaMedicion:
      'Cálculo interactivo en el Game Math Lab: cálculo de distancias euclidianas $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$, optimización con distancia al cuadrado ($d^2$) para evitar la costosa raíz cuadrada, y cálculo de reflejos de proyectiles con $\\vec{R} = \\vec{V} - 2(\\vec{V} \\cdot \\vec{N})\\vec{N}$.',
    microformatos: {
      mito: 'Mito: "Para saber si un enemigo está dentro de un rango de 10 metros siempre hay que usar `Math.sqrt()`."',
      errorComun: 'Olvidar normalizar los vectores antes de calcular el producto punto para comparaciones angulares.',
      comprobalo: 'Compará `distSq < radius * radius` en lugar de `Math.sqrt(distSq) < radius` en 10.000 partículas y medí el ahorro de CPU.',
      paraTecnicos: 'Las matrices MVP (Model-View-Projection) transforman vértices desde coordenadas locales de modelo hasta coordenadas de dispositivo normalizadas (NDC).',
      conclusionEvo: 'Las matemáticas no son un requisito abstracto: son el lenguaje con el que construís mundos tridimensionales en la GPU.',
    },
    decisionRule: 'Evitá raíces cuadradas (`sqrt`) en bucles intensivos: compará siempre magnitudes al cuadrado ($d^2$).',
  },
  {
    id: 't12-c03',
    moduleNumber: 'M02',
    chapterNumber: '03',
    title: 'Detección de Colisiones y Física 2D/3D',
    subtitle: 'Cajas delimitadoras AABB, círculos, esferas y Teorema de Ejes Separadores (SAT)',
    readTime: '16 min',
    topicsCovered: ['AABB (Axis-Aligned Bounding Box)', 'Colisión Círculo-Círculo y Esfera-Esfera', 'Teorema de Ejes Separadores (SAT)', 'Resolución de penetración y rebote'],
    capa1Explicacion:
      'La detección de colisiones comprueba si dos objetos sólidos se superponen en el espacio. Para no hacer cálculos pesados entre modelos con miles de polígonos, primero se envuelve cada objeto en una caja invisible simple (AABB) o una esfera. Si las cajas no se tocan, se descarta la colisión instantáneamente.',
    capa2DetalleTecnico:
      'Para dos cajas AABB, colisionan si y solo si se superponen en todos los ejes: `(boxA.minX <= boxB.maxX && boxA.maxX >= boxB.minX) && (boxA.minY <= boxB.maxY && boxA.maxY >= boxB.minY)`. Para polígonos convexos orientados (OBB), el Teorema de Ejes Separadores (SAT) proyecta las figuras sobre las normales de todas sus caras; si existe al menos un eje donde las sombras no se tocan, los objetos no colisionan.',
    capa3PracticaMedicion:
      'Implementación y prueba de colisión AABB y resolución de penetración empujando al personaje fuera del obstáculo por el vector de menor superposición (MTV - Minimum Translation Vector).',
    microformatos: {
      mito: 'Mito: "Las colisiones físicas en los videojuegos comprueban cada triángulo del modelo 3D."',
      errorComun: 'Mover un objeto rápido que atraviesa paredes delgadas por falta de detección continua de colisión (Tunneling).',
      comprobalo: 'Mové un proyectil a 2000 píxeles por frame sin Raycasting y observá cómo traspasa paredes sin tocarlas.',
      paraTecnicos: 'El algoritmo GJK (Gilbert-Johnson-Keerthi) resuelve colisiones de poliedros convexos en 3D calculando la diferencia de Minkowski.',
      conclusionEvo: 'La física eficiente se basa en la jerarquía espacial (Broadphase con Quadtree/BVH → Narrowphase con SAT).',
    },
    decisionRule: 'Para proyectiles o partículas ultra-rápidas, usá Raycasting continuo (Swept-AABB) en lugar de comprobación discreta.',
  },
  {
    id: 't12-c04',
    moduleNumber: 'M02',
    chapterNumber: '04',
    title: 'Arquitectura de Shaders, Iluminación y Render Pipeline',
    subtitle: 'Vertex Shaders, Fragment/Pixel Shaders, Modelo Phong/PBR y Draw Calls',
    readTime: '17 min',
    topicsCovered: ['Pipeline Gráfico: Vértices → Rasterizado → Fragmentos', 'Shaders GLSL / HLSL', 'Modelo de iluminación Blinn-Phong & PBR', 'Optimización de Draw Calls y Batching'],
    capa1Explicacion:
      'Un shader es un pequeño programa ultrarrápido que se ejecuta en paralelo en miles de núcleos de la GPU. El Vertex Shader calcula la posición de cada esquina (vértice) de un objeto en tu pantalla; el Fragment Shader decide el color exacto de cada píxel, calculando cómo rebota la luz, las sombras, los reflejos y las texturas.',
    capa2DetalleTecnico:
      'El modelo Blinn-Phong combina tres componentes: 1. Luz Ambiental ($I_{amb} = k_a \\cdot L_a$), 2. Luz Difusa Lambertiana ($I_{diff} = k_d \\cdot (\\vec{N} \\cdot \\vec{L})$), 3. Luz Especular ($I_{spec} = k_s \\cdot (\\vec{N} \\cdot \\vec{H})^\\alpha$, donde $\\vec{H}$ es el vector intermedio entre la luz y la cámara). El estándar moderno PBR (Physically Based Rendering) reemplaza esto con la ecuación de reflectancia de microfacetas de Cook-Torrance conservando la energía lumínica.',
    capa3PracticaMedicion:
      'Inspección de draw calls y shaders en RenderDoc / WebGL Spector. Medición del impacto del empaquetado de texturas (Texture Atlases) e instanciación para reducir las llamadas de dibujado de 2000 a 10.',
    microformatos: {
      mito: 'Mito: "Cuantos más polígonos tenga un modelo, más lento será el juego siempre."',
      errorComun: 'Hacer 5000 draw calls individuales en lugar de agrupar geometrías con el mismo material (Static/Dynamic Batching).',
      comprobalo: 'Inspeccioná un juego en RenderDoc: la CPU suele colapsar por emitir miles de cambios de estado antes de que la GPU sature sus shaders.',
      paraTecnicos: 'El fillrate y el overdraw son los cuellos de botella clásicos cuando se abusan de sistemas de partículas transparentes apiladas.',
      conclusionEvo: 'Entender la GPU te permite crear mundos visualmente asombrosos sin sacrificar los 60 FPS mínimos.',
    },
    decisionRule: 'Agrupá mallas que compartan texturas y materiales para minimizar cambios de estado en el pipeline gráfico.',
  },
  {
    id: 't12-c05',
    moduleNumber: 'M03',
    chapterNumber: '05',
    title: 'Proyecto Integrador Mundo Max: De la Idea al Build Final',
    subtitle: 'La progresión completa de 12 pasos de ingeniería de un videojuego real',
    readTime: '20 min',
    topicsCovered: ['Estructura de escenas y ECS (Entity Component System)', 'Control de personaje y máquina de estados finitos (FSM)', 'Generación de mundos y tiles', 'Build, empaquetado y release'],
    capa1Explicacion:
      'Mundo Max es el proyecto práctico insignia de EVO Game Forge. En lugar de crear prototipos descartables, seguimos una progresión metódica en 12 fases: desde el spawn y movimiento del personaje, control de cámara suave (Lerp), generación procedural de mapas, hasta inteligencia artificial de enemigos, combate con hitboxes, interfaz de usuario y optimización del ejecutable final.',
    capa2DetalleTecnico:
      'La arquitectura utiliza una Máquina de Estados Finitos (FSM) jerárquica para el personaje (`Idle`, `Running`, `Jumping`, `Attacking`, `Hurt`). Cada estado define sus transiciones deterministas, evitando que el personaje salte mientras está congelado o ataque mientras está muerto. La cámara implementa interpolación lineal: $\\text{Cam}_{pos} = \\text{Cam}_{pos} + (\\text{Target}_{pos} - \\text{Cam}_{pos}) \\cdot \\text{smoothFactor} \\cdot dt$.',
    capa3PracticaMedicion:
      'Ejecución interactiva del Mundo Max Studio con el checklist de las 12 fases activas y verificación de framerate, draw calls y memoria heap.',
    microformatos: {
      mito: 'Mito: "Para crear un juego primero hay que hacer la historia y los gráficos finales."',
      errorComun: 'Empezar agregando 50 tipos de armas antes de que el movimiento y la colisión básica se sientan fluidos.',
      comprobalo: 'Probá el prototipo con cubos grises: si el movimiento no es divertido en ' + 'gris, los gráficos bonitos no lo salvarán.',
      paraTecnicos: 'El patrón ECS separa datos (Componentes puros) de la lógica (Sistemas), optimizando el caché L1/L2 de la CPU por acceso lineal contiguo.',
      conclusionEvo: 'Un gran juego se forja paso a paso con rigor de software, no con chispazos de inspiración caótica.',
    },
    decisionRule: 'Completá siempre el bucle jugable nuclear (Core Loop) con geometría básica antes de invertir tiempo en arte final.',
  },
];

export const TOMO_12_CASE_STUDIES: Tomo12CaseStudy[] = [
  {
    id: 't12-case-01',
    title: 'Stutter y Micro-congelamientos por Creación de Objetos en el Game Loop',
    symptom: 'El juego corre a 120 FPS pero sufre un micro-congelamiento de 50 ms cada 3 segundos.',
    diagnosticLayer: 'Capa de Memoria y Recolector de Basura (Garbage Collector)',
    telemetryMeasured: 'El Heap de memoria crecía a razón de 15 MB/s. El Garbage Collector ejecutaba pausas de 45 ms periódicamente.',
    discardedHypothesis: 'Se descartó sobrecarga de shaders en GPU y throttling térmico del procesador.',
    rootCause: 'Cada disparo de bala creaba una nueva instancia de objeto `new Bullet(x, y)` y un nuevo vector `new Vector2D()` dentro del `Update()`.',
    fixAction: 'Implementación del patrón Object Pooling: pre-reserva de un arreglo estático de 200 balas reutilizables en memoria.',
    verificationCmd: 'Las asignaciones de memoria en el frame loop bajaron a 0 bytes/frame. El frametime se estabilizó en 8.33 ms constantes sin pausas de GC.',
  },
  {
    id: 't12-case-02',
    title: 'Proyectil Atraviesa Enemigos a Altos FPS (Tunneling Problem)',
    symptom: 'Las flechas disparadas a corta distancia a veces no hacen daño y traspasan a los jefes.',
    diagnosticLayer: 'Capa de Detección de Colisiones Discreta',
    telemetryMeasured: 'Velocidad de la flecha = 1500 px/s. A 30 FPS, la flecha se desplaza 50 px por frame. El grosor del enemigo es de 30 px.',
    discardedHypothesis: 'Se descartaron errores en la lógica de restado de vida (HP) o máscaras de colisión incorrectas.',
    rootCause: 'Detección discreta: la posición en el frame N estaba antes del enemigo y en el frame N+1 ya estaba detrás, nunca solapándose en ningún frame.',
    fixAction: 'Sustitución de la comprobación AABB puntual por Raycasting continuo (trazado de un segmento de rayo entre la posición anterior y la actual).',
    verificationCmd: '100% de impactos detectados con precisión milimétrica a cualquier tasa de cuadros por segundo.',
  },
];

export const TOMO_12_GLOSSARY: Tomo12GlossaryItem[] = [
  {
    term: 'Delta Time (dt)',
    rfcOrStandard: 'Game Engine Architecture',
    definition: 'Tiempo transcurrido en segundos entre el fotograma anterior y el actual, utilizado para escalar el movimiento de manera independiente a los FPS.',
    practicalTip: 'Multiplicar siempre la velocidad por dt para garantizar la misma velocidad en monitores de 60Hz, 144Hz y 240Hz.',
  },
  {
    term: 'Object Pooling',
    rfcOrStandard: 'Game Programming Patterns',
    definition: 'Técnica de optimización que pre-crea un conjunto de objetos reciclables para evitar continuas llamadas al recolector de basura.',
    practicalTip: 'Obligatorio para proyectiles, efectos de partículas, números de daño y sonidos repetitivos.',
  },
  {
    term: 'Draw Call',
    rfcOrStandard: 'Graphics API Spec',
    definition: 'Instrucción enviada por la CPU a la GPU para dibujar un conjunto específico de polígonos con un shader y textura dados.',
    practicalTip: 'Minimizar draw calls combinando texturas en Texture Atlases y utilizando Mesh Batching.',
  },
  {
    term: 'AABB (Axis-Aligned Bounding Box)',
    rfcOrStandard: 'Computational Geometry',
    definition: 'Caja delimitadora rectangular alineada con los ejes cardinales utilizada para comprobación ultrarrápida de colisiones.',
    practicalTip: 'El test más rápido para descartar colisiones entre miles de objetos en pantalla.',
  },
];
