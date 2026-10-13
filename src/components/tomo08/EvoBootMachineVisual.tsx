import React, { useState } from 'react';
import { BootStep, MachineComponentId } from './bootSequenceData';
import {
  Zap,
  Cpu,
  HardDrive,
  Monitor,
  Shield,
  Layers,
  Activity,
  Power,
  Sliders,
  Flame,
  X,
  HelpCircle,
  Fan,
  CircuitBoard,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Battery,
  Disc,
  Info,
} from 'lucide-react';

interface EvoBootMachineVisualProps {
  currentStep: BootStep;
  isPoweredOn: boolean;
  isFailed?: boolean;
}

interface ComponentEduModalData {
  title: string;
  category: string;
  queEs: string;
  queHace: string;
  cuandoInterviene: string;
  fallasPosibles: string[];
}

export type FocusZone = 'ALL' | 'CPU_VRM' | 'RAM_ATX' | 'PCIE_M2' | 'CHIPSET_BIOS';

const COMPONENT_EDU_INFO: Record<string, ComponentEduModalData> = {
  cpu: {
    title: 'SOCKET LGA1700 // INTEL 12-14th GEN ARCHITECTURE',
    category: 'PROCESAMIENTO & IMC',
    queEs: 'Zócalo de alta densidad LGA1700 (Land Grid Array de 1700 contactos) con retención metálica ILM para microprocesadores híbridos (P-Cores + E-Cores).',
    queHace: 'Aloja la CPU y su IMC (controlador DDR5 integrado). Ejecuta el vector de reset (FFFF_FFF0h), ejecuta el microcódigo UEFI y coordina los buses PCIe Gen 5 y DMI 4.0.',
    cuandoInterviene: 'Paso 06 (Liberación de Reset / RESET# High) hasta la ejecución continua del sistema operativo.',
    fallasPosibles: [
      'Pines del zócalo LGA doblados por inserción inadecuada o exceso de presión.',
      'Falla del IMC en canales DDR5 impidiendo completar el entrenamiento de memoria.',
      'Estrangulamiento térmico por mal asentamiento del disipador sobre el IHS alargado de LGA1700.',
    ],
  },
  vrm: {
    title: 'VRM // 16+1+1 FASES DrMOS & ALIMENTACIÓN EPS 12V',
    category: 'REGULACIÓN DE POTENCIA DE SILICIO',
    queEs: 'Módulo Regulador de Voltaje digital síncrono con etapas de potencia DrMOS de 70A, chokes de ferrita R22 blindados y disipadores de aluminio con heatpipe.',
    queHace: 'Convierte los +12V del conector EPS en voltajes milimétricos y estables de núcleo (VCore / VCCAUX / VCCIN) con rizado ultra bajo para la CPU.',
    cuandoInterviene: 'Paso 04/05 (Energización de rieles principales y confirmación de estabilidad previo a liberar reset).',
    fallasPosibles: [
      'Cortocircuito franco a masa en MOSFETs de alta que activa la protección OCP de la fuente al encender.',
      'Sobrecalentamiento por falta de flujo de aire o almohadillas térmicas resecas.',
      'Rizado de tensión excesivo provocando reinicios espontáneos en cargas altas.',
    ],
  },
  ram: {
    title: '4 RANURAS DDR5 DIMM // DUAL CHANNEL DAISY-CHAIN',
    category: 'SUBSISTEMA DE MEMORIA PRINCIPAL',
    queEs: 'Ranuras DIMM para memoria DDR5 (hasta 7200+ MT/s) con montaje superficial SMT y trabas de fijación unilateral Q-Latch.',
    queHace: 'Conecta los módulos DDR5 al IMC del procesador. El estándar DDR5 incorpora dos subcanales independientes de 32 bits por módulo y gestión de voltaje integrada (PMIC).',
    cuandoInterviene: 'Paso 10 (Inicialización IMC), Paso 11 (Lectura de perfiles SPD/XMP) y Paso 12 (Entrenamiento de señales DQS/DQ).',
    fallasPosibles: [
      'Falso contacto en pines dorados o suciedad en la ranura impidiendo el entrenamiento.',
      'Inestabilidad por perfil XMP demasiado agresivo para la topología Daisy-Chain.',
      'Celdas degradadas que disparan el ECC interno y producen pantallas azules (BSODs).',
    ],
  },
  gpu: {
    title: 'SUBSISTEMA GRÁFICO // GOP & dGPU / iGPU',
    category: 'SALIDA DE VIDEO & FRAMEBUFFER',
    queEs: 'Tarjeta gráfica discreta en ranura PCIe x16 o gráficos integrados en el silicio del procesador con protocolo UEFI GOP.',
    queHace: 'Inicializa el framebuffer básico para la visualización del setup y el logotipo de arranque, transfiriendo posteriormente el control al driver DirectX.',
    cuandoInterviene: 'Paso 14 (Enumeración de bus PCIe), Paso 15 (Handshake GOP / VBIOS) y Paso 29+ (Entorno interactivo DWM).',
    fallasPosibles: [
      'Cable de alimentación auxiliar PCIe desconectado o conector de 12VHPWR mal calzado.',
      'Traba de la ranura PCIe no asegurada o cable de monitor conectado a la placa teniendo CPU sin gráficos integrados.',
      'Incompatibilidad con el protocolo UEFI GOP en GPUs antiguas (requieren modo CSM Legacy).',
    ],
  },
  pcie: {
    title: 'RANURA PCIe 5.0 x16 // BLINDAJE DE ACERO SAFESLOT',
    category: 'BUS DE EXPANSIÓN PRINCIPAL',
    queEs: 'Ranura de expansión PCI Express 5.0 con blindaje de acero inoxidable soldado a la PCB y traba de expulsión reforzada Q-Release.',
    queHace: 'Proporciona un enlace directo de 16 líneas y hasta 128 GB/s bidireccionales entre el procesador y la tarjeta gráfica de alto rendimiento.',
    cuandoInterviene: 'Paso 14 (Enumeración y negociación de velocidad de enlace Gen 5/4/3).',
    fallasPosibles: [
      'Pistas de datos PCIe fisuradas por el peso de tarjetas gráficas modernas de triple disipador.',
      'Caída en la velocidad de enlace a Gen 1 o Gen 2 por polvo en los pines del carril.',
    ],
  },
  storage: {
    title: 'ALMACENAMIENTO // M.2 NVMe & PUERTOS SATA 6Gb/s',
    category: 'UNIDADES DE ALMACENAMIENTO MASIVO',
    queEs: 'Bahías de alta velocidad formato M.2 PCIe Gen 4/5 y puertos SATA de 6 Gb/s para discos mecánicos y SSDs de 2.5 pulgadas.',
    queHace: 'Aloja la tabla de particiones GPT, la partición de sistema EFI (ESP) en formato FAT32 y el volumen NTFS con Windows NT.',
    cuandoInterviene: 'Paso 16 (Inicialización de controladoras), Paso 17 (Identificación GPT) y Pasos 21 a 34 (Carga de kernel y archivos).',
    fallasPosibles: [
      'Corrupción en el almacén BCD o partición EFI formateada erróneamente.',
      'Modo de almacenamiento configurado en RAID/VMD en BIOS sin los controladores Intel RST presentes en el instalador.',
      'Desgaste de celdas NAND con bloqueo en modo de solo lectura.',
    ],
  },
  m2: {
    title: 'SLOTS M.2 NVMe // GEN 5/GEN 4 CON THERMAL SHIELD',
    category: 'CONECTOR NVMe M-KEY 2280',
    queEs: 'Zócalos M.2 para unidades SSD NVMe ultrarrápidas con disipadores térmicos de aluminio macizo y almohadillas de silicona.',
    queHace: 'Comunica directamente la unidad SSD con 4 líneas PCIe del procesador (Slot 1) o del chipset (Slot 2), superando los 7000 MB/s.',
    cuandoInterviene: 'Paso 16 (Detección de controladora NVMe), Paso 17 (Identificación) y Pasos 21 a 34 (Lectura permanente).',
    fallasPosibles: [
      'Thermal Throttling por no haber retirado el plástico protector de la almohadilla térmica del disipador.',
      'Falso contacto en el conector M.2 por curvatura indebida del circuito impreso al ajustar.',
    ],
  },
  sata: {
    title: '4x PUERTOS SATA 6Gb/s // INTERFAZ SERIAL ATA',
    category: 'CONECTIVIDAD DE DISCOS TRADICIONALES',
    queEs: 'Bloque de puertos SATA acodados a 90 grados gobernados por la controladora AHCI integrada en el chipset Z790.',
    queHace: 'Permite conectar discos duros mecánicos de respaldo y unidades SSD SATA de 2.5 pulgadas con tasas de hasta 600 MB/s.',
    cuandoInterviene: 'Paso 16 (Inicialización AHCI) y Paso 17 (Identificación de unidades presentes en el bus).',
    fallasPosibles: [
      'Cable SATA dañado o estrangulado que genera errores de transferencia CRC UltraDMA.',
      'Conector quebrado por exceso de fuerza al manipular cables en el gabinete.',
    ],
  },
  pch: {
    title: 'CHIPSET INTEL Z790 // PLATFORM CONTROLLER HUB (PCH)',
    category: 'CONCENTRADOR DE COMUNICACIONES & ENLACE DMI 4.0',
    queEs: 'Circuito integrado de silicio bajo un disipador pasivo con aletas, enlazado a la CPU mediante un bus DMI 4.0 x8 de alta velocidad.',
    queHace: 'Administra puertos USB 3.2 Gen 2x2, controladora SATA, audio HD, tarjeta de red 2.5G y líneas PCIe adicionales de expansión.',
    cuandoInterviene: 'Paso 01/02 (Standby), Paso 13 (Interconexión DMI con la CPU) y enrutamiento constante.',
    fallasPosibles: [
      'Sobrecalentamiento del chipset por pasta térmica seca o disipador cubierto de polvo.',
      'Líneas USB o puertos periféricos en cortocircuito que bloquean la secuencia de encendido de la placa.',
    ],
  },
  bios: {
    title: 'SPI FLASH ROM // CHIP DE FIRMWARE UEFI (256Mb)',
    category: 'MEMORIA FLASH NO VOLÁTIL',
    queEs: 'Circuito integrado SOIC-8 de memoria Flash que contiene el microcódigo del firmware UEFI, tablas ACPI y variables NVRAM.',
    queHace: 'Es el primer componente direccionado por la CPU al salir de reset (vector FFFF_FFF0h) para iniciar el autodiagnóstico POST.',
    cuandoInterviene: 'Paso 07 (Fetch de vector de reset) hasta el Paso 21 (Transferencia de control a Windows Boot Manager).',
    fallasPosibles: [
      'Firmware corrupto tras una actualización interrumpida o corte de energía durante el flasheo.',
      'Microcódigo ausente para la generación de procesador instalada (requiere BIOS Flashback).',
    ],
  },
  cmos: {
    title: 'BATERÍA CR2032 3V // CIRCUITO RTC & CLEAR CMOS',
    category: 'ENERGÍA PERMANENTE DEL RELOJ',
    queEs: 'Batería de botón de litio de 3V en zócalo metálico que alimenta el oscilador del RTC y la memoria CMOS cuando la PC está desenchufada.',
    queHace: 'Mantiene la fecha y hora del sistema y los ajustes de configuración de hardware guardados en la memoria NVRAM.',
    cuandoInterviene: 'Permanente en modo desconectado y Paso 07 (Lectura de parámetros de hardware al iniciar).',
    fallasPosibles: [
      'Batería agotada (< 2.8V) provocando reinicio de la hora y perfiles de BIOS en cada desconexión de corriente.',
      'Jumper Clear CMOS mal colocado o sulfatado que impide el arranque normal de la placa.',
    ],
  },
  atx: {
    title: 'CONECTOR ATX 24 PINES // ALIMENTACIÓN DE PLATAFORMA',
    category: 'ENTRADA DE ENERGÍA PRINCIPAL',
    queEs: 'Conector de alimentación de doble hilera (2x12 pines) con pestañas de bloqueo y terminales de alta corriente.',
    queHace: 'Distribuye los rieles +12V, +5V, +3.3V, -12V, el riel de espera +5VSB, el control lógico PS_ON# y la señal de confirmación PWR_OK.',
    cuandoInterviene: 'Paso 01 (+5VSB Standby), Paso 03 (PS_ON# a 0V) y Paso 04/05 (Alimentación total y PWR_OK).',
    fallasPosibles: [
      'Terminales recalentados o sueltos por cables sometidos a tensión mecánica excesiva.',
      'Falta de inserción total hasta escuchar el clic de la traba de seguridad.',
    ],
  },
  eps: {
    title: 'CONECTOR EPS 12V 8 PINES // POTENCIA EXCLUSIVA CPU',
    category: 'ALIMENTACIÓN DE PROCESADOR',
    queEs: 'Conector de 8 contactos (4x +12V y 4x Tierra) con clave de inserción ubicado en la parte superior junto al disipador VRM.',
    queHace: 'Inyecta corriente continua directa de 12 voltios hacia los inductores del VRM para evitar pérdidas en la placa base.',
    cuandoInterviene: 'Paso 04 (Energización de rieles de potencia hacia las fases de la CPU).',
    fallasPosibles: [
      'Cable PCIe de 8 pines conectado por error en lugar del cable EPS/CPU (polaridad opuesta, produce cortocircuito inmediato).',
    ],
  },
  fpanel: {
    title: 'HEADER JFP1 // PANEL FRONTAL (PWR_SW, RESET, LEDs)',
    category: 'INTERFAZ DE CONTROL FÍSICO',
    queEs: 'Matriz estandarizada de 9 pines en la esquina inferior de la placa para conectar los botones y testigos del gabinete.',
    queHace: 'Al presionar el botón de encendido del gabinete, los pines PWR_SW se derivan a tierra momentáneamente para ordenar el inicio.',
    cuandoInterviene: 'Paso 01 (Monitoreo de standby) y Paso 02 (Detección de flanco de encendido PWR_SW).',
    fallasPosibles: [
      'Pulsador físico del gabinete pegado o sulfatado (la máquina enciende y se apaga a los 4 segundos).',
      'Conectores invertidos o colocados en los pines equivocados del header.',
    ],
  },
  debug_led: {
    title: 'EZ DEBUG LEDs // TESTIGOS POST SECUENCIALES',
    category: 'TELEMETRÍA PERICIAL DE DIAGNÓSTICO',
    queEs: 'Fila de 4 micro-LEDs SMD de alta luminosidad (CPU, DRAM, VGA, BOOT) integrados en el borde de la placa madre.',
    queHace: 'Se encienden en estricto orden secuencial durante el autodiagnóstico. Si la placa se congela con un LED encendido, señala la etapa fallida.',
    cuandoInterviene: 'Paso 05 a 09 (CPU), Paso 10 a 13 (DRAM), Paso 14 a 15 (VGA), Paso 16 a 20 (BOOT) y apagado completo en Paso 21+.',
    fallasPosibles: [
      'LED CPU fijo: Problema en socket, microcódigo ausente o alimentación EPS ausente.',
      'LED DRAM fijo: Módulos DDR5 incompatibles, mal calzados o fallo en IMC.',
      'LED VGA fijo: Placa de video no detectada o alimentación PCIe desconectada.',
      'LED BOOT fijo: No se encuentra partición EFI válida en las unidades de almacenamiento.',
    ],
  },
  psu: {
    title: 'PSU // FUENTE DE PODER ATX MODULAR',
    category: 'CONVERSIÓN DE ENERGÍA AC-DC',
    queEs: 'Fuente de poder conmutada con certificación 80 Plus que entrega rieles estabilizados de tensión continua a la computadora.',
    queHace: 'Suministra +5VSB permanente en reposo, arranca al recibir nivel bajo en PS_ON# y confirma estabilidad mediante la señal PWR_OK.',
    cuandoInterviene: 'Paso 00 (Energía primaria), Paso 01 (Standby), Paso 03 (Arranque conmutado) y Paso 04/05 (PWR_OK).',
    fallasPosibles: [
      'Riel +5VSB ausente dejando la placa madre totalmente muerta.',
      'Retardo excesivo o ausencia de la señal PWR_OK (mantiene al procesador en reset perpetuo).',
    ],
  },
  motherboard: {
    title: 'MOTHERBOARD ATX // PCB DE 8 CAPAS DE COBRE IT-180TC',
    category: 'SUSTRATO Y COLUMNA VERTEBRAL DEL SISTEMA',
    queEs: 'Placa de circuito impreso estándar ATX (305 mm × 244 mm) de 8 capas con planos de masa dedicados y blindaje contra interferencias EMI.',
    queHace: 'Proporciona la interconexión física y eléctrica entre todos los subsistemas, coordinando el flujo de energía y buses de alta velocidad.',
    cuandoInterviene: 'Presente y activa a lo largo de todas las 34 etapas de la secuencia de arranque.',
    fallasPosibles: [
      'Pistas cortadas por rayones de destornillador o standoffs metálicos mal colocados en el gabinete.',
      'Capacitores cerámicos SMD en cortocircuito en las líneas principales de 12V o 5V.',
    ],
  },
  rear_io: {
    title: 'PANEL TRASERO I/O // PUERTOS Y BLINDAJE INTEGRADO',
    category: 'CONECTIVIDAD EXTERNA Y PERIFÉRICOS',
    queEs: 'Bloque preinstalado de acero inoxidable con puertos USB 3.2 Gen 2x2 Type-C, DisplayPort, HDMI, LAN 2.5G y audio óptico.',
    queHace: 'Conecta los buses del chipset y del procesador con el mundo exterior y los periféricos del usuario.',
    cuandoInterviene: 'Paso 18 (Enumeración de periféricos USB, audio y red) y operación continua.',
    fallasPosibles: [
      'Lengüetas metálicas de puertos USB dobladas haciendo cortocircuito interno.',
      'Chip de red o audio dañado por descargas electrostáticas (ESD) durante la conexión de cables.',
    ],
  },
};

