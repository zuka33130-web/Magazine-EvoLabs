import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Search,
  AlertTriangle,
  FileText,
  Terminal,
  HardDrive,
  Copy,
  Check,
  Shield,
  Layers,
  Zap,
} from "lucide-react";
import {
  SECTOR_33_INVESTIGATIONS,
  Sector33Investigation,
} from "../../../data/tomo02Sector33Data";
import { Sector33VisualDiagrams } from "./Sector33VisualDiagrams";
import { Tomo02Sector33MiniCasesModal } from "./Tomo02Sector33MiniCasesModal";
import { Tomo02Sector33MissionView } from "./Tomo02Sector33MissionView";
import { Tomo02Sector33TestView } from "./Tomo02Sector33TestView";

interface Tomo02Sector33ViewProps {
  initialInvCode?: string;
  onBackToMagazine: () => void;
  onOpenSector32?: () => void;
  onOpenSector34?: () => void;
}

export const Tomo02Sector33View: React.FC<Tomo02Sector33ViewProps> = ({
  initialInvCode,
  onBackToMagazine,
  onOpenSector32,
  onOpenSector34,
}) => {
  const [selectedInvCode, setSelectedInvCode] = useState<string>(initialInvCode || "33.01");

  useEffect(() => {
    if (initialInvCode) {
      const match = SECTOR_33_INVESTIGATIONS.find(
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

  const selectedInv: Sector33Investigation =
    SECTOR_33_INVESTIGATIONS.find(
      (i) => i.code === selectedInvCode || i.id === selectedInvCode
    ) || SECTOR_33_INVESTIGATIONS[0];

  const filteredInvestigations = SECTOR_33_INVESTIGATIONS.filter((inv) => {
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
    return <Tomo02Sector33MissionView onBackToReader={() => setActiveTab("CONTENT")} />;
  }

  if (activeTab === "TEST") {
    return <Tomo02Sector33TestView onBackToReader={() => setActiveTab("CONTENT")} />;
  }

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 font-sans flex flex-col">
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
              <span>SECTOR 33</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <span>NTFS POR DENTRO: ¿Qué es realmente un archivo?</span>
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

      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 flex-1">
        <aside className="w-full lg:w-80 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar investigación 33.01..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider px-1 flex items-center justify-between">
            <span>Temario Pericial ({filteredInvestigations.length}/13)</span>
            <span className="text-cyan-400">GOLD MASTER</span>
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filteredInvestigations.map((inv) => {
              const isSelected = inv.code === selectedInv.code;
              return (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => setSelectedInvCode(inv.code)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                    isSelected
                      ? "bg-cyan-950/40 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "bg-[#080B10] border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`font-mono font-bold text-[11px] shrink-0 ${
                        isSelected ? "text-cyan-400" : "text-zinc-500"
                      }`}
                    >
                      {inv.code}
                    </span>
                    <span className="truncate font-medium">{inv.title}</span>
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
        </aside>

        <main className="flex-1 space-y-6 min-w-0">
          <div className="rounded-2xl bg-[#080B10] border border-cyan-500/30 p-6 space-y-6">
            <div className="space-y-2 border-b border-cyan-500/20 pb-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold">
                  INVESTIGACIÓN {selectedInv.code}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                  Riesgo: {selectedInv.riskLevel}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                  {selectedInv.evidenceBadge.code}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                {selectedInv.title}
              </h2>
              <p className="text-sm text-cyan-300/80 font-mono">{selectedInv.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2 text-xs">
                <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">
                  [1. DESCUBRÍ // GANCHO INICIAL]
                </span>
                <p className="text-zinc-200 leading-relaxed italic">{selectedInv.descubri.hook}</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <span className="font-mono text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                  [MITO VS REALIDAD TÉCNICA]
                </span>
                <p className="text-red-300/90 line-through text-[11px]">
                  {selectedInv.descubri.mythVsTruth.mentira}
                </p>
                <p className="text-emerald-300/90 font-medium">
                  {selectedInv.descubri.mythVsTruth.verdad}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3 text-xs">
              <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">
                [2. ENTENDÉ // FUNDAMENTO ARQUITECTÓNICO]
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase font-bold block">¿Qué es?</span>
                  <p className="text-zinc-200 leading-relaxed">{selectedInv.entende.queEs}</p>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1">
                  <span className="text-cyan-400 text-[10px] uppercase font-bold block">¿Para qué sirve?</span>
                  <p className="text-zinc-200 leading-relaxed">{selectedInv.entende.paraQueSirve}</p>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1">
                  <span className="text-red-400 text-[10px] uppercase font-bold block">¿Qué pasa si falta?</span>
                  <p className="text-zinc-200 leading-relaxed">{selectedInv.entende.quePasaSiFalta}</p>
                </div>
              </div>
            </div>

            <Sector33VisualDiagrams />

            <div className="space-y-3">
              <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">
                [3. INTERACTUÁ // COMANDOS FORENSES NATIVOS]
              </span>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[10px] uppercase font-bold">Consola CMD / CLI:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCmd(selectedInv.interactua.cliExample, 1)}
                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-black/60 text-cyan-300 font-mono select-all">
                  {selectedInv.interactua.cliExample}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 text-[10px] uppercase font-bold">PowerShell Forense:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCmd(selectedInv.interactua.psExample, 2)}
                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-black/60 text-emerald-300 font-mono select-all">
                  {selectedInv.interactua.psExample}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <span className="font-mono text-[10px] text-zinc-300 font-bold uppercase block">
                  Desglose de Sintaxis & Métricas:
                </span>
                <p className="leading-relaxed">{selectedInv.interactua.syntaxBreakdown}</p>
                <p className="text-cyan-300/90 font-mono text-[11px] pt-1">
                  Métrica Técnica: {selectedInv.interactua.technicalMetrics}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold font-mono uppercase block mb-1">Alerta & Seguridad EVO:</span>
                <p>{selectedInv.alertaEVO.safetyWarning}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080B10] border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            {onOpenSector32 ? (
              <button
                type="button"
                onClick={onOpenSector32}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sector 32: Windows Por Dentro</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onBackToMagazine}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 uppercase font-bold transition-all cursor-pointer"
            >
              Volver al Índice
            </button>

            {onOpenSector34 ? (
              <button
                type="button"
                onClick={onOpenSector34}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <span>Sector 34: WinSxS y Component Store</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </main>
      </div>

      <Tomo02Sector33MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
