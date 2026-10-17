export interface Tomo03ModuleItem {
  id: string;
  moduleNumber: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  readTime: string;
  summary?: string;
  decisionTree: {
    question: string;
    yesAction: string;
    noAction: string;
  };
  bancoTool: string;
  workbenchTool?: string;
  keyTakeaways: string[];
  multimeterMode?: string;
  multimeterMeasurement?: string;
  safetyLevel: 'VERDE_SEGURO' | 'AMARILLO_PRECAUCION' | 'ROJO_PELIGRO';
  safetyBadge?: 'VERDE' | 'AMARILLO' | 'ROJO';
  practicalCommand?: string;
}

export interface WorkbenchTool {
  id: string;
  name: string;
  category: string;
  whatItDoes: string;
  howToUse: string;
  whatItProves: string;
  whatItCannotProve: string;
  associatedRisk: string;
  riskNotice?: string;
  safetyBadge: 'VERDE' | 'AMARILLO' | 'ROJO';
}

export interface Tomo03Case {
  id: string;
  title: string;
  symptom: string;
  hypothesis: string;
  measurement: string;
  discarded: string;
  rootCause: string;
  repairAction: string;
  validation: string;
}

export const TOMO_03_META = {
  number: '03',
  volumeLabel: 'Tomo 03',
  title: 'REPARÁ TU PC // LA BIBLIA DEL REPARADOR DE ESCRITORIO',
  subtitle: 'Diagnóstico metódico, árboles de decisión, banco de pruebas y electrónica de taller',
  themeColor: '#10B981',
  secondaryColor: '#00FF88',
  badge: 'TALLER & BANCO DE PRUEBAS',
  edition: 'Edición Maestra de Taller 2026',
  totalPages: 42,
  manifestoPhrase: 'SÍNTOMA ≠ CAUSA. NO CAMBIES UNA PIEZA HASTA TENER EVIDENCIA DE QUE FALLA.',
  description: 'La biblia de referencia técnica para diagnosticar, medir y reparar PCs de escritorio. Desde el cable de 220V hasta el osciloscopio y la depuración del kernel.',
};

export const WORKBENCH_BASE_KIT: WorkbenchTool[] = [
  {
    id: 't01',
    name: 'Multímetro Digital con Puntas Finas',
    category: 'INSTRUMENTAL DE MEDICIÓN',
    whatItDoes: 'Mide tensión continua, resistencia y continuidad según funciones del modelo; el modo diodo es una prueba distinta.',
    howToUse: 'Seleccionar función, bornes y escala según manual. Resistencia/continuidad solo sin energía y con el elemento aislado. Medición energizada de baja tensión solo por técnico capacitado con puntas apropiadas.',
    whatItProves: 'Presencia o ausencia de voltaje en un conector; si un cable o fusible tiene continuidad.',
    whatItCannotProve: 'No mide el rizado de alta frecuencia (ripple) ni la estabilidad de la tensión bajo carga dinámica máxima.',
    associatedRisk: 'Tocar accidentalmente dos pines adyacentes con la punta puede generar un cortocircuito. Usar puntas con funda aislante.',
    safetyBadge: 'AMARILLO',
  },
  {
    id: 't02',
    name: 'Juego de Destornilladores Imantados (PH1, PH2, Planos)',
    category: 'HERRAMIENTA MECÁNICA',
    whatItDoes: 'Montaje y desmontaje de tornillos de gabinete (6-32) y placas madre/unidades M.2 (M2 / M3).',
    howToUse: 'Elegir el calibre exacto para no redondear la cabeza del tornillo. No apretar en exceso sobre el PCB.',
    whatItProves: 'Sujeción mecánica adecuada de disipadores y placas.',
    whatItCannotProve: 'No detecta fatiga del material.',
    associatedRisk: 'Si el destornillador se resbala sobre la placa madre, puede cortar pistas de cobre microscópicas del PCB.',
    safetyBadge: 'AMARILLO',
  },
  {
    id: 't03',
    name: 'Alcohol Isopropílico de Alta Pureza (99.8%)',
    category: 'QUÍMICA DE TALLER',
    whatItDoes: 'Disolvente dieléctrico que limpia grasa térmica vieja, sulfato y polvo de contactos sin dejar humedad residual.',
    howToUse: 'Equipo desconectado, ventilación y material sin pelusa; seguir compatibilidad y secado indicados por fabricante. El tiempo de secado depende de cantidad, humedad y superficies; no usar un plazo universal.',
    whatItProves: 'Puede remover residuos compatibles con el solvente; limpiar no demuestra reparación ni continuidad eléctrica.',
    whatItCannotProve: 'No repara soldaduras frías ni componentes quemados internamente.',
    associatedRisk: 'Líquido inflamable. Trabajar en ambiente ventilado y NUNCA aplicar con la PC conectada a la corriente.',
    safetyBadge: 'VERDE',
  },
  {
    id: 't04',
    name: 'Pasta Térmica de Óxido Metálico / Cerámica (No Conductora)',
    category: 'TERMOTRANSFERENCIA',
    whatItDoes: 'Rellena las micro-imperfecciones de aire microscópicas entre el IHS del procesador y la base del disipador.',
    howToUse: 'Aplicar cantidad y patrón recomendados para el IHS, pasta y disipador exactos; respetar orden y presión de montaje del fabricante.',
    whatItProves: 'Reduce resistencia de interfaz cuando el montaje es correcto; la verificación requiere comparar comportamiento térmico bajo condiciones documentadas.',
    whatItCannotProve: 'No compensa un ventilador que no gira o una bomba de agua rota.',
    associatedRisk: 'Si se usa pasta con metal líquido conductor en lugar de pasta térmica tradicional, cualquier derrame destruye la placa madre.',
    safetyBadge: 'AMARILLO',
  },
  {
    id: 't05',
    name: 'Tester de Fuente ATX con Pantalla LCD',
    category: 'DIAGNÓSTICO RÁPIDO',
    whatItDoes: 'Conecta los conectores de 24 pines, EPS 8 pines y PCIe para leer en tiempo real las tensiones de 12V, 5V, 3.3V y el retardo PG (Power Good ms).',
    howToUse: 'Usar conectores y secuencia del fabricante del tester. Comparar cada riel y señal con la revisión ATX y la fuente; no aplicar una ventana PG universal ni la misma tolerancia a cualquier riel.',
    whatItProves: 'Confirma si la fuente enciende y genera tensiones estáticas básicas.',
    whatItCannotProve: 'La carga depende del tester y suele ser reducida; no valida regulación dinámica, rizado ni capacidad de entrega con la carga real.',
    associatedRisk: 'Bajo riesgo, pero no sustituye la prueba con una fuente conocida buena bajo carga real.',
    safetyBadge: 'VERDE',
  },
  {
    id: 't06',
    name: 'Buzzer / Altavoz Interno de Diagnóstico (Speaker de 4 pines)',
    category: 'TELEMETRÍA ACÚSTICA',
    whatItDoes: 'Traduce los códigos de diagnóstico del BIOS POST en pitidos (beeps) audibles cuando no hay señal de video en pantalla.',
    howToUse: 'Conectar en los pines SPEAKER del panel frontal de la placa madre.',
    whatItProves: 'Aporta un patrón que debe interpretarse con el manual de placa y firmware; no identifica universalmente fase ni componente culpable.',
    whatItCannotProve: 'Si la placa está totalmente muerta o el microprocesador no arranca, el buzzer no sonará.',
    associatedRisk: 'Ninguno.',
    safetyBadge: 'VERDE',
  },
  {
    id: 't07',
    name: 'Pulsador de banco compatible para PWR_SW',
    category: 'MANIOBRA DE BANCO',
    whatItDoes: 'Permite contrastar el circuito del pulsador original con un contacto de banco apropiado.',
    howToUse: 'Identificar el header en el manual exacto y conectar el pulsador compatible con la alimentación retirada. No improvisar puentes energizados con herramientas metálicas.',
    whatItProves: 'Una sustitución aislada y repetida aporta evidencia sobre el pulsador/cable; no certifica todas las funciones de placa o fuente.',
    whatItCannotProve: 'Si la fuente o la placa tienen un corto interno, puentear el switch no encenderá la máquina.',
    associatedRisk: 'Si puenteás pines incorrectos del panel frontal (por ejemplo juntar +5V LED con GND directo), podés quemar pistas.',
    safetyBadge: 'AMARILLO',
  },
  {
    id: 't08',
    name: 'Pulsera Antiestática con Cable a Tierra y Pinza Cocodrilo',
    category: 'PROTECCIÓN ESD',
    whatItDoes: 'Deriva a tierra la carga electrostática del cuerpo humano a través de una resistencia de seguridad de 1 Megaohm.',
    howToUse: 'Colocar ajustada en la muñeca y conectar el cocodrilo al metal descubierto del gabinete sin pintar o a la toma de tierra del banco.',
    whatItProves: 'Forma parte de un sistema de control ESD verificado; estar colocada no demuestra por sí solo protección ni tierra adecuada.',
    whatItCannotProve: 'No protege de descargas directas de 220V de la red.',
    associatedRisk: 'Debe contener siempre su resistencia de 1 Megaohm incorporada para que el operario no quede expuesto a una descarga peligrosa.',
    safetyBadge: 'VERDE',
  },
];

