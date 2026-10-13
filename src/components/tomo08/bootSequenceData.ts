export type BootLayer =
  | 'ELÉCTRICA'
  | 'HARDWARE'
  | 'FIRMWARE'
  | 'BOOT'
  | 'KERNEL'
  | 'WINDOWS'
  | 'SESIÓN';

export type SafetyLevel = 'USUARIO' | 'TECNICO' | 'BANCO';

export type MachineComponentId =
  | 'psu'
  | 'motherboard'
  | 'cpu'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'firmware'
  | 'bootManager'
  | 'kernel'
  | 'drivers'
  | 'services'
  | 'userSession'
  | 'desktop';

export interface BootStep {
  stepNumber: number;
  id: string;
  name: string;
  layer: BootLayer;
  layerColor: string;
  activeComponents: MachineComponentId[];
  activeConnections: string[];
  powerState: 'OFF' | 'STANDBY' | 'POWER_GOOD' | 'POST' | 'BOOTING' | 'READY';
  safetyLevel: SafetyLevel;
  safetyRequirement?: string;
  whatIsHappening: string;
  purpose?: string;
  initiator: string;
  responder: string;
  signalFlow?: string;
  expectedResponse: string;
  technicalObservation: string;
  ifFails: string;
  possibleFailures?: string[];
  detectionClues?: string[];
  evoTip?: string;
  suggestedSafeTest: string;
  nextStep: string;
}

