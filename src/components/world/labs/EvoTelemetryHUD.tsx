import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Gauge, Zap, Radio, Shield, Thermometer, RefreshCw } from 'lucide-react';
import { UserHardwarePassport } from '../../../types';

interface EvoTelemetryHUDProps {
  passport: UserHardwarePassport | null;
  onSelectZone?: (zoneId: string) => void;
}

export const EvoTelemetryHUD: React.FC<EvoTelemetryHUDProps> = ({ passport, onSelectZone }) => {
  const [cpuUsage, setCpuUsage] = useState(24);
  const [gpuUsage, setGpuUsage] = useState(68);
  const [dpcLatency, setDpcLatency] = useState(142); // microseconds
  const [frametimeJitter, setFrametimeJitter] = useState(0.8); // ms
  const [coreTemp, setCoreTemp] = useState(48); // celsius
  const [pcieThroughput, setPcieThroughput] = useState(15.4); // GB/s
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  // Live telemetry pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSimulatingLoad) {
        setCpuUsage(Math.floor(78 + Math.random() * 18));
        setGpuUsage(Math.floor(92 + Math.random() * 7));
        setDpcLatency(Math.floor(280 + Math.random() * 190));
        setFrametimeJitter(+(1.8 + Math.random() * 2.2).toFixed(2));
        setCoreTemp(Math.floor(71 + Math.random() * 6));
        setPcieThroughput(+(28.5 + Math.random() * 2.8).toFixed(1));
      } else {
        setCpuUsage(Math.floor(18 + Math.random() * 12));
        setGpuUsage(Math.floor(35 + Math.random() * 25));
        setDpcLatency(Math.floor(95 + Math.random() * 60));
        setFrametimeJitter(+(0.4 + Math.random() * 0.7).toFixed(2));
        setCoreTemp(Math.floor(42 + Math.random() * 7));
        setPcieThroughput(+(12.1 + Math.random() * 4.2).toFixed(1));
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulatingLoad]);

  return (
    <div className="w-full bg-[#0a0c10]/95 border-y border-zinc-800/90 py-2.5 px-4 sm:px-8 text-xs font-mono-tech backdrop-blur-md relative z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Telemetry Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isSimulatingLoad ? 'bg-rose-500 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
            <span className="font-bold text-white tracking-wider uppercase text-[11px]">
              MUNDO EVO // TELEMETRÍA EN VIVO
            </span>
          </div>
          <span className="hidden md:inline text-zinc-600">|</span>
          <span className="hidden md:inline text-zinc-400 text-[10.5px]">
            ESTACIÓN: <strong className="text-zinc-200">{passport?.cpuModel || 'WORKSTATION LOCAL (ANÁLISIS PERICIAL)'}</strong>
          </span>
        </div>

        {/* Center: Live Gauges */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10.5px]">
          
          {/* CPU & Core Temp */}
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">CPU:</span>
            <span className={`font-bold ${cpuUsage > 80 ? 'text-rose-400' : 'text-amber-400'}`}>
              {cpuUsage}%
            </span>
            <span className="text-zinc-500">({coreTemp}°C)</span>
          </div>

          {/* DPC Latency */}
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400">DPC LATENCY:</span>
            <span className={`font-bold ${dpcLatency > 500 ? 'text-rose-400' : dpcLatency > 250 ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {dpcLatency} µs
            </span>
          </div>

          {/* Frametime Jitter */}
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-zinc-400">JITTER:</span>
            <span className={`font-bold ${frametimeJitter > 2.0 ? 'text-rose-400' : 'text-zinc-200'}`}>
              ±{frametimeJitter} ms
            </span>
          </div>

          {/* PCIe Bus */}
          <div className="hidden lg:flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-zinc-400">PCIe BUS:</span>
            <span className="text-sky-300 font-bold">{pcieThroughput} GB/s</span>
          </div>
        </div>

        {/* Right: Load Simulator Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSimulatingLoad(!isSimulatingLoad)}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              isSimulatingLoad
                ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-amber-400/60'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isSimulatingLoad ? 'animate-spin' : ''}`} />
            <span>{isSimulatingLoad ? 'CARGA DE ESTRÉS: ACTIVA' : 'SIMULAR CARGA AL 100%'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
