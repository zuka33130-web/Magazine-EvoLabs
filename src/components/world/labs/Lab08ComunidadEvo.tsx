import React, { useState } from 'react';
import { Radio, Users, AlertTriangle, CheckCircle2, Search, ArrowUpRight, ShieldCheck, Cpu } from 'lucide-react';

interface DriverAlert {
  id: string;
  driver: string;
  version: string;
  status: 'INESTABLE' | 'VERIFICADO SEGURO' | 'HOTFIX DISPONIBLE';
  reportedIssue: string;
  workaround: string;
  affectedHw: string;
}

const DRIVER_ALERTS: DriverAlert[] = [
  {
    id: 'drv-01',
    driver: 'NVIDIA Game Ready Driver',
    version: '566.14 WHQL',
    status: 'HOTFIX DISPONIBLE',
    reportedIssue: 'Elevado uso de CPU (10-15%) por el proceso nvcontainer.exe tras cerrar juegos con Discord overlay activado.',
    workaround: 'Instalar el hotfix 566.36 o deshabilitar "NVIDIA Display Container LS" en servicios de Windows si no se usa Ansel/ShadowPlay.',
    affectedHw: 'GeForce RTX Serie 40 y Serie 30'
  },
  {
    id: 'drv-02',
    driver: 'AMD Software: Adrenalin Edition',
    version: '24.10.1',
    status: 'VERIFICADO SEGURO',
    reportedIssue: 'Excelente consistencia de frametimes en DirectX 12. Rendimiento probado con telemetría EVO.',
    workaround: 'Mantener instalación estándar sin activar Anti-Lag 2 en juegos que no lo soporten nativamente.',
    affectedHw: 'Radeon RX 7000 / 6000 Series'
  },
  {
    id: 'drv-03',
    driver: 'Intel Killer WiFi Driver Suite',
    version: '35.24.11',
    status: 'INESTABLE',
    reportedIssue: 'Picos de latencia DPC (>1200 µs) y tirones aleatorios en audio/juegos causados por Killer Network Service.',
    workaround: 'Desinstalar Killer Control Center e instalar únicamente el INF básico "Driver Only" desde el catálogo de Intel.',
    affectedHw: 'Placas base con chipsets Intel AX211 / Killer 1650'
  }
];

export const Lab08ComunidadEvo: React.FC = () => {
  const [alerts, setAlerts] = useState<DriverAlert[]>(DRIVER_ALERTS);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0e1017] to-zinc-900 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Radio className="w-40 h-40 text-amber-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 08 // OBSERVATORIO GLOBAL & RADAR DE DRIVERS
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">// FRECUENCIA DE TELEMETRÍA EN RED</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Comunidad EVO & Radar de Controladores
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              Alertas tempranas sobre drivers y actualizaciones de Windows inestables. Casos forenses contrastados entre operadores de laboratorio para evitar que rompas tu sistema con parches defectuosos.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Driver Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono-tech">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className="p-5 bg-[#0d0f17] border-2 border-zinc-800 rounded-xl flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">
                  {alert.driver}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                  alert.status === 'VERIFICADO SEGURO'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : alert.status === 'HOTFIX DISPONIBLE'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  {alert.status}
                </span>
              </div>

              <div className="text-xs text-amber-400 font-semibold">
                Versión: {alert.version}
              </div>

              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                <strong>Anomalía:</strong> {alert.reportedIssue}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-zinc-800 text-[11px] font-sans-editorial">
              <span className="text-zinc-400 block font-mono-tech text-[10px] uppercase font-bold text-amber-400">
                Solución Pericial / Mitigación:
              </span>
              <p className="text-zinc-200 leading-relaxed bg-black/60 p-2.5 rounded border border-zinc-800">
                {alert.workaround}
              </p>
              <div className="text-[10px] font-mono-tech text-zinc-500 pt-1">
                Hardware: {alert.affectedHw}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
