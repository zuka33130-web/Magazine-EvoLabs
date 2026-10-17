// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 20: WINDOWS UPDATE
// EL SISTEMA SE MODIFICA MIENTRAS VOS DORMÍS

export type RiskLevelSector20 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector20Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector20;
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

export interface Sector20MiniCase {
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

export interface Sector20TestQuestion {
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

export const SECTOR_20_INVESTIGATIONS: Sector20Investigation[] = [
  {
    "id": "inv-20-01",
    "code": "20.01",
    "title": "KB",
    "subtitle": "Knowledge Base: la unidad atómica de parches en Windows",
    "targetMechanism": "Microsoft Knowledge Base Article Identifier & Update Packaging",
    "targetComponent": "wusa.exe / Windows Update Catalog",
    "commandName": "wmic qfe list",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Ves un código como KB5034441 que rompe millones de PCs en el mundo: detrás de ese número hay un paquete binario que modifica el kernel.",
      "mythVsTruth": {
        "mentira": "Cada código KB contiene un solo archivo que repara un único bug aislado.",
        "verdad": "Un KB es un identificador de documentación técnica que empaqueta cientos de binarios, manifiestos y scripts de reemplazo de componentes.",
        "comprobalo": "Ejecutá Get-HotFix en PowerShell para ver todos los artículos KB instalados en tu máquina."
      }
    },
    "entende": {
      "queEs": "El identificador unívoco de artículo técnico y paquete de actualización emitido por Microsoft.",
      "paraQueSirve": "Rastrear vulnerabilidades corregidas (CVEs), parches de seguridad y cambios de comportamiento del sistema.",
      "quePasaSiFalta": "Sin catalogación por KB, sería imposible auditar el cumplimiento de parches de seguridad en una flota."
    },
    "interactua": {
      "cliExample": "wmic qfe get HotFixID, Description, InstalledOn",
      "psExample": "Get-HotFix | Select-Object HotFixID, Description, InstalledOn | Sort-Object InstalledOn -Descending",
      "syntaxBreakdown": "Consulta los paquetes de corrección rápida (QFE) instalados y su fecha.",
      "whatToLookFor": "HotFixID con formato \"KBxxxxxxx\" y fechas recientes.",
      "technicalMetrics": "Tiempo de consulta < 300 ms mediante interfaz WMI Win32_QuickFixEngineering."
    },
    "alertaEVO": {
      "reversibilityRule": "Los paquetes KB se pueden consultar sin riesgo; son la base del historial de parches.",
      "safetyWarning": "No intentes instalar KBs descargados manualmente que no coincidan con la arquitectura de tu procesador (x64 vs ARM64)."
    },
    "evidenceBadge": {
      "code": "KB-PACKAGE",
      "label": "KB Article"
    }
  },
  {
    "id": "inv-20-02",
    "code": "20.02",
    "title": "Build",
    "subtitle": "Major, Minor, Build y UBR: la huella digital exacta de tu Windows",
    "targetMechanism": "NT Kernel Versioning & Update Build Revision (UBR)",
    "targetComponent": "ntoskrnl.exe / HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion",
    "commandName": "winver",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Dos personas tienen \"Windows 11\", pero una tiene la versión 22631.3007 y otra la 22621.1: sus sistemas son internamente muy diferentes.",
      "mythVsTruth": {
        "mentira": "Decir \"tengo Windows 11\" es suficiente para saber si un programa o juego va a ser compatible.",
        "verdad": "El número de Build y el UBR (Update Build Revision) definen las APIs exactas de DirectStorage, WDDM y seguridad disponibles en el kernel.",
        "comprobalo": "Ejecutá winver o leé el valor UBR en el Registro de Windows."
      }
    },
    "entende": {
      "queEs": "La numeración que refleja la compilación del kernel (ej: 22631) y la revisión menor de parche acumulativo (UBR).",
      "paraQueSirve": "Diagnosticar si un error o vulnerabilidad ya fue mitigado en esa versión específica.",
      "quePasaSiFalta": "Incompatibilidades con juegos modernos que exigen builds específicas para habilitar DirectX 12 Agility SDK."
    },
    "interactua": {
      "cliExample": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\" /v CurrentBuildNumber",
      "psExample": "[System.Environment]::OSVersion.Version",
      "syntaxBreakdown": "Obtiene el número de compilación y la versión del sistema operativo en ejecución.",
      "whatToLookFor": "CurrentBuildNumber y UBR (Update Build Revision).",
      "technicalMetrics": "Kernel NT 10.0 con UBR actualizado mensualmente."
    },
    "alertaEVO": {
      "reversibilityRule": "Informativo y de solo lectura.",
      "safetyWarning": "Nunca modifiques las cadenas de versión en el Registro; puede romper instaladores de drivers."
    },
    "evidenceBadge": {
      "code": "OS-BUILD",
      "label": "Kernel Build"
    }
  },
  {
    "id": "inv-20-03",
    "code": "20.03",
    "title": "Servicing Stack",
    "subtitle": "El motor que actualiza al motor de actualizaciones (SSU)",
    "targetMechanism": "Servicing Stack Updates (SSU) & CBS Orchestrator",
    "targetComponent": "C:\\Windows\\Servicing\\Version / Poqexec.exe",
    "commandName": "dism /online /get-packages",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Windows Update falla con error 0x800f081f: el problema no es el parche mensual, sino que el instalador de parches está desactualizado.",
      "mythVsTruth": {
        "mentira": "Windows Update es una simple aplicación ejecutable que descarga archivos sueltos.",
        "verdad": "El Servicing Stack es el conjunto de binarios y módulos del kernel que orquesta la instalación de componentes; si el SSU falla, nada se puede actualizar.",
        "comprobalo": "Buscá en tu historial de updates los paquetes etiquetados como \"Servicing Stack Update\"."
      }
    },
    "entende": {
      "queEs": "El motor central que reemplaza binarios bloqueados durante el arranque (Poqexec) y gestiona la base de datos de WinSxS.",
      "paraQueSirve": "Garantiza que el proceso de actualización no se interrumpa ante fallas de energía o caídas del sistema.",
      "quePasaSiFalta": "Corrupción total del sistema de actualizaciones que obliga a reinstalar Windows."
    },
    "interactua": {
      "cliExample": "dism /online /get-packages /format:table | findstr \"ServicingStack\"",
      "psExample": "Get-WindowsPackage -Online | Where-Object PackageName -like \"*ServicingStack*\"",
      "syntaxBreakdown": "Filtra los paquetes instalados buscando las versiones activas del Servicing Stack.",
      "whatToLookFor": "Paquetes ServicingStack con estado \"Installed\".",
      "technicalMetrics": "Transacciones atómicas protegidas por el subsistema TxF (Transactional NTFS)."
    },
    "alertaEVO": {
      "reversibilityRule": "Los SSUs no se pueden desinstalar una vez aplicados; forman la base permanente del instalador.",
      "safetyWarning": "Nunca interrumpas la instalación de un SSU; es la única etapa que puede inutilizar el boot."
    },
    "evidenceBadge": {
      "code": "SSU-ENGINE",
      "label": "Servicing Stack"
    }
  },
  {
    "id": "inv-20-04",
    "code": "20.04",
    "title": "Cumulative Update",
    "subtitle": "El \"Patch Tuesday\" mensual que contiene todas las correcciones previas",
    "targetMechanism": "Latest Cumulative Update (LCU) Rollup Packaging",
    "targetComponent": "TiWorker.exe / TrustedInstaller.exe",
    "commandName": "Get-HotFix",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Cada segundo martes del mes llega una descarga de 600 MB: contiene absolutamente todos los parches acumulados desde el nacimiento de la versión.",
      "mythVsTruth": {
        "mentira": "Si no actualizaste en seis meses, tenés que descargar seis parches mensuales por separado.",
        "verdad": "Los parches son estrictamente acumulativos: instalar el último LCU incluye automáticamente todas las correcciones de los meses anteriores.",
        "comprobalo": "Revisá el tamaño del paquete acumulativo en el Catálogo de Microsoft Update."
      }
    },
    "entende": {
      "queEs": "Un paquete rollup mensual que reemplaza componentes por su versión superior más reciente sin requerir parches intermedios.",
      "paraQueSirve": "Simplifica la administración de flotas; un solo archivo pone al día cualquier máquina de esa rama.",
      "quePasaSiFalta": "Vulnerabilidades conocidas explotables por malware o ransomware de día cero."
    },
    "interactua": {
      "cliExample": "wmic qfe get HotFixID, InstalledOn | sort",
      "psExample": "Get-HotFix | Where-Object Description -like \"*Security Update*\" | Select-Object -Last 1",
      "syntaxBreakdown": "Muestra la última actualización acumulativa de seguridad aplicada.",
      "whatToLookFor": "Fecha de instalación correspondiente al mes en curso o anterior.",
      "technicalMetrics": "Proceso TiWorker.exe (Windows Modules Installer Worker) gestionando el reemplazo."
    },
    "alertaEVO": {
      "reversibilityRule": "Los LCUs se pueden desinstalar desde el Panel de Control > Actualizaciones instaladas si causan fallas.",
      "safetyWarning": "La etapa de reinicio (\"Trabajando en las actualizaciones...\") no debe apagarse a la fuerza."
    },
    "evidenceBadge": {
      "code": "LCU-ROLLUP",
      "label": "Cumulative LCU"
    }
  },
  {
    "id": "inv-20-05",
    "code": "20.05",
    "title": "Feature Update",
    "subtitle": "El cambio de versión anual (ej: 22H2 a 23H2) y los Enablement Packages",
    "targetMechanism": "Annual Feature OS Upgrade vs Enablement Package (eKB)",
    "targetComponent": "SetupHost.exe / Modern Setup",
    "commandName": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\" /v DisplayVersion",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "Pasar de 22H2 a 23H2 tardó solo 2 minutos: la actualización ya estaba dormida en tu disco y solo se activó un interruptor.",
      "mythVsTruth": {
        "mentira": "Todas las actualizaciones de versión anual reinstalan Windows completo cambiando gigabytes de archivos.",
        "verdad": "Cuando el código base es compartido, Microsoft envía un \"Enablement Package\" de pocos kilobytes que simplemente enciende las funciones nuevas.",
        "comprobalo": "Comprobá el valor DisplayVersion en el Registro: pasa de 22H2 a 23H2 con un parche mínimo."
      }
    },
    "entende": {
      "queEs": "La actualización mayor que introduce nuevas capacidades visuales, subsistemas de IA y directivas de seguridad.",
      "paraQueSirve": "Extiende el ciclo de vida de soporte de la rama de Windows por 24 o 36 meses adicionales.",
      "quePasaSiFalta": "Fin del soporte técnico (End of Life) y cese de parches de seguridad mensuales."
    },
    "interactua": {
      "cliExample": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\" /v DisplayVersion",
      "psExample": "(Get-ItemProperty \"HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\").DisplayVersion",
      "syntaxBreakdown": "Devuelve la denominación comercial de la versión de Windows (ej: 23H2).",
      "whatToLookFor": "Versión soportada actualmente (22H2, 23H2 o superior).",
      "technicalMetrics": "Tiempo de actualización con Enablement Package < 3 minutos; con migración completa: 20-40 minutos."
    },
    "alertaEVO": {
      "reversibilityRule": "Windows conserva la versión anterior durante 10 días en la carpeta Windows.old para permitir rollback.",
      "safetyWarning": "Asegurate de tener al menos 20 GB de espacio libre antes de una actualización de características completa."
    },
    "evidenceBadge": {
      "code": "FEATURE-UPG",
      "label": "Feature Upgrade"
    }
  },
  {
    "id": "inv-20-06",
    "code": "20.06",
    "title": "Optional Update",
    "subtitle": "Actualizaciones de vista previa (\"C\" updates) y por qué evitarlas en producción",
    "targetMechanism": "Preview Cumulative Updates (Week 4 \"C\" Releases)",
    "targetComponent": "USOClient.exe / Windows Update Settings",
    "commandName": "usoclient StartScan",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Ves una actualización opcional con la palabra \"Preview\": sos el conejillo de indias de Microsoft antes del lanzamiento oficial.",
      "mythVsTruth": {
        "mentira": "Siempre tenés que instalar todas las actualizaciones opcionales apenas aparecen en la lista.",
        "verdad": "Las actualizaciones opcionales son parches de prueba no críticos; Microsoft las utiliza para validar estabilidad antes de incluirlas en el martes de parches.",
        "comprobalo": "Revisá la sección \"Actualizaciones opcionales\" en Windows Update: suelen ser previews de calidad y drivers OEM."
      }
    },
    "entende": {
      "queEs": "Lanzamientos de la cuarta semana de cada mes (\"Semana C\") que contienen correcciones que aún están en período de telemetría masiva.",
      "paraQueSirve": "Permite a administradores probar soluciones a bugs específicos antes de que sean obligatorias.",
      "quePasaSiFalta": "Absolutamente nada; esas mismas correcciones llegarán pulidas el próximo mes en el parche acumulativo obligatorio."
    },
    "interactua": {
      "cliExample": "usoclient StartScan",
      "psExample": "Get-CimInstance -Namespace root\\cimv2 -ClassName Win32_QuickFixEngineering",
      "syntaxBreakdown": "Inicia un escaneo del orquestador de actualizaciones (Update Session Orchestrator).",
      "whatToLookFor": "Actualizaciones marcadas explícitamente como \"Preview\".",
      "technicalMetrics": "Telemetría de choque enviada a Microsoft para evaluar regresiones."
    },
    "alertaEVO": {
      "reversibilityRule": "No instalarlas es la mejor práctica recomendada para equipos de trabajo crítico.",
      "safetyWarning": "Desactivá la opción \"Obtener las actualizaciones más recientes tan pronto como estén disponibles\" para no recibir betas."
    },
    "evidenceBadge": {
      "code": "OPTIONAL-PREV",
      "label": "Preview Patches"
    }
  },
  {
    "id": "inv-20-07",
    "code": "20.07",
    "title": "Driver Update",
    "subtitle": "El riesgo de controladores genéricos sobreescribiendo tu software dedicado",
    "targetMechanism": "Windows Update Driver Distribution Channel",
    "targetComponent": "Device Install Service / drvinst.exe",
    "commandName": "pnputil /enum-drivers",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "Windows Update decidió por su cuenta reemplazar tu driver de video de AMD o NVIDIA por una versión básica de hace 8 meses.",
      "mythVsTruth": {
        "mentira": "Windows Update siempre instala el driver más nuevo y completo con su panel de control.",
        "verdad": "Windows Update prioriza drivers aprobados WHQL estándar, a menudo empaquetados en versiones DCH mínimas sin paneles ni ajustes de rendimiento.",
        "comprobalo": "Revisá el historial de actualizaciones en \"Actualizaciones de controladores\" para ver si tocó tu GPU o audio."
      }
    },
    "entende": {
      "queEs": "El mecanismo de distribución que descarga paquetes INF/SYS certificados por Microsoft Hardware Dev Center.",
      "paraQueSirve": "Garantizar que equipos nuevos tengan controladores funcionales sin intervención manual del usuario.",
      "quePasaSiFalta": "Conflictos de software si Windows sobreescribe un driver especializado instalado por el usuario."
    },
    "interactua": {
      "cliExample": "pnputil /enum-drivers",
      "psExample": "Get-WindowsDriver -Online | Where-Object ProviderName -notlike \"*Microsoft*\" | Select-Object OriginalFileName, ProviderName, Date",
      "syntaxBreakdown": "Lista los controladores de terceros agregados al almacén de drivers (Driver Store).",
      "whatToLookFor": "Controladores con fecha reciente suministrados a través de Windows Update.",
      "technicalMetrics": "Firmas digitales WHQL (Windows Hardware Quality Labs) validadas."
    },
    "alertaEVO": {
      "reversibilityRule": "Se puede bloquear la descarga de drivers en Windows Update mediante directiva de grupo (gpedit.msc).",
      "safetyWarning": "En GPUs dedicadas, usá DDU si Windows Update mezcló archivos DLL de versiones distintas."
    },
    "evidenceBadge": {
      "code": "WU-DRIVER",
      "label": "Driver Channel"
    }
  },
  {
    "id": "inv-20-08",
    "code": "20.08",
    "title": "Component Store",
    "subtitle": "WinSxS: por qué la carpeta pesa 20 GB y nunca debés borrarla a mano",
    "targetMechanism": "Windows Component Store (WinSxS) & Hard Linking",
    "targetComponent": "C:\\Windows\\WinSxS / dism.exe",
    "commandName": "dism /online /cleanup-image /analyzecomponentstore",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "La carpeta C:\\Windows\\WinSxS pesa 18 GB: intentás borrarla para ganar espacio y destruís el arranque de Windows.",
      "mythVsTruth": {
        "mentira": "La carpeta WinSxS está llena de basura inútil y duplicados que se pueden eliminar libremente con Shift+Supr.",
        "verdad": "WinSxS es el sistema operativo real; los archivos de System32 son accesos directos de bajo nivel (Hard Links) que apuntan a WinSxS.",
        "comprobalo": "Ejecutá dism /online /cleanup-image /analyzecomponentstore para ver el tamaño real descontando los hard links."
      }
    },
    "entende": {
      "queEs": "El almacén canónico de componentes donde reside cada versión de cada DLL y manifiesto del sistema operativo.",
      "paraQueSirve": "Permite desinstalar actualizaciones defectuosas, reparar archivos corruptos y habilitar características sin pedir el pendrive de instalación.",
      "quePasaSiFalta": "Si se borra manualmente, Windows queda incapacitado para arrancar o aplicar cualquier parche futuro."
    },
    "interactua": {
      "cliExample": "dism /online /cleanup-image /analyzecomponentstore",
      "psExample": "dism /online /cleanup-image /startcomponentcleanup",
      "syntaxBreakdown": "Analiza el almacén y purga versiones antiguas de componentes reemplazados.",
      "whatToLookFor": "\"Se recomienda la limpieza del almacén de componentes: Sí/No\".",
      "technicalMetrics": "Ahorro típico de 2 a 5 GB tras ejecutar /startcomponentcleanup /resetbase."
    },
    "alertaEVO": {
      "reversibilityRule": "La limpieza con DISM es la única forma oficial y segura de reducir WinSxS.",
      "safetyWarning": "El parámetro /resetbase impide desinstalar las actualizaciones acumulativas actuales; usalo solo si el sistema es estable."
    },
    "evidenceBadge": {
      "code": "WINSXS-STORE",
      "label": "Component Store"
    }
  },
  {
    "id": "inv-20-09",
    "code": "20.09",
    "title": "CBS",
    "subtitle": "Component-Based Servicing y el archivo forense C:\\Windows\\Logs\\CBS\\CBS.log",
    "targetMechanism": "Component-Based Servicing (CBS) Engine & Transaction Logging",
    "targetComponent": "C:\\Windows\\Logs\\CBS\\CBS.log / TiWorker.exe",
    "commandName": "type C:\\Windows\\Logs\\CBS\\CBS.log | more",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Windows dice \"Error al instalar la actualización, deshaciendo cambios\": el archivo CBS.log te dice exactamente qué archivo o clave falló.",
      "mythVsTruth": {
        "mentira": "Cuando Windows Update falla, el código de error genérico 0x80070002 es lo único que se puede saber.",
        "verdad": "CBS.log registra cada manifiesto evaluado línea por línea, revelando si faltó un archivo de idioma o falló un permiso de clave en el Registro.",
        "comprobalo": "Abrí PowerShell y buscá la palabra \"Failed\" o \"Error\" dentro de C:\\Windows\\Logs\\CBS\\CBS.log."
      }
    },
    "entende": {
      "queEs": "El subsistema declarativo basado en XML que procesa paquetes de componentes (.mum / .cat).",
      "paraQueSirve": "Asegura que las actualizaciones sean transaccionales: si un paso falla, revierte todo al estado anterior sin dejar archivos a medias.",
      "quePasaSiFalta": "Es la bitácora forense más valiosa para un analista de sistemas Windows."
    },
    "interactua": {
      "cliExample": "findstr /c:\"[SR]\" %windir%\\logs\\cbs\\cbs.log",
      "psExample": "Get-Content \"$env:windir\\logs\\cbs\\cbs.log\" -Tail 50 | Where-Object { $_ -match \"Error\" }",
      "syntaxBreakdown": "Filtra las líneas de error de reparación del sistema en el archivo CBS.",
      "whatToLookFor": "Líneas con \"Error\" o \"Failed\" que especifiquen el paquete o ruta con problemas.",
      "technicalMetrics": "Log rotativo automático con compresión a CBS.persist.cab al superar 50 MB."
    },
    "alertaEVO": {
      "reversibilityRule": "Informativo y forense; de solo lectura.",
      "safetyWarning": "CBS.log puede estar bloqueado si TiWorker.exe o TrustedInstaller están trabajando en segundo plano."
    },
    "evidenceBadge": {
      "code": "CBS-LOG",
      "label": "CBS Forensics"
    }
  },
  {
    "id": "inv-20-10",
    "code": "20.10",
    "title": "SoftwareDistribution",
    "subtitle": "El caché de descargas temporales y la base de datos DataStore.edb",
    "targetMechanism": "Windows Update Cache Folder & ESE Database (DataStore.edb)",
    "targetComponent": "C:\\Windows\\SoftwareDistribution / wuauserv",
    "commandName": "net stop wuauserv",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "Windows descarga una actualización al 99% y se traba en bucle infinito: el archivo en SoftwareDistribution está corrupto.",
      "mythVsTruth": {
        "mentira": "Borrar SoftwareDistribution daña Windows para siempre.",
        "verdad": "Es simplemente una carpeta de descarga temporal y base de datos local de índices; si la borrás, Windows la recrea limpia desde cero.",
        "comprobalo": "Detené el servicio Windows Update y mirá los gigabytes que ocupa la subcarpeta \"Download\"."
      }
    },
    "entende": {
      "queEs": "El almacén local donde el cliente de Windows Update descarga los archivos CAB/ESD antes de entregárselos al Servicing Stack.",
      "paraQueSirve": "Mantiene el historial local de escaneo y los instaladores parciales de parches.",
      "quePasaSiFalta": "Si se corrompe la base de datos ESE (DataStore.edb), las descargas fallan repetidamente con errores de red o verificación."
    },
    "interactua": {
      "cliExample": "net stop wuauserv & ren %windir%\\SoftwareDistribution SoftwareDistribution.old & net start wuauserv",
      "psExample": "Stop-Service wuauserv; Rename-Item \"$env:windir\\SoftwareDistribution\" \"SoftwareDistribution.old\"; Start-Service wuauserv",
      "syntaxBreakdown": "Detiene el servicio, renombra la carpeta corrupta y reinicia el servicio para crear una nueva.",
      "whatToLookFor": "Recreación automática de la estructura de carpetas y reanudación limpia de descargas.",
      "technicalMetrics": "Ahorro de espacio y purga de cachés de 500 MB a 10 GB."
    },
    "alertaEVO": {
      "reversibilityRule": "Si algo falla, la carpeta renombrada .old contiene las descargas previas.",
      "safetyWarning": "Siempre detené wuauserv y cryptSvc antes de intentar renombrar la carpeta."
    },
    "evidenceBadge": {
      "code": "SOFT-DIST",
      "label": "Download Cache"
    }
  },
  {
    "id": "inv-20-11",
    "code": "20.11",
    "title": "Update trabado",
    "subtitle": "Protocolo de rescate para bucles infinitos en 0%, 20% o 100%",
    "targetMechanism": "BITS & Windows Update Agent Stall Remediation",
    "targetComponent": "bits / wuauserv / cryptsvc / msiserver",
    "commandName": "net stop bits",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "Tu barra de progreso lleva 5 horas clavada en \"Descargando 20%\": el servicio BITS se quedó sin hilos de red.",
      "mythVsTruth": {
        "mentira": "La única solución a una actualización congelada es apagar la PC manteniendo apretado el botón de encendido.",
        "verdad": "Detener la cadena de 4 servicios (wuauserv, bits, cryptsvc, msiserver) y purgar el catálogo de cola destraba el proceso en 30 segundos.",
        "comprobalo": "Inspeccioná el estado de los servicios con Get-Service bits, wuauserv."
      }
    },
    "entende": {
      "queEs": "La condición de bloqueo donde el orquestador de descargas o el instalador atómico quedan esperando un handle de archivo inaccesible.",
      "paraQueSirve": "Comprender el flujo de servicios para resetear el pipeline de forma quirúrgica sin perder datos.",
      "quePasaSiFalta": "Consumo continuo de CPU y red en segundo plano degradando el rendimiento general."
    },
    "interactua": {
      "cliExample": "net stop wuauserv & net stop cryptSvc & net stop bits & net stop msiserver",
      "psExample": "Get-Service -Name wuauserv, bits, cryptsvc, msiserver | Select-Object Name, Status",
      "syntaxBreakdown": "Detiene los 4 pilares de Windows Update para liberar bloqueos de archivos.",
      "whatToLookFor": "Todos los servicios en estado \"Stopped\".",
      "technicalMetrics": "Liberación de handles en memoria y desbloqueo de socket RPC."
    },
    "alertaEVO": {
      "reversibilityRule": "Iniciar los servicios con net start restaura la operatividad completa.",
      "safetyWarning": "No fuerces apagados eléctricos mientras el disco esté escribiendo activamente."
    },
    "evidenceBadge": {
      "code": "STALL-REPAIR",
      "label": "Update Unstall"
    }
  },
  {
    "id": "inv-20-12",
    "code": "20.12",
    "title": "Error de instalación",
    "subtitle": "Desarmar los códigos 0x80070002, 0x800f081f y 0x80240034",
    "targetMechanism": "HRESULT Win32 / CBS Error Code Translation",
    "targetComponent": "Kernel HRESULT Decoding Table",
    "commandName": "certutil -error 0x80070002",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Windows te muestra \"Error 0x80070002\": parece un código extraterrestre pero en realidad es un código HRESULT estándar de Microsoft.",
      "mythVsTruth": {
        "mentira": "Los códigos de error de Windows Update son aleatorios y no tienen significado técnico real.",
        "verdad": "Los errores se componen de severidad, facilidad y código Win32: 0x80070002 significa exactamente ERROR_FILE_NOT_FOUND (archivo no encontrado).",
        "comprobalo": "Ejecutá certutil -error 0x80070002 en la consola para traducir el código a lenguaje humano."
      }
    },
    "entende": {
      "queEs": "El sistema de codificación de 32 bits HRESULT donde 0x8007 indica error derivado de Win32 y 0x800F indica error de CBS.",
      "paraQueSirve": "Identificar al instante si la falla es de archivo faltante (0002), acceso denegado (0005) o componente corrupto (081F).",
      "quePasaSiFalta": "Diagnóstico a ciegas probando tutoriales al azar en internet."
    },
    "interactua": {
      "cliExample": "certutil -error 0x80070002",
      "psExample": "certutil -error 0x800f081f",
      "syntaxBreakdown": "Traduce códigos hexadecimales de error de Windows a mensajes de texto descriptivos.",
      "whatToLookFor": "Traducción oficial: \"El sistema no puede encontrar el archivo especificado\" o \"CBS_E_SOURCE_MISSING\".",
      "technicalMetrics": "Estructura HRESULT: [1 bit Severidad] [15 bits Facilidad] [16 bits Código]."
    },
    "alertaEVO": {
      "reversibilityRule": "Comando de traducción forense; no altera el sistema.",
      "safetyWarning": "Si el error es 0x800f081f, requiere usar DISM /Online /Cleanup-Image /RestoreHealth con imagen montada de origen."
    },
    "evidenceBadge": {
      "code": "HRESULT-DEC",
      "label": "Error Decoder"
    }
  },
  {
    "id": "inv-20-13",
    "code": "20.13",
    "title": "Pending restart",
    "subtitle": "Las claves de registro que le avisan a Windows que debe terminar al reiniciar",
    "targetMechanism": "Reboot Pending Registry Flags & Session Manager Pending Operations",
    "targetComponent": "PendingFileRenameOperations / RebootPending flags",
    "commandName": "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\" /v PendingFileRenameOperations",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Instalás un programa y dice \"Debe reiniciar antes de continuar\" aunque no hayas tocado nada: una actualización dejó una clave pendiente.",
      "mythVsTruth": {
        "mentira": "Windows reinicia cuando tiene ganas sin ninguna directiva escrita previa.",
        "verdad": "Los reemplazos de archivos bloqueados se guardan en la clave PendingFileRenameOperations para que el kernel los mueva en el boot temprano.",
        "comprobalo": "Inspeccioná la clave Session Manager en el Registro para ver qué archivos esperan el reinicio."
      }
    },
    "entende": {
      "queEs": "La lista de operaciones de movimiento y reemplazo de archivos que el subsistema smss.exe procesa antes de que inicie Windows.",
      "paraQueSirve": "Reemplazar archivos críticos en uso (como ntoskrnl.exe o drivers) que no pueden tocarse con Windows encendido.",
      "quePasaSiFalta": "Si la clave queda trabada con un valor huérfano, los instaladores rechazarán ejecutarse indefinidamente."
    },
    "interactua": {
      "cliExample": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Component Based Servicing\\RebootPending\"",
      "psExample": "Test-Path \"HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Component Based Servicing\\RebootPending\"",
      "syntaxBreakdown": "Comprueba si hay un reinicio pendiente solicitado por el Servicing Stack.",
      "whatToLookFor": "True = Reinicio obligatorio pendiente; False = Sistema en estado limpio.",
      "technicalMetrics": "Ejecución temprana en Ring 0 durante fase de inicio SMSS."
    },
    "alertaEVO": {
      "reversibilityRule": "Reiniciar el equipo procesa la cola y borra la clave automáticamente.",
      "safetyWarning": "Borrar manualmente la clave sin reiniciar puede dejar binarios de versiones incompatibles mezclados."
    },
    "evidenceBadge": {
      "code": "REBOOT-PEND",
      "label": "Pending Reboot"
    }
  },
  {
    "id": "inv-20-14",
    "code": "20.14",
    "title": "Rollback",
    "subtitle": "La ingeniería de reversión automática tras un pantallazo azul en la instalación",
    "targetMechanism": "Automated Servicing Transaction Rollback & WinRE Recovery",
    "targetComponent": "Poqexec.exe / Windows Recovery Environment (WinRE)",
    "commandName": "dism /online /get-packages",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "La pantalla dice \"No pudimos completar las actualizaciones, deshaciendo cambios\": la transacción falló pero tu sistema sobrevivió intacto.",
      "mythVsTruth": {
        "mentira": "Si una actualización da un BSOD durante el reinicio, la computadora queda inservible y hay que formatear.",
        "verdad": "Windows tiene un contador de fallas de arranque; al segundo intento fallido, WinRE se activa y revierte la transacción automáticamente.",
        "comprobalo": "Revisá en el Visor de Eventos los eventos del proveedor \"Microsoft-Windows-Servicing\" para ver el rollback registrado."
      }
    },
    "entende": {
      "queEs": "El mecanismo de seguridad atómico que restaura los binarios anteriores si el kernel detecta fallas durante el primer arranque con el parche.",
      "paraQueSirve": "Evita dejar la máquina en un estado no arrancable (boot loop).",
      "quePasaSiFalta": "Pérdida de acceso al sistema que requeriría recuperación manual con WinPE."
    },
    "interactua": {
      "cliExample": "reagentc /info",
      "psExample": "Get-WinEvent -ProviderName \"Microsoft-Windows-Servicing\" -MaxEvents 10 -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Verifica que el entorno de recuperación (WinRE) esté activo para garantizar el rollback automático.",
      "whatToLookFor": "Estado de Windows RE: \"Habilitado\".",
      "technicalMetrics": "Contador de fallas de arranque (BootStatusPolicy) configurado en 2 intentos."
    },
    "alertaEVO": {
      "reversibilityRule": "Automático y gestionado por el gestor de arranque de Windows.",
      "safetyWarning": "Nunca deshabilites WinRE con reagentc /disable en equipos de producción."
    },
    "evidenceBadge": {
      "code": "ROLLBACK-ATOMIC",
      "label": "Safe Rollback"
    }
  },
  {
    "id": "inv-20-15",
    "code": "20.15",
    "title": "Desinstalar update",
    "subtitle": "Eliminar un parche defectuoso mediante wusa.exe y DISM en línea o sin conexión",
    "targetMechanism": "WUSA Uninstaller & DISM Package Removal API",
    "targetComponent": "wusa.exe / dism.exe / C:\\Windows\\Servicing",
    "commandName": "wusa /uninstall /kb:XXXXXXX /quiet /norestart",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "El último parche mensual rompió las impresoras en red de toda la empresa: con un comando desinstalás el KB problemático en 1 minuto.",
      "mythVsTruth": {
        "mentira": "Una vez instalado un parche acumulativo, es imposible volver atrás sin restaurar una copia de seguridad completa.",
        "verdad": "Siempre que no se haya ejecutado /resetbase en WinSxS, cualquier paquete LCU puede desinstalarse limpiamente con wusa o DISM.",
        "comprobalo": "Buscá en \"Desinstalar actualizaciones\" en el Panel de Control clásico y observá la opción de quitar parches."
      }
    },
    "entende": {
      "queEs": "El procedimiento que invoca al Servicing Stack para reinstalar los binarios previos resguardados en WinSxS.",
      "paraQueSirve": "Contener crisis operativas causadas por bugs de regresión de parches de Microsoft.",
      "quePasaSiFalta": "Equipos inutilizados hasta que Microsoft publique un parche correctivo de emergencia (OOB)."
    },
    "interactua": {
      "cliExample": "wusa /uninstall /kb:5034441 /promptrestart",
      "psExample": "Get-WindowsPackage -Online | Where-Object PackageName -like \"*Package_for_KB*\" | Select-Object PackageName, ReleaseType, InstallTime",
      "syntaxBreakdown": "Desinstala el paquete KB especificado y solicita reinicio si es necesario.",
      "whatToLookFor": "Mensaje de desinstalación exitosa y solicitud de reinicio.",
      "technicalMetrics": "Tiempo de remoción de paquete LCU: 2 a 5 minutos."
    },
    "alertaEVO": {
      "reversibilityRule": "El paquete se puede volver a instalar en cualquier momento si Microsoft publica una versión corregida.",
      "safetyWarning": "Pausá las actualizaciones tras desinstalar el KB para evitar que Windows lo vuelva a descargar esa misma noche."
    },
    "evidenceBadge": {
      "code": "UNINSTALL-KB",
      "label": "Package Removal"
    }
  },
  {
    "id": "inv-20-16",
    "code": "20.16",
    "title": "Driver reemplazado por Windows Update",
    "subtitle": "Bloquear la sobreescritura de drivers con directivas locales y Device IDs",
    "targetMechanism": "Group Policy Device Installation Restrictions & Driver Exclusion Flags",
    "targetComponent": "gpedit.msc / HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate",
    "commandName": "reg add \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "Instalás el driver oficial del fabricante de tu placa de video y a las dos horas Windows Update te lo borra y pone uno viejo.",
      "mythVsTruth": {
        "mentira": "Es imposible evitar que Windows Update toque los controladores de tus dispositivos.",
        "verdad": "Una directiva de registro llamada ExcludeWUDriversInQualityUpdate prohíbe que Windows Update descargue drivers, dejando solo los parches de seguridad.",
        "comprobalo": "Agregá la clave en el Registro y observá cómo la pestaña de drivers desaparece de las descargas automáticas."
      }
    },
    "entende": {
      "queEs": "La directiva del sistema que desacopla la actualización del sistema operativo de la actualización de hardware.",
      "paraQueSirve": "Evitar que drivers genéricos arruinen calibraciones, paneles de control o perfiles de overclock.",
      "quePasaSiFalta": "Luchas continuas donde el usuario instala un driver y Windows Update lo sobreescribe en bucle."
    },
    "interactua": {
      "cliExample": "reg add \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f",
      "psExample": "Set-ItemProperty -Path \"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\" -Name \"ExcludeWUDriversInQualityUpdate\" -Value 1",
      "syntaxBreakdown": "Establece la directiva que excluye controladores en las actualizaciones de calidad.",
      "whatToLookFor": "ExcludeWUDriversInQualityUpdate = 0x00000001 en el Registro.",
      "technicalMetrics": "Elimina el 100% de sobreescrituras automáticas de drivers en Windows Update."
    },
    "alertaEVO": {
      "reversibilityRule": "Cambiar el valor a 0 o eliminar la clave reactiva la descarga de drivers automáticos.",
      "safetyWarning": "Recordá actualizar manualmente los drivers de tu GPU y chipset periódicamente desde la web del fabricante."
    },
    "evidenceBadge": {
      "code": "BLOCK-DRV",
      "label": "Driver Exclusion"
    }
  }
];

