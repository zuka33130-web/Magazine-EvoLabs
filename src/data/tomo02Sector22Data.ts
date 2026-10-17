// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 22: PRIVACIDAD Y TELEMETRÍA
// “¿QUIÉN ME ESTÁ MIRANDO?”

export type RiskLevelSector22 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector22Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector22;
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
    cliExample: string;
    psExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    technicalMetrics: string;
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

export interface Sector22MiniCase {
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

export interface Sector22TestQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_22_INVESTIGATIONS: Sector22Investigation[] = [
  {
    id: "inv-22-01",
    code: "22.01",
    title: "Qué es telemetría",
    subtitle: "El canal de recopilación continua de datos del sistema operativo",
    targetMechanism: "Connected User Experiences and Telemetry (DiagTrack / utc.dll)",
    targetComponent: "Service: DiagTrack",
    commandName: "Get-Service DiagTrack",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Telemetría es espionaje malintencionado o instrumentación del sistema?",
      mythVsTruth: {
        mentira: "La telemetría en Windows envía todas tus imágenes y contraseñas a servidores remotos.",
        verdad: "La telemetría recopila eventos de rendimiento, crashes de drivers, uso de CPU y diagnósticos del kernel.",
        comprobalo: "Get-Service DiagTrack | Format-List Name, Status, StartType"
      }
    },
    entende: {
      queEs: "Es el subservicio Connected User Experiences and Telemetry que empaqueta y envía logs de diagnóstico a la nube de Microsoft.",
      paraQueSirve: "Permite a Microsoft identificar fallas masivas de drivers, bugs en actualizaciones y estabilidad del kernel en millones de dispositivos.",
      quePasaSiFalta: "Si se desactiva, el sistema funciona normalmente, pero se dificulta la resolución automatizada de errores en Windows Update."
    },
    interactua: {
      cliExample: "sc query DiagTrack",
      psExample: "Get-Service DiagTrack | Select-Object -Property Name, DisplayName, Status, StartType",
      syntaxBreakdown: "sc query consulta el estado de ejecución y código de salida del servicio DiagTrack.",
      whatToLookFor: "Estado RUNNING u STOPPED y tipo de inicio (Automatic/Disabled).",
      technicalMetrics: "Impacto en RAM: ~15 MB, CPU: < 0.1% en reposo."
    },
    alertaEVO: {
      reversibilityRule: "Se puede pausar o deshabilitar mediante Set-Service DiagTrack -StartupType Disabled.",
      safetyWarning: "Deshabilitar este servicio puede impedir la recepción de ciertos parches dinámicos de compatibilidad."
    },
    evidenceBadge: {
      code: "EVO-2201",
      label: "TELEMETRY CORE"
    }
  },
  {
    id: "inv-22-02",
    code: "22.02",
    title: "Qué es diagnóstico",
    subtitle: "Recopilación contextual de fallas e informes de crasheo (WER)",
    targetMechanism: "Windows Error Reporting (WER) Service",
    targetComponent: "Service: WerSvc / C:\\ProgramData\\Microsoft\\Windows\\WER",
    commandName: "Get-Service WerSvc",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Qué sucede exactamente en tu disco cuando una aplicación se cuelga?",
      mythVsTruth: {
        mentira: "El informe de diagnóstico de Windows es inutilizable para administradores locales.",
        verdad: "Windows almacena minidumps (.dmp) con el stack trace exacto en C:\\ProgramData\\Microsoft\\Windows\\WER.",
        comprobalo: "Get-ChildItem 'C:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive' -Recurse"
      }
    },
    entende: {
      queEs: "Mecanismo para registrarvolcados de memoria y trazas de ejecución cuando un proceso lanza una excepción no controlada.",
      paraQueSirve: "Facilita la depuración forense mediante WinDbg o Event Viewer tras una pantalla azul o caída de software.",
      quePasaSiFalta: "Si WerSvc está detenido, no se generan volcados ni reportes locales organizados."
    },
    interactua: {
      cliExample: "dir C:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive",
      psExample: "Get-ChildItem -Path 'C:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive' -ErrorAction SilentlyContinue",
      syntaxBreakdown: "Recorre las carpetas de informes de diagnóstico estructurados por proceso ejecutable.",
      whatToLookFor: "Archivos Report.wer con detalles de ExceptionCode y FaultModule.",
      technicalMetrics: "Espacio en disco: Variable según número de crahses (10MB - 2GB)."
    },
    alertaEVO: {
      reversibilityRule: "Los reportes guardados se pueden borrar con Cleanmgr o PowerShell sin afectar el sistema.",
      safetyWarning: "No elimines volcados si estás diagnosticando un fallo recurrente de kernel."
    },
    evidenceBadge: {
      code: "EVO-2202",
      label: "WER DIAGNOSTICS"
    }
  },
  {
    id: "inv-22-03",
    code: "22.03",
    title: "Advertising ID",
    subtitle: "El identificador publicitario único para perfilamiento en Apps UWP",
    targetMechanism: "Windows Advertising ID Policy Registry Key",
    targetComponent: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo",
    commandName: "Get-ItemProperty HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "¿Cómo saben las apps de Microsoft Store qué anuncios desplegarte?",
      mythVsTruth: {
        mentira: "El ID de publicidad de Windows da acceso a tu historial bancario.",
        verdad: "Es una clave alfanumérica única usada por apps para personalizar avisos sin exponer tu identidad real.",
        comprobalo: "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo' -Name Enabled"
      }
    },
    entende: {
      queEs: "Identificador asignado al perfil de usuario para realizar seguimiento entre aplicaciones de la plataforma Store.",
      paraQueSirve: "Permite a las agencias publicitarias medir conversión de anuncios sin acceder a tu cuenta personal.",
      quePasaSiFalta: "Si se inhabilita (Enabled = 0), seguirás viendo anuncios pero dejarán de ser personalizados."
    },
    interactua: {
      cliExample: "reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo",
      psExample: "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo' -Name 'Enabled' -Value 0",
      syntaxBreakdown: "Set-ItemProperty modifica la clave 'Enabled' asignando el valor entero 0.",
      whatToLookFor: "Enabled : 0 para desactivar la segmentación publicitaria.",
      technicalMetrics: "Cambio inmediato en el registro de usuario sin necesidad de reinicio."
    },
    alertaEVO: {
      reversibilityRule: "Revertir cambiando el valor Enabled de nuevo a 1.",
      safetyWarning: "Desactivar esta opción no elimina los anuncios integrados dentro de las apps gratuitas."
    },
    evidenceBadge: {
      code: "EVO-2203",
      label: "ADVERTISING ID"
    }
  },
  {
    id: "inv-22-04",
    code: "22.04",
    title: "Location",
    subtitle: "Servicio de geolocalización basada en IP, Wi-Fi y sensores GPS",
    targetMechanism: "Geolocation Service (lfsvc)",
    targetComponent: "Service: lfsvc / HKLM:\\SYSTEM\\CurrentControlSet\\Services\\lfsvc",
    commandName: "Get-Service lfsvc",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo sabe el mapa o el clima tu ubicación física sin chip GPS?",
      mythVsTruth: {
        mentira: "La ubicación de Windows solo funciona si tienes un sensor GPS físico instalado.",
        verdad: "Windows calcula tu posición triangulando SSIDs de redes Wi-Fi cercanas e IP pública.",
        comprobalo: "Get-Service lfsvc | Select-Object Status, StartType"
      }
    },
    entende: {
      queEs: "Servicio de infraestructura de localización (lfsvc) que arbitra las peticiones de posición global.",
      paraQueSirve: "Suministra coordenadas de latitud/longitud a la zona horaria automática, Mapas y navegador.",
      quePasaSiFalta: "Si está deshabilitado, las aplicaciones solicitarán ingresar el código postal o ciudad manualmente."
    },
    interactua: {
      cliExample: "sc query lfsvc",
      psExample: "Get-Service lfsvc | Select-Object -Property Name, DisplayName, Status",
      syntaxBreakdown: "Muestra el estado operativo del servicio de geolocalización.",
      whatToLookFor: "Status : Running cuando hay aplicaciones consultando coordenadas.",
      technicalMetrics: "Consumo de red: Peticiones HTTP periódicas a servicios de mapas de Microsoft."
    },
    alertaEVO: {
      reversibilityRule: "Se puede desactivar de forma global desde Configuración -> Privacidad -> Ubicación.",
      safetyWarning: "La búsqueda de dispositivos extraviados (Find My Device) depende de este servicio."
    },
    evidenceBadge: {
      code: "EVO-2204",
      label: "GEOLOCATION"
    }
  },
  {
    id: "inv-22-05",
    code: "22.05",
    title: "Camera",
    subtitle: "Control de acceso por Hardware y permisos WinRT a la cámara",
    targetMechanism: "Windows Capability Access Service (CapabilityAccessManager)",
    targetComponent: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam",
    commandName: "Get-ChildItem HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Se puede auditar qué programas accedieron a tu webcam y cuándo?",
      mythVsTruth: {
        mentira: "No hay registro del sistema que indique qué app encendió la cámara recientemente.",
        verdad: "Windows registra la hora exacta del último acceso en la clave ConsentStore de la cámara.",
        comprobalo: "Get-ChildItem 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam'"
      }
    },
    entende: {
      queEs: "El administrador de capacidades de Windows que bloquea o autoriza el flujo de video hacia apps UWP y Win32.",
      paraQueSirve: "Garantiza la privacidad al impedir que aplicaciones en segundo plano capturen video sin consentimiento.",
      quePasaSiFalta: "Si la política global está bloqueada, las apps de videoconferencia devolverán pantalla negra."
    },
    interactua: {
      cliExample: "reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam",
      psExample: "Get-ChildItem 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam' | ForEach-Object { Get-ItemProperty $_.PSPath }",
      syntaxBreakdown: "Lista los identificadores de aplicaciones y sus marcas de tiempo de uso de la cámara.",
      whatToLookFor: "Valores LastUsedTimeStart y LastUsedTimeStop para auditar sesiones.",
      technicalMetrics: "Marcas de tiempo en formato FileTime de 64 bits."
    },
    alertaEVO: {
      reversibilityRule: "Los permisos se otorgan o revocan individualmente en la UI de Configuración.",
      safetyWarning: "Drivers de cámara de bajo nivel con filtros DirectShow antiguos pueden eludir ConsentStore si operan en Kernel."
    },
    evidenceBadge: {
      code: "EVO-2205",
      label: "CAMERA PRIVACY"
    }
  },
  {
    id: "inv-22-06",
    code: "22.06",
    title: "Microphone",
    subtitle: "Auditoría de captura de audio y permisos del subsistema de micrófono",
    targetMechanism: "ConsentStore Microphone Access Manager",
    targetComponent: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone",
    commandName: "Get-ChildItem HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Tu micrófono transmite datos en segundo plano sin que lo sepas?",
      mythVsTruth: {
        mentira: "Windows activa el micrófono de fondo de forma oculta en todas las laptops.",
        verdad: "Windows muestra un icono en la bandeja del sistema y guarda auditorías en el registro cada vez que se escucha el micrófono.",
        comprobalo: "Get-ChildItem 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone'"
      }
    },
    entende: {
      queEs: "Mecanismo del sistema que supervisa las llamadas a Audio Client APIs (WASAPI).",
      paraQueSirve: "Informa al usuario qué proceso está consumiendo la entrada de línea y previene intercepciones sigilosas.",
      quePasaSiFalta: "Sin esta capa, cualquier ejecutable local podría abrir un canal de audio silente."
    },
    interactua: {
      cliExample: "reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone",
      psExample: "Get-ChildItem 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone' | Select-Object PSChildName",
      syntaxBreakdown: "Devuelve los nombres de paquetes UWP o rutas de ejecutables con permiso de micrófono.",
      whatToLookFor: "Procesos sospechosos listados bajo NonPackaged.",
      technicalMetrics: "Registro en tiempo real de activación y desactivación de la entrada de audio."
    },
    alertaEVO: {
      reversibilityRule: "Se puede desactivar completamente el micrófono por software o desde el Administrador de Dispositivos.",
      safetyWarning: "Las apps de llamadas (Teams, Zoom, Discord) perderán acceso de inmediato."
    },
    evidenceBadge: {
      code: "EVO-2206",
      label: "MIC PRIVACY"
    }
  },
  {
    id: "inv-22-07",
    code: "22.07",
    title: "Activity History",
    subtitle: "Historial de actividades del usuario y sincronización de Timeline",
    targetMechanism: "Connected Devices Platform Service (CDPSvc)",
    targetComponent: "Service: CDPSvc / ActivityHistoryRegistry",
    commandName: "Get-Service CDPSvc",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Qué registros guarda Windows sobre los archivos e historiales de navegación que abriste ayer?",
      mythVsTruth: {
        mentira: "Windows borra todo rastro de tu actividad diaria cuando apagas la PC.",
        verdad: "Windows guarda una base de datos local SQLite con tu cronología de aplicaciones utilizadas.",
        comprobalo: "Get-Service CDPSvc | Select-Object Name, Status"
      }
    },
    entende: {
      queEs: "Servicio Connected Devices Platform (CDPSvc) que alimenta la sincronización entre dispositivos y la cronología.",
      paraQueSirve: "Permite reanudar aplicaciones, pestañas y documentos en el punto exacto donde se dejaron.",
      quePasaSiFalta: "Si se deshabilita, la lista de elementos recientes dependerá exclusivamente del menú Inicio local."
    },
    interactua: {
      cliExample: "sc query CDPSvc",
      psExample: "Get-Service CDPSvc | Select-Object DisplayName, Status, StartType",
      syntaxBreakdown: "Consulta el estado del servicio de plataforma de dispositivos conectados.",
      whatToLookFor: "Status : Running cuando hay sincronización o registro activo.",
      technicalMetrics: "Base de datos local guardada en %LocalAppData%\\ConnectedDevicesPlatform."
    },
    alertaEVO: {
      reversibilityRule: "Se puede desactivar en Configuración -> Privacidad -> Historial de actividad.",
      safetyWarning: "No afecta el funcionamiento básico del explorador de archivos."
    },
    evidenceBadge: {
      code: "EVO-2207",
      label: "ACTIVITY HISTORY"
    }
  },
  {
    id: "inv-22-08",
    code: "22.08",
    title: "Microsoft Account",
    subtitle: "Identidad integrada, tokens de autenticación y perfil en la nube",
    targetMechanism: "Microsoft Account Sign-in Assistant (wlidsvc)",
    targetComponent: "Service: wlidsvc / Web Account Manager (WAM)",
    commandName: "Get-Service wlidsvc",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cuál es la diferencia técnica entre una cuenta local y una Microsoft Account en Windows?",
      mythVsTruth: {
        mentira: "Una cuenta de Microsoft en Windows no influye en los servicios del sistema.",
        verdad: "Inyecta un servicio de inicio de sesión (wlidsvc) que gestiona tokens OAuth2 para OneDrive, Store y Office.",
        comprobalo: "Get-Service wlidsvc | Select-Object Name, Status, StartType"
      }
    },
    entende: {
      queEs: "El asistente de inicio de sesión para cuentas de Microsoft (wlidsvc) encargado del SSO (Single Sign-On).",
      paraQueSirve: "Sincroniza configuraciones, claves de BitLocker en la nube, licencias digitales y perfiles de usuario.",
      quePasaSiFalta: "Si se detiene wlidsvc, la tienda Microsoft Store y los servicios en la nube darán errores de autenticación."
    },
    interactua: {
      cliExample: "sc query wlidsvc",
      psExample: "Get-Service wlidsvc | Select-Object DisplayName, Status, StartType",
      syntaxBreakdown: "Comprueba si el asistente de cuenta Microsoft está operativo.",
      whatToLookFor: "StartType : Manual o Automatic según las cuentas vinculadas.",
      technicalMetrics: "Gestión de certificados y credenciales en Credential Manager."
    },
    alertaEVO: {
      reversibilityRule: "Se puede cambiar el tipo de cuenta a Cuenta Local desde la configuración de cuentas.",
      safetyWarning: "Migrar a cuenta local requiere guardar copia previa de la clave de recuperación de BitLocker."
    },
    evidenceBadge: {
      code: "EVO-2208",
      label: "MS ACCOUNT SSO"
    }
  },
  {
    id: "inv-22-09",
    code: "22.09",
    title: "OneDrive",
    subtitle: "Sincronización automática de carpetas personales y Files On-Demand",
    targetMechanism: "Microsoft OneDrive Sync Engine Process",
    targetComponent: "Process: OneDrive.exe / Shell Namespace Integration",
    commandName: "Get-Process OneDrive -ErrorAction SilentlyContinue",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Qué hace exactamente OneDrive con tu escritorio y documentos por defecto?",
      mythVsTruth: {
        mentira: "OneDrive guarda copias locales idénticas de todos tus archivos sin consumir internet.",
        verdad: "Usa el sistema NTFS reparse points para implementar 'Archivos a petición', descargando sólo al hacer doble clic.",
        comprobalo: "Get-Process OneDrive -ErrorAction SilentlyContinue | Select-Object Id, CPU, WorkingSet"
      }
    },
    entende: {
      queEs: "El cliente de sincronización en la nube integrado directamente con el Shell del Explorador de Windows.",
      paraQueSirve: "Mantiene respaldadas en tiempo real las carpetas Escritorio, Documentos y Imágenes.",
      quePasaSiFalta: "Si se desinstala o deshabilita, las carpetas redirigidas volverán a la ruta local estándar de C:\\Users."
    },
    interactua: {
      cliExample: "tasklist /FI \"IMAGENAME eq OneDrive.exe\"",
      psExample: "Get-Process OneDrive -ErrorAction SilentlyContinue | Select-Object ProcessName, Id, WS",
      syntaxBreakdown: "Muestra si la tarea de sincronización de OneDrive está en ejecución y su memoria RAM asignada.",
      whatToLookFor: "Presencia del proceso OneDrive.exe y consumo de WorkingSet.",
      technicalMetrics: "Uso de memoria: ~40-120 MB en ejecución continua."
    },
    alertaEVO: {
      reversibilityRule: "Se puede desvincular esta PC desde la pestaña Cuenta en la configuración de OneDrive.",
      safetyWarning: "Desvincular sin verificar la descarga previa de archivos 'Only-Online' puede hacer que parezcan desaparecidos."
    },
    evidenceBadge: {
      code: "EVO-2209",
      label: "ONEDRIVE SYNC"
    }
  },
  {
    id: "inv-22-10",
    code: "22.10",
    title: "Diagnostic Data",
    subtitle: "Niveles de envío de datos de diagnóstico (Obligatorio vs Opcional)",
    targetMechanism: "DataCollection AllowTelemetry Registry Policy",
    targetComponent: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection",
    commandName: "Get-ItemProperty HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection -ErrorAction SilentlyContinue",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "¿Qué cambia realmente entre el nivel Obligatorio y el nivel Opcional de diagnósticos?",
      mythVsTruth: {
        mentira: "Seleccionar 'Nivel Básico/Obligatorio' apaga el canal de telemetría de Windows.",
        verdad: "El nivel Obligatorio envía datos de hardware y compatibilidad; el Opcional agrega sitios web visitados y uso de memoria.",
        comprobalo: "Get-ItemProperty 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -Name AllowTelemetry -ErrorAction SilentlyContinue"
      }
    },
    entende: {
      queEs: "Política del Registro que define la intensidad y profundidad de la recolección de eventos en el sistema.",
      paraQueSirve: "Configura el límite de recolección: 0 = Security (Enterprise), 1 = Required (Basic), 3 = Optional (Full).",
      quePasaSiFalta: "Si no existe la política definida, Windows asume el valor por defecto configurado por el usuario en Settings."
    },
    interactua: {
      cliExample: "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection /v AllowTelemetry",
      psExample: "Set-ItemProperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -Name 'AllowTelemetry' -Value 1 -Type DWord",
      syntaxBreakdown: "Establece el valor de la directiva AllowTelemetry al nivel Básico (1).",
      whatToLookFor: "AllowTelemetry : 1 para restringir la telemetría al mínimo estándar de seguridad.",
      technicalMetrics: "Requiere privilegios de Administrador para su modificación."
    },
    alertaEVO: {
      reversibilityRule: "Restablecer eliminando la clave o cambiando su valor a 3.",
      safetyWarning: "En ediciones Windows Home, algunas políticas de Group Policy son ignoradas o sobreescritas por Windows Update."
    },
    evidenceBadge: {
      code: "EVO-2210",
      label: "TELEMETRY LEVEL"
    }
  },
  {
    id: "inv-22-11",
    code: "22.11",
    title: "Diagnostic Data Viewer",
    subtitle: "Inspección transparente de payloads JSON enviados a servidores de diagnóstico",
    targetMechanism: "Diagnostic Data Viewer App & ETW Data Store",
    targetComponent: "C:\\Program Files\\WindowsApps\\Microsoft.DiagnosticDataViewer",
    commandName: "Get-AppxPackage *DiagnosticDataViewer*",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Quieres ver exactamente los datos en formato JSON que tu PC envía a Microsoft?",
      mythVsTruth: {
        mentira: "El contenido transmitido por la telemetría de Windows está cifrado y es opaco para el dueño del equipo.",
        verdad: "Microsoft provee la herramienta gratuita Diagnostic Data Viewer para decodificar localmente los eventos recopilados.",
        comprobalo: "Get-AppxPackage *DiagnosticDataViewer*"
      }
    },
    entende: {
      queEs: "Aplicación oficial UWP que actúa como visor local de la cola de eventos de diagnóstico antes de ser empaquetados.",
      paraQueSirve: "Permite inspeccionar eventos como modelos de dispositivos, aplicaciones instaladas y reportes de cuelgues.",
      quePasaSiFalta: "No afecta al sistema; es simplemente una herramienta de transparencia y auditoría."
    },
    interactua: {
      cliExample: "powershell Get-AppxPackage *DiagnosticDataViewer*",
      psExample: "Get-AppxPackage *DiagnosticDataViewer* | Select-Object Name, Version, InstallLocation",
      syntaxBreakdown: "Muestra si la herramienta de auditoría de diagnóstico está instalada en el equipo.",
      whatToLookFor: "Name : Microsoft.DiagnosticDataViewer si está disponible.",
      technicalMetrics: "Lee eventos locales interceptando el canal ETW de DiagTrack."
    },
    alertaEVO: {
      reversibilityRule: "Se puede instalar o desinstalar libremente desde la Microsoft Store.",
      safetyWarning: "Requiere habilitar un búfer de almacenamiento local de hasta 1 GB para guardar el historial decodificado."
    },
    evidenceBadge: {
      code: "EVO-2211",
      label: "DATA VIEWER"
    }
  },
  {
    id: "inv-22-12",
    code: "22.12",
    title: "Network connections",
    subtitle: "Mapeo de sockets de red activos, conexiones entrantes y salientes",
    targetMechanism: "TCP/IP Network Subsystem & Netstat Engine",
    targetComponent: "netstat.exe / System Socket Tables",
    commandName: "netstat -ano",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cuántas conexiones de red abiertas tiene tu computadora en este preciso segundo?",
      mythVsTruth: {
        mentira: "Si no tienes el navegador abierto, tu computadora no transmite ningún paquete por la red.",
        verdad: "Servicios del sistema, actualizaciones de hora, sincronizaciones y verificaciones de certificados mantienen sockets abiertos continuamente.",
        comprobalo: "netstat -ano | findstr ESTABLISHED"
      }
    },
    entende: {
      queEs: "Herramienta CLI clásica para consultar las tablas del pila TCP/IP del kernel de Windows.",
      paraQueSirve: "Revela la IP de origen, puerto de origen, IP de destino, puerto de destino, estado de la conexión y PID del proceso.",
      quePasaSiFalta: "No es un servicio, es una utilidad esencial de diagnóstico de red de bajo nivel."
    },
    interactua: {
      cliExample: "netstat -ano",
      psExample: "netstat -ano | Select-String \"ESTABLISHED\"",
      syntaxBreakdown: "netstat con parámetros -a (todos), -n (direcciones numéricas), -o (muestra PID asignado).",
      whatToLookFor: "Conexiones con estado ESTABLISHED hacia IPs externas desconocidas.",
      technicalMetrics: "Ejecución instantánea con mínimo overhead en el sistema."
    },
    alertaEVO: {
      reversibilityRule: "Comando de consulta segura de lectura sin modificación de tráfico.",
      safetyWarning: "Las direcciones IP representadas pueden pertenecer a CDNs (Cloudflare, Akamai, Azure) sin representar una amenaza."
    },
    evidenceBadge: {
      code: "EVO-2212",
      label: "NET STATS"
    }
  },
  {
    id: "inv-22-13",
    code: "22.13",
    title: "Get-NetTCPConnection",
    subtitle: "Auditoría estructurada de conexiones TCP desde PowerShell",
    targetMechanism: "NetTCPIP PowerShell Module",
    targetComponent: "Cmdlet: Get-NetTCPConnection",
    commandName: "Get-NetTCPConnection -State Established",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué usar Get-NetTCPConnection en lugar del clásico netstat?",
      mythVsTruth: {
        mentira: "netstat y Get-NetTCPConnection proporcionan el mismo tipo de salida no estructurada.",
        verdad: "Get-NetTCPConnection devuelve objetos manipulables que permiten filtrar, ordenar y canalizar por proceso e IP de forma nativa.",
        comprobalo: "Get-NetTCPConnection -State Established | Format-Table LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess"
      }
    },
    entende: {
      queEs: "Cmdlet nativo de PowerShell para interactuar con la API WMI/MI de la pila TCP/IP.",
      paraQueSirve: "Facilita la automatización de scripts de seguridad para detectar conexiones anormales enviadas por procesos no autorizados.",
      quePasaSiFalta: "Disponible por defecto en todas las instalaciones modernas de Windows PowerShell."
    },
    interactua: {
      cliExample: "powershell Get-NetTCPConnection -State Established",
      psExample: "Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | Format-Table -AutoSize",
      syntaxBreakdown: "Filtra sockets activos en estado Established y formatea la salida en columnas legibles.",
      whatToLookFor: "OwningProcess con PIDs de procesos inusuales o no firmados.",
      technicalMetrics: "Salida orientada a objetos en tiempo real."
    },
    alertaEVO: {
      reversibilityRule: "Comando de consulta segura en PowerShell.",
      safetyWarning: "Requiere privilegios elevados para resolver el nombre de ejecutable de ciertos procesos del sistema."
    },
    evidenceBadge: {
      code: "EVO-2213",
      label: "TCP SOCKETS"
    }
  },
  {
    id: "inv-22-14",
    code: "22.14",
    title: "PID → Process → Destination",
    subtitle: "Rastreo de cadena forense desde un socket de red hasta el binario ejecutable",
    targetMechanism: "Process ID (PID) Resolution Pipeline",
    targetComponent: "Get-Process & Get-NetTCPConnection Pipeline",
    commandName: "Get-NetTCPConnection | ForEach-Object { ... }",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo saber exactamento qué programa en tu disco abrió la conexión a una IP extraña?",
      mythVsTruth: {
        mentira: "Un PID de conexión de red no puede cruzarse con el nombre del ejecutable en PowerShell.",
        verdad: "Con un simple pipeline se cruza el 'OwningProcess' de Get-NetTCPConnection con la propiedad 'Path' de Get-Process.",
        comprobalo: "Get-NetTCPConnection -State Established | Select-Object RemoteAddress, RemotePort, OwningProcess, @{N='ProcessName';E={(Get-Process -Id $_.OwningProcess).ProcessName}}"
      }
    },
    entende: {
      queEs: "Técnica de correlación de datos que asocia un identificador numérico de proceso (PID) con la ruta del archivo binario en el disco.",
      paraQueSirve: "Identifica si una conexión saliente proviene de svchost.exe, chrome.exe o un troyano escondido en AppData.",
      quePasaSiFalta: "Es un método de investigación forense fundamental en respuesta a incidentes."
    },
    interactua: {
      cliExample: "powershell \"Get-NetTCPConnection -State Established | Select-Object RemoteAddress, RemotePort, OwningProcess\"",
      psExample: "Get-NetTCPConnection -State Established | Select-Object RemoteAddress, RemotePort, OwningProcess, @{N='Process';E={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}}, @{N='Path';E={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Path}} | Format-Table -AutoSize",
      syntaxBreakdown: "Suma una propiedad calculada en PowerShell para extraer la ruta física (.Path) de la aplicación.",
      whatToLookFor: "Ejecutables ubicados en carpetas temporales (Temp, Downloads) manteniendo conexiones abiertas.",
      technicalMetrics: "Procesamiento local de metadatos del kernel."
    },
    alertaEVO: {
      reversibilityRule: "Operación de auditoría inofensiva de solo lectura.",
      safetyWarning: "Si el proceso ya finalizó, el PID podría no ser resoluble."
    },
    evidenceBadge: {
      code: "EVO-2214",
      label: "PID TO PATH"
    }
  },
  {
    id: "inv-22-15",
    code: "22.15",
    title: "Signature",
    subtitle: "Verificación de firmas digitales (Authenticode) en executables con tráfico de red",
    targetMechanism: "WinVerifyTrust API & Authenticode Subsystem",
    targetComponent: "Cmdlet: Get-AuthenticodeSignature",
    commandName: "Get-AuthenticodeSignature (Get-Process -Id $pid).Path",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo saber si un archivo ejecutable que transmite datos fue firmado legítimamente por su creador?",
      mythVsTruth: {
        mentira: "Cualquier programa puede falsificar el campo 'Empresa/Publisher' en los detalles del archivo ejecutable.",
        verdad: "La firma digital criptográfica Authenticode es infalsificable sin la clave privada del certificado de la entidad emisora.",
        comprobalo: "Get-AuthenticodeSignature 'C:\\Windows\\System32\\svchost.exe'"
      }
    },
    entende: {
      queEs: "Validación criptográfica mediante certificados X.509 empotrados en el encabezado PE (Portable Executable) del binario.",
      paraQueSirve: "Garantiza que el ejecutable no ha sido modificado ni infectado por malware desde su compilación oficial.",
      quePasaSiFalta: "Si el resultado es 'Unsigned' o 'HashMismatch', el archivo carece de garantía de integridad."
    },
    interactua: {
      cliExample: "powershell Get-AuthenticodeSignature C:\\Windows\\System32\\svchost.exe",
      psExample: "Get-AuthenticodeSignature -FilePath (Get-Process -Name svchost)[0].Path | Format-List Status, StatusMessage, SignerCertificate",
      syntaxBreakdown: "Evalúa la cadena de confianza del certificado del ejecutable svchost.exe.",
      whatToLookFor: "Status : Valid para confirmar autenticidad del fabricante.",
      technicalMetrics: "Comprobación de listas de revocación (CRL) e imprecisión de sellos de tiempo."
    },
    alertaEVO: {
      reversibilityRule: "Consulta puramente de inspección de seguridad.",
      safetyWarning: "Existen herramientas legítimas open source sin firma digital que darán resultado 'NotSigned'."
    },
    evidenceBadge: {
      code: "EVO-2215",
      label: "AUTHENTICODE"
    }
  },
  {
    id: "inv-22-16",
    code: "22.16",
    title: "Remote IP",
    subtitle: "Análisis geográfico y de reputación de direcciones IP de destino",
    targetMechanism: "IP Geolocation & Threat Intelligence Lookup",
    targetComponent: "Remote IP Address Field in Sockets",
    commandName: "Resolve-DnsName <RemoteIP>",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Hacia qué país o centro de datos están viajando tus paquetes de datos?",
      mythVsTruth: {
        mentira: "Cualquier dirección IP desconocida conectada a tu PC es un servidor de hackers.",
        verdad: "La inmensa mayoría de las IPs remotas pertenecen a redes de distribución de contenido (Akamai, AWS, Azure, Cloudflare).",
        comprobalo: "Resolve-DnsName '13.107.42.14' -ErrorAction SilentlyContinue"
      }
    },
    entende: {
      queEs: "El destino final en la capa de red (IP) al cual se enrutador los paquetes salientes.",
      paraQueSirve: "Verifica si los destinos corresponden a servicios conocidos de infraestructura pública.",
      quePasaSiFalta: "El desconocimiento de las IPs dificulta la creación de reglas estrictas de Firewall."
    },
    interactua: {
      cliExample: "nslookup 13.107.42.14",
      psExample: "Resolve-DnsName -Name '13.107.42.14' -ErrorAction SilentlyContinue | Select-Object NameHost",
      syntaxBreakdown: "Realiza una consulta de DNS inverso (PTR) para intentar resolver el nombre de dominio asociado a la IP.",
      whatToLookFor: "Hostnames legibles como *.microsoft.com, *.msn.com o *.1e100.net (Google).",
      technicalMetrics: "Respuesta de DNS en milisegundos."
    },
    alertaEVO: {
      reversibilityRule: "Comando seguro de consulta de red DNS.",
      safetyWarning: "No todas las IPs remotas aceptan resolución inversa PTR."
    },
    evidenceBadge: {
      code: "EVO-2216",
      label: "REMOTE IP REPUTATION"
    }
  },
  {
    id: "inv-22-17",
    code: "22.17",
    title: "Port",
    subtitle: "Categorización de servicios por número de puerto de transporte (80, 443, 53, 445)",
    targetMechanism: "IANA Standard Port Mapping",
    targetComponent: "C:\\Windows\\System32\\drivers\\etc\\services",
    commandName: "Get-Content C:\\Windows\\System32\\drivers\\etc\\services",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Qué significa que una conexión use el puerto 443 en comparación con el puerto 80 o 8080?",
      mythVsTruth: {
        mentira: "Los números de puerto son completamente aleatorios y no indican el protocolo subyacente.",
        verdad: "Los puertos por debajo del 1024 son 'puertos conocidos' asignados por IANA a protocolos estándar (443=HTTPS, 80=HTTP, 53=DNS).",
        comprobalo: "Get-Content C:\\Windows\\System32\\drivers\\etc\\services | Select-String \"443/tcp\""
      }
    },
    entende: {
      queEs: "El punto final de comunicación lógico en el protocolo TCP/UDP para direccionar el tráfico al servicio adecuado.",
      paraQueSirve: "Permite diferenciar entre tráfico web cifrado (443), resolución de nombres (53) y recursos compartidos (445).",
      quePasaSiFalta: "Sin puertos, un único sistema operativo no podría ejecutar múltiples aplicaciones web simultáneas."
    },
    interactua: {
      cliExample: "findstr /i \"443/tcp\" C:\\Windows\\System32\\drivers\\etc\\services",
      psExample: "Get-Content C:\\Windows\\System32\\drivers\\etc\\services | Select-String \"443/tcp\"",
      syntaxBreakdown: "Lee el archivo local de correspondencia de servicios y puertos estándar de Windows.",
      whatToLookFor: "Mapeo de número de puerto contra nombre oficial del servicio.",
      technicalMetrics: "Archivo de texto plano estático en System32."
    },
    alertaEVO: {
      reversibilityRule: "Lectura del archivo local de configuración de servicios.",
      safetyWarning: "Un malware puede usar deliberadamente el puerto 443 para camuflar tráfico no HTTPS."
    },
    evidenceBadge: {
      code: "EVO-2217",
      label: "IANA PORTS"
    }
  },
  {
    id: "inv-22-18",
    code: "22.18",
    title: "Frequency",
    subtitle: "Análisis de intervalos de balizamiento (Beaconing) y persistencia de red",
    targetMechanism: "Periodic Network Telemetry Cadence",
    targetComponent: "Task Scheduler / Event Logs",
    commandName: "Get-ScheduledTask | Where-Object { $_.State -eq 'Running' }",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo se detecta un canal C2 (Command and Control) o una telemetría recurrente?",
      mythVsTruth: {
        mentira: "Las conexiones legítimas se transmiten de forma ininterrumpida cada milisegundo.",
        verdad: "Los servicios programan transmisiones periódicas (beaconing) cada 15, 30 o 60 minutos para reducir consumo de energía.",
        comprobalo: "Get-ScheduledTask | Where-Object { $_.TaskPath -like \"*Microsoft*Windows*Customer Experience*\" }"
      }
    },
    entende: {
      queEs: "Patrón de frecuencia con el que una aplicación o servicio despierta y transmite datos a la red.",
      paraQueSirve: "Diferencia descargas iniciadas manualmente por el usuario de tareas automáticas en segundo plano.",
      quePasaSiFalta: "El análisis de frecuencia es crucial para descubrir troyanos de acceso remoto (RATs)."
    },
    interactua: {
      cliExample: "schtasks /query /FO TABLE | findstr /i \"Telemetry\"",
      psExample: "Get-ScheduledTask | Where-Object { $_.TaskName -like \"*Telemetry*\" -or $_.TaskName -like \"*Consolidator*\" } | Select-Object TaskName, State",
      syntaxBreakdown: "Lista las tareas programadas de consolidación de telemetría y su estado operativo.",
      whatToLookFor: "Tareas con disparadores de repetición corta (ej. cada 5 minutos).",
      technicalMetrics: "Evaluación de temporizadores de Task Scheduler."
    },
    alertaEVO: {
      reversibilityRule: "Las tareas programadas pueden deshabilitarse o habilitarse individualmente.",
      safetyWarning: "Desactivar tareas de mantenimiento del sistema puede derivar en acumulación de temporales."
    },
    evidenceBadge: {
      code: "EVO-2218",
      label: "BEACON FREQUENCY"
    }
  },
  {
    id: "inv-22-19",
    code: "22.19",
    title: "Context",
    subtitle: "Evaluación contextual del usuario, sesión de ejecución y árbol de procesos",
    targetMechanism: "Process Security Context & Token Privileges",
    targetComponent: "whoami.exe / Get-Process Parent ID",
    commandName: "whoami /priv",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Bajo qué cuenta y nivel de privilegio se ejecutan los procesos de telemetría?",
      mythVsTruth: {
        mentira: "La telemetría siempre se ejecuta con privilegios absolutos de NT AUTHORITY\\SYSTEM.",
        verdad: "Muchos servicios operan con cuentas con privilegios reducidos como NT AUTHORITY\\LOCAL SERVICE para acotar riesgos.",
        comprobalo: "whoami"
      }
    },
    entende: {
      queEs: "Entorno de seguridad e identidad bajo el cual se ejecuta un proceso en el subsistema Win32.",
      paraQueSirve: "Define a qué archivos, claves del registro y puertos de red tiene permiso de acceso el programa.",
      quePasaSiFalta: "Sin aislamiento de contexto, cualquier vulnerabilidad en un servicio de red otorgaría control total."
    },
    interactua: {
      cliExample: "whoami /priv",
      psExample: "Get-Process -Name svchost | Select-Object Id, ProcessName, @{N='User';E={(Get-WmiObject Win32_Process -Filter \"ProcessId=$($_.Id)\").GetOwner().User}} | Select-Object -First 5",
      syntaxBreakdown: "Obtiene el propietario real del proceso svchost mediante la API WMI.",
      whatToLookFor: "Diferenciación entre SYSTEM, LOCAL SERVICE y el usuario interactivo.",
      technicalMetrics: "Evaluación de tokens de acceso e suplantación."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de diagnóstico inofensiva.",
      safetyWarning: "No modifiques la identidad de los servicios del sistema en el Administrador de Servicios."
    },
    evidenceBadge: {
      code: "EVO-2219",
      label: "SECURITY CONTEXT"
    }
  },
  {
    id: "inv-22-20",
    code: "22.20",
    title: "“¿Quién te espía?” sin paranoia",
    subtitle: "Diferenciación técnica entre telemetría legítima de OS, métricas de apps y spyware",
    targetMechanism: "System Privacy & Telemetry Triage Matrix",
    targetComponent: "Security Triage Process",
    commandName: "Get-Process | Where-Object { $_.Company -notlike \"*Microsoft*\" }",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo distinguir la paranoia infundada de un problema real de invasión de privacidad?",
      mythVsTruth: {
        mentira: "Todo ejecutable que se conecta a la red sin pedir confirmación previa es spyware.",
        verdad: "Navegadores, verificadores de revocación SSL y clientes de juegos envían métricas legítimas de rendimiento.",
        comprobalo: "Get-Process | Where-Object { $_.Path -and $_.Company -notlike \"*Microsoft*\" } | Select-Object ProcessName, Company, Path"
      }
    },
    entende: {
      queEs: "Un marco metodológico de análisis para clasificar tráfico y procesos sospechosos en tres categorías: OS Core, Third-Party Telemetry y Malware.",
      paraQueSirve: "Evita la desactivación indiscriminada de servicios que termina rompiendo el sistema operativo.",
      quePasaSiFalta: "Permite tomar decisiones informadas en lugar de ejecutar scripts de 'debloat' a ciegas."
    },
    interactua: {
      cliExample: "powershell \"Get-Process | Where-Object { $_.Company -notlike '*Microsoft*' }\"",
      psExample: "Get-Process | Where-Object { $_.Path -and $_.Company -notlike \"*Microsoft*\" -and $_.Company -notlike \"*Google*\" } | Select-Object ProcessName, Company, Path | Format-Table -AutoSize",
      syntaxBreakdown: "Filtra procesos ejecutándose desde rutas físicas excluyendo a los fabricantes principales confiables.",
      whatToLookFor: "Binarios sin firma ni nombre de compañía en la tabla.",
      technicalMetrics: "Triage analítico basado en metadatos del binario."
    },
    alertaEVO: {
      reversibilityRule: "Metodología de análisis de seguridad.",
      safetyWarning: "Usar scripts automatizados de 'Debloat' descargados de la web suele dañar componentes de Windows Update y Xbox Live."
    },
    evidenceBadge: {
      code: "EVO-2220",
      label: "PRIVACY TRIAGE"
    }
  },
  {
    id: "inv-22-21",
    code: "22.21",
    title: "SRUDB.dat",
    subtitle: "System Resource Usage Monitor DB: Base de datos forense de consumo de red y energía",
    targetMechanism: "System Resource Usage Monitor (SRUM) Engine",
    targetComponent: "C:\\Windows\\System32\\SRU\\SRUDB.dat / esent.dll Engine",
    commandName: "Get-ChildItem C:\\Windows\\System32\\SRU\\SRUDB.dat",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que Windows guarda un registro histórico exacto de cuántos megabytes transmitió cada app en los últimos 30 días?",
      mythVsTruth: {
        mentira: "Windows no lleva un registro histórico detallado de consumo de datos por aplicación.",
        verdad: "La base de datos ESE (Extensible Storage Engine) SRUDB.dat graba cada 60 minutos el consumo de red, CPU y batería por proceso.",
        comprobalo: "Get-ChildItem 'C:\\Windows\\System32\\SRU\\SRUDB.dat'"
      }
    },
    entende: {
      queEs: "La base de datos del servicio SRUM (System Resource Usage Monitor) formateada en motor JET/ESE.",
      paraQueSirve: "Alimenta la sección 'Uso de datos' en Configuración de red y es un artefacto clave en análisis forense.",
      quePasaSiFalta: "Si se elimina o corrompe, se borra la estadística de consumo acumulado de red de las apps."
    },
    interactua: {
      cliExample: "dir C:\\Windows\\System32\\SRU\\SRUDB.dat",
      psExample: "Get-Item 'C:\\Windows\\System32\\SRU\\SRUDB.dat' | Select-Object Name, Length, LastWriteTime",
      syntaxBreakdown: "Verifica la existencia y la última fecha de actualización de la base de datos SRUM.",
      whatToLookFor: "Archivo de varios megabytes actualizado continuamente.",
      technicalMetrics: "Estructura de tablas ESE de Microsoft."
    },
    alertaEVO: {
      reversibilityRule: "Archivo bloqueado en exclusivo por el servicio DPS (Diagnostic Policy Service).",
      safetyWarning: "No intente modificar directamente este archivo mientras el sistema está en marcha."
    },
    evidenceBadge: {
      code: "EVO-2221",
      label: "SRUM FORENSICS"
    }
  },
  {
    id: "inv-22-22",
    code: "22.22",
    title: "Qué registra y qué NO demuestra",
    subtitle: "Interpretación adecuada de evidencia forense de red e historial de ejecución",
    targetMechanism: "Forensic Evidence Correlation & Validation",
    targetComponent: "Event Logs / SRUM / Prefetch",
    commandName: "Get-WinEvent -ListLog * -ErrorAction SilentlyContinue",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Ver una conexión registrada o una entrada en SRUDB.dat demuestra por sí sola una exfiltración de datos?",
      mythVsTruth: {
        mentira: "Que un proceso figure con megabytes transmitidos en SRUDB.dat demuestra que robó tus documentos personales.",
        verdad: "SRUDB.dat registra volumen de bytes transmitidos, no el contenido de los paquetes ni el payload real.",
        comprobalo: "Get-WinEvent -ListLog Microsoft-Windows-Diagnostics-Performance/Operational -ErrorAction SilentlyContinue"
      }
    },
    entende: {
      queEs: "Principio de prudencia en análisis forense digital para evitar falsas acusaciones de filtración.",
      paraQueSirve: "Diferencia la prueba de actividad de red (volumen) de la prueba de contenido (payload).",
      quePasaSiFalta: "Previene conclusiones erróneas en investigaciones de ciberseguridad."
    },
    interactua: {
      cliExample: "wevtutil gl System",
      psExample: "Get-WinEvent -LogName System -MaxEvents 5 | Select-Object TimeCreated, ProviderName, Message",
      syntaxBreakdown: "Muestra eventos del registro de sistema para contextualizar la actividad previa.",
      whatToLookFor: "Correlación entre marcas de tiempo de eventos y picos de tráfico.",
      technicalMetrics: "Análisis de logs de eventos EVTX."
    },
    alertaEVO: {
      reversibilityRule: "Evaluación analítica sin impacto en la configuración.",
      safetyWarning: "Para probar exfiltración real de contenido se requiere captura previa con Wireshark/Pktmon."
    },
    evidenceBadge: {
      code: "EVO-2222",
      label: "EVIDENCE LIMITS"
    }
  },
  {
    id: "inv-22-23",
    code: "22.23",
    title: "Privacy Audit EVO",
    subtitle: "Auditoría integral automatizada del estado de privacidad y telemetría en el sistema",
    targetMechanism: "EVO Privacy Master Auditor Script",
    targetComponent: "Comprehensive Audit Script",
    commandName: "Get-Service DiagTrack, WerSvc, lfsvc, CDPSvc | Select-Object Name, Status, StartType",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo ejecutar una auditoría completa de 360 grados sobre la privacidad de tu instalación de Windows?",
      mythVsTruth: {
        mentira: "Para auditar la privacidad necesitas comprar software privativo costoso.",
        verdad: "Un script de PowerShell nativo puede inspeccionar los servicios de telemetría, políticas de registro y permisos de hardware en segundos.",
        comprobalo: "Get-Service DiagTrack, WerSvc, lfsvc, CDPSvc | Format-Table -AutoSize"
      }
    },
    entende: {
      queEs: "El procedimiento unificado de auditoría EVO para certificar el nivel de endurecimiento de privacidad del equipo.",
      paraQueSirve: "Genera un diagnóstico claro de los canales de comunicación y recopilación activos.",
      quePasaSiFalta: "Permite al administrador validar la postura de privacidad antes de desplegar equipos en producción."
    },
    interactua: {
      cliExample: "powershell \"Get-Service DiagTrack, WerSvc, lfsvc, CDPSvc\"",
      psExample: "@('DiagTrack','WerSvc','lfsvc','CDPSvc','wlidsvc') | ForEach-Object { Get-Service $_ -ErrorAction SilentlyContinue } | Select-Object DisplayName, Status, StartType | Format-Table -AutoSize",
      syntaxBreakdown: "Itera sobre la lista de servicios clave de privacidad y genera un reporte unificado.",
      whatToLookFor: "Estado de ejecución y tipo de arranque de los 5 pilares de servicios de diagnóstico.",
      technicalMetrics: "Ejecución completa en menos de 1 segundo."
    },
    alertaEVO: {
      reversibilityRule: "Script de auditoría de solo lectura para diagnóstico defensivo.",
      safetyWarning: "Guarda el informe impreso para contrastarlo tras cada actualización semestral de Windows."
    },
    evidenceBadge: {
      code: "EVO-2223",
      label: "PRIVACY AUDIT MASTER"
    }
  }
];

