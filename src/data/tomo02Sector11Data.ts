// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 11: REGISTRO // DONDE WINDOWS RECUERDA CÓMO DEBE COMPORTARSE

export type RiskLevelSector11 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector11Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetKey: string;
  commandName: string;
  riskLevel: RiskLevelSector11;
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
    regQueryExample: string;
    psExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    valueType: string;
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

export interface Sector11MiniCase {
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

export interface Sector11TestQuestion {
  id: string;
  questionNumber: number;
  category: 'HIVES_Y_ARQUITECTURA' | 'CONTROLSETS_Y_SERVICIOS' | 'PERSISTENCIA_Y_POLICIES' | 'CLI_Y_AUTOMATIZACION';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_11_INVESTIGATIONS: Sector11Investigation[] = [
  {
    id: 'sec-11-01',
    code: '11.01',
    title: 'Qué es un Hive',
    subtitle: 'Estructura binaria en disco de las colmenas del Registro',
    targetKey: 'C:\\Windows\\System32\\config\\',
    commandName: 'reg query HKLM',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El Registro de Windows no es una base de datos única ni un archivo gigante: es un árbol lógico compuesto por múltiples archivos binarios llamados Hives.',
      mythVsTruth: {
        mentira: 'El Registro es un único archivo monolítico de texto o XML que se carga entero en memoria RAM.',
        verdad: 'Cada colmena (Hive) es un archivo binario transaccional independiente (con logs .LOG1 y .LOG2) administrado por el Configuration Manager del kernel.',
        comprobalo: 'Inspeccioná la carpeta C:\\Windows\\System32\\config en modo de bajo nivel o consultá HKLM\\SYSTEM\\CurrentControlSet\\Control\\hivelist.',
      },
    },
    entende: {
      queEs: 'Un Hive (colmena) es una estructura de almacenamiento discreta que contiene un árbol de claves, subclaves y valores respaldado por un archivo binario.',
      paraQueSirve: 'Permite a Windows aislar la configuración global del hardware, la seguridad del dominio y los perfiles de usuario en archivos separados.',
      quePasaSiFalta: 'Si un Hive crítico (como SYSTEM o SOFTWARE) se corrompe o falta, Windows falla al iniciar con BSOD Bad System Config Info (0x74).',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\hivelist"',
      psExample: 'Get-ItemProperty "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\hivelist"',
      syntaxBreakdown: 'Consulta la clave hivelist del kernel, que mapea cada rama lógica montada a su ruta física en disco duro.',
      whatToLookFor: 'Rutas como \\Device\\HarddiskVolumeX\\Windows\\System32\\config\\SYSTEM y NTUSER.DAT.',
      valueType: 'REG_SZ (Mapeo Físico de Archivos de Colmena)',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura pura de metadatos del kernel. Sin modificación.',
      safetyWarning: 'Nunca intentes abrir o modificar los archivos binarios de config\\ con un editor de texto mientras Windows está en ejecución.',
    },
    evidenceBadge: {
      code: 'REG-HIVE-01',
      label: 'HIVE BINARY ARCHITECTURE CONFIRMED',
    },
  },
  {
    id: 'sec-11-02',
    code: '11.02',
    title: 'HKLM (HKEY_LOCAL_MACHINE)',
    subtitle: 'Configuración global del equipo independiente del usuario activo',
    targetKey: 'HKEY_LOCAL_MACHINE',
    commandName: 'reg query HKLM /k',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'HKLM contiene los ajustes que aplican a todos los usuarios del equipo físico y a la capa del sistema operativo antes del inicio de sesión.',
      mythVsTruth: {
        mentira: 'Cualquier programa puede escribir en HKLM libremente sin permisos especiales.',
        verdad: 'Escribir en HKLM exige privilegios de Administrador (o LocalSystem) y genera elevación UAC para evitar manipulaciones maliciosas.',
        comprobalo: 'Intentá crear una subclave en HKLM\\SOFTWARE sin elevar la consola: el kernel devolverá ERROR_ACCESS_DENIED (código 5).',
      },
    },
    entende: {
      queEs: 'La raíz que agrupa la configuración compartida del hardware, controladores, software instalado y políticas corporativas del equipo.',
      paraQueSirve: 'Centraliza los parámetros universales de la máquina: controladores de red, servicios en segundo plano y directivas de seguridad.',
      quePasaSiFalta: 'Es la columna vertebral del arranque de Windows; sin HKLM el sistema no tiene definición de hardware ni de servicios.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0" /v "ProcessorNameString"',
      psExample: 'Get-ItemPropertyValue -Path "HKLM:\\HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0" -Name "ProcessorNameString"',
      syntaxBreakdown: 'Lee el nombre físico del procesador detectado en tiempo de arranque por el kernel NT.',
      whatToLookFor: 'Cadena con el modelo exacto (ej. Intel(R) Core(TM) o AMD Ryzen).',
      valueType: 'REG_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta no destructiva de hardware volátil.',
      safetyWarning: 'Las modificaciones en HKLM afectan a todos los usuarios y perfiles del sistema operativo.',
    },
    evidenceBadge: {
      code: 'REG-HKLM-02',
      label: 'MACHINE ROOT VALIDATED',
    },
  },
  {
    id: 'sec-11-03',
    code: '11.03',
    title: 'HKCU (HKEY_CURRENT_USER)',
    subtitle: 'Enlace simbólico en memoria hacia la colmena del usuario activo',
    targetKey: 'HKEY_CURRENT_USER',
    commandName: 'reg query HKCU',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'HKCU no es una colmena real en disco duro: es un puntero dinámico que apunta a la entrada correspondiente dentro de HKEY_USERS.',
      mythVsTruth: {
        mentira: 'HKCU es un archivo separado en disco que existe permanentemente.',
        verdad: 'Es un enlace simbólico en memoria que el kernel crea cuando el usuario inicia sesión, apuntando a HKEY_USERS\\<SID-DEL-USUARIO>.',
        comprobalo: 'Ejecutá whoami /user para conocer tu SID y compará el contenido de HKCU con HKU\\<tu-SID>. Son exactamente idénticos.',
      },
    },
    entende: {
      queEs: 'El alias que proporciona acceso simplificado a las preferencias y configuraciones del perfil de usuario que tiene la sesión iniciada.',
      paraQueSirve: 'Almacena temas visuales, programas de inicio del usuario, preferencias de aplicaciones y variables de entorno personales.',
      quePasaSiFalta: 'Si no se monta el alias, las aplicaciones no pueden guardar preferencias y Windows carga un perfil temporal (.bak).',
    },
    interactua: {
      regQueryExample: 'reg query "HKCU\\Control Panel\\Desktop" /v "Wallpaper"',
      psExample: 'Get-ItemPropertyValue -Path "HKCU:\\Control Panel\\Desktop" -Name "Wallpaper"',
      syntaxBreakdown: 'Consulta la ruta absoluta de la imagen de fondo de pantalla asignada al usuario activo.',
      whatToLookFor: 'Ruta hacia el archivo de imagen (.jpg, .png o archivo en Themes\\TranscodedWallpaper).',
      valueType: 'REG_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de solo lectura en el contexto de usuario actual.',
      safetyWarning: 'Las escrituras en HKCU no requieren elevación de privilegios, lo que la convierte en objetivo común de malware sin privilegios.',
    },
    evidenceBadge: {
      code: 'REG-HKCU-03',
      label: 'USER SYMBOLIC LINK VERIFIED',
    },
  },
  {
    id: 'sec-11-04',
    code: '11.04',
    title: 'HKCR (HKEY_CLASSES_ROOT)',
    subtitle: 'Vista combinada de asociaciones de archivos y objetos COM',
    targetKey: 'HKEY_CLASSES_ROOT',
    commandName: 'reg query HKCR\\.txt',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'HKCR es una vista fusionada generada en tiempo real combinando HKLM\\Software\\Classes (global) y HKCU\\Software\\Classes (por usuario).',
      mythVsTruth: {
        mentira: 'HKCR es una colmena estática donde se guardan todas las extensiones de archivos.',
        verdad: 'Es una unión virtual. Si existe un valor en HKCU, tiene prioridad y sobrescribe la vista sobre el valor de HKLM.',
        comprobalo: 'Consultá HKCR\\.txt y comparalo con HKLM\\Software\\Classes\\.txt y HKCU\\Software\\Classes\\.txt.',
      },
    },
    entende: {
      queEs: 'El punto de acceso para registrar tipos MIME, extensiones de archivo, controladores ProgID y servidores COM / CLSID.',
      paraQueSirve: 'Permite al explorador de Windows saber qué ejecutable debe abrirse cuando haces doble clic en un archivo .pdf, .docx o .exe.',
      quePasaSiFalta: 'La corrupción de asociaciones provoca que Windows no sepa cómo abrir archivos básicos o que los accesos directos .lnk no respondan.',
    },
    interactua: {
      regQueryExample: 'reg query "HKCR\\.txt" /ve',
      psExample: 'Get-ItemPropertyValue -Path "Registry::HKEY_CLASSES_ROOT\\.txt" -Name "(default)"',
      syntaxBreakdown: 'Lee el valor por defecto que asocia la extensión .txt a su clase o ProgID en el subsistema Shell.',
      whatToLookFor: 'ProgID asociado (comúnmente txtfile o txtfilelegacy).',
      valueType: 'REG_SZ (ProgID Mapping)',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura no destructiva de asociaciones.',
      safetyWarning: 'Tocar HKCR directamente modifica la vista combinada; para cambios específicos de usuario es más seguro modificar HKCU\\Software\\Classes.',
    },
    evidenceBadge: {
      code: 'REG-HKCR-04',
      label: 'COM & SHELL BINDINGS CONFIRMED',
    },
  },
  {
    id: 'sec-11-05',
    code: '11.05',
    title: 'HKU (HKEY_USERS)',
    subtitle: 'Colmenas de todos los perfiles de usuario cargados en la sesión',
    targetKey: 'HKEY_USERS',
    commandName: 'reg query HKU',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Contiene las colmenas activas de todos los usuarios que han iniciado sesión, además de los perfiles especiales del sistema (.DEFAULT, LocalSystem, NetworkService).',
      mythVsTruth: {
        mentira: 'HKEY_USERS guarda los datos de todas las cuentas del disco incluso si nunca iniciaron sesión.',
        verdad: 'Solo contiene las colmenas de perfiles actualmente cargados en memoria RAM; los perfiles inactivos residen en disco en sus respectivos NTUSER.DAT.',
        comprobalo: 'Listá las subclaves de HKU: verás S-1-5-18 (LocalSystem), S-1-5-19 (LocalService), S-1-5-20 (NetworkService) y tu SID personal.',
      },
    },
    entende: {
      queEs: 'La raíz que alberga todas las identidades de usuario y servicios del sistema operativo en ejecución.',
      paraQueSirve: 'Permite administrar perfiles individuales mediante su Security Identifier (SID) y aplicar políticas segmentadas.',
      quePasaSiFalta: 'Si un subárbol de SID se descarga abruptamente, la sesión de ese usuario pierde su estado y configuraciones.',
    },
    interactua: {
      regQueryExample: 'reg query "HKU\\.DEFAULT\\Control Panel\\International" /v "sLanguage"',
      psExample: 'Get-ItemPropertyValue -Path "Registry::HKEY_USERS\\.DEFAULT\\Control Panel\\International" -Name "sLanguage"',
      syntaxBreakdown: 'Consulta el idioma por defecto configurado para la pantalla de bienvenida y usuarios del sistema.',
      whatToLookFor: 'Código de lenguaje ISO (ej. ESN para español, ENU para inglés).',
      valueType: 'REG_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Inspección de perfiles montados.',
      safetyWarning: 'Nunca modifiques manualmente la rama de otro usuario o los perfiles de servicios de red sin conocer su SID exacto.',
    },
    evidenceBadge: {
      code: 'REG-HKU-05',
      label: 'USER IDENTITY PROFILES INDEXED',
    },
  },
  {
    id: 'sec-11-06',
    code: '11.06',
    title: 'HKCC (HKEY_CURRENT_CONFIG)',
    subtitle: 'Alias volátil del perfil de hardware activo',
    targetKey: 'HKEY_CURRENT_CONFIG',
    commandName: 'reg query HKCC',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'HKCC es otro alias simbólico: apunta a HKLM\\SYSTEM\\CurrentControlSet\\Hardware Profiles\\Current.',
      mythVsTruth: {
        mentira: 'HKCC almacena la configuración de todo el hardware moderno como tarjetas gráficas y placas base.',
        verdad: 'Es una rama heredada de compatibilidad creada en la era de los perfiles de hardware de Windows 95/NT para laptops con docks.',
        comprobalo: 'Consultá HKCC\\System\\CurrentControlSet\\Control\\Print\\Printers y comparalo con su clave espejo en HKLM.',
      },
    },
    entende: {
      queEs: 'Un puntero dinámico hacia la configuración de hardware de la sesión actual generada durante el arranque.',
      paraQueSirve: 'Mantiene compatibilidad con APIs antiguas de Win32 que esperan consultar perfiles de hardware activos.',
      quePasaSiFalta: 'Windows 11 la recrea automáticamente en cada inicio; no contiene datos persistentes propios.',
    },
    interactua: {
      regQueryExample: 'reg query "HKCC\\System\\CurrentControlSet\\Control\\Print\\Printers"',
      psExample: 'Get-ChildItem -Path "Registry::HKEY_CURRENT_CONFIG\\System\\CurrentControlSet\\Control\\Print\\Printers"',
      syntaxBreakdown: 'Muestra las impresoras asociadas al perfil de hardware del equipo actual.',
      whatToLookFor: 'Listado de controladores de impresión montados en el perfil.',
      valueType: 'Key / Registry Tree',
    },
    alertaEVO: {
      reversibilityRule: 'Estructura volátil de lectura.',
      safetyWarning: 'No tiene utilidad real modificar HKCC en equipos modernos; cualquier cambio debe realizarse en las ramas reales de HKLM.',
    },
    evidenceBadge: {
      code: 'REG-HKCC-06',
      label: 'HARDWARE PROFILE POINTER CONFIRMED',
    },
  },
  {
    id: 'sec-11-07',
    code: '11.07',
    title: 'SYSTEM Hive',
    subtitle: 'La colmena crítica del kernel, controladores y parámetros de inicio',
    targetKey: 'C:\\Windows\\System32\\config\\SYSTEM',
    commandName: 'reg query HKLM\\SYSTEM',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El archivo SYSTEM pesa unos pocos megabytes pero es el primer archivo que lee el Windows Boot Manager y winload.efi para poder inicializar los controladores de disco.',
      mythVsTruth: {
        mentira: 'El archivo SYSTEM se puede editar o borrar mientras Windows está corriendo.',
        verdad: 'El kernel NT mantiene un bloqueo exclusivo de archivo a nivel de I/O; ningún proceso puede escribirlo directamente.',
        comprobalo: 'Intentá borrar C:\\Windows\\System32\\config\\SYSTEM: el Explorador o CMD reportará que el archivo está siendo usado por el Sistema.',
      },
    },
    entende: {
      queEs: 'El Hive binario que contiene todos los conjuntos de control (ControlSets), servicios del sistema, controladores de dispositivos y parámetros del kernel.',
      paraQueSirve: 'Permite que el cargador de arranque sepa qué controlador de almacenamiento (SATA, NVMe) se debe cargar para montar la partición C:.',
      quePasaSiFalta: 'El sistema no puede arrancar; genera el error crítico INACCESSIBLE_BOOT_DEVICE o BAD_SYSTEM_CONFIG_INFO.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SYSTEM\\Select"',
      psExample: 'Get-ItemProperty -Path "HKLM:\\SYSTEM\\Select"',
      syntaxBreakdown: 'Lee los punteros Select: Current, Default, Failed y LastKnownGood para saber qué ControlSet está activo.',
      whatToLookFor: 'Valores DWORD Current (comúnmente 1) indicando ControlSet001.',
      valueType: 'REG_DWORD',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta fundamental de arquitectura.',
      safetyWarning: 'Cualquier modificación errónea en HKLM\\SYSTEM puede dejar el equipo en bucle de arranque no recuperable sin WinPE.',
    },
    evidenceBadge: {
      code: 'REG-SYSTEM-07',
      label: 'KERNEL SYSTEM HIVE VALIDATED',
    },
  },
  {
    id: 'sec-11-08',
    code: '11.08',
    title: 'SOFTWARE Hive',
    subtitle: 'El catálogo global de aplicaciones instaladas y componentes de Windows',
    targetKey: 'C:\\Windows\\System32\\config\\SOFTWARE',
    commandName: 'reg query HKLM\\SOFTWARE',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Contiene las directivas del sistema operativo, las claves de registro de programas instalados para toda la máquina y la infraestructura COM/OLE.',
      mythVsTruth: {
        mentira: 'Desinstalar un programa limpia automáticamente todas sus entradas de HKLM\\SOFTWARE.',
        verdad: 'La mayoría de los desinstaladores dejan ramas huérfanas de configuración, licencias y telemetría por diseño defensivo.',
        comprobalo: 'Revisá HKLM\\SOFTWARE: encontrarás nombres de proveedores de software que desinstalaste hace meses o años.',
      },
    },
    entende: {
      queEs: 'El archivo binario donde residen las configuraciones de todas las aplicaciones de nivel de sistema y subsistemas de Microsoft.',
      paraQueSirve: 'Centraliza las rutas de instalación, versiones registradas, tipos de componentes y políticas de grupo aplicadas localmente.',
      quePasaSiFalta: 'Windows arranca en modo degradado o falla al iniciar el subsistema de seguridad LSASS y la interfaz gráfica Explorer.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v "DisplayVersion"',
      psExample: 'Get-ItemPropertyValue -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" -Name "DisplayVersion"',
      syntaxBreakdown: 'Consulta la versión comercial de Windows 11 reportada por el sistema (ej. 23H2 o 24H2).',
      whatToLookFor: 'Cadena de texto con la versión exacta de compilación del sistema operativo.',
      valueType: 'REG_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura inofensiva de metadatos de versión.',
      safetyWarning: 'La clave HKLM\\SOFTWARE contiene las directivas de seguridad; alteraciones indebidas provocan bloqueos de aplicaciones.',
    },
    evidenceBadge: {
      code: 'REG-SOFT-08',
      label: 'GLOBAL SOFTWARE REPOSITORY CONFIRMED',
    },
  },
  {
    id: 'sec-11-09',
    code: '11.09',
    title: 'SAM (Security Accounts Manager)',
    subtitle: 'La base de datos local de usuarios y hashes NTLM',
    targetKey: 'C:\\Windows\\System32\\config\\SAM',
    commandName: 'reg query HKLM\\SAM',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'SAM está protegida por listas de control de acceso (ACLs) tan restrictivas que ni siquiera un Administrador local puede leer su contenido sin elevar a NT AUTHORITY\\SYSTEM.',
      mythVsTruth: {
        mentira: 'En HKLM\\SAM las contraseñas de los usuarios se guardan en texto plano legible.',
        verdad: 'Las contraseñas no se almacenan: se guardan hashes criptográficos NTLM derivados, ofuscados con la clave SYSKEY (F-value).',
        comprobalo: 'Intentá ejecutar reg query HKLM\\SAM en un CMD de administrador estándar: recibirás ERROR_ACCESS_DENIED.',
      },
    },
    entende: {
      queEs: 'La colmena de seguridad que gestiona las cuentas de usuarios locales, grupos integrados y credenciales de autenticación.',
      paraQueSirve: 'Permite a LSASS verificar si la contraseña ingresada al encender el equipo coincide con el hash almacenado.',
      quePasaSiFalta: 'Si la SAM se corrompe, no es posible iniciar sesión con ninguna cuenta local del equipo.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SAM\\SAM"',
      psExample: 'Get-Acl "HKLM:\\SAM\\SAM"',
      syntaxBreakdown: 'Muestra los descriptores de seguridad y denegaciones de acceso aplicadas a la raíz de la SAM.',
      whatToLookFor: 'Propietario SYSTEM y permisos exclusivos restringidos.',
      valueType: 'Security Descriptor / ACL',
    },
    alertaEVO: {
      reversibilityRule: 'Inspección de controles de acceso.',
      safetyWarning: 'Copiar o extraer la SAM y SYSTEM es el método clásico de ataque para cracking de credenciales locales (DCSync/Mimikatz). Mantenela protegida.',
    },
    evidenceBadge: {
      code: 'REG-SAM-09',
      label: 'SECURITY ACCOUNTS MANAGER AUDITED',
    },
  },
  {
    id: 'sec-11-10',
    code: '11.10',
    title: 'SECURITY Hive',
    subtitle: 'Políticas de seguridad local, LSA secrets y auditoría de eventos',
    targetKey: 'C:\\Windows\\System32\\config\\SECURITY',
    commandName: 'reg query HKLM\\SECURITY',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Almacena los "LSA Secrets": contraseñas de cuentas de servicio, certificados de red, claves BitLocker temporales y directivas de auditoría.',
      mythVsTruth: {
        mentira: 'Cualquier usuario puede ver qué políticas de auditoría están activas en el Registro.',
        verdad: 'La colmena SECURITY está bloqueada exclusivamente para el subsistema de seguridad Local Security Authority (lsass.exe).',
        comprobalo: 'Al igual que con SAM, reg query HKLM\\SECURITY devuelve Acceso Denegado a menos que se invoque bajo el token SYSTEM.',
      },
    },
    entende: {
      queEs: 'La colmena donde residen los parámetros del subsistema de seguridad de Windows y los secretos locales de autenticación.',
      paraQueSirve: 'Gestiona la configuración de políticas de contraseñas (longitud mínima, bloqueo), derechos de usuario y eventos que se registran en el Visor.',
      quePasaSiFalta: 'El subsistema LSASS falla en el arranque provocando un reinicio inmediato con código de apagado forzado.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SECURITY"',
      psExample: 'Test-Path "HKLM:\\SECURITY"',
      syntaxBreakdown: 'Comprueba la presencia de la rama montada en la jerarquía del Registro.',
      whatToLookFor: 'Retorno True confirmando que la colmena está montada por el kernel.',
      valueType: 'Boolean Status',
    },
    alertaEVO: {
      reversibilityRule: 'Verificación de presencia del Hive.',
      safetyWarning: 'La corrupción de la colmena SECURITY inutiliza el subsistema de autenticación de Windows.',
    },
    evidenceBadge: {
      code: 'REG-SEC-10',
      label: 'LSA SECURITY REPOSITORY VERIFIED',
    },
  },
  {
    id: 'sec-11-11',
    code: '11.11',
    title: 'DEFAULT Hive',
    subtitle: 'La plantilla para la creación de nuevos perfiles de usuario',
    targetKey: 'C:\\Windows\\System32\\config\\DEFAULT',
    commandName: 'reg query HKU\\.DEFAULT',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'No confundir con el perfil predeterminado de usuarios: HKU\\.DEFAULT es el perfil de entorno utilizado por la cuenta LocalSystem antes de iniciar sesión.',
      mythVsTruth: {
        mentira: 'HKU\\.DEFAULT contiene las configuraciones que se le aplican a un nuevo usuario que creas en Windows.',
        verdad: 'La plantilla para nuevos usuarios está en C:\\Users\\Default\\NTUSER.DAT. HKU\\.DEFAULT es en realidad la colmena de la cuenta SYSTEM.',
        comprobalo: 'Modificá un valor en HKU\\.DEFAULT\\Control Panel\\Desktop y creá un nuevo usuario: notarás que el nuevo usuario NO recibe ese cambio.',
      },
    },
    entende: {
      queEs: 'La colmena física de config\\DEFAULT montada en HKU\\.DEFAULT utilizada por servicios que corren sin sesión de usuario interactiva.',
      paraQueSirve: 'Configura la resolución, protector de pantalla y teclado de la pantalla de inicio de sesión (Logon Screen / Winlogon).',
      quePasaSiFalta: 'La pantalla de inicio de sesión no puede inicializarse correctamente y muestra una pantalla negra con cursor.',
    },
    interactua: {
      regQueryExample: 'reg query "HKU\\.DEFAULT\\Keyboard Layout\\Preload" /v "1"',
      psExample: 'Get-ItemPropertyValue -Path "Registry::HKEY_USERS\\.DEFAULT\\Keyboard Layout\\Preload" -Name "1"',
      syntaxBreakdown: 'Consulta el identificador del layout de teclado precargado en la pantalla de bienvenida.',
      whatToLookFor: 'Código numérico de idioma (ej. 0000080a para teclado español, 00000409 para inglés de EEUU).',
      valueType: 'REG_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de parámetros de inicio.',
      safetyWarning: 'Modificar incorrectamente la disposición de teclado en .DEFAULT puede impedirte escribir tu contraseña si tiene caracteres especiales.',
    },
    evidenceBadge: {
      code: 'REG-DEF-11',
      label: 'SYSTEM LOGON TEMPLATE INSPECTED',
    },
  },
  {
    id: 'sec-11-12',
    code: '11.12',
    title: 'NTUSER.DAT',
    subtitle: 'El archivo binario individual de cada usuario en su carpeta de perfil',
    targetKey: 'C:\\Users\\<Usuario>\\NTUSER.DAT',
    commandName: 'dir /ah C:\\Users\\%USERNAME%\\NTUSER.DAT',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En la raíz de tu carpeta de usuario existe un archivo oculto del sistema llamado NTUSER.DAT que contiene toda tu configuración personal de Windows.',
      mythVsTruth: {
        mentira: 'Si borras NTUSER.DAT liberás espacio y no pasa nada grave.',
        verdad: 'Si borras o corrompes NTUSER.DAT, Windows no podrá cargar tu perfil y serás expulsado a un perfil temporal volátil donde todo se borra al reiniciar.',
        comprobalo: 'Ejecutá dir /ah %USERPROFILE%\\NTUSER.DAT para comprobar su existencia y fecha de última escritura transaccional.',
      },
    },
    entende: {
      queEs: 'La colmena privada que se monta en tiempo de ejecución bajo HKEY_CURRENT_USER cada vez que el usuario se autentica.',
      paraQueSirve: 'Almacena configuraciones de navegadores, fondos de pantalla, historial de comandos de PowerShell, claves de licencias de software y accesos directos.',
      quePasaSiFalta: 'Aparece la notificación "No se pudo iniciar sesión con tu cuenta" y Windows genera un perfil temporal TEMP.',
    },
    interactua: {
      regQueryExample: 'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "Hidden"',
      psExample: 'Get-ItemPropertyValue -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "Hidden"',
      syntaxBreakdown: 'Lee el valor de NTUSER.DAT que determina si el Explorador muestra archivos ocultos (1) o los oculta (2).',
      whatToLookFor: 'Valor DWORD 1 (mostrar ocultos) o 2 (no mostrar).',
      valueType: 'REG_DWORD',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura de estado de perfil de usuario.',
      safetyWarning: 'Respaldar tu NTUSER.DAT es la mejor forma de salvar todas tus configuraciones personalizadas ante una reinstalación.',
    },
    evidenceBadge: {
      code: 'REG-NTUSER-12',
      label: 'USER HIVE PERSISTENCE CONFIRMED',
    },
  },
  {
    id: 'sec-11-13',
    code: '11.13',
    title: 'ControlSet (ControlSet001 / ControlSet002)',
    subtitle: 'Las copias de seguridad de configuración del kernel en la colmena SYSTEM',
    targetKey: 'HKLM\\SYSTEM\\ControlSet001',
    commandName: 'reg query HKLM\\SYSTEM\\ControlSet001',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En Windows moderno, ControlSet001 es la copia física real de configuración, y CurrentControlSet es un enlace simbólico que apunta a ella.',
      mythVsTruth: {
        mentira: 'ControlSet001 y CurrentControlSet son dos carpetas distintas que ocupan el doble de espacio.',
        verdad: 'CurrentControlSet no ocupa espacio en disco; es un puntero directo en memoria RAM gestionado por el gestor de configuración del kernel.',
        comprobalo: 'Cambiá un valor de prueba en CurrentControlSet y leelo inmediatamente en ControlSet001: verás que cambió al instante porque son el mismo objeto en memoria.',
      },
    },
    entende: {
      queEs: 'La estructura de árbol que contiene las ramas Control (parámetros de subsistemas) y Services (todos los servicios y controladores del SO).',
      paraQueSirve: 'Permite a Windows guardar conjuntos de configuración anteriores para arrancar con "La última configuración válida conocida" si un controlador falla.',
      quePasaSiFalta: 'Sin ningún ControlSet válido, winload.efi se detiene con BSOD 0xc000000e o 0xc0000098.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SYSTEM\\Select"',
      psExample: 'Get-ItemProperty "HKLM:\\SYSTEM\\Select"',
      syntaxBreakdown: 'Muestra qué número de ControlSet está configurado como Current (activo actual) y Default.',
      whatToLookFor: 'Clave Current con valor 0x1 (ControlSet001).',
      valueType: 'REG_DWORD',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de punteros de arranque del kernel.',
      safetyWarning: 'Nunca modifiques ControlSet001 y CurrentControlSet simultáneamente creyendo que estás creando un respaldo.',
    },
    evidenceBadge: {
      code: 'REG-CTRLSET-13',
      label: 'KERNEL CONTROL SET DISCOVERED',
    },
  },
  {
    id: 'sec-11-14',
    code: '11.14',
    title: 'CurrentControlSet',
    subtitle: 'El puntero activo en tiempo de ejecución del kernel de Windows',
    targetKey: 'HKLM\\SYSTEM\\CurrentControlSet',
    commandName: 'reg query HKLM\\SYSTEM\\CurrentControlSet',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Cualquier modificación que haces a un servicio de Windows o controlador de hardware se escribe en CurrentControlSet.',
      mythVsTruth: {
        mentira: 'CurrentControlSet es un archivo que se puede buscar en el explorador de archivos.',
        verdad: 'Solo existe en la jerarquía del Registro; en disco está guardado dentro del archivo SYSTEM bajo el número de ControlSet indicado por la clave Select.',
        comprobalo: 'Revisá la clave HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager: verás los parámetros globales de la sesión activa del kernel.',
      },
    },
    entende: {
      queEs: 'El subárbol de mayor impacto de todo el sistema operativo; define cómo interactúa el kernel con el procesador, memoria, discos y red.',
      paraQueSirve: 'Gestiona la lista de controladores de arranque, parámetros de depuración (CrashDump), administración de energía y programación de hilos.',
      quePasaSiFalta: 'Si se corrompe una entrada crítica dentro de CurrentControlSet, Windows no completará la fase de inicialización Phase 1 del kernel.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /v "PROCESSOR_ARCHITECTURE"',
      psExample: 'Get-ItemPropertyValue -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" -Name "PROCESSOR_ARCHITECTURE"',
      syntaxBreakdown: 'Lee la arquitectura del procesador que el kernel expone a todo el sistema operativo.',
      whatToLookFor: 'Valor AMD64 para procesadores x86_64 o ARM64 para procesadores basados en ARM.',
      valueType: 'REG_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura no invasiva de variables de entorno del kernel.',
      safetyWarning: 'Tocar CurrentControlSet\\Control sin entender las dependencias puede ocasionar inestabilidad instantánea.',
    },
    evidenceBadge: {
      code: 'REG-CCS-14',
      label: 'RUNTIME KERNEL POINTER VERIFIED',
    },
  },
  {
    id: 'sec-11-15',
    code: '11.15',
    title: 'Services (CurrentControlSet\\Services)',
    subtitle: 'El registro maestro donde se definen todos los servicios y drivers',
    targetKey: 'HKLM\\SYSTEM\\CurrentControlSet\\Services',
    commandName: 'reg query HKLM\\SYSTEM\\CurrentControlSet\\Services\\wuauserv',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En Windows no hay diferencia en el Registro entre un servicio de segundo plano y un controlador de dispositivo del kernel: ambos son subclaves dentro de Services.',
      mythVsTruth: {
        mentira: 'Los servicios se configuran en un archivo .ini o .conf en C:\\Windows.',
        verdad: 'Cada servicio es una subclave en HKLM\\SYSTEM\\CurrentControlSet\\Services con valores como Start, ImagePath, ObjectName y Type.',
        comprobalo: 'Consultá el servicio wuauserv (Windows Update) y el driver nvlddmkm (NVIDIA) o storahci (disco): ambos están en la misma lista.',
      },
    },
    entende: {
      queEs: 'La base de datos que el Service Control Manager (services.exe) y el cargador de controladores del kernel consultan para inicializar el sistema.',
      paraQueSirve: 'Define el tipo de inicio (Start: 0=Boot, 1=System, 2=Auto, 3=Manual, 4=Disabled), la ruta del ejecutable (ImagePath) y las dependencias (DependOnService).',
      quePasaSiFalta: 'Si deshabilitas un driver de almacenamiento cambiando su Start a 4, Windows crasheará en el siguiente arranque con BSOD 0x7B.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services\\wuauserv" /v "Start"',
      psExample: 'Get-ItemPropertyValue -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\wuauserv" -Name "Start"',
      syntaxBreakdown: 'Lee el tipo de inicio de Windows Update (2=Automático, 3=Manual, 4=Deshabilitado).',
      whatToLookFor: 'Valor entero DWORD que representa la política de arranque del servicio.',
      valueType: 'REG_DWORD',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura forense del SCM. Modificar Start altera directamente el comportamiento del servicio.',
      safetyWarning: 'Nunca pongas Start=4 en drivers críticos como fltmgr, disk, partmgr o storahci.',
    },
    evidenceBadge: {
      code: 'REG-SRV-15',
      label: 'SERVICE CONTROL REPOSITORY AUDITED',
    },
  },
  {
    id: 'sec-11-16',
    code: '11.16',
    title: 'Run (Inicio Automático Persistente)',
    subtitle: 'El mecanismo clásico de autoinicio para máquina y usuario',
    targetKey: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
    commandName: 'reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'La clave Run es el vector de persistencia más utilizado tanto por aplicaciones legítimas (Steam, Discord) como por malware tradicional.',
      mythVsTruth: {
        mentira: 'Desmarcar un programa en el Administrador de Tareas borra físicamente su clave de Registro.',
        verdad: 'El Administrador de Tareas no borra la clave; añade una marca binaria en StartupApproved\\Run para deshabilitar su invocación sin eliminarla.',
        comprobalo: 'Inspeccioná HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run.',
      },
    },
    entende: {
      queEs: 'Una subclave donde cualquier cadena de valor con una ruta de archivo se ejecuta automáticamente al iniciar sesión en Windows.',
      paraQueSirve: 'Permite a las aplicaciones mantener componentes en segundo plano, asistentes de bandeja del sistema o actualizadores.',
      quePasaSiFalta: 'Tener demasiadas entradas en Run satura los recursos de I/O de disco y memoria en los primeros dos minutos tras el login.',
    },
    interactua: {
      regQueryExample: 'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"',
      psExample: 'Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"',
      syntaxBreakdown: 'Lista los ejecutables registrados para arrancar automáticamente bajo el perfil del usuario activo.',
      whatToLookFor: 'Pares nombre-valor con rutas a programas (.exe).',
      valueType: 'REG_SZ / REG_EXPAND_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Para revertir una eliminación, anota siempre el valor original antes de borrarlo.',
      safetyWarning: 'Revisar Run es el primer paso forense ante sospechas de software indeseado o adware persistente.',
    },
    evidenceBadge: {
      code: 'REG-RUN-16',
      label: 'STARTUP PERSISTENCE VECTOR ANALYZED',
    },
  },
  {
    id: 'sec-11-17',
    code: '11.17',
    title: 'RunOnce (Ejecución Única y Borrado)',
    subtitle: 'El canal transaccional para operaciones posteriores al reinicio',
    targetKey: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce',
    commandName: 'reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'A diferencia de Run, las claves dentro de RunOnce se ejecutan exactamente una vez y el propio Explorador las borra de inmediato de la colmena.',
      mythVsTruth: {
        mentira: 'RunOnce es simplemente un sinónimo de la carpeta Inicio.',
        verdad: 'RunOnce se ejecuta antes de que otros programas arranquen y elimina su propia entrada para evitar bucles infinitos tras una actualización.',
        comprobalo: 'Cuando un instalador te pide reiniciar para completar la instalación de un driver, guarda la rutina pendiente aquí.',
      },
    },
    entende: {
      queEs: 'Un registro transaccional para comandos o instaladores que requieren ejecutarse exclusivamente en el próximo ciclo de inicio.',
      paraQueSirve: 'Para limpiar archivos temporales bloqueados, renombrar DLLs en uso o completar configuraciones post-reinicio.',
      quePasaSiFalta: 'Si un programa malicioso inserta un comando destructivo en RunOnce, se ejecutará sin que el usuario lo note al siguiente login.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce"',
      psExample: 'Get-ItemProperty -Path "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce" -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'Verifica si existen tareas pendientes programadas para ejecutarse y autodestruirse en el próximo arranque.',
      whatToLookFor: 'Generalmente estará vacía en un sistema en reposo estable.',
      valueType: 'REG_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura no intrusiva de la cola transaccional.',
      safetyWarning: 'Si encuentras ejecutables desconocidos en RunOnce, investígalos inmediatamente antes de reiniciar la máquina.',
    },
    evidenceBadge: {
      code: 'REG-RUNONCE-17',
      label: 'TRANSACTIONAL EXECUTION VECTOR IDENTIFIED',
    },
  },
  {
    id: 'sec-11-18',
    code: '11.18',
    title: 'Explorer (Configuración del Shell)',
    subtitle: 'Comportamiento de la barra de tareas, explorador de archivos y carpetas',
    targetKey: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
    commandName: 'reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Todas las preferencias visuales de Windows 11 (alineación de barra de tareas, extensiones de archivo visibles, modo oscuro) residen en esta rama.',
      mythVsTruth: {
        mentira: 'Para que un cambio en Explorer tenga efecto siempre es necesario reiniciar la computadora entera.',
        verdad: 'Solo necesitas reiniciar el proceso explorer.exe (Stop-Process -Name explorer -Force) para que recargue sus claves de Registro.',
        comprobalo: 'Cambia el valor HideFileExt de 1 a 0 y reinicia Explorer: verás de inmediato las extensiones (.exe, .txt) en todos los archivos.',
      },
    },
    entende: {
      queEs: 'El conjunto de políticas y estados que controlan la interfaz gráfica del usuario de Windows.',
      paraQueSirve: 'Personalizar el entorno de trabajo, activar características ocultas de productividad y revertir cambios no deseados de interfaz.',
      quePasaSiFalta: 'Si se corrompen los valores de Explorer, la barra de tareas puede quedarse congelada o los menús contextuales tardar segundos en abrir.',
    },
    interactua: {
      regQueryExample: 'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v "HideFileExt"',
      psExample: 'Get-ItemPropertyValue -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "HideFileExt"',
      syntaxBreakdown: 'Consulta si las extensiones de archivos conocidos están ocultas (1) o visibles (0).',
      whatToLookFor: 'Valor 0 para técnicos (mostrar extensiones siempre para evitar trampas como malware.pdf.exe).',
      valueType: 'REG_DWORD',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible en tiempo real cambiando el DWORD y reiniciando el proceso explorer.',
      safetyWarning: 'Tener extensiones ocultas (HideFileExt=1) es una vulnerabilidad de seguridad grave para cualquier administrador de sistemas.',
    },
    evidenceBadge: {
      code: 'REG-EXPLORER-18',
      label: 'SHELL PREFERENCES AUDITED',
    },
  },
  {
    id: 'sec-11-19',
    code: '11.19',
    title: 'Policies (Directivas de Grupo Locales)',
    subtitle: 'Las restricciones corporativas y directivas maestras del sistema',
    targetKey: 'HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows',
    commandName: 'reg query HKLM\\SOFTWARE\\Policies',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Cuando editas una directiva en gpedit.msc (Editor de Directivas de Grupo Local), lo que realmente hace la herramienta es escribir un valor DWORD en la clave Policies.',
      mythVsTruth: {
        mentira: 'Windows Home no admite directivas porque no tiene el motor de políticas.',
        verdad: 'Windows Home tiene el mismo motor de lectura de la rama Policies en el Registro; simplemente no incluye la interfaz gráfica gpedit.msc.',
        comprobalo: 'Crea una clave de directiva manual en HKLM\\SOFTWARE\\Policies en Windows Home y comprobarás que el sistema operativo la acata al 100%.',
      },
    },
    entende: {
      queEs: 'La rama que tiene máxima prioridad de configuración sobre cualquier preferencia de usuario o aplicación.',
      paraQueSirve: 'Deshabilitar telemetría, bloquear la descarga automática de drivers por Windows Update, desactivar Cortana o configurar Windows Defender.',
      quePasaSiFalta: 'Si no hay directivas configuradas, Windows opera bajo su comportamiento predeterminado de fábrica de Microsoft.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" /s',
      psExample: 'Get-ChildItem -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'Comprueba si existen directivas corporativas restringiendo el comportamiento de Windows Update.',
      whatToLookFor: 'Valores como SetDisableUXWUAccess o DoNotConnectToWindowsUpdateInternetLocations.',
      valueType: 'Registry Key / Values',
    },
    alertaEVO: {
      reversibilityRule: 'Para anular una directiva, basta con eliminar el valor o la subclave dentro de Policies.',
      safetyWarning: 'Muchas "optimizaciones" de internet crean claves en Policies que rompen la tienda de Windows o el soporte de seguridad.',
    },
    evidenceBadge: {
      code: 'REG-POLICIES-19',
      label: 'SECURITY POLICY HIERARCHY CONFIRMED',
    },
  },
  {
    id: 'sec-11-20',
    code: '11.20',
    title: 'Environment (Variables de Entorno)',
    subtitle: 'Las variables globales y locales como PATH, TEMP y COMSPEC',
    targetKey: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment',
    commandName: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment"',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'La variable PATH es la lista de directorios donde Windows busca los ejecutables cuando escribes un comando en CMD o PowerShell sin poner la ruta completa.',
      mythVsTruth: {
        mentira: 'Para modificar una variable de entorno permanente hay que usar el comando set en CMD.',
        verdad: 'El comando set solo modifica la memoria volátil de esa ventana específica de CMD; para hacerla persistente se debe escribir en el Registro.',
        comprobalo: 'Ejecutá reg query sobre Session Manager\\Environment /v Path y comparalo con $env:Path.',
      },
    },
    entende: {
      queEs: 'El repositorio central donde se definen las rutas estándar del sistema y directorios temporales.',
      paraQueSirve: 'Permite a los compiladores, intérpretes (Python, Node, Git) y herramientas de línea de comandos ser invocados globalmente.',
      quePasaSiFalta: 'Si la variable PATH se borra o corrompe, comandos nativos como notepad, ping o shutdown dejarán de ser reconocidos.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /v "Path"',
      psExample: 'Get-ItemPropertyValue -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" -Name "Path"',
      syntaxBreakdown: 'Lee la cadena ampliable con la lista oficial de directorios del PATH del sistema.',
      whatToLookFor: 'C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem...',
      valueType: 'REG_EXPAND_SZ',
    },
    alertaEVO: {
      reversibilityRule: 'Guarda una copia exacta del valor actual antes de agregar nuevas rutas a la variable PATH.',
      safetyWarning: 'Sobrescribir el PATH sin concatenar el valor anterior impedirá que Windows encuentre ejecutables esenciales del sistema.',
    },
    evidenceBadge: {
      code: 'REG-ENV-20',
      label: 'ENVIRONMENT VARIABLES VALIDATED',
    },
  },
  {
    id: 'sec-11-21',
    code: '11.21',
    title: 'Uninstall (Catálogo de Programas Instalados)',
    subtitle: 'La clave forense donde Windows lista las aplicaciones para desinstalación',
    targetKey: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
    commandName: 'reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall /s',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El panel "Agregar o quitar programas" no escanea tu disco buscando ejecutables: simplemente lee las subclaves dentro de la rama Uninstall.',
      mythVsTruth: {
        mentira: 'Si un programa no aparece en Configuración, significa que no está instalado en la máquina.',
        verdad: 'Muchos programas portables o malware no se registran en Uninstall; y las apps de 32 bits en sistemas de 64 bits residen en Wow6432Node\\Uninstall.',
        comprobalo: 'Revisá HKLM\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall para ver aplicaciones de 32 bits.',
      },
    },
    entende: {
      queEs: 'El inventario oficial de software que contiene el DisplayName, DisplayVersion, Publisher, InstallLocation y UninstallString.',
      paraQueSirve: 'Permite a administradores auditar inventario de software de forma desatendida y ejecutar desinstalaciones silenciosas.',
      quePasaSiFalta: 'Borrar una clave de aquí no desinstala el programa, solo elimina su entrada de la lista visual de Windows.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall" /k',
      psExample: 'Get-ChildItem -Path "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall" | Select-Object -First 5 PSChildName',
      syntaxBreakdown: 'Lista los GUIDs y nombres de paquetes registrados para desinstalación a nivel de máquina.',
      whatToLookFor: 'Identificadores únicos (GUIDs como {XXXXXXXX-XXXX...}) y nombres directos de aplicaciones.',
      valueType: 'Registry Subkeys',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura inofensiva de inventario de software.',
      safetyWarning: 'El valor UninstallString muestra el comando exacto para desinstalar la aplicación por consola.',
    },
    evidenceBadge: {
      code: 'REG-UNINSTALL-21',
      label: 'SOFTWARE INVENTORY CATALOG INDEXED',
    },
  },
  {
    id: 'sec-11-22',
    code: '11.22',
    title: 'Tipos de Datos (DWORD, QWORD, String, Binary)',
    subtitle: 'La tipificación estricta de valores en las celdas del Registro',
    targetKey: 'Estructuras de Datos del Kernel NT',
    commandName: 'reg query /?',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El Registro no almacena texto genérico: cada celda tiene un tipo de dato binario estricto que el kernel interpreta directamente.',
      mythVsTruth: {
        mentira: 'Puedes poner cualquier tipo de dato en una clave y Windows lo convertirá automáticamente.',
        verdad: 'Si una clave espera un DWORD numérico de 32 bits y le escribes una cadena String, el controlador o servicio fallará silenciosamente.',
        comprobalo: 'Los tipos principales son: REG_SZ (cadena fija), REG_EXPAND_SZ (cadena con variables %SYSTEMROOT%), REG_DWORD (entero 32 bits), REG_QWORD (64 bits), REG_BINARY y REG_MULTI_SZ.',
      },
    },
    entende: {
      queEs: 'La especificación de formato que define cómo se empaquetan los bytes dentro de las celdas de la colmena.',
      paraQueSirve: 'Garantizar que los valores numéricos booleanos (0 o 1) se almacenen en exactamente 4 bytes y las rutas dinámicas resuelvan variables de entorno.',
      quePasaSiFalta: 'Usar REG_SZ en lugar de REG_EXPAND_SZ hace que %SystemRoot% se interprete como texto literal en lugar de convertirse en C:\\Windows.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v "InstallDate"',
      psExample: 'Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" | Select-Object InstallDate',
      syntaxBreakdown: 'Consulta la fecha de instalación en formato Unix Timestamp (segundos transcurridos desde 1970).',
      whatToLookFor: 'Valor en formato REG_DWORD hexadecimal.',
      valueType: 'REG_DWORD (Integer 32-bit)',
    },
    alertaEVO: {
      reversibilityRule: 'Comprender los tipos evita corrupciones al crear o modificar scripts .reg.',
      safetyWarning: 'Verifica siempre si el valor a crear es DWORD (32-bit) o QWORD (64-bit) antes de ejecutar reg add.',
    },
    evidenceBadge: {
      code: 'REG-TYPES-22',
      label: 'DATA TYPES TYPING SPECIFICATION VERIFIED',
    },
  },
  {
    id: 'sec-11-23',
    code: '11.23',
    title: 'Backup del Registro',
    subtitle: 'Estrategias de respaldo: RegBack, System Restore y exportación',
    targetKey: 'C:\\Windows\\System32\\config\\RegBack',
    commandName: 'reg save /?',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Desde Windows 10 versión 1803, Microsoft desactivó las copias de seguridad automáticas en la carpeta RegBack para ahorrar espacio en disco.',
      mythVsTruth: {
        mentira: 'Windows hace copias de respaldo automáticas del Registro en la carpeta RegBack todos los días.',
        verdad: 'La carpeta RegBack existe pero contiene archivos vacíos de 0 KB a menos que reactives la directiva EnablePeriodicBackup.',
        comprobalo: 'Ejecutá dir C:\\Windows\\System32\\config\\RegBack: verás que los archivos pesan 0 bytes en instalaciones modernas.',
      },
    },
    entende: {
      queEs: 'El procedimiento para obtener una instantánea consistente de las colmenas del Registro antes de aplicar modificaciones.',
      paraQueSirve: 'Permite restaurar el sistema en caso de una configuración corrupta que impida el arranque o rompa servicios críticos.',
      quePasaSiFalta: 'Sin respaldo, un error grave en HKLM exige reinstalar Windows o reparar manualmente con WinPE y copias de Shadow Copy.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Configuration Manager" /v "EnablePeriodicBackup"',
      psExample: 'Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Configuration Manager" -Name "EnablePeriodicBackup" -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'Comprueba si la directiva de respaldo periódico automático de colmenas está habilitada (1) o ausente/0.',
      whatToLookFor: 'Valor DWORD 1 si el administrador reactivó la tarea de respaldo.',
      valueType: 'REG_DWORD',
    },
    alertaEVO: {
      reversibilityRule: 'Regla de oro EVO: Siempre exporta la clave antes de modificar un solo byte.',
      safetyWarning: 'Crear un Punto de Restauración del Sistema es la forma más segura de respaldar todas las colmenas con Volume Shadow Copy.',
    },
    evidenceBadge: {
      code: 'REG-BACKUP-23',
      label: 'BACKUP POLICY & REGBACK STATUS AUDITED',
    },
  },
  {
    id: 'sec-11-24',
    code: '11.24',
    title: 'Exportación de Claves',
    subtitle: 'Creación de archivos .reg para preservación de estado',
    targetKey: 'Archivo de texto estándar Windows Registry Editor Version 5.00',
    commandName: 'reg export [clave] [archivo.reg]',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Exportar una rama produce un archivo de texto plano con encabezado "Windows Registry Editor Version 5.00" que se puede auditar con cualquier editor.',
      mythVsTruth: {
        mentira: 'Un archivo .reg exportado contiene datos binarios incomprensibles.',
        verdad: 'Los archivos .reg son texto plano UTF-16LE legible donde los valores binarios se representan en series hexadecimales delimitadas por comas.',
        comprobalo: 'Exportá una clave de prueba y abrí el archivo con bloc de notas: verás claramente cada subclave entre corchetes.',
      },
    },
    entende: {
      queEs: 'La serialización textual de una subclave del Registro y todos sus valores subordinados.',
      paraQueSirve: 'Generar copias de seguridad portátiles, distribuir ajustes de configuración a múltiples equipos y documentar cambios.',
      quePasaSiFalta: 'Si modificas el Registro a ciegas sin exportar previamente, pierdes el valor original de fábrica sin posibilidad de comparación.',
    },
    interactua: {
      regQueryExample: 'reg export "HKCU\\Control Panel\\Desktop" "%USERPROFILE%\\Desktop-Backup.reg" /y',
      psExample: 'Start-Process reg.exe -ArgumentList \'export "HKCU\\Control Panel\\Desktop" "$env:TEMP\\desktop.reg" /y\' -Wait',
      syntaxBreakdown: 'Exporta la rama Desktop completa del usuario actual al archivo desktop.reg sobrescribiendo si ya existe (/y).',
      whatToLookFor: 'Mensaje de éxito: La operación se completó correctamente.',
      valueType: 'Text File (.reg Serialization)',
    },
    alertaEVO: {
      reversibilityRule: 'Operación 100% de solo lectura en el Registro.',
      safetyWarning: 'Asegúrate de no almacenar archivos .reg que contengan secretos o contraseñas en ubicaciones públicas.',
    },
    evidenceBadge: {
      code: 'REG-EXPORT-24',
      label: 'SERIALIZED EXPORT WORKFLOW CONFIRMED',
    },
  },
  {
    id: 'sec-11-25',
    code: '11.25',
    title: 'Importación de Archivos .reg',
    subtitle: 'El motor de fusión (merge) e inyección en el árbol activo',
    targetKey: 'Inyección en colmenas activas',
    commandName: 'reg import [archivo.reg]',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Hacer doble clic en un archivo .reg no reemplaza toda la clave: realiza una operación de fusión (merge), agregando o sobrescribiendo solo los valores descritos.',
      mythVsTruth: {
        mentira: 'Importar un archivo .reg borra todos los valores que no estén listados en el archivo.',
        verdad: 'Es una unión (merge). Los valores existentes que no aparezcan en el .reg se mantienen intactos a menos que uses la sintaxis especial de eliminación con guion (-).',
        comprobalo: 'Para borrar una clave mediante un archivo .reg se debe colocar un signo menos dentro de los corchetes: [-HKEY_CURRENT_USER\\ClaveABorrar].',
      },
    },
    entende: {
      queEs: 'El proceso por el cual el editor de registro analiza un archivo sintáctico y vuelca sus pares clave-valor a la colmena correspondiente.',
      paraQueSirve: 'Aplicar configuraciones maestras, restaurar respaldos y automatizar el aprovisionamiento de software.',
      quePasaSiFalta: 'Si ejecutas un archivo .reg descargado de internet sin revisarlo previamente, puedes destruir la configuración de tu sistema en un milisegundo.',
    },
    interactua: {
      regQueryExample: 'reg import "C:\\Ruta\\Configuracion.reg"',
      psExample: 'Start-Process reg.exe -ArgumentList \'import "C:\\Ruta\\Configuracion.reg"\' -Wait',
      syntaxBreakdown: 'Inyecta silenciosamente las instrucciones del archivo .reg en el Registro local.',
      whatToLookFor: 'Verificación de que el comando devuelva código de salida 0 (éxito).',
      valueType: 'State Modification Process',
    },
    alertaEVO: {
      reversibilityRule: 'Revertir una importación requiere tener el archivo .reg inverso con los valores anteriores o con la sintaxis de eliminación (-).',
      safetyWarning: 'REGLA SAGRADA: Abre siempre un archivo .reg con Bloc de notas y audita cada línea antes de permitir su fusión.',
    },
    evidenceBadge: {
      code: 'REG-IMPORT-25',
      label: 'REGISTRY INJECTION PIPELINE VALIDATED',
    },
  },
  {
    id: 'sec-11-26',
    code: '11.26',
    title: 'reg query (La Herramienta de Lectura en Consola)',
    subtitle: 'Inspección forense de claves y valores sin abrir la interfaz regedit',
    targetKey: 'CLI Nativo de Windows (reg.exe)',
    commandName: 'reg query [clave] /v [valor]',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'reg query es la herramienta más rápida y segura para auditar el Registro porque no requiere abrir la interfaz gráfica y es completamente de solo lectura.',
      mythVsTruth: {
        mentira: 'Para ver qué hay en el Registro es obligatorio abrir regedit.exe con interfaz visual.',
        verdad: 'reg query permite consultar claves individuales, filtrar por nombres de valores y realizar búsquedas recursivas con el modificador /s desde cualquier script.',
        comprobalo: 'Ejecutá reg query "HKLM\\HARDWARE\\DESCRIPTION\\System" y obtendrás datos instantáneos de la BIOS y placa base.',
      },
    },
    entende: {
      queEs: 'El comando de consola integrado en System32\\reg.exe especializado en la lectura de colmenas.',
      paraQueSirve: 'Auditorías de seguridad desatendidas, recolección de telemetría forense y verificación de estado en scripts por lotes.',
      quePasaSiFalta: 'Sin reg query, auditar claves remotas o automatizadas requiere escribir scripts más complejos en C++ o PowerShell.',
    },
    interactua: {
      regQueryExample: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v "ProductName"',
      psExample: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v "ProductName"',
      syntaxBreakdown: 'Consulta el valor ProductName dentro de la clave CurrentVersion de Windows NT.',
      whatToLookFor: 'Muestra el nombre del SO (ej. Windows 10 Pro / Windows 11 Pro).',
      valueType: 'REG_SZ (Read Result)',
    },
    alertaEVO: {
      reversibilityRule: 'Herramienta pura de lectura; riesgo cero.',
      safetyWarning: 'El parámetro /s busca recursivamente en todas las subclaves; úsalo con precaución en ramas muy extensas para no saturar la consola.',
    },
    evidenceBadge: {
      code: 'REG-QUERY-26',
      label: 'CLI FORENSIC QUERY VERIFIED',
    },
  },
  {
    id: 'sec-11-27',
    code: '11.27',
    title: 'reg add (Creación y Modificación por Consola)',
    subtitle: 'Inyección precisa de claves, tipos de datos y valores con el flag /f',
    targetKey: 'CLI Nativo de Windows (reg.exe)',
    commandName: 'reg add [clave] /v [valor] /t [tipo] /d [datos] /f',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'reg add permite crear subclaves y asignar valores de forma atómica en un solo comando de consola sin intervención del usuario.',
      mythVsTruth: {
        mentira: 'reg add siempre te pide confirmación antes de sobrescribir un valor existente.',
        verdad: 'Si incluyes el flag /f (force), sobrescribirá cualquier valor existente sin advertirte ni pedir confirmación.',
        comprobalo: 'Revisá la sintaxis: reg add [KeyName] /v [ValueName] /t [Type] /d [Data] /f.',
      },
    },
    entende: {
      queEs: 'El comando nativo de System32 para crear o actualizar claves y valores en el árbol del Registro.',
      paraQueSirve: 'Automatización de ajustes de sistema, despliegue de políticas por scripts y corrección de parámetros en modo recuperación.',
      quePasaSiFalta: 'Si se utiliza sin especificar el tipo de dato correcto (/t), reg asignará REG_SZ por defecto, lo que puede romper configuraciones que esperan números DWORD.',
    },
    interactua: {
      regQueryExample: 'reg add "HKCU\\Software\\EvoLabs\\Test" /v "DemoKey" /t REG_DWORD /d 1 /f',
      psExample: 'reg add "HKCU\\Software\\EvoLabs\\Test" /v "DemoKey" /t REG_DWORD /d 1 /f',
      syntaxBreakdown: 'Crea la subclave EvoLabs\\Test y el valor DemoKey con tipo REG_DWORD y dato numérico 1.',
      whatToLookFor: 'Mensaje: La operación se completó correctamente.',
      valueType: 'Atomic Write Operation',
    },
    alertaEVO: {
      reversibilityRule: 'Para revertir este cambio específico, ejecuta: reg delete "HKCU\\Software\\EvoLabs\\Test" /f.',
      safetyWarning: 'Nunca ejecutes reg add en ramas de HKLM\\SYSTEM o HKLM\\SAM sin haber probado previamente la instrucción en una clave de prueba en HKCU.',
    },
    evidenceBadge: {
      code: 'REG-ADD-27',
      label: 'ATOMIC WRITE PRIMITIVE VALIDATED',
    },
  },
  {
    id: 'sec-11-28',
    code: '11.28',
    title: 'reg delete (Eliminación Segura de Claves y Valores)',
    subtitle: 'El destructor atómico de entradas: cómo borrar un valor sin destruir la subclave',
    targetKey: 'CLI Nativo de Windows (reg.exe)',
    commandName: 'reg delete [clave] /v [valor] /f',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'Si olvidas especificar el parámetro /v [nombre-del-valor], reg delete borrará la subclave completa con todos los valores que contiene en su interior.',
      mythVsTruth: {
        mentira: 'Los valores borrados del Registro van a la Papelera de Reciclaje.',
        verdad: 'El Registro no tiene papelera de reciclaje; la celda se marca inmediatamente como libre y los datos se pierden en memoria.',
        comprobalo: 'La única forma de recuperar una clave borrada sin copia de respaldo es analizando el espacio no asignado (slack space) del archivo binario con herramientas forenses especializadas.',
      },
    },
    entende: {
      queEs: 'El comando nativo para purgar claves o valores específicos de las colmenas activas.',
      paraQueSirve: 'Limpiar entradas huérfanas de software desinstalado, remover persistencias de malware y revertir cambios no deseados.',
      quePasaSiFalta: 'Ejecutar reg delete en una rama equivocada (como HKLM\\SYSTEM\\CurrentControlSet\\Services) destruye instantáneamente el sistema operativo.',
    },
    interactua: {
      regQueryExample: 'reg delete "HKCU\\Software\\EvoLabs\\Test" /v "DemoKey" /f',
      psExample: 'reg delete "HKCU\\Software\\EvoLabs\\Test" /v "DemoKey" /f',
      syntaxBreakdown: 'Borra de forma segura únicamente el valor DemoKey, preservando la clave contenedora intacta.',
      whatToLookFor: 'Confirmación de eliminación exitosa.',
      valueType: 'Atomic Deletion Primitive',
    },
    alertaEVO: {
      reversibilityRule: 'Irreversible sin respaldo previo.',
      safetyWarning: 'REGLA ESTRICTA: Especifica SIEMPRE /v para borrar un valor individual. Si quieres borrar toda la clave, revisa dos veces la ruta antes de presionar Enter.',
    },
    evidenceBadge: {
      code: 'REG-DELETE-28',
      label: 'ATOMIC DELETION PRIMITIVE SECURED',
    },
  },
  {
    id: 'sec-11-29',
    code: '11.29',
    title: 'reg export (Extracción Selectiva desde CLI)',
    subtitle: 'Automatización de copias de seguridad de ramas completas a formato .reg',
    targetKey: 'CLI Nativo de Windows (reg.exe)',
    commandName: 'reg export [clave] [destino.reg]',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'reg export te permite crear respaldos automáticos programados de ramas específicas antes de aplicar actualizaciones de software o parches.',
      mythVsTruth: {
        mentira: 'reg export y reg save hacen exactamente lo mismo.',
        verdad: 'reg export genera un archivo de texto plano .reg; reg save extrae la copia binaria en bruto del Hive en formato binario de bajo nivel.',
        comprobalo: 'Compara un archivo generado con reg export (legible en bloc de notas) con uno generado con reg save (ilegible, formato binario de colmena).',
      },
    },
    entende: {
      queEs: 'La función del comando reg.exe encargada de serializar ramas completas en formato estándar de texto de registro.',
      paraQueSirve: 'Generar copias de seguridad incrementales, migrar configuraciones de aplicaciones entre máquinas y versionar ajustes en repositorios Git.',
      quePasaSiFalta: 'Si no automatizas la exportación, las tareas de administración carecen de trazabilidad de cambios.',
    },
    interactua: {
      regQueryExample: 'reg export "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" "%TEMP%\\RunBackup.reg" /y',
      psExample: 'reg export "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" "$env:TEMP\\RunBackup.reg" /y',
      syntaxBreakdown: 'Exporta todas las aplicaciones de inicio del usuario actual a un archivo en la carpeta temporal.',
      whatToLookFor: 'Archivo RunBackup.reg creado correctamente en la carpeta TEMP.',
      valueType: 'REG Export Command',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura pura de colmena.',
      safetyWarning: 'El archivo resultante puede importarse en cualquier momento con reg import para restaurar el estado exacto.',
    },
    evidenceBadge: {
      code: 'REG-EXPORTCLI-29',
      label: 'CLI EXPORT AUTOMATION CONFIRMED',
    },
  },
  {
    id: 'sec-11-30',
    code: '11.30',
    title: 'Crear Menú Contextual Personalizado',
    subtitle: 'Arquitectura de comandos en HKCR\\Directory\\Background\\shell',
    targetKey: 'HKCR\\Directory\\Background\\shell',
    commandName: 'reg query HKCR\\Directory\\Background\\shell',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Puedes añadir tus propias herramientas técnicas (como una consola de terminal, visor de tareas o limpiador) al menú contextual del botón derecho en el escritorio.',
      mythVsTruth: {
        mentira: 'Para modificar el menú contextual de Windows se necesitan programas externos de personalización.',
        verdad: 'El menú contextual es simplemente una serie de subclaves en HKCR\\Directory\\Background\\shell donde defines el nombre y el comando command.',
        comprobalo: 'Inspeccioná HKCR\\Directory\\Background\\shell: verás cómo se registran las entradas nativas de PowerShell y CMD.',
      },
    },
    entende: {
      queEs: 'El mecanismo de extensibilidad de la Shell de Windows para el menú del botón derecho del ratón en carpetas y escritorio.',
      paraQueSirve: 'Crear accesos directos de alta productividad para administradores: "Abrir Terminal como SYSTEM", "Auditar Carpeta", etc.',
      quePasaSiFalta: 'Tener extensiones de menú defectuosas o con rutas rotas provoca que hacer clic derecho tarde segundos en responder.',
    },
    interactua: {
      regQueryExample: 'reg query "HKCR\\Directory\\Background\\shell"',
      psExample: 'Get-ChildItem -Path "Registry::HKEY_CLASSES_ROOT\\Directory\\Background\\shell"',
      syntaxBreakdown: 'Muestra los elementos de menú contextual registrados para el fondo del explorador y escritorio.',
      whatToLookFor: 'Nombres de comandos como cmd, Powershell o AnyCode.',
      valueType: 'Shell Extensions Subkeys',
    },
    alertaEVO: {
      reversibilityRule: 'Basta con eliminar la subclave creada para que el menú desaparezca de inmediato sin reiniciar.',
      safetyWarning: 'En Windows 11, los menús tradicionales se ubican detrás de "Mostrar más opciones" (Shift + F10) a menos que se use la API moderna de Sparse Packages.',
    },
    evidenceBadge: {
      code: 'REG-MENU-30',
      label: 'SHELL EXTENSION ARCHITECTURE AUDITED',
    },
  },
  {
    id: 'sec-11-31',
    code: '11.31',
    title: 'ADD-EVO-MENU.reg (Artefacto Oficial EVO)',
    subtitle: 'El script de inyección canónica para la consola técnica EVO',
    targetKey: 'HKCU\\Software\\Classes\\Directory\\Background\\shell\\EvoConsole',
    commandName: 'reg import ADD-EVO-MENU.reg',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Este artefacto inyecta un menú contextual técnico en el perfil de usuario activo para abrir PowerShell elevado con herramientas forenses precargadas.',
      mythVsTruth: {
        mentira: 'Modificar menús contextuales requiere tocar ramas globales de HKLM con riesgo para toda la máquina.',
        verdad: 'Se puede inyectar en HKCU\\Software\\Classes sin requerir permisos de administrador y con impacto exclusivo en tu usuario.',
        comprobalo: 'Inspecciona el contenido del archivo ADD-EVO-MENU.reg antes de ejecutarlo para comprobar su total seguridad y transparencia.',
      },
    },
    entende: {
      queEs: 'Un archivo .reg profesional diseñado bajo los estándares EVO para extender la productividad de administración.',
      paraQueSirve: 'Proporciona acceso inmediato a la consola técnica forense con un solo clic derecho sobre cualquier espacio en blanco.',
      quePasaSiFalta: 'El administrador debe abrir manualmente la terminal, navegar a la ruta y cargar sus módulos a mano.',
    },
    interactua: {
      regQueryExample: 'reg query "HKCU\\Software\\Classes\\Directory\\Background\\shell\\EvoConsole\\command"',
      psExample: 'Get-ItemProperty "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\EvoConsole\\command" -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'Verifica si la subclave del artefacto EVO Console está inyectada en el perfil de usuario.',
      whatToLookFor: 'Comando de invocación a PowerShell con parámetros de auditoría.',
      valueType: 'REG_SZ (Registered Shell Command)',
    },
    alertaEVO: {
      reversibilityRule: 'Completamente reversible mediante el script REMOVE-EVO-MENU.reg incluido en la siguiente investigación.',
      safetyWarning: 'Aplica solo en HKCU, garantizando que otros usuarios del equipo no se vean afectados.',
    },
    evidenceBadge: {
      code: 'REG-EVOADD-31',
      label: 'EVO CONTEXT MENU ARTIFACT VALIDATED',
    },
  },
  {
    id: 'sec-11-32',
    code: '11.32',
    title: 'REMOVE-EVO-MENU.reg (Desinstalación y Limpieza)',
    subtitle: 'La rutina de purga limpia con sintaxis de eliminación [-HKEY...]',
    targetKey: '[-HKCU\\Software\\Classes\\Directory\\Background\\shell\\EvoConsole]',
    commandName: 'reg import REMOVE-EVO-MENU.reg',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'La filosofía EVO exige que toda modificación técnica deba tener su contraparte de desinstalación limpia y sin huérfanos.',
      mythVsTruth: {
        mentira: 'Desinstalar un menú contextual personalizado exige formatear o restaurar el sistema.',
        verdad: 'Un archivo .reg de una sola línea con un signo menos [-HKCU\\...] elimina la subclave y todos sus comandos en 10 milisegundos.',
        comprobalo: 'Abre el archivo REMOVE-EVO-MENU.reg y observa la sintaxis canónica de purga.',
      },
    },
    entende: {
      queEs: 'El artefacto de restauración de estado que devuelve el Registro a su condición limpia original.',
      paraQueSirve: 'Garantizar el principio de reversibilidad absoluta en los laboratorios y auditorías de EVO LABS.',
      quePasaSiFalta: 'Quedan entradas muertas en el Registro que pueden apuntar a programas eliminados.',
    },
    interactua: {
      regQueryExample: 'reg delete "HKCU\\Software\\Classes\\Directory\\Background\\shell\\EvoConsole" /f',
      psExample: 'Remove-Item -Path "HKCU:\\Software\\Classes\\Directory\\Background\\shell\\EvoConsole" -Recurse -Force -ErrorAction SilentlyContinue',
      syntaxBreakdown: 'Elimina completamente la subclave del menú EVO Console y su comando subordinado.',
      whatToLookFor: 'Comprobación de que la clave ya no existe en el registro.',
      valueType: 'Registry Cleanup Primitive',
    },
    alertaEVO: {
      reversibilityRule: 'Devuelve el estado a limpio de fábrica.',
      safetyWarning: 'Ejecuta esta rutina cada vez que desees finalizar las pruebas del laboratorio de menús contextuales.',
    },
    evidenceBadge: {
      code: 'REG-EVOREM-32',
      label: 'EVO CLEAN PURGE ARTIFACT CONFIRMED',
    },
  },
];

