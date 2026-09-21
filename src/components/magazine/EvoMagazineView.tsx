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
} from 'lucide-react';
import { Page01Cover } from './Page01Cover';
import { Page02Manifesto } from './Page02Manifesto';
import { Page03PactoLector } from './Page03PactoLector';
import { Page04MetodoEvo } from './Page04MetodoEvo';
import { Page05PruebaCero } from './Page05PruebaCero';
import { Page06SistemaEvo } from './Page06SistemaEvo';
import { Page07Index } from './Page07Index';
import { Page04Topology } from './Page04Topology';
import { Page05Mito01Ram } from './Page05Mito01Ram';
import { Page06Chapter01Opener } from './Page06Chapter01Opener';
import { Page07Chapter01Trampas } from './Page07Chapter01Trampas';
import { Page08Chapter01PowerShell } from './Page08Chapter01PowerShell';
import { Page09Chapter01Mito02 } from './Page09Chapter01Mito02';
import { Page10Chapter01FichaEvo } from './Page10Chapter01FichaEvo';
import { Page11Chapter02Opener } from './Page11Chapter02Opener';
import { Page12Chapter02Latencias } from './Page12Chapter02Latencias';
import { Page13Chapter02Mito03 } from './Page13Chapter02Mito03';
import { Page14Chapter03Opener } from './Page14Chapter03Opener';
import { Page15Chapter03Frametime } from './Page15Chapter03Frametime';
import { Page16Chapter03Mito04 } from './Page16Chapter03Mito04';
import { Page17Chapter04Opener } from './Page17Chapter04Opener';
import { Page18Chapter04MurosTermicos } from './Page18Chapter04MurosTermicos';
import { Page19Chapter04Mito05 } from './Page19Chapter04Mito05';
import { Page20Chapter05Opener } from './Page20Chapter05Opener';
import { Page21Chapter05Kernel } from './Page21Chapter05Kernel';
import { Page22Chapter05Mito06 } from './Page22Chapter05Mito06';
import { DossierP01Checkpoint } from './DossierP01Checkpoint';
import { DossierP02PuertasArranque } from './DossierP02PuertasArranque';
import { DossierP03AppsInicio } from './DossierP03AppsInicio';
import { DossierP04Operacion100Programas } from './DossierP04Operacion100Programas';
import { DossierP05SegundoPlano } from './DossierP05SegundoPlano';
import { DossierP06ServiciosWindows } from './DossierP06ServiciosWindows';
import { DossierP07SysMainExperimento } from './DossierP07SysMainExperimento';
import { DossierP08TareasProgramadas } from './DossierP08TareasProgramadas';
import { DossierP09TemporalesLimpieza } from './DossierP09TemporalesLimpieza';
import { DossierP10LimpiezaProfunda } from './DossierP10LimpiezaProfunda';
import { DossierP11MicroTweaks } from './DossierP11MicroTweaks';
import { DossierP12FinalCheckpoint } from './DossierP12FinalCheckpoint';
import { Page35Chapter06Opener } from './Page35Chapter06Opener';
import { Page36Chapter06ArbolForense } from './Page36Chapter06ArbolForense';
import { Page37Chapter06Mito07 } from './Page37Chapter06Mito07';
import { Page38Chapter07Opener } from './Page38Chapter07Opener';
import { Page39Chapter07MatrizAB } from './Page39Chapter07MatrizAB';
import { Page40Chapter07Mito08 } from './Page40Chapter07Mito08';
import { Page45FuentesTecnicas } from './Page45FuentesTecnicas';
import { Page46BackCover } from './Page46BackCover';

interface EvoMagazineViewProps {
  onBackToApp?: () => void;
  initialPage?: number;
}

type ViewMode = 'continuous' | 'single' | 'spread';

