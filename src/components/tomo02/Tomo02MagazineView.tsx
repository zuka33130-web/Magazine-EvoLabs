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
  Sparkles,
  Layers,
  Terminal,
  ShieldAlert,
  Search,
  BookOpen,
  Sliders,
  Check,
  Cpu,
  Database,
  Key,
} from 'lucide-react';
import { Tomo02MasterPage } from './Tomo02MasterPage';
import {
  TOMO_02_META,
  TOMO_02_FOLDERS,
  TOMO_02_MODULES,
  TOMO_02_CASES,
  TOMO_02_SECRETS,
  TOMO_02_GLOSSARY,
} from '../../data/tomo02Data';
import { Tomo02Cover } from './Tomo02Cover';
import { Tomo02CoverHeroVisual } from './Tomo02CoverHeroVisual';
import { Tomo02EditorialIndex, ModuleProgressStatus } from './Tomo02EditorialIndex';
import {
  Tomo02ModuleReader,
  CHAPTERS_01_TO_09_DATA,
  MODULE_QUESTIONS,
} from './Tomo02ModuleReader';
import {
  Tomo02EditorialHero,
  Tomo02EditorialDiagram,
  Tomo02EditorialComparison,
  Tomo02EditorialPractice,
  Tomo02EditorialCase,
  Tomo02EditorialCheck,
} from './editorial';
import { Tomo02ComoUsarElTomo } from './Tomo02ComoUsarElTomo';
import { EvoTomo02FinalExam } from './EvoTomo02FinalExam';
import { EvoTomo02CompletionScreen } from './EvoTomo02CompletionScreen';
import { Tomo02OfficialPdfMagazine } from './Tomo02OfficialPdfMagazine';

export type Tomo02SubView =
  | 'cover'
  | 'pdf_magazine'
  | 'index'
  | 'reader'
  | 'exam'
  | 'completion'
  | 'a4_magazine';

interface Tomo02MagazineViewProps {
  onBackToApp?: () => void;
  onNavigateTomo?: (tomo: '01' | '02' | '03' | '04' | '08') => void;
  onOpenLab?: () => void;
  initialPage?: number;
  initialSubView?: Tomo02SubView;
}

type ViewMode = 'continuous' | 'single';

const getModuleEditorialVariant = (
  modId: string
): 'hero' | 'diagram' | 'comparison' | 'practice' | 'case' | 'check' => {
  switch (modId) {
    // LAYOUT A: HERO OPENERS (Key Milestone Modules)
    case 'm00':
    case 'm07':
    case 'm12':
    case 'm17':
    case 'm26':
      return 'hero';

    // LAYOUT B & C: TECHNICAL DIAGRAM & ARCHITECTURE
    case 'm01':
    case 'm05':
    case 'm15':
    case 'm25':
      return 'diagram';

    // LAYOUT F: MITO VS REALIDAD CONTRAST
    case 'm03':
    case 'm06':
    case 'm11':
    case 'm16':
    case 'm21':
      return 'comparison';

    // LAYOUT D: PRACTICAL LAB DOSSIERS
    case 'm02':
    case 'm10':
    case 'm13':
    case 'm20':
      return 'practice';

    // LAYOUT E & G: FORENSIC WORKSHOP CASES
    case 'm04':
    case 'm09':
    case 'm14':
    case 'm19':
    case 'm22':
    case 'm23':
      return 'case';

    // LAYOUT H: COMPROBALO (Challenge de comprobación técnica e interpretación pericial)
    case 'm08':
    case 'm18':
    case 'm24':
      return 'check';

    default:
      return 'diagram';
  }
};

