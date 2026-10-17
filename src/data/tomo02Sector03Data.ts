// TOMO 02: LA BIBLIA NEGRA DE WINDOWS // MENTIRA Y VERDAD
// SECTOR 03: WINDOWS CONTROL ROOM // TODAS LAS CONSOLAS QUE IMPORTAN

export type ProvenanceType =
  | 'REAL_SCREENSHOT'
  | 'DIDACTIC_DIAGRAM'
  | 'DIDACTIC_UI_REPRESENTATION'
  | 'EXAMPLE'
  | 'SYSTEM_REPORTED'
  | 'OBSERVED'
  | 'MEASURED'
  | 'DERIVED'
  | 'UNKNOWN';

export type ChallengeType =
  | 'ORDER_SEQUENCE'
  | 'CLASSIFICATION'
  | 'MYTH_VS_TRUTH'
  | 'VARIABLE_RESOLVER'
  | 'ERROR_ISOLATOR'
  | 'REASONING';

export interface Sector03Investigation {
  id: string;
  code: string; // e.g. "03.01"
  title: string;
  subtitle: string;
  category:
    | 'RENDIMIENTO'
    | 'ERRORES'
    | 'HARDWARE'
    | 'SERVICIOS_ARRANQUE'
    | 'ALMACENAMIENTO'
    | 'CONFIGURACION_PROFUNDA'
    | 'SEGURIDAD'
    | 'ENERGIA'
    | 'RED'
    | 'RECUPERACION'
    | 'ADMINISTRACION';
  commandToOpen: string;
  shortcut?: string;
  riskLevel: 'READ_ONLY_SAFE' | 'MONITOR_ONLY' | 'CONFIG_MODIFY_RISK' | 'CRITICAL_SYSTEM_RISK';
  descubri: {
    hook: string;
    mythVsTruth: {
      mentira: string;
      verdad: string;
      comprobalo: string;
    };
  };
  entende: {
    title: string;
    explanation: string[];
    whatToLookFor: string[];
    whatNotToMisinterpret: string;
  };
  profundiza: {
    title: string;
    technicalDetails: string[];
    lowLevelNote?: string;
    whenToUseOtherTool?: string;
  };
  miraloEnTuPc: {
    actionName: string;
    steps: string[];
    commandOrPath: string;
    shortcut?: string;
    expectedVisual: string;
  };
  comprobalo: {
    instruction: string;
    actionPrompt: string;
    validationKey: string;
  };
  microdesafio: {
    type: ChallengeType;
    question: string;
    instruction: string;
    options: { id: string; text: string; isCorrect: boolean; feedback: string }[];
  };
  evidencia: {
    fieldName: string;
    targetDescription: string;
    defaultProvenance: ProvenanceType;
  };
}

export interface Sector03MiniCase {
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

export interface Sector03TestQuestion {
  id: string;
  questionNumber: number;
  category: string;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    technicalJustification: string;
  }[];
}

