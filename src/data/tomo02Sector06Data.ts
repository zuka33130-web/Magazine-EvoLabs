// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 06: SERVICIOS // LO QUE REALMENTE HACE SERVICES.MSC

export type RiskLevelSector06 = 'MONITOR_ONLY' | 'CONFIG_MODIFY_RISK' | 'PROCESS_TERMINATION_RISK';

export interface Sector06Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  tabOrMetric: string;
  riskLevel: RiskLevelSector06;
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
    powershellCommand?: string;
    cmdCommand?: string;
    guiPath?: string;
    whatToLookFor: string;
  };
  alertaEVO: {
    falsePositiveWarning: string;
    reversibilityRule: string;
  };
  evidenceBadge: {
    code: string;
    label: string;
    defaultProvenance?: string;
  };
}

export interface Sector06MiniCase {
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

export interface Sector06TestQuestion {
  id: string;
  questionNumber: number;
  category: 'ARQUITECTURA_SCM' | 'TIPOS_INICIO' | 'DEPENDENCIAS' | 'IDENTIDAD_SEGURIDAD' | 'DIAGNÓSTICO';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_06_INVESTIGATIONS: Sector06Investigation[] = [
  {
    id: 'inv-06-01',
    code: '06.01',
    title: 'Qué es un servicio',
    subtitle: 'El componente ejecutable en segundo plano administrado por el Service Control Manager',
    tabOrMetric: 'services.msc -> Concepto de Servicio Win32',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Abres `services.msc` y ves más de 150 elementos listados. ¿En qué se diferencia un servicio de una aplicación normal o de un ejecutable de inicio?',
      mythVsTruth: {
        mentira: 'Un servicio es un programa estándar que minimizó su ventana al lado del reloj.',
        verdad: 'Un servicio Win32 es un ejecutable especializado registrado en el Service Control Manager (SCM) que puede arrancar antes de que ningún usuario inicie sesión y ejecutar sin ventana gráfica.',
        comprobalo: 'Ejecutá `Get-Service` en PowerShell para listar el nombre interno, nombre para mostrar y estado de los servicios.',
      },
    },
    entende: {
      queEs: 'Un proceso o librería DLL registrado en el Registro de Windows bajo `HKLM\\SYSTEM\\CurrentControlSet\\Services` para ser gestionado por la API de servicios del SO.',
      paraQueSirve: 'Proporciona capacidades fundamentales de infraestructura continua: conectividad de red, criptografía, sonido, plug and play y almacenamiento.',
      quePasaSiFalta: 'Sin el subsistema de servicios, Windows no podría gestionar dispositivos ni permitir servicios multi-usuario remotos.',
    },
    interactua: {
      powershellCommand: 'Get-Service | Select-Object -First 10 Name, DisplayName, Status, StartType',
      cmdCommand: 'sc query',
      guiPath: 'Ejecutar `services.msc`',
      whatToLookFor: 'Observá la columna "Nombre del servicio" (nombre corto interno para SC) y "Nombre de pantalla".',
    },
    alertaEVO: {
      falsePositiveWarning: 'No asumas que "servicio corriendo = consumo de CPU". La inmensa mayoría de servicios está en estado durmiente (Idle) esperando eventos.',
      reversibilityRule: 'Regla de Oro: Todo cambio de estado de un servicio en services.msc se puede modificar o revertir inmediatamente.',
    },
    evidenceBadge: {
      code: 'EVD-06-01',
      label: 'WIN32_SERVICE_CONCEPT',
      defaultProvenance: 'SERVICES_MSC_SCM',
    },
  },
  {
    id: 'inv-06-02',
    code: '06.02',
    title: 'Service Control Manager',
    subtitle: 'SCM (services.exe), la entidad central que inicia, detiene, monitorea y controla el ciclo de vida de los servicios',
    tabOrMetric: 'Proceso services.exe / SCM API',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Cuando presionas "Iniciar" o "Detener" en `services.msc`, o cuando usas `net start`, ¿quién procesa exactamente la orden en el kernel?',
      mythVsTruth: {
        mentira: 'La consola services.msc ejecuta los archivos `.exe` de los servicios directamente desde el Administrador de Archivos.',
        verdad: 'La orden es enviada al Service Control Manager (SCM), un componente de kernel/usuario representado por el proceso `services.exe` que valida permisos y maneja dependencias.',
        comprobalo: 'En Task Manager -> Detalles -> Ubica `services.exe` en la Sesión 0 corriendo como SYSTEM.',
      },
    },
    entende: {
      queEs: 'La base de datos RPC y ejecutable de control centralizado que administra la tabla de estado de todos los servicios e interviene en el arranque del sistema.',
      paraQueSirve: 'Asegura que los servicios arranquen en el orden correcto resolviendo dependencias y gestionando reconexiones ante fallos.',
      quePasaSiFalta: 'Si services.exe fuera finalizado, todo el control de servicios colapsaría y el sistema se reiniciaría de inmediato.',
    },
    interactua: {
      powershellCommand: 'Get-Process -Name "services" | Select-Object Id, ProcessName, Path, WorkingSet64',
      cmdCommand: 'sc queryex type= service',
      guiPath: 'Administrador de tareas -> Detalles -> services.exe',
      whatToLookFor: 'Comprobá que services.exe sea un ejecutable protegido en System32.',
    },
    alertaEVO: {
      falsePositiveWarning: 'services.exe consume mínimos recursos. Un alto consumo en él indica un bucle infinito en la registración de algún servicio de terceros.',
      reversibilityRule: 'Proceso crítico del sistema: protegido por la arquitectura del kernel.',
    },
    evidenceBadge: {
      code: 'EVD-06-02',
      label: 'SERVICE_CONTROL_MANAGER_SCM',
      defaultProvenance: 'SYSTEM32_SERVICES_EXE',
    },
  },
  {
    id: 'inv-06-03',
    code: '06.03',
    title: 'Automatic',
    subtitle: 'Tipo de inicio Automático: Carga prioritaria durante la fase de arranque de Windows',
    tabOrMetric: 'Tipo de inicio: Automático (Automatic)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Los servicios configurados como "Automático" arrancan al encender la computadora, incluso antes de que aparezca la pantalla de ingreso de clave de usuario.',
      mythVsTruth: {
        mentira: 'Un servicio automático solo empieza a funcionar cuando el usuario inicia sesión en su escritorio.',
        verdad: 'El SCM inicia los servicios de tipo Automático en la fase temprana de arranque (Boot/System Startup) en la Sesión 0.',
        comprobalo: 'En `services.msc` -> Filtra por la columna "Tipo de inicio: Automático". Verás servicios como DHCP, DNS y Spooler.',
      },
    },
    entende: {
      queEs: 'La directiva de inicio que le indica al SCM que active el servicio inmediatamente al arrancar el sistema operativo.',
      paraQueSirve: 'Garantiza la disponibilidad inmediata de servicios fundamentales para la red, seguridad y subsistemas de hardware.',
      quePasaSiFalta: 'Si cambias un servicio esencial de Automático a Deshabilitado, el componente correspondiente no estará disponible al encender el equipo.',
    },
    interactua: {
      powershellCommand: 'Get-Service | Where-Object StartType -eq "Automatic" | Select-Object -First 10 Name, DisplayName',
      guiPath: 'services.msc -> Propiedades de servicio -> Tipo de inicio: Automático',
      whatToLookFor: 'Identifica qué servicios requieren carga automática imprescindible (ej. Cliente DHCP).',
    },
    alertaEVO: {
      falsePositiveWarning: 'Demasiados servicios de aplicaciones de terceros configurados como Automático pueden ralentizar el tiempo total de arranque de la PC.',
      reversibilityRule: 'Puedes cambiar el tipo de inicio en cualquier momento desde las propiedades de services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-03',
      label: 'START_TYPE_AUTOMATIC',
      defaultProvenance: 'SCM_START_AUTOMATIC',
    },
  },
  {
    id: 'inv-06-04',
    code: '06.04',
    title: 'Automatic Delayed Start',
    subtitle: 'Inicio Automático (Inicio retrasado): La optimización inteligente para acelerar el arranque del escritorio',
    tabOrMetric: 'Tipo de inicio: Automático (Inicio retrasado)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Windows introduce el modo "Automático (Inicio retrasado)" para evitar que 50 servicios compitan por la CPU y el SSD al mismo tiempo durante el encendido.',
      mythVsTruth: {
        mentira: 'Inicio retrasado significa que el servicio está fallando o deshabilitado.',
        verdad: 'Es una función de optimización de Microsoft: el SCM espera unos 2 minutos después del arranque principal para iniciar estos servicios sin ralentizar el login.',
        comprobalo: 'En `services.msc`, observa servicios como Windows Update (wuauserv) o SysMain configurados con "Inicio retrasado".',
      },
    },
    entende: {
      queEs: 'Un ajuste de programador donde el servicio se marca para ejecución automática pero con baja prioridad de arranque tras completar el inicio crítico.',
      paraQueSirve: 'Reduce drásticamente la latencia de entrada al escritorio y el pico de lectura de disco/CPU durante el encendido.',
      quePasaSiFalta: 'Si todos los servicios no esenciales fueran Automáticos estrictos, la computadora tardaría el doble en responder al encender.',
    },
    interactua: {
      powershellCommand: 'Get-Service | Where-Object DelayedAutoStart -eq $true | Select-Object Name, DisplayName',
      guiPath: 'services.msc -> Propiedades -> Tipo de inicio: Automático (Inicio retrasado)',
      whatToLookFor: 'Revisa qué servicios de aplicaciones secundarias se benefician de estar en modo retrasado.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si necesitas que un servicio esté disponible inmediatamente al presionar el botón de encendido, no lo pongas en modo retrasado.',
      reversibilityRule: 'Ajuste reversible mediante la consola services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-04',
      label: 'START_TYPE_AUTOMATIC_DELAYED',
      defaultProvenance: 'SCM_START_DELAYED',
    },
  },
  {
    id: 'inv-06-05',
    code: '06.05',
    title: 'Manual',
    subtitle: 'Tipo de inicio Manual: Por qué Manual NO significa que el servicio nunca se vaya a ejecutar',
    tabOrMetric: 'Tipo de inicio: Manual',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Ves un servicio en modo "Manual" y asumes que solo se ejecutará si tú abres `services.msc` y haces clic en "Iniciar". ¡Error grave de concepto!',
      mythVsTruth: {
        mentira: 'Un servicio en modo Manual está desactivado y jamás se iniciará sin intervención del usuario.',
        verdad: 'Manual significa "Iniciado a demanda". Si una aplicación, otro servicio o el sistema operativo solicita este servicio, Windows lo iniciará automáticamente al instante.',
        comprobalo: 'Configura un servicio en Manual y abre la aplicación asociada: verás cómo pasa de "Detenido" a "En ejecución" de forma transparente.',
      },
    },
    entende: {
      queEs: 'La directiva de inicio condicional donde el servicio permanece inerte en RAM liberada hasta que una API solicita su función.',
      paraQueSirve: 'Ahorra memoria RAM y ciclos de procesador manteniendo el código disponible sólo cuando realmente se necesita.',
      quePasaSiFalta: 'Es la configuración recomendada para la inmensa mayoría de herramientas secundarias de Windows.',
    },
    interactua: {
      powershellCommand: 'Get-Service | Where-Object StartType -eq "Manual" | Select-Object -First 10 Name, DisplayName',
      guiPath: 'services.msc -> Propiedades -> Tipo de inicio: Manual',
      whatToLookFor: 'Observa que muchos servicios en Manual están en estado "Detenido" hasta que abres un programa que los invoca.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Pasar servicios no críticos de Automático a Manual es una práctica de optimización segura y profesional.',
      reversibilityRule: 'Manual es el estado más equilibrado entre rendimiento y funcionalidad.',
    },
    evidenceBadge: {
      code: 'EVD-06-05',
      label: 'START_TYPE_MANUAL_ONDEMAND',
      defaultProvenance: 'SCM_START_MANUAL',
    },
  },
  {
    id: 'inv-06-06',
    code: '06.06',
    title: 'Trigger Start',
    subtitle: 'Inicio por disparador (Triggers): Activación automática del servicio ante conexión de hardware, red o eventos ETW',
    tabOrMetric: 'Mecanismo Service Trigger Start',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Enchufas un pendrive USB o te conectas a una red Wi-Fi y de inmediato un servicio dormido en modo Manual cobra vida. ¿Quién envió la señal?',
      mythVsTruth: {
        mentira: 'Los servicios deben estar continuamente escaneando en un bucle infinito para saber cuándo se conecta un dispositivo.',
        verdad: 'Windows utiliza Trigger Start. El servicio registra un disparador en el SCM para despertarse solo cuando ocurre un evento específico de hardware o red.',
        comprobalo: 'Ejecutá `sc qtriggerinfo [NombreServicio]` en CMD para ver los disparadores (Triggers) registrados.',
      },
    },
    entende: {
      queEs: 'La arquitectura de eventos introducida en Windows 7 que permite a los servicios en Manual permanecer en 0 MB de RAM hasta recibir una notificación del kernel.',
      paraQueSirve: 'Elimina la necesidad de procesos residentes permanentes para funciones esporádicas (ej. Bluetooth, Impresión, Smart Cards).',
      quePasaSiFalta: 'Permite mantener un sistema con cientos de funciones listas sin penalizar la memoria RAM física.',
    },
    interactua: {
      powershellCommand: 'sc.exe qtriggerinfo bthserv',
      cmdCommand: 'sc qtriggerinfo wuauserv',
      guiPath: 'services.msc -> Servicios con disparador (Trigger Start)',
      whatToLookFor: 'Nota cómo el disparador especifica la clase de interfaz de dispositivo o cambio de dirección IP.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un servicio Trigger Start que se inicia y se detiene solo a los pocos segundos está funcionando según su diseño eficiente.',
      reversibilityRule: 'Mecanismo nativo gestionado por la API de SCM.',
    },
    evidenceBadge: {
      code: 'EVD-06-06',
      label: 'TRIGGER_START_EVENT_DRIVEN',
      defaultProvenance: 'SCM_TRIGGER_START',
    },
  },
  {
    id: 'inv-06-07',
    code: '06.07',
    title: 'Disabled',
    subtitle: 'Tipo de inicio Deshabilitado: El bloqueo absoluto que impide cualquier ejecución, incluso ante peticiones de apps',
    tabOrMetric: 'Tipo de inicio: Deshabilitado (Disabled)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Si configuras un servicio como "Deshabilitado", ningún programa, ni siquiera el propio Windows, podrá iniciarlo hasta que cambies este ajuste.',
      mythVsTruth: {
        mentira: 'Deshabilitar un servicio es lo mismo que ponerlo en Manual.',
        verdad: 'Manual PERMITE que otros programas inicien el servicio. Deshabilitado BLOQUEA cualquier intento de inicio, devolviendo un error de acceso denegado a la app que lo solicite.',
        comprobalo: 'Deshabilita un servicio y prueba ejecutar un comando `net start [servicio]`: recibirás el error 1058.',
      },
    },
    entende: {
      queEs: 'El estado de bloqueo de seguridad que prohíbe al SCM asignar recursos o instanciar el ejecutable del servicio.',
      paraQueSirve: 'Inactiva componentes no deseados o servicios vulnerables para endurecer la seguridad del sistema (Hardening).',
      quePasaSiFalta: 'Si deshabilitas a ciegas un servicio con dependencias, provocarás errores de función silenciosos en aplicaciones que dependan de él.',
    },
    interactua: {
      powershellCommand: 'Get-Service | Where-Object StartType -eq "Disabled" | Select-Object Name, DisplayName',
      guiPath: 'services.msc -> Propiedades -> Tipo de inicio: Deshabilitado',
      whatToLookFor: 'Identifica la diferencia de comportamiento entre un servicio en Manual vs Deshabilitado.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Usa "Deshabilitado" con cautela. Si una aplicación necesita el servicio y lo encuentra deshabilitado, fallará con un mensaje críptico.',
      reversibilityRule: 'Se puede reactivar cambiando el tipo de inicio a Manual o Automático en services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-07',
      label: 'START_TYPE_DISABLED_LOCKED',
      defaultProvenance: 'SCM_START_DISABLED',
    },
  },
  {
    id: 'inv-06-08',
    code: '06.08',
    title: 'Dependencies',
    subtitle: 'El grafo de dependencias de servicios y el efecto dominó al detener o deshabilitar un componente base',
    tabOrMetric: 'Pestaña Dependencias en services.msc',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Intentas apagar el servicio A y Windows te advierte que se apagarán también los servicios B, C y D. ¿Por qué están encadenados?',
      mythVsTruth: {
        mentira: 'Cada servicio de Windows opera de forma totalmente aislada e independiente de los demás.',
        verdad: 'Los servicios forman un Grafo de Dependencias (Dependency Graph). Un servicio de alto nivel requiere que los servicios de infraestructura base estén en ejecución previa.',
        comprobalo: 'Abrí `services.msc` -> Haz doble clic en cualquier servicio -> Ve a la pestaña "Dependencias".',
      },
    },
    entende: {
      queEs: 'La relación jerárquica de requisitos de ejecución definida en el registro bajo la clave `DependOnService`.',
      paraQueSirve: 'Garantiza que un servicio no intente enviar datos por red sin que el driver de red y el protocolo TCP/IP estén cargados previamente.',
      quePasaSiFalta: 'Si deshabilitas un servicio raíz (ej. Llamada a procedimiento remoto / RPC), decenas de servicios dependientes dejarán de funcionar al instante.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "AudioSrv" | Select-Object -ExpandProperty DependentServices',
      cmdCommand: 'sc enumdepend AudioSrv',
      guiPath: 'services.msc -> Propiedades -> Pestaña Dependencias',
      whatToLookFor: 'Inspecciona las dos secciones: "Este servicio depende de..." y "Los siguientes componentes dependen de este servicio".',
    },
    alertaEVO: {
      falsePositiveWarning: 'Regla Inviolable EVO: NUNCA deshabilites un servicio sin revisar primero su lista completa de dependientes.',
      reversibilityRule: 'Revertir la habilitación del servicio padre restaurará la capacidad de iniciar a sus dependientes.',
    },
    evidenceBadge: {
      code: 'EVD-06-08',
      label: 'SERVICE_DEPENDENCY_GRAPH',
      defaultProvenance: 'SCM_DEPENDENCY_TREE',
    },
  },
  {
    id: 'inv-06-09',
    code: '06.09',
    title: 'Recovery Actions',
    subtitle: 'Acciones de recuperación ante fallos: Reinicio automático de servicios, ejecución de scripts y reinicio del sistema',
    tabOrMetric: 'Pestaña Recuperación en services.msc',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Si un servicio crítico colapsa debido a un error de memoria, Windows puede autorepararse en segundos sin que el usuario lo note. ¿Cómo se configura esta resiliencia?',
      mythVsTruth: {
        mentira: 'Cuando un servicio falla o se cierra inesperadamente, permanece caído para siempre hasta que el usuario reinicie la PC.',
        verdad: 'La pestaña Recuperación (Recovery) de cada servicio permite definir acciones automáticas para el primer fallo, segundo fallo y fallos posteriores.',
        comprobalo: 'En `services.msc` -> Propiedades de un servicio -> Pestaña "Recuperación". Observa las opciones de "Reiniciar el servicio".',
      },
    },
    entende: {
      queEs: 'La directiva de toleración a fallos administrada por el SCM para responder a caídas inesperadas del proceso del servicio.',
      paraQueSirve: 'Mantiene la alta disponibilidad de servicios vitales (red, servidor web, seguridad) recuperándolos automáticamente.',
      quePasaSiFalta: 'Permite configurar reinicio del servicio, ejecución de un programa de diagnóstico o reinicio completo del equipo.',
    },
    interactua: {
      powershellCommand: 'sc.exe qfailure wuauserv',
      guiPath: 'services.msc -> Propiedades -> Pestaña Recuperación',
      whatToLookFor: 'Revisa el tiempo de reinicio del servicio (ej. "Reiniciar el servicio después de: 1 minutos").',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si un servicio entra en un bucle infinito de caídas y reinicios, revisa los eventos del visor de eventos (Event Viewer) para encontrar la causa raíz.',
      reversibilityRule: 'Las acciones de recuperación son totalmente personalizables.',
    },
    evidenceBadge: {
      code: 'EVD-06-09',
      label: 'SERVICE_RECOVERY_ACTIONS',
      defaultProvenance: 'SCM_FAILURE_ACTIONS',
    },
  },
  {
    id: 'inv-06-10',
    code: '06.10',
    title: 'Log On As',
    subtitle: 'La cuenta de identidad de ejecución: El principio de mínimos privilegios aplicado a la seguridad de servicios',
    tabOrMetric: 'Pestaña Iniciar sesión (Log On As)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Un servicio no se ejecuta "en el aire". Requiere una cuenta de usuario con un token de seguridad para definir a qué archivos y registro tiene permiso de acceso.',
      mythVsTruth: {
        mentira: 'Todos los servicios de Windows se ejecutan con la cuenta de Administrador del usuario.',
        verdad: 'Por el principio de mínimos privilegios, Windows utiliza cuentas de servicio especiales (LocalSystem, LocalService, NetworkService o cuentas de servicio administradas).',
        comprobalo: 'En `services.msc` -> Revisa la columna "Iniciar sesión como" para ver la cuenta asignada a cada servicio.',
      },
    },
    entende: {
      queEs: 'El contexto de credencial de seguridad asignado a un servicio para limitar el impacto en caso de que el servicio sea comprometido.',
      paraQueSirve: 'Evita que la vulnerabilidad de un servicio secundario (ej. Spooler de impresión) le otorgue a un atacante control total de la máquina.',
      quePasaSiFalta: 'Si le asignas una cuenta incorrecta a un servicio, este no podrá iniciar por falta del derecho `SeServiceLogonRight`.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Service | Select-Object Name, StartName | Group-Object StartName',
      guiPath: 'services.msc -> Propiedades -> Pestaña Iniciar sesión',
      whatToLookFor: 'Notá cómo la gran mayoría de servicios está repartida entre cuentas del sistema y no con tu usuario personal.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Jamás cambies la cuenta de inicio de sesión de un servicio de sistema a menos que seas un administrador de dominio configurando gMSA.',
      reversibilityRule: 'Las identidades predeterminadas son parte del diseño de seguridad del SO.',
    },
    evidenceBadge: {
      code: 'EVD-06-10',
      label: 'SERVICE_ACCOUNT_IDENTITY',
      defaultProvenance: 'SCM_LOGON_AS',
    },
  },
  {
    id: 'inv-06-11',
    code: '06.11',
    title: 'LocalSystem',
    subtitle: 'NT AUTHORITY\\SYSTEM: La cuenta de privilegios ilimitados en el equipo local',
    tabOrMetric: 'Cuenta NT AUTHORITY\\SYSTEM (LocalSystem)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'La cuenta `LocalSystem` tiene más poder local que la propia cuenta "Administrador" del usuario. Puede acceder a áreas del registro e hilos de kernel vedados a usuarios.',
      mythVsTruth: {
        mentira: 'La cuenta Administrador de Windows es la cuenta con mayor nivel de privilegios en el sistema.',
        verdad: 'La cuenta SYSTEM (LocalSystem) es la identidad suprema en la máquina local. Posee privilegios ilimitados sobre archivos del sistema, registro y procesos.',
        comprobalo: 'Revisa en `services.msc` que los servicios críticos del núcleo (Plug and Play, Windows Update) ejecutan como "Sistema local".',
      },
    },
    entende: {
      queEs: 'La cuenta de servicio integrada del SO que no posee contraseña y opera en el contexto de seguridad supremo de la computadora local.',
      paraQueSirve: 'Permite que el SO realice modificaciones profundas de hardware, instalación de parches y gestión de memoria.',
      quePasaSiFalta: 'Es indispensable para los componentes centrales de Windows.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Service | Where-Object StartName -match "LocalSystem|SYSTEM" | Select-Object -First 10 Name',
      guiPath: 'services.msc -> Columna Iniciar sesión como: Sistema local',
      whatToLookFor: 'Identifica los servicios que requieren el máximo nivel de confianza del kernel.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Un servicio de terceros ejecutando como LocalSystem requiere auditoría rigurosa, ya que un fallo en él compromete todo el equipo.',
      reversibilityRule: 'Identidad protegida de sistema.',
    },
    evidenceBadge: {
      code: 'EVD-06-11',
      label: 'IDENTITY_LOCAL_SYSTEM',
      defaultProvenance: 'NT_AUTHORITY_SYSTEM',
    },
  },
  {
    id: 'inv-06-12',
    code: '06.12',
    title: 'LocalService',
    subtitle: 'NT AUTHORITY\\LocalService: La cuenta de privilegios reducidos para servicios locales que no requieren acceso a red amplia',
    tabOrMetric: 'Cuenta NT AUTHORITY\\LocalService',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Para evitar que un servicio expuesto se convierta en una amenaza masiva si es hackeado, Windows creó la cuenta restringida `LocalService`.',
      mythVsTruth: {
        mentira: 'Todos los servicios deben correr como Administrador para que funcionen bien.',
        verdad: 'LocalService es una cuenta integrada de bajos privilegios. Si un servicio ejecutando bajo LocalService es comprometido, el atacante no obtiene privilegios de Administrador.',
        comprobalo: 'En `services.msc`, observa que servicios como Hora de Windows (W32Time) o Event Log ejecutan bajo NT AUTHORITY\\LocalService.',
      },
    },
    entende: {
      queEs: 'Una cuenta de servicio sin privilegios administrativos que actúa como un usuario estándar anónimo ante la red.',
      paraQueSirve: 'Aísla servicios locales para limitar el radio de impacto de vulnerabilidades (Sandboxing).',
      quePasaSiFalta: 'Protege la integridad del resto del sistema ante fallos en el servicio.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Service | Where-Object StartName -match "LocalService" | Select-Object Name',
      guiPath: 'services.msc -> Columna Iniciar sesión como: NT AUTHORITY\\LocalService',
      whatToLookFor: 'Aprecia cómo los servicios auxiliares están acotados en permisos.',
    },
    alertaEVO: {
      falsePositiveWarning: 'LocalService no puede escribir en carpetas protegidas como System32; es el comportamiento de seguridad esperado.',
      reversibilityRule: 'Identidad de seguridad por diseño.',
    },
    evidenceBadge: {
      code: 'EVD-06-12',
      label: 'IDENTITY_LOCAL_SERVICE',
      defaultProvenance: 'NT_AUTHORITY_LOCALSERVICE',
    },
  },
  {
    id: 'inv-06-13',
    code: '06.13',
    title: 'NetworkService',
    subtitle: 'NT AUTHORITY\\NetworkService: La cuenta restringida con identidad autenticada de máquina en la red local',
    tabOrMetric: 'Cuenta NT AUTHORITY\\NetworkService',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Servicios de red como Cliente DNS o Criptografía necesitan enviar paquetes a la red utilizando la credencial de la computadora en un dominio. Para eso existe `NetworkService`.',
      mythVsTruth: {
        mentira: 'NetworkService tiene los mismos permisos locales que la cuenta SYSTEM.',
        verdad: 'Localmente tiene privilegios restringidos similares a LocalService, pero en la red se presenta utilizando las credenciales de la máquina (`DOMAIN\\COMPUTER$`).',
        comprobalo: 'Observa en `services.msc` que servicios de infraestructura de red ejecutan como NT AUTHORITY\\NetworkService.',
      },
    },
    entende: {
      queEs: 'La cuenta de servicio diseñada para componentes que requieren interactuar con recursos de red remotos sin requerir derechos de administrador local.',
      paraQueSirve: 'Permite la autenticación segura en redes corporativas manteniendo un perfil restringido dentro del disco local.',
      quePasaSiFalta: 'Asegura la conectividad de red con el mínimo privilegio local.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Service | Where-Object StartName -match "NetworkService" | Select-Object Name',
      guiPath: 'services.msc -> Columna Iniciar sesión como: NT AUTHORITY\\NetworkService',
      whatToLookFor: 'Compara la matriz de identidades: LocalSystem vs LocalService vs NetworkService.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Las 3 cuentas integradas (LocalSystem, LocalService, NetworkService) forman el triángulo de seguridad de servicios de Windows.',
      reversibilityRule: 'Cuentas nativas no modificables del SO.',
    },
    evidenceBadge: {
      code: 'EVD-06-13',
      label: 'IDENTITY_NETWORK_SERVICE',
      defaultProvenance: 'NT_AUTHORITY_NETWORKSERVICE',
    },
  },
  {
    id: 'inv-06-14',
    code: '06.14',
    title: 'svchost groups',
    subtitle: 'Conexión con el Sector 05: Agrupación de servicios en instancias específicas de svchost por perfil de seguridad',
    tabOrMetric: 'Grupos de Servicio svchost (netsvcs, imgsvc, etc.)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Conectando con el Sector 05: Cada instancia de `svchost.exe` se lanza pasando un parámetro de grupo (ej. `svchost.exe -k netsvcs`). ¿Cómo se definen esos grupos?',
      mythVsTruth: {
        mentira: 'Windows elige al azar en qué svchost meter cada servicio al encender.',
        verdad: 'Los grupos de svchost están definidos formalmente en el registro bajo `HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Svchost`.',
        comprobalo: 'Abre el Editor de Registro o usa PowerShell para consultar los nombres de grupos en la clave de Svchost.',
      },
    },
    entende: {
      queEs: 'El mecanismo de empaquetado donde servicios con requisitos de seguridad e identidad similares se ejecutan dentro del mismo proceso contenedor.',
      paraQueSirve: 'Optimiza el consumo de memoria combinando librerías DLL al tiempo que mantiene aislamiento entre grupos críticos y secundarios.',
      quePasaSiFalta: 'Si un servicio en un grupo svchost colapsa, solo afectará a los servicios de ese mismo grupo.',
    },
    interactua: {
      powershellCommand: 'Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Svchost" | Select-Object -Property *',
      guiPath: 'services.msc / Task Manager -> Vista agrupada de Host de servicios',
      whatToLookFor: 'Correlaciona la lista de procesos svchost con los grupos del registro.',
    },
    alertaEVO: {
      falsePositiveWarning: 'En Windows 10 (con más de 3.5 GB de RAM), Windows desagrupa muchos svchost asignando un ejecutable individual a cada servicio para aumentar la estabilidad.',
      reversibilityRule: 'Diseño arquitectónico de empaquetado de servicios.',
    },
    evidenceBadge: {
      code: 'EVD-06-14',
      label: 'SVCHOST_GROUP_MAPPING',
      defaultProvenance: 'REGISTRY_SVCHOST_GROUPS',
    },
  },
  {
    id: 'inv-06-15',
    code: '06.15',
    title: 'Service SID',
    subtitle: 'Service Security Identifier: Aislamiento granular de permisos por servicio individual',
    tabOrMetric: 'Identificador de Seguridad per-Service (Service SID)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Incluso cuando dos servicios corren en la misma cuenta `LocalService`, Windows puede darle permiso a carpetas específicas a uno solo de ellos mediante el `Service SID`.',
      mythVsTruth: {
        mentira: 'Todos los servicios que corren en la misma cuenta comparten exactamente los mismos permisos sobre archivos y claves de registro.',
        verdad: 'Windows genera un Service SID único derivado del nombre del servicio (ej. `NT SERVICE\\wuauserv`). Esto permite asignar permisos ultra-granulares.',
        comprobalo: 'Ejecutá `sc showsid [NombreServicio]` para ver el SID único asignado al servicio.',
      },
    },
    entende: {
      queEs: 'Un identificador de seguridad sintético que convierte al servicio en un "usuario virtual" para la tabla de control de acceso (ACL).',
      paraQueSirve: 'Evita que un servicio pueda modificar los archivos o claves de registro de otro servicio dentro de la misma cuenta.',
      quePasaSiFalta: 'Aplica el principio de mínimo privilegio a nivel de proceso individual.',
    },
    interactua: {
      powershellCommand: 'sc.exe showsid wuauserv',
      cmdCommand: 'sc showsid Dhcp',
      guiPath: 'Permisos NTFS de archivos -> Entradas para "NT SERVICE\\NombreServicio"',
      whatToLookFor: 'Notá la estructura del SID asignado exclusivamente a ese servicio.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Ver usuarios "NT SERVICE\\..." en los permisos de una carpeta es síntoma de un sistema hardening bien configurado.',
      reversibilityRule: 'Característica nativa de seguridad Win32.',
    },
    evidenceBadge: {
      code: 'EVD-06-15',
      label: 'PER_SERVICE_SID_SECURITY',
      defaultProvenance: 'NT_SERVICE_SID',
    },
  },
  {
    id: 'inv-06-16',
    code: '06.16',
    title: 'BITS',
    subtitle: 'Background Intelligent Transfer Service: Transferencias asíncronas de archivos en segundo plano con control de ancho de banda',
    tabOrMetric: 'Servicio BITS (bits)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Descargas una actualización de Windows o una app de la tienda y tu juego en línea no sufre lag. El responsable de gestionar la red sin saturar tu conexión es `BITS`.',
      mythVsTruth: {
        mentira: 'BITS es un servicio exclusivo de Windows Update y si no estás actualizando no sirve para nada.',
        verdad: 'Background Intelligent Transfer Service es un motor genérico utilizado por navegadores, actualizadores y aplicaciones de terceros para descargar archivos usando solo el ancho de banda libre de la red.',
        comprobalo: 'Ejecutá `Get-BitsTransfer` en PowerShell para ver las colas de transferencia asíncronas activas.',
      },
    },
    entende: {
      queEs: 'El servicio de transferencia inteligente que pausa y reanuda descargas automáticamente ante desconexiones de red y ajusta su velocidad a la inactividad de red.',
      paraQueSirve: 'Evita que descargas pesadas en segundo plano arruinen la latencia o experiencia de navegación del usuario.',
      quePasaSiFalta: 'Si se deshabilita BITS, Windows Update y la Microsoft Store no podrán descargar paquetes de instalación.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "bits" | Select-Object Name, Status, StartType',
      cmdCommand: 'bitsadmin /list /allusers',
      guiPath: 'services.msc -> Servicio de transferencia inteligente en segundo plano (BITS)',
      whatToLookFor: 'Observa que BITS suele estar en modo Manual (Trigger Start) y solo se activa cuando hay transferencias pendientes.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Malware avanzado a veces intenta abusar de BITS para descargar payloads de forma sigilosa. Revisa las tareas BITS activas con `bitsadmin`.',
      reversibilityRule: 'Reversible desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-16',
      label: 'BITS_INTELLIGENT_TRANSFER',
      defaultProvenance: 'SERVICES_BITS',
    },
  },
  {
    id: 'inv-06-17',
    code: '06.17',
    title: 'Windows Update',
    subtitle: 'El servicio wuauserv y la gestión de parches de seguridad y parches de servicing',
    tabOrMetric: 'Servicio wuauserv (Windows Update)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'El servicio `wuauserv` es el motor que consulta, descarga e instala parches de seguridad. ¿Qué ocurre realmente en services.msc con este servicio?',
      mythVsTruth: {
        mentira: 'Deshabilitar wuauserv en services.msc es la mejor forma permanente de optimizar la PC para siempre.',
        verdad: 'Deshabilitar wuauserv deja al sistema expuesto a vulnerabilidades conocidas y detiene la actualización de controladores y componentes del sistema.',
        comprobalo: 'En `services.msc` -> Busca "Windows Update" (wuauserv). Notarás que está configurado como Automático (Inicio retrasado) o Manual.',
      },
    },
    entende: {
      queEs: 'El servicio de actualización que interactúa con las bases de datos de parches (Windows servicing) y el motor TrustedInstaller.',
      paraQueSirve: 'Mantiene la postura de seguridad y estabilidad del SO al día.',
      quePasaSiFalta: 'Imposibilita la instalación de nuevas características y parches acumulativos.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "wuauserv" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Windows Update',
      whatToLookFor: 'Nota cómo el servicio wuauserv se activa cuando abres la ventana de Configuración -> Windows Update.',
    },
    alertaEVO: {
      falsePositiveWarning: 'El Sector 20 profundizará en la auditoría completa de parches. No fuerces la deshabilitación permanente sin criterio técnico.',
      reversibilityRule: 'Ajuste conmutable desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-17',
      label: 'WINDOWS_UPDATE_WUAUSERV',
      defaultProvenance: 'SERVICES_WUAUSERV',
    },
  },
  {
    id: 'inv-06-18',
    code: '06.18',
    title: 'SysMain',
    subtitle: 'SuperFetch / SysMain: El servicio de precarga inteligente de aplicaciones en memoria RAM no utilizada',
    tabOrMetric: 'Servicio SysMain (SuperFetch)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Ves que SysMain usa un poco de lectura de disco al encender para cargar datos en RAM. ¿Por qué Windows pre-carga programas antes de que los abras?',
      mythVsTruth: {
        mentira: 'SysMain llena la RAM inutilmente y hay que desactivarlo siempre para tener "RAM libre".',
        verdad: 'RAM no utilizada es RAM desperdiciada. SysMain analiza qué apps usas habitualmente y las precarga en memoria RAM libre para que abran instantáneamente.',
        comprobalo: 'En `services.msc` -> Busca "SysMain". Observa su estado.',
      },
    },
    entende: {
      queEs: 'El motor de gestión de caché de memoria que mantiene patrones de uso anticipados de ejecutables.',
      paraQueSirve: 'Acelera el tiempo de lanzamiento de aplicaciones frecuentes.',
      quePasaSiFalta: 'Si tienes un SSD moderno NVMe, el impacto de SysMain es mínimo; en discos mecánicos antiguos HDD puede generar picos de uso.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "SysMain" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> SysMain',
      whatToLookFor: 'El Sector 07 estará dedicado completamente a la optimización profunda de SysMain y RAM.',
    },
    alertaEVO: {
      falsePositiveWarning: 'En SSDs de alta velocidad, SysMain no causa cuellos de botella. No apliques recetas ciegas de internet.',
      reversibilityRule: 'Reversible en services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-18',
      label: 'SYSMAIN_SUPERFETCH_CACHE',
      defaultProvenance: 'SERVICES_SYSMAIN',
    },
  },
  {
    id: 'inv-06-19',
    code: '06.19',
    title: 'Windows Search',
    subtitle: 'Servicio WSearch: Indexación de contenido de archivos, propiedades y correo para la búsqueda instantánea',
    tabOrMetric: 'Servicio WSearch (Windows Search)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Escribes el nombre de un documento en el menú Inicio y aparece en 0.1 segundos. Esa velocidad la proporciona el servicio de indexación `WSearch`.',
      mythVsTruth: {
        mentira: 'Deshabilitar Windows Search hace que la PC sea 50% más rápida sin ninguna desventaja.',
        verdad: 'Si deshabilitas WSearch, la búsqueda del menú Inicio y de File Explorer pasará a hacer un escaneo secuencial lento en disco cada vez que busques algo.',
        comprobalo: 'En `services.msc` -> Busca "Windows Search" (WSearch).',
      },
    },
    entende: {
      queEs: 'El motor de indexación que construye una base de datos de palabras clave y metadatos de tus archivos en segundo plano.',
      paraQueSirve: 'Permite búsquedas instantáneas en el menú inicio, explorador de archivos y Outlook.',
      quePasaSiFalta: 'Si lo deshabilitas, las búsquedas tardarán minutos en lugar de milisegundos.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "WSearch" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Windows Search',
      whatToLookFor: 'Podés configurar qué carpetas indexar desde Opciones de Indexación en lugar de matar el servicio completo.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Si WSearch consume CPU alto en un disco HDD, excluye carpetas con millones de archivos pequeños (ej. código fuente o node_modules).',
      reversibilityRule: 'Ajuste conmutable desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-19',
      label: 'WINDOWS_SEARCH_INDEXER',
      defaultProvenance: 'SERVICES_WSEARCH',
    },
  },
  {
    id: 'inv-06-20',
    code: '06.20',
    title: 'Print Spooler',
    subtitle: 'El servicio Spooler: Gestión de colas de impresión y por qué deshabilitarlo solo si no usas impresoras físicas ni PDF creadores',
    tabOrMetric: 'Servicio Spooler (Cola de impresión)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'El servicio `Spooler` administra los trabajos de impresión enviados a impresoras físicas o impresoras virtuales (Microsoft Print to PDF).',
      mythVsTruth: {
        mentira: 'Print Spooler debe deshabilitarse en todas las PCs del mundo porque no sirve para nada.',
        verdad: 'Si nunca conectas una impresora ni usas "Guardar como PDF" virtual de Windows, deshabilitar Spooler reduce la superficie de ataque (PrintNightmare). Pero si imprimes, es imprescindible.',
        comprobalo: 'En `services.msc` -> Busca "Cola de impresión" (Spooler).',
      },
    },
    entende: {
      queEs: 'El administrador de buffer que recibe documentos de las apps y los traduce a lenguaje de impresora (GDI/XPS).',
      paraQueSirve: 'Permite que la app siga respondiendo sin tener que esperar a que la impresora física termine de imprimir.',
      quePasaSiFalta: 'Si lo deshabilitas, no podrás imprimir ni generar archivos PDF mediante la impresora virtual de Windows.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "Spooler" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Cola de impresión',
      whatToLookFor: 'Determina si la PC auditada requiere funcionalidad de impresión real.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Históricamente, Spooler ha sufrido vulnerabilidades grave de elevación de privilegios. En servidores sin impresoras se recomienda deshabilitar.',
      reversibilityRule: 'Reversible desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-20',
      label: 'PRINT_SPOOLER_QUEUE',
      defaultProvenance: 'SERVICES_SPOOLER',
    },
  },
  {
    id: 'inv-06-21',
    code: '06.21',
    title: 'DHCP Client',
    subtitle: 'Servicio Dhcp: Asignación dinámica de direcciones IP y las consecuencias catastróficas de deshabilitarlo',
    tabOrMetric: 'Servicio Dhcp (Cliente DHCP)',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Si deshabilitas el servicio `Dhcp`, tu computadora perderá la capacidad de solicitar una dirección IP a tu router Wi-Fi o red local.',
      mythVsTruth: {
        mentira: 'Deshabilitar el Cliente DHCP aumenta la velocidad de Internet.',
        verdad: 'Deshabilitar el servicio Dhcp destruye la conectividad de red de la máquina. No podrá negociar dirección IP, puerta de enlace ni DNS dinámico.',
        comprobalo: 'En `services.msc` -> Busca "Cliente DHCP" (Dhcp). Verás que su tipo de inicio es Automático y no se debe modificar.',
      },
    },
    entende: {
      queEs: 'El cliente de protocolo que registra y actualiza la dirección IP y configuraciones de red de los adaptadores.',
      paraQueSirve: 'Garantiza que la PC obtenga acceso a la red local e Internet al conectarse a cualquier router.',
      quePasaSiFalta: 'Desconexión total de red y fallo en la resolución de interfaz.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "Dhcp" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Cliente DHCP',
      whatToLookFor: 'Verifica que este servicio de infraestructura esté SIEMPRE en ejecución.',
    },
    alertaEVO: {
      falsePositiveWarning: 'SERVICIO INTOCABLE DE RED: Bajo ninguna circunstancia deshabilites Dhcp en un equipo estándar.',
      reversibilityRule: 'Ajuste crítico del sistema.',
    },
    evidenceBadge: {
      code: 'EVD-06-21',
      label: 'DHCP_NETWORK_CORE',
      defaultProvenance: 'SERVICES_DHCP',
    },
  },
  {
    id: 'inv-06-22',
    code: '06.22',
    title: 'DNS Client',
    subtitle: 'Servicio Dnscache: Resolución de nombres de dominio y caché local de direcciones IP',
    tabOrMetric: 'Servicio Dnscache (Cliente DNS)',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Cada vez que escribes un sitio web (ej. google.com), el servicio `Dnscache` traduce ese nombre a su dirección IP numérica y guarda el resultado en memoria caché.',
      mythVsTruth: {
        mentira: 'El servicio Cliente DNS solo sirve para rastrear qué páginas visita el usuario.',
        verdad: 'Dnscache es el resolvedor y caché de nombres oficial del sistema. Acelera la navegación evitando consultas repetitivas al servidor DNS en cada clic.',
        comprobalo: 'En `services.msc` -> Busca "Cliente DNS" (Dnscache). Su tipo de inicio es Automático y está protegido por el SCM.',
      },
    },
    entende: {
      queEs: 'El subsistema que almacena en RAM la tabla de resoluciones DNS para todas las aplicaciones y navegadores.',
      paraQueSirve: 'Acelera la latencia de carga web y mantiene el archivo `hosts` procesado.',
      quePasaSiFalta: 'Si se rompe, las aplicaciones no podrán resolver nombres de dominio en la red.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "Dnscache" | Select-Object Name, Status, StartType',
      cmdCommand: 'ipconfig /displaydns',
      guiPath: 'services.msc -> Cliente DNS',
      whatToLookFor: 'Comprueba el contenido de la caché DNS con `ipconfig /displaydns`.',
    },
    alertaEVO: {
      falsePositiveWarning: 'SERVICIO INTOCABLE DE INFRAESTRUCTURA: Indispensable para el funcionamiento de la pila TCP/IP.',
      reversibilityRule: 'Componente protegido del sistema.',
    },
    evidenceBadge: {
      code: 'EVD-06-22',
      label: 'DNS_CACHE_RESOLVER',
      defaultProvenance: 'SERVICES_DNSCACHE',
    },
  },
  {
    id: 'inv-06-23',
    code: '06.23',
    title: 'Audio',
    subtitle: 'AudioSrv y AudioEndpointBuilder: La cadena de servicios para la reproducción y captura de sonido',
    tabOrMetric: 'Servicios AudioSrv / AudioEndpointBuilder',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Si en la barra de tareas ves una X roja sobre el icono del parlante con el mensaje "El servicio de audio no se está ejecutando", se detuvo `AudioSrv`.',
      mythVsTruth: {
        mentira: 'El sonido funciona directamente desde el hardware de la placa de audio sin requerir servicios en Windows.',
        verdad: 'El subsistema de audio requiere la cadena combinada de `AudioEndpointBuilder` (descubrimiento de jacks y HDMI) y `AudioSrv` (mezcla de audio de aplicaciones).',
        comprobalo: 'En `services.msc` -> Revisa "Servicio de audio de Windows" (AudioSrv).',
      },
    },
    entende: {
      queEs: 'Los servicios que gestionan los puntos de acceso de reproducción/micrófono y la API WASAPI del SO.',
      paraQueSirve: 'Permite que múltiples programas compartan la tarjeta de sonido simultáneamente.',
      quePasaSiFalta: 'Perdida total de salida de sonido y micrófonos en todas las aplicaciones.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "AudioSrv","AudioEndpointBuilder" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Servicio de audio de Windows',
      whatToLookFor: 'Observa la relación de dependencia entre AudioEndpointBuilder y AudioSrv.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Reiniciar el servicio AudioSrv suele solucionar congelamientos de sonido sin necesidad de reiniciar la PC.',
      reversibilityRule: 'Ajuste conmutable desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-23',
      label: 'AUDIO_SUBSYSTEM_CHAIN',
      defaultProvenance: 'SERVICES_AUDIOSRV',
    },
  },
  {
    id: 'inv-06-24',
    code: '06.24',
    title: 'Bluetooth',
    subtitle: 'Servicios de soporte para Bluetooth (bthserv) y la vinculación de periféricos inalámbricos',
    tabOrMetric: 'Servicio bthserv (Servicio de compatibilidad con Bluetooth)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'El servicio `bthserv` gestiona el descubrimiento, vinculación y perfiles de audio/datos para auriculares, teclados y mouses Bluetooth.',
      mythVsTruth: {
        mentira: 'Bluetooth consume 20% de procesador de forma permanente aunque no tengas antenas o dispositivos vinculados.',
        verdad: 'El servicio `bthserv` utiliza Trigger Start. Permanece detenido si no hay adaptador Bluetooth o no hay transferencia activa.',
        comprobalo: 'En `services.msc` -> Busca "Servicio de compatibilidad con Bluetooth" (bthserv).',
      },
    },
    entende: {
      queEs: 'El motor de la pila de protocolo Bluetooth de Windows que administra la autenticación de dispositivos de radio frecuencia.',
      paraQueSirve: 'Conecta audífonos inalámbricos, mandos de juegos y periféricos.',
      quePasaSiFalta: 'Si no usas ningún dispositivo Bluetooth en una PC de escritorio, ponerlo en Manual es completamente seguro.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "bthserv" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Servicio de compatibilidad con Bluetooth',
      whatToLookFor: 'Verifica el estado del servicio según la presencia de hardware Bluetooth en el equipo.',
    },
    alertaEVO: {
      falsePositiveWarning: 'No deshabilites bthserv en una laptop si usas audífonos inalámbricos habitualmente.',
      reversibilityRule: 'Reversible en services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-24',
      label: 'BLUETOOTH_STACK_SERVICE',
      defaultProvenance: 'SERVICES_BTHSERV',
    },
  },
  {
    id: 'inv-06-25',
    code: '06.25',
    title: 'Xbox Services',
    subtitle: 'Servicios de Xbox (XblAuthManager, XblGameSave, XboxNetApiSvc): Por qué deshabilitarlos no aumenta mágicamente los FPS',
    tabOrMetric: 'Servicios Xbox (XblAuthManager, XboxNetApiSvc, etc.)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'En internet existen "scripts de optimización" que prometen ganar 20 FPS deshabilitando todos los servicios de Xbox. ¿Qué hay de cierto en esto?',
      mythVsTruth: {
        mentira: 'Los servicios de Xbox están ralentizando tu placa de video y si los deshabilitas ganas el doble de rendimiento en juegos.',
        verdad: 'Los servicios de Xbox están en modo Manual y consumen 0 MB de RAM y 0% de CPU cuando no usas juegos de Game Pass o la app de Xbox.',
        comprobalo: 'Abre `services.msc` y verifica que los servicios Xbox están en estado "Detenido" mientras juegas un juego estándar de Steam.',
      },
    },
    entende: {
      queEs: 'Servicios de autenticación, guardado en la nube y juego en red para títulos de la plataforma Microsoft Xbox / Game Pass.',
      paraQueSirve: 'Permiten la sincronización de partidas guardadas y autenticación de perfil de jugador.',
      quePasaSiFalta: 'If los deshabilitas y luego intentas jugar un juego de Xbox Game Pass (ej. Forza, Halo), el juego dará error de inicio de sesión.',
    },
    interactua: {
      powershellCommand: 'Get-Service | Where-Object Name -like "*Xbox*" -or Name -like "*Xbl*" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Servicios Xbox',
      whatToLookFor: 'Observa que están en Manual. Dejarlos en Manual es la mejor práctica sin romper Game Pass.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Mito Desmontado: Deshabilitar servicios Xbox en modo Manual no aumenta los FPS en juegos.',
      reversibilityRule: 'Ajuste conmutable desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-25',
      label: 'XBOX_SERVICES_MYTH_BUSTED',
      defaultProvenance: 'SERVICES_XBOX_GAMING',
    },
  },
  {
    id: 'inv-06-26',
    code: '06.26',
    title: 'Cryptographic Services',
    subtitle: 'Servicio CryptSvc: Firmas digitales, catálogo de controladores y validación de componentes de Windows',
    tabOrMetric: 'Servicio CryptSvc (Servicios criptográficos)',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Cuando instalas un ejecutable o un driver, Windows verifica la firma digital del archivo usando `CryptSvc`. Si lo detienes, recibirás advertencias de instalador no firmado.',
      mythVsTruth: {
        mentira: 'CryptSvc es un programa para minar criptomonedas instalado por sorpresa.',
        verdad: 'Cryptographic Services (CryptSvc) valida las firmas PKI, catálogos de controladores (catdb) y certificados de confianza de Windows.',
        comprobalo: 'En `services.msc` -> Busca "Servicios criptográficos" (CryptSvc).',
      },
    },
    entende: {
      queEs: 'El motor de validación de infraestructura de clave pública (PKI) y base de datos de firmas de código del SO.',
      paraQueSirve: 'Impide la ejecución o instalación de controladores modificados por malware sin firma válida.',
      quePasaSiFalta: 'Si se deshabilita, Windows Update y la instalación de drivers fallarán por firmas no reconocidas.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "CryptSvc" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Servicios criptográficos',
      whatToLookFor: 'Aprecia la importancia de CryptSvc en la cadena de confianza del sistema.',
    },
    alertaEVO: {
      falsePositiveWarning: 'SERVICIO INTOCABLE DE SEGURIDAD: Indispensable para la integridad de parches y controladores.',
      reversibilityRule: 'Componente protegido del sistema.',
    },
    evidenceBadge: {
      code: 'EVD-06-26',
      label: 'CRYPTOGRAPHIC_SERVICES_PKI',
      defaultProvenance: 'SERVICES_CRYPTSVC',
    },
  },
  {
    id: 'inv-06-27',
    code: '06.27',
    title: 'Defender',
    subtitle: 'Servicios WinDefend y Sense: La arquitectura de servicios del motor antivirus y EDR de Microsoft',
    tabOrMetric: 'Servicios WinDefend / Sense (Microsoft Defender)',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'El antivirus integrado Microsoft Defender opera mediante los servicios `WinDefend` (Servicio Antivirus) y `Sense` (Protección avanzada EDR).',
      mythVsTruth: {
        mentira: 'Puedes deshabilitar WinDefend haciendo clic derecho -> Detener en services.msc.',
        verdad: 'WinDefend está protegido por el sistema de autosalvaguarda (Tamper Protection). No se puede detener manualmente desde services.msc para evitar que el malware lo apague.',
        comprobalo: 'Intenta cambiar el tipo de inicio de WinDefend en services.msc: las opciones aparecerán grisadas (bloqueadas).',
      },
    },
    entende: {
      queEs: 'El servicio de protección en tiempo real que inspecciona archivos, memoria y firmas antes de autorizar la ejecución.',
      paraQueSirve: 'Aísla amenazas conocidas y detecta comportamientos anómalos de malware.',
      quePasaSiFalta: 'Si instalas un antivirus de terceros compatible (ej. Kaspersky, Bitdefender), Windows desactivará WinDefend automáticamente de forma limpia.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "WinDefend","Sense" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Servicio Antivirus de Microsoft Defender',
      whatToLookFor: 'Observa la protección Tamper Protection bloqueando cambios no autorizados.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Nunca intentes forzar la deshabilitación de Defender mediante scripts no auditados; dañará la base de datos WMI de seguridad.',
      reversibilityRule: 'Gestionado a nivel de la interfaz de Seguridad de Windows.',
    },
    evidenceBadge: {
      code: 'EVD-06-27',
      label: 'DEFENDER_ANTIVIRUS_SERVICE',
      defaultProvenance: 'SERVICES_WINDEFEND',
    },
  },
  {
    id: 'inv-06-28',
    code: '06.28',
    title: 'RDP',
    subtitle: 'Servicio TermService: Servicios de Escritorio Remoto y la auditoría defensiva de puertos y conexiones',
    tabOrMetric: 'Servicio TermService (Escritorio remoto)',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'El servicio `TermService` (Servicios de Escritorio remoto) permite conectarse gráficamente a la computadora a través de la red (Puerto 3389).',
      mythVsTruth: {
        mentira: 'Tener TermService activo expondrá tu computadora a todo internet sin clave.',
        verdad: 'TermService solo acepta conexiones si la función "Escritorio Remoto" está activada en Configuración y requiere autenticación NLA previa con usuario y clave.',
        comprobalo: 'En `services.msc` -> Busca "Servicios de Escritorio remoto" (TermService). Por defecto está en Manual.',
      },
    },
    entende: {
      queEs: 'El servidor RDP (Remote Desktop Protocol) integrado en las ediciones Pro y Enterprise de Windows.',
      paraQueSirve: 'Permite la administración remota completa del escritorio.',
      quePasaSiFalta: 'Si no utilizas administración remota, mantener la función desactivada en Configuración es la mejor práctica de hardening.',
    },
    interactua: {
      powershellCommand: 'Get-Service -Name "TermService" | Select-Object Name, Status, StartType',
      guiPath: 'services.msc -> Servicios de Escritorio remoto',
      whatToLookFor: 'Asegúrate de que la función Escritorio Remoto solo esté activa cuando realmente la necesitas.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Nunca expongas el puerto 3389 RDP directamente a Internet sin una VPN de capa previa.',
      reversibilityRule: 'Ajuste conmutable desde services.msc y Configuración.',
    },
    evidenceBadge: {
      code: 'EVD-06-28',
      label: 'RDP_REMOTE_DESKTOP_SERVICE',
      defaultProvenance: 'SERVICES_TERMSERVICE',
    },
  },
  {
    id: 'inv-06-29',
    code: '06.29',
    title: 'OEM services',
    subtitle: 'Metodología pericial de auditoría de servicios de fabricantes (ASUS, Dell, HP, Lenovo, MSI)',
    tabOrMetric: 'Servicios de Terceros / Fabricante de Hardware',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Al instalar software de motherboard o laptop, se agregan 5 a 10 servicios nuevos de ASUS, Dell, HP, Lenovo o MSI. ¿Cómo auditar cuáles son vitales?',
      mythVsTruth: {
        mentira: 'Hay que borrar todos los servicios que tengan la palabra ASUS, Dell o Lenovo.',
        verdad: 'Se aplica la Metodología EVO de 8 Pasos: Nombre -> Fabricante -> Ejecutable -> Ruta -> Función -> Dependencias -> Uso Real -> Decisión.',
        comprobalo: 'Ejecutá `Get-Service | Where-Object {$_.DisplayName -match "ASUS|Dell|HP|Lenovo|MSI"}` en PowerShell.',
      },
    },
    entende: {
      queEs: 'Servicios en segundo plano creados por los paquetes de software del fabricante del equipo.',
      paraQueSirve: 'Suelen controlar perfiles de ventilación, actualizaciones de firmware y luces RGB.',
      quePasaSiFalta: 'Si deshabilitas el servicio de control térmico de una laptop gaming, los ventiladores podrían quedar fijos al mínimo causando sobrecalentamiento.',
    },
    interactua: {
      powershellCommand: 'Get-Service | Where-Object {$_.DisplayName -match "Dell|ASUS|Lenovo|HP|MSI"} | Select-Object Name, DisplayName, Status, StartType',
      guiPath: 'services.msc -> Filtro por fabricante',
      whatToLookFor: 'Evalúa la función real de hardware de cada servicio antes de modificarlo.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Diferencia entre un servicio de control de batería (útil) y un servicio de telemetría o publicidad (desactivable).',
      reversibilityRule: 'Reversible desde services.msc.',
    },
    evidenceBadge: {
      code: 'EVD-06-29',
      label: 'OEM_SERVICES_AUDIT_PROTOCOL',
      defaultProvenance: 'SERVICES_OEM_VENDOR',
    },
  },
  {
    id: 'inv-06-30',
    code: '06.30',
    title: 'Servicios huérfanos',
    subtitle: 'Identificación y limpieza segura de entradas de servicios huérfanos con rutas de ejecutable inexistentes',
    tabOrMetric: 'Servicios con ruta inválida o ejecutable faltante',
    riskLevel: 'CONFIG_MODIFY_RISK',
    descubri: {
      hook: 'Al desinstalar una aplicación mal programada, la entrada del servicio puede quedar registrada en SCM apuntando a una ruta de ejecutable que ya no existe.',
      mythVsTruth: {
        mentira: 'Un servicio huérfano consume 50% de CPU buscando su archivo todo el tiempo.',
        verdad: 'Un servicio huérfano falla al intentar iniciar (Error 2: El sistema no puede encontrar el archivo especificado) y queda en estado Detenido sin consumir recursos.',
        comprobalo: 'Revisa las propiedades de los servicios detenidos y verifica si la "Ruta de acceso al ejecutable" existe realmente en el disco.',
      },
    },
    entende: {
      queEs: 'Una clave en la base de datos de SCM (`HKLM\\SYSTEM\\CurrentControlSet\\Services`) cuyo binario ejecutable fue borrado.',
      paraQueSirve: 'Identificar residuos de desinstalaciones incompletas o rastros de malware eliminado.',
      quePasaSiFalta: 'Se puede eliminar la entrada huérfana de forma limpia utilizando el comando `sc delete [NombreServicio]`.',
    },
    interactua: {
      powershellCommand: 'Get-CimInstance Win32_Service | Where-Object { -not (Test-Path $_.PathName.Split(" ")[0].Replace(\'"\', \'\')) } | Select-Object Name, PathName',
      cmdCommand: 'sc delete [NombreServicio]',
      guiPath: 'services.msc / Registro de Windows',
      whatToLookFor: 'Verifica la inexistencia del archivo ejecutable antes de ejecutar `sc delete`.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Regla Inviolable: NUNCA ejecutes `sc delete` sobre un servicio si no estás 100% seguro de que la ruta está vacía o es un residuo no deseado.',
      reversibilityRule: 'Eliminar una clave del registro de servicios no se puede deshacer con "Ctrl+Z"; requiere backup previo.',
    },
    evidenceBadge: {
      code: 'EVD-06-30',
      label: 'ORPHAN_SERVICE_CLEANUP',
      defaultProvenance: 'SERVICES_ORPHAN_ENTRY',
    },
  },
  {
    id: 'inv-06-31',
    code: '06.31',
    title: 'Qué NO desactivar',
    subtitle: 'Categorías de alto riesgo: Servicios de red, criptografía, seguridad, RPC y subsistemas de inicio',
    tabOrMetric: 'Matriz de Categorías Intocables en services.msc',
    riskLevel: 'PROCESS_TERMINATION_RISK',
    descubri: {
      hook: 'Para evitar romper Windows, la metodología EVO establece categorías estrictas de servicios que NUNCA deben desactivarse.',
      mythVsTruth: {
        mentira: 'Existe una lista mágica universal de 50 servicios que se pueden desactivar en todas las computadoras del mundo.',
        verdad: 'No existen recetas universales. Deshabilitar a ciegas provoca fallos de red, audio, impresoras, actualizaciones o pantallas azules.',
        comprobalo: 'Revisa la regla EVO: Si no sabes exactamente qué hace un servicio y de qué depende, NO LO DESACTIVES.',
      },
    },
    entende: {
      queEs: 'El protocolo de protección operacional que clasifica los servicios en 5 Categorías de Alto Riesgo.',
      paraQueSirve: 'Garantiza la estabilidad, seguridad e integridad operativa de la computadora.',
      quePasaSiFalta: 'Evita colapsos de sistema provocados por modificaciones irreflexivas.',
    },
    interactua: {
      powershellCommand: '# Categorías Intocables: Network Core, Security, Cryptographic, RPC, Logon/Session',
      guiPath: 'services.msc -> Matriz de protección',
      whatToLookFor: 'Aplica el principio de prudencia pericial.',
    },
    alertaEVO: {
      falsePositiveWarning: 'REGLA ABSOLUTA EVO: Si no sabes qué hace -> NO LO DESACTIVES.',
      reversibilityRule: 'Principio fundamental de mantenimiento técnico.',
    },
    evidenceBadge: {
      code: 'EVD-06-31',
      label: 'CRITICAL_SERVICES_PROTECTION_MATRIX',
      defaultProvenance: 'SERVICES_PROTECTION_MATRIX',
    },
  },
  {
    id: 'inv-06-32',
    code: '06.32',
    title: 'Por qué “50 servicios para FPS” es una mala receta',
    subtitle: 'Desmontando el mito con la Metodología A/B de medición científica: Baseline, Cambio único, Medición y Comparación',
    tabOrMetric: 'Metodología A/B de Medición de Rendimiento Real',
    riskLevel: 'MONITOR_ONLY',
    descubri: {
      hook: 'Viste un video en YouTube titulado "Desactiva estos 50 servicios para ganar 30 FPS en juegos". ¿Qué muestra la evidencia pericial cuando medimos esto de verdad?',
      mythVsTruth: {
        mentira: 'Desactivar masivamente servicios en Manual o Idle aumenta los FPS y elimina el lag en los juegos.',
        verdad: 'Los servicios en Manual o Idle durmientes usan 0% de CPU durante el juego. Desactivarlos no aumenta los FPS y solo arriesga romper funciones del sistema (efecto placebo).',
        comprobalo: 'Aplica la Metodología A/B EVO: Registra un Baseline de FPS -> Aplica UN solo cambio -> Mide con software pericial (CapFrameX/Frametime) -> Compara resultados reales.',
      },
    },
    entende: {
      queEs: 'El protocolo científico de auditoría de rendimiento que reemplaza el sesgo de confirmación y el placebo por mediciones de percentil 1% / 0.1% Lows de FPS.',
      paraQueSirve: 'Demuestra con datos duros si una supuesta "optimización" genera un beneficio real o destruye estabilidad.',
      quePasaSiFalta: 'Protege al usuario de scripts destructivos que rompen tiendas de juegos, audio espacial o parches de seguridad.',
    },
    interactua: {
      powershellCommand: '# Metodología EVO: 1. Baseline -> 2. Cambio Único -> 3. Medición -> 4. Comparar -> 5. Conservar/Revertir',
      guiPath: 'Prueba de rendimiento pericial A/B',
      whatToLookFor: 'Mide la latencia de frametime, no solo el número promedio de FPS visual.',
    },
    alertaEVO: {
      falsePositiveWarning: 'Cualquier ganancia de rendimiento alegada sin un reporte A/B con medición de Frametime es considerada MENTIRA O PLACEBO.',
      reversibilityRule: 'Conserva siempre tu punto de restauración o baseline antes de probar cualquier tweak.',
    },
    evidenceBadge: {
      code: 'EVD-06-32',
      label: 'AB_TESTING_FPS_MYTH_DEBUNKED',
      defaultProvenance: 'EVO_AB_BENCHMARK_METHODOLOGY',
    },
  },
];

