import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Seguridad II · Investigaciones 088–100. Auditorías no destructivas y casos didácticos. */
export const EVO_MAGAZINE_SECURITY_B: EvoMagazineArticle[] = [
  {
    "id": 88,
    "goal": "Detectar indicios de instalación reciente de servicios sin deshabilitar Windows.",
    "basics": "Un servicio nuevo puede ser resultado de software legítimo. El registro Sistema puede almacenar eventos 7045 de instalación, pero la configuración de auditoría y la retención determinan qué evidencia permanece.",
    "steps": [
      {
        "title": "Inventariá servicios del equipo",
        "why": "Win32_Service expone el nombre y el archivo que arranca cada servicio.",
        "code": "Get-CimInstance Win32_Service | Select-Object -First 25 Name,State,StartMode,PathName",
        "expect": "Obtendrás servicios con distintas rutas e inicios."
      },
      {
        "title": "Buscá eventos de instalación recientes",
        "why": "El evento 7045 se registra habitualmente cuando Service Control Manager instala un servicio.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='System';Id=7045;StartTime=(Get-Date).AddDays(-14)} -MaxEvents 15 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,Message",
        "expect": "Puede haber instalaciones recientes, o ninguna si se conservaron otros periodos."
      },
      {
        "title": "Relacioná con aplicaciones instaladas",
        "why": "Consultá un inventario parcial de productos, sin usar Win32_Product para evitar reconfiguraciones.",
        "code": "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' -ErrorAction SilentlyContinue | Select-Object -First 15 DisplayName,Publisher,InstallDate",
        "expect": "La fecha puede faltar o no ser precisa."
      }
    ],
    "tip": "Truco: correlacioná hora del servicio con una instalación conocida y su firma digital.",
    "warning": "No deshabilites un servicio nuevo solo por no reconocer su nombre.",
    "challenge": "Explicá qué tres pruebas usarías antes de clasificar una instalación como sospechosa."
  },
  {
    "id": 89,
    "goal": "Reconocer patrones de consumo compatibles con minería no autorizada sin confundirlos con juegos.",
    "basics": "La minería de criptomonedas utiliza CPU o GPU, pero lo mismo ocurre con compilaciones, juegos y diseño. Carga alta, temperatura y conexiones desconocidas deben evaluarse junto con la procedencia del proceso.",
    "steps": [
      {
        "title": "Revisá tiempo acumulado de CPU",
        "why": "La columna CPU de Get-Process registra tiempo total y no porcentaje instantáneo.",
        "code": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 12 Name,Id,CPU",
        "expect": "Un programa antiguo puede figurar arriba aunque ya esté inactivo."
      },
      {
        "title": "Identificá rutas de procesos",
        "why": "Las rutas ayudan a reconocer editores e instalaciones, según permisos.",
        "code": "Get-CimInstance Win32_Process | Select-Object -First 20 Name,ProcessId,ExecutablePath",
        "expect": "Una ruta no basta para concluir que es un minero."
      },
      {
        "title": "Compará con actividad actual",
        "why": "Usá el Administrador de tareas para medir porcentaje en ese momento.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Vas a poder contrastar CPU y GPU cuando el driver exponga métricas."
      }
    ],
    "tip": "Truco: medí el mismo proceso durante varios minutos y relacioná consumo, firma y actividad de red.",
    "warning": "No borres archivos ni instales limpiadores para criptominería basándote en un porcentaje aislado.",
    "challenge": "Describí cómo descartarías una compilación, actualización o escaneo legítimo."
  },
  {
    "id": 90,
    "goal": "Entender cómo funcionan los keyloggers y qué indicios pueden investigarse defensivamente.",
    "basics": "Un keylogger puede registrar pulsaciones usando distintos mecanismos. No existe un solo comando de Windows que detecte todos los tipos. La defensa combina permisos, software de seguridad, procedencia y comportamientos sospechosos.",
    "steps": [
      {
        "title": "Consultá programas de inicio",
        "why": "Un mecanismo de persistencia puede estar entre los programas de inicio, pero la mayoría son legítimos.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object Name,Location,Command",
        "expect": "Aparecen algunas entradas, no todo el software que se ejecuta."
      },
      {
        "title": "Revisá procesos de la sesión",
        "why": "Identificá aplicaciones instaladas y ubicaciones de ejecutables.",
        "code": "Get-CimInstance Win32_Process | Select-Object -First 20 Name,ProcessId,ExecutablePath",
        "expect": "La lista parcial no equivale a un análisis antimalware."
      },
      {
        "title": "Comprobá controles de protección",
        "why": "Si Defender está disponible, consultá el estado sin modificar su configuración.",
        "code": "Get-Command Get-MpComputerStatus -ErrorAction SilentlyContinue | Select-Object Name,Source",
        "expect": "El cmdlet puede faltar, según edición o plataforma."
      }
    ],
    "tip": "Truco: un formulario de contraseña comprometido también puede originarse en phishing, no necesariamente en un keylogger local.",
    "warning": "No instales detectores de pulsaciones de origen desconocido ni grabes entradas de otras personas.",
    "challenge": "Explicá por qué inspeccionar procesos no basta para garantizar que un equipo no tiene capturas de teclado."
  },
  {
    "id": 91,
    "goal": "Buscar cambios inesperados en archivos y configuraciones del sistema.",
    "basics": "Windows cambia cuando instalás programas, controladores y actualizaciones. Para reconocer modificaciones no autorizadas necesitás una línea base anterior, firma digital y registros; una fecha reciente aislada no prueba manipulación.",
    "steps": [
      {
        "title": "Registrá la compilación",
        "why": "La versión ayuda a explicar cambios legítimos por actualización.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Version,BuildNumber,LastBootUpTime",
        "expect": "Verás datos de sistema para comparar con un informe anterior."
      },
      {
        "title": "Revisá la firma de un archivo conocido",
        "why": "Esta prueba verifica un ejecutable de Windows sin alterarlo.",
        "code": "Get-AuthenticodeSignature (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object Status",
        "expect": "El estado debe interpretarse junto con la procedencia del archivo."
      },
      {
        "title": "Consultá ayuda de la comprobación oficial",
        "why": "SFC incluye opciones de solo verificación y reparación.",
        "code": "sfc /?",
        "expect": "Se muestra información de la herramienta; no se realiza ninguna reparación."
      }
    ],
    "tip": "Truco: para probar integridad, conservá un inventario previo firmado o respaldado y compará cambios exactos.",
    "warning": "No restaures una imagen ni modifiques archivos de sistema sin diagnóstico y copia de seguridad.",
    "challenge": "Explicá diferencia entre una actualización legítima y una alteración no autorizada."
  },
  {
    "id": 92,
    "goal": "Revisar qué carpetas y recursos compartidos podrían ser visibles para otros equipos.",
    "basics": "Un recurso SMB permite compartir carpetas según usuarios, permisos y firewall. Un recurso compartido configurado no implica que Internet pueda acceder a él ni que todos los usuarios tengan lectura.",
    "steps": [
      {
        "title": "Enumerá recursos compartidos",
        "why": "Get-SmbShare informa recursos configurados; algunos son administrativos y pueden no aparecer por permisos.",
        "code": "Get-SmbShare | Select-Object Name,Path,Description,Special",
        "expect": "Verás compartidos estándar o personalizados."
      },
      {
        "title": "Revisá las reglas de acceso a un recurso",
        "why": "Sustituí EJEMPLO por el nombre de un recurso que administrás.",
        "code": "Get-SmbShareAccess -Name 'EJEMPLO' -ErrorAction SilentlyContinue | Select-Object AccountName,AccessControlType,AccessRight",
        "expect": "Podrías ver permisos o ninguna fila. Nunca ejecutes una consulta sobre recursos ajenos."
      },
      {
        "title": "Observá el perfil del firewall",
        "why": "Los perfiles pueden restringir conexiones entrantes SMB.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction",
        "expect": "El resultado describe reglas generales, no exposición final."
      }
    ],
    "tip": "Truco: permisos NTFS y permisos de recurso compartido intervienen conjuntamente en el acceso.",
    "warning": "No deshabilites todo SMB ni cambies ACL de carpetas compartidas sin identificar usuarios que dependen de ellas.",
    "challenge": "Identificá un compartido propio y explicá la diferencia entre permiso local y permiso de red."
  },
  {
    "id": 93,
    "goal": "Comprender qué sucede durante una infección sin ejecutar malware real.",
    "basics": "Un programa malicioso puede intentar persistencia, acceso a archivos y comunicaciones no autorizadas. Un laboratorio seguro utiliza simulaciones controladas, registros y ejemplos inofensivos para enseñar comportamientos, no muestras activas en la PC principal.",
    "steps": [
      {
        "title": "Identificá tu protección actual",
        "why": "Consultá la disponibilidad del cmdlet de seguridad.",
        "code": "Get-Command Get-MpComputerStatus -ErrorAction SilentlyContinue | Select-Object Name,Source",
        "expect": "Si existe, podrás consultar el estado sin realizar cambios."
      },
      {
        "title": "Observá detecciones registradas en Windows",
        "why": "Revisá eventos de seguridad del sistema, sabiendo que la configuración puede variar.",
        "code": "Get-WinEvent -LogName 'Microsoft-Windows-Windows Defender/Operational' -MaxEvents 10 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,LevelDisplayName",
        "expect": "Podés observar eventos o ninguno. No implica ausencia o presencia de malware."
      },
      {
        "title": "Consultá procesos",
        "why": "Usá los procesos actuales para discutir qué señales deberían verificarse.",
        "code": "Get-Process | Select-Object -First 15 Name,Id,Path",
        "expect": "Algunas rutas pueden ser inaccesibles; eso por sí solo no es una señal de infección."
      }
    ],
    "tip": "Truco: separar una hipótesis de malware de una prueba de funcionamiento evita acusaciones y limpiezas innecesarias.",
    "warning": "No descargues malware, desactives Defender ni ejecutes archivos sospechosos fuera de laboratorios aislados y autorizados.",
    "challenge": "Prepará un mapa de tres fases: ejecución, posible persistencia y verificación defensiva."
  },
  {
    "id": 94,
    "goal": "Entender qué garantiza una firma digital y qué no garantiza.",
    "basics": "La firma de código ayuda a verificar el origen declarado y si el contenido cambió desde su firma según el esquema. Un archivo firmado puede contener vulnerabilidades o comportarse de forma no deseada.",
    "steps": [
      {
        "title": "Consultá una firma auténtica",
        "why": "Elegimos una ruta del sistema y no un archivo descargado.",
        "code": "Get-AuthenticodeSignature (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object Status,SignerCertificate",
        "expect": "La salida depende de las firmas y de la confianza del sistema."
      },
      {
        "title": "Calculá una huella criptográfica",
        "why": "SHA-256 resume los bytes del archivo y permite comparar copias idénticas.",
        "code": "Get-FileHash (Join-Path $env:windir 'System32\\notepad.exe') -Algorithm SHA256 | Select-Object Algorithm,Hash",
        "expect": "Aparece un hash hexadecimal; no informa automáticamente si es malware."
      },
      {
        "title": "Observá atributos del archivo",
        "why": "Metadatos como fechas no sustituyen las pruebas de firma y hash.",
        "code": "Get-Item (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object FullName,Length,LastWriteTime",
        "expect": "La fecha o tamaño, por sí solos, no prueban autoría."
      }
    ],
    "tip": "Truco: compará hashes únicamente con valores provenientes de un canal confiable.",
    "warning": "No uses un sitio de hashes desconocido para subir archivos privados o confidenciales.",
    "challenge": "Explicá la diferencia entre archivo sin firma, firma inválida y firma válida."
  },
  {
    "id": 95,
    "goal": "Aprender a evaluar instaladores y descargas antes de ejecutarlos.",
    "basics": "Una descarga puede llegar por un sitio suplantado o un enlace de phishing. Verificar editor, firma, hash y origen reduce riesgo, pero ninguna de esas pruebas garantiza seguridad absoluta.",
    "steps": [
      {
        "title": "Obtené un hash de ejemplo seguro",
        "why": "Usamos un archivo original de Windows para practicar el concepto.",
        "code": "Get-FileHash (Join-Path $env:windir 'System32\\notepad.exe') -Algorithm SHA256 | Select-Object Algorithm,Hash",
        "expect": "Verás una huella SHA-256 que cambiaría si cambian los bytes."
      },
      {
        "title": "Verificá una firma de ejemplo",
        "why": "La firma digital es otra pieza de evidencia.",
        "code": "Get-AuthenticodeSignature (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object Status,SignerCertificate",
        "expect": "Podría informar estado y certificado firmante."
      },
      {
        "title": "Definí un procedimiento de descarga",
        "why": "Anotá URL oficial, fabricante, versión, suma de comprobación publicada y pasos de instalación antes de aceptar un ejecutable.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber",
        "expect": "La compatibilidad depende también de tu edición de Windows."
      }
    ],
    "tip": "Truco: llegar al fabricante por una URL escrita manualmente reduce el riesgo de anuncios de descarga engañosos.",
    "warning": "No ejecutes un instalador dudoso para ver qué hace ni desactives antivirus para que pueda abrirse.",
    "challenge": "Armá un protocolo de cinco pasos para verificar una descarga antes de instalarla."
  },
  {
    "id": 96,
    "goal": "Comprender qué eventos pueden sugerir autenticaciones anómalas.",
    "basics": "El registro de seguridad contiene eventos sobre inicios de sesión, fallos y otros sucesos cuando sus auditorías están activadas. Una sola falla no demuestra ataque y una lista vacía no garantiza ausencia de incidentes.",
    "steps": [
      {
        "title": "Consultá fallos recientes de inicio",
        "why": "El evento 4625 registra ciertos intentos fallidos y puede incluir datos privados.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4625;StartTime=(Get-Date).AddDays(-2)} -MaxEvents 12 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Puede devolver nada aunque existan otras formas de acceso."
      },
      {
        "title": "Consultá inicios exitosos",
        "why": "El evento 4624 exige analizar detalles como tipo de sesión y cuenta.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4624;StartTime=(Get-Date).AddDays(-2)} -MaxEvents 12 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Un inicio exitoso puede ser de servicio o de usuario."
      },
      {
        "title": "Contrastá con cuentas locales",
        "why": "Inventariá cuentas habilitadas para contextualizar eventos.",
        "code": "Get-LocalUser | Select-Object Name,Enabled,LastLogon",
        "expect": "La fecha no describe todas las autenticaciones."
      }
    ],
    "tip": "Truco: la hora y el tipo de inicio de sesión son fundamentales para correlacionar actividad sospechosa.",
    "warning": "No borres registros de seguridad ni compartas eventos completos con datos personales.",
    "challenge": "Explicá qué información adicional investigarías ante una secuencia de varios fallos seguidos."
  },
  {
    "id": 97,
    "goal": "Entender por qué algunos componentes maliciosos son difíciles de observar.",
    "basics": "Un rootkit intenta ocultar actividad o alterar la confianza en el sistema. Las herramientas que corren dentro de un sistema comprometido pueden no ser suficientes para demostrar que está limpio.",
    "steps": [
      {
        "title": "Consultá la configuración de arranque seguro",
        "why": "Confirm-SecureBootUEFI es de lectura y puede fallar en sistemas heredados.",
        "code": "Confirm-SecureBootUEFI",
        "expect": "True/False si se admite; un error puede indicar firmware incompatible con la consulta."
      },
      {
        "title": "Consultá Windows y firmware",
        "why": "Datos de versión ayudan a evaluar soporte y actualizaciones.",
        "code": "Get-CimInstance Win32_BIOS | Select-Object Manufacturer,SMBIOSBIOSVersion,ReleaseDate",
        "expect": "La versión no indica por sí sola una infección."
      },
      {
        "title": "Comprobá controles de seguridad",
        "why": "Verificá cmdlets disponibles, sin desactivar protección.",
        "code": "Get-Command Get-MpComputerStatus -ErrorAction SilentlyContinue | Select-Object Name,Source",
        "expect": "La disponibilidad del comando no certifica que el equipo esté limpio."
      }
    ],
    "tip": "Truco: cuando se pierde confianza en la instalación, un análisis desde un entorno confiable puede ser más útil que ejecutar decenas de comandos internos.",
    "warning": "No pruebes rootkits reales ni instales supuestos 'detectores' de procedencia desconocida.",
    "challenge": "Explicá qué diferencia existe entre ausencia de alertas y evidencia positiva de integridad."
  },
  {
    "id": 98,
    "goal": "Reconstruir una cronología de hechos relevantes sin alterar registros.",
    "basics": "La investigación forense empieza relacionando timestamps de inicio, instalación, actividad y fallos. Las marcas horarias pueden diferir de zona y precisión; por eso necesitás conocer la fuente.",
    "steps": [
      {
        "title": "Determiná la referencia temporal",
        "why": "Anotá la fecha del sistema y la zona horaria configurada.",
        "code": "Get-Date; Get-TimeZone | Select-Object Id,BaseUtcOffset",
        "expect": "La salida permite contextualizar eventos locales."
      },
      {
        "title": "Leé eventos de sistema",
        "why": "Tomá una muestra ordenada cronológicamente.",
        "code": "Get-WinEvent -LogName System -MaxEvents 15 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Los eventos describen operaciones del sistema, no necesariamente acciones de una persona."
      },
      {
        "title": "Leé eventos de aplicación",
        "why": "Una segunda fuente permite cotejar sucesos de la misma hora.",
        "code": "Get-WinEvent -LogName Application -MaxEvents 15 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Podés relacionar hechos temporalmente sin asumir causalidad automática."
      }
    ],
    "tip": "Truco: en una investigación conservá la salida original antes de interpretarla y no mezcles horas UTC con locales.",
    "warning": "No borres registros ni cambies la fecha del equipo para hacer coincidir resultados.",
    "challenge": "Armá una cronología de cinco eventos, marcando qué conclusiones son comprobables y cuáles hipótesis."
  },
  {
    "id": 99,
    "goal": "Evaluar si el firewall permite lo que creés sin desproteger la PC.",
    "basics": "Windows Firewall combina perfiles, reglas específicas y políticas predeterminadas. Una regla aparentemente permisiva puede estar condicionada por interfaz, aplicación o protocolo.",
    "steps": [
      {
        "title": "Consultá los perfiles",
        "why": "Revisá estado y política predeterminada de entrada y salida.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction",
        "expect": "Verás perfiles de dominio, público o privado según versión."
      },
      {
        "title": "Consultá algunas reglas activas",
        "why": "Filtrá reglas habilitadas sin modificarlas.",
        "code": "Get-NetFirewallRule -Enabled True | Select-Object -First 20 DisplayName,Direction,Action,Profile",
        "expect": "Una regla visible no indica que el programa relacionado esté escuchando."
      },
      {
        "title": "Relacioná servicios en escucha",
        "why": "Observá los puertos del equipo como otra dimensión.",
        "code": "Get-NetTCPConnection -State Listen | Select-Object -First 20 LocalAddress,LocalPort,OwningProcess",
        "expect": "Para evaluar exposición pública todavía necesitás router y pruebas autorizadas."
      }
    ],
    "tip": "Truco: la política general y la regla del programa deben analizarse juntas, no de manera aislada.",
    "warning": "No apagues el firewall para probar conectividad salvo un procedimiento profesional controlado con restauración inmediata.",
    "challenge": "Explicá por qué un puerto abierto en localhost no equivale a un servicio accesible desde Internet."
  },
  {
    "id": 100,
    "goal": "Realizar una auditoría básica de seguridad con evidencias de la computadora propia.",
    "basics": "Un diagnóstico responsable separa sistema, cuentas, seguridad, exposición y persistencia. Estas 25 comprobaciones constituyen un itinerario de investigación, no una certificación de invulnerabilidad.",
    "steps": [
      {
        "title": "Identificá la instalación y sus cuentas",
        "why": "Comenzá por edición de Windows y cuentas locales visibles.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber; Get-LocalUser | Select-Object Name,Enabled",
        "expect": "Tendrás una línea base de plataforma y usuarios para revisar."
      },
      {
        "title": "Consultá defensa y superficie de red",
        "why": "Documentá perfiles de firewall y listeners sin cambiar reglas.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction; Get-NetTCPConnection -State Listen | Select-Object -First 15 LocalAddress,LocalPort,OwningProcess",
        "expect": "El resultado es parcial: necesitarás evaluar aplicaciones, red y autorización."
      },
      {
        "title": "Registrá persistencia y eventos",
        "why": "Tareas y logs permiten ampliar un diagnóstico inicial.",
        "code": "Get-ScheduledTask | Select-Object -First 15 TaskName,State; Get-WinEvent -LogName System -MaxEvents 10 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Las tareas y eventos requieren interpretación contextual."
      }
    ],
    "tip": "Truco EVO: trabajá con una lista de comprobación fechada, evidencia original y conclusiones clasificadas en VERIFICADO, HIPÓTESIS y SIN EVIDENCIA.",
    "warning": "No ejecutes escáneres intrusivos en redes de terceros ni toques servicios críticos para conseguir una puntuación perfecta.",
    "challenge": "Elaborá tu expediente con estas 25 casillas: (1) edición y build, (2) actualizaciones, (3) antimalware, (4) firewall, (5) Secure Boot, (6) TPM, (7) usuarios habilitados, (8) grupos privilegiados, (9) inicios recientes, (10) fallos de acceso, (11) procesos activos, (12) rutas de ejecutables, (13) firmas, (14) servicios automáticos, (15) tareas programadas, (16) aplicaciones de inicio, (17) puertos locales, (18) sesiones remotas, (19) recursos SMB, (20) DNS, (21) permisos de micrófono, (22) permisos de cámara, (23) telemetría opcional, (24) copias de seguridad y (25) plan de recuperación. Marcá cada casilla como verificada, pendiente o no aplicable."
  }
];
