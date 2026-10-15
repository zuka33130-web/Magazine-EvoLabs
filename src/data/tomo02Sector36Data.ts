// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 36: PC LENTA
// "El motor de diagnóstico central"

export type RiskLevelSector36 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector36Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector36;
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

export interface Sector36MiniCase {
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

export interface Sector36TestQuestion {
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

export const SECTOR_36_INVESTIGATIONS: Sector36Investigation[] = [
  {
    id: "inv-36-01",
    code: "36.01",
    title: "¿Cuándo está lenta?",
    subtitle: "Taxonomía temporal del síntoma: Del reclamo subjetivo a la variable medible",
    targetMechanism: "Symptom Temporal Classification & Telemetry Baselining",
    targetComponent: "Performance Telemetry / WPR / Latency Baselining",
    commandName: "typeperf.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El cliente dice 'mi PC está lenta'. Si no determinas en qué milisegundo exacto ocurre, pasarás horas reparando el componente equivocado.",
      mythVsTruth: {
        mentira: "Una PC lenta tiene un problema general en todo el sistema operativo.",
        verdad: "La lentitud es siempre un cuello de botella puntual en un recurso específico (CPU, RAM, I/O o Bus) ante un disparador concreto.",
        comprobalo: "Pregunta al usuario: ¿Tarda en encender, en abrir Chrome, o cuando juegas? Cada respuesta apunta a un subsistema diferente."
      }
    },
    entende: {
      queEs: "El protocolo de interrogatorio técnico que divide el problema en 6 ventanas temporales: Boot, Launch, Idle, Sustained Load, Network y Copy.",
      paraQueSirve: "Aislar la hipótesis diagnóstica en menos de 2 minutos sin abrir el gabinete ni formatear a ciegas.",
      quePasaSiFalta: "Se pierde tiempo pasando antivirus o reinstalando Windows cuando el problema era un HDD con sectores reasignados o pasta térmica seca."
    },
    interactua: {
      cliExample: "typeperf \"\\Processor(_Total)\\% Processor Time\" \"\\PhysicalDisk(_Total)\\% Disk Time\" -sc 5",
      psExample: "Get-Counter '\\Processor(_Total)\\% Processor Time', '\\PhysicalDisk(_Total)\\% Disk Time' -SampleInterval 2 -MaxSamples 3",
      syntaxBreakdown: "Monitorea simultáneamente CPU y Disco para detectar cuál de los dos subsistemas se encuentra saturado al 100%.",
      whatToLookFor: "Si el disco está al 100% y la CPU al 5%, el problema es I/O; si la CPU está al 100%, es contención de hilos.",
      technicalMetrics: "Un tiempo de cola de disco (Avg. Disk Queue Length) > 2.0 indica saturación inminente de solicitudes de lectura/escritura."
    },
    alertaEVO: {
      reversibilityRule: "typeperf es de solo lectura y bajo consumo.",
      safetyWarning: "Nunca diagnostiques 'PC lenta' sin abrir el Administrador de Tareas y el Monitor de Recursos primero."
    },
    evidenceBadge: {
      code: "S36-TIME-01",
      label: "TIME-TAXONOMY"
    }
  },
  {
    id: "inv-36-02",
    code: "36.02",
    title: "Arranque",
    subtitle: "Fast Startup corrupto, inicialización de BIOS vs kernel y retraso de shell",
    targetMechanism: "Hybrid Boot Hiberfile Ingestion & Shell Startup Phasing",
    targetComponent: "winlogon.exe / explorer.exe / hiberfil.sys",
    commandName: "powercfg /h",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué una laptop con SSD tarda 90 segundos en mostrar el escritorio si el hardware es capaz de arrancar en 8 segundos?",
      mythVsTruth: {
        mentira: "El procesador se volvió lento con los años.",
        verdad: "El archivo de hibernación rápida (Fast Startup) está fragmentado o un servicio de terceros bloquea la señal 'Desktop Ready'.",
        comprobalo: "Revisa en el Administrador de Tareas el 'Tiempo de última BIOS' y los eventos 100 a 110 en Diagnostics-Performance."
      }
    },
    entende: {
      queEs: "El análisis de las 4 fases de inicio: BIOS/UEFI POST, Carga del Kernel NT, Winlogon/Credenciales y Construcción de Explorer Shell.",
      paraQueSirve: "Descubrir si la demora es de hardware de placa base, controladores de boot o programas de inicio.",
      quePasaSiFalta: "El usuario cree que necesita una PC nueva cuando solo requería depurar dos programas de inicio residentes."
    },
    interactua: {
      cliExample: "wevtutil qe Microsoft-Windows-Diagnostics-Performance/Operational /q:\"*[System[(EventID=100)]]\" /c:1 /rd:true /f:text",
      psExample: "Get-WinEvent -LogName 'Microsoft-Windows-Diagnostics-Performance/Operational' | Where-Object { $_.Id -eq 100 } | Select-Object -First 1 Message",
      syntaxBreakdown: "Extrae el evento 100 de diagnóstico oficial que contiene la descomposición en milisegundos de MainPathBootTime.",
      whatToLookFor: "Valores 'BootTime', 'MainPathBootTime' (tiempo de kernel) y 'BootPostBootTime' (tiempo hasta escritorio interactivo).",
      technicalMetrics: "Un arranque sano en SSD NVMe debe tener un MainPathBootTime menor a 15.000 ms (15 segundos)."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de registro de eventos totalmente inocua.",
      safetyWarning: "Si Fast Startup causa errores de reinicio en frío, desactívalo con: powercfg /h off."
    },
    evidenceBadge: {
      code: "S36-BOOT-02",
      label: "BOOT-ANALYZE"
    }
  },
  {
    id: "inv-36-03",
    code: "36.03",
    title: "Abrir programas",
    subtitle: "Latencia de I/O de disco vs carga de DLLs vs paginación bajo demanda",
    targetMechanism: "Process Image Creation & Dynamic Linker Working Set Prefetch",
    targetComponent: "Prefetch / Superfetch (SysMain) / ntdll!LdrpInitializeProcess",
    commandName: "wpr.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Haces clic en Word o el navegador y el cursor muestra el círculo azul girando durante 12 segundos. ¿Qué espera exactamente el procesador?",
      mythVsTruth: {
        mentira: "Word está 'cargando complementos pesados'.",
        verdad: "El almacenamiento tiene una latencia de respuesta de 400 ms o el servicio SysMain está compitiendo por los mismos clusters de prefetch.",
        comprobalo: "Observa en el Monitor de Recursos la columna 'Tiempo de respuesta (ms)' de disk durante el clic: si supera 50 ms, hay cuello de botella en disco."
      }
    },
    entende: {
      queEs: "El proceso mediante el cual Windows asigna memoria virtual, mapea el ejecutable PE, carga sus DLLs dependientes y resuelve la IAT.",
      paraQueSirve: "Diferenciar si la lentitud de apertura se debe a un disco saturado o a un antivirus inyectando hooks en cada CreateProcess.",
      quePasaSiFalta: "Frustración constante del usuario en su flujo de trabajo diario."
    },
    interactua: {
      cliExample: "typeperf \"\\PhysicalDisk(_Total)\\Avg. Disk sec/Read\" -sc 5",
      psExample: "Get-Process | Where-Object { $_.Responding -eq $false } | Select-Object ProcessName, Id",
      syntaxBreakdown: "Mide el tiempo medio en segundos que tarda el disco en completar una lectura. 0.005 s (5 ms) es normal; 0.050 s (50 ms) es lentitud severa.",
      whatToLookFor: "Tiempos mayores a 0.020 s (20 ms) en lecturas aleatorias de 4 KB.",
      technicalMetrics: "Un SSD saludable responde a lecturas aleatorias en menos de 0.1 ms (100 microsegundos)."
    },
    alertaEVO: {
      reversibilityRule: "typeperf es una consulta pasiva.",
      safetyWarning: "No deshabilites el servicio SysMain en discos SSD modernos; solo beneficia en discos mecánicos HDD saturados."
    },
    evidenceBadge: {
      code: "S36-LAUNCH-03",
      label: "APP-LAUNCH"
    }
  },
  {
    id: "inv-36-04",
    code: "36.04",
    title: "Siempre",
    subtitle: "Procesos 'rogue' consumiendo 100% de CPU y thermal throttling continuo en reposo",
    targetMechanism: "Continuous Thread Contention & Hardware CPU Clock Throttling",
    targetComponent: "ntoskrnl.exe / DWM / Interrupts / Thermal Manager",
    commandName: "Get-Process",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Tu PC está en el escritorio sin nada abierto y el ventilador ruge a fondo mientras las ventanas se mueven entrecortadas. ¿Por qué?",
      mythVsTruth: {
        mentira: "Windows 11 necesita una CPU de 16 núcleos para ser fluido en el escritorio.",
        verdad: "Un proceso fantasma quedó en bucle infinito o el procesador bajó a 0.79 GHz por estrangulamiento térmico (BD PROCHOT).",
        comprobalo: "Abre Rendimiento en el Administrador de Tareas: si la velocidad de la CPU está clavada en 0.79 GHz sin subir, el sensor de temperatura está estrangulando el reloj."
      }
    },
    entende: {
      queEs: "La condición patológica donde un recurso de hardware se encuentra saturado o estrangulado incluso en estado de reposo absoluto.",
      paraQueSirve: "Resolver los casos más dramáticos de 'inutilidad total' de una computadora en minutos.",
      quePasaSiFalta: "Riesgo de daño permanente en VRMs o batería inflada por calor continuo."
    },
    interactua: {
      cliExample: "wmic cpu get currentclockspeed,maxclockspeed",
      psExample: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 ProcessName, Id, CPU, WorkingSet64",
      syntaxBreakdown: "Compara la velocidad actual del reloj con la máxima de fábrica y lista los 5 procesos que consumieron más tiempo de procesador.",
      whatToLookFor: "Si CurrentClockSpeed es una fracción de MaxClockSpeed (ej. 798 vs 2800 MHz), hay thermal throttling activo.",
      technicalMetrics: "La temperatura de CPU por encima de 95°C activa el bit IA32_THERM_STATUS en los MSRs del procesador."
    },
    alertaEVO: {
      reversibilityRule: "wmic cpu get es de solo lectura.",
      safetyWarning: "Si el equipo está clavado en 0.79 GHz, limpia las toberas del disipador y renueva la pasta térmica de inmediato."
    },
    evidenceBadge: {
      code: "S36-IDLE-04",
      label: "ALWAYS-SLOW"
    }
  },
  {
    id: "inv-36-05",
    code: "36.05",
    title: "Juegos",
    subtitle: "VRAM overflow, micro-stuttering por memoria compartida y pipeline de shaders",
    targetMechanism: "GPU Memory Paging, D3D Pipeline Saturation & Shader Compilation Stalls",
    targetComponent: "dxgi.dll / dxgkrnl.sys / GPU Dedicated vs Shared Memory",
    commandName: "dxdiag.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El juego marca '60 FPS' pero se siente como diapositivas congelándose cada 2 segundos. ¿Qué es el infame micro-stuttering?",
      mythVsTruth: {
        mentira: "Si tienes 60 FPS promedio, el juego necesariamente va fluido.",
        verdad: "El promedio de FPS oculta caídas del 1% Low y 0.1% Low causadas cuando el juego desborda la memoria VRAM y tiene que paginar por el bus PCIe.",
        comprobalo: "Usa PresentMon o MSI Afterburner: cuando la VRAM llega al 100%, la RAM del sistema sube de golpe y el frametime se dispara a 150 ms."
      }
    },
    entende: {
      queEs: "La congestión del bus PCI Express cuando la tarjeta gráfica satura su VRAM dedicada y recurre a la memoria compartida del sistema (DDR4/DDR5).",
      paraQueSirve: "Explicar por qué bajar una sola opción gráfica (como calidad de texturas) elimina los tirones sin cambiar de placa de video.",
      quePasaSiFalta: "El usuario malgasta dinero comprando procesadores nuevos cuando el cuello de botella era la VRAM de la placa de video."
    },
    interactua: {
      cliExample: "dxdiag /x dx_report.xml",
      psExample: "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion",
      syntaxBreakdown: "Genera el informe exhaustivo de capacidades DirectX y memoria dedicada de video instalada en el sistema.",
      whatToLookFor: "Cantidad de AdapterRAM dedicada frente a la resolución y texturas configuradas en el juego.",
      technicalMetrics: "El ancho de banda de VRAM GDDR6 supera los 400 GB/s; el bus PCIe 3.0/4.0 a RAM compartida solo ofrece entre 16 y 32 GB/s."
    },
    alertaEVO: {
      reversibilityRule: "dxdiag genera un archivo XML descartable.",
      safetyWarning: "No uses optimizadores que prometan 'aumentar la VRAM de tu placa dedicada por registro'; es físicamente imposible."
    },
    evidenceBadge: {
      code: "S36-GAME-05",
      label: "VRAM-PACING"
    }
  },
  {
    id: "inv-36-06",
    code: "36.06",
    title: "Copias",
    subtitle: "Buffer de NTFS, disco fragmentado, saturación de SLC caché y buses USB",
    targetMechanism: "SLC Cache Exhaustion & USB Mass Storage Protocol Bottlenecks",
    targetComponent: "USBSTOR.SYS / NTFS Cache Manager / Write Caching",
    commandName: "fsutil behavior",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Copias una película a un pendrive: arranca volando a 120 MB/s... y a los 5 segundos se desploma a 3 MB/s con pausas infinitas. ¿Por qué?",
      mythVsTruth: {
        mentira: "El pendrive está roto o Windows tiene un virus de transferencia.",
        verdad: "Los primeros gigabytes se copiaron en la memoria RAM (caché de escritura) y en la caché SLC; al agotarse, el chip NAND barato copia a su velocidad real.",
        comprobalo: "Observa el gráfico de transferencia de Windows: la caída abrupta coincide exactamente con el llenado de la memoria intermedia."
      }
    },
    entende: {
      queEs: "La física de la memoria NAND flash TLC/QLC y la diferencia entre caché SLC rápida y velocidad de escritura directa.",
      paraQueSirve: "Entender por qué las unidades USB económicas y SSDs sin DRAM sufren caídas monumentales en transferencias de archivos grandes.",
      quePasaSiFalta: "Diagnósticos erróneos de puertos USB o reclamos infundados de garantía."
    },
    interactua: {
      cliExample: "fsutil behavior query DisableDeleteNotify",
      psExample: "Get-PhysicalDisk | Select-Object DeviceId, MediaType, BusType, OperationalStatus, HealthStatus",
      syntaxBreakdown: "Comprueba si TRIM está habilitado (DisableDeleteNotify = 0) y consulta el tipo de bus y salud física de la unidad.",
      whatToLookFor: "DisableDeleteNotify = 0 (TRIM activo en SSD). Si es 1, la velocidad de escritura decae drásticamente con el uso.",
      technicalMetrics: "La memoria QLC sin caché SLC puede caer a velocidades de 20 MB/s, más lento que un disco mecánico clásico."
    },
    alertaEVO: {
      reversibilityRule: "fsutil behavior query es inocuo.",
      safetyWarning: "Asegúrate de que TRIM esté siempre activo en SSDs: fsutil behavior set DisableDeleteNotify 0."
    },
    evidenceBadge: {
      code: "S36-COPY-06",
      label: "NAND-WRITE"
    }
  },
  {
    id: "inv-36-07",
    code: "36.07",
    title: "Internet",
    subtitle: "Latencia DNS, bufferbloat en router y adaptadores Wi-Fi en ahorro de energía",
    targetMechanism: "DNS Resolver Latency, Bufferbloat & 802.11 Power Save Modes",
    targetComponent: "dnscache / tcpip.sys / NDIS 6.x Wi-Fi Miniport",
    commandName: "ping.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Tienes 300 Megas contratados, el Speedtest marca 300 Megas, pero hacer clic en cualquier página tarda 3 segundos en reaccionar. ¿Por qué?",
      mythVsTruth: {
        mentira: "Si el test de velocidad da bien, tu internet no tiene ningún problema.",
        verdad: "La velocidad (ancho de banda) no sirve de nada si el servidor DNS tarda 400 ms en resolver el nombre de dominio de cada elemento web.",
        comprobalo: "Mide el tiempo de respuesta del servidor DNS de tu proveedor frente a servidores públicos como 1.1.1.1 o 8.8.8.8."
      }
    },
    entende: {
      queEs: "La distinción entre throughput (ancho de banda en Mbps) y latencia de conexión (RTT en milisegundos).",
      paraQueSirve: "Solucionar la sensación de 'internet pesado' cambiando el servidor DNS o desactivando el ahorro de energía en la tarjeta Wi-Fi.",
      quePasaSiFalta: "El usuario sigue pagando planes de internet más caros sin solucionar la lentitud de navegación."
    },
    interactua: {
      cliExample: "ipconfig /displaydns | findstr /i \"Record Name\"",
      psExample: "Measure-Command { Resolve-DnsName google.com -Server 1.1.1.1 } | Select-Object TotalMilliseconds",
      syntaxBreakdown: "Mide con precisión de microsegundos el tiempo que tarda el servidor DNS 1.1.1.1 en resolver la dirección IP.",
      whatToLookFor: "Tiempos menores a 20 ms son óptimos; tiempos mayores a 100 ms provocan navegación pesada.",
      technicalMetrics: "Una página web moderna realiza entre 30 y 80 consultas DNS individuales para cargar scripts, anuncios y estilos."
    },
    alertaEVO: {
      reversibilityRule: "ipconfig y Resolve-DnsName son de solo lectura.",
      safetyWarning: "Para limpiar caché DNS estancada ejecuta: ipconfig /flushdns."
    },
    evidenceBadge: {
      code: "S36-NET-07",
      label: "DNS-LATENCY"
    }
  },
  {
    id: "inv-36-08",
    code: "36.08",
    title: "Después de horas encendida",
    subtitle: "Memory leaks en Non-Paged Pool y degradación de controladores",
    targetMechanism: "Kernel Non-Paged Pool Leakage & Handle Exhaustion",
    targetComponent: "Non-Paged Pool / Paged Pool / Poolmon.exe / Driver Tags",
    commandName: "poolmon.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Al encender la PC por la mañana vuela, pero a las 6 de la tarde todo se siente arrastrado y el cursor tartamudea. ¿Dónde se fue la memoria?",
      mythVsTruth: {
        mentira: "Windows necesita reiniciarse todos los días para 'descansar'.",
        verdad: "Un controlador defectuoso tiene una fuga de memoria (leak) en el Non-Paged Pool que no se puede enviar al disco ni liberar hasta reiniciar.",
        comprobalo: "Abre el Administrador de Tareas en Rendimiento > Memoria: si 'Grupo no paginado' supera 1.5 GB o 2 GB, tienes una fuga de driver activa."
      }
    },
    entende: {
      queEs: "La memoria que el kernel y los drivers reservan para estructuras críticas y que jamás puede ser expulsada al archivo de paginación.",
      paraQueSirve: "Identificar qué controlador exacto tiene la fuga mediante etiquetas de pool (Pool Tags) con poolmon.",
      quePasaSiFalta: "El sistema colapsa con pantalla azul DRIVER_VERIFIER_DETECTED_VIOLATION o BAD_POOL_CALLER."
    },
    interactua: {
      cliExample: "typeperf \"\\Memory\\Pool Nonpaged Bytes\" \"\\Memory\\Pool Paged Bytes\" -sc 5",
      psExample: "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory, @{N='NonPagedPoolMB';E={[math]::Round($_.SizeStoredInPagingFiles/1024,2)}}",
      syntaxBreakdown: "Consulta el tamaño del pool no paginado del kernel en tiempo real.",
      whatToLookFor: "En una máquina sana, el pool no paginado oscila entre 200 MB y 600 MB. Si supera 2.000 MB (2 GB), hay fuga confirmada.",
      technicalMetrics: "Culpables históricos comunes: drivers de red Killer Network, software de RGB o antivirus con minifilters no depurados."
    },
    alertaEVO: {
      reversibilityRule: "typeperf es pasivo e inocuo.",
      safetyWarning: "Actualiza de inmediato el driver del fabricante del dispositivo responsable de la fuga de pool."
    },
    evidenceBadge: {
      code: "S36-LEAK-08",
      label: "POOL-LEAK"
    }
  },
  {
    id: "inv-36-09",
    code: "36.09",
    title: "CPU",
    subtitle: "% Processor Time, DPC time, C-States y estrangulamiento de frecuencia",
    targetMechanism: "Hardware P-States, C-States & DPC CPU Steal Accounting",
    targetComponent: "hal.dll / ACPI Driver / Intel SpeedShift / AMD CPPC",
    commandName: "powercfg /query",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué el Administrador de Tareas dice que tu CPU está al 10% pero tu computadora responde con lentitud extrema?",
      mythVsTruth: {
        mentira: "Si el uso de CPU es bajo, el procesador está trabajando holgado y rápido.",
        verdad: "Si la CPU está estrangulada en su estado P-State más bajo (baja frecuencia) o consumida en tiempo DPC, el rendimiento real es pésimo.",
        comprobalo: "Compara el % Processor Time con el % de Frecuencia Máxima: una CPU al 10% pero a 400 MHz rinde menos que una al 50% a 4.0 GHz."
      }
    },
    entende: {
      queEs: "La comprensión de la frecuencia dinámica escalonada del procesador y cómo los planes de energía gestionan el estado térmico.",
      paraQueSirve: "Detectar si la lentitud es falta de potencia de cómputo o una limitación artificial por configuración de energía o calor.",
      quePasaSiFalta: "Se asume erróneamente que la CPU es obsoleta cuando solo requería configurar el plan de energía o cambiar pasta térmica."
    },
    interactua: {
      cliExample: "typeperf \"\\Processor Information(_Total)\\% Processor Time\" \"\\Processor Information(_Total)\\% of Maximum Frequency\" -sc 5",
      psExample: "Get-Counter '\\Processor Information(_Total)\\% Processor Time', '\\Processor Information(_Total)\\% of Maximum Frequency'",
      syntaxBreakdown: "Muestra el uso de CPU junto con el porcentaje de frecuencia de reloj en el que se encuentra operando.",
      whatToLookFor: "Si '% of Maximum Frequency' se mantiene por debajo del 30% bajo carga pesada, hay bloqueo térmico o de firmware.",
      technicalMetrics: "El procesador debe escalar dinámicamente al 100% o turbo boost al recibir ráfagas de trabajo en menos de 15 ms."
    },
    alertaEVO: {
      reversibilityRule: "Consulta pasiva de contadores del kernel.",
      safetyWarning: "Si sospechas del plan de energía, restablece con: powercfg /restoredefaultschemes."
    },
    evidenceBadge: {
      code: "S36-CPU-09",
      label: "CPU-THROTTLE"
    }
  },
  {
    id: "inv-36-10",
    code: "36.10",
    title: "RAM",
    subtitle: "Commit Charge vs RAM física, Page Faults/sec y el colapso del swap",
    targetMechanism: "Virtual Memory Commit Limit & Pagefile Saturation",
    targetComponent: "mm / Pagefile.sys / Working Sets",
    commandName: "wmic OS get TotalVirtualMemorySize",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que tu PC puede colapsar por 'falta de memoria' incluso cuando el Administrador de Tareas muestra que todavía queda 1 GB de RAM libre?",
      mythVsTruth: {
        mentira: "Windows solo falla cuando la memoria física RAM llega al 100%.",
        verdad: "Windows falla cuando se agota el 'Commit Limit' (la promesa de memoria virtual total entre RAM y pagefile).",
        comprobalo: "Abre el Administrador de Tareas > Rendimiento > Memoria y observa la cifra 'Memoria confirmada': si llega a su límite, las apps fallan al reservar memoria."
      }
    },
    entende: {
      queEs: "La arquitectura de memoria virtual de Windows basada en reservas y compromisos (VirtualAlloc con MEM_COMMIT).",
      paraQueSirve: "Entender por qué desactivar el archivo de paginación (pagefile) es una de las peores decisiones técnicas que se pueden tomar.",
      quePasaSiFalta: "Mensajes de 'Memoria insuficiente' en juegos o programas pesados a pesar de tener módulos de RAM instalados."
    },
    interactua: {
      cliExample: "typeperf \"\\Memory\\% Committed Bytes In Use\" \"\\Memory\\Pages/sec\" -sc 5",
      psExample: "Get-Counter '\\Memory\\% Committed Bytes In Use', '\\Memory\\Available MBytes'",
      syntaxBreakdown: "Calcula el porcentaje de memoria comprometida respecto al límite total garantizado por el sistema.",
      whatToLookFor: "Si '% Committed Bytes In Use' supera el 85%, el sistema empieza a paginar agresivamente en disco.",
      technicalMetrics: "Commit Limit = RAM Física + Tamaño actual del archivo de paginación (Pagefile.sys)."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de contadores de memoria.",
      safetyWarning: "Mantén siempre el archivo de paginación administrado por el sistema en tu unidad SSD más rápida."
    },
    evidenceBadge: {
      code: "S36-RAM-10",
      label: "COMMIT-LIMIT"
    }
  },
  {
    id: "inv-36-11",
    code: "36.11",
    title: "Disk",
    subtitle: "El temido 100% de uso de disco: Tiempo de respuesta, longitud de cola e I/O",
    targetMechanism: "Storage Controller Queue Depth & Physical Head Thrashing",
    targetComponent: "storport.sys / disk.sys / NTFS I/O Request Packets (IRPs)",
    commandName: "resmon.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El síntoma más común del planeta: Disco al 100% en el Administrador de Tareas transfiriendo apenas 200 KB/s. ¿Por qué?",
      mythVsTruth: {
        mentira: "El disco está transfiriendo muchísimos gigabytes de información a toda velocidad.",
        verdad: "El disco está colapsado por peticiones de lectura aleatoria diminutas que saturan la cola de espera física del cabezal mecánico.",
        comprobalo: "Mira la columna 'Tiempo de respuesta': en un HDD saturado verás 3.000 ms a 5.000 ms (la PC tarda 5 segundos en leer un archivo de 4 KB)."
      }
    },
    entende: {
      queEs: "La diferencia crítica entre tasa de transferencia (MB/s) y tiempo de respuesta (latencia de I/O en milisegundos).",
      paraQueSirve: "Demostrar matemáticamente por qué Windows 10 y 11 son incompatibles en la práctica con discos rígidos mecánicos como unidad principal de arranque.",
      quePasaSiFalta: "La computadora es prácticamente inutilizable durante 20 minutos después de cada encendido."
    },
    interactua: {
      cliExample: "typeperf \"\\PhysicalDisk(_Total)\\Avg. Disk Queue Length\" \"\\PhysicalDisk(_Total)\\Avg. Disk sec/Transfer\" -sc 5",
      psExample: "Get-Counter '\\PhysicalDisk(_Total)\\Avg. Disk Queue Length', '\\PhysicalDisk(_Total)\\Avg. Disk sec/Transfer'",
      syntaxBreakdown: "Mide la profundidad de la cola de disco y el tiempo medio en segundos por cada transferencia física.",
      whatToLookFor: "Avg. Disk sec/Transfer mayor a 0.050 s (50 ms) indica saturación; en SSD debe ser menor a 0.001 s (1 ms).",
      technicalMetrics: "Un disco HDD mecánico solo ofrece entre 75 y 100 IOPS; un SSD NVMe moderno supera las 500.000 IOPS."
    },
    alertaEVO: {
      reversibilityRule: "typeperf es una consulta pasiva segura.",
      safetyWarning: "Si un cliente tiene un disco HDD al 100% continuo, la única solución técnica profesional definitiva es clonar a un SSD."
    },
    evidenceBadge: {
      code: "S36-DISK-11",
      label: "DISK-QUEUED"
    }
  },
  {
    id: "inv-36-12",
    code: "36.12",
    title: "GPU",
    subtitle: "Saturación del bus PCIe, throttling por temperatura y cuello de botella de motor D3D",
    targetMechanism: "GPU Core Clock Throttling, PCIe Link Downgrading & VRAM Thrash",
    targetComponent: "Direct3D / WDDM / Video Memory Manager (VidMm)",
    commandName: "nvidia-smi / dxdiag",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Compraste una placa de video potente, pero en los juegos tienes la mitad de rendimiento que en los videos de YouTube. ¿Qué está fallando?",
      mythVsTruth: {
        mentira: "La tarjeta de video vino fallada de fábrica.",
        verdad: "La GPU está conectada en una ranura PCIe x1 en lugar de x16, o el procesador está limitando la alimentación de fotogramas.",
        comprobalo: "Usa GPU-Z para verificar la casilla 'Bus Interface': si marca 'PCIe x16 @ x1', el ancho de banda está estrangulado al 6%."
      }
    },
    entende: {
      queEs: "El equilibrio del pipeline gráfico entre CPU (render thread/draw calls), bus PCIe y chip de video (GPU).",
      paraQueSirve: "Identificar cuellos de botella reales en sistemas de alto rendimiento para gaming y diseño 3D.",
      quePasaSiFalta: "Bajo aprovechamiento de hardware costoso."
    },
    interactua: {
      cliExample: "nvidia-smi -q -d PERFORMANCE",
      psExample: "Get-ItemProperty HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000 | Select-Object DriverDesc, DriverVersion",
      syntaxBreakdown: "Consulta el estado de rendimiento del controlador gráfico NVIDIA o las propiedades del controlador de video en el registro.",
      whatToLookFor: "Estados de rendimiento P-State (P0 es máximo rendimiento, P8 es reposo) y límites térmicos activos.",
      technicalMetrics: "Una ranura PCIe 3.0 x16 ofrece 15.75 GB/s; si opera en modo degradado x1 o x4, el juego sufrirá microcortes severos."
    },
    alertaEVO: {
      reversibilityRule: "nvidia-smi query es de solo lectura.",
      safetyWarning: "Asegúrate de instalar la GPU siempre en el primer slot PCIe más cercano al socket del procesador."
    },
    evidenceBadge: {
      code: "S36-GPU-12",
      label: "GPU-LINK-OK"
    }
  },
  {
    id: "inv-36-13",
    code: "36.13",
    title: "Network",
    subtitle: "Pérdida de paquetes, retransmisiones TCP y cuellos de botella en la LAN",
    targetMechanism: "TCP Retransmission Rate & Network Interface Buffer Overflow",
    targetComponent: "tcpip.sys / NDIS Driver / Network Adapter Hardware Offload",
    commandName: "netstat -s",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué un juego online o llamada de Zoom se traba a pesar de tener fibra óptica de 500 Megas?",
      mythVsTruth: {
        mentira: "El servidor del juego está congestionado.",
        verdad: "Tu cable de red o tu conexión Wi-Fi tiene una tasa alta de pérdida de paquetes, obligando a retransmitir continuamente la información.",
        comprobalo: "Ejecuta 'netstat -s -p tcp' y busca la métrica 'Segmentos retransmitidos': si supera el 2% del total, hay falla física en el enlace."
      }
    },
    entende: {
      queEs: "El costo computacional de las retransmisiones TCP y la sobrecarga que provocan en el stack de red del kernel.",
      paraQueSirve: "Solucionar problemas de audio entrecortado, tirones en juegos y fallas de streaming sin tocar el software del equipo.",
      quePasaSiFalta: "Se busca el problema en Windows cuando la falla era un cable de red categoría 5 doblado o interferencias en el canal Wi-Fi."
    },
    interactua: {
      cliExample: "netstat -s -p tcp | findstr /i \"retransmitidos enviados\"",
      psExample: "Get-NetAdapterStatistics | Select-Object Name, ReceivedBytes, SentBytes, ReceivedDiscardedPackets, OutboundDiscardedPackets",
      syntaxBreakdown: "Extrae las estadísticas de paquetes descartados y retransmitidos en todos los adaptadores de red activos.",
      whatToLookFor: "Cualquier incremento constante en 'ReceivedDiscardedPackets' indica saturación de buffer o hardware defectuoso.",
      technicalMetrics: "En una red Ethernet local sana, la tasa de paquetes descartados debe ser exactamente 0 (cero)."
    },
    alertaEVO: {
      reversibilityRule: "netstat -s es una lectura estadística pasiva.",
      safetyWarning: "Prueba cambiar el cable de red UTP antes de gastar en routers nuevos."
    },
    evidenceBadge: {
      code: "S36-LAN-13",
      label: "TCP-RETRANSMIT"
    }
  },
  {
    id: "inv-36-14",
    code: "36.14",
    title: "Temperature",
    subtitle: "TJMax, PROCHOT y la física del calor: Por qué el silicio se autoprotege",
    targetMechanism: "CPU Thermal Junction Maximum (TJMax) & Clock Throttling",
    targetComponent: "MSR IA32_THERM_STATUS / ACPI Thermal Zone / BIOS DPTF",
    commandName: "wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que los procesadores modernos no se queman cuando calientan, sino que reducen su velocidad a la mitad para evitar derretirse?",
      mythVsTruth: {
        mentira: "Si la CPU calienta, el sistema operativo sigue rindiendo igual hasta que se apaga de golpe.",
        verdad: "Al alcanzar la temperatura TJMax (típicamente 95°C - 100°C), el procesador inserta ciclos nulos de reloj, reduciendo drásticamente su potencia.",
        comprobalo: "Observa con HWMonitor cómo la frecuencia de la CPU cae de 4.2 GHz a 1.2 GHz cuando la temperatura toca los 98°C."
      }
    },
    entende: {
      queEs: "El mecanismo de hardware integrado PROCHOT (Processor Hot) y la respuesta térmica de la arquitectura de silicio.",
      paraQueSirve: "Diagnosticar laptops y PCs de escritorio que se vuelven lentas solo después de 10 minutos de uso intensivo.",
      quePasaSiFalta: "Degradación acelerada de la pasta térmica y lentitud crónica del equipo."
    },
    interactua: {
      cliExample: "wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature",
      psExample: "Get-CimInstance -Namespace root/wmi -ClassName MSAcpi_ThermalZoneTemperature | ForEach-Object { [PSCustomObject]@{ Zona=$_.InstanceName; TempC=($_.CurrentTemperature - 2732)/10 } }",
      syntaxBreakdown: "Consulta mediante WMI la temperatura de las zonas térmicas ACPI de la placa base (convertidas de décimas de Kelvin a °Celsius).",
      whatToLookFor: "Valores superiores a 85°C en reposo o 95°C bajo carga.",
      technicalMetrics: "Cada 10°C adicionales reducen la eficiencia de conmutación de los transistores de silicio y elevan el consumo por fugas de corriente (leakage)."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de sensores 100% segura.",
      safetyWarning: "Si una laptop supera los 95°C con tareas de oficina, requiere mantenimiento térmico físico inmediato."
    },
    evidenceBadge: {
      code: "S36-TEMP-14",
      label: "THERMAL-GUARD"
    }
  },
  {
    id: "inv-36-15",
    code: "36.15",
    title: "Startup",
    subtitle: "El análisis de impacto en el arranque: Desarmando los 20 programas invisibles",
    targetMechanism: "Startup Impact Scoring & Shell Delay Mitigation",
    targetComponent: "Task Manager Startup Tab / AppX Startup Tasks",
    commandName: "Get-CimInstance Win32_StartupCommand",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué al prender tu computadora se abren Spotify, Steam, Discord, OneDrive, Teams, el actualizador de la impresora y un antivirus?",
      mythVsTruth: {
        mentira: "Tener programas en inicio es necesario para que funcionen bien cuando los necesitas.",
        verdad: "Cada programa en inicio añade consumo de RAM, servicios de fondo y tiempo de retraso al explorador de archivos.",
        comprobalo: "Deshabilita todos los programas de inicio en el Administrador de Tareas y reinicia: el tiempo de arranque caerá a menos de la mitad."
      }
    },
    entende: {
      queEs: "Cómo Windows mide el impacto de inicio (Bajo, Medio, Alto) analizando el tiempo de CPU y de I/O de disco durante el boot.",
      paraQueSirve: "Limpiar el inicio de la PC con criterio profesional sin romper funcionalidades esenciales.",
      quePasaSiFalta: "Arranques lentos y saturación innecesaria de la memoria RAM desde el primer minuto."
    },
    interactua: {
      cliExample: "wmic startup get caption,command,user",
      psExample: "Get-CimInstance Win32_StartupCommand | Select-Object Caption, Command, User | Format-Table -AutoSize",
      syntaxBreakdown: "Lista todas las entradas de inicio registradas en el sistema divididas por usuario y máquina.",
      whatToLookFor: "Programas de mensajería, juegos y utilitarios que pueden abrirse manualmente solo cuando vayas a usarlos.",
      technicalMetrics: "Tener más de 5 programas en inicio añade típicamente entre 800 MB y 2 GB de consumo de memoria base."
    },
    alertaEVO: {
      reversibilityRule: "Deshabilitar programas de inicio desde Task Manager es 100% reversible.",
      safetyWarning: "No deshabilites el driver de audio (Realtek HD Audio) ni el panel de control de tu GPU (NVIDIA/AMD)."
    },
    evidenceBadge: {
      code: "S36-START-15",
      label: "STARTUP-TRIMMED"
    }
  },
  {
    id: "inv-36-16",
    code: "36.16",
    title: "Services",
    subtitle: "Servicios de terceros retrasando el Service Control Manager (SCM)",
    targetMechanism: "Service Control Manager Sequential vs Parallel Dispatch",
    targetComponent: "services.exe / SCM Auto-Start Group Phasing",
    commandName: "sc query",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué el inicio de sesión de Windows a veces se queda en 'Espere...' con el círculo girando durante 40 segundos?",
      mythVsTruth: {
        mentira: "Windows está comprobando la contraseña del usuario con internet.",
        verdad: "El Service Control Manager está esperando el timeout de 30 segundos de un servicio de terceros que no respondió a tiempo a la señal de inicio.",
        comprobalo: "Busca en el Visor de Eventos el Event ID 7000 o 7011 de Service Control Manager: dirá exactamente qué servicio retrasó el arranque."
      }
    },
    entende: {
      queEs: "La arquitectura del despachador de servicios de Windows (SCM) y sus grupos de dependencia secuenciales.",
      paraQueSirve: "Identificar y configurar servicios conflictivos en modo 'Inicio retrasado' (Automatic Delayed Start).",
      quePasaSiFalta: "Demoras crónicas al encender o apagar el equipo."
    },
    interactua: {
      cliExample: "wevtutil qe System /q:\"*[System[Provider[@Name='Service Control Manager'] and (EventID=7000 or EventID=7011)]]\" /c:3 /rd:true /f:text",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Service Control Manager'; Id=7011} -MaxEvents 3",
      syntaxBreakdown: "Filtra los eventos 7011 que registran qué servicio agotó el tiempo de espera (30.000 ms) durante el inicio.",
      whatToLookFor: "Nombres de servicios de software de sincronización, VPNs o suites de optimización.",
      technicalMetrics: "El timeout por defecto del SCM es de 30 segundos (30.000 milisegundos)."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de visor de eventos inocua.",
      safetyWarning: "Cambia el inicio del servicio responsable a 'Inicio automático (retrasado)' en services.msc."
    },
    evidenceBadge: {
      code: "S36-SCM-16",
      label: "SCM-DELAY-FREE"
    }
  },
  {
    id: "inv-36-17",
    code: "36.17",
    title: "Tasks",
    subtitle: "Tareas programadas devorando CPU durante horas laborales",
    targetMechanism: "Task Scheduler Idle Triggers & Battery Conservation Bypasses",
    targetComponent: "schtasks.exe / Task Scheduler Service",
    commandName: "schtasks /query",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Estás trabajando tranquilamente y a las 11:30 AM la PC se pone pesada y lenta durante 5 minutos todos los días laborables. ¿Qué se dispara?",
      mythVsTruth: {
        mentira: "Es un pico de calor del mediodía en la habitación.",
        verdad: "Una tarea programada de mantenimiento, desfragmentación o telemetría se ejecuta a esa hora exacta sin comprobar si estás usando la PC.",
        comprobalo: "Consulta el Programador de Tareas y filtra por 'Última hora de ejecución': coincidirá al segundo con el momento de la lentitud."
      }
    },
    entende: {
      queEs: "La configuración de disparadores (triggers) y condiciones de inactividad (idle conditions) en el Programador de Tareas.",
      paraQueSirve: "Reprogramar tareas pesadas para la madrugada o configurarlas para que se detengan inmediatamente si el usuario mueve el ratón.",
      quePasaSiFalta: "Pérdida de fluidez en medio de presentaciones o llamadas de trabajo."
    },
    interactua: {
      cliExample: "schtasks /query /fo LIST /v | findstr /i \"TaskName LastRunTime Status\"",
      psExample: "Get-ScheduledTask | Where-Object { $_.State -eq 'Running' } | Select-Object TaskName, TaskPath",
      syntaxBreakdown: "Muestra qué tareas programadas se encuentran en estado 'Running' (en ejecución activa) en este preciso segundo.",
      whatToLookFor: "Tareas de indexación, sincronizaciones en la nube o escaneos automáticos de antivirus de terceros.",
      technicalMetrics: "Una tarea bien diseñada debe tener marcada la casilla 'Iniciar la tarea solo si el equipo está inactivo'."
    },
    alertaEVO: {
      reversibilityRule: "schtasks /query es de solo lectura.",
      safetyWarning: "No deshabilites tareas que estén dentro de la ruta \\Microsoft\\Windows\\UpdateOrchestrator o \\Defrag."
    },
    evidenceBadge: {
      code: "S36-SCHED-17",
      label: "TASK-OPTIMIZED"
    }
  },
  {
    id: "inv-36-18",
    code: "36.18",
    title: "Drivers",
    subtitle: "DPC/ISR latency provocada por drivers desactualizados y audio entrecortado",
    targetMechanism: "Deferred Procedure Call (DPC) & Interrupt Service Routine (ISR) Overhead",
    targetComponent: "hal.dll / ACPI.sys / ndis.sys / wdf01000.sys",
    commandName: "driverquery.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué cuando mueves el mouse o reproduces música en Spotify se escucha un crujido metálico (audio crackle) y el cursor da saltos?",
      mythVsTruth: {
        mentira: "La tarjeta de sonido o los auriculares están rotos físicamente.",
        verdad: "Un controlador de red o de energía tiene una latencia DPC tan alta que acapara el procesador e impide que el buffer de audio se llene a tiempo.",
        comprobalo: "Ejecuta LatencyMon durante 60 segundos: identificará con precisión el archivo .sys culpable (como storport.sys o ndis.sys)."
      }
    },
    entende: {
      queEs: "El modelo de interrupciones de Windows (ISR y DPC) y cómo un solo driver mal programado en Ring 0 puede congelar todo el equipo.",
      paraQueSirve: "Erradicar los tirones en juegos competitivos y la distorsión de audio en computadoras de producción musical o edición.",
      quePasaSiFalta: "Inutilidad del equipo para producción de audio en tiempo real o streaming."
    },
    interactua: {
      cliExample: "driverquery /v /fo TABLE | findstr /i \"storport ndis acpi\"",
      psExample: "Get-WmiObject Win32_PnPSignedDriver | Where-Object { $_.DeviceName -match 'Network|Audio|Storage' } | Select-Object DeviceName, DriverVersion, DriverDate",
      syntaxBreakdown: "Verifica las fechas de los controladores de red, audio y almacenamiento para detectar versiones obsoletas con bugs conocidos de DPC.",
      whatToLookFor: "Drivers con fechas de más de 3 años de antigüedad en hardware moderno.",
      technicalMetrics: "La latencia DPC debe mantenerse por debajo de 500 µs (microsegundos); si supera los 2.000 µs, se produce audio drop."
    },
    alertaEVO: {
      reversibilityRule: "driverquery es una herramienta de consulta.",
      safetyWarning: "Actualiza siempre los drivers desde el sitio oficial del fabricante del componente (Intel/Realtek/AMD/NVIDIA)."
    },
    evidenceBadge: {
      code: "S36-DPC-18",
      label: "DPC-LATENCY-OK"
    }
  },
  {
    id: "inv-36-19",
    code: "36.19",
    title: "Events",
    subtitle: "Event ID 7, 11 y 51 en Disk; Kernel-Power 41 y WHEA-Logger: La caja negra",
    targetMechanism: "Windows Event Subsystem Hardware Exception Logging",
    targetComponent: "wevtsvc / Event Viewer System Log / WHEA",
    commandName: "wevtutil.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Tu computadora se congela durante 10 segundos y luego vuelve a la normalidad sin decir nada. ¿Dónde anota Windows lo que acaba de pasar?",
      mythVsTruth: {
        mentira: "Si no salió una pantalla azul, Windows no sabe qué falló.",
        verdad: "Windows anota silenciosamente en el Visor de Eventos cada reintento de lectura de disco, caída de energía o error de hardware corregible.",
        comprobalo: "Abre el Visor de Eventos > Registros de Windows > Sistema y busca advertencias del origen 'Disk' o 'WHEA-Logger'."
      }
    },
    entende: {
      queEs: "Los códigos de evento estándar de la industria que alertan sobre la muerte inminente de componentes físicos antes de que fallen por completo.",
      paraQueSirve: "Salvar los datos del usuario reemplazando un SSD o cable SATA antes de que la unidad quede inaccesible de forma irreversible.",
      quePasaSiFalta: "Pérdida catastrófica de información sin aviso previo."
    },
    interactua: {
      cliExample: "wevtutil qe System /q:\"*[System[Level=2 or Level=3]]\" /c:5 /rd:true /f:text",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='System'; Level=2,3; StartTime=(Get-Date).AddDays(-3)} -MaxEvents 10 | Select-Object TimeCreated, ProviderName, Id, Message",
      syntaxBreakdown: "Extrae los últimos errores (Nivel 2) y advertencias (Nivel 3) críticos del registro del sistema de los últimos 3 días.",
      whatToLookFor: "Event ID 7 (bloque defectuoso en disco), Event ID 11 (error de controlador en unidad), WHEA Event 17 (error de bus PCIe).",
      technicalMetrics: "Un Event ID 7 repetido indica que el disco está reasignando sectores dañados a nivel de hardware."
    },
    alertaEVO: {
      reversibilityRule: "wevtutil qe es una consulta segura de eventos.",
      safetyWarning: "Si ves Event ID 7 repetido en el disco del sistema, realiza una copia de seguridad inmediata de tus archivos personales."
    },
    evidenceBadge: {
      code: "S36-EVT-19",
      label: "EVENTS-AUDITED"
    }
  },
  {
    id: "inv-36-20",
    code: "36.20",
    title: "Low resource PC",
    subtitle: "Perfilado técnico de hardware modesto: Qué exigir y qué apagar con criterio",
    targetMechanism: "OS Footprint Tuning for Low-Spec Architectures",
    targetComponent: "System Properties / Visual Effects / DWM / Memory Footprint",
    commandName: "SystemPropertiesPerformance.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo hacer que una laptop antigua con procesador Celeron o Athlon sea perfectamente utilizable para estudiar y navegar hoy en día?",
      mythVsTruth: {
        mentira: "Las computadoras baratas o viejas son inservibles con Windows 10 u 11.",
        verdad: "Ajustando efectos visuales, limitando procesos de fondo y optimizando la compresión de memoria, pueden ser equipos ágiles de oficina.",
        comprobalo: "Desactiva las animaciones y sombras en Efectos Visuales: la latencia de respuesta de las ventanas se reduce a cero."
      }
    },
    entende: {
      queEs: "El protocolo de adaptación de Windows para procesadores de 2 a 4 núcleos lentos y poca memoria.",
      paraQueSirve: "Dar una segunda vida útil a computadoras escolares, de oficina modesta o de uso básico.",
      quePasaSiFalta: "Gasto innecesario de dinero renovando equipos que aún pueden cumplir su función con el perfilado correcto."
    },
    interactua: {
      cliExample: "reg query \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects\"",
      psExample: "Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed",
      syntaxBreakdown: "Evalúa la topología del procesador para determinar si califica como equipo de bajos recursos y amerita perfilado liviano.",
      whatToLookFor: "CPUs con menos de 4 núcleos lógicos o frecuencias base menores a 2.0 GHz.",
      technicalMetrics: "Desactivar animaciones de ventana ahorra memoria en la GPU integrada y elimina el lag de composición del DWM."
    },
    alertaEVO: {
      reversibilityRule: "Los efectos visuales se configuran en SystemPropertiesPerformance.exe.",
      safetyWarning: "No desactives 'Suavizar bordes para las fuentes de pantalla'; los textos se verán pixelados y causarán fatiga visual."
    },
    evidenceBadge: {
      code: "S36-LOW-20",
      label: "LOWSPEC-TUNED"
    }
  },
  {
    id: "inv-36-21",
    code: "36.21",
    title: "4 GB",
    subtitle: "El límite operativo crítico: Paginación agresiva, zRAM y Compact OS",
    targetMechanism: "Memory Compression & Compact OS Binary De-duplication",
    targetComponent: "Compact.exe / Memory Compression Store",
    commandName: "compact.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Cómo sobrevive Windows 10 u 11 en una máquina con solo 4 GB de memoria RAM sin colapsar por completo?",
      mythVsTruth: {
        mentira: "Con 4 GB de RAM es imposible abrir Chrome y Word al mismo tiempo.",
        verdad: "Windows utiliza compresión de memoria en RAM (algoritmo XPRESS) y Compact OS para comprimir los archivos del sistema al 50%.",
        comprobalo: "Ejecuta 'compact.exe /compactos:query' en la consola para ver si el sistema operativo tiene la compresión transparente activa."
      }
    },
    entende: {
      queEs: "Las tecnologías nativas de compresión transparente que permiten a Windows ejecutarse en hardware embebido y laptops de bajo costo.",
      paraQueSirve: "Liberar entre 4 y 8 GB de almacenamiento y reducir la huella de memoria en equipos con 4 GB de RAM soldados.",
      quePasaSiFalta: "Saturación instantánea de memoria y cuelgues continuos en navegación web."
    },
    interactua: {
      cliExample: "compact.exe /compactos:query",
      psExample: "Get-Process -Name 'Memory Compression' | Select-Object Id, WorkingSet64",
      syntaxBreakdown: "Consulta el estado de Compact OS y mide el tamaño del proceso de compresión de memoria en segundo plano.",
      whatToLookFor: "Estado 'El sistema está en el estado compacto' para ahorrar espacio en discos eMMC pequeños.",
      technicalMetrics: "La compresión de memoria reduce páginas de 4 KB a menos de 2 KB en RAM antes de enviarlas al disco."
    },
    alertaEVO: {
      reversibilityRule: "Para activar Compact OS de forma segura: compact.exe /compactos:always",
      safetyWarning: "No uses más de 3 pestañas de navegador simultáneas en equipos de 4 GB sin habilitar la suspensión de pestañas."
    },
    evidenceBadge: {
      code: "S36-4GB-21",
      label: "4GB-OPTIMIZED"
    }
  },
  {
    id: "inv-36-22",
    code: "36.22",
    title: "8 GB",
    subtitle: "El punto de equilibrio moderno: Gestión de navegador multihilo y swap",
    targetMechanism: "Browser Multi-Process Sandboxing & Dual-Channel Memory Topology",
    targetComponent: "Chromium Architecture / Tab Discarding / Pagefile Management",
    commandName: "wmic memorychip get",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Tienes 8 GB de RAM y sientes que tu PC se arrastra. ¿Sabías que tener 1 módulo de 8 GB rinde hasta un 40% menos que tener 2 módulos de 4 GB?",
      mythVsTruth: {
        mentira: "La cantidad de gigabytes de RAM es lo único que importa en el rendimiento de la memoria.",
        verdad: "Tener la memoria en Single Channel (un solo módulo) reduce el ancho de banda a la mitad en comparación con Dual Channel (dos módulos).",
        comprobalo: "Usa CPU-Z o el comando WMI: si 'Channel' dice 'Single', tu procesador y tu gráfica integrada están recibiendo la mitad de datos por ciclo de reloj."
      }
    },
    entende: {
      queEs: "La arquitectura de doble canal (Dual Channel) de los controladores de memoria integrados en el procesador.",
      paraQueSirve: "Duplicar el ancho de banda de comunicación entre la CPU y la RAM de 64 bits a 128 bits de bus.",
      quePasaSiFalta: "Tirones en juegos y menor velocidad en multitarea pesada."
    },
    interactua: {
      cliExample: "wmic memorychip get banklabel,capacity,devicelocator,speed",
      psExample: "Get-CimInstance Win32_PhysicalMemory | Select-Object DeviceLocator, Capacity, Speed, Manufacturer",
      syntaxBreakdown: "Enumera cada zócalo físico de memoria de la placa base para comprobar si hay uno o dos módulos instalados.",
      whatToLookFor: "Comprueba si hay 2 zócalos poblados para garantizar que Dual Channel esté activo.",
      technicalMetrics: "Dual Channel eleva el ancho de banda teórico de DDR4-3200 de 25.6 GB/s a 51.2 GB/s."
    },
    alertaEVO: {
      reversibilityRule: "wmic memorychip get es de solo lectura.",
      safetyWarning: "Al agregar un segundo módulo de RAM, asegúrate de que tenga la misma frecuencia y latencia que el original."
    },
    evidenceBadge: {
      code: "S36-8GB-22",
      label: "DUAL-CHANNEL-OK"
    }
  },
  {
    id: "inv-36-23",
    code: "36.23",
    title: "HDD",
    subtitle: "El cuello de botella supremo: La incompatibilidad física de 5400/7200 RPM con NT moderno",
    targetMechanism: "Mechanical Disk Head Seek Latency & Telemetry I/O Overload",
    targetComponent: "Mechanical Hard Drive / Actuator Arm / Sector Access Time",
    commandName: "fsutil fsinfo sectorinfo",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué un disco mecánico de 1 TB que andaba perfecto en Windows 7 se vuelve insoportablemente lento al ponerle Windows 10 u 11?",
      mythVsTruth: {
        mentira: "El disco duro mecánico se dañó al cambiar el sistema operativo.",
        verdad: "Windows 10/11 realiza cientos de lecturas/escrituras en paralelo simultáneas (telemetría, índices, Defender) que saturan físicamente el cabezal del HDD.",
        comprobalo: "Un cabezal mecánico tarda 12 ms en moverse físicamente a una pista; ante 50 peticiones simultáneas, la latencia se dispara a segundos."
      }
    },
    entende: {
      queEs: "La limitación mecánica insalvable de los discos rígidos tradicionales frente a las demandas de concurrencia de los sistemas operativos modernos.",
      paraQueSirve: "Dejar de buscar 'optimizaciones mágicas' en un HDD y entender que el cambio a SSD es una necesidad física de arquitectura.",
      quePasaSiFalta: "Horas perdidas desfragmentando o formateando un disco que seguirá estando al 100% de uso continuo."
    },
    interactua: {
      cliExample: "fsutil fsinfo sectorinfo C:",
      psExample: "Get-PhysicalDisk | Select-Object FriendlyName, MediaType, SpindleSpeed, Size",
      syntaxBreakdown: "Obtiene la información de los sectores físicos del disco y la velocidad de rotación en revoluciones por minuto (SpindleSpeed).",
      whatToLookFor: "MediaType = 'HDD' o SpindleSpeed = 5400/7200 RPM como unidad de sistema C:.",
      technicalMetrics: "Un HDD promedio alcanza 100 IOPS; un SSD SATA alcanza 90.000 IOPS; un SSD NVMe alcanza más de 600.000 IOPS."
    },
    alertaEVO: {
      reversibilityRule: "fsutil fsinfo sectorinfo es puramente informativo.",
      safetyWarning: "No uses un HDD mecánico para el sistema operativo; resérvalo exclusivamente para almacenamiento secundario de archivos masivos o backups."
    },
    evidenceBadge: {
      code: "S36-HDD-23",
      label: "HDD-PHYSICS"
    }
  },
  {
    id: "inv-36-24",
    code: "36.24",
    title: "SSD pequeño",
    subtitle: "Degradación por celda saturada (>85% de capacidad), DRAM-less latency y HMB",
    targetMechanism: "SSD Write Amplification Factor (WAF) & DRAM-less Host Memory Buffer",
    targetComponent: "NVMe Controller / Flash Translation Layer (FTL) / Over-Provisioning",
    commandName: "defrag.exe /O",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Tu SSD volaba cuando era nuevo, pero ahora que le quedan 5 GB libres se comporta casi tan lento como un viejo disco mecánico. ¿Por qué?",
      mythVsTruth: {
        mentira: "Los SSDs rinden exactamente a la misma velocidad sin importar qué tan llenos estén.",
        verdad: "Al superar el 85% de capacidad, el controlador del SSD se queda sin bloques libres para recolección de basura (Garbage Collection), disparando la amplificación de escritura.",
        comprobalo: "Deja al menos un 15% a 20% de espacio libre en tu SSD y ejecuta un benchmark de escritura: la velocidad se recuperará de inmediato."
      }
    },
    entende: {
      queEs: "El funcionamiento interno de la capa de traducción flash (FTL) y el impacto del sobreaprovisionamiento (Over-Provisioning) en unidades de estado sólido.",
      paraQueSirve: "Mantener la velocidad máxima de lectura y escritura del SSD durante toda su vida útil sin desgastar las celdas de silicio.",
      quePasaSiFalta: "Caídas violentas de rendimiento y agotamiento prematuro de los ciclos de escritura de la memoria NAND."
    },
    interactua: {
      cliExample: "defrag.exe C: /O",
      psExample: "Optimize-Volume -DriveLetter C -ReTrim -Verbose",
      syntaxBreakdown: "Ejecuta el comando oficial de optimización de Windows enviando la instrucción TRIM al SSD para que limpie bloques marcados.",
      whatToLookFor: "Mensaje 'Se completó la operación de recorte en el volumen C:' con 100% de éxito.",
      technicalMetrics: "Las unidades SSD económicas 'DRAM-less' usan HMB (Host Memory Buffer) tomando 64 MB de tu memoria RAM para mapear la tabla FTL."
    },
    alertaEVO: {
      reversibilityRule: "Optimize-Volume -ReTrim es seguro y recomendado mensualmente.",
      safetyWarning: "NUNCA desfragmentes un SSD tradicionalmente con métodos de reordenamiento de bloques; desgasta las celdas sin ningún beneficio."
    },
    evidenceBadge: {
      code: "S36-SSD-24",
      label: "TRIM-VERIFIED"
    }
  },
  {
    id: "inv-36-25",
    code: "36.25",
    title: "iGPU",
    subtitle: "El impacto del ancho de banda de memoria compartida Single vs Dual Channel en gráficos integrados",
    targetMechanism: "Integrated GPU Unified Memory Architecture & Bandwidth Starvation",
    targetComponent: "Intel Iris Xe / AMD Radeon Vega/RDNA / UMA VRAM",
    commandName: "wmic path Win32_VideoController get",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué dos laptops con el mismo procesador Ryzen 5 o Core i5 tienen una diferencia de rendimiento del 50% en juegos como Valorant o CS2?",
      mythVsTruth: {
        mentira: "Una laptop vino con una gráfica integrada de mejor calidad que la otra.",
        verdad: "Una tiene memoria en Dual Channel y la otra en Single Channel; la gráfica integrada depende al 100% del ancho de banda de la RAM del sistema.",
        comprobalo: "Agrega un segundo módulo de RAM a una laptop con gráfica integrada: los FPS en juegos aumentarán de inmediato entre un 35% y un 60%."
      }
    },
    entende: {
      queEs: "La arquitectura de memoria unificada (UMA) donde la GPU no tiene memoria VRAM propia y compite con la CPU por el bus de la memoria RAM principal.",
      paraQueSirve: "Conseguir un salto gigantesco de rendimiento gráfico sin gastar cientos de dólares en una tarjeta de video dedicada.",
      quePasaSiFalta: "Rendimiento gráfico deficiente y tirones continuos en tareas de renderizado o videojuegos."
    },
    interactua: {
      cliExample: "wmic path Win32_VideoController get name,adapterram,driverversion",
      psExample: "Get-CimInstance Win32_VideoController | Where-Object { $_.Name -match 'Intel|AMD|Radeon' } | Select-Object Name, VideoProcessor, DriverVersion",
      syntaxBreakdown: "Consulta el modelo exacto del procesador gráfico integrado y la versión del controlador de pantalla instalado.",
      whatToLookFor: "Modelos Intel UHD / Iris Xe o AMD Radeon Graphics configurados como adaptadores primarios.",
      technicalMetrics: "Una gráfica integrada en Single Channel DDR4 tiene un ancho de banda de 21 GB/s; en Dual Channel sube a 42 GB/s, duplicando el fillrate de texturas."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de adaptadores gráficos inocua.",
      safetyWarning: "En motherboards con BIOS avanzada, puedes asignar 2 GB o 4 GB de UMA Frame Buffer para evitar problemas de compatibilidad con juegos antiguos."
    },
    evidenceBadge: {
      code: "S36-IGPU-25",
      label: "IGPU-DUALCHAN"
    }
  },
  {
    id: "inv-36-26",
    code: "36.26",
    title: "Qué actualización realmente conviene",
    subtitle: "El árbol de decisiones de inversión técnica: SSD vs RAM vs CPU vs GPU",
    targetMechanism: "Hardware Cost-to-Performance ROI & Bottleneck Decision Tree",
    targetComponent: "Full System Hardware Topology & Upgrade Matrix",
    commandName: "systeminfo.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Tienes un presupuesto limitado de 50 o 100 dólares. ¿Comprar más RAM, cambiar el disco por un SSD, o ahorrar para una placa de video?",
      mythVsTruth: {
        mentira: "Ponerle más memoria RAM a una computadora siempre la hace más rápida.",
        verdad: "Si tienes un disco mecánico HDD, ponerle 32 GB de RAM seguirá haciendo que la PC se sienta lenta; la prioridad número 1 es siempre el SSD.",
        comprobalo: "Sigue la jerarquía empírica EVO: 1° SSD > 2° Dual Channel RAM (mínimo 16 GB) > 3° GPU dedicada > 4° Cambio de plataforma CPU."
      }
    },
    entende: {
      queEs: "La matriz pericial de retorno de inversión (ROI) que maximiza la fluidez percibida por el usuario con el menor costo monetario posible.",
      paraQueSirve: "Asesorar a clientes y amigos como un verdadero ingeniero de hardware, evitando gastos inútiles en componentes que no resolverán el cuello de botella.",
      quePasaSiFalta: "El usuario gasta dinero en el componente equivocado y se frustra al ver que su computadora sigue exactamente igual de lenta."
    },
    interactua: {
      cliExample: "systeminfo | findstr /i \"procesador memoria\"",
      psExample: "[PSCustomObject]@{ CPU=(Get-CimInstance Win32_Processor).Name; RAM_GB=[math]::Round((Get-CimInstance Win32_OperatingSystem).TotalVisibleMemorySize/1MB,1); Disco=(Get-PhysicalDisk | Select-Object -First 1 MediaType).MediaType }",
      syntaxBreakdown: "Genera en un solo comando el resumen ejecutivo de la tríada de hardware (CPU, RAM y Tipo de Disco) para aplicar el árbol de decisiones.",
      whatToLookFor: "Si Disco = 'HDD', la recomendación indiscutible es SSD. Si RAM < 8 GB, la recomendación es llevar a 16 GB en Dual Channel.",
      technicalMetrics: "El paso de HDD a SSD reduce los tiempos de acceso de 12.000 µs a 50 µs (un salto de 240 veces en velocidad de respuesta)."
    },
    alertaEVO: {
      reversibilityRule: "systeminfo es una herramienta de auditoría pasiva.",
      safetyWarning: "Nunca recomiendes cambiar de CPU o motherboard antes de haber migrado la unidad de sistema a un SSD NVMe o SATA de calidad comprobada."
    },
    evidenceBadge: {
      code: "S36-ROI-26",
      label: "UPGRADE-MATRIX"
    }
  }
];

