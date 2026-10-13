import {
  UserPcSpec,
  DiagnosticCase,
  DiagnosticHypothesis,
  DiagnosticSymptomCategory,
  DiagnosticTestRecord,
  DiagnosticInterventionProposal,
  DiagnosticOutcomeStatus,
} from '../../types';

export interface SymptomCardPreset {
  id: string;
  label: string;
  category: DiagnosticSymptomCategory;
  samplePrompt: string;
  hint: string;
}

export const FREQUENT_SYMPTOM_PRESETS: SymptomCardPreset[] = [
  {
    id: 'no-enciende',
    label: 'NO ENCIENDE',
    category: 'ENCENDIDO_SIN_VIDEO',
    samplePrompt: 'Presiono el botón de encendido y la PC no hace absolutamente nada, ningún ventilador ni luz.',
    hint: 'Alimentación, botón, fuente o placa base',
  },
  {
    id: 'sin-video',
    label: 'ENCIENDE PERO NO DA IMAGEN',
    category: 'ENCENDIDO_SIN_VIDEO',
    samplePrompt: 'Los ventiladores y luces encienden, pero el monitor queda en negro con "Sin señal".',
    hint: 'Monitor, cable, GPU, RAM o BIOS',
  },
  {
    id: 'fps-stutter',
    label: 'FPS ALTOS PERO SE TRABA',
    category: 'RENDIMIENTO_FPS_STUTTER',
    samplePrompt: 'Tengo más de 150 FPS en el contador pero el juego da microtirones constantes y se siente trabado.',
    hint: 'Frametime, 1% low, sincronización o procesos de fondo',
  },
  {
    id: 'reinicia',
    label: 'SE REINICIA',
    category: 'REINICIOS_BSOD_APAGADOS',
    samplePrompt: 'La PC se reinicia de golpe sin aviso previo, especialmente cuando juego o renderizo.',
    hint: 'Temperatura, fuente, memoria o kernel de Windows',
  },
  {
    id: 'arranque-lento',
    label: 'WINDOWS TARDA MUCHO',
    category: 'ARRANQUE_WINDOWS',
    samplePrompt: 'Desde que toco el botón hasta que puedo abrir una aplicación pasan varios minutos de lentitud.',
    hint: 'SSD/HDD, programas de inicio o servicios',
  },
  {
    id: 'disco-100',
    label: 'DISCO AL 100 %',
    category: 'DISCO_100',
    samplePrompt: 'El Administrador de tareas muestra el disco clavado al 100% de uso constante y todo se congela.',
    hint: 'Windows Search, SysMain, antivirus o disco mecánico',
  },
  {
    id: 'ram-no-detectada',
    label: 'NO DETECTA TODA LA RAM',
    category: 'RAM_NO_DETECTADA',
    samplePrompt: 'Tengo 16 GB físicos instalados en 2 módulos pero Windows reporta sólo 8 GB utilizables.',
    hint: 'Asentamiento de módulos, slots dual-channel o reserva hardware',
  },
  {
    id: 'lag-red',
    label: 'TENGO LAG',
    category: 'RED_LAG',
    samplePrompt: 'En juegos en línea mi personaje se teletransporta o las acciones tardan en responder.',
    hint: 'Ping, jitter, pérdida de paquetes o congestión Wi-Fi',
  },
  {
    id: 'juego-cierra',
    label: 'JUEGO SE CIERRA',
    category: 'JUEGO_CIERRA',
    samplePrompt: 'El juego se cierra de golpe al escritorio sin ningún mensaje de error tras unos minutos.',
    hint: 'VRAM, driver gráfico, memoria virtual o DirectX',
  },
  {
    id: 'tras-update',
    label: 'EMPEZÓ TRAS ACTUALIZACIÓN',
    category: 'FALLO_TRAS_ACTUALIZACION',
    samplePrompt: 'El problema apareció exactamente después de que Windows o el driver de placa se actualizó ayer.',
    hint: 'Historial de Windows Update, driver conflictivo o punto de restauración',
  },
  {
    id: 'otro',
    label: 'OTRO',
    category: 'OTRO',
    samplePrompt: 'Tengo un comportamiento extraño en mi PC que no sé clasificar técnicamente.',
    hint: 'Investigación abierta paso a paso',
  },
];

// Safety halt check
export function detectSafetyHalt(text: string): { isHazard: boolean; reason: string } {
  const lower = text.toLowerCase();
  const hazards = [
    { words: ['humo', 'sale humo'], reason: 'Presencia de humo en el equipo' },
    { words: ['olor a quemado', 'olor a plastico quemado', 'huele a quemado', 'quemado'], reason: 'Olor a quemado o sobrecalentamiento extremo de aislación' },
    { words: ['chispa', 'chispas', 'chispazo'], reason: 'Chispas o arco eléctrico visible' },
    { words: ['líquido', 'liquido', 'se me cayó agua', 'derrame', 'mojado'], reason: 'Ingreso o presencia de líquido conductor en componentes electrónicos' },
    { words: ['batería inflada', 'bateria inflada', 'bateria hinchada', 'batería hinchada'], reason: 'Batería con deformación química o riesgo de ignición' },
    { words: ['cable derretido', 'derretido', 'plástico derretido'], reason: 'Cable o conector con daño térmico severo' },
    { words: ['descarga eléctrica', 'pateo', 'patada electrica', 'corriente en el gabinete'], reason: 'Fuga de corriente a tierra o falla de aislamiento en el chasis' },
  ];

  for (const h of hazards) {
    if (h.words.some((w) => lower.includes(w))) {
      return { isHazard: true, reason: h.reason };
    }
  }
  return { isHazard: false, reason: '' };
}

