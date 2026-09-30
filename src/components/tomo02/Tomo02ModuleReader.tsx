import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  Copy,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  X,
  Sparkles,
  Layers,
  BookOpen,
  Award,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { TOMO_02_MODULES, TomoModuleItem, TOMO_02_META } from '../../data/tomo02Data';

interface Tomo02ModuleReaderProps {
  moduleIndex: number;
  onBackToIndex: () => void;
  onSelectModule: (index: number) => void;
  onMarkCompleted: (moduleId: string) => void;
  isCompleted: boolean;
  onFinishTomo: () => void;
}

// Module-specific interactive check questions
interface CheckQuestion {
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const MODULE_QUESTIONS: Record<string, CheckQuestion> = {
  m00: {
    question: '¿Por qué la metodología EVO exige registrar un baseline métrico antes de aplicar cualquier ajuste a Windows?',
    options: [
      {
        label: 'Porque sin métricas previas verificables, cualquier sensación de mejora es mero efecto placebo.',
        isCorrect: true,
        explanation: 'Exacto: la metrología empírica compara tiempos de arranque, latencia DPC y consumo de Commit antes y después de cada cambio.',
      },
      {
        label: 'Para asegurar que Windows Update no descargue más parches.',
        isCorrect: false,
        explanation: 'Falso: el baseline no interrumpe Windows Update, sino que documenta el estado del sistema.',
      },
      {
        label: 'Porque Windows formatea automáticamente el disco si no hay una bitácora.',
        isCorrect: false,
        explanation: 'Falso: Windows no requiere bitácoras obligatorias; es una disciplina profesional del técnico.',
      },
    ],
  },
  m01: {
    question: '¿Cuál es el rol de la partición EFI System Partition (ESP) en un arranque moderno UEFI?',
    options: [
      {
        label: 'Albergar el archivo bootmgfw.efi y la configuración BCD leída por el firmware.',
        isCorrect: true,
        explanation: 'Correcto: la partición FAT32 de 100MB contiene los cargadores de arranque firmados criptográficamente que UEFI ejecuta.',
      },
      {
        label: 'Guardar la memoria swap de las aplicaciones en segundo plano.',
        isCorrect: false,
        explanation: 'Falso: la memoria swap/virtual se gestiona mediante pagefile.sys en la partición principal de Windows.',
      },
      {
        label: 'Almacenar copias de seguridad de los juegos instalados.',
        isCorrect: false,
        explanation: 'Falso: la partición ESP mide solo 100MB y está restringida a binarios de booteo.',
      },
    ],
  },
  m03: {
    question: '¿Qué diferencia crucial existe entre las carpetas C:\\Windows\\System32 y C:\\Windows\\SysWOW64?',
    options: [
      {
        label: 'System32 aloja ejecutables y DLLs nativas de 64 bits, mientras que SysWOW64 aloja librerías de 32 bits.',
        isCorrect: true,
        explanation: '¡Excelente! A pesar de su nombre, SysWOW64 significa "Windows 32-bit on Windows 64-bit" y provee compatibilidad con software legado de 32 bits.',
      },
      {
        label: 'System32 solo se usa en Windows 7 y SysWOW64 en Windows 11.',
        isCorrect: false,
        explanation: 'Falso: ambos existen juntos en todos los sistemas operativos Windows de 64 bits desde Windows XP x64.',
      },
      {
        label: 'SysWOW64 es una carpeta de virus que debe eliminarse de inmediato.',
        isCorrect: false,
        explanation: '¡Peligro! Borrar SysWOW64 rompería todas las aplicaciones e instaladores de 32 bits del equipo.',
      },
    ],
  },
  m06: {
    question: '¿Qué ocurre si un operador finaliza por la fuerza el proceso del sistema csrss.exe o wininit.exe?',
    options: [
      {
        label: 'El kernel de Windows detiene la CPU de inmediato con una pantalla azul (BSOD) CRITICAL_PROCESS_DIED para proteger la integridad del sistema.',
        isCorrect: true,
        explanation: 'Correcto: csrss y wininit son subsistemas esenciales del kernel; su muerte provoca un pánico de kernel instantáneo.',
      },
      {
        label: 'La computadora consume un 50% menos de memoria RAM de forma permanente.',
        isCorrect: false,
        explanation: 'Falso: finalizar estos procesos cuelga el equipo en el milisegundo en que se envía la señal.',
      },
      {
        label: 'Windows se reinicia suavemente en modo seguro.',
        isCorrect: false,
        explanation: 'Falso: no hay reinicio suave, ocurre un kernel panic directo.',
      },
    ],
  },
  m07: {
    question: '¿Por qué la creencia de que "la RAM libre es la mejor RAM" es un mito desmentido por la telemetría?',
    options: [
      {
        label: 'Porque Windows utiliza la memoria no ocupada como caché Standby predictivo; si una app la necesita, se desaloja en nanosegundos.',
        isCorrect: true,
        explanation: '¡Exacto! Memoria RAM vacía es silicio eléctrico desaprovechado. Windows mantiene archivos frecuentes en caché de memoria para acelerar su lectura.',
      },
      {
        label: 'Porque la RAM libre calienta más los circuitos integrados de la placa.',
        isCorrect: false,
        explanation: 'Falso: el calor disipado depende de las transiciones de reloj y voltajes, no del contenido lógico de las celdas.',
      },
      {
        label: 'Porque desactivar la RAM hace que el disco NVMe funcione el doble de rápido.',
        isCorrect: false,
        explanation: 'Falso: la RAM es órdenes de magnitud más veloz que cualquier disco NVMe.',
      },
    ],
  },
  m12: {
    question: 'En un equipo con disco SSD NVMe de alta velocidad, ¿por qué NO se recomienda desactivar el servicio SysMain a ciegas?',
    options: [
      {
        label: 'Porque en SSDs no produce sobrecarga de disco y asiste a la precarga inteligente en memoria de aplicaciones frecuentes.',
        isCorrect: true,
        explanation: 'Correcto: SysMain solo generaba cuellos de botella en discos mecánicos HDD antiguos (100% de uso de disco). En SSDs modernos su impacto en I/O es insignificante.',
      },
      {
        label: 'Porque SysMain contiene el antivirus de Windows Defender.',
        isCorrect: false,
        explanation: 'Falso: Defender corre en su propio servicio WinDefend bajo MsMpEng.exe.',
      },
      {
        label: 'Porque desactivarlo borra los controladores de la tarjeta gráfica.',
        isCorrect: false,
        explanation: 'Falso: SysMain no tiene relación con el subsistema de controladores de video.',
      },
    ],
  },
  m15: {
    question: '¿Cuál es el procedimiento obligatorio del método EVO antes de editar cualquier clave en el Registro de Windows?',
    options: [
      {
        label: 'Exportar la rama o clave modificada a un archivo .reg de respaldo para garantizar rollback inmediato con doble clic.',
        isCorrect: true,
        explanation: 'Excelente: la reversibilidad documentada es la regla de oro de la Academia EVO.',
      },
      {
        label: 'Formatear una unidad USB en formato FAT16.',
        isCorrect: false,
        explanation: 'Falso: no tiene relación alguna con la edición de claves de Registro.',
      },
      {
        label: 'Descargar un optimizador de registro de internet.',
        isCorrect: false,
        explanation: '¡Peligro! Los limpiadores de registro automatizados son una de las causas más frecuentes de rotura de dependencias en Windows.',
      },
    ],
  },
  m17: {
    question: '¿Cuál es el orden estricto de saneamiento de archivos del sistema y por qué?',
    options: [
      {
        label: 'Primero DISM /Online /Cleanup-Image /RestoreHealth y luego sfc /scannow, porque DISM repara la biblioteca local con la que luego SFC repara el disco.',
        isCorrect: true,
        explanation: '¡Perfecto! Si ejecutás SFC con la biblioteca de componentes local dañada, SFC no tendrá de dónde extraer los archivos sanos.',
      },
      {
        label: 'Primero SFC y nunca usar DISM porque DISM borra las fotos personales.',
        isCorrect: false,
        explanation: 'Falso: DISM solo repara el almacén de componentes de Windows y no toca datos personales.',
      },
      {
        label: 'Ejecutar chkdsk 10 veces seguidas antes de encender la pantalla.',
        isCorrect: false,
        explanation: 'Falso: chkdsk verifica la estructura del sistema de archivos NTFS, no la integridad de los binarios del kernel.',
      },
    ],
  },
};

// Fallback generic question for modules without explicit entry
const getFallbackQuestion = (mod: TomoModuleItem): CheckQuestion => ({
  question: `Respecto a "${mod.title}": ¿Cuál es la directiva fundamental del método EVO para este componente?`,
  options: [
    {
      label: `Medir la línea base con herramientas nativas y aplicar solo cambios con reversibilidad documentada.`,
      isCorrect: true,
      explanation: `Correcto: en ${mod.title}, todo ajuste debe verificarse con telemetría objetiva sin recurrir a recetas ciegas.`,
    },
    {
      label: 'Desactivar todo lo que no se use para tener la mayor cantidad de memoria libre.',
      isCorrect: false,
      explanation: 'Falso: desactivar servicios o funciones a ciegas degrada la estabilidad y rompe dependencias críticas.',
    },
    {
      label: 'Borrar los archivos temporales cada 5 minutos mediante un script en bucle.',
      isCorrect: false,
      explanation: 'Falso: los archivos temporales en uso bloquean procesos y borrarlos en bucle desgasta el controlador del SSD.',
    },
  ],
});

export const Tomo02ModuleReader: React.FC<Tomo02ModuleReaderProps> = ({
  moduleIndex,
  onBackToIndex,
  onSelectModule,
  onMarkCompleted,
  isCompleted,
  onFinishTomo,
}) => {
  const currentMod = TOMO_02_MODULES[moduleIndex] || TOMO_02_MODULES[0];
  const totalModules = TOMO_02_MODULES.length;
  const isFirst = moduleIndex === 0;
  const isLast = moduleIndex === totalModules - 1;

  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState<boolean>(false);

  const checkQ = MODULE_QUESTIONS[currentMod.id] || getFallbackQuestion(currentMod);

  const handleCopy = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedSnippet(code);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  const handleOptionSelect = (idx: number) => {
    setSelectedOption(idx);
    setHasCheckedAnswer(true);
    if (checkQ.options[idx].isCorrect && !isCompleted) {
      onMarkCompleted(currentMod.id);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onFinishTomo();
    } else {
      setSelectedOption(null);
      setHasCheckedAnswer(false);
      onSelectModule(moduleIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setSelectedOption(null);
      setHasCheckedAnswer(false);
      onSelectModule(moduleIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <article className="w-full min-h-screen py-6 sm:py-8 lg:py-12 max-w-4xl mx-auto px-4 sm:px-6 font-sans-editorial">
      {/* Top Sticky Navigation Bar */}
      <nav className="sticky top-14 z-30 bg-[#06080E]/95 backdrop-blur-md border border-cyan-950/80 rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 flex items-center justify-between gap-4 font-mono-tech text-xs shadow-xl">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">← ÍNDICE DEL TOMO</span>
          <span className="sm:hidden">← ÍNDICE</span>
        </button>

        <div className="flex items-center gap-2 text-zinc-400 text-[11px] truncate">
          <span className="text-cyan-400 font-bold">MÓDULO {currentMod.moduleNumber}</span>
          <span className="text-zinc-600">/</span>
          <span className="truncate hidden md:inline text-white">{currentMod.title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold">
              <Check className="w-3 h-3" />
              <span>TERMINADO</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onMarkCompleted(currentMod.id)}
              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all cursor-pointer"
            >
              MARCAR TERMINADO
            </button>
          )}
        </div>
      </nav>

      {/* Main Module Content Card */}
      <div className="bg-[#090D15] border border-cyan-950 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        {/* Module Header */}
        <header className="space-y-3 border-b border-cyan-950/80 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-800 text-cyan-300 font-bold text-[10px] uppercase">
                {currentMod.categoryTag}
              </span>
              <span className="text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {currentMod.readTime}
              </span>
            </div>

            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold ${
                (currentMod.safetyBadge || 'VERDE') === 'VERDE'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : currentMod.safetyBadge === 'AMARILLO'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              SEGURIDAD: {currentMod.safetyBadge || 'VERDE'}
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight uppercase leading-[0.95]">
            <span className="text-cyan-400 block text-lg sm:text-xl font-mono-tech mb-1">
              MÓDULO {currentMod.moduleNumber}
            </span>
            {currentMod.title}
          </h1>

          <p className="font-sans-editorial text-base sm:text-lg text-cyan-200/90 leading-relaxed italic">
            {currentMod.subtitle}
          </p>
        </header>

        {/* Narrative & Forensic Goal */}
        <section className="space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-cyan-950 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>OBJETIVO FORENSE DE LA INVESTIGACIÓN</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans-editorial">
              {currentMod.forensicGoal || currentMod.summary}
            </p>
          </div>

          {/* Decision Tree or Scientific finding */}
          {currentMod.decisionTree ? (
            <div className="p-5 rounded-2xl bg-black/60 border border-cyan-900/60 font-mono-tech space-y-3">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">
                ÁRBOL DEDUCTIVO // CRITERIO TÉCNICO
              </span>
              <div className="text-white font-semibold text-sm">
                ❓ {currentMod.decisionTree.question}
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-emerald-950/30 border-l-4 border-emerald-500 text-emerald-300">
                  <strong className="block text-emerald-400 font-bold mb-0.5">✔ SÍ:</strong>
                  {currentMod.decisionTree.yesAction}
                </div>
                <div className="p-3 rounded-lg bg-amber-950/30 border-l-4 border-amber-500 text-amber-300">
                  <strong className="block text-amber-400 font-bold mb-0.5">✖ NO:</strong>
                  {currentMod.decisionTree.noAction}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-black/60 border border-cyan-900/60 font-mono-tech space-y-2">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">
                HALLAZGO CIENTÍFICO / EVIDENCIA DE KERNEL
              </span>
              <p className="text-xs sm:text-sm text-cyan-200 leading-relaxed">
                {currentMod.scientificFact || currentMod.summary}
              </p>
            </div>
          )}
        </section>

        {/* PowerShell / Command Inspection Terminal */}
        <section className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400 px-1">
            <span className="flex items-center gap-1.5 font-bold uppercase">
              <Terminal className="w-4 h-4" />
              <span>COMANDO DE AUDITORÍA POWERSHELL / TERMINAL</span>
            </span>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  currentMod.powershellCommand ||
                    currentMod.forensicCommand ||
                    currentMod.practicalCommand ||
                    ''
                )
              }
              className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
            >
              {copiedSnippet ===
              (currentMod.powershellCommand ||
                currentMod.forensicCommand ||
                currentMod.practicalCommand ||
                '') ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIADO</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPIAR</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-black/90 font-mono-tech text-xs sm:text-sm text-cyan-300 border border-cyan-900/80 overflow-x-auto select-all">
            <code>
              {currentMod.powershellCommand ||
                currentMod.forensicCommand ||
                currentMod.practicalCommand ||
                '# Auditoría nativa de Windows'}
            </code>
          </pre>
        </section>

        {/* Reversibility & False Positives */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-emerald-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono-tech font-bold text-xs uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>REGLA DE REVERSIBILIDAD</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              {currentMod.reversibility ||
                currentMod.scientificFact ||
                'Cambio documentado y reversible con comando nativo o restauración de clave .reg.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono-tech font-bold text-xs uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>FALSO POSITIVO DE INTERNET</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              {currentMod.falsePositive ||
                currentMod.warningNotice ||
                'Evitar aplicar recetas sin medir el impacto antes en tu propio equipo.'}
            </p>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="p-5 rounded-2xl bg-black/50 border border-cyan-950 space-y-3 font-mono-tech text-xs">
          <span className="text-cyan-400 font-bold uppercase tracking-wider block">
            CONCLUSIONES CLAVE PARA EL TÉCNICO:
          </span>
          <div className="space-y-2">
            {currentMod.keyTakeaways.map((kt, i) => (
              <div key={i} className="flex items-start gap-2 text-zinc-300">
                <span className="text-cyan-400 font-bold">▸</span>
                <span className="leading-relaxed font-sans-editorial text-xs sm:text-sm">
                  {kt}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Check Section: "Comprobá lo que aprendiste" */}
        <section className="p-6 rounded-2xl bg-gradient-to-b from-[#0a1120] to-[#060a14] border-2 border-cyan-500/50 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>COMPROBÁ LO QUE APRENDISTE</span>
          </div>

          <h3 className="font-display font-bold text-base sm:text-lg text-white">
            {checkQ.question}
          </h3>

          <div className="space-y-2.5">
            {checkQ.options.map((opt, optIdx) => {
              const isChosen = selectedOption === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleOptionSelect(optIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer font-sans-editorial text-xs sm:text-sm leading-relaxed ${
                    isChosen
                      ? opt.isCorrect
                        ? 'bg-emerald-950/60 border-emerald-400 text-white'
                        : 'bg-rose-950/60 border-rose-400 text-white'
                      : 'bg-zinc-950/80 border-cyan-950 hover:border-cyan-500/50 text-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 mt-0.5 ${
                        isChosen
                          ? opt.isCorrect
                            ? 'bg-emerald-400 text-black'
                            : 'bg-rose-400 text-black'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Card */}
          {hasCheckedAnswer && selectedOption !== null && (
            <div
              className={`p-4 rounded-xl border text-xs font-mono-tech space-y-1.5 animate-in fade-in duration-200 ${
                checkQ.options[selectedOption].isCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/60 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold uppercase">
                {checkQ.options[selectedOption].isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡RESPUESTA CORRECTA!</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-rose-400" />
                    <span>RESPUESTA INCORRECTA</span>
                  </>
                )}
              </div>
              <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                {checkQ.options[selectedOption].explanation}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Bottom Chapter Navigation Bar */}
      <footer className="mt-8 pt-6 border-t border-cyan-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono-tech text-xs">
        <div>
          {!isFirst ? (
            <button
              type="button"
              onClick={handlePrev}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-cyan-950 hover:border-cyan-400 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← MÓDULO ANTERIOR</span>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => onMarkCompleted(currentMod.id)}
            className={`px-5 py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                : 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'MÓDULO TERMINADO ✓' : 'MARCAR COMO TERMINADO'}</span>
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLast ? 'FINALIZAR TOMO 02 →' : 'SIGUIENTE MÓDULO →'}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </footer>
    </article>
  );
};
