// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 08: MEMORIA COMPLETA // MUCHO MÁS QUE “TENGO 16 GB”

export type RiskLevelSector08 = 'MONITOR_ONLY' | 'CONFIG_MODIFY_RISK' | 'PROCESS_TERMINATION_RISK';

export interface Sector08Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  tabOrMetric: string;
  riskLevel: RiskLevelSector08;
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

export interface Sector08MiniCase {
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

export interface Sector08TestQuestion {
  id: string;
  questionNumber: number;
  category: 'MEMORIA_VIRTUAL_COMMIT' | 'WORKING_SETS_POOLS' | 'FAULTS_LEAKS' | 'PAGEFILE_CLEANERS';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_08_INVESTIGATIONS: Sector08Investigation[] = [
  {
    id: 'inv-08-01',
    code: '08.01',
    title: 'RAM física',
    subtitle: 'DIMMs, capacidad instalada, memoria usable y memoria reservada para hardware',
    tabOrMetric: 'Propiedades del sistema -> Memoria instalada (RAM)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Instalas 16 GB de RAM en tu motherboard pero Windows dice "16 GB (13.8 GB usable)". ¿A dónde se fueron los 2.2 GB faltantes?',
      mythVsTruth: {
        mentira: 'Windows te robó memoria RAM o el módulo de memoria vino fallado de fábrica.',
        verdad: 'La diferencia la ocupa la "Memoria reservada para hardware" (iGPU, tarjetas de expansión y asignaciones PCI/MMIO del BIOS).',
        comprobalo: 'Abre Administrador de Tareas -> Rendimiento -> Memoria -> Pasa el mouse sobre el gráfico para ver "Reservada para hardware".',
      },
    },
    entende: {
      queEs: 'La capacidad total de chips semiconductor DIMM/SO-DIMM detectados por el controlador de memoria de la tarjeta madre.',
      paraQueSirve: 'Suministra el espacio de almacenamiento físico ultrarrápido para que la CPU ejecute código y datos.',
      quePasaSiFalta: 'Si la memoria reservada para hardware es excesiva (ej. 8 GB de 16 GB), se debe revisar la asignación de VRAM del iGPU en el BIOS.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_PhysicalMemory | Select-Object Capacity, Manufacturer, Speed, FormFactor',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria',
      whatToLookFor: 'Observa la velocidad (MHz), ranuras usadas y capacidad física de cada zócalo.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un valor de "Reservada para hardware" de 100-500 MB es completamente normal.',
      reversibilityRule: 'Configurable desde los ajustes de BIOS/UEFI de la placa madre.',
    },
    evidenceBadge: {
      code: 'EVD-08-01',
      label: 'PHYSICAL_RAM_HARDWARE_RESERVED',
      defaultProvenance: 'BIOS_MMIO_ALLOCATION',
    },
  },
  {
    id: 'inv-08-02',
    code: '08.02',
    title: 'Virtual Memory',
    subtitle: 'El espacio de direcciones virtual por proceso y el desmontaje del mito "Memoria Virtual = Pagefile"',
    tabOrMetric: 'Virtual Address Space (VAS)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Escuchas a muchos decir "Memoria Virtual es el archivo pagefile.sys en el disco". ¡Error conceptual grave!',
      mythVsTruth: {
        mentira: 'La Memoria Virtual es el archivo de paginación pagefile.sys que se crea en el disco duro.',
        verdad: 'La Memoria Virtual es la ABSTRACCIÓN del Kernel que le otorga a cada proceso su propio espacio de direcciones aislado (de 128 TB en 64-bit), mapeado a RAM física o disco.',
        comprobalo: 'Cada proceso en x64 cree tener la memoria completa para él solo gracias a la unidad de gestión de memoria (MMU) del procesador.',
      },
    },
    entende: {
      queEs: 'El sistema de direccionamiento lógico gestionado por el Kernel Memory Manager y la MMU del hardware.',
      paraQueSirve: 'Aísla a cada programa para que un fallo de memoria en una app no pueda sobrescribir la memoria de otra app o del SO.',
      quePasaSiFalta: 'Sin Memoria Virtual, cualquier programa podría leer tus contraseñas alojadas en la RAM de otra aplicación.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Select-Object -First 5 Name, VM, WorkingSet64',
      guiPath: 'Monitor de recursos -> Pestaña Memoria -> Columna "Virtual (KB)"',
      whatToLookFor: 'Nota cómo la Memoria Virtual (VM) de un proceso suele ser enormemente mayor a su RAM física actual.',
    },
    alertaEVO: {
      falsePositiveWarning: 'No te asustes si ves que un programa reserva 20 GB de Memoria Virtual; reservar direcciones no consume RAM física hasta que se pida Commit.',
      reversibilityRule: 'Arquitectura fundamental del sistema de 64 bits.',
    },
    evidenceBadge: {
      code: 'EVD-08-02',
      label: 'VIRTUAL_ADDRESS_SPACE_ISOLATION',
      defaultProvenance: 'MMU_VIRTUAL_MEMORY',
    },
  },
  {
    id: 'inv-08-03',
    code: '08.03',
    title: 'Commit',
    subtitle: 'Committed Virtual Memory: La promesa de respaldo garantizada de memoria que otorga el sistema',
    tabOrMetric: 'Carga comprometida (Commit Charge)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En el Administrador de Tareas lees "Comprometida: 18.2 / 32.0 GB". Tu PC tiene 16 GB de RAM. ¿Cómo es posible que esté usando 18.2 GB?',
      mythVsTruth: {
        mentira: 'Comprometida es la cantidad de memoria RAM física que se está quemando en este instante.',
        verdad: 'Commit Charge es la PROMESA TOTAL de memoria virtual que Windows garantizó a todos los programas. Combina la RAM física más el archivo de paginación.',
        comprobalo: 'Abre Administrador de tareas -> Rendimiento -> Memoria -> Revisa la cifra en "Comprometida".',
      },
    },
    entende: {
      queEs: 'La garantía de respaldo otorgada por el Administrador de Memoria de que existirá espacio (en RAM o disco) si la app escribe en esas páginas.',
      paraQueSirve: 'Permite a las aplicaciones solicitar grandes bloques de trabajo sin requerir que toda la memoria quepa físicamente en la RAM al mismo tiempo.',
      quePasaSiFalta: 'Si la carga de Commit se acerca al Límite de Commit (Commit Limit), Windows mostrará el mensaje "Se está quedando sin memoria".',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory | Select-Object CommittedBytes, CommitLimit',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria -> Comprometida',
      whatToLookFor: 'Compara CommittedBytes contra CommitLimit.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Una carga comprometida alta indica que tus programas solicitaron muchas garantías de memoria, no necesariamente que la RAM esté agotada.',
      reversibilityRule: 'Métrica dinámica del Kernel.',
    },
    evidenceBadge: {
      code: 'EVD-08-03',
      label: 'COMMIT_CHARGE_GUARANTEE',
      defaultProvenance: 'TASKMGR_COMMIT_METRIC',
    },
  },
  {
    id: 'inv-08-04',
    code: '08.04',
    title: 'Commit Limit',
    subtitle: 'El techo absoluto de memoria virtual respaldada: RAM física + Capacidad de respaldo de disco',
    tabOrMetric: 'Límite de Commit (Commit Limit)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'El Límite de Commit es la pared infranqueable del sistema. Si la Carga de Commit alcanza el Límite de Commit, los programas empezarán a estrellarse (Crash).',
      mythVsTruth: {
        mentira: 'Los programas se estrellan por falta de memoria solo cuando la RAM física llega al 100%.',
        verdad: 'Una app se estrella por falta de memoria cuando se agota el LÍMITE DE COMMIT, incluso si aún queda RAM física libre en caché.',
        comprobalo: 'Commit Limit es aproximadamente igual a: RAM Física Instalada + Tamaño del Archivo de Paginación (Pagefile).',
      },
    },
    entende: {
      queEs: 'La suma total máxima de memoria virtual garantizada que el sistema operativo puede ofrecer.',
      paraQueSirve: 'Previene que el sistema operativo acepte solicitudes de memoria que no pueda respaldar.',
      quePasaSiFalta: 'Si alcanzas el 100% de Commit Limit, verás errores `OUT_OF_MEMORY` o cierre abrupto de juegos.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_OperatingSystem | Select-Object @{N="CommitLimit_GB";E={[math]::Round(($_.TotalVirtualMemorySize/1MB),2)}}',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria -> Comprometida (Límite)',
      whatToLookFor: 'Nota cómo al aumentar el tamaño de pagefile.sys, el Commit Limit aumenta en la misma proporción.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si deshabilitas pagefile.sys, tu Commit Limit será IGUAL a tu RAM física, aumentando el riesgo de crashes por falta de memoria.',
      reversibilityRule: 'Gobernado por la configuración de memoria virtual.',
    },
    evidenceBadge: {
      code: 'EVD-08-04',
      label: 'COMMIT_LIMIT_CEILING',
      defaultProvenance: 'KERNEL_COMMIT_LIMIT',
    },
  },
  {
    id: 'inv-08-05',
    code: '08.05',
    title: 'Working Set',
    subtitle: 'El conjunto de trabajo de un proceso: Páginas de memoria física actualmente residentes en RAM',
    tabOrMetric: 'Working Set (Conjunto de Trabajo)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En el Administrador de Tareas ves que Chrome usa "800 MB de memoria". Ese número es su `Working Set`: las páginas que están físicamente vivas en los chips de RAM.',
      mythVsTruth: {
        mentira: 'El Working Set es la cantidad total de memoria que el programa ha creado en su vida.',
        verdad: 'Working Set es únicamente el subconjunto de páginas de memoria virtual del proceso que están actualmente cargadas en la RAM física en este milisegundo.',
        comprobalo: 'Si minimizas una app por mucho tiempo, el Administrador de Memoria puede recortar (Trim) su Working Set para ceder RAM a otras apps.',
      },
    },
    entende: {
      queEs: 'El bloque de memoria residente de un proceso administrado activamente por la tabla de páginas del procesador.',
      paraQueSirve: 'Garantiza que el código en ejecución no sufra page faults continuos.',
      quePasaSiFalta: 'Si el Working Set de una app es demasiado pequeño para su carga, sufrirá parálisis por Hard Faults (Thrashing).',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "chrome" -ErrorAction SilentlyContinue | Select-Object Id, WorkingSet64, PrivateMemorySize',
      guiPath: 'Monitor de recursos -> Pestaña Memoria -> Columna "Conjunto de trabajo (KB)"',
      whatToLookFor: 'Compara el Conjunto de trabajo contra la Memoria Privada de cada ejecutable.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Los "RAM Cleaners" lo único que hacen es forzar un Trim agresivo del Working Set a disco, dando la ilusión falsa de que liberaron RAM.',
      reversibilityRule: 'Proceso dinámico del Kernel Memory Manager.',
    },
    evidenceBadge: {
      code: 'EVD-08-05',
      label: 'WORKING_SET_RESIDENT_RAM',
      defaultProvenance: 'MM_WORKING_SET_TRIM',
    },
  },
  {
    id: 'inv-08-06',
    code: '08.06',
    title: 'Private Working Set',
    subtitle: 'La memoria privada exclusiva del proceso vs la memoria compartida (Shared Memory)',
    tabOrMetric: 'Conjunto de Trabajo Privado (Private Working Set)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'El Working Set de un proceso se divide en dos partes: lo que es EXCLUSIVO de ese programa (Private) y lo que COMPARTE con otros programas (Shared).',
      mythVsTruth: {
        mentira: 'Si abres 10 instancias de un programa de 100 MB, consumirás 1.000 MB de RAM física nueva.',
        verdad: 'Gracias a la memoria compartida (Shared), las 10 instancias leen las mismas librerías DLL en RAM. Solo la Memoria Privada (Private Working Set) se duplica.',
        comprobalo: 'Fórmula Canónica: `Working Set Total = Private Working Set + Shared Working Set`.',
      },
    },
    entende: {
      queEs: 'La porción de la memoria física de un proceso que no puede ser compartida con ningún otro proceso del sistema.',
      paraQueSirve: 'Contiene las variables locales, datos de usuario y estados únicos de la aplicación.',
      quePasaSiFalta: 'Es la métrica más precisa para medir el consumo real de RAM exclusivo que se liberaría al cerrar ese programa.',
    },
    interactua: {
      powershellCommand: 'Get-[#resmon]',
      guiPath: 'Monitor de recursos -> Pestaña Memoria -> Columna "Privado (KB)"',
      whatToLookFor: 'Observa la columna Privado en resmon.exe para conocer la memoria real dedicada.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Para medir el impacto de cerrar una app, mira su Private Working Set, no su Working Set total.',
      reversibilityRule: 'Métrica de desglose de memoria.',
    },
    evidenceBadge: {
      code: 'EVD-08-06',
      label: 'PRIVATE_VS_SHARED_WORKING_SET',
      defaultProvenance: 'RESMON_PRIVATE_BYTES',
    },
  },
  {
    id: 'inv-08-07',
    code: '08.07',
    title: 'Shared memory',
    subtitle: 'Páginas compartidas en RAM: Código ejecutable, DLLs del sistema y secciones mapeadas entre procesos',
    tabOrMetric: 'Memoria Compartida (Shared Memory)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Librerías fundamentales como `kernel32.dll` o `ntdll.dll` están cargadas una sola vez en la RAM física, pero 100 procesos diferentes las usan a la vez.',
      mythVsTruth: {
        mentira: 'Memoria compartida se refiere únicamente a la memoria VRAM que la placa de video integrada le quita a la RAM.',
        verdad: 'Memoria Compartida (Shared Memory) en el Administrador de Memoria es el mecanismo por el cual múltiples procesos leen la misma página física de RAM simultáneamente.',
        comprobalo: 'Abre resmon.exe y examina la columna "Compartible" y "Compartido".',
      },
    },
    entende: {
      queEs: 'Páginas de memoria virtual mapeadas a la misma dirección física de RAM para múltiples procesos.',
      paraQueSirve: 'Ahorra gigabytes de RAM al no duplicar el código ejecutable de las librerías del sistema operativo.',
      quePasaSiFalta: 'Asegura la eficiencia del ecosistema multi-proceso de Windows.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Process | Select-Object -First 5 Name, WorkingSetSize',
      guiPath: 'Monitor de recursos -> Columna "Compartido (KB)"',
      whatToLookFor: 'Observa el ahorro de memoria logrado gracias al código compartido.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si un proceso escribe en una página compartida, Windows activa Copy-On-Write (COW) y crea una copia privada automáticamente.',
      reversibilityRule: 'Mecanismo de eficiencia de memoria.',
    },
    evidenceBadge: {
      code: 'EVD-08-07',
      label: 'SHARED_PAGE_COPY_ON_WRITE',
      defaultProvenance: 'MM_SHARED_PAGES',
    },
  },
  {
    id: 'inv-08-08',
    code: '08.08',
    title: 'Cached',
    subtitle: 'Caché de sistema (Cached Memory): El uso productivo de la RAM para almacenar bloques de archivos',
    tabOrMetric: 'Memoria En Caché (System Cache)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Conectando con el Sector 07: Toda la memoria "En Caché" representa archivos de disco que Windows mantiene guardados en los chips de RAM por si los vuelves a necesitar.',
      mythVsTruth: {
        mentira: 'La memoria en caché bloquea el rendimiento del sistema y debe ser purgada constantemente.',
        verdad: 'La memoria en caché acelera las lecturas de disco. Si una app requiere esa RAM, la caché se cede en menos de 1 microsegundo.',
        comprobalo: 'Copia un archivo grande de 2 GB. Verás que la memoria en caché aumenta inmediatamente en 2 GB.',
      },
    },
    entende: {
      queEs: 'El buffer dinámico del File System Cache gestionado por el kernel.',
      paraQueSirve: 'Evita lecturas mecánicas o de almacenamiento repetitivas.',
      quePasaSiFalta: 'Si la vacías a la fuerza, la próxima lectura de archivos irá obligatoriamente a buscar los datos al disco.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory | Select-Object CacheBytes',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria -> En caché',
      whatToLookFor: 'Comprueba el tamaño cambiante de la caché de sistema.',
    },
    alertaEVO: {
      falsePositiveWarning: 'La memoria en caché no resta capacidad a tus juegos o programas pesados.',
      reversibilityRule: 'Gestión automática de memoria.',
    },
    evidenceBadge: {
      code: 'EVD-08-08',
      label: 'SYSTEM_FILE_CACHE_BUFFER',
      defaultProvenance: 'TASKMGR_CACHE_METRIC',
    },
  },
  {
    id: 'inv-08-09',
    code: '08.09',
    title: 'Standby',
    subtitle: 'Lista Standby (Standby List): Las 8 prioridades de caché en espera y la verdad sobre la RAM disponible',
    tabOrMetric: 'Standby Page Lists (Prioridades 0 a 7)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'La lista Standby no es una bolsa uniforme. Está dividida internamente en 8 LISTAS DE PRIORIDAD (0 a 7) administradas por SysMain.',
      mythVsTruth: {
        mentira: 'Standby es memoria RAM usada que no se puede recuperar sin reiniciar la PC.',
        verdad: 'Standby son páginas de código con prioridad asignada. Si se requiere RAM física, las páginas Standby de menor prioridad (0-2) son recicladas instantáneamente.',
        comprobalo: 'Usa herramientas periciales de diagnóstico como RAMMap de Sysinternals para inspeccionar las 8 listas de Standby.',
      },
    },
    entende: {
      queEs: 'Las listas de páginas de memoria que contienen código previamente usado ordenado por su probabilidad de reutilización.',
      paraQueSirve: 'Permite recuperar aplicaciones cerradas recientemente en milisegundos.',
      quePasaSiFalta: 'Garantiza la transición fluida de memoria entre tareas.',
    },
    interactua: {
      powershellCommand: '# Inspección con RAMMap -> Standby Page Lists (Priority 0 to 7)',
      guiPath: 'RAMMap -> Standby Lists',
      whatToLookFor: 'Observa la distribución de megabytes entre las prioridades 0 (baja) y 7 (alta).',
    },
    alertaEVO: {
      falsePositiveWarning: 'Regla de Oro EVO: STANDBY NO EQUIVALE A RAM PERDIDA.',
      reversibilityRule: 'Diseño del Kernel Memory Manager.',
    },
    evidenceBadge: {
      code: 'EVD-08-09',
      label: 'STANDBY_PRIORITY_LISTS_0_7',
      defaultProvenance: 'RAMMAP_STANDBY_TREE',
    },
  },
  {
    id: 'inv-08-10',
    code: '08.10',
    title: 'Modified',
    subtitle: 'La lista Modified: Páginas alteradas que deben ser escritas en disco antes de poder ser reutilizadas',
    tabOrMetric: 'Lista de Páginas Modificadas (Modified Page List)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'A diferencia de Standby, la lista `Modified` contiene páginas de RAM que fueron alteradas en memoria pero cuyos cambios aún no se han guardado en el disco.',
      mythVsTruth: {
        mentira: 'Las páginas Modified se pueden ceder inmediatamente a otra aplicación sin hacer nada.',
        verdad: 'Páginas Modified NO se pueden ceder de golpe. El hilo del sistema `Modified Page Writer` debe escribir sus datos en el disco/pagefile antes de pasarlas a Free.',
        comprobalo: 'En RAMMap o resmon.exe -> Observa el tamaño de la memoria "Modificada" (suele ser pequeño, 50-300 MB).',
      },
    },
    entende: {
      queEs: 'La cola de páginas de RAM pendientes de sincronización con el almacenamiento secundario.',
      paraQueSirve: 'Previene la pérdida de datos garantizando que las modificaciones de memoria se escriban en el archivo de respaldo.',
      quePasaSiFalta: 'Si la lista Modified es gigante (varios GB), indica un cuello de botella de escritura lenta en el almacenamiento.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory | Select-Object ModifiedPageListBytes',
      guiPath: 'Monitor de recursos -> Pestaña Memoria -> Barra "Modificada"',
      whatToLookFor: 'Confirma que la memoria Modificada se mantiene reducida durante la operación normal.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un pico temporal en Modified ocurre al guardar archivos grandes en programas de edición.',
      reversibilityRule: 'Gestionado por el Modified Page Writer de Windows.',
    },
    evidenceBadge: {
      code: 'EVD-08-10',
      label: 'MODIFIED_PAGE_WRITER',
      defaultProvenance: 'MM_MODIFIED_PAGE_LIST',
    },
  },
  {
    id: 'inv-08-11',
    code: '08.11',
    title: 'Free / Zeroed',
    subtitle: 'Diferencia entre Free Page List y Zeroed Page List: La preparación de páginas en ceros por razones de seguridad',
    tabOrMetric: 'Free vs Zeroed Page Lists',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Cuando una app solicita memoria nueva, Windows no le entrega una página sucia con datos viejos de otra app por seguridad. Le entrega una página `Zeroed`.',
      mythVsTruth: {
        mentira: 'Memoria Libre significa que los chips de RAM están borrados físicamente a cero.',
        verdad: 'Existe la lista `Free` (páginas liberadas pero con basura vieja) y la lista `Zeroed` (páginas limpiadas a 0x00 por un hilo de fondo para evitar filtración de datos).',
        comprobalo: 'El hilo del kernel `Zero Page Thread` (PID 0) corre en baja prioridad borrando páginas Free para moverlas a Zeroed.',
      },
    },
    entende: {
      queEs: 'El proceso de saneamiento de memoria RAM en segundo plano para cumplir con los estándares de seguridad C2/EAL.',
      paraQueSirve: 'Evita que una aplicación nueva pueda leer contraseñas o datos residuales que pertenecían a un programa cerrado anteriormente.',
      quePasaSiFalta: 'Garantiza el aislamiento de seguridad de la memoria física.',
    },
    interactua: {
      powershellCommand: '# Inspección con RAMMap -> Free & Zeroed Lists',
      guiPath: 'RAMMap -> Physical Pages -> Zeroed / Free',
      whatToLookFor: 'Comprueba el trabajo del Zero Page Thread de Windows.',
    },
    alertaEVO: {
      falsePositiveWarning: 'El sopleteado de páginas a cero ocurre sin impacto en el rendimiento gracias a la baja prioridad del hilo.',
      reversibilityRule: 'Seguridad nativa del Kernel de Windows.',
    },
    evidenceBadge: {
      code: 'EVD-08-11',
      label: 'ZERO_PAGE_THREAD_SECURITY',
      defaultProvenance: 'MM_ZEROED_PAGE_LIST',
    },
  },
  {
    id: 'inv-08-12',
    code: '08.12',
    title: 'Paged Pool',
    subtitle: 'Pool Paginado del Kernel: Memoria asignada a controladores y componentes del SO que puede ser movida a disco',
    tabOrMetric: 'Pool paginado (Paged Pool)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'El propio Kernel de Windows divide su memoria en dos grandes piscinas (Pools): el `Paged Pool` y el `Non-Paged Pool`.',
      mythVsTruth: {
        mentira: 'Toda la memoria del kernel debe estar obligatoriamente clavada en la RAM física sin poder tocar el disco.',
        verdad: 'El Paged Pool es memoria del kernel para estructuras de datos que PUEDEN ser paginadas a disco si el sistema necesita liberar RAM física para apps de usuario.',
        comprobalo: 'En Administrador de tareas -> Rendimiento -> Memoria -> Revisa la cifra de "Pool paginado".',
      },
    },
    entende: {
      queEs: 'El espacio de memoria del kernel susceptible de ser paginado hacia el respaldo de almacenamiento.',
      paraQueSirve: 'Permite que controladores y servicios del SO no acaparen la RAM física con estructuras de datos de uso infrecuente.',
      quePasaSiFalta: 'Optimiza la capacidad de la memoria física.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_OperatingSystem | Select-Object @{N="PagedPool_MB";E={[math]::Round($_.PoolPagedBytes/1MB,2)}}',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria -> Pool paginado',
      whatToLookFor: 'Monitorea la estabilidad del tamaño del Paged Pool (habitualmente 300-800 MB).',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un crecimiento continuo e infinito del Paged Pool sin detenerse es indicio de una fuga de memoria (Memory Leak) en un driver.',
      reversibilityRule: 'Gestión interna del Kernel.',
    },
    evidenceBadge: {
      code: 'EVD-08-12',
      label: 'KERNEL_PAGED_POOL',
      defaultProvenance: 'TASKMGR_PAGED_POOL',
    },
  },
  {
    id: 'inv-08-13',
    code: '08.13',
    title: 'Non-Paged Pool',
    subtitle: 'Pool no paginado del Kernel: Memoria crítica intocable que jamás puede ser enviada a disco',
    tabOrMetric: 'Pool no paginado (Non-Paged Pool)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'El `Non-Paged Pool` contiene las estructuras más sagradas del Kernel (rutinas de interrupción de teclado, drivers de red). Jamás puede tocar el disco.',
      mythVsTruth: {
        mentira: 'Si la RAM se llena, Windows enviará todo el Non-Paged Pool al archivo pagefile.sys.',
        verdad: 'El Non-Paged Pool tiene GARANTÍA ABSOLUTA de residencia en RAM física. Si un driver intenta paginar esta memoria, el procesador genera una pantalla azul (BSOD).',
        comprobalo: 'En Administrador de tareas -> Rendimiento -> Memoria -> Revisa "Pool no paginado".',
      },
    },
    entende: {
      queEs: 'La reserva de memoria RAM física del kernel garantizada para hilos que se ejecutan en altos niveles de interrupción (DISPATCH_LEVEL o superior).',
      paraQueSirve: 'Garantiza que controladores de tiempo real (red, disco) no sufran Page Faults que congelen el sistema.',
      quePasaSiFalta: 'Si un driver defectuoso tiene un leak en el Non-Paged Pool, consumirá toda la RAM física hasta colapsar Windows.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_OperatingSystem | Select-Object @{N="NonPagedPool_MB";E={[math]::Round($_.PoolNonPagedBytes/1MB,2)}}',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria -> Pool no paginado',
      whatToLookFor: 'Verifica que el Non-Paged Pool no supere los 1-2 GB en uso normal.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un Non-Paged Pool de más de 4 GB en estado de reposo es la prueba reina de un DRIVER LEAK de red o placa de video.',
      reversibilityRule: 'Estructura inviolable del kernel.',
    },
    evidenceBadge: {
      code: 'EVD-08-13',
      label: 'KERNEL_NON_PAGED_POOL',
      defaultProvenance: 'TASKMGR_NONPAGED_POOL',
    },
  },
  {
    id: 'inv-08-14',
    code: '08.14',
    title: 'Memory Compression',
    subtitle: 'Compresión de Memoria: El intercambio entre ciclos de CPU y lecturas de disco para multiplicar la RAM útil',
    tabOrMetric: 'Proceso "Memoria y memoria comprimida" / Compresión RAM',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En Windows 10/11, cuando la RAM se llena, en lugar de escribir de inmediato las páginas en el disco lento, Windows las COMPRIME en un almacén de RAM encriptado en ms.',
      mythVsTruth: {
        mentira: 'La compresión de memoria ralentiza la PC y es una falla de rendimiento.',
        verdad: 'Comprimir páginas en RAM en una relación 4:1 usando ciclos libres de la CPU es 100 VECES MÁS RÁPIDO que escribir y leer desde un disco o pagefile.',
        comprobalo: 'En Administrador de tareas -> Rendimiento -> Memoria -> Pasa el mouse sobre "Compresibilidad" para ver los GB ahorrados.',
      },
    },
    entende: {
      queEs: 'El almacén de páginas comprimidas (Compressed Store) introducido en el Kernel Memory Manager de Windows 10.',
      paraQueSirve: 'Multiplica la capacidad efectiva de la RAM física sin recurrir a E/S de almacenamiento secundario.',
      quePasaSiFalta: 'Reduce drásticamente la latencia en equipos con 8 GB o 16 GB bajo alta carga multitarea.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory | Select-Object Compression* -ErrorAction SilentlyContinue',
      guiPath: 'Administrador de tareas -> Rendimiento -> Memoria -> Resumen de Compresión',
      whatToLookFor: 'Aprecia la relación de compresión lograda por la CPU.',
    },
    alertaEVO: {
      falsePositiveWarning: 'El proceso "System" suele ser el contenedor que muestra la memoria comprimida; es totalmente normal.',
      reversibilityRule: 'Función nativa de optimización de kernel.',
    },
    evidenceBadge: {
      code: 'EVD-08-14',
      label: 'MEMORY_COMPRESSION_ENGINE',
      defaultProvenance: 'MM_COMPRESSED_STORE',
    },
  },
  {
    id: 'inv-08-15',
    code: '08.15',
    title: 'Soft Fault',
    subtitle: 'Fallo de página suave (Soft Page Fault): Resolución instantánea de memoria en RAM sin lectura de disco',
    tabOrMetric: 'Soft Page Faults / Transición de Memoria',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Lees la palabra "Page Fault" (Fallo de página) y piensas que es un error grave de sistema. ¡En realidad ocurre millones de veces por minuto!',
      mythVsTruth: {
        mentira: 'Un Page Fault es un error de código que indica que la memoria RAM está fallando físicamente.',
        verdad: 'Un Soft Page Fault ocurre cuando un programa pide una página que no estaba en su Working Set pero SÍ ESTABA EN LA RAM (en la lista Standby o compartida). Se resuelve en nanosegundos sin tocar el disco.',
        comprobalo: 'Abre el Administrador de Tareas -> Detalles -> Agrega la columna "Fallos de página". Verás un contador continuo.',
      },
    },
    entende: {
      queEs: 'La interrupción de hardware corregida por el gestor de memoria reasignando la dirección virtual a una página que ya residía en la RAM.',
      paraQueSirve: 'Permite la asignación perezosa de memoria (Lazy Allocation) extremadamente eficiente.',
      quePasaSiFalta: 'Demuestra el funcionamiento interno del paginado virtual.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Select-Object -First 5 Name, PageFaults',
      guiPath: 'Administrador de tareas -> Detalles -> Columna "Fallos de página"',
      whatToLookFor: 'Comprende que la inmensa mayoría de Page Faults en Windows son Soft Faults inofensivos.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un número alto de Page Faults NO significa un error de memoria RAM; es el mecanismo de mapeo virtual.',
      reversibilityRule: 'Mecanismo de arquitectura de procesador.',
    },
    evidenceBadge: {
      code: 'EVD-08-15',
      label: 'SOFT_PAGE_FAULT_RESOLVED_IN_RAM',
      defaultProvenance: 'MM_SOFT_PAGE_FAULTS',
    },
  },
  {
    id: 'inv-08-16',
    code: '08.16',
    title: 'Hard Fault',
    subtitle: 'Fallo de página duro (Hard Page Fault): Resolución con lectura requerida desde el almacenamiento secundario',
    tabOrMetric: 'Fallos de página duros (Hard Faults /sec)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'A diferencia del Soft Fault, un `Hard Fault` ocurre cuando la página solicitada por el programa NO está en la RAM y Windows debe ir a buscarla al disco o pagefile.',
      mythVsTruth: {
        mentira: 'Un Hard Fault significa que el disco rígido o la RAM tienen sectores defectuosos dañados.',
        verdad: 'Un Hard Fault es una lectura física a almacenamiento respaldatorio. Ocurre al abrir un archivo nuevo o cuando una app paginada en disco vuelve al primer plano.',
        comprobalo: 'En Monitor de Recursos (`resmon.exe`) -> Pestaña Memoria -> Revisa la columna y gráfico de "Fallos de página duros/s".',
      },
    },
    entende: {
      queEs: 'La interrupción de memoria que requiere una operación de lectura de E/S al SSD o disco.',
      paraQueSirve: 'Mete de regreso a la RAM física páginas que habían sido enviadas al pagefile.',
      quePasaSiFalta: 'Si registras cientos de Hard Faults por segundo sostenidos, sentirás tirones en el juego o aplicación (Thrashing).',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory | Select-Object PageFaultsPersec',
      guiPath: 'Monitor de recursos -> Pestaña Memoria -> Gráficos de Fallos de página duros/s',
      whatToLookFor: 'Identifica qué proceso está generando lecturas de disco por Hard Faults.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Picos breves de Hard Faults al abrir una app pesada son normales. Lo anómalo son Hard Faults continuos en reposo.',
      reversibilityRule: 'Métrica de monitoreo de E/S.',
    },
    evidenceBadge: {
      code: 'EVD-08-16',
      label: 'HARD_PAGE_FAULT_DISK_READ',
      defaultProvenance: 'RESMON_HARD_FAULTS',
    },
  },
  {
    id: 'inv-08-17',
    code: '08.17',
    title: 'Memory leak',
    subtitle: 'Fuga de memoria: La curva de crecimiento temporal sin liberación esperada que agota la memoria del sistema',
    tabOrMetric: 'Patrón temporal de fuga de memoria (Memory Leak Pattern)',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Dejas un programa abierto. En el minuto 1 usa 200 MB. En el minuto 30 usa 2 GB. A las 3 horas usa 12 GB y congela la PC. Estás ante un `Memory Leak`.',
      mythVsTruth: {
        mentira: 'Un Memory Leak es un virus que está multiplicando archivos en el disco C:.',
        verdad: 'Un Memory Leak es un fallo de programación (bug) donde una aplicación o driver reserva bloques de memoria (malloc/Heap) pero olvida liberarlos al terminar la tarea.',
        comprobalo: 'Abre Administrador de Tareas -> Observa si la columna Memoria de un proceso específico sube en línea recta sin estabilizarse jamás.',
      },
    },
    entende: {
      queEs: 'La acumulación no controlada de memoria asignada no liberada por falta de punteros de desasignación.',
      paraQueSirve: 'Identificar programas o controladores defectuosos que requieren parche o reinicio.',
      quePasaSiFalta: 'Un Memory Leak no corregido terminará agotando el Commit Limit del sistema operativo.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Sort-Object PrivateMemorySize -Descending | Select-Object -First 5 Name, PrivateMemorySize',
      guiPath: 'Administrador de tareas -> Detalles -> Monitoreo de curva de memoria',
      whatToLookFor: 'Identifica la diferencia entre un uso alto legítimo (estabilizado) vs una fuga de memoria (escalada infinita).',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si finalizas el proceso con el Memory Leak, toda su memoria privada se liberará al instante sin dejar daños.',
      reversibilityRule: 'Finalización de proceso para liberar la memoria retenida.',
    },
    evidenceBadge: {
      code: 'EVD-08-17',
      label: 'MEMORY_LEAK_TEMPORAL_ESCALATION',
      defaultProvenance: 'PERFMON_MEMORY_LEAK',
    },
  },
  {
    id: 'inv-08-18',
    code: '08.18',
    title: 'pagefile.sys',
    subtitle: 'El archivo de paginación: Ubicación, backing store, volcado de memoria (Crash Dumps) y respaldo de Commit',
    tabOrMetric: 'Archivo C:\\pagefile.sys',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'En la raíz de tu disco C: existe un archivo oculto del sistema llamado `pagefile.sys`. Ocupa varios gigabytes de espacio. ¿Qué rol cumple?',
      mythVsTruth: {
        mentira: 'pagefile.sys es un archivo de memoria temporal donde Windows guarda los virus que atrapa.',
        verdad: 'pagefile.sys es el archivo de respaldo (Backing Store) de la memoria virtual. Permite extender el Commit Limit y almacenar volcados de memoria (Crash Dumps) ante Pantallas Azules.',
        comprobalo: 'Abre Explorador de archivos -> Mostrar archivos protegidos del sistema -> Verás `C:\\pagefile.sys`.',
      },
    },
    entende: {
      queEs: 'El contenedor en disco administrado por el kernel para almacenar páginas de memoria virtual modificadas no residentes.',
      paraQueSirve: 'Permite desinstalar de la RAM física páginas inactivas de apps en segundo plano para ceder esa RAM a tus juegos.',
      quePasaSiFalta: 'Si ocurre un BSOD y no hay pagefile.sys en C:, Windows no podrá generar el informe de minidump pericial (`MEMORY.DMP`).',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_PageFileSetting | Select-Object Name, InitialSize, MaximumSize',
      guiPath: 'Propiedades del sistema -> Rendimiento -> Opciones avanzadas -> Memoria virtual',
      whatToLookFor: 'Revisa la ubicación y asignación de tamaño de pagefile.sys.',
    },
    alertaEVO: {
      falsePositiveWarning: 'La mejor configuración recomendada por Microsoft y EVO LABS para el 99% de usuarios es "Administrado por el sistema".',
      reversibilityRule: 'Configuración de memoria virtual en Panel de Control.',
    },
    evidenceBadge: {
      code: 'EVD-08-18',
      label: 'PAGEFILE_BACKING_STORE',
      defaultProvenance: 'SYSTEM_PAGEFILE_CONFIG',
    },
  },
  {
    id: 'inv-08-19',
    code: '08.19',
    title: 'hiberfil.sys',
    subtitle: 'El archivo de hibernación y Fast Startup: Almacenamiento del estado de la sesión de kernel',
    tabOrMetric: 'Archivo C:\\hiberfil.sys',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Ves otro archivo gigante en C: llamado `hiberfil.sys` de 8 GB a 12 GB. Sirve para que la PC encienda en 3 segundos gracias a Inicio Rápido (Fast Startup).',
      mythVsTruth: {
        mentira: 'hiberfil.sys es una copia de seguridad duplicada de tus fotos y documentos.',
        verdad: 'hiberfil.sys guarda la imagen comprimida del estado de la sesión de kernel al apagar para recargarla directo a RAM al encender (Fast Startup) o al Hibernar.',
        comprobalo: 'Ejecutá `powercfg /hibernate off` en CMD de administrador si deseas deshabilitar la hibernación y borrar hiberfil.sys para recuperar espacio.',
      },
    },
    entende: {
      queEs: 'El archivo de volcado de la sesión de kernel utilizado por la característica de Hibernación e Inicio Rápido de Windows.',
      paraQueSirve: 'Acelera drásticamente la velocidad de encendido de la computadora.',
      quePasaSiFalta: 'Si lo deshabilitas con `powercfg`, perderás la Hibernación e Inicio Rápido, pero recuperarás entre 4 GB y 16 GB de espacio en el disco SSD.',
    },
    interactua: {
      powershellCommand: 'powercfg /query',
      cmdCommand: 'powercfg /hibernate off',
      guiPath: 'CMD Administrador -> `powercfg /hibernate off`',
      whatToLookFor: 'Observa la desaparición inmediata de `C:\\hiberfil.sys` al deshabilitarlo.',
    },
    alertaEVO: {
      falsePositiveWarning: 'En laptops se recomienda mantener hiberfil.sys para evitar descargar la batería en reposo prolongado.',
      reversibilityRule: 'Se reactiva en cualquier momento ejecutando `powercfg /hibernate on`.',
    },
    evidenceBadge: {
      code: 'EVD-08-19',
      label: 'HIBERFIL_FAST_STARTUP_IMAGE',
      defaultProvenance: 'POWERCFG_HIBERNATE_CONFIG',
    },
  },
  {
    id: 'inv-08-20',
    code: '08.20',
    title: 'swapfile.sys',
    subtitle: 'El archivo swapfile.sys: Paginado especializado para aplicaciones de la plataforma UWP / Store',
    tabOrMetric: 'Archivo C:\\swapfile.sys',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Junto a pagefile e hiberfil, ves un tercer archivo más pequeño llamado `swapfile.sys` (de unos 256 MB). ¿Por qué Windows creó un segundo paginado?',
      mythVsTruth: {
        mentira: 'swapfile.sys es un error de duplicación de pagefile.sys que ocurrió al actualizar Windows.',
        verdad: 'swapfile.sys es un archivo de paginado especializado de baja latencia introducido para suspender y reanudar aplicaciones universales UWP / Store.',
        comprobalo: 'Abre C: con archivos ocultos visibles: verás swapfile.sys administrado automáticamente junto a pagefile.sys.',
      },
    },
    entende: {
      queEs: 'El contenedor de paginado complementario para aplicaciones de marco moderno UWP.',
      paraQueSirve: 'Permite a Windows suspender apps de la tienda en RAM sin saturar el pagefile principal.',
      quePasaSiFalta: 'Es administrado automáticamente de forma transparente por el sistema.',
    },
    interactua: {
      powershellCommand: 'Get-ChildItem -Path "C:\\" -Force -Filter "swapfile.sys"',
      guiPath: 'Explorador de archivos -> Raíz C:\\',
      whatToLookFor: 'Confirma la presencia del archivo de paginado de apps universales.',
    },
    alertaEVO: {
      falsePositiveWarning: 'swapfile.sys ocupa un espacio insignificante (256 MB) y no debe ser modificado manualmente.',
      reversibilityRule: 'Administrado por la arquitectura del sistema.',
    },
    evidenceBadge: {
      code: 'EVD-08-20',
      label: 'SWAPFILE_UWP_PAGING',
      defaultProvenance: 'SYSTEM_SWAPFILE_CONFIG',
    },
  },
  {
    id: 'inv-08-21',
    code: '08.21',
    title: 'Por qué pagefile no es “RAM lenta”',
    subtitle: 'Desmontando el mito: Cómo la paginación libera RAM física rápida para el proceso activo en primer plano',
    tabOrMetric: 'Mapeo conceptual de Paginación Inteligente',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Escuchas la frase: "Si Windows usa el pagefile, la PC se pone lenta porque el pagefile es RAM lenta". ¡Esa idea ignora la arquitectura de memoria!',
      mythVsTruth: {
        mentira: 'El pagefile se usa como una extensión directa donde los programas activos ejecutan sus instrucciones en cámara lenta.',
        verdad: 'El pagefile recibe páginas MODIFICADAS INACTIVAS de programas en segundo plano. Esto LIBERA la RAM física real y rápida para que tu juego en primer plano corra a máxima velocidad.',
        comprobalo: 'Si dejas un editor minimizado durante 2 horas, Windows manda sus páginas al pagefile. Cuando vuelves al juego, este tiene el 100% de la RAM física para él solo.',
      },
    },
    entende: {
      queEs: 'El mecanismo de descarga de memoria inactiva para maximizar la residencia en RAM del proceso con foco.',
      paraQueSirve: 'Garantiza que la RAM física rápida no esté desperdiciada en datos que nadie está usando en este momento.',
      quePasaSiFalta: 'Desmonta uno de los mitos más dañinos de la informática popular.',
    },
    interactua: {
      powershellCommand: '# Análisis de arquitectura de paginación virtual en primer plano vs segundo plano',
      guiPath: 'Esquema conceptual de memoria EVO LABS',
      whatToLookFor: 'Aprecia el beneficio del pagefile liberando RAM física para tu app activa.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Tener uso de pagefile no significa lentitud; significa que la RAM física está limpia para lo que estás haciendo ahora.',
      reversibilityRule: 'Concepto fundamental de arquitectura de sistemas.',
    },
    evidenceBadge: {
      code: 'EVD-08-21',
      label: 'PAGEFILE_MYTH_DEBUNKED',
      defaultProvenance: 'MM_PAGING_ARCHITECTURE',
    },
  },
  {
    id: 'inv-08-22',
    code: '08.22',
    title: 'Por qué eliminarlo puede romper cosas',
    subtitle: 'Riesgos de desactivar el archivo de paginación: Agotamiento de Commit Limit, fallos en juegos y pérdida de Crash Dumps',
    tabOrMetric: 'Análisis de Riesgo: Sin Archivo de Paginación',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Tienes 32 GB de RAM y decides desactivar por completo el pagefile.sys "para volar". De repente, un juego se cierra sin aviso y Windows no genera reporte de error.',
      mythVsTruth: {
        mentira: 'Si tienes 16 GB o más de RAM física, debes eliminar obligatoriamente el archivo de paginación.',
        verdad: 'Muchos juegos y programas asignan bloques virtuales gigantes requeridos por especificación. Sin pagefile, tu Commit Limit se reduce drásticamente, provocando cierres inesperados.',
        comprobalo: 'Desactivar el pagefile elimina la capacidad de Windows de guardar volcados de memoria `MEMORY.DMP` ante un BSOD, impidiendo saber qué driver falló.',
      },
    },
    entende: {
      queEs: 'Las consecuencias técnicas de deshabilitar la memoria virtual respaldada por almacenamiento.',
      paraQueSirve: 'Comprender por qué Microsoft y los ingenieros periciales recomiendan mantener al menos un pagefile administrado.',
      quePasaSiFalta: 'Provoca inestabilidad impredecible en cargas de trabajo pesadas.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_StartupCommand',
      guiPath: 'Propiedades del sistema -> Rendimiento -> Memoria virtual',
      whatToLookFor: 'Verifica los riesgos antes de seleccionar "Sin archivo de paginación".',
    },
    alertaEVO: {
      falsePositiveWarning: 'REGLA ABSOLUTA EVO: NUNCA desactives el pagefile por completo.',
      reversibilityRule: 'Reversible desde Panel de Control -> Sistema -> Opciones avanzadas.',
    },
    evidenceBadge: {
      code: 'EVD-08-22',
      label: 'NO_PAGEFILE_STABILITY_RISKS',
      defaultProvenance: 'PAGEFILE_RISK_ANALYSIS',
    },
  },
  {
    id: 'inv-08-23',
    code: '08.23',
    title: 'Configuración automática vs manual',
    subtitle: 'Administrado por el sistema vs Tamaños fijos personalizados: Cuándo ajustar y por qué huir de "RAM x 1.5"',
    tabOrMetric: 'Ajuste de Memoria Virtual (System Managed vs Custom)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Lees una receta de internet que dice: "Configura el pagefile manualmente en Tamaño Inicial = RAM x 1.5 y Máximo = RAM x 3". ¿Tiene sentido en 2026?',
      mythVsTruth: {
        mentira: 'La regla "RAM x 1.5" es una ley matemática obligatoria para configurar la memoria virtual.',
        verdad: 'Esa regla era para computadoras con 512 MB de RAM en el año 2002. En una PC con 32 GB de RAM, multiplicar por 1.5 desperdiciaría 48 GB de SSD inutilmente.',
        comprobalo: 'La opción "Administrado por el sistema" hace que el pagefile crezca o se encoja dinámicamente según la necesidad real del momento.',
      },
    },
    entende: {
      queEs: 'El debate entre la gestión automática del Kernel y los tamaños fijos definidos por el usuario.',
      paraQueSirve: 'Entender cuándo fijar un tamaño manual (ej. en un SSD secundario específico para evitar fragmentación de espacio).',
      quePasaSiFalta: 'Asegura la administración eficiente del espacio en disco.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_PageFileSetting',
      guiPath: 'Sistema -> Opciones Avanzadas -> Memoria Virtual -> "Administrar automáticamente"',
      whatToLookFor: 'Confirma que la casilla de administración automática esté marcada en el 99% de casos.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Huye de las recetas estáticas antiguas de memoria virtual.',
      reversibilityRule: 'Ajuste conmutable desde la consola de Memoria Virtual.',
    },
    evidenceBadge: {
      code: 'EVD-08-23',
      label: 'SYSTEM_MANAGED_PAGEFILE_RECOMMENDED',
      defaultProvenance: 'PAGEFILE_AUTOMATIC_MANAGEMENT',
    },
  },
  {
    id: 'inv-08-24',
    code: '08.24',
    title: 'RAM cleaners',
    subtitle: 'La verdad sobre los programas "Limpiadores de RAM": Recorte agresivo de Working Sets, purga de Standby y el engaño de los contadores',
    tabOrMetric: 'Análisis de Programas RAM Cleaners / MemReduct',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Usas un "RAM Cleaner". Presionas "Limpiar Memoria". El contador de RAM baja mágicamente de 80% a 30%. Crees que hiciste un milagro. ¿Qué pasó por dentro?',
      mythVsTruth: {
        mentira: 'Los RAM Cleaners eliminan la basura de la memoria y hacen que la computadora funcione al doble de velocidad.',
        verdad: 'Los RAM Cleaners fuerzan la API `SetProcessWorkingSetSize(-1, -1)`. Obligan a Windows a EXPULSAR a la fuerza la memoria de tus programas al pagefile de disco. Al volver al programa, este se congelará mientras recarga todo.',
        comprobalo: 'Mide la latencia: Tras usar un RAM Cleaner, hacer clic en una pestaña de navegador causará un tirón (Hard Fault) mientras vuelve a leer del disco.',
      },
    },
    entende: {
      queEs: 'El mecanismo de engaño visual de las utilidades que fuerzan el vaciado del Working Set y la lista Standby.',
      paraQueSirve: 'Comprender por qué estas herramientas generan MÁS actividad de disco y PEOR latencia de respuesta (Efecto Placebo).',
      quePasaSiFalta: 'Protege al usuario de perjudicar el rendimiento real de su sistema.',
    },
    interactua: {
      powershellCommand: '# Demostración de vaciado forzado de Working Set vs Impacto en Hard Faults',
      guiPath: 'Monitor de recursos -> Hard Faults tras vaciado de RAM',
      whatToLookFor: 'Observa el pico de Hard Faults en el disco inmediatamente después de ejecutar un "RAM Cleaner".',
    },
    alertaEVO: {
      falsePositiveWarning: 'Que el contador de RAM libre suba NO demuestra que la PC esté más rápida. Demuestra que se mandaron datos al disco.',
      reversibilityRule: 'Desinstala los limpiadores automáticos de RAM.',
    },
    evidenceBadge: {
      code: 'EVD-08-24',
      label: 'RAM_CLEANERS_WORKING_SET_TRIM_PLACEBO',
      defaultProvenance: 'RAM_CLEANER_BENCHMARK',
    },
  },
  {
    id: 'inv-08-25',
    code: '08.25',
    title: 'Crear un liberador de memoria que NO sea placebo',
    subtitle: 'La metodología pericial EVO: Observar, Diagnosticar, Identificar Presión, Identificar Leak y Decidir Acción con el EVO Memory Inspector',
    tabOrMetric: 'Herramienta Canónica EVO Memory Inspector',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En lugar de un botón mágico engañoso, la ingeniería pericial EVO construye una herramienta de diagnóstico real: el `EVO Memory Inspector`.',
      mythVsTruth: {
        mentira: 'Un buen liberador de memoria debe funcionar de forma automática en segundo plano borrando la RAM cada 5 minutos.',
        verdad: 'Un liberador pericial NO borra la RAM a ciegas. Muestra la presión de Commit, identifica qué proceso específico tiene una fuga de memoria (Memory Leak) y te permite cerrar ESE proceso causante.',
        comprobalo: 'Utiliza el `EVO Memory Inspector` para auditar de forma científica el mapa completo de memoria de tu equipo.',
      },
    },
    entende: {
      queEs: 'La metodología de auditoría de memoria consciente e informada basada en datos duros del Kernel.',
      paraQueSirve: 'Resolver problemas reales de falta de memoria atacando la causa raíz sin perjudicar la caché útil.',
      quePasaSiFalta: 'Establece el estándar profesional de inspección de memoria en EVO LABS.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Sort-Object PrivateMemorySize -Descending | Select-Object -First 10 Name, @{N="Private_MB";E={[math]::Round($_.PrivateMemorySize/1MB,2)}}',
      guiPath: 'Herramienta EVO Memory Inspector',
      whatToLookFor: 'Identifica el proceso con mayor Private Working Set para tomar decisiones periciales.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Ataca la causa raíz (el proceso con leak), no las consecuencias (la caché Standby legítima).',
      reversibilityRule: 'Herramienta de diagnóstico pericial no invasiva.',
    },
    evidenceBadge: {
      code: 'EVD-08-25',
      label: 'EVO_MEMORY_INSPECTOR_DIAGNOSTIC',
      defaultProvenance: 'EVO_MEMORY_TOOL_SUITE',
    },
  },
];

