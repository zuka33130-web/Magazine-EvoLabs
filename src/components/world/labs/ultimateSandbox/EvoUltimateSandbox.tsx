import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { UserHardwarePassport } from '../../../../types';
import {
  Cpu,
  Monitor,
  Zap,
  Gauge,
  Sliders,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Info,
  Layers,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Gamepad2,
  HardDrive,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  X,
  ChevronRight,
  ShieldAlert,
  Server,
  Terminal,
  Clock,
  Wrench,
  DollarSign,
  Lightbulb,
  Bot,
  Database,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Wifi,
  WifiOff,
  MousePointer,
  Network,
  Radio,
  Signal,
  Settings2,
  ShieldCheck,
  Disc,
  Laptop,
  Lock,
  Crown
} from 'lucide-react';
import { EvoThermalHistoryModal } from './EvoThermalHistoryModal';
import { EvoSingleTruthSurface } from './EvoSingleTruthSurface';

// ============================================================================
// HARDWARE DEFINITIONS & TIERS
// ============================================================================
export interface CpuOption {
  id: string;
  name: string;
  tier: 'baja' | 'media' | 'alta' | 'extrema';
  tierLabel: string;
  cores: string;
  clockGhz: number;
  powerWatts: number;
  gamingPowerScore: number;
  multiTaskScore: number;
  priceUsd: number;
  priceEstimate: string;
  desc: string;
}

export interface GpuOption {
  id: string;
  name: string;
  tier: 'igpu' | 'esports' | 'media' | 'alta' | '4k';
  tierLabel: string;
  vramGb: number;
  powerWatts: number;
  gamingPowerScore: number;
  priceUsd: number;
  priceEstimate: string;
  desc: string;
  isIgpu?: boolean;
}

export interface RamOption {
  id: string;
  sizeGb: number;
  channels: 'single' | 'dual';
  speedMhz: number;
  priceUsd: number;
  label: string;
  desc: string;
}

export interface StorageOption {
  id: string;
  name: string;
  type: 'hdd' | 'sata' | 'nvme3' | 'nvme4' | 'nvme5';
  speedMbS: number;
  priceUsd: number;
  label: string;
  desc: string;
}

export interface PsuOption {
  id: string;
  watts: number;
  rating: string;
  priceUsd: number;
  label: string;
  desc: string;
}

export interface BackgroundProcess {
  id: string;
  name: string;
  category: 'browser' | 'streaming' | 'render' | 'antivirus' | 'telemetry';
  cpuImpactPercent: number;
  ramImpactGb: number;
  vramImpactGb: number;
  ioDemandPercent: number;
  desc: string;
}

export const CPU_OPTIONS: CpuOption[] = [
  {
    id: 'cpu-n100',
    name: 'Intel Processor N100 (4 E-Cores / Eficiencia)',
    tier: 'baja',
    tierLabel: 'GAMA ULTRA-BAJA / EFICIENCIA (4 NÚCLEOS E)',
    cores: '4C / 4T',
    clockGhz: 3.4,
    powerWatts: 6,
    gamingPowerScore: 18,
    multiTaskScore: 22,
    priceUsd: 45,
    priceEstimate: '$45 USD',
    desc: 'Arquitectura Gracemont de ultra-bajo consumo (6W TDP, TjMax 105°C). Diseñado para ofimática, mini PCs pasivas y emulación retro.',
  },
  {
    id: 'cpu-i3-1220p',
    name: 'Intel Core i3-1220P (Mini PC / Laptop)',
    tier: 'baja',
    tierLabel: 'GAMA ENTRADA / MINI PC (10 NÚCLEOS 2P+8E)',
    cores: '10C / 12T',
    clockGhz: 4.4,
    powerWatts: 28,
    gamingPowerScore: 42,
    multiTaskScore: 50,
    priceUsd: 90,
    priceEstimate: '$90 USD',
    desc: 'Procesador móvil híbrido de 10 núcleos (2P + 8E, 28W TDP, TjMax 100°C) con gráficos Intel UHD integrados. Excelente para tareas cotidianas y eSports ligeros.',
  },
  {
    id: 'cpu-i3-12100f',
    name: 'Intel Core i3-12100F (4 Núcleos P // Rendimiento Quad)',
    tier: 'baja',
    tierLabel: 'GAMA ENTRADA DESKTOP (4 NÚCLEOS P)',
    cores: '4C / 8T',
    clockGhz: 4.3,
    powerWatts: 58,
    gamingPowerScore: 58,
    multiTaskScore: 48,
    priceUsd: 85,
    priceEstimate: '$85 USD',
    desc: '4 núcleos de rendimiento con excelente IPC por dólar (58W TDP). Rinde sorprendentemente bien en eSports competitivos 1080p.',
  },
  {
    id: 'cpu-i5-12400f',
    name: 'Intel Core i5-12400F (6 Núcleos P // Calidad / Precio)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA POPULAR (6 NÚCLEOS P)',
    cores: '6C / 12T',
    clockGhz: 4.4,
    powerWatts: 65,
    gamingPowerScore: 68,
    multiTaskScore: 65,
    priceUsd: 135,
    priceEstimate: '$135 USD',
    desc: '6 núcleos P puros sin E-cores (65W TDP). Uno de los chips más recomendados para ensambles de gama media.',
  },
  {
    id: 'cpu-ryzen-5600g',
    name: 'AMD Ryzen 5 5600G (APU Vega 7)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA / APU (6 NÚCLEOS ZEN 3)',
    cores: '6C / 12T',
    clockGhz: 4.4,
    powerWatts: 65,
    gamingPowerScore: 64,
    multiTaskScore: 66,
    priceUsd: 125,
    priceEstimate: '$125 USD',
    desc: 'APU balanceada de 6 núcleos Zen 3 (65W TDP, TjMax 95°C) con gráfica integrada Radeon Vega 7. Capaz de mover eSports sin gráfica dedicada.',
  },
  {
    id: 'cpu-ryzen-7600x',
    name: 'AMD Ryzen 5 7600X (6 Núcleos Zen 4 // AM5)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA AM5 (6 NÚCLEOS ZEN 4)',
    cores: '6C / 12T',
    clockGhz: 5.3,
    powerWatts: 105,
    gamingPowerScore: 82,
    multiTaskScore: 78,
    priceUsd: 195,
    priceEstimate: '$195 USD',
    desc: 'Arquitectura Zen 4 de alta frecuencia en socket AM5 con PCIe Gen 5 y DDR5 nativo.',
  },
  {
    id: 'cpu-i5-13400',
    name: 'Intel Core i5-13400 (Híbrido 10 Núcleos)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA EQUILIBRADA (10 NÚCLEOS 6P+4E)',
    cores: '10C / 16T',
    clockGhz: 4.6,
    powerWatts: 65,
    gamingPowerScore: 75,
    multiTaskScore: 76,
    priceUsd: 210,
    priceEstimate: '$210 USD',
    desc: 'El balance ideal de precio/rendimiento (65W TDP, TjMax 100°C). 6 núcleos de alto rendimiento y 4 de eficiencia capaces de alimentar GPUs modernas.',
  },
  {
    id: 'cpu-ryzen-5700x3d',
    name: 'AMD Ryzen 7 5700X3D (AM4 3D V-Cache)',
    tier: 'alta',
    tierLabel: 'GAMA ALTA AM4 (8C // 3D V-CACHE)',
    cores: '8C / 16T',
    clockGhz: 4.1,
    powerWatts: 105,
    gamingPowerScore: 92,
    multiTaskScore: 80,
    priceUsd: 240,
    priceEstimate: '$240 USD',
    desc: 'Actualización suprema para plataformas AM4. 96MB de 3D V-Cache reducen la latencia L3 y mejoran dramáticamente los 1% Lows.',
  },
  {
    id: 'cpu-i7-13700k',
    name: 'Intel Core i7-13700K (16 Núcleos / 5.4 GHz)',
    tier: 'alta',
    tierLabel: 'GAMA ALTA (16 NÚCLEOS 8P+8E)',
    cores: '16C / 24T',
    clockGhz: 5.4,
    powerWatts: 125,
    gamingPowerScore: 94,
    multiTaskScore: 94,
    priceUsd: 370,
    priceEstimate: '$370 USD',
    desc: 'Fuerza bruta con 8 núcleos P y 8 núcleos E (125W-253W Boost, TjMax 100°C). Alto rendimiento en streaming, render y gaming pesado.',
  },
  {
    id: 'cpu-ryzen-7800x3d',
    name: 'AMD Ryzen 7 7800X3D (3D V-Cache Gaming Top)',
    tier: 'alta',
    tierLabel: 'GAMA ALTA (GAMING REY // 3D V-CACHE)',
    cores: '8C / 16T',
    clockGhz: 5.0,
    powerWatts: 120,
    gamingPowerScore: 99,
    multiTaskScore: 86,
    priceUsd: 390,
    priceEstimate: '$390 USD',
    desc: 'La CPU reina para videojuegos (120W TDP, TjMax 89°C). 96MB de 3D V-Cache eliminan los cuellos de botella de memoria y disparan el 1% Low.',
  },
  {
    id: 'cpu-ryzen-9800x3d',
    name: 'AMD Ryzen 7 9800X3D (Zen 5 // 2da Gen 3D V-Cache)',
    tier: 'extrema',
    tierLabel: 'GAMA EXTREMA REY DE eSPORTS (ZEN 5 X3D)',
    cores: '8C / 16T',
    clockGhz: 5.2,
    powerWatts: 120,
    gamingPowerScore: 100,
    multiTaskScore: 92,
    priceUsd: 479,
    priceEstimate: '$479 USD',
    desc: 'Arquitectura Zen 5 con 3D V-Cache invertido de 2da generación. Récord mundial de FPS y fluidez en Valorant, CS2 y eSports a 540Hz.',
  },
  {
    id: 'cpu-i9-14900k',
    name: 'Intel Core i9-14900K (24 Núcleos // 6.0 GHz Boost)',
    tier: 'extrema',
    tierLabel: 'GAMA EXTREMA INTEL (24 NÚCLEOS 8P+16E)',
    cores: '24C / 32T',
    clockGhz: 6.0,
    powerWatts: 253,
    gamingPowerScore: 98,
    multiTaskScore: 100,
    priceUsd: 580,
    priceEstimate: '$580 USD',
    desc: 'Máxima frecuencia de reloj de 6.0 GHz en núcleos P con 16 núcleos E para renderizado extremo.',
  },
  {
    id: 'cpu-ryzen-7950x3d',
    name: 'AMD Ryzen 9 7950X3D (16 Núcleos / 3D V-Cache)',
    tier: 'extrema',
    tierLabel: 'GAMA EXTREMA (16C / 32T ENTUSIASTA)',
    cores: '16C / 32T',
    clockGhz: 5.7,
    powerWatts: 120,
    gamingPowerScore: 100,
    multiTaskScore: 100,
    priceUsd: 590,
    priceEstimate: '$590 USD',
    desc: 'Monstruo de 16 núcleos con 3D V-Cache y 5.7 GHz Boost (120W TDP, TjMax 89°C). Lo último en renderizado multihilo y máxima fluidez.',
  },
];

export const GPU_OPTIONS: GpuOption[] = [
  {
    id: 'gpu-igpu-intel',
    name: 'Intel UHD Graphics (Integrada // RAM Compartida)',
    tier: 'igpu',
    tierLabel: 'GRÁFICA INTEGRADA INTEL (RAM COMPARTIDA)',
    vramGb: 2,
    powerWatts: 15,
    gamingPowerScore: 12,
    priceUsd: 0,
    priceEstimate: 'Incluida ($0)',
    desc: 'Sin memoria VRAM dedicada. Comparte dinámicamente hasta 2 GB y el ancho de banda del bus de memoria del sistema con la CPU. Tasa de cuadros limitada en eSports.',
    isIgpu: true,
  },
  {
    id: 'gpu-igpu-vega',
    name: 'AMD Radeon Vega 7 (Integrada APU // RAM Compartida)',
    tier: 'igpu',
    tierLabel: 'GRÁFICA INTEGRADA AMD VEGA (RAM COMPARTIDA)',
    vramGb: 2,
    powerWatts: 25,
    gamingPowerScore: 18,
    priceUsd: 0,
    priceEstimate: 'Incluida ($0)',
    desc: 'Gráficos integrados en silicio APU. Comparte memoria del sistema y escala notablemente su rendimiento si la memoria RAM opera en Dual Channel rápido.',
    isIgpu: true,
  },
  {
    id: 'gpu-gtx-1650',
    name: 'NVIDIA GeForce GTX 1650 (4GB GDDR6)',
    tier: 'esports',
    tierLabel: 'ENTRADA / eSPORTS (4GB DEDICADA)',
    vramGb: 4,
    powerWatts: 75,
    gamingPowerScore: 28,
    priceUsd: 130,
    priceEstimate: '$130 USD',
    desc: 'Diseñada para eSports (CS2, Valorant, LoL) en 1080p competitivo con 4GB dedicados (75W TDP). VRAM muy limitada para juegos AAA modernos.',
  },
  {
    id: 'gpu-rx-6700xt',
    name: 'AMD Radeon RX 6700 XT (12GB GDDR6)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA RADEON (12GB GDDR6)',
    vramGb: 12,
    powerWatts: 230,
    gamingPowerScore: 62,
    priceUsd: 270,
    priceEstimate: '$270 USD',
    desc: 'Gran relación calidad/precio con 12GB VRAM dedicados para 1080p y 1440p sin desbordes.',
  },
  {
    id: 'gpu-arc-a770',
    name: 'Intel Arc A770 Limited Edition (16GB GDDR6)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA INTEL ARC (16GB GDDR6)',
    vramGb: 16,
    powerWatts: 225,
    gamingPowerScore: 64,
    priceUsd: 290,
    priceEstimate: '$290 USD',
    desc: '16GB VRAM con codificador AV1 en hardware y excelente rendimiento en DirectX 12 / Vulkan.',
  },
  {
    id: 'gpu-rtx-3060',
    name: 'NVIDIA GeForce RTX 3060 (12GB GDDR6)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA VRAM AMPLIA (12GB GDDR6)',
    vramGb: 12,
    powerWatts: 170,
    gamingPowerScore: 55,
    priceUsd: 280,
    priceEstimate: '$280 USD',
    desc: '12 GB de VRAM GDDR6 con bus de 192 bits (170W TDP). Amplitud de memoria que previene desbordes y tartamudeos en 1080p y 1440p.',
  },
  {
    id: 'gpu-rtx-4060',
    name: 'NVIDIA GeForce RTX 4060 (8GB GDDR6)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA EFICIENTE (8GB GDDR6)',
    vramGb: 8,
    powerWatts: 115,
    gamingPowerScore: 65,
    priceUsd: 299,
    priceEstimate: '$299 USD',
    desc: 'Excelente balance y bajo consumo (115W TDP). Incluye DLSS 3 Frame Generation para 1080p y 1440p.',
  },
  {
    id: 'gpu-rtx-4060ti-16gb',
    name: 'NVIDIA GeForce RTX 4060 Ti (16GB GDDR6)',
    tier: 'media',
    tierLabel: 'GAMA MEDIA ALTA (16GB GDDR6)',
    vramGb: 16,
    powerWatts: 165,
    gamingPowerScore: 72,
    priceUsd: 449,
    priceEstimate: '$449 USD',
    desc: '16GB de VRAM para evitar desbordes en juegos con texturas pesadas a 1440p.',
  },
  {
    id: 'gpu-rx-7800xt',
    name: 'AMD Radeon RX 7800 XT (16GB GDDR6)',
    tier: 'alta',
    tierLabel: 'GAMA ALTA RADEON 1440p (16GB GDDR6)',
    vramGb: 16,
    powerWatts: 263,
    gamingPowerScore: 82,
    priceUsd: 499,
    priceEstimate: '$499 USD',
    desc: 'Excelente rendimiento nativo en 1440p con 16GB VRAM y 64MB Infinity Cache.',
  },
  {
    id: 'gpu-rtx-4070-super',
    name: 'NVIDIA GeForce RTX 4070 Super (12GB GDDR6X)',
    tier: 'alta',
    tierLabel: 'GAMA ALTA NVIDA 1440p (12GB GDDR6X)',
    vramGb: 12,
    powerWatts: 220,
    gamingPowerScore: 84,
    priceUsd: 589,
    priceEstimate: '$589 USD',
    desc: 'Punto dulce para 1440p con Ray Tracing, DLSS 3.5 y bajo consumo energético.',
  },
  {
    id: 'gpu-rtx-4070ti-super',
    name: 'NVIDIA GeForce RTX 4070 Ti Super (16GB GDDR6X)',
    tier: 'alta',
    tierLabel: 'GAMA ALTA (16GB GDDR6X)',
    vramGb: 16,
    powerWatts: 285,
    gamingPowerScore: 88,
    priceUsd: 799,
    priceEstimate: '$799 USD',
    desc: 'Potencia masiva para 1440p Ultra y 4K con texturas pesadas, Ray Tracing completo y bus de 256 bits (285W TDP).',
  },
  {
    id: 'gpu-rtx-4080-super',
    name: 'NVIDIA GeForce RTX 4080 Super (16GB GDDR6X)',
    tier: '4k',
    tierLabel: 'GAMA 4K PREMIUM (16GB GDDR6X)',
    vramGb: 16,
    powerWatts: 320,
    gamingPowerScore: 94,
    priceUsd: 980,
    priceEstimate: '$980 USD',
    desc: 'Renderizado 4K fluido con Ray Tracing Ultra y codificador NVENC de alta calidad.',
  },
  {
    id: 'gpu-rx-7900xtx',
    name: 'AMD Radeon RX 7900 XTX (24GB GDDR6)',
    tier: '4k',
    tierLabel: 'GAMA 4K RADEON TOP (24GB GDDR6)',
    vramGb: 24,
    powerWatts: 355,
    gamingPowerScore: 95,
    priceUsd: 949,
    priceEstimate: '$949 USD',
    desc: '24GB VRAM dedicados con arquitectura RDNA 3 y bus de 384 bits para 4K nativo.',
  },
  {
    id: 'gpu-rtx-4090',
    name: 'NVIDIA GeForce RTX 4090 OC (24GB GDDR6X)',
    tier: '4k',
    tierLabel: 'GAMA 4K EXTREMA TITÁN (24GB)',
    vramGb: 24,
    powerWatts: 450,
    gamingPowerScore: 100,
    priceUsd: 1799,
    priceEstimate: '$1,799 USD',
    desc: 'La placa gráfica más potente del mundo (450W TDP). 24GB GDDR6X para renderizado 4K nativo y cargas de IA extremas.',
  },
];

