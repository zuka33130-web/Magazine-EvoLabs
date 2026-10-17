import React, { useState, useEffect, useCallback } from 'react';
import { safeStorage } from '../../utils/safeStorage';
import type { LegacySectorStatus } from './shared/useTomo02LegacySectorProgress';
import { getExamHistory } from '../exam/utils/examStorage';
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
import { TOMO_02_COVER } from '../../data/tomoCoversData';
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
  Tomo02EditorialSectionOpener,
} from './editorial';
import { Tomo02ComoUsarElTomo } from './Tomo02ComoUsarElTomo';
import { EvoTomo02FinalExam } from './EvoTomo02FinalExam';
import { EvoTomo02CompletionScreen } from './EvoTomo02CompletionScreen';
import { Tomo02OfficialPdfMagazine } from './Tomo02OfficialPdfMagazine';
import { Tomo02Sector00View } from './sector00/Tomo02Sector00View';
import { Tomo02Sector01View } from './sector01/Tomo02Sector01View';
import { Tomo02Sector02View } from './sector02/Tomo02Sector02View';
import { Tomo02Sector03View } from './sector03/Tomo02Sector03View';
import { Tomo02Sector04View } from './sector04/Tomo02Sector04View';
import { Tomo02Sector05View } from './sector05/Tomo02Sector05View';
import { Tomo02Sector06View } from './sector06/Tomo02Sector06View';
import { Tomo02Sector07View } from './sector07/Tomo02Sector07View';
import { Tomo02Sector08View } from './sector08/Tomo02Sector08View';
import { Tomo02Sector09View } from './sector09/Tomo02Sector09View';
import { Tomo02Sector10View } from './sector10/Tomo02Sector10View';
import { getAdvancedSector } from '../../data/tomo02AdvancedContent';
const Tomo02AdvancedSectorView = React.lazy(() => import('./advanced/Tomo02AdvancedSectorView').then((m) => ({ default: m.Tomo02AdvancedSectorView })));

export type Tomo02SubView =
  | 'cover'
  | 'pdf_magazine'
  | 'index'
  | 'reader'
  | 'exam'
  | 'completion'
  | 'a4_magazine'
  | 'sector_00'
  | 'sector_01'
  | 'sector_02'
  | 'sector_03'
  | 'sector_04'
  | 'sector_05'
  | 'sector_06'
  | 'sector_07'
  | 'sector_08'
  | 'sector_09'
  | 'sector_10'
  | 'advanced_sector'
  | 'original_sector';

interface Tomo02MagazineViewProps {
  onBackToApp?: () => void;
  onNavigateTomo?: (tomo: '01' | '02' | '03' | '04' | '08') => void;
  onOpenLab?: () => void;
  initialPage?: number;
  initialSubView?: Tomo02SubView;
  initialSectorNumber?: string;
}

type ViewMode = 'continuous' | 'single';

export const SECTION_START_MODULES: Record<string, string> = {
  m00: 'I',
  m03: 'II',
  m06: 'III',
  m10: 'IV',
  m14: 'V',
  m19: 'VI',
};

const getModuleEditorialVariant = (
  modId: string
): 'hero' | 'diagram' | 'comparison' | 'practice' | 'case' | 'check' => {
  switch (modId) {
    // HERO:
    case 'm00':
    case 'm07':
    case 'm12':
    case 'm17':
    case 'm26':
      return 'hero';

    // DIAGRAM:
    case 'm01':
    case 'm05':
    case 'm15':
    case 'm25':
      return 'diagram';

    // COMPARISON:
    case 'm03':
    case 'm06':
    case 'm11':
    case 'm16':
    case 'm21':
      return 'comparison';

    // PRACTICE:
    case 'm02':
    case 'm10':
    case 'm13':
    case 'm20':
      return 'practice';

    // CASE:
    case 'm04':
    case 'm09':
    case 'm14':
    case 'm19':
    case 'm22':
    case 'm23':
      return 'case';

    // CHECK:
    case 'm08':
    case 'm18':
    case 'm24':
      return 'check';

    default:
      return 'diagram';
  }
};

const TOMO_02_SECTOR_IDS = Array.from({ length: 40 }, (_, number) => `sector-${String(number).padStart(2, '0')}`);
const verifiedTomo02Exam = () => getExamHistory('tomo-02').find(attempt =>
  attempt.passed === true && Number.isInteger(attempt.score) && Number.isInteger(attempt.totalQuestions) &&
  attempt.totalQuestions > 0 && attempt.score >= 0 && attempt.score <= attempt.totalQuestions &&
  attempt.score / attempt.totalQuestions >= 0.7
);
const hasFinalExperimentEvidence = () => {
  try { return JSON.parse(safeStorage.getItem('evo_tomo02_sector39_learning_v1') || '{}')?.finalExperiment === true; }
  catch { return false; }
};

