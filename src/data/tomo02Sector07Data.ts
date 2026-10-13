// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 07: SYSMMAIN Y CACHÉ // UNO DE LOS TEMAS MÁS MAL ENTENDIDOS DE WINDOWS

export type RiskLevelSector07 = 'MONITOR_ONLY' | 'CONFIG_MODIFY_RISK' | 'PROCESS_TERMINATION_RISK';

export interface Sector07Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  tabOrMetric: string;
  riskLevel: RiskLevelSector07;
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
    powershellCommand?: string;
    cmdCommand?: string;
    guiPath?: string;
    whatToLookFor: string;
  };
  alertaEVO: {
    falsePositiveWarning: string;
    reversibilityRule: string;
  };
  evidenceBadge: {
    code: string;
    label: string;
    defaultProvenance?: string;
  };
}

export interface Sector07MiniCase {
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

export interface Sector07TestQuestion {
  id: string;
  questionNumber: number;
  category: 'SUPERFETCH_SYSMAIN' | 'PRECARGA_CACHE' | 'HARDWARE_HDD_SSD' | 'DIAGNÓSTICO_AB';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_07_INVESTIGATIONS: Sector07Investigation[] = [
  {
    id: 'inv-07-01',
    code: '07.01',
    title: 'Qué era SuperFetch',
    subtitle: 'El origen histórico del algoritmo de precarga de memoria y la transición de nombre hacia SysMain en Windows 10',
    tabOrMetric: 'Servicio SuperFetch -> Renombrado a SysMain',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En versiones antiguas de Windows (Vista/7/8) leías sobre "SuperFetch". En Windows 10/11 buscas ese servicio en services.msc y no aparece. ¿A dónde fue?',
      mythVsTruth: {
        mentira: 'SuperFetch fue eliminado por Microsoft por ser inservible y reemplazado por un programa totalmente diferente.',
        verdad: 'SuperFetch no desapareció: fue renombrado a "SysMain" en la actualización de octubre de 2018 de Windows 10, manteniendo la evolución de su algoritmo de precarga inteligente.',
        comprobalo: 'Abre `services.msc` -> Busca "SysMain". Verás que su nombre interno sigue siendo `SysMain` (anteriormente registrado como `sysmain`).',
      },
    },
    entende: {
      queEs: 'El motor de gestión de caché previa de memoria introducido originalmente en Windows Vista para superar la lentitud del almacenamiento secundario.',
      paraQueSirve: 'SuperFetch analizaba los patrones de hora y frecuencia con los que el usuario abría programas para precargar sus archivos de código en la RAM libre.',
      quePasaSiFalta: 'Tratarlos como dos servicios independientes actuales es un error histórico: hoy solo existe el servicio SysMain.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "SysMain" | Select-Object Name, DisplayName, Status, StartType',
      cmdCommand: 'sc query SysMain',
      guiPath: 'services.msc -> Servicio SysMain',
      whatToLookFor: 'Comprueba que el nombre de pantalla es SysMain y el nombre del servicio interno es `SysMain`.',
    },
    alertaEVO: {
      falsePositiveWarning: 'No busques "SuperFetch" en guías modernas de Windows 11; cualquier tutorial que mencione apagar SuperFetch y SysMain por separado está desactualizado.',
      reversibilityRule: 'Ajuste gestionable desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-07-01',
      label: 'SUPERFETCH_TO_SYSMAIN_TRANSITION',
      defaultProvenance: 'SERVICES_SYSMAIN_HISTORY',
    },
  },
  {
    id: 'inv-07-02',
    code: '07.02',
    title: 'Qué hace SysMain hoy',
    subtitle: 'El rol actual de SysMain en la gestión de precarga, compresión de memoria y patrones de uso',
    tabOrMetric: 'Servicio SysMain (Modo de operación moderno)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'SysMain hoy no se limita a precargar archivos completos. Interactúa con el Administrador de Memoria para gestionar la compresión de RAM y la caché Standby.',
      mythVsTruth: {
        mentira: 'SysMain es un proceso simple que copia archivos pesados a la RAM de forma tonta y constante.',
        verdad: 'SysMain opera un modelo estocástico continuo: analiza qué aplicaciones abres a ciertas horas, qué librerías DLL comparten y gestiona la lista de páginas en Standby.',
        comprobalo: 'En `services.msc` -> Observa el estado de SysMain. Revisa que su ejecutable es `svchost.exe -k sysmainGroup`.',
      },
    },
    entende: {
      queEs: 'El subsistema de optimización de memoria que adapta dinámicamente la memoria RAM disponible para acelerar la respuesta del sistema.',
      paraQueSirve: 'Mantiene las páginas de memoria más probables de ser reusadas en la lista Standby para evitar lecturas lentas a almacenamiento.',
      quePasaSiFalta: 'Si se deshabilita, Windows confiará exclusivamente en las lecturas directas a demanda del disco cuando abras una aplicación.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Where-Object {$_.Path -like "*sysmain*"}',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria -> En caché',
      whatToLookFor: 'Verifica en el Monitor de Recursos cómo la memoria "En caché" se llena dinámicamente.',
    },
    alertaEVO: {
      falsePositiveWarning: 'SysMain adapta su agresividad según la presión de memoria RAM disponible y el tipo de almacenamiento.',
      reversibilityRule: 'Reversible desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-07-02',
      label: 'SYSMAIN_MODERN_OPERATION',
      defaultProvenance: 'KERNEL_SYSMAIN_ENGINE',
    },
  },
  {
    id: 'inv-07-03',
    code: '07.03',
    title: 'Precarga',
    subtitle: 'El flujo de anticipación: Diferencias clave entre Precarga, Caché, Launch y archivos Prefetch (.pf)',
    tabOrMetric: 'Archivos .pf en C:\\Windows\\Prefetch',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En `C:\\Windows\\Prefetch` ves cientos de archivos con extensión `.pf`. ¿Son basura que se debe borrar todos los días o archivos esenciales de aceleración?',
      mythVsTruth: {
        mentira: 'Borrar la carpeta C:\\Windows\\Prefetch vacía la memoria y hace que la computadora ande más rápida.',
        verdad: 'Borrar los archivos .pf destruye el historial de optimización. Windows tendrá que reconstruir cada índice desde cero, volviendo el inicio de aplicaciones MÁS LENTO.',
        comprobalo: 'Explorá `C:\\Windows\\Prefetch`. Verás archivos como `CHROME.EXE-ABCD1234.pf` que contienen el mapa de bloques de lectura.',
      },
    },
    entende: {
      queEs: 'El mecanismo por el cual Windows guarda un mapa de los sectores exactos de disco que lee cada aplicación al iniciar.',
      paraQueSirve: 'Permite realizar una lectura secuencial contigua agrupada (Prefetch) en lugar de cientos de lecturas aleatorias dispersas.',
      quePasaSiFalta: 'Si borras la carpeta Prefetch, la próxima vez que abras cualquier programa tardará considerablemente más tiempo.',
    },
    interactua: {
      powershellCommand: 'Get-ChildItem -Path "C:\\Windows\\Prefetch" -Filter "*.pf" | Select-Object -First 10 Name, Length, LastWriteTime',
      cmdCommand: 'dir C:\\Windows\\Prefetch\\*.pf',
      guiPath: 'Explorador de archivos -> `C:\\Windows\\Prefetch`',
      whatToLookFor: 'Observa la fecha de modificación reciente de los archivos .pf correspondientes a las apps que abriste.',
    },
    alertaEVO: {
      falsePositiveWarning: 'REGLA INVIOLABLE EVO: Jamás uses limpiadores automáticos que borren la carpeta Prefetch.',
      reversibilityRule: 'Windows reconstruirá los archivos .pf automáticamente con el tiempo si fueron borrados por error.',
    },
    evidenceBadge: {
      code: 'EVD-07-03',
      label: 'PREFETCH_MAP_OPTIMIZATION',
      defaultProvenance: 'WINDOWS_PREFETCH_FILES',
    },
  },
  {
    id: 'inv-07-04',
    code: '07.04',
    title: 'RAM libre como caché',
    subtitle: 'Por qué la RAM no utilizada es RAM desperdiciada: Free vs Available vs Standby vs Cached',
    tabOrMetric: 'Administrador de Tareas -> Rendimiento -> Memoria',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Tienes 16 GB de RAM y ves "En uso: 6 GB, En caché: 9 GB, Libre: 1 GB". Crees que te queda solo 1 GB de memoria. ¡Gran error de lectura!',
      mythVsTruth: {
        mentira: 'Tener mucha "RAM Libre" es el objetivo principal para que la computadora vuele.',
        verdad: 'La memoria "En caché" (Standby) cuenta como MEMORIA DISPONIBLE. Si una app pesada requiere RAM, Windows libera la caché al instante sin demora.',
        comprobalo: 'En Administrador de tareas -> Rendimiento -> Memoria -> Revisa el campo "Disponible" (Suma de Libre + Standby).',
      },
    },
    entende: {
      queEs: 'La arquitectura de memoria de Windows que aprovecha los gigabytes de RAM que no usas para acelerar archivos sin restar capacidad.',
      paraQueSirve: 'Permite abrir documentos y programas al instante reutilizando los bloques de RAM que de otro modo estarían vacíos en cero.',
      quePasaSiFalta: 'Querer tener "0 MB en caché" obliga al procesador a ir a buscar todo al disco rígido o SSD constantemente.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory, TotalVisibleMemorySize',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria',
      whatToLookFor: 'Compara "Disponible" (Available) contra "Libre" (Free). Verás que Disponible es mucho mayor.',
    },
    alertaEVO: {
      falsePositiveWarning: 'No te asustes si ves la barra de "En caché" llena casi al 100%; es síntoma de un Administrador de Memoria eficiente.',
      reversibilityRule: 'Comportamiento nativo del Kernel Memory Manager.',
    },
    evidenceBadge: {
      code: 'EVD-07-04',
      label: 'STANDBY_CACHE_AVAILABLE_RAM',
      defaultProvenance: 'TASKMGR_MEMORY_STATES',
    },
  },
  {
    id: 'inv-07-05',
    code: '07.05',
    title: 'HDD vs SSD',
    subtitle: 'Latencia de acceso aleatorio, tiempos de búsqueda (seek) y por qué la precarga tenía un impacto masivo en discos mecánicos',
    tabOrMetric: 'Comparativa Tecnológica HDD vs SSD',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En un disco mecánico (HDD), mover el cabezal físico para leer 100 archivos pequeños requiere 10 a 15 milisegundos por búsqueda. En un SSD, la latencia es casi cero.',
      mythVsTruth: {
        mentira: 'SysMain funciona exactamente de la misma manera y causa los mismos problemas en un disco HDD que en un SSD.',
        verdad: 'En HDDs, la precarga de SysMain agrupaba lecturas en bloques contiguos para evitar saltos mecánicos. Si el HDD está muy fragmentado, SysMain puede generar picos de disco.',
        comprobalo: 'Compara el tiempo de respuesta en ms del disco en el Administrador de tareas entre un HDD (15-50 ms) y un SSD (&lt; 1 ms).',
      },
    },
    entende: {
      queEs: 'La diferencia fundamental de velocidad de IOPS (Operaciones de E/S por segundo) y latencia entre almacenamiento magnético y flash.',
      paraQueSirve: 'Explica por qué SysMain era crucial en la era de los discos giratorios mecánicos.',
      quePasaSiFalta: 'Si un HDD tiene baja velocidad de lectura aleatoria, la precarga ayuda enormemente una vez completada.',
    },
    interactua: {
      powershellCommand: 'Get-PhysicalDisk | Select-Object DeviceId, MediaType, OperationalStatus',
      guiPath: 'Administrador de tareas -> Rendimiento -> Disco',
      whatToLookFor: 'Identifica el `MediaType` (HDD vs SSD) en tus discos instalados.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si un disco HDD muestra 100% de uso activo con solo 2 MB/s de velocidad, el cuello de botella es la LATENCIA de búsqueda aleatoria, no la tasa de transferencia.',
      reversibilityRule: 'Evaluación basada en hardware físico.',
    },
    evidenceBadge: {
      code: 'EVD-07-05',
      label: 'HDD_VS_SSD_LATENCY_DIFFERENCE',
      defaultProvenance: 'PHYSICAL_STORAGE_SPECS',
    },
  },
  {
    id: 'inv-07-06',
    code: '07.06',
    title: 'SSD NVMe',
    subtitle: 'Unidades NVMe de ultra alta velocidad: Por qué tener un SSD rápido NO convierte automáticamente a SysMain en inútil',
    tabOrMetric: 'Almacenamiento NVMe PCI Express',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Tu SSD NVMe lee a 7.000 MB/s. Piensas: "Con semejante velocidad, no necesito nada en caché de RAM". ¿Es totalmente cierto?',
      mythVsTruth: {
        mentira: 'En SSDs NVMe de última generación, mantener SysMain activo destruye el SSD por exceso de escrituras.',
        verdad: 'Incluso el NVMe más rápido tiene una latencia de ~50 microsegundos, mientras que la RAM responde en ~10 nanosegundos (5.000 veces más rápida). Además SysMain realiza LECTURAS, no escrituras masivas.',
        comprobalo: 'Revisa en la pestaña Rendimiento que SysMain en un SSD NVMe consume menos del 0.1% de tiempo activo de disco.',
      },
    },
    entende: {
      queEs: 'La integración de SysMain en sistemas con unidades de almacenamiento de estado sólido PCIe NVMe.',
      paraQueSirve: 'En SSDs, Windows ajusta la agresividad de SysMain para evitar cualquier impacto visual en el explorador.',
      quePasaSiFalta: 'Mantener SysMain en un SSD NVMe no desgasta el disco porque la precarga lee datos desde el disco a la RAM, no escribe.',
    },
    interactua: {
      powershellCommand: 'Get-PhysicalDisk | Where-Object MediaType -eq "SSD"',
      guiPath: 'Administrador de tareas -> Rendimiento -> Disco SSD',
      whatToLookFor: 'Verifica la latencia de respuesta del SSD (debe ser menor a 1 ms).',
    },
    alertaEVO: {
      falsePositiveWarning: 'Desmentido de mito: SysMain NO destruye la vida útil de los discos SSDs.',
      reversibilityRule: 'Ajuste nativo optimizado para memoria Flash.',
    },
    evidenceBadge: {
      code: 'EVD-07-06',
      label: 'NVME_SSD_SYSMAIN_COMPATIBILITY',
      defaultProvenance: 'NVME_STORAGE_BENCHMARK',
    },
  },
  {
    id: 'inv-07-07',
    code: '07.07',
    title: 'SysMain y disco 100%',
    subtitle: 'El mito del "100% de tiempo activo": Por qué 100% Active Time NO significa estar transfiriendo a máxima velocidad',
    tabOrMetric: 'Administrador de Tareas -> Columna "Tiempo activo" de Disco',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'En un disco HDD ves "Uso de disco: 100%", pero la velocidad de transferencia dice solo "1.2 MB/s". Crees que un virus o SysMain saturó la red SATA. ¿Qué ocurre realmente?',
      mythVsTruth: {
        mentira: '100% de uso de disco significa que se está saturando el ancho de banda máximo de megabytes por segundo del disco.',
        verdad: '100% Active Time significa que el controlador del disco está ocupado respondiendo peticiones el 100% del tiempo, aunque sean lecturas diminutas de 4 KB con alta cola de espera (Queue Depth).',
        comprobalo: 'En Monitor de recursos (`resmon.exe`) -> Pestaña Disco -> Observa el parámetro "Tiempo de respuesta (ms)" y "Cola de disco".',
      },
    },
    entende: {
      queEs: 'La métrica de ocupación del canal de comandos de E/S del almacenamiento.',
      paraQueSirve: 'Un disco con alta latencia de búsqueda (ej. un HDD mecánico con sectores lentos) estará al 100% de tiempo activo atendiendo pocas operaciones.',
      quePasaSiFalta: 'Antes de culpar a SysMain, se debe usar la Metodología EVO: Identificar qué proceso, qué archivo, qué I/O y durante cuánto tiempo.',
    },
    interactua: {
      powershellCommand: 'Get-[#resmon]',
      cmdCommand: 'resmon.exe',
      guiPath: 'Monitor de recursos -> Pestaña Disco -> Procesos con actividad de disco',
      whatToLookFor: 'Ordena la lista por "Total (B/s)" y "Tiempo de respuesta" para ver el proceso causante real.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si el uso al 100% de disco dura 2 minutos al encender la PC y luego cae a 0%, es el Mantenimiento Automático inicial normal.',
      reversibilityRule: 'Aplica diagnóstico pericial antes de deshabilitar servicios.',
    },
    evidenceBadge: {
      code: 'EVD-07-07',
      label: 'DISK_100_PERCENT_ACTIVE_TIME',
      defaultProvenance: 'RESMON_DISK_METRICS',
    },
  },
  {
    id: 'inv-07-08',
    code: '07.08',
    title: 'SysMain y poca RAM',
    subtitle: 'El comportamiento de SysMain en equipos con 4 GB u 8 GB de RAM: Presión de memoria, reclamo y compresión',
    tabOrMetric: 'Comportamiento en escenarios de baja memoria física',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En un equipo con solo 4 GB de RAM, abrir 5 pestañas de navegador llena la memoria física. ¿Cómo reacciona SysMain bajo esta presión de memoria?',
      mythVsTruth: {
        mentira: 'SysMain sigue metiendo archivos a la RAM a ciegas hasta provocar un cuelgue por falta de memoria.',
        verdad: 'Ante alta Presión de Memoria (Memory Pressure), el Administrador de Memoria ordena a SysMain reducir o purgar la lista Standby para ceder la RAM a las apps activas.',
        comprobalo: 'Abre un programa pesado en un equipo con poca RAM: verás cómo la memoria "En caché" se reduce instantáneamente a casi cero.',
      },
    },
    entende: {
      queEs: 'El mecanismo de autorregulación de caché de Windows bajo restricción de RAM física.',
      paraQueSirve: 'Garantiza que las aplicaciones en primer plano (Working Sets) siempre tengan prioridad absoluta sobre la precarga en caché.',
      quePasaSiFalta: 'En el Sector 08 profundizaremos en los detalles de Memory Compression, Working Sets y Pagefile.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 ProcessName, WorkingSet64',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria',
      whatToLookFor: 'Observa cómo se achica la franja de caché cuando el "En uso" sube.',
    },
    alertaEVO: {
      falsePositiveWarning: 'En equipos con 4 GB de RAM, el problema de fondo es la falta de memoria física para los navegadores modernos, no la existencia de SysMain.',
      reversibilityRule: 'Autorregulación del Kernel de Windows.',
    },
    evidenceBadge: {
      code: 'EVD-07-08',
      label: 'MEMORY_PRESSURE_CACHE_PURGE',
      defaultProvenance: 'KERNEL_MEMORY_REGULATION',
    },
  },
  {
    id: 'inv-07-09',
    code: '07.09',
    title: 'Cuándo probar desactivarlo',
    subtitle: 'El árbol de decisión pericial EVO: Síntoma reproducible -> Evidencia -> Baseline -> Prueba A/B',
    tabOrMetric: 'Árbol de Decisión Diagnóstica de SysMain',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: '¿Cuándo tiene sentido técnico probar deshabilitar SysMain? NUNCA por receta mágica; ÚNICAMENTE tras seguir un árbol de decisión pericial con evidencia.',
      mythVsTruth: {
        mentira: 'Hay que desactivar SysMain inmediatamente después de instalar Windows en todas las computadoras.',
        verdad: 'Solo se justifica auditar SysMain si existe un SÍNTOMA REPRODUCIBLE de congelamiento de disco constante respaldado por resmon.exe en un disco HDD específico.',
        comprobalo: 'Sigue el árbol de decisión: ¿Existe síntoma? -> ¿Existe evidencia en resmon? -> ¿Es un HDD? -> Prueba A/B.',
      },
    },
    entende: {
      queEs: 'El protocolo pericial para decidir la modificación controlada del servicio SysMain.',
      paraQueSirve: 'Evita aplicar cambios irreflexivos que empeoren el rendimiento general del sistema.',
      quePasaSiFalta: 'Garantiza que cualquier modificación sea una decisión informada basada en datos.',
    },
    interactua: {
      powershellCommand: '# Árbol de decisión: Síntoma -> Evidencia -> Baseline -> Prueba A/B -> Medir -> Conservar/Revertir',
      guiPath: 'Protocolo de diagnóstico pericial EVO',
      whatToLookFor: 'Verifica la existencia de evidencia técnica en resmon antes de tocar el servicio.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si no hay síntoma ni congelamiento, NO TOCAR SysMain.',
      reversibilityRule: 'Cualquier prueba debe poder ser revertida si no genera beneficio medible.',
    },
    evidenceBadge: {
      code: 'EVD-07-09',
      label: 'SYSMAIN_DECISION_TREE',
      defaultProvenance: 'EVO_DIAGNOSTIC_PROTOCOL',
    },
  },
  {
    id: 'inv-07-10',
    code: '07.10',
    title: 'Cómo medir antes/después',
    subtitle: 'El protocolo de prueba A/B: Baseline, Cambio único, Mismo escenario, Segunda medición y Delta de rendimiento',
    tabOrMetric: 'Protocolo de Medición Científica A/B',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Para saber si deshabilitar SysMain realmente mejoró tu sistema o fue puro placebo, debes medir con la Metodología A/B de EVO LABS.',
      mythVsTruth: {
        mentira: 'Saber si la PC quedó más rápida se determina "a ojo" o por la sensación al mover el mouse.',
        verdad: 'El ojo humano es víctima fácil del efecto placebo. La Metodología A/B mide tiempos exactos en segundos de apertura de apps y latencia de disco en ms.',
        comprobalo: 'A) Mide tiempo de apertura de app con SysMain -> B) Deshabilita SysMain -> C) Reinicia y mide la misma app -> D) Compara el Delta.',
      },
    },
    entende: {
      queEs: 'El método científico de prueba pareada donde solo se altera UNA variable manteniendo constante el resto del entorno.',
      paraQueSirve: 'Elimina el sesgo de confirmación del técnico o usuario.',
      quePasaSiFalta: 'Proporciona una cifra objetiva (Delta): ej. "Tardó +1.5 segundos en abrir" (peor) o "-0.8 segundos" (mejor).',
    },
    interactua: {
      powershellCommand: 'Measure-Command { Start-Process "notepad.exe" -Wait }',
      guiPath: 'Consola de prueba A/B de EVO LABS',
      whatToLookFor: 'Calcula el Delta de diferencia entre el estado A (Baseline) y el estado B (Modificado).',
    },
    alertaEVO: {
      falsePositiveWarning: 'Recuerda reiniciar el equipo entre pruebas para purgar la caché física de RAM.',
      reversibilityRule: 'Si el Delta es negativo o igual a cero, revierte el cambio.',
    },
    evidenceBadge: {
      code: 'EVD-07-10',
      label: 'AB_TESTING_MEASUREMENT_PROTOCOL',
      defaultProvenance: 'BENCHMARK_AB_SCIENTIFIC',
    },
  },
  {
    id: 'inv-07-11',
    code: '07.11',
    title: 'Cómo volver atrás',
    subtitle: 'La reversibilidad garantizada: El flujo de restauración del servicio SysMain a su estado óptimo predeterminado',
    tabOrMetric: 'Procedimiento de Reversión (Rollback)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Probaste deshabilitar SysMain en la prueba A/B y descubriste que las aplicaciones tardan más en abrir. ¿Cómo se revierte el cambio al estado perfecto original?',
      mythVsTruth: {
        mentira: 'Una vez que deshabilitas un servicio de Windows, el sistema queda dañado permanentemente y no se puede restaurar.',
        verdad: 'Restaurar SysMain toma 10 segundos: se vuelve a configurar el Tipo de inicio en "Automático" (o Automático con Inicio Retrasado) y se inicia el servicio.',
        comprobalo: 'En `services.msc` -> Haz doble clic en SysMain -> Cambia Tipo de inicio a "Automático" -> Clic en "Iniciar" -> Aplicar.',
      },
    },
    entende: {
      queEs: 'El protocolo de retorno al estado baseline cuando la hipótesis de optimización no genera un beneficio comprobado.',
      paraQueSirve: 'Garantiza la seguridad operativa de las auditorías periciales.',
      quePasaSiFalta: 'Forma parte indispensable de las buenas prácticas de la ingeniería de sistemas.',
    },
    interactua: {
      powershellCommand: 'Set-Service -Name "SysMain" -StartupType Automatic; Start-Service -Name "SysMain"',
      cmdCommand: 'sc config SysMain start= auto & net start SysMain',
      guiPath: 'services.msc -> SysMain -> Propiedades -> Automático -> Iniciar',
      whatToLookFor: 'Verifica que el estado vuelva a ser "En ejecución" y Tipo de inicio "Automático".',
    },
    alertaEVO: {
      falsePositiveWarning: 'En EVO LABS la reversión no es una nota al pie; es la mitad de la metodología pericial.',
      reversibilityRule: 'Reversibilidad 100% garantizada por la API de servicios de Windows.',
    },
    evidenceBadge: {
      code: 'EVD-07-11',
      label: 'SYSMAIN_ROLLBACK_PROCEDURE',
      defaultProvenance: 'SERVICES_RESTORE_AUTOMATIC',
    },
  },
];

