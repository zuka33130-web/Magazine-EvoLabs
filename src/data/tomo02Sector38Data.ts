// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 38: CREÁ TUS HERRAMIENTAS
// "Dejá de descargar herramientas: fabricá las tuyas"

export type RiskLevelSector38 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector38Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector38;
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

export interface Sector38MiniCase {
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

export interface Sector38TestQuestion {
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
}

export const SECTOR_38_INVESTIGATIONS: Sector38Investigation[] = [
  {
    id: "inv-38-01",
    code: "38.01",
    title: "EVO System Audit",
    subtitle: "Extracción integral de telemetría de hardware, BIOS/UEFI, CPU y buses",
    targetMechanism: "WMI/CIM Unified Architecture & SMBIOS Tables",
    targetComponent: "Get-CimInstance / Win32_ComputerSystem / Win32_BIOS",
    commandName: "Get-CimInstance Win32_OperatingSystem",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El 90% de los técnicos descargan AIDA64 o Speccy para saber la marca de la placa madre o la versión del BIOS. Windows ya tiene esa información nativa accesible en 50 milisegundos.",
      mythVsTruth: {
        mentira: "Se necesita software de terceros para auditar el hardware de un equipo a fondo.",
        verdad: "El subsistema WMI/CIM expone las tablas SMBIOS crudas con precisión absoluta sin instalar ningún ejecutable externo.",
        comprobalo: "Corre `Get-CimInstance Win32_BaseBoard | Select-Object Manufacturer, Product, SerialNumber` en PowerShell: respuesta instantánea y sin telemetría espía."
      }
    },
    entende: {
      queEs: "El módulo base para la recolección estandarizada de identidad técnica del equipo (Hostname, Fabricante, Modelo, Arquitectura, Firmware y Versión de Build).",
      paraQueSirve: "Generar la ficha de cabecera pericial obligatoria antes de cualquier diagnóstico o intervención de soporte.",
      quePasaSiFalta: "Se aplican drivers o scripts para versiones erróneas de Windows causando incompatibilidades críticas."
    },
    interactua: {
      cliExample: "wmic bios get serialnumber,smbiosbiosversion",
      psExample: "[PSCustomObject]@{ Host=$env:COMPUTERNAME; OS=(Get-CimInstance Win32_OperatingSystem).Caption; Build=(Get-CimInstance Win32_OperatingSystem).BuildNumber; BIOS=(Get-CimInstance Win32_BIOS).SMBIOSBIOSVersion } | Format-List",
      syntaxBreakdown: "Compila un objeto nativo de PowerShell en memoria con la ficha técnica completa del sistema.",
      whatToLookFor: "Build exacta (ej. 22631 para Windows 11 23H2) y estado de SecureBoot.",
      technicalMetrics: "Tiempo de ejecución < 80 ms; huella de RAM en ejecución < 5 MB."
    },
    alertaEVO: {
      reversibilityRule: "Operación de solo lectura pura sobre el repositorio CIM.",
      safetyWarning: "No utilices el cmdlet obsoleto Get-WmiObject en entornos modernos; prefiere siempre Get-CimInstance por seguridad y compatibilidad WSMAN."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3801",
      label: "System Audit Framework"
    }
  },
  {
    id: "inv-38-02",
    code: "38.02",
    title: "EVO Process Audit",
    subtitle: "Rastreo de ancestros PID/PPID, firmas digitales de binarios y hashes SHA-256",
    targetMechanism: "Process Tree Parent-Child Traversal & Authenticode Verification",
    targetComponent: "Win32_Process / Get-AuthenticodeSignature / Get-FileHash",
    commandName: "Get-Process / Get-AuthenticodeSignature",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Un proceso llamado svchost.exe no es seguro solo por su nombre. ¿Cómo sabes si es legítimo? Tu propia herramienta debe auditar si su ejecutable está firmado por Microsoft y si su proceso padre es services.exe.",
      mythVsTruth: {
        mentira: "Para detectar procesos sospechosos hay que subir toda la memoria a la nube.",
        verdad: "Validar la firma Authenticode localmente y verificar la genealogía PPID descarta el 99% de los troyanos en segundos.",
        comprobalo: "Usa `Get-AuthenticodeSignature` sobre cualquier binario en ejecución: si el estado no es 'Valid', el proceso es sospechoso."
      }
    },
    entende: {
      queEs: "Herramienta que lista cada proceso en memoria, su ruta en disco, su PID, su padre (PPID) y el estado de su firma criptográfica.",
      paraQueSirve: "Detectar mineros de criptomonedas, malware sigiloso y procesos huérfanos que saturan el procesador.",
      quePasaSiFalta: "Un proceso malicioso puede camuflarse con el nombre de un servicio del sistema sin ser detectado a simple vista."
    },
    interactua: {
      cliExample: "wmic process get name,processid,parentprocessid,executablepath",
      psExample: "Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name, Path, @{N='Signed';E={(Get-AuthenticodeSignature $_.Path -ErrorAction SilentlyContinue).Status}} | Where-Object { $_.Signed -ne 'Valid' -and $_.Path }",
      syntaxBreakdown: "Identifica procesos activos cuyos binarios en disco no cuentan con firma digital WHQL o corporativa válida.",
      whatToLookFor: "Procesos ejecutándose desde `C:\\Users\\...\\AppData\\Local\\Temp` o con firma 'NotSigned'.",
      technicalMetrics: "Tiempo de verificación de firma: aprox. 2 ms por binario."
    },
    alertaEVO: {
      reversibilityRule: "Operación de inspección pasiva.",
      safetyWarning: "No termines procesos basándote únicamente en que no están firmados; software de código abierto legítimo puede no tener firma digital paga."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3802",
      label: "Process Genealogy Audit"
    }
  },
  {
    id: "inv-38-03",
    code: "38.03",
    title: "EVO Memory Audit",
    subtitle: "Desglose pericial de Working Set, Private Bytes, Paged y Non-Paged Pool",
    targetMechanism: "Kernel Virtual Memory Allocation & Kernel Pool Tracking",
    targetComponent: "Win32_OperatingSystem / Win32_PerfFormattedData_PerfOS_Memory",
    commandName: "Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿El Administrador de Tareas dice que el 90% de la RAM está ocupada pero la suma de los procesos apenas da 3 GB? Tienes un memory leak en el Non-Paged Pool del Kernel que los programas comunes no muestran.",
      mythVsTruth: {
        mentira: "La memoria que falta está siendo consumida por virus invisibles.",
        verdad: "Es un driver de dispositivo (por ej. un adaptador de red Killer o placa de sonido) que solicita memoria al Kernel y olvida liberarla (ExAllocatePoolWithTag).",
        comprobalo: "Tu herramienta EVO puede leer `PoolNonpagedBytes`: si supera los 800 MB, tienes un leak de driver confirmado."
      }
    },
    entende: {
      queEs: "Auditor que analiza las tres dimensiones de la memoria: espacio de usuario (Working Set), memoria comprometida (Commit Limit) y reservas del Kernel (Pools).",
      paraQueSirve: "Explicar matemáticamente por qué una PC se queda sin memoria sin tener que adivinar o reiniciar.",
      quePasaSiFalta: "Se le hace comprar más memoria RAM al cliente cuando el problema se resolvía actualizando un driver defectuoso."
    },
    interactua: {
      cliExample: "typeperf \"\\Memory\\Pool Nonpaged Bytes\" \"\\Memory\\Pool Paged Bytes\" -sc 3",
      psExample: "Get-CimInstance Win32_OperatingSystem | Select-Object @{N='TotalRAM_GB';E={[math]::Round($_.TotalVisibleMemorySize/1MB,2)}}, @{N='FreeRAM_GB';E={[math]::Round($_.FreePhysicalMemory/1MB,2)}}, @{N='PoolNonpaged_MB';E={[math]::Round((Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory).PoolNonpagedBytes/1MB,2)}}",
      syntaxBreakdown: "Calcula en tiempo real la memoria total, libre y la porción no paginable del Kernel en megabytes.",
      whatToLookFor: "PoolNonpaged_MB superior a 1024 MB sostenido en el tiempo.",
      technicalMetrics: "Commit Charge / Commit Limit ratio: alertas cuando supera el 85%."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico de solo lectura.",
      safetyWarning: "No uses herramientas de 'optimización de RAM' que fuercen SetProcessWorkingSetSize; solo degradan el rendimiento enviando datos útiles al disco."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3803",
      label: "Kernel Memory Auditor"
    }
  },
  {
    id: "inv-38-04",
    code: "38.04",
    title: "EVO Services Audit",
    subtitle: "Auditoría de servicios no nativos, rutas de binarios y permisos ACL débiles",
    targetMechanism: "Service Control Manager Database & Unquoted Service Paths",
    targetComponent: "Win32_Service / sc.exe / Security Descriptors",
    commandName: "Get-CimInstance Win32_Service",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Si un servicio de Windows tiene una ruta sin comillas con espacios (ej. `C:\\Program Files\\Mi App\\servicio.exe`), cualquier usuario puede escalar a privilegios SYSTEM.",
      mythVsTruth: {
        mentira: "Todos los servicios instalados en Windows son seguros porque pasaron el instalador.",
        verdad: "Muchos instaladores de terceros dejan vulnerabilidades de 'Unquoted Service Path' y configuran servicios innecesarios en inicio automático permanente.",
        comprobalo: "Tu herramienta EVO puede filtrar todos los servicios que no tengan el PathName encerrado entre comillas dobles y contengan espacios."
      }
    },
    entende: {
      queEs: "Herramienta que analiza el inventario de servicios: estado actual, tipo de inicio, cuenta de ejecución (LocalSystem vs NetworkService) y seguridad de ruta.",
      paraQueSirve: "Descubrir servicios zombies, software no deseado que arranca como servicio y brechas de seguridad locales.",
      quePasaSiFalta: "Servicios residuales de software desinstalado consumen CPU y ciclos de disco en segundo plano."
    },
    interactua: {
      cliExample: "wmic service where \"not pathname like '\"%' and pathname like '% %'\" get name,pathname",
      psExample: "Get-CimInstance Win32_Service | Where-Object { $_.PathName -notmatch '^\"' -and $_.PathName -match ' ' } | Select-Object Name, StartMode, PathName",
      syntaxBreakdown: "Encuentra todos los servicios con vulnerabilidad de ruta sin comillas ejecutándose en el equipo.",
      whatToLookFor: "Rutas vulnerables de software de terceros susceptibles a DLL hijacking o inyección de binarios.",
      technicalMetrics: "Conteo total de servicios en 'Running': ideal < 90 en sistemas limpios."
    },
    alertaEVO: {
      reversibilityRule: "La detección es 100% segura; para corregir se usa `sc config [nombre] binpath= \"...\"`.",
      safetyWarning: "Nunca deshabilites servicios de Microsoft con nombres crípticos sin consultar antes el catálogo oficial de dependencias de Windows."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3804",
      label: "Service Security Scanner"
    }
  },
  {
    id: "inv-38-05",
    code: "38.05",
    title: "EVO Startup Audit",
    subtitle: "Mapeo exhaustivo de los 12 puntos de persistencia de inicio automático de Windows",
    targetMechanism: "Autoruns Locations: Registry Run keys, Startup folders, Scheduled Tasks & WMI Event Consumers",
    targetComponent: "HKLM\\...\\Run / shell:startup / Win32_StartupCommand",
    commandName: "Get-CimInstance Win32_StartupCommand",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El Administrador de Tareas solo te muestra el 30% de las cosas que arrancan con tu PC. El 70% restante se oculta en Tareas Programadas, Servicios y Consumidores de Eventos WMI.",
      mythVsTruth: {
        mentira: "Revisar la pestaña 'Inicio' del Administrador de Tareas es suficiente para ver qué arranca con Windows.",
        verdad: "El malware y los instaladores modernos usan Tareas Programadas ocultas o llaves RunOnce para evadir la pestaña básica de Windows.",
        comprobalo: "Tu herramienta EVO cruza las claves de Registro Run, RunOnce, Carpeta de Inicio y Tareas de TaskScheduler en un único reporte consolidado."
      }
    },
    entende: {
      queEs: "Auditor que compila todos los mecanismos por los cuales un ejecutable puede lograr ejecución automática al iniciar sesión o encender el sistema.",
      paraQueSirve: "Reducir el tiempo de inicio de Windows de 60 segundos a menos de 10 segundos eliminando basura de arranque.",
      quePasaSiFalta: "La PC arranca lenta y con 15 aplicaciones residentes consumiendo ancho de banda y batería sin que el usuario lo sepa."
    },
    interactua: {
      cliExample: "wmic startup get caption,command,location",
      psExample: "Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location, User | Format-Table -AutoSize",
      syntaxBreakdown: "Lista las entradas de persistencia de inicio registradas tanto en HKLM como en HKCU.",
      whatToLookFor: "Binarios no identificados, scripts de PowerShell en Base64 o ejecutables con nombres aleatorios.",
      technicalMetrics: "Tiempo de impacto de inicio (Startup Impact Delay) acumulado en milisegundos."
    },
    alertaEVO: {
      reversibilityRule: "Deshabilitar una entrada de arranque se hace cambiando su valor a clave backup sin borrar el ejecutable.",
      safetyWarning: "No deshabilites el controlador del panel de audio (Realtek) ni el controlador de trackpad de laptops."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3805",
      label: "Startup Persistence Mapper"
    }
  },
  {
    id: "inv-38-06",
    code: "38.06",
    title: "EVO Network Audit",
    subtitle: "Correlación en vivo de sockets TCP/UDP abiertos con el PID y nombre del proceso",
    targetMechanism: "TCP/IP Connection Table & Netstat Sockets Mapping",
    targetComponent: "Get-NetTCPConnection / netstat -ano / IP Routing Table",
    commandName: "Get-NetTCPConnection -State Established",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Hay algún proceso en tu computadora enviando tus datos a un servidor en Rusia o China en este momento? Tu herramienta EVO puede mapear cada socket abierto con su proceso exacto en 1 línea.",
      mythVsTruth: {
        mentira: "Un firewall bloquea automáticamente todas las conexiones salientes maliciosas.",
        verdad: "La gran mayoría de los firewalls permiten todo el tráfico saliente por los puertos 80 y 443 sin verificar qué proceso lo originó.",
        comprobalo: "Usa `Get-NetTCPConnection`: te dirá la IP remota, el puerto y el PID exacto que generó la conexión para que lo busques en Task Manager."
      }
    },
    entende: {
      queEs: "Auditor de telemetría de red que mapea conexiones activas (ESTABLISHED, LISTENING, TIME_WAIT) con el binario local y la resolución geográfica o de dominio.",
      paraQueSirve: "Detectar conexiones C2 (Command & Control), exfiltración de datos o software espía en tiempo real.",
      quePasaSiFalta: "Un troyano puede estar robando contraseñas por HTTPS sin que nadie lo note."
    },
    interactua: {
      cliExample: "netstat -ano | findstr \"ESTABLISHED\"",
      psExample: "Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess, @{N='Process';E={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name}} | Where-Object { $_.RemoteAddress -notmatch '^127\\.|^192\\.168\\.|^10\\.' }",
      syntaxBreakdown: "Filtra conexiones TCP establecidas hacia IPs públicas externas y muestra el nombre del proceso que las mantiene.",
      whatToLookFor: "Procesos del sistema (ej. svchost, powershell, rundll32) conectándose a IPs no reconocidas o puertos inusuales.",
      technicalMetrics: "Número total de sockets activos: típicamente < 50 en reposo."
    },
    alertaEVO: {
      reversibilityRule: "La inspección de sockets no interrumpe el tráfico ni cierra conexiones.",
      safetyWarning: "No cierres conexiones del sistema (TCP port 445 o 135) en entornos de red corporativa para no romper la autenticación."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3806",
      label: "Socket-To-PID Correlator"
    }
  },
  {
    id: "inv-38-07",
    code: "38.07",
    title: "EVO Driver Audit",
    subtitle: "Inventario de controladores cargados en Ring 0, firmas digitales y fechas de compilación",
    targetMechanism: "Kernel Driver Subsystem & Driver Store Manifests",
    targetComponent: "driverquery.exe / Get-WindowsDriver / pnputil",
    commandName: "driverquery /v /fo csv",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El 85% de las pantallas azules son causadas por controladores con más de 5 años de antigüedad que colisionan con las actualizaciones acumulativas de Windows.",
      mythVsTruth: {
        mentira: "Windows Update siempre instala el mejor driver disponible para todos tus componentes.",
        verdad: "Windows Update suele instalar drivers genéricos de referencia de Microsoft que carecen de optimizaciones específicas del fabricante del silicio.",
        comprobalo: "Tu herramienta EVO puede ordenar todos los drivers del equipo por fecha de compilación para encontrar piezas obsoletas de 2012."
      }
    },
    entende: {
      queEs: "Herramienta que audita todos los módulos .sys cargados en el espacio de memoria del Kernel, su estado de firma y su antigüedad.",
      paraQueSirve: "Prevenir BSODs identificando drivers antiguos de tarjetas Wi-Fi, audio o chipsets antes de que hagan crashear el sistema.",
      quePasaSiFalta: "El equipo sufre inestabilidades inexplicables y cuelgues aleatorios que se atribuyen falsamente al hardware."
    },
    interactua: {
      cliExample: "driverquery /v",
      psExample: "Get-CimInstance Win32_PnPSignedDriver | Select-Object DeviceName, DriverVersion, DriverDate, Manufacturer, IsSigned | Where-Object { $_.IsSigned -eq $false -or $_.DriverDate -lt (Get-Date).AddYears(-4) } | Select-Object -First 10",
      syntaxBreakdown: "Encuentra controladores instalados que no están firmados o cuya fecha de compilación tiene más de 4 años de antigüedad.",
      whatToLookFor: "Drivers sin firma (IsSigned: False) o drivers de fabricantes desaparecidos.",
      technicalMetrics: "Antigüedad promedio de los controladores instalados: idealmente < 2 años."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico pasiva.",
      safetyWarning: "Nunca elimines un driver de almacenamiento o chipset sin verificar que existe un reemplazo oficial descargado."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3807",
      label: "Ring 0 Driver Auditor"
    }
  },
  {
    id: "inv-38-08",
    code: "38.08",
    title: "EVO Event Audit",
    subtitle: "Extracción relámpago de eventos críticos de nivel Error y Crítico en los últimos 7 días",
    targetMechanism: "Windows Event Log (EVTX) Query Engine & XPath Filtering",
    targetComponent: "Get-WinEvent / wevtutil.exe / System & Application Logs",
    commandName: "Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2}",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Abrir el Visor de Eventos nativo de Windows tarda 30 segundos y te abruma con 50.000 líneas irrelevantes. Tu herramienta EVO puede filtrar los 5 errores reales que ocurrieron hoy en 1 segundo.",
      mythVsTruth: {
        mentira: "Cualquier advertencia en el Visor de Eventos significa que Windows está roto.",
        verdad: "Windows registra miles de eventos informativos normales; lo único que importa son los eventos de Nivel 1 (Crítico) y Nivel 2 (Error) vinculados a fallos de hardware o cuelgues de apps.",
        comprobalo: "Usa `Get-WinEvent` con un filtro hashtable por nivel de severidad y fecha: obtendrás un diagnóstico forense instantáneo."
      }
    },
    entende: {
      queEs: "Extractor forense automatizado que consulta la base de datos de eventos para aislar fallos de hardware, cuelgues de aplicaciones (Event ID 1000) y apagados forzados (Event ID 41).",
      paraQueSirve: "Descubrir la causa exacta de por qué la PC se reinició sola anoche o por qué se cerró un juego sin dar error en pantalla.",
      quePasaSiFalta: "El técnico pierde horas tratando de replicar un fallo intermitente que ya estaba perfectamente registrado en los logs."
    },
    interactua: {
      cliExample: "wevtutil qe System \"/q:*[System[(Level=1 or Level=2) and TimeCreated[timediff(@SystemTime) <= 86400000]]]\" /f:text /c:5",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddDays(-1)} -MaxEvents 10 | Select-Object TimeCreated, ProviderName, Id, Message | Format-Table -Wrap",
      syntaxBreakdown: "Extrae los últimos 10 errores críticos ocurridos en el registro de Sistema en las últimas 24 horas.",
      whatToLookFor: "Event ID 41 (Kernel-Power: apagado sucio), Event ID 7 (Disk: bloque dañado) o WHEA-Logger (fallo de hardware de CPU/PCIe).",
      technicalMetrics: "Frecuencia de errores críticos: debe ser 0 en equipos estables de producción."
    },
    alertaEVO: {
      reversibilityRule: "La lectura de logs no modifica ni elimina ningún registro.",
      safetyWarning: "No uses scripts que borren todos los logs de eventos con `wevtutil cl`: destruyes la evidencia pericial para diagnosticar futuros problemas."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3808",
      label: "EVTX Forensic Query"
    }
  },
  {
    id: "inv-38-09",
    code: "38.09",
    title: "EVO Privacy Audit",
    subtitle: "Auditoría de telemetría de diagnóstico, publicidad segmentada y servicios de rastreo",
    targetMechanism: "Connected User Experiences and Telemetry (DiagTrack) & Advertising ID",
    targetComponent: "diagtrack / dmwappushservice / AllowTelemetry registry",
    commandName: "Get-Service diagtrack",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Windows incluye un servicio llamado DiagTrack que recopila telemetría de uso y la envía a servidores de Microsoft. Tu herramienta EVO puede auditar el nivel exacto de telemetría activo en el sistema.",
      mythVsTruth: {
        mentira: "Para desactivar la telemetría hay que romper componentes del sistema con programas destructivos.",
        verdad: "Windows tiene políticas de grupo (GPO) oficiales para reducir la telemetría al nivel mínimo de seguridad sin romper Windows Update ni la Tienda.",
        comprobalo: "Tu herramienta EVO puede consultar el valor de `AllowTelemetry` en el Registro para verificar si está en 0 (Seguridad), 1 (Básica) o 3 (Completa)."
      }
    },
    entende: {
      queEs: "Auditor de configuraciones de privacidad, ID publicitario, recolección de datos de escritura y sensores de ubicación en Windows.",
      paraQueSirve: "Conocer con transparencia técnica qué datos están siendo recolectados y transmitidos por el sistema operativo.",
      quePasaSiFalta: "El usuario queda sin control sobre la privacidad de sus hábitos de uso y consumo de datos."
    },
    interactua: {
      cliExample: "reg query \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\" /v AllowTelemetry",
      psExample: "Get-ItemProperty 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -Name AllowTelemetry -ErrorAction SilentlyContinue | Select-Object AllowTelemetry",
      syntaxBreakdown: "Consulta el nivel de recolección de telemetría configurado por política en el Registro de Windows.",
      whatToLookFor: "Valor 0 o 1 (telemetría básica) versus 3 (telemetría completa opcional).",
      technicalMetrics: "Uso de ancho de banda del servicio DiagTrack en segundo plano."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico pasiva.",
      safetyWarning: "No bloquees los dominios de Microsoft en el archivo HOSTS; terminarás rompiendo la activación de Windows, la Tienda y las actualizaciones de seguridad."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3809",
      label: "Privacy Telemetry Inspector"
    }
  },
  {
    id: "inv-38-10",
    code: "38.10",
    title: "EVO Windows Health",
    subtitle: "Verificación automatizada de integridad de SFC, DISM y estado SMART de discos",
    targetMechanism: "Component-Based Servicing (CBS) Integrity & Storage SMART Status",
    targetComponent: "sfc.exe / dism.exe / MSStorageDriver_FailurePredictStatus",
    commandName: "DISM /Online /Cleanup-Image /CheckHealth",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "No esperes a que Windows arroje una pantalla azul para saber si sus archivos de sistema están dañados. Una herramienta de salud preventiva detecta la corrupción antes de que sea fatal.",
      mythVsTruth: {
        mentira: "Correr `sfc /scannow` arregla mágicamente cualquier problema de lentitud o virus.",
        verdad: "SFC solo compara archivos contra el almacén local WinSxS; si el Component Store está corrupto, SFC no puede reparar nada hasta que DISM lo sanee primero.",
        comprobalo: "Tu herramienta EVO ejecuta primero `DISM /CheckHealth` en modo pasivo (tarda 1 segundo) antes de lanzar tareas pesadas de reparación."
      }
    },
    entende: {
      queEs: "Pipeline de diagnóstico preventivo que valida el estado del disco físico (SMART), la integridad del almacén de componentes (DISM) y la coherencia de archivos protegidos (SFC).",
      paraQueSirve: "Emitir un certificado de salud estructural del sistema operativo antes de entregar una máquina reparada.",
      quePasaSiFalta: "Se entrega una máquina con archivos de sistema dañados que fallará en la próxima actualización de Windows."
    },
    interactua: {
      cliExample: "dism /online /cleanup-image /checkhealth",
      psExample: "Get-CimInstance -Namespace root\\wmi -ClassName MSStorageDriver_FailurePredictStatus | Select-Object InstanceName, PredictFailure, Reason",
      syntaxBreakdown: "Verifica el estado de predicción de fallos SMART de cada disco físico conectado.",
      whatToLookFor: "PredictFailure: False (si es True, el disco va a fallar de forma inminente).",
      technicalMetrics: "Tiempo de verificación de CheckHealth: < 2 segundos."
    },
    alertaEVO: {
      reversibilityRule: "CheckHealth es una operación de solo lectura que no modifica ningún archivo del sistema.",
      safetyWarning: "Si PredictFailure es True, suspende cualquier escaneo pesado y realiza un backup inmediato de los datos del cliente."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3810",
      label: "System Health Pipeline"
    }
  },
  {
    id: "inv-38-11",
    code: "38.11",
    title: "EVO PC Lenta",
    subtitle: "Módulo consolidador de los 4 pilares: CPU clock, Disk queue, Memory pool y DPC latency",
    targetMechanism: "Unified Multi-Subsystem Bottleneck Detection Matrix",
    targetComponent: "typeperf / WMI / Performance Counters / Hardware Sensors",
    commandName: "EVO-PCLenta-Audit",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "La herramienta insignia de la metodología EVO: un solo comando que en 5 segundos evalúa los 4 componentes críticos y te dice exactamente por qué la PC está lenta.",
      mythVsTruth: {
        mentira: "Para saber por qué una máquina está lenta hay que probar cosas al azar.",
        verdad: "Cualquier lentitud deja huella numérica en al menos uno de los 4 contadores fundamentales: CPU MHz, Cola de Disco, NonPaged Pool o Latencia DPC.",
        comprobalo: "Tu script evalúa los 4 umbrales y emite un veredicto pericial con la causa raíz aislada."
      }
    },
    entende: {
      queEs: "El script orquestador central que aplica la taxonomía del Sector 36 de manera 100% automatizada e independiente.",
      paraQueSirve: "Diagnosticar una computadora en 10 segundos en el mostrador del taller delante del cliente con rigor científico.",
      quePasaSiFalta: "El técnico pasa horas abriendo ventanas y probando soluciones a ciegas sin rumbo claro."
    },
    interactua: {
      cliExample: "typeperf \"\\Processor Information(_Total)\\% Processor Performance\" \"\\PhysicalDisk(_Total)\\Avg. Disk Queue Length\" \"\\Memory\\Pool Nonpaged Bytes\" -sc 3",
      psExample: "$cpu = (Get-CimInstance Win32_Processor).CurrentClockSpeed; $disk = (Get-Counter '\\PhysicalDisk(_Total)\\Avg. Disk Queue Length').CounterSamples.CookedValue; [PSCustomObject]@{ CPU_MHz=$cpu; Disk_Queue=[math]::Round($disk,2); Verdict=$(if($cpu -lt 1000){'Thermal Throttling'}elseif($disk -gt 2.0){'Disk Bottleneck'}else{'Hardware OK'}) }",
      syntaxBreakdown: "Evalúa los contadores de rendimiento clave y genera una conclusión diagnóstica automática.",
      whatToLookFor: "CPU_MHz < 1000 (throttling) o Disk_Queue > 2.0 (disco saturado).",
      technicalMetrics: "Tiempo de diagnóstico completo: 5 segundos exactos."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico pasivo sin modificaciones en el sistema.",
      safetyWarning: "Asegúrate de ejecutar la prueba con la máquina en reposo para obtener una medición de línea base limpia."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3811",
      label: "Bottleneck Matrix Engine"
    }
  },
  {
    id: "inv-38-12",
    code: "38.12",
    title: "Logs: Motor de telemetría y timestamps estructurados",
    subtitle: "Implementación de Write-Log con niveles INFO, WARN, ERROR y formato ISO-8601",
    targetMechanism: "Structured Logging & Execution Tracing",
    targetComponent: "PowerShell Streams / Out-File / Append / ISO-8601 Timestamps",
    commandName: "function Write-EVOLog { ... }",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Un script que no genera logs con timestamps precisos no es una herramienta profesional: es un juguete ciego que no deja rastro cuando algo sale mal.",
      mythVsTruth: {
        mentira: "Usar Write-Host para imprimir mensajes en pantalla es suficiente para un script de soporte.",
        verdad: "Write-Host no guarda nada en disco; si la máquina se reinicia o se congela, se pierde toda la evidencia de lo que hizo el script.",
        comprobalo: "Tu función `Write-EVOLog` escribe simultáneamente en la consola y en un archivo .log rotativo con fecha en formato ISO-8601 `YYYY-MM-DDTHH:mm:ss`."
      }
    },
    entende: {
      queEs: "El subsistema de registro de eventos interno que documenta cada acción, medición, advertencia o error que tu herramienta realiza.",
      paraQueSirve: "Respaldar técnicamente tu trabajo pericial ante clientes o auditorías demostrando qué se midió y qué se modificó con precisión de segundos.",
      quePasaSiFalta: "Si ocurre un error durante una intervención, no hay forma de saber en qué paso exacto falló."
    },
    interactua: {
      cliExample: "echo [%date% %time%] [INFO] Iniciando auditoria forense >> evo_audit.log",
      psExample: "function Write-EVOLog { param([string]$Message, [ValidateSet('INFO','WARN','ERROR')]$Level='INFO') $stamp = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss'); $line = \"[$stamp] [$Level] $Message\"; Write-Output $line; Add-Content -Path 'C:\\EVO_Audit.log' -Value $line }",
      syntaxBreakdown: "Define una función de log estructurado que formatea y persiste cada mensaje con nivel de severidad y fecha universal.",
      whatToLookFor: "Archivos .log legibles y parseables con estructura regular campo por campo.",
      technicalMetrics: "Sobrecarga de I/O de disco por escritura de log < 0.01 ms por línea."
    },
    alertaEVO: {
      reversibilityRule: "Los logs son archivos de texto planos acumulativos que se pueden archivar o purgar periódicamente.",
      safetyWarning: "No guardes contraseñas ni datos sensibles de usuarios en los archivos de log."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3812",
      label: "Structured Log Engine"
    }
  },
  {
    id: "inv-38-13",
    code: "38.13",
    title: "JSON: Serialización y esquematización para ingesta en SIEM",
    subtitle: "Conversión de objetos periciales con ConvertTo-Json y esquemas de validación",
    targetMechanism: "JSON Object Notation & REST/SIEM Schema Serialization",
    targetComponent: "ConvertTo-Json / ConvertFrom-Json / Schema validation",
    commandName: "ConvertTo-Json -Depth 5",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Querés que tus herramientas se integren con servidores centrales, bases de datos o paneles de monitoreo en la nube? El formato JSON es el estándar universal.",
      mythVsTruth: {
        mentira: "Los scripts de soporte solo deben mostrar texto plano para leer en el Bloc de Notas.",
        verdad: "Exportar los resultados en JSON permite comparar auditorías de 100 máquinas distintas automáticamente mediante scripts o bases de datos.",
        comprobalo: "En PowerShell, cualquier colección de objetos se convierte en JSON estándar con un solo comando: `| ConvertTo-Json -Depth 5`."
      }
    },
    entende: {
      queEs: "Serialización estructurada de datos jerárquicos que preserva tipos de datos (números, booleanos, listas y diccionarios) sin pérdida de precisión.",
      paraQueSirve: "Almacenar auditorías periciales completas que puedan ser consumidas por aplicaciones web, APIs o tableros de control.",
      quePasaSiFalta: "Toda la información queda atrapada en texto desestructurado difícil de procesar automáticamente."
    },
    interactua: {
      cliExample: "powershell -Command \"Get-ComputerInfo | Select-Object WindowsProductName, OsVersion | ConvertTo-Json\"",
      psExample: "[PSCustomObject]@{ Tool='EVO System Audit'; Timestamp=(Get-Date).ToString('o'); CPU=(Get-CimInstance Win32_Processor).Name; RAM_GB=[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory/1GB,2) } | ConvertTo-Json -Depth 3 | Out-File -FilePath 'audit.json' -Encoding utf8",
      syntaxBreakdown: "Genera un documento JSON válido con codificación UTF-8 que documenta las métricas de hardware del equipo.",
      whatToLookFor: "Sintaxis JSON válida con llaves y corchetes correctamente anidados.",
      technicalMetrics: "Tamaño típico del payload JSON de auditoría completa: entre 10 KB y 50 KB."
    },
    alertaEVO: {
      reversibilityRule: "Operación de exportación pasiva que crea un archivo de datos.",
      safetyWarning: "Utiliza siempre el parámetro `-Depth` al usar ConvertTo-Json para evitar que PowerShell trunque objetos complejos a profundidad 2 por defecto."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3813",
      label: "JSON Serialization Matrix"
    }
  },
  {
    id: "inv-38-14",
    code: "38.14",
    title: "CSV: Exportación tabular para análisis en hojas de cálculo y Pandas",
    subtitle: "Generación de datasets limpios con Export-Csv y delimitadores estándar",
    targetMechanism: "Comma-Separated Values Tabular Export & Delimiter Normalization",
    targetComponent: "Export-Csv -NoTypeInformation -Delimiter ','",
    commandName: "Export-Csv -Path audit.csv -NoTypeInformation",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Cuando necesitas presentarle a un gerente o cliente el inventario de 50 computadoras de su empresa, nada supera a un archivo CSV listo para abrir en Excel o procesar en Python.",
      mythVsTruth: {
        mentira: "Armar un inventario en Excel requiere tipear los datos a mano uno por uno.",
        verdad: "Un script EVO recorre la red y genera un archivo CSV con 50 columnas de datos en menos de 1 minuto.",
        comprobalo: "Usa `Export-Csv -NoTypeInformation`: generará una tabla perfecta compatible con cualquier software de hoja de cálculo del mundo."
      }
    },
    entende: {
      queEs: "Formato de texto plano tabular donde cada línea es un registro y cada campo está separado por una coma o punto y coma.",
      paraQueSirve: "Permitir que contadores, administradores y analistas de datos filtren, ordenen y creen gráficos sobre el estado del parque informático.",
      quePasaSiFalta: "El departamento técnico no puede presentar informes ejecutivos comprensibles para la dirección de la empresa."
    },
    interactua: {
      cliExample: "wmic product get name,version,vendor /format:csv > software.csv",
      psExample: "Get-CimInstance Win32_DiskDrive | Select-Object Model, InterfaceType, @{N='Size_GB';E={[math]::Round($_.Size/1GB,2)}}, Status | Export-Csv -Path 'C:\\Discos_EVO.csv' -NoTypeInformation -Encoding utf8",
      syntaxBreakdown: "Exporta la tabla de discos físicos a un archivo CSV sin la cabecera obsoleta de tipos de PowerShell.",
      whatToLookFor: "Primera fila con los nombres de las columnas y filas subsiguientes con los valores separados por comas.",
      technicalMetrics: "Compatibilidad garantizada con Microsoft Excel, Google Sheets y librerías pandas de Python."
    },
    alertaEVO: {
      reversibilityRule: "Operación de solo exportación sin impacto en el sistema.",
      safetyWarning: "Ten en cuenta la configuración regional de Windows: en español, Excel suele esperar punto y coma (`;`) en lugar de coma (`,`). Usa `-Delimiter ';'` si es necesario."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3814",
      label: "CSV Tabular Exporter"
    }
  },
  {
    id: "inv-38-15",
    code: "38.15",
    title: "TXT: Reportes legibles forenses con cabecera pericial",
    subtitle: "Plantillas de informe técnico ASCII con firma hash, fecha y veredicto",
    targetMechanism: "Human-Readable Forensic Plaintext Templating & Banner Generation",
    targetComponent: "Here-Strings (@\" ... \"@) / Out-File / ASCII Formatting",
    commandName: "Out-File -FilePath Reporte.txt -Encoding utf8",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El cliente no quiere ver código ni comandos complejos: quiere un reporte en texto plano prolijo, firmado, con membrete y con las conclusiones claras que pueda imprimir.",
      mythVsTruth: {
        mentira: "Para hacer reportes con diseño profesional se necesita Microsoft Word o herramientas pesadas.",
        verdad: "Un reporte en texto plano estructurado con caracteres ASCII bien alineados transmite autoridad técnica, sobriedad y profesionalismo puro.",
        comprobalo: "Con los 'Here-Strings' de PowerShell (`@\" ... \"@`) puedes crear plantillas visuales con tablas y firmas en segundos."
      }
    },
    entende: {
      queEs: "Generador de documentos de texto plano diseñados específicamente para lectura humana inmediata en cualquier dispositivo.",
      paraQueSirve: "Entregar al cliente un 'Certificado Pericial de Diagnóstico' que explique qué se encontró y qué se solucionó.",
      quePasaSiFalta: "El cliente siente que pagó por un servicio invisible sin tener un comprobante tangible del trabajo realizado."
    },
    interactua: {
      cliExample: "type reporte_cabecera.txt",
      psExample: "$report = @\"\n=======================================================\n           EXPEDIENTE PERICIAL DE DIAGNÓSTICO EVO      \n=======================================================\nFECHA: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')\nEQUIPO: $env:COMPUTERNAME | USUARIO: $env:USERNAME\n-------------------------------------------------------\nSÍNTOMA REPORTADO: Lentitud generalizada en arranque\nDIAGNÓSTICO: Disco mecánico saturado con cola > 4.5\nINTERVENCIÓN RECOMENDADA: Clonación a SSD NVMe\n=======================================================\n\"@; $report | Out-File -FilePath 'C:\\Certificado_EVO.txt' -Encoding utf8",
      syntaxBreakdown: "Genera un informe con diseño ASCII estructurado y lo guarda en disco codificado en UTF-8.",
      whatToLookFor: "Líneas de separación limpias, datos alineados y redacción técnica formal.",
      technicalMetrics: "Peso de archivo < 5 KB; compatible con el 100% de los sistemas operativos del planeta."
    },
    alertaEVO: {
      reversibilityRule: "Operación de generación documental pasiva.",
      safetyWarning: "No uses caracteres especiales que dependan de fuentes gráficas; limítate a caracteres ASCII estándar para máxima portabilidad."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3815",
      label: "Plaintext Forensic Certificate"
    }
  },
  {
    id: "inv-38-16",
    code: "38.16",
    title: "Dry-run: Modo simulación sin efectos colaterales WhatIf",
    subtitle: "Implementación de SupportShouldProcess y switch -WhatIf en herramientas de soporte",
    targetMechanism: "PowerShell CmdletBinding ShouldProcess Infrastructure",
    targetComponent: "[CmdletBinding(SupportsShouldProcess=$true)] / $PSCmdlet.ShouldProcess",
    commandName: "Invoke-EVOFix -WhatIf",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "La diferencia entre un programador amateur y un ingeniero forense es que el ingeniero siempre programa un modo 'Dry-run' (simulación) para ver qué pasaría antes de tocar nada.",
      mythVsTruth: {
        mentira: "Para probar si un script funciona hay que correrlo en una máquina real y ver qué pasa.",
        verdad: "El soporte nativo para `-WhatIf` permite simular todas las acciones, mostrar en pantalla exactamente qué archivos se borrarían o qué servicios se detendrían, sin hacer ningún cambio real.",
        comprobalo: "Usa `[CmdletBinding(SupportsShouldProcess=$true)]`: tu script ganará automáticamente los switches `-WhatIf` y `-Confirm` estándar de Windows."
      }
    },
    entende: {
      queEs: "Patrón de diseño de software de soporte donde cada acción que modifique el estado del sistema consulta primero si está en modo de ejecución real o simulación.",
      paraQueSirve: "Probar scripts complejos de saneamiento en servidores de producción con riesgo cero absoluto de romper algo.",
      quePasaSiFalta: "Un error tipográfico en una ruta puede borrar carpetas del sistema equivocadas de manera irreversible."
    },
    interactua: {
      cliExample: "powershell -Command \"Remove-Item C:\\Windows\\Temp\\* -WhatIf\"",
      psExample: "function Invoke-EVOCleanup { [CmdletBinding(SupportsShouldProcess=$true)] param() if ($PSCmdlet.ShouldProcess('C:\\Windows\\Temp', 'Purgar archivos temporales')) { Remove-Item 'C:\\Windows\\Temp\\*' -Recurse -Force } }; Invoke-EVOCleanup -WhatIf",
      syntaxBreakdown: "Ejecuta la función en modo simulación: muestra qué haría sin ejecutar la acción destructiva.",
      whatToLookFor: "Mensaje informativo: 'What if: Realizando la operación... sobre el destino...'.",
      technicalMetrics: "Riesgo operativo: 0.0% en modo WhatIf."
    },
    alertaEVO: {
      reversibilityRule: "En modo WhatIf ninguna variable, archivo o clave de registro es alterada.",
      safetyWarning: "Verifica que todas las subfunciones de tu script respeten el parámetro $PSCmdlet.ShouldProcess para evitar ejecuciones parciales accidentales."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3816",
      label: "ShouldProcess Simulation Pattern"
    }
  },
  {
    id: "inv-38-17",
    code: "38.17",
    title: "Reversión: Rollback determinista con instantáneas previas",
    subtitle: "Puntos de restauración VSS, exportación de ramas .reg y reversibilidad garantizada",
    targetMechanism: "Volume Shadow Copy Service (VSS) & Registry Transaction Rollback",
    targetComponent: "Checkpoint-Computer / reg export / Transactional NTFS",
    commandName: "Checkpoint-Computer -Description 'Pre-EVO' -RestorePointType 'MODIFY_SETTINGS'",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Regla sagrada de la metodología EVO: Si no puedes deshacer lo que hiciste en un solo clic, no tienes permiso para tocar la computadora.",
      mythVsTruth: {
        mentira: "Hacer un punto de restauración antes de un cambio hace que la máquina ande lenta.",
        verdad: "Un punto de restauración toma 3 segundos y es tu seguro de vida para devolver el sistema a su estado exacto anterior si algo falla.",
        comprobalo: "Tu herramienta EVO debe generar automáticamente un backup de la clave del Registro antes de modificarla (`reg export`) y crear un punto de restauración."
      }
    },
    entende: {
      queEs: "Mecanismo defensivo de ingeniería que guarda el estado previo de los archivos de configuración y del registro antes de aplicar cualquier optimización o arreglo.",
      paraQueSirve: "Garantizar que ante cualquier comportamiento inesperado, el técnico pueda revertir el equipo al 100% de su estado original en minutos.",
      quePasaSiFalta: "Un cambio desafortunado obliga a reinstalar todo el sistema operativo por no tener un plan de escape."
    },
    interactua: {
      cliExample: "reg export \"HKLM\\SYSTEM\\CurrentControlSet\\Services\\wuauserv\" \"C:\\backup_wuauserv.reg\" /y",
      psExample: "Checkpoint-Computer -Description 'EVO-Pre-Intervencion' -RestorePointType 'MODIFY_SETTINGS'; reg export 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management' 'C:\\EVO_Memory_Backup.reg' /y",
      syntaxBreakdown: "Crea un punto de restauración de sistema en VSS y exporta la rama de registro a un archivo .reg antes de la intervención.",
      whatToLookFor: "Archivo .reg creado con éxito y nuevo punto de restauración listado en `Get-ComputerRestorePoint`.",
      technicalMetrics: "Tiempo de exportación de rama de registro: < 15 ms."
    },
    alertaEVO: {
      reversibilityRule: "Para restaurar, basta con hacer doble clic en el archivo .reg de backup o restaurar el punto con `Restore-Computer`.",
      safetyWarning: "Verifica que el servicio Volume Shadow Copy (VSS) esté habilitado antes de intentar crear el punto de restauración."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3817",
      label: "Deterministic Rollback"
    }
  },
  {
    id: "inv-38-18",
    code: "38.18",
    title: "Errores controlados: Try/Catch con Códigos de Salida HRESULT",
    subtitle: "Manejo profesional de excepciones, $LASTEXITCODE y códigos POSIX/Win32",
    targetMechanism: "PowerShell Error Handling Pipeline & Win32 Process Exit Codes",
    targetComponent: "try / catch / finally / $LASTEXITCODE / exit [code]",
    commandName: "try { ... } catch { exit 1 }",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Tus scripts se cuelgan arrojando un texto rojo incomprensible cuando un archivo no existe? Aprende a capturar excepciones y devolver códigos de error estándar de la industria.",
      mythVsTruth: {
        mentira: "Si un script tiene un error, no pasa nada porque el usuario ve la consola.",
        verdad: "En entornos automatizados, si tu script no devuelve un código de salida (Exit Code) diferente de 0 ante un fallo, los sistemas de gestión creen que todo salió bien.",
        comprobalo: "Usa bloques `try { ... } catch { ... }` para interceptar fallos, registrar el error en el log y salir limpiamente con `exit $codigo`."
      }
    },
    entende: {
      queEs: "Estructura de programación defensiva que anticipa posibles fallos (disco lleno, falta de permisos, red inaccesible) y los gestiona sin colapsar el programa.",
      paraQueSirve: "Crear herramientas robustas, a prueba de balas, que nunca dejen tareas a medias ni datos corrompidos en el disco.",
      quePasaSiFalta: "Un script puede fallar a mitad de camino y dejar servicios detenidos o configuraciones a medio aplicar."
    },
    interactua: {
      cliExample: "if %errorlevel% neq 0 (echo [ERROR] Fallo con codigo %errorlevel% & exit /b %errorlevel%)",
      psExample: "try { $ErrorActionPreference = 'Stop'; Stop-Service 'ServicioInexistente'; exit 0 } catch [System.Exception] { Write-EVOLog \"Excepción capturada: $($_.Exception.Message)\" 'ERROR'; exit 1060 } finally { Write-EVOLog 'Operación finalizada.' 'INFO' }",
      syntaxBreakdown: "Captura el fallo, documenta el mensaje exacto de la excepción en el log y retorna el código de error Win32 1060 (ERROR_SERVICE_DOES_NOT_EXIST).",
      whatToLookFor: "Finalización limpia del proceso sin volcados de pila caóticos en la consola.",
      technicalMetrics: "Código de salida: 0 = Éxito total; > 0 = Código de error específico estructurado."
    },
    alertaEVO: {
      reversibilityRule: "El bloque `finally` se ejecuta SIEMPRE, incluso si hubo un error, permitiendo cerrar conexiones y liberar archivos bloqueados.",
      safetyWarning: "No uses un bloque `catch` vacío para ocultar errores; siempre registra la excepción para poder diagnosticar la causa."
    },
    evidenceBadge: {
      code: "EVO-TOOL-3818",
      label: "Defensive Exception Engine"
    }
  }
];