// Symptom classification & analysis
export function analyzeSymptom(text: string): {
  category: DiagnosticSymptomCategory;
  symptom: string;
  context: string;
  pattern: string;
  cause: 'NO DETERMINADA';
  humanSummary: string;
  declaredFacts: string[];
  unknownData: string[];
} {
  const lower = text.toLowerCase();

  // Pattern extractors
  const has40Min = lower.includes('40 min') || lower.includes('40 minutos');
  const hasTimingMinutes = /(\d+)\s*(minutos|min)/.exec(lower);
  const detectedMinutes = has40Min ? 40 : hasTimingMinutes ? parseInt(hasTimingMinutes[1], 10) : null;

  const mentionsFpsDrop =
    lower.includes('baja los frames') ||
    lower.includes('bajan los frames') ||
    lower.includes('baja fps') ||
    lower.includes('bajan fps') ||
    lower.includes('caen los frames') ||
    lower.includes('caida de fps') ||
    lower.includes('caída de fps') ||
    lower.includes('pierdo frames');

  const mentionsHeat =
    lower.includes('recalienta') ||
    lower.includes('calienta') ||
    lower.includes('temperatura') ||
    lower.includes('hirviendo') ||
    lower.includes('calor');

  const mentionsGaming =
    lower.includes('jugar') ||
    lower.includes('juego') ||
    lower.includes('juegos') ||
    lower.includes('jugando') ||
    lower.includes('partida');

  const mentions200Fps =
    lower.includes('200 fps') ||
    lower.includes('200fps') ||
    lower.includes('144 fps') ||
    lower.includes('165 fps') ||
    lower.includes('muchos fps') ||
    lower.includes('fps alto') ||
    lower.includes('fps altos');

  const mentionsStutter =
    lower.includes('tiron') ||
    lower.includes('tirones') ||
    lower.includes('stutter') ||
    lower.includes('microtirones') ||
    lower.includes('microcortes') ||
    lower.includes('traba');

  const mentionsNoBsod =
    lower.includes('sin pantalla azul') ||
    lower.includes('sin bsod') ||
    lower.includes('no da pantalla azul') ||
    lower.includes('no tira pantalla azul');

  const mentionsUpdate =
    lower.includes('actualic') ||
    lower.includes('update') ||
    lower.includes('windows update') ||
    lower.includes('actualizacion') ||
    lower.includes('actualización');

  const mentionsSlowBoot =
    lower.includes('tarda en arrancar') ||
    lower.includes('arranque lento') ||
    lower.includes('inicio lento') ||
    lower.includes('tarda en prender') ||
    lower.includes('tarda mucho en prender') ||
    lower.includes('tarda minutos en iniciar');

  // CASO 1 VALIDADO: "mi pc luego de jugar 40 minutos baja los frames y recalienta" / "después de jugar 40 minutos baja FPS y recalienta"
  if (mentionsFpsDrop && mentionsHeat) {
    const timingStr = detectedMinutes ? `aproximadamente después de ${detectedMinutes} minutos` : 'tras un período de juego continuo';
    return {
      category: 'RENDIMIENTO_FPS_STUTTER',
      symptom: 'Caída de FPS + aumento de temperatura percibido.',
      context: mentionsGaming ? 'Durante una sesión de juego.' : 'Durante el uso bajo carga sostenida.',
      pattern: `Aparece ${timingStr}.`,
      cause: 'NO DETERMINADA',
      declaredFacts: [
        'Disminución o caída de fotogramas por segundo (FPS).',
        'Aumento de temperatura percibido por el usuario ("recalienta").',
        detectedMinutes ? `Ocurre tras jugar aproximadamente ${detectedMinutes} minutos.` : 'Se manifiesta tras un tiempo de uso activo.',
      ],
      unknownData: [
        'Temperatura real medida en grados (°C) con software de telemetría.',
        'Frecuencia de reloj efectiva de CPU y GPU bajo carga prolongada.',
        'Comprobación de si existe o no thermal throttling real.',
        'Régimen y velocidad real de los ventiladores.',
        'Porcentaje de uso y reparto de carga entre CPU y GPU.',
        'Actividad o tareas pesadas en segundo plano.',
        'Cadencia de frametime y caídas del percentil 1% Low.',
      ],
      humanSummary:
        `Reportás caída de FPS y aumento de temperatura percibido tras jugar aproximadamente ${detectedMinutes || 40} minutos. En EVO LABS no asumimos problema de refrigeración ni estrangulamiento térmico sin mediciones objetivas.`,
    };
  }

  // CASO 2 VALIDADO: "tengo 200 FPS pero pega tirones"
  if (mentions200Fps && mentionsStutter) {
    return {
      category: 'RENDIMIENTO_FPS_STUTTER',
      symptom: 'Microtirones / tirones visuales percibidos con contador de FPS alto (200 FPS).',
      context: 'Durante la ejecución de juegos.',
      pattern: 'Aparece aun cuando la tasa media de fotogramas es alta.',
      cause: 'NO DETERMINADA',
      declaredFacts: [
        'El contador de FPS reporta números elevados (~200 FPS).',
        'Se perciben tirones o microcongelamientos en pantalla.',
      ],
      unknownData: [
        'Cadencia de frametime y estabilidad del percentil 1% Low.',
        'Configuración de sincronización vertical (G-Sync, FreeSync o V-Sync).',
        'Interrupciones de procesos o servicios en segundo plano.',
        'Configuración de canal de memoria RAM (Single vs Dual Channel).',
        'Saturación o latencia de la memoria VRAM.',
      ],
      humanSummary:
        'Reportás microtirones a pesar de contar con ~200 FPS de promedio. No asumimos falla de procesador o drivers hasta medir la cadencia de frametime y posibles interrupciones de fondo.',
    };
  }

  // CASO 3 VALIDADO: "se reinicia sin pantalla azul"
  if ((lower.includes('reinicia') || lower.includes('apaga')) && mentionsNoBsod) {
    return {
      category: 'REINICIOS_BSOD_APAGADOS',
      symptom: 'Reinicio súbito del sistema sin código de detención ni pantalla azul (BSOD).',
      context: 'Durante la operación del equipo.',
      pattern: 'Corte súbito e instantáneo.',
      cause: 'NO DETERMINADA',
      declaredFacts: [
        'El equipo se reinicia de manera repentina.',
        'No se observa pantalla azul (BSOD) ni mensaje previo de advertencia.',
      ],
      unknownData: [
        'Registro de eventos del kernel de Windows (Event ID 41 - Kernel-Power).',
        'Nivel de temperatura o carga de trabajo al momento del corte.',
        'Estabilidad y respuesta ante transitorios de la fuente de poder (PSU).',
        'Integridad y estabilidad de módulos de memoria RAM o placa madre.',
      ],
      humanSummary:
        'Reportás reinicios repentinos sin mensaje ni pantalla azul visible. No asumimos falla de fuente o sobretemperatura hasta contrastar los registros de energía y eventos del kernel.',
    };
  }

  // CASO 4 VALIDADO: "desde que actualicé Windows tarda en arrancar"
  if (mentionsUpdate && mentionsSlowBoot) {
    return {
      category: 'FALLO_TRAS_ACTUALIZACION',
      symptom: 'Incremento en el tiempo de arranque tras actualización de Windows.',
      context: 'Durante la fase de inicio y booteo del sistema operativo.',
      pattern: 'Iniciado a partir de una actualización reciente.',
      cause: 'NO DETERMINADA',
      declaredFacts: [
        'El tiempo de arranque de Windows se volvió notablemente lento.',
        'El cambio comenzó luego de una actualización del sistema.',
      ],
      unknownData: [
        'Tiempo medido de arranque en segundos (última hora de BIOS en el Administrador de tareas).',
        'Controladores y paquetes instalados en dicha actualización.',
        'Programas o servicios agregados al inicio del sistema operativo.',
        'Tiempo de respuesta y actividad de la unidad de almacenamiento durante el booteo.',
      ],
      humanSummary:
        'Reportás lentitud en el arranque iniciada tras una actualización de Windows. No asumimos archivos corruptos ni daño en la unidad hasta auditar los registros de confiabilidad y servicios de inicio.',
    };
  }

  // Otros casos frecuentes auditados con estricta separación de hechos
  if (
    lower.includes('no enciende') ||
    lower.includes('no prende') ||
    lower.includes('no arranca nada') ||
    lower.includes('muerta')
  ) {
    return {
      category: 'ENCENDIDO_SIN_VIDEO',
      symptom: 'Ausencia de respuesta de energía al presionar botón.',
      context: 'Al intentar encender el equipo.',
      pattern: 'Inmediato en cada intento.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['No hay encendido visible de luces ni giro de ventiladores.'],
      unknownData: ['Continuidad de cable interlock', 'Estado del interruptor I/O de la fuente', 'Conexión del panel frontal'],
      humanSummary:
        'El equipo no inicia el circuito de energía. Verificaremos el suministro eléctrico antes de presumir fallas mayores.',
    };
  }

  if (
    lower.includes('sin video') ||
    lower.includes('sin señal') ||
    lower.includes('pantalla negra') ||
    lower.includes('no da imagen') ||
    lower.includes('monitor no prende')
  ) {
    return {
      category: 'ENCENDIDO_SIN_VIDEO',
      symptom: 'El equipo recibe energía pero no hay salida de video en pantalla.',
      context: 'Durante el arranque (fase POST / UEFI).',
      pattern: 'Se repite en cada encendido.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['Los ventiladores o luces encienden pero no hay imagen en pantalla.'],
      unknownData: ['Puerto de conexión de video utilizado', 'Entrada seleccionada en el monitor', 'Asentamiento de módulos de memoria RAM'],
      humanSummary:
        'La máquina enciende ventiladores pero no entrega señal gráfica. Evaluaremos cable, monitor, módulos de RAM y tarjeta gráfica sin cambiar piezas a ciegas.',
    };
  }

  if (
    lower.includes('reinicia') ||
    lower.includes('se apaga') ||
    lower.includes('pantalla azul') ||
    lower.includes('bsod') ||
    lower.includes('se congela')
  ) {
    const isTiming =
      lower.includes('minuto') ||
      lower.includes('jugando') ||
      lower.includes('después de') ||
      lower.includes('despues de');
    return {
      category: 'REINICIOS_BSOD_APAGADOS',
      symptom: 'Interrupción súbita del funcionamiento (reinicio, apagado o congelamiento).',
      context: isTiming ? 'Bajo demanda de trabajo o tiempo prolongado.' : 'Aleatorio o en reposo.',
      pattern: isTiming ? 'Ligado a carga o tiempo continuo.' : 'Intermitente sin patrón claro.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['Interrupción imprevista de la sesión de trabajo.'],
      unknownData: ['Código de detención de Windows (si existió)', 'Eventos Kernel-Power (Event ID 41)', 'Temperaturas previas al corte'],
      humanSummary:
        'El sistema pierde estabilidad y corta su ejecución. Investigaremos registros del kernel de Windows, temperaturas y suministro de energía sin cambiar piezas al azar.',
    };
  }

  if (
    lower.includes('fps') ||
    lower.includes('tiron') ||
    lower.includes('tirones') ||
    lower.includes('stutter') ||
    lower.includes('traba') ||
    lower.includes('lento al jugar') ||
    lower.includes('lag visual')
  ) {
    return {
      category: 'RENDIMIENTO_FPS_STUTTER',
      symptom: 'Inestabilidad en la cadencia de cuadros o microinterrupciones visuales.',
      context: 'Durante la ejecución de juegos o aplicaciones 3D.',
      pattern: 'Aparece en movimiento o tras minutos de juego.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['Pérdida de fluidez percibida en pantalla durante la sesión.'],
      unknownData: ['Estabilidad de frametime (ms)', 'Caídas de 1% Low', 'Procesos compitiendo en segundo plano'],
      humanSummary:
        'Detectás saltos visuales o falta de suavidad a pesar de que el juego pueda reportar números altos. Reutilizaremos tus mediciones de frametime y procesos en memoria.',
    };
  }

  if (
    lower.includes('disco') ||
    lower.includes('100%') ||
    lower.includes('100 %') ||
    lower.includes('disco al 100')
  ) {
    return {
      category: 'DISCO_100',
      symptom: 'Uso continuo del almacenamiento reportado al 100%.',
      context: 'En el escritorio o durante uso general.',
      pattern: 'Mantiene tasa activa prolongada bloqueando el sistema.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['El Administrador de tareas muestra 100% de actividad constante en el disco.'],
      unknownData: ['Proceso exacto que genera la cola de disco', 'Tiempo medio de respuesta en ms', 'Tipo de unidad (HDD vs SSD)'],
      humanSummary:
        'El almacenamiento está reteniendo el flujo de datos del sistema operativo. Investigaremos el proceso exacto de Windows que genera la cola de disco antes de reemplazar la unidad.',
    };
  }

  if (
    lower.includes('ram') &&
    (lower.includes('detecta') ||
      lower.includes('reconoce') ||
      lower.includes('8gb') ||
      lower.includes('16gb') ||
      lower.includes('mitad') ||
      lower.includes('slot'))
  ) {
    return {
      category: 'RAM_NO_DETECTADA',
      symptom: 'Discrepancia entre la memoria física instalada y la memoria utilizable por Windows.',
      context: 'Lectura en BIOS y en Información del Sistema.',
      pattern: 'Constante desde el encendido.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['Windows o BIOS no reconoce la totalidad de los módulos de memoria física instalados.'],
      unknownData: ['Ubicación exacta de ranuras (A2/B2)', 'Memoria reservada para hardware', 'Reconocimiento individual por ranura'],
      humanSummary:
        'Tu placa o sistema no está aprovechando todos los módulos de memoria física. Aplicaremos un protocolo seguro de descarte slot por slot.',
    };
  }

  if (
    lower.includes('lag') ||
    lower.includes('ping') ||
    lower.includes('ms') ||
    lower.includes('teletransporta') ||
    lower.includes('wifi') ||
    lower.includes('wi-fi') ||
    lower.includes('internet')
  ) {
    return {
      category: 'RED_LAG',
      symptom: 'Latencia elevada o pérdida de paquetes en comunicación de red.',
      context: 'En juegos multijugador o videollamadas.',
      pattern: 'Picos esporádicos o retraso permanente.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['Presencia de saltos de ping o teletransportación en partidas online.'],
      unknownData: ['Latencia de red local hacia el router', 'Pérdida de paquetes con cable vs Wi-Fi', 'Tráfico de fondo en la red'],
      humanSummary:
        'Diferenciaremos claramente el rendimiento gráfico de la latencia de paquetes. Aislando tu PC, el router local y la ruta hacia el servidor.',
    };
  }

  if (mentionsUpdate) {
    return {
      category: 'FALLO_TRAS_ACTUALIZACION',
      symptom: 'Aparición repentina de anomalía coincidente con cambio de versión o parche.',
      context: 'Tras aplicar paquetes de software o controladores.',
      pattern: 'Inició a partir de una fecha concreta.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['El inconveniente comenzó a manifestarse luego de una actualización.'],
      unknownData: ['Eventos registrados en el Historial de Confiabilidad', 'Paquetes de controladores modificados', 'Puntos de restauración disponibles'],
      humanSummary:
        'El problema tiene un punto temporal definido. Utilizaremos el Monitor de Confiabilidad de Windows para contrastar eventos exactos de ese día.',
    };
  }

  if (
    lower.includes('se cierra') ||
    lower.includes('crash') ||
    lower.includes('crashea') ||
    lower.includes('escritorio')
  ) {
    return {
      category: 'JUEGO_CIERRA',
      symptom: 'Terminación inesperada del proceso con retorno forzado al escritorio.',
      context: 'Durante la ejecución de un juego o programa particular.',
      pattern: 'Tras unos minutos o en escenas específicas.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['La aplicación se interrumpe de forma abrupta volviendo al escritorio.'],
      unknownData: ['Código de excepción de Windows en el Visor de Eventos', 'Estado de la memoria virtual (pagefile)', 'Consumo de VRAM'],
      humanSummary:
        'El software se aborta por excepción no controlada. Rastrearemos el Visor de Eventos y el código de excepción de Windows.',
    };
  }

  if (mentionsHeat || lower.includes('ruido') || lower.includes('ventilador')) {
    return {
      category: 'TEMPERATURA_RUIDO',
      symptom: 'Aumento de temperatura percibido o mayor régimen sonoro de ventilación.',
      context: 'Bajo demanda de cálculo o durante el funcionamiento.',
      pattern: 'Progresivo con el tiempo de encendido.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['El usuario percibe mayor calor o mayor nivel sonoro de los ventiladores.'],
      unknownData: [
        'Temperatura real medida en °C en los sensores internos de silicio.',
        'Curva de ventilación configurada.',
        'Carga y frecuencias efectivas de CPU y GPU.',
      ],
      humanSummary:
        'Analizaremos el acoplamiento térmico y la carga previa de procesos antes de sugerir desarmes o cambios de pasta térmica sin fundamento.',
    };
  }

  if (
    lower.includes('usb') ||
    lower.includes('teclado') ||
    lower.includes('mouse') ||
    lower.includes('auricular') ||
    lower.includes('desconecta')
  ) {
    return {
      category: 'USB_PERIFERICOS',
      symptom: 'Intermitencia o falta de reconocimiento en puertos de entrada/salida.',
      context: 'Al conectar o utilizar periféricos USB.',
      pattern: 'Desconexión momentánea o fallo en puerto específico.',
      cause: 'NO DETERMINADA',
      declaredFacts: ['Dispositivos USB sufren desconexiones o falta de respuesta.'],
      unknownData: ['Comportamiento en puertos traseros directos a placa vs puertos de chasis', 'Configuración de suspensión selectiva de USB'],
      humanSummary:
        'Identificaremos si el inconveniente radica en el puerto del chasis, concentrador USB, suspensión selectiva de energía o el dispositivo mismo.',
    };
  }

  // Fallback general
  return {
    category: 'OTRO',
    symptom: 'Comportamiento atípico o degradación de respuesta del sistema.',
    context: 'En el uso general del equipo.',
    pattern: 'A determinar mediante investigación guiada.',
    cause: 'NO DETERMINADA',
    declaredFacts: ['Reporte inicial registrado por el usuario.'],
    unknownData: ['Métricas de rendimiento en tiempo real', 'Historial de confiabilidad de Windows', 'Eventos críticos del kernel'],
    humanSummary:
      'Iniciamos una auditoría deductiva metódica. Separaremos los síntomas de las causas reales mediante preguntas y pruebas concretas.',
  };
}

