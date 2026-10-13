// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS FAILURE & REPAIR LAB — DATA REPOSITORY (SIMULATED DATA)
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

export interface FailureTimelineStep {
  time: string;
  label: string;
  description: string;
  type: 'STABLE' | 'ANOMALY' | 'DEGRADATION' | 'FAILURE' | 'EVIDENCE';
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

  // Timeline específica por caso (SIMULATED)
  timeline: FailureTimelineStep[];
  
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
    whatNotToAssume: 'No asumir fallo físico del disco SSD/NVMe ni necesidad de formatear sin comprobar primero la evidencia del controlador de almacenamiento y del BCD.',
    timeline: [
      { time: 'T-60s', label: 'UEFI POST', description: 'Firmware UEFI inicializa el bus PCIe y detecta dispositivos de almacenamiento.', type: 'STABLE' },
      { time: 'T-30s', label: 'CONFIG ALMACENAMIENTO', description: 'Modo de la controladora SATA/NVMe configurado en el firmware (VMD/AHCI).', type: 'ANOMALY' },
      { time: 'T-10s', label: 'BOOTLOADER', description: 'Winload.efi lee la estructura BCD y transfiere ejecución a ntoskrnl.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'INACCESSIBLE_BOOT_DEVICE', description: 'El kernel no logra montar el volumen de sistema C: durante la fase 1.', type: 'FAILURE' },
      { time: 'T+10s', label: 'WINRE RECOVERY', description: 'Entorno de recuperación invocado tras fallo de montaje de la partición.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'bcdedit /enum {current}',
    firstTestTool: 'Consola de Recuperación WinRE',
    testResultOutput: 'identifier {current}\ndevice partition=C:\npath \\Windows\\system32\\winload.efi\nosdevice partition=C:\nsystemroot \\Windows',
    newEvidence: 'La configuración BCD y la ruta a winload.efi en C: son válidas y legibles desde WinRE. (Nota: La razón de la falta de acceso en la fase 1 del kernel permanece como hipótesis pendiente de comprobación).',
    hypotheses: [
      {
        id: 'h1',
        text: 'El disco tiene sectores defectuosos irreparables y perdió la tabla de particiones.',
        isCorrect: false,
        rejectionReason: 'La partición C: fue montada y leída con éxito por WinRE mediante el comando bcdedit.',
      },
      {
        id: 'h2',
        text: 'El BIOS/UEFI cambió el modo de la controladora a VMD / RAID deshabilitando el controlador genérico de almacenamiento StorNVMe.',
        isCorrect: true,
        confirmationReason: 'Una actualización de BIOS o cambio de pila CMOS activó VMD/RAID, ocultando los volúmenes nativos al controlador de arranque del kernel.',
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
    rootCause: 'El firmware UEFI restableció el modo de almacenamiento a VMD/RAID tras un corte de energía o reseteo de CMOS, impidiendo que el controlador de arranque lea la partición del sistema.',
    solutionSteps: [
      'Ingresar al menú de configuración UEFI / BIOS (F2 o Supr).',
      'Navegar a Advanced -> Storage Configuration / VMD Setup.',
      'Desactivar VMD Controller (o cambiar de RAID a AHCI / NVMe nativo).',
      'Guardar cambios con F10 y reiniciar el equipo.',
    ],
    solutionCommands: [
      'bcdedit /set {default} safeboot minimal',
      'shutdown /r /t 0',
      'bcdedit /deletevalue {default} safeboot',
    ],
    verificationProtocol: 'El sistema bootea directamente al escritorio en el entorno simulado sin invocar la pantalla de recuperación.',
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
    whatNotToAssume: 'No asumir daño irreversible en la instalación antes de examinar los registros de diagnóstico de la reparación automática (SrtTrail.txt).',
    timeline: [
      { time: 'T-60s', label: 'INICIO DE SESIÓN', description: 'Carga inicial de controladores del núcleo y servicios de arranque temprano.', type: 'STABLE' },
      { time: 'T-30s', label: 'CARGA DE DRIVER', description: 'Carga de controlador firmado de inicio temprano (ELAM).', type: 'ANOMALY' },
      { time: 'T-10s', label: 'EXCEPCIÓN EN KERNEL', description: 'Fallo de integridad en binario de controlador crítico.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'BOOT LOOP', description: 'Trigger de Reparación Automática fallida y reinicio cíclico.', type: 'FAILURE' },
      { time: 'T+10s', label: 'LOG GENERADO', description: 'SrtTrail.txt registra el archivo que provocó el cese de arranque.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'type X:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt',
    firstTestTool: 'SrtTrail.txt en WinRE',
    testResultOutput: 'Causa principal encontrada:\n---------------------------\nArchivo crítico de arranque c:\\windows\\system32\\drivers\\amdkmpfd.sys está dañado.\nCódigo de error = 0x57',
    newEvidence: 'El registro de reparación SrtTrail.txt identifica específicamente un controlador de pantalla/dispositivo firmado con código de error 0x57.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La partición EFI está corrupta y necesita recrearse por completo.',
        isCorrect: false,
        rejectionReason: 'El bootloader inicia y lanza la secuencia de Windows; el fallo ocurre en la carga de drivers.',
      },
      {
        id: 'h2',
        text: 'Un controlador de inicio temprano (Boot-start driver) tiene su binario truncado o corrupto.',
        isCorrect: true,
        confirmationReason: 'SrtTrail.txt identifica la ruta exacta del archivo corrupto con código de error 0x57.',
      },
      {
        id: 'h3',
        text: 'La memoria RAM está en corto circuito.',
        isCorrect: false,
        rejectionReason: 'El registro de SrtTrail apunta a un archivo específico en disco, no a corrupción errática de memoria.',
      },
    ],
    nextTestCommand: 'ren C:\\Windows\\System32\\drivers\\amdkmpfd.sys amdkmpfd.sys.bak',
    nextTestExplanation: 'Aislar el controlador renombrándolo para que el kernel cargue el controlador de respaldo básico.',
    rootCause: 'Driver de arranque temprano con binario truncado por apagado abrupto previo.',
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
    whatNotToAssume: 'No asumir pérdida de datos personales ni fallo físico del disco. El BCD es una base de datos de arranque de bajo tamaño ubicada en la partición ESP.',
    timeline: [
      { time: 'T-60s', label: 'POST UEFI', description: 'Inicialización de hardware y localización de partición EFI FAT32.', type: 'STABLE' },
      { time: 'T-30s', label: 'LECTURA BCD', description: 'Windows Boot Manager intenta abrir la colmena \\EFI\\Microsoft\\Boot\\BCD.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'STATUS_OBJECT_NOT_FOUND', description: 'El archivo BCD está ausente o truncado por apagado abrupto.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'ERROR 0xc0000034', description: 'Pantalla de recuperación BCD por datos de arranque no válidos.', type: 'FAILURE' },
      { time: 'T+10s', label: 'MODO CONSOLA', description: 'WinRE listo para diagnóstico y reconstrucción del almacén.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'bcdedit',
    firstTestTool: 'CMD en Entorno de Recuperación',
    testResultOutput: 'No se pudo abrir el almacén de datos de la configuración de arranque (BCD).\nEl sistema no puede encontrar el archivo especificado.',
    newEvidence: 'El comando bcdedit confirma la falta o inaccesibilidad del almacén BCD en la partición del sistema.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La partición EFI de 100 MB perdió el archivo BCD o la colmena está corrupta.',
        isCorrect: true,
        confirmationReason: 'bcdedit devuelve error al no encontrar la colmena de configuración.',
      },
      {
        id: 'h2',
        text: 'El procesador no soporta instrucciones x64.',
        isCorrect: false,
        rejectionReason: 'El código 0xc0000034 es un estado STATUS_OBJECT_NAME_NOT_FOUND de acceso a archivo de sistema.',
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
    whatNotToAssume: 'No asumir que no existe entorno de rescate ni que se requiere reinstalar el sistema operativo.',
    timeline: [
      { time: 'T-60s', label: 'SOLICITUD WINRE', description: 'Usuario solicita reinicio avanzado desde la interfaz de Windows.', type: 'STABLE' },
      { time: 'T-30s', label: 'CONSULTA BCD', description: 'El sistema consulta la ubicación de la imagen de recuperación Winre.wim.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'ESTADO DESHABILITADO', description: 'El registro BCD no contiene el puntero GUID a la imagen WIM.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'REINICIO NORMAL', description: 'Windows omite la secuencia de recuperación y reinicia normalmente.', type: 'FAILURE' },
      { time: 'T+10s', label: 'DIAGNÓSTICO REAGENTC', description: 'reagentc /info reporta estado Disabled.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'reagentc /info',
    firstTestTool: 'PowerShell / CMD Elevado',
    testResultOutput: 'Información sobre la configuración del entorno de recuperación de Windows (WinRE):\n    Estado de WinRE:         Disabled\n    Ubicación de WinRE:      \n    Identificador de datos BCD: 00000000-0000-0000-0000-000000000000',
    newEvidence: 'reagentc confirma que WinRE está deshabilitado y el puntero a Winre.wim está vacío.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La partición de recuperación fue modificada o el archivo Winre.wim quedó desacoplado del BCD.',
        isCorrect: true,
        confirmationReason: 'La herramienta reagentc reporta estado Disabled y ruta vacía.',
      },
      {
        id: 'h2',
        text: 'La licencia de Windows expiró.',
        isCorrect: false,
        rejectionReason: 'El estado de activación no afecta la disponibilidad de la imagen WIM de recuperación.',
      },
    ],
    nextTestCommand: 'dir /a C:\\Windows\\System32\\Recovery',
    nextTestExplanation: 'Comprobar si Winre.wim reside localmente en la carpeta de recuperación de System32.',
    rootCause: 'Desacoplamiento de la imagen Winre.wim tras actualización de parches de seguridad.',
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
    rollbackProtocol: 'reagentc /disable para volver al estado inicial si fuera requerido.',
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
    whatNotToAssume: 'No asumir fallo físico del monitor ni del controlador gráfico: la movilidad del cursor demuestra que el compositor gráfico (DWM) está operativo.',
    timeline: [
      { time: 'T-60s', label: 'AUTENTICACIÓN', description: 'Winlogon autentica correctamente las credenciales del usuario.', type: 'STABLE' },
      { time: 'T-30s', label: 'CONVOCATORIA SHELL', description: 'Winlogon consulta la clave de registro del Shell de inicio de sesión.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'AUSENCIA EXPLORER', description: 'El proceso explorer.exe no es invocado o se cierra inmediatamente.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'PANTALLA NEGRA', description: 'Escritorio sin renderizar; solo el cursor responde sobre el lienzo negro.', type: 'FAILURE' },
      { time: 'T+10s', label: 'TASK MANAGER OK', description: 'Ctrl+Shift+Esc abre el Administrador de Tareas correctamente.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'cmd /k tasklist | findstr "explorer.exe"',
    firstTestTool: 'Administrador de Tareas / Consola',
    testResultOutput: '(vacío - no hay ningún proceso explorer.exe en ejecución)',
    newEvidence: 'Se verifica la ausencia de explorer.exe en la lista de procesos activos tras el inicio de sesión.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La clave de registro Winlogon Shell fue modificada o borrada.',
        isCorrect: true,
        confirmationReason: 'La clave HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\\Shell debe contener explorer.exe.',
      },
      {
        id: 'h2',
        text: 'La GPU se quemó por completo.',
        isCorrect: false,
        rejectionReason: 'El cursor y el Administrador de Tareas se renderizan sin problemas en pantalla.',
      },
    ],
    nextTestCommand: 'reg query "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" /v Shell',
    nextTestExplanation: 'Comprobar el valor del shell de inicio de sesión.',
    rootCause: 'Valor de Shell en el Registro alterado o borrado.',
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
    whatNotToAssume: 'No asumir infección irrecuperable por malware antes de comprobar eventos de choque en extensiones del shell (.dll).',
    timeline: [
      { time: 'T-60s', label: 'INICIO EXPLORER', description: 'Explorer.exe se ejecuta e invoca las extensiones registradas del menú contextual.', type: 'STABLE' },
      { time: 'T-30s', label: 'CARGA SHELLEX', description: 'Carga de bibliotecas DLL de terceros registradas en el shell.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'ACCESS VIOLATION', description: 'Excepción 0xc0000005 en una extensión de menú contextual.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'REINICIO BUCLE', description: 'Fallo de segmento en explorer.exe y reinicio continuo del proceso.', type: 'FAILURE' },
      { time: 'T+10s', label: 'EVENT ID 1000', description: 'El Visor de Eventos registra la DLL responsable del choque.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-WinEvent -FilterHashtable @{LogName="Application"; ProviderName="Application Error"} -MaxEvents 5 | Format-List TimeCreated, Message',
    firstTestTool: 'PowerShell / Visor de Eventos',
    testResultOutput: 'Nombre de la aplicación con errores: explorer.exe\nNombre del módulo con errores: ShellExtensionOverlay.dll\nCódigo de excepción: 0xc0000005 (Access Violation)',
    newEvidence: 'El evento 1000 identifica la DLL específica (ShellExtensionOverlay.dll) que genera el choque en el proceso explorer.exe.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Una extensión ShellEx de terceros provoca una excepción de memoria en Explorer.',
        isCorrect: true,
        confirmationReason: 'El código 0xc0000005 en la DLL dentro del espacio de memoria de explorer.exe.',
      },
      {
        id: 'h2',
        text: 'Corrupción masiva en ntdll.dll.',
        isCorrect: false,
        rejectionReason: 'El módulo con error reportado es la DLL de extensión de terceros, no un binario del núcleo.',
      },
    ],
    nextTestCommand: 'ShellExView o desregistro manual de la DLL',
    nextTestExplanation: 'Desregistrar la DLL responsable o desinstalar la aplicación dueña del menú contextual.',
    rootCause: 'Extensión de shell de software de terceros incompatible con la compilación actual.',
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
    whatNotToAssume: 'No asumir pérdida de archivos personales: el directorio C:\\Users\\TuNombre se mantiene en disco; el fallo reside en la colmena del Registro.',
    timeline: [
      { time: 'T-60s', label: 'LECTURA PERFIL', description: 'ProfSvc consulta la ruta del perfil asociada al SID del usuario.', type: 'STABLE' },
      { time: 'T-30s', label: 'NTUSER.DAT BLOQUEADO', description: 'El archivo de colmena NTUSER.DAT no se puede abrir con acceso exclusivo.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'RESPALDO .BAK', description: 'Windows renombra la clave SID agregando extensión .bak y crea perfil TEMP.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'PERFIL TEMPORAL', description: 'Inicio de sesión completado en directorio temporal C:\\Users\\TEMP.', type: 'FAILURE' },
      { time: 'T+10s', label: 'PROFILELIST REG', description: 'Consulta del Registro confirma clave duplicada con .bak.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'whoami /user',
    firstTestTool: 'CMD / PowerShell',
    testResultOutput: 'Nombre de usuario: DESKTOP-PC\\Usuario\nSID: S-1-5-21-3829103812-2938472910-1001',
    newEvidence: 'El SID del usuario actual está activo bajo un perfil temporal mientras existe la colmena original en disco.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Existe una clave de perfil con extensión .bak en HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList.',
        isCorrect: true,
        confirmationReason: 'Windows genera la entrada .bak cuando encuentra el archivo NTUSER.DAT retido durante el apagado.',
      },
      {
        id: 'h2',
        text: 'El disco C está destruido físicamente.',
        isCorrect: false,
        rejectionReason: 'El perfil temporal C:\\Users\\TEMP se crea y escribe en el mismo disco sin errores.',
      },
    ],
    nextTestCommand: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList"',
    nextTestExplanation: 'Comprobar si existe la clave S-1-5-21-...-1001.bak.',
    rootCause: 'El hive NTUSER.DAT quedó retenido por un proceso previo durante el apagado, forzando la creación de un perfil temporal.',
    solutionSteps: [
      'Abrir regedit como Administrador.',
      'Ir a HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList.',
      'Localizar la clave con el SID del usuario que tiene extensión .bak.',
      'Si existe una clave idéntica sin .bak que apunta a TEMP, borrarla.',
      'Quitar el sufijo .bak a la clave original.',
      'Reiniciar el equipo.',
    ],
    solutionCommands: [
      'Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\\*" | Select-Object ProfileImagePath, State',
    ],
    verificationProtocol: 'Al reiniciar, el usuario entra a su cuenta normal con sus archivos y entorno restaurados.',
    verificationCommand: '$env:USERPROFILE',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Hacer exportación previa de la rama ProfileList con reg export.',
  },
  {
    id: 'sys-fail-08',
    title: 'BSOD Pantalla Azul Crítica (IRQL_NOT_LESS_OR_EQUAL)',
    category: 'Sistema & Kernel',
    difficulty: 'INVESTIGADOR',
    badgeCode: 'ERR-SYS-008',
    userSymptom: 'Pantalla azul de repente mientras se usa la PC: "Detención: IRQL_NOT_LESS_OR_EQUAL". El sistema genera un volcado de memoria minidump y reinicia.',
    whatNotToAssume: 'No asumir corrupción en ntoskrnl.exe aunque el visor de eventos lo señale: ntoskrnl es el punto donde se atrapa la excepción de un controlador desobediente.',
    timeline: [
      { time: 'T-60s', label: 'EJECUCIÓN KERNEL', description: 'Procesamiento de hilos del sistema en Ring 0.', type: 'STABLE' },
      { time: 'T-30s', label: 'ELEVACIÓN IRQL', description: 'Un controlador eleva el nivel de interrupción a DISPATCH_LEVEL.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'PAGING FAULT', description: 'Intento de acceso a memoria paginable en un IRQL no permitido.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'BSOD STOP 0x0A', description: 'Comprobación de error IRQL_NOT_LESS_OR_EQUAL ejecutada por el kernel.', type: 'FAILURE' },
      { time: 'T+10s', label: 'MINIDUMP GUARDADO', description: 'Volcado de memoria generado en C:\\Windows\\Minidump.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-ChildItem C:\\Windows\\Minidump -Filter *.dmp | Sort-Object LastWriteTime -Descending | Select-Object -First 1',
    firstTestTool: 'PowerShell / WinDbg Preview',
    testResultOutput: 'Directorio: C:\\Windows\\Minidump\nNombre: 100326-14521-01.dmp\nFecha: 03/10/2026 09:22:15\nTamaño: 2.45 MB',
    newEvidence: 'El análisis del volcado con !analyze -v muestra: MODULE_NAME: nvlddmkm, FAILURE_BUCKET_ID: AV_nvlddmkm!unknown_function.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Un controlador de dispositivo intentó acceder a una dirección de memoria no válida en IRQL elevado.',
        isCorrect: true,
        confirmationReason: 'El volcado Minidump aísla formalmente el hilo en la biblioteca del controlador de pantalla.',
      },
      {
        id: 'h2',
        text: 'Fallo absoluto de la fuente de alimentación.',
        isCorrect: false,
        rejectionReason: 'Un fallo eléctrico genera apagado instantáneo sin volcado de memoria o WHEA_UNCORRECTABLE_ERROR.',
      },
    ],
    nextTestCommand: 'Get-WmiObject Win32_PnPSignedDriver | Where-Object {$_.DeviceName -like "*NVIDIA*"} | Select-Object DeviceName, DriverVersion',
    nextTestExplanation: 'Comprobar versión del controlador instalado actualmente.',
    rootCause: 'Controlador de pantalla con conflicto en la gestión de memoria de interrupción.',
    solutionSteps: [
      'Descargar el controlador oficial estable WHQL.',
      'Desinstalar el controlador en Modo Seguro.',
      'Reinstalar el controlador limpio.',
    ],
    solutionCommands: [
      'pnputil /enum-drivers | findstr "oem nvld"',
      'sfc /scannow',
    ],
    verificationProtocol: 'Ausencia de eventos BSOD registrados en el Visor de Eventos tras prueba de carga.',
    verificationCommand: 'Get-WinEvent -FilterHashtable @{LogName="System"; Id=1001} -MaxEvents 5',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Crear Punto de Restauración antes de instalar el nuevo controlador.',
  },
  {
    id: 'sys-fail-09',
    title: 'Windows Update Roto (Error 0x80070002 / 0x80248007 en Descarga)',
    category: 'Sistema & Kernel',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-SYS-009',
    userSymptom: 'Al buscar actualizaciones, el progreso se queda en 0% o llega al 99% y tira el error 0x80070002 o 0x80248007. No avanza nunca.',
    whatNotToAssume: 'No asumir necesidad de reinstalar Windows ni de usar limpiadores de terceros.',
    timeline: [
      { time: 'T-60s', label: 'BÚSQUEDA UPDATE', description: 'Servicio wuauserv consulta el catálogo de actualizaciones.', type: 'STABLE' },
      { time: 'T-30s', label: 'DESCARGA CAB/ESD', description: 'Descarga de paquetes en C:\\Windows\\SoftwareDistribution\\Download.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'SUMA SHA-256 MISMATCH', description: 'El paquete descargado parcialmente no coincide con la firma del manifiesto.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'ERROR 0x80070002', description: 'El servicio rechaza aplicar el paquete por archivos no encontrados o corruptos.', type: 'FAILURE' },
      { time: 'T+10s', label: 'LOG DE UPDATE', description: 'WindowsUpdate.log registra el fallo de validación de firma del paquete.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-Service wuauserv, cryptSvc, bits, trustedinstaller | Select-Object Name, Status, StartType',
    firstTestTool: 'PowerShell Elevado',
    testResultOutput: 'Name              Status   StartType\n----              ------   ---------\nwuauserv          Running  Manual\ncryptSvc          Running  Automatic\nbits              Stopped  Manual\ntrustedinstaller  Running  Manual',
    newEvidence: 'La carpeta SoftwareDistribution contiene archivos parciales con inconsistencias de hash.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La base de datos de caché en C:\\Windows\\SoftwareDistribution\\Download tiene paquetes corruptos.',
        isCorrect: true,
        confirmationReason: 'La firma del paquete no concuerda y el servicio rechaza escribir encima.',
      },
      {
        id: 'h2',
        text: 'Microsoft dio de baja los servidores de actualización.',
        isCorrect: false,
        rejectionReason: 'Los endpoints de actualización responden correctamente por HTTPS.',
      },
    ],
    nextTestCommand: 'net stop wuauserv & net stop bits',
    nextTestExplanation: 'Detener los servicios de actualización para liberar la caché bloqueada.',
    rootCause: 'Archivos temporales de actualización truncados por micro-cortes de conexión durante la descarga.',
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
    rollbackProtocol: 'Renombrar nuevamente SoftwareDistribution.old a su nombre original si fuera necesario.',
  },
  {
    id: 'sys-fail-10',
    title: 'Microsoft Store Rota (Error 0x80070424 / "No se puede abrir esta aplicación")',
    category: 'Sistema & Kernel',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-SYS-010',
    userSymptom: 'Al hacer clic en el icono de Microsoft Store, se abre una ventana gris que se cierra en menos de medio segundo. Ninguna aplicación UWP funciona.',
    whatNotToAssume: 'No asumir que las aplicaciones se borraron permanentemente: el manifiesto de AppX sigue en el almacén de Windows.',
    timeline: [
      { time: 'T-60s', label: 'EJECUCIÓN APPX', description: 'Invocación de la aplicación UWP mediante el protocolo appx.', type: 'STABLE' },
      { time: 'T-30s', label: 'CONSULTA MANIFIESTO', description: 'AppXSvc verifica el registro del paquete por usuario.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'DESSINCRO DE REGISTRO', description: 'Falta la entrada de registro de paquete en la colmena del usuario.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'CIERRE INMEDIATO', description: 'La ventana UWP se cierra sin código de error visible.', type: 'FAILURE' },
      { time: 'T+10s', label: 'APPX PACKAGE OK', description: 'Get-AppxPackage demuestra que el paquete existe en disco.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-AppxPackage *WindowsStore* | Select-Object Name, InstallLocation, PackageUserInformation',
    firstTestTool: 'PowerShell Elevado',
    testResultOutput: 'Name                   : Microsoft.WindowsStore\nInstallLocation        : C:\\Program Files\\WindowsApps\\Microsoft.WindowsStore_22405.1401.3.0_x64__8wekyb3d8bbwe\nPackageUserInformation : {S-1-5-21-... [Usuario]: Installed}',
    newEvidence: 'El paquete de la tienda existe físicamente en WindowsApps pero su vinculación de registro con el usuario actual está dañada.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El manifiesto AppXManifest.xml perdió el registro por usuario tras una limpieza de registro.',
        isCorrect: true,
        confirmationReason: 'El paquete existe en disco pero el registro de AppXSvc está desincronizado.',
      },
      {
        id: 'h2',
        text: 'La cuenta de usuario fue bloqueada por fraude.',
        isCorrect: false,
        rejectionReason: 'La tienda debe abrirse en modo anónimo sin requerir cuenta iniciada.',
      },
    ],
    nextTestCommand: 'wsreset.exe',
    nextTestExplanation: 'Limpiar la caché de la tienda sin alterar paquetes.',
    rootCause: 'Desregistro de paquetes UWP tras ejecutar scripts de optimización no verificados.',
    solutionSteps: [
      'Re-registrar los paquetes UWP usando el manifiesto nativo con Add-AppxPackage.',
      'Restablecer el servicio de instalación de Microsoft Store.',
      'Ejecutar wsreset.',
    ],
    solutionCommands: [
      'Get-AppxPackage -AllUsers *WindowsStore* | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\\AppXManifest.xml"}',
      'wsreset.exe',
    ],
    verificationProtocol: 'La aplicación Microsoft Store se abre con éxito y permite navegar.',
    verificationCommand: 'Get-AppxPackage *WindowsStore*',
    riskLevel: 'VERDE',
    rollbackProtocol: 'El comando re-vincula paquetes sin borrar datos.',
  },
  {
    id: 'sys-fail-11',
    title: 'SFC Encuentra Errores pero "No Pudo Reparar Algunos de Ellos"',
    category: 'Sistema & Kernel',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-SYS-011',
    userSymptom: 'Al correr sfc /scannow aparece el mensaje: "Protección de recursos de Windows encontró archivos dañados y no consiguió reparar algunos de ellos. Para obtener más detalles, consulte CBS.Log".',
    whatNotToAssume: 'No asumir que la instalación está inservible: SFC falla cuando el almacén de componentes local (WinSxS) de respaldo también está dañado.',
    timeline: [
      { time: 'T-60s', label: 'ESCANEO SFC', description: 'System File Checker compara los hashes de los archivos de sistema contra WinSxS.', type: 'STABLE' },
      { time: 'T-30s', label: 'DISCREPANCIA HASH', description: 'Se detecta un archivo de sistema alterado o truncado.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'WINSXS CORRUPTO', description: 'SFC intenta copiar la versión sana desde WinSxS pero el respaldo también está dañado.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'FALLO REPARACIÓN SFC', description: 'SFC reporta que no pudo reparar los archivos afectados.', type: 'FAILURE' },
      { time: 'T+10s', label: 'CBS.LOG GENERADO', description: 'El registro CBS.log identifica el archivo miembro afectado.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'findstr /c:"[SR]" %windir%\\Logs\\CBS\\CBS.log | Select-Object -Last 10',
    firstTestTool: 'CMD / PowerShell',
    testResultOutput: 'Cannot repair member file [l:10{10}]"opencl.dll" of microsoft-windows-OpenCL-Client...\nSource file in store is also corrupted.',
    newEvidence: 'El registro CBS revela que el archivo original de reemplazo dentro del almacén WinSxS también está dañado.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El almacén local de componentes (WinSxS) está dañado y requiere ser restaurado en línea mediante DISM.',
        isCorrect: true,
        confirmationReason: 'SFC depende jerárquicamente de la integridad de WinSxS.',
      },
      {
        id: 'h2',
        text: 'El procesador tiene un núcleo quemado.',
        isCorrect: false,
        rejectionReason: 'La corrupción de un archivo de sistema es un problema de almacenamiento lógico.',
      },
    ],
    nextTestCommand: 'dism /online /cleanup-image /checkhealth',
    nextTestExplanation: 'Comprobar el estado del almacén de componentes.',
    rootCause: 'Corrupción en el almacén WinSxS por sobreescritura de bibliotecas de sistema.',
    solutionSteps: [
      'Ejecutar DISM con /RestoreHealth para descargar binarios limpios.',
      'Una vez que DISM complete, volver a ejecutar SFC /scannow.',
    ],
    solutionCommands: [
      'dism /online /cleanup-image /restorehealth',
      'sfc /scannow',
    ],
    verificationProtocol: 'sfc /scannow devuelve: "Protección de recursos de Windows no encontró ninguna infracción de integridad".',
    verificationCommand: 'sfc /scannow',
    riskLevel: 'VERDE',
    rollbackProtocol: 'DISM descarga binarios oficiales de Microsoft sin alterar datos de usuario.',
  },
  {
    id: 'sys-fail-12',
    title: 'DISM Falla con Error 0x800f081f ("No se encuentran los archivos de origen")',
    category: 'Sistema & Kernel',
    difficulty: 'INVESTIGADOR',
    badgeCode: 'ERR-SYS-012',
    userSymptom: 'Al ejecutar dism /online /cleanup-image /restorehealth, el comando se detiene en 62.3% con el mensaje: "Error: 0x800f081f. No se encuentran los archivos de origen".',
    whatNotToAssume: 'No asumir fallo de la conexión a internet: Windows Update no contiene los deltas de compilaciones específicas si la versión difiere.',
    timeline: [
      { time: 'T-60s', label: 'EJECUCIÓN DISM', description: 'DISM consulta el almacén WinSxS local y calcula componentes faltantes.', type: 'STABLE' },
      { time: 'T-30s', label: 'CONEXIÓN WU', description: 'DISM intenta solicitar los paquetes limpios a los servidores de Windows Update.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'ORIGEN NO ENCONTRADO', description: 'Los servidores CDN no entregan el paquete acumulativo exacto solicitado.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'ERROR 0x800f081f', description: 'DISM se detiene al no contar con la fuente de archivos de origen.', type: 'FAILURE' },
      { time: 'T+10s', label: 'DISM.LOG GENERADO', description: 'Dism.log registra la falta del paquete delta de reemplazo.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'dism /online /cleanup-image /scanhealth',
    firstTestTool: 'CMD Elevado',
    testResultOutput: 'El almacén de componentes se puede reparar.\nLa operación se completó correctamente.',
    newEvidence: 'El almacén de componentes se reporta como reparable, pero requiere una fuente explícita de archivos.',
    hypotheses: [
      {
        id: 'h1',
        text: 'DISM requiere una fuente local de archivos limpia (install.wim de la misma compilación) usando /source:WIM.',
        isCorrect: true,
        confirmationReason: 'Al especificar una fuente WIM offline, DISM no depende de catálogos desincronizados de red.',
      },
      {
        id: 'h2',
        text: 'El disco duro está bloqueado contra escritura por BitLocker.',
        isCorrect: false,
        rejectionReason: 'DISM inicia y realiza operaciones de lectura en la unidad.',
      },
    ],
    nextTestCommand: 'dism /get-wiminfo /wimfile:E:\\sources\\install.wim',
    nextTestExplanation: 'Identificar el índice exacto de la edición dentro de la ISO de Windows montada.',
    rootCause: 'Falta del paquete delta específico en los servidores de actualización para la compilación UBR exacta.',
    solutionSteps: [
      'Montar la ISO oficial de Windows correspondiente a la misma versión (unidad E:).',
      'Localizar install.wim en la carpeta sources.',
      'Ejecutar DISM apuntando a la fuente WIM con /LimitAccess.',
    ],
    solutionCommands: [
      'dism /online /cleanup-image /restorehealth /source:WIM:E:\\sources\\install.wim:1 /limitaccess',
      'sfc /scannow',
    ],
    verificationProtocol: 'DISM finaliza con: "La operación de restauración se completó correctamente".',
    verificationCommand: 'dism /online /cleanup-image /checkhealth',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Operación de mantenimiento de solo lectura y reparación de imágenes.',
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
    whatNotToAssume: 'No asumir fallo del cable de red ni de la placa Wi-Fi antes de verificar la secuencia diagnóstica de dirección IP, gateway y DNS.',
    timeline: [
      { time: 'T-60s', label: 'LINK FÍSICO', description: 'Capa 1/2 sincronizada: Adaptador Ethernet conectado a 1 Gbps.', type: 'STABLE' },
      { time: 'T-30s', label: 'DHCP DISCOVER', description: 'La PC envía solicitud DHCP Discover al router.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'ASIGNACIÓN APIPA', description: 'Al no recibir respuesta DHCP ACK, Windows asigna IP privada automática 169.254.x.x.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'SIN ACCESO INTERNET', description: 'Sin puerta de enlace predeterminada válida asignada.', type: 'FAILURE' },
      { time: 'T+10s', label: 'NCSI REPORT', description: 'El indicador de conectividad de red reporta estado limitado.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'ipconfig /all',
    firstTestTool: 'CMD / PowerShell',
    testResultOutput: 'Adaptador de Ethernet Ethernet:\n   Dirección IPv4. . . . . . . . . . . . . . : 169.254.120.45(Preferido)\n   Máscara de subred . . . . . . . . . . . . : 255.255.0.0\n   Puerta de enlace predeterminada . . . . . : (vacío)',
    newEvidence: 'ipconfig /all reporta una dirección 169.254.x.x (APIPA) y puerta de enlace vacía, confirmando la falta de concesión DHCP de capa 3.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La concesión DHCP falló o la pila TCP/IP / Winsock se encuentra desincronizada.',
        isCorrect: true,
        confirmationReason: 'La dirección 169.254.x.x es asignada automáticamente por Windows cuando la negociación DHCP no recibe respuesta.',
      },
      {
        id: 'h2',
        text: 'El cable de fibra óptica del proveedor fue destruido.',
        isCorrect: false,
        rejectionReason: 'Otros dispositivos en la misma red local navegan normalmente a través del mismo router.',
      },
    ],
    nextTestCommand: 'ping 127.0.0.1 & ping 192.168.1.1',
    nextTestExplanation: 'Comprobar la integridad de la pila local TCP/IP (Loopback) y el alcance a la puerta de enlace predeterminada.',
    rootCause: 'Concesión DHCP no renovada y caché de direcciones envenenada en la pila Winsock.',
    solutionSteps: [
      'Liberar la concesión actual con ipconfig /release.',
      'Solicitar nueva concesión de IP con ipconfig /renew.',
      'Restablecer la pila TCP/IP y Winsock.',
      'Limpiar la caché DNS.',
    ],
    solutionCommands: [
      'ipconfig /release',
      'ipconfig /renew',
      'netsh int ip reset',
      'netsh winsock reset',
      'ipconfig /flushdns',
    ],
    verificationProtocol: 'ipconfig devuelve una IP local válida (ej: 192.168.1.50) y el ping a un servidor externo responde con 0% de pérdida.',
    verificationCommand: 'Test-NetConnection -ComputerName 1.1.1.1',
    riskLevel: 'VERDE',
    rollbackProtocol: 'La configuración de red vuelve a solicitarse automáticamente al router vía DHCP.',
  },
  {
    id: 'net-fail-14',
    title: 'Wi-Fi Desaparece por Completo (No Hay Icono ni Redes Disponibles)',
    category: 'Red & Conectividad',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-NET-014',
    userSymptom: 'De un momento a otro el interruptor de Wi-Fi desapareció de la barra de tareas. En Configuración de Red solo aparece Ethernet. No muestra ninguna red disponible.',
    whatNotToAssume: 'No asumir que la tarjeta Wi-Fi M.2 interna se desoldó o destruyó.',
    timeline: [
      { time: 'T-60s', label: 'SUSPENSIÓN', description: 'El equipo ingresa en suspensión profunda de energía (Sleep D3).', type: 'STABLE' },
      { time: 'T-30s', label: 'REANUDACIÓN PCIe', description: 'El kernel intenta reactivar el adaptador Wi-Fi en el bus PCIe.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'ESTADO D3 COLD', description: 'El controlador no responde al evento de encendido y queda inactivo.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'INTERFAZ DESAPARECIDA', description: 'Windows deshabilita la interfaz al no recibir respuesta del hardware.', type: 'FAILURE' },
      { time: 'T+10s', label: 'STATUS DISABLED', description: 'Get-NetAdapter reporta la interfaz inalámbrica en estado Disabled.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-NetAdapter -IncludeHidden | Select-Object Name, InterfaceDescription, Status, DriverVersion',
    firstTestTool: 'PowerShell / Administrador de Dispositivos',
    testResultOutput: 'Name                 InterfaceDescription                 Status    DriverVersion\n----                 --------------------                 ------    -------------\nEthernet             Realtek PCIe 2.5GbE Family Controller Up        10.68.815.2023\nWi-Fi                Adaptador Inalámbrico Wi-Fi 6        Disabled  22.190.0.4',
    newEvidence: 'El adaptador Wi-Fi está presente físicamente pero en estado Disabled por administración de energía de PCIe.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El controlador Wi-Fi quedó en un estado de bajo consumo D3 (ASPM) tras la suspensión.',
        isCorrect: true,
        confirmationReason: 'El hardware figura listado pero inactivo por la política de ahorro de energía del bus.',
      },
      {
        id: 'h2',
        text: 'La antena del emisor Wi-Fi se desarmó.',
        isCorrect: false,
        rejectionReason: 'El problema reside en el estado del adaptador local de la PC.',
      },
    ],
    nextTestCommand: 'Restart-NetAdapter -Name "Wi-Fi"',
    nextTestExplanation: 'Reiniciar la interfaz del dispositivo de red.',
    rootCause: 'Fallo de gestión de energía PCIe ASPM que dejó la tarjeta Wi-Fi atrapada en estado inactivo.',
    solutionSteps: [
      'Habilitar el adaptador mediante PowerShell o Administrador de dispositivos.',
      'Desmarcar la opción de ahorro de energía en las propiedades del adaptador.',
      'Actualizar el controlador del adaptador inalámbrico.',
    ],
    solutionCommands: [
      'Enable-NetAdapter -Name "Wi-Fi" -Confirm:$false',
      'Restart-NetAdapter -Name "Wi-Fi"',
    ],
    verificationProtocol: 'El icono de Wi-Fi vuelve a aparecer y se listan las redes inalámbricas disponibles.',
    verificationCommand: 'Get-NetAdapter -Name "Wi-Fi" | Select-Object Status, LinkSpeed',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Reactivar el ahorro de energía si fuera requerido en portátiles a batería.',
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
    whatNotToAssume: 'No asumir fallo físico del chip de sonido ni de los parlantes antes de verificar el estado de los servicios de audio.',
    timeline: [
      { time: 'T-60s', label: 'SERVICIO AUDIOSRV', description: 'Servicio Windows Audio ejecutándose en sesión de servicio local.', type: 'STABLE' },
      { time: 'T-30s', label: 'ENUMERACIÓN ENDPOINTS', description: 'AudioEndpointBuilder consulta la lista de dispositivos de salida registrados.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'EXCEPCIÓN EN DRIVER', description: 'Fallo de respuesta al consultar un dispositivo de reproducción.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'SERVICIOS DETENIDOS', description: 'AudioEndpointBuilder y Audiosrv se detienen automáticamente.', type: 'FAILURE' },
      { time: 'T+10s', label: 'CRUZ ROJA EN ICONO', description: 'La barra de tareas muestra la cruz roja por falta de servicio de audio.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-Service Audiosrv, AudioEndpointBuilder | Select-Object Name, Status, StartType',
    firstTestTool: 'PowerShell Elevado',
    testResultOutput: 'Name                 Status  StartType\n----                 ------  ---------\nAudiosrv             Stopped Automatic\nAudioEndpointBuilder Stopped Automatic',
    newEvidence: 'Get-Service confirma que el servicio Windows Audio (Audiosrv) y AudioEndpointBuilder están en estado Stopped.',
    hypotheses: [
      {
        id: 'h1',
        text: 'El servicio AudioEndpointBuilder falló al consultar un controlador o endpoint de audio atascado.',
        isCorrect: true,
        confirmationReason: 'Audiosrv depende de AudioEndpointBuilder. Si el generador de extremos falla, todo el subsistema de sonido se detiene.',
      },
      {
        id: 'h2',
        text: 'La placa madre carece de circuito de sonido.',
        isCorrect: false,
        rejectionReason: 'El equipo disponía de audio funcional previo a la detención del servicio.',
      },
    ],
    nextTestCommand: 'Start-Service AudioEndpointBuilder; Start-Service Audiosrv',
    nextTestExplanation: 'Intentar iniciar manualmente la cadena de servicios de audio.',
    rootCause: 'Detención del servicio AudioEndpointBuilder por inconsistencia en la enumeración de dispositivos.',
    solutionSteps: [
      'Iniciar AudioEndpointBuilder.',
      'Iniciar Audiosrv.',
      'Si se detienen de inmediato, revisar y actualizar los controladores de dispositivos de salida en el Administrador de Dispositivos.',
      'Reinstalar el controlador de audio predeterminado.',
    ],
    solutionCommands: [
      'Set-Service AudioEndpointBuilder -StartupType Automatic',
      'Set-Service Audiosrv -StartupType Automatic',
      'Start-Service AudioEndpointBuilder',
      'Start-Service Audiosrv',
    ],
    verificationProtocol: 'Desaparece la cruz roja del icono de sonido y la reproducción de prueba emite audio correctamente.',
    verificationCommand: '[System.Media.SystemSounds]::Beep.Play()',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Detener los servicios si se requiere volver al estado previo.',
  },
  {
    id: 'aud-fail-16',
    title: 'Dispositivo USB No Reconocido (Descriptor Request Failed)',
    category: 'Audio & Periféricos',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-AUD-016',
    userSymptom: 'Al conectar un dispositivo USB, Windows muestra: "No se reconoce el dispositivo USB. Error de solicitud de descriptor de dispositivo (Código 43)".',
    whatNotToAssume: 'No asumir daño permanente del periférico antes de comprobar el estado de suspensión del controlador xHCI.',
    timeline: [
      { time: 'T-60s', label: 'INSERCIÓN USB', description: 'Periférico conectado a un puerto USB 3.0/xHCI.', type: 'STABLE' },
      { time: 'T-30s', label: 'NEGOCIACIÓN BUS', description: 'El host controller intenta leer el descriptor del dispositivo.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'FAIL DESCRIPTOR', description: 'Fallo en el handshake de energía y enumeración (VID/PID 0000).', type: 'DEGRADATION' },
      { time: 'T=0', label: 'CÓDIGO 43', description: 'El Administrador de Dispositivos reporta la falla de enumeración.', type: 'FAILURE' },
      { time: 'T+10s', label: 'PNP DEVICE ERROR', description: 'Get-PnpDevice registra el estado de error en el controlador raíz.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-PnpDevice -Class "USB" | Where-Object {$_.Status -ne "OK"} | Select-Object FriendlyName, InstanceId, Status, Problem',
    firstTestTool: 'PowerShell / Administrador de Dispositivos',
    testResultOutput: 'FriendlyName                       InstanceId                 Status  Problem\n------------                       ----------                 ------  -------\nDispositivo USB desconocido...     USB\\VID_0000&PID_0002\\...  Error   CM_PROB_FAILED_POST_START',
    newEvidence: 'Get-PnpDevice confirma la presencia del error de enumeración con identificadores VID/PID vacíos (0000).',
    hypotheses: [
      {
        id: 'h1',
        text: 'La suspensión selectiva del puerto USB o carga estática residual impide la lectura del descriptor.',
        isCorrect: true,
        confirmationReason: 'El código 43 con identificador VID_0000 es síntoma característico de suspensión xHCI o fallo de handshake de energía.',
      },
      {
        id: 'h2',
        text: 'Windows eliminó la compatibilidad con USB.',
        isCorrect: false,
        rejectionReason: 'El estándar USB es soportado de forma nativa e inalterable.',
      },
    ],
    nextTestCommand: 'powercfg /GetActiveScheme',
    nextTestExplanation: 'Comprobar el plan de energía y el estado de la suspensión selectiva USB.',
    rootCause: 'Suspensión selectiva USB activa en el controlador xHCI o carga estática acumulada en los puertos.',
    solutionSteps: [
      'Desconectar el equipo de la corriente eléctrica por 60 segundos para liberar carga estática.',
      'Desactivar la "Configuración de suspensión selectiva de USB" en las opciones de energía.',
      'Desinstalar el Concentrador raíz USB en el Administrador de Dispositivos y reiniciar.',
    ],
    solutionCommands: [
      'powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba4d5a0 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0',
      'powercfg /SETACTIVE SCHEME_CURRENT',
    ],
    verificationProtocol: 'El dispositivo USB se reconoce correctamente con su identificador y estado OK.',
    verificationCommand: 'Get-Volume',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Volver a activar la suspensión selectiva si fuera requerido.',
  },
  {
    id: 'aud-fail-17',
    title: 'Cola de Impresión Detenida (Spooler Subsystem App Crashea)',
    category: 'Audio & Periféricos',
    difficulty: 'BÁSICO',
    badgeCode: 'ERR-AUD-017',
    userSymptom: 'Al intentar imprimir cualquier documento, Windows muestra: "El servicio de cola de impresión no se está ejecutando" o crashea Spoolsv.exe.',
    whatNotToAssume: 'No asumir fallo en la impresora ni en la conexión de red antes de inspeccionar los archivos atascados en el búfer local.',
    timeline: [
      { time: 'T-60s', label: 'ENVÍO TRABAJO', description: 'Documento enviado a la cola de impresión local.', type: 'STABLE' },
      { time: 'T-30s', label: 'PARSEO EN BÚFER', description: 'Spoolsv.exe lee los archivos .SHD/.SPL en C:\\Windows\\System32\\spool\\PRINTERS.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'TRABAJO CORRUPTO', description: 'Estructura mal formada en el archivo de trabajo provoca excepción.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'SPOOLER STOPPED', description: 'El servicio Spooler se detiene al intentar procesar el archivo.', type: 'FAILURE' },
      { time: 'T+10s', label: 'SPOOLER SERVICE STATUS', description: 'Get-Service reporta el servicio Spooler en estado Stopped.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-Service Spooler',
    firstTestTool: 'PowerShell / Servicios',
    testResultOutput: 'Status: Stopped, Name: Spooler, DisplayName: Cola de impresión',
    newEvidence: 'Get-Service confirma que el servicio Spooler se encuentra detenido.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Un archivo de trabajo corrupto en la carpeta de búfer de impresión hace crashear a spoolsv.exe.',
        isCorrect: true,
        confirmationReason: 'Spooler falla al parsear archivos corruptos presentes en la carpeta de cola de impresión.',
      },
      {
        id: 'h2',
        text: 'La impresora no tiene papel.',
        isCorrect: false,
        rejectionReason: 'El error ocurre en el servicio de software del sistema operativo antes de comunicarse con el dispositivo.',
      },
    ],
    nextTestCommand: 'dir C:\\Windows\\System32\\spool\\PRINTERS',
    nextTestExplanation: 'Comprobar si existen archivos residuales atascados en la carpeta de búfer de impresión.',
    rootCause: 'Archivo de trabajo (.spl / .shd) mal formado atascado en el directorio de la cola de impresión.',
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
    verificationProtocol: 'El servicio Spooler permanece en estado "Running" y la cola abre sin mensajes de error.',
    verificationCommand: '(Get-Service Spooler).Status',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Reenviar el documento desde la aplicación de origen.',
  },

  // --------------------------------------------------------------------------
  // 5. ALMACENAMIENTO & ARCHIVOS
  // --------------------------------------------------------------------------
  {
    id: 'sto-fail-18',
    title: 'Disco al 100% Constante en Reposo (SysMain & Indexación)',
    category: 'Almacenamiento & Archivos',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-STO-018',
    userSymptom: 'La PC responde con lentitud. En el Administrador de Tareas la columna "Disco" marca 100% de uso continuo en reposo.',
    whatNotToAssume: 'No asumir infección por malware ni fallo físico de la unidad antes de comprobar la actividad de I/O de los servicios de precarga e indexación.',
    timeline: [
      { time: 'T-60s', label: 'REPOSO SISTEMA', description: 'El sistema no registra aplicaciones de usuario abiertas.', type: 'STABLE' },
      { time: 'T-30s', label: 'ACTIVIDAD SYSMAIN', description: 'SysMain realiza lecturas aleatorias para la precarga de aplicaciones.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'LATENCIA ALTA', description: 'Tiempo de respuesta de disco supera los 3000 ms por accesos concurrentes.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'DISCO AL 100%', description: 'Cola de peticiones de I/O saturada al 100%.', type: 'FAILURE' },
      { time: 'T+10s', label: 'PREFETCH I/O REPORT', description: 'Monitor de Recursos registra altas lecturas en la carpeta Prefetch.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-Process | Sort-Object -Descending IO -ErrorAction SilentlyContinue | Select-Object -First 5 Name, Id',
    firstTestTool: 'PowerShell / Monitor de Recursos',
    testResultOutput: 'svchost (SysMain) generando lecturas continuas en la carpeta de precarga de C:\\Windows\\Prefetch.',
    newEvidence: 'El Monitor de Recursos identifica al servicio SysMain generando peticiones aleatorias continuas de I/O.',
    hypotheses: [
      {
        id: 'h1',
        text: 'SysMain está realizando precarga intensiva de datos en una unidad con reducida capacidad de IOPS.',
        isCorrect: true,
        confirmationReason: 'La cola de lectura de SysMain satura el tiempo de respuesta de la unidad.',
      },
      {
        id: 'h2',
        text: 'El controlador SATA no soporta velocidad de 6 Gbps.',
        isCorrect: false,
        rejectionReason: 'El cuello de botella es producido por la cantidad de peticiones aleatorias, no por el ancho de banda del bus.',
      },
    ],
    nextTestCommand: 'Stop-Service SysMain',
    nextTestExplanation: 'Detener temporalmente SysMain para evaluar si el uso de disco cae a valores normales.',
    rootCause: 'Servicio SysMain realizando tareas de precarga intensiva en una unidad mecánica HDD con reducida tasa de IOPS.',
    solutionSteps: [
      'CUÁNDO APLICA: Exclusivamente en discos rígidos mecánicos HDD (baja tasa de IOPS).',
      'CUÁNDO NO APLICA: En unidades SSD NVMe o SATA modernas (donde no penaliza I/O y acelera la precarga).',
      'Si el sistema corre en HDD mecánico: Configurar SysMain en inicio Manual o Deshabilitado.',
      'Optimizar el volumen mediante el desfragmentador/TRIM de Windows (Optimize-Volume).',
    ],
    solutionCommands: [
      'Stop-Service SysMain',
      'Set-Service SysMain -StartupType Disabled',
      'Optimize-Volume -DriveLetter C -Defrag -Verbose',
    ],
    verificationProtocol: 'El uso de disco en reposo disminuye a valores inferiores al 5%.',
    verificationCommand: '(Get-Counter "\\PhysicalDisk(_Total)\\% Disk Time").CounterSamples.CookedValue',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Set-Service SysMain -StartupType Automatic para volver a habilitarlo.',
  },
  {
    id: 'sto-fail-19',
    title: 'Disco Lleno (Archivos Ocultos / Instantáneas de Volumen VSS)',
    category: 'Almacenamiento & Archivos',
    difficulty: 'INTERMEDIO',
    badgeCode: 'ERR-STO-019',
    userSymptom: 'El disco C: muestra poco espacio libre sin que la suma de carpetas de usuario justifique la ocupación total.',
    whatNotToAssume: 'No asumir fallo de lectura del disco ni errores en la tabla de asignación antes de inspeccionar el almacenamiento reservado por el sistema (VSS, hibernación, depuración).',
    timeline: [
      { time: 'T-60s', label: 'USO DE DISCO', description: 'Lectura normal del volumen de sistema C:.', type: 'STABLE' },
      { time: 'T-30s', label: 'CREACIÓN INSTANTÁNEAS', description: 'VSS acumula puntos de restauración sin purga automática.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'RESERVA SHADOW', description: 'El almacenamiento reservado para VSS alcanza el límite máximo permitido.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'ALERTA ESPACIO ROJO', description: 'El Explorador de archivos marca el disco C: en rojo por bajo espacio.', type: 'FAILURE' },
      { time: 'T+10s', label: 'VSSADMIN REPORT', description: 'vssadmin reporta la cantidad exacta de GB consumidos por copias de sombra.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'vssadmin list shadowstorage',
    firstTestTool: 'CMD Elevado / TreeSize Free',
    testResultOutput: 'Espacio de almacenamiento de instantánea reservado: 120 GB\nEspacio de almacenamiento de instantánea usado:      118 GB\nEspacio máximo de almacenamiento de instantánea:    150 GB',
    newEvidence: 'vssadmin confirma la ocupación de 118 GB por almacenamiento de instantáneas de volumen (VSS).',
    hypotheses: [
      {
        id: 'h1',
        text: 'El servicio VSS acumuló instantáneas de restauración sin purgar el almacenamiento reservado.',
        isCorrect: true,
        confirmationReason: 'vssadmin muestra 118 GB consumidos explícitamente por instantáneas de sombra.',
      },
      {
        id: 'h2',
        text: 'El firmware del disco perdió celdas de memoria.',
        isCorrect: false,
        rejectionReason: 'La ocupación está asignada a archivos y estructuras válidas del sistema de archivos.',
      },
    ],
    nextTestCommand: 'powercfg /h /type reduced',
    nextTestExplanation: 'Ajustar el tamaño del archivo hiberfil.sys conservando el inicio rápido.',
    rootCause: 'Límite de reserva de VSS elevado y acumulación de puntos de restauración no purgados.',
    solutionSteps: [
      'Ajustar el límite máximo de almacenamiento para VSS.',
      'Eliminar instantáneas antiguas.',
      'Ajustar el tamaño de hibernación con powercfg.',
    ],
    solutionCommands: [
      'vssadmin resize shadowstorage /for=C: /on=C: /maxsize=10GB',
      'vssadmin delete shadows /for=C: /oldest',
      'powercfg /h /type reduced',
    ],
    verificationProtocol: 'Se libera espacio en el volumen C: tras la purga de instantáneas.',
    verificationCommand: '(Get-PSDrive C).Free / 1GB',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Reajustar el tamaño máximo de VSS con vssadmin resize shadowstorage si fuera necesario.',
  },

  // --------------------------------------------------------------------------
  // 6. RENDIMIENTO & LATENCIAS
  // --------------------------------------------------------------------------
  {
    id: 'prf-fail-20',
    title: 'CPU al 100% en Reposo por WmiPrvSE.exe',
    category: 'Rendimiento & Latencias',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-PRF-020',
    userSymptom: 'Los ventiladores giran al máximo sin aplicaciones de usuario abiertas. El proceso "Host de proveedor WMI (WmiPrvSE.exe)" muestra alto uso de CPU.',
    whatNotToAssume: 'No finalizar de forma abrupta el proceso WmiPrvSE.exe: es un proveedor de infraestructura que atiende peticiones de otras aplicaciones.',
    timeline: [
      { time: 'T-60s', label: 'SERVICIO WINMGMT', description: 'Infraestructura de WMI atendiendo solicitudes de consultas de sistema.', type: 'STABLE' },
      { time: 'T-30s', label: 'CONSULTAS REPETITIVAS', description: 'Una aplicación cliente realiza consultas WMI continuas en bucle.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'SATURACIÓN PROVEEDOR', description: 'WmiPrvSE procesa miles de solicitudes por segundo elevando el uso de CPU.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'CPU AL 100%', description: 'Uso de CPU saturado en el Administrador de Tareas.', type: 'FAILURE' },
      { time: 'T+10s', label: 'WMI EVENT 5858', description: 'El registro operacional de WMI identifica el PID del cliente solicitante.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-WMI-Activity/Operational"; Id=5858} -MaxEvents 5 | Format-List Message',
    firstTestTool: 'PowerShell / Visor de Eventos',
    testResultOutput: 'Id = {00000000-0000-0000-0000-000000000000}; ClientProcessId = 4820; Operation = Start IWbemServices::ExecQuery; ResultCode = 0x80041032; PossibleCause = Dedicated query flood.',
    newEvidence: 'El evento 5858 de WMI identifica el PID (4820) de la aplicación que realiza las consultas continuas.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Una aplicación de terceros realiza consultas WMI continuas sin intervalo de espera.',
        isCorrect: true,
        confirmationReason: 'ClientProcessId 4820 aísla el proceso emisor de las consultas desbocadas.',
      },
      {
        id: 'h2',
        text: 'El procesador redujo permanentemente su frecuencia.',
        isCorrect: false,
        rejectionReason: 'El consumo es registrado en tiempo de ejecución por instrucciones de espacio de usuario.',
      },
    ],
    nextTestCommand: 'Get-Process -Id 4820 | Select-Object Name, Path, CPU',
    nextTestExplanation: 'Identificar el nombre del ejecutable correspondiente al PID 4820.',
    rootCause: 'Aplicación cliente enviando consultas WMI sin pausa en tiempo de ejecución.',
    solutionSteps: [
      'Aislar el proceso con el PID obtenido.',
      'Cerrar o actualizar la aplicación responsable.',
      'Reiniciar el servicio Instrumental de administración de Windows (winmgmt).',
    ],
    solutionCommands: [
      'Stop-Process -Id 4820 -Force',
      'net stop winmgmt /y & net start winmgmt',
    ],
    verificationProtocol: 'El uso de CPU por parte de WmiPrvSE.exe retorna a niveles basales.',
    verificationCommand: '(Get-Process WmiPrvSE | Measure-Object -Property CPU -Average).Average',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Iniciar la aplicación cliente si sus funciones fueran requeridas.',
  },
  {
    id: 'prf-fail-21',
    title: 'RAM Saturada sin Programas Abiertos (Fuga en Non-Paged Pool)',
    category: 'Rendimiento & Latencias',
    difficulty: 'INVESTIGADOR',
    badgeCode: 'ERR-PRF-021',
    userSymptom: 'El sistema marca alto porcentaje de uso de RAM en reposo, mientras la suma de procesos de usuario en pantalla no justifica dicho consumo.',
    whatNotToAssume: 'No asumir falla física en los módulos de memoria RAM: la memoria del Kernel (Non-Paged Pool) no se contabiliza individualmente en la pestaña de procesos de usuario.',
    timeline: [
      { time: 'T-60s', label: 'ASIGNACIÓN POOL', description: 'Controladores del kernel solicitan bloques de memoria en Ring 0.', type: 'STABLE' },
      { time: 'T-30s', label: 'FUGA DE MEMORIA', description: 'Un controlador asigna memoria sin invocar la función de liberación ExFreePool.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'NON-PAGED POOL HIGH', description: 'El grupo de memoria no paginable supera valores normales de reposo.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'RAM AL 95%', description: 'Saturación de memoria RAM física del sistema.', type: 'FAILURE' },
      { time: 'T+10s', label: 'POOLMON COUNTER', description: 'Contador de bytes no paginables confirma la acumulación en el Kernel.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory, @{N="NonPagedPoolMB";E={(Get-Counter "\\Memory\\Pool Nonpaged Bytes").CounterSamples.CookedValue / 1MB}}',
    firstTestTool: 'PowerShell / PoolMon',
    testResultOutput: 'TotalVisibleMemorySize : 33482912 KB\nFreePhysicalMemory      : 1204890 KB\nNonPagedPoolMB          : 27450 MB',
    newEvidence: 'El contador del sistema registra 27.4 GB asignados en el grupo de memoria no paginable (Non-Paged Pool).',
    hypotheses: [
      {
        id: 'h1',
        text: 'Un controlador de dispositivo tiene una fuga de memoria asignando bloques en el Non-Paged Pool.',
        isCorrect: true,
        confirmationReason: 'El Non-Paged Pool normal en reposo ronda entre 300 MB y 800 MB.',
      },
      {
        id: 'h2',
        text: 'Módulos de memoria RAM desconectados.',
        isCorrect: false,
        rejectionReason: 'El sistema operativo reconoce la capacidad total instalada.',
      },
    ],
    nextTestCommand: 'poolmon.exe -b -p',
    nextTestExplanation: 'Identificar el Tag de asignación de memoria de 4 letras con mayor volumen asignado.',
    rootCause: 'Controlador de dispositivo acumulando asignaciones en el Non-Paged Pool sin liberarlas.',
    solutionSteps: [
      'Identificar el controlador asociado al Tag obtenido.',
      'Desactivar la función del controlador afectada en el Registro si aplica.',
      'Actualizar el controlador a la versión oficial estable.',
    ],
    solutionCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Ndu" /v Start /t REG_DWORD /d 4 /f',
    ],
    verificationProtocol: 'Al reiniciar el equipo, el Non-Paged Pool se estabiliza en valores normales.',
    verificationCommand: '(Get-Counter "\\Memory\\Pool Nonpaged Bytes").CounterSamples.CookedValue / 1MB',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Restablecer el valor de inicio del servicio en el Registro con reg add.',
  },
  {
    id: 'prf-fail-22',
    title: 'Stuttering y Micro-Cortes de Audio por Latencia DPC / ISR',
    category: 'Rendimiento & Latencias',
    difficulty: 'INVESTIGADOR',
    badgeCode: 'ERR-PRF-022',
    userSymptom: 'Micro-congelamientos esporádicos y chasquidos de audio en reproducción multimedia durante tareas intensivas.',
    whatNotToAssume: 'No asumir falta de potencia en CPU/GPU antes de medir los tiempos de ejecución de las llamadas DPC/ISR de los controladores.',
    timeline: [
      { time: 'T-60s', label: 'INTERRUPCIONES ISR', description: 'Dispositivos de hardware generan interrupciones de tiempo real.', type: 'STABLE' },
      { time: 'T-30s', label: 'COLA DPC', description: 'El kernel programa rutinas DPC (Deferred Procedure Call) para su procesamiento.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'LATENCIA > 1000µs', description: 'Un controlador excede el tiempo máximo de procesamiento por llamada DPC.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'MICRO-CUT / STUTTER', description: 'Buffer underrun en el subsistema de audio y retraso en renderizado.', type: 'FAILURE' },
      { time: 'T+10s', label: 'DPC LATENCY REPORT', description: 'Auditoría de latencia registra picos superiores a 3000 µs.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'LatencyMon (Auditoría de latencia de controladores)',
    firstTestTool: 'LatencyMon / WDT',
    testResultOutput: 'Highest DPC routine execution time: 4210 µs in wdf01000.sys / ACPI.sys / storport.sys',
    newEvidence: 'La herramienta de medición registra tiempos de ejecución DPC de 4.2 ms en controladores de infraestructura o energía.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Un controlador de dispositivo o política agresiva de ahorro de energía genera demoras en la cola DPC.',
        isCorrect: true,
        confirmationReason: 'Picos de DPC superiores a 1000 µs confirman retrasos en el despachador de interrupciones.',
      },
      {
        id: 'h2',
        text: 'El disco duro está desfragmentado.',
        isCorrect: false,
        rejectionReason: 'La latencia DPC es un fenómeno de procesamiento de interrupciones en tiempo real de la CPU.',
      },
    ],
    nextTestCommand: 'powercfg /SETACTIVE 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c',
    nextTestExplanation: 'Ajustar el plan de energía para evitar caídas de frecuencia de bus durante llamadas DPC.',
    rootCause: 'Controlador de dispositivo operando con modo de interrupción tradicional o caídas de frecuencia de bus.',
    solutionSteps: [
      'Ajustar el modo de interrupción (MSI Mode) en los controladores compatibles.',
      'Configurar el plan de energía para evitar caídas de frecuencia en buses PCIe.',
      'Desactivar controladores de dispositivos no utilizados.',
    ],
    solutionCommands: [
      'powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c',
    ],
    verificationProtocol: 'La latencia DPC máxima se mantiene por debajo de 1000 µs durante la reproducción.',
    verificationCommand: 'Write-Output "DPC Latency Audit Completed"',
    riskLevel: 'AMARILLO',
    rollbackProtocol: 'Restablecer el plan de energía anterior con powercfg /setactive.',
  },
  {
    id: 'prf-fail-23',
    title: 'DWM.exe (Desktop Window Manager) con Consumo Alto de Memoria',
    category: 'Rendimiento & Latencias',
    difficulty: 'TÉCNICO',
    badgeCode: 'ERR-PRF-023',
    userSymptom: 'El Administrador de Ventanas del Escritorio (dwm.exe) muestra un consumo elevado de memoria RAM en reposo.',
    whatNotToAssume: 'No intentar deshabilitar el proceso dwm.exe: es el compositor gráfico obligatorio de la interfaz visual de Windows.',
    timeline: [
      { time: 'T-60s', label: 'COMPOSICIÓN DWM', description: 'DWM renderiza el escritorio mediante descriptores DirectX.', type: 'STABLE' },
      { time: 'T-30s', label: 'ACUMULACIÓN TEXTURAS', description: 'Apertura y cierre de ventanas acumula descriptores en el espacio de DWM.', type: 'ANOMALY' },
      { time: 'T-10s', label: 'DESCRIPTOR LEAK', description: 'Inconsistencia en la liberación de buffers entre el controlador y DWM.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'MEMORIA DWM HIGH', description: 'dwm.exe supera 3 GB de memoria en el Administrador de Tareas.', type: 'FAILURE' },
      { time: 'T+10s', label: 'PROCESS WORKINGSET', description: 'Get-Process registra la huella de memoria del proceso compositor.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-Process dwm | Select-Object Name, Id, WorkingSet64, PM',
    firstTestTool: 'PowerShell / Task Manager',
    testResultOutput: 'Name: dwm, Id: 1140, WorkingSet64: 3840291024 (3.84 GB)',
    newEvidence: 'Get-Process registra una huella de memoria de 3.84 GB en el proceso compositor dwm.exe.',
    hypotheses: [
      {
        id: 'h1',
        text: 'Inconsistencia en la liberación de descriptores de renderizado entre el controlador gráfico y DWM.',
        isCorrect: true,
        confirmationReason: 'DWM incrementa su consumo de memoria sin liberar buffers de ventanas cerradas.',
      },
      {
        id: 'h2',
        text: 'La tasa de refresco del monitor es muy alta.',
        isCorrect: false,
        rejectionReason: 'La frecuencia de actualización no determina fugas de asignación de memoria en bytes.',
      },
    ],
    nextTestCommand: 'Get-ItemProperty "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" -Name HwSchMode',
    nextTestExplanation: 'Comprobar el estado de la programación de GPU acelerada por hardware (HAGS).',
    rootCause: 'Fallo de gestión de buffers entre el controlador de pantalla y el compositor de ventanas.',
    solutionSteps: [
      'Reiniciar el subsistema gráfico con Ctrl + Shift + Win + B.',
      'Actualizar el controlador gráfico a la versión estable WHQL.',
      'Ajustar la configuración de HAGS si el comportamiento persiste.',
    ],
    solutionCommands: [
      'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 1 /f',
    ],
    verificationProtocol: 'dwm.exe se estabiliza consumiendo valores basales entre 50 MB y 200 MB en reposo.',
    verificationCommand: '(Get-Process dwm).WorkingSet64 / 1MB',
    riskLevel: 'VERDE',
    rollbackProtocol: 'Reajustar el valor de HwSchMode en el Registro.',
  },
  {
    id: 'prf-fail-24',
    title: 'Apagado y Encendido Lento (Fast Startup / Kernel Hibernación)',
    category: 'Rendimiento & Latencias',
    difficulty: 'BÁSICO',
    badgeCode: 'ERR-PRF-024',
    userSymptom: 'La PC tarda más de 2 minutos en apagarse por completo y el tiempo de arranque subsecuente es superior al habitual.',
    whatNotToAssume: 'No asumir fallo en la unidad de almacenamiento antes de inspeccionar los diagnósticos de rendimiento de apagado en el Visor de Eventos.',
    timeline: [
      { time: 'T-60s', label: 'ORDEN APAGADO', description: 'El usuario solicita apagar el equipo desde el menú de inicio.', type: 'STABLE' },
      { time: 'T-30s', label: 'HIBERNACIÓN KERNEL', description: 'Windows intenta volcar la sesión del kernel en hiberfil.sys (Fast Startup).', type: 'ANOMALY' },
      { time: 'T-10s', label: 'BLOQUEO EN WRITER', description: 'Un controlador no responde a la orden de suspensión de energía.', type: 'DEGRADATION' },
      { time: 'T=0', label: 'APAGADO LENTO', description: 'Proceso de apagado excede los 120 segundos.', type: 'FAILURE' },
      { time: 'T+10s', label: 'EVENT ID 200', description: 'El registro de Diagnostics-Performance documenta la latencia de apagado.', type: 'EVIDENCE' },
    ],
    firstTestCommand: 'Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-Diagnostics-Performance/Operational"; Id=200} -MaxEvents 3',
    firstTestTool: 'PowerShell / Visor de Eventos',
    testResultOutput: 'Id: 200 (Shutdown Performance Diagnostics)\nShutdownDuration: 135890 ms (135 segundos)\nIsSlowShutdown: True\nDegradation: Kernel session hibernation write latency.',
    newEvidence: 'El evento 200 documenta una duración de apagado de 135 segundos debido a latencias en el volcado de la sesión del kernel.',
    hypotheses: [
      {
        id: 'h1',
        text: 'La función Inicio Rápido (Fast Startup) experimenta latencias al intentar hibernar la sesión del kernel.',
        isCorrect: true,
        confirmationReason: 'El evento 200 aísla la latencia en el proceso de escritura de la sesión del kernel.',
      },
      {
        id: 'h2',
        text: 'El botón del gabinete está dañado.',
        isCorrect: false,
        rejectionReason: 'El sistema operativo recibe la orden y procesa el evento durante 135 segundos.',
      },
    ],
    nextTestCommand: 'powercfg /h off',
    nextTestExplanation: 'Desactivar la hibernación para forzar un apagado limpio del kernel de Windows.',
    rootCause: 'Fast Startup experimentando bloqueos en el volcado de estado de controladores.',
    solutionSteps: [
      'Desactivar el Inicio Rápido en las opciones de energía.',
      'O desactivar la hibernación mediante powercfg /h off.',
      'Reiniciar para que el sistema realice una carga limpia del kernel.',
    ],
    solutionCommands: [
      'powercfg /h off',
      'powercfg /h on /type reduced',
    ],
    verificationProtocol: 'El equipo completa la secuencia de apagado en tiempos basales normales.',
    verificationCommand: '(Get-CimInstance Win32_OperatingSystem).LastBootUpTime',
    riskLevel: 'VERDE',
    rollbackProtocol: 'powercfg /h on para reactivar la hibernación si fuera requerido.',
  },
];
