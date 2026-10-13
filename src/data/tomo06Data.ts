// TOMO 06: CIBERSEGURIDAD // DEFENSA EN PROFUNDIDAD, HARDENING & RESPUESTA A INCIDENTES
// Contenido Editorial Maestro, Capítulos Técnicos, Prácticas, Casos Reales y Fuentes Oficiales

export interface Tomo06Chapter {
  id: string;
  moduleNumber: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  readTime: string;
  topicsCovered: string[];
  capa1Explicacion: string;
  capa2DetalleTecnico: string;
  capa3PracticaMedicion: string;
  microformatos: {
    mito: string;
    errorComun: string;
    comprobalo: string;
    paraTecnicos: string;
    conclusionEvo: string;
  };
  decisionRule: string;
  benchTarget?: {
    labView: 'windows-matrix' | 'hotswap-lab';
    scenario: string;
    badgeLabel: string;
  };
}

export interface Tomo06CaseStudy {
  id: string;
  title: string;
  symptom: string;
  defenseTactic: string;
  evidenceTelemetry: string;
  discardedHypothesis: string;
  rootCause: string;
  remediationAction: string;
  verificationCmd: string;
}

export interface Tomo06GlossaryItem {
  term: string;
  standardOrOrg: string;
  definition: string;
  defensiveApplication: string;
}

export const TOMO_06_META = {
  number: '06',
  volumeLabel: 'Tomo 06',
  title: 'CIBERSEGURIDAD',
  subtitle: 'Desde cero hasta dominar la defensa y el blindaje de tus sistemas.',
  themeColor: '#EF4444',
  secondaryColor: '#DC2626',
  badge: 'DEFENSA EN PROFUNDIDAD & MITRE ATT&CK FRAMEWORK',
  edition: 'Edición Técnica Defensiva 2026',
  totalPages: 52,
  manifestoPhrase: 'LA SEGURIDAD NO ES UN PRODUCTO QUE SE COMPRA, ES UN PROCESO CONTINUO DE AUDITORÍA, MÍNIMO PRIVILEGIO Y EVIDENCIA INMUTABLE.',
  description: 'Tratado técnico y defensivo sobre ciberseguridad, hardening de sistemas operativos, arquitectura Zero-Trust, análisis de comportamiento de malware en sandboxes aisladas, auditoría de eventos de Windows y respuesta estructurada a incidentes según estándares NIST y MITRE ATT&CK.',
  sources: [
    'NIST SP 800-61 Rev. 2 - Computer Security Incident Handling Guide',
    'NIST SP 800-53 Rev. 5 - Security and Privacy Controls for Information Systems',
    'MITRE ATT&CK Framework - Enterprise Tactics and Techniques',
    'CIS Benchmarks (Center for Internet Security) - Microsoft Windows Desktop & Server',
    'OWASP Top 10 - Web Application Security Risks',
    'FIPS 140-3 - Security Requirements for Cryptographic Modules',
    'Microsoft Security Response Center (MSRC) - Attack Surface Reduction (ASR) Rules',
  ],
};

