// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 21: SEGURIDAD
// ¿DEFENDER ALCANZA? LA SEGURIDAD QUE YA ESTÁ INSTALADA

export type RiskLevelSector21 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector21Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector21;
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

export interface Sector21MiniCase {
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

export interface Sector21TestQuestion {
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

export const SECTOR_21_INVESTIGATIONS: Sector21Investigation[] = [
  {
    id: "inv-21-01",
    code: "21.01",
    title: "Defender",
    subtitle: "El motor de protección integrado de Windows",
    targetMechanism: "Windows Defender Antivirus Service (WinDefend / MsMpEng.exe)",
    targetComponent: "MsMpEng.exe / MpCmdRun.exe",
    commandName: "Get-MpComputerStatus",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Microsoft Defender no es una simple aplicación en segundo plano; es un subsistema kernel y servicio de modo usuario interconectado con el hipervisor y la nube de Microsoft.",
      mythVsTruth: {
        mentira: "Defender es un antivirus básico de fábrica que debe reemplazarse inmediatamente por uno de terceros.",
        verdad: "Defender es una solución Next-Gen EDR integrada nativamente en el kernel con inspección AMSI, análisis heurístico y protección basada en reputación.",
        comprobalo: "Ejecutá Get-MpComputerStatus en PowerShell para inspeccionar el estado real del motor y la versión de firmas."
      }
    },
    entende: {
      queEs: "El servicio principal de protección contra malware y amenazas cibernéticas integrado en Windows 10/11.",
      paraQueSirve: "Escanear memoria, archivos de disco, descargas y tráfico en tiempo real antes de que se ejecute código dañino.",
      quePasaSiFalta: "El sistema queda expuesto a vulnerabilidades de ejecución automática sin filtrado AMSI ni heurística de firmas."
    },
    interactua: {
      cliExample: "MpCmdRun.exe -SignatureUpdate",
      psExample: "Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, AntivirusSignatureAge",
      syntaxBreakdown: "Get-MpComputerStatus consulta WMI/CIM para devolver el estado operacional del servicio WinDefend y la edad de las firmas.",
      whatToLookFor: "RealTimeProtectionEnabled: True y AntivirusSignatureAge <= 1 día.",
      technicalMetrics: "Impacto en CPU < 2% en reposo, consumo de RAM ~150MB por MsMpEng.exe."
    },
    alertaEVO: {
      reversibilityRule: "Completamente reversible habilitando la protección en tiempo real desde PowerShell o Seguridad de Windows.",
      safetyWarning: "No deshabilitar las actualizaciones automáticas de firmas en sistemas de producción."
    },
    evidenceBadge: {
      code: "DEF-ENGINE",
      label: "WinDefend Subsystem"
    }
  },
  {
    id: "inv-21-02",
    code: "21.02",
    title: "Antivirus",
    subtitle: "Filosofía y mecanismos de detección de código malicioso",
    targetMechanism: "Signature Scanning, Heuristics, Behavior Monitoring & AMSI Integration",
    targetComponent: "AMSI.dll / ELAM Driver",
    commandName: "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Los antivirus modernos ya no buscan cadenas fijas de bytes en archivos; analizan llamadas a APIs del sistema y comportamiento de procesos en memoria.",
      mythVsTruth: {
        mentira: "Un antivirus analiza cada archivo del disco duro de forma continua cada segundo.",
        verdad: "Un antivirus intercepta eventos I/O mediante drivers de filtro de sistema de archivos (Minifilters) solo al abrir, crear o ejecutar un archivo.",
        comprobalo: "Usa Get-CimInstance en el namespace Root/SecurityCenter2 para ver qué productos antivirus reconoce el sistema."
      }
    },
    entende: {
      queEs: "Un motor de análisis que combina firmas estáticas, análisis dinámico y heurística de comportamiento.",
      paraQueSirve: "Prevenir, detectar y desinfectar amenazas en memoria y disco antes de que alteren la integridad del sistema.",
      quePasaSiFalta: "Se pierde la intercepción preventiva en capa I/O y memoria."
    },
    interactua: {
      cliExample: "wmic /namespace:\\root\\SecurityCenter2 path AntiVirusProduct get displayName,productState",
      psExample: "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct",
      syntaxBreakdown: "Consulta el Security Center WMI para obtener el estado del producto registrado (AV de terceros o Defender).",
      whatToLookFor: "productState codificado en hexadecimal indicando si está activo y actualizado.",
      technicalMetrics: "Latencia adicional por I/O de archivo interceptado < 5ms."
    },
    alertaEVO: {
      reversibilityRule: "Informativo. No altera configuraciones del registro.",
      safetyWarning: "Verificar siempre que solo haya un motor de protección en tiempo real activo para evitar colisiones en Minifilters."
    },
    evidenceBadge: {
      code: "AV-ENGINE",
      label: "SecurityCenter2"
    }
  },
  {
    id: "inv-21-03",
    code: "21.03",
    title: "Firewall",
    subtitle: "Filtrado de paquetes en capa de red con estado",
    targetMechanism: "Windows Defender Firewall with Advanced Security (WFP - Windows Filtering Platform)",
    targetComponent: "mpssvc.dll / netsh advfirewall",
    commandName: "Get-NetFirewallRule",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "El Firewall de Windows opera dentro de la pila TCP/IP del kernel mediante WFP, filtrando conexiones entrantes y salientes antes de que lleguen a los sockets de aplicación.",
      mythVsTruth: {
        mentira: "El firewall de Windows solo bloquea conexiones de entrada que vienen de internet.",
        verdad: "El firewall de Windows es bi-direccional y con estado (Stateful), inspeccionando también el tráfico saliente y creando reglas dinámicas para respuestas a peticiones autorizadas.",
        comprobalo: "Usa Get-NetFirewallRule -Enabled True para ver todas las reglas activas procesadas por el motor WFP."
      }
    },
    entende: {
      queEs: "El cortafuegos integrado de Windows basado en la plataforma de filtrado de Windows (WFP).",
      paraQueSirve: "Bloquear accesos no autorizados a puertos locales y restringir qué aplicaciones pueden comunicarse en red.",
      quePasaSiFalta: "Puertos de servicios de red (SMB, RPC, RDP) quedan expuestos directamente a la red local e internet."
    },
    interactua: {
      cliExample: "netsh advfirewall show allprofiles",
      psExample: "Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction",
      syntaxBreakdown: "Muestra el estado de los perfiles Domain, Private y Public del Firewall de Windows.",
      whatToLookFor: "DefaultInboundAction: BlockInbound en todos los perfiles.",
      technicalMetrics: "Cero impacto apreciable en el throughput de red gigabit."
    },
    alertaEVO: {
      reversibilityRule: "Las reglas personalizadas se pueden eliminar con Remove-NetFirewallRule.",
      safetyWarning: "No cambiar DefaultInboundAction a AllowInbound de manera global."
    },
    evidenceBadge: {
      code: "FW-WFP",
      label: "NetFirewall WFP"
    }
  },
  {
    id: "inv-21-04",
    code: "21.04",
    title: "SmartScreen",
    subtitle: "Protección basada en reputación de la nube",
    targetMechanism: "Windows Defender SmartScreen / Mark-of-the-Web (MOTW)",
    targetComponent: "smartscreen.exe / Zone.Identifier NTFS Alternate Data Stream",
    commandName: "Get-Item -Path binary.exe -Stream Zone.Identifier",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "SmartScreen no analiza si un archivo contiene virus; verifica su reputación digital enviando el hash del ejecutable a la nube de Microsoft antes de permitir su ejecución.",
      mythVsTruth: {
        mentira: "SmartScreen bloquea un archivo porque detectó un troyano en su interior.",
        verdad: "SmartScreen advierte sobre ejecutables desconocidos porque carecen de reputación acumulada o firma digital de certificado EV de confianza.",
        comprobalo: "Inspeccioná el flujo alternativo de datos (Zone.Identifier) de cualquier archivo descargado de internet."
      }
    },
    entende: {
      queEs: "El sistema de análisis de reputación de aplicaciones y sitios web en tiempo real.",
      paraQueSirve: "Evitar la ejecución accidental de software malicioso recién empaquetado (Zero-Day) antes de que existan firmas de antivirus.",
      quePasaSiFalta: "Los usuarios pueden ejecutar binarios recién descargados de fuentes desconocidas con un solo clic."
    },
    interactua: {
      cliExample: "dir /r archivo_descargado.exe",
      psExample: "Get-Content -Path .\\Setup.exe -Stream Zone.Identifier",
      syntaxBreakdown: "Lee el Alternate Data Stream (ADS) Zone.Identifier adjuntado por los navegadores al descargar archivos de internet (ZoneId=3 indica Internet).",
      whatToLookFor: "ZoneId=3 (URLZone.Internet) activa la validación de SmartScreen.",
      technicalMetrics: "Consulta HTTPS ultrarrápida (<50ms) a la API de reputación de Microsoft."
    },
    alertaEVO: {
      reversibilityRule: "Desbloquear un archivo mediante Unblock-File elimina el ADS Zone.Identifier.",
      safetyWarning: "Desbloquear únicamente ejecutables cuya procedencia y firma hash hayan sido verificadas."
    },
    evidenceBadge: {
      code: "SCRN-MOTW",
      label: "SmartScreen MOTW"
    }
  },
  {
    id: "inv-21-05",
    code: "21.05",
    title: "PUA Protection",
    subtitle: "Bloqueo de aplicaciones potencialmente no deseadas (Potentially Unwanted Applications)",
    targetMechanism: "PUA/PUP Blocking Subsystem in Defender Engine",
    targetComponent: "MpCmdRun.exe / Defender PUA Policy",
    commandName: "Get-MpPreference | Select-Object PUAProtection",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "El software PUA incluye adware, mineros de criptomonedas, modificadores de navegador y optimizadores falsos que no son técnicamente virus, pero dañan la experiencia y rendimiento.",
      mythVsTruth: {
        mentira: "Si un instalador descarga barras de herramientas adicionales o adware, es considerado malware clásico por el antivirus.",
        verdad: "El software potencialmente no deseado está legalmente en una zona gris y requiere la política explícita PUAProtection activa para ser bloqueado.",
        comprobalo: "Consulta el parámetro PUAProtection en Get-MpPreference (0 = Desactivado, 1 = Activado, 2 = Modo Auditoría)."
      }
    },
    entende: {
      queEs: "El mecanismo de filtrado para instaladores que incluyen ofertas secundarias de software espía o molesto.",
      paraQueSirve: "Mantener limpio el sistema operativo de software basura que degrada el rendimiento del procesador y disco.",
      quePasaSiFalta: "Instaladores gratuitos agregan extensiones de navegador invasivas y servicios residentes no deseados."
    },
    interactua: {
      cliExample: "powershell Set-MpPreference -PUAProtection Enabled",
      psExample: "Get-MpPreference | Select-Object PUAProtection",
      syntaxBreakdown: "Obtiene la configuración del motor Defender para el filtrado de aplicaciones PUA.",
      whatToLookFor: "PUAProtection : 1 (Enabled).",
      technicalMetrics: "Evita el consumo innecesario de almacenamiento y procesos en segundo plano."
    },
    alertaEVO: {
      reversibilityRule: "Reversible en cualquier momento cambiando PUAProtection a Disabled o AuditMode.",
      safetyWarning: "Mantener PUAProtection activado en todos los entornos corporativos y de usuario final."
    },
    evidenceBadge: {
      code: "PUA-BLOCK",
      label: "PUA Protection"
    }
  },
  {
    id: "inv-21-06",
    code: "21.06",
    title: "Cloud Protection",
    subtitle: "Protección entregada por la nube y envío de muestras",
    targetMechanism: "MAPS (Microsoft Active Protection Service) & Cloud-Delivered Protection",
    targetComponent: "MsMpEng.exe Cloud Service Connection",
    commandName: "Get-MpPreference | Select-Object MAPSReporting, SubmitSamplesConsent",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Cuando un binario sospechoso se ejecuta por primera vez en el mundo, Defender consulta a la nube en milisegundos para generar un análisis heurístico dinámico en detención temporal.",
      mythVsTruth: {
        mentira: "Defender solo actualiza sus capacidades defensivas una vez al día mediante Windows Update.",
        verdad: "Con Cloud Protection activado, las defensas se actualizan en tiempo real mediante inferencia de inteligencia artificial distribuida en Azure.",
        comprobalo: "Comprobá los valores de MAPSReporting y SubmitSamplesConsent mediante Get-MpPreference."
      }
    },
    entende: {
      queEs: "La infraestructura basada en la nube de Microsoft para detección instantánea de amenazas de día cero.",
      paraQueSirve: "Generar respuestas defensivas automáticas ante ataques masivos en cuestión de segundos.",
      quePasaSiFalta: "El equipo depende exclusivamente de la base de firmas local descargada previamente."
    },
    interactua: {
      cliExample: "powershell Get-MpPreference | fl *MAPS*, *Sample*",
      psExample: "Get-MpPreference | Select-Object MAPSReporting, SubmitSamplesConsent, CloudBlockLevel",
      syntaxBreakdown: "Consulta el nivel de informe MAPS (Advanced/Basic) y el comportamiento de envío de muestras.",
      whatToLookFor: "MAPSReporting: 2 (AdvancedMAPS), SubmitSamplesConsent: 1 (SendSafeSamples).",
      technicalMetrics: "Respuesta en la nube promedio de 100 a 300 ms por consulta."
    },
    alertaEVO: {
      reversibilityRule: "Se puede ajustar el consentimiento de muestras si existen restricciones estricta de privacidad.",
      safetyWarning: "No desactivar MAPS en redes conectadas permanentemente a internet."
    },
    evidenceBadge: {
      code: "CLOUD-MAPS",
      label: "Cloud Delivered Def"
    }
  },
  {
    id: "inv-21-07",
    code: "21.07",
    title: "Tamper Protection",
    subtitle: "Protección contra manipulación de la seguridad",
    targetMechanism: "Anti-Tampering Subsystem for Defender Core Settings",
    targetComponent: "MsMpEng.exe Guard & Security Center Integrity",
    commandName: "Get-MpComputerStatus | Select-Object IsTamperProtected",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Los malwares intentan ejecutar comandos de PowerShell como `Set-MpPreference -DisableRealtimeMonitoring $true`. Tamper Protection invalida estas llamadas aunque seas Administrator.",
      mythVsTruth: {
        mentira: "Un proceso ejecutado como Administrador o SYSTEM puede desactivar libremente Defender con un comando o registro.",
        verdad: "Tamper Protection bloquea modificaciones en la configuración crítica de Defender provinientes de scripts, comandos o claves del registro no autorizadas.",
        comprobalo: "Comprobá el valor IsTamperProtected ejecutando Get-MpComputerStatus en una ventana de PowerShell."
      }
    },
    entende: {
      queEs: "El blindaje del sistema operativo que impide que aplicaciones o malware modifiquen la configuración de seguridad.",
      paraQueSirve: "Bloquear los vectores de ataque más comunes de ransomware que buscan apagar el antivirus antes de cifrar archivos.",
      quePasaSiFalta: "Un script malicioso ejecutado con elevación UAC puede desactivar la protección en tiempo real en un segundo."
    },
    interactua: {
      cliExample: "powershell Get-MpComputerStatus | Select-Object IsTamperProtected",
      psExample: "(Get-MpComputerStatus).IsTamperProtected",
      syntaxBreakdown: "Devuelve $true si Tamper Protection está activo a nivel de kernel/nube.",
      whatToLookFor: "IsTamperProtected: True.",
      technicalMetrics: "Rechazo instantáneo de llamadas RPC no firmadas por Microsoft hacia el servicio Defender."
    },
    alertaEVO: {
      reversibilityRule: "Solo modificable manualmente por un operador humano a través de la interfaz gráfica de Seguridad de Windows.",
      safetyWarning: "Intentar deshabilitar Tamper Protection vía scripts automatizados fallará por diseño."
    },
    evidenceBadge: {
      code: "TMPR-PROT",
      label: "Tamper Protection"
    }
  },
  {
    id: "inv-21-08",
    code: "21.08",
    title: "Controlled Folder Access",
    subtitle: "Escudo anti-ransomware para carpetas críticas",
    targetMechanism: "Access Control Filter for Protected Folders & Unauthorized Binary Block",
    targetComponent: "ControlledFolderAccess Policy / MpCmdRun.exe",
    commandName: "Get-MpPreference | Select-Object EnableControlledFolderAccess",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Controlled Folder Access impide que aplicaciones no confiables escriban, modifiquen o borren archivos en carpetas como Documentos, Imágenes y Escritorio, frenando en seco al ransomware.",
      mythVsTruth: {
        mentira: "El ransomware puede cifrar cualquier archivo si el usuario tiene permisos de escritura en NTFS.",
        verdad: "Controlled Folder Access valida la firma y reputación del ejecutable antes de permitir escrituras en directorios protegidos, bloqueando binarios no autorizados.",
        comprobalo: "Inspeccioná EnableControlledFolderAccess con Get-MpPreference (0 = Desactivado, 1 = Activado, 2 = Modo Auditoría)."
      }
    },
    entende: {
      queEs: "El mecanismo de protección de acceso a carpetas del sistema que restringe modificaciones por procesos no en lista blanca.",
      paraQueSirve: "Garantizar la protección de documentos valiosos contra ataques de cifrado masivo sin autorización.",
      quePasaSiFalta: "Un ejecutable malicioso tiene vía libre para cifrar los archivos del usuario en sus carpetas personales."
    },
    interactua: {
      cliExample: "powershell Get-MpPreference | select -ExpandProperty ControlledFolderAccessProtectedFolders",
      psExample: "Get-MpPreference | Select-Object EnableControlledFolderAccess, ControlledFolderAccessAllowedApplications",
      syntaxBreakdown: "Enumera la lista de carpetas protegidas y las aplicaciones en la lista blanca de exención.",
      whatToLookFor: "EnableControlledFolderAccess : 1 (Enabled) o 2 (AuditMode).",
      technicalMetrics: "Intercepción de escrituras no autorizadas con alerta en el área de notificación."
    },
    alertaEVO: {
      reversibilityRule: "Se pueden añadir ejecutables legítimos a la lista blanca usando Add-MpPreference -ControlledFolderAccessAllowedApplications.",
      safetyWarning: "Utilizar el modo auditoría primero en entornos corporativos para evitar bloquear software interno."
    },
    evidenceBadge: {
      code: "CFA-RANSOM",
      label: "Anti-Ransomware CFA"
    }
  },
  {
    id: "inv-21-09",
    code: "21.09",
    title: "Core Isolation",
    subtitle: "Aislamiento del núcleo por hipervisor (HVCI)",
    targetMechanism: "Hypervisor-Enforced Code Integrity (HVCI) & VBS (Virtualization-Based Security)",
    targetComponent: "Secure Kernel / Hyper-V Micro-visor / Memory Guard",
    commandName: "Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root/Microsoft/Windows/DeviceGuard",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Core Isolation utiliza la virtualización de hardware para crear un entorno aislado seguro al cual ni siquiera el kernel principal de Windows tiene acceso de escritura no controlado.",
      mythVsTruth: {
        mentira: "El antivirus y la seguridad de Windows operan todos dentro de la misma capa de memoria del sistema operativo.",
        verdad: "Con VBS/HVCI, la integridad del código se valida dentro del Secure Kernel ejecutado por Hyper-V por debajo del sistema operativo habitual.",
        comprobalo: "Consulta la clase Win32_DeviceGuard para verificar el estado de VBS y HVCI en tu procesador."
      }
    },
    entende: {
      queEs: "Aislamiento del núcleo basado en virtualización para validar la firma de código ejecutable en memoria.",
      paraQueSirve: "Prevenir que código malicioso inyecte controladores falsos o modifique las estructuras de datos de kernel de Windows.",
      quePasaSiFalta: "Si un exploit de kernel obtiene privilegios, puede parchear el kernel de Windows en memoria directamente."
    },
    interactua: {
      cliExample: "systeminfo | findstr /C:\"Virtualization-based security\"",
      psExample: "Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root/Microsoft/Windows/DeviceGuard | Select-Object SecurityServicesRunning",
      syntaxBreakdown: "Devuelve los servicios de seguridad basados en virtualización actualmente en ejecución.",
      whatToLookFor: "SecurityServicesRunning includes el valor '2' (Hypervisor-enforced Code Integrity).",
      technicalMetrics: "Requiere extensiones VT-x/AMD-V y SLAT habilitadas en la BIOS/UEFI."
    },
    alertaEVO: {
      reversibilityRule: "Se puede activar/desactivar desde la interfaz de Seguridad de Aislamiento del Núcleo.",
      safetyWarning: "Incompatible con controladores de hardware extremadamente antiguos o desactualizados."
    },
    evidenceBadge: {
      code: "HVCI-VBS",
      label: "VBS Core Isolation"
    }
  },
  {
    id: "inv-21-10",
    code: "21.10",
    title: "Memory Integrity",
    subtitle: "Garantía de integridad de código en memoria RAM",
    targetMechanism: "HVCI Page Table Protections & Driver Signing Verification in Hypervisor",
    targetComponent: "hvci.sys / Secure Kernel MMU",
    commandName: "Get-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity' -Name Enabled",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "La integridad de memoria utiliza el hardware de MMU del procesador para marcar páginas de memoria ejecutable como no-escribibles, evitando ataques de inyección de código dinámico.",
      mythVsTruth: {
        mentira: "Cualquier programa puede asignar páginas de memoria que sean simultáneamente R/W/X (Lectura, Escritura y Ejecución).",
        verdad: "La Integridad de Memoria prohíbe la creación de páginas de memoria W^X (Write XOR Execute) en el kernel, anulando clases enteras de exploits.",
        comprobalo: "Verificá la clave de registro de HypervisorEnforcedCodeIntegrity mediante PowerShell."
      }
    },
    entende: {
      queEs: "Una función específica de Core Isolation que previene ataques de inyección de código no firmado en las páginas de memoria de kernel.",
      paraQueSirve: "Bloquear ataques de ejecución de controladores maliciosos y explotación de buffer overflows en el kernel.",
      quePasaSiFalta: "Un atacante con exploit de kernel puede asignar memoria ejecutable sin firma de Microsoft."
    },
    interactua: {
      cliExample: "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity\"",
      psExample: "Get-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity' | Select-Object Enabled",
      syntaxBreakdown: "Lee la configuración de estado de HVCI guardada en el Registro de Windows.",
      whatToLookFor: "Enabled : 1.",
      technicalMetrics: "Cero páginas R/W/X permitidas dentro del Kernel de Windows."
    },
    alertaEVO: {
      reversibilityRule: "Reversible en el Registro o mediante la UI de Seguridad de Windows con reinicio del sistema.",
      safetyWarning: "Requiere reinicio del sistema operativo para aplicar o remover los candados del hipervisor."
    },
    evidenceBadge: {
      code: "MEM-INTEG",
      label: "Memory Integrity"
    }
  },
  {
    id: "inv-21-11",
    code: "21.11",
    title: "Secure Boot",
    subtitle: "Cadena de confianza criptográfica desde el firmware UEFI",
    targetMechanism: "UEFI Secure Boot Database (PK, KEK, db, dbx) & Firmware Signature Validation",
    targetComponent: "UEFI NVRAM / bootmgr.efi / ntoskrnl.exe",
    commandName: "Confirm-SecureBootUEFI",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Secure Boot asegura que el equipo inicie únicamente utilizando software firmado y respaldado por fabricantes de confianza, previniendo rootkits y bootkits de firmware.",
      mythVsTruth: {
        mentira: "Secure Boot es un sistema operativo secundario que escanea discos duros.",
        verdad: "Secure Boot es una especificación UEFI que valida la firma criptográfica de los cargadores de arranque (EFI) antes de pasar el control al procesador.",
        comprobalo: "Ejecutá Confirm-SecureBootUEFI en PowerShell elevado para verificar la cadena de confianza en tu placa madre."
      }
    },
    entende: {
      queEs: "El estándar de seguridad de la interfaz UEFI que verifica las firmas del código de arranque.",
      paraQueSirve: "Impedir la carga de bootkits y sistemas operativos alterados no autorizados en el proceso de encendido.",
      quePasaSiFalta: "Un malware de nivel bootkit puede infectar el sector EFI e inactivar el sistema operativo antes de que cargue el antivirus."
    },
    interactua: {
      cliExample: "powershell Confirm-SecureBootUEFI",
      psExample: "Confirm-SecureBootUEFI",
      syntaxBreakdown: "Consulta las variables NVRAM de la UEFI mediante la API de Windows para confirmar la validación de arranque seguro.",
      whatToLookFor: "True indica que la cadena de firmas UEFI está activa y forzada.",
      technicalMetrics: "Validación de firma RSA/ECDSA realizada en etapa PRE-OS en microsegundos."
    },
    alertaEVO: {
      reversibilityRule: "Solo modificable ingresando a la BIOS/UEFI de la placa base.",
      safetyWarning: "No desactivar Secure Boot salvo para instalación de sistemas no firmados en laboratorios aislados."
    },
    evidenceBadge: {
      code: "UEFI-SEC",
      label: "Secure Boot Chain"
    }
  },
  {
    id: "inv-21-12",
    code: "21.12",
    title: "TPM",
    subtitle: "Módulo de plataforma confiable para criptografía por hardware",
    targetMechanism: "TPM 2.0 Security Processor, Endorsement Keys (EK), PCRs & Hardware Cryptography",
    targetComponent: "tpm.msc / TBS (TPM Base Services)",
    commandName: "Get-Tpm",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El TPM es un chip físico (o firmware fTPM/dTPM) aislado que guarda claves criptográficas, certificados e índices de salud del sistema inaccesibles para el software habitual.",
      mythVsTruth: {
        mentira: "El TPM es simplemente una contraseña guardada en el disco SSD para Windows Hello.",
        verdad: "El TPM realiza operaciones criptográficas autónomas en hardware dedicado y valida las mediciones de los registros PCR antes de liberar la clave de cifrado de BitLocker.",
        comprobalo: "Ejecutá Get-Tpm en PowerShell para verificar la presencia, activación y estado de propiedad del chip TPM."
      }
    },
    entende: {
      queEs: "Un microcontrolador seguro diseñado para proporcionar funciones criptográficas basadas en hardware.",
      paraQueSirve: "Almacenar claves de BitLocker, datos biométricos de Windows Hello y attestation de salud del sistema.",
      quePasaSiFalta: "Las claves de cifrado quedan guardadas en software en el disco o en la memoria RAM habitual."
    },
    interactua: {
      cliExample: "wmic /namespace:\\root\\cimv2\\security\\microsofttpm path win32_tpm get IsEnabled_InitialValue,SpecVersion",
      psExample: "Get-Tpm | Select-Object TpmPresent, TpmReady, TpmEnabled, ManufacturerVersion",
      syntaxBreakdown: "Consulta el estado del servicio TBS y WMI TPM para verificar la readiness del hardware seguro.",
      whatToLookFor: "TpmPresent: True, TpmReady: True, SpecVersion: 2.0.",
      technicalMetrics: "Generador de números aleatorios por hardware (TRNG) de estándar militar."
    },
    alertaEVO: {
      reversibilityRule: "Informativo. La limpieza del TPM (Clear TPM) debe hacerse con respaldo previo de claves de BitLocker.",
      safetyWarning: "¡CUIDADO! Limpiar el TPM sin respaldar la clave de recuperación de BitLocker destruirá el acceso a los datos cifrados."
    },
    evidenceBadge: {
      code: "TPM-HW",
      label: "TPM 2.0 Hardware"
    }
  },
  {
    id: "inv-21-13",
    code: "21.13",
    title: "UAC",
    subtitle: "Control de cuentas de usuario y segregación de privilegios",
    targetMechanism: "User Account Control (UAC), Token Splitting & consent.exe",
    targetComponent: "appinfo.dll / consent.exe / AIS (Application Information Service)",
    commandName: "Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System' -Name EnableLUA",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Aunque inicies sesión en Windows con una cuenta de Administrador, UAC genera dos tokens: uno estándar para el uso diario y uno elevado reservado para autorizaciones explícitas.",
      mythVsTruth: {
        mentira: "Si mi usuario dice 'Administrador', todos los programas que abro corren automáticamente con control total del sistema.",
        verdad: "Windows ejecuta por defecto todos los programas con el token filtrado de usuario estándar hasta que una solicitud de elevación (consent.exe) aprueba el token completo.",
        comprobalo: "Consulta la clave del registro EnableLUA para verificar que la arquitectura LUA (Limited User Account) esté activa."
      }
    },
    entende: {
      queEs: "La infraestructura que evita que los programas realicen cambios no autorizados en el sistema sin confirmación.",
      paraQueSirve: "Separar la ejecución diaria no privilegiada del acceso administrativo de modificación del sistema.",
      quePasaSiFalta: "Cualquier programa o script descargado adquiere derechos de escritura en System32 y Registry HKLM inmediatamente."
    },
    interactua: {
      cliExample: "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System\" /v EnableLUA",
      psExample: "Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System' | Select-Object EnableLUA, ConsentPromptBehaviorAdmin",
      syntaxBreakdown: "Inspecciona la política LUA y el comportamiento del diálogo de consentimiento para cuentas de administrador.",
      whatToLookFor: "EnableLUA : 1, ConsentPromptBehaviorAdmin : 5 (PromptForConsentOnSecureDesktop) o 2.",
      technicalMetrics: "Escritorio Seguro (Secure Desktop) aísla el diálogo de consent.exe en una sesión de gráficos separada."
    },
    alertaEVO: {
      reversibilityRule: "Reversible ajustando el nivel de UAC desde el Panel de Control o el Registro.",
      safetyWarning: "Desactivar UAC (EnableLUA=0) invalida las restricciones de seguridad para aplicaciones de Microsoft Store y sandbox de navegadores."
    },
    evidenceBadge: {
      code: "UAC-TOKEN",
      label: "UAC Privileges"
    }
  },
  {
    id: "inv-21-14",
    code: "21.14",
    title: "Tokens",
    subtitle: "Tokens de acceso del núcleo y credenciales de sesión",
    targetMechanism: "Windows Access Tokens (Primary & Impersonation Tokens), Privileges & Groups",
    targetComponent: "LSASS.exe / Kernel Security Reference Monitor (SRM)",
    commandName: "whoami /priv",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Cada proceso en Windows tiene adjunto un 'Access Token' generado por LSASS durante la autenticación, el cual especifica el SID del usuario, sus grupos y privilegios especiales.",
      mythVsTruth: {
        mentira: "Los permisos de un programa se determinan consultando la contraseña del usuario en cada operación de archivo.",
        verdad: "El kernel de Windows adjunta un token de seguridad a cada proceso al crearse y compara este token contra las listas ACL de los objetos.",
        comprobalo: "Ejecutá whoami /priv en la consola para listar todos los privilegios especiales (Enabled/Disabled) adjuntos a tu token actual."
      }
    },
    entende: {
      queEs: "El objeto de objeto de seguridad que describe el contexto de seguridad de un proceso o hilo.",
      paraQueSirve: "Permitir que el Kernel Security Reference Monitor (SRM) valide accesos a archivos, claves y recursos de red.",
      quePasaSiFalta: "Sin tokens de acceso, el sistema operativo no tendría forma de autenticar ni autorizar operaciones de hilos."
    },
    interactua: {
      cliExample: "whoami /priv",
      psExample: "whoami /all",
      syntaxBreakdown: "Muestra el nombre de usuario, SID, grupos pertenecientes y lista completa de privilegios (ej. SeBackupPrivilege, SeDebugPrivilege).",
      whatToLookFor: "SeDebugPrivilege (Disabled por defecto para procesos estándar, necesario para inspeccionar memoria de otros procesos).",
      technicalMetrics: "Estructura de kernel TOKEN administrada exclusivamente por la capa SRM."
    },
    alertaEVO: {
      reversibilityRule: "Informativo. Los privilegios de un token no se pueden alterar arbitrariamente sin herramientas de elevación o APIs de Impersonation.",
      safetyWarning: "Monitorear procesos no autorizados que intenten habilitar SeDebugPrivilege o SeTcbPrivilege."
    },
    evidenceBadge: {
      code: "TOKEN-SRM",
      label: "Access Token SRM"
    }
  },
  {
    id: "inv-21-15",
    code: "21.15",
    title: "SID",
    subtitle: "Identificadores de seguridad unívocos (Security Identifiers)",
    targetMechanism: "Security Identifier Structure (S-1-5-21-...) & SAM / Active Directory Database",
    targetComponent: "SAM Registry Hive / NTDS.dit",
    commandName: "whoami /user",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "A Windows no le importa tu nombre de usuario 'Carlos' o 'Admin'. Internamente, todo objeto de usuario, grupo y equipo es representado por una cadena numérica inmutable llamada SID.",
      mythVsTruth: {
        mentira: "Si renombras la cuenta de usuario 'Administrador' a 'UsuarioComun', cambias sus permisos fundamentales en Windows.",
        verdad: "El renombrado de cuenta conserva exactamente el mismo SID bien conocido (ej. terminado en -500), por lo que conserva el 100% de sus permisos.",
        comprobalo: "Ejecutá whoami /user para ver el valor exacto de tu SID (S-1-5-21-...)."
      }
    },
    entende: {
      queEs: "Un valor de longitud variable asignado de forma única a cada entidad de seguridad en Windows.",
      paraQueSirve: "Garantizar que las reglas de control de acceso se mantengan estables aunque se cambien los nombres visibles de usuarios o grupos.",
      quePasaSiFalta: "Se producirían colisiones de permisos y ambigüedades de auditoría al renombrar objetos."
    },
    interactua: {
      cliExample: "wmic useraccount get name,sid",
      psExample: "Get-LocalUser | Select-Object Name, SID",
      syntaxBreakdown: "Lista todas las cuentas locales con sus respectivos Security Identifiers.",
      whatToLookFor: "S-1-5-21-...-500 (Administrador local) y S-1-5-21-...-501 (Invitado).",
      technicalMetrics: "S-1-5-18 es siempre el SID universal del sistema local (SYSTEM)."
    },
    alertaEVO: {
      reversibilityRule: "Informativo. Los SIDs son generados por el subsistema SAM durante la creación del objeto.",
      safetyWarning: "No intentar clonar SIDs entre instalaciones no unidas por Sysprep en imitación de imágenes."
    },
    evidenceBadge: {
      code: "SID-STRUCT",
      label: "Security Identifier"
    }
  },
  {
    id: "inv-21-16",
    code: "21.16",
    title: "ACL",
    subtitle: "Listas de control de acceso (DACL y SACL) en el sistema NTFS",
    targetMechanism: "Discretionary Access Control Lists (DACL), Access Control Entries (ACE) & SACL Audit",
    targetComponent: "icacls.exe / Security Descriptor (SDDL)",
    commandName: "icacls C:\\Windows\\System32",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Cada archivo, carpeta, clave de registro y proceso posee un Descriptor de Seguridad conteniendo una DACL (quién entra) y una SACL (qué auditorías se registran).",
      mythVsTruth: {
        mentira: "Los permisos de archivos solo se resumen en 'Lectura', 'Escritura' y 'Ejecución'.",
        verdad: "NTFS soporta granularidad extrema con 14 permisos individuales (Write Attributes, Delete Subfolders, Change Permissions, Take Ownership, etc.).",
        comprobalo: "Ejecutá icacls sobre un directorio del sistema para inspeccionar la lista completa de ACEs aplicadas."
      }
    },
    entende: {
      queEs: "El mecanismo mediante el cual se otorgan o deniegan permisos explícitos a usuarios o grupos sobre objetos del sistema.",
      paraQueSirve: "Proteger la confidencialidad e integridad de archivos del sistema operativo y aplicaciones.",
      quePasaSiFalta: "Cualquier proceso podría modificar binarios del sistema operativo o leer archivos privados de otros usuarios."
    },
    interactua: {
      cliExample: "icacls \"C:\\Program Files\"",
      psExample: "Get-Acl -Path \"C:\\Windows\" | Select-Object -ExpandProperty Access",
      syntaxBreakdown: "Muestra las entradas de control de acceso (ACEs) asociadas al objeto especificado.",
      whatToLookFor: "NT AUTHORITY\\SYSTEM:(F) y BUILTIN\\Administrators:(F) indicando Full Control.",
      technicalMetrics: "Evaluación de DACL realizada en kernel en orden secuencial (Deny explícito siempre precede a Allow)."
    },
    alertaEVO: {
      reversibilityRule: "Los permisos desconfigurados se pueden restaurar usando icacls /reset.",
      safetyWarning: "No otorgar permisos 'Everyone:(F)' en la raíz C:\\ ni en directorios de System32."
    },
    evidenceBadge: {
      code: "ACL-DACL",
      label: "NTFS DACL / SACL"
    }
  },
  {
    id: "inv-21-17",
    code: "21.17",
    title: "TrustedInstaller",
    subtitle: "El propietario supremo de los archivos del sistema operativo",
    targetMechanism: "Windows Modules Installer Service (TrustedInstaller SID: S-1-5-80-956008885-...) & Component Ownership",
    targetComponent: "TrustedInstaller.exe / Servicing Stack",
    commandName: "icacls C:\\Windows\\Servicing",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Ni siquiera el Administrador ni la cuenta SYSTEM son dueños de los archivos críticos de System32: el verdadero dueño con permisos de modificación es TrustedInstaller.",
      mythVsTruth: {
        mentira: "Si eres Administrador en Windows, tienes permiso por defecto para borrar o modificar cualquier archivo en C:\\Windows\\System32.",
        verdad: "Windows asigna la propiedad de los binarios del SO a la entidad especial TrustedInstaller para impedir que el usuario destruya el sistema operativo por error.",
        comprobalo: "Usa icacls en un DLL de System32 y observa cómo 'NT SERVICE\\TrustedInstaller' posee el control total (F)."
      }
    },
    entende: {
      queEs: "El servicio de instalación de módulos de Windows que actúa como la máxima autoridad sobre los archivos del kernel y subsistemas.",
      paraQueSirve: "Proteger los componentes críticos de actualizaciones y modificaciones no autorizadas por usuarios o instaladores de terceros.",
      quePasaSiFalta: "Cualquier programa instalado podría reemplazar DLLs del sistema con versiones incompatibles o infectadas."
    },
    interactua: {
      cliExample: "icacls \"C:\\Windows\\System32\\kernel32.dll\"",
      psExample: "(Get-Acl \"C:\\Windows\\System32\\kernel32.dll\").Owner",
      syntaxBreakdown: "Obtiene el propietario oficial asignado en el Descriptor de Seguridad de un archivo crítico.",
      whatToLookFor: "NT SERVICE\\TrustedInstaller.",
      technicalMetrics: "Servicio activado bajo demanda para aplicar paquetes CBS/WUSA."
    },
    alertaEVO: {
      reversibilityRule: "Si cambias la propiedad de un archivo de sistema, puedes restaurarla asignando de nuevo el propietario 'NT SERVICE\\TrustedInstaller'.",
      safetyWarning: "No cambiar masivamente la propiedad de C:\\Windows a Administrators."
    },
    evidenceBadge: {
      code: "TRUSTED-OWN",
      label: "TrustedInstaller"
    }
  },
  {
    id: "inv-21-18",
    code: "21.18",
    title: "SYSTEM",
    subtitle: "El contexto de cuenta local de máxima autoridad de procesos (NT AUTHORITY\\SYSTEM)",
    targetMechanism: "Local System Account (S-1-5-18) & System Process Execution Context",
    targetComponent: "lsass.exe / services.exe / winlogon.exe",
    commandName: "whoami",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "NT AUTHORITY\\SYSTEM es la cuenta interna bajo la cual operan los servicios centrales del kernel, drivers y subsistemas de Windows, poseyendo privilegios ilimitados sobre el equipo local.",
      mythVsTruth: {
        mentira: "La cuenta Administrador tiene más autoridad que el proceso SYSTEM.",
        verdad: "SYSTEM supera a Administrator en privilegios operativos locales, pudiendo acceder a claves del registro protegidas (como SAM/SECURITY) inalcanzables para administradores.",
        comprobalo: "Observa en el Administrador de Tareas cuántos procesos del núcleo corren bajo la cuenta SYSTEM."
      }
    },
    entende: {
      queEs: "La cuenta de servicio integrada utilizada por el sistema operativo Windows para ejecutar tareas del núcleo.",
      paraQueSirve: "Garantizar la ejecución de tareas de infraestructura independientes de las sesiones de usuario interactivas.",
      quePasaSiFalta: "Imposible iniciar el sistema operativo, cargar drivers o autenticar usuarios."
    },
    interactua: {
      cliExample: "psexec -s -i cmd.exe (en entorno de laboratorio)",
      psExample: "Get-Process | Where-Object {$_.StartInfo.EnvironmentVariables['USERNAME'] -eq 'SYSTEM'}",
      syntaxBreakdown: "Identifica procesos en ejecución bajo la identidad de NT AUTHORITY\\SYSTEM.",
      whatToLookFor: "Procesos clave como services.exe, lsass.exe, svchost.exe.",
      technicalMetrics: "SID inmutable S-1-5-18 sin contraseña asociada."
    },
    alertaEVO: {
      reversibilityRule: "Informativo. No se puede iniciar sesión directamente como SYSTEM mediante la pantalla de login interactiva.",
      safetyWarning: "Cualquier proceso no reconocido que corra como SYSTEM debe investigarse inmediatamente por posible escalamiento de privilegios."
    },
    evidenceBadge: {
      code: "SYS-AUTH",
      label: "NT AUTHORITY\\SYSTEM"
    }
  },
  {
    id: "inv-21-19",
    code: "21.19",
    title: "Administrator",
    subtitle: "El rol administrativo de gestión de sistema y políticas",
    targetMechanism: "Built-in Administrator Group (S-1-5-32-544) & Security Policies",
    targetComponent: "SAM / Local Users and Groups (lusrmgr.msc)",
    commandName: "net localgroup Administrators",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Ser Administrador otorga el derecho de asumir la propiedad (Take Ownership) de cualquier objeto en el sistema, lo que le permite reasignar permisos incluso donde no los tenía.",
      mythVsTruth: {
        mentira: "Si una carpeta dice 'Acceso denegado' a un Administrador, este no tiene forma de acceder a su contenido.",
        verdad: "Un Administrador siempre puede usar su privilegio SeTakeOwnershipPrivilege para hacerse propietario de la carpeta y redefinir su DACL.",
        comprobalo: "Lista los miembros del grupo Administrators local ejecutando net localgroup Administrators."
      }
    },
    entende: {
      queEs: "El grupo de seguridad predeterminado que otorga derechos completos de administración operativa sobre la computadora.",
      paraQueSirve: "Instalar controladores, administrar servicios, modificar el registro HKLM y configurar políticas de red.",
      quePasaSiFalta: "El equipo queda sin capacidad de mantenimiento o configuración técnica."
    },
    interactua: {
      cliExample: "net localgroup Administrators",
      psExample: "Get-LocalGroupMember -Group \"Administrators\"",
      syntaxBreakdown: "Lista los usuarios y grupos que pertenecen al grupo local de Administradores.",
      whatToLookFor: "Cuentas autorizadas conocidas. Ningún usuario desconocido debe figurar aquí.",
      technicalMetrics: "SID de grupo bien conocido S-1-5-32-544."
    },
    alertaEVO: {
      reversibilityRule: "Se pueden remover o agregar usuarios al grupo mediante Remove-LocalGroupMember / Add-LocalGroupMember.",
      safetyWarning: "No utilizar la cuenta Administrator predeterminada sin contraseña para tareas diarias de navegación web."
    },
    evidenceBadge: {
      code: "ADMIN-GROUP",
      label: "Built-in Administrators"
    }
  },
  {
    id: "inv-21-20",
    code: "21.20",
    title: "Integrity Levels",
    subtitle: "Niveles de integridad Mandatory Integrity Control (MIC)",
    targetMechanism: "Mandatory Integrity Control (MIC), Process Integrity Levels & Security Labels",
    targetComponent: "Kernel SRM / Process Integrity Tokens",
    commandName: "icacls C:\\Windows\\System32 /mandatory",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Windows impone un control obligatorio (MIC) con 4 niveles primarios: Untrusted, Low, Medium, High y System. Un proceso de nivel inferior jamás puede escribir en uno de nivel superior.",
      mythVsTruth: {
        mentira: "Si dos procesos pertenecen al mismo usuario, pueden comunicarse y escribirse libremente en memoria entre sí.",
        verdad: "Un navegador web que corre en nivel 'Low Integrity' no puede enviar mensajes de control ni inyectar datos a un proceso de nivel 'Medium' o 'High' del mismo usuario.",
        comprobalo: "Inspecciona los procesos con Process Explorer o icacls para ver etiquetas como Mandatory Label\\Low Mandatory Level."
      }
    },
    entende: {
      queEs: "El mecanismo de seguridad que asigna un nivel de confianza a los procesos y objetos para restringir accesos de escritura verticales.",
      paraQueSirve: "Aislar las pestañas del navegador o aplicaciones de sandbox para evitar que infecten el resto del usuario.",
      quePasaSiFalta: "Un exploit de navegador en modo usuario estándar podría modificar archivos personales del usuario en disco directamente."
    },
    interactua: {
      cliExample: "icacls %USERPROFILE%\\AppData\\Local\\Temp\\Low",
      psExample: "Get-Process | Select-Object Name, Id, @{N='IntegrityLevel';E={$_.MainModule.FileName}}",
      syntaxBreakdown: "Consulta las carpetas configuradas con nivel de integridad bajo destinadas al sandbox de aplicaciones.",
      whatToLookFor: "Mandatory Label\\Low Mandatory Level en archivos temporales de navegadores.",
      technicalMetrics: "Prevención de inyección No-Write-Up (un proceso no puede escribir en objetos de mayor nivel)."
    },
    alertaEVO: {
      reversibilityRule: "Las etiquetas de integridad se gestionan mediante icacls /setintegritylevel.",
      safetyWarning: "No elevar artificialmente el nivel de integridad de aplicaciones web o navegadores a High."
    },
    evidenceBadge: {
      code: "MIC-LABEL",
      label: "Mandatory Integrity"
    }
  },
  {
    id: "inv-21-21",
    code: "21.21",
    title: "Por qué dos antivirus pueden empeorar el sistema",
    subtitle: "Colisión de drivers Minifilter, congelamientos y falsos positivos",
    targetMechanism: "FileSystem Minifilter Drivers (FLTMGR.sys) Collision & Kernel Race Conditions",
    targetComponent: "fltmmc.exe / Minifilter Altitude Conflicts",
    commandName: "fltmmc filters",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Tener dos antivirus con protección en tiempo real activa no duplica la seguridad: causa interbloqueos (deadlocks) en el kernel al intentar ambos analizar el mismo archivo simultáneamente.",
      mythVsTruth: {
        mentira: "Instalar dos antivirus brinda doble capa de protección insuperable.",
        verdad: "Dos motores Minifilters compitiendo en el mismo 'Altitude' de I/O provocan congelamientos del sistema, lecturas infinitas de disco y caídas en BSOD.",
        comprobalo: "Ejecutá fltmmc filters en CMD administrativo para ver la jerarquía de altitudes de los filtros de sistema de archivos."
      }
    },
    entende: {
      queEs: "El análisis técnico de los conflictos de arquitectura generados por múltiples controladores de filtro I/O de tiempo real.",
      paraQueSirve: "Comprender la administración adecuada de motores de seguridad y por qué Windows desactiva Defender si detecta otro antivirus activo.",
      quePasaSiFalta: "Un sistema con dos antivirus activos sufre ralentización masiva de I/O de disco y cuelgues aleatorios."
    },
    interactua: {
      cliExample: "fltmmc filters",
      psExample: "Get-CimInstance -ClassName Win32_FilterDriver",
      syntaxBreakdown: "Lista todos los minifiltros cargados en el Administrador de Filtros (FLTMGR.sys) y sus altitudes de procesamiento.",
      whatToLookFor: "Cada controlador de antivirus debe tener asignado un rango de Altitud único por Microsoft (ej. 320000-329999).",
      technicalMetrics: "Aumento drástico de latencia I/O de disco de 2ms a >500ms en caso de contención."
    },
    alertaEVO: {
      reversibilityRule: "Informativo. La solución consiste en dejar un solo motor con protección en tiempo real activa.",
      safetyWarning: "Windows Defender se desactiva automáticamente al instalar un antivirus compatible de terceros para prevenir este problema exacto."
    },
    evidenceBadge: {
      code: "AV-COLLISION",
      label: "Minifilter Collision"
    }
  },
  {
    id: "inv-21-22",
    code: "21.22",
    title: "Cuándo Defender alcanza y cuándo puede requerirse otra solución",
    subtitle: "Evaluación objetiva de capacidades: Hogar vs. Empresa y EDR avanzado",
    targetMechanism: "Feature Matrix: Defender Antivirus vs Microsoft Defender for Endpoint (MDE) & Third-Party EDRs",
    targetComponent: "Security Center / Enterprise Management (Intune/GPO)",
    commandName: "Get-MpPreference",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Para el 99% de los usuarios domésticos y profesionales independientes, Defender integrado es óptimo. Las empresas requieren soluciones EDR por telemetría centralizada, no por firma de virus.",
      mythVsTruth: {
        mentira: "Defender no es suficiente para ningún usuario serio porque es 'gratuito'.",
        verdad: "El motor de detección de Defender obtiene continuamente puntuaciones máximas en laboratorios independientes (AV-TEST, AV-Comparatives); la diferencia empresarial radica en la consola SIEM/EDR.",
        comprobalo: "Inspecciona la amplitud de configuraciones avanzadas disponibles en Get-MpPreference."
      }
    },
    entende: {
      queEs: "La matriz de decisión técnica para seleccionar la arquitectura de seguridad adecuada según el perfil de uso.",
      paraQueSirve: "Tomar decisiones de inversión tecnológica fundamentadas en datos reales de telemetría y superficie de ataque.",
      quePasaSiFalta: "Gasto innecesario en licencias redundantes o falta de visibilidad en redes corporativas complejas."
    },
    interactua: {
      cliExample: "powershell Get-MpPreference | fl *Disable*, *AttackSurface*",
      psExample: "Get-MpPreference | Select-Object EnableNetworkProtection, AttackSurfaceReductionRules_Ids",
      syntaxBreakdown: "Revisa las reglas de reducción de superficie de ataque (ASR) disponibles dentro de la suite de Defender.",
      whatToLookFor: "Reglas ASR configuradas para bloquear macros de Office, scripts maliciosos y abuso de credenciales.",
      technicalMetrics: "Evaluaciones AV-TEST de 6.0/6.0 en Protección, Rendimiento y Usabilidad."
    },
    alertaEVO: {
      reversibilityRule: "Informativo.",
      safetyWarning: "Complementar siempre la protección con respaldos desconectados (3-2-1) independientemente del antivirus elegido."
    },
    evidenceBadge: {
      code: "SEC-VERDICT",
      label: "Security Architecture"
    }
  }
];

