// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 29: DPC / ISR / STUTTERING
// "El tirón de 50 milisegundos"

export type RiskLevelSector29 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector29Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector29;
  descubri: {
    hook: string;
    mythVsTruth: {
      mentira: string;
      verdad: string;
      comprobalo: string;
    };
  };
  entende: {
    queEs: string;
    paraQueSirve: string;
    quePasaSiFalta: string;
  };
  interactua: {
    cliExample: string;
    psExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    technicalMetrics: string;
  };
  alertaEVO: {
    reversibilityRule: string;
    safetyWarning: string;
  };
  evidenceBadge: {
    code: string;
    label: string;
  };
}

export interface Sector29MiniCase {
  id: string;
  code: string;
  title: string;
  scenario: string;
  userStatement: string;
  initialMistake: string;
  diagnosticQuestion: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  technicalVerdict: string;
  lessonLearned: string;
}

export interface Sector29TestQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
}

export const SECTOR_29_INVESTIGATIONS: Sector29Investigation[] = [
  {
    id: "inv-29-01",
    code: "29.01",
    title: "Interrupts",
    subtitle: "Líneas IRQ, interrupciones hardware y MSI/MSI-X",
    targetMechanism: "Hardware Interrupt Subsystem & APIC Architecture",
    targetComponent: "Message Signaled Interrupts (MSI-X) / hal.dll",
    commandName: "Get-PnpDeviceProperty -KeyName 'DEVPKEY_Device_InterruptVector'",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando una tarjeta de red o GPU comparte la misma línea de interrupción física (Line-Based IRQ) con otros dispositivos, la CPU pierde cientos de ciclos deduciendo quién llamó?",
      mythVsTruth: {
        mentira: "Las interrupciones en Windows 11 son idénticas a las viejas IRQs de los años 90 con puentes ISA.",
        verdad: "Los dispositivos modernos usan MSI / MSI-X: escriben paquetes de datos directamente en el bus PCIe mapeado en memoria, eliminando la contención de pines físicos.",
        comprobalo: "Verificá en el Administrador de Dispositivos que adaptadores clave tengan valores de IRQ negativos en modo MSI."
      }
    },
    entende: {
      queEs: "La señal eléctrica o mensaje en bus que suspende momentáneamente la ejecución de la CPU para procesar eventos externos de entrada/salida.",
      paraQueSirve: "Permitir que el mouse, el teclado, el disco y la red interactúen en tiempo real sin requerir que la CPU gaste ciclos sondeando en un bucle continuo.",
      quePasaSiFalta: "El hardware quedaría ciego ante eventos externos o sufriría una latencia monstruosa por polling ineficiente."
    },
    interactua: {
      cliExample: "wmic sysdriver get caption, state",
      psExample: "Get-CimInstance Win32_PnPEntity | Where-Object { $_.Service -match 'nvlddmkm|ndis|storahci' } | Select-Object Name, Service, Status",
      syntaxBreakdown: "Lista los servicios de controladores encargados de procesar interrupciones críticas en el kernel.",
      whatToLookFor: "Controladores de almacenamiento y gráficos con estado OK sin flags de conflicto de recursos.",
      technicalMetrics: "Latencia de disparo de interrupción APIC: típicamente < 5 microsegundos sobre carril PCIe Gen 4/5."
    },
    alertaEVO: {
      reversibilityRule: "Inspección pasiva de entidades PnP.",
      safetyWarning: "No uses 'MSI Utility' para forzar MSI-X en drivers antiguos sin soporte oficial; podés provocar inestabilidad de arranque."
    },
    evidenceBadge: {
      code: "EVO-2901-INTRPT",
      label: "Interrupt Subsystem Architecture"
    }
  },
  {
    id: "inv-29-02",
    code: "29.02",
    title: "ISR",
    subtitle: "Interrupt Service Routine en DIRQL y la premura de atención inmediata",
    targetMechanism: "Interrupt Service Routine Handling (DIRQL Level 3-11)",
    targetComponent: "HAL Interrupt Dispatch Table / KeSynchronizeExecution",
    commandName: "typeperf \"\\\\Processor Information(_Total)\\\\Interrupts/sec\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que una rutina ISR tiene estrictamente prohibido hacer cálculos pesados o mover datos y solo debe apagar la señal del hardware y encolar una DPC?",
      mythVsTruth: {
        mentira: "El driver procesa todo el paquete de datos de red dentro de su rutina de interrupción.",
        verdad: "La ISR debe durar menos de 25 microsegundos: reconoce la interrupción del hardware, pide que no siga gritando, encola un DPC y sale.",
        comprobalo: "Observá con Performance Monitor el contador Interrupts/sec y comparalo con DPCs Queued/sec."
      }
    },
    entende: {
      queEs: "La primera porción de código de un controlador que se ejecuta en respuesta directa a una interrupción física, operando en DIRQL.",
      paraQueSirve: "Reconocer la solicitud del periférico de inmediato para liberar la línea de interrupción y no bloquear a otros dispositivos.",
      quePasaSiFalta: "Si un driver pasa más de 100 microsegundos en su ISR, la CPU no puede atender el reloj del sistema, provocando saltos de audio y tartamudeos."
    },
    interactua: {
      cliExample: "typeperf \"\\\\Processor Information(_Total)\\\\Interrupts/sec\" -sc 5",
      psExample: "(Get-Counter -Counter '\Processor Information(_Total)\Interrupts/sec').CounterSamples | Select-Object CookedValue",
      syntaxBreakdown: "Mide la tasa de interrupciones de hardware atendidas por segundo a través de todos los núcleos lógicos.",
      whatToLookFor: "Valores promedio en reposo entre 1.000 y 15.000/seg; picos continuos por encima de 60.000/seg indican drivers con tormentas de interrupciones (Interrupt Storm).",
      technicalMetrics: "Presupuesto de ejecución de una ISR: recomendación oficial de Microsoft < 25 µs (máximo absoluto 100 µs)."
    },
    alertaEVO: {
      reversibilityRule: "Monitoreo en tiempo real de contadores de rendimiento.",
      safetyWarning: "Tormentas de interrupciones causadas por puertos USB dañados o cables defectuosos consumen un núcleo entero de CPU sin mostrar procesos en Task Manager."
    },
    evidenceBadge: {
      code: "EVO-2902-ISR",
      label: "Interrupt Service Routine Budget"
    }
  },
  {
    id: "inv-29-03",
    code: "29.03",
    title: "DPC",
    subtitle: "Deferred Procedure Call en DISPATCH_LEVEL y la cola de procesamiento diferido",
    targetMechanism: "Kernel DPC Queue Subsystem (ntoskrnl!KiRetireDpcList)",
    targetComponent: "KDPC Structure & Per-CPU DPC Queues",
    commandName: "typeperf \"\\\\Processor Information(_Total)\\\\DPCs Queued/sec\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando juegas o reproduces música, cada cuadro o buffer de audio compite en una cola DPC contra el driver del mouse y el adaptador Wi-Fi?",
      mythVsTruth: {
        mentira: "Los hilos de tu juego tienen prioridad absoluta sobre el procesamiento de red y controladores.",
        verdad: "Cualquier DPC encolado en DISPATCH_LEVEL tiene prioridad estricta sobre TODOS los hilos de modo usuario, sin importar qué prioridad le des al juego en Task Manager.",
        comprobalo: "Comprobá con LatencyMon cómo un solo driver de audio o Wi-Fi puede retrasar el scheduler durante 2 milisegundos."
      }
    },
    entende: {
      queEs: "Una función del kernel que posterga el procesamiento pesado de una interrupción a un nivel inferior (DISPATCH_LEVEL = 2), permitiendo rehabilitar las interrupciones de hardware.",
      paraQueSirve: "Realizar el trabajo pesado de I/O (copiar buffers, recalcular checksums) sin congelar la recepción de nuevas interrupciones críticas.",
      quePasaSiFalta: "Sin DPCs, el hardware tendría que hacer todo en DIRQL, paralizando por completo el procesador ante cualquier ráfaga de datos."
    },
    interactua: {
      cliExample: "typeperf \"\\\\Processor Information(_Total)\\\\DPCs Queued/sec\" -sc 5",
      psExample: "(Get-Counter -Counter '\Processor Information(_Total)\% DPC Time').CounterSamples | Select-Object CookedValue",
      syntaxBreakdown: "Calcula el porcentaje de tiempo acumulado que pasa el procesador ejecutando rutinas DPC.",
      whatToLookFor: "% DPC Time inferior al 2% en sistemas saludables; valores sostenidos por encima del 5% son la causa directa de micro-stuttering.",
      technicalMetrics: "Estructura KDPC: contiene DeferredRoutine, DeferredContext, DpcData y TargetProcessor affinity."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de métricas del kernel.",
      safetyWarning: "No intentes desactivar DPCs: son la base del modelo de controladores de Windows NT."
    },
    evidenceBadge: {
      code: "EVO-2903-DPC",
      label: "Deferred Procedure Call Engine"
    }
  },
  {
    id: "inv-29-04",
    code: "29.04",
    title: "Driver execution time",
    subtitle: "Presupuesto de 100 µs por ISR y 500 µs por DPC acumulado",
    targetMechanism: "WDK Real-Time Constraint Guidelines",
    targetComponent: "Driver Execution Time Limits & Watchdog Boundaries",
    commandName: "LatencyMon.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que Microsoft diseñó las normas de Windows Driver Kit para que un DPC jamás tarde más de 100 microsegundos, pero drivers comerciales de audio y Wi-Fi exceden esto por más de 20 veces?",
      mythVsTruth: {
        mentira: "Si una PC tiene un CPU de 16 núcleos a 5 GHz, un DPC largo no importa porque sobran núcleos.",
        verdad: "Muchos DPCs están amarrados al procesador que atendió la interrupción física (Core 0); si ese núcleo se atora en un DPC, se congelan los hilos críticos fijados a él.",
        comprobalo: "Ejecutá LatencyMon y fijate la métrica 'Highest reported DPC routine execution time'."
      }
    },
    entende: {
      queEs: "El tiempo medido en microsegundos (µs) que transcurre desde que se invoca la rutina de un driver hasta que devuelve el control al kernel.",
      paraQueSirve: "Asegurar que los búferes de audio en tiempo real (128 o 256 muestras a 48 kHz) no se vacíen provocando chasquidos (audio crackling).",
      quePasaSiFalta: "El usuario experimenta 'audio dropouts', cursor del mouse que da saltos y tirones de imagen en juegos competitivos."
    },
    interactua: {
      cliExample: "echo Presupuesto oficial WDK: ISR < 25us, DPC < 100us, Acumulado < 500us",
      psExample: "Get-Process | Where-Object { $_.Name -match 'latencymon|resplendence' } | Select-Object Id, ProcessName, WorkingSet64",
      syntaxBreakdown: "Verifica herramientas activas de perfilado de latencia DPC/ISR en tiempo real.",
      whatToLookFor: "Tiempos de ejecución de DPC por encima de 1.000 µs (1 ms): umbral crítico de degradación auditiva y de frame pacing.",
      technicalMetrics: "Umbrales canónicos: < 500 µs (Excelente / Audio Pro), 500-1000 µs (Aceptable), > 1000 µs (Falla perceptible)."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico pasivo.",
      safetyWarning: "No diagnostiques latencia DPC mientras corrés benchmarks agresivos de disco: I/O pesada altera la medición."
    },
    evidenceBadge: {
      code: "EVO-2904-DRVTIME",
      label: "Driver Execution Budgeting"
    }
  },
  {
    id: "inv-29-05",
    code: "29.05",
    title: "LatencyMon",
    subtitle: "Lectura experta: ndis.sys, tcpip.sys, nvlddmkm.sys y storport.sys",
    targetMechanism: "Kernel DPC/ISR Profiling Hooks",
    targetComponent: "LatencyMon (Resplendence) / ETW Trace Engine",
    commandName: "latencymon / Drivers tab inspection",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando LatencyMon acusa a ndis.sys (red), casi nunca es Windows: es el driver del adaptador Wi-Fi de Realtek o Intel haciendo sondeos agresivos de bandas de radio?",
      mythVsTruth: {
        mentira: "LatencyMon es un benchmark que mide qué tan rápido es mi procesador.",
        verdad: "Es un monitor de tiempo real que mide la capacidad del sistema de responder a eventos inmediatos sin retardo de procesamiento en controladores.",
        comprobalo: "Mirá la pestaña 'Drivers' en LatencyMon: ordená por 'Highest execution (ms)' para ver el nombre exacto del archivo sospechoso."
      }
    },
    entende: {
      queEs: "La herramienta estándar de la industria para diagnosticar si una computadora con Windows es apta para procesamiento de audio en tiempo real y gaming competitivo de baja latencia.",
      paraQueSirve: "Aislar con exactitud qué driver binario específico (nvlddmkm.sys, acpi.sys, ndis.sys, storport.sys) está robando tiempo de CPU.",
      quePasaSiFalta: "Los usuarios cambian micrófonos, monitores y memorias creyendo que el hardware falla, cuando era una opción de ahorro de energía en la placa Wi-Fi."
    },
    interactua: {
      cliExample: "driverquery /v /fo csv",
      psExample: "Get-WmiObject Win32_PnPSignedDriver | Where-Object { $_.DeviceName -match 'NVIDIA|Realtek|Intel|Wi-Fi' } | Select-Object DeviceName, DriverVersion, DriverDate",
      syntaxBreakdown: "Lista las versiones y fechas exactas de los 4 sospechosos habituales de sobreconsumo DPC.",
      whatToLookFor: "Controladores con fechas muy antiguas o versiones genéricas suministradas por Windows Update en lugar de OEM oficial.",
      technicalMetrics: "Detección de culpables típicos: acpi.sys (Throttling/Power), nvlddmkm.sys (GPU scheduling), ndis.sys (Wi-Fi/LAN), storport.sys (SSD I/O)."
    },
    alertaEVO: {
      reversibilityRule: "Inspección de firmas y versiones de drivers.",
      safetyWarning: "No desactives drivers del sistema como acpi.sys: deshabilitarías la administración de energía y los ventiladores de la placa madre."
    },
    evidenceBadge: {
      code: "EVO-2905-LATMON",
      label: "LatencyMon Driver Dissection"
    }
  },
  {
    id: "inv-29-06",
    code: "29.06",
    title: "WPR/WPA",
    subtitle: "Windows Performance Recorder & Analyzer para profiling profundo a nivel kernel",
    targetMechanism: "ETW High-Frequency Sampling & Stack Walk Engine",
    targetComponent: "wpr.exe / wpa.exe / Microsoft-Windows-Kernel-Process",
    commandName: "wpr -start GeneralProfile",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que WPR y WPA son las mismas herramientas internas que utilizan los ingenieros del equipo de kernel de Microsoft en Redmond para depurar tirones en Windows?",
      mythVsTruth: {
        mentira: "LatencyMon es la única y más profunda herramienta que existe para estudiar latencias de kernel.",
        verdad: "LatencyMon solo reporta picos globales; WPA te muestra la línea de código exacta del driver, el hilo de CPU y el llamado de función que causó el spike.",
        comprobalo: "Iniciá una traza con `wpr -start GeneralProfile`, provocá el tirón y detenela con `wpr -stop trace.etl`."
      }
    },
    entende: {
      queEs: "La suite oficial del Windows Assessment and Deployment Kit (ADK) para instrumentar trazas ETW completas con muestreo de CPU a miles de muestras por segundo.",
      paraQueSirve: "Hacer arqueología microscópica de un stuttering: ver qué hilo estaba corriendo en qué núcleo en el microsegundo exacto.",
      quePasaSiFalta: "Quedás limitado a herramientas que te dicen 'hubo un problema', pero no pueden explicar por qué sucedió."
    },
    interactua: {
      cliExample: "wpr -status",
      psExample: "wpr -help profiles",
      syntaxBreakdown: "Consulta los perfiles nativos de instrumentación disponibles en Windows Performance Recorder.",
      whatToLookFor: "Perfiles clave: GeneralProfile, CPU, DiskIO, Audio, Video. Estado 'No trace currently active' en reposo.",
      technicalMetrics: "Sobrecarga de WPR en modo circular en memoria: < 1.5% de consumo de CPU gracias al motor ETW optimizado en ntoskrnl."
    },
    alertaEVO: {
      reversibilityRule: "wpr -cancel detiene y descarta cualquier traza en curso sin escribir a disco.",
      safetyWarning: "No dejes WPR grabando a disco por horas: un archivo .ETL puede consumir 1 GB de almacenamiento cada 5 minutos."
    },
    evidenceBadge: {
      code: "EVO-2906-WPRWPA",
      label: "Deep ETW Trace Profiling"
    }
  },
  {
    id: "inv-29-07",
    code: "29.07",
    title: "FPS bajo",
    subtitle: "Diferenciación entre throughput gráfico insuficiente y pérdida de timing",
    targetMechanism: "Throughput (FPS) vs Pacing (Frame Time Consistency)",
    targetComponent: "DirectX SwapChain Present Cadence",
    commandName: "Get-Process | Where-Object { $_.MainWindowTitle }",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que 60 FPS estables con frame pacing perfecto se sienten infinitamente más fluidos para el cerebro humano que 140 FPS oscilando erráticamente entre 8ms y 60ms?",
      mythVsTruth: {
        mentira: "Si mi contador de FPS marca 120, mi juego es imposible que tenga tirones.",
        verdad: "El contador de FPS promedia los cuadros en un segundo entero; podés tener 119 cuadros ultrarrápidos y un solo cuadro congelado por 80ms: el promedio dirá '119 FPS', pero tus ojos vieron un freeze brutal.",
        comprobalo: "Mirá el gráfico de frametime en milisegundos (ms) en lugar del número estático de FPS."
      }
    },
    entende: {
      queEs: "La distinción física fundamental entre cuántos cuadros produce el sistema en total (throughput) y con qué regularidad de tiempo se entregan a la pantalla (pacing).",
      paraQueSirve: "Evitar comprar tarjetas gráficas más potentes cuando el problema real es una contención de hilos o un driver colgado.",
      quePasaSiFalta: "Se gastan miles de dólares en hardware sin solucionar la sensación de juego entrecortado."
    },
    interactua: {
      cliExample: "echo FPS = 1000 / FrameTime. 60 FPS = 16.66ms, 120 FPS = 8.33ms, 144 FPS = 6.94ms",
      psExample: "Get-CimInstance Win32_VideoController | Select-Object Name, CurrentRefreshRate, VideoModeDescription",
      syntaxBreakdown: "Verifica la tasa de refresco nativa configurada en el adaptador para calcular la ventana de sincronía vertical.",
      whatToLookFor: "Tasa de refresco coincidente con el panel físico (ej. 144 Hz -> ventana de 6.94 ms por cuadro).",
      technicalMetrics: "Desviación estándar de frametime: en sistemas con pacing perfecto, la variación entre cuadros consecutivos es < 0.5 ms."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico pasivo.",
      safetyWarning: "No uses múltiples overlays de monitoreo de FPS al mismo tiempo (RivaTuner, GeForce Experience, Steam, Discord): ellos mismos generan stutter."
    },
    evidenceBadge: {
      code: "EVO-2907-FPSVSTUT",
      label: "Throughput vs Pacing Matrix"
    }
  },
  {
    id: "inv-29-08",
    code: "29.08",
    title: "Stutter",
    subtitle: "Spikes de tiempo de cuadro / frametime inconsistente de 16.6ms a 100ms+",
    targetMechanism: "Frame Time Spiking & Pipeline Stalls",
    targetComponent: "Present Queue / GPU Command Buffer",
    commandName: "typeperf \"\\\\GPU Engine(*)\\\\Utilization Percentage\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que un spike de frametime de 100 milisegundos equivale a que la pantalla se apague durante 6 cuadros enteros a 60 Hz?",
      mythVsTruth: {
        mentira: "El stuttering se arregla siempre bajando la resolución gráfica a 720p.",
        verdad: "Bajar la resolución suele trasladar el cuello de botella al procesador central (CPU bound), empeorando los spikes de sincronización de hilos.",
        comprobalo: "Observá si el uso de GPU cae al 0% durante el tirón: si cae, la GPU estaba esperando que la CPU le entregue comandos."
      }
    },
    entende: {
      queEs: "Una discontinuidad severa en la cadencia de presentación donde un cuadro tarda un múltiplo anormal de tiempo en completarse respecto a sus predecesores.",
      paraQueSirve: "Identificar qué subsistema provocó el estancamiento (pipeline stall): ¿disco esperando un asset?, ¿hilo bloqueado por un mutex?, ¿shader compilándose?",
      quePasaSiFalta: "El usuario asume que su PC no sirve y reinstala Windows sin resolver el origen real del stall."
    },
    interactua: {
      cliExample: "echo Analizar caídas de GPU Usage en picos de Frametime",
      psExample: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Name, CPU, WorkingSet64",
      syntaxBreakdown: "Identifica procesos en segundo plano que compiten con el hilo de renderizado por núcleos de CPU.",
      whatToLookFor: "Procesos secundarios consumiendo CPU de manera intermitente (antivirus, actualizadores, navegadores).",
      technicalMetrics: "Magnitud del spike: delta de frametime superior a 3x la cadencia base (ej. pasar de 16.6ms a > 50ms)."
    },
    alertaEVO: {
      reversibilityRule: "Inspección pasiva de procesos.",
      safetyWarning: "No asignes afinidad de todos los núcleos a un solo proceso sin dejar cores libres para las DPCs de red y audio."
    },
    evidenceBadge: {
      code: "EVO-2908-STUTTER",
      label: "Frame Time Spiking Anatomy"
    }
  },
  {
    id: "inv-29-09",
    code: "29.09",
    title: "Micro-stutter",
    subtitle: "Fluctuaciones de 2 a 5ms en cadencia de presentación y pacing",
    targetMechanism: "Fine-Grained Frame Pacing Jitter",
    targetComponent: "DirectX Present() Interval / Variable Refresh Rate (VRR)",
    commandName: "Get-ItemProperty -Path 'HKCU:\System\GameConfigStore'",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el micro-stuttering puede ocurrir incluso cuando tu pantalla tiene G-Sync o FreeSync activo si el juego oscila fuera del rango de refresco variable?",
      mythVsTruth: {
        mentira: "G-Sync y FreeSync eliminan el 100% de los tirones en cualquier juego.",
        verdad: "VRR solo sincroniza la pantalla con la GPU si los cuadros caen dentro del rango del panel (ej. 48-144 Hz). Si cae a 45 Hz o si hay un micro-stall de CPU, el jitter es visible.",
        comprobalo: "Limita la tasa de cuadros a 3 FPS por debajo del refresco máximo del monitor (ej. 141 FPS en 144 Hz) para mantenerte siempre dentro de la ventana VRR."
      }
    },
    entende: {
      queEs: "Una vibración sutil pero perceptible en el movimiento causada por pequeñas variaciones de milisegundos entre cuadros consecutivos (ej. 16ms, 19ms, 14ms, 18ms).",
      paraQueSirve: "Alinear perfectamente los tiempos de cálculo de física, entrada de periféricos y presentación en el swapchain.",
      quePasaSiFalta: "El usuario siente fatiga visual y una sensación de 'pesadez' o falta de suavidad a pesar de tener una alta tasa de cuadros."
    },
    interactua: {
      cliExample: "reg query \"HKCU\\System\\GameConfigStore\" /v GameDVR_Enabled",
      psExample: "Get-ItemProperty -Path 'HKCU:\System\GameConfigStore' -Name 'GameDVR_FSEBehavior' -ErrorAction SilentlyContinue",
      syntaxBreakdown: "Examina las configuraciones de GameDVR y optimizaciones para juegos en ventana que impactan en el frame pacing.",
      whatToLookFor: "GameDVR_Enabled = 0 para evitar que el grabador en segundo plano altere la cadencia de presentación.",
      technicalMetrics: "Jitter de pacing: fluctuación de varianza inter-frame superior a 3 milisegundos en escenas homogéneas."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de claves de usuario.",
      safetyWarning: "No uses 'optimizadores de registro' de YouTube: la mayoría rompen la composición de DWM y aumentan el micro-stutter."
    },
    evidenceBadge: {
      code: "EVO-2909-MICSTUT",
      label: "Frame Pacing Jitter Analysis"
    }
  },
  {
    id: "inv-29-10",
    code: "29.10",
    title: "Freeze",
    subtitle: "Cuelgues temporales de 500ms a 5 segundos sin BSOD",
    targetMechanism: "Thread Deadlock / Storage I/O Queue Stalls",
    targetComponent: "storahci.sys / disk.sys / NTFS Log Flushes",
    commandName: "typeperf \"\\\\PhysicalDisk(_Total)\\\\Avg. Disk sec/Transfer\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando la PC se congela durante 3 segundos enteros y luego 'revive' de golpe como si nada hubiera pasado, casi siempre fue un SSD ejecutando recolección de basura o reintentando un sector malo?",
      mythVsTruth: {
        mentira: "Si la PC se congela 3 segundos y sigue funcionando, es la memoria RAM que se saturó.",
        verdad: "La RAM no se 'toma pausas': responde en nanosegundos o crashea en BSOD. Pausas de segundos son casi siempre comandos de I/O de disco trabados en la controladora.",
        comprobalo: "Observá el contador 'Avg. Disk sec/Transfer': si supera 0.050 (50ms) o llega a 1.000 (1 segundo), tu disco está congelando el sistema."
      }
    },
    entende: {
      queEs: "Un bloqueo temporal del sistema operativo donde los hilos quedan en estado de espera (Wait State) aguardando un recurso de almacenamiento o un mutex de sincronización.",
      paraQueSirve: "Diferenciar fallos de almacenamiento degradado o comandos AHCI/NVMe colgados antes de que deriven en un colapso definitivo del sistema de archivos.",
      quePasaSiFalta: "El técnico diagnostica problemas de software o virus cuando el SSD tiene su memoria NAND flash degradada."
    },
    interactua: {
      cliExample: "typeperf \"\\\\PhysicalDisk(_Total)\\\\Avg. Disk sec/Transfer\" -sc 5",
      psExample: "Get-WinEvent -LogName System | Where-Object { $_.ProviderName -match 'storahci|stornvme|disk' -and $_.LevelDisplayName -match 'Warning|Error' } | Select-Object -First 5 TimeCreated, Id, Message",
      syntaxBreakdown: "Extrae advertencias y errores emitidos por el subsistema de almacenamiento SCSI/SATA/NVMe.",
      whatToLookFor: "Event ID 129 ('Se emitió un restablecimiento en el dispositivo') o Event ID 153 ('Se reintentó la operación de E/S').",
      technicalMetrics: "Latencia de I/O de disco sana: SSD NVMe < 0.001 s (1 ms); SSD SATA < 0.005 s (5 ms). > 0.050 s = Alerta de freeze."
    },
    alertaEVO: {
      reversibilityRule: "Monitoreo pasivo de almacenamiento.",
      safetyWarning: "Si detectás eventos 129 o 153 frecuentes, respaldá de inmediato tus datos: la unidad está próxima a fallar."
    },
    evidenceBadge: {
      code: "EVO-2910-FREEZE",
      label: "Storage Queue Deadlock Profiling"
    }
  },
  {
    id: "inv-29-11",
    code: "29.11",
    title: "Input lag",
    subtitle: "Retardo entre evento HID de mouse/teclado y renderizado en back-buffer",
    targetMechanism: "HID Input Pipeline & DWM Composition Buffer",
    targetComponent: "mouclass.sys / hidusb.sys / DWM Composition Engine",
    commandName: "Get-PnpDevice -Class 'Mouse'",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que activar V-Sync clásico de doble búfer agrega de 16 a 33 milisegundos completos de retraso entre el momento en que mueves el mouse y el momento en que el píxel cambia en la pantalla?",
      mythVsTruth: {
        mentira: "El input lag depende exclusivamente de cuántos DPI tiene el sensor de mi mouse.",
        verdad: "Los DPI solo definen la sensibilidad por pulgada; el retardo real se produce en la cola de buffering de la GPU (Pre-rendered frames) y en la composición de DWM.",
        comprobalo: "Comprobá cómo tecnologías de baja latencia como NVIDIA Reflex o AMD Anti-Lag limpian la cola de cuadros de la CPU justo antes del renderizado."
      }
    },
    entende: {
      queEs: "El tiempo total de latencia extremo a extremo desde el contacto físico de un switch o sensor hasta la emisión fotónica en el panel del monitor.",
      paraQueSirve: "Optimizar la respuesta en aplicaciones interactivas, interfaces médicas, simulación y deportes electrónicos.",
      quePasaSiFalta: "El usuario siente que el cursor 'flota sobre hielo', reduciendo drásticamente la precisión de control."
    },
    interactua: {
      cliExample: "reg query \"HKCU\\Control Panel\\Mouse\" /v MouseSensitivity",
      psExample: "Get-ItemProperty -Path 'HKCU:\Control Panel\Mouse' | Select-Object MouseSpeed, MouseThreshold1, MouseThreshold2",
      syntaxBreakdown: "Examina los multiplicadores de aceleración del subsistema de puntero en el registro de Windows.",
      whatToLookFor: "MouseSpeed = 0 (Mejorar precisión del puntero desactivado para evitar aceleración no lineal).",
      technicalMetrics: "Pipeline de latencia: Input polling (1 ms @ 1000 Hz) + Render queue (8-16 ms) + Scanout (7 ms @ 144 Hz) + Monitor pixel response (1-4 ms)."
    },
    alertaEVO: {
      reversibilityRule: "Lectura de configuración de periféricos de usuario.",
      safetyWarning: "Configurar el polling rate del mouse en 8000 Hz en CPUs antiguas puede generar micro-stuttering por saturar un núcleo con interrupciones USB."
    },
    evidenceBadge: {
      code: "EVO-2911-INPLAG",
      label: "HID Input Pipeline Breakdown"
    }
  },
  {
    id: "inv-29-12",
    code: "29.12",
    title: "Network lag",
    subtitle: "Diferenciar packet loss / jitter de buffer de red colapsado en NDIS",
    targetMechanism: "Network Stack Buffer vs System Kernel DPC Contention",
    targetComponent: "ndis.sys / tcpip.sys / Network Driver Buffer Rings",
    commandName: "ping 1.1.1.1 -n 10",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando un jugador dice 'tengo lag', la mitad de las veces la red está perfecta y lo que realmente está fallando es que el driver de red satura la CPU con DPCs congelando el juego?",
      mythVsTruth: {
        mentira: "Si el juego da tirones al jugar online, siempre es culpa de la empresa de internet (ISP).",
        verdad: "Si el búfer de recepción (RX Ring Buffer) del adaptador de red está mal configurado, el driver ndis.sys satura la CPU en DISPATCH_LEVEL provocando stuttering local idéntico al lag.",
        comprobalo: "Haz un ping continuo en segundo plano mientras juegas: si el ping se mantiene plano en 20ms mientras el juego tironea, el problema es 100% interno de tu PC."
      }
    },
    entende: {
      queEs: "El protocolo de aislamiento para distinguir si la degradación de fluidez proviene de la infraestructura de telecomunicaciones externa o del subsistema de drivers del equipo.",
      paraQueSirve: "Ahorrar horas de llamadas inútiles al proveedor de internet cuando el origen real era la telemetría del driver de red o contención de interrupciones.",
      quePasaSiFalta: "Se contratan planes de fibra óptica más caros sin solucionar los tirones locales del equipo."
    },
    interactua: {
      cliExample: "ping 8.8.8.8 -n 5",
      psExample: "Test-NetConnection -ComputerName 1.1.1.1 -InformationLevel Detailed | Select-Object ComputerName, PingSucceeded, RoundTripTime",
      syntaxBreakdown: "Verifica la latencia de ida y vuelta (RTT) y la estabilidad del paquete hacia resolvedores globales.",
      whatToLookFor: "PingSucceeded = True con RTT estable sin fluctuaciones (jitter) superiores a 15 milisegundos.",
      technicalMetrics: "Diferenciación pericial: Jitter de red = telemetría de ping errática; DPC lag = ping plano pero LatencyMon en rojo en ndis.sys."
    },
    alertaEVO: {
      reversibilityRule: "Prueba de conectividad ICMP estándar de solo lectura.",
      safetyWarning: "No desactives la descarga de suma de comprobación (Checksum Offload) de tu placa de red sin causa justificada; aumentará el uso de CPU."
    },
    evidenceBadge: {
      code: "EVO-2912-NETLAG",
      label: "Network vs Kernel Lag Isolation"
    }
  },
  {
    id: "inv-29-13",
    code: "29.13",
    title: "Page faults",
    subtitle: "Hard faults que detienen el hilo esperando lectura de disco vs soft faults en RAM",
    targetMechanism: "Memory Manager Translation Fault Handling",
    targetComponent: "Page Fault Handler (ntoskrnl!KiPageFault)",
    commandName: "typeperf \"\\\\Memory\\\\Page Faults/sec\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que Windows produce decenas de miles de 'Page Faults' por segundo sin ningún problema, pero un solo 'Hard Fault' en el momento incorrecto puede congelar un juego por 40 milisegundos?",
      mythVsTruth: {
        mentira: "Cualquier Page Fault es un error grave de memoria que indica corrupción del sistema.",
        verdad: "Los Soft Faults son normales (la página ya está en RAM y solo se añade a la tabla del proceso); los Hard Faults exigen leer el disco físico y suspenden el hilo obligatoriamente.",
        comprobalo: "Abre el Monitor de Recursos (resmon) en la pestaña Memoria y observa la columna 'Errores de página físicos/s' (Hard Faults)."
      }
    },
    entende: {
      queEs: "Una interrupción generada por la MMU del procesador cuando un hilo intenta acceder a una dirección de memoria virtual que no está actualmente asignada a un marco físico en la tabla de páginas.",
      paraQueSirve: "Gestionar de manera eficiente la memoria compartida, el mapeo de archivos de disco y el archivo de paginación.",
      quePasaSiFalta: "Windows no podría ejecutar aplicaciones que requieran más memoria de la físicamente instalada."
    },
    interactua: {
      cliExample: "typeperf \"\\\\Memory\\\\Pages/sec\" -sc 5",
      psExample: "(Get-Counter -Counter '\Memory\Pages/sec').CounterSamples | Select-Object CookedValue",
      syntaxBreakdown: "Mide la tasa de lectura y escritura de páginas a disco generadas por Hard Faults.",
      whatToLookFor: "Valores cercanos a 0 en reposo; picos superiores a 100/sec durante una aplicación en tiempo real coinciden exactamente con tirones perceptibles.",
      technicalMetrics: "Penalización temporal: Soft Fault = ~100 nanosegundos; Hard Fault en SSD NVMe = ~50-200 microsegundos; Hard Fault en HDD = ~10 milisegundos."
    },
    alertaEVO: {
      reversibilityRule: "Monitoreo pasivo de contadores de memoria.",
      safetyWarning: "Tener Hard Faults recurrentes con memoria libre indica fragmentación de memoria o un proceso secundario forzando trimming de working set."
    },
    evidenceBadge: {
      code: "EVO-2913-PAGFLT",
      label: "Page Fault Taxonomy"
    }
  },
  {
    id: "inv-29-14",
    code: "29.14",
    title: "Shader compilation",
    subtitle: "El tartamudeo por compilación JIT de pipelines gráficos en runtime",
    targetMechanism: "Graphics API Pipeline State Object (PSO) Compilation",
    targetComponent: "DirectX 12 / Vulkan D3D12CreateGraphicsPipelineState",
    commandName: "dir \"%localappdata%\\D3DSCache\" /s",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que la gran mayoría del stuttering en juegos modernos en PC ocurre porque los desarrolladores cambiaron de DirectX 11 a DirectX 12 sin precompilar los shaders en el menú?",
      mythVsTruth: {
        mentira: "El shader stuttering se debe a que la placa de video no tiene suficiente potencia de cálculo.",
        verdad: "Es el procesador central (CPU) quien compila el código intermedio de shaders a lenguaje máquina de la GPU; si lo hace en medio de la partida, el motor gráfico se frena en seco.",
        comprobalo: "Verifica que en juegos modernos, el primer paso por una zona produce un tirón y la segunda vez que pasas ya va fluido (el shader quedó guardado en caché)."
      }
    },
    entende: {
      queEs: "El proceso de traducir el código abstracto de sombreadores (HLSL/SPIR-V) a microinstrucciones binarias nativas para la arquitectura específica de tu tarjeta de video.",
      paraQueSirve: "Garantizar que los shaders aprovechen las instrucciones vectoriales y optimizaciones de hardware de cada fabricante.",
      quePasaSiFalta: "Si un shader no está compilado cuando la GPU lo necesita para dibujar el siguiente fotograma, el hilo de renderizado se detiene hasta que la CPU termine de compilarlo."
    },
    interactua: {
      cliExample: "dir /s /b \"%localappdata%\\D3DSCache\"",
      psExample: "Get-ChildItem -Path \"$env:LOCALAPPDATA\\D3DSCache\" -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum | Select-Object Count, @{N='TotalMB';E={[math]::Round($_.Sum / 1MB, 2)}}",
      syntaxBreakdown: "Inspecciona la caché unificada de sombreadores de Direct3D en el perfil del usuario.",
      whatToLookFor: "Archivos .bin en D3DSCache; si la caché se borra constantemente por optimizadores de limpieza, los juegos volverán a tartamudear en cada inicio.",
      technicalMetrics: "Tiempo de compilación de un PSO complejo en runtime: típicamente de 15 ms a 80 ms (provoca una caída instantánea a 0 FPS)."
    },
    alertaEVO: {
      reversibilityRule: "Inspección de directorios de caché locales.",
      safetyWarning: "Nunca configures herramientas como CCleaner para borrar la carpeta D3DSCache o la caché de shaders del panel de NVIDIA/AMD."
    },
    evidenceBadge: {
      code: "EVO-2914-SHADERS",
      label: "Shader Pipeline Compilation Stalls"
    }
  },
  {
    id: "inv-29-15",
    code: "29.15",
    title: "VRAM",
    subtitle: "Saturación de memoria de video, paging hacia RAM del sistema por PCIe",
    targetMechanism: "WDDM Video Memory Manager (VidMm) Eviction & Paging",
    targetComponent: "Dedicated Video Memory vs Shared System Memory (VidMm Engine)",
    commandName: "dxdiag /t %temp%\dxvram.txt",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando te quedas sin VRAM en la GPU, el juego no crashea: Windows empieza a mandar texturas a la RAM normal por el carril PCIe, reduciendo la velocidad de 800 GB/s a solo 25 GB/s?",
      mythVsTruth: {
        mentira: "La memoria de video compartida (Shared VRAM) funciona igual de rápido que la memoria de la placa de video.",
        verdad: "La VRAM dedicada tiene anchos de banda brutales (500 a 1000+ GB/s); la RAM compartida viaja por el bus PCIe a una fracción de esa velocidad, provocando tirones demoledores.",
        comprobalo: "Observá en el Administrador de Tareas la métrica 'Memoria de GPU compartida': si supera 1 GB, estás sufriendo paging de VRAM."
      }
    },
    entende: {
      queEs: "El mecanismo del administrador de memoria de video de Windows (VidMm) que expulsa (evicts) texturas y búferes a la memoria física del sistema cuando la VRAM dedicada se satura.",
      paraQueSirve: "Evitar que las aplicaciones colapsen de inmediato con errores de falta de memoria (Out of Memory).",
      quePasaSiFalta: "Cualquier juego que sobrepase la memoria de video por 10 MB se cerraría abruptamente al escritorio."
    },
    interactua: {
      cliExample: "wmic path Win32_VideoController get AdapterRAM, Name",
      psExample: "Get-CimInstance Win32_VideoController | Select-Object Name, @{N='VRAM_GB';E={[math]::Round($_.AdapterRAM / 1GB, 2)}}",
      syntaxBreakdown: "Consulta la cantidad física de memoria de video dedicada reportada por el controlador gráfico.",
      whatToLookFor: "Valores reales de VRAM física instalada para calcular márgenes de asignación de texturas seguras.",
      technicalMetrics: "Ancho de banda GDDR6/X nativo: ~500-1000 GB/s vs ancho de banda de bus PCIe 4.0 x16: ~31.5 GB/s (caída de más de 20x en velocidad de transferencia)."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de propiedades de hardware WMI.",
      safetyWarning: "Reducir la calidad de texturas un nivel elimina de raíz el 100% de los tirones causados por saturación de VRAM."
    },
    evidenceBadge: {
      code: "EVO-2915-VRAMPAG",
      label: "VidMm Memory Eviction Monitor"
    }
  },
  {
    id: "inv-29-16",
    code: "29.16",
    title: "Thermal",
    subtitle: "Thermal throttling: caídas bruscas de reloj de CPU/GPU por límite térmico en PROCHOT",
    targetMechanism: "Hardware Thermal Throttling & ACPI Passive Cooling",
    targetComponent: "CPU Digital Thermal Sensors (DTS) / BD PROCHOT Signal",
    commandName: "powercfg /query SCHEME_CURRENT SUB_PROCESSOR",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando tu procesador toca los 100°C, su señal de hardware BD PROCHOT puede bajar la frecuencia de 4800 MHz a 800 MHz en 1 microsegundo, sintiéndose como si la PC se congelara viva?",
      mythVsTruth: {
        mentira: "El thermal throttling solo reduce un poco los FPS generales de forma suave.",
        verdad: "Muchos procesadores implementan saltos escalonados violentos que desploman la tasa de procesamiento por 1 segundo hasta que la temperatura desciende 5 grados.",
        comprobalo: "Monitorea la frecuencia de reloj del procesador en tiempo real: si oscila como un serrucho entre frecuencia máxima y 800 MHz, tienes estrangulamiento térmico agresivo."
      }
    },
    entende: {
      queEs: "El mecanismo de autoprotección del silicio que reduce la tensión y la frecuencia de reloj para evitar daños físicos permanentes por exceso de calor.",
      paraQueSirve: "Preservar la vida útil de los transistores y evitar que el equipo se apague repentinamente por corte térmico de emergencia.",
      quePasaSiFalta: "El silicio alcanzaría temperaturas superiores a 115°C, provocando electromigración acelerada y destrucción física del chip."
    },
    interactua: {
      cliExample: "powercfg /getactivescheme",
      psExample: "Get-CimInstance -Namespace root\cimv2 -ClassName Win32_Processor | Select-Object Name, MaxClockSpeed, CurrentClockSpeed",
      syntaxBreakdown: "Compara la frecuencia de reloj actual reportada contra la frecuencia base máxima del procesador.",
      whatToLookFor: "CurrentClockSpeed severamente inferior a MaxClockSpeed bajo cargas de trabajo pesadas.",
      technicalMetrics: "Límite TjMax típico en silicio moderno: 95°C a 105°C según fabricante; inicio de modulación de clock: TjMax - 2°C."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de telemetría de reloj y esquemas de energía.",
      safetyWarning: "No uses software para desactivar la señal PROCHOT: podrías fundir físicamente el chip sin protección térmica."
    },
    evidenceBadge: {
      code: "EVO-2916-THERMAL",
      label: "Silicon Thermal Throttling Guard"
    }
  },
  {
    id: "inv-29-17",
    code: "29.17",
    title: "Power",
    subtitle: "C-States agresivos, D3hot en PCIe y latencia de transición de energía",
    targetMechanism: "CPU C-State Wake Latency & PCIe ASPM Power Transitions",
    targetComponent: "Core C-States (C1E, C6, C7, C8) / Active State Power Management (ASPM)",
    commandName: "powercfg /energy /duration 5",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando un núcleo de CPU entra en un estado de reposo profundo (C6/C8) para ahorrar energía, necesita hasta 100 microsegundos solo para 'despertarse' y volver a ejecutar código?",
      mythVsTruth: {
        mentira: "Los planes de energía de Windows no afectan la latencia en equipos enchufados a la corriente.",
        verdad: "La transición de salida de C-States profundos y el enlace PCIe saliendo de L1 a L0 genera un micro-stutter evidente ante el primer movimiento de mouse o disparo en un juego.",
        comprobalo: "Verifica cómo el plan de energía 'Alto rendimiento' o desactivar C-States en BIOS mantiene los núcleos en C0 listos para ejecutar inmediatamente."
      }
    },
    entende: {
      queEs: "La arquitectura de estados de suspensión de baja energía de la CPU (C-States) y de dispositivos de bus PCIe (ASPM L0s/L1).",
      paraQueSirve: "Reducir drásticamente el consumo eléctrico y la emisión térmica cuando el procesador o los periféricos no están realizando cómputo activo.",
      quePasaSiFalta: "Un equipo portátil agotaría su batería en menos de una hora y las temperaturas en reposo serían innecesariamente elevadas."
    },
    interactua: {
      cliExample: "powercfg /query SCHEME_CURRENT SUB_PCIEXPRESS",
      psExample: "Get-CimInstance -Namespace root\cimv2\power -ClassName Win32_PowerSettingDataIndex | Select-Object -First 3 InstanceID",
      syntaxBreakdown: "Examina las configuraciones de administración de energía del enlace PCI Express (ASPM).",
      whatToLookFor: "Ahorro de energía en PCIe: desactivar el estado de ahorro de energía máximo en PCIe elimina micro-tirones de enlace en tarjetas gráficas y SSDs.",
      technicalMetrics: "Latencia de salida: C1 (~1 µs), C3 (~10 µs), C6 (~50 µs), C8 (> 100 µs). Enlace PCIe L1 exit latency: ~16 µs a 64 µs."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de esquemas de energía nativos.",
      safetyWarning: "No desactives completamente todos los estados de energía en laptops: generará sobrecalentamiento prematuro de la batería."
    },
    evidenceBadge: {
      code: "EVO-2917-POWER",
      label: "C-State & ASPM Transition Latency"
    }
  },
  {
    id: "inv-29-18",
    code: "29.18",
    title: "Background tasks",
    subtitle: "Servicios, telemetría y contención de hilos en System Idle Process",
    targetMechanism: "Thread Preemption & CPU Scheduler Contention",
    targetComponent: "Task Scheduler / TiWorker.exe / Sedlauncher / Antivirus Real-Time Hooks",
    commandName: "schtasks /query /fo TABLE",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que Windows tiene tareas programadas para ejecutarse cuando cree que estás en 'reposo', y que si juegas con un joystick a veces cree que la PC está desocupada y lanza mantenimientos pesados?",
      mythVsTruth: {
        mentira: "Si cierro todas las ventanas del escritorio, ninguna aplicación puede usar CPU en segundo plano.",
        verdad: "Servicios del sistema como TiWorker (mantenimiento de componentes), indexadores y actualizadores de terceros se ejecutan como servicios independientes sin ventana gráfica.",
        comprobalo: "Inspecciona el Administrador de Tareas ordenado por CPU en el segundo exacto en que experimentas un stuttering inexplicable."
      }
    },
    entende: {
      queEs: "La contención que se produce cuando procesos secundarios despiertan repentinamente y demandan ciclos de cálculo, expulsando (preempting) a los hilos de renderizado de la CPU.",
      paraQueSirve: "Mantener el sistema seguro, indexado y actualizado de forma automática.",
      quePasaSiFalta: "Sin gestión adecuada de prioridades, una tarea de telemetría de bajo valor puede robarle tiempo a un hilo de procesamiento crítico."
    },
    interactua: {
      cliExample: "schtasks /query /status RUNNING",
      psExample: "Get-ScheduledTask | Where-Object { $_.State -eq 'Running' } | Select-Object TaskName, TaskPath, State",
      syntaxBreakdown: "Lista las tareas programadas que se encuentran activamente en ejecución en este instante.",
      whatToLookFor: "Tareas de mantenimiento automático, desfragmentación o telemetría que coincidan con la hora de los micro-tirones.",
      technicalMetrics: "Penalización de cambio de contexto (Context Switch): ~1 a 3 microsegundos por cambio + expulsión de líneas de caché L1/L2 de CPU."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de tareas programadas.",
      safetyWarning: "Nunca elimines tareas de mantenimiento del sistema a ciegas; usa el Programador de Tareas para ajustar sus condiciones de ejecución."
    },
    evidenceBadge: {
      code: "EVO-2918-BGTASK",
      label: "Scheduler Thread Contention"
    }
  },
  {
    id: "inv-29-19",
    code: "29.19",
    title: "“Evidencia insuficiente” como resultado válido",
    subtitle: "El rigor forense de no inventar causas sin traza",
    targetMechanism: "Scientific Forensics Discipline & Evidence Integrity",
    targetComponent: "Diagnostic Protocol Final Boundary Rule",
    commandName: "echo Rigor Pericial: Sin traza medible no hay diagnostico valido",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el mayor error de los técnicos novatos es adivinar una causa ('debe ser la fuente', 'debe ser Windows') cuando la telemetría no muestra evidencia concluyente?",
      mythVsTruth: {
        mentira: "Un buen técnico siempre tiene una respuesta y solución inmediata con solo escuchar el síntoma.",
        verdad: "Un perito profesional reconoce formalmente: 'La evidencia recolectada hasta este punto es insuficiente para señalar un culpable con certeza técnica', y diseña una prueba más precisa.",
        comprobalo: "Revisa los informes de auditoría de incidentes graves de Microsoft: 'Inconclusive - Awaiting higher frequency ETW trace' es un estado formal y riguroso."
      }
    },
    entende: {
      queEs: "El principio epistemológico que prohíbe emitir un dictamen técnico o alterar configuraciones del sistema sin contar con trazas medibles, contadores o volcados que respalden la conclusión.",
      paraQueSirve: "Proteger al usuario de gastos absurdos, modificaciones destructivas del sistema operativo y pérdida de tiempo persiguiendo causas fantasma.",
      quePasaSiFalta: "El equipo termina con configuraciones destrozadas por 'tweaks' aleatorios de internet y el problema original sigue sin solucionarse."
    },
    interactua: {
      cliExample: "echo Regla EVO: Jamas toques una configuracion si no puedes medir su impacto",
      psExample: "Write-Output \"[EVO PERICIAL] Estado: EVIDENCIA INSUFICIENTE. Siguiente paso: Captura de traza profunda WPR de 60 segundos bajo reproduccion del sintoma.\"",
      syntaxBreakdown: "Emite el dictamen canónico cuando las métricas preliminares no superan los umbrales de certeza técnica.",
      whatToLookFor: "Evitar sesgos de confirmación: si LatencyMon marca verde, no insistas en que es un driver; investiga shaders, pacing o almacenamiento.",
      technicalMetrics: "Estándar de prueba: Requerimiento de correlación temporal exacta (+/- 10 ms) entre el evento de hardware/log y la manifestación del stutter."
    },
    alertaEVO: {
      reversibilityRule: "Principio ético y forense fundamental.",
      safetyWarning: "Admitir que falta evidencia y colocar una traza específica es la marca de un profesional de élite frente a un aficionado."
    },
    evidenceBadge: {
      code: "EVO-2919-NOEVID",
      label: "Scientific Forensics Integrity Rule"
    }
  }
];