export const SECTOR_11_MINICASES: Sector11MiniCase[] = [
  {
    id: 'case-11-01',
    code: 'CASE-11-01',
    title: 'Pantallazo Azul Bad System Config Info (0x74) tras Apagón',
    scenario: 'Un equipo de desarrollo sufrió un corte de energía mientras Windows instalaba actualizaciones. Al arrancar, el sistema muestra BSOD Bad System Config Info y entra en bucle de reparación automática.',
    userStatement: '"La PC no inicia. Dice que la configuración del sistema está dañada y no me deja entrar en modo seguro."',
    initialMistake: 'Formatear el disco completo asumiendo que el hardware de almacenamiento está dañado.',
    diagnosticQuestion: '¿Cuál es la causa técnica real de este error y cómo se diagnostica a bajo nivel desde la consola de WinPE?',
    options: [
      {
        id: 'opt-a',
        text: 'La colmena SYSTEM en C:\\Windows\\System32\\config se corrompió al cortarse la energía durante una transacción; se debe verificar con chkdsk y comprobar los archivos de respaldo o shadow copies.',
        isCorrect: true,
        explanation: 'Bad System Config Info (0x74) indica que el Configuration Manager del kernel no pudo montar o validar la estructura transaccional del archivo binario SYSTEM.',
      },
      {
        id: 'opt-b',
        text: 'Se borró el archivo NTUSER.DAT del perfil del usuario.',
        isCorrect: false,
        explanation: 'La falta de NTUSER.DAT solo afecta al inicio de sesión interactivo de ese usuario, nunca produce un BSOD 0x74 en el arranque del kernel.',
      },
      {
        id: 'opt-c',
        text: 'La memoria RAM perdió su configuración en la BIOS.',
        isCorrect: false,
        explanation: '0x74 es un código de comprobación de errores exclusivo del cargador del Registro de Windows, no de la BIOS.',
      },
    ],
    technicalVerdict: 'Corrupción del Hive binario SYSTEM por interrupción de I/O de disco durante escritura de actualización.',
    lessonLearned: 'Los Hives son archivos transaccionales; un apagón durante una escritura sin UPS puede dejar la colmena en estado inconsistente.',
  },
  {
    id: 'case-11-02',
    code: 'CASE-11-02',
    title: 'Explorador no Muestra Extensiones y Causa Infección',
    scenario: 'Un usuario abrió un archivo adjunto que parecía una factura en PDF pero en realidad era un ejecutable malicioso que cifró sus documentos.',
    userStatement: '"Hice doble clic en Factura-Mayo.pdf y no se abrió nada, solo parpadeó la pantalla."',
    initialMistake: 'Culpar al antivirus sin revisar que Windows ocultaba la verdadera extensión .exe al final del nombre.',
    diagnosticQuestion: '¿Qué clave del Registro controla la visibilidad de extensiones y qué valor debe tener para forzar que siempre se muestren?',
    options: [
      {
        id: 'opt-a',
        text: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\HideFileExt debe tener valor DWORD 0.',
        isCorrect: true,
        explanation: 'HideFileExt=0 desactiva el ocultamiento de extensiones, exponiendo el verdadero nombre Factura-Mayo.pdf.exe.',
      },
      {
        id: 'opt-b',
        text: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\Explorer\\Start=4.',
        isCorrect: false,
        explanation: 'Explorer no es un servicio en la rama Services y Start=4 deshabilitaría componentes del kernel.',
      },
      {
        id: 'opt-c',
        text: 'HKCR\\.pdf\\(Default) debe borrarse.',
        isCorrect: false,
        explanation: 'Borrar la asociación de PDF rompería la apertura de documentos legítimos sin resolver el problema de las extensiones dobles.',
      },
    ],
    technicalVerdict: 'HideFileExt configurado en 1 de fábrica enmascaró la extensión ejecutable .exe detrás de un nombre falso.',
    lessonLearned: 'Configurar HideFileExt=0 en el Registro es una medida básica obligatoria de higiene defensiva en cualquier equipo.',
  },
  {
    id: 'case-11-03',
    code: 'CASE-11-03',
    title: 'Aplicación Huérfana Persistente en el Arranque',
    scenario: 'Tras desinstalar un programa de mensajería, cada vez que el usuario inicia sesión aparece una ventana de error informando que no se encuentra un archivo DLL en C:\\Users\\...\\AppData.',
    userStatement: '"Ya desinstalé el programa pero el error me sigue saliendo cada vez que prendo la computadora."',
    initialMistake: 'Descargar un "limpiador de registro" automático de internet que promete solucionar todo con un clic.',
    diagnosticQuestion: '¿Dónde se encuentra registrada la persistencia huérfana y cómo debe corregirse con precisión quirúrgica?',
    options: [
      {
        id: 'opt-a',
        text: 'En HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run; se debe auditar con reg query o Autoruns y eliminar únicamente el valor huérfano con reg delete.',
        isCorrect: true,
        explanation: 'El desinstalador omitió borrar la entrada de autoinicio en Run; eliminar el valor exacto soluciona el error sin tocar nada más.',
      },
      {
        id: 'opt-b',
        text: 'En HKLM\\SAM\\Users; se debe resetear la contraseña del usuario.',
        isCorrect: false,
        explanation: 'SAM solo gestiona autenticación y hashes de contraseñas, no programas de inicio.',
      },
      {
        id: 'opt-c',
        text: 'En C:\\Windows\\System32\\config\\SYSTEM.',
        isCorrect: false,
        explanation: 'Las aplicaciones de usuario se inician desde HKCU\\...\\Run, no desde los controladores del kernel.',
      },
    ],
    technicalVerdict: 'Entrada huérfana en la clave de persistencia HKCU\\...\\Run apuntando a una DLL previamente eliminada.',
    lessonLearned: 'Nunca uses optimizadores mágicos que escanean miles de claves; audita la clave Run directamente con herramientas nativas.',
  },
  {
    id: 'case-11-04',
    code: 'CASE-11-04',
    title: 'Driver de Almacenamiento Deshabilitado y Bucle de Arranque',
    scenario: 'Un usuario intentó "optimizar" Windows siguiendo una guía de internet y deshabilitó el servicio storahci poniendo su clave Start en 4. Al reiniciar, el sistema arroja INACCESSIBLE_BOOT_DEVICE.',
    userStatement: '"Seguí un tutorial para acelerar el inicio y ahora Windows no encuentra el disco."',
    initialMistake: 'Reinstalar Windows perdiendo todos los archivos del usuario.',
    diagnosticQuestion: '¿Cómo se restaura el valor original de arranque del controlador desde un entorno de recuperación WinPE?',
    options: [
      {
        id: 'opt-a',
        text: 'Cargar la colmena offline C:\\Windows\\System32\\config\\SYSTEM usando "reg load HKLM\\OFFLINE_SYSTEM", navegar a Services\\storahci y cambiar Start a 0 (Boot), luego descargar con "reg unload".',
        isCorrect: true,
        explanation: 'reg load permite montar colmenas de instalaciones dañadas en modo offline, corregir el valor de Start y devolver el driver al arranque de fase temprana.',
      },
      {
        id: 'opt-b',
        text: 'Ejecutar format C: desde el símbolo del sistema.',
        isCorrect: false,
        explanation: 'Format destruiría todos los datos sin solucionar la causa del fallo de configuración.',
      },
      {
        id: 'opt-c',
        text: 'Borrar el archivo storahci.sys de System32\\drivers.',
        isCorrect: false,
        explanation: 'Borrar el archivo físico del driver empeoraría el problema impidiendo que el kernel cargue el controlador de disco.',
      },
    ],
    technicalVerdict: 'storahci con Start=4 impedía al kernel inicializar la controladora SATA/AHCI para montar el volumen de arranque C:.',
    lessonLearned: 'Los valores de Start en Services controlan fases críticas del kernel: Start=0 es Boot, Start=4 es Disabled.',
  },
];