export const SECTOR_22_MINICASES: Sector22MiniCase[] = [
  {
    id: "case-22-01",
    code: "CASE-2201",
    title: "El misterio de DiagTrack deshabilitado y las actualizaciones fallidas",
    scenario: "Un usuario ejecutó un script 'privacy debloat' descargado de un foro no oficial. Tras reiniciar, notas que Windows Update reporta errores intermitentes al instalar actualizaciones acumulativas.",
    userStatement: "Desactivé toda la telemetría para que nadie me vigile, pero ahora Windows Update arroja el error 0x80070422 al descargar parches.",
    initialMistake: "Asumir que el servicio DiagTrack es solo espionaje comercial sin relación con la infraestructura de distribución de parches.",
    diagnosticQuestion: "¿Cómo diagnosticar si el fallo de actualización está vinculado al servicio de telemetría y diagnóstico?",
    options: [
      {
        id: "opt-1",
        text: "Verificar el estado del servicio DiagTrack con Get-Service DiagTrack y verificar si el tipo de inicio está en Disabled.",
        isCorrect: true,
        explanation: "DiagTrack maneja la telemetría pero también valida requerimientos de compatibilidad para parches acumulativos en Windows Update."
      },
      {
        id: "opt-2",
        text: "Formatear el equipo e instalar una distribución de Windows modificada sin servicios de red.",
        isCorrect: false,
        explanation: "Formatear es innecesario y usar ISOs modificadas introduce graves riesgos de ciberseguridad."
      },
      {
        id: "opt-3",
        text: "Eliminar la carpeta System32 para forzar la descarga limpia de parches.",
        isCorrect: false,
        explanation: "Destruiría completamente la instalación del sistema operativo."
      }
    ],
    technicalVerdict: "DiagTrack puede ser configurado en inicio 'Manual' o restringirse a nivel 'Required/Basic' mediante directiva de registro en lugar de deshabilitarse completamente.",
    lessonLearned: "La telemetría de diagnóstico no debe deshabilitarse a ciegas; usa directivas de registro para acotar el nivel de recolección sin romper Windows Update."
  },
  {
    id: "case-22-02",
    code: "CASE-2202",
    title: "El consumo de ancho de banda fantasma en OneDrive",
    scenario: "Un usuario en una conexión limitada por datos móviles observa que se consumieron 10 GB de transferencia en segundo plano sin haber abierto el navegador.",
    userStatement: "No descargué nada hoy, pero la conexión estuvo saturada durante toda la mañana.",
    initialMistake: "Pensar que la PC fue infectada con una botnet sin revisar el monitor de recursos de red.",
    diagnosticQuestion: "¿Qué herramientas permiten identificar qué ejecutable consumió los 10 GB de datos?",
    options: [
      {
        id: "opt-1",
        text: "Consultar la base de datos SRUDB.dat o revisar en Configuración -> Red e Internet -> Uso de datos para ver el consumo histórico de OneDrive.exe.",
        isCorrect: true,
        explanation: "SRUDB.dat almacena el consumo exacto en megabytes acumulados por cada ejecutable en los últimos 30 días."
      },
      {
        id: "opt-2",
        text: "Cambiar la dirección MAC de la tarjeta de red.",
        isCorrect: false,
        explanation: "No resuelve la causa raíz de la sincronización de archivos en segundo plano."
      },
      {
        id: "opt-3",
        text: "Poner la computadora en modo avión para siempre.",
        isCorrect: false,
        explanation: "Invalida el uso de la red en la computadora."
      }
    ],
    technicalVerdict: "Configurar la conexión Wi-Fi/Móvil como 'Conexión de uso medido' (Metered Connection) evita que OneDrive sincronice automáticamente archivos voluminosos.",
    lessonLearned: "Usa el monitor de datos SRUDB.dat para auditorías precisas antes de asumir infección por malware."
  }
];

