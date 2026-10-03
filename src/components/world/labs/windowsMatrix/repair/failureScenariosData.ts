// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS FAILURE & REPAIR LAB — DATA REPOSITORY
// Principle: "SÍNTOMA ➔ EVIDENCIA ➔ HIPÓTESIS ➔ PRUEBA ➔ CAUSA RAÍZ ➔ REPARACIÓN ➔ COMPROBACIÓN"
// ============================================================================

export type FailureDifficulty = 'BÁSICO' | 'INTERMEDIO' | 'TÉCNICO' | 'INVESTIGADOR';

export type FailureCategory =
  | 'Arranque & Boot'
  | 'Sistema & Kernel'
  | 'Red & Conectividad'
  | 'Audio & Periféricos'
  | 'Almacenamiento & Archivos'
  | 'Rendimiento & Latencias';

export interface DiagnosticHypothesis {
  id: string;
  text: string;
  isCorrect: boolean;
  rejectionReason?: string;
  confirmationReason?: string;
}

export interface FailureScenarioItem {
  id: string;
  title: string;
  category: FailureCategory;
  difficulty: FailureDifficulty;
  badgeCode: string;
  
  // 1. Qué ve el usuario
  userSymptom: string;
  
  // 2. Qué NO debemos asumir
  whatNotToAssume: string;
  
  // 3. Primera prueba
  firstTestCommand: string;
  firstTestTool: string;
  
  // 4. Resultado de la prueba
  testResultOutput: string;
  
  // 5. Nueva evidencia
  newEvidence: string;
  
  // 6. Hipótesis disponibles
  hypotheses: DiagnosticHypothesis[];
  
  // 7. Próxima prueba de aislamiento
  nextTestCommand: string;
  nextTestExplanation: string;
  
  // 8. Causa raíz
  rootCause: string;
  
  // 9. Solución determinista
  solutionSteps: string[];
  solutionCommands: string[];
  
  // 10. Cómo comprobar que realmente se arregló
  verificationProtocol: string;
  verificationCommand?: string;
  
  // Seguridad & Reversibilidad
  riskLevel: 'VERDE' | 'AMARILLO' | 'ROJO';
  rollbackProtocol: string;
}

