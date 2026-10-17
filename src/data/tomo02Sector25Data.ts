// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 25: ESCRITORIO REMOTO
// "Controlá otra PC desde la tuya"

export type RiskLevelSector25 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector25Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector25;
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

export interface Sector25MiniCase {
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

export interface Sector25TestQuestion {
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

export const SECTOR_25_INVESTIGATIONS: Sector25Investigation[] = [
  {
    id: "inv-25-01",
    code: "25.01",
    title: "RDP (Remote Desktop Protocol)",
    subtitle: "El canal gráfico multicanal que transporta el escritorio a través de la red",
    targetMechanism: "Terminal Services Subsystem (TermService & rdpdr.sys)",
    targetComponent: "RDP Protocol Engine / Port 3389",
    commandName: "qwinsta / query session",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que RDP no envía imágenes ni video como TeamViewer, sino comandos de dibujo vectoriales e instrucciones GDI/DirectX estructurados en canales virtuales?",
      mythVsTruth: {
        mentira: "RDP transmite la pantalla enviando capturas de imagen continuas (screenshots a 30 FPS).",
        verdad: "RDP envía primitivas de dibujo gráfico, glifos de texto y comandos de renderizado acelerado por cliente, consumiendo una fracción del ancho de banda.",
        comprobalo: "Ejecutá `qwinsta` en PowerShell para ver las sesiones RDP activas y sus estados de canal."
      }
    },
    entende: {
      queEs: "Un protocolo propietario desarrollado por Microsoft (basado en la norma ITU-T T.128) para la gestión remota de escritorios sobre redes TCP/IP.",
      paraQueSirve: "Permite a un usuario conectarse e interactuar con la interfaz gráfica de un equipo remoto como si estuviese físicamente frente a él.",
      quePasaSiFalta: "Se pierde la capacidad nativa de administración gráfica remota sin instalar software de terceros."
    },
    interactua: {
      cliExample: "qwinsta /server:localhost",
      psExample: "Get-Service TermService | Select-Object Name, Status, StartType",
      syntaxBreakdown: "qwinsta muestra las sesiones de escritorio remoto activas (rdp-tcp#X), el usuario asociado, el ID de sesión y el estado de conexión.",
      whatToLookFor: "Estado 'Active' en la sesión rdp-tcp con un ID distinto de 0 (que corresponde a la consola física).",
      technicalMetrics: "Puerto por defecto: 3389 TCP/UDP. Latencia óptima RDP: <50ms. Ancho de banda típico: 100 Kbps - 2 Mbps."
    },
    alertaEVO: {
      reversibilityRule: "La inspección de sesiones RDP con `qwinsta` o `query session` es puramente informativa y segura.",
      safetyWarning: "No cierres abruptamente sesiones con `rwinsta` sin confirmar que no hay trabajos no guardados por otros usuarios."
    },
    evidenceBadge: {
      code: "RDP_CANAL_ACTIVO",
      label: "Terminal Services Engine Validado"
    }
  },
  {
    id: "inv-25-02",
    code: "25.02",
    title: "mstsc (Microsoft Terminal Services Client)",
    subtitle: "El cliente ejecutable nativo de conexión a Escritorio Remoto",
    targetMechanism: "mstsc.exe & %AppData%\\Local\\Microsoft\\Terminal Server Client",
    targetComponent: "Microsoft Terminal Services Client",
    commandName: "mstsc /v:IP_ADDRESS /f /admin",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El binario mstsc.exe incluye parámetros avanzados para forzar la sesión de consola `/admin`, saltar el diálogo inicial `/v:` y cargar archivos `.rdp` automatizados.",
      mythVsTruth: {
        mentira: "mstsc.exe es solo un acceso directo que abre la ventana azul donde ponés la IP.",
        verdad: "Es un cliente completo con soporte de parámetros por línea de comandos, redirección de hardware, portapapeles y múltiples monitores.",
        comprobalo: "Ejecutá `mstsc /?` para ver el menú completo de parámetros y modificadores de arranque."
      }
    },
    entende: {
      queEs: "El ejecutable nativo de Windows (Client GUI & CLI) utilizado para iniciar conexiones salientes RDP.",
      paraQueSirve: "Permite configurar resolución, colores, redirección de discos locales, audio, impresoras y credenciales guardadas.",
      quePasaSiFalta: "No podés iniciar conexiones RDP desde el sistema operativo sin aplicaciones de terceros."
    },
    interactua: {
      cliExample: "mstsc /v:192.168.1.100 /f /admin",
      psExample: "Start-Process mstsc.exe -ArgumentList '/v:192.168.1.100 /w:1920 /h:1080'",
      syntaxBreakdown: "/v: especifica la IP o Hostname de destino, /f inicia en pantalla completa, y /admin fuerza sesión administrativa.",
      whatToLookFor: "Apertura inmediata del cliente RDP intentando conectar al endpoint especificado.",
      technicalMetrics: "Ubicación del binario: C:\\Windows\\System32\\mstsc.exe. Configuración predeterminada guardada en Default.rdp."
    },
    alertaEVO: {
      reversibilityRule: "Iniciar mstsc.exe no altera configuraciones del sistema local.",
      safetyWarning: "Tener cuidado al guardar contraseñas en archivos .rdp en equipos compartidos."
    },
    evidenceBadge: {
      code: "MSTSC_CLIENT_OK",
      label: "Ejecutable RDP Nativo Operativo"
    }
  },
  {
    id: "inv-25-03",
    code: "25.03",
    title: "Host vs Client",
    subtitle: "Diferencia de licencias y capacidades entre Windows Home, Pro y Enterprise",
    targetMechanism: "fEnableHttp / fDenyTSConnections Registry Flags",
    targetComponent: "Windows Edition SKU Restrictions",
    commandName: "Get-CimInstance Win32_OperatingSystem | Select-Object Caption, OperatingSystemSKU",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Todas las ediciones de Windows (incluyendo Home) incluyen el CLIENTE `mstsc.exe`, pero solo las ediciones Pro, Enterprise y Server pueden actuar como SERVIDOR RDP.",
      mythVsTruth: {
        mentira: "Windows Home no puede conectarse por RDP a ninguna otra computadora.",
        verdad: "Windows Home SÍ puede conectarse a otras PC (funciona como cliente), pero NO puede recibir conexiones RDP entrantes de manera nativa.",
        comprobalo: "Comprobá tu edición con `Get-CimInstance Win32_OperatingSystem`."
      }
    },
    entende: {
      queEs: "La diferenciación de roles en el protocolo RDP impuesta por licenciamiento en las diferentes ediciones de Windows.",
      paraQueSirve: "Permite entender por qué un equipo Pro/Enterprise habilita la opción 'Escritorio remoto' en Configuración y un Home no.",
      quePasaSiFalta: "Intentar activar RDP Server en Windows Home dará error por falta de soporte de políticas y licenciamiento."
    },
    interactua: {
      cliExample: "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\" /v fDenyTSConnections",
      psExample: "Get-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server' -Name 'fDenyTSConnections'",
      syntaxBreakdown: "Si fDenyTSConnections es 0, el servidor RDP está HABILITADO. Si es 1, está DESHABILITADO.",
      whatToLookFor: "En Windows Pro/Enterprise, el valor se puede conmutar a 0 para permitir conexiones entrantes.",
      technicalMetrics: "SKU Windows Home: No soporta servidor RDP nativo. SKU Windows Pro/Ent: Conexión simultánea de 1 sesión remota."
    },
    alertaEVO: {
      reversibilityRule: "Consultar la clave del Registro no altera ningún valor.",
      safetyWarning: "Usar parches no oficiales para habilitar RDP Server en Windows Home vulnera los términos de licencia de Microsoft."
    },
    evidenceBadge: {
      code: "SKU_RDP_CAPABILITY",
      label: "Rol RDP Host/Client Verificado"
    }
  },
  {
    id: "inv-25-04",
    code: "25.04",
    title: "NLA (Network Level Authentication)",
    subtitle: "Capa de autenticación previa que blinda al servidor RDP antes de crear la sesión gráfica",
    targetMechanism: "CredSSP (Credential Security Support Provider) & User Authentication",
    targetComponent: "TermService Security Layer",
    commandName: "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp\" /v UserAuthentication",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Sin NLA, el servidor RDP abre una sesión gráfica de login completa en memoria antes de saber quién sos, dejando el equipo expuesto a ataques de denegación de servicio (DoS).",
      mythVsTruth: {
        mentira: "NLA es solo un aviso de contraseña incorrecta antes de entrar.",
        verdad: "NLA autentica al usuario a través de CredSSP/TLS ANTES de inicializar el subsistema gráfico y la sesión del usuario en el host.",
        comprobalo: "Verificá si NLA está activo en `UserAuthentication` (Valor 1 = Requerido)."
      }
    },
    entende: {
      queEs: "Un método de autenticación previa que exige al cliente identificarse mediante CredSSP antes de que el servidor cree la sesión RDP.",
      paraQueSirve: "Protege los recursos de la CPU y memoria del servidor contra ataques de fuerza bruta y saturación de sesiones no autenticadas.",
      quePasaSiFalta: "Desactivar NLA permite que clientes antiguos o no compatibles se conecten, pero expone gravemente la seguridad del sistema."
    },
    interactua: {
      cliExample: "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp\" /v UserAuthentication",
      psExample: "(Get-WmiObject -class \"Win32_TSGeneralSetting\" -Namespace \"root\\cimv2\\terminalservices\" -Filter \"TerminalName='RDP-tcp'\").UserAuthenticationRequired",
      syntaxBreakdown: "UserAuthentication = 1 indica NLA Obligatorio. UserAuthentication = 0 indica NLA Opcional/Desactivado.",
      whatToLookFor: "Valor 1 para la máxima postura de seguridad.",
      technicalMetrics: "Protocolo Subyacente: CredSSP. Requisito: TLS 1.2+ / Kerberos o NTLMv2."
    },
    alertaEVO: {
      reversibilityRule: "NLA debe permanecer SIEMPRE activo en entornos modernos.",
      safetyWarning: "Si deshabilitás NLA, cualquier escáner de red podrá provocar consumo alto de recursos en tu servidor RDP."
    },
    evidenceBadge: {
      code: "NLA_PROTECTION_ON",
      label: "Autenticación previa CredSSP Requerida"
    }
  },
  {
    id: "inv-25-05",
    code: "25.05",
    title: "Firewall",
    subtitle: "Apertura y filtrado de reglas en Windows Defender Firewall para el puerto 3389",
    targetMechanism: "Windows Defender Firewall Inbound Rules (RemoteDesktop-UserMode-In-TCP/UDP)",
    targetComponent: "netsh advfirewall / Firewall Rules",
    commandName: "netsh advfirewall firewall show rule name=\"Remote Desktop - UserMode (TCP-In)\"",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Incluso si activás Escritorio Remoto en Windows, si la regla del Firewall está bloqueada para el perfil de red 'Público', no vas a poder conectarte desde redes externas.",
      mythVsTruth: {
        mentira: "El puerto RDP (3389) se abre automáticamente en todas las interfaces sin importar el tipo de red.",
        verdad: "Windows Defender Firewall restringe las reglas de RDP por defecto al perfil Privado y Dominio, bloqueando el perfil Público por seguridad.",
        comprobalo: "Verificá el estado de la regla de firewall con `Get-NetFirewallRule -DisplayGroup 'Remote Desktop'`."
      }
    },
    entende: {
      queEs: "La configuración de filtrado de paquetes en la red local que autoriza las conexiones entrantes al puerto 3389.",
      paraQueSirve: "Garantiza que solo las solicitudes de red autorizadas a través de TCP y UDP 3389 alcancen el proceso `svchost.exe` de TermService.",
      quePasaSiFalta: "El cliente RDP mostrará el error 'No se puede conectar a la computadora remota' por tiempo de espera agotado (Timeout)."
    },
    interactua: {
      cliExample: "netsh advfirewall firewall show rule name=all dir=in group=\"Remote Desktop\"",
      psExample: "Get-NetFirewallRule -DisplayGroup \"Remote Desktop\" | Select-Object Name, Enabled, Direction, Action",
      syntaxBreakdown: "Muestra si las reglas de la agrupación 'Remote Desktop' están Habilitadas (True) o Deshabilitadas (False).",
      whatToLookFor: "Reglas 'RemoteDesktop-UserMode-In-TCP' y 'UDP' con Enabled: True.",
      technicalMetrics: "Puertos de escucha: 3389 TCP (control) y 3389 UDP (aceleración de gráficos y experiencia fluida)."
    },
    alertaEVO: {
      reversibilityRule: "Las reglas predefinidas de Windows Firewall se pueden habilitar o deshabilitar mediante comandos netsh o PowerShell.",
      safetyWarning: "No abras la regla RDP para el perfil 'Public' salvo que estés protegido detrás de una VPN."
    },
    evidenceBadge: {
      code: "FIREWALL_RDP_RULES",
      label: "Reglas 3389 Inbound Auditadas"
    }
  },
  {
    id: "inv-25-06",
    code: "25.06",
    title: "LAN",
    subtitle: "Conectividad en Red Local, resolución de nombres y subredes IP",
    targetMechanism: "NetBIOS / mDNS / LLMNR / Local IP Routing",
    targetComponent: "Local Area Network Stack",
    commandName: "Test-NetConnection -ComputerName 192.168.1.50 -Port 3389",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El cmdlet `Test-NetConnection` permite probar en un solo paso si la IP remota responde a nivel de red (Ping) y si el puerto RDP (3389) está escuchando.",
      mythVsTruth: {
        mentira: "Si le podés hacer ping a una PC, seguro te podés conectar por RDP.",
        verdad: "El ping usa ICMP y RDP usa TCP 3389; podés tener respuesta ICMP y que RDP esté bloqueado por Firewall o servicio detenido.",
        comprobalo: "Ejecutá `Test-NetConnection -ComputerName <IP> -Port 3389` desde PowerShell."
      }
    },
    entende: {
      queEs: "El establecimiento de comunicación directa punto a punto dentro de la misma subred o segmento Ethernet.",
      paraQueSirve: "Permite conectar clientes y hosts en oficinas o casas sin requerir salida a Internet ni enrutamiento complejo.",
      quePasaSiFalta: "Fallas en la máscara de subred o aislamiento de clientes (AP Isolation en Wi-Fi) impedirán la conexión RDP en LAN."
    },
    interactua: {
      cliExample: "ping 192.168.1.100",
      psExample: "Test-NetConnection -ComputerName 192.168.1.100 -Port 3389",
      syntaxBreakdown: "Test-NetConnection devuelve `TcpTestSucceeded: True` cuando el socket TCP 3389 responde correctamente.",
      whatToLookFor: "TcpTestSucceeded = True y PingSucceeded = True.",
      technicalMetrics: "Rango IP Privado típico: 192.168.x.x, 10.x.x.x, 172.16.x.x. Latencia LAN típica: <2ms."
    },
    alertaEVO: {
      reversibilityRule: "Diagnosticar con Test-NetConnection es completamente inofensivo.",
      safetyWarning: "Asegurate de que ambas computadoras estén conectadas a una red clasificada como 'Privada' en Windows."
    },
    evidenceBadge: {
      code: "LAN_CONNECTIVITY_OK",
      label: "Socket 3389 Verificado en Red Local"
    }
  },
  {
    id: "inv-25-07",
    code: "25.07",
    title: "VPN",
    subtitle: "Túneles cifrados seguros para transportar sesiones RDP sobre redes públicas",
    targetMechanism: "IPsec / WireGuard / OpenVPN Virtual Network Adapter",
    targetComponent: "Encrypted Tunneling Layer",
    commandName: "Get-NetAdapter | Where-Object Status -eq 'Up'",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "La mejor práctica de ciberseguridad a nivel mundial para RDP en empresas es NO abrir el puerto 3389 en el router, sino conectar primero una VPN y luego iniciar RDP a la IP privada.",
      mythVsTruth: {
        mentira: "Usar RDP por VPN hace que el escritorio se vea super lento e inutilizable.",
        verdad: "Los protocolos de VPN modernos como WireGuard agregan menos de 3ms de sobrecarga y cifran todo el canal sin impactar el rendimiento gráfico.",
        comprobalo: "Verificá tus adaptadores de red virtuales activos con `Get-NetAdapter`."
      }
    },
    entende: {
      queEs: "Una Red Privada Virtual que crea un tubo cifrado punto a punto entre la PC cliente externa y la red donde reside el servidor RDP.",
      paraQueSirve: "Oculta el tráfico RDP de Internet y evita la exposición de sockets directos a atacantes externos.",
      quePasaSiFalta: "Para conectar desde fuera de casa u oficina tendrías que exponer puertos directamente, lo cual es de altísimo riesgo."
    },
    interactua: {
      cliExample: "ipconfig /all",
      psExample: "Get-NetAdapter -Name *VPN*, *WireGuard*, *TAP* | Select-Object Name, InterfaceDescription, Status",
      syntaxBreakdown: "Muestra el estado del adaptador de red virtual asignado por el cliente VPN.",
      whatToLookFor: "Adaptador virtual con Status: Up e IP asignada dentro de la subred remota.",
      technicalMetrics: "Encapsulamiento: UDP 51820 (WireGuard) o UDP 1194 (OpenVPN). Cifrado: AES-256-GCM / ChaCha20."
    },
    alertaEVO: {
      reversibilityRule: "Las interfaces de red VPN se consultan sin modificar enrutamiento.",
      safetyWarning: "Nunca conectes a VPNs gratuitas de origen dudoso para administrar equipos con credenciales sensibles."
    },
    evidenceBadge: {
      code: "VPN_TUNNEL_CHECKED",
      label: "Capa de Cifrado de Red Auditada"
    }
  },
  {
    id: "inv-25-08",
    code: "25.08",
    title: "Quick Assist",
    subtitle: "Asistencia Rápida nativa de Windows basada en la nube y códigos temporales",
    targetMechanism: "ms-quick-assist: Protocol Handler / QuickAssist.exe",
    targetComponent: "Microsoft Cloud Assisted Remote Support",
    commandName: "start ms-quick-assist:",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Quick Assist funciona en Windows 10 y 11 (incluso ediciones Home) atravesando Firewalls y Routers sin abrir puertos, utilizando conexiones salientes HTTPS/WebSockets hacia servidores de Microsoft.",
      mythVsTruth: {
        mentira: "Para ayudar a un amigo con Windows Home hay que instalar sí o sí TeamViewer o AnyDesk.",
        verdad: "Windows incluye 'Asistencia Rápida' nativa. Solo requiere que una persona proporcione un código de 6 dígitos generado en tiempo real.",
        comprobalo: "Presioná `Ctrl + Win + Q` para lanzar Asistencia Rápida en cualquier Windows 10/11."
      }
    },
    entende: {
      queEs: "Una herramienta nativa de soporte remoto punto a punto basada en la nube de Microsoft.",
      paraQueSirve: "Permite a un técnico ver y controlar la pantalla de un usuario para resolver problemas sin configurar la red.",
      quePasaSiFalta: "Se puede reinstalar fácilmente desde la Microsoft Store o la sección de Características Opcionales."
    },
    interactua: {
      cliExample: "start ms-quick-assist:",
      psExample: "Get-AppxPackage -Name *QuickAssist*",
      syntaxBreakdown: "Lanza la aplicación de Asistencia Rápida instalada mediante el protocolo UWP registrado.",
      whatToLookFor: "Ventana de Asistencia Rápida pidiendo 'Obtener asistencia' (ingresar código) o 'Dar asistencia' (generar código).",
      technicalMetrics: "Puerto de red: 443 TCP Outbound (HTTPS / WebSockets). No requiere port forwarding."
    },
    alertaEVO: {
      reversibilityRule: "Lanzar la aplicación no realiza cambios en el sistema.",
      safetyWarning: "Nunca des control remoto mediante Quick Assist a desconocidos que te llamen diciendo ser del 'Soporte Técnico de Microsoft'."
    },
    evidenceBadge: {
      code: "QUICK_ASSIST_READY",
      label: "Herramienta Asistencia Rápida Disponible"
    }
  },
  {
    id: "inv-25-09",
    code: "25.09",
    title: "Remote Assistance",
    subtitle: "La herramienta legacy de invitaciones de soporte remoto (msra.exe)",
    targetMechanism: "msra.exe / Microsoft Remote Assistance Incident Files (.msrcIncident)",
    targetComponent: "Legacy Remote Assistance Infrastructure",
    commandName: "msra.exe /expert",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "msra.exe es el antecesor de Quick Assist y permite generar archivos de invitación cifrados (`.msrcIncident`) protegidos por contraseña para asistencia en redes locales y dominios.",
      mythVsTruth: {
        mentira: "msra.exe fue eliminado completamente en Windows 11.",
        verdad: "Sigue presente en `C:\\Windows\\System32\\msra.exe` para compatibilidad en entornos corporativos de Active Directory.",
        comprobalo: "Ejecutá `msra.exe` desde la consola de comandos."
      }
    },
    entende: {
      queEs: "La solución clásica de Asistencia Remota de Windows integrada desde la época de Windows XP/7.",
      paraQueSirve: "Permite enviar solicitudes de ayuda adjuntando archivos de invitación por correo o compartidos en red.",
      quePasaSiFalta: "Los entornos corporativos que dependen de DirectAccess o scripts de soporte legado pueden requerir su presencia."
    },
    interactua: {
      cliExample: "msra.exe /expert",
      psExample: "Start-Process msra.exe -ArgumentList '/expert'",
      syntaxBreakdown: "Abre la ventana de Asistencia Remota en modo experto para ofrecer ayuda a un usuario remoto.",
      whatToLookFor: "Interfaz clásica de 'Ofrecer asistencia remota' o 'Invitar a alguien de confianza'.",
      technicalMetrics: "Ubicación: C:\\Windows\\System32\\msra.exe. Utiliza puertos dinámicos RPC/DCOM y RDP subyacente."
    },
    alertaEVO: {
      reversibilityRule: "msra.exe no modifica configuraciones a menos que se acepte una sesión activa.",
      safetyWarning: "En redes modernas sin Dominio, se prefiere Quick Assist sobre msra.exe por mayor facilidad de uso."
    },
    evidenceBadge: {
      code: "MSRA_LEGACY_VERIFIED",
      label: "Binario msra.exe Identificado"
    }
  },
  {
    id: "inv-25-10",
    code: "25.10",
    title: "PowerShell Remoting conceptual",
    subtitle: "Administración CLI remota sobre WinRM / WS-Management sin interfaz gráfica",
    targetMechanism: "WinRM Service (Windows Remote Management) / Ports 5985 & 5986",
    targetComponent: "WS-Management Protocol Stack",
    commandName: "Test-WSMan -ComputerName localhost",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "PowerShell Remoting no transmite pantalla ni consumo gráfico; ejecuta comandos directamente en el kernel del servidor e intercambia datos estructurados en objetos XML/JSON.",
      mythVsTruth: {
        mentira: "PowerShell Remoting es lo mismo que RDP pero en ventana negra.",
        verdad: "Es totalmente diferente: utiliza WinRM sobre HTTP/HTTPS (puerto 5985/5986), no requiere consola gráfica y consume menos de 1 KB/s de ancho de banda.",
        comprobalo: "Ejecutá `Test-WSMan` para comprobar la pila de servicios WinRM en tu equipo."
      }
    },
    entende: {
      queEs: "La tecnología nativa de Windows para ejecutar comandos y scripts de PowerShell de forma remota en uno o miles de servidores simultáneamente.",
      paraQueSirve: "Permite administrar servidores Windows Server y clientes Pro/Enterprise masivamente mediante `Enter-PSSession` o `Invoke-Command`.",
      quePasaSiFalta: "La automatización y administración remota ágil en la nube o data centers se vuelve lenta y tediosa."
    },
    interactua: {
      cliExample: "winrm quickconfig",
      psExample: "Test-WSMan -ComputerName localhost",
      syntaxBreakdown: "Test-WSMan verifica si la pila WS-Management responde a nivel de servicio y muestra la versión de protocolo.",
      whatToLookFor: "Detalles de ProductVersion (ej. OS: 10.0.x) y StackVersion de WinRM.",
      technicalMetrics: "Puertos: 5985 TCP (HTTP) y 5986 TCP (HTTPS). Cifrado predeterminado con Kerberos/NTLM."
    },
    alertaEVO: {
      reversibilityRule: "Test-WSMan es una consulta de estado de lectura.",
      safetyWarning: "El comando `Enable-PSRemoting` realiza cambios en el Firewall y servicios; usarlo solo cuando se planee administrar el equipo por consola remota."
    },
    evidenceBadge: {
      code: "WINRM_SERVICE_OK",
      label: "WinRM WS-Management Validado"
    }
  },
  {
    id: "inv-25-11",
    code: "25.11",
    title: "Por qué no exponer RDP directamente a Internet",
    subtitle: "Peligros de seguridad, ataques de fuerza bruta, ransomware y guía de endurecimiento",
    targetMechanism: "RDP Brute Force Scanners & Public Exposure Vulnerabilities (BlueKeep / DejaBlue)",
    targetComponent: "RDP Security Hardening & Zero-Trust Access",
    commandName: "Get-WinEvent -LogName Security -FilterXPath \"*[System[EventID=4625]]\" -MaxEvents 10",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Exponer el puerto 3389 directamente a una IP pública resulta en miles de intentos de login automatizados (fuerza bruta) por minuto, siendo la causa #1 de infección por Ransomware en PYMEs.",
      mythVsTruth: {
        mentira: "Si cambio el puerto 3389 al 43389 en el router, mi RDP queda completamente invisible e inmune.",
        verdad: "Los bots atacantes escanean los 65.535 puertos de tu IP en segundos reconociendo el handshake de RDP sin importar el número de puerto.",
        comprobalo: "Consultá los intentos fallidos de inicio de sesión (Evento 4625) en el Visor de Eventos."
      }
    },
    entende: {
      queEs: "La evaluación pericial de los riesgos asociados a publicar servidores RDP a la red pública de Internet sin capas intermedias.",
      paraQueSirve: "Concienciar y aplicar estrategias de protección real: VPN, RD Gateway, Guacamole, Cloudflare Tunnels y Bloqueo de Cuentas por intentos fallidos.",
      quePasaSiFalta: "Dejar 3389 abierto garantiza el compromiso del servidor en cuestión de días o semanas."
    },
    interactua: {
      cliExample: "netstat -ano | findstr :3389",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4625} -MaxEvents 5 | Select-Object TimeCreated, Message",
      syntaxBreakdown: "Busca los eventos con ID 4625 (Inicio de sesión fallido) para detectar ataques de fuerza bruta en progreso.",
      whatToLookFor: "Múltiples eventos 4625 seguidos desde direcciones IP desconocidas.",
      technicalMetrics: "Event ID 4625: Logon Failure. Event ID 4624: Logon Success. Event ID 1149: RDP Connection Request."
    },
    alertaEVO: {
      reversibilityRule: "La lectura de registros de seguridad con Get-WinEvent no modifica los logs.",
      safetyWarning: "Asegurate de tener activada la política de bloqueo de cuenta ('Account Lockout Threshold') en `secpol.msc` para frenar ataques de fuerza bruta."
    },
    evidenceBadge: {
      code: "RDP_HARDENING_AUDIT",
      label: "Riesgos y Auditoría RDP Comprehendidos"
    }
  }
];

