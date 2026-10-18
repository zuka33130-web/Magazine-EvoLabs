import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';

/**
 * EVO LABS — Mag Estrella · Entrega B · Investigaciones 021–040.
 * Laboratorios de consulta, con evidencia, advertencias y desafío.
 * No se ejecutan automáticamente ni modifican configuraciones críticas.
 */
export const EVO_MAGAZINE_SECOND_BATCH: EvoMagazineArticle[] = [
  {
    "id": 21,
    "goal": "Descubrir cómo NTFS controla quién puede leer y modificar archivos.",
    "basics": "NTFS es el sistema de archivos que administra datos y permisos. Un atributo 'oculto' no es una protección de acceso; una lista ACL sí contiene reglas de autorización.",
    "steps": [
      {
        "title": "Localizá tu carpeta personal",
        "why": "Consultá la ruta de tu perfil sin cambiar nada.",
        "code": "$HOME",
        "expect": "Aparece la ruta de usuario actual."
      },
      {
        "title": "Leé su propietario y permisos",
        "why": "Get-Acl obtiene la lista de control de acceso; el formato puede mostrar varios usuarios o grupos.",
        "code": "Get-Acl -LiteralPath $HOME | Select-Object Owner,AccessToString",
        "expect": "Podés ver el propietario y permisos legibles."
      },
      {
        "title": "Compará con atributos",
        "why": "Los atributos son metadatos distintos de los permisos.",
        "code": "Get-Item -LiteralPath $HOME -Force | Select-Object FullName,Attributes",
        "expect": "Verás atributos como Directory u otros."
      }
    ],
    "tip": "Truco: diferenciar ACL de atributos evita interpretar 'oculto' como 'cifrado'.",
    "warning": "No cambies ACL del perfil, carpetas de Windows ni la propiedad de archivos para probar.",
    "challenge": "Explicá qué significa lectura, escritura y propietario usando un archivo tuyo."
  },
  {
    "id": 22,
    "goal": "Separar archivos temporales eliminables de cachés útiles.",
    "basics": "TEMP es una ubicación de trabajo temporal. Algunos archivos pueden estar en uso; otros permiten acelerar aplicaciones. Eliminarlo todo no garantiza que Windows sea más rápido.",
    "steps": [
      {
        "title": "Buscá TEMP",
        "why": "Consultá su ruta para tu usuario.",
        "code": "$env:TEMP",
        "expect": "Podés obtener una ruta que termina en AppData\\Local\\Temp."
      },
      {
        "title": "Contá archivos sin borrarlos",
        "why": "Enumerá archivos del primer nivel y medí su tamaño conjunto.",
        "code": "Get-ChildItem -LiteralPath $env:TEMP -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum",
        "expect": "La suma se expresa en bytes y no incluye subcarpetas."
      },
      {
        "title": "Revisá el almacenamiento con Windows",
        "why": "Abrí Configuración > Sistema > Almacenamiento.",
        "code": "Start-Process 'ms-settings:storagesense'",
        "expect": "La interfaz muestra categorías que conviene revisar antes de limpiar."
      }
    ],
    "tip": "Medí espacio libre antes y después de una limpieza autorizada; anotá categorías seleccionadas.",
    "warning": "No borres archivos de sistema ni temporales en uso con scripts agresivos.",
    "challenge": "Proponé dos ejemplos de caché útil y un archivo temporal que sea prescindible."
  },
  {
    "id": 23,
    "goal": "Comprender por qué WinSxS parece inmenso y cómo medirlo correctamente.",
    "basics": "WinSxS forma parte del almacén de componentes. Parte del contenido comparte archivos mediante enlaces rígidos; el tamaño que muestra Explorer puede exagerar su ocupación exclusiva.",
    "steps": [
      {
        "title": "Identificá el almacén",
        "why": "Comprobá que exista en la carpeta del sistema.",
        "code": "Test-Path (Join-Path $env:windir 'WinSxS')",
        "expect": "Lo habitual es True."
      },
      {
        "title": "Leé documentación incorporada",
        "why": "DISM incluye herramientas oficiales para administrar componentes.",
        "code": "dism.exe /?",
        "expect": "Se abre la ayuda de DISM. No se modifica nada."
      },
      {
        "title": "Analizá, sin limpiar",
        "why": "El parámetro AnalyzeComponentStore consulta el almacén y normalmente necesita PowerShell elevado.",
        "code": "DISM.exe /Online /Cleanup-Image /AnalyzeComponentStore",
        "expect": "Puede pedir privilegios; el informe distingue tamaños y recomienda si hay limpieza pendiente."
      }
    ],
    "tip": "Usá el informe de DISM, no la cifra aparente de Explorer, para evaluar el almacén.",
    "warning": "Nunca borres carpetas de WinSxS a mano. No uses /ResetBase como rutina de mantenimiento.",
    "challenge": "Explicá por qué enlaces rígidos pueden inflar un cálculo ingenuo de tamaño."
  },
  {
    "id": 24,
    "goal": "Entender cómo se comprueba la integridad de Windows antes de repararlo.",
    "basics": "SFC comprueba archivos protegidos; DISM verifica y administra la imagen de Windows. Son herramientas distintas y una reparación no siempre implica mejor rendimiento.",
    "steps": [
      {
        "title": "Consultá la ayuda de SFC",
        "why": "Descubrí comandos de verificación y reparación.",
        "code": "sfc /?",
        "expect": "Aparecen opciones como verifyonly y scannow."
      },
      {
        "title": "Verificá sin reparar",
        "why": "SFC /verifyonly comprueba integridad y normalmente requiere consola como administrador.",
        "code": "sfc /verifyonly",
        "expect": "Puede terminar con un informe o denegar la operación por permisos."
      },
      {
        "title": "Comprobá el estado registrado por DISM",
        "why": "CheckHealth consulta indicadores de daños previamente registrados y suele requerir elevación.",
        "code": "DISM.exe /Online /Cleanup-Image /CheckHealth",
        "expect": "Aparecerá un estado o aviso de privilegios insuficientes."
      }
    ],
    "tip": "Guardá mensajes finales y códigos de salida antes de decidir si hace falta una reparación.",
    "warning": "No ejecutes /RestoreHealth a ciegas ni borres archivos protegidos cuando haya fallas.",
    "challenge": "Explicá diferencia entre comprobar y reparar y cuándo conviene realizar cada acción."
  },
  {
    "id": 25,
    "goal": "Leer errores reales del sistema sin entrar en pánico por los avisos amarillos.",
    "basics": "Windows registra eventos informativos, advertencias y errores. Un error aislado puede ser recuperable y no explicar un fallo actual; hacen falta fecha, origen y correlación.",
    "steps": [
      {
        "title": "Abrí Visor de eventos",
        "why": "Encontrá Registros de Windows > Sistema.",
        "code": "Start-Process eventvwr.msc",
        "expect": "Se abre la consola de eventos."
      },
      {
        "title": "Consultá los eventos recientes",
        "why": "Get-WinEvent lee el registro Sistema; puede mostrar permisos restringidos en equipos administrados.",
        "code": "Get-WinEvent -LogName System -MaxEvents 15 | Select-Object TimeCreated,Id,LevelDisplayName,ProviderName",
        "expect": "Verás fecha, identificador, nivel y origen."
      },
      {
        "title": "Filtrá errores de un periodo corto",
        "why": "Limitá el análisis a la última jornada; no supone que sean graves.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='System';Level=2;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 10 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Puede devolver varias filas o ninguna."
      }
    ],
    "tip": "Buscá secuencias coincidentes en el tiempo, no solo el número de errores.",
    "warning": "No borres registros de eventos para 'limpiar' Windows: perderías evidencia útil.",
    "challenge": "Elegí un evento y anotá fecha, ID, origen y qué otro dato necesitarías para asociarlo a una falla."
  },
  {
    "id": 26,
    "goal": "Reconstruir cuándo empezaron las fallas de una aplicación o de Windows.",
    "basics": "El Monitor de confiabilidad organiza cierres inesperados, instalaciones y errores por día. Su línea temporal ayuda a descubrir cambios previos a un problema.",
    "steps": [
      {
        "title": "Abrí el historial de confiabilidad",
        "why": "El comando inicia una herramienta integrada.",
        "code": "perfmon.exe /rel",
        "expect": "Si está disponible, verás una línea temporal de estabilidad."
      },
      {
        "title": "Elegí un día con eventos",
        "why": "Revisá detalles de una falla o instalación.",
        "expect": "Anotá programa, fecha y texto del problema sin divulgar información sensible."
      },
      {
        "title": "Correlacioná eventos de sistema",
        "why": "Consultá los últimos eventos para el mismo intervalo.",
        "code": "Get-WinEvent -LogName System -MaxEvents 10 | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Compará horas y fuentes, no asumas causalidad."
      }
    ],
    "tip": "Investigar el primer día de una falla suele ser más útil que contar todos los eventos.",
    "warning": "No desinstales drivers solamente porque aparecieron cerca de un error sin más pruebas.",
    "challenge": "Describí cómo distinguirías correlación temporal de una causa comprobada."
  },
  {
    "id": 27,
    "goal": "Comprender los pantallazos azules y cómo conservar evidencia.",
    "basics": "Una pantalla azul significa que Windows detectó una condición crítica y se detuvo. El código y, si existe, un volcado de memoria pueden ayudar a investigar.",
    "steps": [
      {
        "title": "Revisá configuración de recuperación",
        "why": "CIM expone algunas opciones del sistema.",
        "code": "Get-CimInstance Win32_OSRecoveryConfiguration | Select-Object AutoReboot,DebugInfoType,MiniDumpDirectory",
        "expect": "Pueden mostrarse valores o ninguna fila según la versión."
      },
      {
        "title": "Comprobá si hay minidumps",
        "why": "Solo enumerá nombres de archivos, sin abrirlos.",
        "code": "Get-ChildItem (Join-Path $env:windir 'Minidump') -File -ErrorAction SilentlyContinue | Select-Object -First 10 Name,LastWriteTime",
        "expect": "Podés encontrar archivos .dmp o nada."
      },
      {
        "title": "Revisá historial de errores",
        "why": "Buscá en Monitor de confiabilidad eventos coincidentes.",
        "code": "perfmon.exe /rel",
        "expect": "La vista permite correlacionar reinicios y cierres inesperados."
      }
    ],
    "tip": "Un solo nombre de driver mencionado por un BSOD no confirma por sí mismo que ese driver sea la causa.",
    "warning": "No desactives protecciones ni provoques un fallo del kernel para generar un volcado en la PC principal.",
    "challenge": "Explicá qué evidencias conservarías antes de reinstalar Windows tras un BSOD."
  },
  {
    "id": 28,
    "goal": "Diferenciar capacidad, modelo, estado y salud real del SSD.",
    "basics": "Windows puede detectar discos y algunos indicadores de estado. Una etiqueta 'Healthy' no reemplaza la información detallada del fabricante ni un respaldo.",
    "steps": [
      {
        "title": "Inventariá unidades físicas",
        "why": "Consultá modelo y tamaño reportado por Windows.",
        "code": "Get-CimInstance Win32_DiskDrive | Select-Object Model,MediaType,Size,Status",
        "expect": "Aparecen modelos y tamaños en bytes; MediaType puede ser genérico."
      },
      {
        "title": "Consultá el subsistema de almacenamiento",
        "why": "Get-PhysicalDisk expone datos si el controlador los publica.",
        "code": "Get-PhysicalDisk | Select-Object FriendlyName,MediaType,HealthStatus,Size",
        "expect": "El estado puede no reflejar todos los contadores SMART."
      },
      {
        "title": "Revisá espacio libre",
        "why": "Get-Volume enumera volúmenes accesibles.",
        "code": "Get-Volume | Select-Object DriveLetter,FileSystem,SizeRemaining,Size",
        "expect": "No todos los discos tienen letra ni volumen montado."
      }
    ],
    "tip": "La salud aparente no equivale a garantía: mantené copias de seguridad verificadas.",
    "warning": "No uses 'limpiadores de SSD', desfragmentación forzada ni operaciones de particionado durante una auditoría.",
    "challenge": "Explicá por qué un SSD que informa Healthy todavía necesita respaldo."
  },
  {
    "id": 29,
    "goal": "Comprender TRIM, volúmenes y alineación sin aplicar recetas anticuadas.",
    "basics": "TRIM permite al sistema informar qué bloques ya no contienen datos válidos; su efecto real depende de controlador, sistema de archivos y dispositivo.",
    "steps": [
      {
        "title": "Verificá la política TRIM",
        "why": "La herramienta fsutil consulta la configuración; no realiza limpieza.",
        "code": "fsutil behavior query DisableDeleteNotify",
        "expect": "Un 0 suele indicar que las notificaciones no están deshabilitadas; no confirma soporte efectivo del SSD."
      },
      {
        "title": "Identificá tus volúmenes",
        "why": "Consultá letras y sistemas de archivos.",
        "code": "Get-Volume | Select-Object DriveLetter,FileSystem,DriveType",
        "expect": "Aparecen volúmenes; no todos son internos."
      },
      {
        "title": "Aprendé qué hace el optimizador",
        "why": "Abrí la interfaz de optimización de unidades.",
        "code": "Start-Process dfrgui.exe",
        "expect": "Podrás ver unidades y su programación sin ejecutar una optimización."
      }
    ],
    "tip": "Nunca deduzcas desgaste real de un SSD solamente por una clave de TRIM.",
    "warning": "No cambies particiones ni ejecutes 'clean' o formateo durante este capítulo.",
    "challenge": "Explicá por qué TRIM no es lo mismo que borrar físicamente todos los datos."
  },
  {
    "id": 30,
    "goal": "Descubrir qué información de firmware expone Windows.",
    "basics": "UEFI o BIOS inicializa el hardware y prepara la carga del sistema. El firmware es distinto de Windows y sus actualizaciones requieren compatibilidad exacta.",
    "steps": [
      {
        "title": "Consultá fabricante y versión",
        "why": "Win32_BIOS informa la versión conocida por el sistema.",
        "code": "Get-CimInstance Win32_BIOS | Select-Object Manufacturer,SMBIOSBIOSVersion,ReleaseDate",
        "expect": "Podés observar versión y fecha del firmware."
      },
      {
        "title": "Identificá placa y equipo",
        "why": "La identificación ayuda a ubicar documentación compatible.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model",
        "expect": "Aparecen fabricante y modelo del sistema."
      },
      {
        "title": "Contrastá sin modificar",
        "why": "Guardá la versión y comparala con el soporte oficial de tu fabricante.",
        "expect": "No actualices nada por encontrar una versión con número mayor."
      }
    ],
    "tip": "Una actualización de BIOS solo tiene sentido si corrige un problema, añade compatibilidad necesaria o responde a un aviso de seguridad aplicable.",
    "warning": "No flashees firmware desde una guía genérica. Un archivo incorrecto puede inutilizar el equipo.",
    "challenge": "Explicá por qué dos equipos con CPU igual pueden necesitar BIOS diferentes."
  },
  {
    "id": 31,
    "goal": "Entender TPM y Secure Boot sin confundirlos con antivirus.",
    "basics": "TPM puede proteger claves criptográficas; Secure Boot verifica firmas de componentes de arranque. No sustituyen seguridad de aplicaciones ni buenas contraseñas.",
    "steps": [
      {
        "title": "Consultá TPM",
        "why": "Get-Tpm ofrece datos en equipos Windows compatibles.",
        "code": "Get-Tpm | Select-Object TpmPresent,TpmReady,TpmEnabled",
        "expect": "Aparecen estados o un mensaje si la herramienta no está disponible."
      },
      {
        "title": "Consultá arranque seguro",
        "why": "Este comando no modifica firmware; puede devolver error en BIOS heredado o ciertos equipos.",
        "code": "Confirm-SecureBootUEFI",
        "expect": "True/False si está soportado, o una excepción según el equipo."
      },
      {
        "title": "Documentá el resultado",
        "why": "Anotá el tipo de arranque y la condición de TPM antes de planificar cualquier cambio.",
        "expect": "Una lectura es el inicio de la auditoría, no un diagnóstico completo de seguridad."
      }
    ],
    "tip": "Antes de tocar TPM o UEFI, verificá que tenés tus claves de recuperación de cifrado y un respaldo.",
    "warning": "Nunca borres o restablezcas el TPM para experimentar: podrías perder acceso a datos cifrados.",
    "challenge": "Explicá qué protege Secure Boot y qué no puede impedir."
  },
  {
    "id": 32,
    "goal": "Reconocer los componentes que participan en el inicio de Windows.",
    "basics": "El almacén BCD contiene opciones de arranque. Ver sus entradas no es lo mismo que modificarlas; cambios mal hechos pueden dejar el sistema sin iniciar.",
    "steps": [
      {
        "title": "Aprendé qué es Boot Manager",
        "why": "Primero distinguí firmware, gestor de arranque y cargador del sistema.",
        "expect": "Windows puede usar particiones EFI y configuraciones diferentes según instalación."
      },
      {
        "title": "Consultá entradas BCD",
        "why": "bcdedit sin parámetros de modificación muestra configuración. Puede requerir permisos elevados.",
        "code": "bcdedit /enum",
        "expect": "Vas a obtener identificadores, rutas y parámetros o un error de acceso."
      },
      {
        "title": "Consultá el tiempo activo",
        "why": "Sirve para distinguir la hora del último inicio de una velocidad medida.",
        "code": "(Get-CimInstance Win32_OperatingSystem).LastBootUpTime",
        "expect": "Una fecha no indica cuánto tardó en mostrarse el escritorio."
      }
    ],
    "tip": "Guardá la salida de bcdedit antes de cualquier intervención profesional, junto con un plan de recuperación.",
    "warning": "No uses bcdedit /set, /delete o /import en tu PC principal solo para experimentar.",
    "challenge": "Explicá por qué un inicio de 2 segundos necesita una definición clara de inicio y fin."
  },
  {
    "id": 33,
    "goal": "Distinguir apagado híbrido, hibernación, suspensión y reinicio.",
    "basics": "Inicio rápido reutiliza información del kernel en ciertos apagados. Por eso una cifra desde el botón de encendido puede ser incomparable con un reinicio completo.",
    "steps": [
      {
        "title": "Leé si Inicio rápido está configurado",
        "why": "La clave es de solo lectura; en algunos sistemas no existe.",
        "code": "Get-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power' -Name HiberbootEnabled -ErrorAction SilentlyContinue | Select-Object HiberbootEnabled",
        "expect": "1 suele corresponder a habilitado; también intervienen condiciones del equipo."
      },
      {
        "title": "Consultá estados de suspensión admitidos",
        "why": "powercfg /a enumera estados disponibles y razones por las que otros no lo están.",
        "code": "powercfg /a",
        "expect": "Verás S0, S3, hibernación u otros según el hardware."
      },
      {
        "title": "Documentá método de prueba",
        "why": "Anotá si apagaste, reiniciaste o suspendiste y cómo tomaste tiempo.",
        "expect": "Tiempos de procedimientos distintos no son directamente comparables."
      }
    ],
    "tip": "Para comparar mejoras de inicio, medí igual desde el mismo estado del equipo y repetí varias veces.",
    "warning": "No deshabilites hibernación sin evaluar su impacto en movilidad, consumo y recuperación.",
    "challenge": "Definí un protocolo correcto para comprobar una afirmación de 'inicio en 2 segundos'."
  },
  {
    "id": 34,
    "goal": "Comprender la latencia de interrupciones que puede producir microcortes.",
    "basics": "Una interrupción avisa al procesador de un evento; las DPC difieren trabajo para atenderlo después. Picos prolongados pueden producir problemas de audio o video, pero requieren correlación.",
    "steps": [
      {
        "title": "Observá el problema con hora",
        "why": "Si experimentás microcortes, anotá momento, aplicación y periféricos conectados.",
        "expect": "Una lista temporal ayuda a asociar síntomas y actividad."
      },
      {
        "title": "Consultá contadores de CPU",
        "why": "La clase CIM puede exponer tiempo dedicado a interrupciones y DPC, según Windows.",
        "code": "Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor | Where-Object {$_.Name -eq '_Total'} | Select-Object PercentDPCTime,PercentInterruptTime",
        "expect": "Puede aparecer una lectura agregada, sin identificar todavía el controlador culpable."
      },
      {
        "title": "Compará con una reproducción",
        "why": "Abrí el Monitor de recursos mientras reproducís un audio de prueba.",
        "code": "Start-Process resmon.exe",
        "expect": "El monitor sirve para observar procesos, pero no reemplaza una medición de latencias de controladores."
      }
    ],
    "tip": "No confíes en un solo valor máximo de DPC aislado: revisá repetición del síntoma y contexto de energía/controladores.",
    "warning": "No cambies controladores, afinidad ni temporizadores sin una línea base y plan de reversión.",
    "challenge": "Explicá por qué un microcorte de audio no demuestra que la tarjeta de sonido esté rota."
  },
  {
    "id": 35,
    "goal": "Investigar el comportamiento del mouse sin cambiar sensibilidades a ciegas.",
    "basics": "DPI describe resolución del sensor; polling rate indica reportes por segundo; ambos son distintos de la latencia de presentación del juego.",
    "steps": [
      {
        "title": "Identificá dispositivos apuntadores",
        "why": "CIM muestra hardware de entrada reconocido.",
        "code": "Get-CimInstance Win32_PointingDevice | Select-Object Name,DeviceID,NumberOfButtons",
        "expect": "El sistema puede reportar varios dispositivos lógicos."
      },
      {
        "title": "Consultá parámetros del usuario",
        "why": "Las opciones de ratón incluyen velocidad y aceleración; no reflejan necesariamente el DPI físico.",
        "code": "Get-ItemProperty 'HKCU:\\Control Panel\\Mouse' | Select-Object MouseSensitivity,MouseSpeed,MouseThreshold1,MouseThreshold2",
        "expect": "Aparecen valores de configuración o propiedades vacías."
      },
      {
        "title": "Comprobá la respuesta real",
        "why": "Probá desplazamientos consistentes dentro de una aplicación y anotá ajustes, sin cambiar varios a la vez.",
        "expect": "La percepción de velocidad no mide directamente el tiempo de respuesta extremo a extremo."
      }
    ],
    "tip": "Probá una modificación por vez y mantené un registro: la memoria muscular necesita condiciones repetibles.",
    "warning": "No apliques ajustes de sensibilidad, registros de mouse o controladores descargados de procedencia dudosa.",
    "challenge": "Diferenciá DPI, sensibilidad de Windows y polling rate con un ejemplo."
  },
  {
    "id": 36,
    "goal": "Descubrir controladores USB y posibles causas de desconexiones.",
    "basics": "Un puerto USB depende de controlador, alimentación, cable, dispositivo y drivers. Fallas intermitentes pueden venir de varios puntos.",
    "steps": [
      {
        "title": "Listá controladoras USB",
        "why": "Consultá hardware reconocido.",
        "code": "Get-CimInstance Win32_USBController | Select-Object Name,Status,DeviceID",
        "expect": "Aparecen controladoras o ninguna si el proveedor limita datos."
      },
      {
        "title": "Revisá concentradores",
        "why": "Mostrá dispositivos hub y estado.",
        "code": "Get-CimInstance Win32_USBHub | Select-Object Name,Status,DeviceID",
        "expect": "Podés ver varios hubs, incluidos concentradores raíz."
      },
      {
        "title": "Observá una desconexión",
        "why": "Abrí Administrador de dispositivos y comprobá cambios al conectar un periférico no crítico.",
        "code": "Start-Process devmgmt.msc",
        "expect": "La consola mostrará la topología de dispositivos reconocidos."
      }
    ],
    "tip": "Antes de culpar a Windows, probá otro cable, puerto y alimentación siguiendo el manual del equipo.",
    "warning": "No deshabilites controladoras USB si tu teclado o mouse depende exclusivamente de ellas.",
    "challenge": "Planteá un procedimiento para diferenciar problema de cable, energía y controlador."
  },
  {
    "id": 37,
    "goal": "Interpretar opciones de red avanzadas sin confiar en recetas de gaming.",
    "basics": "Offloads, moderación de interrupciones y buffers ayudan a distribuir trabajo entre CPU y adaptador. Su efecto depende del tráfico, driver y hardware.",
    "steps": [
      {
        "title": "Inventariá tus adaptadores",
        "why": "Listá interfaces y velocidades de enlace reportadas.",
        "code": "Get-NetAdapter | Select-Object Name,Status,LinkSpeed,InterfaceDescription",
        "expect": "LinkSpeed indica negociación local, no velocidad contratada de Internet."
      },
      {
        "title": "Revisá propiedades avanzadas",
        "why": "Consultar no aplica cambios. Algunas propiedades dependen del fabricante.",
        "code": "Get-NetAdapterAdvancedProperty -Name '*' -ErrorAction SilentlyContinue | Select-Object -First 20 Name,DisplayName,DisplayValue",
        "expect": "Verás parámetros disponibles; puede haber ninguno."
      },
      {
        "title": "Medí una línea base",
        "why": "Registrá latencia y pérdida antes de cambiar configuración.",
        "code": "Test-Connection 1.1.1.1 -Count 5 | Select-Object Address,ResponseTime,Status",
        "expect": "Puede fallar por ICMP bloqueado; no implica necesariamente que Internet esté caído."
      }
    ],
    "tip": "Un ajuste que mejora un juego pero introduce pérdida o cortes de audio no es una optimización neta.",
    "warning": "No desactives propiedades de red ni actualices drivers sin poder restaurarlos.",
    "challenge": "Explicá por qué una negociación a 1 Gbps no garantiza una descarga de 1 Gbps."
  },
  {
    "id": 38,
    "goal": "Comprender qué hace DNS y cómo detectar un problema de resolución.",
    "basics": "DNS transforma nombres en direcciones, a menudo utilizando cachés. Un servidor DNS rápido no incrementa automáticamente el ancho de banda de tu enlace.",
    "steps": [
      {
        "title": "Consultá servidores DNS configurados",
        "why": "Mostrá direcciones IPv4 de tus interfaces.",
        "code": "Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object InterfaceAlias,ServerAddresses",
        "expect": "Podés encontrar varios adaptadores; algunos no están conectados."
      },
      {
        "title": "Resolvé un dominio de prueba",
        "why": "La consulta puede usar los resolutores configurados.",
        "code": "Resolve-DnsName example.com | Select-Object -First 5 Name,Type,IPAddress",
        "expect": "Podés obtener A, AAAA u otros registros."
      },
      {
        "title": "Observá caché DNS",
        "why": "Consultá entradas recientes que Windows haya almacenado.",
        "code": "Get-DnsClientCache | Select-Object -First 10 Entry,RecordType,Data",
        "expect": "Puede aparecer vacía o variar según uso."
      }
    ],
    "tip": "Para diagnosticar DNS, distinguí resolución de nombres de conectividad IP real.",
    "warning": "No cambies DNS solo porque un video afirma que se duplican los FPS.",
    "challenge": "Explicá por qué un dominio puede resolver bien aun cuando una página web no cargue."
  },
  {
    "id": 39,
    "goal": "Ver cómo TCP mantiene conexiones y recupera información perdida.",
    "basics": "TCP establece sesiones, retransmite datos perdidos y controla flujo/congestión. Un ping estable no garantiza que una descarga o juego tengan la misma experiencia.",
    "steps": [
      {
        "title": "Listá sesiones establecidas",
        "why": "Get-NetTCPConnection muestra conexiones actuales.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 15 LocalAddress,LocalPort,RemoteAddress,RemotePort",
        "expect": "Algunas filas cambian entre lecturas por sesiones cortas."
      },
      {
        "title": "Leé estadísticas TCP",
        "why": "netstat -s -p tcp consulta estadísticas acumuladas del protocolo.",
        "code": "netstat -s -p tcp",
        "expect": "La salida puede estar localizada; retransmisiones no prueban por sí solas una falla presente."
      },
      {
        "title": "Registrá latencia ICMP",
        "why": "Cinco respuestas permiten una primera observación, no una prueba completa de calidad.",
        "code": "Test-Connection 1.1.1.1 -Count 5",
        "expect": "Si ICMP está bloqueado pueden fallar pruebas incluso con TCP funcional."
      }
    ],
    "tip": "Contá pérdidas, retransmisiones y variación temporal con una ventana definida para evitar conclusiones por un solo pico.",
    "warning": "No modifiques parámetros globales TCP con comandos virales sin hipótesis y mediciones reversibles.",
    "challenge": "Explicá por qué una retransmisión puede ser normal ocasionalmente y preocupante si es sostenida."
  },
  {
    "id": 40,
    "goal": "Comprender el firewall y las diferencias entre entrada, salida y perfiles.",
    "basics": "El firewall aplica reglas según dirección, programa, servicio, puerto, red y perfil. Tener una regla de permiso no garantiza por sí mismo acceso desde Internet.",
    "steps": [
      {
        "title": "Consultá perfiles",
        "why": "Las reglas dependen de Dominio, Privado o Público.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction",
        "expect": "Aparecen estados y acciones predeterminadas."
      },
      {
        "title": "Listá algunas reglas entrantes activas",
        "why": "La consulta no modifica política.",
        "code": "Get-NetFirewallRule -Enabled True -Direction Inbound | Select-Object -First 15 DisplayName,Action,Profile",
        "expect": "Verás reglas de permitir o bloquear según la instalación."
      },
      {
        "title": "Revisá la interfaz avanzada",
        "why": "El administrador permite inspeccionar condiciones detalladas.",
        "code": "Start-Process wf.msc",
        "expect": "Se abre Firewall de Windows con seguridad avanzada, si está disponible."
      }
    ],
    "tip": "Para evaluar exposición de red correlacioná reglas con proceso, puerto, interfaz, router y una prueba desde otro equipo autorizado.",
    "warning": "No apagues el firewall como método de 'optimización de ping'.",
    "challenge": "Elegí una regla de entrada y explicá qué datos faltan para saber si realmente permite conexiones externas."
  }
];
