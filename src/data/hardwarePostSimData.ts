/**
 * EVO LABS — BANCO DE DATOS METROLÓGICOS
 * DIAGNÓSTICO DE HARDWARE FÍSICO Y CÓDIGOS POST EN TIEMPO REAL
 * 
 * Normas de referencia:
 * - Intel ATX12V Power Supply Design Guide v3.0
 * - PCI-SIG PCI Express Base Specification
 * - JEDEC JESD79-4 / JESD79-5 DDR4 / DDR5
 * - AMI Aptio V / Phoenix UEFI POST Codes
 */

export type RailId = 'v5sb' | 'v33' | 'v5' | 'v12' | 'vcore' | 'vccsa' | 'vddq' | 'pch';

export interface VoltageRail {
  id: RailId;
  label: string;
  nominal: number;
  min: number;
  max: number;
  unit: string;
  testPoint: string;
  description: string;
  maxRippleMv: number;
  standardTolerancePct: number;
}

export const VOLTAGE_RAILS: VoltageRail[] = [
  {
    id: 'v5sb',
    label: '+5VSB',
    nominal: 5.0,
    min: 4.75,
    max: 5.25,
    unit: 'V',
    testPoint: 'Pin 9 ATX (Cable Púrpura)',
    description: 'Tensión de Standby siempre presente mientras la fuente esté conectada a la red AC. Alimenta EC, Super I/O, RTC y flash SPI.',
    maxRippleMv: 50,
    standardTolerancePct: 5,
  },
  {
    id: 'v12',
    label: '+12V',
    nominal: 12.0,
    min: 11.4,
    max: 12.6,
    unit: 'V',
    testPoint: 'Conectores EPS 8-pin y PCIe (Cables Amarillos)',
    description: 'Riel primario de potencia para etapas VRM de CPU y GPU. Requiere regulación estricta bajo cargas transitorias severas.',
    maxRippleMv: 120,
    standardTolerancePct: 5,
  },
  {
    id: 'v5',
    label: '+5V',
    nominal: 5.0,
    min: 4.75,
    max: 5.25,
    unit: 'V',
    testPoint: 'Conector ATX 24-pin (Cables Rojos)',
    description: 'Alimentación para controladoras lógicas, puertos USB, discos SATA de 2.5" y circuitería auxiliar de placa base.',
    maxRippleMv: 50,
    standardTolerancePct: 5,
  },
  {
    id: 'v33',
    label: '+3.3V',
    nominal: 3.3,
    min: 3.14,
    max: 3.47,
    unit: 'V',
    testPoint: 'Conector ATX 24-pin (Cables Naranjas)',
    description: 'Alimentación directa para zócalos M.2 NVMe, ranuras PCIe auxiliares, códec de audio y circuitos de red LAN.',
    maxRippleMv: 50,
    standardTolerancePct: 5,
  },
  {
    id: 'vcore',
    label: 'VCore',
    nominal: 1.15,
    min: 0.65,
    max: 1.45,
    unit: 'V',
    testPoint: 'Bobinas de choque del VRM / Condensadores MLCC zócalo',
    description: 'Tensión de núcleos del procesador negociada dinámicamente mediante bus SVID digital hacia el controlador PWM multifase.',
    maxRippleMv: 15,
    standardTolerancePct: 2,
  },
  {
    id: 'vccsa',
    label: 'VCCSA / SOC',
    nominal: 1.05,
    min: 0.95,
    max: 1.25,
    unit: 'V',
    testPoint: 'Fase secundaria VRM SOC / System Agent',
    description: 'Alimentación del System Agent e IMC (Controlador de Memoria Integrado en la CPU). Vital para estabilidad de memorias rápidas.',
    maxRippleMv: 20,
    standardTolerancePct: 3,
  },
  {
    id: 'vddq',
    label: 'VDDQ (RAM)',
    nominal: 1.20,
    min: 1.14,
    max: 1.35,
    unit: 'V',
    testPoint: 'Ranuras DIMM pin de alimentación / PMIC DDR5',
    description: 'Alimentación de búferes de entrada/salida y celdas DRAM (1.20V nominal en DDR4 / 1.10V nominal en DDR5 estándar).',
    maxRippleMv: 30,
    standardTolerancePct: 3,
  },
  {
    id: 'pch',
    label: 'PCH 1V05',
    nominal: 1.05,
    min: 0.98,
    max: 1.12,
    unit: 'V',
    testPoint: 'Regulador lineal buck del Chipset',
    description: 'Tensión del silicio del chipset (Platform Controller Hub) para administración de puertos SATA, USB y bus DMI.',
    maxRippleMv: 25,
    standardTolerancePct: 3,
  },
];

export interface ControlSignal {
  id: string;
  name: string;
  activeLevel: 'HIGH' | 'LOW';
  source: string;
  target: string;
  description: string;
  testPoint: string;
}

