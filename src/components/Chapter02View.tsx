import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Award,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import {
  UserPcSpec,
  UserPcEvidenceMap,
  Lab02ExperimentData,
} from '../types';
import { InheritedPassportBanner } from './chapter02/InheritedPassportBanner';
import { Station01Journey } from './chapter02/Station01Journey';
import { Station02Memory } from './chapter02/Station02Memory';
import { Station03Graphics } from './chapter02/Station03Graphics';
import { Station04Storage } from './chapter02/Station04Storage';
import { Station05Lab } from './chapter02/Station05Lab';

interface Chapter02ViewProps {
  onBackToIndex: () => void;
  onChapterCompleted: () => void;
  isCompleted?: boolean;
  initialStation?: Chapter02Station;
  onOpenChapter03?: () => void;
}

export type Chapter02Station =
  | 'journey'
  | 'memory'
  | 'graphics'
  | 'storage'
  | 'lab';

interface StationMeta {
  id: Chapter02Station;
  number: string;
  label: string;
  subtitle: string;
}

const STATIONS: StationMeta[] = [
  { id: 'journey', number: '01', label: 'EL VIAJE', subtitle: 'Del clic al píxel' },
  { id: 'memory', number: '02', label: 'MEMORIA', subtitle: 'CPU + RAM' },
  { id: 'graphics', number: '03', label: 'GRÁFICOS', subtitle: 'CPU + GPU' },
  { id: 'storage', number: '04', label: 'ALMACENAMIENTO', subtitle: 'SSD/HDD + RAM' },
  { id: 'lab', number: '05', label: 'LABORATORIO', subtitle: 'Mapa de Flujo 001' },
];