// Initial Hypotheses Generation
// Regla EVO LABS: Las hipótesis comienzan todas como PENDIENTE salvo que exista evidencia heredada real.
export function getInitialHypotheses(
  category: DiagnosticSymptomCategory,
  specs?: Partial<UserPcSpec>
): DiagnosticHypothesis[] {
  // Las 5 hipótesis centrales requeridas por la metodología EVO LABS
  const coreHypotheses: DiagnosticHypothesis[] = [
    {
      id: 'h-temp-potencia',
      label: 'Temperatura / Potencia',
      componentCategory: 'TEMPERATURA',
      status: 'PENDIENTE',
      reasoning: 'Condición térmica y límites de consumo eléctrico a auditar.',
    },
    {
      id: 'h-cpu-gpu',
      label: 'CPU / GPU (Reloj y Límites)',
      componentCategory: 'CPU',
      status: 'PENDIENTE',
      reasoning: 'Comportamiento de frecuencias, carga y límites de silicio.',
    },
    {
      id: 'h-procesos-fondo',
      label: 'Procesos de Fondo',
      componentCategory: 'SOFTWARE',
      status: 'PENDIENTE',
      reasoning: 'Impacto de software concurrente, telemetría y tareas programadas.',
    },
    {
      id: 'h-memoria',
      label: 'Memoria (RAM / VRAM / Almacenamiento)',
      componentCategory: 'RAM',
      status: 'PENDIENTE',
      reasoning: 'Canal de memoria, estabilidad de bus o respuesta de almacenamiento.',
    },
    {
      id: 'h-driver-windows',
      label: 'Driver / Windows',
      componentCategory: 'DRIVERS',
      status: 'PENDIENTE',
      reasoning: 'Espacio de controladores, integridad del sistema y configuración de sincronización.',
    },
  ];

  // Si la categoría es puramente de encendido físico inicial
  if (category === 'ENCENDIDO_SIN_VIDEO') {
    return [
      { id: 'h-cable-mon', label: 'Monitor o cable de video', componentCategory: 'PERIFERICOS', status: 'PENDIENTE' },
      { id: 'h-ram-seat', label: 'Módulos de RAM mal asentados o sucios', componentCategory: 'RAM', status: 'PENDIENTE' },
      { id: 'h-gpu-seat', label: 'Tarjeta gráfica o conexión PCIe', componentCategory: 'GPU', status: 'PENDIENTE' },
      { id: 'h-psu-pwr', label: 'Línea de alimentación / Fuente (PSU)', componentCategory: 'ENERGIA', status: 'PENDIENTE' },
      { id: 'h-mobo-bios', label: 'Estado de BIOS / Placa madre (POST)', componentCategory: 'CPU', status: 'PENDIENTE' },
    ];
  }

  return coreHypotheses;
}

// Adaptive Question Tree
export interface DiagnosticQuestion {
  id: string;
  title: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    hypothesisUpdates: Array<{ id: string; status: DiagnosticHypothesis['status']; reasoning?: string }>;
    nextActionSummary: string;
  }>;
}