export const CONTROL_SIGNALS: ControlSignal[] = [
  {
    id: 'ps_on',
    name: 'PS_ON#',
    activeLevel: 'LOW',
    source: 'Super I/O / EC',
    target: 'Fuente ATX (Pin 16 verde)',
    description: 'Señal activa a nivel bajo (0V). Ordena a la fuente conmutar de Standby a rieles principales activos.',
    testPoint: 'Pin 16 del conector principal ATX 24 pines',
  },
  {
    id: 'pwr_ok',
    name: 'PWR_OK (Power Good)',
    activeLevel: 'HIGH',
    source: 'Fuente ATX (Pin 8 gris)',
    target: 'Chipset PCH & Super I/O',
    description: 'Señal de confirmación. Se afirma a HIGH (+5V) tras 100-500 ms de estabilización de todos los rieles principales.',
    testPoint: 'Pin 8 del conector ATX 24 pines',
  },
  {
    id: 'rsmrst',
    name: 'RSMRST# (Resume Reset)',
    activeLevel: 'HIGH',
    source: 'Super I/O / EC',
    target: 'Chipset PCH',
    description: 'Informa al chipset que la tensión de Standby es estable y puede prepararse para recibir la señal de encendido.',
    testPoint: 'Punto de prueba RSMRST_L en cara posterior de la placa',
  },
  {
    id: 'slp_s3',
    name: 'SLP_S3# (Sleep S3)',
    activeLevel: 'LOW',
    source: 'Chipset PCH',
    target: 'Super I/O & VRM',
    description: 'Transición ACPI. A HIGH indica que el sistema sale de suspensión a RAM e inicia el encendido en estado S0 pleno.',
    testPoint: 'Salida de estado PCH S3_STATE',
  },
  {
    id: 'vr_ready',
    name: 'VR_READY / VRM_PG',
    activeLevel: 'HIGH',
    source: 'Controlador PWM VRM',
    target: 'CPU Socket',
    description: 'Confirma que el regulador multifase de la CPU ha alcanzado la tensión VCore regulada sin sobretensión.',
    testPoint: 'Pin de salida VR_READY del IC controlador PWM',
  },
  {
    id: 'cpu_rst',
    name: 'CPU_RESET#',
    activeLevel: 'LOW',
    source: 'Chipset / Generador de reloj',
    target: 'CPU',
    description: 'Mantiene a la CPU inmóvil. Se libera a HIGH cuando reloj y voltajes son 100% estables para iniciar vector FFFF_FFF0h.',
    testPoint: 'Punto de prueba H_CPURST# próximo al zócalo',
  },
  {
    id: 'pltrst',
    name: 'PLTRST# (Platform Reset)',
    activeLevel: 'LOW',
    source: 'Chipset PCH',
    target: 'Buses PCIe, LAN, M.2',
    description: 'Reset general de plataforma. Libera a todos los periféricos y controladores de bus simultáneamente.',
    testPoint: 'Pin A11 de la ranura PCIe x16 principal',
  },
  {
    id: 'prochot',
    name: 'PROCHOT# (Processor Hot)',
    activeLevel: 'LOW',
    source: 'Sensores térmicos VRM / CPU',
    target: 'CPU Throttle Logic',
    description: 'Protección térmica bidireccional. A nivel bajo fuerza a la CPU a bajar frecuencia a su multiplicador base (800 MHz).',
    testPoint: 'Punto de prueba PROCHOT# junto al zócalo',
  },
];

export interface PostCodeEntry {
  code: string;
  stage: 'SEC' | 'PEI' | 'DXE' | 'BDS' | 'OS' | 'STANDBY' | 'SYSTEM';
  meaning: string;
  component: 'CPU' | 'DRAM' | 'VGA' | 'BOOT' | 'CHIPSET' | 'SYSTEM';
  description: string;
  typicalIssue: string;
  recommendedAction: string;
}

