import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Search,
  AlertTriangle,
  FileText,
  Terminal,
  Layers,
  Copy,
  Check,
  Shield,
  HardDrive,
  Zap,
} from "lucide-react";
import {
  SECTOR_34_INVESTIGATIONS,
  Sector34Investigation,
} from "../../../data/tomo02Sector34Data";
import { Sector34VisualDiagrams } from "./Sector34VisualDiagrams";
import { Tomo02Sector34MiniCasesModal } from "./Tomo02Sector34MiniCasesModal";
import { Tomo02Sector34MissionView } from "./Tomo02Sector34MissionView";
import { Tomo02Sector34TestView } from "./Tomo02Sector34TestView";

interface Tomo02Sector34ViewProps {
  initialInvCode?: string;
  onBackToMagazine: () => void;
  onOpenSector33?: () => void;
  onOpenSector35?: () => void;
}

export const Tomo02Sector34View: React.FC<Tomo02Sector34ViewProps> = ({
  initialInvCode,
  onBackToMagazine,
  onOpenSector33,
  onOpenSector35,
}) => {
  const [selectedInvCode, setSelectedInvCode] = useState<string>(initialInvCode || "34.01");

  useEffect(() => {
    if (initialInvCode) {
      const match = SECTOR_34_INVESTIGATIONS.find(
        (i) => i.code === initialInvCode || i.id === initialInvCode
      );
      if (match) {
        setSelectedInvCode(match.code);
      } else {
        setSelectedInvCode(initialInvCode);
      }
    }
  }, [initialInvCode]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"CONTENT" | "LAB" | "TEST">("CONTENT");
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedInv: Sector34Investigation =
    SECTOR_34_INVESTIGATIONS.find(
      (i) => i.code === selectedInvCode || i.id === selectedInvCode
    ) || SECTOR_34_INVESTIGATIONS[0];

  const filteredInvestigations = SECTOR_34_INVESTIGATIONS.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return (
      inv.code.toLowerCase().includes(term) ||
      inv.title.toLowerCase().includes(term) ||
      inv.subtitle.toLowerCase().includes(term)
    );
  });

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (activeTab === "LAB") {
    return (
      <div className="min-h-screen bg-[#04060A] text-zinc-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Tomo02Sector34MissionView onBackToReader={() => setActiveTab("CONTENT")} />
      </div>
    );
  }

  if (activeTab === "TEST") {
    return (
      <div className="min-h-screen bg-[#04060A] text-zinc-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Tomo02Sector34TestView onBackToReader={() => setActiveTab("CONTENT")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04060A] text-zinc-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans-editorial">
      {/* Top Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#080B10] border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-cyan-300">NIVEL V · DESMANTELAR WINDOWS</span>
            <span className="text-zinc-600">•</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
              SECTOR 34 · GOLD MASTER
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-[10px]">8 INVESTIGACIONES</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight uppercase">
            WINSXS Y COMPONENT STORE
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            "La carpeta de 20 GB que quizás no ocupe 20 GB"
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsMiniCasesOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Casos Forenses</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("LAB")}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Laboratorio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("TEST")}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Examen</span>
          </button>
          <button
            type="button"
            onClick={onBackToMagazine}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Índice</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Investigation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Investigation index */}
        <aside className="lg:col-span-4 space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#080B10] border border-cyan-500/20 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar en Sector 34..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#05070B] border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="text-[10px] text-zinc-400 font-bold uppercase flex items-center justify-between">
              <span>TEMARIO OFICIAL</span>
              <span className="text-cyan-400">{filteredInvestigations.length} FICHAS</span>
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {filteredInvestigations.map((inv) => {
                const isSelected = inv.code === selectedInv.code;
                return (
                  <button
                    key={inv.code}
                    type="button"
                    onClick={() => setSelectedInvCode(inv.code)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                        : "bg-[#0D121D] hover:bg-[#121926] border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`font-bold text-[11px] shrink-0 ${
                          isSelected ? "text-cyan-300" : "text-zinc-500"
                        }`}
                      >
                        {inv.code}
                      </span>
                      <span className="truncate font-sans font-medium text-xs">
                        {inv.title}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? "text-cyan-400" : "text-zinc-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content Panel */}
        <main className="lg:col-span-8 space-y-6">
          {/* Header of selected investigation */}
          <div className="p-5 rounded-2xl bg-[#080B10] border border-cyan-500/20 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500 text-black font-extrabold text-xs">
                  {selectedInv.code}
                </span>
                <span className="text-zinc-400 font-bold uppercase">{selectedInv.targetMechanism}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]">
                  {selectedInv.commandName}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                  {selectedInv.evidenceBadge.label}
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              {selectedInv.title}
            </h2>
            <p className="text-xs text-zinc-300 font-mono leading-relaxed">{selectedInv.subtitle}</p>
          </div>

          {/* Hook & Myth vs Truth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hook */}
            <div className="p-4 rounded-xl bg-[#0A0D15] border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Disparador Empírico</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{selectedInv.descubri.hook}"
              </p>
            </div>

            {/* Myth vs Truth */}
            <div className="p-4 rounded-xl bg-[#0A0D15] border border-cyan-500/20 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Mito vs Realidad</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="text-red-300/90">
                  <span className="font-bold text-red-400 block uppercase text-[10px]">Mentira Popular:</span>
                  {selectedInv.descubri.mythVsTruth.mentira}
                </div>
                <div className="text-green-300/90 pt-1">
                  <span className="font-bold text-green-400 block uppercase text-[10px]">Verdad Técnica:</span>
                  {selectedInv.descubri.mythVsTruth.verdad}
                </div>
                <div className="text-cyan-300/90 pt-1 border-t border-zinc-800 text-[10px]">
                  <span className="font-bold text-cyan-400 uppercase">Comprobación: </span>
                  {selectedInv.descubri.mythVsTruth.comprobalo}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Visual Diagrams (Embedded) */}
          <div className="space-y-2">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider block">
              DIAGRAMA & TOPOLOGÍA INTERACTIVA:
            </span>
            <Sector34VisualDiagrams />
          </div>

          {/* Entendé: Conceptos Clave */}
          <div className="p-5 rounded-2xl bg-[#080B10] border border-cyan-500/20 space-y-4">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider block">
              ARQUITECTURA & COMPONENTES:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">¿Qué es?</span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">{selectedInv.entende.queEs}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">¿Para qué sirve?</span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">{selectedInv.entende.paraQueSirve}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-red-400 font-bold uppercase block">¿Qué pasa si falta?</span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">{selectedInv.entende.quePasaSiFalta}</p>
              </div>
            </div>
          </div>

          {/* Interactuá: CLI / PowerShell Comandos */}
          <div className="p-5 rounded-2xl bg-[#080B10] border border-cyan-500/20 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>COMANDOS FORENSES CERTIFICADOS</span>
              </span>
              <span className="text-[10px] text-zinc-500">POWERSHELL / CMD ELEVADO</span>
            </div>

            <div className="space-y-3">
              {/* CLI Command */}
              <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">CMD / CLI:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedInv.interactua.cliExample, 1)}
                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                  >
                    {copiedIndex === 1 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 1 ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <code className="text-cyan-300 text-xs block overflow-x-auto">
                  {selectedInv.interactua.cliExample}
                </code>
              </div>

              {/* PowerShell Command */}
              <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">POWERSHELL CORE:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedInv.interactua.psExample, 2)}
                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                  >
                    {copiedIndex === 2 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 2 ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <code className="text-cyan-300 text-xs block overflow-x-auto">
                  {selectedInv.interactua.psExample}
                </code>
              </div>
            </div>

            {/* Syntax Breakdown & Metrics */}
            <div className="p-3.5 rounded-xl bg-[#0D121D] border border-cyan-500/10 space-y-2 text-[11px]">
              <div>
                <span className="text-cyan-300 font-bold block mb-0.5">Desglose de Sintaxis:</span>
                <p className="text-zinc-400">{selectedInv.interactua.syntaxBreakdown}</p>
              </div>
              <div className="pt-2 border-t border-zinc-800">
                <span className="text-amber-300 font-bold block mb-0.5">Qué buscar en la salida:</span>
                <p className="text-zinc-400">{selectedInv.interactua.whatToLookFor}</p>
              </div>
              <div className="pt-2 border-t border-zinc-800">
                <span className="text-white font-bold block mb-0.5">Métrica Técnica:</span>
                <p className="text-zinc-300">{selectedInv.interactua.technicalMetrics}</p>
              </div>
            </div>

            {/* Safety Warning */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold font-mono uppercase block mb-1">Alerta & Seguridad EVO:</span>
                <p>{selectedInv.alertaEVO.safetyWarning}</p>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="p-4 rounded-2xl bg-[#080B10] border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            {onOpenSector33 ? (
              <button
                type="button"
                onClick={onOpenSector33}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sector 33: NTFS Por Dentro</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onBackToMagazine}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 uppercase font-bold transition-all cursor-pointer"
            >
              Volver al Índice
            </button>

            {onOpenSector35 ? (
              <button
                type="button"
                onClick={onOpenSector35}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <span>Sector 35: Mito de los Optimizadores</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </main>
      </div>

      {/* Mini-cases modal */}
      <Tomo02Sector34MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