export const TOMO_06_CHAPTERS: Tomo06Chapter[] = [
  {
    id: 't06-c01',
    moduleNumber: 'M01',
    chapterNumber: '01',
    title: 'Fundamentos de Seguridad & La Tríada CIA',
    subtitle: 'Confidencialidad, Integridad, Disponibilidad y la evaluación de amenazas',
    readTime: '12 min',
    topicsCovered: ['01 Principios de seguridad', '02 Tríada CIA', '03 Superficie de ataque', '04 Amenaza / Vulnerabilidad / Riesgo'],
    capa1Explicacion:
      'La seguridad informática no consiste en instalar un antivirus con luces de neón y olvidarse. Se rige por tres pilares innegociables: Confidencialidad (solo quien tiene permiso puede leer el dato), Integridad (el dato no ha sido alterado ni manipulado en tránsito o reposo) y Disponibilidad (el sistema está accesible cuando el usuario legítimo lo necesita). Reducir la superficie de ataque significa apagar todo puerto, servicio o software que no sea estrictamente imprescindible.',
    capa2DetalleTecnico:
      'La ecuación formal del riesgo es: `Riesgo = Amenaza × Vulnerabilidad × Impacto`. Una vulnerabilidad (CVE) es una debilidad técnica en software o configuración; una amenaza es el agente o vector capaz de explotarla; el impacto es el daño económico u operativo resultante. Aplicar mitigaciones reduce la probabilidad o el impacto. La arquitectura moderna exige el modelo Zero-Trust ("Nunca confíes, siempre verifica"), asumiendo que el perímetro ya ha sido vulnerado.',
    capa3PracticaMedicion:
      'Mapeo de superficie de ataque en PowerShell: `Get-Service | Where-Object {$_.Status -eq "Running"}` para auditar servicios activos, y `Get-NetTCPConnection -State Listen` para verificar qué procesos tienen puertos abiertos expuestos a la red local.',
    microformatos: {
      mito: 'Mito: "Mi computadora es de un usuario común, nadie tiene interés en atacarme a mí."',
      errorComun: 'Creer que los atacantes buscan personas específicas: la mayoría de los ataques son escaneos automatizados globales buscando cualquier IP vulnerable para convertirla en nodo de botnet o minero.',
      comprobalo: 'Abrí un puerto SSH o RDP expuesto a Internet sin contraseña robusta y observá los logs: en menos de 5 minutos recibirás cientos de intentos de inicio de sesión automatizados de todo el mundo.',
      paraTecnicos: 'El principio de Defensa en Profundidad (Defense-in-Depth) establece capas concéntricas: si el firewall perimetral falla, el host firewall detiene el tráfico; si el host cae, el principio de mínimo privilegio frena la ejecución.',
      conclusionEvo: 'Cada software instalado y cada puerto innecesario abierto es un vector potencial de intrusión.',
    },
    decisionRule: 'Todo puerto, protocolo o servicio que no tenga una justificación operativa documentada debe ser deshabilitado en el sistema operativo.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'telemetry-diagtrack',
      badgeLabel: 'AUDITORÍA DE SUPERFICIE',
    },
  },
  {
    id: 't06-c02',
    moduleNumber: 'M01',
    chapterNumber: '02',
    title: 'Ingeniería Social, Phishing & Robo de Credenciales',
    subtitle: 'Vectores de engaño humano, MFA moderno, TOTP y claves de acceso FIDO2',
    readTime: '14 min',
    topicsCovered: ['05 Ingeniería social', '06 Phishing', '09 Credenciales', '10 MFA', '16 Navegador'],
    capa1Explicacion:
      'El eslabón más vulnerable de cualquier sistema es el ser humano. Los atacantes rara vez intentan "hackear" matemáticamente un algoritmo de cifrado de 256 bits; prefieren engañar al usuario mediante correos alarmistas, facturas falsas o páginas clonadas para que él mismo entregue su usuario y contraseña. La autenticación en dos pasos (MFA) exige un segundo factor para impedir que una contraseña robada sea suficiente para ingresar.',
    capa2DetalleTecnico:
      'Los tres factores canónicos de autenticación son: Algo que sabes (contraseña), Algo que tienes (teléfono/token físico) y Algo que eres (biometría). El MFA por SMS es vulnerable a SIM-Swapping y ataques SS7. Las aplicaciones TOTP (RFC 6238, HMAC-Based One-Time Password de 30 segundos) son seguras pero vulnerables a proxies inversos de phishing en tiempo real (ej. Evilginx). El estándar definitivo resistente a phishing es FIDO2 / WebAuthn, que utiliza criptografía asimétrica donde la clave privada está físicamente aislada en un chip TPM o llave de seguridad y solo firma desafíos que coincidan exactamente con el dominio web criptográfico legítimo.',
    capa3PracticaMedicion:
      'Auditar contraseñas guardadas en navegadores y validar si el sistema operativo tiene activado Windows Hello con aislamiento TPM mediante `Get-Tpm` en PowerShell (verificando `TpmReady: True` y `TpmActivated: True`).',
    microformatos: {
      mito: 'Mito: "Tener MFA por mensaje de texto SMS es 100% seguro contra cualquier ataque."',
      errorComun: 'Aceptar notificaciones push de autenticación repetitivas ("MFA Fatigue / Push Bombing") para que dejen de sonar, permitiendo el acceso del intruso.',
      comprobalo: 'Inspeccioná el certificado digital y la URL de cualquier página de inicio de sesión: ningún certificado SSL puede ocultar un dominio falso (ej. `banco.seguridad-alerta.com` en vez de `banco.com`).',
      paraTecnicos: 'FIDO2 vincula el origen (Origin Binding): el navegador nunca enviará la firma criptográfica si el dominio no coincide matemáticamente con el dominio registrado en la clave pública del servidor.',
      conclusionEvo: 'Una contraseña larga de 20 caracteres es inútil si se entrega voluntariamente a una página clonada; la resistencia al phishing debe ser criptográfica.',
    },
    decisionRule: 'Implementar obligatoriamente llaves FIDO2 o aplicaciones TOTP con coincidencia de número (Number Matching) para todas las cuentas de administración técnica.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'scheduler-hybrid',
      badgeLabel: 'FIDO2 & TPM AUDIT',
    },
  },
  {
    id: 't06-c03',
    moduleNumber: 'M02',
    chapterNumber: '03',
    title: 'Morfología de Malware & Amenazas Modernas',
    subtitle: 'Ransomware, troyanos, keyloggers, persistencia en registro y living-off-the-land',
    readTime: '15 min',
    topicsCovered: ['07 Malware', '08 Ransomware', '25 Detección de comportamiento', '27 Aislamiento'],
    capa1Explicacion:
      'El malware moderno ya no busca destruir tu computadora para mostrar un mensaje gracioso en pantalla: busca operar en silencio para extorsionarte o espiar. El ransomware es la amenaza más destructiva: una vez dentro, cifra todos tus archivos importantes con claves matemáticas irrompibles y exige un rescate económico. Otras amenazas roban credenciales bancarias o utilizan la computadora para lanzar ataques a terceros.',
    capa2DetalleTecnico:
      'El malware avanzado evita escribir binarios en disco para eludir firmas de antivirus tradicionales (Fileless Malware). Utiliza técnicas "Living-off-the-Land" (LotL) empleando binarios legítimos de Windows (LOLBins como `powershell.exe`, `certutil.exe`, `mshta.exe`, `wmic.exe`). La persistencia se establece mediante llaves de registro `Run` / `RunOnce`, servicios del sistema, tareas programadas (`schtasks`), extensiones de shell COM o controladores maliciosos vulnerables (BYOVD - Bring Your Own Vulnerable Driver). El ransomware ataca las copias de seguridad locales borrando las instantáneas de volumen con `vssadmin delete shadows /all /quiet`.',
    capa3PracticaMedicion:
      'Auditar puntos de persistencia de Windows utilizando `Autoruns` de Sysinternals (verificando firmas criptográficas de ejecutables) y `Process Explorer` (verificando la columna "Verified Signer" de cada proceso en ejecución).',
    microformatos: {
      mito: 'Mito: "Si tengo un buen antivirus, no necesito preocuparme por hacer copias de seguridad."',
      errorComun: 'Pagar el rescate de un ransomware: además de no garantizar la recuperación de los datos, financia al crimen organizado y marca a la víctima como pagadora recurrente.',
      comprobalo: 'Ejecutá `Get-CimInstance Win32_ShadowCopy` en PowerShell para verificar si tu sistema tiene instantáneas de volumen activas y protegidas contra borrado.',
      paraTecnicos: 'El análisis dinámico de malware debe realizarse en un hipervisor Tipo 1 o máquina virtual con red en modo Host-Only / Sandbox desacoplada, monitoreando con Procmon y Regshot.',
      conclusionEvo: 'La única protección matemática 100% efectiva contra el ransomware es una copia de seguridad externa desconectada (Air-Gapped).',
    },
    decisionRule: 'Ante sospecha de actividad de ransomware en curso (disco al 100% renombrando extensiones), desconectar inmediatamente el cable de red y apagar la interfaz inalámbrica para frenar la propagación lateral.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'win10-ltsc',
      badgeLabel: 'MONITOR DE COMPORTAMIENTO',
    },
  },
  {
    id: 't06-c04',
    moduleNumber: 'M02',
    chapterNumber: '04',
    title: 'Hardening de Windows & Principio de Mínimo Privilegio',
    subtitle: 'ASR, AppLocker, UAC, aislamiento de núcleo y control de cuentas',
    readTime: '15 min',
    topicsCovered: ['11 Permisos', '12 Mínimo privilegio', '13 Usuarios y grupos', '14 Hardening Windows', '15 Actualizaciones'],
    capa1Explicacion:
      '"Hardening" (endurecimiento) es el proceso de blindar una instalación de Windows para cerrar todas las puertas traseras por las que suele ingresar el software malicioso. Una de las reglas de oro es el Principio de Mínimo Privilegio: nunca utilizar la computadora con una cuenta de Administrador para tareas cotidianas. Si navegás como usuario estándar, el malware no puede instalarse a nivel de sistema sin pedirte permiso explícito.',
    capa2DetalleTecnico:
      'Windows cuenta con mecanismos de mitigación nativos de nivel corporativo: Reglas de Reducción de Superficie de Ataque (ASR - Attack Surface Reduction), Aislamiento de Núcleo (HVCI - Hypervisor-Protected Code Integrity) que ejecuta el kernel dentro de una máquina virtual segura (VBS), y Control de Aplicaciones de Windows Defender (WDAC) o AppLocker que bloquea la ejecución de scripts `.vbs`, `.js`, `.bat` o ejecutables fuera de carpetas protegidas como `C:\\Program Files`. User Account Control (UAC) debe estar en su nivel máximo para evitar elevaciones silenciosas.',
    capa3PracticaMedicion:
      'Consultar el estado del aislamiento de núcleo con PowerShell: `Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\\Microsoft\\Windows\\DeviceGuard`. Habilitar reglas ASR en modo auditoría o bloqueo mediante `Set-MpPreference -AttackSurfaceReductionRules_Ids <GUID> -AttackSurfaceReductionRules_Actions Enabled`.',
    microformatos: {
      mito: 'Mito: "Desactivar el Control de Cuentas de Usuario (UAC) hace que la PC funcione más rápido."',
      errorComun: 'Darle permisos de administrador permanente a todos los empleados o usuarios del hogar para "evitar que salgan carteles molestos".',
      comprobalo: 'Intentá ejecutar un script descargado de Internet en una cuenta estándar: el sistema exigirá las credenciales del administrador y aislará el token de seguridad.',
      paraTecnicos: 'HVCI utiliza las extensiones de virtualización del CPU (Intel VT-x / AMD-V) para impedir que se inyecte código no firmado en el espacio de memoria de Ring 0 (kernel).',
      conclusionEvo: 'Un sistema operativo con hardening y privilegios segmentados detiene el 95% del malware sin necesidad de suites de seguridad pesadas.',
    },
    decisionRule: 'La cuenta de uso diario debe ser Usuario Estándar. Las credenciales de Administrador solo deben ingresarse puntualmente ante solicitudes de elevación UAC verificadas.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'dpc-conflict',
      badgeLabel: 'ASR & DEVICE GUARD AUDIT',
    },
  },
  {
    id: 't06-c05',
    moduleNumber: 'M03',
    chapterNumber: '05',
    title: 'Criptografía Práctica, BitLocker & Resiliencia 3-2-1',
    subtitle: 'Cifrado simétrico AES-256, hashing SHA-256, TPM y copias inmutables',
    readTime: '13 min',
    topicsCovered: ['17 Protección de datos', '18 Backups', '19 Cifrado', '29 Seguridad física', '30 Seguridad de dispositivos'],
    capa1Explicacion:
      'Si alguien te roba la notebook o saca el disco de tu PC, no necesita saber tu contraseña de Windows para ver tus fotos y documentos: basta con conectar el disco a otra computadora y leer los archivos directamente. La única protección contra el acceso físico no autorizado es el cifrado de disco completo (BitLocker). Y para garantizar que nunca pierdas tu información, se aplica la regla de oro de copias de seguridad: la Regla 3-2-1.',
    capa2DetalleTecnico:
      'BitLocker cifra los sectores del almacenamiento mediante AES-XTS de 128 o 256 bits. La clave de cifrado de volumen (FVEK) está protegida por la clave maestra (VMK), sellada dentro del chip de seguridad físico TPM 2.0 (Trusted Platform Module). El TPM solo libera la clave si las mediciones criptográficas del firmware UEFI, la tabla de particiones GPT y los archivos de arranque (PCRs 0 a 7) no han sido alterados (Secure Boot). La regla 3-2-1 exige: 3 copias de los datos, en 2 medios distintos (ej. SSD local y NAS/Nube), con 1 copia fuera del sitio físico (Off-site) o desconectada (Air-Gapped / Inmutable).',
    capa3PracticaMedicion:
      'Verificar estado de BitLocker en consola de administrador: `manage-bde -status`. Comprobar método de cifrado (ej. XTS-AES 256) y estado de protección TPM. Generar y verificar el hash SHA-256 de un archivo para validar su integridad con `Get-FileHash -Algorithm SHA256 <archivo>`.',
    microformatos: {
      mito: 'Mito: "El cifrado de disco BitLocker ralentiza la PC y desgasta el SSD."',
      errorComun: 'Guardar la copia de seguridad en un disco externo que permanece conectado por USB las 24 horas: si entra un ransomware, cifrará el disco de la PC y el disco de backup en el mismo instante.',
      comprobalo: 'Calculá el hash SHA-256 de un documento, agregale un espacio o punto, y volvelo a calcular: el hash cambiará por completo (Efecto Avalancha).',
      paraTecnicos: 'El hash criptográfico garantiza la cadena de custodia: si el hash de una evidencia forense coincide con el hash tomado en el momento del incidente, la integridad ante un tribunal es irrefutable.',
      conclusionEvo: 'Los datos que no están respaldados en al menos dos medios independientes no existen realmente: son solo una pérdida esperando ocurrir.',
    },
    decisionRule: 'Todo equipo portátil debe tener BitLocker activado con respaldo de clave de recuperación verificado fuera del propio equipo.',
    benchTarget: {
      labView: 'hotswap-lab',
      scenario: 'vrm-short',
      badgeLabel: 'BITLOCKER TPM STATUS',
    },
  },
  {
    id: 't06-c06',
    moduleNumber: 'M03',
    chapterNumber: '06',
    title: 'Auditoría de Eventos, Logs & Sysmon',
    subtitle: 'Event Viewer, Event IDs críticos de seguridad y detección de intrusiones',
    readTime: '15 min',
    topicsCovered: ['23 Logs', '24 Eventos', '25 Detección de comportamiento', '26 Respuesta a incidentes'],
    capa1Explicacion:
      'Tu computadora registra en un diario íntimo todo lo que sucede: quién inició sesión, qué programas se abrieron, qué errores ocurrieron y si alguien intentó adivinar una contraseña. Este diario se llama Visor de Eventos (Event Viewer). Cuando ocurre un incidente de seguridad, los logs son las huellas digitales que permiten reconstruir exactamente qué pasó, a qué hora y cómo ingresó el intruso.',
    capa2DetalleTecnico:
      'Los eventos de seguridad de Windows se registran en `Security.evtx`. Event IDs críticos: `4624` (Inicio de sesión exitoso, prestando atención a Logon Type 2 interactivo vs Logon Type 3 red vs Logon Type 10 RDP), `4625` (Fallo de autenticación), `4672` (Asignación de privilegios especiales/admin), `4688` (Creación de procesos, habilitando la línea de comandos completa mediante GPO), `4720` (Usuario creado). Para telemetría avanzada de bajo nivel se utiliza Microsoft Sysmon (System Monitor): Event ID 1 (Creación de proceso con hash y parent PID), Event ID 3 (Conexión de red iniciada por un ejecutable) y Event ID 11 (Creación de archivo).',
    capa3PracticaMedicion:
      'Filtrar eventos en PowerShell: `Get-WinEvent -FilterHashtable @{LogName="Security"; Id=4625} -MaxEvents 10 | Format-List` para auditar intentos fallidos de intrusión. Identificar qué IP origen intentó conectar.',
    microformatos: {
      mito: 'Mito: "Los logs ocupan demasiado espacio y conviene desactivarlos."',
      errorComun: 'Configurar el tamaño del log de seguridad en valores mínimos por defecto: en un servidor bajo ataque, los eventos se sobreescriben en cuestión de minutos borrando la evidencia.',
      comprobalo: 'Abrí `eventvwr.msc`, navegá a Registros de Windows → Seguridad y observá cómo cada vez que elevás un programa con UAC se genera un Event ID 4672 con tus privilegios administrativos.',
      paraTecnicos: 'Los atacantes intentan limpiar los logs ejecutando `wevtutil cl Security`. Esta acción genera obligatoriamente el Event ID 1102 ("The audit log was cleared"), que constituye una alerta crítica inmediata en cualquier SIEM.',
      conclusionEvo: 'Sin logs configurados y protegidos, un equipo técnico está ciego frente a cualquier intrusión.',
    },
    decisionRule: 'Habilitar siempre el registro de línea de comandos en Event ID 4688 mediante directiva local para registrar exactamente qué parámetros se pasaron a PowerShell y cmd.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'telemetry-diagtrack',
      badgeLabel: 'EVENT LOGS AUDIT',
    },
  },
  {
    id: 't06-c07',
    moduleNumber: 'M04',
    chapterNumber: '07',
    title: 'Respuesta a Incidentes, Red Segura & OWASP',
    subtitle: 'Protocolo PICERL de NIST, aislamiento, microsegmentación y cadena de custodia',
    readTime: '16 min',
    topicsCovered: ['20 Firewall', '21 Red segura', '22 Wi-Fi seguro', '26 Respuesta a incidentes', '27 Aislamiento', '33 Seguridad web', '34 OWASP', '35 Cadena de custodia'],
    capa1Explicacion:
      'Cuando un ataque ocurre, el pánico y las decisiones apresuradas (como formatear la máquina de inmediato o desconectar la electricidad sin pensar) destruyen las pruebas y empeoran el problema. Existe un protocolo metódico estándar de respuesta a incidentes: Preparación, Identificación, Contención, Erradicación, Recuperación y Lecciones Aprendidas. Actuar con calma y rigor técnico salva infraestructuras completas.',
    capa2DetalleTecnico:
      'El ciclo de vida de respuesta a incidentes de NIST SP 800-61 se divide en 4 fases: 1. Preparación, 2. Detección y Análisis, 3. Contención, Erradicación y Recuperación, 4. Actividad Post-Incidente. La contención exige aislar el host a nivel de switch (VLAN de cuarentena) o firewall local sin apagar el equipo intempestivamente para no perder la memoria RAM volátil (donde residen claves de cifrado, conexiones activas y malware inyectado). En seguridad web, el OWASP Top 10 destaca: A01 Rotura de Control de Acceso, A02 Fallas Criptográficas y A03 Inyección (SQLi / XSS). La cadena de custodia exige registrar hora, custodio y hash SHA-256 de cada volcado de memoria o imagen forense.',
    capa3PracticaMedicion:
      'Bloqueo inmediato de tráfico sospechoso mediante el firewall nativo: `New-NetFirewallRule -DisplayName "Bloqueo-Cuarentena" -Direction Outbound -Action Block -Enabled True`. Captura de memoria volátil con herramientas forenses de solo lectura (FTK Imager Lite o WinPmem).',
    microformatos: {
      mito: 'Mito: "Ante un hackeo hay que desenchufar la computadora de la pared de inmediato."',
      errorComun: 'Formatear y reinstalar el equipo antes de entender cómo entraron: el atacante volverá a ingresar en pocas horas porque la vulnerabilidad o contraseña robada sigue activa en el router o red.',
      comprobalo: 'Inspeccioná las reglas salientes de tu firewall: por defecto, la mayoría de los sistemas permiten cualquier conexión saliente, lo que permite al malware comunicarse con su servidor de comando y control (C2).',
      paraTecnicos: 'La memoria RAM es volátil (Orden de Volatilidad RFC 3227): memoria RAM → archivos temporales/caché → disco duro → medios ópticos. Apagar la máquina borra la evidencia más valiosa.',
      conclusionEvo: 'La ciberseguridad profesional es ciencia forense y rigor deductivo: aislar la amenaza, preservar la evidencia, erradicar la causa raíz y blindar el sistema para que no vuelva a ocurrir jamás.',
    },
    decisionRule: 'En caso de compromiso confirmado, aislar la conectividad de red antes de ejecutar cualquier herramienta de desinfección, preservando la memoria volátil para análisis forense.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'win10-ltsc',
      badgeLabel: 'INCIDENT RESPONSE SUITE',
    },
  },
];