export const TOMO_03_MODULES: Tomo03ModuleItem[] = [
  {
    id: 'mod01',
    moduleNumber: '01',
    title: 'ANTES DE TOCAR LA PC',
    subtitle: 'Seguridad personal, ESD, organización del banco y entrevista al usuario',
    categoryTag: 'PROTOCOLO PREVIO',
    readTime: '8 min',
    decisionTree: {
      question: '¿La alimentación está retirada, el riesgo evaluado y el banco preparado según el procedimiento seguro?',
      yesAction: 'Proceder a retirar paneles laterales sobre superficie antiestática.',
      noAction: 'DESENCHUFAR INMEDIATAMENTE. No intervenir circuitos energizados.',
    },
    bancoTool: 'Pulsera Antiestática + Fotos del cableado con smartphone antes de desconectar nada.',
    keyTakeaways: [
      'Entrevista técnica de admisión: Cuándo falló por primera vez, si hubo tormenta eléctrica, ruidos extraños o si fue abierta recientemente.',
      'Desconectar de la red y pulsar POWER puede reducir energía residual en la placa, pero NO descarga con garantía los capacitores de la fuente. Nunca abrir la carcasa ATX.',
      'El método de las cajas de tornillos: Clasificar tornillos de fuente, placas y gabinete en recipientes separados; jamás usar tornillos forzados en roscas incompatibles.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod02',
    moduleNumber: '02',
    title: 'CÓMO PIENSA UN REPARADOR',
    subtitle: 'El método científico contra el cambia-piezas: síntoma, medición y aislamiento',
    categoryTag: 'LÓGICA PERICIAL',
    readTime: '9 min',
    decisionTree: {
      question: '¿Tenés evidencia medible o comprobada de que la pieza sospechosa está fallando?',
      yesAction: 'Aislar el componente y verificar con una prueba cruzada.',
      noAction: 'ALTO. No compres ni cambies ninguna pieza basada en una suposición de foro.',
    },
    bancoTool: 'Bitácora de servicio + Multímetro digital.',
    keyTakeaways: [
      'El axioma fundamental de EVO: Síntoma ≠ Causa. Un juego que se congela puede ser GPU, pero también puede ser fuente inestable o temperatura de CPU.',
      'La regla de una sola variable: Nunca cambies dos cosas al mismo tiempo; si tocás dos variables y el problema se resuelve, no sabés qué lo solucionó.',
      'Arranque mínimo: aislar periféricos y comparar con una configuración mínima compatible, sobre superficie de taller no conductora y adecuada para ESD. Evitar afirmar porcentajes de fallas sin datos.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod03',
    moduleNumber: '03',
    title: 'NO ENCIENDE ABSOLUTAMENTE NADA',
    subtitle: 'La ruta de la energía desde el tomacorriente de la pared hasta los 5VSB de la placa',
    categoryTag: 'FALLA CERO ENERGÍA',
    readTime: '12 min',
    decisionTree: {
      question: '¿El led de standby de la placa madre enciende al conectar la fuente a la pared y encender el switch I/O?',
      yesAction: 'El indicador sugiere alimentación de espera, pero no demuestra un 5VSB estable ni descarta fuente, placa o circuito de encendido. Verificar con pruebas cruzadas seguras.',
      noAction: 'Comprobar toma, cable, interruptor externo y otra fuente compatible conocida buena. No abrir ni inspeccionar el interior energizado o descargado de una fuente ATX.',
    },
    bancoTool: 'Fuente ATX compatible conocida buena o analizador externo profesional. Toda medición en circuitos energizados requiere técnico capacitado y puntas aisladas.',
    multimeterMode: 'Referencia ATX de +5VSB: tolerancia nominal habitual ±5% (4,75 a 5,25 V). Solo personal formado debe medir circuitos energizados; una lectura aislada no certifica una fuente.',
    keyTakeaways: [
      'Antes de culpar a la placa madre, verificar toma, cable y selector externo I/O de la fuente. No atribuir porcentajes de falla sin muestras representativas.',
      'El riel 5VSB (Standby): Es la línea de vida permanente que alimenta los circuitos de espera del Super I/O mientras la máquina está apagada.',
      'No improvisar puentes con clips: el giro de un ventilador no demuestra que la fuente soporte carga. Preferir instrumento de prueba homologado o reemplazo cruzado compatible.',
    ],
    safetyLevel: 'ROJO_PELIGRO',
  },
  {
    id: 'mod04',
    moduleNumber: '04',
    title: 'LA FUENTE DE PODER ATX',
    subtitle: 'Pinout del conector de 24 pines, rieles 12V/5V/3.3V, señal PG y advertencia letal',
    categoryTag: 'ELECTRÓNICA DE ALIMENTACIÓN',
    readTime: '13 min',
    decisionTree: {
      question: '¿La fuente mantiene tensiones y señales correctas bajo una prueba profesional segura y carga adecuada, o la PC funciona con una fuente compatible conocida buena?',
      yesAction: 'La prueba aporta evidencia sobre la entrega de alimentación; registrar carga, instrumento y comprobar estabilidad bajo condiciones controladas.',
      noAction: 'No hay evidencia suficiente de alimentación correcta; aislar los demás componentes con una fuente compatible conocida buena antes de atribuir causa.',
    },
    bancoTool: 'Tester de fuente ATX o multímetro con puntas aisladas.',
    multimeterMode: 'Power Good (PWR_OK) es una señal temporal cuya transición y estabilidad requieren instrumental adecuado, como osciloscopio. Un multímetro común no verifica el tiempo de subida.',
    keyTakeaways: [
      'Nunca abrir la fuente ATX: el primario puede conservar tensión peligrosa y energía almacenada aun desconectado; no hay tiempo universal de descarga garantizada.',
      'Rieles y funciones se identifican por documentación del conector exacto. El color de cables no es garantía de patillaje, especialmente en cables modulares o de un solo color.',
      'PWR_OK informa una condición y temporización de alimentación definida por especificación; no garantiza estabilidad futura ni salud de CPU, placa o carga.',
    ],
    safetyLevel: 'ROJO_PELIGRO',
  },
  {
    id: 'mod05',
    moduleNumber: '05',
    title: 'BOTÓN POWER Y PANEL FRONTAL',
    subtitle: 'PWR_SW, Reset, polaridad de LEDs y prueba de pulsador aislado',
    categoryTag: 'INTERRUPTORES & CHASIS',
    readTime: '9 min',
    decisionTree: {
      question: '¿Un pulsador de banco compatible elimina repetidamente la falla y el original la reproduce?',
      yesAction: 'El circuito del mando original queda implicado. Registrar continuidad y montaje; no declarar placa y fuente completamente sanas.',
      noAction: 'La causa sigue abierta: revisar alimentación, header documentado, cable y condiciones de prueba.',
    },
    bancoTool: 'Manual de placa, pulsador compatible y multímetro en continuidad con el elemento aislado y sin energía.',
    keyTakeaways: [
      'Polaridad en el Front Panel: Los pulsadores (PWR_SW y RESET_SW) son contactos secos y NO tienen polaridad; los LEDs (HDD_LED y POWER_LED) sí tienen ánodo (+) y cátodo (-).',
      'Un pulsador retenido puede solicitar apagado prolongado; temporización y comportamiento dependen de firmware y configuración, no de un plazo universal exacto.',
      'Una sustitución temporal de pulsador exige compatibilidad, identificación del header y conexión sin energía; documentar cambio y reversión.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod06',
    moduleNumber: '06',
    title: 'ENCIENDE PERO NO DA VIDEO',
    subtitle: 'El laberinto de la pantalla negra: cables, monitor, salidas HDMI/DP y GPU',
    categoryTag: 'SUBSISTEMA DE VIDEO',
    readTime: '14 min',
    decisionTree: {
      question: '¿El monitor sale del modo standby (el led cambia de color o el cartel dice "Sin señal" en vez de apagado total)?',
      yesAction: 'El mensaje pertenece al monitor; contrastar entrada, cable, salida soportada y POST antes de atribuir causa.',
      noAction: 'Verificar alimentación del monitor, cable de corriente y entrada seleccionada (Source: HDMI 1 / DP).',
    },
    bancoTool: 'Cable HDMI/DP conocido bueno + Monitor secundario de prueba.',
    keyTakeaways: [
      'Una salida de motherboard requiere soporte gráfico del CPU y plataforma exactos. Confirmar modelo y ruta; no estimar porcentajes ni inferir iGPU por marca o sufijo aislado.',
      'Inspección del conector PCIe de la GPU: Verificar que todos los pines de alimentación auxiliar de 6 u 8 pines estén firmemente calzados con el clic de traba trabado.',
      'Prueba cruzada de salida: Probar otra salida física de la placa de video (DP alternativo o HDMI) antes de diagnosticar una placa gráfica dañada.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod07',
    moduleNumber: '07',
    title: 'EL POST (POWER-ON SELF TEST)',
    subtitle: 'La secuencia secreta: CPU -> DRAM -> VGA -> BOOT decodificada por LEDs y Beeps',
    categoryTag: 'SECUENCIA DE INICIALIZACIÓN',
    readTime: '11 min',
    decisionTree: {
      question: '¿En qué Debug LED se detiene el ciclo de inicio de la placa madre?',
      yesAction: 'Relacionar el indicador con el manual exacto y elegir una prueba discriminante; la fase detenida no identifica automáticamente el componente culpable.',
      noAction: 'Si no tiene Debug LEDs, conectar un speaker de 4 pines y escuchar el patrón de pitidos.',
    },
    bancoTool: 'Buzzer piezoeléctrico de 4 pines + Manual oficial de la placa madre.',
    keyTakeaways: [
      'POST tiene dependencias de inicialización, pero orden, códigos y tiempos exactos dependen de placa, revisión y firmware; consultar el manual específico.',
      'Un indicador DRAM persistente orienta a memoria, perfil, ranura, socket o controlador; no confirma una pieza defectuosa.',
      'Códigos y pitidos no son universales. Registrar secuencia y permanencia; ausencia de speaker o indicador limita la observación.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod08',
    moduleNumber: '08',
    title: 'DIAGNÓSTICO PERICIAL DE RAM',
    subtitle: 'DIMMs, notches, ranuras A2/B2, limpieza de contactos y MemTest86',
    categoryTag: 'MEMORIA FÍSICA',
    readTime: '13 min',
    decisionTree: {
      question: '¿La PC da video instalando un solo módulo de memoria en la ranura recomendada por el fabricante (usualmente ranura 2 / A2)?',
      yesAction: 'Se observó POST con esa combinación; cruzar módulos/ranuras y probar memoria antes de declarar estabilidad.',
      noAction: 'Verificar compatibilidad, perfil base, asiento y entrenamiento según manual; cambiar una variable con alimentación retirada.',
    },
    bancoTool: 'Alcohol isopropílico 99% + Hisopos de algodón + Pendrive booteable con MemTest86.',
    keyTakeaways: [
      'Población y ranura de referencia se toman del manual. A2/B2 son frecuentes en ciertas placas, pero no universales para toda topología o plataforma.',
      'Limpieza pericial de contactos: Pasar un hisopo embebido en alcohol isopropílico por los contactos dorados de ambos lados; nunca usar gomas de borrar abrasivas que desgastan el baño de oro.',
      'Un error exige investigar estabilidad, perfil, módulo y camino de canal. Cero errores en un ensayo finito no certifica ausencia permanente de fallas.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod09',
    moduleNumber: '09',
    title: 'CMOS, NVRAM Y LA PILA CR2032',
    subtitle: 'Síntomas de batería agotada, pérdida de hora y el procedimiento Clear CMOS',
    categoryTag: 'MEMORIA NO VOLÁTIL',
    readTime: '10 min',
    decisionTree: {
      question: '¿La retención de hora y la prueba de batería/contacto aportan evidencia de falla?',
      yesAction: 'Contrastar condiciones de medida, contacto y retención de hora con reemplazo del tipo correcto.',
      noAction: 'Una lectura en vacío no certifica capacidad. Investigar retención, contacto, sincronización y diseño.',
    },
    bancoTool: 'Multímetro en escala 20V DC + Pila CR2032 nueva de repuesto.',
    multimeterMode: 'CR2032 nominal 3 V; escala, polaridad y condiciones según instrumento y fabricante. Una medida en vacío no verifica capacidad ni contacto.',
    keyTakeaways: [
      'Síntomas de pila agotada: La PC pide presionar F1 en cada encendido para ingresar al Setup, la hora de Windows se retrasa al año de fabricación de la placa y los perfiles XMP se desactivan.',
      'Clear CMOS sigue el procedimiento del modelo exacto, sin tiempos ni pinout universales. Registrar ajustes y prever recuperación de cifrado; no borrar TPM.',
      'Restablecer ajustes puede corregir configuración inestable, pero no reescribe ni repara automáticamente firmware corrupto.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod10',
    moduleNumber: '10',
    title: 'BIOS / UEFI Y ACTUALIZACIONES SEGURAS',
    subtitle: 'Valores por defecto, perfiles XMP/EXPO, riesgos de flasheo y BIOS Flashback',
    categoryTag: 'FIRMWARE DEL SISTEMA',
    readTime: '12 min',
    decisionTree: {
      question: '¿La PC tiene un problema documentado que se resuelve explícitamente en la versión nueva de BIOS?',
      yesAction: 'Confirmar modelo/revisión, método oficial, energía estable y recuperación antes de autorizar la actualización.',
      noAction: 'Si la máquina es 100% estable y no vas a cambiar de generación de procesador, no actualices a ciegas.',
    },
    bancoTool: 'Pendrive USB 2.0 formateado en FAT32 + UPS / Estabilizador para evitar cortes de luz.',
    keyTakeaways: [
      'Actualizar por motivo documentado y método oficial compatible. Prever energía estable, ajustes, cifrado y recuperación.',
      'Recuperación o programación sin CPU existe solo en productos que la implementan; verificar puerto, archivo, revisión y secuencia en su manual.',
      'Tras actualizar, verificar versión, configuración base y arranque antes de perfiles. Velocidades y unidades dependen de plataforma; no usar cifras universales.',
    ],
    safetyLevel: 'ROJO_PELIGRO',
  },
  {
    id: 'mod11',
    moduleNumber: '11',
    title: 'DIAGNÓSTICO DEL PROCESADOR (CPU)',
    subtitle: 'Sockets LGA vs PGA, pines doblados, alineación con triángulo y thermal throttling',
    categoryTag: 'UNIDAD DE PROCESAMIENTO',
    readTime: '13 min',
    decisionTree: {
      question: '¿Los pines del socket (LGA) o del procesador (PGA) presentan alguna deformación visible bajo lupa y linterna?',
      yesAction: 'Detener manipulación y derivar contactos deformados a servicio especializado. No intentar reparación con aguja como práctica general.',
      noAction: 'No se observó daño visible; no acredita continuidad o salud interna. Contrastar soporte, alimentación y montaje.',
    },
    bancoTool: 'Lupa de relojero con luz LED + Pinzas de precisión antimagnéticas.',
    keyTakeaways: [
      'Diferencia fundamental: LGA (Intel moderno y AMD AM5, pines en la placa madre) vs PGA (AMD AM4 y anteriores, pines en el chip).',
      'El triángulo dorado: La marca en una de las esquinas del sustrato debe coincidir exactamente con el triángulo grabado en el socket; no requiere ninguna fuerza para calzar.',
      'Throttling depende de CPU, límites, carga, montaje y firmware. Temperatura, tiempo y frecuencia no son universales; interpretar sensores y flags con el modelo exacto.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod12',
    moduleNumber: '12',
    title: 'SISTEMA DE REFRIGERACIÓN Y FLUJO DE AIRE',
    subtitle: 'Coolers de aire vs líquida, curvas de ventiladores PWM, pasta térmica y presión de aire',
    categoryTag: 'TERMODINÁMICA DE PC',
    readTime: '11 min',
    decisionTree: {
      question: '¿El ventilador de la CPU gira a velocidad máxima pero las temperaturas superan los 90°C en reposo?',
      yesAction: 'Detener la carga, retirar alimentación y revisar montaje, interfaz, flujo y condiciones del sensor según el modelo; no adjudicar causa por un solo valor.',
      noAction: 'Comparar carga, ambiente, potencia y límites; una temperatura aislada baja no certifica estabilidad.',
    },
    bancoTool: 'Alcohol isopropílico + Pasta térmica de calidad + Pincel antiestático.',
    keyTakeaways: [
      'El error clásico número uno en armados: Olvidar retirar el film plástico transparente que cubre la base de cobre del disipador de fábrica.',
      'Flujo y presión dependen de caudal, restricción y control, no solo de contar ventiladores. Filtros y entradas bien ubicados pueden reducir polvo sin eliminarlo por completo.',
      'CPU_FAN y headers de bomba tienen funciones y límites de corriente específicos. Seguir manual de placa y refrigeración; RPM no verifica caudal ni transferencia térmica.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod13',
    moduleNumber: '13',
    title: 'PLACA DE VIDEO (GPU) DEDICADA',
    subtitle: 'Pistas PCIe, conector de retención, artefactos gráficos (VRAM) y prueba cruzada',
    categoryTag: 'PROCESAMIENTO GRÁFICO',
    readTime: '13 min',
    decisionTree: {
      question: '¿Aparecen líneas de colores, cuadros distorsionados o píxeles verdes en la pantalla incluso antes de cargar Windows (en el setup del BIOS)?',
      yesAction: 'Acota algunas causas de software, pero falta contrastar pantalla, cable, puerto, alimentación y tarjeta antes de atribuir daño interno.',
      noAction: 'Registrar modo, aplicación, controlador y contexto; evitar estrés agresivo o reinstalaciones antes de descartar riesgos y ruta externa.',
    },
    bancoTool: 'GPU conocida buena de banco para prueba cruzada + HWiNFO64 para telemetría.',
    keyTakeaways: [
      'El clip de retención del slot PCIe: Jamás tires de la placa de video hacia arriba sin haber presionado la traba plástica al final del slot; podrías arrancar el slot del PCB de la placa madre.',
      'Alimentación auxiliar: cumplir conectores, cables y capacidad especificados por fabricantes de GPU y fuente; no aplicar un umbral universal de vatios ni mezclar cables modulares.',
      'Prueba con video integrado: Si el microprocesador tiene iGPU, retirar la placa de video y conectar el monitor a la placa madre para confirmar si la máquina bootea.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod14',
    moduleNumber: '14',
    title: 'INSPECCIÓN PERICIAL DE MOTHERBOARD',
    subtitle: 'Capacitores hinchados, VRM quemados, sulfato por humedad y cortos a chasis',
    categoryTag: 'CIRCUITOS IMPRESOS (PCB)',
    readTime: '14 min',
    decisionTree: {
      question: '¿La placa presenta olor a quemado, manchas oscuras alrededor de los MOSFETs de la CPU o capacitores electrolíticos abombados?',
      yesAction: 'Daño físico en etapas de potencia. Detener pruebas y remitir a laboratorio de micro-electrónica.',
      noAction: 'Inspeccionar que no haya separadores de metal (standoffs) de sobra tocando pistas detrás del motherboard.',
    },
    bancoTool: 'Linterna LED de inspección con luz fría + Lupa de 10x.',
    keyTakeaways: [
      'El separador asesino: Dejar un poste separador de bronce en una posición donde la placa madre no tiene agujero de tornillo hace contacto directo con las pistas traseras provocando corto.',
      'Capacitores sólidos también pueden fallar sin signo visible. Apariencia normal no acredita VRM sano; resistencia baja de un riel tampoco confirma un corto por sí sola.',
      'Falso contacto en el conector ATX de 24 pines: Comprobar que los terminales hembra no estén ensanchados ni quemados por calentamiento de corriente.',
    ],
    safetyLevel: 'ROJO_PELIGRO',
  },
  {
    id: 'mod15',
    moduleNumber: '15',
    title: 'UNIDADES DE ALMACENAMIENTO (HDD / SSD / NVMe)',
    subtitle: 'Diagnóstico SMART con CrystalDiskInfo, sectores reasignados y rescate de datos',
    categoryTag: 'INTEGRIDAD DE DATOS',
    readTime: '12 min',
    decisionTree: {
      question: '¿Hay indicios de errores de lectura, desconexiones o salud degradada interpretados para ese modelo e interfaz?',
      yesAction: 'Priorizar datos: reducir actividad, acordar copia/imagen controlada o derivación según estado y criticidad. No reparar escribiendo sobre el original sospechoso.',
      noAction: 'SMART favorable o no disponible no certifica salud. Separar detección, lectura, cifrado y arranque sin descartar todavía falla física.',
    },
    bancoTool: 'Enclosure USB a SATA / NVMe + CrystalDiskInfo portátil.',
    keyTakeaways: [
      'Ruido anormal, desconexión o lectura deteriorada requieren preservar datos y evaluar derivación; el sonido solo no identifica el componente mecánico culpable.',
      'M.2 es un formato; SATA/NVMe y soporte del puerto/puente deben comprobarse. Límites térmicos y comportamiento dependen del modelo, no de una temperatura universal.',
      'Cable, alimentación y puente USB pueden alterar detección o acceso a registros. Cambiar una variable compatible por vez; no inventar porcentajes de falla.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod16',
    moduleNumber: '16',
    title: 'ENCIENDE Y SE APAGA A LOS 3 SEGUNDOS',
    subtitle: 'El bucle de protección: corto en 12V EPS, problemas de BIOS o protección OCP',
    categoryTag: 'BUCLE DE PROTECCIÓN',
    readTime: '11 min',
    decisionTree: {
      question: '¿Al desconectar únicamente el conector de 8 pines de la CPU (EPS 12V) la PC enciende y se mantiene con los ventiladores girando?',
      yesAction: 'Cortocircuito confirmado en la etapa VRM del procesador (uno de los MOSFETs de alta del procesador está perforado a tierra).',
      noAction: 'El corto está en el riel de 24 pines, en la fuente o en un periférico USB en cortocircuito.',
    },
    bancoTool: 'Multímetro en continuidad (probar resistencia entre pin de 12V de CPU y GND).',
    multimeterMode: 'Modo Continuidad/Diodo: Puntas entre los pines de 12V y tierra del conector EPS. Si pita con resistencia menor a 5 ohms, hay corto directo.',
    keyTakeaways: [
      'Cómo actúan las protecciones de la fuente: SCP (Short Circuit Protection) corta la alimentación en milisegundos para evitar que los cables se prendan fuego ante un corto.',
      'Puertos USB frontales destruidos: Una lámina de plástico rota dentro de un puerto USB puede hacer que los pines de +5V toquen el chasis metálico provocando el apagado instantáneo.',
      'Aislamiento progresivo: Desconectar todos los cables de datos, ventiladores auxiliares y placas de expansión hasta dejar solo CPU, un stick de RAM y fuente.',
    ],
    safetyLevel: 'ROJO_PELIGRO',
  },
  {
    id: 'mod17',
    moduleNumber: '17',
    title: 'ENCIENDE PERO NO ARRANCA EL SISTEMA',
    subtitle: 'POST exitoso pero sin Windows: orden de booteo, particiones EFI corruptas y BCD',
    categoryTag: 'RECUPERACIÓN DE ARRANQUE',
    readTime: '10 min',
    decisionTree: {
      question: '¿El BIOS detecta físicamente el disco en la lista de dispositivos de almacenamiento pero no aparece la opción "Windows Boot Manager"?',
      yesAction: 'La partición EFI (FAT32) de arranque fue borrada o está corrupta. Reconstruir con bcdboot desde un medio de instalación.',
      noAction: 'El disco no está siendo reconocido físicamente por la placa madre: revisar cable, conector M.2 o compatibilidad CSM.',
    },
    bancoTool: 'Pendrive booteable de instalación de Windows 11 para abrir la consola de comandos.',
    practicalCommand: 'diskpart -> select disk 0 -> list partition ; bcdboot C:\\Windows /l es-es',
    keyTakeaways: [
      'Modo CSM (Legacy) vs UEFI nativo: Si un Windows fue instalado en modo UEFI (GPT), al activar el modo CSM o desactivar UEFI el sistema no encontrará el sector de arranque.',
      'Partición EFI oculta: En sistemas UEFI, Windows no arranca desde la partición C:; arranca desde una partición de 100MB formateada en FAT32 que alberga el archivo bootmgfw.efi.',
      'El comando bcdboot salvador: bcdboot C:\\Windows /s S: /f UEFI copia los archivos de booteo desde la instalación de Windows hacia la partición del sistema EFI.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod18',
    moduleNumber: '18',
    title: 'CREACIÓN DEL PENDRIVE DE RESCATE',
    subtitle: 'Herramienta de creación de medios, Rufus, particionado GPT y utilidades esenciales',
    categoryTag: 'HERRAMIENTA DIGITAL',
    readTime: '9 min',
    decisionTree: {
      question: '¿El pendrive fue grabado en esquema de partición GPT para equipos UEFI?',
      yesAction: 'Listo para iniciar en cualquier placa madre moderna con Secure Boot activo.',
      noAction: 'Si fue grabado en MBR para BIOS Legacy, no será detectado por placas madre UEFI con CSM desactivado.',
    },
    bancoTool: 'Pendrive USB 3.0 de 32GB de marca reconocida (Kingston, SanDisk).',
    keyTakeaways: [
      'Configuración de Rufus para equipos modernos: Esquema de partición: GPT; Sistema de destino: UEFI (no CSM); Sistema de archivos: FAT32.',
      'Ventoy como navaja suiza: Permite tener 10 imágenes ISO en el mismo pendrive (Windows 10, Windows 11, MemTest86, Clonezilla, Ubuntu Live) simplemente copiándolas.',
      'La carpeta de herramientas portátiles: Incluir en el pendrive HWiNFO64, CrystalDiskInfo, BlueScreenView, DDU y drivers de red LAN básicos.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod19',
    moduleNumber: '19',
    title: 'PARTICIONES: DISCO ≠ PARTICIÓN ≠ VOLUMEN',
    subtitle: 'El mapa de particiones de Windows: EFI, MSR, Sistema C: y Recuperación WinRE',
    categoryTag: 'TOPOLOGÍA DE DISCO',
    readTime: '11 min',
    decisionTree: {
      question: '¿Entendés qué contiene cada partición antes de presionar "Eliminar" en el instalador de Windows?',
      yesAction: 'Proceder con el particionado respetando unidades secundarias de datos.',
      noAction: 'ALTO. Desconectar físicamente todos los discos secundarios antes de instalar para no borrar nada por error.',
    },
    bancoTool: 'Comando diskpart de Windows.',
    practicalCommand: 'Get-Disk | Select Number, FriendlyName, PartitionStyle, TotalSize',
    keyTakeaways: [
      'Las 4 particiones de una instalación GPT limpia: 1. Partición del sistema EFI (100MB), 2. Partición reservada de Microsoft MSR (16MB), 3. Partición de datos C:, 4. Partición de recuperación WinRE (600MB).',
      'El peligro de los discos secundarios conectados: Si tenés dos discos conectados durante la instalación, el instalador puede poner los archivos de booteo en el disco secundario.',
      'Diferencia entre formatear y borrar particiones: Formatear borra los archivos de un volumen existente; eliminar borra la estructura de la tabla de particiones.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod20',
    moduleNumber: '20',
    title: 'FORMATEAR NO ES UNA SOLA COSA',
    subtitle: 'Reset de fábrica, reparación in-place, borrado de particiones y cuándo formatear',
    categoryTag: 'NIVELES DE RESTAURACIÓN',
    readTime: '10 min',
    decisionTree: {
      question: '¿La falla es provocada por corrupción de archivos de sistema pero los programas instalados funcionan bien?',
      yesAction: 'Ejecutar una instalación de reparación In-Place (Upgrade sin pérdida de datos).',
      noAction: 'Si el sistema tiene malware persistente o controladores incompatibles arraigados, hacer instalación limpia desde cero.',
    },
    bancoTool: 'ISO oficial de Windows montada como unidad virtual.',
    keyTakeaways: [
      'El botón "Restablecer este equipo": En muchas ocasiones arrastra los mismos errores si la partición de recuperación local estaba dañada; no sustituye una instalación limpia con pendrive.',
      'Reparación In-Place: Montar la ISO oficial de Windows, ejecutar setup.exe y seleccionar "Conservar archivos personales y aplicaciones"; reemplaza el 100% de los archivos del kernel.',
      'Cuándo el formateo no sirve: Si la PC se cuelga por problemas térmicos, de fuente o de RAM, formatear no resolverá el problema y te dejará con una máquina sin sistema.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod21',
    moduleNumber: '21',
    title: 'PROTOCOLO DE BACKUP EXHAUSTIVO',
    subtitle: 'Qué carpetas salvar antes de tocar nada: perfiles, AppData, navegadores y licencias',
    categoryTag: 'PRESERVACIÓN DE INFORMACIÓN',
    readTime: '11 min',
    decisionTree: {
      question: '¿Verificaste que el usuario no guardaba fotos en carpetas insólitas como C:\\Archivos o la raíz de C:?',
      yesAction: 'Hacer una búsqueda de archivos por extensión (.docx, .pdf, .jpg, .xlsx) en toda la unidad.',
      noAction: 'Preguntar al usuario explícitamente qué carpetas personalizadas utilizaba fuera del perfil estándar.',
    },
    bancoTool: 'Disco rígido externo de respaldo formateado en NTFS.',
    keyTakeaways: [
      'El checklist de carpetas de perfil (C:\\Users\\Nombre): Escritorio, Documentos, Descargas, Imágenes, Videos, Música.',
      'El tesoro oculto en AppData: Guardar C:\\Users\\Nombre\\AppData\\Roaming para conservar marcadores de navegadores no sincronizados, configuraciones de Outlook (.pst) y partidas guardadas.',
      'Licencias vinculadas: Comprobar en Configuración -> Activación si la licencia de Windows está vinculada digitalmente a la cuenta de Microsoft o al firmware de la placa madre.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod22',
    moduleNumber: '22',
    title: 'INSTALACIÓN PASO A PASO DE WINDOWS',
    subtitle: 'Configuración de BIOS previa, booteo de USB, selección de edición y primer inicio',
    categoryTag: 'DESPLIEGUE PROFESIONAL',
    readTime: '12 min',
    decisionTree: {
      question: '¿Confirmaste por modelo, capacidad e identificador que es el disco correcto y verificaste un respaldo recuperable antes de modificar particiones?',
      yesAction: 'Con consentimiento y respaldo verificado, seleccionar el destino correcto y comprobar el esquema de particiones recomendado por el fabricante.',
      noAction: 'Detener la instalación: no borrar particiones hasta identificar el contenido y comprobar respaldo, claves de cifrado y autorización explícita.',
    },
    bancoTool: 'Pendrive USB de instalación oficial de Windows.',
    keyTakeaways: [
      'Configuración previa en el BIOS: Secure Boot habilitado, TPM 2.0 activo, modo SATA en AHCI / NVMe, deshabilitar CSM.',
      'Atajo para evitar crear cuenta de Microsoft obligatoria (si el cliente lo requiere): Shift + F10 en la pantalla de selección de país y ejecutar OOBE\\BYPASSNRO.',
      'Evitar bloatware de marca: No conectar el cable de internet durante los primeros 5 minutos para que Windows no comience a descargar aplicaciones promocionales de la tienda.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod23',
    moduleNumber: '23',
    title: 'INSTALACIÓN DE CONTROLADORES EN ORDEN',
    subtitle: 'Identificar hardware y dependencias: chipset, red, video y audio con controladores oficiales',
    categoryTag: 'ESTABILIDAD DEL HARDWARE',
    readTime: '11 min',
    decisionTree: {
      question: '¿Instalaste el controlador de Chipset / Intel Management Engine antes de instalar el de la tarjeta gráfica?',
      yesAction: 'Correcto: la placa madre ya sabe cómo dialogar con las líneas PCIe y los buses del procesador.',
      noAction: 'Detener: instalar primero el INF del chipset para garantizar el correcto mapeo de interrupciones.',
    },
    bancoTool: 'Controladores descargados directamente de la página oficial del fabricante de la placa madre.',
    keyTakeaways: [
      'Instalar controladores conforme a las dependencias y recomendaciones oficiales del fabricante. Los INF de chipset suelen describir dispositivos existentes, no garantizan que otros controladores fallen si se instalan antes.',
      'El mito de los "Drivers universales de Windows": El controlador básico de video de Microsoft no tiene aceleración 3D ni control de ventiladores; el driver oficial de NVIDIA/AMD es obligatorio.',
      'Identificación por Hardware ID: En el Administrador de Dispositivos -> Propiedades -> Detalles -> Id. de hardware para descubrir el fabricante de dispositivos desconocidos.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod24',
    moduleNumber: '24',
    title: 'CONFIGURACIÓN DE WINDOWS UPDATE',
    subtitle: 'Actualizaciones de calidad vs actualizaciones opcionales y control de reinicios',
    categoryTag: 'ACTUALIZACIÓN SEGURA',
    readTime: '9 min',
    decisionTree: {
      question: '¿Windows Update está intentando instalar un controlador de video antiguo encima de tu controlador oficial recién instalado?',
      yesAction: 'Bloquear la actualización de controladores mediante directivas de grupo local (gpedit.msc) o la utilidad Show/Hide Updates.',
      noAction: 'Dejar que Windows Update complete las actualizaciones acumulativas de seguridad (LCU).',
    },
    bancoTool: 'Editor de directivas de grupo local (gpedit.msc).',
    practicalCommand: 'Get-WindowsUpdateLog',
    keyTakeaways: [
      'Pestaña "Actualizaciones opcionales": Ahí residen los parches de firmware y controladores de terceros que Microsoft no fuerza de forma automática.',
      'Horas activas: Configurar un rango de 18 horas para garantizar que la máquina no se reinicie sola en medio de una sesión de trabajo.',
      'Punto de control: Reiniciar la PC dos veces tras finalizar una tanda grande de actualizaciones para asegurar que todos los paquetes pasen del estado "Staging" a "Installed".',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod25',
    moduleNumber: '25',
    title: 'LA PC ESTÁ LENTA: ÁRBOL DE SATURACIÓN',
    subtitle: 'CPU al 100%, RAM al límite, disco al 100% o cuello de botella térmico',
    categoryTag: 'PERITAJE DE RENDIMIENTO',
    readTime: '13 min',
    decisionTree: {
      question: '¿Qué componente marca 100% de uso constante en la pestaña Rendimiento del Administrador de Tareas en reposo?',
      yesAction: 'Disco = SysMain o disco con sectores malos; CPU = proceso en bucle o malware; RAM = memory leak o escasez de memoria física.',
      noAction: 'Si ningún componente está al 100%, comprobar con HWiNFO64 si la CPU está sufriendo Thermal Throttling a 800 MHz.',
    },
    bancoTool: 'Administrador de Tareas + Resource Monitor + HWiNFO64.',
    keyTakeaways: [
      'El síntoma no es la causa: Una PC lenta no se arregla pasando un antivirus al azar; se arregla midiendo qué recurso de hardware está saturado.',
      'La trampa del procesador a 0.79 GHz: Típico síntoma de señal PROCHOT trabada en falso o disipador con anclaje quebrado donde la CPU se protege a sí misma.',
      'Antivirus dobles en conflicto: Tener dos soluciones antivirus activas al mismo tiempo (ej: McAfee y Avast) satura el subsistema de I/O de archivos.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod26',
    moduleNumber: '26',
    title: 'LA PC SE CONGELA POR COMPLETO',
    subtitle: 'Árbol diagnóstico: congelamiento con audio en bucle vs congelamiento con cursor móvil',
    categoryTag: 'BLOQUEO DEL SISTEMA',
    readTime: '12 min',
    decisionTree: {
      question: '¿Durante el congelamiento el cursor del ratón aún se mueve en la pantalla?',
      yesAction: 'El kernel responde. El congelamiento es de I/O de disco (SSD que se desconecta por firmware o cable SATA defectuoso).',
      noAction: 'Congelamiento total con cursor inmóvil: falla de interrupción de hardware en CPU, placa madre o memoria RAM.',
    },
    bancoTool: 'Visor de Eventos de Windows (eventvwr.msc) -> Registros de Windows -> Sistema.',
    keyTakeaways: [
      'Congelamiento con zumbido de audio ("trrrrr"): Ocurre cuando el buffer de la tarjeta de sonido repite los últimos milisegundos porque la CPU dejó de procesar interrupciones.',
      'Inspección del Visor de Eventos: Buscar eventos críticos ID 41 (Kernel-Power) y advertencias previas de WHEA-Logger (errores de arquitectura de hardware corregidos o fatales).',
      'Voltaje insuficiente de SoC / VDDQ: En plataformas DDR4 y DDR5, perfiles XMP agresivos pueden requerir un ligero ajuste de voltaje para evitar congelamientos aleatorios.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod27',
    moduleNumber: '27',
    title: 'LA COMPUTADORA SE REINICIA SOLA',
    subtitle: 'Reinicio súbito sin pantalla azul vs reinicio con mensaje: fuente, temperatura o VRM',
    categoryTag: 'INESTABILIDAD CRÍTICA',
    readTime: '11 min',
    decisionTree: {
      question: '¿La PC se apaga o reinicia instantáneamente como si le hubieran cortado la luz al someterla a carga de juegos o benchmarks pesados?',
      yesAction: 'La fuente de poder no soporta los picos de consumo transitorios (transient spikes) de la GPU y activa su protección OPP.',
      noAction: 'Si se reinicia de manera aleatoria incluso navegando en internet, verificar estabilidad de la RAM y temperaturas del VRM.',
    },
    bancoTool: 'Software OCCT o FurMark para pruebas de consumo de energía.',
    keyTakeaways: [
      'Desactivar el "Reinicio automático ante error": En sysdm.cpl -> Opciones avanzadas -> Inicio y recuperación -> Desmarcar "Reiniciar automáticamente" para poder ver el código BSOD.',
      'Picos transitorios de las tarjetas gráficas: Las GPUs modernas pueden exigir el doble de su TDP durante fracciones de milisegundo; fuentes genéricas no lo toleran.',
      'Sobrecalentamiento del circuito VRM de la placa madre: Si las fases de poder de la CPU no tienen disipador y superan los 115°C, la placa madre ordena el apagado de emergencia.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod28',
    moduleNumber: '28',
    title: 'DESMITIFICANDO LA PANTALLA AZUL (BSOD)',
    subtitle: 'Lectura de volcados con BlueScreenView, códigos STOP y correlación con drivers',
    categoryTag: 'DEPURACIÓN DE KERNEL',
    readTime: '14 min',
    decisionTree: {
      question: '¿El archivo minidump en C:\\Windows\\Minidump apunta a un controlador específico (ej: nvlddmkm.sys, ntoskrnl.exe o rt640x64.sys)?',
      yesAction: 'nvlddmkm.sys = controlador de video NVIDIA; rt640x64.sys = controlador de red Realtek. Reinstalar ese driver puntual.',
      noAction: 'Si apunta genéricamente a ntoskrnl.exe con código MEMORY_MANAGEMENT, ejecutar MemTest86 a la memoria RAM.',
    },
    bancoTool: 'BlueScreenView o WinDbg (Windows Debugger).',
    practicalCommand: 'Get-ChildItem C:\\Windows\\Minidump',
    keyTakeaways: [
      'Códigos STOP fundamentales: KMODE_EXCEPTION_NOT_HANDLED, SYSTEM_SERVICE_EXCEPTION, IRQL_NOT_LESS_OR_EQUAL, CRITICAL_PROCESS_DIED, PAGE_FAULT_IN_NONPAGED_AREA.',
      'El mito de culpar siempre al software: Una pantalla azul provocada por un driver suele ocurrir porque la memoria física donde el driver intentó escribir tenía un bit defectuoso.',
      'Configuración de volcados: Asegurar que Windows tenga configurado el volcado como "Volcado de memoria pequeño (256 KB)" para un análisis rápido.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod29',
    moduleNumber: '29',
    title: 'SEGURIDAD Y REMOCIÓN DE MALWARE',
    subtitle: 'Windows Defender bien configurado, análisis sin conexión y purga de extensiones',
    categoryTag: 'DESINFECCIÓN DEL SISTEMA',
    readTime: '10 min',
    decisionTree: {
      question: '¿El navegador abre ventanas de publicidad por sí solo o redirige a motores de búsqueda extraños?',
      yesAction: 'Revisar las extensiones instaladas en el navegador y los accesos directos adulterados en el escritorio.',
      noAction: 'Ejecutar un análisis sin conexión con Microsoft Defender Offline para desinfectar antes de que cargue el kernel.',
    },
    bancoTool: 'Microsoft Defender Offline + Malwarebytes Free.',
    keyTakeaways: [
      'Análisis sin conexión: Microsoft Defender Offline reinicia la PC en un entorno WinPE donde el malware no puede ocultarse en memoria ni bloquear su propia eliminación.',
      'La trampa del acceso directo adulterado: El malware no toca el ejecutable del navegador; le agrega un parámetro a la URL de inicio en el acceso directo de Chrome.',
      'Auditoría de tareas programadas sospechosas: Muchos mineros de criptomonedas se reactivan mediante tareas en el Programador de Tareas.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod30',
    moduleNumber: '30',
    title: 'LOS PROGRAMAS DEL REPARADOR DE BANCO',
    subtitle: 'HWiNFO64, CrystalDiskInfo, MemTest86, FurMark y Cinebench: qué demuestran y qué no',
    categoryTag: 'SUITE DE DIAGNÓSTICO',
    readTime: '11 min',
    decisionTree: {
      question: '¿Sabés interpretar los sensores de HWiNFO64 antes de considerar que una prueba de estrés fue exitosa?',
      yesAction: 'Monitorear temperaturas de unión (Tctl/Tdie), voltajes Vcore y caídas de frecuencia efectiva.',
      noAction: 'Aprender a leer los sensores en tiempo real antes de lanzar pruebas de estrés térmico.',
    },
    bancoTool: 'Suite portátil de herramientas de diagnóstico en pendrive.',
    keyTakeaways: [
      'HWiNFO puede registrar sensores y logs; comprobar sensor, unidad, intervalo y soporte. Una lectura informada por software tiene límites y no es una medición eléctrica independiente.',
      'Las pruebas de carga requieren hardware seguro, objetivo, límites y criterio de parada del modelo. No imponer duración universal ni hacer estrés ante alimentación o refrigeración dudosas.',
      'Elegir tarea representativa: renderizado, memoria, almacenamiento y gráficos ensayan condiciones distintas. Un benchmark no certifica todas las funciones del equipo.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod31',
    moduleNumber: '31',
    title: 'OPTIMIZACIÓN POST-REPARACIÓN',
    subtitle: 'Curvas de ventiladores silenciosas, perfiles de energía y verificación de estabilidad',
    categoryTag: 'ENTREGA PROFESIONAL',
    readTime: '10 min',
    decisionTree: {
      question: '¿Se verificaron el síntoma original, la configuración definitiva, los datos y las funciones acordadas bajo condiciones documentadas?',
      yesAction: 'Registrar resultados, alcance, limitaciones y conformidad; una prueba finita no garantiza estabilidad ilimitada.',
      noAction: 'Mantener el cierre pendiente, identificar qué falta y repetir pruebas relevantes sin cambios arbitrarios.',
    },
    bancoTool: 'Setup del BIOS -> Menú Q-Fan / Smart Fan.',
    keyTakeaways: [
      'Curvas y límites se ajustan según CPU, cooler, placa, ambiente y carga; no copiar porcentajes o temperaturas universales como criterio de reparación.',
      'No añadir optimizaciones como ReBAR o perfiles durante la verificación de una reparación: introducen variables. Probarlas por separado si están soportadas y autorizadas.',
      'Comprobación final del Administrador de Dispositivos: Asegurar que no quede ningún triángulo amarillo de dispositivo desconocido antes de entregar la máquina.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod32',
    moduleNumber: '32',
    title: 'CASOS DIDÁCTICOS DE TALLER EVO',
    subtitle: '5 expedientes reales de reparación resueltos con el método deductivo',
    categoryTag: 'HISTORIAL DE BANCO',
    readTime: '15 min',
    decisionTree: {
      question: '¿Reconocés el patrón de falla antes de leer la resolución técnica del expediente?',
      yesAction: 'Comparar tu hipótesis con la evidencia registrada en el parte de servicio.',
      noAction: 'Estudiar cómo la medición con multímetro descartó causas costosas.',
    },
    bancoTool: 'Expedientes de servicio técnico de banco.',
    keyTakeaways: [
      'Caso A: La PC gamer que se reiniciaba al entrar a la partida resuelta por cable PCIe compartido en lugar de dos cables separados.',
      'Caso B: Pantalla negra con Debug LED en CPU provocado por presión asimétrica de los tornillos del disipador de torre.',
      'Caso C: Arranque intermitente que borraba la hora resuelto por reemplazo de pila CR2032 de 2.4V.',
      'Caso D: Disco NVMe no detectado resuelto por actualización de BIOS con soporte para SSDs PCIe 4.0.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod33',
    moduleNumber: '33',
    title: 'EL BANCO FINAL: MÁQUINA DESCONOCIDA',
    subtitle: 'Simulacro pericial completo: una PC desconocida llega al taller sin historial previo',
    categoryTag: 'EXAMEN DE COMPETENCIA',
    readTime: '12 min',
    decisionTree: {
      question: '¿Seguiste la lista de chequeo visual externa antes de conectar el cable de corriente?',
      yesAction: 'Inspección de tensión del selector de fuente (115V vs 230V), puertos rotos y componentes sueltos.',
      noAction: 'ALTO. Conectar una máquina en 115V a una red de 220V quemará la fuente instantáneamente.',
    },
    bancoTool: 'Lista de verificación pericial de ingreso.',
    keyTakeaways: [
      'El selector de voltaje rojo en fuentes antiguas: Comprobar siempre que esté en 230V antes de enchufar a la red eléctrica.',
      'La primera inspección con tapa abierta: Verificar que los módulos de memoria estén completamente insertados y que la placa gráfica no esté combada (sag).',
      'El encendido controlado: Mantener la mano en el interruptor de la zapatilla por si hay que cortar la energía ante la menor señal de humo o chispa.',
    ],
    safetyLevel: 'AMARILLO_PRECAUCION',
  },
  {
    id: 'mod34',
    moduleNumber: '34',
    title: 'PARTE DE SERVICIO PROFESIONAL IMPRIMIBLE',
    subtitle: 'La planilla técnica oficial que protege al reparador y da tranquilidad al cliente',
    categoryTag: 'DOCUMENTACIÓN DE TALLER',
    readTime: '8 min',
    decisionTree: {
      question: '¿El parte documenta el estado físico en que ingresó el equipo, rayones previos y accesorios entregados?',
      yesAction: 'Firma de conformidad del cliente al recibir y al retirar.',
      noAction: 'Completar el parte antes de que el cliente abandone el local.',
    },
    bancoTool: 'Plantilla de Parte de Servicio EVO impresa.',
    keyTakeaways: [
      'Campos obligatorios del parte: Datos del cliente, modelo exacto de componentes, síntoma manifestado, diagnóstico comprobado, piezas reemplazadas y garantía otorgada.',
      'Acordar autorización, alcance y plan de preservación antes de intervenir; registrar si existe copia verificada y qué no pudo respaldarse, sin incluir claves ni datos personales innecesarios.',
      'La entrega con evidencia: Adjuntar capturas de CrystalDiskInfo y temperaturas finales validadas.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
  {
    id: 'mod35',
    moduleNumber: '35',
    title: 'GLOSARIO + FUENTES OFICIALES + CONTRATAPA',
    subtitle: 'Vocabulario técnico de taller, normas JEDEC, PCI-SIG y cierre editorial',
    categoryTag: 'REFERENCIA PERMANENTE',
    readTime: '10 min',
    decisionTree: {
      question: '¿Consultaste los manuales técnicos oficiales de placa madre antes de dar un veredicto?',
      yesAction: 'Verificación contra la tabla de compatibilidad QVL del fabricante.',
      noAction: 'Descargar el PDF oficial del modelo exacto de placa madre.',
    },
    bancoTool: 'Documentación técnica de Intel, AMD, ASUS, MSI, Gigabyte y ASRock.',
    keyTakeaways: [
      'Glosario de taller: VRM, MOSFET, Choke, Diodo Schottky, Puente Rectificador, Ripple, Post, QVL, XMP, EXPO, Standby, Loop de inicio.',
      'Fuentes confiables: Normas JEDEC para memorias, especificaciones ATX 3.0 de Intel, bases de datos de hardware TechPowerUp.',
      'Contratapa coleccionable Tomo 03: Tu acreditación como reparador de PCs de escritorio con método EVO.',
    ],
    safetyLevel: 'VERDE_SEGURO',
  },
];

export const TOMO_03_CASES: Tomo03Case[] = [
  {
    id: 'c01',
    title: 'La PC Gamer que se apagaba de golpe en pleno combate',
    symptom: 'Al estar en el menú del juego todo funcionaba normal, pero a los 2 minutos de iniciar la partida la PC se apagaba por completo.',
    hypothesis: 'Sobrecalentamiento crítico de la CPU o falla de la fuente de alimentación bajo carga transitoria.',
    measurement: 'Temperaturas de CPU a 68°C y GPU a 72°C (dentro de rango normal). Medición de voltaje del riel de 12V con multímetro: caía a 11.1V antes del apagado.',
    discarded: 'Refrigeración descartada (temperaturas sanas); memoria RAM descartada (sin pantallas azules).',
    rootCause: 'La tarjeta gráfica consumía 280W y estaba conectada con un solo cable bifurcado (daisy-chain) desde una fuente genérica con riel de 12V dividido.',
    repairAction: 'Instalación de fuente de poder certificada 80 Plus Gold de 750W con dos cables PCIe independientes.',
    validation: 'Prueba de estrés combinada de FurMark + Prime95 durante 45 minutos sin caída de voltaje (12.04V estables).',
  },
  {
    id: 'c02',
    title: 'Pantalla negra con Debug LED encendido en "DRAM"',
    symptom: 'La máquina encendía todos los ventiladores y luces RGB, pero no daba video y el LED de diagnóstico de memoria quedaba en color naranja fijo.',
    hypothesis: 'Uno o ambos módulos de memoria RAM DDR4 estaban dañados físicamente.',
    measurement: 'Prueba de cada módulo individual en la ranura A2: el módulo 1 booteaba perfecto, el módulo 2 no booteaba en ningún slot.',
    discarded: 'Motherboard y procesador descartados (el módulo 1 funcionó en todas las ranuras).',
    rootCause: 'El módulo 2 presentaba sulfato superficial en los contactos dorados centrales por humedad ambiental del ambiente.',
    repairAction: 'Limpieza minuciosa de los contactos con alcohol isopropílico al 99.8% y cepillo antiestático suave.',
    validation: 'El módulo 2 volvió a la vida; se instalaron ambos módulos en dual channel (slots A2 y B2) y superaron 4 pasadas de MemTest86 sin errores.',
  },
  {
    id: 'c03',
    title: 'El misterio de la PC que no encendía los lunes por la mañana',
    symptom: 'La máquina de una oficina funcionaba bien toda la semana, pero los lunes tras el fin de semana no encendía con el botón.',
    hypothesis: 'Falla intermitente en la placa madre o botón de encendido del gabinete falseado.',
    measurement: 'Medición de la pila botón CR2032 con multímetro: entregaba 2.1 Voltios (completamente agotada). La zapatilla de la oficina se cortaba los fines de semana.',
    discarded: 'Fuente de poder descartada (funcionaba perfecto al puentear).',
    rootCause: 'Al cortar la zapatilla, la placa madre dependía de la pila para mantener el RTC y la NVRAM; con 2.1V el chipset quedaba en estado de bloqueo lógico.',
    repairAction: 'Reemplazo de la batería por una CR2032 nueva de 3.2V y Clear CMOS manual.',
    validation: 'Desconexión de la zapatilla durante 48 horas continuas; al reconectar el lunes, el equipo encendió de inmediato conservando hora y configuración.',
  },
];

export interface Tomo03GlossaryItem {
  term: string;
  definition: string;
  category: string;
}

export const TOMO_03_GLOSSARY: Tomo03GlossaryItem[] = [
  {
    term: 'VRM (Voltage Regulator Module)',
    definition: 'Circuito convertidor reductor (Buck) compuesto por MOSFETs, bobinas chokes y capacitores que baja los +12V de la fuente a voltajes de 0.8V a 1.4V requeridos por la CPU.',
    category: 'ALIMENTACIÓN',
  },
  {
    term: 'MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor)',
    definition: 'Transistor de conmutación ultrarrápida (cientos de kHz) en el VRM. Si entra en cortocircuito entre drenador y fuente (D-S), la fuente activa protección OCP y no enciende.',
    category: 'SEMICONDUCTORES',
  },
  {
    term: 'Power Good (PWR_OK / PG)',
    definition: 'Señal digital enviada por el cable gris (pin 8) de la fuente a la placa madre (+5V) cuando los voltajes son estables. Si no llega, la placa mantiene al CPU en estado de Reset permanente.',
    category: 'SEÑALES DE CONTROL',
  },
  {
    term: 'PS_ON# (Power Supply On)',
    definition: 'Cable verde (pin 16). Está a nivel alto en reposo (3.3V-5V). Al tocar el botón del gabinete, la placa lo deriva a masa (0V) indicándole a la fuente que arranque.',
    category: 'SEÑALES DE CONTROL',
  },
  {
    term: 'Q-LED / Debug LEDs',
    definition: 'Conjunto de 4 micro LEDs en la placa (BOOT, VGA, DRAM, CPU) que indican en qué etapa del POST se detuvo la inicialización del hardware.',
    category: 'DIAGNÓSTICO',
  },
  {
    term: 'Beep Codes (Códigos de Buzzer)',
    definition: 'Secuencia de tonos audibles emitidos por el speaker piezoeléctrico. 1 largo y 2 o 3 cortos suelen indicar error en GPU o memoria RAM según el fabricante de la BIOS.',
    category: 'DIAGNÓSTICO',
  },
  {
    term: 'Clear CMOS / CLRTC',
    definition: 'Procedimiento para purgar la memoria volátil NVRAM donde se guardan configuraciones erróneas de overclocking, voltajes o timings de memoria.',
    category: 'RECUPERACIÓN',
  },
  {
    term: 'Rizado de Tensión (Ripple)',
    definition: 'Pequeñas oscilaciones residuales de corriente alterna montadas sobre el riel de corriente continua de la fuente. Si supera 120mV en 12V, corrompe datos en SSDs y crashea GPUs.',
    category: 'CALIDAD ELÉCTRICA',
  },
  {
    term: 'ESR (Equivalent Series Resistance)',
    definition: 'Resistencia parásita interna de los capacitores electrolíticos. Un capacitor con alta ESR no filtra el ruido eléctrico y causa reinicios aleatorios con carga.',
    category: 'COMPONENTES PASIVOS',
  },
  {
    term: '5VSB (+5V Standby)',
    definition: 'Cable violeta (pin 9). Voltaje permanente suministrado por la fuente incluso con la PC apagada para alimentar el circuito de encendido, USBs dormidos y tarjeta de red.',
    category: 'ALIMENTACIÓN',
  },
  {
    term: 'Thermal Throttling',
    definition: 'Mecanismo de autoprotección del silicio que reduce multiplicador de reloj y voltaje al superar umbrales térmicos (ej. 95°C-100°C en CPU/GPU) para evitar destrucción física.',
    category: 'GESTIÓN TÉRMICA',
  },
  {
    term: 'Coil Whine (Silbido de Bobina)',
    definition: 'Vibración mecánica de las espiras de una bobina choke en frecuencias audibles (kHz) producida por el campo magnético al circular altas intensidades de corriente.',
    category: 'ACÚSTICA & BANCO',
  },
];
