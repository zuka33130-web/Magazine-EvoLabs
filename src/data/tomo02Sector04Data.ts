// TOMO 02: LA BIBLIA NEGRA DE WINDOWS // MENTIRA Y VERDAD
// SECTOR 04: ADMINISTRADOR DE TAREAS DE VERDAD // NO SÓLO MIRAR PORCENTAJES

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

export interface Sector04Investigation {
  id: string;
  code: string; // e.g. "04.01"
  title: string;
  subtitle: string;
  tabOrMetric: string;
  riskLevel: 'MONITOR_ONLY' | 'CONFIG_MODIFY_RISK' | 'PROCESS_TERMINATION_RISK';
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
    whatQuestionItAnswers: string;
    keyMetricToWatch: string;
  };
  profundiza: {
    title: string;
    technicalDetails: string[];
    lowLevelNote?: string;
    nextToolToOpen?: string;
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

export interface Sector04MiniCase {
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

export interface Sector04TestQuestion {
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

// 23 INVESTIGACIONES CANÓNICAS DE SECTOR 04
export const SECTOR_04_INVESTIGATIONS: Sector04Investigation[] = [
  {
    id: 'inv-04-01',
    code: '04.01',
    title: 'Processes',
    subtitle: 'Jerarquía de aplicaciones en primer plano, procesos de fondo y procesos de sistema',
    tabOrMetric: 'Pestaña Procesos (Processes)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Es la primera pantalla del Administrador de tareas. Agrupa lo que ves en el escritorio de lo que Windows ejecuta en las sombras.',
      mythVsTruth: {
        mentira: 'Todos los ítems en la pestaña Procesos son programas instalados por el usuario.',
        verdad: 'Se dividen en 3 capas estrictas: Aplicaciones (primer plano), Procesos en segundo plano (apps sin ventana) y Procesos de Windows (kernel y servicios).',
        comprobalo: 'Abrí Task Manager con Ctrl+Shift+Esc e inspeccioná el colapsado de grupos en Procesos.',
      },
    },
    entende: {
      title: 'Jerarquía y preguntas que responde esta pestaña',
      explanation: [
        'Responde a la pregunta: ¿Qué programas con o sin ventana están abiertos ahora mismo y cuánto consumen?',
        'Organiza la vista con columnas de CPU, Memoria, Disco, Red, GPU y Consumo de energía.',
        'Hacer clic en los encabezados de columna ordena los procesos de mayor a menor consumo.',
      ],
      whatQuestionItAnswers: '¿Qué aplicaciones o servicios visibles están consumiendo más recursos en este instante?',
      keyMetricToWatch: 'Consumo de energía y porcentaje de CPU acumulado por grupo.',
    },
    profundiza: {
      title: 'Capa de virtualización de procesos y aislamiento',
      technicalDetails: [
        'Los navegadores web modernos (Chrome, Edge, Firefox) crean un proceso independiente por cada pestaña para evitar que un colapso de una web tire abajo todo el navegador.',
        'Por eso ves 20 entradas del mismo navegador agrupadas bajo la misma cabecera.',
      ],
      lowLevelNote: 'Pertenecen a diferentes PIDs del mismo árbol de procesos.',
      nextToolToOpen: 'Si necesitás ver el proceso hijo exacto que consume dentro del grupo, abrí la pestaña "Detalles".',
    },
    miraloEnTuPc: {
      actionName: 'Expandir un grupo de navegador en la pestaña Procesos',
      steps: [
        'Presioná Ctrl + Shift + Esc.',
        'Asegurate de estar en la pestaña "Procesos".',
        'Hacé clic en la flecha al lado de tu navegador web para ver sus procesos secundarios.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc',
      expectedVisual: 'Lista de aplicaciones agrupadas con porcentajes de CPU, RAM, Disco y GPU.',
    },
    comprobalo: {
      instruction: 'Apertura de la pestaña Procesos.',
      actionPrompt: 'Ejecutá taskmgr.exe.',
      validationKey: 'TASKMGR_PROCESSES_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué ves 15 procesos de "Google Chrome" en Task Manager si sólo tenés 3 pestañas abiertas?',
      instruction: 'Elegí la causa técnica.',
      options: [
        { id: 'opt1', text: 'Porque Chrome aísla en procesos independientes cada pestaña, extensión, renderizador de gráficos y subsistema de audio por seguridad.', isCorrect: true, feedback: '¡Correcto! El aislamiento de procesos evita que un fallo en un script tire todo el navegador.' },
        { id: 'opt2', text: 'Porque tenés 15 virus duplicando el programa.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Porque la memoria RAM está rota.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TASKMGR_PROCESSES_VERIFIED',
      targetDescription: 'Lectura de la jerarquía de la pestaña Procesos',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-02',
    code: '04.02',
    title: 'Performance',
    subtitle: 'Telemetría de tiempo real de CPU, Memoria, Discos, Red y GPU',
    tabOrMetric: 'Pestaña Rendimiento (Performance)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Es el centro de gráficos en tiempo real. Te permite monitorear las constantes vitales del hardware de la PC.',
      mythVsTruth: {
        mentira: 'Ver el gráfico de CPU al 100% durante 1 segundo al abrir un programa es síntoma de falla.',
        verdad: 'Las CPUs modernas utilizan Turbo Boost para subir la frecuencia y dar el 100% durante ráfagas breves para abrir apps instantáneamente.',
        comprobalo: 'Navegá a Rendimiento en Task Manager y observá la frecuencia actual (GHz) e hilos de CPU.',
      },
    },
    entende: {
      title: 'Métricas clave por hardware',
      explanation: [
        'Responde a la pregunta: ¿Cuál es el cuello de botella físico de mi computadora en este momento?',
        '1) CPU: Muestra utilización %, Frecuencia GHz, Procesos, Hilos y Tiempos de actividad.',
        '2) Memoria: RAM en uso, Disponible, Velocidad (MHz), Ranuras usadas, Formato (DIMM/SO-DIMM).',
        '3) Disco: Tiempo activo %, Tiempo de respuesta ms, Velocidad de lectura/escritura KB/s o MB/s.',
        '4) GPU: Uso % por motor (3D, Video, Copy), Memoria dedicada VRAM y Memoria compartida.',
      ],
      whatQuestionItAnswers: '¿Qué componente de hardware está saturado y limita la velocidad global?',
      keyMetricToWatch: 'Tiempo de respuesta del disco en ms y frecuencia de CPU en GHz.',
    },
    profundiza: {
      title: 'Cambio de gráfico global a procesadores lógicos',
      technicalDetails: [
        'Haciendo clic derecho sobre el gráfico de CPU -> Cambiar gráfico a -> Procesadores lógicos, podés ver el uso de cada hilo/núcleo individualmente en lugar de un promedio engañoso.',
      ],
      lowLevelNote: 'Utiliza la API NtQuerySystemInformation del kernel.',
      nextToolToOpen: 'Para analizar contadores históricos en un log de 24 hs, abrí `perfmon.msc`.',
    },
    miraloEnTuPc: {
      actionName: 'Cambiar el gráfico de CPU a Procesadores Lógicos',
      steps: [
        'Abrí Task Manager y ve a la pestaña "Rendimiento".',
        'Hacé clic en CPU.',
        'Hacé clic derecho sobre el gráfico -> "Cambiar gráfico a" -> "Procesadores lógicos".',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Rendimiento',
      expectedVisual: 'Matriz de cuadrículas mostrando la utilización independiente de cada núcleo lógico.',
    },
    comprobalo: {
      instruction: 'Apertura de la pestaña Rendimiento.',
      actionPrompt: 'Inspeccioná los gráficos en tiempo real.',
      validationKey: 'TASKMGR_PERFORMANCE_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué opción del clic derecho sobre el gráfico de CPU en Rendimiento te permite ver si un solo núcleo está saturado al 100%?',
      instruction: 'Seleccioná la opción del menú contextual.',
      options: [
        { id: 'opt1', text: 'Cambiar gráfico a -> Procesadores lógicos', isCorrect: true, feedback: '¡Impecable! Muestra cada hilo de CPU por separado.' },
        { id: 'opt2', text: 'Ocultar gráfico', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Cambiar idioma', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TASKMGR_PERFORMANCE_VERIFIED',
      targetDescription: 'Uso de gráficos de procesadores lógicos en Rendimiento',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-03',
    code: '04.03',
    title: 'App History',
    subtitle: 'Consumo acumulado histórico de recursos para aplicaciones UWP / Store',
    tabOrMetric: 'Pestaña Historial de aplicaciones (App History)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: '¿Querés saber qué aplicación consumió más datos de tu plan Wi-Fi/móvil o más tiempo de procesador durante el último mes?',
      mythVsTruth: {
        mentira: 'App History muestra el consumo histórico de todos los programas ejecutable `.exe` tradicionales de escritorio.',
        verdad: 'App History rastrea principalmente el consumo acumulado de aplicaciones universales de la tienda (UWP / Store Apps).',
        comprobalo: 'Abrí Task Manager, ve a "Historial de aplicaciones" e inspeccioná la columna "Red" y "Tiempo de CPU".',
      },
    },
    entende: {
      title: 'Métricas de consumo acumulado',
      explanation: [
        'Responde a la pregunta: ¿Qué app de fondo estuvo descargando datos o consumiendo batería a lo largo de días?',
        'Registra Tiempo de CPU, Red, Red con límite y Actualizaciones de mosaicos.',
        'Permite hacer clic en "Eliminar historial de uso" para reiniciar el contador de consumo a cero.',
      ],
      whatQuestionItAnswers: '¿Qué aplicaciones consumieron más datos o batería acumulada en el tiempo?',
      keyMetricToWatch: 'Consumo total de datos en MB/GB en la columna Red.',
    },
    profundiza: {
      title: 'Habilitar el monitoreo de programas tradicionales de escritorio',
      technicalDetails: [
        'En Opciones -> Historial de uso -> se puede activar la casilla "Mostrar historial para todos los procesos" para incluir ejecutables de escritorio clásicos en el rastreo.',
      ],
      lowLevelNote: 'Los datos son recopilados por el servicio Diagnostic Policy Service (DPS).',
      nextToolToOpen: 'Para ver el consumo de datos por adaptador de red en tiempo real, usá `ncpa.cpl` o Resource Monitor.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir App History y revisar el consumo de red acumulado',
      steps: [
        'Abrí Task Manager.',
        'Hacé clic en la pestaña "Historial de aplicaciones".',
        'Observá la columna "Red" para identificar las aplicaciones que más datos usaron.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Historial',
      expectedVisual: 'Lista de aplicaciones de la Tienda con tiempo de CPU y volumen de datos de red acumulados.',
    },
    comprobalo: {
      instruction: 'Apertura de Historial de aplicaciones.',
      actionPrompt: 'Verificá las métricas acumuladas.',
      validationKey: 'TASKMGR_APPHISTORY_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué botón en la pestaña Historial de aplicaciones te permite reiniciar la medición acumulada de datos a cero?',
      instruction: 'Seleccioná la acción correcta.',
      options: [
        { id: 'opt1', text: 'Eliminar historial de uso (Delete usage history)', isCorrect: true, feedback: '¡Correcto! Resetea los contadores acumulados a cero.' },
        { id: 'opt2', text: 'Formatear disco', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Cerrar sesión', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TASKMGR_APPHISTORY_VERIFIED',
      targetDescription: 'Auditoría de datos acumulados en App History',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-04',
    code: '04.04',
    title: 'Startup Apps',
    subtitle: 'Gestión de elementos de inicio de sesión e impacto en el tiempo de arranque',
    tabOrMetric: 'Pestaña Aplicaciones de arranque (Startup Apps)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Si tu computadora tarda 3 minutos en encender, la causa #1 son los 15 programas instalados que decidieron iniciar automáticamente con Windows.',
      mythVsTruth: {
        mentira: 'Deshabilitar un programa en la pestaña Startup Apps lo desinstala o destruye.',
        verdad: 'Deshabilitarlo sólo evita que abra solo al iniciar sesión; el programa sigue instalado y funciona normalmente cuando lo abrís vos.',
        comprobalo: 'Abrí Task Manager, ve a "Aplicaciones de arranque" y revisá la columna "Impacto de inicio".',
      },
    },
    entende: {
      title: 'Mecanismos de Inicio y Calificación de Impacto',
      explanation: [
        'Responde a la pregunta: ¿Qué aplicaciones están enlenteciendo el proceso de inicio de sesión?',
        'Windows mide el impacto en el arranque categorizándolo en: Alto (High), Medio (Medium), Bajo (Low) o Ninguno (None).',
        'Muestra el Editor / Publicador (Publisher) y el Estado (Habilitado / Deshabilitado).',
      ],
      whatQuestionItAnswers: '¿Qué programas innecesarios puedo deshabilitar para acelerar el inicio de la PC?',
      keyMetricToWatch: 'Impacto de inicio: Alto.',
    },
    profundiza: {
      title: 'Ubicación de los elementos de arranque en el Registro',
      technicalDetails: [
        'Los ítems mostrados aquí corresponden a las claves de registro:',
        '`HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`',
        '`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`',
        'y la carpeta física `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`.',
      ],
      lowLevelNote: 'No incluye servicios de Windows ni Tareas programadas.',
      nextToolToOpen: 'Para auditar tareas programadas avanzadas de inicio, usá `taskschd.msc` o Autoruns (Sysinternals).',
    },
    miraloEnTuPc: {
      actionName: 'Deshabilitar un programa con impacto Alto en el inicio',
      steps: [
        'Abrí Task Manager.',
        'Hacé clic en "Aplicaciones de arranque".',
        'Buscá un programa con impacto "Alto" que no necesites al arrancar (ej. Spotify, Steam) y hacé clic en "Deshabilitar".',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Arranque',
      expectedVisual: 'Lista de programas de inicio con columnas de Editor, Estado e Impacto de inicio.',
    },
    comprobalo: {
      instruction: 'Apertura de Aplicaciones de arranque.',
      actionPrompt: 'Inspeccioná los programas de inicio.',
      validationKey: 'TASKMGR_STARTUP_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Deshabilitás "Spotify" en la pestaña Aplicaciones de arranque. ¿Qué ocurre exactamente la próxima vez que encendés la PC?',
      instruction: 'Seleccioná la consecuencia real.',
      options: [
        { id: 'opt1', text: 'Spotify no abrirá automáticamente en segundo plano al iniciar sesión, pero podrás abrirlo manualmente cuando quieras.', isCorrect: true, feedback: '¡Excelente! No borra la app, sólo evita su autocarga.' },
        { id: 'opt2', text: 'Spotify se desinstala del disco.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Se borra la cuenta de usuario.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TASKMGR_STARTUP_VERIFIED',
      targetDescription: 'Gestión de elementos de inicio en Startup Apps',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-05',
    code: '04.05',
    title: 'Users',
    subtitle: 'Aislamiento de consumo de recursos por cada sesión de usuario conectada',
    tabOrMetric: 'Pestaña Usuarios (Users)',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'En PCs compartidas o servidores donde hay varios usuarios con sesión iniciada, esta pestaña revela quién se está comiendo toda la memoria RAM.',
      mythVsTruth: {
        mentira: 'Si un usuario cierra su ventana o cambia de usuario, sus programas dejan de consumir recursos.',
        verdad: 'Al hacer "Cambiar de usuario" sin "Cerrar sesión", los procesos del otro usuario siguen corriendo en segundo plano y consumiendo RAM.',
        comprobalo: 'Abrí Task Manager, ve a la pestaña "Usuarios" y expandí tu cuenta para ver tus procesos.',
      },
    },
    entende: {
      title: 'Gestión de Sesiones Concurrentes',
      explanation: [
        'Responde a la pregunta: ¿Cuánto recurso consume cada sesión de usuario activa en el equipo?',
        'Permite ver los procesos agrupados por cada nombre de cuenta.',
        'Ofrece la opción de hacer clic derecho -> "Cerrar sesión" (Sign off) sobre otro usuario para liberar recursos.',
      ],
      whatQuestionItAnswers: '¿Qué cuenta de usuario específica está saturando el equipo?',
      keyMetricToWatch: 'Consumo total de Memoria (MB/GB) por cuenta de usuario.',
    },
    profundiza: {
      title: 'IDs de Sesión de Windows (Session IDs)',
      technicalDetails: [
        'En Windows, la sesión 0 está reservada exclusivamente para servicios de sistema (non-interactive Session 0).',
        'Las sesiones de usuarios interactivos comienzan a partir de la Session ID 1, 2, 3...',
      ],
      lowLevelNote: 'Aislamiento de sesión administrado por el subsistema `smss.exe` y `winlogon.exe`.',
      nextToolToOpen: 'Para ver las conexiones de red o archivos abiertos por otros usuarios de la red local, usá `compmgmt.msc`.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir la pestaña Usuarios y revisar el desglose de sesión',
      steps: [
        'Abrí Task Manager.',
        'Hacé clic en la pestaña "Usuarios".',
        'Expandí el nombre de tu usuario activo para ver el desglose de memoria y CPU por proceso.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Usuarios',
      expectedVisual: 'Tabla con nombres de usuario activos, porcentaje de consumo global y lista de procesos desglosados.',
    },
    comprobalo: {
      instruction: 'Apertura de la pestaña Usuarios.',
      actionPrompt: 'Verificá las sesiones activas.',
      validationKey: 'TASKMGR_USERS_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué Session ID está reservada exclusivamente para los servicios de sistema sin interfaz gráfica en Windows por razones de seguridad?',
      instruction: 'Elegí el número de sesión.',
      options: [
        { id: 'opt1', text: 'Session 0', isCorrect: true, feedback: '¡Impecable! Aislamiento de Sesión 0 previene ataques de shatter contra servicios.' },
        { id: 'opt2', text: 'Session 100', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Session Admin', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TASKMGR_USERS_VERIFIED',
      targetDescription: 'Lectura de consumo por sesión en la pestaña Usuarios',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-06',
    code: '04.06',
    title: 'Details',
    subtitle: 'La vista técnica avanzada: PID, Estado, Nombre de imagen, Línea de comandos y Memoria privada',
    tabOrMetric: 'Pestaña Detalles (Details)',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Es la vista sin filtros donde cada línea corresponde exactamente a un ejecutable con su ID de Proceso (PID) asignado por el kernel.',
      mythVsTruth: {
        mentira: 'Finalizar un proceso desde la pestaña Detalles es lo mismo que cerrarlo normalmente desde la cruz de la ventana.',
        verdad: 'Finalizar tarea en Detalles envía la llamada `TerminateProcess` al kernel, matando la ejecución de forma abrupta sin guardar datos no salvados.',
        comprobalo: 'Abrí Task Manager, ve a "Detalles", hacé clic derecho en los encabezados de columna y seleccioná "Seleccionar columnas".',
      },
    },
    entende: {
      title: 'La vista forense de ejecutables planos',
      explanation: [
        'Responde a la pregunta: ¿Cuál es el ejecutable real, PID, ruta y parámetros exactos de este proceso?',
        'A diferencia de Procesos, aquí no hay agrupaciones por nombre comercial; ves el nombre `.exe` real.',
        'Columnas agregables clave: PID, Nombre de imagen, Nombre de usuario, Línea de comandos, Tamaño del lote de trabajo (Working Set), Memoria privada, Hilos, Identificadores (Handles).',
      ],
      whatQuestionItAnswers: '¿Qué PID y ejecutable exacto corresponde a un proceso determinado?',
      keyMetricToWatch: 'PID y columna Línea de comandos (Command Line).',
    },
    profundiza: {
      title: 'Opciones del menú contextual de un proceso en Detalles',
      technicalDetails: [
        'Establecer prioridad (Realtime, High, Above Normal, Normal, Below Normal, Low).',
        'Establecer afinidad (Elegir qué núcleos de CPU puede usar el proceso).',
        'Abrir ubicación del archivo (Te lleva a la carpeta física exacta en C:).',
        'Crear archivo de volcado de memoria (Genera un `.dmp` completo de la RAM del proceso).',
      ],
      lowLevelNote: 'Muestra directamente las estructuras EPROCESS del kernel.',
      nextToolToOpen: 'Para ver el árbol de procesos padre/hijo con colores de firma de código, abrí Process Explorer (Sysinternals).',
    },
    miraloEnTuPc: {
      actionName: 'Agregar la columna "Línea de comandos" en la pestaña Detalles',
      steps: [
        'Abrí Task Manager y ve a la pestaña "Detalles".',
        'Hacé clic derecho sobre el encabezado de cualquier columna (ej. PID) y seleccioná "Seleccionar columnas".',
        'Buscá y marcá la casilla "Línea de comandos" y hacé clic en Aceptar.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Detalles',
      expectedVisual: 'Tabla con ejecutables .exe, PID, Estado, Usuario, Consumo de memoria y Línea de comandos.',
    },
    comprobalo: {
      instruction: 'Apertura de la pestaña Detalles.',
      actionPrompt: 'Habilitá la columna Línea de comandos.',
      validationKey: 'TASKMGR_DETAILS_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué función cumple la llamada del sistema al presionar "Finalizar tarea" dentro de la pestaña Detalles?',
      instruction: 'Seleccioná la llamada de kernel.',
      options: [
        { id: 'opt1', text: 'Envía TerminateProcess al kernel cancelando la ejecución de forma inmediata sin guardar archivos.', isCorrect: true, feedback: '¡Exacto! Es una terminación forzada e instantánea.' },
        { id: 'opt2', text: 'Envía un mensaje de texto al usuario.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Guarda un documento en Word.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TASKMGR_DETAILS_VERIFIED',
      targetDescription: 'Uso de la pestaña Detalles y selección de columnas periciales',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-07',
    code: '04.07',
    title: 'Services',
    subtitle: 'Vista rápida de servicios de Windows, estado, PID atado y grupo svchost',
    tabOrMetric: 'Pestaña Servicios (Services)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Te permite ver en una sola tabla qué servicio de sistema está corriendo, cuál es su PID si está activo y a qué grupo pertenece.',
      mythVsTruth: {
        mentira: 'Todos los servicios de Windows corren en archivos `.exe` separados independientes.',
        verdad: 'Decenas de servicios de Windows se alojan juntos dentro de instancias compartidas del proceso genérico `svchost.exe`.',
        comprobalo: 'Abrí Task Manager, ve a "Servicios", hacé clic derecho en cualquier servicio activo y seleccioná "Ir a Detalles".',
      },
    },
    entende: {
      title: 'Puntero directo entre Servicio y PID',
      explanation: [
        'Responde a la pregunta: ¿Qué PID y proceso `svchost.exe` exacto está ejecutando este servicio de Windows?',
        'Columnas: Nombre (Nombre interno del servicio), PID, Descripción, Estado (En ejecución / Detenido), Grupo.',
        'Botones rápidos: Iniciar, Detener, Reiniciar y "Abrir servicios" (que lanza `services.msc`).',
      ],
      whatQuestionItAnswers: '¿Qué servicio de sistema está detrás de un determinado PID de svchost?',
      keyMetricToWatch: 'Vinculación entre Nombre de Servicio y PID.',
    },
    profundiza: {
      title: 'Aislamiento de svchost.exe en Windows moderno',
      technicalDetails: [
        'A partir de Windows 10 (1703) en PCs con más de 3.5 GB de RAM, Windows aísla cada servicio en su propia instancia individual de `svchost.exe`.',
        'Esto evita que un fallo en un servicio tire abajo a los demás servicios del mismo grupo.',
      ],
      lowLevelNote: 'Rutas configuradas en `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Svchost`.',
      nextToolToOpen: 'Para cambiar el tipo de inicio (Manual, Automático, Deshabilitado) o ver dependencias, abriles la consola completa `services.msc`.',
    },
    miraloEnTuPc: {
      actionName: 'Vincular un servicio activo con su PID en Detalles',
      steps: [
        'Abrí Task Manager y ve a la pestaña "Servicios".',
        'Buscá un servicio en estado "En ejecución" que tenga un número en la columna PID (ej. Spooler o WSearch).',
        'Hacé clic derecho sobre él y seleccioná "Ir a detalles" para ver el ejecutable remarcado.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Servicios',
      expectedVisual: 'Tabla de servicios con salto directo resaltado hacia el proceso en la pestaña Detalles.',
    },
    comprobalo: {
      instruction: 'Apertura de la pestaña Servicios.',
      actionPrompt: 'Vinculá un servicio con su PID.',
      validationKey: 'TASKMGR_SERVICES_ACCESSED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué opción del clic derecho sobre un servicio en Task Manager te salta de inmediato a su ejecutable y PID en la pestaña Detalles?',
      instruction: 'Seleccioná la opción contextual.',
      options: [
        { id: 'opt1', text: 'Ir a Detalles (Go to details)', isCorrect: true, feedback: '¡Excelente! Revela la relación exacta entre servicio y proceso.' },
        { id: 'opt2', text: 'Borrar archivo', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Cambiar fondo de pantalla', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'TASKMGR_SERVICES_VERIFIED',
      targetDescription: 'Vinculación de servicios y PIDs en Task Manager',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-08',
    code: '04.08',
    title: 'PID',
    subtitle: 'Process Identifier: El número entero único asignado por el kernel a cada proceso',
    tabOrMetric: 'Métrica PID (Process ID)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'El PID es el "DNI" numérico de un proceso. En lugar de referirte a un programa por su nombre comercial, el kernel y las herramientas lo identifican por su PID único.',
      mythVsTruth: {
        mentira: 'Un programa conserva siempre el mismo PID cada vez que lo abrís o cada vez que encendés la PC.',
        verdad: 'Los PIDs se asignan dinámicamente de forma secuencial por el kernel cada vez que se crea un proceso. Al cerrarlo, el PID se libera.',
        comprobalo: 'Abrí el Bloc de notas dos veces separadas y observá en Detalles cómo cada instancia recibe un PID numérico distinto.',
      },
    },
    entende: {
      title: 'El ciclo de vida de un PID',
      explanation: [
        'Responde a la pregunta: ¿Cómo diferencio exactamente dos instancias abiertas del mismo ejecutable (ej. dos cmd.exe)?',
        'El PID es un número entero múltiplo de 4 en la arquitectura de Windows NT.',
        'Se utiliza en comandos de consola como `taskkill /PID 1234 /F` o `netstat -ano`.',
      ],
      whatQuestionItAnswers: '¿Cuál es el número único de proceso asignado en RAM por el kernel?',
      keyMetricToWatch: 'Número de PID en la pestaña Detalles.',
    },
    profundiza: {
      title: 'PIDs especiales del kernel',
      technicalDetails: [
        'PID 0: System Idle Process (Hilo inactivo del sistema que mide el tiempo libre del procesador).',
        'PID 4: System (Proceso kernel de Windows NT que aloja los hilos de controladores de modo kernel).',
      ],
      lowLevelNote: 'Asignado por el gestor de objetos del kernel (ObCreateObject).',
      nextToolToOpen: 'Para ver el PID que tiene abierto un puerto de red TCP determinado, usá `netstat -ano` en CMD.',
    },
    miraloEnTuPc: {
      actionName: 'Obtener el PID de un programa desde la consola CMD',
      steps: [
        'Presioná Win + R, escribí `cmd` y presioná Enter.',
        'Escribí el comando `tasklist` y presioná Enter.',
        'Observá la segunda columna marcada como "PID" al lado de cada ejecutable.',
      ],
      commandOrPath: 'tasklist',
      shortcut: 'Win + R -> cmd -> tasklist',
      expectedVisual: 'Lista textual en consola mostrando Nombre de imagen, PID, Nombre de sesión y Uso de memoria.',
    },
    comprobalo: {
      instruction: 'Obtención de PID mediante tasklist.',
      actionPrompt: 'Ejecutá tasklist en CMD.',
      validationKey: 'PID_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué PID numérico fijo reservado tiene el proceso del Kernel de Windows (`System`) en todas las instalaciones de Windows NT?',
      instruction: 'Seleccioná el PID del kernel.',
      options: [
        { id: 'opt1', text: 'PID 4', isCorrect: true, feedback: '¡Impecable! PID 4 está reservado por arquitectura para el proceso System de kernel.' },
        { id: 'opt2', text: 'PID 9999', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'PID 1', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PID_CONCEPT_VERIFIED',
      targetDescription: 'Comprensión y uso del identificador PID',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-09',
    code: '04.09',
    title: 'PPID',
    subtitle: 'Parent Process Identifier: La relación genealógica padre e hijo en el árbol de procesos',
    tabOrMetric: 'Métrica PPID (Parent Process ID)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Ningún proceso nace de la nada en Windows. Todo proceso es creado por otro proceso existente llamado "Proceso Padre" (Parent Process).',
      mythVsTruth: {
        mentira: 'Si un proceso desconocido fue creado por `explorer.exe`, es 100% seguro que es un malware.',
        verdad: '`explorer.exe` es el shell del usuario; todo programa que abrís haciendo doble clic en el escritorio o menú inicio tiene como padre a `explorer.exe`.',
        comprobalo: 'Visualizá el árbol de procesos en Process Explorer o mediante el comando `wmic process get processid,parentprocessid,caption`.',
      },
    },
    entende: {
      title: 'El Árbol Genealógico de Ejecución',
      explanation: [
        'Responde a la pregunta: ¿Quién ejecutó a este proceso?',
        'Ejemplo de árbol canónico:',
        '`explorer.exe` (Padre - PID 3000)',
        '└── `cmd.exe` (Hijo - PID 4500 / PPID 3000)',
        '    └── `powershell.exe` (Nieto - PID 5200 / PPID 4500)',
      ],
      whatQuestionItAnswers: '¿Qué programa o script lanzó la ejecución de un determinado proceso?',
      keyMetricToWatch: 'Identificador del proceso padre (PPID).',
    },
    profundiza: {
      title: 'Anomalías de PPID y relaciones sospechosas',
      technicalDetails: [
        'Un caso sospechoso común: Ver `cmd.exe` o `powershell.exe` teniendo como padre a `WINWORD.EXE` o `excel.exe` (Indicio clásico de macro maliciosa).',
        'Ver `svchost.exe` teniendo como padre a un programa de usuario en lugar de `services.exe` (Indicio de proceso camuflado).',
      ],
      lowLevelNote: 'Si el proceso padre finaliza antes que el hijo, el hijo queda como proceso huérfano (Orphan Process).',
      nextToolToOpen: 'Para inspeccionar el árbol genealógico completo con sangrías visuales, usá Process Explorer.',
    },
    miraloEnTuPc: {
      actionName: 'Obtener el PPID de los procesos con PowerShell',
      steps: [
        'Presioná Win + R, escribí `powershell` y presioná Enter.',
        'Escribí el comando: `Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name` y presioná Enter.',
        'Observá la columna ParentProcessId.',
      ],
      commandOrPath: 'Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name',
      shortcut: 'Win + R -> powershell',
      expectedVisual: 'Tabla con ProcessId (PID), ParentProcessId (PPID) y Nombre de ejecutable.',
    },
    comprobalo: {
      instruction: 'Obtención de PPID mediante PowerShell.',
      actionPrompt: 'Ejecutá el comando CimInstance.',
      validationKey: 'PPID_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Observás en la auditoría que `powershell.exe` tiene como PPID al proceso de `WINWORD.EXE` (Microsoft Word) tras abrir un archivo adjunto. ¿Por qué es una alerta técnica?',
      instruction: 'Identificá la razón de sospecha.',
      options: [
        { id: 'opt1', text: 'Porque habitualmente Word no debe invocar consolas PowerShell; indica la ejecución de una macro o exploit.', isCorrect: true, feedback: '¡Excelente análisis pericial! Es la firma de comportamiento de un documento tramposo.' },
        { id: 'opt2', text: 'Porque Word acelera la consola.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Porque se borró el disco.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PPID_CONCEPT_VERIFIED',
      targetDescription: 'Análisis de relaciones Padre-Hijo (PPID)',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-10',
    code: '04.10',
    title: 'Threads',
    subtitle: 'Hilos de ejecución: La unidad mínima de programación planificada por el Scheduler de la CPU',
    tabOrMetric: 'Métrica Hilos (Threads)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Un proceso no "ejecuta" código directamente; un proceso es un contenedor. Los que ejecutan las instrucciones reales dentro del proceso son sus HILOS (Threads).',
      mythVsTruth: {
        mentira: 'Un programa con 100 hilos es 100 veces más rápido que uno con 1 hilo.',
        verdad: 'Si el programa no está bien optimizado o si 1 solo hilo se traba en un bucle infinito, puede congelar la app aunque la CPU global marque sólo 10% de uso.',
        comprobalo: 'Agregá la columna "Hilos" en la pestaña Detalles de Task Manager y mirá cuántos hilos tiene un proceso como `explorer.exe`.',
      },
    },
    entende: {
      title: 'Diferencia entre Proceso e Hilo',
      explanation: [
        'Proceso = El contenedor de espacio de dirección de memoria virtual, handles y credenciales.',
        'Hilo (Thread) = La secuencia de instrucciones ejecutable enviada al núcleo de la CPU.',
        'Un solo proceso puede contener desde 1 hilo hasta cientos de hilos ejecutándose en paralelo en diferentes núcleos de procesador.',
      ],
      whatQuestionItAnswers: '¿Cuántos hilos de ejecución simultáneos tiene abiertos un proceso?',
      keyMetricToWatch: 'Número de hilos por proceso y estado de hilos saturados.',
    },
    profundiza: {
      title: 'El peligro del hilo único saturado (Single-Thread Bottleneck)',
      technicalDetails: [
        'En una CPU de 10 núcleos (20 hilos lógicos), 1 hilo saturado al 100% consume exactamente el 5% de la CPU global (100 / 20 = 5%).',
        'El usuario ve "CPU al 5%" pero la aplicación está completamente congelada porque su hilo principal (UI Thread) está colapsado.',
      ],
      lowLevelNote: 'Administrado por el Scheduler del kernel en modo kernel (KeUpdateThread).',
      nextToolToOpen: 'Para ver las llamadas de pila (Stack Trace) de cada hilo individual, usá Process Explorer.',
    },
    miraloEnTuPc: {
      actionName: 'Agregar la columna Hilos en Detalles de Task Manager',
      steps: [
        'Abrí Task Manager y ve a "Detalles".',
        'Hacé clic derecho en el encabezado de columna -> "Seleccionar columnas".',
        'Marcá la casilla "Hilos" y aceptá.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Columnas -> Hilos',
      expectedVisual: 'Columna Hilos mostrando números enteros (ej. 15, 45, 120) por cada proceso.',
    },
    comprobalo: {
      instruction: 'Agregado de la columna Hilos en Detalles.',
      actionPrompt: 'Verificá el número de hilos.',
      validationKey: 'THREADS_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'En un procesador de 8 núcleos (8 hilos lógicos), un programa monohilo se traba en un bucle infinito. ¿Qué porcentaje de consumo global de CPU mostrará Task Manager?',
      instruction: 'Calculá el porcentaje.',
      options: [
        { id: 'opt1', text: '12.5% (100% / 8 hilos = 12.5% de consumo global)', isCorrect: true, feedback: '¡Matemática pericial impecable! 1 núcleo al 100% en una CPU de 8 hilos es exactamente 12.5%.' },
        { id: 'opt2', text: '100% global', isCorrect: false, feedback: 'Incorrecto: Sólo 1 hilo está saturado, no los 8.' },
        { id: 'opt3', text: '0%', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'THREADS_CONCEPT_VERIFIED',
      targetDescription: 'Comprensión de hilos de ejecución y cálculo de saturación',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-11',
    code: '04.11',
    title: 'Handles',
    subtitle: 'Identificadores de recursos del kernel: Archivos, claves de registro, eventos y sockets',
    tabOrMetric: 'Métrica Identificadores (Handles)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Cada vez que un programa abre un archivo, una clave del registro o un puerto de red, el kernel de Windows le otorga un "Handle" (Identificador).',
      mythVsTruth: {
        mentira: 'Los Handles son sólo para archivos de texto.',
        verdad: 'Existen Handles de tipo File, Key, Event, Mutex, Thread, Process, Section y Token.',
        comprobalo: 'Agregá la columna "Identificadores" (Handles) en Detalles para ver cuántos recursos del kernel tiene reservados cada proceso.',
      },
    },
    entende: {
      title: 'Fugas de Identificadores (Handle Leaks)',
      explanation: [
        'Responde a la pregunta: ¿El proceso está solicitando recursos al kernel y olvidando liberarlos?',
        'Si un programa tiene un error de programación y abre un Handle cada segundo sin cerrarlo, los Handles subirán de 500 a 100.000 consumiendo la tabla no paginada del kernel.',
      ],
      whatQuestionItAnswers: '¿Cuántos objetos de kernel tiene abiertos la aplicación?',
      keyMetricToWatch: 'Crecimiento sostenido sin techo del número de Identificadores (Handle Leak).',
    },
    profundiza: {
      title: 'La Tabla de Identificadores de Proceso (Handle Table)',
      technicalDetails: [
        'Cada proceso tiene su propia tabla privada de Handles que apunta a la tabla global de objetos del kernel (`OBJECT_HEADER`).',
      ],
      lowLevelNote: 'Administrado por la tabla de objetos del Executive de Windows NT.',
      nextToolToOpen: 'Para buscar qué proceso tiene abierto un Handle de archivo específico, usá Resource Monitor o Process Explorer (`Ctrl + F`).',
    },
    miraloEnTuPc: {
      actionName: 'Agregar la columna Identificadores en la pestaña Detalles',
      steps: [
        'Abrí Task Manager y ve a "Detalles".',
        'Hacé clic derecho en el encabezado de columna -> "Seleccionar columnas".',
        'Marcá "Identificadores" (Handles) y observá los valores.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Columnas -> Identificadores',
      expectedVisual: 'Columna Identificadores mostrando el número de objetos de kernel abiertos por proceso.',
    },
    comprobalo: {
      instruction: 'Agregado de la columna Identificadores.',
      actionPrompt: 'Verificá el número de Handles.',
      validationKey: 'HANDLES_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un proceso muestra que su cantidad de Identificadores (Handles) sube de a 100 por minuto continuamente sin bajar jamás. ¿Qué problema sufre?',
      instruction: 'Identificá la falla.',
      options: [
        { id: 'opt1', text: 'Una fuga de identificadores (Handle Leak) por no cerrar las referencias a objetos del kernel.', isCorrect: true, feedback: '¡Correcto! Agota los recursos de la tabla del kernel con el tiempo.' },
        { id: 'opt2', text: 'Un problema de pantalla.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Falta de espacio en pendrive.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'HANDLES_CONCEPT_VERIFIED',
      targetDescription: 'Auditoría de Handles e identificación de Handle Leaks',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-12',
    code: '04.12',
    title: 'Affinity',
    subtitle: 'Afinidad de procesador: Asignación de núcleos de CPU específicos a un proceso',
    tabOrMetric: 'Establecer afinidad (Set Affinity)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Te permite obligar a un programa específico o juego antiguo a ejecutarse únicamente en ciertos núcleos de CPU seleccionados.',
      mythVsTruth: {
        mentira: 'Desmarcar núcleos en la afinidad de un programa siempre aumenta su velocidad.',
        verdad: 'Limitar la afinidad reduce los recursos de procesamiento disponibles. Sólo es útil para juegos legacy que colapsan en CPUs multinúcleo modernas.',
        comprobalo: 'En Detalles de Task Manager, hacé clic derecho en un proceso -> "Establecer afinidad" e inspeccioná las casillas de núcleos.',
      },
    },
    entende: {
      title: 'Máscara de Afinidad (Affinity Mask)',
      explanation: [
        'Responde a la pregunta: ¿En qué núcleos de procesador físicos o lógicos tiene permitido ejecutarse este proceso?',
        'Por defecto, todos los procesos tienen seleccionados "Todos los procesadores".',
        'Útil para aislar procesos pesados en núcleos específicos sin afectar el resto del sistema.',
      ],
      whatQuestionItAnswers: '¿A qué núcleos de procesador está restringida la ejecución de esta app?',
      keyMetricToWatch: 'Selección de núcleos lógicos activos en la máscara.',
    },
    profundiza: {
      title: 'Afinidad en arquitecturas híbridas (P-Cores vs E-Cores)',
      technicalDetails: [
        'En procesadores modernos con núcleos de alto rendimiento (P-Cores) y eficiencia (E-Cores), la afinidad permite forzar aplicaciones críticas a correr exclusivamente en los P-Cores.',
      ],
      lowLevelNote: 'Administrado por la función de API `SetProcessAffinityMask`.',
      nextToolToOpen: 'Para automatizar perfiles de afinidad permanentes, usá utilidades de gestión de procesos avanzadas.',
    },
    miraloEnTuPc: {
      actionName: 'Abrir el menú de Afinidad de un proceso',
      steps: [
        'Abrí Task Manager y ve a "Detalles".',
        'Hacé clic derecho sobre un proceso (ej. `notepad.exe`) y seleccioná "Establecer afinidad".',
        'Observá la lista de casillas "CPU 0", "CPU 1", "CPU 2"...',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Detalles -> Afinidad',
      expectedVisual: 'Ventana flotante con lista de casillas de verificación para cada procesador lógico.',
    },
    comprobalo: {
      instruction: 'Apertura del menú de Afinidad.',
      actionPrompt: 'Verificá la máscara de afinidad.',
      validationKey: 'AFFINITY_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿En qué escenario técnico real es válido modificar la Afinidad de un proceso?',
      instruction: 'Elegí el escenario correcto.',
      options: [
        { id: 'opt1', text: 'Para corregir fallas de compatibilidad en un juego antiguo que colapsa si detecta más de 4 núcleos de CPU.', isCorrect: true, feedback: '¡Excelente! La afinidad soluciona incompatibilidades de motores antiguos multinúcleo.' },
        { id: 'opt2', text: 'Para aumentar la capacidad del disco rígido.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Para cambiar la IP de la red.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'AFFINITY_CONCEPT_VERIFIED',
      targetDescription: 'Uso y desmitificación de la Afinidad de procesador',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-13',
    code: '04.13',
    title: 'Priority',
    subtitle: 'Niveles de prioridad del programador de la CPU y la advertencia sobre Realtime',
    tabOrMetric: 'Establecer prioridad (Set Priority)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Le indica al Scheduler de Windows qué procesos deben recibir tiempo de CPU primero cuando el procesador está saturado.',
      mythVsTruth: {
        mentira: 'Poner todos tus juegos en prioridad "Tiempo real" (Realtime) te da el máximo rendimiento sin riesgos.',
        verdad: 'Prioridad "Tiempo real" pasa por encima de los hilos de mouse, teclado e I/O de disco. Si el juego se traba, congela TODA la PC sin poder mover el cursor.',
        comprobalo: 'En Detalles, hacé clic derecho en un proceso -> "Establecer prioridad" y observá los 6 niveles.',
      },
    },
    entende: {
      title: 'Los 6 Niveles de Prioridad de Windows',
      explanation: [
        '1) Realtime (Tiempo real - Nivel 24): Reservado para controladores e hilos críticos del sistema. DANGER.',
        '2) High (Alta - Nivel 13): Prioridad superior para tareas de procesamiento de audio o video en vivo.',
        '3) Above Normal (Por encima de lo normal - Nivel 10).',
        '4) Normal (Normal - Nivel 8): Prioridad por defecto de casi todas las aplicaciones de usuario.',
        '5) Below Normal (Por debajo de lo normal - Nivel 6).',
        '6) Low (Baja - Nivel 4): Para renders o tareas de fondo que sólo deben usar CPU libre.',
      ],
      whatQuestionItAnswers: '¿Qué prioridad de atención otorga el Scheduler a este proceso frente a la saturación?',
      keyMetricToWatch: 'Nivel de prioridad del proceso.',
    },
    profundiza: {
      title: 'Quantum de CPU y preemoción',
      technicalDetails: [
        'Un proceso con mayor prioridad realiza preemoción (preemption) desplaza a los hilos de menor prioridad en la cola de ejecución.',
      ],
      lowLevelNote: 'Gobernado por la función `SetPriorityClass`.',
      nextToolToOpen: 'Para monitorear el cambio de prioridades en tiempo real, usá Process Explorer.',
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar los niveles de prioridad en la pestaña Detalles',
      steps: [
        'Abrí Task Manager y ve a "Detalles".',
        'Hacé clic derecho en un proceso -> "Establecer prioridad".',
        'Observá la lista: Tiempo real, Alta, Por encima de lo normal, Normal, Por debajo de lo normal, Baja.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Detalles -> Prioridad',
      expectedVisual: 'Menú contextual con los 6 niveles de prioridad de programación.',
    },
    comprobalo: {
      instruction: 'Apertura del menú de Prioridad.',
      actionPrompt: 'Verificá los niveles de prioridad.',
      validationKey: 'PRIORITY_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué la documentación de Microsoft advierte rotundamente NO usar la prioridad "Tiempo real" (Realtime) en programas de usuario?',
      instruction: 'Elegí la razón de seguridad.',
      options: [
        { id: 'opt1', text: 'Porque le quita tiempo de CPU a los hilos del sistema de ratón, teclado y disco, pudiendo congelar completamente la PC si el proceso falla.', isCorrect: true, feedback: '¡Exacto! Realtime pasa por encima de la entrada/salida esencial del sistema.' },
        { id: 'opt2', text: 'Porque borra el registro.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Porque apaga el monitor.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PRIORITY_CONCEPT_VERIFIED',
      targetDescription: 'Análisis y advertencia sobre niveles de prioridad',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-14',
    code: '04.14',
    title: 'Command Line',
    subtitle: 'La columna indispensable para diferenciar ejecutables idénticos con diferentes argumentos',
    tabOrMetric: 'Columna Línea de comandos (Command Line)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Ves 10 procesos llamados `svchost.exe` o `cmd.exe`. ¿Cómo sabés qué hace cada uno? La columna Línea de comandos revela los parámetros exactos con los que fue lanzado.',
      mythVsTruth: {
        mentira: 'Ver varios procesos con el mismo nombre significa que están duplica dos por un virus.',
        verdad: 'Programas legítimos lanzan múltiples instancias del mismo ejecutable pasando parámetros diferentes en la línea de comandos.',
        comprobalo: 'Agregá la columna "Línea de comandos" en Detalles e inspecciona los argumentos de los procesos `svchost.exe`.',
      },
    },
    entende: {
      title: 'Análisis pericial de argumentos de línea de comandos',
      explanation: [
        'Responde a la pregunta: ¿Con qué ruta completa y qué flags/argumentos de inicio se ejecutó este proceso?',
        'Ejemplo en svchost:',
        '`C:\Windows\system32\svchost.exe -k LocalService -p -s LicenseManager`',
        'Revela exactamente que esa instancia corresponde al Servicio de licencias de Windows.',
      ],
      whatQuestionItAnswers: '¿Cuáles son los argumentos y parámetros de inicio exactos de un ejecutable?',
      keyMetricToWatch: 'Parámetros e instrucciones cargadas en la línea de comandos.',
    },
    profundiza: {
      title: 'Detección de comandos sospechosos codificados',
      technicalDetails: [
        'Atacantes suelen invocar `powershell.exe -ExecutionPolicy Bypass -EncodedCommand <Base64>`.',
        'Habilitar la columna Línea de comandos te permite copiar ese texto codificado y decodificarlo para ver la intención real.',
      ],
      lowLevelNote: 'Extraído del bloque PEB (Process Environment Block) de la memoria del proceso.',
      nextToolToOpen: 'Para analizar argumentos codificados en Base64, usá consolas de decodificación de texto o PowerShell.',
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar la columna Línea de comandos de svchost.exe',
      steps: [
        'Abrí Task Manager y ve a "Detalles".',
        'Asegurate de tener visible la columna "Línea de comandos".',
        'Buscá cualquier proceso `svchost.exe` y leé los parámetros que siguen al nombre del archivo.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Detalles -> Command Line',
      expectedVisual: 'Columna con rutas completas entre comillas y flags de argumentos de inicio.',
    },
    comprobalo: {
      instruction: 'Inspección de la línea de comandos.',
      actionPrompt: 'Verificá los parámetros de svchost.exe.',
      validationKey: 'COMMANDLINE_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Ves un proceso `powershell.exe` ejecutando el argumento `-EncodedCommand`. ¿Qué columna de Task Manager te permite leer este texto para analizarlo?',
      instruction: 'Elegí la columna adecuada.',
      options: [
        { id: 'opt1', text: 'Línea de comandos (Command Line)', isCorrect: true, feedback: '¡Correcto! Muestra los flags completos pasados al ejecutable.' },
        { id: 'opt2', text: 'PID', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Prioridad', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'COMMANDLINE_CONCEPT_VERIFIED',
      targetDescription: 'Uso de la columna Línea de comandos para auditoría',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-15',
    code: '04.15',
    title: 'Working Set',
    subtitle: 'Conjunto de trabajo de memoria: La cantidad de memoria RAM física asignada actualmente en chips',
    tabOrMetric: 'Métrica Working Set (Lote de trabajo)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Es lo que la mayoría de la gente llama "Uso de memoria RAM". Es la cantidad exacta de memoria RAM física que el proceso tiene mapeada en los módulos de hardware.',
      mythVsTruth: {
        mentira: 'El Working Set es la cantidad total de memoria reservada por el programa.',
        verdad: 'El Working Set es sólo la porción de memoria activa en chips de RAM física. Si el sistema necesita RAM, Windows puede recortar el Working Set enviándolo al disco.',
        comprobalo: 'Agregá las columnas "Conjunto de trabajo (memoria)" y "Memoria privada" en la pestaña Detalles de Task Manager.',
      },
    },
    entende: {
      title: 'Definición de Lote de Trabajo (Working Set)',
      explanation: [
        'Responde a la pregunta: ¿Cuántos Megabytes de chips de memoria RAM física está ocupando esta app ahora mismo?',
        'Se divide en: Working Set Privado (sólo usado por esta app) y Working Set Compartido (DLLs compartidas con otros procesos).',
      ],
      whatQuestionItAnswers: '¿Cuánta memoria física real ocupa el proceso en los módulos RAM del equipo?',
      keyMetricToWatch: 'Consumo en MB/GB de Conjunto de trabajo.',
    },
    profundiza: {
      title: 'El proceso de Recorte de Lote de Trabajo (Working Set Trimming)',
      technicalDetails: [
        'Cuando minimizás una aplicación durante horas, el gestor de memoria de Windows (Memory Manager) reduce su Working Set para dejar RAM libre a las apps activas.',
        'Al restaurar la ventana, la app experimenta pequeñas pausas mientras vuelve a cargar sus páginas desde el disco a la RAM física.',
      ],
      lowLevelNote: 'Administrado por el hilo recortador de páginas del kernel (Balance Set Manager).',
      nextToolToOpen: 'Para analizar en detalle el mapa de páginas de memoria, usá RAMMap (Sysinternals).',
    },
    miraloEnTuPc: {
      actionName: 'Agregar las columnas de memoria en Detalles',
      steps: [
        'Abrí Task Manager y ve a "Detalles".',
        'Hacé clic derecho en el encabezado -> "Seleccionar columnas".',
        'Marcá "Conjunto de trabajo (memoria)" [Working Set] y aceptá.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Detalles -> Working Set',
      expectedVisual: 'Columna con consumo de memoria en KB/MB.',
    },
    comprobalo: {
      instruction: 'Agregado de columna Working Set.',
      actionPrompt: 'Verificá el valor del Lote de trabajo.',
      validationKey: 'WORKINGSET_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Minimizás un programa durante 3 horas y ves que su memoria RAM física baja de 1 GB a 50 MB. ¿Qué hizo Windows?',
      instruction: 'Identificá el proceso del kernel.',
      options: [
        { id: 'opt1', text: 'Realizó un recorte de lote de trabajo (Working Set Trimming) para liberar RAM física a programas activos.', isCorrect: true, feedback: '¡Excelente! Mueve páginas inactivas al archivo de paginación o Standby list.' },
        { id: 'opt2', text: 'Borró el programa del disco.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Se reinició la placa de video.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WORKINGSET_CONCEPT_VERIFIED',
      targetDescription: 'Comprensión del Working Set de memoria',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-16',
    code: '04.16',
    title: 'Private Memory',
    subtitle: 'Memoria privada asignada que no puede ser compartida con ningún otro proceso',
    tabOrMetric: 'Métrica Memoria privada (Private Bytes)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Es la métrica más importante para detectar fugas de memoria (Memory Leaks). Representa la memoria exclusiva reservada por la aplicación que no comparte con nadie.',
      mythVsTruth: {
        mentira: 'Toda la memoria de una app se puede compartir con otros programas.',
        verdad: 'Las DLLs del sistema se comparten, pero los datos privados (variables, estructuras de datos del usuario) son estrictamente de Memoria Privada.',
        comprobalo: 'Agregá la columna "Memoria privada" en la pestaña Detalles y comparala con el Working Set.',
      },
    },
    entende: {
      title: 'Identificación de Fugas de Memoria (Memory Leaks)',
      explanation: [
        'Responde a la pregunta: ¿La aplicación está pidiendo memoria privada exclusiva sin liberarla jamás?',
        'Si la Memoria Privada crece sin parar de 200 MB a 5 GB mientras la app no hace nada nuevo, estás frente a un Memory Leak de código.',
      ],
      whatQuestionItAnswers: '¿Cuánta memoria exclusiva e ininterrumpida ha reservado este proceso?',
      keyMetricToWatch: 'Crecimiento sostenido de Memoria privada.',
    },
    profundiza: {
      title: 'Asignación de memoria privada en la API de Windows',
      technicalDetails: [
        'La memoria privada se reserva mediante llamadas a la API `VirtualAlloc` con el flag `MEM_COMMIT`.',
      ],
      lowLevelNote: 'Administrado por las tablas de páginas VAD (Virtual Address Descriptor) del proceso.',
      nextToolToOpen: 'Para analizar asignaciones de Heap y fugas de memoria en código, usá VMMap (Sysinternals).',
    },
    miraloEnTuPc: {
      actionName: 'Agregar la columna Memoria privada en Detalles',
      steps: [
        'Abrí Task Manager y ve a "Detalles".',
        'Hacé clic derecho en el encabezado -> "Seleccionar columnas".',
        'Marcá "Memoria privada" (Private Bytes) y aceptá.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Detalles -> Memoria privada',
      expectedVisual: 'Columna mostrando los KB/MB de memoria exclusiva de cada proceso.',
    },
    comprobalo: {
      instruction: 'Agregado de columna Memoria privada.',
      actionPrompt: 'Verificá el valor de Memoria privada.',
      validationKey: 'PRIVATEMEM_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué métrica de memoria es la más confiable para confirmar si una aplicación tiene una fuga de memoria (Memory Leak)?',
      instruction: 'Elegí la métrica correcta.',
      options: [
        { id: 'opt1', text: 'Memoria privada (Private Bytes) en crecimiento constante', isCorrect: true, feedback: '¡Impecable! Muestra la acumulación de reserva exclusiva de la app.' },
        { id: 'opt2', text: 'El nombre de la ventana', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'El porcentaje de batería', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PRIVATEMEM_CONCEPT_VERIFIED',
      targetDescription: 'Auditoría de Memoria privada e identificación de fugas',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-17',
    code: '04.17',
    title: 'Commit',
    subtitle: 'El límite de compromiso de memoria virtual (RAM Física + Archivo de Paginación)',
    tabOrMetric: 'Métrica Commit Charge (Carga comprometida)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Es el concepto más malentendido de la memoria en Windows. El límite de Commit representa la cantidad máxima de memoria virtual prometida que el sistema puede otorgar.',
      mythVsTruth: {
        mentira: 'Si tenés 16 GB de RAM física, el sistema sólo puede otorgar 16 GB de memoria a los programas.',
        verdad: 'Límite de Commit = RAM Física + Tamaño del archivo de paginación (pagefile.sys). Podés tener 16 GB RAM + 16 GB Pagefile = 32 GB Límite de Commit.',
        comprobalo: 'Ve a Rendimiento -> Memoria en Task Manager e inspeccioná el valor "Comprometida" (Commit charge e.g. 12/24 GB).',
      },
    },
    entende: {
      title: 'Compromiso vs Memoria Física Real',
      explanation: [
        'Responde a la pregunta: ¿Está el sistema a punto de quedarse sin memoria virtual prometida?',
        'Comprometida (Commit Charge): La memoria prometida que las apps han solicitado con garantía de respaldo.',
        'Límite de Commit: El techo máximo (RAM + Pagefile). Si la Carga comprometida llega al 100% del Límite de Commit, las aplicaciones colapsarán por falta de memoria (Out of Memory).',
      ],
      whatQuestionItAnswers: '¿Cuánto del presupuesto total de memoria virtual (RAM + Disco) está comprometido?',
      keyMetricToWatch: 'Relación entre Carga comprometida y Límite de Commit (ej. 18 / 20 GB).',
    },
    profundiza: {
      title: 'El mito de desactivar el Pagefile',
      technicalDetails: [
        'Si desactivás el archivo de paginación (`pagefile.sys = 0`), tu Límite de Commit pasa a ser idéntico a tu RAM física.',
        'Si una app pide compromiso de memoria que supera ese límite, Windows la matará o arrojará un colapso "Out of Memory" aunque tengas Gigabytes de RAM libres en reposo.',
      ],
      lowLevelNote: 'Respaldo del gestor de memoria virtual NT (MmCommitPage).',
      nextToolToOpen: 'Para ajustar el tamaño del archivo de paginación y subir el Límite de Commit, usá `sysdm.cpl`.',
    },
    miraloEnTuPc: {
      actionName: 'Revisar la memoria Comprometida en la pestaña Rendimiento',
      steps: [
        'Abrí Task Manager y ve a "Rendimiento".',
        'Hacé clic en "Memoria".',
        'Observá el campo "Comprometida" en la parte inferior (ej. 8,5/15,9 GB).',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Rendimiento -> Memoria',
      expectedVisual: 'Campo Comprometida mostrando X GB usados de Y GB de Límite total de Commit.',
    },
    comprobalo: {
      instruction: 'Verificación de la métrica Commit.',
      actionPrompt: 'Inspeccioná la memoria Comprometida.',
      validationKey: 'COMMIT_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿A qué equivale la fórmula matemática del Límite de Commit total de un sistema Windows?',
      instruction: 'Seleccioná la fórmula exacta.',
      options: [
        { id: 'opt1', text: 'RAM Física + Tamaño del archivo de paginación (pagefile.sys)', isCorrect: true, feedback: '¡Matemática de kernel exacta! Define el techo total de memoria virtual garantizada.' },
        { id: 'opt2', text: 'RAM Física x 10', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Espacio libre en el pendrive', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'COMMIT_CONCEPT_VERIFIED',
      targetDescription: 'Análisis del Límite de Commit de memoria virtual',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-18',
    code: '04.18',
    title: 'CPU global vs hilo saturado',
    subtitle: 'Por qué un porcentaje bajo de uso global de CPU puede ocultar una aplicación colapsada',
    tabOrMetric: 'Métrica Saturación de Hilo de CPU',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Ves que la CPU global de la PC marca sólo un tranquilo 10%, pero tu programa de edición o juego está totalmente congelado. ¿Por qué?',
      mythVsTruth: {
        mentira: 'Si la CPU marca menos del 50% de uso global, el procesador no puede ser el causante de la lentitud.',
        verdad: 'Si el programa depende de 1 solo hilo y ese hilo está saturando al 100% 1 núcleo de una CPU de 16 hilos, el uso global marcará sólo 6.25% mientras la app está colapsada.',
        comprobalo: 'Cambiá el gráfico de CPU a Procesadores Lógicos en Rendimiento para detectar si 1 núcleo está al máximo.',
      },
    },
    entende: {
      title: 'Saturación Monohilo (Single-Thread Bottleneck)',
      explanation: [
        'Responde a la pregunta: ¿Un núcleo individual de CPU está funcionando al 100% aunque el promedio de todos los núcleos parezca bajo?',
        'Fórmula de peso por hilo en CPU de N hilos lógicos = 100% / N.',
        'En una CPU de 8 hilos, 1 hilo al 100% = 12.5% global.',
        'En una CPU de 16 hilos, 1 hilo al 100% = 6.25% global.',
        'En una CPU de 32 hilos, 1 hilo al 100% = 3.12% global.',
      ],
      whatQuestionItAnswers: '¿Está el rendimiento limitado por la velocidad monohilo de un solo núcleo?',
      keyMetricToWatch: 'Saturación al 100% de un procesador lógico individual.',
    },
    profundiza: {
      title: 'Límites de paralelización de código',
      technicalDetails: [
        'No todo el código se puede dividir en múltiples núcleos (Ley de Amdahl). Tareas secuenciales dependen exclusivamente del reloj monohilo (IPC) de ese núcleo.',
      ],
      lowLevelNote: 'Planificado por el Scheduler del kernel distribuido por Afinidad.',
      nextToolToOpen: 'Para verificar qué hilo interno del proceso causa el consumo del núcleo, usá Process Explorer.',
    },
    miraloEnTuPc: {
      actionName: 'Observar los procesadores lógicos individuales en Rendimiento',
      steps: [
        'Abrí Task Manager y ve a "Rendimiento" -> "CPU".',
        'Hacé clic derecho sobre el gráfico -> "Cambiar gráfico a" -> "Procesadores lógicos".',
        'Observá si uno de los cuadros está más lleno o más oscuro que los demás.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Rendimiento -> Procesadores lógicos',
      expectedVisual: 'Cuadrícula de núcleos individuales donde uno puede mostrar saturación mientras los demás están libres.',
    },
    comprobalo: {
      instruction: 'Inspección de procesadores lógicos.',
      actionPrompt: 'Verificá si hay núcleos saturados individualmente.',
      validationKey: 'THREAD_SATURATION_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'En un procesador de 16 hilos lógicos, un programa monohilo saturado consume un núcleo completo. ¿Qué uso de CPU global registrará la barra principal de Task Manager?',
      instruction: 'Calculá el porcentaje.',
      options: [
        { id: 'opt1', text: '6.25% (100% / 16 hilos = 6.25%)', isCorrect: true, feedback: '¡Excelente! Revela cómo un uso de CPU aparentemente bajo oculta la saturación de un hilo.' },
        { id: 'opt2', text: '100% global', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: '50% global', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'THREAD_SATURATION_CONCEPT_VERIFIED',
      targetDescription: 'Análisis de saturación de hilos individuales vs uso de CPU global',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-19',
    code: '04.19',
    title: 'Disco 100%',
    subtitle: 'Tiempo activo % vs Ancho de banda MB/s, latencia en ms y cola de disco',
    tabOrMetric: 'Métrica Active Time / Response Time',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Ves "Disco 100%" en rojo pero la velocidad de lectura dice apenas 2 MB/s. ¿Por qué un disco dice estar al 100% si no está transfiriendo muchos datos?',
      mythVsTruth: {
        mentira: 'Un porcentaje de "Disco 100%" en Task Manager significa que el disco está transfiriendo a su máxima velocidad de Megabytes por segundo.',
        verdad: 'El porcentaje de Disco en Task Manager mide TIEMPO ACTIVO (Active Time) no velocidad MB/s. Miles de pequeñas lecturas aleatorias saturan el tiempo activo con apenas 1 MB/s.',
        comprobalo: 'Revisá la pestaña Rendimiento -> Disco e inspeccioná las métricas "Tiempo activo" y "Tiempo de respuesta".',
      },
    },
    entende: {
      title: 'Métricas de saturación de almacenamiento',
      explanation: [
        'Responde a la pregunta: ¿Por qué el disco está trabando el sistema si no se ven transferencias de archivos grandes?',
        '1) Tiempo activo (%): Porcentaje de tiempo que la controladora de disco estuvo ocupada procesando peticiones.',
        '2) Tiempo de respuesta (ms): Latencia promedio de atención por cada operación E/S (Valores normales SSD < 5 ms; Alerta > 50 ms).',
        '3) Velocidad de lectura/escritura (MB/s): Ancho de banda de datos transferido.',
      ],
      whatQuestionItAnswers: '¿El disco está saturado por latencia de peticiones pequeñas o por velocidad masiva de datos?',
      keyMetricToWatch: 'Tiempo de respuesta en ms y tipo de operaciones (Lecturas aleatorias 4K).',
    },
    profundiza: {
      title: 'Diferencia entre HDD mecánico y SSD NVMe frente a peticiones aleatorias',
      technicalDetails: [
        'Un disco rígido mecánico (HDD) tarda ~15 ms en mover su cabezal físico para cada pequeña lectura aleatoria (Baja velocidad IOPS). 100 pequeñas peticiones saturan el tiempo activo al 100% con 1 MB/s.',
        'Un SSD procesa decenas de miles de IOPS en paralelo sin partes móviles.',
      ],
      lowLevelNote: 'Gobernado por la cola de peticiones I/O del controlador de almacenamiento (Storport).',
      nextToolToOpen: 'Para ver las rutas de los archivos exactos que causan el 100% de tiempo activo de disco, abrí Resource Monitor -> Pestaña Disco.',
    },
    miraloEnTuPc: {
      actionName: 'Revisar la latencia de respuesta del disco en Rendimiento',
      steps: [
        'Abrí Task Manager y ve a "Rendimiento" -> "Disco".',
        'Observá el valor "Tiempo de respuesta" expresado en milisegundos (ms).',
        'Observá la diferencia entre "Tiempo activo" (%) y "Velocidad de transferencia".',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Rendimiento -> Disco',
      expectedVisual: 'Gráfico de tiempo activo de disco con estadísticas de tiempo de respuesta en ms.',
    },
    comprobalo: {
      instruction: 'Inspección de métricas de disco.',
      actionPrompt: 'Verificá el tiempo de respuesta en ms.',
      validationKey: 'DISK_SATURATION_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un disco HDD mecánico muestra "Disco 100%" en rojo pero la velocidad de lectura es de apenas 1.5 MB/s. ¿Cuál es la causa técnica?',
      instruction: 'Elegí la causa técnica.',
      options: [
        { id: 'opt1', text: 'El disco está saturado por latencia en el tiempo activo realizando miles de pequeñas operaciones aleatorias 4K en diferentes sectores del plato.', isCorrect: true, feedback: '¡Impecable análisis! La latencia del cabezal físico satura el tiempo activo sin lograr alto ancho de banda.' },
        { id: 'opt2', text: 'El cable USB está al revés.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'La pantalla está sucia.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'DISK_SATURATION_CONCEPT_VERIFIED',
      targetDescription: 'Análisis de Tiempo activo vs Ancho de banda en discos',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-20',
    code: '04.20',
    title: 'GPU Engine',
    subtitle: 'Monitoreo de motores independientes de la tarjeta de video: 3D, Copy, Video Decode, Video Encode y Compute',
    tabOrMetric: 'Métrica Motores de GPU (GPU Engines)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Tu placa de video no es un solo bloque masivo; contiene motores especializados independientes para gráficos 3D, decodificación de video, codificación y cálculo.',
      mythVsTruth: {
        mentira: 'Si la barra de uso de GPU marca 15% en un video de YouTube, la placa de video no está haciendo nada.',
        verdad: 'El motor 3D puede estar al 0% mientras que el motor "Video Decode" está trabajando al 80% procesando el codec AV1/HEVC en hardware dedicado.',
        comprobalo: 'Abrí Rendimiento -> GPU en Task Manager y cambiá los nombres de los gráficos haciéndolos clic en sus títulos.',
      },
    },
    entende: {
      title: 'Los Motores Especializados de la GPU',
      explanation: [
        'Responde a la pregunta: ¿Qué módulo específico de la tarjeta de video está siendo utilizado por las aplicaciones?',
        '1) 3D: Motores de renderizado de juegos y modelado tridimensional.',
        '2) Copy: Transferencias directas de memoria DMA entre RAM y VRAM.',
        '3) Video Decode: Decodificación por hardware de reproducciones de video (H.264, HEVC, AV1).',
        '4) Video Encode: Codificación por hardware para transmisión o grabación (NVENC, AMF, QuickSync).',
        '5) Compute / Cuda: Cálculo matemático de Inteligencia Artificial o procesamiento paralelo.',
      ],
      whatQuestionItAnswers: '¿Qué motor especializado de la placa gráfica está trabajando?',
      keyMetricToWatch: 'Utilización por cada motor individual de la GPU.',
    },
    profundiza: {
      title: 'Arquitectura WDDM (Windows Display Driver Model)',
      technicalDetails: [
        'El driver WDDM expone la telemetría de cada motor de GPU directamente al kernel de Windows sin necesidad de software de terceros.',
      ],
      lowLevelNote: 'Mapeado por el subsistema `dxgkrnl.sys` de DirectX.',
      nextToolToOpen: 'Para ver frecuencias de reloj de GPU, temperaturas o consumo de energía en vatios (W), usá utilidades de hardware especializadas de la placa de video.',
    },
    miraloEnTuPc: {
      actionName: 'Seleccionar diferentes motores en el gráfico de GPU',
      steps: [
        'Abrí Task Manager y ve a "Rendimiento" -> "GPU".',
        'Hacé clic en la flecha o título sobre cualquiera de los 4 pequeños gráficos de GPU.',
        'Seleccioná otro motor como "Video Decode", "Video Encode" o "Compute".',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Rendimiento -> GPU',
      expectedVisual: 'Gráficos individuales para 3D, Video Decode, Copy y Compute.',
    },
    comprobalo: {
      instruction: 'Inspección de motores de GPU.',
      actionPrompt: 'Verificá los diferentes motores gráficos.',
      validationKey: 'GPU_ENGINES_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Estás transmitiendo en vivo en Twitch y querés saber si la codificación de video está usando la GPU sin saturar el motor de juegos 3D. ¿Qué motor debes mirar?',
      instruction: 'Seleccioná el motor correcto.',
      options: [
        { id: 'opt1', text: 'Video Encode (o NVENC / AMF)', isCorrect: true, feedback: '¡Correcto! Es el motor dedicado exclusivamente a la compresión de video en tiempo real.' },
        { id: 'opt2', text: 'Disco C:', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Teclado USB', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'GPU_ENGINES_CONCEPT_VERIFIED',
      targetDescription: 'Identificación de motores de GPU en Task Manager',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-21',
    code: '04.21',
    title: 'Dedicated vs Shared GPU Memory',
    subtitle: 'Diferencia entre Memoria gráfica dedicada (VRAM real) y Memoria compartida de sistema',
    tabOrMetric: 'Métrica VRAM Dedicada vs Compartida',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Tu placa de video dice tener "12 GB de memoria de video total". Pero al abrir un juego pesado, empieza a dar tirones cuando supera los 4 GB. ¿Por qué?',
      mythVsTruth: {
        mentira: 'La Memoria de GPU compartida es tan rápida y eficiente como la VRAM física dedicada de la placa de video.',
        verdad: 'La Memoria dedicada (VRAM) son chips de ultravelocidad soldados en la placa gráfica (GDDR6). La Memoria compartida es un préstamo de la RAM del sistema que viaja por el bus PCIe mucho más lento.',
        comprobalo: 'Revisá la pestaña GPU en Rendimiento y compará la línea "Memoria de GPU dedicada" con "Memoria de GPU compartida".',
      },
    },
    entende: {
      title: 'Distinción entre VRAM Física y Préstamo de RAM',
      explanation: [
        'Responde a la pregunta: ¿Mi placa de video se quedó sin VRAM física real y está usando la RAM del sistema como auxilio lento?',
        '1) Memoria de GPU dedicada: VRAM física soldada en la placa gráfica (ej. 8 GB GDDR6).',
        '2) Memoria de GPU compartida: Hasta el 50% de la RAM del sistema asignado como reserva de emergencia.',
        '3) Memoria de GPU total: La suma de ambas.',
      ],
      whatQuestionItAnswers: '¿El juego o aplicación 3D superó la VRAM física de la placa gráfica?',
      keyMetricToWatch: 'Consumo de Memoria de GPU dedicada cercano al 100%.',
    },
    profundiza: {
      title: 'El fenómeno de desbordamiento de VRAM (VRAM Paging / Stuttering)',
      technicalDetails: [
        'Cuando un juego llena la VRAM dedicada (ej. usa 8.1 GB en una GPU de 8 GB), el driver de video mueve las texturas sobrantes a la Memoria compartida.',
        'Esto causa caídas brutales de cuadros por segundo (Stuttering) debido a la latencia del bus PCIe.',
      ],
      lowLevelNote: 'Gobernado por la gestión de memoria de video de WDDM.',
      nextToolToOpen: 'Para reducir el uso de VRAM dedicada, ajustá la calidad de texturas en las opciones gráficas del juego.',
    },
    miraloEnTuPc: {
      actionName: 'Revisar los campos de memoria de GPU en Rendimiento',
      steps: [
        'Abrí Task Manager y ve a "Rendimiento" -> "GPU".',
        'Observá la sección inferior donde muestra "Memoria de GPU dedicada" y "Memoria de GPU compartida".',
        'Verificá cuánta VRAM física dedicada tiene tu tarjeta.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Rendimiento -> GPU',
      expectedVisual: 'Estadísticas de memoria dedicada (VRAM) y memoria compartida asignada.',
    },
    comprobalo: {
      instruction: 'Inspección de memoria de GPU.',
      actionPrompt: 'Verificá el valor de VRAM dedicada.',
      validationKey: 'GPU_MEMORY_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué ocurre con los cuadros por segundo (FPS) en un juego si la Memoria de GPU dedicada se llena por completo y empieza a usar masivamente la Memoria compartida?',
      instruction: 'Seleccioná la consecuencia real.',
      options: [
        { id: 'opt1', text: 'Aparecen tirones brutales (Stuttering) y caídas de FPS por la latencia más lenta del bus PCIe y la RAM de sistema.', isCorrect: true, feedback: '¡Impecable! La RAM del sistema es mucho más lenta que la VRAM GDDR6 dedicada.' },
        { id: 'opt2', text: 'Los juegos se ven con más colores.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'opt3', text: 'Aumenta la velocidad de la red Wi-Fi.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'GPU_MEMORY_CONCEPT_VERIFIED',
      targetDescription: 'Comprensión de VRAM Dedicada vs Memoria Compartida',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-22',
    code: '04.22',
    title: 'Network usage',
    subtitle: 'Rastreo de transferencia de red en Mbps por proceso e identificación de límites',
    tabOrMetric: 'Métrica Ancho de banda de Red (Network Mbps)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Estás jugando en línea con PING alto o una descarga va lenta. La columna Red en Task Manager muestra qué proceso está consumiendo tu ancho de banda.',
      mythVsTruth: {
        mentira: 'Task Manager mide la velocidad de red en Megabytes por segundo (MB/s).',
        verdad: 'Las métricas de red en Task Manager e interfaces de red se miden en Megabits por segundo (Mbps). 8 Megabits (Mb) equivalen a 1 Megabyte (MB).',
        comprobalo: 'Revisá la columna "Red" en Procesos o la gráfica Wi-Fi/Ethernet en Rendimiento.',
      },
    },
    entende: {
      title: 'Monitoreo de Tráfico por Proceso',
      explanation: [
        'Responde a la pregunta: ¿Qué programa está saturando la conexión de red en este instante?',
        'Muestra la velocidad instantánea de envío y recepción por proceso.',
        'Muestra el adaptador activo y la dirección IP actual en la pestaña Rendimiento.',
      ],
      whatQuestionItAnswers: '¿Qué proceso está transmitiendo o recibiendo datos por la red ahora mismo?',
      keyMetricToWatch: 'Consumo en Mbps en la columna Red.',
    },
    profundiza: {
      title: 'Límites del rastreo de red en Task Manager',
      technicalDetails: [
        'Task Manager muestra la velocidad agregada en Mbps, pero no indica con qué dirección IP remota ni con qué puerto TCP/UDP se está comunicando el proceso.',
      ],
      lowLevelNote: 'Rastreado por la API ETW (Event Tracing for Windows) del kernel.',
      nextToolToOpen: 'Para ver las direcciones IP remotas, puertos y sockets activos de un proceso, abrí Resource Monitor -> Pestaña Red.',
    },
    miraloEnTuPc: {
      actionName: 'Ordenar procesos por la columna Red',
      steps: [
        'Abrí Task Manager y ve a la pestaña "Procesos".',
        'Hacé clic en el encabezado de la columna "Red" para ordenar de mayor a menor consumo de red.',
        'Observá qué proceso está encabezando la lista.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Procesos -> Red',
      expectedVisual: 'Lista de procesos ordenada por la columna Red en Mbps.',
    },
    comprobalo: {
      instruction: 'Ordenamiento por la columna Red.',
      actionPrompt: 'Verificá los procesos con tráfico de red.',
      validationKey: 'NETWORK_USAGE_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'La pestaña Rendimiento -> Ethernet muestra que la placa de red está recibiendo 80 Mbps. ¿A cuántos Megabytes por segundo (MB/s) equivale de descarga real?',
      instruction: 'Convertí Mbps a MB/s.',
      options: [
        { id: 'opt1', text: '10 MB/s (80 Mbps / 8 bits por byte = 10 MB/s)', isCorrect: true, feedback: '¡Excelente conversión! 8 Megabits equivalen a 1 Megabyte.' },
        { id: 'opt2', text: '80 MB/s', isCorrect: false, feedback: 'Incorrecto: Confunde Megabits con Megabytes.' },
        { id: 'opt3', text: '800 MB/s', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'NETWORK_USAGE_CONCEPT_VERIFIED',
      targetDescription: 'Análisis de tráfico de red y conversión de Mbps a MB/s',
      defaultProvenance: 'OBSERVED',
    },
  },
  {
    id: 'inv-04-23',
    code: '04.23',
    title: 'Detectar procesos sospechosos sin inventar malware',
    subtitle: 'La metodología defensiva de 8 pasos para auditar procesos desconocidos con rigor pericial',
    tabOrMetric: 'Metodología Defensiva de Auditoría',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Ves un proceso con un nombre raro consumiendo CPU. ¿Cómo determinas si es un componente legítimo de Windows o un software no deseado sin caer en el pánico?',
      mythVsTruth: {
        mentira: 'Si un proceso tiene un nombre extraño en inglés o no tiene icono bonito, es un virus y hay que borrarlo.',
        verdad: 'Muchos servicios legítimos del sistema y controladores tienen nombres técnicos raros. RARO NO SIGNIFICA MALWARE.',
        comprobalo: 'Aplica el protocolo defensivo de 8 pasos sobre cualquier proceso en la pestaña Detalles.',
      },
    },
    entende: {
      title: 'El Protocolo Defensivo de 8 Pasos',
      explanation: [
        'Aplica la siguiente secuencia ordenada de comprobación pericial:',
        '1) NOMBRE: ¿Tiene un nombre de ejecutable conocido o finge ser uno del sistema?',
        '2) RUTA: ¿El archivo reside en C:\Windows\System32 o en C:\Users\<Usuario>\AppData\Local\Temp?',
        '3) FIRMA: ¿Está firmado digitalmente por un editor de confianza (Microsoft, Intel, Google)?',
        '4) PUBLISHER: ¿Quién es el fabricante oficial en las propiedades del archivo?',
        '5) COMMAND LINE: ¿Qué argumentos de inicio recibió en la línea de comandos?',
        '6) PARENT: ¿Quién es su proceso padre en el árbol (PPID)?',
        '7) ACTIVIDAD: ¿Qué hace en disco y red según Resource Monitor?',
        '8) CONTEXTO: ¿Inició al abrir una app específica o corre solo desde el arranque?',
      ],
      whatQuestionItAnswers: '¿Es este proceso legítimo o presenta anomalías de ruta, firma o comportamiento?',
      keyMetricToWatch: 'Firma digital del ejecutable y Ruta física en disco.',
    },
    profundiza: {
      title: 'Verificación de Firma Digital en el archivo `.exe`',
      technicalDetails: [
        'Hacer clic derecho en el proceso en Detalles -> "Abrir ubicación del archivo" -> Clic derecho en el ejecutable `.exe` -> Propiedades -> pestaña "Firmas digitales".',
        'Si el archivo afirma ser de Microsoft pero NO tiene pestaña de Firmas digitales o la firma es inválida, se confirma la anomalía.',
      ],
      lowLevelNote: 'Verificado por el subsistema WinVerifyTrust de Windows.',
      nextToolToOpen: 'Para subir el archivo a análisis multiantivirus en la nube, usá la opción "Buscar en línea" o VirusTotal.',
    },
    miraloEnTuPc: {
      actionName: 'Verificar la Firma Digital de un ejecutable de sistema',
      steps: [
        'En Task Manager -> Detalles, hacé clic derecho en `explorer.exe` -> "Abrir ubicación del archivo".',
        'En el Explorador, hacé clic derecho en `explorer.exe` -> "Propiedades".',
        'Hacé clic en la pestaña "Firmas digitales" y verificá el certificado de Microsoft Windows.',
      ],
      commandOrPath: 'taskmgr.exe',
      shortcut: 'Ctrl + Shift + Esc -> Detalles -> Propiedades',
      expectedVisual: 'Ventana de propiedades del ejecutable mostrando el certificado digital firmado por Microsoft.',
    },
    comprobalo: {
      instruction: 'Verificación de firma digital de ejecutable.',
      actionPrompt: 'Auditá la firma digital de explorer.exe.',
      validationKey: 'SUSPICIOUS_AUDIT_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Encontrás un proceso llamado `svchost.exe` pero su ruta física es `C:\Users\Lucas\AppData\Local\Temp\svchost.exe`. Aplicando la regla de RUTA, ¿cuál es el diagnóstico?',
      instruction: 'Seleccioná el veredicto pericial.',
      options: [
        { id: 'opt1', text: 'Es un proceso malicioso camuflado. El svchost.exe legítimo del sistema DEBE residir exclusivamente en C:\Windows\System32.', isCorrect: true, feedback: '¡Excelente veredicto! La regla de RUTA es concluyente: un svchost fuera de System32 es una anomalía grave.' },
        { id: 'opt2', text: 'Es un archivo normal de Windows.', isCorrect: false, feedback: 'Incorrecto: svchost jamás debe correr desde la carpeta Temp de un usuario.' },
        { id: 'opt3', text: 'Es un archivo de música.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'AUDIT_METHODOLOGY_VERIFIED',
      targetDescription: 'Aplicación del protocolo defensivo de 8 pasos para auditoría de procesos',
      defaultProvenance: 'OBSERVED',
    },
  },
];

// 5 MINICASOS FORENSES DE SECTOR 04
export const SECTOR_04_MINICASES: Sector04MiniCase[] = [
  {
    id: 'case-04-a',
    code: 'CASO 04-A',
    title: 'El misterio de la CPU al 100% que no se veía en Procesos',
    scenario: 'Un usuario siente el ventilador de la laptop al máximo. Abre Task Manager en la pestaña Procesos y ve la CPU global al 100%, pero la lista de procesos ordenados no suma más del 20%.',
    userStatement: '“Task Manager me dice que la CPU está al 100% pero no me muestra qué programa se la está comiendo.”',
    initialMistake: 'Pensar que Task Manager está roto o infectado.',
    diagnosticQuestion: '¿A qué pestaña debés ir para ver todos los procesos en plano sin agrupamientos comerciales y con la columna de todos los usuarios e hilos?',
    options: [
      {
        id: 'c4_a1',
        text: 'Pestaña Detalles (Details) y marcar "Mostrar procesos de todos los usuarios".',
        isCorrect: true,
        explanation: 'En la pestaña Detalles ves cada PID individual corriendo bajo la cuenta SYSTEM u otros usuarios que consumían la CPU.',
      },
      {
        id: 'c4_a2',
        text: 'Pestaña Historial de aplicaciones',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'La pestaña Detalles reveló que un proceso de actualización en segundo plano bajo la cuenta SYSTEM (`TiWorker.exe`) estaba consumiendo el 80% restante de la CPU.',
    lessonLearned: 'Usa siempre la pestaña Detalles para ver la totalidad de procesos sin filtros de interfaz comercial.',
  },
  {
    id: 'case-04-b',
    code: 'CASO 04-B',
    title: 'El juego que va a tirones con 16 GB de RAM',
    scenario: 'Un usuario con 16 GB de RAM abre un juego pesado. En Rendimiento -> Memoria ve "En uso: 12 GB", pero el juego sufre tirones constantes (Stuttering). Se va a la GPU y ve la VRAM Dedicada al 100%.',
    userStatement: '“Tengo 16 GB de RAM libre pero el juego se traba a cada rato.”',
    initialMistake: 'Creer que le falta memoria RAM de sistema.',
    diagnosticQuestion: '¿Qué tipo de memoria se agotó en realidad obligando al sistema a usar la Memoria de GPU compartida a través del bus PCIe?',
    options: [
      {
        id: 'c4_b1',
        text: 'La Memoria de GPU dedicada (VRAM física de la tarjeta de video).',
        isCorrect: true,
        explanation: 'Al desbordarse la VRAM dedicada de la GPU, las texturas se envían a la RAM compartida por PCIe, causando caídas de cuadros.',
      },
      {
        id: 'c4_b2',
        text: 'El tamaño de la fuente de la pantalla',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'La placa de video de 4 GB de VRAM intentaba cargar 6 GB de texturas del juego. Reducir la calidad de texturas en el menú del juego solucionó el problema.',
    lessonLearned: 'Diferenciá siempre Memoria RAM de sistema de la Memoria de GPU dedicada (VRAM).',
  },
  {
    id: 'case-04-c',
    code: 'CASO 04-C',
    title: 'El script malicioso en la carpeta Temp',
    scenario: 'Durante una auditoría de rutina, un técnico nota un proceso `svchost.exe` consumiendo 40% de CPU en un equipo.',
    userStatement: '“Es un proceso de Windows así que es seguro.”',
    initialMistake: 'Confiar ciegamente en el nombre `svchost.exe` sin revisar la columna Línea de comandos ni la Ruta física.',
    diagnosticQuestion: 'Al agregar la columna Línea de comandos en Detalles, ves `C:\Users\Admin\AppData\Local\Temp\svchost.exe --miner`. ¿Qué confirma este hallazgo?',
    options: [
      {
        id: 'c4_c1',
        text: 'Es un malware (criptomnero) camuflado con el nombre de un proceso de Windows corriendo desde la carpeta Temp.',
        isCorrect: true,
        explanation: 'La regla de RUTA es concluyente: el svchost legítimo debe ejecutarse únicamente desde C:\Windows\System32.',
      },
      {
        id: 'c4_c2',
        text: 'Es una actualización oficial de Microsoft Windows.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Aplicando el protocolo de 8 pasos (Nombre, Ruta, Firma), la ruta en Temp y el flag `--miner` confirmaron un ejecutable malicioso.',
    lessonLearned: 'Ruta y Línea de comandos son la prueba reina para detectar procesos camuflados.',
  },
  {
    id: 'case-04-d',
    code: 'CASO 04-d',
    title: 'El error de Prioridad en Tiempo Real',
    scenario: 'Un usuario cambió la prioridad de su juego favorito a "Tiempo real" (Realtime) en Task Manager creyendo que ganaría más FPS. A los 5 minutos el juego se congeló y la pantalla no responde a ningún comando de mouse ni teclado.',
    userStatement: '“La PC se congeló por completo y el ratón no se mueve.”',
    initialMistake: 'Usar prioridad Realtime en una aplicación de usuario.',
    diagnosticQuestion: '¿Por qué la prioridad "Tiempo real" provocó la parálisis total de la entrada del ratón y teclado?',
    options: [
      {
        id: 'c4_d1',
        text: 'Porque el nivel Realtime (24) pasa por encima de los hilos de controladores de entrada (mouse/teclado) e I/O del sistema.',
        isCorrect: true,
        explanation: 'Al colapsar el juego en Realtime, monopoliza la CPU sin permitir que los hilos de periféricos procesen eventos.',
      },
      {
        id: 'c4_d2',
        text: 'Porque se descargó la batería del mouse.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'El juego en prioridad Realtime dejó sin ciclos de CPU al driver del mouse. Se requirió reinicio forzado.',
    lessonLearned: 'Jamás asignes prioridad Tiempo real a aplicaciones de usuario.',
  },
  {
    id: 'case-04-e',
    code: 'CASO 04-e',
    title: 'El pánico de la memoria Comprometida',
    scenario: 'Un diseñador gráfico abre varios proyectos pesados. La RAM física de 16 GB muestra 15.5 GB usados y aparece una advertencia de sistema: "Se está quedando sin memoria". En Rendimiento ve Comprometida 31/32 GB.',
    userStatement: '“Tengo 16 GB de RAM y el sistema me dice que está usando 31 GB de memoria.”',
    initialMistake: 'Creer que el contador de memoria está inventando números imposibles.',
    diagnosticQuestion: '¿Qué representa la cifra 31/32 GB en el campo Comprometida?',
    options: [
      {
        id: 'c4_e1',
        text: 'La suma de la RAM física más el archivo de paginación (Límite de Commit total de memoria virtual garantizada).',
        isCorrect: true,
        explanation: 'Carga comprometida = RAM física + Pagefile. Ocupó casi el 100% de la memoria virtual combinada.',
      },
      {
        id: 'c4_e2',
        text: 'La velocidad de la placa de red Wi-Fi.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Las aplicaciones reservaron 31 GB de memoria virtual sumando RAM y Pagefile, estando al borde de agotar el Límite de Commit.',
    lessonLearned: 'Commit Charge mide la promesa total de memoria virtual entre RAM y disco.',
  },
];

// BANCO DE PREGUNTAS DEL TEST DE SECTOR 04
export const SECTOR_04_TEST_BANK: Sector04TestQuestion[] = [
  {
    id: 't04-q01',
    questionNumber: 1,
    category: 'CONCEPTOS_PROCESOS',
    scenario: 'Querés saber qué aplicación lanzó la ejecución de un proceso hijo determinado.',
    question: '¿Qué identificador representa al proceso padre?',
    options: [
      { id: 'o04_1', text: 'PPID (Parent Process Identifier)', isCorrect: true, technicalJustification: 'PPID identifica al proceso que creó la instancia hija.' },
      { id: 'o04_2', text: 'PID', isCorrect: false, technicalJustification: 'PID es el ID del proceso propio, no del padre.' },
      { id: 'o04_3', text: 'VRAM', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o04_4', text: 'GUID', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
  {
    id: 't04-q02',
    questionNumber: 2,
    category: 'GESTIÓN_MEMORIA',
    scenario: '¿Cuál es la fórmula matemática exacta que define el Límite de Commit total de memoria en Windows?',
    question: 'Elegí la fórmula correcta.',
    options: [
      { id: 'o04_5', text: 'RAM Física + Tamaño del archivo de paginación (pagefile.sys)', isCorrect: true, technicalJustification: 'El Límite de Commit combina memoria RAM y archivo de paginación.' },
      { id: 'o04_6', text: 'RAM Física x 2', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o04_7', text: 'VRAM + Caché de navegador', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o04_8', text: 'EVIDENCIA INSUFICIENTE', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
  {
    id: 't04-q03',
    questionNumber: 3,
    category: 'METODOLOGÍA_DEFENSIVA',
    scenario: 'Observás un proceso llamado `svchost.exe` corriendo desde la carpeta `C:\\Users\\Public\\Downloads`.',
    question: 'Aplicando las reglas de auditoría pericial, ¿cuál es el veredicto?',
    options: [
      { id: 'o03_9_4', text: 'Es una anomalía grave / proceso malicioso. El svchost.exe legítimo debe estar únicamente en C:\\Windows\\System32.', isCorrect: true, technicalJustification: 'La regla de RUTA determina que svchost fuera de System32 no es un proceso legítimo de Windows.' },
      { id: 'o03_10_4', text: 'Es un archivo normal de descarga.', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_11_4', text: 'Es un archivo de imagen JPG.', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o03_12_4', text: 'No se puede saber.', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
  {
    id: 't04-q04',
    questionNumber: 4,
    category: 'SATURACIÓN_CPU',
    scenario: 'En un procesador de 4 núcleos (4 hilos lógicos), 1 hilo colapsa al 100%.',
    question: '¿Qué consumo global de CPU mostrará Task Manager?',
    options: [
      { id: 'o04_13', text: '25% (100% / 4 hilos = 25%)', isCorrect: true, technicalJustification: '1 hilo saturado en 4 hilos lógicos representa exactamente el 25% de la capacidad total de la CPU.' },
      { id: 'o04_14', text: '100% global', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o04_15', text: '50% global', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o04_16', text: '0%', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
  {
    id: 't04-q05',
    questionNumber: 5,
    category: 'DISCO_SATURACIÓN',
    scenario: '¿Qué métrica en la pestaña Rendimiento -> Disco indica la demora en milisegundos de atención de peticiones I/O?',
    question: 'Seleccioná la métrica.',
    options: [
      { id: 'o04_17', text: 'Tiempo de respuesta (Response Time in ms)', isCorrect: true, technicalJustification: 'Mide la latencia de respuesta del almacenamiento por cada operación de E/S.' },
      { id: 'o04_18', text: 'Letra de unidad', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o04_19', text: 'Velocidad de red Wi-Fi', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o04_20', text: 'Resolución de pantalla', isCorrect: false, technicalJustification: 'Incorrecto.' },
    ],
  },
];
