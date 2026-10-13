// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — HARDWARE EDIT MODAL (COMPLETAR UNKNOWN)
// Principle: "NO SE ADIVINA. SE MIDE."
// ============================================================================

import React, { useState } from 'react';
import { X, Edit3, CheckCircle2, ShieldCheck, Cpu, HardDrive, Zap, Fan, Layers, Globe } from 'lucide-react';
import { Machine, EpistemicProvenance } from '../types';
import { HardwareComponent } from '../services/hardwareCatalog';
import { EvoHardwareDiscoveryModal } from './EvoHardwareDiscoveryModal';

interface EvoCompleteUnknownModalProps {
  isOpen: boolean;
  onClose: () => void;
  machine: Machine;
  onSaveMachine: (updatedMachine: Machine) => void;
}

export const EvoCompleteUnknownModal: React.FC<EvoCompleteUnknownModalProps> = ({
  isOpen,
  onClose,
  machine,
  onSaveMachine,
}) => {
  const [motherboardModel, setMotherboardModel] = useState(machine.motherboard.model || '');
  const [motherboardSocket, setMotherboardSocket] = useState(machine.motherboard.socket || '');
  const [psuWattage, setPsuWattage] = useState(machine.psu.wattageW || 600);
  const [psuRating, setPsuRating] = useState(machine.psu.rating || '80+ Bronze');
  const [coolingType, setCoolingType] = useState(machine.cooling.type || 'Air Tower');
  const [coolingTdpW, setCoolingTdpW] = useState(machine.cooling.tdpCapacityW || 120);
  const [ramType, setRamType] = useState(machine.ram.type || 'DDR4');
  const [ramChannels, setRamChannels] = useState(machine.ram.channels || 2);

  // Discovery modal state
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [discoveryCategory, setDiscoveryCategory] = useState<'motherboard' | 'psu' | 'cooling' | undefined>(undefined);

  if (!isOpen) return null;

  const handleApplyDiscovered = (comp: HardwareComponent) => {
    if (comp.category === 'motherboard') {
      setMotherboardModel(comp.model);
      if (comp.specifications.socket) setMotherboardSocket(comp.specifications.socket);
    } else if (comp.category === 'psu') {
      const w = Number(String(comp.specifications.wattage || '').replace(/\D/g, ''));
      if (w) setPsuWattage(w);
      if (comp.specifications.certification) setPsuRating(comp.specifications.certification);
    } else if (comp.category === 'cooling') {
      const tdp = Number(String(comp.specifications.tdpRating || '').replace(/\D/g, ''));
      if (tdp) setCoolingTdpW(tdp);
      if (comp.specifications.type) setCoolingType(comp.specifications.type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Machine = {
      ...machine,
      motherboard: {
        ...machine.motherboard,
        model: motherboardModel || machine.motherboard.model,
        socket: motherboardSocket || machine.motherboard.socket,
        provenance: 'ESTIMATED',
      },
      psu: {
        ...machine.psu,
        wattageW: Number(psuWattage) || machine.psu.wattageW,
        rating: psuRating,
        provenance: 'ESTIMATED',
      },
      cooling: {
        ...machine.cooling,
        type: coolingType as any,
        tdpCapacityW: Number(coolingTdpW) || machine.cooling.tdpCapacityW,
        provenance: 'ESTIMATED',
      },
      ram: {
        ...machine.ram,
        type: ramType as any,
        channels: Number(ramChannels) || machine.ram.channels,
        provenance: machine.ram.provenance === 'SYSTEM_REPORTED' ? 'SYSTEM_REPORTED' : machine.ram.provenance === 'DETECTED' ? 'DETECTED' : 'USER_ENTERED',
      },
    };

    onSaveMachine(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-700 bg-[#0e1219] shadow-2xl flex flex-col font-mono-tech overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#080a0d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                COMPLETAR DATOS FÍSICOS (NO DETECTADOS)
              </span>
              <h3 className="font-display font-black text-white text-base uppercase">
                COMPLETAR COMPONENTES UNKNOWN
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          <p className="text-zinc-400 font-sans-editorial text-xs leading-relaxed">
            Las consultas WMI de Windows no leen la etiqueta física de la fuente ni el modelo exacto del gabinete. Podés ingresar estos datos manualmente para que los cálculos de potencia y disipación sean precisos.
          </p>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-cyan-300">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[11px] leading-tight">¿No conocés los datos técnicos exactos de tu placa, fuente o disipador?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDiscoveryCategory('motherboard');
                setIsDiscoveryOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>BUSCAR EN INTERNET</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {/* Motherboard */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <label className="font-bold text-blue-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Placa Base y Socket
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Modelo de Placa:</span>
                  <input
                    type="text"
                    value={motherboardModel}
                    onChange={(e) => setMotherboardModel(e.target.value)}
                    placeholder="ej: MSI B650 Gaming Plus"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Socket:</span>
                  <input
                    type="text"
                    value={motherboardSocket}
                    onChange={(e) => setMotherboardSocket(e.target.value)}
                    placeholder="ej: AM5 / LGA1700"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* PSU */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <label className="font-bold text-yellow-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Fuente de Poder (PSU)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Potencia en Watts:</span>
                  <input
                    type="number"
                    value={psuWattage}
                    onChange={(e) => setPsuWattage(Number(e.target.value))}
                    placeholder="ej: 650"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Certificación:</span>
                  <input
                    type="text"
                    value={psuRating}
                    onChange={(e) => setPsuRating(e.target.value)}
                    placeholder="ej: 80+ Gold / Bronze"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Cooling */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <label className="font-bold text-sky-400 flex items-center gap-1.5">
                <Fan className="w-4 h-4" /> Disipador / Refrigeración
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Tipo de Refrigeración:</span>
                  <select
                    value={coolingType}
                    onChange={(e) => setCoolingType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 outline-none cursor-pointer"
                  >
                    <option value="Stock Fan">Stock Cooler (Básico)</option>
                    <option value="Air Tower">Torre de Aire (Heatpipes)</option>
                    <option value="AIO Liquid 240mm">Líquida AIO 240mm</option>
                    <option value="AIO Liquid 360mm">Líquida AIO 360mm</option>
                    <option value="Laptop Vapor Chamber">Vapor Chamber / Laptop</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Capacidad Estimada TDP (W):</span>
                  <input
                    type="number"
                    value={coolingTdpW}
                    onChange={(e) => setCoolingTdpW(Number(e.target.value))}
                    placeholder="ej: 180"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* RAM Channels */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <label className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Canales de Memoria RAM
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Generación:</span>
                  <select
                    value={ramType}
                    onChange={(e) => setRamType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 outline-none cursor-pointer"
                  >
                    <option value="DDR4">DDR4</option>
                    <option value="DDR5">DDR5</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Canales Físicos:</span>
                  <select
                    value={ramChannels}
                    onChange={(e) => setRamChannels(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 outline-none cursor-pointer"
                  >
                    <option value={1}>1 (Single Channel 64-bit)</option>
                    <option value={2}>2 (Dual Channel 128-bit)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs cursor-pointer transition-colors"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer transition-all flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              GUARDAR ESPECIFICACIÓN
            </button>
          </div>
        </form>

        {/* Embedded Discovery Modal */}
        <EvoHardwareDiscoveryModal
          isOpen={isDiscoveryOpen}
          onClose={() => setIsDiscoveryOpen(false)}
          categoryFilter={discoveryCategory}
          onComponentIncorporated={handleApplyDiscovered}
        />
      </div>
    </div>
  );
};
