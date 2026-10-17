// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 30: WINDOWS PERFORMANCE FORENSICS
// "De “se siente lento” a una traza de milisegundos"

export type RiskLevelSector30 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector30Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector30;
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

export interface Sector30MiniCase {
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

export interface Sector30TestQuestion {
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

export const SECTOR_30_INVESTIGATIONS: Sector30Investigation[] = [
  {
    id: "inv-30-01",
    code: "30.01",
    title: "PerfMon",
    subtitle: "Monitor de rendimiento de Windows, arquitectura de contadores y recolección",
    targetMechanism: "Performance Data Helper (PDH) & Registry Perflib Engine",
    targetComponent: "perfmon.exe / pdh.dll / perflib",
    commandName: "perfmon.msc / typeperf -q",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que PerfMon existe desde Windows NT 3.1 en 1993 y sigue siendo la infraestructura de telemetría de contadores más rápida y ligera del mundo empresarial?",
      mythVsTruth: {
        mentira: "El Administrador de Tareas (Task Manager) muestra los mismos datos y es más moderno que PerfMon.",
        verdad: "Task Manager redondea métricas a intervalos de 1 a 2 segundos; PerfMon lee directamente la memoria compartida de la biblioteca PDH con resolución de milisegundos y cientos de contadores ocultos.",
        comprobalo: "Ejecutá `typeperf -q` en la consola para descubrir los más de 20.000 contadores nativos que Windows expone."
      }
    },
    entende: {
      queEs: "La consola de instrumentación central de Windows para inspeccionar, registrar y alertar sobre métricas numéricas en tiempo real de todos los subsistemas del sistema operativo.",
      paraQueSirve: "Transformar sensaciones subjetivas ('la máquina se siente lenta') en vectores numéricos de tasa de transferencia, tiempos de respuesta y longitudes de cola.",
      quePasaSiFalta: "Cualquier diagnóstico de lentitud se convierte en una discusión de opiniones subjetivas sin evidencia cuantificable."
    },
    interactua: {
      cliExample: "typeperf -q \"Processor Information\" | more",
      psExample: "Get-Counter -ListSet 'Processor Information' | Select-Object -ExpandProperty Paths | Select-Object -First 5",
      syntaxBreakdown: "Lista las rutas canónicas de los contadores disponibles para el conjunto de procesadores.",
      whatToLookFor: "Rutas con formato '\Objeto(Instancia)\Contador' listas para consultar con Get-Counter o loguear con Data Collector Sets.",
      technicalMetrics: "Frecuencia de muestreo PDH: ajustable desde 100 ms hasta minutos; sobrecarga en CPU < 0.1% por contador individual."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico pasivo de solo lectura.",
      safetyWarning: "No actives más de 500 contadores simultáneos a frecuencias de 100ms en entornos de producción: saturarías el archivo de log."
    },
    evidenceBadge: {
      code: "EVO-3001-PERFMON",
      label: "PDH Core Instrumentation"
    }
  },
  {
    id: "inv-30-02",
    code: "30.02",
    title: "Counters",
    subtitle: "Métricas críticas: \Processor Information(_Total)\% Processor Time, etc.",
    targetMechanism: "Performance Counter Object Model",
    targetComponent: "Perflib Registry Extensibility (HKEY_PERFORMANCE_DATA)",
    commandName: "typeperf \"\\\\Processor Information(_Total)\\\\% Processor Time\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que '% Processor Time' no mide cuánto trabaja tu CPU, sino el porcentaje de tiempo que NO estuvo ejecutando el hilo de reposo (Idle Thread)?",
      mythVsTruth: {
        mentira: "Si el contador % Processor Time marca 100%, tu CPU está calculando código al máximo de su velocidad.",
        verdad: "Si el CPU está sufriendo estrangulamiento térmico y bajó a 800 MHz, el contador dirá 100% aunque rinda la quinta parte de su capacidad nominal.",
        comprobalo: "Compara '% Processor Time' con '% Processor Performance' para verificar si la CPU está rindiendo a frecuencia completa."
      }
    },
    entende: {
      queEs: "Las variables numéricas estandarizadas que miden rates (tasa por segundo), porcentajes y promedios temporales de cada subsistema de Windows.",
      paraQueSirve: "Monitorear la salud y el consumo de recursos de componentes individuales de hardware y servicios.",
      quePasaSiFalta: "No se puede saber si una saturación de rendimiento es de CPU, cuello de botella de memoria, congestión de red o latencia de I/O."
    },
    interactua: {
      cliExample: "typeperf \"\\\\Processor Information(_Total)\\\\% Processor Time\" -sc 3",
      psExample: "(Get-Counter -Counter '\Processor Information(_Total)\% Processor Time').CounterSamples | Select-Object CookedValue",
      syntaxBreakdown: "Obtiene el valor cocinado (calculado matemáticamente entre dos muestras temporales) del uso de CPU.",
      whatToLookFor: "Valores sostenidos por encima del 85% durante más de 30 segundos indican saturación de cómputo.",
      technicalMetrics: "Cálculo matemático: CookedValue = 100 * (1 - (Delta(IdleTime) / Delta(TimeRange)))."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de telemetría de contadores.",
      safetyWarning: "Verificá siempre que el contador pertenezca a 'Processor Information' y no al viejo 'Processor' para sistemas multi-socket o híbridos."
    },
    evidenceBadge: {
      code: "EVO-3002-COUNTRS",
      label: "Performance Counter Metrics"
    }
  },
  {
    id: "inv-30-03",
    code: "30.03",
    title: "Data Collector Sets",
    subtitle: "Configuración de sesiones de recolección continua y umbrales de alerta",
    targetMechanism: "PLA (Performance Logs and Alerts) Subsystem",
    targetComponent: "pla.dll / logman.exe / Windows Performance Data Logs",
    commandName: "logman query",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que con la herramienta nativa 'logman' puedes programar una 'caja negra' que grabe el rendimiento de tu PC durante 7 días consumiendo menos del 0.5% de batería?",
      mythVsTruth: {
        mentira: "Para monitorear un servidor durante días se necesita software de pago de terceros como Datadog.",
        verdad: "Windows incluye el servicio PLA (Performance Logs & Alerts), capaz de registrar contadores en archivos binarios circulares (.BLG) de forma desatendida.",
        comprobalo: "Ejecutá `logman query` para ver los conjuntos de recopiladores de datos de diagnóstico del sistema preconfigurados."
      }
    },
    entende: {
      queEs: "Un contenedor de instrumentación que agrupa contadores de rendimiento, trazas de eventos (ETW) e información de configuración del sistema en una sesión de registro programada.",
      paraQueSirve: "Atrapar incidentes de lentitud intermitentes que ocurren de noche o cuando el técnico no está mirando la pantalla.",
      quePasaSiFalta: "El soporte técnico depende de que el usuario 'avise' cuando ocurre el fallo, perdiendo la telemetría previa."
    },
    interactua: {
      cliExample: "logman query",
      psExample: "Get-CimInstance -Namespace root\cimv2 -ClassName Win32_PerfRawData | Select-Object -First 3 Name",
      syntaxBreakdown: "Lista las sesiones de recopilación de rendimiento configuradas en el servicio PLA.",
      whatToLookFor: "Conjuntos como 'System Diagnostics' o 'System Performance' listos para ser iniciados.",
      technicalMetrics: "Formato de archivo binario .BLG: compacta hasta 100 contadores muestreados cada segundo en menos de 10 MB por hora."
    },
    alertaEVO: {
      reversibilityRule: "logman stop detiene cualquier sesión activa sin riesgo.",
      safetyWarning: "No configures archivos de log sin límite de tamaño en discos C: con poco espacio libre."
    },
    evidenceBadge: {
      code: "EVO-3003-DATCOLL",
      label: "Data Collector Automation"
    }
  },
  {
    id: "inv-30-04",
    code: "30.04",
    title: "CPU counters",
    subtitle: "% Privileged Time vs % User Time, DPC Time, Interrupt Time",
    targetMechanism: "Processor Execution Privilege Level Accounting",
    targetComponent: "\Processor Information(*)\% Privileged Time / % User Time",
    commandName: "typeperf \"\\\\Processor Information(_Total)\\\\% Privileged Time\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que si '% Privileged Time' supera el 30%, el culpable de la lentitud NO es tu software ni tus juegos, sino el kernel de Windows o un controlador colapsado en Ring 0?",
      mythVsTruth: {
        mentira: "Si el CPU está al 100%, siempre es un programa de usuario que tiene un bucle infinito.",
        verdad: "El tiempo de CPU se divide rígidamente en User Time (Ring 3, aplicaciones) y Privileged Time (Ring 0, kernel y drivers).",
        comprobalo: "Compara en PerfMon '% User Time' frente a '% Privileged Time': aisla de inmediato si el problema es de software o de kernel."
      }
    },
    entende: {
      queEs: "La separación matemática entre los ciclos de procesador invertidos en ejecutar código de usuario frente a llamadas al sistema (syscalls), drivers y manejo de interrupciones.",
      paraQueSirve: "Determinar de un solo vistazo si una ralentización proviene de aplicaciones de usuario o de la capa de bajo nivel del sistema operativo.",
      quePasaSiFalta: "Se intenta optimizar código de usuario cuando el cuello de botella real es un driver antivirus interceptando llamadas de archivo."
    },
    interactua: {
      cliExample: "typeperf \"\\\\Processor Information(_Total)\\\\% Privileged Time\" -sc 3",
      psExample: "Get-Counter -Counter @('\Processor Information(_Total)\% User Time', '\Processor Information(_Total)\% Privileged Time') | Select-Object -ExpandProperty CounterSamples | Format-Table Path, CookedValue",
      syntaxBreakdown: "Compara simultáneamente el porcentaje de tiempo en modo usuario frente a modo privilegiado de kernel.",
      whatToLookFor: "% Privileged Time superior al 25%: síntoma inequívoco de exceso de I/O, contención de drivers o software de seguridad defectuoso.",
      technicalMetrics: "Relación sana en servidor bajo carga: ~80% User Time / ~20% Privileged Time. > 40% Privileged Time = Anomalía severa."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de métricas del procesador.",
      safetyWarning: "Picos de Privileged Time acompañados de DPC Time alto apuntan con 95% de certeza a un controlador defectuoso."
    },
    evidenceBadge: {
      code: "EVO-3004-CPUCNT",
      label: "Privilege Level Accounting"
    }
  },
  {
    id: "inv-30-05",
    code: "30.05",
    title: "Memory counters",
    subtitle: "Available MBytes, Committed Bytes / Commit Limit, Pool Paged/Nonpaged",
    targetMechanism: "Virtual Memory Allocation Accounting",
    targetComponent: "\Memory\Available MBytes / \Memory\Committed Bytes",
    commandName: "typeperf \"\\\\Memory\\\\Available MBytes\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que tu PC puede quedarse sin memoria y congelarse por completo incluso cuando el Administrador de Tareas dice que tienes 10 GB de RAM libres?",
      mythVsTruth: {
        mentira: "La memoria solo se agota cuando la RAM física se llena al 100%.",
        verdad: "Windows colapsa cuando se agota el 'Commit Limit' (RAM + Pagefile). Si se agotan los bytes comprometidos, las aplicaciones crashean con 'Out of Memory' aunque sobre RAM física libre.",
        comprobalo: "Observá el contador \Memory\% Committed Bytes In Use: si llega al 100%, el sistema no puede asignar ni un byte más."
      }
    },
    entende: {
      queEs: "El conjunto de métricas que supervisa la memoria física disponible, los compromisos virtuales de memoria y los pools de memoria del kernel (Paged y Nonpaged Pool).",
      paraQueSirve: "Detectar fugas de memoria (Memory Leaks) en programas de usuario o en drivers antes de que causen el colapso del equipo.",
      quePasaSiFalta: "El equipo se congela o cierra aplicaciones abruptamente sin que el usuario comprenda por qué."
    },
    interactua: {
      cliExample: "typeperf \"\\\\Memory\\\\Available MBytes\" -sc 3",
      psExample: "Get-Counter -Counter @('\Memory\Available MBytes', '\Memory\% Committed Bytes In Use', '\Memory\Pool Nonpaged Bytes') | Select-Object -ExpandProperty CounterSamples | Format-Table Path, CookedValue",
      syntaxBreakdown: "Inspecciona la memoria libre real, la saturación del límite de commit y el peso del Nonpaged Pool del kernel.",
      whatToLookFor: "Pool Nonpaged Bytes superior a 1 GB en un equipo estándar: evidencia casi segura de fuga de memoria en un driver.",
      technicalMetrics: "Available MBytes crítico: < 500 MB (provoca agresivo paging a disco); % Committed Bytes In Use crítico: > 95%."
    },
    alertaEVO: {
      reversibilityRule: "Monitoreo pasivo del gestor de memoria.",
      safetyWarning: "Nunca desactives el archivo de paginación (Pagefile): destruye el Commit Limit y causa fallas catastróficas de memoria virtual."
    },
    evidenceBadge: {
      code: "EVO-3005-MEMCNT",
      label: "Commit Limit & Pool Forensics"
    }
  },
  {
    id: "inv-30-06",
    code: "30.06",
    title: "Disk counters",
    subtitle: "Avg. Disk sec/Transfer, % Idle Time, Current Disk Queue Length",
    targetMechanism: "Storage Subsystem Latency & Queue Depth Profiling",
    targetComponent: "\PhysicalDisk(*)\Avg. Disk sec/Transfer / Current Disk Queue Length",
    commandName: "typeperf \"\\\\PhysicalDisk(_Total)\\\\Avg. Disk sec/Read\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que mirar el '100% de uso de disco' en el Administrador de Tareas es inútil porque un disco puede estar al 100% respondiendo en 1 milisegundo o al 100% congelado durante 3 segundos?",
      mythVsTruth: {
        mentira: "El porcentaje de uso de disco mide qué tan lleno o qué tan exigido está el SSD.",
        verdad: "La única métrica real de cuello de botella de almacenamiento es la latencia por transferencia: \Avg. Disk sec/Transfer medida en segundos.",
        comprobalo: "Comprobá en PerfMon que un SSD NVMe sano mantiene su \Avg. Disk sec/Transfer por debajo de 0.001 s (1 ms) bajo carga."
      }
    },
    entende: {
      queEs: "Los contadores que cuantifican la latencia física de acceso a los sectores de almacenamiento y el número de solicitudes encoladas en espera.",
      paraQueSirve: "Diagnosticar cuellos de botella de disco, degradación de memoria NAND flash o saturación de cola de comandos.",
      quePasaSiFalta: "Se asume que la lentitud es del procesador y se gasta dinero en un CPU nuevo cuando el causante era un disco secundario defectuoso."
    },
    interactua: {
      cliExample: "typeperf \"\\\\PhysicalDisk(_Total)\\\\Avg. Disk sec/Transfer\" -sc 3",
      psExample: "Get-Counter -Counter @('\PhysicalDisk(_Total)\Avg. Disk sec/Read', '\PhysicalDisk(_Total)\Avg. Disk sec/Write', '\PhysicalDisk(_Total)\Current Disk Queue Length') | Select-Object -ExpandProperty CounterSamples | Format-Table Path, CookedValue",
      syntaxBreakdown: "Extrae los tiempos de respuesta de lectura y escritura en segundos junto a la profundidad de la cola de espera.",
      whatToLookFor: "Valores de Avg. Disk sec/Read > 0.025 s (25 ms) en SSDs: alerta crítica de saturación o falla física de celda.",
      technicalMetrics: "Escala de latencia: < 0.005 s (Excelente para SSDs), 0.010-0.020 s (Aceptable para HDD), > 0.050 s (Cuello de botella severo)."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de métricas de almacenamiento.",
      safetyWarning: "Si Current Disk Queue Length supera 2 veces la cantidad de discos físicos durante minutos, el almacenamiento es el cuello de botella absoluto."
    },
    evidenceBadge: {
      code: "EVO-3006-DSKCNT",
      label: "Storage Latency Vectoring"
    }
  },
  {
    id: "inv-30-07",
    code: "30.07",
    title: "Network counters",
    subtitle: "Bytes Total/sec, Output Queue Length, Packets Outbound Errors",
    targetMechanism: "Network Interface Card Throughput & Queue Accounting",
    targetComponent: "\Network Interface(*)\Bytes Total/sec / Output Queue Length",
    commandName: "typeperf \"\\\\Network Interface(*)\\\\Bytes Total/sec\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que si el contador 'Output Queue Length' es mayor a 2, tu placa de red física no da abasto para enviar los paquetes que los programas generan?",
      mythVsTruth: {
        mentira: "Si internet va lento, siempre es un problema de los cables o de la empresa proveedora de fibra óptica.",
        verdad: "Si la interfaz de red local tiene errores de paquetes salientes (Packets Outbound Errors) o su cola está colapsada, la lentitud es 100% de tu adaptador físico o driver.",
        comprobalo: "Verifica con Get-Counter el contador Output Queue Length en tu adaptador de red activo."
      }
    },
    entende: {
      queEs: "Las métricas que registran el volumen de tráfico de bytes que cruzan la interfaz de red, los paquetes descartados y la acumulación de búferes de transmisión.",
      paraQueSirve: "Aislar saturaciones de enlace local, errores de cableado Ethernet o drivers de red sobrecargados.",
      quePasaSiFalta: "Se asumen problemas externos de internet cuando la placa de red está negociando a 100 Mbps en lugar de 1 Gbps."
    },
    interactua: {
      cliExample: "typeperf \"\\\\Network Interface(*)\\\\Bytes Total/sec\" -sc 3",
      psExample: "Get-Counter -Counter '\Network Interface(*)\Bytes Total/sec' | Select-Object -ExpandProperty CounterSamples | Format-Table InstanceName, CookedValue",
      syntaxBreakdown: "Mide el rendimiento instantáneo de tráfico en bytes por segundo de cada adaptador físico y virtual.",
      whatToLookFor: "Valores cercanos al límite del enlace (ej. 125.000.000 Bytes/sec = saturación de un enlace de 1 Gbps).",
      technicalMetrics: "Output Queue Length saludable: 0. Valores > 2 sostenidos indican congestión física de la tarjeta de red."
    },
    alertaEVO: {
      reversibilityRule: "Monitoreo pasivo de red.",
      safetyWarning: "No midas rendimiento de red a través de adaptadores VPN o puentes virtuales de VMware: alteran la telemetría del hardware físico."
    },
    evidenceBadge: {
      code: "EVO-3007-NETCNT",
      label: "NIC Interface Throughput Accounting"
    }
  },
  {
    id: "inv-30-08",
    code: "30.08",
    title: "WPR",
    subtitle: "Windows Performance Recorder perfiles: General, CPU, DiskIO, FileIO",
    targetMechanism: "ETW Multi-Provider Orchestration Engine",
    targetComponent: "wpr.exe / WPRControlProfiles / SystemTraceProvider",
    commandName: "wpr -profiles",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que WPR puede grabar exactamente qué archivo estaba leyendo cada proceso y qué función del kernel lo autorizó con una pérdida de rendimiento casi nula?",
      mythVsTruth: {
        mentira: "Para grabar trazas avanzadas de rendimiento se deben compilar versiones especiales de depuración de Windows (Checked Build).",
        verdad: "Todas las copias de Windows 10 y 11 tienen el motor ETW integrado en el kernel listo para ser activado por WPR en cualquier momento.",
        comprobalo: "Ejecutá `wpr -profiles` para ver los perfiles oficiales de profiling profundo incluidos de fábrica."
      }
    },
    entende: {
      queEs: "La herramienta de línea de comandos e interfaz gráfica encargada de configurar sesiones ETW complejas combinando múltiples proveedores de eventos del kernel y de modo usuario.",
      paraQueSirve: "Capturar el comportamiento completo de la máquina bajo una prueba de estrés para su posterior disección forense.",
      quePasaSiFalta: "El soporte técnico no tiene forma de reconstruir el estado del sistema tras un incidente de rendimiento."
    },
    interactua: {
      cliExample: "wpr -status",
      psExample: "wpr -profiles",
      syntaxBreakdown: "Lista todos los perfiles de captura nativos soportados por la instalación actual de Windows Performance Recorder.",
      whatToLookFor: "Perfiles clave: CPU (Sampled Profiles), DiskIO (Disk I/O activity), FileIO (File activity), Audio (Glitches).",
      technicalMetrics: "Modos de almacenamiento: -filemode (escribe continuo a disco, útil para boot traces) vs -buffermode (buffer circular en RAM)."
    },
    alertaEVO: {
      reversibilityRule: "wpr -cancel detiene y borra cualquier sesión activa.",
      safetyWarning: "En equipos con discos lentos, usa siempre -buffermode para evitar que la propia escritura de la traza altere el rendimiento del sistema."
    },
    evidenceBadge: {
      code: "EVO-3008-WPRENG",
      label: "Performance Recorder Profiles"
    }
  },
  {
    id: "inv-30-09",
    code: "30.09",
    title: "WPA",
    subtitle: "Windows Performance Analyzer: navegación de grafos, flame graphs y timeline de hilos",
    targetMechanism: "ETW Trace Graphing & Symbol Decoding Workbench",
    targetComponent: "wpa.exe / Windows Performance Analyzer Graphing Canvas",
    commandName: "wpa.exe C:\path\to\trace.etl",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que WPA te permite hacer zoom a una ventana de 10 milisegundos y ver el árbol de llamadas (Call Tree) exacto de qué función consumió el 90% del CPU?",
      mythVsTruth: {
        mentira: "WPA es solo un visor de logs de texto similar al Visor de Eventos.",
        verdad: "Es un analizador visual de series de tiempo con soporte para sincronización de símbolos (.PDB), grafos de flamas (Flame Graphs) y tablas de agregación dinámica.",
        comprobalo: "Arrastra el gráfico 'Computation -> CPU Usage (Sampled)' al Analysis Canvas de WPA y expande el Call Stack."
      }
    },
    entende: {
      queEs: "La aplicación de escritorio de análisis forense que abre archivos de traza .ETL y los renderiza en decenas de gráficos sincronizados temporalmente.",
      paraQueSirve: "Localizar la causa raíz de ralentizaciones, tirones, arranques lentos y bloqueos de interfaz gráfica.",
      quePasaSiFalta: "Los archivos de traza .ETL de gigabytes de peso serían bloques de binarios ilegibles."
    },
    interactua: {
      cliExample: "echo WPA requiere la descarga del Windows ADK oficial de Microsoft",
      psExample: "Get-Command wpa.exe -ErrorAction SilentlyContinue | Select-Object Source, Version",
      syntaxBreakdown: "Verifica si la suite Windows Performance Analyzer está instalada y registrada en el PATH del sistema.",
      whatToLookFor: "Gráficos principales: CPU Usage (Sampled), DPC/ISR Execution, Generic Events, Disk Usage, Window in Focus.",
      technicalMetrics: "Resolución de visualización: nanosegundos; capacidad de correlacionar más de 100 millones de eventos en un solo canvas."
    },
    alertaEVO: {
      reversibilityRule: "Operación de análisis pasivo sobre archivos estáticos.",
      safetyWarning: "Configura siempre el Symbol Server oficial de Microsoft en WPA antes de analizar pilas de llamadas o solo verás direcciones hexadecimales crudas."
    },
    evidenceBadge: {
      code: "EVO-3009-WPAANL",
      label: "Visual Trace Canvas"
    }
  },
  {
    id: "inv-30-10",
    code: "30.10",
    title: "ETW",
    subtitle: "Event Tracing for Windows: el bus de instrumentación de ultra-baja sobrecarga de NT",
    targetMechanism: "Kernel ETW Infrastructure (ntoskrnl!Etw*)",
    targetComponent: "ETW Subsystem / EtwRegister / EtwWrite / EtwEventEnabled",
    commandName: "logman query providers",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que ETW puede procesar más de 20.000 eventos por segundo consumiendo menos del 1% de un solo núcleo gracias a búferes de memoria sin bloqueos (lock-free per-CPU)?",
      mythVsTruth: {
        mentira: "ETW es un sistema pesado de telemetría de Microsoft para espiar a los usuarios.",
        verdad: "Es la infraestructura de instrumentación de rendimiento en tiempo real más avanzada del kernel NT, utilizada internamente por drivers, DirectX y subsistemas de seguridad.",
        comprobalo: "Ejecutá `logman query providers` para ver los más de 1.000 proveedores nativos que exponen telemetría en tu Windows."
      }
    },
    entende: {
      queEs: "El mecanismo de rastreo de eventos del kernel de Windows de propósito general, diseñado para registrar eventos con marcas de tiempo de alta precisión y mínimo impacto en el rendimiento.",
      paraQueSirve: "Proporcionar una visión unificada de lo que ocurre en hardware, kernel y aplicaciones sin alterar el timing de la máquina.",
      quePasaSiFalta: "Windows tendría que recurrir a depuradores de software que frenan la ejecución y hacen imposible diagnosticar tirones de tiempo real."
    },
    interactua: {
      cliExample: "logman query providers | findstr /i \"Kernel\"",
      psExample: "Get-WinEvent -ListProvider *Kernel* | Select-Object -First 5 Name, Id",
      syntaxBreakdown: "Filtra los proveedores ETW específicos del subsistema de kernel de Windows.",
      whatToLookFor: "Proveedores críticos: Microsoft-Windows-Kernel-Process, Microsoft-Windows-Kernel-Memory, Microsoft-Windows-Kernel-Disk.",
      technicalMetrics: "Sobrecarga de emisión de un evento ETW deshabilitado: exactamente 1 instrucción de CPU (test bit en memoria, < 1 ns)."
    },
    alertaEVO: {
      reversibilityRule: "Inspección pasiva de proveedores del sistema.",
      safetyWarning: "No intentes manipular el registro del kernel para borrar proveedores de ETW: desestabilizarás el subsistema de diagnóstico de Windows."
    },
    evidenceBadge: {
      code: "EVO-3010-ETWCORE",
      label: "Event Tracing Architecture"
    }
  },
  {
    id: "inv-30-11",
    code: "30.11",
    title: "Providers",
    subtitle: "Kernel Providers, User-Mode Providers, GUIDs y niveles de verbosidad",
    targetMechanism: "ETW Provider Registration & Dispatch Model",
    targetComponent: "Provider GUIDs / Keywords / Level Filters",
    commandName: "logman query providers \"Microsoft-Windows-Kernel-Memory\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cada componente de Windows tiene un identificador único (GUID) de 128 bits que le permite registrar eventos con niveles que van desde Errores críticos hasta Verborragia pura?",
      mythVsTruth: {
        mentira: "Todos los eventos de un proveedor se graban siempre al mismo tiempo.",
        verdad: "Los proveedores usan 'Keywords' (máscaras de bits) y 'Levels' (1 = Crítico a 5 = Verbose) para que solo grabes exactamente lo que necesitas sin inundar la memoria.",
        comprobalo: "Inspecciona el proveedor de memoria del kernel con `logman query providers \"Microsoft-Windows-Kernel-Memory\"`."
      }
    },
    entende: {
      queEs: "El componente de software (driver o DLL) que contiene el código instrumentado para publicar eventos en una sesión ETW.",
      paraQueSirve: "Activar selectivamente la recolección de eventos en subsistemas específicos sin encender telemetría innecesaria.",
      quePasaSiFalta: "Tendrías que grabar todo el sistema simultáneamente, produciendo archivos de cientos de gigabytes imposibles de analizar."
    },
    interactua: {
      cliExample: "logman query providers \"Microsoft-Windows-Kernel-Processor-Power\"",
      psExample: "(Get-WinEvent -ListProvider \"Microsoft-Windows-Kernel-Processor-Power\").Keywords | Format-Table Name, Value",
      syntaxBreakdown: "Lista las palabras clave (Keywords) que permiten filtrar eventos de throttling térmico y transiciones de energía.",
      whatToLookFor: "Keywords como 'Thermal', 'C-States', 'P-States' listas para capturas quirúrgicas de rendimiento.",
      technicalMetrics: "Niveles estándar: 1 = Fatal, 2 = Error, 3 = Warning, 4 = Information, 5 = Verbose."
    },
    alertaEVO: {
      reversibilityRule: "Consulta pasiva de metadatos de proveedores.",
      safetyWarning: "Usar Level 5 (Verbose) sin filtrar Keywords en proveedores de disco puede generar gigabytes de logs en segundos."
    },
    evidenceBadge: {
      code: "EVO-3011-PROVID",
      label: "ETW Provider Anatomy"
    }
  },
  {
    id: "inv-30-12",
    code: "30.12",
    title: "Sessions",
    subtitle: "Private Logger Sessions, Real-Time Sessions, Buffer Allocation",
    targetMechanism: "ETW Trace Session Buffer Pool Management",
    targetComponent: "Session Controllers (logman) & In-Memory Circular Buffers",
    commandName: "logman query -ets",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que en tu PC en este preciso instante hay más de 20 sesiones ETW activas grabando en memoria sin que sientas el más mínimo impacto en el rendimiento?",
      mythVsTruth: {
        mentira: "ETW solo existe cuando abres una herramienta de diagnóstico.",
        verdad: "Windows mantiene sesiones en tiempo real permanentes (como 'EventLog-System' o 'Circular Kernel Context Logger') para auditar seguridad y fallos de energía.",
        comprobalo: "Ejecutá `logman query -ets` para listar todas las sesiones de seguimiento de eventos en ejecución en este microsegundo."
      }
    },
    entende: {
      queEs: "La estructura en memoria que asigna y gestiona los búferes físicos donde los proveedores escriben sus eventos.",
      paraQueSirve: "Desacoplar la escritura del evento del almacenamiento final, evitando que un hilo se frene esperando que el disco escriba.",
      quePasaSiFalta: "Cualquier registro de diagnóstico paralizaría a la aplicación que intenta emitir la métrica."
    },
    interactua: {
      cliExample: "logman query -ets",
      psExample: "Get-CimInstance -Namespace root\wmi -ClassName EventTrace | Select-Object Name, BufferSize, NumberOfBuffers, EventsLost",
      syntaxBreakdown: "Examina las sesiones de traza activas en memoria, su tamaño de búfer y si se perdieron eventos (EventsLost).",
      whatToLookFor: "EventsLost = 0. Si EventsLost es mayor a cero, los búferes asignados fueron insuficientes ante la ráfaga de datos.",
      technicalMetrics: "Configuración típica de sesión: Búferes de 64 KB a 1 MB asignados en Nonpaged Pool; escritura asíncrona mediante hilo de descarga."
    },
    alertaEVO: {
      reversibilityRule: "Inspección pasiva de sesiones activas.",
      safetyWarning: "No detengas sesiones del sistema como 'EventLog-Security' o 'Defender' o desactivarás los registros de auditoría de Windows."
    },
    evidenceBadge: {
      code: "EVO-3012-SESSN",
      label: "Trace Session Buffer Architecture"
    }
  },
  {
    id: "inv-30-13",
    code: "30.13",
    title: "Events",
    subtitle: "Trace Logging, Manifest-based Events y decodificación de payloads",
    targetMechanism: "Binary Event Payload Serializer & Manifest Parser",
    targetComponent: "wevtapi.dll / EVENT_RECORD Structure",
    commandName: "wevtutil gp \"Microsoft-Windows-Kernel-Process\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que los eventos de ETW no guardan texto plano, sino estructuras binarias empaquetadas byte a byte que luego se decodifican usando manifiestos XML compilados en el sistema?",
      mythVsTruth: {
        mentira: "Los eventos de diagnóstico son cadenas de texto como los logs de Apache o Node.js.",
        verdad: "Son estructuras binarias crudas (EVENT_RECORD); esto permite emitir cientos de miles de eventos por segundo sin gastar ciclos en formateo de texto.",
        comprobalo: "Usa `wevtutil gp` para ver el manifiesto que enseña a Windows cómo interpretar los campos de cada evento."
      }
    },
    entende: {
      queEs: "La unidad fundamental de telemetría en ETW: un paquete binario que contiene un encabezado común (marca de tiempo, ID de hilo, CPU ID) y un payload de datos específicos.",
      paraQueSirve: "Transportar mediciones ultra-precisas sin desperdiciar ancho de banda de memoria ni ciclos de serialización de texto.",
      quePasaSiFalta: "El rendimiento del sistema caería drásticamente cada vez que se audita una métrica."
    },
    interactua: {
      cliExample: "wevtutil gp \"Microsoft-Windows-Kernel-Process\" /ge:true /gm:true",
      psExample: "Get-WinEvent -ProviderName \"Microsoft-Windows-Kernel-Process\" -MaxEvents 3 | Select-Object Id, TimeCreated, TaskDisplayName",
      syntaxBreakdown: "Muestra los eventos decodificados del ciclo de vida de procesos del kernel (creación, terminación, afinidad).",
      whatToLookFor: "Event ID 1 (Inicio de proceso) y Event ID 2 (Fin de proceso) con marcas de tiempo en nanosegundos.",
      technicalMetrics: "Encabezado EVENT_HEADER: tamaño fijo de 80 bytes que incluye TimeStamp (LARGE_INTEGER), ThreadId, ProcessId y KernelTime."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de eventos y manifiestos.",
      safetyWarning: "No elimines manifiestos de la carpeta C:\Windows\System32\winevt\Mani o perderás la capacidad de decodificar eventos."
    },
    evidenceBadge: {
      code: "EVO-3013-EVTREC",
      label: "Binary Event Serialization"
    }
  },
  {
    id: "inv-30-14",
    code: "30.14",
    title: "Timestamps",
    subtitle: "QPC (QueryPerformanceCounter), TSC y resolución de nanosegundos",
    targetMechanism: "Hardware Time Stamp Counter & High-Precision Event Timers",
    targetComponent: "CPU Invariant TSC / KeQueryPerformanceCounter / HPET",
    commandName: "wmic cpu get NumberOfCores, MaxClockSpeed",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que la función estándar GetTickCount() de Windows solo actualiza su reloj cada 15.6 milisegundos, por lo que es totalmente ciega ante tirones de microsegundos?",
      mythVsTruth: {
        mentira: "El reloj de Windows siempre mide el tiempo con la misma precisión para todos los programas.",
        verdad: "Para medir latencia de tiempo real se utiliza QueryPerformanceCounter (QPC), respaldado por el Invariant TSC del procesador, con resolución inferior a 100 nanosegundos.",
        comprobalo: "Comprueba en PowerShell cómo Stopwatch utiliza internamente el contador de alta resolución QPC del hardware."
      }
    },
    entende: {
      queEs: "El mecanismo de temporización de ultra-alta precisión basado en registros de transistores de la CPU que incrementan su valor en cada ciclo de reloj de forma sincronizada.",
      paraQueSirve: "Establecer la verdad temporal absoluta entre eventos que ocurren en núcleos distintos con separación de nanosegundos.",
      quePasaSiFalta: "Sería imposible saber qué evento ocurrió primero durante una colisión de hilos o una contención de interrupciones."
    },
    interactua: {
      cliExample: "echo Medir frecuencia QPC nativa de la placa madre",
      psExample: "[System.Diagnostics.Stopwatch]::Frequency",
      syntaxBreakdown: "Obtiene la frecuencia de tics por segundo del contador de alto rendimiento (QPC) en la máquina actual.",
      whatToLookFor: "Valores típicos: 10.000.000 (10 MHz en Windows 11 moderno con reloj de hipervisor sincronizado), ofreciendo resolución de 100 nanosegundos por tic.",
      technicalMetrics: "Resolución temporal: 1 / Stopwatch::Frequency. En QPC a 10 MHz, cada unidad representa exactamente 0.0000001 segundos."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de propiedades de plataforma de temporización.",
      safetyWarning: "No uses comandos como 'bcdedit /set useplatformclock yes' a ciegas: forzar HPET antiguo aumenta la latencia de CPU en procesadores modernos."
    },
    evidenceBadge: {
      code: "EVO-3014-TIMESTP",
      label: "High-Resolution QPC Architecture"
    }
  },
  {
    id: "inv-30-15",
    code: "30.15",
    title: "PresentMon",
    subtitle: "Monitoreo de latencia de presentación de DirectX/Vulkan y desacoplamiento GPU/Display",
    targetMechanism: "Graphics Present Queue Instrumentation via ETW",
    targetComponent: "PresentMon.exe / Intel PresentMon Service / D3D Present Callbacks",
    commandName: "Get-Process | Where-Object { $_.Name -match 'PresentMon' }",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que PresentMon fue creado por ingenieros de Intel y es el motor secreto que usan herramientas famosas como CapFrameX y el nuevo software de telemetría de GPU para medir la latencia entre el clic y la pantalla?",
      mythVsTruth: {
        mentira: "PresentMon es solo un clon de Fraps para ver FPS.",
        verdad: "PresentMon captura los eventos ETW del kernel gráfico (dxgkrnl.sys) para medir el tiempo exacto que un cuadro pasa en la cola de la CPU, en la cola de la GPU y esperando el refresco del monitor.",
        comprobalo: "Descarga PresentMon y comprueba la métrica 'GPU Busy' frente a 'Frame Time' para detectar cuellos de botella instantáneos."
      }
    },
    entende: {
      queEs: "Una herramienta de código abierto que instrumenta la canalización gráfica completa de Windows para rastrear las llamadas a Present() desde la API gráfica hasta la pantalla física.",
      paraQueSirve: "Aislar con precisión quirúrgica si un tirón fue culpa de la CPU calculando lógica o de la GPU renderizando píxeles complejos.",
      quePasaSiFalta: "El usuario asume que la placa de video se quedó corta cuando la CPU estaba tardando 30 ms en despachar comandos."
    },
    interactua: {
      cliExample: "echo PresentMon captura eventos del proveedor Microsoft-Windows-DxgKrnl",
      psExample: "Get-WinEvent -ListProvider \"Microsoft-Windows-DxgKrnl\" -ErrorAction SilentlyContinue | Select-Object Name, Id",
      syntaxBreakdown: "Verifica la disponibilidad del proveedor del kernel de DirectX Graphics en el sistema.",
      whatToLookFor: "Eventos de cola de presentación: DxgKrnl_Present, DxgKrnl_PresentHistory, Blit/Flip models.",
      technicalMetrics: "Métrica GPU Busy: si GPU Busy es inferior a Frame Time por más de 3 ms, la aplicación tiene un cuello de botella de CPU."
    },
    alertaEVO: {
      reversibilityRule: "Diagnóstico pasivo sobre llamadas a APIs de pantalla.",
      safetyWarning: "No ejecutes capturas de PresentMon con búferes de disco saturados o perderás muestras de cuadros intermedios."
    },
    evidenceBadge: {
      code: "EVO-3015-PRSMON",
      label: "DirectX Present Queue Telemetry"
    }
  },
  {
    id: "inv-30-16",
    code: "30.16",
    title: "Correlación entre subsistemas",
    subtitle: "Unificar trazas de CPU, I/O y red para aislar cuellos de botella reales",
    targetMechanism: "Unified Multi-Subsystem Correlation Protocol",
    targetComponent: "Comprehensive Performance Forensics Decision Tree",
    commandName: "perfmon /report",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que un problema que parece de 'red lenta' puede ser en realidad un SSD saturado al 100% que impide al navegador escribir el archivo en el disco a tiempo?",
      mythVsTruth: {
        mentira: "Cada subsistema de la PC funciona de forma independiente y aislada.",
        verdad: "Todos los subsistemas convergen en el bus PCIe, la memoria RAM y el scheduler de la CPU: una falla de disco congela hilos de red, y un driver de red congela el audio.",
        comprobalo: "Genera un informe integral con `perfmon /report` y observa cómo Windows correlaciona CPU, disco, memoria y red en un solo diagnóstico."
      }
    },
    entende: {
      queEs: "La cúspide del peritaje informático: el método para superponer temporalmente gráficos de distintos componentes y encontrar la causa raíz que desencadenó el efecto dominó.",
      paraQueSirve: "Emitir diagnósticos definitivos e irrebatibles que resuelven problemas complejos que otros técnicos declararon 'sin solución'.",
      quePasaSiFalta: "Se atacan los síntomas superficiales sin erradicar la causa raíz, perpetuando la inestabilidad de la máquina."
    },
    interactua: {
      cliExample: "perfmon /report",
      psExample: "Get-Counter -Counter @('\Processor Information(_Total)\% Processor Time', '\Memory\Available MBytes', '\PhysicalDisk(_Total)\Avg. Disk sec/Transfer', '\Network Interface(*)\Bytes Total/sec') | Select-Object -ExpandProperty CounterSamples | Format-Table Path, CookedValue",
      syntaxBreakdown: "Ejecuta una captura instantánea simultánea de los cuatro pilares del rendimiento en un único vector de datos.",
      whatToLookFor: "Correlación de anomalías: CPU 100% + Privileged Time alto -> Driver; CPU bajo + Disk sec/Transfer alto -> Almacenamiento; Commit al límite -> RAM.",
      technicalMetrics: "Matriz final de decisión EVO: Validación cruzada de 4 ejes (CPU / Memoria / Disco / Red) con resolución < 10 ms."
    },
    alertaEVO: {
      reversibilityRule: "perfmon /report genera un diagnóstico HTML nativo no invasivo.",
      safetyWarning: "No tomes decisiones de compra o reemplazo de componentes sin haber realizado antes la correlación completa de los cuatro subsistemas."
    },
    evidenceBadge: {
      code: "EVO-3016-CORREL",
      label: "Unified Forensics Decision Engine"
    }
  }
];