export const SECTOR_20_MINICASES: Sector20MiniCase[] = [
  {
    "id": "case-20-01",
    "code": "MC-20.01",
    "title": "Windows Update trabado al 99% en bucle infinito",
    "scenario": "Una computadora de escritorio lleva tres días intentando instalar el parche acumulativo mensual. Se descarga hasta el 99%, se clava 4 horas y luego muestra error 0x80070002.",
    "userStatement": "El disco duro se rompió y ya no puede guardar archivos.",
    "initialMistake": "Asumir falla física del almacenamiento sin verificar la corrupción en la carpeta de caché SoftwareDistribution.",
    "diagnosticQuestion": "¿Cuál es el procedimiento técnico estándar para destrabar el ciclo de descarga?",
    "options": [
      {
        "id": "opt-a",
        "text": "Detener los servicios wuauserv y cryptSvc, renombrar C:\\Windows\\SoftwareDistribution a .old y reiniciar el servicio para forzar una descarga limpia.",
        "isCorrect": true,
        "explanation": "El error 0x80070002 indica archivo no encontrado o hash de descarga corrupto en el caché local. Limpiar la carpeta SoftwareDistribution resuelve el 95% de estos bloqueos."
      },
      {
        "id": "opt-b",
        "text": "Comprar una licencia nueva de Windows 11.",
        "isCorrect": false,
        "explanation": "La licencia no influye en la integridad del caché local de descargas."
      },
      {
        "id": "opt-c",
        "text": "Desinstalar la tarjeta de video del equipo.",
        "isCorrect": false,
        "explanation": "No tiene relación con el subsistema de descargas BITS."
      }
    ],
    "technicalVerdict": "La purga del caché de SoftwareDistribution permitió que Windows descargara el paquete LCU intacto, completando la instalación en 10 minutos.",
    "lessonLearned": "SoftwareDistribution es un almacén transitorio de descargas; recrearlo limpia corrupciones de red sin comprometer los datos del usuario."
  },
  {
    "id": "case-20-02",
    "code": "MC-20.02",
    "title": "El error 0x800f081f y la corrupción del Component Store",
    "scenario": "Al intentar instalar un paquete de seguridad, la actualización falla repetidamente con el código 0x800f081f (CBS_E_SOURCE_MISSING) tanto por Windows Update como por instalador offline.",
    "userStatement": "El instalador que descargué de internet vino roto.",
    "initialMistake": "Descargar el archivo repetidas veces sin reparar el almacén canónico de componentes (WinSxS).",
    "diagnosticQuestion": "¿Cómo se resuelve de forma definitiva el error CBS_E_SOURCE_MISSING en Windows?",
    "options": [
      {
        "id": "opt-a",
        "text": "Ejecutar DISM /Online /Cleanup-Image /RestoreHealth para reparar los paquetes faltantes en WinSxS desde los servidores de Microsoft o una ISO montada.",
        "isCorrect": true,
        "explanation": "0x800f081f significa que el Servicing Stack no encuentra un componente base previo en WinSxS para calcular el diferencial. DISM RestoreHealth descarga los bloques limpios."
      },
      {
        "id": "opt-b",
        "text": "Borrar la carpeta System32 entera.",
        "isCorrect": false,
        "explanation": "Destruiría de inmediato la instalación de Windows."
      },
      {
        "id": "opt-c",
        "text": "Desactivar la conexión a internet y reiniciar.",
        "isCorrect": false,
        "explanation": "Sin conexión DISM no puede descargar los archivos sanos a menos que se especifique una ISO local."
      }
    ],
    "technicalVerdict": "DISM reparó el almacén de componentes WinSxS descargando los archivos base sanos, tras lo cual el parche acumulativo se instaló sin inconvenientes.",
    "lessonLearned": "Los parches acumulativos requieren que los cimientos del almacén de componentes estén íntegros; DISM es la herramienta indispensable previa a cualquier update complejo."
  },
  {
    "id": "case-20-03",
    "code": "MC-20.03",
    "title": "Windows Update reemplaza el driver de video oficial por uno antiguo",
    "scenario": "Un jugador instala los últimos controladores Adrenalin de AMD o Game Ready de NVIDIA. A las pocas horas, la pantalla parpadea y Windows Update instala un driver genérico OEM de hace un año, rompiendo el panel de control.",
    "userStatement": "El instalador de NVIDIA tiene un virus y Windows lo está desinstalando.",
    "initialMistake": "Reinstalar el driver una y otra vez en un bucle sin fin sin bloquear la directiva de distribución de drivers en Windows Update.",
    "diagnosticQuestion": "¿Qué configuración previene que Windows Update vuelva a pisar el driver de video?",
    "options": [
      {
        "id": "opt-a",
        "text": "Habilitar la directiva \"ExcludeWUDriversInQualityUpdate\" en el Registro o en gpedit.msc para prohibir la inclusión de drivers en las actualizaciones de calidad.",
        "isCorrect": true,
        "explanation": "Esta directiva le ordena explícitamente al cliente de Windows Update que solo busque parches de seguridad y componentes del sistema operativo, ignorando la categoría de drivers."
      },
      {
        "id": "opt-b",
        "text": "Poner la pantalla en resolución 800x600 para que Windows no reconozca la placa.",
        "isCorrect": false,
        "explanation": "Absurdo; la enumeración de hardware depende de los IDs de bus PCI, no de la resolución."
      },
      {
        "id": "opt-c",
        "text": "Apagar el monitor cada vez que Windows Update busque actualizaciones.",
        "isCorrect": false,
        "explanation": "Windows Update opera a nivel de kernel independientemente del estado de la pantalla."
      }
    ],
    "technicalVerdict": "Se aplicó ExcludeWUDriversInQualityUpdate=1 en el Registro; el driver del fabricante se mantuvo estable y sin sobreescrituras automáticas.",
    "lessonLearned": "Windows Update está diseñado para usuarios no técnicos que necesitan drivers automáticos; en entornos especializados, la exclusión de drivers por directiva es obligatoria."
  },
  {
    "id": "case-20-04",
    "code": "MC-20.04",
    "title": "La actualización que rompió el software de facturación de la empresa",
    "scenario": "Tras el Patch Tuesday de este mes, una actualización acumulativa recién instalada causa un bloqueo total en el software de gestión de la empresa. Cientos de empleados no pueden facturar.",
    "userStatement": "Hay que formatear todas las computadoras antes de que empiece la jornada.",
    "initialMistake": "Plantear un formateo masivo cuando el paquete KB causante puede removerse de manera limpia e inmediata.",
    "diagnosticQuestion": "¿Cómo se desinstala el paquete KB causante de forma remota o por consola sin perder datos?",
    "options": [
      {
        "id": "opt-a",
        "text": "Ejecutar wusa /uninstall /kb:XXXXXXX /quiet /norestart o DISM /Online /Remove-Package especificando el nombre del paquete acumulativo.",
        "isCorrect": true,
        "explanation": "Windows conserva los binarios reemplazados en WinSxS; wusa o DISM revierten los punteros de los archivos en minutos sin tocar ningún documento o programa de usuario."
      },
      {
        "id": "opt-b",
        "text": "Restaurar la computadora a estado de fábrica con pérdida total de archivos.",
        "isCorrect": false,
        "explanation": "Destructivo y desproporcionado; la desinstalación atómica del KB toma menos de 5 minutos."
      },
      {
        "id": "opt-c",
        "text": "Cambiar la fecha del reloj de Windows a 1999.",
        "isCorrect": false,
        "explanation": "Rompería los certificados SSL y la autenticación de red de toda la empresa."
      }
    ],
    "technicalVerdict": "La desinstalación del KB mediante wusa devolvió la operatividad al software de facturación en 3 minutos. Se pausaron las actualizaciones durante 30 días.",
    "lessonLearned": "Las actualizaciones acumulativas son reversibles gracias a la arquitectura transaccional de WinSxS; un rollback quirúrgico supera siempre a la reinstalación precipitada."
  }
];

