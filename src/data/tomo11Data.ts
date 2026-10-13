// TOMO 11: ELECTRÓNICA APLICADA A LA INFORMÁTICA
// Contenido Editorial Maestro, Capítulos Técnicos, Prácticas, Casos Reales y Fuentes Oficiales

export interface Tomo11Chapter {
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

export interface Tomo11CaseStudy {
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

export interface Tomo11GlossaryItem {
  term: string;
  rfcOrStandard: string;
  definition: string;
  practicalTip: string;
}

export const TOMO_11_META = {
  number: '11',
  volumeLabel: 'Tomo 11',
  title: 'ELECTRÓNICA APLICADA A LA INFORMÁTICA',
  subtitle: 'Desde la física del electrón hasta el diagnóstico a nivel componente en motherboards y GPUs.',
  themeColor: '#EAB308',
  secondaryColor: '#CA8A04',
  badge: 'ELECTRÓNICA DE HARDWARE, VRM & DIAGNÓSTICO POR RIELES',
  edition: 'Edición Técnica de Ingeniería de Hardware 2026',
  totalPages: 64,
  manifestoPhrase: 'UN COMPUTADOR ES UN SISTEMA ANALÓGICO QUE SE DISFRAZA DE DIGITAL: LA CORRIENTE, EL RUIDO Y EL CALOR RIGEN CADA BIT.',
  description: 'Tratado integral de electrónica aplicada al hardware de computación. Fundamentos de voltaje, corriente, resistencia, capacitancia e inductancia; semiconductores, MOSFETs de potencia, convertidores Buck síncronos, diseño de fases VRM, secuencia de encendido Power Sequence y metrología con multímetro y osciloscopio.',
  sources: [
    'JEDEC Standard JESD8C.01 - Interface Standard for Nominal 3 V / 3.3 V Supply Digital Integrated Circuits',
    'Intel VRM 14.0 / IMVP9.1 Voltage Regulator Module Guidelines',
    'TI (Texas Instruments) Application Report SLVA477B - Basic Calculation of a Buck Converter Power Stage',
    'IPC-7711/7721 - Rework, Modification and Repair of Electronic Assemblies',
    'IEEE Standard 1149.1 - Standard Test Access Port and Boundary-Scan Architecture (JTAG)',
  ],
};

export const TOMO_11_CHAPTERS: Tomo11Chapter[] = [
  {
    id: 't11-c01',
    moduleNumber: 'M01',
    chapterNumber: '01',
    title: 'Voltaje, Corriente, Resistencia y Ley de Ohm',
    subtitle: 'La relación matemática $V = I \\cdot R$ y el cálculo de disipación de potencia ($P = V \\cdot I$)',
    readTime: '15 min',
    topicsCovered: ['Diferencia de potencial (V)', 'Intensidad de corriente (A)', 'Resistencia óhmica (Ω)', 'Disipación de potencia y efecto Joule (W)'],
    capa1Explicacion:
      'El voltaje es la presión eléctrica que empuja a los electrones; la corriente es la cantidad real de electrones que circulan por segundo a través de un conductor; la resistencia es la oposición física que ofrece el material al paso de esa corriente. La ley de Ohm establece que $V = I \\cdot R$. Si aumentás la corriente en un circuito manteniendo la resistencia, el voltaje consumido o la caída de tensión aumentará proporcionalmente.',
    capa2DetalleTecnico:
      'En hardware informático moderno, las corrientes son descomunales: una CPU consumiendo 250 W a 1.2 V requiere más de 208 Amperios. A 208 A, cualquier resistencia parásita en las pistas del PCB de apenas 0.005 Ω (5 miliohmios) provoca una caída de tensión $V_{drop} = 208 \\cdot 0.005 = 1.04\\text{ V}$ y disipa una potencia térmica $P = I^2 \\cdot R = 208^2 \\cdot 0.005 = 216.32\\text{ W}$, evaporando las pistas si no se diseñan planos de cobre macizo multicapa.',
    capa3PracticaMedicion:
      'Uso del multímetro digital en escala de 20 V DC y modo de continuidad. Medición de caídas de tensión en bornes de alimentación y cálculo de resistencia con las puntas de prueba compensando la resistencia intrínseca de los cables (offset de sonda).',
    microformatos: {
      mito: 'Mito: "El voltaje alto es lo que quema los componentes, la corriente no importa."',
      errorComun: 'Medir resistencia en una placa madre energizada, lo que daña el conversor ADC del multímetro y falsea la lectura por cargas parásitas.',
      comprobalo: 'Medí la resistencia entre la línea de 12V ATX y tierra en una placa apagada; debe ser del orden de kiloohmios o megaohmios (nunca < 10 Ω).',
      paraTecnicos: 'El coeficiente térmico de los conductores de cobre ($+0.00393 / ^\\circ\\text{C}$) incrementa la resistencia de las pistas a medida que la placa se calienta.',
      conclusionEvo: 'Para alimentar silicio a bajo voltaje se necesitan corrientes brutales; por eso el diseño térmico y de planos de masa es crítico.',
    },
    decisionRule: 'Ante un componente sobrecalentado, calculá $P = I^2 \\cdot R$: un corto parcial eleva $I$ exponencialmente disparando la temperatura.',
  },
  {
    id: 't11-c02',
    moduleNumber: 'M01',
    chapterNumber: '02',
    title: 'Circuitos Serie, Paralelo y Divisores de Tensión',
    subtitle: 'Leyes de Kirchhoff aplicadas a sensado de temperatura, feedback y sensado de rieles',
    readTime: '14 min',
    topicsCovered: ['Leyes de Kirchhoff (KVL y KCL)', 'Divisores resistivos de feedback', 'Termistores NTC en GPUs y CPUs', 'Shunt resistors para medición de corriente'],
    capa1Explicacion:
      'En un circuito en serie, la corriente es la misma en todos los puntos y los voltajes se suman. En un circuito en paralelo, el voltaje es idéntico en todas las ramas y las corrientes se suman. Un divisor resistivo toma un voltaje alto (e.g. 12 V) y extrae una fracción precisa (e.g. 0.8 V) para que el chip controlador de voltaje sepa exactamente qué nivel de tensión hay en la salida.',
    capa2DetalleTecnico:
      'La fórmula del divisor de tensión es $V_{out} = V_{in} \\cdot \\frac{R_2}{R_1 + R_2}$. En los controladores PWM de VRM (como los de Richtek o Monolithic Power Systems), el pin `FB` (Feedback) compara $V_{out}$ contra una referencia interna ultraprecisa de bandgap de 0.800 V. Si $R_1$ o $R_2$ se degradan por corrosión o calor, el controlador "cree" que el voltaje cayó y sobrealimenta la CPU, destruyéndola por sobretensión en microsegundos.',
    capa3PracticaMedicion:
      'Cálculo y comprobación con multímetro de un divisor resistivo de feedback. Medición de resistencia de shunt de 0.005 Ω en la entrada PCIe de 8 pines para verificar el consumo de corriente mediante la caída en milivoltios.',
    microformatos: {
      mito: 'Mito: "Una resistencia rota siempre se abre y da circuito abierto (infinito)."',
      errorComun: 'Sustituir resistencias de sensado por puentes de estaño directos, anulando las protecciones OCP (Over Current Protection).',
      comprobalo: 'Medí los terminales de una resistencia de shunt en milivoltios con la GPU bajo carga: $10\\text{ mV}$ en $0.005\\ \\Omega = 2\\text{ Amperios}$.',
      paraTecnicos: 'Las tolerancias del 1% (E96) son obligatorias en líneas de sensado FB para evitar desvíos mayores a 10 mV en el Vcore.',
      conclusionEvo: 'Los divisores de voltaje son los ojos del hardware: si su feedback se descalibra, todo el sistema de regulación colapsa.',
    },
    decisionRule: 'Si una línea de voltaje regulada mide fuera de tolerancia, medí primero el estado y valor óhmico de las resistencias del divisor de feedback.',
  },
  {
    id: 't11-c03',
    moduleNumber: 'M02',
    chapterNumber: '03',
    title: 'Capacitores, Diodos y Filtrado de Ripple',
    subtitle: 'Capacitores electrolíticos vs sólidos vs cerámicos MLCC y diodos Schottky de protección',
    readTime: '16 min',
    topicsCovered: ['Carga, descarga y ESR de capacitores', 'Capacitores MLCC en desacople de alta frecuencia', 'Diodos Schottky y clamping ESD', 'Filtrado de rizado (Ripple Voltage)'],
    capa1Explicacion:
      'Los capacitores almacenan energía electrostática temporalmente, actuando como microbaterías ultrarrápidas que amortiguan caídas bruscas de voltaje cuando la CPU demanda energía instantánea. Los diodos permiten que la corriente fluya en un solo sentido, protegiendo los circuitos contra inversiones de polaridad y descargas electrostáticas (ESD).',
    capa2DetalleTecnico:
      'En un riel de alimentación digital, el parámetro crítico de un capacitor no es solo su capacitancia en microfaradios ($\\mu\\text{F}$), sino su Resistencia Serie Equivalente (ESR) e Inductancia Serie Equivalente (ESL). Los capacitores cerámicos multicapa (MLCC) se colocan debajo del socket de la CPU para filtrar transitorios de conmutación de varios cientos de kilohercios a gigahercios.',
    capa3PracticaMedicion:
      'Detección de capacitores MLCC en corto mediante inyección de corriente a 1.0 V con fuente de laboratorio y cámara térmica / alcohol isopropílico. Medición de diodos en escala de caída directa (0.2 V para Schottky, 0.6 V para Silicio).',
    microformatos: {
      mito: 'Mito: "Los capacitores en corto siempre explotan o se hinchan a simple vista."',
      errorComun: 'Inyectar 12 V en una línea de 1.0 V para buscar un capacitor en corto, destruyendo el procesador de inmediato.',
      comprobalo: 'Medí en modo diodo la línea de datos USB (D+ y D-) respecto a tierra: debe marcar entre 0.400 V y 0.700 V si los diodos ESD están sanos.',
      paraTecnicos: 'Los MLCC sufren de fracturas piezoeléctricas microscópicas por torsión mecánica del PCB, entrando en corto circuito franco de 0.0 Ω.',
      conclusionEvo: 'El 80% de los cortos en placas madre se deben a un único capacitor cerámico MLCC de $0.02 USD defectuoso en paralelo.',
    },
    decisionRule: 'Nunca inyectes un voltaje superior al voltaje nominal del riel bajo prueba cuando busques componentes en cortocircuito.',
  },
  {
    id: 't11-c04',
    moduleNumber: 'M02',
    chapterNumber: '04',
    title: 'Transistores, MOSFETs y Conmutación de Potencia',
    subtitle: 'Canal N, Canal P, Gate Threshold, $R_{DS(on)}$ y etapas High-Side / Low-Side',
    readTime: '18 min',
    topicsCovered: ['MOSFETs de enriquecimiento N-Channel', 'Tensión de disparo $V_{GS(th)}$', 'Resistencia de conducción $R_{DS(on)}$', 'Pares High-Side y Low-Side en Buck Converters'],
    capa1Explicacion:
      'Un MOSFET es una llave electrónica controlada por voltaje en su compuerta (Gate). Cuando aplicás voltaje al Gate, se abre un canal conductor entre Drenador (Drain) y Fuente (Source), permitiendo el paso de corrientes inmensas con un esfuerzo de control casi nulo. Son los músculos que conmutan cientos de miles de veces por segundo para alimentar la CPU y la GPU.',
    capa2DetalleTecnico:
      'El convertidor Buck síncrono utiliza un MOSFET High-Side conectado a los 12 V y un MOSFET Low-Side conectado a masa (GND). Si ambos MOSFETs condujeran simultáneamente por un microsegundo (Shoot-Through), se crearía un corto directo entre 12 V y tierra. El controlador PWM gestiona un tiempo muerto (Dead-Time) de nanosegundos para evitarlo.',
    capa3PracticaMedicion:
      'Medición de Gate-to-Source y Drain-to-Source en modo diodo con multímetro para verificar que no exista perforación de óxido de compuerta (Gate punch-through). Comprobación de DrMOS (Driver + MOSFET integrados) verificando las señales PWM y Phase.',
    microformatos: {
      mito: 'Mito: "Un MOSFET con bajo $R_{DS(on)}$ no calienta nada."',
      errorComun: 'Medir el MOSFET soldado en placa y creer que está en corto cuando en realidad se mide la baja resistencia interna del chip de la GPU.',
      comprobalo: 'Cargá el Gate de un MOSFET canal N con la punta positiva del multímetro en modo diodo: el canal Drain-Source debe pasar a conducir inmediatamente.',
      paraTecnicos: 'Las pérdidas de conmutación ($P_{sw} = \\frac{1}{2} V \\cdot I \\cdot (t_r + t_f) \\cdot f_{sw}$) superan a las de conducción a frecuencias > 600 kHz.',
      conclusionEvo: 'La calidad del silicio de los MOSFETs define la estabilidad eléctrica de los overclocks y la longevidad de la placa madre.',
    },
    decisionRule: 'Si el High-Side MOSFET entra en corto, los 12 V de entrada se aplican directamente al núcleo de silicio de 1.1 V destruyéndolo instantáneamente.',
  },
  {
    id: 't11-c05',
    moduleNumber: 'M03',
    chapterNumber: '05',
    title: 'Arquitectura VRM y Secuencia de Encendido (Power Sequence)',
    subtitle: 'De los 12 V ATX a VCore, VCCSA, VDDQ: señales Enable, Power Good y Reset',
    readTime: '20 min',
    topicsCovered: ['Regulador Buck multifásico y entrelazado (Interleaving)', 'Secuencia de encendido paso a paso (ACPI States: S5 → S0)', 'Líneas 3.3V Standby, VCCST, VTT, VDDQ', 'Señales clave: SLP_S3#, VR_EN, PWRGD, SYS_RESET#'],
    capa1Explicacion:
      'Una computadora no enciende todo su hardware al mismo tiempo: sigue una coreografía estrictamente cronometrada llamada Secuencia de Encendido. Primero se activa la energía en espera (Standby), luego el chip Super I/O o EC detecta la pulsación del botón, ordena a la fuente encender los 12 V, se habilitan las fases de memoria RAM, luego las de la CPU y finalmente, cuando todos los voltajes son estables, se libera la señal Power Good y el procesador comienza a ejecutar instrucciones.',
    capa2DetalleTecnico:
      'La secuencia típica Intel/AMD requiere: 1. `+3VSB` presente; 2. Cristal RTC oscilando a 32.768 kHz; 3. Botón activa `PWR_BTN#` bajando a 0 V; 4. PCH emite `SLP_S3#` y `SLP_S4#` (nivel alto 3.3 V); 5. Fuente ATX recibe `PS_ON#` = 0 V encendiendo +12V, +5V, +3.3V; 6. Rieles auxiliares DDR VDDQ (1.1 V/1.2 V) se estabilizan; 7. PWM recibe `VR_ENABLE` y modula las fases de VCore; 8. PWM emite `VR_READY` / `ALL_SYS_PWRGD`; 9. PCH desactiva `PLTRST#` (Platform Reset) liberando los hilos de CPU.',
    capa3PracticaMedicion:
      'Trazado de la secuencia con osciloscopio digital de 2 o 4 canales midiendo la cascada de señales: `PS_ON#` → `VDDQ_EN` → `VR_EN` → `SYS_PWROK` → `PLTRST#`. Aislamiento del paso exacto donde la secuencia se aborta.',
    microformatos: {
      mito: 'Mito: "Si los ventiladores giran, la placa madre está encendida y el problema es la tarjeta gráfica."',
      errorComun: 'Cambiar el chip BIOS cuando el fallo es un riel auxiliar de 1.8 V en corto que nunca permite que el controlador active el VR_EN.',
      comprobalo: 'Medí el pin 8 de la memoria SPI Flash (VCC): si no hay 3.3 V o 1.8 V estables antes de encender, el Super I/O jamás leerá el microcódigo.',
      paraTecnicos: 'La falta de la señal `PLTRST#` en el pin A11 del slot PCIe indica que el procesador nunca terminó su inicialización de rieles.',
      conclusionEvo: 'El diagnóstico pericial de hardware no es cambiar piezas al azar: es verificar cada eslabón de la Power Sequence en orden cronológico.',
    },
    decisionRule: 'Identificá el último voltaje o señal lógica que sube en la secuencia; el componente que debe generar el siguiente paso es tu sospechoso principal.',
  },
];

export const TOMO_11_CASE_STUDIES: Tomo11CaseStudy[] = [
  {
    id: 't11-case-01',
    title: 'Placa Madre no Enciende (0A de consumo) por Riel 3.3V Standby en Corto',
    symptom: 'Al presionar el botón de encendido no hay giro de ventiladores ni LEDs. La fuente no arranca.',
    diagnosticLayer: 'Capa 1: Alimentación Standby y Super I/O',
    telemetryMeasured: 'Voltaje en pin +5VSB = 5.0 V. Voltaje en pin +3.3VSB = 0.12 V. Resistencia de línea 3.3VSB a tierra = 0.4 Ω.',
    discardedHypothesis: 'Se descartó fuente de poder dañada (probada con puente PS_ON# a masa dando 12.1 V estables) y chip BIOS corrupto.',
    rootCause: 'Capacitor cerámico MLCC C412 de 10µF/6.3V en el riel de 3.3V Standby perforado por sobretensión de red.',
    fixAction: 'Desoldado del capacitor con tobera de aire caliente a 380°C. Limpieza con flux y sustitución por MLCC 10µF/10V cerámico.',
    verificationCmd: 'Resistencia a tierra subió a 4.2 kΩ. El riel 3.3VSB se estabilizó en 3.34 V. La placa encendió y dio POST correctamente.',
  },
  {
    id: 't11-case-02',
    title: 'GPU RTX con Código 43 por Fase de Memoria VRAM Inoperativa',
    symptom: 'Windows muestra Código 43 en el Administrador de Dispositivos. Aparecen artefactos lineales en pantalla.',
    diagnosticLayer: 'Capa 2: VRM de VDDQ (Memoria GDDR6)',
    telemetryMeasured: 'VCore GPU = 0.85 V (OK). Riel 12V PCIe = 12.04 V. Riel VDDQ (Memoria) = 0.0 V (Falla). Resistencia VDDQ = 45 Ω (Normal).',
    discardedHypothesis: 'Se descartaron módulos de memoria GDDR6 dañados físicamente o pistas de datos PCIe rotas.',
    rootCause: 'Resistencia de Gate del DrMOS de memoria abierta (valor medido = ∞ en lugar de 2.2 Ω), dejando el MOSFET en corte permanente.',
    fixAction: 'Reemplazo de la resistencia SMD 0402 de 2.2 Ω en la línea de Gate del PWM.',
    verificationCmd: 'El riel VDDQ entregó 1.35 V estables. La GPU fue reconocida por los drivers de NVIDIA sin Código 43 y superó FurMark.',
  },
];

export const TOMO_11_GLOSSARY: Tomo11GlossaryItem[] = [
  {
    term: 'VRM (Voltage Regulator Module)',
    rfcOrStandard: 'Intel VRM / IMVP Spec',
    definition: 'Módulo convertidor Buck síncrono encargado de reducir los 12 V de la fuente a voltajes ultraprecisos de 0.7 V a 1.4 V para la CPU y GPU.',
    practicalTip: 'El número de fases reales reparte la corriente: a más fases, menor calentamiento individual por MOSFET.',
  },
  {
    term: 'ESR (Equivalent Series Resistance)',
    rfcOrStandard: 'JEDEC / IEC 60384',
    definition: 'Resistencia parásita interna de un capacitor que genera calentamiento y pérdida de eficiencia durante altas demandas de corriente.',
    practicalTip: 'Capacitores con alta ESR provocan inestabilidad y reinicios aleatorios bajo carga intensa de cómputo.',
  },
  {
    term: 'DrMOS (Driver MOSFET)',
    rfcOrStandard: 'Intel DrMOS Standard',
    definition: 'Circuito integrado que empaqueta el driver PWM, el High-Side MOSFET y el Low-Side MOSFET en un solo chip de alta eficiencia.',
    practicalTip: 'Al reemplazar un DrMOS, verificá siempre que no queden restos de estaño debajo del pad térmico inferior (GND).',
  },
  {
    term: 'Power Good (PWRGD / PG)',
    rfcOrStandard: 'ATX12V Design Guide',
    definition: 'Señal lógica de 3.3V o 5V emitida cuando todos los rieles de alimentación han alcanzado sus niveles de regulación estables.',
    practicalTip: 'Si PWRGD no se activa, el procesador permanece en estado de Reset indefinido sin ejecutar la BIOS.',
  },
];
