import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Award,
  ArrowLeft,
  Search,
  AlertTriangle,
  FileText,
  Terminal,
  Activity,
  Copy,
  Check,
  Zap,
  Shield,
} from 'lucide-react';

import {
  SECTOR_10_INVESTIGATIONS,
  Sector10Investigation,
} from '../../../data/tomo02Sector10Data';
import { Sector10VisualDiagrams } from './Sector10VisualDiagrams';
import { Tomo02Sector10MiniCasesModal } from './Tomo02Sector10MiniCasesModal';
import { Tomo02Sector10TestView } from './Tomo02Sector10TestView';
import { Tomo02Sector10MissionView } from './Tomo02Sector10MissionView';

interface Tomo02Sector10ViewProps {
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
}

export const Tomo02Sector10View: React.FC<Tomo02Sector10ViewProps> = ({
  onBackToMagazine,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'mission' | 'test'>('reader');
  const [selectedInvCode, setSelectedInvCode] = useState<string>('10.01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState<boolean>(false);
  const [completedInvs, setCompletedInvs] = useState<string[]>([]);

  const investigations = SECTOR_10_INVESTIGATIONS;

  const currentInv: Sector10Investigation =
    investigations.find((i) => i.code === selectedInvCode) || investigations[0];

  const filteredInvs = investigations.filter(
    (i) =>
      i.code.includes(searchQuery) ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.cmdletName.toLowerCase().includes(searchQuery.toLowerCase())
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
    return <Tomo02Sector10MissionView onBackToReader={() => setActiveTab('reader')} />;
  }

  if (activeTab === 'test') {
    return <Tomo02Sector10TestView onBackToReader={() => setActiveTab('reader')} />;
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

            <div>
              <span className="text-[10px] font-mono font-bold text-blue-400 tracking-wider uppercase block">
                EVO LABS // TOMO 02
              </span>
              <h1 className="text-xs font-bold text-zinc-100 font-mono tracking-tight">
                SECTOR 10 — POWERSHELL
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMiniCasesOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">CASOS DE ESTUDIO</span>
            </button>

            <button
              onClick={() => setActiveTab('mission')}
              className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">LAB CANÓNICO</span>
            </button>

            <button
              onClick={() => setActiveTab('test')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden md:inline">EXAMEN CERTIFICACIÓN</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Sector Banner */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-bold border border-blue-500/20">
                  FASE C10
                </span>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  30 / 30 INVESTIGACIONES DESARROLLADAS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 font-sans tracking-tight">
                SECTOR 10 — POWERSHELL
              </h2>

              <p className="text-sm text-zinc-400 max-w-2xl font-mono">
                Subtítulo Canónico: <span className="text-zinc-200">La herramienta que convierte al usuario en administrador</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-center font-mono">
                <span className="text-[10px] text-zinc-500 uppercase block">Progreso Sector</span>
                <span className="text-lg font-bold text-blue-400">
                  {completedInvs.length} / {investigations.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Visual Diagram Component */}
        <Sector10VisualDiagrams />

        {/* Reader Layout: Left Sidebar + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Investigation list */}
          <div className="lg:col-span-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por código, cmdlet o título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* List */}
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
                        ? 'bg-blue-600/15 border-blue-500/50 text-blue-200 shadow-md'
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
                        inv.riskLevel === 'LOW_RISK' ? 'bg-blue-950/60 text-blue-400' :
                        'bg-amber-950/60 text-amber-400'
                      }`}>
                        {inv.riskLevel === 'SAFE_READONLY' ? 'SAFE' : inv.riskLevel}
                      </span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Investigation Display */}
          <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Inv Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-blue-400 font-bold">
                    INVESTIGACIÓN {currentInv.code}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">//</span>
                  <span className="text-xs font-mono text-zinc-400">{currentInv.cmdletName}</span>
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
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block">
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
                <h4 className="font-bold text-blue-400 font-mono mb-1 uppercase tracking-wider">¿QUÉ ES EXACTAMENTE?</h4>
                <p className="text-zinc-300">{currentInv.entende.queEs}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/60">
                <h4 className="font-bold text-blue-400 font-mono mb-1 uppercase tracking-wider">¿PARA QUÉ SIRVE EN WINDOWS?</h4>
                <p className="text-zinc-300">{currentInv.entende.paraQueSirve}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/60">
                <h4 className="font-bold text-blue-400 font-mono mb-1 uppercase tracking-wider">¿QUÉ PASA SI FALTA O FALLA?</h4>
                <p className="text-zinc-300">{currentInv.entende.quePasaSiFalta}</p>
              </div>
            </div>

            {/* Commands section */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                INTERACCIÓN POWERSHELL Y OBJETO RETORNADO
              </span>

              <div className="space-y-1">
                <span className="text-[11px] text-blue-400 block">Cmdlet de Muestra:</span>
                <div className="flex items-center justify-between p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-200">
                  <code className="text-xs truncate pr-2">{currentInv.interactua.psExample}</code>
                  <button
                    onClick={() => handleCopy(currentInv.interactua.psExample, 'ps')}
                    className="p-1 hover:text-blue-400 text-zinc-500 transition-colors cursor-pointer"
                  >
                    {copiedCmd === 'ps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
                <strong className="text-zinc-300">Tipo de Objeto Retornado:</strong> <span className="text-blue-300 font-mono">{currentInv.interactua.objectTypeReturned}</span>
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
      <Tomo02Sector10MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