// 21 INVESTIGACIONES CANÓNICAS DE SECTOR 03
export const SECTOR_03_INVESTIGATIONS: Sector03Investigation[] = [
  {
    id: 'inv-03-01',
    code: '03.01',
    title: 'Task Manager',
    subtitle: 'La consola de diagnóstico primario de procesos y recursos en tiempo real',
    category: 'RENDIMIENTO',
    commandToOpen: 'taskmgr.exe',
    shortcut: 'Ctrl + Shift + Esc',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Es la primera ventana que abren el 99% de los técnicos cuando la PC se traba, pero casi nadie explora más allá del porcentaje global de CPU.',
      mythVsTruth: {
        mentira: 'Task Manager sólo sirve para forzar el cierre de programas colgados con "Finalizar tarea".',
        verdad: 'Task Manager es un monitor pericial vivo de hilos, identificadores (PID), asignación de memoria Commit, uso de GPU por motor y arranque.',
        comprobalo: 'Presioná Ctrl + Shift + Esc y hacé clic en "Más detalles" o explorá la pestaña "Detalles" para ver el árbol vivo.',
      },
    },
    entende: {
      title: 'Las 6 vistas esenciales del Administrador de tareas',
      explanation: [
        'Task Manager organiza la telemetría viva en 6 secciones principales:',
        '1) Processes (Procesos): Agrupa por aplicaciones en primer plano, procesos de fondo y procesos de Windows.',
        '2) Performance (Rendimiento): Gráficos en tiempo real de CPU, Memoria, Disco, Wi-Fi/Ethernet y GPU.',
        '3) App History (Historial de aplicaciones): Consumo acumulado de recursos para apps UWP / Store.',
        '4) Startup Apps (Aplicaciones de arranque): Programas autorizados a iniciar sesión con medición de impacto.',
        '5) Users (Usuarios): Sesiones activas y consumo desglosado por cada cuenta de usuario.',
        '6) Details (Detalles) & Services (Servicios): Muestra PIDs, línea de comandos, árboles de hilos y servicios atados.',
      ],
      whatToLookFor: [
        'Procesos consumiendo más del 80% de un núcleo individual',
        'Consumo de memoria creciente sin estabilizar (Memory Leak)',
        'Línea de comandos del proceso para verificar su ejecutable real',
      ],
      whatNotToMisinterpret: 'Ver 100% de uso de CPU durante 2 segundos al abrir una app pesada no es un problema; es el comportamiento esperado de ráfaga (burst) del procesador.',
    },
    profundiza: {
      title: 'Límites de Task Manager y cuándo pasar a Resource Monitor',
      technicalDetails: [
        'Task Manager muestrea datos cada 1 segundo (por defecto) en modo Normal.',
        'No desglosa qué archivos específicos están siendo leídos en el disco (sólo muestra el porcentaje de tiempo activo del volumen).',
        'No muestra conexiones de red socket por socket con IP remota y puerto (sólo muestra Mbps por proceso).',
      ],
      lowLevelNote: 'Para ver qué archivo exacto tiene bloqueado el disco o a qué IP remota transmite un proceso, hay que saltar a Resource Monitor (resmon.exe).',
      whenToUseOtherTool: 'Usá Resource Monitor (resmon) cuando necesites ver rutas de archivos abiertas en disco o direcciones IP remotas de socket.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir Task Manager mediante el atajo directo e inspeccionar la pestaña Detalles',
      steps: [
        'Presioná Ctrl + Shift + Esc.',
        'Si la interfaz está compacta, hacé clic en "Más detalles".',
        'Navegá a la pestaña "Detalles" y observá la columna "PID" y "Nombre de imagen".',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc',
      expectedVisual: 'Ventana del Administrador de tareas con consumo de CPU, Memoria, Disco y tabla de procesos.',
    },
    comprobalo: {
      instruction: 'Apertura confirmada del Administrador de Tareas.',
      actionPrompt: 'Verificá el atajo Ctrl+Shift+Esc.',
      validationKey: 'TASKMGR_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Cuál es el atajo de teclado más directo para abrir el Administrador de Tareas en Windows sin pasar por Ctrl+Alt+Del?',
      instruction: 'Seleccioná la respuesta correcta.',
      options: [
        { id: 'opt1', text: 'Ctrl + Shift + Esc', isCorrect: true, feedback: '¡Exacto! Abre Task Manager directamente en el kernel de la sesión.' },
        { id: 'opt2', text: 'Win + R e ingresar cmd', isCorrect: false, feedback: 'Incorrecto: Eso abre la consola de comandos.' },
        { id: 'opt3', text: 'Alt + F4', isCorrect: false, feedback: 'Incorrecto: Eso cierra la ventana activa.' },
      ],
    },
    evidencia: {
      fieldName: 'TASK_MANAGER_VERIFIED',
      targetDescription: 'Comprensión y acceso verificado al Administrador de Tareas',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-02',
    code: '03.02',
    title: 'Resource Monitor',
    subtitle: 'Inspección de grano fino: handles de archivo, sockets de red y módulos cargados',
    category: 'RENDIMIENTO',
    commandToOpen: 'resmon.exe',
    shortcut: 'Win + R -> resmon',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: '¿Windows te dice "El archivo está siendo usado por otro programa" y no sabés cuál es? Resource Monitor resuelve ese misterio en 5 segundos.',
      mythVsTruth: {
        mentira: 'Resource Monitor es un duplicado innecesario del Task Manager.',
        verdad: 'Resource Monitor inspecciona la capa interna de I/O: qué archivo está abierto, qué puerto TCP está escuchando y qué DLL está mapeada.',
        comprobalo: 'Abrí `resmon.exe`, desplegá la pestaña "Disco" y buscá el panel "Identificadores asociados" (Associated Handles).',
      },
    },
    entende: {
      title: 'Las 4 pestañas forenses de Resource Monitor',
      explanation: [
        'Resmon divide el análisis del sistema en 4 subsistemas críticos:',
        '1) CPU: Muestra procesos, servicios atados y llamadas a hilos individuales.',
        '2) Memory (Memoria): Desglosa la RAM en Reservada para hardware,En uso, Modificada, En espera (Standby) y Libre.',
        '3) Disk (Disco): Muestra la tasa de lectura/escritura B/s archivo por archivo con tiempo de respuesta en ms.',
        '4) Network (Red): Muestra conexiones activas con dirección IP remota, puerto, bytes transmitidos y puertos en escucha.',
      ],
      whatToLookFor: [
        'Archivos con tiempo de respuesta de disco superior a 100 ms (cuello de botella de almacenamiento)',
        'Procesos no reconocidos transmitiendo en la pestaña Red a IPs externas',
        'Fugas de memoria en la sección "En espera" vs "En uso"',
      ],
      whatNotToMisinterpret: 'Ver la memoria "En espera" (Standby) llena es algo positivo; significa que Windows usó RAM libre para almacenar en caché archivos leídos recientemente.',
    },
    profundiza: {
      title: 'Identificadores asociados (Associated Handles)',
      technicalDetails: [
        'Un Handle es una referencia opaca que el kernel otorga a un proceso para acceder a un recurso (archivo, clave de registro, mutex, socket).',
        'En la sección CPU -> Identificadores asociados podés escribir el nombre de cualquier archivo bloqueado y Resmon te devolverá exactamente qué proceso (ej. `mysqld.exe` o `excel.exe`) tiene la marca de bloqueo.',
      ],
      lowLevelNote: 'Usa internamente la API de NtQuerySystemInformation del NT Kernel.',
      whenToUseOtherTool: 'Si necesitás ver el árbol jerárquico de procesos con colores de firmas de código, utilizá Process Explorer (Sysinternals).',
    },
    miraloEnTuPc: {
      actionName: 'Ejecutar resmon.exe para buscar un archivo bloqueado',
      steps: [
        'Presioná Win + R, escribí `resmon` y presioná Enter.',
        'Hacé clic en la pestaña "Disco".',
        'Desplegá el panel "Actividad del disco" y observá la columna "Archivo".',
      ],
      commandOrPath: 'resmon.exe',
      shortcut: 'Win + R -> resmon',
      expectedVisual: 'Consola de Resource Monitor con gráficos de CPU, Memoria, Disco y Red.',
    },
    comprobalo: {
      instruction: 'Apertura y verificación de Resource Monitor.',
      actionPrompt: 'Ejecutá resmon.exe.',
      validationKey: 'RESMON_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué ventaja crítica ofrece la pestaña "Disco" de Resource Monitor frente al Administrador de Tareas?',
      instruction: 'Seleccioná la opción correcta.',
      options: [
        { id: 'opt1', text: 'Muestra la ruta exacta del archivo que se está leyendo o escribiendo en el disco.', isCorrect: true, feedback: '¡Correcto! Te da la ruta física completa del archivo en I/O.' },
        { id: 'opt2', text: 'Formatea el disco automáticamente.', isCorrect: false, feedback: 'Incorrecto: Resmon es una herramienta de monitoreo.' },
        { id: 'opt3', text: 'Aumenta la velocidad de lectura.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'RESOURCE_MONITOR_VERIFIED',
      targetDescription: 'Dominio de la herramienta Resource Monitor',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-03',
    code: '03.03',
    title: 'Performance Monitor',
    subtitle: 'Telemetría profesional con contadores WMI, Data Collector Sets y trazado histórico',
    category: 'RENDIMIENTO',
    commandToOpen: 'perfmon.msc',
    shortcut: 'Win + R -> perfmon',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Cuando necesitás medir el rendimiento de un servidor durante 24 horas continuas sin estar sentado frente a la pantalla, Performance Monitor es la única herramienta oficial.',
      mythVsTruth: {
        mentira: 'Perfmon es sólo una gráfica roja y verde que marea.',
        verdad: 'Perfmon es el motor industrial de contadores de rendimiento de Windows (Performance Counters), capaz de registrar métricas de kernel a disco en informes HTML/CSV.',
        comprobalo: 'Ejecutá `perfmon.msc`, hacé clic en "Monitor de rendimiento" y agregá un contador haciendo clic en el signo más (+).',
      },
    },
    entende: {
      title: 'El concepto de Contadores de Rendimiento (Performance Counters)',
      explanation: [
        'Perfmon funciona con una arquitectura estructurada de 3 niveles:',
        '1) Objeto de rendimiento (Performance Object): El subsistema a medir (ej. Processor, LogicalDisk, Memory, Network Interface).',
        '2) Contador (Counter): La métrica específica dentro del objeto (ej. % Processor Time, Avg. Disk Queue Length, Pages/sec).',
        '3) Instancia (Instance): El componente físico o lógico particular (ej. CPU Core 0, Disco C:, proceso explorer).',
      ],
      whatToLookFor: [
        'LogicalDisk -> Avg. Disk sec/Read superior a 0.020 (20 ms de latencia)',
        'System -> Processor Queue Length superior a 2 x número de núcleos de CPU',
        'Memory -> Pages/sec sostenido muy alto (exceso de uso de memoria virtual en disco)',
      ],
      whatNotToMisinterpret: 'Un pico puntual en un gráfico de 1 segundo no es un fallo; la telemetría exige evaluar promedios en intervalos de tiempo prolongados.',
    },
    profundiza: {
      title: 'Conjuntos de recopiladores de datos (Data Collector Sets)',
      technicalDetails: [
        'Permiten programar captura autónoma de contadores en segundo plano guardando logs en formato `.blg` o `.csv`.',
        'Incluye diagnósticos preconfigurados del sistema (System Diagnostics y System Performance).',
      ],
      lowLevelNote: 'Los logs `.blg` se pueden analizar posteriormente en herramientas como PAL (Performance Analysis of Logs).',
      whenToUseOtherTool: 'Para ver fallos de aplicaciones con fecha e historial de actualizaciones, usá Reliability Monitor (`perfmon /rel`).',
    },
    miraloEnTuPc: {
      actionName: 'Abrir perfmon.msc y agregar un contador de disco',
      steps: [
        'Presioná Win + R, escribí `perfmon` y presionalo.',
        'Hacé clic en "Monitor de rendimiento" en el panel izquierdo.',
        'Hacé clic en el icono verde `+` arriba del gráfico, seleccioná "LogicalDisk" y elegí "Avg. Disk sec/Read".',
      ],
      commandOrPath: 'perfmon.msc',
      shortcut: 'Win + R -> perfmon',
      expectedVisual: 'Gráfico de líneas en tiempo real dibujando la telemetría de los contadores seleccionados.',
    },
    comprobalo: {
      instruction: 'Apertura y verificación de Performance Monitor.',
      actionPrompt: 'Ejecutá perfmon.msc.',
      validationKey: 'PERFMON_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué combinación de Objeto y Contador en Perfmon indica que el almacenamiento está demorando demasiado en responder?',
      instruction: 'Elegí la métrica correcta.',
      options: [
        { id: 'opt1', text: 'LogicalDisk -> Avg. Disk sec/Read > 0.020 segundos', isCorrect: true, feedback: '¡Excelente! Más de 20 ms significa latencia alta en lecturas de disco.' },
        { id: 'opt2', text: 'Memory -> Available MBytes', isCorrect: false, feedback: 'Incorrecto: Mide memoria disponible, no latencia de disco.' },
        { id: 'opt3', text: 'Processor -> Interrupts/sec', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PERFORMANCE_MONITOR_VERIFIED',
      targetDescription: 'Uso de contadores en Performance Monitor',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-04',
    code: '03.04',
    title: 'Event Viewer',
    subtitle: 'El registro forense centralizado de eventos del sistema, aplicaciones y seguridad',
    category: 'ERRORES',
    commandToOpen: 'eventvwr.msc',
    shortcut: 'Win + R -> eventvwr',
    riskLevel: 'READ_ONLY_SAFE',
    descubri: {
      hook: 'Cuando ocurre un fallo misterioso o un reinicio inesperado, la respuesta casi siempre está escrita en el Visor de Eventos.',
      mythVsTruth: {
        mentira: 'Tener eventos de nivel "Error" o "Advertencia" en el Event Viewer significa que Windows está infectado o dañado.',
        verdad: 'Event Viewer registra la actividad normal del sistema. Un sistema 100% sano acumula miles de advertencias no críticas.',
        comprobalo: 'Abrí `eventvwr.msc`, navegá a "Registros de Windows" -> "Sistema" y filtrá por Nivel: Error.',
      },
    },
    entende: {
      title: 'Estructura de un Evento Canónico',
      explanation: [
        'Cada entrada en el Visor de eventos contiene 4 atributos fundamentales:',
        '1) Log Name (Nombre de registro): System, Application, Security o Setup.',
        '2) Level (Nivel): Information, Warning, Error, Critical.',
        '3) Source (Origen) & Event ID: El módulo específico que emitió el mensaje y su número único de catálogo (ej. Event ID 41 = Kernel-Power / reinicio sucio).',
        '4) Date and Time (Fecha y Hora): Marca temporal exacta con precisión de milisegundos.',
      ],
      whatToLookFor: [
        'Event ID 41 (Kernel-Power): El equipo se reinició sin apagar limpiamente.',
        'Event ID 7001 / 7036 (Service Control Manager): Cambios de estado en servicios.',
        'Event ID 1001 (BugCheck / Windows Error Reporting): Detalles de un colapso BSOD.',
      ],
      whatNotToMisinterpret: 'REGLA CRÍTICA: EVENTO ≠ CAUSA AUTOMÁTICA. Ver un error de DCOM (Event ID 10016) es completamente habitual y Microsoft desaconseja intentar solucionarlo si el sistema funciona.',
    },
    profundiza: {
      title: 'Vistas personalizadas (Custom Views) y XML Filtering',
      technicalDetails: [
        'Permite crear filtros para capturar únicamente eventos críticos de discos (DistributedCOM, Ntfs, Disk) o seguridad (Audit Failures).',
        'Los registros físicos se guardan en formato `.evtx` dentro de `C:\Windows\System32\winevt\Logs\`.',
      ],
      lowLevelNote: 'Los archivos `.evtx` son bases de datos estructuradas binarias que se pueden consultar por PowerShell usando `Get-WinEvent`.',
      whenToUseOtherTool: 'Para ver una línea de tiempo gráfica de la estabilidad del sistema día por día, usá Reliability Monitor.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir Event Viewer y filtrar el registro de Sistema por errores',
      steps: [
        'Presioná Win + R, escribí `eventvwr` y presioná Enter.',
        'En el árbol izquierdo, expandí "Registros de Windows" y hacé clic en "Sistema".',
        'En el panel derecho, hacé clic en "Filtrar registro actual..." y marcá "Error" y "Crítico".',
      ],
      commandOrPath: 'eventvwr.msc',
      shortcut: 'Win + R -> eventvwr',
      expectedVisual: 'Lista de eventos con iconos rojos de error con sus correspondientes Event IDs.',
    },
    comprobalo: {
      instruction: 'Apertura del Visor de eventos.',
      actionPrompt: 'Ejecutá eventvwr.msc.',
      validationKey: 'EVENTVWR_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un cliente te dice: "Tengo 50 errores en el Visor de Eventos, hay que formatear la PC". ¿Cuál es el criterio técnico correcto?',
      instruction: 'Elegí la mejor postura profesional.',
      options: [
        { id: 'opt1', text: 'Analizar si los eventos están asociados al problema real que experimenta el usuario; tener advertencias y errores menores es normal.', isCorrect: true, feedback: '¡Perfecto! Un evento sólo es relevante si correlaciona con la falla reportada.' },
        { id: 'opt2', text: 'Formatear de inmediato para borrar los logs.', isCorrect: false, feedback: 'Incorrecto: Formatear por ver errores en logs es una mala práctica.' },
        { id: 'opt3', text: 'Borrar todos los eventos para engañar al usuario.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'EVENT_VIEWER_VERIFIED',
      targetDescription: 'Lectura pericial de Event Viewer',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-05',
    code: '03.05',
    title: 'Reliability Monitor',
    subtitle: 'El índice de estabilidad del sistema y la línea de tiempo temporal de incidentes',
    category: 'ERRORES',
    commandToOpen: 'perfmon /rel',
    shortcut: 'Win + R -> perfmon /rel',
    riskLevel: 'READ_ONLY_SAFE',
    descubri: {
      hook: 'Es la herramienta de diagnóstico más elegante y poco conocida de Windows: te da un puntaje de estabilidad del 1 al 10 dibujado en un calendario.',
      mythVsTruth: {
        mentira: 'Para saber qué día empezó a fallar un programa hay que revisar miles de líneas de logs a mano.',
        verdad: 'Reliability Monitor procesa los eventos y los grafica en una línea de tiempo diaria relacionando actualizaciones con caídas de apps.',
        comprobalo: 'Presioná Win + R, ejecutá `perfmon /rel` y observá la curva gráfica de estabilidad de los últimos 30 días.',
      },
    },
    entende: {
      title: 'Análisis de Correlación Temporal',
      explanation: [
        'Reliability Monitor clasifica los sucesos en 5 filas paralelas:',
        '1) Fallas de aplicaciones (Application failures): Cierres inesperados (.exe crashed).',
        '2) Fallas de Windows (Windows failures): Pantallas azules (BSOD) o cuelgues del explorador.',
        '3) Fallas de hardware (Hardware failures): Discos discontinuados o problemas de memoria.',
        '4) Advertencias (Warnings): Instalaciones fallidas o controladores con alertas.',
        '5) Información (Information): Actualizaciones de Windows Update o apps instaladas con éxito.',
      ],
      whatToLookFor: [
        'Caídas del índice de estabilidad de 10 a 1 en un día específico.',
        'Correlación: si el martes se instaló un driver y el miércoles empezaron las fallas de Windows, el driver es el sospechoso principal.',
      ],
      whatNotToMisinterpret: 'Un puntaje temporal de 4 no significa que la PC esté rota hoy si el problema ocurrió hace dos semanas y ya no se repitió.',
    },
    profundiza: {
      title: 'Integración con Windows Error Reporting (WER)',
      technicalDetails: [
        'Toma sus datos directamente de la base de datos de RACDB (Reliability Analysis Component Database) ubicada en `C:\ProgramData\Microsoft\RAC\`.',
        'Permite hacer clic en "Ver detalles técnicos" de cualquier fallo para obtener el nombre del módulo defectuoso (Fault Module Name).',
      ],
      lowLevelNote: 'Si una app falla por `ntdll.dll` o `kernelbase.dll`, la causa raíz suele ser un complemento de terceros cargado dentro del proceso.',
      whenToUseOtherTool: 'Si la falla ocurre en el arranque y el equipo no inicia Windows, usá el Entorno de Recuperación (WinRE).',
    },
    miraloEnTuPc: {
      actionName: 'Abrir Monitor de Confiabilidad y revisar la gráfica histórica',
      steps: [
        'Presioná Win + R, escribí `perfmon /rel` y presioná Enter.',
        'Esperá unos segundos a que cargue la gráfica de estabilidad.',
        'Hacé clic en cualquier día que tenga una cruz roja para inspeccionar los eventos de esa fecha.',
      ],
      commandOrPath: 'perfmon /rel',
      shortcut: 'Win + R -> perfmon /rel',
      expectedVisual: 'Gráfico con escala de 1 a 10 con líneas azules e iconos de fallas organizados por día.',
    },
    comprobalo: {
      instruction: 'Apertura y verificación de Reliability Monitor.',
      actionPrompt: 'Ejecutá perfmon /rel.',
      validationKey: 'RELIABILITY_MONITOR_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué Reliability Monitor es superior al Event Viewer para un diagnóstico inicial rápido de un cliente?',
      instruction: 'Seleccioná la respuesta correcta.',
      options: [
        { id: 'opt1', text: 'Porque muestra de forma gráfica la correlación temporal entre actualizaciones instaladas y fallas de programas.', isCorrect: true, feedback: '¡Totalmente! Te permite ver causa y efecto en una sola vista de calendario.' },
        { id: 'opt2', text: 'Porque elimina los virus automáticamente.', isCorrect: false, feedback: 'Incorrecto: No es un antivirus.' },
        { id: 'opt3', text: 'Porque reemplaza la memoria RAM.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'RELIABILITY_MONITOR_VERIFIED',
      targetDescription: 'Uso de Reliability Monitor para correlación de fallas',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-06',
    code: '03.06',
    title: 'Device Manager',
    subtitle: 'Gestión de hardware, árbol de dispositivos, PnP, Hardware IDs y controladores',
    category: 'HARDWARE',
    commandToOpen: 'devmgmt.msc',
    shortcut: 'Win + X -> Administrador de dispositivos',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Es la consola central para responder la pregunta: "¿Windows reconoció mi placa de video / Wi-Fi o me falta instalar el driver oficial?"',
      mythVsTruth: {
        mentira: 'Si un dispositivo aparece con un triangulo amarillo con signo de exclamación (!), el hardware está roto físicamente.',
        verdad: 'Un triángulo amarillo indica un problema de controlador (código de error PnP), como falta de driver o conflicto de recursos.',
        comprobalo: 'Abrí `devmgmt.msc`, buscá cualquier dispositivo, hacé doble clic e inspeccioná el "Estado del dispositivo".',
      },
    },
    entende: {
      title: 'Hardware IDs y Códigos de Error Plug and Play',
      explanation: [
        'Device Manager organiza los periféricos y componentes en categorías Plug & Play.',
        'Si un dispositivo no se reconoce (Dispositivo desconocido / Unknown Device), la clave está en la pestaña Detalles -> Identificadores de hardware (Hardware IDs).',
        'Contiene las etiquetas VEN_xxxx (Vendor ID) y DEV_xxxx (Device ID) que identifican inequívocamente al fabricante y chip exacto.',
      ],
      whatToLookFor: [
        'Código 10: El dispositivo no puede iniciar (driver incorrecto o falla ligera).',
        'Código 43: Windows detuvo el dispositivo porque informó de un problema (muy común en GPUs con fallas de VRAM o firmware).',
        'Código 28: Los controladores para este dispositivo no están instalados.',
      ],
      whatNotToMisinterpret: 'Hacer clic en "Buscar cambios de hardware" no descarga controladores de internet; sólo le pide a Windows que vuelva a escanear el bus PCIe/USB.',
    },
    profundiza: {
      title: 'Ver dispositivos ocultos (Show hidden devices)',
      technicalDetails: [
        'Por defecto, Device Manager oculta los dispositivos desconectados o virtuales en reposo.',
        'Activando Ver -> Mostrar dispositivos ocultos podés limpiar antiguos controladores fantasma de pendrives o adaptadores de red VPN antiguos.',
      ],
      lowLevelNote: 'Los datos provienen del árbol PnP de la clave de registro `HKLM\SYSTEM\CurrentControlSet\Enum`.',
      whenToUseOtherTool: 'Para obtener un resumen completo de especificaciones de hardware sin árbol PnP, usá System Information (`msinfo32`).',
    },
    miraloEnTuPc: {
      actionName: 'Abrir devmgmt.msc e inspeccionar el Hardware ID de la placa de red',
      steps: [
        'Presioná Win + R, escribí `devmgmt.msc` y presioná Enter.',
        'Expandí la categoría "Adaptadores de red".',
        'Hacé doble clic en tu placa de red, ve a "Detalles" y seleccioná "Identificadores de hardware" en el desplegable.',
      ],
      commandOrPath: 'devmgmt.msc',
      shortcut: 'Win + X -> M',
      expectedVisual: 'Árbol de categorías de hardware con opciones de actualización y propiedades de dispositivos.',
    },
    comprobalo: {
      instruction: 'Apertura del Administrador de dispositivos.',
      actionPrompt: 'Ejecutá devmgmt.msc.',
      validationKey: 'DEVMGMT_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué propiedad dentro de las propiedades de un "Dispositivo desconocido" te permite averiguar el fabricante real del chip en Google?',
      instruction: 'Elegí el campo correcto.',
      options: [
        { id: 'opt1', text: 'Identificadores de hardware (Hardware IDs) con VEN_xxxx y DEV_xxxx', isCorrect: true, feedback: '¡Exacto! Esos códigos identifican el vendedor y dispositivo a nivel de silicio.' },
        { id: 'opt2', text: 'El nombre de la PC', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'El tamaño del disco C:', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'DEVICE_MANAGER_VERIFIED',
      targetDescription: 'Uso de Device Manager e identificación de Hardware IDs',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-07',
    code: '03.07',
    title: 'Services',
    subtitle: 'La consola de administración de procesos en segundo plano de sistema (services.msc)',
    category: 'SERVICIOS_ARRANQUE',
    commandToOpen: 'services.msc',
    shortcut: 'Win + R -> services.msc',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Casi todo lo que hace Windows en segundo plano sin interfaz gráfica (impresión, Windows Update, audio, red) funciona como un servicio.',
      mythVsTruth: {
        mentira: 'Desactivar decenas de servicios de Windows es el mejor truco para acelerar la PC en juegos.',
        verdad: 'Desactivar servicios a ciegas rompe dependencias críticas en cadena y bloquea actualizaciones o componentes del sistema.',
        comprobalo: 'Abrí `services.msc`, hacé doble clic en "Cola de impresión" (Spooler) e inspeccioná la pestaña "Dependencias".',
      },
    },
    entende: {
      title: 'Los 4 Tipos de Inicio de un Servicio',
      explanation: [
        'Cada servicio se configura con una modalidad de inicio específica:',
        '1) Automático (Automatic): Inicia inmediatamente durante el arranque de Windows.',
        '2) Automático (inicio retrasado) [Delayed Start]: Inicia 2 minutos después del arranque para no congestionar el disco.',
        '3) Manual: Inicia únicamente cuando una app o el usuario solicita su función.',
        '4) Deshabilitado (Disabled): El kernel bloquea la ejecución del servicio bajo cualquier circunstancia.',
      ],
      whatToLookFor: [
        'Nombre del servicio vs Nombre de mostrar (Display Name).',
        'Ruta del ejecutable (`Path to executable`): Si apunta a `svchost.exe -k <grupo>`, corre compartido.',
        'Cuenta de inicio de sesión: Local System, Network Service o Local Service.',
      ],
      whatNotToMisinterpret: 'Ver un servicio en estado "Detenido" no es un error; los servicios configurados en "Manual" se detienen solos cuando terminan su tarea.',
    },
    profundiza: {
      title: 'Pestaña Dependencias y Recuperación',
      technicalDetails: [
        'La pestaña Dependencias revela qué otros servicios necesitan estar activos para que el servicio seleccionado funcione.',
        'La pestaña Recuperación configura qué acción tomar si el servicio se cae (Reiniciar el servicio, Ejecutar un programa o Reiniciar el equipo).',
      ],
      lowLevelNote: 'La configuración de los servicios se almacena en la clave de registro `HKLM\SYSTEM\CurrentControlSet\Services\`.',
      whenToUseOtherTool: 'Para administrar o detener servicios mediante consola de comandos Scripting, usá `sc.exe` o `Get-Service` en PowerShell.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir services.msc y revisar el estado del Spooler de impresión',
      steps: [
        'Presioná Win + R, escribí `services.msc` y presioná Enter.',
        'Buscá "Cola de impresión" (Print Spooler) en la lista.',
        'Hacé doble clic para abrir sus propiedades y ve a la pestaña "Dependencias".',
      ],
      commandOrPath: 'services.msc',
      shortcut: 'Win + R -> services.msc',
      expectedVisual: 'Consola MMC con lista completa de servicios, estado, tipo de inicio e inicio de sesión.',
    },
    comprobalo: {
      instruction: 'Apertura de la consola de Servicios.',
      actionPrompt: 'Ejecutá services.msc.',
      validationKey: 'SERVICES_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué la opción "Automático (inicio retrasado)" es recomendada para servicios no esenciales en lugar de "Automático"?',
      instruction: 'Elegí la razón técnica.',
      options: [
        { id: 'opt1', text: 'Porque reduce la congestión de lectura de disco y CPU durante los primeros minutos de inicio de sesión.', isCorrect: true, feedback: '¡Exacto! Permite que el escritorio responda más rápido antes de cargar tareas secundarias.' },
        { id: 'opt2', text: 'Porque elimina la necesidad de tener contraseña.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Porque borra la caché de internet.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SERVICES_CONSOLES_VERIFIED',
      targetDescription: 'Comprensión y gestión de servicios de Windows',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-08',
    code: '03.08',
    title: 'Task Scheduler',
    subtitle: 'Programación de tareas automáticas, desencadenadores por eventos y mantenimiento',
    category: 'SERVICIOS_ARRANQUE',
    commandToOpen: 'taskschd.msc',
    shortcut: 'Win + R -> taskschd.msc',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Windows no necesita que estés frente a la PC para desfragmentar el disco, buscar actualizaciones o ejecutar un respaldo; todo se programa aquí.',
      mythVsTruth: {
        mentira: 'Los programas de inicio sólo arrancan desde la carpeta de Inicio del menú o la clave de Registro Run.',
        verdad: 'Muchos programas modernos y elementos de persistencia utilizan el Programador de Tareas para iniciar con privilegios elevados sin mostrar alerta de UAC.',
        comprobalo: 'Ejecutá `taskschd.msc`, expandí la "Biblioteca del Programador de tareas" e inspeccioná las tareas de Google, Microsoft o NVIDIA.',
      },
    },
    entende: {
      title: 'Estructura Canónica: Tarea -> Desencadenador -> Acción',
      explanation: [
        'Toda tarea programada en Windows requiere 3 componentes lógicos:',
        '1) Desencadenador (Trigger): El evento que dispara la tarea (ej. A una hora fija, Al iniciar sesión, Al conectarse a una red Wi-Fi, Al ocurrir un Event ID específico).',
        '2) Acción (Action): La instrucción a ejecutar (ej. Iniciar un programa ejecutable con parámetros específicos o enviar un correo).',
        '3) Condiciones y Configuración: Reglas de energía (sólo si la laptop está enchufada) o reintentos si falla.',
      ],
      whatToLookFor: [
        'Tareas desconocidas ejecutando scripts `.vbs`, `.ps1` o `.bat` desde carpetas de temporales (`%TEMP%`).',
        'Acción "Iniciar un programa" apuntando a `powershell.exe` con argumentos codificados en Base64.',
      ],
      whatNotToMisinterpret: 'Ver decenas de tareas en la carpeta `Microsoft\Windows` es normal; son las rutinas de automantenimiento oficial del sistema operativo.',
    },
    profundiza: {
      title: 'Privilegios de ejecución e historia de eventos',
      technicalDetails: [
        'Las tareas pueden configurarse para correr con la cuenta `NT AUTHORITY\SYSTEM` o `Ejecutar con los privilegios más altos`.',
        'Permite habilitar el "Historial de tareas" para auditar a qué hora exacta arrancó cada script y qué código de salida devolvió (`0x0` = Éxito).',
      ],
      lowLevelNote: 'Las tareas se guardan en formato XML dentro de `C:\Windows\System32\Tasks\`.',
      whenToUseOtherTool: 'Para desactivar aplicaciones de arranque de usuario convencionales de forma rápida, usá la pestaña "Startup Apps" en Task Manager.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir taskschd.msc y revisar la Biblioteca de tareas',
      steps: [
        'Presioná Win + R, escribí `taskschd.msc` y presioná Enter.',
        'Hacé clic en "Biblioteca del Programador de tareas" en la columna izquierda.',
        'Seleccioná cualquier tarea y observá las pestañas "Desencadenadores" y "Acciones" en la parte inferior.',
      ],
      commandOrPath: 'taskschd.msc',
      shortcut: 'Win + R -> taskschd.msc',
      expectedVisual: 'Consola MMC del Programador de tareas con biblioteca, desencadenadores y panel de acciones.',
    },
    comprobalo: {
      instruction: 'Apertura del Programador de tareas.',
      actionPrompt: 'Ejecutá taskschd.msc.',
      validationKey: 'TASKSCHD_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué un atacante o software no deseado preferiría usar el Programador de tareas en lugar de la carpeta de inicio para persistir?',
      instruction: 'Elegí la razón pericial.',
      options: [
        { id: 'opt1', text: 'Porque puede ejecutarse con privilegios de SYSTEM sin solicitar confirmación de UAC en cada reinicio.', isCorrect: true, feedback: '¡Excelente análisis! El Programador de tareas permite saltear el aviso de UAC si fue configurado por un administrador.' },
        { id: 'opt2', text: 'Porque acelera la velocidad de la memoria RAM.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Porque impide que se borren los archivos.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TASK_SCHEDULER_VERIFIED',
      targetDescription: 'Auditoría de tareas en el Programador de tareas',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-09',
    code: '03.09',
    title: 'MSConfig',
    subtitle: 'Configuración del sistema: diagnóstico de arranque, servicios y modo a prueba de fallos',
    category: 'SERVICIOS_ARRANQUE',
    commandToOpen: 'msconfig.exe',
    shortcut: 'Win + R -> msconfig',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Era la reina absoluta del diagnóstico en Windows XP y 7. Hoy sigue siendo vital para una sola cosa: configurar el Arranque a prueba de errores (Safe Boot).',
      mythVsTruth: {
        mentira: 'Entrar a MSConfig -> Opciones avanzadas de arranque y marcar "Número de procesadores" al máximo acelera la PC.',
        verdad: 'Esa casilla es una herramienta de LIMITACIÓN para pruebas de desarrolladores. Marcarla no acelera nada y puede causar BSODs de arranque.',
        comprobalo: 'Abrí `msconfig.exe`, ve a la pestaña "Arranque" y observá la casilla "Arranque a prueba de errores".',
      },
    },
    entende: {
      title: 'Funciones Vigentes vs Migradas de MSConfig',
      explanation: [
        '1) Pestaña General: Permite seleccionar Inicio normal, Inicio de diagnóstico e Inicio con selección.',
        '2) Pestaña Arranque (Boot): Configuración de Safe Mode (Mínimo, Red, Shell de comandos), tiempo de espera del menú BCD y registro de arranque.',
        '3) Pestaña Servicios: Incluye la casilla salvadora "Ocultar todos los servicios de Microsoft" para aislar servicios de terceros.',
        '4) Pestaña Inicio de Windows: En Windows 10/11 te redirige a Task Manager.',
      ],
      whatToLookFor: [
        'Usar "Ocultar todos los servicios de Microsoft" para encontrar qué servicio de terceros causa un colapso en el arranque.',
        'Configurar Arranque a prueba de errores en modo "Mínimo" para eliminar malware persistente.',
      ],
      whatNotToMisinterpret: 'Jamás uses MSConfig como un "optimizador de rendimiento diario". Es una consola de diagnóstico temporal.',
    },
    profundiza: {
      title: 'El mito peligroso del "Número de procesadores"',
      technicalDetails: [
        'Por defecto, la casilla "Número de procesadores" en MSConfig está desmarcada, lo que significa que Windows detecta y usa el 100% de los núcleos físicos y lógicos del procesador.',
        'Si la marcás manualmente en 1 para intentar probar un entorno mononúcleo, podrías dejar a la PC funcionando drásticamente más lenta hasta que deshagas el cambio.',
      ],
      lowLevelNote: 'Modifica los parámetros de arranque del BCD (Boot Configuration Data) equivale a usar `bcdedit /set numproc`.',
      whenToUseOtherTool: 'Para administrar las apps de inicio de usuario normales, usá directamente la pestaña "Startup Apps" en Task Manager o Settings.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir MSConfig e inspeccionar la pestaña Servicios con filtro de Microsoft',
      steps: [
        'Presioná Win + R, escribí `msconfig` y presioná Enter.',
        'Hacé clic en la pestaña "Servicios".',
        'Marcá la casilla inferior "Ocultar todos los servicios de Microsoft" y observá la lista limpia de servicios de aplicaciones instaladas.',
      ],
      commandOrPath: 'msconfig.exe',
      shortcut: 'Win + R -> msconfig',
      expectedVisual: 'Ventana de Configuración del sistema con pestañas General, Arranque, Servicios, Herramientas.',
    },
    comprobalo: {
      instruction: 'Apertura de la herramienta MSConfig.',
      actionPrompt: 'Ejecutá msconfig.exe.',
      validationKey: 'MSCONFIG_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué casilla en la pestaña Servicios de MSConfig es fundamental activar antes de deshabilitar servicios para no dejar la PC ininiciable?',
      instruction: 'Seleccioná la casilla de seguridad.',
      options: [
        { id: 'opt1', text: 'Ocultar todos los servicios de Microsoft', isCorrect: true, feedback: '¡Imprescindible! Protege los servicios esenciales del SO de ser desactivados por accidente.' },
        { id: 'opt2', text: 'Deshabilitar todos los discos', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Activar modo juego', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'MSCONFIG_VERIFIED',
      targetDescription: 'Uso de MSConfig y desmitificación de opciones de arranque',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-10',
    code: '03.10',
    title: 'Disk Management',
    subtitle: 'Administración de discos físicos, particiones, volúmenes, letras de unidad y sistemas de archivos',
    category: 'ALMACENAMIENTO',
    commandToOpen: 'diskmgmt.msc',
    shortcut: 'Win + X -> Administración de discos',
    riskLevel: 'CRITICAL_SYSTEM_RISK',
    descubri: {
      hook: 'Conectaste un disco rígido nuevo o un pendrive y no aparece en "Este equipo". En el 90% de los casos, Disk Management lo tiene esperando para asignarle letra o formato.',
      mythVsTruth: {
        mentira: 'Si un disco no muestra letra en Explorer significa que está roto y quemado.',
        verdad: 'Un disco puede estar en estado "Sin inicializar", "Sin asignar" o con un sistema de archivos no nativo (ej. EXT4 de Linux), requiriendo formato o asignación de letra.',
        comprobalo: 'Ejecutá `diskmgmt.msc` y observá el mapa de barras horizontales con el esquema de particiones MBR o GPT.',
      },
    },
    entende: {
      title: 'Estructura Visual de Discos, Particiones y Volúmenes',
      explanation: [
        'Disk Management representa gráficamente cada unidad física de almacenamiento:',
        '1) Disco 0, Disco 1: La unidad física (SSD NVMe, HDD SATA o Pendrive USB).',
        '2) Partición de sistema EFI (FAT32): Contiene los archivos de arranque del firmware UEFI (100 MB - 500 MB).',
        '3) Volumen Principal (C: - NTFS): La partición donde está instalado Windows.',
        '4) Partición de recuperación (WinRE): Contiene la imagen del entorno de reparación.',
      ],
      whatToLookFor: [
        'Estado del volumen: "Correcto (Sistema, Arranque, Archivo de paginación, Volcado de memoria, Partición primaria)".',
        'Espacio no asignado (Unallocated): Espacio físico en el disco que aún no ha sido formateado en una partición útil.',
      ],
      whatNotToMisinterpret: 'CUIDADO: La acción "Eliminar volumen" destruye instantáneamente la tabla de archivos y los datos de esa partición sin posibilidad de deshacer fácil.',
    },
    profundiza: {
      title: 'Esquema de tabla de particiones: MBR vs GPT',
      technicalDetails: [
        'MBR (Master Boot Record): Esquema legacy, limita a máximo 4 particiones primarias y 2 TB por disco.',
        'GPT (GUID Partition Table): Esquema moderno UEFI, soporta hasta 128 particiones y discos de exabytes.',
      ],
      lowLevelNote: 'Para operaciones avanzadas de particionado en línea de comandos (scripts o reparación BCD), se usa `diskpart.exe`.',
      whenToUseOtherTool: 'Para convertir un disco MBR a GPT sin perder datos, utilizá la herramienta oficial de consola `mbr2gpt.exe`.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir diskmgmt.msc y revisar la partición EFI y de Recuperación',
      steps: [
        'Presioná Win + R, escribí `diskmgmt.msc` y presioná Enter.',
        'Observá la barra inferior correspondiente al "Disco 0".',
        'Identificá la partición EFI de 100 MB y la partición principal C:.',
      ],
      commandOrPath: 'diskmgmt.msc',
      shortcut: 'Win + X -> K',
      expectedVisual: 'Consola MMC con tabla superior de volúmenes y mapa gráfico inferior de bloques de disco.',
    },
    comprobalo: {
      instruction: 'Apertura de la Administración de discos.',
      actionPrompt: 'Ejecutá diskmgmt.msc.',
      validationKey: 'DISKMGMT_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Conectás un SSD nuevo de 1 TB y en "Este Equipo" no aparece ninguna unidad nueva. Abrís `diskmgmt.msc` y lo ves en negro como "No asignado". ¿Qué debes hacer?',
      instruction: 'Seleccioná el procedimiento correcto.',
      options: [
        { id: 'opt1', text: 'Hacer clic derecho en el espacio no asignado, seleccionar "Nuevo volumen simple", formatear en NTFS y asignarle letra.', isCorrect: true, feedback: '¡Correcto! Inicializa la tabla de archivos y le asigna montaje en el sistema.' },
        { id: 'opt2', text: 'Devolver el disco a la garantía por defecto de fábrica.', isCorrect: false, feedback: 'Incorrecto: Los discos nuevos vienen sin particionar por diseño.' },
        { id: 'opt3', text: 'Reiniciar la PC 10 veces.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'DISK_MANAGEMENT_VERIFIED',
      targetDescription: 'Lectura e inspección de esquemas de discos en Disk Management',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-11',
    code: '03.11',
    title: 'Registry Editor',
    subtitle: 'La base de datos jerárquica de configuración del kernel, sistema, drivers y usuarios (regedit)',
    category: 'CONFIGURACION_PROFUNDA',
    commandToOpen: 'regedit.exe',
    shortcut: 'Win + R -> regedit',
    riskLevel: 'CRITICAL_SYSTEM_RISK',
    descubri: {
      hook: 'El Registro de Windows es el corazón donde se almacena el 99% de las configuraciones del sistema operativo. Un cambio mal hecho aquí puede dejar el sistema inoperable.',
      mythVsTruth: {
        mentira: 'Usar "Limpiadores de registro" de terceros acelera la PC y limpia errores de Windows.',
        verdad: 'Microsoft desaconseja oficialmente los limpiadores de registro. Borrar claves a ciegas causa fallas aleatorias e inestabilidad del sistema.',
        comprobalo: 'Ejecutá `regedit.exe` y observá las 5 colmenas principales (HKEY_CLASSES_ROOT, HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE, HKEY_USERS, HKEY_CURRENT_CONFIG).',
      },
    },
    entende: {
      title: 'Las 5 Colmenas Principales (Hives)',
      explanation: [
        'El registro se organiza en una estructura de árbol con 5 ramas raíz:',
        '1) HKEY_CLASSES_ROOT (HKCR): Asociaciones de tipos de archivos, extensiones y objetos COM.',
        '2) HKEY_CURRENT_USER (HKCU): Configuraciones privadas del usuario actualmente autenticado (se guarda en `NTUSER.DAT`).',
        '3) HKEY_LOCAL_MACHINE (HKLM): Configuraciones globales del equipo físico (kernel, drivers, hardware, software instalado).',
        '4) HKEY_USERS (HKU): Contiene los perfiles de todos los usuarios cargados en el equipo.',
        '5) HKEY_CURRENT_CONFIG (HKCC): Puntero al perfil de hardware activo en tiempo de ejecución.',
      ],
      whatToLookFor: [
        'Tipos de datos: REG_SZ (Texto), REG_DWORD (Entero de 32 bits, 0 o 1), REG_BINARY (Datos binarios).',
        'Clave de autorun: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`.',
      ],
      whatNotToMisinterpret: 'ADVERTENCIA REAL: Editar el Registro sin hacer una copia de respaldo previa (Exportar clave `.reg`) o crear un Punto de Restauración es un riesgo profesional inaceptable.',
    },
    profundiza: {
      title: 'Archivos físicos del Registro (Registry Hives en disco)',
      technicalDetails: [
        'Las claves de HKLM no son un solo archivo; están divididas en archivos binarios sin extensión dentro de `C:\Windows\System32\config\` (`SYSTEM`, `SOFTWARE`, `SAM`, `SECURITY`, `DEFAULT`).',
        'HKCU se guarda de forma independiente en `C:\Users\<Usuario>\NTUSER.DAT`.',
      ],
      lowLevelNote: 'Durante el arranque, el Boot Loader (winload.exe) carga la colmena `SYSTEM` para leer los controladores de arranque iniciales (StartType = 0).',
      whenToUseOtherTool: 'Para realizar cambios de registro en scripts desatendidos o consolas, usá el comando `reg.exe` o `Set-ItemProperty` en PowerShell.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir regedit e inspeccionar la ruta HKEY_CURRENT_USER',
      steps: [
        'Presioná Win + R, escribí `regedit` y presioná Enter (Aceptá el aviso de UAC).',
        'Navegá en el árbol hasta `HKEY_CURRENT_USER\Software`.',
        'Observá la barra de direcciones superior que muestra la ruta canónica completa.',
      ],
      commandOrPath: 'regedit.exe',
      shortcut: 'Win + R -> regedit',
      expectedVisual: 'Editor del Registro con árbol de claves a la izquierda y valores/datos a la derecha.',
    },
    comprobalo: {
      instruction: 'Apertura del Editor del registro.',
      actionPrompt: 'Ejecutá regedit.exe.',
      validationKey: 'REGEDIT_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿En qué archivo físico dentro del perfil de usuario se guardan las configuraciones correspondientes a HKEY_CURRENT_USER?',
      instruction: 'Seleccioná la respuesta correcta.',
      options: [
        { id: 'opt1', text: 'C:\Users\<Usuario>\NTUSER.DAT', isCorrect: true, feedback: '¡Impecable! Es el archivo oculto de sistema que guarda el registro del perfil.' },
        { id: 'opt2', text: 'C:\Windows\System32\cmd.exe', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'C:\Program Files\Registry.txt', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'REGISTRY_EDITOR_VERIFIED',
      targetDescription: 'Navegación e identificación de colmenas en Registry Editor',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-12',
    code: '03.12',
    title: 'Windows Security',
    subtitle: 'El centro unificado de protección: Antivirus Defender, Firewall, aislamiento y reputación',
    category: 'SEGURIDAD',
    commandToOpen: 'windowssecurity:',
    shortcut: 'Win + I -> Privacidad y seguridad -> Seguridad de Windows',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Ya no hace falta instalar antivirus de terceros pesados que ralenticen el sistema: Microsoft Defender está integrado en el kernel con excelente puntuación de protección.',
      mythVsTruth: {
        mentira: 'Desactivar Windows Defender por completo mediante scripts dudosos de internet es necesario para "ganar FPS".',
        verdad: 'Desactivar Defender deja al sistema expuesto a ransomware moderno y amenazas de ejecución remota por ganancias insignificantes.',
        comprobalo: 'Ejecutá el comando `windowssecurity:` o abrí la app Seguridad de Windows para ver el estado de los 5 pilares.',
      },
    },
    entende: {
      title: 'Los 5 Pilares de Seguridad de Windows',
      explanation: [
        'La consola de Seguridad de Windows unifica la gestión de seguridad:',
        '1) Protección contra virus y amenazas (Antivirus Microsoft Defender): Escaneo en tiempo real, protección basada en la nube y aislamiento de amenazas.',
        '2) Protección de red y firewall: Reglas de tráfico entrante y saliente para redes Dominio, Privada y Pública.',
        '3) Control de aplicaciones y navegador: Protección SmartScreen contra descargas no fiables y explotación de exploits.',
        '4) Seguridad del dispositivo: Aislamiento del núcleo (Core Isolation / VBS) y Módulo de plataforma segura (TPM 2.0).',
        '5) Protección de cuentas: Microsoft Account y Windows Hello (Biometría / PIN).',
      ],
      whatToLookFor: [
        'Estado de "Protección en tiempo real" e "Historial de protección" para revisar falsos positivos o elementos en cuarentena.',
        'Integridad de la memoria (Memory Integrity / HVCI) en Seguridad del dispositivo.',
      ],
      whatNotToMisinterpret: 'Si instalás un antivirus comercial de terceros de reputación, Windows Defender desactiva automáticamente su módulo en tiempo real para evitar conflictos.',
    },
    profundiza: {
      title: 'Aislamiento basado en virtualización (VBS) y TPM 2.0',
      technicalDetails: [
        'Utiliza el hipervisor de Windows (Hyper-V) para aislar procesos sensibles como `lsass.exe` (Credential Guard) en una máquina virtual segura en memoria.',
        'El chip TPM 2.0 almacena criptográficamente las claves de cifrado de disco BitLocker y credenciales de Windows Hello.',
      ],
      lowLevelNote: 'Administrable por PowerShell mediante el módulo `Get-MpPreference` y `Set-MpPreference`.',
      whenToUseOtherTool: 'Para auditar políticas de grupo locales de seguridad detalladas en ediciones Pro/Enterprise, usá `secpol.msc`.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir Seguridad de Windows e inspeccionar la Protección contra virus',
      steps: [
        'Presioná Win + R, escribí `windowssecurity:` y presioná Enter.',
        'Hacé clic en "Protección contra virus y amenazas".',
        'Seleccioná "Historial de protección" para revisar las amenazas detectadas o bloqueadas recientemente.',
      ],
      commandOrPath: 'windowssecurity:',
      shortcut: 'Win + I -> Privacidad y seguridad',
      expectedVisual: 'Panel unificado de Seguridad de Windows con iconos de verificación verdes en cada módulo.',
    },
    comprobalo: {
      instruction: 'Apertura de la consola de Seguridad de Windows.',
      actionPrompt: 'Ejecutá windowssecurity:.',
      validationKey: 'WINSEC_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué tecnología de Seguridad de Windows utiliza virtualización para proteger los procesos de credenciales de sesión en memoria?',
      instruction: 'Elegí el módulo correcto.',
      options: [
        { id: 'opt1', text: 'Aislamiento del núcleo / VBS (Virtualization-based Security)', isCorrect: true, feedback: '¡Correcto! Aísla las claves de sesión usando el hipervisor.' },
        { id: 'opt2', text: 'El Desfragmentador de disco', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'El historial de calculadora', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WINDOWS_SECURITY_VERIFIED',
      targetDescription: 'Auditoría de módulos en Seguridad de Windows',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-13',
    code: '03.13',
    title: 'Advanced System Settings',
    subtitle: 'Rendimiento visual, perfiles de usuario, variables de entorno y opciones de recuperación (sysdm.cpl)',
    category: 'CONFIGURACION_PROFUNDA',
    commandToOpen: 'sysdm.cpl',
    shortcut: 'Win + R -> sysdm.cpl',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Es la consola clásica de propiedades del sistema desde donde se configuran la memoria virtual (archivo de paginación), las variables de entorno %PATH% y los efectos visuales.',
      mythVsTruth: {
        mentira: 'Desactivar todos los efectos visuales en Windows da un aumento gigantesco de velocidad en juegos.',
        verdad: 'En placas de video modernas de 64 bits, la renderización de la GPU absorbe los efectos visuales sin impacto medible en CPU.',
        comprobalo: 'Ejecutá `sysdm.cpl`, hacé clic en la pestaña "Opciones avanzadas" e inspeccioná el botón "Configuración" en Rendimiento.',
      },
    },
    entende: {
      title: 'Las 4 Secciones Críticas de Opciones Avanzadas',
      explanation: [
        'Sysdm.cpl agrupa 4 paneles técnicos indispensables:',
        '1) Rendimiento (Performance): Efectos visuales, programación del procesador (Servicios en segundo plano vs Programas) y Memoria virtual (pagefile.sys).',
        '2) Perfiles de usuario (User Profiles): Ver tamaño ocupado por cada perfil local y eliminarlos de forma limpia.',
        '3) Inicio y recuperación (Startup and Recovery): Configurar el sistema operativo por defecto, tiempo de espera de BCD y tipo de volcado de memoria en BSOD (Minidump vs Volcado completo).',
        '4) Variables de entorno (Environment Variables): Edición de `%PATH%`, `%TEMP%`, `%USERPROFILE%`.',
      ],
      whatToLookFor: [
        'Variable PATH: Asegurarse de que no haya rutas duplicadas o no existentes de programas desinstalados.',
        'Configuración de archivo de paginación: Mantenido en "Administrado por el sistema" por defecto.',
      ],
      whatNotToMisinterpret: 'Desactivar por completo el archivo de paginación (Pagefile = 0) creyendo que "tengo mucha RAM" provoca cuelgues repentinos en apps que exigen espacio de Commit.',
    },
    profundiza: {
      title: 'Efecto de la variable de entorno %PATH%',
      technicalDetails: [
        'Cuando escribís un comando en la consola (ej. `git`, `python`, `node`), Windows busca el ejecutable en el directorio actual y luego recorre una por una las rutas de la variable `%PATH%`.',
        'Si la ruta no está en `%PATH%`, la consola devolverá el clásico error: "no se reconoce como un comando interno o externo".',
      ],
      lowLevelNote: 'Las variables del sistema se guardan en `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment`.',
      whenToUseOtherTool: 'Para editar variables de entorno desde scripts de consola de PowerShell, usá `[Environment]::SetEnvironmentVariable()`.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir sysdm.cpl e inspeccionar las Variables de Entorno',
      steps: [
        'Presioná Win + R, escribí `sysdm.cpl` y presioná Enter.',
        'Hacé clic en la pestaña "Opciones avanzadas".',
        'Hacé clic en el botón "Variables de entorno..." en la parte inferior.',
      ],
      commandOrPath: 'sysdm.cpl',
      shortcut: 'Win + R -> sysdm.cpl',
      expectedVisual: 'Ventana de Propiedades del sistema en la pestaña Opciones avanzadas con botón de Variables de entorno.',
    },
    comprobalo: {
      instruction: 'Apertura de la consola de Propiedades avanzadas del sistema.',
      actionPrompt: 'Ejecutá sysdm.cpl.',
      validationKey: 'SYSDM_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué sucede si eliminas por accidente la variable `%SYSTEMROOT%` de las variables de entorno del sistema?',
      instruction: 'Seleccioná la consecuencia técnica.',
      options: [
        { id: 'opt1', text: 'Muchos programas y scripts dejarán de ubicar la carpeta C:\Windows y arrojarán errores de ruta no encontrada.', isCorrect: true, feedback: '¡Exacto! %SYSTEMROOT% es la variable canónica que apunta a C:\Windows.' },
        { id: 'opt2', text: 'Se borran las fotos del usuario.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Aumenta la velocidad de internet.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'ADVANCED_SETTINGS_VERIFIED',
      targetDescription: 'Acceso y verificación de sysdm.cpl y variables de entorno',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-14',
    code: '03.14',
    title: 'Power Options',
    subtitle: 'Planes de energía, suspensión, estado C-States de CPU y comando powercfg (powercfg.cpl)',
    category: 'ENERGIA',
    commandToOpen: 'powercfg.cpl',
    shortcut: 'Win + R -> powercfg.cpl',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'La gestión de energía regula desde cuánto dura la batería de tu laptop hasta la latencia de respuesta de los núcleos de tu procesador.',
      mythVsTruth: {
        mentira: 'Poner el plan de energía en "Alto rendimiento" siempre duplica los FPS en todos los juegos.',
        verdad: 'En laptops, "Alto Rendimiento" provoca estrangulamiento térmico (Thermal Throttling) más rápido al deshabilitar el ahorro de energía en reposo.',
        comprobalo: 'Ejecutá `powercfg.cpl` o abriles la consola de comandos con `powercfg /l` para listar los planes activos.',
      },
    },
    entende: {
      title: 'Planes Canónicos y Estados C-States',
      explanation: [
        'Power Options administra los perfiles de ACPI (Advanced Configuration and Power Interface):',
        '1) Equilibrado (Balanced): Cambia dinámicamente la frecuencia de CPU según la demanda instantánea (Recomendado por defecto).',
        '2) Economizador (Power Saver): Limita la frecuencia máxima de la CPU para maximizar la batería.',
        '3) Alto Rendimiento (High Performance): Mantiene la CPU en su frecuencia máxima y evita que los discos se apaguen.',
        '4) Máximo Rendimiento (Ultimate Performance): Plan oculto diseñado para estaciones de trabajo y servidores de baja latencia.',
      ],
      whatToLookFor: [
        'Tiempo para apagar la pantalla vs Tiempo para entrar en suspensión.',
        'Acción del botón de encendido y tapa en computadoras portátiles.',
      ],
      whatNotToMisinterpret: 'Habilitar el Inicio Rápido (Fast Startup / hiberfil.sys) no apaga Windows por completo; guarda el kernel en disco para simular un arranque helado rápido.',
    },
    profundiza: {
      title: 'El poder del comando en consola powercfg.exe',
      technicalDetails: [
        '`powercfg /energy`: Genera un informe HTML de 60 segundos con errores de controladores que impiden a la PC suspenderse.',
        '`powercfg /batteryreport`: Genera el diagnóstico técnico de salud de la batería (capacidad de diseño vs capacidad actual).',
        '`powercfg /requests`: Revela qué aplicación o driver de audio está bloqueando el modo de suspensión automático.',
      ],
      lowLevelNote: 'Administra la configuración del subsistema Kernel Power Manager.',
      whenToUseOtherTool: 'Para ver el impacto de energía por aplicación en tiempo real, usá la pestaña "Processes" del Task Manager (columna Consumo de energía).',
    },
    miraloEnTuPc: {
      actionName: 'Generar el informe de batería/energía con powercfg',
      steps: [
        'Presioná Win + R, escribí `cmd` y presioná Enter.',
        'Escribí el comando `powercfg /requests` y presioná Enter.',
        'Observá si hay algún proceso (como Discord o Spotify) bloqueando el estado de suspensión.',
      ],
      commandOrPath: 'powercfg.cpl',
      shortcut: 'Win + R -> powercfg.cpl',
      expectedVisual: 'Ventana clásica de Opciones de energía con selección de plan y ajustes de la pantalla.',
    },
    comprobalo: {
      instruction: 'Apertura de la consola de Opciones de energía.',
      actionPrompt: 'Ejecutá powercfg.cpl.',
      validationKey: 'POWERCFG_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué comando en la consola CMD te permite saber exactamente qué programa o driver está impidiendo que la laptop entre en suspensión?',
      instruction: 'Elegí el parámetro correcto de powercfg.',
      options: [
        { id: 'opt1', text: 'powercfg /requests', isCorrect: true, feedback: '¡Impecable! Revela bloqueos de suspensión por audio, pantalla o ejecución.' },
        { id: 'opt2', text: 'powercfg /delete', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'powercfg /off', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'POWER_OPTIONS_VERIFIED',
      targetDescription: 'Diagnóstico de energía con powercfg',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-15',
    code: '03.15',
    title: 'Network Connections',
    subtitle: 'Administración de adaptadores de red, IPv4/IPv6, DNS y propiedades físicas (ncpa.cpl)',
    category: 'RED',
    commandToOpen: 'ncpa.cpl',
    shortcut: 'Win + R -> ncpa.cpl',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Es la consola más rápida y confiable para cambiar servidores DNS, fijar una IP estática o deshabilitar/habilitar un adaptador de red que no responde.',
      mythVsTruth: {
        mentira: 'Cambiar las DNS en la placa de red te aumenta la velocidad de descarga en Megabytes por segundo (MB/s).',
        verdad: 'Las DNS sólo aceleran la resolución de nombres (de google.com a IP); no aumentan el ancho de banda contratado con tu ISP.',
        comprobalo: 'Ejecutá `ncpa.cpl`, hacé clic derecho en tu placa Wi-Fi o Ethernet y seleccioná "Estado" o "Propiedades".',
      },
    },
    entende: {
      title: 'Propiedades del Adaptador de Red',
      explanation: [
        'Ncpa.cpl muestra las interfaces físicas y virtuales instaladas:',
        '1) Habilitar / Deshabilitar: Reinicia el chip o la interfaz virtual sin reiniciar la PC.',
        '2) Propiedades de Protocolo de Internet versión 4 (TCP/IPv4): Configuración de dirección IP, Máscara de subred, Puerta de enlace predeterminada y servidores DNS.',
        '3) Clientes y Servicios: Cliente para redes Microsoft, Programador de paquetes Qos, Creador de imágenes de detección de topología.',
      ],
      whatToLookFor: [
        'Velocidad de enlace (Link Speed): Verificar si la placa Ethernet enlazó a 100 Mbps o 1 Gbps (1000 Mbps).',
        'Estado de bytes enviados y recibidos para descartar falta de tráfico.',
      ],
      whatNotToMisinterpret: 'Si el cable Ethernet está defectuoso, la placa bajará automáticamente la velocidad de enlace de 1000 Mbps a 10 Mbps (Auto-negotiation fallback).',
    },
    profundiza: {
      title: 'Comandos de diagnóstico de red de acompañamiento',
      technicalDetails: [
        '`ipconfig /all`: Muestra direcciones MAC físicas, servidor DHCP y concesión de arrendamiento.',
        '`ipconfig /flushdns`: Purga la caché de resolución DNS local en RAM.',
        '`ping` y `tracert`: Diagnóstico de latencia y salto de enrutadores.',
      ],
      lowLevelNote: 'Las propiedades de los adaptadores se reflejan en el registro en `HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces`.',
      whenToUseOtherTool: 'Para ver puertos en escucha y sockets activos por PID, usá Resource Monitor (Pestaña Red) o `netstat -ano`.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir ncpa.cpl e inspeccionar el estado de la placa de red',
      steps: [
        'Presioná Win + R, escribí `ncpa.cpl` y presioná Enter.',
        'Hacé doble clic en tu adaptador Ethernet o Wi-Fi activo.',
        'Hacé clic en el botón "Detalles..." para ver la IP actual, máscara y puerta de enlace.',
      ],
      commandOrPath: 'ncpa.cpl',
      shortcut: 'Win + R -> ncpa.cpl',
      expectedVisual: 'Ventana Conexiones de red con iconos de adaptadores Ethernet, Wi-Fi y redes virtuales.',
    },
    comprobalo: {
      instruction: 'Apertura de Conexiones de red.',
      actionPrompt: 'Ejecutá ncpa.cpl.',
      validationKey: 'NCPA_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Tu internet no abre páginas web por nombre, pero si ponés la IP `1.1.1.1` en el navegador sí carga. ¿Dónde está el problema?',
      instruction: 'Identificá la falla.',
      options: [
        { id: 'opt1', text: 'Falla en el servidor DNS asignado en las propiedades de la placa de red (`ncpa.cpl`).', isCorrect: true, feedback: '¡Perfecto! La resolución de nombres está fallando mientras que el enrutamiento IP funciona.' },
        { id: 'opt2', text: 'Se rompió el cable de red por la mitad.', isCorrect: false, feedback: 'Incorrecto: Si el cable estuviera roto no cargaría la IP 1.1.1.1.' },
        { id: 'opt3', text: 'Se quemó el procesador.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'NETWORK_CONNECTIONS_VERIFIED',
      targetDescription: 'Inspección de adaptadores de red en ncpa.cpl',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-16',
    code: '03.16',
    title: 'Optional Features',
    subtitle: 'Gestión de características opcionales de Windows, subsistemas Hyper-V, WSL y Sandbox',
    category: 'CONFIGURACION_PROFUNDA',
    commandToOpen: 'optionalfeatures.exe',
    shortcut: 'Win + R -> optionalfeatures',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Windows incluye potentes subsistemas profesionales desactivados por defecto (Hyper-V, Sandbox, WSL) que podés activar sin pagar licencias adicionales.',
      mythVsTruth: {
        mentira: 'Para tener una máquina virtual o un contenedor en Windows necesitás instalar programas externos obligatoriamente.',
        verdad: 'Windows Pro y Enterprise incluyen Windows Sandbox e Hyper-V de forma nativa desde la ventana de Características opcionales.',
        comprobalo: 'Ejecutá `optionalfeatures.exe` y explorá la lista con casillas de verificación de componentes del sistema.',
      },
    },
    entende: {
      title: 'Componentes Opcionales Principales',
      explanation: [
        'Optional Features administra módulos avanzados de Windows:',
        '1) Hyper-V: Hipervisor de tipo 1 para máquinas virtuales nativas.',
        '2) Windows Sandbox: Entorno virtual de un solo uso para probar archivos o enlaces sospechosos en un contenedor aislado.',
        '3) Plataforma de hipervisor de Windows / Plataforma de máquina virtual: Requisito de arquitectura para WSL2 (Windows Subsystem for Linux) y emulación de Android.',
        '4) Cliente Telnet / TFTP: Herramientas de terminal legacy para diagnóstico de switches y enrutadores.',
        '5) Servidor IIS (Internet Information Services): Servidor web nativo de Microsoft.',
      ],
      whatToLookFor: [
        'Asegurarse de reiniciar el sistema tras marcar o desmarcar características avanzadas.',
        'Verificar soporte de virtualización en BIOS/UEFI (Intel VT-x / AMD-V) si falla la activación.',
      ],
      whatNotToMisinterpret: 'Activar Hyper-V desactiva la aceleración por hardware de ciertos emuladores antiguos de terceros si no son compatibles con la API de Hipervisor.',
    },
    profundiza: {
      title: 'Administración desatendida mediante DISM',
      technicalDetails: [
        'Las características opcionales se pueden consultar y activar mediante consola PowerShell o CMD con DISM:',
        '`dism /online /enable-feature /featurename:Containers-DisposableClientVM /all` (Activa Windows Sandbox).',
      ],
      lowLevelNote: 'Los paquetes se instalan desde el Almacén de componentes WinSxS.',
      whenToUseOtherTool: 'Para instalar características basadas en capacidades modernas (Capabilities) como OpenSSH Client o RSAT, usá la app Configuración -> Características opcionales.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir optionalfeatures e inspeccionar la lista de componentes',
      steps: [
        'Presioná Win + R, escribí `optionalfeatures` y presioná Enter.',
        'Navegá por la lista y buscá "Windows Sandbox" o "Plataforma de máquina virtual".',
        'Observá la casilla que indica si el módulo está instalado o disponible.',
      ],
      commandOrPath: 'optionalfeatures.exe',
      shortcut: 'Win + R -> optionalfeatures',
      expectedVisual: 'Ventana con lista jerárquica de casillas de características de Windows.',
    },
    comprobalo: {
      instruction: 'Apertura de Características opcionales.',
      actionPrompt: 'Ejecutá optionalfeatures.exe.',
      validationKey: 'OPTIONALFEATURES_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué característica opcional nativa de Windows Pro te permite abrir un ejecutable sospechoso bajado de internet en un entorno 100% aislado que se destruye al cerrar la ventana?',
      instruction: 'Seleccioná la herramienta.',
      options: [
        { id: 'opt1', text: 'Windows Sandbox', isCorrect: true, feedback: '¡Excelente! Crea un contenedor descartable instantáneo al aislar el ejecutable.' },
        { id: 'opt2', text: 'El Bloc de notas', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'El Reproductor de Windows Media', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'OPTIONAL_FEATURES_VERIFIED',
      targetDescription: 'Inspección de características opcionales y subsistemas',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-17',
    code: '03.17',
    title: 'Windows Recovery',
    subtitle: 'El entorno de recuperación de emergencia: WinRE, Puntos de restauración y Restablecer PC',
    category: 'RECUPERACION',
    commandToOpen: 'systempropertiesprotection',
    shortcut: 'Win + I -> Sistema -> Recuperación',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Cuando Windows sufre un daño severo y no arranca el escritorio, el Entorno de Recuperación (WinRE) es la consola de salvamento que toma el control.',
      mythVsTruth: {
        mentira: 'Restablecer la PC (Reset) borra tus archivos personales sí o sí.',
        verdad: 'La opción "Restablecer este equipo" ofrece la modalidad "Mantener mis archivos", reinstalando los binarios del SO sin tocar la carpeta C:\Users.',
        comprobalo: 'Abrí Inicio -> Configuración -> Sistema -> Recuperación o ejecutá `systempropertiesprotection` para revisar Puntos de Restauración.',
      },
    },
    entende: {
      title: 'Los 3 Niveles de Recuperación de Windows',
      explanation: [
        '1) Restauración del Sistema (System Restore): Vuelve atrás la colmena del Registro y los drivers a un estado previo (Punto de restauración) sin modificar documentos personales.',
        '2) Entorno de Recuperación (Windows RE): Entorno ejecutable independiente en WIM que incluye Símbolo de sistema, Reparación de inicio y Desinstalación de actualizaciones.',
        '3) Restablecer este equipo (Reset THIS PC): Reconstruye la imagen del sistema desde el almacén WinSxS.',
      ],
      whatToLookFor: [
        'Verificar si la "Protección del sistema" está ACTIVADA en el disco C: para permitir la creación automática de puntos de restauración antes de instalar actualizaciones.',
      ],
      whatNotToMisinterpret: 'System Restore NO es un software de copia de seguridad de archivos personales; sólo respalda archivos de sistema, ejecutable y claves de registro.',
    },
    profundiza: {
      title: 'Acceso directo a WinRE mediante consola',
      technicalDetails: [
        'Podés forzar a Windows a reiniciar inmediatamente dentro del menú azul de WinRE ejecutando en consola: `reagentc /boottore` seguido de `shutdown /r /t 0`.',
        'El estado de la partición de recuperación se verifica con `reagentc /info`.',
      ],
      lowLevelNote: 'WinRE se ejecuta desde la imagen de arranque `winre.wim` almacenada en la partición oculta de recuperación.',
      whenToUseOtherTool: 'Si el disco tiene fallas mecánicas de hardware, utilizá imágenes de respaldo externas sector a sector (Backup de imagen completa de disco).',
    },
    miraloEnTuPc: {
      actionName: 'Abrir Propiedades de Protección del sistema y revisar Puntos de restauración',
      steps: [
        'Presioná Win + R, escribí `systempropertiesprotection` y presioná Enter.',
        'Verificá si el Disco Local (C:) tiene estado "Activación".',
        'Hacé clic en "Crear..." para generar un Punto de restauración manual preventivo.',
      ],
      commandOrPath: 'systempropertiesprotection',
      shortcut: 'Win + I -> Recuperación',
      expectedVisual: 'Ventana de Propiedades del sistema en la pestaña Protección del sistema con botón de Crear Punto de Restauración.',
    },
    comprobalo: {
      instruction: 'Apertura de la consola de Protección del sistema.',
      actionPrompt: 'Ejecutá systempropertiesprotection.',
      validationKey: 'RECOVERY_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué herramienta de recuperación te permite revertir un controlador dañado o una clave de registro alterada ayer sin perder las fotos que guardaste hoy?',
      instruction: 'Seleccioná la herramienta correcta.',
      options: [
        { id: 'opt1', text: 'Restauración del sistema (System Restore / Punto de restauración)', isCorrect: true, feedback: '¡Excelente! Restaura el estado de sistema sin tocar archivos de usuario.' },
        { id: 'opt2', text: 'Formatear el disco C:', isCorrect: false, feedback: 'Incorrecto: Eso borraría todo.' },
        { id: 'opt3', text: 'El Desfragmentador de disco', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WINDOWS_RECOVERY_VERIFIED',
      targetDescription: 'Verificación de Protección del sistema y WinRE',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-18',
    code: '03.18',
    title: 'System Information',
    subtitle: 'El informe exhaustivo WMI de arquitectura, firmware UEFI, Secure Boot y hardware (msinfo32)',
    category: 'HARDWARE',
    commandToOpen: 'msinfo32.exe',
    shortcut: 'Win + R -> msinfo32',
    riskLevel: 'READ_ONLY_SAFE',
    descubri: {
      hook: 'Es la biblia definitiva de auditoría técnica. Si querés saber qué modelo exacto de motherboard tenés, qué versión de BIOS o si Secure Boot está activo, msinfo32 lo muestra todo.',
      mythVsTruth: {
        mentira: 'Para saber qué modelo de motherboard o BIOS tiene una PC hay que abrir el gabinete físico con un destornillador.',
        verdad: 'msinfo32 lee las tablas SMBIOS del firmware y presenta un reporte completo de hardware y entorno de software en pantalla.',
        comprobalo: 'Ejecutá `msinfo32.exe` e inspeccioná el "Resumen del sistema" (System Summary).',
      },
    },
    entende: {
      title: 'Las 4 Categorías Principales de msinfo32',
      explanation: [
        '1) Resmon del sistema (System Summary): Fabricante del sistema, Modelo, Tipo de sistema (x64), Modo BIOS (UEFI vs Heredado), Estado de arranque seguro (Secure Boot), RAM física instalada.',
        '2) Recursos de hardware (Hardware Resources): Asignaciones de IRQ, DMA, Memoria de E/S y Conflictos/Compartición.',
        '3) Componentes (Components): Detalles de pantalla, discos, red, sonido y periféricos USB.',
        '4) Entorno de software (Software Environment): Controladores cargados, variables de entorno, tareas en ejecución y servicios.',
      ],
      whatToLookFor: [
        'Modo BIOS: "UEFI" vs "Heredado" (Legacy BIOS).',
        'Estado de arranque seguro: "Activado" vs "Desactivado".',
        'Aislamiento de núcleo / Seguridad basada en virtualización: "En ejecución".',
      ],
      whatNotToMisinterpret: 'Ver dispositivos en "Conflictos/Compartición" en placas madre modernas PCI Express es normal debido al ruteo compartido de interrupciones MSI.',
    },
    profundiza: {
      title: 'Exportación de informes periciales `.nfo` y `.txt`',
      technicalDetails: [
        'Permite ir a Archivo -> Guardar para generar un archivo `.nfo` completo que otro técnico puede abrir en su propia PC para inspeccionar tu sistema de forma remota.',
        'Se puede exportar por consola usando `msinfo32 /nfo C:\reporte.nfo`.',
      ],
      lowLevelNote: 'Consulta directamente los proveedores WMI (Windows Management Instrumentation) de la capa WBEM.',
      whenToUseOtherTool: 'Para ver gráficos dinámicos de consumo de temperatura o frecuencias de procesador en tiempo real, usá herramientas especializadas de sensores.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir msinfo32 e inspeccionar el Modelo de sistema y Modo BIOS',
      steps: [
        'Presioná Win + R, escribí `msinfo32` y presioná Enter.',
        'Asegurate de estar posicionado en "Resumen del sistema".',
        'Buscá las líneas "Modelo del sistema", "Modo de BIOS" y "Estado de arranque seguro".',
      ],
      commandOrPath: 'msinfo32.exe',
      shortcut: 'Win + R -> msinfo32',
      expectedVisual: 'Ventana de Información del sistema con árbol de categorías e informe técnico detallado.',
    },
    comprobalo: {
      instruction: 'Apertura de Información del sistema.',
      actionPrompt: 'Ejecutá msinfo32.exe.',
      validationKey: 'MSINFO32_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué línea en el Resumen del sistema de `msinfo32` te confirma si el equipo arrancó mediante firmware moderno UEFI o BIOS antiguo?',
      instruction: 'Seleccioná el campo correcto.',
      options: [
        { id: 'opt1', text: 'Modo de BIOS (debe decir UEFI)', isCorrect: true, feedback: '¡Excelente! Muestra de forma concluyente la arquitectura de firmware del equipo.' },
        { id: 'opt2', text: 'Nombre de usuario', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Velocidad de la placa de red', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'MSINFO32_VERIFIED',
      targetDescription: 'Auditoría de especificaciones con msinfo32',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-19',
    code: '03.19',
    title: 'Computer Management',
    subtitle: 'La superconsola agregadora de administración MMC (compmgmt.msc)',
    category: 'ADMINISTRACION',
    commandToOpen: 'compmgmt.msc',
    shortcut: 'Win + X -> Administración de equipos',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Es la "navaja suiza" administrativa de Windows: agrupa en un solo panel de árbol el Visor de eventos, las carpetas compartidas, los usuarios locales, el Administrador de dispositivos y los Discos.',
      mythVsTruth: {
        mentira: 'Computer Management es una aplicación obsoleta reemplazada por la app Configuración moderna.',
        verdad: 'Computer Management es la consola MMC (Microsoft Management Console) estándar de administración de sistemas e infraestructura Windows.',
        comprobalo: 'Presioná Win + X, seleccioná "Administración de equipos" o ejecutá `compmgmt.msc`.',
      },
    },
    entende: {
      title: 'Las 3 Ramas de la Consola Agregadora',
      explanation: [
        'Computer Management organiza las herramientas en 3 contenedores principales:',
        '1) Herramientas del sistema (System Tools): Programador de tareas, Visor de eventos, Carpetas compartidas (Recursos compartidos y Sesiones activas), Usuarios y grupos locales, Rendimiento y Administrador de dispositivos.',
        '2) Almacenamiento (Storage): Administración de discos (`diskmgmt.msc`).',
        '3) Servicios y Aplicaciones: Servicios (`services.msc`) y Control WMI.',
      ],
      whatToLookFor: [
        'Rama "Usuarios y grupos locales" -> Usuarios: Para activar la cuenta de Administrador integrada o cambiar contraseñas de cuentas locales.',
        'Rama "Carpetas compartidas" -> Sesiones: Para ver qué usuarios de la red local están conectados a tus carpetas compartidas.',
      ],
      whatNotToMisinterpret: 'En la edición Windows Home, la rama "Usuarios y grupos locales" aparece deshabilitada por limitaciones comerciales del sistema.',
    },
    profundiza: {
      title: 'La arquitectura Microsoft Management Console (MMC)',
      technicalDetails: [
        'Computer Management es en realidad un archivo de consola `.msc` preconfigurado que aloja múltiples complementos (Snap-ins) de MMC.',
        'Podés crear tu propia consola personalizada ejecutando `mmc.exe` y agregando los Snap-ins que uses a diario.',
      ],
      lowLevelNote: 'Soporta administración remota: podés hacer clic derecho en "Administración de equipos (Local)" y seleccionar "Conectar a otro equipo" para administrar un servidor en la red.',
      whenToUseOtherTool: 'Para administrar usuarios en un entorno de Dominio de Active Directory, usá la consola `dsa.msc` (Active Directory Users and Computers).',
    },
    miraloEnTuPc: {
      actionName: 'Abrir compmgmt.msc e inspeccionar la rama de Herramientas del sistema',
      steps: [
        'Presioná Win + X y hacé clic en "Administración de equipos" (o ejecutá `compmgmt.msc`).',
        'Observá el panel izquierdo en forma de árbol jerárquico.',
        'Expandí "Herramientas del sistema" y explorá "Carpetas compartidas".',
      ],
      commandOrPath: 'compmgmt.msc',
      shortcut: 'Win + X -> G',
      expectedVisual: 'Consola MMC estructurada en 3 ramas principales con árbol a la izquierda y panel de detalles a la derecha.',
    },
    comprobalo: {
      instruction: 'Apertura de Administración de equipos.',
      actionPrompt: 'Ejecutá compmgmt.msc.',
      validationKey: 'COMPMGMT_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué ventaja operativa ofrece `compmgmt.msc` para la rutina diaria de un administrador de sistemas?',
      instruction: 'Elegí la ventaja principal.',
      options: [
        { id: 'opt1', text: 'Centraliza en una sola ventana el Visor de eventos, Dispositivos, Discos, Usuarios y Servicios sin abrir ventanas separadas.', isCorrect: true, feedback: '¡Excelente! Es la consola agregadora por excelencia.' },
        { id: 'opt2', text: 'Aumenta el espacio en el disco duro.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Instala juegos automáticamente.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'COMPUTER_MANAGEMENT_VERIFIED',
      targetDescription: 'Uso de la superconsola Computer Management',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-20',
    code: '03.20',
    title: 'GodMode',
    subtitle: 'El índice maestro de accesos directos unificados a todas las tareas del Panel de Control',
    category: 'ADMINISTRACION',
    commandToOpen: 'shell:::{ED7BA470-8E54-465E-825C-99712043E01C}',
    shortcut: 'Crear carpeta con GUID especial en el Escritorio',
    riskLevel: 'READ_ONLY_SAFE',
    descubri: {
      hook: 'Conocido mitológicamente como "GodMode", en realidad es una carpeta especial de Windows que desglosa más de 200 accesos directos individuales a tareas del Panel de control en una sola lista limpia.',
      mythVsTruth: {
        mentira: 'GodMode es un modo secreto de hacking o un "truco oculto" que desbloquea funciones prohibidas de Windows.',
        verdad: 'GodMode es simplemente una vista de Shell Folder que agrupa todos los applets del Panel de Control organizados alfabéticamente.',
        comprobalo: 'Creá una carpeta nueva en el escritorio con el nombre `GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}`.',
      },
    },
    entende: {
      title: 'El Mecanismo de las Shell Folders de Windows',
      explanation: [
        'Windows utiliza identificadores únicos globales (GUIDs) para mapear carpetas virtuales del Explorador de archivos:',
        '1) El GUID `{ED7BA470-8E54-465E-825C-99712043E01C}` corresponde al componente "All Tasks" (Todas las tareas).',
        '2) Al poner ese GUID en el nombre de una carpeta, el Explorador de Windows la transforma en un acceso directo especial.',
        '3) Permite buscar tareas específicas (ej. "Cambiar la velocidad del mouse" o "Formatear particiones") de forma instantánea sin navegar por menús anidados.',
      ],
      whatToLookFor: [
        'Icono transformado similar al Panel de Control.',
        'Desglose categorizado de más de 200 accesos directos directos a configuraciones de sistema.',
      ],
      whatNotToMisinterpret: 'GodMode no te concede privilegios de administrador si iniciaste sesión con una cuenta estándar; sigue respetando la seguridad de Windows y los avisos de UAC.',
    },
    profundiza: {
      title: 'Apertura directa mediante comando Shell de Windows',
      technicalDetails: [
        'No es obligatorio crear la carpeta física en el escritorio; podés abrir la vista inmediatamente desde Win + R ejecutando:',
        '`shell:::{ED7BA470-8E54-465E-825C-99712043E01C}`',
      ],
      lowLevelNote: 'Registrado en la clave `HKCR\CLSID\{ED7BA470-8E54-465E-825C-99712043E01C}`.',
      whenToUseOtherTool: 'Para realizar configuraciones en sistemas modernos Windows 11 sin interfaz de Panel de Control clásica, usá la app Configuración (`ms-settings:`).',
    },
    miraloEnTuPc: {
      actionName: 'Abrir la vista de Todas las tareas de GodMode vía comando shell',
      steps: [
        'Presioná Win + R.',
        'Copiá y pegá el comando `shell:::{ED7BA470-8E54-465E-825C-99712043E01C}`.',
        'Presioná Enter y observá la lista unificada de todas las tareas administrativas de Windows.',
      ],
      commandOrPath: 'shell:::{ED7BA470-8E54-465E-825C-99712043E01C}',
      shortcut: 'Win + R -> shell:::{ED7BA470-8E54-465E-825C-99712043E01C}',
      expectedVisual: 'Ventana del Explorador de archivos desplegando más de 200 tareas organizadas por categoría.',
    },
    comprobalo: {
      instruction: 'Verificación de la vista GodMode.',
      actionPrompt: 'Ejecutá el comando shell de GodMode.',
      validationKey: 'GODMODE_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué es realmente la función conocida popularmente como "GodMode" en Windows?',
      instruction: 'Seleccioná la definición técnica real.',
      options: [
        { id: 'opt1', text: 'Una carpeta especial de Shell (All Tasks GUID) que agrupa todos los accesos directos del Panel de Control en una sola lista.', isCorrect: true, feedback: '¡Exacto! Desmitificado: Es una lista unificada de tareas del Panel de Control.' },
        { id: 'opt2', text: 'Un truco que sobreacelera el procesador sin ventilador.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Un modo de juego para placas de video.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'GODMODE_VERIFIED',
      targetDescription: 'Acceso y desmitificación técnica de GodMode',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-03-21',
    code: '03.21',
    title: 'Crear un panel EVO con accesos rápidos',
    subtitle: 'Consola de control personalizada EVO LABS para acceso ultrarrápido a todas las consolas',
    category: 'ADMINISTRACION',
    commandToOpen: 'EVO_CONTROL_PANEL',
    shortcut: 'Acceso desde el Laboratorio de Control Room',
    riskLevel: 'READ_ONLY_SAFE',
    descubri: {
      hook: 'Un profesional de sistemas de élite no pierde tiempo buscando herramientas en menús; tiene su propio panel de lanzaderas rápidas listo para trabajar.',
      mythVsTruth: {
        mentira: 'Para tener un panel de accesos rápidos profesional hay que instalar programas con publicidad.',
        verdad: 'Podemos construir un panel interactivo limpio EVO que dispara de forma nativa las 20 consolas principales de Windows.',
        comprobalo: 'Hacé clic en el botón "Panel EVO de Control" dentro de este sector para probar los accesos directos.',
      },
    },
    entende: {
      title: 'La Lanzadera de Consolas EVO CONTROL PANEL',
      explanation: [
        'El Panel EVO agrupa las 20 consolas que acabamos de estudiar en 5 bloques operativos:',
        '1) RENDIMIENTO: Task Manager (`taskmgr`), Resource Monitor (`resmon`), Performance Monitor (`perfmon`).',
        '2) ERRORES & LOGS: Event Viewer (`eventvwr`), Reliability Monitor (`perfmon /rel`).',
        '3) HARDWARE & DISCOS: Device Manager (`devmgmt.msc`), Disk Management (`diskmgmt.msc`), System Info (`msinfo32`).',
        '4) SERVICIOS & CONFIG: Services (`services.msc`), Task Scheduler (`taskschd.msc`), MSConfig (`msconfig`), Registry Editor (`regedit`).',
        '5) RED & SEGURIDAD: Network Connections (`ncpa.cpl`), Security (`windowssecurity:`), Recovery (`systempropertiesprotection`).',
      ],
      whatToLookFor: [
        'Saber exactamente qué comando `.msc` o `.cpl` corresponde a cada diagnóstico.',
      ],
      whatNotToMisinterpret: 'El Panel EVO no sustituye el aprendizaje de los comandos ejecutables; sirve como acelerador de flujo de trabajo.',
    },
    profundiza: {
      title: 'Creación de scripts de lanzadera en Batch y PowerShell',
      technicalDetails: [
        'Podés crear un archivo `.bat` o `.ps1` en tu pendrive técnico con el menú de accesos directos para abrir cualquier consola en clientes de forma desatendida.',
        'Ejemplo en Batch: `start msinfo32.exe`, `start devmgmt.msc`, `start resmon.exe`.',
      ],
      lowLevelNote: 'Usa la API `ShellExecute` de Windows para invocar las consolas MMC.',
      whenToUseOtherTool: 'En entornos de red corporativos, podés distribuir este panel mediante accesos directos de GPO (Group Policy Objects).',
    },
    miraloEnTuPc: {
      actionName: 'Probar el Panel de Control EVO interactivo',
      steps: [
        'Interactuá con los botones del lanzador de consolas EVO dentro de esta misma pantalla.',
        'Observá la correspondencia entre cada módulo técnico y su comando `.msc` / `.cpl` nativo.',
      ],
      commandOrPath: 'EVO_PANEL_LAUNCHER',
      shortcut: 'Panel EVO integrado',
      expectedVisual: 'Lanzadera de consolas organizada por categorías con botones de ejecución directa.',
    },
    comprobalo: {
      instruction: 'Activación del Panel EVO de Control.',
      actionPrompt: 'Accedé al Lanzador EVO.',
      validationKey: 'EVO_PANEL_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Cuál es la extensión de archivo estándar de las consolas de administración MMC de Windows (como devmgmt, diskmgmt, services)?',
      instruction: 'Seleccioná la extensión correcta.',
      options: [
        { id: 'opt1', text: '.msc (Microsoft Saved Console)', isCorrect: true, feedback: '¡Impecable! .msc identifica a las consolas ejecutable de MMC.' },
        { id: 'opt2', text: '.mp3', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: '.docx', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'EVO_CONTROL_PANEL_VERIFIED',
      targetDescription: 'Creación y uso del Panel EVO de accesos rápidos',
      defaultProvenance: 'DERIVED',
    },
  },
];

// 5 MINICASOS FORENSES DE SECTOR 03
export const SECTOR_03_MINICASES: Sector03MiniCase[] = [
  {
    id: 'case-03-a',
    code: 'CASO 03-A',
    title: 'El archivo que no se dejaba borrar',
    scenario: 'Un usuario quiere eliminar la carpeta de un programa desinstalado, pero Windows le muestra continuamente la alerta: "La acción no se puede completar porque otro programa tiene abierto el archivo".',
    userStatement: '“El archivo está bloqueado y no sé qué programa cerrado lo sigue usando.”',
    initialMistake: 'Reiniciar la computadora varias veces a ciegas sin averiguar qué proceso mantiene el bloqueo.',
    diagnosticQuestion: '¿Qué consola oficial de Windows permite buscar el archivo bloqueado en "Identificadores asociados" para ver el proceso exacto?',
    options: [
      {
        id: 'c3_a1',
        text: 'Resource Monitor (resmon.exe) -> Pestaña CPU / Disco -> Identificadores asociados',
        isCorrect: true,
        explanation: 'Resource Monitor busca el Handle del archivo y te dice exactamente qué ejecutable lo tiene tomado.',
      },
      {
        id: 'c3_a2',
        text: 'El Reproductor de Windows Media',
        isCorrect: false,
        explanation: 'Incorrecto: No inspecciona handles del kernel.',
      },
    ],
    technicalVerdict: 'Resource Monitor identificó que un servicio en segundo plano mantenía el handle abierto. Al detener el servicio, el archivo se eliminó sin problemas.',
    lessonLearned: 'Usa siempre resmon.exe para aislar bloqueos de archivos en lugar de adivinar.',
  },
  {
    id: 'case-03-b',
    code: 'CASO 03-B',
    title: 'La computadora se reinició sola a las 3:00 AM',
    scenario: 'Un servidor de archivos apareció reiniciado a la mañana. El usuario teme que haya sido un ataque de hacking o un corte de luz.',
    userStatement: '“La PC se apagó sola en medio de la noche sin que nadie la tocara.”',
    initialMistake: 'Pensar que fue un virus sin revisar el Visor de eventos.',
    diagnosticQuestion: '¿Qué herramienta y Event ID te confirman la causa exacta del reinicio?',
    options: [
      {
        id: 'c3_b1',
        text: 'Event Viewer (eventvwr.msc) -> Registro de Sistema -> Event ID 1074 (Reinicio por Windows Update) o Event ID 41 (Kernel-Power / Corte de luz).',
        isCorrect: true,
        explanation: 'Event ID 1074 registra el usuario o proceso que solicitó el reinicio ordenado, mientras que el ID 41 indica corte abrupto de energía.',
      },
      {
        id: 'c3_b2',
        text: 'Calculadora de Windows',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'El Visor de eventos reveló Event ID 1074: Reinicio programado por instalación automática de parches de seguridad de Windows Update.',
    lessonLearned: 'Event Viewer registra la firma y razón exacta de cada apagado y reinicio.',
  },
  {
    id: 'case-03-c',
    code: 'CASO 03-C',
    title: 'El misterio del Wi-Fi que se desconecta sólo los miércoles',
    scenario: 'Un cliente informa que su conexión cae todos los miércoles por la tarde desde hace tres semanas.',
    userStatement: '“Mi placa de red Wi-Fi falla todos los miércoles a la misma hora.”',
    initialMistake: 'Cambiar la placa de red Wi-Fi creyendo que es una falla física del hardware.',
    diagnosticQuestion: '¿Qué consola te permite revisar la línea de tiempo histórica para verificar si coincide con una actualización de software o tarea programada?',
    options: [
      {
        id: 'c3_c1',
        text: 'Reliability Monitor (perfmon /rel) y Task Scheduler (taskschd.msc)',
        isCorrect: true,
        explanation: 'Reliability Monitor muestra el historial diario de eventos y Task Scheduler revela si hay un script programado los miércoles.',
      },
      {
        id: 'c3_c2',
        text: 'El Paint',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Se encontró una tarea programada por un software antivirus de terceros que ejecutaba un escaneo agresivo de red los miércoles a las 15:00 hs.',
    lessonLearned: 'Relacioná siempre tiempo y recurrencia con Reliability Monitor y Task Scheduler.',
  },
  {
    id: 'case-03-d',
    code: 'CASO 03-D',
    title: 'El pendrive que no aparece en Explorer',
    scenario: 'Un usuario conecta un pendrive USB de 64 GB, suena el tono de conexión de Windows, pero no aparece ninguna letra de unidad en Este Equipo.',
    userStatement: '“Windows detectó el pendrive pero no me deja abrirlo.”',
    initialMistake: 'Desconectar y conectar el pendrive en 10 puertos USB distintos pensando que la ficha está sucia.',
    diagnosticQuestion: '¿Qué consola debes abrir para verificar si el pendrive carece de letra de unidad asignada o está sin inicializar?',
    options: [
      {
        id: 'c3_d1',
        text: 'Disk Management (diskmgmt.msc)',
        isCorrect: true,
        explanation: 'Permite hacer clic derecho en la partición del pendrive y seleccionar "Cambiar la letra y rutas de acceso a la unidad".',
      },
      {
        id: 'c3_d2',
        text: 'MSConfig',
        isCorrect: false,
        explanation: 'Incorrecto: MSConfig no administra volúmenes ni letras de disco.',
      },
    ],
    technicalVerdict: 'El pendrive tenía un formato correcto en FAT32 pero no tenía asignada una letra de unidad. Se le asignó la letra E: y apareció al instante.',
    lessonLearned: 'Disk Management revela volúmenes ocultos o sin letra de montaje.',
  },
  {
    id: 'case-03-e',
    code: 'CASO 03-E',
    title: '¿Tengo BIOS antiguo o UEFI moderno?',
    scenario: 'Un técnico necesita saber si la PC de un cliente está instalada en modo UEFI con Secure Boot antes de migrar a Windows 11.',
    userStatement: '“No sé si este equipo soporta los requisitos de seguridad de Windows 11.”',
    initialMistake: 'Reiniciar la PC e intentar entrar a la BIOS presionando Delete rápidamente sin saber qué buscar.',
    diagnosticQuestion: '¿Qué herramienta oficial de Windows te muestra en una sola pantalla el Modo de BIOS (UEFI/Heredado) y el estado de Secure Boot?',
    options: [
      {
        id: 'c3_e1',
        text: 'System Information (msinfo32.exe)',
        isCorrect: true,
        explanation: 'Muestra de forma concluyente en el Resumen del sistema las líneas "Modo de BIOS" y "Estado de arranque seguro".',
      },
      {
        id: 'c3_e2',
        text: 'DirectX Diagnostic Tool (dxdiag)',
        isCorrect: false,
        explanation: 'Incorrecto: Dxdiag es para diagnósticos gráficos de DirectX.',
      },
    ],
    technicalVerdict: 'msinfo32 confirmó que el sistema estaba en Modo BIOS: Heredado (Legacy) y GPT no estaba activo, requiriendo conversión previa con `mbr2gpt`.',
    lessonLearned: 'Usa msinfo32 para auditar especificaciones de firmware sin reiniciar la PC.',
  },
];

// BANCO DE PREGUNTAS DEL TEST DE SECTOR 03
export const SECTOR_03_TEST_BANK: Sector03TestQuestion[] = [
  {
    id: 't03-q01',
    questionNumber: 1,
    category: 'HERRAMIENTAS_RENDIMIENTO',
    scenario: 'Un servidor tiene el disco al 100% y querés saber qué archivo exacto se está escribiendo.',
    question: '¿Qué consola debes abrir?',
    options: [
      { id: 'o03_1', text: 'Resource Monitor (resmon.exe) -> Pestaña Disco', isCorrect: true, technicalJustification: 'Resmon es la única herramienta oficial que desglosa I/O por archivo exacto.' },
      { id: 'o03_2', text: 'Event Viewer (eventvwr.msc)', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_3', text: 'Device Manager (devmgmt.msc)', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_4', text: 'MSConfig', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
  {
    id: 't03-q02',
    questionNumber: 2,
    category: 'DIAGNÓSTICO_ERRORES',
    scenario: 'Querés ver una línea de tiempo gráfica de la estabilidad del sistema durante los últimos 30 días.',
    question: '¿Qué comando debes ejecutar?',
    options: [
      { id: 'o03_5', text: 'perfmon /rel (Reliability Monitor)', isCorrect: true, technicalJustification: 'Abre el Monitor de Confiabilidad con el índice de estabilidad de 1 a 10.' },
      { id: 'o03_6', text: 'taskmgr.exe', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_7', text: 'services.msc', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_8', text: 'regedit.exe', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
  {
    id: 't03-q03',
    questionNumber: 3,
    category: 'HARDWARE_DRIVERS',
    scenario: 'Un dispositivo desconocido muestra un triángulo amarillo en el Administrador de dispositivos.',
    question: '¿Qué propiedad dentro de la pestaña Detalles te permite averiguar el fabricante en Google?',
    options: [
      { id: 'o03_9', text: 'Identificadores de hardware (Hardware IDs - VEN_xxxx & DEV_xxxx)', isCorrect: true, technicalJustification: 'Identifica el chip de silicio a nivel de fabricante y modelo.' },
      { id: 'o03_10', text: 'El nombre de la impresora', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_11', text: 'La versión de la calculadora', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_12', text: 'EVIDENCIA INSUFICIENTE', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
  {
    id: 't03-q04',
    questionNumber: 4,
    category: 'CONFIGURACIÓN_REGISTRO',
    scenario: '¿En qué archivo físico en disco se almacenan las configuraciones de la colmena HKEY_CURRENT_USER?',
    question: 'Seleccioná la ruta canónica.',
    options: [
      { id: 'o03_13', text: 'C:\\Users\\<Usuario>\\NTUSER.DAT', isCorrect: true, technicalJustification: 'NTUSER.DAT guarda la colmena HKCU del usuario.' },
      { id: 'o03_14', text: 'C:\\Windows\\System32\\config\\SYSTEM', isCorrect: false, technicalJustification: 'Eso guarda HKLM\SYSTEM.' },
      { id: 'o03_15', text: 'C:\\ProgramFiles\\Registry.log', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_16', text: 'C:\\Windows\\Temp\\user.reg', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
  {
    id: 't03-q05',
    questionNumber: 5,
    category: 'SUPERCONSOLAS',
    scenario: '¿Qué consola MMC agrupa en un solo panel el Visor de eventos, Dispositivos, Discos, Servicios y Usuarios?',
    question: 'Elegí el ejecutable correspondiente.',
    options: [
      { id: 'o03_17', text: 'compmgmt.msc (Computer Management)', isCorrect: true, technicalJustification: 'Computer Management es la superconsola agregadora MMC.' },
      { id: 'o03_18', text: 'ncpa.cpl', isCorrect: false, technicalJustification: 'ncpa.cpl es para adaptadores de red.' },
      { id: 'o03_19', text: 'sysdm.cpl', isCorrect: false, technicalJustification: 'sysdm.cpl es para propiedades del sistema.' },
      { id: 'o03_20', text: 'powercfg.cpl', isCorrect: false, technicalJustification: 'powercfg.cpl es para energía.' },
    ],
  },
];