export const POST_CODES_DICTIONARY: Record<string, PostCodeEntry> = {
  '--': {
    code: '--',
    stage: 'STANDBY',
    meaning: 'Alimentación Standby / Display apagado',
    component: 'SYSTEM',
    description: 'Sistema en estado G3 (apagado mecánico) o S5 con display en reposo. Sin actividad en bus LPC/eSPI.',
    typicalIssue: 'Normal antes de encendido. Si ocurre tras pulsar POWER: falla de botón, PS_ON# o corto franco en fuente.',
    recommendedAction: 'Medir +5VSB en pin 9 ATX y conmutación de PS_ON# a GND.',
  },
  '00': {
    code: '00',
    stage: 'SEC',
    meaning: 'Microcódigo no iniciado / CPU Reset no liberado',
    component: 'CPU',
    description: 'La CPU no ha iniciado la ejecución de las primeras instrucciones del vector de reset UEFI en la flash SPI.',
    typicalIssue: 'Socket con pines doblados, procesador no reconocido, microcódigo ausente, BIOS corrupto o falta de VCore.',
    recommendedAction: 'Verificar alimentación EPS 12V, inspeccionar pines del socket y regrabar BIOS mediante Flashback.',
  },
  '10': {
    code: '10',
    stage: 'SEC',
    meaning: 'Inicialización de Núcleo CPU (PEI Core Start)',
    component: 'CPU',
    description: 'El procesador arranca en modo plano de 32 bits y prepara la memoria caché interna como RAM temporal (CAR).',
    typicalIssue: 'Problemas de inicialización de caché L1/L2 interna del procesador o microcódigo incompleto.',
    recommendedAction: 'Comprobar compatibilidad de versión de BIOS con la generación instalada.',
  },
  '15': {
    code: '15',
    stage: 'PEI',
    meaning: 'Inicio de lectura de parámetros SPD de Memoria RAM',
    component: 'DRAM',
    description: 'El controlador integrado (IMC) se comunica por bus SMBus/I2C con los chips EEPROM SPD de cada módulo DIMM.',
    typicalIssue: 'Módulo de memoria mal encajado, suciedad en pistas doradas del slot o contacto falso.',
    recommendedAction: 'Extraer memorias, limpiar contactos con alcohol isopropílico y verificar encastre en ranuras A2/B2.',
  },
  '28': {
    code: '28',
    stage: 'PEI',
    meaning: 'Calibración de impedancia ZQ de Memoria DRAM',
    component: 'DRAM',
    description: 'Ajuste fino de las resistencias de terminación ODT (On-Die Termination) para preservar integridad de señal.',
    typicalIssue: 'Tensión VDD/VDDQ inestable o perfiles de frecuencia que exceden la capacidad del controlador.',
    recommendedAction: 'Resetear UEFI con Clear CMOS para arrancar en perfil base JEDEC sin overclock.',
  },
  '4F': {
    code: '4F',
    stage: 'PEI',
    meaning: 'Inicialización de canales de memoria completada',
    component: 'DRAM',
    description: 'Los bancos de memoria han completado las pruebas de lectura/escritura en fase previa al arranque de controladores.',
    typicalIssue: 'Transición normal. Si se congela aquí, un canal secundario tiene inestabilidad de bus.',
    recommendedAction: 'Probar con un único módulo en ranura B2.',
  },
  '55': {
    code: '55',
    stage: 'PEI',
    meaning: 'Memory not installed / Error crítico de inicialización de RAM',
    component: 'DRAM',
    description: 'La CPU no detecta ningún módulo utilizable o el entrenamiento de subtimings falló por completo.',
    typicalIssue: 'Ranuras DIMM vacías, módulos incompatibles, presión excesiva del cooler deformando el PCB del zócalo.',
    recommendedAction: 'Aflojar levemente los tornillos del disipador de CPU, probar cada módulo por separado.',
  },
  '78': {
    code: '78',
    stage: 'DXE',
    meaning: 'Arranque del despachador de controladores DXE (Driver Execution)',
    component: 'CHIPSET',
    description: 'Carga de controladores de hardware independientes de la plataforma almacenados en la ROM del BIOS.',
    typicalIssue: 'Falla al acceder a bloques secundarios de la memoria flash SPI.',
    recommendedAction: 'Reinstalar la última versión estable de BIOS oficial del fabricante.',
  },
  '90': {
    code: '90',
    stage: 'DXE',
    meaning: 'Detección y enumeración de buses y puertos integrados',
    component: 'CHIPSET',
    description: 'Escaneo de puertos SATA, USB integrados, códec de sonido HD Audio y buses PCI Express.',
    typicalIssue: 'Dispositivo USB en cortocircuito conectado en el panel frontal o trasero.',
    recommendedAction: 'Desconectar todos los periféricos USB externos y headers internos.',
  },
  '99': {
    code: '99',
    stage: 'DXE',
    meaning: 'Super I/O & Inicialización de PCIe / Tarjeta Gráfica',
    component: 'VGA',
    description: 'La placa base inicializa el bus PCIe x16 y busca la ROM de opción (Option ROM / GOP) de la placa de video.',
    typicalIssue: 'GPU sin conectores de energía auxiliar PCIe de 8/16 pines, o mal encajada en el zócalo.',
    recommendedAction: 'Comprobar cables PCIe de la fuente a la placa gráfica, reinstalar en zócalo primario.',
  },
  '9A': {
    code: '9A',
    stage: 'DXE',
    meaning: 'Controlador de salida de video activo (GOP Driver Loaded)',
    component: 'VGA',
    description: 'El controlador gráfico UEFI toma control del framebuffer y envía la primera señal de sincronismo al monitor.',
    typicalIssue: 'Monitor apagado, cable HDMI/DisplayPort defectuoso o selección de entrada errónea.',
    recommendedAction: 'Verificar cable DisplayPort/HDMI y encendido del monitor.',
  },
  'A2': {
    code: 'A2',
    stage: 'BDS',
    meaning: 'Detección de unidades de almacenamiento (IDE / SATA / NVMe)',
    component: 'BOOT',
    description: 'El firmware interroga al bus NVMe PCIe y controladores SATA en busca de tablas de particiones GPT/MBR.',
    typicalIssue: 'Disco duro con sectores dañados colapsando el bus, SSD NVMe mal reconocido o cable SATA roto.',
    recommendedAction: 'Desconectar unidades secundarias y verificar reconocimiento del disco de sistema en BIOS.',
  },
  'AA': {
    code: 'AA',
    stage: 'OS',
    meaning: 'Sistema Operativo en ejecución (ACPI S0 Nominal)',
    component: 'SYSTEM',
    description: 'El firmware completó todas las pruebas POST y transfirió el control de la máquina al gestor de arranque (Windows Boot Manager).',
    typicalIssue: 'Funcionamiento 100% nominal. La computadora está operando de forma óptima.',
    recommendedAction: 'Ninguna acción requerida: equipo en estado de operación normal.',
  },
  'D6': {
    code: 'D6',
    stage: 'DXE',
    meaning: 'No Console Output Devices are found (Sin dispositivo de video)',
    component: 'VGA',
    description: 'Fallo absoluto al encontrar adaptador gráfico compatible con UEFI GOP para mostrar imagen.',
    typicalIssue: 'Cable conectado a la placa madre en una CPU sin gráficos integrados (serie F de Intel o procesadores sin iGPU).',
    recommendedAction: 'Conectar el cable de video a la placa gráfica dedicada, nunca a la placa base si la CPU no tiene gráficos.',
  },
  'FF': {
    code: 'FF',
    stage: 'SYSTEM',
    meaning: 'Fallo fatal de hardware / Chipset no responde',
    component: 'SYSTEM',
    description: 'Interrupción crítica irrecuperable durante la fase de inicialización inicial de registros.',
    typicalIssue: 'Falla interna de silicio, cortocircuito severo en pistas o BIOS incompatible.',
    recommendedAction: 'Prueba en banco aislado (fuera del gabinete) con configuración mínima de componentes.',
  },
};

