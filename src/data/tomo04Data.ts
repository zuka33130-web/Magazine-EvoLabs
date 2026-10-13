export interface Tomo04ModuleItem {
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
  portableTool: string;
  keyTakeaways: string[];
  multimeterMeasurement?: string;
  safetyBadge: 'VERDE' | 'AMARILLO' | 'ROJO';
  practicalCommand?: string;
}

export interface NotebookTool {
  id: string;
  name: string;
  category: string;
  whatItDoes: string;
  howToUse: string;
  whatItProves: string;
  whatItCannotProve: string;
  riskNotice: string;
  safetyBadge: 'VERDE' | 'AMARILLO' | 'ROJO';
}

export interface Tomo04Case {
  id: string;
  title: string;
  model: string;
  symptom: string;
  hypothesis: string;
  measurement: string;
  discarded: string;
  rootCause: string;
  repairAction: string;
  validation: string;
}

export const TOMO_04_META = {
  number: '04',
  volumeLabel: 'Tomo 04',
  title: 'REPARÁ TU NOTEBOOK // LA BIBLIA DEL REPARADOR DE PORTÁTILES',
  subtitle: 'Desmontaje seguro, cargadores, DC Jack, baterías, pantallas, flex, refrigeración y micro-arquitectura',
  themeColor: '#A855F7',
  secondaryColor: '#C084FC',
  badge: 'TALLER PORTÁTIL & MICROMECÁNICA',
  edition: 'Edición Maestra de Portátiles 2026',
  totalPages: 41,
  manifestoPhrase: 'UNA NOTEBOOK NO ES UNA PC DE ESCRITORIO CHIQUITA. ES UN ECOSISTEMA TÉRMICO Y MECÁNICO INTEGRADO.',
  description: 'Guía pericial e independiente para diagnosticar, desarmar y reparar computadoras portátiles. Desde la tensión del cargador hasta el conector eDP y el chip EC.',
};

export const NOTEBOOK_BASE_KIT: NotebookTool[] = [
  {
    id: 'nt01',
    name: 'Spudgers Plásticos y Púas de Apertura de Guitarra',
    category: 'DESMONTAJE SEGURO',
    whatItDoes: 'Destraban las pestañas (clips) plásticas del chasis perimetral sin rayar el aluminio ni marcar el plástico.',
    howToUse: 'Insertar la punta fina en la ranura de unión y deslizar suavemente ejerciendo palanca hacia afuera hasta escuchar el destrabe.',
    whatItProves: 'Permite abrir la carcasa sin deformar las uniones.',
    whatItCannotProve: 'No detecta si queda un tornillo oculto sujetando la tapa.',
    riskNotice: 'Nunca uses destornilladores metálicos planos para hacer palanca en los bordes; romperán los clips plásticos para siempre.',
    safetyBadge: 'VERDE',
  },
  {
    id: 'nt02',
    name: 'Juego de Destornilladores de Precisión (PH00, PH0, Torx T5, Pentalobe)',
    category: 'MECÁNICA DE PRECISIÓN',
    whatItDoes: 'Calza con exactitud en los micro-tornillos de chasis, bisagras, cooler y unidades M.2.',
    howToUse: 'Aplicar presión vertical firme antes de girar para no falsear la cruz del tornillo.',
    whatItProves: 'Sujeción correcta sin forzar roscas.',
    whatItCannotProve: 'No detecta roscas plásticas fisuradas por dentro.',
    riskNotice: 'Usar una punta PH1 más grande en un tornillo PH00 barrerá la cabeza dejándolo trabado de por vida.',
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'nt03',
    name: 'Pinzas de Punta Fina Curva Antimagnéticas (Tipo Bruselas)',
    category: 'MANIPULACIÓN DE CONECTORES',
    whatItDoes: 'Levantan las pestañas de seguridad de los conectores ZIF y manipulan cables coaxiales de antenas Wi-Fi.',
    howToUse: 'Sujetar las lengüetas plásticas de los flex; jamás tirar directamente del cable plano.',
    whatItProves: 'Inserción simétrica de flex de teclado y touchpad.',
    whatItCannotProve: 'No detecta cortes microscópicos dentro de las pistas del flex.',
    riskNotice: 'Si la pinza metálica toca la placa madre con la batería interna aún conectada, causará un cortocircuito mortal.',
    safetyBadge: 'ROJO',
  },
  {
    id: 'nt04',
    name: 'Organizador Magnético de Tornillos (Mapa de Tornillos)',
    category: 'ORGANIZACIÓN DE BANCO',
    whatItDoes: 'Mantiene los tornillos en la posición exacta correspondiente a cada orificio de la carcasa.',
    howToUse: 'Dibujar el contorno de la notebook en una hoja cuadriculada y apoyar cada tornillo retirado en su lugar.',
    whatItProves: 'Garantiza que cada tornillo vuelva a su lugar original sin sobrar ni faltar ninguno.',
    whatItCannotProve: 'No evita roscas dañadas previamente.',
    riskNotice: 'Poner un tornillo de 6mm en un orificio de 4mm atravesará el palmrest de plástico perforando el lado visible del teclado.',
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'nt05',
    name: 'Multímetro Digital con Puntas de Aguja Ultrafinas',
    category: 'MEDICIÓN ELÉCTRICA',
    whatItDoes: 'Permite medir voltajes de 19V en el pin central del DC Jack y tensiones de 3.3V en componentes SMD minúsculos.',
    howToUse: 'Apoyar la punta de aguja en el contacto deseado sin tocar masa con el cuerpo de la punta.',
    whatItProves: 'Entrega de voltaje del cargador y presencia de rieles de alimentación en placa.',
    whatItCannotProve: 'No mide comunicación de datos en el pin central inteligente (ID pin).',
    riskNotice: 'Puntas gruesas de multímetro estándar de electricidad resbalan fácilmente y puentean pines de 19V con líneas lógicas de 3V.',
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'nt06',
    name: 'Linterna LED de Inspección de Alto Brillo',
    category: 'DIAGNÓSTICO ÓPTICO',
    whatItDoes: 'Ilumina la superficie de la pantalla LCD para diagnosticar si la imagen existe pero el backlight está apagado.',
    howToUse: 'Apuntar la luz oblicuamente sobre la pantalla encendida y buscar siluetas del logo de Windows o iconos.',
    whatItProves: 'Diferencia al instante falla de pantalla negra total vs falla del circuito de iluminación LED (backlight).',
    whatItCannotProve: 'No repara el fusible de backlight en la placa madre.',
    riskNotice: 'Ninguno.',
    safetyBadge: 'VERDE',
  },
];