export const SECTOR_29_MINICASES: Sector29MiniCase[] = [
  {
    id: "case-29-01",
    code: "MC-29.1",
    title: "El chasquido de audio cada 15 segundos en streaming",
    scenario: "Un creador de contenido sufre cortes de audio y chasquidos (crackling) cada 15 a 20 segundos exactos en su interfaz USB de audio profesional durante transmisiones en vivo. Cambió cables, compró otra interfaz de sonido de 300 dólares, reinstaló Windows de cero y el problema continuó idéntico.",
    userStatement: "\"Windows 11 tiene el subsistema de audio roto para placas profesionales, ya gast\u00e9 300 d\u00f3lares en otra interfaz y se sigue cortando.\"",
    initialMistake: "Asumir que el síntoma (el audio) señala al dispositivo culpable (la placa de sonido), sin medir la latencia DPC del sistema operativo.",
    diagnosticQuestion: "¿Cómo se identifica con certeza técnica qué componente genera la interrupción del buffer de audio?",
    options: [
      {
        id: "opt-1",
        text: "Comprar una placa de sonido PCI Express interna de gama más alta.",
        isCorrect: false,
        explanation: "No resuelve la causa raíz: si la CPU está atascada en DISPATCH_LEVEL, cualquier bus de audio se vaciará igual."
      },
      {
        id: "opt-2",
        text: "Ejecutar LatencyMon en segundo plano durante 3 minutos, reproducir el chasquido e inspeccionar la pestaña 'Drivers' ordenada por tiempo de ejecución más alto.",
        isCorrect: true,
        explanation: "¡Correcto! LatencyMon medirá qué driver monopoliza la CPU por encima del presupuesto de 500 microsegundos, vaciando el búfer de la interfaz de audio."
      },
      {
        id: "opt-3",
        text: "Aumentar el tamaño del búfer de audio a 2048 muestras para tapar el problema.",
        isCorrect: false,
        explanation: "Introduce un retardo inaceptable para streaming y no elimina picos de drivers que sobrepasen esa ventana."
      }
    ],
    technicalVerdict: "LatencyMon reveló que el driver de la placa de red Wi-Fi (netwtw10.sys) ejecutaba una rutina DPC de 2.800 microsegundos cada 15 segundos exactos porque el software de la placa estaba escaneando redes vecinas en segundo plano. Al desactivar el escaneo en segundo plano o usar cable Ethernet, la latencia DPC cayó a 80 microsegundos y los chasquidos desaparecieron para siempre.",
    lessonLearned: "El audio es la primera víctima inocente cuando otro driver de hardware mal programado se roba el procesador en DISPATCH_LEVEL."
  },
  {
    id: "case-29-02",
    code: "MC-29.2",
    title: "El tirón violento al entrar a zonas nuevas en un juego",
    scenario: "Un jugador experimenta 140 FPS estables en un título de mundo abierto, pero cada vez que cruza una puerta hacia una habitación nueva o gira la cámara hacia un escenario inédito, la pantalla se congela por 60 a 90 milisegundos completos y luego continúa fluida a 140 FPS.",
    userStatement: "\"Mi placa de video no tiene suficiente potencia para este juego, tengo que cambiarla por una m\u00e1s cara.\"",
    initialMistake: "Confundir un problema de rendimiento de renderizado continuo (throughput) con un problema de compilación de shaders o carga de assets asíncrona.",
    diagnosticQuestion: "¿Cuál es el origen técnico de este comportamiento de tirones puntuales?",
    options: [
      {
        id: "opt-1",
        text: "La memoria RAM está dañada y pierde los datos del mapa.",
        isCorrect: false,
        explanation: "La RAM no produce tirones puntuales reproducibles en zonas nuevas; generaría BSODs o crashes al escritorio."
      },
      {
        id: "opt-2",
        text: "Compilación de Shaders (PSO Creation) en tiempo de ejecución: el motor gráfico de DirectX 12 compila por primera vez las instrucciones de los materiales de esa sala en la CPU mientras el hilo de renderizado espera.",
        isCorrect: true,
        explanation: "¡Exacto! Es el clásico 'Shader Compilation Stutter'. Una vez que el material se compila y se guarda en la caché de disco (D3DSCache), el tirón nunca más vuelve a ocurrir en esa misma zona."
      },
      {
        id: "opt-3",
        text: "El monitor perdió la señal de video por un cable HDMI defectuoso.",
        isCorrect: false,
        explanation: "Un cable defectuoso produce parpadeos negros continuos o pérdida total de señal, no tirones de frametime correlacionados con eventos del juego."
      }
    ],
    technicalVerdict: "Al habilitar la opción de 'Precompilar shaders en el menú principal' que ofrecía el juego y verificar que la carpeta D3DSCache no estuviera siendo purgada por limpiadores de disco, el frametime se mantuvo plano como una línea recta en 7.1 ms.",
    lessonLearned: "Un juego a 140 FPS que compila un shader en vivo en la CPU tiene que frenar el hilo gráfico obligatoriamente. No es falta de hardware: es arquitectura de software."
  },
  {
    id: "case-29-03",
    code: "MC-29.3",
    title: "El freeze de 2 segundos que ningún test detectaba",
    scenario: "Un servidor de base de datos sufre congelamientos de 2 a 3 segundos aproximadamente tres veces al día. El uso de CPU se mantiene en 15%, la temperatura en 45°C y el visor de eventos no tiene ninguna BSOD ni advertencias críticas de software.",
    userStatement: "\"Windows tiene un bug fantasma que congela la m\u00e1quina sin dejar ninguna pista en los logs.\"",
    initialMistake: "Buscar solo eventos de error en los registros de aplicaciones, ignorando los contadores de cola de disco y los eventos de latencia de controladores de almacenamiento.",
    diagnosticQuestion: "¿Qué métrica forense revela la causa del congelamiento en este servidor?",
    options: [
      {
        id: "opt-1",
        text: "Monitorear el contador de rendimiento PhysicalDisk\Avg. Disk sec/Transfer y filtrar en el Visor de Eventos por el origen storahci o stornvme buscando Event ID 129.",
        isCorrect: true,
        explanation: "¡Exacto! Cuando una controladora de SSD o disco experimenta un timeout en su firmware, congela toda la cola de I/O de Windows hasta que se emite un comando de reset de hardware (Event 129), congelando todo hilo que requiera memoria paginada."
      },
      {
        id: "opt-2",
        text: "Cambiar el teclado y el mouse por periféricos PS/2 para evitar interrupciones USB.",
        isCorrect: false,
        explanation: "Las interrupciones USB no provocan congelamientos globales de 3 segundos en un servidor."
      },
      {
        id: "opt-3",
        text: "Reinstalar la base de datos en una partición FAT32 para mayor velocidad.",
        isCorrect: false,
        explanation: "FAT32 es inseguro, carece de journaling y no soporta bases de datos empresariales."
      }
    ],
    technicalVerdict: "El contador Avg. Disk sec/Transfer saltaba a 2.450 segundos (2450 ms) exactamente a la misma hora del freeze. El firmware del SSD secundario tenía un bug en su algoritmo de garbage collection que bloqueaba el bus SATA. Una actualización de firmware del fabricante del SSD resolvió el 100% de los incidentes.",
    lessonLearned: "Cuando un equipo se congela por segundos sin crashear, el principal sospechoso es siempre el almacenamiento: el kernel está esperando que el disco le devuelva una página."
  }
];

