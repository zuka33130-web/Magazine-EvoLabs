// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 23: LO QUE WINDOWS HACE CUANDO NO ESTÁS
// "Lo que Windows hace cuando no estás mirando"

export type RiskLevelSector23 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector23Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector23;
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

export interface Sector23MiniCase {
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

export interface Sector23TestQuestion {
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

export const SECTOR_23_INVESTIGATIONS: Sector23Investigation[] = [
  {
    id: "inv-23-01",
    code: "23.01",
    title: "Windows Update",
    subtitle: "Mantenimiento y orquestación de parches durante períodos de inactividad",
    targetMechanism: "USOService & USOClient Orchestrator",
    targetComponent: "wuaueng.dll / USOClient.exe",
    commandName: "Get-Service wuauserv | Select-Object Status, StartType",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Dejaste la PC encendida mientras tomabas un café y al volver los ventiladores estaban al máximo. Windows Update aprovechó la inactividad para descargar, instalar o preparar parches del sistema.",
      mythVsTruth: {
        mentira: "Windows Update solo busca actualizaciones cuando presiono 'Buscar actualizaciones' manualmente.",
        verdad: "USO (Update Service Orchestrator) programa escaneos automáticos en idle usando el Task Scheduler y el servicio wuauserv.",
        comprobalo: "Ejecutá 'Get-ScheduledTask -TaskPath \\Microsoft\\Windows\\UpdateOrchestrator\\' en PowerShell para ver las tareas programadas activas."
      }
    },
    entende: {
      queEs: "El subsistema de orquestación de parches de Windows que monitorea los temporizadores de inactividad (Idle Timers) para aplicar parches sin interrumpir al usuario.",
      paraQueSirve: "Asegura la aplicación de parches de seguridad críticos y acumulativos reduciendo el impacto en el rendimiento mientras el usuario trabaja.",
      quePasaSiFalta: "Desactivar completamente el orquestador deja el sistema vulnerable a exploits conocidos y acumulaciones de parches fallidos."
    },
    interactua: {
      cliExample: "usoclient StartScan",
      psExample: "Get-ScheduledTask -TaskPath \"\\Microsoft\\Windows\\UpdateOrchestrator\\\" | Select-Object TaskName, State",
      syntaxBreakdown: "Get-ScheduledTask consulta el Programador de Tareas buscando el catálogo de orquestación de Windows Update en UpdateOrchestrator.",
      whatToLookFor: "Buscar la tarea 'Schedule Scan' y comprobar su estado (Ready, Running o Disabled).",
      technicalMetrics: "Impacto en idle: CPU 15-40%, I/O de disco continuo durante la descompresión del paquete de parches."
    },
    alertaEVO: {
      reversibilityRule: "Las tareas del UpdateOrchestrator se pueden pausar o reprogramar mediante Horas Activas (Active Hours) en la Configuración de Windows.",
      safetyWarning: "No elimines las tareas del UpdateOrchestrator en el Registro de Windows; esto provocará errores de integridad en Windows Update."
    },
    evidenceBadge: {
      code: "IDLE-UPD-01",
      label: "Update Orchestrator Idle Sweep"
    }
  },
  {
    id: "inv-23-02",
    code: "23.02",
    title: "Defender scans",
    subtitle: "Análisis antivirus programados de bajo impacto en estado de reposo",
    targetMechanism: "Windows Defender Scheduled Scan Task",
    targetComponent: "MsMpEng.exe / MpCmdRun.exe",
    commandName: "Get-MpPreference | Select-Object -ExpandProperty ScanScheduleTime",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "MsMpEng.exe consume un hilo completo de CPU apenas dejas de mover el mouse. Defender detecta el evento de inactividad del sistema para realizar escaneos rápidos de firmas.",
      mythVsTruth: {
        mentira: "Defender escanea todo el disco constantemente sin importar si estoy jugando o editando video.",
        verdad: "El motor de Microsoft Defender (Antimalware Service Executable) utiliza triggers de inactividad y suspende los análisis completos si se detecta interacción del usuario.",
        comprobalo: "Abre el Administrador de Tareas en la pestaña Detalles y observa MsMpEng.exe al volver de 10 minutos de inactividad."
      }
    },
    entende: {
      queEs: "Un motor heurístico y de firmas que ejecuta tareas de mantenimiento en segundo plano cuando la CPU y el disco están en estado Idle.",
      paraQueSirve: "Verifica la integridad de archivos de sistema y descargas recientes sin afectar la latencia durante la jornada de trabajo.",
      quePasaSiFalta: "Si se deshabilita el escaneo en idle, las amenazas latentes en disco solo se detectarán al ser ejecutadas por primera vez."
    },
    interactua: {
      cliExample: "\"C:\\Program Files\\Windows Defender\\MpCmdRun.exe\" -Scan -ScanType 1",
      psExample: "Get-ScheduledTask -TaskPath \"\\Microsoft\\Windows\\Windows Defender\\\" | Select-Object TaskName, State",
      syntaxBreakdown: "Accede a las tareas internas del contenedor Windows Defender para revisar 'Windows Defender Scheduled Scan'.",
      whatToLookFor: "Verificar si la tarea 'Windows Defender Scheduled Scan' tiene activada la condición 'Start the task only if the computer is idle'.",
      technicalMetrics: "Uso de RAM: ~250MB - 500MB en MsMpEng.exe; Lectura de disco: hasta 120 MB/s en SSD."
    },
    alertaEVO: {
      reversibilityRule: "Se puede ajustar la cuota máxima de CPU asignada a Defender mediante Set-MpPreference -ScanAvgCPULoadFactor 25.",
      safetyWarning: "Nunca desactives el servicio WinDefend permanentemente salvo que poseas otra solución Endpoint EDR activa."
    },
    evidenceBadge: {
      code: "IDLE-DEF-02",
      label: "Defender Idle Maintenance"
    }
  },
  {
    id: "inv-23-03",
    code: "23.03",
    title: "Search indexing",
    subtitle: "Indización progresiva del catálogo de archivos de usuario",
    targetMechanism: "Windows Search Service",
    targetComponent: "SearchIndexer.exe",
    commandName: "Get-Service WSearch",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "SearchIndexer.exe reconstruye su catálogo en segundo plano mientras no estás interactuando con el teclado o la pantalla.",
      mythVsTruth: {
        mentira: "El buscador de Windows lee todos los archivos del disco en tiempo real cada vez que escribes en la barra de búsqueda.",
        verdad: "Windows crea una base de datos indexada (EDB) en segundo plano cuando el equipo ingresa en estado idle.",
        comprobalo: "Abre Opciones de Indización en el Panel de Control y observa cómo cambia de 'Indexación en pausa' a 'Indexando...' al dejar el equipo en reposo."
      }
    },
    entende: {
      queEs: "Un servicio que construye un índice de archivos, metadatos y contenido de documentos para responder a búsquedas instantáneas.",
      paraQueSirve: "Acelera las búsquedas en el Menú Inicio y en el Explorador de Archivos sin consumir ciclos de CPU durante el trabajo activo.",
      quePasaSiFalta: "Búsquedas en el sistema extremadamente lentas que deben escanear el sistema de archivos completo directo desde el almacenamiento."
    },
    interactua: {
      cliExample: "net start WSearch",
      psExample: "Get-Process SearchIndexer | Select-Object Id, CPU, WorkingSet64",
      syntaxBreakdown: "Obtiene información del proceso del indexador para analizar el consumo de memoria física y tiempo acumulado de CPU.",
      whatToLookFor: "Comprobar si el proceso consume I/O de disco durante minutos de inactividad prolongada.",
      technicalMetrics: "Base de datos Windows.edb en C:\\ProgramData\\Microsoft\\Search\\Data\\Applications\\Windows; tamaño típico: 2GB - 15GB."
    },
    alertaEVO: {
      reversibilityRule: "Se puede pausar la indización durante 15 minutos o limitar las carpetas indexadas desde la interfaz GUI.",
      safetyWarning: "Eliminar el archivo Windows.edb forzará una re-indexación completa de horas que consumirá almacenamiento y CPU."
    },
    evidenceBadge: {
      code: "IDLE-IDX-03",
      label: "Search Indexer Idle Catalog"
    }
  },
  {
    id: "inv-23-04",
    code: "23.04",
    title: "Maintenance",
    subtitle: "Mantenimiento automático programado de Windows (Automatic Maintenance)",
    targetMechanism: "Task Scheduler Automatic Maintenance Task",
    targetComponent: "rundll32.exe / ProcessIdleTasks",
    commandName: "MSFT_ScheduledTask en el namespace Root\\Microsoft\\Windows\\TaskScheduler",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "A las 02:00 AM (o cuando el equipo lleve 10 minutos sin uso), Windows ejecuta el 'Mantenimiento Automático' para desfragmentar registros, diagnosticar disco y limpiar temporales.",
      mythVsTruth: {
        mentira: "El Mantenimiento Automático solo limpia la papelera de reciclaje.",
        verdad: "Es un disparador maestro que invoca optimización de memoria, diagnósticos de rendimiento, actualización de firmas y desfragmentación de bases de datos internas.",
        comprobalo: "Ejecutá 'rundll32.exe advapi32.dll,ProcessIdleTasks' desde un símbolo de sistema como Administrador para forzar las tareas de mantenimiento."
      }
    },
    entende: {
      queEs: "Un marco de orquestación en el kernel y Task Scheduler que agrupa tareas de mantenimiento del sistema para ejecutarlas simultáneamente en inactividad.",
      paraQueSirve: "Evita la degradación paulatina del sistema operativo limpiando estados inconsistentes sin ralentizar la interacción diaria.",
      quePasaSiFalta: "Acumulación de logs huérfanos, fragmentación del registro y degradación paulatina del rendimiento de boot."
    },
    interactua: {
      cliExample: "rundll32.exe advapi32.dll,ProcessIdleTasks",
      psExample: "Get-ScheduledTask -TaskName \"Automatic Maintenance\" | Get-ScheduledTaskInfo",
      syntaxBreakdown: "Get-ScheduledTaskInfo devuelve la fecha y hora de la última ejecución así como el código de resultado (LastTaskResult).",
      whatToLookFor: "Última fecha de ejecución y si el estado es 'Ready' o 'Running'.",
      technicalMetrics: "Duración promedio del mantenimiento: 10 a 30 minutos según el estado del almacenamiento."
    },
    alertaEVO: {
      reversibilityRule: "Se puede cambiar la hora de mantenimiento automático desde Seguridad y Mantenimiento en el Panel de Control.",
      safetyWarning: "Forzar ProcessIdleTasks en sistemas con discos HDD lentos mientras se realizan tareas pesadas causará congelamientos temporales de I/O."
    },
    evidenceBadge: {
      code: "IDLE-MNT-04",
      label: "Automatic Maintenance Trigger"
    }
  },
  {
    id: "inv-23-05",
    code: "23.05",
    title: "Scheduled Tasks",
    subtitle: "Auditoría de tareas ocultas que despiertan en disparadores Idle",
    targetMechanism: "Task Scheduler Engine (taskschd.msc)",
    targetComponent: "taskeng.exe / svchost.exe (netsvcs)",
    commandName: "schtasks /query /fo LIST /v",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Decenas de aplicaciones de terceros (y componentes del OS) configuran disparadores del tipo 'On Idle' en el Programador de Tareas sin avisar al usuario.",
      mythVsTruth: {
        mentira: "Las tareas programadas solo se activan a horas específicas fijas del reloj.",
        verdad: "Existen múltiples tipos de triggers, incluyendo 'On Idle', 'On Workstation Lock' y 'On Event'.",
        comprobalo: "Abre taskschd.msc y filtra la columna de Triggers buscando la condición 'When computer is idle'."
      }
    },
    entende: {
      queEs: "El motor de automatización nativo de Windows donde aplicaciones y el sistema registran tareas para su ejecución en segundo plano.",
      paraQueSirve: "Permite diferir cargas de trabajo pesadas a momentos en los que el usuario no requiere interactividad ni capacidad de respuesta inmediata.",
      quePasaSiFalta: "Si el servicio de tareas programadas se detiene, el Mantenimiento, Windows Update y tareas de fondo críticas dejan de funcionar."
    },
    interactua: {
      cliExample: "schtasks /query /tn \"\\Microsoft\\Windows\\Diagnosis\\RecommendedTroubleshootingScanner\" /v",
      psExample: "Get-ScheduledTask | Where-Object { $_.Settings.IdleSettings.StopOnIdleEnd -eq $true } | Select-Object TaskName, TaskPath",
      syntaxBreakdown: "Filtra en PowerShell las tareas registradas cuyas propiedades de IdleSettings están configuradas para detenerse cuando el usuario regresa.",
      whatToLookFor: "Identificar tareas de software de terceros que utilicen recursos excesivos en reposo.",
      technicalMetrics: "Existen más de 120 tareas nativas de Windows configuradas por defecto en la instalación limpia."
    },
    alertaEVO: {
      reversibilityRule: "Toda tarea desactivada mediante Disable-ScheduledTask se puede reactivar con Enable-ScheduledTask.",
      safetyWarning: "No desactives tareas en \\Microsoft\\Windows\\SystemRestore o \\Microsoft\\Windows\\Servicing."
    },
    evidenceBadge: {
      code: "IDLE-TSK-05",
      label: "Scheduled Task Idle Audit"
    }
  },
  {
    id: "inv-23-06",
    code: "23.06",
    title: "Telemetry",
    subtitle: "Procesamiento diferido de telemetría y diagnóstico acumulado",
    targetMechanism: "Connected User Experiences and Telemetry (DiagTrack)",
    targetComponent: "utc.dll / CompatTelRunner.exe",
    commandName: "Get-Service DiagTrack",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "CompatTelRunner.exe se ejecuta durante la inactividad para escanear componentes de hardware y software con el fin de enviar reportes de compatibilidad a Microsoft.",
      mythVsTruth: {
        mentira: "La telemetría de Windows transmite datos en tiempo real de forma ininterrumpida.",
        verdad: "Windows acumula registros de eventos y diagnósticos en búferes locales y los procesa en lotes (batching) durante eventos de inactividad.",
        comprobalo: "Monitorea la ejecución de CompatTelRunner.exe en el Administrador de Tareas tras dejar la PC en reposo."
      }
    },
    entende: {
      queEs: "Un subsistema de recolección de métricas del sistema que analiza la estabilidad de los controladores y aplicaciones en el equipo.",
      paraQueSirve: "Ayuda a Microsoft a detectar cierres inesperados de aplicaciones (crashes), incompatibilidades de drivers y bloqueos del kernel.",
      quePasaSiFalta: "Si se deshabilita, Windows no notificará automáticamente sobre correcciones de errores específicas para tu configuración de hardware."
    },
    interactua: {
      cliExample: "sc query DiagTrack",
      psExample: "Get-ScheduledTask -TaskPath \"\\Microsoft\\Windows\\Application Experience\\\" | Select-Object TaskName, State",
      syntaxBreakdown: "Muestra las tareas 'Microsoft Compatibility Appraiser' y 'ProgramDataUpdater' encargadas de procesar la telemetría acumulada.",
      whatToLookFor: "Verificar si la tarea 'Microsoft Compatibility Appraiser' está ejecutándose.",
      technicalMetrics: "Procesamiento en lote: consume entre 10% y 25% de uso de CPU en procesadores de 4 núcleos durante 2-5 minutos."
    },
    alertaEVO: {
      reversibilityRule: "El nivel de telemetría se puede configurar en 'Requerido' (Básico) desde la Configuración de Privacidad de Windows.",
      safetyWarning: "La deshabilitación forzada por scripts agresivos puede romper la capacidad de recibir parches de seguridad a través de Windows Update."
    },
    evidenceBadge: {
      code: "IDLE-TEL-06",
      label: "Telemetry Batching Sweep"
    }
  },
  {
    id: "inv-23-07",
    code: "23.07",
    title: "OneDrive",
    subtitle: "Sincronización silenciosa de archivos y sincronización de metadatos",
    targetMechanism: "OneDrive Standalone Sync Engine",
    targetComponent: "OneDrive.exe / FileSyncShell.dll",
    commandName: "Get-Process OneDrive",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Aunque no estés guardando ningún documento, OneDrive escanea en reposo los cambios en la carpeta de usuario y sincroniza metadatos con la nube.",
      mythVsTruth: {
        mentira: "OneDrive solo consume red cuando abro un archivo guardado en la nube.",
        verdad: "OneDrive mantiene un hook en el File System (USN Journal) y verifica hashes de archivos cuando el sistema detecta inactividad.",
        comprobalo: "Observa en el Monitor de Recursos la pestaña Red para ver las conexiones activas de OneDrive.exe hacia servidores de Microsoft."
      }
    },
    entende: {
      queEs: "El servicio de almacenamiento en la nube integrado en Windows que sincroniza cambios locales con los servidores de Microsoft 365.",
      paraQueSirve: "Garantiza la disponibilidad de respaldos actualizados y evita conflictos de versiones al editar archivos entre múltiples dispositivos.",
      quePasaSiFalta: "Si se desactiva, los archivos marcados como 'Bajo Demanda' no estarán disponibles sin acceso explícito del usuario."
    },
    interactua: {
      cliExample: "tasklist /FI \"IMAGENAME eq OneDrive.exe\"",
      psExample: "Get-Process OneDrive | Select-Object Id, CPU, WorkingSet64, Path",
      syntaxBreakdown: "Devuelve detalles sobre la ubicación de OneDrive.exe y el consumo actual de recursos de memoria en segundo plano.",
      whatToLookFor: "Comprobar si el proceso mantiene lecturas constantes en disco durante el reposo.",
      technicalMetrics: "Uso de memoria RAM típico: 100MB - 350MB en estado residente."
    },
    alertaEVO: {
      reversibilityRule: "Se puede pausar la sincronización de OneDrive por 2, 8 o 24 horas directamente desde el icono en la bandeja del sistema.",
      safetyWarning: "Cerrar abruptamente el proceso mientras sincroniza puede dejar archivos temporales '.tmp' en el directorio de usuario."
    },
    evidenceBadge: {
      code: "IDLE-OD-07",
      label: "OneDrive Sync Engine"
    }
  },
  {
    id: "inv-23-08",
    code: "23.08",
    title: "Store updates",
    subtitle: "Actualización automática de aplicaciones UWP en segundo plano",
    targetMechanism: "Microsoft Store Install Service (InstallService)",
    targetComponent: "wsappx / WinStore.App.exe",
    commandName: "Get-Service InstallService",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "El proceso 'wsappx' o 'InstallService' incrementa el uso de disco y CPU en inactividad para descargar parches de aplicaciones como la Calculadora, Fotos o Bloc de Notas.",
      mythVsTruth: {
        mentira: "Las aplicaciones del sistema como la Calculadora o Fotos nunca se actualizan a menos que abra la Microsoft Store.",
        verdad: "Windows Store actualiza automáticamente las dependencias y paquetes AppX/MSIX en períodos de inactividad.",
        comprobalo: "En la Microsoft Store, ve a Configuración y revisa la opción 'Actualizaciones de aplicaciones'."
      }
    },
    entende: {
      queEs: "El subsistema de empaquetado e instalación de aplicaciones modernas UWP/MSIX que gestiona la tienda nativa de Windows.",
      paraQueSirve: "Mantiene las aplicaciones nativas corregidas ante vulnerabilidades de seguridad y fallos de código sin requerir reinicios del sistema.",
      quePasaSiFalta: "Las aplicaciones integradas quedarán desactualizadas y podrían perder compatibilidad con futuras versiones de Windows."
    },
    interactua: {
      cliExample: "sc query InstallService",
      psExample: "Get-AppxPackage | Select-Object Name, Version, Architecture",
      syntaxBreakdown: "Get-AppxPackage enumera todos los paquetes UWP instalados en la cuenta de usuario actual.",
      whatToLookFor: "Revisar la fecha de modificación de las carpetas en C:\\Program Files\\WindowsApps.",
      technicalMetrics: "Impacto en I/O de disco durante la descompresión e instalación de paquetes MSIX."
    },
    alertaEVO: {
      reversibilityRule: "Las actualizaciones automáticas de la tienda se pueden apagar desde los ajustes internos de la Microsoft Store.",
      safetyWarning: "No intentes tomar propiedad de la carpeta WindowsApps para borrar archivos manualmente; esto corromperá el registro de AppX."
    },
    evidenceBadge: {
      code: "IDLE-STR-08",
      label: "Store AppX Auto-Updater"
    }
  },
  {
    id: "inv-23-09",
    code: "23.09",
    title: "TRIM",
    subtitle: "Optimización y mantenimiento del almacenamiento en estado sólido (SSD)",
    targetMechanism: "Defrag and Drive Optimization Service",
    targetComponent: "dfrgui.exe / defrag.exe",
    commandName: "fsutil behavior query DisableDeleteNotify",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "En un SSD, Windows no realiza una desfragmentación tradicional de platos magnéticos, sino que envía comandos TRIM a la controladora para liberar bloques de memoria NAND invalidados.",
      mythVsTruth: {
        mentira: "Windows desfragmenta los SSD igual que los discos duros mecánicos y arruina su vida útil.",
        verdad: "Windows detecta el tipo de medio (SSD vs HDD) y ejecuta TRIM en SSDs, reservando la desfragmentación ligera solo para metadatos NTFS dañados.",
        comprobalo: "Ejecutá 'fsutil behavior query DisableDeleteNotify' en CMD como Admin. Si devuelve 0, TRIM está activo y funcionando."
      }
    },
    entende: {
      queEs: "Una orden enviada por el sistema operativo al controlador del SSD que informa qué bloques de datos ya no están en uso y se pueden borrar internamente.",
      paraQueSirve: "Previene la degradación de velocidad de escritura en SSDs y prolonga la vida útil del almacenamiento en estado sólido.",
      quePasaSiFalta: "Caída severa de la velocidad de escritura aleatoria en el SSD al quedarse la controladora sin bloques limpios para escribir."
    },
    interactua: {
      cliExample: "defrag C: /O",
      psExample: "Optimize-Volume -DriveLetter C -ReTrim -Verbose",
      syntaxBreakdown: "Optimize-Volume invoca el comando TRIM explícito sobre la partición C informando el avance por consola.",
      whatToLookFor: "Verificar el mensaje 'Retrim: 100% completado'.",
      technicalMetrics: "Ejecución veloz (2-10 segundos en SSDs NVMe); uso nulo de CPU posterior."
    },
    alertaEVO: {
      reversibilityRule: "TRIM es una función transparente controlada por el driver del controlador de almacenamiento (AHCI/NVMe).",
      safetyWarning: "Desactivar DisableDeleteNotify mediante fsutil provocará la pérdida paulatina de rendimiento de tu SSD."
    },
    evidenceBadge: {
      code: "IDLE-TRM-09",
      label: "SSD TRIM Idle Maintenance"
    }
  },
  {
    id: "inv-23-10",
    code: "23.10",
    title: "Restore points",
    subtitle: "Creación de instantáneas del sistema a través de Volume Shadow Copy",
    targetMechanism: "Volume Shadow Copy Service (VSS) & System Restore",
    targetComponent: "vssvc.exe / srTasks.exe",
    commandName: "vssadmin list shadows",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Previo a instalaciones de drivers o actualizaciones en idle, el servicio VSS crea una instantánea de bloques del volumen para permitir la reversión del sistema.",
      mythVsTruth: {
        mentira: "Los puntos de restauración realizan una copia completa duplicando todos mis archivos personales.",
        verdad: "VSS realiza una copia diferencial basada en 'Shadow Copies' que solo guarda los bloques de archivos de sistema que han cambiado.",
        comprobalo: "Ejecutá 'vssadmin list shadows' en la consola CMD con privilegios elevados para ver las instantáneas almacenadas."
      }
    },
    entende: {
      queEs: "Un servicio del kernel que captura y crea copias de sombra del volumen del sistema en momentos críticos de inactividad o antes de cambios de estado.",
      paraQueSirve: "Permite restaurar el sistema a un punto operativo previo si un controlador o actualización corrompe el arranque de Windows.",
      quePasaSiFalta: "Incapacidad de recuperar el registro o archivos del sistema ante instalaciones defectuosas sin recurrir a medios externos de rescate."
    },
    interactua: {
      cliExample: "vssadmin list shadowstorage",
      psExample: "Get-ComputerRestorePoint | Select-Object SequenceNumber, Description, CreationTime",
      syntaxBreakdown: "Lista todos los Puntos de Restauración existentes registrados en el almacén de Shadow Copy.",
      whatToLookFor: "Comprobar el espacio máximo asignado a las copias de sombra en el disco del sistema.",
      technicalMetrics: "Espacio ocupado en disco: entre 1GB y 10GB dependiendo de la retención configurada."
    },
    alertaEVO: {
      reversibilityRule: "El espacio máximo reservado para instantáneas VSS se ajusta con 'vssadmin Resize ShadowStorage'.",
      safetyWarning: "Eliminar todas las instantáneas con vssadmin impedirá volver atrás ante un fallo en el siguiente reinicio."
    },
    evidenceBadge: {
      code: "IDLE-VSS-10",
      label: "VSS Shadow Snapshot"
    }
  },
  {
    id: "inv-23-11",
    code: "23.11",
    title: "OEM updaters",
    subtitle: "Servicios de actualización y telemetría del fabricante del equipo",
    targetMechanism: "Vendor Background Services (Armoury Crate, Dell Command, Lenovo Vantage, HP Assistant)",
    targetComponent: "Services.exe / Vendor Daemon executables",
    commandName: "Get-Service | Where-Object {$_.DisplayName -like \"*Dell*\" -or $_.DisplayName -like \"*Lenovo*\" -or $_.DisplayName -like \"*ASUS*\"}",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Procesos de segundo plano de marcas de Laptops y motherboards comprueban versiones de BIOS y utilidades propietarias en inactividad.",
      mythVsTruth: {
        mentira: "Los programas instalados por el fabricante solo se abren cuando hago doble clic en su icono.",
        verdad: "Los OEM configuran múltiples servicios con inicio automático que ejecutan agentes de diagnóstico y actualización permanente.",
        comprobalo: "Abre services.msc y busca nombres asociados al fabricante de tu PC o laptop."
      }
    },
    entende: {
      queEs: "Capas de software preinstaladas por el fabricante para verificar la disponibilidad de firmware, controladores de audio y utilidades de batería.",
      paraQueSirve: "Mantiene actualizado el firmware BIOS/UEFI y drivers específicos de hardware propietario.",
      quePasaSiFalta: "Perderás notificaciones automáticas de actualización de BIOS del fabricante (pudiendo aplicarlas manualmente desde la web oficial)."
    },
    interactua: {
      cliExample: "wmic service where \"name like '%%Asus%%'\" get Name, State",
      psExample: "Get-Service | Where-Object { $_.Status -eq 'Running' -and ($_.Name -match 'HP|Dell|Lenovo|Asus|Acer|MSI') }",
      syntaxBreakdown: "Filtra en PowerShell los servicios activos que correspondan a software comercial preinstalado por ensambladores.",
      whatToLookFor: "Identificar servicios redundantes que consuman memoria y ciclos de CPU en idle.",
      technicalMetrics: "Servicios múltiples: es común encontrar entre 3 y 8 servicios corriendo por fabricante."
    },
    alertaEVO: {
      reversibilityRule: "Estos servicios se pueden cambiar de tipo de inicio 'Automático' a 'Manual' en services.msc.",
      safetyWarning: "No desactives servicios de control térmico o perfil de ventiladores del fabricante en laptops de alto rendimiento."
    },
    evidenceBadge: {
      code: "IDLE-OEM-11",
      label: "OEM Vendor Updater Audit"
    }
  },
  {
    id: "inv-23-12",
    code: "23.12",
    title: "Browser updaters",
    subtitle: "Comprobadores de versión en segundo plano de navegadores web",
    targetMechanism: "Browser Scheduled Tasks & Elevation Services",
    targetComponent: "GoogleUpdate.exe / MicrosoftEdgeUpdate.exe / braveupdate.exe",
    commandName: "Get-ScheduledTask | Where-Object {$_.TaskName -like \"*Update*\" -and ($_.TaskName -like \"*Google*\" -or $_.TaskName -like \"*Edge*\")}",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Los navegadores web basados en Chromium instalan servicios con privilegios de SYSTEM que se despiertan periódicamente para verificar si existen nuevas versiones.",
      mythVsTruth: {
        mentira: "Google Chrome y Microsoft Edge solo se actualizan mientras los tengo abiertos navegando.",
        verdad: "Servicios independientes (GoogleUpdate, EdgeUpdate) ejecutan tareas programadas cada pocas horas sin importar si el navegador está abierto.",
        comprobalo: "Abre el Administrador de Tareas y busca 'Google Update Service' o 'Microsoft Edge Update Service'."
      }
    },
    entende: {
      queEs: "Agentes ligeros de actualización automatizada que parchean vulnerabilidades de seguridad de día cero (Zero-Day) en motores web.",
      paraQueSirve: "Garantiza que el navegador cuente con los parches de seguridad más recientes para proteger la navegación contra exploits web.",
      quePasaSiFalta: "El navegador quedará expuesto a vulnerabilidades de ejecución remota de código publicadas recientemente."
    },
    interactua: {
      cliExample: "sc query gupdate",
      psExample: "Get-Service | Where-Object { $_.Name -match 'gupdate|edgeupdate|brave' } | Select-Object Name, Status, StartType",
      syntaxBreakdown: "Inspecciona el estado de los servicios de actualización automática de los navegadores instalados.",
      whatToLookFor: "Verificar si el tipo de inicio es 'Automatic (Delayed Start)' o 'Manual'.",
      technicalMetrics: "Consumo de recursos insignificante en reposo (menor a 5MB RAM)."
    },
    alertaEVO: {
      reversibilityRule: "Las actualizaciones se seguirán aplicando manualmente desde la sección 'Acerca de...' dentro del menú del navegador.",
      safetyWarning: "Deshabilitar totalmente estos actualizadores en entornos corporativos incrementa severamente la superficie de ataque."
    },
    evidenceBadge: {
      code: "IDLE-BRW-12",
      label: "Browser Auto-Update Daemon"
    }
  },
  {
    id: "inv-23-13",
    code: "23.13",
    title: "CPU idle activity",
    subtitle: "Administración de estados de energía C-States e interrupciones de sistema",
    targetMechanism: "Kernel Power Manager & System Idle Process",
    targetComponent: "ntoskrnl.exe / System Idle Process",
    commandName: "Get-Counter \"\\Processor(_Total)\\% Processor Time\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El 'Proceso Inactivo del Sistema' (System Idle Process) muestra 99% de CPU en el Administrador de Tareas. Lejos de ser un fallo, representa el porcentaje de capacidad libre del procesador.",
      mythVsTruth: {
        mentira: "System Idle Process es un virus que consume el 99% de mi procesador.",
        verdad: "Es un hilo especial del kernel que ejecuta instrucciones HLT (Halt) para colocar los núcleos de la CPU en estados de bajo consumo (C-States).",
        comprobalo: "En la pestaña Detalle del Administrador de Tareas, observa cómo 'Proceso inactivo del sistema' suma 100% junto al resto de los procesos activos."
      }
    },
    entende: {
      queEs: "El mecanismo del kernel de Windows que asigna ciclos vacíos a la CPU e instruye al procesador a ingresar en estados de reposo energético.",
      paraQueSirve: "Reduce drásticamente la temperatura del paquete del procesador y el consumo eléctrico del equipo en inactividad.",
      quePasaSiFalta: "Sin este hilo del kernel, los núcleos de la CPU funcionarían al 100% de frecuencia y temperatura en todo momento."
    },
    interactua: {
      cliExample: "typeperf \"\\Processor(_Total)\\% Processor Time\" -sc 5",
      psExample: "Get-WmiObject -Class Win32_PerfFormattedData_PerfOS_Processor | Where-Object {$_.Name -eq '_Total'} | Select-Object PercentProcessorTime, PercentIdleTime",
      syntaxBreakdown: "Consulta los contadores de rendimiento en tiempo real distinguiendo entre tiempo de uso activo y tiempo de reposo del procesador.",
      whatToLookFor: "Confirmar que PercentIdleTime esté por encima del 90% cuando el usuario no realiza ninguna acción.",
      technicalMetrics: "Consumo energético del procesador disminuye hasta 5W-15W en estados C6/C7/C8."
    },
    alertaEVO: {
      reversibilityRule: "Los perfiles de energía (Alto Rendimiento vs Economizador) alteran la agresividad de entrada a los C-States.",
      safetyWarning: "No desactives la gestión de C-States en la BIOS/UEFI sin un sistema de refrigeración líquida de alto rendimiento."
    },
    evidenceBadge: {
      code: "IDLE-CPU-13",
      label: "C-State & Idle Loop Manager"
    }
  },
  {
    id: "inv-23-14",
    code: "23.14",
    title: "Disk idle activity",
    subtitle: "Compresión de memoria RAM en SSD y flush de caché de escrituras",
    targetMechanism: "Superfetch / SysMain & Memory Compression",
    targetComponent: "SysMain service / ntoskrnl.exe (Memory Compression)",
    commandName: "Get-Service SysMain",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Al dejar la PC en reposo, el administrador de memoria de Windows comprime las páginas de RAM no utilizadas y las vuelca al archivo de paginación (pagefile.sys).",
      mythVsTruth: {
        mentira: "Si no toco la PC, la actividad en el disco debe ser exactamente cero bytes por segundo.",
        verdad: "Windows realiza la escritura diferida de páginas de memoria comprimida y logs del sistema durante la inactividad.",
        comprobalo: "Monitorea la actividad de lectura y escritura del proceso 'System' en la pestaña Disco del Monitor de Recursos."
      }
    },
    entende: {
      queEs: "El subsistema de gestión de almacenamiento virtual que reorganiza páginas de memoria RAM e invoca escrituras pendientes a disco.",
      paraQueSirve: "Libera memoria RAM física para aplicaciones futuras sin necesidad de cerrar programas en segundo plano.",
      quePasaSiFalta: "Menor disponibilidad de RAM libre inmediata ante el lanzamiento de aplicaciones pesadas."
    },
    interactua: {
      cliExample: "fsutil resource info C:",
      psExample: "Get-Process -Name System | Select-Object -ExpandProperty CPU",
      syntaxBreakdown: "Consulta el tiempo acumulado de procesamiento del hilo System involucrado en la paginación de memoria.",
      whatToLookFor: "Identificar ráfagas puntuales de I/O en disco seguidas de largos períodos de inactividad absoluta.",
      technicalMetrics: "Memoria Comprimida visible en Administrador de Tareas -> Rendimiento -> Memoria."
    },
    alertaEVO: {
      reversibilityRule: "SysMain se puede pausar o desactivar en services.msc en sistemas con abundancia de RAM (32GB+).",
      safetyWarning: "Desactivar la compresión de memoria en sistemas con 8GB de RAM o menos provocará errores de Out-Of-Memory (OOM)."
    },
    evidenceBadge: {
      code: "IDLE-DSK-14",
      label: "SysMain & Memory Flush"
    }
  },
  {
    id: "inv-23-15",
    code: "23.15",
    title: "Network idle activity",
    subtitle: "Detección de conectividad NCSI, consultas DNS diferidas y UPnP",
    targetMechanism: "Network Location Awareness (NLA) & NCSI",
    targetComponent: "ncsi.dll / netprofm.dll",
    commandName: "Get-NetConnectionProfile",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Un pequeño paquete HTTP/DNS es enviado cada pocos minutos a servidores de Microsoft (msftconnecttest.com) para verificar si la conexión a Internet está activa.",
      mythVsTruth: {
        mentira: "Mi placa de red no envía ningún paquete si no tengo abiertas pestañas del navegador o juegos.",
        verdad: "El indicador de estado de red (NCSI) realiza sondeos silenciosos para actualizar el icono de red en la barra de tareas.",
        comprobalo: "Filtra en Wireshark por el dominio 'msftconnecttest.com' y observa las solicitudes HTTP periódicas."
      }
    },
    entende: {
      queEs: "Un mecanismo de sondeo de conectividad que valida si el adaptador de red posee acceso real a la red WAN o solo conectividad local.",
      paraQueSirve: "Informa de inmediato al sistema y a las aplicaciones (como Outlook o Teams) si hay acceso efectivo a Internet.",
      quePasaSiFalta: "El icono de red puede mostrar 'Sin acceso a Internet' aunque la navegación en el navegador funcione con normalidad."
    },
    interactua: {
      cliExample: "ping msftconnecttest.com",
      psExample: "Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, NetProfile",
      syntaxBreakdown: "Recupera la configuración actual de la red y el perfil asociado identificado por el servicio NLA.",
      whatToLookFor: "Observar el comportamiento del perfil de red (Private, Public o DomainAuthenticated).",
      technicalMetrics: "Tráfico de red en idle: menos de 2 KB por minuto en peticiones de sondeo ICMP/HTTP."
    },
    alertaEVO: {
      reversibilityRule: "Se puede desactivar la prueba activa de NCSI desde el Registro de Windows (EnableActiveProbing = 0).",
      safetyWarning: "Desactivar NCSI impedirá que aplicaciones de Microsoft Store detecten correctamente la conexión a Internet."
    },
    evidenceBadge: {
      code: "IDLE-NET-15",
      label: "NCSI Active Probing Sweep"
    }
  }
];

