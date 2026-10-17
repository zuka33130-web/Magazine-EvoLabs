// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 05: PROCESOS QUE NO VES // QUÉ HACE WINDOWS CUANDO CERRAS TODO

export type RiskLevelSector05 = 'MONITOR_ONLY' | 'CONFIG_MODIFY_RISK' | 'PROCESS_TERMINATION_RISK';

export interface Sector05Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  tabOrMetric: string;
  riskLevel: RiskLevelSector05;
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

export interface Sector05MiniCase {
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

export interface Sector05TestQuestion {
  id: string;
  questionNumber: number;
  category: 'PROCESOS_SISTEMA' | 'RELACION_PADRE_HIJO' | 'SEGUIMIENTO_BACKGROUND' | 'DIAGNÓSTICO';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_05_INVESTIGATIONS: Sector05Investigation[] = [
  {
    id: 'inv-05-01',
    code: '05.01',
    title: 'Background processes',
    subtitle: 'Qué significa realmente un proceso en segundo plano y por qué no tener ventana no implica invalidez',
    tabOrMetric: 'Pestaña Procesos -> Sección Procesos en segundo plano',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Cerraste Word, Chrome y Spotify. El escritorio está limpio. Sin embargo, Task Manager muestra 70 o más "Procesos en segundo plano". ¿Por qué ejecutan si no abriste nada?',
      mythVsTruth: {
        mentira: 'Un programa sin ventana visible es un residuo colgado o un virus que está consumiendo recursos sin razón.',
        verdad: 'Los procesos en segundo plano (Background Processes) realizan tareas continuas de soporte, escucha de eventos, sincronización y monitoreo necesarias para las apps y el SO.',
        comprobalo: 'Abrí Task Manager -> Pestaña Procesos -> Desplazate hacia abajo pasando "Aplicaciones" hasta "Procesos en segundo plano".',
      },
    },
    entende: {
      queEs: 'Un proceso que ejecuta código en la memoria RAM asignada por el kernel sin requerir un marco de ventana (GUI) interactivo ni presencia en la barra de tareas.',
      paraQueSirve: 'Mantiene agentes de actualización, servicios de notificación, monitoreo de periféricos, índices de búsqueda y listeners de red.',
      quePasaSiFalta: 'Si terminas a la fuerza un proceso helper de background, la app asociada perderá funciones como sincronización, atajos de teclado o alertas.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Where-Object { $_.MainWindowTitle -eq "" } | Select-Object -First 10 Id, ProcessName, CPU, WorkingSet64',
      cmdCommand: 'tasklist /fi "STATUS eq RUNNING"',
      guiPath: 'Administrador de tareas -> Procesos -> Procesos en segundo plano',
      whatToLookFor: 'Observá que la columna "Título de ventana" está vacía en estos procesos pero siguen registrando uso de CPU o RAM.',
    },
    alertaEVO: {
      falsePositiveWarning: 'No asumas que un ejecutable es malicioso por el simple hecho de carecer de ventana e interfaz gráfica.',
      reversibilityRule: 'Si no sabés qué app madre lanzó el proceso en segundo plano, investigá su ruta antes de finalizar el árbol.',
    },
    evidenceBadge: {
      code: 'EVD-05-01',
      label: 'EXECUTION_CONTEXT_NO_WINDOW',
      defaultProvenance: 'BACKGROUND_LISTENER',
    },
  },
  {
    id: 'inv-05-02',
    code: '05.02',
    title: 'System',
    subtitle: 'El proceso especial PID 4 y la representación del Kernel, hilos de sistema e I/O de controladores',
    tabOrMetric: 'PID 4 / Proceso "System"',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'En la pestaña Detalles ves un proceso llamado "System" con PID 4 consumiendo memoria y ciclos de CPU. No podés ver su ruta ni finalizarlo. ¿Qué es exactamente?',
      mythVsTruth: {
        mentira: 'System es una aplicación normal alojada en el disco como System.exe dentro de C:\\Windows.',
        verdad: 'System (PID 4) es un contenedor del kernel que aloja hilos del modo kernel (Kernel-Mode Threads), controladores de dispositivos (Drivers) y operaciones de I/O de bajo nivel.',
        comprobalo: 'Abrí Task Manager -> Detalles -> Ordená por PID. Verás que PID 4 se llama System y pertenece al usuario SYSTEM.',
      },
    },
    entende: {
      queEs: 'La entidad lógica en modo kernel que representa el núcleo del sistema operativo ejecutando hilos de controladores de hardware y subsistemas del kernel.',
      paraQueSirve: 'Gestiona la entrada/salida de archivos, transferencia de datos entre RAM y disco, red física y gestión de llamadas al kernel.',
      quePasaSiFalta: 'Es imposible de finalizar. Si el kernel de Windows colapsa dentro de System, se produce una pantalla azul (BSOD).',
    },
    interactua: {
      powershellCommand: 'Get-Process -Id 4 | Select-Object Id, ProcessName, CPU, Handles, WorkingSet64',
      guiPath: 'Administrador de tareas -> Detalles -> PID 4 (System)',
      whatToLookFor: 'Si el proceso System consume CPU anormal (ej. 30%), la causa casi siempre es un DRIVER defectuoso o conflicto de hardware, no el proceso en sí.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Alto consumo de CPU en System no significa virus en System.exe; significa que un controlador de hardware está generando interrupciones masivas.',
      reversibilityRule: 'Jamás intentes forzar la detención de hilos del kernel; la única solución a un System desbocado es diagnosticar el driver causante.',
    },
    evidenceBadge: {
      code: 'EVD-05-02',
      label: 'KERNEL_MODE_CONTAINER_PID4',
      defaultProvenance: 'SYSTEM_KERNEL',
    },
  },
  {
    id: 'inv-05-03',
    code: '05.03',
    title: 'Registry',
    subtitle: 'La entidad especial en Task Manager que representa las colmenas del registro mapeadas en memoria',
    tabOrMetric: 'Proceso "Registry"',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En Windows 10/11 aparece un proceso llamado "Registry" en Task Manager. No es regedit.exe. ¿Por qué el Registro de Windows aparece como un proceso individual?',
      mythVsTruth: {
        mentira: 'El proceso Registry es el editor del registro (regedit.exe) o un troyano modificando claves en segundo plano.',
        verdad: 'Es una arquitectura introducida para gestionar las colmenas de registro (Hives) en memoria en un espacio de dirección de proceso dedicado para reducir latencia e I/O de disco.',
        comprobalo: 'Abrí Task Manager -> Detalles -> Busca "Registry". Verás que utiliza entre 10 MB y 100 MB de RAM paged pool.',
      },
    },
    entende: {
      queEs: 'Un proceso contenedor interno de kernel que administra el almacenamiento en caché de la base de datos de configuración de Windows (Registry Hives).',
      paraQueSirve: 'Acelera las lecturas y escrituras del registro para miles de procesos simultáneos, evitando accesos directos lentos a los archivos Hive en disco.',
      quePasaSiFalta: 'No se puede finalizar. Si falla, el sistema operativo perdería acceso a la configuración del estado de hardware y software.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "Registry" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, WorkingSet64',
      guiPath: 'Administrador de tareas -> Detalles -> Registry',
      whatToLookFor: 'Observá que la memoria asignada a Registry crece proporcionalmente a las aplicaciones abiertas y configuraciones cargadas.',
    },
    alertaEVO: {
      falsePositiveWarning: 'No confundas el proceso de sistema "Registry" con la ejecución manual de `regedit.exe`.',
      reversibilityRule: 'El proceso Registry es administrado automáticamente por el gestor de memoria de Windows (Memory Manager).',
    },
    evidenceBadge: {
      code: 'EVD-05-03',
      label: 'IN_MEMORY_HIVE_MANAGER',
      defaultProvenance: 'KERNEL_REGISTRY',
    },
  },
  {
    id: 'inv-05-04',
    code: '05.04',
    title: 'svchost.exe',
    subtitle: 'El contenedor universal de servicios y por qué ver 15 a 30 instancias simultáneas es completamente normal',
    tabOrMetric: 'Host de servicios (svchost.exe)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Al abrir Detalles ves decenas de ejecutables llamados `svchost.exe`. ¿Por qué Windows no usa un solo ejecutable y por qué hay tantos corriendo al mismo tiempo?',
      mythVsTruth: {
        mentira: 'Ver más de 5 procesos svchost.exe significa que la máquina está infectada por troyanos duplicados.',
        verdad: 'svchost.exe es un proceso "Host" genérico que carga librerías DLL de servicios. Windows crea múltiples grupos de svchost para aislar fallos y privilegios.',
        comprobalo: 'Ejecutá `tasklist /svc /fi "IMAGENAME eq svchost.exe"` en CMD para ver exactamente qué servicio aloja cada PID de svchost.',
      },
    },
    entende: {
      queEs: 'Service Host: El binario ejecutable estándar (ubicado en C:\\Windows\\System32) diseñado para ejecutar código de servicios empaquetados como archivos `.dll`.',
      paraQueSirve: 'Permite compartir código, agrupar servicios por perfil de seguridad (LocalSystem, LocalService, NetworkService) y evitar que la caída de un servicio colapse a los demás.',
      quePasaSiFalta: 'Si finalizas un svchost.exe crítico, se detendrán servicios esenciales como Audio, Red, Plug and Play o Windows Update.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Service | Where-Object ProcessId -ne 0 | Select-Object Name, DisplayName, ProcessId | Sort-Object ProcessId',
      cmdCommand: 'tasklist /svc /fi "IMAGENAME eq svchost.exe"',
      guiPath: 'Administrador de tareas -> Procesos -> Expandí cualquier "Host de servicios: [Nombre del servicio]"',
      whatToLookFor: 'Al desplegar la flecha al lado de Host de Servicios en la pestaña Procesos, verás los nombres de los servicios reales alojados adentro.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Múltiples svchost es el comportamiento diseñado de Windows. Un svchost sospechoso es aquel cuya RUTA no sea C:\\Windows\\System32.',
      reversibilityRule: 'Regla de Oro: Si ves svchost en Temp, AppData o fuera de System32, ese en particular es malicioso.',
    },
    evidenceBadge: {
      code: 'EVD-05-04',
      label: 'SERVICE_HOST_CONTAINER',
      defaultProvenance: 'SYSTEM32_SVCHOST',
    },
  },
  {
    id: 'inv-05-05',
    code: '05.05',
    title: 'dwm.exe',
    subtitle: 'Desktop Window Manager y la composición gráfica acelerada por hardware del escritorio',
    tabOrMetric: 'Administrador de ventanas del escritorio (dwm.exe)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Ves que dwm.exe consume memoria VRAM y algo de GPU incluso cuando no hay juegos abiertos. ¿Qué función cumple en el renderizado de Windows?',
      mythVsTruth: {
        mentira: 'dwm.exe es un adorno visual prescindible que ralentiza la PC y debe deshabilitarse para ganar FPS.',
        verdad: 'Desktop Window Manager es el motor de composición gráfica obligatorio desde Windows 8/10. Dibuja cada ventana en un búfer antes de enviarlo a la pantalla usando la GPU.',
        comprobalo: 'Abrí Task Manager -> Rendimiento -> GPU -> Observá el consumo de "Composición" o "Engine 3D/Video" generado por dwm.exe.',
      },
    },
    entende: {
      queEs: 'El compositor gráfico del sistema que renderiza efectos de transparencia, animaciones, miniaturas de la barra de tareas, escalado DPI y ventanas fluidas.',
      paraQueSirve: 'Aprovecha la aceleración por hardware de la tarjeta gráfica para librar a la CPU de dibujar la interfaz de usuario.',
      quePasaSiFalta: 'No se puede desactivar en Windows 10/11. Si falla, la pantalla parpadeará y se reiniciará automáticamente la sesión gráfica.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "dwm" | Select-Object Id, ProcessName, WorkingSet64, CPU',
      guiPath: 'Administrador de tareas -> Procesos -> Administrador de ventanas del escritorio',
      whatToLookFor: 'Verificá que el archivo ejecutable sea `C:\\Windows\\System32\\dwm.exe` firmado por Microsoft.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un elevado consumo de RAM en dwm.exe suele deberse a un driver de GPU desactualizado o fuga de memoria de una aplicación externa con superposición (overlay).',
      reversibilityRule: 'Jamás intentes reemplazar dwm.exe por ejecutables modificados; destruirá el subsistema gráfico.',
    },
    evidenceBadge: {
      code: 'EVD-05-05',
      label: 'GPU_COMPOSITOR_GRAPHICS',
      defaultProvenance: 'SYSTEM32_DWM',
    },
  },
  {
    id: 'inv-05-06',
    code: '05.06',
    title: 'csrss.exe',
    subtitle: 'Client/Server Runtime Subsystem y el rol esencial en la gestión de hilos, consolas y apagado',
    tabOrMetric: 'Proceso csrss.exe',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Ves `csrss.exe` en la lista de procesos. Intenta finalizarlo y Windows te mostrará un aviso de advertencia crítico de color rojo. ¿Por qué es intocable?',
      mythVsTruth: {
        mentira: 'csrss.exe es un virus antiguo que se quedó en Windows desde la época de Windows 95.',
        verdad: 'Client/Server Runtime Subsystem es un subsistema crítico en modo usuario indispensable para la creación de hilos, ventanas de consola Win32 y el proceso de apagado.',
        comprobalo: 'Abrí Task Manager -> Detalles -> Buscá csrss.exe. Verás que corre en la Sesión 0 y Sesión 1 bajo la cuenta SYSTEM.',
      },
    },
    entende: {
      queEs: 'El proceso del subsistema Win32 responsable de las funciones de consola de comandos, creación/destrucción de hilos y control de apagado del sistema.',
      paraQueSirve: 'Mantiene las operaciones básicas de la API Win32 que permiten que los programas interactúen con el kernel.',
      quePasaSiFalta: 'Finalizar csrss.exe provoca la caída INMEDIATA del sistema con una Pantalla Azul (BSOD) CRITICAL_PROCESS_DIED.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "csrss" | Select-Object Id, ProcessName, SessionId, Path',
      guiPath: 'Administrador de tareas -> Detalles -> csrss.exe',
      whatToLookFor: 'Confirmá que exista una instancia de csrss.exe por cada sesión activa de Windows.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Existirán habitualmente dos instancias de csrss.exe (una para Sesión 0 y otra para la sesión de usuario actual). Es totalmente normal.',
      reversibilityRule: 'Regla Inviolable: NUNCA intentes matar csrss.exe en un sistema en producción.',
    },
    evidenceBadge: {
      code: 'EVD-05-06',
      label: 'WIN32_CRITICAL_SUBSYSTEM',
      defaultProvenance: 'SYSTEM32_CSRSS',
    },
  },
  {
    id: 'inv-05-07',
    code: '05.07',
    title: 'lsass.exe',
    subtitle: 'Local Security Authority Subsystem Service y la custodia de la autenticación de usuarios',
    tabOrMetric: 'Proceso lsass.exe',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'En el administrador de tareas aparece `lsass.exe`. Es el proceso encargado de validar cuándo pones tu contraseña o PIN en Windows.',
      mythVsTruth: {
        mentira: 'lsass.exe es un programa espía que registra las teclas introducidas por el usuario.',
        verdad: 'Local Security Authority Subsystem Service es el corazón de la seguridad de Windows: verifica inicios de sesión, genera tokens de acceso de seguridad y gestiona la directiva de contraseñas.',
        comprobalo: 'Abrí Task Manager -> Detalles -> lsass.exe. Su usuario es SYSTEM y su ruta es C:\\Windows\\System32\\lsass.exe.',
      },
    },
    entende: {
      queEs: 'El proceso de seguridad que autentica a los usuarios en el sistema local o en un dominio Active Directory y mantiene la base de datos de seguridad local (SAM).',
      paraQueSirve: 'Garantiza que ningún programa ejecute acciones en tu nombre sin un Token de Seguridad válido asignado durante el inicio de sesión.',
      quePasaSiFalta: 'Si lsass.exe se detiene o colapsa, Windows muestra un mensaje de reinicio forzado en 60 segundos por razones de seguridad.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "lsass" | Select-Object Id, ProcessName, Path, Handles',
      guiPath: 'Administrador de tareas -> Detalles -> lsass.exe',
      whatToLookFor: 'Verificá la firma digital de Microsoft en la propiedad del archivo executable.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Debido a su rol crítico en autenticación, los troyanos intentan imitar su nombre usando tipografías engañosas como `Isass.exe` (con I mayúscula) o `lsasss.exe`. Verificá siempre la ruta exacta.',
      reversibilityRule: 'Cualquier intento de modificar la memoria de lsass.exe activará las defensas de Credential Guard y Defender.',
    },
    evidenceBadge: {
      code: 'EVD-05-07',
      label: 'SECURITY_AUTH_SUBSYSTEM',
      defaultProvenance: 'SYSTEM32_LSASS',
    },
  },
  {
    id: 'inv-05-08',
    code: '05.08',
    title: 'wininit.exe',
    subtitle: 'Windows Initialization Process y la puesta en marcha de los servicios esenciales de arranque',
    tabOrMetric: 'Proceso wininit.exe',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Durante el arranque de Windows, antes de que veas la pantalla de inicio de sesión, ejecuta `wininit.exe`. ¿Qué infraestructura inicializa?',
      mythVsTruth: {
        mentira: 'wininit.exe es un script de inicio que cargó algún programa instalado por el usuario.',
        verdad: 'Windows Initialization Process es el ejecutable que inicia el Service Control Manager (services.exe), Local Security Authority (lsass.exe) y el administrador de sesiones de red (lsass/lsadump).',
        comprobalo: 'En Task Manager -> Detalles, observá que wininit.exe corre en la Sesión 0 con PID bajo.',
      },
    },
    entende: {
      queEs: 'El iniciador en modo usuario para la Sesión 0 que prepara los cimientos de los servicios del sistema antes de permitir la entrada interactiva de usuarios.',
      paraQueSirve: 'Lanza los demonios principales del sistema operativo y crea el directorio `%TEMP%` del sistema.',
      quePasaSiFalta: 'Su terminación provoca la caída inmediata de la máquina (Pantalla Azul BSOD).',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "wininit" | Select-Object Id, ProcessName, SessionId, Path',
      guiPath: 'Administrador de tareas -> Detalles -> wininit.exe',
      whatToLookFor: 'Confirma que sólo exista UNA instancia de wininit.exe corriendo en la Sesión 0.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si ves más de un proceso wininit.exe o si ejecuta fuera de Sesión 0, estás ante una anomalía grave o suplantación.',
      reversibilityRule: 'Proceso vital del sistema: protegido por la arquitectura de procesos críticos de Windows.',
    },
    evidenceBadge: {
      code: 'EVD-05-08',
      label: 'SESSION_0_INIT_BOOT',
      defaultProvenance: 'SYSTEM32_WININIT',
    },
  },
  {
    id: 'inv-05-09',
    code: '05.09',
    title: 'winlogon.exe',
    subtitle: 'Windows Logon Application, la secuencia Secure Attention (Ctrl+Alt+Del) y la sesión interactiva',
    tabOrMetric: 'Proceso winlogon.exe',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Cuando presionas Ctrl+Alt+Del o bloqueas tu PC con Win+L, el proceso encargado de gestionar esa pantalla de bloqueo segura es `winlogon.exe`.',
      mythVsTruth: {
        mentira: 'winlogon.exe es una pantalla decorativa que se puede cerrar de la lista de tareas.',
        verdad: 'Es el gestor de inicio y cierre de sesión interactivo que maneja la secuencia de atención segura (SAS) para evitar que programas maliciosos simulen la pantalla de clave.',
        comprobalo: 'Bloqueá la PC (Win + L) y desbloqueala. En Task Manager verás winlogon.exe activo en tu sesión interactiva.',
      },
    },
    entende: {
      queEs: 'La aplicación responsable de gestionar el estado del perfil de usuario (Carga de NTUSER.DAT), bloqueo de pantalla y captura de atajos de atención segura.',
      paraQueSirve: 'Garantiza que la pantalla de ingreso de contraseñas sea genuina y no una trampa gráfica (phishing local).',
      quePasaSiFalta: 'Si se finaliza winlogon.exe, la sesión de usuario se cierra instantáneamente o el sistema muestra un BSOD.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "winlogon" | Select-Object Id, ProcessName, SessionId, Path',
      guiPath: 'Administrador de tareas -> Detalles -> winlogon.exe',
      whatToLookFor: 'Habrá una instancia de winlogon.exe por cada sesión de usuario activa o remota (RDP).',
    },
    alertaEVO: {
      falsePositiveWarning: 'No confundas la interfaz de usuario de inicio de sesión con programas de terceros. winlogon.exe debe ser un binario firmado en System32.',
      reversibilityRule: 'Cerrar winlogon destruye todos los datos no guardados de la sesión de usuario actual.',
    },
    evidenceBadge: {
      code: 'EVD-05-09',
      label: 'INTERACTIVE_LOGON_MANAGER',
      defaultProvenance: 'SYSTEM32_WINLOGON',
    },
  },
  {
    id: 'inv-05-10',
    code: '05.10',
    title: 'smss.exe',
    subtitle: 'Session Manager Subsystem y el primer proceso en modo usuario creado por el Kernel durante el arranque',
    tabOrMetric: 'Proceso smss.exe',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: '`smss.exe` es el abuelo de todos los procesos de usuario en Windows. Fue creado directamente por el Kernel (`ntoskrnl.exe`) en la fase más temprana del boot.',
      mythVsTruth: {
        mentira: 'smss.exe es un proceso innecesario de mensajes SMS o mensajería de texto antigua.',
        verdad: 'Session Manager Subsystem (smss.exe) es el primer proceso en modo usuario que arranca en Windows para crear las sesiones (Sesión 0, Sesión 1) e invocar a winlogon y csrss.',
        comprobalo: 'En Task Manager -> Detalles -> smss.exe. Verás un uso de memoria diminuto (menor a 2 MB) y un PID muy bajo.',
      },
    },
    entende: {
      queEs: 'El gestor de sesiones maestro que establece las variables de entorno del sistema, inicia los archivos de paginación (pagefile.sys) y crea las sesiones aisladas.',
      paraQueSirve: 'Prepara el aislamiento de memoria para que las aplicaciones de usuario no puedan invadir los servicios del sistema.',
      quePasaSiFalta: 'Finalizar smss.exe apaga o cuelga el sistema operativo de inmediato.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "smss" | Select-Object Id, ProcessName, SessionId, Path',
      guiPath: 'Administrador de tareas -> Detalles -> smss.exe',
      whatToLookFor: 'Verificá que se ejecute desde `C:\\Windows\\System32\\smss.exe`.',
    },
    alertaEVO: {
      falsePositiveWarning: 'smss.exe utiliza recursos insignificantes. Si ves un smss.exe consumiendo CPU constante, investiga si es un ejecutable troyanizado fuera de System32.',
      reversibilityRule: 'Componente estructural inviolable del kernel de Windows.',
    },
    evidenceBadge: {
      code: 'EVD-05-10',
      label: 'FIRST_USERMODE_BOOT_PROCESS',
      defaultProvenance: 'SYSTEM32_SMSS',
    },
  },
  {
    id: 'inv-05-11',
    code: '05.11',
    title: 'Parent/Child processes',
    subtitle: 'La jerarquía de herencia entre procesos padre e hijo y cómo se propagan permisos y contexto',
    tabOrMetric: 'Jerarquía PID vs PPID (Parent Process ID)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Cuando haces doble clic en un acceso directo en tu escritorio, `explorer.exe` (Padre) crea una nueva instancia ejecutable de la app (Hijo). ¿Cómo se rastrea esta relación de linaje?',
      mythVsTruth: {
        mentira: 'Todos los procesos nacen de forma independiente sin conexión entre sí.',
        verdad: 'Cada proceso en Windows (excepto el inicial) es creado por un proceso Padre (Parent Process ID / PPID) del cual puede heredar tokens, variables de entorno y descriptores.',
        comprobalo: 'Ejecutá `wmic process get Name,ProcessId,ParentProcessId` o usá PowerShell para ver la columna PPID de cada proceso.',
      },
    },
    entende: {
      queEs: 'El mecanismo fundamental de la API Win32 (`CreateProcess`) donde un ejecutable invoca el inicio de otro ejecutable derivado.',
      paraQueSirve: 'Permite que aplicaciones complejas dividan tareas en subprocesos independientes (ej. Chrome iniciando workers para cada pestaña).',
      quePasaSiFalta: 'Si se finaliza el proceso padre de forma no controlada, sus procesos hijos pueden quedar "huérfanos" o cerrar automáticamente.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name | Select-Object -First 15',
      cmdCommand: 'wmic process get Name,ProcessId,ParentProcessId',
      guiPath: 'Administrador de tareas -> Vista de árbol de procesos (agrupados por aplicación)',
      whatToLookFor: 'MIRA qué proceso lanzó a qué proceso. Por ejemplo: `cmd.exe` -> `powershell.exe`.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Que un proceso no habitual tenga a `explorer.exe` como padre no lo vuelve malo; significa simplemente que el usuario lo abrió haciendo doble clic.',
      reversibilityRule: 'Un padre inusual (ej. `Microsoft.Exchange` lanzando `cmd.exe`) es un indicador de compromiso (IoC) clásico.',
    },
    evidenceBadge: {
      code: 'EVD-05-11',
      label: 'PARENT_CHILD_SPAWN_TREE',
      defaultProvenance: 'WIN32_PROCESS_SPAWN',
    },
  },
  {
    id: 'inv-05-12',
    code: '05.12',
    title: 'Sessions',
    subtitle: 'El aislamiento estricto de seguridad entre la Sesión 0 (Servicios) y las Sesiones Interactivas de Usuario',
    tabOrMetric: 'Identificador de Sesión (Session ID)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Windows separa de forma tajante los servicios del sistema de las aplicaciones del usuario usando "Sesiones". La Sesión 0 está aislada sin interfaz gráfica.',
      mythVsTruth: {
        mentira: 'Los servicios de Windows y las aplicaciones del usuario comparten la misma pantalla gráfica y espacio de escritorio.',
        verdad: 'Desde Windows Vista, por seguridad (Session 0 Isolation), los servicios ejecutan exclusivamente en la Sesión 0 protegida para evitar ataques de inyección de interfaz (Shatter Attacks).',
        comprobalo: 'En Task Manager -> Detalles -> Agregá la columna "Id. de sesión". Verás valores `0` para servicios y `1` o superior para tu usuario.',
      },
    },
    entende: {
      queEs: 'El límite de seguridad del subsistema de Windows que asigna escritorios, ventanas y objetos de kernel independientes a cada entorno de ejecución.',
      paraQueSirve: 'Impide que un programa malicioso que corre en la sesión del usuario interactúe directamente con las ventanas de un servicio con privilegios SYSTEM.',
      quePasaSiFalta: 'Sin aislamiento de sesión, cualquier malware estándar podría secuestrar hilos de servicios de seguridad en segundo plano.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Select-Object Id, ProcessName, SessionId | Group-Object SessionId',
      guiPath: 'Administrador de tareas -> Detalles -> Columna "Id. de sesión"',
      whatToLookFor: 'Comprobá que todos los `svchost.exe` de sistema estén asignados a la Sesión 0.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Múltiples sesiones de usuario (1, 2, 3...) ocurren cuando varios usuarios inician sesión simultáneamente o por Escritorio Remoto (RDP).',
      reversibilityRule: 'Cualquier aplicación de usuario que intente colarse en la Sesión 0 será bloqueada por la directiva de aislamiento.',
    },
    evidenceBadge: {
      code: 'EVD-05-12',
      label: 'SESSION_0_ISOLATION_BOUNDARY',
      defaultProvenance: 'WIN32_SESSION_ISOLATION',
    },
  },
  {
    id: 'inv-05-13',
    code: '05.13',
    title: 'Protected processes',
    subtitle: 'Protected Process Light (PPL) y el blindaje criptográfico para evitar que procesos maliciosos lean la RAM de Defender o LSASS',
    tabOrMetric: 'Atributo PPL / Protected Process',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Incluso con permisos de Administrador, si intentas inspeccionar la memoria de `MsMpEng.exe` (Defender) o `lsass.exe`, Windows te denegará el acceso. ¿Por qué?',
      mythVsTruth: {
        mentira: 'Un usuario Administrador puede leer o modificar el código de cualquier proceso en memoria sin restricciones.',
        verdad: 'Windows implementa Protected Process Light (PPL). Solo binarios firmados criptográficamente por Microsoft con certificados especiales pueden interactuar con procesos protegidos.',
        comprobalo: 'Intentá abrir la memoria de lsass.exe con un visor de procesos sin el driver adecuado: recibirás un error de `ACCESS_DENIED`.',
      },
    },
    entende: {
      queEs: 'Una característica de seguridad del kernel que marca ejecutables críticos con un nivel de protección firmado digitalmente.',
      paraQueSirve: 'Protege a los motores antivirus, agentes de DRM y al subsistema de claves (LSASS) contra la inyección de DLLs y volcados de memoria (dumping).',
      quePasaSiFalta: 'Sin PPL, cualquier malware que obtuviera permisos de Administrador podría desactivar el antivirus o extraer contraseñas de la RAM al instante.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "MsMpEng" | Select-Object Id, ProcessName, Handles',
      guiPath: 'Administrador de tareas -> Detalles -> "MsMpEng.exe" (Propiedades de protección)',
      whatToLookFor: 'Observá que el acceso a la información de depuración de este proceso está restringido incluso para la cuenta Administrador.',
    },
    alertaEVO: {
      falsePositiveWarning: 'El mensaje "Acceso denegado" al intentar finalizar MsMpEng.exe es prueba de que la protección PPL está funcionando correctamente, no un fallo.',
      reversibilityRule: 'PPL es una defensa activa administrada a nivel de firma de kernel.',
    },
    evidenceBadge: {
      code: 'EVD-05-13',
      label: 'PPL_DIGITAL_SIGNATURE_SHIELD',
      defaultProvenance: 'KERNEL_PPL_SHIELD',
    },
  },
  {
    id: 'inv-05-14',
    code: '05.14',
    title: 'Process Tree',
    subtitle: 'Navegación visual del árbol completo de procesos de Windows desde System hasta la aplicación final',
    tabOrMetric: 'Árbol de Procesos (Process Tree)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'En un sistema real, los procesos forman una estructura arbórea conectada desde el arranque hasta cada programa. ¿Cómo recorrer este árbol para auditar qué app lanzó un subproceso?',
      mythVsTruth: {
        mentira: 'Visualizar los procesos como una lista alfabética plana es suficiente para detectar comportamientos sospechosos.',
        verdad: 'La lista plana oculta quién originó cada proceso. La vista en ÁRBOL DE PROCESOS (Process Tree) revela la cadena exacta de ejecución (Abuelo -> Padre -> Hijo -> Nieto).',
        comprobalo: 'Usá la agrupación por aplicaciones en Task Manager o herramientas como Process Explorer para ver el árbol expandido.',
      },
    },
    entende: {
      queEs: 'La representación jerárquica de todos los ejecutable activos organizados por su relación de linaje de ejecución (Parent-Child).',
      paraQueSirve: 'Permite identificar anomalías como un lector de PDF (`AcroRd32.exe`) ejecutando la consola de comandos (`cmd.exe`).',
      quePasaSiFalta: 'Sin análisis de árbol de procesos, es casi imposible rastrear ataques sin archivos (Fileless Malware) o scripts maliciosos.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name, CommandLine | Format-Table -AutoSize',
      guiPath: 'Administrador de tareas -> Vista de Procesos agrupados por árbol de aplicación',
      whatToLookFor: 'Rastreá desde `explorer.exe` hacia abajo para ubicar todas las aplicaciones que abriste manualmente.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Es normal que navegadores como Chrome o Edge tengan decenas de procesos hijos bajo el proceso padre principal.',
      reversibilityRule: 'Al finalizar un nodo padre en el árbol de procesos, Windows cerrará por defecto a todos sus procesos descendientes.',
    },
    evidenceBadge: {
      code: 'EVD-05-14',
      label: 'FULL_PROCESS_TREE_DIAGNOSTIC',
      defaultProvenance: 'PROCESS_TREE_FORENSICS',
    },
  },
  {
    id: 'inv-05-15',
    code: '05.15',
    title: 'Servicios sin ventana',
    subtitle: 'La naturaleza transparente de los servicios y la preparación para la auditoría de services.msc',
    tabOrMetric: 'Servicios invisibles sin interfaz gráfica',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Un servicio puede estar procesando gigabytes de datos o enviando telemetría sin mostrar una sola ventana, icono en el tray o notificación en pantalla.',
      mythVsTruth: {
        mentira: 'Si un programa está activo trabajando en el sistema, necesariamente debe mostrar un icono al lado del reloj o en la barra de tareas.',
        verdad: 'Los servicios de Windows están diseñados por especificación para no tener interfaz de usuario (Headless / Windowless Services).',
        comprobalo: 'Abrí `services.msc` y observá la columna "Estado". Hay decenas de servicios "En ejecución" que no tienen representación gráfica alguna.',
      },
    },
    entende: {
      queEs: 'Componentes de software administrados por el Service Control Manager que ejecutan tareas continuas en segundo plano en la Sesión 0.',
      paraQueSirve: 'Atienden peticiones de red, gestión de archivos de registro, criptografía, spooler de impresión y políticas de seguridad sin molestar al usuario.',
      quePasaSiFalta: 'Si un servicio no tuviera esta arquitectura sin ventana, el usuario vería decenas de ventanas negras de consola parpadeando constantemente.',
    },
    interactua: {
      powershellCommand: 'Get-Service | Where-Object Status -eq "Running" | Select-Object -First 10 Name, DisplayName, StartType',
      cmdCommand: 'net start',
      guiPath: 'Ejecutar `services.msc` -> Filtro por Estado: En ejecución',
      whatToLookFor: 'Notá cómo la lista de `services.msc` muestra servicios activos cuya existencia jamás habías notado en el escritorio.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un servicio sin ventana no es sospechoso; es la forma estándar en que Windows opera.',
      reversibilityRule: 'En el Sector 06 profundizaremos en la gestión completa de `services.msc`.',
    },
    evidenceBadge: {
      code: 'EVD-05-15',
      label: 'WINDOWLESS_HEADLESS_SERVICE',
      defaultProvenance: 'SERVICES_MSC_HEADLESS',
    },
  },
  {
    id: 'inv-05-16',
    code: '05.16',
    title: 'Scheduled Tasks',
    subtitle: 'El Programador de Tareas (taskschd.msc) y la activación de procesos por eventos, tiempo o inicio de sesión',
    tabOrMetric: 'Tareas programadas (taskschd.msc)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Encendés la PC, no abrís nada y a los 5 minutos ves un proceso ejecutando. Nadie hizo clic. ¿Quién o qué lo activó?',
      mythVsTruth: {
        mentira: 'Los programas solo pueden arrancar si están en la carpeta "Inicio" (Startup) del Administrador de Tareas.',
        verdad: 'El Programador de Tareas de Windows (`taskschd.msc`) puede lanzar ejecutables en segundo plano basándose en temporizadores, horas específicas, eventos del registro de eventos o inactividad.',
        comprobalo: 'Abrí `taskschd.msc` -> Biblioteca del Programador de tareas -> Microsoft -> Windows. Verás cientos de tareas automatizadas.',
      },
    },
    entende: {
      queEs: 'El subsistema de automatización de Windows que ejecuta tareas, scripts y programas en momentos prefijados o al cumplirse condiciones desencadenantes (Triggers).',
      paraQueSirve: 'Ejecuta limpieza automática de archivos temporales, desfragmentación/TRIM de discos, análisis de Defender y actualizaciones periódicas.',
      quePasaSiFalta: 'Si se deshabilita el servicio de Tareas Programadas, el sistema dejará de realizar mantenimiento preventivo y parches automáticos.',
    },
    interactua: {
      powershellCommand: 'Get-ScheduledTask | Where-Object State -eq "Ready" | Select-Object -First 10 TaskName, TaskPath, State',
      cmdCommand: 'schtasks /query /fo TABLE',
      guiPath: 'Ejecutar `taskschd.msc` -> Biblioteca del Programador de tareas',
      whatToLookFor: 'Explorá las tareas de Microsoft en WindowsUpdate, Maintenance y DiskCleanup.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Muchas aplicaciones legítimas (Nvidia, Google Update, Adobe) crean tareas programadas para actualizarse de noche sin molestar.',
      reversibilityRule: 'Las tareas programadas pueden deshabilitarse de forma individual sin alterar el binario subyacente.',
    },
    evidenceBadge: {
      code: 'EVD-05-16',
      label: 'SCHEDULED_TRIGGER_AUTOMATION',
      defaultProvenance: 'TASKSCHD_TRIGGER',
    },
  },
  {
    id: 'inv-05-17',
    code: '05.17',
    title: 'Updaters',
    subtitle: 'Agentes de actualización automática en segundo plano de navegadores, suites creativas y utilidades',
    tabOrMetric: 'Procesos Updater (GoogleUpdate, AdobeUpdate, etc.)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Ves en la lista de procesos ejecutables como `GoogleUpdate.exe` o `adobe_updater.exe`. Consumen unos pocos MB de RAM de forma permanente.',
      mythVsTruth: {
        mentira: 'Todos los updaters en segundo plano son malware de publicidad (adware) que deben eliminarse obligatoriamente.',
        verdad: 'Son agentes livianos que comprueban la disponibilidad de parches de seguridad para mantener tu software protegido contra vulnerabilidades de día cero (Zero-Day).',
        comprobalo: 'En Task Manager -> Detalles -> Revisa la descripción y firma digital de los procesos updater instalados.',
      },
    },
    entende: {
      queEs: 'Programas secundarios (helpers) diseñados por los desarrolladores para consultar servidores remotos de versión y descargar parches silenciosos.',
      paraQueSirve: 'Mantiene aplicaciones complejas (navegadores, suites, controladores) parchadas sin requerir intervención manual del usuario.',
      quePasaSiFalta: 'Si deshabilitas los updaters, tus aplicaciones quedarán expuestas a fallos de seguridad conocidos que no se actualizarán.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Where-Object { $_.ProcessName -like "*update*" } | Select-Object Id, ProcessName, Path',
      guiPath: 'Administrador de tareas -> Configuración de inicio o Servicios',
      whatToLookFor: 'Identificá la empresa desarrolladora del updater verificando las propiedades del ejecutable.',
    },
    alertaEVO: {
      falsePositiveWarning: 'No asumas bloatware automáticamente; distingue entre un updater de navegador crítico y un notificador publicitario no deseado.',
      reversibilityRule: 'Un updater legítimo siempre tiene la firma digital válida del creador del software original.',
    },
    evidenceBadge: {
      code: 'EVD-05-17',
      label: 'BACKGROUND_SOFTWARE_UPDATER',
      defaultProvenance: 'VENDOR_UPDATER_AGENT',
    },
  },
  {
    id: 'inv-05-18',
    code: '05.18',
    title: 'Cloud sync',
    subtitle: 'Sincronización en la nube (OneDrive, Google Drive, iCloud) y el impacto en disco, red y CPU por File Watching',
    tabOrMetric: 'Clientes de Sincronización Cloud',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Copias una carpeta grande a "Mis Documentos" y de inmediato el ventilador de la PC acelera y el disco muestra 100% de uso. ¿Qué proceso se activó?',
      mythVsTruth: {
        mentira: 'Windows está fallando o el disco duro se rompió porque el uso de disco subió al copiar un archivo.',
        verdad: 'El cliente de nube (ej. OneDrive) utiliza ganchos del sistema de archivos (File System Watchers) para detectar cambios al instante y calcular hashes de sincronización.',
        comprobalo: 'Abre Task Manager -> Rendimiento -> Red y Disco -> Observa el proceso `OneDrive.exe` procesando archivos en background.',
      },
    },
    entende: {
      queEs: 'El proceso en segundo plano que monitorea cambios en carpetas locales especificadas y mantiene una réplica exacta en servidores remotos.',
      paraQueSirve: 'Asegura la disponibilidad de tus archivos en múltiples dispositivos y crea copias de respaldo continuas en la nube.',
      quePasaSiFalta: 'Si se finaliza abruptamente durante la transmisión, pueden quedar archivos a medio subir o generar conflictos de versión.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "OneDrive" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, CPU, WorkingSet64',
      guiPath: 'Administrador de tareas -> Procesos -> OneDrive / Google Drive',
      whatToLookFor: 'Observa cómo el uso de red y CPU de la app de nube vuelve a cero una vez que termina de calcular los deltas de archivos.',
    },
    alertaEVO: {
      falsePositiveWarning: 'El uso alto temporal de CPU durante la indexación inicial de miles de archivos pequeños es normal en clientes de nube.',
      reversibilityRule: 'Podés pausar la sincronización desde el icono de la barra de tareas sin matar el proceso a la fuerza.',
    },
    evidenceBadge: {
      code: 'EVD-05-18',
      label: 'CLOUD_SYNC_FILE_WATCHER',
      defaultProvenance: 'CLOUD_CLIENT_SYNC',
    },
  },
  {
    id: 'inv-05-19',
    code: '05.19',
    title: 'OEM agents',
    subtitle: 'Agentes de fabricantes (ASUS, Dell, HP, Lenovo, MSI) y la metodología para evaluar su utilidad real',
    tabOrMetric: 'Procesos de Fabricante de Hardware (OEM)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Comprás una notebook de marca y viene con 15 procesos de fondo de ASUS, Lenovo, Dell o HP. ¿Son todos indispensables o hay bloatware redundante?',
      mythVsTruth: {
        mentira: 'Todos los procesos con el nombre del fabricante de la laptop son virus o basura inservible que hay que borrar sin mirar.',
        verdad: 'Algunos agentes OEM gestionan curvas de ventiladores, teclas de función FN, límites de carga de batería e iluminación RGB; otros son simples accesos a ofertas.',
        comprobalo: 'Filtra en Task Manager los procesos por la empresa fabricante (ej. Dell Inc., ASUSTeK, Lenovo) y examina su función.',
      },
    },
    entende: {
      queEs: 'Software preinstalado por el fabricante del equipo para interactuar con las características propietarias del hardware de la motherboard o chasis.',
      paraQueSirve: 'Controla perfiles de energía, actualizaciones de BIOS/firmware y accesos directos de hardware especiales.',
      quePasaSiFalta: 'Si terminas a ciegas el agente de batería de Lenovo o ASUS, la laptop podría dejar de limitar la carga al 80% o perder el control de teclas FN.',
    },
    interactua: {
      powershellCommand: 'Get-Process | Where-Object { $_.Company -match "Dell|ASUS|Lenovo|HP|MSI|Acer" } | Select-Object Id, ProcessName, Company, Path',
      guiPath: 'Administrador de tareas -> Detalles -> Columna "Nombre de la empresa"',
      whatToLookFor: 'Aplica el filtro EVO: ¿Controla hardware físico directo o es solo una utilidad publicitaria/notificadora?',
    },
    alertaEVO: {
      falsePositiveWarning: 'Aplica la regla EVO para OEM: Investiga la función de control de hardware REAL antes de desinstalar o deshabilitar.',
      reversibilityRule: 'Si deshabilitas un servicio OEM de gestión térmica, la laptop podría usar perfiles por defecto conservadores o ruidosos.',
    },
    evidenceBadge: {
      code: 'EVD-05-19',
      label: 'OEM_HARDWARE_UTILITY_AGENT',
      defaultProvenance: 'VENDOR_OEM_AGENT',
    },
  },
  {
    id: 'inv-05-20',
    code: '05.20',
    title: 'Browser background processes',
    subtitle: 'Navegadores en segundo plano, Service Workers, extensiones permanentes y aceleración de inicio',
    tabOrMetric: 'Procesos de Navegador en Background (Chrome, Edge, Brave)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Cerrás Google Chrome o Microsoft Edge presionando la X. Sin embargo, en Task Manager ves que siguen corriendo 5 a 10 procesos del navegador. ¿Por qué no cerraron?',
      mythVsTruth: {
        mentira: 'El navegador se quedó colgado en memoria por un error grave del programa.',
        verdad: 'Los navegadores modernos incluyen la opción "Seguir ejecutando aplicaciones en segundo plano al cerrar" para mantener extensiones de correo, notificaciones push y acelerar la reapertura.',
        comprobalo: 'Cerrá el navegador. Abrí Task Manager -> Buscá `chrome.exe` o `msedge.exe`. Verás subprocesos livianos activos.',
      },
    },
    entende: {
      queEs: 'Modo de ejecución persistente del navegador que mantiene la infraestructura básica en RAM para atender Service Workers y extensiones registradas.',
      paraQueSirve: 'Permite recibir alertas web instantáneas (WhatsApp Web, Gmail) y abrir el navegador en menos de 1 segundo al volverlo a hacer clic.',
      quePasaSiFalta: 'Si desactivas la función en la configuración del navegador, este liberará la RAM al 100% al cerrar pero tardará más en volver a abrir.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "chrome","msedge" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, WorkingSet64',
      guiPath: 'Configuración del Navegador -> Sistema -> "Seguir ejecutando aplicaciones en segundo plano al cerrar"',
      whatToLookFor: 'Podés apagar esta opción directamente dentro de los ajustes de Chrome/Edge si prefieres maximizar RAM libre sobre velocidad de reapertura.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un subproceso de navegador en background puede ser mantenido por una extensión maliciosa. Revisa qué extensiones tenés instaladas.',
      reversibilityRule: 'Es un ajuste conmutable desde la interfaz oficial del navegador.',
    },
    evidenceBadge: {
      code: 'EVD-05-20',
      label: 'BROWSER_PRELOAD_BACKGROUND',
      defaultProvenance: 'WEB_BROWSER_BACKGROUND',
    },
  },
  {
    id: 'inv-05-21',
    code: '05.21',
    title: 'Qué hace Windows cuando no estás frente a la PC',
    subtitle: 'Mantenimiento automático en reposo: Defender Scan, Search Indexing, Windows Update, TRIM y Telemetría',
    tabOrMetric: 'Estado de Reposo (Idle State Maintenance)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Te vas a hacer un café por 15 minutos. Al volver, notas que la luz del SSD parpadea y la temperatura de la CPU subió levemente. ¿Qué ocurre en tu ausencia?',
      mythVsTruth: {
        mentira: 'Windows no hace absolutamente nada cuando no tocás el teclado ni el mouse.',
        verdad: 'Windows detecta el ESTADO DE REPOSO (Idle State) para ejecutar las tareas pesadas de mantenimiento preventivo sin interrumpir tu trabajo.',
        comprobalo: 'Dejá la PC en reposo con Task Manager abierto en la pestaña Rendimiento y observá la activación automática del Mantenimiento.',
      },
    },
    entende: {
      queEs: 'El periodo de inactividad de usuario aprovechado por el planificador de Windows para ejecutar el Mantenimiento Automático Diario.',
      paraQueSirve: 'Realiza análisis antivirus de Defender en busca de malware, optimización TRIM en discos SSD, reindexación de búsquedas, descarga de parches y desfragmentación.',
      quePasaSiFalta: 'Si la PC jamás entra en reposo o interrumpes el mantenimiento, las tareas se acumularán y terminarán ejecutándose de golpe durante tu horario de trabajo.',
    },
    interactua: {
      powershellCommand: 'Get-ScheduledTask -TaskPath "\\Microsoft\\Windows\\Diagnosis\\","\\Microsoft\\Windows\\Maintenance\\" | Select-Object TaskName, State',
      guiPath: 'Panel de control -> Seguridad y mantenimiento -> Mantenimiento -> Mantenimiento automático',
      whatToLookFor: 'Al mover el mouse o presionar una tecla, el Mantenimiento Automático pausa de inmediato sus procesos pesados para devolverte el 100% del rendimiento.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Actividad de disco y CPU en inactividad no es síntoma de troyano; es el motor de mantenimiento protegiendo y optimizando el sistema.',
      reversibilityRule: 'El diseño inteligente de Windows prioriza la interacción humana sobre el mantenimiento en segundo plano.',
    },
    evidenceBadge: {
      code: 'EVD-05-21',
      label: 'IDLE_MAINTENANCE_TIMELINE',
      defaultProvenance: 'WINDOWS_IDLE_ENGINE',
    },
  },
];

