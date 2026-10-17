// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 31: SYSINTERNALS
// "La caja de herramientas profesional de Microsoft"

export type RiskLevelSector31 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector31Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector31;
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

export interface Sector31MiniCase {
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

export interface Sector31TestQuestion {
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

export const SECTOR_31_INVESTIGATIONS: Sector31Investigation[] = [
  {
    id: "inv-31-01",
    code: "31.01",
    title: "Process Explorer",
    subtitle: "Árbol jerárquico de procesos, inspección de hilos con símbolos y análisis VirusTotal",
    targetMechanism: "NT Process Hierarchy & Thread Enumeration",
    targetComponent: "procexp.exe / NtQueryInformationProcess / DbgHelp.dll",
    commandName: "procexp.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el Administrador de Tareas oculta las relaciones padre-hijo entre procesos, impidiendo descubrir ejecutables huérfanos o suplantadores de svchost.exe?",
      mythVsTruth: {
        mentira: "Todos los procesos que se llaman svchost.exe son seguros porque son de Windows.",
        verdad: "Cualquier binario malicioso puede nombrarse svchost.exe; Process Explorer revela que si su padre no es services.exe, es un impostor.",
        comprobalo: "Abre Process Explorer y verifica la columna Parent: todos los svchost legítimos cuelgan exclusivamente de services.exe."
      }
    },
    entende: {
      queEs: "El reemplazo profesional de Task Manager desarrollado por Mark Russinovich, con árbol genealógico de PIDs, integración de VirusTotal y visor de hilos con call stacks resueltos por símbolos de depuración (.PDB).",
      paraQueSirve: "Identificar procesos zombies, desglosar consumo de CPU por hilo individual dentro de un proceso y auditar handles y DLLs mapeadas.",
      quePasaSiFalta: "Un proceso desbocado dentro de un contenedor genérico como svchost o rundll32 te obligaría a matar todo el servicio a ciegas."
    },
    interactua: {
      cliExample: "procexp.exe /s",
      psExample: "Get-Process | Where-Object { $_.Name -eq 'svchost' } | Select-Object Id, ProcessName, @{N='ParentID';E={(Get-CimInstance Win32_Process -Filter \"ProcessId=$($_.Id)\").ParentProcessId}}",
      syntaxBreakdown: "Ejecuta Process Explorer con símbolos configurados o lista en PowerShell el PID padre de cada instancia para verificar su origen.",
      whatToLookFor: "Procesos resaltados en púrpura (archivos empaquetados/comprimidos) o con hashes desconocidos en la columna VirusTotal.",
      technicalMetrics: "Resolución de stack frames con resolución de direcciones virtuales relativas (RVA) a símbolos de Microsoft Symbol Server."
    },
    alertaEVO: {
      reversibilityRule: "Operación de sólo lectura en modo inspección. Suspender un proceso (Ctrl+M) es reversible inmediatamente sin matar el estado.",
      safetyWarning: "No suspendas ni termines csrss.exe, smss.exe ni lsass.exe; provocarás un BSOD CRITICAL_PROCESS_DIED instantáneo."
    },
    evidenceBadge: {
      code: "PROCEXP-NT",
      label: "Process Genealogy Verified"
    }
  },
  {
    id: "inv-31-02",
    code: "31.02",
    title: "Process Monitor",
    subtitle: "ProcMon: arquitectura de filtros avanzados y captura de I/O de Registro, Archivos y Red",
    targetMechanism: "Minifilter File System Driver & Registry Callback",
    targetComponent: "procmon.exe / PROCMON24.SYS",
    commandName: "procmon.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Por qué un instalador dice \"Acceso denegado\" si ejecutas como Administrador? ProcMon captura los millones de operaciones microscópicas y revela la clave exacta que causó el fallo.",
      mythVsTruth: {
        mentira: "ProcMon debe dejarse grabando durante horas para cazar fallos intermitentes.",
        verdad: "Grabar sin filtros desborda la memoria RAM en minutos generando gigabytes de eventos en Nonpaged Pool.",
        comprobalo: "Usa Filter -> Include Process Name y activa Drop Filtered Events para registrar solo el objetivo."
      }
    },
    entende: {
      queEs: "Monitor de telemetría de ultra-alta velocidad que intercepta todas las llamadas a archivos (IRP_MJ_*), claves de Registro y sockets TCP en tiempo real mediante un minifiltro de kernel.",
      paraQueSirve: "Resolver errores de \"Archivo no encontrado\", \"Access Denied\", identificar qué DLL falta al cargar un programa y rastrear configuraciones ocultas.",
      quePasaSiFalta: "Resolver un error de DLL faltante requeriría depuradores pesados o adivinanzas en foros técnicos."
    },
    interactua: {
      cliExample: "procmon.exe /Quiet /Minimized /BackingFile C:\\PerfLogs\\trace.pml",
      psExample: "Start-Process procmon.exe -ArgumentList '/Quiet /Minimized /BackingFile C:\\PerfLogs\\trace.pml'; Start-Sleep 5; Start-Process procmon.exe -ArgumentList '/Terminate'",
      syntaxBreakdown: "Inicia la captura silenciosa desatendida en disco local y la termina tras reproducir el incidente.",
      whatToLookFor: "Resultados con resultado NAME NOT FOUND, ACCESS DENIED o BUFFER OVERFLOW en la columna Result.",
      technicalMetrics: "Capacidad de captura: hasta 1.000.000 de eventos por segundo con marcas de tiempo de microsegundos."
    },
    alertaEVO: {
      reversibilityRule: "ProcMon crea un archivo .PML temporal. Asegúrate de configurar backing file en disco en vez de memoria para evitar saturación de RAM.",
      safetyWarning: "No uses ProcMon en servidores de producción con carga extrema sin aplicar Drop Filtered Events."
    },
    evidenceBadge: {
      code: "PROCMON-FLT",
      label: "Kernel Minifilter Tracing"
    }
  },
  {
    id: "inv-31-03",
    code: "31.03",
    title: "Autoruns",
    subtitle: "Auditoría profunda de puntos de persistencia ASEP: Run, Services, Tasks y Winsock",
    targetMechanism: "Auto-Start Extensibility Points (ASEP)",
    targetComponent: "autoruns.exe / autorunsc.exe",
    commandName: "autorunsc.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que Windows tiene más de 120 lugares distintos donde un programa puede configurarse para arrancar sin aparecer en la pestaña Inicio del Administrador de Tareas?",
      mythVsTruth: {
        mentira: "Deshabilitar programas en el Administrador de Tareas cubre todos los programas de inicio.",
        verdad: "Task Manager solo mira 3 ramas del Registro y una carpeta; ignora WMI Event Consumers, AppInit_DLLs, Winsock LSP y extensiones de shell.",
        comprobalo: "Ejecuta autorunsc.exe -a * y observa más de 20 categorías completas de puntos de inicio."
      }
    },
    entende: {
      queEs: "La herramienta forense más completa para inventariar todas las rutas y mecanismos que el kernel o el subsistema de usuario ejecutan al iniciar sesión o arrancar el sistema.",
      paraQueSirve: "Detectar persistencia de malware sigiloso, limpiar bloatware de fabricantes y verificar firmas de todos los drivers y servicios activos.",
      quePasaSiFalta: "Eliminar un archivo malicioso sin borrar su punto ASEP causará errores de \"DLL not found\" en cada inicio de Windows."
    },
    interactua: {
      cliExample: "autorunsc.exe -a * -c -h -s -v * > C:\\PerfLogs\\autoruns_audit.csv",
      psExample: "& autorunsc.exe -a * -m -c | ConvertFrom-Csv | Where-Object { $_.'Publisher' -notmatch 'Microsoft' -and $_.'Verified' -ne '(Verified)' }",
      syntaxBreakdown: "Exporta todos los puntos de arranque con hashes criptográficos y filtra aquellos no verificados por Microsoft.",
      whatToLookFor: "Filas marcadas en amarillo (archivo físico eliminado pero entrada en el Registro huérfana) o en rojo (sin firma digital válida).",
      technicalMetrics: "Cobertura de más de 120 clases ASEP incluyendo BHOs, Image Hijacks (IFEO), Print Monitors y Codecs."
    },
    alertaEVO: {
      reversibilityRule: "Desmarcar una casilla en Autoruns mueve la clave a una subclave de respaldo interna (AutorunsDisabled), permitiendo reversión 100% segura con un clic.",
      safetyWarning: "No elimines entradas del tab Driver o Boot Execute sin verificar la ruta física; podrías dejar el sistema no booteable."
    },
    evidenceBadge: {
      code: "AUTORUN-ASEP",
      label: "ASEP Persistence Audited"
    }
  },
  {
    id: "inv-31-04",
    code: "31.04",
    title: "TCPView",
    subtitle: "Mapeo en tiempo real de sockets TCP/UDP a PIDs y nombres de ejecutables",
    targetMechanism: "Winsock / NetBT / IP Helper API",
    targetComponent: "tcpview.exe / tcpvcon.exe",
    commandName: "tcpview.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Qué aplicación está enviando datos a una IP en el extranjero en este segundo exacto? TCPView colorea en verde las conexiones nuevas y en rojo las cerradas en tiempo real.",
      mythVsTruth: {
        mentira: "netstat te da la misma información que TCPView.",
        verdad: "netstat es una instantánea estática que pierde conexiones efímeras de menos de 1 segundo; TCPView mantiene un histórico visual continuo.",
        comprobalo: "Abre TCPView y realiza una petición DNS o curl: verás el parpadeo verde/rojo instantáneo."
      }
    },
    entende: {
      queEs: "Visualizador dinámico de sockets de red en tiempo real que mapea cada endpoint local y remoto al proceso exacto que lo abrió mediante la API de IP Helper.",
      paraQueSirve: "Cazar spyware, identificar programas haciendo beaconing hacia servidores C2 y detectar puertos locales escuchando en 0.0.0.0.",
      quePasaSiFalta: "Tendrías que ejecutar bucles infinitos de netstat en PowerShell con un alto costo de CPU."
    },
    interactua: {
      cliExample: "tcpvcon.exe -a -c > C:\\PerfLogs\\tcp_sockets.csv",
      psExample: "Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess | Sort-Object State",
      syntaxBreakdown: "Vuelca la lista de sockets TCP/UDP activos con el PID propietario correspondiente.",
      whatToLookFor: "Procesos en estado LISTENING en puertos no estándar o procesos que no deberían tener tráfico de red conectándose a IPs públicas.",
      technicalMetrics: "Tasa de refresco configurable de 1 a 5 segundos con resolución de nombres DNS en segundo plano."
    },
    alertaEVO: {
      reversibilityRule: "Operación de inspección. Cerrar una conexión (Close Connection) aborta el socket TCP (RST) sin matar el proceso.",
      safetyWarning: "Cerrar conexiones de lsass.exe o System puede interrumpir autenticaciones Kerberos en redes corporativas."
    },
    evidenceBadge: {
      code: "TCPVIEW-SOCK",
      label: "Socket-to-Process Mapping"
    }
  },
  {
    id: "inv-31-05",
    code: "31.05",
    title: "RAMMap",
    subtitle: "Inspección forense de las listas de páginas físicas de NT: Active, Standby y Modified",
    targetMechanism: "NT Virtual Memory Manager Page Lists",
    targetComponent: "rammap.exe / NtQuerySystemInformation",
    commandName: "rammap.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué Windows dice que tienes 90% de RAM usada si la suma de tus programas apenas da 4 GB? RAMMap te muestra la memoria física real que Task Manager no sabe clasificar.",
      mythVsTruth: {
        mentira: "La memoria en estado \"Standby\" es memoria ocupada y desperdiciada que debe vaciarse con optimizadores de RAM.",
        verdad: "La lista Standby contiene caché de archivos en espera; el kernel la libera en microsegundos si una app la necesita.",
        comprobalo: "En RAMMap mira la pestaña Use Counts: Standby Memory es caché útil que acelera el sistema operativo."
      }
    },
    entende: {
      queEs: "Analizador de bajo nivel del Administrador de Memoria de NT que desglosa cada página de 4KB en listas: Active, Standby, Modified, Modified No-Write, Free y Zeroed.",
      paraQueSirve: "Diagnosticar fugas de memoria en kernel (Pool Nonpaged), memoria mapeada por archivos de base de datos gigantes y procesos fantasmas.",
      quePasaSiFalta: "Culparías a la RAM física o a las aplicaciones de usuario cuando el culpable real es una caché de disco saturada."
    },
    interactua: {
      cliExample: "rammap.exe",
      psExample: "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory, FreeVirtualMemory",
      syntaxBreakdown: "Abre la consola gráfica de RAMMap o consulta las métricas de memoria del sistema operativo vía WMI.",
      whatToLookFor: "Valores desproporcionados en 'Metafile' (caché NTFS) o en 'Driver Locked' / 'Nonpaged Pool' (> 1 GB indica fuga de driver).",
      technicalMetrics: "Visualización a nivel de estructura de página de 4KB (PTE) y mapa de memoria física completa."
    },
    alertaEVO: {
      reversibilityRule: "El menú Empty -> Empty Standby List libera la caché sin riesgo de corrupción, pero ralentizará brevemente la apertura de archivos frecuentes.",
      safetyWarning: "No uses optimizadores automáticos que vacíen la Modified Page List constantemente; forzarán escrituras masivas a disco saturando el SSD."
    },
    evidenceBadge: {
      code: "RAMMAP-PTE",
      label: "Physical Page Breakdown"
    }
  },
  {
    id: "inv-31-06",
    code: "31.06",
    title: "Sigcheck",
    subtitle: "Verificación criptográfica de firmas de binarios PE, catálogos del sistema y VirusTotal",
    targetMechanism: "WinVerifyTrust / Authenticode Verification",
    targetComponent: "sigcheck.exe / wintrust.dll",
    commandName: "sigcheck.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Un archivo en System32 tiene la fecha y versión de Microsoft pero no está firmado digitalmente? Sigcheck lo descubre al instante verificando la cadena de certificados.",
      mythVsTruth: {
        mentira: "Si el diálogo de propiedades de un archivo muestra la pestaña 'Firmas digitales', el archivo es legítimo.",
        verdad: "El certificado puede haber sido revocado o la firma no coincidir con el hash del binario por inyección de código.",
        comprobalo: "Ejecuta sigcheck.exe -v sobre el binario: valida contra la lista de revocación CRL y consulta VirusTotal."
      }
    },
    entende: {
      queEs: "Utilidad de línea de comandos para verificar si los binarios ejecutables (.exe, .dll, .sys) poseen firmas Authenticode válidas, si están catalogados y su reputación global.",
      paraQueSirve: "Auditar directorios de inicio, validar que los drivers en C:\\Windows\\System32\\drivers sean genuinos y detectar binarios alterados.",
      quePasaSiFalta: "Verificar firmas a mano archivo por archivo en el explorador llevaría horas y no contrastaría contra catálogos del sistema (.CAT)."
    },
    interactua: {
      cliExample: "sigcheck.exe -u -e C:\\Windows\\System32",
      psExample: "Get-ChildItem C:\\Windows\\System32\\drivers\\*.sys | Get-AuthenticodeSignature | Where-Object { $_.Status -ne 'Valid' }",
      syntaxBreakdown: "El parámetro -u lista únicamente archivos no firmados; -e filtra solo imágenes ejecutables.",
      whatToLookFor: "Archivos con estado 'Unsigned', certificados autofirmados desconocidos o hashes con detecciones positivas en VirusTotal.",
      technicalMetrics: "Algoritmos soportados: SHA-1, SHA-256, Authenticode y validación de Catálogos de Seguridad de Windows (CatDB)."
    },
    alertaEVO: {
      reversibilityRule: "Comando 100% no invasivo de lectura y verificación criptográfica.",
      safetyWarning: "Existen herramientas legítimas de código abierto que no pagan certificado de firma; 'Unsigned' no equivale automáticamente a malware."
    },
    evidenceBadge: {
      code: "SIGCHECK-AUTH",
      label: "Authenticode Chain Validated"
    }
  },
  {
    id: "inv-31-07",
    code: "31.07",
    title: "Handle",
    subtitle: "Inspección de descriptores abiertos en consola y resolución de bloqueos de archivos en uso",
    targetMechanism: "NT Executive Object Table & Handle Enumeration",
    targetComponent: "handle.exe / NtQuerySystemInformation(SystemHandleInformation)",
    commandName: "handle.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "\"No se puede eliminar el archivo porque está abierto en otro programa\". ¿En cuál? Handle te da el nombre exacto del proceso y el número de PID en un milisegundo.",
      mythVsTruth: {
        mentira: "Hay que reiniciar la PC para liberar un archivo bloqueado.",
        verdad: "Handle identifica el descriptor abierto y permite cerrarlo quirúrgicamente o matar el hilo correspondiente.",
        comprobalo: "Ejecuta handle.exe nombre_archivo y obtendrás el ID del proceso bloqueador inmediatamente."
      }
    },
    entende: {
      queEs: "Herramienta que lista todos los handles abiertos por cualquier proceso del sistema operativo: archivos, puertos, claves de registro, eventos y semáforos.",
      paraQueSirve: "Resolver bloqueos de carpetas al intentar borrarlas, detectar fugas de handles (Handle Leaks) y auditar qué archivos lee un proceso sospechoso.",
      quePasaSiFalta: "Un handle leak no detectado consumirá memoria no paginada del kernel hasta provocar lentitud extrema o crashes."
    },
    interactua: {
      cliExample: "handle.exe -p chrome.exe C:\\Users",
      psExample: "& handle.exe -u -a mi_documento.docx",
      syntaxBreakdown: "Muestra los handles que el proceso chrome.exe mantiene abiertos hacia la ruta C:\\Users o busca qué proceso tiene tomado un documento.",
      whatToLookFor: "Procesos con miles de handles del tipo 'Event' o 'Key' que no dejan de crecer en el tiempo (Handle Leak).",
      technicalMetrics: "Indexa la tabla de handles de Ring 0 mapeando punteros opacos de 64 bits a objetos reales de kernel."
    },
    alertaEVO: {
      reversibilityRule: "Cerrar handles con handle.exe -c es una acción forzosa. El proceso dueño podría fallar si asume que el handle sigue abierto.",
      safetyWarning: "Nunca cierres handles de procesos de sistema como lsass.exe o winlogon.exe."
    },
    evidenceBadge: {
      code: "HANDLE-ENUM",
      label: "Object Handle Inspector"
    }
  },
  {
    id: "inv-31-08",
    code: "31.08",
    title: "Streams",
    subtitle: "Detección de Alternate Data Streams en NTFS y auditoría de marcas Zone.Identifier",
    targetMechanism: "NTFS Alternate Data Streams (ADS)",
    targetComponent: "streams.exe / NtQueryInformationFile",
    commandName: "streams.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Sabías que un archivo de 0 bytes en Windows puede tener 50 megabytes ocultos dentro de un flujo de datos alternativo que el Explorador no muestra?",
      mythVsTruth: {
        mentira: "Un archivo solo tiene un flujo de datos que es su contenido visible.",
        verdad: "NTFS permite múltiples flujos por archivo (formato archivo:flujo); la marca \"Este archivo proviene de Internet\" es un stream invisible llamado :Zone.Identifier.",
        comprobalo: "Usa streams.exe -s C:\\Descargas para listar todos los flujos ocultos en tus archivos descargados."
      }
    },
    entende: {
      queEs: "Utilidad que revela y permite eliminar flujos de datos alternativos (ADS) adjuntos a archivos en particiones formateadas con NTFS.",
      paraQueSirve: "Desbloquear archivos descargados en lote (eliminando Zone.Identifier: $DATA) y detectar código malicioso oculto en flujos invisibles.",
      quePasaSiFalta: "Tendrías que hacer clic derecho -> Propiedades -> Desbloquear individualmente en cientos de archivos de script o DLLs."
    },
    interactua: {
      cliExample: "streams.exe -s -d C:\\Descargas",
      psExample: "Get-Item C:\\Descargas\\* -Stream * | Select-Object FileName, Stream, Length",
      syntaxBreakdown: "El modificador -s busca recursivamente en subcarpetas; -d elimina los flujos secundarios dejando el archivo intacto.",
      whatToLookFor: "Flujos con nombres anómalos que no sean :Zone.Identifier:$DATA o SmartScreen.",
      technicalMetrics: "Identifica entradas en el registro MFT tipo $DATA con nombres no vacíos asignados por el subsistema NTFS."
    },
    alertaEVO: {
      reversibilityRule: "Eliminar un stream con -d es permanente. Para Zone.Identifier es deseable; para software contable que use ADS para metadatos, no.",
      safetyWarning: "No elimines flujos en carpetas del sistema donde Windows almacena marcas de integridad de paquetes AppX."
    },
    evidenceBadge: {
      code: "STREAMS-ADS",
      label: "NTFS Alternate Streams"
    }
  },
  {
    id: "inv-31-09",
    code: "31.09",
    title: "PsTools conceptual",
    subtitle: "Ejecución remota, elevación a NT AUTHORITY\\SYSTEM y control de servicios con PsExec",
    targetMechanism: "Named Pipes / Service Control Manager / RPC",
    targetComponent: "psexec.exe / psservice.exe / PSEXESVC.exe",
    commandName: "psexec.exe",
    riskLevel: "HIGH_RISK",
    descubri: {
      hook: "¿Hay claves del Registro o archivos que ni siquiera la cuenta Administrador puede tocar? La cuenta NT AUTHORITY\\SYSTEM sí puede, y PsExec te abre una consola en ese nivel en un segundo.",
      mythVsTruth: {
        mentira: "El Administrador es la cuenta con más privilegios en una máquina Windows.",
        verdad: "SYSTEM y TrustedInstaller tienen privilegios por encima del Administrador en objetos protegidos del sistema operativo.",
        comprobalo: "Ejecuta psexec.exe -i -s cmd.exe y escribe whoami: verás que eres nt authority\\system."
      }
    },
    entende: {
      queEs: "La suite de administración remota y local basada en pipes con nombre y servicios efímeros que permite ejecutar procesos con credenciales alternativas o interactuar con sesiones remotas.",
      paraQueSirve: "Diagnosticar problemas de permisos imposibles, reparar configuraciones dañadas de servicios y administrar equipos en red corporativa sin software de terceros.",
      quePasaSiFalta: "Tendrías que recurrir a hacks peligrosos de permisos de archivos o arrancar desde un Live USB de rescate."
    },
    interactua: {
      cliExample: "psexec.exe -i -s cmd.exe",
      psExample: "Start-Process psexec.exe -ArgumentList '-i -s powershell.exe' -Verb RunAs",
      syntaxBreakdown: "-i indica sesión interactiva (muestra la ventana en el escritorio del usuario) y -s solicita los privilegios de la cuenta SYSTEM.",
      whatToLookFor: "Salida del comando 'whoami' devolviendo 'nt authority\\system' y capacidad de consultar ramas bloqueadas como HKLM\\SAM.",
      technicalMetrics: "Despliega un servicio temporal en \\\\ADMIN$\\PSEXESVC.exe y comunica I/O a través de un Named Pipe cifrado."
    },
    alertaEVO: {
      reversibilityRule: "Cerrar la consola de comandos termina la sesión SYSTEM y el servicio temporal se desinstala automáticamente.",
      safetyWarning: "Con privilegios SYSTEM no hay red de seguridad: cualquier borrado accidental en C:\\Windows destruirá la instalación sin pedir confirmación."
    },
    evidenceBadge: {
      code: "PSTOOLS-SYS",
      label: "System Privilege Elevation"
    }
  },
  {
    id: "inv-31-10",
    code: "31.10",
    title: "Cómo investigar sin romper nada",
    subtitle: "Reglas forenses de no invasión: modo solo lectura, descarte de falsos positivos y trazabilidad",
    targetMechanism: "Forensic Methodology & Non-Destructive Inspection",
    targetComponent: "Sysinternals Suite Protocol / EULA / Logging",
    commandName: "sysinternals.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El 80% de los daños en sistemas Windows durante un diagnóstico los causa el propio técnico al hacer clic en 'Limpiar' o 'Optimizar' sin entender la causa raíz.",
      mythVsTruth: {
        mentira: "Un buen técnico arregla el problema cambiando cosas rápido hasta que vuelva a andar.",
        verdad: "Un perito profesional observa primero en modo solo lectura, documenta la anomalía y solo ejecuta intervenciones atómicas y reversibles.",
        comprobalo: "Aplica siempre la regla de oro: observar antes de modificar; verificar antes de reiniciar."
      }
    },
    entende: {
      queEs: "El marco de trabajo metodológico oficial para operar las herramientas de Sysinternals sin alterar la evidencia ni provocar caídas de servicio imprevistas.",
      paraQueSirve: "Garantizar la estabilidad de entornos críticos de producción, evitar falsos positivos y asegurar que cualquier intervención pueda deshacerse limpiamente.",
      quePasaSiFalta: "Podrías borrar una clave legítima de la que depende un software ERP empresarial y provocar pérdidas financieras masivas."
    },
    interactua: {
      cliExample: "procexp.exe /accepteula",
      psExample: "# Modo Auditoría Segura: Solo exportar logs sin modificar estado\n& autorunsc.exe -a * -c > C:\\PerfLogs\\baseline_autoruns.csv",
      syntaxBreakdown: "Acepta la licencia desatendida y genera líneas de base (baselines) de comparación antes de cualquier intervención técnica.",
      whatToLookFor: "Comparativas de diff entre el estado antes del incidente y el estado actual para aislar el cambio desencadenante.",
      technicalMetrics: "Criterio de cero escrituras en sectores de sistema durante la fase de adquisición de evidencia."
    },
    alertaEVO: {
      reversibilityRule: "Todo cambio debe registrarse en una bitácora técnica con comando inverso de recuperación.",
      safetyWarning: "Nunca ejecutes 'Kill Process Tree' en un proceso desconocido sin haber verificado sus handles y servicios asociados."
    },
    evidenceBadge: {
      code: "SYSINT-SAFE",
      label: "Forensic Protocol Master"
    }
  }
];