export const SECTOR_29_TEST_BANK: Sector29TestQuestion[] = [
  {
    id: "q29-01",
    questionNumber: 1,
    category: "Interrupciones Hardware",
    question: "¿Qué ventaja arquitectónica fundamental ofrece Message Signaled Interrupts (MSI/MSI-X) frente a las tradicionales interrupciones basadas en líneas físicas (Line-Based IRQ)?",
    options: [
      { id: "A", text: "Permite usar teclados inalámbricos sin baterías." },
      { id: "B", text: "Escribe paquetes de interrupción directamente en direcciones de memoria del bus PCIe, eliminando la contención y el compartir líneas entre múltiples dispositivos." },
      { id: "C", text: "Comprime los archivos del disco duro de forma transparente para ahorrar espacio." },
      { id: "D", text: "Duplica la velocidad de los ventiladores de la tarjeta gráfica automáticamente." }
    ],
    correctOptionId: "B",
    technicalExplanation: "MSI/MSI-X sustituye los pines de interrupción físicos compartidos por escrituras en memoria direccionadas al controlador APIC de la CPU, evitando que dos dispositivos en conflicto se disputen la misma línea."
  },
  {
    id: "q29-02",
    questionNumber: 2,
    category: "Rutinas ISR",
    question: "¿Cuál es el presupuesto de tiempo de ejecución recomendado oficialmente por Microsoft para una rutina de servicio de interrupción (ISR)?",
    options: [
      { id: "A", text: "Menos de 25 microsegundos (µs)." },
      { id: "B", text: "Aproximadamente 5 segundos." },
      { id: "C", text: "100 milisegundos exactos." },
      { id: "D", text: "No tiene ningún límite temporal predeterminado." }
    ],
    correctOptionId: "A",
    technicalExplanation: "Una ISR corre en DIRQL (enmascarando interrupciones de igual o menor nivel). Debe ejecutarse en menos de 25 microsegundos: solo atiende el hardware básico, encola un DPC y cede la CPU."
  },
  {
    id: "q29-03",
    questionNumber: 3,
    category: "Prioridad DPC",
    question: "¿Por qué un DPC excesivamente largo de un driver afecta a un juego o aplicación incluso si el proceso tiene prioridad 'Tiempo Real' en Task Manager?",
    options: [
      { id: "A", text: "Porque Windows siempre favorece a los programas de música." },
      { id: "B", text: "Porque las DPCs se ejecutan en IRQL = DISPATCH_LEVEL (Nivel 2), el cual tiene prioridad absoluta de CPU sobre CUALQUIER hilo de modo usuario (Ring 3)." },
      { id: "C", text: "Porque los juegos se ejecutan dentro del emulador WOW64." },
      { id: "D", text: "Porque la memoria virtual se apaga cuando se ejecutan DPCs." }
    ],
    correctOptionId: "B",
    technicalExplanation: "La escala de prioridades de procesos de Ring 3 (0 a 31) solo rige dentro de PASSIVE_LEVEL. En DISPATCH_LEVEL, el procesador atiende DPCs del kernel y el scheduler de hilos ni siquiera puede intervenir."
  },
  {
    id: "q29-04",
    questionNumber: 4,
    category: "Análisis con LatencyMon",
    question: "Al diagnosticar micro-stuttering o chasquidos de audio con LatencyMon, ¿en qué pestaña y métrica específica se identifica al driver culpable?",
    options: [
      { id: "A", text: "En la pestaña 'Processes' mirando la memoria privada." },
      { id: "B", text: "En la pestaña 'Drivers', ordenando por 'Highest execution (ms)' o 'Total execution time'." },
      { id: "C", text: "En la pestaña 'Main' mirando la marca de la BIOS." },
      { id: "D", text: "En la pestaña 'Stats' leyendo la fecha de instalación de Windows." }
    ],
    correctOptionId: "B",
    technicalExplanation: "La pestaña Drivers mide directamente los ganchos de ejecución de cada módulo de kernel; el driver con el mayor tiempo de ejecución individual es el responsable directo de retrasar el retorno al modo usuario."
  },
  {
    id: "q29-05",
    questionNumber: 5,
    category: "Throughput vs Pacing",
    question: "¿Por qué un juego puede sentirse 'pesado y con tirones' a pesar de que el contador de FPS marca un número elevado como 120 FPS?",
    options: [
      { id: "A", text: "Porque el ojo humano no puede ver más de 30 FPS." },
      { id: "B", text: "Porque el contador promedia los fotogramas en 1 segundo entero, ocultando spikes de frametime individuales de 60ms o más que causan tirones evidentes." },
      { id: "C", text: "Porque el cable DisplayPort tiene polvo en los conectores." },
      { id: "D", text: "Porque la resolución de pantalla está configurada en 16:9." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El promedio oculta la varianza. Si 119 cuadros tardan 5 ms cada uno pero un solo cuadro tarda 80 ms, el promedio dice 120 FPS, pero el usuario experimentó una congelación real de casi un décimo de segundo."
  },
  {
    id: "q29-06",
    questionNumber: 6,
    category: "Fallos de Página",
    question: "¿Cuál es la diferencia crítica de impacto en el rendimiento entre un 'Soft Page Fault' y un 'Hard Page Fault'?",
    options: [
      { id: "A", text: "El Soft Fault borra el archivo; el Hard Fault lo copia." },
      { id: "B", text: "El Soft Fault resuelve la dirección en RAM en nanosegundos; el Hard Fault obliga al hilo a suspenderse esperando que los datos se lean físicamente del disco de almacenamiento." },
      { id: "C", text: "Los Hard Faults solo ocurren en procesadores Intel." },
      { id: "D", text: "No existe ninguna diferencia técnica medible entre ambos." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Un Soft Fault solo actualiza la tabla de páginas porque la página ya reside en memoria física. Un Hard Fault genera una operación de I/O de disco que paraliza el hilo durante microsegundos o milisegundos enteros."
  },
  {
    id: "q29-07",
    questionNumber: 7,
    category: "Shader Compilation",
    question: "En APIs modernas como DirectX 12 y Vulkan, ¿qué fenómeno técnico provoca el 'Shader Stuttering' durante las primeras partidas de un juego?",
    options: [
      { id: "A", text: "La tarjeta de video está recalentándose por encima de 100 grados." },
      { id: "B", text: "La compilación en tiempo real (JIT) de Pipelines State Objects (PSO) en la CPU cuando el motor gráfico encuentra un material por primera vez sin tenerlo en caché." },
      { id: "C", text: "La conexión a internet pierde paquetes en el protocolo UDP." },
      { id: "D", text: "El antivirus está escaneando los archivos de música del juego." }
    ],
    correctOptionId: "B",
    technicalExplanation: "DirectX 12 delega la gestión de estados de pipeline al motor del juego. Si el juego no precompila los PSOs, la CPU se detiene a compilar el shader en el instante exacto en que aparece en pantalla, creando un tirón visible."
  },
  {
    id: "q29-08",
    questionNumber: 8,
    category: "Memoria de Video",
    question: "¿Qué ocurre cuando una aplicación 3D supera la capacidad física de la VRAM dedicada de la tarjeta de video?",
    options: [
      { id: "A", text: "El monitor reduce la resolución a 640x480 de inmediato." },
      { id: "B", text: "El administrador de memoria de video de Windows (VidMm) desaloja texturas a la RAM del sistema a través del bus PCIe, reduciendo el ancho de banda drásticamente y causando caídas brutales de fluidez." },
      { id: "C", text: "La placa de video apaga sus ventiladores para ahorrar energía." },
      { id: "D", text: "Windows formatea la unidad C: automáticamente." }
    ],
    correctOptionId: "B",
    technicalExplanation: "VidMm implementa paginación de video. La memoria dedicada opera a cientos de gigabytes por segundo, mientras que el bus PCIe solo ofrece una fracción; el intercambio masivo de texturas a través del bus genera stutter severo."
  },
  {
    id: "q29-09",
    questionNumber: 9,
    category: "Estados de Energía",
    question: "¿Por qué los estados de suspensión profunda de núcleos de CPU (C6/C8) pueden introducir micro-stuttering en cargas intermitentes?",
    options: [
      { id: "A", text: "Porque apagan el suministro de internet de la placa madre." },
      { id: "B", text: "Porque el tiempo de reactivación (Wake Latency) para salir del estado de reposo y restaurar el contexto de ejecución puede tardar hasta 100 microsegundos." },
      { id: "C", text: "Porque cambian la arquitectura del procesador de x64 a ARM." },
      { id: "D", text: "Porque desactivan el mouse de forma permanente." }
    ],
    correctOptionId: "B",
    technicalExplanation: "En estados C profundos, el núcleo apaga relojes y baja voltajes. Cuando un hilo se despierta, el núcleo necesita tiempo físico para estabilizar la tensión y restaurar la caché, introduciendo una latencia perceptible."
  },
  {
    id: "q29-10",
    questionNumber: 10,
    category: "Rigor Forense",
    question: "Según el principio forense del Método EVO, ¿qué debe dictaminar un perito cuando las mediciones y telemetría no demuestran de forma concluyente la causa de un tirón?",
    options: [
      { id: "A", text: "Decirle al cliente que la placa madre está fallada para cerrar el caso rápido." },
      { id: "B", text: "Declarar formalmente 'Evidencia insuficiente' y diseñar una prueba de mayor resolución (como una traza ETW con WPR) antes de realizar cualquier cambio en el sistema." },
      { id: "C", text: "Aplicar un script de optimización de Windows descargado de foros." },
      { id: "D", text: "Formatear la computadora e instalar una versión modificada de Windows sin telemetría." }
    ],
    correctOptionId: "B",
    technicalExplanation: "La disciplina científica exige no inventar causas sin evidencia medible. 'Evidencia insuficiente' es un dictamen profesional válido que previene daños y guía el siguiente paso pericial con trazas de alta precisión."
  }
];
