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
    queHace: 'Genera el riel permanente de standby (+5VSB), responde a la señal lógica PS_ON# y confirma estabilidad con PWR_OK.',
    cuandoInterviene: 'Paso 00 (Standby inicial), Paso 03 (Arranque conmutado) y Paso 04 (Emisión de PWR_OK en menos de 500ms).',
    fallasPosibles: [
      'Riel +5VSB inoperativo por falla en el transformador auxiliar (equipo "muerto").',
      'Señal PWR_OK ausente o desfasada haciendo que la placa base mantenga al CPU en reset.',
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
    if (isSignalActive('PWR_SW')) return '⚡ PWR_SW // Pulso de Panel Frontal (Pines 6-8 a Masa)';
    if (isSignalActive('PS_ON#')) return '⚡ PS_ON# // Activación Lógica de Fuente (0V Cable Verde)';
    if (isSignalActive('PWR_OK')) return '⚡ PWR_OK (Power Good) // Rieles Estabilizados (+5V Cable Gris)';
    if (isSignalActive('RESET#')) return '⚡ RESET# // Liberación de Reset CPU (Transición Low ➔ High)';
    if (isSignalActive('SPI_BUS')) return '⚡ SPI BUS // Fetch de Microcódigo & Vector FFFF_FFF0h';
    if (isSignalActive('RAM_BUS')) return '⚡ MEMORY BUS // SPD I2C & Calibración DQS/DQ (Memory Training)';
    if (isSignalActive('PCIE_GPU')) return '⚡ PCIe LINK // Handshake GOP & Inicialización de Framebuffer';
    if (isSignalActive('STORAGE_BUS')) return '⚡ NVMe / STORAGE BUS // Lectura de Partición EFI (ESP) & BCD';
    if (isSignalActive('BOOT_STREAM')) return '⚡ WINDOWS PIPELINE // Carga de Kernel, HAL, Drivers y Sesión 0';
    if (isSignalActive('RAILS_MAIN')) return '⚡ RIELES PRINCIPALES // Distribución de +12V, +5V, +3.3V y +5VSB';
    return '⚡ REPOSO LÓGICO // Esperando evento de inicio';
  };

  return (
    <div className="w-full bg-[#05070c] border-2 border-zinc-800 rounded-2xl p-3 sm:p-5 relative overflow-hidden font-mono-tech shadow-2xl select-none">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Banner: Stage Status & Real Time Signal */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-800/90 mb-4 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              !isPoweredOn
                ? 'bg-zinc-600'
                : isFailed
                ? 'bg-rose-500 animate-ping shadow-[0_0_12px_#f43f5e]'
                : currentStep.stepNumber === 34
                ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]'
                : 'bg-amber-400 animate-pulse shadow-[0_0_12px_#f59e0b]'
            }`}
          />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            GABINETE ABIERTO // CORTE LATERAL TÉCNICO
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-bold uppercase ml-1"
            style={{
              backgroundColor: `${currentStep.layerColor}20`,
              color: currentStep.layerColor,
              border: `1px solid ${currentStep.layerColor}50`,
            }}
          >
            {!isPoweredOn ? 'OFF' : isFailed ? 'DETENCIÓN' : currentStep.powerState}
          </span>
        </div>

        {/* Signal in transit live marker */}
        <div className="px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] flex items-center gap-2 shadow-inner">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span className="font-bold">{getStepSignalTitle()}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUADRO CENTRAL GRANDE: GABINETE ABIERTO CON TODAS LAS ZONAS REALES        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* LEFT / CENTER 9 COLS: EL GABINETE ABIERTO Y LA MOTHERBOARD TÉCNICA */}
        <div className="lg:col-span-8 xl:col-span-9 bg-[#090d16] border-2 border-zinc-700/80 rounded-2xl p-3 sm:p-4 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[520px]">
          
          {/* Chassis Top Bar with Exhaust Fans & Airflow indicator */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80 text-[10px]">
            <div className="flex items-center gap-2 font-bold text-zinc-300">
              <CircuitBoard className="w-4 h-4 text-cyan-400" />
              <span>BASTIDOR DE CHASIS // INTERIOR ABIERTO</span>
            </div>

            {/* Chassis Fans Activity Indicator */}
            <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-400">
              <div className="flex items-center gap-1">
                <Fan className={`w-3.5 h-3.5 ${isPoweredOn && currentStep.stepNumber >= 4 ? 'text-cyan-400 animate-spin' : 'text-zinc-600'}`} />
                <span>EXTRACTOR TRASERO</span>
              </div>
              <div className="flex items-center gap-1 hidden sm:flex">
                <Fan className={`w-3.5 h-3.5 ${isPoweredOn && currentStep.stepNumber >= 4 ? 'text-cyan-400 animate-spin' : 'text-zinc-600'}`} />
                <span>VENTILACIÓN SUPERIOR</span>
              </div>
            </div>
          </div>

          {/* MOTHERBOARD MOUNTED ON CHASSIS TRAY */}
          <div className="relative w-full bg-[#0b101c] border-2 border-cyan-900/40 rounded-xl p-3 sm:p-4 flex-1 flex flex-col justify-between gap-3 shadow-inner">
            
            {/* Metallic Mounting Standoff Screws (4 corners + center) */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_8px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_8px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_8px_rgba(245,158,11,0.6)] z-0" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full border border-amber-500/80 bg-amber-600/40 shadow-[0_0_8px_rgba(245,158,11,0.6)] z-0" />

            {/* LIVE SVG BUS & TRAVELING SIGNAL PARTICLES OVERLAY */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-90"
              viewBox="0 0 640 340"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <filter id="glow-amber-strong" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-cyan-strong" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-emerald-strong" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Track: Front Switch -> F_PANEL -> Power Logic [PWR_SW] */}
              <path
                d="M 580 300 L 460 300 L 460 260"
                fill="none"
                stroke={isSignalActive('PWR_SW') ? '#f59e0b' : '#1e293b'}
                strokeWidth={isSignalActive('PWR_SW') ? '4' : '1.5'}
                strokeDasharray={isSignalActive('PWR_SW') ? '8 4' : 'none'}
                filter={isSignalActive('PWR_SW') ? 'url(#glow-amber-strong)' : 'none'}
              />

              {/* 2. Track: Power Logic -> PSU Connector [PS_ON#] */}
              <path
                d="M 420 270 L 420 315 L 70 315"
                fill="none"
                stroke={isSignalActive('PS_ON#') ? '#10b981' : '#1e293b'}
                strokeWidth={isSignalActive('PS_ON#') ? '4' : '1.5'}
                strokeDasharray={isSignalActive('PS_ON#') ? '8 4' : 'none'}
                filter={isSignalActive('PS_ON#') ? 'url(#glow-emerald-strong)' : 'none'}
              />

              {/* 3. Track: PSU Main Harness -> VRM & ATX 24-Pin [RAILS_MAIN] */}
              <path
                d="M 70 300 L 70 75 L 120 75"
                fill="none"
                stroke={isSignalActive('RAILS_MAIN') ? '#f59e0b' : '#1e293b'}
                strokeWidth={isSignalActive('RAILS_MAIN') ? '4.5' : '1.5'}
                strokeDasharray={isSignalActive('RAILS_MAIN') ? '10 4' : 'none'}
                filter={isSignalActive('RAILS_MAIN') ? 'url(#glow-amber-strong)' : 'none'}
              />

              {/* 4. Track: PSU -> Reset Logic [PWR_OK] */}
              <path
                d="M 130 315 L 220 315 L 220 270"
                fill="none"
                stroke={isSignalActive('PWR_OK') ? '#38bdf8' : '#1e293b'}
                strokeWidth={isSignalActive('PWR_OK') ? '4' : '1.5'}
                strokeDasharray={isSignalActive('PWR_OK') ? '8 4' : 'none'}
                filter={isSignalActive('PWR_OK') ? 'url(#glow-cyan-strong)' : 'none'}
              />

              {/* 5. Track: Reset Logic -> CPU Socket [RESET#] */}
              <path
                d="M 220 260 L 220 125 L 290 125"
                fill="none"
                stroke={isSignalActive('RESET#') ? '#06b6d4' : '#1e293b'}
                strokeWidth={isSignalActive('RESET#') ? '4' : '1.5'}
                strokeDasharray={isSignalActive('RESET#') ? '8 4' : 'none'}
                filter={isSignalActive('RESET#') ? 'url(#glow-cyan-strong)' : 'none'}
              />

              {/* 6. Track: SPI BIOS -> CPU Socket [SPI BUS / Microcode Fetch] */}
              <path
                d="M 90 260 L 90 170 L 260 170 L 260 125"
                fill="none"
                stroke={isSignalActive('SPI_BUS') ? '#a855f7' : '#1e293b'}
                strokeWidth={isSignalActive('SPI_BUS') ? '3.5' : '1.5'}
                strokeDasharray={isSignalActive('SPI_BUS') ? '6 4' : 'none'}
                filter={isSignalActive('SPI_BUS') ? 'url(#glow-cyan-strong)' : 'none'}
              />

              {/* 7. Track: CPU Socket / IMC <-> RAM DIMM Slots [MEMORY BUS / DQS] */}
              <path
                d="M 400 75 L 500 75"
                fill="none"
                stroke={isSignalActive('RAM_BUS') ? '#3b82f6' : '#1e293b'}
                strokeWidth={isSignalActive('RAM_BUS') ? '4' : '1.5'}
                strokeDasharray={isSignalActive('RAM_BUS') ? '8 4' : 'none'}
                filter={isSignalActive('RAM_BUS') ? 'url(#glow-cyan-strong)' : 'none'}
              />

              {/* 8. Track: CPU Socket <-> PCIe x16 GPU Card [PCIe Video Bus] */}
              <path
                d="M 290 120 L 290 180 L 190 180"
                fill="none"
                stroke={isSignalActive('PCIE_GPU') ? '#6366f1' : '#1e293b'}
                strokeWidth={isSignalActive('PCIE_GPU') ? '4' : '1.5'}
                strokeDasharray={isSignalActive('PCIE_GPU') ? '8 4' : 'none'}
                filter={isSignalActive('PCIE_GPU') ? 'url(#glow-cyan-strong)' : 'none'}
              />

              {/* 9. Track: Chipset PCH <-> NVMe M.2 Slot [Storage Bus] */}
              <path
                d="M 370 260 L 370 200 L 490 200 L 490 180"
                fill="none"
                stroke={isSignalActive('STORAGE_BUS') ? '#10b981' : '#1e293b'}
                strokeWidth={isSignalActive('STORAGE_BUS') ? '3.5' : '1.5'}
                strokeDasharray={isSignalActive('STORAGE_BUS') ? '6 4' : 'none'}
                filter={isSignalActive('STORAGE_BUS') ? 'url(#glow-emerald-strong)' : 'none'}
              />

              {/* 10. Track: Storage -> RAM -> CPU -> Execution [BOOT STREAM] */}
              <path
                d="M 500 160 L 500 95 L 390 75"
                fill="none"
                stroke={isSignalActive('BOOT_STREAM') ? '#06b6d4' : '#1e293b'}
                strokeWidth={isSignalActive('BOOT_STREAM') ? '3.5' : '1.5'}
                strokeDasharray={isSignalActive('BOOT_STREAM') ? '8 4' : 'none'}
                filter={isSignalActive('BOOT_STREAM') ? 'url(#glow-cyan-strong)' : 'none'}
              />
            </svg>

            {/* Motherboard Header Information */}
            <div className="flex flex-wrap items-center justify-between text-[9.5px] text-zinc-400 pb-1.5 border-b border-zinc-800/80 gap-2 relative z-20">
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.motherboard)}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-white font-bold"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>MOTHERBOARD ATX // TOPOLOGÍA FÍSICA Y SILICIO</span>
                <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
              </button>
              <div className="flex items-center gap-1.5 text-[8.5px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">Z1: VRM</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">Z2: CPU</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">Z3: RAM</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">Z4: PCH</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">Z5: F_PANEL</span>
              </div>
            </div>

            {/* ROW 1: VRM + CPU SOCKET + RAM SLOTS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch relative z-20">
              
              {/* ZONA 1: VRM & POWER DELIVERY (3 Cols) */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.vrm)}
                className={`md:col-span-3 p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isComponentActive('motherboard') && currentStep.stepNumber >= 4
                    ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                    : isComponentEverReached(4)
                    ? 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/70 border-zinc-800 text-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px] font-bold text-white tracking-wide">VRM // FASES</span>
                    </div>
                    <span className="text-[8px] px-1 py-0.2 rounded bg-amber-950 border border-amber-700/60 text-amber-300 font-mono">
                      Z1
                    </span>
                  </div>
                  <div className="text-[8.5px] text-zinc-400 leading-tight">
                    {currentStep.stepNumber < 4 ? '0V Standby' : 'VCore Nominal Regulado'}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-zinc-800/80">
                  <div className="flex gap-1">
                    <span className={`w-2.5 h-2.5 rounded-sm border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300 shadow-[0_0_6px_#f59e0b]' : 'bg-zinc-700 border-zinc-600'}`} />
                    <span className={`w-2.5 h-2.5 rounded-sm border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300 shadow-[0_0_6px_#f59e0b]' : 'bg-zinc-700 border-zinc-600'}`} />
                    <span className={`w-2.5 h-2.5 rounded-sm border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300 shadow-[0_0_6px_#f59e0b]' : 'bg-zinc-700 border-zinc-600'}`} />
                  </div>
                  <span className="text-[8px] text-zinc-400 font-mono">PWM CHOKES</span>
                </div>
              </button>

              {/* ZONA 2: SOCKET CPU & IMC (6 Cols) */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.cpu)}
                className={`md:col-span-6 p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isComponentActive('cpu')
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/50'
                    : isComponentEverReached(6)
                    ? 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/70 border-zinc-800 text-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Cpu className={`w-5 h-5 ${isComponentActive('cpu') ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                      <div>
                        <span className="text-xs font-bold text-white tracking-wide block">SOCKET CPU & IMC</span>
                        <span className="text-[8px] text-zinc-400">CONTROLADOR DE MEMORIA & BUS PCIe</span>
                      </div>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-mono">
                      Z2
                    </span>
                  </div>

                  <p className="text-[9px] text-zinc-300 leading-tight mt-1 bg-zinc-950/60 p-1.5 rounded border border-zinc-800/60">
                    {currentStep.stepNumber < 6
                      ? 'Reset Activo (0V) • Esperando señal PWR_OK'
                      : currentStep.stepNumber < 13
                      ? 'Vector FFFF_FFF0h • Ejecutando Microcódigo & IMC'
                      : 'Pipeline x86-64 Operativo • Modo Protegido / Ring 0'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/80 text-[8.5px]">
                  <span className="text-zinc-400 font-mono">LGA / AM RETENTION BRACKET</span>
                  <span className={`font-bold ${isComponentActive('cpu') ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`}>
                    {isComponentActive('cpu') ? '● PROCESANDO' : 'STANDBY'}
                  </span>
                </div>
              </button>

              {/* ZONA 3: SLOTS RAM DIMM (3 Cols) */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.ram)}
                className={`md:col-span-3 p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isComponentActive('ram')
                    ? 'bg-blue-500/15 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-1 ring-blue-400/50'
                    : isComponentEverReached(10)
                    ? 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/70 border-zinc-800 text-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span className="text-[11px] font-bold text-white tracking-wide">SLOTS RAM</span>
                    </div>
                    <span className="text-[8px] px-1 py-0.2 rounded bg-blue-950 border border-blue-700/60 text-blue-300 font-mono">
                      Z3
                    </span>
                  </div>
                  <div className="text-[8.5px] text-zinc-400 leading-tight">
                    {currentStep.stepNumber < 10
                      ? 'Sin Inicializar'
                      : currentStep.stepNumber < 13
                      ? 'SPD / Memory Training'
                      : 'DRAM Calibrada'}
                  </div>
                </div>

                {/* 4 Physical DIMM Slots */}
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-800/80">
                  <div className="flex gap-1 justify-center">
                    <span className={`h-4 w-1.5 rounded-xs ${isComponentActive('ram') ? 'bg-blue-400 animate-pulse shadow-[0_0_6px_#3b82f6]' : 'bg-zinc-700'}`} />
                    <span className={`h-4 w-1.5 rounded-xs ${isComponentActive('ram') ? 'bg-blue-400 animate-pulse shadow-[0_0_6px_#3b82f6]' : 'bg-zinc-700'}`} />
                    <span className="h-4 w-1.5 rounded-xs bg-zinc-800" />
                    <span className="h-4 w-1.5 rounded-xs bg-zinc-800" />
                  </div>
                  <span className="text-[8px] text-zinc-400 font-mono">CANAL A/B</span>
                </div>
              </button>
            </div>

            {/* ROW 2: DEDICATED PCIe GPU + M.2 NVMe SSD */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch relative z-20">
              
              {/* Dedicated PCIe x16 GPU Card (7 Cols) */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.gpu)}
                className={`md:col-span-7 p-3 rounded-xl border text-left transition-all ${
                  isComponentActive('gpu')
                    ? 'bg-indigo-500/15 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.35)] ring-1 ring-indigo-400/50'
                    : isComponentEverReached(14)
                    ? 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/70 border-zinc-800 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">TARJETA GRÁFICA DEDICADA // PCIe x16</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fan className={`w-3 h-3 ${isComponentActive('gpu') ? 'text-indigo-400 animate-spin' : 'text-zinc-600'}`} />
                    <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
                  </div>
                </div>
                <div className="text-[8.5px] text-zinc-400 leading-tight">
                  {currentStep.stepNumber < 14
                    ? 'Bus PCIe en reposo'
                    : currentStep.stepNumber < 16
                    ? 'GOP / VBIOS Handshake • Framebuffer Inicial'
                    : 'Enlace PCIe x16 Activo • Salida de Video'}
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-2 overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full ${
                      isComponentActive('gpu')
                        ? 'bg-indigo-400 animate-pulse w-full'
                        : isComponentEverReached(14)
                        ? 'bg-indigo-600 w-full'
                        : 'w-0'
                    }`}
                  />
                </div>
              </button>

              {/* M.2 NVMe Storage (5 Cols) */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.storage)}
                className={`md:col-span-5 p-3 rounded-xl border text-left transition-all ${
                  isComponentActive('storage')
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                    : isComponentEverReached(17)
                    ? 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/70 border-zinc-800 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">NVMe M.2 (SSD)</span>
                  </div>
                  <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
                </div>
                <div className="text-[8.5px] text-zinc-400 leading-tight">
                  {currentStep.stepNumber < 17
                    ? 'Sin Interrogar'
                    : currentStep.stepNumber < 22
                    ? 'ESP / BCD Detectado en Tabla GPT'
                    : 'Lectura de Kernel NTFS (ntoskrnl.exe)'}
                </div>
              </button>
            </div>

            {/* ROW 3: SPI FLASH BIOS + ZONA 4: PCH/CHIPSET + ZONA 5: HEADER PANEL FRONTAL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-stretch pt-2 border-t border-zinc-800/80 text-[9px] relative z-20">
              
              {/* SPI BIOS Chip */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.bios)}
                className={`p-2.5 rounded-xl border transition-all text-left flex items-center justify-between ${
                  isComponentActive('firmware')
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                    : isComponentEverReached(7)
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-bold text-white text-[9.5px]">SPI FLASH (UEFI)</div>
                    <div className="text-[8px] text-zinc-400">Microcódigo & NVRAM</div>
                  </div>
                </div>
                <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
              </button>

              {/* ZONA 4: PCH / CHIPSET */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.pch)}
                className={`p-2.5 rounded-xl border transition-all text-left flex items-center justify-between ${
                  isComponentActive('motherboard') && currentStep.stepNumber >= 2
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40'
                    : isComponentEverReached(2)
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-[9.5px]">PCH / CHIPSET</span>
                      <span className="text-[7.5px] px-1 py-0.2 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono">Z4</span>
                    </div>
                    <div className="text-[8px] text-zinc-400">Enlace DMI & Periféricos</div>
                  </div>
                </div>
                <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
              </button>

              {/* ZONA 5: HEADER PANEL FRONTAL (F_PANEL & PWR_SW) */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.fpanel)}
                className={`p-2.5 rounded-xl border transition-all text-left flex items-center justify-between ${
                  isComponentActive('psu') || currentStep.stepNumber === 1 || currentStep.stepNumber === 2
                    ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40'
                    : currentStep.stepNumber >= 1
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-[9.5px]">F_PANEL HEADER</span>
                      <span className="text-[7.5px] px-1 py-0.2 rounded bg-amber-950 border border-amber-700/60 text-amber-300 font-mono">Z5</span>
                    </div>
                    <div className="text-[8px] text-zinc-400">PWR_SW / RESET / LEDs</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isComponentActive('psu') || currentStep.stepNumber >= 1
                        ? 'bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]'
                        : 'bg-zinc-700'
                    }`}
                  />
                  <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
                </div>
              </button>
            </div>
          </div>

          {/* PSU BASEMENT COMPARTMENT (OUTSIDE MOTHERBOARD IN LOWER CHASSIS SHROUD) */}
          <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch gap-2.5">
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.psu)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all flex-1 ${
                isComponentActive('psu')
                  ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : isComponentEverReached(1)
                  ? 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300'
                  : 'bg-zinc-950/60 border-zinc-900 text-zinc-600 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Power className={`w-5 h-5 ${isComponentActive('psu') ? 'text-amber-400 animate-pulse' : 'text-zinc-600'}`} />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">FUENTE DE PODER ATX (PSU)</span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">COMPARTIMIENTO INFERIOR</span>
                    <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
                  </div>
                  <span className="text-[9px] text-zinc-400">
                    {currentStep.stepNumber === 0
                      ? '0V OFF (Reposo absoluto)'
                      : currentStep.stepNumber < 4
                      ? '+5VSB Activo (Super I/O Standby) • Pin 9 Violeta'
                      : '+12V / +5V / +3.3V Estabilizados // PWR_OK Generado (Pin 8 Gris)'}
                  </span>
                </div>
              </div>

              {/* Fan in PSU */}
              <div className="hidden sm:flex items-center gap-1.5 text-[8.5px] text-zinc-400 font-mono">
                <Fan className={`w-3.5 h-3.5 ${currentStep.stepNumber >= 4 ? 'text-amber-400 animate-spin' : 'text-zinc-600'}`} />
                <span>COOLER PSU</span>
              </div>
            </button>

            {/* Front Panel Power Button Mechanism on Chassis */}
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.fpanel)}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                isSignalActive('PWR_SW')
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSignalActive('PWR_SW') ? 'bg-amber-400 border-amber-300 animate-ping' : 'bg-zinc-800 border-zinc-600'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div>
                <div className="text-[9.5px] font-bold text-white">BOTÓN POWER FRONTAL</div>
                <div className="text-[8px] text-zinc-500 font-mono">PULSADOR MECÁNICO (NO)</div>
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT 3-4 COLS: OVERLAYS DE SOFTWARE & MONITOR SIMULADO INTEGRADO */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between gap-3">
          
          {/* Software Layers Stack (Overlays contextuales, no hardware falso) */}
          <div className="bg-[#090d16] border border-zinc-800 rounded-xl p-3.5 space-y-2">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-zinc-800/80">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>CAPAS DE SOFTWARE & SISTEMA</span>
            </div>

            {/* Boot Manager */}
            <div
              className={`p-2 rounded-lg border text-[9px] transition-all ${
                isComponentActive('bootManager')
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : isComponentEverReached(22)
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                  : 'bg-zinc-950/30 border-zinc-900 text-zinc-700'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. BOOTLOADER (bootmgfw / BCD)</span>
                {isComponentActive('bootManager') && <span className="text-cyan-400 animate-pulse">● ACTIVO</span>}
              </div>
              <span className="text-[8px] text-zinc-500">Carga winload.efi y transfiere control</span>
            </div>

            {/* Kernel NT */}
            <div
              className={`p-2 rounded-lg border text-[9px] transition-all ${
                isComponentActive('kernel')
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                  : isComponentEverReached(24)
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                  : 'bg-zinc-950/30 border-zinc-900 text-zinc-700'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. KERNEL (ntoskrnl.exe & HAL)</span>
                {isComponentActive('kernel') && <span className="text-indigo-400 animate-pulse">● ACTIVO</span>}
              </div>
              <span className="text-[8px] text-zinc-500">Inicializa estructuras y tablas de memoria</span>
            </div>

            {/* Drivers BOOT_START & Services */}
            <div
              className={`p-2 rounded-lg border text-[9px] transition-all ${
                isComponentActive('drivers') || isComponentActive('services')
                  ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : isComponentEverReached(26)
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                  : 'bg-zinc-950/30 border-zinc-900 text-zinc-700'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. DRIVERS & SERVICIOS (SCM)</span>
                {(isComponentActive('drivers') || isComponentActive('services')) && (
                  <span className="text-purple-400 animate-pulse">● ACTIVO</span>
                )}
              </div>
              <span className="text-[8px] text-zinc-500">Controladores de disco, red y servicios Sesión 0</span>
            </div>

            {/* Session & Desktop */}
            <div
              className={`p-2 rounded-lg border text-[9px] transition-all ${
                isComponentActive('userSession') || isComponentActive('desktop')
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : isComponentEverReached(31)
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                  : 'bg-zinc-950/30 border-zinc-900 text-zinc-700'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. SESIÓN DE USUARIO & DESKTOP</span>
                {(isComponentActive('userSession') || isComponentActive('desktop')) && (
                  <span className="text-emerald-400 animate-pulse">● ACTIVO</span>
                )}
              </div>
              <span className="text-[8px] text-zinc-500">winlogon, DWM acelerado y explorer.exe</span>
            </div>
          </div>

          {/* SIMULATED MONITOR DISPLAY SCREEN */}
          <div className="bg-[#090d16] border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5 text-[9px]">
              <span className="font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span>MONITOR LATERAL</span>
              </span>
              <span className="text-[8px] text-zinc-500">
                {currentStep.stepNumber < 15
                  ? 'SIN SEÑAL'
                  : currentStep.stepNumber < 29
                  ? 'GOP FRAMEBUFFER'
                  : 'DIRECTX DWM'}
              </span>
            </div>

            {/* Screen Inner Glass */}
            <div className="w-full bg-black rounded-lg border border-zinc-800/90 p-3 min-h-[110px] flex flex-col items-center justify-center relative overflow-hidden shadow-inner text-center">
              {!isPoweredOn || currentStep.stepNumber < 15 ? (
                <div className="space-y-1">
                  <div className="text-zinc-600 font-bold text-[10px] tracking-widest uppercase">
                    [ SIN SEÑAL / STANDBY ]
                  </div>
                  <p className="text-[8.5px] text-zinc-700 font-sans-editorial">
                    El transmisor de video de la GPU no ha sido inicializado.
                  </p>
                </div>
              ) : currentStep.stepNumber < 22 ? (
                <div className="space-y-1.5 animate-in fade-in duration-300">
                  <div className="text-cyan-400 font-display font-black text-sm tracking-widest uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                    ⚡ EVO ARCHITECTURE
                  </div>
                  <div className="text-[8.5px] text-zinc-400 font-mono-tech">
                    POST PASSED • UEFI SETUP READY
                  </div>
                </div>
              ) : currentStep.stepNumber < 31 ? (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="w-6 h-6 mx-auto border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
                  <div className="text-[9px] text-zinc-300 font-mono-tech tracking-wider uppercase">
                    INICIANDO WINDOWS NT...
                  </div>
                </div>
              ) : currentStep.stepNumber < 33 ? (
                <div className="space-y-1 animate-in fade-in duration-300">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-300 text-[10px] font-bold">
                    EVO
                  </div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-wider">
                    BIENVENIDO
                  </div>
                  <div className="text-[8px] text-zinc-400">Cargando perfil NTUSER.DAT</div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#0e121a] rounded border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-in fade-in duration-500">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-black text-[9px]">
                      ⊞
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white">ESCRITORIO LISTO</div>
                      <div className="text-[7.5px] text-emerald-400 font-mono-tech">
                        ● DWM.EXE & EXPLORER ACTIVOS
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENT EDUCATIONAL POPUP MODAL */}
      {inspectedComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b0e14] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-5 text-left relative shadow-2xl space-y-4">
            {/* Header */}
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

            {/* Content Sections */}
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

            {/* Footer Close */}
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
