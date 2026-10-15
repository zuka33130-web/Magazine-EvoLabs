// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 37: BASE DE PROBLEMAS RESUELTOS
// "Biblioteca viva de expedientes periciales con metodología empírica"

export type RiskLevelSector37 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector37Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector37;
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

export interface Sector37MiniCase {
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

export interface Sector37TestQuestion {
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

export const SECTOR_37_INVESTIGATIONS: Sector37Investigation[] = [
  {
    id: "inv-37-01",
    code: "37.01",
    title: "Expediente Boot: Recuperación BCD 0xc000000e UEFI",
    subtitle: "Reconstrucción pericial del almacén BCD y partición ESP corrupta",
    targetMechanism: "UEFI Boot Configuration Data (BCD) & NVRAM Bootmgr",
    targetComponent: "bootrec.exe / bcdboot.exe / ESP FAT32",
    commandName: "bcdboot C:\\Windows /s S: /f UEFI",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "El error 0xc000000e no significa que Windows esté destruido: solo indica que el puntero NVRAM o el archivo \\EFI\\Microsoft\\Boot\\BCD perdió la referencia al GUID del volumen del SO.",
      mythVsTruth: {
        mentira: "Cuando sale 0xc000000e la única solución limpia es formatear e instalar desde cero.",
        verdad: "Reasignar letra a la partición ESP (100-260 MB FAT32) y regenerar el store con bcdboot toma 30 segundos y conserva intacto todo el sistema.",
        comprobalo: "Arranca en WinRE, ejecuta `diskpart`, selecciona el volumen FAT32 oculto, asígnale letra S: y ejecuta `bcdboot C:\\Windows /s S: /f UEFI`."
      }
    },
    entende: {
      queEs: "El protocolo de reconstrucción del firmware UEFI y punteros del Boot Manager cuando falló una migración de disco o clonación sin regenerar firmas BCD.",
      paraQueSirve: "Restablecer el inicio en modo UEFI sin tocar los archivos de usuario ni alterar el registro de Windows.",
      quePasaSiFalta: "Se formatea innecesariamente perdiendo configuraciones y claves de cifrado BitLocker."
    },
    interactua: {
      cliExample: "bcdboot C:\\Windows /s S: /f UEFI /v",
      psExample: "Get-Partition | Where-Object { $_.GptType -eq '{c12a7328-f81f-11d2-ba4b-00a0c93ec93b}' } | Select-Object DiskNumber, PartitionNumber, Size",
      syntaxBreakdown: "bcdboot inyecta los binarios bootmgfw.efi en el volumen ESP (S:) y genera un BCD nuevo con el bootloader apuntando a C:\\Windows.",
      whatToLookFor: "Mensaje 'Boot files successfully created'.",
      technicalMetrics: "Partición ESP tipo GPT GUID c12a7328-f81f-11d2-ba4b-00a0c93ec93b."
    },
    alertaEVO: {
      reversibilityRule: "Se puede respaldar el store BCD existente con `bcdedit /export C:\\bcd_backup` antes de regenerar.",
      safetyWarning: "Verifica que el volumen sea FAT32 y no la partición MSR reservada de 16MB antes de formatear la ESP."
    },
    evidenceBadge: {
      code: "EVO-CASE-3701",
      label: "UEFI BCD Restoration"
    }
  },
  {
    id: "inv-37-02",
    code: "37.02",
    title: "Expediente Update: Error 0x80070002 en SoftwareDistribution",
    subtitle: "Limpieza atómica de metadatos corruptos y reset del Agente WUA",
    targetMechanism: "Windows Update Agent (WUA) & Datastore ESE Database",
    targetComponent: "DataStore.edb / wuauserv / cryptsvc / bits",
    commandName: "net stop wuauserv & ren SoftwareDistribution SoftwareDistribution.old",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "¿Sabías que 0x80070002 es literalmente ERROR_FILE_NOT_FOUND originado cuando el catálogo ESE de SoftwareDistribution pierde un hash intermedio?",
      mythVsTruth: {
        mentira: "El solucionador de problemas de Windows Update repara todas las bases de datos corruptas.",
        verdad: "El solucionador oficial rara vez purga DataStore.edb cuando la transacción quedó a mitad de escritura por apagón forzado.",
        comprobalo: "Detén wuauserv y cryptsvc, renombra SoftwareDistribution y al iniciar el servicio verás cómo Windows crea un árbol 100% íntegro."
      }
    },
    entende: {
      queEs: "Procedimiento de saneamiento del repositorio transaccional del servicio de actualizaciones de Windows.",
      paraQueSirve: "Destrabar loops de descarga infinita, firmas corruptas en paquetes .cab y parches atascados en 99%.",
      quePasaSiFalta: "Windows queda desprotegido sin poder recibir actualizaciones críticas de seguridad acumulativas."
    },
    interactua: {
      cliExample: "net stop wuauserv & net stop bits & net stop cryptsvc & ren %systemroot%\\SoftwareDistribution SD.old & net start wuauserv",
      psExample: "Stop-Service wuauserv, bits, cryptsvc -Force; Rename-Item -Path $env:windir\\SoftwareDistribution -NewName SoftwareDistribution.bak; Start-Service wuauserv",
      syntaxBreakdown: "Detiene los 3 servicios dependientes, libera los locks sobre DataStore.edb y fuerza la recreación limpia.",
      whatToLookFor: "En C:\\Windows se crea un nuevo directorio SoftwareDistribution con menos de 10 MB.",
      technicalMetrics: "Reducción de I/O de disco de 100% constante a 0% en idle tras liberar el loop de reintentos."
    },
    alertaEVO: {
      reversibilityRule: "La carpeta anterior se guarda como .old o .bak; el historial visual se reinicia pero los parches ya instalados no se desinstalan.",
      safetyWarning: "No elimines la carpeta Catroot2 si solo el problema es SoftwareDistribution; Catroot2 maneja firmas de drivers."
    },
    evidenceBadge: {
      code: "EVO-CASE-3702",
      label: "WUA Datastore Reset"
    }
  },
  {
    id: "inv-37-03",
    code: "37.03",
    title: "Expediente Driver: Pantalla azul DPC_WATCHDOG_VIOLATION por red",
    subtitle: "Depuración con WinDbg y resolución de contención en ndis.sys",
    targetMechanism: "Deferred Procedure Call (DPC) Queue & NDIS Miniport Driver",
    targetComponent: "ndis.sys / rt640x64.sys / DPC Watchdog Timer",
    commandName: "windbg -k / kd -y / analyze -v",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El BSOD DPC_WATCHDOG_VIOLATION ocurre cuando una rutina DPC de un driver excede los 20.000 microsegundos en la cola del procesador sin ceder el control.",
      mythVsTruth: {
        mentira: "DPC Watchdog Violation es un problema de disco duro o SSD dañado.",
        verdad: "En el 78% de los casos de telemetría es un driver de red Wi-Fi/Ethernet antiguo colgado en una interrupción ISR diferida.",
        comprobalo: "Abre el archivo MEMORY.DMP en WinDbg, corre `!analyze -v` y revisa el argumento 1: si es 1, un solo DPC superó el timeout."
      }
    },
    entende: {
      queEs: "Análisis pericial del crash dump del kernel mediante inspección de stack frames y temporizadores DPC.",
      paraQueSirve: "Identificar con precisión quirúrgica el binario .sys exacto culpable del cuelgue en vez de adivinar o formatear.",
      quePasaSiFalta: "El técnico cambia memoria RAM o cambia el disco cuando el problema era un driver de Realtek o Killer Network de 2020."
    },
    interactua: {
      cliExample: "kd -z C:\\Windows\\MEMORY.DMP -c \"!analyze -v; q\"",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-WER-SystemErrorReporting'} -MaxEvents 3 | Format-List",
      syntaxBreakdown: "Carga el crash dump en el kernel debugger y extrae la pila de llamadas del hilo que ejecutaba el DPC infractor.",
      whatToLookFor: "En FAILURE_BUCKET_ID o MODULE_NAME el nombre del archivo de driver de terceros (ej. rt640x64.sys).",
      technicalMetrics: "DPC single timeout threshold: 100 ticks de reloj (aprox. 15.6 ms)."
    },
    alertaEVO: {
      reversibilityRule: "La lectura del volcado es 100% pasiva y no altera ningún estado.",
      safetyWarning: "No reemplaces archivos .sys directamente en System32\\drivers; instala el instalador firmado por el fabricante (WHQL)."
    },
    evidenceBadge: {
      code: "EVO-CASE-3703",
      label: "Kernel Crash Forensics"
    }
  },
  {
    id: "inv-37-04",
    code: "37.04",
    title: "Expediente Disk: Unidad NVMe en 100% de activo sin I/O real",
    subtitle: "Bug de StorAHCI / StorNVMe y gestión de energía PCIe ASPM",
    targetMechanism: "PCIe Active State Power Management (ASPM) & Device Sleep (DevSleep)",
    targetComponent: "stornvme.sys / storahci.sys / MessageSignaledInterrupts",
    commandName: "powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS 0",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "¿Cómo puede el Administrador de Tareas reportar 100% de uso de disco mientras la velocidad de lectura y escritura marca 0 KB/s?",
      mythVsTruth: {
        mentira: "El SSD está roto y tiene celdas quemadas que congelan el bus.",
        verdad: "El SSD entró en un estado de bajo consumo PCIe L1 Substates del cual el controlador no pudo despertarlo a tiempo, congelando los comandos I/O.",
        comprobalo: "Desactiva 'PCI Express Link State Power Management' en las opciones de energía avanzadas y observa cómo el disco vuelve a 0% de inmediato."
      }
    },
    entende: {
      queEs: "Desajuste entre el firmware del controlador NVMe/SATA y el perfil de ahorro de energía del kernel de Windows.",
      paraQueSirve: "Eliminar microcongelamientos de 30 segundos donde el mouse se mueve pero ninguna app responde.",
      quePasaSiFalta: "El usuario asume que su laptop es inservible y gasta dinero cambiando un SSD que está en perfecto estado físico."
    },
    interactua: {
      cliExample: "powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS LINKSTATE 0 & powercfg /setactive SCHEME_CURRENT",
      psExample: "Get-CimInstance -Namespace root\\cimv2 -ClassName Win32_DiskDrive | Select-Object Model, InterfaceType, Status",
      syntaxBreakdown: "Deshabilita el apagado de enlaces PCIe en modo conectado a corriente en el plan de energía activo.",
      whatToLookFor: "En Task Manager: el tiempo activo cae de 100% a 1-3% inmediatamente.",
      technicalMetrics: "Promedio de tiempo de respuesta (Response Time) de disco cae de 12.000 ms a < 1.0 ms."
    },
    alertaEVO: {
      reversibilityRule: "Se puede volver a activar asignando el valor 1 (ahorro moderado) o 2 (ahorro máximo) con powercfg.",
      safetyWarning: "En laptops con batería esto puede aumentar el consumo en reposo en aproximadamente 0.3 a 0.5 Watts."
    },
    evidenceBadge: {
      code: "EVO-CASE-3704",
      label: "PCIe ASPM Resolution"
    }
  },
  {
    id: "inv-37-05",
    code: "37.05",
    title: "Expediente RAM: Memory leak en svchost (Network Service)",
    subtitle: "Rastreo de fuga de memoria con VMMap y pools de asignación de heaps",
    targetMechanism: "Heap Allocations & Private Bytes Leak in Service Host",
    targetComponent: "vmmap.exe / svchost.exe / tasklist /svc",
    commandName: "vmmap -p <PID>",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Un proceso svchost.exe que arranca con 40 MB y a las 48 horas consume 6 GB no necesita más memoria RAM: tiene un memory leak en una DLL mal programada.",
      mythVsTruth: {
        mentira: "Hay que comprar más memoria RAM porque Windows 11 consume más.",
        verdad: "Una fuga de memoria consume cualquier cantidad de RAM disponible (16, 32 o 64 GB) hasta colapsar el archivo de paginación.",
        comprobalo: "Usa `tasklist /svc` para listar los servicios dentro de ese PID, y VMMap para ver si la fuga está en el Heap o en Private WS."
      }
    },
    entende: {
      queEs: "Procedimiento pericial para aislar el servicio individual dentro de un contenedor multi-hospedado svchost.exe.",
      paraQueSirve: "Desactivar o aislar en su propio proceso (`sc config [servicio] type= own`) al módulo defectuoso.",
      quePasaSiFalta: "El equipo colapsa por Out-Of-Memory obligando a reinicios diarios."
    },
    interactua: {
      cliExample: "tasklist /fi \"imagename eq svchost.exe\" /svc",
      psExample: "Get-Process -Name svchost | Sort-Object -Property WS -Descending | Select-Object -First 5 Id, WS, @{N='Services';E={(Get-CimInstance Win32_Service -Filter \"ProcessId=$($_.Id)\").Name -join ', '}}",
      syntaxBreakdown: "Lista los PIDs de svchost que más Working Set consumen y mapea los nombres exactos de los servicios alojados.",
      whatToLookFor: "Un PID con Private Bytes creciendo exponencialmente sin estabilizarse.",
      technicalMetrics: "Crecimiento monotónico de Private WS > 50 MB por hora en reposo."
    },
    alertaEVO: {
      reversibilityRule: "Separar un servicio con `sc config [nombre] type= own` es completamente reversible con `type= share`.",
      safetyWarning: "No termines el PID de svchost si aloja RpcSs, DcomLaunch o SamSs; provocarás un reinicio forzado."
    },
    evidenceBadge: {
      code: "EVO-CASE-3705",
      label: "svchost Leak Isolation"
    }
  },
  {
    id: "inv-37-06",
    code: "37.06",
    title: "Expediente CPU: Thermal throttling por acumulación en disipador",
    subtitle: "Diferenciación entre cuello de software y degradación de reloj PROCHOT",
    targetMechanism: "Hardware Thermal Throttling & ACPI Thermal Zones",
    targetComponent: "PROCHOT# signal / Intel DTT / AMD CBS / WMI ThermalZone",
    commandName: "wmic /namespace:\\\\root\\wmi path MSAcpi_ThermalZoneTemperature get CurrentTemperature",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Cuando la CPU trabaja a 0.79 GHz fijos y la máquina se arrastra, no es un virus: la señal de hardware BD PROCHOT bloqueó el multiplicador a x8.",
      mythVsTruth: {
        mentira: "Si el Administrador de Tareas dice 15% de CPU, el procesador está descansando.",
        verdad: "Si la frecuencia está clavada en 0.79 GHz, ese 15% representa el 100% de la capacidad disponible bajo estrangulamiento térmico.",
        comprobalo: "Observa la frecuencia base en la pestaña Rendimiento: si está en 0.79 o 0.99 GHz sin fluctuar, el procesador está en throttling severo."
      }
    },
    entende: {
      queEs: "Detección empírica de estados de emergencia térmica activados por sensores del motherboard o VRMs.",
      paraQueSirve: "Evitar formatear o tocar Windows cuando la solución real es limpiar la turbina, cambiar la pasta térmica o reemplazar un cargador defectuoso.",
      quePasaSiFalta: "Se pasan horas optimizando servicios cuando el hardware está estrangulado por protección física."
    },
    interactua: {
      cliExample: "wmic /namespace:\\\\root\\wmi path MSAcpi_ThermalZoneTemperature get CurrentTemperature",
      psExample: "Get-CimInstance -Namespace root/wmi -ClassName MSAcpi_ThermalZoneTemperature | Select-Object @{N='TempC';E={($_.CurrentTemperature - 2732)/10}}",
      syntaxBreakdown: "Consulta WMI para leer las temperaturas de las zonas térmicas reportadas por el ACPI en grados Celsius.",
      whatToLookFor: "Valores superiores a 95°C en reposo o 100°C al abrir una ventana.",
      technicalMetrics: "Frecuencia de reloj reducida al multiplicador mínimo (800 MHz) con Tjunction máxima alcanzada."
    },
    alertaEVO: {
      reversibilityRule: "Operación de diagnóstico de solo lectura.",
      safetyWarning: "Nunca uses utilidades para forzar desactivar BD PROCHOT sin haber limpiado el disipador: podrías dañar el silicio."
    },
    evidenceBadge: {
      code: "EVO-CASE-3706",
      label: "Thermal Clocks Diagnostics"
    }
  },
  {
    id: "inv-37-07",
    code: "37.07",
    title: "Expediente GPU: TDR crash en juegos por inestabilidad de clocks",
    subtitle: "Timeout Detection and Recovery y calibración de latencia de VRAM",
    targetMechanism: "DirectX Graphics Kernel Subsystem (Dxgkrnl.sys) & TDR Timer",
    targetComponent: "dxgkrnl.sys / nvlddmkm.sys / amdkmdag.sys / TdrDelay",
    commandName: "reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /v TdrDelay",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "El mensaje 'El controlador de pantalla dejó de responder y se recuperó' es el mecanismo TDR de Windows salvando tu sistema de una pantalla azul.",
      mythVsTruth: {
        mentira: "Aumentar el TdrDelay a 10 segundos en el Registro arregla la placa de video.",
        verdad: "Solo aplaza el cuelgue: si el GPU tarda más de 2 segundos en responder una orden de renderizado, hay inestabilidad eléctrica, térmica o de driver.",
        comprobalo: "Revisa el Visor de Eventos buscando el ID de evento 4101 de Display: confirma un reset del chip gráfico en caliente."
      }
    },
    entende: {
      queEs: "Mecanismo del subsistema WDDM para reiniciar el driver de video sin tener que reiniciar todo el sistema operativo.",
      paraQueSirve: "Diferenciar entre un fallo físico de memoria VRAM, un overclock inestable de fábrica o una colisión de drivers antiguos.",
      quePasaSiFalta: "Cada microcongelamiento de video terminaría en un BSOD irrecuperable con pérdida de trabajo no guardado."
    },
    interactua: {
      cliExample: "reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Display'; Id=4101} -MaxEvents 5 -ErrorAction SilentlyContinue | Select-Object TimeCreated, Message",
      syntaxBreakdown: "Verifica si existen eventos de recuperación TDR y los parámetros configurados en el Registro del subsistema gráfico.",
      whatToLookFor: "Eventos 4101 con descripción 'El controlador de pantalla nvlddmkm dejó de responder'.",
      technicalMetrics: "TdrDelay por defecto = 2 segundos. Número de resets consecutivos antes de BSOD = 5 en 1 minuto."
    },
    alertaEVO: {
      reversibilityRule: "Limpiar drivers con DDU (Display Driver Uninstaller) en Modo Seguro e instalar el paquete oficial WHQL limpio.",
      safetyWarning: "No desactives TDRLevel en el Registro o el próximo cuelgue congelará el equipo forzando hard-reset."
    },
    evidenceBadge: {
      code: "EVO-CASE-3707",
      label: "GPU TDR Forensics"
    }
  },
  {
    id: "inv-37-08",
    code: "37.08",
    title: "Expediente Network: Conectividad limitada por IP 169.254.x.x",
    subtitle: "Fallo de negociación APIPA, snooping DHCP y purga del catálogo Winsock",
    targetMechanism: "Automatic Private IP Addressing (APIPA) & DHCP Client DORA Cycle",
    targetComponent: "tcpip.sys / Dhcpcsvc / netsh winsock reset",
    commandName: "netsh winsock reset & netsh int ip reset",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Si tu dirección IPv4 comienza con 169.254, tu PC no tiene internet porque el router nunca respondió tu paquete DHCP Discover (ciclo DORA incompleto).",
      mythVsTruth: {
        mentira: "El icono de 'Sin internet' se soluciona reiniciando la tarjeta de red.",
        verdad: "Si el stack TCP/IP tiene un hook corrupto de VPN de terceros o el socket Winsock está alterado, el cliente DHCP no puede recibir el ACK.",
        comprobalo: "Ejecuta `ipconfig /release` y luego `ipconfig /renew`; si arroja error de socket, el catálogo de red requiere reset estructural."
      }
    },
    entende: {
      queEs: "Procedimiento pericial para restaurar la pila de red nativa de Windows eliminando capas intermedias (LSP) huérfanas.",
      paraQueSirve: "Resolver la pérdida total de conectividad tras desinstalar software de seguridad, VPNs obsoletas o malware.",
      quePasaSiFalta: "El usuario queda sin red y asume que el puerto físico de la placa base se quemó."
    },
    interactua: {
      cliExample: "netsh winsock reset & netsh int ip reset & ipconfig /flushdns",
      psExample: "Get-NetIPAddress -InterfaceAlias 'Ethernet*' | Select-Object InterfaceAlias, IPv4Address, PrefixOrigin",
      syntaxBreakdown: "Restaura la configuración original del Registro para interfaces TCP/IP y vacía la caché de resolución DNS local.",
      whatToLookFor: "PrefixOrigin pasando de 'WellKnown' (APIPA) a 'Dhcp'.",
      technicalMetrics: "Tiempo de leasing DHCP negociado en milisegundos con servidor local (puerto UDP 67/68)."
    },
    alertaEVO: {
      reversibilityRule: "Ejecutar estos comandos requiere reiniciar el equipo para recompilar la pila de sockets.",
      safetyWarning: "Si usas configuraciones de IP fija empresariales, anota la máscara de subred, puerta de enlace y DNS antes del reset."
    },
    evidenceBadge: {
      code: "EVO-CASE-3708",
      label: "APIPA & TCP/IP Reset"
    }
  },
  {
    id: "inv-37-09",
    code: "37.09",
    title: "Expediente Wi-Fi: Desconexiones aleatorias por gestión de energía",
    subtitle: "Ahorro selectivo en tarjetas 802.11ax y roaming agresivo",
    targetMechanism: "WLAN Power Management & Roaming Aggressiveness",
    targetComponent: "wlanapi.dll / netsh wlan / Device Power Management",
    commandName: "netsh wlan show interfaces",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El 65% de los cortes de Wi-Fi en laptops no son culpa del router: ocurren porque Windows apaga la tarjeta de red para ahorrar 0.1W.",
      mythVsTruth: {
        mentira: "Si el Wi-Fi se corta a cada rato, la señal del router es débil.",
        verdad: "La casilla 'Permitir que el equipo apague este dispositivo para ahorrar energía' en el Administrador de Dispositivos corta la conexión en idle.",
        comprobalo: "Desmarca esa opción en las propiedades de tu tarjeta Wi-Fi y observa cómo las desconexiones desaparecen por completo."
      }
    },
    entende: {
      queEs: "Ajuste de persistencia de energía y agresividad de itinerancia en adaptadores inalámbricos.",
      paraQueSirve: "Garantizar sesiones de trabajo, llamadas y descargas sin microcortes involuntarios.",
      quePasaSiFalta: "Llamadas de Zoom y partidas de juegos sufren caídas de conexión cada 20 minutos."
    },
    interactua: {
      cliExample: "netsh wlan show interfaces",
      psExample: "Get-NetAdapterPowerManagement | Where-Object { $_.InterfaceDescription -match 'Wi-Fi|Wireless' } | Select-Object Name, AllowComputerToTurnOffDevice",
      syntaxBreakdown: "Inspecciona el estado de ahorro de energía activo en todos los adaptadores inalámbricos del sistema.",
      whatToLookFor: "AllowComputerToTurnOffDevice configurado en 'Enabled'. Debe ser 'Disabled'.",
      technicalMetrics: "Signal quality en dBm o porcentaje y canal de frecuencia (2.4 GHz vs 5 GHz vs 6 GHz)."
    },
    alertaEVO: {
      reversibilityRule: "Se puede volver a activar marcando la casilla en cualquier momento.",
      safetyWarning: "No cambies el Roaming Aggressiveness a 'Highest' si solo tienes un router en tu casa: forzarás escaneos innecesarios."
    },
    evidenceBadge: {
      code: "EVO-CASE-3709",
      label: "WLAN Power Persistence"
    }
  },
  {
    id: "inv-37-10",
    code: "37.10",
    title: "Expediente Audio: Audio estallado y crujidos por DPC latency alto",
    subtitle: "Diagnóstico con LatencyMon de fallos en storport.sys y wdf01000.sys",
    targetMechanism: "Kernel Streaming & Interrupt Service Routine Latency",
    targetComponent: "Audio Engine / Wdf01000.sys / LatencyMon / Mmcss",
    commandName: "latencymon.exe / mmcss tuning",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Los chasquidos y tartamudeos en los parlantes o auriculares no son del archivo MP3 ni de YouTube: son buffers de audio vaciándose por picos de latencia DPC.",
      mythVsTruth: {
        mentira: "Si el audio cruje, los parlantes o la placa de sonido están rotos.",
        verdad: "Cualquier driver mal programado que retenga la CPU por más de 1.000 µs agota el buffer de audio de Windows (Buffer Underrun).",
        comprobalo: "Ejecuta LatencyMon mientras reproduces sonido: te señalará el archivo exacto (.sys) que causa el pico de retardo."
      }
    },
    entende: {
      queEs: "Evaluación de la capacidad de procesamiento de tiempo real del subsistema de audio y multimedia (MMCSS).",
      paraQueSirve: "Habilitar computadoras para producción musical profesional, streaming y gaming sin degradación auditiva.",
      quePasaSiFalta: "El usuario compra una interfaz de audio USB cara y el problema persiste porque la causa es el driver de Wi-Fi o del chipset."
    },
    interactua: {
      cliExample: "typeperf \"\\Processor(_Total)\\% DPC Time\" -sc 5",
      psExample: "Get-Service -Name Audiosrv, AudioEndpointBuilder | Select-Object Name, Status, StartType",
      syntaxBreakdown: "Mide el porcentaje de tiempo que el procesador gasta atendiendo llamadas DPC acumuladas.",
      whatToLookFor: "DPC Time > 5% sostenido es garantía de audio con crujidos y cortes.",
      technicalMetrics: "Latencia ISR/DPC aceptable para audio profesional: < 500 microsegundos (µs)."
    },
    alertaEVO: {
      reversibilityRule: "Identificar y actualizar o deshabilitar temporalmente el driver causante (por ej. ACPI.sys o gestores de batería).",
      safetyWarning: "No desactives el servicio 'AudioSrv' o perderás todo el subsistema de sonido de Windows."
    },
    evidenceBadge: {
      code: "EVO-CASE-3710",
      label: "DPC Audio Integrity"
    }
  },
  {
    id: "inv-37-11",
    code: "37.11",
    title: "Expediente Bluetooth: Módulo desaparecido tras suspensión S3/S4",
    subtitle: "Fallo de enumeración USB en el bus HCI y cold boot drain",
    targetMechanism: "Host Controller Interface (HCI) & ACPI Power Transition (D3cold)",
    targetComponent: "BTHUSB / bthserv / USB Root Hub Enumeration",
    commandName: "devcon.exe restart \"USB\\VID_*&PID_*\"",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Abres tu laptop tras suspenderla y el icono de Bluetooth desapareció por completo del sistema operativo. ¿Se quemó? No: el bus USB perdió la enumeración.",
      mythVsTruth: {
        mentira: "El chip de Bluetooth se quemó y hay que llevar la placa a reparar.",
        verdad: "El controlador de Bluetooth casi siempre va conectado internamente al bus USB; si el controlador no responde al despertar de D3, Windows lo desconecta.",
        comprobalo: "Un 'drenado de energía' (apagar, desconectar cargador y mantener presionado el botón de encendido 30 segundos) resetea el microcontrolador y reaparece."
      }
    },
    entende: {
      queEs: "Procedimiento para forzar la re-enumeración del bus interno de periféricos sin abrir el chasis.",
      paraQueSirve: "Recuperar la conectividad Bluetooth en notebooks y placas madre modernas en segundos.",
      quePasaSiFalta: "Se envían equipos a garantía innecesariamente por un estado zombie del controlador HCI."
    },
    interactua: {
      cliExample: "pnputil /restart-device \"USB\\VID_8087*\"",
      psExample: "Get-PnpDevice -Class 'Bluetooth' | Select-Object FriendlyName, InstanceId, Status",
      syntaxBreakdown: "Reinicia el dispositivo PnP coincidente con la firma de hardware del adaptador Bluetooth.",
      whatToLookFor: "Status 'OK' en lugar de 'Error' o 'Unknown'.",
      technicalMetrics: "Transición de estado ACPI de D3hot/D3cold a D0 en menos de 500 ms."
    },
    alertaEVO: {
      reversibilityRule: "Reiniciar el hardware vía software con pnputil no modifica archivos del sistema.",
      safetyWarning: "Si el dispositivo sigue con Código 43 tras el drenado físico de condensadores, puede existir daño por descarga electrostática."
    },
    evidenceBadge: {
      code: "EVO-CASE-3711",
      label: "HCI Bus Re-enumeration"
    }
  },
  {
    id: "inv-37-12",
    code: "37.12",
    title: "Expediente USB: Puerto raíz con código 43 en Device Manager",
    subtitle: "Descriptor request failed y reinicio de xHCI Controller",
    targetMechanism: "USB Device Descriptor Enumeration & xHCI Root Hub",
    targetComponent: "usbhub.sys / usbport.sys / xhci.sys",
    commandName: "pnputil /restart-device \"PCI\\VEN_8086&DEV_*\"",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "El temido 'Código 43: El dispositivo tuvo un problema y Windows lo detuvo' en un USB suele ser un fallo de lectura del descriptor de dispositivo (Device Descriptor Request Failed).",
      mythVsTruth: {
        mentira: "El puerto USB está roto físicamente para siempre.",
        verdad: "Una caída transitoria de voltaje de 5V en el riel de alimentación hace que el firmware del controlador no pueda leer los primeros 18 bytes del descriptor.",
        comprobalo: "En Device Manager desinstala el 'Controlador de host Intel/AMD eXtensible' y haz clic en 'Buscar cambios de hardware' para reinstalarlo en limpio."
      }
    },
    entende: {
      queEs: "Protocolo de saneamiento del stack del subsistema de puertos universales serie.",
      paraQueSirve: "Restablecer puertos que dejaron de reconocer pendrives, teclados o mouses sin tener que reiniciar.",
      quePasaSiFalta: "El usuario asume que los puertos USB de su PC están quemados."
    },
    interactua: {
      cliExample: "pnputil /enum-devices /problem 43",
      psExample: "Get-PnpDevice | Where-Object { $_.Problem -eq 'CM_PROB_FAILED_POST_START' } | Select-Object FriendlyName, InstanceId",
      syntaxBreakdown: "Filtra todos los dispositivos conectados que actualmente reportan el error CM_PROB_FAILED_POST_START (Código 43).",
      whatToLookFor: "Dispositivos con clase 'USB' en estado de error.",
      technicalMetrics: "Voltaje en riel VBUS: nominal 5.0V ± 0.25V."
    },
    alertaEVO: {
      reversibilityRule: "Desinstalar el controlador raíz fuerza su recreación automática en el próximo sondeo PnP de Windows.",
      safetyWarning: "Si haces esto en una laptop con solo teclado y mouse USB, usa un script con temporizador para no perder el control."
    },
    evidenceBadge: {
      code: "EVO-CASE-3712",
      label: "xHCI Controller Recovery"
    }
  },
  {
    id: "inv-37-13",
    code: "37.13",
    title: "Expediente Printer: Cola de impresión bloqueada con jobs huérfanos",
    subtitle: "Vaciado del spooler, eliminación de archivos .SPL/.SHD y reset del servicio",
    targetMechanism: "Print Spooler Subsystem & Raw Spool Files (.SHD / .SPL)",
    targetComponent: "spoolsv.exe / C:\\Windows\\System32\\spool\\PRINTERS",
    commandName: "net stop spooler & del /q %systemroot%\\System32\\spool\\PRINTERS\\* & net start spooler",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "El botón 'Cancelar todos los documentos' del panel de impresión de Windows no funciona cuando un archivo de spooler .SHD quedó bloqueado en I/O exclusiva.",
      mythVsTruth: {
        mentira: "Hay que reinstalar los drivers de la impresora cuando la cola se traba.",
        verdad: "Basta con detener spoolsv.exe, vaciar los archivos temporales de la carpeta PRINTERS y reiniciar el servicio: la cola queda vacía en 2 segundos.",
        comprobalo: "Abre `C:\\Windows\\System32\\spool\\PRINTERS`: verás los archivos que retienen la cola como zombies."
      }
    },
    entende: {
      queEs: "Procedimiento de desbloqueo quirúrgico de la cola de impresión del sistema operativo.",
      paraQueSirve: "Eliminar trabajos trabados que impiden a todos los usuarios de la red enviar nuevos documentos.",
      quePasaSiFalta: "Nadie puede imprimir en toda una oficina durante horas hasta reiniciar el servidor."
    },
    interactua: {
      cliExample: "net stop spooler & del /Q /F /S \"%systemroot%\\System32\\spool\\PRINTERS\\*.*\" & net start spooler",
      psExample: "Stop-Service spooler -Force; Remove-Item \"$env:windir\\System32\\spool\\PRINTERS\\*\" -Force; Start-Service spooler",
      syntaxBreakdown: "Detiene el servicio, elimina archivos .SPL (spool) y .SHD (shadow data) trabados, y relanza el servicio.",
      whatToLookFor: "Directorio PRINTERS completamente vacío y estado del servicio 'Running'.",
      technicalMetrics: "Consumo de memoria de spoolsv.exe estabilizado en < 15 MB."
    },
    alertaEVO: {
      reversibilityRule: "Los documentos trabados se eliminan de la cola y deben volver a enviarse a imprimir.",
      safetyWarning: "No toques las carpetas 'drivers' o 'color' ubicadas en el mismo nivel que PRINTERS."
    },
    evidenceBadge: {
      code: "EVO-CASE-3713",
      label: "Print Spool Purge"
    }
  },
  {
    id: "inv-37-14",
    code: "37.14",
    title: "Expediente Display: Monitor secundario no detectado en EDID",
    subtitle: "Detección de handshake HDMI/DisplayPort y purga de claves Connectivity",
    targetMechanism: "Extended Display Identification Data (EDID) & WDDM Display Topology",
    targetComponent: "dxgkrnl.sys / HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\\Configuration",
    commandName: "Win + Ctrl + Shift + B / reg query GraphicsDrivers\\Connectivity",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Sabías que la combinación de teclas Win + Ctrl + Shift + B reinicia el subsistema de video de Windows sin cerrar ninguna de tus aplicaciones abiertas?",
      mythVsTruth: {
        mentira: "Si el monitor dice 'Sin señal', el cable o la pantalla están rotos.",
        verdad: "Windows almacena en caché las lecturas EDID; si hubo un corte de energía, el sistema guarda un handshake inválido y se niega a enviar señal.",
        comprobalo: "Presiona Win + Ctrl + Shift + B: escucharás un bip, la pantalla parpadeará y el controlador forzará una renegociación del bus DisplayPort/HDMI."
      }
    },
    entende: {
      queEs: "Restablecimiento de la topología multimonitor y purga de configuraciones de resolución obsoletas en el Registro.",
      paraQueSirve: "Recuperar monitores que quedaron en negro o no son detectados tras desconectar un dock o proyector.",
      quePasaSiFalta: "El usuario cree que la salida de video de su tarjeta gráfica se dañó."
    },
    interactua: {
      cliExample: "reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\\Configuration",
      psExample: "Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorID | Select-Object @{N='Manufacturer';E={[System.Text.Encoding]::ASCII.GetString($_.ManufacturerName)}}, @{N='UserFriendlyName';E={[System.Text.Encoding]::ASCII.GetString($_.UserFriendlyName)}}",
      syntaxBreakdown: "Lee los bloques EDID activos reportados por el monitor físico conectado.",
      whatToLookFor: "Lectura del nombre comercial del monitor (ej. 'DELL U2720Q').",
      technicalMetrics: "Tasa de refresco y resolución nativa emparejadas con el pixel clock de la GPU."
    },
    alertaEVO: {
      reversibilityRule: "El atajo Win+Ctrl+Shift+B es totalmente inocuo y no destructivo.",
      safetyWarning: "Si vas a borrar claves en el Registro de GraphicsDrivers, haz un backup de la rama antes."
    },
    evidenceBadge: {
      code: "EVO-CASE-3714",
      label: "EDID Handshake Restoration"
    }
  },
  {
    id: "inv-37-15",
    code: "37.15",
    title: "Expediente HDR: Sobreexposición cromática en modo Auto HDR",
    subtitle: "Calibración de luminancia nits y perfil ICC con Windows HDR Calibration",
    targetMechanism: "High Dynamic Range Tone Mapping & Windows Color System (WCS)",
    targetComponent: "HDRCalibration.exe / Advanced Color API / ICC Profile",
    commandName: "hdrcalibration / display color profile reset",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Activas HDR en Windows y todo se ve lavado, grisáceo y sin brillo. No es que tu monitor sea malo: el tone mapping del SO necesita mapear los nits máximos del panel.",
      mythVsTruth: {
        mentira: "El HDR en Windows no sirve y arruina la imagen.",
        verdad: "Windows envía una curva de luminancia estándar de 1000 nits; si tu monitor tiene 400 o 600 nits, comprime los colores y quema los blancos.",
        comprobalo: "Descarga la utilidad oficial 'Windows HDR Calibration', calibra el negro absoluto y blanco máximo, y los colores cobrarán vida al instante."
      }
    },
    entende: {
      queEs: "Alineación de la curva EOTF (Electro-Optical Transfer Function) entre la tarjeta de video y el panel display.",
      paraQueSirve: "Disfrutar de rango dinámico real en juegos, películas y edición fotográfica sin artefactos cromáticos.",
      quePasaSiFalta: "El usuario termina desactivando una función por la que pagó en su monitor gamer."
    },
    interactua: {
      cliExample: "dxdiag /t %temp%\\dx.txt & findstr /i \"AdvancedColor\" %temp%\\dx.txt",
      psExample: "Get-ItemProperty 'HKCU:\\Control Panel\\Desktop' | Select-Object -Property *color*",
      syntaxBreakdown: "Verifica si el subsistema DirectX reporta soporte para AdvancedColor y HDR activo.",
      whatToLookFor: "AdvancedColorSupported: Yes y AdvancedColorActive: Yes.",
      technicalMetrics: "Nivel de luminancia mínima (0.000 nits) y pico de brillo máximo calibrado."
    },
    alertaEVO: {
      reversibilityRule: "Los perfiles ICC calibrados se pueden eliminar desde el Administrador de Color de Windows en cualquier momento.",
      safetyWarning: "Verifica que el cable soporte ancho de banda suficiente (HDMI 2.1 o DisplayPort 1.4)."
    },
    evidenceBadge: {
      code: "EVO-CASE-3715",
      label: "WCS HDR Tone Mapping"
    }
  },
  {
    id: "inv-37-16",
    code: "37.16",
    title: "Expediente Power: Modern Standby drenando batería en mochila",
    subtitle: "Auditoría con SleepStudy de transiciones S0ix y bloqueos NoHwDrips",
    targetMechanism: "Modern Standby (S0 Low Power Idle) vs Traditional S3 Sleep",
    targetComponent: "powercfg /sleepstudy / Low Power S0 Idle State",
    commandName: "powercfg /sleepstudy /output %userprofile%\\Desktop\\sleepstudy.html",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Metes tu laptop suspendida en la mochila, y al sacarla horas después está ardiendo y con 0% de batería. La culpable: la pesadilla de Microsoft llamada Modern Standby (S0ix).",
      mythVsTruth: {
        mentira: "La batería de la laptop está dañada y no retiene carga.",
        verdad: "Bajo Modern Standby la laptop sigue encendida ejecutando tareas de red, Windows Update y telemetría mientras el display está apagado.",
        comprobalo: "Ejecuta `powercfg /sleepstudy`: te mostrará un informe pericial en HTML coloreado en rojo con el nombre del proceso que no dejó dormir la CPU."
      }
    },
    entende: {
      queEs: "Herramienta de diagnóstico de bajo nivel del kernel para auditar el estado de sueño profundo de plataformas modernas.",
      paraQueSirve: "Descubrir por qué una laptop consume energía y calienta cuando supuestamente debería estar suspendida.",
      quePasaSiFalta: "Baterías degradadas prematuramente por calor extremo en espacios cerrados (mochilas o fundas)."
    },
    interactua: {
      cliExample: "powercfg /sleepstudy /output sleepstudy.html",
      psExample: "powercfg /a",
      syntaxBreakdown: "powercfg /a lista qué estados de suspensión soporta el hardware (S0 Low Power Idle vs S3).",
      whatToLookFor: "En sleepstudy.html: sesiones con HW Drips < 90% (indican que el hardware no logró entrar en reposo profundo).",
      technicalMetrics: "Porcentaje de DRIPS (Deepest Runtime Idle Power State): debe ser > 95% para un sueño eficiente."
    },
    alertaEVO: {
      reversibilityRule: "powercfg genera solo un archivo de reporte; es 100% pasivo y seguro.",
      safetyWarning: "Si vas a guardar la laptop en la mochila por más de 1 hora, usa siempre 'Hibernar' (S4) para apagar totalmente la RAM y CPU."
    },
    evidenceBadge: {
      code: "EVO-CASE-3716",
      label: "S0ix SleepStudy Audit"
    }
  },
  {
    id: "inv-37-17",
    code: "37.17",
    title: "Expediente Services: Dependencias rotas en SCM tras optimizador",
    subtitle: "Reconstrucción de Service Control Manager y árbol de dependientes",
    targetMechanism: "Service Control Manager (SCM) & Service Dependency Graph",
    targetComponent: "services.exe / HKLM\\SYSTEM\\CurrentControlSet\\Services / sc.exe",
    commandName: "sc qc <nombre_servicio> / sc config depend= ...",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Un usuario ejecutó un 'script de optimización de Windows' y de repente no funciona la impresora, el Wi-Fi ni la Tienda. Rompieron las dependencias del SCM.",
      mythVsTruth: {
        mentira: "Para arreglar un servicio roto basta con ponerlo en Automático.",
        verdad: "Si el servicio depende de otro que está en 'Deshabilitado', el SCM arroja error 1068 (ERROR_SERVICE_DEPENDENCY_FAIL) y se niega a iniciar.",
        comprobalo: "Ejecuta `sc qc [servicio]` y examina la línea DEPENDENCIES: verás qué servicios ancestros deben estar vivos primero."
      }
    },
    entende: {
      queEs: "Restauración de las cadenas jerárquicas de servicios del sistema operativo.",
      paraQueSirve: "Recuperar funciones vitales de Windows tras el paso de optimizadores destructivos sin tener que formatear.",
      quePasaSiFalta: "El sistema queda inestable con errores crípticos 1068 y 1058 en cada intento de inicio."
    },
    interactua: {
      cliExample: "sc qc wuauserv",
      psExample: "Get-Service -Name wuauserv | Select-Object Name, Status, RequiredServices, DependentServices",
      syntaxBreakdown: "Examina la configuración del servicio, mostrando su tipo de inicio, binario asociado y lista de dependencias obligatorias.",
      whatToLookFor: "En RequiredServices: servicios en estado 'Stopped' que impiden el arranque del principal.",
      technicalMetrics: "Código de error win32: 1068 (ERROR_SERVICE_DEPENDENCY_FAIL)."
    },
    alertaEVO: {
      reversibilityRule: "Se pueden restaurar los tipos de inicio originales mediante claves de registro de un sistema sano (.reg).",
      safetyWarning: "Nunca modifiques dependencias de RPCSS ni DcomLaunch; son el corazón del sistema."
    },
    evidenceBadge: {
      code: "EVO-CASE-3717",
      label: "SCM Dependency Repair"
    }
  },
  {
    id: "inv-37-18",
    code: "37.18",
    title: "Expediente Apps: Win32App crash por DLL faltante en System32",
    subtitle: "Rastreo de dependencias con Dependencies / procmon y SxS manifests",
    targetMechanism: "Dynamic Link Library Loader & Side-by-Side (SxS) Manifests",
    targetComponent: "ntdll.dll (LdrpLoadDll) / MSVCP140.dll / VCRedist",
    commandName: "procmon.exe / filter: Result is NAME NOT FOUND",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El mensaje 'La aplicación no se pudo iniciar porque falta MSVCP140.dll' no se soluciona descargando una DLL suelta de una página web turbia.",
      mythVsTruth: {
        mentira: "Descargar la DLL que falta de internet y pegarla en System32 soluciona el juego o programa.",
        verdad: "Eso es ruleta rusa con malware; la solución real es instalar el paquete redistribuible oficial de Microsoft Visual C++ correspondiente (x86 y x64).",
        comprobalo: "Con ProcMon, filtra por 'Path contains .dll' y 'Result is NAME NOT FOUND' para ver la lista exacta de bibliotecas ausentes."
      }
    },
    entende: {
      queEs: "Auditoría pericial del cargador de bibliotecas dinámicas del kernel de Windows.",
      paraQueSirve: "Resolver errores 0xc000007b (formato de imagen inválido por mezclar 32 y 64 bits) y dependencias rotas en software profesional y juegos.",
      quePasaSiFalta: "El usuario infecta su PC descargando binarios manipulados de internet."
    },
    interactua: {
      cliExample: "where msvcp140.dll",
      psExample: "Get-ChildItem -Path $env:windir\\System32 -Filter 'msvcp*.dll' | Select-Object Name, Length, LastWriteTime",
      syntaxBreakdown: "Busca la presencia y ubicación exacta de la biblioteca requerida en las rutas del PATH de Windows.",
      whatToLookFor: "Presencia en System32 (64-bit) y SysWOW64 (32-bit).",
      technicalMetrics: "Error NTSTATUS: 0xC0000135 (STATUS_DLL_NOT_FOUND) o 0xC000007B (STATUS_INVALID_IMAGE_FORMAT)."
    },
    alertaEVO: {
      reversibilityRule: "Instalar el paquete oficial de Visual C++ Redistributable AIO es totalmente seguro y oficial.",
      safetyWarning: "Nunca copies DLLs de 32 bits dentro de System32: System32 aloja binarios de 64 bits; SysWOW64 aloja los de 32 bits."
    },
    evidenceBadge: {
      code: "EVO-CASE-3718",
      label: "DLL Loader Forensics"
    }
  },
  {
    id: "inv-37-19",
    code: "37.19",
    title: "Expediente Security: Bloqueo de Kernel Isolation por driver legado",
    subtitle: "Auditoría de compatibilidad HVCI y purga de drivers no firmados con pnputil",
    targetMechanism: "Hypervisor-Protected Code Integrity (HVCI) & Memory Integrity",
    targetComponent: "ci.dll / VBS / pnputil.exe / oem*.inf",
    commandName: "pnputil /enum-drivers / pnputil /delete-driver oemX.inf /uninstall",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "¿Windows no te deja activar 'Aislamiento del núcleo' (Memory Integrity) por culpa de un driver incompatible? Windows te dice el nombre del .sys, pero no cómo quitarlo.",
      mythVsTruth: {
        mentira: "Si un driver incompatible bloquea el Aislamiento del Núcleo hay que desinstalar Windows 11.",
        verdad: "El driver suele ser un residuo de software antiguo (ej. un emulador o mouse viejo); con `pnputil` puedes desinstalar y purgar el paquete oemXX.inf del driver store en 10 segundos.",
        comprobalo: "Usa `pnputil /enum-drivers` para identificar cuál archivo 'oem*.inf' contiene el .sys infractor, y elimínalo con `pnputil /delete-driver`."
      }
    },
    entende: {
      queEs: "Procedimiento para limpiar el Almacén de Controladores de Windows de binarios que no cumplen con los estándares de seguridad de virtualización (VBS).",
      paraQueSirve: "Activar la protección de integridad de memoria basada en hardware que previene inyecciones de código malicioso en el Kernel.",
      quePasaSiFalta: "El sistema queda vulnerable a ataques de nivel Ring 0 y malware de tipo rootkit."
    },
    interactua: {
      cliExample: "pnputil /delete-driver oem25.inf /uninstall /force",
      psExample: "Get-WindowsDriver -Online -All | Where-Object { $_.OriginalFileName -match 'antiguo.inf' } | Select-Object Driver, ProviderName, ClassName",
      syntaxBreakdown: "Desinstala y purga forzosamente el paquete de driver del Driver Store de Windows.",
      whatToLookFor: "Mensaje 'Driver package uninstalled' y posterior activación limpia de Memory Integrity sin advertencias.",
      technicalMetrics: "Compatibilidad con HVCI: bandera PAGE_EXECUTE_READWRITE ausente en secciones del driver."
    },
    alertaEVO: {
      reversibilityRule: "Asegúrate de que el driver no pertenezca a tu teclado o touchpad activo antes de borrarlo.",
      safetyWarning: "Nunca uses el flag /force sobre controladores de almacenamiento (RAID/NVMe) o el sistema no volverá a iniciar."
    },
    evidenceBadge: {
      code: "EVO-CASE-3719",
      label: "HVCI Driver Purge"
    }
  },
  {
    id: "inv-37-20",
    code: "37.20",
    title: "Expediente Recovery: WinRE inaccesible por partición dañada",
    subtitle: "Reactivación de WinRE, redimensionado con reagentc y reinstalación de winre.wim",
    targetMechanism: "Windows Recovery Environment (WinRE) & Recovery Partition ID",
    targetComponent: "reagentc.exe / winre.wim / ID: de94bba4-06d1-4d40-a16a-bfd50179d6ac",
    commandName: "reagentc /info & reagentc /enable",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "Si presionas Shift mientras reinicias y no aparecen las 'Opciones avanzadas', tu partición de recuperación WinRE está deshabilitada o huérfana de puntero.",
      mythVsTruth: {
        mentira: "Si WinRE no aparece, la partición de recuperación se borró para siempre.",
        verdad: "La mayoría de las veces el archivo `winre.wim` simplemente fue deshabilitado por un update fallido y puede reactivarse con una sola línea de comando.",
        comprobalo: "Abre CMD como Administrador y corre `reagentc /info`: verás si el estado está en 'Disabled' y la ruta física del archivo WIM."
      }
    },
    entende: {
      queEs: "Gestión pericial del entorno de recuperación pre-arranque de Windows.",
      paraQueSirve: "Garantizar que ante cualquier pantalla azul, fallo de boot o problema grave, el usuario pueda acceder al símbolo del sistema de emergencia o restaurar un punto anterior.",
      quePasaSiFalta: "Ante cualquier fallo de inicio el usuario queda completamente ciego sin herramientas de rescate integradas."
    },
    interactua: {
      cliExample: "reagentc /enable",
      psExample: "reagentc /info",
      syntaxBreakdown: "Habilita el entorno WinRE montando y registrando el archivo winre.wim en la partición reservada correspondiente.",
      whatToLookFor: "Línea 'Windows RE status: Enabled' y 'Windows RE location: \\\\?\\GLOBALROOT\\device\\harddiskX\\partitionY\\Recovery\\WindowsRE'.",
      technicalMetrics: "Partición tipo de recuperación GPT GUID: de94bba4-06d1-4d40-a16a-bfd50179d6ac."
    },
    alertaEVO: {
      reversibilityRule: "reagentc /disable y reagentc /enable son operaciones estándar de Microsoft totalmente controladas.",
      safetyWarning: "Si necesitas ampliar la partición por el parche KB5034441, reduce 250 MB de C: y extiende la partición de recuperación con Diskpart."
    },
    evidenceBadge: {
      code: "EVO-CASE-3720",
      label: "WinRE Ecosystem Restoration"
    }
  }
];

