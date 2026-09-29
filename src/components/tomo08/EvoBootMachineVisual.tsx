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
    queEs: 'Unidad Central de Procesamiento x86-64 con controlador de memoria integrado (IMC) y líneas PCIe directas.',
    queHace: 'Ejecuta el vector de reset, el microcódigo UEFI, entrena la RAM a través del IMC y procesa las instrucciones del kernel.',
    cuandoInterviene: 'Desde el Paso 06 (Liberación de Reset / Vector FFFF_FFF0h) hasta el escritorio de Windows en ejecución continua.',
    fallasPosibles: [
      'Pines del socket doblados o presión desbalanceada del disipador.',
      'Falla del IMC impidiendo el entrenamiento de memoria (Memory Training).',
      'Protección térmica por montaje incorrecto de pasta térmica o cooler.',
    ],
  },
  vrm: {
    title: 'VRM // MÓDULO REGULADOR DE VOLTAJE',
    category: 'ALIMENTACIÓN DE SILICIO',
    queEs: 'Circuito reductor multifase (MOSFETs/Power Stages, Chokes de ferrita y condensadores de tantalio) gobernado por PWM.',
    queHace: 'Convierte los +12V de la fuente de poder en voltajes precisos y limpios de bajo rizado (VCore nominal, VDDQ, VSoC).',
    cuandoInterviene: 'Paso 05 (Estabilización de rieles de potencia y generación de VCore previo al desreset del CPU).',
    fallasPosibles: [
      'Cortocircuito en MOSFETs de alta drenando el riel de +12V de la fuente a masa.',
      'Sobrecalentamiento extremo de fases por flujo de aire nulo en el gabinete.',
      'Rizado de tensión excesivo provocando reinicios espontáneos en carga.',
    ],
  },
  ram: {
    title: 'RAM // MEMORIA DE ACCESO ALEATORIO',
    category: 'SUBSISTEMA DE MEMORIA',
    queEs: 'Módulos DIMM sincrónicos de alta velocidad conectados en canales dedicados al controlador de memoria del procesador.',
    queHace: 'Almacena el código ejecutable del firmware UEFI, el cargador winload.efi, el kernel ntoskrnl.exe y los procesos de usuario.',
    cuandoInterviene: 'Paso 10 (Lectura SPD en bus SMBus), Paso 12 (Entrenamiento de señal DQS/DQ) y permanente tras el POST.',
    fallasPosibles: [
      'Falso contacto por suciedad u óxido en los pads dorados del slot.',
      'Inestabilidad por perfil de frecuencias o latencias incompatible con el IMC.',
      'Celdas degradadas que provocan volcados de memoria y BSODs esporádicos.',
    ],
  },
  gpu: {
    title: 'GPU // TARJETA GRÁFICA DEDICADA & GOP',
    category: 'PROCESAMIENTO VISUAL & PCIe',
    queEs: 'Unidad de procesamiento gráfico dedicada conectada mediante enlace PCIe primario con memoria VRAM y driver GOP.',
    queHace: 'Inicializa el framebuffer básico UEFI mediante Graphics Output Protocol (GOP) y asume la aceleración por hardware con el driver nativo.',
    cuandoInterviene: 'Paso 14 (Enumeración PCIe), Paso 15 (Inicialización GOP / VBIOS) y Paso 29+ (DirectX DWM / Pantalla nativa).',
    fallasPosibles: [
      'Conectores de alimentación auxiliar PCIe de 8 pines desconectados o flojos.',
      'Traba de retención del slot PCIe desacoplada impidiendo el link x16.',
      'Incompatibilidad con el protocolo UEFI GOP en tarjetas antiguas (modo Legacy/CSM).',
    ],
  },
  storage: {
    title: 'STORAGE // SSD NVMe M.2 & GPT',
    category: 'ALMACENAMIENTO MASIVO',
    queEs: 'Unidad de estado sólido con protocolo NVMe conectada directamente por líneas PCIe al CPU o al Chipset.',
    queHace: 'Alberga la tabla de particiones GPT, la partición de sistema EFI (ESP) en formato FAT32 y el volumen NTFS con Windows.',
    cuandoInterviene: 'Paso 17 (Identificación PCIe NVMe), Paso 20 (Boot Device Selection) y Paso 22+ (Carga de binarios de arranque).',
    fallasPosibles: [
      'Corrupción en el almacén BCD o partición EFI (mensaje "No bootable device").',
      'Controlador NVMe en modo incompatible en BIOS (VMD / RAID vs AHCI).',
      'Desgaste de celdas NAND o firmware del SSD bloqueado en modo de solo lectura.',
    ],
  },
  pch: {
    title: 'PCH // PLATFORM CONTROLLER HUB (CHIPSET)',
    category: 'CONTROLADOR DE BUSES & PERIFÉRICOS',
    queEs: 'Circuito integrado concentrador que gestiona líneas PCIe secundarias, puertos SATA, controladoras USB, audio y el enlace DMI/LPC al procesador.',
    queHace: 'Distribuye el tráfico periférico, participa en la gestión de estados de energía ACPI (S0–S5) y coordina señales con el Super I/O y el firmware.',
    cuandoInterviene: 'Paso 02 (Enrutamiento de standby y buses), Paso 17 (Detección de almacenamiento/USB) y ejecución permanente en tiempo de ejecución.',
    fallasPosibles: [
      'Sobrecalentamiento del silicio PCH por disipador flojo, sucio o almohadilla térmica degradada.',
      'Líneas USB o puertos SATA en cortocircuito que bloquean la secuencia de encendido en reposo.',
      'Pérdida de enlace DMI con la CPU impidiendo la detección de unidades y puertos.',
    ],
  },
  fpanel: {
    title: 'HEADER PANEL FRONTAL // F_PANEL & PWR_SW',
    category: 'INTERFAZ DE CONTROL FÍSICO',
    queEs: 'Bloque de pines estandarizado en la esquina de la placa base para pulsadores (PWR_SW, RESET_SW) y testigos luminosos (PWR_LED, HDD_LED).',
    queHace: 'Al cerrarse momentáneamente el contacto entre los pines PWR_SW, envía un pulso a masa que la lógica de la motherboard interpreta para activar PS_ON#.',
    cuandoInterviene: 'Paso 01 (Pulsación física del botón de encendido) y Paso 02 (Detección de flanco por Super I/O / EC / PCH).',
    fallasPosibles: [
      'Pulsador físico del gabinete trabado o sulfatado (provoca apagado forzado tras 4 segundos).',
      'Conectores invertidos o colocados en pines equivocados (ej. pulsar reset en lugar de power).',
      'Pines doblados o sulfato en el header impidiendo el cierre de contacto a tierra.',
    ],
  },
  bios: {
    title: 'SPI FLASH // CHIP FIRMWARE UEFI',
    category: 'FIRMWARE & NVRAM',
    queEs: 'Circuito integrado Flash SPI de 8 pines que almacena el microcódigo UEFI, tablas ACPI y variables no volátiles NVRAM.',
    queHace: 'Primer código que lee el CPU al encender para ejecutar el POST, configurar hardware y lanzar el bootloader.',
    cuandoInterviene: 'Paso 07 (Fetch del vector de reset en dirección FFFF_FFF0h) hasta el Paso 22 (Transferencia a winload.efi).',
    fallasPosibles: [
      'Firmware corrupto tras una actualización fallida o corte de luz durante el flasheo.',
      'Pila CMOS agotada provocando reseteo a valores de fábrica en cada corte eléctrico.',
      'Variables de orden de arranque en NVRAM borradas tras un Clear CMOS.',
    ],
  },
  psu: {
    title: 'PSU // FUENTE DE PODER ATX',
    category: 'ENERGÍA PRIMARIA & SECUNDARIA',
    queEs: 'Convertidor conmutado AC-DC que suministra rieles estabilizados (+12V, +5V, +3.3V, -12V y +5VSB) a la computadora.',
    queHace: 'Genera el riel permanente de standby (+5VSB) apenas recibe corriente AC, responde a la señal lógica PS_ON# y confirma estabilidad con PWR_OK.',
    cuandoInterviene: 'Paso 00 (Standby inicial), Paso 03 (Arranque conmutado) y Paso 04 (Emisión de PWR_OK en menos de 500ms).',
    fallasPosibles: [
      'Riel +5VSB inoperativo por falla en el transformador auxiliar (equipo completamente muerto).',
      'Señal PWR_OK ausente o desfasada haciendo que la placa base mantenga al CPU en reset permanente.',
      'Rizado excesivo en +12V por condensadores electrolíticos desgastados.',
    ],
  },
  motherboard: {
    title: 'MOTHERBOARD // PCB, SUPER I/O & POWER LOGIC',
    category: 'COLUMNA VERTEBRAL & BUSES',
    queEs: 'Circuito impreso multicapa que interconecta todos los componentes, chips Super I/O, RTC y lógica de potencia.',
    queHace: 'Coordina la secuencia de encendido mediante lógica combinacional, enruta buses DMI/PCIe/SPI y distribuye energía.',
    cuandoInterviene: 'Paso 01 al 34 en todo momento de la vida operativa del sistema.',
    fallasPosibles: [
      'Pistas cortadas, sulfato o corrosión por humedad.',
      'Controlador Super I/O averiado que no procesa la pulsación del botón frontal.',
      'Cortocircuitos en condensadores cerámicos SMD del riel principal.',
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

  const isConnectionActive = (connectionName: string) => {
    return isPoweredOn && (currentStep.activeConnections || []).includes(connectionName);
  };

  const isSignalActive = (signalType: string) => {
    if (!isPoweredOn) return false;
    switch (signalType) {
      case 'PWR_SW':
        return isConnectionActive('front-panel-pulse') || currentStep.stepNumber === 1 || currentStep.stepNumber === 2;
      case 'PS_ON#':
        return isConnectionActive('mobo-psu-pson') || currentStep.stepNumber === 3;
      case 'RAILS_MAIN':
        return (
          isConnectionActive('psu-rails-12v') ||
          isConnectionActive('psu-rails-5v') ||
          isConnectionActive('psu-mobo-standby') ||
          currentStep.stepNumber === 4 ||
          currentStep.stepNumber === 1
        );
      case 'PWR_OK':
        return isConnectionActive('psu-mobo-pwrok') || currentStep.stepNumber === 5;
      case 'RESET#':
        return isConnectionActive('mobo-cpu-reset') || currentStep.stepNumber === 6;
      case 'SPI_BUS':
        return (
          isConnectionActive('cpu-spi-flash') ||
          currentStep.stepNumber === 7 ||
          currentStep.stepNumber === 8 ||
          currentStep.stepNumber === 9
        );
      case 'RAM_BUS':
        return (
          isConnectionActive('cpu-ram-spd') ||
          isConnectionActive('cpu-ram-data-bus') ||
          isConnectionActive('cpu-imc-bus') ||
          (currentStep.stepNumber >= 10 && currentStep.stepNumber <= 13)
        );
      case 'PCIE_GPU':
        return (
          isConnectionActive('cpu-gpu-pcie') ||
          isConnectionActive('cpu-pcie-root') ||
          currentStep.stepNumber === 14 ||
          currentStep.stepNumber === 15 ||
          currentStep.stepNumber === 16
        );
      case 'STORAGE_BUS':
        return (
          isConnectionActive('pcie-nvme-controller') ||
          isConnectionActive('storage-firmware-query') ||
          currentStep.stepNumber === 17 ||
          currentStep.stepNumber === 18 ||
          currentStep.stepNumber === 19 ||
          currentStep.stepNumber === 20 ||
          currentStep.stepNumber === 21
        );
      case 'BOOT_STREAM':
        return currentStep.stepNumber >= 22 && currentStep.stepNumber <= 34;
      default:
        return isConnectionActive(signalType);
    }
  };

  const getStepSignalTitle = () => {
    if (isSignalActive('PWR_SW')) return 'PWR_SW // Pulso de Panel Frontal (Pines 6-8 a Masa)';
    if (isSignalActive('PS_ON#')) return 'PS_ON# // Activación Lógica de Fuente (0V Cable Verde)';
    if (isSignalActive('PWR_OK')) return 'PWR_OK (Power Good) // Rieles Estabilizados (+5V Cable Gris)';
    if (isSignalActive('RESET#')) return 'RESET# // Liberación de Reset CPU (Transición Low ➔ High)';
    if (isSignalActive('SPI_BUS')) return 'SPI BUS // Fetch de Microcódigo & Vector FFFF_FFF0h';
    if (isSignalActive('RAM_BUS')) return 'MEMORY BUS // SPD I2C & Calibración DQS/DQ (Memory Training)';
    if (isSignalActive('PCIE_GPU')) return 'PCIe LINK // Handshake GOP & Inicialización de Framebuffer';
    if (isSignalActive('STORAGE_BUS')) return 'NVMe / STORAGE BUS // Lectura de Partición EFI (ESP) & BCD';
    if (isSignalActive('BOOT_STREAM')) return 'WINDOWS PIPELINE // Carga de Kernel, HAL, Drivers y Sesión';
    if (isSignalActive('RAILS_MAIN')) return 'RIELES PRINCIPALES // Distribución de +12V, +5V, +3.3V y +5VSB';
    return 'REPOSO LÓGICO // Esperando evento de inicio';
  };

  const getStepActionFlow = () => {
    if (currentStep.stepNumber === 0) return 'Conexión Eléctrica ➔ Standby Primario';
    if (currentStep.stepNumber === 1) return 'PSU (+5VSB) ➔ Super I/O & Lógica de Standby';
    if (currentStep.stepNumber === 2) return 'Botón Frontal ➔ PWR_SW ➔ Flanco a Masa (0V)';
    if (currentStep.stepNumber === 3) return 'Motherboard (Super I/O) ➔ PS_ON# ➔ PSU';
    if (currentStep.stepNumber === 4) return 'PSU ➔ +12V / +5V / +3.3V ➔ VRM & Motherboard';
    if (currentStep.stepNumber === 5) return 'PSU (PWR_OK Estable) ➔ Lógica de Reset';
    if (currentStep.stepNumber === 6) return 'Lógica de Reset ➔ Desreset CPU (RESET# High)';
    if (currentStep.stepNumber >= 7 && currentStep.stepNumber <= 9) return 'SPI Flash (UEFI) ➔ CPU Vector FFFF_FFF0h';
    if (currentStep.stepNumber >= 10 && currentStep.stepNumber <= 13) return 'CPU / IMC ↔ Slots RAM (SPD & Training)';
    if (currentStep.stepNumber >= 14 && currentStep.stepNumber <= 16) return 'CPU / PCIe Root ↔ GPU ➔ Monitor (GOP Framebuffer)';
    if (currentStep.stepNumber >= 17 && currentStep.stepNumber <= 21) return 'CPU / PCH ↔ NVMe M.2 ➔ Lectura GPT / ESP';
    if (currentStep.stepNumber >= 22 && currentStep.stepNumber <= 34) return 'Storage ➔ Boot Manager ➔ Kernel NT ➔ Escritorio';
    return `${currentStep.initiator} ➔ ${currentStep.responder}`;
  };

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
          animation: evoSignalPulse 1.2s linear infinite;
        }
      `}</style>

      {/* Background Technical Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* ========================================================================= */}
      {/* PROMINENT STAGE HEADER BANNER (SECCIÓN 7)                                 */}
      {/* ========================================================================= */}
      <div className="pb-3 border-b border-zinc-800/90 mb-3.5 space-y-2 relative z-10">
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
              className="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase"
              style={{
                backgroundColor: `${currentStep.layerColor}20`,
                color: currentStep.layerColor,
                border: `1px solid ${currentStep.layerColor}50`,
              }}
            >
              {!isPoweredOn ? 'OFF' : isFailed ? 'DETENCIÓN' : currentStep.powerState}
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono-tech">
              PASO {String(currentStep.stepNumber).padStart(2, '0')} / 34
            </span>
          </div>
        </div>

        {/* Live Traveling Signal Box */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">AHORA ESTÁ OCURRIENDO:</span>
            <strong className="text-cyan-300 text-[11px] font-mono">{getStepActionFlow()}</strong>
          </div>

          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
            <Zap className="w-3 h-3 animate-bounce" />
            <span>SEÑAL: <strong>{getStepSignalTitle()}</strong></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUADRO CENTRAL: GABINETE ABIERTO CON PLANO DE PLACA FIJO NO APILABLE       */}
      {/* (Mantiene topología 100% fija en desktop y mobile con escala proporcional) */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#080c16] border-2 border-zinc-700/80 rounded-2xl p-2 sm:p-3 overflow-hidden shadow-2xl z-10 flex flex-col justify-between">
        
        {/* Chassis Ventilation & Status Strip */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-800/80 text-[9.5px]">
          <div className="flex items-center gap-1.5 font-bold text-zinc-300">
            <CircuitBoard className="w-3.5 h-3.5 text-cyan-400" />
            <span>GABINETE ABIERTO // CORTE LATERAL & MOTHERBOARD</span>
          </div>

          <div className="flex items-center gap-3 text-[8.5px] font-mono text-zinc-400">
            <div className="flex items-center gap-1">
              <Fan className={`w-3 h-3 ${isPoweredOn && currentStep.stepNumber >= 4 ? 'text-cyan-400 animate-spin' : 'text-zinc-600'}`} />
              <span className="hidden sm:inline">COOLER TRASERO</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TOPOLOGÍA FIJA</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CANVAS DE PLACA & GABINETE CON POSICIONES PORCENTUALES ESTABLES          */}
        {/* ========================================================================= */}
        <div className="relative w-full aspect-[16/10.5] sm:aspect-[16/9.5] min-h-[360px] sm:min-h-[420px] max-h-[580px] bg-[#060911] border border-zinc-800/80 rounded-xl overflow-hidden shadow-inner">
          
          {/* ===================================================================== */}
          {/* 1. PSU BASEMENT (BOTTOM LEFT: X: 2% -> 22%, Y: 68% -> 96%)            */}
          {/* ===================================================================== */}
          <button
            type="button"
            onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.psu)}
            className={`absolute left-[2%] bottom-[3%] w-[21%] h-[30%] rounded-xl border p-1.5 sm:p-2.5 flex flex-col justify-between text-left transition-all z-20 ${
              isComponentActive('psu')
                ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-1 ring-amber-400'
                : isComponentEverReached(1)
                ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300'
                : 'bg-zinc-950/80 border-zinc-800 text-zinc-600 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white font-bold text-[9px] sm:text-[11px]">
                  <Power className={`w-3.5 h-3.5 ${isComponentActive('psu') ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`} />
                  <span>PSU ATX</span>
                </div>
                <Fan className={`w-3 h-3 ${isPoweredOn && currentStep.stepNumber >= 4 ? 'text-amber-400 animate-spin' : 'text-zinc-600'}`} />
              </div>
              <div className="text-[7px] sm:text-[8px] text-zinc-400 leading-tight mt-0.5">
                {currentStep.stepNumber === 0
                  ? 'OFF (0V)'
                  : currentStep.stepNumber < 4
                  ? '+5VSB Activo (Pin 9)'
                  : '+12V/+5V/+3.3V • PWR_OK'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[6.5px] sm:text-[7.5px] text-zinc-500 font-mono">
              <span>AC 220V/110V</span>
              <span className="text-amber-400/80 font-bold">COMPARTIMIENTO</span>
            </div>
          </button>

          {/* ===================================================================== */}
          {/* 2. MOTHERBOARD PCB (CENTER-RIGHT: X: 24.5% -> 98%, Y: 4% -> 96%)      */}
          {/* ===================================================================== */}
          <div className="absolute left-[24.5%] top-[3%] w-[73.5%] h-[94%] bg-[#0c1220] border-2 border-zinc-700/90 rounded-xl p-2 relative overflow-hidden shadow-2xl z-10">
            
            {/* PCB Standoff Screws */}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-0" />

            {/* Z1: VRM & FASES (Top-Left: x: 3%, y: 3%, w: 26%, h: 32%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.vrm)}
              className={`absolute left-[3%] top-[3%] w-[27%] h-[32%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isComponentActive('motherboard') && currentStep.stepNumber >= 4
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
                  {currentStep.stepNumber < 4 ? '0V Standby' : 'VCore Regulado'}
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
                isComponentActive('cpu')
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
                <span className="text-zinc-400 font-mono">LGA/AM</span>
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
                isComponentActive('ram')
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

            {/* PCIe x16 SLOT & GPU (Middle: x: 3%, y: 38%, w: 65%, h: 26%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.gpu)}
              className={`absolute left-[3%] top-[38%] w-[65%] h-[26%] rounded-lg border p-1.5 sm:p-2 flex flex-col justify-between text-left transition-all z-20 ${
                isComponentActive('gpu')
                  ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] ring-1 ring-indigo-400'
                  : isComponentEverReached(14)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white font-bold text-[8.5px] sm:text-[10.5px]">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SLOT PCIe x16 // GPU DEDICADA</span>
                </div>
                <Fan className={`w-3 h-3 ${isComponentActive('gpu') ? 'text-indigo-400 animate-spin' : 'text-zinc-600'}`} />
              </div>

              <div className="text-[7px] sm:text-[8px] text-zinc-400 leading-tight">
                {currentStep.stepNumber < 14
                  ? 'PCIe en reposo'
                  : currentStep.stepNumber < 16
                  ? 'GOP VBIOS Handshake'
                  : 'Salida de Video Acelerada'}
              </div>

              <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden border border-zinc-800">
                <div className={`h-full ${isComponentActive('gpu') ? 'bg-indigo-400 w-full animate-pulse' : isComponentEverReached(14) ? 'bg-indigo-600 w-full' : 'w-0'}`} />
              </div>
            </button>

            {/* M.2 NVMe SSD (Middle-Right: x: 70%, y: 38%, w: 27%, h: 26%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.storage)}
              className={`absolute left-[70%] top-[38%] w-[27%] h-[26%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isComponentActive('storage')
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400'
                  : isComponentEverReached(17)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white font-bold text-[8.5px] sm:text-[10px]">
                  <HardDrive className="w-3 h-3 text-emerald-400" />
                  <span>NVMe M.2</span>
                </div>
                <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
              </div>
              <div className="text-[7px] sm:text-[8px] text-zinc-400 leading-tight">
                {currentStep.stepNumber < 17
                  ? 'Sin Interrogar'
                  : currentStep.stepNumber < 22
                  ? 'GPT / ESP Detectado'
                  : 'Lectura NTFS Kernel'}
              </div>
            </button>

            {/* SPI FLASH BIOS (Bottom-Left: x: 3%, y: 67%, w: 30%, h: 29%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.bios)}
              className={`absolute left-[3%] top-[67%] w-[30%] h-[29%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isComponentActive('firmware')
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
                SOIC-8 Flash • Microcódigo & NVRAM
              </div>
            </button>

            {/* Z4: PCH / CHIPSET (Bottom-Center: x: 35%, y: 67%, w: 33%, h: 29%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.pch)}
              className={`absolute left-[35%] top-[67%] w-[33%] h-[29%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isComponentActive('motherboard') && currentStep.stepNumber >= 2
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400'
                  : isComponentEverReached(2)
                  ? 'bg-zinc-900/85 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold text-white text-[8.5px] sm:text-[9.5px]">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>PCH CHIPSET</span>
                </div>
                <span className="text-[7px] px-1 rounded bg-cyan-950 text-cyan-300 font-mono">Z4</span>
              </div>
              <div className="text-[7px] sm:text-[7.5px] text-zinc-400 leading-tight">
                DMI Link & Periféricos
              </div>
            </button>

            {/* Z5: HEADER PANEL FRONTAL F_PANEL (Bottom-Right: x: 70%, y: 67%, w: 27%, h: 29%) */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.fpanel)}
              className={`absolute left-[70%] top-[67%] w-[27%] h-[29%] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all z-20 ${
                isComponentActive('psu') || currentStep.stepNumber === 1 || currentStep.stepNumber === 2
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
                PWR_SW / RESET Header
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
            </defs>

            {/* Path 1: Front Power Button -> F_PANEL (Z5) -> Power Logic */}
            <path
              id="path-pwr-sw"
              d="M 940 500 L 820 500 L 820 450"
              fill="none"
              stroke={isSignalActive('PWR_SW') ? '#f59e0b' : '#1e293b'}
              strokeWidth={isSignalActive('PWR_SW') ? '4.5' : '1.5'}
              className={isSignalActive('PWR_SW') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PWR_SW') ? 'url(#sig-glow-amber)' : 'none'}
            />

            {/* Path 2: Motherboard Power Logic -> PSU [PS_ON#] */}
            <path
              id="path-pson"
              d="M 720 480 L 720 540 L 150 540"
              fill="none"
              stroke={isSignalActive('PS_ON#') ? '#10b981' : '#1e293b'}
              strokeWidth={isSignalActive('PS_ON#') ? '4.5' : '1.5'}
              className={isSignalActive('PS_ON#') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PS_ON#') ? 'url(#sig-glow-emerald)' : 'none'}
            />

            {/* Path 3: PSU Main Cable Harness -> VRM & Motherboard Power [RAILS_MAIN] */}
            <path
              id="path-rails"
              d="M 120 480 L 120 120 L 320 120"
              fill="none"
              stroke={isSignalActive('RAILS_MAIN') ? '#f59e0b' : '#1e293b'}
              strokeWidth={isSignalActive('RAILS_MAIN') ? '5' : '1.5'}
              className={isSignalActive('RAILS_MAIN') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('RAILS_MAIN') ? 'url(#sig-glow-amber)' : 'none'}
            />

            {/* Path 4: PSU -> Reset Controller [PWR_OK] */}
            <path
              id="path-pwrok"
              d="M 180 500 L 450 500 L 450 440"
              fill="none"
              stroke={isSignalActive('PWR_OK') ? '#38bdf8' : '#1e293b'}
              strokeWidth={isSignalActive('PWR_OK') ? '4.5' : '1.5'}
              className={isSignalActive('PWR_OK') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PWR_OK') ? 'url(#sig-glow-cyan)' : 'none'}
            />

            {/* Path 5: Reset Controller -> CPU Socket [RESET#] */}
            <path
              id="path-reset"
              d="M 450 440 L 450 180 L 510 180"
              fill="none"
              stroke={isSignalActive('RESET#') ? '#06b6d4' : '#1e293b'}
              strokeWidth={isSignalActive('RESET#') ? '4.5' : '1.5'}
              className={isSignalActive('RESET#') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('RESET#') ? 'url(#sig-glow-cyan)' : 'none'}
            />

            {/* Path 6: SPI Flash BIOS -> CPU Socket [SPI Microcode Fetch] */}
            <path
              id="path-spi"
              d="M 360 440 L 360 220 L 510 180"
              fill="none"
              stroke={isSignalActive('SPI_BUS') ? '#a855f7' : '#1e293b'}
              strokeWidth={isSignalActive('SPI_BUS') ? '4' : '1.5'}
              className={isSignalActive('SPI_BUS') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('SPI_BUS') ? 'url(#sig-glow-cyan)' : 'none'}
            />

            {/* Path 7: CPU / IMC <-> RAM DIMM Slots [DQS / DQ Memory Training] */}
            <path
              id="path-ram"
              d="M 640 120 L 780 120"
              fill="none"
              stroke={isSignalActive('RAM_BUS') ? '#3b82f6' : '#1e293b'}
              strokeWidth={isSignalActive('RAM_BUS') ? '5' : '1.5'}
              className={isSignalActive('RAM_BUS') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('RAM_BUS') ? 'url(#sig-glow-cyan)' : 'none'}
            />

            {/* Path 8: CPU Socket <-> PCIe x16 GPU Card */}
            <path
              id="path-gpu"
              d="M 520 180 L 520 280 L 440 280"
              fill="none"
              stroke={isSignalActive('PCIE_GPU') ? '#6366f1' : '#1e293b'}
              strokeWidth={isSignalActive('PCIE_GPU') ? '4.5' : '1.5'}
              className={isSignalActive('PCIE_GPU') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('PCIE_GPU') ? 'url(#sig-glow-cyan)' : 'none'}
            />

            {/* Path 9: Chipset PCH <-> NVMe M.2 Slot */}
              <path
              id="path-nvme"
              d="M 580 440 L 580 320 L 780 320"
              fill="none"
              stroke={isSignalActive('STORAGE_BUS') ? '#10b981' : '#1e293b'}
              strokeWidth={isSignalActive('STORAGE_BUS') ? '4' : '1.5'}
              className={isSignalActive('STORAGE_BUS') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('STORAGE_BUS') ? 'url(#sig-glow-emerald)' : 'none'}
            />

            {/* Path 10: Storage -> RAM -> CPU -> Execution [BOOT STREAM] */}
            <path
              id="path-boot"
              d="M 780 300 L 780 160 L 620 120"
              fill="none"
              stroke={isSignalActive('BOOT_STREAM') ? '#06b6d4' : '#1e293b'}
              strokeWidth={isSignalActive('BOOT_STREAM') ? '4' : '1.5'}
              className={isSignalActive('BOOT_STREAM') ? 'animate-signal-flow' : ''}
              filter={isSignalActive('BOOT_STREAM') ? 'url(#sig-glow-cyan)' : 'none'}
            />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOWER PANEL: SOFTWARE PIPELINE & MONITOR DISPLAY SCREEN                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3 relative z-10">
        
        {/* Left 7 Cols: Software Overlays (Contexto de ejecución) */}
        <div className="md:col-span-7 bg-[#080c16] border border-zinc-800 rounded-xl p-3 flex flex-col justify-between gap-2">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-zinc-800">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>ESTRUCTURA DE SOFTWARE & KERNEL</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[8.5px]">
            <div className={`p-1.5 rounded-lg border text-center ${isComponentActive('bootManager') ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-zinc-950 border-zinc-850 text-zinc-600'}`}>
              <div className="font-bold">1. BOOTLOADER</div>
              <div className="text-[7px] text-zinc-500">bootmgfw / BCD</div>
            </div>

            <div className={`p-1.5 rounded-lg border text-center ${isComponentActive('kernel') ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200' : 'bg-zinc-950 border-zinc-850 text-zinc-600'}`}>
              <div className="font-bold">2. KERNEL NT</div>
              <div className="text-[7px] text-zinc-500">ntoskrnl / HAL</div>
            </div>

            <div className={`p-1.5 rounded-lg border text-center ${isComponentActive('drivers') || isComponentActive('services') ? 'bg-purple-500/20 border-purple-400 text-purple-200' : 'bg-zinc-950 border-zinc-850 text-zinc-600'}`}>
              <div className="font-bold">3. DRIVERS</div>
              <div className="text-[7px] text-zinc-500">BOOT_START / SCM</div>
            </div>

            <div className={`p-1.5 rounded-lg border text-center ${isComponentActive('userSession') || isComponentActive('desktop') ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-zinc-950 border-zinc-850 text-zinc-600'}`}>
              <div className="font-bold">4. ESCRITORIO</div>
              <div className="text-[7px] text-zinc-500">DWM / Explorer</div>
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
