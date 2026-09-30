import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Check,
  X,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Terminal,
} from 'lucide-react';

export interface FinalExamQuestion {
  id: string;
  category: string;
  prompt: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const TOMO_02_FINAL_EXAM_QUESTIONS: FinalExamQuestion[] = [
  {
    id: 't02_q01',
    category: 'BOOT & ARQUITECTURA',
    prompt:
      'En una computadora con firmware UEFI nativo y tabla de partición GPT, ¿cuál es el archivo ejecutable de arranque que el firmware carga desde la partición EFI System Partition (ESP)?',
    options: [
      {
        label: 'bootmgfw.efi (Windows Boot Manager)',
        isCorrect: true,
        explanation:
          'Correcto. En UEFI GPT, el firmware ejecuta el binario firmado \\EFI\\Microsoft\\Boot\\bootmgfw.efi, quien a su vez consulta el BCD para lanzar winload.efi.',
      },
      {
        label: 'NTLDR.exe',
        isCorrect: false,
        explanation:
          'Falso. NTLDR era el cargador de arranque de Windows XP y versiones anteriores en particiones MBR arcaicas.',
      },
      {
        label: 'explorer.exe',
        isCorrect: false,
        explanation:
          'Falso. explorer.exe es el shell gráfico de usuario (Ring 3) y se ejecuta minutos después de que el kernel ya está operativo.',
      },
      {
        label: 'grub.exe',
        isCorrect: false,
        explanation:
          'Falso. GRUB es el gestor de arranque habitual de distribuciones Linux.',
      },
    ],
  },
  {
    id: 't02_q02',
    category: 'SISTEMA DE ARCHIVOS',
    prompt:
      '¿Por qué en Windows x64 la carpeta C:\\Windows\\System32 contiene ejecutables de 64 bits mientras que C:\\Windows\\SysWOW64 contiene ejecutables de 32 bits?',
    options: [
      {
        label:
          'Por compatibilidad histórica: las aplicaciones de 32 bits son redirigidas transparentemente por el subsistema "Windows on Windows 64" (SysWOW64).',
        isCorrect: true,
        explanation:
          'Exacto. Para evitar que programas legados de 32 bits que tenían la ruta hardcodeada "System32" fallaran, Windows conservó System32 para binarios nativos de la arquitectura del OS y creó SysWOW64 como capa de emulación.',
      },
      {
        label: 'Porque Microsoft cometió un error tipográfico en 2005 y nunca lo corrigió.',
        isCorrect: false,
        explanation:
          'Falso. Es una decisión de diseño de compatibilidad hacia atrás estrictamente documentada.',
      },
      {
        label: 'Porque System32 solo contiene fuentes de texto e iconos.',
        isCorrect: false,
        explanation:
          'Falso. System32 es el corazón de las librerías binarias nativas del sistema operativo.',
      },
      {
        label: 'Porque SysWOW64 almacena los archivos eliminados de la papelera.',
        isCorrect: false,
        explanation:
          'Falso. La papelera reside en la carpeta oculta $Recycle.Bin.',
      },
    ],
  },
  {
    id: 't02_q03',
    category: 'ALMACÉN WINSXS',
    prompt:
      '¿Cuál es el método oficial y seguro para purgar componentes antiguos y copias de seguridad de parches superados en la carpeta C:\\Windows\\WinSxS?',
    options: [
      {
        label: 'Ejecutar: Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase',
        isCorrect: true,
        explanation:
          'Correcto. DISM analiza los hardlinks y descarta de forma segura las versiones de componentes obsoletas superadas por parches acumulativos nuevos.',
      },
      {
        label: 'Seleccionar la carpeta WinSxS en el Explorador de Archivos y presionar Shift + Supr.',
        isCorrect: false,
        explanation:
          '¡Catastrófico! Borrar archivos a mano en WinSxS destruye el subsistema de componentes y anula para siempre la capacidad de actualizar o reparar Windows.',
      },
      {
        label: 'Usar un programa limpiador de registro gratuito de terceros.',
        isCorrect: false,
        explanation:
          'Falso. Los limpiadores de registro no tienen privilegios ni lógica para manipular el almacén Side-by-Side de Windows.',
      },
      {
        label: 'Desactivar el servicio Windows Defender.',
        isCorrect: false,
        explanation:
          'Falso. El antivirus no tiene relación con el almacenamiento de componentes.',
      },
    ],
  },
  {
    id: 't02_q04',
    category: 'DIAGNÓSTICO DE DISCO',
    prompt:
      'Un cliente llega con una notebook con SSD NVMe que muestra "100% de uso de disco" permanente en el Administrador de Tareas. ¿Cuál es el procedimiento pericial antes de declarar que el disco está roto?',
    options: [
      {
        label:
          'Abrir el Monitor de Recursos (resmon) o Process Monitor (Procmon) para identificar el proceso y ruta exacta que genera la cola de peticiones I/O en bucle.',
        isCorrect: true,
        explanation:
          'Excelente. En la inmensa mayoría de los casos no es falla de hardware, sino un servicio (como SearchIndexer reintentando un archivo corrupto o telemetría trabada) saturando la cola de I/O.',
      },
      {
        label: 'Formatear el disco de inmediato a bajo nivel.',
        isCorrect: false,
        explanation:
          'Falso. El formateo a ciegas destruye evidencia y no garantiza resolver el problema si el software causante vuelve a instalarse.',
      },
      {
        label: 'Desfragmentar el disco SSD durante 8 horas seguidas.',
        isCorrect: false,
        explanation:
          '¡Peligro! Desfragmentar por bloques un SSD NVMe desgasta innecesariamente sus celdas NAND sin ninguna ganancia de velocidad.',
      },
      {
        label: 'Cambiar el idioma de Windows a inglés.',
        isCorrect: false,
        explanation: 'Falso. El idioma de visualización no afecta el subsistema de almacenamiento.',
      },
    ],
  },
  {
    id: 't02_q05',
    category: 'GESTIÓN DE MEMORIA',
    prompt:
      '¿Por qué desactivar el archivo de paginación (Pagefile / pagefile.sys) "para que Windows use solo la RAM rápida" es una práctica desaconsejada por los ingenieros de Microsoft?',
    options: [
      {
        label:
          'Porque impide el respaldo de memoria virtual comprometida (Commit Limit), rompe volcados de cuelgues (Minidumps) y puede generar cierres forzados por Out-Of-Memory (OOM).',
        isCorrect: true,
        explanation:
          'Correcto. El Pagefile no es memoria lenta de emergencia; es el compromiso contable matemático del Administrador de Memoria. Sin él, aplicaciones que solicitan grandes cuotas de Commit crashean.',
      },
      {
        label: 'Porque el Pagefile refrigera el procesador mediante comandos ACPI.',
        isCorrect: false,
        explanation: 'Falso. El archivo de paginación es software en disco, no hardware térmico.',
      },
      {
        label: 'Porque Windows 11 no permite iniciar sesión sin un pendrive conectado.',
        isCorrect: false,
        explanation: 'Falso. No tiene ninguna relación.',
      },
      {
        label: 'Porque duplica el consumo eléctrico de la fuente de poder.',
        isCorrect: false,
        explanation: 'Falso. El consumo de energía no depende de la existencia del Pagefile.',
      },
    ],
  },
  {
    id: 't02_q06',
    category: 'LATENCIA & AUDIO',
    prompt:
      'En una PC para producción musical o gaming competitivo que sufre micro-cortes de audio y saltos de frames, ¿qué herramienta y métrica permiten aislar el controlador culpable?',
    options: [
      {
        label:
          'LatencyMon, midiendo la latencia de Deferred Procedure Calls (DPCs) e Interrupt Service Routines (ISRs) por controlador (.sys).',
        isCorrect: true,
        explanation:
          '¡Exacto! Controladores deficientes de Wi-Fi, Ethernet o energía que retienen la CPU con DPCs superiores a 1.000 µs son la causa número uno de microcortes en Windows.',
      },
      {
        label: 'El reproductor de Windows Media ajustando el ecualizador gráfico.',
        isCorrect: false,
        explanation: 'Falso. El ecualizador no mide latencias del kernel.',
      },
      {
        label: 'El comando ping 127.0.0.1 ejecutado 100 veces.',
        isCorrect: false,
        explanation:
          'Falso. El ping solo mide la latencia de la pila de red local IP, no la latencia de interrupciones de hardware.',
      },
      {
        label: 'Aumentar el brillo del monitor.',
        isCorrect: false,
        explanation: 'Falso. No tiene ninguna relación técnica.',
      },
    ],
  },
  {
    id: 't02_q07',
    category: 'SUBSISTEMA DE KERNEL',
    prompt:
      '¿Cuál es la diferencia fundamental entre el espacio de usuario (User Mode / Ring 3) y el espacio de núcleo (Kernel Mode / Ring 0)?',
    options: [
      {
        label:
          'Ring 0 tiene acceso irrestricto a todo el hardware y memoria física; Ring 3 está aislado y si un proceso falla, no arrastra al sistema completo.',
        isCorrect: true,
        explanation:
          'Correcto. Las apps de usuario (navegadores, juegos) corren en Ring 3. Los controladores (.sys) y el kernel (ntoskrnl.exe) corren en Ring 0; un fallo en Ring 0 desencadena una pantalla azul (BSOD).',
      },
      {
        label: 'Ring 0 es solo para computadoras portátiles y Ring 3 para servidores.',
        isCorrect: false,
        explanation: 'Falso. La arquitectura de anillos x86/x64 existe en toda CPU moderna.',
      },
      {
        label: 'Ring 3 solo funciona cuando la computadora no está conectada a internet.',
        isCorrect: false,
        explanation: 'Falso. La conectividad no altera los niveles de privilegio del procesador.',
      },
      {
        label: 'Ring 0 es un protocolo de cifrado para contraseñas de Wi-Fi.',
        isCorrect: false,
        explanation: 'Falso. Confunde anillos de privilegio con protocolos criptográficos.',
      },
    ],
  },
  {
    id: 't02_q08',
    category: 'MANTENIMIENTO & REPARACIÓN',
    prompt:
      'Cuando un sistema presenta archivos de sistema dañados, ¿por qué la regla técnica EVO exige ejecutar DISM antes que SFC?',
    options: [
      {
        label:
          'Porque DISM repara la imagen del almacén local de componentes; luego SFC utiliza ese almacén sano para reemplazar los archivos dañados en el disco.',
        isCorrect: true,
        explanation:
          '¡Excelente! Si ejecutas primero sfc /scannow con la biblioteca local corrupta, el comando dirá que encontró archivos corruptos pero no pudo repararlos por falta de una fuente sana.',
      },
      {
        label: 'Porque DISM borra todos los virus automáticamente.',
        isCorrect: false,
        explanation: 'Falso. DISM es una herramienta de gestión de imágenes, no un antivirus.',
      },
      {
        label: 'Porque SFC requiere conexión a internet y DISM funciona solo offline.',
        isCorrect: false,
        explanation:
          'Falso. Al revés: DISM /Online /Cleanup-Image /RestoreHealth se conecta a Windows Update para descargar componentes sanos.',
      },
      {
        label: 'Porque el orden alfabético de los comandos así lo exige en la consola.',
        isCorrect: false,
        explanation: 'Falso. No tiene ninguna relación con el abecedario.',
      },
    ],
  },
  {
    id: 't02_q09',
    category: 'TELEMETRÍA & DEBLOATERS',
    prompt:
      '¿Cuál es el peligro de descargar scripts masivos de "Windows Debloater" desde foros o videos de YouTube?',
    options: [
      {
        label:
          'Eliminan dependencias del Microsoft Store, desactivan servicios de red compartida y provocan fallos catastróficos en futuras actualizaciones mensuales de seguridad.',
        isCorrect: true,
        explanation:
          'Correcto. La mayoría de los debloaters aplican cambios a ciegas sin documentar reversibilidad, quebrando subsistemas de autenticación, Bluetooth o impresión.',
      },
      {
        label: 'Hacen que la tarjeta gráfica pierda soporte para resoluciones Full HD.',
        isCorrect: false,
        explanation: 'Falso. Los debloaters no modifican las resoluciones EDID de la pantalla.',
      },
      {
        label: 'Obligan a pagar una suscripción mensual a Microsoft.',
        isCorrect: false,
        explanation: 'Falso. No alteran el modelo de licenciamiento.',
      },
      {
        label: 'Aceleran la computadora un 500% sin ningún efecto secundario.',
        isCorrect: false,
        explanation:
          'Falso. Es el argumento comercial falaz que desmiente la metodología pericial.',
      },
    ],
  },
  {
    id: 't02_q10',
    category: 'RECUPERACIÓN FORENSE',
    prompt:
      'Si tras una actualización fallida Windows entra en bucle de recuperación con el error "0xc000000f - The Boot Configuration Data for your PC is missing or contains errors", ¿cuál es el comando pericial para regenerar el BCD en partición EFI?',
    options: [
      {
        label: 'bcdboot C:\\Windows /s S: /f UEFI (asignando previamente la letra S: a la partición ESP)',
        isCorrect: true,
        explanation:
          '¡Perfecto! El comando bcdboot extrae los archivos de arranque de la instalación sana de Windows en C: y los copia a la partición del sistema UEFI (S:) reconstruyendo el almacén BCD desde cero.',
      },
      {
        label: 'format C: /q /y',
        isCorrect: false,
        explanation: '¡Catastrófico! Ese comando formatearía toda la unidad borrando el sistema y datos.',
      },
      {
        label: 'ipconfig /release',
        isCorrect: false,
        explanation: 'Falso. ipconfig solo libera la dirección IP en la tarjeta de red.',
      },
      {
        label: 'net user Administrator /active:no',
        isCorrect: false,
        explanation: 'Falso. Desactiva la cuenta de administrador pero no repara el arranque.',
      },
    ],
  },
];

interface EvoTomo02FinalExamProps {
  onBackToIndex: () => void;
  onCompleteExam: (score: number, total: number) => void;
  onGoToModule?: (moduleIndex: number) => void;
}

export const EvoTomo02FinalExam: React.FC<EvoTomo02FinalExamProps> = ({
  onBackToIndex,
  onCompleteExam,
  onGoToModule,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const totalQuestions = TOMO_02_FINAL_EXAM_QUESTIONS.length;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === totalQuestions;

  const calculateScore = () => {
    let score = 0;
    TOMO_02_FINAL_EXAM_QUESTIONS.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        score++;
      }
    });
    return score;
  };

  const currentScore = calculateScore();
  const isPassed = currentScore >= 7; // 70% threshold

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isPassed) {
      try {
        localStorage.setItem('evo_tomo02_completed', 'true');
        localStorage.setItem('evo_tomo02_exam_score', String(currentScore));
      } catch {
        // ignore
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 font-sans-editorial space-y-8">
      {/* Top Breadcrumb Nav */}
      <nav className="flex items-center justify-between pb-4 border-b border-cyan-950 font-mono-tech text-xs">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>← VOLVER AL ÍNDICE DEL TOMO 02</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-zinc-500 uppercase tracking-widest hidden sm:inline">
            EVALUACIÓN PERICIAL
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-extrabold text-[11px]">
            10 PREGUNTAS
          </span>
        </div>
      </nav>

      {/* Header Banner */}
      <header className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#0a1120] to-[#060a14] border-2 border-cyan-500/50 space-y-3 shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase tracking-widest">
          <Award className="w-5 h-5 text-cyan-400" />
          <span>CERTIFICACIÓN DE KERNEL & SISTEMA OPERATIVO</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
          PRUEBA FINAL // LA BIBLIA NEGRA
        </h1>

        <p className="text-zinc-300 font-sans-editorial text-sm sm:text-base max-w-2xl leading-relaxed">
          Poné a prueba tu comprensión de la arquitectura de Windows NT.
          Cada pregunta evalúa situaciones reales de taller: desde el arranque UEFI y el BCD hasta la memoria virtual, DPCs de audio y recuperación metódica.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-tech text-cyan-300">
          <span>• Aprobación: <strong>7 / 10 correctas (70%)</strong></span>
          <span>• Sin límite de tiempo</span>
          <span>• Justificación pericial en cada respuesta</span>
        </div>
      </header>

      {/* Progress Counter Bar */}
      <div className="flex items-center justify-between text-xs font-mono-tech px-2">
        <span className="text-zinc-400">
          Respondidas: <strong className="text-white">{answeredCount}</strong> de {totalQuestions}
        </span>
        <div className="w-48 h-2 rounded-full bg-zinc-900 border border-cyan-950 overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions Stream */}
      <div className="space-y-6">
        {TOMO_02_FINAL_EXAM_QUESTIONS.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all ${
                isSubmitted
                  ? q.options[selectedOption]?.isCorrect
                    ? 'bg-[#081318] border-emerald-500/50'
                    : 'bg-[#180a0e] border-rose-500/50'
                  : 'bg-[#090D15] border-cyan-950'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-3 text-xs font-mono-tech mb-2">
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-cyan-950 text-cyan-400 font-bold text-[10px]">
                  PREGUNTA {String(qIndex + 1).padStart(2, '0')} // {q.category}
                </span>

                {isSubmitted && (
                  <span
                    className={`font-bold text-[11px] uppercase flex items-center gap-1 ${
                      q.options[selectedOption]?.isCorrect
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {q.options[selectedOption]?.isCorrect ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        CORRECTA
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        INCORRECTA
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Prompt */}
              <h3 className="text-white font-bold text-base sm:text-lg mb-4 font-sans-editorial leading-snug">
                {q.prompt}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm font-sans-editorial leading-relaxed ${
                        isSubmitted
                          ? opt.isCorrect
                            ? 'bg-emerald-950/70 border-emerald-400 text-white font-semibold'
                            : isSelected
                            ? 'bg-rose-950/70 border-rose-400 text-white line-through'
                            : 'bg-zinc-950/40 border-zinc-900 text-zinc-500'
                          : isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 text-white font-medium'
                          : 'bg-zinc-950/80 border-cyan-950 hover:border-cyan-500/50 text-zinc-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-cyan-400 text-black'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="flex-1">{opt.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation once submitted */}
              {isSubmitted && selectedOption !== undefined && (
                <div
                  className={`mt-4 p-4 rounded-xl border text-xs font-mono-tech space-y-1 ${
                    q.options[selectedOption]?.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <strong className="block font-bold uppercase">
                    FUNDAMENTO PERICIAL:
                  </strong>
                  <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
                    {q.options[selectedOption]?.explanation ||
                      q.options.find((o) => o.isCorrect)?.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission & Results Bar */}
      <footer className="sticky bottom-6 z-20 p-5 rounded-2xl bg-[#090D17]/95 backdrop-blur-md border-2 border-cyan-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-xs">
        <div>
          {isSubmitted ? (
            <div className="flex items-center gap-3">
              <span
                className={`text-lg font-black ${
                  isPassed ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                PUNTUACIÓN: {currentScore} / {totalQuestions}
              </span>
              <span className="text-zinc-400">
                ({Math.round((currentScore / totalQuestions) * 100)}% -{' '}
                {isPassed ? 'APROBADO' : 'NO ALCANZÓ EL 70%'})
              </span>
            </div>
          ) : (
            <div className="text-zinc-400">
              {isAllAnswered ? (
                <span className="text-cyan-400 font-bold">
                  ✓ Todas las preguntas han sido respondidas.
                </span>
              ) : (
                <span>Faltan responder {totalQuestions - answeredCount} preguntas.</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isSubmitted ? (
            <>
              {!isPassed && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>REINTENTAR PRUEBA</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onCompleteExam(currentScore, totalQuestions)}
                className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none"
              >
                <span>VER CIERRE Y LABORATORIO MATRIX →</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!isAllAnswered}
              onClick={handleSubmit}
              className={`px-8 py-3.5 rounded-xl font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto ${
                isAllAnswered
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_20px_rgba(0,210,255,0.4)]'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span>CORREGIR Y FINALIZAR EXAMEN</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