export const SECTOR_37_MINICASES: Sector37MiniCase[] = [
  {
    id: "case-37-01",
    code: "CASE-37.01",
    title: "El misterio del SSD NVMe al 100% de uso con 0 KB/s de transferencia",
    scenario: "Un cliente trae una notebook con un SSD NVMe de 1 TB. El equipo se congela por 20 segundos cada vez que el usuario deja de tipear. En el Administrador de Tareas la columna 'Tiempo de actividad' está clavada en 100%, pero las velocidades de lectura y escritura están en 0 KB/s exactos. El técnico anterior le dijo que el SSD tenía sectores dañados y debía comprar otro.",
    userStatement: "La máquina se congela sola cada vez que la dejo 30 segundos sin usar. Si abro el administrador de tareas veo el disco al 100% pero nada lee ni escribe.",
    initialMistake: "Recomendar cambiar el SSD o correr chkdsk /f /r sobre un almacenamiento NVMe sólido.",
    diagnosticQuestion: "¿Cuál es la causa técnica real del 100% de actividad con 0 I/O en unidades de estado sólido?",
    options: [
      {
        id: "opt-1",
        text: "El SSD tiene celdas NAND gastadas y el controlador está corriendo TRIM de emergencia.",
        isCorrect: false,
        explanation: "TRIM genera escrituras de metadatos visibles y no congela el bus PCIe a 0 KB/s."
      },
      {
        id: "opt-2",
        text: "La gestión de energía PCIe ASPM/DevSleep puso el bus en estado L1 y el SSD no responde a tiempo, saturando la cola de espera de comandos.",
        isCorrect: true,
        explanation: "El controlador storahci o stornvme queda esperando respuesta de los comandos pendientes; para Windows esto cuenta como 100% de ocupación de tiempo aunque no pasen datos."
      },
      {
        id: "opt-3",
        text: "El servicio Windows Search está indexando archivos comprimidos en segundo plano.",
        isCorrect: false,
        explanation: "La indexación genera lecturas y escrituras activas (> 15 MB/s), no 0 KB/s."
      }
    ],
    technicalVerdict: "Se deshabilitó el estado de ahorro de energía PCIe Link State Power Management con `powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS LINKSTATE 0`. El tiempo de respuesta del SSD bajó de 18.000 ms a 0.2 ms y las congelaciones desaparecieron por completo.",
    lessonLearned: "El Administrador de Tareas reporta tiempo en que el controlador estuvo esperando al dispositivo, no necesariamente transferencia de megabytes. 100% de uso con 0 MB/s es casi siempre un fallo de comunicación de bus o energía."
  },
  {
    id: "case-37-02",
    code: "CASE-37.02",
    title: "El bucle infinito de Windows Update con código 0x80070002",
    scenario: "Un servidor de trabajo en una empresa lleva 3 meses sin poder instalar la actualización acumulativa de seguridad. Cada noche descarga los parches, llega al 99%, se reinicia, arroja 'No pudimos completar las actualizaciones, deshaciendo cambios' y vuelve a empezar al día siguiente consumiendo ancho de banda.",
    userStatement: "Windows Update está en un loop infinito. Intenté el solucionador oficial de problemas y dice que solucionó el error pero sigue fallando.",
    initialMistake: "Descargar paquetes .msu aleatorios e intentar forzar la instalación manual con WUSA.",
    diagnosticQuestion: "¿Qué estructura física de archivos está corrompida provocando el error 0x80070002 (FILE_NOT_FOUND)?",
    options: [
      {
        id: "opt-1",
        text: "El archivo ntoskrnl.exe de Windows fue borrado por un antivirus.",
        isCorrect: false,
        explanation: "Si faltara el kernel, el sistema operativo ni siquiera arrancaría."
      },
      {
        id: "opt-2",
        text: "La base de datos relacional ESE (DataStore.edb) dentro de SoftwareDistribution perdió transacciones pendientes de parches anteriores.",
        isCorrect: true,
        explanation: "0x80070002 en WUA indica que el catálogo cree que un archivo existe en caché pero fue eliminado o tiene un hash mismatch."
      },
      {
        id: "opt-3",
        text: "El disco duro no tiene espacio suficiente en la partición MBR.",
        isCorrect: false,
        explanation: "El código de espacio insuficiente en disco es 0x80070070 (ERROR_DISK_FULL), no 0x80070002."
      }
    ],
    technicalVerdict: "Se detuvieron los servicios wuauserv, bits y cryptsvc, se renombró SoftwareDistribution a SoftwareDistribution.old y se reiniciaron los servicios. Windows descargó el catálogo limpio y la actualización acumulativa se instaló exitosamente al primer intento.",
    lessonLearned: "El solucionador de problemas básico no purga la base transaccional ESE cuando hay bloqueos a nivel de driver o antivirus. El reseteo atómico de la carpeta SoftwareDistribution es el estándar pericial."
  },
  {
    id: "case-37-03",
    code: "CASE-37.03",
    title: "Notebook hirviendo dentro de la mochila por culpa de Modern Standby",
    scenario: "Una profesional guarda su laptop en la mochila a las 18:00 hs con 90% de batería tras cerrarle la tapa. A las 20:00 hs al sacarla en su casa la notebook quema al tacto, los ventiladores rugen al máximo y la batería marca 4% de carga restante.",
    userStatement: "Tengo miedo de que la batería explote. La cierro para suspenderla y cuando la saco de la mochila parece una tostadora.",
    initialMistake: "Culpar a la batería y cambiarla por un repuesto nuevo sin diagnosticar el estado ACPI.",
    diagnosticQuestion: "¿Qué mecanismo de Windows provocó que la notebook permaneciera procesando tareas dentro de un compartimiento cerrado?",
    options: [
      {
        id: "opt-1",
        text: "Un cortocircuito en el botón de encendido que la prende sola.",
        isCorrect: false,
        explanation: "El botón de encendido no se presiona espontáneamente y las bisagras cuentan con sensor Hall magnético."
      },
      {
        id: "opt-2",
        text: "El modo Modern Standby (S0ix) mantiene activos los servicios de red y telemetría de Windows mientras la pantalla está apagada.",
        isCorrect: true,
        explanation: "Microsoft diseñó S0 Low Power Idle para imitar a un smartphone, pero en Windows muchos procesos impiden que el procesador entre en C-states profundos, disipando 15-25W en un ambiente cerrado."
      },
      {
        id: "opt-3",
        text: "La memoria RAM tiene sobrevoltaje en el perfil XMP.",
        isCorrect: false,
        explanation: "La RAM no disipa suficiente calor por sí sola para recalentar el chasis de una laptop."
      }
    ],
    technicalVerdict: "Se generó un informe con `powercfg /sleepstudy` demostrando que el servicio de telemetría y el driver de audio impedían la transición a DRIPS (>95%). Se reconfiguró la acción de cierre de tapa para 'Hibernar' (S4), consumiendo 0 Watts en reposo.",
    lessonLearned: "Modern Standby no garantiza corte de energía en Windows. En entornos móviles profesionales, la hibernación (guardado de RAM en hiberfil.sys y corte de energía total) es la única garantía de seguridad térmica."
  }
];