export const SECTOR_21_MINICASES: Sector21MiniCase[] = [
  {
    id: "case-21-01",
    code: "CASE-21-01",
    title: "El script de PowerShell que intentó apagar Defender",
    scenario: "Un técnico de soporte descargó un ejecutable que prometía 'optimizar' Windows. Al ejecutarlo, apareció una ventana breve de PowerShell intentando ejecutar Set-MpPreference -DisableRealtimeMonitoring $true.",
    userStatement: "¡Intenté desactivar Defender desde PowerShell como Administrador pero el comando falló silenciosamente y Defender sigue activo!",
    initialMistake: "Pensar que ser Administrador le da derecho absoluto de apagar la seguridad contra Tamper Protection.",
    diagnosticQuestion: "¿Qué mecanismo de seguridad impidió que el script modificara la protección en tiempo real?",
    options: [
      {
        id: "opt-1",
        text: "Tamper Protection (Protección contra manipulación) bloqueó el cambio no autorizado.",
        isCorrect: true,
        explanation: "Correcto. Tamper Protection ignora solicitudes de cambio en el registro o comandos de PowerShell referentes a funciones clave de Defender a menos que sean realizadas interactivamente en la GUI."
      },
      {
        id: "opt-2",
        text: "El firewall de Windows bloqueó el puerto de PowerShell.",
        isCorrect: false,
        explanation: "El firewall no interfiere con comandos locales de PowerShell."
      },
      {
        id: "opt-3",
        text: "PowerShell no tiene permisos para usar el cmdlet Set-MpPreference.",
        isCorrect: false,
        explanation: "Set-MpPreference es un cmdlet oficial, pero Tamper Protection protege el parámetro DisableRealtimeMonitoring."
      }
    ],
    technicalVerdict: "Tamper Protection operó según su diseño, neutralizando la desactivación automatizada del antivirus.",
    lessonLearned: "Tamper Protection es la primera línea de defensa contra scripts de malware que buscan cegar al sistema antes de atacar."
  },
  {
    id: "case-21-02",
    code: "CASE-21-02",
    title: "Cuelgues masivos al instalar un segundo antivirus comercial",
    scenario: "En una empresa se instaló un segundo antivirus de terceros sin desinstalar previamente el software antivirus previo ni verificar los controladores de filtro.",
    userStatement: "La PC tarda 10 minutos en abrir cualquier carpeta y el uso de disco está permanentemente al 100%.",
    initialMistake: "Asumir que dos antivirus ofrecen 'el doble de seguridad' en tiempo real.",
    diagnosticQuestion: "¿Qué conflicto técnico a nivel de kernel está causando el problema?",
    options: [
      {
        id: "opt-1",
        text: "Conflicto y contención entre dos drivers Minifilter de sistema de archivos compitiendo en el Administrador de Filtros (FLTMGR.sys).",
        isCorrect: true,
        explanation: "Correcto. Ambos controladores intentan interceptar y bloquear la misma llamada I/O de archivo, generando un cuello de botella severo."
      },
      {
        id: "opt-2",
        text: "Falta de espacio en la memoria RAM para las firmas estáticas.",
        isCorrect: false,
        explanation: "El problema de rendimiento es por contención de I/O en la pila de filtros de disco, no solo almacenamiento de firmas."
      },
      {
        id: "opt-3",
        text: "Incompatibilidad entre las claves de cifrado de BitLocker.",
        isCorrect: false,
        explanation: "BitLocker realiza cifrado transparente y no colisiona con el software antivirus."
      }
    ],
    technicalVerdict: "Incompatibilidad de arquitectura por presencia simultánea de dos motores de inspección I/O activa.",
    lessonLearned: "Nunca se deben mantener dos antivirus con protección en tiempo real activados simultáneamente en el mismo sistema operativo."
  }
];

