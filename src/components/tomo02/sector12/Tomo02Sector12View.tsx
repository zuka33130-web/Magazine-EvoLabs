import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Search,
  AlertTriangle,
  FileText,
  Terminal,
  Activity,
  Copy,
  Check,
  Shield,
  HardDrive,
  Layers,
  Code,
} from 'lucide-react';

import {
  SECTOR_12_INVESTIGATIONS,
  Sector12Investigation,
} from '../../../data/tomo02Sector12Data';
import { Sector12VisualDiagrams } from './Sector12VisualDiagrams';
import { Tomo02Sector12MiniCasesModal } from './Tomo02Sector12MiniCasesModal';
import { Tomo02Sector12TestView } from './Tomo02Sector12TestView';
import { Tomo02Sector12MissionView } from './Tomo02Sector12MissionView';

interface Tomo02Sector12ViewProps {
  onBackToMagazine: () => void;
  onOpenSector00?: () => void;
  onOpenSector01?: () => void;
  onOpenSector02?: () => void;
  onOpenSector03?: () => void;
  onOpenSector04?: () => void;
  onOpenSector05?: () => void;
  onOpenSector06?: () => void;
  onOpenSector07?: () => void;
  onOpenSector08?: () => void;
  onOpenSector09?: () => void;
  onOpenSector10?: () => void;
  onOpenSector11?: () => void;
  onOpenSector13?: () => void;
}