// Adaptive Question Motor:
// PRINCIPIO EVO LABS:
// 1. NO preguntar información que el usuario ya proporcionó en la descripción inicial.
// 2. NO preguntar por completar un flujo fijo.
// 3. Cada pregunta debe reducir incertidumbre buscando la siguiente pieza de información faltante.
export function getAdaptiveQuestions(
  category: DiagnosticSymptomCategory,
  rawDescription: string = '',
  answersSoFar: Array<{ questionId: string; questionText: string; answerText: string }> = [],
  specs?: Partial<UserPcSpec>
): DiagnosticQuestion[] {
  const lower = rawDescription.toLowerCase();

  // Hechos detectados en la descripción del usuario
  const declaredTiming =
    lower.includes('minuto') ||
    lower.includes('min') ||
    lower.includes('hora') ||
    lower.includes('después de') ||
    lower.includes('despues de') ||
    lower.includes('luego de') ||
    lower.includes('tras ');

  const declaredFpsDrop =
    lower.includes('baja los frames') ||
    lower.includes('bajan los frames') ||
    lower.includes('baja fps') ||
    lower.includes('bajan fps') ||
    lower.includes('caen los frames') ||
    lower.includes('caida de fps') ||
    lower.includes('caída de fps') ||
    lower.includes('pierdo frames');

  const declaredHeat =
    lower.includes('recalienta') ||
    lower.includes('calienta') ||
    lower.includes('temperatura') ||
    lower.includes('hirviendo') ||
    lower.includes('calor');

  const declared200FpsOrHigh =
    lower.includes('200 fps') ||
    lower.includes('200fps') ||
    lower.includes('144 fps') ||
    lower.includes('165 fps') ||
    lower.includes('muchos fps') ||
    lower.includes('fps alto') ||
    lower.includes('fps altos');

  const declaredNoBsod =
    lower.includes('sin pantalla azul') ||
    lower.includes('sin bsod') ||
    lower.includes('no da pantalla azul') ||
    lower.includes('no tira pantalla azul');

  const declaredUpdate =
    lower.includes('actualic') ||
    lower.includes('update') ||
    lower.includes('windows update') ||
    lower.includes('actualizacion') ||
    lower.includes('actualización');

  // CASO A: Caída de FPS + temperatura declarada ("mi pc luego de jugar 40 minutos baja los frames y recalienta")
  // Ya sabemos: que juega, que pasa a los ~40 min, que caen FPS y que percibe calor.
  // NO preguntar: "¿Ocurre permanentemente o de vez en cuando?" ni "¿Qué hace el contador de FPS?".
  // PREGUNTA 1: ¿Tiene temperatura medida o sólo nota más calor?
  if (declaredFpsDrop && declaredHeat) {
    return [
      {
        id: 'q-temp-measured-vs-perceived',
        title: 'MEDICIÓN INSTRUMENTAL // TEMPERATURA',
        question: 'Cuando aparecen las caídas de rendimiento, ¿tenés una temperatura medida con software o solamente notás que la PC se siente más caliente al tacto / hace más ruido?',
        options: [
          {
            id: 'has-measured-temp',
            text: 'TENGO TEMPERATURA MEDIDA (ej. con HWiNFO, Afterburner o BIOS)',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'INDICIO_MODERADO', reasoning: 'Existen registros térmicos para cotejar con los umbrales de TjMax.' },
            ],
            nextActionSummary: 'Revisaremos el valor en grados (°C) para contrastar con los límites seguros de silicio.',
          },
          {
            id: 'only-feels-hot',
            text: 'SÓLO NOTO MÁS CALOR O MÁS RUIDO DE VENTILADORES',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'PENDIENTE', reasoning: 'El calor superficial o ruido no equivale a thermal throttling sin telemetría de silicio.' },
              { id: 'h-cpu-gpu', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Realizaremos una medición objetiva con sensores antes de suponer estrangulamiento térmico.',
          },
          {
            id: 'does-not-know',
            text: 'NO LO SÉ / NO TENGO CÓMO MEDIRLO AÚN',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Montaremos un registro instrumental no invasivo en la fase de pruebas.',
          },
        ],
      },
      {
        id: 'q-clock-drop-behavior',
        title: 'TELEMETRÍA // COMPORTAMIENTO DE FRECUENCIAS',
        question: '¿Notaste si las frecuencias de reloj (clock) del procesador o de la placa de video caen abruptamente a un piso mínimo (ej. 800 MHz) o la caída de FPS es progresiva?',
        options: [
          {
            id: 'sudden-drop',
            text: 'Cae abruptamente y se clava en frecuencias mínimas durante segundos',
            hypothesisUpdates: [
              { id: 'h-cpu-gpu', status: 'INDICIO_FUERTE', reasoning: 'Caída brusca a reloj mínimo suele ser limitación por PROCHOT o estrangulamiento de energía.' },
              { id: 'h-temp-potencia', status: 'INDICIO_MODERADO' },
            ],
            nextActionSummary: 'Investigaremos eventos de estrangulamiento térmico o límites de potencia VRM.',
          },
          {
            id: 'gradual-drop',
            text: 'La caída de cuadros es progresiva y fluctuante a medida que pasan los minutos',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'INDICIO_MODERADO', reasoning: 'Pérdida gradual sugiere acumulación en memoria, saturación de VRAM o procesos en cola.' },
              { id: 'h-memoria', status: 'INDICIO_MODERADO' },
            ],
            nextActionSummary: 'Auditaremos el consumo de RAM, VRAM y actividad en segundo plano.',
          },
          {
            id: 'not-checked-clocks',
            text: 'No monitoreé las frecuencias de reloj todavía',
            hypothesisUpdates: [
              { id: 'h-cpu-gpu', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Lo verificaremos en vivo durante la prueba de carga.',
          },
        ],
      },
      {
        id: 'q-background-software-load',
        title: 'SISTEMA // PROCESOS Y TAREAS CONCURRENTES',
        question: 'Durante la sesión de juego, ¿dejás aplicaciones pesadas abiertas en segundo plano (navegador con muchas pestañas, descargas, Discord, antivirus)?',
        options: [
          {
            id: 'yes-apps-open',
            text: 'Sí, suelo tener varias aplicaciones de fondo abiertas mientras juego',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'INDICIO_MODERADO', reasoning: 'Las fugas de memoria o sincronizaciones periódicas pueden dispararse tras minutos de juego.' },
            ],
            nextActionSummary: 'Cotejaremos con el mapa de actividad de fondo heredado de capítulos previos.',
          },
          {
            id: 'no-clean-env',
            text: 'No, juego con todo cerrado excepto el juego',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'DESCARTADA_PARA_ESTE_CASO', reasoning: 'Con entorno limpio, el foco se concentra en hardware, drivers y temperatura.' },
              { id: 'h-temp-potencia', status: 'INDICIO_MODERADO' },
            ],
            nextActionSummary: 'Descartamos competencia de software de fondo; concentramos en hardware y controladores.',
          },
          {
            id: 'unverified-bg',
            text: 'No he verificado el consumo en segundo plano desde el Administrador de tareas',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Verificaremos el número de procesos y uso de RAM en reposo y bajo carga.',
          },
        ],
      },
    ];
  }

  // CASO B: Alto FPS pero con tirones ("tengo 200 FPS pero pega tirones")
  // Ya sabemos: que el contador está alto (200 FPS) y que hay tirones visuales.
  // NO preguntar: "¿Qué hace el contador de FPS?".
  // PREGUNTA 1: ¿Los tirones tienen patrón (giro de cámara / zonas) o son periódicos?
  if (declared200FpsOrHigh) {
    return [
      {
        id: 'q-stutter-pattern',
        title: 'CADENCIA // PATRÓN DEL TIRÓN VISUAL',
        question: '¿Los tirones se producen al girar la cámara / cargar zonas nuevas o son microcortes rítmicos constantes cada pocos segundos?',
        options: [
          {
            id: 'camera-turn-zone',
            text: 'Al girar la cámara rápido o al entrar a áreas nuevas del mapa',
            hypothesisUpdates: [
              { id: 'h-memoria', status: 'INDICIO_MODERADO', reasoning: 'Carga de texturas y shaders suele tensionar el bus de RAM, VRAM o almacenamiento.' },
              { id: 'h-cpu-gpu', status: 'INDICIO_MODERADO' },
            ],
            nextActionSummary: 'Auditaremos el canal de memoria (Single vs Dual Channel) y la velocidad de almacenamiento.',
          },
          {
            id: 'rhythmic-stutter',
            text: 'Son microcortes rítmicos regulares incluso estando quieto en un lugar cerrado',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'INDICIO_FUERTE', reasoning: 'Interrupciones a intervalos fijos suelen deberse a polling de periféricos o procesos de fondo.' },
            ],
            nextActionSummary: 'Foco en software de telemetría, RGB, polling rate o sincronizadores en segundo plano.',
          },
          {
            id: 'random-stutter',
            text: 'Ocurren de forma completamente aleatoria sin patrón aparente',
            hypothesisUpdates: [
              { id: 'h-driver-windows', status: 'INDICIO_MODERADO', reasoning: 'Dispersión de frametime por sincronización o configuración de controlador gráfico.' },
            ],
            nextActionSummary: 'Mediremos la curva de frametime con gráficas de percentil 1% Low.',
          },
        ],
      },
      {
        id: 'q-sync-technology',
        title: 'PANTALLA // SINCRONIZACIÓN Y TASA DE REFRESCO',
        question: '¿Tenés activada alguna tecnología de sincronización (G-Sync, FreeSync o V-Sync) o jugás con fotogramas totalmente desbloqueados?',
        options: [
          {
            id: 'unlocked-no-sync',
            text: 'Juego con FPS totalmente desbloqueados sin sincronización',
            hypothesisUpdates: [
              { id: 'h-driver-windows', status: 'INDICIO_FUERTE', reasoning: 'Con 200 FPS sin sincronizar, el frametime desalineado con los Hz del monitor provoca microstutter visible.' },
            ],
            nextActionSummary: 'Probaremos una limitación de FPS acorde a la tasa de refresco del monitor.',
          },
          {
            id: 'vrr-active',
            text: 'Tengo G-Sync / FreeSync activado y configurado en el monitor',
            hypothesisUpdates: [
              { id: 'h-cpu-gpu', status: 'INDICIO_MODERADO', reasoning: 'Si hay VRR y persiste el tirón, el 1% Low está cayendo por debajo del rango de refresco del panel.' },
            ],
            nextActionSummary: 'Aislando el frametime verificaremos si el cuello de botella es de CPU o de bus.',
          },
          {
            id: 'unknown-sync',
            text: 'No sé cómo está configurada la sincronización en mi monitor',
            hypothesisUpdates: [
              { id: 'h-driver-windows', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Revisaremos la tasa de Hz y la configuración del panel de control gráfico.',
          },
        ],
      },
      {
        id: 'q-ram-channel-spec',
        title: 'HARDWARE // CONFIGURACIÓN DE MEMORIA RAM',
        question: '¿Sabés si tu memoria RAM funciona en Dual Channel (dos módulos en ranuras separadas) o en un solo módulo (Single Channel)?',
        options: [
          {
            id: 'dual-channel-confirmed',
            text: 'Tengo dos módulos en Dual Channel confirmados en mi Pasaporte EVO',
            hypothesisUpdates: [
              { id: 'h-memoria', status: 'DESCARTADA_PARA_ESTE_CASO', reasoning: 'El ancho de banda de memoria está aprovechado al máximo.' },
            ],
            nextActionSummary: 'Descartamos limitación por ancho de banda de memoria; foco en procesos y frametime.',
          },
          {
            id: 'single-channel-confirmed',
            text: 'Tengo un solo módulo de memoria RAM (Single Channel)',
            hypothesisUpdates: [
              { id: 'h-memoria', status: 'INDICIO_FUERTE', reasoning: 'Single Channel reduce a la mitad el ancho de banda, impactando directamente el 1% Low y la estabilidad de frametime.' },
            ],
            nextActionSummary: 'Identificamos una restricción clave documentada en el Capítulo 01.',
          },
          {
            id: 'unknown-ram-channel',
            text: 'No estoy seguro de la configuración física de mis ranuras de memoria',
            hypothesisUpdates: [
              { id: 'h-memoria', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Cotejaremos con las especificaciones del Pasaporte EVO de tu equipo.',
          },
        ],
      },
    ];
  }

  // CASO C: Reinicio sin pantalla azul ("se reinicia sin pantalla azul")
  // Ya sabemos: que se reinicia de golpe y que NO hay BSOD visible.
  // NO preguntar: "¿Aparece pantalla azul o se corta instantáneamente?".
  // PREGUNTA 1: ¿Ocurre sólo bajo carga pesada o también en reposo?
  if (category === 'REINICIOS_BSOD_APAGADOS' && declaredNoBsod) {
    return [
      {
        id: 'q-reboot-load-condition',
        title: 'CONDICIÓN DE CARGA // MOMENTO DEL CORTE',
        question: '¿El reinicio ocurre únicamente bajo carga pesada (juegos exigentes, renderizado) o también pasa en reposo en el escritorio sin hacer nada?',
        options: [
          {
            id: 'heavy-load-only',
            text: 'Únicamente bajo carga exigente (juegos pesados o pruebas de estrés)',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'INDICIO_FUERTE', reasoning: 'La demanda de watts o la saturación térmica requieren carga para disparar cortes.' },
              { id: 'h-cpu-gpu', status: 'INDICIO_MODERADO' },
            ],
            nextActionSummary: 'Foco prioritario en respuesta transitoria de la fuente y disipación bajo estrés.',
          },
          {
            id: 'idle-or-anytime',
            text: 'Pasa en cualquier momento, incluso en el escritorio o navegando',
            hypothesisUpdates: [
              { id: 'h-driver-windows', status: 'INDICIO_MODERADO', reasoning: 'Cortes en reposo apuntan a voltajes mínimos en C-States, RAM o fallas de placa.' },
              { id: 'h-temp-potencia', status: 'DESCARTADA_PARA_ESTE_CASO', reasoning: 'En reposo sin carga térmica se descarta corte por sobrecalentamiento convencional.' },
            ],
            nextActionSummary: 'Descartamos saturación térmica; auditaremos voltajes mínimos y eventos del sistema.',
          },
          {
            id: 'short-after-boot',
            text: 'Ocurre a los pocos minutos de encender el equipo sin patrón claro',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'INDICIO_MODERADO' },
              { id: 'h-driver-windows', status: 'INDICIO_MODERADO' },
            ],
            nextActionSummary: 'Auditaremos el Visor de Eventos para detectar el último driver cargado.',
          },
        ],
      },
      {
        id: 'q-power-cut-behavior',
        title: 'FÍSICA DEL CORTE // COMPORTAMIENTO ELÉCTRICO',
        question: 'En el instante del reinicio, ¿el corte es instantáneo como si desenchufaran la PC (apagón total de luces/ventiladores), o Windows alcanza a decir "Reiniciando"?',
        options: [
          {
            id: 'instant-blackout',
            text: 'Corte instantáneo en seco: luces y ventiladores se apagan por una fracción de segundo',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'INDICIO_FUERTE', reasoning: 'Comportamiento típico de disparo de protección de la fuente de poder (OCP/OPP) o corte térmico de placa.' },
            ],
            nextActionSummary: 'Sintomatología compatible con protección de hardware por transitorio de potencia o calor.',
          },
          {
            id: 'windows-message-seen',
            text: 'Windows alcanza a mostrar la pantalla de reinicio o se congela la imagen primero',
            hypothesisUpdates: [
              { id: 'h-driver-windows', status: 'INDICIO_MODERADO', reasoning: 'Reinicio gestionado por el sistema operativo, compatible con pánico de kernel o interrupción de controlador.' },
              { id: 'h-temp-potencia', status: 'SIN_INDICIO' },
            ],
            nextActionSummary: 'El sistema operativo gestionó el reinicio; rastrearemos el log de eventos.',
          },
          {
            id: 'fans-max-black-screen',
            text: 'Queda la pantalla en negro pero los ventiladores siguen girando al máximo',
            hypothesisUpdates: [
              { id: 'h-cpu-gpu', status: 'INDICIO_MODERADO', reasoning: 'Pérdida de comunicación en el bus PCIe de la tarjeta gráfica o microcódigo del procesador.' },
            ],
            nextActionSummary: 'Foco en el enlace de la tarjeta de video y suministro al bus PCIe.',
          },
        ],
      },
      {
        id: 'q-wall-plug-connection',
        title: 'SUMINISTRO EXTERNO // CONEXIÓN ELÉCTRICA',
        question: '¿La PC está conectada a una zapatilla/alargador múltiple compartido o directo a la toma de pared / estabilizador?',
        options: [
          {
            id: 'shared-power-strip',
            text: 'Conectada a una zapatilla múltiple con varios otros aparatos',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'INDICIO_MODERADO', reasoning: 'Microcaídas de tensión en la línea compartida pueden provocar reinicios en fuentes sin buen hold-up time.' },
            ],
            nextActionSummary: 'Revisaremos la estabilidad de línea antes de culpar componentes de la torre.',
          },
          {
            id: 'direct-wall-socket',
            text: 'Directo a la toma de pared / estabilizador con puesta a tierra',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'PENDIENTE', reasoning: 'Suministro externo aislado; foco en componentes internos.' },
            ],
            nextActionSummary: 'Línea de alimentación aislada; continuaremos con auditoría interna.',
          },
          {
            id: 'unverified-socket',
            text: 'No he verificado el estado de la toma eléctrica',
            hypothesisUpdates: [
              { id: 'h-temp-potencia', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Verificaremos el enchufe y cable interlock.',
          },
        ],
      },
    ];
  }

  // CASO D: Inicio lento tras actualizar Windows ("desde que actualicé Windows tarda en arrancar")
  // Ya sabemos: que tarda en arrancar y que empezó tras actualizar Windows.
  // NO preguntar: "¿Cambió algo recientemente?".
  // PREGUNTA 1: ¿La demora ocurre antes de la contraseña o en el escritorio?
  if (declaredUpdate) {
    return [
      {
        id: 'q-boot-stage-delay',
        title: 'ETAPA DE ARRANQUE // LOCALIZACIÓN DE LA DEMORA',
        question: '¿La mayor demora se produce antes de ingresar la contraseña (circulito de Windows girando) o después de iniciar sesión en el escritorio?',
        options: [
          {
            id: 'before-login',
            text: 'Antes de la contraseña: la pantalla negra o el logo de Windows tarda minutos',
            hypothesisUpdates: [
              { id: 'h-driver-windows', status: 'INDICIO_FUERTE', reasoning: 'La fase previa al login carga el kernel y los controladores de bajo nivel modificados en el update.' },
            ],
            nextActionSummary: 'Rastrearemos controladores modificados en la fecha de la actualización.',
          },
          {
            id: 'after-login',
            text: 'Después de ingresar la contraseña: el escritorio tarda mucho en cargar iconos y responder',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'INDICIO_FUERTE', reasoning: 'La fase post-login ejecuta programas de inicio, servicios de telemetría y tareas programadas.' },
            ],
            nextActionSummary: 'Auditaremos las aplicaciones habilitadas en la pestaña de Inicio.',
          },
          {
            id: 'both-stages',
            text: 'En ambas etapas: todo el proceso desde el botón hasta el escritorio es extremadamente lento',
            hypothesisUpdates: [
              { id: 'h-memoria', status: 'INDICIO_MODERADO', reasoning: 'Puede haber saturación de cola en la unidad de almacenamiento.' },
              { id: 'h-driver-windows', status: 'INDICIO_MODERADO' },
            ],
            nextActionSummary: 'Analizaremos la salud y la tasa de transferencia de la unidad de almacenamiento.',
          },
        ],
      },
      {
        id: 'q-storage-drive-type',
        title: 'ALMACENAMIENTO // TIPO DE UNIDAD PRINCIPAL',
        question: '¿Windows está instalado en una unidad de estado sólido (SSD NVMe / SATA) o en un disco rígido mecánico tradicional (HDD)?',
        options: [
          {
            id: 'ssd-drive',
            text: 'En una unidad de estado sólido (SSD NVMe o SATA)',
            hypothesisUpdates: [
              { id: 'h-driver-windows', status: 'INDICIO_MODERADO', reasoning: 'Un SSD no debería tardar minutos salvo conflicto de drivers de chipset, SATA/NVMe o inicio rápido dañado.' },
            ],
            nextActionSummary: 'Foco en controladores de almacenamiento y el estado de la hibernación de inicio rápido.',
          },
          {
            id: 'hdd-mechanical',
            text: 'En un disco rígido mecánico tradicional (HDD)',
            hypothesisUpdates: [
              { id: 'h-memoria', status: 'INDICIO_FUERTE', reasoning: 'Las actualizaciones modernas de Windows fragmentan masivamente el acceso a disco en HDDs mecánicos.' },
            ],
            nextActionSummary: 'Cola de lectura saturada por indexación y servicios en disco mecánico.',
          },
          {
            id: 'unknown-drive',
            text: 'No sé con certeza qué tipo de disco tiene mi PC',
            hypothesisUpdates: [
              { id: 'h-memoria', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Lo verificaremos en el Administrador de tareas o el Pasaporte EVO.',
          },
        ],
      },
      {
        id: 'q-startup-impact-apps',
        title: 'SERVICIOS // APLICACIONES AGREGADAS AL INICIO',
        question: 'En el Administrador de tareas (pestaña Inicio), ¿notás programas con "Impacto de inicio: Alto"?',
        options: [
          {
            id: 'high-impact-apps',
            text: 'Sí, hay varios programas de inicio habilitados con impacto alto',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'INDICIO_FUERTE', reasoning: 'Varios programas cargando concurrentemente al boot extienden drásticamente el tiempo de respuesta.' },
            ],
            nextActionSummary: 'Aplicaremos la auditoría de inicio controlado desarrollada en el Capítulo 05.',
          },
          {
            id: 'clean-startup-tab',
            text: 'No, la pestaña de Inicio está completamente limpia con lo mínimo',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'DESCARTADA_PARA_ESTE_CASO', reasoning: 'Si no hay software de inicio compitiendo, la lentitud proviene del subsistema de drivers o booteo.' },
              { id: 'h-driver-windows', status: 'INDICIO_FUERTE' },
            ],
            nextActionSummary: 'Descartamos software de inicio; concentramos en controladores y eventos de Windows.',
          },
          {
            id: 'uninspected-startup',
            text: 'No he revisado la pestaña de Inicio todavía',
            hypothesisUpdates: [
              { id: 'h-procesos-fondo', status: 'PENDIENTE' },
            ],
            nextActionSummary: 'Abriremos el Administrador de tareas para verificar el impacto de inicio.',
          },
        ],
      },
    ];
  }

  // Resto de categorías estándar (con preguntas respetuosas que no asumen causas)
  switch (category) {
    case 'REINICIOS_BSOD_APAGADOS':
      return [
        {
          id: 'q-reinicio-1',
          title: 'PRECISIÓN DEL SÍNTOMA',
          question: '¿QUÉ OCURRE EXACTAMENTE EN EL MOMENTO DE LA FALLA?',
          options: [
            {
              id: 'bsod',
              text: 'Aparece una pantalla azul con código de error (BSOD) o reinicia con aviso de Windows.',
              hypothesisUpdates: [
                { id: 'h-driver-windows', status: 'INDICIO_FUERTE', reasoning: 'BSOD apunta predominantemente a espacio de kernel, controladores o memoria.' },
                { id: 'h-temp-potencia', status: 'INDICIO_DEBIL', reasoning: 'Las fallas de corte de energía raramente dejan código de BSOD en pantalla.' },
              ],
              nextActionSummary: 'Revisaremos el Visor de Eventos y el Historial de Confiabilidad para extraer el código del error.',
            },
            {
              id: 'blackout',
              text: 'Se apaga instantáneamente como si le desenchufaran el cable (sin aviso, pantalla en negro inmediato).',
              hypothesisUpdates: [
                { id: 'h-temp-potencia', status: 'INDICIO_FUERTE', reasoning: 'El corte súbito sin volcado de memoria suele ser disparo de protección de fuente (OVP/OCP) o térmica.' },
                { id: 'h-driver-windows', status: 'SIN_INDICIO' },
              ],
              nextActionSummary: 'Foco en suministro de energía y disipación térmica activa.',
            },
            {
              id: 'freeze',
              text: 'La imagen y el sonido se congelan en un zumbido seco y queda trabada hasta que la reinicio a mano.',
              hypothesisUpdates: [
                { id: 'h-memoria', status: 'INDICIO_MODERADO', reasoning: 'Congelamiento con bucle de audio es característico de pérdida de respuesta en RAM o GPU.' },
              ],
              nextActionSummary: 'Foco en estabilidad de bus de memoria y reloj gráfico.',
            },
          ],
        },
        {
          id: 'q-reinicio-2',
          title: 'MOMENTO TEMPORAL',
          question: '¿EN QUÉ SITUACIÓN OCURRE CON MAYOR FRECUENCIA?',
          options: [
            {
              id: 'gaming-time',
              text: 'Ocurre únicamente tras 15 a 30 minutos de estar jugando o exigiendo la máquina.',
              hypothesisUpdates: [
                { id: 'h-temp-potencia', status: 'INDICIO_FUERTE', reasoning: 'La acumulación térmica requiere tiempo de carga para saturar el disipador.' },
              ],
              nextActionSummary: 'Auditaremos temperaturas antes de culpar componentes electrónicos.',
            },
            {
              id: 'random-idle',
              text: 'Ocurre incluso estando en el escritorio, navegando o sin tocar nada.',
              hypothesisUpdates: [
                { id: 'h-temp-potencia', status: 'DESCARTADA_PARA_ESTE_CASO', reasoning: 'En reposo sin carga térmica no se justifican apagados por temperatura normal.' },
                { id: 'h-driver-windows', status: 'INDICIO_MODERADO' },
              ],
              nextActionSummary: 'Descartamos temperatura acumulada; revisaremos eventos del sistema en reposo.',
            },
          ],
        },
      ];

    case 'ENCENDIDO_SIN_VIDEO':
      return [
        {
          id: 'q-video-1',
          title: 'ESTADO DE VENTILADORES Y LUCES',
          question: 'CUANDO PRESIONAS EL BOTÓN DE ENCENDIDO, ¿QUÉ REACCIÓN FÍSICA HAY?',
          options: [
            {
              id: 'fans-spin',
              text: 'Los ventiladores giran normalmente y hay luces en la placa, pero la pantalla no reacciona.',
              hypothesisUpdates: [
                { id: 'h-ram-seat', status: 'INDICIO_FUERTE', reasoning: 'La falla de inicialización de memoria impide superar el test POST sin cortar la energía de ventiladores.' },
                { id: 'h-cable-mon', status: 'INDICIO_MODERADO', reasoning: 'Entrada incorrecta en el monitor (HDMI 1 vs DP) o cable suelto.' },
              ],
              nextActionSummary: 'Investigaremos la cadena de video y asentamiento de memorias.',
            },
            {
              id: 'dead-silent',
              text: 'Silencio total: ningún ventilador gira ni parpadea ninguna luz.',
              hypothesisUpdates: [
                { id: 'h-psu-pwr', status: 'INDICIO_FUERTE', reasoning: 'Corte en circuito primario de energía, cable de 24 pines o botón del gabinete.' },
                { id: 'h-ram-seat', status: 'DESCARTADA_PARA_ESTE_CASO', reasoning: 'Una RAM defectuosa no impide que giren los ventiladores de la fuente.' },
              ],
              nextActionSummary: 'Protocolo de seguridad eléctrica: verificar interruptor de fuente, cable interlock y zapatilla.',
            },
          ],
        },
        {
          id: 'q-video-2',
          title: 'CONEXIÓN DE CABLE DE VIDEO',
          question: '¿DÓNDE ESTÁ CONECTADO EL CABLE QUE VA AL MONITOR?',
          options: [
            {
              id: 'gpu-card',
              text: 'A los puertos horizontales de la placa de video dedicada (abajo).',
              hypothesisUpdates: [
                { id: 'h-gpu-seat', status: 'INDICIO_MODERADO' },
                { id: 'h-cable-mon', status: 'INDICIO_MODERADO' },
              ],
              nextActionSummary: 'Conexión correcta en el puerto primario. Probaremos cable y descarte de módulos.',
            },
            {
              id: 'mobo-ports',
              text: 'A los puertos verticales de la placa madre (arriba, junto a los USB).',
              hypothesisUpdates: [
                { id: 'h-cable-mon', status: 'INDICIO_FUERTE', reasoning: 'Si tenés placa de video dedicada, los puertos de la placa madre suelen estar deshabilitados por BIOS.' },
              ],
              nextActionSummary: 'Posible error de puerto: conectar a la salida de la placa gráfica dedicada.',
            },
          ],
        },
      ];

    default:
      return [
        {
          id: 'q-gen-1',
          title: 'ORIGEN Y CONSTANCIA',
          question: declaredTiming ? '¿EL SÍNTOMA SE REPRODUCE EN TODAS LAS SESIONES O SÓLO OCURRIÓ UNA VEZ?' : '¿EL PROBLEMA OCURRE DE MANERA PERMANENTE O SÓLO DE VEZ EN CUANDO?',
          options: [
            {
              id: 'constant',
              text: 'Se reproduce de manera predecible cada vez que utilizo el equipo en esas condiciones',
              hypothesisUpdates: [
                { id: 'h-driver-windows', status: 'INDICIO_MODERADO', reasoning: 'Falla reproducible de forma sistemática facilita el descarte técnico.' },
              ],
              nextActionSummary: 'Procederemos con pruebas estandarizadas de verificación.',
            },
            {
              id: 'intermittent',
              text: 'Es esporádico: a veces funciona normal y de pronto ocurre sin aviso',
              hypothesisUpdates: [
                { id: 'h-procesos-fondo', status: 'INDICIO_MODERADO', reasoning: 'Las fallas intermitentes suelen asociarse a picos de carga de fondo o temperaturas variables.' },
              ],
              nextActionSummary: 'Monitorearemos condiciones en tiempo real antes y durante el síntoma.',
            },
          ],
        },
        {
          id: 'q-gen-2',
          title: 'CAMBIOS PREVIOS',
          question: '¿RECUERDAS HABER REALIZADO ALGÚN CAMBIO FÍSICO O DE SOFTWARE ANTES DE QUE COMENZARA?',
          options: [
            {
              id: 'yes-changes',
              text: 'Sí: instalé nuevo hardware, actualicé programas o modifiqué configuraciones',
              hypothesisUpdates: [
                { id: 'h-driver-windows', status: 'INDICIO_FUERTE', reasoning: 'Si empezó tras una modificación, primero investigamos lo que cambió.' },
              ],
              nextActionSummary: 'Auditaremos el historial de cambios del sistema con herramientas de Windows.',
            },
            {
              id: 'no-changes',
              text: 'No: la máquina venía funcionando normalmente y no se realizaron cambios visibles',
              hypothesisUpdates: [
                { id: 'h-temp-potencia', status: 'INDICIO_MODERADO' },
                { id: 'h-memoria', status: 'INDICIO_MODERADO' },
              ],
              nextActionSummary: 'Descartaremos desgaste de componentes, temperatura o saturación de almacenamiento.',
            },
          ],
        },
      ];
  }
}