export const SECTOR_31_MINICASES: Sector31MiniCase[] = [
  {
    id: "case-31-01",
    code: "MC-31.1",
    title: "El archivo bloqueado que nadie podía borrar en el servidor contable",
    scenario: "Un archivo de base de datos local contabilidad.db quedó bloqueado tras un corte de luz. Cada intento de renombrarlo o borrarlo arrojaba: 'La acción no se puede completar porque otro programa tiene abierto el archivo'. El servidor de archivos no podía reiniciarse porque tenía 80 usuarios conectados trabajando en otras carpetas.",
    userStatement: "La máquina dice que el archivo está en uso pero nadie lo tiene abierto. Tenemos que reiniciar el servidor ya mismo.",
    initialMistake: "Planificar un reinicio de emergencia fuera de horario o forzar el borrado con herramientas agresivas de desbloqueo que corrompen el filesystem.",
    diagnosticQuestion: "¿Qué comando o herramienta de Sysinternals permite descubrir exactamente qué proceso tiene abierto el descriptor sin interrumpir el servidor?",
    options: [
      {
        id: "opt-1",
        text: "Ejecutar handle.exe contabilidad.db para identificar el PID del proceso y el ID del descriptor.",
        isCorrect: true,
        explanation: "¡Exacto! Handle.exe consulta la tabla de objetos del kernel y muestra exactamente qué PID mantiene abierto el archivo. Se descubrió que era una instancia colgada de un servicio de backup nocturno que se cerró de forma limpia con un solo comando."
      },
      {
        id: "opt-2",
        text: "Usar chkdsk /f C: inmediatamente.",
        isCorrect: false,
        explanation: "Chkdsk requiere desmontar el volumen o programar un reinicio, lo cual desconectaría a todos los usuarios de la empresa innecesariamente."
      },
      {
        id: "opt-3",
        text: "Cambiar los permisos NTFS de la carpeta a 'Todos: Control Total'.",
        isCorrect: false,
        explanation: "El problema no es de permisos (ACLs), sino de un bloqueo exclusivo de descriptor (Share Mode lock) en el kernel de Windows."
      }
    ],
    technicalVerdict: "El archivo estaba tomado exclusivamente por sqlservr.exe en una sesión huérfana. Al liberar el handle correspondiente se desbloqueó el archivo en 2 segundos.",
    lessonLearned: "Un descriptor abierto nunca se resuelve cambiando permisos: se identifica el proceso con Handle o Process Explorer."
  },
  {
    id: "case-31-02",
    code: "MC-31.2",
    title: "La aplicación corporativa que crasheaba al iniciar sin dar mensaje de error",
    scenario: "Una aplicación crítica de gestión médica se cerraba 1 segundo después de ejecutarse sin mostrar ningún mensaje de error ni generar eventos claros en el Visor de Eventos de Windows.",
    userStatement: "El programa no abre. Hago doble clic, sale la ruedita de carga un segundo y desaparece. Windows no dice nada.",
    initialMistake: "Reinstalar Windows o asumir que el ejecutable estaba corrupto.",
    diagnosticQuestion: "¿Cómo usarías Process Monitor (ProcMon) para revelar la causa en menos de 3 minutos?",
    options: [
      {
        id: "opt-1",
        text: "Poner un filtro 'Process Name is app.exe', ejecutar el programa y buscar el último resultado con 'NAME NOT FOUND' o 'PATH NOT FOUND' antes del cierre.",
        isCorrect: true,
        explanation: "¡Impecable! ProcMon mostró que la aplicación intentaba leer 'C:\\Program Files\\App\\license.key' y una DLL llamada 'msvcp140.dll'. Faltaba el paquete Visual C++ Redistributable 2015-2022. Se instaló y abrió al instante."
      },
      {
        id: "opt-2",
        text: "Desactivar el Firewall de Windows y el antivirus Windows Defender.",
        isCorrect: false,
        explanation: "Desactivar la seguridad no aporta diagnóstico y no resuelve dependencias de librerías ni rutas faltantes."
      },
      {
        id: "opt-3",
        text: "Ejecutar sfc /scannow.",
        isCorrect: false,
        explanation: "SFC solo repara archivos protegidos del sistema operativo Windows, no dependencias de aplicaciones de terceros."
      }
    ],
    technicalVerdict: "Causa raíz: C0000135 (STATUS_DLL_NOT_FOUND) capturada nítidamente en la traza de I/O de ProcMon.",
    lessonLearned: "Cuando un programa muere silenciosamente, ProcMon es la caja negra que graba el último archivo o clave de Registro que intentó acceder."
  },
  {
    id: "case-31-03",
    code: "MC-31.3",
    title: "El script que reaparecía en cada inicio a pesar de ser borrado",
    scenario: "Un script no deseado update_helper.vbs se ejecutaba cada vez que el usuario iniciaba sesión. El departamento de TI borraba el archivo en C:\\Temp, pero a los pocos minutos o en el siguiente reinicio, volvía a aparecer y ejecutarse.",
    userStatement: "Tenemos un virus indestructible que se vuelve a crear solo aunque lo borremos con el antivirus.",
    initialMistake: "Buscar únicamente en la carpeta de Inicio de Windows y en la clave HKLM\\Run del Registro.",
    diagnosticQuestion: "¿Qué análisis en Autoruns revela el mecanismo invisible de regeneración?",
    options: [
      {
        id: "opt-1",
        text: "Inspeccionar las pestañas 'Scheduled Tasks' y 'WMI' en Autoruns para encontrar el disparador persistente que regeneraba el archivo.",
        isCorrect: true,
        explanation: "¡Exacto! El script estaba registrado en un WMI Event Consumer (__EventFilter y CommandLineEventConsumer) que se disparaba cada vez que transcurrían 30 minutos desde el arranque, regenerando el archivo .vbs desde una cadena en Base64."
      },
      {
        id: "opt-2",
        text: "Formatear el disco duro inmediatamente.",
        isCorrect: false,
        explanation: "El formateo es una medida extrema que destruye configuraciones y tiempo cuando la entrada WMI se elimina en 5 segundos con Autoruns."
      },
      {
        id: "opt-3",
        text: "Pasar un limpiador de registro comercial genérico.",
        isCorrect: false,
        explanation: "Los limpiadores comerciales de registro no auditan ni entienden los repositorios de WMI (WMI CIM repository)."
      }
    ],
    technicalVerdict: "Persistencia oculta en WMI Event Consumer identificada y desmarcada limpiamente con Autoruns.",
    lessonLearned: "La persistencia moderna no vive en el menú Inicio: vive en Tareas Programadas y filtros de eventos WMI."
  }
];