export const SECTOR_23_MINICASES: Sector23MiniCase[] = [
  {
    id: "case-23-01",
    code: "CASO-23-A",
    title: "El misterio de los ventiladores ruidosos a las 02:00 AM",
    scenario: "Un usuario reporta que cada madrugada, mientras duerme y no toca la PC, los ventiladores se aceleran al 100% de velocidad produciendo mucho ruido.",
    userStatement: "Tengo un troyano programado que se activa a las 2 AM para minar criptomonedas cuando no uso la máquina.",
    initialMistake: "Formatear la PC de inmediato creyendo que se trata de un malware indetectable por el antivirus.",
    diagnosticQuestion: "¿Cuál es la causa técnica real del pico de recursos en inactividad?",
    options: [
      {
        id: "opt-1",
        text: "Es la tarea de Mantenimiento Automático de Windows ejecutando ProcessIdleTasks y análisis de Defender.",
        isCorrect: true,
        explanation: "Windows por defecto programa la ventana de Mantenimiento Automático a las 02:00 AM para tareas pesadas de optimización y escaneos de seguridad."
      },
      {
        id: "opt-2",
        text: "Es un fallo físico en el sensor de temperatura del motherboard que falla al estar inactivo.",
        isCorrect: false,
        explanation: "Los sensores térmicos no dependen de la actividad del mouse ni de la hora del sistema."
      },
      {
        id: "opt-3",
        text: "Es OneDrive intentando borrar archivos antiguos de la papelera de reciclaje.",
        isCorrect: false,
        explanation: "OneDrive no gestiona la velocidad de los ventiladores ni realiza limpiezas intensivas de registro."
      }
    ],
    technicalVerdict: "SISTEMA OPERATIVO OPERANDO SEGÚN ESPECIFICACIÓN: El Mantenimiento Automático aprovecha las 02:00 AM para tareas de bajo nivel.",
    lessonLearned: "Antes de asumir infección por malware, revisá la hora configurada en el Mantenimiento Automático del Panel de Control."
  },
  {
    id: "case-23-02",
    code: "CASO-23-B",
    title: "SSD Lento tras semanas sin dejar la PC en reposo",
    scenario: "Un diseñador apaga la PC directamente mediante el botón de encendido apenas termina de trabajar sin dejarla nunca unos minutos en reposo.",
    userStatement: "Mi SSD NVMe nuevo perdió el 50% de su velocidad de escritura sin motivo alguno.",
    initialMistake: "Reclamar la garantía del fabricante creyendo que el almacenamiento sufrió un defecto de fábrica.",
    diagnosticQuestion: "¿Qué mecanismo interno no se pudo ejecutar por falta de períodos de reposo (idle)?",
    options: [
      {
        id: "opt-1",
        text: "La orden TRIM y la recolección de basura (Garbage Collection) de la controladora del SSD.",
        isCorrect: true,
        explanation: "TRIM y la reorganización de bloques NAND se ejecutan cuando el sistema entra en reposo. Sin idle, la controladora se queda sin bloques limpios."
      },
      {
        id: "opt-2",
        text: "La actualización del firmware de la tarjeta gráfica.",
        isCorrect: false,
        explanation: "La GPU no influye en la velocidad de escritura de datos en el SSD."
      },
      {
        id: "opt-3",
        text: "La falta de desfragmentación de platillos magnéticos.",
        isCorrect: false,
        explanation: "Los SSDs no poseen platillos magnéticos ni se desfragmentan de manera convencional."
      }
    ],
    technicalVerdict: "DEGRADACIÓN POR FALTA DE TRIM EN IDLE: El SSD requiere tiempo de reposo para que la controladora limpie los bloques borrados.",
    lessonLearned: "Forzar Optimize-Volume -ReTrim o dejar el equipo encendido en idle 15 minutos restituye el rendimiento del almacenamiento."
  },
  {
    id: "case-23-03",
    code: "CASO-23-C",
    title: "El icono de red con signo de exclamación amarillo en reposo",
    scenario: "Un equipo en una oficina muestra el icono de red disconectado tras volver de un período de inactividad, aunque los sitios web abren correctamente.",
    userStatement: "El cable de red está roto porque solo pierde la conexión cuando dejo de usar la computadora.",
    initialMistake: "Reemplazar la placa de red y el cable de red de la oficina.",
    diagnosticQuestion: "¿Qué servicio responsable del estado visual de la red falló durante el sondeo en idle?",
    options: [
      {
        id: "opt-1",
        text: "El servicio NCSI (Network Location Awareness) cuyo sondeo activo a msftconnecttest.com fue bloqueado por el firewall.",
        isCorrect: true,
        explanation: "Si el firewall o la red bloquea las peticiones de NCSI a msftconnecttest.com, Windows asume falta de conectividad aunque la navegación normal funcione."
      },
      {
        id: "opt-2",
        text: "El servicio de impresión en red Spooler.",
        isCorrect: false,
        explanation: "El Spooler de impresión no determina el icono de estado de conectividad en la barra de tareas."
      },
      {
        id: "opt-3",
        text: "El driver de sonido Realtek.",
        isCorrect: false,
        explanation: "El driver de audio no interviene en las pruebas de red de Windows."
      }
    ],
    technicalVerdict: "BLOQUEO DE SONDEO NCSI: La falta de respuesta del servidor de prueba provoca el falso positivo visual.",
    lessonLearned: "Verificá la conectividad hacia msftconnecttest.com o revisá las reglas de salida del firewall institucional."
  }
];