export const SECTOR_06_MINICASES: Sector06MiniCase[] = [
  {
    id: 'case-06-a',
    code: 'CASO 06-A',
    title: 'El colapso de Internet por tocar la red',
    scenario: 'Un usuario ejecutó un script de "optimización de servicios" bajado de una red social. Al reiniciar, la PC no tiene conexión a Internet ni por Wi-Fi ni por cable Ethernet.',
    userStatement: '“¡El script me aceleró la PC pero ahora Windows dice que no hay adaptadores de red instalados!”',
    initialMistake: 'Ejecutar un script de deshabilitación masiva de servicios sin revisar dependencias de red.',
    diagnosticQuestion: '¿Qué servicio de infraestructura fue deshabilitado provocando la pérdida de la asignación IP?',
    options: [
      {
        id: 'c6_a1',
        text: 'El servicio Cliente DHCP (Dhcp) y/o Cliente DNS (Dnscache), que gestionan la negociación IP y nombres.',
        isCorrect: true,
        explanation: 'Sin Dhcp, el adaptador no puede solicitar dirección IP al router. Al restaurar Dhcp a Automático, la red volvió a funcionar de inmediato.',
      },
      {
        id: 'c6_a2',
        text: 'El servicio de la calculadora de Windows.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'El script cambió Dhcp y Dnscache a Deshabilitado. Restaurando el tipo de inicio a Automático se recuperó la conexión.',
    lessonLearned: 'Los servicios de red core (Dhcp, Dnscache, NlaSvc) son INTOCABLES.',
  },
  {
    id: 'case-06-b',
    code: 'CASO 06-B',
    title: 'El misterio de la impresora muda',
    scenario: 'Un administrativo intenta imprimir una factura urgente pero la ventana de selección de impresoras aparece vacía y muestra el mensaje "El servicio de spooler local no se está ejecutando".',
    userStatement: '“Se rompió el cable USB de la impresora porque ayer funcionaba bien.”',
    initialMistake: 'Asumir fallo de hardware sin revisar el estado del servicio Cola de Impresión (Spooler).',
    diagnosticQuestion: '¿Por qué la ventana de selección de impresoras no muestra ningún dispositivo?',
    options: [
      {
        id: 'c6_b1',
        text: 'Porque el servicio Spooler (Cola de impresión) está detenido o deshabilitado, impidiendo que las apps hablen con el subsistema de impresión.',
        isCorrect: true,
        explanation: 'Al iniciar el servicio Spooler en services.msc, las impresoras volvieron a aparecer en pantalla al instante.',
      },
      {
        id: 'c6_b2',
        text: 'Porque se agotó el papel en la bandeja.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Un limpiador de registro automático había puesto el servicio Spooler en Deshabilitado.',
    lessonLearned: 'Antes de culpar al hardware, verifica el estado del servicio Win32 correspondiente en services.msc.',
  },
  {
    id: 'case-06-c',
    code: 'CASO 06-C',
    title: 'El error del juego que no abre en Game Pass',
    scenario: 'Un gamer aplicó un tweak para "quitar bloatware de Xbox" deshabilitando todos los servicios que decían Xbox. Al intentar abrir un juego de Xbox Game Pass, la pantalla muestra el error 0x80070422.',
    userStatement: '“¡El juego no abre y la tienda de Windows tira un código de error críptico!”',
    initialMistake: 'Creer que los servicios Xbox en Manual estaban ralentizando el sistema y deshabilitarlos a la fuerza.',
    diagnosticQuestion: '¿Qué provocó el error 0x80070422 al abrir el juego?',
    options: [
      {
        id: 'c6_c1',
        text: 'El error 0x80070422 significa que un servicio necesario (XblAuthManager) está configurado como Deshabilitado y no puede ser invocado.',
        isCorrect: true,
        explanation: 'Cambiar los servicios de Xbox de Deshabilitado a Manual permitió que el juego autenticara la cuenta y abriera normalmente.',
      },
      {
        id: 'c6_c2',
        text: 'La placa de video no es compatible con Direct3D.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Mito de optimización desmontado: Poner servicios Xbox de Manual a Deshabilitado no ganó FPS y rompió la plataforma de juegos.',
    lessonLearned: 'Los servicios en modo Manual no consumen recursos cuando no se usan; deshabilitarlos solo rompe su función cuando la necesites.',
  },
  {
    id: 'case-06-d',
    code: 'CASO 06-D',
    title: 'El servicio OEM que congelaba la laptop',
    scenario: 'Una laptop gaming comenzó a apagarse por sobrecalentamiento durante las partidas. Un técnico descubrió que los ventiladores nunca subían de velocidad.',
    userStatement: '“La laptop junta temperatura y se apaga sola a los 10 minutos de jugar.”',
    initialMistake: 'Diagnosticar ventiladores rotos sin revisar la consola de servicios del fabricante (ASUS/Lenovo/Dell).',
    diagnosticQuestion: '¿Qué servicio de fabricante había sido deshabilitado erróneamente por el usuario?',
    options: [
      {
        id: 'c6_d1',
        text: 'El servicio de gestión de perfiles térmicos del fabricante (ej. ASUS Optimization / Lenovo Thermal) que ajusta las RPM según la temperatura.',
        isCorrect: true,
        explanation: 'Al estar deshabilitado el servicio OEM, la BIOS mantenía una velocidad de ventilador de reposo conservadora de 1000 RPM.',
      },
      {
        id: 'c6_d2',
        text: 'El servicio de hora de Windows.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Restaurando el servicio de gestión térmica del OEM a Automático, los ventiladores volvieron a acelerar correctamente.',
    lessonLearned: 'Auditá la función real de hardware de los servicios OEM antes de aplicar listas de desinstalación a ciegas.',
  },
  {
    id: 'case-06-e',
    code: 'CASO 06-E',
    title: 'El mito de la ganancia de FPS',
    scenario: 'Un usuario aplicó la guía "50 servicios para optimizar Windows". Al medir el rendimiento en un juego competitivo antes y después, el FPS promedio fue exactamente el mismo (144 FPS) pero la latencia de frametime empeoró.',
    userStatement: '“Siento que el juego va más rápido pero a veces pega tirones.”',
    initialMistake: 'Confiar en la sensación subjetiva (placebo) sin medir datos duros con la Metodología A/B.',
    diagnosticQuestion: '¿Por qué la deshabilitación masiva de 50 servicios no aumentó los FPS promedio y sí causó tirones?',
    options: [
      {
        id: 'c6_e1',
        text: 'Porque los servicios durmientes en Manual no consumían CPU durante el juego, pero al deshabilitar servicios auxiliares, componentes del SO entraron en bucles de error intentando invocarlos.',
        isCorrect: true,
        explanation: 'La evidencia pericial demuestra que apagar servicios no activos no libera ciclos de GPU o CPU y provoca inestabilidad.',
      },
      {
        id: 'c6_e2',
        text: 'Porque el monitor no era de 240Hz.',
        isCorrect: false,
        explanation: 'Incorrecto.',
      },
    ],
    technicalVerdict: 'Prueba pericial A/B concluyente: Cero ganancia de FPS y pérdida de funciones esenciales.',
    lessonLearned: 'Mide siempre con pruebas científicas A/B. No aceptes placebo ni recetas milagrosas.',
  },
];

export const SECTOR_06_TEST_BANK: Sector06TestQuestion[] = [
  {
    id: 't06-q01',
    questionNumber: 1,
    category: 'ARQUITECTURA_SCM',
    question: '¿Cuál es el proceso ejecutable central de Windows que actúa como el Service Control Manager (SCM)?',
    options: [
      { id: 'opt_1', text: 'services.exe en C:\\Windows\\System32' },
      { id: 'opt_2', text: 'explorer.exe en C:\\Windows' },
      { id: 'opt_3', text: 'cmd.exe en Temp' },
      { id: 'opt_4', text: 'taskmgr.exe en System32' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'services.exe es el binario protegido del sistema que ejecuta como Service Control Manager (SCM).',
    relatedInvestigationCode: '06.02',
  },
  {
    id: 't06-q02',
    questionNumber: 2,
    category: 'TIPOS_INICIO',
    question: '¿Qué significa realmente que un servicio tenga el tipo de inicio en "Manual"?',
    options: [
      { id: 'opt_1', text: 'Que se iniciará automáticamente cuando otra aplicación o el SO soliciten su función' },
      { id: 'opt_2', text: 'Que está totalmente deshabilitado y nunca podrá ejecutarse' },
      { id: 'opt_3', text: 'Que solo puede iniciarse si el usuario abre services.msc y hace clic en Iniciar' },
      { id: 'opt_4', text: 'Que se borrará al apagar la PC' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'Manual significa "Iniciado a demanda": el SCM lo activa en cuanto una API o programa invoca su servicio.',
    relatedInvestigationCode: '06.05',
  },
  {
    id: 't06-q03',
    questionNumber: 3,
    category: 'DEPENDENCIAS',
    question: '¿Qué ocurre si deshabilitas un servicio raíz del cual dependen otros 5 servicios?',
    options: [
      { id: 'opt_1', text: 'Los 5 servicios dependientes fallarán al intentar iniciarse por falta del componente base' },
      { id: 'opt_2', text: 'Windows aumentará los FPS un 50%' },
      { id: 'opt_3', text: 'Los 5 servicios se convertirán en aplicaciones de escritorio' },
      { id: 'opt_4', text: 'Se borrará el disco duro' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'El Grafo de Dependencias exige que el servicio padre esté en ejecución para autorizar la carga de los servicios dependientes.',
    relatedInvestigationCode: '06.08',
  },
  {
    id: 't06-q04',
    questionNumber: 4,
    category: 'IDENTIDAD_SEGURIDAD',
    question: '¿Cuál es la cuenta de servicio con privilegios supremos e ilimitados en la computadora local?',
    options: [
      { id: 'opt_1', text: 'NT AUTHORITY\\SYSTEM (LocalSystem)' },
      { id: 'opt_2', text: 'NT AUTHORITY\\LocalService' },
      { id: 'opt_3', text: 'NT AUTHORITY\\NetworkService' },
      { id: 'opt_4', text: 'Cuenta de Invitado' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'LocalSystem (SYSTEM) es la identidad suprema del kernel de Windows en la máquina local.',
    relatedInvestigationCode: '06.11',
  },
  {
    id: 't06-q05',
    questionNumber: 5,
    category: 'DIAGNÓSTICO',
    question: '¿Qué demuestra la Metodología A/B pericial de EVO LABS sobre deshabilitar masivamente 50 servicios en modo Manual?',
    options: [
      { id: 'opt_1', text: 'Que genera cero ganancia de FPS reales y arriesga romper funciones esenciales del sistema' },
      { id: 'opt_2', text: 'Que duplica la velocidad de la tarjeta gráfica' },
      { id: 'opt_3', text: 'Que es obligatorio para jugar en PC' },
      { id: 'opt_4', text: 'Que borra los virus de la memoria' },
    ],
    correctOptionId: 'opt_1',
    technicalExplanation: 'Los servicios durmientes en Manual no consumen CPU durante los juegos. Desactivarlos es placebo y causa inestabilidad.',
    relatedInvestigationCode: '06.32',
  },
];
