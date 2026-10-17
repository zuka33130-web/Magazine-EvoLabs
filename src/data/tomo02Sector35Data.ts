// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 35: EL MITO DE LOS OPTIMIZADORES
// "Instalaste un programa para tener menos procesos... y ahora tenés más"

export type RiskLevelSector35 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector35Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector35;
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

export interface Sector35MiniCase {
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

export interface Sector35TestQuestion {
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

export const SECTOR_35_INVESTIGATIONS: Sector35Investigation[] = [
  {
    id: "inv-35-01",
    code: "35.01",
    title: "Registry cleaners",
    subtitle: "Por qué limpiar claves huérfanas no acelera tu PC y rompe COM/CLSID",
    targetMechanism: "Registry Hive Memory-Mapped File B-Trees",
    targetComponent: "advapi32.dll / RegQueryValueExW",
    commandName: "reg.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el Registro de Windows es un árbol B indexado en memoria donde tener 10.000 claves 'huérfanas' produce un impacto en rendimiento de exactamente 0,00 milisegundos?",
      mythVsTruth: {
        mentira: "El registro se 'ensucia' y ralentiza la lectura de Windows al iniciar.",
        verdad: "Windows no lee el registro de arriba a abajo; busca claves por hash binario directo en tiempo O(1) u O(log N).",
        comprobalo: "Compara el tiempo de arranque antes y después de borrar 5.000 claves de registro: la diferencia es indetectable por cronómetro."
      }
    },
    entende: {
      queEs: "La verdad sobre el funcionamiento interno de las colmenas (hives) del Registro y los algoritmos de búsqueda binaria.",
      paraQueSirve: "Desmitificar el argumento de marketing más extendido del software utilitario de los últimos 25 años.",
      quePasaSiFalta: "Los limpiadores borran referencias a interfaces COM, códecs de audio o extensiones de shell válidas, causando cuelgues aleatorios del Explorador."
    },
    interactua: {
      cliExample: "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\"",
      psExample: "Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run' | Out-String",
      syntaxBreakdown: "Inspecciona directamente las ramas de inicio sin intermediarios ni falsas alertas comerciales.",
      whatToLookFor: "Valores reales registrados frente a los supuestos 'errores críticos' que inventan los optimizadores.",
      technicalMetrics: "El tamaño del archivo SYSTEM.DAT o SOFTWARE rara vez supera los 80 MB y se carga paginado en RAM."
    },
    alertaEVO: {
      reversibilityRule: "La lectura del registro es 100% segura.",
      safetyWarning: "Nunca uses la opción 'Reparar todos los problemas' de limpiadores de registro sin un backup completo de System Restore."
    },
    evidenceBadge: {
      code: "S35-REG-01",
      label: "REGISTRY-TRUTH"
    }
  },
  {
    id: "inv-35-02",
    code: "35.02",
    title: "RAM boosters",
    subtitle: "La falacia de EmptyWorkingSet y el castigo del Pagefile thrashing",
    targetMechanism: "Memory Manager Working Set Trimming",
    targetComponent: "ntdll.dll!NtSetSystemInformation / psapi.dll!EmptyWorkingSet",
    commandName: "RAMMap.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué al presionar 'Liberar RAM' en un optimizador el porcentaje baja del 80% al 20%, pero de repente tu PC se congela durante 5 segundos?",
      mythVsTruth: {
        mentira: "La RAM libre es RAM rápida; cuanto más libre esté, más rápido funciona la computadora.",
        verdad: "La RAM no utilizada es RAM desperdiciada; los optimizadores fuerzan el vaciado del Working Set al disco, destruyendo la caché Standby.",
        comprobalo: "Abre RAMMap, dale a 'Liberar RAM' en un optimizador y observa cómo la Standby List cae a cero y el disco C: sube al 100% escribiendo en el pagefile."
      }
    },
    entende: {
      queEs: "La llamada nativa `EmptyWorkingSet()` que expulsa a la fuerza las páginas de memoria de las aplicaciones hacia el archivo de paginación en disco.",
      paraQueSirve: "Entender que cuando vuelves a hacer clic en tu navegador, el sistema tiene que leer desde el disco duro o SSD lo que ya tenía listo en RAM.",
      quePasaSiFalta: "El uso continuo de estos boosters acorta la vida útil del SSD por escrituras masivas de páginas de memoria descartadas."
    },
    interactua: {
      cliExample: "typeperf \"\\Memory\\Available MBytes\" \"\\Memory\\Pages/sec\" -sc 5",
      psExample: "Get-Counter '\\Memory\\Available MBytes', '\\Memory\\Pages/sec' -Continuous",
      syntaxBreakdown: "Mide la memoria disponible y la tasa de fallos de página duros (Pages/sec) que obligan a leer del almacenamiento.",
      whatToLookFor: "Picos violentos de Pages/sec inmediatamente después de usar un 'limpiador de RAM'.",
      technicalMetrics: "El Memory Manager de Windows mantiene automáticamente la memoria en estado Standby para reutilización instantánea."
    },
    alertaEVO: {
      reversibilityRule: "typeperf es una consulta pasiva de PerfMon.",
      safetyWarning: "Desinstala cualquier programa que prometa 'optimizar la memoria en segundo plano cada 5 minutos'."
    },
    evidenceBadge: {
      code: "S35-RAM-02",
      label: "RAM-UNMASKED"
    }
  },
  {
    id: "inv-35-03",
    code: "35.03",
    title: "Game boosters",
    subtitle: "El placebo de suspender servicios y por qué no añade FPS reales",
    targetMechanism: "Thread Priority Boosting & Service State Suspension",
    targetComponent: "Service Control Manager (services.exe)",
    commandName: "sc.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Si un Game Booster promete '+30 FPS' cerrando la cola de impresión y el servicio de temas, ¿por qué los benchmarks de frametime muestran exactamente la misma media?",
      mythVsTruth: {
        mentira: "Desactivar servicios de Windows le da más potencia a la tarjeta gráfica y al procesador en los juegos.",
        verdad: "Los servicios en reposo no consumen ciclos de CPU; al apagarlos, el scheduler no obtiene ninguna ganancia de IPC y rompes funciones de red o audio.",
        comprobalo: "Corre un benchmark repetible (Shadow of the Tomb Raider o 3DMark) con y sin Game Booster: la variabilidad es menor al 1% (margen de error estadístico)."
      }
    },
    entende: {
      queEs: "La técnica de apagar servicios de Windows indiscriminadamente bajo la premisa de 'modo juego'.",
      paraQueSirve: "Demostrar que los juegos modernos están limitados por cuello de botella de GPU o IPC/latencia de RAM, no por servicios inactivos de Windows.",
      quePasaSiFalta: "Provoca caídas de conexión en Discord, fallos en la sincronización de mandos Bluetooth y pérdida de audio espacial."
    },
    interactua: {
      cliExample: "sc queryex type= service state= all | findstr /i \"RUNNING STOPPED\"",
      psExample: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Id, ProcessName, CPU, WorkingSet64",
      syntaxBreakdown: "Enumera los procesos con mayor tiempo acumulado de CPU; verás que los servicios de fondo consumen 0.0% de CPU.",
      whatToLookFor: "Comprueba que los servicios que apagan los boosters ni siquiera figuran en la lista de uso de CPU activo.",
      technicalMetrics: "Un hilo en estado `Waiting` en el Scheduler no entra en el pipeline de ejecución de los núcleos."
    },
    alertaEVO: {
      reversibilityRule: "sc queryex es de solo lectura.",
      safetyWarning: "No uses optimizadores que modifiquen el registro para fijar afinidad de CPU a ciegas."
    },
    evidenceBadge: {
      code: "S35-BOOST-03",
      label: "GAMEBOOST-MYTH"
    }
  },
  {
    id: "inv-35-04",
    code: "35.04",
    title: "Driver boosters",
    subtitle: "El peligro crítico de los actualizadores automáticos de controladores",
    targetMechanism: "Driver Package Signing & INF Hardware ID Matching",
    targetComponent: "drvload.exe / pnputil.exe / Windows Driver Frameworks",
    commandName: "pnputil.exe",
    riskLevel: "HIGH_RISK",
    descubri: {
      hook: "¿Por qué los programas de 'Driver Booster' afirman tener 30 drivers desactualizados en una máquina recién ensamblada con drivers oficiales?",
      mythVsTruth: {
        mentira: "Tener siempre la última versión de cualquier driver desconocido mejora el rendimiento del equipo.",
        verdad: "Estos programas emparejan Hardware IDs de forma aproximada e instalan drivers genéricos o de servidores OEM chinos que provocan BSODs.",
        comprobalo: "Examina con pnputil los drivers instalados por un booster: muchos carecen de firma WHQL válida o fueron modificados con installers empaquetados."
      }
    },
    entende: {
      queEs: "El riesgo que supone reemplazar el catálogo oficial de controladores de Windows Update y fabricantes por repositorios de terceros no auditados.",
      paraQueSirve: "Prevenir la causa número 1 de pantallas azules inexplicables en computadoras de usuarios particulares.",
      quePasaSiFalta: "Instalación de controladores incompatibles con el chipset de audio o red que dejan la PC sin sonido o sin Wi-Fi."
    },
    interactua: {
      cliExample: "pnputil /enum-drivers",
      psExample: "Get-CimInstance Win32_PnPSignedDriver | Where-Object { -not $_.IsSigned } | Select-Object DeviceName, DriverVersion",
      syntaxBreakdown: "Lista todos los paquetes de controladores de terceros en el Driver Store y verifica si tienen firma digital válida.",
      whatToLookFor: "Controladores que no provengan de 'Microsoft Windows Component Publisher' o del fabricante original (Realtek, Intel, NVIDIA).",
      technicalMetrics: "Un driver en Ring 0 tiene privilegios absolutos; un driver inestable causará un crash en el kernel de inmediato."
    },
    alertaEVO: {
      reversibilityRule: "pnputil /enum-drivers es una consulta pasiva.",
      safetyWarning: "Nunca descargues controladores desde instaladores todo-en-uno que no pertenezcan al sitio del fabricante de tu motherboard o GPU."
    },
    evidenceBadge: {
      code: "S35-DRV-04",
      label: "DRIVER-INTEGRITY"
    }
  },
  {
    id: "inv-35-05",
    code: "35.05",
    title: "Internet boosters",
    subtitle: "Modificaciones arcaicas de MTU, TCP Window y ruptura de Autotuning",
    targetMechanism: "TCP/IP Stack Windows Scaling & Receive Window Auto-Tuning",
    targetComponent: "tcpip.sys / netsh int tcp",
    commandName: "netsh.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Sabías que los 'aceleradores de internet' aplican trucos de registro inventados en 1998 para módems dial-up de 56 kbps?",
      mythVsTruth: {
        mentira: "Desactivar el TCP Autotuning de Windows reduce el ping y acelera las descargas de fibra óptica.",
        verdad: "Desactivar el autotuning limita el ancho de banda a un búfer estático minúsculo, reduciendo tu conexión de 500 Mbps a menos de 20 Mbps.",
        comprobalo: "Ejecuta un test de velocidad con autotuning en 'disabled' y luego en 'normal': verás cómo destruye la velocidad en conexiones de alta velocidad."
      }
    },
    entende: {
      queEs: "El algoritmo dinámico de ventana de recepción (RWIN) con el que Windows calcula el producto de retardo de ancho de banda (BDP).",
      paraQueSirve: "Entender que la pila TCP/IP de Windows 10 y 11 ya viene optimizada por defecto con algoritmos heurísticos avanzados.",
      quePasaSiFalta: "Congelamiento de buffers de streaming de video, pérdida de paquetes y latencia inconsistente en juegos online."
    },
    interactua: {
      cliExample: "netsh int tcp show global",
      psExample: "Get-NetTCPSetting | Select-Object SettingName, AutoTuningLevelLocal, ScalingHeuristics",
      syntaxBreakdown: "Muestra la configuración global de la pila TCP/IP, incluyendo el nivel de ajuste automático de la ventana de recepción.",
      whatToLookFor: "El valor 'Receive Window Auto-Tuning Level' debe estar en 'normal'. Si dice 'disabled', un optimizador lo rompió.",
      technicalMetrics: "Un nivel de autotuning normal escala la ventana TCP hasta 16 MB dinámicamente según el RTT del enlace."
    },
    alertaEVO: {
      reversibilityRule: "Para restaurar: netsh int tcp set global autotuninglevel=normal",
      safetyWarning: "No apliques scripts de registro de foros de juegos que toquen 'TcpAckFrequency' sin medir jitter con telemetría."
    },
    evidenceBadge: {
      code: "S35-NET-05",
      label: "TCP-NORMALIZED"
    }
  },
  {
    id: "inv-35-06",
    code: "35.06",
    title: "One-click repair",
    subtitle: "Ingeniería social del miedo: Cómo inflan falsos positivos",
    targetMechanism: "Fearware Diagnostic Heuristics & Commercial Upselling",
    targetComponent: "GUI Engine / Scanner Regex",
    commandName: "powershell.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué si instalas un 'One-Click PC Repair' en una máquina virtual con Windows recién instalado de cero, el programa encuentra 1.480 'problemas graves'?",
      mythVsTruth: {
        mentira: "Un sistema nuevo ya tiene cientos de errores que amenazan la privacidad y el rendimiento.",
        verdad: "Cuentan cada cookie de navegador, cada clave de archivo reciente MRU y cada entrada temporal del visor de eventos como un 'peligro crítico'.",
        comprobalo: "Lee el reporte detallado: el 99% de los 'problemas' son archivos .tmp vacíos de 0 bytes o historiales de búsqueda de la papelera."
      }
    },
    entende: {
      queEs: "El modelo de negocio conocido como 'scareware' o 'fearware', diseñado para asustar al usuario común y forzarlo a comprar una suscripción anual.",
      paraQueSirve: "Aprender a discernir entre una anomalía del kernel genuina y una alerta de marketing inflada artificialmente.",
      quePasaSiFalta: "El usuario gasta dinero en licencias inútiles y confía en un software que añade carga parasitaria a su equipo."
    },
    interactua: {
      cliExample: "echo Análisis forense de archivos temporales: & dir /s /a C:\\Windows\\Temp | findstr /i \"archivos bytes\"",
      psExample: "Get-ChildItem -Path $env:TEMP -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum",
      syntaxBreakdown: "Calcula el peso real de los archivos temporales de tu usuario sin exagerar el conteo de elementos individuales.",
      whatToLookFor: "Comprueba que unos cientos de archivos temporales suelen pesar menos de 200 MB y no afectan la velocidad del procesador.",
      technicalMetrics: "El rendimiento del sistema de archivos solo se degrada si un único directorio contiene más de 100.000 entradas MFT sin indexar."
    },
    alertaEVO: {
      reversibilityRule: "Las consultas de espacio temporal son inocuas.",
      safetyWarning: "Desconfía de cualquier ventana emergente que use colores rojos parpadeantes y frases como '¡Tu PC está en riesgo crítico!'."
    },
    evidenceBadge: {
      code: "S35-FEAR-06",
      label: "SCAREWARE-EXPOSED"
    }
  },
  {
    id: "inv-35-07",
    code: "35.07",
    title: "Qué instalan",
    subtitle: "La anatomía del software parásito que llega de regalo con el instalador",
    targetMechanism: "Bundled Software Injection & Silent Secondary Installers",
    targetComponent: "Installer Bundles / MSI Transforms",
    commandName: "wmic.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Descargaste un 'optimizador gratuito' de 25 MB y terminaste con dos barras de herramientas, un antivirus no deseado y un buscador cambiado?",
      mythVsTruth: {
        mentira: "El instalador solo copia los archivos del programa que descargaste.",
        verdad: "Los instaladores gratuitos monetizan empaquetando PPI (Pay-Per-Install), ejecutando instaladores secundarios silenciosos durante el asistente.",
        comprobalo: "Revisa los registros de instalación en %LocalAppData%\\Temp durante la instalación de un optimizador para ver qué binarios auxiliares invoca."
      }
    },
    entende: {
      queEs: "El ecosistema de empaquetado de software potencialmente no deseado (PUA/PUP) que subsidia a la industria de los optimizadores.",
      paraQueSirve: "Identificar los componentes secundarios que quedan residiendo en memoria mucho después de cerrar la aplicación principal.",
      quePasaSiFalta: "El equipo se llena de rastreadores publicitarios, pop-ups comerciales y secuestradores del navegador (browser hijackers)."
    },
    interactua: {
      cliExample: "wmic product get name,version,installdate",
      psExample: "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion, InstallDate",
      syntaxBreakdown: "Lista todas las aplicaciones registradas en el sistema con su fecha de instalación para detectar programas colados el mismo día.",
      whatToLookFor: "Nombres como 'Toolbar', 'Search Assistant', 'Updater Service' o utilitarios que nunca pediste explícitamente.",
      technicalMetrics: "El 80% de los optimizadores gratuitos instalan al menos un servicio secundario que se auto-inicia en boot."
    },
    alertaEVO: {
      reversibilityRule: "Listar programas instalados no modifica el sistema.",
      safetyWarning: "Si vas a instalar utilidades, lee siempre cada pantalla del instalador y desmarca casillas de ofertas patrocinadas."
    },
    evidenceBadge: {
      code: "S35-BUNDLE-07",
      label: "PUP-INSPECTED"
    }
  },
  {
    id: "inv-35-08",
    code: "35.08",
    title: "Services",
    subtitle: "Servicios residentes que vigilan tu PC y devoran memoria",
    targetMechanism: "Service Control Manager (SCM) Background Daemon Spawning",
    targetComponent: "services.exe / svchost.exe",
    commandName: "Get-Service",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Querías tener menos servicios activos en Windows, pero ¿sabías que instalar ese optimizador añadió de 2 a 4 servicios automáticos nuevos?",
      mythVsTruth: {
        mentira: "El optimizador solo se activa cuando tú abres su ventana.",
        verdad: "Registra servicios permanentes en el Service Control Manager que corren bajo NT AUTHORITY\\SYSTEM las 24 horas del día.",
        comprobalo: "Filtra en services.msc por la empresa desarrolladora del optimizador: verás servicios con nombres como 'LiveUpdate', 'Monitoring' o 'Engine'."
      }
    },
    entende: {
      queEs: "La forma en que estos programas aseguran su persistencia en el ciclo de vida del sistema operativo.",
      paraQueSirve: "Descubrir por qué una PC con optimizadores tarda más en arrancar y tiene más hilos de ejecución activos que una instalación limpia.",
      quePasaSiFalta: "Contención de recursos en el Service Control Manager y retraso en el inicio de servicios legítimos de Windows."
    },
    interactua: {
      cliExample: "sc query type= service state= all | findstr /i \"SERVICE_NAME\"",
      psExample: "Get-Service | Where-Object { $_.Status -eq 'Running' -and $_.DisplayName -notmatch 'Windows|Microsoft' } | Select-Object Name, DisplayName",
      syntaxBreakdown: "Filtra todos los servicios en ejecución que no pertenecen a Microsoft, exponiendo inmediatamente a los optimizadores y boosters.",
      whatToLookFor: "Servicios con descripciones genéricas como 'Boost Engine Service' o 'System Care Realtime Monitor'.",
      technicalMetrics: "Cada servicio Win32 residente consume entre 15 MB y 60 MB de memoria de trabajo y al menos 2 hilos permanentes."
    },
    alertaEVO: {
      reversibilityRule: "Get-Service es una consulta segura.",
      safetyWarning: "No deshabilites servicios de drivers de video (NVIDIA/AMD) creyendo que son optimizadores; revisa el fabricante del binario."
    },
    evidenceBadge: {
      code: "S35-SVC-08",
      label: "SERVICES-UNCOVERED"
    }
  },
  {
    id: "inv-35-09",
    code: "35.09",
    title: "Tasks",
    subtitle: "Tareas programadas ocultas que despiertan tu PC a deshoras",
    targetMechanism: "Task Scheduler XML Triggers & Actions",
    targetComponent: "taskschd.msc / schtasks.exe",
    commandName: "schtasks.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué de repente tu laptop empieza a acelerar los ventiladores a las 3:00 AM estando suspendida o con la tapa cerrada?",
      mythVsTruth: {
        mentira: "Windows se está actualizando por su cuenta.",
        verdad: "El optimizador configuró una tarea programada con la opción 'Reactivar el equipo para ejecutar esta tarea' para realizar un escaneo publicitario.",
        comprobalo: "Usa schtasks para buscar tareas en la carpeta raíz del programador creadas por software de terceros."
      }
    },
    entende: {
      queEs: "La manipulación del Programador de Tareas de Windows para ejecutar procesos de fondo periódicos sin conocimiento del usuario.",
      paraQueSirve: "Erradicar las tareas parasitarias que consumen ciclos de reloj y batería en equipos portátiles.",
      quePasaSiFalta: "La computadora se despierta en mochilas o maletines, generando sobrecalentamiento y agotando la batería."
    },
    interactua: {
      cliExample: "schtasks /query /fo TABLE /v | findstr /i \"Ready Running\"",
      psExample: "Get-ScheduledTask | Where-Object { $_.TaskPath -notmatch '\\\\Microsoft\\\\' -and $_.State -ne 'Disabled' } | Select-Object TaskName, TaskPath",
      syntaxBreakdown: "Lista todas las tareas programadas activas que no forman parte del sistema operativo Windows oficial.",
      whatToLookFor: "Nombres de tareas que incluyan 'CleanTask', 'WeeklyScan', 'UpdatePrompt' o 'TelemetrySender'.",
      technicalMetrics: "Las tareas programadas pueden dispararse por temporizadores de tiempo real o por eventos de red sin UI visible."
    },
    alertaEVO: {
      reversibilityRule: "La consulta con Get-ScheduledTask es pasiva.",
      safetyWarning: "Si encuentras una tarea sospechosa, puedes deshabilitarla con: Disable-ScheduledTask -TaskName 'Nombre'."
    },
    evidenceBadge: {
      code: "S35-TASK-09",
      label: "TASKS-EXPOSED"
    }
  },
  {
    id: "inv-35-10",
    code: "35.10",
    title: "Startup",
    subtitle: "La multiplicidad de puntos de inicio (ASEPs) que secuestran el boot",
    targetMechanism: "Auto-Start Extensibility Points (ASEPs)",
    targetComponent: "HKCU/HKLM Run Keys / Startup Folders / RunOnce",
    commandName: "Get-CimInstance Win32_StartupCommand",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué tras instalar un programa que prometía 'acelerar tu inicio', el tiempo de BIOS en el Administrador de Tareas aumentó 4 segundos?",
      mythVsTruth: {
        mentira: "El programa se inicia rápido y agiliza la carga de las demás aplicaciones.",
        verdad: "Inyecta helpers en los registros de inicio y compite por el ancho de banda del disco con el inicio de sesión del usuario.",
        comprobalo: "Abre la pestaña 'Inicio' en el Administrador de Tareas: verás que el optimizador tiene impacto 'Alto' en el arranque."
      }
    },
    entende: {
      queEs: "Cómo los programas utilitarios se incrustan en múltiples llaves del registro para garantizar que el usuario nunca pueda usarse la PC sin ellos.",
      paraQueSirve: "Auditar y limpiar los puntos de entrada de arranque sin necesidad de instalar otro programa más.",
      quePasaSiFalta: "Retraso notable en la aparición del escritorio y en la respuesta de los iconos de la barra de tareas tras ingresar contraseña."
    },
    interactua: {
      cliExample: "wmic startup get caption,command,location",
      psExample: "Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location | Format-Table -AutoSize",
      syntaxBreakdown: "Obtiene mediante WMI/CIM todas las aplicaciones que se inician automáticamente al arrancar la sesión.",
      whatToLookFor: "Rutas que apunten a ejecutables en carpetas como 'Program Files (x86)\\IObit' o 'CCleaner' o 'GlarySoft'.",
      technicalMetrics: "Cada aplicación adicional en Startup añade entre 300 ms y 1200 ms al tiempo de renderizado de la shell Explorer."
    },
    alertaEVO: {
      reversibilityRule: "wmic startup get es de solo lectura.",
      safetyWarning: "Deshabilita el inicio automático de cualquier optimizador directamente desde el Administrador de Tareas."
    },
    evidenceBadge: {
      code: "S35-BOOT-10",
      label: "STARTUP-CLEARED"
    }
  },
  {
    id: "inv-35-11",
    code: "35.11",
    title: "Drivers",
    subtitle: "Controladores de kernel de terceros para 'monitoreo' y su riesgo de BSOD",
    targetMechanism: "Kernel Filter Drivers & Device Driver Stacks",
    targetComponent: "system32\\drivers\\*.sys",
    commandName: "driverquery.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que muchos optimizadores instalan un driver de kernel (.sys) en System32\\drivers para poder forzar el cierre de procesos protegidos?",
      mythVsTruth: {
        mentira: "Los programas de optimización son aplicaciones normales que no tocan las capas bajas del sistema.",
        verdad: "Instalan drivers en Ring 0; si ese driver tiene una falla de memoria o un puntero nulo, provoca un pantallazo azul instantáneo.",
        comprobalo: "Ejecuta driverquery y busca nombres de archivo que pertenezcan a suites de utilitarios comerciales."
      }
    },
    entende: {
      queEs: "La presencia de módulos de código en modo kernel ejecutándose con el nivel más alto de privilegios que existe en la arquitectura x86/x64.",
      paraQueSirve: "Comprender la gravedad de instalar software de origen dudoso que carga binarios directamente en el espacio de memoria del kernel.",
      quePasaSiFalta: "Incompatibilidad con el aislamiento del núcleo (Memory Integrity / HVCI) de Windows 11 y vulnerabilidad a exploits de escalada de privilegios."
    },
    interactua: {
      cliExample: "driverquery /v /fo TABLE | findstr /i /v \"Microsoft\"",
      psExample: "Get-WmiObject Win32_SystemDriver | Where-Object { $_.Started -and $_.PathName -notmatch 'Windows\\\\System32\\\\drivers' } | Select-Object DisplayName, PathName",
      syntaxBreakdown: "Lista todos los drivers de kernel que se encuentran cargados actualmente y que no forman parte de la distribución base de Microsoft.",
      whatToLookFor: "Drivers con nombres asociados a desfragmentadores de terceros, aceleradores de RAM o herramientas de desinstalación agresivas.",
      technicalMetrics: "Un driver de terceros no certificado no pasa por los filtros de depuración de WHQL y puede colapsar el sistema sin previo aviso."
    },
    alertaEVO: {
      reversibilityRule: "driverquery es una herramienta informativa nativa.",
      safetyWarning: "Nunca elimines un archivo .sys de C:\\Windows\\System32\\drivers manualmente; primero debes desinstalar el software formalmente."
    },
    evidenceBadge: {
      code: "S35-KDRV-11",
      label: "KERNEL-DRV-SAFE"
    }
  },
  {
    id: "inv-35-12",
    code: "35.12",
    title: "Connections",
    subtitle: "Conexiones salientes continuas: La telemetría encubierta hacia servidores remotos",
    targetMechanism: "TCP Outbound Sockets & Analytics Telemetry Endpoints",
    targetComponent: "ws2_32.dll / WinINet",
    commandName: "netstat.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿A dónde se conecta un optimizador cuando no lo estás usando y tu PC supuestamente está en reposo?",
      mythVsTruth: {
        mentira: "El optimizador no usa internet a menos que busque una actualización manual.",
        verdad: "Mantiene sockets TCP abiertos hacia servidores de telemetría y publicidad enviando especificaciones de tu hardware y listas de software.",
        comprobalo: "Usa TCPView o netstat con el flag -b: verás conexiones constantes hacia IPs en la nube de proveedores publicitarios."
      }
    },
    entende: {
      queEs: "El tráfico de red generado por el componente de análisis y telemetría de estas herramientas comerciales.",
      paraQueSirve: "Verificar con evidencia empírica qué procesos están abriendo conexiones a espaldas del usuario.",
      quePasaSiFalta: "Fuga de privacidad de datos del equipo y consumo innecesario de recursos de red."
    },
    interactua: {
      cliExample: "netstat -b -n -o",
      psExample: "Get-NetTCPConnection | Where-Object { $_.State -eq 'Established' } | Select-Object LocalAddress, RemoteAddress, RemotePort, OwningProcess",
      syntaxBreakdown: "Muestra las conexiones TCP establecidas actualmente vinculando cada socket con el ID del proceso responsable.",
      whatToLookFor: "Procesos que pertenezcan a suites utilitarias conectándose a puertos 80 o 443 hacia destinos externos.",
      technicalMetrics: "Envío periódico de paquetes HTTP POST con identificadores únicos de instalación (GUID) para rastreo publicitario."
    },
    alertaEVO: {
      reversibilityRule: "netstat es una utilidad de diagnóstico pasiva.",
      safetyWarning: "Usa el Firewall de Windows para bloquear tráfico saliente si necesitas investigar un ejecutable sospechoso."
    },
    evidenceBadge: {
      code: "S35-CONN-12",
      label: "SOCKETS-MONITORED"
    }
  },
  {
    id: "inv-35-13",
    code: "35.13",
    title: "Registry footprint",
    subtitle: "La huella imborrable: Cientos de claves que ellos mismos dejan al instalarse",
    targetMechanism: "Registry Bloat & Persistent Configuration Keys",
    targetComponent: "HKLM\\SOFTWARE / HKCU\\SOFTWARE",
    commandName: "reg query",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "La mayor ironía técnica: ¿Sabías que un programa que dice 'limpiar el registro' añade más de 2.000 entradas de registro nuevas al instalarse?",
      mythVsTruth: {
        mentira: "El optimizador es liviano y no deja rastros en la base de datos de Windows.",
        verdad: "Inyecta claves en Software, clases COM, manejadores de menú contextual de Explorer y contadores de licencias comerciales.",
        comprobalo: "Cuenta las claves creadas por el software bajo HKLM\\SOFTWARE y HKCU\\SOFTWARE usando un script de PowerShell."
      }
    },
    entende: {
      queEs: "La huella que deja cualquier software complejo en las colmenas de configuración del sistema operativo.",
      paraQueSirve: "Demostrar que 'limpiar 50 claves' mientras el limpiador 'crea 2.000' es un sinsentido desde la perspectiva de la física del software.",
      quePasaSiFalta: "El registro se fragmenta con desinstalaciones incompletas y menús contextuales rotos."
    },
    interactua: {
      cliExample: "reg query \"HKLM\\SOFTWARE\" /k /f \"IObit\"",
      psExample: "Get-ChildItem -Path 'HKLM:\\SOFTWARE' -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'Optimizer|Booster|Cleaner' } | Measure-Object",
      syntaxBreakdown: "Realiza una búsqueda profunda en la rama HKLM de todas las claves asociadas a palabras clave de optimizadores.",
      whatToLookFor: "Cientos de claves huérfanas que persisten incluso después de usar el propio desinstalador del fabricante.",
      technicalMetrics: "Un optimizador típico añade entre 1.200 y 4.500 valores individuales en las colmenas del Registro."
    },
    alertaEVO: {
      reversibilityRule: "reg query es de lectura estricta.",
      safetyWarning: "No intentes purgar claves masivas con scripts automáticos si no estás seguro de la pertenencia del CLSID."
    },
    evidenceBadge: {
      code: "S35-FOOT-13",
      label: "REG-FOOTPRINT"
    }
  },
  {
    id: "inv-35-14",
    code: "35.14",
    title: "Antes vs después",
    subtitle: "El benchmark empírico: Más procesos, más latencia y menos estabilidad",
    targetMechanism: "System Telemetry Benchmark & Performance Delta Measurement",
    targetComponent: "Performance Monitor / LatencyMon / Task Manager",
    commandName: "wpr.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Si comparas una PC con optimizadores frente a la misma PC limpia con un cronómetro y un medidor de latencia DPC, ¿cuál es el resultado real?",
      mythVsTruth: {
        mentira: "La computadora con optimizadores rinde mejor en los tests sintéticos y juegos.",
        verdad: "Tiene mayor tiempo de arranque (+3 a +8 seg), mayor latencia DPC por drivers parásitos y de 5 a 12 procesos adicionales en reposo.",
        comprobalo: "Ejecuta LatencyMon antes y después de instalar una suite de boosters: la latencia de interrupción se dispara por los drivers de monitoreo."
      }
    },
    entende: {
      queEs: "El contraste empírico riguroso entre la promesa comercial del software y las métricas de ingeniería reales del sistema.",
      paraQueSirve: "Proporcionar al especialista en diagnóstico argumentos basados en mediciones científicas para convencer al usuario de desinstalarlos.",
      quePasaSiFalta: "El usuario continúa creyendo en placebos visuales mientras su hardware se degrada innecesariamente."
    },
    interactua: {
      cliExample: "systeminfo | findstr /i \"tiempo de arranque fabricante modelo\"",
      psExample: "$procCount = (Get-Process).Count; $svcCount = (Get-Service | Where-Object {$_.Status -eq 'Running'}).Count; [PSCustomObject]@{Procesos=$procCount; Servicios=$svcCount}",
      syntaxBreakdown: "Calcula en un solo comando el conteo total de procesos activos y servicios en ejecución para medir la sobrecarga operativa.",
      whatToLookFor: "Una instalación limpia de Windows 11 en reposo suele tener entre 140 y 180 procesos; con suites utilitarias sube por encima de 210.",
      technicalMetrics: "Cada proceso en reposo consume memoria no paginada en el kernel para su EPROCESS y KPROCESS structs."
    },
    alertaEVO: {
      reversibilityRule: "Métrica puramente consultiva.",
      safetyWarning: "Haz esta prueba ante clientes incrédulos: un benchmark real elimina cualquier argumento subjetivo."
    },
    evidenceBadge: {
      code: "S35-BENCH-14",
      label: "BENCHMARK-PROVEN"
    }
  },
  {
    id: "inv-35-15",
    code: "35.15",
    title: "Por qué algunos crean dependencia",
    subtitle: "La técnica de alterar servicios para que el sistema falle si los desinstalas",
    targetMechanism: "Service Dependency Injection & LSP / WFP Network Hooking",
    targetComponent: "Service Control Manager / Winsock LSP / WFP Filters",
    commandName: "netsh winsock show catalog",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué al desinstalar un optimizador de internet de repente te quedas sin conexión o Windows no abre el menú inicio?",
      mythVsTruth: {
        mentira: "La computadora se rompió porque ya no tiene el programa que la cuidaba.",
        verdad: "El programa modificó la cadena de Winsock o las dependencias de servicios; al quitar el binario, el socket queda roto en la nada.",
        comprobalo: "Examina el catálogo de Winsock con 'netsh winsock show catalog' y verás proveedores de servicios en capas (LSP) huérfanos que apuntan a DLLs inexistentes."
      }
    },
    entende: {
      queEs: "El secuestro de la arquitectura de red y dependencias que utilizan ciertos utilitarios para forzar al usuario a mantenerlos instalados.",
      paraQueSirve: "Saber diagnosticar y reparar de inmediato la pérdida de conectividad tras desinstalar software conflictivo.",
      quePasaSiFalta: "El usuario asustado vuelve a instalar el optimizador creyendo que es indispensable para que funcione su equipo."
    },
    interactua: {
      cliExample: "netsh winsock reset",
      psExample: "Get-ItemProperty HKLM:\\SYSTEM\\CurrentControlSet\\Services\\* | Where-Object { $_.DependOnService -match 'Booster|Care' } | Select-Object PSChildName",
      syntaxBreakdown: "Restaura el catálogo de Winsock al estado limpio por defecto de Windows y busca servicios con dependencias corruptas.",
      whatToLookFor: "Comprueba que desaparezcan los filtros de red huérfanos que bloqueaban el tráfico tras la desinstalación.",
      technicalMetrics: "Un Winsock corrupto devuelve errores WSAEPROVIDERFAILEDINIT (10106) en cualquier aplicación que intente crear un socket."
    },
    alertaEVO: {
      reversibilityRule: "netsh winsock reset requiere reiniciar el equipo para tener efecto pleno.",
      safetyWarning: "Si te quedas sin internet tras desinstalar un programa, netsh winsock reset es la solución de primer orden."
    },
    evidenceBadge: {
      code: "S35-DEP-15",
      label: "DEPENDENCY-CURED"
    }
  },
  {
    id: "inv-35-16",
    code: "35.16",
    title: "Cómo desinstalarlos correctamente",
    subtitle: "El protocolo pericial de purga profunda y restauración de defaults",
    targetMechanism: "Comprehensive Software Purge & Windows Default State Restoration",
    targetComponent: "appwiz.cpl / DISM / Registry Clean / Service Scavenging",
    commandName: "winget.exe",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "¿Alcanza con darle a 'Desinstalar' en el Panel de Control para librarte de un optimizador para siempre?",
      mythVsTruth: {
        mentira: "El desinstalador oficial quita el 100% de los archivos y configuraciones.",
        verdad: "Deja servicios huérfanos, tareas programadas de telemetría y configuraciones de registro que siguen activas en cada inicio.",
        comprobalo: "Revisa C:\\ProgramData y el Programador de Tareas tras desinstalar: encontrarás carpetas completas que sobrevivieron a la desinstalación."
      }
    },
    entende: {
      queEs: "El protocolo definitivo de cuatro pasos para erradicar cualquier software optimizador y devolver a Windows a su configuración óptima de fábrica.",
      paraQueSirve: "Devolver la fluidez, la estabilidad y la seguridad a un equipo contaminado por múltiples herramientas supuestamente aceleradoras.",
      quePasaSiFalta: "Persistencia de servicios fantasma que generan errores continuos en el Visor de Eventos."
    },
    interactua: {
      cliExample: "sc delete \"NombreServicioSospechoso\"",
      psExample: "Get-ScheduledTask | Where-Object { $_.TaskName -match 'Cleaner|Optimizer' } | Unregister-ScheduledTask -Confirm:$false",
      syntaxBreakdown: "Elimina de raíz los servicios y tareas que el desinstalador 'olvidó' borrar intencionalmente.",
      whatToLookFor: "Mensaje '[SC] DeleteService CORRECTO' y confirmación de que no quedan hilos huérfanos en memoria.",
      technicalMetrics: "Restaura la clave de registro de autotuning de red y el plan de energía balanceado estándar de Windows."
    },
    alertaEVO: {
      reversibilityRule: "sc delete es irreversible; asegúrate de apuntar exclusivamente al servicio del optimizador.",
      safetyWarning: "Reinicia el equipo inmediatamente después de completar el protocolo para consolidar la limpieza del kernel."
    },
    evidenceBadge: {
      code: "S35-PURGE-16",
      label: "TOTAL-PURGED"
    }
  }
];

