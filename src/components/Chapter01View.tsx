import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  Layers,
  Monitor,
  HardDrive,
  CircuitBoard,
  Sparkles,
  Lock,
  Copy,
  Check,
  Flame,
  Wrench,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Download,
  Share2,
  Upload,
  FileCheck,
  ShieldCheck,
  Search,
  Eye,
  FileText,
  FileCode,
  Radio
} from 'lucide-react';
import {
  UserPcSpec,
  HypothesisGuess,
  EvidenceState,
  EvidenceSource,
  SpecFieldEvidence,
  UserPcEvidenceMap,
  PassportJsonSchema
} from '../types';
import { EvoChapterNavigationFooter } from './tomo01/EvoChapterNavigationFooter';
import { EvoChapterCheckSection } from './tomo01/EvoChapterCheckSection';
import { TutorChapterBanner } from './tutor/TutorChapterBanner';
import { TutorConceptTrigger } from './tutor/TutorConceptTrigger';

interface Chapter01ViewProps {
  onBackToIndex: () => void;
  onChapterCompleted: () => void;
  isChapter02Unlocked: boolean;
  onStartChapter02?: () => void;
}

type SectionKey =
  | 'cover'
  | 'cpu'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'motherboard'
  | 'windows'
  | 'peripherals'
  | 'tu-pc';

const SECTIONS_MAP: { id: SectionKey; label: string; number: string }[] = [
  { id: 'cpu', label: 'CPU', number: '01' },
  { id: 'ram', label: 'RAM', number: '02' },
  { id: 'gpu', label: 'GPU', number: '03' },
  { id: 'storage', label: 'ALMACENAMIENTO', number: '04' },
  { id: 'motherboard', label: 'PLATAFORMA', number: '05' },
  { id: 'windows', label: 'WINDOWS', number: '06' },
  { id: 'peripherals', label: 'PERIFÉRICOS', number: '07' },
  { id: 'tu-pc', label: 'TU PC', number: '08' },
];

export type ComparisonResult =
  | 'COINCIDE'
  | 'COINCIDE PARCIALMENTE'
  | 'DIFIERE'
  | 'NO HABÍA HIPÓTESIS'
  | 'EVIDENCIA INSUFICIENTE';

interface PendingComparisonItem {
  key: 'cpu' | 'ram' | 'gpu' | 'storage' | 'motherboard' | 'os';
  label: string;
  hypothesis: string;
  observed: string;
  detected: string;
  source: EvidenceSource;
  comparison: ComparisonResult;
  confirmed: boolean;
  extraInfo?: string;
}