export const Tomo02MagazineView: React.FC<Tomo02MagazineViewProps> = ({
  onBackToApp,
  onNavigateTomo,
  onOpenLab,
  initialPage = 1,
  initialSubView,
}) => {
  // Sub-view management
  const [subView, setSubView] = useState<Tomo02SubView>(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('mode') === 'magazine' || p.get('print') === 'true') {
        return 'a4_magazine';
      }
    } catch {
      // ignore
    }
    return initialSubView || 'cover';
  });

  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);

  // Real progress state initialized from localStorage
  const [moduleProgress, setModuleProgress] = useState<ModuleProgressStatus>(() => {
    try {
      const saved = localStorage.getItem('evo_tomo02_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [hasPassedFinalExam, setHasPassedFinalExam] = useState<boolean>(() => {
    try {
      return localStorage.getItem('evo_tomo02_completed') === 'true';
    } catch {
      return false;
    }
  });

  const [examScore, setExamScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('evo_tomo02_exam_score');
      return saved ? parseInt(saved, 10) : 10;
    } catch {
      return 10;
    }
  });

  const completedCount = Object.values(moduleProgress).filter((s) => s === 'completed').length;

  const handleSelectModule = (index: number) => {
    setSelectedModuleIndex(index);
    const modId = TOMO_02_MODULES[index]?.id;
    if (modId && (!moduleProgress[modId] || moduleProgress[modId] === 'not_started')) {
      setModuleProgress((prev) => {
        const updated: ModuleProgressStatus = { ...prev, [modId]: 'in_progress' };
        try {
          localStorage.setItem('evo_tomo02_progress', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
    setSubView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkCompleted = (moduleId: string) => {
    setModuleProgress((prev) => {
      const updated: ModuleProgressStatus = { ...prev, [moduleId]: 'completed' };
      try {
        localStorage.setItem('evo_tomo02_progress', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleExamPassed = (score: number, total: number) => {
    setExamScore(score);
    setHasPassedFinalExam(true);
    try {
      localStorage.setItem('evo_tomo02_completed', 'true');
      localStorage.setItem('evo_tomo02_exam_score', String(score));
    } catch {
      // ignore
    }
    setSubView('completion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<ViewMode>('continuous');
  const [isPreparingPrint, setIsPreparingPrint] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalPages = TOMO_02_META.totalPages;

  // Environment check: whether running embedded inside an iframe (like AI Studio preview)
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
      u.searchParams.set('volume', '02');
      u.searchParams.set('mode', 'magazine');
      u.searchParams.set('print', 'true');
      return u.toString();
    } catch {
      return window.location.href;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

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

  const handleDownloadOfflineHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${TOMO_02_META.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08090C; color: #E4E4E7; margin: 0; padding: 20px; }
    h1 { color: #00D2FF; font-size: 28px; border-bottom: 2px solid #00D2FF; padding-bottom: 8px; }
    h2 { color: #38BDF8; margin-top: 30px; }
    pre { background: #0F172A; padding: 12px; border-radius: 6px; border: 1px solid #1E293B; overflow-x: auto; color: #38BDF8; }
    .box { border: 1px solid #1E293B; background: #0D1117; padding: 16px; margin-bottom: 16px; border-radius: 8px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: rgba(0, 210, 255, 0.2); color: #00D2FF; }
  </style>
</head>
<body>
  <h1>${TOMO_02_META.title}</h1>
  <p><strong>${TOMO_02_META.subtitle}</strong></p>
  <p><em>${TOMO_02_META.manifestoPhrase}</em></p>
  <hr style="border-color: #1E293B;">
  ${TOMO_02_MODULES.map(
    (m) => `
    <div class="box">
      <span class="badge">MÓDULO ${m.moduleNumber} // ${m.categoryTag}</span>
      <h2>${m.title}</h2>
      <p><em>${m.subtitle}</em></p>
      <p>${m.forensicGoal || m.summary}</p>
      <pre><code>${m.powershellCommand || m.forensicCommand || m.practicalCommand || ''}</code></pre>
      <p><strong>Regla de Reversibilidad:</strong> ${m.reversibility || m.scientificFact || ''}</p>
      <p><strong>Falso Positivo:</strong> ${m.falsePositive || m.warningNotice || ''}</p>
    </div>`
  ).join('')}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EVO_LABS_TOMO_02_BIBLIA_NEGRA_WINDOWS.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // If subView is 'cover', 'pdf_magazine', 'index', 'reader', 'exam', or 'completion', render their respective view
  if (subView === 'cover') {
    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans-editorial">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tomo02Cover
            onOpenMagazine={() => {
              setSubView('pdf_magazine');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenInteractive={() => {
              setSubView('index');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLab={() => {
              if (onOpenLab) {
                onOpenLab();
              }
            }}
            onOpenA4WebVersion={() => {
              setSubView('a4_magazine');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToApp={onBackToApp}
            onNavigateTomo={onNavigateTomo}
            completedModulesCount={completedCount}
            totalModulesCount={TOMO_02_MODULES.length}
          />
        </div>
      </div>
    );
  }

  if (subView === 'pdf_magazine') {
    return (
      <Tomo02OfficialPdfMagazine
        onBackToCover={() => {
          setSubView('cover');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenInteractive={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLab={onOpenLab}
      />
    );
  }

  if (subView === 'index') {
    return (
      <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col font-sans-editorial px-4 sm:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <Tomo02EditorialIndex
            onBackToCover={() => {
              setSubView('cover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToApp={onBackToApp}
            onOpenA4Magazine={() => {
              setSubView('a4_magazine');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectModule={handleSelectModule}
            onStartFinalExam={() => {
              setSubView('exam');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCompletionScreen={() => {
              setSubView('completion');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenWindowsMatrixLab={onOpenLab}
            moduleProgress={moduleProgress}
            completedCount={completedCount}
            hasPassedFinalExam={hasPassedFinalExam}
          />
        </div>
      </div>
    );
  }

  if (subView === 'reader') {
    return (
      <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col font-sans-editorial px-4 sm:px-6">
        <Tomo02ModuleReader
          moduleIndex={selectedModuleIndex}
          onBackToIndex={() => {
            setSubView('index');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectModule={handleSelectModule}
          onMarkCompleted={handleMarkCompleted}
          isCompleted={moduleProgress[TOMO_02_MODULES[selectedModuleIndex]?.id] === 'completed'}
          onFinishTomo={() => {
            setSubView('exam');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  if (subView === 'exam') {
    return (
      <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col font-sans-editorial px-4 sm:px-6">
        <EvoTomo02FinalExam
          onBackToIndex={() => {
            setSubView('index');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToTomoCover={() => {
            setSubView('cover');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onCompleteExam={handleExamPassed}
          onGoToModule={(idx) => {
            handleSelectModule(idx);
          }}
          onContinueToLab={onOpenLab}
        />
      </div>
    );
  }

  if (subView === 'completion') {
    return (
      <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col font-sans-editorial px-4 sm:px-6">
        <EvoTomo02CompletionScreen
          onBackToIndex={() => {
            setSubView('index');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToLab={onOpenLab}
          onGoToCampusFormation={onBackToApp}
          onReviewExam={() => {
            setSubView('exam');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenA4Magazine={() => {
            setSubView('a4_magazine');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          score={examScore}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col font-sans-editorial selection:bg-cyan-400 selection:text-black">
      {/* Top Floating Technical Editorial Toolbar (Screen Only) */}
      <nav
        aria-label="Barra de herramientas de la revista"
        className="sticky top-0 z-50 bg-[#080a0e]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech select-none print:hidden"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSubView('index')}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span>← ÍNDICE TOMO 02</span>
          </button>

          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-cyan-900/60 hover:border-cyan-400 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>CAMPUS EVO</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-none inline-block shadow-[0_0_8px_#00D2FF]" />
            <span className="font-black text-white tracking-widest hidden sm:inline">
              EVO LABS // TOMO 02
            </span>
            <span className="text-cyan-400 text-[11px] font-bold">
              REVISTA A4 FACSIMILAR
            </span>
          </div>

          {/* Tomo Selector */}
          <div className="flex items-center gap-1 bg-zinc-950/90 p-1 rounded-xl border border-cyan-950 ml-2">
            <span className="text-[10px] font-mono-tech text-zinc-500 font-bold px-1.5 hidden lg:inline">COLECCIÓN:</span>
            <button
              type="button"
              onClick={() => onNavigateTomo ? onNavigateTomo('01') : onBackToApp?.()}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech text-amber-400 hover:bg-amber-950/40 border border-amber-500/30 transition-all cursor-pointer"
              title="Tomo 01: La Guía Definitiva del Hardware"
            >
              T01
            </button>
            <button
              type="button"
              onClick={() => onNavigateTomo?.('02')}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-cyan-500 text-black border border-cyan-400 shadow-[0_0_8px_rgba(0,210,255,0.4)] cursor-pointer"
              title="Tomo 02: La Biblia Negra de Windows"
            >
              T02
            </button>
            <button
              type="button"
              onClick={() => onNavigateTomo?.('03')}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/30 transition-all cursor-pointer"
              title="Tomo 03: Repará tu Propia PC"
            >
              T03
            </button>
            <button
              type="button"
              onClick={() => onNavigateTomo?.('04')}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech text-purple-400 hover:bg-purple-950/40 border border-purple-500/30 transition-all cursor-pointer"
              title="Tomo 04: Microelectrónica y Portátiles"
            >
              T04
            </button>
          </div>
        </div>

        {/* Center: View mode toggles */}
        <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-lg border border-cyan-950">
          <button
            type="button"
            onClick={() => setViewMode('continuous')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === 'continuous'
                ? 'bg-cyan-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            VISTA COMPLETA A4
          </button>
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-cyan-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            PÁGINA INDIVIDUAL
          </button>
        </div>

        {/* Right: Print / Download PDF actions */}
        <div className="flex items-center gap-2">
          {viewMode === 'single' && (
            <div className="flex items-center gap-1.5 mr-2 text-zinc-400">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-40 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-cyan-300 font-bold">
                {String(currentPage).padStart(2, '0')} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-40 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,210,255,0.4)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DESCARGAR PDF A4</span>
          </button>
        </div>
      </nav>

      {/* Main Magazine Pages Container */}
      <main className="flex-1 py-8 px-2 sm:px-4 flex flex-col items-center gap-8 print:p-0 print:m-0 print:gap-0">
        {/* ========================================================
            PAGE 01: COVER (DOMINÁ WINDOWS // EL LADO OSCURO DE WINDOWS)
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 1) && (
          <Tomo02MasterPage
            pageId="t02-page-01"
            pageNumber={1}
            isCover
            hideHeaderFooter
            accentColor="#00D2FF"
          >
            <div className="h-full w-full flex flex-col justify-between p-6 sm:p-9 lg:p-10 relative overflow-hidden bg-gradient-to-b from-[#020509] via-[#050912] to-[#020306] text-white select-none font-sans-editorial">
              {/* Atmospheric Background Tech Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-tech-grid" />
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />

              {/* ----------------------------------------------------
                  TOP BAR (COLECCIÓN PERICIAL // EDICIÓN COLECCIONABLE)
              ---------------------------------------------------- */}
              <div className="relative z-10 border-b border-cyan-950 pb-2 flex items-center justify-between text-[10px] font-mono-tech tracking-wider text-cyan-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-cyan-400 inline-block shadow-[0_0_8px_#00D2FF]" />
                  <span className="font-bold text-white uppercase tracking-widest">
                    COLECCIÓN PERICIAL // TOMO 02
                  </span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400 uppercase tracking-widest hidden sm:inline">
                    ARQUITECTURA DE SISTEMAS & KERNEL NT
                  </span>
                </div>
                <div className="flex items-center gap-3 text-cyan-400 font-bold">
                  <span className="text-zinc-400 hidden sm:inline">EDICIÓN COLECCIONABLE // 2026</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-[9px]">
                    A4 210×297mm
                  </span>
                </div>
              </div>

              {/* ----------------------------------------------------
                  MASTHEAD: EVO LABS (MASSIVE EDITORIAL LOGO)
              ---------------------------------------------------- */}
              <div className="relative z-10 py-1.5 flex items-baseline justify-between border-b-2 border-cyan-400">
                <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-white uppercase leading-none">
                  EVO LABS
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono-tech shadow-[0_0_12px_rgba(0,210,255,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="hidden sm:inline">INTERNET DICE // EVO MIDE:</span>
                  <span className="font-bold text-white">Windows deja de ser una caja negra.</span>
                </div>
              </div>

              {/* ----------------------------------------------------
                  SUB-HEADER STRIP
              ---------------------------------------------------- */}
              <div className="relative z-10 py-1.5 flex items-center justify-between text-xs font-mono-tech border-b border-cyan-950">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-400 text-black font-extrabold text-[10px] tracking-wider">
                    MAGAZINE // TOMO 02
                  </span>
                  <span className="text-white font-bold tracking-widest uppercase text-[11px]">
                    INGENIERÍA DEL SISTEMA OPERATIVO
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono-tech uppercase tracking-widest hidden md:block">
                  DESMONTAJE DEL KERNEL NT // EDICIÓN METROLÓGICA OFICIAL
                </div>
              </div>

              {/* ----------------------------------------------------
                  MAIN FEATURE BOX: HERO DIAGRAM + DOMINÁ WINDOWS
              ---------------------------------------------------- */}
              <div className="relative z-10 my-auto p-4 sm:p-5 rounded-2xl border border-cyan-900/60 bg-[#060A14]/85 backdrop-blur-md shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-mono-tech pb-2 border-b border-cyan-950">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00D2FF]" />
                    <span>INVESTIGACIÓN PRINCIPAL // TOMO 02</span>
                  </div>
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px]">
                    DESMONTAJE DEL KERNEL NT
                  </span>
                </div>

                {/* Central Windows Architecture Flow Diagram */}
                <div className="my-2">
                  <Tomo02CoverHeroVisual />
                </div>

                {/* Dominá Windows Headline & Hook */}
                <div className="pt-2 border-t border-cyan-950/80">
                  <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter leading-none">
                    DOMINÁ WINDOWS
                  </h2>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-cyan-400 font-bold tracking-widest text-xs sm:text-sm uppercase font-mono-tech">
                      EL LADO OSCURO DE WINDOWS
                    </span>
                    <span className="text-zinc-500">/</span>
                    <span className="text-zinc-300 text-xs sm:text-sm font-sans-editorial italic">
                      Lo usás todos los días. Ahora descubrí qué hace cuando no estás mirando.
                    </span>
                  </div>

                  {/* Highlight Callout Pill */}
                  <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-sans-editorial">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono-tech text-[11px] mb-1">
                      <span className="text-cyan-400">❄</span>
                      <span>WINDOWS HACE COSAS ANTES DE QUE ABRAS TU PRIMER PROGRAMA.</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      Procesos invisibles, servicios en segundo plano, la memoria virtual que nadie te explicó y la telemetría bajo escrutinio forense.
                    </p>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------
                  3 TECHNICAL COLUMNS (PROCESOS, MEMORIA, REGISTRO)
              ---------------------------------------------------- */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono-tech border-t border-cyan-950">
                <div className="space-y-1">
                  <span className="text-cyan-400 font-bold text-[10px] block tracking-wider uppercase">
                    • PROCESOS & SERVICIOS
                  </span>
                  <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                    Quién ejecuta qué, svchost compartido y disparadores por eventos.
                  </p>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-cyan-950 sm:pl-3 pt-1.5 sm:pt-0">
                  <span className="text-cyan-400 font-bold text-[10px] block tracking-wider uppercase">
                    • MEMORIA VIRTUAL
                  </span>
                  <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                    Dossier especial: Commit Charge, Working Set, Standby y Pagefile.
                  </p>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-cyan-950 sm:pl-3 pt-1.5 sm:pt-0">
                  <span className="text-cyan-400 font-bold text-[10px] block tracking-wider uppercase">
                    • REGISTRO & SEGURIDAD
                  </span>
                  <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                    MenuShowDelay, supercompresión compact, hash SHA-256 y defensa activa.
                  </p>
                </div>
              </div>

              {/* ----------------------------------------------------
                  COVER FOOTER: REGLA DE ORO EVO & CITACIÓN
              ---------------------------------------------------- */}
              <div className="relative z-10 pt-2 border-t border-cyan-950/80 flex flex-wrap items-center justify-between text-[10px] font-mono-tech text-zinc-500">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span>🛡️</span>
                  <span>REGLA DE ORO EVO: SI NO PODÉS REVERTIRLO, NO LO TOQUES.</span>
                </div>
                <div className="text-zinc-400">
                  INTERNET DICE // EVO MIDE • <span className="text-cyan-400 font-bold">PÁG. 01 // PORTADA</span>
                </div>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 02: MANIFIESTO & APERTURA EDITORIAL
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 2) && (
          <Tomo02MasterPage
            pageId="t02-page-02"
            pageNumber={2}
            sectionTitle="COLECCIÓN PERICIAL"
            subSlug="APERTURA EDITORIAL // MANIFIESTO"
            pageFooterRight="EL LADO OSCURO DE WINDOWS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 mb-1">
                  <span>❄</span>
                  <span className="uppercase tracking-widest text-[10px] font-bold">LA PREGUNTA QUE NUNCA TE HICISTE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight uppercase leading-tight">
                  ENCENDÉS LA PC. NO ABRISTE CHROME. NO ABRISTE STEAM.
                  <span className="block text-cyan-400 mt-1">¿QUÉ ESTÁ HACIENDO WINDOWS?</span>
                </h2>
              </div>

              {/* Technical Blueprint Visual Box */}
              <div className="p-3 rounded-xl bg-black/80 border border-cyan-950 text-xs font-mono-tech">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-950 text-[10px]">
                  <span className="text-cyan-400 font-bold">
                    LABORATORIO FORENSE EVO // ESTADO EN REPOSO (IDLE)
                  </span>
                  <span className="text-zinc-500">
                    Registro de hilos y descriptores en los primeros 120 segundos
                  </span>
                </div>
                <div className="py-4 flex items-center justify-center">
                  <div className="w-full max-w-xl p-3 rounded-lg bg-[#050811] border border-cyan-900/60 font-mono-tech text-[10px] text-cyan-300 space-y-1">
                    <div className="flex justify-between border-b border-cyan-950 pb-1">
                      <span>THREAD DISPATCHER // IDLE QUEUE:</span>
                      <span className="text-emerald-400">142 HILOS ACTIVOS</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] pt-1 text-zinc-400">
                      <div>svchost (SecSvcs): 12 hilos</div>
                      <div>lsass.exe: 8 descriptores</div>
                      <div>csrss.exe: LPC activo</div>
                      <div>Registry Flusher: Standby</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Editorial Columns with Drop Cap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300 leading-relaxed">
                <div>
                  <p>
                    <span className="float-left text-3xl font-display font-black text-cyan-400 mr-2 leading-none">E</span>
                    l usuario promedio convive con su sistema operativo bajo una ilusión de quietud. Cuando el escritorio aparece y el cursor se detiene, asumimos que la computadora está descansando, esperando pasivamente nuestra próxima orden. Nada está más lejos de la verdad técnica.
                  </p>
                  <p className="mt-2 text-zinc-400">
                    Bajo la superficie de esa pantalla inmóvil, decenas de procesos han sido convocados por el planificador del kernel. Servicios de red intercambian paquetes de comprobación. Tareas programadas analizan si el equipo entró en reposo para comenzar tareas de indexación o comprobación de firmas criptográficas.
                  </p>
                </div>

                <div className="space-y-3">
                  <p>
                    Durante años, internet promovió una respuesta desesperada ante este fenómeno: el <em>debloat ciego</em>. Scripts descargados de foros oscuros que prometen apagar cien servicios con un doble clic, o trucos milagrosos que limpian el Registro para "duplicar los cuadros por segundo".
                  </p>

                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-[11px]">
                    <span className="text-cyan-400 font-bold block mb-1 font-mono-tech text-[10px] uppercase">
                      • EL PRINCIPIO EDITORIAL DE ESTE TOMO:
                    </span>
                    <p className="text-zinc-200 leading-snug">
                      No queremos menos procesos por obsesión; queremos menos cosas desconocidas. El objetivo de este volumen no es un Administrador de Tareas vacío: es la certeza absoluta de qué hace tu sistema operativo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Investigation Bar */}
              <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-cyan-950 flex flex-wrap items-center justify-between text-[10px] font-mono-tech">
                <span className="text-cyan-400 font-bold">INVESTIGACIÓN RECURRENTE</span>
                <span className="text-white">WINDOWS HACE COSAS QUE NUNCA TE CONTARON</span>
                <span className="text-cyan-300">EXPEDIENTE DISTRIBUIDO // CAPÍTULOS 01 A 14 →</span>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 03: LAS 6 REGLAS INMUTABLES & SEMÁFORO PERICIAL
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 3) && (
          <Tomo02MasterPage
            pageId="t02-page-03"
            pageNumber={3}
            sectionTitle="REGLAS DEL INVESTIGADOR"
            subSlug="FILOSOFÍA DE TRABAJO & SEMÁFORO PERICIAL"
            pageFooterRight="HACEMOS MILAGROS, PERO LOS MEDIMOS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block font-bold">
                  MANIFIESTO TÉCNICO
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                  LAS 6 REGLAS INMUTABLES DEL INVESTIGADOR
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  Todo lo que aprenderás en este volumen se rige por un método científico riguroso y determinista.
                </p>
              </div>

              {/* 6 Inmutable Rules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono-tech">
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1">
                  <span className="text-cyan-400 font-bold block text-[11px]">01 // OBSERVAR</span>
                  <p className="text-[10.5px] text-zinc-400 font-sans-editorial leading-snug">
                    Identificar el fenómeno antes de actuar. Registrar el estado en reposo sin precipitarse.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1">
                  <span className="text-cyan-400 font-bold block text-[11px]">02 // ENTENDER</span>
                  <p className="text-[10.5px] text-zinc-400 font-sans-editorial leading-snug">
                    Comprender qué componente es dueño de la función. No asumir que todo lo desconocido es basura.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1">
                  <span className="text-cyan-400 font-bold block text-[11px]">03 // INVESTIGAR</span>
                  <p className="text-[10.5px] text-zinc-400 font-sans-editorial leading-snug">
                    Consultar la documentación oficial (Microsoft Learn) y no foros anónimos sin sustento.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1">
                  <span className="text-cyan-400 font-bold block text-[11px]">04 // MEDIR</span>
                  <p className="text-[10.5px] text-zinc-400 font-sans-editorial leading-snug">
                    Establecer una métrica objetiva con unidades de medida: milisegundos, bytes o ciclos de reloj.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1">
                  <span className="text-cyan-400 font-bold block text-[11px]">05 // INTERVENIR</span>
                  <p className="text-[10.5px] text-zinc-400 font-sans-editorial leading-snug">
                    Cambiar un único parámetro por vez de manera deliberada y documentada.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1">
                  <span className="text-cyan-400 font-bold block text-[11px]">06 // REVERTIR</span>
                  <p className="text-[10.5px] text-zinc-400 font-sans-editorial leading-snug">
                    La regla de oro: si no podés revertir el cambio en cinco segundos, no tenés permiso de tocar.
                  </p>
                </div>
              </div>

              {/* Semáforo de Intervención EVO */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-tech border-b border-cyan-950 pb-1">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider">
                    EL SEMÁFORO DE INTERVENCIÓN // CÓDIGO DE RIESGO
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    CLASIFICACIÓN OFICIAL EVO
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono-tech">
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-[0_0_8px_#34d399]" />
                    <div>
                      <span className="text-emerald-300 font-bold block text-[11px]">
                        NIVEL VERDE // OBSERVACIÓN & CONSULTA SEGURA
                      </span>
                      <p className="text-[10.5px] text-zinc-400 font-sans-editorial">
                        Comandos de sólo lectura, consultas en PowerShell, inspección de procesos, atajos del sistema y telemetría pasiva. No altera el estado de Windows.
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0 shadow-[0_0_8px_#fbbf24]" />
                    <div>
                      <span className="text-amber-300 font-bold block text-[11px]">
                        NIVEL AMARILLO // MODIFICACIÓN CONTROLADA CON PRE-CONDICIÓN
                      </span>
                      <p className="text-[10.5px] text-zinc-400 font-sans-editorial">
                        Desactivación de aplicaciones de inicio, cambios en tareas programadas de terceros o ajuste de preferencias. Requiere documentar el estado original antes de accionar.
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1 shrink-0 shadow-[0_0_8px_#f43f5e]" />
                    <div>
                      <span className="text-rose-300 font-bold block text-[11px]">
                        NIVEL ROJO // ZONA CRÍTICA (REGISTRO & SUBSISTEMAS)
                      </span>
                      <p className="text-[10.5px] text-zinc-400 font-sans-editorial">
                        Edición directa de colmenas del Registro, modificación de servicios dependientes del kernel o borrado de carpetas protegidas. Prohibido ejecutar sin backup .reg y Punto de Restauración previo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Axioma Editorial Supremo */}
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/50 flex items-center justify-between font-mono-tech text-xs">
                <div>
                  <span className="text-[9px] text-cyan-400 uppercase tracking-widest block font-bold">
                    ADVERTENCIA // AXIOMA EDITORIAL SUPREMO
                  </span>
                  <span className="text-white font-bold text-sm tracking-wide">
                    “SI NO PODÉS REVERTIRLO, NO LO TOQUES.”
                  </span>
                </div>
                <span className="px-3 py-1 rounded bg-cyan-500 text-black font-extrabold text-[10px] tracking-wider">
                  CUSTODIA EVO
                </span>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 03: CÓMO USAR EL TOMO // GUÍA METODOLÓGICA
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 3) && (
          <Tomo02MasterPage
            pageId="t02-page-03"
            pageNumber={3}
            totalPages={totalPages}
            sectionTitle="GUÍA METODOLÓGICA"
            subSlug="CÓMO USAR EL TOMO & ARCHIVO EVO"
            accentColor="#00D2FF"
          >
            <Tomo02ComoUsarElTomo
              onCopySnippet={handleCopySnippet}
              copiedSnippet={copiedSnippet}
            />
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 04: LAS 15 CARPETAS MAESTRAS DE WINDOWS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 4) && (
          <Tomo02MasterPage
            pageId="t02-page-04"
            pageNumber={4}
            totalPages={totalPages}
            sectionTitle="MAPA DE ALMACENAMIENTO"
            subSlug="LAS 15 CARPETAS MAESTRAS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  CARTOGRAFÍA FORENSE
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  LAS 15 CARPETAS CRÍTICAS DEL SISTEMA
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Qué contiene cada una, por qué crecen y cuáles podés depurar con seguridad total.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono-tech">
                {TOMO_02_FOLDERS.slice(0, 9).map((f) => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded-lg bg-zinc-950/80 border border-cyan-950 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-cyan-400 font-bold">{f.path}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                            f.safetyBadge === 'VERDE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : f.safetyBadge === 'AMARILLO'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {f.safetyBadge}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight mb-1">
                        {f.purpose}
                      </p>
                    </div>
                    <div className="text-[9px] text-zinc-500 border-t border-zinc-900 pt-1">
                      {f.dangerNotice || f.canDeleteOrClean}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/50 text-xs font-mono-tech text-cyan-300 flex items-center justify-between">
                <span>COMANDO PARA DEPURAR COMPONENTES OBSOLETOS EN WINSXS:</span>
                <code className="bg-black/60 px-2 py-1 rounded text-white border border-cyan-900">
                  dism.exe /online /cleanup-image /startcomponentcleanup
                </code>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 05: ÍNDICE MAESTRO DE LOS 26 MÓDULOS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 5) && (
          <Tomo02MasterPage
            pageId="t02-page-05"
            pageNumber={5}
            totalPages={totalPages}
            sectionTitle="SUMARIO EJECUTIVO"
            subSlug="ÍNDICE DE 26 MÓDULOS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  ESTRUCTURA DE CONSULTA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ÍNDICE MAESTRO FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  26 áreas de conocimiento autónomas, desde el arranque EFI hasta la telemetría del Kernel.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono-tech overflow-y-auto max-h-[720px] pr-1">
                {TOMO_02_MODULES.map((m, mIdx) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (viewMode === 'single') {
                        setCurrentPage(6 + mIdx);
                      }
                      const el = document.getElementById(`t02-mod-${m.moduleNumber}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded bg-zinc-950/60 border border-cyan-950 hover:border-cyan-500/60 transition-all flex items-start gap-2.5 cursor-pointer group"
                  >
                    <span className="text-cyan-400 font-bold group-hover:text-cyan-300">
                      [{m.moduleNumber}]
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px] group-hover:text-cyan-200">
                          {m.title}
                        </span>
                        <span className="text-[9px] text-zinc-500">{m.readTime}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono-tech text-zinc-500 text-center">
                HAZ CLIC EN CUALQUIER MÓDULO PARA NAVEGAR DIRECTO A SU INVESTIGACIÓN
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            MODULE PAGES: 26 TECHNICAL MODULES (A4 EDITORIAL SPREADS)
        ======================================================== */}
        {TOMO_02_MODULES.map((mod, idx) => {
          const modPageNumber = 6 + idx;
          if (viewMode === 'single' && currentPage !== modPageNumber) {
            return null;
          }

          const richData = CHAPTERS_01_TO_09_DATA[mod.id];
          const variant = getModuleEditorialVariant(mod.id);

          return (
            <Tomo02MasterPage
              key={mod.id}
              pageId={`t02-mod-${mod.moduleNumber}`}
              pageNumber={modPageNumber}
              totalPages={totalPages}
              sectionTitle={`MÓDULO ${mod.moduleNumber}`}
              subSlug={mod.categoryTag}
              accentColor="#00D2FF"
            >
              {variant === 'hero' && (
                <Tomo02EditorialHero
                  module={mod}
                  richData={richData}
                  onCopySnippet={handleCopySnippet}
                  copiedSnippet={copiedSnippet}
                />
              )}
              {variant === 'diagram' && (
                <Tomo02EditorialDiagram
                  module={mod}
                  richData={richData}
                />
              )}
              {variant === 'comparison' && (
                <Tomo02EditorialComparison
                  module={mod}
                  richData={richData}
                />
              )}
              {variant === 'practice' && (
                <Tomo02EditorialPractice
                  module={mod}
                  richData={richData}
                  onCopySnippet={handleCopySnippet}
                  copiedSnippet={copiedSnippet}
                />
              )}
              {variant === 'case' && (
                <Tomo02EditorialCase
                  module={mod}
                  richData={richData}
                />
              )}
              {variant === 'check' && (
                <Tomo02EditorialCheck
                  module={mod}
                  questionData={MODULE_QUESTIONS[mod.id]}
                />
              )}
            </Tomo02MasterPage>
          );
        })}

        {/* ========================================================
            PAGE 33: CASOS FORENSES DE WINDOWS GUIADOS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 33) && (
          <Tomo02MasterPage
            pageId="t02-page-33"
            pageNumber={33}
            totalPages={totalPages}
            sectionTitle="EXPEDIENTES FORENSES"
            subSlug="CASOS REALES DE TALLER"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  BANCO DE PRUEBAS RESUELTO
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  CASOS FORENSES GUIADOS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  4 incidentes reales analizados con el método EVO: del síntoma a la causa raíz.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech">
                {TOMO_02_CASES.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-zinc-900 pb-1 mb-1.5">
                        <span className="font-bold">{c.title}</span>
                        <span className="text-zinc-500">{c.toolUsed}</span>
                      </div>
                      <div className="text-[11px] text-zinc-300 space-y-1">
                        <p><strong className="text-zinc-400">Síntoma:</strong> {c.symptom}</p>
                        <p><strong className="text-amber-400">Hipótesis falsa:</strong> {c.hypothesis}</p>
                        <p><strong className="text-cyan-400">Causa Raíz:</strong> {c.rootCause}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-900 text-[10px] text-emerald-400">
                      <strong>Acción pericial:</strong> {c.resolution}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-cyan-950 text-xs font-mono-tech text-zinc-300 flex items-center justify-between">
                <span>REGLA FORENSE N° 1:</span>
                <span className="text-cyan-400 font-bold">
                  “EL SÍNTOMA NUNCA ES LA CAUSA RAÍZ.”
                </span>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 34: LOS 5 SECRETOS DEL KERNEL
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 34) && (
          <Tomo02MasterPage
            pageId="t02-page-34"
            pageNumber={34}
            totalPages={totalPages}
            sectionTitle="MICRO-ARQUITECTURA"
            subSlug="SECRETOS DEL KERNEL"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  DOCUMENTACIÓN AVANZADA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  LOS 5 SECRETOS FORENSES DEL KERNEL
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Conceptos que los cursos convencionales callan y la telemetría real desmiente.
                </p>
              </div>

              <div className="space-y-2.5 text-xs font-mono-tech">
                {TOMO_02_SECRETS.map((s, sIdx) => (
                  <div
                    key={s.id || sIdx}
                    className="p-3 rounded-xl bg-zinc-950/70 border border-cyan-950 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-cyan-400">
                      <span className="font-bold text-white text-[12px]">
                        SECRETO #{sIdx + 1}: {s.title || s.name}
                      </span>
                    </div>
                    <p className="text-zinc-300 font-sans-editorial text-[11px] leading-relaxed">
                      {s.explanation || s.description}
                    </p>
                    <div className="p-2 rounded bg-black/70 border border-cyan-950 text-[10px] text-cyan-300">
                      <strong>Impacto Técnico Real:</strong> {s.impact || s.whyItMatters}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-900/40 text-[10px] font-mono-tech text-zinc-400 text-center">
                DESARROLLADO A PARTIR DE LOS ESTÁNDARES DE MICROSOFT WINDOWS INTERNALS (RUSSINOVICH & SOLOMON).
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 35: GLOSARIO FORENSE A-Z
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 35) && (
          <Tomo02MasterPage
            pageId="t02-page-35"
            pageNumber={35}
            totalPages={totalPages}
            sectionTitle="DICCIONARIO TÉCNICO"
            subSlug="GLOSARIO FORENSE A-Z"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  TERMINOLOGÍA PRECISA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  GLOSARIO FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Conceptos esenciales para hablar con rigor pericial y no con mitos de foro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech overflow-y-auto max-h-[720px] pr-1">
                {TOMO_02_GLOSSARY.map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-2.5 rounded-lg bg-zinc-950/70 border border-cyan-950 space-y-1"
                  >
                    <span className="text-cyan-300 font-bold text-[11px]">
                      {g.term}
                    </span>
                    <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                      {g.definition || g.technicalDefinition}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2 text-[10px] font-mono-tech text-zinc-500 text-center border-t border-zinc-900">
                TOTAL DE TÉRMINOS DEFINIDOS: {TOMO_02_GLOSSARY.length} CONCEPTOS CRÍTICOS
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 36: PASAPORTE / FICHA DE AUDITORÍA FORENSE IMPRIMIBLE
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 36) && (
          <Tomo02MasterPage
            pageId="t02-page-36"
            pageNumber={36}
            totalPages={totalPages}
            sectionTitle="INSTRUMENTO DE TALLER"
            subSlug="FICHA DE AUDITORÍA DE WINDOWS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  HERRAMIENTA DE CAMPO
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  HOJA DE AUDITORÍA FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Completá esta ficha técnica antes y después de intervenir cualquier sistema.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border-2 border-dashed border-cyan-900 space-y-4 font-mono-tech text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">FECHA DE PERITAJE:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">VERSIÓN DE WINDOWS:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">BUILD NUMBER:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">TÉCNICO A CARGO:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-cyan-400 font-bold text-[11px] block">
                      LÍNEA BASE INICIAL (PRE-INTERVENCIÓN):
                    </span>
                    <div className="space-y-1.5 text-[11px] text-zinc-400">
                      <div>Latencia DPC máxima (µs): ______________</div>
                      <div>Cantidad de procesos en reposo: ________</div>
                      <div>Consumo de RAM en reposo (GB): _________</div>
                      <div>Tiempo de arranque LastBIOS (seg): _____</div>
                      <div>Servicios no Microsoft activos: ________</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-emerald-400 font-bold text-[11px] block">
                      LÍNEA BASE FINAL (POST-INTERVENCIÓN):
                    </span>
                    <div className="space-y-1.5 text-[11px] text-zinc-400">
                      <div>Latencia DPC máxima (µs): ______________</div>
                      <div>Cantidad de procesos en reposo: ________</div>
                      <div>Consumo de RAM en reposo (GB): _________</div>
                      <div>Tiempo de arranque LastBIOS (seg): _____</div>
                      <div>Delta de mejora verificado (%): ________</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-1">
                    FIRMA DE CONFORMIDAD Y PUNTO DE RESTAURACIÓN CREADO:
                  </span>
                  <div className="h-10 border border-zinc-800 rounded bg-zinc-950/50 p-2 text-[10px] text-zinc-600">
                    Nombre del Restore Point: EVO_AUDIT_BASELINE_[FECHA] // SHA256 Registro Respaldado
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono-tech text-cyan-400 text-center">
                ESTA FICHA PUEDE IMPRIMIRSE DIRECTAMENTE EN HOJA A4 PARA INCORPORAR AL EXPEDIENTE DE TALLER.
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 37: BACK COVER / CONTRATAPA
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === totalPages) && (
          <Tomo02MasterPage
            pageId="t02-page-37"
            pageNumber={totalPages}
            totalPages={totalPages}
            isBackCover
            hideHeaderFooter
            accentColor="#00D2FF"
          >
            <div className="h-full w-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#030609] via-[#05080E] to-[#020305] text-white">
              <div className="border-b border-cyan-950 pb-4">
                <span className="text-xs font-mono-tech text-cyan-400 tracking-widest uppercase">
                  COLECCIÓN EDITORIAL EVO LABS // CIERRE DE EDICIÓN
                </span>
                <h2 className="text-3xl font-display font-black text-white mt-1">
                  TOMO 02 // LA BIBLIA NEGRA DE WINDOWS
                </h2>
              </div>

              <div className="my-auto max-w-lg space-y-4">
                <blockquote className="border-l-2 border-cyan-400 pl-4 text-base sm:text-lg text-zinc-300 font-sans-editorial italic">
                  “No hay magia en el software. Hay millones de instrucciones lógicas ejecutándose en nanosegundos. Quien domina la telemetría, domina la máquina.”
                </blockquote>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-2 text-xs font-mono-tech">
                  <span className="text-cyan-400 font-bold block">
                    COMPETENCIAS DESBLOQUEADAS:
                  </span>
                  <p className="text-zinc-400">
                    ✔ Diagnóstico pericial de servicios e hilos del Kernel.<br />
                    ✔ Auditoría de latencias DPC y audio en tiempo real.<br />
                    ✔ Depuración metódica sin dañar la integridad del sistema.<br />
                    ✔ Análisis forense de eventos y volcados de memoria (Minidumps).
                  </p>
                </div>
              </div>

              <div className="border-t border-cyan-950 pt-4 flex items-end justify-between text-xs font-mono-tech text-zinc-500">
                <div>
                  <span className="text-white font-bold">EVO LABS RESEARCH GROUP</span>
                  <p className="text-[10px]">Buenos Aires // Edición Pericial 2026</p>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold tracking-widest text-sm">
                    FIN DEL TOMO 02
                  </span>
                  <p className="text-[9px]">CONTINÚA EN TOMO 03: REPARÁ TU PC</p>
                </div>
              </div>
            </div>
          </Tomo02MasterPage>
        )}
      </main>

      {/* Export / PDF Modal */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-[#0b0e14] border border-cyan-900/80 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl font-sans-editorial">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Exportar Tomo 02 a PDF A4
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 font-mono-tech">
              <p className="font-sans-editorial text-sm">
                Para obtener un PDF de calidad editorial idéntico a una revista impresa:
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-cyan-950 space-y-1.5 text-[11px]">
                <div>1. Destino: <strong>Guardar como PDF</strong></div>
                <div>2. Tamaño de papel: <strong>A4</strong></div>
                <div>3. Márgenes: <strong>Ninguno / 0 mm</strong></div>
                <div>4. Gráficos de fondo: <strong>Activado (Obligatorio)</strong></div>
              </div>

              {isInIframe && (
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900 text-cyan-300 text-[11px] space-y-2">
                  <p>
                    💡 Estás en una vista de previsualización. Para abrir el diálogo de impresión nativo sin restricciones del navegador:
                  </p>
                  <a
                    href={getStandalonePrintUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ABRIR EN PESTAÑA NUEVA PARA IMPRIMIR</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-cyan-950">
              <button
                type="button"
                onClick={handleDownloadOfflineHtml}
                className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>DESCARGAR HTML OFFLINE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  handleNativePrint();
                }}
                className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,210,255,0.4)]"
              >
                <Printer className="w-4 h-4" />
                <span>IMPRIMIR AHORA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
