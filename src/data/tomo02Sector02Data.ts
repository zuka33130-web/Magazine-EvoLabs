// TOMO 02: LA BIBLIA NEGRA DE WINDOWS // MENTIRA Y VERDAD
// SECTOR 02: EL MAPA DE WINDOWS // DÓNDE ESTÁ CADA COSA

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

export interface Sector02Investigation {
  id: string;
  code: string; // e.g. "02.01"
  title: string;
  subtitle: string;
  riskLevel: 'SAFE_TO_CLEAN' | 'SPECIFIC_PROCEDURE' | 'NEVER_DELETE_MANUALLY';
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
    diagramItems?: { label: string; desc: string }[];
  };
  profundiza: {
    title: string;
    technicalDetails: string[];
    lowLevelNote?: string;
    crossReference?: string;
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
  };
  evidencia: {
    fieldName: string;
    targetDescription: string;
    defaultProvenance: ProvenanceType;
  };
}

export interface Sector02MiniCase {
  id: string;
  code: string; // e.g. "CASO 02-A"
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

export interface Sector02TestQuestion {
  id: string;
  questionNumber: number;
  category: 'SISTEMA_Y_SYSTEM32' | 'PROGRAMAS_Y_APPDATA' | 'LOGS_Y_DIAGNÓSTICO' | 'ATRIBUTOS_Y_EXTENSIONES' | 'REGLAS_DE_LIMPIEZA';
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    technicalJustification: string;
  }[];
}