export const SECTOR_20_TEST_BANK: Sector20TestQuestion[] = [
  {
    "id": "q-20-01",
    "questionNumber": 1,
    "category": "Arquitectura de Actualizaciones",
    "question": "¿Qué es y qué función cumple el Servicing Stack (SSU) en el ecosistema de Windows Update?",
    "options": [
      {
        "id": "opt-a",
        "text": "Es el motor base del kernel y binarios que orquesta la instalación atómica de parches, reemplazo de archivos bloqueados y gestión de WinSxS."
      },
      {
        "id": "opt-b",
        "text": "Es un navegador web para ver los artículos de soporte de Microsoft."
      },
      {
        "id": "opt-c",
        "text": "Es una aplicación para cambiar los fondos de pantalla cada semana."
      },
      {
        "id": "opt-d",
        "text": "Es el antivirus que escanea los archivos adjuntos de correo electrónico."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "El Servicing Stack (SSU) provee la infraestructura y binarios de bajo nivel indispensables para que cualquier parche acumulativo pueda ser procesado sin corromper el sistema.",
    "relatedInvestigationCode": "20.03"
  },
  {
    "id": "q-20-02",
    "questionNumber": 2,
    "category": "Almacén de Componentes",
    "question": "¿Por qué NUNCA se debe borrar manualmente la carpeta C:\\Windows\\WinSxS con Shift + Supr?",
    "options": [
      {
        "id": "opt-a",
        "text": "Porque WinSxS es el sistema operativo real; los archivos de System32 son hard links (enlaces duros) que apuntan físicamente a WinSxS."
      },
      {
        "id": "opt-b",
        "text": "Porque si la borrás, se apaga el monitor para siempre."
      },
      {
        "id": "opt-c",
        "text": "Porque contiene solo películas y videos descargados por Windows Media Player."
      },
      {
        "id": "opt-d",
        "text": "Porque la papelera de reciclaje no acepta archivos de más de 1 GB."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "WinSxS contiene la tienda canónica de componentes de Windows. Los binarios visibles en System32 apuntan a los clusters físicos de WinSxS mediante hard links de NTFS.",
    "relatedInvestigationCode": "20.08"
  },
  {
    "id": "q-20-03",
    "questionNumber": 3,
    "category": "Diagnóstico Forense",
    "question": "¿Cuál es el archivo de registro forense principal donde Windows guarda el detalle línea por línea de las fallas de instalación de componentes y manifiestos?",
    "options": [
      {
        "id": "opt-a",
        "text": "C:\\Windows\\Logs\\CBS\\CBS.log"
      },
      {
        "id": "opt-b",
        "text": "C:\\boot.ini"
      },
      {
        "id": "opt-c",
        "text": "C:\\Windows\\System32\\calc.exe"
      },
      {
        "id": "opt-d",
        "text": "C:\\Windows\\notepad.exe"
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "CBS.log (Component-Based Servicing Log) registra cada fase de evaluación, verificación de hash y error de instalación que procesa TiWorker.exe.",
    "relatedInvestigationCode": "20.09"
  },
  {
    "id": "q-20-04",
    "questionNumber": 4,
    "category": "Caché de Descargas",
    "question": "¿Qué carpeta se puede renombrar o vaciar de forma segura para resolver descargas trabadas al 0% o errores de hash corrupto en Windows Update?",
    "options": [
      {
        "id": "opt-a",
        "text": "C:\\Windows\\SoftwareDistribution"
      },
      {
        "id": "opt-b",
        "text": "C:\\Windows\\System32\\drivers"
      },
      {
        "id": "opt-c",
        "text": "C:\\Program Files"
      },
      {
        "id": "opt-d",
        "text": "C:\\Users"
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "SoftwareDistribution es el almacén de caché temporal de descargas de Windows Update; detener el servicio y vaciarla fuerza una descarga limpia desde cero.",
    "relatedInvestigationCode": "20.10"
  },
  {
    "id": "q-20-05",
    "questionNumber": 5,
    "category": "Parches Acumulativos",
    "question": "¿Qué significa que las actualizaciones mensuales de Windows (LCU) sean de naturaleza \"acumulativa\"?",
    "options": [
      {
        "id": "opt-a",
        "text": "Que instalar el último paquete LCU incluye automáticamente todas las correcciones, funciones y parches de seguridad de los meses anteriores."
      },
      {
        "id": "opt-b",
        "text": "Que cada mes la computadora se vuelve más lenta de forma deliberada."
      },
      {
        "id": "opt-c",
        "text": "Que ocupan toda la memoria RAM disponible al momento de reiniciar."
      },
      {
        "id": "opt-d",
        "text": "Que solo se pueden descargar si se tiene instalada una versión anterior específica."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "El modelo acumulativo elimina la fragmentación de versiones intermedias: un solo paquete lleva cualquier máquina de esa rama a la versión más actualizada.",
    "relatedInvestigationCode": "20.04"
  },
  {
    "id": "q-20-06",
    "questionNumber": 6,
    "category": "Códigos de Error HRESULT",
    "question": "¿Qué herramienta nativa de línea de comandos permite traducir códigos de error hexadecimales como 0x80070002 a mensajes de texto descriptivos?",
    "options": [
      {
        "id": "opt-a",
        "text": "certutil -error <código>"
      },
      {
        "id": "opt-b",
        "text": "ping -t"
      },
      {
        "id": "opt-c",
        "text": "tracert"
      },
      {
        "id": "opt-d",
        "text": "nslookup"
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "certutil -error decodifica estructuras HRESULT y códigos de error del sistema Win32/CBS mostrando el mensaje oficial de Microsoft.",
    "relatedInvestigationCode": "20.12"
  },
  {
    "id": "q-20-07",
    "questionNumber": 7,
    "category": "Operaciones Pendientes de Boot",
    "question": "¿Dónde almacena Windows la lista de archivos bloqueados que deben ser reemplazados de forma temprana antes del inicio del escritorio?",
    "options": [
      {
        "id": "opt-a",
        "text": "En la clave de registro PendingFileRenameOperations en HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager."
      },
      {
        "id": "opt-b",
        "text": "En un archivo de texto en el Escritorio del usuario."
      },
      {
        "id": "opt-c",
        "text": "En la memoria caché del teclado USB."
      },
      {
        "id": "opt-d",
        "text": "En la papelera de reciclaje de la unidad D:."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "Session Manager (smss.exe) lee PendingFileRenameOperations en las fases tempranas del kernel para sustituir DLLs y archivos de sistema en uso.",
    "relatedInvestigationCode": "20.13"
  },
  {
    "id": "q-20-08",
    "questionNumber": 8,
    "category": "Control de Controladores",
    "question": "¿Qué directiva de registro prohíbe que Windows Update descargue controladores y sobreescriba los drivers dedicados del fabricante?",
    "options": [
      {
        "id": "opt-a",
        "text": "ExcludeWUDriversInQualityUpdate en HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate fijado en 1."
      },
      {
        "id": "opt-b",
        "text": "DisableInternetConnection fijado en 1."
      },
      {
        "id": "opt-c",
        "text": "NoDisplayDriverAlerts en 0."
      },
      {
        "id": "opt-d",
        "text": "DeleteAllDrivers en 1."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "ExcludeWUDriversInQualityUpdate excluye la categoría de drivers del sondeo de Windows Update, dejando los parches de seguridad activos.",
    "relatedInvestigationCode": "20.16"
  },
  {
    "id": "q-20-09",
    "questionNumber": 9,
    "category": "Rollback Transaccional",
    "question": "¿Qué ocurre si una actualización acumulativa causa una falla catastrófica de arranque (pantallazo azul) durante el reinicio?",
    "options": [
      {
        "id": "opt-a",
        "text": "El gestor de arranque detecta dos fallas consecutivas y WinRE revierte automáticamente la transacción del paquete sin perder archivos."
      },
      {
        "id": "opt-b",
        "text": "El procesador se bloquea físicamente y requiere cambio de placa madre."
      },
      {
        "id": "opt-c",
        "text": "Windows formatea el disco duro automáticamente sin confirmación."
      },
      {
        "id": "opt-d",
        "text": "Se borran las particiones de todos los discos conectados."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "La política de arranque protegida (BootStatusPolicy) activa el entorno de recuperación tras fallas repetidas, orquestando el rollback de parches fallidos.",
    "relatedInvestigationCode": "20.14"
  },
  {
    "id": "q-20-10",
    "questionNumber": 10,
    "category": "Mantenimiento DISM",
    "question": "¿Cuál es el comando seguro y oficial para purgar versiones antiguas de componentes reemplazados en WinSxS?",
    "options": [
      {
        "id": "opt-a",
        "text": "dism /online /cleanup-image /startcomponentcleanup"
      },
      {
        "id": "opt-b",
        "text": "format C: /q"
      },
      {
        "id": "opt-c",
        "text": "del C:\\Windows\\*.* /s /q"
      },
      {
        "id": "opt-d",
        "text": "shutdown /s /f /t 0"
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "DISM /online /cleanup-image /startcomponentcleanup analiza la base de datos de WinSxS y desinstala componentes obsoletos reemplazados hace más de 30 días.",
    "relatedInvestigationCode": "20.08"
  }
];