export const Chapter02View: React.FC<Chapter02ViewProps> = ({
  onBackToIndex,
  onChapterCompleted,
  initialStation,
  onOpenChapter03,
}) => {
  // Load inherited specs from Chapter 01
  const [specs, setSpecs] = useState<UserPcSpec>(() => {
    try {
      const saved =
        localStorage.getItem('evo_c01_specs') ||
        localStorage.getItem('evo_user_pc_specs');
      return saved
        ? JSON.parse(saved)
        : {
            cpu: '',
            ram: '',
            gpu: '',
            storage: '',
            motherboard: '',
            os: '',
            monitor: '',
            peripherals: '',
          };
    } catch {
      return {
        cpu: '',
        ram: '',
        gpu: '',
        storage: '',
        motherboard: '',
        os: '',
        monitor: '',
        peripherals: '',
      };
    }
  });

  const [evidenceMap, setEvidenceMap] = useState<UserPcEvidenceMap | undefined>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_evidence');
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  });

  // Active Station state
  const [activeStation, setActiveStation] = useState<Chapter02Station>(() => {
    try {
      const saved = localStorage.getItem('evo_c02_active_station');
      if (
        saved === 'journey' ||
        saved === 'memory' ||
        saved === 'graphics' ||
        saved === 'storage' ||
        saved === 'lab'
      ) {
        return saved;
      }
    } catch {}
    return 'journey';
  });

  // Completed stations
  const [completedStations, setCompletedStations] = useState<Set<Chapter02Station>>(() => {
    try {
      const saved = localStorage.getItem('evo_c02_completed_stations');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Lab experiment data
  const [labData, setLabData] = useState<Lab02ExperimentData | undefined>(() => {
    try {
      const saved = localStorage.getItem('evo_c02_lab_data');
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  });

  // Chapter 02 completion flag
  const [isChapterFinished, setIsChapterFinished] = useState<boolean>(() => {
    try {
      return localStorage.getItem('evo_c02_status') === 'completed';
    } catch {
      return false;
    }
  });

  // Synchronize specs with storage if user updated Chapter 01
  useEffect(() => {
    const handleStorage = () => {
      try {
        const savedSpecs =
          localStorage.getItem('evo_c01_specs') ||
          localStorage.getItem('evo_user_pc_specs');
        if (savedSpecs) setSpecs(JSON.parse(savedSpecs));

        const savedEvidence = localStorage.getItem('evo_c01_evidence');
        if (savedEvidence) setEvidenceMap(JSON.parse(savedEvidence));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Handle initialStation prop change
  useEffect(() => {
    if (initialStation) {
      setActiveStation(initialStation);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialStation]);

  // Save progress on station switch
  useEffect(() => {
    try {
      localStorage.setItem('evo_c02_active_station', activeStation);
      localStorage.setItem(
        'evo_c02_completed_stations',
        JSON.stringify(Array.from(completedStations))
      );
    } catch (e) {
      console.error(e);
    }
  }, [activeStation, completedStations]);

  // Handle station completion
  const handleCompleteStation = (station: Chapter02Station, nextStation?: Chapter02Station) => {
    setCompletedStations((prev) => new Set([...prev, station]));
    if (nextStation) {
      setActiveStation(nextStation);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Lab data save handler
  const handleSaveLabData = (data: Lab02ExperimentData) => {
    setLabData(data);
    try {
      localStorage.setItem('evo_c02_lab_data', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  // Finish Chapter 02
  const handleFinishLab = () => {
    setCompletedStations(new Set(['journey', 'memory', 'graphics', 'storage', 'lab']));
    setIsChapterFinished(true);
    try {
      localStorage.setItem('evo_c02_status', 'completed');
      localStorage.setItem(
        'evo_c02_completed_stations',
        JSON.stringify(['journey', 'memory', 'graphics', 'storage', 'lab'])
      );
    } catch (e) {
      console.error(e);
    }
    onChapterCompleted();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 text-[#f4f4f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Breadcrumbs & Back Navigation */}
        <nav className="flex items-center justify-between pb-5 border-b border-zinc-800/60">
          <button
            type="button"
            onClick={onBackToIndex}
            className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
            id="btn-volver-indice-c02"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
            <span>← VOLVER A ÍNDICE DEL TOMO 01</span>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono-tech">
            <span className="w-2 h-2 bg-yellow-400 inline-block" />
            <span className="tracking-widest uppercase text-white font-bold">
              TOMO 01 // CAPÍTULO 02
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-yellow-400 font-semibold tracking-wider">
              {isChapterFinished ? 'CAPÍTULO CONCLUIDO' : 'INVESTIGACIÓN ACTIVA'}
            </span>
          </div>
        </nav>

        {/* Inherited Evidence Banner from Chapter 01 */}
        <InheritedPassportBanner specs={specs} evidenceMap={evidenceMap} />

        {/* Chapter 02 Title & Editorial Framing */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-zinc-400">
            <span>TOMO 01 // CONOCÉ TU PC</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold">CAPÍTULO 02</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
            CÓMO TRABAJAN JUNTOS
          </h1>

          <div className="p-5 rounded-2xl bg-[#121318] border-l-4 border-yellow-400 space-y-2">
            <p className="font-sans-editorial text-lg text-white font-medium italic">
              “Una PC no es una colección de piezas aisladas.
              <br />
              <span className="text-yellow-400 font-bold not-italic">
                Es un sistema de datos que se mueven, esperan, se transforman y se entregan.”
              </span>
            </p>
            <p className="text-xs font-mono-tech text-zinc-400">
              El Capítulo 01 respondió: <em>¿Qué componentes tiene mi PC?</em> El Capítulo 02 investiga: <em>¿Cómo colaboran esos componentes entre sí?</em>
            </p>
          </div>
        </div>

        {/* Five-Station Navigation Bar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#101115] border border-zinc-800/80 shadow-xl overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[720px] gap-2">
            {STATIONS.map((station) => {
              const isCurrent = activeStation === station.id;
              const isDone = completedStations.has(station.id);

              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => setActiveStation(station.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 border ${
                    isCurrent
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-md font-bold'
                      : isDone
                      ? 'bg-zinc-900/90 text-zinc-200 border-zinc-700/80 hover:border-yellow-400/50'
                      : 'bg-black/30 text-zinc-500 border-zinc-900 hover:text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`font-mono-tech text-[10px] ${
                          isCurrent ? 'text-black/80 font-bold' : 'text-zinc-500'
                        }`}
                      >
                        {station.number}
                      </span>
                      <span className="text-xs font-mono-tech uppercase tracking-tight truncate">
                        {station.label}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-sans-editorial block truncate ${
                        isCurrent ? 'text-black/80 font-medium' : 'text-zinc-500'
                      }`}
                    >
                      {station.subtitle}
                    </span>
                  </div>

                  <span className="text-xs shrink-0 font-mono-tech">
                    {isDone ? (
                      <CheckCircle2
                        className={`w-4 h-4 ${isCurrent ? 'text-black' : 'text-yellow-400'}`}
                      />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse inline-block" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full border border-zinc-600 inline-block" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chapter 02 Finished State Banner (when completed) */}
        {isChapterFinished && (
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-zinc-900 to-black border-2 border-yellow-400 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono-tech tracking-widest uppercase font-bold">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>CAPÍTULO 02 CONCLUIDO CON ÉXITO // EVIDENCIA REGISTRADA</span>
              </div>
              <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded bg-yellow-400 text-black font-bold uppercase">
                MAPA 001 INTEGRADO
              </span>
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              EL SISTEMA ESTÁ EN MOVIMIENTO
            </h3>

            <p className="font-sans-editorial text-sm sm:text-base text-zinc-200 leading-relaxed">
              Completaste las 5 estaciones del Capítulo 02. Ahora entendés cómo tus componentes dialogan en cada instante, desde la pulsación de una tecla hasta la rasterización en tu pantalla.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {onOpenChapter03 && (
                <button
                  type="button"
                  id="btn-c02-abrir-c03"
                  onClick={onOpenChapter03}
                  className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 cursor-pointer transition-colors shadow-lg inline-flex items-center gap-2"
                >
                  <span>ABRIR CAPÍTULO 03</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              )}
              <button
                type="button"
                onClick={onBackToIndex}
                className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 cursor-pointer transition-colors shadow-lg"
              >
                REGRESAR AL ÍNDICE EDITORIAL
              </button>
              <button
                type="button"
                onClick={() => setActiveStation('journey')}
                className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-mono-tech font-bold text-xs uppercase hover:bg-zinc-700 cursor-pointer transition-colors border border-zinc-700 inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>REPASAR ESTACIONES</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Station Render */}
        <main className="pt-2">
          {activeStation === 'journey' && (
            <Station01Journey
              specs={specs}
              onComplete={() => handleCompleteStation('journey', 'memory')}
              isCompleted={completedStations.has('journey')}
            />
          )}

          {activeStation === 'memory' && (
            <Station02Memory
              specs={specs}
              evidenceMap={evidenceMap}
              onComplete={() => handleCompleteStation('memory', 'graphics')}
              isCompleted={completedStations.has('memory')}
            />
          )}

          {activeStation === 'graphics' && (
            <Station03Graphics
              specs={specs}
              onComplete={() => handleCompleteStation('graphics', 'storage')}
              isCompleted={completedStations.has('graphics')}
            />
          )}

          {activeStation === 'storage' && (
            <Station04Storage
              specs={specs}
              onComplete={() => handleCompleteStation('storage', 'lab')}
              isCompleted={completedStations.has('storage')}
            />
          )}

          {activeStation === 'lab' && (
            <Station05Lab
              specs={specs}
              initialLabData={labData}
              onSaveLabData={handleSaveLabData}
              onFinishLab={handleFinishLab}
              isCompleted={completedStations.has('lab')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