export const BOOT_SEQUENCE_STEPS: BootStep[] = [
  {
    stepNumber: 0,
    id: 'step-00',
    name: 'PC APAGADA',
    layer: 'ELÉCTRICA',
    layerColor: '#71717a',
    activeComponents: [],
    activeConnections: [],
    powerState: 'OFF',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'La computadora se encuentra completamente sin suministro de energía o con la llave de la fuente en corte (I/O en 0). Ningún circuito lógico está energizado.',
    initiator: 'Fuente desconectada o llave I/O en posición 0.',
    responder: 'Ninguno. Condición de reposo absoluto.',
    expectedResponse: 'Ausencia total de flujo eléctrico en los rieles principales y de standby.',
    technicalObservation: 'Todos los LEDs de la placa madre y panel frontal están apagados. Los ventiladores se encuentran completamente estáticos.',
    ifFails: 'Si al conectar la energía salta el disyuntor o fusible de la instalación, existe un cortocircuito primario severo en el puente rectificador, varistor o condensador de filtrado de la fuente.',
    suggestedSafeTest: 'Verificar visualmente que el cable interlock esté firmemente conectado al conector trasero y que la toma de pared disponga de energía con llave térmica habilitada. (Técnico en banco: comprobar continuidad de tierra y neutro con multímetro desenergizado).',
    nextStep: 'Alimentación de espera / Standby (+5VSB).',
  },
  {
    stepNumber: 1,
    id: 'step-01',
    name: 'Alimentación de espera / Standby (+5VSB)',
    layer: 'ELÉCTRICA',
    layerColor: '#eab308',
    activeComponents: ['psu', 'motherboard'],
    activeConnections: ['psu-mobo-standby'],
    powerState: 'STANDBY',
    safetyLevel: 'TECNICO',
    safetyRequirement: 'Requiere conocimiento e instrumental adecuado.',
    whatIsHappening: 'Al conectar el cable de poder y encender la llave I/O de la PSU, el transformador auxiliar genera inmediatamente el riel de espera permanente (+5VSB, cable violeta del conector ATX de 24 pines). Este voltaje alimenta el controlador Super I/O / Embedded Controller (EC) y los circuitos lógicos que escucharán el botón.',
    initiator: 'Transformador auxiliar y conversor flyback de la fuente ATX.',
    responder: 'Controlador Super I/O / Embedded Controller (EC) y chip de red/USB si está configurado Wake-on-LAN.',
    expectedResponse: 'Tensión de +5V (+/- 5%) permanente en el pin 9 del conector ATX.',
    technicalObservation: 'LED de standby en la placa base iluminado (verde/naranja suave). Ningún ventilador gira todavía.',
    ifFails: 'La placa madre parecerá muerta y no reaccionará a ninguna pulsación del botón frontal.',
    suggestedSafeTest: 'Medir con multímetro digital en escala DCV entre el pin 9 (cable violeta +5VSB) y tierra (cable negro) en el conector ATX de 24 pines con la fuente energizada en reposo.',
    nextStep: 'Usuario pulsa POWER.',
  },
  {
    stepNumber: 2,
    id: 'step-02',
    name: 'Usuario pulsa POWER',
    layer: 'ELÉCTRICA',
    layerColor: '#eab308',
    activeComponents: ['motherboard'],
    activeConnections: ['front-panel-pulse'],
    powerState: 'STANDBY',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El usuario presiona el pulsador momentáneo del gabinete, cerrando físicamente el circuito entre los pines PWR_SW (Power Switch) del panel frontal de la placa madre.',
    initiator: 'Acción mecánica del usuario sobre el switch frontal.',
    responder: 'Pines del header Front Panel de la placa madre.',
    expectedResponse: 'Derivación momentánea de la señal a potencial de masa (Ground / 0V).',
    technicalObservation: 'Pulsación física de switch normalmente abierto (NO). En condiciones normales dura entre 50 ms y 200 ms.',
    ifFails: 'Si el cable está cortado o el switch roto, la placa madre nunca recibe la orden de encendido.',
    suggestedSafeTest: 'Verificar la conexión de los cables del botón frontal al header PWR_SW de la placa madre. (Comprobación técnica: realizar un puente momentáneo de 1 segundo sobre los pines PWR_SW con destornillador aislado para descartar falla del pulsador mecánico).',
    nextStep: 'Señal de encendido (PS_ON#).',
  },
  {
    stepNumber: 3,
    id: 'step-03',
    name: 'Señal de encendido (PS_ON#)',
    layer: 'ELÉCTRICA',
    layerColor: '#eab308',
    activeComponents: ['motherboard', 'psu'],
    activeConnections: ['mobo-psu-pson'],
    powerState: 'STANDBY',
    safetyLevel: 'BANCO',
    safetyRequirement: 'Requiere conocimiento e instrumental adecuado.',
    whatIsHappening: 'El controlador Super I/O / EC detecta la caída a 0V en PWR_SW y responde tirando a masa la línea PS_ON# (Power Supply On, cable verde, pin 16 del conector ATX).',
    initiator: 'Controlador Super I/O / EC de la placa madre.',
    responder: 'Circuito supervisor interno (IC PWM/Supervisor) de la fuente de poder.',
    expectedResponse: 'La línea PS_ON# cae de ~5V (nivel lógico alto) a 0V (nivel lógico bajo activo).',
    technicalObservation: 'Transición lógica digital detectable con osciloscopio o multímetro rápido.',
    ifFails: 'La fuente nunca arrancará sus etapas de conmutación principales ni suministrará voltajes de trabajo.',
    suggestedSafeTest: 'Prueba de banco aislada: con la fuente completamente desconectada de la placa madre y fuera del gabinete, realizar puente con cable aislado entre el pin 16 (cable verde PS_ON#) y masa (cable negro) con carga simulada básica para verificar si la fuente conmuta a estado activo.',
    nextStep: 'PSU activa alimentación principal.',
  },
  {
    stepNumber: 4,
    id: 'step-04',
    name: 'PSU activa alimentación principal',
    layer: 'ELÉCTRICA',
    layerColor: '#eab308',
    activeComponents: ['psu', 'motherboard'],
    activeConnections: ['psu-rails-12v', 'psu-rails-5v', 'psu-rails-3v'],
    powerState: 'POWER_GOOD',
    safetyLevel: 'BANCO',
    safetyRequirement: 'Requiere conocimiento e instrumental adecuado.',
    whatIsHappening: 'Al activarse PS_ON#, la fuente enciende sus conversores principales y genera los rieles de potencia nominal: +12V (motores, VRM CPU y GPU), +5V (lógica periférica, SATA) y +3.3V (chipset, PCIe, slots M.2).',
    initiator: 'Etapas de conmutación primaria y secundaria de la fuente ATX.',
    responder: 'Líneas de alimentación de la placa madre, conectores EPS 12V y PCIe 8-pin.',
    expectedResponse: 'Rieles dentro de las tolerancias ATX (+/- 5% para +12V, +5V y +3.3V).',
    technicalObservation: 'Los ventiladores de la fuente, chasis y disipador comienzan a girar.',
    ifFails: 'La fuente puede apagarse instantáneamente si entra en protección por sobrecorriente (OCP) o cortocircuito (SCP).',
    suggestedSafeTest: 'Prueba de banco: medir voltajes de salida en el conector ATX principal con carga resistiva en banco: riel +12V (cable amarillo, tolerancia 11.4V–12.6V), riel +5V (cable rojo, 4.75V–5.25V) y riel +3.3V (cable naranja, 3.14V–3.47V).',
    nextStep: 'Power Good / Sistema eléctrico estable (PWR_OK).',
  },
  {
    stepNumber: 5,
    id: 'step-05',
    name: 'Power Good / Sistema eléctrico estable (PWR_OK)',
    layer: 'ELÉCTRICA',
    layerColor: '#eab308',
    activeComponents: ['psu', 'motherboard'],
    activeConnections: ['psu-mobo-pwrok'],
    powerState: 'POWER_GOOD',
    safetyLevel: 'TECNICO',
    safetyRequirement: 'Requiere conocimiento e instrumental adecuado.',
    whatIsHappening: 'El circuito supervisor de la fuente monitorea que todos los rieles (+12V, +5V, +3.3V) se estabilicen y no tengan rizado peligroso. Tras un retraso seguro de 100 ms a 500 ms (t1/t3 delay), la fuente eleva la línea PWR_OK (Power Good, cable gris, pin 8) a +5V.',
    initiator: 'Supervisor interno de la fuente de poder (ej. WT7502 / GR8313).',
    responder: 'Circuito generador de reloj y controlador de reset de la placa base.',
    expectedResponse: 'Línea PWR_OK estable en +5V sostenidos.',
    technicalObservation: 'El sistema valida que la electricidad de la PSU es segura para el silicio sin provocar bloqueos por subtensión.',
    ifFails: 'La placa madre mantendrá todos los componentes en reset indefinido; los ventiladores giran pero el equipo nunca inicia POST.',
    suggestedSafeTest: 'Comprobar presencia de +5V en cable gris (pin 8 PWR_OK) mediante tester digital de fuentes ATX o multímetro con puntas de precisión en conector acoplado.',
    nextStep: 'CPU sale de reset (RESET# High).',
  },
  {
    stepNumber: 6,
    id: 'step-06',
    name: 'CPU sale de reset (RESET# High)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['motherboard', 'cpu'],
    activeConnections: ['mobo-cpu-reset'],
    powerState: 'POST',
    safetyLevel: 'TECNICO',
    safetyRequirement: 'Requiere conocimiento e instrumental adecuado.',
    whatIsHappening: 'Con PWR_OK en estado alto, el generador de reloj (Clock Generator) y el regulador VRM de la CPU (Vcore) liberan la línea RESET#. El procesador sale de su estado de congelamiento eléctrico y se prepara para ejecutar su primera instrucción.',
    initiator: 'Lógica de control de reset de la placa madre.',
    responder: 'CPU (Registros internos y Program Counter en estado inicial de fábrica).',
    expectedResponse: 'El pin RESET# pasa de 0V a nivel alto lógico (VTT / 1.05V o 1.8V según arquitectura).',
    technicalObservation: 'El VRM entrega Vcore estable al socket. La CPU genera disipación térmica inicial.',
    ifFails: 'VRM en cortocircuito o señal RESET# atascada en masa: la CPU no recibe tensión y el socket permanece frío.',
    suggestedSafeTest: 'Con el equipo desenergizado, medir resistencia a masa en los inductores de fase del VRM de CPU con multímetro en escala de ohmios/diodo para descartar MOSFETs en cortocircuito.',
    nextStep: 'CPU comienza ejecución de firmware (Reset Vector 0xFFFFFFF0).',
  },
  {
    stepNumber: 7,
    id: 'step-07',
    name: 'CPU comienza ejecución de firmware (Reset Vector 0xFFFFFFF0)',
    layer: 'FIRMWARE',
    layerColor: '#a855f7',
    activeComponents: ['cpu', 'firmware'],
    activeConnections: ['cpu-spi-flash'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'En modo real de 16 bits heredado x86, el puntero de instrucción (CS:IP) apunta al "Reset Vector" (dirección física mapeada en la memoria flash SPI: 0xFFFFFFF0). La CPU ejecuta un salto (JMP) hacia el inicio del código UEFI/BIOS.',
    initiator: 'Puntero de instrucción inicial de los núcleos de cómputo de la CPU.',
    responder: 'Chip de memoria Flash ROM SPI de la placa madre.',
    expectedResponse: 'Lectura de los primeros bytes de código máquina almacenados en el chip SPI.',
    technicalObservation: 'Actividad en el bus SPI (líneas CS#, CLK, MISO, MOSI) transferida al chip BIOS.',
    ifFails: 'BIOS corrupta, chip SPI desprogramado o pin de lectura SPI cortado: el sistema se detiene en seco antes de emitir ningún código.',
    suggestedSafeTest: 'En placas compatibles, utilizar el botón USB BIOS Flashback con un pendrive FAT32 según las instrucciones oficiales del fabricante para regrabar el microcódigo SPI. (Técnico en banco: verificar líneas SPI con osciloscopio o programador externo).',
    nextStep: 'UEFI/BIOS fase inicial (SEC & PEI).',
  },
  {
    stepNumber: 8,
    id: 'step-08',
    name: 'UEFI/BIOS fase inicial (SEC & PEI)',
    layer: 'FIRMWARE',
    layerColor: '#a855f7',
    activeComponents: ['firmware', 'cpu'],
    activeConnections: ['cpu-cache-as-ram'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'Se ejecuta la fase de Seguridad (SEC) y Pre-EFI Initialization (PEI). Como la memoria RAM todavía no está inicializada ni es utilizable, la CPU configura su propia memoria caché L2/L3 como memoria RAM temporal (técnica "Cache-as-RAM" o CAR).',
    initiator: 'Módulos PEI core del microcódigo UEFI.',
    responder: 'Caché interna de la CPU y controlador de host.',
    expectedResponse: 'Creación del stack de ejecución temporal dentro del silicio de la CPU.',
    technicalObservation: 'Inicialización de microcódigo de fábrica y verificación de integridad criptográfica de la imagen UEFI.',
    ifFails: 'Microcódigo incompatible con el modelo/stepping de CPU instalado (ej. CPU nueva en motherboard con BIOS vieja).',
    suggestedSafeTest: 'Consultar la lista oficial de soporte de CPU (QVL) del fabricante de la motherboard y verificar la versión mínima de BIOS requerida para el modelo de procesador.',
    nextStep: 'Inicialización CPU (Microcode Patching & Core Sync).',
  },
  {
    stepNumber: 9,
    id: 'step-09',
    name: 'Inicialización CPU (Microcode Patching & Core Sync)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['cpu', 'firmware'],
    activeConnections: ['cpu-internal-cores'],
    powerState: 'POST',
    safetyLevel: 'TECNICO',
    safetyRequirement: 'Requiere conocimiento e instrumental adecuado.',
    whatIsHappening: 'El firmware aplica los parches de microcódigo binario a todos los núcleos, inicializa el núcleo Bootstrap Processor (BSP), pone los núcleos secundarios (AP) en espera e inicializa los registros MSR del procesador.',
    initiator: 'Módulo de microcódigo UEFI PEI.',
    responder: 'Núcleos de procesamiento de la CPU (P-Cores / E-Cores / CCDs).',
    expectedResponse: 'Todos los registros de control (CR0, CR4) y MSRs configurados con las capacidades nativas del silicio.',
    technicalObservation: 'Detección correcta de ID de fabricante (GenuineIntel / AuthenticAMD) y stepping de litografía.',
    ifFails: 'Pines del socket doblados (LGA) o quebrados (PGA) en líneas de control de microcódigo: paradas de ejecución tempranas.',
    suggestedSafeTest: 'Retirar el disipador y procesador con el equipo desenergizado; inspeccionar con lupa de aumento o microscopio los pines del socket LGA de la placa madre en busca de pines doblados, sulfatados o partidas.',
    nextStep: 'Inicialización controlador de memoria (IMC).',
  },
  {
    stepNumber: 10,
    id: 'step-10',
    name: 'Inicialización controlador de memoria (IMC)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['cpu', 'motherboard'],
    activeConnections: ['cpu-imc-bus'],
    powerState: 'POST',
    safetyLevel: 'TECNICO',
    safetyRequirement: 'Requiere conocimiento e instrumental adecuado.',
    whatIsHappening: 'El Integrated Memory Controller (IMC) dentro del encapsulado de la CPU se activa y configura los rieles de voltaje auxiliares de memoria (VDD, VDDQ, VDD2, VDD_CPU / SoC / System Agent).',
    initiator: 'Firmware PEI a través de registros de control del IMC.',
    responder: 'Controlador de memoria integrado (IMC) en la CPU y fases VRM de memoria en la motherboard.',
    expectedResponse: 'Suministro eléctrico preciso en las pistas de memoria de los slots DIMM.',
    technicalObservation: 'VRM de RAM estabilizado en voltaje nominal (1.1V para DDR5 JEDEC, 1.2V para DDR4).',
    ifFails: 'Falla en el riel System Agent / SoC: el IMC no responde a las instrucciones del bus de memoria.',
    suggestedSafeTest: 'Medir en banco las tensiones de alimentación del riel de memoria (VDD/VDDQ) con multímetro en los puntos de prueba (test points) del slot DIMM para descartar anomalías en el conversor buck secundario.',
    nextStep: 'Detección de módulos RAM (Lectura SPD vía I2C/I3C).',
  },
  {
    stepNumber: 11,
    id: 'step-11',
    name: 'Detección de módulos RAM (Lectura SPD vía I2C/I3C)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['ram', 'cpu', 'firmware'],
    activeConnections: ['cpu-ram-spd'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El firmware lee el chip EEPROM Serial Presence Detect (SPD) ubicado en cada módulo de memoria a través del bus serie I2C/I3C (SMBus). Obtiene capacidad, fabricante, latencias JEDEC y perfiles XMP/EXPO.',
    initiator: 'Controlador SMBus del chipset / CPU.',
    responder: 'Chip EEPROM SPD soldado en cada barra de memoria RAM.',
    expectedResponse: 'Estructura de bytes SPD decodificada con fabricante, rangos (Ranks), densidad de chips y frecuencias soportadas.',
    technicalObservation: 'Identificación de configuración instalada (ej. 2x16GB Dual Channel en slots 2 y 4).',
    ifFails: 'Módulo de RAM sucio, mal insertado o pistas SMBus interrumpidas: el sistema no detecta ningún módulo.',
    suggestedSafeTest: 'Desconectar la energía eléctrica, retirar los módulos de memoria RAM, limpiar los contactos dorados con alcohol isopropílico de alta pureza y reinsertarlos firmemente asegurando el calce de las trabas en los slots preferenciales (A2/B2).',
    nextStep: 'Entrenamiento de memoria (Memory Training).',
  },
  {
    stepNumber: 12,
    id: 'step-12',
    name: 'Entrenamiento de memoria (Memory Training)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['ram', 'cpu'],
    activeConnections: ['cpu-ram-data-bus'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El IMC envía patrones de bits de prueba a través de todas las pistas de datos (DQ) y reloj (DQS/CLK), calibrando retrasos en picosegundos (Write Leveling, Read Centering, ODT On-Die Termination) para compensar diferencias físicas de longitud en las pistas del PCB.',
    initiator: 'Motor de calibración del Integrated Memory Controller (IMC).',
    responder: 'Chips de DRAM soldados en los módulos de memoria.',
    expectedResponse: 'Alineación de fase con cero errores en todos los bits de datos de cada canal.',
    technicalObservation: 'Puede tardar varios segundos (especialmente en DDR5 tras corte de energía o cambio de módulos). Los ventiladores giran sostenidos.',
    ifFails: 'Inestabilidad en la calibración: reinicios en bucle (Bootloop) de 3 a 5 intentos antes de restablecer valores seguros JEDEC.',
    suggestedSafeTest: 'Probar con un único módulo en el slot principal (A2) y realizar un Clear CMOS (puente en pines CLRTC o retirada de pila CR2032 con equipo desenchufado) para restablecer parámetros a frecuencias JEDEC base.',
    nextStep: 'Inicialización chipset / buses (DMI / Infinity Fabric).',
  },
  {
    stepNumber: 13,
    id: 'step-13',
    name: 'Inicialización chipset / buses (DMI / Infinity Fabric)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['motherboard', 'cpu'],
    activeConnections: ['cpu-chipset-dmi'],
    powerState: 'POST',
    safetyLevel: 'TECNICO',
    safetyRequirement: 'Requiere conocimiento e instrumental adecuado.',
    whatIsHappening: 'La CPU y el Chipset (PCH / Promontory) establecen enlace directo de alta velocidad (DMI 4.0 / PCIe Uplink). El sistema abandona "Cache-as-RAM" y transfiere el stack de ejecución a la memoria RAM física ya entrenada.',
    initiator: 'Fase DXE (Driver Execution Environment) de la UEFI.',
    responder: 'Chipset principal de la placa madre y controladores secundarios.',
    expectedResponse: 'Enlace DMI sincronizado a máxima velocidad de negociación.',
    technicalObservation: 'Memoria RAM física operativa al 100%. Código UEFI ejecutándose a velocidad completa de procesador.',
    ifFails: 'Chipset dañado o sobrecalentado: bloqueo total antes de iniciar enumeración de dispositivos.',
    suggestedSafeTest: 'Comprobar que el disipador del chipset (PCH) esté firmemente fijado y que la interfaz térmica (pad o pasta) mantenga contacto adecuado sin sobrecalentamiento.',
    nextStep: 'Enumeración PCIe (Scanning de Buses y Slots).',
  },
  {
    stepNumber: 14,
    id: 'step-14',
    name: 'Enumeración PCIe (Scanning de Buses y Slots)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['motherboard', 'cpu'],
    activeConnections: ['cpu-pcie-root'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El despachador DXE recorre el árbol de buses PCIe (Bus 0, Device, Function) asignando espacios de memoria mapeada MMIO y rangos de interrupción a cada tarjeta y dispositivo conectado.',
    initiator: 'PCI Host Bridge Driver de la UEFI.',
    responder: 'Controladores PCIe en slots x16, x4, x1 y puertos M.2.',
    expectedResponse: 'Tabla completa de dispositivos detectados (Vendor ID y Device ID registrados).',
    technicalObservation: 'Negociación de líneas (x16, x8, x4) y generación de enlace (Gen3, Gen4, Gen5).',
    ifFails: 'Conflicto de asignación MMIO por tarjeta secundaria defectuosa conectada a un slot PCIe secundario.',
    suggestedSafeTest: 'Retirar todas las tarjetas de expansión PCIe auxiliares (capturadoras, placas de sonido, adaptadores) y dejar únicamente la placa de video principal.',
    nextStep: 'Inicialización GPU (GOP / Graphics Output Protocol).',
  },
  {
    stepNumber: 15,
    id: 'step-15',
    name: 'Inicialización GPU (GOP / Graphics Output Protocol)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['gpu', 'cpu', 'firmware'],
    activeConnections: ['cpu-gpu-pcie', 'gpu-display-out'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'UEFI localiza el adaptador gráfico principal (integrado o dedicado en PCIe x16), ejecuta el controlador GOP (Graphics Output Protocol) del VBIOS de la placa de video e inicializa el Framebuffer de salida por DisplayPort/HDMI.',
    initiator: 'UEFI Video DXE Driver.',
    responder: 'Procesador gráfico (GPU) y chip VBIOS de la placa de video.',
    expectedResponse: 'Activación del transmisor TMDS/DisplayPort y sincronización con el monitor.',
    technicalObservation: 'El monitor despierta de modo reposo, detecta señal y muestra por primera vez imagen (logo de motherboard/EVO).',
    ifFails: 'Pantalla negra sin señal: cable de alimentación PCIe de la GPU no conectado, monitor en entrada equivocada o GPU sin soporte UEFI GOP.',
    suggestedSafeTest: 'Verificar cable DisplayPort o HDMI directo al conector de la placa de video dedicada, revisar conectores de alimentación PCIe de 8 pines y probar en salida de video integrado (si el procesador posee iGPU).',
    nextStep: 'Inicialización controladores de almacenamiento (NVMe / AHCI).',
  },
  {
    stepNumber: 16,
    id: 'step-16',
    name: 'Inicialización controladores de almacenamiento (NVMe / AHCI)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['storage', 'firmware'],
    activeConnections: ['pcie-nvme-controller'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El firmware inicializa las controladoras de almacenamiento masivo: controlador PCIe NVMe para unidades M.2 y controlador SATA AHCI para discos tradicionales.',
    initiator: 'UEFI NVMe / AHCI DXE Drivers.',
    responder: 'Controlador de silicio del SSD NVMe (ej. Phison/Samsung/Silicon Motion) o chip SATA.',
    expectedResponse: 'Controladoras en estado "Ready", colas de comandos I/O creadas.',
    technicalObservation: 'Comunicación PCIe directa a 4 líneas Gen4/Gen5 con el SSD M.2.',
    ifFails: 'SSD M.2 con falla en su controlador interno provocando bloqueo durante la detección de periféricos.',
    suggestedSafeTest: 'Retirar temporalmente la unidad SSD M.2 y encender el equipo para verificar si ingresa limpiamente al setup UEFI sin cuelgues.',
    nextStep: 'Detección de SSD/HDD/NVMe (Identificación de medios).',
  },
  {
    stepNumber: 17,
    id: 'step-17',
    name: 'Detección de SSD/HDD/NVMe (Identificación de medios)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['storage', 'firmware'],
    activeConnections: ['storage-firmware-query'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'Se envían comandos Identify Device / NVMe Identify Controller para registrar modelo, número de serie, versión de firmware, tamaño de bloques LBA y soporte S.M.A.R.T.',
    initiator: 'Subcapa de almacenamiento UEFI.',
    responder: 'Firmware interno del disco o SSD.',
    expectedResponse: 'Respuesta con la capacidad exacta en sectores y estructura de particiones.',
    technicalObservation: 'Detección del disco de sistema en la lista de periféricos del BIOS.',
    ifFails: 'El disco no aparece en el listado UEFI o muestra capacidad 0 MB (firmware de SSD bloqueado en ROM Mode).',
    suggestedSafeTest: 'Reubicar el SSD NVMe en el slot M.2 principal directo a CPU y comprobar si es listado en la sección de almacenamiento del BIOS.',
    nextStep: 'Enumeración de dispositivos (USB, Teclado, Ratón, TPM).',
  },
  {
    stepNumber: 18,
    id: 'step-18',
    name: 'Enumeración de dispositivos (USB, Teclado, Ratón, TPM)',
    layer: 'HARDWARE',
    layerColor: '#06b6d4',
    activeComponents: ['motherboard', 'firmware'],
    activeConnections: ['mobo-usb-hid'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'Se activa el controlador xHCI (USB), se enumeran los puertos y dispositivos Human Interface Device (HID) como teclado y mouse, y se inicia la comunicación con el módulo TPM 2.0 (fTPM/dTPM).',
    initiator: 'UEFI USB xHCI Driver & TPM TCG Driver.',
    responder: 'Dispositivos USB conectados y coprocesador de seguridad TPM.',
    expectedResponse: 'Teclado listo para capturar teclas de interrupción (F2, Del, F12) y PCRs de TPM disponibles.',
    technicalObservation: 'El teclado ilumina momentáneamente sus LEDs de bloqueo (Num Lock / Caps Lock).',
    ifFails: 'Dispositivo USB en cortocircuito (ej. pendrive quemado o puerto USB frontal doblado) congela el bus xHCI.',
    suggestedSafeTest: 'Desconectar todos los periféricos USB externos y el conector del panel frontal USB para descartar bloqueos por cortocircuitos en puertos dañados.',
    nextStep: 'POST (Power-On Self Test superado con éxito).',
  },
  {
    stepNumber: 19,
    id: 'step-19',
    name: 'POST (Power-On Self Test superado con éxito)',
    layer: 'FIRMWARE',
    layerColor: '#a855f7',
    activeComponents: ['firmware', 'motherboard', 'cpu', 'ram', 'gpu'],
    activeConnections: ['all-hardware-validated'],
    powerState: 'POST',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'La rutina de auto-diagnóstico (POST) concluye exitosamente. Todos los subsistemas de hardware primarios (CPU, RAM, GPU, Almacenamiento, Buses) han sido validados como funcionales y seguros para transferir el control.',
    initiator: 'Módulo POST Master de la UEFI.',
    responder: 'Todos los controladores de la plataforma.',
    expectedResponse: 'Estado "POST SUCCESS" reportado a la capa BDS (Boot Device Selection).',
    technicalObservation: 'Los LEDs de diagnóstico de la placa base (CPU, DRAM, VGA, BOOT) se apagan secuencialmente.',
    ifFails: 'Cualquier falla en esta etapa detiene el sistema antes de que Windows exista en memoria.',
    suggestedSafeTest: 'Observar en qué LED de diagnóstico (Debug LED: CPU, DRAM, VGA, BOOT) se detiene la placa madre para aislar el componente que no supera el POST.',
    nextStep: 'Firmware determina dispositivo de arranque (Boot Order / NVRAM).',
  },
  {
    stepNumber: 20,
    id: 'step-20',
    name: 'Firmware determina dispositivo de arranque (Boot Order / NVRAM)',
    layer: 'FIRMWARE',
    layerColor: '#a855f7',
    activeComponents: ['firmware', 'storage'],
    activeConnections: ['firmware-nvram-read'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'La fase Boot Device Selection (BDS) consulta las variables almacenadas en NVRAM (BootOrder y Boot####) para identificar la prioridad de arranque y localizar la entrada configurada para el sistema operativo.',
    initiator: 'UEFI BDS Dispatcher.',
    responder: 'Memoria NVRAM CMOS y tabla de particiones del disco.',
    expectedResponse: 'Selección de la entrada de arranque con mayor prioridad configurada (Windows Boot Manager).',
    technicalObservation: 'Lectura de la ruta de dispositivo UEFI (Device Path) que apunta a la partición de sistema.',
    ifFails: 'Mensaje "No bootable device found" si el orden de arranque apunta a un medio inexistente o la NVRAM perdió la configuración.',
    suggestedSafeTest: 'Ingresar al Setup del BIOS presionando SUPR/F2 y restablecer el orden de booteo verificando que "Windows Boot Manager" figure en el primer lugar.',
    nextStep: 'UEFI Boot Manager (Localización de partición ESP FAT32).',
  },
  {
    stepNumber: 21,
    id: 'step-21',
    name: 'UEFI Boot Manager (Localización de partición ESP FAT32)',
    layer: 'BOOT',
    layerColor: '#3b82f6',
    activeComponents: ['firmware', 'storage', 'bootManager'],
    activeConnections: ['firmware-storage-esp'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El firmware lee la tabla de particiones GUID (GPT) del SSD y monta la partición EFI System Partition (ESP), que está formateada en FAT32 con el identificador GUID C12A7328-F81F-11D2-BA4B-00A0C93EC93B.',
    initiator: 'UEFI File System Driver (FAT Driver).',
    responder: 'Partición ESP de ~100 MB a 500 MB en la unidad de almacenamiento.',
    expectedResponse: 'Acceso de lectura directo al árbol de directorios \\EFI\\.',
    technicalObservation: 'Localización del archivo ejecutable EFI de arranque en \\EFI\\Microsoft\\Boot\\bootmgfw.efi.',
    ifFails: 'Partición ESP dañada o ausente: el firmware no encuentra ningún sistema de archivos FAT32 ejecutable.',
    suggestedSafeTest: 'Arrancar desde un medio de instalación USB oficial de Windows, acceder al Símbolo del sistema de recuperación y verificar la partición EFI con diskpart o regenerarla con bcdboot.',
    nextStep: 'Windows Boot Manager (bootmgfw.efi & BCD).',
  },
  {
    stepNumber: 22,
    id: 'step-22',
    name: 'Windows Boot Manager (bootmgfw.efi & BCD)',
    layer: 'BOOT',
    layerColor: '#3b82f6',
    activeComponents: ['bootManager', 'storage'],
    activeConnections: ['bootmgr-bcd-read'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'UEFI transfiere la ejecución a \\EFI\\Microsoft\\Boot\\bootmgfw.efi. El Boot Manager de Windows lee el almacén de configuración de arranque (BCD - Boot Configuration Data) para identificar la ruta de la partición de Windows y sus parámetros de inicio.',
    initiator: 'bootmgfw.efi (ejecutable UEFI de Microsoft firmado digitalmente).',
    responder: 'Archivo BCD (colmena de registro binaria en \\EFI\\Microsoft\\Boot\\BCD).',
    expectedResponse: 'Lectura de la ruta de la partición del sistema operativo y opciones de kernel.',
    technicalObservation: 'Verificación de firma digital mediante Secure Boot antes de continuar.',
    ifFails: 'Pantalla azul de recuperación con código 0xc000000e o 0xc0000034 (BCD corrupto o no encontrado).',
    suggestedSafeTest: 'Ejecutar el comando "bootrec /rebuildbcd" o regenerar el BCD con "bcdboot C:\\Windows /s S: /f UEFI" desde la consola del entorno de recuperación WinRE.',
    nextStep: 'winload.efi (Cargador del sistema operativo Windows).',
  },
  {
    stepNumber: 23,
    id: 'step-23',
    name: 'winload.efi (Cargador del sistema operativo Windows)',
    layer: 'BOOT',
    layerColor: '#3b82f6',
    activeComponents: ['bootManager', 'storage', 'ram'],
    activeConnections: ['winload-os-partition'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El Boot Manager transfiere el control a C:\\Windows\\System32\\winload.efi. Este cargador prepara la transición: habilita el direccionamiento virtual de 64 bits (Paging), carga el registro de configuración SYSTEM y ubica el kernel en memoria RAM.',
    initiator: 'winload.efi.',
    responder: 'Partición NTFS del sistema operativo (C:).',
    expectedResponse: 'Carga de la colmena de Registro C:\\Windows\\System32\\config\\SYSTEM en memoria.',
    technicalObservation: 'winload.efi valida la firma criptográfica WHQL de todos los binarios de arranque.',
    ifFails: 'Error 0xc0000428 (Firma digital de winload.efi no válida) o 0xc0000225.',
    suggestedSafeTest: 'Ejecutar "sfc /scannow /offbootdir=C:\\ /offwindir=C:\\Windows" desde el entorno de recuperación WinRE para restaurar la integridad de los archivos del sistema.',
    nextStep: 'Carga de kernel ntoskrnl.exe & HAL en memoria RAM.',
  },
  {
    stepNumber: 24,
    id: 'step-24',
    name: 'Carga de kernel ntoskrnl.exe & HAL en memoria RAM',
    layer: 'KERNEL',
    layerColor: '#10b981',
    activeComponents: ['kernel', 'ram', 'storage'],
    activeConnections: ['winload-load-kernel'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'winload.efi lee desde el disco y aloja en memoria RAM el binario del núcleo NT (ntoskrnl.exe) y la capa de abstracción de hardware (hal.dll), junto con la tabla de memoria física (Memory Map).',
    initiator: 'winload.efi.',
    responder: 'Memoria RAM principal.',
    expectedResponse: 'Estructura LoaderBlock creada con la información de hardware para transferir el control al kernel.',
    technicalObservation: 'Fin de los servicios de arranque UEFI (ExitBootServices()). La UEFI cede definitivamente el control de la máquina.',
    ifFails: 'Fallo de lectura por sector defectuoso en la unidad de almacenamiento o corrupción en ntoskrnl.exe.',
    suggestedSafeTest: 'Ejecutar "chkdsk C: /f" desde la consola de recuperación para comprobar la consistencia del sistema de archivos NTFS y descartar sectores defectuosos.',
    nextStep: 'HAL (Hardware Abstraction Layer) toma control de la arquitectura.',
  },
  {
    stepNumber: 25,
    id: 'step-25',
    name: 'HAL (Hardware Abstraction Layer) toma control de la arquitectura',
    layer: 'KERNEL',
    layerColor: '#10b981',
    activeComponents: ['kernel', 'cpu'],
    activeConnections: ['kernel-hal-init'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'hal.dll toma el control de los temporizadores de hardware de bajo nivel (APIC, HPET), controladores de interrupción de CPU y gestión de energía ACPI, aislando el resto del sistema operativo de las diferencias específicas de la placa madre.',
    initiator: 'Capa de abstracción HAL (hal.dll).',
    responder: 'Controladores de interrupción APIC / IO-APIC de la CPU y Chipset.',
    expectedResponse: 'Mapeo de interrupciones de hardware normalizado para el núcleo.',
    technicalObservation: 'Sincronización de reloj maestro para la planificación de hilos de CPU.',
    ifFails: 'Pantalla azul temprana HAL_INITIALIZATION_FAILED (0x0000005C) o ACPI_BIOS_ERROR (0x000000A5).',
    suggestedSafeTest: 'Actualizar la BIOS de la placa madre a la versión estable más reciente para corregir incompatibilidades en las tablas ACPI.',
    nextStep: 'Carga de drivers BOOT_START (Controladores de arranque).',
  },
  {
    stepNumber: 26,
    id: 'step-26',
    name: 'Carga de drivers BOOT_START (Controladores de arranque)',
    layer: 'KERNEL',
    layerColor: '#10b981',
    activeComponents: ['drivers', 'kernel', 'storage'],
    activeConnections: ['kernel-load-drivers'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El kernel lee la lista de servicios con Start=0 (BOOT_START) en la clave HKLM\\SYSTEM\\CurrentControlSet\\Services. Carga los controladores indispensables: stornvme.sys, storahci.sys, ntfs.sys, fltmgr.sys y controladores de bus de procesador.',
    initiator: 'Cargador de controladores del Kernel NT.',
    responder: 'Archivos .sys en C:\\Windows\\System32\\drivers\\.',
    expectedResponse: 'Controladores de disco montados y capaces de realizar I/O nativo a través del sistema de archivos NTFS.',
    technicalObservation: 'A partir de este instante, el kernel ya no necesita de la BIOS para leer el SSD.',
    ifFails: 'BSOD INACCESSIBLE_BOOT_DEVICE (0x0000007B) si el driver del controlador de almacenamiento no puede montar la partición C:.',
    suggestedSafeTest: 'Verificar en el setup UEFI que el modo de operación de la controladora (AHCI / NVMe nativo vs RAID / Intel RST VMD) coincida con la configuración de la instalación.',
    nextStep: 'Kernel entra en funcionamiento (Fase 0 & Fase 1 Init).',
  },
  {
    stepNumber: 27,
    id: 'step-27',
    name: 'Kernel entra en funcionamiento (Fase 0 & Fase 1 Init)',
    layer: 'KERNEL',
    layerColor: '#10b981',
    activeComponents: ['kernel', 'cpu', 'ram'],
    activeConnections: ['kernel-subsystems-active'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El kernel ejecuta KiSystemStartup() y divide la inicialización en Fase 0 (sin interrupciones activas) y Fase 1 (habilita interrupciones, inicializa el administrador de procesos, memoria virtual, gestor de objetos y el Registry).',
    initiator: 'Núcleo maestro de Windows (ntoskrnl.exe).',
    responder: 'Todos los núcleos de CPU y subsistemas de memoria del sistema operativo.',
    expectedResponse: 'Creación del proceso System (PID 4) y los hilos del sistema en segundo plano.',
    technicalObservation: 'Aparece en pantalla el círculo de puntos girando de Windows (Boot Splash Screen).',
    ifFails: 'BSOD KERNEL_SECURITY_CHECK_FAILURE o SYSTEM_THREAD_EXCEPTION_NOT_HANDLED.',
    suggestedSafeTest: 'Ejecutar Diagnóstico de Memoria de Windows o MemTest86 para descartar celdas defectuosas en la memoria RAM que corrompan estructuras de kernel.',
    nextStep: 'Session Manager Subsystem (smss.exe).',
  },
  {
    stepNumber: 28,
    id: 'step-28',
    name: 'Session Manager Subsystem (smss.exe)',
    layer: 'WINDOWS',
    layerColor: '#00d2ff',
    activeComponents: ['kernel', 'services'],
    activeConnections: ['kernel-smss-spawn'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El kernel crea el primer proceso en modo usuario: smss.exe (Session Manager Subsystem). SMSS establece las variables de entorno de sistema, inicializa los archivos de paginación (pagefile.sys) y crea las sesiones aisladas: Sesión 0 (para servicios de sistema) y Sesión 1 (para la sesión de usuario interactiva).',
    initiator: 'Proceso System del Kernel (PID 4).',
    responder: 'Proceso C:\\Windows\\System32\\smss.exe en espacio de usuario (Ring 3).',
    expectedResponse: 'Inicialización de la Sesión 0 y posterior preparación de la Sesión 1 interactiva.',
    technicalObservation: 'Transición de código exclusivo de kernel a procesos protegidos de modo usuario.',
    ifFails: 'Pantalla azul crítica STATUS_SYSTEM_PROCESS_TERMINATED (0xC000021A) si smss.exe falla al arrancar.',
    suggestedSafeTest: 'Iniciar en Modo Seguro manteniendo la tecla Shift al reiniciar o desde el entorno de recuperación para auditar archivos corruptos.',
    nextStep: 'Subsistemas esenciales de Sesión 0 (csrss.exe & wininit.exe).',
  },
  {
    stepNumber: 29,
    id: 'step-29',
    name: 'Subsistemas esenciales de Sesión 0 (csrss.exe & wininit.exe)',
    layer: 'WINDOWS',
    layerColor: '#00d2ff',
    activeComponents: ['services', 'kernel'],
    activeConnections: ['smss-csrss-wininit'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'smss.exe crea la instancia de csrss.exe (Client/Server Runtime Subsystem) para la Sesión 0 junto con win32k.sys (driver gráfico del subsistema Win32), y ejecuta wininit.exe (Windows Initialization Process), encargado de preparar la infraestructura de servicios del sistema.',
    initiator: 'smss.exe en la Sesión 0.',
    responder: 'csrss.exe y wininit.exe en la Sesión 0.',
    expectedResponse: 'Subsistema Win32 inicializado y wininit.exe listo para desplegar los servicios centrales.',
    technicalObservation: 'La resolución de pantalla pasa del modo básico de arranque a la resolución nativa del monitor.',
    ifFails: 'Driver de video incompatible o corrupto genera cuelgue o pantalla negra al cargar win32k.sys.',
    suggestedSafeTest: 'Iniciar en "Modo de video de baja resolución" o "Modo Seguro" y desinstalar controladores gráficos conflictivos con Display Driver Uninstaller (DDU).',
    nextStep: 'Servicios de Windows en Sesión 0 (services.exe, lsass.exe & svchost.exe).',
  },
  {
    stepNumber: 30,
    id: 'step-30',
    name: 'Servicios de Windows en Sesión 0 (services.exe, lsass.exe & svchost.exe)',
    layer: 'WINDOWS',
    layerColor: '#00d2ff',
    activeComponents: ['services', 'drivers'],
    activeConnections: ['services-svchost-start'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'wininit.exe inicia services.exe (Service Control Manager - SCM), lsass.exe (Local Security Authority) y fontdrvhost.exe. El SCM lee la base de datos de servicios en el Registro e inicializa los servicios automáticos agrupados en instancias de svchost.exe (como Local Session Manager LSM, DHCP, Audiosrv y Plug and Play).',
    initiator: 'wininit.exe en la Sesión 0.',
    responder: 'services.exe, lsass.exe y procesos svchost.exe.',
    expectedResponse: 'Servicios de red, audio, seguridad y administración de sesiones en estado "Running".',
    technicalObservation: 'Actividad en disco y CPU mientras se cargan los servicios de segundo plano en Sesión 0.',
    ifFails: 'Servicio crítico bloqueado o corrupto provoca demoras excesivas o fallas en componentes de red/seguridad.',
    suggestedSafeTest: 'Abrir el Visor de Eventos (eventvwr.msc) y consultar "Registros de Windows -> Sistema" filtrando por origen "Service Control Manager" para identificar el servicio con fallas.',
    nextStep: 'LogonUI y winlogon.exe en Sesión 1 (Pantalla de inicio de sesión).',
  },
  {
    stepNumber: 31,
    id: 'step-31',
    name: 'LogonUI y winlogon.exe en Sesión 1 (Pantalla de inicio de sesión)',
    layer: 'SESIÓN',
    layerColor: '#f43f5e',
    activeComponents: ['userSession', 'services', 'gpu'],
    activeConnections: ['winlogon-logonui-render'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'smss.exe crea la Sesión 1 interactiva y lanza su respectivo csrss.exe y winlogon.exe. winlogon inicializa el compositor gráfico Desktop Window Manager (dwm.exe) e invoca a LogonUI.exe para renderizar la pantalla de bloqueo con hora, fondo y selección de credenciales.',
    initiator: 'smss.exe (crea Sesión 1) y winlogon.exe (inicia dwm.exe y LogonUI.exe).',
    responder: 'LogonUI.exe, dwm.exe y subsistema de credenciales.',
    expectedResponse: 'Presentación interactiva de la pantalla de bienvenida esperando el ingreso de credenciales del usuario.',
    technicalObservation: 'El teclado y ratón responden fluidamente; la interfaz muestra la pantalla de bloqueo.',
    ifFails: 'Pantalla negra o error al inicializar LogonUI por fallas en el Desktop Window Manager o controladores de video.',
    suggestedSafeTest: 'Comprobar si el equipo permite el acceso mediante un PIN alternativo o iniciar en Modo Seguro para descartar proveedores de credenciales de terceros conflictivos.',
    nextStep: 'Autenticación, LSASS y User Profile Service (ProfSvc).',
  },
  {
    stepNumber: 32,
    id: 'step-32',
    name: 'Autenticación, LSASS y User Profile Service (ProfSvc)',
    layer: 'SESIÓN',
    layerColor: '#f43f5e',
    activeComponents: ['userSession', 'storage', 'services'],
    activeConnections: ['lsass-user-profile'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'El usuario ingresa su contraseña/PIN. winlogon.exe transmite las credenciales a lsass.exe para su validación criptográfica. Tras autenticar con éxito, winlogon solicita a User Profile Service (ProfSvc, alojado en svchost.exe) montar la colmena del usuario (C:\\Users\\Usuario\\NTUSER.DAT en HKEY_CURRENT_USER).',
    initiator: 'Ingreso de credenciales del usuario validado por lsass.exe.',
    responder: 'User Profile Service (ProfSvc) y registro de Windows.',
    expectedResponse: 'Mensaje "Bienvenido" y montaje exitoso del árbol de configuración del usuario en HKCU.',
    technicalObservation: 'Lectura de permisos, variables de entorno y preferencias personalizadas del usuario.',
    ifFails: 'Mensaje "Error en el servicio de perfil de usuario al iniciar sesión" y carga de perfil temporal.',
    suggestedSafeTest: 'Iniciar con una cuenta administradora secundaria y revisar en el Registro bajo "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList" que la clave del usuario no tenga extensión ".bak".',
    nextStep: 'explorer.exe (Shell interactivo del usuario).',
  },
  {
    stepNumber: 33,
    id: 'step-33',
    name: 'explorer.exe (Shell interactivo del usuario)',
    layer: 'SESIÓN',
    layerColor: '#f43f5e',
    activeComponents: ['desktop', 'userSession', 'gpu'],
    activeConnections: ['user-explorer-launch'],
    powerState: 'BOOTING',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'winlogon.exe consulta la clave Shell en HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon y ejecuta C:\\Windows\\explorer.exe bajo el token de seguridad del usuario autenticado. Explorer crea la barra de tareas, el menú de inicio, el escritorio y procesa las aplicaciones configuradas en Inicio.',
    initiator: 'winlogon.exe bajo el contexto del usuario autenticado.',
    responder: 'explorer.exe y subsistema de shell de Windows.',
    expectedResponse: 'Aparición de la barra de tareas, menú de inicio, iconos del escritorio y bandeja del sistema.',
    technicalObservation: 'Carga de programas de inicio y servicios de usuario en segundo plano.',
    ifFails: 'Pantalla negra con solo el cursor del mouse visible (explorer.exe no arrancó o se colgó por un complemento de shell dañado).',
    suggestedSafeTest: 'Presionar Ctrl + Shift + Esc para abrir el Administrador de Tareas, seleccionar "Archivo -> Ejecutar nueva tarea" y escribir "explorer.exe" para iniciar manualmente el shell.',
    nextStep: 'ESCRITORIO DE WINDOWS LISTO (Sistema 100% Operativo).',
  },
  {
    stepNumber: 34,
    id: 'step-34',
    name: 'ESCRITORIO DE WINDOWS LISTO (Sistema 100% Operativo)',
    layer: 'SESIÓN',
    layerColor: '#10b981',
    activeComponents: [
      'psu',
      'motherboard',
      'cpu',
      'ram',
      'gpu',
      'storage',
      'firmware',
      'bootManager',
      'kernel',
      'drivers',
      'services',
      'userSession',
      'desktop',
    ],
    activeConnections: ['all-systems-operational'],
    powerState: 'READY',
    safetyLevel: 'USUARIO',
    whatIsHappening: 'La secuencia completa de arranque desde la pulsación mecánica del botón POWER hasta el entorno interactivo de usuario ha concluido con éxito. El sistema se encuentra en estado de reposo activo (Idle), planificando hilos en CPU y listo para recibir comandos del usuario.',
    initiator: 'Todos los subsistemas coordinados en equilibrio dinámico.',
    responder: 'Hardware y Software sincronizados bajo gobernanza del kernel NT.',
    expectedResponse: 'Sistema 100% receptivo y estable. La actividad de CPU, memoria y disco depende del hardware, drivers, servicios y software instalado.',
    technicalObservation: 'Cadena completa de hardware -> firmware -> bootloader -> kernel -> drivers -> servicios -> sesión verificada sin anomalías.',
    ifFails: 'N/A (Secuencia completada con éxito).',
    suggestedSafeTest: 'Abrir el Administrador de Tareas (Ctrl+Shift+Esc) o el Monitor de Recursos (resmon.exe) para comprobar la actividad basal de CPU, memoria, disco y red tras completar el arranque.',
    nextStep: 'Secuencia completa finalizada. Puedes reiniciar o navegar los pasos descubiertos.',
  },
];

// ============================================================================
// CASO EVO DIAGNOSTIC ENGINE DATA MODELS
// ============================================================================

export type HypothesisStatus =
  | 'SIN_EVIDENCIA'
  | 'POSIBLE'
  | 'SOSTENIDA'
  | 'DEBILITADA'
  | 'DESCARTADA'
  | 'CONFIRMADA';

export interface CaseHypothesis {
  id: string;
  name: string;
  component: string;
  description: string;
  initialStatus: HypothesisStatus;
  evidenceNotes: string[];
}

export interface CaseTest {
  id: string;
  name: string;
  level: SafetyLevel;
  safetyRequirement?: string;
  queComprueba: string;
  resultadoObtenido: string;
  evidenciaGenerada: string;
  hipotesisFortalece: string[];
  hipotesisDebilita: string[];
  esPruebaConfirmatoria?: boolean;
}

export interface EvoCase {
  id: string;
  number: string;
  titulo: string;
  descripcionInicial: string;
  sintomaPrincipal: string;
  failureId: string;
  stopStep: number;
  falloEnPasoNombre: string;
  ultimoPasoConfirmado: number;
  primerPasoNoCompletado: number;
  evidenciaInicial: string[];
  hypotheses: CaseHypothesis[];
  tests: CaseTest[];
  correctDiagnosis: string;
  diagnosticoFinal: {
    causa: string;
    evidenciaClave: string[];
    pasoDetencion: string;
    pruebaConfirmatoria: string;
    accionRecomendada: string;
    verificacionPosterior: string;
  };
}

export const EVO_CASES: EvoCase[] = [
  {
    id: 'case-01',
    number: 'CASO 01',
    titulo: 'PC enciende pero no supera entrenamiento de memoria',
    descripcionInicial:
      'El equipo enciende los ventiladores y luces, pero no da imagen ni emite señal de POST. Tras unos segundos, los ventiladores aceleran y el equipo se reinicia en un bucle continuo.',
    sintomaPrincipal:
      'Ventiladores giran de forma sostenida, ausencia total de señal de video y reinicios cíclicos (bootloop) sin llegar al setup de BIOS.',
    failureId: 'fail-ram-training',
    stopStep: 12,
    falloEnPasoNombre: 'Entrenamiento de memoria (Memory Training)',
    ultimoPasoConfirmado: 11,
    primerPasoNoCompletado: 12,
    evidenciaInicial: [
      'Alimentación ATX y rieles +12V, +5V, +3.3V activos y estables con PWR_OK generado.',
      'CPU sale de reset y ejecuta microcódigo inicial desde la memoria flash SPI.',
      'Lectura de datos SPD en el bus SMBus completada con éxito para los módulos de memoria.',
      'El Integrated Memory Controller (IMC) no logra sincronizar la alineación de fase DQS/CLK ni fijar los parámetros ODT.',
    ],
    hypotheses: [
      {
        id: 'hyp-ram',
        name: 'Inestabilidad en el entrenamiento de memoria RAM / Perfil inestable',
        component: 'RAM / IMC',
        description: 'Falla en el bus de datos de memoria o perfil de latencias inestable impidiendo la calibración de picosegundos.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El sistema se detiene en el paso 12 tras haber detectado los módulos en el bus SMBus.'],
      },
      {
        id: 'hyp-gpu',
        name: 'Falla en procesador gráfico (GPU) o bus PCIe de video',
        component: 'GPU',
        description: 'La placa de video no responde o existe un cortocircuito en las líneas PCIe.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['La pantalla no muestra señal, pero el flujo todavía no llegó a la fase de enumeración PCIe.'],
      },
      {
        id: 'hyp-storage',
        name: 'Unidad de almacenamiento SSD M.2 dañada o en cortocircuito',
        component: 'ALMACENAMIENTO',
        description: 'Falla en el controlador SSD bloqueando el bus principal.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El SSD no ha sido interrogado aún en la secuencia temporal de arranque.'],
      },
      {
        id: 'hyp-bootloader',
        name: 'Corrupción del gestor de arranque (bootmgfw.efi / BCD)',
        component: 'BOOTLOADER',
        description: 'Archivos de arranque de Windows ilegibles en el almacenamiento masivo.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El firmware UEFI no ha alcanzado la fase de selección de dispositivo de arranque (BDS).'],
      },
    ],
    tests: [
      {
        id: 'test-c1-01',
        name: 'Prueba de arranque con un solo módulo en slot A2 y Clear CMOS',
        level: 'USUARIO',
        queComprueba: 'Aísla inestabilidades multicanal o configuraciones de perfiles de memoria corruptos en CMOS.',
        resultadoObtenido: 'Con un único módulo en slot A2 y CMOS restablecido a frecuencias base JEDEC, el equipo supera el entrenamiento y emite el POST exitoso.',
        evidenciaGenerada: 'El entrenamiento de memoria se completa limpiamente a frecuencias estándar en un solo canal.',
        hipotesisFortalece: ['hyp-ram'],
        hipotesisDebilita: ['hyp-gpu', 'hyp-storage', 'hyp-bootloader'],
        esPruebaConfirmatoria: true,
      },
      {
        id: 'test-c1-02',
        name: 'Desconexión de unidades de almacenamiento SSD M.2 y cables SATA',
        level: 'USUARIO',
        queComprueba: 'Verifica si una unidad de almacenamiento en cortocircuito frena el POST.',
        resultadoObtenido: 'Sin unidades de almacenamiento conectadas, el bucle de reinicios en el paso 12 continúa exactamente igual.',
        evidenciaGenerada: 'El almacenamiento no influye en la falla de entrenamiento de RAM.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['hyp-storage', 'hyp-bootloader'],
      },
      {
        id: 'test-c1-03',
        name: 'Comprobación de cable y monitor en puerto de video alternativo',
        level: 'USUARIO',
        queComprueba: 'Descarta fallas en el monitor o cable de video DisplayPort/HDMI.',
        resultadoObtenido: 'Monitor y cable funcionan en otro equipo; la ausencia de video se debe a que la placa madre nunca llega al paso 15 (GOP).',
        evidenciaGenerada: 'La falta de video es consecuencia secundaria de la detención temprana del POST.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['hyp-gpu'],
      },
    ],
    correctDiagnosis: 'hyp-ram',
    diagnosticoFinal: {
      causa: 'Inestabilidad en la calibración de memoria RAM durante la fase de entrenamiento (Memory Training) por perfil XMP/EXPO descalibrado.',
      evidenciaClave: [
        'Detención del arranque en el Paso 12 antes de enumerar buses PCIe o Almacenamiento.',
        'Arranque exitoso al aislar a un solo módulo en slot A2 y restablecer parámetros CMOS a valores JEDEC base.',
      ],
      pasoDetencion: 'Paso 12: Entrenamiento de memoria (Memory Training).',
      pruebaConfirmatoria: 'Prueba con un solo módulo en slot principal A2 y restablecimiento de CMOS.',
      accionRecomendada: 'Limpiar contactos de ambos módulos con alcohol isopropílico, actualizar BIOS para mejorar la compatibilidad del IMC y reconfigurar perfil de memoria estable.',
      verificacionPosterior: 'Ejecutar 4 pasadas completas de MemTest86 en Dual Channel para asegurar cero errores de paridad.',
    },
  },
  {
    id: 'case-02',
    number: 'CASO 02',
    titulo: 'PC enciende, hay actividad, pero no aparece salida gráfica',
    descripcionInicial:
      'El equipo enciende, los ventiladores giran, el teclado enciende momentáneamente sus luces de Bloq Num (superando el POST de memoria y CPU), pero el monitor permanece completamente en negro con "Sin Señal".',
    sintomaPrincipal:
      'Plataforma supera las fases iniciales de hardware pero el monitor no recibe señal ni inicializa el framebuffer.',
    failureId: 'fail-gpu-gop',
    stopStep: 15,
    falloEnPasoNombre: 'Inicialización GPU (GOP / Graphics Output Protocol)',
    ultimoPasoConfirmado: 14,
    primerPasoNoCompletado: 15,
    evidenciaInicial: [
      'Alimentación de placa base, CPU y RAM verificadas; memoria entrenada con éxito.',
      'Enumeración PCIe (Paso 14) recorrió los slots de expansión.',
      'Al intentar ejecutar el protocolo GOP del VBIOS de la placa de video, no se genera la señal de sincronización TMDS/DisplayPort hacia el monitor.',
    ],
    hypotheses: [
      {
        id: 'hyp-gpu',
        name: 'Falta de alimentación auxiliar PCIe en la GPU o falla en controlador GOP',
        component: 'GPU',
        description: 'La tarjeta gráfica dedicada no recibe energía suficiente en sus conectores auxiliares o su firmware GOP no responde.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El sistema se frena en el paso 15 tras haber completado el entrenamiento de memoria y enumeración PCIe.'],
      },
      {
        id: 'hyp-ram',
        name: 'Falla o incompatibilidad en módulos de memoria RAM',
        component: 'RAM',
        description: 'Corrupción de datos en DRAM impidiendo continuar el arranque.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['Los módulos RAM ya fueron detectados y entrenados satisfactoriamente en los pasos 11 y 12.'],
      },
      {
        id: 'hyp-driver',
        name: 'Controlador de gráficos de Windows incompatible',
        component: 'DRIVER',
        description: 'Driver de video corrupto en el sistema operativo.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El sistema aún se encuentra en nivel firmware UEFI; Windows y sus drivers no han sido cargados.'],
      },
      {
        id: 'hyp-storage',
        name: 'SSD NVMe dañado impidiendo la carga del sistema',
        component: 'ALMACENAMIENTO',
        description: 'Unidad de almacenamiento en corte impidiendo el paso de video.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['La detección de almacenamiento es posterior o paralela y no condiciona la señal gráfica básica del BIOS.'],
      },
    ],
    tests: [
      {
        id: 'test-c2-01',
        name: 'Inspección de conectores de alimentación PCIe de 8 pines en la GPU dedicada',
        level: 'USUARIO',
        queComprueba: 'Verifica si la tarjeta gráfica dedicada tiene los conectores de energía auxiliar firmemente acoplados.',
        resultadoObtenido: 'Se detecta un conector PCIe de 8 pines parcialmente desacoplado. Al conectarlo firmemente con el equipo apagado, el monitor recibe señal inmediatamente y muestra el logo UEFI.',
        evidenciaGenerada: 'La placa de video dedicada no inicializaba el protocolo GOP por falta de alimentación auxiliar.',
        hipotesisFortalece: ['hyp-gpu'],
        hipotesisDebilita: ['hyp-ram', 'hyp-driver', 'hyp-storage'],
        esPruebaConfirmatoria: true,
      },
      {
        id: 'test-c2-02',
        name: 'Conexión del monitor a la salida de video integrada de la placa madre (si dispone de iGPU)',
        level: 'USUARIO',
        queComprueba: 'Comprueba si la CPU y la placa madre completan el POST emitiendo video por el procesador.',
        resultadoObtenido: 'La salida integrada muestra imagen correctamente y permite ingresar al BIOS, confirmando que la CPU, RAM y motherboard están 100% sanas.',
        evidenciaGenerada: 'El resto de la plataforma funciona perfectamente; la falla se circunscribe a la GPU dedicada.',
        hipotesisFortalece: ['hyp-gpu'],
        hipotesisDebilita: ['hyp-ram', 'hyp-storage'],
      },
      {
        id: 'test-c2-03',
        name: 'Retiro y limpieza de contactos de memoria RAM',
        level: 'USUARIO',
        queComprueba: 'Descarta falsos contactos en los slots de memoria.',
        resultadoObtenido: 'Los módulos se limpian y reinsertan, pero la pantalla sigue sin señal si la GPU permanece sin energía auxiliar.',
        evidenciaGenerada: 'La memoria RAM se encuentra en estado óptimo y no es la causante.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['hyp-ram'],
      },
    ],
    correctDiagnosis: 'hyp-gpu',
    diagnosticoFinal: {
      causa: 'Falta de alimentación eléctrica auxiliar en la placa de video dedicada, impidiendo la activación del controlador GOP (Graphics Output Protocol).',
      evidenciaClave: [
        'Hardware de CPU, RAM y bus PCIe validados con éxito.',
        'Conector PCIe auxiliar de 8 pines desacoplado.',
        'Restablecimiento instantáneo de video al asegurar la conexión eléctrica de la GPU.',
      ],
      pasoDetencion: 'Paso 15: Inicialización GPU (GOP / Graphics Output Protocol).',
      pruebaConfirmatoria: 'Inspección y fijación de los conectores de energía PCIe de 8 pines.',
      accionRecomendada: 'Asegurar el acople de todos los conectores PCIe de la fuente y verificar la correcta inserción de la tarjeta en el slot PCIe x16.',
      verificacionPosterior: 'Comprobar visualización inmediata de pantalla de POST y estabilidad gráfica en pruebas de carga.',
    },
  },
  {
    id: 'case-03',
    number: 'CASO 03',
    titulo: 'POST correcto pero no aparece dispositivo de arranque',
    descripcionInicial:
      'El equipo enciende, supera el POST con éxito, muestra el logo de la placa madre y de inmediato arroja el mensaje "Reboot and Select proper Boot Device" o ingresa directamente al BIOS Setup sin cargar Windows.',
    sintomaPrincipal:
      'Todo el hardware pasa el diagnóstico inicial pero el firmware no localiza ningún medio ejecutable configurado.',
    failureId: 'fail-bds-boot-order',
    stopStep: 20,
    falloEnPasoNombre: 'Firmware determina dispositivo de arranque (Boot Order / NVRAM)',
    ultimoPasoConfirmado: 19,
    primerPasoNoCompletado: 20,
    evidenciaInicial: [
      'POST superado con éxito (Paso 19). Todos los componentes de hardware (CPU, RAM, GPU, Almacenamiento físico) validados.',
      'La fase Boot Device Selection (BDS) consulta la NVRAM pero no encuentra la entrada "Windows Boot Manager" o la partición EFI System Partition (ESP) está ausente.',
    ],
    hypotheses: [
      {
        id: 'hyp-bootloader',
        name: 'Orden de arranque desconfigurado en NVRAM o partición EFI (ESP) eliminada/dañada',
        component: 'BOOTLOADER / NVRAM',
        description: 'El firmware no encuentra el archivo bootmgfw.efi en la partición FAT32 del disco de sistema.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El hardware completó el POST pero el arranque se frena al buscar el cargador de sistema operativo.'],
      },
      {
        id: 'hyp-ram',
        name: 'Falla en la memoria RAM impidiendo la carga del gestor de arranque',
        component: 'RAM',
        description: 'Módulos de memoria inestables impidiendo la ejecución de código.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['La RAM ya fue completamente validada en las pruebas POST previas.'],
      },
      {
        id: 'hyp-services',
        name: 'Servicio crítico de Windows bloqueando el inicio',
        component: 'SERVICIOS',
        description: 'Servicio de sistema en Sesión 0 con fallas de arranque.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['Windows ni siquiera ha comenzado a cargarse en memoria RAM.'],
      },
      {
        id: 'hyp-gpu',
        name: 'Incompatibilidad de resolución en la placa de video',
        component: 'GPU',
        description: 'Falla gráfica impidiendo mostrar el menú de arranque.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El monitor muestra claramente el mensaje de error de texto o el menú BIOS.'],
      },
    ],
    tests: [
      {
        id: 'test-c3-01',
        name: 'Ingreso al Setup BIOS/UEFI para auditar la sección Boot y lista de almacenamiento',
        level: 'USUARIO',
        queComprueba: 'Comprueba si la unidad física es detectada y qué opciones de booteo figuran configuradas.',
        resultadoObtenido: 'El SSD NVMe figura conectado físicamente con su capacidad correcta, pero en la lista Boot Order no existe la entrada "Windows Boot Manager" por un reseteo de CMOS previo.',
        evidenciaGenerada: 'El disco está sano pero la entrada UEFI en NVRAM se perdió y requiere ser reindexada o reparada.',
        hipotesisFortalece: ['hyp-bootloader'],
        hipotesisDebilita: ['hyp-ram', 'hyp-services', 'hyp-gpu'],
        esPruebaConfirmatoria: true,
      },
      {
        id: 'test-c3-02',
        name: 'Arranque desde USB de instalación oficial y verificación de particiones con diskpart',
        level: 'USUARIO',
        queComprueba: 'Verifica la integridad de las particiones del SSD desde la consola de recuperación.',
        resultadoObtenido: 'diskpart muestra la partición de Windows (C:) intacta y la partición EFI de 100MB presente en FAT32, pero sin el puntero BCD configurado.',
        evidenciaGenerada: 'Confirmación de que el sistema operativo y el hardware están sanos, requiriendo únicamente regenerar el BCD.',
        hipotesisFortalece: ['hyp-bootloader'],
        hipotesisDebilita: ['hyp-ram', 'hyp-services'],
      },
      {
        id: 'test-c3-03',
        name: 'Ejecución de prueba de diagnóstico de memoria Windows en recuperación',
        level: 'USUARIO',
        queComprueba: 'Descarta fallas de memoria como causante de errores de booteo.',
        resultadoObtenido: 'Diagnóstico de memoria finaliza con 0 errores.',
        evidenciaGenerada: 'La memoria RAM no tiene relación con la ausencia del dispositivo de arranque.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['hyp-ram'],
      },
    ],
    correctDiagnosis: 'hyp-bootloader',
    diagnosticoFinal: {
      causa: 'Pérdida de la entrada "Windows Boot Manager" en las variables NVRAM del firmware UEFI tras reseteo de configuración, impidiendo la localización automática de la partición ESP.',
      evidenciaClave: [
        'POST superado al 100% y SSD detectado físicamente.',
        'Mensaje de error en Paso 20 al no encontrar un gestor UEFI válido en el orden de prioridad.',
        'Partición C: y datos de Windows completamente intactos.',
      ],
      pasoDetencion: 'Paso 20: Firmware determina dispositivo de arranque (Boot Order / NVRAM).',
      pruebaConfirmatoria: 'Auditoría de la sección Boot en UEFI y confirmación de particiones con diskpart.',
      accionRecomendada: 'Regenerar el almacén BCD y la entrada NVRAM ejecutando "bcdboot C:\\Windows /s S: /f UEFI" desde el medio de instalación oficial.',
      verificacionPosterior: 'Reiniciar y comprobar que el equipo bootea directamente en Windows Boot Manager sin pasar por el setup.',
    },
  },
  {
    id: 'case-04',
    number: 'CASO 04',
    titulo: 'Windows comienza a cargar pero falla antes de iniciar kernel correctamente',
    descripcionInicial:
      'El equipo enciende, supera el POST, muestra el logo de Windows con los puntos girando por 2 segundos y súbitamente se interrumpe con Pantalla Azul (BSOD): INACCESSIBLE_BOOT_DEVICE (0x0000007B).',
    sintomaPrincipal:
      'El Boot Manager y winload.efi se ejecutan, pero el kernel colapsa al intentar montar la partición del sistema.',
    failureId: 'fail-boot-start-driver',
    stopStep: 26,
    falloEnPasoNombre: 'Carga de drivers BOOT_START (Controladores de arranque)',
    ultimoPasoConfirmado: 25,
    primerPasoNoCompletado: 26,
    evidenciaInicial: [
      'winload.efi cargó ntoskrnl.exe y hal.dll en memoria RAM (Pasos 23 a 25).',
      'Al transferir el control a la fase de drivers BOOT_START (Start=0), el controlador de almacenamiento de Windows no logra montar la partición C: debido a un cambio en el modo de la controladora en BIOS.',
    ],
    hypotheses: [
      {
        id: 'hyp-driver',
        name: 'Incompatibilidad en controlador BOOT_START por cambio de modo SATA/NVMe (VMD / RAID vs AHCI)',
        component: 'DRIVER / CONTROLADORA',
        description: 'El modo de operación de la controladora en BIOS no coincide con los drivers cargados en la fase temprana de arranque.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El fallo ocurre exactamente en el Paso 26 con el código BSOD 0x7B INACCESSIBLE_BOOT_DEVICE.'],
      },
      {
        id: 'hyp-desktop',
        name: 'Corrupción en el proceso explorer.exe',
        component: 'DESKTOP / SHELL',
        description: 'Falla en el entorno gráfico de usuario.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['La secuencia se interrumpe mucho antes de que se creen las sesiones de usuario.'],
      },
      {
        id: 'hyp-ram',
        name: 'Falla física en los chips de memoria RAM',
        component: 'RAM',
        description: 'Celdas de memoria defectuosas provocando la pantalla azul.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El código 0x7B es específico de acceso a dispositivo de almacenamiento de arranque, no de paridad de memoria.'],
      },
      {
        id: 'hyp-psu',
        name: 'Caída de voltaje en el riel de +12V de la fuente',
        component: 'PSU',
        description: 'Inestabilidad eléctrica al exigir carga al procesador.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['La fuente mantiene alimentación estable y el BSOD es generado por el software del kernel.'],
      },
    ],
    tests: [
      {
        id: 'test-c4-01',
        name: 'Auditoría del modo de almacenamiento (SATA/NVMe / Intel VMD Mode) en el Setup UEFI',
        level: 'USUARIO',
        queComprueba: 'Verifica si la controladora de disco fue cambiada entre modo AHCI estándar y RAID/Intel VMD.',
        resultadoObtenido: 'Se observa que tras una actualización de BIOS se habilitó por defecto "Intel VMD / RAID", mientras que Windows fue instalado en modo AHCI / NVMe nativo.',
        evidenciaGenerada: 'El kernel intenta usar el driver estándar stornvme.sys sin encontrar el volumen manejado por la controladora VMD.',
        hipotesisFortalece: ['hyp-driver'],
        hipotesisDebilita: ['hyp-desktop', 'hyp-ram', 'hyp-psu'],
        esPruebaConfirmatoria: true,
      },
      {
        id: 'test-c4-02',
        name: 'Intento de inicio en Modo Seguro desde las Opciones avanzadas de arranque',
        level: 'USUARIO',
        queComprueba: 'Comprueba si el fallo se replica con la configuración mínima de controladores.',
        resultadoObtenido: 'El fallo INACCESSIBLE_BOOT_DEVICE persiste idéntico en Modo Seguro, ya que los drivers BOOT_START son indispensables en cualquier modo.',
        evidenciaGenerada: 'El problema reside en el nivel más bajo de acceso al almacenamiento del kernel.',
        hipotesisFortalece: ['hyp-driver'],
        hipotesisDebilita: ['hyp-desktop'],
      },
      {
        id: 'test-c4-03',
        name: 'Ejecución de MemTest86 en banco de pruebas',
        level: 'USUARIO',
        queComprueba: 'Descarta inestabilidad en los bancos de memoria.',
        resultadoObtenido: 'Memoria RAM supera 100% de los patrones de prueba sin anomalías.',
        evidenciaGenerada: 'La memoria no es la causante del error de montaje de disco.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['hyp-ram'],
      },
    ],
    correctDiagnosis: 'hyp-driver',
    diagnosticoFinal: {
      causa: 'Discrepancia entre la configuración de la controladora en BIOS (Intel VMD/RAID activado) y los controladores BOOT_START instalados en Windows (AHCI/NVMe nativo), provocando el BSOD 0x7B.',
      evidenciaClave: [
        'BSOD INACCESSIBLE_BOOT_DEVICE en el paso 26.',
        'winload.efi y HAL cargados previamente sin fallos.',
        'Confirmación en BIOS de opción Intel VMD habilitada accidentalmente.',
      ],
      pasoDetencion: 'Paso 26: Carga de drivers BOOT_START (Controladores de arranque).',
      pruebaConfirmatoria: 'Auditoría del modo de almacenamiento en UEFI y verificación de consistencia de controladores.',
      accionRecomendada: 'Desactivar Intel VMD / RAID en el setup del BIOS y configurar el modo en AHCI / NVMe estándar.',
      verificacionPosterior: 'Iniciar Windows y corroborar carga completa del kernel y servicios sin pantallas azules.',
    },
  },
  {
    id: 'case-05',
    number: 'CASO 05',
    titulo: 'Windows llega al inicio de sesión pero no alcanza escritorio funcional',
    descripcionInicial:
      'El equipo completa el arranque de Windows, el usuario introduce su contraseña/PIN en la pantalla de bloqueo (LogonUI), aparece el mensaje "Bienvenido" y luego la pantalla queda completamente negra con solo el cursor del mouse visible.',
    sintomaPrincipal:
      'Autenticación exitosa en Sesión 1 pero el shell interactivo de escritorio no se inicializa.',
    failureId: 'fail-shell-explorer',
    stopStep: 33,
    falloEnPasoNombre: 'explorer.exe (Shell interactivo del usuario)',
    ultimoPasoConfirmado: 32,
    primerPasoNoCompletado: 33,
    evidenciaInicial: [
      'Servicios de sistema en Sesión 0 activos.',
      'LogonUI y winlogon en Sesión 1 respondieron a las credenciales del usuario y montaron el perfil.',
      'El cursor del mouse se mueve y el Administrador de Tareas puede invocarse con Ctrl+Shift+Esc, demostrando que el kernel, subsistema gráfico y servicios están operativos, pero el shell de usuario no arrancó.',
    ],
    hypotheses: [
      {
        id: 'hyp-shell',
        name: 'Falla en el inicio automático del shell (explorer.exe) o clave Shell del Registro alterada',
        component: 'DESKTOP / SHELL',
        description: 'La clave de Registro que define el shell de usuario está corrupta o el binario explorer.exe se encuentra bloqueado.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El fallo ocurre en el Paso 33 tras la autenticación exitosa del usuario.'],
      },
      {
        id: 'hyp-hardware',
        name: 'Falla física en las fases VRM de la placa madre',
        component: 'HARDWARE / VRM',
        description: 'Caída de potencia en el regulador de voltaje.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El hardware se encuentra completamente encendido y respondiendo al teclado y mouse.'],
      },
      {
        id: 'hyp-bootloader',
        name: 'Corrupción en winload.efi',
        component: 'BOOTLOADER',
        description: 'Cargador de sistema operativo defectuoso.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['winload.efi ya cumplió su función hace 10 pasos en la secuencia de arranque.'],
      },
      {
        id: 'hyp-firmware',
        name: 'Microcódigo de BIOS desactualizado',
        component: 'FIRMWARE',
        description: 'Incompatibilidad de firmware a nivel placa madre.',
        initialStatus: 'POSIBLE',
        evidenceNotes: ['El sistema operativo ya está en modo usuario interactivo en Sesión 1.'],
      },
    ],
    tests: [
      {
        id: 'test-c5-01',
        name: 'Apertura del Administrador de Tareas (Ctrl+Shift+Esc) y ejecución manual de "explorer.exe"',
        level: 'USUARIO',
        queComprueba: 'Verifica si el binario explorer.exe funciona al ser lanzado manualmente dentro de la sesión activa.',
        resultadoObtenido: 'Al ejecutar "explorer.exe" desde Archivo -> Ejecutar nueva tarea, la barra de tareas, iconos del escritorio y bandeja del sistema se renderizan de forma instantánea.',
        evidenciaGenerada: 'El ejecutable explorer.exe está sano; lo que falló fue su lanzamiento automático por parte de winlogon.',
        hipotesisFortalece: ['hyp-shell'],
        hipotesisDebilita: ['hyp-hardware', 'hyp-bootloader', 'hyp-firmware'],
        esPruebaConfirmatoria: true,
      },
      {
        id: 'test-c5-02',
        name: 'Auditoría de la clave de Registro Shell en HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon',
        level: 'USUARIO',
        queComprueba: 'Comprueba el valor de la clave Shell que winlogon consulta para lanzar el escritorio.',
        resultadoObtenido: 'La clave "Shell" contenía una ruta residual inválida dejada por un desinstalador de terceros en lugar del valor estándar "explorer.exe".',
        evidenciaGenerada: 'Se identifica con precisión quirúrgica la causa raíz de la falla de lanzamiento.',
        hipotesisFortalece: ['hyp-shell'],
        hipotesisDebilita: ['hyp-hardware', 'hyp-bootloader', 'hyp-firmware'],
      },
      {
        id: 'test-c5-03',
        name: 'Comprobación de registros en el Visor de Eventos para servicios del sistema',
        level: 'USUARIO',
        queComprueba: 'Descarta errores en los servicios de fondo de Sesión 0.',
        resultadoObtenido: 'Todos los servicios de sistema reportan estado normal sin incidencias críticas.',
        evidenciaGenerada: 'La falla está restringida exclusivamente a la inicialización del shell de la sesión de usuario.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['hyp-hardware'],
      },
    ],
    correctDiagnosis: 'hyp-shell',
    diagnosticoFinal: {
      causa: 'Clave de Registro "Shell" en Winlogon modificada con un valor inválido por software de terceros, impidiendo la ejecución automática de explorer.exe tras el inicio de sesión.',
      evidenciaClave: [
        'Sistema completamente operativo con mouse y Task Manager funcionales en Paso 33.',
        'Lanzamiento manual de explorer.exe restaura inmediatamente el escritorio y barra de tareas.',
        'Valor anómalo detectado en la clave de Registro de Winlogon.',
      ],
      pasoDetencion: 'Paso 33: explorer.exe (Shell interactivo del usuario).',
      pruebaConfirmatoria: 'Ejecución manual de explorer.exe desde el Administrador de Tareas y auditoría de la clave Winlogon.',
      accionRecomendada: 'Restablecer el valor de la cadena "Shell" a "explorer.exe" en HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon.',
      verificacionPosterior: 'Cerrar sesión y volver a ingresar comprobando la aparición automática del escritorio.',
    },
  },
];

// ============================================================================
// MODO PC MISTERIOSA (MYSTERY LAB ENGINE)
// ============================================================================

export type MysteryComponentKey =
  | 'CPU'
  | 'RAM'
  | 'GPU'
  | 'PLACA_BASE'
  | 'PSU'
  | 'ALMACENAMIENTO'
  | 'FIRMWARE'
  | 'BOOTLOADER'
  | 'KERNEL'
  | 'DRIVER'
  | 'SERVICIOS'
  | 'SESION_WINDOWS';

export type MysteryHypothesisState =
  | 'SIN_EVIDENCIA'
  | 'POSIBLE'
  | 'SOSTENIDA'
  | 'DEBILITADA'
  | 'DESCARTADA'
  | 'CONFIRMADA';

export interface MysteryTest {
  id: string;
  nombre: string;
  nivel: SafetyLevel;
  riesgoAdvertencia?: string;
  queIntentaComprobar: string;
  resultadoObservado: string;
  evidenciaDescubierta: string;
  porQueExplicacion: string;
  hipotesisFortalece: MysteryComponentKey[];
  hipotesisDebilita: MysteryComponentKey[];
  hipotesisDescarta: MysteryComponentKey[];
  esDecisiva?: boolean;
}

export interface MysteryCase {
  id: string;
  codigoCaso: string;
  descripcionPC: string;
  sintomaObservado: string;
  estadoInicial: string;
  stopStep: number;
  ultimoEstadoConfirmado: string;
  siguienteEtapa: string;
  observacionTecnica: string;
  correctComponent: MysteryComponentKey;
  causaRaiz: string;
  etapaProducida: string;
  evidenciasClave: string[];
  pruebaDecisivaNombre: string;
  accionRecomendada: string;
  verificacionPosterior: string;
  rutaRazonamiento: string[];
  pruebasDisponibles: MysteryTest[];
}

export const ALL_MYSTERY_COMPONENTS: { key: MysteryComponentKey; label: string }[] = [
  { key: 'PSU', label: 'PSU / Fuente de Poder' },
  { key: 'PLACA_BASE', label: 'Placa Base / Motherboard' },
  { key: 'CPU', label: 'CPU / Microprocesador' },
  { key: 'RAM', label: 'RAM / Memoria del Sistema' },
  { key: 'GPU', label: 'GPU / Tarjeta Gráfica' },
  { key: 'ALMACENAMIENTO', label: 'Almacenamiento (SSD / NVMe / SATA)' },
  { key: 'FIRMWARE', label: 'Firmware (UEFI / BIOS / SPI)' },
  { key: 'BOOTLOADER', label: 'Bootloader / Windows Boot Manager' },
  { key: 'KERNEL', label: 'Kernel de Windows (ntoskrnl.exe & HAL)' },
  { key: 'DRIVER', label: 'Controladores / Drivers BOOT_START' },
  { key: 'SERVICIOS', label: 'Servicios de Windows (SCM / svchost)' },
  { key: 'SESION_WINDOWS', label: 'Sesión de Usuario / Shell (explorer.exe)' },
];

export const MYSTERY_CASES_POOL: MysteryCase[] = [
  {
    id: 'myst-01',
    codigoCaso: 'EXP-MIST-4821',
    descripcionPC: 'PC Desktop ATX ensamblada recientemente. Componentes de gama alta con iluminación y ventiladores conectados a la placa base.',
    sintomaObservado: 'Al presionar POWER, los ventiladores comienzan a girar a alta velocidad de forma sostenida. No hay señal en el monitor y el equipo se reinicia solo a los pocos segundos.',
    estadoInicial: 'Equipo en reposo, enchufado a la toma de corriente.',
    stopStep: 12,
    ultimoEstadoConfirmado: 'Paso 11: Detección de módulos RAM (Lectura SPD en SMBus exitosa).',
    siguienteEtapa: 'Paso 12: Entrenamiento de memoria (Memory Training no completado).',
    observacionTecnica: 'Los ventiladores giran pero el bucle de reinicios se produce antes de la enumeración de buses PCIe.',
    correctComponent: 'RAM',
    causaRaiz: 'Inestabilidad en la calibración de latencias y retrasos durante el entrenamiento de memoria RAM (Memory Training) provocado por perfil de overclocking inestable o suciedad en contactos del slot secundario.',
    etapaProducida: 'Paso 12: Entrenamiento de memoria (Memory Training)',
    evidenciasClave: [
      'Alimentación eléctrica y microcódigo de CPU validados correctamente.',
      'Lectura de SPD positiva pero falla en sincronización de datos DQ/DQS.',
      'Arranque normal alcanzado únicamente al probar con un solo módulo en slot preferencial A2 y CMOS restablecido.',
    ],
    pruebaDecisivaNombre: 'Prueba de arranque con un solo módulo en slot A2 y Clear CMOS',
    accionRecomendada: 'Limpiar pines con alcohol isopropílico, actualizar microcódigo de BIOS para mejorar compatibilidad de memoria y ajustar perfil JEDEC/XMP estable.',
    verificacionPosterior: 'Ejecutar 4 pasadas completas de MemTest86 sin errores en Dual Channel.',
    rutaRazonamiento: [
      'OBSERVAR: Ventiladores acelerados, sin video y reinicios cíclicos',
      'LOCALIZAR: Detención en fase de inicialización de memoria tras lectura SPD',
      'FORMULAR HIPÓTESIS: Sospecha de RAM e IMC vs GPU',
      'ELEGIR PRUEBA: Aislamiento a un solo módulo y Clear CMOS',
      'OBTENER EVIDENCIA: POST exitoso con un solo módulo a frecuencia base',
      'DESCARTAR: GPU, Almacenamiento y Bootloader (no alcanzados aún)',
      'CONFIRMAR: Inestabilidad de canal de memoria RAM en Memory Training',
    ],
    pruebasDisponibles: [
      {
        id: 'pm-t1-01',
        nombre: 'Prueba de arranque con un solo módulo en slot A2 y Clear CMOS',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Aísla fallas en perfiles de memoria o diferencias de longitud en el canal B.',
        resultadoObservado: 'El equipo supera el entrenamiento en 3 segundos, emite señal de video y entra al setup BIOS con normalidad.',
        evidenciaDescubierta: 'El equipo es 100% funcional con un único módulo a frecuencia base JEDEC.',
        porQueExplicacion: 'Si la máquina arranca al aislar un canal de RAM y restablecer los parámetros de temporizado, confirma que la detención ocurría por inestabilidad en el bus de memoria y no por fallas en procesador o video.',
        hipotesisFortalece: ['RAM'],
        hipotesisDebilita: ['GPU', 'ALMACENAMIENTO', 'BOOTLOADER', 'DRIVER'],
        hipotesisDescarta: ['PSU', 'CPU'],
        esDecisiva: true,
      },
      {
        id: 'pm-t1-02',
        nombre: 'Desconexión de cable de datos y alimentación de unidades de almacenamiento',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Descarta que una unidad SSD en cortocircuito bloquee las líneas de control.',
        resultadoObservado: 'Sin almacenamiento conectado, el bucle de reinicios en el paso 12 continúa exactamente igual.',
        evidenciaDescubierta: 'El almacenamiento no interviene en la fase de entrenamiento de memoria.',
        porQueExplicacion: 'El firmware no ha llegado a la fase de enumeración de almacenamiento; por tanto, desconectar discos no modifica la causa de la detención.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['ALMACENAMIENTO', 'BOOTLOADER'],
        hipotesisDescarta: ['ALMACENAMIENTO'],
      },
      {
        id: 'pm-t1-03',
        nombre: 'Comprobación de monitor y cable HDMI/DisplayPort en otra computadora',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Verifica que el monitor y cable no estén averiados.',
        resultadoObservado: 'Monitor y cable funcionan perfectamente; la pantalla negra se debe a que la placa base se reinicia antes de inicializar la GPU.',
        evidenciaDescubierta: 'El monitor y cable están sanos; la falta de video es síntoma secundario.',
        porQueExplicacion: 'La salida de video requiere que el POST complete el entrenamiento de RAM y enumeración PCIe. Como se detiene antes, el monitor nunca recibe sincronismo.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['GPU'],
        hipotesisDescarta: [],
      },
    ],
  },
  {
    id: 'myst-02',
    codigoCaso: 'EXP-MIST-7193',
    descripcionPC: 'Equipo con tarjeta gráfica dedicada conectada en slot PCIe x16. El usuario reporta que tras mover el gabinete no obtiene imagen.',
    sintomaObservado: 'El equipo enciende, ventiladores giran estables y el teclado ilumina sus indicadores de bloqueo Num/Caps, pero el monitor indica "Sin Señal".',
    estadoInicial: 'Equipo apagado tras traslado del gabinete.',
    stopStep: 15,
    ultimoEstadoConfirmado: 'Paso 14: Enumeración PCIe (Scanning de buses y slots completado).',
    siguienteEtapa: 'Paso 15: Inicialización GPU (GOP / Graphics Output Protocol no completado).',
    observacionTecnica: 'La placa base superó la comprobación de memoria y CPU pero no recibe respuesta del microcódigo de video GOP.',
    correctComponent: 'GPU',
    causaRaiz: 'Falta de alimentación auxiliar PCIe o desacople en conectores de 8 pines de la tarjeta de video dedicada, impidiendo la ejecución de su firmware GOP.',
    etapaProducida: 'Paso 15: Inicialización GPU (GOP / Graphics Output Protocol)',
    evidenciasClave: [
      'Indicadores del teclado demuestran que el microcódigo de CPU y RAM finalizaron el POST.',
      'Detención en Paso 15 sin activación del transmisor DisplayPort/HDMI.',
      'Revisión física detectó conector PCIe de 8 pines desacoplado.',
    ],
    pruebaDecisivaNombre: 'Inspección física y reajuste de conectores PCIe de 8 pines en la GPU',
    accionRecomendada: 'Asegurar el acople firme del cable PCIe modular y comprobar el calce de la traba de retención del slot x16.',
    verificacionPosterior: 'Encendido inmediato con visualización del logo UEFI y respuesta fluida de video.',
    rutaRazonamiento: [
      'OBSERVAR: Teclado responde (POST avanzado) pero monitor en Sin Señal',
      'LOCALIZAR: Detención exacta en Paso 15 de GOP',
      'FORMULAR HIPÓTESIS: Sospecha de GPU vs Monitor vs Driver',
      'ELEGIR PRUEBA: Inspección de alimentación auxiliar PCIe',
      'OBTENER EVIDENCIA: Conector de energía flojo; al fijarlo, video aparece de inmediato',
      'DESCARTAR: RAM, CPU y Drivers de Windows',
      'CONFIRMAR: Falla de alimentación en GPU dedicada',
    ],
    pruebasDisponibles: [
      {
        id: 'pm-t2-01',
        nombre: 'Inspección física y reajuste de conectores PCIe de 8 pines en la GPU',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Verifica la correcta inserción de la alimentación auxiliar de la tarjeta gráfica.',
        resultadoObservado: 'Uno de los conectores de 8 pines estaba suelto. Al asegurarlo firmemente, el monitor despierta y muestra imagen al instante.',
        evidenciaDescubierta: 'La tarjeta gráfica dedicada no inicializaba su GOP por falta de energía en el riel de 12V auxiliar.',
        porQueExplicacion: 'Las tarjetas de video de alto consumo bloquean su inicialización VBIOS si los sensores de presencia de los conectores PCIe auxiliares detectan circuito abierto.',
        hipotesisFortalece: ['GPU'],
        hipotesisDebilita: ['RAM', 'CPU', 'DRIVER', 'SESION_WINDOWS'],
        hipotesisDescarta: ['RAM', 'CPU'],
        esDecisiva: true,
      },
      {
        id: 'pm-t2-02',
        nombre: 'Conexión a salida de video integrada en motherboard (iGPU)',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Aísla si la falla reside en la gráfica dedicada o en la placa base/procesador.',
        resultadoObservado: 'La salida integrada emite video de inmediato confirmando que el POST se completó con éxito.',
        evidenciaDescubierta: 'La motherboard y CPU operan al 100%; la falla es exclusiva de la GPU dedicada.',
        porQueExplicacion: 'Si el procesador emite video pero la tarjeta dedicada no, se descarta toda la infraestructura común de la placa madre y memoria.',
        hipotesisFortalece: ['GPU'],
        hipotesisDebilita: ['PLACA_BASE', 'CPU', 'RAM'],
        hipotesisDescarta: ['CPU', 'RAM'],
      },
      {
        id: 'pm-t2-03',
        nombre: 'Retiro y limpieza de módulos de memoria RAM',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Descarta falsos contactos en los contactos dorados de la memoria.',
        resultadoObservado: 'Los módulos se limpian pero la tarjeta dedicada continúa sin señal de video.',
        evidenciaDescubierta: 'La memoria RAM se encuentra en estado óptimo.',
        porQueExplicacion: 'El teclado ya respondía a Bloq Num, lo que probaba que la RAM ya había sido entrenada y el POST de memoria estaba superado.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['RAM'],
        hipotesisDescarta: ['RAM'],
      },
    ],
  },
  {
    id: 'myst-03',
    codigoCaso: 'EXP-MIST-3058',
    descripcionPC: 'Computadora de oficina que tras un reinicio inesperado muestra pantalla negra con texto blanco y no ingresa a Windows.',
    sintomaObservado: 'El equipo supera el logo de la motherboard y queda detenido con el mensaje "Reboot and Select proper Boot Device" o ingresa directamente al BIOS.',
    estadoInicial: 'Equipo encendido en bucle de selección de arranque.',
    stopStep: 20,
    ultimoEstadoConfirmado: 'Paso 19: POST superado con éxito (Todos los subsistemas de hardware validados).',
    siguienteEtapa: 'Paso 20: Firmware determina dispositivo de arranque (Boot Order / NVRAM no encuentra entrada válida).',
    observacionTecnica: 'El hardware está sano pero la rutina BDS no encuentra la entrada UEFI de arranque en la memoria NVRAM.',
    correctComponent: 'BOOTLOADER',
    causaRaiz: 'Pérdida de la entrada "Windows Boot Manager" en las variables NVRAM o partición EFI (ESP FAT32) desconfigurada tras corrupción de configuración.',
    etapaProducida: 'Paso 20: Firmware determina dispositivo de arranque (Boot Order / NVRAM)',
    evidenciasClave: [
      'POST 100% superado; hardware y periféricos validados.',
      'Detención en Paso 20 por ausencia de descriptor de arranque válido.',
      'SSD físicamente detectado pero sin orden de prioridad EFI.',
    ],
    pruebaDecisivaNombre: 'Auditoría de orden de arranque en Setup BIOS y verificación de partición EFI con diskpart',
    accionRecomendada: 'Regenerar la entrada NVRAM y partición de sistema ejecutando "bcdboot C:\\Windows /s S: /f UEFI" desde medio USB de recuperación.',
    verificacionPosterior: 'Reinicio automático directo hacia Windows Boot Manager sin mensajes de error.',
    rutaRazonamiento: [
      'OBSERVAR: Mensaje Reboot and Select proper Boot Device tras POST',
      'LOCALIZAR: Detención exacta en Paso 20 (Selección de dispositivo de arranque)',
      'FORMULAR HIPÓTESIS: Sospecha de Bootloader / NVRAM vs SSD dañado',
      'ELEGIR PRUEBA: Auditoría de particiones con diskpart desde USB de recuperación',
      'OBTENER EVIDENCIA: SSD y Windows intactos; falta puntero BCD en partición EFI',
      'DESCARTAR: Falla física de SSD, CPU y Memoria',
      'CONFIRMAR: Corrupción de entrada Bootloader en NVRAM / Partición EFI',
    ],
    pruebasDisponibles: [
      {
        id: 'pm-t3-01',
        nombre: 'Auditoría de orden de arranque en Setup BIOS y verificación de partición EFI con diskpart',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Verifica la presencia del disco y la integridad del volumen EFI FAT32.',
        resultadoObservado: 'El SSD figura en el BIOS pero sin entrada Windows Boot Manager. diskpart muestra la partición de Windows intacta pero el BCD requiere regeneración.',
        evidenciaDescubierta: 'El almacenamiento físico está sano; la falla es estrictamente de la estructura de arranque EFI en NVRAM.',
        porQueExplicacion: 'Si el disco y los archivos del sistema operativo existen pero el BIOS no ve el gestor de arranque, la causa es la pérdida del registro en NVRAM o daño en la partición ESP.',
        hipotesisFortalece: ['BOOTLOADER'],
        hipotesisDebilita: ['ALMACENAMIENTO', 'RAM', 'CPU'],
        hipotesisDescarta: ['RAM', 'CPU', 'GPU'],
        esDecisiva: true,
      },
      {
        id: 'pm-t3-02',
        nombre: 'Ejecución de diagnóstico S.M.A.R.T. de la unidad SSD',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Evalúa la salud física y sectores reasignados del disco.',
        resultadoObservado: 'Salud S.M.A.R.T. al 100% con cero sectores dañados y temperaturas normales.',
        evidenciaDescubierta: 'El SSD no tiene fallas de hardware.',
        porQueExplicacion: 'Una unidad sana con datos intactos confirma que el problema de no arranque es lógico a nivel de gestor de booteo.',
        hipotesisFortalece: ['BOOTLOADER'],
        hipotesisDebilita: ['ALMACENAMIENTO'],
        hipotesisDescarta: ['ALMACENAMIENTO'],
      },
      {
        id: 'pm-t3-03',
        nombre: 'Prueba de diagnóstico de memoria RAM',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Descarta inestabilidad en módulos RAM.',
        resultadoObservado: 'Pasa todas las pruebas de memoria con 0 errores.',
        evidenciaDescubierta: 'La RAM opera con total estabilidad.',
        porQueExplicacion: 'La memoria no tiene relación con la detección de la partición de arranque por el firmware.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['RAM'],
        hipotesisDescarta: ['RAM'],
      },
    ],
  },
  {
    id: 'myst-04',
    codigoCaso: 'EXP-MIST-8290',
    descripcionPC: 'Equipo que tras una actualización de firmware BIOS se reinicia con Pantalla Azul antes de llegar a la pantalla de bienvenida.',
    sintomaObservado: 'Aparece el logo de Windows con los puntos girando por 2 segundos y se corta con BSOD: INACCESSIBLE_BOOT_DEVICE (0x0000007B).',
    estadoInicial: 'Equipo en bucle de reinicios por pantalla azul temprana.',
    stopStep: 26,
    ultimoEstadoConfirmado: 'Paso 25: HAL toma control de la arquitectura.',
    siguienteEtapa: 'Paso 26: Carga de drivers BOOT_START (Falla de montaje de C: con BSOD 0x7B).',
    observacionTecnica: 'El kernel NT y hal.dll se cargaron en RAM, pero el driver de almacenamiento no puede acceder a la partición de sistema.',
    correctComponent: 'DRIVER',
    causaRaiz: 'Discrepancia en el modo de la controladora de almacenamiento en BIOS (activación de Intel VMD / RAID por defecto tras actualización) que impide al driver BOOT_START (stornvme.sys) montar el volumen NTFS.',
    etapaProducida: 'Paso 26: Carga de drivers BOOT_START (Controladores de arranque)',
    evidenciasClave: [
      'winload.efi y HAL cargados exitosamente (Pasos 23 a 25).',
      'BSOD 0x7B específico de inaccesibilidad al dispositivo de arranque en fase de drivers tempranos.',
      'Revisión en BIOS demostró cambio automático a Intel VMD / RAID.',
    ],
    pruebaDecisivaNombre: 'Auditoría del modo de controladora SATA/NVMe / VMD en el Setup BIOS',
    accionRecomendada: 'Configurar el modo de almacenamiento en AHCI / NVMe nativo coincidente con la instalación original de Windows.',
    verificacionPosterior: 'Arranque fluido del kernel y servicios sin pantallas azules.',
    rutaRazonamiento: [
      'OBSERVAR: BSOD 0x7B INACCESSIBLE_BOOT_DEVICE durante la animación de carga',
      'LOCALIZAR: Detención exacta en Paso 26 (Carga de drivers BOOT_START)',
      'FORMULAR HIPÓTESIS: Sospecha de Driver de almacenamiento vs SSD vs RAM',
      'ELEGIR PRUEBA: Revisión de modo de controladora en setup UEFI',
      'OBTENER EVIDENCIA: Modo VMD/RAID activo en BIOS en Windows instalado con AHCI',
      'DESCARTAR: Daño físico de RAM o CPU',
      'CONFIRMAR: Incompatibilidad de driver BOOT_START por modo de controladora',
    ],
    pruebasDisponibles: [
      {
        id: 'pm-t4-01',
        nombre: 'Auditoría del modo de controladora SATA/NVMe / VMD en el Setup BIOS',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Verifica si el modo de almacenamiento en BIOS coincide con los controladores instalados.',
        resultadoObservado: 'El BIOS tenía habilitado "Intel VMD / RAID Mode" tras la actualización. Al cambiarlo a "AHCI / NVMe estándar", Windows bootea de inmediato.',
        evidenciaDescubierta: 'El controlador stornvme.sys de Windows requería el modo AHCI/NVMe directo para montar la partición C:.',
        porQueExplicacion: 'El código 0x7B ocurre cuando el kernel no encuentra el controlador adecuado para el modo configurado en el hardware al cargar los servicios con Start=0.',
        hipotesisFortalece: ['DRIVER'],
        hipotesisDebilita: ['RAM', 'CPU', 'SESION_WINDOWS'],
        hipotesisDescarta: ['RAM', 'CPU'],
        esDecisiva: true,
      },
      {
        id: 'pm-t4-02',
        nombre: 'Intento de arranque en Modo Seguro',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Comprueba si el error se reproduce con la configuración básica.',
        resultadoObservado: 'El BSOD 0x7B se repite exactamente igual porque los controladores BOOT_START son indispensables en cualquier modo de arranque.',
        evidenciaDescubierta: 'La falla reside en la capa más profunda de drivers de almacenamiento del kernel.',
        porQueExplicacion: 'El Modo Seguro deshabilita servicios y drivers de terceros, pero los drivers de disco BOOT_START se ejecutan obligatoriamente.',
        hipotesisFortalece: ['DRIVER'],
        hipotesisDebilita: ['SERVICIOS', 'SESION_WINDOWS'],
        hipotesisDescarta: ['SESION_WINDOWS'],
      },
      {
        id: 'pm-t4-03',
        nombre: 'Ejecución de MemTest86 en banco',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Descarta corrupción de estructuras por celdas de RAM inestables.',
        resultadoObservado: 'MemTest86 finaliza con 0 errores en todos los patrones.',
        evidenciaDescubierta: 'La memoria RAM se encuentra en estado impecable.',
        porQueExplicacion: 'El error 0x7B es un fallo lógico de montaje de disco, no de paridad de memoria.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['RAM'],
        hipotesisDescarta: ['RAM'],
      },
    ],
  },
  {
    id: 'myst-05',
    codigoCaso: 'EXP-MIST-1574',
    descripcionPC: 'Computadora portátil donde el usuario ingresa su contraseña, ve el mensaje "Bienvenido" y la pantalla queda en negro sin escritorio.',
    sintomaObservado: 'Tras autenticar en la pantalla de bloqueo, la pantalla permanece negra. El cursor del mouse se mueve y responde a Ctrl+Shift+Esc abriendo el Administrador de Tareas.',
    estadoInicial: 'Sesión iniciada con pantalla negra y cursor visible.',
    stopStep: 33,
    ultimoEstadoConfirmado: 'Paso 32: Autenticación, LSASS y User Profile Service completados.',
    siguienteEtapa: 'Paso 33: explorer.exe (Shell interactivo de usuario no arrancó automáticamente).',
    observacionTecnica: 'Los servicios de sistema y el compositor dwm.exe funcionan, pero el proceso de shell explorer.exe no se ejecutó.',
    correctComponent: 'SESION_WINDOWS',
    causaRaiz: 'Clave de Registro "Shell" en Winlogon modificada con una ruta inválida por un desinstalador de software, impidiendo la ejecución automática de explorer.exe al iniciar sesión.',
    etapaProducida: 'Paso 33: explorer.exe (Shell interactivo del usuario)',
    evidenciasClave: [
      'Kernel, servicios de fondo y compositor gráfico 100% operativos.',
      'El Administrador de Tareas se abre y el cursor responde con fluidez.',
      'Lanzamiento manual de explorer.exe restaura el escritorio inmediatamente.',
    ],
    pruebaDecisivaNombre: 'Ejecución manual de explorer.exe desde el Administrador de Tareas y auditoría del Registro',
    accionRecomendada: 'Restaurar la clave "Shell" con el valor "explorer.exe" en HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon.',
    verificacionPosterior: 'Cerrar sesión y verificar carga automática inmediata de la barra de tareas y escritorio.',
    rutaRazonamiento: [
      'OBSERVAR: Pantalla negra con cursor móvil y Task Manager funcional tras inicio de sesión',
      'LOCALIZAR: Detención exacta en Paso 33 (Lanzamiento del shell explorer.exe)',
      'FORMULAR HIPÓTESIS: Sospecha de Shell de usuario vs Driver gráfico vs Hardware',
      'ELEGIR PRUEBA: Ejecución manual de explorer.exe desde Administrador de Tareas',
      'OBTENER EVIDENCIA: Escritorio se visualiza de inmediato; el problema es su arranque automático',
      'DESCARTAR: Fallas de GPU, RAM, Kernel y Hardware base',
      'CONFIRMAR: Clave de shell corrupta en configuración de sesión de Winlogon',
    ],
    pruebasDisponibles: [
      {
        id: 'pm-t5-01',
        nombre: 'Ejecución manual de explorer.exe desde el Administrador de Tareas y auditoría del Registro',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Comprueba si el binario explorer.exe está intacto y si la clave Shell en Winlogon está alterada.',
        resultadoObservado: 'Al escribir explorer.exe en Ejecutar nueva tarea, el escritorio aparece al instante. En el Registro, la clave Shell tenía un valor inválido dejado por software desinstalado.',
        evidenciaDescubierta: 'El archivo explorer.exe funciona pero winlogon no lo lanzaba debido a una clave corrupta en el Registro.',
        porQueExplicacion: 'Si explorer.exe corre manualmente al ser invocado, demuestra que los subsistemas gráficos están sanos y que la falla se limita al puntero de configuración de inicio de sesión.',
        hipotesisFortalece: ['SESION_WINDOWS'],
        hipotesisDebilita: ['GPU', 'PLACA_BASE', 'KERNEL', 'DRIVER'],
        hipotesisDescarta: ['PLACA_BASE', 'GPU', 'CPU'],
        esDecisiva: true,
      },
      {
        id: 'pm-t5-02',
        nombre: 'Reinstalación de controladores de video en Modo Seguro',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Descarta fallas de renderizado del controlador gráfico.',
        resultadoObservado: 'Los controladores se reinstalan pero el comportamiento es idéntico: pantalla negra tras el login.',
        evidenciaDescubierta: 'El driver de video no tiene relación con el problema.',
        porQueExplicacion: 'El compositor dwm.exe ya renderizaba el cursor y el Task Manager, demostrando que la aceleración gráfica operaba correctamente.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['DRIVER', 'GPU'],
        hipotesisDescarta: ['GPU'],
      },
      {
        id: 'pm-t5-03',
        nombre: 'Auditoría de servicios del sistema en el Visor de Eventos',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Verifica la integridad de los servicios de segundo plano en Sesión 0.',
        resultadoObservado: 'Todos los servicios de sistema reportan estado correcto sin errores críticos.',
        evidenciaDescubierta: 'Los servicios de sistema operan con normalidad.',
        porQueExplicacion: 'La falla se localiza en la capa interactiva de la Sesión 1, no en los servicios de la Sesión 0.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['SERVICIOS'],
        hipotesisDescarta: ['SERVICIOS'],
      },
    ],
  },
  {
    id: 'myst-06',
    codigoCaso: 'EXP-MIST-6412',
    descripcionPC: 'Equipo de trabajo corporativo que se queda con el círculo de puntos girando de Windows por más de 20 minutos sin llegar a la pantalla de bienvenida.',
    sintomaObservado: 'El sistema supera el POST, carga el kernel, pero el círculo de puntos gira indefinidamente sin mostrar la pantalla de bloqueo.',
    estadoInicial: 'Equipo atascado en pantalla de carga de Windows.',
    stopStep: 30,
    ultimoEstadoConfirmado: 'Paso 29: Subsistemas esenciales (csrss.exe & wininit.exe en Sesión 0 inicializados).',
    siguienteEtapa: 'Paso 30: Servicios de Windows (services.exe bloqueado por servicio crítico de terceros).',
    observacionTecnica: 'El Service Control Manager (SCM) intenta inicializar la base de datos de servicios automáticos y entra en bloqueo por un servicio con timeout infinito.',
    correctComponent: 'SERVICIOS',
    causaRaiz: 'Servicio de seguridad de terceros dañado en Sesión 0 que entra en interbloqueo (deadlock) durante su rutina ServiceMain, impidiendo al Service Control Manager completar el despliegue hacia la Sesión 1 interactiva.',
    etapaProducida: 'Paso 30: Servicios de Windows (services.exe & svchost.exe)',
    evidenciasClave: [
      'Kernel e inicialización de Sesión 0 completados exitosamente.',
      'Detención en Paso 30 durante la carga de servicios automáticos de Windows.',
      'Modo Seguro arranca de forma inmediata al no cargar servicios de terceros.',
    ],
    pruebaDecisivaNombre: 'Arranque en Modo Seguro y auditoría de eventos de Service Control Manager en eventvwr.msc',
    accionRecomendada: 'Deshabilitar el servicio en conflicto desde la consola de servicios (services.msc) o desinstalar la suite de software dañada.',
    verificacionPosterior: 'Arranque normal con despliegue de la pantalla de bloqueo en menos de 10 segundos.',
    rutaRazonamiento: [
      'OBSERVAR: Círculo de puntos de Windows girando indefinidamente sin llegar al login',
      'LOCALIZAR: Detención exacta en Paso 30 (Servicios de Windows en Sesión 0)',
      'FORMULAR HIPÓTESIS: Sospecha de Servicios de Windows vs Driver de almacenamiento',
      'ELEGIR PRUEBA: Inicio en Modo Seguro y auditoría de Service Control Manager en Visor de Eventos',
      'OBTENER EVIDENCIA: Modo Seguro carga al instante; EventLog muestra servicio bloqueado en timeout',
      'DESCARTAR: Fallas de Hardware, Almacenamiento o Kernel',
      'CONFIRMAR: Interbloqueo en Service Control Manager por servicio de terceros',
    ],
    pruebasDisponibles: [
      {
        id: 'pm-t6-01',
        nombre: 'Arranque en Modo Seguro y auditoría de eventos de Service Control Manager en eventvwr.msc',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Aísla si la demora o bloqueo es provocado por servicios de terceros en segundo plano.',
        resultadoObservado: 'El Modo Seguro inicia en 4 segundos. El Visor de Eventos registra múltiples errores 7000 y 7009 indicando que un servicio de seguridad no respondió a la llamada de inicio tras 30.000 ms.',
        evidenciaDescubierta: 'El hardware y kernel están 100% sanos; el bloqueo se debe a un servicio atascado en el Service Control Manager.',
        porQueExplicacion: 'El Modo Seguro solo carga la lista de servicios mínimos de Microsoft; si inicia rápidamente, descarta fallas en el hardware y en el núcleo.',
        hipotesisFortalece: ['SERVICIOS'],
        hipotesisDebilita: ['KERNEL', 'CPU', 'PLACA_BASE'],
        hipotesisDescarta: ['CPU', 'PLACA_BASE'],
        esDecisiva: true,
      },
      {
        id: 'pm-t6-02',
        nombre: 'Comprobación de integridad de archivos con SFC en consola de recuperación',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Verifica si binarios esenciales de Windows están dañados.',
        resultadoObservado: 'SFC reporta que los archivos del sistema operativo no presentan ninguna infracción de integridad.',
        evidenciaDescubierta: 'Los archivos del sistema operativo están íntegros.',
        porQueExplicacion: 'La falla es provocada por un servicio configurado en el registro y no por corrupción de binarios DLL de Windows.',
        hipotesisFortalece: ['SERVICIOS'],
        hipotesisDebilita: ['KERNEL'],
        hipotesisDescarta: [],
      },
      {
        id: 'pm-t6-03',
        nombre: 'Prueba de diagnóstico de unidad SSD M.2',
        nivel: 'USUARIO',
        queIntentaComprobar: 'Descarta demoras de I/O por degradación de celdas flash.',
        resultadoObservado: 'Tiempos de respuesta y lecturas secuenciales óptimos sin errores de I/O.',
        evidenciaDescubierta: 'La unidad de almacenamiento funciona con máxima velocidad.',
        porQueExplicacion: 'El congelamiento no es por lectura de disco sino por bloqueo de hilo en el despachador de servicios.',
        hipotesisFortalece: [],
        hipotesisDebilita: ['ALMACENAMIENTO'],
        hipotesisDescarta: ['ALMACENAMIENTO'],
      },
    ],
  },
];

export interface StructuredWorkshopVerification {
  testName: string;
  objective: string;
  tools: string;
  procedure: string;
  expectedResult: string;
  ifCorrect: string;
  ifIncorrect: string;
  whatItProves: string;
  nextStep: string;
  safetyLevel: SafetyLevel;
  safetyRequirement?: string;
}

export interface StepForensicDetail {
  purpose: string;
  signalFlow: string;
  possibleFailures: string[];
  detectionClues: string[];
  evoTip: string;
  simpleExplanation?: string;
  technicalDetail?: string;
  whatToVerify?: string[];
  structuredVerification?: StructuredWorkshopVerification;
  visibleSymptoms?: string;
  signalTraveling?: string;
}

export const STEP_FORENSIC_DETAILS: Record<number, StepForensicDetail> = {
  0: {
    purpose: 'Estado de reposo absoluto. Aislamiento eléctrico total antes de energizar.',
    signalFlow: 'Red eléctrica → Cable interlock → Interruptor I/O en posición 0.',
    possibleFailures: [
      'Cable interlock dañado o desprendido de la toma de corriente.',
      'Interruptor trasero I/O de la PSU en posición 0 (apagado).',
      'Fusible térmico o varistor primario de la fuente abierto por sobretensión.',
    ],
    detectionClues: [
      'Ausencia total de LEDs de standby en la motherboard.',
      'Multímetro marca 0V en pin 9 (+5VSB) del conector ATX.',
      'Ninguna reacción al presionar el pulsador frontal.',
    ],
    evoTip: 'Si la máquina ni siquiera tiene standby (+5VSB), no pierdas tiempo desarmando procesador o RAM: el síntoma apunta a la etapa primaria o de suministro eléctrico.',
  },
  1: {
    purpose: 'Generar la tensión permanente (+5VSB) que alimenta los circuitos lógicos de escucha del encendido.',
    signalFlow: 'Transformador auxiliar flyback de la PSU → Pin 9 ATX (+5VSB) → Controlador Super I/O / EC.',
    possibleFailures: [
      'Conversor auxiliar de +5VSB en la fuente dañado o sin oscilación.',
      'Cortocircuito en el regulador lineal de standby de la placa madre.',
      'Chip Super I/O / EC quemado drenando el riel a masa.',
    ],
    detectionClues: [
      'LED de standby de la motherboard apagado.',
      'Tensión en cable violeta inferior a 4.75V o en 0V.',
      'La placa madre no responde a la orden de encendido.',
    ],
    evoTip: 'El riel +5VSB es el latido invisible de la PC: si no existe, la placa madre está sorda al botón POWER.',
  },
  2: {
    purpose: 'Transmitir la orden física del usuario al circuito lógico de encendido derivando el pin PWR_SW a masa.',
    signalFlow: 'Pulsador mecánico del gabinete → Header Front Panel → Pin PWR_SW a masa (0V).',
    possibleFailures: [
      'Switch frontal roto, trabado mecánicamente o con cables cortados.',
      'Conector del panel frontal colocado en pines incorrectos (ej. Reset o LED).',
      'Pista del PCB entre el header y el Super I/O interrumpida.',
    ],
    detectionClues: [
      'El switch no produce cambio de nivel lógico en el pin PWR_SW.',
      'Un puente directo momentáneo en los pines enciende el equipo.',
      'Ausencia de señal de disparo hacia el Super I/O.',
    ],
    evoTip: 'Antes de diagnosticar una fuente quemada, realiza un puente momentáneo seguro en los pines PWR_SW: muchos problemas son solo botones gastados.',
  },
  3: {
    purpose: 'Indicar a la fuente de poder que active sus etapas de conmutación principales de potencia nominal.',
    signalFlow: 'Super I/O / EC → Pin 16 ATX (PS_ON# baja a 0V) → Supervisor PWM de la PSU.',
    possibleFailures: [
      'Lógica Super I/O dañada impidiendo que PS_ON# caiga a nivel bajo.',
      'Optoacoplador o IC supervisor interno de la fuente quemado.',
      'Línea PS_ON# en circuito abierto en el cableado ATX.',
    ],
    detectionClues: [
      'La línea PS_ON# (cable verde) permanece en 5V y nunca baja a 0V.',
      'La fuente no arranca ventiladores ni suministra voltajes principales.',
      'La placa madre recibe el pulso del switch pero no activa la fuente.',
    ],
    evoTip: 'La señal PS_ON# es lógica activa en bajo (Active-Low): 5V significa reposo, 0V significa orden de encendido.',
  },
  4: {
    purpose: 'Suministrar energía de alta potencia a todos los subsistemas: +12V (VRMs/motores), +5V (lógica/SATA), +3.3V (chipset/M.2).',
    signalFlow: 'Etapa secundaria conmutada de la PSU → Rieles principales ATX/EPS → Motherboard.',
    possibleFailures: [
      'Cortocircuito en MOSFETs de alta del VRM de CPU provocando disparo de protección SCP/OCP.',
      'Condensador de salida hinchado con caída de tensión en rieles bajo carga.',
      'Línea de +12V o +3.3V fuera de tolerancia ATX (+/- 5%).',
    ],
    detectionClues: [
      'Los ventiladores intentan girar media vuelta y se apagan de inmediato (apagado por protección).',
      'Tensión anómala o nula en cables amarillos (+12V), rojos (+5V) o naranjas (+3.3V).',
      'Desconectar el cable EPS de CPU permite que la fuente permanezca encendida.',
    ],
    evoTip: 'Si los ventiladores amagan con girar y se apagan en 100 ms, aumenta la sospecha de un cortocircuito en los MOSFETs de 12V del procesador o placa de video.',
  },
  5: {
    purpose: 'Asegurar que los voltajes de la fuente estén estabilizados antes de permitir que el procesador intente operar.',
    signalFlow: 'Supervisor interno de la PSU → Línea PWR_OK (Pin 8 ATX sube a +5V tras delay t1) → Generador de reloj.',
    possibleFailures: [
      'Circuito supervisor de la PSU dañado que no eleva PWR_OK a +5V.',
      'Rizado eléctrico excesivo (ripple) que impide la señal de estabilidad.',
      'Línea gris cortada en el conector principal de 24 pines.',
    ],
    detectionClues: [
      'Los ventiladores giran de forma continua pero la motherboard no avanza al POST.',
      'Multímetro marca 0V en cable gris mientras los demás rieles (+12V, +5V, +3.3V) están presentes.',
      'El equipo se comporta como "congelado" con ventiladores al máximo.',
    ],
    evoTip: 'Tener ventiladores girando no significa que la fuente esté buena: si el cable gris (PWR_OK) no entrega 5V, la placa jamás liberará al CPU.',
  },
  6: {
    purpose: 'Liberar al microprocesador de su estado de inhibición eléctrica para iniciar el ciclo de fetch de instrucciones.',
    signalFlow: 'Generador de reloj y controlador de reset → Pin RESET# (sube a nivel alto) → CPU.',
    possibleFailures: [
      'Fases VRM de CPU sin entregar Vcore por controlador PWM dañado.',
      'Línea RESET# atascada en masa por corto en condensador cerámico de desacoplo.',
      'Cristal oscilador de reloj principal defectuoso o sin generar frecuencia base.',
    ],
    detectionClues: [
      'El procesador no levanta temperatura (socket frío tras minutos de encendido).',
      'Vcore en 0V medido en los inductores del VRM.',
      'La placa madre no avanza al bus SPI ni emite códigos de diagnóstico.',
    ],
    evoTip: 'Un socket completamente frío tras varios segundos de encendido es compatible con falta de alimentación Vcore o inhibición en reset.',
  },
  7: {
    purpose: 'Ejecutar el primer salto (Reset Vector 0xFFFFFFF0) para cargar el microcódigo inicial almacenado en la memoria flash SPI.',
    signalFlow: 'Puntero de instrucción CS:IP de la CPU → Bus SPI (CS#, CLK, MOSI/MISO) → Memoria Flash UEFI BIOS.',
    possibleFailures: [
      'Chip SPI Flash corrupto por flasheo interrumpido o microcódigo dañado.',
      'Pistas del bus SPI cortadas o chip desoldado.',
      'Incompatibilidad de firmware con la arquitectura instalada.',
    ],
    detectionClues: [
      'El CPU tiene Vcore pero no existe tráfico en las líneas de datos SPI.',
      'Equipo bloqueado en el instante 0 sin códigos de POST en display.',
      'Función BIOS Flashback recupera el encendido tras reprogramar la flash.',
    ],
    evoTip: 'En arquitecturas x86 modernas, el procesador siempre despierta en 0xFFFFFFF0: si la memoria SPI no responde en ese microsegundo, nada más existe.',
  },
  8: {
    purpose: 'Configurar la memoria caché interna de la CPU como RAM temporal (Cache-as-RAM) antes de que los módulos físicos existan.',
    signalFlow: 'Módulos SEC & PEI de la UEFI → Registros MTRR de la CPU → Caché L2/L3 como pila de ejecución.',
    possibleFailures: [
      'Microcódigo incompatible con el stepping o generación del procesador instalado.',
      'Falla de integridad criptográfica en la firma de los módulos PEI del firmware.',
      'Caché L3 con defectos de silicio impidiendo la creación del stack CAR.',
    ],
    detectionClues: [
      'La placa madre lee el chip SPI pero se frena de inmediato antes de buscar la RAM.',
      'LED de diagnóstico de CPU encendido de forma fija.',
      'Actualizar la BIOS a una versión que soporte la generación del CPU resuelve la falla.',
    ],
    evoTip: 'Cache-as-RAM es la magia que permite ejecutar código C de inicialización sin tener un solo byte de memoria RAM física configurada.',
  },
  9: {
    purpose: 'Sincronizar núcleos de procesamiento, cargar parches de microcódigo de fábrica y habilitar el bootstrap processor (BSP).',
    signalFlow: 'UEFI PEI Core → Registros MSR / CPU Patch Loader → Núcleos de cómputo.',
    possibleFailures: [
      'Pines del socket LGA doblados o partidos que comunican líneas de control de CPU.',
      'Procesador degradado con falla en el anillo de interconexión o microcódigo.',
      'Presión excesiva o desbalanceada del disipador sobre el socket.',
    ],
    detectionClues: [
      'El POST se detiene en el chequeo inicial de procesador.',
      'Inspección con microscopio revela pines del socket tocándose o desalineados.',
      'Aflojar ligeramente los tornillos del cooler permite que el equipo avance.',
    ],
    evoTip: 'Un exceso de torque en el disipador o pines LGA apenas torcidos pueden provocar fallas intermitentes que parecen de memoria pero nacen en el socket.',
  },
  10: {
    purpose: 'Activar el Integrated Memory Controller (IMC) del CPU y energizar los rieles de alimentación de los slots DIMM.',
    signalFlow: 'Firmware PEI → Registros de control del IMC en la CPU → VRM secundario de memoria (VDD/VDDQ).',
    possibleFailures: [
      'VRM de memoria de la motherboard averiado sin entregar tensión nominal.',
      'Riel System Agent / SoC del procesador en cortocircuito.',
      'Líneas de alimentación de los slots DIMM interrumpidas.',
    ],
    detectionClues: [
      'Tensión en condensadores del slot DIMM en 0V.',
      'El IMC no genera reloj de bus SMBus hacia los módulos.',
      'LED de DRAM encendido fijo en el panel de diagnóstico.',
    ],
    evoTip: 'El controlador de memoria ya no está en el chipset: reside dentro del propio silicio del CPU. Si el IMC falla, no hay RAM posible.',
  },
  11: {
    purpose: 'Leer la configuración de fábrica (densidad, rangos, latencias JEDEC y perfiles XMP/EXPO) grabada en el chip EEPROM de cada barra.',
    signalFlow: 'Controlador SMBus (I2C/I3C) del Chipset/CPU → Bus serie I2C → Chip EEPROM SPD del módulo RAM.',
    possibleFailures: [
      'Módulo de RAM sucio o con residuos aislantes en los pines de datos SMBus.',
      'Módulo mal encajado en el slot DIMM sin que las trabas cierren por completo.',
      'Chip EEPROM SPD desprogramado o con suma de comprobación (checksum) corrupta.',
    ],
    detectionClues: [
      'El sistema reporta slot vacío aunque el módulo esté insertado.',
      'Limpiar los contactos dorados con alcohol isopropílico restaura la lectura.',
      'El POST se detiene exactamente antes del entrenamiento de memoria.',
    ],
    evoTip: 'La lectura SPD es comunicación serie de baja velocidad: si un pin de SMBus tiene suciedad, el firmware ni siquiera sabrá que hay una memoria puesta.',
  },
  12: {
    purpose: 'Calibrar en picosegundos los retrasos de señal en todas las pistas de datos (DQ/DQS) para compensar longitudes físicas del PCB.',
    signalFlow: 'Motor de calibración del IMC → Ráfagas de prueba DQ/DQS → Chips DRAM en los módulos.',
    possibleFailures: [
      'Perfil XMP/EXPO con frecuencias o voltajes incompatibles con la calidad del IMC.',
      'Módulos de memoria de diferentes marcas o latencias mezclados en el mismo canal.',
      'Falla de contacto o degradación en pistas de alta frecuencia del PCB.',
    ],
    detectionClues: [
      'El equipo enciende ventiladores, no da video y entra en bucle de reinicios (bootloop).',
      'Un solo módulo en slot preferencial A2 arranca perfectamente; dos módulos fallan.',
      'Hacer Clear CMOS restablece valores JEDEC seguros y permite arrancar.',
    ],
    evoTip: 'En DDR4 y DDR5 el Memory Training puede tardar hasta 30-60 segundos tras un cambio de hardware o reseteo: no apagues la PC apresuradamente.',
  },
  13: {
    purpose: 'Establecer el enlace de alta velocidad DMI/Infinity Fabric entre CPU y Chipset y transferir la ejecución de Cache-as-RAM a memoria física.',
    signalFlow: 'Fase DXE de la UEFI → Enlace DMI / PCIe Uplink → Chipset (PCH) y controladoras secundarias.',
    possibleFailures: [
      'Chipset sobrecalentado o con desprendimiento térmico de su disipador.',
      'Líneas DMI con pista abierta o corto en el PCB.',
      'Firmware DXE con corrupción en el despachador de controladores.',
    ],
    detectionClues: [
      'El sistema supera el entrenamiento de RAM pero se congela antes de enumerar tarjetas PCIe.',
      'Disipador del chipset a temperatura intocable al instante de encender.',
      'Falla total de periféricos conectados a líneas del chipset.',
    ],
    evoTip: 'Al completar el paso 13, el procesador abandona Cache-as-RAM: a partir de acá el código corre en la memoria RAM principal a máxima velocidad.',
  },
  14: {
    purpose: 'Recorrer el árbol de buses PCIe asignando rangos de interrupción y espacios de memoria MMIO a cada tarjeta de expansión.',
    signalFlow: 'PCI Host Bridge Driver de la UEFI → Árbol de buses (Bus/Dev/Func) → Slots PCIe x16, x4, x1 y puertos M.2.',
    possibleFailures: [
      'Tarjeta de expansión secundaria defectuosa provocando conflicto de asignación MMIO.',
      'Slot PCIe con pines doblados o suciedad en las líneas de datos.',
      'Incompatibilidad de bifurcación de líneas PCIe en BIOS.',
    ],
    detectionClues: [
      'El sistema se cuelga con una capturadora o placa de sonido secundaria instalada.',
      'Retirar todas las tarjetas secundarias dejando solo la GPU permite continuar el POST.',
      'Detención de la secuencia justo antes de inicializar la tarjeta gráfica.',
    ],
    evoTip: 'Si una PC no avanza en el POST, desconecta todas las tarjetas PCIe accesorias: un solo dispositivo con conflicto MMIO congela toda la plataforma.',
  },
  15: {
    purpose: 'Ejecutar el controlador GOP (Graphics Output Protocol) del VBIOS de la GPU e inicializar el Framebuffer para emitir video al monitor.',
    signalFlow: 'UEFI Video DXE Driver → VBIOS GOP de la placa de video → Transmisor TMDS/DisplayPort → Monitor.',
    possibleFailures: [
      'Conectores de energía PCIe auxiliar de 8 pines de la GPU desconectados o flojos.',
      'Cable DisplayPort/HDMI conectado a la motherboard en CPU sin gráficos integrados.',
      'GPU antigua sin soporte UEFI GOP (solo VBIOS Legacy CSM).',
    ],
    detectionClues: [
      'Monitor en "Sin Señal" mientras el teclado responde con Num Lock (POST completado).',
      'LED de VGA encendido en el panel de diagnóstico de la placa base.',
      'Conectar a la salida integrada de video emite imagen correctamente.',
    ],
    evoTip: 'Si el teclado ya enciende y apaga las luces de Bloq Mayús, la máquina está funcionando: el problema es estrictamente de salida de video.',
  },
  16: {
    purpose: 'Inicializar las controladoras de almacenamiento masivo NVMe (PCIe) y SATA (AHCI) y preparar las colas de comandos I/O.',
    signalFlow: 'UEFI NVMe / AHCI DXE Drivers → Controlador del SSD NVMe / chip SATA → Registro de comandos.',
    possibleFailures: [
      'SSD M.2 en cortocircuito en el riel de 3.3V provocando bloqueo en el bus PCIe.',
      'Controlador del SSD dañado que no responde a la inicialización de colas.',
      'Puerto M.2 con tornillo de fijación flojo o contacto intermitente.',
    ],
    detectionClues: [
      'La máquina se congela en el logo de la motherboard sin permitir entrar al BIOS.',
      'Retirar el SSD M.2 permite ingresar de inmediato al Setup UEFI.',
      'El controlador del SSD calienta excesivamente en reposo.',
    ],
    evoTip: 'Un SSD NVMe quemado puede colgar el bus PCIe completo y hacer que la PC parezca muerta antes de entrar al setup.',
  },
  17: {
    purpose: 'Identificar modelo, número de serie, versión de firmware, tamaño LBA y verificar parámetros S.M.A.R.T. de los discos.',
    signalFlow: 'Subcapa de almacenamiento UEFI → Comandos Identify Device / NVMe Controller → Firmware del SSD.',
    possibleFailures: [
      'Firmware del SSD bloqueado en modo de recuperación (ROM Mode / tamaño 0 MB).',
      'Degradación crítica de celdas NAND que impide leer la tabla de bloques.',
      'Cable de datos SATA cortado o falso contacto en el conector de alimentación.',
    ],
    detectionClues: [
      'El disco no figura en la lista de almacenamiento del BIOS o muestra capacidad 0 bytes.',
      'Mensaje de advertencia S.M.A.R.T. Bad Status al iniciar.',
      'Probar en otro puerto M.2 o cable SATA no detecta el medio.',
    ],
    evoTip: 'Si un SSD NVMe aparece con nombre genérico como "MN-5216" y capacidad de 20 MB o 0 MB, su firmware se corrompió y entró en Panic Mode.',
  },
  18: {
    purpose: 'Activar el controlador xHCI (USB), enumerar periféricos de entrada (teclado/mouse) e inicializar el coprocesador de seguridad TPM 2.0.',
    signalFlow: 'UEFI USB xHCI & TPM Drivers → Puertos USB y bus SPI/fTPM → Periféricos HID y módulo TPM.',
    possibleFailures: [
      'Puerto USB frontal con lengüeta plástica rota y pines en cortocircuito contra el chasis metálico.',
      'Pendrive o accesorio USB externo quemado que congela el bus xHCI.',
      'Módulo fTPM desincronizado tras cambio de procesador.',
    ],
    detectionClues: [
      'El teclado ilumina momentáneamente sus LEDs y luego no responde.',
      'Desconectar el conector USB 3.0 del panel frontal desbloquea el POST.',
      'Mensaje solicitando reset de claves TPM al arrancar.',
    ],
    evoTip: 'Un puerto USB roto donde los pines tocan la carcasa metálica del gabinete frena el arranque de toda la PC por protección de sobrecorriente USB.',
  },
  19: {
    purpose: 'Completar y certificar con éxito la rutina de auto-diagnóstico (Power-On Self Test) de todo el hardware de la plataforma.',
    signalFlow: 'POST Master de la UEFI → Validación de subsistemas → Reporte POST SUCCESS a la capa BDS.',
    possibleFailures: [
      'Falla de paridad de hardware reportada en última instancia por algún controlador secundario.',
      'Código de error de POST no resuelto.',
      'Incompatibilidad de hardware impidiendo la transferencia de control.',
    ],
    detectionClues: [
      'Los 4 LEDs de diagnóstico (CPU, DRAM, VGA, BOOT) se apagan secuencialmente.',
      'El buzzer emite un beep corto de éxito (en placas con altavoz de sistema).',
      'La máquina pasa de modo diagnóstico a modo de búsqueda de sistema operativo.',
    ],
    evoTip: 'Si el POST se completó con éxito, todo el hardware físico funciona: a partir del paso 20, cualquier falla es de booteo o de software.',
  },
  20: {
    purpose: 'Consultar las variables almacenadas en NVRAM para identificar la prioridad de arranque y seleccionar el dispositivo configurado.',
    signalFlow: 'UEFI BDS Dispatcher → Variables BootOrder y Boot#### en NVRAM → Selección de gestor de arranque.',
    possibleFailures: [
      'Variables NVRAM borradas tras reseteo de CMOS o descarga de pila CR2032.',
      'Orden de arranque apuntando a una unidad extraíble ausente o desconectada.',
      'Modo CSM (Legacy) habilitado en una instalación realizada con UEFI nativo.',
    ],
    detectionClues: [
      'Mensaje "Reboot and Select proper Boot Device" o ingreso directo al BIOS.',
      'El SSD figura en almacenamiento pero no aparece la opción "Windows Boot Manager".',
      'Restablecer el orden en BIOS restaura el booteo normal.',
    ],
    evoTip: 'En sistemas UEFI modernos, no se bootea seleccionando el modelo del disco: se bootea seleccionando la entrada "Windows Boot Manager" de la NVRAM.',
  },
  21: {
    purpose: 'Montar el sistema de archivos FAT32 de la partición EFI (ESP) y localizar el archivo ejecutable bootmgfw.efi.',
    signalFlow: 'UEFI FAT File System Driver → Partición EFI (ESP FAT32, GUID C12A7328...) → \\EFI\\Microsoft\\Boot\\bootmgfw.efi.',
    possibleFailures: [
      'Partición EFI System Partition (ESP) eliminada accidentalmente al particionar.',
      'Sistema de archivos FAT32 de la partición EFI con sectores corruptos.',
      'Falta de letra o descriptor de partición EFI en la tabla GPT.',
    ],
    detectionClues: [
      'El firmware no encuentra ningún archivo .efi ejecutable en el disco.',
      'Herramientas como diskpart muestran la partición de Windows pero falta la partición de 100MB FAT32.',
      'Regenerar la partición con bcdboot desde WinRE soluciona el problema.',
    ],
    evoTip: 'La partición EFI siempre es FAT32: la UEFI no sabe leer NTFS de forma nativa sin drivers propietarios.',
  },
  22: {
    purpose: 'Cargar el archivo BCD (Boot Configuration Data), verificar la firma digital por Secure Boot y determinar qué instalación de Windows iniciar.',
    signalFlow: 'bootmgfw.efi → Almacén BCD binario en \\EFI\\Microsoft\\Boot\\BCD → Ubicación de winload.efi.',
    possibleFailures: [
      'Almacén BCD corrupto o con rutas de partición rotas tras clonación defectuosa.',
      'Firma digital de bootmgfw.efi no coincidente con las claves de Secure Boot en BIOS.',
      'Error de pantalla azul de recuperación 0xc000000e o 0xc0000034.',
    ],
    detectionClues: [
      'Pantalla azul de recuperación con título "Tu PC necesita recuperarse".',
      'El comando "bootrec /rebuildbcd" o "bcdboot" repara el almacén de configuración.',
      'Desactivar Secure Boot temporalmente confirma si la falla era de firma de certificados.',
    ],
    evoTip: 'El error 0xc000000e no es una falla de hardware: significa que el archivo BCD apunta a un identificador GUID de partición que ya no coincide.',
  },
  23: {
    purpose: 'Habilitar el direccionamiento virtual de 64 bits (Paging), cargar el registro de configuración SYSTEM y preparar el entorno de transición al kernel.',
    signalFlow: 'winload.efi → Partición C:\\Windows\\System32\\config\\SYSTEM → Mapeo de memoria física para el kernel.',
    possibleFailures: [
      'Archivo winload.efi corrupto con error de firma digital 0xc0000428.',
      'Colmena de Registro SYSTEM dañada o con tamaño 0 bytes por apagado abrupto.',
      'Falta de archivos binarios esenciales en C:\\Windows\\System32\\.',
    ],
    detectionClues: [
      'Pantalla de error mencionando winload.efi o System32\\config\\system.',
      'Ejecutar "sfc /scannow /offbootdir=C:\\ /offwindir=C:\\Windows" restaura archivos dañados.',
      'Restaurar la copia de respaldo de la colmena SYSTEM desde RegBack soluciona el fallo.',
    ],
    evoTip: 'winload.efi es el puente entre el mundo del firmware UEFI y el mundo del kernel NT: cuando termina su tarea, la UEFI cede el control para siempre.',
  },
  24: {
    purpose: 'Cargar en memoria RAM el binario del núcleo maestro (ntoskrnl.exe) y la capa HAL (hal.dll), ejecutando ExitBootServices() en la UEFI.',
    signalFlow: 'winload.efi → Memoria RAM física → Carga de ntoskrnl.exe y hal.dll → ExitBootServices().',
    possibleFailures: [
      'Sectores defectuosos en el SSD en el área donde reside ntoskrnl.exe.',
      'Incompatibilidad en la versión de hal.dll tras actualización de procesador.',
      'Corrupción en la estructura LoaderBlock transferida al kernel.',
    ],
    detectionClues: [
      'Reinicio espontáneo justo al comenzar a cargar Windows.',
      'Comprobación de disco con "chkdsk C: /f" detecta y repara errores de asignación de clústeres.',
      'Auditoría S.M.A.R.T. muestra degradación en sectores del SSD.',
    ],
    evoTip: 'En el paso 24 ocurre ExitBootServices(): a partir de este instante, la UEFI se apaga y el kernel NT gobierna la máquina de forma absoluta.',
  },
  25: {
    purpose: 'Tomar el control de los temporizadores de hardware (APIC/HPET), controladores de interrupción y gestión de energía ACPI.',
    signalFlow: 'hal.dll → Controladores de interrupción APIC / IO-APIC y tablas ACPI de la CPU/Chipset → Sincronización de reloj maestro.',
    possibleFailures: [
      'Tablas ACPI corruptas o incompatibles en la versión de BIOS instalada.',
      'Pantalla azul temprana HAL_INITIALIZATION_FAILED (0x0000005C) o ACPI_BIOS_ERROR (0x000000A5).',
      'Falla en temporizadores de precisión HPET por desconfiguración en BIOS.',
    ],
    detectionClues: [
      'BSOD inmediato con código 0x5C o 0xA5 antes de ver la animación de carga.',
      'Actualizar la BIOS de la motherboard a la versión recomendada resuelve el problema.',
      'Deshabilitar opciones experimentales de virtualización o energía en BIOS permite arrancar.',
    ],
    evoTip: 'La capa HAL (Hardware Abstraction Layer) existe para que Windows no tenga que escribirse de forma diferente para cada placa madre del mundo.',
  },
  26: {
    purpose: 'Cargar los controladores indispensables con Start=0 (stornvme.sys, storahci.sys, ntfs.sys) para que el kernel pueda realizar I/O nativo a disco.',
    signalFlow: 'Cargador de controladores del Kernel NT → Archivos .sys en C:\\Windows\\System32\\drivers\\ → Montaje del sistema de archivos NTFS.',
    possibleFailures: [
      'Modo de la controladora en BIOS cambiado (ej. Intel VMD / RAID activado vs AHCI/NVMe).',
      'Driver de almacenamiento corrupto provocando BSOD INACCESSIBLE_BOOT_DEVICE (0x0000007B).',
      'Filtro de sistema de archivos (fltmgr / antivirus de terceros) bloqueando el montaje de C:.',
    ],
    detectionClues: [
      'Pantalla azul 0x0000007B INACCESSIBLE_BOOT_DEVICE a los 2 segundos de ver los puntos girando.',
      'Cambiar el modo SATA/VMD en el setup del BIOS restaura el booteo de inmediato.',
      'El fallo se reproduce idéntico en Modo Seguro porque los drivers BOOT_START son obligatorios.',
    ],
    evoTip: 'Una causa frecuente de BSOD 0x7B tras actualizar BIOS es que la placa reactiva "Intel VMD / RAID" por defecto cuando Windows se instaló en modo AHCI.',
  },
  27: {
    purpose: 'Ejecutar KiSystemStartup(), habilitar interrupciones, crear el proceso System (PID 4) y mostrar el splash de inicio.',
    signalFlow: 'ntoskrnl.exe → Inicialización de Fase 0 y Fase 1 → Creación del proceso System (PID 4) e hilos de kernel.',
    possibleFailures: [
      'Celdas de memoria RAM inestables que corrompen estructuras de datos del planificador de kernel.',
      'BSOD KERNEL_SECURITY_CHECK_FAILURE o SYSTEM_THREAD_EXCEPTION_NOT_HANDLED.',
      'Sobrecalentamiento extremo del procesador con apagado térmico.',
    ],
    detectionClues: [
      'BSOD aleatorio durante la animación de los puntos girando.',
      'Diagnóstico de memoria con MemTest86 revela errores de bit en direcciones altas.',
      'Limpiar perfiles de overclocking o reemplazar módulo de RAM resuelve la inestabilidad.',
    ],
    evoTip: 'Si Windows arroja códigos de pantalla azul diferentes en cada reinicio durante la animación de carga, aumenta la sospecha sobre la estabilidad de la memoria RAM o IMC.',
  },
  28: {
    purpose: 'Iniciar el Session Manager Subsystem (smss.exe), crear variables de entorno, montar archivos de paginación y crear la Sesión 0 y Sesión 1.',
    signalFlow: 'Proceso System (PID 4) → C:\\Windows\\System32\\smss.exe → Creación de Sesión 0 (Servicios) y Sesión 1 (Usuario interactivo).',
    possibleFailures: [
      'Binario smss.exe corrupto o modificado por software malicioso.',
      'Pantalla azul crítica STATUS_SYSTEM_PROCESS_TERMINATED (0xC000021A).',
      'Falla al montar el archivo pagefile.sys por falta de espacio crítico en C:.',
    ],
    detectionClues: [
      'BSOD 0xC000021A antes de llegar a la pantalla de bienvenida.',
      'Iniciar en Modo Seguro permite verificar si el subsistema carga.',
      'Liberar espacio en disco y ejecutar SFC restaura el binario smss.exe.',
    ],
    evoTip: 'smss.exe es el iniciador de los subsistemas en Windows: si este proceso muere, el sistema operativo genera un BSOD 0xC000021A de protección.',
  },
  29: {
    purpose: 'Arrancar los subsistemas esenciales de Sesión 0: csrss.exe (Runtime Win32), win32k.sys (subsistema gráfico) y wininit.exe.',
    signalFlow: 'smss.exe (Sesión 0) → csrss.exe y wininit.exe → win32k.sys enlazado con driver de GPU.',
    possibleFailures: [
      'Driver de video de terceros corrupto provocando cuelgue o pantalla negra al cargar win32k.sys.',
      'Conflicto de resolución al conmutar del modo básico UEFI a la resolución nativa.',
      'Falla en csrss.exe de Sesión 0.',
    ],
    detectionClues: [
      'Pantalla negra sin cursor justo cuando la resolución de pantalla cambia de escala.',
      'Arrancar en "Modo de video de baja resolución" o "Modo Seguro" permite entrar a Windows.',
      'Desinstalar el driver con DDU (Display Driver Uninstaller) resuelve el cuelgue.',
    ],
    evoTip: 'Si la pantalla queda en negro justo después de los puntos girando cuando el monitor cambia de resolución, aumenta la probabilidad de conflicto en el driver de video.',
  },
  30: {
    purpose: 'Lanzar el Service Control Manager (services.exe), LSASS (lsass.exe) y desplegar los servicios automáticos agrupados en instancias de svchost.exe.',
    signalFlow: 'wininit.exe → services.exe (SCM) y lsass.exe → Instancias de svchost.exe (LSM, DHCP, Audiosrv, PlugPlay).',
    possibleFailures: [
      'Servicio de terceros dañado que entra en interbloqueo (deadlock) bloqueando el SCM.',
      'Demoras excesivas de 5 a 10 minutos en la pantalla de carga de Windows.',
      'Corrupción en la base de datos de servicios en el Registro.',
    ],
    detectionClues: [
      'El círculo de puntos gira indefinidamente pero el Modo Seguro arranca al instante.',
      'El Visor de Eventos (eventvwr.msc) registra errores 7000/7009 con timeouts de 30.000 ms.',
      'Deshabilitar el servicio en conflicto desde services.msc resuelve la demora.',
    ],
    evoTip: 'Si el Modo Seguro inicia rápido pero el inicio normal tarda 10 minutos, no es problema de disco ni de Windows: es un servicio de terceros atascado.',
  },
  31: {
    purpose: 'Crear la Sesión 1 interactiva, ejecutar winlogon.exe, iniciar el compositor DWM y renderizar la pantalla de bloqueo con LogonUI.exe.',
    signalFlow: 'smss.exe (Sesión 1) → winlogon.exe → dwm.exe (compositor) y LogonUI.exe (pantalla de bienvenida).',
    possibleFailures: [
      'Falla en LogonUI por proveedor de credenciales (Credential Provider) de terceros dañado.',
      'Error de Desktop Window Manager (dwm.exe) provocando parpadeo continuo.',
      'Corrupción en la base de datos de cuentas SAM.',
    ],
    detectionClues: [
      'Pantalla de bienvenida que no muestra el campo de contraseña o parpadea en bucle.',
      'Iniciar en Modo Seguro permite acceder con cuenta de administrador local.',
      'Desinstalar software de autenticación biométrica o huella conflictivo resuelve la falla.',
    ],
    evoTip: 'LogonUI.exe corre dentro del entorno acelerado por GPU de dwm.exe: por eso las pantallas de bloqueo modernas tienen animaciones fluidas y transparencia.',
  },
  32: {
    purpose: 'Autenticar la identidad del usuario mediante LSASS, montar la colmena NTUSER.DAT en HKEY_CURRENT_USER y preparar el perfil.',
    signalFlow: 'Usuario ingresa PIN/Contraseña → winlogon.exe → Validación en lsass.exe → ProfSvc monta NTUSER.DAT.',
    possibleFailures: [
      'Mensaje "Error en el servicio de perfil de usuario al iniciar sesión" con carga de perfil temporal.',
      'Archivo NTUSER.DAT corrupto o con permisos NTFS restringidos.',
      'Clave de perfil en Registro con extensión .bak en ProfileList.',
    ],
    detectionClues: [
      'Windows inicia con un cartel de "Has iniciado sesión con un perfil temporal".',
      'El Registro en HKLM\\Software\\...\\ProfileList muestra una subclave duplicada con .bak.',
      'Renombrar la clave y reparar permisos en C:\\Users\\Usuario resuelve el acceso.',
    ],
    evoTip: 'Un perfil temporal no significa que perdiste tus fotos: significa que Windows no pudo bloquear NTUSER.DAT y te creó un entorno provisorio en RAM.',
  },
  33: {
    purpose: 'Consultar la clave Shell en Winlogon y ejecutar C:\\Windows\\explorer.exe para desplegar la barra de tareas, menú inicio y escritorio interactivo.',
    signalFlow: 'winlogon.exe → Consulta de clave Shell en Registro → C:\\Windows\\explorer.exe bajo token de usuario.',
    possibleFailures: [
      'Clave de Registro "Shell" en Winlogon alterada o apuntando a un archivo inexistente.',
      'Proceso explorer.exe colgado o bloqueado por un hook shell de terceros.',
      'Pantalla negra tras el mensaje Bienvenido con solo el cursor del mouse visible.',
    ],
    detectionClues: [
      'La pantalla queda en negro pero el cursor se mueve y Ctrl+Shift+Esc abre el Administrador de Tareas.',
      'Ejecutar manualmente "explorer.exe" desde el Administrador de Tareas abre el escritorio de inmediato.',
      'Restaurar la clave "Shell" a "explorer.exe" en Winlogon soluciona la falla definitivamente.',
    ],
    evoTip: 'Si ves el cursor del mouse sobre pantalla negra tras poner tu clave, el sistema está vivo: solo falló el proceso explorer.exe. Presiona Ctrl+Shift+Esc para levantarlo.',
  },
  34: {
    purpose: 'Completar la secuencia completa de arranque: sistema 100% operativo en estado de reposo activo (Idle), listo para recibir comandos.',
    signalFlow: 'Todos los subsistemas de Hardware, Firmware, Kernel, Servicios y Shell sincronizados en equilibrio dinámico.',
    possibleFailures: [
      'Consumo anormal de recursos en reposo por procesos de fondo o minería no autorizada.',
      'Retrasos DPC (DPC latency) por drivers de audio/red desactualizados.',
      'Programas de inicio excesivos ralentizando la experiencia.',
    ],
    detectionClues: [
      'Administrador de Tareas muestra sistema responsivo.',
      'DPC Latency Checker reporta latencias dentro del rango verde óptimo.',
      'Arranque completo de 35 eslabones verificado sin anomalías.',
    ],
    evoTip: 'La salud de una PC no se mide solo con que prenda: se mide con que en el paso 34 el procesador descanse en reposo sin procesos parásitos drenando recursos.',
  },
};

export interface BootPhase {
  id: string;
  phaseNumber: number; // 1 to 7
  title: string; // "APAGADA", "STANDBY", "POWER", "POST", "VIDEO", "BOOT", "WINDOWS"
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  startStep: number;
  endStep: number;
}

export const BOOT_PHASES: BootPhase[] = [
  {
    id: 'phase-01',
    phaseNumber: 1,
    title: 'APAGADA',
    subtitle: 'Sin energía (0V)',
    color: '#9ca3af',
    bgColor: 'bg-zinc-800/80',
    borderColor: 'border-zinc-600',
    startStep: 0,
    endStep: 0,
  },
  {
    id: 'phase-02',
    phaseNumber: 2,
    title: 'STANDBY',
    subtitle: 'Riel +5VSB activo',
    color: '#eab308',
    bgColor: 'bg-yellow-950/60',
    borderColor: 'border-yellow-500/40',
    startStep: 1,
    endStep: 3,
  },
  {
    id: 'phase-03',
    phaseNumber: 3,
    title: 'POWER',
    subtitle: 'Rieles nominales & PWR_OK',
    color: '#f97316',
    bgColor: 'bg-orange-950/60',
    borderColor: 'border-orange-500/40',
    startStep: 4,
    endStep: 6,
  },
  {
    id: 'phase-04',
    phaseNumber: 4,
    title: 'POST',
    subtitle: 'Test de silicio & RAM',
    color: '#a855f7',
    bgColor: 'bg-purple-950/60',
    borderColor: 'border-purple-500/40',
    startStep: 7,
    endStep: 14,
  },
  {
    id: 'phase-05',
    phaseNumber: 5,
    title: 'VIDEO',
    subtitle: 'GOP, discos & I/O',
    color: '#06b6d4',
    bgColor: 'bg-cyan-950/60',
    borderColor: 'border-cyan-500/40',
    startStep: 15,
    endStep: 19,
  },
  {
    id: 'phase-06',
    phaseNumber: 6,
    title: 'BOOT',
    subtitle: 'ESP, BCD & winload.efi',
    color: '#3b82f6',
    bgColor: 'bg-blue-950/60',
    borderColor: 'border-blue-500/40',
    startStep: 20,
    endStep: 26,
  },
  {
    id: 'phase-07',
    phaseNumber: 7,
    title: 'WINDOWS',
    subtitle: 'Kernel, servicios & Shell',
    color: '#10b981',
    bgColor: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/40',
    startStep: 27,
    endStep: 34,
  },
];

export const SIMPLE_STEP_TITLES: Record<number, string> = {
  0: 'La PC está apagada y sin energía',
  1: 'La fuente recibe energía y habilita standby (+5VSB)',
  2: 'Se presiona el botón de encendido',
  3: 'La placa solicita encender la fuente (PS_ON#)',
  4: 'La fuente entrega energía a todos los componentes',
  5: 'El voltaje se estabiliza (Power Good / PWR_OK)',
  6: 'El procesador despierta y sale de congelamiento',
  7: 'El procesador busca el programa de la BIOS (Reset Vector)',
  8: 'La BIOS verifica la seguridad básica y crea memoria temporal',
  9: 'Se configuran los núcleos y parches del procesador',
  10: 'Se activa el controlador interno de memoria (IMC)',
  11: 'La placa lee los datos de los módulos RAM (SPD)',
  12: 'La memoria se comprueba y ajusta (Memory Training)',
  13: 'Se comunican los chips y buses de la placa madre',
  14: 'Se escanean las tarjetas y ranuras PCIe',
  15: 'La placa de video se activa y da señal en pantalla (GOP)',
  16: 'Se activan las controladoras de almacenamiento (NVMe/AHCI)',
  17: 'Se detectan los discos de almacenamiento e identifican',
  18: 'Se inicializan teclado, mouse, puertos USB y chip TPM',
  19: 'El chequeo de componentes (POST) se completa con éxito',
  20: 'La BIOS consulta el orden de arranque de discos (NVRAM)',
  21: 'Se localiza la partición de arranque UEFI (ESP FAT32)',
  22: 'Windows Boot Manager toma el control del arranque (BCD)',
  23: 'El cargador de Windows (winload.efi) lee el sistema',
  24: 'Se carga el núcleo de Windows (ntoskrnl.exe) en la RAM',
  25: 'La capa de abstracción (HAL) toma el control del hardware',
  26: 'Se cargan los controladores esenciales de arranque',
  27: 'El núcleo de Windows se inicia oficialmente',
  28: 'Windows prepara el gestor de sesiones (smss.exe)',
  29: 'Se inician los procesos esenciales de seguridad y sistema',
  30: 'Se activan los servicios en segundo plano',
  31: 'Muestra la pantalla de inicio de sesión (LogonUI)',
  32: 'Se autentica el usuario y se carga su perfil',
  33: 'Se abre el escritorio interactivo y sus íconos',
  34: 'Windows está 100% listo para trabajar',
};

export function getPhaseForStep(stepNumber: number): BootPhase {
  const phase = BOOT_PHASES.find(p => stepNumber >= p.startStep && stepNumber <= p.endStep);
  return phase || BOOT_PHASES[0];
}

export function getStepTransitionInfo(stepNumber: number) {
  const step = BOOT_SEQUENCE_STEPS[stepNumber] || BOOT_SEQUENCE_STEPS[0];
  const nextStep = BOOT_SEQUENCE_STEPS[stepNumber + 1];

  let whatChanged = step.whatIsHappening;
  if (stepNumber === 0) {
    whatChanged = 'La computadora no tiene suministro de electricidad o la llave trasera de la fuente está apagada.';
  } else if (stepNumber === 1) {
    whatChanged = 'El transformador auxiliar de la fuente generó +5V permanentes en el cable violeta (+5VSB).';
  } else if (stepNumber === 2) {
    whatChanged = 'El pulsador frontal unió brevemente los pines PWR_SW y envió un pulso de 0V a la placa madre.';
  } else if (stepNumber === 3) {
    whatChanged = 'El chip Super I/O derivó el cable verde (PS_ON#) a masa, ordenando encender la fuente.';
  } else if (stepNumber === 4) {
    whatChanged = 'La fuente entregó voltajes estables de +12V, +5V y +3.3V a todos los circuitos del equipo.';
  } else if (stepNumber === 5) {
    whatChanged = 'La fuente confirmó que sus voltajes son seguros enviando +5V por el cable gris (PWR_OK).';
  } else if (stepNumber === 6) {
    whatChanged = 'El generador de reloj y VRM liberaron la señal RESET#; el procesador salió de reposo.';
  } else if (stepNumber === 7) {
    whatChanged = 'La CPU ejecutó un salto a la dirección física de la BIOS en la memoria Flash SPI.';
  } else if (stepNumber === 8) {
    whatChanged = 'La BIOS validó su firma digital y configuró la caché del procesador como RAM temporal.';
  } else if (stepNumber === 9) {
    whatChanged = 'Se aplicaron parches de microcódigo y se sincronizaron todos los núcleos de la CPU.';
  } else if (stepNumber === 10) {
    whatChanged = 'Se activaron las líneas de comunicación entre la CPU y los zócalos de memoria RAM.';
  } else if (stepNumber === 11) {
    whatChanged = 'La placa leyó el chip SPD de cada memoria RAM para conocer su velocidad y latencias.';
  } else if (stepNumber === 12) {
    whatChanged = 'Se emitieron impulsos de prueba en los canales RAM para calibrar el tiempo exacto de lectura.';
  } else if (stepNumber === 13) {
    whatChanged = 'Se abrieron los canales de datos entre el procesador, el chipset y la placa base.';
  } else if (stepNumber === 14) {
    whatChanged = 'Se detectaron las tarjetas de expansión insertadas en los puertos PCI Express.';
  } else if (stepNumber === 15) {
    whatChanged = 'La placa de video se inicializó e iluminó la pantalla con el protocolo UEFI GOP.';
  } else if (stepNumber === 16) {
    whatChanged = 'Se encendieron las controladoras NVMe y SATA para acceder a los discos instalados.';
  } else if (stepNumber === 17) {
    whatChanged = 'Se leyeron las identidades, modelos y capacidades de los discos conectados.';
  } else if (stepNumber === 18) {
    whatChanged = 'Se reconocieron el teclado, el mouse, los puertos USB y el chip de seguridad TPM.';
  } else if (stepNumber === 19) {
    whatChanged = 'Todos los componentes físicos superaron la verificación inicial (POST exitoso).';
  } else if (stepNumber === 20) {
    whatChanged = 'La BIOS consultó en su memoria NVRAM qué disco tiene la prioridad de arranque.';
  } else if (stepNumber === 21) {
    whatChanged = 'Se montó la partición EFI FAT32 y se encontró el archivo de arranque de Windows.';
  } else if (stepNumber === 22) {
    whatChanged = 'El administrador de arranque de Windows leyó las opciones de inicio en el archivo BCD.';
  } else if (stepNumber === 23) {
    whatChanged = 'El cargador winload.efi se ejecutó y comenzó a preparar la estructura de Windows.';
  } else if (stepNumber === 24) {
    whatChanged = 'Se copiaron los archivos principales del núcleo (ntoskrnl.exe) a la memoria RAM.';
  } else if (stepNumber === 25) {
    whatChanged = 'La capa HAL asumió el control para adaptar Windows a la marca y modelo del hardware.';
  } else if (stepNumber === 26) {
    whatChanged = 'Se cargaron los controladores críticos para que Windows pueda leer el disco duro.';
  } else if (stepNumber === 27) {
    whatChanged = 'El núcleo de Windows tomó el control total del equipo y comenzó su inicialización.';
  } else if (stepNumber === 28) {
    whatChanged = 'Se ejecutó smss.exe para organizar las sesiones internas del sistema operativo.';
  } else if (stepNumber === 29) {
    whatChanged = 'Se iniciaron los subsistemas de ventanas básicas (csrss.exe) e inicio (wininit.exe).';
  } else if (stepNumber === 30) {
    whatChanged = 'Se activaron los servicios de red, seguridad (lsass.exe) y tareas automáticas.';
  } else if (stepNumber === 31) {
    whatChanged = 'Se mostró en pantalla la interfaz para que el usuario ingrese su contraseña.';
  } else if (stepNumber === 32) {
    whatChanged = 'LSASS verificó la clave del usuario y cargó sus archivos personales de perfil.';
  } else if (stepNumber === 33) {
    whatChanged = 'Se inició explorer.exe, dibujando la barra de tareas y el escritorio.';
  } else if (stepNumber === 34) {
    whatChanged = 'El sistema completó los 35 pasos de inicio y quedó 100% responsivo para el usuario.';
  }

  const interveningComponents = `${step.initiator} ➔ ${step.responder}`;

  let whatShouldHappenNext = nextStep
    ? `Paso ${String(nextStep.stepNumber).padStart(2, '0')}: ${SIMPLE_STEP_TITLES[nextStep.stepNumber] || nextStep.name}`
    : 'Windows se encuentra en estado estable de reposo (Idle).';

  return {
    whatChanged,
    interveningComponents,
    whatShouldHappenNext,
  };
}

export function getStepForensicDetails(stepNumber: number): StepForensicDetail {
  const step = BOOT_SEQUENCE_STEPS[stepNumber] || BOOT_SEQUENCE_STEPS[0];
  const base = STEP_FORENSIC_DETAILS[stepNumber] || {
    purpose: step.whatIsHappening,
    signalFlow: `${step.initiator} → ${step.responder}`,
    possibleFailures: [step.ifFails],
    detectionClues: [step.technicalObservation],
    evoTip: 'Comprobá siempre el último eslabón confirmado antes de formular hipótesis sobre etapas posteriores.',
  };

  // Base fallback defaults
  let simpleExplanation = step.whatIsHappening;
  let technicalDetail = step.technicalObservation || step.whatIsHappening;
  let signalTraveling = base.signalFlow;
  let visibleSymptoms = 'Equipo en reposo o con comportamiento correspondiente a la etapa alcanzada.';
  let whatToVerify: string[] = [
    'Confirmar el estado de la etapa previa antes de formular hipótesis posteriores.',
    'Inspeccionar conexiones físicas y ausencia de anomalías visuales en el circuito.',
    'Consultar la documentación técnica del fabricante para comprobar compatibilidad.',
  ];

  let structuredVerification: StructuredWorkshopVerification = {
    testName: `Verificación física de ${step.name}`,
    objective: `Determinar si la etapa [${step.name}] completa su transición de forma correcta y oportuna.`,
    tools: 'Inspección visual y manual de la motherboard y periféricos.',
    procedure: 'Comprobar conexiones, estado de buses y respuestas del subsistema asociado.',
    expectedResult: step.expectedResponse || 'Comportamiento nominal del subsistema.',
    ifCorrect: `Avanzar la comprobación hacia el siguiente eslabón: ${step.nextStep}.`,
    ifIncorrect: `Aislar los componentes intervinientes (${step.activeComponents.join(', ')}).`,
    whatItProves: 'Descarta anomalías en este eslabón y delimita el área de sospecha.',
    nextStep: step.nextStep,
    safetyLevel: step.safetyLevel,
    safetyRequirement: step.safetyRequirement,
  };

  // Individual 00 to 34 pedagogical microclasses
  switch (stepNumber) {
    case 0:
      simpleExplanation = 'La computadora está totalmente apagada sin corriente eléctrica activa.';
      technicalDetail = 'Aislamiento galvánico primario. Ningún semiconductor ni circuito de control está energizado.';
      signalTraveling = 'Red Eléctrica → Cable Interlock → Interruptor I/O (Abierto)';
      visibleSymptoms = 'Ningún ventilador gira. Todos los LEDs de la placa están apagados.';
      whatToVerify = [
        '1. Comprobar que el cable interlock esté firmemente asentado en la toma trasera de la fuente.',
        '2. Verificar que la toma de pared disponga de tensión eléctrica adecuada.',
        '3. Asegurar que la llave I/O trasera de la fuente se encuentre en posición 1 (ON).',
      ];
      structuredVerification = {
        testName: 'Comprobación de alimentación eléctrica primaria',
        objective: 'Verificar la presencia de suministro eléctrico seguro en la entrada de la PSU.',
        tools: 'Inspección visual del cableado y llave trasera.',
        procedure: 'Revisar la inserción firme del cable de poder interlock y activar la llave I/O.',
        expectedResult: 'Habilitación de entrada de red hacia el circuito de standby de la fuente.',
        ifCorrect: 'Avanzar al Paso 01 para verificar el riel +5VSB de espera.',
        ifIncorrect: 'Revisar zapatilla eléctrica, disyuntor o sustituir cable de poder interlock.',
        whatItProves: 'Descarta problemas de suministro domiciliario o falsos contactos en la entrada AC.',
        nextStep: 'Paso 01: Standby (+5VSB)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 1:
      simpleExplanation = 'La fuente genera un voltaje permanente de espera (+5VSB) que mantiene alimentados los circuitos de escucha del encendido.';
      technicalDetail = 'El conversor auxiliar flyback de la fuente polariza el pin 9 (+5VSB). Alimenta el Super I/O, EC y circuito RTC.',
      signalTraveling = 'Transformador Auxiliar PSU → Pin 9 ATX (+5VSB) → Controlador Super I/O / EC';
      visibleSymptoms = 'LED testigo de standby iluminado en la motherboard (según modelo). Ventiladores aún estáticos.';
      whatToVerify = [
        '1. Confirmar si la placa base recibe energía de espera antes de presionar el botón.',
        '2. En taller, medir con multímetro en escala DCV en pin 9 (+5VSB) del conector ATX.',
        '3. Descartar cortocircuitos en puertos USB que drenen el riel de espera.',
      ];
      structuredVerification = {
        testName: 'Inspección del estado de espera (Standby +5VSB)',
        objective: 'Confirmar si la motherboard recibe alimentación para escuchar el botón frontal.',
        tools: 'Inspección de LED testigo en placa (o multímetro en banco para técnicos).',
        procedure: 'Observar presencia de energía en la placa base y medir riel auxiliar.',
        expectedResult: 'Tensión de +5V (+/- 5%) permanente en el pin 9 del conector ATX.',
        ifCorrect: 'La placa está lista para procesar la pulsación del botón POWER (Paso 02).',
        ifIncorrect: 'Sospechar de la fuente auxiliar o cortocircuito en placa madre.',
        whatItProves: 'Demuestra si la placa madre tiene energía basal para iniciar la lógica de arranque.',
        nextStep: 'Paso 02: Pulsación de POWER (PWR_SW)',
        safetyLevel: 'TECNICO',
        safetyRequirement: 'Requiere conocimiento, instrumental adecuado y procedimiento seguro.',
      };
      break;

    case 2:
      simpleExplanation = 'Al pulsar el botón del gabinete, se unen momentáneamente dos pines en la placa madre para enviar la orden de encendido.';
      technicalDetail = 'Cierre de contacto momentáneo a masa (0V) en el pin PWR_SW del header Front Panel. La lógica de control detecta la transición de flanco descendente.';
      signalTraveling = 'Pulsador Frontal → Header Front Panel → Señal PWR_SW a Masa (0V)';
      visibleSymptoms = 'Presión mecánica del botón. La placa madre recibe la solicitud.';
      whatToVerify = [
        '1. Confirmar la conexión física de los cables PWR_SW en el header según manual de la placa.',
        '2. Inspeccionar que el pulsador mecánico no esté trabado o roto.',
        '3. Probar puente momentáneo seguro en pines PWR_SW si se sospecha del botón del gabinete.',
      ];
      structuredVerification = {
        testName: 'Verificación del pulsador frontal y cableado PWR_SW',
        objective: 'Determinar si la solicitud mecánica de encendido llega al header de la placa.',
        tools: 'Manual de la motherboard e inspección visual.',
        procedure: 'Revisar la guía de pines del front panel y asegurar el conector PWR_SW.',
        expectedResult: 'El botón cierra el circuito y la placa madre activa la solicitud PS_ON#.',
        ifCorrect: 'Avanzar al Paso 03 para auditar la orden hacia la fuente (PS_ON#).',
        ifIncorrect: 'Reacomodar el conector o sustituir el pulsador defectuoso.',
        whatItProves: 'Diferencia un problema de botón roto de una falla electrónica en la motherboard.',
        nextStep: 'Paso 03: Señal de encendido (PS_ON#)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 3:
      simpleExplanation = 'La placa madre le pide formalmente a la fuente que encienda los voltajes principales mediante la señal PS_ON#.';
      technicalDetail = 'La lógica de control de plataforma (Super I/O / EC / PCH) conmuta la línea PS_ON# (pin 16 ATX, cable verde) a potencial de masa (0V).';
      signalTraveling = 'Lógica de Plataforma → Pin 16 ATX (PS_ON# a 0V) → Supervisor de la PSU';
      visibleSymptoms = 'La fuente reacciona iniciando el giro de ventiladores.';
      whatToVerify = [
        '1. Comprobar que el conector ATX de 24 pines esté firmemente calzado en la placa madre.',
        '2. Si los ventiladores no giran, verificar si la línea PS_ON# baja a nivel bajo.',
        '3. Descartar protecciones por cortocircuito (OCP/SCP) en componentes de la placa.',
      ];
      structuredVerification = {
        testName: 'Comprobación de la señal de encendido PS_ON#',
        objective: 'Verificar si la placa madre solicita el encendido de los rieles principales a la PSU.',
        tools: 'Inspección de traba del conector ATX 24 pines (y multímetro en banco).',
        procedure: 'Verificar la traba del conector ATX 24p. En banco técnico: medir pin 16.',
        expectedResult: 'PS_ON# cae a 0V y la PSU enciende sus salidas principales.',
        ifCorrect: 'Avanzar al Paso 04 para verificar la estabilización de voltajes.',
        ifIncorrect: 'Falla en lógica de placa madre o protección por cortocircuito en fuente.',
        whatItProves: 'Demuestra si la motherboard es capaz de ordenar el encendido a la fuente.',
        nextStep: 'Paso 04: Activación de rieles principales',
        safetyLevel: 'BANCO',
        safetyRequirement: 'Requiere conocimiento, instrumental adecuado y procedimiento seguro.',
      };
      break;

    case 4:
      simpleExplanation = 'La fuente de poder activa sus transformadores principales y suministra energía de alta potencia a toda la placa base.';
      technicalDetail = 'Conmutación de etapas primarias y generación de rieles nominales (+12V, +5V, +3.3V). Alimentación hacia VRM, Chipset y slots PCIe/M.2.';
      signalTraveling = 'PSU Secundario Conmutado → Rieles +12V / +5V / +3.3V → Motherboard & VRM';
      visibleSymptoms = 'Ventiladores de chasis, fuente y disipador comienzan a girar sostenidamente.';
      whatToVerify = [
        '1. Si los ventiladores amagan con girar y se apagan en 100 ms, sospechar de cortocircuito en riel de 12V.',
        '2. Desconectar el conector EPS de 8 pines del CPU para aislar si el corto reside en el VRM del procesador.',
        '3. Medir voltajes de salida bajo carga con multímetro en banco técnico.',
      ];
      structuredVerification = {
        testName: 'Medición de rieles principales de potencia',
        objective: 'Verificar que las tensiones de 12V, 5V y 3.3V se encuentren dentro de tolerancias ATX (+/- 5%).',
        tools: 'Multímetro digital en escala DC o tester ATX en banco de pruebas.',
        procedure: 'Medir en conector acoplado o carga simulada los voltajes de cada riel.',
        expectedResult: '+12V (11.4V-12.6V), +5V (4.75V-5.25V), +3.3V (3.14V-3.47V).',
        ifCorrect: 'Avanzar al Paso 05 (Confirmación de PWR_OK).',
        ifIncorrect: 'Fuente dañada o cortocircuito en placa madre activando protecciones OCP/SCP.',
        whatItProves: 'Demuestra si la fuente entrega energía con capacidad de corriente suficiente.',
        nextStep: 'Paso 05: Power Good / PWR_OK',
        safetyLevel: 'BANCO',
        safetyRequirement: 'Requiere conocimiento, instrumental adecuado y procedimiento seguro.',
      };
      break;

    case 5:
      simpleExplanation = 'La fuente confirma que sus voltajes (+12V, +5V, +3.3V) son estables enviando la señal PWR_OK (Power Good).';
      technicalDetail = 'El supervisor interno de la PSU eleva la señal PWR_OK (pin 8 ATX, cable gris) a +5V entre 100ms y 500ms tras estabilizarse la salida.',
      signalTraveling = 'Supervisor PSU → Pin 8 ATX (PWR_OK = +5V) → Lógica de Reset de Motherboard';
      visibleSymptoms = 'Ventiladores girando con velocidad constante. La placa madre recibe confirmación de potencia limpia.';
      whatToVerify = [
        '1. Si los ventiladores giran pero la placa madre nunca avanza, sospechar de PWR_OK ausente.',
        '2. Probar con una fuente de poder conocida funcional en banco de pruebas.',
        '3. Medir presencia de +5V en cable gris (pin 8) con multímetro con puntas de precisión.',
      ];
      structuredVerification = {
        testName: 'Verificación de estabilidad de potencia PWR_OK',
        objective: 'Confirmar que la fuente de poder entrega tensiones estables y notifica a la placa.',
        tools: 'Fuente de prueba certificada o multímetro en banco.',
        procedure: 'Comprobar el comportamiento del equipo con una fuente conocida funcional.',
        expectedResult: 'PWR_OK emitido en +5V sostenidos y la placa procede a liberar el reset.',
        ifCorrect: 'Avanzar al Paso 06 (Liberación de Reset de CPU).',
        ifIncorrect: 'Reemplazar la fuente de poder defectuosa o revisar circuito supervisor.',
        whatItProves: 'Distingue una fuente que gira ventiladores con voltajes inestables de una fuente sana.',
        nextStep: 'Paso 06: Liberación de Reset de CPU',
        safetyLevel: 'TECNICO',
        safetyRequirement: 'Requiere conocimiento, instrumental adecuado y procedimiento seguro.',
      };
      break;

    case 6:
      simpleExplanation = 'La placa madre estabiliza la alimentación del procesador (VRM) y le quita el freno de reset para que pueda empezar a trabajar.';
      technicalDetail = 'El generador de reloj y el regulador VRM entregan Vcore y elevan la línea RESET# a nivel alto lógico. La CPU sale de inhibición.';
      signalTraveling = 'Lógica de Reset & VRM → Línea RESET# (Nivel Alto) → Socket CPU';
      visibleSymptoms = 'El procesador comienza a consumir energía y a generar calor disipado leve.';
      whatToVerify = [
        '1. Comprobar que el conector EPS de alimentación de CPU esté conectado con firmeza.',
        '2. En banco técnico, verificar ausencia de cortocircuitos en los MOSFETs de fase del VRM.',
        '3. Confirmar que el cristal oscilador base esté generando frecuencia de reloj.',
      ];
      structuredVerification = {
        testName: 'Inspección de alimentación y desreset de CPU',
        objective: 'Confirmar que la CPU recibe alimentación del VRM y que la línea de reset pasa a nivel alto.',
        tools: 'Inspección de cable EPS y multímetro en banco para técnicos.',
        procedure: 'Revisar conector EPS de 12V con equipo apagado; en banco medir impedancia en inductores VRM.',
        expectedResult: 'Impedancia nominal sin cortocircuito y CPU liberada de reset.',
        ifCorrect: 'Avanzar al Paso 07 (Lectura del Reset Vector en chip SPI Flash).',
        ifIncorrect: 'Falla en VRM, socket o procesador dañado.',
        whatItProves: 'Demuestra si el procesador está en condiciones eléctricas de ejecutar instrucciones.',
        nextStep: 'Paso 07: Reset Vector (0xFFFFFFF0)',
        safetyLevel: 'TECNICO',
        safetyRequirement: 'Requiere conocimiento, instrumental adecuado y procedimiento seguro.',
      };
      break;

    case 7:
      simpleExplanation = 'El procesador ejecuta su primer salto obligatorio (Reset Vector) hacia el chip de memoria Flash donde está grabado el firmware UEFI.';
      technicalDetail = 'El puntero CS:IP apunta a la dirección mapeada 0xFFFFFFF0h. La CPU inicia el bus SPI para leer el microcódigo de la BIOS.',
      signalTraveling = 'CPU (CS:IP = 0xFFFFFFF0h) → Bus SPI (CS#, CLK, MOSI/MISO) → Chip SPI Flash UEFI';
      visibleSymptoms = 'Actividad en el bus SPI. En placas con LED debug, el testigo de CPU se enciende momentáneamente.';
      whatToVerify = [
        '1. Comprobar que la versión de BIOS grabada sea compatible con el procesador instalado.',
        '2. Utilizar función BIOS Flashback si la placa dispone de ella para regrabar el firmware.',
        '3. Inspeccionar el chip SPI Flash en busca de pines sueltos o suciedad.',
      ];
      structuredVerification = {
        testName: 'Auditoría de compatibilidad de firmware y bus SPI',
        objective: 'Verificar que la CPU pueda comunicarse con el chip SPI Flash de la motherboard.',
        tools: 'Pendrive FAT32 con BIOS oficial o programador SPI en banco.',
        procedure: 'Consultar la lista QVL de CPUs y aplicar actualización de BIOS con flashback si corresponde.',
        expectedResult: 'Lectura correcta del bloque inicial de microcódigo UEFI.',
        ifCorrect: 'Avanzar al Paso 08 (Fase SEC & PEI de UEFI).',
        ifIncorrect: 'Regrabar chip SPI Flash o sustituir chip corrupto.',
        whatItProves: 'Descarta corrupción de BIOS o incompatibilidad de versión con el procesador.',
        nextStep: 'Paso 08: Fase SEC & PEI (Cache-as-RAM)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 8:
      simpleExplanation = 'Como la memoria RAM todavía no está configurada, el procesador usa su memoria caché interna como memoria provisional.';
      technicalDetail = 'Fase SEC & PEI de UEFI: La CPU configura registros MTRR para usar caché L2/L3 como pila de ejecución (Cache-as-RAM).',
      signalTraveling = 'UEFI PEI Core → Registros MTRR de CPU → Caché L2/L3 (Pila de ejecución CAR)';
      visibleSymptoms = 'El procesador ejecuta código C de inicialización sin requerir módulos RAM físicos.';
      whatToVerify = [
        '1. Si el equipo se congela en este punto, sospechar de incompatibilidad de stepping de CPU.',
        '2. Verificar integridad del firmware y versiones soportadas por la placa.',
        '3. Comprobar que la presión del disipador no sea excesiva sobre el encapsulado.',
      ];
      structuredVerification = {
        testName: 'Validación de fase PEI y Cache-as-RAM',
        objective: 'Confirmar que el firmware puede establecer el stack temporal en la caché del CPU.',
        tools: 'Manual de la placa base y verificación de versión de BIOS.',
        procedure: 'Confirmar versión de microcódigo compatible con el stepping del procesador.',
        expectedResult: 'Creación exitosa del entorno CAR y avance hacia la inicialización de núcleos.',
        ifCorrect: 'Avanzar al Paso 09 (Sincronización de núcleos y microcódigo).',
        ifIncorrect: 'Actualizar firmware o verificar montaje físico del procesador.',
        whatItProves: 'Demuestra la integridad del silicio interno de la CPU en sus etapas más tempranas.',
        nextStep: 'Paso 09: Inicialización de núcleos de CPU',
        safetyLevel: 'USUARIO',
      };
      break;

    case 9:
      simpleExplanation = 'El firmware aplica parches de fábrica al procesador y sincroniza todos sus núcleos de cómputo.',
      technicalDetail = 'Carga de parches MSR, activación del Bootstrap Processor (BSP) y colocación de núcleos secundarios (AP) en estado de espera.',
      signalTraveling = 'UEFI PEI Core → Registros MSR / CPU Patch Loader → Núcleos de CPU';
      visibleSymptoms = 'LED de CPU en la placa madre se apaga o avanza al siguiente bloque.';
      whatToVerify = [
        '1. Inspeccionar pines del socket LGA con lupa por posibles pines doblados.',
        '2. Aflojar ligeramente los tornillos del disipador si existía torque excesivo.',
        '3. Limpiar restos de pasta térmica conductora que puedan tocar contactos del sustrato.',
      ];
      structuredVerification = {
        testName: 'Inspección física del socket y asentamiento de CPU',
        objective: 'Descartar contactos imperfectos o pines doblados en las líneas de control del socket.',
        tools: 'Lupa de aumento o microscopio con equipo desenergizado.',
        procedure: 'Retirar el disipador y procesador; inspeccionar la cuadrícula de pines del socket.',
        expectedResult: 'Pines perfectamente alineados sin sulfato ni deformaciones mecánicas.',
        ifCorrect: 'Avanzar al Paso 10 (Activación del controlador de memoria IMC).',
        ifIncorrect: 'Enderezar pines con precisión o reparar socket en banco técnico.',
        whatItProves: 'Diferencia una falla de procesador dañado de un mal contacto en el socket.',
        nextStep: 'Paso 10: Activación del IMC',
        safetyLevel: 'TECNICO',
        safetyRequirement: 'Requiere conocimiento, instrumental adecuado y procedimiento seguro.',
      };
      break;

    case 10:
      simpleExplanation = 'Se enciende el controlador de memoria integrado (IMC) dentro del procesador y se energizan los slots de memoria RAM.',
      technicalDetail = 'Configuración de registros del IMC y estabilización del regulador de voltaje secundario de memoria (VDD/VDDQ/VDD2).',
      signalTraveling = 'Firmware PEI → Registros de control IMC en CPU → VRM Secundario de Memoria';
      visibleSymptoms = 'Alimentación presente en los slots DIMM. El IMC inicia escucha en el bus SMBus.';
      whatToVerify = [
        '1. Comprobar que los módulos de memoria estén firmemente trabados en sus ranuras.',
        '2. En banco técnico, verificar tensiones de memoria (VDD/VDDQ) con multímetro.',
        '3. Descartar cortocircuitos en condensadores SMD cercanos a los slots DIMM.',
      ];
      structuredVerification = {
        testName: 'Comprobación de alimentación del subsistema de memoria',
        objective: 'Verificar que los rieles de voltaje de los slots DIMM entreguen los valores nominales.',
        tools: 'Multímetro en banco de pruebas o inspección visual de ranuras.',
        procedure: 'Medir tensión de alimentación en condensadores de desacoplo del slot de memoria.',
        expectedResult: 'Tensión nominal estabilizada según estándar de memoria (DDR4 / DDR5).',
        ifCorrect: 'Avanzar al Paso 11 (Lectura de chips SPD de los módulos).',
        ifIncorrect: 'Revisar regulador de voltaje de RAM en la placa base.',
        whatItProves: 'Demuestra si los módulos reciben energía para poder ser detectados.',
        nextStep: 'Paso 11: Lectura de chips SPD',
        safetyLevel: 'TECNICO',
        safetyRequirement: 'Requiere conocimiento, instrumental adecuado y procedimiento seguro.',
      };
      break;

    case 11:
      simpleExplanation = 'El sistema lee la etiqueta electrónica (chip SPD) de cada barra de memoria para conocer sus capacidades y velocidades de fábrica.',
      technicalDetail = 'Comunicación serie por bus SMBus (I2C/I3C). Lectura de bytes con parámetros JEDEC, perfiles XMP/EXPO y fabricante.',
      signalTraveling = 'Controlador SMBus (Plataforma/CPU) → Bus Serie I2C → Chip EEPROM SPD del Módulo DIMM';
      visibleSymptoms = 'El firmware identifica cuántas barras hay puestas y en qué canales (A/B).';
      whatToVerify = [
        '1. Retirar los módulos con equipo apagado y limpiar los contactos dorados con alcohol isopropílico.',
        '2. Instalar los módulos en los slots preferenciales indicados en el manual de la placa madre.',
        '3. Probar con un único módulo para descartar una barra con EEPROM SPD dañada.',
      ];
      structuredVerification = {
        testName: 'Limpieza de contactos y reasentamiento de módulos RAM',
        objective: 'Asegurar continuidad en los pines de comunicación serie SMBus de la memoria.',
        tools: 'Alcohol isopropílico de alta pureza y paño de microfibra.',
        procedure: 'Limpiar pines dorados del módulo, dejar evaporar y reinsertar con traba firme.',
        expectedResult: 'El firmware detecta la presencia y parámetros de cada barra de memoria.',
        ifCorrect: 'Avanzar al Paso 12 (Entrenamiento de memoria).',
        ifIncorrect: 'Probar con otro módulo funcional o en otra ranura DIMM.',
        whatItProves: 'Distingue una falla de suciedad en contactos de un módulo físicamente quemado.',
        nextStep: 'Paso 12: Memory Training',
        safetyLevel: 'USUARIO',
      };
      break;

    case 12:
      simpleExplanation = 'El procesador calibra con extrema precisión los tiempos de envío y recepción de datos con la memoria RAM (Memory Training).';
      technicalDetail = 'El IMC envía patrones de prueba por las pistas DQ/DQS, ajustando temporización, terminación y fase. El tiempo es variable según plataforma y densidad.',
      signalTraveling = 'Motor de Calibración IMC ↔ Ráfagas de Prueba DQ/DQS ↔ Chips DRAM';
      visibleSymptoms = 'Ventiladores pueden variar de velocidad. La pantalla aún no emite video durante la calibración.';
      whatToVerify = [
        '1. No interrumpir el proceso de inmediato: en DDR5 el primer entrenamiento puede tomar varios segundos.',
        '2. Si entra en reinicio continuo (bootloop), realizar Clear CMOS para volver a valores JEDEC base.',
        '3. Probar con un solo módulo en la ranura principal recomendada por el fabricante.',
      ];
      structuredVerification = {
        testName: 'Aislamiento de canal de memoria y Clear CMOS',
        objective: 'Restablecer perfiles de memoria a valores seguros de fábrica para superar el entrenamiento.',
        tools: 'Puente en pines CLRTC o retirada de pila CR2032 con equipo desenchufado.',
        procedure: 'Desenergizar el equipo, realizar Clear CMOS y encender con un solo módulo en slot primario.',
        expectedResult: 'Entrenamiento completado sin errores y avance inmediato al siguiente paso.',
        ifCorrect: 'Avanzar al Paso 13 (Inicialización de buses y traspaso a RAM física).',
        ifIncorrect: 'Incompatibilidad de memoria con el IMC o pista de datos dañada en PCB.',
        whatItProves: 'Demuestra si la falla era por perfil XMP/EXPO inestable o por hardware defectuoso.',
        nextStep: 'Paso 13: Traspaso a RAM física',
        safetyLevel: 'USUARIO',
      };
      break;

    case 13:
      simpleExplanation = 'El procesador abandona el uso de la memoria provisional interna y transfiere la ejecución del sistema a la memoria RAM principal.';
      technicalDetail = 'Sincronización de enlaces de alta velocidad con el Chipset (PCH). Cierre de Cache-as-RAM y migración del stack a memoria DRAM física.',
      signalTraveling = 'Fase DXE de UEFI → Enlace CPU-Chipset → PCH & Controladoras Secundarias';
      visibleSymptoms = 'El código del firmware se ejecuta ahora a máxima velocidad desde la memoria RAM física.';
      whatToVerify = [
        '1. Comprobar que el disipador del Chipset (PCH) no presente temperaturas anormalmente elevadas.',
        '2. Descartar cortocircuitos en puertos periféricos (SATA / USB traseros).',
        '3. Verificar que la memoria RAM mantenga estabilidad en ejecución continua.',
      ];
      structuredVerification = {
        testName: 'Inspección térmica y funcional del Chipset (PCH)',
        objective: 'Confirmar que el concentrador de plataforma responda a la sincronización con el CPU.',
        tools: 'Inspección táctil/visual de fijación del disipador del chipset.',
        procedure: 'Comprobar el montaje firme del disipador del chipset con el equipo apagado.',
        expectedResult: 'Enlace de comunicación establecido sin sobrecalentamiento.',
        ifCorrect: 'Avanzar al Paso 14 (Enumeración de buses PCIe).',
        ifIncorrect: 'Falla en chipset o interfaz térmica degradada.',
        whatItProves: 'Diferencia un problema de chipset de una falla en el procesador central.',
        nextStep: 'Paso 14: Scanning de buses PCIe',
        safetyLevel: 'USUARIO',
      };
      break;

    case 14:
      simpleExplanation = 'La placa base explora todas sus ranuras de expansión para identificar qué tarjetas accesorias o placas están conectadas.';
      technicalDetail = 'El despachador DXE recorre el árbol de buses PCIe (Bus/Device/Function) asignando espacios MMIO e interrupciones a cada dispositivo.',
      signalTraveling = 'PCI Host Bridge Driver UEFI → Árbol de Buses PCIe → Ranuras de Expansión & M.2';
      visibleSymptoms = 'Detección secuencial de tarjetas gráficas, controladoras y adaptadores de red/sonido.';
      whatToVerify = [
        '1. Retirar todas las tarjetas de expansión accesorias dejando únicamente la GPU principal.',
        '2. Inspeccionar que las ranuras PCIe no tengan suciedad ni pines doblados.',
        '3. Comprobar que la placa de video esté asentada con la traba plástica encajada.',
      ];
      structuredVerification = {
        testName: 'Descarte por retiro de tarjetas de expansión secundarias',
        objective: 'Eliminar conflictos de asignación MMIO provocados por placas accesorias defectuosas.',
        tools: 'Destornillador aislado e inspección visual con equipo apagado.',
        procedure: 'Desconectar placas capturadoras, sonido o adaptadores de los slots PCIe secundarios.',
        expectedResult: 'El sistema supera la enumeración de buses sin bloqueos.',
        ifCorrect: 'Avanzar al Paso 15 (Inicialización de salida de video GOP).',
        ifIncorrect: 'Conflicto en la ranura principal o en la propia tarjeta gráfica.',
        whatItProves: 'Aísla si una tarjeta accesoria secundaria era la causante del cuelgue.',
        nextStep: 'Paso 15: Inicialización GPU (GOP)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 15:
      simpleExplanation = 'Se enciende la tarjeta gráfica (integrada o dedicada) y se envía la primera señal de imagen al monitor.';
      technicalDetail = 'El firmware ejecuta el controlador GOP (Graphics Output Protocol) del VBIOS de la GPU y configura el Framebuffer de salida.',
      signalTraveling = 'UEFI Video DXE Driver → GPU (GOP / VBIOS) → Salida DisplayPort / HDMI → Monitor';
      visibleSymptoms = 'El monitor despierta de reposo y muestra el logo de la placa madre o texto de diagnóstico.';
      whatToVerify = [
        '1. Comprobar que el cable de video esté conectado a la tarjeta gráfica dedicada (si el CPU no tiene iGPU).',
        '2. Verificar conectores de alimentación auxiliar PCIe en la placa de video.',
        '3. Probar con otro cable DisplayPort o HDMI y verificar selector de entrada en el monitor.',
      ];
      structuredVerification = {
        testName: 'Verificación de conexiones de video y alimentación de GPU',
        objective: 'Asegurar que la tarjeta gráfica reciba energía y entregue señal de sincronismo al monitor.',
        tools: 'Inspección visual de conectores PCIe auxiliares y cable de pantalla.',
        procedure: 'Comprobar cable de video en la salida correcta y cables de energía firmemente conectados.',
        expectedResult: 'El monitor muestra el logo del fabricante o pantalla de inicio.',
        ifCorrect: 'Avanzar al Paso 16 (Inicialización de controladores de almacenamiento).',
        ifIncorrect: 'Revisar alimentación de la GPU o probar salida integrada si existe.',
        whatItProves: 'Distingue una PC que no da video de una que no arranca por completo.',
        nextStep: 'Paso 16: Controladores de almacenamiento',
        safetyLevel: 'USUARIO',
      };
      break;

    case 16:
      simpleExplanation = 'El firmware inicializa los circuitos controladores para poder comunicarse con los discos SSD y discos duros.';
      technicalDetail = 'Carga de controladores DXE para el protocolo NVMe (PCIe) y para la controladora SATA (AHCI). Creación de colas de comandos I/O.',
      signalTraveling = 'UEFI NVMe / AHCI Drivers → Controladora de Disco → Preparación de Colas I/O';
      visibleSymptoms = 'Las controladoras de almacenamiento quedan en estado listas para consultar las unidades.';
      whatToVerify = [
        '1. Si la máquina se congela antes de entrar a BIOS, retirar temporalmente el SSD M.2.',
        '2. Comprobar que el SSD M.2 esté correctamente fijado con su tornillo o traba plástica.',
        '3. Probar la unidad en otra ranura M.2 si la placa dispone de más de un puerto.',
      ];
      structuredVerification = {
        testName: 'Aislamiento de unidades de almacenamiento masivo',
        objective: 'Comprobar si una unidad en cortocircuito bloquea la inicialización de buses de almacenamiento.',
        tools: 'Destornillador pequeño para slot M.2 con equipo apagado.',
        procedure: 'Retirar la unidad SSD M.2 y encender el equipo para comprobar si accede al BIOS.',
        expectedResult: 'Acceso limpio y fluido al menú de configuración UEFI.',
        ifCorrect: 'Avanzar al Paso 17 (Detección física de medios de almacenamiento).',
        ifIncorrect: 'Falla en la propia placa base o líneas PCIe del zócalo.',
        whatItProves: 'Determina si un SSD con controlador dañado colgaba la secuencia de inicio.',
        nextStep: 'Paso 17: Detección física de unidades',
        safetyLevel: 'USUARIO',
      };
      break;

    case 17:
      simpleExplanation = 'La placa base pregunta a cada disco su modelo, capacidad y estado de salud para confirmar que están conectados físicamente.';
      technicalDetail = 'Envío de comandos Identify Device / NVMe Identify Controller. Registro de modelo, número de serie, tamaño LBA y parámetros S.M.A.R.T.',
      signalTraveling = 'Subcapa de Almacenamiento UEFI ↔ Consultas Identify ↔ Firmware del Disco / SSD';
      visibleSymptoms = 'Los discos aparecen listados por su nombre comercial y capacidad en la sección de hardware de la BIOS.';
      whatToVerify = [
        '1. Ingresar al Setup UEFI y verificar si el SSD figura detectado físicamente con su nombre correcto.',
        '2. Si aparece con 0 MB o nombre genérico, su firmware interno puede estar en modo recuperación.',
        '3. En discos SATA, verificar tanto el cable de datos como el conector de energía.',
      ];
      structuredVerification = {
        testName: 'Comprobación de detección física en el Setup UEFI',
        objective: 'Verificar la presencia y reconocimiento físico del medio de almacenamiento.',
        tools: 'Menú de configuración UEFI / BIOS Setup.',
        procedure: 'Ingresar al BIOS pulsando Del/F2 y revisar la sección de almacenamiento.',
        expectedResult: 'SSD/HDD reconocido con su capacidad y modelo de fábrica.',
        ifCorrect: 'Avanzar al Paso 18 (Inicialización de puertos USB y seguridad TPM).',
        ifIncorrect: 'Revisar conexión física, cable SATA o sustituir unidad no detectada.',
        whatItProves: 'Confirma la integridad física del medio antes de evaluar archivos de arranque.',
        nextStep: 'Paso 18: USB & TPM',
        safetyLevel: 'USUARIO',
      };
      break;

    case 18:
      simpleExplanation = 'Se encienden los puertos USB para reconocer teclado y mouse, y se activa el chip de seguridad (TPM 2.0).';
      technicalDetail = 'Inicialización del controlador xHCI (USB), enumeración de dispositivos HID y sincronización con el coprocesador de seguridad TPM/fTPM.',
      signalTraveling = 'UEFI xHCI & TPM Drivers → Puertos USB & Bus de Seguridad → Teclado/Mouse & TPM';
      visibleSymptoms = 'Las luces del teclado responden y el cursor del mouse puede moverse en el Setup UEFI.';
      whatToVerify = [
        '1. Si el equipo se congela en el logo, desconectar periféricos USB externos no esenciales.',
        '2. Inspeccionar puertos USB del gabinete por posibles pines doblados haciendo contacto con el chasis.',
        '3. Si se cambió de procesador, confirmar solicitud de reinicio de claves fTPM en pantalla.',
      ];
      structuredVerification = {
        testName: 'Descarte de sobrecorriente en puertos USB y accesorios',
        objective: 'Eliminar bloqueos causados por puertos USB en cortocircuito o periféricos dañados.',
        tools: 'Inspección visual de puertos USB externos y desconexión de cables frontales.',
        procedure: 'Desconectar accesorios USB secundarios y revisar que no haya lengüetas plásticas rotas.',
        expectedResult: 'El teclado responde con normalidad y el POST continúa.',
        ifCorrect: 'Avanzar al Paso 19 (Certificación final del POST).',
        ifIncorrect: 'Desconectar header USB frontal de la placa madre.',
        whatItProves: 'Diferencia un problema de placa de un cortocircuito mecánico en puertos USB.',
        nextStep: 'Paso 19: Certificación POST SUCCESS',
        safetyLevel: 'USUARIO',
      };
      break;

    case 19:
      simpleExplanation = 'La computadora certifica que todo el hardware básico funciona y da por terminado el auto-diagnóstico (POST).';
      technicalDetail = 'El POST Master de la UEFI valida el estado de todos los subsistemas. Los LEDs de diagnóstico se apagan y se transfiere el control a la capa BDS.',
      signalTraveling = 'POST Master UEFI → Validación de Subsistemas → Reporte POST SUCCESS';
      visibleSymptoms = 'Los LEDs de diagnóstico de la placa se apagan. En placas con altavoz puede escucharse un beep corto de éxito.';
      whatToVerify = [
        '1. Confirmar que los 4 testigos de diagnóstico (CPU, DRAM, VGA, BOOT) completen su ciclo.',
        '2. Si el LED de BOOT queda encendido, indica que el hardware está sano pero falta medio de arranque.',
        '3. Verificar que la pantalla pase de la etapa de hardware a la búsqueda del sistema operativo.',
      ];
      structuredVerification = {
        testName: 'Auditoría de testigos luminosos de diagnóstico (Debug LEDs)',
        objective: 'Confirmar que todos los chequeos de hardware físico se hayan completado satisfactoriamente.',
        tools: 'Inspección visual del panel de LEDs de la placa base.',
        procedure: 'Observar la secuencia de apagado de los LEDs: CPU -> DRAM -> VGA -> BOOT.',
        expectedResult: 'Todos los LEDs de hardware se apagan, indicando éxito del POST.',
        ifCorrect: 'Avanzar al Paso 20 (Selección de dispositivo de arranque BDS).',
        ifIncorrect: 'Focalizar el diagnóstico en el componente cuyo LED quede encendido fijo.',
        whatItProves: 'Demuestra que todo el hardware esencial funciona antes de buscar el sistema operativo.',
        nextStep: 'Paso 20: Selección de orden de arranque',
        safetyLevel: 'USUARIO',
      };
      break;

    case 20:
      simpleExplanation = 'La placa base consulta su memoria de configuración para saber desde qué disco debe arrancar Windows.';
      technicalDetail = 'Fase BDS (Boot Device Selection): Lectura de variables NVRAM (BootOrder y Boot####) para determinar la prioridad de arranque configurada.',
      signalTraveling = 'UEFI BDS Dispatcher → Variables BootOrder en NVRAM → Selección de Dispositivo Primario';
      visibleSymptoms = 'El sistema elige la entrada de arranque "Windows Boot Manager" para iniciar la carga.';
      whatToVerify = [
        '1. Entrar al BIOS y comprobar que "Windows Boot Manager" figure en el primer lugar de prioridad.',
        '2. Verificar que el modo UEFI nativo esté activado (desactivar CSM si la instalación es GPT).',
        '3. Si la configuración se borra tras apagar la zapatilla, comprobar la pila botón CR2032.',
      ];
      structuredVerification = {
        testName: 'Configuración de prioridad de arranque en BIOS Setup',
        objective: 'Asegurar que el firmware apunte a la entrada de arranque correcta del sistema operativo.',
        tools: 'Setup del BIOS / Menú de configuración.',
        procedure: 'Revisar la pestaña Boot y ubicar "Windows Boot Manager" como primera opción.',
        expectedResult: 'Guardar configuración (F10) e iniciar el gestor de arranque de Windows.',
        ifCorrect: 'Avanzar al Paso 21 (Montaje de la partición EFI).',
        ifIncorrect: 'Reordenar prioridades o regenerar la entrada NVRAM.',
        whatItProves: 'Distingue una falla de disco roto de una simple desconfiguración en el orden de inicio.',
        nextStep: 'Paso 21: Montaje de partición EFI',
        safetyLevel: 'USUARIO',
      };
      break;

    case 21:
      simpleExplanation = 'La placa base abre la pequeña partición de arranque (Partición EFI) para buscar el programa iniciador de Windows.';
      technicalDetail = 'El controlador de sistema de archivos FAT de UEFI monta la ESP (EFI System Partition FAT32) y localiza \\EFI\\Microsoft\\Boot\\bootmgfw.efi.',
      signalTraveling = 'UEFI FAT Driver → Partición EFI FAT32 → Archivo \\EFI\\Microsoft\\Boot\\bootmgfw.efi';
      visibleSymptoms = 'Acceso a la partición de sistema sin errores de particionamiento.';
      whatToVerify = [
        '1. Si aparece "No bootable device found", comprobar con medio de instalación si existe la partición EFI.',
        '2. Verificar con la herramienta diskpart que la partición EFI (100 MB FAT32) esté presente.',
        '3. Reparar la partición con el comando "bcdboot C:\\Windows /s S: /f UEFI" desde consola.',
      ];
      structuredVerification = {
        testName: 'Auditoría de la partición de sistema EFI (ESP)',
        objective: 'Comprobar la existencia e integridad de la partición FAT32 que aloja los archivos EFI.',
        tools: 'Medio de instalación USB de Windows y símbolo del sistema (Shift+F10).',
        procedure: 'Ejecutar diskpart -> list volume para verificar la presencia de la partición EFI.',
        expectedResult: 'Partición de 100 MB en formato FAT32 identificada en el disco de sistema.',
        ifCorrect: 'Avanzar al Paso 22 (Ejecución de Windows Boot Manager).',
        ifIncorrect: 'Regenerar la partición EFI y los archivos de arranque con bcdboot.',
        whatItProves: 'Diferencia una partición eliminada de un problema físico en la unidad de almacenamiento.',
        nextStep: 'Paso 22: Windows Boot Manager',
        safetyLevel: 'USUARIO',
      };
      break;

    case 22:
      simpleExplanation = 'El Gestor de Arranque de Windows (Boot Manager) lee el archivo de configuración BCD y comprueba la seguridad de inicio (Secure Boot).';
      technicalDetail = 'bootmgfw.efi procesa el almacén BCD (Boot Configuration Data), valida firmas digitales con las claves Secure Boot y localiza winload.efi.',
      signalTraveling = 'bootmgfw.efi → Almacén BCD binario → Validación Secure Boot → Localización de winload.efi';
      visibleSymptoms = 'Transición hacia la carga del cargador del sistema operativo.';
      whatToVerify = [
        '1. Si aparece pantalla azul 0xc000000e o 0xc0000034, el archivo BCD tiene rutas desactualizadas.',
        '2. Ejecutar "bootrec /rebuildbcd" o "bcdboot" desde entorno de recuperación para reconstruir el BCD.',
        '3. Si hay error de firma digital, auditar claves de Secure Boot en el BIOS.',
      ];
      structuredVerification = {
        testName: 'Reconstrucción del almacén de configuración de arranque (BCD)',
        objective: 'Reparar las rutas y descriptores de arranque dañados en el archivo BCD.',
        tools: 'Consola de comandos en entorno de recuperación WinRE.',
        procedure: 'Ejecutar bcdboot C:\\Windows /l es-es para generar un almacén BCD limpio.',
        expectedResult: 'Mensaje "Archivos de arranque creados correctamente".',
        ifCorrect: 'Avanzar al Paso 23 (Cargador winload.efi).',
        ifIncorrect: 'Verificar la letra asignada a la partición de Windows con diskpart.',
        whatItProves: 'Demuestra que los archivos de configuración de arranque son coherentes.',
        nextStep: 'Paso 23: winload.efi',
        safetyLevel: 'USUARIO',
      };
      break;

    case 23:
      simpleExplanation = 'El cargador winload.efi prepara la memoria, lee el Registro de Windows (SYSTEM) y alista el terreno para despertar el Kernel.';
      technicalDetail = 'winload.efi activa el direccionamiento paginado de 64 bits, carga en RAM la colmena SYSTEM del Registro y construye el LoaderBlock.',
      signalTraveling = 'winload.efi → C:\\Windows\\System32\\config\\SYSTEM → Mapeo de Tablas de Páginas en RAM';
      visibleSymptoms = 'La computadora pasa formalmente del entorno de firmware al entorno de sistema operativo.';
      whatToVerify = [
        '1. Si arroja error en System32\\config\\system, la colmena del Registro puede estar dañada.',
        '2. Ejecutar "chkdsk C: /f" para reparar posibles inconsistencias del sistema de archivos NTFS.',
        '3. Ejecutar SFC desde entorno de recuperación para verificar la integridad de winload.efi.',
      ];
      structuredVerification = {
        testName: 'Comprobación de integridad de archivos de inicio y Registro',
        objective: 'Verificar que la colmena SYSTEM y el binario winload.efi no estén corruptos.',
        tools: 'Consola de recuperación WinRE (chkdsk y sfc /scannow).',
        procedure: 'Ejecutar sfc /scannow /offbootdir=C:\\ /offwindir=C:\\Windows en la consola.',
        expectedResult: 'Reparación de archivos dañados o verificación limpia al 100%.',
        ifCorrect: 'Avanzar al Paso 24 (Carga de ntoskrnl.exe y fin de servicios UEFI).',
        ifIncorrect: 'Restaurar copia de seguridad del Registro o reinstalar sistema.',
        whatItProves: 'Confirma la integridad de los binarios esenciales previos al inicio del kernel.',
        nextStep: 'Paso 24: Carga del Kernel NT',
        safetyLevel: 'USUARIO',
      };
      break;

    case 24:
      simpleExplanation = 'Se carga en memoria el núcleo maestro de Windows (ntoskrnl.exe) y se apaga definitivamente el firmware UEFI (ExitBootServices).';
      technicalDetail = 'winload.efi carga ntoskrnl.exe y hal.dll en memoria física. Invoca ExitBootServices() en la UEFI; a partir de este instante el kernel toma el control absoluto.',
      signalTraveling = 'winload.efi → RAM → ntoskrnl.exe & hal.dll → ExitBootServices()';
      visibleSymptoms = 'La pantalla del firmware se desvanece y comienza el control del sistema operativo.';
      whatToVerify = [
        '1. Si el equipo se reinicia abruptamente aquí, comprobar estabilidad de memoria RAM.',
        '2. Descartar sectores defectuosos en el disco donde residen los binarios de Windows.',
        '3. Comprobar que no existan perfiles de overclock inestables en el procesador.',
      ];
      structuredVerification = {
        testName: 'Diagnóstico de estabilidad de memoria durante la carga del kernel',
        objective: 'Confirmar que la memoria RAM pueda sostener las estructuras de datos del núcleo de Windows.',
        tools: 'Herramienta de diagnóstico de memoria de Windows o MemTest86.',
        procedure: 'Ejecutar un test de memoria para verificar ausencia de errores de bit.',
        expectedResult: 'Cero errores de memoria detectados en los pases de prueba.',
        ifCorrect: 'Avanzar al Paso 25 (Inicialización de la capa HAL).',
        ifIncorrect: 'Reemplazar módulo de RAM inestable o ajustar frecuencias.',
        whatItProves: 'Determina si los reinicios tempranos se deben a celdas de RAM defectuosas.',
        nextStep: 'Paso 25: Capa HAL',
        safetyLevel: 'USUARIO',
      };
      break;

    case 25:
      simpleExplanation = 'La capa de abstracción de hardware (HAL) adapta el sistema operativo a la placa madre concreta y sincroniza los relojes de cómputo.';
      technicalDetail = 'hal.dll toma el control de los controladores de interrupción APIC / IO-APIC, temporizadores HPET y tablas ACPI de gestión de energía.',
      signalTraveling = 'hal.dll → Controladores APIC / HPET → Sincronización de Tablas ACPI de la Motherboard';
      visibleSymptoms = 'El sistema operativo gobierna la sincronización de hardware con independencia del fabricante.';
      whatToVerify = [
        '1. Si aparece BSOD HAL_INITIALIZATION_FAILED (0x5C) o ACPI_BIOS_ERROR (0xA5), actualizar la BIOS.',
        '2. Restablecer valores de fábrica en BIOS para evitar tablas ACPI personalizadas corruptas.',
        '3. Deshabilitar opciones experimentales de virtualización o energía en el setup.',
      ];
      structuredVerification = {
        testName: 'Actualización y restablecimiento de tablas ACPI en BIOS',
        objective: 'Asegurar que la motherboard entregue descriptores ACPI válidos a la capa HAL de Windows.',
        tools: 'Setup UEFI y actualización de firmware oficial.',
        procedure: 'Cargar valores optimizados por defecto (Load Optimized Defaults) en el BIOS.',
        expectedResult: 'Inicialización limpia de la capa HAL sin pantallas azules.',
        ifCorrect: 'Avanzar al Paso 26 (Carga de controladores indispensables BOOT_START).',
        ifIncorrect: 'Actualizar a la última versión de BIOS estable del fabricante.',
        whatItProves: 'Descarta incompatibilidades entre la capa HAL de Windows y las tablas ACPI de la placa.',
        nextStep: 'Paso 26: Drivers BOOT_START',
        safetyLevel: 'USUARIO',
      };
      break;

    case 26:
      simpleExplanation = 'Windows carga los controladores indispensables de disco (stornvme, storahci, ntfs) para poder leer su propia partición C:.';
      technicalDetail = 'Carga de drivers con Start=0 (BOOT_START). Montaje del sistema de archivos NTFS para permitir operaciones nativas de lectura/escritura.',
      signalTraveling = 'Kernel Loader → C:\\Windows\\System32\\drivers\\ (stornvme.sys / storahci.sys) → Montaje de C:\\';
      visibleSymptoms = 'Comienza la animación de los puntos girando bajo el logo en pantalla.';
      whatToVerify = [
        '1. Si aparece BSOD 0x7B (INACCESSIBLE_BOOT_DEVICE), verificar el modo de la controladora en BIOS (AHCI/VMD).',
        '2. Si se cambió de placa madre, arrancar en Modo Seguro para que Windows instale el driver adecuado.',
        '3. Descartar antivirus o controladores de filtro de terceros dañados.',
      ];
      structuredVerification = {
        testName: 'Ajuste del modo de controladora de almacenamiento en BIOS',
        objective: 'Hacer coincidir el modo de la controladora (AHCI vs Intel VMD/RAID) con la instalación original.',
        tools: 'Setup UEFI (sección Storage Configuration).',
        procedure: 'Verificar si la opción VMD o RAID está activa y alternar a AHCI/NVMe estándar.',
        expectedResult: 'Windows monta el disco C: y avanza sin pantalla azul 0x7B.',
        ifCorrect: 'Avanzar al Paso 27 (Inicialización completa del Kernel).',
        ifIncorrect: 'Inyectar el controlador de almacenamiento mediante consola WinRE.',
        whatItProves: 'Demuestra si la falla era un desajuste de driver de almacenamiento en el arranque.',
        nextStep: 'Paso 27: Proceso System (PID 4)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 27:
      simpleExplanation = 'El núcleo de Windows se inicializa por completo, activa las interrupciones y crea el proceso maestro "System" (PID 4).';
      technicalDetail = 'Ejecución de KiSystemStartup(), inicialización de Fase 0 y Fase 1 del Kernel, y creación del proceso System (PID 4) con sus hilos de trabajo.',
      signalTraveling = 'ntoskrnl.exe → Inicialización de Subsistemas de Kernel → Creación de Proceso System (PID 4)';
      visibleSymptoms = 'Animación de puntos girando con fluidez en pantalla.';
      whatToVerify = [
        '1. Si hay pantallas azules aleatorias durante los puntos girando, sospechar de memoria RAM inestable.',
        '2. Descartar sobrecalentamiento del CPU revisando que el disipador esté correctamente colocado.',
        '3. Arrancar en Modo Seguro para aislar si el fallo ocurre en controladores de terceros.',
      ];
      structuredVerification = {
        testName: 'Comprobación de booteo en Modo Seguro',
        objective: 'Aislar si la inestabilidad del kernel proviene de drivers de terceros o de hardware básico.',
        tools: 'Menú de opciones de inicio avanzadas de Windows (Modo Seguro).',
        procedure: 'Forzar acceso al entorno de recuperación y seleccionar "Habilitar Modo Seguro".',
        expectedResult: 'Arranque exitoso en Modo Seguro confirmando que el núcleo básico está sano.',
        ifCorrect: 'Avanzar al Paso 28 (Session Manager Subsystem smss.exe).',
        ifIncorrect: 'Revisar hardware principal (RAM/CPU/Almacenamiento).',
        whatItProves: 'Diferencia un conflicto de controladores de una avería en el procesador o memoria.',
        nextStep: 'Paso 28: Session Manager (smss.exe)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 28:
      simpleExplanation = 'Se inicia el Gestor de Sesiones (smss.exe), que monta el archivo de memoria virtual y crea los espacios para servicios y usuarios.';
      technicalDetail = 'smss.exe crea variables de entorno del sistema, inicializa pagefile.sys y bifurca el entorno en Sesión 0 (servicios) y Sesión 1 (usuario interactivo).';
      signalTraveling = 'Proceso System (PID 4) → C:\\Windows\\System32\\smss.exe → Creación de Sesión 0 y Sesión 1';
      visibleSymptoms = 'El sistema prepara la separación entre servicios protegidos y la pantalla de usuario.';
      whatToVerify = [
        '1. Si aparece BSOD 0xC000021A, un proceso crítico del subsistema de usuario fue terminado.',
        '2. Verificar que la unidad C: tenga espacio libre suficiente para alojar el archivo de paginación.',
        '3. Ejecutar comprobación SFC para descartar corrupción en smss.exe.',
      ];
      structuredVerification = {
        testName: 'Auditoría de espacio en disco y archivos del subsistema de sesión',
        objective: 'Asegurar que el volumen de sistema tenga capacidad para crear la memoria virtual pagefile.sys.',
        tools: 'Símbolo del sistema en WinRE.',
        procedure: 'Comprobar espacio libre en C: con dir C:\\ y ejecutar chkdsk si existen errores.',
        expectedResult: 'Espacio libre superior a 5 GB y archivos de subsistema íntegros.',
        ifCorrect: 'Avanzar al Paso 29 (Subsistemas Win32 de Sesión 0).',
        ifIncorrect: 'Liberar espacio eliminando archivos temporales desde la consola.',
        whatItProves: 'Descarta que la falta de espacio en disco bloquee el montaje de sesiones.',
        nextStep: 'Paso 29: Subsistema Win32 (csrss / win32k)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 29:
      simpleExplanation = 'Se cargan los componentes gráficos y de control de Sesión 0 (csrss, win32k, wininit) para habilitar el entorno de ventanas.';
      technicalDetail = 'smss.exe lanza csrss.exe y wininit.exe en Sesión 0. win32k.sys se vincula con el driver de video para conmutar a la resolución nativa de pantalla.',
      signalTraveling = 'smss.exe (Sesión 0) → csrss.exe & wininit.exe → win32k.sys enlazado con Driver de GPU';
      visibleSymptoms = 'La resolución de pantalla cambia momentáneamente de escala al conmutar al driver de video.';
      whatToVerify = [
        '1. Si la pantalla queda en negro justo aquí, el driver de video instalado está en conflicto.',
        '2. Iniciar en Modo Seguro y utilizar DDU (Display Driver Uninstaller) para limpiar el driver gráfico.',
        '3. Reinstalar el controlador gráfico oficial más reciente desde la web del fabricante.',
      ];
      structuredVerification = {
        testName: 'Limpieza y reinstalación limpia de controladores de video con DDU',
        objective: 'Eliminar controladores gráficos corruptos que provocan pantalla negra al cargar win32k.sys.',
        tools: 'Modo Seguro y software Display Driver Uninstaller (DDU).',
        procedure: 'Arrancar en Modo Seguro, ejecutar DDU y reiniciar en modo normal con driver básico.',
        expectedResult: 'Arranque con resolución básica limpia sin pantallas negras.',
        ifCorrect: 'Avanzar al Paso 30 (Service Control Manager services.exe).',
        ifIncorrect: 'Revisar la salida física del monitor o sospechar de la GPU.',
        whatItProves: 'Demuestra si la pantalla negra era causada por el driver gráfico o por hardware.',
        nextStep: 'Paso 30: Servicios del sistema (services.exe)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 30:
      simpleExplanation = 'Se inicia el Administrador de Servicios (services.exe) y el subsistema de seguridad (lsass.exe) para levantar los procesos de fondo.';
      technicalDetail = 'wininit.exe ejecuta services.exe (SCM) y lsass.exe. El SCM lanza instancias de svchost.exe para servicios automáticos (Audio, Red, PlugPlay).';
      signalTraveling = 'wininit.exe → services.exe (SCM) & lsass.exe → Instancias de svchost.exe';
      visibleSymptoms = 'Los servicios de red, audio y administración de dispositivos quedan listos en segundo plano.';
      whatToVerify = [
        '1. Si los puntos giran indefinidamente, un servicio de terceros puede estar bloqueando el inicio.',
        '2. Iniciar en Modo Seguro y revisar el Visor de Eventos (eventvwr.msc) por errores de timeout (7000/7009).',
        '3. Utilizar msconfig para realizar un inicio limpio deshabilitando servicios no esenciales.',
      ];
      structuredVerification = {
        testName: 'Diagnóstico de inicio limpio de servicios con MSCONFIG',
        objective: 'Aislar servicios de terceros que bloquean la inicialización del Service Control Manager.',
        tools: 'Herramienta msconfig en Modo Seguro.',
        procedure: 'Ocultar todos los servicios de Microsoft y deshabilitar los servicios de terceros restantes.',
        expectedResult: 'Arranque fluido y rápido sin demoras en la animación de carga.',
        ifCorrect: 'Avanzar al Paso 31 (Sesión interactiva winlogon & LogonUI).',
        ifIncorrect: 'Revisar servicios esenciales del sistema operativo con SFC.',
        whatItProves: 'Diferencia un servicio de terceros atascado de una falla en Windows.',
        nextStep: 'Paso 31: Sesión interactiva y LogonUI',
        safetyLevel: 'USUARIO',
      };
      break;

    case 31:
      simpleExplanation = 'Se crea la sesión del usuario, se arranca el compositor visual (DWM) y aparece la pantalla de bienvenida o bloqueo (LogonUI).';
      technicalDetail = 'smss.exe crea la Sesión 1 interactiva. winlogon.exe inicia dwm.exe (Desktop Window Manager acelerado) y ejecuta LogonUI.exe.';
      signalTraveling = 'smss.exe (Sesión 1) → winlogon.exe → dwm.exe (Compositor GPU) & LogonUI.exe';
      visibleSymptoms = 'Aparición nítida de la pantalla de bienvenida o bloqueo con campo para ingresar clave o PIN.';
      whatToVerify = [
        '1. Si la pantalla de bienvenida parpadea, desinstalar programas de personalización visual de terceros.',
        '2. Si no aparece el cuadro de contraseña, arrancar en Modo Seguro con funciones de red.',
        '3. Descartar conflictos con lectores de huella o cámaras de reconocimiento facial.',
      ];
      structuredVerification = {
        testName: 'Comprobación del subsistema de inicio de sesión en Modo Seguro',
        objective: 'Verificar la capacidad del sistema para presentar la interfaz de autenticación interactiva.',
        tools: 'Opciones de inicio avanzadas / Modo Seguro.',
        procedure: 'Iniciar sesión con una cuenta de administrador local en Modo Seguro.',
        expectedResult: 'Acceso a la pantalla de bienvenida con campo de credenciales operativo.',
        ifCorrect: 'Avanzar al Paso 32 (Autenticación y carga de perfil de usuario).',
        ifIncorrect: 'Reparar subsistema Winlogon desde símbolo del sistema.',
        whatItProves: 'Demuestra si la falla era por proveedores de credenciales de terceros.',
        nextStep: 'Paso 32: Autenticación y perfil de usuario',
        safetyLevel: 'USUARIO',
      };
      break;

    case 32:
      simpleExplanation = 'El usuario ingresa su contraseña/PIN, la seguridad valida los datos y se carga su configuración personal (NTUSER.DAT).';
      technicalDetail = 'winlogon envía las credenciales a lsass.exe. Tras validarse, ProfSvc monta la colmena C:\\Users\\Usuario\\NTUSER.DAT en HKEY_CURRENT_USER.';
      signalTraveling = 'Usuario ingresa credenciales → winlogon.exe → Validación LSASS → ProfSvc monta NTUSER.DAT';
      visibleSymptoms = 'Mensaje "Bienvenido" o "Cargando perfil de usuario" en pantalla.';
      whatToVerify = [
        '1. Si aparece "Has iniciado sesión con un perfil temporal", el archivo NTUSER.DAT no pudo montarse.',
        '2. Revisar el Registro en HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList.',
        '3. Si existe una clave duplicada con extensión .bak, restaurar el puntero del perfil.',
      ];
      structuredVerification = {
        testName: 'Reparación de puntero de perfil en el Registro de Windows',
        objective: 'Restablecer el acceso a la cuenta de usuario principal eliminando la clave .bak del perfil.',
        tools: 'Editor del Registro (regedit.exe) desde cuenta con permisos de administrador.',
        procedure: 'Revisar ProfileList, eliminar la clave temporal y quitar la extensión .bak de la clave original.',
        expectedResult: 'Inicio de sesión exitoso con el perfil de usuario personal completo.',
        ifCorrect: 'Avanzar al Paso 33 (Lanzamiento del Shell explorer.exe).',
        ifIncorrect: 'Crear un nuevo perfil de usuario local y transferir los datos personales.',
        whatItProves: 'Distingue una pérdida de archivos de un error de bloqueo en NTUSER.DAT.',
        nextStep: 'Paso 33: Lanzamiento del Shell explorer.exe',
        safetyLevel: 'USUARIO',
      };
      break;

    case 33:
      simpleExplanation = 'Se ejecuta el programa del escritorio (explorer.exe), apareciendo la barra de tareas, el menú inicio y los iconos de trabajo.';
      technicalDetail = 'userinit.exe lee la clave de Registro "Shell" (HKLM\\Software\\...\\Winlogon) y ejecuta C:\\Windows\\explorer.exe bajo el token de usuario autenticado.',
      signalTraveling = 'winlogon / userinit → Consulta de clave "Shell" en Registro → Ejecución de explorer.exe';
      visibleSymptoms = 'Despliegue interactivo de la barra de tareas, bandeja de sistema y área de escritorio.';
      whatToVerify = [
        '1. Si la pantalla queda en negro tras el mensaje Bienvenido pero el cursor se mueve, presionar Ctrl+Shift+Esc.',
        '2. En el Administrador de Tareas, ir a Archivo -> Ejecutar nueva tarea y escribir "explorer.exe".',
        '3. Si el escritorio abre manualmente, restaurar el valor de la clave Shell a "explorer.exe" en Winlogon.',
      ];
      structuredVerification = {
        testName: 'Lanzamiento manual y verificación de la clave Shell de explorer.exe',
        objective: 'Comprobar si el proceso del explorador responde a comandos y restaurar su autoinicio.',
        tools: 'Teclado (Ctrl+Shift+Esc / Administrador de Tareas) y Editor del Registro.',
        procedure: 'Ejecutar explorer.exe manualmente y comprobar el valor "Shell" en Winlogon.',
        expectedResult: 'Aparición inmediata del escritorio, barra de tareas e iconos de usuario.',
        ifCorrect: 'Avanzar al Paso 34 (Sistema operativo 100% listo en reposo activo).',
        ifIncorrect: 'Revisar extensiones de shell de terceros con la herramienta ShellExView.',
        whatItProves: 'Diferencia un bloqueo completo de Windows de un simple fallo de lanzamiento del shell.',
        nextStep: 'Paso 34: Sistema 100% Operativo en Reposo (Idle)',
        safetyLevel: 'USUARIO',
      };
      break;

    case 34:
      simpleExplanation = 'La secuencia de arranque se ha completado con éxito: la computadora se encuentra lista para trabajar en estado de reposo activo.';
      technicalDetail = 'Todos los subsistemas de Hardware, Firmware, Kernel, Servicios y Shell se encuentran sincronizados y estables en estado Idle.',
      signalTraveling = 'Todos los Subsistemas Sincronizados // Estado de Reposo Activo (CPU Idle & DWM)';
      visibleSymptoms = 'Escritorio responsivo, uso de CPU bajo (<5% en reposo) y memoria disponible normal.';
      whatToVerify = [
        '1. Abrir el Administrador de Tareas y verificar que ningún proceso parásito consuma CPU en reposo.',
        '2. Comprobar que las temperaturas de procesador y placa gráfica se mantengan en niveles óptimos.',
        '3. Verificar la ausencia de errores críticos en el Visor de Eventos de Windows.',
      ];
      structuredVerification = {
        testName: 'Auditoría de estado de reposo activo y rendimiento del sistema',
        objective: 'Certificar que la computadora opera de manera estable sin procesos no deseados ni demoras DPC.',
        tools: 'Administrador de Tareas (Ctrl+Shift+Esc) y Monitor de Rendimiento.',
        procedure: 'Monitorear uso de CPU, memoria y temperaturas en reposo durante 2 minutos.',
        expectedResult: 'Uso de procesador bajo, frecuencias dinámicas y sistema 100% responsivo.',
        ifCorrect: 'Secuencia completa de 35 eslabones superada con éxito.',
        ifIncorrect: 'Optimizar programas de inicio y auditar controladores de fondo.',
        whatItProves: 'Demuestra la salud integral de la computadora desde el botón POWER hasta Windows.',
        nextStep: 'Secuencia Completada con Éxito (35/35 Estados)',
        safetyLevel: 'USUARIO',
      };
      break;
  }

  return {
    ...base,
    simpleExplanation,
    technicalDetail,
    whatToVerify,
    structuredVerification,
    visibleSymptoms,
    signalTraveling,
  };
}
