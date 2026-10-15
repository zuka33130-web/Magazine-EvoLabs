import React, { useState, useEffect } from "react";
import {
  Activity,
  ArrowLeft,
  Check,
  Copy,
  ChevronRight,
  Search,
  Terminal,
  Shield,
  Layers,
  FileText,
  AlertTriangle,
  Cpu,
  Database,
  ExternalLink,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import {
  SECTOR_37_INVESTIGATIONS,
  Sector37Investigation,
} from "../../../data/tomo02Sector37Data";
import { Sector37VisualDiagrams } from "./Sector37VisualDiagrams";
import { Tomo02Sector37MiniCasesModal } from "./Tomo02Sector37MiniCasesModal";
import { Tomo02Sector37MissionView } from "./Tomo02Sector37MissionView";
import { Tomo02Sector37TestView } from "./Tomo02Sector37TestView";

interface Tomo02Sector37ViewProps {
  initialInvCode?: string;
  onBackToMagazine: () => void;
  onOpenSector36?: () => void;
  onOpenSector38?: () => void;
}

export const Tomo02Sector37View: React.FC<Tomo02Sector37ViewProps> = ({
  initialInvCode,
  onBackToMagazine,
  onOpenSector36,
  onOpenSector38,
}) => {
  const [selectedInvCode, setSelectedInvCode] = useState<string>(initialInvCode || "37.01");

  useEffect(() => {
    if (initialInvCode) {
      const match = SECTOR_37_INVESTIGATIONS.find(
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

  const selectedInv: Sector37Investigation =
    SECTOR_37_INVESTIGATIONS.find(
      (i) => i.code === selectedInvCode || i.id === selectedInvCode
    ) || SECTOR_37_INVESTIGATIONS[0];

  const filteredInvestigations = SECTOR_37_INVESTIGATIONS.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return (
      inv.code.toLowerCase().includes(term) ||
      inv.title.toLowerCase().includes(term) ||
      inv.subtitle.toLowerCase().includes(term)
    );
  });

  const handleCopyCmd = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (activeTab === "LAB") {
    return <Tomo02Sector37MissionView onBackToReader={() => setActiveTab("CONTENT")} />;
  }

  if (activeTab === "TEST") {
    return <Tomo02Sector37TestView onBackToReader={() => setActiveTab("CONTENT")} />;
  }

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 font-sans flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#080B10]/95 backdrop-blur border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMagazine}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              <span>NIVEL V // DESMANTELAR WINDOWS</span>
              <span>•</span>
              <span>SECTOR 37</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-cyan-400" />
              <span>BASE DE PROBLEMAS RESUELTOS</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMiniCasesOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Casos Clínicos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("LAB")}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Laboratorio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("TEST")}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            Evaluar
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 flex-1">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar investigación 37.01..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filteredInvestigations.map((inv) => {
              const isSelected = selectedInvCode === inv.code;
              return (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => {
                    setSelectedInvCode(inv.code);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-cyan-950/40 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "bg-[#090D14]/70 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-cyan-400 shrink-0 mt-0.5">
                    {inv.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate text-zinc-200">
                      {inv.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {inv.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Reader Center Pane */}
        <main className="flex-1 space-y-6 min-w-0">
          {/* Active Investigation Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#080B11] border border-cyan-500/30 space-y-6 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono text-xs font-bold text-cyan-300">
                  INVESTIGACIÓN {selectedInv.code}
                </span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-400">
                  {selectedInv.evidenceBadge.code}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-400">
                {selectedInv.riskLevel}
              </span>
            </div>

            {/* Title & Target */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedInv.title}
              </h2>
              <p className="text-sm text-cyan-300/80 font-mono mt-1">
                {selectedInv.subtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-400">
                  Mecanismo: <span className="text-zinc-200">{selectedInv.targetMechanism}</span>
                </span>
                {selectedInv.targetComponent && (
                  <span className="px-2.5 py-1 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-400">
                    Componente: <span className="text-zinc-200">{selectedInv.targetComponent}</span>
                  </span>
                )}
              </div>
            </div>

            {/* 1. DESCUBRÍ */}
            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>1. Descubrí: El Gancho y la Verdad Oculta</span>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                {selectedInv.descubri.hook}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300">
                  <span className="font-bold font-mono uppercase block mb-1">Mito Común:</span>
                  <p>{selectedInv.descubri.mythVsTruth.mentira}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                  <span className="font-bold font-mono uppercase block mb-1">Verdad Técnica:</span>
                  <p>{selectedInv.descubri.mythVsTruth.verdad}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs">
                <span className="font-mono text-cyan-400 font-bold uppercase block mb-1">
                  Comprobación Empírica:
                </span>
                <p className="text-zinc-300">{selectedInv.descubri.mythVsTruth.comprobalo}</p>
              </div>
            </div>

            {/* 2. ENTENDÉ */}
            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>2. Entendé: Arquitectura y Función</span>
              </div>
              <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                <p>
                  <strong className="text-white font-mono uppercase">¿Qué es? </strong>
                  {selectedInv.entende.queEs}
                </p>
                <p>
                  <strong className="text-white font-mono uppercase">¿Para qué sirve? </strong>
                  {selectedInv.entende.paraQueSirve}
                </p>
                <p>
                  <strong className="text-white font-mono uppercase">¿Qué pasa si falta? </strong>
                  {selectedInv.entende.quePasaSiFalta}
                </p>
              </div>
            </div>

            {/* 3. INTERACTUÁ */}
            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                <span>3. Interactuá: Comandos de Diagnóstico Pericial</span>
              </div>

              {/* CLI Command */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>CMD / Símbolo del Sistema:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCmd(selectedInv.interactua.cliExample, 1)}
                    className="flex items-center gap-1 text-[11px] hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 1 ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-black/80 border border-zinc-900 text-xs text-emerald-400 font-mono overflow-x-auto">
                  {selectedInv.interactua.cliExample}
                </pre>
              </div>

              {/* PowerShell Command */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>PowerShell:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCmd(selectedInv.interactua.psExample, 2)}
                    className="flex items-center gap-1 text-[11px] hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 2 ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-black/80 border border-zinc-900 text-xs text-cyan-300 font-mono overflow-x-auto whitespace-pre-wrap">
                  {selectedInv.interactua.psExample}
                </pre>
              </div>

              {/* Breakdown & Metrics */}
              <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs space-y-2">
                <div>
                  <span className="text-white font-bold block mb-0.5">Desglose de Sintaxis:</span>
                  <p className="text-zinc-300">{selectedInv.interactua.syntaxBreakdown}</p>
                </div>
                <div>
                  <span className="text-white font-bold block mb-0.5">Qué Buscar en la Salida:</span>
                  <p className="text-zinc-300">{selectedInv.interactua.whatToLookFor}</p>
                </div>
                <div>
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
          </div>

          {/* Embedded Visual Diagrams */}
          <Sector37VisualDiagrams />

          {/* Navigation Footer */}
          <div className="p-4 rounded-2xl bg-[#080B10] border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            {onOpenSector36 ? (
              <button
                type="button"
                onClick={onOpenSector36}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sector 36: PC Lenta</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onBackToMagazine}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 uppercase font-bold transition-all cursor-pointer"
            >
              Volver al Índice
            </button>

            {onOpenSector38 ? (
              <button
                type="button"
                onClick={onOpenSector38}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <span>Sector 38: Creá tus Herramientas</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </main>
      </div>

      {/* Mini-cases modal */}
      <Tomo02Sector37MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