export const SECTOR_11_TEST_BANK: Sector11TestQuestion[] = [
  {
    id: 'test-11-01',
    questionNumber: 1,
    category: 'HIVES_Y_ARQUITECTURA',
    question: '¿Qué es técnicamente un "Hive" (colmena) en la arquitectura de Windows NT?',
    options: [
      { id: 'a', text: 'Un archivo XML de texto plano comprimido en ZIP.' },
      { id: 'b', text: 'Una estructura de datos discreta en disco con formato binario transaccional respaldada por archivos como SYSTEM o SOFTWARE.' },
      { id: 'c', text: 'Un proceso en segundo plano que vigila el uso de la memoria RAM.' },
      { id: 'd', text: 'Una partición oculta del disco duro en formato exFAT.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Un Hive es un archivo binario transaccional discreto en disco gestionado por el Configuration Manager del kernel NT con sus logs (.LOG1, .LOG2).',
    relatedInvestigationCode: '11.01',
  },
  {
    id: 'test-11-02',
    questionNumber: 2,
    category: 'HIVES_Y_ARQUITECTURA',
    question: '¿A qué apunta realmente la raíz HKEY_CURRENT_USER (HKCU)?',
    options: [
      { id: 'a', text: 'A un archivo físico llamado HKCU.DAT en System32.' },
      { id: 'b', text: 'Es un enlace simbólico en memoria que apunta a la entrada del SID del usuario activo dentro de HKEY_USERS.' },
      { id: 'c', text: 'A la base de datos de Active Directory del controlador de dominio.' },
      { id: 'd', text: 'Al archivo bootmgr en la partición EFI.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'HKCU es un alias simbólico que el kernel monta dinámicamente apuntando a HKEY_USERS\\<SID-DEL-USUARIO> en tiempo de inicio de sesión.',
    relatedInvestigationCode: '11.03',
  },
  {
    id: 'test-11-03',
    questionNumber: 3,
    category: 'CONTROLSETS_Y_SERVICIOS',
    question: 'En la clave de un servicio en HKLM\\SYSTEM\\CurrentControlSet\\Services, ¿qué significa un valor Start = 4?',
    options: [
      { id: 'a', text: 'Inicio Automático con retraso.' },
      { id: 'b', text: 'Inicio por demanda (Manual).' },
      { id: 'c', text: 'Servicio o controlador Deshabilitado (Disabled).' },
      { id: 'd', text: 'Inicio inmediato en la fase de Boot del kernel.' },
    ],
    correctOptionId: 'c',
    technicalExplanation: 'La convención de Start es: 0=Boot, 1=System, 2=Automatic, 3=Manual, 4=Disabled.',
    relatedInvestigationCode: '11.15',
  },
  {
    id: 'test-11-04',
    questionNumber: 4,
    category: 'CLI_Y_AUTOMATIZACION',
    question: '¿Qué ocurre al ejecutar "reg delete HKLM\\Software\\Prueba /f" si NO se especifica el parámetro /v?',
    options: [
      { id: 'a', text: 'Muestra un mensaje de error y no hace nada.' },
      { id: 'b', text: 'Borra la subclave completa "Prueba" con todos los valores y subclaves subordinadas que contenga.' },
      { id: 'c', text: 'Borra únicamente el valor por defecto de la clave.' },
      { id: 'd', text: 'Mueve la clave a la papelera de reciclaje del sistema.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Sin /v, reg delete asume como objetivo la subclave entera y la purga recursiva e irreversiblemente.',
    relatedInvestigationCode: '11.28',
  },
  {
    id: 'test-11-05',
    questionNumber: 5,
    category: 'PERSISTENCIA_Y_POLICIES',
    question: '¿Qué sintaxis se utiliza dentro de un archivo .reg para eliminar una clave completa al importarlo?',
    options: [
      { id: 'a', text: 'DELETE [HKEY_CURRENT_USER\\MiClave]' },
      { id: 'b', text: '[-HKEY_CURRENT_USER\\MiClave]' },
      { id: 'c', text: '[HKEY_CURRENT_USER\\MiClave] "Eliminar"=dword:00000001' },
      { id: 'd', text: 'DROP KEY HKEY_CURRENT_USER\\MiClave' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Colocar un guion inmediatamente después del corchete de apertura ([-HKEY...]) le indica al importador de registro que debe eliminar la clave.',
    relatedInvestigationCode: '11.25',
  },
];