export const SECTOR_37_TEST_BANK: Sector37TestQuestion[] = [
  {
    id: "q-37-01",
    questionNumber: 1,
    category: "Boot Forensics",
    question: "Al reparar un error de arranque 0xc000000e en un sistema con particionado GPT y firmware UEFI, ¿cuál es el comando exacto para reinstalar los archivos de arranque en la partición ESP (asignada con letra S:)?",
    options: [
      { id: "A", text: "bootrec /fixmbr & bootrec /fixboot" },
      { id: "B", text: "bcdboot C:\\Windows /s S: /f UEFI" },
      { id: "C", text: "chkdsk C: /f /r" },
      { id: "D", text: "sfc /scannow /offbootdir=S:\\" }
    ],
    correctOptionId: "B",
    technicalExplanation: "bootrec /fixmbr es solo para particiones MBR legadas. En sistemas UEFI modernos se utiliza `bcdboot C:\\Windows /s S: /f UEFI` para copiar los binarios del cargador de arranque EFI y regenerar el BCD en la partición ESP (S:)."
  },
  {
    id: "q-37-02",
    questionNumber: 2,
    category: "Kernel Crash Forensics",
    question: "¿Qué condición técnica dispara exactamente el pantallazo azul DPC_WATCHDOG_VIOLATION (código de bugcheck 0x00000133)?",
    options: [
      { id: "A", text: "Un archivo de sistema fue eliminado por un troyano." },
      { id: "B", text: "Una rutina DPC (Deferred Procedure Call) de un controlador superó el límite de tiempo de ejecución sin ceder el procesador." },
      { id: "C", text: "La memoria virtual superó el 90% de capacidad del archivo de paginación." },
      { id: "D", text: "La temperatura del procesador superó los 95 grados Celsius." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El watchdog del kernel monitorea las rutinas diferidas (DPC). Si un driver retiene la CPU por encima del umbral de ticks establecido (generalmente > 100 ticks o ~15-20 ms), se asume que el sistema está colgado y se genera el bugcheck 0x133."
  },
  {
    id: "q-37-03",
    questionNumber: 3,
    category: "Network & Winsock",
    question: "Si una interfaz de red obtiene la dirección IPv4 169.254.88.140 con máscara 255.255.0.0, ¿qué significa técnicamente?",
    options: [
      { id: "A", text: "El cable de red está cortado en sus hilos 1 y 2." },
      { id: "B", text: "El adaptador negoció exitosamente con un servidor DHCP público de internet." },
      { id: "C", text: "El cliente DHCP de Windows no recibió respuesta al paquete DHCP Discover y asignó una dirección automática mediante APIPA." },
      { id: "D", text: "La tarjeta de red está configurada en modo promiscuo de captura." }
    ],
    correctOptionId: "C",
    technicalExplanation: "El rango 169.254.0.0/16 está reservado para APIPA (Automatic Private IP Addressing). Windows lo asigna de forma local cuando el proceso DORA (Discover, Offer, Request, Acknowledge) de DHCP no recibe respuesta del servidor."
  },
  {
    id: "q-37-04",
    questionNumber: 4,
    category: "Power Diagnostics",
    question: "¿Qué comando nativo de Windows genera un reporte pericial completo en HTML para auditar las causas de drenado de batería durante la suspensión moderna S0ix?",
    options: [
      { id: "A", text: "powercfg /batteryreport" },
      { id: "B", text: "powercfg /sleepstudy" },
      { id: "C", text: "perfmon /report" },
      { id: "D", text: "dxdiag /power" }
    ],
    correctOptionId: "B",
    technicalExplanation: "powercfg /sleepstudy es la herramienta específica de telemetría de bajo nivel para auditar los estados de Modern Standby (S0ix), detallando cada bloqueante y el porcentaje de tiempo que el hardware pasó en DRIPS (Deepest Runtime Idle Power State)."
  },
  {
    id: "q-37-05",
    questionNumber: 5,
    category: "Services & SCM",
    question: "Cuando un servicio de Windows falla al iniciar arrojando el error 'Error 1068: No se puede iniciar el servicio o grupo de dependencia', ¿cuál es la causa directa?",
    options: [
      { id: "A", text: "Falta memoria física en el equipo." },
      { id: "B", text: "Al menos uno de los servicios listados en su registro de dependencias (RequiredServices) está deshabilitado o falló al iniciar." },
      { id: "C", text: "El archivo ejecutable fue modificado por un virus." },
      { id: "D", text: "El usuario no tiene privilegios de administrador en el dominio." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El Service Control Manager (SCM) valida el árbol de dependencias antes de llamar al EntryPoint del servicio. Si una dependencia previa no está en estado 'Running', se aborta el inicio con el código Win32 1068 (ERROR_SERVICE_DEPENDENCY_FAIL)."
  }
];