export const FAILURE_SCENARIOS: FailureScenarioItem[] = [
  // --------------------------------------------------------------------------
  // 1. ARRANQUE & BOOT
  // --------------------------------------------------------------------------
  {
    id: 'boot-fail-01',
    title: 'Windows no arranca (Inaccessible Boot Device)',
    category: 'Arranque & Boot',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-BOOT-001',
    userSymptom: 'Al encender la PC aparece el logotipo de Windows con un círculo de carga por 3 segundos, seguido de BSOD: INACCESSIBLE_BOOT_DEVICE y reinicio inmediato.',
    whatNotToAssume: 'No asumas que el disco NVMe o SSD murió físicamente ni que tenés que formatear. En el 90% de los casos el hardware está intacto y falló el controlador de almacenamiento o el modo SATA/NVMe (VMD/AHCI).',
    firstTestCommand: 'bcdedit /enum {current}',
    firstTestTool: 'Consola de Recuperación WinRE',
    testResultOutput: 'identifier {current}\ndevice partition=C:\npath \\Windows\\system32\\winload.efi\nosdevice partition=C:\nsystemroot \\Windows',
    newEvidence: 'La configuración de BCD y las rutas de winload.efi apuntan correctamente a la partición C:. Sin embargo, ntoskrnl no logra inicializar el bus PCIe/NVMe en la fase 1 del kernel.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El disco tiene sectores defectuosos irreparables y perdió la tabla de particiones.',
        isCorrect: false,
        rejectionReason: 'La partición C: fue montada y leída con éxito por WinRE mediante el comando bcdedit.',
      },
      {
        id: 'h2',
        text: 'El BIOS cambió el modo de la controladora a Intel VMD / RAID deshabilitando el controlador genérico de almacenamiento StorNVMe.',
        isCorrect: true,
        confirmationReason: 'Una actualización de BIOS o reseteo de CMOS activó Intel VMD, ocultando los volúmenes nativos al kernel.',
      },
      {
        id: 'h3',
        text: 'Falta el archivo winload.efi en System32.',
        isCorrect: false,
        rejectionReason: 'El código de parada INACCESSIBLE_BOOT_DEVICE ocurre en el Ring 0 del kernel, lo que demuestra que winload.efi sí se ejecutó.',
      },
    ],
    nextTestCommand: 'diskpart -> list volume -> select volume C -> detail disk',
    nextTestExplanation: 'Verificar si el disco responde bajo el bus nativo y contrastar la configuración de almacenamiento en firmware UEFI.',
    rootCause: 'El firmware UEFI restableció el modo de almacenamiento a VMD/RAID tras un corte de energía, impidiendo que el controlador de arranque lea la partición del sistema.',
    solutionSteps: [
      'Ingresar al menú de configuración UEFI / BIOS (F2 o Supr).',
      'Navegar a Advanced -> Storage Configuration / VMD Setup.',
      'Desactivar Intel VMD Controller (o cambiar de RAID a AHCI / NVMe nativo).',
      'Guardar cambios con F10 y reiniciar el equipo.',
    ],
    solutionCommands: [
      'bcdedit /set {default} safeboot minimal',
      'shutdown /r /t 0',
      'bcdedit /deletevalue {default} safeboot',
    ],
    verificationProtocol: 'El sistema bootea directamente al escritorio en menos de 15 segundos sin invocar la pantalla de recuperación.',
    verificationCommand: 'Get-CimInstance Win32_OperatingSystem | Select-Object LastBootUpTime',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Volver a ingresar al UEFI y reactivar la opción anterior si el equipo requería configuración RAID por hardware.',
  },
  {
    id: 'boot-fail-02',
    title: 'Boot Loop Infinito en "Preparando Reparación Automática"',
    category: 'Arranque & Boot',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-BOOT-002',
    userSymptom: 'La PC entra en bucle: muestra "Preparando reparación automática", pantalla negra, y vuelve a reiniciar infinitamente.',
    whatNotToAssume: 'No asumas que Windows está destruido. Generalmente es un archivo de registro corrupto (SYSTEM) o un controlador incompatible cargado en el arranque temprano (ELAM).',
    firstTestCommand: 'type X:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt',
    firstTestTool: 'SrtTrail.txt en WinRE',
    testResultOutput: 'Causa principal encontrada:\n---------------------------\nArchivo crítico de arranque c:\\windows\\system32\\drivers\\amdkmpfd.sys está dañado.\nCódigo de error = 0x57',
    newEvidence: 'El registro de reparación SrtTrail.txt aisló con exactitud el archivo causante: un driver defectuoso que provoca una comprobación de error durante la inicialización de sesión.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La partición EFI está corrupta y necesita recrearse por completo.',
        isCorrect: false,
        rejectionReason: 'El bootloader inicia y lanza la secuencia de Windows; el fallo ocurre en la carga de drivers.',
      },
      {
        id: 'h2',
        text: 'Un driver de terceros de inicio temprano (Boot-start driver) tiene su firma o binario corrupto.',
        isCorrect: true,
        confirmationReason: 'SrtTrail.txt identifica específicamente amdkmpfd.sys con código de error 0x57.',
      },
      {
        id: 'h3',
        text: 'La memoria RAM está en corto circuito.',
        isCorrect: false,
        rejectionReason: 'El código de error de SrtTrail apunta a un binario específico de disco, no a corrupción errática de memoria.',
      },
    ],
    nextTestCommand: 'ren C:\\Windows\\System32\\drivers\\amdkmpfd.sys amdkmpfd.bak',
    nextTestExplanation: 'Aislar el controlador renombrándolo para que el kernel cargue el controlador de respaldo básico.',
    rootCause: 'Driver de arranque temprano firmado pero con binario truncado por apagado abrupto previo.',
    solutionSteps: [
      'Iniciar en WinRE -> Símbolo del sistema.',
      'Identificar la letra de unidad de Windows (C: o D:).',
      'Renombrar el archivo problemático identificado por SrtTrail.',
      'Ejecutar DISM para reparar la tienda de componentes.',
    ],
    solutionCommands: [
      'ren C:\\Windows\\System32\\drivers\\amdkmpfd.sys amdkmpfd.sys.bak',
      'dism /image:C:\\ /cleanup-image /restorehealth',
    ],
    verificationProtocol: 'El sistema inicia normalmente y SrtTrail ya no reporta fallos en el siguiente reinicio.',
    verificationCommand: 'Get-WinEvent -FilterHashtable @{LogName="System"; ProviderName="Microsoft-Windows-Kernel-General"} -MaxEvents 3',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Restaurar el archivo renombrado: ren C:\\Windows\\System32\\drivers\\amdkmpfd.sys.bak amdkmpfd.sys.',
  },
  {
    id: 'boot-fail-03',
    title: 'BCD Corrupto / Error 0xc0000034 / 0xc0000098',
    category: 'Arranque & Boot',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-BOOT-003',
    userSymptom: 'Pantalla azul de recuperación de Windows: "The Boot Configuration Data file doesn\'t contain valid info for an operating system. Error code: 0xc0000034".',
    whatNotToAssume: 'No asumas que se perdieron tus documentos personales. El BCD es solo un archivo de base de datos de 24 KB ubicado en la partición oculta ESP.',
    firstTestCommand: 'bcdedit',
    firstTestTool: 'CMD en Entorno de Recuperación',
    testResultOutput: 'No se pudo abrir el almacén de datos de la configuración de arranque (BCD).\nEl sistema no puede encontrar el archivo especificado.',
    newEvidence: 'El almacén BCD en \\EFI\\Microsoft\\Boot\\BCD está ausente o tiene punteros hexadecimales truncados.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La partición EFI de 100 MB fue borrada accidentalmente o el almacén BCD está dañado.',
        isCorrect: true,
        confirmationReason: 'bcdedit no encuentra el hive de configuración.',
      },
      {
        id: 'h2',
        text: 'El procesador no soporta instrucciones x64.',
        isCorrect: false,
        rejectionReason: 'El código 0xc0000034 es un estado STATUS_OBJECT_NAME_NOT_FOUND de acceso a archivo.',
      },
    ],
    nextTestCommand: 'diskpart -> list disk -> list partition',
    nextTestExplanation: 'Localizar la partición del sistema EFI (formato FAT32 de 100 MB).',
    rootCause: 'Archivo BCD dañado tras clonación fallida de disco o apagado forzado durante actualización.',
    solutionSteps: [
      'Abrir diskpart en WinRE.',
      'Asignar letra Z: a la partición EFI FAT32.',
      'Regenerar el almacén con bcdboot señalando la carpeta C:\\Windows.',
    ],
    solutionCommands: [
      'diskpart\nselect volume 1\nassign letter=Z\nexit',
      'bcdboot C:\\Windows /s Z: /f UEFI',
    ],
    verificationProtocol: 'bcdedit /enum {current} devuelve la estructura completa de arranque de Windows Boot Manager y Windows Boot Loader.',
    verificationCommand: 'bcdedit /enum {current}',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Hacer copia previa de la partición EFI con xcopy Z:\\EFI Z:\\EFI_BACKUP /E /H.',
  },
  {
    id: 'boot-fail-04',
    title: 'WinRE Desactivado o Inaccesible (Error 0x80070002 en Reagentc)',
    category: 'Arranque & Boot',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-BOOT-004',
    userSymptom: 'Al seleccionar "Reiniciar en modo avanzado" el equipo reinicia al escritorio normal sin abrir el menú de recuperación. reagentc /info muestra Estado: Deshabilitado.',
    whatNotToAssume: 'No asumas que tenés que descargar una ISO entera de Windows ni que no existe entorno de rescate.',
    firstTestCommand: 'reagentc /info',
    firstTestTool: 'PowerShell / CMD Elevado',
    testResultOutput: 'Información sobre la configuración del entorno de recuperación de Windows (WinRE):\n    Estado de WinRE:         Disabled\n    Ubicación de WinRE:      \n    Identificador de datos BCD: 00000000-0000-0000-0000-000000000000',
    newEvidence: 'WinRE está deshabilitado y el puntero a Winre.wim está vacío.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La partición de recuperación (Recovery) fue eliminada o el archivo Winre.wim perdió el atributo oculto de sistema.',
        isCorrect: true,
        confirmationReason: 'La herramienta reagentc no encuentra la imagen de rescate.',
      },
      {
        id: 'h2',
        text: 'Windows no es original.',
        isCorrect: false,
        rejectionReason: 'La activación de Windows no tiene relación técnica con la imagen WIM del entorno de preinstalación.',
      },
    ],
    nextTestCommand: 'dir /a C:\\Windows\\System32\\Recovery',
    nextTestExplanation: 'Comprobar si Winre.wim reside localmente en la carpeta de recuperación de System32.',
    rootCause: 'La partición de recuperación se quedó sin espacio durante una actualización mensual (KB5034441) o el archivo WIM quedó desacoplado.',
    solutionSteps: [
      'Verificar presencia de Winre.wim en C:\\Windows\\System32\\Recovery.',
      'Asignar la ruta explícita con reagentc.',
      'Habilitar el entorno y verificar con reagentc /info.',
    ],
    solutionCommands: [
      'reagentc /setreimage /path C:\\Windows\\System32\\Recovery',
      'reagentc /enable',
      'reagentc /info',
    ],
    verificationProtocol: 'El comando reagentc /info reporta "Estado de WinRE: Enabled".',
    verificationCommand: 'reagentc /info',
    riskLevel: 'VERDE',
    rollbackProtocol: 'reagentc /disable para volver al estado inicial si fuera requerido por políticas de despliegue.',
  },

  // --------------------------------------------------------------------------
  // 2. SISTEMA & KERNEL
  // --------------------------------------------------------------------------
  {
    id: 'sys-fail-05',
    title: 'Pantalla Negra con Cursor tras Iniciar Sesión',
    category: 'Sistema & Kernel',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-SYS-005',
    userSymptom: 'Al poner la contraseña de usuario, la pantalla se queda completamente en negro. El cursor del mouse se mueve pero no hay barra de tareas ni iconos.',
    whatNotToAssume: 'No asumas que el monitor o el cable HDMI fallan, ni que el driver de video se rompió por completo: si el cursor se mueve, el subsistema gráfico DWM está vivo.',
    firstTestCommand: 'Ctrl + Shift + Esc -> Archivo -> Ejecutar nueva tarea: cmd /k tasklist | findstr "explorer.exe"',
    firstTestTool: 'Administrador de Tareas / Consola',
    testResultOutput: '(vacío - no hay ningún proceso explorer.exe en ejecución)',
    newEvidence: 'El proceso del shell (explorer.exe) no fue convocado por Winlogon o se cerró inmediatamente por una clave de registro alterada o extensión corrupta.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La clave de registro Winlogon Shell fue modificada o reemplazada por malware o un optimizador.',
        isCorrect: true,
        confirmationReason: 'La clave HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\\Shell debe contener únicamente explorer.exe.',
      },
      {
        id: 'h2',
        text: 'La placa de video se quemó.',
        isCorrect: false,
        rejectionReason: 'El cursor del mouse y el Administrador de Tareas se renderizan perfectamente en pantalla.',
      },
    ],
    nextTestCommand: 'reg query "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" /v Shell',
    nextTestExplanation: 'Comprobar el valor del shell de inicio de sesión.',
    rootCause: 'Valor de Shell en el Registro alterado o explorer.exe bloqueado por clave AppInit_DLLs.',
    solutionSteps: [
      'Abrir Administrador de Tareas con Ctrl + Shift + Esc.',
      'Ejecutar regedit.exe como Administrador.',
      'Ir a HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon.',
      'Asegurar que la clave "Shell" tenga valor tipo cadena "explorer.exe".',
      'Lanzar manualmente "explorer.exe" desde el Administrador de Tareas.',
    ],
    solutionCommands: [
      'reg add "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" /v Shell /t REG_SZ /d "explorer.exe" /f',
      'start explorer.exe',
    ],
    verificationProtocol: 'Aparece instantáneamente la barra de tareas, menú de inicio e iconos de escritorio.',
    verificationCommand: 'Get-Process explorer',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Exportar la clave de Winlogon antes de alterar con reg export.',
  },
  {
    id: 'sys-fail-06',
    title: 'Explorer.exe se Reinicia en Bucle (Parpadeo de Barra de Tareas)',
    category: 'Sistema & Kernel',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-SYS-006',
    userSymptom: 'La barra de tareas y el escritorio parpadean cada 2 segundos. Se escucha el sonido de recarga de dispositivo y es imposible hacer clic en nada.',
    whatNotToAssume: 'No asumas que es un virus indestructible. Casi siempre es una extensión de menú contextual (.dll) de software de terceros (WinRAR, 7-Zip, OneDrive, antivirus) que crashea explorer.exe al intentar inicializarse.',
    firstTestCommand: 'Get-WinEvent -FilterHashtable @{LogName="Application"; ProviderName="Application Error"} -MaxEvents 5 | Format-List TimeCreated, Message',
    firstTestTool: 'PowerShell / Visor de Eventos',
    testResultOutput: 'Nombre de la aplicación con errores: explorer.exe\nNombre del módulo con errores: ShellExtensionOverlay.dll\nCódigo de excepción: 0xc0000005 (Access Violation)',
    newEvidence: 'El evento 1000 de Application Error señala inequívocamente una DLL de menú contextual de terceros provocando una violación de acceso.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Una extensión ShellEx de terceros provoca una excepción de memoria en el hilo principal de Explorer.',
        isCorrect: true,
        confirmationReason: 'El código 0xc0000005 en ShellExtensionOverlay.dll dentro del espacio de direcciones de explorer.exe.',
      },
      {
        id: 'h2',
        text: 'Windows Update corrompió los archivos de sistema de ntdll.dll.',
        isCorrect: false,
        rejectionReason: 'El módulo con error es la DLL de la aplicación de terceros, no un binario del núcleo.',
      },
    ],
    nextTestCommand: 'ShellExView de Sysinternals o desregistro manual de la DLL',
    nextTestExplanation: 'Desregistrar la DLL responsable o desinstalar la aplicación dueña del menú contextual.',
    rootCause: 'Extensión de shell de software de terceros incompatible con la compilación actual de Windows.',
    solutionSteps: [
      'Iniciar en Modo Seguro.',
      'Desinstalar la aplicación a la que pertenece la DLL identificada en el visor de eventos.',
      'O renombrar la DLL ofensiva para impedir que Explorer la cargue.',
      'Reiniciar en modo normal.',
    ],
    solutionCommands: [
      'regsvr32 /u "C:\\Program Files\\AppProblem\\ShellExtensionOverlay.dll"',
      'taskkill /f /im explorer.exe & start explorer.exe',
    ],
    verificationProtocol: 'Explorer.exe se mantiene estable con 0 reinicios durante más de 60 segundos.',
    verificationCommand: '(Get-Process explorer).StartTime',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Volver a registrar la DLL con regsvr32 si la aplicación se actualiza a una versión compatible.',
  },
  {
    id: 'sys-fail-07',
    title: 'Perfil de Usuario Temporal ("No podemos iniciar sesión en tu cuenta")',
    category: 'Sistema & Kernel',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-SYS-007',
    userSymptom: 'Al entrar a Windows, aparece una notificación: "No podemos iniciar sesión en tu cuenta. Los archivos que guardes se borrarán al cerrar sesión". Todos los iconos personales desaparecieron.',
    whatNotToAssume: 'No asumas que se borraron tus fotos, descargas o documentos. Los archivos siguen en C:\\Users\\TuNombre; lo que falló es el puntero del Registro que carga el hive NTUSER.DAT.',
    firstTestCommand: 'whoami /user',
    firstTestTool: 'CMD / PowerShell',
    testResultOutput: 'Nombre de usuario: DESKTOP-PC\\Alumno\nSID: S-1-5-21-3829103812-2938472910-1001',
    newEvidence: 'El SID del usuario actual es S-1-5-21-...-1001. Al consultar ProfileList en el Registro, existe una clave duplicada con sufijo .bak.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Existe una clave de perfil bloqueada con extensión .bak en HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList.',
        isCorrect: true,
        confirmationReason: 'Windows renombra la clave a .bak cuando encuentra el archivo NTUSER.DAT bloqueado o con permisos dañados.',
      },
      {
        id: 'h2',
        text: 'El disco C está completamente dañado y no puede leerse.',
        isCorrect: false,
        rejectionReason: 'El perfil temporal C:\\Users\\TEMP se crea y escribe perfectamente en el mismo disco.',
      },
    ],
    nextTestCommand: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList"',
    nextTestExplanation: 'Comprobar si existe la clave S-1-5-21-...-1001.bak.',
    rootCause: 'El hive NTUSER.DAT quedó retenido por un antivirus o proceso en segundo plano durante el apagado previo, forzando a Windows a crear un perfil temporal de emergencia.',
    solutionSteps: [
      'Abrir regedit como Administrador.',
      'Ir a HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList.',
      'Localizar la clave con el SID del usuario que tiene extensión .bak.',
      'Si existe una clave idéntica sin .bak que apunta a TEMP, borrarla o renombrarla a .old.',
      'Quitar el sufijo .bak a la clave original.',
      'Reiniciar el equipo.',
    ],
    solutionCommands: [
      'Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\\*" | Select-Object ProfileImagePath, State',
    ],
    verificationProtocol: 'Al reiniciar, el usuario entra a su cuenta normal con todos sus archivos y escritorio original restaurados.',
    verificationCommand: '$env:USERPROFILE',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Hacer exportación previa de la rama ProfileList con reg export.',
  },
  {
    id: 'sys-fail-08',
    title: 'BSOD Pantalla Azul Crítica (IRQL_NOT_LESS_OR_EQUAL / ntoskrnl.exe)',
    category: 'Sistema & Kernel',
    difficulty: 'INVESTIGADOR',
    badgeCode: 'ERR-SYS-008',
    userSymptom: 'Pantalla azul de repente mientras se usa la PC: "Detención: IRQL_NOT_LESS_OR_EQUAL". El sistema genera un volcado de memoria minidump y reinicia.',
    whatNotToAssume: 'No asumas que el kernel ntoskrnl.exe está corrupto aunque el visor de eventos lo señale. Ntoskrnl es donde el hilo crashea cuando un controlador desobedeció los niveles de interrupción IRQL.',
    firstTestCommand: 'Get-ChildItem C:\\Windows\\Minidump -Filter *.dmp | Sort-Object LastWriteTime -Descending | Select-Object -First 1',
    firstTestTool: 'PowerShell / WinDbg Preview',
    testResultOutput: 'Directorio: C:\\Windows\\Minidump\nNombre: 100326-14521-01.dmp\nFecha: 03/10/2026 09:22:15\nTamaño: 2.45 MB',
    newEvidence: 'El análisis del volcado con !analyze -v muestra: MODULE_NAME: nvlddmkm, FAILURE_BUCKET_ID: AV_nvlddmkm!unknown_function.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El controlador gráfico NVIDIA nvlddmkm.sys intentó acceder a una dirección de memoria paginable estando en un IRQL elevado (DISPATCH_LEVEL).',
        isCorrect: true,
        confirmationReason: 'El volcado Minidump aísla formalmente el hilo en nvlddmkm.sys.',
      },
      {
        id: 'h2',
        text: 'La fuente de alimentación no entrega suficiente voltaje a la placa madre.',
        isCorrect: false,
        rejectionReason: 'Un fallo de energía genera apagado inmediato sin volcado o WHEA_UNCORRECTABLE_ERROR, no una violación de IRQL en un driver.',
      },
    ],
    nextTestCommand: 'Get-WmiObject Win32_PnPSignedDriver | Where-Object {$_.DeviceName -like "*NVIDIA*"} | Select-Object DeviceName, DriverVersion',
    nextTestExplanation: 'Comprobar versión del controlador de video instalado actualmente.',
    rootCause: 'Controlador de pantalla con fuga de punteros o conflicto con aceleración por hardware de Windows.',
    solutionSteps: [
      'Descargar el controlador oficial estable más reciente o la versión Studio/WHQL.',
      'Desinstalar el controlador corrupto en Modo Seguro usando DDU (Display Driver Uninstaller).',
      'Reinstalar el controlador limpio sin software adicional innecesario.',
    ],
    solutionCommands: [
      'pnputil /enum-drivers | findstr "oem nvld"',
      'sfc /scannow',
    ],
    verificationProtocol: 'Cero BSODs registrados en el Visor de Eventos tras 48 horas de carga pesada.',
    verificationCommand: 'Get-WinEvent -FilterHashtable @{LogName="System"; Id=1001} -MaxEvents 5',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Crear Punto de Restauración antes de instalar el nuevo controlador de video.',
  },
  {
    id: 'sys-fail-09',
    title: 'Windows Update Roto (Error 0x80070002 / 0x80248007 en Descarga)',
    category: 'Sistema & Kernel',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-SYS-009',
    userSymptom: 'Al buscar actualizaciones, el progreso se queda en 0% o llega al 99% y tira el error 0x80070002 o 0x80248007. No avanza nunca.',
    whatNotToAssume: 'No asumas que tenés que reinstalar Windows ni usar programas de terceros para limpiar actualizaciones.',
    firstTestCommand: 'Get-Service wuauserv, cryptSvc, bits, trustedinstaller | Select-Object Name, Status, StartType',
    firstTestTool: 'PowerShell Elevado',
    testResultOutput: 'Name              Status   StartType\n----              ------   ---------\nwuauserv          Running  Manual\ncryptSvc          Running  Automatic\nbits              Stopped  Manual\ntrustedinstaller  Running  Manual',
    newEvidence: 'La carpeta de caché de descargas SoftwareDistribution contiene payloads parcialmente descargados que no coinciden con las sumas SHA-256 del catálogo de Microsoft.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La base de datos de caché en C:\\Windows\\SoftwareDistribution\\Download está corrupta e impide reanudar paquetes.',
        isCorrect: true,
        confirmationReason: 'La firma del paquete no concuerda y el servicio rechaza escribir encima.',
      },
      {
        id: 'h2',
        text: 'Microsoft dio de baja los servidores mundiales de actualización.',
        isCorrect: false,
        rejectionReason: 'Los endpoints de Windows Update responden correctamente por HTTPS.',
      },
    ],
    nextTestCommand: 'net stop wuauserv & net stop bits',
    nextTestExplanation: 'Detener los servicios de actualización para liberar los archivos de caché bloqueados.',
    rootCause: 'Archivos temporales .cab/.esd de actualización truncados por micro-cortes de conexión durante la descarga.',
    solutionSteps: [
      'Detener servicios wuauserv, cryptSvc, bits y msiserver.',
      'Renombrar SoftwareDistribution a SoftwareDistribution.old.',
      'Renombrar catroot2 a catroot2.old.',
      'Reiniciar los servicios y reintentar la búsqueda.',
    ],
    solutionCommands: [
      'net stop wuauserv & net stop bits & net stop cryptsvc',
      'ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old',
      'ren C:\\Windows\\System32\\catroot2 catroot2.old',
      'net start wuauserv & net start bits & net start cryptsvc',
    ],
    verificationProtocol: 'Windows Update busca y descarga los paquetes correctamente al 100%.',
    verificationCommand: 'Get-WindowsUpdateLog',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Si algo falla, renombrar nuevamente SoftwareDistribution.old a su nombre original.',
  },
  {
    id: 'sys-fail-10',
    title: 'Microsoft Store Rota (Error 0x80070424 / "No se puede abrir esta aplicación")',
    category: 'Sistema & Kernel',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-SYS-010',
    userSymptom: 'Al hacer clic en el icono de Microsoft Store, se abre una ventana gris que se cierra en menos de medio segundo. Ninguna aplicación UWP (Calculadora, Fotos, Terminal) funciona.',
    whatNotToAssume: 'No asumas que las aplicaciones fueron eliminadas permanentemente. El paquete manifiesto de AppX sigue en el almacén de Windows.',
    firstTestCommand: 'Get-AppxPackage *WindowsStore* | Select-Object Name, InstallLocation, PackageUserInformation',
    firstTestTool: 'PowerShell Elevado',
    testResultOutput: 'Name                   : Microsoft.WindowsStore\nInstallLocation        : C:\\Program Files\\WindowsApps\\Microsoft.WindowsStore_22405.1401.3.0_x64__8wekyb3d8bbwe\nPackageUserInformation : {S-1-5-21-... [Alumno]: Installed}',
    newEvidence: 'El paquete de la tienda existe físicamente en WindowsApps pero su registro en el perfil de usuario actual está desvinculado o corrupto.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El manifiesto AppXManifest.xml perdió el registro por usuario tras una limpieza agresiva de registro con programas "optimizadores".',
        isCorrect: true,
        confirmationReason: 'El paquete existe en disco pero el registro del AppX Deployment Service (AppXSvc) está desincronizado.',
      },
      {
        id: 'h2',
        text: 'La cuenta de Microsoft fue suspendida por fraude.',
        isCorrect: false,
        rejectionReason: 'La tienda debe abrirse en modo anónimo incluso sin cuenta de Microsoft iniciada.',
      },
    ],
    nextTestCommand: 'wsreset.exe',
    nextTestExplanation: 'Limpiar la caché de la tienda sin alterar paquetes.',
    rootCause: 'Desregistro de paquetes UWP tras ejecutar scripts de "debloat ciego" descargados de internet.',
    solutionSteps: [
      'Re-registrar todos los paquetes UWP de Windows usando el manifiesto nativo con Add-AppxPackage.',
      'Restablecer el servicio de instalación de Microsoft Store (InstallService).',
      'Ejecutar wsreset.',
    ],
    solutionCommands: [
      'Get-AppxPackage -AllUsers *WindowsStore* | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\\AppXManifest.xml"}',
      'wsreset.exe',
    ],
    verificationProtocol: 'La aplicación Microsoft Store se abre con éxito y permite buscar e instalar aplicaciones.',
    verificationCommand: 'Get-AppxPackage *WindowsStore*',
    riskLevel: 'VERDE',
    rollbackProtocol: 'El comando es idempotente: no borra datos, solo re-vincula los paquetes instalados.',
  },
  {
    id: 'sys-fail-11',
    title: 'SFC Encuentra Errores pero "No Pudo Reparar Algunos de Ellos"',
    category: 'Sistema & Kernel',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-SYS-011',
    userSymptom: 'Al correr sfc /scannow aparece el mensaje: "Protección de recursos de Windows encontró archivos dañados y no consiguió reparar algunos de ellos. Para obtener más detalles, consulte CBS.Log".',
    whatNotToAssume: 'No asumas que tu instalación está muerta. SFC no repara si el almacén de componentes local (WinSxS) de donde extrae los archivos sanos también está dañado.',
    firstTestCommand: 'findstr /c:"[SR]" %windir%\\Logs\\CBS\\CBS.log | Select-Object -Last 10',
    firstTestTool: 'CMD / PowerShell',
    testResultOutput: 'Cannot repair member file [l:10{10}]"opencl.dll" of microsoft-windows-OpenCL-Client...\nSource file in store is also corrupted.',
    newEvidence: 'El registro CBS revela que el archivo original de reemplazo dentro del almacén WinSxS también está dañado, por lo que SFC no tiene de dónde copiar una copia sana.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El almacén local de componentes (Component Store WinSxS) tiene corrupción y requiere ser restaurado en línea desde Windows Update mediante DISM.',
        isCorrect: true,
        confirmationReason: 'SFC depende jerárquicamente de la integridad de WinSxS. Si WinSxS falla, SFC no puede reparar.',
      },
      {
        id: 'h2',
        text: 'El procesador tiene un núcleo quemado.',
        isCorrect: false,
        rejectionReason: 'La corrupción de un archivo de sistema es un problema de almacenamiento lógico, no de cómputo en hardware.',
      },
    ],
    nextTestCommand: 'dism /online /cleanup-image /checkhealth',
    nextTestExplanation: 'Comprobar el estado del almacén de componentes.',
    rootCause: 'Corrupción cruzada en el almacén WinSxS por controladores gráficos que sobreescribieron opencl.dll.',
    solutionSteps: [
      'Ejecutar DISM con /RestoreHealth para descargar binarios oficiales limpios desde los servidores de Microsoft.',
      'Una vez que DISM complete al 100%, volver a ejecutar SFC /scannow.',
      'SFC ahora tendrá archivos sanos en WinSxS para sustituir los corruptos.',
    ],
    solutionCommands: [
      'dism /online /cleanup-image /restorehealth',
      'sfc /scannow',
    ],
    verificationProtocol: 'sfc /scannow devuelve: "Protección de recursos de Windows no encontró ninguna infracción de integridad".',
    verificationCommand: 'sfc /scannow',
    riskLevel: 'VERDE',
    rollbackProtocol: 'DISM descarga binarios oficiales de Microsoft; no requiere reversión.',
  },
  {
    id: 'sys-fail-12',
    title: 'DISM Falla con Error 0x800f081f ("No se encuentran los archivos de origen")',
    category: 'Sistema & Kernel',
    difficulty: 'INVESTIGADOR',
    badgeCode: 'ERR-SYS-012',
    userSymptom: 'Al ejecutar dism /online /cleanup-image /restorehealth, el comando se detiene en 62.3% con el mensaje: "Error: 0x800f081f. No se encuentran los archivos de origen".',
    whatNotToAssume: 'No asumas que tu conexión a internet no sirve. Windows Update a veces no contiene los payloads de compilaciones acumulativas específicas si hay una actualización pendiente de reinicio.',
    firstTestCommand: 'dism /online /cleanup-image /scanhealth',
    firstTestTool: 'CMD Elevado',
    testResultOutput: 'El almacén de componentes se puede reparar.\nLa operación se completó correctamente.',
    newEvidence: 'El almacén es reparable, pero los servidores de Windows Update no tienen la versión exacta del paquete delta requerido.',
    hypotheses: [
      {
        id: 'h1',
        text: 'DISM necesita una fuente local limpia (install.wim de una ISO oficial de la misma compilación) usando el modificador /source:WIM.',
        isCorrect: true,
        confirmationReason: 'Al especificar una fuente WIM offline, DISM no depende de internet ni de catálogos desincronizados.',
      },
      {
        id: 'h2',
        text: 'El disco duro está bloqueado contra escritura por BitLocker.',
        isCorrect: false,
        rejectionReason: 'DISM inicia y realiza operaciones de escaneo en la unidad.',
      },
    ],
    nextTestCommand: 'dism /get-wiminfo /wimfile:E:\\sources\\install.wim',
    nextTestExplanation: 'Identificar el índice exacto de la edición (Home / Pro) dentro de la ISO de Windows montada.',
    rootCause: 'Falta del archivo binario específico en los servidores CDN de Windows Update para la compilación UBR exacta.',
    solutionSteps: [
      'Montar la ISO oficial de Windows correspondiente a la misma versión (por ejemplo unidad E:).',
      'Localizar install.wim o install.esd en la carpeta sources.',
      'Ejecutar DISM apuntando a la fuente WIM con /LimitAccess.',
    ],
    solutionCommands: [
      'dism /online /cleanup-image /restorehealth /source:WIM:E:\\sources\\install.wim:1 /limitaccess',
      'sfc /scannow',
    ],
    verificationProtocol: 'DISM finaliza con: "La operación de restauración se completó correctamente".',
    verificationCommand: 'dism /online /cleanup-image /checkhealth',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Operación de mantenimiento nativa de solo lectura/reparación de imágenes.',
  },

  // --------------------------------------------------------------------------
  // 3. RED & CONECTIVIDAD
  // --------------------------------------------------------------------------
  {
    id: 'net-fail-13',
    title: 'Red sin Funcionar: "Sin Internet, Protegida" (Fallo de DNS / DHCP)',
    category: 'Red & Conectividad',
    difficulty: 'BÁSICO',
    badgeCode: 'ERR-NET-013',
    userSymptom: 'El icono de red muestra el globo terráqueo con el mensaje "Sin acceso a Internet". El router funciona en los teléfonos móviles pero la PC no carga ninguna página web.',
    whatNotToAssume: 'No asumas que el cable o la placa Wi-Fi se rompieron, ni llames al proveedor de internet antes de comprobar tu dirección IP local.',
    firstTestCommand: 'ipconfig /all',
    firstTestTool: 'CMD / PowerShell',
    testResultOutput: 'Adaptador de Ethernet Ethernet:\n   Dirección IPv4. . . . . . . . . . . . . . : 169.254.120.45(Preferido)\n   Máscara de subred . . . . . . . . . . . . : 255.255.0.0\n   Puerta de enlace predeterminada . . . . . : (vacío)',
    newEvidence: 'La dirección IP asignada comienza con 169.254.x.x (Rango APIPA / Automatic Private IP Addressing). La PC no recibió respuesta del servidor DHCP del router.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La pila TCP/IP o la concesión DHCP falló, o el servicio Cliente DHCP está detenido.',
        isCorrect: true,
        confirmationReason: 'Una dirección 169.254.x.x demuestra que la máquina no tiene comunicación a nivel de capa 3 con el router.',
      },
      {
        id: 'h2',
        text: 'El cable de fibra óptica transatlántico se cortó.',
        isCorrect: false,
        rejectionReason: 'El teléfono móvil conectado al mismo router navega perfectamente.',
      },
    ],
    nextTestCommand: 'ping 127.0.0.1',
    nextTestExplanation: 'Comprobar la integridad de la pila local TCP/IP (Loopback).',
    rootCause: 'Concesión DHCP caducada o caché DNS envenenada con pila Winsock desincronizada.',
    solutionSteps: [
      'Renovar la concesión de IP con ipconfig /renew.',
      'Si falla, reiniciar la pila TCP/IP y Winsock.',
      'Limpiar la caché DNS.',
    ],
    solutionCommands: [
      'ipconfig /release',
      'ipconfig /renew',
      'netsh int ip reset',
      'netsh winsock reset',
      'ipconfig /flushdns',
    ],
    verificationProtocol: 'ipconfig devuelve una dirección IP válida (ej: 192.168.1.50) y el comando ping 1.1.1.1 responde con 0% de pérdida.',
    verificationCommand: 'Test-NetConnection -ComputerName 1.1.1.1',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Las configuraciones de red vuelven a solicitarse automáticamente al router mediante DHCP.',
  },
  {
    id: 'net-fail-14',
    title: 'Wi-Fi Desaparece por Completo (No Hay Icono ni Redes Disponibles)',
    category: 'Red & Conectividad',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-NET-014',
    userSymptom: 'De un momento a otro el interruptor de Wi-Fi desapareció de la barra de tareas. En Configuración de Red solo aparece Ethernet. No muestra ninguna red disponible.',
    whatNotToAssume: 'No asumas que la tarjeta Wi-Fi M.2 interna se desoldó o se quemó.',
    firstTestCommand: 'Get-NetAdapter -IncludeHidden | Select-Object Name, InterfaceDescription, Status, DriverVersion',
    firstTestTool: 'PowerShell / Administrador de Dispositivos',
    testResultOutput: 'Name                 InterfaceDescription                 Status    DriverVersion\n----                 --------------------                 ------    -------------\nEthernet             Realtek PCIe 2.5GbE Family Controller Up        10.68.815.2023\nWi-Fi                Intel(R) Wi-Fi 6E AX211 160MHz       Disabled  22.190.0.4',
    newEvidence: 'El adaptador Wi-Fi está presente físicamente pero marcado como Disabled por un corte de energía de suspensión profunda (PCIe ASPM D3 Cold State).',
    hypotheses: [
      {
        id: 'h1',
        text: 'El controlador Wi-Fi entró en un estado de energía D3 (ASPM) del cual Windows no logró despertarlo tras suspensión.',
        isCorrect: true,
        confirmationReason: 'El hardware está listado pero en estado inactivo por administración de energía.',
      },
      {
        id: 'h2',
        text: 'La antena externa del router se desarmó.',
        isCorrect: false,
        rejectionReason: 'El problema reside en la interfaz del adaptador local de la PC, no en la señal del emisor.',
      },
    ],
    nextTestCommand: 'pnputil /restart-device (Get-PnpDevice -Class Net -FriendlyName "*Wi-Fi*").InstanceId',
    nextTestExplanation: 'Reiniciar la interfaz PCIe del dispositivo de red.',
    rootCause: 'Fallo de gestión de energía PCIe ASPM que dejó la tarjeta Wi-Fi atrapada en bajo consumo.',
    solutionSteps: [
      'Habilitar el adaptador mediante PowerShell o el Administrador de dispositivos.',
      'Desmarcar "Permitir que el equipo apague este dispositivo para ahorrar energía" en las propiedades del adaptador.',
      'Actualizar el driver Intel/Realtek Wi-Fi.',
    ],
    solutionCommands: [
      'Enable-NetAdapter -Name "Wi-Fi" -Confirm:$false',
      'Restart-NetAdapter -Name "Wi-Fi"',
    ],
    verificationProtocol: 'El icono de Wi-Fi vuelve a aparecer y se listan las redes inalámbricas del entorno.',
    verificationCommand: 'Get-NetAdapter -Name "Wi-Fi" | Select-Object Status, LinkSpeed',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Reactivar el ahorro de energía en propiedades avanzadas si se tratara de una laptop a batería.',
  },

  // --------------------------------------------------------------------------
  // 4. AUDIO & PERIFÉRICOS
  // --------------------------------------------------------------------------
  {
    id: 'aud-fail-15',
    title: 'Audio sin Funcionar: "No hay ningún dispositivo de salida de audio instalado"',
    category: 'Audio & Periféricos',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-AUD-015',
    userSymptom: 'El icono del parlante en la barra de tareas tiene una cruz roja fija. Al pasar el mouse dice: "No hay ningún dispositivo de salida de audio instalado".',
    whatNotToAssume: 'No asumas que los parlantes o auriculares están quemados ni que el chip de sonido de la placa madre se fundió.',
    firstTestCommand: 'Get-Service Audiosrv, AudioEndpointBuilder | Select-Object Name, Status, StartType',
    firstTestTool: 'PowerShell Elevado',
    testResultOutput: 'Name                 Status  StartType\n----                 ------  ---------\nAudiosrv             Stopped Automatic\nAudioEndpointBuilder Stopped Automatic',
    newEvidence: 'El servicio Windows Audio (Audiosrv) y su dependencia obligatoria Generador de extremos de audio (AudioEndpointBuilder) están detenidos.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El servicio AudioEndpointBuilder falló al consultar un controlador de audio virtual corrupto (tipo Voicemeeter o Virtual Audio Cable).',
        isCorrect: true,
        confirmationReason: 'Audiosrv depende estrictamente de AudioEndpointBuilder. Si el generador crashea por un driver virtual, todo el audio de Windows muere.',
      },
      {
        id: 'h2',
        text: 'La tarjeta madre no tiene chip Realtek.',
        isCorrect: false,
        rejectionReason: 'La placa madre tiene audio integrado que funcionaba antes de instalar software virtual.',
      },
    ],
    nextTestCommand: 'Start-Service AudioEndpointBuilder; Start-Service Audiosrv',
    nextTestExplanation: 'Intentar iniciar manualmente la cadena de servicios de audio para capturar el error exacto.',
    rootCause: 'Driver de audio virtual de terceros bloqueando la inicialización del servicio AudioEndpointBuilder.',
    solutionSteps: [
      'Iniciar AudioEndpointBuilder.',
      'Iniciar Audiosrv.',
      'Si se detienen de inmediato, desinstalar los controladores de audio virtuales en Administrador de Dispositivos.',
      'Reinstalar el controlador Realtek / High Definition Audio genérico.',
    ],
    solutionCommands: [
      'Set-Service AudioEndpointBuilder -StartupType Automatic',
      'Set-Service Audiosrv -StartupType Automatic',
      'Start-Service AudioEndpointBuilder',
      'Start-Service Audiosrv',
    ],
    verificationProtocol: 'Desaparece la cruz roja del icono del parlante y la reproducción de prueba emite sonido limpio.',
    verificationCommand: '[System.Media.SystemSounds]::Beep.Play()',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Detener los servicios si se requiere volver al estado anterior con Stop-Service.',
  },
  {
    id: 'aud-fail-16',
    title: 'Dispositivo USB No Reconocido (Descriptor Request Failed)',
    category: 'Audio & Periféricos',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-AUD-016',
    userSymptom: 'Al conectar un pendrive, mouse o teclado USB, Windows emite el sonido de desconexión y muestra: "No se reconoce el dispositivo USB. Error de solicitud de descriptor de dispositivo (Código 43)".',
    whatNotToAssume: 'No asumas que el pendrive está roto inmediatamente antes de comprobar si el bus USB xHCI se colgó por sobrecorriente.',
    firstTestCommand: 'Get-PnpDevice -Class "USB" | Where-Object {$_.Status -ne "OK"} | Select-Object FriendlyName, InstanceId, Status, Problem',
    firstTestTool: 'PowerShell / Administrador de Dispositivos',
    testResultOutput: 'FriendlyName                       InstanceId                 Status  Problem\n------------                       ----------                 ------  -------\nDispositivo USB desconocido...     USB\\VID_0000&PID_0002\\...  Error   CM_PROB_FAILED_POST_START',
    newEvidence: 'El host controller USB no pudo negociar el handshake de energía y enumeración con el dispositivo (VID y PID devuelven 0000).',
    hypotheses: [
      {
        id: 'h1',
        text: 'La suspensión selectiva de USB apagó el puerto o los condensadores del bus acumulan carga estática.',
        isCorrect: true,
        confirmationReason: 'El código 43 con VID_0000 es el clásico síntoma de fallo de negociación por carga residual o suspensión xHCI.',
      },
      {
        id: 'h2',
        text: 'Windows eliminó el soporte para memorias USB en su última actualización.',
        isCorrect: false,
        rejectionReason: 'El protocolo USB es un estándar industrial inmutable soportado en todas las builds.',
      },
    ],
    nextTestCommand: 'powercfg /GetActiveScheme',
    nextTestExplanation: 'Comprobar el plan de energía y estado de suspensión selectiva.',
    rootCause: 'Suspensión selectiva USB agresiva en el controlador raíz xHCI o carga residual en los puertos.',
    solutionSteps: [
      'Desconectar la PC de la corriente eléctrica por 60 segundos (descarga de condensadores).',
      'Desactivar "Configuración de suspensión selectiva de USB" en el plan de energía.',
      'Desinstalar el "Concentrador raíz USB (USB 3.0)" y reiniciar para que Windows lo re-enumere limpiamente.',
    ],
    solutionCommands: [
      'powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba4d5a0 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0',
      'powercfg /SETACTIVE SCHEME_CURRENT',
    ],
    verificationProtocol: 'El dispositivo USB se reconoce con su nombre, letra de unidad asignada y transferencia sin desconexiones.',
    verificationCommand: 'Get-Volume',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Volver a activar la suspensión selectiva si se necesita ahorrar batería en portátiles.',
  },
  {
    id: 'aud-fail-17',
    title: 'Cola de Impresión Detenida (Spooler Subsystem App Crashea)',
    category: 'Audio & Periféricos',
    difficulty: 'BÁSICO',
    badgeCode: 'ERR-AUD-017',
    userSymptom: 'Al intentar imprimir cualquier documento, Windows muestra: "El servicio de cola de impresión no se está ejecutando" o crashea Spoolsv.exe.',
    whatNotToAssume: 'No asumas que la impresora está desconfigurada en la red ni que el tóner está dañado.',
    firstTestCommand: 'Get-Service Spooler',
    firstTestTool: 'PowerShell / Servicios',
    testResultOutput: 'Status: Stopped, Name: Spooler, DisplayName: Cola de impresión',
    newEvidence: 'El servicio Spooler se detiene automáticamente a los 2 segundos de iniciarse porque hay un archivo de trabajo (.SHD o .SPL) corrupto atascado en el búfer de disco.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Un documento corrupto atascado en C:\\Windows\\System32\\spool\\PRINTERS hace crashear a spoolsv.exe cada vez que arranca.',
        isCorrect: true,
        confirmationReason: 'El spooler intenta parsear el archivo corrupto en memoria y sufre una excepción no controlada.',
      },
      {
        id: 'h2',
        text: 'La impresora necesita un cambio de cabezales.',
        isCorrect: false,
        rejectionReason: 'El error ocurre a nivel del servicio de software local del sistema operativo antes de mandar datos a la impresora.',
      },
    ],
    nextTestCommand: 'dir C:\\Windows\\System32\\spool\\PRINTERS',
    nextTestExplanation: 'Comprobar si existen archivos residuales atascados en la cola de impresión física.',
    rootCause: 'Trabajo de impresión mal formado (.spl / .shd) que desborda el búfer del spooler de Windows.',
    solutionSteps: [
      'Detener el servicio Spooler.',
      'Eliminar todos los archivos dentro de C:\\Windows\\System32\\spool\\PRINTERS.',
      'Iniciar nuevamente el servicio Spooler.',
    ],
    solutionCommands: [
      'net stop spooler',
      'del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*"',
      'net start spooler',
    ],
    verificationProtocol: 'El servicio Spooler se mantiene en estado "Running" y la ventana de impresoras abre sin mensajes de error.',
    verificationCommand: '(Get-Service Spooler).Status',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Los archivos borrados eran trabajos atascados; se vuelven a enviar desde el programa origen.',
  },

  // --------------------------------------------------------------------------
  // 5. ALMACENAMIENTO & ARCHIVOS
  // --------------------------------------------------------------------------
  {
    id: 'sto-fail-18',
    title: 'Disco al 100% Constante en Reposo (SysMain & Windows Search)',
    category: 'Almacenamiento & Archivos',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-STO-018',
    userSymptom: 'La PC responde con extrema lentitud. En el Administrador de Tareas la columna "Disco" marca 100% de uso continuo, con tiempo de respuesta superior a 5000 ms, sin tener ningún programa abierto.',
    whatNotToAssume: 'No asumas que el disco está infectado con un virus minero ni que tenés que comprar otra PC. Si tenés un disco mecánico HDD o un SSD SATA sin DRAM, la precarga adaptativa de SysMain y la indexación saturan las colas de I/O.',
    firstTestCommand: 'Get-Process | Sort-Object -Descending IO -ErrorAction SilentlyContinue | Select-Object -First 5 Name, Id',
    firstTestTool: 'PowerShell / Monitor de Recursos',
    testResultOutput: 'svchost (SysMain) generando 45 MB/s de lecturas aleatorias en archivos de precarga de C:\\Windows\\Prefetch.',
    newEvidence: 'El Monitor de Recursos confirma que el tiempo de respuesta supera los 4000 ms debido a peticiones aleatorias concurrentes de SysMain en una unidad con baja tasa de IOPS.',
    hypotheses: [
      {
        id: 'h1',
        text: 'SysMain (Superfetch) está diseñado para precargar programas en RAM basándose en patrones históricos, pero en unidades mecánicas HDD o SSDs de baja gama satura el canal de I/O.',
        isCorrect: true,
        confirmationReason: 'La cola de disco excede 5.0 y la latencia sube a segundos por accesos aleatorios de baja profundidad de cola.',
      },
      {
        id: 'h2',
        text: 'La placa madre no tiene soporte para SATA 3.',
        isCorrect: false,
        rejectionReason: 'El problema es la saturación de lecturas concurrentes del software, no el límite teórico del bus SATA.',
      },
    ],
    nextTestCommand: 'Stop-Service SysMain',
    nextTestExplanation: 'Detener temporalmente el servicio SysMain para observar si el uso de disco cae inmediatamente del 100% a menos del 5%.',
    rootCause: 'SysMain realizando indexación y precarga intensiva en una unidad con escasa capacidad de operaciones por segundo (IOPS).',
    solutionSteps: [
      'Si el sistema corre en HDD mecánico: Cambiar el tipo de inicio de SysMain a Manual o Deshabilitado.',
      'Si el sistema corre en SSD NVMe rápido: Mantener SysMain y desfragmentar/optimizar con TRIM mediante optimize-volume.',
    ],
    solutionCommands: [
      'Stop-Service SysMain',
      'Set-Service SysMain -StartupType Disabled',
      'Optimize-Volume -DriveLetter C -Defrag -Verbose',
    ],
    verificationProtocol: 'El uso de disco en reposo cae al 0% - 2% con tiempos de respuesta inferiores a 15 milisegundos.',
    verificationCommand: '(Get-Counter "\\PhysicalDisk(_Total)\\% Disk Time").CounterSamples.CookedValue',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Set-Service SysMain -StartupType Automatic; Start-Service SysMain para volver a habilitarlo.',
  },
  {
    id: 'sto-fail-19',
    title: 'SSD Lleno Misteriosamente (Archivos Ocultos Gigantes en C:\\)',
    category: 'Almacenamiento & Archivos',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-STO-019',
    userSymptom: 'El disco C: está marcado en rojo con solo 500 MB libres. El usuario suma el tamaño de todas sus carpetas visibles y apenas dan 80 GB en un disco de 500 GB. ¿Dónde están los otros 400 GB?',
    whatNotToAssume: 'No asumas que el disco está roto o que Windows inventa números. El espacio está ocupado por archivos de sistema ocultos protegidos: hiberfil.sys, pagefile.sys, puntos de restauración (VSS) o volcados de memoria.',
    firstTestCommand: 'vssadmin list shadowstorage',
    firstTestTool: 'CMD Elevado / TreeSize Free',
    testResultOutput: 'Espacio de almacenamiento de instantánea reservado: 120.45 GB\nEspacio de almacenamiento de instantánea usado:      118.20 GB\nEspacio máximo de almacenamiento de instantánea:    150.00 GB',
    newEvidence: 'Las instantáneas de volumen (Volume Shadow Copies / Puntos de Restauración) estaban consumiendo casi 120 GB de espacio oculto sin avisar.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El servicio de Instantáneas de Volumen (VSS) acumuló copias de seguridad de Windows Backup o puntos de restauración viejos sin purgar.',
        isCorrect: true,
        confirmationReason: 'vssadmin confirma más de 118 GB utilizados exclusivamente por copias de sombra.',
      },
      {
        id: 'h2',
        text: 'El firmware del SSD tiene un bug que borró la mitad de las celdas NAND.',
        isCorrect: false,
        rejectionReason: 'El espacio reportado por la controladora coincide; el contenido reside en archivos protegidos de Windows.',
      },
    ],
    nextTestCommand: 'powercfg /h /type reduced',
    nextTestExplanation: 'Reducir el tamaño de hiberfil.sys en un 50% conservando el inicio rápido de Windows.',
    rootCause: 'Acumulación descontrolada de instantáneas de restauración VSS y archivo de hibernación al 100% de la RAM.',
    solutionSteps: [
      'Redimensionar el límite máximo de instantáneas de volumen con vssadmin.',
      'Purgar instantáneas antiguas conservando solo la más reciente.',
      'Ajustar la hibernación con powercfg.',
    ],
    solutionCommands: [
      'vssadmin resize shadowstorage /for=C: /on=C: /maxsize=10GB',
      'vssadmin delete shadows /for=C: /oldest',
      'powercfg /h /type reduced',
    ],
    verificationProtocol: 'El disco C: libera instantáneamente más de 100 GB de espacio utilizable.',
    verificationCommand: '(Get-PSDrive C).Free / 1GB',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'vssadmin resize shadowstorage /for=C: /on=C: /maxsize=20% si se desea más espacio para copias de seguridad.',
  },

  // --------------------------------------------------------------------------
  // 6. RENDIMIENTO & LATENCIAS
  // --------------------------------------------------------------------------
  {
    id: 'prf-fail-20',
    title: 'CPU al 100% en Reposo por WmiPrvSE.exe o TiWorker.exe',
    category: 'Rendimiento & Latencias',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-PRF-020',
    userSymptom: 'Los ventiladores de la PC giran al máximo con la computadora sin usar. El Administrador de Tareas muestra "Host de proveedor WMI (WmiPrvSE.exe)" o "TiWorker.exe" consumiendo 80%-100% de la CPU constantemente.',
    whatNotToAssume: 'No mates el proceso con "Finalizar tarea", porque Windows lo reiniciará en 1 segundo. WmiPrvSE es un proveedor de telemetría: no es el culpable, sino el esclavo que atiende consultas de otra aplicación desbocada.',
    firstTestCommand: 'Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-WMI-Activity/Operational"; Id=5858} -MaxEvents 5 | Format-List Message',
    firstTestTool: 'PowerShell / Visor de Eventos',
    testResultOutput: 'Id = {00000000-0000-0000-0000-000000000000}; ClientProcessId = 4820; Operation = Start IWbemServices::ExecQuery; ResultCode = 0x80041032; PossibleCause = Dedicated query flood.',
    newEvidence: 'El evento 5858 de WMI identifica el ClientProcessId exacto (PID 4820) que está bombardeando a WMI con miles de consultas por segundo.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Un software de monitoreo de hardware o iluminación RGB de terceros (ej: Armoury Crate, iCUE, Dragon Center) tiene un bucle infinito consultando WMI.',
        isCorrect: true,
        confirmationReason: 'El ClientProcessId 4820 corresponde al ejecutable del software de control de ventiladores/RGB.',
      },
      {
        id: 'h2',
        text: 'El procesador se sobrecalentó y redujo sus núcleos.',
        isCorrect: false,
        rejectionReason: 'El consumo es medido en ciclos reales de ejecución en el espacio de usuario.',
      },
    ],
    nextTestCommand: 'Get-Process -Id 4820 | Select-Object Name, Path, CPU',
    nextTestExplanation: 'Identificar el ejecutable culpable detrás del PID 4820.',
    rootCause: 'Software de telemetría de fabricante consultando contadores WMI sin intervalo de espera (busy-wait loop).',
    solutionSteps: [
      'Aislar el proceso con el PID obtenido.',
      'Cerrar o desinstalar la utilidad de fabricante causante del desborde.',
      'Reiniciar el servicio Instrumental de administración de Windows (winmgmt).',
    ],
    solutionCommands: [
      'Stop-Process -Id 4820 -Force',
      'net stop winmgmt /y & net start winmgmt',
    ],
    verificationProtocol: 'El consumo de CPU de WmiPrvSE.exe cae por debajo del 0.5% en reposo.',
    verificationCommand: '(Get-Process WmiPrvSE | Measure-Object -Property CPU -Average).Average',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Reiniciar la aplicación si fuera estrictamente indispensable para alguna función crítica de iluminación.',
  },
  {
    id: 'prf-fail-21',
    title: 'RAM Saturada sin Programas Abiertos (Fuga en Non-Paged Pool)',
    category: 'Rendimiento & Latencias',
    difficulty: 'INVESTIGADOR',
    badgeCode: 'ERR-PRF-021',
    userSymptom: 'La PC tiene 32 GB de RAM y marca 95% de uso en reposo. En la pestaña Procesos la suma de todos los programas abiertos no supera los 3 GB. ¿Dónde están los otros 28 GB de memoria?',
    whatNotToAssume: 'No asumas que Windows es un sistema ineficiente que desperdicia la RAM. El Administrador de Tareas no suma en la pestaña Procesos la memoria usada por los controladores en Ring 0 (Non-Paged Pool).',
    firstTestCommand: 'Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory, @{N="NonPagedPoolMB";E={(Get-Counter "\\Memory\\Pool Nonpaged Bytes").CounterSamples.CookedValue / 1MB}}',
    firstTestTool: 'PowerShell / PoolMon (Windows Driver Kit)',
    testResultOutput: 'TotalVisibleMemorySize : 33482912 KB\nFreePhysicalMemory      : 1204890 KB\nNonPagedPoolMB          : 27450 MB',
    newEvidence: 'El pool no paginado (Non-Paged Pool) tiene 27.4 GB asignados permanentemente que nunca pueden enviarse al disco.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Un controlador de red o antivirus tiene una fuga de memoria (Memory Leak) asignando buffers en Ring 0 sin liberarlos con ExFreePool.',
        isCorrect: true,
        confirmationReason: 'El Non-Paged Pool normal en reposo debe rondar entre 300 MB y 800 MB. 27 GB demuestra una fuga masiva de un tag de driver.',
      },
      {
        id: 'h2',
        text: 'Los módulos de RAM están mal insertados en la ranura.',
        isCorrect: false,
        rejectionReason: 'Windows reconoce los 32 GB completos; el problema es el consumo de software del kernel.',
      },
    ],
    nextTestCommand: 'poolmon.exe -b -p (identificar el tag de 4 letras que más memoria consume)',
    nextTestExplanation: 'Localizar el Tag de asignación de memoria (ejemplo: "NDwt" de Network Data o "Etbl" de Killer Network).',
    rootCause: 'Controlador de red Killer Network / Intel con bug en el servicio de telemetría de ancho de banda xTend.',
    solutionSteps: [
      'Identificar el controlador asociado al Tag del pool (comúnmente controlador Killer Network o NDU de Windows).',
      'Desactivar el Network Data Usage Driver (NDU) en el Registro si fuera el causante.',
      'Actualizar el controlador de red al paquete OEM limpio sin suites de optimización.',
    ],
    solutionCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 4 /f',
    ],
    verificationProtocol: 'Al reiniciar el equipo, el Non-Paged Pool se estabiliza en menos de 500 MB y no vuelve a crecer con las horas.',
    verificationCommand: '(Get-Counter "\\Memory\\Pool Nonpaged Bytes").CounterSamples.CookedValue / 1MB',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 2 /f para reanudar NDU.',
  },
  {
    id: 'prf-fail-22',
    title: 'Stuttering en Juegos y Micro-Cortes de Audio por Latencia DPC / ISR',
    category: 'Rendimiento & Latencias',
    difficulty: 'INVESTIGADOR',
    badgeCode: 'ERR-PRF-022',
    userSymptom: 'Juegos con 180 FPS experimentan congelamientos de 50 ms cada pocos segundos (micro-stuttering) y el audio de Discord o Spotify se escucha con chasquidos y "crackle" digital.',
    whatNotToAssume: 'No asumas que la GPU o la CPU no tienen suficiente potencia. Los micro-cortes ocurren cuando un controlador tarda más de 1000 µs en resolver una llamada de interrupción diferida (DPC).',
    firstTestCommand: 'LatencyMon (Monitorear durante 60 segundos de reproducción)',
    firstTestTool: 'LatencyMon de Resplendence',
    testResultOutput: 'CONCLUSION: Your system appears to be having difficulty handling real-time audio and other tasks. You may experience buffer underruns, dropouts or audio clicks.\nHighest DPC routine execution time: 4210 µs in wdf01000.sys / ACPI.sys / storport.sys',
    newEvidence: 'LatencyMon registra picos de 4.2 ms en el subsistema de controladores WDF o gestión de energía ACPI.sys.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La tarjeta de red inalámbrica, controlador de almacenamiento o el plan de energía agresivo de la placa madre fuerza transiciones C-State que demoran las interrupciones.',
        isCorrect: true,
        confirmationReason: 'Picos de DPC superiores a 1000 µs demuestran contención en el despachador de interrupciones del kernel.',
      },
      {
        id: 'h2',
        text: 'El disco está desfragmentado.',
        isCorrect: false,
        rejectionReason: 'La latencia DPC es un fenómeno de tiempo real de CPU y controladores, no de lectura secuencial de disco.',
      },
    ],
    nextTestCommand: 'powercfg /SETACTIVE 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c',
    nextTestExplanation: 'Activar el plan de Alto Rendimiento para evitar saltos agresivos de frecuencia del procesador durante llamadas DPC.',
    rootCause: 'Controlador de red Wi-Fi o tarjeta gráfica con modo de interrupción tradicional (Line-Based INTx) en lugar de MSI (Message Signaled-Based Interrupts).',
    solutionSteps: [
      'Habilitar el modo Message Signaled-Based Interrupts (MSI Mode) en la GPU y placa de red con la herramienta MSI Mode Tool.',
      'Configurar el plan de energía para evitar caídas de reloj en PCIe.',
      'Desactivar controladores virtuales no utilizados.',
    ],
    solutionCommands: [
      'powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c',
      'Disable-PnpDevice -InstanceId (Get-PnpDevice -FriendlyName "*Virtual Adapter*").InstanceId -Confirm:$false',
    ],
    verificationProtocol: 'LatencyMon reporta: "Your system appears suitable for handling real-time audio without dropouts" con DPC máxima inferior a 500 µs.',
    verificationCommand: 'Write-Output "DPC Latency Audit Completed"',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Volver al plan de energía Equilibrado con powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e.',
  },
  {
    id: 'prf-fail-23',
    title: 'DWM.exe (Desktop Window Manager) con Consumo Alto de GPU o RAM',
    category: 'Rendimiento & Latencias',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-PRF-023',
    userSymptom: 'El Administrador de Ventanas del Escritorio (dwm.exe) consume más de 3 GB de RAM o 40% de GPU de forma constante en reposo, haciendo que la interfaz gráfica se sienta pesada.',
    whatNotToAssume: 'No intentes desactivar DWM. En Windows 10 y 11, DWM es el compositor gráfico fundamental del sistema; no se puede apagar sin romper todo el entorno visual.',
    firstTestCommand: 'Get-Process dwm | Select-Object Name, Id, WorkingSet64, PM',
    firstTestTool: 'PowerShell / Task Manager',
    testResultOutput: 'Name: dwm, Id: 1140, WorkingSet64: 3840291024 (3.84 GB)',
    newEvidence: 'DWM tiene una fuga en los buffers de renderizado DirectX por un controlador de pantalla de Intel o NVIDIA desactualizado.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Un bug de fuga de memoria en la interacción entre la programación de GPU acelerada por hardware (HAGS) y el driver de video acumula texturas en dwm.exe.',
        isCorrect: true,
        confirmationReason: 'DWM escala su huella de memoria con cada ventana abierta y cerrada sin liberar los descriptores DirectX.',
      },
      {
        id: 'h2',
        text: 'El monitor tiene una tasa de refresco muy alta que la PC no aguanta.',
        isCorrect: false,
        rejectionReason: 'La tasa de refresco define la frecuencia de escaneo, no la fuga de memoria en bytes del compositor.',
      },
    ],
    nextTestCommand: 'Get-ItemProperty "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" -Name HwSchMode',
    nextTestExplanation: 'Comprobar si Hardware Accelerated GPU Scheduling está activo.',
    rootCause: 'Incompatibilidad de memoria compartida entre el driver gráfico y el compositor de ventanas de Windows.',
    solutionSteps: [
      'Reiniciar el proceso DWM con Ctrl + Shift + Win + B (reinicio del subsistema de pantalla).',
      'Actualizar el controlador gráfico a la última versión certificada WHQL.',
      'Si el problema persiste, desactivar temporalmente la programación de GPU acelerada por hardware (HAGS).',
    ],
    solutionCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 1 /f',
    ],
    verificationProtocol: 'dwm.exe se estabiliza consumiendo entre 50 MB y 150 MB de memoria RAM en reposo.',
    verificationCommand: '(Get-Process dwm).WorkingSet64 / 1MB',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Reactivar HAGS con valor 2 en el Registro.',
  },
  {
    id: 'prf-fail-24',
    title: 'Apagado y Encendido Lento (Fast Startup Corrupto / Kernel Hibernación)',
    category: 'Rendimiento & Latencias',
    difficulty: 'BÁSICO',
    badgeCode: 'ERR-PRF-024',
    userSymptom: 'La PC tarda más de 2 minutos en apagarse (los ventiladores y luces siguen prendidos aunque la pantalla esté negra) y al encender tarda el triple que antes.',
    whatNotToAssume: 'No asumas que el disco está dañado. Casi siempre es el archivo de inicio rápido (Fast Startup / hiberfil.sys) que no logra volcar la sesión del kernel.',
    firstTestCommand: 'Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-Diagnostics-Performance/Operational"; Id=200} -MaxEvents 3',
    firstTestTool: 'PowerShell / Visor de Eventos',
    testResultOutput: 'Id: 200 (Shutdown Performance Diagnostics)\nShutdownDuration: 135890 ms (135 segundos)\nIsSlowShutdown: True\nDegradation: Kernel session hibernation write latency.',
    newEvidence: 'El evento 200 de diagnóstico de rendimiento demuestra que el 90% del tiempo de apagado se gasta en escribir la memoria en el archivo de hibernación hiberfil.sys.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La función Inicio Rápido (Fast Startup) está guardando una sesión de kernel sucia o corrupta, ralentizando tanto el guardado como la restauración.',
        isCorrect: true,
        confirmationReason: 'Al apagar, Windows no apaga realmente el kernel: lo hiberna. Si hay controladores bloqueando la suspensión, el apagado se congela.',
      },
      {
        id: 'h2',
        text: 'La tecla de encendido del gabinete tiene falso contacto.',
        isCorrect: false,
        rejectionReason: 'El sistema operativo recibe la orden de apagado y procesa el evento por 135 segundos.',
      },
    ],
    nextTestCommand: 'powercfg /h off',
    nextTestExplanation: 'Desactivar la hibernación y forzar un apagado limpio del kernel de Windows.',
    rootCause: 'Fast Startup guardando estados de drivers inconsistentes en el archivo hiberfil.sys.',
    solutionSteps: [
      'Desactivar el Inicio Rápido en las opciones de energía del Panel de Control.',
      'O desactivar la hibernación mediante la consola con powercfg /h off.',
      'Reiniciar el equipo para que Windows cargue un kernel 100% limpio en cada arranque.',
    ],
    solutionCommands: [
      'powercfg /h off',
      'powercfg /h on /type reduced',
    ],
    verificationProtocol: 'El equipo se apaga en menos de 10 segundos y enciende con el tiempo de arranque basal de hardware.',
    verificationCommand: '(Get-CimInstance Win32_OperatingSystem).LastBootUpTime',
    riskLevel: 'VERDE',
    rollbackProtocol: 'powercfg /h on si se desea reactivar la hibernación completa.',
  },
];