export const RAM_OPTIONS: RamOption[] = [
  {
    id: 'ram-8gb-single',
    sizeGb: 8,
    channels: 'single',
    speedMhz: 2666,
    priceUsd: 25,
    label: '8 GB Single Channel (1x8GB 2666MHz)',
    desc: 'Poco espacio y mitad de ancho de banda. Provoca paginación (swap) al disco y tirones severos.',
  },
  {
    id: 'ram-16gb-single',
    sizeGb: 16,
    channels: 'single',
    speedMhz: 3200,
    priceUsd: 38,
    label: '16 GB Single Channel (1x16GB 3200MHz)',
    desc: 'Capacidad suficiente pero bus recortado a 64-bit. Origina bajones en percentil 1% Low en eSports.',
  },
  {
    id: 'ram-16gb-dual',
    sizeGb: 16,
    channels: 'dual',
    speedMhz: 3200,
    priceUsd: 45,
    label: '16 GB Dual Channel (2x8GB 3200MHz DDR4)',
    desc: 'El estándar recomendado para jugar fluido en cualquier juego actual con bus de 128-bit.',
  },
  {
    id: 'ram-32gb-dual',
    sizeGb: 32,
    channels: 'dual',
    speedMhz: 6000,
    priceUsd: 95,
    label: '32 GB Dual Channel (2x16GB 6000MHz DDR5 EXPO)',
    desc: 'Capacidad y velocidad óptimas para jugar con programas pesados de fondo sin desbordes.',
  },
  {
    id: 'ram-64gb-dual-ddr5',
    sizeGb: 64,
    channels: 'dual',
    speedMhz: 6400,
    priceUsd: 190,
    label: '64 GB Dual Channel (2x32GB 6400MHz DDR5)',
    desc: 'Máxima amplitud de memoria para simulación, mods pesados y creación de contenido en 4K.',
  },
];

export const STORAGE_OPTIONS: StorageOption[] = [
  {
    id: 'storage-hdd',
    name: 'Disco Mecánico HDD 7200 RPM (140 MB/s)',
    type: 'hdd',
    speedMbS: 140,
    priceUsd: 40,
    label: 'Disco Mecánico HDD (140 MB/s)',
    desc: 'Disco magnético con platos giratorios. En juegos AAA modernos causa texturas invisibles, tiempos de carga de más de 45s y micro-tirones de streaming.',
  },
  {
    id: 'storage-sata-ssd',
    name: 'SSD SATA III 2.5" (550 MB/s)',
    type: 'sata',
    speedMbS: 550,
    priceUsd: 35,
    label: 'SSD SATA III (550 MB/s)',
    desc: 'Almacenamiento de estado sólido por interfaz SATA. Fluido para arranque de Windows y juegos ligeros, pero saturado en transferencias pesadas simultáneas.',
  },
  {
    id: 'storage-nvme-gen3',
    name: 'SSD NVMe M.2 PCIe 3.0 (3500 MB/s)',
    type: 'nvme3',
    speedMbS: 3500,
    priceUsd: 55,
    label: 'SSD NVMe PCIe 3.0 (3500 MB/s)',
    desc: 'Excelente velocidad de transferencia. Carga juegos en menos de 5 segundos y es totalmente compatible con DirectStorage.',
  },
  {
    id: 'storage-nvme-gen4',
    name: 'SSD NVMe M.2 PCIe 4.0 (7000 MB/s)',
    type: 'nvme4',
    speedMbS: 7000,
    priceUsd: 85,
    label: 'SSD NVMe PCIe 4.0 (7000 MB/s)',
    desc: 'Ancho de banda ultra rápido (7 GB/s) optimizado para DirectStorage, streaming de texturas en tiempo real y renderizado 4K sin demoras.',
  },
  {
    id: 'storage-nvme-gen5',
    name: 'SSD NVMe M.2 PCIe 5.0 (12000 MB/s Extreme)',
    type: 'nvme5',
    speedMbS: 12000,
    priceUsd: 160,
    label: 'SSD NVMe PCIe 5.0 (12,000 MB/s Ultra)',
    desc: 'Lo último en tecnología de almacenamiento con tasas de transferencia de hasta 12 GB/s para eliminación absoluta del tiempo de carga.',
  },
];

export const PSU_OPTIONS: PsuOption[] = [
  {
    id: 'psu-400w',
    watts: 400,
    rating: '80+ White / Genérica',
    priceUsd: 35,
    label: '400 Watts',
    desc: 'Apta solo para componentes de muy bajo consumo.',
  },
  {
    id: 'psu-600w',
    watts: 600,
    rating: '80+ Bronze',
    priceUsd: 65,
    label: '600 Watts Bronze',
    desc: 'Equilibrio perfecto para configuraciones de gama media.',
  },
  {
    id: 'psu-850w',
    watts: 850,
    rating: '80+ Gold ATX 3.0',
    priceUsd: 130,
    label: '850 Watts Gold',
    desc: 'Potencia limpia y sobrada para componentes de gama alta.',
  },
  {
    id: 'psu-1200w',
    watts: 1200,
    rating: '80+ Platinum',
    priceUsd: 220,
    label: '1200 Watts Platinum',
    desc: 'Respaldo absoluto para GPUs 4K extremas y procesadores desbloqueados.',
  },
];

export const AVAILABLE_PROCESSES: BackgroundProcess[] = [
  {
    id: 'proc-chrome',
    name: 'Google Chrome (25 pestañas + YouTube 4K)',
    category: 'browser',
    cpuImpactPercent: 12,
    ramImpactGb: 4.2,
    vramImpactGb: 0.8,
    ioDemandPercent: 15,
    desc: 'Consume RAM y algo de CPU para decodificar video.',
  },
  {
    id: 'proc-discord',
    name: 'Discord con Streaming en Vivo 1080p 60FPS',
    category: 'streaming',
    cpuImpactPercent: 15,
    ramImpactGb: 1.8,
    vramImpactGb: 0.5,
    ioDemandPercent: 10,
    desc: 'Captura la pantalla y codifica video en tiempo real.',
  },
  {
    id: 'proc-render',
    name: 'Renderizado de Video 4K en Segundo Plano (Premiere)',
    category: 'render',
    cpuImpactPercent: 65,
    ramImpactGb: 8.5,
    vramImpactGb: 2.2,
    ioDemandPercent: 75,
    desc: 'Ocupa casi todos los núcleos de tu procesador y satura el disco.',
  },
  {
    id: 'proc-antivirus',
    name: 'Antivirus / Windows Defender Análisis Rápido',
    category: 'antivirus',
    cpuImpactPercent: 22,
    ramImpactGb: 1.2,
    vramImpactGb: 0.1,
    ioDemandPercent: 85,
    desc: 'Escanea archivos con lecturas intensivas de disco e interrupciones.',
  },
  {
    id: 'proc-telemetry',
    name: 'Servicios de Telemetría de Windows',
    category: 'telemetry',
    cpuImpactPercent: 8,
    ramImpactGb: 0.9,
    vramImpactGb: 0.1,
    ioDemandPercent: 20,
    desc: 'Procesos de fondo no esenciales que generan pequeños picos.',
  },
];

// ============================================================================
// EDUCATIONAL ANALOGIES (TOOLTIPS)
// ============================================================================
const DIDACTIC_EXPLANATIONS: Record<string, { title: string; analogy: string; detail: string }> = {
  ram: {
    title: '¿Qué es la Memoria RAM y la Paginación?',
    analogy: '🪑 La RAM es tu mesa de trabajo; el disco es el cajón.',
    detail: 'Si tu mesa de trabajo se llena, Windows manda datos al disco (Swap/Paginación). Como el disco es mucho más lento que la RAM, el juego se frena en seco dando tirones de 1 a 5 FPS.',
  },
  vram: {
    title: '¿Qué es la VRAM (Memoria de Video)?',
    analogy: '🎨 La VRAM es la paleta de pinturas de la placa de video.',
    detail: 'Allí se guardan las texturas y sombras 3D. Si se desborda, la placa tiene que pedir texturas por el bus PCIe a la RAM común, provocando frametimes en forma de serrucho errático.',
  },
  bottleneck: {
    title: '¿Qué es el Cuello de Botella (Bottleneck)?',
    analogy: '🍾 Es como ponerle el motor de una Ferrari a una bicicleta.',
    detail: 'Ocurre cuando una parte es demasiado lenta para seguirle el ritmo a otra. Si tu CPU está al 98% y la GPU al 40%, la gráfica está durmiendo esperando órdenes.',
  },
  storage_io: {
    title: '¿Qué es la Saturación de I/O de Disco?',
    analogy: '📦 Es un camión de mudanzas que no da abasto.',
    detail: 'Los juegos modernos cargan gigabytes de texturas en tiempo real. Un disco mecánico HDD tarda tanto en responder que el juego se congela mientras espera que los modelos 3D aparezcan.',
  },
  opp_power: {
    title: '¿Qué es la Protección OPP de la Fuente?',
    analogy: '⚡ Es la llave térmica de tu casa.',
    detail: 'Si tus componentes intentan chupar más electricidad de la que la fuente puede entregar, la fuente corta la corriente en seco para evitar incendiarse.',
  },
  thermal_throttling: {
    title: '¿Qué es el Thermal Throttling?',
    analogy: '🔥 Es un atleta que baja el ritmo para no desmayarse de calor.',
    detail: 'Al superar los 95°C por pasta térmica seca o polvo, el silicio reduce su velocidad a la mitad para no quemarse, causando caídas brutales de rendimiento.',
  },
  roi_fps: {
    title: '¿Cómo se calcula el Retorno de Inversión ($ por FPS)?',
    analogy: '💡 Es saber cuántos dólares cuesta cada fotograma ganado.',
    detail: 'Gastar $800 en una GPU cuando tu CPU te limita te dará 0 FPS extra ($800/0 = pésima compra). Invertir $140 en un mejor CPU desbloquea 45 FPS ($3.1 USD/FPS = compra perfecta).',
  },
};

// ============================================================================
// CONDITIONAL TRIAGE ANALYSIS ENGINE (EVOMaX PC COPILOT CORE)
// ============================================================================
export interface SystemAnalysisInput {
  cpu: CpuOption;
  gpu: GpuOption;
  ram: RamOption;
  storage: StorageOption;
  psu: PsuOption;
  activeProcesses: string[];
  gameType: 'esports' | 'aaa';
  resolution: '1080p' | '1440p' | '4k';
  degradationMonths: number;
  xmpEnabled?: boolean;
  casLatency?: number;
  cpuUndervoltMv?: number;
  mousePollingRate?: number;
  monitorRefreshRate?: number;
  networkType?: 'fiber_ethernet' | 'wifi_6e' | 'wifi_24ghz_congested' | 'lte_mobile';
}

export interface EvoMaxDiagnosticOutput {
  status: 'CRITICAL' | 'WARNING' | 'THERMAL' | 'OPTIMAL';
  severityLevel: number; // 0 to 10
  title: string;
  message: string;
  recommendation: string;
  targetComponent: 'psu' | 'ram' | 'storage' | 'cpu' | 'gpu' | 'maintenance' | 'none';
  quickFixActionText: string;
  logSummary: string;
  impactScore: string;
}

// ============================================================================
// TELEMETRY DETECTOR HELPER
// ============================================================================
export function detectHardwareFromTelemetry(passport?: UserHardwarePassport | null): {
  cpuId: string;
  gpuId: string;
  ramId: string;
  storageId: string;
  psuId: string;
  isDetected: boolean;
  isIgpu: boolean;
  detectedGpuName: string;
  detectedCpuName: string;
  detectedRamGb: number;
} {
  let rawPassport = passport;
  let rawJson: any = null;

  if (!rawPassport) {
    try {
      const saved = localStorage.getItem('evo_c01_specs');
      if (saved) rawPassport = JSON.parse(saved);
    } catch {}
  }

  try {
    const rawAuto = localStorage.getItem('evo_autodetected_hardware');
    if (rawAuto) rawJson = JSON.parse(rawAuto);
  } catch {}

  const gpuName = (rawPassport?.gpuModel || rawJson?.GPU || '').toUpperCase();
  const cpuName = (rawPassport?.cpuModel || rawJson?.CPU || '').toUpperCase();
  const ramGb = Number(rawPassport?.ramSizeGb || rawPassport?.ramCapacityGb || rawJson?.RAM_GB || 0);
  const vramGb = Number(
    rawPassport?.vramGb !== undefined
      ? rawPassport.vramGb
      : rawJson?.VRAM_GB !== undefined
      ? rawJson.VRAM_GB
      : 8
  );

  const isDetected = Boolean(gpuName || cpuName || ramGb > 0);

  // REGLA DE DETECCIÓN: Si el string de la GPU global incluye "UHD" o "Radeon Graphics" o "Intel HD" o "Iris" o "Vega",
  // o si la VRAM_GB detectada es <= 2, fuerza el selector de GPU del simulador al valor "Gráfica Integrada (iGPU)"
  const isVega = gpuName.includes('VEGA') || (cpuName.includes('5600G') && !gpuName.includes('RTX') && !gpuName.includes('GTX'));
  const isIgpu =
    isVega ||
    gpuName.includes('UHD') ||
    gpuName.includes('RADEON GRAPHICS') ||
    gpuName.includes('INTEL HD') ||
    gpuName.includes('IRIS') ||
    gpuName.includes('INTEGRATED') ||
    (vramGb <= 2 &&
      !gpuName.includes('GTX') &&
      !gpuName.includes('RTX') &&
      !gpuName.includes('RX 6') &&
      !gpuName.includes('RX 7') &&
      !gpuName.includes('RX 5')) ||
    vramGb === 0;

  let gpuId = 'gpu-rtx-4060';
  if (isIgpu && isDetected) {
    gpuId = isVega ? 'gpu-igpu-vega' : 'gpu-igpu-intel';
  } else if (gpuName.includes('4090') || gpuName.includes('7900') || vramGb >= 20) {
    gpuId = 'gpu-rtx-4090';
  } else if (
    gpuName.includes('4070') ||
    gpuName.includes('4080') ||
    gpuName.includes('7800') ||
    gpuName.includes('3080') ||
    vramGb >= 16
  ) {
    gpuId = 'gpu-rtx-4070ti-super';
  } else if (
    gpuName.includes('3060') ||
    (vramGb >= 10 && vramGb < 16)
  ) {
    gpuId = 'gpu-rtx-3060';
  } else if (
    gpuName.includes('4060') ||
    gpuName.includes('6600') ||
    gpuName.includes('2060') ||
    vramGb >= 6
  ) {
    gpuId = 'gpu-rtx-4060';
  } else if (
    gpuName.includes('1650') ||
    gpuName.includes('6400') ||
    gpuName.includes('1050') ||
    gpuName.includes('580') ||
    vramGb >= 3
  ) {
    gpuId = 'gpu-gtx-1650';
  } else if (isDetected) {
    gpuId = isVega ? 'gpu-igpu-vega' : 'gpu-igpu-intel';
  }

  // CPU Detection:
  let cpuId = 'cpu-i5-13400';
  if (
    cpuName.includes('N100') ||
    cpuName.includes('N95') ||
    cpuName.includes('CELERON') ||
    cpuName.includes('PENTIUM') ||
    cpuName.includes('ATHLON')
  ) {
    cpuId = 'cpu-n100';
  } else if (cpuName.includes('1220P') || cpuName.includes('I3') || cpuName.includes('RYZEN 3')) {
    cpuId = 'cpu-i3-1220p';
  } else if (cpuName.includes('5600G')) {
    cpuId = 'cpu-ryzen-5600g';
  } else if (
    cpuName.includes('7950') ||
    cpuName.includes('I9') ||
    cpuName.includes('14900') ||
    cpuName.includes('13900')
  ) {
    cpuId = 'cpu-ryzen-7950x3d';
  } else if (cpuName.includes('7800X3D') || cpuName.includes('X3D')) {
    cpuId = 'cpu-ryzen-7800x3d';
  } else if (
    cpuName.includes('13700') ||
    cpuName.includes('14700') ||
    cpuName.includes('I7') ||
    cpuName.includes('RYZEN 7')
  ) {
    cpuId = 'cpu-i7-13700k';
  } else if (
    cpuName.includes('13400') ||
    cpuName.includes('12400') ||
    cpuName.includes('5600') ||
    cpuName.includes('I5') ||
    cpuName.includes('RYZEN 5') ||
    cpuName.includes('ULTRA 5')
  ) {
    cpuId = 'cpu-i5-13400';
  }

  // RAM Detection:
  let ramId = 'ram-16gb-dual';
  if (ramGb > 0 && ramGb <= 8) {
    ramId = 'ram-8gb-single';
  } else if (ramGb > 24) {
    ramId = 'ram-32gb-dual';
  } else if (ramGb > 8) {
    ramId = 'ram-16gb-dual';
  }

  // PSU Detection:
  let psuId = 'psu-600w';
  if (isIgpu) {
    psuId = 'psu-400w';
  } else if (gpuId === 'gpu-rtx-4090' || cpuId === 'cpu-ryzen-7950x3d' || cpuId === 'cpu-i7-13700k') {
    psuId = 'psu-850w';
  }

  return {
    cpuId,
    gpuId,
    ramId,
    storageId: 'storage-nvme-gen4',
    psuId,
    isDetected,
    isIgpu,
    detectedGpuName: rawPassport?.gpuModel || rawJson?.GPU || (isVega ? 'AMD Radeon Vega 7' : 'Intel UHD Graphics'),
    detectedCpuName: rawPassport?.cpuModel || rawJson?.CPU || 'CPU Detectada',
    detectedRamGb: ramGb || 16,
  };
}

