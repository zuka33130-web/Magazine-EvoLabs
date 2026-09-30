import React from 'react';
import { ArchiveShelvesSvg } from '../../assets/evo-world/LabIllustrations';
import { Tome01DossierSummary } from '../../types';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Circle,
  FileText,
  MapPin,
  ChevronLeft,
} from 'lucide-react';

interface EvoArchiveEntranceProps {
  onEnterTome01: () => void;
  onEnterMagazine?: () => void;
  onEnterTome02?: () => void;
  onEnterTome03?: () => void;
  onEnterTome04?: () => void;
  onEnterTome08?: () => void;
  onEnterBootLab?: () => void;
  onBackToMap: () => void;
  dossierSummary: Tome01DossierSummary;
}

export const EvoArchiveEntrance: React.FC<EvoArchiveEntranceProps> = ({
  onEnterTome01,
  onEnterMagazine,
  onEnterTome02,
  onEnterTome03,
  onEnterTome04,
  onEnterTome08,
  onEnterBootLab,
  onBackToMap,
  dossierSummary,
}) => {
  const chapters = [
    { num: '01', title: 'Pasaporte de Hardware', field: 'passport' },
    { num: '02', title: 'Mapa de Flujo de Recursos', field: 'flowMap' },
    { num: '03', title: 'Perfil de Fluidez & Frametimes', field: 'fluidezProfile' },
    { num: '04', title: 'Matriz de Limitaciones Físicas', field: 'limitMatrix' },
    { num: '05', title: 'Mapa de Actividad Oculta', field: 'activityMap' },
    { num: '06', title: 'Bitácora de Optimización Medida', field: 'optimizationLog' },
    { num: '07', title: 'Diagnóstico de Caso Anómalo', field: 'diagnosticCase' },
  ];

  const completedCount = chapters.filter(
    (c) => (dossierSummary as any)[c.field]
  ).length;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6 select-none font-sans-editorial">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-6 font-mono-tech text-xs text-zinc-500">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>MUNDO EVO</span>
        </button>
        <span>/</span>
        <span className="text-zinc-300">ARCHIVO EVO</span>
        <span>/</span>
        <span className="text-amber-400 font-bold">TOMOS DE INVESTIGACIÓN</span>
      </div>

      {/* Hero Sector Presentation Header */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 font-mono-tech text-xs text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              SECTOR 03 // ARCHIVO TÉCNICO VIVO
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
              ARCHIVO EVO
            </h1>

            <div className="font-mono-tech text-sm sm:text-base font-bold text-amber-400 uppercase tracking-wide">
              "TODO LO QUE DESCUBRIMOS QUEDA ACÁ."
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
              La biblioteca documental de metodologías, pruebas periciales y arquitectura de hardware.
              En este sector reside la colección oficial de tomos. Tu propia PC es el sujeto de análisis en cada lección práctica.
            </p>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 sm:w-56 p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-lg">
              <ArchiveShelvesSvg isHovered />
            </div>
          </div>
        </div>
      </div>

      {/* Available Tomes Shelf */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-xl text-white tracking-tight">
              TOMO DISPONIBLE
            </h2>
          </div>
          <span className="font-mono-tech text-xs text-zinc-500">
            {completedCount}/7 CAPÍTULOS COMPLETADOS
          </span>
        </div>

        {/* TOMO 01 Primary Entrance Card */}
        <div className="relative rounded-xl border-2 border-amber-400/80 bg-zinc-950 p-6 sm:p-8 shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all hover:border-amber-400">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-amber-400 text-zinc-950 font-mono-tech text-xs font-black uppercase">
                  TOMO 01
                </span>
                <span className="font-mono-tech text-xs text-amber-400 uppercase font-semibold">
                  EDICIÓN MAESTRA // DISPONIBLE
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight uppercase">
                CONOCÉ TU PC
              </h3>

              <p className="text-zinc-300 text-sm leading-relaxed">
                Plataforma editorial interactiva para aprender arquitectura de computadoras, flujo de buses, telemetría y diagnóstico forense utilizando tu propia PC como laboratorio sin trucos de magia.
              </p>

              {/* Progress summary pill bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
                {chapters.map((chap) => {
                  const isDone = (dossierSummary as any)[chap.field];
                  return (
                    <div
                      key={chap.num}
                      className={`p-2 rounded border text-center font-mono-tech text-[10px] ${
                        isDone
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-center gap-1">
                        {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Circle className="w-2.5 h-2.5" />}
                        <span>CAP 0{chap.num}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch CTA Button */}
            <div className="flex flex-col gap-2.5 min-w-[240px]">
              <button
                id="evo-btn-enter-tomo-01"
                onClick={onEnterTome01}
                className="group w-full py-3.5 px-6 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-black text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(234,179,8,0.35)] cursor-pointer"
              >
                <span>ENTRAR AL TOMO 01</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              {onEnterMagazine && (
                <button
                  id="evo-btn-enter-magazine-a4"
                  onClick={onEnterMagazine}
                  className="w-full py-2.5 px-4 rounded-lg bg-yellow-400/15 hover:bg-yellow-400/25 border border-yellow-400/50 text-yellow-300 font-mono-tech text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-yellow-400" />
                  <span>REVISTA A4 (PDF READY)</span>
                </button>
              )}

              <button
                onClick={onBackToMap}
                className="w-full py-2 px-4 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 font-mono-tech text-xs transition-colors cursor-pointer text-center"
              >
                VOLVER AL MAPA GENERAL
              </button>
            </div>
          </div>
        </div>

        {/* Active Volumes Shelf: Tomo 02, Tomo 03, Tomo 04 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* TOMO 02 */}
          <div className="p-5 rounded-xl border border-cyan-500/30 bg-zinc-950/80 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-mono-tech text-[10px] text-cyan-400 uppercase mb-1">
                <span className="font-bold">TOMO 02 // DISPONIBLE</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[9px]">40 PÁGINAS A4</span>
              </div>
              <div className="font-display font-bold text-lg text-white">
                LA BIBLIA NEGRA DE WINDOWS
              </div>
              <p className="font-sans-editorial text-xs text-zinc-400 mt-1 leading-relaxed">
                30 cirugías sin reinstalar el sistema: BSODs, registro, telemetría, DPC latency y kernel.
              </p>
            </div>
            {onEnterTome02 && (
              <button
                type="button"
                onClick={onEnterTome02}
                className="w-full py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                <span>ABRIR TOMO 02</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* TOMO 03 */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-zinc-950/80 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-mono-tech text-[10px] text-emerald-400 uppercase mb-1">
                <span className="font-bold">TOMO 03 // DISPONIBLE</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[9px]">48 PÁGINAS A4</span>
              </div>
              <div className="font-display font-bold text-lg text-white">
                REPARÁ TU PC // BANCO
              </div>
              <p className="font-sans-editorial text-xs text-zinc-400 mt-1 leading-relaxed">
                32 módulos de banco: fuentes ATX, multímetro pericial, Q-LEDs, bucles de reinicio y VRMs.
              </p>
            </div>
            {onEnterTome03 && (
              <button
                type="button"
                onClick={onEnterTome03}
                className="w-full py-2 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                <span>ABRIR TOMO 03</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* TOMO 04 */}
          <div className="p-5 rounded-xl border border-purple-500/30 bg-zinc-950/80 hover:border-purple-400 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-mono-tech text-[10px] text-purple-400 uppercase mb-1">
                <span className="font-bold">TOMO 04 // DISPONIBLE</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-[9px]">50 PÁGINAS A4</span>
              </div>
              <div className="font-display font-bold text-lg text-white">
                REPARÁ TU NOTEBOOK
              </div>
              <p className="font-sans-editorial text-xs text-zinc-400 mt-1 leading-relaxed">
                33 módulos portátiles: micromecánica, cargadores, DC Jack, baterías Li-Po, flex eDP y térmico.
              </p>
            </div>
            {onEnterTome04 && (
              <button
                type="button"
                onClick={onEnterTome04}
                className="w-full py-2 px-3 rounded-lg bg-purple-400 hover:bg-purple-300 text-black font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              >
                <span>ABRIR TOMO 04</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* TOMO 08 */}
          <div className="p-5 rounded-xl border border-emerald-500/40 bg-zinc-950/80 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between font-mono-tech text-[10px] text-emerald-400 uppercase mb-1">
                <span className="font-bold">TOMO 08 // DISPONIBLE</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[9px]">REVISTA A4 + LAB</span>
              </div>
              <div className="font-display font-bold text-lg text-white">
                DEL BOTÓN POWER A WINDOWS
              </div>
              <p className="font-sans-editorial text-xs text-zinc-400 mt-1 leading-relaxed">
                Secuencia completa de arranque: +5VSB, PWR_SW, PS_ON#, VRM, reset de CPU, SPI, POST, RAM, PCIe, UEFI, winload y kernel NT.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {onEnterTome08 && (
                <button
                  type="button"
                  onClick={onEnterTome08}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  <span>REVISTA A4</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onEnterBootLab && (
                <button
                  type="button"
                  onClick={onEnterBootLab}
                  className="flex-1 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-300 font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>LABORATORIO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