export const SECTOR_38_MINICASES: Sector38MiniCase[] = [
  {
    id: "case-38-01",
    code: "CASE-38.01",
    title: "El script que borró archivos de producción por no tener modo de simulación",
    scenario: "Un técnico novato armó un script para limpiar archivos temporales de los usuarios de una empresa. En el script puso `Remove-Item C:\\Users\\*\\AppData\\Local\\Temp\\* -Recurse -Force`. Sin embargo, un error en la ruta provocó que se ejecutara sobre la raíz de los perfiles de usuario, eliminando carpetas enteras de documentos antes de que pudiera cancelar el proceso.",
    userStatement: "El técnico ejecutó su programa para limpiar la máquina y de repente me desaparecieron los archivos del escritorio y las descargas.",
    initialMistake: "Probar un script de borrado forzoso directamente en un entorno real sin implementar soporte para `-WhatIf`.",
    diagnosticQuestion: "¿Qué directiva de PowerShell convierte a una herramienta casera en un script seguro con soporte nativo de simulación (Dry-run)?",
    options: [
      {
        id: "opt-1",
        text: "Poner un comando `pause` antes de cada línea del script.",
        isCorrect: false,
        explanation: "Poner pausas manuales no simula la acción ni verifica los argumentos de borrado."
      },
      {
        id: "opt-2",
        text: "Decorar la función con `[CmdletBinding(SupportsShouldProcess=$true)]` y encapsular la acción en `$PSCmdlet.ShouldProcess()`.",
        isCorrect: true,
        explanation: "SupportsShouldProcess integra la infraestructura nativa de Windows que permite ejecutar el script con `-WhatIf` para ver cada archivo antes de tocarlo."
      },
      {
        id: "opt-3",
        text: "Ejecutar el script con el usuario Invitado.",
        isCorrect: false,
        explanation: "El usuario invitado no tiene permisos para realizar tareas de soporte técnico."
      }
    ],
    technicalVerdict: "Se refactorizó la herramienta aplicando el estándar EVO: se agregó soporte ShouldProcess, modo WhatIf obligatorio en pruebas y registro previo en log con timestamp de cada archivo a purgar.",
    lessonLearned: "Ninguna herramienta de modificación o borrado se considera lista para producción hasta que cuente con modo Dry-run comprobado."
  },
  {
    id: "case-38-02",
    code: "CASE-38.02",
    title: "El reporte de auditoría que tardaba 20 minutos con programas pesados de terceros",
    scenario: "En una empresa con 150 estaciones de trabajo, el equipo de soporte técnico tardaba 20 minutos por máquina para hacer el inventario: descargaban un instalador de 80 MB de una aplicación de diagnóstico, lo instalaban, esperaban el escaneo y copiaban los datos a mano en un Word.",
    userStatement: "Tardamos 3 semanas en relevar las computadoras de la oficina y las máquinas se llenaron de programas instalados que luego tuvimos que borrar.",
    initialMistake: "Depender de programas pesados de terceros para relevar datos que Windows expone de forma nativa a través de WMI/CIM.",
    diagnosticQuestion: "¿Cuánto tiempo y recursos consume relevar el hardware completo de un equipo utilizando un script nativo EVO en PowerShell?",
    options: [
      {
        id: "opt-1",
        text: "Tarda exactamente lo mismo porque Windows tiene que consultar los mismos sensores.",
        isCorrect: false,
        explanation: "Las aplicaciones de terceros cargan interfaces pesadas, publicidades y librerías innecesarias."
      },
      {
        id: "opt-2",
        text: "Tarda menos de 1 segundo, no requiere instalación de software, no deja residuos y exporta directamente a CSV o JSON estructurado.",
        isCorrect: true,
        explanation: "Las consultas CIM atacan directamente las tablas SMBIOS y el Kernel en memoria sin intermediarios gráficos."
      },
      {
        id: "opt-3",
        text: "No es posible hacerlo sin instalar controladores especiales de terceros.",
        isCorrect: false,
        explanation: "Windows NT cuenta con el repositorio CIM/WMI integrado desde Windows 2000."
      }
    ],
    technicalVerdict: "Se implementó el script `EVO-System-Audit.ps1` que recopiló el inventario de las 150 computadoras en la red a través de PowerShell Remoting en menos de 5 minutos en total, consolidando todo en un único archivo CSV.",
    lessonLearned: "El profesional no descarga programas: fabrica sus propias herramientas nativas, ligeras, deterministas y automatizables."
  },
  {
    id: "case-38-03",
    code: "CASE-38.03",
    title: "El optimizador que rompió el registro y no tenía plan de reversión",
    scenario: "Un cliente aplicó un script descargado de internet prometiendo 'reducir la latencia en juegos'. El script modificó más de 40 claves del Registro en `System\\CurrentControlSet`. Tras reiniciar, los juegos no abrían y la resolución de pantalla quedó fija en 800x600. El autor del script no incluyó ninguna función de respaldo ni de reversión.",
    userStatement: "Le di clic al script que prometía mejorar los FPS y ahora no puedo abrir ningún juego ni cambiar la resolución de la pantalla.",
    initialMistake: "Modificar ramas críticas del Registro sin exportar previamente las claves originales en un archivo .reg de contingencia.",
    diagnosticQuestion: "¿Cuál es el protocolo de reversión obligatorio que debe incluir cualquier herramienta profesional antes de modificar el Registro?",
    options: [
      {
        id: "opt-1",
        text: "Confiar en que Windows tiene una copia de seguridad automática de todo.",
        isCorrect: false,
        explanation: "Windows 10 y 11 deshabilitaron la copia automática de RegBack en System32\\config por defecto desde la versión 1803."
      },
      {
        id: "opt-2",
        text: "Exportar la rama exacta a intervenir con `reg export` a un archivo .reg fechado y crear un punto de restauración en VSS.",
        isCorrect: true,
        explanation: "Un archivo .reg permite restaurar la configuración anterior con un simple doble clic o comando silencioso en caso de cualquier anomalía."
      },
      {
        id: "opt-3",
        text: "Anotar los valores en un papel.",
        isCorrect: false,
        explanation: "Anotar a mano no permite automatizar la reversión ni restaura claves complejas binarias."
      }
    ],
    technicalVerdict: "El técnico EVO restauró el sistema utilizando un punto de restauración previo y documentó el protocolo para que todas las herramientas futuras de la empresa exijan exportación determinista antes de cualquier escritura.",
    lessonLearned: "La capacidad de revertir una intervención en segundos es el sello distintivo de la ingeniería pericial frente al amateurismo."
  }
];