export const SECTOR_23_TEST_BANK: Sector23TestQuestion[] = [
  {
    id: "test-23-01",
    questionNumber: 1,
    category: "Update Orchestrator",
    question: "¿Qué proceso u orquestador de Windows gestiona la descarga e instalación de parches durante los períodos de inactividad?",
    options: [
      { id: "a", text: "USOClient.exe y el servicio UpdateOrchestrator" },
      { id: "b", text: "explorer.exe mediante un plugin de la barra de tareas" },
      { id: "c", text: "spoolsv.exe desde la cola de impresión" },
      { id: "d", text: "calc.exe en segundo plano" }
    ],
    correctOptionId: "a",
    technicalExplanation: "Update Service Orchestrator (USO) sustituyó al antiguo cliente de Windows Update para coordinar parches usando tareas programadas.",
    relatedInvestigationCode: "23.01"
  },
  {
    id: "test-23-02",
    questionNumber: 2,
    category: "Windows Defender",
    question: "¿Qué ocurre con un análisis programado de Defender si el usuario mueve el mouse e interrumpe el estado de inactividad?",
    options: [
      { id: "a", text: "El sistema se congela por completo hasta terminar el análisis" },
      { id: "b", text: "Defender suspende o reduce drásticamente la prioridad del análisis para liberar recursos de inmediato" },
      { id: "c", text: "Windows fuerza un reinicio inmediato" },
      { id: "d", text: "Se borra la base de datos de firmas antivirus" }
    ],
    correctOptionId: "b",
    technicalExplanation: "Defender está diseñado con la condición de detenerse o reducir prioridad cuando se detecta la presencia interactiva del usuario.",
    relatedInvestigationCode: "23.02"
  },
  {
    id: "test-23-03",
    questionNumber: 3,
    category: "TRIM / SSD",
    question: "¿Qué función cumple el comando TRIM durante la inactividad del sistema operativo en una unidad SSD?",
    options: [
      { id: "a", text: "Reordenar físicamente los sectores de los platillos magnéticos" },
      { id: "b", text: "Informar a la controladora del SSD qué bloques de memoria NAND contienen datos eliminados para su posterior limpieza" },
      { id: "c", text: "Comprimir los archivos de video en formato ZIP" },
      { id: "d", text: "Aumentar el voltaje del procesador" }
    ],
    correctOptionId: "b",
    technicalExplanation: "TRIM comunica las liberaciones del sistema de archivos a la controladora para mantener velocidades óptimas de escritura.",
    relatedInvestigationCode: "23.09"
  },
  {
    id: "test-23-04",
    questionNumber: 4,
    category: "Kernel Idle Process",
    question: "¿Qué representa una lectura del 98% en el 'Proceso Inactivo del Sistema' (System Idle Process) en el Administrador de Tareas?",
    options: [
      { id: "a", text: "Un fallo crítico del kernel que consume todo el procesador" },
      { id: "b", text: "El porcentaje de tiempo que la CPU está sin carga ejecutando instrucciones de bajo consumo" },
      { id: "c", text: "Un ataque de denegación de servicio local" },
      { id: "d", text: "El espacio libre en la tarjeta de memoria RAM" }
    ],
    correctOptionId: "b",
    technicalExplanation: "System Idle Process es el contador inverso de uso de CPU; 98% inactivo significa solo 2% de uso real por parte de aplicaciones.",
    relatedInvestigationCode: "23.13"
  },
  {
    id: "test-23-05",
    questionNumber: 5,
    category: "Network Probing",
    question: "¿Para qué sirve el sondeo activo del servicio NCSI enviando peticiones a msftconnecttest.com?",
    options: [
      { id: "a", text: "Para descargar copias de seguridad de las fotos del usuario" },
      { id: "b", text: "Para verificar si la interfaz de red tiene acceso real a la red WAN e informar el estado en la barra de tareas" },
      { id: "c", text: "Para minar criptomonedas para Microsoft" },
      { id: "d", text: "Para enviar la contraseña del Wi-Fi al servidor" }
    ],
    correctOptionId: "b",
    technicalExplanation: "NCSI (Network Location Awareness) valida el acceso a la red WAN realizando una petición HTTP ligera a un endpoint conocido de prueba.",
    relatedInvestigationCode: "23.15"
  }
];