export function analyzeSystemStateConditional(input: SystemAnalysisInput): EvoMaxDiagnosticOutput {
  const {
    cpu,
    gpu,
    ram,
    storage,
    psu,
    activeProcesses,
    gameType,
    resolution,
    degradationMonths,
    xmpEnabled = true,
    casLatency = 36,
    cpuUndervoltMv = 0,
    mousePollingRate = 1000,
    monitorRefreshRate = 210,
    networkType = 'fiber_ethernet',
  } = input;

  // 1. EVALUAR ENERGÍA (OPP/OCP)
  const totalWattsDemanded = cpu.powerWatts + gpu.powerWatts + 55;
  const isPowerExceeded = totalWattsDemanded > psu.watts;

  if (isPowerExceeded) {
    return {
      status: 'CRITICAL',
      severityLevel: 10,
      title: '¡APAGÓN POR FUENTE (OPP)!',
      message:
        '¡APAGÓN POR FUENTE (OPP)! Tu sistema exige más energía de la que la fuente puede entregar. Cambiar el procesador o la gráfica aquí quemará los componentes. Actualiza la fuente de poder inmediatamente.',
      recommendation: `Instalá una fuente de al menos ${totalWattsDemanded + 150}W Gold ATX 3.0 para evitar daños irreversibles en el silicio.`,
      targetComponent: 'psu',
      quickFixActionText: 'Instalar Fuente 850W Gold',
      logSummary: `[OPP CRASH] Demanda: ${totalWattsDemanded}W > Capacidad: ${psu.watts}W. Protección OPP activada.`,
      impactScore: '100% Pérdida de Sistema (Blackout)',
    };
  }

  // Background requirements calculation
  let backgroundRamGb = 3.2;
  let backgroundVramGb = 0.4;
  let backgroundCpuPercent = 4;
  let backgroundIoDemand = 2;

  activeProcesses.forEach((pid) => {
    const p = AVAILABLE_PROCESSES.find((item) => item.id === pid);
    if (p) {
      backgroundRamGb += p.ramImpactGb;
      backgroundVramGb += p.vramImpactGb;
      backgroundCpuPercent += p.cpuImpactPercent;
      backgroundIoDemand += p.ioDemandPercent;
    }
  });

  // Degradation thermal calculation (with undervolt discount)
  const undervoltDiscountC = Math.round(Math.abs(cpuUndervoltMv) * 0.25);
  const dustTemp = +(degradationMonths * 0.28).toFixed(1);
  const thermalMultiplier = 1 + (degradationMonths / 60) * 0.45;
  const estimatedCpuTemp = Math.max(35, Math.round((40 + 44) * thermalMultiplier + dustTemp - undervoltDiscountC));
  const isThermalThrottling = (degradationMonths >= 36 && cpuUndervoltMv > -20) || estimatedCpuTemp >= 95;

  // 2. EVALUAR DEGRADACIÓN TÉRMICA (THERMAL THROTTLING)
  if (isThermalThrottling) {
    return {
      status: 'THERMAL',
      severityLevel: 8,
      title: 'ESTRANGULAMIENTO TÉRMICO (TjMax 95°C)',
      message:
        'Tu pasta térmica se cristalizó por el paso del tiempo y el disipador acumuló polvo. El procesador bajó su reloj a la mitad para no quemarse.',
      recommendation: 'Hacé clic en [🛠️ Mantenimiento EVO] para limpiar y repastar o aplica Undervolt de -20mV/-30mV en el BIOS.',
      targetComponent: 'maintenance',
      quickFixActionText: 'Ejecutar Mantenimiento EVO',
      logSummary: `[THERMAL THROTTLING] Tiempo: ${degradationMonths}m. Temp silicio: ${estimatedCpuTemp}°C > TjMax (95°C). Reloj recortado al 50%.`,
      impactScore: '-50% Frecuencia de Reloj',
    };
  }

  // Game Demand
  const is4k = resolution === '4k';
  const is1440p = resolution === '1440p';
  const gameVramDemand = gameType === 'aaa' ? (is4k ? 14.8 : is1440p ? 9.8 : 7.2) : (is4k ? 5.2 : 3.4);
  const totalVramNeeded = +(gameVramDemand + backgroundVramGb).toFixed(1);

  const gameRamDemand = gameType === 'aaa' ? 12.5 : 6.0;
  const totalRamNeeded = +(gameRamDemand + backgroundRamGb).toFixed(1);

  // 3. EVALUAR SATURACIÓN DE RAM (PAGINACIÓN / SWAP THRASHING)
  if (totalRamNeeded > ram.sizeGb) {
    return {
      status: 'WARNING',
      severityLevel: 9,
      title: 'SATURACIÓN DE RAM (PAGINACIÓN / SWAP)',
      message:
        'Saturación de RAM. El sistema está usando el disco como memoria (Paginación). Los micro-tirones no son culpa del procesador ni de la placa de video. Añade más RAM para resolver el cuello de botella.',
      recommendation: 'Instalá 16 GB o 32 GB en Dual Channel. Notarás cómo el 1% Low salta de 4 FPS a más de 60 FPS al instante.',
      targetComponent: 'ram',
      quickFixActionText: 'Subir a 32GB Dual Channel',
      logSummary: `[RAM SWAP THRASHING] Demanda: ${totalRamNeeded}GB > RAM Física: ${ram.sizeGb}GB. Paginación forzada a disco.`,
      impactScore: '1% Low hundido a 4 FPS',
    };
  }

  // 4. EVALUAR SOBRECARGA DE INTERRUPCIONES DPC (POLLING RATE 4000Hz+ EN CPU DE ENTRADA)
  if (mousePollingRate >= 4000 && cpu.tier === 'baja') {
    return {
      status: 'WARNING',
      severityLevel: 8,
      title: 'SOBRECARGA DE INTERRUPCIONES DPC (POLLING RATE 4000Hz+)',
      message:
        'Sobrecarga de interrupciones DPC. El mouse enviando 4000Hz/8000Hz satura los hilos de un CPU de entrada, inyectando micro-tirones severos (DPC latency spike).',
      recommendation: 'Baja el polling rate del mouse a 1000Hz o actualiza a un CPU con mayor conteo de núcleos e IPC.',
      targetComponent: 'cpu',
      quickFixActionText: 'Ajustar Polling Rate a 1000Hz',
      logSummary: `[DPC STORM] Mouse a ${mousePollingRate}Hz consume ~20% CPU en interrupciones de kernel en ${cpu.name.split(' ')[0]}.`,
      impactScore: 'Micro-tirones constantes & DPC Spikes',
    };
  }

  // 5. EVALUAR BUFFERBLOAT & CONGESTIÓN DE RED (WI-FI SATURADO)
  if (networkType === 'wifi_24ghz_congested') {
    return {
      status: 'WARNING',
      severityLevel: 8,
      title: 'CONGESTIÓN DE RED & BUFFERBLOAT (WI-FI 2.4GHz)',
      message:
        'Saturación de red y Bufferbloat detectados: 7.5% de pérdida de paquetes y picos de 240ms. Tus FPS son altos pero sufrirás "Rubberbanding" (teletransportación de enemigos).',
      recommendation: 'Conecta por cable Ethernet directo (Cat 6) o usa una red Wi-Fi 6E de 5GHz/6GHz sin contienda de canal.',
      targetComponent: 'maintenance',
      quickFixActionText: 'Cambiar a Fibra Ethernet Directa',
      logSummary: `[BUFFERBLOAT CHOKE] Wi-Fi 2.4GHz saturado. Jitter ±48ms, Packet Loss 7.5%, Ping Spikes a 240ms.`,
      impactScore: 'Rubberbanding & 7.5% Packet Loss',
    };
  }

  // 6. EVALUAR CUELLO DE BOTELLA DE MEMORIA (XMP / EXPO APAGADO)
  if (!xmpEnabled) {
    return {
      status: 'WARNING',
      severityLevel: 7,
      title: 'CUELLO DE BOTELLA DE MEMORIA (XMP/EXPO DESACTIVADO)',
      message:
        'Cuello de botella de memoria detectado. Tu RAM opera a velocidades JEDEC base. Activa XMP para liberar el IPC del procesador.',
      recommendation: 'Activa el perfil XMP / EXPO en el BIOS virtual para elevar la frecuencia a su especificación de fábrica y ganar hasta +15% de 1% Low.',
      targetComponent: 'ram',
      quickFixActionText: 'Activar Perfil XMP/EXPO',
      logSummary: `[ANÁLISIS PERICIAL PROFUNDO] RAM operando en velocidad base JEDEC CL${casLatency}. Latencia de caché L3 penalizada.`,
      impactScore: '-15% en 1% Low & Frametime inestable',
    };
  }

  // 7. EVALUAR SATURACIÓN DE I/O (DISCO)
  const isHeavyIoLoad = gameType === 'aaa' || activeProcesses.includes('proc-render') || activeProcesses.includes('proc-antivirus');
  if (storage.type === 'hdd' && isHeavyIoLoad) {
    return {
      status: 'WARNING',
      severityLevel: 7,
      title: 'SATURACIÓN DE I/O (DISCO RÍGIDO)',
      message:
        'Cuello de botella de I/O. El disco está al 100% de tiempo de actividad intentando mover datos. Actualiza a un SSD NVMe PCIe antes de tocar la gráfica.',
      recommendation: 'Cambiá a un SSD NVMe PCIe 4.0 con DirectStorage para cargar texturas y escenarios sin micro-parones.',
      targetComponent: 'storage',
      quickFixActionText: 'Instalar SSD NVMe PCIe 4.0',
      logSummary: `[STORAGE I/O CHOKE] Ancho de banda HDD: ${storage.speedMbS} MB/s saturado al 100%. Tirones en streaming de texturas.`,
      impactScore: 'Texturas invisibles & Micro-parones',
    };
  }

  // 8. EVALUAR CUELLO DE BOTELLA GRÁFICO iGPU (RAM COMPARTIDA & ANCHO DE BANDA)
  if (gpu.tier === 'igpu' || gpu.id === 'gpu-igpu' || gpu.isIgpu) {
    return {
      status: 'WARNING',
      severityLevel: 8,
      title: 'CUELLO DE BOTELLA GRÁFICO (iGPU) // SATURACIÓN DE VRAM COMPARTIDA',
      message:
        'Cuello de botella en Gráfica Integrada (iGPU). Tu procesador tiene potencia de sobra, pero la GPU integrada no tiene VRAM dedicada y comparte el bus de la memoria RAM del sistema. Para jugar con mayor fluidez y estabilidad competitiva, añade una placa de video dedicada.',
      recommendation:
        'Instalar una placa de video dedicada (como NVIDIA GeForce RTX 4060 o AMD Radeon RX) multiplicará los FPS y liberará hasta 2GB de RAM del sistema.',
      targetComponent: 'gpu',
      quickFixActionText: 'Instalar GPU Dedicada (RTX 4060)',
      logSummary: `[iGPU BOTTLENECK] Gráfica integrada (${gpu.name}) sin VRAM dedicada. Comparte bus RAM (${ram.speedMhz} MT/s). Techo limitado a 70-95 FPS.`,
      impactScore: 'Render limitado a 70-95 FPS con 1% Low de 30-45 FPS',
    };
  }

  // 9. EVALUAR SATURACIÓN DE VRAM (TEXTURAS DESBORDADAS)
  if (totalVramNeeded > gpu.vramGb) {
    return {
      status: 'WARNING',
      severityLevel: 8,
      title: 'SATURACIÓN DE VRAM (TEXTURAS DESBORDADAS)',
      message:
        'Saturación de VRAM. Las texturas están desbordando hacia la RAM principal, hundiendo el bus PCIe. Baja la calidad de texturas o actualiza a una gráfica con más VRAM.',
      recommendation: 'Bajá la resolución de texturas a Medio/Alto o actualizá a una GPU de 12GB/16GB GDDR6.',
      targetComponent: 'gpu',
      quickFixActionText: 'Subir a RTX 4070 Ti (16GB)',
      logSummary: `[VRAM OVERFLOW] Demanda: ${totalVramNeeded}GB > VRAM GPU: ${gpu.vramGb}GB. Desborde a RAM vía bus PCIe.`,
      impactScore: 'Frametime en serrucho errático',
    };
  }

  // 10. EVALUAR CUELLO DE BOTELLA CPU (STUTTERING DE MOTOR)
  const isCpuBoundCondition = (cpu.tier === 'baja' && (gpu.tier === 'alta' || gpu.tier === '4k')) ||
    (cpu.tier === 'media' && gpu.tier === '4k' && gameType === 'esports') ||
    (backgroundCpuPercent > 60 && cpu.tier !== 'extrema');

  if (isCpuBoundCondition) {
    return {
      status: 'WARNING',
      severityLevel: 7,
      title: 'CUELLO DE BOTELLA EN PROCESADOR (CPU)',
      message:
        'Cuello de botella en Procesador. Tu placa de video está esperando instrucciones (durmiendo). Comprar una gráfica más potente será un desperdicio de dinero. Invierte en un CPU con mayor IPC o caché.',
      recommendation: 'Actualizá a un Ryzen 5 5600X o un Ryzen 7 7800X3D para que tu placa gráfica rinda al 99%.',
      targetComponent: 'cpu',
      quickFixActionText: 'Instalar Ryzen 7 7800X3D',
      logSummary: `[CPU BOTTLENECK] CPU (${cpu.name.split(' ')[0]}) limita GPU (${gpu.name.split(' ')[0]}). GPU rinde a < 60%.`,
      impactScore: 'GPU Subutilizada al 40-60%',
    };
  }

  // 11. SISTEMA EQUILIBRADO & EFICIENTE (OPTIMAL)
  return {
    status: 'OPTIMAL',
    severityLevel: 0,
    title: 'SISTEMA EQUILIBRADO & EFICIENTE',
    message:
      'Todos los componentes trabajan en armonía. La placa de video entrega el 98% de su capacidad sin que la CPU, la RAM o el disco la frenen.',
    recommendation: 'Configuración ideal. Excelente relación costo/rendimiento sin cuellos de botella.',
    targetComponent: 'none',
    quickFixActionText: 'Optimización Completa',
    logSummary: '[METROLOGY OK] Flujo de datos balanceado. Bus PCIe y memorias sin contienda.',
    impactScore: 'Fluidez 100% Óptima',
  };
}

interface EvoUltimateSandboxProps {
  initialStep?: 'assembler' | 'windows' | 'gaming';
  onNavigateToHardwareBench?: () => void;
  onOpenTomo?: (tomoId: string) => void;
  passport?: UserHardwarePassport | null;
}

