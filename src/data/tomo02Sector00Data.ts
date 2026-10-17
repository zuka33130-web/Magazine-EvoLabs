// TOMO 02: LA BIBLIA NEGRA DE WINDOWS // MENTIRA Y VERDAD
// SECTOR 00: DÍA CERO // ¿QUÉ WINDOWS TENÉS REALMENTE?

export type ProvenanceType =
  | 'USER_DECLARED'
  | 'SYSTEM_REPORTED'
  | 'OBSERVED'
  | 'MEASURED'
  | 'DERIVED'
  | 'SIMULATED'
  | 'UNKNOWN';

export type ChallengeType =
  | 'ORDER_SEQUENCE'
  | 'CLASSIFICATION'
  | 'MYTH_VS_TRUTH'
  | 'VARIABLE_RESOLVER'
  | 'INSUFFICIENT_EVIDENCE'
  | 'ERROR_ISOLATOR'
  | 'REASONING';

export interface Sector00Investigation {
  id: string;
  code: string; // e.g. "00.01"
  title: string;
  subtitle: string;
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
    diagramLabel?: string;
    diagramItems?: { label: string; desc: string; ringLevel?: string }[];
  };
  profundiza: {
    title: string;
    technicalDetails: string[];
    lowLevelNote?: string;
  };
  miraloEnTuPc: {
    actionName: string;
    steps: string[];
    commandOrPath?: string;
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
    options?: { id: string; text: string; isCorrect: boolean; feedback: string }[];
    sortableItems?: { id: string; text: string; correctIndex: number }[];
    classificationGroups?: {
      groupName: string;
      items: string[];
    }[];
  };
  evidencia: {
    fieldName: string;
    targetDescription: string;
    defaultProvenance: ProvenanceType;
    isCoreIdentityField?: boolean;
  };
}

export interface Sector00MiniCase {
  id: string;
  code: string; // e.g. "CASO 00-A"
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

export interface Sector00TestQuestion {
  id: string;
  questionNumber: number;
  category: 'IDENTIFICACIÓN' | 'ARQUITECTURA' | 'RUTAS_VARIABLES' | 'PRIVILEGIOS_UAC' | 'DIAGNÓSTICO';
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    technicalJustification: string;
  }[];
}

export interface PassportFieldData {
  fieldKey: string;
  label: string;
  value: string;
  source: string;
  provenance: ProvenanceType;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'DECLARED_ONLY';
  timestamp: string;
}

export interface Sector00Passport {
  passportId: string;
  edition: PassportFieldData;
  version: PassportFieldData;
  build: PassportFieldData;
  architecture: PassportFieldData;
  accountType: PassportFieldData;
  privilege: PassportFieldData;
  windowsPath: PassportFieldData;
  userProfile: PassportFieldData;
  systemDrive: PassportFieldData;
  computerName?: PassportFieldData;
  systemManufacturer?: PassportFieldData;
  systemModel?: PassportFieldData;
  bootMode?: PassportFieldData;
  secureBoot?: PassportFieldData;
  statusTag?: 'DATO REAL' | 'EJEMPLO' | 'NO DISPONIBLE' | 'DESCONOCIDO';
  baseline: {
    captured: boolean;
    timestamp: string;
    ramTotalGB: number | null;
    diskFreeGB: number | null;
    processCount: number | null;
    startupAppsCount: number | null;
    bootTimeSec: number | null;
  };
}