export const Chapter01View: React.FC<Chapter01ViewProps> = ({
  onBackToIndex,
  onChapterCompleted,
  isChapter02Unlocked,
  onStartChapter02,
}) => {
  // Mark chapter 01 as started
  useEffect(() => {
    try {
      localStorage.setItem('evo_c01_started', 'true');
    } catch {
      // ignore
    }
  }, []);

  // Load initial passport from localStorage if available
  const [activeSection, setActiveSection] = useState<SectionKey>('cover');
  const [completedSections, setCompletedSections] = useState<Set<SectionKey>>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const defaultSpecs: UserPcSpec = {
    cpu: '',
    ram: '',
    gpu: '',
    storage: '',
    motherboard: '',
    os: '',
    monitor: '',
    peripherals: '',
  };

  const [specs, setSpecs] = useState<UserPcSpec>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_specs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            cpu: typeof parsed.cpu === 'string' ? parsed.cpu : '',
            ram: typeof parsed.ram === 'string' ? parsed.ram : '',
            gpu: typeof parsed.gpu === 'string' ? parsed.gpu : '',
            storage: typeof parsed.storage === 'string' ? parsed.storage : '',
            motherboard: typeof parsed.motherboard === 'string' ? parsed.motherboard : '',
            os: typeof parsed.os === 'string' ? parsed.os : '',
            monitor: typeof parsed.monitor === 'string' ? parsed.monitor : '',
            peripherals: typeof parsed.peripherals === 'string' ? parsed.peripherals : '',
          };
        }
      }
    } catch {
      // fallback
    }
    return defaultSpecs;
  });

  const [hypothesis, setHypothesis] = useState<HypothesisGuess>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_hypothesis');
      return saved ? JSON.parse(saved) : { cpu: '', ram: '', gpu: '' };
    } catch {
      return { cpu: '', ram: '', gpu: '' };
    }
  });

  // Evidence Map per field
  const [evidenceMap, setEvidenceMap] = useState<UserPcEvidenceMap>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_evidence');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      cpu: { value: '', source: 'ADMINISTRADOR DE TAREAS', state: 'DECLARADO' },
      ram: { value: '', source: 'ADMINISTRADOR DE TAREAS', state: 'DECLARADO' },
      gpu: { value: '', source: 'ADMINISTRADOR DE TAREAS', state: 'DECLARADO' },
      storage: { value: '', source: 'ADMINISTRADOR DE TAREAS', state: 'DECLARADO' },
      motherboard: { value: '', source: 'MSINFO32', state: 'DECLARADO' },
      os: { value: '', source: 'WINVER', state: 'DECLARADO' },
      monitor: { value: '', source: 'MANUAL', state: 'OBSERVADO' },
      peripherals: { value: '', source: 'MANUAL', state: 'OBSERVADO' },
    };
  });

  // Comparisons queue after importing JSON/TXT
  const [comparisonsQueue, setComparisonsQueue] = useState<PendingComparisonItem[]>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_comparisons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Layer toggle states (Capa 02: Técnica / Profundizar) per section
  const [expandedTech, setExpandedTech] = useState<Record<string, boolean>>({});
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Compare hypothesis/observed with detected
  const calculateComparison = (hyp: string, det: string): ComparisonResult => {
    const h = (hyp || '').trim().toLowerCase();
    const d = (det || '').trim().toLowerCase();

    if (!d || d === 'no disponible' || d === 'no identificado') return 'EVIDENCIA INSUFICIENTE';
    if (!h) return 'NO HABÍA HIPÓTESIS';
    if (h === d) return 'COINCIDE';

    // Normalize strings for partial check (e.g. "i3 12th" in "intel core i3-1220p")
    const hClean = h.replace(/[^a-z0-9]/g, '');
    const dClean = d.replace(/[^a-z0-9]/g, '');

    if (dClean.includes(hClean) || hClean.includes(dClean)) return 'COINCIDE PARCIALMENTE';

    // Check significant word intersections
    const hWords = h.split(/[\s-]+/).filter((w) => w.length >= 2);
    const dWords = d.split(/[\s-]+/).filter((w) => w.length >= 2);
    const matchCount = hWords.filter((hw) => dWords.some((dw) => dw.includes(hw) || hw.includes(dw))).length;

    if (matchCount >= 2 || (matchCount === 1 && hWords.length === 1)) {
      return 'COINCIDE PARCIALMENTE';
    }

    return 'DIFIERE';
  };

  // Helper to handle manual field update with declared status
  const handleFieldChange = (
    field: keyof UserPcSpec,
    val: string,
    defaultSource: EvidenceSource = 'ADMINISTRADOR DE TAREAS'
  ) => {
    setSpecs((prev) => ({ ...prev, [field]: val }));
    setEvidenceMap((prev) => ({
      ...prev,
      [field]: {
        value: val,
        source: defaultSource,
        state: 'DECLARADO',
        detectedRaw: prev[field]?.detectedRaw,
        details: prev[field]?.details,
      },
    }));
  };

  // Handle confirming a detected field from comparison
  const handleConfirmItem = (itemKey: 'cpu' | 'ram' | 'gpu' | 'storage' | 'motherboard' | 'os') => {
    const queueItem = comparisonsQueue.find((i) => i.key === itemKey);
    if (!queueItem) return;

    setSpecs((prev) => ({
      ...prev,
      [itemKey]: queueItem.detected,
    }));

    setEvidenceMap((prev) => ({
      ...prev,
      [itemKey]: {
        value: queueItem.detected,
        source: 'WINDOWS / CIM',
        state: 'CONFIRMADO',
        detectedRaw: queueItem.detected,
        details: {
          extra: queueItem.extraInfo,
        },
      },
    }));

    setComparisonsQueue((prev) =>
      prev.map((i) => (i.key === itemKey ? { ...i, confirmed: true } : i))
    );
  };

  // Handle confirming all detected items
  const handleConfirmAll = () => {
    const newSpecs = { ...specs };
    const newEv = { ...evidenceMap };

    comparisonsQueue.forEach((item) => {
      newSpecs[item.key] = item.detected;
      newEv[item.key] = {
        value: item.detected,
        source: 'WINDOWS / CIM',
        state: 'CONFIRMADO',
        detectedRaw: item.detected,
        details: { extra: item.extraInfo },
      };
    });

    setSpecs(newSpecs);
    setEvidenceMap(newEv);
    setComparisonsQueue((prev) => prev.map((i) => ({ ...i, confirmed: true })));
    setImportNotice('Todos los datos detectados han sido contrastados y confirmados.');
    setTimeout(() => setImportNotice(null), 5000);
  };

  // Import handler supporting both JSON (Preferred) and TXT (Compatibility)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportNotice(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const isJson = file.name.toLowerCase().endsWith('.json') || content.trim().startsWith('{');

      if (isJson) {
        try {
          const parsed = JSON.parse(content) as PassportJsonSchema;
          if (!parsed.schemaVersion) {
            setImportError('El archivo JSON no contiene un esquema de pasaporte EVO LABS válido.');
            return;
          }

          // Build queue of detected values for comparison
          const queue: PendingComparisonItem[] = [];

          // 1. CPU
          if (parsed.cpu?.name) {
            const cpuDetected = parsed.cpu.name;
            const extra = parsed.cpu.cores
              ? `${parsed.cpu.cores} Núcleos / ${parsed.cpu.logicalProcessors || parsed.cpu.cores} Hilos`
              : undefined;
            queue.push({
              key: 'cpu',
              label: 'PROCESADOR (CPU)',
              hypothesis: hypothesis.cpu || specs.cpu,
              observed: specs.cpu,
              detected: cpuDetected,
              source: 'WINDOWS / CIM',
              comparison: calculateComparison(hypothesis.cpu || specs.cpu, cpuDetected),
              confirmed: false,
              extraInfo: extra,
            });
          }

          // 2. RAM
          if (parsed.memory?.totalGB) {
            const ramTotal = `${parsed.memory.totalGB} GB`;
            const extra = [
              parsed.memory.modulesCount ? `${parsed.memory.modulesCount} Módulos` : null,
              parsed.memory.configuredSpeedMHz ? `${parsed.memory.configuredSpeedMHz} MT/s` : null,
              parsed.memory.manufacturer ? `Fab: ${parsed.memory.manufacturer}` : null,
              parsed.memory.channelMode ? `Canal: ${parsed.memory.channelMode}` : 'Canal: NO DETERMINADO',
            ]
              .filter(Boolean)
              .join(' | ');

            queue.push({
              key: 'ram',
              label: 'MEMORIA RAM',
              hypothesis: hypothesis.ram || specs.ram,
              observed: specs.ram,
              detected: ramTotal,
              source: 'WINDOWS / CIM',
              comparison: calculateComparison(hypothesis.ram || specs.ram, ramTotal),
              confirmed: false,
              extraInfo: extra,
            });
          }

          // 3. GPU
          if (parsed.gpu && parsed.gpu.length > 0) {
            const gpuNames = parsed.gpu.map((g, idx) => `GPU ${idx}: ${g.name || 'Desconocida'}`).join(' / ');
            const primaryGpu = parsed.gpu[0]?.name || 'NO DISPONIBLE';
            const extra = parsed.gpu.map((g, idx) => `GPU ${idx}: ${g.name} (Driver: ${g.driverVersion || 'N/D'})`).join(' • ');

            queue.push({
              key: 'gpu',
              label: 'GRÁFICOS (GPU)',
              hypothesis: hypothesis.gpu || specs.gpu,
              observed: specs.gpu,
              detected: parsed.gpu.length > 1 ? gpuNames : primaryGpu,
              source: 'WINDOWS / CIM',
              comparison: calculateComparison(hypothesis.gpu || specs.gpu, primaryGpu),
              confirmed: false,
              extraInfo: extra,
            });
          }

          // 4. STORAGE
          if (parsed.storage && parsed.storage.length > 0) {
            const diskStrings = parsed.storage
              .map((d) => `${d.model || 'Disco'} (${d.approxGB || 0} GB ${d.mediaType !== 'NO CONFIRMADO' ? d.mediaType : ''})`)
              .join(' + ');

            const extra = parsed.storage
              .map((d) => `${d.model}: ${d.approxGB} GB [Interfaz: ${d.interface || 'NO CONFIRMADO'}, Tipo: ${d.mediaType || 'NO CONFIRMADO'}]`)
              .join(' • ');

            queue.push({
              key: 'storage',
              label: 'ALMACENAMIENTO',
              hypothesis: specs.storage,
              observed: specs.storage,
              detected: diskStrings,
              source: 'WINDOWS / CIM',
              comparison: calculateComparison(specs.storage, diskStrings),
              confirmed: false,
              extraInfo: extra,
            });
          }

          // 5. BASEBOARD
          if (parsed.baseboard) {
            const bb = `${parsed.baseboard.manufacturer || ''} ${parsed.baseboard.product || ''}`.trim() || 'NO DISPONIBLE';
            queue.push({
              key: 'motherboard',
              label: 'PLACA BASE / PLATAFORMA',
              hypothesis: specs.motherboard,
              observed: specs.motherboard,
              detected: bb,
              source: 'WINDOWS / CIM',
              comparison: calculateComparison(specs.motherboard, bb),
              confirmed: false,
              extraInfo: 'Detectado mediante Win32_BaseBoard',
            });
          }

          // 6. WINDOWS
          if (parsed.windows?.caption) {
            const win = `${parsed.windows.caption} (Build ${parsed.windows.buildNumber || parsed.windows.version || ''})`.trim();
            queue.push({
              key: 'os',
              label: 'SISTEMA OPERATIVO',
              hypothesis: specs.os,
              observed: specs.os,
              detected: win,
              source: 'WINDOWS / CIM',
              comparison: calculateComparison(specs.os, win),
              confirmed: false,
              extraInfo: `Versión reportada: ${parsed.windows.version || ''}`,
            });
          }

          setComparisonsQueue(queue);
          setImportNotice(
            `Pasaporte JSON (v${parsed.schemaVersion}) importado. Windows reportó ${queue.length} componentes para contrastar.`
          );
        } catch (err) {
          console.error(err);
          setImportError('No se pudo interpretar el archivo JSON. Verificá que sea un archivo generado por EVO LABS.');
        }
      } else {
        // Fallback TXT parser
        const lines = content.split('\n');
        const queue: PendingComparisonItem[] = [];

        lines.forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('CPU:') || trimmed.startsWith('01. PROCESADOR (CPU):')) {
            const val = trimmed.replace(/^CPU:\s*/i, '').replace(/^01\.\s*PROCESADOR\s*\(CPU\):\s*/i, '').trim();
            if (val && val !== 'NO IDENTIFICADO' && val !== 'No registrada') {
              queue.push({
                key: 'cpu',
                label: 'PROCESADOR (CPU)',
                hypothesis: hypothesis.cpu || specs.cpu,
                observed: specs.cpu,
                detected: val,
                source: 'WINDOWS / CIM',
                comparison: calculateComparison(hypothesis.cpu || specs.cpu, val),
                confirmed: false,
              });
            }
          } else if (trimmed.startsWith('RAM:') || trimmed.startsWith('02. MEMORIA (RAM):')) {
            const val = trimmed.replace(/^RAM:\s*/i, '').replace(/^02\.\s*MEMORIA\s*\(RAM\):\s*/i, '').trim();
            if (val && val !== 'NO IDENTIFICADO' && val !== 'No registrada') {
              queue.push({
                key: 'ram',
                label: 'MEMORIA RAM',
                hypothesis: hypothesis.ram || specs.ram,
                observed: specs.ram,
                detected: val,
                source: 'WINDOWS / CIM',
                comparison: calculateComparison(hypothesis.ram || specs.ram, val),
                confirmed: false,
              });
            }
          } else if (trimmed.startsWith('GPU:') || trimmed.startsWith('03. GRÁFICOS (GPU):')) {
            const val = trimmed.replace(/^GPU:\s*/i, '').replace(/^03\.\s*GRÁFICOS\s*\(GPU\):\s*/i, '').trim();
            if (val && val !== 'NO IDENTIFICADO' && val !== 'No registrada') {
              queue.push({
                key: 'gpu',
                label: 'GRÁFICOS (GPU)',
                hypothesis: hypothesis.gpu || specs.gpu,
                observed: specs.gpu,
                detected: val,
                source: 'WINDOWS / CIM',
                comparison: calculateComparison(hypothesis.gpu || specs.gpu, val),
                confirmed: false,
              });
            }
          } else if (trimmed.startsWith('DISCO:') || trimmed.startsWith('04. ALMACENAMIENTO:')) {
            const val = trimmed.replace(/^DISCO:\s*/i, '').replace(/^04\.\s*ALMACENAMIENTO:\s*/i, '').trim();
            if (val && val !== 'NO IDENTIFICADO' && val !== 'No registrada') {
              queue.push({
                key: 'storage',
                label: 'ALMACENAMIENTO',
                hypothesis: specs.storage,
                observed: specs.storage,
                detected: val,
                source: 'WINDOWS / CIM',
                comparison: calculateComparison(specs.storage, val),
                confirmed: false,
              });
            }
          }
        });

        if (queue.length > 0) {
          setComparisonsQueue(queue);
          setImportNotice('Pasaporte TXT importado con compatibilidad. Contrastá los datos reportados.');
        } else {
          setImportError('No se encontraron líneas de evidencia reconocibles en el archivo de texto.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('evo_c01_completed', JSON.stringify(Array.from(completedSections)));
      localStorage.setItem('evo_c01_specs', JSON.stringify(specs));
      localStorage.setItem('evo_c01_hypothesis', JSON.stringify(hypothesis));
      localStorage.setItem('evo_c01_evidence', JSON.stringify(evidenceMap));
      localStorage.setItem('evo_c01_comparisons', JSON.stringify(comparisonsQueue));
    } catch (e) {
      console.error(e);
    }
  }, [completedSections, specs, hypothesis, evidenceMap, comparisonsQueue]);

  const toggleTech = (sec: string) => {
    setExpandedTech((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const markSectionCompleted = (sec: SectionKey) => {
    setCompletedSections((prev) => new Set([...prev, sec]));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const handleDownloadPassportTxt = () => {
    const textContent = `=====================================================
EVO LABS // PASAPORTE DE MI PC
INVESTIGACIÓN TÉCNICA // TOMO 01 — CAPÍTULO 01
Fecha de Emisión: ${new Date().toLocaleDateString()}
=====================================================

[PASAPORTE EVO // EVIDENCIA DEL SILICIO]
-----------------------------------------------------
01. PROCESADOR (CPU):      ${specs.cpu || 'No registrada'}
    [FUENTE: ${evidenceMap.cpu.source} | ESTADO: ${evidenceMap.cpu.state}]

02. MEMORIA (RAM):         ${specs.ram || 'No registrada'}
    [FUENTE: ${evidenceMap.ram.source} | ESTADO: ${evidenceMap.ram.state}]

03. GRÁFICOS (GPU):        ${specs.gpu || 'No registrada'}
    [FUENTE: ${evidenceMap.gpu.source} | ESTADO: ${evidenceMap.gpu.state}]

04. ALMACENAMIENTO:        ${specs.storage || 'No registrada'}
    [FUENTE: ${evidenceMap.storage.source} | ESTADO: ${evidenceMap.storage.state}]

05. PLATAFORMA / PLACA:    ${specs.motherboard || 'No registrada'}
    [FUENTE: ${evidenceMap.motherboard.source} | ESTADO: ${evidenceMap.motherboard.state}]

06. SISTEMA OPERATIVO:     ${specs.os || 'No registrada'}
    [FUENTE: ${evidenceMap.os.source} | ESTADO: ${evidenceMap.os.state}]

07. MONITOR / DISPLAY:     ${specs.monitor || 'No registrada'}
    [FUENTE: ${evidenceMap.monitor.source} | ESTADO: ${evidenceMap.monitor.state}]

08. PERIFÉRICOS & RED:     ${specs.peripherals || 'No registrada'}
    [FUENTE: ${evidenceMap.peripherals.source} | ESTADO: ${evidenceMap.peripherals.state}]
-----------------------------------------------------

[EVALUACIÓN DE HIPÓTESIS // TU IDEA INICIAL VS EVIDENCIA]
- CPU: Tu idea "${hypothesis.cpu || 'Sin estimar'}" → ${calculateComparison(hypothesis.cpu, specs.cpu)}
- RAM: Tu idea "${hypothesis.ram || 'Sin estimar'}" → ${calculateComparison(hypothesis.ram, specs.ram)}
- GPU: Tu idea "${hypothesis.gpu || 'Sin estimar'}" → ${calculateComparison(hypothesis.gpu, specs.gpu)}

=====================================================
Certificado EVO LABS: Lo que creés no siempre es lo que tu PC demuestra tener.
Próximo Tomo 01 // Cap 02: "¿Quién espera a quién?"
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'EVO-LABS-MI-PC.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPassportJson = () => {
    const jsonOutput: PassportJsonSchema = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      source: 'EVO_LABS_INTERACTIVE_PASSPORT',
      cpu: {
        name: specs.cpu || undefined,
      },
      memory: {
        totalGB: parseFloat(specs.ram) || undefined,
        channelMode: 'NO DETERMINADO',
      },
      gpu: [
        {
          name: specs.gpu || undefined,
        },
      ],
      storage: [
        {
          model: specs.storage || undefined,
          mediaType: 'NO CONFIRMADO',
          interface: 'NO CONFIRMADO',
        },
      ],
      baseboard: {
        product: specs.motherboard || undefined,
      },
      windows: {
        caption: specs.os || undefined,
      },
    };

    const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'EVO-LABS-MI-PC.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const isAllRequiredDone =
    Boolean(specs?.cpu && specs.cpu.trim() !== '') &&
    Boolean(specs?.ram && specs.ram.trim() !== '') &&
    Boolean(specs?.gpu && specs.gpu.trim() !== '') &&
    Boolean(specs?.storage && specs.storage.trim() !== '');

  const getHypothesisComparison = (hyp: string, real: string): ComparisonResult => {
    return calculateComparison(hyp, real);
  };


  return (
    <div className="w-full min-h-screen py-6 sm:py-10 text-[#f4f4f6]">
      {/* Top Breadcrumbs & Back */}
      <nav className="flex items-center justify-between pb-5 mb-8 border-b border-zinc-800/60">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
          id="btn-volver-indice"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
          <span>← VOLVER A ÍNDICE DEL TOMO 01</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <span className="w-2 h-2 bg-yellow-400 inline-block" />
          <span className="tracking-widest uppercase text-white font-bold">
            TOMO 01 // CAPÍTULO 01
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-yellow-400 font-semibold tracking-wider">INVESTIGACIÓN ACTIVA</span>
        </div>
      </nav>

      {/* Tutor EVO Chapter Permanent Orientation Banner */}
      <TutorChapterBanner
        chapterNumber="01"
        chapterTitle="¿QUÉ PC TENÉS REALMENTE?"
        currentStage={activeSection === 'tu-pc' ? 'COMPROBAR' : activeSection === 'cover' ? 'ENTENDER' : 'PRACTICAR'}
        currentAction={
          activeSection === 'cover'
            ? 'Leé la tesis introductoria y seleccioná un componente para auditar.'
            : activeSection === 'tu-pc'
            ? 'Comprobá el pasaporte de hardware que recolectaste con la evidencia real.'
            : `Auditá la especificación de ${activeSection.toUpperCase()} usando los comandos periciales seguros.`
        }
        tutorExplanation="Cada componente tiene un comando de lectura directa de hardware. No necesitás memorizar nada: copiá el comando, observá el resultado y registralo."
        nextStep={
          activeSection === 'tu-pc'
            ? 'Validá la comprobación para desbloquear el Capítulo 02 (CPU y Silicio).'
            : 'Continuá completando los 8 componentes de tu pasaporte.'
        }
        whatToLookFor="El nombre exacto del fabricante, modelo y especificación que devuelve Windows."
      />

      {/* Persistent Visual Navigation Bar: 01 CPU ... 08 TU PC */}
      <div className="mb-10 p-3 sm:p-4 rounded-2xl bg-[#101115] border border-zinc-800/80 shadow-xl overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {SECTIONS_MAP.map((sec) => {
            const isCompleted = completedSections.has(sec.id);
            const isCurrent = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 border ${
                  isCurrent
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-md font-bold'
                    : isCompleted
                    ? 'bg-zinc-900/90 text-zinc-200 border-zinc-700/80 hover:border-yellow-400/50'
                    : 'bg-black/30 text-zinc-500 border-zinc-900 hover:text-zinc-400 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-mono-tech text-[10px] ${isCurrent ? 'text-black' : 'text-zinc-500'}`}>
                    {sec.number}
                  </span>
                  <span className="text-xs font-mono-tech uppercase tracking-tight truncate">
                    {sec.label}
                  </span>
                </div>

                {/* State indicator: ✓ completado / ● actual / ○ pendiente */}
                <span className="text-xs shrink-0 font-mono-tech">
                  {isCompleted ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-black' : 'text-yellow-400'}`} />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-black animate-pulse inline-block" />
                  ) : (
                    <span className="w-2 h-2 rounded-full border border-zinc-600 inline-block" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTAINER / VIEWPORT */}
      <main className="max-w-4xl mx-auto">
        {/* ======================================================== */}
        {/* PORTADA DEL CAPÍTULO 01 (SI activeSection === 'cover')  */}
        {/* ======================================================== */}
        {activeSection === 'cover' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Header */}
            <div className="space-y-4 pb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 tracking-widest uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>CAPÍTULO 01 // INVESTIGACIÓN DE SILICIO</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase leading-[0.94]">
                ¿QUÉ PC TENÉS REALMENTE?
              </h1>

              <p className="font-sans-editorial text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed italic">
                “Antes de mejorar una computadora, hay que saber exactamente qué tenemos delante.”
              </p>
            </div>

            {/* In this chapter you will do... */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800/90 space-y-5">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold block">
                EN ESTE CAPÍTULO VAS A:
              </span>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm font-sans-editorial text-zinc-200">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                  <span>Identificar tu hardware real sin mitos comerciales</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                  <span>Entender qué función cumple cada pieza</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                  <span>Descubrir cómo se relacionan los componentes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                  <span>Construir la ficha real (Pasaporte) de tu PC</span>
                </li>
              </ul>

              {/* EXPERIMENTO PREVIO: HIPÓTESIS */}
              <div className="pt-5 border-t border-zinc-800/80 space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-yellow-400" />
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-white font-bold">
                    EXPERIMENTO PREVIO // ¿QUÉ CREÉS QUE TIENE TU PC? (OPCIONAL)
                  </span>
                </div>
                <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
                  Anotá lo que pensás que tenés antes de inspeccionar Windows. Al final compararemos tu suposición con la evidencia física reportada.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-mono-tech uppercase text-zinc-400 block mb-1">
                      Creo que mi CPU es:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Core i5, Ryzen 5..."
                      value={hypothesis.cpu}
                      onChange={(e) => setHypothesis({ ...hypothesis, cpu: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech uppercase text-zinc-400 block mb-1">
                      Creo que mi RAM es:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 8 GB, 16 GB DDR4..."
                      value={hypothesis.ram}
                      onChange={(e) => setHypothesis({ ...hypothesis, ram: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech uppercase text-zinc-400 block mb-1">
                      Creo que mi GPU es:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Integrada, RTX 3060..."
                      value={hypothesis.gpu}
                      onChange={(e) => setHypothesis({ ...hypothesis, gpu: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-mono-tech text-zinc-500">
                  Duración orientativa: investigación continua sin prisas.
                </span>
                <button
                  type="button"
                  id="btn-iniciar-investigacion-cap01"
                  onClick={() => setActiveSection('cpu')}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-yellow-400/30 group"
                >
                  <span>COMENZAR INVESTIGACIÓN</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 01 // CPU SECTION                                      */}
        {/* ======================================================== */}
        {activeSection === 'cpu' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Section Tag */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
                <Cpu className="w-4 h-4" />
                <span>01 // PROCESADOR</span>
              </div>
              <span className="text-xs font-mono-tech text-zinc-500">SECCIÓN 01 DE 08</span>
            </div>

            {/* Title & Concept */}
            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                CPU // EL QUE EJECUTA LAS INSTRUCCIONES
              </h2>
              <p className="font-sans-editorial text-base text-zinc-300 leading-relaxed max-w-2xl">
                La Unidad Central de Procesamiento es el motor aritmético y de control. Cada clic, física de juego o cálculo de programa pasa por sus núcleos e hilos de procesamiento. Su nombre exacto nos dice generación, arquitectura y cuántas instrucciones puede procesar en paralelo.
              </p>
            </div>

            {/* ¿POR QUÉ TE INTERESA? */}
            <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono-tech uppercase font-bold tracking-widest text-yellow-400 block mb-1">
                ¿POR QUÉ TE INTERESA?
              </span>
              <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed font-medium">
                “Puede influir en los FPS, la fluidez de la multitarea, los tiempos de respuesta del sistema y en cuánto trabajo puede alimentar a una tarjeta de video antes de saturarse.”
              </p>
            </div>

            {/* Microbloques selectivos: SABÍAS QUE & MITO VS EVIDENCIA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-semibold">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>¿SABÍAS QUE...?</span>
                </div>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  Un procesador con menos GHz pero arquitectura más moderna puede ser infinitamente más rápido que uno antiguo a 4.5 GHz, porque ejecuta más instrucciones por ciclo de reloj (IPC).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-300 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  <span>MITO VS EVIDENCIA</span>
                </div>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  <strong>Mito:</strong> “Tener un Core i7 siempre es mejor que un Core i5”.<br />
                  <strong>Evidencia:</strong> Un Core i5 de 13ª generación supera a un Core i7 de 9ª generación en velocidad mono-núcleo y eficiencia energética.
                </p>
              </div>
            </div>

            {/* CÓMO ENCONTRAR CADA DATO (MÉTODO VISUAL PRIMERO) */}
            <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold">
                  CÓMO ENCONTRAR TU CPU // MÉTODO VISUAL
                </span>
                <span className="text-[10px] font-mono-tech text-yellow-400 font-semibold">PASO A PASO</span>
              </div>

              {/* Visual Flow diagram */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-tech">
                <span className="px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-yellow-400 font-bold shadow-sm">
                  CTRL + SHIFT + ESC
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-medium">
                  RENDIMIENTO
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-bold">
                  CPU
                </span>
              </div>

              <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
                Mirá arriba a la derecha: verás el nombre exacto (por ejemplo: <em>AMD Ryzen 5 5600X</em> o <em>Intel Core i5-12400F</em>), junto con la cantidad de núcleos, procesadores lógicos y velocidad base.
              </p>

              {/* CAPA 02 // TÉCNICA (PROFUNDIZAR) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleTech('cpu')}
                  className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>PROFUNDIZAR // MÉTODO TÉCNICO (POWERSHELL)</span>
                  {expandedTech['cpu'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedTech['cpu'] && (
                  <div className="mt-3 p-4 rounded-xl bg-black border border-zinc-800 space-y-2.5 font-mono-tech text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                      <span>POWERSHELL QUERY (SOLO LECTURA SEGURA)</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            'Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed',
                            'cpu'
                          )
                        }
                        className="text-yellow-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedScript === 'cpu' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'cpu' ? 'COPIADO' : 'COPIAR COMANDO'}</span>
                      </button>
                    </div>

                    <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-950 rounded border border-zinc-900 text-[11px] leading-relaxed">
                      <code>Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed</code>
                    </pre>

                    <p className="font-sans-editorial text-xs text-zinc-400">
                      <strong>¿Qué le estamos preguntando a Windows?</strong> Le pedimos a la interfaz WMI de Windows que consulte al hardware del sistema su nombre de fábrica, núcleos físicos, hilos lógicos y frecuencia máxima garantizada.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* REGISTRO DE EVIDENCIA EN TU PASAPORTE */}
            <div className="p-6 rounded-2xl bg-[#14151b] border-2 border-yellow-400/40 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                  REGISTRO DE EVIDENCIA // TU PROCESADOR
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    FUENTE: {evidenceMap.cpu.source}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      evidenceMap.cpu.state === 'CONFIRMADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : evidenceMap.cpu.state === 'DETECTADO'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                        : evidenceMap.cpu.state === 'OBSERVADO'
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    ESTADO: {evidenceMap.cpu.state}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 uppercase">
                  ¿Qué procesador reporta tu sistema?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ej: Intel Core i5-12400F 6-Core o AMD Ryzen 5 5600"
                    value={specs?.cpu || ''}
                    onChange={(e) => handleFieldChange('cpu', e.target.value, 'ADMINISTRADOR DE TAREAS')}
                    className="flex-1 bg-black/70 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono-tech focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (specs?.cpu?.trim()) {
                        markSectionCompleted('cpu');
                        setActiveSection('ram');
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>GUARDAR Y PASAR A RAM</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-zinc-400 pt-1">
                <span>Dato ingresado manualmente queda como <strong>DECLARADO</strong> hasta ser contrastado con PowerShell en el Laboratorio.</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 02 // RAM SECTION                                      */}
        {/* ======================================================== */}
        {activeSection === 'ram' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
                <Layers className="w-4 h-4" />
                <span>02 // MEMORIA RAM</span>
              </div>
              <span className="text-xs font-mono-tech text-zinc-500">SECCIÓN 02 DE 08</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                RAM // EL ESPACIO DE TRABAJO INMEDIATO
              </h2>
              <p className="font-sans-editorial text-base text-zinc-300 leading-relaxed max-w-2xl">
                La memoria de acceso aleatorio no guarda archivos para siempre; mantiene vivos los programas, texturas y datos que la CPU necesita en este instante exacto. Si se llena, el sistema sufre caídas drásticas al recurrir al disco como auxilio de emergencia.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono-tech uppercase font-bold tracking-widest text-yellow-400 block mb-1">
                ¿POR QUÉ TE INTERESA?
              </span>
              <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed font-medium">
                “Tener suficiente capacidad evita tirones (stuttering). Tener alta frecuencia y dual channel (dos módulos en lugar de uno) ensancha la autopista de datos hacia el procesador.”
              </p>
            </div>

            {/* RELACIÓN EDITORIAL: CPU ↕ RAM */}
            <div className="p-5 rounded-xl bg-black/40 border border-zinc-800 space-y-3">
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
                RELACIÓN DIRECTA // CPU ↕ RAM
              </span>
              <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                <strong>¿Cómo trabajan juntas?</strong> La CPU tiene cachés diminutas pero ultrarrápidas. Cuando necesita más datos, le pide a la RAM que los despache a miles de megabytes por segundo. Si tenés un solo módulo de memoria (Single Channel), estás obligando al procesador a hablar por un solo carril de datos en vez de dos simultáneos.
              </p>
            </div>

            {/* TALLER EVO CÁPSULA: MI PC NO DETECTA TODA LA RAM */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-yellow-400/30 space-y-3">
              <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono-tech font-bold uppercase">
                <Wrench className="w-4 h-4" />
                <span>TALLER EVO // CÁPSULA: “MI PC NO DETECTA TODA LA RAM”</span>
              </div>
              <div className="space-y-2 text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                <p>
                  Si instalaste 16 GB pero Windows dice <em>“8 GB utilizables”</em> o solo detecta una ranura:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>Comprobar primero qué reconoce Windows en el Administrador de tareas.</li>
                  <li>Comparar contra la memoria física instalada en la placa madre.</li>
                  <li>Si existe una diferencia, puede haber varias causas: memoria reservada para gráficos integrados, un módulo mal asentado, configuración de slots o incompatibilidad de perfil XMP/EXPO.</li>
                </ul>
                <p className="font-mono-tech text-[11px] text-yellow-400/90 pt-1 italic">
                  → Lo investigaremos paso a paso y con protocolos de descarte físico en el Tomo 03: HACELO VOS MISMO.
                </p>
              </div>
            </div>

            {/* CÓMO ENCONTRAR TU RAM */}
            <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold block">
                CÓMO ENCONTRAR TU RAM // MÉTODO VISUAL
              </span>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-tech">
                <span className="px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-yellow-400 font-bold">
                  CTRL + SHIFT + ESC
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-medium">
                  RENDIMIENTO
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-bold">
                  MEMORIA
                </span>
              </div>

              <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
                Identificá: <strong>Capacidad total</strong> (ej: 16 GB), <strong>Velocidad</strong> (ej: 3200 MHz) y <strong>Ranuras usadas</strong> (ej: 2 de 4).
              </p>

              {/* PROFUNDIZAR POWERSHELL */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleTech('ram')}
                  className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>PROFUNDIZAR // MÉTODO TÉCNICO (POWERSHELL)</span>
                  {expandedTech['ram'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedTech['ram'] && (
                  <div className="mt-3 p-4 rounded-xl bg-black border border-zinc-800 space-y-2.5 font-mono-tech text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                      <span>POWERSHELL QUERY</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            'Get-CimInstance Win32_PhysicalMemory | Select-Object Manufacturer, Capacity, Speed, ConfiguredClockSpeed',
                            'ram'
                          )
                        }
                        className="text-yellow-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedScript === 'ram' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'ram' ? 'COPIADO' : 'COPIAR COMANDO'}</span>
                      </button>
                    </div>

                    <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-950 rounded border border-zinc-900 text-[11px]">
                      <code>Get-CimInstance Win32_PhysicalMemory | Select-Object Manufacturer, Capacity, Speed, ConfiguredClockSpeed</code>
                    </pre>

                    <p className="font-sans-editorial text-xs text-zinc-400">
                      <strong>¿Qué le estamos preguntando?</strong> Te devolverá una fila por cada módulo físico instalado, revelando la marca de los chips y si están corriendo a su frecuencia configurada real.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* REGISTRO RAM */}
            <div className="p-6 rounded-2xl bg-[#14151b] border-2 border-yellow-400/40 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                  REGISTRO DE EVIDENCIA // TU MEMORIA RAM
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    FUENTE: {evidenceMap.ram.source}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      evidenceMap.ram.state === 'CONFIRMADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : evidenceMap.ram.state === 'DETECTADO'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                        : evidenceMap.ram.state === 'OBSERVADO'
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    ESTADO: {evidenceMap.ram.state}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 uppercase">
                  ¿Cuánta memoria RAM tenés y a qué velocidad?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ej: 16 GB DDR4 (2x8GB) 3200 MHz"
                    value={specs?.ram || ''}
                    onChange={(e) => handleFieldChange('ram', e.target.value, 'ADMINISTRADOR DE TAREAS')}
                    className="flex-1 bg-black/70 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono-tech focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (specs?.ram?.trim()) {
                        markSectionCompleted('ram');
                        setActiveSection('gpu');
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>GUARDAR Y PASAR A GPU</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-zinc-400 pt-1">
                <span>Dato ingresado manualmente queda como <strong>DECLARADO</strong> hasta ser contrastado con PowerShell.</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 03 // GPU SECTION                                      */}
        {/* ======================================================== */}
        {activeSection === 'gpu' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
                <Monitor className="w-4 h-4" />
                <span>03 // GRÁFICOS (GPU)</span>
              </div>
              <span className="text-xs font-mono-tech text-zinc-500">SECCIÓN 03 DE 08</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                GPU // EL MOTOR DE PARALELISMO MASIVO
              </h2>
              <p className="font-sans-editorial text-base text-zinc-300 leading-relaxed max-w-2xl">
                A diferencia de la CPU (que tiene pocos núcleos pero extremadamente rápidos), la GPU tiene miles de núcleos más lentos diseñados para una sola cosa: pintar millones de píxeles, calcular geometrías 3D y renderizar frames en paralelo.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono-tech uppercase font-bold tracking-widest text-yellow-400 block mb-1">
                ¿DEDICADA O INTEGRADA?
              </span>
              <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed font-medium">
                • <strong>GPU Dedicada:</strong> Placa independiente con su propia memoria VRAM ultra veloz (ej: NVIDIA GeForce o AMD Radeon).<br />
                • <strong>GPU Integrada:</strong> Viene adentro del procesador y comparte la memoria RAM del sistema (ej: Intel Iris Xe o AMD Radeon Graphics).
              </p>
            </div>

            {/* RELACIÓN EDITORIAL: CPU + GPU & GPU + RAM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
                  CPU + GPU // REPARTO DE TRABAJO
                </span>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  La CPU calcula la lógica, posiciones y física del juego; luego le manda órdenes de dibujo a la GPU. Si la CPU es lenta, la GPU se queda esperando sin nada que renderizar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
                  GPU INTEGRADA + RAM
                </span>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  Si tenés gráfica integrada, el rendimiento en juegos depende críticamente de la velocidad de tu RAM y de tener Dual Channel, ya que esa es su única fuente de memoria de video.
                </p>
              </div>
            </div>

            {/* CÓMO ENCONTRAR TU GPU */}
            <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold block">
                CÓMO ENCONTRAR TU GPU // MÉTODO VISUAL
              </span>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-tech">
                <span className="px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-yellow-400 font-bold">
                  CTRL + SHIFT + ESC
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-medium">
                  RENDIMIENTO
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-bold">
                  GPU 0 / GPU 1
                </span>
              </div>

              <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
                Revisá el nombre completo y la <strong>Memoria de GPU dedicada</strong> (VRAM).
              </p>

              {/* PROFUNDIZAR POWERSHELL */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleTech('gpu')}
                  className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>PROFUNDIZAR // MÉTODO TÉCNICO (POWERSHELL)</span>
                  {expandedTech['gpu'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedTech['gpu'] && (
                  <div className="mt-3 p-4 rounded-xl bg-black border border-zinc-800 space-y-2.5 font-mono-tech text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                      <span>POWERSHELL QUERY</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy('Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion', 'gpu')
                        }
                        className="text-yellow-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedScript === 'gpu' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'gpu' ? 'COPIADO' : 'COPIAR COMANDO'}</span>
                      </button>
                    </div>

                    <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-950 rounded border border-zinc-900 text-[11px]">
                      <code>Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* REGISTRO GPU */}
            <div className="p-6 rounded-2xl bg-[#14151b] border-2 border-yellow-400/40 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                  REGISTRO DE EVIDENCIA // TU PLACA DE VIDEO
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    FUENTE: {evidenceMap.gpu.source}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      evidenceMap.gpu.state === 'CONFIRMADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : evidenceMap.gpu.state === 'DETECTADO'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                        : evidenceMap.gpu.state === 'OBSERVADO'
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    ESTADO: {evidenceMap.gpu.state}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 uppercase">
                  ¿Qué tarjeta gráfica reporta tu sistema?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ej: NVIDIA GeForce RTX 3060 12GB o Intel UHD Graphics 770"
                    value={specs?.gpu || ''}
                    onChange={(e) => handleFieldChange('gpu', e.target.value, 'ADMINISTRADOR DE TAREAS')}
                    className="flex-1 bg-black/70 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono-tech focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (specs?.gpu?.trim()) {
                        markSectionCompleted('gpu');
                        setActiveSection('storage');
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>GUARDAR Y PASAR A ALMACENAMIENTO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-zinc-400 pt-1">
                <span>Dato ingresado manualmente queda como <strong>DECLARADO</strong> hasta ser contrastado con PowerShell.</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 04 // STORAGE SECTION                                   */}
        {/* ======================================================== */}
        {activeSection === 'storage' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
                <HardDrive className="w-4 h-4" />
                <span>04 // ALMACENAMIENTO</span>
              </div>
              <span className="text-xs font-mono-tech text-zinc-500">SECCIÓN 04 DE 08</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                ALMACENAMIENTO // DONDE DESCANSAN TUS DATOS
              </h2>
              <p className="font-sans-editorial text-base text-zinc-300 leading-relaxed max-w-2xl">
                El almacenamiento retiene tus archivos aunque apagues el equipo. La diferencia entre un disco mecánico (HDD) y una unidad de estado sólido (SSD NVMe PCIe) no es solo velocidad de copia: es el tiempo de acceso que hace que tu PC arranque en 8 segundos o en 3 minutos.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono-tech uppercase font-bold tracking-widest text-yellow-400 block mb-1">
                RELACIÓN: ALMACENAMIENTO + RAM
              </span>
              <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed font-medium">
                Cuando iniciás un juego o abrís un navegador, los archivos se cargan desde el SSD hacia la RAM. Un disco veloz reduce los tiempos de carga a casi cero, pero no aumenta los FPS máximos una vez que el juego ya está en memoria.
              </p>
            </div>

            {/* CÓMO ENCONTRARLO */}
            <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold block">
                CÓMO ENCONTRAR TU DISCO // MÉTODO VISUAL
              </span>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-tech">
                <span className="px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-yellow-400 font-bold">
                  CTRL + SHIFT + ESC
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-medium">
                  RENDIMIENTO
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-bold">
                  DISCO (C:)
                </span>
              </div>

              <p className="font-sans-editorial text-xs text-zinc-400 leading-relaxed">
                Fijate en el campo <strong>Tipo:</strong> dice si es SSD o HDD, junto con el modelo exacto de la unidad.
              </p>

              {/* PROFUNDIZAR POWERSHELL */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleTech('storage')}
                  className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>PROFUNDIZAR // MÉTODO TÉCNICO (POWERSHELL)</span>
                  {expandedTech['storage'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedTech['storage'] && (
                  <div className="mt-3 p-4 rounded-xl bg-black border border-zinc-800 space-y-2.5 font-mono-tech text-xs animate-in fade-in duration-150">
                    <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-950 rounded border border-zinc-900 text-[11px]">
                      <code>Get-PhysicalDisk | Select-Object FriendlyName, MediaType, BusType, Size</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* REGISTRO STORAGE */}
            <div className="p-6 rounded-2xl bg-[#14151b] border-2 border-yellow-400/40 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                  REGISTRO DE EVIDENCIA // TU ALMACENAMIENTO
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    FUENTE: {evidenceMap.storage.source}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      evidenceMap.storage.state === 'CONFIRMADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : evidenceMap.storage.state === 'DETECTADO'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                        : evidenceMap.storage.state === 'OBSERVADO'
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    ESTADO: {evidenceMap.storage.state}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 uppercase">
                  ¿Qué tipo y capacidad de disco tenés como principal?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ej: SSD NVMe Kingston NV2 1TB o SSD SATA 480GB"
                    value={specs?.storage || ''}
                    onChange={(e) => handleFieldChange('storage', e.target.value, 'ADMINISTRADOR DE TAREAS')}
                    className="flex-1 bg-black/70 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono-tech focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (specs?.storage?.trim()) {
                        markSectionCompleted('storage');
                        setActiveSection('motherboard');
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>GUARDAR Y PASAR A PLATAFORMA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-zinc-400 pt-1">
                <span>Dato ingresado manualmente queda como <strong>DECLARADO</strong> hasta ser contrastado con PowerShell.</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 05 // PLATAFORMA / MOTHERBOARD                          */}
        {/* ======================================================== */}
        {activeSection === 'motherboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
                <CircuitBoard className="w-4 h-4" />
                <span>05 // PLATAFORMA & PLACA BASE</span>
              </div>
              <span className="text-xs font-mono-tech text-zinc-500">SECCIÓN 05 DE 08</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                PLATAFORMA // LA CIUDAD DE COBRE Y SILICIO
              </h2>
              <p className="font-sans-editorial text-base text-zinc-300 leading-relaxed max-w-2xl">
                La placa madre (Motherboard) es el chasis de comunicación. Todos los componentes se enchufan en ella: maneja las líneas PCIe, los zócalos de memoria, la entrega de energía de la fuente (VRM) y la BIOS/UEFI.
              </p>
            </div>

            {/* CÓMO ENCONTRARLA CON MSINFO32 O POWERSHELL */}
            <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold block">
                CÓMO ENCONTRARLA // MÉTODO RÁPIDO
              </span>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-tech">
                <span className="px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-yellow-400 font-bold">
                  WIN + R
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono">
                  msinfo32
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-bold">
                  Fabricante y Producto de la placa base
                </span>
              </div>

              {/* TÉCNICO POWERSHELL */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleTech('mb')}
                  className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>MÉTODO POWERSHELL (DIRECTO)</span>
                  {expandedTech['mb'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedTech['mb'] && (
                  <div className="mt-3 p-4 rounded-xl bg-black border border-zinc-800 space-y-2 font-mono-tech text-xs">
                    <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-950 rounded border border-zinc-900 text-[11px]">
                      <code>Get-CimInstance Win32_BaseBoard | Select-Object Manufacturer, Product</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* REGISTRO MOTHERBOARD */}
            <div className="p-6 rounded-2xl bg-[#14151b] border-2 border-yellow-400/40 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                  REGISTRO DE EVIDENCIA // TU PLACA MADRE
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    FUENTE: {evidenceMap.motherboard.source}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      evidenceMap.motherboard.state === 'CONFIRMADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : evidenceMap.motherboard.state === 'DETECTADO'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                        : evidenceMap.motherboard.state === 'OBSERVADO'
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    ESTADO: {evidenceMap.motherboard.state}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 uppercase">
                  Modelo de placa base (o modelo de notebook):
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ej: ASUS B550M-A, MSI B650 o Lenovo IdeaPad 3"
                    value={specs?.motherboard || ''}
                    onChange={(e) => handleFieldChange('motherboard', e.target.value, 'INFORMACIÓN DEL SISTEMA')}
                    className="flex-1 bg-black/70 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono-tech focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      markSectionCompleted('motherboard');
                      setActiveSection('windows');
                    }}
                    className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>GUARDAR Y PASAR A WINDOWS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-zinc-400 pt-1">
                <span>Dato ingresado manualmente queda como <strong>DECLARADO</strong> hasta ser contrastado con PowerShell.</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 06 // WINDOWS SECTION                                   */}
        {/* ======================================================== */}
        {activeSection === 'windows' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
                <Terminal className="w-4 h-4" />
                <span>06 // SISTEMA OPERATIVO</span>
              </div>
              <span className="text-xs font-mono-tech text-zinc-500">SECCIÓN 06 DE 08</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                WINDOWS // EL DIRECTOR DE ORQUESTA
              </h2>
              <p className="font-sans-editorial text-base text-zinc-300 leading-relaxed max-w-2xl">
                El sistema operativo no es solo una interfaz gráfica: es el kernel que decide qué hilo de CPU corre en cada microsegundo, cómo se asigna la memoria y qué drivers intermedian con los fierros.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-5">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold block">
                CÓMO ENCONTRAR TU VERSIÓN EXACTA // MÉTODO VISUAL
              </span>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-tech">
                <span className="px-3 py-1.5 rounded-lg bg-black border border-zinc-700 text-yellow-400 font-bold">
                  WIN + R
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono">
                  winver
                </span>
                <span className="text-zinc-500">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-bold">
                  Versión & Compilación
                </span>
              </div>

              {/* PROFUNDIZAR POWERSHELL */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleTech('win')}
                  className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>PROFUNDIZAR // QUERY POWERSHELL</span>
                  {expandedTech['win'] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedTech['win'] && (
                  <div className="mt-3 p-4 rounded-xl bg-black border border-zinc-800 space-y-2 font-mono-tech text-xs">
                    <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-950 rounded border border-zinc-900 text-[11px]">
                      <code>Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, BuildNumber</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* REGISTRO WINDOWS */}
            <div className="p-6 rounded-2xl bg-[#14151b] border-2 border-yellow-400/40 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                  REGISTRO DE EVIDENCIA // TU WINDOWS
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    FUENTE: {evidenceMap.os.source}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      evidenceMap.os.state === 'CONFIRMADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : evidenceMap.os.state === 'DETECTADO'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                        : evidenceMap.os.state === 'OBSERVADO'
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    ESTADO: {evidenceMap.os.state}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 uppercase">
                  Edición y versión de Windows:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Ej: Windows 11 Pro 23H2 (Build 22631)"
                    value={specs?.os || ''}
                    onChange={(e) => handleFieldChange('os', e.target.value, 'WINVER')}
                    className="flex-1 bg-black/70 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono-tech focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      markSectionCompleted('windows');
                      setActiveSection('peripherals');
                    }}
                    className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>GUARDAR Y PASAR A PERIFÉRICOS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech text-zinc-400 pt-1">
                <span>Dato ingresado manualmente queda como <strong>DECLARADO</strong> hasta ser contrastado con PowerShell.</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 07 // PERIPHERALS SECTION                               */}
        {/* ======================================================== */}
        {activeSection === 'peripherals' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 font-mono-tech text-xs text-yellow-400 font-bold uppercase">
                <Monitor className="w-4 h-4" />
                <span>07 // PERIFÉRICOS</span>
              </div>
              <span className="text-xs font-mono-tech text-zinc-500">SECCIÓN 07 DE 08</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                PERIFÉRICOS // DONDE VOS TOCÁS LA MÁQUINA
              </h2>
              <p className="font-sans-editorial text-base text-zinc-300 leading-relaxed max-w-2xl">
                Tener un hardware monstruoso no sirve de nada si tu monitor refresca a 60 Hz cuando tu GPU produce 180 FPS, o si tu red tiene fluctuaciones de latencia inmanejables.
              </p>
            </div>

            {/* CRITICAL CONCEPTS EDITORIALES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-xs font-mono-tech text-yellow-400 font-bold block">
                  MONITOR: Hz ≠ FPS
                </span>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  Si tu monitor es de 60 Hz, solo muestra 60 imágenes por segundo físicamente, sin importar que el juego diga 200 FPS.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-xs font-mono-tech text-white font-bold block">
                  MOUSE: DPI ≠ SENSIBILIDAD
                </span>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  Tener 16.000 DPI no da puntería: la precisión real depende del sensor, del polling rate (Hz) y de desactivar la aceleración de Windows.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                <span className="text-xs font-mono-tech text-yellow-300 font-bold block">
                  RED: VELOCIDAD ≠ LATENCIA
                </span>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  Tener 500 Megas de fibra para descargar no garantiza bajo ping si tu Wi-Fi pierde paquetes o tiene jitter constante.
                </p>
              </div>
            </div>

            {/* REGISTRO PERIFÉRICOS */}
            <div className="p-6 rounded-2xl bg-[#14151b] border-2 border-yellow-400/40 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold block">
                  REGISTRO DE EVIDENCIA // TU MONITOR Y ENTORNO
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    FUENTE: {evidenceMap.monitor.source}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase ${
                      evidenceMap.monitor.state === 'CONFIRMADO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : evidenceMap.monitor.state === 'OBSERVADO'
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    ESTADO: {evidenceMap.monitor.state}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 uppercase">
                    Monitor (Resolución y Hz):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 1080p 144Hz IPS o 1440p 165Hz"
                    value={specs?.monitor || ''}
                    onChange={(e) => handleFieldChange('monitor', e.target.value, 'CONFIGURACIÓN DE PANTALLA')}
                    className="w-full bg-black/70 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono-tech focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1.5 uppercase">
                    Periféricos / Red clave:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Cable Ethernet directo, Mouse óptico 1000Hz"
                    value={specs?.peripherals || ''}
                    onChange={(e) => handleFieldChange('peripherals', e.target.value, 'OBSERVACIÓN')}
                    className="w-full bg-black/70 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white font-mono-tech focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      markSectionCompleted('peripherals');
                      setActiveSection('tu-pc');
                    }}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>FINALIZAR INVESTIGACIÓN → PASAPORTE DE TU PC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 08 // TU PC — PASAPORTE / LABORATORIO 01 / ARTEFACTO     */}
        {/* ======================================================== */}
        {activeSection === 'tu-pc' && (
          <div className="space-y-10 animate-in fade-in duration-300 pb-16">
            {/* Header */}
            <div className="space-y-3 pb-6 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 tracking-widest uppercase font-bold">
                <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                <span>CAPÍTULO 01 COMPLETADO // TU PC YA NO ES DESCONOCIDA</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                PASAPORTE DE TU MÁQUINA
              </h2>

              <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
                Este es el primer artefacto de investigación de tu colección EVO LABS: la evidencia física real y verificada de tu silicio.
              </p>
            </div>

            {/* THE PASSPORT ARTIFACT CARD */}
            <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-b from-[#16171e] to-[#0c0d10] p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/80 gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-yellow-400 inline-block" />
                  <span className="font-mono-tech font-bold text-sm tracking-widest uppercase text-white">
                    PASAPORTE DE MI PC // MATRIZ DE EVIDENCIA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono-tech text-yellow-400 tracking-wider uppercase px-2.5 py-1 rounded bg-yellow-400/10 border border-yellow-400/40 font-bold">
                    EVIDENCIA MODELO EVO
                  </span>
                </div>
              </div>

              {/* Grid of registered hardware with evidence state badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase text-[10px]">01. PROCESADOR (CPU)</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        evidenceMap.cpu.state === 'CONFIRMADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : evidenceMap.cpu.state === 'DETECTADO'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                          : evidenceMap.cpu.state === 'OBSERVADO'
                          ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {evidenceMap.cpu.state}
                    </span>
                  </div>
                  <span className="text-white font-bold text-sm block">{specs.cpu || 'Pendiente de registrar'}</span>
                  <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/50">
                    <span>Fuente: {evidenceMap.cpu.source}</span>
                    {evidenceMap.cpu.details?.extra && <span className="text-zinc-400 truncate max-w-[150px]">{evidenceMap.cpu.details.extra}</span>}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase text-[10px]">02. MEMORIA RAM</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        evidenceMap.ram.state === 'CONFIRMADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : evidenceMap.ram.state === 'DETECTADO'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                          : evidenceMap.ram.state === 'OBSERVADO'
                          ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {evidenceMap.ram.state}
                    </span>
                  </div>
                  <span className="text-white font-bold text-sm block">{specs.ram || 'Pendiente de registrar'}</span>
                  <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/50">
                    <span>Fuente: {evidenceMap.ram.source}</span>
                    {evidenceMap.ram.details?.extra && <span className="text-zinc-400 truncate max-w-[150px]">{evidenceMap.ram.details.extra}</span>}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase text-[10px]">03. GRÁFICOS (GPU)</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        evidenceMap.gpu.state === 'CONFIRMADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : evidenceMap.gpu.state === 'DETECTADO'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                          : evidenceMap.gpu.state === 'OBSERVADO'
                          ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {evidenceMap.gpu.state}
                    </span>
                  </div>
                  <span className="text-white font-bold text-sm block">{specs.gpu || 'Pendiente de registrar'}</span>
                  <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/50">
                    <span>Fuente: {evidenceMap.gpu.source}</span>
                    {evidenceMap.gpu.details?.extra && <span className="text-zinc-400 truncate max-w-[150px]">{evidenceMap.gpu.details.extra}</span>}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase text-[10px]">04. ALMACENAMIENTO</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        evidenceMap.storage.state === 'CONFIRMADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : evidenceMap.storage.state === 'DETECTADO'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                          : evidenceMap.storage.state === 'OBSERVADO'
                          ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {evidenceMap.storage.state}
                    </span>
                  </div>
                  <span className="text-white font-bold text-sm block">{specs.storage || 'Pendiente de registrar'}</span>
                  <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/50">
                    <span>Fuente: {evidenceMap.storage.source}</span>
                    {evidenceMap.storage.details?.extra && <span className="text-zinc-400 truncate max-w-[150px]">{evidenceMap.storage.details.extra}</span>}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase text-[10px]">05. PLATAFORMA / PLACA</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        evidenceMap.motherboard.state === 'CONFIRMADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : evidenceMap.motherboard.state === 'DETECTADO'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {evidenceMap.motherboard.state}
                    </span>
                  </div>
                  <span className="text-zinc-200 font-medium block">{specs.motherboard || 'No especificada'}</span>
                  <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
                    Fuente: {evidenceMap.motherboard.source}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase text-[10px]">06. SISTEMA OPERATIVO</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        evidenceMap.os.state === 'CONFIRMADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : evidenceMap.os.state === 'DETECTADO'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {evidenceMap.os.state}
                    </span>
                  </div>
                  <span className="text-zinc-200 font-medium block">{specs.os || 'No especificada'}</span>
                  <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
                    Fuente: {evidenceMap.os.source}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase text-[10px]">07. MONITOR</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        evidenceMap.monitor.state === 'CONFIRMADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                      }`}
                    >
                      {evidenceMap.monitor.state}
                    </span>
                  </div>
                  <span className="text-zinc-200 font-medium block">{specs.monitor || 'No especificado'}</span>
                  <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
                    Fuente: {evidenceMap.monitor.source}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 uppercase text-[10px]">08. PERIFÉRICOS & RED</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        evidenceMap.peripherals.state === 'CONFIRMADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/50'
                      }`}
                    >
                      {evidenceMap.peripherals.state}
                    </span>
                  </div>
                  <span className="text-zinc-200 font-medium block">{specs.peripherals || 'No especificado'}</span>
                  <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/50">
                    Fuente: {evidenceMap.peripherals.source}
                  </div>
                </div>
              </div>

              {/* COMPARATIVA CON HIPÓTESIS PREVIA */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-yellow-400 font-bold block">
                    RESULTADOS DEL EXPERIMENTO // TU IDEA VS EVIDENCIA
                  </span>
                  <span className="text-[10px] font-mono-tech text-zinc-400">
                    FILOSOFÍA: LO QUE CREÍAS VS LO QUE DEMOSTRASTE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-tech">
                  <div className="p-3 bg-black/60 rounded-lg border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[10px] uppercase font-bold">CPU</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          getHypothesisComparison(hypothesis.cpu, specs.cpu) === 'COINCIDE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : getHypothesisComparison(hypothesis.cpu, specs.cpu) === 'COINCIDE PARCIALMENTE'
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {getHypothesisComparison(hypothesis.cpu, specs.cpu)}
                      </span>
                    </div>
                    <div className="text-zinc-400 text-xs truncate">Creías: <span className="text-white">{hypothesis.cpu || '—'}</span></div>
                    <div className="text-zinc-400 text-xs truncate">Real: <span className="text-yellow-400">{specs.cpu || '—'}</span></div>
                  </div>

                  <div className="p-3 bg-black/60 rounded-lg border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[10px] uppercase font-bold">RAM</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          getHypothesisComparison(hypothesis.ram, specs.ram) === 'COINCIDE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : getHypothesisComparison(hypothesis.ram, specs.ram) === 'COINCIDE PARCIALMENTE'
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {getHypothesisComparison(hypothesis.ram, specs.ram)}
                      </span>
                    </div>
                    <div className="text-zinc-400 text-xs truncate">Creías: <span className="text-white">{hypothesis.ram || '—'}</span></div>
                    <div className="text-zinc-400 text-xs truncate">Real: <span className="text-yellow-400">{specs.ram || '—'}</span></div>
                  </div>

                  <div className="p-3 bg-black/60 rounded-lg border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[10px] uppercase font-bold">GPU</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          getHypothesisComparison(hypothesis.gpu, specs.gpu) === 'COINCIDE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : getHypothesisComparison(hypothesis.gpu, specs.gpu) === 'COINCIDE PARCIALMENTE'
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {getHypothesisComparison(hypothesis.gpu, specs.gpu)}
                      </span>
                    </div>
                    <div className="text-zinc-400 text-xs truncate">Creías: <span className="text-white">{hypothesis.gpu || '—'}</span></div>
                    <div className="text-zinc-400 text-xs truncate">Real: <span className="text-yellow-400">{specs.gpu || '—'}</span></div>
                  </div>
                </div>
              </div>

              {/* Botones de Exportación: TXT y JSON */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs font-mono-tech text-zinc-400">
                  Exportá tu artefacto para contrastar con las pruebas de los siguientes tomos:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadPassportTxt}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 text-white font-mono-tech font-bold text-xs uppercase hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-700"
                  >
                    <Download className="w-4 h-4 text-yellow-400" />
                    <span>DESCARGAR .TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPassportJson}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-400 transition-colors cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>DESCARGAR .JSON (ESTRUCTURADO)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CREACIÓN DE ARCHIVO DESDE POWERSHELL (CAPA 03 // LABORATORIO PASAPORTE DE MI PC) */}
            {(() => {
              const cpuVal = specs?.cpu?.trim() ? specs.cpu.trim() : 'NO IDENTIFICADO';
              const ramVal = specs?.ram?.trim() ? specs.ram.trim() : 'NO IDENTIFICADO';
              const gpuVal = specs?.gpu?.trim() ? specs.gpu.trim() : 'NO IDENTIFICADO';
              const storageVal = specs?.storage?.trim() ? specs.storage.trim() : 'NO IDENTIFICADO';

              const step1Code = `$Escritorio = [Environment]::GetFolderPath('Desktop')
$Archivo = Join-Path $Escritorio 'EVO-LABS-MI-PC.txt'
$Archivo`;

              const step2Code = `"EVO LABS // PASAPORTE DE MI PC" | Out-File -FilePath $Archivo -Encoding utf8`;

              const step3Code = `"CPU: ${cpuVal}" | Out-File -FilePath $Archivo -Append -Encoding utf8
"RAM: ${ramVal}" | Out-File -FilePath $Archivo -Append -Encoding utf8
"GPU: ${gpuVal}" | Out-File -FilePath $Archivo -Append -Encoding utf8
"DISCO: ${storageVal}" | Out-File -FilePath $Archivo -Append -Encoding utf8`;

              const step4Code = `Get-Content -Path $Archivo
Test-Path $Archivo
notepad $Archivo`;

              const fullLabCode = `$Escritorio = [Environment]::GetFolderPath('Desktop')
$Archivo = Join-Path $Escritorio 'EVO-LABS-MI-PC.txt'

"EVO LABS // PASAPORTE DE MI PC" | Out-File -FilePath $Archivo -Encoding utf8

"CPU: ${cpuVal}" | Out-File -FilePath $Archivo -Append -Encoding utf8
"RAM: ${ramVal}" | Out-File -FilePath $Archivo -Append -Encoding utf8
"GPU: ${gpuVal}" | Out-File -FilePath $Archivo -Append -Encoding utf8
"DISCO: ${storageVal}" | Out-File -FilePath $Archivo -Append -Encoding utf8

Get-Content -Path $Archivo
Test-Path $Archivo`;

              return (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#111216] border border-zinc-800 space-y-7">
                  {/* Header & Pedagogy */}
                  <div className="space-y-3 pb-5 border-b border-zinc-800/80">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-bold uppercase">
                        <Terminal className="w-4 h-4" />
                        <span>LABORATORIO // CREAR PASAPORTE EN POWERSHELL (EVO-LABS-MI-PC.TXT)</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(fullLabCode, 'lab-full')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer shadow-md"
                      >
                        {copiedScript === 'lab-full' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedScript === 'lab-full' ? 'COPIADO AL PORTAPAPELES' : 'COPIAR TODO EL LABORATORIO'}</span>
                      </button>
                    </div>

                    <p className="font-sans-editorial text-sm text-zinc-300 leading-relaxed">
                      Este ejercicio secuencial te enseña cómo Windows maneja rutas, archivos y codificación de texto. Ejecutá cada paso en orden o copiá el bloque completo.
                    </p>

                    {/* Protección pedagógica: Orden secuencial */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800 text-xs font-mono-tech text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-yellow-400 font-semibold">ORDEN DE EJECUCIÓN:</span>
                      <span className="text-zinc-400 text-[11px]">
                        1. Definir variable de ruta → 2. Crear archivo base → 3. Agregar evidencias → 4. Comprobar resultado → 5. Importar
                      </span>
                    </div>
                  </div>

                  {/* PASO 1 // DEFINIR EL ARCHIVO */}
                  <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-black/60 border border-zinc-800/90">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400">
                        PASO 1 // DEFINIR DÓNDE SE GUARDARÁ EL ARCHIVO
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(step1Code, 'step-1')}
                        className="text-yellow-400 hover:text-white flex items-center gap-1.5 text-xs font-mono-tech cursor-pointer"
                      >
                        {copiedScript === 'step-1' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'step-1' ? 'COPIADO' : 'COPIAR PASO 1'}</span>
                      </button>
                    </div>

                    <pre className="text-zinc-200 overflow-x-auto p-3.5 bg-zinc-950 rounded-lg border border-zinc-900 text-xs font-mono-tech leading-relaxed">
                      <code>{step1Code}</code>
                    </pre>

                    <div className="text-xs font-sans-editorial text-zinc-300 space-y-1.5 pt-1">
                      <p>
                        <strong className="font-mono-tech text-yellow-400">$Escritorio</strong>: obtiene la ubicación real del Escritorio de Windows (sin importar el idioma del sistema ni rutas hardcodeadas).
                      </p>
                      <p>
                        <strong className="font-mono-tech text-yellow-400">$Archivo</strong>: guarda la ruta completa (<code className="font-mono-tech text-zinc-200">...\Desktop\EVO-LABS-MI-PC.txt</code>) que utilizaremos de forma obligatoria en los siguientes pasos.
                      </p>
                      <p className="text-zinc-400 text-[11px] italic font-mono-tech">
                        La última línea ($Archivo) imprime la ruta en consola para que compruebes que existe antes de continuar.
                      </p>
                    </div>
                  </div>

                  {/* PASO 2 // CREAR EL PASAPORTE */}
                  <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-black/60 border border-zinc-800/90">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400">
                        PASO 2 // CREAR EL ARCHIVO Y SU ENCABEZADO
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(step2Code, 'step-2')}
                        className="text-yellow-400 hover:text-white flex items-center gap-1.5 text-xs font-mono-tech cursor-pointer"
                      >
                        {copiedScript === 'step-2' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'step-2' ? 'COPIADO' : 'COPIAR PASO 2'}</span>
                      </button>
                    </div>

                    <pre className="text-zinc-200 overflow-x-auto p-3.5 bg-zinc-950 rounded-lg border border-zinc-900 text-xs font-mono-tech leading-relaxed">
                      <code>{step2Code}</code>
                    </pre>

                    <div className="text-xs font-sans-editorial text-zinc-300 space-y-1.5 pt-1">
                      <p>
                        <strong className="font-mono-tech text-white">Out-File</strong> crea y escribe el archivo limpio en la ruta indicada por <code className="font-mono-tech text-yellow-400">$Archivo</code>. En este primer comando <strong>NO</strong> usamos <code className="font-mono-tech text-zinc-200">-Append</code> porque estamos estableciendo el encabezado inicial.
                      </p>
                      <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
                        <strong className="text-yellow-400 font-mono-tech block mb-0.5">ADVERTENCIA:</strong>
                        Si volvés a ejecutar este paso más adelante, el archivo se sobreescribirá y comenzará nuevamente desde este encabezado.
                      </div>
                    </div>
                  </div>

                  {/* PASO 3 // AGREGAR EVIDENCIAS */}
                  <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-black/60 border border-zinc-800/90">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400">
                        PASO 3 // AGREGAR LAS EVIDENCIAS REGISTRADAS
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(step3Code, 'step-3')}
                        className="text-yellow-400 hover:text-white flex items-center gap-1.5 text-xs font-mono-tech cursor-pointer"
                      >
                        {copiedScript === 'step-3' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'step-3' ? 'COPIADO' : 'COPIAR PASO 3'}</span>
                      </button>
                    </div>

                    <pre className="text-zinc-200 overflow-x-auto p-3.5 bg-zinc-950 rounded-lg border border-zinc-900 text-xs font-mono-tech leading-relaxed">
                      <code>{step3Code}</code>
                    </pre>

                    <div className="text-xs font-sans-editorial text-zinc-300 space-y-1 pt-1">
                      <p>
                        El parámetro <strong className="font-mono-tech text-yellow-400">-Append</strong> agrega cada línea al final del archivo sin borrar lo anterior.
                      </p>
                      <p className="text-zinc-400 text-[11px]">
                        Las líneas se generan automáticamente a partir de los datos que registraste en los módulos anteriores. Si algún dato figura como <code className="font-mono-tech text-zinc-300">NO IDENTIFICADO</code>, podés completarlo en sus respectivas secciones o ingresarlo manualmente.
                      </p>
                    </div>
                  </div>

                  {/* PASO 4 // COMPROBAR */}
                  <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-black/60 border border-zinc-800/90">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400">
                        PASO 4 // COMPROBAR EL RESULTADO
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(step4Code, 'step-4')}
                        className="text-yellow-400 hover:text-white flex items-center gap-1.5 text-xs font-mono-tech cursor-pointer"
                      >
                        {copiedScript === 'step-4' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'step-4' ? 'COPIADO' : 'COPIAR PASO 4'}</span>
                      </button>
                    </div>

                    <pre className="text-zinc-200 overflow-x-auto p-3.5 bg-zinc-950 rounded-lg border border-zinc-900 text-xs font-mono-tech leading-relaxed">
                      <code>{step4Code}</code>
                    </pre>

                    <div className="text-xs font-sans-editorial text-zinc-300 space-y-2 pt-1">
                      <p>
                        <strong className="font-mono-tech text-white">Get-Content -Path $Archivo</strong>: lee y muestra directamente en la consola lo que quedó guardado dentro del archivo.
                      </p>
                      <p>
                        <strong className="font-mono-tech text-white">Test-Path $Archivo</strong>: comprobación lógica de Windows. Devuelve <strong className="font-mono-tech text-yellow-400">True</strong> si el archivo existe físicamente en el Escritorio, o <strong className="font-mono-tech text-red-400">False</strong> si la ruta no se encontró.
                      </p>
                      <p>
                        <strong className="font-mono-tech text-white">notepad $Archivo</strong>: abre el archivo en el Bloc de notas para corroborar su texto de manera visual.
                      </p>
                    </div>
                  </div>

                  {/* PROTECCIÓN PEDAGÓGICA // ERROR COMÚN */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-yellow-500/40 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-yellow-400 font-mono-tech font-bold uppercase">
                      <AlertTriangle className="w-4 h-4" />
                      <span>ERROR COMÚN // “FILEPATH ES NULO”</span>
                    </div>
                    <p className="font-sans-editorial text-zinc-300 leading-relaxed">
                      Si PowerShell dice que <em>“No se puede enlazar el argumento al parámetro 'FilePath' porque es nulo”</em>, significa normalmente que la variable <code className="font-mono-tech text-yellow-400">$Archivo</code> todavía no contiene una ruta definida en la sesión actual.
                    </p>
                    <div className="p-2.5 bg-black/60 rounded border border-zinc-800 text-[11px] font-mono-tech text-zinc-300">
                      <span className="text-zinc-500 block mb-1">Para comprobar el estado de la variable:</span>
                      <code>$Archivo</code>
                      <span className="text-zinc-400 block mt-1">Si no devuelve ninguna ruta, volvé a ejecutar el <strong>PASO 1</strong>.</span>
                    </div>
                  </div>

                  {/* PASO 5 // IMPORTACIÓN A EVO LABS */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-zinc-900 to-[#14151a] border border-yellow-400/60 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                        <span className="font-mono-tech text-xs uppercase font-bold text-white">
                          PASO 5 // PASAPORTE CREADO ✓ IMPORTARLO EN EVO LABS
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase bg-yellow-400 text-black font-bold">
                        SINCRONIZACIÓN LOCAL
                      </span>
                    </div>

                    <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                      Una vez generado o editado tu archivo <code className="font-mono-tech text-white">EVO-LABS-MI-PC.txt</code> o <code className="font-mono-tech text-white">EVO-LABS-MI-PC.json</code> en Windows, podés importarlo nuevamente a EVO LABS para contrastar lo que creías frente a lo que Windows reporta, y confirmar cada dato:
                    </p>

                    {/* Action button for file input */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                      <label
                        htmlFor="import-passport-input"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-400 transition-colors cursor-pointer shadow-md"
                      >
                        <Upload className="w-4 h-4" />
                        <span>IMPORTAR PASAPORTE (.JSON O .TXT)</span>
                      </label>
                      <input
                        id="import-passport-input"
                        type="file"
                        accept=".json,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <span className="text-[11px] font-mono-tech text-zinc-400">
                        Acepta formato .json estructurado o .txt de pasaporte.
                      </span>
                    </div>

                    {/* Import error notice */}
                    {importError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-mono-tech flex items-center gap-2 animate-in fade-in duration-200">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{importError}</span>
                      </div>
                    )}

                    {/* Import feedback notice */}
                    {importNotice && (
                      <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400 text-yellow-300 text-xs font-mono-tech flex items-center gap-2 animate-in fade-in duration-200">
                        <FileCheck className="w-4 h-4 shrink-0 text-yellow-400" />
                        <span>{importNotice}</span>
                      </div>
                    )}

                    {/* SECCIÓN DE CONTRASTACIÓN Y CONFIRMACIÓN DE EVIDENCIA */}
                    {comparisonsQueue.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-zinc-800 space-y-4 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/50 p-4 rounded-xl border border-zinc-800">
                          <div>
                            <span className="text-yellow-400 font-mono-tech text-xs uppercase font-bold block">
                              MÓDULO DE CONTRASTACIÓN // HIPÓTESIS VS DATOS DETECTADOS
                            </span>
                            <span className="text-zinc-400 text-[11px] font-sans-editorial">
                              Revisá las discrepancias entre lo declarado y lo reportado por Windows. Al confirmar, el dato pasará formalmente a estado <strong>CONFIRMADO</strong>.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleConfirmAll}
                            className="shrink-0 px-4 py-2 bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>CONFIRMAR TODOS</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {comparisonsQueue.map((item) => (
                            <div
                              key={item.key}
                              className={`p-4 rounded-xl border transition-all ${
                                item.confirmed
                                  ? 'bg-emerald-950/20 border-emerald-500/40'
                                  : 'bg-black/60 border-zinc-800'
                              } space-y-3`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono-tech text-xs uppercase font-bold text-white">
                                  {item.label}
                                </span>
                                <span
                                  className={`text-[9px] font-mono-tech uppercase px-2 py-0.5 rounded font-bold ${
                                    item.comparison === 'COINCIDE'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : item.comparison === 'COINCIDE PARCIALMENTE'
                                      ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                                      : item.comparison === 'DIFIERE'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : 'bg-zinc-800 text-zinc-400'
                                  }`}
                                >
                                  {item.comparison}
                                </span>
                              </div>

                              <div className="space-y-1.5 text-xs font-mono-tech">
                                <div className="p-2 rounded bg-zinc-950/70 border border-zinc-900 flex justify-between items-center">
                                  <span className="text-zinc-500 text-[10px] uppercase">Tu idea / Declarado:</span>
                                  <span className="text-zinc-200 truncate max-w-[200px]">
                                    {item.hypothesis || item.observed || 'Sin declarar'}
                                  </span>
                                </div>
                                <div className="p-2 rounded bg-yellow-400/5 border border-yellow-400/20 flex justify-between items-center">
                                  <span className="text-yellow-400/80 text-[10px] uppercase font-bold">Windows detectó:</span>
                                  <span className="text-yellow-300 font-bold truncate max-w-[200px]">
                                    {item.detected}
                                  </span>
                                </div>
                              </div>

                              {item.extraInfo && (
                                <div className="text-[11px] font-mono-tech text-zinc-400 bg-zinc-900/60 p-2 rounded border border-zinc-800/60">
                                  <span className="text-zinc-500 block text-[9px] uppercase">Detalles técnicos reportados:</span>
                                  <span className="text-zinc-300">{item.extraInfo}</span>
                                </div>
                              )}

                              <div className="pt-2 flex items-center justify-between">
                                <span className="text-[10px] font-mono-tech text-zinc-500">
                                  {item.confirmed ? '✓ Verificado y Confirmado' : 'Estado: DETECTADO (Sin confirmar)'}
                                </span>

                                <button
                                  type="button"
                                  disabled={item.confirmed}
                                  onClick={() => handleConfirmItem(item.key)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold uppercase transition-all flex items-center gap-1.5 ${
                                    item.confirmed
                                      ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                                      : 'bg-white text-black hover:bg-yellow-400 cursor-pointer shadow'
                                  }`}
                                >
                                  {item.confirmed ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>CONFIRMADO</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>CONFIRMAR ESTE DATO</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* AHORA SABÉS */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold block">
                AHORA SABÉS:
              </span>

              <ul className="space-y-2.5 text-sm font-sans-editorial text-zinc-200">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Identificar los componentes principales y su modelo real sin folletos publicitarios</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Encontrar sus datos precisos en Windows usando el Administrador de tareas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Obtener información profunda mediante consultas seguras de PowerShell</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Entender relaciones fundamentales de trabajo conjunto entre CPU, RAM, GPU y almacenamiento</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Construir una ficha técnica real y fidedigna de tu propia máquina</span>
                </li>
              </ul>
            </div>

            {/* ACTIVIDAD DE COMPROBACIÓN // COMPROBÁ LO QUE APRENDISTE */}
            <EvoChapterCheckSection
              chapterNumber="01"
              chapterTitle="CONOCÉ TU PC"
              isAlreadyCompleted={completedSections.has('tu-pc')}
              onPassCheck={() => {
                markSectionCompleted('tu-pc');
                onChapterCompleted();
              }}
            />

            {/* CLIFFHANGER // PRÓXIMO CAPÍTULO */}
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-zinc-700 bg-gradient-to-r from-zinc-900 to-black space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
                  CLIFFHANGER EDITORIAL // CONTINUAR INVESTIGACIÓN
                </span>
                <p className="font-sans-editorial text-lg sm:text-xl text-white font-medium italic leading-relaxed">
                  “Ya sabemos qué piezas tiene tu máquina. Pero tener buenas piezas no garantiza que estén trabajando bien juntas.”
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-tech uppercase tracking-wider text-zinc-400">
                    PRÓXIMO CAPÍTULO // CAPÍTULO 02
                  </span>
                  <h3 className="font-display font-bold text-xl text-white uppercase">
                    CÓMO TRABAJAN JUNTOS
                  </h3>
                  <p className="font-mono-tech text-xs text-yellow-400">
                    PREGUNTA CLAVE: ¿QUIÉN ESPERA A QUIÉN?
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-desbloquear-cap02"
                  onClick={() => {
                    markSectionCompleted('tu-pc');
                    onChapterCompleted();
                    if (onStartChapter02) onStartChapter02();
                  }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-yellow-400/20 group shrink-0"
                >
                  <span>DESBLOQUEAR CAPÍTULO 02</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* BARRA DE NAVEGACIÓN PEDAGÓGICA DEFINITIVA */}
            <EvoChapterNavigationFooter
              currentChapterNumber="01"
              currentChapterTitle="IDENTIDAD DE TU PC"
              isCompleted={completedSections.has('tu-pc')}
              onMarkCompleted={() => {
                markSectionCompleted('tu-pc');
                onChapterCompleted();
              }}
              onBackToIndex={onBackToIndex}
              onNextChapter={() => {
                markSectionCompleted('tu-pc');
                onChapterCompleted();
                if (onStartChapter02) onStartChapter02();
                else onBackToIndex();
              }}
              nextChapterLabel="CAPÍTULO 02: CÓMO TRABAJAN JUNTOS"
              isNextAvailable={true}
            />
          </div>
        )}
      </main>
    </div>
  );
};
