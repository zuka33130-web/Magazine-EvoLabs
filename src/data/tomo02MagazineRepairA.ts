import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Reparación y rescate I · 176–186. Diagnóstico seguro, SIN formatear ni tocar drivers. */
export const EVO_MAGAZINE_REPAIR_A: EvoMagazineArticle[] = [
  {
    "id": 176,
    "goal": "Separar fallos de configuración de errores reales del sistema o hardware.",
    "basics": "Un equipo lento, sin sonido o con aplicaciones que fallan no siempre tiene archivos de Windows corruptos. Primero se investiga qué función falla, cuándo comenzó y si hay eventos asociados; reparar a ciegas puede dificultar el diagnóstico.",
    "steps": [
      {
        "title": "Registrá Windows y último inicio",
        "why": "La edición y fecha de inicio son parte de la evidencia básica.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber,LastBootUpTime",
        "expect": "Obtenés contexto para comparar con cambios recientes."
      },
      {
        "title": "Revisá errores recientes",
        "why": "Filtrá eventos del registro de sistema en las últimas 24 horas.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='System';Level=2;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 12 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Puede haber errores antiguos o no haber ninguno. No todos explican tu problema."
      },
      {
        "title": "Abrí el historial de fallos",
        "why": "El Monitor de confiabilidad relaciona fechas con fallos, cierres e instalaciones.",
        "code": "Start-Process perfmon.exe -ArgumentList '/rel'",
        "expect": "Podrás ubicar el primer día del síntoma cuando haya registros."
      }
    ],
    "tip": "Truco EVO: formulá tres hipótesis antes de tocar nada, por ejemplo actualización, driver o periférico.",
    "warning": "No borres registros ni uses reparaciones automáticas sin preservar documentos y evidencias.",
    "challenge": "Elegí un problema real e indicá qué observación apoyaría cada hipótesis y qué la descartaría."
  },
  {
    "id": 177,
    "goal": "Decidir cuándo reparar, restaurar o reinstalar Windows en lugar de formatear por rutina.",
    "basics": "Formatear destruye el contenido de la partición elegida y no soluciona hardware defectuoso. Las fallas pueden deberse a aplicaciones, actualizaciones, drivers o almacenamiento; un diagnóstico previo protege tiempo y datos.",
    "steps": [
      {
        "title": "Identificá el sistema y el disco",
        "why": "Confirmá modelo y particiones sin aplicar cambios.",
        "code": "Get-CimInstance Win32_DiskDrive | Select-Object Model,Status,Size",
        "expect": "El estado Status no sustituye SMART detallado ni un respaldo."
      },
      {
        "title": "Comprobá la integridad de forma no destructiva",
        "why": "SFC admite consultar ayuda y ejecutar sólo comprobación cuando corresponde.",
        "code": "sfc /?",
        "expect": "Verás opciones de verificación y reparación; no se ejecuta ninguna intervención."
      },
      {
        "title": "Comprobá recuperación disponible",
        "why": "Revisá si existen puntos de restauración del sistema.",
        "code": "Get-ComputerRestorePoint -ErrorAction SilentlyContinue | Select-Object -First 8 Description,CreationTime",
        "expect": "Puede no haber puntos, aunque Windows funcione."
      }
    ],
    "tip": "Truco EVO: estimá tiempo de reparación y reinstalación sólo después de inventariar aplicaciones, licencias y respaldos.",
    "warning": "Nunca formatees ni reinicies con 'quitar todo' antes de comprobar una copia verificable de tus archivos.",
    "challenge": "Planteá tres situaciones donde convendría reparar, reinstalar conservando datos o sustituir un componente."
  },
  {
    "id": 178,
    "goal": "Planificar una instalación limpia que sea compatible, segura y reproducible.",
    "basics": "Una instalación limpia permite partir de un sistema conocido, pero exige respaldo probado, medio oficial, licencia válida, drivers compatibles y seleccionar correctamente el disco. Esta lección prepara el procedimiento sin ejecutar un borrado.",
    "steps": [
      {
        "title": "Tomá inventario de edición y activación",
        "why": "Identificá tu Windows antes de descargar una imagen adecuada.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,OSArchitecture,Version,BuildNumber",
        "expect": "La salida informa plataforma, no revela licencia ni claves privadas."
      },
      {
        "title": "Identificá discos y particiones",
        "why": "Registrá tamaño y modelo para evitar elegir el disco equivocado durante una instalación futura.",
        "code": "Get-Disk | Select-Object Number,FriendlyName,PartitionStyle,Size",
        "expect": "Enumeración de discos, sin inicializarlos ni formatearlos."
      },
      {
        "title": "Comprobá firmware y equipo",
        "why": "El fabricante ofrece controladores y requisitos, que deben contrastarse con soporte oficial.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model; Get-CimInstance Win32_BIOS | Select-Object SMBIOSBIOSVersion",
        "expect": "Documentás compatibilidad para preparar instalación, sin entrar a BIOS."
      }
    ],
    "tip": "Truco EVO: mantené un manifiesto de programas, cuentas, medios oficiales, backups y drivers necesarios antes del instalador.",
    "warning": "No arranques un USB ni elimines particiones sin respaldo verificado y un plan explícito de recuperación.",
    "challenge": "Armá una lista de preinstalación con copia de documentos, verificación del medio, energía, drivers y restauración."
  },
  {
    "id": 179,
    "goal": "Entender de dónde obtiene Windows controladores y por qué algunos cambian después de una actualización.",
    "basics": "Un driver conecta el sistema con el hardware. Windows Update puede ofrecer controladores, mientras el fabricante publica paquetes específicos; mayor número de versión no siempre significa mejor compatibilidad.",
    "steps": [
      {
        "title": "Inventariá dispositivos de pantalla sin modificarlos",
        "why": "La consulta muestra nombre y controlador reportado, no instala software.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion,DriverDate",
        "expect": "Identificá el driver en uso para contrastarlo con el fabricante."
      },
      {
        "title": "Revisá drivers PnP instalados",
        "why": "Get-WindowsDriver -Online requiere privilegios en algunas instalaciones.",
        "code": "Get-WindowsDriver -Online -ErrorAction SilentlyContinue | Select-Object -First 15 Driver,ProviderName,ClassName,Version",
        "expect": "Puede devolver datos o error de acceso; no altera paquetes."
      },
      {
        "title": "Abrí el Administrador de dispositivos",
        "why": "Revisá propiedades y proveedor de un dispositivo concreto sin actualizarlo.",
        "code": "Start-Process devmgmt.msc",
        "expect": "Podrás ver controlador y estado según clase de hardware."
      }
    ],
    "tip": "Truco EVO: anotá versión que funciona antes de probar una actualización propuesta por Windows.",
    "warning": "No fuerces drivers incompatibles, controladores modificados ni desinstales software gráfico durante el laboratorio.",
    "challenge": "Explicá cómo decidirías entre un controlador del fabricante y uno distribuido por Windows Update."
  },
  {
    "id": 180,
    "goal": "Comprobar compatibilidad de drivers antes de culpar a Windows por una falla.",
    "basics": "Los drivers deben coincidir con dispositivo, arquitectura, versión y políticas de firma. Un controlador incorrecto puede producir errores, dispositivos ausentes o inestabilidad; no hay que sustituirlo sin pruebas.",
    "steps": [
      {
        "title": "Identificá el dispositivo y problema",
        "why": "PnP muestra dispositivos con estado no satisfactorio según Windows.",
        "code": "Get-PnpDevice | Where-Object Status -ne 'OK' | Select-Object -First 15 Class,FriendlyName,Status",
        "expect": "Pueden aparecer estados normales de equipos desconectados o controladores a investigar."
      },
      {
        "title": "Consultá el sistema operativo",
        "why": "Los requisitos de arquitectura y build son importantes para soporte.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,OSArchitecture,BuildNumber",
        "expect": "Verás arquitectura y compilación del equipo."
      },
      {
        "title": "Identificá fabricante y versión de un dispositivo",
        "why": "Elegí una clase de dispositivos, por ejemplo red, para explorar compatibilidad.",
        "code": "Get-PnpDevice -Class Net -ErrorAction SilentlyContinue | Select-Object -First 15 FriendlyName,Status,InstanceId",
        "expect": "Los ID ayudan a encontrar paquetes oficiales, pero no instalan nada."
      }
    ],
    "tip": "Truco EVO: cotejá ID de hardware, sistema operativo, firma y notas de versión antes de cambiar controlador.",
    "warning": "No instales drivers de sitios no oficiales ni desactives obligatoriedad de firmas para resolver una instalación fallida.",
    "challenge": "Explicá por qué un driver que funciona en otro modelo puede fallar aun con el mismo Windows."
  },
  {
    "id": 181,
    "goal": "Evaluar si actualizar firmware aporta un beneficio concreto y cuándo es mejor no hacerlo.",
    "basics": "UEFI/BIOS controla etapas previas al sistema y puede incluir microcódigo, compatibilidad y opciones de seguridad. Actualizarlo tiene riesgo de interrupción y debe justificarse por correcciones aplicables al modelo exacto.",
    "steps": [
      {
        "title": "Consultá versión de firmware",
        "why": "CIM informa fabricante, versión y fecha reportados.",
        "code": "Get-CimInstance Win32_BIOS | Select-Object Manufacturer,SMBIOSBIOSVersion,ReleaseDate",
        "expect": "Anotá la referencia antes de consultar al fabricante."
      },
      {
        "title": "Identificá la plataforma exacta",
        "why": "El nombre del procesador solo no determina qué firmware corresponde.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model",
        "expect": "El modelo es la pista principal para buscar soporte."
      },
      {
        "title": "Comprobá entorno de arranque seguro",
        "why": "Sólo lectura; puede devolver error en sistemas sin UEFI compatible.",
        "code": "Confirm-SecureBootUEFI",
        "expect": "Si está soportado, aparece True o False. Un error no indica necesariamente una avería."
      }
    ],
    "tip": "Truco EVO: buscá en el changelog del fabricante una corrección que afecte específicamente a tu PC.",
    "warning": "Nunca uses una imagen de firmware de otro modelo ni flashees un equipo que no puedas recuperar.",
    "challenge": "Escribí dos motivos sólidos para actualizar y dos razones para posponer una actualización."
  },
  {
    "id": 182,
    "goal": "Preparar una recuperación de Windows antes de que falle el arranque.",
    "basics": "El entorno de recuperación WinRE, los respaldos y una instalación oficial de rescate ayudan a diagnosticar fallas de inicio. Deben comprobarse mientras el sistema todavía funciona; las herramientas de recuperación no sustituyen copia de documentos.",
    "steps": [
      {
        "title": "Consultá WinRE",
        "why": "reagentc /info muestra su configuración y ubicación según permisos.",
        "code": "reagentc /info",
        "expect": "Podrás ver si Windows RE está habilitado o información sobre acceso/estado."
      },
      {
        "title": "Inventariá el arranque sin modificarlo",
        "why": "bcdedit /enum presenta entradas configuradas; puede requerir elevación.",
        "code": "bcdedit /enum",
        "expect": "Observarás gestor y cargadores o un error de permisos."
      },
      {
        "title": "Revisá las copias disponibles",
        "why": "Detectá discos con espacio y puntos de restauración, sin escribir archivos.",
        "code": "Get-ComputerRestorePoint -ErrorAction SilentlyContinue | Select-Object -First 6 Description,CreationTime",
        "expect": "La ausencia de puntos indica que necesitás otro mecanismo de respaldo."
      }
    ],
    "tip": "Truco EVO: conservá un USB oficial y un procedimiento de recuperación documentado en papel para cuando Windows no abra.",
    "warning": "No edites BCD ni la partición EFI siguiendo comandos de Internet en una máquina funcional.",
    "challenge": "Describí qué harías ante 'no inicia Windows' sin perder datos ni borrar particiones."
  },
  {
    "id": 183,
    "goal": "Conocer herramientas integradas que un técnico puede usar sin instalar utilidades de terceros.",
    "basics": "Windows incorpora numerosos paneles: Administrador de tareas, eventos, rendimiento, recursos, servicios, programador, información del sistema, red, energía y almacenamiento. Lo importante no es memorizar nombres sino saber qué responde cada herramienta.",
    "steps": [
      {
        "title": "Abrí Información del sistema",
        "why": "msinfo32 muestra detalles básicos de hardware y configuración.",
        "code": "Start-Process msinfo32.exe",
        "expect": "Se abre una consola con información del equipo."
      },
      {
        "title": "Abrí Monitor de recursos",
        "why": "resmon permite ver CPU, memoria, disco y red por proceso.",
        "code": "Start-Process resmon.exe",
        "expect": "Verás métricas dinámicas sin ejecutar ajustes."
      },
      {
        "title": "Consultá ayuda de reparación",
        "why": "Conocer DISM permite distinguir observación de intervención.",
        "code": "dism.exe /?",
        "expect": "Aparece ayuda oficial, sin reparar nada."
      }
    ],
    "tip": "Truco EVO: armá un mapa de 15 herramientas: taskmgr, resmon, eventvwr, perfmon, msinfo32, services.msc, taskschd.msc, diskmgmt.msc, devmgmt.msc, wf.msc, gpedit.msc, powercfg, Get-CimInstance, SFC y DISM.",
    "warning": "No apliques opciones avanzadas porque una herramienta aparezca en una lista viral.",
    "challenge": "Elegí cinco consolas e indicá qué síntoma investigarías con cada una."
  },
  {
    "id": 184,
    "goal": "Separar pantalla negra de fallo de video, shell, arranque o alimentación.",
    "basics": "Una pantalla negra puede aparecer antes de Windows, durante el inicio de sesión o después de abrir el escritorio. Cada escenario tiene causas y soluciones distintas; no conviene asumir que el driver gráfico es el responsable.",
    "steps": [
      {
        "title": "Tomá información gráfica mientras funciona",
        "why": "Si la PC todavía muestra imagen, registrá adaptador y controlador actuales.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion,CurrentHorizontalResolution,CurrentVerticalResolution",
        "expect": "Esta línea base ayuda a comparar un fallo posterior sin cambiar drivers."
      },
      {
        "title": "Revisá errores de pantalla/sistema",
        "why": "Consultá eventos recientes como pista, sin afirmar causalidad automática.",
        "code": "Get-WinEvent -LogName System -MaxEvents 20 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Podrías observar errores o ninguno; no todo apagón genera evento."
      },
      {
        "title": "Consultá estado del shell",
        "why": "Si tenés imagen y sesión abierta, Explorer puede no estar respondiendo.",
        "code": "Get-Process explorer -ErrorAction SilentlyContinue | Select-Object Name,Id,Responding",
        "expect": "Un valor false puede sugerir bloqueo de interfaz, no avería de GPU."
      }
    ],
    "tip": "Truco EVO: preguntá primero '¿se ve el logo del fabricante?' y '¿llega a la pantalla de sesión?'; cambian todo el árbol de decisión.",
    "warning": "No desinstales drivers de gráficos, restablezcas BIOS ni fuerces apagados repetidos sin diagnóstico.",
    "challenge": "Construí un árbol de tres escenarios: sin señal del monitor, pantalla negra al iniciar y escritorio sin barra."
  },
  {
    "id": 185,
    "goal": "Entender por qué algunas carpetas ocupan mucho pero no se deben borrar manualmente.",
    "basics": "Windows mantiene binarios compartidos, almacén de componentes, controladores, instaladores y recuperación. Borrar archivos del sistema por tamaño aparente puede romper actualizaciones, reparación o el propio inicio.",
    "steps": [
      {
        "title": "Consultá carpetas especiales sin abrirlas",
        "why": "Comprobá existencia de dos almacenes esenciales.",
        "code": "[pscustomobject]@{WinSxS=Test-Path (Join-Path $env:windir 'WinSxS');DriverStore=Test-Path (Join-Path $env:windir 'System32\\DriverStore')}",
        "expect": "Es frecuente obtener True para ambas; su presencia es normal."
      },
      {
        "title": "Leé información de componentes",
        "why": "DISM puede analizar el almacén de componentes si ejecutás como administrador.",
        "code": "DISM.exe /Online /Cleanup-Image /AnalyzeComponentStore",
        "expect": "Podés obtener un análisis o error de elevación, sin limpiar ni borrar."
      },
      {
        "title": "Consultá volúmenes antes de una limpieza",
        "why": "Identificá cuánto espacio libre existe y dónde es útil recuperar.",
        "code": "Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter,Size,SizeRemaining",
        "expect": "Ves tamaños de unidades, no un permiso para borrar carpetas protegidas."
      }
    ],
    "tip": "Truco EVO: priorizá Almacenamiento y herramientas oficiales de mantenimiento en lugar de eliminar archivos de WinSxS.",
    "warning": "Nunca borres manualmente System32, WinSxS, DriverStore, Installer, Recovery o SoftwareDistribution sin procedimiento oficial.",
    "challenge": "Explicá por qué el tamaño aparente de WinSxS puede diferir del espacio exclusivo y qué herramienta oficial sirve para revisarlo."
  },
  {
    "id": 186,
    "goal": "Investigar qué llena el almacenamiento sin instalar limpiadores.",
    "basics": "Discos llenos pueden contener descargas, duplicados, archivos de usuario, cachés, copias y actualizaciones. Para liberar espacio de manera segura hay que localizar los datos con consentimiento y distinguir componentes protegidos.",
    "steps": [
      {
        "title": "Medí espacio disponible por unidad",
        "why": "Get-Volume consulta capacidades de volúmenes reconocidos.",
        "code": "Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter,FileSystem,Size,SizeRemaining",
        "expect": "Se informan bytes; anotá la unidad que realmente está llena."
      },
      {
        "title": "Inspeccioná una carpeta propia",
        "why": "Contá tamaño directo de archivos en Descargas sin borrar nada.",
        "code": "Get-ChildItem (Join-Path $HOME 'Downloads') -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum",
        "expect": "Count y Sum reflejan solo archivos del primer nivel; no incluyen subdirectorios."
      },
      {
        "title": "Abrí el análisis oficial",
        "why": "Configuración > Sistema > Almacenamiento separa categorías relevantes.",
        "code": "Start-Process 'ms-settings:storagesense'",
        "expect": "Podrás revisar categorías de ocupación y limpieza sin aplicar una eliminación automática."
      }
    ],
    "tip": "Truco EVO: muchas descargas duplicadas y videos de usuario aportan más espacio recuperable que una supuesta 'limpieza del Registro'.",
    "warning": "No borres a ciegas carpetas AppData, System32 o archivos de recuperación para ahorrar espacio.",
    "challenge": "Elegí una carpeta propia, registrá bytes y justificá qué podrías borrar con respaldo y qué conservarías."
  }
];