export const SECTOR_05_MINICASES: Sector05MiniCase[] = [
  {
    id: 'case-05-a',
    code: 'CASO 05-A',
    title: 'El pánico por los 20 svchost.exe',
    scenario: 'Un usuario abrió el Administrador de Tareas por primera vez y vio 22 procesos llamados "Host de servicios: svchost.exe". Preso del pánico, intentó finalizar todos los que pudo. El sonido se cortó y la red se desconectó.',
    userStatement: '“¡Tengo 20 virus svchost duplicando mi procesador y cuando los mato me quedo sin Internet!”',
    initialMistake: 'Creer que la multiplicidad del proceso svchost.exe indica una infección de virus duplicados.',
    diagnosticQuestion: '¿Por qué existen múltiples procesos svchost.exe en un sistema Windows saludable?',
    options: [
      {
        id: 'c5_a1',
        text: 'Porque svchost.exe es un contenedor genérico diseñado para alojar servicios en grupos aislados por seguridad y estabilidad.',
        isCorrect: true,
        explanation: 'Windows utiliza svchost para ejecutar librerías DLL de servicios. Agruparlos evita que un fallo en un servicio derribe a todo el SO.',
      },
      {
        id: 'c5_a2',
        text: 'Because svchost.exe is a virus scanner automatically duplicating itself.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Los 22 svchost.exe eran servicios legítimos de Windows (Audio, Red, Plug and Play). La ruta era System32.',
    lessonLearned: 'Múltiples svchost.exe es el diseño normal de Windows. Se audita la RUTA física del ejecutable, no la cantidad.',
  },
  {
    id: 'case-05-b',
    code: 'CASO 05-B',
    title: 'El misterio del consumo en reposo',
    scenario: 'Un técnico nota que al dejar una laptop en reposo durante 10 minutos, el proceso `MsMpEng.exe` (Defender) y `TiWorker.exe` elevan el uso de CPU al 35%. Apenas toca el ratón, el uso cae a 0%.',
    userStatement: '“Hay un virus tímido que mina criptomonedas solo cuando no miro la pantalla.”',
    initialMistake: 'Malinterpretar el comportamiento del Mantenimiento Automático en estado de Reposo (Idle State).',
    diagnosticQuestion: '¿Por qué el uso de CPU sube en inactividad y cae instantáneamente al mover el mouse?',
    options: [
      {
        id: 'c5_b1',
        text: 'Porque el Mantenimiento Automático de Windows programa tareas pesadas (escaneo antivirus, updates) para ejecutarse en reposo y se detiene al detectar presencia humana.',
        isCorrect: true,
        explanation: 'Windows aprovecha el estado de inactividad para optimizar el SSD y buscar malware sin afectar la experiencia del usuario.',
      },
      {
        id: 'c5_b2',
        text: 'Porque la placa de video se apaga por falta de electricidad.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Comportamiento canónico del motor de mantenimiento en inactividad.',
    lessonLearned: 'El estado Idle está diseñado para diferir cargas de mantenimiento preventivo.',
  },
  {
    id: 'case-05-c',
    code: 'CASO 05-C',
    title: 'La trampa del falso csrss.exe',
    scenario: 'Durante una auditoría en un equipo corporativo, el analista ve dos instancias de `csrss.exe`. Una está en `C:\\Windows\\System32` y la otra en `C:\\Users\\Public\\AppData\\csrss.exe`.',
    userStatement: '“Tengo dos csrss.exe, uno debe ser la sesión 0 y el otro la sesión 1.”',
    initialMistake: 'Aceptar la ruta en AppData asumiendo que es la segunda sesión válida del usuario.',
    diagnosticQuestion: '¿Qué regla Inviolable de EVO LABS revela que la segunda instancia es maliciosa?',
    options: [
      {
        id: 'c5_c1',
        text: 'La Regla de Ruta: Los procesos críticos de Windows (csrss, lsass, smss, wininit) deben ejecutarse ÚNICAMENTE desde C:\\Windows\\System32.',
        isCorrect: true,
        explanation: 'Cualquier binario crítico ejecutando fuera de System32 (ej. AppData, Temp) es un malware suplantador (Trojan/Masquerading).',
      },
      {
        id: 'c5_c2',
        text: 'Que el archivo pesaba más de 5 MB.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'El csrss.exe de AppData era un troyano de acceso remoto (RAT) camuflado con el nombre de un proceso de sistema.',
    lessonLearned: 'Ruta, Firma y PID parent son la trilogía indispensable para la verificación de procesos críticos.',
  },
  {
    id: 'case-05-d',
    code: 'CASO 05-D',
    title: 'El cliente de nube desbocado',
    scenario: 'Un usuario reporta que su laptop se traba cada vez que guarda una fotografía en la carpeta Imágenes. En Task Manager, `OneDrive.exe` muestra 99% de uso de Disco y 40% de CPU durante 3 minutos.',
    userStatement: '“El disco rígido se rompió porque hace ruido cuando guardo una foto.”',
    initialMistake: 'Diagnosticar fallo físico de hardware cuando la causa es la sincronización en tiempo real.',
    diagnosticQuestion: '¿Qué mecanismo del cliente de nube provoca ese pico momentáneo de recursos?',
    options: [
      {
        id: 'c5_d1',
        text: 'El motor File System Watcher detectó la modificación y comenzó a calcular el hash y comprimir el archivo para la transmisión.',
        isCorrect: true,
        explanation: 'Los agentes de sync inspeccionan cada cambio de archivo para replicar las deltas en la nube.',
      },
      {
        id: 'c5_d2',
        text: 'Windows borró la memoria RAM.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'OneDrive estaba reindexando una biblioteca con 50.000 fotos recién agregadas.',
    lessonLearned: 'Diferenciá entre un fallo de hardware e I/O derivado de la indexación de sincronización cloud.',
  },
  {
    id: 'case-05-e',
    code: 'CASO 05-E',
    title: 'El subproceso huérfano de navegador',
    scenario: 'Un usuario cerró todas las pestañas de su navegador Chrome. Sin embargo, en Task Manager quedan 4 procesos `chrome.exe` consumiendo 180 MB de RAM combinados.',
    userStatement: '“El navegador no se cerró y me está robando memoria RAM secreta.”',
    initialMistake: 'Creer que se trata de un cuelgue de memoria o fuga del programa.',
    diagnosticQuestion: '¿Qué característica configurada en el navegador mantiene esos procesos activos?',
    options: [
      {
        id: 'c5_e1',
        text: 'La opción de mantener aplicaciones y extensiones en segundo plano en ejecución al cerrar la interfaz principal.',
        isCorrect: true,
        explanation: 'Permite que extensiones de notificaciones funcionen y acelera la reapertura del navegador.',
      },
      {
        id: 'c5_e2',
        text: 'Un virus que secuestró la placa de red.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Ajuste nativo de background apps en el navegador. Se puede desactivar desde la configuración de Chrome.',
    lessonLearned: 'Los navegadores modernos actúan como mini sistemas operativos con ejecuciones persistentes.',
  },
];

export const SECTOR_05_TEST_BANK: Sector05TestQuestion[] = [
  {
    id: 't05-q01',
    questionNumber: 1,
    category: 'PROCESOS_SISTEMA',
    question: '¿Cuál es la ruta canónica única e inviolable desde la que debe ejecutarse el ejecutable host svchost.exe?',
    options: [
      { id: 'opt_1', text: 'C:\\Windows\\System32\\svchost.exe' },
      { id: 'opt_2', text: 'C:\\Users\\Public\\svchost.exe' },
      { id: 'opt_3', text: 'C:\\Windows\\Temp\\svchost.exe' },
      { id: 'opt_4', text: 'C:\\ProgramData\\Microsoft\\svchost.exe' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'El Service Host legítimo de Windows reside exclusivamente en la carpeta System32. Cualquier ejecutable con ese nombre fuera de esa ruta es sospechoso.',
    relatedInvestigationCode: '05.04',
  },
  {
    id: 't05-q02',
    questionNumber: 2,
    category: 'PROCESOS_SISTEMA',
    question: '¿Qué representa el proceso System con PID 4 en el Administrador de Tareas?',
    options: [
      { id: 'opt_1', text: 'Un ejecutable de usuario llamado System.exe en el disco C:' },
      { id: 'opt_2', text: 'Un contenedor del modo Kernel que ejecuta hilos de controladores de dispositivos e I/O de bajo nivel' },
      { id: 'opt_3', text: 'El programa Antivirus oficial de Microsoft Windows' },
      { id: 'opt_4', text: 'Un proceso de navegador de Internet oculto' },
    ],
    correctOptionId: 'opt_2',
    technicalExplanation: 'System (PID 4) representa la ejecución en modo kernel (Kernel-Mode Threads) de controladores y llamadas de I/O.',
    relatedInvestigationCode: '05.02',
  },
  {
    id: 't05-q03',
    questionNumber: 3,
    category: 'RELACION_PADRE_HIJO',
    question: '¿Qué significa el término PPID (Parent Process ID)?',
    options: [
      { id: 'opt_1', text: 'El identificador numérico del proceso PADRE que invocó la creación del proceso hijo' },
      { id: 'opt_2', text: 'El porcentaje de memoria RAM reservada por el procesador' },
      { id: 'opt_3', text: 'La velocidad de la placa de red expresada en paquetes por segundo' },
      { id: 'opt_4', text: 'El código de licencia del sistema operativo' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'PPID representa el ID del proceso creador (Padre) que lanzó al subproceso hijo mediante la API de Windows.',
    relatedInvestigationCode: '05.11',
  },
  {
    id: 't05-q04',
    questionNumber: 4,
    category: 'SEGUIMIENTO_BACKGROUND',
    question: '¿En qué sesión ejecutan de forma aislada los servicios de Windows por razones de seguridad (Session Isolation)?',
    options: [
      { id: 'opt_1', text: 'En la Sesión 1 interactiva de usuario' },
      { id: 'opt_2', text: 'En la Sesión 0 aislada sin interfaz de escritorio' },
      { id: 'opt_3', text: 'En la Sesión de invitados del navegador' },
      { id: 'opt_4', text: 'En el archivo pagefile.sys' },
    ],
    correctOptionId: 'opt_2',
    technicalExplanation: 'Session 0 Isolation aísla los servicios en la Sesión 0 para evitar ataques de inyección de interfaz desde aplicaciones de usuario.',
    relatedInvestigationCode: '05.12',
  },
  {
    id: 't05-q05',
    questionNumber: 5,
    category: 'DIAGNÓSTICO',
    question: '¿Qué ocurre con las tareas pesadas de Mantenimiento Automático (Defender scan, TRIM, indexación) cuando el usuario mueve el ratón en estado Idle?',
    options: [
      { id: 'opt_1', text: 'Se pausan inmediatamente para devolver el 100% de los recursos al usuario' },
      { id: 'opt_2', text: 'Provocan un reinicio instantáneo de la PC' },
      { id: 'opt_3', text: 'Bloquean el teclado durante 10 minutos' },
      { id: 'opt_4', text: 'Se borran permanentemente del disco' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'El planificador de Windows pausa automáticamente las tareas de mantenimiento en reposo cuando detecta la interacción del usuario.',
    relatedInvestigationCode: '05.21',
  },
];