export const TOMO_06_CASES: Tomo06CaseStudy[] = [
  {
    id: 'case-01',
    title: 'Caso 1: Infección de Ransomware contenida en servidor de archivos',
    symptom: 'Usuarios reportan que los archivos compartidos de la red tienen la extensión `.locked` y una nota de rescate en el escritorio.',
    defenseTactic: 'Contención Rápida & Aislamiento L2/L3 (NIST SP 800-61)',
    evidenceTelemetry: 'Proceso desconocido ejecutándose desde `C:\\Users\\AppData` consumiendo 98% de I/O de disco. Event ID 4624 Logon Type 10 desde IP externa desconocida.',
    discardedHypothesis: 'Se descartó fallo físico en los discos del servidor NAS.',
    rootCause: 'El atacante ingresó por un puerto RDP (3389) expuesto directamente a Internet sin MFA, empleando credenciales débiles obtenidas por fuerza bruta.',
    remediationAction: '1. Desconexión física inmediata de la red para evitar cifrado lateral. 2. Finalización de procesos sospechosos y preservación de memoria. 3. Restauración íntegra desde backup desconectado (Air-Gapped). 4. Cierre del puerto RDP en el router y configuración de VPN con MFA obligatorio.',
    verificationCmd: '`manage-bde -status` y auditoría de cuentas activas; sistema restaurado al 100% sin pagar rescate.',
  },
  {
    id: 'case-02',
    title: 'Caso 2: Bypass de MFA por Phishing con Proxy Inverso (Evilginx)',
    symptom: 'Un administrador con autenticación en dos pasos por SMS sufre el acceso no autorizado a su cuenta de correo corporativo.',
    defenseTactic: 'Migración Criptográfica a FIDO2 / WebAuthn',
    evidenceTelemetry: 'El inicio de sesión legítimo ocurrió en una IP de proxy intermedio que capturó la cookie de sesión `ESTSAUTH` en tiempo real.',
    discardedHypothesis: 'Se sospechó que el teléfono celular del administrador había sido intervenido físicamente.',
    rootCause: 'El administrador ingresó sus credenciales y código SMS en un enlace de phishing que actuaba como proxy inverso transparente, capturando la sesión autenticada.',
    remediationAction: '1. Revocación inmediata de todas las sesiones activas en el panel de identidad. 2. Reemplazo del método SMS por llaves de hardware FIDO2 vinculadas al dominio web legítimo.',
    verificationCmd: 'Los intentos de phishing automatizados fallan debido a que la llave FIDO2 se niega a firmar desafíos fuera del dominio oficial.',
  },
  {
    id: 'case-03',
    title: 'Caso 3: Elevación de privilegios por Servicio sin Comillas (Unquoted Service Path)',
    symptom: 'Un malware ejecuta acciones como SYSTEM a pesar de que el usuario infectado operaba con una cuenta estándar.',
    defenseTactic: 'Auditoría de Rutas de Servicios & Permisos NTFS',
    evidenceTelemetry: 'El servicio llamaba a `C:\\Program Files\\Software Vulnerable\\servicio.exe` sin comillas. El atacante colocó un archivo malicioso llamado `C:\\Program.exe`.',
    discardedHypothesis: 'Se sospechó de una vulnerabilidad 0-day en el kernel de Windows.',
    rootCause: 'Al faltar comillas, el subsistema de Windows busca secuencialmente `C:\\Program.exe` antes de llegar a la ruta completa, ejecutándolo con privilegios de SYSTEM.',
    remediationAction: 'Se corrigió la clave de registro del servicio añadiendo comillas dobles y se restringieron los permisos de escritura en la raíz de `C:\\`.',
    verificationCmd: '`Get-CimInstance win32_service | Where-Object {$_.PathName -notlike \'"*\' -and $_.PathName -like \'* *\'}` arrojó 0 resultados.',
  },
];

