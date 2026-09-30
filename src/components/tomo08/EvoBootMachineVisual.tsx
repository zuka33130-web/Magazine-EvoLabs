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

const COMPONENT_EDU_INFO: Record<string, ComponentEduModalData> = {
  cpu: {
    title: 'CPU // MICROPROCESADOR & IMC',
    category: 'SILICIO PRINCIPAL',
    queEs: 'Unidad Central de Procesamiento x86-64 con controlador de memoria integrado (IMC) y líneas de bus directas.',
    queHace: 'Ejecuta el vector de reset, el microcódigo UEFI, entrena la RAM a través del IMC y procesa las instrucciones del sistema operativo.',
    cuandoInterviene: 'Desde el Paso 06 (Liberación de Reset / Vector FFFF_FFF0h) hasta la ejecución permanente del sistema operativo.',
    fallasPosibles: [
      'Pines del socket doblados o presión desbalanceada del montaje del disipador.',
      'Falla del IMC impidiendo el entrenamiento de memoria (Memory Training).',
      'Protección térmica por montaje incorrecto o bomba/cooler inoperativo.',
    ],
  },
  vrm: {
    title: 'VRM // MÓDULO REGULADOR DE VOLTAJE',
    category: 'ALIMENTACIÓN DE SILICIO',
    queEs: 'Circuito reductor multifase (MOSFETs/Power Stages, Chokes de ferrita y condensadores) gobernado por PWM.',
    queHace: 'Convierte la tensión de entrada de la fuente en voltajes precisos, estables y de bajo rizado para el procesador y memoria.',
    cuandoInterviene: 'Paso 04/05 (Estabilización de rieles de potencia y generación de voltajes de núcleo previo a la liberación de reset).',
    fallasPosibles: [
      'Cortocircuito en MOSFETs de alta drenando la línea principal a masa.',
      'Sobrecalentamiento extremo de fases por disipación deficiente o flujo nulo de aire.',
      'Rizado de tensión excesivo provocando reinicios o cuelgues espontáneos en carga.',
    ],
  },
  ram: {
    title: 'RAM // MEMORIA DE ACCESO ALEATORIO',
    category: 'SUBSISTEMA DE MEMORIA',
    queEs: 'Módulos DIMM sincrónicos de alta velocidad conectados en canales dedicados al controlador de memoria del procesador.',
    queHace: 'Almacena temporalmente el código ejecutable del firmware UEFI, cargador de arranque, kernel y procesos de usuario.',
    cuandoInterviene: 'Paso 10 (Inicialización IMC), Paso 11 (Lectura SPD) y Paso 12 (Entrenamiento de señales y latencias).',
    fallasPosibles: [
      'Falso contacto por suciedad u óxido en los pads dorados del slot DIMM.',
      'Inestabilidad por perfil de frecuencias o latencias incompatible con el IMC.',
      'Celdas degradadas que provocan errores de paridad, corrupción de datos o BSODs.',
    ],
  },
  gpu: {
    title: 'SUBSISTEMA GRÁFICO // iGPU / dGPU & GOP',
    category: 'PROCESAMIENTO VISUAL & PCIe',
    queEs: 'Controlador gráfico (integrado en el procesador o tarjeta dedicada en ranura de expansión) con protocolo GOP.',
    queHace: 'Inicializa el framebuffer básico UEFI mediante Graphics Output Protocol (GOP) y asume la aceleración con el controlador nativo.',
    cuandoInterviene: 'Paso 14 (Enumeración de bus), Paso 15 (Inicialización GOP / VBIOS) y Paso 29+ (DirectX DWM / Pantalla nativa).',
    fallasPosibles: [
      'Alimentación auxiliar desconectada o cable de video defectuoso.',
      'Traba de retención del slot desacoplada o falso contacto en el conector.',
      'Incompatibilidad con el protocolo UEFI GOP en tarjetas antiguas (modo Legacy/CSM).',
    ],
  },
  storage: {
    title: 'STORAGE // SSD NVMe M.2 / SATA & GPT',
    category: 'ALMACENAMIENTO MASIVO',
    queEs: 'Unidad de estado sólido o disco con protocolo NVMe/AHCI conectada por bus de alta velocidad al procesador o al chipset.',
    queHace: 'Alberga la tabla de particiones GPT, la partición de sistema EFI (ESP) en formato FAT32 y el volumen con el sistema operativo.',
    cuandoInterviene: 'Paso 16 (Inicialización controladora), Paso 17 (Identificación), Paso 20 (Boot Order) y Paso 21+ (Carga de binarios).',
    fallasPosibles: [
      'Corrupción en la partición EFI (ESP) o almacén BCD (mensaje "No bootable device").',
      'Modo de controlador incompatible configurado en el firmware (VMD/RAID vs AHCI/NVMe).',
      'Desgaste de celdas NAND o firmware de la unidad bloqueado en modo de solo lectura.',
    ],
  },
  pch: {
    title: 'CHIPSET / I-O HUB (SEGÚN PLATAFORMA)',
    category: 'CONTROLADOR DE BUSES & PERIFÉRICOS',
    queEs: 'Circuito integrado concentrador que gestiona líneas de expansión secundarias, puertos SATA, USB, audio y el enlace al procesador.',
    queHace: 'Distribuye el tráfico de periféricos, participa en la gestión de estados de energía ACPI y coordina señales con el firmware.',
    cuandoInterviene: 'Paso 01/02 (Enrutamiento de standby y buses), Paso 13 (Interconexión de plataforma) y ejecución continua.',
    fallasPosibles: [
      'Sobrecalentamiento del silicio por disipador flojo, sucio o almohadilla térmica degradada.',
      'Líneas USB o puertos periféricos en cortocircuito que bloquean la secuencia de encendido.',
      'Pérdida de enlace con el procesador impidiendo la detección de unidades y puertos.',
    ],
  },
  fpanel: {
    title: 'HEADER PANEL FRONTAL // F_PANEL & PWR_SW',
    category: 'INTERFAZ DE CONTROL FÍSICO',
    queEs: 'Bloque de pines estandarizado en la placa base para pulsadores (PWR_SW, RESET) y testigos luminosos de estado.',
    queHace: 'Al cerrarse momentáneamente el contacto entre los pines PWR_SW, envía un pulso a masa que la lógica de placa interpreta para solicitar encendido.',
    cuandoInterviene: 'Paso 01 (Standby en espera) y Paso 02 (Pulsación y detección de flanco por la lógica de control).',
    fallasPosibles: [
      'Pulsador físico del gabinete trabado o sulfatado (provoca apagado forzado tras 4 segundos).',
      'Conectores invertidos o colocados en pines equivocados (ej. pulsar reset en lugar de power).',
      'Pines doblados o sulfato en el header impidiendo el cierre de contacto a tierra.',
    ],
  },
  bios: {
    title: 'SPI FLASH // CHIP FIRMWARE UEFI',
    category: 'FIRMWARE & NVRAM',
    queEs: 'Circuito integrado Flash SPI que almacena el microcódigo UEFI, tablas ACPI y variables no volátiles NVRAM.',
    queHace: 'Primer código que lee el procesador al encender para ejecutar el POST, configurar hardware y transferir control al cargador.',
    cuandoInterviene: 'Paso 07 (Fetch del vector de reset) hasta el Paso 21 (Transferencia al cargador del sistema operativo).',
    fallasPosibles: [
      'Firmware corrupto tras una actualización fallida o corte de suministro durante el flasheo.',
      'Batería RTC/CMOS agotada provocando reseteo a valores de fábrica en cada desconexión.',
      'Variables de orden de arranque en NVRAM borradas o alteradas tras un borrado de CMOS.',
    ],
  },
  psu: {
    title: 'PSU // FUENTE DE PODER ATX',
    category: 'ENERGÍA PRIMARIA & SECUNDARIA',
    queEs: 'Convertidor conmutado AC-DC que suministra rieles estabilizados (+12V, +5V, +3.3V, -12V y +5VSB) a la computadora.',
    queHace: 'Genera el riel permanente de standby (+5VSB) al recibir corriente AC, responde a la señal lógica PS_ON# y confirma estabilidad con PWR_OK.',
    cuandoInterviene: 'Paso 00 (Suministro primario), Paso 01 (Standby), Paso 03 (Arranque conmutado) y Paso 04/05 (PWR_OK).',
    fallasPosibles: [
      'Riel +5VSB inoperativo por falla en la etapa auxiliar (equipo completamente muerto).',
      'Señal PWR_OK ausente o desfasada haciendo que la placa base mantenga al procesador en reset permanente.',
      'Rizado excesivo en las líneas de potencia por condensadores electrolíticos degradados.',
    ],
  },
  motherboard: {
    title: 'MOTHERBOARD // PCB, CONTROL DE PLATAFORMA & BUSES',
    category: 'COLUMNA VERTEBRAL & INTERCONEXIÓN',
    queEs: 'Circuito impreso multicapa que interconecta todos los componentes, controladores embebidos, RTC y lógica de potencia.',
    queHace: 'Coordina la secuencia de encendido mediante lógica de control, enruta buses de alta velocidad y distribuye energía.',
    cuandoInterviene: 'Paso 01 al 34 en todo momento de la vida operativa del sistema.',
    fallasPosibles: [
      'Pistas cortadas, sulfato o corrosión por humedad.',
      'Controlador embebido/Super I/O averiado que no procesa la pulsación del botón frontal.',
      'Cortocircuitos en condensadores cerámicos SMD de los rieles principales.',
    ],
  },
};