export const SECTOR_07_MINICASES: Sector07MiniCase[] = [
  {
    id: 'case-07-a',
    code: 'CASO 07-A',
    title: 'El mito del limpiador de Prefetch',
    scenario: 'Un usuario instaló una herramienta "aceleradora" que borra la carpeta C:\\Windows\\Prefetch cada vez que se apaga la PC. Nota que ahora todas las aplicaciones tardan el doble de tiempo en abrir.',
    userStatement: '“Puse un programa para limpiar los archivos .pf viejos para liberar disco pero ahora Chrome tarda 8 segundos en abrir.”',
    initialMistake: 'Creer que los archivos de mapa .pf son basura no deseada que debe ser eliminada periódicamente.',
    diagnosticQuestion: '¿Por qué la eliminación continua de la carpeta Prefetch ralentizó la apertura de las aplicaciones?',
    options: [
      {
        id: 'c7_a1',
        text: 'Porque obligó a Windows a destruir los mapas de lectura contigua de disco, forzando a la PC a hacer cientos de lecturas aleatorias lentas para reconstruir los índices cada vez.',
        isCorrect: true,
        explanation: 'Los archivos .pf organizan las lecturas para acelerar el inicio. Borrarlos obliga al sistema a reindexar desde cero.',
      },
      {
        id: 'c7_a2',
        text: 'Porque el disco rígido se quedó sin espacio de almacenamiento.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se desinstaló la herramienta limpiadora. En 3 días Windows volvió a generar los archivos .pf de precarga y el tiempo de inicio cayó a 1.5 segundos.',
    lessonLearned: 'Jamás borres la carpeta C:\\Windows\\Prefetch. Los archivos .pf son mapas de aceleración, no basura.',
  },
  {
    id: 'case-07-b',
    code: 'CASO 07-B',
    title: 'El susto de la memoria "En caché"',
    scenario: 'Un diseñador ve en el Administrador de Tareas: "En uso: 7 GB, En caché: 8 GB, Libre font-mono: 500 MB" en un sistema de 16 GB. Compra un módulo de RAM nuevo creyendo que le queda solo 500 MB libres.',
    userStatement: '“Tengo solo 500 MB de RAM libre y mi PC se va a colgar si abro Photoshop.”',
    initialMistake: 'Malinterpretar la barra de memoria del Administrador de Tareas sumando solo la memoria totalmente "Libre" (Zeroed).',
    diagnosticQuestion: '¿Qué representa realmente la cifra "En caché" (Standby) en el Administrador de Memoria de Windows?',
    options: [
      {
        id: 'c7_b1',
        text: 'Es memoria RAM DISPONIBLE reutilizable al instante. Windows guarda datos en Standby para acelerar apps, pero se libera sin demora si Photoshop pide más RAM.',
        isCorrect: true,
        explanation: 'Memoria Disponible = Libre + En Caché (Standby). No había ninguna falta de memoria RAM física.',
      },
      {
        id: 'c7_b2',
        text: 'Es memoria RAM dañada que requiere ser reemplazada físicamente.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'No se requería comprar más RAM. El sistema funcionaba con una gestión de caché perfecta.',
    lessonLearned: 'RAM libre es RAM desperdiciada. La memoria Standby en Caché es RAM disponible rápida.',
  },
  {
    id: 'case-07-c',
    code: 'CASO 07-C',
    title: 'SysMain en un disco HDD antiguo',
    scenario: 'Un equipo de oficina antiguo con disco HDD mecánico de 5400 RPM muestra 100% de uso de disco durante 20 minutos seguidos después de encender. En resmon.exe, el proceso `svchost.exe (SysMain)` registra lecturas continuas.',
    userStatement: '“La PC está congelada 20 minutos al prender porque el disco está al 100%.”',
    initialMistake: 'Ignorar que el disco es un HDD de baja velocidad muy fragmentado y culpar a un virus.',
    diagnosticQuestion: 'Siguiendo el Árbol de Decisión EVO, ¿cuál es el procedimiento adecuado para evaluar SysMain en este HDD específico?',
    options: [
      {
        id: 'c7_c1',
        text: 'Registrar un Baseline del tiempo de encendido -> Deshabilitar SysMain temporalmente -> Reiniciar y medir de nuevo en la prueba A/B -> Evaluar si el tiempo activo de disco cae sin perjudicar la apertura de apps.',
        isCorrect: true,
        explanation: 'En HDDs mecánicos antiguos muy lentos, deshabilitar SysMain tras la prueba A/B puede reducir los picos de lectura iniciales.',
      },
      {
        id: 'c7_c2',
        text: 'Formatear el disco duro de inmediato sin medir.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'La prueba A/B confirmó que en este HDD específico, deshabilitar SysMain eliminó los 20 minutos de congelamiento inicial. (La solución definitiva recomendada fue migrar a SSD).',
    lessonLearned: 'Usa la prueba A/B con evidencia en resmon para tomar decisiones justificadas en hardware legacy.',
  },
  {
    id: 'case-07-d',
    code: 'CASO 07-D',
    title: 'El mito del SSD NVMe destruido',
    scenario: 'Un gamer armó una PC con un SSD NVMe PCIe 4.0 de 7000 MB/s. Leyó en un foro que "debe desactivar SysMain inmediatamente o el servicio le destruirá el SSD por escribir demasiado".',
    userStatement: '“Tengo un NVMe caro y no quiero que SysMain me lo rompa escribiendo datos en el disco.”',
    initialMistake: 'Creer la mentira de que el servicio SysMain realiza escrituras masivas en el almacenamiento.',
    diagnosticQuestion: '¿Por qué la afirmación de que SysMain desgasta el SSD por escrituras es falsa?',
    options: [
      {
        id: 'c7_d1',
        text: 'Porque SysMain realiza LECTURAS de archivos desde el SSD hacia la memoria RAM. No escribe datos masivos en el SSD.',
        isCorrect: true,
        explanation: 'SysMain precarga datos leyendo del disco a la RAM. Leer datos de un SSD no consume su vida útil de escritura (TBW).',
      },
      {
        id: 'c7_d2',
        text: 'Porque los SSDs NVMe no usan electricidad.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Mito de foro desmentido con métricas de Monitor de Recursos: 0 MB de escritura registrados por SysMain en el SSD.',
    lessonLearned: 'SysMain lee del disco a la RAM; no desgasta la vida útil de escritura (TBW) del SSD.',
  },
  {
    id: 'case-07-e',
    code: 'CASO 07-E',
    title: 'La prueba A/B con resultado negativo',
    scenario: 'Un técnico deshabilitó SysMain en una laptop moderna con SSD SATA. Midió el tiempo de apertura de Photoshop antes (1.8 s) y después (3.5 s).',
    userStatement: '“Deshabilité SysMain pero ahora el programa tarda casi el doble en abrir.”',
    initialMistake: 'No aplicar el Paso de Reversión (Rollback) de la metodología EVO al obtener un resultado A/B negativo.',
    diagnosticQuestion: '¿Qué acción de la metodología EVO corresponde tomar de inmediato?',
    options: [
      {
        id: 'c7_e1',
        text: 'Aplicar el protocolo de Reversión (Rollback): Volver a configurar SysMain en Automático e iniciarlo, ya que la prueba A/B demostró que SysMain AHORRABA 1.7 segundos de carga.',
        isCorrect: true,
        explanation: 'Si la prueba A/B muestra que la modificación empeoró el rendimiento, la regla pericial exige revertir el cambio al baseline original.',
      },
      {
        id: 'c7_e2',
        text: 'Dejar el servicio deshabilitado y decirle al usuario que se acostumbre.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se revirtió SysMain a Automático. El tiempo de apertura regresó a los 1.8 segundos originales.',
    lessonLearned: 'La reversión inmediata ante un resultado A/B negativo es el pilar de la ingeniería pericial.',
  },
];

export const SECTOR_07_TEST_BANK: Sector07TestQuestion[] = [
  {
    id: 't07-q01',
    questionNumber: 1,
    category: 'SUPERFETCH_SYSMAIN',
    question: '¿Qué ocurrió con el servicio históricamente conocido como SuperFetch en las versiones modernas de Windows 10/11?',
    options: [
      { id: 'opt_1', text: 'Fue renombrado oficialmente a "SysMain", manteniendo la evolución de su motor de precarga' },
      { id: 'opt_2', text: 'Fue eliminado completamente y prohibido por Microsoft' },
      { id: 'opt_3', text: 'Se convirtió en un ejecutable de tarjeta gráfica' },
      { id: 'opt_4', text: 'Se integró dentro del navegador Internet Explorer' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'SuperFetch fue renombrado a SysMain en la actualización 1809 de Windows 10. Son el mismo linaje de servicio.',
    relatedInvestigationCode: '07.01',
  },
  {
    id: 't07-q02',
    questionNumber: 2,
    category: 'PRECARGA_CACHE',
    question: '¿Por qué la memoria RAM en estado "Standby" (En caché) cuenta como memoria DISPONIBLE en Windows?',
    options: [
      { id: 'opt_1', text: 'Porque guarda datos cacheados para acelerar lecturas pero se libera instantáneamente si una app requiere RAM física' },
      { id: 'opt_2', text: 'Porque es memoria virtual almacenada en un pendrive USB' },
      { id: 'opt_3', text: 'Porque está reservada exclusivamente para la placa de video' },
      { id: 'opt_4', text: 'Porque es memoria RAM que fue borrada del equipo' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'La memoria Standby es RAM disponible productiva: acelera el acceso a datos y se purga al instante si otra app necesita RAM.',
    relatedInvestigationCode: '07.04',
  },
  {
    id: 't07-q03',
    questionNumber: 3,
    category: 'HARDWARE_HDD_SSD',
    question: '¿Por qué SysMain NO destruye la vida útil de escritura (TBW) de las unidades de estado sólido SSD NVMe?',
    options: [
      { id: 'opt_1', text: 'Porque SysMain realiza LECTURAS de datos desde el SSD hacia la RAM; no realiza escrituras masivas en el SSD' },
      { id: 'opt_2', text: 'Porque los SSDs NVMe no almacenan archivos' },
      { id: 'opt_3', text: 'Porque SysMain se apaga automáticamente cuando detecta un SSD' },
      { id: 'opt_4', text: 'Porque las lecturas aumentan la temperatura del procesador' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'SysMain precarga datos leyendo del disco hacia la memoria RAM. Las operaciones de lectura no desgastan las celdas de escritura de los SSDs.',
    relatedInvestigationCode: '07.06',
  },
  {
    id: 't07-q04',
    questionNumber: 4,
    category: 'DIAGNÓSTICO_AB',
    question: 'En el Administrador de Tareas, ¿qué significa que la columna "Tiempo activo" de un disco HDD marque 100%?',
    options: [
      { id: 'opt_1', text: 'Que el controlador del disco está ocupado el 100% del tiempo procesando peticiones de E/S, independientemente de la velocidad en MB/s' },
      { id: 'opt_2', text: 'Que el disco está transfiriendo a la velocidad máxima teórica de 600 MB/s de la interfaz SATA' },
      { id: 'opt_3', text: 'Que el disco duro está lleno de archivos al 100% de su capacidad en GB' },
      { id: 'opt_4', text: 'Que el motor del disco se rompió' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: '100% Active Time indica ocupación del canal de comandos de E/S. Un disco mecánico con alta latencia de búsqueda estará al 100% activo aun con lecturas pequeñas de pocos KB/s.',
    relatedInvestigationCode: '07.07',
  },
  {
    id: 't07-q05',
    questionNumber: 5,
    category: 'DIAGNÓSTICO_AB',
    question: 'Si en una prueba A/B de SysMain descubres que las aplicaciones tardan MÁS tiempo en abrir con el servicio deshabilitado, ¿qué exige la regla pericial EVO?',
    options: [
      { id: 'opt_1', text: 'Ejecutar el protocolo de Reversión (Rollback) para restaurar SysMain a Automático inmediatamente' },
      { id: 'opt_2', text: 'Dejar el servicio deshabilitado de todos modos' },
      { id: 'opt_3', text: 'Borrar la carpeta System32' },
      { id: 'opt_4', text: 'Comprar una computadora nueva' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'Si el Delta de rendimiento es negativo (empeoró), la metodología pericial exige revertir el cambio al baseline original.',
    relatedInvestigationCode: '07.11',
  },
];