// 15 INVESTIGACIONES OFICIALES DE SECTOR 00
export const SECTOR_00_INVESTIGATIONS: Sector00Investigation[] = [
  {
    id: 'inv-00-01',
    code: '00.01',
    title: 'Qué es realmente un sistema operativo',
    subtitle: 'La capa invisible entre el silicio y tus programas',
    descubri: {
      hook: 'Hacés doble clic en un icono y pensás que “Windows abrió el programa”. En realidad, el escritorio es sólo un proceso visual ordinario ejecutándose sobre capas silenciosas de drivers, servicios y un kernel implacable.',
      mythVsTruth: {
        mentira: '“Windows es la barra de tareas, los menús y las ventanas que veo en pantalla.”',
        verdad: 'Windows es el kernel NT, los controladores y los subsistemas que gestionan memoria y hardware. El escritorio (explorer.exe) es sólo una aplicación de interfaz.',
        comprobalo: 'Abrí el Administrador de Tareas y finalizá la tarea “Explorador de Windows”. Todo el escritorio desaparecerá, pero tus programas seguirán corriendo intactos.',
      },
    },
    entende: {
      title: 'Las 5 Capas de la Realidad en tu PC',
      explanation: [
        '1. Hardware Físico: El silicio, transistores, pistas PCIe y circuitos de memoria.',
        '2. Núcleo (Kernel NT): El cerebro invisible que habla con los circuitos y arbitra cada milisegundo de CPU.',
        '3. Servicios del Sistema: Procesos en segundo plano que gestionan redes, audio y almacenamiento.',
        '4. Shell Visual (Explorer.exe): El entorno gráfico con el que interactuás (escritorio, barra de tareas).',
        '5. Usuario & Aplicaciones: Vos y tus programas (navegador, juegos, herramientas de trabajo).',
      ],
      diagramLabel: 'JERARQUÍA ESTRUCTURAL DE CAPAS',
      diagramItems: [
        { label: 'USUARIO', desc: 'Interacción humana y comandos' },
        { label: 'APLICACIONES', desc: 'Software en espacio de usuario' },
        { label: 'SHELL (EXPLORER)', desc: 'Interfaz gráfica de escritorio' },
        { label: 'WINDOWS KERNEL & SERVICIOS', desc: 'Arbitraje de recursos y Ring 0' },
        { label: 'HARDWARE FÍSICO', desc: 'CPU, RAM, GPU, Chipset, Almacenamiento' },
      ],
    },
    profundiza: {
      title: 'Aislamiento de la Interfaz Gráfica',
      technicalDetails: [
        'En los años 90 (Windows 95/98), si la interfaz gráfica colapsaba, todo el sistema operativo caía con un pantallazo azul instantáneo.',
        'A partir de la arquitectura moderna de Windows NT, el subsistema visual (DWM y Explorer) corre desacoplado en Ring 3 (User Mode).',
        'Si explorer.exe sufre un cuelgue de memoria, el kernel NT continúa programando hilos y manteniendo conexiones de red activas.',
      ],
      lowLevelNote: 'TEASER SECTOR 32: El Kernel NT no tiene interfaz gráfica propia. Opera a través de llamadas nativas de sistema (Syscalls / NTDLL).',
    },
    miraloEnTuPc: {
      actionName: 'Comprobar que el escritorio es sólo un proceso',
      steps: [
        '1. Presioná Ctrl + Shift + Esc para abrir el Administrador de Tareas.',
        '2. Buscá “Explorador de Windows” en la pestaña Procesos.',
        '3. Hacé clic derecho y seleccioná “Reiniciar”. Observá cómo la pantalla parpadea pero tus apps abiertas no se cierran.',
      ],
      shortcut: 'Ctrl + Shift + Esc',
      expectedVisual: 'La barra de tareas desaparece por 1 segundo y se relanza sin reiniciar la PC.',
    },
    comprobalo: {
      instruction: 'Ordená las capas arquitectónicas desde el silicio más profundo hasta la persona frente a la pantalla.',
      actionPrompt: 'Validá el flujo de abstracción de hardware en el sistema operativo.',
      validationKey: 'LAYER_ORDER_VALID',
    },
    microdesafio: {
      type: 'ORDER_SEQUENCE',
      question: '¿Cuál es el orden jerárquico correcto desde el nivel más bajo (físico) hasta el más alto?',
      instruction: 'Arrastrá u ordená las 5 capas desde la base de silicio hasta el usuario.',
      sortableItems: [
        { id: 'c1', text: '1. HARDWARE FÍSICO (Silicio & Circuitos)', correctIndex: 0 },
        { id: 'c2', text: '2. NÚCLEO WINDOWS / KERNEL NT (Ring 0)', correctIndex: 1 },
        { id: 'c3', text: '3. SHELL / EXPLORADOR (Interfaz Gráfica)', correctIndex: 2 },
        { id: 'c4', text: '4. APLICACIONES (Navegadores & Juegos)', correctIndex: 3 },
        { id: 'c5', text: '5. USUARIO (Operador Humano)', correctIndex: 4 },
      ],
    },
    evidencia: {
      fieldName: 'CONCEPT_DESKTOP_VS_OS',
      targetDescription: 'Abstracción de interfaz gráfica separada del núcleo NT',
      defaultProvenance: 'OBSERVED',
    },
  },

  {
    id: 'inv-00-02',
    code: '00.02',
    title: 'Qué es Windows y qué NO es Windows',
    subtitle: 'La separación estricta entre SO, shell y aplicaciones',
    descubri: {
      hook: '¿Decís “Windows se me trabó” cuando un archivo de Excel no abre, o “Windows me borró un archivo” cuando OneDrive sincronizó mal? Aprender a separar el sistema operativo de los programas agregados es el primer paso de un técnico.',
      mythVsTruth: {
        mentira: '“Edge, Office, OneDrive y mi cuenta de correo son partes indivisibles de Windows.”',
        verdad: 'Windows es la plataforma base. Edge es un navegador, OneDrive es un cliente cloud y Office es una suite ofimática.',
        comprobalo: 'Podés desinstalar OneDrive o usar otro navegador sin que el kernel de Windows pierda una sola de sus capacidades de sistema.',
      },
    },
    entende: {
      title: 'Taxonomía de Componentes en tu Equipo',
      explanation: [
        '• Sistema Operativo Base: Kernel NT, controladores de hardware, subsistema de seguridad LSASS y gestor de memoria.',
        '• Shell del Sistema: Explorer.exe, menú inicio, barra de tareas, bandeja del sistema.',
        '• Servicios de Fondo: Spooler de impresión, servicio de audio, servidor RPC.',
        '• Aplicaciones de Usuario: Discord, Steam, navegadores, suites de oficina.',
        '• Clientes Cloud: Sincronizadores como OneDrive, Google Drive o Dropbox.',
      ],
    },
    profundiza: {
      title: 'Por qué mezclar conceptos arruina el diagnóstico',
      technicalDetails: [
        'Si un usuario reporta "Windows está lento", un aficionado reinstala todo el sistema operativo.',
        'Un técnico pericial aísla si el culpable es el I/O de disco saturado por OneDrive, una extensión rota de Edge o un driver con latencias DPC elevadas.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar procesos de terceros vs del sistema',
      steps: [
        '1. Abrí el Administrador de Tareas.',
        '2. Observá la separación entre “Aplicaciones” y “Procesos en segundo plano”.',
      ],
      expectedVisual: 'Lista categorizada donde podés distinguir procesos del sistema de apps comerciales.',
    },
    comprobalo: {
      instruction: 'Clasificá correctamente los componentes para no culpar al sistema de fallas de software de aplicación.',
      actionPrompt: 'Clasificá cada entidad en su categoría real.',
      validationKey: 'TAXONOMY_CLASSIFIED',
    },
    microdesafio: {
      type: 'CLASSIFICATION',
      question: 'Clasificá cada elemento en su rol técnico exacto:',
      instruction: 'Identificá qué es Windows, qué es una Aplicación, qué es un Servicio y qué es Cloud.',
      options: [
        { id: 'opt1', text: 'NTOSKRNL.EXE → Núcleo de Windows (Kernel)', isCorrect: true, feedback: 'Correcto: Es el corazón del sistema operativo.' },
        { id: 'opt2', text: 'OneDrive.exe → Cliente de Almacenamiento Cloud', isCorrect: true, feedback: 'Correcto: Es una app de sincronización, no el SO.' },
        { id: 'opt3', text: 'Audiodg.exe → Servicio de Audio del Sistema', isCorrect: true, feedback: 'Correcto: Servicio que procesa flujos de sonido.' },
        { id: 'opt4', text: 'msedge.exe → Aplicación Navegador Web', isCorrect: true, feedback: 'Correcto: Software de navegación montado sobre Windows.' },
      ],
    },
    evidencia: {
      fieldName: 'COMPONENT_TAXONOMY_AWARENESS',
      targetDescription: 'Diferenciación estricta entre Sistema Operativo, Apps y Servicios Cloud',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-00-03',
    code: '00.03',
    title: 'Ediciones: Home, Pro, Enterprise, Education',
    subtitle: 'Las diferencias reales sin marketing comercial',
    descubri: {
      hook: 'Mucha gente cree que Windows Pro hace que los juegos tengan más FPS o que la PC sea más rápida. La realidad es que el motor de renderizado y el kernel son idénticos; lo que cambia son las herramientas de gestión y seguridad empresarial.',
      mythVsTruth: {
        mentira: '“Windows 11 Pro corre los juegos más rápido que Windows 11 Home.”',
        verdad: 'Ambas ediciones comparten exactamente el mismo kernel, drivers y subsistemas de rendimiento. Pro agrega GPO (Editor de Directivas), BitLocker, Sandbox y soporte de Hyper-V.',
        comprobalo: 'Un benchmark de GPU en Home y Pro arroja idénticos resultados dentro del margen de error de medición.',
      },
    },
    entende: {
      title: 'Matriz de Capacidades Reales por Edición',
      explanation: [
        '• Windows Home: Diseñado para consumo personal. Sin directivas de grupo locales (gpedit.msc), sin host de Escritorio Remoto (RDP), sin Windows Sandbox nativo.',
        '• Windows Pro: Agrega Editor de Directivas Locales (GPO), cifrado de unidad BitLocker, Hyper-V tipo 1 y Windows Sandbox.',
        '• Windows Enterprise / Education: Control total de telemetría por GPO, AppLocker avanzado, DirectAccess y canales de soporte de largo plazo (LTSC).',
      ],
    },
    profundiza: {
      title: 'Por qué no podés aplicar ciertas guías en Home',
      technicalDetails: [
        'Cuando un tutorial te dice "Abrí gpedit.msc para desactivar una función", en Windows Home recibirás el error: "Windows no puede encontrar el archivo gpedit.msc".',
        'Intentar forzar gpedit.msc en Home mediante instaladores no oficiales suele romper firmas de paquetes del sistema.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Verificar la edición exacta instalada',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `winver` y presioná Enter.',
        '3. Leé la segunda línea de texto en el cuadro de diálogo.',
      ],
      commandOrPath: 'winver',
      shortcut: 'Win + R → winver',
      expectedVisual: 'Ventana de Acerca de Windows indicando "Windows 11 Home / Pro / Enterprise".',
    },
    comprobalo: {
      instruction: 'Identificá la edición de tu sistema y registrala en el pasaporte.',
      actionPrompt: 'Registrá la edición oficial reportada por winver.',
      validationKey: 'EDITION_REGISTERED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un técnico intenta abrir gpedit.msc en una laptop y recibe el error de archivo no encontrado. ¿Cuál es la causa más probable?',
      instruction: 'Seleccioná la causa técnica real:',
      options: [
        { id: 'e1', text: 'El equipo tiene Windows Home, que no incluye el Editor de Directivas de Grupo.', isCorrect: true, feedback: '¡Exacto! Home carece de la infraestructura MMC de GPO nativa.' },
        { id: 'e2', text: 'Un virus eliminó el archivo de System32.', isCorrect: false, feedback: 'Incorrecto: Es una limitación intencional de la edición Home.' },
        { id: 'e3', text: 'El procesador no soporta instrucciones de directivas.', isCorrect: false, feedback: 'Incorrecto: La CPU no tiene relación con el software MMC.' },
      ],
    },
    evidencia: {
      fieldName: 'EDITION',
      targetDescription: 'Edición oficial del sistema operativo (Home, Pro, Enterprise, etc.)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isCoreIdentityField: true,
    },
  },

  {
    id: 'inv-00-04',
    code: '00.04',
    title: 'Arquitectura x64 y ARM64',
    subtitle: 'La arquitectura del procesador define la compatibilidad de tus programas',
    descubri: {
      hook: 'Podés tener dos laptops que visualmente dicen “Windows 11”, pero una tiene un procesador Intel/AMD (x64) y la otra un Qualcomm Snapdragon (ARM64). Intentar instalar un driver x64 en una máquina ARM64 resultará en un fallo rotundo.',
      mythVsTruth: {
        mentira: '“Cualquier instalador .exe de Windows funciona igual en cualquier computadora con Windows 11.”',
        verdad: 'Las aplicaciones compiladas para x64 requieren una capa de emulación/traducción (Prism) en procesadores ARM64, y los drivers de kernel NO se pueden emular.',
        comprobalo: 'Verificá el “Tipo de sistema” en Información del Sistema para saber si tu kernel es x64 o ARM64.',
      },
    },
    entende: {
      title: 'Diferencias Fundamentales de Arquitectura',
      explanation: [
        '• x86 (32 bits): Legado histórico. Límite de 4 GB de memoria RAM direccionable.',
        '• x64 (AMD64 / Intel 64): El estándar universal de computadoras de escritorio y laptops tradicionales durante los últimos 15 años.',
        '• ARM64: Arquitectura de instrucciones reducidas (RISC). Utilizada en chips Qualcomm Snapdragon X Elite, Microsoft Surface y dispositivos ultra-eficientes.',
      ],
    },
    profundiza: {
      title: 'La barrera de los Drivers de Kernel',
      technicalDetails: [
        'Windows 11 en ARM64 puede emular programas de usuario x64 mediante el motor Prism.',
        'Sin embargo, NUNCA puede emular controladores de bajo nivel (drivers de tarjetas de sonido profesionales, periféricos industriales o software antitrampas con drivers Ring 0).',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar la arquitectura del sistema',
      steps: [
        '1. Presioná Win + X y seleccioná “Sistema” (o abrí Configuración > Sistema > Información).',
        '2. Revisá el apartado “Tipo de sistema”.',
      ],
      shortcut: 'Win + X → Y',
      expectedVisual: '“Sistema operativo de 64 bits, procesador basado en x64” o “procesador basado en ARM64”.',
    },
    comprobalo: {
      instruction: 'Determiná si tu máquina corre sobre arquitectura x64 o ARM64.',
      actionPrompt: 'Guardá la arquitectura de tu procesador y sistema.',
      validationKey: 'ARCH_REGISTERED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué un controlador (driver) de audio profesional compilado exclusivamente para x64 falla al instalarse en una laptop Snapdragon ARM64?',
      instruction: 'Identificá la limitación técnica de bajo nivel:',
      options: [
        { id: 'a1', text: 'Los drivers se ejecutan en Ring 0 (Kernel) y el kernel de Windows no emula código de modo núcleo entre arquitecturas.', isCorrect: true, feedback: '¡Brillante! La emulación sólo opera en User Mode (Ring 3), nunca en Ring 0.' },
        { id: 'a2', text: 'Porque el archivo no tiene permiso de administrador.', isCorrect: false, feedback: 'Incorrecto: No es un problema de permisos, sino de incompatibilidad de ISA (conjunto de instrucciones).' },
        { id: 'a3', text: 'Porque ARM64 no soporta audio de alta definición.', isCorrect: false, feedback: 'Incorrecto: El hardware soporta audio perfectamente, el problema es el binario del driver.' },
      ],
    },
    evidencia: {
      fieldName: 'ARCHITECTURE',
      targetDescription: 'Arquitectura nativa del procesador y kernel (x64 o ARM64)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isCoreIdentityField: true,
    },
  },

  {
    id: 'inv-00-05',
    code: '00.05',
    title: 'Cómo saber qué Windows tenés',
    subtitle: 'Múltiples fuentes de verdad y comprobación cruzada',
    descubri: {
      hook: 'La etiqueta pegada en el gabinete o la factura de compra pueden decir cualquier cosa. Un técnico jamás confía en la caja: consulta las fuentes de datos vivas del sistema operativo.',
      mythVsTruth: {
        mentira: '“Con mirar la etiqueta de la laptop sé qué Windows tengo instalado.”',
        verdad: 'El sistema puede haber sido reinstalado, actualizado de versión, cambiado de arquitectura o modificado con una licencia diferente.',
        comprobalo: 'Compará la salida de Configuración con la salida de línea de comandos en PowerShell.',
      },
    },
    entende: {
      title: 'Las 4 Vías Oficiales de Interrogación',
      explanation: [
        '1. Interfaz Moderna: Configuración > Sistema > Información.',
        '2. Cuadro Clásico: `winver` (Acerca de Windows).',
        '3. Instrumental Detallado: `msinfo32` (Información del Sistema).',
        '4. Consola de Comandos / PowerShell: `systeminfo` o `Get-ComputerInfo`.',
      ],
    },
    profundiza: {
      title: 'Procedencia de la Información',
      technicalDetails: [
        'Un dato declarado por el usuario (`USER_DECLARED`) es una afirmación no verificada.',
        'Un dato extraído de las APIs de instrumentación WMI/CIM de Windows (`SYSTEM_REPORTED`) constituye evidencia técnica verificable.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Obtener información del sistema por terminal',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `systeminfo` y presioná Enter.',
        '3. Observá las primeras 10 líneas de la salida.',
      ],
      commandOrPath: 'systeminfo',
      expectedVisual: 'Reporte completo con Nombre del SO, Versión, Fabricante, Tipo de sistema y Procesador.',
    },
    comprobalo: {
      instruction: 'Verificá que los datos de CMD coincidan con la ventana gráfica de winver.',
      actionPrompt: 'Comprobá la coherencia entre dos fuentes distintas.',
      validationKey: 'CROSS_CHECK_CONFIRMED',
    },
    microdesafio: {
      type: 'MYTH_VS_TRUTH',
      question: 'Un cliente te dice: "Mi PC vino con Windows 11 Home de fábrica, así que esa es mi versión". ¿Cómo actúa un técnico pericial?',
      instruction: 'Determiná la postura técnica correcta:',
      options: [
        { id: 'm1', text: 'Marca el dato como USER_DECLARED y ejecuta winver o msinfo32 para obtener evidencia SYSTEM_REPORTED.', isCorrect: true, feedback: '¡Exacto! Regla pericial: Nunca asumir, siempre comprobar.' },
        { id: 'm2', text: 'Acepta la palabra del cliente porque la fábrica nunca miente.', isCorrect: false, feedback: 'Incorrecto: La PC pudo haber sido formateada o actualizada.' },
      ],
    },
    evidencia: {
      fieldName: 'PROVENANCE_AWARENESS',
      targetDescription: 'Validación cruzada de datos con declaración de origen (SYSTEM_REPORTED vs USER_DECLARED)',
      defaultProvenance: 'OBSERVED',
    },
  },

  {
    id: 'inv-00-06',
    code: '00.06',
    title: 'winver, msinfo32, Información del sistema',
    subtitle: 'El dúo indispensable de diagnóstico rápido',
    descubri: {
      hook: 'Dos atajos de teclado te dan el 90% de la identidad técnica de cualquier equipo en menos de 5 segundos: Win+R `winver` para el resumen editorial y Win+R `msinfo32` para la radiografía completa.',
      mythVsTruth: {
        mentira: '“msinfo32 y el Administrador de Dispositivos muestran lo mismo.”',
        verdad: 'El Administrador de Dispositivos muestra controladores instalados; msinfo32 expone el mapa completo de recursos de hardware (IRQs, DMA, direcciones de memoria) y variables de firmware.',
        comprobalo: 'Abrí msinfo32 y mirá el campo “Modo de BIOS” (UEFI o Heredado) y “Estado de arranque seguro”.',
      },
    },
    entende: {
      title: 'Qué Buscar en Cada Herramienta',
      explanation: [
        '• En `winver`: Edición (Pro/Home), Versión (ej. 23H2 o 24H2) y Compilación del SO (ej. 22631.xxxx o 26100.xxxx).',
        '• En `msinfo32`: Modelo exacto de placa madre (System Model), Versión de BIOS/UEFI, Tipo de Sistema (x64-based PC), Modo de BIOS y Memoria RAM física instalada.',
      ],
    },
    profundiza: {
      title: 'Evitar Confusiones Comunes',
      technicalDetails: [
        'No confundas la Versión de Windows (ej. 24H2) con la Versión de BIOS (ej. F12 o 1.40).',
        'No confundas la Compilación del SO (OS Build) con el Número de Serie del hardware.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Lanzar msinfo32',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `msinfo32` y presioná Enter.',
        '3. Leé en el panel derecho los campos: “Nombre del SO”, “Versión”, “Tipo de sistema” y “Modo de BIOS”.',
      ],
      commandOrPath: 'msinfo32',
      shortcut: 'Win + R → msinfo32',
      expectedVisual: 'Consola de Información del Sistema con árbol de recursos y resumen del entorno.',
    },
    comprobalo: {
      instruction: 'Anotá el valor de “Tipo de sistema” (System Type) desde msinfo32.',
      actionPrompt: 'Registrá si tu equipo es x64-based PC o ARM64-based PC.',
      validationKey: 'SYSTEM_TYPE_RECORDED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Necesitás saber si una PC arrancó en modo UEFI o en modo BIOS heredado (Legacy). ¿Qué herramienta te da esa respuesta directa?',
      instruction: 'Elegí la herramienta adecuada:',
      options: [
        { id: 't1', text: 'msinfo32 → En el campo "Modo de BIOS" indica "UEFI" o "Heredado".', isCorrect: true, feedback: '¡Correcto! msinfo32 reporta de forma transparente el estado del firmware de arranque.' },
        { id: 't2', text: 'winver → En la ventana emergente.', isCorrect: false, feedback: 'Incorrecto: winver sólo muestra información de versión de Windows, no detalles del firmware.' },
        { id: 't3', text: 'Paint → Propiedades de imagen.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SYSTEM_TYPE',
      targetDescription: 'Tipo de sistema de hardware (x64-based PC / ARM64-based PC)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isCoreIdentityField: true,
    },
  },

  {
    id: 'inv-00-07',
    code: '00.07',
    title: 'Build, versión, revisión, canal de actualización',
    subtitle: 'El DNI real de tu sistema operativo',
    descubri: {
      hook: 'Decir “tengo Windows 11” es como decir “tengo un auto rojo”: no dice el año, el motor ni las piezas instaladas. El identificador técnico real es el número de compilación (OS Build) con su número de revisión menor (UBR).',
      mythVsTruth: {
        mentira: '“Todos los Windows 11 son idénticos por dentro.”',
        verdad: 'Windows 11 21H2 (Build 22000) y Windows 11 24H2 (Build 26100) tienen núcleos diferentes, requerimientos de CPU distintos (instrucción POPCNT) y arquitecturas de seguridad dispares.',
        comprobalo: 'Revisá la cifra después del punto en tu compilación (ejemplo: 26100.2033). Esa cifra cambia con cada actualización mensual de seguridad.',
      },
    },
    entende: {
      title: 'Desglose del DNI de Windows',
      explanation: [
        '• Familia: Windows 11 (Marca comercial).',
        '• Versión: 23H2 o 24H2 (Indica el año "24" y la mitad del año "H2" en que se lanzó la actualización anual).',
        '• Build Mayor: 22631 o 26100 (Indica la base de código del núcleo).',
        '• UBR (Update Build Revision): Los dígitos tras el punto (ej. `.2033`), indican los parches de seguridad acumulativos aplicados.',
      ],
    },
    profundiza: {
      title: 'El caso de la instrucción POPCNT y Windows 11 24H2',
      technicalDetails: [
        'A partir de la Build 26100 (Versión 24H2), el núcleo de Windows 11 requiere obligatoriamente la instrucción de CPU `POPCNT` y el conjunto SSE4.2.',
        'Computadoras antiguas que podían ejecutar Windows 11 21H2 mediante bypasses ya no pueden iniciar 24H2 físicamente.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Obtener el número exacto de compilación',
      steps: [
        '1. Presioná Win + R, escribí `winver` y mirá el número entre paréntesis.',
        '2. O abrí PowerShell y escribí: `[System.Environment]::OSVersion.Version`',
      ],
      commandOrPath: '[System.Environment]::OSVersion.Version',
      expectedVisual: 'Cifra en formato Major.Minor.Build.Revision (ejemplo: 10.0.26100.0).',
    },
    comprobalo: {
      instruction: 'Anotá tu versión (ej. 23H2 / 24H2) y tu Build completa con revisión (ej. 26100.xxx).',
      actionPrompt: 'Registrá la versión y número de compilación en el pasaporte.',
      validationKey: 'VERSION_AND_BUILD_REGISTERED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un técnico recibe un reporte de bug que dice: "Falla en Windows 11". ¿Por qué esta información es INSUFICIENTE para diagnosticar?',
      instruction: 'Elegí la justificación técnica precisa:',
      options: [
        { id: 'b1', text: 'Porque Windows 11 tiene múltiples versiones (21H2, 22H2, 23H2, 24H2) con diferentes APIs, parches de seguridad y requerimientos de kernel.', isCorrect: true, feedback: '¡Exacto! Sin la Build y Versión exacta, es imposible reproducir el entorno.' },
        { id: 'b2', text: 'Porque Windows 11 no tiene errores nunca.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'b3', text: 'Porque falta saber el color del monitor.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'VERSION_AND_BUILD',
      targetDescription: 'Versión (23H2/24H2) y Número de Compilación Completo (OS Build + UBR)',
      defaultProvenance: 'SYSTEM_REPORTED',
      isCoreIdentityField: true,
    },
  },

  {
    id: 'inv-00-08',
    code: '00.08',
    title: 'Usuario local vs cuenta Microsoft',
    subtitle: '¿Quién controla la sesión de tu equipo?',
    descubri: {
      hook: 'Al encender tu PC, ¿iniciás sesión con un usuario almacenado en el disco de tu propia máquina o autenticás contra los servidores en la nube de Microsoft? Esta distinción define tu privacidad, la recuperación de claves y qué ocurre si te quedás sin internet.',
      mythVsTruth: {
        mentira: '“Si no inicio sesión con una cuenta de Microsoft, mi Windows no puede funcionar.”',
        verdad: 'Windows siempre mantiene un subsistema de autenticación local (SAM). Las cuentas locales operan de forma 100% autónoma sin enviar telemetría de cuenta a la nube.',
        comprobalo: 'Revisá en Configuración > Cuentas si tu usuario indica “Cuenta local” o muestra un correo electrónico.',
      },
    },
    entende: {
      title: 'Comparativa Técnica de Cuentas',
      explanation: [
        '• Cuenta Local: Las credenciales (hash de contraseña) se guardan únicamente en el archivo `C:\\Windows\\System32\\config\\SAM` de tu disco. No requiere internet para autenticar.',
        '• Cuenta Microsoft (MSA): La sesión se vincula a tu identidad cloud. Permite sincronizar claves BitLocker en la nube, licencias digitales y configuraciones entre dispositivos.',
      ],
    },
    profundiza: {
      title: 'Seguridad y Privacidad',
      technicalDetails: [
        'En una cuenta local, si olvidás tu contraseña y no tenés un disco de restablecimiento o backup de BitLocker, nadie en internet puede desbloquear tu máquina.',
        'En una cuenta Microsoft, el token de autenticación se renueva periódicamente contra los servidores de identidad de Microsoft.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Identificar tu tipo de cuenta',
      steps: [
        '1. Presioná Win + I para abrir Configuración.',
        '2. Hacé clic en “Cuentas” en el menú lateral.',
        '3. Debajo de tu nombre de usuario, observá si dice “Cuenta local” o tu correo electrónico.',
      ],
      shortcut: 'Win + I → Cuentas',
      expectedVisual: 'Ficha de usuario con la leyenda "Cuenta local" o el identificador de cuenta Microsoft.',
    },
    comprobalo: {
      instruction: 'Determiná si tu sesión actual utiliza una Cuenta Local o una Cuenta Microsoft vinculada.',
      actionPrompt: 'Registrá el tipo de cuenta en el pasaporte.',
      validationKey: 'ACCOUNT_TYPE_REGISTERED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Dónde se almacenan las contraseñas de una Cuenta Local en Windows?',
      instruction: 'Identificá la base de datos de seguridad local:',
      options: [
        { id: 'ac1', text: 'En la base de datos local SAM (Security Account Manager) dentro del disco de la máquina.', isCorrect: true, feedback: '¡Correcto! El archivo SAM en System32 almacena los hashes de usuarios locales.' },
        { id: 'ac2', text: 'En un archivo de texto en el Escritorio.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'ac3', text: 'En los servidores centrales de Microsoft en Redmond.', isCorrect: false, feedback: 'Incorrecto: Eso ocurre con cuentas MSA, no locales.' },
      ],
    },
    evidencia: {
      fieldName: 'ACCOUNT_TYPE',
      targetDescription: 'Tipo de cuenta de usuario activa (Local / Microsoft Account)',
      defaultProvenance: 'OBSERVED',
      isCoreIdentityField: true,
    },
  },

  {
    id: 'inv-00-09',
    code: '00.09',
    title: 'Administrador vs usuario estándar',
    subtitle: '“Tengo Admin” no significa tener poder absoluto',
    descubri: {
      hook: 'Sos el dueño de la PC, tu usuario dice “Administrador”, pero cuando querés borrar un archivo del sistema, Windows te dice: “Necesita permisos de TrustedInstaller”. ¿Por qué tu propio Windows te desconoce?',
      mythVsTruth: {
        mentira: '“Como soy Administrador, mis programas corren con acceso total al sistema operativo.”',
        verdad: 'Desde Windows Vista con UAC (Control de Cuentas de Usuario), los administradores operan por defecto con un token filtrado de usuario estándar hasta que una app solicita elevación explícita.',
        comprobalo: 'Abrí CMD normal y escribí `net session`. Te dará "Acceso denegado". Abrí CMD como Administrador y el comando funcionará.',
      },
    },
    entende: {
      title: 'La Pirámide de Privilegios de Windows',
      explanation: [
        '1. TrustedInstaller / SYSTEM: Los niveles supremos que protegen archivos críticos del kernel y del sistema.',
        '2. Administrador Elevado (High Integrity): Procesos lanzados con clic derecho "Ejecutar como administrador".',
        '3. Administrador Filtrado / Estándar (Medium Integrity): Tu sesión cotidiana normal para navegar y trabajar.',
        '4. Sandbox / Low Integrity: Procesos restringidos (pestañas de Edge, apps aisladas).',
      ],
    },
    profundiza: {
      title: 'UAC: El Guardián Silencioso',
      technicalDetails: [
        'El cuadro de diálogo de UAC cambia a un escritorio seguro (Secure Desktop) donde ningún malware puede hacer clic automáticamente.',
        'Al aceptar UAC, Windows inyecta los privilegios administrativos al nuevo proceso sin elevar toda tu sesión.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el nivel de integridad en terminal',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter (sin elevar).',
        '2. Escribí `whoami /priv` y observá la lista de privilegios desactivados.',
      ],
      commandOrPath: 'whoami /priv',
      expectedVisual: 'Lista de privilegios de seguridad del token de tu proceso actual.',
    },
    comprobalo: {
      instruction: 'Comprendé si tu sesión cotidiana corre bajo token filtrado o usuario estándar.',
      actionPrompt: 'Registrá el privilegio de tu sesión en el pasaporte.',
      validationKey: 'PRIVILEGE_REGISTERED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Sos Administrador de tu equipo. Abrís un instalador y Windows te muestra la pantalla azul/oscura de UAC pidiendo confirmación. ¿Por qué ocurre esto?',
      instruction: 'Explicá el mecanismo de seguridad UAC:',
      options: [
        { id: 'u1', text: 'Porque tu sesión corre por defecto con un token restringido (Medium Integrity) y el instalador necesita elevarse a High Integrity para modificar archivos de sistema.', isCorrect: true, feedback: '¡Exacto! El token dividido (Split Token) de UAC evita que apps no autorizadas actúen como Admin en silencio.' },
        { id: 'u2', text: 'Porque Windows sospecha que tu teclado fue hackeado.', isCorrect: false, feedback: 'Incorrecto.' },
        { id: 'u3', text: 'Porque perdiste tus permisos de administrador.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'USER_PRIVILEGE',
      targetDescription: 'Nivel de privilegio de la sesión activa y contexto UAC',
      defaultProvenance: 'OBSERVED',
      isCoreIdentityField: true,
    },
  },

  {
    id: 'inv-00-10',
    code: '00.10',
    title: 'Escritorio, barra, Explorer, Configuración y Panel de control',
    subtitle: 'El mapa de interfaces: pasado y presente conviviendo',
    descubri: {
      hook: '¿Por qué para cambiar la resolución vas a la app moderna de Configuración, pero para ajustar propiedades avanzadas de sonido o adaptadores de red terminás en las ventanas del viejo Panel de Control de Windows 95/7?',
      mythVsTruth: {
        mentira: '“Windows 11 reemplazó por completo el código del viejo Panel de Control.”',
        verdad: 'Windows contiene dos motores de configuración conviviendo: la interfaz moderna XAML/WinUI (Settings) y los applets clásicos Win32 (.cpl) del Panel de Control.',
        comprobalo: 'Presioná Win+R y escribí `ncpa.cpl`. Abrirás directamente la ventana clásica de conexiones de red de hace más de 20 años.',
      },
    },
    entende: {
      title: 'El Árbol de Consolas de Gestión',
      explanation: [
        '• Configuración (SystemSettings.exe): Interfaz moderna para tareas cotidianas.',
        '• Panel de Control (control.exe): Applets clásicos (.cpl) para administración profunda.',
        '• Consolas de Administración MMC (.msc): `devmgmt.msc` (Dispositivos), `diskmgmt.msc` (Discos), `services.msc` (Servicios).',
      ],
    },
    profundiza: {
      title: 'Por qué los técnicos usan comandos directos .cpl y .msc',
      technicalDetails: [
        'Navegar por 6 menús de la interfaz moderna toma 30 segundos.',
        'Escribir `ncpa.cpl` o `appwiz.cpl` en Win+R abre el panel exacto en 0.5 segundos de forma determinista en cualquier versión de Windows.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Lanzar un applet clásico directamente',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `ncpa.cpl` y presioná Enter.',
        '3. Observá el panel clásico de adaptadores de red.',
      ],
      commandOrPath: 'ncpa.cpl',
      shortcut: 'Win + R → ncpa.cpl',
      expectedVisual: 'Ventana clásica de Conexiones de Red.',
    },
    comprobalo: {
      instruction: 'Probá lanzar una consola MMC clásica como `services.msc` o `diskmgmt.msc`.',
      actionPrompt: 'Comprobá el acceso directo a herramientas de taller.',
      validationKey: 'APPLET_SHORTCUT_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué ventaja tiene para un técnico memorizar atajos como `ncpa.cpl` o `devmgmt.msc` frente a buscar en la app de Configuración?',
      instruction: 'Seleccioná la respuesta técnica:',
      options: [
        { id: 'cpl1', text: 'Permiten acceder directamente al panel de bajo nivel sin depender de cambios estéticos de menú entre versiones de Windows.', isCorrect: true, feedback: '¡Exacto! Los atajos .cpl y .msc son consistentes en Windows 7, 10, 11 y Server.' },
        { id: 'cpl2', text: 'Hacen que la tarjeta de red funcione al doble de velocidad.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SYSTEM_CONSOLES_AWARENESS',
      targetDescription: 'Mapeo de interfaces de administración (Settings vs Control Panel vs MMC)',
      defaultProvenance: 'OBSERVED',
    },
  },

  {
    id: 'inv-00-11',
    code: '00.11',
    title: 'Rutas importantes de Windows',
    subtitle: 'La anatomía de las 5 carpetas sagradas de tu disco C:',
    descubri: {
      hook: 'Si entrás al disco C:, ves carpetas con nombres parecidos: `Archivos de programa`, `Archivos de programa (x86)`, `ProgramData` y `Windows`. Cada una tiene reglas estrictas de permisos, arquitectura y propósito.',
      mythVsTruth: {
        mentira: '“Puedo instalar o guardar mis programas en cualquier carpeta del disco y da lo mismo.”',
        verdad: 'Windows aplica listas de control de acceso (ACLs) y virtualización de archivos diferente según la carpeta de destino.',
        comprobalo: 'Intentá crear un archivo de texto en `C:\\Program Files` sin permisos de Administrador: Windows bloqueará la acción.',
      },
    },
    entende: {
      title: 'Las 5 Rutas Fundamentales',
      explanation: [
        '1. `C:\\Windows`: El santuario del sistema operativo. Aloja el núcleo, System32, controladores y fuentes.',
        '2. `C:\\Program Files`: Para aplicaciones nativas de 64 bits (x64 o ARM64).',
        '3. `C:\\Program Files (x86)`: Reservado para aplicaciones de 32 bits (x86).',
        '4. `C:\\ProgramData`: Carpeta oculta para datos y configuraciones compartidas entre todos los usuarios del equipo.',
        '5. `C:\\Users\\<TuUsuario>`: Tu perfil personal (Documentos, Descargas, Escritorio y AppData).',
      ],
    },
    profundiza: {
      title: 'Seguridad y Permisos de Escritura',
      technicalDetails: [
        'Los programas ordinarios nunca deben escribir datos de configuración dentro de `C:\\Program Files`.',
        'Los datos volátiles deben ir a `%APPDATA%` o `%LOCALAPPDATA%` dentro de la carpeta del usuario.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar la raíz del disco del sistema',
      steps: [
        '1. Abrí el Explorador de Archivos y andá a Este equipo > Disco Local (C:).',
        '2. Activá en la pestaña Vista > Mostrar > "Elementos ocultos" para ver `ProgramData`.',
      ],
      expectedVisual: 'Estructura canónica de carpetas de Windows.',
    },
    comprobalo: {
      instruction: 'Anotá la letra del disco donde está instalado tu Windows (habitualmente C:).',
      actionPrompt: 'Registrá el disco del sistema y la ruta de Windows.',
      validationKey: 'SYSTEM_PATHS_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Dónde se instala por defecto una aplicación de 32 bits en una versión de Windows de 64 bits?',
      instruction: 'Identificá la carpeta correcta:',
      options: [
        { id: 'p1', text: 'C:\\Program Files (x86)', isCorrect: true, feedback: '¡Correcto! Windows reserva esa ruta para aislar binarios x86 de 32 bits.' },
        { id: 'p2', text: 'C:\\Windows\\System32', isCorrect: false, feedback: 'Incorrecto: System32 aloja binarios del sistema, no apps de terceros.' },
        { id: 'p3', text: 'C:\\Users\\Public', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SYSTEM_DRIVE_AND_PATHS',
      targetDescription: 'Unidad de sistema (System Drive) y ruta oficial de Windows',
      defaultProvenance: 'SYSTEM_REPORTED',
      isCoreIdentityField: true,
    },
  },

  {
    id: 'inv-00-12',
    code: '00.12',
    title: 'Variables %USERPROFILE%, %APPDATA%, %TEMP%, etc.',
    subtitle: 'Por qué los técnicos nunca escriben rutas fijas en sus scripts',
    descubri: {
      hook: 'Si creás un script que copia un archivo a `C:\\Users\\Juan\\AppData`, funcionará en tu PC pero fallará estrepitosamente en la de María o en cualquier máquina con Windows en otro disco. Los profesionales usan variables de entorno.',
      mythVsTruth: {
        mentira: '“Escribir `C:\\Users\\MiNombre` en un script o comando es una buena práctica técnica.”',
        verdad: 'Es un error grave de principiante. Las rutas deben referenciarse siempre mediante variables dinámicas como `%USERPROFILE%` o `$env:USERPROFILE`.',
        comprobalo: 'Presioná Win+R, escribí `%TEMP%` y presioná Enter. Abrirás tu carpeta temporal exacta sin importar cómo te llames.',
      },
    },
    entende: {
      title: 'Las 6 Variables de Entorno Esenciales',
      explanation: [
        '• `%USERPROFILE%`: Apunta a la carpeta de tu usuario activo (ej. `C:\\Users\\Lucas`).',
        '• `%APPDATA%`: Carpeta de configuraciones móviles de tus programas (Roaming).',
        '• `%LOCALAPPDATA%`: Configuraciones y cachés locales de tu máquina.',
        '• `%TEMP%`: Archivos temporales de tu usuario.',
        '• `%WINDIR%` o `%SYSTEMROOT%`: Carpeta donde reside Windows (ej. `C:\\Windows`).',
        '• `%PROGRAMDATA%`: Datos comunes para todos los usuarios.',
      ],
    },
    profundiza: {
      title: 'Variables en CMD vs PowerShell',
      technicalDetails: [
        'En CMD / Win+R se usan con signos de porcentaje: `%USERPROFILE%`.',
        'En PowerShell se consultan como: `$env:USERPROFILE` o `$env:TEMP`.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar variables en CMD',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí: `echo %USERPROFILE%` y presioná Enter.',
        '3. Escribí: `echo %WINDIR%` y presioná Enter.',
      ],
      commandOrPath: 'echo %USERPROFILE%',
      expectedVisual: 'La terminal imprime la ruta real absoluta resuelta en tu máquina.',
    },
    comprobalo: {
      instruction: 'Anotá tu ruta de perfil de usuario resuelta por la variable `%USERPROFILE%`.',
      actionPrompt: 'Registrá la ruta del perfil en tu expediente.',
      validationKey: 'USER_PROFILE_PATH_RECORDED',
    },
    microdesafio: {
      type: 'VARIABLE_RESOLVER',
      question: 'Querés crear un instalador que funcione en 100 computadoras diferentes con nombres de usuario distintos. ¿Cuál comando es correcto?',
      instruction: 'Seleccioná la línea reproducible:',
      options: [
        { id: 'v1', text: 'copy archivo.config %LOCALAPPDATA%\\MiApp\\', isCorrect: true, feedback: '¡Impecable! La variable se resolverá automáticamente para cada usuario.' },
        { id: 'v2', text: 'copy archivo.config C:\\Users\\Admin\\AppData\\Local\\MiApp\\', isCorrect: false, feedback: 'Incorrecto: Fallará en cualquier PC cuyo usuario no se llame "Admin".' },
      ],
    },
    evidencia: {
      fieldName: 'USER_PROFILE_PATH',
      targetDescription: 'Ruta absoluta resuelta de la variable de entorno %USERPROFILE%',
      defaultProvenance: 'SYSTEM_REPORTED',
      isCoreIdentityField: true,
    },
  },

  {
    id: 'inv-00-13',
    code: '00.13',
    title: 'Crear el Expediente Windows EVO 001',
    subtitle: 'El registro técnico acumulativo y el motor de procedencia',
    descubri: {
      hook: 'En un peritaje judicial o diagnóstico corporativo, un dato sin origen declarado no tiene validez. En EVO Labs todo dato debe llevar su sello de procedencia: ¿lo dijo el usuario, lo midió una herramienta o lo reportó el kernel?',
      mythVsTruth: {
        mentira: '“Basta con anotar los datos en un bloc de notas sin registrar de dónde salieron.”',
        verdad: 'La procedencia (`PROVENANCE`) garantiza trazabilidad y reproducibilidad forense.',
        comprobalo: 'Observá los sellos de estado: `SYSTEM_REPORTED`, `USER_DECLARED`, `OBSERVED`, `MEASURED`.',
      },
    },
    entende: {
      title: 'Los 7 Estados de Procedencia Oficiales de EVO',
      explanation: [
        '1. `USER_DECLARED`: Dato ingresado por el usuario sin verificar.',
        '2. `SYSTEM_REPORTED`: Obtenido directamente de APIs oficiales de Windows (WMI, Winver, Registry).',
        '3. `OBSERVED`: Visualizado directamente por el técnico en pantalla.',
        '4. `MEASURED`: Medido instrumentalmente con temporizadores o contadores.',
        '5. `DERIVED`: Calculado a partir de otros datos comprobados.',
        '6. `SIMULATED`: Producido por un modelo de laboratorio cuando no hay agente real.',
        '7. `UNKNOWN`: Sin procedencia identificable.',
      ],
    },
    profundiza: {
      title: 'Regla de Oro de la Ingeniería',
      technicalDetails: [
        'NUNCA promover automáticamente un dato `USER_DECLARED` a `CONFIRMED` sin una prueba instrumental.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Revisar la ficha del expediente',
      steps: [
        '1. Verificá los 9 campos clave recopilados en tu sesión.',
        '2. Confirmá sus sellos de procedencia.',
      ],
      expectedVisual: 'Ficha pericial con sellos de trazabilidad.',
    },
    comprobalo: {
      instruction: 'Generá la primera entrada formal en el Expediente Windows EVO 001.',
      actionPrompt: 'Consolidá tu expediente técnico pericial.',
      validationKey: 'EXPEDIENTE_001_CREATED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un usuario escribe en un formulario web que su PC tiene 32 GB de RAM. ¿Qué estado de procedencia corresponde asignarle?',
      instruction: 'Elegí el sello de procedencia correcto:',
      options: [
        { id: 'pr1', text: 'USER_DECLARED — Porque es una afirmación del usuario que aún no fue medida ni leída por el sistema.', isCorrect: true, feedback: '¡Exacto! Hasta que msinfo32 o el agente local lean el hardware, sigue siendo declarado.' },
        { id: 'pr2', text: 'SYSTEM_REPORTED — Porque el usuario sabe lo que compró.', isCorrect: false, feedback: 'Incorrecto: Lo dijo una persona, no el sistema.' },
        { id: 'pr3', text: 'MEASURED — Porque ya está confirmado.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'EXPEDIENTE_INITIALIZED',
      targetDescription: 'Inicialización de expediente técnico con reglas de procedencia',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-00-14',
    code: '00.14',
    title: 'Baseline inicial antes de tocar nada',
    subtitle: '“Si no sabés cómo estaba antes, jamás podrás demostrar que mejoró”',
    descubri: {
      hook: 'Alguien aplica un script de optimización de internet y dice: “Siento que la PC vuela”. Eso es placebo psicológico. La ingeniería exige medir antes de tocar para poder comparar después con rigor científico.',
      mythVsTruth: {
        mentira: '“Puedo saber si una optimización funcionó simplemente por mi percepción.”',
        verdad: 'La percepción humana sufre sesgo de confirmación. Solo los números de una línea base (Baseline) previa permiten demostrar mejoras.',
        comprobalo: 'Registrá tus valores base de RAM libre, procesos activos y apps de inicio antes de cualquier experimento.',
      },
    },
    entende: {
      title: 'Identidad vs Rendimiento',
      explanation: [
        '• Identidad del Sistema: Quién es tu máquina (Edición, Build, Arquitectura, Rutas). Estos datos son estáticos.',
        '• Rendimiento y Estado: Cómo está operando en este instante (Procesos activos, Memoria en uso, Espacio en disco). Estos datos son dinámicos.',
      ],
    },
    profundiza: {
      title: 'Métricas de la Línea Base Inicial',
      technicalDetails: [
        '1. Espacio libre en disco del sistema (GB libres en C:).',
        '2. Memoria RAM física total y memoria disponible.',
        '3. Cantidad de procesos en ejecución con el sistema en reposo.',
        '4. Aplicaciones habilitadas en el Inicio.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Contar procesos en reposo',
      steps: [
        '1. Abrí el Administrador de Tareas (Ctrl + Shift + Esc).',
        '2. Mirá en la esquina inferior izquierda la cifra de “Procesos” en ejecución.',
      ],
      shortcut: 'Ctrl + Shift + Esc',
      expectedVisual: 'Número total de procesos (habitualmente entre 90 y 220 en un sistema estándar).',
    },
    comprobalo: {
      instruction: 'Capturá tu primera instantánea de línea base (Baseline).',
      actionPrompt: 'Registrá las métricas de estado inicial en el expediente.',
      validationKey: 'BASELINE_CAPTURED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué es un error metodológico grave aplicar 10 optimizaciones juntas sin haber tomado un Baseline previo?',
      instruction: 'Elegí la explicación técnica:',
      options: [
        { id: 'b_opt1', text: 'Porque no podrás saber cuál de las 10 causó una mejora (o cuál introdujo una falla) ni demostrar cambios reales frente al estado inicial.', isCorrect: true, feedback: '¡Brillante! Regla científica: Aislar variables y comparar siempre contra la línea base.' },
        { id: 'b_opt2', text: 'Porque Windows se bloquea si haces más de 5 cambios.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'BASELINE_RECORD',
      targetDescription: 'Línea base inicial de estado y rendimiento registrada',
      defaultProvenance: 'MEASURED',
    },
  },

  {
    id: 'inv-00-15',
    code: '00.15',
    title: 'Cómo volver atrás si algo sale mal',
    subtitle: 'La regla de oro de la reversibilidad técnica',
    descubri: {
      hook: 'El mejor técnico no es el que nunca comete un error, sino el que SIEMPRE tiene un camino seguro para volver exactamente al estado original en menos de 5 minutos.',
      mythVsTruth: {
        mentira: '“Los técnicos profesionales no necesitan hacer backups ni puntos de restauración porque saben lo que hacen.”',
        verdad: 'Los profesionales son quienes MÁS copias de seguridad hacen, porque saben que el software complejo tiene efectos colaterales impredecibles.',
        comprobalo: 'Revisá la existencia de Puntos de Restauración en tu sistema escribiendo `sysdm.cpl` en Win+R.',
      },
    },
    entende: {
      title: 'El Checklist Antes de Tocar Windows',
      explanation: [
        '1. Saber exactamente qué valor vamos a cambiar.',
        '2. Registrar por escrito el valor original previo.',
        '3. Saber con certeza el procedimiento exacto para revertirlo.',
        '4. Cambiar UNA sola variable por vez.',
        '5. Comprobar el resultado con telemetría objetiva.',
        '6. Decidir si conservar el cambio o revertir de inmediato.',
      ],
    },
    profundiza: {
      title: 'Herramientas de Reversibilidad',
      technicalDetails: [
        '• Puntos de Restauración (System Restore): Copias de sombra VSS del Registro y binarios de sistema.',
        '• Exportación de Claves de Registro (.reg): Guardar la rama antes de editar un valor.',
        '• Documentación de configuración: Anotar el estado previo en el expediente pericial.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar Protección del Sistema',
      steps: [
        '1. Presioná Win + R, escribí `sysdm.cpl` y presioná Enter.',
        '2. Hacé clic en la pestaña “Protección del sistema”.',
        '3. Observá si la protección para la unidad C: está “Activada”.',
      ],
      commandOrPath: 'sysdm.cpl',
      shortcut: 'Win + R → sysdm.cpl',
      expectedVisual: 'Panel de Propiedades del Sistema con opciones de Restaurar Sistema y Crear Punto.',
    },
    comprobalo: {
      instruction: 'Aceptá el protocolo de 6 pasos de reversibilidad técnica de EVO Labs.',
      actionPrompt: 'Firmá el compromiso de reversibilidad en tu expediente.',
      validationKey: 'REVERSIBILITY_CHECKLIST_ACCEPTED',
    },
    microdesafio: {
      type: 'ORDER_SEQUENCE',
      question: 'Ordená el protocolo de cambio seguro de 6 pasos de EVO Labs:',
      instruction: 'Colocá los pasos en el orden metrológico correcto:',
      sortableItems: [
        { id: 's1', text: '1. Saber qué vamos a cambiar', correctIndex: 0 },
        { id: 's2', text: '2. Registrar el valor original previo', correctIndex: 1 },
        { id: 's3', text: '3. Tener claro cómo volver atrás', correctIndex: 2 },
        { id: 's4', text: '4. Cambiar UNA sola variable', correctIndex: 3 },
        { id: 's5', text: '5. Comprobar el resultado', correctIndex: 4 },
        { id: 's6', text: '6. Conservar o revertir', correctIndex: 5 },
      ],
    },
    evidencia: {
      fieldName: 'REVERSIBILITY_PROTOCOL_ADOPTED',
      targetDescription: 'Adopción del protocolo de reversibilidad y seguridad técnica',
      defaultProvenance: 'OBSERVED',
    },
  },
];

// 5 MINICASOS REALES DE SECTOR 00
export const SECTOR_00_MINICASES: Sector00MiniCase[] = [
  {
    id: 'case-00-a',
    code: 'CASO 00-A',
    title: 'La función invisible',
    scenario: 'Un usuario llama alarmado porque compró una laptop nueva con Windows 11 y necesita activar Windows Sandbox para probar archivos sospechosos. Al buscar la función en "Activar o desactivar características de Windows", la opción no aparece en la lista.',
    userStatement: '“Mi Windows 11 vino fallado o tiene un virus, porque no me deja activar Windows Sandbox.”',
    initialMistake: 'Asumir que todas las instalaciones de Windows 11 tienen las mismas características activables.',
    diagnosticQuestion: '¿Qué información técnica fundamental debés verificar primero antes de sospechar de una falla?',
    options: [
      {
        id: 'opt_a1',
        text: 'La Edición de Windows (Home vs Pro/Enterprise), porque Windows Sandbox no está disponible en la edición Home.',
        isCorrect: true,
        explanation: 'Windows Sandbox requiere la infraestructura de virtualización e hipervisor reservada para las ediciones Pro, Enterprise y Education.',
      },
      {
        id: 'opt_a2',
        text: 'La velocidad de internet del usuario.',
        isCorrect: false,
        explanation: 'La conexión a internet no determina la presencia de paquetes de características en la imagen de Windows.',
      },
      {
        id: 'opt_a3',
        text: 'Reinstalar Windows desde cero de inmediato.',
        isCorrect: false,
        explanation: 'Reinstalar la misma edición Home devolverá exactamente el mismo resultado.',
      },
    ],
    technicalVerdict: 'La laptop tiene Windows 11 Home. Para disponer de Windows Sandbox se requiere actualizar a Windows 11 Pro o utilizar software de virtualización de terceros.',
    lessonLearned: 'Nunca diagnostiques una falla de software sin conocer la Edición exacta del sistema operativo.',
  },

  {
    id: 'case-00-b',
    code: 'CASO 00-B',
    title: 'Dos máquinas, un mismo nombre',
    scenario: 'En una oficina hay dos computadoras idénticas físicamente. Ambas muestran el logotipo de Windows 11. En una de ellas, una aplicación corporativa de IA local funciona a la perfección. En la otra, el software arroja un error crítico: "Instruction Set Missing / Unsupported OS Build".',
    userStatement: '“Las dos computadoras tienen Windows 11, así que el problema es del software.”',
    initialMistake: 'Creer que la etiqueta comercial "Windows 11" implica idéntico código interno.',
    diagnosticQuestion: 'Al ejecutar `winver` y `msinfo32`, ¿qué diferencias técnicas podrían explicar el comportamiento?',
    options: [
      {
        id: 'opt_b1',
        text: 'Una máquina está en Windows 11 21H2 (Build 22000) y la otra en 24H2 (Build 26100), o una es arquitectura x64 y la otra ARM64.',
        isCorrect: true,
        explanation: 'Diferentes Builds y arquitecturas poseen conjuntos de APIs y requisitos de instrucciones de CPU totalmente dispares.',
      },
      {
        id: 'opt_b2',
        text: 'Una PC tiene el fondo de pantalla en modo oscuro y la otra en modo claro.',
        isCorrect: false,
        explanation: 'El tema visual no altera las instrucciones del procesador ni las librerías del sistema.',
      },
      {
        id: 'opt_b3',
        text: 'EVIDENCIA INSUFICIENTE: Se requiere inspeccionar la Build exacta y la arquitectura.',
        isCorrect: false,
        explanation: 'La opción A describe con precisión las dos variables que causan este error.',
      },
    ],
    technicalVerdict: 'Una de las PCs no había recibido actualizaciones de características y se encontraba en una Build antigua que carecía de las librerías de tiempo de ejecución necesarias.',
    lessonLearned: '“Windows 11” es solo una marca. El diagnóstico real exige Número de Compilación (Build) y Arquitectura.',
  },

  {
    id: 'case-00-c',
    code: 'CASO 00-C',
    title: 'El script egoísta',
    scenario: 'El técnico de una empresa programó un script para limpiar archivos temporales y configuraciones de una app. El script funcionaba perfecto en su computadora, pero al enviárselo a los 50 empleados de la empresa, falló en el 100% de los casos.',
    userStatement: '“El script dice: del /q /f C:\\Users\\JuanPerez\\AppData\\Local\\Temp\\*.* ¿Por qué les da error de ruta no encontrada?”',
    initialMistake: 'Escribir rutas absolutas hardcodeadas con el nombre de usuario del programador.',
    diagnosticQuestion: '¿Cómo debe reescribirse la ruta para que sea 100% reproducible y universal en cualquier equipo?',
    options: [
      {
        id: 'opt_c1',
        text: 'Utilizando la variable de entorno `%TEMP%` o `%LOCALAPPDATA%\\Temp`.',
        isCorrect: true,
        explanation: 'Las variables de entorno se resuelven dinámicamente en el contexto del usuario que ejecuta el comando.',
      },
      {
        id: 'opt_c2',
        text: 'Creando una carpeta llamada JuanPerez en todas las computadoras de la empresa.',
        isCorrect: false,
        explanation: 'Es una aberración técnica que rompe la seguridad y el orden de perfiles del sistema.',
      },
      {
        id: 'opt_c3',
        text: 'Cambiándole el nombre al script.',
        isCorrect: false,
        explanation: 'El nombre del archivo .bat o .ps1 no cambia el contenido de sus instrucciones.',
      },
    ],
    technicalVerdict: 'El script contenía una ruta estática dependiente del perfil local. El uso de `%TEMP%` solucionó la portabilidad en todos los puestos de trabajo.',
    lessonLearned: 'Los técnicos jamás hardcodean nombres de usuario: hablan en variables de entorno.',
  },

  {
    id: 'case-00-d',
    code: 'CASO 00-D',
    title: 'La laptop nueva y el instalador mudo',
    scenario: 'Un profesional compra una notebook moderna ultra-delgada con batería de 20 horas. Intenta instalar el software de diagnóstico de su taller con un instalador que contiene un driver de bajo nivel para osciloscopio USB. El instalador se cierra silenciosamente sin mostrar mensaje de error.',
    userStatement: '“La laptop es la más rápida del mercado y tiene Windows 11. El instalador debe estar dañado.”',
    initialMistake: 'Desconocer que la laptop posee un procesador ARM64 (Snapdragon X Elite) y que los controladores de kernel no se pueden emular.',
    diagnosticQuestion: '¿Cuál es la causa técnica real del fallo silencioso?',
    options: [
      {
        id: 'opt_d1',
        text: 'El software incluye un driver de modo núcleo (Ring 0) compilado para x64. Windows ARM64 emula aplicaciones de usuario (Ring 3), pero NUNCA controladores de kernel.',
        isCorrect: true,
        explanation: 'Los controladores de dispositivo deben estar compilados nativamente para ARM64 para que el kernel de Windows pueda cargarlos.',
      },
      {
        id: 'opt_d2',
        text: 'La laptop tiene poca memoria RAM.',
        isCorrect: false,
        explanation: 'El equipo cuenta con 16 GB de RAM, el problema es de arquitectura de instrucciones.',
      },
      {
        id: 'opt_d3',
        text: 'EVIDENCIA INSUFICIENTE.',
        isCorrect: false,
        explanation: 'El síntoma de driver de bajo nivel en procesador ARM64 es un caso cerrado de incompatibilidad de arquitectura.',
      },
    ],
    technicalVerdict: 'Incompatibilidad de arquitectura en modo núcleo. Se requiere solicitar al fabricante del instrumental la versión nativa del driver compilada para Windows en ARM64.',
    lessonLearned: 'Verificá el Tipo de Sistema (x64 vs ARM64) antes de adquirir periféricos con drivers especializados.',
  },

  {
    id: 'case-00-e',
    code: 'CASO 00-E',
    title: 'El administrador impotente',
    scenario: 'Un técnico inicia sesión en una PC corporativa con una cuenta que pertenece al grupo de Administradores locales. Abre el Administrador de Tareas y al intentar finalizar un proceso sospechoso, recibe: "Operación no completada. Acceso denegado".',
    userStatement: '“Si soy miembro del grupo Administradores, Windows no puede decirme que no tengo acceso.”',
    initialMistake: 'Confundir membresía en el grupo Administradores con elevación activa de proceso en contexto de UAC.',
    diagnosticQuestion: '¿Por qué el Administrador de Tareas o la terminal rechazan la acción a pesar de que el usuario es Administrador?',
    options: [
      {
        id: 'opt_e1',
        text: 'Porque la aplicación se ejecutó en nivel de integridad medio (Medium Integrity) con el token de administrador filtrado por UAC. Requiere ejecutarse explícitamente con elevación (Run as administrator).',
        isCorrect: true,
        explanation: 'El mecanismo de Token Dividido de UAC ejecuta todas las aplicaciones cotidianas como usuario estándar hasta que se solicita elevación.',
      },
      {
        id: 'opt_e2',
        text: 'Porque el disco duro está protegido contra escritura mecánica.',
        isCorrect: false,
        explanation: 'El error es de permisos de seguridad de procesos, no de hardware de almacenamiento.',
      },
      {
        id: 'opt_e3',
        text: 'Porque Windows deshabilitó la cuenta de usuario automáticamente.',
        isCorrect: false,
        explanation: 'La sesión sigue activa normalmente.',
      },
    ],
    technicalVerdict: 'El proceso fue lanzado sin elevación de privilegios. Al ejecutar el Administrador de Tareas o CMD con clic derecho "Ejecutar como Administrador", la acción se completó con éxito.',
    lessonLearned: 'Pertenecer al grupo Administradores otorga el DERECHO a elevarse, pero no ejecuta tus programas como administrador por defecto.',
  },
];

// BANCO DE 16 PREGUNTAS DEL TEST DE SECTOR 00
export const SECTOR_00_TEST_BANK: Sector00TestQuestion[] = [
  {
    id: 't00-q01',
    questionNumber: 1,
    category: 'IDENTIFICACIÓN',
    scenario: 'Un cliente te consulta por WhatsApp: "Tengo Windows 11 y una app no me abre".',
    question: '¿Qué combinación de comandos le indicarías ejecutar para obtener de inmediato la información técnica indispensable?',
    options: [
      { id: 'o1', text: 'Win+R `winver` (para Edición y Build) y Win+R `msinfo32` (para Arquitectura y Sistema).', isCorrect: true, technicalJustification: 'winver y msinfo32 constituyen la combinación estándar para identificar versión exacta, compilación y arquitectura sin ambigüedades.' },
      { id: 'o2', text: 'Win+R `calc` y `mspaint`.', isCorrect: false, technicalJustification: 'Son accesorios de usuario sin valor de diagnóstico.' },
      { id: 'o3', text: 'Mirar el color de la caja de la laptop.', isCorrect: false, technicalJustification: 'La caja no es una fuente técnica verificable.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE: No se puede saber sin desarmar la PC.', isCorrect: false, technicalJustification: 'El software del sistema operativo expone estos datos de inmediato sin desensamblar hardware.' },
    ],
  },
  {
    id: 't00-q02',
    questionNumber: 2,
    category: 'ARQUITECTURA',
    scenario: 'Tenés que implementar un software que interactúa con un driver de captura en tiempo real en 20 laptops recién adquiridas con chips Snapdragon X Elite.',
    question: '¿Qué consideración técnica crítica debés contemplar sobre el instalador del driver?',
    options: [
      { id: 'o1', text: 'El driver debe estar compilado nativamente para ARM64; la emulación de Windows sólo funciona en modo usuario (Ring 3), nunca en modo kernel (Ring 0).', isCorrect: true, technicalJustification: 'El kernel NT en arquitectura ARM64 no puede cargar binarios de controladores de 64 bits x64.' },
      { id: 'o2', text: 'Cualquier driver x64 funciona automáticamente por emulación Prism.', isCorrect: false, technicalJustification: 'Prism emula exclusivamente código de espacio de usuario, jamás controladores de kernel.' },
      { id: 'o3', text: 'Los chips Snapdragon no ejecutan Windows.', isCorrect: false, technicalJustification: 'Windows 11 cuenta con edición nativa para procesadores ARM64.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'La regla de arquitectura en modo núcleo es absoluta y documentada por Microsoft.' },
    ],
  },
  {
    id: 't00-q03',
    questionNumber: 3,
    category: 'IDENTIFICACIÓN',
    scenario: 'Leés en un informe técnico: "Equipo con Windows 11 Build 26100.2033".',
    question: '¿Qué representa exactamente el número `.2033` después del punto?',
    options: [
      { id: 'o1', text: 'La UBR (Update Build Revision), que indica el nivel exacto de revisiones y parches de seguridad acumulativos instalados.', isCorrect: true, technicalJustification: 'La UBR se incrementa con cada Quality Update mensual aplicada al núcleo base.' },
      { id: 'o2', text: 'El año de fabricación de la placa madre.', isCorrect: false, technicalJustification: 'La UBR es una métrica de software de Windows, no de hardware.' },
      { id: 'o3', text: 'La cantidad de memoria RAM en megabytes.', isCorrect: false, technicalJustification: 'No guarda relación con la memoria.' },
      { id: 'o4', text: 'El número de serie de la licencia de Windows.', isCorrect: false, technicalJustification: 'Las licencias usan claves alfanuméricas de 25 caracteres.' },
    ],
  },
  {
    id: 't00-q04',
    questionNumber: 4,
    category: 'RUTAS_VARIABLES',
    scenario: 'Estás desarrollando un script pericial de diagnóstico que debe guardar un reporte en el perfil del usuario que lo ejecute.',
    question: '¿Cuál es la forma profesional y portable de referenciar la carpeta del usuario en un script por lotes?',
    options: [
      { id: 'o1', text: '%USERPROFILE%\\Reporte.txt', isCorrect: true, technicalJustification: 'La variable de entorno %USERPROFILE% se resuelve de forma dinámica para cualquier usuario y letra de unidad.' },
      { id: 'o2', text: 'C:\\Users\\Usuario\\Reporte.txt', isCorrect: false, technicalJustification: 'Ruta estática propensa a fallos si el usuario tiene otro nombre o Windows está en D:.' },
      { id: 'o3', text: 'C:\\Windows\\System32\\Reporte.txt', isCorrect: false, technicalJustification: 'System32 requiere elevación y no debe usarse para almacenar reportes temporales de usuario.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: '%USERPROFILE% es la solución estándar universal.' },
    ],
  },
  {
    id: 't00-q05',
    questionNumber: 5,
    category: 'PRIVILEGIOS_UAC',
    scenario: 'Un usuario administrador hace doble clic en un archivo .reg para fusionar claves en HKEY_LOCAL_MACHINE y recibe un mensaje de error del Editor del Registro.',
    question: '¿Cuál es la causa técnica de este bloqueo si el usuario es Administrador?',
    options: [
      { id: 'o1', text: 'El proceso del Editor del Registro se inició con el token filtrado estándar; escribir en HKEY_LOCAL_MACHINE requiere elevación explícita (High Integrity) mediante UAC.', isCorrect: true, technicalJustification: 'HKLM protege la configuración de toda la máquina y exige token administrativo elevado.' },
      { id: 'o2', text: 'El Registro de Windows está roto y debe formatearse el equipo.', isCorrect: false, technicalJustification: 'Es un comportamiento de seguridad normal y predecible de UAC.' },
      { id: 'o3', text: 'Las cuentas locales no pueden editar el registro.', isCorrect: false, technicalJustification: 'Tanto cuentas locales como Microsoft pueden editar el registro si cuentan con elevación.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El modelo de integridad de UAC explica directamente este escenario.' },
    ],
  },
  {
    id: 't00-q06',
    questionNumber: 6,
    category: 'IDENTIFICACIÓN',
    scenario: 'Un técnico novato afirma que Windows 11 Pro incluye un mejor motor de DirectX que hace que los juegos tengan más FPS que en Windows 11 Home.',
    question: '¿Cuál es el veredicto pericial sobre esta afirmación?',
    options: [
      { id: 'o1', text: 'MENTIRA: El subsistema gráfico, DirectX y el kernel NT son idénticos entre Home y Pro; Pro solo agrega herramientas de administración (GPO, BitLocker, Hyper-V, RDP host).', isCorrect: true, technicalJustification: 'El pipeline de renderizado y el driver de GPU se ejecutan exactamente bajo las mismas condiciones en ambas ediciones.' },
      { id: 'o2', text: 'VERDAD: La edición Pro desbloquea núcleos ocultos de la tarjeta de video.', isCorrect: false, technicalJustification: 'Mito comercial sin sustento en la arquitectura de Windows.' },
      { id: 'o3', text: 'DEPENDE: Solo si el monitor es de 144 Hz.', isCorrect: false, technicalJustification: 'La tasa de refresco del monitor no cambia el software del sistema operativo.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'La paridad de rendimiento entre Home y Pro está comprobada empíricamente.' },
    ],
  },
  {
    id: 't00-q07',
    questionNumber: 7,
    category: 'RUTAS_VARIABLES',
    scenario: 'Necesitás abrir rápidamente el panel clásico de adaptadores de red en una máquina con Windows en idioma alemán sin saber la traducción de "Conexiones de red".',
    question: '¿Qué comando directo en la ventana Ejecutar (Win+R) te llevará a ese panel de inmediato en cualquier idioma?',
    options: [
      { id: 'o1', text: 'ncpa.cpl', isCorrect: true, technicalJustification: 'ncpa.cpl es el identificador de applet de red estándar independiente del idioma de la interfaz.' },
      { id: 'o2', text: 'control /redes /deutch', isCorrect: false, technicalJustification: 'Sintaxis inexistente en Windows.' },
      { id: 'o3', text: 'notepad.exe', isCorrect: false, technicalJustification: 'Abre el Bloc de Notas.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'ncpa.cpl es el atajo universal documentado.' },
    ],
  },
  {
    id: 't00-q08',
    questionNumber: 8,
    category: 'DIAGNÓSTICO',
    scenario: 'Un cliente afirma: "Mi computadora funciona más rápido desde que le pasé un script optimizador que encontré en internet".',
    question: 'Al solicitarle evidencia técnica, el cliente no tiene mediciones de antes ni de después. ¿Cómo califica un perito de EVO Labs esta situación?',
    options: [
      { id: 'o1', text: 'Placebo y afirmación sin rigor (USER_DECLARED). Sin una línea base (Baseline) previa y una medición posterior objetiva, no hay evidencia científica de mejora.', isCorrect: true, technicalJustification: 'La metrología pericial exige comparar estados contra una línea base reproducible.' },
      { id: 'o2', text: 'Evidencia confirmada (SYSTEM_REPORTED).', isCorrect: false, technicalJustification: 'La percepción subjetiva no constituye un reporte del sistema.' },
      { id: 'o3', text: 'Certificación de rendimiento válida.', isCorrect: false, technicalJustification: 'Carece de datos numéricos y metodología de control.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El caso se clasifica con precisión como afirmación sin sustento metrológico.' },
    ],
  },
  {
    id: 't00-q09',
    questionNumber: 9,
    category: 'IDENTIFICACIÓN',
    scenario: 'En un equipo con Windows 11, finalizás la tarea `explorer.exe` desde el Administrador de Tareas.',
    question: '¿Qué ocurre con el sistema operativo y con las demás aplicaciones abiertas?',
    options: [
      { id: 'o1', text: 'Desaparece la interfaz gráfica del escritorio y la barra de tareas, pero el kernel sigue activo y las aplicaciones continúan ejecutándose normalmente.', isCorrect: true, technicalJustification: 'explorer.exe es solo el shell gráfico de usuario; el kernel NT y los subsistemas no dependen de su ejecución continua.' },
      { id: 'o2', text: 'La PC sufre un pantallazo azul inmediato (BSOD).', isCorrect: false, technicalJustification: 'En Windows NT, explorer.exe corre en User Mode aislado del Ring 0.' },
      { id: 'o3', text: 'Se borran todos los archivos del disco rígido.', isCorrect: false, technicalJustification: 'Mito absurdo.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El comportamiento de desacoplamiento de explorer.exe es determinista.' },
    ],
  },
  {
    id: 't00-q09b',
    questionNumber: 10,
    category: 'RUTAS_VARIABLES',
    scenario: 'Querés ubicar los datos temporales del usuario actual mediante la consola de comandos.',
    question: '¿A qué ruta apunta la variable de entorno `%TEMP%` por defecto en una instalación estándar de Windows?',
    options: [
      { id: 'o1', text: '%USERPROFILE%\\AppData\\Local\\Temp', isCorrect: true, technicalJustification: 'Windows mapea la variable %TEMP% a la subcarpeta Local\\Temp dentro del perfil de usuario.' },
      { id: 'o2', text: 'C:\\Windows\\System32\\Drivers', isCorrect: false, technicalJustification: 'Drivers aloja controladores de sistema, no archivos temporales de usuario.' },
      { id: 'o3', text: 'C:\\ProgramData\\Temp', isCorrect: false, technicalJustification: 'ProgramData es para datos globales compartidos, no temporales de sesión privada.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'La ruta es estándar en todas las versiones modernas de Windows.' },
    ],
  },
  {
    id: 't00-q10',
    questionNumber: 11,
    category: 'DIAGNÓSTICO',
    scenario: 'Un técnico quiere aplicar un cambio de configuración en el Registro de Windows de un servidor de producción.',
    question: '¿Cuál es el primer paso obligatorio según el protocolo de reversibilidad de 6 pasos de EVO Labs?',
    options: [
      { id: 'o1', text: 'Saber exactamente qué vamos a cambiar y registrar por escrito el valor original previo.', isCorrect: true, technicalJustification: 'El registro del valor previo y la comprensión del cambio son indispensables antes de alterar cualquier variable.' },
      { id: 'o2', text: 'Borrar todas las carpetas temporales sin mirar.', isCorrect: false, technicalJustification: 'Acción destructiva no relacionada.' },
      { id: 'o3', text: 'Reiniciar el servidor de inmediato.', isCorrect: false, technicalJustification: 'No tiene sentido reiniciar antes de planificar la reversibilidad.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El protocolo estipula claramente el orden de pasos.' },
    ],
  },
  {
    id: 't00-q11',
    questionNumber: 12,
    category: 'IDENTIFICACIÓN',
    scenario: 'Observás en `msinfo32` el campo "Modo de BIOS" y figura el valor "Heredado" (Legacy).',
    question: '¿Qué significa técnicamente este valor para la seguridad del equipo?',
    options: [
      { id: 'o1', text: 'La máquina arrancó mediante emulación BIOS MBR clásica, lo que impide utilizar características modernas como Secure Boot (Arranque Seguro) y aislamiento de memoria por hardware.', isCorrect: true, technicalJustification: 'El modo Heredado/CSM deshabilita las APIs UEFI requeridas para Secure Boot y HVCI.' },
      { id: 'o2', text: 'El procesador está dañado físicamente.', isCorrect: false, technicalJustification: 'Es una configuración de firmware, no un daño de silicio.' },
      { id: 'o3', text: 'Windows 11 funciona con mayor rendimiento.', isCorrect: false, technicalJustification: 'Windows 11 requiere oficialmente modo UEFI nativo.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El significado de Modo Heredado es concluyente.' },
    ],
  },
  {
    id: 't00-q12',
    questionNumber: 13,
    category: 'ARQUITECTURA',
    scenario: 'Se intenta instalar una aplicación de 32 bits (x86) en un Windows 11 de 64 bits (x64).',
    question: '¿Qué subsistema de compatibilidad de Windows permite que la app de 32 bits funcione transparentemente?',
    options: [
      { id: 'o1', text: 'WOW64 (Windows 32-bit on Windows 64-bit), que redirige llamadas de sistema y archivos a SysWOW64.', isCorrect: true, technicalJustification: 'WOW64 es el emulador/traductor de espacio de usuario que permite ejecutar binarios x86 en núcleos x64.' },
      { id: 'o2', text: 'DirectX 12 Ultimate.', isCorrect: false, technicalJustification: 'DirectX es una API gráfica, no un subsistema de compatibilidad de arquitectura.' },
      { id: 'o3', text: 'El antivirus de Windows Defender.', isCorrect: false, technicalJustification: 'Defender no traduce llamadas de sistema.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'WOW64 es el subsistema documentado.' },
    ],
  },
  {
    id: 't00-q13',
    questionNumber: 14,
    category: 'PRIVILEGIOS_UAC',
    scenario: 'Un usuario quiere eliminar un archivo protegido en `C:\\Windows\\System32\\drivers`. El sistema indica que los permisos pertenecen a `TrustedInstaller`.',
    question: '¿Quién es `TrustedInstaller` en la jerarquía de seguridad de Windows?',
    options: [
      { id: 'o1', text: 'Una cuenta de servicio del subsistema de mantenimiento de componentes de Windows (Windows Modules Installer) con privilegios superiores a los de un Administrador estándar para evitar la corrupción de archivos del núcleo.', isCorrect: true, technicalJustification: 'TrustedInstaller es el propietario de los binarios del Component Store para prevenir modificaciones no autorizadas.' },
      { id: 'o2', text: 'Un virus informático que secuestró la PC.', isCorrect: false, technicalJustification: 'Es una entidad legítima y fundamental del sistema operativo.' },
      { id: 'o3', text: 'El nombre del fabricante de la placa madre.', isCorrect: false, technicalJustification: 'No tiene relación con marcas de hardware.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'TrustedInstaller es la identidad oficial de WRP (Windows Resource Protection).' },
    ],
  },
  {
    id: 't00-q14',
    questionNumber: 15,
    category: 'RUTAS_VARIABLES',
    scenario: 'Un software necesita almacenar una base de datos local que debe ser accesible por todos los usuarios de la PC (Lucas, Juan y Admin).',
    question: '¿Cuál es la carpeta del sistema adecuada para este propósito según las guías de arquitectura de Windows?',
    options: [
      { id: 'o1', text: '%PROGRAMDATA% (habitualmente C:\\ProgramData)', isCorrect: true, technicalJustification: 'ProgramData es el repositorio estándar para datos de aplicación comunes a todos los perfiles de usuario de la máquina.' },
      { id: 'o2', text: '%TEMP%', isCorrect: false, technicalJustification: 'Temp es volátil y privada por cada usuario.' },
      { id: 'o3', text: 'C:\\Windows\\Fonts', isCorrect: false, technicalJustification: 'Fonts es exclusivamente para tipografías del sistema.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'ProgramData es la ubicación canónica establecida por Microsoft.' },
    ],
  },
  {
    id: 't00-q15',
    questionNumber: 16,
    category: 'DIAGNÓSTICO',
    scenario: 'Un usuario te muestra una captura de pantalla donde se lee únicamente: "Windows 11". No figura la edición, ni la compilación, ni la arquitectura, ni el modelo de procesador.',
    question: '¿Podés asegurar con certeza técnica si esa PC es compatible con una función que requiere virtualización Hyper-V y Windows 11 24H2?',
    options: [
      { id: 'o1', text: 'EVIDENCIA INSUFICIENTE: La información provista es incompleta; se requiere consultar `winver` y `msinfo32` para verificar Edición (Pro/Enterprise) y Build (26100+).', isCorrect: true, technicalJustification: 'Regla de Oro: Sin los datos específicos de Edición, Build y Arquitectura es imposible garantizar compatibilidad técnica.' },
      { id: 'o2', text: 'Sí, porque todos los Windows 11 tienen exactamente las mismas funciones.', isCorrect: false, technicalJustification: 'Falso: Las ediciones Home carecen de Hyper-V y las builds antiguas carecen de APIs modernas.' },
      { id: 'o3', text: 'Sí, porque la palabra Windows 11 es suficiente para cualquier software.', isCorrect: false, technicalJustification: 'Falso: Es marketing, no identificación técnica.' },
      { id: 'o4', text: 'No, porque Windows 11 no soporta virtualización nunca.', isCorrect: false, technicalJustification: 'Falso: Hyper-V es un componente nativo de nivel empresarial.' },
    ],
  },
];

// TUTOR EVO TIPS PARA SECTOR 00
export const SECTOR_00_TUTOR_ADVICE: { condition: string; tip: string }[] = [
  {
    condition: 'initial',
    tip: '“Pensás que tenés Windows 11. Eso no alcanza. Antes de modificar nada, identifiquemos con precisión quirúrgica qué sistema tenés delante.”',
  },
  {
    condition: 'winver_opened',
    tip: '“Excelente. Fijate en el número de compilación (OS Build). Esa cifra de 5 dígitos y su revisión definen las verdaderas capacidades de tu núcleo.”',
  },
  {
    condition: 'variables_step',
    tip: '“Nunca escribas rutas con tu nombre de usuario en scripts. Los técnicos periciales hablamos en variables de entorno como %USERPROFILE% o %TEMP%.”',
  },
  {
    condition: 'baseline_step',
    tip: '“No modifiques ningún parámetro todavía. Estamos construyendo la línea base (Baseline). Si no sabés cómo estaba antes, jamás podrás demostrar que mejoró.”',
  },
  {
    condition: 'reversibility_step',
    tip: '“El mejor técnico no es el que nunca comete un error, sino el que siempre tiene un camino seguro para volver atrás en 5 minutos.”',
  },
];