export const EvoUltimateSandbox: React.FC<EvoUltimateSandboxProps> = ({
  initialStep = 'assembler',
  onNavigateToHardwareBench,
  onOpenTomo,
  passport,
}) => {
  // Global Telemetry Ingestion & Initial State
  const initialHardware = useMemo(() => detectHardwareFromTelemetry(passport), [passport]);

  // Navigation step
  const [activeStep, setActiveStep] = useState<'assembler' | 'windows' | 'gaming'>(initialStep);

  // Hardware State initialized directly from telemetry
  const [selectedCpuId, setSelectedCpuId] = useState<string>(() => initialHardware.cpuId);
  const [selectedGpuId, setSelectedGpuId] = useState<string>(() => initialHardware.gpuId);
  const [selectedRamId, setSelectedRamId] = useState<string>(() => initialHardware.ramId);
  const [selectedStorageId, setSelectedStorageId] = useState<string>(() => initialHardware.storageId);
  const [selectedPsuId, setSelectedPsuId] = useState<string>(() => initialHardware.psuId);
  const [detectedHwInfo, setDetectedHwInfo] = useState(initialHardware);

  // Background Windows Processes State
  const [activeProcesses, setActiveProcesses] = useState<string[]>(['proc-chrome']);

  // Game Simulator State - Default to esports 1080p if iGPU detected to avoid incorrect dedicated 4K calculations
  const [selectedGameType, setSelectedGameType] = useState<'esports' | 'aaa'>(() =>
    initialHardware.isIgpu ? 'esports' : 'aaa'
  );
  const [gameResolution, setGameResolution] = useState<'1080p' | '1440p' | '4k'>('1080p');

  // Gemini AI Game Probe State
  const [aiGameTitle, setAiGameTitle] = useState<string>('Valorant');
  const [customGameInput, setCustomGameInput] = useState<string>('Valorant');
  const [isQueryingAi, setIsQueryingAi] = useState<boolean>(false);
  const [aiBenchmarkResult, setAiBenchmarkResult] = useState<any | null>(null);
  const [aiQueryError, setAiQueryError] = useState<string | null>(null);

  const handleRunAiBenchmark = async (targetTitle?: string) => {
    const titleToUse = targetTitle || customGameInput.trim() || aiGameTitle;
    if (!titleToUse) return;

    setIsQueryingAi(true);
    setAiQueryError(null);

    try {
      const res = await fetch('/api/gemini/game-benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameTitle: titleToUse,
          customGameDetails: 'Prueba pericial EVO LABS',
          cpu: selectedCpu.name,
          gpu: selectedGpu.name,
          ramSizeGb: selectedRam.sizeGb,
          ramSpeedMts: selectedRam.speedMhz,
          ramChannels: selectedRam.channels === 'dual' ? 'Dual Channel (128-bit)' : 'Single Channel (64-bit)',
          storageType: selectedStorage.name,
          resolution: gameResolution,
          graphicsQuality: 'Alta / Competitiva',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al ejecutar el benchmark con IA');
      }

      setAiBenchmarkResult(json.benchmark);
    } catch (err: any) {
      setAiQueryError(err.message || 'Error de conexión con el motor IA');
    } finally {
      setIsQueryingAi(false);
    }
  };


  // =========================================================================
  // 1. HOOK DE SINCRONIZACIÓN INICIAL (useEffect) & BLOQUEO DE AUTO-ENGAÑO
  // =========================================================================
  useEffect(() => {
    const syncFromTelemetry = () => {
      let rawJson: any = null;
      let rawPassport = passport;

      try {
        const rawAuto = localStorage.getItem('evo_autodetected_hardware');
        if (rawAuto) rawJson = JSON.parse(rawAuto);
      } catch {}

      if (!rawPassport) {
        try {
          const saved = localStorage.getItem('evo_c01_specs');
          if (saved) rawPassport = JSON.parse(saved);
        } catch {}
      }

      const gpuStr = String(rawPassport?.gpuModel || rawJson?.GPU || '').toUpperCase();
      const cpuStr = String(rawPassport?.cpuModel || rawJson?.CPU || '').toUpperCase();
      const vramNum = Number(
        rawPassport?.vramGb !== undefined
          ? rawPassport.vramGb
          : rawJson?.VRAM_GB !== undefined
          ? rawJson.VRAM_GB
          : 0
      );
      const ramNum = Number(
        rawPassport?.ramSizeGb ||
        rawPassport?.ramCapacityGb ||
        rawJson?.RAM_GB ||
        0
      );

      const hasTelemetry = Boolean(gpuStr || cpuStr || ramNum > 0 || rawJson || rawPassport);

      if (hasTelemetry) {
        // LÓGICA GPU: Si telemetry.GPU incluye "UHD", "Intel", "Radeon Graphics", o si VRAM_GB es <= 2,
        // SOBREESCRIBE automáticamente el estado local del selector de GPU a "Gráfica Integrada"
        const isVegaDetected = gpuStr.includes('VEGA') || (cpuStr.includes('5600G') && !gpuStr.includes('RTX') && !gpuStr.includes('GTX'));
        const isIgpuDetected =
          isVegaDetected ||
          gpuStr.includes('UHD') ||
          gpuStr.includes('INTEL') ||
          gpuStr.includes('RADEON GRAPHICS') ||
          gpuStr.includes('IRIS') ||
          gpuStr.includes('INTEGRATED') ||
          (vramNum <= 2 &&
            !gpuStr.includes('GTX') &&
            !gpuStr.includes('RTX') &&
            !gpuStr.includes('RX 6') &&
            !gpuStr.includes('RX 7') &&
            !gpuStr.includes('RX 5')) ||
          vramNum === 0;

        if (isIgpuDetected) {
          setSelectedGpuId(isVegaDetected ? 'gpu-igpu-vega' : 'gpu-igpu-intel');
          setSelectedPsuId('psu-400w');
          setSelectedGameType('esports');
          setGameResolution('1080p');
        } else if (gpuStr.includes('4090') || gpuStr.includes('7900') || vramNum >= 20) {
          setSelectedGpuId('gpu-rtx-4090');
          setSelectedPsuId('psu-850w');
        } else if (
          gpuStr.includes('4070') ||
          gpuStr.includes('4080') ||
          gpuStr.includes('7800') ||
          gpuStr.includes('3080') ||
          vramNum >= 16
        ) {
          setSelectedGpuId('gpu-rtx-4070ti-super');
          setSelectedPsuId('psu-850w');
        } else if (
          gpuStr.includes('3060') ||
          (vramNum >= 10 && vramNum < 16)
        ) {
          setSelectedGpuId('gpu-rtx-3060');
          setSelectedPsuId('psu-600w');
        } else if (
          gpuStr.includes('4060') ||
          gpuStr.includes('6600') ||
          gpuStr.includes('2060') ||
          vramNum >= 6
        ) {
          setSelectedGpuId('gpu-rtx-4060');
          setSelectedPsuId('psu-600w');
        } else if (
          gpuStr.includes('1650') ||
          gpuStr.includes('6400') ||
          gpuStr.includes('1050') ||
          gpuStr.includes('580') ||
          vramNum >= 3
        ) {
          setSelectedGpuId('gpu-gtx-1650');
          setSelectedPsuId('psu-400w');
        } else {
          setSelectedGpuId(isVegaDetected ? 'gpu-igpu-vega' : 'gpu-igpu-intel');
          setSelectedPsuId('psu-400w');
        }

        // LÓGICA CPU: Si telemetry.CPU incluye "i3" o "N100", fuerza el selector de CPU correspondiente
        if (
          cpuStr.includes('N100') ||
          cpuStr.includes('N95') ||
          cpuStr.includes('CELERON') ||
          cpuStr.includes('PENTIUM') ||
          cpuStr.includes('ATHLON')
        ) {
          setSelectedCpuId('cpu-n100');
        } else if (cpuStr.includes('1220P') || cpuStr.includes('I3') || cpuStr.includes('RYZEN 3')) {
          setSelectedCpuId('cpu-i3-1220p');
        } else if (cpuStr.includes('5600G')) {
          setSelectedCpuId('cpu-ryzen-5600g');
        } else if (
          cpuStr.includes('7950') ||
          cpuStr.includes('I9') ||
          cpuStr.includes('14900') ||
          cpuStr.includes('13900')
        ) {
          setSelectedCpuId('cpu-ryzen-7950x3d');
        } else if (cpuStr.includes('7800X3D') || cpuStr.includes('X3D')) {
          setSelectedCpuId('cpu-ryzen-7800x3d');
        } else if (
          cpuStr.includes('13700') ||
          cpuStr.includes('14700') ||
          cpuStr.includes('I7') ||
          cpuStr.includes('RYZEN 7')
        ) {
          setSelectedCpuId('cpu-i7-13700k');
        } else if (
          cpuStr.includes('13400') ||
          cpuStr.includes('12400') ||
          cpuStr.includes('5600') ||
          cpuStr.includes('I5') ||
          cpuStr.includes('RYZEN 5') ||
          cpuStr.includes('ULTRA 5')
        ) {
          setSelectedCpuId('cpu-i5-13400');
        }

        // LÓGICA RAM: Fuerza el selector de RAM para que coincida con telemetry.RAM_GB
        if (ramNum > 0 && ramNum <= 8) {
          setSelectedRamId('ram-8gb-single');
        } else if (ramNum > 24) {
          setSelectedRamId('ram-32gb-dual');
        } else if (ramNum > 8) {
          setSelectedRamId('ram-16gb-dual');
        }

        setDetectedHwInfo(detectHardwareFromTelemetry(passport));
      }
    };

    // Synchronize immediately on mount
    syncFromTelemetry();

    window.addEventListener('evo_hardware_updated', syncFromTelemetry);
    window.addEventListener('evo_telemetry_parsed', syncFromTelemetry);
    window.addEventListener('storage', syncFromTelemetry);

    return () => {
      window.removeEventListener('evo_hardware_updated', syncFromTelemetry);
      window.removeEventListener('evo_telemetry_parsed', syncFromTelemetry);
      window.removeEventListener('storage', syncFromTelemetry);
    };
  }, [passport]);

  // Time Machine (Degradation Slider: 0 to 60 months)
  const [degradationMonths, setDegradationMonths] = useState<number>(0);
  const [maintenanceCelebration, setMaintenanceCelebration] = useState<boolean>(false);

  // View Mode: 'deep_dive' | 'single_truth'
  const [viewMode, setViewMode] = useState<'deep_dive' | 'single_truth'>(initialStep === 'gaming' ? 'deep_dive' : 'single_truth');
  useEffect(() => {
    setActiveStep(initialStep);
    if (initialStep === 'gaming') setViewMode('deep_dive');
  }, [initialStep]);

  // Sub-Navigation within Stage 3 (Simulador de Juegos)
  const [gamingSubTab, setGamingSubTab] = useState<'render_fps' | 'bios_memory' | 'latency_network'>('render_fps');

  // BIOS Virtual Micro-adjustments State
  const [xmpEnabled, setXmpEnabled] = useState<boolean>(true);
  const [casLatency, setCasLatency] = useState<number>(36);
  const [cpuUndervoltMv, setCpuUndervoltMv] = useState<number>(0);

  // End-to-End Latency & Peripherals State
  const [mousePollingRate, setMousePollingRate] = useState<number>(1000);
  const [monitorRefreshRate, setMonitorRefreshRate] = useState<number>(210);

  // Network & Bufferbloat State
  const [networkType, setNetworkType] = useState<'fiber_ethernet' | 'wifi_6e' | 'wifi_24ghz_congested' | 'lte_mobile'>('fiber_ethernet');

  // ROI Modal State
  const [isRoiModalOpen, setIsRoiModalOpen] = useState<boolean>(false);

  // Tooltip Modal State
  const [activeTooltipKey, setActiveTooltipKey] = useState<string | null>(null);

  // Selected Objects
  const selectedCpu = useMemo(() => CPU_OPTIONS.find((c) => c.id === selectedCpuId) || CPU_OPTIONS[3] || CPU_OPTIONS[0], [selectedCpuId]);
  const selectedGpu = useMemo(() => GPU_OPTIONS.find((g) => g.id === selectedGpuId) || GPU_OPTIONS[4] || GPU_OPTIONS[0], [selectedGpuId]);
  const selectedRam = useMemo(() => RAM_OPTIONS.find((r) => r.id === selectedRamId) || RAM_OPTIONS[1], [selectedRamId]);
  const selectedStorage = useMemo(() => STORAGE_OPTIONS.find((s) => s.id === selectedStorageId) || STORAGE_OPTIONS[3], [selectedStorageId]);
  const selectedPsu = useMemo(() => PSU_OPTIONS.find((p) => p.id === selectedPsuId) || PSU_OPTIONS[1], [selectedPsuId]);

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const networkOscRef = useRef<HTMLCanvasElement | null>(null);

  // Quick preset applicator wrapped in useCallback
  const applyPreset = useCallback((type: 'budget' | 'classic_bottleneck' | 'esports_pro' | 'titan' | 'vram_choke' | 'hdd_choke' | 'igpu_real') => {
    if (type === 'igpu_real') {
      setSelectedCpuId(detectedHwInfo.cpuId || 'cpu-i3-1220p');
      setSelectedGpuId(detectedHwInfo.gpuId.includes('vega') ? 'gpu-igpu-vega' : 'gpu-igpu-intel');
      setSelectedRamId(detectedHwInfo.ramId || 'ram-16gb-dual');
      setSelectedStorageId('storage-nvme-gen4');
      setSelectedPsuId('psu-400w');
      setSelectedGameType('esports');
      setGameResolution('1080p');
      setActiveProcesses(['proc-discord']);
      setDegradationMonths(0);
    } else if (type === 'budget') {
      setSelectedCpuId('cpu-n100');
      setSelectedGpuId('gpu-gtx-1650');
      setSelectedRamId('ram-16gb-dual');
      setSelectedStorageId('storage-sata-ssd');
      setSelectedPsuId('psu-400w');
      setSelectedGameType('esports');
      setGameResolution('1080p');
      setActiveProcesses(['proc-discord']);
      setDegradationMonths(0);
    } else if (type === 'classic_bottleneck') {
      setSelectedCpuId('cpu-n100');
      setSelectedGpuId('gpu-rtx-4090');
      setSelectedRamId('ram-8gb-single');
      setSelectedStorageId('storage-nvme-gen4');
      setSelectedPsuId('psu-850w');
      setSelectedGameType('aaa');
      setGameResolution('1440p');
      setActiveProcesses(['proc-chrome', 'proc-render']);
      setDegradationMonths(0);
    } else if (type === 'vram_choke') {
      setSelectedCpuId('cpu-ryzen-7800x3d');
      setSelectedGpuId('gpu-gtx-1650'); // 4GB VRAM in 4K AAA!
      setSelectedRamId('ram-16gb-dual');
      setSelectedStorageId('storage-nvme-gen4');
      setSelectedPsuId('psu-850w');
      setSelectedGameType('aaa');
      setGameResolution('4k');
      setActiveProcesses(['proc-chrome']);
      setDegradationMonths(0);
    } else if (type === 'hdd_choke') {
      setSelectedCpuId('cpu-i7-13700k');
      setSelectedGpuId('gpu-rtx-4070ti-super');
      setSelectedRamId('ram-16gb-dual');
      setSelectedStorageId('storage-hdd'); // HDD bottleneck
      setSelectedPsuId('psu-850w');
      setSelectedGameType('aaa');
      setGameResolution('1440p');
      setActiveProcesses(['proc-antivirus']);
      setDegradationMonths(0);
    } else if (type === 'esports_pro') {
      setSelectedCpuId('cpu-ryzen-7800x3d');
      setSelectedGpuId('gpu-rtx-4060');
      setSelectedRamId('ram-32gb-dual');
      setSelectedStorageId('storage-nvme-gen4');
      setSelectedPsuId('psu-850w');
      setSelectedGameType('esports');
      setGameResolution('1080p');
      setActiveProcesses([]);
      setDegradationMonths(0);
    } else if (type === 'titan') {
      setSelectedCpuId('cpu-ryzen-7950x3d');
      setSelectedGpuId('gpu-rtx-4090');
      setSelectedRamId('ram-32gb-dual');
      setSelectedStorageId('storage-nvme-gen4');
      setSelectedPsuId('psu-1200w');
      setSelectedGameType('aaa');
      setGameResolution('4k');
      setActiveProcesses(['proc-chrome', 'proc-discord']);
      setDegradationMonths(0);
    }
  }, [detectedHwInfo]);

  const toggleProcess = useCallback((procId: string) => {
    setActiveProcesses((prev) =>
      prev.includes(procId) ? prev.filter((id) => id !== procId) : [...prev, procId]
    );
  }, []);

  const handlePerformMaintenance = useCallback(() => {
    setDegradationMonths(0);
    setMaintenanceCelebration(true);
    setTimeout(() => setMaintenanceCelebration(false), 3500);
  }, []);

  // EVOMaX PC Quick Fix Execution wrapped in useCallback
  const handleQuickFixFromCopilot = useCallback((target: string) => {
    if (target === 'psu') {
      setSelectedPsuId('psu-850w');
    } else if (target === 'ram') {
      setSelectedRamId('ram-32gb-dual');
    } else if (target === 'storage') {
      setSelectedStorageId('storage-nvme-gen4');
    } else if (target === 'cpu') {
      setSelectedCpuId('cpu-ryzen-7800x3d');
    } else if (target === 'gpu') {
      setSelectedGpuId('gpu-rtx-4060');
    } else if (target === 'maintenance') {
      handlePerformMaintenance();
    }
  }, [handlePerformMaintenance]);

  // =========================================================================
  // PERSISTENT EVOMaX PC COPILOT DIAGNOSIS (CONDITIONAL ANALYSIS ENGINE)
  // =========================================================================
  const evoMaxDiagnosis = useMemo(() => {
    return analyzeSystemStateConditional({
      cpu: selectedCpu,
      gpu: selectedGpu,
      ram: selectedRam,
      storage: selectedStorage,
      psu: selectedPsu,
      activeProcesses,
      gameType: selectedGameType,
      resolution: gameResolution,
      degradationMonths,
      xmpEnabled,
      casLatency,
      cpuUndervoltMv,
      mousePollingRate,
      monitorRefreshRate,
      networkType,
    });
  }, [
    selectedCpu,
    selectedGpu,
    selectedRam,
    selectedStorage,
    selectedPsu,
    activeProcesses,
    selectedGameType,
    gameResolution,
    degradationMonths,
    xmpEnabled,
    casLatency,
    cpuUndervoltMv,
    mousePollingRate,
    monitorRefreshRate,
    networkType,
  ]);

  // Power metrics
  const powerMetrics = useMemo(() => {
    const motherboardAndPeripheralsWatts = 55;
    const totalWattsRequired = selectedCpu.powerWatts + selectedGpu.powerWatts + motherboardAndPeripheralsWatts;
    const psuCapacityWatts = selectedPsu.watts;
    const isPowerExceeded = totalWattsRequired > psuCapacityWatts;
    const powerLoadPercent = Math.round((totalWattsRequired / psuCapacityWatts) * 100);

    return {
      totalWattsRequired,
      psuCapacityWatts,
      isPowerExceeded,
      powerLoadPercent,
      deficitWatts: Math.max(0, totalWattsRequired - psuCapacityWatts),
    };
  }, [selectedCpu, selectedGpu, selectedPsu]);

  // Windows Task Manager & Background Load
  const windowsMetrics = useMemo(() => {
    let backgroundCpuPercent = 4;
    let backgroundRamGb = 3.2;
    let backgroundVramGb = 0.4;
    let backgroundIoPercent = 2;

    activeProcesses.forEach((pId) => {
      const proc = AVAILABLE_PROCESSES.find((p) => p.id === pId);
      if (proc) {
        const cpuScaling = selectedCpu.multiTaskScore / 100;
        backgroundCpuPercent += Math.max(2, proc.cpuImpactPercent * (1.4 - cpuScaling * 0.6));
        backgroundRamGb += proc.ramImpactGb;
        backgroundVramGb += proc.vramImpactGb;
        backgroundIoPercent += proc.ioDemandPercent;
      }
    });

    const totalRamInstalled = selectedRam.sizeGb;
    const isRamThrashing = backgroundRamGb > totalRamInstalled * 0.85;
    const ramUsagePercent = Math.min(100, Math.round((backgroundRamGb / totalRamInstalled) * 100));

    return {
      backgroundCpuPercent: Math.min(95, Math.round(backgroundCpuPercent)),
      backgroundRamGb: +backgroundRamGb.toFixed(1),
      backgroundVramGb: +backgroundVramGb.toFixed(1),
      backgroundIoPercent: Math.min(100, backgroundIoPercent),
      totalRamInstalled,
      isRamThrashing,
      ramUsagePercent,
    };
  }, [activeProcesses, selectedCpu, selectedRam]);

  // Thermodynamic degradation
  const thermalDegradation = useMemo(() => {
    const degradationRatio = 1 + (degradationMonths / 60) * 0.45;
    const dustPenaltyC = +(degradationMonths * 0.28).toFixed(1);

    return {
      months: degradationMonths,
      degradationRatio,
      dustPenaltyC,
      pasteState:
        degradationMonths < 12
          ? 'Óptima (Fresca)'
          : degradationMonths < 30
          ? 'Envejecida (Micro-fisuras)'
          : 'Cristalizada (Pump-out Severo)',
    };
  }, [degradationMonths]);

  // Telemetry Engine (Metrology & Latency & Network)
  const telemetry = useMemo(() => {
    // Network Metrology
    let networkPingMs = 6;
    let networkJitterMs = 1;
    let packetLossPercent = 0.0;
    let bufferbloatGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'A+';
    let isNetworkSaturated = false;

    if (networkType === 'fiber_ethernet') {
      networkPingMs = 6;
      networkJitterMs = 1;
      packetLossPercent = 0.0;
      bufferbloatGrade = 'A+';
    } else if (networkType === 'wifi_6e') {
      networkPingMs = 14;
      networkJitterMs = 3;
      packetLossPercent = 0.1;
      bufferbloatGrade = 'A';
    } else if (networkType === 'wifi_24ghz_congested') {
      networkPingMs = 195;
      networkJitterMs = 48;
      packetLossPercent = 7.5;
      bufferbloatGrade = 'F';
      isNetworkSaturated = true;
    } else if (networkType === 'lte_mobile') {
      networkPingMs = 52;
      networkJitterMs = 16;
      packetLossPercent = 2.0;
      bufferbloatGrade = 'C';
    }

    if (powerMetrics.isPowerExceeded) {
      return {
        isShutdown: true,
        isThrottling: false,
        fpsAvg: 0,
        fps1Low: 0,
        frametimeMs: 0,
        gpuUsagePercent: 0,
        cpuUsagePercent: 0,
        ramUsagePercent: 0,
        vramUsagePercent: 0,
        diskIoPercent: 0,
        cpuTempC: 30,
        gpuTempC: 30,
        ramUsedGb: 0,
        vramUsedGb: 0,
        bottleneckType: 'POWER_CRASH' as const,
        mouseLatencyMs: +(1000 / mousePollingRate).toFixed(2),
        renderLatencyMs: 0,
        displayLatencyMs: +(1000 / monitorRefreshRate).toFixed(2),
        dwmDesyncPenaltyMs: 0,
        totalSystemLatencyMs: 0,
        hasDpcOverload: false,
        networkPingMs,
        networkJitterMs,
        packetLossPercent,
        bufferbloatGrade,
        isNetworkSaturated,
        xmpActive: xmpEnabled,
        casLatencyApplied: casLatency,
        cpuUndervoltAppliedMv: cpuUndervoltMv,
        thermalReductionC: 0,
      };
    }

    const is4k = gameResolution === '4k';
    const is1440p = gameResolution === '1440p';

    const gameVramDemandGb = selectedGameType === 'aaa' ? (is4k ? 14.8 : is1440p ? 9.8 : 7.2) : (is4k ? 5.2 : 3.4);
    const totalVramDemanded = +(gameVramDemandGb + windowsMetrics.backgroundVramGb).toFixed(1);
    const isVramSaturated = totalVramDemanded > selectedGpu.vramGb;

    const gameRamDemandGb = selectedGameType === 'aaa' ? 12.5 : 6.0;
    const totalRamDemanded = +(gameRamDemandGb + windowsMetrics.backgroundRamGb).toFixed(1);
    const isRamSaturated = totalRamDemanded > selectedRam.sizeGb;

    const isStorageSaturated =
      (selectedStorage.type === 'hdd' || selectedStorage.type === 'sata') &&
      (selectedGameType === 'aaa' || activeProcesses.includes('proc-render') || activeProcesses.includes('proc-antivirus'));

    let baseGpuFps = 60;
    if (selectedGameType === 'esports') {
      // RECALIBRACIÓN MATEMÁTICA PARA IGPU:
      if (selectedGpu.tier === 'igpu') baseGpuFps = is4k ? 16 : is1440p ? 42 : 84;
      else if (selectedGpu.tier === 'esports') baseGpuFps = is4k ? 65 : is1440p ? 120 : 180;
      else if (selectedGpu.tier === 'media') baseGpuFps = is4k ? 130 : is1440p ? 240 : 360;
      else if (selectedGpu.tier === 'alta') baseGpuFps = is4k ? 220 : is1440p ? 380 : 500;
      else if (selectedGpu.tier === '4k') baseGpuFps = is4k ? 340 : is1440p ? 520 : 650;
    } else {
      if (selectedGpu.tier === 'igpu') baseGpuFps = is4k ? 4 : is1440p ? 9 : 18;
      else if (selectedGpu.tier === 'esports') baseGpuFps = is4k ? 12 : is1440p ? 28 : 45;
      else if (selectedGpu.tier === 'media') baseGpuFps = is4k ? 32 : is1440p ? 62 : 88;
      else if (selectedGpu.tier === 'alta') baseGpuFps = is4k ? 68 : is1440p ? 115 : 155;
      else if (selectedGpu.tier === '4k') baseGpuFps = is4k ? 115 : is1440p ? 165 : 210;
    }

    let maxCpuFps = selectedGameType === 'esports' ? selectedCpu.gamingPowerScore * 4.8 : selectedCpu.gamingPowerScore * 2.2 + 30;
    
    // Impact of XMP on CPU limit: If disabled, JEDEC limits cache throughput
    if (!xmpEnabled) {
      maxCpuFps *= 0.86;
    }

    const availableCpuRatio = Math.max(0.2, (100 - windowsMetrics.backgroundCpuPercent) / 100);
    let effectiveCpuMaxFps = maxCpuFps * availableCpuRatio;

    // Undervolt thermal reduction (0 to -30mV reduces 0 to ~7.5°C)
    const undervoltDiscountC = Math.round(Math.abs(cpuUndervoltMv) * 0.25);

    // Mouse Polling Rate DPC Interrupt Overhead
    const hasDpcOverload = mousePollingRate >= 4000 && selectedCpu.tier === 'baja';
    const dpcCpuLoadPenalty = hasDpcOverload ? 18 : 0;

    const baseCpuUsage = Math.min(98, Math.round(windowsMetrics.backgroundCpuPercent + dpcCpuLoadPenalty + (baseGpuFps / maxCpuFps) * 50));
    let rawCpuTemp = Math.max(
      32,
      Math.round(
        (40 + (baseCpuUsage / 100) * (selectedCpu.powerWatts > 150 ? 44 : 32)) * thermalDegradation.degradationRatio +
          thermalDegradation.dustPenaltyC -
          undervoltDiscountC
      )
    );
    let rawGpuTemp = Math.round((36 + (98 / 100) * (selectedGpu.powerWatts > 300 ? 38 : 28)) * (1 + (degradationMonths / 60) * 0.35) + thermalDegradation.dustPenaltyC);

    const isCpuThrottling = rawCpuTemp >= 95;
    const isGpuThrottling = rawGpuTemp >= 88;
    const isThrottling = isCpuThrottling || isGpuThrottling;

    if (isCpuThrottling) {
      effectiveCpuMaxFps *= 0.55;
      rawCpuTemp = 96;
    }
    if (isGpuThrottling) {
      baseGpuFps *= 0.62;
      rawGpuTemp = 89;
    }

    let bottleneckType: 'POWER_CRASH' | 'RAM_SATURATION' | 'STORAGE_IO' | 'CPU_BOUND' | 'VRAM_SATURATION' | 'IGPU_BOTTLENECK' | 'THERMAL' | 'BALANCED' = 'BALANCED';
    let finalFpsAvg = baseGpuFps;
    let gpuUsagePercent = 98;
    let cpuUsagePercent = baseCpuUsage;
    let diskIoPercent = selectedStorage.type === 'hdd' ? (isStorageSaturated ? 100 : 65) : selectedStorage.type === 'sata' ? (isStorageSaturated ? 98 : 40) : 15;

    if (isThrottling) {
      bottleneckType = 'THERMAL';
      finalFpsAvg = Math.min(baseGpuFps, effectiveCpuMaxFps);
      gpuUsagePercent = isCpuThrottling ? 52 : 98;
    } else if (isRamSaturated) {
      bottleneckType = 'RAM_SATURATION';
      const overflowRatio = totalRamDemanded / selectedRam.sizeGb;
      finalFpsAvg = Math.max(12, Math.round(baseGpuFps * (1 / overflowRatio)));
      diskIoPercent = 100;
    } else if (isStorageSaturated && selectedStorage.type === 'hdd') {
      bottleneckType = 'STORAGE_IO';
      finalFpsAvg = Math.round(baseGpuFps * 0.75);
      diskIoPercent = 100;
    } else if (isVramSaturated && selectedGpu.tier !== 'igpu') {
      bottleneckType = 'VRAM_SATURATION';
      finalFpsAvg = Math.max(8, Math.round(baseGpuFps * (selectedGpu.vramGb / totalVramDemanded)));
      gpuUsagePercent = 60;
    } else if (selectedGpu.tier === 'igpu' || selectedGpu.id === 'gpu-igpu') {
      bottleneckType = 'IGPU_BOTTLENECK';
      finalFpsAvg = baseGpuFps;
      gpuUsagePercent = 99;
      cpuUsagePercent = Math.min(65, Math.round(windowsMetrics.backgroundCpuPercent + 22 + dpcCpuLoadPenalty));
    } else if (effectiveCpuMaxFps < baseGpuFps * 0.85) {
      bottleneckType = 'CPU_BOUND';
      finalFpsAvg = Math.round(effectiveCpuMaxFps);
      gpuUsagePercent = Math.max(25, Math.round((effectiveCpuMaxFps / baseGpuFps) * 98));
      cpuUsagePercent = Math.min(100, Math.round(windowsMetrics.backgroundCpuPercent + 80 + dpcCpuLoadPenalty));
    } else {
      bottleneckType = 'BALANCED';
      gpuUsagePercent = 98;
    }

    if (selectedRam.channels === 'single') {
      finalFpsAvg = Math.round(finalFpsAvg * 0.84);
    }

    // Impact of CAS latency micro-tuning (CL30 gives +3%, CL46 gives -6%)
    const casFactor = 1 - (casLatency - 36) * 0.005;
    finalFpsAvg = Math.max(5, Math.round(finalFpsAvg * casFactor));

    let fps1Low = Math.round(finalFpsAvg * 0.82);

    // XMP/EXPO Impact on 1% Low
    if (xmpEnabled) {
      fps1Low = Math.round(fps1Low * 1.15); // +15% 1% Low boost on XMP
    } else {
      fps1Low = Math.round(fps1Low * 0.80); // -20% JEDEC penalty
    }

    // DPC Overhead penalty on 1% Low
    if (hasDpcOverload) {
      fps1Low = Math.max(3, Math.round(fps1Low * 0.65));
    }

    if (bottleneckType === 'RAM_SATURATION') {
      fps1Low = 4;
    } else if (bottleneckType === 'STORAGE_IO') {
      fps1Low = 8;
    } else if (bottleneckType === 'VRAM_SATURATION') {
      fps1Low = 9;
    } else if (bottleneckType === 'IGPU_BOTTLENECK') {
      fps1Low = Math.max(16, Math.min(45, Math.round(finalFpsAvg * 0.44)));
      if (selectedRam.channels === 'single') {
        fps1Low = Math.max(10, Math.round(fps1Low * 0.72));
      }
    } else if (bottleneckType === 'CPU_BOUND') {
      fps1Low = Math.max(6, Math.round(finalFpsAvg * 0.45));
    } else if (bottleneckType === 'THERMAL') {
      fps1Low = Math.max(5, Math.round(finalFpsAvg * 0.28));
    }

    const frametimeMs = +(1000 / Math.max(1, finalFpsAvg)).toFixed(1);
    const totalRamUsed = Math.min(selectedRam.sizeGb, totalRamDemanded);
    const totalVramUsed = Math.min(selectedGpu.vramGb, totalVramDemanded);

    const ramUsagePercent = Math.min(100, Math.round((totalRamDemanded / selectedRam.sizeGb) * 100));
    const vramUsagePercent = Math.min(100, Math.round((totalVramDemanded / selectedGpu.vramGb) * 100));

    // End-to-End Click-to-Photon Latency Pipeline
    const mouseLatencyMs = +(1000 / mousePollingRate).toFixed(2);
    const renderLatencyMs = +frametimeMs;
    const displayLatencyMs = +(1000 / monitorRefreshRate).toFixed(2);
    // DWM & Judder Desync penalty if FPS << Hz
    const dwmDesyncPenaltyMs =
      finalFpsAvg < monitorRefreshRate * 0.65
        ? +(Math.max(1.2, (monitorRefreshRate / Math.max(1, finalFpsAvg)) * 2.1)).toFixed(1)
        : 0;
    const totalSystemLatencyMs = +(
      +mouseLatencyMs +
      +renderLatencyMs +
      +displayLatencyMs +
      +dwmDesyncPenaltyMs
    ).toFixed(1);

    return {
      isShutdown: false,
      isThrottling,
      fpsAvg: finalFpsAvg,
      fps1Low,
      frametimeMs,
      gpuUsagePercent,
      cpuUsagePercent,
      ramUsagePercent,
      vramUsagePercent,
      diskIoPercent,
      cpuTempC: rawCpuTemp,
      gpuTempC: rawGpuTemp,
      ramUsedGb: totalRamUsed,
      vramUsedGb: totalVramUsed,
      bottleneckType,
      mouseLatencyMs,
      renderLatencyMs,
      displayLatencyMs,
      dwmDesyncPenaltyMs,
      totalSystemLatencyMs,
      hasDpcOverload,
      networkPingMs,
      networkJitterMs,
      packetLossPercent,
      bufferbloatGrade,
      isNetworkSaturated,
      xmpActive: xmpEnabled,
      casLatencyApplied: casLatency,
      cpuUndervoltAppliedMv: cpuUndervoltMv,
      thermalReductionC: undervoltDiscountC,
    };
  }, [
    powerMetrics,
    gameResolution,
    selectedGameType,
    windowsMetrics,
    selectedGpu,
    selectedRam,
    selectedStorage,
    selectedCpu,
    thermalDegradation,
    degradationMonths,
    activeProcesses,
    xmpEnabled,
    casLatency,
    cpuUndervoltMv,
    mousePollingRate,
    monitorRefreshRate,
    networkType,
  ]);

  // ROI Engine
  const roiCalculations = useMemo(() => {
    const currentFps = Math.max(1, telemetry.fpsAvg);
    const targetCpu = CPU_OPTIONS.find((c) => c.id === 'cpu-ryzen-7800x3d') || CPU_OPTIONS[5] || CPU_OPTIONS[0];
    const cpuUpgradeCost = Math.max(50, targetCpu.priceUsd - selectedCpu.priceUsd);

    let projectedFpsWithCpu = currentFps;
    if (telemetry.bottleneckType === 'CPU_BOUND') {
      projectedFpsWithCpu = Math.round(currentFps * (targetCpu.gamingPowerScore / Math.max(1, selectedCpu.gamingPowerScore)) * 0.95);
    } else {
      projectedFpsWithCpu = Math.round(currentFps * 1.05);
    }
    const cpuFpsGained = Math.max(1, projectedFpsWithCpu - currentFps);
    const cpuCostPerFps = +(cpuUpgradeCost / cpuFpsGained).toFixed(1);

    const targetGpu = GPU_OPTIONS.find((g) => g.id === 'gpu-rtx-4070ti-super') || GPU_OPTIONS[5] || GPU_OPTIONS[0];
    const gpuUpgradeCost = Math.max(100, targetGpu.priceUsd - selectedGpu.priceUsd);

    let projectedFpsWithGpu = currentFps;
    if (telemetry.bottleneckType === 'CPU_BOUND') {
      projectedFpsWithGpu = Math.round(currentFps * 1.03);
    } else {
      projectedFpsWithGpu = Math.round(currentFps * (targetGpu.gamingPowerScore / Math.max(1, selectedGpu.gamingPowerScore)) * 0.9);
    }
    const gpuFpsGained = Math.max(1, projectedFpsWithGpu - currentFps);
    const gpuCostPerFps = +(gpuUpgradeCost / gpuFpsGained).toFixed(1);

    const isCpuUpgradeSmarter = telemetry.bottleneckType === 'CPU_BOUND' || telemetry.bottleneckType === 'RAM_SATURATION';

    return {
      currentFps,
      cpuUpgradeCost,
      cpuFpsGained,
      cpuCostPerFps,
      projectedFpsWithCpu,
      gpuUpgradeCost,
      gpuFpsGained,
      gpuCostPerFps,
      projectedFpsWithGpu,
      isCpuUpgradeSmarter,
    };
  }, [telemetry, selectedCpu, selectedGpu]);

  // Canvas Viewport Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const stars: { x: number; y: number; z: number; speed: number; color: string }[] = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * 800 - 400,
        y: Math.random() * 450 - 225,
        z: Math.random() * 800 + 1,
        speed: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '#00d2ff' : i % 5 === 0 ? '#f59e0b' : '#ffffff',
      });
    }

    const render = () => {
      frameCount++;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 380);

      if (telemetry.isShutdown) {
        ctx.fillStyle = '#050507';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ [POWER SURGE / OPP CRASH] APAGÓN DE EMERGENCIA', width / 2, height / 2 - 15);
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '12px sans-serif';
        ctx.fillText('La fuente de poder no soportó el pico eléctrico de los componentes.', width / 2, height / 2 + 15);
        animId = requestAnimationFrame(render);
        return;
      }

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(1, '#090d1a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.65;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.15)';
      ctx.lineWidth = 1;

      for (let x = -width; x <= width * 2; x += 40) {
        ctx.beginPath();
        ctx.moveTo(cx + (x - cx) * 0.1, cy);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      const speedMultiplier = Math.max(0.2, telemetry.fpsAvg / 60);
      stars.forEach((s) => {
        s.z -= s.speed * speedMultiplier;
        if (s.z <= 0) {
          s.z = 800;
          s.x = Math.random() * width - width / 2;
          s.y = Math.random() * height - height / 2;
        }

        const k = 250 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy - 40;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(1, (1 - s.z / 800) * 3.5);
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.strokeStyle = telemetry.isThrottling ? 'rgba(239, 68, 68, 0.7)' : 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 1.5;
      
      // Rubberbanding / Network desync visual displacement
      let crosshairX = cx;
      if (telemetry.packetLossPercent > 0 && frameCount % 12 < 4) {
        crosshairX += (Math.random() - 0.5) * 28;
      }
      if (telemetry.hasDpcOverload && frameCount % 7 === 0) {
        crosshairX += (Math.random() - 0.5) * 14;
      }

      ctx.beginPath();
      ctx.arc(crosshairX, cy - 40, 22, 0, Math.PI * 2);
      ctx.stroke();

      if (telemetry.bottleneckType === 'RAM_SATURATION' && frameCount % 8 === 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.fillRect(0, 0, width, height);
      } else if (telemetry.isThrottling && frameCount % 12 === 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.fillRect(0, 0, width, height);
      } else if (telemetry.bottleneckType === 'STORAGE_IO' && frameCount % 20 === 0) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.fillRect(0, 0, width, height);
      } else if (telemetry.packetLossPercent > 0 && frameCount % 18 === 0) {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.fillRect(0, 0, width, height);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [telemetry]);

  // Network Oscilloscope Canvas Animation Loop
  useEffect(() => {
    const canvas = networkOscRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let packetTick = 0;
    const history: { ping: number; isLost: boolean }[] = [];
    const maxHistory = 40;

    for (let i = 0; i < maxHistory; i++) {
      history.push({ ping: telemetry.networkPingMs, isLost: false });
    }

    const renderOsc = () => {
      packetTick++;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 150);

      // Shift history on packet intervals
      if (packetTick % 6 === 0) {
        history.shift();
        const jitter = (Math.random() - 0.5) * 2 * telemetry.networkJitterMs;
        const isLost = Math.random() * 100 < telemetry.packetLossPercent;
        const currentPing = isLost ? 0 : Math.max(2, Math.round(telemetry.networkPingMs + jitter));
        history.push({ ping: currentPing, isLost });
      }

      // Background
      ctx.fillStyle = '#06080d';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 20; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Ping curve
      const step = width / (maxHistory - 1);
      ctx.beginPath();
      let first = true;

      for (let i = 0; i < history.length; i++) {
        const item = history[i];
        const x = i * step;
        const normY = Math.max(12, Math.min(height - 12, height - 18 - (item.ping / 240) * (height - 35)));

        if (item.isLost) {
          if (!first) ctx.lineTo(x, height - 8);
        } else {
          if (first) {
            ctx.moveTo(x, normY);
            first = false;
          } else {
            ctx.lineTo(x, normY);
          }
        }
      }

      ctx.strokeStyle = telemetry.packetLossPercent > 0 ? '#f43f5e' : telemetry.networkPingMs < 20 ? '#10b981' : '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = telemetry.packetLossPercent > 0 ? 'rgba(244, 63, 94, 0.8)' : 'rgba(6, 182, 212, 0.6)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Red packet loss dots
      for (let i = 0; i < history.length; i++) {
        if (history[i].isLost) {
          const x = i * step;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(x, height - 10, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(renderOsc);
    };

    renderOsc();
    return () => cancelAnimationFrame(animId);
  }, [telemetry.networkPingMs, telemetry.networkJitterMs, telemetry.packetLossPercent, gamingSubTab]);

  if (viewMode === 'single_truth') {
    return (
      <EvoSingleTruthSurface
        passport={passport}
        onSwitchToDeepDive={() => setViewMode('deep_dive')}
      />
    );
  }

  return (
    <div className="space-y-6 text-zinc-100 font-sans-editorial select-none">
      {/* ==================================================================== */}
      {/* MASTER TOP HEADER & QUICK PRESET DECK                                */}
      {/* ==================================================================== */}
      <div className="p-6 rounded-2xl bg-[#080a0d] border border-amber-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-cyan-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono-tech font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 tracking-wider uppercase">
                MOTOR DE TRIAGE METROLÓGICO EVO
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-tech bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                EVOMaX PC // COPILOT PERSISTENTE
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-tech bg-purple-400/10 text-purple-300 border border-purple-400/30">
                MÁQUINA DEL TIEMPO (DEGRADACIÓN)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight flex items-center gap-2">
              <span>EL SIMULADOR DEFINITIVO EVO</span>
              <span className="text-amber-400">//</span>
              <span className="text-zinc-400 text-sm font-normal font-mono-tech">EVOMaX PC COPILOT & TRIAGE</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              El asistente inteligente <strong className="text-amber-300">EVOMaX PC Copilot</strong> compara constantemente el estado del silicio y emite advertencias condicionales sobre <strong className="text-rose-400">Energía (OPP)</strong>, <strong className="text-amber-400">RAM</strong>, <strong className="text-cyan-400">CPU</strong>, <strong className="text-emerald-400">VRAM</strong> y <strong className="text-purple-400">Disco</strong> con soluciones en un solo clic.
            </p>
          </div>

          {/* Quick Learning Presets */}
          <div className="flex flex-col gap-1.5 shrink-0 bg-black/60 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-[10px] font-mono-tech font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CASOS DE PRUEBA EN VIVO:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('igpu_real')}
                className="px-2.5 py-1 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 text-[10px] font-mono-tech text-purple-200 border border-purple-400/50 text-left transition-all cursor-pointer font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]"
              >
                💻 Mi PC Real (iGPU)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('budget')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono-tech text-zinc-300 border border-zinc-700/60 text-left transition-all cursor-pointer"
              >
                🎮 PC Entrada (dGPU)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('classic_bottleneck')}
                className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-[10px] font-mono-tech text-rose-300 border border-rose-500/40 text-left transition-all cursor-pointer"
              >
                ⚠️ Cuello CPU
              </button>
              <button
                type="button"
                onClick={() => applyPreset('vram_choke')}
                className="px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-[10px] font-mono-tech text-amber-300 border border-amber-500/40 text-left transition-all cursor-pointer"
              >
                🎨 VRAM Saturada
              </button>
              <button
                type="button"
                onClick={() => applyPreset('hdd_choke')}
                className="px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-[10px] font-mono-tech text-purple-300 border border-purple-500/40 text-left transition-all cursor-pointer"
              >
                📦 HDD Lento
              </button>
              <button
                type="button"
                onClick={() => applyPreset('esports_pro')}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-[10px] font-mono-tech text-cyan-300 border border-cyan-500/40 text-left transition-all cursor-pointer"
              >
                ⚡ eSports Pro
              </button>
              <button
                type="button"
                onClick={() => applyPreset('titan')}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-[10px] font-mono-tech text-emerald-300 border border-emerald-500/40 text-left transition-all cursor-pointer"
              >
                👑 Titán 4K
              </button>
            </div>
          </div>
        </div>

        {/* 3 Step Navigation Tabs & View Mode Switcher */}
        <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveStep('assembler')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 'assembler'
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>1. EL ENSAMBLADOR (HARDWARE)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('windows')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 'windows'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>2. WINDOWS VIRTUAL ({activeProcesses.length} TAREAS)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('gaming')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 'gaming'
                  ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>3. SIMULADOR DE JUEGOS ({telemetry.fpsAvg} FPS OSD)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setViewMode('single_truth')}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-400/50 text-xs font-mono-tech font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>SUPERFICIE DE VERDAD ÚNICA</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRoiModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-transparent hover:from-emerald-400 hover:to-amber-400 text-emerald-300 hover:text-black border border-emerald-400/50 text-xs font-mono-tech font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>ANALIZAR INVERSIÓN (ROI / FPS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* PERSISTENT EVOMaX PC COPILOT HUD & REAL-TIME TRIAGE BAR              */}
      {/* ==================================================================== */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${
        evoMaxDiagnosis.status === 'CRITICAL'
          ? 'bg-[#180507] border-rose-500/90 shadow-[0_0_35px_rgba(239,68,68,0.35)] ring-1 ring-rose-500'
          : evoMaxDiagnosis.status === 'WARNING'
          ? 'bg-[#140e06] border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
          : evoMaxDiagnosis.status === 'THERMAL'
          ? 'bg-[#170c06] border-orange-500/80 shadow-[0_0_25px_rgba(249,115,22,0.25)]'
          : 'bg-[#070d14] border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 flex-1">
            {/* Robot Copilot Avatar */}
            <div className={`p-3 rounded-2xl border shrink-0 ${
              evoMaxDiagnosis.status === 'CRITICAL'
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 animate-bounce'
                : evoMaxDiagnosis.status === 'WARNING'
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                : evoMaxDiagnosis.status === 'THERMAL'
                ? 'bg-orange-500/20 border-orange-500/60 text-orange-400 animate-pulse'
                : 'bg-cyan-500/20 border-cyan-500/60 text-cyan-400'
            }`}>
              <Bot className="w-7 h-7" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono-tech font-black text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>EVOMaX PC // COPILOT PERSISTENTE EN TIEMPO REAL</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono-tech font-black uppercase ${
                  evoMaxDiagnosis.status === 'CRITICAL'
                    ? 'bg-rose-500 text-black font-black animate-pulse'
                    : evoMaxDiagnosis.status === 'WARNING'
                    ? 'bg-amber-400 text-black font-bold'
                    : evoMaxDiagnosis.status === 'THERMAL'
                    ? 'bg-orange-500 text-black font-bold'
                    : 'bg-emerald-500 text-black font-bold'
                }`}>
                  {evoMaxDiagnosis.title}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-black/50 px-2 py-0.5 rounded border border-zinc-800">
                  IMPACTO: <strong className="text-white">{evoMaxDiagnosis.impactScore}</strong>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-100 font-sans-editorial leading-relaxed font-semibold">
                {evoMaxDiagnosis.message}
              </p>

              <div className="text-[11px] text-zinc-300 font-mono-tech flex items-center gap-1.5 pt-0.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong className="text-amber-300">Dictamen Pericial:</strong> {evoMaxDiagnosis.recommendation}</span>
              </div>

              {/* Ticker log line */}
              <div className="text-[10px] font-mono text-zinc-400 bg-black/70 px-2.5 py-1 rounded-lg border border-zinc-800/80 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{evoMaxDiagnosis.logSummary}</span>
              </div>
            </div>
          </div>

          {/* Quick-Fix Interactive Action Button */}
          {evoMaxDiagnosis.targetComponent !== 'none' && (
            <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2 bg-black/60 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase tracking-wider text-left sm:text-right">
                ACCIÓN CORRECTIVA SUGERIDA:
              </span>
              <button
                type="button"
                onClick={() => handleQuickFixFromCopilot(evoMaxDiagnosis.targetComponent)}
                className={`px-4 py-2 rounded-xl font-mono-tech font-bold text-xs uppercase cursor-pointer transition-all shadow-lg flex items-center justify-center gap-2 ${
                  evoMaxDiagnosis.status === 'CRITICAL'
                    ? 'bg-rose-500 hover:bg-rose-400 text-black shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
                    : evoMaxDiagnosis.status === 'THERMAL'
                    ? 'bg-orange-400 hover:bg-orange-300 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                    : 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>[ ⚡ {evoMaxDiagnosis.quickFixActionText} ]</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* RADIOGRAFÍA DE SISTEMA (5 BARRAS DE SATURACIÓN EN TIEMPO REAL)        */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10] border border-zinc-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono-tech font-bold text-white uppercase tracking-wider">
              RADIOGRAFÍA DE SISTEMA // MONITOREO DE SATURACIÓN DE RECURSOS (TRIAGE)
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            ALERTA ROJA SI UNA BARRA SUPERA EL 95%
          </span>
        </div>

        {/* 5 Saturation Progress Bars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* 1. CPU LOAD */}
          <div className={`p-3 rounded-xl border transition-all ${
            telemetry.cpuUsagePercent >= 95
              ? 'bg-rose-950/40 border-rose-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'bg-black/60 border-zinc-800'
          }`}>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-zinc-400 flex items-center gap-1 font-bold">
                <Cpu className="w-3 h-3 text-amber-400" />
                <span>CPU LOAD</span>
              </span>
              <span className={telemetry.cpuUsagePercent >= 95 ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                {telemetry.cpuUsagePercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  telemetry.cpuUsagePercent >= 95 ? 'bg-rose-500' : 'bg-amber-400'
                }`}
                style={{ width: `${telemetry.cpuUsagePercent}%` }}
              />
            </div>
            <div className="text-[9px] font-mono text-zinc-500 mt-1 flex justify-between">
              <span>{selectedCpu.cores.split('/')[0]}</span>
              <span>{telemetry.cpuTempC}°C</span>
            </div>
          </div>

          {/* 2. GPU LOAD */}
          <div className={`p-3 rounded-xl border transition-all ${
            telemetry.gpuUsagePercent >= 95 && telemetry.bottleneckType === 'BALANCED'
              ? 'bg-emerald-950/30 border-emerald-500/60'
              : telemetry.gpuUsagePercent < 70
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-black/60 border-zinc-800'
          }`}>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-zinc-400 flex items-center gap-1 font-bold">
                <Monitor className="w-3 h-3 text-cyan-400" />
                <span>GPU LOAD</span>
              </span>
              <span className="text-cyan-400 font-bold">{telemetry.gpuUsagePercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  telemetry.gpuUsagePercent < 70 ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${telemetry.gpuUsagePercent}%` }}
              />
            </div>
            <div className="text-[9px] font-mono text-zinc-500 mt-1 flex justify-between">
              <span>{telemetry.gpuUsagePercent >= 95 ? 'SANO (99%)' : 'DURMIENDO'}</span>
              <span>{telemetry.gpuTempC}°C</span>
            </div>
          </div>

          {/* 3. RAM USAGE */}
          <div className={`p-3 rounded-xl border transition-all ${
            telemetry.ramUsagePercent >= 95 || telemetry.bottleneckType === 'RAM_SATURATION'
              ? 'bg-rose-950/40 border-rose-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'bg-black/60 border-zinc-800'
          }`}>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-zinc-400 flex items-center gap-1 font-bold">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>RAM USAGE</span>
                {selectedGpu.tier === 'igpu' && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    -2GB iGPU
                  </span>
                )}
              </span>
              <span className={telemetry.ramUsagePercent >= 95 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {telemetry.ramUsagePercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  telemetry.ramUsagePercent >= 95 ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${telemetry.ramUsagePercent}%` }}
              />
            </div>
            <div className="text-[9px] font-mono text-zinc-500 mt-1 flex justify-between">
              <span>{telemetry.ramUsedGb} GB</span>
              <span>{selectedGpu.tier === 'igpu' ? `(${selectedRam.sizeGb} GB - búfer iGPU)` : `/ ${selectedRam.sizeGb} GB`}</span>
            </div>
          </div>

          {/* 4. VRAM USAGE (INTERFAZ DE RAM COMPARTIDA) */}
          <div className={`p-3 rounded-xl border transition-all ${
            telemetry.bottleneckType === 'IGPU_BOTTLENECK'
              ? 'bg-purple-950/40 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
              : telemetry.vramUsagePercent >= 95 || telemetry.bottleneckType === 'VRAM_SATURATION'
              ? 'bg-rose-950/40 border-rose-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'bg-black/60 border-zinc-800'
          }`}>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-zinc-400 flex items-center gap-1 font-bold">
                <Monitor className="w-3 h-3 text-purple-400" />
                <span>VRAM USAGE</span>
                {selectedGpu.tier === 'igpu' && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                    RAM COMPARTIDA
                  </span>
                )}
              </span>
              <span className={selectedGpu.tier === 'igpu' ? 'text-purple-300 font-bold' : telemetry.vramUsagePercent >= 95 ? 'text-rose-400 font-bold' : 'text-purple-400'}>
                {selectedGpu.tier === 'igpu' ? '90%' : `${telemetry.vramUsagePercent}%`}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  selectedGpu.tier === 'igpu'
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-400'
                    : telemetry.vramUsagePercent >= 95 ? 'bg-rose-500' : 'bg-purple-400'
                }`}
                style={{ width: `${selectedGpu.tier === 'igpu' ? 90 : telemetry.vramUsagePercent}%` }}
              />
            </div>
            <div className="text-[9px] font-mono text-zinc-500 mt-1 flex justify-between">
              <span>{selectedGpu.tier === 'igpu' ? '1.8 GB' : `${telemetry.vramUsedGb} GB`}</span>
              <span className={selectedGpu.tier === 'igpu' ? 'text-purple-400 font-bold' : ''}>
                {selectedGpu.tier === 'igpu' ? '[COMPARTIDA DE RAM PRINCIPAL]' : `/ ${selectedGpu.vramGb} GB`}
              </span>
            </div>
          </div>

          {/* 5. PSU POWER LOAD */}
          <div className={`p-3 rounded-xl border transition-all ${
            powerMetrics.isPowerExceeded
              ? 'bg-rose-950/50 border-rose-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              : 'bg-black/60 border-zinc-800'
          }`}>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-zinc-400 flex items-center gap-1 font-bold">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>PSU LOAD</span>
              </span>
              <span className={powerMetrics.isPowerExceeded ? 'text-rose-400 font-bold' : 'text-zinc-300'}>
                {powerMetrics.powerLoadPercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  powerMetrics.isPowerExceeded ? 'bg-rose-500' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, powerMetrics.powerLoadPercent)}%` }}
              />
            </div>
            <div className="text-[9px] font-mono text-zinc-500 mt-1 flex justify-between">
              <span>{powerMetrics.totalWattsRequired}W</span>
              <span>/ {selectedPsu.watts}W</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TIME MACHINE (DEGRADATION SLIDER)                                    */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0c12] border border-purple-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-tech font-bold text-purple-300 uppercase flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>MÁQUINA DEL TIEMPO // SIMULADOR DE ENVEJECIMIENTO FÍSICO (0 A 60 MESES)</span>
          </span>
          <button
            type="button"
            onClick={() => setActiveTooltipKey('thermal_throttling')}
            className="text-[10px] text-zinc-400 hover:text-purple-300 font-mono flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>¿Qué es Throttling?</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300 font-bold">Tiempo de uso continuo:</span>
            <span className={`font-black ${degradationMonths > 36 ? 'text-rose-400' : degradationMonths > 18 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {degradationMonths === 0 ? 'NUEVO (0 MESES)' : `${degradationMonths} MESES (${(degradationMonths / 12).toFixed(1)} AÑOS)`}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="60"
            step="3"
            value={degradationMonths}
            onChange={(e) => setDegradationMonths(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />

          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>0m (Fábrica)</span>
            <span>24m (Pasta seca)</span>
            <span>48m (Polvo crítico)</span>
            <span>60m (5 Años)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono-tech pt-1 border-t border-zinc-800/80">
          <span className="text-zinc-400">
            Estado Pasta: <strong className="text-white">{thermalDegradation.pasteState}</strong>
          </span>
          <button
            type="button"
            onClick={handlePerformMaintenance}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            Limpiar y Repastar
          </button>
        </div>

        {maintenanceCelebration && (
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
            ✨ ¡Mantenimiento completado! Pasta térmica fresca y disipador limpio. Temperaturas restauradas al 100%.
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* STAGE A: EL ENSAMBLADOR (HARDWARE & SATURATION SELECTION)            */}
      {/* ==================================================================== */}
      {activeStep === 'assembler' && (
        <div className="space-y-6">
          {detectedHwInfo.isDetected && (
            <div className="p-3 sm:p-4 rounded-xl bg-[#091512] border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono-tech font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <span>TELEMETRÍA DETECTADA (SYSTEM_REPORTED)</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      EN VIVO
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 mt-0.5">
                    GPU: <strong className="text-white">{detectedHwInfo.detectedGpuName}</strong> • CPU: <strong className="text-white">{detectedHwInfo.detectedCpuName}</strong> • RAM: <strong className="text-white">{detectedHwInfo.detectedRamGb} GB</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCpuId(detectedHwInfo.cpuId);
                  setSelectedGpuId(detectedHwInfo.gpuId);
                  setSelectedRamId(detectedHwInfo.ramId);
                  setSelectedStorageId(detectedHwInfo.storageId);
                  setSelectedPsuId(detectedHwInfo.psuId);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-500/50 text-[11px] font-mono-tech font-bold transition-all cursor-pointer shrink-0"
              >
                APLICAR HARDWARE DETECTADO
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Component Selection Deck (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* CPU Selection */}
              <div className="p-4 rounded-xl bg-[#080a0d] border border-zinc-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech font-bold text-amber-400 uppercase flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>A. PROCESADOR (CPU)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTooltipKey('bottleneck')}
                    className="text-[10px] text-zinc-400 hover:text-amber-400 font-mono-tech flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>¿Cuello CPU?</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CPU_OPTIONS.map((cpu) => (
                    <button
                      key={cpu.id}
                      type="button"
                      onClick={() => setSelectedCpuId(cpu.id)}
                      className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                        selectedCpuId === cpu.id
                          ? 'bg-amber-400/10 border-amber-400 text-white shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                          : 'bg-black/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono-tech font-bold mb-1">
                          <span className={selectedCpuId === cpu.id ? 'text-amber-400' : 'text-zinc-500'}>
                            {cpu.tierLabel}
                          </span>
                          <span className="text-zinc-400">{cpu.priceEstimate}</span>
                        </div>
                        <div className="text-xs font-bold text-white font-sans">{cpu.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-1 font-mono-tech">
                          {cpu.cores} // {cpu.clockGhz} GHz // {cpu.powerWatts}W
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* GPU Selection */}
              <div className="p-4 rounded-xl bg-[#080a0d] border border-zinc-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech font-bold text-cyan-400 uppercase flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>B. PLACA DE VIDEO (GPU & VRAM)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTooltipKey('vram')}
                    className="text-[10px] text-zinc-400 hover:text-cyan-400 font-mono-tech flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>¿Saturación VRAM?</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GPU_OPTIONS.map((gpu) => (
                    <button
                      key={gpu.id}
                      type="button"
                      onClick={() => setSelectedGpuId(gpu.id)}
                      className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                        selectedGpuId === gpu.id
                          ? 'bg-cyan-400/10 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                          : 'bg-black/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono-tech font-bold mb-1">
                          <span className={selectedGpuId === gpu.id ? 'text-cyan-400' : 'text-zinc-500'}>
                            {gpu.tierLabel}
                          </span>
                          <span className="text-zinc-400">{gpu.priceEstimate}</span>
                        </div>
                        <div className="text-xs font-bold text-white font-sans">{gpu.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-1 font-mono-tech">
                          {gpu.vramGb} GB VRAM // {gpu.powerWatts}W TDP
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* RAM, Storage & PSU Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* RAM Selection */}
                <div className="p-3.5 rounded-xl bg-[#080a0d] border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech font-bold text-emerald-400 uppercase flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>C. RAM</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltipKey('ram')}
                      className="text-[10px] text-zinc-400 hover:text-emerald-400"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {RAM_OPTIONS.map((ram) => (
                      <button
                        key={ram.id}
                        type="button"
                        onClick={() => setSelectedRamId(ram.id)}
                        className={`w-full p-2 rounded-lg text-left text-[11px] transition-all cursor-pointer border ${
                          selectedRamId === ram.id
                            ? 'bg-emerald-400/15 border-emerald-400 text-white font-bold'
                            : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div>{ram.label.split('(')[0]}</div>
                        <div className="text-[9px] text-zinc-500">{ram.channels === 'single' ? '⚠️ Single Channel' : '✅ Dual Channel'}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage Selection */}
                <div className="p-3.5 rounded-xl bg-[#080a0d] border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech font-bold text-purple-400 uppercase flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>D. DISCO</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltipKey('storage_io')}
                      className="text-[10px] text-zinc-400 hover:text-purple-400"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {STORAGE_OPTIONS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStorageId(st.id)}
                        className={`w-full p-2 rounded-lg text-left text-[11px] transition-all cursor-pointer border ${
                          selectedStorageId === st.id
                            ? 'bg-purple-400/15 border-purple-400 text-white font-bold'
                            : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div>{st.label.split('(')[0]}</div>
                        <div className="text-[9px] text-zinc-500">{st.speedMbS} MB/s</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PSU Selection */}
                <div className="p-3.5 rounded-xl bg-[#080a0d] border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech font-bold text-amber-400 uppercase flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>E. FUENTE</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltipKey('opp_power')}
                      className="text-[10px] text-zinc-400 hover:text-amber-400"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {PSU_OPTIONS.map((psu) => (
                      <button
                        key={psu.id}
                        type="button"
                        onClick={() => setSelectedPsuId(psu.id)}
                        className={`w-full p-2 rounded-lg text-left text-[11px] transition-all cursor-pointer border ${
                          selectedPsuId === psu.id
                            ? 'bg-amber-400/15 border-amber-400 text-white font-bold'
                            : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div>{psu.label}</div>
                        <div className="text-[9px] text-zinc-500">{psu.rating.split(' ')[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Bottleneck Funnel Deck (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-[#080a0d] border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>DIAGNÓSTICO DEL EMBUDO</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded ${
                      telemetry.bottleneckType === 'BALANCED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : telemetry.bottleneckType === 'POWER_CRASH'
                        ? 'bg-rose-600 text-white font-black animate-pulse'
                        : 'bg-amber-500 text-black font-black animate-pulse'
                    }`}
                  >
                    {telemetry.bottleneckType}
                  </span>
                </div>

                {/* Visual Funnel Representation */}
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 space-y-3">
                  <div className="text-[11px] font-mono-tech text-zinc-400 uppercase tracking-wider">
                    FLUJO DE PROCESAMIENTO (EMBUDO DE DATOS):
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Cpu className="w-3.5 h-3.5 text-amber-400" />
                        <span>CPU (Cálculo de Físicas e Instrucciones)</span>
                      </span>
                      <span className="font-mono text-amber-400 font-bold">
                        {telemetry.cpuUsagePercent}% ({telemetry.cpuTempC}°C)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          telemetry.cpuUsagePercent >= 95 ? 'bg-rose-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${telemetry.cpuUsagePercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center text-zinc-500 text-xs font-mono">
                    ⬇️ Envío de paquetes de dibujo por PCIe ⬇️
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                        <span>GPU (Renderizado de Píxeles & VRAM)</span>
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {telemetry.gpuUsagePercent}% ({telemetry.gpuTempC}°C)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          telemetry.gpuUsagePercent < 70 ? 'bg-amber-500' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${telemetry.gpuUsagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep('windows')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>SIGUIENTE PASO: ABRIR PROGRAMAS EN WINDOWS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* STAGE B: EL WINDOWS VIRTUAL (PROCESOS Y MEMORIA)                     */}
      {/* ==================================================================== */}
      {activeStep === 'windows' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-[#080a0d] border border-cyan-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Monitor className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h2 className="text-sm font-bold font-mono-tech text-white uppercase">
                        ADMINISTRADOR DE TAREAS (WINDOWS 11)
                      </h2>
                      <span className="text-[11px] text-zinc-400">
                        Activá procesos de fondo para simular cómo saturan la CPU, la RAM y el Disco.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveProcesses([])}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono-tech text-zinc-300 border border-zinc-700 cursor-pointer"
                  >
                    CERRAR TODO
                  </button>
                </div>

                <div className="space-y-2.5">
                  {AVAILABLE_PROCESSES.map((proc) => {
                    const isActive = activeProcesses.includes(proc.id);
                    return (
                      <div
                        key={proc.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-cyan-950/20 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-black/50 border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                isActive ? 'bg-cyan-400 animate-pulse' : 'bg-zinc-600'
                              }`}
                            />
                            <span className="text-xs font-bold text-white">{proc.name}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">{proc.desc}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right font-mono-tech text-[10px] text-zinc-400">
                            <div>+{proc.cpuImpactPercent}% CPU</div>
                            <div>+{proc.ramImpactGb} GB RAM</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleProcess(proc.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-cyan-400 text-black shadow'
                                : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700'
                            }`}
                          >
                            {isActive ? 'EJECUTANDO' : 'ABRIR'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-[#080a0d] border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    <span>ESTADO DE MEMORIA & DISCO</span>
                  </span>
                  <span className="text-[10px] font-mono-tech text-zinc-400">
                    {selectedStorage.name.split('(')[0]}
                  </span>
                </div>

                <div className="space-y-1.5 p-3.5 rounded-xl bg-black/60 border border-zinc-800">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-zinc-200">RAM en uso:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {windowsMetrics.backgroundRamGb} GB / {windowsMetrics.totalRamInstalled} GB
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        windowsMetrics.isRamThrashing ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${windowsMetrics.ramUsagePercent}%` }}
                    />
                  </div>
                  {windowsMetrics.isRamThrashing && (
                    <div className="text-[11px] text-rose-400 font-bold flex items-center gap-1 pt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>¡Paginación activa! Se enviarán datos al disco rígido.</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep('gaming')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>SIGUIENTE PASO: LANZAR JUEGO (OSD)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* STAGE C: EL SIMULADOR DE JUEGOS, BIOS VIRTUAL & METROLOGÍA E-SPORTS */}
      {/* ==================================================================== */}
      {activeStep === 'gaming' && (
        <div className="space-y-6">
          {/* Sub-Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#080a0d] border border-zinc-800 shadow-xl">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex-wrap">
              <button
                type="button"
                onClick={() => setGamingSubTab('render_fps')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  gamingSubTab === 'render_fps'
                    ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>RENDER Y FPS</span>
              </button>
              <button
                type="button"
                onClick={() => setGamingSubTab('bios_memory')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  gamingSubTab === 'bios_memory'
                    ? 'bg-purple-400 text-black shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>BIOS & MEMORIA (PRO)</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-black uppercase flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 text-amber-400" /> PRO
                </span>
              </button>
              <button
                type="button"
                onClick={() => setGamingSubTab('latency_network')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  gamingSubTab === 'latency_network'
                    ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>LATENCIA & RED (PRO)</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-black uppercase flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 text-amber-400" /> PRO
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono-tech text-amber-400/90 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>ANÁLISIS PERICIAL PROFUNDO</span>
              </span>
            </div>
          </div>

          {/* SUB-PANEL 1: RENDER Y FPS (OSD) */}
          {gamingSubTab === 'render_fps' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-[#080a0d] border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono-tech font-bold text-zinc-400 uppercase">
                    CARGA DE JUEGO:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedGameType('esports')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                      selectedGameType === 'esports'
                        ? 'bg-cyan-400 text-black shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    🎯 Competitivo (CS2 / Valorant // CPU Bound)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGameType('aaa')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                      selectedGameType === 'aaa'
                        ? 'bg-amber-400 text-black shadow'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    🌆 AAA Ray Tracing (Cyberpunk // VRAM & GPU)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-tech font-bold text-zinc-400 uppercase">
                    RESOLUCIÓN:
                  </span>
                  {(['1080p', '1440p', '4k'] as const).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setGameResolution(res)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                        gameResolution === res
                          ? 'bg-emerald-400 text-black'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {res.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Canvas + Live In-Game OSD */}
              <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl bg-black">
                <canvas ref={canvasRef} className="w-full h-full block" />

                {!telemetry.isShutdown && (
                  <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-md border border-zinc-700/80 p-3.5 rounded-xl shadow-2xl font-mono text-[11px] sm:text-xs text-white space-y-1 select-none pointer-events-none min-w-[240px]">
                    {/* GPU Line */}
                    <div className="flex items-center gap-2 text-cyan-300">
                      <span className="w-8 font-bold">GPU</span>
                      <span>{telemetry.gpuTempC}°C</span>
                      <span className="font-bold text-white">{telemetry.gpuUsagePercent}%</span>
                      <span className="text-zinc-400 text-[10px]">
                        {selectedGpu.name.split(' ')[0]}
                      </span>
                    </div>

                    {/* MEM Line (VRAM / Shared RAM) */}
                    <div className={`flex items-center gap-2 ${telemetry.vramUsagePercent >= 95 ? 'text-rose-400 font-bold animate-pulse' : 'text-purple-300'}`}>
                      <span className="w-8 font-bold">MEM</span>
                      <span>{selectedGpu.tier === 'igpu' ? '1.8 GB' : `${telemetry.vramUsedGb} GB`}</span>
                      <span className="text-zinc-400 text-[10px]">
                        {selectedGpu.tier === 'igpu' ? '(RAM COMPARTIDA)' : `/ ${selectedGpu.vramGb} GB`}
                      </span>
                    </div>

                    {/* CPU Line */}
                    <div className={`flex items-center gap-2 ${telemetry.cpuTempC >= 95 ? 'text-rose-400 font-bold animate-pulse' : 'text-amber-300'}`}>
                      <span className="w-8 font-bold">CPU</span>
                      <span>{telemetry.cpuTempC}°C</span>
                      <span className="font-bold text-white">{telemetry.cpuUsagePercent}%</span>
                    </div>

                    {/* RAM Line */}
                    <div className={`flex items-center gap-2 ${telemetry.ramUsagePercent >= 95 ? 'text-rose-400 font-bold animate-pulse' : 'text-emerald-300'}`}>
                      <span className="w-8 font-bold">RAM</span>
                      <span>{telemetry.ramUsedGb} GB</span>
                      <span className="text-zinc-500 text-[10px]">/ {selectedRam.sizeGb} GB</span>
                    </div>

                    {/* D3D12 FPS Line */}
                    <div className="pt-2 border-t border-zinc-700/80 flex items-baseline justify-between gap-3">
                      <span className={`font-black text-sm sm:text-base ${telemetry.fpsAvg < 30 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {telemetry.fpsAvg} FPS
                      </span>
                      <span className={`text-[10px] font-bold ${telemetry.fps1Low <= 6 ? 'text-rose-400 animate-pulse font-black' : 'text-cyan-300'}`}>
                        1% LOW: {telemetry.fps1Low} FPS
                      </span>
                      <span className="text-zinc-400 text-[10px]">
                        {telemetry.frametimeMs} ms
                      </span>
                    </div>

                    {/* End-to-End Latency Badge */}
                    <div className="pt-1.5 border-t border-zinc-800 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400">LATENCIA TOTAL:</span>
                      <span className={`font-bold font-mono ${telemetry.totalSystemLatencyMs > 40 ? 'text-rose-400' : 'text-emerald-300'}`}>
                        {telemetry.totalSystemLatencyMs} ms
                      </span>
                    </div>

                    {/* Network Packet Loss & Disconnected WiFi Warning */}
                    {telemetry.packetLossPercent > 0 && (
                      <div className="text-[10px] text-rose-400 font-bold animate-pulse flex items-center gap-1.5 pt-0.5 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/30">
                        <WifiOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>PACKET LOSS: {telemetry.packetLossPercent}% (RUBBERBANDING)</span>
                      </div>
                    )}

                    {/* DPC Overload Warning */}
                    {telemetry.hasDpcOverload && (
                      <div className="text-[10px] text-amber-400 font-bold animate-pulse flex items-center gap-1 pt-0.5">
                        <Zap className="w-3 h-3" />
                        <span>DPC OVERLOAD ({mousePollingRate}Hz // CPU INTERRUPTS)</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom In-Game Telemetry Summary Banner */}
                <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-zinc-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        telemetry.isShutdown
                          ? 'bg-rose-600 animate-ping'
                          : telemetry.bottleneckType === 'IGPU_BOTTLENECK'
                          ? 'bg-purple-400 animate-pulse'
                          : telemetry.bottleneckType === 'RAM_SATURATION' || telemetry.bottleneckType === 'VRAM_SATURATION'
                          ? 'bg-rose-500 animate-pulse'
                          : telemetry.bottleneckType === 'CPU_BOUND'
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="font-bold text-white font-mono">
                      {telemetry.isShutdown
                        ? 'ESTADO: ¡APAGÓN POR FUENTE (OPP)!'
                        : telemetry.bottleneckType === 'IGPU_BOTTLENECK'
                        ? 'ESTADO: CUELLO DE BOTELLA GRÁFICO (iGPU) // SATURACIÓN DE VRAM COMPARTIDA'
                        : telemetry.bottleneckType === 'RAM_SATURATION'
                        ? 'ESTADO: SATURACIÓN DE RAM (SWAP A DISCO - 1% LOW EN 4 FPS)'
                        : telemetry.bottleneckType === 'STORAGE_IO'
                        ? 'ESTADO: CUELLO DE BOTELLA DE I/O EN DISCO (MICRO-STUTTERING)'
                        : telemetry.bottleneckType === 'VRAM_SATURATION'
                        ? 'ESTADO: SATURACIÓN DE VRAM (TEXTURAS DESBORDADAS)'
                        : telemetry.bottleneckType === 'CPU_BOUND'
                        ? 'ESTADO: CUELLO DE CPU (GPU OCIOSA)'
                        : 'ESTADO: FLUIDEZ PERFECTA (GPU AL 98%)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-400 text-[11px] font-mono">
                    <span>XMP: <strong className={telemetry.xmpActive ? 'text-emerald-400' : 'text-rose-400'}>{telemetry.xmpActive ? 'ON' : 'OFF'}</strong></span>
                    <span>UNDERVOLT: <strong className="text-cyan-400">{telemetry.cpuUndervoltAppliedMv} mV</strong></span>
                    <span>PING: <strong className={telemetry.networkPingMs > 100 ? 'text-rose-400' : 'text-emerald-400'}>{telemetry.networkPingMs} ms</strong></span>
                  </div>
                </div>
              </div>

              {/* AI GAME PROBE PANEL (GEMINI 3.8 FLASH METROLOGY ENGINE) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c101a] via-[#080a0e] to-zinc-950 border border-amber-500/40 shadow-2xl space-y-4 font-mono-tech">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)] shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-white text-base uppercase tracking-tight">
                          PROBAR CUALQUIER JUEGO CON IA EVO (GEMINI 3.8 FLASH)
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
                          MODELO METROLOGÍA
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed mt-0.5">
                        Elegí un juego eSports/AAA destacado o escribí cualquier título personalizado. La IA evaluará tu CPU ({selectedCpu.name}), GPU ({selectedGpu.name}), RAM ({selectedRam.label}) y Disco ({selectedStorage.name}).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Popular Game Presets */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono-tech font-bold text-zinc-400 uppercase tracking-wider block">
                    SELECCIONÁ UN TÍTULO DESTACADO O ESCRIBÍ CUALQUIER JUEGO:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Valorant', badge: '1080p eSports 540Hz Target' },
                      { name: 'Counter-Strike 2', badge: '1080p Comp' },
                      { name: 'Black Myth: Wukong', badge: 'UE5 VRAM Heavy' },
                      { name: 'Cyberpunk 2077', badge: 'Ray Tracing Ultra' },
                      { name: 'Fortnite', badge: 'UE5 Nanite/Lumen' },
                      { name: 'Apex Legends', badge: '240Hz Competitive' },
                      { name: 'Elden Ring', badge: '60 FPS Cap' },
                      { name: 'Minecraft (Shaders)', badge: 'Single Core & VRAM' },
                    ].map((g) => (
                      <button
                        key={g.name}
                        type="button"
                        onClick={() => {
                          setAiGameTitle(g.name);
                          setCustomGameInput(g.name);
                          handleRunAiBenchmark(g.name);
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono-tech transition-all cursor-pointer flex items-center gap-1.5 ${
                          customGameInput === g.name || aiGameTitle === g.name
                            ? 'bg-amber-400 text-black font-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>{g.name}</span>
                        <span className="text-[9px] opacity-75 font-normal">({g.badge})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Game Input Box */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={customGameInput}
                      onChange={(e) => setCustomGameInput(e.target.value)}
                      placeholder="Escribí cualquier juego (ej: Flight Simulator 2024, Monster Hunter Wilds, Assetto Corsa, GTA VI)..."
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 text-white rounded-xl px-4 py-2.5 text-xs font-mono placeholder:text-zinc-600 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRunAiBenchmark()}
                    disabled={isQueryingAi || (!customGameInput.trim() && !aiGameTitle)}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                  >
                    {isQueryingAi ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>EVALUANDO EN GEMINI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>PROBAR CON IA EVO</span>
                      </>
                    )}
                  </button>
                </div>

                {aiQueryError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{aiQueryError}</span>
                  </div>
                )}

                {/* AI BENCHMARK RESULTS DISPLAY */}
                {aiBenchmarkResult && (
                  <div className="p-5 rounded-xl bg-zinc-950/90 border border-amber-400/50 space-y-4 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                          RESULTADO PERICIAL DE METROLOGÍA IA
                        </span>
                        <h4 className="font-display font-black text-lg text-white">
                          BENCHMARK REAL PARA {customGameInput || aiGameTitle} ({gameResolution.toUpperCase()})
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                        {aiBenchmarkResult.esportsRating || 'Apto eSports / Alta Tasa'}
                      </span>
                    </div>

                    {/* Gauges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="text-[9px] text-zinc-500 block uppercase">FPS PROMEDIO</span>
                        <span className="text-xl sm:text-2xl font-black text-emerald-400">
                          {aiBenchmarkResult.avgFps} <span className="text-xs text-zinc-400">FPS</span>
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="text-[9px] text-zinc-500 block uppercase">1% LOW (FLUIDEZ)</span>
                        <span className="text-xl sm:text-2xl font-black text-amber-400">
                          {aiBenchmarkResult.onePercentLow} <span className="text-xs text-zinc-400">FPS</span>
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="text-[9px] text-zinc-500 block uppercase">0.1% LOW (STUTTER)</span>
                        <span className="text-xl sm:text-2xl font-black text-cyan-400">
                          {aiBenchmarkResult.zeroOnePercentLow} <span className="text-xs text-zinc-400">FPS</span>
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="text-[9px] text-zinc-500 block uppercase">IMPACTO TIRONES</span>
                        <span className={`text-sm sm:text-base font-black uppercase ${
                          aiBenchmarkResult.stutterImpact === 'CRÍTICO' ? 'text-red-400' :
                          aiBenchmarkResult.stutterImpact === 'MODERADO' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {aiBenchmarkResult.stutterImpact}
                        </span>
                      </div>
                    </div>

                    {/* CPU vs GPU Bottleneck Bars */}
                    <div className="space-y-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
                      <div className="space-y-1">
                        <div className="flex justify-between text-zinc-300">
                          <span>CARGA / CUELLO DE BOTELLA EN CPU ({selectedCpu.name}):</span>
                          <span className="text-amber-400 font-bold">{aiBenchmarkResult.cpuBottleneckPct}%</span>
                        </div>
                        <div className="h-2.5 bg-black rounded-full overflow-hidden border border-zinc-800">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${aiBenchmarkResult.cpuBottleneckPct}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-zinc-300">
                          <span>CARGA / CUELLO DE BOTELLA EN GPU ({selectedGpu.name}):</span>
                          <span className="text-cyan-400 font-bold">{aiBenchmarkResult.gpuBottleneckPct}%</span>
                        </div>
                        <div className="h-2.5 bg-black rounded-full overflow-hidden border border-zinc-800">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${aiBenchmarkResult.gpuBottleneckPct}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Verdict and Explanation */}
                    <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2 text-xs font-sans">
                      <p className="text-zinc-200 font-bold leading-relaxed">
                        🔍 <strong>Dictamen EVO:</strong> {aiBenchmarkResult.verdictEs}
                      </p>
                      <p className="text-zinc-400 leading-relaxed text-[11px]">
                        🧠 <strong>Explicación de Microarquitectura:</strong> {aiBenchmarkResult.architecturalExplanationEs}
                      </p>
                    </div>

                    {/* Recommendations & Upgrades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                      {aiBenchmarkResult.recommendedSettingsEs?.length > 0 && (
                        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                            ⚡ AJUSTES GRÁFICOS RECOMENDADOS:
                          </span>
                          <ul className="list-disc list-inside text-zinc-300 space-y-1 text-[11px]">
                            {aiBenchmarkResult.recommendedSettingsEs.map((s: string, idx: number) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiBenchmarkResult.recommendedUpgradesEs?.length > 0 && (
                        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">
                            🛠️ MEJORAS DE HARDWARE SUGERIDAS:
                          </span>
                          <ul className="list-disc list-inside text-zinc-300 space-y-1 text-[11px]">
                            {aiBenchmarkResult.recommendedUpgradesEs.map((u: string, idx: number) => (
                              <li key={idx}>{u}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-PANEL 2: BIOS & MEMORIA (PRO) */}
          {gamingSubTab === 'bios_memory' && (
            <div className="p-6 rounded-2xl bg-[#080a0d] border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                      <span>UEFI / BIOS VIRTUAL // MICRO-AJUSTES</span>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 font-bold">
                        <Crown className="w-3 h-3 text-amber-400" /> FUNCIONALIDAD EVO PRO
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Modifica los registros de hardware en tiempo real y evalúa su impacto en latencia de memoria y disipación térmica.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setXmpEnabled(true);
                    setCasLatency(36);
                    setCpuUndervoltMv(0);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-mono-tech font-bold transition-all cursor-pointer"
                >
                  🔄 RESTABLECER BIOS POR DEFECTO
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. XMP / EXPO Toggle */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>PERFIL XMP 3.0 / AMD EXPO</span>
                      </span>
                      <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded ${
                        xmpEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        {xmpEnabled ? 'PERFIL 1 (ON)' : 'JEDEC BASE (OFF)'}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Al encender el perfil XMP/EXPO, la RAM eleva su frecuencia de los 4800 MT/s base a su velocidad nominal ({selectedRam.speedMhz} MT/s), reduciendo el ciclo de espera de la memoria y <strong>aumentando el 1% Low en un +15%</strong> en juegos dependientes de CPU (CS2/Valorant).
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono-tech text-zinc-400">ESTADO INTERRUPTOR:</span>
                    <button
                      type="button"
                      onClick={() => setXmpEnabled(!xmpEnabled)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer ${
                        xmpEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          xmpEnabled ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 2. CAS Latency (tCL) Slider */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>LATENCIA CAS (tCL TIMING)</span>
                      </span>
                      <span className="text-xs font-mono-tech font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        CL{casLatency}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Indica la cantidad de ciclos de reloj necesarios para que la RAM entregue datos solicitados por la CPU. Timings menores (CL30) ofrecen menor latencia de acceso a la caché L3.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <div className="flex justify-between text-[11px] font-mono-tech text-zinc-400">
                      <span>CL30 (Extremo)</span>
                      <span className="text-cyan-400 font-bold">CL{casLatency} (~{((casLatency * 2000) / selectedRam.speedMhz).toFixed(1)} ns)</span>
                      <span>CL46 (Lento)</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={46}
                      step={2}
                      value={casLatency}
                      onChange={(e) => setCasLatency(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                    />
                  </div>
                </div>

                {/* 3. CPU Undervolt Slider */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span>OFFSET DE VOLTAJE (UNDERVOLT)</span>
                      </span>
                      <span className="text-xs font-mono-tech font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40">
                        {cpuUndervoltMv} mV
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Reduce el calor generado por efecto Joule sin perder frecuencia de reloj. Disminuye la temperatura (T_SoC) en <strong>4°C a 8°C</strong>, retrasando el estrangulamiento térmico provocado por la degradación temporal.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <div className="flex justify-between text-[11px] font-mono-tech text-zinc-400">
                      <span>0 mV (Stock)</span>
                      <span className="text-purple-400 font-bold">-{telemetry.thermalReductionC}°C en silicio</span>
                      <span>-30 mV (Máximo)</span>
                    </div>
                    <input
                      type="range"
                      min={-30}
                      max={0}
                      step={5}
                      value={cpuUndervoltMv}
                      onChange={(e) => setCpuUndervoltMv(Number(e.target.value))}
                      className="w-full accent-purple-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* BIOS Impact Diagnostic Deck */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-mono-tech font-bold text-purple-300 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    <span>DIAGNÓSTICO PERICIAL DEL BIOS:</span>
                  </div>
                  <p className="text-zinc-300">
                    {xmpEnabled
                      ? `XMP activo @ ${selectedRam.speedMhz} MT/s CL${casLatency}. Latencia de caché L3 óptima. El 1% Low recibe el impulso completo de +15%.`
                      : '¡ATENCIÓN! RAM operando en velocidad JEDEC de rescate. El procesador experimenta tiempos muertos esperando paquetes de memoria.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="p-2.5 rounded-lg bg-black/60 border border-purple-500/40 text-center font-mono">
                    <div className="text-[10px] text-zinc-400 uppercase">1% LOW ESTIMADO</div>
                    <div className="text-base font-black text-purple-300">{telemetry.fps1Low} FPS</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-purple-500/40 text-center font-mono">
                    <div className="text-[10px] text-zinc-400 uppercase">TEMP CPU SoC</div>
                    <div className="text-base font-black text-amber-300">{telemetry.cpuTempC}°C</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-PANEL 3: LATENCIA & RED (PRO) */}
          {gamingSubTab === 'latency_network' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* SECTION A: ANALIZADOR DE LATENCIA END-TO-END */}
              <div className="p-6 rounded-2xl bg-[#080a0d] border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <MousePointer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                      <span>AUDITORÍA DE LATENCIA END-TO-END (CLICK-TO-PHOTON)</span>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 font-bold">
                        <Crown className="w-3 h-3 text-amber-400" /> FUNCIONALIDAD EVO PRO
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Calcula los milisegundos reales transcurridos desde que el interruptor mecánico del mouse se cierra hasta que el fotograma se ilumina en el monitor.
                    </p>
                  </div>
                </div>

                {/* Peripherals Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mouse Polling Rate */}
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-1.5">
                        <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
                        <span>POLLING RATE DEL MOUSE</span>
                      </span>
                      <span className="text-xs font-mono-tech font-bold text-cyan-400">
                        {mousePollingRate} Hz ({telemetry.mouseLatencyMs} ms)
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[125, 500, 1000, 4000].map((hz) => (
                        <button
                          key={hz}
                          type="button"
                          onClick={() => setMousePollingRate(hz)}
                          className={`py-2 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                            mousePollingRate === hz
                              ? 'bg-cyan-400 text-black shadow'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {hz >= 1000 ? `${hz / 1000}kHz` : `${hz}Hz`}
                        </button>
                      ))}
                    </div>

                    {telemetry.hasDpcOverload && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Alerta DPC:</strong> 4000Hz satura los hilos de un CPU de entrada, inyectando micro-tirones por interrupciones de kernel.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Monitor Refresh Rate */}
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                        <span>FRECUENCIA DEL MONITOR (HZ)</span>
                      </span>
                      <span className="text-xs font-mono-tech font-bold text-emerald-400">
                        {monitorRefreshRate} Hz ({telemetry.displayLatencyMs} ms)
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {[60, 144, 210, 240, 360].map((hz) => (
                        <button
                          key={hz}
                          type="button"
                          onClick={() => setMonitorRefreshRate(hz)}
                          className={`py-2 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                            monitorRefreshRate === hz
                              ? 'bg-emerald-400 text-black shadow'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {hz} Hz
                        </button>
                      ))}
                    </div>

                    {telemetry.dwmDesyncPenaltyMs > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-[11px] text-amber-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Desincronización de Refresco (Stutter / Tearing):</strong> El juego entrega {telemetry.fpsAvg} FPS frente a la tasa fija del panel de {monitorRefreshRate}Hz (+{telemetry.dwmDesyncPenaltyMs}ms de judder).
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Click-to-Photon 4-Step Pipeline Visualization */}
                <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-3">
                  <div className="text-xs font-mono-tech font-bold text-zinc-300 uppercase">
                    DESGLOSE SECUENCIAL DEL PIPELINE DE ENTRADA A SALIDA:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">1. MOUSE INPUT</div>
                      <div className="text-lg font-black font-mono text-cyan-400">{telemetry.mouseLatencyMs} ms</div>
                      <div className="text-[10px] text-zinc-500">Buffer USB @ {mousePollingRate}Hz</div>
                    </div>

                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">2. RENDER PIPELINE</div>
                      <div className="text-lg font-black font-mono text-amber-400">{telemetry.renderLatencyMs} ms</div>
                      <div className="text-[10px] text-zinc-500">Frametime @ {telemetry.fpsAvg} FPS</div>
                    </div>

                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">3. DWM BUFFER SYNC</div>
                      <div className="text-lg font-black font-mono text-purple-400">+{telemetry.dwmDesyncPenaltyMs} ms</div>
                      <div className="text-[10px] text-zinc-500">Desfase de Presentación</div>
                    </div>

                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 space-y-1">
                      <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">4. DISPLAY SCANOUT</div>
                      <div className="text-lg font-black font-mono text-emerald-400">{telemetry.displayLatencyMs} ms</div>
                      <div className="text-[10px] text-zinc-500">Barrido Panel @ {monitorRefreshRate}Hz</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-950/40 via-emerald-950/40 to-transparent border border-cyan-500/30 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono-tech font-bold text-white">
                        LATENCIA TOTAL DEL SISTEMA (END-TO-END):
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black font-mono text-cyan-300">
                        {telemetry.totalSystemLatencyMs} ms
                      </span>
                      <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded ${
                        telemetry.totalSystemLatencyMs < 16
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : telemetry.totalSystemLatencyMs < 30
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {telemetry.totalSystemLatencyMs < 16 ? 'TIER E-SPORTS PRO' : telemetry.totalSystemLatencyMs < 30 ? 'GRADO COMPETITIVO' : 'ALTA LATENCIA'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: OSCILOSCOPIO DE RED Y BUFFERBLOAT */}
              <div className="p-6 rounded-2xl bg-[#080a0d] border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                      <span>OSCILOSCOPIO DE RED Y BUFFERBLOAT EN VIVO</span>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 font-bold">
                        <Crown className="w-3 h-3 text-amber-400" /> FUNCIONALIDAD EVO PRO
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Grafica la fluctuación de jitter, la latencia inducida por colas saturadas (Bufferbloat) y la pérdida de paquetes que origina el "Rubberbanding".
                    </p>
                  </div>
                </div>

                {/* Connection Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-mono-tech font-bold text-zinc-400 uppercase">
                    SELECCIONAR TIPO DE CONEXIÓN A INTERNET:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setNetworkType('fiber_ethernet')}
                      className={`p-3 rounded-xl text-left font-mono-tech transition-all cursor-pointer border ${
                        networkType === 'fiber_ethernet'
                          ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Signal className="w-3.5 h-3.5" />
                        <span>Fibra Óptica FTTH</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">6ms • 0% Loss • Grado A+</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNetworkType('wifi_6e')}
                      className={`p-3 rounded-xl text-left font-mono-tech transition-all cursor-pointer border ${
                        networkType === 'wifi_6e'
                          ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5" />
                        <span>Wi-Fi 6E (5/6GHz)</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">14ms • 0.1% Loss • Grado A</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNetworkType('wifi_24ghz_congested')}
                      className={`p-3 rounded-xl text-left font-mono-tech transition-all cursor-pointer border ${
                        networkType === 'wifi_24ghz_congested'
                          ? 'bg-rose-950/40 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" />
                        <span>Wi-Fi 2.4GHz Saturado</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">195ms • 7.5% Loss • Grado F</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNetworkType('lte_mobile')}
                      className={`p-3 rounded-xl text-left font-mono-tech transition-all cursor-pointer border ${
                        networkType === 'lte_mobile'
                          ? 'bg-amber-950/40 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Disc className="w-3.5 h-3.5" />
                        <span>Red Móvil 4G LTE</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">52ms • 2.0% Loss • Grado C</div>
                    </button>
                  </div>
                </div>

                {/* Oscilloscope Canvas */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                    <span>SEÑAL DE ONDA DE LATENCIA (0 a 250ms):</span>
                    <span className="text-rose-400 font-bold">● PUNTOS ROJOS = PAQUETES PERDIDOS (DESYNC)</span>
                  </div>

                  <div className="w-full h-40 rounded-xl overflow-hidden border border-zinc-800 bg-[#06080d] relative shadow-inner">
                    <canvas ref={networkOscRef} className="w-full h-full block" />
                  </div>
                </div>

                {/* Network Metrology HUD Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 space-y-1">
                    <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">PING BASE PROMEDIO</div>
                    <div className={`text-lg font-black font-mono ${telemetry.networkPingMs > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {telemetry.networkPingMs} ms
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 space-y-1">
                    <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">JITTER (DESVIACIÓN)</div>
                    <div className="text-lg font-black font-mono text-cyan-400">±{telemetry.networkJitterMs} ms</div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 space-y-1">
                    <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">PACKET LOSS</div>
                    <div className={`text-lg font-black font-mono ${telemetry.packetLossPercent > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {telemetry.packetLossPercent}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 space-y-1">
                    <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">CALIFICACIÓN BUFFERBLOAT</div>
                    <div className={`text-lg font-black font-mono ${telemetry.bufferbloatGrade === 'F' ? 'text-rose-400' : telemetry.bufferbloatGrade === 'A+' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      Grado {telemetry.bufferbloatGrade}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMMERCIAL / PRO VALUE BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0d1017] to-cyan-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black shrink-0 shadow-lg shadow-amber-500/20">
                <Crown className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-black text-sm text-white uppercase tracking-wider">
                    PLAN PROFESIONAL EVO LABS PRO
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    SUSCRIPCIÓN AUDITORÍA PERICIAL
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  Desbloquea auditorías periciales profundas de latencia DPC, calibración de sub-timings de memoria UEFI, telemetría de osciloscopio de red y cálculo pericial de retorno de inversión por FPS.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsRoiModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                <span>CALCULAR ROI DE UPGRADE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: MOTOR DE RETORNO DE INVERSIÓN (ROI CALCULATOR)                */}
      {/* ==================================================================== */}
      {isRoiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-2xl w-full p-6 rounded-2xl bg-[#0b0e14] border border-emerald-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-white uppercase">
                    CALCULADORA DE RETORNO DE INVERSIÓN (ROI // COSTO POR FPS)
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    ¿Dónde te conviene poner tu plata según tu cuello de botella actual?
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRoiModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-300">
                Rendimiento Actual ({selectedGameType === 'esports' ? 'eSports' : 'AAA'} {gameResolution}):
              </span>
              <span className="text-amber-400 font-bold text-sm">{roiCalculations.currentFps} FPS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Upgrade CPU */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                roiCalculations.isCpuUpgradeSmarter
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-zinc-900/50 border-zinc-800'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-300 font-mono-tech flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>OPCIÓN A: CAMBIAR CPU</span>
                  </span>
                  {roiCalculations.isCpuUpgradeSmarter && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-black">
                      COMPRA INTELIGENTE
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-300">
                  Avanzar a <strong>Ryzen 7 7800X3D</strong> (${roiCalculations.cpuUpgradeCost} USD de diferencia)
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">FPS Proyectados:</span>
                    <span className="text-emerald-400 font-bold">{roiCalculations.projectedFpsWithCpu} FPS (+{roiCalculations.cpuFpsGained} FPS)</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Costo por FPS ganado:</span>
                    <span className="text-white font-bold">${roiCalculations.cpuCostPerFps} USD / FPS</span>
                  </div>
                </div>
              </div>

              {/* Option B: Upgrade GPU */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                !roiCalculations.isCpuUpgradeSmarter
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-zinc-900/50 border-zinc-800'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cyan-300 font-mono-tech flex items-center gap-1.5">
                    <Monitor className="w-4 h-4" />
                    <span>OPCIÓN B: CAMBIAR GPU</span>
                  </span>
                  {!roiCalculations.isCpuUpgradeSmarter && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500 text-black">
                      COMPRA INTELIGENTE
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-300">
                  Avanzar a <strong>RTX 4070 Ti Super</strong> (${roiCalculations.gpuUpgradeCost} USD de diferencia)
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">FPS Proyectados:</span>
                    <span className="text-cyan-400 font-bold">{roiCalculations.projectedFpsWithGpu} FPS (+{roiCalculations.gpuFpsGained} FPS)</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Costo por FPS ganado:</span>
                    <span className="text-white font-bold">${roiCalculations.gpuCostPerFps} USD / FPS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-sans-editorial">
              {roiCalculations.isCpuUpgradeSmarter ? (
                <span>
                  💡 <strong>Veredicto Financiero:</strong> Estás sufriendo cuello de botella en Procesador o RAM. Pagar ${roiCalculations.gpuUpgradeCost} por una GPU nueva te daría casi 0 FPS de mejora porque el procesador la frenará. Por solo ${roiCalculations.cpuUpgradeCost} en CPU ganás +{roiCalculations.cpuFpsGained} FPS inmediatos a un costo imbatible de ${roiCalculations.cpuCostPerFps} USD por FPS.
                </span>
              ) : (
                <span>
                  💡 <strong>Veredicto Financiero:</strong> Tu procesador alimenta bien los fotogramas. Invertir en una GPU de mayor gama te dará un salto real de +{roiCalculations.gpuFpsGained} FPS en resolución {gameResolution}.
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsRoiModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech font-bold text-xs uppercase cursor-pointer"
            >
              CERRAR ANÁLISIS
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* EDUCATIONAL MODAL / TOOLTIP FLYOUT                                   */}
      {/* ==================================================================== */}
      {activeTooltipKey && DIDACTIC_EXPLANATIONS[activeTooltipKey] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0d1017] border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-base text-white">
                  {DIDACTIC_EXPLANATIONS[activeTooltipKey].title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTooltipKey(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold text-xs sm:text-sm">
              {DIDACTIC_EXPLANATIONS[activeTooltipKey].analogy}
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
              {DIDACTIC_EXPLANATIONS[activeTooltipKey].detail}
            </p>

            <button
              type="button"
              onClick={() => setActiveTooltipKey(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech font-bold text-xs uppercase cursor-pointer transition-colors"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SUPERFICIE DE UNA SOLA VERDAD (SINGLE TRUTH SURFACE) // ENTERPRISE EXPORT
// ============================================================================
export {
  EvoSingleTruthSurface,
  INDIVIDUAL_GAMES,
  MARKET_GAMES,
  evoTranslations,
  evoTranslations as evoTruthTranslations,
} from './EvoSingleTruthSurface';
export type {
  SystemTelemetry,
  IndividualGameBenchmark,
  EvoLanguage,
  EvoSingleTruthSurfaceProps,
} from './EvoSingleTruthSurface';