export const TOMO_04_MODULES: Tomo04ModuleItem[] = [
  {
    id: 'not01',
    moduleNumber: '01',
    title: 'ANTES DE ABRIR UNA NOTEBOOK',
    subtitle: 'Identificación de modelo en etiqueta, Service Manual y regla del mapa de tornillos',
    categoryTag: 'PROTOCOLO DE INGRESO',
    readTime: '9 min',
    decisionTree: {
      question: '¿Localizaste el modelo exacto en la etiqueta inferior (ej: Dell Inspiron 15 3525 en vez de solo "Dell Inspiron")?',
      yesAction: 'Buscar el Service Manual oficial del fabricante para conocer la ubicación de tornillos y clips.',
      noAction: 'Encender la máquina o revisar el BIOS para leer el Service Tag / Model Number antes de tocar el destornillador.',
    },
    portableTool: 'Smartphone con cámara para registrar fotos de cada etapa de desarme.',
    keyTakeaways: [
      'Una notebook no es una PC de escritorio: la disposición interna varía completamente entre modelos del mismo año.',
      'El peligro de la longitud de tornillos: Los fabricantes usan tornillos de 3mm, 5mm y 8mm en la misma carcasa. Colocar un tornillo largo en un orificio corto perforará la carcasa plástica del lado del teclado.',
      'El mapa de tornillos en papel: Dibujar la silueta de la máquina en una hoja y pegar con cinta cada tornillo en la posición de donde fue retirado.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not02',
    moduleNumber: '02',
    title: 'HERRAMIENTAS PARA NOTEBOOK',
    subtitle: 'Spudgers, púas plásticas, pinzas de precisión y multímetro de agujas',
    categoryTag: 'INSTRUMENTAL DE PRECISIÓN',
    readTime: '8 min',
    decisionTree: {
      question: '¿Tenés herramientas plásticas dieléctricas listas para abrir las trabas de la carcasa?',
      yesAction: 'Comenzar la apertura por el lado de las bisagras o el área de puertos.',
      noAction: 'ALTO. Jamás uses cuchillos, tijeras ni destornilladores metálicos para separar las tapas plásticas.',
    },
    portableTool: 'Kit de púas y spudgers de nylon.',
    keyTakeaways: [
      'Puntas imantadas de precisión: Evitan que un tornillo milimétrico caiga debajo de la placa madre y quede suelto causando un cortocircuito.',
      'Pinzas curvas tipo Bruselas: Indispensables para tomar los cables coaxiales de antena Wi-Fi por su conector dorado sin arrancar el cable.',
      'Cepillo antiestático de cerdas suaves: Para retirar pelusa y cabellos del ventilador blower sin inducir cargas estáticas.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not03',
    moduleNumber: '03',
    title: 'CÓMO DESARMAR SIN ROMPER',
    subtitle: 'Tornillos ocultos bajo patas de goma, clips perimetrales y conectores ZIF',
    categoryTag: 'MECÁNICA DE CARCASA',
    readTime: '13 min',
    decisionTree: {
      question: '¿La carcasa opone resistencia al intentar levantarla a pesar de haber retirado todos los tornillos visibles?',
      yesAction: 'DETENER FUERZA. Hay tornillos ocultos debajo de las patas de goma adhesivas o bajo la etiqueta de garantía.',
      noAction: 'Deslizar la púa plástica alrededor del perímetro liberando los clips uno a uno con un "clic" suave.',
    },
    portableTool: 'Púa plástica de apertura + Pinzas finas para conectores ZIF.',
    keyTakeaways: [
      'REGLA SAGRADA NÚMERO UNO: Lo primero que se desconecta al abrir una notebook es la BATERÍA INTERNA. Nunca toques ningún componente con la batería enchufada.',
      'Conectores ZIF (Zero Insertion Force): Se levanta la pestaña plástica negra hacia arriba 90 grados y el cable plano flex sale solo sin fuerza.',
      'Tornillos ocultos típicos: Debajo de las dos tiras largas de goma de apoyo antideslizante se esconden habitualmente entre 2 y 4 tornillos principales.',
    ],
    safetyBadge: 'ROJO',
  },
  {
    id: 'not04',
    moduleNumber: '04',
    title: 'LA NOTEBOOK NO ENCIENDE NADA',
    subtitle: 'Ruta pericial completa: cargador -> toma -> LED de carga -> DC Jack -> botón en teclado',
    categoryTag: 'FALLA CERO ENERGÍA',
    readTime: '12 min',
    decisionTree: {
      question: '¿Al enchufar el cargador enciende el LED testigo de carga de la notebook (blanco o naranja)?',
      yesAction: 'El cargador y el DC Jack entregan los 19V a la placa madre. La falla está en el botón de encendido o en el chip EC.',
      noAction: 'Falla en la etapa de entrada: cargador sin salida, cable cortado, DC Jack desoldado o corto en los MOSFETs de entrada.',
    },
    portableTool: 'Multímetro digital en 20V DC.',
    multimeterMeasurement: '20V DC: Medir en el conector del cargador (exterior negativo, interior positivo). Tensión esperada = 19.0V a 20.0V.',
    keyTakeaways: [
      'El cargador de notebook: Medir primero el conector macho antes de desarmar la máquina; el 45% de los casos son cables cortados a la salida de la fuente.',
      'Batería interna bloqueada: Desconectar la batería interna, presionar el botón de encendido 30 segundos sin corriente y reconectar solo el cargador.',
      'Falla del botón en teclados modernos: Si el botón de encendido es una tecla más del teclado matricial, un derrame previo de líquido puede haber cortado su pista.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not05',
    moduleNumber: '05',
    title: 'EL CARGADOR Y USB-C POWER DELIVERY',
    subtitle: 'Voltajes 19V/20V, polaridad central, pin de aguja ID y cargadores USB-C PD',
    categoryTag: 'ALIMENTACIÓN EXTERNA',
    readTime: '11 min',
    decisionTree: {
      question: '¿El cargador es de tipo tradicional de barril cilíndrico o es un cargador USB-C PD?',
      yesAction: 'Tradicional: Medir voltaje continuo directo con multímetro (19.5V fijos).',
      noAction: 'USB-C PD: No entrega 20V hasta que la notebook negocia el perfil Power Delivery mediante el protocolo CC.',
    },
    portableTool: 'Multímetro digital + Medidor USB-C Tester de voltaje y corriente.',
    keyTakeaways: [
      'El pin de aguja central inteligente (Dell / HP): Ese pin no lleva corriente; lleva una señal analógica/datos que le dice a la notebook el wattage exacto del cargador.',
      'El síntoma "Conectado y sin cargarse": Ocurre cuando el pin ID central se cortó; la notebook enciende pero bloquea la carga de la batería por seguridad.',
      'Cargadores USB-C genéricos de celular: Tienen perfiles de 5V/9V (15W); una notebook requiere cargadores compatibles con perfil de 20V y al menos 45W o 65W.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not06',
    moduleNumber: '06',
    title: 'EL DC JACK Y PUERTO DE ENTRADA',
    subtitle: 'DC Jack con cable flex vs soldado en placa, fracturas mecánicas y falso contacto',
    categoryTag: 'CONECTOR DE ENERGÍA',
    readTime: '10 min',
    decisionTree: {
      question: '¿El DC Jack está montado con un cable independiente hacia la placa madre (harness) o está soldado directamente al PCB?',
      yesAction: 'Con cable: Reemplazo facilísimo en 5 minutos sin usar soldador de estaño.',
      noAction: 'Soldado: Requiere desoldar con malla y soldar un jack nuevo respetando los pads de anclaje de masa.',
    },
    portableTool: 'Multímetro en continuidad y repuesto de DC Jack.',
    keyTakeaways: [
      'La falla del "jueguito" en el cable: Si la notebook solo carga cuando se dobla el cable en cierta posición, el pin interno del jack está quebrado por fatiga.',
      'Peligro de chispazo en jack dañado: El falso contacto repetido funde el plástico del jack por temperatura e inyecta picos de voltaje a la línea de entrada.',
      'Sujeción mecánica con bisagra: En muchos modelos, la bisagra metálica superior sujeta el jack; si la bisagra se afloja, el jack se hunde hacia adentro.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not07',
    moduleNumber: '07',
    title: 'LA BATERÍA INTERNA',
    subtitle: 'Baterías hinchadas (peligro inminente), ciclos de vida, degradación y battery report',
    categoryTag: 'ALMACENAMIENTO QUÍMICO',
    readTime: '12 min',
    decisionTree: {
      question: '¿La batería presenta cualquier tipo de abultamiento, hinchazón o empuja el touchpad hacia arriba?',
      yesAction: 'PELIGRO CRÍTICO DE INCENDIO. Desconectar y retirar la batería inmediatamente a un contenedor ignífugo.',
      noAction: 'Batería plana y estable. Diagnosticar degradación de celdas mediante informe de Windows.',
    },
    portableTool: 'Comando de terminal powercfg /batteryreport.',
    practicalCommand: 'powercfg /batteryreport /output "$HOME\\Desktop\\battery_report.html"',
    keyTakeaways: [
      'Baterías de Polímero de Litio (Li-Po): Al envejecer o sobrecalentarse generan gas que infla la celda; una celda hinchada perforada genera fuego químico incombustible con agua.',
      'El síntoma del touchpad duro: Si el touchpad de la notebook ya no hace clic físico hacia abajo, el 90% de las veces es la batería hinchada empujándolo desde adentro.',
      'Uso sin batería interna: Casi todas las notebooks modernas pueden funcionar conectadas únicamente a su cargador oficial con la batería desconectada.',
    ],
    safetyBadge: 'ROJO',
  },
  {
    id: 'not08',
    moduleNumber: '08',
    title: 'BOTÓN DE ENCENDIDO Y TECLADO',
    subtitle: 'Botón independiente con flex vs botón integrado en la matriz del teclado',
    categoryTag: 'CIRCUITO DE ENCENDIDO',
    readTime: '9 min',
    decisionTree: {
      question: '¿El botón de encendido está integrado en la esquina superior derecha del teclado como una tecla común?',
      yesAction: 'Si el teclado sufrió humedad o café, la línea de encendido puede estar cortocircuitada o permanentemente abierta.',
      noAction: 'Botón en placa auxiliar: Verificar el cable plano flex que une la placa del botón con la placa madre.',
    },
    portableTool: 'Pinzas de precisión para desconectar el flex del teclado.',
    keyTakeaways: [
      'Prueba de encendido por cortocircuito de pines: En placas con conector de teclado, tocar momentáneamente el pin de PWR_BTN con GND enciende la máquina.',
      'El síntoma del encendido solo al abrir la tapa: Función moderna "Flip to Boot" o sensor Hall magnético que enciende la máquina sin tocar el botón.',
      'Reemplazo de teclado completo: Cuando el botón está integrado en el teclado, reemplazar el teclado resuelve la falla de no encendido.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not09',
    moduleNumber: '09',
    title: 'ENCIENDE PERO NO DA VIDEO',
    subtitle: 'Prueba de la linterna en pantalla, salida HDMI externa, backlight y flex eDP',
    categoryTag: 'DIAGNÓSTICO DE PANTALLA',
    readTime: '13 min',
    decisionTree: {
      question: '¿Al conectar un monitor externo por el puerto HDMI la notebook muestra imagen perfectamente en el monitor externo?',
      yesAction: 'La CPU, RAM, GPU y placa madre funcionan 100%. La falla está confinada a la pantalla interna, el cable flex o el circuito de backlight.',
      noAction: 'Falla en la placa base, memoria RAM SO-DIMM o bios corrupto; el equipo no está completando el POST.',
    },
    portableTool: 'Linterna LED potente + Monitor externo HDMI con cable.',
    keyTakeaways: [
      'La prueba reina de la linterna: Apuntar con una linterna pegada al vidrio de la pantalla a oscuras. Si ves la silueta de Windows, el panel genera video pero la luz LED trasera está apagada.',
      'Fusible de backlight quemado: Un fusible SMD microscópico (rotulado con una letra "F" o "P") cerca del conector eDP suele quemarse si se conecta la pantalla con la batería puesta.',
      'Sensor Hall magnético trabado: Un pequeño imán en el marco de la pantalla le avisa a la placa que la tapa está cerrada; si el sensor falla, la pantalla permanece apagada creyendo que la tapa está baja.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not10',
    moduleNumber: '10',
    title: 'EL PANEL LCD Y CONECTOR eDP',
    subtitle: 'Paneles IPS vs TN, conector eDP de 30 pines vs 40 pines, líneas y roturas',
    categoryTag: 'PANEL VISUAL',
    readTime: '11 min',
    decisionTree: {
      question: '¿La pantalla muestra líneas verticales de colores que cambian al flexionar suavemente las esquinas del marco?',
      yesAction: 'Panel LCD quebrado internamente o fallo en los chips COF (Chip-on-Film). Requiere cambio de panel.',
      noAction: 'Comprobar el conector eDP detrás de la pantalla; verificar que la cinta de traba dorada no esté suelta.',
    },
    portableTool: 'Púa plástica para desclavar el bisel (bezel) frontal de la pantalla.',
    keyTakeaways: [
      'Estándar eDP (Embedded DisplayPort): Conector de 30 pines para pantallas estándar (60Hz FHD) y 40 pines para pantallas táctiles, 4K o de alta tasa de refresco (144Hz+).',
      'Desconectar SIEMPRE la batería antes de tocar el flex eDP: En el conector de la pantalla viaja la línea de alimentación de los LEDs de 19 Voltios justo al lado de líneas lógicas de 3V.',
      'Número de parte del panel: Para pedir el repuesto exacto, leer la etiqueta plateada detrás del panel retirado (ej: LP156WFC-SPDB).',
    ],
    safetyBadge: 'ROJO',
  },
  {
    id: 'not11',
    moduleNumber: '11',
    title: 'EL CABLE FLEX DE PANTALLA',
    subtitle: 'El paso por la bisagra, fatiga por flexión, cortes internos y parpadeo al mover la tapa',
    categoryTag: 'TRANSMISIÓN DE SEÑAL',
    readTime: '10 min',
    decisionTree: {
      question: '¿La pantalla parpadea, pierde el color o se apaga justo cuando abrís o cerrás la tapa a un ángulo específico?',
      yesAction: 'Falla clásica de fatiga mecánica en el cable flex de pantalla: filamentos cortados dentro de la bisagra.',
      noAction: 'El flex está íntegro. El problema es el panel LCD o el conector en la placa madre.',
    },
    portableTool: 'Repuesto de flex eDP específico para el modelo exacto de notebook.',
    keyTakeaways: [
      'El punto de mayor estrés de una notebook: El mazo de cables flex pasa exactamente a través de la articulación de la bisagra izquierda o derecha.',
      'Micro-coaxiales internos: El flex de video no es un cable común; son decenas de cables coaxiales microscópicos soldados a un conector milimétrico.',
      'Ruta correcta de ruteo: Al armar, el cable debe quedar en el canal guía original; si queda mordido por un tornillo de la bisagra, entrará en cortocircuito.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not12',
    moduleNumber: '12',
    title: 'MEMORIA RAM SO-DIMM Y RAM SOLDADA',
    subtitle: 'DDR4 vs DDR5 SO-DIMM, muescas notch, y el desafío de la RAM Onboard',
    categoryTag: 'MEMORIA PORTÁTIL',
    readTime: '12 min',
    decisionTree: {
      question: '¿La notebook tiene ranuras físicas SO-DIMM para retirar el módulo de memoria?',
      yesAction: 'Retirar el módulo abriendo los clips metálicos laterales a 45 grados y limpiar contactos.',
      noAction: 'RAM soldada (LPDDR / Onboard): Si la memoria falla, requiere reemplazo de chips BGA en laboratorio de micro-electrónica o cambio de placa.',
    },
    portableTool: 'Alcohol isopropílico 99% + Módulo SO-DIMM de prueba.',
    keyTakeaways: [
      'El sistema de traba a 45 grados: El módulo se inserta inclinado a 45 grados hasta el fondo y luego se empuja hacia abajo hasta que los dos resortes metálicos hacen clic.',
      'DDR4 vs DDR5 SO-DIMM: Tienen voltajes distintos (1.2V vs 1.1V) y la muesca central (notch) está ubicada en posiciones milimétricamente diferentes para impedir errores.',
      'Mezcla de frecuencias: Si instalás un módulo de 3200 MHz junto a uno de 2400 MHz, ambos funcionarán a la velocidad del más lento (2400 MHz).',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not13',
    moduleNumber: '13',
    title: 'UNIDADES M.2 NVMe Y DISCOS 2.5"',
    subtitle: 'Formatos 2280 vs 2242, disipación térmica en espacio reducido y clonación',
    categoryTag: 'ALMACENAMIENTO COMPACTO',
    readTime: '10 min',
    decisionTree: {
      question: '¿La notebook tiene bahía M.2 para formato 2280 estándar (80mm) o formato corto 2242/2230?',
      yesAction: 'Verificar la posición del poste roscado antes de comprar la unidad de repuesto.',
      noAction: 'Equipos antiguos con disco mecánico SATA 2.5": Reemplazarlo por un SSD SATA de 2.5" multiplica por 5 la velocidad de respuesta.',
    },
    portableTool: 'Enclosure externo USB-C para SSD M.2 para clonar el disco viejo.',
    keyTakeaways: [
      'Thermal Pad obligatorio en M.2 de notebook: El SSD queda encerrado sin ventilación directa; el thermal pad azul debe hacer contacto con el chasis metálico o la lámina de cobre.',
      'Tornillo de fijación M.2: Es un tornillo métrico diminuto M2x3mm; no apretar con fuerza excesiva para no doblar el PCB del SSD.',
      'Clonación previa con batería sana: Clonar el disco original al nuevo usando un enclosure USB antes de retirar la unidad vieja.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not14',
    moduleNumber: '14',
    title: 'SISTEMA TÉRMICO: BLOWER, HEATPIPE Y RADIADOR',
    subtitle: 'La "alfombra de pelusa" en las aletas de cobre, pasta térmica seca y ventilador trabado',
    categoryTag: 'DISIPACIÓN PORTÁTIL',
    readTime: '13 min',
    decisionTree: {
      question: '¿El ventilador blower gira a máxima velocidad con ruido de turbina pero el aire que sale por la rejilla exterior sale casi frío?',
      yesAction: 'ALFOMBRA DE PELUSA DETECTADA: Las aletas de cobre del radiador están completamente tapadas por dentro como un filtro sucio.',
      noAction: 'Si el aire sale ardiendo y la máquina se apaga sola, la pasta térmica está fosilizada o el heatpipe perdió el gas.',
    },
    portableTool: 'Pincel antiestático + Alcohol isopropílico + Pasta térmica de alta viscosidad.',
    keyTakeaways: [
      'La trampa visual del radiador: Mirar el ventilador desde afuera no sirve; la pelusa se acumula en la cara interior oculta de las aletas de cobre.',
      'El Heatpipe de cobre: Es un tubo sellado al vacío con una gota de líquido que se evapora en el micro y se condensa en el radiador; si se perfora o quiebra, no conduce calor.',
      'Pasta térmica para notebook: Debe ser densa y de alta viscosidad (ej: Arctic MX-4 / Noctua NT-H1); pastas líquidas sufren el efecto "pump-out" en pocas semanas por la dilatación térmica.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not15',
    moduleNumber: '15',
    title: 'CPU Y GPU INTEGRADAS (CHIPS BGA)',
    subtitle: 'El procesador soldado con esferas de estaño, limitaciones hogareñas y diagnóstico',
    categoryTag: 'MICRO-ARQUITECTURA',
    readTime: '11 min',
    decisionTree: {
      question: '¿El procesador o la gráfica dedicada están soldados directamente a la placa madre sin socket desmontable?',
      yesAction: 'Prácticamente el 100% de las notebooks modernas son BGA (Ball Grid Array). No se pueden cambiar manualmente como en una PC de escritorio.',
      noAction: 'El diagnóstico debe orientarse a descartar memoria, alimentación y firmware antes de declarar muerte de chip.',
    },
    portableTool: 'Inspección térmica con HWiNFO64.',
    keyTakeaways: [
      'Qué es BGA: Cientos de micro-esferas microscópicas de soldadura de estaño debajo del chip que lo unen directamente al circuito de la placa.',
      'El mito del "Reballing casero con pistola de calor": Calentar la placa madre con una pistola de calor en la cocina dobla el PCB y destruye las pistas internas multicapa.',
      'Thermal Throttling agresivo: Cuando una CPU de notebook alcanza 95°C, reduce su multiplicador para no quemarse; la máquina se siente lenta como si tuviera un virus.',
    ],
    safetyBadge: 'ROJO',
  },
  {
    id: 'not16',
    moduleNumber: '16',
    title: 'INSPECCIÓN DE LA MOTHERBOARD DE NOTEBOOK',
    subtitle: 'Primeros MOSFETs de 19V, bobinas de 3.3V y 5V Always-On y chip EC (Embedded Controller)',
    categoryTag: 'MICRO-ELECTRÓNICA',
    readTime: '14 min',
    decisionTree: {
      question: '¿Al conectar el cargador hay voltaje en las bobinas principales de 3.3V y 5V Always-On antes de presionar el botón de encendido?',
      yesAction: 'La etapa de standby primaria está viva. La orden de encendido debe salir del chip EC hacia el PCH.',
      noAction: 'El cortocircuito está en los dos primeros MOSFETs de entrada de 19V o en el integrado regulador de carga (Charging IC).',
    },
    portableTool: 'Multímetro digital con puntas de aguja.',
    keyTakeaways: [
      'El chip EC (Embedded Controller / KBC): El cerebro de bajo nivel que controla el teclado, el ventilador, la carga de batería y recibe la pulsación del botón de encendido.',
      'Bobinas Always-On: En una placa madre sana, las fuentes conmutadas de 3.3V y 5V deben estar presentes en todo momento apenas se conecta el cargador.',
      'Rastros de sulfato blanco o verdoso: Indican ingreso previo de humedad o transpiración que corroyó las patitas de chips SMD.',
    ],
    safetyBadge: 'ROJO',
  },
  {
    id: 'not17',
    moduleNumber: '17',
    title: 'PROTOCOLO DE EMERGENCIA: DAÑO POR LÍQUIDO',
    subtitle: 'Qué hacer de inmediato, qué jamás hacer (arroz/secador) y baño con isopropílico',
    categoryTag: 'SALVATAJE CRÍTICO',
    readTime: '12 min',
    decisionTree: {
      question: '¿Se derramó líquido (agua, café, gaseosa) sobre la notebook recién encendida?',
      yesAction: 'DESCONECTAR EL CARGADOR Y RETIRAR LA BATERÍA EN MENOS DE 10 SEGUNDOS. NO INTENTAR GUARDAR ARCHIVOS NI APAGAR DESDE WINDOWS.',
      noAction: 'Si la máquina ya se apagó sola, NO INTENTES PRENDERLA para "ver si todavía anda".',
    },
    portableTool: 'Alcohol isopropílico 99.8% + Tina ultrasónica o cubeta con cepillo suave.',
    keyTakeaways: [
      'El mito del arroz: El arroz no absorbe la corrosión galvánica que el líquido produce cuando hay corriente eléctrica circulando entre pistas.',
      'El calor del secador de pelo: Secar con aire caliente de secador derrite las teclas plásticas y evapora el agua dejando concentrada la sal y el azúcar sobre los circuitos.',
      'El procedimiento pericial de rescate: Desmontar la placa madre por completo, lavar con abundante alcohol isopropílico al 99.8% para desplazar el agua y secar 24 horas.',
    ],
    safetyBadge: 'ROJO',
  },
  {
    id: 'not18',
    moduleNumber: '18',
    title: 'EL TECLADO DE NOTEBOOK',
    subtitle: 'Matriz de membrana, teclas desprendidas, flex ZIF y teclados remachados en plástico',
    categoryTag: 'DISPOSITIVO DE ENTRADA',
    readTime: '10 min',
    decisionTree: {
      question: '¿El teclado está atornillado por separado o está remachado con puntos de plástico fundido al palmrest?',
      yesAction: 'Atornillado: Fácil cambio retirando los micro-tornillos traseros.',
      noAction: 'Remachado en plástico: Evaluar cambiar el palmrest completo (ensamble con carcasa) para un acabado original de fábrica.',
    },
    portableTool: 'Herramienta para soldar remaches plásticos o repuesto de palmrest completo.',
    keyTakeaways: [
      'El mecanismo de tijera de las teclas: Si una tecla se salió, verificar que las dos piezas plásticas blancas en tijera no tengan los pivotes rotos antes de presionar la tecla.',
      'Falla de una fila completa de teclas: Típico síntoma de flex de teclado dañado o pista cortada en la matriz por humedad.',
      'Prueba con teclado USB externo: Conectar un teclado USB descarta inmediatamente si la falla es del sistema operativo o del hardware del teclado de la notebook.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not19',
    moduleNumber: '19',
    title: 'EL TOUCHPAD Y GESTOS MULTITÁCTILES',
    subtitle: 'Flex de datos, tornillo de calibración de clic físico, controladores I2C y HID',
    categoryTag: 'PUNTERO TÁCTIL',
    readTime: '9 min',
    decisionTree: {
      question: '¿El touchpad no responde pero el puntero se mueve perfecto conectando un ratón USB?',
      yesAction: 'Comprobar si la tecla Fn de bloqueo de touchpad fue presionada accidentalmente (ej: Fn + F7).',
      noAction: 'Abrir la máquina y verificar que el flex plano que va del touchpad a la placa madre no esté flojo o quebrado.',
    },
    portableTool: 'Destornillador PH0 para ajuste del tornillo de tope de clic.',
    keyTakeaways: [
      'El tornillo de ajuste de clic: En la base del touchpad hay un pequeño tornillo metálico central que regula el recorrido del microswitch de clic físico.',
      'Controladores de Touchpad de Precisión: En Windows 11, los touchpads modernos operan sobre el bus I2C nativo con soporte de gestos de 3 y 4 dedos.',
      'Touchpad "loco" o errático al enchufar el cargador: Clásico síntoma de cargador genérico defectuoso con filtración de ruido eléctrico alterno (ripple) en la masa.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not20',
    moduleNumber: '20',
    title: 'PUERTOS USB, AUDIO JACK Y HDMI',
    subtitle: 'Fisuras mecánicas en soldaduras SMD por tirones de cables y placas auxiliares daughterboard',
    categoryTag: 'CONECTIVIDAD FÍSICA',
    readTime: '9 min',
    decisionTree: {
      question: '¿El puerto USB que falla está en una placa secundaria pequeña (daughterboard) unida por un cable plano a la placa madre?',
      yesAction: 'Reemplazo directo de la placa secundaria por un repuesto económico sin tocar la placa principal.',
      noAction: 'Puerto soldado en placa madre: Requiere micro-soldadura para repasar soldaduras quebradas o cambiar el conector hembra.',
    },
    portableTool: 'Lupa de aumento + Soldador de punta fina con estaño al 60/40.',
    keyTakeaways: [
      'El tirón del cable de auriculares: Tropiezos con el cable de auriculares rompen los contactos internos del jack de 3.5mm dejando a la máquina sin sonido o atascada en "Auriculares conectados".',
      'Protección contra sobrecorriente USB: Si conectás un pendrive en corto, Windows muestra "Sobretensión en el puerto USB" y desactiva el puerto por protección.',
      'Limpieza de pelusa en puertos USB-C: El 70% de los puertos USB-C que no hacen contacto tienen una masa compacta de pelusa al fondo que impide que la ficha ingrese completamente.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not21',
    moduleNumber: '21',
    title: 'TARJETA WI-FI Y BLUETOOTH',
    subtitle: 'Módulo M.2 Key E, cables coaxiales Main vs Aux, bandas de 2.4/5/6 GHz y switch de modo avión',
    categoryTag: 'COMUNICACIÓN INALÁMBRICA',
    readTime: '10 min',
    decisionTree: {
      question: '¿El adaptador Wi-Fi desapareció por completo del Administrador de Dispositivos o aparece con un triángulo amarillo (Código 10 o 43)?',
      yesAction: 'Retirar la tarjeta M.2 Wi-Fi, limpiar sus contactos con isopropílico y reinstalar firmemente.',
      noAction: 'Si detecta redes pero con señal debilísima pegado al router, uno de los cables coaxiales de antena está desconectado.',
    },
    portableTool: 'Pinzas de punta fina para reconectar terminales U.FL / MHF4.',
    keyTakeaways: [
      'Conectores coaxiales U.FL minúsculos: Conector Main (negro) y Aux (blanco); se deben presionar con el dedo alineados verticalmente sin doblar el pin central de oro.',
      'Las antenas Wi-Fi en el marco de la pantalla: Los cables suben a través de las bisagras hasta la parte superior de la tapa de la pantalla para máxima cobertura.',
      'Compatibilidad CNVi de Intel: Ciertas tarjetas Wi-Fi Intel (ej: AX201) requieren procesadores Intel con lógica CNVi y no funcionan en placas AMD; usar tarjetas estándar como la AX200 o AX210.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not22',
    moduleNumber: '22',
    title: 'BIOS / UEFI Y EL CHIP EC',
    subtitle: 'Actualización segura (batería cargada + cargador conectado), recuperación de BIOS corrupto y reseteo de EC',
    categoryTag: 'FIRMWARE PORTÁTIL',
    readTime: '11 min',
    decisionTree: {
      question: '¿La batería tiene al menos 50% de carga y el cargador oficial está enchufado a la pared?',
      yesAction: 'Cumple el requisito de seguridad para actualizar firmware de BIOS/EC.',
      noAction: 'ABORTAR. El instalador de BIOS de notebook bloqueará la actualización si la batería está descargada.',
    },
    portableTool: 'Combinación de teclas de recuperación de BIOS según fabricante (ej: Win + B en HP, Ctrl + Esc en Dell).',
    keyTakeaways: [
      'Por qué las notebooks exigen batería para actualizar: Si se corta la luz durante el flasheo del chip SPI, la batería interna mantiene la máquina viva salvando la placa madre.',
      'El reseteo de EC (Hard Reset): Mantener presionado el botón de encendido durante 30 a 60 segundos con todo desconectado restablece los registros internos del microcontrolador EC.',
      'Combinaciones de teclas de rescate: Casi todas las marcas modernas tienen una rutina de emergencia en bootblock para reflashear el BIOS desde un pendrive con la máquina en pantalla negra.',
    ],
    safetyBadge: 'ROJO',
  },
  {
    id: 'not23',
    moduleNumber: '23',
    title: 'NO ARRANCA WINDOWS EN NOTEBOOK',
    subtitle: 'El mensaje "No bootable device", particiones dañadas, modo VMD / Intel RST y GPT',
    categoryTag: 'ARRANQUE PORTÁTIL',
    readTime: '10 min',
    decisionTree: {
      question: '¿El BIOS no detecta el almacenamiento SSD o el instalador de Windows no muestra ningún disco disponible?',
      yesAction: 'Desactivar Intel VMD (Volume Management Device) en el BIOS o cargar el controlador Intel RST durante la instalación con un pendrive.',
      noAction: 'El disco es detectado; la partición EFI o el almacén BCD de Windows están corruptos.',
    },
    portableTool: 'Pendrive con controlador Intel RST descomprimido.',
    practicalCommand: 'bcdboot C:\\Windows /l es-es',
    keyTakeaways: [
      'El misterio del disco invisible en Intel 11ª, 12ª y 13ª gen: La tecnología Intel VMD oculta el SSD NVMe al instalador genérico de Windows; se soluciona cargando el driver iaStorVD.sys.',
      'Modo de suspensión antes del apagado: Si la notebook se apagó durante un estado de hibernación rápida (Fast Startup), el sistema de archivos puede quedar en estado bloqueado.',
      'Reparación de inicio con WinRE: Booteando desde el pendrive oficial -> Reparar equipo -> Solucionar problemas -> Reparación de inicio.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not24',
    moduleNumber: '24',
    title: 'FORMATEO Y PARTICIONES DE RECUPERACIÓN OEM',
    subtitle: 'Partición de fábrica de la marca, teclas de recuperación (F9, F11, Novo Button) y clean install',
    categoryTag: 'RECUPERACIÓN OEM',
    readTime: '11 min',
    decisionTree: {
      question: '¿Querés restaurar la máquina al estado de fábrica con todos los programas originales de la marca o hacer una instalación limpia sin bloatware?',
      yesAction: 'Fábrica: Usar la partición OEM presionando la tecla de recuperación en el encendido (F11 en HP, Assist en Sony, Novo en Lenovo).',
      noAction: 'Limpia: Usar pendrive oficial de Microsoft eliminando todas las particiones viejas.',
    },
    portableTool: 'Pendrive USB de instalación limpia de Windows 11.',
    keyTakeaways: [
      'La partición OEM de recuperación: Ocupa entre 15 y 25 GB en el disco; contiene la imagen WIM con la versión de Windows y los controladores con los que la máquina salió de la caja.',
      'El botón "Novo" de Lenovo: Un orificio milimétrico al costado del chasis que se presiona con un clip para acceder directo al menú de booteo y recovery.',
      'Ventaja de la instalación limpia: Elimina de raíz 20 aplicaciones basura promocionales (antivirus de prueba, juegos de bienvenida) que ralentizan la notebook.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not25',
    moduleNumber: '25',
    title: 'CONTROLADORES OEM ESPECÍFICOS',
    subtitle: 'Por qué en notebook los drivers del fabricante son indispensables: ventiladores, Fn y batería',
    categoryTag: 'CONTROLADORES PORTÁTILES',
    readTime: '12 min',
    decisionTree: {
      question: '¿Las teclas de brillo (Fn), el control de retroiluminación del teclado o el perfil de ventiladores no responden tras instalar Windows?',
      yesAction: 'Falta el software OEM de administración de energía y hotkeys del fabricante (ej: Lenovo Vantage, Dell Power Manager, Asus Armoury/G-Helper).',
      noAction: 'Verificar en el Administrador de Dispositivos que no queden controladores genéricos de Microsoft en el subsistema ACPI.',
    },
    portableTool: 'Página oficial de soporte del modelo exacto de notebook.',
    keyTakeaways: [
      'El controlador de Chipset y ACPI: En notebooks regula la velocidad del ventilador y la conmutación automática entre la placa de video integrada y dedicada (Optimus / MUX Switch).',
      'Controladores de audio con ecualización de parlantes: El driver genérico de Windows hace que los parlantes de la notebook suenen metálicos y bajos; el driver Realtek con Waves MaxxAudio o DTS restaura la calidad.',
      'Touchpad I2C HID: Sin el controlador de bus I2C del fabricante, el touchpad puede responder a los clics pero perder los gestos multitáctiles.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not26',
    moduleNumber: '26',
    title: 'BATERÍA Y PLANES DE ENERGÍA EN WINDOWS',
    subtitle: 'Modern Standby (S0 Low Power Idle) vs Suspensión tradicional (S3) y Battery Report',
    categoryTag: 'GESTIÓN ENERGÉTICA',
    readTime: '11 min',
    decisionTree: {
      question: '¿Guardás la notebook suspendida en la mochila y al sacarla horas después está hirviendo y con la batería completamente agotada?',
      yesAction: 'Problema del Modern Standby (S0): Windows mantiene la CPU conectada a internet descargando actualizaciones mientras la tapa está cerrada.',
      noAction: 'Configurar la acción de cerrar la tapa para que entre en "Hibernar" en lugar de "Suspender".',
    },
    portableTool: 'Comando powercfg /a para comprobar qué estados de suspensión soporta el hardware.',
    practicalCommand: 'powercfg /a ; powercfg /sleepstudy',
    keyTakeaways: [
      'Qué es Modern Standby (S0ix): La notebook no se apaga realmente; queda en un estado similar a un smartphone, lo que puede provocar sobrecalentamiento dentro de un bolso sin ventilación.',
      'La solución de seguridad: En Opciones de Energía -> Elegir el comportamiento del cierre de la tapa -> Seleccionar "Hibernar"; la memoria se guarda en disco y el consumo es exactamente 0 Watts.',
      'El reporte de Sleep Study: powercfg /sleepstudy genera un archivo HTML detallando qué proceso o dispositivo Wi-Fi impidió que la máquina durmiera durante la noche.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not27',
    moduleNumber: '27',
    title: 'NOTEBOOK LENTA: DIAGNÓSTICO INTEGRAL',
    subtitle: 'CPU a 800 MHz por señal PROCHOT trabada, pasta térmica seca y disco mecánico de 5400 RPM',
    categoryTag: 'PERITAJE DE RENDIMIENTO',
    readTime: '13 min',
    decisionTree: {
      question: '¿La CPU está clavada exactamente a 0.79 GHz o 800 MHz sin subir de frecuencia incluso al abrir programas pesados?',
      yesAction: 'Alerta de señal PROCHOT (Processor Hot) activada: el sensor cree falsamente que la CPU está al límite térmico o el cargador no es reconocido.',
      noAction: 'Comprobar si el disco de sistema es un disco rígido mecánico de 5400 RPM saturado al 100%.',
    },
    portableTool: 'HWiNFO64 + ThrottleStop para diagnóstico pericial de banderas de throttling.',
    keyTakeaways: [
      'El drama de los discos de 5400 RPM en notebooks: Son unidades mecánicas lentísimas diseñadas para ahorrar batería que colapsan ante cualquier tarea de Windows 10 u 11.',
      'Memoria RAM en canal único (Single Channel): Tener un solo módulo SO-DIMM reduce el ancho de banda a la mitad, afectando drásticamente el rendimiento de la placa de video integrada.',
      'Ahorro de batería en Windows: Si el control deslizante de batería está en "Mejor ahorro de batería", la CPU limita drásticamente su frecuencia turbo boost.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not28',
    moduleNumber: '28',
    title: 'LA NOTEBOOK SE APAGA O REINICIA SOLA',
    subtitle: 'Apagado abrupto por protección térmica a 100°C vs corte por batería con celdas desbalanceadas',
    categoryTag: 'INESTABILIDAD TÉRMICA',
    readTime: '11 min',
    decisionTree: {
      question: '¿La notebook se apaga instantáneamente a los 10-15 minutos de juego con la base inferior hirviendo al tacto?',
      yesAction: 'Apagado por protección térmica crítica (Thermal Trip a 100°C/105°C para evitar que el silicio se funda).',
      noAction: 'Si se apaga al desconectar el cargador a pesar de marcar 80% de batería, una celda interna colapsó.',
    },
    portableTool: 'HWiNFO64 con registro de logs de temperatura en archivo CSV.',
    keyTakeaways: [
      'El apagado térmico no deja pantalla azul: La protección está cableada en el silicio del procesador; corta la energía en nanosegundos sin darle tiempo a Windows a registrar un minidump.',
      'Celdas desbalanceadas en baterías viejas: La batería marca 60%, pero cuando la CPU demanda un pico de potencia el voltaje de una de las celdas cae por debajo del umbral mínimo y la máquina se apaga.',
      'Reemplazo de pads térmicos en VRM: En notebooks gamers, las fases de poder y memorias VRAM usan thermal pads de espesor milimétrico exacto (0.5mm, 1.0mm); usar el espesor incorrecto impedirá que el heatsink toque la CPU.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not29',
    moduleNumber: '29',
    title: 'BISAGRAS Y ESTRUCTURA DE LA CARCASA',
    subtitle: 'Rotura de bujes roscados de bronce en carcasas plásticas, tensión y reparación mecánica',
    categoryTag: 'MECÁNICA ESTRUCTURAL',
    readTime: '12 min',
    decisionTree: {
      question: '¿Al abrir la tapa de la notebook la carcasa plástica del palmrest se separa o cruje cerca de la bisagra?',
      yesAction: 'DETENER APERTURA. Los postes plásticos con insertos de bronce roscados están quebrados por dentro.',
      noAction: 'Revisar que los tornillos externos de la bisagra no se hayan aflojado.',
    },
    portableTool: 'Resina epoxi bicomponente o cianoacrilato con bicarbonato + Llave para aflojar tuerca de bisagra.',
    keyTakeaways: [
      'Por qué se rompen las notebooks en las bisagras: El lubricante de fábrica de la bisagra metálica se seca con los años, la bisagra se endurece y la fuerza de palanca arranca los plásticos internos.',
      'Aflojar la tuerca de tensión de la bisagra: Girar un cuarto de vuelta la tuerca metálica de la bisagra con una llave pequeña alivia la tensión mecánica permitiendo abrir la tapa con un solo dedo.',
      'El peligro para el flex y la pantalla: Una bisagra suelta o quebrada muerde los cables de video flex que pasan por su interior, provocando cortocircuitos que pueden quemar la placa madre.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not30',
    moduleNumber: '30',
    title: 'CASOS GUIADOS DE TALLER DE NOTEBOOKS',
    subtitle: '4 expedientes completos de reparación pericial de portátiles',
    categoryTag: 'HISTORIAL DE BANCO',
    readTime: '14 min',
    decisionTree: {
      question: '¿Identificás el eslabón de la cadena de falla antes de leer el desenlace?',
      yesAction: 'Comparar con la hipótesis del expediente de servicio.',
      noAction: 'Observar cómo la prueba cruzada con monitor externo ahorró desarmar la placa madre.',
    },
    portableTool: 'Expedientes de servicio técnico de notebooks.',
    keyTakeaways: [
      'Caso 01: La ultrabook que no encendía resuelta por sensor magnético Hall de tapa trabado en posición cerrada.',
      'Caso 02: Notebook gamer con caídas de 120 FPS a 20 FPS resuelta por radiador tapado de pelusa y pasta seca.',
      'Caso 03: Notebook que solo encendía conectada resuelta por batería hinchada con fusible interno abierto.',
      'Caso 04: Pantalla en negro con sonido de Windows funcionando resuelta por fusible de backlight de 19V quemado.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not31',
    moduleNumber: '31',
    title: 'EL BANCO FINAL: NOTEBOOK DESCONOCIDA',
    subtitle: 'Simulacro pericial: una portátil llega al taller sin cargador y con tapa falseada',
    categoryTag: 'SIMULACRO DE TALLER',
    readTime: '12 min',
    decisionTree: {
      question: '¿Comprobaste la tensión y polaridad del cargador de banco antes de enchufarlo a la notebook del cliente?',
      yesAction: 'Verificar si el jack es estándar de 19V centro positivo o si requiere pin central inteligente.',
      noAction: 'ALTO. Conectar polaridad invertida quemará el diodo de protección de entrada de la placa madre.',
    },
    portableTool: 'Fuente de laboratorio con juego de fichas intercambiables para notebooks.',
    keyTakeaways: [
      'La inspección visual inicial: Buscar fisuras en esquinas de la carcasa, tornillos faltantes y signos de apertura previa con herramientas inadecuadas.',
      'Consumo en miliamperios en fuente de laboratorio: Una notebook apagada sana consume entre 10mA y 30mA en standby; un consumo de 0mA indica línea abierta y más de 500mA indica corto.',
      'La regla de oro del reparador: Nunca prometer tiempos de entrega antes de haber desarmado y medido la etapa de alimentación.',
    ],
    safetyBadge: 'AMARILLO',
  },
  {
    id: 'not32',
    moduleNumber: '32',
    title: 'PARTE DE SERVICIO DE NOTEBOOK IMPRIMIBLE',
    subtitle: 'La planilla técnica oficial para recepción, inspección y entrega de portátiles',
    categoryTag: 'DOCUMENTACIÓN PROFESIONAL',
    readTime: '8 min',
    decisionTree: {
      question: '¿Anotaste en el parte si el cliente dejó su cargador original y si la pantalla presenta rayones previos?',
      yesAction: 'Firma de conformidad del cliente en el momento de la recepción.',
      noAction: 'Completar el checklist de estado estético antes de ingresar el equipo al banco.',
    },
    portableTool: 'Plantilla de Parte de Servicio de Notebooks EVO impresa.',
    keyTakeaways: [
      'Campos críticos de la planilla de portátiles: Número de serie / Service Tag, presencia de cargador original, estado de bisagras, funcionamiento del teclado tecla por tecla.',
      'Aclaración sobre contraseñas de Windows y BIOS: Solicitar la contraseña de usuario para probar controladores o acordar la creación de una cuenta de prueba temporal.',
      'Certificado de pruebas finales: Anexar comprobante de temperatura máxima en test de 20 minutos y estado de salud de la batería.',
    ],
    safetyBadge: 'VERDE',
  },
  {
    id: 'not33',
    moduleNumber: '33',
    title: 'GLOSARIO DE NOTEBOOKS + FUENTES + CIERRE',
    subtitle: 'Vocabulario técnico de micro-arquitectura móvil, esquemáticos y contratapa',
    categoryTag: 'DICCIONARIO & CIERRE',
    readTime: '11 min',
    decisionTree: {
      question: '¿Comprendés el significado de términos como eDP, ZIF, EC, Charging IC, Thermal Trip y BGA?',
      yesAction: 'Consolidación de competencias de reparador de portátiles EVO.',
      noAction: 'Consultar el glosario técnico antes de diagnosticar en el banco.',
    },
    portableTool: 'Service manuals oficiales de Dell, Lenovo, HP, Acer y ASUS.',
    keyTakeaways: [
      'Glosario de micro-arquitectura móvil: eDP, LVDS, BGA, SO-DIMM, ZIF, EC / KBC, Charging IC, MOSFET de alta/baja, Blower, Heatpipe, Modern Standby, PROCHOT.',
      'Fuentes confiables: Diagramas de bloques y Boardviews oficiales, manuales de servicio de fabricantes autorizados y directrices de seguridad de celdas de litio.',
      'Contratapa coleccionable Tomo 04: Tu acreditación como técnico especialista en diagnóstico y reparación de computadoras portátiles.',
    ],
    safetyBadge: 'VERDE',
  },
];

export const TOMO_04_CASES: Tomo04Case[] = [
  {
    id: 'nc01',
    title: 'Ultrabook HP que no encendía tras un viaje en avión',
    model: 'HP Pavilion 14-dv',
    symptom: 'Al presionar el botón de encendido no hacía absolutamente nada; al enchufar el cargador el LED de carga encendía en blanco.',
    hypothesis: 'La batería interna se había desconectado por vibración o el botón de encendido estaba dañado.',
    measurement: 'Tensiones de 19V presentes en entrada; bobinas de 3.3V de standby activas. El sensor magnético Hall marcaba nivel lógico 0 (tapa cerrada) aun con la tapa abierta.',
    discarded: 'Batería descartada (entregaba 11.4V); cargador descartado (19.5V estables).',
    rootCause: 'Un clip de papel metálico se había imantado y alojado en la esquina del marco de la pantalla, activando permanentemente el sensor Hall.',
    repairAction: 'Remoción del clip metálico y limpieza del bisel de la pantalla.',
    validation: 'La notebook encendió de inmediato al pulsar el botón; el sensor suspende la pantalla al bajar la tapa y la enciende al subirla normalmente.',
  },
  {
    id: 'nc02',
    title: 'Notebook Gamer que se volvía inusable a los 10 minutos de juego',
    model: 'Acer Nitro 5 AN515',
    symptom: 'Comenzaba los juegos con 110 FPS fluidos, pero a los 10 minutos caía abruptamente a 15-20 FPS con tirones severos.',
    hypothesis: 'Problema de controladores de video o degradación de la tarjeta gráfica dedicada.',
    measurement: 'Telemetría con HWiNFO64: Temperatura de la CPU alcanzaba 98°C en 7 minutos y la frecuencia caía de 4.2 GHz a 798 MHz (Thermal Throttling al 100%).',
    discarded: 'Drivers descartados (fueron reinstalados con DDU sin cambios).',
    rootCause: 'Al desarmar el sistema térmico, una capa de 3 milímetros de pelusa compacta tapaba las aletas de cobre del radiador; la pasta térmica original estaba solidificada como tiza.',
    repairAction: 'Lavado de aletas de cobre con cepillo y alcohol, reemplazo de pasta térmica por pasta densa de alto rendimiento (Noctua NT-H1).',
    validation: 'Sesión continua de 1 hora de prueba de estrés FurMark + Cinebench: temperatura máxima estabilizada en 79°C sin ninguna caída de frecuencia.',
  },
  {
    id: 'nc03',
    title: 'Pantalla negra con audio de Windows encendiendo en los parlantes',
    model: 'Lenovo IdeaPad 3 15ITL05',
    symptom: 'La máquina encendía, los ventiladores giraban y se escuchaba la música de bienvenida de Windows, pero la pantalla permanecía totalmente negra.',
    hypothesis: 'Placa madre dañada o pantalla quebrada internamente.',
    measurement: 'Al conectar monitor por HDMI, la imagen se veía perfecta. Con la linterna pegada a la pantalla de la notebook, se distinguía claramente el escritorio de Windows.',
    discarded: 'Panel LCD y GPU descartados (el panel generaba imagen y la GPU procesaba el frame).',
    rootCause: 'El fusible de alimentación de los LEDs de iluminación (Backlight) en la placa madre estaba abierto (resistencia infinita). El usuario había intentado cambiar la RAM sin desconectar la batería.',
    repairAction: 'Reemplazo del fusible SMD de 3 Amperes rotulado como "F1" cerca del conector eDP.',
    validation: 'La pantalla encendió con su brillo al 100% de manera instantánea; regulación de brillo por teclas Fn operativa.',
  },
];

export interface Tomo04GlossaryItem {
  term: string;
  definition: string;
  category: string;
}

export const TOMO_04_GLOSSARY: Tomo04GlossaryItem[] = [
  {
    term: 'Línea VIN / BATT+ (+19V / +12V)',
    definition: 'Línea de alimentación principal de la placa madre. Transporta los 19V del cargador tras pasar los MOSFETs de entrada hacia todos los convertidores DC-DC secundarios.',
    category: 'DISTRIBUCIÓN DE ENERGÍA',
  },
  {
    term: '3V_ALW / 5V_ALW (Always On)',
    definition: 'Fuentes de alimentación siempre activas (Always On). Se generan de inmediato apenas se conecta el cargador para alimentar el KBC/EC, el botón de encendido y el chip de BIOS.',
    category: 'FUENTES STEP-DOWN',
  },
  {
    term: 'KBC / EC (Embedded Controller)',
    definition: 'Microcontrolador dedicado (IT8586E, ENE, Nuvoton) que gobierna el teclado, el sensor de tapa Hall, los ventiladores y la secuencia de encendido de la placa.',
    category: 'CONTROLADORES DIGITALES',
  },
  {
    term: 'Conector eDP (Embedded DisplayPort)',
    definition: 'Interfaz digital serial que transmite video de alta definición a la pantalla. Sus líneas transportan +19V para el backlight y señales diferenciales LVDS/eDP de alta frecuencia.',
    category: 'PANTALLAS & FLEX',
  },
  {
    term: 'Sensor de Efecto Hall (Lid Switch)',
    definition: 'Sensor magnético SMD que detecta el imán ubicado en el marco de la pantalla. Si falla o queda pegado, la notebook cree que la tapa está cerrada y apaga la pantalla.',
    category: 'SENSORES',
  },
  {
    term: 'DC Jack (Conector de Carga)',
    definition: 'Conector cilíndrico o USB-C soldado o cableado a la placa. El desgaste mecánico por tirones fractura el pin central positivo o la soldadura en la placa madre.',
    category: 'CONECTIVIDAD FÍSICA',
  },
  {
    term: 'Pin Central ID (HP / Dell 1-Wire)',
    definition: 'Pin fino central en el cargador que envía un pulso de datos para que la notebook identifique el vatímetro (ej. 65W, 90W). Si se corta el cable ID, la notebook no carga la batería.',
    category: 'PROTOCOLOS DE CARGA',
  },
  {
    term: 'USB Power Delivery (USB-PD & CC Lines)',
    definition: 'Protocolo de negociación digital en pines CC1/CC2 de USB-C. Negocia perfiles de 5V, 9V, 15V y 20V hasta 100W/240W mediante el chip controlador PD.',
    category: 'PROTOCOLOS DE CARGA',
  },
  {
    term: 'Fusible SMD de Backlight (F1 / 3A)',
    definition: 'Micro-fusible de protección en la línea de 19V del display. Se quema instantáneamente si se manipula el cable flex de pantalla con la batería interna conectada.',
    category: 'PROTECCIÓN SMD',
  },
  {
    term: 'MOSFETs de Entrada (Reverse Protection & Charger)',
    definition: 'Par de transistores en serie que protegen la placa contra polaridad invertida y permiten la conmutación automática entre el cargador y la batería interna.',
    category: 'CIRCUITO DE CARGA',
  },
  {
    term: 'BMS (Battery Management System)',
    definition: 'Plaqueta electrónica interna del pack de batería que balancea las celdas de litio, mide temperatura (termistores) y bloquea el pack permanentemente si detecta subtensión extrema.',
    category: 'BATERÍAS & QUÍMICA',
  },
  {
    term: 'Phase Change Sheet / PTM7950',
    definition: 'Material de interfaz térmica de cambio de fase que pasa de estado sólido a viscoso a 45°C. Evita el fenómeno de "pump-out" en procesadores y GPUs de notebooks calientes.',
    category: 'TERMODINÁMICA',
  },
];
