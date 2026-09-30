import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Compass,
  Download,
  HelpCircle,
  X,
  CheckCircle2,
  ExternalLink,
  FileDown,
  Copy,
  Zap,
  Power,
  ShieldAlert,
  Terminal,
  Activity,
  Check,
  Cpu,
  Layers,
  Wrench,
  BookOpen,
} from 'lucide-react';
import { Tomo08MasterPage } from './Tomo08MasterPage';
import {
  TOMO_08_META,
  TOMO_08_MODULES,
  WORKSHOP_BOOT_CASES,
} from '../../data/tomo08Data';
import { EvoBootLab } from './EvoBootLab';

interface Tomo08MagazineViewProps {
  onBackToApp?: () => void;
  onNavigateTomo?: (tomo: '01' | '02' | '03' | '04' | '08') => void;
  onOpenLab?: () => void;
  initialPage?: number;
}

type ViewMode = 'continuous' | 'single';

export const Tomo08MagazineView: React.FC<Tomo08MagazineViewProps> = ({
  onBackToApp,
  onNavigateTomo,
  onOpenLab,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<ViewMode>('continuous');
  const [isPreparingPrint, setIsPreparingPrint] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Embedded Interactive Lab state
  const [isLabOpen, setIsLabOpen] = useState<boolean>(false);
  const [labTargetStep, setLabTargetStep] = useState<number | undefined>(undefined);

  const totalPages = TOMO_08_META.totalPages;

  const isInIframe = (() => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const getStandalonePrintUrl = () => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('volume', '08');
      u.searchParams.set('mode', 'magazine');
      u.searchParams.set('print', 'true');
      return u.toString();
    } catch {
      return window.location.href;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLabOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, isLabOpen]);

  const handleCopySnippet = (snippet: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
      setCopiedSnippet(snippet);
      setTimeout(() => setCopiedSnippet(null), 2200);
    }
  };

  const handleNativePrint = () => {
    setViewMode('continuous');
    setIsPreparingPrint(true);
    setTimeout(() => {
      window.print();
      setIsPreparingPrint(false);
    }, 300);
  };

  const handleOpenEmbeddedLab = (stepIndex?: number) => {
    if (onOpenLab && !stepIndex) {
      onOpenLab();
    } else {
      setLabTargetStep(stepIndex);
      setIsLabOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownloadOfflineHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${TOMO_08_META.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070B09; color: #E4E4E7; margin: 0; padding: 20px; }
    h1 { color: #10B981; font-size: 28px; border-bottom: 2px solid #10B981; padding-bottom: 8px; }
    h2 { color: #34D399; margin-top: 30px; }
    pre { background: #064E3B; padding: 12px; border-radius: 6px; border: 1px solid #047857; overflow-x: auto; color: #6EE7B7; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #065F46; color: #A7F3D0; }
    .module-card { border: 1px solid #064E3B; background: #052E23; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>${TOMO_08_META.title}</h1>
  <p><strong>${TOMO_08_META.subtitle}</strong></p>
  <p><em>${TOMO_08_META.manifestoPhrase}</em></p>
  <hr style="border: 1px solid #064E3B; margin: 24px 0;" />
  <h2>MÓDULOS DE SECUENCIA DE ARRANQUE</h2>
  ${TOMO_08_MODULES.map(
    (m) => `
    <div class="module-card">
      <span class="badge">${m.moduleNumber} // ${m.categoryTag}</span>
      <h3>${m.title}</h3>
      <p><strong>Subtítulo:</strong> ${m.subtitle}</p>
      <p>${m.summary}</p>
      <p><strong>Instrumental de Taller:</strong> ${m.workshopVerification.instrument}</p>
      <p><strong>Medición:</strong> ${m.workshopVerification.measurement} | <strong>Valor esperado:</strong> ${m.workshopVerification.expectedValue}</p>
      <p><strong>Regla de Decisión:</strong> ${m.decisionRule}</p>
    </div>
  `
  ).join('')}
  <p style="margin-top: 40px; font-size: 12px; color: #9CA3AF;">EVO LABS // Publicaciones Maestras de Hardware & Firmware 2026</p>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EVO-LABS-TOMO-08-ARRANQUE-OFFLINE.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // If the interactive lab modal is open inside the Tomo view
  if (isLabOpen) {
    return (
      <div className="min-h-screen bg-[#07090e] p-4 sm:p-6 text-zinc-100 animate-in fade-in duration-200">
        <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between bg-[#0b0e14] border border-zinc-800 p-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLabOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono-tech font-bold text-emerald-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>VOLVER A LA REVISTA TOMO 08</span>
            </button>
            <span className="text-zinc-500 font-mono-tech text-xs hidden sm:inline">|</span>
            <span className="text-zinc-400 font-mono-tech text-xs hidden sm:inline">
              RECURSO VINCULADO // LABORATORIO DE ARRANQUE Y FALLAS GUIADO
            </span>
          </div>

          <div className="text-[11px] font-mono-tech text-emerald-400 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            HERRAMIENTA INTERACTIVA ACTIVA
          </div>
        </div>

        <EvoBootLab
          onClose={() => setIsLabOpen(false)}
          onOpenTomo08={() => setIsLabOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060806] text-zinc-100 flex flex-col font-sans-editorial selection:bg-emerald-500 selection:text-black">
      {/* Top Floating App Bar */}
      <header className="no-print sticky top-0 z-40 bg-[#080d0a]/95 backdrop-blur-md border-b border-emerald-950/80 px-4 py-2.5 sm:px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Volver a la vista general"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                TOMO 08
              </span>
              <span className="font-bold text-xs sm:text-sm text-white font-mono-tech truncate max-w-[200px] sm:max-w-none">
                DEL BOTÓN POWER A WINDOWS
              </span>
            </div>
          </div>

          {/* Center Callout: ABRIR LABORATORIO INTERACTIVO (DESTACADO) */}
          <button
            type="button"
            onClick={() => handleOpenEmbeddedLab()}
            className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono-tech font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Abrir la herramienta interactiva con gabinete abierto y multímetro"
          >
            <Power className="w-3.5 h-3.5 text-black" />
            <span>ABRIR LABORATORIO DE ARRANQUE Y FALLAS</span>
          </button>

          {/* Right Tools Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[11px] font-mono-tech">
              <button
                type="button"
                onClick={() => setViewMode('continuous')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'continuous'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Continuo
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewMode === 'single'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Página
              </button>
            </div>

            {/* Page Jump Select */}
            <select
              value={currentPage}
              onChange={(e) => {
                const target = Number(e.target.value);
                setCurrentPage(target);
                if (viewMode === 'continuous') {
                  const el = document.getElementById(`t08-page-${target}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono-tech rounded-lg px-2 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  Pág. {String(p).padStart(2, '0')} / {totalPages}
                </option>
              ))}
            </select>

            {/* Print A4 PDF Button */}
            <button
              type="button"
              onClick={handleNativePrint}
              disabled={isPreparingPrint}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 font-mono-tech text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Imprimir revista o guardar como PDF (A4)"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">PDF A4</span>
            </button>

            {/* Export / Offline Options */}
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 transition-colors cursor-pointer"
              title="Opciones de descarga y exportación"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Magazine Viewport */}
      <main className="flex-1 w-full py-6 px-3 sm:px-6 flex flex-col items-center">
        {/* Continuous Flow vs Single Page */}
        {viewMode === 'continuous' ? (
          <div className="w-full flex flex-col items-center space-y-8 sm:space-y-12">
            {/* PÁGINA 01: PORTADA EDITORIAL */}
            <Tomo08MasterPage
              pageNumber={1}
              totalPages={totalPages}
              isCover
              hideHeaderFooter
              pageId="t08-page-1"
            >
              <div className="h-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden select-none">
                {/* Circuit Grid Subtle Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

                {/* Top Cover Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-emerald-500/30 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-400 inline-block shadow-[0_0_12px_#10b981]" />
                    <span className="font-mono-tech font-bold text-white text-xs tracking-widest uppercase">
                      EVO LABS // VOL. VIII
                    </span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                    EDICIÓN MAESTRA // 2026
                  </span>
                </div>

                {/* Cover Main Title Block */}
                <div className="relative z-10 my-auto py-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono-tech text-xs tracking-widest uppercase">
                    <Power className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>SECUENCIA COMPLETA DE ENERGÍA A KERNEL</span>
                  </div>

                  <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-none uppercase">
                    DEL BOTÓN <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                      POWER A WINDOWS
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial max-w-xl leading-relaxed">
                    Tratado forense y visual sobre cada microsegundo del arranque de una PC moderna: +5VSB, PWR_SW, PS_ON#, VRM, CPU Reset, lectura SPI, POST, entrenamiento de RAM, enlace PCIe/GOP, UEFI hand-off, winload.efi y carga del Kernel NT.
                  </p>

                  {/* Primary CTA Buttons on Cover */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenEmbeddedLab()}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 text-black font-mono-tech font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Power className="w-4 h-4 text-black" />
                      <span>ABRIR LABORATORIO DE ARRANQUE Y FALLAS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('t08-page-3');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono-tech text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>EXPLORAR ÍNDICE DE CAPÍTULOS →</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Cover Footer */}
                <div className="relative z-10 border-t border-emerald-500/30 pt-4 flex flex-wrap items-end justify-between gap-4 text-xs font-mono-tech text-zinc-400">
                  <div className="space-y-1">
                    <div className="text-white font-bold text-sm">
                      INCLUYE GABINETE ABIERTO & CORTE LATERAL INTERACTIVO
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Simulación en tiempo real con Multímetro, Tester Digital, Buzzer y Clear CMOS.
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                      ESTÁNDAR UEFI & WINDOWS ARCHITECTURE
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      ISBN: 978-987-EVO-08-2026 // PÁGINAS 1 - 16
                    </div>
                  </div>
                </div>
              </div>
            </Tomo08MasterPage>

            {/* PÁGINA 02: MANIFIESTO EDITORIAL */}
            <Tomo08MasterPage
              pageNumber={2}
              totalPages={totalPages}
              sectionTitle="MANIFIESTO"
              subSlug="FILOSOFÍA DE ARRANQUE FORENSE"
              pageId="t08-page-2"
            >
              <div className="h-full flex flex-col justify-between py-2 space-y-6">
                <div>
                  <span className="font-mono-tech text-[10px] text-emerald-400 uppercase tracking-widest">
                    INTRODUCCIÓN EDITORIAL // TOMO 08
                  </span>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1 uppercase">
                    Los Primeros 500 Milisegundos del Silicio
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                  <div className="space-y-4">
                    <p className="magazine-dropcap">
                      La mayoría de los usuarios y técnicos novatos conciben el encendido de una computadora como un acto instantáneo y binario: se pulsa el botón y la máquina “anda” o “no anda”. Si no muestra video, el reflejo habitual es cambiar la placa de video, limpiar la memoria RAM con una goma de borrar o culpar a la fuente sin fundamento.
                    </p>
                    <p>
                      La realidad de la ingeniería de hardware es radicalmente distinta. Entre el momento en que tus dedos cierran el contacto del panel frontal y el instante en que el primer píxel del logotipo de la motherboard se dibuja en la pantalla, transcurren cientos de miles de ciclos de reloj.
                    </p>
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 font-mono-tech text-emerald-300 text-xs">
                      “Una PC no arranca por magia: cada milisegundo responde a una cadena inquebrantable de condiciones eléctricas y lógicas. Si una sola falla, el proceso se aborta o se congela.”
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p>
                      En este Tomo 08 deconstruimos esa cadena paso por paso. Abordamos la arquitectura física desde el riel de espera <strong className="text-white">+5VSB</strong> (que alimenta la placa antes de que toques nada), la señal <strong className="text-white">PS_ON#</strong> comandada por el chip Super I/O, la liberación de potencia estabilizada confirmada por <strong className="text-white">Power Good (PWR_OK)</strong>, hasta el despertar del procesador al soltar su línea de reset.
                    </p>
                    <p>
                      Luego acompañamos la lectura del firmware SPI, el ciclo crítico de entrenamiento de memoria (MRC), la inicialización de buses PCI Express, el hand-off del UEFI hacia la partición EFI de tu disco, la ejecución de <code className="text-emerald-400">winload.efi</code>, la carga del kernel <code className="text-emerald-400">ntoskrnl.exe</code> y el nacimiento de la sesión gráfica en Windows.
                    </p>
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-zinc-300 space-y-1">
                      <div className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        <span>METODOLOGÍA DE REPARACIÓN EVO</span>
                      </div>
                      <p className="text-zinc-400">
                        Cada capítulo cuenta con su correspondiente réplica en el Laboratorio Interactivo. Medí tensiones reales, inyectá fallas simuladas y operá el instrumental antes de abrir un equipo de cliente.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Callout Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/30 to-teal-900/20 border border-emerald-500/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Power className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-white font-mono-tech">
                        HERRAMIENTA ASOCIADA: LABORATORIO VIRTUAL DE ARRANQUE
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        Podés abrir el banco de pruebas en cualquier momento desde el botón superior o los enlaces de cada módulo.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEmbeddedLab()}
                    className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-mono-tech text-xs font-bold transition-all shrink-0 cursor-pointer shadow-lg"
                  >
                    <span>ABRIR TALLER →</span>
                  </button>
                </div>
              </div>
            </Tomo08MasterPage>

            {/* PÁGINA 03: ÍNDICE GENERAL & MAPA SECUENCIAL */}
            <Tomo08MasterPage
              pageNumber={3}
              totalPages={totalPages}
              sectionTitle="ÍNDICE"
              subSlug="PLAN DE ESTUDIO TÉCNICO & HITOS"
              pageId="t08-page-3"
            >
              <div className="h-full flex flex-col justify-between py-2 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div>
                    <span className="font-mono-tech text-[10px] text-emerald-400 uppercase tracking-widest">
                      CONTENIDOS DEL TOMO // 10 HITOS CRÍTICOS
                    </span>
                    <h2 className="font-display font-bold text-xl text-white uppercase">
                      Índice Modular & Ruta de Diagnóstico
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono-tech text-zinc-500">
                    DE REPOSO A ESCRITORIO
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {TOMO_08_MODULES.map((mod, idx) => (
                    <div
                      key={mod.id}
                      className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {mod.moduleNumber}
                          </span>
                          <span className="font-bold text-white text-xs font-mono-tech">
                            {mod.title}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono-tech text-zinc-500">
                          PÁG. {String(idx + 4).padStart(2, '0')}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-snug font-sans-editorial">
                        {mod.subtitle}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-[10px] font-mono-tech">
                        <span className="text-zinc-500 uppercase">{mod.categoryTag}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenEmbeddedLab(mod.labStepTarget)}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <span>Probar en Lab</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* LABORATORIO INTERACTIVO ASOCIADO */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#071a13] via-[#091510] to-[#06120d] border border-emerald-500/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-tech">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                        LABORATORIO INTERACTIVO
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm uppercase">
                      LABORATORIO DE ARRANQUE Y FALLAS GUIADO
                    </div>
                    <p className="text-zinc-300 text-xs font-sans-editorial leading-relaxed max-w-xl">
                      “Del botón POWER al escritorio. Observá cada etapa, seguí las señales, simulá fallas y aprendé a diagnosticar.”
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEmbeddedLab()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Power className="w-4 h-4 text-black" />
                    <span>[ ABRIR LABORATORIO ]</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d0b] border border-emerald-950/60 flex items-center justify-between text-[11px] font-mono-tech">
                  <div className="text-zinc-400">
                    <strong className="text-emerald-300">Apéndice de Taller:</strong> Casos Forenses (Pág. 14) • Matriz de Triage (Pág. 15) • Laboratorio Vivo (Pág. 16)
                  </div>
                  <span className="text-zinc-500 text-[10px]">EVO LABS DIAGNOSTIC SPEC</span>
                </div>
              </div>
            </Tomo08MasterPage>

            {/* PÁGINAS 04 A 13: LOS 10 MÓDULOS TÉCNICOS INDIVIDUALES */}
            {TOMO_08_MODULES.map((mod, index) => {
              const pageNum = index + 4;
              return (
                <Tomo08MasterPage
                  key={mod.id}
                  pageNumber={pageNum}
                  totalPages={totalPages}
                  sectionTitle={`MÓDULO ${mod.moduleNumber}`}
                  subSlug={mod.categoryTag}
                  pageId={`t08-page-${pageNum}`}
                >
                  <div className="h-full flex flex-col justify-between py-2 space-y-4">
                    {/* Header of Module */}
                    <div className="border-b border-zinc-800 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {mod.moduleNumber} // {mod.categoryTag}
                        </span>
                        <span className="text-[10px] font-mono-tech text-zinc-500">
                          TIEMPO DE LECTURA: {mod.readTime}
                        </span>
                      </div>
                      <h2 className="font-display font-black text-2xl text-white mt-1 uppercase">
                        {mod.title}
                      </h2>
                      <div className="text-xs text-emerald-400 font-mono-tech mt-0.5">
                        {mod.subtitle}
                      </div>
                    </div>

                    {/* Module Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs text-zinc-300 font-sans-editorial flex-1">
                      {/* Left Column: Explicación Técnica y Señales */}
                      <div className="md:col-span-7 space-y-3.5 leading-relaxed">
                        <p className="magazine-dropcap text-zinc-200">
                          {mod.summary}
                        </p>

                        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                          <div className="font-mono-tech font-bold text-white text-[11px] uppercase flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Señales y Líneas Involucradas:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {mod.keySignals.map((sig, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/80"
                              >
                                {sig}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                          <div className="font-mono-tech font-bold text-white text-[11px] uppercase flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Componentes del Ecosistema:</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-mono-tech">
                            {mod.componentsInvolved.join(' • ')}
                          </p>
                        </div>
                      </div>

                      {/* Right Column: Verificación de Taller & Regla Forense */}
                      <div className="md:col-span-5 space-y-3.5">
                        {/* Protocolo de Medición */}
                        <div className="p-4 rounded-xl bg-[#090e0b] border border-emerald-500/30 space-y-2">
                          <div className="flex items-center gap-1.5 font-mono-tech font-bold text-emerald-400 text-[11px] uppercase">
                            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Protocolo de Verificación en Banco:</span>
                          </div>
                          <div className="space-y-1.5 text-[11px] font-mono-tech">
                            <div>
                              <span className="text-zinc-500">INSTRUMENTO:</span>{' '}
                              <span className="text-white">{mod.workshopVerification.instrument}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">PUNTO DE MEDICIÓN:</span>{' '}
                              <span className="text-zinc-300">{mod.workshopVerification.measurement}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">VALOR NOMINAL:</span>{' '}
                              <span className="text-emerald-300 font-bold">{mod.workshopVerification.expectedValue}</span>
                            </div>
                            <div className="pt-1 text-rose-300 text-[10px] leading-tight">
                              ⚠️ <strong className="text-rose-400">Anomalía:</strong> {mod.workshopVerification.anomalyIndicator}
                            </div>
                          </div>
                        </div>

                        {/* Posibles Fallas */}
                        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                          <div className="font-mono-tech font-bold text-amber-400 text-[11px] uppercase flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>Fallas Comunes en este Hito:</span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
                            {mod.commonFailures.map((cf, cIdx) => (
                              <li key={cIdx}>{cf}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Regla de Oro */}
                        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-[11px] font-mono-tech text-emerald-300">
                          <strong className="text-white block uppercase mb-0.5">💡 Regla de Taller:</strong>
                          {mod.decisionRule}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer of each module */}
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 font-mono-tech text-xs">
                      <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Nivel de Seguridad: <strong className="text-white">{mod.safetyLevel}</strong></span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenEmbeddedLab(mod.labStepTarget)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02]"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>PROBAR EN LABORATORIO INTERACTIVO</span>
                      </button>
                    </div>
                  </div>
                </Tomo08MasterPage>
              );
            })}

            {/* PÁGINA 14: CASOS FORENSES DE TALLER */}
            <Tomo08MasterPage
              pageNumber={14}
              totalPages={totalPages}
              sectionTitle="CASOS DE BANCO"
              subSlug="PERITAJES REALES & DIAGNÓSTICO"
              pageId="t08-page-14"
            >
              <div className="h-full flex flex-col justify-between py-2 space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <span className="font-mono-tech text-[10px] text-emerald-400 uppercase tracking-widest">
                    PERITAJE DE CAMPO // CASOS RESUELTOS EN BANCO
                  </span>
                  <h2 className="font-display font-bold text-2xl text-white uppercase">
                    Casos Forenses de Taller: De la Sospecha a la Causa Raíz
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs flex-1">
                  {WORKSHOP_BOOT_CASES.map((cs) => (
                    <div
                      key={cs.id}
                      className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech">
                          <span className="text-emerald-400 font-bold uppercase">{cs.diagnosticStage}</span>
                          <span className="text-zinc-500">{cs.equipment}</span>
                        </div>
                        <h3 className="font-bold text-white text-xs font-mono-tech leading-snug">
                          {cs.title}
                        </h3>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          <strong>Síntoma:</strong> {cs.symptom}
                        </p>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          <strong>Medición:</strong> <span className="text-emerald-300 font-mono-tech">{cs.measuredData}</span>
                        </p>
                        <p className="text-zinc-500 text-[10px] line-through">
                          Hipótesis descartada: {cs.discardedHypothesis}
                        </p>
                        <p className="text-amber-300 text-[11px] leading-relaxed">
                          <strong>Causa Raíz:</strong> {cs.rootCause}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono-tech">
                        <span className="text-emerald-400 font-bold truncate max-w-[200px]">
                          Solución: {cs.fixAction}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenEmbeddedLab(cs.labStepTarget)}
                          className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>Simular Caso</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono-tech text-zinc-300 flex items-center justify-between">
                  <span>Modo CASO EVO disponible con escenarios misteriosos con fallas aleatorias.</span>
                  <button
                    type="button"
                    onClick={() => handleOpenEmbeddedLab()}
                    className="px-3 py-1 rounded bg-emerald-400 hover:bg-emerald-300 text-black font-bold cursor-pointer transition-colors"
                  >
                    Resolver en Laboratorio
                  </button>
                </div>
              </div>
            </Tomo08MasterPage>

            {/* PÁGINA 15: MATRIZ DE TRIAGE RÁPIDO */}
            <Tomo08MasterPage
              pageNumber={15}
              totalPages={totalPages}
              sectionTitle="TRIAGE DE BANCO"
              subSlug="MATRIZ DE DECISIÓN RÁPIDA"
              pageId="t08-page-15"
            >
              <div className="h-full flex flex-col justify-between py-2 space-y-4">
                <div className="border-b border-zinc-800 pb-2">
                  <span className="font-mono-tech text-[10px] text-emerald-400 uppercase tracking-widest">
                    ALGORITMO DE TALLER // GUÍA DE RESPUESTA INMEDIATA
                  </span>
                  <h2 className="font-display font-bold text-2xl text-white uppercase">
                    Árbol de Decisión Forense de Arranque
                  </h2>
                </div>

                <div className="space-y-2.5 text-xs flex-1">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono-tech font-bold text-rose-400">
                      <span>1. LA MÁQUINA ESTÁ COMPLETAMENTE MUERTA (SIN LUCES NI VENTILADORES)</span>
                      <span className="text-zinc-500 text-[10px]">HITO: M01 STANDBY</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Medí +5VSB en el pin 9 (violeta). Si hay 0V: reemplazá la fuente o aislá un corto en USB/SIO. Si hay 5V pero no reacciona al puente directo en los pines de POWER: el chip Super I/O no está detectando la caída o el cristal de 32.768 kHz del RTC está dañado.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono-tech font-bold text-amber-400">
                      <span>2. GIRA MEDIO SEGUNDO Y SE APAGA CON CLIC</span>
                      <span className="text-zinc-500 text-[10px]">HITO: M02 CORTO 12V</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Desconectá el cable EPS de 12V del CPU (4/8 pines). Si al puentear la fuente enciende y no se corta: tenés un MOSFET perforado en el VRM de la motherboard. Si sigue cortando: corto en GPU o riel de 12V principal.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono-tech font-bold text-cyan-400">
                      <span>3. VENTILADORES AL 100% CONTINUO SIN VIDEO (Q-LED CLAVADO)</span>
                      <span className="text-zinc-500 text-[10px]">HITO: M04/M05 POST/RAM</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Si el LED es CPU: revisá versión de BIOS SPI o pines doblados en socket. Si el LED es DRAM: colocá un solo módulo en el slot 2 (A2), realizá Clear CMOS (retirar pila 5 minutos o puentear jumper CLRTC) y esperá hasta 60 segundos por entrenamiento MRC.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono-tech font-bold text-emerald-400">
                      <span>4. DA LOGO PERO NO CARGA WINDOWS (ENTRA A BIOS O BSOD)</span>
                      <span className="text-zinc-500 text-[10px]">HITO: M07-M09 UEFI/KERNEL</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Si entra a la BIOS directo: verificá modo NVMe y presencia de partición ESP. Si tira INACCESSIBLE_BOOT_DEVICE: revisá si el modo SATA/NVMe cambió de AHCI a RAID/VMD en el firmware.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                  <span>Regla fundamental: Siempre aislar el hardware fuera del gabinete antes de dar por muerta una motherboard.</span>
                </div>
              </div>
            </Tomo08MasterPage>

            {/* PÁGINA 16: RECURSOS ASOCIADOS & ENTRADA AL LABORATORIO */}
            <Tomo08MasterPage
              pageNumber={16}
              totalPages={totalPages}
              sectionTitle="TALLER INTERACTIVO"
              subSlug="SUITE DE DIAGNÓSTICO EVO"
              isBackCover
              pageId="t08-page-16"
            >
              <div className="h-full flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-400 inline-block shadow-[0_0_8px_#10B981]" />
                    <span className="font-mono-tech font-bold text-emerald-400 text-xs tracking-widest uppercase">
                      RECURSO INTERACTIVO ASOCIADO // TOMO 08
                    </span>
                  </div>

                  <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase leading-tight">
                    Laboratorio de Arranque & Fallas Guiado
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-xl">
                    No te limites a la lectura teórica. El Tomo 08 cuenta con una herramienta interactiva completa desarrollada a medida: un gabinete abierto con chasis ATX, placa madre con topología física preservada, cables energizados en tiempo real y 4 modos de práctica técnica.
                  </p>
                </div>

                {/* 4 Feature Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center space-y-1">
                    <div className="text-cyan-400 font-mono-tech font-bold text-xs uppercase">[ APRENDER ]</div>
                    <div className="text-[10px] text-zinc-400">Paso a paso con telemetría de señales</div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center space-y-1">
                    <div className="text-amber-400 font-mono-tech font-bold text-xs uppercase">[ FALLAS ]</div>
                    <div className="text-[10px] text-zinc-400">Inyección de cortes y síntomas visibles</div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center space-y-1">
                    <div className="text-indigo-400 font-mono-tech font-bold text-xs uppercase">[ CASO EVO ]</div>
                    <div className="text-[10px] text-zinc-400">Hipótesis y pruebas con instrumental</div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center space-y-1">
                    <div className="text-purple-400 font-mono-tech font-bold text-xs uppercase">[ MISTERIOSA ]</div>
                    <div className="text-[10px] text-zinc-400">Diagnóstico a ciegas con multímetro</div>
                  </div>
                </div>

                {/* Big Center Action Box */}
                <div className="p-6 rounded-2xl bg-[#090f0c] border border-emerald-500/40 text-center space-y-4 shadow-2xl">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <Power className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-mono-tech font-bold text-base uppercase">
                      ¿Listo para encender el gabinete virtual?
                    </h3>
                    <p className="text-zinc-400 text-xs mt-1 max-w-md mx-auto">
                      Activá el switch de la fuente, puenteá los pines de panel frontal y seguí el recorrido visual de las señales por el bus físico.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEmbeddedLab()}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 text-black font-mono-tech font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Power className="w-4 h-4 text-black" />
                    <span>ENTRAR AL TALLER DE DIAGNÓSTICO</span>
                  </button>
                </div>

                {/* Backcover Footer */}
                <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
                  <span>EVO LABS // ARQUITECTURA FORENSE</span>
                  <span>WWW.EVOLABS.HARDWARE // EDICIÓN 2026</span>
                </div>
              </div>
            </Tomo08MasterPage>
          </div>
        ) : (
          /* Single Page View */
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center gap-3 no-print mb-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono-tech text-zinc-300 disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <span className="font-mono-tech text-xs text-emerald-400">
                PÁGINA {currentPage} DE {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono-tech text-zinc-300 disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Render selected single page */}
            {currentPage === 1 && (
              <Tomo08MasterPage pageNumber={1} totalPages={totalPages} isCover hideHeaderFooter pageId="t08-page-1">
                {/* Same as continuous cover */}
                <div className="h-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden select-none">
                  <div className="relative z-10 flex items-center justify-between border-b border-emerald-500/30 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-emerald-400 inline-block shadow-[0_0_12px_#10b981]" />
                      <span className="font-mono-tech font-bold text-white text-xs tracking-widest uppercase">
                        EVO LABS // VOL. VIII
                      </span>
                    </div>
                    <span className="font-mono-tech text-[10px] text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                      EDICIÓN MAESTRA // 2026
                    </span>
                  </div>

                  <div className="relative z-10 my-auto py-8 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono-tech text-xs tracking-widest uppercase">
                      <Power className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>SECUENCIA COMPLETA DE ENERGÍA A KERNEL</span>
                    </div>
                    <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-none uppercase">
                      DEL BOTÓN <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                        POWER A WINDOWS
                      </span>
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial max-w-xl leading-relaxed">
                      Tratado forense y visual sobre cada microsegundo del arranque de una PC moderna: +5VSB, PWR_SW, PS_ON#, VRM, CPU Reset, lectura SPI, POST, entrenamiento de RAM, enlace PCIe/GOP, UEFI hand-off, winload.efi y carga del Kernel NT.
                    </p>
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEmbeddedLab()}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 text-black font-mono-tech font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Power className="w-4 h-4 text-black" />
                        <span>ABRIR LABORATORIO DE ARRANQUE Y FALLAS</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 border-t border-emerald-500/30 pt-4 flex flex-wrap items-end justify-between gap-4 text-xs font-mono-tech text-zinc-400">
                    <div>INCLUYE GABINETE ABIERTO & CORTE LATERAL INTERACTIVO</div>
                    <div className="text-emerald-400 font-bold uppercase">ESTÁNDAR UEFI & WINDOWS ARCHITECTURE</div>
                  </div>
                </div>
              </Tomo08MasterPage>
            )}

            {/* Other single pages fall back to continuous scroll target */}
            {currentPage > 1 && (
              <div className="w-full flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setViewMode('continuous')}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono-tech text-emerald-400 hover:bg-zinc-800 transition-colors"
                >
                  Cambiar a Modo Continuo para ver todas las páginas (Pág. {currentPage})
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Export & Download Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d120f] shadow-2xl p-5 space-y-4 font-mono-tech">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-white text-sm uppercase">
                  OPCIONES DE EXPORTACIÓN TOMO 08
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  handleNativePrint();
                }}
                className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Imprimir o Guardar como PDF (A4)</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Utiliza la maqueta vectorial exacta de 210×297mm optimizada para impresión o visor digital.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  handleDownloadOfflineHtml();
                }}
                className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-400 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Descargar Documento HTML Autónomo</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Archivo .html autónomo para consultar en taller sin conexión a internet ni servidor.
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2 text-center text-[10px] text-zinc-500">
              EVO LABS // COPYRIGHT 2026 // MANUAL FORENSE
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
