import React, { useState } from 'react';
import {
  Flame,
  HardDrive,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ThermometerSnowflake,
  Activity,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UserPcSpec } from '../../types';

interface Station03OtherLimitersProps {
  specs: Partial<UserPcSpec>;
}

export const Station03OtherLimiters: React.FC<Station03OtherLimitersProps> = ({ specs }) => {
  const [expandedLimiter, setExpandedLimiter] = useState<'ram' | 'thermal' | 'storage' | 'power'>('ram');

  // Interactive self-check state
  const [checklist, setChecklist] = useState({
    ramDualChannel: specs.ram?.toLowerCase().includes('dual') || false,
    xmpActive: false,
    tempsUnder85: true,
    ssdGameDrive: specs.storage?.toLowerCase().includes('nvme') || specs.storage?.toLowerCase().includes('ssd') || true,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="estacion-03-otros-limitadores" className="space-y-6 pt-4">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase">
          <span className="text-yellow-400 font-bold">ESTACIÓN 03 // OTROS LIMITADORES</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">MEMORIA, CALOR, DISCO Y ENERGÍA</span>
        </div>
        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
          LOS CULPABLES INVISIBLES
        </span>
      </div>

      {/* Intro Banner */}
      <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-3">
        <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
          Cuando el freno no es ni la CPU ni la GPU
        </h3>
        <p className="font-sans-editorial text-zinc-300 text-sm sm:text-base leading-relaxed">
          Podés tener el procesador más rápido del mundo y una tarjeta gráfica de última generación. Si la memoria trabaja a medio ancho de banda o el silicio se calienta por encima de su umbral crítico, el rendimiento se derrumbará igual.
        </p>
      </div>

      {/* 4 Deep-Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LIMITER 1: RAM */}
        <div
          onClick={() => setExpandedLimiter('ram')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            expandedLimiter === 'ram'
              ? 'bg-[#15161f] border-yellow-400/80 shadow-lg shadow-yellow-400/5'
              : 'bg-[#121318] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-bold uppercase border border-yellow-400/30">
                LIMITADOR 01 // MEMORIA RAM
              </span>
              <span className="text-xs font-mono-tech text-zinc-400">ANCHO DE BANDA & LATENCIA</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white uppercase flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Single Channel & XMP Desactivado
            </h4>
            <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Operar con un solo módulo en lugar de dos en <strong>Dual Channel</strong> reduce el ancho de banda teórico de memoria a la mitad. En juegos con alta demanda de transferencias de datos entre CPU y memoria, esto deprime de manera notable el 1% Low y acentúa los micro-tirones.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 text-xs font-mono-tech space-y-1">
            <span className="text-zinc-400 block text-[10px] uppercase">VERIFICACIÓN FÍSICA EN TU EQUIPO:</span>
            <span className="text-yellow-400 block">
              CPU-Z pestaña "Memory" → ¿Canal reporta "Dual" o "2x 64-bit"? ¿La frecuencia efectiva coincide con la especificación del fabricante?
            </span>
          </div>
        </div>

        {/* LIMITER 2: THERMAL */}
        <div
          onClick={() => setExpandedLimiter('thermal')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            expandedLimiter === 'thermal'
              ? 'bg-[#181215] border-rose-500/80 shadow-lg shadow-rose-900/10'
              : 'bg-[#121318] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold uppercase border border-rose-500/30">
                LIMITADOR 02 // TÉRMICO
              </span>
              <span className="text-xs font-mono-tech text-zinc-400">TJMAX & PROTECCIÓN TÉRMICA</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white uppercase flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              Thermal Throttling (Estrés por Temperatura)
            </h4>
            <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Al aproximarse al umbral crítico térmico (TjMax), los mecanismos internos del procesador reducen frecuencias y voltajes de forma automática para salvaguardar el silicio, reduciendo abruptamente el caudal de procesamiento.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 text-xs font-mono-tech space-y-1">
            <span className="text-zinc-400 block text-[10px] uppercase">SÍNTOMA OBSERVABLE:</span>
            <span className="text-rose-300 block">
              La sesión inicia con cadencia regular y, tras varios minutos bajo carga continua, experimenta una caída repentina y persistente de fotogramas.
            </span>
          </div>
        </div>

        {/* LIMITER 3: STORAGE */}
        <div
          onClick={() => setExpandedLimiter('storage')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            expandedLimiter === 'storage'
              ? 'bg-[#12161f] border-sky-400/80 shadow-lg shadow-sky-400/5'
              : 'bg-[#121318] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-sky-400/10 text-sky-400 font-bold uppercase border border-sky-400/30">
                LIMITADOR 03 // ALMACENAMIENTO
              </span>
              <span className="text-xs font-mono-tech text-zinc-400">STREAMING DE ASSETS</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white uppercase flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-sky-400" />
              Unidad de Almacenamiento & Tiempos de Acceso
            </h4>
            <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
              El almacenamiento no incrementa el pico teórico de fotogramas que la GPU puede renderizar en un bucle cerrado, pero una unidad lenta con tiempos de acceso elevados introduce picos de frametime cada vez que el motor solicita modelos o texturas en tiempo real.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 text-xs font-mono-tech space-y-1">
            <span className="text-zinc-400 block text-[10px] uppercase">CONCLUSIÓN TÉCNICA:</span>
            <span className="text-sky-300 block">
              El SSD NVMe/SATA no compra mayores promedios; preserva la consistencia frente al stuttering de carga de activos.
            </span>
          </div>
        </div>

        {/* LIMITER 4: POWER / VRM */}
        <div
          onClick={() => setExpandedLimiter('power')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            expandedLimiter === 'power'
              ? 'bg-[#181512] border-amber-500/80 shadow-lg shadow-amber-500/5'
              : 'bg-[#121318] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold uppercase border border-amber-500/30">
                LIMITADOR 04 // ENERGÍA & VRM
              </span>
              <span className="text-xs font-mono-tech text-zinc-400">POWER LIMITS & TEMPERATURA VRM</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white uppercase flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Etapa de Entrega de Energía (VRM)
            </h4>
            <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Cuando la placa madre cuenta con fases de alimentación sin disipación suficiente o límites de potencia muy restrictivos, la temperatura de los MOSFETs puede forzar una limitación de consumo (Power Limit Throttling), restringiendo la frecuencia del procesador.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 text-xs font-mono-tech space-y-1">
            <span className="text-zinc-400 block text-[10px] uppercase">TELEMETRÍA DE REFERENCIA:</span>
            <span className="text-amber-300 block">
              En sensores tipo HWiNFO, verificar banderas como "VRM Thermal Throttling" o descensos sostenidos en Package Power.
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Self-Audit Protocol */}
      <div className="p-6 rounded-2xl bg-black/40 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
            LISTA DE CHEQUEO // AUDITORÍA RÁPIDA DE TU PROPIA PC
          </span>
          <span className="text-[10px] font-mono-tech text-zinc-400 uppercase">
            DESCARTE PREVIO AL EXPERIMENTO
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-tech text-xs">
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#121318] border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checklist.ramDualChannel}
              onChange={() => toggleCheck('ramDualChannel')}
              className="mt-0.5 accent-yellow-400 w-4 h-4 rounded cursor-pointer"
            />
            <div>
              <span className="text-white font-bold block">Memoria en Dual Channel</span>
              <span className="text-zinc-400 text-[11px]">2 módulos colocados en los slots recomendados (2 y 4).</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#121318] border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checklist.xmpActive}
              onChange={() => toggleCheck('xmpActive')}
              className="mt-0.5 accent-yellow-400 w-4 h-4 rounded cursor-pointer"
            />
            <div>
              <span className="text-white font-bold block">Perfil XMP / DOCP / EXPO Activado</span>
              <span className="text-zinc-400 text-[11px]">La RAM corre a su frecuencia real en BIOS y no a 2133 MHz.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#121318] border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checklist.tempsUnder85}
              onChange={() => toggleCheck('tempsUnder85')}
              className="mt-0.5 accent-yellow-400 w-4 h-4 rounded cursor-pointer"
            />
            <div>
              <span className="text-white font-bold block">Temperaturas en Carga &lt; 85°C</span>
              <span className="text-zinc-400 text-[11px]">Ni la CPU ni la GPU alcanzan thermal throttling crítico.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#121318] border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checklist.ssdGameDrive}
              onChange={() => toggleCheck('ssdGameDrive')}
              className="mt-0.5 accent-yellow-400 w-4 h-4 rounded cursor-pointer"
            />
            <div>
              <span className="text-white font-bold block">Juego Instalado en SSD</span>
              <span className="text-zinc-400 text-[11px]">Evita los micro-stutters al cargar texturas en streaming.</span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};