export const SECTOR_36_MINICASES: Sector36MiniCase[] = [
  {
    id: "case-36-01",
    code: "MC-36.01",
    title: "El misterio del disco al 100% que paralizaba una oficina",
    scenario: "En una oficina contable, tres computadoras con procesadores Intel Core i5 de 10ma generación y 8 GB de RAM tardan 25 minutos en encender y abrir Excel. El Administrador de Tareas muestra 'Disco 0: 100%' de forma ininterrumpida. El técnico anterior les cobró un formateo de Windows y la lentitud regresó a los dos días.",
    userStatement: "Gastamos dinero formateando las computadoras y siguen igual de lentas. Dicen que Windows 11 no sirve para nuestra oficina.",
    initialMistake: "Formatear el sistema operativo sin analizar que las máquinas tenían discos rígidos mecánicos Seagate de 1 TB a 5400 RPM como unidad de arranque.",
    diagnosticQuestion: "¿Cuál es el diagnóstico de ingeniería exacto y la única solución definitiva?",
    options: [
      {
        id: "opt-1",
        text: "Deshabilitar las actualizaciones de Windows Update y el antivirus Windows Defender permanentemente.",
        isCorrect: false,
        explanation: "Desproteger el sistema ante ciberataques para mitigar un cuello de botella de hardware es una negligencia profesional inaceptable."
      },
      {
        id: "opt-2",
        text: "Clonar las unidades a discos SSD SATA o NVMe de 500 GB; el cuello de botella es la latencia física de búsqueda del cabezal mecánico del HDD ante las peticiones concurrentes de Windows 10/11.",
        isCorrect: true,
        explanation: "Un HDD solo entrega 80-100 IOPS, mientras que Windows moderno requiere miles de operaciones por segundo. Un SSD entrega más de 90.000 IOPS, reduciendo el arranque de 25 minutos a 15 segundos."
      },
      {
        id: "opt-3",
        text: "Aumentar la memoria RAM a 32 GB en cada equipo para que el disco ya no trabaje.",
        isCorrect: false,
        explanation: "Con 8 GB de RAM para Excel y navegación básica no hay falta de memoria; el disco seguiría saturado al 100% cargando librerías de inicio y servicios."
      }
    ],
    technicalVerdict: "El cuello de botella supremo era el almacenamiento mecánico (HDD). Tras migrar a SSDs, el uso de disco cayó al 1% en reposo y el arranque se redujo a 12 segundos.",
    lessonLearned: "Nunca formatees una PC con disco al 100% sin antes verificar si tiene un HDD. La física de un cabezal mecánico no se puede solucionar con software."
  },
  {
    id: "case-36-02",
    code: "MC-36.02",
    title: "La laptop gamer que rinde como una PC de oficina a 0.79 GHz",
    scenario: "Un estudiante universitario compró una laptop con procesador Intel Core i7 y tarjeta gráfica RTX 3060. Al cabo de 8 meses de uso, los juegos pasaron de rendir a 140 FPS a arrastrarse a 15 FPS. El Administrador de Tareas muestra la velocidad del procesador clavada en '0.79 GHz' y no sube ni siquiera al abrir un juego.",
    userStatement: "Mi laptop se rompió por dentro, no pasa de 0.79 GHz aunque la ponga en modo máximo rendimiento.",
    initialMistake: "Tocar el registro con scripts de 'CPU Unpark' o sospechar de un virus en Windows.",
    diagnosticQuestion: "¿Qué fenómeno físico de protección térmica se activó y qué procedimiento se debe aplicar?",
    options: [
      {
        id: "opt-1",
        text: "Desactivar el sensor PROCHOT con herramientas no oficiales para forzar al procesador a trabajar a 4 GHz.",
        isCorrect: false,
        explanation: "Desactivar la protección térmica cuando el disipador está tapado provocará la destrucción del chip por calor extremo."
      },
      {
        id: "opt-2",
        text: "Limpiar la pelusa y polvo del radiador del disipador de cobre y renovar la pasta térmica cristalizada; el procesador activó thermal throttling de emergencia por alcanzar TJMax (100°C).",
        isCorrect: true,
        explanation: "Al taparse las aletas del radiador con polvo, el procesador alcanza 100°C en segundos y el firmware de Intel bloquea el multiplicador en x8 (800 MHz / 0.79 GHz) para evitar quemarse."
      },
      {
        id: "opt-3",
        text: "Comprar una base con ventiladores USB para ponerla debajo de la laptop.",
        isCorrect: false,
        explanation: "Una base externa no puede empujar aire si la tobera interna de cobre está bloqueada por una pared sólida de pelusa y polvo."
      }
    ],
    technicalVerdict: "El equipo sufría 'Thermal Throttling' severo. La pasta térmica estaba deshidratada y la tobera de ventilación bloqueada al 90%. Tras el mantenimiento físico, el reloj volvió a 4.2 GHz Turbo.",
    lessonLearned: "El síntoma de CPU clavada en 0.79 GHz es la firma indiscutible de estrangulamiento térmico por suciedad o falla del ventilador."
  },
  {
    id: "case-36-03",
    code: "MC-36.03",
    title: "La actualización trampa: Comprar 16 GB de RAM en una PC que necesitaba SSD",
    scenario: "Un usuario gastó sus ahorros en comprar un kit de 16 GB de RAM para su PC con procesador AMD Ryzen 3 y disco rígido de 1 TB, porque en redes sociales le dijeron que 'la RAM hace volar a la computadora'. Tras instalar los módulos, la PC sigue tardando exactamente lo mismo en arrancar y abrir programas.",
    userStatement: "Compré 16 GB de RAM nueva de marca cara y mi computadora sigue andando exactamente igual de lenta. ¿Me estafaron en la tienda?",
    initialMistake: "Asumir que más memoria RAM soluciona un cuello de botella de almacenamiento o velocidad de procesador.",
    diagnosticQuestion: "¿Cuál es la explicación técnica rigurosa y qué actualización debió realizarse en primer lugar?",
    options: [
      {
        id: "opt-1",
        text: "La memoria RAM no estaba rota ni hubo estafa; la RAM es espacio de trabajo, no velocidad de lectura. La inversión debió ser un SSD NVMe de 500 GB (que costaba la mitad) para eliminar el cuello de botella del disco.",
        isCorrect: true,
        explanation: "Tener más RAM solo sirve si la memoria anterior se saturaba al 100%. Si el sistema tiene 4 u 8 GB pero solo usa 5 GB, agregar 16 GB adicionales deja la memoria sin usar mientras el disco HDD sigue siendo el cuello de botella."
      },
      {
        id: "opt-2",
        text: "Hay que comprar otros 16 GB más para llegar a 32 GB y que Windows active el modo rápido.",
        isCorrect: false,
        explanation: "Gastar más dinero en RAM mantendría el 80% de la memoria vacía sin solucionar el problema del disco mecánico."
      },
      {
        id: "opt-3",
        text: "La memoria vino configurada a 2133 MHz y hay que overclockearla a 4000 MHz para que la PC arranque rápido.",
        isCorrect: false,
        explanation: "La frecuencia de la RAM no acorta los tiempos de arranque mecánicos de un disco rígido tradicional."
      }
    ],
    technicalVerdict: "El usuario sufrió el clásico error de inversión desbalanceada. Con la mitad de ese presupuesto en un SSD, la velocidad percibida de la PC se hubiera multiplicado por 10.",
    lessonLearned: "La regla de oro del upgrade: La jerarquía de inversión es 1° SSD, 2° RAM en Dual Channel, 3° GPU, 4° CPU. Nunca agregues RAM si la unidad principal sigue siendo un HDD."
  }
];