export interface BootPhaseData {
  index: number;
  id: string;
  name: string;
  subTitle: string;
  acpiState: string;
  durationMs: number;
  postCode: string;
  activeQLED: 'CPU' | 'DRAM' | 'VGA' | 'BOOT' | null;
  targetVoltages: Partial<Record<RailId, number>>;
  targetSignals: Record<string, 'HIGH' | 'LOW'>;
  activeComponents: string[];
  firmwareLogs: string[];
  physicalInspectionTip: string;
}

export const REALTIME_BOOT_PHASES: BootPhaseData[] = [
  {
    index: 0,
    id: 'g3_standby',
    name: '1. Conexión de Red Eléctrica (G3 → S5)',
    subTitle: 'Flyback de Standby activo y alimentación EC',
    acpiState: 'G3 → S5',
    durationMs: 800,
    postCode: '--',
    activeQLED: null,
    targetVoltages: { v5sb: 5.04, v12: 0, v5: 0, v33: 0, vcore: 0, vccsa: 0, vddq: 0, pch: 0 },
    targetSignals: { ps_on: 'HIGH', pwr_ok: 'LOW', rsmrst: 'HIGH', slp_s3: 'LOW', vr_ready: 'LOW', cpu_rst: 'LOW', pltrst: 'LOW', prochot: 'HIGH' },
    activeComponents: ['atx', 'ec', 'flash', 'battery'],
    firmwareLogs: [
      '[ALIMENTACIÓN] Red AC conectada: filtro EMI y circuito PFC en línea.',
      '[STANDBY] Riel +5VSB regulado a 5.04 V en pin 9 del conector ATX.',
      '[LÓGICA EC] Super I/O inicializado en modo escucha de botón de encendido.',
      '[MEMORIA RTC] Tensión de pila CR2032 nominal: 3.12 V (reloj RTC activo).',
    ],
    physicalInspectionTip: 'Medí pin 9 ATX con multímetro: debe haber entre 4.75V y 5.25V en reposo absoluto sin presionar el botón.',
  },
  {
    index: 1,
    id: 'pwr_trigger',
    name: '2. Pulsación del Botón de Encendido',
    subTitle: 'El EC conmuta PS_ON# a nivel bajo (GND)',
    acpiState: 'S5 → S0',
    durationMs: 600,
    postCode: '--',
    activeQLED: null,
    targetVoltages: { v5sb: 5.02, v12: 0, v5: 0, v33: 0, vcore: 0, vccsa: 0, vddq: 0, pch: 0 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'LOW', rsmrst: 'HIGH', slp_s3: 'LOW', vr_ready: 'LOW', cpu_rst: 'LOW', pltrst: 'LOW', prochot: 'HIGH' },
    activeComponents: ['ec', 'pwrbtn'],
    firmwareLogs: [
      '[PULSO BOTÓN] Transición detectada en header front panel: PWR_BTN# cae a 0V.',
      '[ORDEN FUENTE] Super I/O conmuta PS_ON# a LOW (0.05 V) en pin 16 ATX.',
      '[CONMUTACIÓN] Relé de la fuente activa el transformador principal.',
    ],
    physicalInspectionTip: 'Si PS_ON# no cae por debajo de 0.8V al presionar el botón, el interruptor o el Super I/O están dañados.',
  },
  {
    index: 2,
    id: 'rails_rise',
    name: '3. Elevación de Rieles Principales ATX',
    subTitle: 'Rieles +12V, +5V y +3.3V alcanzan regulación nominal',
    acpiState: 'S0_INIT',
    durationMs: 700,
    postCode: '--',
    activeQLED: 'CPU',
    targetVoltages: { v5sb: 5.02, v12: 12.08, v5: 5.02, v33: 3.32, vcore: 0, vccsa: 0, vddq: 0, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'LOW', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'LOW', cpu_rst: 'LOW', pltrst: 'LOW', prochot: 'HIGH' },
    activeComponents: ['atx', 'fans', 'pch'],
    firmwareLogs: [
      '[RIEL +12V] +12.08 V estabilizado en conectores EPS y PCIe.',
      '[RIEL +5V] +5.02 V nominal alcanzado en línea de 5V.',
      '[RIEL +3.3V] +3.32 V nominal alcanzado en línea de 3.3V.',
      '[CHIPSET PCH] Regulador de 1.05 V activado; PCH inicia secuencia de arranque.',
    ],
    physicalInspectionTip: 'Comprobá con multímetro que el riel de 12V esté entre 11.4V y 12.6V antes de que se libere el reset.',
  },
  {
    index: 3,
    id: 'pwr_ok_assert',
    name: '4. Afirmación de Señal PWR_OK (Power Good)',
    subTitle: 'La fuente certifica estabilidad de tensiones',
    acpiState: 'S0_POWERED',
    durationMs: 500,
    postCode: '--',
    activeQLED: 'CPU',
    targetVoltages: { v5sb: 5.02, v12: 12.08, v5: 5.02, v33: 3.32, vcore: 0, vccsa: 0, vddq: 0, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'HIGH', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'LOW', cpu_rst: 'LOW', pltrst: 'LOW', prochot: 'HIGH' },
    activeComponents: ['atx', 'ec', 'pch'],
    firmwareLogs: [
      '[PWR_OK] Pin 8 ATX sube a +5.00 V tras 240 ms de retardo normativo.',
      '[CERTIFICACIÓN] La fuente confirma ausencia de rizado excesivo y tensiones dentro de ±5%.',
      '[DESBLOQUEO] Chipset recibe autorización para despertar las fases VRM del procesador.',
    ],
    physicalInspectionTip: 'Si PWR_OK permanece en 0V, la placa nunca encenderá aunque los ventiladores giren.',
  },
  {
    index: 4,
    id: 'vrm_vcore_rise',
    name: '5. Activación de VRM y Regulación de VCore',
    subTitle: 'El controlador PWM alimenta el silicio del procesador',
    acpiState: 'S0_VRM',
    durationMs: 700,
    postCode: '00',
    activeQLED: 'CPU',
    targetVoltages: { v5sb: 5.02, v12: 12.04, v5: 5.01, v33: 3.31, vcore: 1.18, vccsa: 1.05, vddq: 1.20, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'HIGH', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'HIGH', cpu_rst: 'LOW', pltrst: 'LOW', prochot: 'HIGH' },
    activeComponents: ['vrm', 'cpu', 'ram'],
    firmwareLogs: [
      '[VRM PWM] Controlador multifase inicia conmutación DrMOS a 500 kHz.',
      '[VCORE REGULADO] VCore alcanza 1.18 V en condensadores MLCC del zócalo.',
      '[VCCSA & VDDQ] System Agent a 1.05 V y VDDQ de memoria alimentado a 1.20 V.',
      '[VR_READY] Controlador afirma VR_READY a HIGH: tensión de silicio segura.',
    ],
    physicalInspectionTip: 'Medir en las bobinas de choque del VRM: debe haber entre 0.9V y 1.2V con fluctuación mínima.',
  },
  {
    index: 5,
    id: 'reset_release',
    name: '6. Liberación de Reset (CPU_RESET# & PLTRST#)',
    subTitle: 'La CPU ejecuta su primera instrucción en memoria flash',
    acpiState: 'S0_EXEC',
    durationMs: 600,
    postCode: '10',
    activeQLED: 'CPU',
    targetVoltages: { v5sb: 5.02, v12: 12.02, v5: 5.01, v33: 3.30, vcore: 1.15, vccsa: 1.05, vddq: 1.20, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'HIGH', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'HIGH', cpu_rst: 'HIGH', pltrst: 'HIGH', prochot: 'HIGH' },
    activeComponents: ['cpu', 'flash', 'pch'],
    firmwareLogs: [
      '[LIBERACIÓN RESET] CPU_RESET# transiciona a HIGH: la CPU despierta de reset.',
      '[PLTRST#] Reset de plataforma liberado para buses PCIe y controladoras.',
      '[VECTOR RESET] Puntero de instrucción salta a 0xFFFF_FFF0h en la memoria flash SPI.',
      '[CÓDIGO POST 10] PEI Core Start: CPU operando en modo plano de 32 bits.',
    ],
    physicalInspectionTip: 'El Q-LED rojo de CPU debe encenderse en este instante y apagarse al pasar la fase SEC.',
  },
  {
    index: 6,
    id: 'ram_training',
    name: '7. Entrenamiento y Calibración de Memoria RAM',
    subTitle: 'Fase PEI: escaneo SPD y sincronización de subtimings',
    acpiState: 'S0_PEI',
    durationMs: 1200,
    postCode: '15',
    activeQLED: 'DRAM',
    targetVoltages: { v5sb: 5.02, v12: 12.01, v5: 5.00, v33: 3.30, vcore: 1.15, vccsa: 1.08, vddq: 1.20, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'HIGH', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'HIGH', cpu_rst: 'HIGH', pltrst: 'HIGH', prochot: 'HIGH' },
    activeComponents: ['cpu', 'ram'],
    firmwareLogs: [
      '[CÓDIGO POST 15] Lectura de tablas SPD en módulos DIMM vía bus SMBus.',
      '[CÓDIGO POST 28] Calibración de impedancia ZQ y alineación de reloj DQS/DQ.',
      '[CÓDIGO POST 4F] Canales A y B configurados en Dual-Channel sin errores.',
      '[MEMORIA OK] Q-LED de DRAM se apaga; memoria RAM operativa y lista.',
    ],
    physicalInspectionTip: 'Si la máquina se traba con código 55 o LED amarillo de DRAM encendido, hay falla en el bus de memoria.',
  },
  {
    index: 7,
    id: 'dxe_pci_scan',
    name: '8. Ejecución de Controladores DXE y Bus PCIe',
    subTitle: 'Enumeración de placas de video, M.2 y periféricos',
    acpiState: 'S0_DXE',
    durationMs: 1000,
    postCode: '90',
    activeQLED: 'VGA',
    targetVoltages: { v5sb: 5.02, v12: 11.98, v5: 5.00, v33: 3.29, vcore: 1.14, vccsa: 1.05, vddq: 1.20, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'HIGH', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'HIGH', cpu_rst: 'HIGH', pltrst: 'HIGH', prochot: 'HIGH' },
    activeComponents: ['cpu', 'gpu', 'pch'],
    firmwareLogs: [
      '[CÓDIGO POST 78] Despachador de controladores DXE iniciado en memoria.',
      '[CÓDIGO POST 90] Enumeración de buses de plataforma y periféricos USB.',
      '[CÓDIGO POST 99] Inicialización de ranura PCIe x16 y negociación de enlace Gen 4/5.',
    ],
    physicalInspectionTip: 'El Q-LED blanco de VGA se ilumina mientras se inicializa el bus de la placa gráfica.',
  },
  {
    index: 8,
    id: 'video_output',
    name: '9. Salida de Video y Carga de GOP (Graphics Output)',
    subTitle: 'Inicialización de pantalla y señal de sincronismo HDMI/DP',
    acpiState: 'S0_VIDEO',
    durationMs: 900,
    postCode: '9A',
    activeQLED: 'VGA',
    targetVoltages: { v5sb: 5.02, v12: 11.95, v5: 4.99, v33: 3.29, vcore: 1.14, vccsa: 1.05, vddq: 1.20, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'HIGH', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'HIGH', cpu_rst: 'HIGH', pltrst: 'HIGH', prochot: 'HIGH' },
    activeComponents: ['gpu', 'monitor'],
    firmwareLogs: [
      '[CÓDIGO POST 9A] Controlador UEFI GOP cargado en framebuffer de video.',
      '[SEÑAL VIDEO] Sincronismo enviado por puerto DisplayPort: 1440p @ 144 Hz.',
      '[LOGO EVO LABS] Imagen de inicialización UEFI renderizada en pantalla.',
      '[Q-LED VGA OK] LED de VGA se apaga satisfactoriamente.',
    ],
    physicalInspectionTip: 'Si se congela en código 99 o D6, revisá alimentación auxiliar PCIe de la tarjeta de video.',
  },
  {
    index: 9,
    id: 'bds_boot_select',
    name: '10. Selección de Dispositivo de Arranque (Fase BDS)',
    subTitle: 'Detección de unidades NVMe SSD y partición EFI (ESP)',
    acpiState: 'S0_BDS',
    durationMs: 800,
    postCode: 'A2',
    activeQLED: 'BOOT',
    targetVoltages: { v5sb: 5.02, v12: 11.96, v5: 5.00, v33: 3.29, vcore: 1.15, vccsa: 1.05, vddq: 1.20, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'HIGH', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'HIGH', cpu_rst: 'HIGH', pltrst: 'HIGH', prochot: 'HIGH' },
    activeComponents: ['m2', 'cpu'],
    firmwareLogs: [
      '[CÓDIGO POST A2] Detección de unidad NVMe PCIe Gen 4x4 en zócalo M.2_1.',
      '[TABLA PARTICIÓN] Lectura de tabla GPT y montaje de volumen FAT32 ESP (EFI System Partition).',
      '[BOOTLOADER] Localizado cargador bootmgfw.efi de Microsoft Windows.',
      '[Q-LED BOOT OK] LED verde de Boot se apaga.',
    ],
    physicalInspectionTip: 'Código A2 trabado indica que el disco tiene sectores dañados o la partición EFI está corrupta.',
  },
  {
    index: 10,
    id: 'os_handoff',
    name: '11. Transferencia al Sistema Operativo (OS Handoff)',
    subTitle: 'Salida de UEFI y toma de control por el Kernel de Windows',
    acpiState: 'S0_OS',
    durationMs: 1000,
    postCode: 'AA',
    activeQLED: null,
    targetVoltages: { v5sb: 5.02, v12: 12.02, v5: 5.01, v33: 3.30, vcore: 1.12, vccsa: 1.05, vddq: 1.20, pch: 1.05 },
    targetSignals: { ps_on: 'LOW', pwr_ok: 'HIGH', rsmrst: 'HIGH', slp_s3: 'HIGH', vr_ready: 'HIGH', cpu_rst: 'HIGH', pltrst: 'HIGH', prochot: 'HIGH' },
    activeComponents: ['cpu', 'ram', 'gpu', 'm2', 'fans'],
    firmwareLogs: [
      '[EXIT BOOT SERVICES] Desconexión de servicios de arranque de UEFI.',
      '[CÓDIGO POST AA] Sistema Operativo en ejecución activa bajo estado ACPI S0.',
      '[BEEP DE BANCO] Buzzer emite pitido corto único (0.12s @ 880 Hz): POST OK.',
      '[SISTEMA LISTO] Telemetría y diagnóstico en línea: NO LO CREAS. COMPROBALO.',
    ],
    physicalInspectionTip: 'Código POST AA confirma que el hardware completó con éxito el 100% de las pruebas físicas y lógicas.',
  },
];