export const SECTOR_30_MINICASES: Sector30MiniCase[] = [
  {
    id: "case-30-01",
    code: "MC-30.1",
    title: "El servidor con 100% de CPU que no tenía procesos activos",
    scenario: "Un servidor de archivos corporativo experimenta lentitud extrema y quejas de 50 usuarios. El Administrador de Tareas muestra que el uso de CPU está clavado en el 100%, pero al ordenar la lista de procesos por consumo de procesador, el proceso más alto consume apenas 2% (System Idle Process marca 0%). El departamento de TI sospechaba de un minero de criptomonedas invisible o un rootkit de Ring 0.",
    userStatement: "\"Tenemos un virus fantasma en el servidor que consume todo el procesador pero no aparece en la lista de tareas.\"",
    initialMistake: "Confiar únicamente en la pestaña Procesos del Administrador de Tareas, que no desglosa el tiempo que la CPU pasa atendiendo interrupciones físicas y DPCs a nivel de kernel.",
    diagnosticQuestion: "¿Qué contador de rendimiento en PerfMon revela la naturaleza de este consumo de CPU?",
    options: [
      {
        id: "opt-1",
        text: "Consultar \Processor Information(_Total)\% Interrupt Time y \Processor Information(_Total)\% DPC Time.",
        isCorrect: true,
        explanation: "¡Exacto! El tiempo que los núcleos pasan en DIRQL y DISPATCH_LEVEL se computa como uso de CPU del sistema, pero no pertenece a ningún proceso de usuario individual. Si % Interrupt Time está en 80%, hay una tormenta de interrupciones (Interrupt Storm) de hardware."
      },
      {
        id: "opt-2",
        text: "Ejecutar un antivirus de línea de comandos en modo seguro.",
        isCorrect: false,
        explanation: "No resuelve la causa si el origen es un conflicto físico de hardware o un puerto saturado."
      },
      {
        id: "opt-3",
        text: "Aumentar la memoria RAM del servidor de 32 GB a 128 GB.",
        isCorrect: false,
        explanation: "La memoria RAM no tiene relación con el porcentaje de interrupciones de hardware en la CPU."
      }
    ],
    technicalVerdict: "El contador % Interrupt Time marcó 88% de uso continuo en el Core 0. Al inspeccionar los adaptadores físicos, se descubrió que un cable de red Ethernet dañado estaba provocando una tormenta de interrupciones de nivel eléctrico en la tarjeta de red Gigabit. Al reemplazar el cable RJ-45 de 5 dólares, el uso de CPU cayó instantáneamente al 3%.",
    lessonLearned: "El uso de CPU sin procesos identificables casi siempre es hardware gritando en las líneas de interrupción. Los contadores de interrupción de PerfMon lo demuestran en segundos."
  },
  {
    id: "case-30-02",
    code: "MC-30.2",
    title: "El misterio de los programas que crasheaban con 16 GB de RAM libres",
    scenario: "Una estación de trabajo para diseño 3D con 32 GB de memoria RAM física sufre cierres inesperados de aplicaciones pesadas con mensajes de error 'Out of Memory: No hay suficiente cuota de memoria para procesar este comando'. Al revisar el rendimiento, el equipo tiene 16 GB de RAM física completamente libres y disponibles.",
    userStatement: "\"Windows 11 no sabe administrar m\u00e1s de 16 GB de RAM, me tira error de falta de memoria cuando todav\u00eda me sobra la mitad de la memoria f\u00edsica.\"",
    initialMistake: "Asumir que la memoria se agota cuando la RAM física se llena, ignorando el concepto arquitectónico del Commit Limit y el rol vital del archivo de paginación.",
    diagnosticQuestion: "¿Qué ocurrió arquitectónicamente con la memoria de este equipo?",
    options: [
      {
        id: "opt-1",
        text: "El técnico desactivó el archivo de paginación (Pagefile) siguiendo un tutorial de internet, lo que fijó el Commit Limit exactamente al tamaño de la RAM física e impidió que las aplicaciones reservaran memoria virtual comprometida.",
        isCorrect: true,
        explanation: "¡Correcto! Las aplicaciones modernas reservan memoria virtual (VirtualAlloc con MEM_COMMIT) mucho antes de usarla físicamente. Si el Pagefile está desactivado, el Commit Limit es rígido y el sistema rechaza nuevas asignaciones de memoria aunque la RAM física esté vacía."
      },
      {
        id: "opt-2",
        text: "Los módulos de memoria RAM están colocados en los slots impares de la placa madre.",
        isCorrect: false,
        explanation: "La posición de los slots afecta al canal (Single vs Dual Channel), pero no provoca errores de denegación de commit virtual con memoria libre."
      },
      {
        id: "opt-3",
        text: "La tarjeta de video está consumiendo toda la RAM a través de DirectX.",
        isCorrect: false,
        explanation: "La memoria compartida de GPU se asigna de forma dinámica y no bloquea el commit de procesos si sobra espacio."
      }
    ],
    technicalVerdict: "El contador \Memory\% Committed Bytes In Use marcaba 99.8%, mientras que \Memory\Available MBytes marcaba 16.200 MB. Al restaurar el archivo de paginación administrado por el sistema en C:, el Commit Limit subió a 48 GB y ninguna aplicación volvió a crashear.",
    lessonLearned: "La RAM física es solo la memoria caché del gestor de memoria virtual. Nunca desactives el archivo de paginación."
  },
  {
    id: "case-30-03",
    code: "MC-30.3",
    title: "El juego que daba tirones cada vez que se disparaba un arma",
    scenario: "Un jugador competitivo experimenta micro-congelamientos de 40 milisegundos en un simulador táctico cada vez que un enemigo dispara o explota una granada cerca. En reposo el juego corre a 200 FPS. El usuario sospechaba de la velocidad de su procesador y consideraba cambiar de plataforma completa.",
    userStatement: "\"Mi procesador es muy lento para calcular la f\u00edsica de las balas, necesito cambiar la placa madre y la CPU.\"",
    initialMistake: "Asumir que los cálculos de física en CPU son el único factor que interviene en un evento interactivo de sonido y partículas.",
    diagnosticQuestion: "¿Cómo se descubre la causa raíz de este tirón mediante instrumentación con WPR/WPA?",
    options: [
      {
        id: "opt-1",
        text: "Capturar una traza ETW con WPR con los perfiles Audio y FileIO, reproducir el disparo y verificar en WPA si el juego lee archivos de audio (.WAV) desde un disco duro mecánico secundario sin precarga en memoria.",
        isCorrect: true,
        explanation: "¡Exacto! El análisis en WPA revelará que el hilo principal del juego ejecutaba una llamada síncrona a CreateFile / ReadFile en un HDD para cargar el sonido del disparo, sufriendo un Hard Fault y deteniendo el fotograma por 40 milisegundos."
      },
      {
        id: "opt-2",
        text: "Subir el volumen general de Windows para forzar a la placa de sonido a mantenerse despierta.",
        isCorrect: false,
        explanation: "El volumen es un multiplicador de ganancia de software, no altera el I/O de archivos."
      },
      {
        id: "opt-3",
        text: "Overclockear el procesador un 10% para acelerar el cálculo.",
        isCorrect: false,
        explanation: "Si el hilo está bloqueado esperando la lectura física de un sector de disco, aumentar los gigahertz del CPU no reduce la latencia mecánica del disco."
      }
    ],
    technicalVerdict: "WPA demostró que el hilo de renderizado pasaba 42 ms en estado 'Wait: Executive' esperando que el disco secundario D: (un disco mecánico de 5400 RPM en reposo) leyera el asset 'explosion_stereo.wav'. Al mover la carpeta del juego al SSD NVMe principal, el tiempo de carga del asset bajó de 42 ms a 0.08 ms y los tirones desaparecieron por completo.",
    lessonLearned: "El síntoma parecía de CPU, pero la traza forense de WPA demostró que era un bloqueo de lectura de I/O de disco. Sin trazas periciales, compras hardware a ciegas."
  }
];