export const SECTOR_25_MINICASES: Sector25MiniCase[] = [
  {
    id: "case-25-01",
    code: "CASO-25-A",
    title: "El misterio de la PC con Windows Home que no acepta Escritorio Remoto",
    scenario: "Un cliente compró una notebook con Windows 11 Home para usarla como servidor administrativo en una oficina local. Al intentar conectarse desde otra PC mediante mstsc a la IP local, obtiene un error 'No se puede conectar a la computadora remota'.",
    userStatement: "Probé poner la IP exacta, desactivé el Firewall pero sigue diciendo que no se puede conectar. La otra PC tiene mstsc así que debería funcionar.",
    initialMistake: "Asumir que porque el cliente mstsc.exe está presente en Windows Home, el equipo también puede recibir conexiones entrantes de RDP.",
    diagnosticQuestion: "¿Por qué Windows 11 Home no permite conexiones entrantes de Escritorio Remoto?",
    options: [
      {
        id: "a",
        text: "Windows Home no incluye la arquitectura Servidor RDP (TermService Host) por restricciones de licenciamiento SKU.",
        isCorrect: true,
        explanation: "Correcto. Windows Home actúa únicamente como CLIENTE RDP. Para recibir conexiones entrantes se requiere edición Windows Pro, Enterprise o Server."
      },
      {
        id: "b",
        text: "El router bloqueó la conexión porque no se hizo Port Forwarding en la red local.",
        isCorrect: false,
        explanation: "Incorrecto. Dentro de la red local (LAN) no se requiere Port Forwarding en el router."
      },
      {
        id: "c",
        text: "Windows Home requiere instalar Microsoft Office para habilitar el servicio TermService.",
        isCorrect: false,
        explanation: "Incorrecto. Office no tiene relación con el subsistema de Terminal Services del sistema operativo."
      }
    ],
    technicalVerdict: "SITUACIÓN CONFIRMADA: Limitación de SKU. Solución: Actualizar la licencia a Windows 11 Pro o utilizar herramientas de asistencia como Quick Assist o VPN + Software de terceros autorizado.",
    lessonLearned: "El cliente RDP está disponible en todas las ediciones, pero el Servidor RDP es exclusivo de las ediciones Pro y superiores."
  },
  {
    id: "case-25-02",
    code: "CASO-25-B",
    title: "Ataque masivo de fuerza bruta y congelamiento por exposición directa de 3389",
    scenario: "Una pequeña empresa abrió el puerto 3389 en su módem/router hacia un servidor de archivos local para trabajar durante el fin de semana. El lunes, el servidor responde sumamente lento y el Visor de Eventos registra miles de intentos de login con usuarios como 'administrator', 'admin', 'user'.",
    userStatement: "Le cambiamos el puerto al 4000 en el router pero sigue entrando gente y la CPU está al 100%.",
    initialMistake: "Creer que la 'seguridad por oscuridad' (cambiar el número de puerto) protege a un servidor RDP expuesto públicamente a Internet.",
    diagnosticQuestion: "¿Cuál es la medida de remediación inmediata recomendada según los estándares de ciberseguridad EVO?",
    options: [
      {
        id: "a",
        text: "Cerrar inmediatamente la redirección directa del puerto RDP en el router y configurar una VPN (ej. WireGuard/OpenVPN) para el acceso remoto.",
        isCorrect: true,
        explanation: "Exacto. NUNCA se debe exponer RDP directamente a Internet. La VPN crea un canal seguro autenticado antes de tocar el socket RDP."
      },
      {
        id: "b",
        text: "Cambiar la contraseña del usuario Administrador por una más larga y dejar el puerto abierto.",
        isCorrect: false,
        explanation: "Incorrecto. Aunque la contraseña sea fuerte, los escáneres seguirán saturando la CPU y memoria procesando intentos NLA/TLS fallidos."
      },
      {
        id: "c",
        text: "Desactivar NLA para que los atacantes no puedan ver la pantalla de login.",
        isCorrect: false,
        explanation: "Incorrecto. Desactivar NLA empoce la seguridad, permitiendo que el servidor cree sesiones gráficas completas para usuarios no autenticados."
      }
    ],
    technicalVerdict: "REMEDIACIÓN APLICADA: Cierre de puerto 3389 en WAN. Implementación de túnel VPN y política de bloqueo de cuentas tras 5 intentos fallidos.",
    lessonLearned: "RDP expuesto directamente a Internet es un imán para botnets y ransomware. La VPN es la primera línea de defensa."
  }
];

