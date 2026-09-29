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
  Terminal,
  Server,
  Power,
  Sliders,
  CheckCircle2,
  Lock,
  Flame,
  X,
  Info,
  HelpCircle,
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
    queHace: 'Convierte los +12V de la fuente de poder en voltajes precisos y limpios de bajo rizado (VCore ~1.1V-1.35V, VDDQ, VSoC).',
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
    title: 'GPU // TARJETA GRÁFICA & GOP',
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
    title: 'MOTHERBOARD // PCB, SUPER I/O & CHIPSET',
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

  return (
    <div className="w-full bg-[#07090e] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden font-mono-tech shadow-2xl select-none">
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Top Header Status Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              !isPoweredOn
                ? 'bg-zinc-600'
                : isFailed
                ? 'bg-rose-500 animate-ping shadow-[0_0_10px_#f43f5e]'
                : currentStep.stepNumber === 34
                ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]'
                : 'bg-amber-400 animate-pulse shadow-[0_0_10px_#f59e0b]'
            }`}
          />
          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
            ESQUEMA FÍSICO EVO //{' '}
            <span
              style={{
                color: !isPoweredOn ? '#71717a' : isFailed ? '#f43f5e' : currentStep.layerColor,
              }}
            >
              {!isPoweredOn ? 'OFF (APAGADO)' : isFailed ? 'DETENCIÓN EN ESTADO' : currentStep.powerState}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            CAPA:{' '}
            <strong style={{ color: currentStep.layerColor }}>
              {currentStep.layer}
            </strong>
          </span>
          <span className="text-[10px] text-zinc-500 hidden sm:inline">
            GABINETE & MOTHERBOARD INTERACTIVA
          </span>
        </div>
      </div>

      {/* Main Schematic: Cabinet + Motherboard + Side Monitor */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 relative z-10">
        {/* ========================================================================= */}
        {/* LEFT / CENTER: GABINETE ABIERTO CON MOTHERBOARD REAL (COL 1-8)            */}
        {/* ========================================================================= */}
        <div className="xl:col-span-8 bg-[#0b0e14] border border-zinc-800 rounded-xl p-3 sm:p-4 relative overflow-hidden shadow-inner flex flex-col justify-between min-h-[470px]">
          
          {/* Cabinet Top Header with Live Signal Traveling */}
          <div className="flex flex-wrap items-center justify-between pb-2 mb-2.5 border-b border-zinc-800/60 text-[10px] gap-2">
            <span className="flex items-center gap-1.5 font-bold text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400/80 animate-pulse" />
              CHASIS EVO // CORTE LATERAL ABIERTO
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-300 font-mono-tech flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
              <span>SEÑAL EN TRÁNSITO: <strong>{currentStep.activeConnections?.[0] || 'REPOSO / LÓGICA PASIVA'}</strong></span>
            </span>
          </div>

          {/* MOTHERBOARD AREA (PCB) - FLEXBOX SCHEMATIC ARCHITECTURE */}
          <div className="w-full bg-[#0d121c] border-2 border-zinc-700/80 rounded-xl p-3 sm:p-3.5 relative overflow-hidden shadow-2xl flex-1 flex flex-col justify-between gap-2.5">
            {/* PCB Texture & Mounting Standoffs */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-amber-500/50 bg-zinc-800 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-amber-500/50 bg-zinc-800 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-amber-500/50 bg-zinc-800 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-amber-500/50 bg-zinc-800 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />

            {/* Motherboard Header Info & Architecture Legend */}
            <div className="flex flex-wrap items-center justify-between text-[9px] text-zinc-500 pb-1.5 border-b border-zinc-800/70 gap-2">
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.motherboard)}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-zinc-300 font-bold"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span className="tracking-wide">MOTHERBOARD EVO ATX // ESQUEMA DE SILICIO Y ZONAS</span>
                <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
              </button>
              <div className="flex items-center gap-1.5 text-[8px] font-mono-tech">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">Z1: VRM</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">Z2: CPU</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">Z3: RAM</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">Z4: PCH</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">Z5: F_PANEL</span>
              </div>
            </div>

            {/* FLEXBOX ROW 1: VRM + CPU SOCKET + RAM SLOTS */}
            <div className="flex flex-col md:flex-row gap-2.5 items-stretch">
              {/* ZONA 1: VRM & ALIMENTACIÓN */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.vrm)}
                className={`flex-1 md:basis-1/4 p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isComponentActive('motherboard') && currentStep.stepNumber >= 4
                    ? 'bg-amber-500/15 border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                    : isComponentEverReached(4)
                    ? 'bg-zinc-900/70 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-bold text-white tracking-wide">ZONA VRM</span>
                    </div>
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-amber-950/80 border border-amber-700/50 text-amber-300 font-mono">
                      Z1
                    </span>
                  </div>
                  <div className="text-[8px] text-zinc-400 leading-tight">
                    {currentStep.stepNumber < 4 ? '0V Standby' : 'VCore ~1.2V Regulado'}
                  </div>
                </div>
                {/* Visual Inductor coils & Mosfets */}
                <div className="flex items-center gap-1 mt-2 pt-1 border-t border-zinc-800/60">
                  <div className="flex gap-0.5 opacity-80">
                    <span className={`w-2 h-2 rounded-sm border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300' : 'bg-zinc-700 border-zinc-600'}`} />
                    <span className={`w-2 h-2 rounded-sm border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300' : 'bg-zinc-700 border-zinc-600'}`} />
                    <span className={`w-2 h-2 rounded-sm border ${isComponentActive('motherboard') && currentStep.stepNumber >= 4 ? 'bg-amber-400 border-amber-300' : 'bg-zinc-700 border-zinc-600'}`} />
                  </div>
                  <span className="text-[7.5px] text-zinc-500 font-mono">PWM 8+2</span>
                </div>
              </button>

              {/* ZONA 2: CPU SOCKET & IMC */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.cpu)}
                className={`flex-1 md:basis-2/4 p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                  isComponentActive('cpu')
                    ? 'bg-emerald-500/15 border-emerald-400/90 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/50'
                    : isComponentEverReached(6)
                    ? 'bg-zinc-900/70 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Cpu className={`w-4 h-4 ${isComponentActive('cpu') ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                      <span className="text-[11px] font-bold text-white tracking-wide">SOCKET CPU & IMC</span>
                    </div>
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-mono">
                      Z2
                    </span>
                  </div>
                  <p className="text-[8.5px] text-zinc-400 leading-tight">
                    {currentStep.stepNumber < 6
                      ? 'Reset Activo (0V) • Esperando PWR_OK'
                      : currentStep.stepNumber < 13
                      ? 'Vector FFFF_FFF0h • Microcódigo & IMC'
                      : 'Pipeline x86-64 Operativo • Ring 0'}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60 text-[8px]">
                  <span className="text-zinc-500 font-mono">LGA / AM SOCKET</span>
                  <span className={`font-bold ${isComponentActive('cpu') ? 'text-emerald-400 animate-pulse' : 'text-zinc-600'}`}>
                    {isComponentActive('cpu') ? '● PROCESANDO' : 'PASIVO'}
                  </span>
                </div>
              </button>

              {/* ZONA 3: SLOTS RAM DIMM */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.ram)}
                className={`flex-1 md:basis-1/4 p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isComponentActive('ram')
                    ? 'bg-blue-500/15 border-blue-400/90 shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-1 ring-blue-400/50'
                    : isComponentEverReached(10)
                    ? 'bg-zinc-900/70 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-bold text-white tracking-wide">SLOTS RAM</span>
                    </div>
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-blue-950/80 border border-blue-700/50 text-blue-300 font-mono">
                      Z3
                    </span>
                  </div>
                  <div className="text-[8px] text-zinc-400 leading-tight">
                    {currentStep.stepNumber < 10
                      ? 'Sin Inicializar'
                      : currentStep.stepNumber < 13
                      ? 'SPD / Memory Training'
                      : 'DRAM Calibrada'}
                  </div>
                </div>
                {/* 4 DIMM Slots visualization (Canal A / Canal B) */}
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60">
                  <div className="flex gap-1 justify-center">
                    <span className={`h-3 w-1 rounded-xs ${isComponentActive('ram') ? 'bg-blue-400 animate-pulse' : 'bg-zinc-700'}`} />
                    <span className={`h-3 w-1 rounded-xs ${isComponentActive('ram') ? 'bg-blue-400 animate-pulse' : 'bg-zinc-700'}`} />
                    <span className="h-3 w-1 rounded-xs bg-zinc-800" />
                    <span className="h-3 w-1 rounded-xs bg-zinc-800" />
                  </div>
                  <span className="text-[7.5px] text-zinc-500 font-mono">CANAL A/B</span>
                </div>
              </button>
            </div>

            {/* FLEXBOX ROW 2: PCIe/GPU + NVMe M.2 */}
            <div className="flex flex-col md:flex-row gap-2.5 items-stretch">
              {/* Dedicated PCIe GPU slot and card */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.gpu)}
                className={`flex-1 md:basis-7/12 p-2.5 rounded-lg border text-left transition-all ${
                  isComponentActive('gpu')
                    ? 'bg-indigo-500/15 border-indigo-400/90 shadow-[0_0_20px_rgba(99,102,241,0.35)] ring-1 ring-indigo-400/50'
                    : isComponentEverReached(14)
                    ? 'bg-zinc-900/70 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-bold text-white">SLOT PCIe x16 // GPU</span>
                  </div>
                  <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
                </div>
                <div className="text-[8px] text-zinc-400 leading-tight">
                  {currentStep.stepNumber < 14
                    ? 'Bus PCIe en reposo'
                    : currentStep.stepNumber < 16
                    ? 'GOP / VBIOS Handshake'
                    : 'Enlace PCIe Activo (Salida de Video)'}
                </div>
                <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
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

              {/* M.2 NVMe Storage */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.storage)}
                className={`flex-1 md:basis-5/12 p-2.5 rounded-lg border text-left transition-all ${
                  isComponentActive('storage')
                    ? 'bg-emerald-500/15 border-emerald-400/90 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                    : isComponentEverReached(17)
                    ? 'bg-zinc-900/70 border-zinc-700/80 text-zinc-300'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold text-white">NVMe M.2 (SSD)</span>
                  </div>
                  <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
                </div>
                <div className="text-[8px] text-zinc-400 leading-tight">
                  {currentStep.stepNumber < 17
                    ? 'Sin Interrogar'
                    : currentStep.stepNumber < 22
                    ? 'ESP / BCD Detectado'
                    : 'Lectura de Kernel NTFS'}
                </div>
              </button>
            </div>

            {/* FLEXBOX ROW 3: SPI FLASH BIOS + ZONA 4: PCH/CHIPSET + ZONA 5: HEADER PANEL FRONTAL */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch pt-2 border-t border-zinc-800/70 text-[8.5px]">
              {/* SPI BIOS Chip */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.bios)}
                className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center justify-between ${
                  isComponentActive('firmware')
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : isComponentEverReached(7)
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-purple-400" />
                  <div>
                    <div className="font-bold text-white text-[9px]">SPI FLASH (UEFI)</div>
                    <div className="text-[7.5px] text-zinc-400">Microcódigo & NVRAM</div>
                  </div>
                </div>
                <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
              </button>

              {/* ZONA 4: PCH / CHIPSET */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.pch)}
                className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center justify-between ${
                  isComponentActive('motherboard') && currentStep.stepNumber >= 2
                    ? 'bg-cyan-500/15 border-cyan-400/90 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
                    : isComponentEverReached(2)
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-[9px]">PCH / CHIPSET</span>
                      <span className="text-[7px] px-1 py-0.2 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 font-mono">Z4</span>
                    </div>
                    <div className="text-[7.5px] text-zinc-400">Enlace DMI & Periféricos</div>
                  </div>
                </div>
                <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
              </button>

              {/* ZONA 5: HEADER PANEL FRONTAL (F_PANEL & PWR_SW) */}
              <button
                type="button"
                onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.fpanel)}
                className={`flex-1 p-2 rounded-lg border transition-all text-left flex items-center justify-between ${
                  isComponentActive('psu') || currentStep.stepNumber === 1 || currentStep.stepNumber === 2
                    ? 'bg-amber-500/15 border-amber-400/90 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                    : currentStep.stepNumber >= 1
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Power className="w-3 h-3 text-amber-400" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-[9px]">F_PANEL HEADER</span>
                      <span className="text-[7px] px-1 py-0.2 rounded bg-amber-950 border border-amber-700/50 text-amber-300 font-mono">Z5</span>
                    </div>
                    <div className="text-[7.5px] text-zinc-400">PWR_SW / RESET / LEDs</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isComponentActive('psu') || currentStep.stepNumber >= 1
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-zinc-700'
                    }`}
                  />
                  <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
                </div>
              </button>
            </div>
          </div>

          {/* PSU COMPARTMENT (AT BOTTOM OF CABINET, OUTSIDE MOTHERBOARD) */}
          <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setInspectedComponent(COMPONENT_EDU_INFO.psu)}
              className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all flex-1 ${
                isComponentActive('psu')
                  ? 'bg-amber-500/10 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : isComponentEverReached(1)
                  ? 'bg-zinc-900/60 border-zinc-700/60 text-zinc-300'
                  : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
              }`}
            >
              <Power className={`w-4 h-4 ${isComponentActive('psu') ? 'text-amber-400 animate-pulse' : 'text-zinc-600'}`} />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-bold text-white">FUENTE DE PODER ATX (PSU)</span>
                  <HelpCircle className="w-2.5 h-2.5 text-zinc-500" />
                </div>
                <span className="text-[8.5px] text-zinc-400">
                  {currentStep.stepNumber === 0
                    ? '0V OFF (Reposo)'
                    : currentStep.stepNumber < 4
                    ? '+5VSB Activo (Super I/O Standby)'
                    : '+12V / +5V / +3.3V Estabilizados // PWR_OK Generado'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: OVERLAYS DE SOFTWARE & MONITOR SIMULADO (COL 9-12)                */}
        {/* ========================================================================= */}
        <div className="xl:col-span-4 flex flex-col justify-between gap-3">
          
          {/* Software Layers Stack (Overlays contextuales, no hardware falso) */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-3.5 space-y-2">
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
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5 text-[9px]">
              <span className="font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span>MONITOR LATERAL</span>
              </span>
              <span className="text-[8px] text-zinc-500">
                {currentStep.stepNumber < 15
                  ? 'SIN SEÑAL'
                  : currentStep.stepNumber < 29
                  ? 'RESOLUCIÓN GESTIONADA POR FIRMWARE (GOP)'
                  : 'RESOLUCIÓN NATIVA (DIRECTX DWM)'}
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
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-0.5">¿CUÁNDO INTERVIENE EN EL ARRANQUE?</span>
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