export const SECTOR_35_MINICASES: Sector35MiniCase[] = [
  {
    id: "case-35-01",
    code: "MC-35.01",
    title: "La laptop que se congela cada vez que 'limpia' la RAM",
    scenario: "Un diseñador gráfico instaló un 'Super RAM Cleaner 2024' en su laptop de 16 GB. Cada vez que abre Photoshop, el optimizador detecta que la RAM supera el 85% y fuerza automáticamente la limpieza. En ese segundo, el cursor se congela y Photoshop tarda 15 segundos en responder al siguiente trazo de pincel.",
    userStatement: "El programa funciona porque la memoria baja al 25%, pero mi laptop se traba horriblemente. ¿Será que mi disco SSD está roto?",
    initialMistake: "Creer que bajar el porcentaje de RAM es positivo y no darse cuenta de que la llamada EmptyWorkingSet expulsa el cache de Photoshop al disco.",
    diagnosticQuestion: "¿Cuál es el diagnóstico pericial exacto y qué acción debe tomarse?",
    options: [
      {
        id: "opt-1",
        text: "Aumentar la frecuencia de limpieza a cada 60 segundos para evitar que la memoria vuelva a subir.",
        isCorrect: false,
        explanation: "Eso destruiría el rendimiento por completo, manteniendo el SSD saturado al 100% en un bucle infinito de paginación."
      },
      {
        id: "opt-2",
        text: "Desinstalar el limpiador de RAM: Windows gestiona la memoria de forma óptima; Photoshop necesita esos datos en RAM y expulsarlos genera 'hard page faults' masivos.",
        isCorrect: true,
        explanation: "La RAM libre no aporta velocidad. Al vaciar el Working Set, Windows debe releer gigabytes de datos desde el pagefile, causando congelamientos severos."
      },
      {
        id: "opt-3",
        text: "Comprar un SSD más veloz para que la limpieza de RAM no se sienta tan lenta.",
        isCorrect: false,
        explanation: "Incluso en un SSD Gen4 NVMe, la lectura de almacenamiento es órdenes de magnitud más lenta que la latencia en nanosegundos de la memoria RAM DDR4/DDR5."
      }
    ],
    technicalVerdict: "El optimizador provocaba 'Pagefile Thrashing' al forzar el vaciado del Working Set. La latencia de respuesta pasó de microsegundos a segundos.",
    lessonLearned: "En Windows moderno, 'RAM libre es RAM desperdiciada'. El Memory Manager de Windows sabe cómo gestionar el Working Set y el Standby Cache sin interferencias."
  },
  {
    id: "case-35-02",
    code: "MC-35.02",
    title: "Sin internet tras 'limpiar y reparar' con un optimizador",
    scenario: "Un usuario ejecutó un 'Speed Internet Booster'. El programa prometía reducir el ping en juegos modificando la pila TCP/IP. Al reiniciar la PC, la red muestra el icono de 'Sin acceso a internet', aunque el router y los demás dispositivos de la casa funcionan perfectamente.",
    userStatement: "El optimizador me dijo que mi red estaba infectada, le di a 'Reparar' y ahora no puedo entrar a ninguna página.",
    initialMistake: "Asumir que el adaptador de red de hardware se quemó y comprar una placa Wi-Fi USB nueva.",
    diagnosticQuestion: "¿Qué alteró el programa en el sistema operativo y cómo se recupera en 30 segundos?",
    options: [
      {
        id: "opt-1",
        text: "El programa deshabilitó el servicio DHCP y corrompió el catálogo de Winsock y el autotuning de TCP. Se recupera con 'netsh winsock reset' y 'netsh int tcp set global autotuninglevel=normal'.",
        isCorrect: true,
        explanation: "Los boosters de internet tocan parámetros arcaicos de Winsock y RWIN. El reseteo oficial de la pila TCP/IP de Windows devuelve los valores a su configuración óptima nativa."
      },
      {
        id: "opt-2",
        text: "Hay que reinstalar Windows desde cero porque los registros de TCP son imposibles de reparar una vez modificados.",
        isCorrect: false,
        explanation: "Windows dispone de comandos integrados nativos en netsh y PowerShell para reiniciar la pila de red en segundos."
      },
      {
        id: "opt-3",
        text: "Asignar una dirección IP fija manual con DNS 8.8.8.8 para saltarse los protocolos del sistema.",
        isCorrect: false,
        explanation: "Si el catálogo de Winsock (LSP) está dañado o desvinculado, las aplicaciones no pueden abrir sockets sin importar qué IP estática pongas."
      }
    ],
    technicalVerdict: "El optimizador inyectó un filtro de capa Winsock que apuntaba a una DLL inexistente y fijó el autotuning en disabled.",
    lessonLearned: "Nunca permitir que un software de terceros modifique parámetros del protocolo TCP/IP de Windows. La pila nativa gestiona dinámicamente la ventana de congestión."
  },
  {
    id: "case-35-03",
    code: "MC-35.03",
    title: "El bucle de miedo de los 3.000 errores de registro",
    scenario: "Una clienta mayor asustada lleva su computadora a un taller porque un programa llamado 'PC Total Defender Speed' le avisa con letras rojas parpadeantes que tiene '3.214 errores críticos que están a punto de romper su disco duro'. La clienta está dispuesta a pagar 60 dólares por la licencia.",
    userStatement: "Por favor ayúdeme, mi computadora tiene miles de errores graves y tengo miedo de perder mis fotos de familia.",
    initialMistake: "Pagar la licencia del software creyendo que los 'errores' amenazan la integridad de sus archivos personales.",
    diagnosticQuestion: "¿Qué análisis pericial demuestra la falsedad del reclamo y qué se debe hacer?",
    options: [
      {
        id: "opt-1",
        text: "Pagar la licencia porque 3.200 errores son demasiados y el programa tiene que repararlos.",
        isCorrect: false,
        explanation: "Pagar valida un modelo de scareware y añade cobros automáticos recurrentes en la tarjeta de crédito del usuario."
      },
      {
        id: "opt-2",
        text: "Demostrar que los 'errores' son claves vacías de aplicaciones desinstaladas hace meses que no consumen recursos, desinstalar el scareware y educar a la clienta.",
        isCorrect: true,
        explanation: "Un informe empírico demuestra que las claves de registro no son errores de hardware ni ponen en peligro los archivos. Eliminar el programa devuelve la tranquilidad sin costo."
      },
      {
        id: "opt-3",
        text: "Instalar otro limpiador de registro diferente para comparar cuántos errores encuentra el segundo programa.",
        isCorrect: false,
        explanation: "El segundo programa encontrará otra cifra arbitraria para vender su propia licencia comercial, generando mayor confusión."
      }
    ],
    technicalVerdict: "El software utilizaba heurísticas fraudulentas de scareware, contabilizando elementos irrelevantes de la caché MRU como amenazas críticas de hardware.",
    lessonLearned: "El rol de un técnico profesional no es solo desinfectar sistemas, sino proteger a los usuarios de la manipulación psicológica comercial de la industria del fearware."
  }
];