export const SECTOR_25_TEST_BANK: Sector25TestQuestion[] = [
  {
    id: "test-25-01",
    questionNumber: 1,
    category: "RDP Protocol Architecture",
    question: "¿Qué puerto por defecto utiliza el protocolo de Escritorio Remoto (RDP) en Windows?",
    options: [
      { id: "a", text: "Puerto 80 TCP" },
      { id: "b", text: "Puerto 3389 TCP y UDP" },
      { id: "c", text: "Puerto 445 TCP" },
      { id: "d", text: "Puerto 5985 TCP" }
    ],
    correctOptionId: "b",
    technicalExplanation: "El protocolo RDP escucha por defecto en el puerto 3389 tanto en TCP (control y comandos) como en UDP (flujo de datos gráficos acelerados).",
    relatedInvestigationCode: "25.01"
  },
  {
    id: "test-25-02",
    questionNumber: 2,
    category: "Security & NLA",
    question: "¿Cuál es la función primordial de la Autenticación a Nivel de Red (NLA) en RDP?",
    options: [
      { id: "a", text: "Comprimir los archivos de imagen transmitidos por el escritorio." },
      { id: "b", text: "Autenticar las credenciales del usuario a través de CredSSP/TLS ANTES de inicializar la sesión gráfica remota." },
      { id: "c", text: "Permitir que Windows Home funcione como servidor RDP." },
      { id: "d", text: "Asignar una dirección IP dinámica al cliente RDP." }
    ],
    correctOptionId: "b",
    technicalExplanation: "NLA exige autenticación previa via CredSSP/TLS para evitar que usuarios no autorizados obliguen al host a instanciar sesiones gráficas en memoria.",
    relatedInvestigationCode: "25.04"
  },
  {
    id: "test-25-03",
    questionNumber: 3,
    category: "Windows Edition Capabilities",
    question: "Si intentás activar el Servidor RDP nativo en Windows 11 Home desde Configuración, ¿qué ocurrirá?",
    options: [
      { id: "a", text: "Se activará sin problemas tras reiniciar." },
      { id: "b", text: "La opción de activar el servidor Escritorio Remoto no estará disponible o estará deshabilitada por limitación de SKU." },
      { id: "c", text: "Se convertirá automáticamente en Windows Server." },
      { id: "d", text: "Se borrará el ejecutable mstsc.exe." }
    ],
    correctOptionId: "b",
    technicalExplanation: "Windows Home no cuenta con el soporte de licenciamiento SKU ni la infraestructura para hospedar el servidor RDP nativo.",
    relatedInvestigationCode: "25.03"
  },
  {
    id: "test-25-04",
    questionNumber: 4,
    category: "CLI Client Operation",
    question: "¿Qué parámetro de `mstsc.exe` permite conectarse directamente a la sesión administrativa/consola de un equipo remoto?",
    options: [
      { id: "a", text: "/console_full" },
      { id: "b", text: "/admin" },
      { id: "c", text: "/root" },
      { id: "d", text: "/bypass" }
    ],
    correctOptionId: "b",
    technicalExplanation: "El parámetro `/admin` en `mstsc` solicita conectar a la sesión de administración del servidor Terminal Services.",
    relatedInvestigationCode: "25.02"
  },
  {
    id: "test-25-05",
    questionNumber: 5,
    category: "Native Remote Assistance",
    question: "¿Qué combinación de teclas rápida abre de manera nativa la herramienta Asistencia Rápida (Quick Assist) en Windows 10 y 11?",
    options: [
      { id: "a", text: "Ctrl + Alt + Supr" },
      { id: "b", text: "Ctrl + Win + Q" },
      { id: "c", text: "Win + R" },
      { id: "d", text: "Shift + Esc" }
    ],
    correctOptionId: "b",
    technicalExplanation: "`Ctrl + Win + Q` es el atajo de teclado nativo global para abrir Asistencia Rápida en Windows.",
    relatedInvestigationCode: "25.08"
  }
];