export const SECTOR_31_TEST_BANK: Sector31TestQuestion[] = [
  {
    id: "q31-01",
    questionNumber: 1,
    category: "Process Explorer",
    question: "En Process Explorer, ¿qué significa que un proceso aparezca resaltado con color púrpura por defecto?",
    options: [
      { id: "A", text: "Es un proceso crítico del sistema operativo que no puede terminarse." },
      { id: "B", text: "El binario ejecutable contiene código comprimido o empaquetado (packed image), común tanto en instaladores como en malware." },
      { id: "C", text: "El proceso tiene fugas graves de memoria física." },
      { id: "D", text: "El proceso está corriendo en un emulador de 16 bits." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Process Explorer resalta en púrpura los ejecutables cuya sección de código está empaquetada o comprimida (ej. con UPX), lo cual altera la entropía del archivo y requiere mayor atención forense."
  },
  {
    id: "q31-02",
    questionNumber: 2,
    category: "Process Monitor",
    question: "¿Qué técnica de configuración es fundamental en ProcMon para evitar que la memoria RAM se sature durante una sesión de captura?",
    options: [
      { id: "A", text: "Bajar la resolución de pantalla a 1080p." },
      { id: "B", text: "Activar 'Drop Filtered Events' en el menú Filter y configurar un archivo de respaldo en disco (Backing File)." },
      { id: "C", text: "Desconectar la placa de red antes de abrir el programa." },
      { id: "D", text: "Cerrar el explorador de Windows." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Por defecto ProcMon almacena todos los eventos en la memoria virtual. Al activar 'Drop Filtered Events', descarta en tiempo real los eventos que no cumplen los filtros, reduciendo el consumo de memoria en un 99%."
  },
  {
    id: "q31-03",
    questionNumber: 3,
    category: "RAMMap",
    question: "¿Qué representa la lista 'Standby' en el Administrador de Memoria de Windows visible a través de RAMMap?",
    options: [
      { id: "A", text: "Memoria RAM dañada por errores de paridad de hardware." },
      { id: "B", text: "Páginas que contienen datos de archivos leídos previamente que el sistema conserva en caché, listas para ser reutilizadas al instante si se solicitan o reclamadas si otra app requiere memoria libre." },
      { id: "C", text: "Memoria swap paginada en el disco duro SSD." },
      { id: "D", text: "Memoria reservada exclusivamente para la placa de video integrada." }
    ],
    correctOptionId: "B",
    technicalExplanation: "La lista Standby es memoria de caché ultrarrápida. Contiene páginas válidas respaldadas en disco. Si un proceso pide RAM, el administrador de memoria transfiere páginas de Standby a Free en cuestión de nanosegundos."
  },
  {
    id: "q31-04",
    questionNumber: 4,
    category: "Streams & NTFS",
    question: "¿Qué tipo de Alternate Data Stream crea automáticamente Windows al descargar un archivo con un navegador web moderno?",
    options: [
      { id: "A", text: ":Checksum:$DATA" },
      { id: "B", text: ":Zone.Identifier:$DATA con información sobre la zona de seguridad de origen (ZoneId=3 para Internet)." },
      { id: "C", text: ":AntivirusScan:$DATA" },
      { id: "D", text: ":EncryptedPayload:$DATA" }
    ],
    correctOptionId: "B",
    technicalExplanation: "Windows adjunta el flujo :Zone.Identifier:$DATA con 'ZoneId=3' para indicar que el archivo proviene de la Zona de Internet, lo que activa el bloqueo de macros de Office y la advertencia de SmartScreen."
  },
  {
    id: "q31-05",
    questionNumber: 5,
    category: "PsExec & Privilegios",
    question: "¿Qué parámetro de PsExec permite ejecutar una consola con los privilegios de NT AUTHORITY\\SYSTEM en la sesión interactiva del usuario actual?",
    options: [
      { id: "A", text: "psexec -admin -root" },
      { id: "B", text: "psexec -i -s cmd.exe" },
      { id: "C", text: "psexec /elevate /user:system" },
      { id: "D", text: "psexec -force -all" }
    ],
    correctOptionId: "B",
    technicalExplanation: "El parámetro -s ejecuta bajo la cuenta SYSTEM del equipo local, y -i interactúa con el escritorio de la sesión activa del usuario para renderizar la ventana de la consola."
  }
];
