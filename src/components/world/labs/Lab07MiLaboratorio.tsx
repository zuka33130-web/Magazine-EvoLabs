import React, { useState } from 'react';
import { UserHardwarePassport } from '../../../types';
import { Laptop, Cpu, Calendar, Wrench, Download, Plus, CheckCircle2, Shield, Clock } from 'lucide-react';

interface FleetMachine {
  id: string;
  name: string;
  type: 'DESKTOP' | 'NOTEBOOK' | 'SERVER';
  cpu: string;
  gpu: string;
  ram: string;
  lastPasteMonthsAgo: number;
  status: 'ÓPTIMO' | 'MANTENIMIENTO REQUERIDO' | 'EN OBSERVACIÓN';
}

const DEFAULT_FLEET: FleetMachine[] = [
  {
    id: 'pc-01',
    name: 'Estación Principal // Laboratorio',
    type: 'DESKTOP',
    cpu: 'AMD Ryzen 7 7800X3D (8C/16T)',
    gpu: 'NVIDIA GeForce RTX 4080 16GB',
    ram: '32 GB DDR5-6000 CL30',
    lastPasteMonthsAgo: 4,
    status: 'ÓPTIMO'
  },
  {
    id: 'pc-02',
    name: 'Notebook Portátil de Campo',
    type: 'NOTEBOOK',
    cpu: 'Intel Core i7-13700H (14C/20T)',
    gpu: 'RTX 4060 Laptop GPU 8GB',
    ram: '16 GB DDR5-5200',
    lastPasteMonthsAgo: 16,
    status: 'MANTENIMIENTO REQUERIDO'
  }
];

export const Lab07MiLaboratorio: React.FC<{ passport: UserHardwarePassport | null }> = ({ passport }) => {
  const [fleet, setFleet] = useState<FleetMachine[]>(DEFAULT_FLEET);
  const [selectedMachine, setSelectedMachine] = useState<FleetMachine>(DEFAULT_FLEET[0]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/15 via-[#0e1017] to-zinc-900 border-2 border-sky-500/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Wrench className="w-40 h-40 text-sky-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-sky-500/20 border border-sky-500/50 text-sky-300 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 07 // HANGAR PERSONAL & EXPEDIENTES DE FLOTA
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">// MULTI-MACHINE PASSPORT</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Mi Laboratorio & Hangar Multi-Estación
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              Gestioná el historial clínico de todas tus máquinas: ciclos de mantenimiento térmico, control de degradación de compuestos térmicos (Pasta/Pads) y exportación del Pasaporte EVO.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 cols: Fleet List */}
        <div className="lg:col-span-4 p-5 bg-[#0d0f17] border border-zinc-800 rounded-xl space-y-4 font-mono-tech">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              FLOTA DE MÁQUINAS ({fleet.length})
            </span>
          </div>

          <div className="space-y-3">
            {fleet.map((m) => {
              const isSelected = selectedMachine.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMachine(m)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.25)]'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                      {m.type}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      m.status === 'ÓPTIMO'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-100 mb-1">
                    {m.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {m.cpu}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 cols: Machine Clinic & Thermal Timeline */}
        <div className="lg:col-span-8 p-6 bg-[#0c0e15] border-2 border-zinc-800 rounded-xl space-y-6 shadow-2xl">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3 font-mono-tech">
            <div>
              <span className="text-xs text-sky-400 font-bold uppercase">
                EXPEDIENTE TÉCNICO // {selectedMachine.type}
              </span>
              <h3 className="font-display font-black text-xl text-white uppercase mt-0.5">
                {selectedMachine.name}
              </h3>
            </div>

            <div className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-300">
              ID: {selectedMachine.id.toUpperCase()}
            </div>
          </div>

          {/* Specs Sheet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-xs">
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block mb-1">PROCESADOR</span>
              <span className="text-zinc-200 font-bold">{selectedMachine.cpu}</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block mb-1">GRÁFICA</span>
              <span className="text-zinc-200 font-bold">{selectedMachine.gpu}</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block mb-1">MEMORIA RAM</span>
              <span className="text-zinc-200 font-bold">{selectedMachine.ram}</span>
            </div>
          </div>

          {/* Thermal degradation tracker */}
          <div className="p-4 bg-[#11141e] rounded-xl border border-zinc-800 space-y-3 font-mono-tech">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                ESTADO DE LA PASTA TÉRMICA & PADS
              </span>
              <span className="text-xs text-zinc-300">
                Último cambio: <strong className="text-white">{selectedMachine.lastPasteMonthsAgo} meses atrás</strong>
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-3 bg-black rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className={`h-full rounded-full transition-all ${
                    selectedMachine.lastPasteMonthsAgo > 12
                      ? 'bg-red-500'
                      : selectedMachine.lastPasteMonthsAgo > 8
                      ? 'bg-yellow-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (selectedMachine.lastPasteMonthsAgo / 18) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>0 meses (Fresco)</span>
                <span>12 meses (Revisión recomendada)</span>
                <span>18+ meses (Degradado)</span>
              </div>
            </div>

            <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed pt-1">
              {selectedMachine.lastPasteMonthsAgo > 12 
                ? '⚠️ Se recomienda limpieza ultrasónica o mecánica y reemplazo de pasta térmica para evitar micro-fracturas por bombeo (Pump-out effect).'
                : '✓ La interfaz térmica opera dentro de sus propiedades reológicas óptimas.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
