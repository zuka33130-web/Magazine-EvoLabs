import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Magazine Estrella · Investigaciones 041–050. Guías seguras, sin acciones automáticas. */
export const EVO_MAGAZINE_THIRD_BATCH: EvoMagazineArticle[] = [
  {
    "id": 41,
    "goal": "Distinguir paquetes de red, sesiones y tráfico de aplicaciones antes de abrir Wireshark.",
    "basics": "Una red intercambia paquetes, pero una conexión TCP establecida no muestra directamente el contenido. Wireshark captura tráfico y requiere identificar tu propia interfaz y respetar la privacidad de otros dispositivos.",
    "steps": [
      {
        "title": "Identificá la interfaz activa",
        "why": "Primero comprobá qué tarjeta de red transporta datos.",
        "code": "Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name,InterfaceDescription,LinkSpeed",
        "expect": "Aparecerá una o varias interfaces; una interfaz activa no demuestra tráfico intenso."
      },
      {
        "title": "Tomá una línea base de tráfico",
        "why": "Los contadores son acumulativos desde su último reinicio; compará dos lecturas separadas en el tiempo.",
        "code": "Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes",
        "expect": "Obtendrás bytes recibidos y enviados por adaptador. Una cifra aislada no es tasa de transferencia."
      },
      {
        "title": "Si ya tenés Wireshark, observá solo tu equipo",
        "why": "Abrí Wireshark desde Inicio, elegí la interfaz correcta, capturá un periodo breve y filtrá por 'dns' o 'tcp'. No es necesario instalarlo para completar la práctica inicial.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 10 LocalAddress,RemoteAddress,RemotePort,OwningProcess",
        "expect": "La lista de conexiones ayuda a contrastar qué proceso puede explicar el tráfico, sin mostrar cargas cifradas."
      }
    ],
    "tip": "Truco EVO: guardá el horario de inicio y final de una captura. El volumen del archivo puede crecer rápidamente y contener información sensible.",
    "warning": "Capturá únicamente tráfico propio o autorizado. No compartas archivos pcap sin revisar qué datos personales contienen.",
    "challenge": "Explicá por qué ver TLS en Wireshark no permite leer automáticamente el contenido cifrado y qué sí podés observar."
  },
  {
    "id": 42,
    "goal": "Comprobar cómo resuelve Windows los nombres y comprender DNS sobre HTTPS.",
    "basics": "DNS sobre HTTPS cifra las consultas entre tu equipo y el resolutor compatible, pero no oculta necesariamente la IP del servidor al que después te conectás ni convierte toda la navegación en anónima.",
    "steps": [
      {
        "title": "Identificá tus resolutores",
        "why": "Consultá DNS configurado en las interfaces de red.",
        "code": "Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object InterfaceAlias,ServerAddresses",
        "expect": "Verás direcciones DNS por interfaz; algunas pueden pertenecer a adaptadores inactivos."
      },
      {
        "title": "Verificá si tu Windows expone configuración DoH",
        "why": "El cmdlet Get-DnsClientDohServerAddress existe en versiones compatibles. Si falta, registralo como limitación.",
        "code": "Get-Command Get-DnsClientDohServerAddress -ErrorAction SilentlyContinue | Select-Object Name,Source",
        "expect": "Obtendrás el nombre del comando o ninguna salida."
      },
      {
        "title": "Probá resolución real",
        "why": "Usá un dominio de documentación para verificar la consulta normal de DNS.",
        "code": "Resolve-DnsName example.com | Select-Object -First 5 Name,Type,IPAddress",
        "expect": "Verás registros A/AAAA u otros. Este resultado por sí solo no certifica que la consulta haya viajado cifrada."
      }
    ],
    "tip": "Truco EVO: comparar privacidad de DNS requiere observar el mecanismo de transporte, no solamente que una web abra rápido.",
    "warning": "No sustituyas servidores DNS ni fuerces registros de red sin copia de la configuración original.",
    "challenge": "Respondé: ¿qué protege DoH y qué información continúa visible para el sitio al que te conectás?"
  },
  {
    "id": 43,
    "goal": "Identificar cookies, caché y procesos que conserva el navegador.",
    "basics": "Una cookie puede recordar una sesión; la caché almacena recursos para cargar páginas con menos trabajo. Los navegadores modernos usan varios procesos y no todos indican una pestaña abierta.",
    "steps": [
      {
        "title": "Revisá los procesos del navegador",
        "why": "Si usás Firefox, esta consulta mostrará instancias abiertas; reemplazá firefox por tu navegador si corresponde.",
        "code": "Get-Process firefox -ErrorAction SilentlyContinue | Select-Object Name,Id,WorkingSet64",
        "expect": "Puede haber varios procesos o ninguno si Firefox está cerrado."
      },
      {
        "title": "Consultá rutas de perfiles sin inspeccionar datos privados",
        "why": "Un perfil de usuario almacena preferencias y cachés; no necesitás abrir sus bases de datos.",
        "code": "Join-Path $env:APPDATA 'Mozilla\\Firefox\\Profiles'",
        "expect": "Aparece una ruta calculada, aunque la carpeta no exista si no utilizás Firefox."
      },
      {
        "title": "Revisá controles del navegador",
        "why": "Abrí configuración de privacidad, identificá cookies, permisos de sitios y almacenamiento sin borrar nada.",
        "code": "Get-Process | Where-Object ProcessName -match 'firefox|chrome|msedge' | Select-Object -First 12 ProcessName,Id",
        "expect": "Identificá qué navegadores continúan en ejecución y compará con las ventanas abiertas."
      }
    ],
    "tip": "Truco EVO: una web que te recuerda no demuestra vigilancia; revisá qué cookie guardó y si está asociada a una sesión iniciada.",
    "warning": "No borres perfiles completos ni bases de datos del navegador; podrías perder contraseñas, sesiones y marcadores.",
    "challenge": "Identificá una cookie de prueba desde las herramientas del navegador y explicá por qué no es equivalente a un proceso."
  },
  {
    "id": 44,
    "goal": "Evaluar recetas virales de optimización sin arriesgar estabilidad.",
    "basics": "Un truco creíble requiere hipótesis medible, pruebas A/B y control de variables. Menos servicios o RAM no siempre mejora FPS, frametime o latencia.",
    "steps": [
      {
        "title": "Anotá las condiciones del equipo",
        "why": "Registrá versión y compilación de Windows antes de comparar.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber,Version",
        "expect": "Se informa la compilación; los resultados de otra versión no necesariamente aplican."
      },
      {
        "title": "Registrá la carga general inicial",
        "why": "El número de procesos ayuda a caracterizar el escenario, pero no mide rendimiento gráfico.",
        "code": "Get-Process | Measure-Object | Select-Object Count",
        "expect": "Obtendrás un número de procesos que puede variar naturalmente."
      },
      {
        "title": "Hacé un plan de prueba sin aplicar tweaks",
        "why": "Escribí una hipótesis y elegí una métrica real, como 1% low, tiempo de apertura o latencia. Repetí la misma escena y cambiá una sola variable.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfLogicalProcessors",
        "expect": "La topología ayuda a describir el sistema, pero no prueba mejora de rendimiento."
      }
    ],
    "tip": "Truco EVO: una diferencia menor que la variación natural de las mediciones no debería promocionarse como mejora.",
    "warning": "No deshabilites actualizaciones, antivirus, protección de memoria ni drivers por promesas de más FPS.",
    "challenge": "Diseñá tres ejecuciones controladas que puedan refutar una supuesta mejora de Regedit."
  },
  {
    "id": 45,
    "goal": "Aprender por qué 100 FPS pueden sentirse peor que 80 FPS.",
    "basics": "El frametime es el tiempo transcurrido entre cuadros: a 100 FPS constantes el intervalo promedio es 10 ms, pero picos aislados pueden causar tirones. El percentil 1% low exige capturas de tiempos de cuadro; no se obtiene contando procesos.",
    "steps": [
      {
        "title": "Calculá el intervalo ideal",
        "why": "Convertí una frecuencia sostenida de cuadros a milisegundos por cuadro.",
        "code": "1000 / 100",
        "expect": "El resultado es 10 ms por cuadro a 100 FPS estables."
      },
      {
        "title": "Compará dos frecuencias",
        "why": "Ejecutá un cálculo sin tocar juegos ni controladores.",
        "code": "[pscustomobject]@{ FPS60ms=1000/60; FPS120ms=1000/120; FPS200ms=1000/200 }",
        "expect": "Verás el presupuesto temporal aproximado de cada frecuencia. No es una captura real."
      },
      {
        "title": "Documentá tus condiciones de medición",
        "why": "Registrá resolución, Hz, límite de FPS, escena y temperatura antes de usar una herramienta de captura fiable.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object -First 2 Name,DriverVersion",
        "expect": "Solo muestra adaptadores y versión reportada; no calcula 1% low."
      }
    ],
    "tip": "Truco EVO: medir una muestra larga y comparable es más útil que mostrar el FPS máximo en pantalla.",
    "warning": "No presentes cálculos teóricos como mediciones reales de latencia o 1% low de un juego.",
    "challenge": "Explicá cómo dos sesiones con igual FPS promedio pueden tener sensaciones de fluidez diferentes."
  },
  {
    "id": 46,
    "goal": "Comprender cuándo la GPU integrada comparte RAM con el procesador.",
    "basics": "Una GPU integrada usa memoria del sistema, compite por ancho de banda y puede mostrar valores de memoria dedicada o compartida que dependen del controlador. Más RAM asignada no garantiza más potencia de cálculo.",
    "steps": [
      {
        "title": "Identificá las GPUs detectadas",
        "why": "CIM informa adaptadores de pantalla visibles para Windows.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion,AdapterRAM",
        "expect": "AdapterRAM puede ser impreciso en GPUs integradas; no lo interpretes como VRAM física garantizada."
      },
      {
        "title": "Consultá la memoria del equipo",
        "why": "La memoria instalada no es igual a la memoria libre ni a la memoria compartida efectiva.",
        "code": "Get-CimInstance Win32_PhysicalMemory | Select-Object Capacity,Speed,ConfiguredClockSpeed",
        "expect": "Verás módulos y velocidades reportadas. Algunas propiedades pueden faltar."
      },
      {
        "title": "Compará desde el Administrador de tareas",
        "why": "Abrí Rendimiento > GPU y mirá las métricas de Memoria GPU compartida junto con la RAM total.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Las cifras dependen del driver y de la carga; registralas sin modificar la configuración."
      }
    ],
    "tip": "Truco EVO: para una iGPU suele importar mucho la configuración de canales de memoria además de capacidad.",
    "warning": "No modifiques DVMT, BIOS ni controladores gráficos siguiendo un truco genérico.",
    "challenge": "Explicá qué recursos pueden competir por el mismo ancho de banda al jugar con gráficos integrados."
  },
  {
    "id": 47,
    "goal": "Detectar indicios de limitación térmica sin inventar temperaturas.",
    "basics": "El throttling térmico ocurre cuando el equipo reduce frecuencias o potencia para proteger sus componentes. Un procesador que baja MHz puede estar ocioso o limitado por energía, no necesariamente sobrecalentado.",
    "steps": [
      {
        "title": "Identificá el procesador",
        "why": "Consultá su frecuencia nominal y su estado actual reportado.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,MaxClockSpeed,CurrentClockSpeed",
        "expect": "Las lecturas pueden ser aproximadas, estáticas o limitadas por el firmware."
      },
      {
        "title": "Revisá configuración de energía",
        "why": "Consultá el esquema activo.",
        "code": "powercfg /getactivescheme",
        "expect": "Verás el plan activo; no indica temperatura de CPU."
      },
      {
        "title": "Documentá el síntoma",
        "why": "Registrá cuándo bajan FPS, si hay ventilación obstruida y el contexto de carga. Compará con sensores confiables del equipo.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model",
        "expect": "Marca y modelo sirven para identificar dónde buscar especificaciones térmicas oficiales."
      }
    ],
    "tip": "Truco EVO: sin una lectura térmica confiable y una carga sostenida no declares throttling por temperatura.",
    "warning": "No desmontes el equipo ni cambies límites de potencia por este diagnóstico introductorio.",
    "challenge": "Nombrá otras tres causas de una frecuencia baja que no sean la temperatura."
  },
  {
    "id": 48,
    "goal": "Construir una pequeña auditoría en PowerShell y entender cada componente.",
    "basics": "PowerShell trabaja con objetos, no solamente texto. Eso permite seleccionar propiedades y crear resúmenes legibles sin instalar optimizadores. El primer informe será solo de lectura.",
    "steps": [
      {
        "title": "Consultá qué Windows ejecutás",
        "why": "Guardá el resultado en una variable de sesión, sin escribir archivos.",
        "code": "$os = Get-CimInstance Win32_OperatingSystem; $os | Select-Object Caption,Version,BuildNumber",
        "expect": "La variable $os contiene un objeto con propiedades consultables."
      },
      {
        "title": "Creá un resumen personalizado",
        "why": "[pscustomobject] construye un objeto nuevo a partir de datos reales.",
        "code": "[pscustomobject]@{ Equipo=$env:COMPUTERNAME; Windows=$os.Caption; Build=$os.BuildNumber; RAM_GiB=[math]::Round($os.TotalVisibleMemorySize/1MB,2) }",
        "expect": "Verás una ficha técnica con datos del equipo, sin cambios en el Registro."
      },
      {
        "title": "Aprendé a revisar propiedades",
        "why": "Get-Member enseña el nombre y tipo de las propiedades del objeto.",
        "code": "$os | Get-Member -MemberType Property | Select-Object -First 12 Name,MemberType",
        "expect": "Se listan propiedades que podés reutilizar."
      }
    ],
    "tip": "Truco EVO: construí informes primero en pantalla; solo después decidí si necesitás guardarlos.",
    "warning": "Antes de compartir informes, eliminá nombre del equipo, usuario, serie o rutas privadas.",
    "challenge": "Agregá una propiedad Fecha y explicá la diferencia entre copiar texto y conservar objetos PowerShell."
  },
  {
    "id": 49,
    "goal": "Saber qué se puede recuperar antes de modificar Windows.",
    "basics": "Una copia de seguridad personal, un punto de restauración y una imagen del sistema resuelven problemas distintos. Los puntos de restauración no sustituyen respaldos de documentos.",
    "steps": [
      {
        "title": "Comprobá unidades y capacidad",
        "why": "Una copia solo es útil si tiene destino y espacio suficientes.",
        "code": "Get-Volume | Select-Object DriveLetter,FileSystem,SizeRemaining,Size",
        "expect": "Verás unidades y espacio reportado."
      },
      {
        "title": "Consultá puntos de restauración existentes",
        "why": "Este cmdlet puede requerir privilegios y Protección del sistema habilitada.",
        "code": "Get-ComputerRestorePoint -ErrorAction SilentlyContinue | Select-Object -First 5 Description,CreationTime,SequenceNumber",
        "expect": "Puede no haber registros, aunque Windows funcione correctamente."
      },
      {
        "title": "Abrí opciones de protección",
        "why": "Entrá a Protección del sistema para conocer su estado, sin crear ni eliminar nada.",
        "code": "Start-Process SystemPropertiesProtection.exe",
        "expect": "Se abre la interfaz si está disponible."
      }
    ],
    "tip": "Truco EVO: probá la restauración de un archivo de prueba antes de confiar tus documentos a una sola copia.",
    "warning": "No borres instantáneas, particiones de recuperación ni puntos para ganar unos MB sin analizar impacto.",
    "challenge": "Explicá con un caso qué recuperarías de una copia de archivos y qué restaurarías con un punto del sistema."
  },
  {
    "id": 50,
    "goal": "Preparar una ficha de diagnóstico reproducible antes de modificar tu computadora.",
    "basics": "La auditoría inicial debe registrar sistema, hardware, memoria, procesos y red sin alterar nada. Después se compara con mediciones posteriores para distinguir mejoras reales de fluctuaciones.",
    "steps": [
      {
        "title": "Identificá sistema y memoria",
        "why": "Consultá Windows y RAM en dos lecturas controladas.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,TotalVisibleMemorySize,FreePhysicalMemory",
        "expect": "Verás valores actuales y descripción de sistema; las memorias están en KiB."
      },
      {
        "title": "Contá procesos y servicios en ejecución",
        "why": "Estos conteos son indicadores de contexto, no puntajes de optimización.",
        "code": "[pscustomobject]@{ Procesos=(Get-Process | Measure-Object).Count; Servicios=(Get-Service | Where-Object Status -eq 'Running' | Measure-Object).Count }",
        "expect": "Obtendrás dos cantidades momentáneas que pueden variar."
      },
      {
        "title": "Consultá la interfaz de red",
        "why": "Anotá el adaptador activo y velocidad negociada, sin cambiar ajustes.",
        "code": "Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name,LinkSpeed",
        "expect": "LinkSpeed no es velocidad real de Internet ni latencia."
      }
    ],
    "tip": "Truco EVO: empezá cualquier experimento guardando versión de Windows, hora, aplicaciones abiertas y condición de energía.",
    "warning": "No desactives servicios para reducir conteos: primero determiná qué recursos consumen y cuál es su función.",
    "challenge": "Escribí una tabla antes/después y especificá qué resultados confirmarían o refutarían una mejora."
  }
];