export const Tomo02Sector12View: React.FC<Tomo02Sector12ViewProps> = ({
  onBackToMagazine,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'mission' | 'test'>('reader');
  const [selectedInvCode, setSelectedInvCode] = useState<string>('12.01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState<boolean>(false);
  const [completedInvs, setCompletedInvs] = useState<string[]>([]);

  const investigations = SECTOR_12_INVESTIGATIONS;

  const currentInv: Sector12Investigation =
    investigations.find((i) => i.code === selectedInvCode) || investigations[0];

  const filteredInvs = investigations.filter(
    (i) =>
      i.code.includes(searchQuery) ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.targetComponent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleInvCompletion = (code: string) => {
    setCompletedInvs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  if (activeTab === 'mission') {
    return <Tomo02Sector12MissionView onBackToReader={() => setActiveTab('reader')} />;
  }

  if (activeTab === 'test') {
    return <Tomo02Sector12TestView onBackToReader={() => setActiveTab('reader')} />;
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans pb-16">
      {/* Top Header Nav */}
      <header className="sticky top-0 z-30 bg-[#080B10]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToMagazine}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VOLVER AL ÍNDICE</span>
            </button>

            <div className="h-4 w-px bg-zinc-800" />

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-mono text-[10px] font-bold">
                SECTOR 12
              </span>
              <span className="text-xs font-bold text-zinc-200 hidden md:inline uppercase tracking-tight">
                DISCOS Y PARTICIONES
              </span>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Investigaciones</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mission')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'mission'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Virtual Disk Lab</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('test')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'test'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Examen</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMiniCasesOpen(true)}
              className="px-3 py-1 rounded-lg text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Casos</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Sector Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-950 border border-cyan-800/40 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                  NIVEL II · ADMINISTRAR WINDOWS
                </span>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  25 / 25 INVESTIGACIONES DESARROLLADAS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 font-sans tracking-tight">
                SECTOR 12 — DISCOS Y PARTICIONES
              </h2>

              <p className="text-sm text-zinc-400 max-w-2xl font-mono">
                Subtítulo Canónico: <span className="text-zinc-200">De “C:” a entender realmente el almacenamiento</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-center font-mono">
                <span className="text-[10px] text-zinc-500 uppercase block">Progreso Sector</span>
                <span className="text-lg font-bold text-cyan-400">
                  {completedInvs.length} / {investigations.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Visual Diagram Component */}
        <Sector12VisualDiagrams />

        {/* Reader Layout: Left Sidebar + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Investigation list */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por código, comando o título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1">
              {filteredInvs.map((inv) => {
                const isSelected = inv.code === currentInv.code;
                const isDone = completedInvs.includes(inv.code);

                return (
                  <button
                    key={inv.code}
                    onClick={() => setSelectedInvCode(inv.code)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-200 shadow-md'
                        : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                        {inv.code}
                      </span>
                      <span className="text-xs font-medium truncate">{inv.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                      <span className={`px-1 rounded ${
                        inv.riskLevel === 'SAFE_READONLY' ? 'bg-emerald-950/60 text-emerald-400' :
                        inv.riskLevel === 'LOW_RISK' ? 'bg-cyan-950/60 text-cyan-400' :
                        inv.riskLevel === 'MODIFIES_STATE' ? 'bg-amber-950/60 text-amber-400' :
                        'bg-rose-950/60 text-rose-400'
                      }`}>
                        {inv.riskLevel === 'SAFE_READONLY' ? 'SAFE' : inv.riskLevel}
                      </span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Investigation Display */}
          <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    INVESTIGACIÓN {currentInv.code}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">//</span>
                  <span className="text-xs font-mono text-zinc-400">{currentInv.targetComponent}</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 font-sans">{currentInv.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 font-mono">{currentInv.subtitle}</p>
              </div>

              <button
                onClick={() => toggleInvCompletion(currentInv.code)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  completedInvs.includes(currentInv.code)
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedInvs.includes(currentInv.code) ? 'COMPLETADO' : 'MARCAR COMPLETADO'}</span>
              </button>
            </div>

            {/* Hook */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                HOOK // PUNTO DE PARTIDA
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">{currentInv.descubri.hook}</p>
            </div>

            {/* Myth vs Truth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold">
                  MITO / CREENCIA COMÚN
                </span>
                <p className="text-xs text-rose-200/90 leading-relaxed">{currentInv.descubri.mythVsTruth.mentira}</p>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                  VERDAD TÉCNICA
                </span>
                <p className="text-xs text-emerald-200/90 leading-relaxed">{currentInv.descubri.mythVsTruth.verdad}</p>
              </div>
            </div>

            {/* Technical explanation blocks */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-4 text-xs leading-relaxed">
              <div>
                <h4 className="font-bold text-cyan-400 font-mono mb-1 uppercase tracking-wider">¿QUÉ ES EXACTAMENTE?</h4>
                <p className="text-zinc-300">{currentInv.entende.queEs}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/60">
                <h4 className="font-bold text-cyan-400 font-mono mb-1 uppercase tracking-wider">¿PARA QUÉ SIRVE EN WINDOWS?</h4>
                <p className="text-zinc-300">{currentInv.entende.paraQueSirve}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/60">
                <h4 className="font-bold text-cyan-400 font-mono mb-1 uppercase tracking-wider">¿QUÉ PASA SI FALTA O FALLA?</h4>
                <p className="text-zinc-300">{currentInv.entende.quePasaSiFalta}</p>
              </div>
            </div>

            {/* Commands section */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                INTERACCIÓN DE LÍNEA DE COMANDOS Y POWERSHELL
              </span>

              <div className="space-y-1">
                <span className="text-[11px] text-cyan-400 block">Comando Nativo CLI:</span>
                <div className="flex items-center justify-between p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-200">
                  <code className="text-xs truncate pr-2">{currentInv.interactua.cliExample}</code>
                  <button
                    onClick={() => handleCopy(currentInv.interactua.cliExample, 'cli')}
                    className="p-1 hover:text-cyan-400 text-zinc-500 transition-colors cursor-pointer"
                  >
                    {copiedCmd === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-cyan-400 block">Alternativa PowerShell:</span>
                <div className="flex items-center justify-between p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-200">
                  <code className="text-xs truncate pr-2">{currentInv.interactua.psExample}</code>
                  <button
                    onClick={() => handleCopy(currentInv.interactua.psExample, 'ps')}
                    className="p-1 hover:text-cyan-400 text-zinc-500 transition-colors cursor-pointer"
                  >
                    {copiedCmd === 'ps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
                <strong className="text-zinc-300">Métricas Técnicas:</strong> <span className="text-cyan-300 font-mono">{currentInv.interactua.technicalMetrics}</span>
              </div>

              <div className="text-[11px] text-zinc-400">
                <strong className="text-zinc-300">Qué mirar:</strong> {currentInv.interactua.whatToLookFor}
              </div>
            </div>

            {/* Warnings */}
            <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>CLASIFICACIÓN DE RIESGO: {currentInv.riskLevel}</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed">{currentInv.alertaEVO.safetyWarning}</p>
              <div className="text-[11px] text-zinc-400 font-mono pt-1">
                Regla de reversibilidad: {currentInv.alertaEVO.reversibilityRule}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mini Cases Modal */}
      <Tomo02Sector12MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