// Technical Tests Engine
export function getRecommendedTests(category: DiagnosticSymptomCategory): DiagnosticTestRecord[] {
  switch (category) {
    case 'REINICIOS_BSOD_APAGADOS':
    case 'FALLO_TRAS_ACTUALIZACION':
      return [
        {
          id: 'test-reliability-history',
          title: 'WINDOWS // HISTORIAL DEL CRIMEN (MONITOR DE CONFIABILIDAD)',
          goal: 'Identificar si el problema empezó exactamente tras una actualización, fallo de driver o cierre de servicio.',
          instructions: [
            'Presioná la combinación de teclas Win + R en tu teclado.',
            'Escribí el comando perfmon /rel y presioná Enter.',
            'Mirá el gráfico temporal de los últimos 10 a 30 días.',
            'Hacé clic en el día en que ocurrió el reinicio o cuando comenzó la falla.',
          ],
          whatToLookAt:
            'Buscá íconos rojos de eventos críticos (cierres de aplicaciones, fallas de Windows) y revisá la columna "Actualizaciones de software". ¿Hay un driver o parche instalado justo ese día?',
          technicalCommand: 'perfmon /rel',
          whatItDoes: 'Abre el Monitor de Confiabilidad de Windows con la cronología de eventos de software y hardware.',
          whatItReturns: 'Gráfica de estabilidad de 1 a 10 con detalle por día de errores críticos, advertencias e instalaciones.',
          whatItDoesNotProve:
            'No demuestra que un evento menor sea la causa, pero localiza el momento exacto en que la estabilidad se quebró.',
          evidenceNote: '',
        },
        {
          id: 'test-event-viewer-system',
          title: 'VISOR DE EVENTOS // ERRORES CRÍTICOS DEL SISTEMA',
          goal: 'Auditar los últimos eventos críticos registrados por el kernel antes de la interrupción.',
          instructions: [
            'Abrí PowerShell como Administrador (clic derecho en Inicio > Terminal / PowerShell como Administrador).',
            'Pegá y ejecutá la consulta de eventos del registro System.',
            'Revisá los últimos eventos con nivel Error (Nivel 2) o Crítico (Nivel 1).',
          ],
          whatToLookAt:
            'Buscá entradas de "Kernel-Power" (Evento 41: el sistema se reinició sin apagarse limpiamente) o "BugCheck" con código hexadecimal de volcado de memoria.',
          technicalCommand: 'Get-WinEvent -FilterHashtable @{LogName="System"; Level=1,2} -MaxEvents 15 | Select-Object TimeCreated, Id, ProviderName, Message | Format-Table -AutoSize',
          whatItDoes: 'Lee directamente del diario del kernel los últimos 15 eventos con severidad Error o Crítico.',
          whatItReturns: 'Hora exacta, ID de evento, origen del servicio o driver que lo disparó y descripción.',
          whatItDoesNotProve:
            'Un evento 41 sólo dice "se apagó de golpe", no demuestra si fue la fuente o la temperatura. Necesitamos correlacionarlo con la hora del síntoma.',
          evidenceNote: '',
        },
      ];

    case 'RENDIMIENTO_FPS_STUTTER':
      return [
        {
          id: 'test-frametime-audit',
          title: 'AUDITORÍA DE CADENCIA // EVALUACIÓN DE FRAMETIME Y 1% LOW',
          goal: 'Comprobar si el stuttering es dispersión de entrega de cuadros o sobrecarga de procesos de fondo.',
          instructions: [
            'Abrí el juego donde percibís los tirones en el modo habitual.',
            'Abrí el Administrador de tareas (Ctrl + Shift + Esc) en la pestaña "Rendimiento" en un segundo monitor o en segundo plano.',
            'Jugá durante 5 minutos hasta experimentar el primer tirón.',
            'Inmediatamente observá si hubo un pico de 100% en algún hilo de CPU o caída en la frecuencia de la GPU.',
          ],
          whatToLookAt:
            '¿La frecuencia del procesador se mantiene estable o cae abruptamente? ¿El tirón coincide con un acceso brusco al disco de fondo?',
          technicalCommand: 'wmic cpu get Name, CurrentClockSpeed, MaxClockSpeed',
          whatItDoes: 'Verifica la velocidad de reloj actual del procesador frente a su velocidad máxima nominal.',
          whatItReturns: 'Frecuencia en MHz de operación del procesador.',
          whatItDoesNotProve: 'No mide el frametime del juego directamente, pero confirma si el silicio entra en throttling.',
          evidenceNote: '',
        },
        {
          id: 'test-clean-boot-check',
          title: 'AISLAMIENTO DE PROCESOS // PRUEBA DE TAREAS Y DISCO',
          goal: 'Eliminar interferencia de servicios secundarios y launchers antes de culpar al hardware gráfico.',
          instructions: [
            'Cerrá todos los programas de segundo plano que no sean indispensables (Discord, launchers secundarios, navegadores con 20 pestañas).',
            'En el Administrador de tareas, verificá que la cantidad de procesos en reposo no supere los 100-120.',
            'Volvé a probar la misma escena del juego.',
          ],
          whatToLookAt:
            '¿El tirón desapareció o se redujo significativamente al liberar 1-2 GB de RAM y ciclos de fondo?',
          technicalCommand: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Name, CPU, WorkingSet',
          whatItDoes: 'Identifica los 5 procesos que mayor tiempo de CPU retienen en este momento.',
          whatItReturns: 'Nombres y consumo de memoria activa de los procesos principales.',
          whatItDoesNotProve: 'No modifica nada en tu sistema, sólo te permite observar quién compite por el procesador.',
          evidenceNote: '',
        },
      ];

    case 'ENCENDIDO_SIN_VIDEO':
      return [
        {
          id: 'test-display-ports',
          title: 'VERIFICACIÓN DE CADENA VISUAL // PUERTOS Y ENTRADAS',
          goal: 'Comprobar que la señal viaja por la salida correcta y que el monitor está sintonizado al canal adecuado.',
          instructions: [
            'Apagá el equipo y desconectá el cable de alimentación de la pared.',
            'Verificá que el cable de video (HDMI o DisplayPort) esté conectado firmemente en la placa de video horizontal.',
            'En el menú físico del monitor (botones traseros/inferiores), asegurate de que la entrada seleccionada sea exactamente la que estás usando (ej. HDMI 1 en lugar de HDMI 2 o DP).',
            'Reconectá y probá encender.',
          ],
          whatToLookAt:
            '¿El monitor pasa de "Sin señal" a detectar señal activa o permanece completamente dormido?',
          whatItDoes: 'Descarta el error más frecuente en talleres: cables en puertos equivocados o fuentes de entrada inactivas.',
          whatItReturns: 'Comprobación física directa del camino de video.',
          whatItDoesNotProve: 'No demuestra si la GPU tiene falla interna, pero elimina falsos positivos externos.',
          evidenceNote: '',
        },
        {
          id: 'test-ram-single-slot',
          title: 'PROTOCOLO DE DESCARTE DE MEMORIA // UN MÓDULO A LA VEZ',
          goal: 'Aislar si un módulo de RAM mal asentado o defectuoso está impidiendo el POST.',
          instructions: [
            '¡IMPORTANTE DE SEGURIDAD!: Apagá la PC, desconectá el cable de la pared y presioná el botón de encendido 5 segundos para descargar condensadores.',
            'Abrí la tapa lateral tocando una parte metálica sin pintar del gabinete para descargar estática.',
            'Retirá todos los módulos de memoria RAM excepto UNO solo.',
            'Colocá ese módulo único en el slot recomendado (generalmente Slot 2 / A2). Asegurate de que los clips hagan "CLIC" en ambos extremos.',
            'Conectá corriente y probá encender.',
          ],
          whatToLookAt:
            '¿La PC dio video con ese módulo único? Si no da video, repetí la prueba con el otro módulo en el mismo slot.',
          whatItDoes: 'Identifica si el culpable es un módulo particular, un slot sucio o un mal encastre físico.',
          whatItReturns: 'Diagnóstico diferencial módulo a módulo.',
          whatItDoesNotProve: 'No repara un módulo roto, pero confirma exactamente cuál de los dos funciona.',
          evidenceNote: '',
        },
      ];

    case 'DISCO_100':
      return [
        {
          id: 'test-disk-top-consumer',
          title: 'AISLAMIENTO FORENSE // ¿QUIÉN RETIENE LA COLA DE DISCO?',
          goal: 'Identificar el proceso o servicio exacto responsable del 100% de ocupación.',
          instructions: [
            'Abrí el Administrador de tareas (Ctrl + Shift + Esc).',
            'Hacé clic en el encabezado de la columna "Disco" para ordenar de mayor a menor consumo en MB/s.',
            'Observá el primer proceso en la cima de la lista durante 30 segundos.',
          ],
          whatToLookAt:
            '¿El proceso que más consume es "System", "Windows Search", "Antivirus", o una aplicación de usuario como Steam descargando parches?',
          technicalCommand: 'Get-Process | Sort-Object ReadOperationCount -Descending | Select-Object -First 5 Name, ReadOperationCount, WriteOperationCount',
          whatItDoes: 'Lista los procesos con mayor cantidad de lecturas y escrituras acumuladas.',
          whatItReturns: 'Operaciones totales de I/O por ejecutable.',
          whatItDoesNotProve: 'No indica si el disco tiene sectores dañados físicos, pero evidencia la demanda de software.',
          evidenceNote: '',
        },
        {
          id: 'test-system-health-scan',
          title: 'VERIFICACIÓN DE INTEGRIDAD // DISM Y SFC SIN MODIFICAR',
          goal: 'Verificar si existen archivos de sistema corruptos en la imagen de Windows sin realizar cambios a ciegas.',
          instructions: [
            'Abrí Terminal / PowerShell como Administrador.',
            'Ejecutá el comando de escaneo seguro DISM /ScanHealth.',
            'Esperá que llegue al 100% de verificación.',
          ],
          whatToLookAt:
            '¿El informe dice "No se detectaron daños en el almacén de componentes" o informa corrupción detectable?',
          technicalCommand: 'DISM /Online /Cleanup-Image /ScanHealth',
          whatItDoes: 'Verifica la integridad de la imagen de Windows contra los manifiestos oficiales de Microsoft.',
          whatItReturns: 'Estado: Saludable o Con daños detectados.',
          whatItDoesNotProve: 'No modifica ningún archivo; sólo audita la salud de la imagen sin alterar nada.',
          evidenceNote: '',
        },
      ];

    case 'RAM_NO_DETECTADA':
      return [
        {
          id: 'test-ram-bios-vs-win',
          title: 'RAM INSTALADA VS DETECTADA // LECTURA DE HARDWARE',
          goal: 'Verificar si la placa base ve ambos módulos físicamente en el bus antes de que Windows cargue.',
          instructions: [
            'Presioná Win + R, escribí msinfo32 y presioná Enter.',
            'Buscá las líneas: "Memoria física instalada (RAM)" y "Memoria física total".',
            'Anotá ambos valores.',
          ],
          whatToLookAt:
            '¿La memoria instalada muestra el total físico (ej. 16 GB) pero la total utilizable muestra menos (ej. 7.9 GB)? Si es así, hay memoria reservada para hardware o un canal desactivado.',
          technicalCommand: 'Get-CimInstance Win32_PhysicalMemory | Select-Object DeviceLocator, Capacity, Speed, ConfiguredClockSpeed',
          whatItDoes: 'Consulta el hardware físico de cada módulo instalado por ranura.',
          whatItReturns: 'Slot donde está colocado, capacidad en bytes y velocidad configurada.',
          whatItDoesNotProve: 'No repara la configuración de dual channel, pero demuestra si la placa lee el chip SPD.',
          evidenceNote: '',
        },
      ];

    case 'RED_LAG':
      return [
        {
          id: 'test-progressive-network-ping',
          title: 'CADENA DE RED // TU PC → ROUTER → INTERNET → SERVIDOR',
          goal: 'Aislar en qué tramo de la conexión se produce la latencia o pérdida de paquetes.',
          instructions: [
            'Abrí PowerShell o Símbolo del sistema.',
            'Paso 1: Hacé ping a tu router local (ej. ping 192.168.1.1 -n 10).',
            'Paso 2: Hacé ping a un DNS público (ej. ping 1.1.1.1 -n 10).',
            'Observá los tiempos en milisegundos y si hay paquetes perdidos.',
          ],
          whatToLookAt:
            'Si el ping al router da más de 5 ms o pierde paquetes, el problema es tu Wi-Fi o cable local. Si al router da <1 ms pero a 1.1.1.1 da 200 ms, el problema es tu proveedor (ISP).',
          technicalCommand: 'Test-NetConnection -ComputerName 1.1.1.1 -InformationLevel Detailed',
          whatItDoes: 'Prueba la resolución de nombres, latencia RTT y ruta básica a Internet.',
          whatItReturns: 'Latencia promedio en milisegundos y éxito de conexión TCP/ICMP.',
          whatItDoesNotProve: 'No mide el servidor de un juego específico, pero aisla si tu conexión local es estable.',
          evidenceNote: '',
        },
      ];

    default:
      return [
        {
          id: 'test-gen-reliability',
          title: 'WINDOWS // MONITOR DE CONFIABILIDAD (PERFMON /REL)',
          goal: 'Auditar los eventos críticos e instalaciones del sistema en los últimos días.',
          instructions: [
            'Presioná Win + R.',
            'Escribí perfmon /rel y presioná Enter.',
            'Revisá los días de mayor inestabilidad.',
          ],
          whatToLookAt: '¿Qué aplicación o controlador reportó fallas críticas en los días recientes?',
          technicalCommand: 'perfmon /rel',
          whatItDoes: 'Muestra la cronología visual de confiabilidad del equipo.',
          whatItReturns: 'Historial de errores de aplicaciones y fallos de Windows.',
          whatItDoesNotProve: 'No concluye la causa automáticamente sin análisis del síntoma.',
          evidenceNote: '',
        },
      ];
  }
}