export const SECTOR_38_TEST_BANK: Sector38TestQuestion[] = [
  {
    id: "q-38-01",
    questionNumber: 1,
    category: "Architecture & Tooling",
    question: "¿Cuál es la principal ventaja técnica de utilizar `Get-CimInstance` en lugar de `Get-WmiObject` al construir herramientas de auditoría modernas en PowerShell?",
    options: [
      { id: "A", text: "Get-WmiObject no funciona en computadoras portátiles." },
      { id: "B", text: "Get-CimInstance utiliza el protocolo moderno WS-Man (WinRM) sobre HTTP/HTTPS y es compatible con PowerShell 7+ multiplataforma, mientras que Get-WmiObject depende del obsoleto DCOM." },
      { id: "C", text: "Get-CimInstance requiere permisos de root en Linux." },
      { id: "D", text: "Get-WmiObject no puede leer la memoria RAM." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Get-WmiObject fue deprecado en PowerShell 6 y eliminado en versiones modernas. Get-CimInstance utiliza la infraestructura CIM sobre WS-Management (estándar DMTF), ofreciendo mayor rendimiento, seguridad y compatibilidad remota a través de firewalls."
  },
  {
    id: "q-38-02",
    questionNumber: 2,
    category: "Safety & Simulation",
    question: "¿Qué atributo debe añadirse a una función avanzada de PowerShell para que herede automáticamente el soporte para el parámetro `-WhatIf` (Dry-run)?",
    options: [
      { id: "A", text: "[DryRunMode($true)]" },
      { id: "B", text: "[CmdletBinding(SupportsShouldProcess=$true)]" },
      { id: "C", text: "[Simulation(Enabled)]" },
      { id: "D", text: "[Parameter(Mandatory=$false)]" }
    ],
    correctOptionId: "B",
    technicalExplanation: "Al declarar `[CmdletBinding(SupportsShouldProcess=$true)]`, PowerShell integra automáticamente los switches `-WhatIf` y `-Confirm`, permitiendo al desarrollador evaluar `$PSCmdlet.ShouldProcess('Objetivo', 'Operación')` antes de alterar el sistema."
  },
  {
    id: "q-38-03",
    questionNumber: 3,
    category: "Structured Data",
    question: "Al exportar objetos complejos en PowerShell hacia JSON mediante `ConvertTo-Json`, ¿por qué es fundamental especificar el parámetro `-Depth`?",
    options: [
      { id: "A", text: "Porque si no se especifica, PowerShell formatea el archivo en binario." },
      { id: "B", text: "Porque por defecto PowerShell solo serializa hasta 2 niveles de profundidad, convirtiendo los objetos anidados subsiguientes en strings genéricos." },
      { id: "C", text: "Porque sin `-Depth`, el archivo se guarda sin extensión .json." },
      { id: "D", text: "Porque el parámetro `-Depth` cifra el contenido con AES-256." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El comportamiento por defecto de `ConvertTo-Json` tiene un límite de profundidad de 2 (`Depth=2`). En objetos con múltiples niveles de anidamiento (como auditorías de red o hardware), omitir este parámetro provoca que las propiedades hijas se serialicen como cadenas planas vacías."
  },
  {
    id: "q-38-04",
    questionNumber: 4,
    category: "Process Security",
    question: "¿Qué cmdlet nativo de PowerShell permite validar criptográficamente en disco si el ejecutable de un proceso activo posee una firma digital legítima y válida?",
    options: [
      { id: "A", text: "Get-FileHash" },
      { id: "B", text: "Get-AuthenticodeSignature" },
      { id: "C", text: "Test-Certificate" },
      { id: "D", text: "Get-Acl" }
    ],
    correctOptionId: "B",
    technicalExplanation: "Get-AuthenticodeSignature verifica la firma incrustada o en catálogo del archivo binario contra las entidades certificadoras de confianza de Windows, devolviendo un objeto con la propiedad `Status` (Valid, NotSigned, HashMismatch, etc.)."
  },
  {
    id: "q-38-05",
    questionNumber: 5,
    category: "Defensive Coding",
    question: "En un script de soporte profesional, ¿cuál es el propósito del bloque `finally` en una estructura `try / catch / finally`?",
    options: [
      { id: "A", text: "Se ejecuta solo cuando el usuario presiona Ctrl+C." },
      { id: "B", text: "Garantiza la ejecución de código de limpieza (cerrar sockets, liberar handles de archivos, escribir pie de log) sin importar si la operación tuvo éxito o arrojó una excepción fatal." },
      { id: "C", text: "Reinicia la computadora automáticamente si ocurrió un error." },
      { id: "D", text: "Borra los archivos temporales generados por el sistema operativo." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El bloque `finally` garantiza la ejecución determinista del código de limpieza y cierre de recursos, ejecutándose siempre tanto en caso de finalización exitosa del bloque `try` como tras la captura de una excepción en el bloque `catch`."
  }
];