export const EvoBootMachineVisual: React.FC<EvoBootMachineVisualProps> = ({
  currentStep,
  isPoweredOn,
  isFailed = false,
}) => {
  const [inspectedComponent, setInspectedComponent] = useState<ComponentEduModalData | null>(null);
  const [selectedComponentKey, setSelectedComponentKey] = useState<string>('cpu');
  const [focusZone, setFocusZone] = useState<FocusZone>('ALL');

  // Dynamic active component helper
  const isComponentActive = (id: MachineComponentId | string) => {
    if (!isPoweredOn) return false;
    const step = currentStep.stepNumber;
    switch (id) {
      case 'cpu':
        return currentStep.activeComponents.includes('cpu') || (step >= 6 && step <= 34);
      case 'vrm':
        return step >= 4;
      case 'ram':
        return currentStep.activeComponents.includes('ram') || (step >= 10 && step <= 34);
      case 'gpu':
      case 'pcie':
        return currentStep.activeComponents.includes('gpu') || (step >= 14 && step <= 34);
      case 'storage':
      case 'm2':
        return currentStep.activeComponents.includes('storage') || (step >= 16 && step <= 34);
      case 'sata':
        return step >= 16 && step <= 21;
      case 'pch':
        return step >= 2;
      case 'bios':
        return currentStep.activeComponents.includes('firmware') || (step >= 7 && step <= 21);
      case 'cmos':
        return true;
      case 'atx':
        return step >= 1;
      case 'eps':
        return step >= 4;
      case 'fpanel':
        return step === 1 || step === 2;
      case 'debug_led':
        return step >= 5 && step <= 20;
      case 'psu':
        return currentStep.activeComponents.includes('psu') || step >= 1;
      default:
        return false;
    }
  };

  // Signal state calculation: exactly one active physical signal per step
  const isSignalActive = (signalType: string) => {
    if (!isPoweredOn) return false;
    const step = currentStep.stepNumber;
    switch (signalType) {
      case 'STANDBY':
        return step === 1;
      case 'PWR_SW':
        return step === 2;
      case 'PS_ON#':
        return step === 3;
      case 'RAILS_MAIN':
        return step === 4;
      case 'PWR_OK':
        return step === 5;
      case 'RESET#':
        return step === 6;
      case 'FIRMWARE_FETCH':
        return step === 7 || step === 8 || step === 9;
      case 'RAM_TRAIN':
        return step === 10 || step === 11 || step === 12;
      case 'PLATFORM_INTERCONNECT':
        return step === 13;
      case 'PCIE_GPU':
        return step === 14 || step === 15;
      case 'STORAGE_BUS':
        return step >= 16 && step <= 21;
      case 'WIN_PIPELINE':
        return step >= 22 && step <= 34;
      default:
        return false;
    }
  };

  const getStepSignalTitle = () => {
    const step = currentStep.stepNumber;
    if (step === 0) return 'REPOSO // Circuito desenergizado';
    if (step === 1) return 'STANDBY // Riel +5VSB activo hacia lógica de espera de motherboard';
    if (step === 2) return 'PWR_SW // Cierre de contacto a masa en pines de panel frontal';
    if (step === 3) return 'PS_ON# // Lógica de motherboard solicita encendido a la fuente (0V)';
    if (step === 4) return 'ALIMENTACIÓN PRINCIPAL // Fuente energiza rieles principales hacia VRM y placa';
    if (step === 5) return 'PWR_OK // Fuente confirma tensiones estabilizadas a la plataforma';
    if (step === 6) return 'RESET# // Plataforma libera condición de reset al procesador';
    if (step === 7) return 'FIRMWARE FETCH // Procesador ejecuta vector de inicio en firmware mapeado';
    if (step === 8) return 'FIRMWARE ENV // Ejecución de entorno temprano de firmware (SEC/PEI)';
    if (step === 9) return 'CPU INIT // Inicialización interna de microcódigo y registros de procesador';
    if (step === 10) return 'IMC INIT // Inicialización del controlador de memoria integrado';
    if (step === 11) return 'SPD READ // Lectura de parámetros de temporización desde los módulos DIMM';
    if (step === 12) return 'MEMORY TRAINING // Calibración de temporizaciones y señal DQS/DQ con la RAM';
    if (step === 13) return 'PLATFORM INTERCONNECT // Enlace entre procesador y chipset / I-O hub';
    if (step === 14) return 'PCIe ENUM // Enumeración y escaneo de puertos y ranuras de expansión';
    if (step === 15) return 'GRAPHICS GOP // Inicialización del subsistema gráfico y framebuffer UEFI';
    if (step === 16) return 'STORAGE CONTROLLER // Inicialización de controladoras de almacenamiento';
    if (step === 17) return 'STORAGE IDENT // Identificación de unidades y lectura de estructura GPT';
    if (step === 18) return 'DEVICE ENUM // Enumeración de periféricos adicionales (USB, audio, red)';
    if (step === 19) return 'POST VALIDATED // Diagnóstico de hardware completado con éxito';
    if (step === 20) return 'NVRAM BOOT ORDER // Consulta de orden de arranque en variables de firmware';
    if (step === 21) return 'ESP FETCH // Lectura de la partición EFI System Partition (ESP)';
    if (step === 22) return 'BOOTLOADER // Ejecución de Windows Boot Manager (bootmgfw.efi)';
    if (step === 23) return 'WINLOAD // Transferencia y ejecución del cargador de sistema (winload.efi)';
    if (step === 24) return 'KERNEL LOAD // Carga del kernel ntoskrnl.exe y la capa HAL en memoria';
    if (step === 25) return 'HAL LINK // Interconexión entre el kernel NT y la capa de abstracción HAL';
    if (step === 26) return 'BOOT DRIVERS // Inicialización de controladores de arranque prioritarios';
    if (step === 27) return 'KERNEL ACTIVE // Fase 1 de kernel completada: planificador e interrupciones';
    if (step === 28) return 'SMSS // Lanzamiento del subsistema de gestión de sesiones (smss.exe)';
    if (step === 29) return 'CSRSS / WININIT // Inicialización de subsistemas Win32 y servicios base';
    if (step === 30) return 'SERVICES // Inicio del Service Control Manager (SCM) y servicios de fondo';
    if (step === 31) return 'WINLOGON // Preparación de la interfaz de inicio de sesión de usuario';
    if (step === 32) return 'USER PROFILE // Autenticación y carga del registro de usuario (NTUSER.DAT)';
    if (step === 33) return 'EXPLORER // Carga del entorno de escritorio y gestor de ventanas DWM';
    if (step === 34) return 'DESKTOP READY // Sistema operativo completamente interactivo y operativo';
    return `${currentStep.initiator} ➔ ${currentStep.responder}`;
  };

  const getStepActionFlow = () => {
    const step = currentStep.stepNumber;
    if (step === 0) return 'Suministro Eléctrico ➔ Reposo Desenergizado';
    if (step === 1) return 'PSU (+5VSB) ➔ Lógica de Standby en Motherboard';
    if (step === 2) return 'Botón Power ➔ Header Frontal (PWR_SW) ➔ Lógica de Control';
    if (step === 3) return 'Lógica de Motherboard ➔ PS_ON# ➔ PSU';
    if (step === 4) return 'PSU (+12V/+5V/+3.3V) ➔ VRM & Distribución Motherboard';
    if (step === 5) return 'PSU (PWR_OK) ➔ Lógica de Reset de Plataforma';
    if (step === 6) return 'Lógica de Reset ➔ Desreset de Procesador (RESET# High)';
    if (step >= 7 && step <= 9) return 'Firmware SPI ➔ Procesador (Microcódigo & Vector)';
    if (step >= 10 && step <= 12) return 'CPU / IMC ↔ Slots DDR5 (SPD & Memory Training)';
    if (step === 13) return 'CPU / SoC ↔ Chipset Z790 (Enlace DMI 4.0)';
    if (step >= 14 && step <= 15) return 'CPU / PCIe 5.0 ↔ Subsistema Gráfico (GOP Framebuffer)';
    if (step >= 16 && step <= 21) return 'Firmware ↔ Almacenamiento (GPT / EFI System Partition)';
    if (step >= 22 && step <= 34) return 'Almacenamiento ➔ Bootloader ➔ Kernel NT ➔ Escritorio';
    return `${currentStep.initiator} ➔ ${currentStep.responder}`;
  };

  const getActiveSoftwareNode = () => {
    const step = currentStep.stepNumber;
    if (step < 22) return null;
    if (step === 22) return 'bootmgr';
    if (step === 23) return 'winload';
    if (step === 24 || step === 25) return 'kernel';
    if (step === 26 || step === 27) return 'drivers';
    if (step === 28 || step === 29) return 'smss';
    if (step === 30) return 'services';
    if (step === 31 || step === 32) return 'logon';
    if (step >= 33) return 'desktop';
    return null;
  };

  const activeSoftNode = getActiveSoftwareNode();

  // EZ Debug LED calculation
  const getDebugLeds = () => {
    const step = currentStep.stepNumber;
    if (!isPoweredOn || step < 5) {
      return { cpu: false, dram: false, vga: false, boot: false };
    }
    if (isFailed) {
      if ([5, 6, 7, 8, 9].includes(step)) return { cpu: true, dram: false, vga: false, boot: false };
      if ([10, 11, 12, 13].includes(step)) return { cpu: false, dram: true, vga: false, boot: false };
      if ([14, 15].includes(step)) return { cpu: false, dram: false, vga: true, boot: false };
      if ([16, 17, 18, 19, 20].includes(step)) return { cpu: false, dram: false, vga: false, boot: true };
    }
    if (step >= 5 && step <= 9) return { cpu: true, dram: false, vga: false, boot: false };
    if (step >= 10 && step <= 13) return { cpu: false, dram: true, vga: false, boot: false };
    if (step >= 14 && step <= 15) return { cpu: false, dram: false, vga: true, boot: false };
    if (step >= 16 && step <= 20) return { cpu: false, dram: false, vga: false, boot: true };
    return { cpu: false, dram: false, vga: false, boot: false };
  };

  const debugLeds = getDebugLeds();

  // Dynamic ViewBox for tight framing with zero wasted margins
  const getViewBox = () => {
    switch (focusZone) {
      case 'CPU_VRM':
        return '110 15 570 480';
      case 'RAM_ATX':
        return '670 40 310 490';
      case 'PCIE_M2':
        return '110 470 660 480';
      case 'CHIPSET_BIOS':
        return '470 600 510 570';
      case 'ALL':
      default:
        return '0 0 1000 1200';
    }
  };

  const handleSelectComponent = (key: string) => {
    setSelectedComponentKey(key);
  };

  const currentSelectedEdu = COMPONENT_EDU_INFO[selectedComponentKey] || COMPONENT_EDU_INFO.cpu;

  return (
    <div className="w-full bg-[#05070c] border-2 border-zinc-800 rounded-2xl p-3 sm:p-5 relative overflow-hidden font-mono-tech shadow-2xl select-none">
      
      {/* High-Contrast CSS Keyframes */}
      <style>{`
        @keyframes evoSignalPulse {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-signal-flow {
          stroke-dasharray: 8 6;
          animation: evoSignalPulse 1.1s linear infinite;
        }
        @keyframes pcbHighContrastTrace {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.95; }
        }
        .pcb-trace-glow {
          animation: pcbHighContrastTrace 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Background Technical Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* ========================================================================= */}
      {/* PROMINENT STAGE HEADER BANNER                                             */}
      {/* ========================================================================= */}
      <div className="pb-3 border-b border-zinc-800/90 mb-3 space-y-2 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
              ESTA ETAPA SE LLAMA:
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white font-display uppercase tracking-wide">
              {currentStep.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase ${
                isFailed
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/60 animate-pulse'
                  : ''
              }`}
              style={{
                backgroundColor: !isFailed ? `${currentStep.layerColor}25` : undefined,
                color: !isFailed ? currentStep.layerColor : undefined,
                border: !isFailed ? `1px solid ${currentStep.layerColor}60` : undefined,
              }}
            >
              {!isPoweredOn ? 'OFF' : isFailed ? 'DETENCIÓN EN ESTADO' : currentStep.powerState}
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono-tech">
              PASO {String(currentStep.stepNumber).padStart(2, '0')} / 34
            </span>
          </div>
        </div>

        {/* Live Traveling Signal Box */}
        <div className={`p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
          isFailed
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            : 'bg-zinc-950/90 border-zinc-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">AHORA ESTÁ OCURRIENDO:</span>
            <strong className={`${isFailed ? 'text-rose-300' : 'text-cyan-300'} text-[11px] font-mono`}>
              {getStepActionFlow()}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            {isFailed ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" /> : <Zap className="w-3.5 h-3.5 animate-bounce" />}
            <span>SEÑAL: <strong>{getStepSignalTitle()}</strong></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOOLBAR SUPERIOR: ZOOM & ZONAS DE ENFOQUE LGA1700 + DDR5                  */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1 relative z-10 text-xs">
        <div className="flex items-center gap-2">
          <CircuitBoard className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-[10.5px] font-bold text-white uppercase tracking-wider">
            PLACA BASE ATX Z790 // ARQUITECTURA LGA1700 + DDR5
          </span>
        </div>

        {/* Quick Focus Zones buttons */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-[9.5px] font-mono">
          <span className="text-zinc-400 text-[9px] uppercase mr-1 hidden md:inline font-bold">ZONA:</span>
          {(['ALL', 'CPU_VRM', 'RAM_ATX', 'PCIE_M2', 'CHIPSET_BIOS'] as FocusZone[]).map((zone) => {
            const labels: Record<FocusZone, string> = {
              ALL: 'PLACA COMPLETA',
              CPU_VRM: 'LGA1700 & VRM',
              RAM_ATX: 'DDR5 & ATX 24P',
              PCIE_M2: 'PCIe 5.0 & M.2',
              CHIPSET_BIOS: 'Z790 PCH & BIOS',
            };
            return (
              <button
                key={zone}
                type="button"
                onClick={() => setFocusZone(zone)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer border ${
                  focusZone === zone
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:text-white hover:border-zinc-600'
                }`}
              >
                {labels[zone]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUADRO CENTRAL: CANVAS VECTORIAL DE ALTA DENSIDAD & CONTRASTE             */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#060911] border-2 border-zinc-700 rounded-2xl p-2 sm:p-3 overflow-hidden shadow-2xl z-10">
        
        {/* Contenedor SVG Maximizado: reduce vacíos y optimiza visibilidad */}
        <div className="relative w-full aspect-[1000/1200] min-h-[480px] max-h-[720px] mx-auto bg-[#050811] border border-zinc-700/90 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          
          <svg
            className="w-full h-full object-contain cursor-crosshair transition-all duration-300"
            viewBox={getViewBox()}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Premium Glow Filters */}
              <filter id="atx-glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="atx-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="atx-glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="atx-glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="atx-soft-shadow" x="-5%" y="-5%" width="115%" height="115%">
                <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.85" />
              </filter>

              {/* Realistic Material Gradients */}
              <linearGradient id="atx-metal-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0b0f19" />
                <stop offset="30%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#334155" />
                <stop offset="85%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0b0f19" />
              </linearGradient>

              <linearGradient id="atx-metal-fin" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0a0e18" />
                <stop offset="50%" stopColor="#243044" />
                <stop offset="100%" stopColor="#0a0e18" />
              </linearGradient>

              <linearGradient id="atx-steel-armor" x1="0%" y1="0%" x2="100%" y2="60%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="25%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="75%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              <linearGradient id="atx-gold-flash" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="65%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              <linearGradient id="atx-heatpipe-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="35%" stopColor="#cbd5e1" />
                <stop offset="60%" stopColor="#f1f5f9" />
                <stop offset="85%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              <linearGradient id="atx-choke-body" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#141417" />
                <stop offset="40%" stopColor="#27272a" />
                <stop offset="70%" stopColor="#3f3f46" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>

              <radialGradient id="atx-cr2032" cx="42%" cy="38%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#e2e8f0" />
                <stop offset="75%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#334155" />
              </radialGradient>

              <linearGradient id="atx-pch-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#08101e" />
                <stop offset="30%" stopColor="#111d33" />
                <stop offset="60%" stopColor="#1e3458" />
                <stop offset="80%" stopColor="#14223d" />
                <stop offset="100%" stopColor="#091222" />
              </linearGradient>

              <linearGradient id="atx-m2-shield" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d1424" />
                <stop offset="50%" stopColor="#1f2d47" />
                <stop offset="100%" stopColor="#121b2d" />
              </linearGradient>

              {/* Textura de Fibra de Vidrio PCB de Alto Contraste & Malla de Pistas */}
              <pattern id="pcb-weave-dense" width="12" height="12" patternUnits="userSpaceOnUse">
                <rect width="12" height="12" fill="#080c14" />
                <path d="M 0 6 L 12 6 M 6 0 L 6 12" stroke="#101826" strokeWidth="0.8" />
                <circle cx="6" cy="6" r="0.9" fill="#182338" />
              </pattern>

              {/* Matriz Micro-Pines LGA */}
              <pattern id="lga-pin-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.1" fill="#ca8a04" opacity="0.75" />
                <circle cx="3" cy="3" r="0.5" fill="#fef08a" opacity="0.9" />
              </pattern>
            </defs>

            {/* =================================================================== */}
            {/* 1. SUSTRATO PCB NEGRO MATE ATX (305mm x 244mm)                      */}
            {/* =================================================================== */}
            <rect x="15" y="10" width="970" height="1180" rx="14" fill="url(#pcb-weave-dense)" stroke="#334155" strokeWidth="3.5" />
            <rect x="19" y="14" width="962" height="1172" rx="11" fill="none" stroke="#1e293b" strokeWidth="1" />

            {/* Serigrafía de Marca Técnica & Especificaciones */}
            <g opacity="0.9">
              <text x="35" y="40" fill="#f8fafc" fontSize="13" fontWeight="900" letterSpacing="1.5">EVO LABS</text>
              <text x="125" y="40" fill="#38bdf8" fontSize="11" fontWeight="bold">MAGNUS Z790 // ARQUITECTURA LGA1700 + DDR5</text>
              <text x="35" y="52" fill="#64748b" fontSize="7.5" fontWeight="bold">
                ATX FORM FACTOR (305×244mm) • 8-LAYER HIGH-TG SERVER-GRADE PCB • REV 2.4
              </text>
            </g>

            {/* Rutas de Pistas de Cobre Pulido en Ángulos de 45° & Serpentinas */}
            <g stroke="#38bdf8" strokeWidth="1.3" opacity="0.7" fill="none" className="pcb-trace-glow">
              {/* Bus IMC -> DDR5 Channel A/B Serpentines */}
              <path d="M 630 190 L 660 190 L 675 175 L 695 175" />
              <path d="M 630 210 L 655 210 L 670 195 L 695 195" />
              <path d="M 630 230 L 660 230 L 670 240 L 695 240" />
              <path d="M 630 250 L 655 250 L 665 260 L 695 260" />
              <path d="M 630 310 L 660 310 L 675 325 L 695 325" />
              <path d="M 630 330 L 655 330 L 670 345 L 695 345" />
              <path d="M 630 350 L 660 350 L 675 365 L 695 365" />
              <path d="M 630 370 L 655 370 L 670 385 L 695 385" />
              {/* Bus CPU -> PCIe 5.0 Root Lines */}
              <path d="M 430 495 L 430 568" />
              <path d="M 450 495 L 450 568" />
              <path d="M 470 495 L 470 568" />
              <path d="M 490 495 L 490 568" />
              {/* Bus CPU -> Z790 DMI 4.0 Lines */}
              <path d="M 530 495 L 530 635 L 720 635" />
              <path d="M 545 495 L 545 650 L 720 650" />
              {/* PCH -> SATA Lines */}
              <path d="M 850 865 L 850 920 L 920 920" />
              <path d="M 865 865 L 865 965 L 920 965" />
              {/* PCH -> SPI BIOS */}
              <path d="M 720 780 L 665 780 L 665 945" />
            </g>

            {/* 9 Orificios de Montaje Estandarizados ATX con Puntos de Soldadura Dorados */}
            {[
              [45, 45], [500, 45], [955, 45],
              [45, 580], [500, 580], [955, 580],
              [45, 1155], [500, 1155], [955, 1155],
            ].map(([hx, hy], idx) => (
              <g key={`hole-${idx}`} transform={`translate(${hx}, ${hy})`}>
                <circle r="15" fill="#78350f" opacity="0.5" />
                <circle r="11" fill="url(#atx-gold-flash)" stroke="#fef08a" strokeWidth="1.5" />
                <circle r="5" fill="#020617" stroke="#451a03" strokeWidth="1.2" />
                {/* Corona de contactos de tierra radiales */}
                {Array.from({ length: 8 }).map((_, rIdx) => {
                  const angle = (rIdx * 45 * Math.PI) / 180;
                  return (
                    <circle
                      key={`gnd-dot-${rIdx}`}
                      cx={Math.cos(angle) * 8.5}
                      cy={Math.sin(angle) * 8.5}
                      r="1.2"
                      fill="#fef08a"
                    />
                  );
                })}
                <text x="0" y="23" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="bold">STANDOFF</text>
              </g>
            ))}

            {/* =================================================================== */}
            {/* 2. REAR I/O SHIELD INTEGRADO (X: 25-125, Y: 60-460)                  */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('rear_io')}
              className="cursor-pointer transition-all hover:opacity-95"
              filter="url(#atx-soft-shadow)"
            >
              {/* Carcasa exterior blindada de acero */}
              <rect x="25" y="60" width="100" height="400" rx="5" fill="url(#atx-metal-dark)" stroke="#475569" strokeWidth="2.5" />
              <rect x="28" y="63" width="94" height="394" rx="3" fill="none" stroke="#334155" strokeWidth="1" />
              
              <text x="75" y="80" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="900" letterSpacing="1">I/O SHIELD</text>
              <text x="75" y="91" textAnchor="middle" fill="#38bdf8" fontSize="6.5" fontWeight="bold">PRE-INSTALLED STEEL</text>

              {/* Botón BIOS Flashback & Clear CMOS */}
              <g transform="translate(35, 103)">
                <rect width="36" height="22" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <circle cx="18" cy="11" r="5" fill="#dc2626" stroke="#f87171" strokeWidth="1" />
                <text x="44" y="14" fill="#94a3b8" fontSize="6" fontWeight="bold">FLASHBACK</text>
              </g>

              {/* Puertos USB 3.2 Gen 2 (Azul y Rojo) */}
              <g transform="translate(35, 135)">
                <rect width="40" height="23" rx="2" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <rect x="4" y="5" width="32" height="13" fill="#020617" />
                <rect x="8" y="9" width="24" height="4" fill="#3b82f6" />
                <text x="47" y="15" fill="#60a5fa" fontSize="6.5" fontWeight="bold">USB 3.2</text>
              </g>
              <g transform="translate(35, 166)">
                <rect width="40" height="23" rx="2" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
                <rect x="4" y="5" width="32" height="13" fill="#020617" />
                <rect x="8" y="9" width="24" height="4" fill="#ef4444" />
                <text x="47" y="15" fill="#f87171" fontSize="6.5" fontWeight="bold">10Gbps</text>
              </g>

              {/* Puerto Type-C 20Gbps (USB 3.2 Gen 2x2) */}
              <g transform="translate(35, 198)">
                <rect width="38" height="17" rx="8" fill="#090d16" stroke="url(#atx-steel-armor)" strokeWidth="1.5" />
                <rect x="6" y="6" width="26" height="5" rx="2.5" fill="#334155" />
                <text x="47" y="12" fill="#e2e8f0" fontSize="6.5" fontWeight="bold">TYPE-C 20G</text>
              </g>

              {/* Puerto LAN 2.5G RJ-45 con LEDs de Actividad */}
              <g transform="translate(35, 224)">
                <rect width="42" height="32" rx="2" fill="url(#atx-metal-dark)" stroke="#64748b" strokeWidth="1.5" />
                <rect x="6" y="8" width="30" height="18" rx="1.5" fill="#020617" stroke="#334155" strokeWidth="1" />
                <circle cx="9" cy="5" r="2" fill="#22c55e" />
                <circle cx="33" cy="5" r="2" fill="#f59e0b" />
                <text x="48" y="20" fill="#22c55e" fontSize="6.5" fontWeight="bold">2.5G LAN</text>
              </g>

              {/* Salidas de Video Digital HDMI / DisplayPort */}
              <g transform="translate(35, 266)">
                <rect width="42" height="22" rx="2" fill="#090d16" stroke="url(#atx-steel-armor)" strokeWidth="1.2" />
                <polygon points="6,16 36,16 32,8 10,8" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
                <text x="48" y="15" fill="#94a3b8" fontSize="6.5" fontWeight="bold">DP / HDMI</text>
              </g>

              {/* Conectores Dorados de Audio Jack HD 7.1 con Anillo Dorado */}
              {[305, 335, 365, 395, 425].map((jy, i) => (
                <g key={`io-jack-${i}`} transform={`translate(75, ${jy})`}>
                  <circle r="12" fill="#0f172a" stroke="url(#atx-gold-flash)" strokeWidth="2.5" />
                  <circle r="7" fill="#020617" stroke="#334155" strokeWidth="1" />
                  <circle r="3" fill="#000000" />
                </g>
              ))}
            </g>

            {/* =================================================================== */}
            {/* 3. DUAL EPS 12V 8-PIN CPU POWER (X: 135-265, Y: 25-75)              */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('eps')}
              className="cursor-pointer"
              filter={isComponentActive('eps') ? 'url(#atx-glow-amber)' : 'url(#atx-soft-shadow)'}
            >
              {/* Conector EPS 1 (8 Pines) */}
              <rect
                x="135"
                y="25"
                width="60"
                height="45"
                rx="3.5"
                fill="#18181b"
                stroke={isComponentActive('eps') ? '#f59e0b' : '#64748b'}
                strokeWidth={isComponentActive('eps') ? 2.5 : 1.5}
              />
              {/* Conector EPS 2 (8 Pines Auxiliar) */}
              <rect
                x="200"
                y="25"
                width="60"
                height="45"
                rx="3.5"
                fill="#18181b"
                stroke={isComponentActive('eps') ? '#f59e0b' : '#64748b'}
                strokeWidth={isComponentActive('eps') ? 2.5 : 1.5}
              />
              <text x="198" y="19" textAnchor="middle" fill={isComponentActive('eps') ? '#fbbf24' : '#cbd5e1'} fontSize="8" fontWeight="bold">
                CPU_PWR1 / CPU_PWR2 (2× 8-PIN EPS 12V)
              </text>
              {/* Rampas mecánicas superiores de traba */}
              <rect x="155" y="21" width="20" height="6" fill="#52525b" stroke="#71717a" strokeWidth="0.8" rx="1" />
              <rect x="220" y="21" width="20" height="6" fill="#52525b" stroke="#71717a" strokeWidth="0.8" rx="1" />
              
              {/* Terminales hembra con perfil polarizado (cuadrados y biselados) */}
              {[0, 1, 2, 3].map((c) => (
                <g key={`eps1-pin-${c}`}>
                  {/* Fila Superior */}
                  <rect x={140 + c * 13} y="31" width="10" height="14" fill="#09090b" stroke="#71717a" strokeWidth="1" rx="1" />
                  {/* Fila Inferior */}
                  <rect x={140 + c * 13} y="48" width="10" height="14" fill="#09090b" stroke="#71717a" strokeWidth="1" rx="1" />
                  {/* EPS 2 Fila Superior */}
                  <rect x={205 + c * 13} y="31" width="10" height="14" fill="#09090b" stroke="#71717a" strokeWidth="1" rx="1" />
                  {/* EPS 2 Fila Inferior */}
                  <rect x={205 + c * 13} y="48" width="10" height="14" fill="#09090b" stroke="#71717a" strokeWidth="1" rx="1" />
                  
                  {/* Pines dorados interiores que se iluminan al energizar */}
                  {isComponentActive('eps') ? (
                    <>
                      <circle cx={145 + c * 13} cy="38" r="2.8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" />
                      <circle cx={145 + c * 13} cy="55" r="2.8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" />
                      <circle cx={210 + c * 13} cy="38" r="2.8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" />
                      <circle cx={210 + c * 13} cy="55" r="2.8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" />
                    </>
                  ) : (
                    <>
                      <circle cx={145 + c * 13} cy="38" r="2" fill="#52525b" />
                      <circle cx={145 + c * 13} cy="55" r="2" fill="#52525b" />
                      <circle cx={210 + c * 13} cy="38" r="2" fill="#52525b" />
                      <circle cx={210 + c * 13} cy="55" r="2.8" fill="#52525b" />
                    </>
                  )}
                </g>
              ))}
            </g>

            {/* =================================================================== */}
            {/* 4. VRM 16+1+1 FASES & DISIPADORES MACIZOS DE ALUMINIO                */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('vrm')}
              className="cursor-pointer"
              filter={isComponentActive('vrm') ? 'url(#atx-glow-amber)' : 'url(#atx-soft-shadow)'}
            >
              {/* Disipador Superior Maquinado CNC */}
              <rect
                x="268"
                y="20"
                width="405"
                height="100"
                rx="6"
                fill="url(#atx-metal-dark)"
                stroke={isComponentActive('vrm') ? (isFailed && currentStep.stepNumber === 4 ? '#f43f5e' : '#f59e0b') : '#475569'}
                strokeWidth={isComponentActive('vrm') ? 2.8 : 1.8}
              />
              {/* Ranurado térmico con aletas profundas */}
              {Array.from({ length: 15 }).map((_, f) => (
                <line key={`vfin-top-${f}`} x1={280 + f * 26} y1="26" x2={298 + f * 26} y2="114" stroke="#0a0e18" strokeWidth="3" />
              ))}
              <text x="470" y="68" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="900" letterSpacing="1.5">
                16+1+1 POWER PHASES // DrMOS 70A
              </text>
              <text x="470" y="85" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
                DIGITAL PWM RAA229131 CONTROLLER • DIRECT 12V
              </text>

              {/* Disipador Lateral Izquierdo */}
              <rect
                x="135"
                y="95"
                width="135"
                height="380"
                rx="6"
                fill="url(#atx-metal-dark)"
                stroke={isComponentActive('vrm') ? (isFailed && currentStep.stepNumber === 4 ? '#f43f5e' : '#f59e0b') : '#475569'}
                strokeWidth={isComponentActive('vrm') ? 2.8 : 1.8}
              />
              {Array.from({ length: 11 }).map((_, f) => (
                <line key={`vfin-side-${f}`} x1="145" y1={115 + f * 32} x2="258" y2={132 + f * 32} stroke="#090d16" strokeWidth="3.5" />
              ))}
              <text x="202" y="290" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontWeight="900" letterSpacing="1" transform="rotate(-90, 202, 290)">
                MAGNUS EXTENDED VRM ARMOR
              </text>

              {/* Heatpipe de Cobre Niquelado con Curvatura Suave */}
              <path d="M 235 440 L 235 90 Q 235 55 270 55 L 650 55" fill="none" stroke="url(#atx-heatpipe-grad)" strokeWidth="7" strokeLinecap="round" />
              <path d="M 235 440 L 235 90 Q 235 55 270 55 L 650 55" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

              {/* 8 Chokes de Ferrita R22 Blindados + 8 Capacitores Sólidos de 5K + DrMOS */}
              {[130, 175, 220, 265, 310, 355, 400, 445].map((cy, i) => (
                <g key={`choke-${i}`} transform={`translate(280, ${cy})`}>
                  {/* DrMOS Power Stage IC */}
                  <rect x="-8" y="4" width="6" height="18" rx="1" fill="#09090b" stroke="#71717a" strokeWidth="0.6" />
                  
                  {/* Choke R22 Inductor de Ferrita */}
                  <rect x="0" y="0" width="26" height="26" rx="3.5" fill="url(#atx-choke-body)" stroke="#71717a" strokeWidth="1.2" />
                  <rect x="2" y="2" width="22" height="22" rx="2" fill="none" stroke="#3f3f46" strokeWidth="0.8" />
                  <text x="13" y="16.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">R22</text>
                  
                  {/* Capacitor Sólido Polímero Negro 5K */}
                  <circle cx="38" cy="13" r="9" fill="#18181b" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="38" cy="13" r="6.5" fill="#27272a" />
                  <path d="M 32 13 A 6 6 0 0 1 44 13" stroke="#f59e0b" strokeWidth="1.8" fill="none" />
                </g>
              ))}
            </g>

            {/* =================================================================== */}
            {/* 5. ZÓCALO CPU LGA1700 AUTÉNTICO (X: 335-650, Y: 135-485)            */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('cpu')}
              className="cursor-pointer"
              filter={isComponentActive('cpu') ? 'url(#atx-glow-emerald)' : 'url(#atx-soft-shadow)'}
            >
              {/* Marco Metálico ILM de Acero Inoxidable (Independent Loading Mechanism) */}
              <rect
                x="335"
                y="135"
                width="315"
                height="350"
                rx="10"
                fill="url(#atx-metal-dark)"
                stroke={
                  isComponentActive('cpu')
                    ? isFailed && [6, 7, 8, 9, 10, 12, 13].includes(currentStep.stepNumber)
                      ? '#f43f5e'
                      : '#10b981'
                    : '#64748b'
                }
                strokeWidth={isComponentActive('cpu') ? 3.5 : 2}
              />
              <rect x="340" y="140" width="305" height="340" rx="8" fill="none" stroke="#334155" strokeWidth="1" />

              {/* Palanca de Retención Metálica (Lever Arm) & Clip de Traba */}
              <rect x="655" y="145" width="11" height="315" rx="5" fill="url(#atx-steel-armor)" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="660" cy="460" r="10" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="652" y="455" width="16" height="10" rx="2" fill="#334155" />

              {/* 3 Tornillos Torx T20 de Fijación ILM */}
              <g transform="translate(360, 155)">
                <circle r="7.5" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M -3 -3 L 3 3 M -3 3 L 3 -3" stroke="#f1f5f9" strokeWidth="1.2" />
              </g>
              <g transform="translate(625, 155)">
                <circle r="7.5" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M -3 -3 L 3 3 M -3 3 L 3 -3" stroke="#f1f5f9" strokeWidth="1.2" />
              </g>
              <g transform="translate(492, 468)">
                <circle r="7.5" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M -3 -3 L 3 3 M -3 3 L 3 -3" stroke="#f1f5f9" strokeWidth="1.2" />
              </g>

              {/* Cavidad del Socket con Matriz de Pines LGA Dorados */}
              <rect x="360" y="160" width="265" height="300" rx="6" fill="#090d16" stroke="#475569" strokeWidth="1.5" />
              <rect x="366" y="166" width="253" height="288" rx="4" fill="url(#lga-pin-mesh)" opacity="0.6" />

              {/* IHS Alargado Rectangular de LGA1700 (37.5 × 45 mm) con Acabado Níquel Cepillado */}
              <g transform="translate(378, 175)">
                {/* Cuerpo del Difusor Térmico de Cobre Niquelado */}
                <rect x="0" y="0" width="230" height="270" rx="9" fill="url(#atx-metal-dark)" stroke="url(#atx-steel-armor)" strokeWidth="2.5" />
                <rect x="4" y="4" width="222" height="262" rx="7" fill="none" stroke="#475569" strokeWidth="0.8" />

                {/* Muescas laterales de orientación LGA1700 */}
                <circle cx="0" cy="135" r="7.5" fill="#090d16" stroke="#334155" strokeWidth="1" />
                <circle cx="230" cy="135" r="7.5" fill="#090d16" stroke="#334155" strokeWidth="1" />

                {/* Triángulo Dorado de Pin 1 (Esquina Inferior Izquierda en LGA1700) */}
                <polygon points="12,258 26,258 12,244" fill="url(#atx-gold-flash)" stroke="#ca8a04" strokeWidth="1" />

                {/* Grabado Láser Oficial en el IHS */}
                <text x="115" y="52" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" letterSpacing="1.2">
                  INTEL® CORE™ COMPATIBLE
                </text>
                <text x="115" y="76" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                  LGA1700 // SOCKET V ARCHITECTURE
                </text>
                <text x="115" y="98" textAnchor="middle" fill="#cbd5e1" fontSize="8.5" fontWeight="bold">
                  HYBRID ARCHITECTURE (P-CORE + E-CORE)
                </text>
                <text x="115" y="118" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                  INTEGRATED MEMORY CONTROLLER (DDR5)
                </text>
                <text x="115" y="138" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="bold">
                  PCIe 5.0 (16 LANES) • DMI 4.0 (8 LANES)
                </text>

                {/* 2D DataMatrix Laser Etch & Micro-Serial */}
                <g transform="translate(180, 175)">
                  <rect width="36" height="36" fill="#0a0f1d" stroke="#64748b" strokeWidth="1" />
                  <rect x="4" y="4" width="10" height="10" fill="#ffffff" />
                  <rect x="20" y="8" width="8" height="8" fill="#ffffff" />
                  <rect x="8" y="22" width="6" height="6" fill="#ffffff" />
                  <rect x="22" y="20" width="10" height="10" fill="#ffffff" />
                </g>

                {/* Indicador de Estado Operativo */}
                <rect x="35" y="195" width="140" height="28" rx="5" fill="#090d16" stroke={isComponentActive('cpu') ? '#10b981' : '#64748b'} strokeWidth="1.8" />
                <text
                  x="105"
                  y="213"
                  textAnchor="middle"
                  fill={isComponentActive('cpu') ? '#34d399' : '#94a3b8'}
                  fontSize="9.5"
                  fontWeight="bold"
                >
                  {!isPoweredOn ? '● REPOSO (0V)' : currentStep.stepNumber < 6 ? '● RESET# ACTIVO' : '● PIPELINE ACTIVO'}
                </text>
              </g>
            </g>

            {/* =================================================================== */}
            {/* 6. 4x SLOTS DDR5 DIMM (X: 685-885, Y: 85-535)                      */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('ram')}
              className="cursor-pointer"
              filter={isComponentActive('ram') ? 'url(#atx-glow-cyan)' : 'url(#atx-soft-shadow)'}
            >
              <text x="785" y="72" textAnchor="middle" fill={isComponentActive('ram') ? '#60a5fa' : '#f8fafc'} fontSize="10.5" fontWeight="bold">
                4x DDR5 DIMM (DUAL-CH 7200+ MT/s)
              </text>

              {[
                { name: 'DIMM_A1', x: 695, color: '#0f172a', isPri: false },
                { name: 'DIMM_A2 (PRI)', x: 745, color: '#1e3a8a', isPri: true },
                { name: 'DIMM_B1', x: 795, color: '#0f172a', isPri: false },
                { name: 'DIMM_B2 (PRI)', x: 845, color: '#1e3a8a', isPri: true },
              ].map((dimm, dIdx) => (
                <g key={`dimm5-${dIdx}`}>
                  {/* Cuerpo del Slot DDR5 con fijación superficial SMT */}
                  <rect
                    x={dimm.x}
                    y="88"
                    width="32"
                    height="440"
                    rx="3.5"
                    fill={dimm.color}
                    stroke={
                      isComponentActive('ram')
                        ? isFailed && [11, 12].includes(currentStep.stepNumber)
                          ? '#f43f5e'
                          : '#3b82f6'
                        : '#64748b'
                    }
                    strokeWidth={isComponentActive('ram') ? 2.5 : 1.5}
                  />

                  {/* Traba Superior Unilateral Q-Latch de DDR5 con textura */}
                  <polygon points={`${dimm.x},88 ${dimm.x + 32},88 ${dimm.x + 24},106 ${dimm.x + 8},106`} fill="url(#atx-steel-armor)" stroke="#475569" strokeWidth="1" />
                  <circle cx={dimm.x + 16} cy="96" r="2.5" fill="#1e293b" />
                  
                  {/* Guía Inferior Fija de DDR5 */}
                  <rect x={dimm.x + 4} y="514" width="24" height="14" rx="2" fill="#334155" stroke="#475569" strokeWidth="0.8" />

                  {/* Muesca Asimétrica Específica de DDR5 (Key Notch en Y: 325) */}
                  <rect x={dimm.x + 2} y="325" width="28" height="9" fill="#050811" />

                  {/* Carril de Pines Dorados DDR5 (288 pines SMT) */}
                  <line x1={dimm.x + 16} y1="112" x2={dimm.x + 16} y2="320" stroke="url(#atx-gold-flash)" strokeWidth="3" strokeDasharray="2 3" />
                  <line x1={dimm.x + 16} y1="338" x2={dimm.x + 16} y2="510" stroke="url(#atx-gold-flash)" strokeWidth="3" strokeDasharray="2 3" />

                  {/* Array de Capacitores SMD Cerámicos de Desacoplo DDR5 */}
                  {[140, 200, 260, 380, 440].map((smdY, sI) => (
                    <rect key={`smd-${sI}`} x={dimm.x - 5} y={smdY} width="4" height="8" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />
                  ))}

                  {/* Etiqueta de Canal con badge de prioridad */}
                  <text x={dimm.x + 16} y="542" textAnchor="middle" fill={dimm.isPri ? '#38bdf8' : '#cbd5e1'} fontSize="7.5" fontWeight="bold">
                    {dimm.name}
                  </text>
                </g>
              ))}
            </g>

            {/* =================================================================== */}
            {/* 7. CONECTOR PRINCIPAL ATX DE 24 PINES (X: 910-975, Y: 170-455)       */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('atx')}
              className="cursor-pointer"
              filter={isComponentActive('atx') ? 'url(#atx-glow-amber)' : 'url(#atx-soft-shadow)'}
            >
              <rect
                x="910"
                y="170"
                width="60"
                height="285"
                rx="4.5"
                fill="#18181b"
                stroke={isComponentActive('atx') ? '#f59e0b' : '#64748b'}
                strokeWidth={isComponentActive('atx') ? 2.8 : 1.8}
              />
              <text x="940" y="160" textAnchor="middle" fill={isComponentActive('atx') ? '#fbbf24' : '#f8fafc'} fontSize="9" fontWeight="bold">
                24-PIN ATX
              </text>
              {/* Presilla Lateral de Enganche ATX Mecánica */}
              <rect x="902" y="270" width="8" height="90" rx="2" fill="#52525b" stroke="#71717a" strokeWidth="1" />
              <circle cx="906" cy="315" r="2.5" fill="#18181b" />
              
              {/* 24 Pines con Clave Alternada Cuadrada / Biselada */}
              {Array.from({ length: 12 }).map((_, pIdx) => (
                <g key={`atx24-pin-${pIdx}`}>
                  <rect x="918" y={180 + pIdx * 22} width="18" height="17" rx="1.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
                  <rect x="944" y={180 + pIdx * 22} width="18" height="17" rx="1.5" fill="#09090b" stroke="#71717a" strokeWidth="1" />
                  {isComponentActive('atx') && (
                    <>
                      <circle cx={927} cy={188.5 + pIdx * 22} r="3.2" fill={pIdx === 8 ? '#c084fc' : '#fbbf24'} />
                      <circle cx={953} cy={188.5 + pIdx * 22} r="3.2" fill={pIdx === 3 ? '#22c55e' : '#fbbf24'} />
                    </>
                  )}
                </g>
              ))}
            </g>

            {/* =================================================================== */}
            {/* 8. PANEL DE 4 EZ DEBUG LEDs (X: 910-975, Y: 100-155)                */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('debug_led')}
              className="cursor-pointer"
            >
              <rect x="910" y="100" width="60" height="55" rx="3.5" fill="#090d16" stroke="#475569" strokeWidth="1.8" />
              <text x="940" y="93" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="bold">EZ DEBUG</text>

              {/* 4 LEDs: CPU, DRAM, VGA, BOOT */}
              {[
                { name: 'CPU', y: 110, active: debugLeds.cpu, color: '#ef4444' },
                { name: 'DRAM', y: 122, active: debugLeds.dram, color: '#eab308' },
                { name: 'VGA', y: 134, active: debugLeds.vga, color: '#38bdf8' },
                { name: 'BOOT', y: 146, active: debugLeds.boot, color: '#22c55e' },
              ].map((led, lIdx) => (
                <g key={`debug-led-sharp-${lIdx}`}>
                  <circle
                    cx="921"
                    cy={led.y}
                    r="4.2"
                    fill={led.active ? led.color : '#27272a'}
                    stroke={led.active ? '#ffffff' : '#52525b'}
                    strokeWidth="1.2"
                    filter={led.active ? 'url(#atx-glow-amber)' : 'none'}
                    className={led.active && isFailed ? 'animate-pulse' : ''}
                  />
                  <text x="932" y={led.y + 3} fill={led.active ? '#ffffff' : '#94a3b8'} fontSize="7.5" fontWeight="bold">
                    {led.name}
                  </text>
                </g>
              ))}
            </g>

            {/* =================================================================== */}
            {/* 9. SLOT M.2_1 NVMe PCIe 5.0 x4 CON THERMAL ARMOR (X: 195-675, Y: 495)*/}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('m2')}
              className="cursor-pointer"
              filter={isComponentActive('m2') ? 'url(#atx-glow-emerald)' : 'url(#atx-soft-shadow)'}
            >
              {/* Disipador de Aluminio Ranurado M.2 Shield Frozr */}
              <rect
                x="195"
                y="495"
                width="480"
                height="54"
                rx="5"
                fill="url(#atx-m2-shield)"
                stroke={isComponentActive('m2') ? '#10b981' : '#475569'}
                strokeWidth={isComponentActive('m2') ? 2.5 : 1.5}
              />
              <rect x="198" y="498" width="474" height="48" rx="3" fill="none" stroke="#334155" strokeWidth="0.8" />
              
              {/* Ranuras térmicas mecanizadas CNC */}
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <line key={`m2-groove-${idx}`} x1={220 + idx * 75} y1="502" x2={270 + idx * 75} y2="542" stroke="#080d18" strokeWidth="3.5" />
              ))}
              <text x="435" y="527" textAnchor="middle" fill="#f8fafc" fontSize="10.5" fontWeight="900" letterSpacing="0.8">
                M.2_1 (CPU DIRECT PCIe 5.0 ×4) // SHIELD FROZR 2280
              </text>
              {/* Conector M.2 M-Key a la Izquierda */}
              <rect x="198" y="502" width="18" height="40" fill="#020617" stroke="#64748b" strokeWidth="1" />
              {/* Tornillo EZ M.2 Latch Moledado a la Derecha */}
              <circle cx="660" cy="522" r="8" fill="url(#atx-steel-armor)" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="660" cy="522" r="3.5" fill="#020617" />
            </g>

            {/* =================================================================== */}
            {/* 10. RANURAS PCIe (PCIe 5.0 x16 REFORZADA CON ACERO + EXPANSIONES)   */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('pcie')}
              className="cursor-pointer"
              filter={isComponentActive('pcie') ? 'url(#atx-glow-cyan)' : 'url(#atx-soft-shadow)'}
            >
              <text x="435" y="560" textAnchor="middle" fill={isComponentActive('pcie') ? '#a5b4fc' : '#f8fafc'} fontSize="10" fontWeight="bold">
                PCI_E1 // PCIe 5.0 ×16 STEEL ARMOR (SAFESLOT dGPU)
              </text>
              {/* Ranura PCIe 1: Blindaje Macizo de Acero Inoxidable (SafeSlot) */}
              <rect
                x="150"
                y="568"
                width="565"
                height="48"
                rx="4.5"
                fill="url(#atx-steel-armor)"
                stroke={
                  isComponentActive('pcie')
                    ? isFailed && [14, 15].includes(currentStep.stepNumber)
                      ? '#f43f5e'
                      : '#6366f1'
                    : '#94a3b8'
                }
                strokeWidth={isComponentActive('pcie') ? 3 : 2}
              />
              {/* Muesca divisoria física de PCIe (separación de 11 pines de alimentación y 71 pines de datos) */}
              <rect x="165" y="585" width="60" height="14" fill="#090d16" />
              <rect x="235" y="585" width="430" height="14" fill="#090d16" />
              <line x1="168" y1="592" x2="222" y2="592" stroke="url(#atx-gold-flash)" strokeWidth="2.8" strokeDasharray="3 3" />
              <line x1="238" y1="592" x2="660" y2="592" stroke="url(#atx-gold-flash)" strokeWidth="2.8" strokeDasharray="3 3" />
              
              {/* Traba Q-Release Reforzada con Pestillo Mecánico en el Extremo Derecho */}
              <polygon points="695,568 730,568 722,616 695,616" fill="url(#atx-steel-armor)" stroke="#475569" strokeWidth="1.5" />
              <circle cx="710" cy="592" r="4.5" fill="#334155" stroke="#cbd5e1" strokeWidth="1" />

              {/* Ranura PCIe x1 Secundaria (PCI_E2) */}
              <text x="240" y="694" fill="#94a3b8" fontSize="8" fontWeight="bold">PCI_E2 (PCIe 3.0 ×1)</text>
              <rect x="150" y="700" width="180" height="36" rx="3" fill="#18181b" stroke="#475569" strokeWidth="1.5" />
              <rect x="162" y="713" width="155" height="10" fill="#090d16" />

              {/* Ranura PCIe x16 Secundaria (PCI_E3 - Enlazada al PCH) */}
              <text x="435" y="805" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                PCI_E3 // PCIe 4.0 ×16 (PCH BUS ×4)
              </text>
              <rect x="150" y="810" width="565" height="44" rx="3.5" fill="#18181b" stroke="#64748b" strokeWidth="1.8" />
              <rect x="165" y="826" width="500" height="12" fill="#090d16" stroke="#334155" strokeWidth="1" />
              <polygon points="695,810 722,810 715,854 695,854" fill="#52525b" />
            </g>

            {/* =================================================================== */}
            {/* 11. BATERÍA CR2032 3V CMOS & JUMPER CLEAR CMOS                      */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('cmos')}
              className="cursor-pointer"
              filter="url(#atx-soft-shadow)"
            >
              {/* Zócalo Metálico Circular para Pila de Botón */}
              <circle cx="530" cy="735" r="45" fill="#0f172a" stroke="#64748b" strokeWidth="2.5" />
              <circle cx="530" cy="735" r="41" fill="url(#atx-cr2032)" stroke="#cbd5e1" strokeWidth="1.8" />
              <circle cx="530" cy="735" r="35" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
              
              {/* Relieve y Grabado de la Pila de Litio */}
              <text x="530" y="726" textAnchor="middle" fill="#0f172a" fontSize="18" fontWeight="900">+</text>
              <text x="530" y="745" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="900" letterSpacing="1">CR2032</text>
              <text x="530" y="758" textAnchor="middle" fill="#334155" fontSize="8" fontWeight="bold">3V LITHIUM CELL</text>

              {/* Clip de expulsión metálico superior */}
              <rect x="522" y="688" width="16" height="6" rx="1.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />

              {/* Jumper de 2 Pines JBAT1 / Clear CMOS */}
              <g transform="translate(598, 720)">
                <rect x="0" y="0" width="32" height="28" rx="2.5" fill="#090d16" stroke="#64748b" strokeWidth="1.2" />
                <circle cx="9" cy="14" r="3" fill="url(#atx-gold-flash)" />
                <circle cx="23" cy="14" r="3" fill="url(#atx-gold-flash)" />
                <text x="16" y="38" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontWeight="bold">JBAT1</text>
              </g>
            </g>

            {/* =================================================================== */}
            {/* 12. SLOT M.2_2 NVMe (PCH Enlace: X: 195-675, Y: 870)                */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('m2')}
              className="cursor-pointer"
              filter={isComponentActive('m2') ? 'url(#atx-glow-emerald)' : 'url(#atx-soft-shadow)'}
            >
              <rect
                x="195"
                y="870"
                width="480"
                height="50"
                rx="4.5"
                fill="url(#atx-m2-shield)"
                stroke={isComponentActive('m2') ? '#10b981' : '#475569'}
                strokeWidth={isComponentActive('m2') ? 2.2 : 1.5}
              />
              <text x="435" y="900" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontWeight="bold">
                M.2_2 (PCH LINK PCIe 4.0 ×4) // 2280 THERMAL SHIELD
              </text>
              <circle cx="660" cy="895" r="7.5" fill="url(#atx-steel-armor)" stroke="#cbd5e1" strokeWidth="1.2" />
            </g>

            {/* =================================================================== */}
            {/* 13. CHIPSET INTEL Z790 PCH (X: 720-955, Y: 620-865)                */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('pch')}
              className="cursor-pointer"
              filter={isComponentActive('pch') ? 'url(#atx-glow-cyan)' : 'url(#atx-soft-shadow)'}
            >
              {/* Disipador Metálico Facetado del Chipset Z790 */}
              <rect
                x="720"
                y="620"
                width="235"
                height="245"
                rx="8"
                fill="url(#atx-pch-metallic)"
                stroke={
                  isComponentActive('pch')
                    ? isFailed && [13, 16, 18].includes(currentStep.stepNumber)
                      ? '#f43f5e'
                      : '#06b6d4'
                    : '#475569'
                }
                strokeWidth={isComponentActive('pch') ? 3 : 2}
              />
              <rect x="725" y="625" width="225" height="235" rx="6" fill="none" stroke="#1e293b" strokeWidth="1" />
              
              {/* Ranuras de Ventilación Diagonales Estilizadas CNC */}
              {[0, 1, 2, 3, 4].map((s) => (
                <path
                  key={`pch-groove-${s}`}
                  d={`M ${740 + s * 34} 635 L ${775 + s * 34} 845`}
                  stroke="#080e1a"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              ))}

              {/* Insignia Láser Central del Chipset con Aro Iluminado */}
              <circle cx="837" cy="742" r="44" fill="#0b1324" stroke="#06b6d4" strokeWidth="2.2" />
              <circle cx="837" cy="742" r="40" fill="#070c18" stroke="#1e3a5f" strokeWidth="1" />
              <text x="837" y="736" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" letterSpacing="2">
                INTEL
              </text>
              <text x="837" y="754" textAnchor="middle" fill="#22d3ee" fontSize="10.5" fontWeight="bold">
                Z790 PCH
              </text>
              <text x="837" y="798" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="bold">
                DMI 4.0 ×8 PLATFORM HUB
              </text>
            </g>

            {/* =================================================================== */}
            {/* 14. 4x PUERTOS SATA 6Gb/s ACODADOS (X: 920-975, Y: 880-1070)        */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('sata')}
              className="cursor-pointer"
              filter={isComponentActive('sata') ? 'url(#atx-glow-emerald)' : 'url(#atx-soft-shadow)'}
            >
              <text x="945" y="872" textAnchor="middle" fill={isComponentActive('sata') ? '#34d399' : '#f8fafc'} fontSize="8.5" fontWeight="bold">
                4× SATA 6G
              </text>
              {/* 4 Conectores en 2 Bloques Apilados con traba metálica */}
              {[885, 930, 975, 1020].map((sy, sIdx) => (
                <g key={`sata-sharp-${sIdx}`}>
                  <rect
                    x="920"
                    y={sy}
                    width="55"
                    height="40"
                    rx="3.5"
                    fill="#18181b"
                    stroke={isComponentActive('sata') ? '#10b981' : '#64748b'}
                    strokeWidth={isComponentActive('sata') ? 2.5 : 1.5}
                  />
                  {/* Traba metálica exterior de retención con pestillo */}
                  <rect x="914" y={sy + 12} width="6" height="16" fill="url(#atx-steel-armor)" />
                  {/* Ranura en 'L' auténtica de SATA */}
                  <path d={`M 928 ${sy + 10} L 962 ${sy + 10} L 962 ${sy + 16} L 938 ${sy + 16} L 938 ${sy + 28} L 928 ${sy + 28} Z`} fill="#090d16" />
                  <text x="948" y={sy + 36} textAnchor="middle" fill="#cbd5e1" fontSize="7" fontWeight="bold">
                    SATA_{sIdx + 1}
                  </text>
                </g>
              ))}
            </g>

            {/* =================================================================== */}
            {/* 15. CHIP SPI FLASH BIOS ROM (X: 635-695, Y: 945-995)                */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('bios')}
              className="cursor-pointer"
              filter={isComponentActive('bios') ? 'url(#atx-glow-amber)' : 'url(#atx-soft-shadow)'}
            >
              {/* Encapsulado SOIC-8 de 8 Pines */}
              <rect
                x="635"
                y="945"
                width="60"
                height="50"
                rx="3.5"
                fill="#0f172a"
                stroke={
                  isComponentActive('bios')
                    ? isFailed && [7, 8, 20].includes(currentStep.stepNumber)
                      ? '#f43f5e'
                      : '#c084fc'
                    : '#64748b'
                }
                strokeWidth={isComponentActive('bios') ? 2.8 : 1.5}
              />
              {/* Punto y muesca Pin 1 */}
              <circle cx="644" cy="954" r="3.2" fill="#c084fc" />
              {/* 8 Pines plateados gull-wing */}
              {[0, 1, 2, 3].map((pin) => (
                <g key={`bios-lead-${pin}`}>
                  <rect x="625" y={951 + pin * 11} width="10" height="5" rx="1" fill="url(#atx-steel-armor)" />
                  <rect x="695" y={951 + pin * 11} width="10" height="5" rx="1" fill="url(#atx-steel-armor)" />
                </g>
              ))}
              <text x="665" y="970" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                WINBOND
              </text>
              <text x="665" y="983" textAnchor="middle" fill="#c084fc" fontSize="6.5" fontWeight="bold">
                256Mb UEFI
              </text>
            </g>

            {/* =================================================================== */}
            {/* 16. SUBSISTEMA DE AUDIO AUDIO BOOST HD (X: 25-140, Y: 870-1170)     */}
            {/* =================================================================== */}
            <g>
              {/* Línea de Aislamiento de Cobre Iluminada (PCB Isolation Trace) */}
              <path
                d="M 25 870 L 140 870 L 140 1175"
                fill="none"
                stroke={isPoweredOn ? '#f59e0b' : '#475569'}
                strokeWidth="3.2"
                strokeDasharray="6 3"
                filter={isPoweredOn ? 'url(#atx-glow-amber)' : 'none'}
              />
              <text x="82" y="890" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold">
                AUDIO BOOST 5
              </text>
              {/* 5 Capacitores Dorados de Audio Nichicon Fine Gold */}
              {[920, 960, 1000, 1040, 1080].map((ay, i) => (
                <g key={`aud-cap-${i}`} transform={`translate(82, ${ay})`}>
                  <circle r="15" fill="#0f172a" stroke="url(#atx-gold-flash)" strokeWidth="2.5" />
                  <circle r="11" fill="#78350f" />
                  {/* Línea negra característica Nichicon */}
                  <line x1="-11" y1="0" x2="11" y2="0" stroke="#fef08a" strokeWidth="2" />
                </g>
              ))}
              {/* Chip Códec de Audio Protegido Realtek ALC1220 con blindaje EMI */}
              <rect x="58" y="1115" width="50" height="48" rx="3.5" fill="url(#atx-steel-armor)" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="83" y="1144" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">ALC1220</text>
            </g>

            {/* =================================================================== */}
            {/* 17. HEADERS DE VENTILADOR (PWM 4-PIN) & INTERNOS USB                 */}
            {/* =================================================================== */}
            {/* CPU_FAN1 Header */}
            <g transform="translate(685, 30)">
              <rect width="30" height="15" rx="1.5" fill="#090d16" stroke="#64748b" strokeWidth="1" />
              <rect x="0" y="0" width="30" height="3" fill="#64748b" />
              {[0, 1, 2, 3].map((fp) => (
                <circle key={`cpufan-p-${fp}`} cx={5 + fp * 6.5} cy="9" r="1.5" fill="url(#atx-gold-flash)" />
              ))}
              <text x="15" y="-3" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">CPU_FAN1</text>
            </g>
            {/* PUMP_FAN1 Header */}
            <g transform="translate(735, 30)">
              <rect width="30" height="15" rx="1.5" fill="#090d16" stroke="#64748b" strokeWidth="1" />
              <rect x="0" y="0" width="30" height="3" fill="#64748b" />
              {[0, 1, 2, 3].map((fp) => (
                <circle key={`pumpfan-p-${fp}`} cx={5 + fp * 6.5} cy="9" r="1.5" fill="url(#atx-gold-flash)" />
              ))}
              <text x="15" y="-3" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">PUMP_FAN1</text>
            </g>
            {/* Front USB 3.0 19-Pin Internal Header */}
            <g transform="translate(915, 480)">
              <rect width="55" height="26" rx="2" fill="#18181b" stroke="#64748b" strokeWidth="1.2" />
              <rect x="0" y="8" width="4" height="10" fill="#090d16" />
              <text x="28" y="38" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold">JUSB3 (USB 3.0)</text>
            </g>

            {/* =================================================================== */}
            {/* 18. HEADER PANEL FRONTAL JFP1 (X: 815-950, Y: 1115-1170)            */}
            {/* =================================================================== */}
            <g
              onClick={() => handleSelectComponent('fpanel')}
              className="cursor-pointer"
              filter={isComponentActive('fpanel') ? 'url(#atx-glow-amber)' : 'url(#atx-soft-shadow)'}
            >
              <rect
                x="815"
                y="1115"
                width="135"
                height="55"
                rx="3.5"
                fill="#090d16"
                stroke={
                  isComponentActive('fpanel')
                    ? isFailed && [1, 2].includes(currentStep.stepNumber)
                      ? '#f43f5e'
                      : '#f59e0b'
                    : '#64748b'
                }
                strokeWidth={isComponentActive('fpanel') ? 2.8 : 1.5}
              />
              <text x="882" y="1108" textAnchor="middle" fill={isComponentActive('fpanel') ? '#fbbf24' : '#f8fafc'} fontSize="8.5" fontWeight="bold">
                JFP1 // FRONT PANEL (PWR_SW / RESET / LEDs)
              </text>
              {/* 9 Pines Estandarizados (Hilera superior 5, inferior 4 con pin 10 ausente) */}
              {[0, 1, 2, 3, 4].map((pinX) => (
                <circle key={`jfp1-t-${pinX}`} cx={830 + pinX * 22} cy="1130" r="4" fill="url(#atx-gold-flash)" stroke="#ca8a04" strokeWidth="1.2" />
              ))}
              {[0, 1, 2, 3].map((pinX) => (
                <circle key={`jfp1-b-${pinX}`} cx={830 + pinX * 22} cy="1152" r="4" fill="url(#atx-gold-flash)" stroke="#ca8a04" strokeWidth="1.2" />
              ))}
              {/* Indicador de Pulsación Activa en Paso 02 */}
              {currentStep.stepNumber === 2 && (
                <rect x="848" y="1124" width="30" height="34" rx="2" fill="#ef4444" opacity="0.85" className="animate-pulse" />
              )}
            </g>

            {/* =================================================================== */}
            {/* 19. BUSES DE SEÑALES VIAJERAS DINÁMICAS (34 ETAPAS EN TIEMPO REAL)  */}
            {/* =================================================================== */}
            {/* STANDBY: Riel +5VSB desde ATX hacia Lógica y F_PANEL (Paso 01) */}
            <path
              d="M 940 370 L 940 1080 L 882 1080 L 882 1115"
              fill="none"
              stroke={isSignalActive('STANDBY') ? (isFailed ? '#f43f5e' : '#eab308') : '#1e293b'}
              strokeWidth={isSignalActive('STANDBY') ? '5' : '1.2'}
              className={isSignalActive('STANDBY') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('STANDBY') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-amber)') : 'none'}
            />

            {/* PWR_SW: Cierre a masa desde F_PANEL hacia Lógica de Placa (Paso 02) */}
            <path
              d="M 865 1115 L 865 920 L 800 920 L 800 620"
              fill="none"
              stroke={isSignalActive('PWR_SW') ? (isFailed ? '#f43f5e' : '#f59e0b') : '#1e293b'}
              strokeWidth={isSignalActive('PWR_SW') ? '5' : '1.2'}
              className={isSignalActive('PWR_SW') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PWR_SW') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-amber)') : 'none'}
            />

            {/* PS_ON#: Lógica hacia conector ATX Pin 16 (Paso 03) */}
            <path
              d="M 750 620 L 750 350 L 910 350"
              fill="none"
              stroke={isSignalActive('PS_ON#') ? (isFailed ? '#f43f5e' : '#10b981') : '#1e293b'}
              strokeWidth={isSignalActive('PS_ON#') ? '5' : '1.2'}
              className={isSignalActive('PS_ON#') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PS_ON#') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-emerald)') : 'none'}
            />

            {/* RAILS_MAIN: ATX & EPS energizan VRM y Placa (Paso 04) */}
            <path
              d="M 910 220 L 675 80 M 260 55 L 268 55"
              fill="none"
              stroke={isSignalActive('RAILS_MAIN') ? (isFailed ? '#f43f5e' : '#f59e0b') : '#1e293b'}
              strokeWidth={isSignalActive('RAILS_MAIN') ? '5.5' : '1.2'}
              className={isSignalActive('RAILS_MAIN') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('RAILS_MAIN') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-amber)') : 'none'}
            />

            {/* PWR_OK & RESET#: Liberación de Reset al CPU (Paso 05 y 06) */}
            <path
              d="M 910 270 L 650 300"
              fill="none"
              stroke={isSignalActive('PWR_OK') || isSignalActive('RESET#') ? (isFailed ? '#f43f5e' : '#38bdf8') : '#1e293b'}
              strokeWidth={isSignalActive('PWR_OK') || isSignalActive('RESET#') ? '5.5' : '1.2'}
              className={isSignalActive('PWR_OK') || isSignalActive('RESET#') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PWR_OK') || isSignalActive('RESET#') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-cyan)') : 'none'}
            />

            {/* FIRMWARE FETCH: CPU lee chip SPI Flash BIOS (Pasos 07-09) */}
            <path
              d="M 490 485 L 490 970 L 635 970"
              fill="none"
              stroke={isSignalActive('FIRMWARE_FETCH') ? (isFailed ? '#f43f5e' : '#c084fc') : '#1e293b'}
              strokeWidth={isSignalActive('FIRMWARE_FETCH') ? '5' : '1.2'}
              className={isSignalActive('FIRMWARE_FETCH') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('FIRMWARE_FETCH') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-amber)') : 'none'}
            />

            {/* RAM_TRAIN: CPU/IMC entrena los 4 Slots DDR5 (Pasos 10-12) */}
            <path
              d="M 650 220 L 695 220 M 650 320 L 695 320 M 650 420 L 695 420"
              fill="none"
              stroke={isSignalActive('RAM_TRAIN') ? (isFailed ? '#f43f5e' : '#3b82f6') : '#1e293b'}
              strokeWidth={isSignalActive('RAM_TRAIN') ? '5.5' : '1.2'}
              className={isSignalActive('RAM_TRAIN') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('RAM_TRAIN') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-cyan)') : 'none'}
            />

            {/* PLATFORM_INTERCONNECT: Enlace DMI 4.0 CPU con Z790 PCH (Paso 13) */}
            <path
              d="M 520 485 L 520 640 L 720 640"
              fill="none"
              stroke={isSignalActive('PLATFORM_INTERCONNECT') ? (isFailed ? '#f43f5e' : '#06b6d4') : '#1e293b'}
              strokeWidth={isSignalActive('PLATFORM_INTERCONNECT') ? '5' : '1.2'}
              className={isSignalActive('PLATFORM_INTERCONNECT') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PLATFORM_INTERCONNECT') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-cyan)') : 'none'}
            />

            {/* PCIE_GPU: Enlace CPU con Slot PCIe 5.0 x16 (Pasos 14-15) */}
            <path
              d="M 435 485 L 435 568"
              fill="none"
              stroke={isSignalActive('PCIE_GPU') ? (isFailed ? '#f43f5e' : '#6366f1') : '#1e293b'}
              strokeWidth={isSignalActive('PCIE_GPU') ? '5.5' : '1.2'}
              className={isSignalActive('PCIE_GPU') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PCIE_GPU') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-cyan)') : 'none'}
            />

            {/* STORAGE_BUS: CPU & PCH hacia M.2 NVMe y SATA (Pasos 16-21) */}
            <path
              d="M 435 485 L 435 495 M 720 760 L 675 760 L 675 870"
              fill="none"
              stroke={isSignalActive('STORAGE_BUS') ? (isFailed ? '#f43f5e' : '#10b981') : '#1e293b'}
              strokeWidth={isSignalActive('STORAGE_BUS') ? '5' : '1.2'}
              className={isSignalActive('STORAGE_BUS') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('STORAGE_BUS') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-emerald)') : 'none'}
            />

            {/* WIN_PIPELINE: M.2 NVMe hacia DDR5 y CPU (Pasos 22-34) */}
            <path
              d="M 350 495 L 350 320 L 695 320"
              fill="none"
              stroke={isSignalActive('WIN_PIPELINE') ? (isFailed ? '#f43f5e' : '#06b6d4') : '#1e293b'}
              strokeWidth={isSignalActive('WIN_PIPELINE') ? '5' : '1.2'}
              className={isSignalActive('WIN_PIPELINE') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('WIN_PIPELINE') ? (isFailed ? 'url(#atx-glow-rose)' : 'url(#atx-glow-cyan)') : 'none'}
            />
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* PANEL TÉCNICO SINCRONIZADO // COMPONENTE SELECCIONADO                     */}
        {/* ========================================================================= */}
        <div className="mt-3 p-3 rounded-xl bg-zinc-950/95 border border-zinc-700/80 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9.5px] px-2.5 py-0.5 rounded font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                {currentSelectedEdu.category}
              </span>
              <h4 className="text-white font-bold font-display text-xs sm:text-sm tracking-wide">
                {currentSelectedEdu.title}
              </h4>
              <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                isComponentActive(selectedComponentKey)
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}>
                {isComponentActive(selectedComponentKey) ? '● ACTIVO EN ESTA ETAPA' : '○ EN ESPERA / REPOSO'}
              </span>
            </div>
            <p className="text-zinc-200 font-sans-editorial text-[11.5px] leading-relaxed line-clamp-2">
              {currentSelectedEdu.queHace}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setInspectedComponent(currentSelectedEdu)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/40 font-mono text-[10.5px] uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>FICHA PERICIAL DETALLADA →</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOWER PANEL: SECUENCIA DE SOFTWARE (NODOS 22-34) & MONITOR INTEGRADO      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3 relative z-10">
        
        {/* Left 7 Cols: Software Pipeline Nodes (22 to 34) */}
        <div className="md:col-span-7 bg-[#080c16] border border-zinc-800 rounded-xl p-3 flex flex-col justify-between gap-2">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-zinc-800">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>PIPELINE DE SOFTWARE (ETAPAS 22–34)</span>
            </div>
            {activeSoftNode && (
              <span className="text-[9px] text-cyan-300 font-mono">
                NODO ACTIVO: <strong>{activeSoftNode.toUpperCase()}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-[8px]">
            {/* 1. bootmgr */}
            <div className={`p-1 rounded border text-center transition-all ${
              activeSoftNode === 'bootmgr'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400 font-bold'
                : currentStep.stepNumber > 22
                ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                : 'bg-zinc-950 border-zinc-850 text-zinc-600'
            }`}>
              <div>22. BCD</div>
              <div className="text-[6.5px] truncate">bootmgfw</div>
            </div>

            {/* 2. winload */}
            <div className={`p-1 rounded border text-center transition-all ${
              activeSoftNode === 'winload'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400 font-bold'
                : currentStep.stepNumber > 23
                ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                : 'bg-zinc-950 border-zinc-850 text-zinc-600'
            }`}>
              <div>23. LOAD</div>
              <div className="text-[6.5px] truncate">winload</div>
            </div>

            {/* 3. kernel */}
            <div className={`p-1 rounded border text-center transition-all ${
              activeSoftNode === 'kernel'
                ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 ring-1 ring-indigo-400 font-bold'
                : currentStep.stepNumber > 25
                ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                : 'bg-zinc-950 border-zinc-850 text-zinc-600'
            }`}>
              <div>24-25. NT</div>
              <div className="text-[6.5px] truncate">ntoskrnl/HAL</div>
            </div>

            {/* 4. drivers */}
            <div className={`p-1 rounded border text-center transition-all ${
              activeSoftNode === 'drivers'
                ? 'bg-purple-500/25 border-purple-400 text-purple-200 ring-1 ring-purple-400 font-bold'
                : currentStep.stepNumber > 27
                ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                : 'bg-zinc-950 border-zinc-850 text-zinc-600'
            }`}>
              <div>26-27. DRV</div>
              <div className="text-[6.5px] truncate">BOOT_START</div>
            </div>

            {/* 5. smss */}
            <div className={`p-1 rounded border text-center transition-all ${
              activeSoftNode === 'smss'
                ? 'bg-purple-500/25 border-purple-400 text-purple-200 ring-1 ring-purple-400 font-bold'
                : currentStep.stepNumber > 29
                ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                : 'bg-zinc-950 border-zinc-850 text-zinc-600'
            }`}>
              <div>28-29. SMSS</div>
              <div className="text-[6.5px] truncate">csrss/wininit</div>
            </div>

            {/* 6. services */}
            <div className={`p-1 rounded border text-center transition-all ${
              activeSoftNode === 'services'
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-1 ring-amber-400 font-bold'
                : currentStep.stepNumber > 30
                ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                : 'bg-zinc-950 border-zinc-850 text-zinc-600'
            }`}>
              <div>30. SCM</div>
              <div className="text-[6.5px] truncate">services/LSASS</div>
            </div>

            {/* 7. logon */}
            <div className={`p-1 rounded border text-center transition-all ${
              activeSoftNode === 'logon'
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400 font-bold'
                : currentStep.stepNumber > 32
                ? 'bg-zinc-900 border-zinc-700 text-zinc-400'
                : 'bg-zinc-950 border-zinc-850 text-zinc-600'
            }`}>
              <div>31-32. LOG</div>
              <div className="text-[6.5px] truncate">winlogon/Prof</div>
            </div>

            {/* 8. desktop */}
            <div className={`p-1 rounded border text-center transition-all ${
              activeSoftNode === 'desktop'
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400 font-bold'
                : currentStep.stepNumber === 34
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-zinc-950 border-zinc-850 text-zinc-600'
            }`}>
              <div>33-34. DWM</div>
              <div className="text-[6.5px] truncate">Explorer/Listo</div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Integrated Diagnostics Screen */}
        <div className="md:col-span-5 bg-[#080c16] border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 text-[9px]">
            <span className="font-bold text-zinc-400 uppercase flex items-center gap-1">
              <Monitor className="w-3 h-3 text-indigo-400" />
              <span>MONITOR INTEGRADO</span>
            </span>
            <span className="text-[8px] text-zinc-500">
              {currentStep.stepNumber < 15 ? 'SIN SEÑAL' : currentStep.stepNumber < 29 ? 'GOP FRAMEBUFFER' : 'DIRECTX DWM'}
            </span>
          </div>

          <div className="w-full bg-black rounded-lg border border-zinc-800/90 p-2 min-h-[55px] flex flex-col items-center justify-center text-center">
            {!isPoweredOn || currentStep.stepNumber < 15 ? (
              <div className="text-zinc-600 font-bold text-[9px] tracking-widest uppercase">
                [ SIN SEÑAL / STANDBY ]
              </div>
            ) : currentStep.stepNumber < 22 ? (
              <div className="text-cyan-400 font-display font-bold text-[11px] tracking-widest uppercase">
                ⚡ EVO UEFI BIOS READY
              </div>
            ) : currentStep.stepNumber < 31 ? (
              <div className="flex items-center gap-2 text-[10px] text-zinc-300 font-mono">
                <div className="w-3 h-3 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <span>INICIANDO WINDOWS NT...</span>
              </div>
            ) : currentStep.stepNumber < 33 ? (
              <div className="text-[10px] font-bold text-white uppercase">
                BIENVENIDO // EVO LABS
              </div>
            ) : (
              <div className="text-[10px] font-bold text-emerald-400 font-mono">
                ● ESCRITORIO LISTO (EXPLORER.EXE)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPONENT INSPECTION POPUP MODAL                                          */}
      {/* ========================================================================= */}
      {inspectedComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b0e14] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-5 text-left relative shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                  {inspectedComponent.category}
                </span>
                <h3 className="text-sm font-bold text-white tracking-wide font-display mt-0.5">
                  {inspectedComponent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedComponent(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-0.5">¿QUÉ ES?</span>
                <p className="text-zinc-200 font-sans-editorial leading-relaxed text-[11px]">{inspectedComponent.queEs}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-0.5">¿QUÉ HACE EN EL SISTEMA?</span>
                <p className="text-zinc-300 font-sans-editorial leading-relaxed text-[11px]">{inspectedComponent.queHace}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-0.5">¿CUÁNDO INTERVIENE EN EL ARRANQUE?</span>
                <p className="text-cyan-300 font-sans-editorial leading-relaxed text-[11px]">{inspectedComponent.cuandoInterviene}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1">FALLAS QUE PUEDE PRODUCIR:</span>
                <ul className="space-y-1 text-[11px] text-zinc-300 font-sans-editorial list-disc list-inside">
                  {inspectedComponent.fallasPosibles.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 text-right">
              <button
                type="button"
                onClick={() => setInspectedComponent(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold font-mono-tech transition-colors cursor-pointer"
              >
                ENTENDIDO // CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