export const TOMO_06_GLOSSARY: Tomo06GlossaryItem[] = [
  {
    term: 'Zero-Trust Architecture',
    standardOrOrg: 'NIST SP 800-207',
    definition: 'Modelo de seguridad que asume que no existe confianza implícita por estar dentro de la red local. Exige verificar explícitamente cada solicitud de acceso.',
    defensiveApplication: 'Exige autenticación mutua, cifrado de extremo a extremo y validación del estado de salud del dispositivo antes de conceder acceso.',
  },
  {
    term: 'ASR (Attack Surface Reduction)',
    standardOrOrg: 'Microsoft Defender',
    definition: 'Conjunto de reglas de bajo nivel integradas en Windows que impiden comportamientos frecuentemente utilizados por malware (como macros de Office ejecutando código Win32).',
    defensiveApplication: 'Bloquea la inyección de código en otros procesos, la creación de ejecutables en carpetas temporales y el robo de credenciales de LSASS.',
  },
  {
    term: 'FIDO2 / WebAuthn',
    standardOrOrg: 'FIDO Alliance / W3C',
    definition: 'Estándar abierto de autenticación sin contraseña basado en criptografía de clave pública y tokens físicos (TPM / llaves USB).',
    defensiveApplication: 'Es el único estándar de autenticación comprobado matemáticamente inmune al phishing por proxy inverso.',
  },
  {
    term: 'Air-Gapped Backup',
    standardOrOrg: 'CISA / NIST',
    definition: 'Copia de seguridad almacenada en un soporte que se encuentra físicamente desconectado de cualquier red y fuente de energía tras finalizar la copia.',
    defensiveApplication: 'Impide que un atacante o ransomware conectado a la red pueda alcanzar, cifrar o destruir las copias de respaldo.',
  },
  {
    term: 'HVCI (Hypervisor-Protected Code Integrity)',
    standardOrOrg: 'Microsoft VBS Architecture',
    definition: 'Aislamiento de la integridad de código del kernel de Windows mediante el hipervisor de virtualización del CPU.',
    defensiveApplication: 'Garantiza que ningún controlador o código en modo kernel pueda ejecutarse a menos que esté firmado criptográficamente y validado.',
  },
];