export const Tomo02MagazineView: React.FC<Tomo02MagazineViewProps> = ({
  onBackToApp,
  onNavigateTomo,
  onOpenLab,
  initialPage = 1,
  initialSubView,
  initialSectorNumber,
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

  const [selectedSectorNumber, setSelectedSectorNumber] = useState(getAdvancedSector(initialSectorNumber || safeStorage.getItem('evo_tomo02_last_sector') || '')?.number || '11');

  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);

  // Real progress state initialized from safeStorage
  const [moduleProgress, setModuleProgress] = useState<ModuleProgressStatus>(() => {
    try {
      const saved = safeStorage.getItem('evo_tomo02_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  // Tomo 02 completion is strictly FALSE until all 40 sectors (Sector 00 to 39),
  // master lab and final exam are completed.
  const [hasPassedFinalExam, setHasPassedFinalExam] = useState<boolean>(() => Boolean(verifiedTomo02Exam()));

  const [examScore, setExamScore] = useState<number>(() => verifiedTomo02Exam()?.score ?? 0);
  const [examTotal, setExamTotal] = useState<number>(() => verifiedTomo02Exam()?.totalQuestions ?? 0);
  const sectorCompletionReady = TOMO_02_SECTOR_IDS.every(id => moduleProgress[id] === 'completed');
  const completionEligible = hasPassedFinalExam && sectorCompletionReady && hasFinalExperimentEvidence();
  useEffect(() => {
    // A legacy exam-only completion flag must not grant a certificate.
    safeStorage.setItem('evo_tomo02_completed', completionEligible ? 'true' : 'false');
  }, [completionEligible]);

  const completedCount = Object.values(moduleProgress).filter((s) => s === 'completed').length;

  const handleSelectModule = (index: number) => {
    setSelectedModuleIndex(index);
    const modId = TOMO_02_MODULES[index]?.id;
    if (modId && (!moduleProgress[modId] || moduleProgress[modId] === 'not_started')) {
      setModuleProgress((prev) => {
        const updated: ModuleProgressStatus = { ...prev, [modId]: 'in_progress' };
        try {
          safeStorage.setItem('evo_tomo02_progress', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
    setSubView('reader');
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  };

  const handleSectorProgress = useCallback((moduleId: string, status: LegacySectorStatus) => {
    setModuleProgress(prev => {
      if ((prev[moduleId] || 'not_started') === status) return prev;
      const updated: ModuleProgressStatus = { ...prev, [moduleId]: status };
      try { safeStorage.setItem('evo_tomo02_progress', JSON.stringify(updated)); }
      catch { /* localStorage can be unavailable */ }
      return updated;
    });
  }, []);

  const handleMarkCompleted = (moduleId: string) => {
    setModuleProgress((prev) => {
      if (prev[moduleId] === 'completed') return prev;
      const updated: ModuleProgressStatus = { ...prev, [moduleId]: 'completed' };
      try {
        safeStorage.setItem('evo_tomo02_progress', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleExamPassed = (score: number, total: number) => {
    setExamScore(score);
    setExamTotal(total);
    setHasPassedFinalExam(true);
    // La teoría aprobada se conserva por separado de la finalización del tomo.
    safeStorage.setItem('evo_tomo02_exam_score', String(score));
    if (sectorCompletionReady && hasFinalExperimentEvidence()) {
      safeStorage.setItem('evo_tomo02_completed', 'true');
      setSubView('completion');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Si faltan sectores o evidencia, EvoTomeExamEngine muestra el resultado,
    // pero no se emite una constancia de tomo completo.
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

  // Ensure continuous DOM for native browser print (Ctrl+P or Browser Menu) and set precise Tomo 02 title
  useEffect(() => {
    let originalTitle = document.title;
    const handleBeforePrint = () => {
      originalTitle = document.title;
      setViewMode('continuous');
      document.title = 'EVO-LABS-MAGAZINE-TOMO-02-LA-BIBLIA-NEGRA-DE-WINDOWS';
    };
    const handleAfterPrint = () => {
      document.title = originalTitle;
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Listen for direct URL print parameter (?print=true or ?pdf=true) to auto-invoke native print
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('print') === 'true' || params.get('pdf') === 'true') {
        setViewMode('continuous');
        document.title = 'EVO-LABS-MAGAZINE-TOMO-02-LA-BIBLIA-NEGRA-DE-WINDOWS';

        const triggerAutoPrint = async () => {
          try {
            if (document.fonts?.ready) {
              await document.fonts.ready;
            }
          } catch {
            // ignore
          }

          setTimeout(async () => {
            try {
              await document.querySelector<HTMLImageElement>('#t02-page-01 img')?.decode();
              window.print();
            } catch (err) {
              console.warn('Auto-print falló o requiere interacción del usuario:', err);
            }
          }, 800);
        };

        triggerAutoPrint();
      }
    } catch {
      // ignore
    }
  }, []);

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
    document.title = 'EVO-LABS-MAGAZINE-TOMO-02-LA-BIBLIA-NEGRA-DE-WINDOWS';
    setTimeout(async () => {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        // ignore
      }
      await document.querySelector<HTMLImageElement>('#t02-page-01 img')?.decode();
      window.print();
      setIsPreparingPrint(false);
    }, 400);
  };

  const handleDownloadOfflineHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>EVO-LABS-MAGAZINE-TOMO-02-LA-BIBLIA-NEGRA-DE-WINDOWS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08090C; color: #E4E4E7; margin: 0; padding: 24px; max-width: 900px; margin: 0 auto; }
    h1 { color: #00D2FF; font-size: 28px; border-bottom: 2px solid #00D2FF; padding-bottom: 8px; margin-top: 10px; }
    h2 { color: #38BDF8; margin-top: 24px; margin-bottom: 6px; }
    pre { background: #070B12; padding: 12px; border-radius: 6px; border: 1px solid #102A45; overflow-x: auto; color: #38BDF8; font-family: monospace; }
    .box { border: 1px solid #102A45; background: #090D16; padding: 18px; margin-bottom: 18px; border-radius: 10px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: rgba(0, 210, 255, 0.2); color: #00D2FF; margin-bottom: 8px; }
    @media print {
      body { background: #08090C !important; color: #fff !important; padding: 0 !important; }
      .box { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>EVO LABS // TOMO 02: LA BIBLIA NEGRA DE WINDOWS</h1>
  <p><strong>Edición Oficial Completa // 38 Páginas A4</strong></p>
  <p><em>“SI NO PODÉS REVERTIRLO, NO LO TOQUES.”</em></p>
  <hr style="border-color: #102A45; margin: 20px 0;">
  ${TOMO_02_MODULES.map(
    (m) => `
    <div class="box">
      <span class="badge">MÓDULO ${m.moduleNumber} // ${m.categoryTag}</span>
      <h2>${m.title}</h2>
      <p style="color: #00D2FF; font-size: 13px;"><em>${m.subtitle}</em></p>
      <p>${m.forensicGoal || m.summary}</p>
      ${m.powershellCommand || m.forensicCommand || m.practicalCommand ? `<pre><code>${m.powershellCommand || m.forensicCommand || m.practicalCommand}</code></pre>` : ''}
      <p><strong>Regla de Reversibilidad:</strong> ${m.reversibility || m.scientificFact || ''}</p>
      <p><strong>Falso Positivo / Advertencia:</strong> ${m.falsePositive || m.warningNotice || ''}</p>
    </div>`
  ).join('')}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EVO-LABS-MAGAZINE-TOMO-02-LA-BIBLIA-NEGRA-DE-WINDOWS.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenAdvancedSector = (number: string) => {
    if (!getAdvancedSector(number)) return;
    setSelectedSectorNumber(number);
    setSubView('advanced_sector');
    safeStorage.setItem('evo_tomo02_last_sector', number);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  };

  const handleOpenOriginalSector = (number: string) => {
    if (!/^(0[0-9]|[12][0-9]|3[0-9])$/.test(number)) return;
    if (Number(number) < 11) {
      setSubView(`sector_${number}` as Tomo02SubView);
    } else {
      handleOpenAdvancedSector(number);
    }
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  };

  if (subView === 'advanced_sector' || subView === 'original_sector') {
    const content = getAdvancedSector(selectedSectorNumber)!;
    return <div className="min-h-screen bg-[#07090e] text-zinc-100">
      <React.Suspense fallback={<p role="status" className="p-8 text-cyan-300">Cargando Sector {content.number}…</p>}>
        <Tomo02AdvancedSectorView key={content.number} content={content} completed={moduleProgress[`sector-${content.number}`] === 'completed'}
          onBack={() => setSubView('index')} onNavigate={handleOpenAdvancedSector} onComplete={handleMarkCompleted} />
      </React.Suspense>
    </div>;
  }

  // If subView is 'cover', 'pdf_magazine', 'index', 'reader', 'exam', 'completion', 'sector_00', or 'sector_01', render their respective view
  if (subView === 'sector_00') {
    return (
      <Tomo02Sector00View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_01') {
    return (
      <Tomo02Sector01View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_02') {
    return (
      <Tomo02Sector02View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_03') {
    return (
      <Tomo02Sector03View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector02={() => {
          setSubView('sector_02');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector04={() => {
          setSubView('sector_04');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_04') {
    return (
      <Tomo02Sector04View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector02={() => {
          setSubView('sector_02');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector03={() => {
          setSubView('sector_03');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_05') {
    return (
      <Tomo02Sector05View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector02={() => {
          setSubView('sector_02');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_06') {
    return (
      <Tomo02Sector06View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector02={() => {
          setSubView('sector_02');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector05={() => {
          setSubView('sector_05');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_07') {
    return (
      <Tomo02Sector07View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector02={() => {
          setSubView('sector_02');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector05={() => {
          setSubView('sector_05');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector06={() => {
          setSubView('sector_06');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_08') {
    return (
      <Tomo02Sector08View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector02={() => {
          setSubView('sector_02');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector05={() => {
          setSubView('sector_05');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector06={() => {
          setSubView('sector_06');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector07={() => {
          setSubView('sector_07');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_09') {
    return (
      <Tomo02Sector09View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector02={() => {
          setSubView('sector_02');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector05={() => {
          setSubView('sector_05');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector06={() => {
          setSubView('sector_06');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector07={() => {
          setSubView('sector_07');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector08={() => {
          setSubView('sector_08');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'sector_10') {
    return (
      <Tomo02Sector10View
        onSectorProgress={handleSectorProgress}
        onBackToMagazine={() => {
          setSubView('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector00={() => {
          setSubView('sector_00');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector01={() => {
          setSubView('sector_01');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector02={() => {
          setSubView('sector_02');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector05={() => {
          setSubView('sector_05');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector06={() => {
          setSubView('sector_06');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector07={() => {
          setSubView('sector_07');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector08={() => {
          setSubView('sector_08');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSector09={() => {
          setSubView('sector_09');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (subView === 'cover') {
    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans-editorial">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tomo02Cover
            onOpenSector00={() => {
              setSubView('sector_00');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector01={() => {
              setSubView('sector_01');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMagazine={() => {
              setSubView('a4_magazine');
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
        onOpenA4Magazine={() => {
          setSubView('a4_magazine');
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
          {getAdvancedSector(safeStorage.getItem('evo_tomo02_last_sector') || '') && <button type="button"
            onClick={() => handleOpenAdvancedSector(safeStorage.getItem('evo_tomo02_last_sector')!)}
            className="mt-4 px-4 py-2 rounded-xl border border-cyan-400 text-cyan-300 text-sm">
            Continuar último sector: {safeStorage.getItem('evo_tomo02_last_sector')}
          </button>}
          <Tomo02EditorialIndex
            onOpenOriginalSector={handleOpenOriginalSector}
            onOpenAdvancedSector={handleOpenAdvancedSector}
            onBackToCover={() => {
              setSubView('cover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToApp={onBackToApp}
            onOpenSector00={() => {
              setSubView('sector_00');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector01={() => {
              setSubView('sector_01');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector02={() => {
              setSubView('sector_02');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector03={() => {
              setSubView('sector_03');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector04={() => {
              setSubView('sector_04');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector05={() => {
              setSubView('sector_05');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector06={() => {
              setSubView('sector_06');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector07={() => {
              setSubView('sector_07');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector08={() => {
              setSubView('sector_08');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector09={() => {
              setSubView('sector_09');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSector10={() => {
              setSubView('sector_10');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
              setSubView(completionEligible ? 'completion' : 'index');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenWindowsMatrixLab={onOpenLab}
            moduleProgress={moduleProgress}
            completedCount={completedCount}
            hasPassedFinalExam={hasPassedFinalExam}
            canIssueCertificate={completionEligible}
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
          onOpenMagazine={(page?: number) => {
            if (page) setCurrentPage(page);
            setSubView('a4_magazine');
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
    if (!completionEligible) {
      return <div className="min-h-screen bg-[#060709] text-zinc-100 p-8 max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-amber-400">Finalización pendiente</h2>
        <p>La constancia requiere los 40 sectores completados, evidencia válida del Sector 39 y examen general aprobado. Aprobar solo la teoría no completa el tomo.</p>
        <button type="button" className="px-4 py-2 rounded-lg bg-sky-700" onClick={() => setSubView('index')}>Volver al índice</button>
      </div>;
    }
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
          total={examTotal}
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
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setSubView('cover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-cyan-400 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            title="Volver a la Portada del Tomo 02"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <span>← PORTADA TOMO 02</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubView('index');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            title="Ir al Índice Interactivo de 27 módulos"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>TOMO INTERACTIVO →</span>
          </button>

          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              title="Volver a Inicio // Centro de Operaciones Mundo EVO"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-cyan-900/60 hover:border-cyan-400 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer hidden lg:inline-flex"
            >
              <span>INICIO</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-none inline-block shadow-[0_0_8px_#00D2FF]" />
            <span className="font-black text-white tracking-widest hidden md:inline">
              EVO LABS // TOMO 02
            </span>
            <span className="text-cyan-400 text-[11px] font-bold">
              MAGAZINE A4 // LA BIBLIA NEGRA DE WINDOWS
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
            PAGE 01: COVER (REVISTA EDITORIAL A4 // TOMO 02)
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 1) && (
          <Tomo02MasterPage
            pageId="t02-page-01"
            pageNumber={1}
            isCover
            hideHeaderFooter
            accentColor="#00D2FF"
          >
            <img
              src={TOMO_02_COVER}
              alt="Portada definitiva de EVO LABS — Tomo 02: La Biblia Negra de Windows"
              className="block w-full h-full object-contain"
            />
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
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block font-bold mb-0.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono-tech">
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5">
                  <span className="text-cyan-300 font-bold block text-xs tracking-wider">01 // OBSERVAR</span>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    Identificar el fenómeno antes de actuar. Registrar el estado en reposo sin precipitarse.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5">
                  <span className="text-cyan-300 font-bold block text-xs tracking-wider">02 // ENTENDER</span>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    Comprender qué componente es dueño de la función. No asumir que todo lo desconocido es basura.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5">
                  <span className="text-cyan-300 font-bold block text-xs tracking-wider">03 // INVESTIGAR</span>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    Consultar la documentación oficial (Microsoft Learn) y no foros anónimos sin sustento.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5">
                  <span className="text-cyan-300 font-bold block text-xs tracking-wider">04 // MEDIR</span>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    Establecer una métrica objetiva con unidades de medida: milisegundos, bytes o ciclos de reloj.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5">
                  <span className="text-cyan-300 font-bold block text-xs tracking-wider">05 // INTERVENIR</span>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    Cambiar un único parámetro por vez de manera deliberada y documentada.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5">
                  <span className="text-cyan-300 font-bold block text-xs tracking-wider">06 // REVERTIR</span>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                    La regla de oro: si no podés revertir el cambio en cinco segundos, no tenés permiso de tocar.
                  </p>
                </div>
              </div>

              {/* Semáforo de Intervención EVO */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono-tech border-b border-cyan-950 pb-1.5">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">
                    EL SEMÁFORO DE INTERVENCIÓN // CÓDIGO DE RIESGO
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    CLASIFICACIÓN OFICIAL EVO
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono-tech">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-[0_0_8px_#34d399]" />
                    <div>
                      <span className="text-emerald-300 font-bold block text-xs tracking-wide">
                        NIVEL VERDE // OBSERVACIÓN & CONSULTA SEGURA
                      </span>
                      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-0.5">
                        Comandos de sólo lectura, consultas en PowerShell, inspección de procesos, atajos del sistema y telemetría pasiva. No altera el estado de Windows.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0 shadow-[0_0_8px_#fbbf24]" />
                    <div>
                      <span className="text-amber-300 font-bold block text-xs tracking-wide">
                        NIVEL AMARILLO // MODIFICACIÓN CONTROLADA CON PRE-CONDICIÓN
                      </span>
                      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-0.5">
                        Desactivación de aplicaciones de inicio, cambios en tareas programadas de terceros o ajuste de preferencias. Requiere documentar el estado original antes de accionar.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1 shrink-0 shadow-[0_0_8px_#f43f5e]" />
                    <div>
                      <span className="text-rose-300 font-bold block text-xs tracking-wide">
                        NIVEL ROJO // ZONA CRÍTICA (REGISTRO & SUBSISTEMAS)
                      </span>
                      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-0.5">
                        Edición directa de colmenas del Registro, modificación de servicios dependientes del kernel o borrado de carpetas protegidas. Prohibido ejecutar sin backup .reg y Punto de Restauración previo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Axioma Editorial Supremo */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/50 flex items-center justify-between font-mono-tech text-xs">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">
                    ADVERTENCIA // AXIOMA EDITORIAL SUPREMO
                  </span>
                  <span className="text-white font-bold text-base sm:text-lg tracking-wide">
                    “SI NO PODÉS REVERTIRLO, NO LO TOQUES.”
                  </span>
                </div>
                <span className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-black font-extrabold text-xs tracking-wider">
                  CUSTODIA EVO
                </span>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 04: CÓMO USAR EL TOMO // GUÍA METODOLÓGICA
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 4) && (
          <Tomo02MasterPage
            pageId="t02-page-04"
            pageNumber={4}
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
            PAGE 05: LAS 15 CARPETAS MAESTRAS DE WINDOWS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 5) && (
          <Tomo02MasterPage
            pageId="t02-page-05"
            pageNumber={5}
            totalPages={totalPages}
            sectionTitle="MAPA DE ALMACENAMIENTO"
            subSlug={`LAS ${TOMO_02_FOLDERS.length} CARPETAS MAESTRAS`}
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-2.5 font-sans-editorial">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block font-bold mb-0.5">
                  CARTOGRAFÍA FORENSE
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">
                  LAS {TOMO_02_FOLDERS.length} CARPETAS CRÍTICAS DEL SISTEMA
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  Qué contiene cada una, por qué crecen y cuáles podés depurar con seguridad pericial.
                </p>
              </div>

              {/* 15 Folders Grid - Crisp Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono-tech">
                {TOMO_02_FOLDERS.map((f) => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded-lg bg-zinc-950/80 border border-cyan-950/90 flex flex-col justify-between space-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1 gap-1.5">
                        <span className="text-cyan-300 font-bold truncate">{f.path}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
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
                      <p className="text-[11px] text-zinc-200 font-sans-editorial leading-snug mb-1">
                        {f.purpose}
                      </p>
                    </div>
                    <div className="text-[10px] text-zinc-400 border-t border-zinc-900/80 pt-1 truncate font-mono-tech">
                      {f.dangerNotice || f.canDeleteOrClean}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/50 text-xs font-mono-tech text-cyan-300 flex items-center justify-between">
                <span className="font-bold">DEPURACIÓN SEGURA DE COMPONENTES EN WINSXS:</span>
                <code className="bg-black/80 px-2.5 py-1 rounded text-white border border-cyan-900 text-xs font-mono-tech">
                  dism.exe /online /cleanup-image /startcomponentcleanup
                </code>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 06: ÍNDICE MAESTRO DE LOS 27 MÓDULOS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 6) && (
          <Tomo02MasterPage
            pageId="t02-page-06"
            pageNumber={6}
            totalPages={totalPages}
            sectionTitle="SUMARIO EJECUTIVO"
            subSlug={`ÍNDICE DE ${TOMO_02_MODULES.length} MÓDULOS`}
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-2.5 font-sans-editorial">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block font-bold mb-0.5">
                  ESTRUCTURA DE CONSULTA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">
                  ÍNDICE MAESTRO FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  {TOMO_02_MODULES.length} áreas de conocimiento autónomas, desde el arranque EFI hasta la telemetría del Kernel.
                </p>
              </div>

              {/* Clean 2-Column Grid: Number + Title + Reading Time */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                {TOMO_02_MODULES.map((m, mIdx) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (viewMode === 'single') {
                        setCurrentPage(7 + mIdx);
                      }
                      const el = document.getElementById(`t02-mod-${m.moduleNumber}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 sm:p-2.5 rounded-lg bg-zinc-950/80 border border-cyan-950/90 hover:border-cyan-500/60 transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-cyan-400 font-bold text-xs shrink-0 font-mono-tech">
                        [{m.moduleNumber}]
                      </span>
                      <span className="font-bold text-white text-xs truncate uppercase font-mono-tech group-hover:text-cyan-200">
                        {m.title}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-cyan-400/80 font-mono-tech shrink-0 font-medium">
                      {m.readTime}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-xs font-mono-tech text-zinc-400 text-center py-1.5 border-t border-zinc-900 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>HAZ CLIC EN CUALQUIER MÓDULO PARA NAVEGAR DIRECTO A SU INVESTIGACIÓN</span>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            MODULE PAGES: 27 TECHNICAL MODULES (A4 EDITORIAL SPREADS)
        ======================================================== */}
        {TOMO_02_MODULES.map((mod, idx) => {
          const modPageNumber = 7 + idx;
          if (viewMode === 'single' && currentPage !== modPageNumber) {
            return null;
          }

          const richData = CHAPTERS_01_TO_09_DATA[mod.id];
          const variant = getModuleEditorialVariant(mod.id);
          const hasSectionOpener = Boolean(SECTION_START_MODULES[mod.id]);

          return (
            <Tomo02MasterPage
              key={mod.id}
              pageId={`t02-mod-${mod.moduleNumber}`}
              pageNumber={modPageNumber}
              totalPages={totalPages}
              sectionTitle={
                hasSectionOpener
                  ? `SECCIÓN ${SECTION_START_MODULES[mod.id]} // MÓDULO ${mod.moduleNumber}`
                  : `MÓDULO ${mod.moduleNumber}`
              }
              subSlug={mod.categoryTag}
              accentColor="#00D2FF"
            >
              <div className="flex-1 w-full flex flex-col justify-between min-h-0 gap-2">
                {/* Apertura de Sección Hero Integrada (para m00, m03, m06, m10, m14, m19) */}
                {hasSectionOpener && (
                  <Tomo02EditorialSectionOpener
                    moduleId={mod.id}
                    integrated={true}
                  />
                )}

                {/* Contenido Editorial Real del Módulo (Conserva variant original) */}
                <div className="flex-1 min-h-0 flex flex-col justify-between">
                  {variant === 'hero' && (
                    <Tomo02EditorialHero
                      module={mod}
                      richData={richData}
                      onCopySnippet={handleCopySnippet}
                      copiedSnippet={copiedSnippet}
                      isSectionOpener={hasSectionOpener}
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
                      isSectionOpener={hasSectionOpener}
                    />
                  )}
                  {variant === 'practice' && (
                    <Tomo02EditorialPractice
                      module={mod}
                      richData={richData}
                      onCopySnippet={handleCopySnippet}
                      copiedSnippet={copiedSnippet}
                      isSectionOpener={hasSectionOpener}
                    />
                  )}
                  {variant === 'case' && (
                    <Tomo02EditorialCase
                      module={mod}
                      richData={richData}
                      isSectionOpener={hasSectionOpener}
                    />
                  )}
                  {variant === 'check' && (
                    <Tomo02EditorialCheck
                      module={mod}
                      questionData={MODULE_QUESTIONS[mod.id]}
                    />
                  )}
                </div>

                {/* Discrete synchronization CTA to Interactive Module (Hidden in Print / PDF export) */}
                <div className="pt-1.5 border-t border-cyan-950/70 flex items-center justify-between text-[9.5px] font-mono-tech shrink-0 print:hidden no-print">
                  <span className="text-zinc-500">
                    MÓDULO {mod.moduleNumber} // {mod.categoryTag}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectModule(idx)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>[ PRACTICAR ESTE TEMA ]</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectModule(idx)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold transition-colors cursor-pointer shadow-sm"
                    >
                      <span>VER MÓDULO INTERACTIVO →</span>
                    </button>
                  </div>
                </div>
              </div>
            </Tomo02MasterPage>
          );
        })}

        {/* ========================================================
            PAGE 34: CASOS FORENSES DE WINDOWS GUIADOS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 34) && (
          <Tomo02MasterPage
            pageId="t02-page-34"
            pageNumber={34}
            totalPages={totalPages}
            sectionTitle="EXPEDIENTES FORENSES"
            subSlug="CASOS REALES DE TALLER"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block font-bold mb-0.5">
                  BANCO DE PRUEBAS RESUELTO
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">
                  CASOS FORENSES GUIADOS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  4 incidentes reales analizados con el método EVO: del síntoma a la causa raíz sin formatear.
                </p>
              </div>

              {/* 4 Clean Editorial Rows */}
              <div className="space-y-2.5 text-xs font-mono-tech">
                {TOMO_02_CASES.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-zinc-950/85 border border-cyan-950/90 space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                      <span className="font-bold text-white text-xs sm:text-sm tracking-wide">
                        {c.title}
                      </span>
                      <span className="text-[10.5px] font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
                        {c.toolUsed}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <strong className="text-zinc-400 block text-[10.5px] uppercase font-bold mb-0.5 font-mono-tech">
                          SÍNTOMA:
                        </strong>
                        <p className="text-zinc-300 font-sans-editorial leading-snug">
                          {c.symptom}
                        </p>
                      </div>
                      <div>
                        <strong className="text-amber-400 block text-[10.5px] uppercase font-bold mb-0.5 font-mono-tech">
                          HIPÓTESIS FALSA:
                        </strong>
                        <p className="text-amber-200/90 font-sans-editorial leading-snug">
                          {c.hypothesis}
                        </p>
                      </div>
                      <div>
                        <strong className="text-cyan-400 block text-[10.5px] uppercase font-bold mb-0.5 font-mono-tech">
                          CAUSA RAÍZ:
                        </strong>
                        <p className="text-cyan-200 font-sans-editorial leading-snug">
                          {c.rootCause}
                        </p>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-zinc-900 text-xs text-emerald-400 font-mono-tech">
                      <strong>ACCIÓN PERICIAL:</strong> {c.resolution}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/70 border border-cyan-950 text-xs font-mono-tech text-zinc-300 flex items-center justify-between">
                <span>REGLA FORENSE N° 1:</span>
                <span className="text-cyan-400 font-bold text-xs sm:text-sm">
                  “EL SÍNTOMA NUNCA ES LA CAUSA RAÍZ: MEDÍ ANTES DE INTERVENIR.”
                </span>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 35: LOS 5 SECRETOS DEL KERNEL
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 35) && (
          <Tomo02MasterPage
            pageId="t02-page-35"
            pageNumber={35}
            totalPages={totalPages}
            sectionTitle="MICRO-ARQUITECTURA"
            subSlug="SECRETOS DEL KERNEL"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block font-bold mb-0.5">
                  DOCUMENTACIÓN AVANZADA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">
                  LOS 5 SECRETOS FORENSES DEL KERNEL
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  Conceptos que los cursos convencionales callan y la telemetría real desmiente.
                </p>
              </div>

              {/* 5 Secrets with Generous Breathing Room */}
              <div className="space-y-2.5 text-xs font-mono-tech">
                {TOMO_02_SECRETS.map((s, sIdx) => (
                  <div
                    key={s.id || sIdx}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950/90 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-cyan-300">
                      <span className="font-bold text-white text-xs sm:text-sm">
                        SECRETO #{sIdx + 1}: {s.title || s.name}
                      </span>
                    </div>
                    <p className="text-zinc-200 font-sans-editorial text-xs leading-relaxed">
                      {s.explanation || s.description}
                    </p>
                    <div className="p-2 rounded-lg bg-black/70 border border-cyan-950 text-xs text-cyan-300 font-mono-tech">
                      <strong>IMPACTO TÉCNICO REAL:</strong> {s.impact || s.whyItMatters}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs font-mono-tech text-zinc-400 text-center">
                DESARROLLADO A PARTIR DE LOS ESTÁNDARES DE MICROSOFT WINDOWS INTERNALS (RUSSINOVICH & SOLOMON).
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 36: GLOSARIO FORENSE A-Z
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 36) && (
          <Tomo02MasterPage
            pageId="t02-page-36"
            pageNumber={36}
            totalPages={totalPages}
            sectionTitle="DICCIONARIO TÉCNICO"
            subSlug="GLOSARIO FORENSE A-Z"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block font-bold mb-0.5">
                  TERMINOLOGÍA PRECISA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase">
                  GLOSARIO FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  Conceptos esenciales para hablar con rigor pericial y no con mitos de foro.
                </p>
              </div>

              {/* 2 Clean Continuous Editorial Dictionary Columns (Zero Crowded Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs font-sans-editorial">
                {TOMO_02_GLOSSARY.map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className="border-b border-zinc-900/90 pb-2 space-y-0.5"
                  >
                    <span className="text-cyan-300 font-bold text-xs sm:text-[13px] font-mono-tech block">
                      {g.term}
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                      {g.definition || g.technicalDefinition}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 text-xs font-mono-tech text-zinc-400 text-center border-t border-zinc-900 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>TOTAL DE TÉRMINOS DEFINIDOS: {TOMO_02_GLOSSARY.length} CONCEPTOS CRÍTICOS DEL SISTEMA OPERATIVO</span>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 37: PASAPORTE / FICHA DE AUDITORÍA FORENSE IMPRIMIBLE
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 37) && (
          <Tomo02MasterPage
            pageId="t02-page-37"
            pageNumber={37}
            totalPages={totalPages}
            sectionTitle="INSTRUMENTO DE TALLER"
            subSlug="FICHA DE AUDITORÍA DE WINDOWS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between gap-3 font-sans-editorial">
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-cyan-950">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest font-bold">
                      HERRAMIENTA DE CAMPO // PROTOCOLO FÍSICO
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono-tech text-[10px] font-bold">
                      FORMATO A4
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono-tech text-zinc-500 uppercase">
                    EXPEDIENTE N°: EVO-WS-____-____
                  </span>
                </div>
                <h2 className="text-2xl font-display font-black text-white tracking-tight uppercase mt-1">
                  HOJA DE AUDITORÍA FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  Completá esta ficha técnica antes y después de intervenir cualquier sistema. Apta para escritura manual en taller.
                </p>
              </div>

              {/* Spacious Printable Worksheet - Full A4 Utilization */}
              <div className="flex-1 p-4 rounded-xl bg-black/90 border-2 border-dashed border-cyan-900/90 flex flex-col justify-between gap-3.5 font-mono-tech text-xs">
                {/* 1. Identification Header Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-xs text-zinc-300 block font-bold">FECHA DE PERITAJE:</span>
                    <div className="h-8 border-b-2 border-zinc-600 mt-1 flex items-end text-zinc-500 text-[11px] px-1">
                      ___ / ___ / 202_
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-300 block font-bold">VERSIÓN DE WINDOWS:</span>
                    <div className="h-8 border-b-2 border-zinc-600 mt-1 flex items-end text-zinc-500 text-[11px] px-1">
                      Win 10 / Win 11 Ed: _______
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-300 block font-bold">BUILD / KERNEL NT:</span>
                    <div className="h-8 border-b-2 border-zinc-600 mt-1 flex items-end text-zinc-500 text-[11px] px-1">
                      10.0.____________________
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-300 block font-bold">TÉCNICO A CARGO:</span>
                    <div className="h-8 border-b-2 border-zinc-600 mt-1"></div>
                  </div>
                </div>

                {/* 2. Baseline Comparison Tables (Pre vs Post) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-zinc-950/90 border border-cyan-950 space-y-2.5">
                    <span className="text-cyan-400 font-bold text-xs uppercase tracking-wide block pb-1 border-b border-cyan-950">
                      LÍNEA BASE INICIAL (PRE-INTERVENCIÓN):
                    </span>
                    <div className="space-y-2.5 text-xs text-zinc-300">
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Latencia DPC máxima (µs):</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Procesos activos en reposo:</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Consumo de RAM en reposo (GB):</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Tiempo LastBIOS (seg):</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Servicios de terceros activos:</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950/90 border border-emerald-950/80 space-y-2.5">
                    <span className="text-emerald-400 font-bold text-xs uppercase tracking-wide block pb-1 border-b border-emerald-950">
                      LÍNEA BASE FINAL (POST-INTERVENCIÓN):
                    </span>
                    <div className="space-y-2.5 text-xs text-zinc-300">
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Latencia DPC máxima (µs):</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Procesos activos en reposo:</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Consumo de RAM en reposo (GB):</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Tiempo LastBIOS (seg):</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-1">
                        <span>Delta de mejora medido (%):</span>
                        <span className="w-24 border-b border-zinc-600 text-right"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Lined Observations Section for Manual Workshop Notes */}
                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-300 block font-bold uppercase tracking-wider">
                    OBSERVACIONES PERICIALES & HALLAZGOS EN KERNEL (ESCRITURA MANUAL):
                  </span>
                  <div className="space-y-2.5 pt-1">
                    <div className="h-6 border-b border-dotted border-zinc-600"></div>
                    <div className="h-6 border-b border-dotted border-zinc-600"></div>
                    <div className="h-6 border-b border-dotted border-zinc-600"></div>
                  </div>
                </div>

                {/* 4. Restore Point & Signature Block */}
                <div className="pt-2 border-t border-zinc-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                      <strong className="text-cyan-400 block uppercase text-[11px]">PUNTO DE RESTAURACIÓN DE SEGURIDAD:</strong>
                      <div className="text-white font-mono text-[11px]">EVO_AUDIT_BASELINE_[____________________]</div>
                      <span className="text-emerald-400 text-[10px] block">✔ VERIFICADO CON SYSTEMRESTORE CLI</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex flex-col justify-between h-full min-h-[64px]">
                      <span className="text-zinc-400 font-bold uppercase text-[11px]">FIRMA DEL TÉCNICO Y SELLO:</span>
                      <div className="border-b-2 border-zinc-500 mt-4 text-right text-[10px] text-zinc-600">
                        FIRMA Y CONFORMIDAD FORENSE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono-tech text-cyan-300 text-center py-0.5">
                ESTA FICHA PUEDE IMPRIMIRSE DIRECTAMENTE EN HOJA A4 PARA INCORPORAR AL EXPEDIENTE DE TALLER.
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 38: BACK COVER / CONTRATAPA
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 38 || currentPage === totalPages) && (
          <Tomo02MasterPage
            pageId="t02-page-38"
            pageNumber={38}
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

        {/* End of Magazine Navigation Handoff Deck */}
        <div className="w-full max-w-[210mm] mx-auto p-6 rounded-2xl bg-[#080d18] border border-cyan-900/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech my-8 print:hidden">
          <div>
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block">
              FINALIZASTE LA LECTURA DEL MAGAZINE A4
            </span>
            <p className="text-xs text-zinc-400 font-sans-editorial mt-0.5">
              Continuá con las prácticas de terminal, comprobaciones y examen del Tomo Interactivo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSubView('index');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/20"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>IR AL TOMO INTERACTIVO →</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSubView('cover');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              ← PORTADA TOMO 02
            </button>
          </div>
        </div>
      </main>

      {/* Export / PDF Modal */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="no-print fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-[#0b0e15] border-2 border-cyan-400/80 rounded-xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative font-mono-tech my-auto">
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 cursor-pointer bg-zinc-900 rounded border border-zinc-800"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-3">
              <div className="w-9 h-9 rounded bg-cyan-400/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                  <span>DESCARGAR PDF EDITORIAL // A4</span>
                  <span className="px-1.5 py-0.2 bg-cyan-400/20 text-cyan-400 text-[10px] font-bold rounded border border-cyan-400/40">
                    38 PÁGINAS
                  </span>
                </h3>
                <p className="text-zinc-400 text-[11px]">
                  EVO LABS MAGAZINE // TOMO 02 // LA BIBLIA NEGRA DE WINDOWS
                </p>
              </div>
            </div>

            {isInIframe && (
              <div className="mb-4 p-3 bg-cyan-400/10 border border-cyan-400/40 rounded-lg text-xs text-cyan-200 flex items-start gap-2.5">
                <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">Aviso de Entorno Seguro:</span> Al visualizar la app en un recuadro integrado (iFrame), los navegadores restringen la apertura del cuadro de impresión directo. Para generar el PDF con máxima resolución vectorial y las 38 páginas en orden exacto, abrí el documento en pestaña completa:
                </div>
              </div>
            )}

            {/* ACTION 1: OPEN IN CLEAN FULLSCREEN TAB (RECOMMENDED & UNBLOCKABLE) */}
            <div className="space-y-3 mb-5">
              <a
                href={getStandalonePrintUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowExportModal(false)}
                className="w-full py-3.5 px-4 bg-cyan-400 hover:bg-cyan-300 active:scale-[0.99] text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(0,210,255,0.45)] border border-cyan-300"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>ABRIR EN PESTAÑA COMPLETA Y GUARDAR PDF</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* ACTION 2: FORCE PRINT IN CURRENT WINDOW */}
                <button
                  type="button"
                  onClick={() => {
                    setShowExportModal(false);
                    handleNativePrint();
                  }}
                  className="py-2.5 px-3 bg-[#161a25] hover:bg-[#202738] text-zinc-200 hover:text-white border border-zinc-700/80 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Imprimir en esta ventana</span>
                </button>

                {/* ACTION 3: DOWNLOAD COMPLETE OFFLINE HTML */}
                <button
                  type="button"
                  onClick={handleDownloadOfflineHtml}
                  className="py-2.5 px-3 bg-[#161a25] hover:bg-[#202738] text-zinc-200 hover:text-white border border-zinc-700/80 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  title="Descargar archivo .html completo con todas las 38 páginas para abrir y guardar offline"
                >
                  <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Descargar HTML Offline</span>
                </button>
              </div>
            </div>

            {/* Directives for Clean Vector PDF */}
            <div className="p-3 bg-black/60 border border-zinc-800 rounded-lg text-[11px] text-zinc-300 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                ⚙️ Configuración recomendada en el cuadro de impresión:
              </span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-zinc-300">
                <div>• Destino: <strong className="text-white">Guardar como PDF</strong></div>
                <div>• Tamaño: <strong className="text-white">A4 (210×297 mm)</strong></div>
                <div>• Márgenes: <strong className="text-white">Ninguno / 0 mm</strong></div>
                <div>• Gráficos de fondo: <strong className="text-emerald-400">Activado</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