export const SECTOR_21_TEST_BANK: Sector21TestQuestion[] = [
  {
    id: "q-21-01",
    questionNumber: 1,
    category: "Arquitectura de Seguridad",
    question: "¿Qué subsistema de Windows aísla la verificación de firmas de código en un entorno virtualizado inaccesible para el kernel habitual?",
    options: [
      { id: "a", text: "Core Isolation / HVCI (Virtualization-Based Security)" },
      { id: "b", text: "Windows Firewall WFP" },
      { id: "c", text: "SmartScreen Zone Identifier" },
      { id: "d", text: "User Account Control LUA" }
    ],
    correctOptionId: "a",
    technicalExplanation: "HVCI (Hypervisor-Enforced Code Integrity) ejecuta la verificación de integridad dentro del Secure Kernel gestionado por Hyper-V.",
    relatedInvestigationCode: "21.09"
  },
  {
    id: "q-21-02",
    questionNumber: 2,
    category: "Control de Acceso y Privilegios",
    question: "¿Quién es el propietario predeterminado de los binarios críticos en C:\\Windows\\System32?",
    options: [
      { id: "a", text: "NT AUTHORITY\\SYSTEM" },
      { id: "b", text: "BUILTIN\\Administrators" },
      { id: "c", text: "NT SERVICE\\TrustedInstaller" },
      { id: "d", text: "El usuario que instaló Windows" }
    ],
    correctOptionId: "c",
    technicalExplanation: "TrustedInstaller es el propietario designado de los componentes del SO para prevenir modificaciones no autorizadas incluso por administradores.",
    relatedInvestigationCode: "21.17"
  },
  {
    id: "q-21-03",
    questionNumber: 3,
    category: "Criptografía y Arranque Seguro",
    question: "¿Cuál es la función principal de la tecnología Secure Boot basada en UEFI?",
    options: [
      { id: "a", text: "Cifrar el disco duro con una clave de 256 bits." },
      { id: "b", text: "Verificar las firmas criptográficas del firmware y del cargador de arranque antes de ejecutar el sistema operativo." },
      { id: "c", text: "Bloquear puertos USB que no contengan licencias corporativas." },
      { id: "d", text: "Aumentar la velocidad de reloj del procesador en el arranque." }
    ],
    correctOptionId: "b",
    technicalExplanation: "Secure Boot valida la cadena de confianza cifrada desde la UEFI para impedir que se carguen bootkits no firmados.",
    relatedInvestigationCode: "21.11"
  }
];