export const EvoMagazineView: React.FC<EvoMagazineViewProps> = ({
  onBackToApp,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<ViewMode>('continuous');
  const [isPreparingPrint, setIsPreparingPrint] = useState<boolean>(false);
  const [showConfigHelper, setShowConfigHelper] = useState<boolean>(false);

  const totalPages = 46;

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

  // Ensure continuous DOM for native browser print (Ctrl+P or Browser Menu)
  useEffect(() => {
    const handleBeforePrint = () => {
      setViewMode('continuous');
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, []);

  const pageComponents = [
    { num: 1, title: 'Portada // Edición Coleccionable 2026', comp: <Page01Cover key="p1" /> },
    { num: 2, title: 'Manifiesto EVO Labs // No adivines. Comprobalo.', comp: <Page02Manifesto key="p2" /> },
    { num: 3, title: 'Pacto con el Lector // Una ruta, dos velocidades', comp: <Page03PactoLector key="p3" /> },
    { num: 4, title: 'El Método EVO // Los 7 Pasos de la Verdad', comp: <Page04MetodoEvo key="p4" /> },
    { num: 5, title: 'Prueba Cero EVO // Baseline Inmutable', comp: <Page05PruebaCero key="p5" /> },
    { num: 6, title: 'Cómo Leer Este Tomo // Archivo & Soberanía', comp: <Page06SistemaEvo key="p6" /> },
    {
      num: 7,
      title: 'Índice Visual // Sumario Completo',
      comp: (
        <Page07Index
          key="p7"
          onSelectPage={(pageNum) => {
            setCurrentPage(pageNum + 1);
            if (viewMode === 'continuous') {
              const el = document.getElementById(`magazine-page-${String(pageNum + 1).padStart(2, '0')}`);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      ),
    },
    { num: 8, title: 'Topología // Anatomía del Silicio', comp: <Page04Topology key="p8" /> },
    { num: 9, title: 'Expediente Mito-01 // Slots de RAM', comp: <Page05Mito01Ram key="p9" /> },
    { num: 10, title: 'Capítulo 01 // ¿Qué PC tenés realmente?', comp: <Page06Chapter01Opener key="p10" /> },
    { num: 11, title: 'Capítulo 01 // Las Trampas Comerciales', comp: <Page07Chapter01Trampas key="p11" /> },
    { num: 12, title: 'Capítulo 01 // Probalo en tu PC: PowerShell', comp: <Page08Chapter01PowerShell key="p12" /> },
    { num: 13, title: 'Expediente Mito-02 // Núcleos en MSConfig', comp: <Page09Chapter01Mito02 key="p13" /> },
    { num: 14, title: 'Capítulo 01 // Ficha Forense EVO', comp: <Page10Chapter01FichaEvo key="p14" /> },
    { num: 15, title: 'Capítulo 02 // Cómo trabajan juntos', comp: <Page11Chapter02Opener key="p15" /> },
    { num: 16, title: 'Capítulo 02 // Jerarquía de Latencias vs Ancho de Banda', comp: <Page12Chapter02Latencias key="p16" /> },
    { num: 17, title: 'Expediente Mito-03 // Resizable BAR / SAM', comp: <Page13Chapter02Mito03 key="p17" /> },
    { num: 18, title: 'Capítulo 03 // Cuando los FPS mienten', comp: <Page14Chapter03Opener key="p18" /> },
    { num: 19, title: 'Capítulo 03 // La Cola de Renderizado al 99%', comp: <Page15Chapter03Frametime key="p19" /> },
    { num: 20, title: 'Expediente Mito-04 // V-Sync & FPS Ilimitados', comp: <Page16Chapter03Mito04 key="p20" /> },
    { num: 21, title: 'Capítulo 04 // Encontrá el límite', comp: <Page17Chapter04Opener key="p21" /> },
    { num: 22, title: 'Capítulo 04 // Los Tres Muros del Silicio', comp: <Page18Chapter04MurosTermicos key="p22" /> },
    { num: 23, title: 'Expediente Mito-05 // Ventiladores al 100%', comp: <Page19Chapter04Mito05 key="p23" /> },
    { num: 24, title: 'Capítulo 05 // Windows también es hardware', comp: <Page20Chapter05Opener key="p24" /> },
    { num: 25, title: 'Capítulo 05 // Ring 0 vs Ring 3 & DPC Latency', comp: <Page21Chapter05Kernel key="p25" /> },
    { num: 26, title: 'Expediente Mito-06 // Scripts Debloater', comp: <Page22Chapter05Mito06 key="p26" /> },
    { num: 27, title: 'Dossier 01 // El Checkpoint Basal', comp: <DossierP01Checkpoint key="p27" /> },
    { num: 28, title: 'Dossier 02 // Las Puertas del Arranque', comp: <DossierP02PuertasArranque key="p28" /> },
    { num: 29, title: 'Dossier 03 // Apps de Inicio', comp: <DossierP03AppsInicio key="p29" /> },
    { num: 30, title: 'Dossier 04 // Operación 100 Programas', comp: <DossierP04Operacion100Programas key="p30" /> },
    { num: 31, title: 'Dossier 05 // Segundo Plano y Bandeja', comp: <DossierP05SegundoPlano key="p31" /> },
    { num: 32, title: 'Dossier 06 // Servicios: Criterio Real', comp: <DossierP06ServiciosWindows key="p32" /> },
    { num: 33, title: 'Dossier 07 // Ensayo A/B SysMain', comp: <DossierP07SysMainExperimento key="p33" /> },
    { num: 34, title: 'Dossier 08 // Tareas Programadas', comp: <DossierP08TareasProgramadas key="p34" /> },
    { num: 35, title: 'Dossier 09 // Higiene de Temporales', comp: <DossierP09TemporalesLimpieza key="p35" /> },
    { num: 36, title: 'Dossier 10 // Limpieza Profunda: WinSxS', comp: <DossierP10LimpiezaProfunda key="p36" /> },
    { num: 37, title: 'Dossier 11 // Micro-Tweaks Validados', comp: <DossierP11MicroTweaks key="p37" /> },
    { num: 38, title: 'Dossier 12 // Checkpoint Final B', comp: <DossierP12FinalCheckpoint key="p38" /> },
    { num: 39, title: 'Capítulo 06 // El Método Deductivo', comp: <Page35Chapter06Opener key="p39" /> },
    { num: 40, title: 'Capítulo 06 // Árbol Forense de Aislamiento', comp: <Page36Chapter06ArbolForense key="p40" /> },
    { num: 41, title: 'Expediente Mito-07 // Pasar DDU de Rutina', comp: <Page37Chapter06Mito07 key="p41" /> },
    { num: 42, title: 'Capítulo 07 // El Método Científico en tu PC', comp: <Page38Chapter07Opener key="p42" /> },
    { num: 43, title: 'Capítulo 07 // Los Tres Mandamientos del Ensayo A/B', comp: <Page39Chapter07MatrizAB key="p43" /> },
    { num: 44, title: 'Expediente Mito-08 // Plan Máximo Rendimiento', comp: <Page40Chapter07Mito08 key="p44" /> },
    { num: 45, title: 'Fuentes & Documentación Técnica Oficial', comp: <Page45FuentesTecnicas key="p45" /> },
    { num: 46, title: 'Contratapa // Manifiesto Final', comp: <Page46BackCover key="p46" /> },
  ];

  /**
   * Primary action to generate & download native A4 PDF
   */
  const handleDownloadPdf = () => {
    setIsPreparingPrint(true);
    
    // Switch to continuous mode so all 41 pages are synchronously mounted in DOM
    setViewMode('continuous');
    
    // Set document title so the browser automatically suggests a clean filename
    const originalTitle = document.title;
    document.title = 'EVO_LABS_MAGAZINE_TOMO_01_CONOCE_TU_PC_A4';

    // Allow DOM to settle, then open native print dialog
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error('Error al invocar impresión:', err);
      } finally {
        setIsPreparingPrint(false);
        setTimeout(() => {
          document.title = originalTitle;
        }, 1500);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col selection:bg-yellow-400 selection:text-black magazine-view-wrapper">
      
      {/* Top Editorial Magazine Toolbar (Screen only, hidden in print) */}
      <header className="no-print sticky top-0 z-50 bg-[#090b10]/95 backdrop-blur-md border-b border-zinc-800/90 px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs font-mono-tech shadow-xl magazine-header-bar">
        
        {/* Left: Magazine Badge & Volume Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 inline-block shadow-[0_0_8px_rgba(234,179,8,0.7)]" />
            <h1 className="font-display font-black text-sm sm:text-base tracking-wider uppercase text-white">
              EVO LABS <span className="text-yellow-400 font-mono-tech font-bold text-xs">MAGAZINE</span>
            </h1>
          </div>
          <span className="hidden md:inline text-zinc-600">|</span>
          <span className="hidden md:inline text-zinc-400 text-[11px] uppercase tracking-wider">
            TOMO 01: CONOCÉ TU PC (46 PÁGINAS A4)
          </span>
        </div>

        {/* Center: Page Controls & Jump Selector */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick Page Jump Dropdown */}
          <select
            value={currentPage}
            onChange={(e) => {
              const target = Number(e.target.value);
              setCurrentPage(target);
              if (viewMode === 'continuous') {
                const el = document.getElementById(`magazine-page-${String(target).padStart(2, '0')}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-[#12151d] text-zinc-200 border border-zinc-700/80 rounded px-2 py-1 text-[11px] font-mono-tech cursor-pointer hover:border-yellow-400 focus:outline-none focus:border-yellow-400 max-w-[180px] sm:max-w-xs truncate"
          >
            {pageComponents.map((p) => (
              <option key={p.num} value={p.num}>
                Pág. {String(p.num).padStart(2, '0')}: {p.title}
              </option>
            ))}
          </select>

          {/* Prev / Next Buttons */}
          <div className="flex items-center border border-zinc-800 rounded bg-[#12151d]">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => {
                const prevP = Math.max(1, currentPage - 1);
                setCurrentPage(prevP);
                if (viewMode === 'continuous') {
                  const el = document.getElementById(`magazine-page-${String(prevP).padStart(2, '0')}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-[11px] text-zinc-300 font-bold">
              {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => {
                const nextP = Math.min(totalPages, currentPage + 1);
                setCurrentPage(nextP);
                if (viewMode === 'continuous') {
                  const el = document.getElementById(`magazine-page-${String(nextP).padStart(2, '0')}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer"
              title="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Layout Switcher, PDF Export & Interactive Return */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* View Mode Toggle Buttons */}
          <div className="hidden lg:flex items-center bg-[#12151d] border border-zinc-800 rounded p-0.5 text-[10px]">
            <button
              type="button"
              onClick={() => setViewMode('continuous')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'continuous'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Lectura continua (Todas las páginas A4)"
            >
              Continuo
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Página individual A4"
            >
              Página
            </button>
            <button
              type="button"
              onClick={() => setViewMode('spread')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'spread'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Doble página editorial"
            >
              Doble
            </button>
          </div>

          {/* Quick Info / Config Recommended Toggle Button */}
          <button
            type="button"
            onClick={() => setShowConfigHelper(!showConfigHelper)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#12151d] hover:bg-[#1a2030] text-zinc-300 hover:text-yellow-400 border border-zinc-700/80 rounded font-mono-tech text-[11px] transition-colors cursor-pointer"
            title="Ver configuración recomendada para exportar en PDF"
          >
            <HelpCircle className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden xl:inline">Configuración</span>
            <span>A4</span>
          </button>

          {/* PRIMARY ACTION: DESCARGAR PDF (Real & Functional) */}
          <button
            id="btn-descargar-pdf"
            type="button"
            onClick={handleDownloadPdf}
            disabled={isPreparingPrint}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-mono-tech font-black text-xs uppercase tracking-wider rounded shadow-[0_0_16px_rgba(234,179,8,0.45)] hover:shadow-[0_0_24px_rgba(234,179,8,0.7)] transition-all cursor-pointer border border-yellow-300 disabled:opacity-50"
            title="Descargar EVO LABS MAGAZINE en PDF (46 páginas A4)"
          >
            <Download className="w-4 h-4 text-black stroke-[2.5]" />
            <span>{isPreparingPrint ? 'PREPARANDO A4...' : 'DESCARGAR PDF'}</span>
          </button>

          {/* Toggle Interactive Lab Mode */}
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141824] hover:bg-[#1a2030] text-zinc-300 hover:text-white border border-zinc-700/80 font-mono-tech text-[11px] uppercase rounded transition-colors cursor-pointer"
              title="Cambiar a la plataforma de laboratorio interactivo"
            >
              <Compass className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden lg:inline">Lab Interactivo</span>
            </button>
          )}
        </div>
      </header>

      {/* Persistent Technical Config Banner: Exactly matches recommended print settings */}
      <div className="no-print bg-[#090b10] border-b border-zinc-800/80 px-3 sm:px-6 py-2 text-[10px] sm:text-[11px] font-mono-tech flex flex-wrap items-center justify-between gap-2 shadow-inner magazine-quick-help-bar">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block shadow-[0_0_8px_rgba(234,179,8,0.9)] animate-pulse" />
          <span className="text-zinc-200 font-bold uppercase tracking-wider">
            CONFIGURACIÓN RECOMENDADA PARA EXPORTAR:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="px-2 py-0.5 rounded bg-[#12151d] border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500 mr-1">Destino:</span>
            <span className="text-yellow-400 font-bold">Guardar como PDF</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-[#12151d] border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500 mr-1">Tamaño:</span>
            <span className="text-yellow-400 font-bold">A4</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-[#12151d] border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500 mr-1">Orientación:</span>
            <span className="text-yellow-400 font-bold">Vertical</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-[#12151d] border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500 mr-1">Márgenes:</span>
            <span className="text-yellow-400 font-bold">Ninguno</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-[#12151d] border border-zinc-800 text-zinc-300">
            <span className="text-zinc-500 mr-1">Escala:</span>
            <span className="text-yellow-400 font-bold">100%</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/40 text-yellow-300">
            <span className="text-yellow-500 mr-1">Gráficos de fondo:</span>
            <span className="text-yellow-300 font-black">ACTIVADOS</span>
          </div>
        </div>
      </div>

      {/* Modal / Detailed Guidance for PDF Export */}
      {showConfigHelper && (
        <div className="no-print fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0e15] border-2 border-yellow-400/60 rounded-xl max-w-lg w-full p-6 shadow-2xl relative font-mono-tech">
            <button
              type="button"
              onClick={() => setShowConfigHelper(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-3">
              <div className="w-8 h-8 rounded bg-yellow-400/15 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wider uppercase">
                  GUÍA DE EXPORTACIÓN A PDF // A4
                </h3>
                <p className="text-zinc-400 text-[10px]">
                  EVO LABS MAGAZINE // TOMO 01 (46 PÁGINAS EDITORIALES)
                </p>
              </div>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed mb-4 font-sans-editorial">
              Para generar un PDF editorial de alta fidelidad, listo para guardar, compartir o imprimir físicamente, configurá los siguientes parámetros en el cuadro de impresión de tu navegador:
            </p>

            <div className="space-y-2 bg-[#06070a] border border-zinc-800 p-3 rounded-lg text-xs mb-5">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-400">Destino:</span>
                <span className="text-yellow-400 font-bold">Guardar como PDF</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-400">Tamaño de papel:</span>
                <span className="text-yellow-400 font-bold">A4 (210 × 297 mm)</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-400">Orientación:</span>
                <span className="text-yellow-400 font-bold">Vertical (Portrait)</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-400">Márgenes:</span>
                <span className="text-yellow-400 font-bold">Ninguno</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-zinc-400">Escala:</span>
                <span className="text-yellow-400 font-bold">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Gráficos de fondo:</span>
                <span className="text-emerald-400 font-bold">ACTIVADOS (Casilla marcada)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfigHelper(false);
                  handleDownloadPdf();
                }}
                className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider rounded text-center transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                ABRIR DIÁLOGO Y DESCARGAR PDF
              </button>
              <button
                type="button"
                onClick={() => setShowConfigHelper(false)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Magazine Canvas / Reading Desk Area */}
      <main className="magazine-scroll-container flex-1 py-8 sm:py-12 px-2 sm:px-6 flex flex-col items-center justify-start overflow-y-auto">
        
        {/* CONTINUOUS EDITORIAL STACK (Contains all 41 pages in order: TAPA -> P41 CONTRATAPA)
            CRITICAL: When printing, this element is ALWAYS visible (hidden print:block if single/spread) */}
        <div
          className={`w-full max-w-[820px] flex flex-col gap-8 sm:gap-14 print:gap-0 print:m-0 print:p-0 ${
            viewMode === 'continuous' ? 'flex' : 'hidden print:block'
          }`}
        >
          {pageComponents.map((page) => (
            <div
              key={page.num}
              className="page-print-wrapper w-full flex justify-center print:block print:m-0 print:p-0"
            >
              {page.comp}
            </div>
          ))}
        </div>

        {/* VIEW MODE 2: SINGLE PAGE FLIP VIEW (Screen only, hidden in print) */}
        {viewMode === 'single' && (
          <div className="w-full max-w-[820px] flex flex-col items-center print:hidden">
            {pageComponents[currentPage - 1]?.comp}

            {/* Bottom Floating Navigation for single view */}
            <div className="no-print mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono-tech bg-[#12151d] border border-zinc-800 px-5 py-2.5 rounded-full shadow-2xl">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 text-zinc-300 hover:text-yellow-400 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <span className="text-zinc-600">|</span>
              <span className="text-white font-bold">
                Página {currentPage} de {totalPages}
              </span>
              <span className="text-zinc-600">|</span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 text-zinc-300 hover:text-yellow-400 disabled:opacity-30 cursor-pointer"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-zinc-600">|</span>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-[11px] rounded-full transition-colors cursor-pointer"
                title="Descargar PDF Completo (46 páginas)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DESCARGAR PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW MODE 3: SPREAD VIEW (Double page side-by-side, screen only, hidden in print) */}
        {viewMode === 'spread' && (
          <div className="w-full max-w-[1660px] flex flex-col items-center print:hidden">
            {currentPage === 1 ? (
              // Cover alone
              <div className="w-full max-w-[820px] flex justify-center">
                {pageComponents[0].comp}
              </div>
            ) : currentPage === 46 ? (
              // Back cover alone
              <div className="w-full max-w-[820px] flex justify-center">
                {pageComponents[45].comp}
              </div>
            ) : (
              // Two pages spread
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full justify-items-center">
                <div className="w-full max-w-[820px] flex justify-center">
                  {pageComponents[currentPage % 2 === 0 ? currentPage - 1 : currentPage - 2]?.comp}
                </div>
                <div className="w-full max-w-[820px] flex justify-center">
                  {pageComponents[currentPage % 2 === 0 ? currentPage : currentPage - 1]?.comp}
                </div>
              </div>
            )}

            {/* Bottom Floating Navigation for spread view */}
            <div className="no-print mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono-tech bg-[#12151d] border border-zinc-800 px-5 py-2.5 rounded-full shadow-2xl">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 2))}
                className="inline-flex items-center gap-1 text-zinc-300 hover:text-yellow-400 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Pliego Anterior
              </button>
              <span className="text-zinc-600">|</span>
              <span className="text-white font-bold">
                Pliego Editorial (Pág {currentPage} / {totalPages})
              </span>
              <span className="text-zinc-600">|</span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 2))}
                className="inline-flex items-center gap-1 text-zinc-300 hover:text-yellow-400 disabled:opacity-30 cursor-pointer"
              >
                Siguiente Pliego <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-zinc-600">|</span>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-[11px] rounded-full transition-colors cursor-pointer"
                title="Descargar PDF Completo (46 páginas)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DESCARGAR PDF</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