// 30 INVESTIGACIONES CANÓNICAS DEL SECTOR 02
export const SECTOR_02_INVESTIGATIONS: Sector02Investigation[] = [
  {
    id: 'inv-02-01',
    code: '02.01',
    title: 'C:\\Windows',
    subtitle: 'El santuario del sistema operativo',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Es la carpeta más famosa y temida de la computadora. En ella residen el núcleo de Windows, sus librerías esenciales y los binarios que permiten que tu hardware encienda.',
      mythVsTruth: {
        mentira: '“Toda la totalidad del código de Windows vive dentro de la carpeta C:\\Windows.”',
        verdad: 'C:\\Windows aloja los componentes centrales del SO en modo usuario y núcleo, pero la configuración de arranque vive en la partición ESP (EFI) y los datos compartidos de apps viven en C:\\ProgramData.',
        comprobalo: 'Abre la variable %WINDIR% en la ventana Ejecutar (Win+R) para navegar directamente al directorio raíz de Windows.',
      },
    },
    entende: {
      title: 'Anatomía del Directorio C:\\Windows',
      explanation: [
        '• %WINDIR%: Variable de entorno que apunta dinámicamente a la carpeta del SO (habitualmente C:\\Windows).',
        '• Archivos Clave: Contiene `explorer.exe`, `notepad.exe`, carpetas de registro, recursos de fuentes y subsistemas.',
        '• Regla Pericial: Modificar o borrar archivos dentro de C:\\Windows de forma manual desestabiliza el kernel NT.',
      ],
      diagramLabel: 'DIRECTORIOS PADRE EN C:\\WINDOWS',
      diagramItems: [
        { label: 'System32', desc: 'Binarios de 64 bits y herramientas de sistema' },
        { label: 'SysWOW64', desc: 'Subconjunto de compatibilidad para 32 bits' },
        { label: 'WinSxS', desc: 'Component Store y versiones de archivos' },
        { label: 'SystemResources', desc: 'Recursos gráficos y temas' },
      ],
    },
    profundiza: {
      title: 'Protección WRP (Windows Resource Protection)',
      technicalDetails: [
        'Los archivos en C:\\Windows están protegidos contra escritura arbitraria mediante la cuenta de servicio TrustedInstaller.',
        'Incluso un Administrador local que intente modificar un binario en System32 recibirá un mensaje de "Acceso denegado".',
      ],
      crossReference: 'Profundización de TrustedInstaller y Acls en Sector 21.',
    },
    miraloEnTuPc: {
      actionName: 'Navegar a la ruta de Windows mediante variable',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `%WINDIR%` y presioná Enter.',
        '3. Verificá que el Explorador se abre en la raíz de C:\\Windows.',
      ],
      commandOrPath: '%WINDIR%',
      shortcut: 'Win + R → %WINDIR%',
      expectedVisual: 'Explorador mostrando la carpeta raíz de Windows.',
    },
    comprobalo: {
      instruction: 'Comprobá la ruta exacta de la variable %WINDIR% en tu sistema.',
      actionPrompt: 'Registrá la ruta oficial de Windows en el expediente.',
      validationKey: 'WINDIR_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué un usuario administrador recibe un bloqueo al intentar borrar una DLL dentro de C:\\Windows?',
      instruction: 'Seleccioná la respuesta técnica:',
      options: [
        { id: 'w1', text: 'Porque el propietario del archivo es la cuenta de servicio TrustedInstaller y la protección WRP bloquea la modificación.', isCorrect: true, feedback: '¡Exacto! WRP protege la integridad de binarios críticos.' },
        { id: 'w2', text: 'Porque el disco rígido está dañado físicamente.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WINDIR_PATH',
      targetDescription: 'Ruta resuelta de la variable %WINDIR%',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-02',
    code: '02.02',
    title: 'System32',
    subtitle: 'El motor ejecutable de Windows',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'En foros de internet circula el famoso chiste destructivo "Borrá System32 para hacer tu PC más rápida". Cualquiera que borre este directorio destruye los binarios que ejecutan el sistema operativo.',
      mythVsTruth: {
        mentira: '“System32 se llama así porque contiene archivos obsoletos de 32 bits.”',
        verdad: 'En sistemas Windows de 64 bits (x64), C:\\Windows\\System32 aloja los binarios y controladores nativos de 64 BITS.',
        comprobalo: 'Abre la consola CMD desde System32 y comprueba que ejecuta la versión nativa x64.',
      },
    },
    entende: {
      title: 'Qué Hay Adentro de System32',
      explanation: [
        '• Binarios Ejecutables (.exe): `cmd.exe`, `taskmgr.exe`, `lsass.exe`, `svchost.exe`, `winlogon.exe`.',
        '• Librerías Dinámicas (.dll): `kernel32.dll`, `ntdll.dll`, `user32.dll`.',
        '• Controladores de Modo Núcleo (.sys): En la subcarpeta `System32\\drivers`.',
      ],
    },
    profundiza: {
      title: 'Origen del Nombre System32',
      technicalDetails: [
        'El nombre "System32" se mantuvo por compatibilidad histórica desde la transición de Windows NT 3.1 (32 bits).',
        'Al migrar a x64, Microsoft conservó la ruta System32 para las herramientas nativas de 64 bits para no romper miles de scripts hardcodeados.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar ejecutables en System32',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `where cmd.exe` y presioná Enter.',
      ],
      commandOrPath: 'where cmd.exe',
      expectedVisual: 'C:\\Windows\\System32\\cmd.exe',
    },
    comprobalo: {
      instruction: 'Verificá que la herramienta nativa CMD reside en C:\\Windows\\System32.',
      actionPrompt: 'Registrá la ubicación de System32.',
      validationKey: 'SYSTEM32_PATH_CONFIRMED',
    },
    microdesafio: {
      type: 'MYTH_VS_TRUTH',
      question: 'En un Windows 11 de 64 bits, ¿qué arquitectura tienen los archivos .exe que están dentro de C:\\Windows\\System32?',
      instruction: 'Seleccioná la respuesta correcta:',
      options: [
        { id: 's1', text: 'Son binarios nativos de 64 bits (x64).', isCorrect: true, feedback: '¡Brillante! Pese al nombre "32", System32 aloja binarios x64 nativos.' },
        { id: 's2', text: 'Son binarios de 32 bits emulados.', isCorrect: false, feedback: 'Incorrecto: Los de 32 bits están en SysWOW64.' },
      ],
    },
    evidencia: {
      fieldName: 'SYSTEM32_CONFIRMED',
      targetDescription: 'Confirmación de arquitectura nativa x64 en System32',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-03',
    code: '02.03',
    title: 'Por qué SysWOW64 no significa lo que parece',
    subtitle: 'El gran malentendido de los nombres de carpetas en Windows',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Si ves una carpeta llamada `SysWOW64`, lo intuitivo es pensar "acá están los archivos de 64 bits". La realidad técnica de Windows es exactamente la contraria.',
      mythVsTruth: {
        mentira: '“SysWOW64 guarda los archivos de 64 bits y System32 los de 32 bits.”',
        verdad: 'SysWOW64 significa "Windows-on-Windows 64" y contiene los binarios de 32 BITS para permitir que programas antiguos funcionen en un kernel de 64 bits.',
        comprobalo: 'Compara el tamaño de `C:\\Windows\\System32\\cmd.exe` con `C:\\Windows\\SysWOW64\\cmd.exe`.',
      },
    },
    entende: {
      title: 'El Subsistema WOW64 (Windows 32-bit on Windows 64-bit)',
      explanation: [
        '• Misión: Redirigir llamadas de sistema de aplicaciones de 32 bits para que crean que están corriendo en un Windows de 32 bits puro.',
        '• Inversión de Nombres:',
        '  - `System32` → Archivos NATIVOS de 64 BITS.',
        '  - `SysWOW64` → Archivos LEGADO de 32 BITS.',
      ],
      diagramLabel: 'REDIRECCIÓN DE ARQUITECTURA EN WOW64',
      diagramItems: [
        { label: 'Programa de 64 bits', desc: 'Ejecuta binarios nativos desde C:\\Windows\\System32' },
        { label: 'Programa de 32 bits', desc: 'WOW64 lo redirige transparentemente a C:\\Windows\\SysWOW64' },
      ],
    },
    profundiza: {
      title: 'Virtualización de Archivos y Registro en WOW64',
      technicalDetails: [
        'Cuando un proceso de 32 bits intenta acceder a `C:\\Windows\\System32`, el kernel NT mediante WOW64 redirige la solicitud en silencio hacia `SysWOW64`.',
        'Esto evita que un binario de 32 bits intente cargar por error una DLL de 64 bits en su espacio de memoria.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar la existencia de SysWOW64',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `dir C:\\Windows\\SysWOW64\\cmd.exe` y presioná Enter.',
      ],
      commandOrPath: 'dir C:\\Windows\\SysWOW64\\cmd.exe',
      expectedVisual: 'Archivo cmd.exe de 32 bits presente en SysWOW64.',
    },
    comprobalo: {
      instruction: 'Anotá el concepto de la redirección WOW64.',
      actionPrompt: 'Registrá la función real de SysWOW64.',
      validationKey: 'SYSWOW64_WOW64_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué tipo de binarios aloja la carpeta C:\\Windows\\SysWOW64 en un Windows 11 de 64 bits?',
      instruction: 'Seleccioná la respuesta correcta:',
      options: [
        { id: 'sw1', text: 'Binarios y DLLs de 32 BITS para compatibilidad mediante el subsistema WOW64.', isCorrect: true, feedback: '¡Impecable! SysWOW64 contiene la capa de 32 bits.' },
        { id: 'sw2', text: 'Binarios de 64 bits exclusivamente.', isCorrect: false, feedback: 'Incorrecto: Esos residen en System32.' },
      ],
    },
    evidencia: {
      fieldName: 'WOW64_CONCEPT_UNDERSTOOD',
      targetDescription: 'Comprensión de la inversión de nombres entre System32 y SysWOW64',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-04',
    code: '02.04',
    title: 'Program Files',
    subtitle: 'El hogar de tus aplicaciones nativas de 64 bits',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Cuando instalás un programa nativo de 64 bits (como Adobe Premiere, Blender o un juego moderno), Windows crea su carpeta dentro de `C:\\Program Files` (Archivos de programa).',
      mythVsTruth: {
        mentira: '“Cualquier programa se puede borrar simplemente arrastrando su carpeta de Program Files a la papelera.”',
        verdad: 'Borrar la carpeta en Program Files deja claves de registro huérfanas, servicios instalados y accesos directos rotos. Se debe usar el desinstalador oficial (`appwiz.cpl`).',
        comprobalo: 'Revisá las carpetas de aplicaciones dentro de C:\\Program Files.',
      },
    },
    entende: {
      title: 'Aislamiento de Aplicaciones Nativas',
      explanation: [
        '• Propósito: Directorio protegido para ejecutables y recursos de aplicaciones de 64 bits (x64 / ARM64).',
        '• Permisos: Requiere elevación de Administrador para modificar o guardar archivos nuevos dentro de esta ruta.',
      ],
    },
    profundiza: {
      title: 'Aislamiento de Escritura en Program Files',
      technicalDetails: [
        'Para evitar que software malicioso altere binarios, Windows bloquea la escritura en Program Files a usuarios estándar.',
        'Las aplicaciones que intenten guardar partidas o configuraciones en Program Files sufrirán virtualización UAC (`VirtualStore`).',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Abrir Program Files desde Win+R',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `%ProgramFiles%` y presioná Enter.',
      ],
      commandOrPath: '%ProgramFiles%',
      shortcut: 'Win + R → %ProgramFiles%',
      expectedVisual: 'Explorador en la carpeta C:\\Program Files.',
    },
    comprobalo: {
      instruction: 'Anotá la variable %ProgramFiles% resuelta.',
      actionPrompt: 'Registrá la variable de programas nativos.',
      validationKey: 'PROGRAMFILES_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué un programa de edición no debe guardar sus archivos temporales de proyectos dentro de C:\\Program Files?',
      instruction: 'Seleccioná la causa técnica de seguridad:',
      options: [
        { id: 'pf1', text: 'Porque C:\\Program Files exige permisos administrativos para escribir y rompería la ejecución sin UAC.', isCorrect: true, feedback: '¡Exacto! Los datos volátiles deben ir a AppData o Temp.' },
        { id: 'pf2', text: 'Porque los discos SSD se dañan si escribes en Program Files.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PROGRAMFILES_PATH',
      targetDescription: 'Ruta resuelta de %ProgramFiles%',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-05',
    code: '02.05',
    title: 'Program Files (x86)',
    subtitle: 'La residencia de aplicaciones de 32 bits',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Si tu equipo es de 64 bits, ¿por qué tenés dos carpetas de "Archivos de programa"? La versión con `(x86)` aísla los binarios antiguos de 32 bits.',
      mythVsTruth: {
        mentira: '“Si borro la carpeta Program Files (x86) mi PC pasa a ser 100% de 64 bits y más rápida.”',
        verdad: 'Muchos programas modernos (Steam, plugins de audio, componentes de impresoras) todavía usan partes de 32 bits. Borrar esta carpeta romperá esas aplicaciones de inmediato.',
        comprobalo: 'Inspecciona cuántas aplicaciones en tu PC residen en Program Files (x86).',
      },
    },
    entende: {
      title: 'Por qué Se Mantiene la Separación',
      explanation: [
        '• Aislar Binarios: Evita conflictos de arquitectura entre DLLs de 32 bits y 64 bits.',
        '• Variable: Se referencia dinámicamente mediante `%ProgramFiles(x86)%`.',
      ],
    },
    profundiza: {
      title: 'El mito de la velocidad',
      technicalDetails: [
        'Tener carpetas en Program Files (x86) no ocupa memoria RAM ni ralentiza la CPU en reposo.',
        'Un binario de 32 bits se ejecuta eficientemente en CPUs x64 gracias al soporte por hardware del procesador.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Abrir Program Files (x86)',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `%ProgramFiles(x86)%` y presioná Enter.',
      ],
      commandOrPath: '%ProgramFiles(x86)%',
      expectedVisual: 'Explorador en C:\\Program Files (x86).',
    },
    comprobalo: {
      instruction: 'Verificá la existencia de la variable %ProgramFiles(x86)%.',
      actionPrompt: 'Registrá la carpeta de programas de 32 bits.',
      validationKey: 'PROGRAMFILES_X86_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué pasaría si intentás instalar un driver de placa de video de 32 bits en Windows 11 de 64 bits?',
      instruction: 'Elegí la consecuencia real:',
      options: [
        { id: 'p86_1', text: 'Fallará la instalación porque el kernel NT de 64 bits exige controladores nativos de 64 bits en Ring 0.', isCorrect: true, feedback: '¡Brillante! WOW64 funciona para aplicaciones en Ring 3, nunca para drivers de Kernel en Ring 0.' },
        { id: 'p86_2', text: 'Se instala en Program Files (x86) y funciona.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PROGRAMFILES_X86_PATH',
      targetDescription: 'Ruta resuelta de %ProgramFiles(x86)%',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-06',
    code: '02.06',
    title: 'ProgramData',
    subtitle: 'La carpeta oculta para configuraciones globales',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Si tres usuarios distintos (Juan, Maria y Admin) usan el mismo antivirus o el mismo software en la PC, ¿dónde guarda la aplicación sus definiciones de virus para no duplicar espacio en cada perfil?',
      mythVsTruth: {
        mentira: '“ProgramData es un virus porque es una carpeta oculta en la raíz de C:.”',
        verdad: 'ProgramData es una carpeta canónica oficial de Windows para datos compartidos entre todos los perfiles de usuario.',
        comprobalo: 'Activa la opción "Elementos ocultos" en el Explorador para ver `C:\\ProgramData`.',
      },
    },
    entende: {
      title: 'Ubicación y Propósito de ProgramData',
      explanation: [
        '• Ruta Real: `C:\\ProgramData` (representada por la variable `%PROGRAMDATA%`).',
        '• Atributo: Carpeta oculta por defecto.',
        '• Uso: Bases de datos locales de antivirus, licencias compartidas, cachés globales.',
      ],
      diagramLabel: 'APPDATA VS PROGRAMDATA',
      diagramItems: [
        { label: 'AppData', desc: 'Privado de cada usuario (C:\\Users\\<Usuario>\\AppData)' },
        { label: 'ProgramData', desc: 'Compartido para todos los usuarios (C:\\ProgramData)' },
      ],
    },
    profundiza: {
      title: 'Listas de Control de Acceso (ACLs) en ProgramData',
      technicalDetails: [
        'ProgramData permite a los usuarios estándar LEER datos de configuración globales, pero suele exigir privilegios de Administrador para modificar archivos centrales.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Abrir ProgramData con Win+R',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `%PROGRAMDATA%` y presioná Enter.',
      ],
      commandOrPath: '%PROGRAMDATA%',
      expectedVisual: 'Explorador abriendo C:\\ProgramData.',
    },
    comprobalo: {
      instruction: 'Anotá la ruta resuelta por %PROGRAMDATA%.',
      actionPrompt: 'Registrá el repositorio de datos globales.',
      validationKey: 'PROGRAMDATA_VERIFIED',
    },
    microdesafio: {
      type: 'CLASSIFICATION',
      question: '¿Dónde debe almacenar su base de datos de licencias un software que se ejecuta para todos los usuarios de la PC?',
      instruction: 'Seleccioná la ruta canónica:',
      options: [
        { id: 'pd1', text: '%PROGRAMDATA% (C:\\ProgramData)', isCorrect: true, feedback: '¡Correcto! Es el repositorio global oficial.' },
        { id: 'pd2', text: '%USERPROFILE%\\Desktop', isCorrect: false, feedback: 'Incorrecto: Eso es privado del usuario actual.' },
      ],
    },
    evidencia: {
      fieldName: 'PROGRAMDATA_PATH',
      targetDescription: 'Ruta resuelta de %PROGRAMDATA%',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-07',
    code: '02.07',
    title: 'AppData Local / LocalLow / Roaming',
    subtitle: 'El cerebro privado de la configuración de tus programas',
    riskLevel: 'SPECIFIC_PROCEDURE',
    descubri: {
      hook: 'Desinstalás Chrome o Discord, lo volvés a instalar y... ¡tus pestañas, cuentas e historial siguen ahí! ¿Cómo recordó la PC tus datos? Todo estaba guardado dentro de la carpeta oculta `AppData`.',
      mythVsTruth: {
        mentira: '“Puedo borrar toda la carpeta AppData para liberar espacio en disco sin ninguna consecuencia.”',
        verdad: 'Borrar AppData elimina perfiles de navegadores, partidas de juegos guardadas, configuraciones de apps y claves de sesión de tus programas.',
        comprobalo: 'Navega a `%APPDATA%` y `%LOCALAPPDATA%` usando Win+R.',
      },
    },
    entende: {
      title: 'Las 3 Subcarpetas de AppData',
      explanation: [
        '1. `Roaming` (%APPDATA%): Datos que conceptualmente pueden viajar entre PCs en una red corporativa de dominio (ej. perfiles de navegadores, ajustes de correo).',
        '2. `Local` (%LOCALAPPDATA%): Datos masivos no itinerantes que pertenecen únicamente a esta máquina física (ej. cachés de navegadores, índices).',
        '3. `LocalLow`: Datos con nivel de integridad bajo (Low Integrity), usados por pestañas de navegadores en Sandbox para restringir accesos.',
      ],
    },
    profundiza: {
      title: 'Por qué se acumulan Gigabytes en AppData',
      technicalDetails: [
        'Aplicaciones modernas basadas en Electron (Discord, Spotify, VS Code, Teams) guardan cachés gigantescas de renderizado Chromium dentro de `AppData\\Local`.',
        'Si necesitas liberar espacio, se pueden borrar las subcarpetas `Cache` de apps específicas sin borrar todo `AppData`.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Abrir Roaming y Local',
      steps: [
        '1. Presioná Win + R, escribí `%APPDATA%` y presioná Enter.',
        '2. Presioná Win + R, escribí `%LOCALAPPDATA%` y presioná Enter.',
      ],
      commandOrPath: '%APPDATA% y %LOCALAPPDATA%',
      expectedVisual: 'Explorador mostrando carpetas Roaming y Local de tu perfil.',
    },
    comprobalo: {
      instruction: 'Verificá el acceso a las tres ramas de AppData en tu perfil.',
      actionPrompt: 'Registrá las rutas de AppData.',
      validationKey: 'APPDATA_RAMAS_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿En cuál de las subcarpetas de AppData se guardan habitualmente las cachés temporales pesadas de navegadores web como Google Chrome o Edge?',
      instruction: 'Seleccioná la rama correcta:',
      options: [
        { id: 'ad1', text: 'AppData\\Local (%LOCALAPPDATA%), porque son datos no itinerantes específicos de la máquina actual.', isCorrect: true, feedback: '¡Exacto! Local guarda cachés pesadas que no deben viajar en red.' },
        { id: 'ad2', text: 'AppData\\Roaming', isCorrect: false, feedback: 'Incorrecto: Roaming guarda configuraciones pequeñas que deben sincronizarse.' },
      ],
    },
    evidencia: {
      fieldName: 'APPDATA_PATHS',
      targetDescription: 'Rutas resueltas de %APPDATA% y %LOCALAPPDATA%',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-08',
    code: '02.08',
    title: 'Temp',
    subtitle: 'El depósito de archivos volátiles',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Un archivo PDF adjunto que abriste en el correo, un instalador descomprimiendo archivos... todo pasa por la carpeta Temp. Con los meses, puede acumular miles de archivos obsoletos.',
      mythVsTruth: {
        mentira: '“Borrar la carpeta Temp hace que el procesador funcione al doble de velocidad.”',
        verdad: 'Borrar Temp libera espacio en disco rígido/SSD, pero no aumenta directamente los FPS ni la frecuencia de reloj del procesador.',
        comprobalo: 'Abre `%TEMP%` con Win+R y observa el contenido.',
      },
    },
    entende: {
      title: 'Las Dos Carpetas Temp en Windows',
      explanation: [
        '• Temp de Usuario: `%TEMP%` (apunta a `C:\\Users\\<Usuario>\\AppData\\Local\\Temp`).',
        '• Temp de Sistema: `C:\\Windows\\Temp` (para procesos y servicios del sistema).',
      ],
    },
    profundiza: {
      title: 'Archivos Bloqueados en Temp',
      technicalDetails: [
        'Si intentas borrar todo en Temp y Windows te indica "El archivo está en uso", NO fuerces la eliminación con herramientas destructivas.',
        'Un archivo bloqueado en Temp pertenece a un programa activo que está operando en ese instante.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Inspeccionar la carpeta Temp de tu usuario',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `%TEMP%` y presioná Enter.',
      ],
      commandOrPath: '%TEMP%',
      expectedVisual: 'Directorio de archivos temporales de tu usuario.',
    },
    comprobalo: {
      instruction: 'Anotá la ruta resuelta de tu carpeta Temp.',
      actionPrompt: 'Registrá la ubicación de Temp.',
      validationKey: 'TEMP_PATH_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Al intentar vaciar la carpeta Temp, Windows indica que 3 archivos no se pueden borrar porque están en uso. ¿Qué debe hacer un técnico?',
      instruction: 'Seleccioná la acción correcta:',
      options: [
        { id: 'tm1', text: 'Omitir esos 3 archivos, ya que pertenecen a programas que están ejecutándose activamente.', isCorrect: true, feedback: '¡Impecable! Regla de taller: Nunca forzar el borrado de archivos en uso activo.' },
        { id: 'tm2', text: 'Usar un programa especial para forzar el borrado sin cerrar las apps.', isCorrect: false, feedback: 'Incorrecto: Puede causar cuelgues o pérdida de datos no guardados.' },
      ],
    },
    evidencia: {
      fieldName: 'TEMP_PATH',
      targetDescription: 'Ruta resuelta de la variable %TEMP%',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-09',
    code: '02.09',
    title: 'Prefetch',
    subtitle: 'El acelerador de arranque de aplicaciones',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Uno de los mitos más antiguos de internet dice: "Borrá la carpeta Prefetch para acelerar Windows". Quienes lo hacen logran exactamente el efecto opuesto: hacer que las apps tarden MÁS en abrir.',
      mythVsTruth: {
        mentira: '“Borrar la carpeta C:\\Windows\\Prefetch limpia la memoria RAM y acelera el equipo.”',
        verdad: 'Prefetch guarda mapas de lectura anticipada de disco. Al borrarlo, Windows debe volver a analizar de cero cada app al abrirla, ralentizando el inicio.',
        comprobalo: 'Inspecciona los archivos `.pf` dentro de `C:\\Windows\\Prefetch`.',
      },
    },
    entende: {
      title: 'Cómo Funciona Prefetch',
      explanation: [
        '• Función: Cuando abres un programa, el servicio SysMain monitorea qué archivos DLL y datos se leen durante los primeros 10 segundos.',
        '• Archivo `.pf`: Guarda ese mapa de lectura para precargarlo de forma secuencial en el siguiente inicio.',
        '• Mantenimiento Autónomo: Windows limita automáticamente el tamaño de Prefetch a un máximo de 128 archivos. No requiere intervención humana.',
      ],
    },
    profundiza: {
      title: 'SSD NVMe y Prefetch',
      technicalDetails: [
        'En SSDs modernos ultra-rápidos, Windows ajusta el comportamiento de Prefetch/SysMain para priorizar la precarga de aplicaciones sobre la defragmentación.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el directorio Prefetch',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `C:\\Windows\\Prefetch` y presioná Enter (requiere aceptar confirmación de permisos).',
      ],
      commandOrPath: 'C:\\Windows\\Prefetch',
      expectedVisual: 'Lista de archivos con extensión .pf que corresponden a aplicaciones ejecutadas recientemete.',
    },
    comprobalo: {
      instruction: 'Anotá el propósito real de la tecnología Prefetch.',
      actionPrompt: 'Registrá la función de la carpeta Prefetch.',
      validationKey: 'PREFETCH_MYTH_DISPELLED',
    },
    microdesafio: {
      type: 'MYTH_VS_TRUTH',
      question: '¿Por qué borrar manualmente los archivos .pf de la carpeta Prefetch empeora el rendimiento al abrir aplicaciones?',
      instruction: 'Seleccioná la razón técnica:',
      options: [
        { id: 'pf_m1', text: 'Porque obliga al sistema a reconstruir el mapa de lectura desde cero realizando accesos aleatorios a disco más lentos.', isCorrect: true, feedback: '¡Exacto! Prefetch existe para acelerar, borralo causa lentitud temporal.' },
        { id: 'pf_m2', text: 'Porque elimina la memoria RAM del procesador.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PREFETCH_KNOWLEDGE_VERIFIED',
      targetDescription: 'Comprensión técnica del mecanismo Prefetch / SysMain',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-10',
    code: '02.10',
    title: 'WinSxS',
    subtitle: 'La tienda de componentes del sistema (Component Store)',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Revisás el espacio en disco con un analizador gráfico y ves que `C:\\Windows\\WinSxS` ocupa 15 GB o más. Te dan ganas de borrarla de inmediato. Si lo hacés, la PC no volverá a arrancar nunca más.',
      mythVsTruth: {
        mentira: '“WinSxS duplicó todos los archivos de mi Windows y es puro espacio desperdiciado.”',
        verdad: 'WinSxS utiliza enlaces duros (Hard Links). Un mismo archivo parece ocupar espacio en System32 y WinSxS, pero físicamente apuntan al mismo bloque único en el disco.',
        comprobalo: 'Usa la herramienta oficial DISM para analizar el tamaño real de WinSxS.',
      },
    },
    entende: {
      title: 'El Depósito de Componentes del Kernel',
      explanation: [
        '• WinSxS (Windows Side-by-Side): Mantiene todas las versiones de componentes del sistema para permitir reparar archivos corruptos con SFC /DISM y desinstalar actualizaciones defectuosas.',
        '• Regla de Oro: NUNCA borrar archivos dentro de WinSxS con la tecla Delete.',
      ],
    },
    profundiza: {
      title: 'Hard Links (Enlaces Duros) en NTFS',
      technicalDetails: [
        'Un Hard Link es múltiples entradas de directorio apuntando al mismo MFT Inode físico.',
        'El Explorador de Windows suele sumar el tamaño de ambas entradas, reportando un tamaño falso mayor al real.',
      ],
      crossReference: 'Análisis profundo de WinSxS y limpieza oficial con DISM en Sector 34.',
    },
    miraloEnTuPc: {
      actionName: 'Analizar WinSxS con DISM por consola',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí: `Dism /Online /Cleanup-Image /AnalyzeComponentStore` (requiere elevación).',
      ],
      commandOrPath: 'Dism /Online /Cleanup-Image /AnalyzeComponentStore',
      expectedVisual: 'Reporte oficial de DISM indicando si el Component Store requiere limpieza.',
    },
    comprobalo: {
      instruction: 'Comprendé el concepto de Hard Links en WinSxS.',
      actionPrompt: 'Registrá la regla de no borrado manual de WinSxS.',
      validationKey: 'WINSXS_RULES_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué el Explorador de Windows suele reportar un tamaño engañosamente alto para la carpeta WinSxS?',
      instruction: 'Seleccioná la causa técnica:',
      options: [
        { id: 'ws1', text: 'Porque WinSxS usa Hard Links (enlaces duros) hacia System32 y el Explorador cuenta el mismo archivo físico dos veces.', isCorrect: true, feedback: '¡Brillante! Los Hard Links engañan a los contadores ingenuos de espacio.' },
        { id: 'ws2', text: 'Porque WinSxS oculta virus comprimidos.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WINSXS_CONCEPT_VERIFIED',
      targetDescription: 'Comprensión de enlaces duros y regla de no borrado de WinSxS',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-11',
    code: '02.11',
    title: 'DriverStore',
    subtitle: 'El repositorio central de controladores firmados',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Conectás un mouse, un pendrive o una webcam nueva y en 3 segundos Windows dice: "El dispositivo está listo para usarse". ¿De dónde sacó el driver tan rápido sin pedirte un CD ni descargar nada?',
      mythVsTruth: {
        mentira: '“Windows descarga de internet un driver nuevo cada vez que enchufás un pendrive.”',
        verdad: 'Windows consulta primero su repositorio local `DriverStore\\FileRepository` donde almacena paquetes de controladores preinstalados y validados.',
        comprobalo: 'Inspecciona la ruta `C:\\Windows\\System32\\DriverStore`.',
      },
    },
    entende: {
      title: 'El Ciclo de Instalación de Drivers (Plug and Play)',
      explanation: [
        '1. Staging: El paquete de driver (.inf, .sys, .cat) se valida con firma digital WQL y se copia a DriverStore.',
        '2. PnP Matching: Al conectar hardware, Plug and Play busca en DriverStore el ID de hardware (HWID) coincidente.',
        '3. Instalación: Copia el binario .sys activo a `System32\\drivers`.',
      ],
    },
    profundiza: {
      title: 'Controladores Huérfanos Viejos',
      technicalDetails: [
        'Al actualizar drivers de placa de video muchas veces, DriverStore puede conservar versiones antiguas inactivas.',
        'Para gestionarlos de forma segura se usa la herramienta nativa `pnputil.exe`.',
      ],
      crossReference: 'Gestión avanzada de drivers con Pnputil en Sector 15.',
    },
    miraloEnTuPc: {
      actionName: 'Consultar paquetes de drivers en DriverStore con pnputil',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `pnputil /enum-drivers` y presioná Enter.',
      ],
      commandOrPath: 'pnputil /enum-drivers',
      expectedVisual: 'Lista de controladores OEM publicados en el DriverStore local.',
    },
    comprobalo: {
      instruction: 'Anotá la función del DriverStore.',
      actionPrompt: 'Registrá el repositorio de controladores Plug and Play.',
      validationKey: 'DRIVERSTORE_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué herramienta oficial de línea de comandos de Windows permite enumerar y eliminar de forma segura paquetes de drivers antiguos de DriverStore?',
      instruction: 'Seleccioná la herramienta correcta:',
      options: [
        { id: 'ds1', text: 'pnputil.exe', isCorrect: true, feedback: '¡Impecable! pnputil es la herramienta oficial Plug and Play.' },
        { id: 'ds2', text: 'notepad.exe', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'DRIVERSTORE_PATH',
      targetDescription: 'Ruta y funcionamiento de DriverStore verificado',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-12',
    code: '02.12',
    title: 'Installer',
    subtitle: 'La caché oculta de paquetes MSI y MSP',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Querés desinstalar o reparar una aplicación desde el Panel de Control y el proceso falla lanzando el error: "No se puede encontrar el paquete de instalación .msi". Este fallo ocurre cuando alguien borró la carpeta oculta `C:\\Windows\\Installer`.',
      mythVsTruth: {
        mentira: '“La carpeta C:\\Windows\\Installer guarda instaladores viejos que ya se pueden borrar.”',
        verdad: 'Esa carpeta guarda las bases de datos MSI reducidas necesarias para REPARAR, MODIFICAR o DESINSTALAR tus programas de forma limpia.',
        comprobalo: 'Verificá la existencia de la carpeta oculta `C:\\Windows\\Installer`.',
      },
    },
    entende: {
      title: 'Por qué Se Necesitan los Archivos .msi Guardados',
      explanation: [
        '• Reparación: Si una DLL de una app se corrompe, Windows Installer reejecuta el paquete .msi guardado para restaurar solo ese archivo.',
        '• Desinstalación: El ejecutable de desinstalación requiere la tabla de acciones guardada en la caché MSI.',
      ],
    },
    profundiza: {
      title: 'Consecuencia de borrar C:\\Windows\\Installer',
      technicalDetails: [
        'Si se elimina manualmente esta carpeta, las aplicaciones instaladas mediante Windows Installer quedarán "bloqueadas": no se podrán actualizar, reparar ni desinstalar por medios normales.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar la existencia de la carpeta Installer',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `C:\\Windows\\Installer` y presioná Enter.',
      ],
      commandOrPath: 'C:\\Windows\\Installer',
      expectedVisual: 'Directorio oculto del sistema con archivos .msi y .msp con nombres hexadecimales.',
    },
    comprobalo: {
      instruction: 'Anotá el peligro de borrar la carpeta Installer.',
      actionPrompt: 'Registrá la regla de conservación de C:\\Windows\\Installer.',
      validationKey: 'INSTALLER_CACHE_RULES_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un técnico novato vació la carpeta C:\\Windows\\Installer. ¿Qué problema enfrentará el usuario semanas después?',
      instruction: 'Seleccioná la consecuencia real:',
      options: [
        { id: 'inst1', text: 'Imposibilidad de desinstalar, actualizar o reparar aplicaciones instaladas por paquetes MSI.', isCorrect: true, feedback: '¡Exacto! Rompe la capacidad de desinstalación y reparación.' },
        { id: 'inst2', text: 'El monitor dejará de mostrar colores.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'INSTALLER_RULES_CONFIRMED',
      targetDescription: 'Comprensión de la caché MSI en C:\\Windows\\Installer',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-13',
    code: '02.13',
    title: 'SoftwareDistribution',
    subtitle: 'El área de trabajo temporal de Windows Update',
    riskLevel: 'SPECIFIC_PROCEDURE',
    descubri: {
      hook: 'Windows Update se traba descargando una actualización en el 99%. ¿Dónde están esos gigabytes descargados a medio terminar? Están almacenados en la carpeta `C:\\Windows\\SoftwareDistribution`.',
      mythVsTruth: {
        mentira: '“Borrar SoftwareDistribution desinstala todas las actualizaciones de mi Windows.”',
        verdad: 'SoftwareDistribution es solo la caché de descargas temporales. Borrarla (tras detener el servicio `wuauserv`) borra los archivos temporales descargados para permitir reintentar la descarga limpia.',
        comprobalo: 'Inspecciona la subcarpeta `Download` dentro de SoftwareDistribution.',
      },
    },
    entende: {
      title: 'Estructura de SoftwareDistribution',
      explanation: [
        '• `Download`: Aloja los paquetes de parches descargados antes de ser aplicados.',
        '• `DataStore`: Mantiene la base de datos JET con el historial de actualizaciones buscadas.',
      ],
    },
    profundiza: {
      title: 'Procedimiento Correcto para Limpiar SoftwareDistribution',
      technicalDetails: [
        '1. Detener el servicio Windows Update (`net stop wuauserv`) y BITS (`net stop bits`).',
        '2. Renombrar o vaciar la carpeta `SoftwareDistribution`.',
        '3. Reiniciar los servicios (`net start wuauserv`).',
      ],
      crossReference: 'Reparación completa de Windows Update en Sector 20.',
    },
    miraloEnTuPc: {
      actionName: 'Ver la carpeta Download de Windows Update',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `C:\\Windows\\SoftwareDistribution\\Download` y presioná Enter.',
      ],
      commandOrPath: 'C:\\Windows\\SoftwareDistribution\\Download',
      expectedVisual: 'Subcarpetas con descargas temporales de actualizaciones.',
    },
    comprobalo: {
      instruction: 'Anotá el protocolo de reseteo de SoftwareDistribution.',
      actionPrompt: 'Registrá la ubicación de SoftwareDistribution.',
      validationKey: 'SOFTWAREDISTRIBUTION_PATH_VERIFIED',
    },
    microdesafio: {
      type: 'ORDER_SEQUENCE',
      question: 'Ordená los pasos correctos para reiniciar la carpeta SoftwareDistribution cuando Windows Update se traba:',
      instruction: 'Colocá en el orden técnico correcto:',
      sortableItems: [
        { id: 'su1', text: '1. Detener el servicio Windows Update (net stop wuauserv)', correctIndex: 0 },
        { id: 'su2', text: '2. Vaciar o renombrar la carpeta SoftwareDistribution', correctIndex: 1 },
        { id: 'su3', text: '3. Volver a iniciar el servicio (net start wuauserv)', correctIndex: 2 },
      ],
    },
    evidencia: {
      fieldName: 'SOFTWAREDISTRIBUTION_PROCEDURE',
      targetDescription: 'Procedimiento seguro para solucionar bloqueos de Windows Update',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-14',
    code: '02.14',
    title: 'Recovery',
    subtitle: 'El refugio del entorno WinRE',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Si tu Windows no puede iniciar por una falla grave, presionás F11 o la PC entra automáticamente al menú azul de "Opciones avanzadas de reparación". Esas herramientas residen en la imagen oculta WinRE dentro de `Recovery`.',
      mythVsTruth: {
        mentira: '“La carpeta Recovery solo ocupa espacio y se puede borrar tranquilamente.”',
        verdad: 'Borrar la imagen `WinRE.wim` dentro de Recovery elimina la capacidad del equipo de reparar el arranque o restaurar el sistema ante una falla.',
        comprobalo: 'Verificá el estado de WinRE mediante la herramienta `reagentc /info` en la consola.',
      },
    },
    entende: {
      title: 'WinRE (Windows Recovery Environment)',
      explanation: [
        '• Contenido: Aloja el binario ejecutable de rescate `WinRE.wim` (un mini Windows PE independiente).',
        '• Ubicación: Puede residir en la carpeta `C:\\Recovery` o en una partición de recuperación dedicada.',
      ],
    },
    profundiza: {
      title: 'Comando reagentc',
      technicalDetails: [
        'El comando `reagentc /info` permite verificar si el entorno de recuperación está habilitado y en qué partición exacta reside.',
      ],
      crossReference: 'Diagnóstico avanzado de WinRE y arranque en Sector 27.',
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el estado de WinRE con reagentc',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `reagentc /info` y presioná Enter.',
      ],
      commandOrPath: 'reagentc /info',
      expectedVisual: 'Información sobre el estado Habilitado/Deshabilitado del entorno de recuperación.',
    },
    comprobalo: {
      instruction: 'Anotá el estado del entorno de recuperación reportado por reagentc.',
      actionPrompt: 'Registrá la presencia de WinRE en tu sistema.',
      validationKey: 'WINRE_STATUS_RECORDED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué comando de Windows se utiliza para verificar la ubicación y el estado activo del Entorno de Recuperación (WinRE)?',
      instruction: 'Seleccioná el comando correcto:',
      options: [
        { id: 'rec1', text: 'reagentc /info', isCorrect: true, feedback: '¡Correcto! reagentc es el agente de configuración de WinRE.' },
        { id: 'rec2', text: 'ping 127.0.0.1', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WINRE_STATUS',
      targetDescription: 'Estado de habilitación de WinRE reportado por reagentc',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-15',
    code: '02.15',
    title: 'System Volume Information',
    subtitle: 'El baúl protegido de metadatos NTFS y Puntos de Restauración',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Conectás un pendrive en tu PC y al mostrar archivos ocultos ves una carpeta llamada `System Volume Information`. Intentás abrirla y Windows dice "Acceso denegado". ¿Quién vive ahí dentro?',
      mythVsTruth: {
        mentira: '“System Volume Information es un virus de pendrive.”',
        verdad: 'Es una carpeta de sistema del driver NTFS donde Windows guarda metadatos de volumen, bases de datos de indexación y copias de sombra VSS (Puntos de Restauración).',
        comprobalo: 'Comprueba los permisos ACLs de la carpeta en la raíz de C:.',
      },
    },
    entende: {
      title: 'Por qué Tiene Permisos Bloqueados',
      explanation: [
        '• Permisos: Por defecto ni siquiera un Administrador tiene permisos de LECTURA. Pertenece exclusivamente a la identidad `SYSTEM`.',
        '• Contenido: Copias de sombra VSS (Volume Shadow Copy), bases del servicio de búsqueda (Indexer) y tablas de deduplicación.',
      ],
    },
    profundiza: {
      title: 'No tomar Ownership por capricho',
      technicalDetails: [
        'Forzar permisos sobre System Volume Information en discos de sistema puede alterar el funcionamiento de los Puntos de Restauración.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar la existencia de la carpeta en C:',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `dir C:\\ /a` y observá la entrada `System Volume Information`.',
      ],
      commandOrPath: 'dir C:\ /a',
      expectedVisual: 'Entrada de directorio del sistema con atributos oculto y de sistema.',
    },
    comprobalo: {
      instruction: 'Anotá el propósito de System Volume Information.',
      actionPrompt: 'Registrá la regla de protección de metadatos NTFS.',
      validationKey: 'SYSVOLINFO_RULES_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué servicio de Windows almacena las instantáneas de los Puntos de Restauración dentro de System Volume Information?',
      instruction: 'Seleccioná el servicio correcto:',
      options: [
        { id: 'sv1', text: 'VSS (Volume Shadow Copy Service)', isCorrect: true, feedback: '¡Impecable! VSS administra las instantáneas de volumen.' },
        { id: 'sv2', text: 'Print Spooler', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SYSVOLINFO_VERIFIED',
      targetDescription: 'Comprensión de metadatos NTFS y copias VSS',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-16',
    code: '02.16',
    title: 'WindowsApps',
    subtitle: 'El santuario protegido de las aplicaciones UWP de Microsoft Store',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Instalás una aplicación o un juego desde Microsoft Store y querés modificar un archivo de configuración. Buscás en Program Files la carpeta `WindowsApps` e intentás entrar: Windows bloquea el acceso con un candado de seguridad.',
      mythVsTruth: {
        mentira: '“Debo tomar propiedad (Take Ownership) de WindowsApps para instalar mods de juegos libremente.”',
        verdad: 'Cambiar los permisos ACLs de WindowsApps suele corromper la firma digital de los paquetes UWP/MSIX, haciendo que las aplicaciones de Microsoft Store dejen de abrir.',
        comprobalo: 'Inspecciona la existencia de `C:\\Program Files\\WindowsApps`.',
      },
    },
    entende: {
      title: 'Empaquetamiento UWP / MSIX y Sandbox',
      explanation: [
        '• Formato: Las aplicaciones de Microsoft Store usan empaquetamiento firmado digitalmente.',
        '• Propietario: La carpeta pertenece a `NT SERVICE\\TrustedInstaller` para garantizar la integridad de los paquetes.',
      ],
    },
    profundiza: {
      title: 'Aislamiento de la tienda',
      technicalDetails: [
        'Las aplicaciones UWP se ejecutan en niveles de integridad aislados (AppContainer Sandbox). Alterar la estructura de carpetas en WindowsApps rompe la validación de identidad del paquete.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Verificar la carpeta WindowsApps',
      steps: [
        '1. Presioná Win + R, escribí `C:\\Program Files` y presioná Enter.',
        '2. Activá "Elementos ocultos" para visualizar `WindowsApps`.',
      ],
      commandOrPath: 'C:\\Program Files\\WindowsApps',
      expectedVisual: 'Carpeta protegida con candado de seguridad.',
    },
    comprobalo: {
      instruction: 'Anotá la advertencia sobre no cambiar permisos en WindowsApps.',
      actionPrompt: 'Registrá la regla de integridad UWP.',
      validationKey: 'WINDOWSAPPS_PERMISSIONS_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué cambiar manualmente los permisos de seguridad (ACLs) de C:\\Program Files\\WindowsApps suele provocar que las apps de la Tienda de Microsoft no abran?',
      instruction: 'Seleccioná la causa técnica:',
      options: [
        { id: 'wa1', text: 'Porque invalida el modelo de confianza de firmas digitales y la verificación del contenedor AppContainer.', isCorrect: true, feedback: '¡Exacto! Rompe el modelo de confianza UWP.' },
        { id: 'wa2', text: 'Porque elimina la conexión de red Wi-Fi.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'WINDOWSAPPS_SECURITY_VERIFIED',
      targetDescription: 'Comprensión del empaquetamiento UWP y permisos de WindowsApps',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-17',
    code: '02.17',
    title: '$Recycle.Bin',
    subtitle: 'La estructura oculta de la Papelera de Reciclaje por unidad',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'En el escritorio ves un solo icono de "Papelera de reciclaje". Sin embargo, si tenés 3 discos rígidos (C:, D: y E:), cada volumen tiene su propia carpeta física oculta `$Recycle.Bin`.',
      mythVsTruth: {
        mentira: '“Los archivos que borrás van a una carpeta central en C:\\.”',
        verdad: 'Cada unidad de almacenamiento mantiene su propio directorio `$Recycle.Bin` organizado internamente por el SID (Security Identifier) de cada usuario.',
        comprobalo: 'Inspecciona la raíz de tu disco D: o E: mostrando archivos protegidos.',
      },
    },
    entende: {
      title: 'Estructura Interna de $Recycle.Bin',
      explanation: [
        '• Aislamiento por Usuario: Dentro de `$Recycle.Bin` existe una subcarpeta para cada usuario representada por su SID (ej. `S-1-5-21-...`).',
        '• Privacidad: Un usuario A no puede ver los archivos que el usuario B envió a la papelera en la misma máquina.',
      ],
    },
    profundiza: {
      title: 'Archivos $I y $R',
      technicalDetails: [
        'Al borrar un archivo `Documento.docx`, Windows lo renombró internamente dentro de `$Recycle.Bin` creando dos archivos: `$R...` (contenido real) y `$I...` (metadatos con nombre original y fecha).',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar la carpeta $Recycle.Bin en CMD',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `dir C:\\$Recycle.Bin /a` y presioná Enter.',
      ],
      commandOrPath: 'dir C:\$Recycle.Bin /a',
      expectedVisual: 'Lista de carpetas asociadas a los SIDs de los usuarios.',
    },
    comprobalo: {
      instruction: 'Anotá el aislamiento de la papelera por volumen y SID.',
      actionPrompt: 'Registrá la estructura interna de la Papelera.',
      validationKey: 'RECYCLE_BIN_SID_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Cómo garantiza Windows que el Usuario A no pueda curiosear los archivos eliminados por el Usuario B en un disco compartido?',
      instruction: 'Seleccioná el mecanismo de seguridad:',
      options: [
        { id: 'rb1', text: 'Creando subcarpetas separadas dentro de $Recycle.Bin identificadas por el SID único de cada usuario con permisos restringidos.', isCorrect: true, feedback: '¡Brillante! El SID aísla los archivos eliminados por usuario.' },
        { id: 'rb2', text: 'Encriptando la pantalla del monitor.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'RECYCLE_BIN_STRUCTURE',
      targetDescription: 'Estructura de $Recycle.Bin por volumen y SID',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-18',
    code: '02.18',
    title: 'Panther',
    subtitle: 'El registro de auditoría de instalación y actualización de Windows',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Si una actualización de versión de Windows (ej. de 23H2 a 24H2) falla y vuelve atrás, los ingenieros no adivinan la causa: abren los archivos de log dentro de la carpeta `Panther`.',
      mythVsTruth: {
        mentira: '“Si Windows falla al instalarse, no queda ningún registro de la causa.”',
        verdad: 'La carpeta Panther guarda archivos como `setupact.log` y `setuperr.log` donde el instalador detalla cada driver o app incompatible.',
        comprobalo: 'Inspecciona si existe la ruta `C:\\Windows\\Panther`.',
      },
    },
    entende: {
      title: 'Ubicación de Panther',
      explanation: [
        '• Ruta Habitual: `C:\\Windows\\Panther` o `C:\\$WINDOWS.~BT\\Sources\\Panther` durante upgrades.',
        '• Uso: Análisis pericial de fallas de Setup e instalación.',
      ],
    },
    profundiza: {
      title: 'Herramienta SetupDiag',
      technicalDetails: [
        'Microsoft provee la herramienta oficial `SetupDiag` que escanea automáticamente los registros en Panther y emite la regla exacta de la falla.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar la ruta Panther',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `C:\\Windows\\Panther` y presioná Enter.',
      ],
      commandOrPath: 'C:\\Windows\\Panther',
      expectedVisual: 'Logs de auditoría del proceso de instalación.',
    },
    comprobalo: {
      instruction: 'Anotá la función de la carpeta Panther.',
      actionPrompt: 'Registrá el repositorio de logs de Setup.',
      validationKey: 'PANTHER_LOGS_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué tipo de problemas se diagnostican analizando los registros en la carpeta C:\\Windows\\Panther?',
      instruction: 'Seleccioná el escenario correcto:',
      options: [
        { id: 'pan1', text: 'Fallas, bloqueos e incompatibilidades de drivers durante la actualización de versión de Windows.', isCorrect: true, feedback: '¡Exacto! Panther es la fuente oficial de logs de Setup.' },
        { id: 'pan2', text: 'Errores de reproducción de video en YouTube.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'PANTHER_PATH',
      targetDescription: 'Confirmación de la ruta de logs Panther',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-19',
    code: '02.19',
    title: 'CBS.log',
    subtitle: 'El diario de operaciones de reparación SFC y Servicing',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Ejecutás el comando `sfc /scannow` y la terminal responde: "Protección de recursos de Windows encontró archivos dañados y los reparó correctamente. Para más detalles, consulte CBS.log".',
      mythVsTruth: {
        mentira: '“CBS.log es un virus porque crece en megabytes.”',
        verdad: 'CBS.log (Component-Based Servicing) es el archivo de registro oficial donde SFC y DISM escriben cada reparación de componentes.',
        comprobalo: 'Abre la carpeta `C:\\Windows\\Logs\\CBS`.',
      },
    },
    entende: {
      title: 'Lectura de CBS.log',
      explanation: [
        '• Ruta: `C:\\Windows\\Logs\\CBS\\CBS.log`.',
        '• Utilidad: Permite identificar exactamente qué archivo .dll o ejecutable estaba corrupto y cómo fue reemplazado.',
      ],
    },
    profundiza: {
      title: 'Filtrar registros SFC desde CBS.log',
      technicalDetails: [
        'Para no leer un archivo de texto de 50.000 líneas, se usa el comando `findstr /c:"[SR]" %windir%\\Logs\\CBS\\CBS.log > %userprofile%\\Desktop\\sfcdetails.txt`.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Ubicar el archivo CBS.log',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `C:\\Windows\\Logs\\CBS` y presioná Enter.',
      ],
      commandOrPath: 'C:\\Windows\\Logs\\CBS',
      expectedVisual: 'Directorio con CBS.log y archivos comprimidos de registros anteriores.',
    },
    comprobalo: {
      instruction: 'Anotá el comando para extraer detalles de SFC desde CBS.log.',
      actionPrompt: 'Registrá la ubicación de CBS.log.',
      validationKey: 'CBS_LOG_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué etiqueta de filtro en el comando `findstr` permite extraer únicamente las líneas de reparación registradas por SFC dentro de CBS.log?',
      instruction: 'Seleccioná la etiqueta correcta:',
      options: [
        { id: 'cbs1', text: '[SR] (System Resource)', isCorrect: true, feedback: '¡Impecable! [SR] aísla las entradas de System File Checker.' },
        { id: 'cbs2', text: '[ERROR]', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'CBS_LOG_PATH',
      targetDescription: 'Ruta y método de filtrado de CBS.log',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-20',
    code: '02.20',
    title: 'DISM.log',
    subtitle: 'El registro de servicio y reparación de la imagen de Windows',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Cuando ejecutás `DISM /Online /Cleanup-Image /RestoreHealth`, Windows repara la imagen base del sistema. Todo el detalle técnico de esa operación queda registrado en `DISM.log`.',
      mythVsTruth: {
        mentira: '“DISM.log es un programa peligroso.”',
        verdad: 'Es un archivo de texto de registro generado por la herramienta de administración de imágenes de despliegue DISM.',
        comprobalo: 'Inspecciona `C:\\Windows\\Logs\\DISM\\dism.log`.',
      },
    },
    entende: {
      title: 'Ubicación y Propósito de DISM.log',
      explanation: [
        '• Ruta: `C:\\Windows\\Logs\\DISM\\dism.log`.',
        '• Diagnóstico: Muestra qué paquetes de parches o características se descargaron desde Windows Update para reparar el Component Store.',
      ],
    },
    profundiza: {
      title: 'Interpretación en taller',
      technicalDetails: [
        'Si DISM falla con error 0x800f081f (Source files not found), el log indicará qué payload exacto faltó en la tienda local.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Navegar a la carpeta de logs de DISM',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `C:\\Windows\\Logs\\DISM` y presioná Enter.',
      ],
      commandOrPath: 'C:\\Windows\\Logs\\DISM',
      expectedVisual: 'Archivo dism.log presente en el directorio.',
    },
    comprobalo: {
      instruction: 'Anotá la ubicación oficial de DISM.log.',
      actionPrompt: 'Registrá la ruta del log de DISM.',
      validationKey: 'DISM_LOG_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Dónde reside el archivo de registro generado tras ejecutar operaciones de reparación con la herramienta DISM?',
      instruction: 'Seleccioná la ruta canónica:',
      options: [
        { id: 'dism1', text: 'C:\\Windows\\Logs\\DISM\\dism.log', isCorrect: true, feedback: '¡Exacto! Es la ruta canónica del log.' },
        { id: 'dism2', text: 'C:\\ProgramData\\dism.txt', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'DISM_LOG_PATH',
      targetDescription: 'Ubicación verificada de dism.log',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-21',
    code: '02.21',
    title: 'Minidump',
    subtitle: 'La radiografía compacta del pantallazo azul (BSOD)',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Suena una alarma, la pantalla se vuelve azul con un código de detención (`CRITICAL_PROCESS_DIED`) y la PC se reinicia. Al volver a encender, Windows guardó un pequeño archivo `.dmp` dentro de `C:\\Windows\\Minidump`.',
      mythVsTruth: {
        mentira: '“Un archivo Minidump contiene todas mis fotos y contraseñas.”',
        verdad: 'Un Minidump ocupa solo ~256 KB y guarda únicamente el código de error, el módulo de driver responsable y la pila de llamadas del kernel en el milisegundo del colapso.',
        comprobalo: 'Inspecciona si existe `C:\\Windows\\Minidump` en tu sistema.',
      },
    },
    entende: {
      title: 'Qué Contiene un Minidump',
      explanation: [
        '• Tamaño: Pequeño (~64 KB a 1 MB).',
        '• Datos: Código de parada de la BSOD (Bugcheck code), lista de drivers cargados en memoria y registro de registros de CPU.',
      ],
    },
    profundiza: {
      title: 'Análisis con WinDbg / BlueScreenView',
      technicalDetails: [
        'Herramientas periciales leen los archivos `.dmp` y señalan con precisión el archivo `.sys` causante de la falla.',
      ],
      crossReference: 'Análisis pericial completo de BSODs en Sector 28.',
    },
    miraloEnTuPc: {
      actionName: 'Verificar la carpeta Minidump',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `C:\\Windows\\Minidump` y presioná Enter.',
      ],
      commandOrPath: 'C:\\Windows\\Minidump',
      expectedVisual: 'Directorio de volcados de memoria reducidos tras un colapso.',
    },
    comprobalo: {
      instruction: 'Anotá el propósito de los archivos Minidump.',
      actionPrompt: 'Registrá la ubicación de los volcados reducidos.',
      validationKey: 'MINIDUMP_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué un archivo Minidump de ~256 KB es la primera fuente de información que consulta un técnico tras un Pantallazo Azul?',
      instruction: 'Seleccioná la justificación técnica:',
      options: [
        { id: 'md1', text: 'Porque registra exactamente el código de parada BSOD y el módulo de controlador (.sys) que causó el colapso del kernel.', isCorrect: true, feedback: '¡Brillante! Identifica al driver culpable.' },
        { id: 'md2', text: 'Porque contiene un video del momento del fallo.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'MINIDUMP_PATH',
      targetDescription: 'Ubicación y función de C:\\Windows\\Minidump',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-22',
    code: '02.22',
    title: 'MEMORY.DMP',
    subtitle: 'El volcado completo de memoria del kernel',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'A diferencia de los pequeños Minidumps, a veces encontrás un archivo gigante en `C:\\Windows\\MEMORY.DMP` que ocupa varios Gigabytes. Es la copia directa de toda la memoria del núcleo al colapsar.',
      mythVsTruth: {
        mentira: '“MEMORY.DMP y Minidump son exactamente lo mismo.”',
        verdad: 'Minidump guarda solo la cabecera (~256 KB). MEMORY.DMP guarda todo el estado de la memoria RAM del modo núcleo (~1 GB a 16 GB o más).',
        comprobalo: 'Compará la configuración de volcados en `sysdm.cpl`.',
      },
    },
    entende: {
      title: 'Tipos de Volcados de Memoria en Windows',
      explanation: [
        '1. Volcado Pequeño (Minidump): 256 KB.',
        '2. Volcado de Núcleo (Kernel Dump): Solo la memoria del Kernel NT (habitualmente 1-4 GB).',
        '3. Volcado Completo (Complete Dump): Toda la RAM física instalada.',
      ],
    },
    profundiza: {
      title: 'Configuración en sysdm.cpl',
      technicalDetails: [
        'En `sysdm.cpl` > Opciones avanzadas > Inicio y recuperación se puede seleccionar el tipo de volcado preferido.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Abrir configuración de volcados en Propiedades del Sistema',
      steps: [
        '1. Presioná Win + R, escribí `sysdm.cpl` y presioná Enter.',
        '2. Pestaña "Opciones avanzadas" > Configuración en "Inicio y recuperación".',
      ],
      commandOrPath: 'sysdm.cpl',
      shortcut: 'Win + R → sysdm.cpl',
      expectedVisual: 'Panel indicando la ruta del archivo de volcado (C:\\Windows\\MEMORY.DMP).',
    },
    comprobalo: {
      instruction: 'Anotá la diferencia de tamaño entre Minidump y MEMORY.DMP.',
      actionPrompt: 'Registrá el volcado completo de kernel.',
      validationKey: 'MEMORY_DMP_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Dónde se configura en Windows el tipo de volcado de memoria (Minidump vs Volcado de Kernel) que se generará ante un fallo grave?',
      instruction: 'Seleccioná el panel correcto:',
      options: [
        { id: 'dmp1', text: 'sysdm.cpl (Propiedades del sistema) > Opciones avanzadas > Inicio y recuperación.', isCorrect: true, feedback: '¡Exacto! Panel clásico sysdm.cpl.' },
        { id: 'dmp2', text: 'En la Calculadora de Windows.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'MEMORY_DMP_CONFIG',
      targetDescription: 'Configuración de volcados en sysdm.cpl',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-23',
    code: '02.23',
    title: 'Carpetas ocultas',
    subtitle: 'El atributo Hidden y la interfaz del Explorador',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Vas a la carpeta de un amigo y ves que faltan carpetas como `AppData` o `ProgramData`. La razón es simple: tienen activado el atributo de visibilidad "Oculto" (Hidden).',
      mythVsTruth: {
        mentira: '“Cualquier carpeta oculta fue escondida por un virus o hacker.”',
        verdad: 'Windows oculta carpetas de configuración delicadas por defecto para evitar que usuarios sin experiencia borren archivos esenciales por accidente.',
        comprobalo: 'Activa la casilla "Elementos ocultos" en la pestaña Vista del Explorador de archivos.',
      },
    },
    entende: {
      title: 'Cómo Mostrar Elementos Ocultos',
      explanation: [
        '• En Windows 11: Explorador de Archivos > Ver > Mostrar > "Elementos ocultos".',
        '• Atributo de Archivo: Marca `H` (Hidden) en la tabla del sistema de archivos NTFS.',
      ],
    },
    profundiza: {
      title: 'Atributo de Archivo vs Permisos NTFS',
      technicalDetails: [
        'El atributo Oculto es solo una preferencia de visualización para las aplicaciones de interfaz.',
        'No reemplaza los permisos de seguridad (ACLs): un archivo oculto sin permisos seguirá dando "Acceso denegado".',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Activar Elementos Ocultos en Explorador',
      steps: [
        '1. Abrí el Explorador de Archivos (Win + E).',
        '2. Menú Ver > Mostrar > Seleccioná "Elementos ocultos".',
      ],
      shortcut: 'Win + E → Ver → Mostrar → Elementos ocultos',
      expectedVisual: 'Las carpetas ocultas (como AppData) aparecen semitransparentes en la lista.',
    },
    comprobalo: {
      instruction: 'Comprobá el cambio visual de carpetas como AppData al activar elementos ocultos.',
      actionPrompt: 'Registrá el estado de visibilidad de elementos ocultos.',
      validationKey: 'HIDDEN_FOLDERS_TOGGLED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿El atributo "Oculto" (Hidden) protege un archivo contra la lectura no autorizada por parte de otros usuarios?',
      instruction: 'Seleccioná el concepto técnico correcto:',
      options: [
        { id: 'hf1', text: 'NO: Oculto es solo una marca de visualización de interfaz, no un mecanismo de cifrado ni de permisos de seguridad.', isCorrect: true, feedback: '¡Exacto! No es un mecanismo de seguridad de acceso.' },
        { id: 'hf2', text: 'SÍ: Nadie en la PC puede leer un archivo oculto.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'HIDDEN_ELEMENTS_AWARENESS',
      targetDescription: 'Dominio del atributo Oculto en el Explorador',
      defaultProvenance: 'OBSERVED',
    },
  },

  {
    id: 'inv-02-24',
    code: '02.24',
    title: 'Archivos protegidos del sistema',
    subtitle: 'El segundo nivel de invisibilidad de Windows',
    riskLevel: 'NEVER_DELETE_MANUALLY',
    descubri: {
      hook: 'Incluso tras activar "Elementos ocultos", archivos como `pagefile.sys` o `swapfile.sys` siguen invisibles. Requieren desmarcar la casilla "Ocultar archivos protegidos del sistema operativo".',
      mythVsTruth: {
        mentira: '“Con marcar Elementos ocultos ya veo absolutamente todo en el disco.”',
        verdad: 'Windows requiere una confirmación de advertencia de seguridad adicional para mostrar los archivos con el atributo de Sistema (`S`).',
        comprobalo: 'Abre Opciones de Carpeta en el Panel de Control clásico (`control folders`).',
      },
    },
    entende: {
      title: 'Opciones de Carpeta (control folders)',
      explanation: [
        '• Advertencia de Windows: Muestra un mensaje explícito: "Ha elegido mostrar archivos protegidos del sistema... Estos archivos son necesarios para iniciar Windows".',
        '• Ejemplos: `bootmgr`, `pagefile.sys`, `hiberfil.sys`, `$Recycle.Bin`.',
      ],
    },
    profundiza: {
      title: 'Diferencia entre Atributo H y Atributo S',
      technicalDetails: [
        '• Atributo H (Hidden): Escondido para limpieza de interfaz.',
        '• Atributo S (System): Escondido críticamente porque su alteración impide el arranque.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Abrir Opciones de Carpeta clásicas',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `control folders` y presioná Enter.',
        '3. Pestaña "Ver" > Observá la casilla "Ocultar archivos protegidos del sistema operativo".',
      ],
      commandOrPath: 'control folders',
      shortcut: 'Win + R → control folders',
      expectedVisual: 'Panel clásico de Opciones del Explorador de archivos.',
    },
    comprobalo: {
      instruction: 'Anotá el panel de control de archivos protegidos.',
      actionPrompt: 'Registrá las Opciones de Carpeta.',
      validationKey: 'PROTECTED_FILES_PANEL_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué comando rápido en Win+R abre directamente el cuadro clásico de Opciones de Carpeta?',
      instruction: 'Seleccioná el atajo correcto:',
      options: [
        { id: 'pf_c1', text: 'control folders', isCorrect: true, feedback: '¡Impecable! control folders abre las opciones del Explorador.' },
        { id: 'pf_c2', text: 'notepad', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'CONTROL_FOLDERS_VERIFIED',
      targetDescription: 'Acceso a Opciones de Carpeta con control folders',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-25',
    code: '02.25',
    title: 'Hidden / System / Read-only',
    subtitle: 'La trinidad de atributos básicos en FAT/NTFS',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Hacés clic derecho en un archivo, seleccionás Propiedades y ves casillas de verificación como "Solo lectura" u "Oculto". Son los atributos DOS/NTFS históricos.',
      mythVsTruth: {
        mentira: '“Poner Solo lectura evita que un archivo pueda ser borrado por un Administrador.”',
        verdad: 'Solo lectura (Read-only) impide modificaciones accidentales del contenido, pero no evita que el archivo sea eliminado si la aplicación o el usuario confirman el borrado.',
        comprobalo: 'Inspecciona las propiedades de un archivo de prueba en tu Escritorio.',
      },
    },
    entende: {
      title: 'Los 3 Atributos Clásicos',
      explanation: [
        '1. `R` (Read-only / Solo lectura): Protege el contenido contra escrituras fortuitas.',
        '2. `H` (Hidden / Oculto): Oculta el elemento en exploradores gráficos.',
        '3. `S` (System / Sistema): Marca el archivo como componente del sistema operativo.',
      ],
    },
    profundiza: {
      title: 'Atributos vs Permisos NTFS',
      technicalDetails: [
        'Los atributos son metadatos simples de 1 bit heredados de MS-DOS.',
        'Los permisos NTFS son listas complejas (ACLs) asociadas a identificadores de usuario (SIDs) con reglas de lectura, escritura y ejecución.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Ver atributos en cuadro de propiedades',
      steps: [
        '1. Hacé clic derecho en cualquier archivo de texto en tu Escritorio.',
        '2. Seleccioná "Propiedades".',
        '3. Mirá en la parte inferior el apartado "Atributos".',
      ],
      expectedVisual: 'Cuadro de diálogo mostrando casillas Solo lectura y Oculto.',
    },
    comprobalo: {
      instruction: 'Anotá la diferencia entre atributos R/H/S y permisos NTFS.',
      actionPrompt: 'Registrá la trinidad de atributos.',
      validationKey: 'ATTRIBUTES_CONCEPT_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Cuál es la diferencia fundamental entre el atributo Read-only (R) y un permiso NTFS de Denegar Escritura?',
      instruction: 'Seleccioná la respuesta técnica:',
      options: [
        { id: 'att1', text: 'Read-only es un indicador de metadato simple de archivo; los permisos NTFS son reglas de seguridad asignadas a usuarios específicos.', isCorrect: true, feedback: '¡Exacto! Distinción clave entre atributos y seguridad NTFS.' },
        { id: 'att2', text: 'Son exactamente lo mismo.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'ATTRIBUTES_UNDERSTOOD',
      targetDescription: 'Comprensión de los atributos R, H y S',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-26',
    code: '02.26',
    title: 'attrib',
    subtitle: 'El comando de la consola para manipular banderas de archivo',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Un malware en un pendrive convirtió todas tus carpetas en accesos directos ocultos. Para recuperarlas sin programas extraños, los técnicos usan el comando nativo `attrib`.',
      mythVsTruth: {
        mentira: '“No se pueden cambiar los atributos de archivos ocultos del sistema desde la consola.”',
        verdad: 'El comando `attrib -h -s` remueve de forma instantánea las banderas de Oculto y Sistema de cualquier archivo en segundos.',
        comprobalo: 'Abre CMD y prueba `attrib /?`.',
      },
    },
    entende: {
      title: 'Sintaxis del Comando attrib',
      explanation: [
        '• `+` : Establece un atributo.',
        '• `-` : Quita un atributo.',
        '• `h` : Oculto (Hidden).',
        '• `s` : Sistema (System).',
        '• `r` : Solo lectura (Read-only).',
        '• Ejemplo de Recuperación en Pendrives: `attrib -h -s -r D:\*.* /s /d`.',
      ],
    },
    profundiza: {
      title: 'Modificadores /S y /D',
      technicalDetails: [
        '• `/s`: Aplica el comando de forma recursiva a todos los archivos dentro de subcarpetas.',
        '• `/d`: Aplica el comando también a los nombres de las carpetas.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Probar attrib en consola',
      steps: [
        '1. Presioná Win + R, escribí `cmd` y presioná Enter.',
        '2. Escribí `attrib /?` y presioná Enter.',
      ],
      commandOrPath: 'attrib /?',
      expectedVisual: 'Manual de sintaxis del comando attrib en la terminal.',
    },
    comprobalo: {
      instruction: 'Anotá el comando para quitar marcas de oculto en pendrives.',
      actionPrompt: 'Registrá el comando attrib.',
      validationKey: 'ATTRIB_COMMAND_VERIFIED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Qué combinación de parámetros con `attrib` quita simultáneamente las marcas de Oculto, Sistema y Solo lectura a todos los elementos de un pendrive E:?',
      instruction: 'Seleccioná la línea de comandos correcta:',
      options: [
        { id: 'at_cmd1', text: 'attrib -h -s -r E:\\*.* /s /d', isCorrect: true, feedback: '¡Impecable! Quita las 3 banderas de forma recursiva.' },
        { id: 'at_cmd2', text: 'attrib +h +s +r', isCorrect: false, feedback: 'Incorrecto: Eso ocultaría aún más los elementos.' },
      ],
    },
    evidencia: {
      fieldName: 'ATTRIB_SYNTAX_VERIFIED',
      targetDescription: 'Dominio del comando attrib para recuperación de visibilidad',
      defaultProvenance: 'SYSTEM_REPORTED',
    },
  },

  {
    id: 'inv-02-27',
    code: '02.27',
    title: 'Mostrar extensiones reales',
    subtitle: 'La regla número 1 de seguridad en el Explorador',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Windows viene de fábrica configurado para OCULTAR las extensiones de archivos conocidos (ej. muestra `Factura` en lugar de `Factura.pdf`). Esta decisión de diseño es responsable de millones de infecciones de malware.',
      mythVsTruth: {
        mentira: '“Dejar las extensiones ocultas es más seguro para no cambiarlas sin querer.”',
        verdad: 'Ocultar extensiones permite a un atacante nombrar un virus `Foto.jpg.exe` para que el usuario confiado solo vea `Foto.jpg`.',
        comprobalo: 'Activa la casilla "Extensiones de nombre de archivo" en la pestaña Ver del Explorador de Windows.',
      },
    },
    entende: {
      title: 'Cómo Activar Extensiones de Forma Permanente',
      explanation: [
        '• En Windows 11: Explorador de Archivos > Ver > Mostrar > "Extensiones de nombre de archivo".',
        '• En Windows 10: Explorador > Pestaña Vista > Marcar casilla "Extensiones de nombre de archivo".',
      ],
    },
    profundiza: {
      title: 'Identificador de Extensión',
      technicalDetails: [
        'Windows asocia la extensión con el Handler de ejecución del registro (`HKEY_CLASSES_ROOT`). El icono gráfico no determina el tipo de ejecutable.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Activar Mostrar extensiones en Explorador',
      steps: [
        '1. Abrí el Explorador de Archivos (Win + E).',
        '2. Menú Ver > Mostrar > Marcá "Extensiones de nombre de archivo".',
      ],
      shortcut: 'Win + E → Ver → Mostrar → Extensiones de nombre de archivo',
      expectedVisual: 'Todos los archivos en pantalla muestran su extensión real (.txt, .pdf, .exe, .docx).',
    },
    comprobalo: {
      instruction: 'Comprobá que todos tus archivos muestran su extensión visible.',
      actionPrompt: 'Registrá la activación de extensiones reales.',
      validationKey: 'EXTENSIONS_VISIBLE_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: '¿Por qué un perito informático exige que todo equipo de trabajo tenga activada la casilla "Extensiones de nombre de archivo"?',
      instruction: 'Seleccioná la razón principal de seguridad:',
      options: [
        { id: 'ext1', text: 'Para evitar el engaño de doble extensión en ataques de phishing y malware ejecutable.', isCorrect: true, feedback: '¡Brillante! Regla de oro de seguridad pericial.' },
        { id: 'ext2', text: 'Para que la pantalla tenga más colores.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SHOW_EXTENSIONS_ENABLED',
      targetDescription: 'Confirmación de visualización activa de extensiones de archivos',
      defaultProvenance: 'OBSERVED',
    },
  },

  {
    id: 'inv-02-28',
    code: '02.28',
    title: '.exe, .dll, .sys, .cmd, .bat, .ps1, .reg',
    subtitle: 'El mapa de formatos ejecutables y de sistema',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Ves archivos con finales diferentes: `.exe`, `.dll`, `.sys`, `.ps1`. ¿Qué hace Windows cuando hacés doble clic en cada uno y qué nivel de riesgo representan?',
      mythVsTruth: {
        mentira: '“Solo los archivos .exe representan un riesgo si se ejecutan.”',
        verdad: 'Scripts de lotes (.cmd/.bat), PowerShell (.ps1), archivos de registro (.reg) y ejecutables de comandos (.com/.scr) pueden modificar el sistema sin ser .exe.',
        comprobalo: 'Inspecciona las asociaciones de archivos en tu equipo.',
      },
    },
    entende: {
      title: 'Matriz de Formatos Clave',
      explanation: [
        '• `.exe` (Executable): Binario PE compilado listo para ejecutarse en espacio de usuario.',
        '• `.dll` (Dynamic Link Library): Librería compartida de funciones cargada por ejecutables.',
        '• `.sys` (System Driver): Driver de bajo nivel que se carga en el Kernel NT (Ring 0).',
        '• `.cmd` / `.bat` (Batch Script): Script de órdenes en consola de comandos.',
        '• `.ps1` (PowerShell Script): Script avanzado de administración en formato PowerShell.',
        '• `.reg` (Registry Entries): Archivo de texto formateado para importar/fusionar claves en el Registro.',
      ],
    },
    profundiza: {
      title: 'Formato PE (Portable Executable)',
      technicalDetails: [
        'Tanto `.exe` como `.dll` y `.sys` comparten la cabecera MZ/PE estándar de Microsoft Windows.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Crear y ver un archivo .bat simple',
      steps: [
        '1. Abrí el Bloc de Notas, escribí `echo Hola Windows` y `pause`.',
        '2. Guardalo en el Escritorio como `prueba.bat`.',
        '3. Observá su icono de engranajes de script.',
      ],
      expectedVisual: 'Archivo ejecutable por lotes .bat en el Escritorio.',
    },
    comprobalo: {
      instruction: 'Anotá la función de cada extensión ejecutable.',
      actionPrompt: 'Registrá la matriz de formatos ejecutables.',
      validationKey: 'EXECUTABLE_FORMATS_VERIFIED',
    },
    microdesafio: {
      type: 'CLASSIFICATION',
      question: '¿Qué extensión corresponde a un controlador de bajo nivel que opera directamente dentro del Kernel de Windows (Ring 0)?',
      instruction: 'Seleccioná el formato correcto:',
      options: [
        { id: 'f1', text: '.sys (System Driver)', isCorrect: true, feedback: '¡Exacto! Los archivos .sys son drivers de modo núcleo.' },
        { id: 'f2', text: '.txt (Documento de texto)', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'FORMATS_MATRIZ_VERIFIED',
      targetDescription: 'Comprensión de formatos de archivos .exe, .dll, .sys, .ps1 y .reg',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-29',
    code: '02.29',
    title: 'El peligro de documento.pdf.exe',
    subtitle: 'Anatomía de un engaño de doble extensión e icono falso',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Recibís un correo con un adjunto llamado `Factura_Octubre.pdf`. Tiene el icono rojo de Adobe Reader. Le hacés doble clic y de repente la pantalla parpadea. Te acaban de infectar con un troyano.',
      mythVsTruth: {
        mentira: '“Si un archivo tiene icono de PDF o imagen, es 100% seguro abrirlo.”',
        verdad: 'El icono de un archivo es un recurso embebido modificable. Si las extensiones están ocultas, `Factura.pdf.exe` se mostrará falsamente como `Factura.pdf`.',
        comprobalo: 'Inspecciona cómo actúa el Explorador cuando las extensiones están ocultas vs visibles.',
      },
    },
    entende: {
      title: 'Cómo Ocurre la Estafa Visual',
      explanation: [
        '1. Nombre Real del Virus: `Factura_Octubre.pdf.exe`',
        '2. Ajuste de Windows por Defecto: Oculta la extensión final `.exe`.',
        '3. Lo que ve el usuario en pantalla: `Factura_Octubre.pdf` con icono falso de PDF.',
        '4. Resultado al hacer doble clic: Windows ejecuta la extensión real `.exe` con permisos de usuario.',
      ],
      diagramLabel: 'MECANISMO DE ENGAÑO VISUAL',
      diagramItems: [
        { label: 'Extensiones Ocultas (Inseguro)', desc: 'Factura_Octubre.pdf (Icono PDF falso) → Ejecuta virus .exe' },
        { label: 'Extensiones Visibles (Seguro)', desc: 'Factura_Octubre.pdf.exe → Revela inmediatamente la extensión ejecutable .exe' },
      ],
    },
    profundiza: {
      title: 'Caracteres invisibles RLO (Right-to-Left Override)',
      technicalDetails: [
        'Atacantes avanzados usan el carácter Unicode U+202E para invertir visualmente el orden de letras de derecha a izquierda en los nombres de archivo.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Comprobar el peligro de la extensión oculta',
      steps: [
        '1. Asegúrate de tener activada la casilla "Extensiones de nombre de archivo".',
        '2. Observá cómo ahora cualquier archivo muestra su tipo real tras el último punto.',
      ],
      expectedVisual: 'Revelación completa de todas las extensiones reales en el Explorador.',
    },
    comprobalo: {
      instruction: 'Anotá el protocolo de verificación de doble extensión.',
      actionPrompt: 'Registrá la regla de inspección de tipo real.',
      validationKey: 'DOUBLE_EXTENSION_AWARENESS_CONFIRMED',
    },
    microdesafio: {
      type: 'REASONING',
      question: 'Un archivo se llama `Contrato_Alquiler.docx.exe`. ¿Qué programa usará Windows para ejecutarlo cuando le hagas doble clic?',
      instruction: 'Seleccioná la respuesta técnica:',
      options: [
        { id: 'de1', text: 'El subsistema de ejecución de binarios de Windows, porque la extensión real final es .exe (no Word).', isCorrect: true, feedback: '¡Brillante! La última extensión define el Handler real de ejecución.' },
        { id: 'de2', text: 'Microsoft Word, porque dice docx en el nombre.', isCorrect: false, feedback: 'Incorrecto: Windows procesa la extensión final.' },
      ],
    },
    evidencia: {
      fieldName: 'DOUBLE_EXTENSION_UNDERSTOOD',
      targetDescription: 'Dominio de detección de doble extensión y prevención de malware',
      defaultProvenance: 'DERIVED',
    },
  },

  {
    id: 'inv-02-30',
    code: '02.30',
    title: 'Qué podés borrar y qué jamás deberías borrar',
    subtitle: 'La matriz definitiva de limpieza y mantenimiento en Windows',
    riskLevel: 'SAFE_TO_CLEAN',
    descubri: {
      hook: 'Llegó el momento de la verdad en el Sector 02. Ante la necesidad de liberar espacio en disco, ¿cómo decide un técnico qué carpetas se pueden vaciar con seguridad y cuáles son intocables?',
      mythVsTruth: {
        mentira: '“Cualquier archivo de Windows que no reconozca se puede borrar para hacer espacio.”',
        verdad: 'Borrar sin criterio carpetas de sistema rompe la capacidad de desinstalar apps, reparar el arranque o actualizar Windows. Se debe consultar la matriz pericial de riesgo.',
        comprobalo: 'Revisa la matriz de clasificación de riesgo de carpetas de Windows.',
      },
    },
    entende: {
      title: 'Matriz Pericial de Riesgo de Borrado',
      explanation: [
        '1. SEGURO LIMPIAR (Con Criterio): `%TEMP%`, Caché de navegadores (`AppData\\Local\\...\\Cache`), Papelera (`$Recycle.Bin`), Archivos temporales de usuario.',
        '2. REQUIERE PROCEDIMIENTO OFICIAL: `SoftwareDistribution` (requiere detener `wuauserv`), `DriverStore` (requiere `pnputil`), `WinSxS` (requiere `DISM /Cleanup-Image`).',
        '3. JAMÁS BORRAR MANUALMENTE: `System32`, `SysWOW64`, `WinSxS` (con Delete), `Installer`, `WindowsApps`, `Recovery`, `System Volume Information`.',
      ],
    },
    profundiza: {
      title: 'Uso del Liberador de Espacio Oficial (cleanmgr / Storage Sense)',
      technicalDetails: [
        'Para limpiar archivos de sistema se debe preferir siempre la herramienta oficial `cleanmgr.exe` (o Configuración > Sistema > Almacenamiento), que aplica algoritmos de seguridad autorizados por Microsoft.',
      ],
    },
    miraloEnTuPc: {
      actionName: 'Lanzar el Liberador de Espacio en disco oficial',
      steps: [
        '1. Presioná Win + R.',
        '2. Escribí `cleanmgr` y presioná Enter.',
        '3. Seleccioná la unidad C: y explorá la lista de elementos seguros para limpiar.',
      ],
      commandOrPath: 'cleanmgr',
      shortcut: 'Win + R → cleanmgr',
      expectedVisual: 'Herramienta oficial de Liberador de espacio en disco de Windows.',
    },
    comprobalo: {
      instruction: 'Anotá las 3 categorías de la matriz de borrado.',
      actionPrompt: 'Consolidá tu certificación del Sector 02.',
      validationKey: 'SECTOR_02_MATRIZ_COMPLETED',
    },
    microdesafio: {
      type: 'CLASSIFICATION',
      question: '¿A qué categoría de la Matriz de Riesgo pertenece la carpeta C:\\Windows\\Installer?',
      instruction: 'Seleccioná la categoría correcta:',
      options: [
        { id: 'm30_1', text: 'JAMÁS BORRAR MANUALMENTE — Porque rompe la capacidad de reparar o desinstalar programas instalados.', isCorrect: true, feedback: '¡Impecable! Regla de oro de mantenimiento.' },
        { id: 'm30_2', text: 'Seguro borrar siempre.', isCorrect: false, feedback: 'Incorrecto.' },
      ],
    },
    evidencia: {
      fieldName: 'SECTOR_02_MASTERY_ACHIEVED',
      targetDescription: 'Dominio completo del Mapa de Windows y reglas de conservación de carpetas',
      defaultProvenance: 'DERIVED',
    },
  },
];

// 5 MINICASOS DE SECTOR 02
export const SECTOR_02_MINICASES: Sector02MiniCase[] = [
  {
    id: 'case-02-a',
    code: 'CASO 02-A',
    title: 'El misterio del archivo que no desinstalaba',
    scenario: 'Un usuario ejecutó un "Script limpiador de disco" bajado de internet. Semanas después intenta desinstalar Microsoft Office y recibe el error fatal: "No se puede abrir el paquete de instalación .MSI".',
    userStatement: '“Windows se rompió solo y no me deja desinstalar mis programas.”',
    initialMistake: 'Haber borrado la carpeta oculta C:\\Windows\\Installer pensando que eran instaladores innecesarios.',
    diagnosticQuestion: '¿Qué directorio eliminó el script limpiador causando la pérdida de la base MSI?',
    options: [
      {
        id: 'c2_a1',
        text: 'C:\\Windows\\Installer',
        isCorrect: true,
        explanation: 'Esa carpeta guarda la caché de paquetes MSI indispensables para desinstalar y reparar programas.',
      },
      {
        id: 'c2_a2',
        text: 'C:\\Users\\Public',
        isCorrect: false,
        explanation: 'No guarda la caché de instaladores MSI de sistema.',
      },
    ],
    technicalVerdict: 'La eliminación previa de la carpeta Installer destruyó la caché de desinstalación. Se requirió usar el solucionador de problemas de Microsoft Program Install and Uninstall.',
    lessonLearned: 'Nunca ejecutes scripts que borren carpetas dentro de C:\\Windows sin auditoría previa.',
  },
  {
    id: 'case-02-b',
    code: 'CASO 02-B',
    title: 'El PDF ejecutable',
    scenario: 'Un empleado recibió un correo con un archivo `Factura.pdf`. Le dio doble clic, no abrió ningún documento pero la PC empezó a comportarse de forma extraña.',
    userStatement: '“El archivo decía .pdf, no entiendo cómo pudo infectarme.”',
    initialMistake: 'Tener la opción por defecto de Windows de "Ocultar extensiones para tipos de archivo conocidos" activa.',
    diagnosticQuestion: '¿Cuál era el nombre real completo del archivo adjunto infectado?',
    options: [
      {
        id: 'c2_b1',
        text: 'Factura.pdf.exe (al estar las extensiones ocultas, el usuario sólo veía Factura.pdf).',
        isCorrect: true,
        explanation: 'El atacante usó una doble extensión sabiendo que Windows ocultaría la extensión real .exe.',
      },
      {
        id: 'c2_b2',
        text: 'Factura.txt',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Ataque de phishing aprovechando la ocultación por defecto de extensiones. Al activar "Mostrar extensiones reales" la estafa es visible de inmediato.',
    lessonLearned: 'Mostrar las extensiones reales de nombre de archivo es la primera regla de defensa en Windows.',
  },
  {
    id: 'case-02-c',
    code: 'CASO 02-C',
    title: 'La carpeta SysWOW64 invertida',
    scenario: 'Un técnico principiante instaló una herramienta de diagnóstico de 64 bits y la buscó dentro de `C:\\Windows\\SysWOW64` sin encontrarla.',
    userStatement: '“Si mi Windows es de 64 bits, las cosas de 64 bits deberían estar en SysWOW64.”',
    initialMistake: 'Desconocer la inversión histórica de nombres del subsistema WOW64 en Windows.',
    diagnosticQuestion: '¿Dónde están alojados los binarios nativos de 64 bits en Windows x64?',
    options: [
      {
        id: 'c2_c1',
        text: 'C:\\Windows\\System32 (mientras que SysWOW64 aloja la capa de 32 bits).',
        isCorrect: true,
        explanation: 'System32 conserva los binarios nativos principales (de 64 bits en sistemas x64).',
      },
      {
        id: 'c2_c2',
        text: 'En C:\\ProgramData',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Confusión de nomenclatura. La herramienta nativa de 64 bits se encontraba en C:\\Windows\\System32.',
    lessonLearned: 'SysWOW64 significa Windows-on-Windows 64 y guarda la compatibilidad con 32 bits.',
  },
  {
    id: 'case-02-d',
    code: 'CASO 02-D',
    title: 'El pánico de WinSxS',
    scenario: 'Un usuario abrió un analizador de espacio y vio que `C:\\Windows\\WinSxS` pesaba 18 GB. Seleccionó la carpeta y presionó Shift+Delete. La PC se colgó y al reiniciar arrojó un error de arranque inoperable.',
    userStatement: '“Esa carpeta estaba duplicando archivos de Windows, así que la borré.”',
    initialMistake: 'Ignorar que WinSxS utiliza Hard Links que no duplican espacio físico real.',
    diagnosticQuestion: '¿Por qué WinSxS parece ocupar tanto espacio sin duplicar el disco realmente?',
    options: [
      {
        id: 'c2_d1',
        text: 'Porque sus archivos son enlaces duros (Hard Links) que apuntan al mismo bloque físico que System32.',
        isCorrect: true,
        explanation: 'Los analizadores ingenuos cuentan el mismo bloque físico dos veces.',
      },
      {
        id: 'c2_d2',
        text: 'Porque la carpeta comprime los archivos en ZIP.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Destrucción manual del Component Store. Se requirió reinstalación limpia del sistema operativo.',
    lessonLearned: 'WinSxS NUNCA se borra con la tecla Delete; solo se limpia con el comando DISM oficial.',
  },
  {
    id: 'case-02-e',
    code: 'CASO 02-E',
    title: 'El pendrive infectado por accesos directos',
    scenario: 'Un alumno conectó un pendrive en una PC pública y todas sus carpetas se transformaron en accesos directos. Los archivos parecían borrados.',
    userStatement: '“El virus eliminó todos mis archivos del pendrive.”',
    initialMistake: 'Creer que los archivos fueron eliminados cuando solo se les aplicaron los atributos de Oculto (+h) y Sistema (+s).',
    diagnosticQuestion: '¿Qué comando de consola restaura de inmediato la visibilidad de los archivos reales?',
    options: [
      {
        id: 'c2_e1',
        text: 'attrib -h -s -r X:\\*.* /s /d',
        isCorrect: true,
        explanation: 'Remueve recursivamente las marcas de Oculto y Sistema revelando los archivos verdaderos.',
      },
      {
        id: 'c2_e2',
        text: 'format X:',
        isCorrect: false,
        explanation: 'Incorrecto: Eso borraría definitivamente los datos.',
      },
    ],
    technicalVerdict: 'Los datos nunca fueron borrados, solo ocultados mediante atributos. El comando attrib recuperó el 100% de la información.',
    lessonLearned: 'Un archivo oculto no está borrado; el comando attrib revela la verdad del volumen.',
  },
];

// BANCO DE PREGUNTAS DEL TEST DE SECTOR 02
export const SECTOR_02_TEST_BANK: Sector02TestQuestion[] = [
  {
    id: 't02-q01',
    questionNumber: 1,
    category: 'SISTEMA_Y_SYSTEM32',
    scenario: 'Estás auditando un servidor Windows Server de 64 bits.',
    question: '¿Qué tipo de binarios aloja por definición la carpeta C:\\Windows\\System32?',
    options: [
      { id: 'o02_1', text: 'Binarios nativos de 64 bits (x64).', isCorrect: true, technicalJustification: 'En sistemas x64, System32 guarda la arquitectura nativa de 64 bits.' },
      { id: 'o02_2', text: 'Binarios de 32 bits únicamente.', isCorrect: false, technicalJustification: 'Incorrecto: Esos residen en SysWOW64.' },
      { id: 'o02_3', text: 'Archivos temporales de usuario.', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o02_4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'Es una regla de arquitectura documentada por Microsoft.' },
    ],
  },
  {
    id: 't02-q02',
    questionNumber: 2,
    category: 'PROGRAMAS_Y_APPDATA',
    scenario: 'Un usuario necesita respaldar los datos privados de configuración de su navegador web y Discord.',
    question: '¿En qué directorio del perfil de usuario debe buscar estas carpetas de configuración?',
    options: [
      { id: 'o02_5', text: '%APPDATA% (C:\\Users\\<Usuario>\\AppData\\Roaming o Local)', isCorrect: true, technicalJustification: 'AppData es el repositorio canónico privado de configuraciones de usuario.' },
      { id: 'o02_6', text: 'C:\\Windows\\System32', isCorrect: false, technicalJustification: 'System32 es del SO, no de datos de usuario.' },
      { id: 'o02_7', text: 'C:\\ProgramFiles', isCorrect: false, technicalJustification: 'ProgramFiles exige permisos de admin y no guarda datos privados de sesión.' },
      { id: 'o02_8', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'AppData es la solución estándar.' },
    ],
  },
  {
    id: 't02-q03',
    questionNumber: 3,
    category: 'LOGS_Y_DIAGNÓSTICO',
    scenario: 'Tras un colapso de pantalla azul (BSOD), querés abrir el volcado reducido para averiguar qué archivo .sys causó la falla.',
    question: '¿En qué ruta se almacenan habitualmente los archivos .dmp reducidos?',
    options: [
      { id: 'o02_9', text: 'C:\\Windows\\Minidump', isCorrect: true, technicalJustification: 'Minidump guarda los volcados reducidos de ~256 KB.' },
      { id: 'o02_10', text: 'C:\\ProgramData\\Temp', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o02_11', text: 'C:\\Users\\Public', isCorrect: false, technicalJustification: 'Incorrecto.' },
      { id: 'o02_12', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'Minidump es la ubicación oficial.' },
    ],
  },
  {
    id: 't02-q04',
    questionNumber: 4,
    category: 'ATRIBUTOS_Y_EXTENSIONES',
    scenario: 'Observás un archivo en el Explorador llamado `Informe.pdf.exe`.',
    question: '¿Qué tipo de ejecutable es realmente este archivo y qué peligro representa?',
    options: [
      { id: 'o02_13', text: 'Es un ejecutable binario (.exe) que intenta camuflarse como documento PDF mediante una doble extensión.', isCorrect: true, technicalJustification: 'Windows procesa la última extensión tras el punto (.exe).' },
      { id: 'o02_14', text: 'Es un archivo de texto inofensivo.', isCorrect: false, technicalJustification: 'Falso: Es un ejecutable.' },
      { id: 'o02_15', text: 'Es un documento oficial de Microsoft Word.', isCorrect: false, technicalJustification: 'Falso.' },
      { id: 'o02_16', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El análisis de extensiones es concluyente.' },
    ],
  },
  {
    id: 't02-q05',
    questionNumber: 5,
    category: 'REGLAS_DE_LIMPIEZA',
    scenario: 'Querés liberar espacio en disco de forma segura sin romper la capacidad de actualizar ni reparar el sistema.',
    question: '¿Cuál de las siguientes carpetas se puede vaciar con seguridad sin romper el sistema?',
    options: [
      { id: 'o02_17', text: '%TEMP% (C:\\Users\\<Usuario>\\AppData\\Local\\Temp)', isCorrect: true, technicalJustification: 'Temp contiene archivos volátiles no esenciales en reposo.' },
      { id: 'o02_18', text: 'C:\\Windows\\WinSxS', isCorrect: false, technicalJustification: 'Borrar WinSxS con Delete rompe el sistema operativo.' },
      { id: 'o02_19', text: 'C:\\Windows\\Installer', isCorrect: false, technicalJustification: 'Borrar Installer rompe las desinstalaciones e instaladores MSI.' },
      { id: 'o02_20', text: 'C:\\Windows\\System32', isCorrect: false, technicalJustification: 'Borrar System32 destruye Windows.' },
    ],
  },
];