export interface FaultScenario {
  id: string;
  name: string;
  category: 'ALIMENTACIÓN' | 'POTENCIA_VRM' | 'MEMORIA' | 'GRÁFICOS' | 'FIRMWARE';
  freezePhaseIndex: number;
  freezePostCode: string;
  affectedQLED: 'CPU' | 'DRAM' | 'VGA' | 'BOOT' | null;
  beepPattern: number[]; // milisegundos de pitidos
  beepDescription: string;
  symptoms: string[];
  multimeterFindings: {
    testPoint: string;
    expected: string;
    measured: string;
    verdict: 'OK' | 'FALLA' | 'CRÍTICO';
  }[];
  rootCauseAnalysis: string;
  troubleshootingChecklist: string[];
}

export const FAULT_SCENARIOS: FaultScenario[] = [
  {
    id: 'none',
    name: 'Secuencia Nominal (Sin Fallas)',
    category: 'ALIMENTACIÓN',
    freezePhaseIndex: -1,
    freezePostCode: 'AA',
    affectedQLED: null,
    beepPattern: [120],
    beepDescription: '1 pitido corto (POST Completado OK)',
    symptoms: ['Todos los componentes responden dentro de especificación nominal ATX12V.'],
    multimeterFindings: [
      { testPoint: 'Riel +12V EPS', expected: '11.40 - 12.60 V', measured: '12.04 V', verdict: 'OK' },
      { testPoint: 'Riel +5VSB', expected: '4.75 - 5.25 V', measured: '5.04 V', verdict: 'OK' },
      { testPoint: 'PWR_OK (Pin 8 ATX)', expected: '> 4.50 V (HIGH)', measured: '5.00 V', verdict: 'OK' },
    ],
    rootCauseAnalysis: 'El sistema funciona en condiciones de laboratorio ideales.',
    troubleshootingChecklist: ['Mantener mantenimiento térmico preventivo periódico.'],
  },
  {
    id: 'short_12v_vrm',
    name: 'Cortocircuito Franco en Riel +12V EPS (VRM en Corto)',
    category: 'POTENCIA_VRM',
    freezePhaseIndex: 2,
    freezePostCode: '00',
    affectedQLED: 'CPU',
    beepPattern: [],
    beepDescription: 'Sin pitidos (Apagado instantáneo por protección SCP)',
    symptoms: [
      'Los ventiladores giran medio segundo y se detienen inmediatamente.',
      'La fuente de alimentación hace un chasquido metálico característico (relé SCP).',
      'El equipo no vuelve a responder hasta que se desconecta el cable de red eléctrica.',
    ],
    multimeterFindings: [
      { testPoint: 'Riel +12V EPS (conector 8 pines)', expected: '12.00 V', measured: '0.00 V (Cae a cero)', verdict: 'CRÍTICO' },
      { testPoint: 'Resistencia 12V EPS hacia GND (en frío)', expected: '> 1000 Ω', measured: '0.4 Ω (Corto franco)', verdict: 'CRÍTICO' },
      { testPoint: 'PWR_OK (Pin 8 ATX)', expected: '5.00 V', measured: '0.00 V', verdict: 'FALLA' },
    ],
    rootCauseAnalysis: 'Uno de los MOSFETs de la etapa de potencia de entrada del VRM (lado alto) sufrió perforación de juntura de silicio, derivando los +12V directamente a masa (GND). La protección SCP (Short Circuit Protection) de la fuente apaga el sistema en microsegundos para evitar un incendio.',
    troubleshootingChecklist: [
      'Desconectar el conector EPS de 8 pines de CPU de la placa y pulsar encendido: si la fuente arranca y se mantiene encendida, el corto está en el VRM.',
      'Medir con multímetro en modo continuidad / resistencia entre el pin de +12V EPS y masa.',
      'Inspeccionar térmicamente la zona de fases con cámara térmica o alcohol isopropílico para localizar el MOSFET perforado.',
      'Reemplazar el chip DrMOS / etapa de potencia dañada.',
    ],
  },
  {
    id: 'sb5_dead',
    name: 'Pérdida de Tensión de Standby (+5VSB Inactivo)',
    category: 'ALIMENTACIÓN',
    freezePhaseIndex: 0,
    freezePostCode: '--',
    affectedQLED: null,
    beepPattern: [],
    beepDescription: 'Sin pitidos (Circuitería lógica sin alimentación)',
    symptoms: [
      'La computadora está totalmente muerta: no enciende ningún LED testigo, ni gira ningún ventilador.',
      'Presionar el botón de encendido no produce absolutamente ningún efecto.',
      'Puentear los pines del Front Panel con destornillador tampoco provoca arranque.',
    ],
    multimeterFindings: [
      { testPoint: 'Pin 9 ATX (+5VSB cable púrpura)', expected: '4.75 - 5.25 V', measured: '0.00 V', verdict: 'CRÍTICO' },
      { testPoint: 'Pila CR2032', expected: '2.80 - 3.30 V', measured: '3.08 V', verdict: 'OK' },
      { testPoint: 'PS_ON# (Pin 16 ATX)', expected: '3.30 - 5.00 V', measured: '0.00 V (Inerte)', verdict: 'FALLA' },
    ],
    rootCauseAnalysis: 'El convertidor flyback independiente de standby de la fuente de poder se quemó o su fusible de protección de entrada se abrió. Sin +5VSB, el controlador embebido (EC / Super I/O) no recibe alimentación y es incapaz de sensar la pulsación del botón ni de bajar la señal PS_ON# a masa.',
    troubleshootingChecklist: [
      'Comprobar el cable de alimentación AC y el interruptor trasero I/O de la fuente.',
      'Desconectar el conector ATX 24 pines y medir con multímetro en el pin 9 (cable violeta) respecto a masa.',
      'Probar con otra fuente de poder conocida en buen estado para aislar la falla.',
    ],
  },
  {
    id: 'ram_error_55',
    name: 'Código POST 55: Fallo de Inicialización / Entrenamiento de RAM',
    category: 'MEMORIA',
    freezePhaseIndex: 6,
    freezePostCode: '55',
    affectedQLED: 'DRAM',
    beepPattern: [350, 350, 350],
    beepDescription: '3 pitidos largos (Fallo en banco de memoria)',
    symptoms: [
      'La PC enciende los ventiladores y luces RGB al 100%, pero la pantalla queda en negro.',
      'El display LED de 2 dígitos de la placa madre queda trabado permanentemente en el código 55.',
      'El testigo Q-LED amarillo de DRAM permanece encendido fijo.',
    ],
    multimeterFindings: [
      { testPoint: 'Tensión VDDQ en ranura DIMM', expected: '1.20 V', measured: '1.21 V', verdict: 'OK' },
      { testPoint: 'Tensión VCCSA / SOC', expected: '1.05 V', measured: '1.05 V', verdict: 'OK' },
      { testPoint: 'Bus SMBus reloj (SCL) SPD', expected: '3.30 V con pulsos', measured: '3.30 V (Sin respuesta SPD)', verdict: 'FALLA' },
    ],
    rootCauseAnalysis: 'El controlador de memoria integrado (IMC) en la CPU no pudo establecer enlace con los chips de la memoria o falló la fase de calibración de márgenes de temporización (Read/Write Training). Causado comúnmente por suciedad en los contactos, un módulo mal insertado o incompatibilidad del perfil EXPO/XMP.',
    troubleshootingChecklist: [
      'Retirar ambos módulos de memoria y limpiar los contactos dorados con alcohol isopropílico.',
      'Probar un solo módulo en la ranura recomendada por el fabricante (usualmente ranura B2 / segunda desde el procesador).',
      'Efectuar un Clear CMOS retirando la pila CR2032 o puenteando el jumper CLRTC para borrar perfiles de memoria inestables.',
      'Verificar que el disipador de CPU no esté apretado con fuerza asimétrica o excesiva que doble el PCB del zócalo.',
    ],
  },
  {
    id: 'gpu_error_99',
    name: 'Código POST 99 / D6: Sin Dispositivo de Video Detectado',
    category: 'GRÁFICOS',
    freezePhaseIndex: 7,
    freezePostCode: '99',
    affectedQLED: 'VGA',
    beepPattern: [400, 150, 150],
    beepDescription: '1 pitido largo + 2 pitidos cortos (Fallo de visualización)',
    symptoms: [
      'El sistema enciende pero el monitor entra inmediatamente en modo de suspensión ("Sin Señal").',
      'El display de 2 dígitos queda detenido en código 99 o D6.',
      'El Q-LED blanco de VGA queda encendido permanentemente.',
    ],
    multimeterFindings: [
      { testPoint: 'Alimentación PCIe 12V en GPU', expected: '11.40 - 12.60 V', measured: '0.00 V (Cables desconectados)', verdict: 'CRÍTICO' },
      { testPoint: 'Ranura PCIe x16 Pin B1 (+12V)', expected: '12.00 V', measured: '12.04 V', verdict: 'OK' },
      { testPoint: 'Ranura PCIe x16 Pin A9 (+3.3V)', expected: '3.30 V', measured: '3.31 V', verdict: 'OK' },
    ],
    rootCauseAnalysis: 'El firmware UEFI escaneó el bus PCIe en la fase DXE y no pudo inicializar la Option ROM / controlador GOP de la placa de video. Típico cuando los cables de energía auxiliar PCIe de 8 pines están flojos o la placa gráfica no encajó completamente en la traba del zócalo.',
    troubleshootingChecklist: [
      'Verificar que los conectores de energía auxiliar PCIe de la fuente estén firmemente enchufados a la placa gráfica.',
      'Reinstalar la placa de video asegurando que la traba plástica del zócalo PCIe x16 haga clic.',
      'Verificar si el cable de video está conectado a la tarjeta gráfica y no a las salidas de la placa madre.',
    ],
  },
  {
    id: 'bios_corrupt_loop',
    name: 'Código POST 00: BIOS SPI Corrupto / Vector de Reset Inerte',
    category: 'FIRMWARE',
    freezePhaseIndex: 4,
    freezePostCode: '00',
    affectedQLED: 'CPU',
    beepPattern: [],
    beepDescription: 'Sin pitidos (El firmware no logra iniciar la fase de audio)',
    symptoms: [
      'La PC enciende los ventiladores pero no muestra ningún código POST más allá de 00.',
      'El Q-LED de CPU queda encendido fijo de forma indefinida.',
      'Ocurrió luego de un corte de luz durante una actualización de BIOS o por flash SPI dañada.',
    ],
    multimeterFindings: [
      { testPoint: 'VCC de chip Flash SPI 25Q256', expected: '3.30 V', measured: '3.31 V', verdict: 'OK' },
      { testPoint: 'Línea de datos SPI MISO/MOSI', expected: 'Pulsos de lectura rápida', measured: 'Nivel alto estático (Sin actividad)', verdict: 'FALLA' },
      { testPoint: 'VCore de procesador', expected: '1.15 V', measured: '1.16 V', verdict: 'OK' },
    ],
    rootCauseAnalysis: 'Aunque las tensiones VCore y 3.3V están presentes, los primeros bloques de código UEFI en la memoria flash SPI están corruptos. El vector de reset del procesador (0xFFFF_FFF0h) apunta a instrucciones inválidas (NOPs o ceros), por lo que la CPU se detiene antes de emitir cualquier código POST.',
    troubleshootingChecklist: [
      'Utilizar la función BIOS Flashback de la placa madre: colocar archivo de BIOS oficial en pendrive FAT32 y presionar el botón trasero.',
      'Si la placa no tiene Flashback, reprogramar el chip SPI 25Q mediante programador de hardware CH341A con pinza SOIC8.',
      'Comprobar si el procesador instalado requiere una versión de microcódigo más moderna que la grabada de fábrica.',
    ],
  },
];