export const SECTOR_08_MINICASES: Sector08MiniCase[] = [
  {
    id: 'case-08-a',
    code: 'CASO 08-A',
    title: 'El engaño del RAM Cleaner',
    scenario: 'Un usuario instaló un programa "RAM Booster" que promete liberar memoria automáticamente. Cada vez que hace clic en "Optimizar", la memoria libre pasa de 2 GB a 10 GB, pero al volver al juego sufre tirones extremos durante 10 segundos.',
    userStatement: '“El programa me libera 8 GB de RAM pero el juego se congela feo justo después de apretar el botón.”',
    initialMistake: 'Creer que el aumento en el contador de RAM libre significa que el sistema quedó más rápido.',
    diagnosticQuestion: '¿Por qué el juego sufre tirones extremos inmediatamente después de presionar el botón del RAM Cleaner?',
    options: [
      {
        id: 'c8_a1',
        text: 'Porque el RAM Cleaner forzó la expulsión de las páginas del juego de la RAM hacia el pagefile de disco. El juego se congela mientras sufre Hard Faults para volver a leer todo desde el disco.',
        isCorrect: true,
        explanation: 'Forzar un Trim agresivo del Working Set vacía la RAM mandando datos al disco. Al requerirlos la app, se generan picos de Hard Faults y congelamientos.',
      },
      {
        id: 'c8_a2',
        text: 'Porque el juego se quedó sin conexión a Internet.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se desinstaló el RAM Cleaner. La experiencia de juego volvió a ser fluida sin congelamientos.',
    lessonLearned: 'Los RAM Cleaners son un placebo engañoso que empeora la latencia al mandar la memoria física al disco.',
  },
  {
    id: 'case-08-b',
    code: 'CASO 08-B',
    title: 'El crash por falta de Commit Limit',
    scenario: 'Un usuario con 16 GB de RAM física deshabilitó por completo el archivo pagefile.sys en C:. Al abrir un juego pesado mientras tenía un proyecto de edición abierto, el juego se cerró de golpe sin mostrar ningún error.',
    userStatement: '“Tengo 16 GB de RAM y el juego se cierra solo a la mitad de la partida sin decir nada.”',
    initialMistake: 'Creer que tener 16 GB de RAM física es suficiente para eliminar el archivo de paginación.',
    diagnosticQuestion: '¿Por qué el juego se cerró abruptamente si aún quedaban 3 GB de RAM física en caché?',
    options: [
      {
        id: 'c8_b1',
        text: 'Porque al eliminar el pagefile, el Commit Limit quedó fijado en solo 16 GB. Al solicitar más garantía de memoria virtual, el sistema alcanzó el 100% de Commit y cerró el proceso.',
        isCorrect: true,
        explanation: 'Las apps requieren respaldo de Commit. Sin pagefile, el Commit Limit es igual a la RAM física, provocando crashes por falta de memoria virtual.',
      },
      {
        id: 'c8_b2',
        text: 'Porque la tarjeta de video se sobrecalentó a 100 grados.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se volvió a configurar el pagefile.sys en "Administrado por el sistema". El Commit Limit subió a 32 GB y los cierres desaparecieron.',
    lessonLearned: 'Jamás desactives el pagefile.sys. Se requiere respaldar el Commit Limit para garantizar estabilidad.',
  },
  {
    id: 'case-08-c',
    code: 'CASO 08-C',
    title: 'El Memory Leak de un driver de red',
    scenario: 'Un usuario nota que tras dejar la PC prendida 24 horas descargando archivos, la RAM usada llega al 95% pero al sumar los procesos del Administrador de Tareas apenas dan 3 GB. En resmon.exe, el `Non-Paged Pool` muestra 11 GB.',
    userStatement: '“Tengo 16 GB de RAM usada pero la suma de mis programas da solo 3 GB. Hay un proceso invisible robando RAM.”',
    initialMistake: 'Buscar el consumo en la pestaña Procesos de usuario ignorando la memoria asignada al Kernel (Non-Paged Pool).',
    diagnosticQuestion: '¿Qué tipo de problema técnico revela un Non-Paged Pool de 11 GB?',
    options: [
      {
        id: 'c8_c1',
        text: 'Un Memory Leak (fuga de memoria) en un controlador de red o de hardware que reserva bloques en el Non-Paged Pool y olvida liberarlos.',
        isCorrect: true,
        explanation: 'El Non-Paged Pool es memoria intocable del kernel. Si un driver defectuoso tiene un leak, se acumulará ahí sin figurar en los procesos de usuario.',
      },
      {
        id: 'c8_c2',
        text: 'Un virus que está encriptando el disco duro.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Con la herramienta PoolMon se identificó que la etiqueta de pool `NDfs` (driver de red Killer Network) causaba la fuga. Se actualizó el driver y el Non-Paged Pool se estabilizó en 400 MB.',
    lessonLearned: 'Si la RAM no suma en procesos de usuario, inspecciona el Non-Paged Pool en busca de fugas de memoria de controladores.',
  },
  {
    id: 'case-08-d',
    code: 'CASO 08-D',
    title: 'El pánico de los 8 GB "Reservados para hardware"',
    scenario: 'Un usuario armó una computadora nueva con 2 módulos de 8 GB (16 GB total). En Propiedades del Sistema lee: "16 GB (7.9 GB utilizable)".',
    userStatement: '“Compré 16 GB de memoria y Windows me dice que solo puedo usar 8 GB.”',
    initialMistake: 'Creer que un módulo de RAM está quemado o que Windows es de 32 bits.',
    diagnosticQuestion: '¿Por qué casi la mitad de la RAM física figura como no utilizable?',
    options: [
      {
        id: 'c8_a1_d',
        text: 'Porque el procesador con gráficos integrados (iGPU) o el BIOS reservó 8 GB de la RAM física para usarla como VRAM de video integrada, o los módulos están en zócalos incorrectos sin Dual Channel.',
        isCorrect: true,
        explanation: 'Ajustar la asignación de VRAM del iGPU en el BIOS de 8 GB a 2 GB devuelve la RAM utilizable al sistema operativo de inmediato.',
      },
      {
        id: 'c8_a2_d',
        text: 'Porque el disco C: no tiene espacio libre.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se redujo la VRAM del iGPU en el BIOS a 2 GB y se colocaron los módulos en los zócalos A2/B2. La RAM utilizable subió a 13.8 GB.',
    lessonLearned: 'La memoria reservada para hardware se configura desde los parámetros de BIOS/UEFI y disposición de zócalos.',
  },
  {
    id: 'case-08-e',
    code: 'CASO 08-E',
    title: 'El mito de "RAM x 1.5" en 64 GB de RAM',
    scenario: 'Un técnico configuró manualmente la Memoria Virtual en una Workstation con 64 GB de RAM física siguiendo la antigua regla "RAM x 1.5", fijando el pagefile en 96 GB fijos en el SSD C:.',
    userStatement: '“El disco C: se quedó sin espacio de la nada y tengo un archivo pagefile de 96 GB que no necesito.”',
    initialMistake: 'Aplicar reglas ciegas de hace 20 años en computadoras modernas con gran capacidad de RAM física.',
    diagnosticQuestion: '¿Por qué aplicar "RAM x 1.5" en 64 GB de RAM es un error de configuración?',
    options: [
      {
        id: 'c8_e1',
        text: 'Porque desperdicia 96 GB de almacenamiento SSD ultra caro sin necesidad. En sistemas con 64 GB de RAM, la opción "Administrado por el sistema" mantendrá un pagefile eficiente de pocos GB.',
        isCorrect: true,
        explanation: 'La regla x 1.5 era para sistemas antiguos con poca RAM. Hoy se utiliza administración automática.',
      },
      {
        id: 'c8_e2',
        text: 'Porque los discos SSD no permiten archivos de más de 10 GB.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se cambió el pagefile a "Administrado por el sistema". El archivo pagefile.sys se redujo automáticamente a 4 GB, recuperando 92 GB de espacio libre en el SSD.',
    lessonLearned: 'Usa la administración automática de memoria virtual en lugar de fórmulas obsoletas.',
  },
];

export const SECTOR_08_TEST_BANK: Sector08TestQuestion[] = [
  {
    id: 't08-q01',
    questionNumber: 1,
    category: 'MEMORIA_VIRTUAL_COMMIT',
    question: '¿Qué es exactamente la Memoria Virtual en un sistema operativo moderno de 64 bits?',
    options: [
      { id: 'opt_1', text: 'La abstracción del Kernel que otorga a cada proceso su propio espacio de direcciones de memoria aislado' },
      { id: 'opt_2', text: 'El archivo oculto pagefile.sys creado en el disco duro' },
      { id: 'opt_3', text: 'La memoria de la tarjeta gráfica' },
      { id: 'opt_4', text: 'Un programa para acelerar juegos' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'La Memoria Virtual es la abstracción de direccionamiento lógico gestionada por el Kernel y la MMU del procesador.',
    relatedInvestigationCode: '08.02',
  },
  {
    id: 't08-q02',
    questionNumber: 2,
    category: 'WORKING_SETS_POOLS',
    question: '¿Qué diferencia a la memoria Non-Paged Pool del Paged Pool del Kernel?',
    options: [
      { id: 'opt_1', text: 'El Non-Paged Pool es memoria crítica garantizada en RAM física que jamás puede ser enviada a disco' },
      { id: 'opt_2', text: 'El Non-Paged Pool es la memoria de las fotos del usuario' },
      { id: 'opt_3', text: 'El Non-Paged Pool se borra cada 5 minutos' },
      { id: 'opt_4', text: 'No existe ninguna diferencia entre ambos pools' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'Non-Paged Pool aloja estructuras sagradas del kernel y controladores que deben permanecer en RAM física de forma intocable.',
    relatedInvestigationCode: '08.13',
  },
  {
    id: 't08-q03',
    questionNumber: 3,
    category: 'FAULTS_LEAKS',
    question: '¿Cuál es la diferencia entre un Soft Page Fault y un Hard Page Fault?',
    options: [
      { id: 'opt_1', text: 'El Soft Fault se resuelve instantáneamente en RAM sin tocar el disco; el Hard Fault requiere una lectura física a almacenamiento' },
      { id: 'opt_2', text: 'El Soft Fault destruye los archivos y el Hard Fault los repara' },
      { id: 'opt_3', text: 'El Hard Fault indica que la memoria RAM está rota físicamente' },
      { id: 'opt_4', text: 'Ocurren solo cuando la computadora está apagada' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'Soft Fault se resuelve en nanosegundos reasignando páginas en RAM (Standby). Hard Fault requiere I/O de lectura a almacenamiento.',
    relatedInvestigationCode: '08.15',
  },
  {
    id: 't08-q04',
    questionNumber: 4,
    category: 'PAGEFILE_CLEANERS',
    question: '¿Por qué los programas "RAM Cleaners" que prometen vaciar la RAM generan un efecto placebo perjudicial?',
    options: [
      { id: 'opt_1', text: 'Porque fuerzan la expulsión de las páginas de RAM al disco, provocando congelamientos y Hard Faults cuando el programa intenta reusarlas' },
      { id: 'opt_2', text: 'Porque borran el sistema operativo' },
      { id: 'opt_3', text: 'Porque aumentan la temperatura del procesador 50 grados' },
      { id: 'opt_4', text: 'Porque duplican los archivos de la carpeta Documentos' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'Los RAM Cleaners fuerzan un Trim del Working Set mandando datos al disco. Al volver al programa, se generan tirones por lectura desde almacenamiento.',
    relatedInvestigationCode: '08.24',
  },
  {
    id: 't08-q05',
    questionNumber: 5,
    category: 'MEMORIA_VIRTUAL_COMMIT',
    question: '¿Qué métrica se compone de la suma de la RAM Física Instalada más la capacidad del Archivo de Paginación?',
    options: [
      { id: 'opt_1', text: 'El Límite de Commit (Commit Limit)' },
      { id: 'opt_2', text: 'La velocidad de la memoria en MHz' },
      { id: 'opt_3', text: 'El espacio libre en la papelera de reciclaje' },
      { id: 'opt_4', text: 'La temperatura del disco SSD' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'Commit Limit = RAM Física + Capacidad de respaldo de almacenamiento del pagefile.sys.',
    relatedInvestigationCode: '08.04',
  },
];
