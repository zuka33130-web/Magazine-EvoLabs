import React, { useState } from 'react';
import { EvoLabZone, UserHardwarePassport } from '../../../types';
import { EVO_WORLD_ZONES } from '../../../data/evoWorldData';
import { EvoOperatingModeSelector } from '../../common/EvoOperatingModeSelector';
import { Lab01CentralIncidentes } from './Lab01CentralIncidentes';
import { Lab02TallerRendimiento } from './Lab02TallerRendimiento';
import { Lab03ArchivoEvo } from './Lab03ArchivoEvo';
import { Lab04CamaraExperimentos } from './Lab04CamaraExperimentos';
import { Lab05SalaMaquinas } from './Lab05SalaMaquinas';
import { Lab06ZonaRestringida } from './Lab06ZonaRestringida';
import { Lab07MiLaboratorio } from './Lab07MiLaboratorio';
import { Lab08ComunidadEvo } from './Lab08ComunidadEvo';
import { 
  ArrowLeft, 
  Layers, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  Grid, 
  LayoutDashboard,
  ShieldAlert,
  Gauge,
  BookOpen,
  FlaskConical,
  Terminal,
  Wrench,
  Users
} from 'lucide-react';

interface EvoLabConsoleProps {
  initialZoneId: string;
  passport: UserHardwarePassport | null;
  onBackToMap: () => void;
  onEnterTomo01: () => void;
  onEnterMagazine: () => void;
  onEnterTomo02: () => void;
  onEnterTomo03: () => void;
  onEnterTomo04: () => void;
}

export const EvoLabConsole: React.FC<EvoLabConsoleProps> = ({
  initialZoneId,
  passport,
  onBackToMap,
  onEnterTomo01,
  onEnterMagazine,
  onEnterTomo02,
  onEnterTomo03,
  onEnterTomo04,
}) => {
  const [activeZoneId, setActiveZoneId] = useState<string>(initialZoneId || 'zona-1');

  const zoneIcons: Record<string, any> = {
    'zona-1': ShieldAlert,
    'zona-2': Gauge,
    'zona-3': BookOpen,
    'zona-4': FlaskConical,
    'zona-5': Terminal,
    'zona-6': Lock,
    'zona-7': Wrench,
    'zona-8': Radio,
  };

  const currentZone = EVO_WORLD_ZONES.find((z) => z.id === activeZoneId) || EVO_WORLD_ZONES[0];

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-[#09090b] text-[#f4f4f5] p-4 sm:p-8 font-sans-editorial space-y-6">
      
      {/* Top Console Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d0f17] border border-zinc-800 p-3.5 sm:p-4 rounded-2xl shadow-xl">
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMap}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-700 font-mono-tech text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLVER AL PLANO ESPACIAL</span>
          </button>

          <span className="hidden sm:inline text-zinc-600">/</span>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono-tech">
            <span className="text-zinc-400">OPERANDO EN:</span>
            <span className="font-bold text-white uppercase bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
              {currentZone.title} (ZONA {currentZone.number})
            </span>
          </div>

          <div className="hidden lg:flex items-center">
            <EvoOperatingModeSelector compact />
          </div>
        </div>

        {/* Rapid Zone Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {EVO_WORLD_ZONES.map((zone) => {
            const Icon = zoneIcons[zone.id] || Layers;
            const isActive = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZoneId(zone.id)}
                title={zone.title}
                className={`px-2.5 py-1.5 rounded-lg font-mono-tech text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                    : 'bg-zinc-950/80 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">ZONA {zone.number}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Render Active Lab View */}
      <div className="w-full">
        {activeZoneId === 'zona-1' && <Lab01CentralIncidentes />}
        {activeZoneId === 'zona-2' && <Lab02TallerRendimiento />}
        {activeZoneId === 'zona-3' && (
          <Lab03ArchivoEvo
            onEnterTomo01={onEnterTomo01}
            onEnterMagazine={onEnterMagazine}
            onEnterTomo02={onEnterTomo02}
            onEnterTomo03={onEnterTomo03}
            onEnterTomo04={onEnterTomo04}
          />
        )}
        {activeZoneId === 'zona-4' && <Lab04CamaraExperimentos />}
        {activeZoneId === 'zona-5' && <Lab05SalaMaquinas />}
        {activeZoneId === 'zona-6' && <Lab06ZonaRestringida />}
        {activeZoneId === 'zona-7' && <Lab07MiLaboratorio passport={passport} />}
        {activeZoneId === 'zona-8' && <Lab08ComunidadEvo />}
      </div>

    </div>
  );
};