export const SECTOR_22_TEST_BANK: Sector22TestQuestion[] = [
  {
    id: "q-22-01",
    questionNumber: 1,
    category: "Telemetría y Diagnóstico",
    question: "¿Cuál es el nombre del servicio nativo de Windows encargado de recopilar y empaquetar eventos de telemetría y experiencias de usuario conectadas?",
    options: [
      { id: "opt-a", text: "DiagTrack (Connected User Experiences and Telemetry)" },
      { id: "opt-b", text: "Spooler (Print Subsystem)" },
      { id: "opt-c", text: "wuauserv (Windows Update Service)" },
      { id: "opt-d", text: "BITS (Background Intelligent Transfer Service)" }
    ],
    correctOptionId: "opt-a",
    technicalExplanation: "DiagTrack es el identificador oficial del servicio Connected User Experiences and Telemetry en Windows.",
    relatedInvestigationCode: "22.01"
  },
  {
    id: "q-22-02",
    questionNumber: 2,
    category: "Conexiones de Red",
    question: "¿Qué cmdlet de PowerShell permite auditar sockets TCP activos devolviendo un objeto estructurado con puerto local, puerto remoto y PID?",
    options: [
      { id: "opt-a", text: "Get-NetTCPConnection" },
      { id: "opt-b", text: "ipconfig /all" },
      { id: "opt-c", text: "ping localhost" },
      { id: "opt-d", text: "Get-Process -Name System" }
    ],
    correctOptionId: "opt-a",
    technicalExplanation: "Get-NetTCPConnection es el cmdlet oficial del módulo NetTCPIP para inspeccionar la tabla de sockets TCP.",
    relatedInvestigationCode: "22.13"
  },
  {
    id: "q-22-03",
    questionNumber: 3,
    category: "Artefactos Forenses",
    question: "¿Qué archivo de base de datos de Windows guarda el registro histórico acumulado de consumo de red y recursos por aplicación de los últimos 30 días?",
    options: [
      { id: "opt-a", text: "SRUDB.dat (ubicado en C:\\Windows\\System32\\SRU)" },
      { id: "opt-b", text: "NTUSER.DAT" },
      { id: "opt-c", text: "pagefile.sys" },
      { id: "opt-d", text: "hosts" }
    ],
    correctOptionId: "opt-a",
    technicalExplanation: "SRUDB.dat es mantenido por el motor SRUM para registrar consumo histórico de CPU, bytes enviados y recibidos por app.",
    relatedInvestigationCode: "22.21"
  }
];