export const SECTOR_35_TEST_BANK: Sector35TestQuestion[] = [
  {
    id: "test-35-01",
    questionNumber: 1,
    category: "Gestión de Memoria",
    question: "¿Qué llamada interna de la API de Windows invocan los supuestos 'optimizadores de RAM' para forzar que el uso baje visualmente en el Administrador de Tareas?",
    options: [
      { id: "a", text: "NtAllocateVirtualMemory" },
      { id: "b", text: "EmptyWorkingSet (o K32EmptyWorkingSet)" },
      { id: "c", text: "VirtualProtectEx" },
      { id: "d", text: "SetProcessAffinityMask" }
    ],
    correctOptionId: "b",
    technicalExplanation: "EmptyWorkingSet fuerza al Memory Manager a quitar la mayor cantidad posible de páginas del working set del proceso, volcándolas al archivo de paginación (pagefile) en disco, lo que causa severo 'thrashing' cuando la app vuelve a necesitar esos datos."
  },
  {
    id: "test-35-02",
    questionNumber: 2,
    category: "Estructura del Registro",
    question: "¿Por qué tener miles de claves huérfanas en el Registro de Windows no produce una ralentización medible en el rendimiento del equipo?",
    options: [
      { id: "a", text: "Porque Windows guarda el registro en los chips de la tarjeta de video." },
      { id: "b", text: "Porque las colmenas del registro se indexan en memoria como árboles B con búsquedas binarias directas por hash O(1) u O(log N)." },
      { id: "c", text: "Porque el registro se borra y se reconstruye desde cero en cada apagado de la computadora." },
      { id: "d", text: "Porque Windows solo permite un máximo de 100 claves registradas en total." }
    ],
    correctOptionId: "b",
    technicalExplanation: "El kernel de Windows no lee secuencialmente el registro línea por línea. Las lecturas son consultas por hash sobre celdas indexadas en memoria RAM mapeada. Si una clave huérfana no es consultada por nadie, su costo de CPU es estrictamente cero."
  },
  {
    id: "test-35-03",
    questionNumber: 3,
    category: "Pila de Red TCP/IP",
    question: "¿Qué ocurre cuando un 'Internet Booster' desactiva el algoritmo de Receive Window Auto-Tuning en una conexión moderna de banda ancha?",
    options: [
      { id: "a", text: "El ping disminuye a exactamente 0 ms." },
      { id: "b", text: "El ancho de banda se limita a un búfer estático fijo minúsculo, reduciendo drásticamente la velocidad máxima en conexiones de alta velocidad." },
      { id: "c", text: "La conexión cambia automáticamente de IPv4 a IPv6." },
      { id: "d", text: "El router doméstico reinicia su firmware por sobrecalentamiento." }
    ],
    correctOptionId: "b",
    technicalExplanation: "El autotuning escala dinámicamente la ventana de recepción TCP según la latencia y capacidad del enlace. Al desactivarlo, se fija en 64 KB estándar, haciendo matemáticamente imposible alcanzar velocidades superiores a 20-30 Mbps en enlaces de alto RTT."
  },
  {
    id: "test-35-04",
    questionNumber: 4,
    category: "Arquitectura de Controladores",
    question: "¿Por qué los actualizadores automáticos de controladores ('Driver Boosters') representan uno de los mayores peligros para la estabilidad del sistema operativo?",
    options: [
      { id: "a", text: "Porque instalan controladores en Ring 0 basándose en coincidencias de Hardware ID aproximadas sin validación WHQL del fabricante de la placa." },
      { id: "b", text: "Porque convierten los discos de NTFS a FAT32 de forma irreversible." },
      { id: "c", text: "Porque deshabilitan la fuente de alimentación de la computadora por software." },
      { id: "d", text: "Porque limitan la resolución del monitor a 640x480 píxeles obligatoriamente." }
    ],
    correctOptionId: "a",
    technicalExplanation: "Un controlador opera en modo kernel (Ring 0) con acceso irrestricto al hardware. Si un actualizador instala un binario genérico o beta incompatible, cualquier excepción no controlada provocará de inmediato un Kernel Panic / BSOD (como KMODE_EXCEPTION_NOT_HANDLED o SYSTEM_SERVICE_EXCEPTION)."
  },
  {
    id: "test-35-05",
    questionNumber: 5,
    category: "Huella Operativa",
    question: "¿Cuál es la consecuencia típica demostrada en benchmarks tras instalar una suite completa de optimizadores comerciales en Windows?",
    options: [
      { id: "a", text: "El sistema consume menos energía y reduce a la mitad sus procesos en reposo." },
      { id: "b", text: "El equipo aumenta entre 5 y 12 procesos adicionales permanentes, eleva la latencia DPC y prolonga el tiempo de arranque." },
      { id: "c", text: "La tarjeta gráfica aumenta su memoria VRAM de 8 GB a 16 GB por software." },
      { id: "d", text: "Se duplican los núcleos físicos de la CPU en el Administrador de Tareas." }
    ],
    correctOptionId: "b",
    technicalExplanation: "Los optimizadores instalan servicios de monitoreo continuo, tareas programadas de telemetría y drivers de kernel, añadiendo sobrecarga parasitaria permanente que compite con las aplicaciones legítimas del usuario."
  }
];