export const SECTOR_36_TEST_BANK: Sector36TestQuestion[] = [
  {
    id: "test-36-01",
    questionNumber: 1,
    category: "Métricas de Disco",
    question: "¿Qué valor en el contador 'Avg. Disk sec/Transfer' del Monitor de Rendimiento indica que el almacenamiento es el cuello de botella causante de la lentitud de la PC?",
    options: [
      { id: "a", text: "Menor a 0.001 segundos (1 milisegundo)" },
      { id: "b", text: "Exactamente 0.005 segundos (5 milisegundos)" },
      { id: "c", text: "Mayor a 0.050 segundos (50 milisegundos) de forma sostenida" },
      { id: "d", text: "Cero absoluto en todo momento" }
    ],
    correctOptionId: "c",
    technicalExplanation: "En almacenamiento, cualquier tiempo de respuesta sostenido por encima de 20 a 50 ms genera lentitud palpable para el usuario. En discos HDD colapsados, este contador suele llegar a 3.000 ms (3 segundos por cada petición de lectura)."
  },
  {
    id: "test-36-02",
    questionNumber: 2,
    category: "Protección Térmica",
    question: "¿Qué síntoma inconfundible en el Administrador de Tareas indica que un procesador moderno está sufriendo estrangulamiento térmico severo (Thermal Throttling)?",
    options: [
      { id: "a", text: "La velocidad de reloj se clava en el multiplicador mínimo de seguridad (típicamente 0.79 GHz o 800 MHz) sin subir bajo carga." },
      { id: "b", text: "El uso de memoria RAM se pone al 100% automáticamente." },
      { id: "c", text: "La tarjeta de red se desconecta de internet." },
      { id: "d", text: "El cursor del mouse cambia de color blanco a negro." }
    ],
    correctOptionId: "a",
    technicalExplanation: "Al activarse la señal PROCHOT por alcanzar la temperatura máxima de unión (TJMax), el hardware reduce el multiplicador de la CPU a x8 (800 MHz / 0.79 GHz) para reducir la disipación térmica y evitar daños permanentes en el silicio."
  },
  {
    id: "test-36-03",
    questionNumber: 3,
    category: "Topología de Memoria",
    question: "¿Por qué una computadora con tarjeta gráfica integrada (iGPU) experimenta una ganancia de rendimiento del 30% al 50% al instalar dos módulos de RAM idénticos en lugar de uno solo?",
    options: [
      { id: "a", text: "Porque se duplica la cantidad de núcleos físicos del procesador." },
      { id: "b", text: "Porque la memoria se configura en Dual Channel, duplicando el ancho de banda del bus de 64 bits a 128 bits para alimentar a la gráfica integrada." },
      { id: "c", text: "Porque Windows descarga controladores gráficos especiales para dos memorias." },
      { id: "d", text: "Porque la fuente de alimentación entrega el doble de voltaje a la placa base." }
    ],
    correctOptionId: "b",
    technicalExplanation: "Las gráficas integradas carecen de memoria VRAM dedicada y dependen enteramente de la memoria RAM del sistema. Dual Channel duplica el ancho de banda de comunicación de datos, eliminando el severo estrangulamiento de llenado de texturas de la GPU."
  },
  {
    id: "test-36-04",
    questionNumber: 4,
    category: "Fugas de Memoria de Kernel",
    question: "¿Qué métrica en el Administrador de Tareas revela que un controlador defectuoso tiene una fuga de memoria (Memory Leak) irreversible que no se libera hasta reiniciar el equipo?",
    options: [
      { id: "a", text: "La memoria en 'Caché' llega a 4 GB." },
      { id: "b", text: "El 'Grupo no paginado' (Non-Paged Pool) supera los 1.5 GB o 2.0 GB de forma continua." },
      { id: "c", text: "El uso de CPU está en 0% durante 10 minutos." },
      { id: "d", text: "El archivo de paginación se encuentra activo en el disco C:." }
    ],
    correctOptionId: "b",
    technicalExplanation: "El Non-Paged Pool almacena estructuras críticas de drivers que jamás pueden enviarse al archivo de paginación. Un driver con fuga acumula memoria en este grupo sin liberarla, robando memoria física hasta que el sistema colapsa."
  },
  {
    id: "test-36-05",
    questionNumber: 5,
    category: "Jerarquía de Actualización",
    question: "¿Cuál es la jerarquía de inversión técnica óptima (ROI) ante una computadora lenta de uso general con presupuesto limitado?",
    options: [
      { id: "a", text: "1° Cambiar placa de video -> 2° Cambiar procesador -> 3° Poner más RAM -> 4° Cambiar disco" },
      { id: "b", text: "1° Cambiar HDD por SSD -> 2° Asegurar RAM Dual Channel (mín. 16 GB) -> 3° GPU dedicada -> 4° Plataforma CPU" },
      { id: "c", text: "1° Comprar 64 GB de RAM -> 2° Cambiar la fuente de alimentación -> 3° Formatear" },
      { id: "d", text: "1° Instalar tres optimizadores comerciales -> 2° Cambiar pasta térmica -> 3° Overclockear" }
    ],
    correctOptionId: "b",
    technicalExplanation: "El cambio de HDD mecánico a SSD es el salto de rendimiento más colosal que existe (más de 200 veces más rápido en tiempo de acceso). Seguido por el ancho de banda de Dual Channel en RAM, esta jerarquía maximiza el beneficio con la menor inversión económica."
  }
];
