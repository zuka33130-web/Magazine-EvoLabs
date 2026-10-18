import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Magazine Estrella · Privacidad I: investigaciones 053, 055–064. Preguntas virales, conclusiones basadas en evidencia. */
export const EVO_MAGAZINE_PRIVACY_A: EvoMagazineArticle[] = [
  {
    "id": 53,
    "goal": "Identificar comunicaciones automáticas de Windows sin confundirlas con espionaje.",
    "basics": "Incluso sin ventanas abiertas, Windows puede consultar hora, certificados, licencias, actualizaciones y servicios en línea. Cada conexión tiene un proceso propietario, pero una IP por sí sola no indica finalidad ni contenido.",
    "steps": [
      {
        "title": "Enumerá las sesiones actuales",
        "why": "Get-NetTCPConnection consulta conexiones TCP establecidas sin alterar nada.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 20 LocalAddress,RemoteAddress,RemotePort,OwningProcess",
        "expect": "Obtendrás una foto temporal de las conexiones, que pueden cambiar mientras se muestran."
      },
      {
        "title": "Relacioná un PID con un programa",
        "why": "Elegí uno de los identificadores anteriores y reemplazá 1234.",
        "code": "Get-Process -Id 1234 -ErrorAction SilentlyContinue | Select-Object Name,Path,Id",
        "expect": "Verás el programa si aún existe y tenés permisos; una consulta vacía no demuestra ocultamiento."
      },
      {
        "title": "Compará reposo con navegación",
        "why": "Esperá unos minutos sin utilizar el equipo, repetí la consulta y anotá qué conexiones permanecen.",
        "code": "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes",
        "expect": "Los contadores acumulados permiten comparar tráfico total, pero no explican su contenido."
      }
    ],
    "tip": "Truco: separá tres preguntas: ¿qué se conectó?, ¿a quién?, ¿para qué? Cada una necesita evidencia distinta.",
    "warning": "No bloquees IPs a ciegas: algunas pertenecen a infraestructura compartida para actualizaciones y certificados.",
    "challenge": "Elegí dos conexiones y explicá por qué su existencia no demuestra que se envían documentos personales."
  },
  {
    "id": 55,
    "goal": "Auditar qué aplicaciones tienen permisos para utilizar tu micrófono.",
    "basics": "La cámara y el micrófono pueden utilizarse por aplicaciones de escritorio y componentes del sistema. Windows ofrece controles e indicadores, pero los listados no prueban por sí solos grabaciones escondidas.",
    "steps": [
      {
        "title": "Abrí permisos del micrófono",
        "why": "Revisá acceso del dispositivo, aplicaciones y programas de escritorio.",
        "code": "Start-Process 'ms-settings:privacy-microphone'",
        "expect": "Si la URI está soportada, aparece la página de permisos. Algunas opciones dependen de tu edición."
      },
      {
        "title": "Reconocé dispositivos de audio",
        "why": "Win32_SoundDevice informa hardware de audio; no revela por sí solo cuál usa el micrófono.",
        "code": "Get-CimInstance Win32_SoundDevice | Select-Object Name,Status",
        "expect": "Aparecerán dispositivos de audio. Esta salida no es una auditoría de grabaciones."
      },
      {
        "title": "Identificá programas de videollamada en ejecución",
        "why": "La búsqueda es orientativa y no detecta todas las apps posibles.",
        "code": "Get-Process | Where-Object ProcessName -match 'teams|zoom|discord|firefox' | Select-Object Name,Id",
        "expect": "La presencia de un programa no demuestra que esté capturando sonido."
      }
    ],
    "tip": "Truco: hacé una llamada de prueba voluntaria y observá el indicador de micrófono y la actividad reciente que muestre Windows.",
    "warning": "No deshabilites dispositivos de trabajo o accesibilidad sin comprobar qué aplicaciones los necesitan.",
    "challenge": "Explicá la diferencia entre permiso concedido, programa abierto y evidencia de uso efectivo."
  },
  {
    "id": 56,
    "goal": "Aprender a comprobar los permisos de la cámara sin generar alarmas falsas.",
    "basics": "Una app puede solicitar permiso de cámara legítimamente. Los indicadores físicos y del sistema ayudan, pero un permiso no significa necesariamente que exista una transmisión ni una grabación.",
    "steps": [
      {
        "title": "Revisá privacidad de cámara",
        "why": "Abrí Configuración de Windows en la sección de cámara.",
        "code": "Start-Process 'ms-settings:privacy-webcam'",
        "expect": "Verás controles según el hardware, la edición y el tipo de aplicación."
      },
      {
        "title": "Identificá dispositivos de cámara",
        "why": "Get-PnpDevice detecta dispositivos presentes si la clase está disponible.",
        "code": "Get-PnpDevice -Class Camera -ErrorAction SilentlyContinue | Select-Object FriendlyName,Status",
        "expect": "Puede aparecer tu webcam o nada, sin implicar que está oculta."
      },
      {
        "title": "Consultá dispositivos de imagen tradicionales",
        "why": "En ciertos equipos se usa otra clase de hardware.",
        "code": "Get-PnpDevice -Class Image -ErrorAction SilentlyContinue | Select-Object FriendlyName,Status",
        "expect": "Podés encontrar dispositivos de captura adicionales o ninguno."
      }
    ],
    "tip": "Truco: anotá qué app aparece como acceso reciente en Configuración y verificá si realmente la utilizaste.",
    "warning": "No instales programas que prometen revelar 'hackers en la webcam' sin comprobar su procedencia.",
    "challenge": "¿Qué diferencia hay entre que una cámara esté instalada, que tenga permiso y que esté transmitiendo?"
  },
  {
    "id": 57,
    "goal": "Descubrir qué rastros locales conserva Windows y cómo interpretarlos.",
    "basics": "Windows y aplicaciones guardan accesos recientes, listas de documentos, eventos y configuraciones. Los rastros ayudan a diagnosticar y recuperar trabajo, pero no equivalen a un registro completo de todo lo que hiciste.",
    "steps": [
      {
        "title": "Encontrá tus elementos recientes",
        "why": "Consultá la ruta del historial de accesos recientes del perfil.",
        "code": "Join-Path $env:APPDATA 'Microsoft\\Windows\\Recent'",
        "expect": "Aparece una carpeta del perfil; su existencia no demuestra que esté registrando todo."
      },
      {
        "title": "Enumerá solamente metadatos",
        "why": "Esta vista no abre los documentos; muestra nombres y fecha de accesos directos.",
        "code": "Get-ChildItem (Join-Path $env:APPDATA 'Microsoft\\Windows\\Recent') -File -ErrorAction SilentlyContinue | Select-Object -First 10 Name,LastWriteTime",
        "expect": "Podrías ver accesos recientes o nada; no compartas nombres que revelen documentos personales."
      },
      {
        "title": "Contrastá con historial de aplicaciones",
        "why": "Consultá información temporal del sistema, sin abrir archivos de otros usuarios.",
        "code": "Get-WinEvent -LogName Application -MaxEvents 10 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Los eventos describen actividad de aplicaciones registrada, no necesariamente aperturas de archivos."
      }
    ],
    "tip": "Truco: la ausencia de un acceso reciente no es evidencia de que una aplicación no se utilizó.",
    "warning": "No borres registros de eventos ni carpetas de otros perfiles para ocultar actividades; se pierde capacidad diagnóstica.",
    "challenge": "Encontrá un rastro local creado por una prueba inocua y explicá sus límites como evidencia."
  },
  {
    "id": 58,
    "goal": "Investigar qué puede registrar Windows sobre la ejecución de programas.",
    "basics": "Hay muchos mecanismos de diagnóstico que describen aplicaciones. Los eventos de creación de procesos, cuando la auditoría está configurada, pueden registrar ejecuciones; en equipos domésticos pueden no estar habilitados.",
    "steps": [
      {
        "title": "Consultá procesos en ejecución",
        "why": "Es el estado presente y no un historial de lanzamientos.",
        "code": "Get-Process | Select-Object -First 15 Name,Id,StartTime",
        "expect": "StartTime puede requerir permisos o faltar en procesos protegidos."
      },
      {
        "title": "Buscá auditoría de procesos, si existe",
        "why": "El evento 4688 se registra solo cuando su auditoría está activada y los permisos lo permiten.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4688;StartTime=(Get-Date).AddHours(-3)} -MaxEvents 10 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Una lista vacía no demuestra que nadie haya ejecutado programas."
      },
      {
        "title": "Identificá actividad del usuario sin leer archivos",
        "why": "Consultá la fecha de inicio de algunos procesos propios.",
        "code": "Get-Process firefox -ErrorAction SilentlyContinue | Select-Object -First 6 Name,Id,StartTime",
        "expect": "Podés obtener varias filas o ninguna. La propiedad no registra cierres antiguos."
      }
    ],
    "tip": "Truco: los logs solo sirven si sabés qué eventos estaban habilitados antes del hecho investigado.",
    "warning": "No habilites auditorías masivas a ciegas: pueden generar muchos eventos y contener datos sensibles.",
    "challenge": "Explicá por qué una ausencia de eventos 4688 no demuestra que Windows jamás inició un programa."
  },
  {
    "id": 59,
    "goal": "Medir el tráfico que existe incluso cuando no abrís Internet.",
    "basics": "Servicios del sistema y aplicaciones residentes pueden comunicarse para sincronizar o verificar recursos. Para explicar el tráfico hay que medir el cambio temporal y correlacionarlo con procesos y destinos.",
    "steps": [
      {
        "title": "Registrá contadores de red",
        "why": "Estos números son acumulativos desde el último reinicio del contador.",
        "code": "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes",
        "expect": "No son Mbps ni muestran el contenido enviado."
      },
      {
        "title": "Consultá sesiones TCP",
        "why": "Enumerá conexiones establecidas en el momento de la lectura.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 20 OwningProcess,RemoteAddress,RemotePort",
        "expect": "Vas a encontrar PID y destinos; algunos pueden desaparecer antes de identificarlos."
      },
      {
        "title": "Repetí una medición controlada",
        "why": "Tomá otra lectura a los dos minutos de reposo y restá los contadores de la misma interfaz.",
        "code": "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes",
        "expect": "La diferencia indica bytes transferidos durante el intervalo; no adjudica el tráfico a un único proceso."
      }
    ],
    "tip": "Truco: medí con el navegador cerrado y después abierto, pero conservá la misma interfaz y la duración del experimento.",
    "warning": "No atribuyas automáticamente a Microsoft los bytes totales: incluyen todo el tráfico de la interfaz.",
    "challenge": "¿Qué medición demostraría actividad de red y qué evidencia adicional necesitarías para saber su finalidad?"
  },
  {
    "id": 60,
    "goal": "Comprobar si quedan procesos del navegador después de cerrar sus ventanas.",
    "basics": "Algunas aplicaciones mantienen actualizadores, notificaciones, extensiones o procesos auxiliares. Que un proceso sobreviva a una ventana no demuestra espionaje, aunque puede consumir recursos.",
    "steps": [
      {
        "title": "Observá procesos antes de cerrar el navegador",
        "why": "Filtrá los nombres más comunes, sin finalizar nada.",
        "code": "Get-Process | Where-Object ProcessName -match 'firefox|chrome|msedge' | Select-Object Name,Id,WorkingSet64",
        "expect": "Puede haber varios procesos por navegador."
      },
      {
        "title": "Cerrá las ventanas normalmente y repetí",
        "why": "El sistema puede necesitar unos segundos para completar el cierre.",
        "code": "Get-Process | Where-Object ProcessName -match 'firefox|chrome|msedge' | Select-Object Name,Id,WorkingSet64",
        "expect": "Podría quedar alguno; identificá su función y opciones de segundo plano."
      },
      {
        "title": "Consultá inicios configurados",
        "why": "No todos los procesos residentes vienen de esta fuente.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object Name,Location,Command",
        "expect": "Mostrará algunos programas automáticos. La ausencia no implica que no haya tareas o servicios."
      }
    ],
    "tip": "Truco: muchos navegadores incluyen en su configuración una opción para mantener aplicaciones en segundo plano.",
    "warning": "No mates procesos del navegador con sesiones o descargas abiertas para ahorrar RAM.",
    "challenge": "Explicá cómo distinguirías un actualizador legítimo de una actividad de red sospechosa."
  },
  {
    "id": 61,
    "goal": "Entender qué preferencias e historiales puede recordar Windows en tu perfil.",
    "basics": "El sistema guarda configuraciones como archivos recientes y comandos introducidos desde ciertas interfaces. Estos registros son útiles para la comodidad y el diagnóstico, pero requieren cuidado con la privacidad.",
    "steps": [
      {
        "title": "Identificá tu perfil",
        "why": "Las variables de entorno informan qué sesión estás usando.",
        "code": "[pscustomobject]@{ Usuario=$env:USERNAME; Perfil=$env:USERPROFILE }",
        "expect": "Se muestra información personal local; no la publiques tal cual."
      },
      {
        "title": "Revisá una ruta de historial del usuario",
        "why": "En equipos donde existe, RunMRU contiene entradas históricas del cuadro Ejecutar.",
        "code": "Test-Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RunMRU'",
        "expect": "True significa que existe la clave, no que todas las órdenes estén almacenadas."
      },
      {
        "title": "Consultá solo nombres de valores de ejemplo",
        "why": "Primero ubicá rutas de recientes en lugar de imprimir datos potencialmente sensibles.",
        "code": "Get-ChildItem (Join-Path $env:APPDATA 'Microsoft\\Windows\\Recent') -File -ErrorAction SilentlyContinue | Measure-Object | Select-Object Count",
        "expect": "Verás cuántos elementos hay, sin mostrar los nombres privados."
      }
    ],
    "tip": "Truco: antes de mostrar tu PC en una clase, comprobá notificaciones y listas recientes visibles en pantalla.",
    "warning": "No compartas salidas con rutas de perfil, historial de búsquedas ni nombres de documentos.",
    "challenge": "Identificá qué guardan Windows, el navegador y una aplicación por separado."
  },
  {
    "id": 62,
    "goal": "Diferenciar tu IP local de la IP pública y comprender qué se puede inferir.",
    "basics": "Tu IP privada identifica una interfaz en la red local; una IP pública suele identificar una conexión o salida compartida. La geolocalización por IP es aproximada y no proporciona por sí sola una dirección exacta.",
    "steps": [
      {
        "title": "Consultá direcciones privadas",
        "why": "Mostrá IPv4 de las interfaces conectadas.",
        "code": "Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike '169.254*'} | Select-Object InterfaceAlias,IPAddress,PrefixLength",
        "expect": "Podés ver direcciones privadas, loopback u otras según el equipo."
      },
      {
        "title": "Consultá puerta de enlace",
        "why": "Get-NetIPConfiguration ofrece contexto para distinguir la red local.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4Address,IPv4DefaultGateway",
        "expect": "La puerta de enlace suele ser tu router, pero no siempre."
      },
      {
        "title": "Explicá el salto a Internet",
        "why": "Si hay NAT o CGNAT, varios equipos pueden compartir la IP pública. No hace falta publicar tu IP para aprender.",
        "code": "Get-NetRoute -AddressFamily IPv4 | Where-Object DestinationPrefix -eq '0.0.0.0/0' | Select-Object InterfaceAlias,NextHop,RouteMetric",
        "expect": "Aparecen rutas predeterminadas, no necesariamente la dirección IP pública."
      }
    ],
    "tip": "Truco: una IP visible en una web no revela automáticamente tu nombre, domicilio exacto ni qué persona usó una conexión compartida.",
    "warning": "No publiques identificadores de red, capturas de configuraciones de router o IPs asociadas a tu hogar sin necesidad.",
    "challenge": "Explicá las diferencias entre IP privada, IP pública, NAT y geolocalización aproximada."
  },
  {
    "id": 63,
    "goal": "Aprender qué elimina realmente el modo privado de un navegador.",
    "basics": "La navegación privada normalmente evita guardar ciertos historiales y cookies de la sesión en el perfil local, pero no impide que el sitio, la red, extensiones con permiso o el sistema observen toda actividad de red.",
    "steps": [
      {
        "title": "Revisá primero la ayuda del navegador",
        "why": "Abrí el apartado de navegación privada de tu navegador habitual y anotá sus limitaciones.",
        "code": "Get-Process | Where-Object ProcessName -match 'firefox|chrome|msedge' | Select-Object -First 8 Name,Id",
        "expect": "Identificás procesos, no el modo de las ventanas."
      },
      {
        "title": "Observá qué sigue en Windows",
        "why": "DNS puede tener caché compartida y no está diseñado para registrar todo el historial.",
        "code": "Get-DnsClientCache | Select-Object -First 8 Entry,RecordType",
        "expect": "Podría mostrar dominios anteriores o nada. La caché no prueba qué página visitaste ni qué modo usaste."
      },
      {
        "title": "Probá con una web no sensible",
        "why": "Abrí example.com en ventana privada, cerrala y revisá el historial visible de ese navegador sin inspeccionar cuentas.",
        "code": "Resolve-DnsName example.com | Select-Object -First 5 Name,IPAddress",
        "expect": "Una resolución DNS demuestra consulta, no un historial completo."
      }
    ],
    "tip": "Truco: una ventana privada es útil para evitar ciertas persistencias locales, no para ocultarte de tu proveedor o del propio sitio.",
    "warning": "No introduzcas datos reales, contraseñas ni pruebas de terceros para investigar privacidad.",
    "challenge": "Explicá tres cosas que el modo privado suele evitar y tres que no puede garantizar."
  },
  {
    "id": 64,
    "goal": "Revisar qué aplicaciones pueden solicitar tu ubicación desde Windows.",
    "basics": "Windows controla el acceso de aplicaciones compatibles a la ubicación, pero una web también puede inferir una región por IP y los permisos no siempre describen el uso real.",
    "steps": [
      {
        "title": "Abrí controles de ubicación",
        "why": "Revisá Configuración > Privacidad y seguridad > Ubicación.",
        "code": "Start-Process 'ms-settings:privacy-location'",
        "expect": "Vas a ver permisos y posiblemente actividad reciente."
      },
      {
        "title": "Consultá servicio de geolocalización",
        "why": "lfsvc puede estar detenido sin que eso indique un fallo.",
        "code": "Get-Service lfsvc -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType",
        "expect": "Aparecerá su estado si existe."
      },
      {
        "title": "Identificá configuración de red general",
        "why": "La IP no es GPS; sirve para diferenciar ubicación aproximada de permisos de hardware.",
        "code": "Get-NetIPConfiguration | Select-Object InterfaceAlias,IPv4Address",
        "expect": "Obtendrás datos de red locales; no una ubicación geográfica confiable."
      }
    ],
    "tip": "Truco: comparar permisos y acceso reciente es mejor que asumir que toda app autorizada usa GPS constantemente.",
    "warning": "Si desactivás ubicación, algunas funciones legítimas como mapas o búsqueda del dispositivo pueden degradarse.",
    "challenge": "Explicá la diferencia entre permiso de ubicación, geolocalización por IP y datos GPS."
  }
];