// Generate Intervention Proposal based on evidence
export function generateInterventionProposal(
  category: DiagnosticSymptomCategory,
  hypotheses: DiagnosticHypothesis[],
  tests: DiagnosticTestRecord[]
): DiagnosticInterventionProposal {
  const strongH = hypotheses.find((h) => h.status === 'INDICIO_FUERTE') || hypotheses[0];

  switch (category) {
    case 'RENDIMIENTO_FPS_STUTTER':
      return {
        whatToChange: 'Cierre completo de clientes secundarios y fijación de límite de FPS (FPS Cap) sincronizado.',
        why: 'Eliminar competencia de hilos en CPU y estabilizar la cadencia de frametime para que el 1% Low no se hunda.',
        backingEvidence:
          'Se detectó dispersión en la entrega de cuadros con fluctuaciones en procesos en segundo plano.',
        riskLevel: 'MINIMO',
        reversible: true,
        howToRevert: 'Reabrir las aplicaciones secundarias y quitar el límite de cuadros en los ajustes del juego.',
        executed: false,
        retestCondition: 'Jugar 10 minutos la misma partida o modo de juego manteniendo la misma resolución.',
      };

    case 'REINICIOS_BSOD_APAGADOS':
      return {
        whatToChange:
          strongH?.componentCategory === 'TEMPERATURA'
            ? 'Inspección de flujo de aire, limpieza de filtro antipolvo y verificación de ventiladores en funcionamiento.'
            : 'Desinstalación limpia del controlador conflictivo identificado en el Monitor de Confiabilidad mediante DDU o modo seguro.',
        why: 'Remover la condición detonante (térmica o de controlador en espacio de kernel) antes de reemplazar piezas físicas.',
        backingEvidence:
          'El registro de eventos y la cronología demostraron interrupción correlacionada con carga prolongada o actualización reciente.',
        riskLevel: 'BAJO',
        reversible: true,
        howToRevert: 'Volver a instalar la versión previa del controlador o restaurar perfil de ventilación.',
        executed: false,
        retestCondition: 'Someter el equipo a 15 minutos de la misma carga de juego donde antes ocurría el reinicio.',
      };

    case 'ENCENDIDO_SIN_VIDEO':
      return {
        whatToChange: 'Reasentamiento firme del cable en el puerto de video dedicado y limpieza de contactos del módulo de RAM primario.',
        why: 'Garantizar el paso de señal digital y la superación de la prueba POST de memoria de la placa base.',
        backingEvidence: 'Ventiladores encienden normalmente pero no hay inicialización de pantalla.',
        riskLevel: 'BAJO',
        reversible: true,
        howToRevert: 'Volver a colocar los componentes en la posición inicial.',
        executed: false,
        retestCondition: 'Conectar cable de corriente e iniciar el equipo verificando mensaje en monitor.',
      };

    case 'DISCO_100':
      return {
        whatToChange: 'Pausar temporalmente el servicio Windows Search o la tarea de indexación para comprobar el impacto en el disco.',
        why: 'Comprobar si el 100% de uso se debe a cola de indexación de archivos o a fallo de la unidad.',
        backingEvidence: 'El Administrador de tareas identificó saturación sostenida de I/O en segundo plano.',
        riskLevel: 'MINIMO',
        reversible: true,
        howToRevert: 'Reanudar el servicio Windows Search desde la consola de Servicios (services.msc).',
        executed: false,
        retestCondition: 'Observar el Administrador de tareas durante 2 minutos en reposo.',
      };

    case 'RED_LAG':
      return {
        whatToChange: 'Prueba de conexión directa por cable Ethernet o cambio de canal en banda de 5 GHz en el router.',
        why: 'Aislar si la latencia proviene de la saturación del espectro inalámbrico local o de la ruta del ISP.',
        backingEvidence: 'El ping progresivo demostró saltos en el primer tramo (PC al router local).',
        riskLevel: 'MINIMO',
        reversible: true,
        howToRevert: 'Volver a conectar por la red Wi-Fi anterior.',
        executed: false,
        retestCondition: 'Repetir la prueba de ping continuo (ping 1.1.1.1 -n 20) durante una partida.',
      };

    default:
      return {
        whatToChange: 'Aislar la variable identificada en la auditoría manteniendo el resto del sistema idéntico.',
        why: 'Método científico EVO LABS: cambiar una sola variable para comprobar causa real sin alterar el entorno.',
        backingEvidence: 'Evidencia registrada durante la fase de preguntas y pruebas.',
        riskLevel: 'MINIMO',
        reversible: true,
        howToRevert: 'Restablecer el parámetro modificado a su valor previo.',
        executed: false,
        retestCondition: 'Repetir la condición en la que ocurría la anomalía.',
      };
  }
}