export const SECTOR_30_TEST_BANK: Sector30TestQuestion[] = [
  {
    id: "q30-01",
    questionNumber: 1,
    category: "Arquitectura PerfMon",
    question: "¿Qué ventaja tiene la infraestructura Performance Data Helper (PDH) de PerfMon frente a la pestaña de rendimiento del Administrador de Tareas?",
    options: [
      { id: "A", text: "Es más colorida y tiene animaciones de transición 3D." },
      { id: "B", text: "Proporciona acceso a más de 20.000 contadores nativos con muestreo de alta precisión en milisegundos y capacidad de registro en archivos binarios desatendidos (.BLG)." },
      { id: "C", text: "Descarga drivers automáticamente de internet." },
      { id: "D", text: "Permite cambiar la resolución de pantalla sin reiniciar." }
    ],
    correctOptionId: "B",
    technicalExplanation: "PDH es la biblioteca de instrumentación industrial de Windows NT: expone el modelo completo de objetos y contadores con precisión matemática para diagnósticos rigurosos."
  },
  {
    id: "q30-02",
    questionNumber: 2,
    category: "Métricas de Procesador",
    question: "En el contador \Processor Information(_Total), ¿qué indica un valor elevado de '% Privileged Time' (> 30%)?",
    options: [
      { id: "A", text: "Que las aplicaciones de usuario están consumiendo demasiados recursos de memoria." },
      { id: "B", text: "Que el procesador está pasando una proporción anormal de su tiempo ejecutando código en Ring 0 (kernel de Windows, llamadas al sistema o controladores de dispositivos)." },
      { id: "C", text: "Que el usuario tiene privilegios de Administrador en el dominio." },
      { id: "D", text: "Que la batería de la placa madre está por agotarse." }
    ],
    correctOptionId: "B",
    technicalExplanation: "% Privileged Time mide los ciclos dedicados a la capa privilegiada del kernel. Valores altos señalan problemas de controladores, tormentas de interrupciones o I/O excesiva en Ring 0."
  },
  {
    id: "q30-03",
    questionNumber: 3,
    category: "Memoria Virtual",
    question: "¿Qué representa el contador \Memory\% Committed Bytes In Use y por qué es crítico para la estabilidad del sistema?",
    options: [
      { id: "A", text: "Mide el espacio libre en el disco rígido C:." },
      { id: "B", text: "Mide el porcentaje de memoria virtual comprometida respecto al Commit Limit (RAM física + Pagefile); si llega al 100%, las aplicaciones colapsan por falta de memoria virtual." },
      { id: "C", text: "Mide la velocidad del ventilador del procesador." },
      { id: "D", text: "Mide la temperatura de los módulos de memoria RAM." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El Commit Limit es el límite absoluto de memoria virtual garantizada por el sistema. Si se agota, ninguna aplicación puede asignar nueva memoria, provocando cierres abruptos o denegación de servicios."
  },
  {
    id: "q30-04",
    questionNumber: 4,
    category: "Latencia de Almacenamiento",
    question: "Al diagnosticar cuellos de botella en unidades de almacenamiento, ¿cuál es el contador canónico que mide la latencia real por operación en segundos?",
    options: [
      { id: "A", text: "\PhysicalDisk\Avg. Disk sec/Transfer." },
      { id: "B", text: "\PhysicalDisk\% Disk Time." },
      { id: "C", text: "\PhysicalDisk\Disk Reads/sec." },
      { id: "D", text: "\PhysicalDisk\Disk Write Bytes/sec." }
    ],
    correctOptionId: "A",
    technicalExplanation: "Avg. Disk sec/Transfer mide el tiempo que transcurre desde que se envía un comando de I/O hasta que el disco devuelve los datos. Valores superiores a 0.025 s en SSDs indican cuellos de botella severos."
  },
  {
    id: "q30-05",
    questionNumber: 5,
    category: "Infraestructura ETW",
    question: "¿Por qué Event Tracing for Windows (ETW) es considerado el estándar de oro para el profiling de sistemas en tiempo real?",
    options: [
      { id: "A", text: "Porque se puede programar en cualquier navegador web." },
      { id: "B", text: "Porque está integrado en el kernel de NT y utiliza búferes de memoria circulares por CPU sin bloqueos, procesando decenas de miles de eventos con un impacto de CPU inferior al 1%." },
      { id: "C", text: "Porque elimina los virus del sistema operativo mientras registra." },
      { id: "D", text: "Porque funciona únicamente en computadoras portátiles." }
    ],
    correctOptionId: "B",
    technicalExplanation: "ETW fue concebido para instrumentar software de alta demanda sin alterar los tiempos de ejecución (efecto observador mínimo), permitiendo depurar problemas de milisegundos con fidelidad absoluta."
  },
  {
    id: "q30-06",
    questionNumber: 6,
    category: "Herramientas WPR/WPA",
    question: "En la suite de diagnóstico de rendimiento de Windows, ¿cuál es el rol respectivo de WPR y WPA?",
    options: [
      { id: "A", text: "WPR es para formatear discos y WPA es para instalar impresoras." },
      { id: "B", text: "WPR (Recorder) graba las sesiones de traza ETW configuradas; WPA (Analyzer) abre los archivos .ETL resultantes y renderiza gráficos sincronizados y árboles de llamadas." },
      { id: "C", text: "Ambas herramientas hacen exactamente lo mismo y son duplicadas." },
      { id: "D", text: "WPR solo funciona en Windows 7 y WPA solo en Windows 11." }
    ],
    correctOptionId: "B",
    technicalExplanation: "WPR es el recolector (orquesta proveedores de kernel y usuario para generar el .ETL) y WPA es el visor analítico (interpreta pilas de llamadas con símbolos .PDB y genera visualizaciones temporales)."
  },
  {
    id: "q30-07",
    questionNumber: 7,
    category: "Resolución de Reloj",
    question: "¿Qué ventaja de resolución ofrece QueryPerformanceCounter (QPC) frente a la función tradicional GetTickCount() de la API de Windows?",
    options: [
      { id: "A", text: "GetTickCount tiene una resolución de ~15.6 milisegundos, mientras que QPC se sincroniza con el TSC del hardware ofreciendo resolución inferior a 100 nanosegundos." },
      { id: "B", text: "QPC funciona sin batería y GetTickCount requiere conexión a internet." },
      { id: "C", text: "No existe ninguna diferencia medible entre ambas funciones." },
      { id: "D", text: "GetTickCount mide la temperatura y QPC mide los ventiladores." }
    ],
    correctOptionId: "A",
    technicalExplanation: "GetTickCount depende de la interrupción del temporizador del sistema (~64 Hz, 15.6 ms por tic), totalmente insuficiente para perfilar tirones de milisegundos. QPC lee el contador de ciclos del silicio a frecuencias de megahercios."
  },
  {
    id: "q30-08",
    questionNumber: 8,
    category: "Telemetría Gráfica PresentMon",
    question: "¿Qué métrica clave de PresentMon permite determinar si una caída de fluidez gráfica es originada por la CPU o por la GPU?",
    options: [
      { id: "A", text: "La comparación directa entre 'Frame Time' y 'GPU Busy Time'." },
      { id: "B", text: "El tamaño del archivo ejecutable en disco." },
      { id: "C", text: "El número de modelo del teclado." },
      { id: "D", text: "La cantidad de amigos conectados en la lista de Discord." }
    ],
    correctOptionId: "A",
    technicalExplanation: "Si el Frame Time total es de 20 ms pero GPU Busy Time es de solo 8 ms, significa que la GPU terminó su trabajo en 8 ms y pasó 12 ms esperando que la CPU le entregue el siguiente comando (cuello de botella de CPU)."
  },
  {
    id: "q30-09",
    questionNumber: 9,
    category: "Correlación Forense",
    question: "¿Por qué el protocolo de peritaje informático exige correlacionar múltiples subsistemas (CPU, RAM, Disco, Red) en una misma ventana temporal?",
    options: [
      { id: "A", text: "Para cobrar más honorarios al cliente." },
      { id: "B", text: "Porque una anomalía en un componente frecuentemente es solo el síntoma secundario provocado por un cuello de botella en otro subsistema diferente." },
      { id: "C", text: "Porque los informes deben tener al menos 10 páginas para ser válidos." },
      { id: "D", text: "Porque Windows no permite mirar un solo contador a la vez." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Efecto dominó: un disco duro atascado provoca Hard Page Faults, lo que suspende hilos de red, lo que colapsa búferes y parece un problema de conexión. Solo la correlación temporal revela la causa raíz original."
  },
  {
    id: "q30-10",
    questionNumber: 10,
    category: "Conjuntos de Recopiladores",
    question: "¿Qué comando nativo de Windows permite crear y controlar sesiones de recolección de rendimiento (Data Collector Sets) desde scripts automáticos?",
    options: [
      { id: "A", text: "logman" },
      { id: "B", text: "format" },
      { id: "C", text: "attrib" },
      { id: "D", text: "robocopy" }
    ],
    correctOptionId: "A",
    technicalExplanation: "logman.exe es la utilidad de consola nativa de Windows para consultar, crear, iniciar y detener sesiones de recolección de contadores y trazas ETW en el subsistema PLA."
  }
];