export const EvoBootMachineVisual: React.FC<EvoBootMachineVisualProps> = ({
  currentStep,
  isPoweredOn,
  isFailed = false,
}) => {
  const [inspectedComponent, setInspectedComponent] = useState<ComponentEduModalData | null>(null);

  const isComponentActive = (id: MachineComponentId) => {
    return isPoweredOn && currentStep.activeComponents.includes(id);
  };

  const isComponentEverReached = (minStep: number) => {
    return isPoweredOn && currentStep.stepNumber >= minStep;
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
    if (step >= 10 && step <= 12) return 'CPU / IMC ↔ Slots RAM (SPD & Memory Training)';
    if (step === 13) return 'CPU / SoC ↔ Chipset / I-O Hub (Interconexión de Plataforma)';
    if (step >= 14 && step <= 15) return 'CPU / Bus ↔ Subsistema Gráfico (GOP Framebuffer)';
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

  return (
    <div className="w-full bg-[#05070c] border-2 border-zinc-800 rounded-2xl p-3 sm:p-5 relative overflow-hidden font-mono-tech shadow-2xl select-none">
      
      {/* Dynamic Keyframe Style for Real Traveling Signal Pulse */}
      <style>{`
        @keyframes evoSignalPulse {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-signal-flow {
          stroke-dasharray: 8 6;
          animation: evoSignalPulse 1.1s linear infinite;
        }
      `}</style>

      {/* Background Technical Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />

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
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                  : ''
              }`}
              style={{
                backgroundColor: !isFailed ? `${currentStep.layerColor}20` : undefined,
                color: !isFailed ? currentStep.layerColor : undefined,
                border: !isFailed ? `1px solid ${currentStep.layerColor}50` : undefined,
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
        <div className={`p-2 sm:p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
          isFailed
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">AHORA ESTÁ OCURRIENDO:</span>
            <strong className={`${isFailed ? 'text-rose-300' : 'text-cyan-300'} text-[11px] font-mono`}>
              {getStepActionFlow()}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
            {isFailed ? <AlertTriangle className="w-3 h-3 text-rose-400 animate-bounce" /> : <Zap className="w-3 h-3 animate-bounce" />}
            <span>SEÑAL: <strong>{getStepSignalTitle()}</strong></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUADRO CENTRAL: GABINETE ABIERTO CON PLANO DE PLACA Y ASPECT RATIO FIJO    */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#080c16] border-2 border-zinc-700/80 rounded-2xl p-2 sm:p-3 overflow-hidden shadow-2xl z-10 flex flex-col justify-between">
        
        {/* Chassis Ventilation & Platform Reference Strip */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-800/80 text-[9px] sm:text-[9.5px]">
          <div className="flex items-center gap-1.5 font-bold text-zinc-300">
            <CircuitBoard className="w-3.5 h-3.5 text-cyan-400" />
            <span>PLATAFORMA ATX DIDÁCTICA DE REFERENCIA</span>
          </div>

          <div className="text-[8px] sm:text-[8.5px] font-mono text-zinc-400 text-right truncate">
            <span className="text-zinc-500 hidden sm:inline">La implementación concreta depende de motherboard, CPU, chipset y fabricante • </span>
            <span className="text-cyan-400">TOPOLOGÍA FÍSICA FIJA</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CANVAS DE PLACA & GABINETE CON POSICIONES PORCENTUALES PURAS             */}
        {/* (Aspect ratio fijo sin clases contradictorias para móvil y desktop)      */}
        {/* ========================================================================= */}
        <div className="relative w-full aspect-[16/10] bg-[#060911] border border-zinc-800/80 rounded-xl overflow-hidden shadow-inner">
          
          {/* ===================================================================== */}
          {/* 1. PSU BASEMENT (BOTTOM LEFT: X: 2% -> 21%, Y: 67% -> 97%)             */}
          {/* ===================================================================== */}
          <button
            type="button"
            onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.psu)}
            className={`absolute left-[2%] bottom-[3%] w-[20%] h-[30%] rounded-xl border p-1.5 sm:p-2.5 flex flex-col justify-between text-left transition-all z-20 ${
              isFailed && currentStep.stepNumber <= 5 && currentStep.activeComponents.includes('psu')
                ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                : isComponentActive('psu')
                ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-1 ring-amber-400'
                : isComponentEverReached(1)
                ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300'
                : 'bg-zinc-950/80 border-zinc-800 text-zinc-600 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white font-bold text-[8.5px] sm:text-[11px]">
                  <Power className={`w-3.5 h-3.5 ${isComponentActive('psu') ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`} />
                  <span>PSU ATX</span>
                </div>
                <Fan className={`w-3 h-3 ${isPoweredOn && currentStep.stepNumber >= 4 ? 'text-amber-400 animate-spin' : 'text-zinc-600'}`} />
              </div>
              <div className="text-[7px] sm:text-[8px] text-zinc-400 leading-tight mt-0.5">
                {currentStep.stepNumber === 0
                  ? 'OFF (0V)'
                  : currentStep.stepNumber === 1
                  ? '+5VSB Activo (Standby)'
                  : currentStep.stepNumber < 4
                  ? '+5VSB • Esperando PS_ON#'
                  : '+12V/+5V/+3.3V • PWR_OK'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[6.5px] sm:text-[7.5px] text-zinc-500 font-mono">
              <span>AC INLET</span>
              <span className="text-amber-400/80 font-bold">COMPARTIMIENTO</span>
            </div>
          </button>

          {/* ===================================================================== */}
          {/* 2. MOTHERBOARD PCB (CENTER-RIGHT: X: 23% -> 98%, Y: 3% -> 97%)         */}
          {/* ===================================================================== */}
          <div className="absolute left-[23%] top-[3%] w-[75%] h-[94%] bg-[#0c1220] border-2 border-zinc-700/90 rounded-xl p-2 overflow-hidden shadow-2xl z-10">
            
            {/* PCB Standoff Screws */}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-0" />

            {/* Z1: VRM & FASES (Top-Left: x: 3%, y: 3%, w: 27%, h: 32%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.vrm)}
              className={`absolute left-[3%] top-[3%] w-[27%] h-[32%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isFailed && currentStep.stepNumber === 4
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : isComponentActive('motherboard') && currentStep.stepNumber >= 4
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] ring-1 ring-amber-400'
                  : isComponentEverReached(4)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span className="text-[8.5px] sm:text-[10px] font-bold text-white">VRM FASES</span>
                  </div>
                  <span className="text-[7px] px-1 rounded bg-amber-950 text-amber-300 font-mono">Z1</span>
                </div>
                <div className="text-[7px] sm:text-[8px] text-zinc-400 leading-tight mt-0.5">
                  {currentStep.stepNumber < 4 ? '0V Standby' : 'Alimentación Regulada'}
                </div>
              </div>

              <div className="flex gap-1 pt-1 border-t border-zinc-800/80 opacity-90">
                <span className={`w-2 h-2 rounded-xs border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300' : 'bg-zinc-700 border-zinc-600'}`} />
                <span className={`w-2 h-2 rounded-xs border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300' : 'bg-zinc-700 border-zinc-600'}`} />
                <span className={`w-2 h-2 rounded-xs border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300' : 'bg-zinc-700 border-zinc-600'}`} />
              </div>
            </button>

            {/* Z2: SOCKET CPU & IMC (Top-Center: x: 32%, y: 3%, w: 36%, h: 32%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.cpu)}
              className={`absolute left-[32%] top-[3%] w-[36%] h-[32%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isFailed && [6, 7, 8, 9, 10, 12, 13].includes(currentStep.stepNumber)
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : isComponentActive('cpu')
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400'
                  : isComponentEverReached(6)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-white font-bold text-[9px] sm:text-[11px]">
                    <Cpu className={`w-3.5 h-3.5 ${isComponentActive('cpu') ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                    <span>CPU & IMC</span>
                  </div>
                  <span className="text-[7px] px-1 rounded bg-emerald-950 text-emerald-300 font-mono">Z2</span>
                </div>
                <div className="text-[7px] sm:text-[8px] text-zinc-300 leading-tight mt-0.5 truncate">
                  {currentStep.stepNumber < 6
                    ? 'Reset Activo (0V)'
                    : currentStep.stepNumber < 13
                    ? 'Vector FFFF_FFF0h • Microcódigo'
                    : 'x86-64 Pipeline • Ring 0'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[7px] sm:text-[8px]">
                <span className="text-zinc-400 font-mono">SOCKET PROCESADOR</span>
                <span className={`font-bold ${isComponentActive('cpu') ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`}>
                  {isComponentActive('cpu') ? '● ACTIVO' : 'REPOSO'}
                </span>
              </div>
            </button>

            {/* Z3: SLOTS RAM DIMM (Top-Right: x: 70%, y: 3%, w: 27%, h: 32%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.ram)}
              className={`absolute left-[70%] top-[3%] w-[27%] h-[32%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isFailed && [11, 12].includes(currentStep.stepNumber)
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : isComponentActive('ram')
                  ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.4)] ring-1 ring-blue-400'
                  : isComponentEverReached(10)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-white font-bold text-[8.5px] sm:text-[10px]">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span>RAM DIMM</span>
                  </div>
                  <span className="text-[7px] px-1 rounded bg-blue-950 text-blue-300 font-mono">Z3</span>
                </div>
                <div className="text-[7px] sm:text-[8px] text-zinc-400 leading-tight mt-0.5">
                  {currentStep.stepNumber < 10
                    ? 'Sin Iniciar'
                    : currentStep.stepNumber < 13
                    ? 'Memory Training'
                    : 'DRAM Calibrada'}
                </div>
              </div>

              {/* 4 DIMM sticks */}
              <div className="flex gap-1 justify-center pt-1 border-t border-zinc-800/80">
                <span className={`h-3 w-1 rounded-xs ${isComponentActive('ram') ? 'bg-blue-400 animate-pulse' : 'bg-zinc-700'}`} />
                <span className={`h-3 w-1 rounded-xs ${isComponentActive('ram') ? 'bg-blue-400 animate-pulse' : 'bg-zinc-700'}`} />
                <span className="h-3 w-1 rounded-xs bg-zinc-800" />
                <span className="h-3 w-1 rounded-xs bg-zinc-800" />
              </div>
            </button>

            {/* SUBSISTEMA GRÁFICO (Middle: x: 3%, y: 38%, w: 65%, h: 26%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.gpu)}
              className={`absolute left-[3%] top-[38%] w-[65%] h-[26%] rounded-lg border p-1.5 sm:p-2 flex flex-col justify-between text-left transition-all z-20 ${
                isFailed && [14, 15].includes(currentStep.stepNumber)
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : isComponentActive('gpu')
                  ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] ring-1 ring-indigo-400'
                  : isComponentEverReached(14)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white font-bold text-[8.5px] sm:text-[10px]">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SUBSISTEMA GRÁFICO // (iGPU / dGPU)</span>
                </div>
                <Fan className={`w-3 h-3 ${isComponentActive('gpu') ? 'text-indigo-400 animate-spin' : 'text-zinc-600'}`} />
              </div>

              <div className="text-[7px] sm:text-[8px] text-zinc-400 leading-tight">
                {currentStep.stepNumber < 14
                  ? 'Bus gráfico en reposo'
                  : currentStep.stepNumber < 16
                  ? 'GOP VBIOS Handshake • Framebuffer'
                  : 'Salida de Video Acelerada Activa'}
              </div>

              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden border border-zinc-800">
                <div className={`h-full ${isComponentActive('gpu') ? 'bg-indigo-400 w-full animate-pulse' : isComponentEverReached(14) ? 'bg-indigo-600 w-full' : 'w-0'}`} />
              </div>
            </button>

            {/* M.2 NVMe SSD / STORAGE (Middle-Right: x: 70%, y: 38%, w: 27%, h: 26%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.storage)}
              className={`absolute left-[70%] top-[38%] w-[27%] h-[26%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isFailed && [16, 17, 20, 21].includes(currentStep.stepNumber)
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : isComponentActive('storage')
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400'
                  : isComponentEverReached(17)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white font-bold text-[8.5px] sm:text-[10px]">
                  <HardDrive className="w-3 h-3 text-emerald-400" />
                  <span>ALMACENAMIENTO</span>
                </div>
                <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
              </div>
              <div className="text-[7px] sm:text-[8px] text-zinc-400 leading-tight">
                {currentStep.stepNumber < 16
                  ? 'Sin Interrogar'
                  : currentStep.stepNumber < 22
                  ? 'GPT / ESP Detectado'
                  : 'Lectura de Kernel NTFS'}
              </div>
            </button>

            {/* SPI FLASH BIOS (Bottom-Left: x: 3%, y: 67%, w: 30%, h: 29%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.bios)}
              className={`absolute left-[3%] top-[67%] w-[30%] h-[29%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isFailed && [7, 8, 20].includes(currentStep.stepNumber)
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : isComponentActive('firmware')
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400'
                  : isComponentEverReached(7)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold text-white text-[8.5px] sm:text-[9.5px]">
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span>SPI BIOS</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Pin 1 Index" />
              </div>
              <div className="text-[7px] sm:text-[7.5px] text-zinc-400 leading-tight">
                Flash ROM • Microcódigo & NVRAM
              </div>
            </button>

            {/* Z4: CHIPSET / I-O HUB (Bottom-Center: x: 35%, y: 67%, w: 33%, h: 29%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.pch)}
              className={`absolute left-[35%] top-[67%] w-[33%] h-[29%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isFailed && [13, 16, 18].includes(currentStep.stepNumber)
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : isComponentActive('motherboard') && currentStep.stepNumber >= 2
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400'
                  : isComponentEverReached(2)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold text-white text-[8.5px] sm:text-[9.5px]">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>CHIPSET / I-O HUB</span>
                </div>
                <span className="text-[7px] px-1 rounded bg-cyan-950 text-cyan-300 font-mono">Z4</span>
              </div>
              <div className="text-[7px] sm:text-[7.5px] text-zinc-400 leading-tight">
                Interconexión & Periféricos
              </div>
            </button>

            {/* Z5: HEADER PANEL FRONTAL F_PANEL (Bottom-Right: x: 70%, y: 67%, w: 27%, h: 29%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.fpanel)}
              className={`absolute left-[70%] top-[67%] w-[27%] h-[29%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isFailed && [1, 2].includes(currentStep.stepNumber)
                  ? 'bg-rose-500/25 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : isComponentActive('psu') || currentStep.stepNumber === 1 || currentStep.stepNumber === 2
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-1 ring-amber-400'
                  : currentStep.stepNumber >= 1
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold text-white text-[8.5px] sm:text-[9.5px]">
                  <Power className="w-3 h-3 text-amber-400" />
                  <span>F_PANEL</span>
                </div>
                <span className="text-[7px] px-1 rounded bg-amber-950 text-amber-300 font-mono">Z5</span>
              </div>
              <div className="text-[7px] sm:text-[7.5px] text-zinc-400 leading-tight">
                PWR_SW / RESET
              </div>
            </button>
          </div>

          {/* ===================================================================== */}
          {/* 3. REAL-TIME SVG SIGNAL BUS OVERLAY WITH MOVING TRAVELING PARTICLES  */}
          {/* ===================================================================== */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="sig-glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="sig-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="sig-glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="sig-glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path 01: STANDBY - PSU +5VSB -> Motherboard Standby Logic (Paso 01 ONLY) */}
            <path
              id="path-standby"
              d="M 160 460 L 160 380 L 260 380 L 260 480 L 520 480"
              fill="none"
              stroke={isSignalActive('STANDBY') ? (isFailed ? '#f43f5e' : '#eab308') : '#1e293b'}
              strokeWidth={isSignalActive('STANDBY') ? '4.5' : '1'}
              className={isSignalActive('STANDBY') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('STANDBY') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-amber)') : 'none'}
            />

            {/* Path 02: PWR_SW - Front Button -> F_PANEL -> Motherboard Logic (Paso 02 ONLY) */}
            <path
              id="path-pwr-sw"
              d="M 940 500 L 820 500 L 820 450 L 720 450"
              fill="none"
              stroke={isSignalActive('PWR_SW') ? (isFailed ? '#f43f5e' : '#f59e0b') : '#1e293b'}
              strokeWidth={isSignalActive('PWR_SW') ? '4.5' : '1'}
              className={isSignalActive('PWR_SW') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PWR_SW') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-amber)') : 'none'}
            />

            {/* Path 03: PS_ON# - Motherboard Logic -> PSU (Paso 03 ONLY) */}
            <path
              id="path-pson"
              d="M 720 480 L 720 540 L 150 540"
              fill="none"
              stroke={isSignalActive('PS_ON#') ? (isFailed ? '#f43f5e' : '#10b981') : '#1e293b'}
              strokeWidth={isSignalActive('PS_ON#') ? '4.5' : '1'}
              className={isSignalActive('PS_ON#') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PS_ON#') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-emerald)') : 'none'}
            />

            {/* Path 04: RAILS_MAIN - PSU Main Power Rails -> VRM & Motherboard (Paso 04 ONLY) */}
            <path
              id="path-rails"
              d="M 120 480 L 120 120 L 320 120"
              fill="none"
              stroke={isSignalActive('RAILS_MAIN') ? (isFailed ? '#f43f5e' : '#f59e0b') : '#1e293b'}
              strokeWidth={isSignalActive('RAILS_MAIN') ? '5' : '1'}
              className={isSignalActive('RAILS_MAIN') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('RAILS_MAIN') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-amber)') : 'none'}
            />

            {/* Path 05: PWR_OK - PSU -> Reset/Platform Logic (Paso 05 ONLY) */}
            <path
              id="path-pwrok"
              d="M 180 500 L 450 500 L 450 440"
              fill="none"
              stroke={isSignalActive('PWR_OK') ? (isFailed ? '#f43f5e' : '#38bdf8') : '#1e293b'}
              strokeWidth={isSignalActive('PWR_OK') ? '4.5' : '1'}
              className={isSignalActive('PWR_OK') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PWR_OK') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-cyan)') : 'none'}
            />

            {/* Path 06: RESET# - Platform Logic -> CPU Socket (Paso 06 ONLY) */}
            <path
              id="path-reset"
              d="M 450 440 L 450 180 L 510 180"
              fill="none"
              stroke={isSignalActive('RESET#') ? (isFailed ? '#f43f5e' : '#06b6d4') : '#1e293b'}
              strokeWidth={isSignalActive('RESET#') ? '4.5' : '1'}
              className={isSignalActive('RESET#') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('RESET#') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-cyan)') : 'none'}
            />

            {/* Path 07-09: FIRMWARE_FETCH - CPU initiates execution from mapped SPI ROM */}
            <path
              id="path-spi"
              d="M 510 180 L 360 220 L 360 440"
              fill="none"
              stroke={isSignalActive('FIRMWARE_FETCH') ? (isFailed ? '#f43f5e' : '#a855f7') : '#1e293b'}
              strokeWidth={isSignalActive('FIRMWARE_FETCH') ? '4' : '1'}
              className={isSignalActive('FIRMWARE_FETCH') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('FIRMWARE_FETCH') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-cyan)') : 'none'}
            />

            {/* Path 10-12: RAM_TRAIN - CPU/IMC ↔ RAM DIMM Slots (SPD & Training) */}
            <path
              id="path-ram"
              d="M 640 120 L 780 120"
              fill="none"
              stroke={isSignalActive('RAM_TRAIN') ? (isFailed ? '#f43f5e' : '#3b82f6') : '#1e293b'}
              strokeWidth={isSignalActive('RAM_TRAIN') ? '5' : '1'}
              className={isSignalActive('RAM_TRAIN') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('RAM_TRAIN') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-cyan)') : 'none'}
            />

            {/* Path 13: PLATFORM_INTERCONNECT - CPU/SoC ↔ Chipset / I-O Hub */}
            <path
              id="path-interconnect"
              d="M 520 180 L 520 440"
              fill="none"
              stroke={isSignalActive('PLATFORM_INTERCONNECT') ? (isFailed ? '#f43f5e' : '#06b6d4') : '#1e293b'}
              strokeWidth={isSignalActive('PLATFORM_INTERCONNECT') ? '4.5' : '1'}
              className={isSignalActive('PLATFORM_INTERCONNECT') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PLATFORM_INTERCONNECT') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-cyan)') : 'none'}
            />

            {/* Path 14-15: PCIE_GPU - CPU / PCIe Root ↔ Subsistema Gráfico */}
            <path
              id="path-gpu"
              d="M 520 180 L 520 280 L 440 280"
              fill="none"
              stroke={isSignalActive('PCIE_GPU') ? (isFailed ? '#f43f5e' : '#6366f1') : '#1e293b'}
              strokeWidth={isSignalActive('PCIE_GPU') ? '4.5' : '1'}
              className={isSignalActive('PCIE_GPU') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PCIE_GPU') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-cyan)') : 'none'}
            />

            {/* Path 16-21: STORAGE_BUS - Platform / Controller ↔ Almacenamiento */}
            <path
              id="path-storage"
              d="M 580 440 L 580 320 L 780 320"
              fill="none"
              stroke={isSignalActive('STORAGE_BUS') ? (isFailed ? '#f43f5e' : '#10b981') : '#1e293b'}
              strokeWidth={isSignalActive('STORAGE_BUS') ? '4' : '1'}
              className={isSignalActive('STORAGE_BUS') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('STORAGE_BUS') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-emerald)') : 'none'}
            />

            {/* Path 22-34: WIN_PIPELINE - Storage ➔ RAM ➔ CPU ➔ Sistema Operativo */}
            <path
              id="path-win"
              d="M 780 300 L 780 160 L 620 120"
              fill="none"
              stroke={isSignalActive('WIN_PIPELINE') ? (isFailed ? '#f43f5e' : '#06b6d4') : '#1e293b'}
              strokeWidth={isSignalActive('WIN_PIPELINE') ? '4' : '1'}
              className={isSignalActive('WIN_PIPELINE') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('WIN_PIPELINE') ? (isFailed ? 'url(#sig-glow-rose)' : 'url(#sig-glow-cyan)') : 'none'}
            />
          </svg>
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
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold font-mono-tech transition-colors"
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
