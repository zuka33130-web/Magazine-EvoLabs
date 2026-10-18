import type { EvoWindowsResearch } from './tomo02Magazine40CorpusTypes';
/** Privacidad y entrada al bloque de seguridad · 010–017. */
export const EVO_WINDOWS40_CORPUS_B: EvoWindowsResearch[] = [
  {
    "number": 10,
    "premise": [
      "Un micrófono encendido puede ser útil para una videollamada, una función de accesibilidad o un asistente; también puede representar una exposición de privacidad si una aplicación lo usa sin intención del usuario. El dilema no se resuelve mirando si aparece un icono rojo. Las señales de Windows, los permisos y el comportamiento de las aplicaciones describen dimensiones diferentes.",
      "Esta investigación convierte el miedo a una grabación invisible en un control verificable: qué dispositivo de audio existe, qué aplicaciones tienen permiso, cuál se usó recientemente según el sistema y qué límites tiene esa evidencia. Sin acceder a conversaciones ni instalar grabadores."
    ],
    "mechanisms": [
      "Windows ofrece controles de acceso al micrófono y permisos para aplicaciones compatibles. Las apps empaquetadas y los programas de escritorio pueden presentarse en categorías de permisos distintas; permitir acceso a aplicaciones de escritorio puede afectar a programas clásicos que no figuran como una app individual en la misma lista.",
      "Una app puede abrir el dispositivo de audio para llamadas, activación por voz o pruebas de hardware. El indicador de uso, cuando está disponible, es una señal útil; no es un sistema forense completo. Algunos controladores, entornos virtuales o canales de captura requieren verificación adicional."
    ],
    "traps": [
      "Que una aplicación tenga permiso no prueba que esté grabando. Que un indicador no aparezca no garantiza ausencia de todo acceso posible: permisos, versiones, controladores y sesiones remotas cambian la cobertura. Tampoco un servicio de audio activo equivale a un micrófono abierto.",
      "Deshabilitar servicios de audio indiscriminadamente puede destruir voz, juegos, reuniones o accesibilidad. Si la preocupación es concreta, empezá por revocar permisos mediante la interfaz oficial de Configuración y medir el efecto, dejando asentado qué función dejaste de usar."
    ],
    "protocol": [
      "Abrí Configuración > Privacidad y seguridad > Micrófono y documentá el estado de los controles visibles: acceso del dispositivo, apps autorizadas y acceso de aplicaciones de escritorio. Después abrí voluntariamente una app de grabación propia, observá el indicador disponible y cerrala; compará el estado antes y después.",
      "Para contextualizar una sospecha, registrá hora, PID y versión de la aplicación, fuente de descarga y firma si es necesario. No esperes que una consulta de servicios pruebe contenido grabado. Evitá recopilar audio real de otras personas; la meta es verificar permisos y comportamiento."
    ],
    "interpretation": [
      "Ver la app autorizada permite hablar de superficie de acceso; ver una indicación de uso reciente permite investigar temporalmente, pero ninguna de las dos describe por sí sola el audio capturado ni su destino. Si una reunión usa un micrófono virtual, anotá esa particularidad.",
      "Si se repite actividad inesperada, comprobá origen de la app, permisos y si hay software de streaming o asistencia remota. El análisis de procesos y conexiones puede aportar pistas, aunque una conexión cifrada no revela qué datos transportó."
    ],
    "conclusion": [
      "El lector se lleva una auditoría de micrófono responsable: superficie de permisos, prueba controlada de uso, observación de indicadores y límites explícitos. Privacidad es capacidad de decisión informada, no apagar Windows hasta que deje de funcionar.",
      "Un diagnóstico sólido no promete encontrar toda grabación oculta con un solo comando. Si el problema persiste, el caso requiere herramientas especializadas, revisión de controladores y delimitación de acceso físico."
    ],
    "lab": {
      "title": "LAB 010 · INVENTARIO DEL DISPOSITIVO DE AUDIO",
      "why": "Consultá dispositivos de captura reconocidos. Revisá los permisos desde Configuración; el laboratorio no captura sonido.",
      "code": "Get-PnpDevice -Class AudioEndpoint -ErrorAction SilentlyContinue | Select-Object Status,FriendlyName,InstanceId\nGet-Service Audiosrv,AudioEndpointBuilder -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType",
      "readout": "Un endpoint presente o servicio activo no prueba grabación. La comprobación efectiva de permisos exige revisar Configuración > Privacidad y seguridad > Micrófono."
    },
    "insight": "Permiso y uso son hechos distintos; ninguno revela automáticamente si hubo una grabación o envío de datos.",
    "challenge": "Comprobá antes/después el indicador con una app propia y registrá qué pruebas no ofrecen las herramientas.",
    "video": "¿Tu micrófono está escuchando? Antes de acusar, medí permiso, uso y contexto.",
    "sources": [
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      },
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      }
    ]
  },
  {
    "number": 11,
    "premise": [
      "La cámara de tu equipo puede utilizarse en una reunión, una verificación de identidad o una app de escaneo. También podría abrirse por software no deseado. El led físico, cuando existe, es una protección práctica, pero no todas las cámaras están conectadas igual y algunos periféricos carecen de un testigo inequívoco.",
      "El experimento correcto comienza por un inventario de dispositivos y permisos y continúa con una prueba voluntaria de apertura, observando indicaciones y configuración. No necesitamos capturar imágenes privadas para aprender cómo funciona el control de acceso."
    ],
    "mechanisms": [
      "Windows administra cámaras mediante controladores y APIs de captura. Las aplicaciones empaquetadas suelen solicitar permisos de cámara; los programas de escritorio están sujetos a controles de privacidad que pueden no listar cada ejecutable individualmente. Un dispositivo puede aparecer habilitado sin que exista un flujo de video en curso.",
      "Una cámara virtual es un dispositivo lógico producido por software de reuniones o streaming, distinto de una cámara física. Las políticas de una organización, el acceso remoto y los permisos de cuenta pueden influir en qué aplicaciones la usan. Un modelo profesional registra el dispositivo real y el lógico por separado."
    ],
    "traps": [
      "'La cámara figura en el Administrador de dispositivos' no significa 'te están filmando'. Tampoco es seguro suponer que un LED equivale a prueba forense de ausencia de captura en todo tipo de cámaras. Un led ausente, dañado o dependiente de firmware puede dejar puntos ciegos.",
      "Bloquear controladores o borrar dispositivos para 'estar más seguro' sin copia de configuración puede inutilizar autenticación, reuniones y scanners. El control reversible de permisos y, si el riesgo lo justifica, una cubierta física adecuada, ofrecen respuestas mejor delimitadas."
    ],
    "protocol": [
      "Consultá Configuración > Privacidad y seguridad > Cámara; registrá quién puede solicitar acceso y qué controles están activos. Inventariá cámaras físicas y virtuales mediante PnP. Abrí la aplicación Cámara solo en tu propio dispositivo, observá los avisos disponibles y cerrala; documentá hora de la prueba.",
      "Si se investiga una apertura no deseada, buscá el proceso asociado y su firma, verificá permisos y revisá si había herramientas de vídeo abiertas. No compartas capturas de rostros, documentos u otras personas como parte del diagnóstico."
    ],
    "interpretation": [
      "Los indicadores de privacidad constituyen evidencia de interfaz, no una descripción exhaustiva de módulos cargados en drivers. La lista de apps con permiso refleja configuración; demostrar acceso pasado requiere historial y registros disponibles.",
      "La aparición de una cámara virtual no indica por sí sola ataque; con frecuencia la crea una suite legítima. Revisá instalación y propietario antes de etiquetarla como anomalía."
    ],
    "conclusion": [
      "Una auditoría de cámara bien hecha puede ser explicada a otra persona sin exponer su intimidad: dispositivo, permisos, prueba controlada, proceso, límites. Esa es la diferencia entre alarma viral y tecnología comprendida.",
      "El resultado valioso no es que haya un LED encendido, sino entender exactamente qué demuestra el LED y cuál sería la siguiente prueba si hay una discrepancia."
    ],
    "lab": {
      "title": "LAB 011 · MAPA DE CÁMARAS",
      "why": "Inventario no destructivo; la prueba de cámara se realiza manualmente, sin grabar terceros.",
      "code": "Get-PnpDevice -Class Camera -ErrorAction SilentlyContinue | Select-Object Status,FriendlyName,InstanceId\nGet-PnpDevice -Class Image -ErrorAction SilentlyContinue | Select-Object Status,FriendlyName,InstanceId",
      "readout": "Dependiendo del controlador, una cámara puede aparecer en Camera, Image u otra clase. La ausencia en este listado no prueba que no exista una interfaz de captura virtual."
    },
    "insight": "Dispositivo disponible, permiso concedido y vídeo capturado son etapas diferentes.",
    "challenge": "Probá una cámara propia desde Configuración y distinguí el indicador de uso de una prueba forense.",
    "video": "¿Quién puede ver por tu cámara? Empieza con permisos, no con teorías.",
    "sources": [
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      },
      {
        "name": "Get-AppxPackage — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/appx/get-appxpackage"
      }
    ]
  },
  {
    "number": 12,
    "premise": [
      "La pregunta '¿Qué recuerda Windows de mí?' mezcla elementos diferentes: archivos recientes, actividad del navegador, búsquedas, historial de apps, sincronización de cuenta y —en ciertos Copilot+ PC— la función Recall. No existe un único almacén universal que registre secretamente todo por defecto. Cada función tiene alcance, política y controles propios.",
      "Recall merece un tratamiento riguroso por su actualidad: es una capacidad disponible en hardware y versiones compatibles, basada en instantáneas de pantalla procesadas localmente. Microsoft describe su activación como voluntaria. Un equipo sin esa función no puede auditarla como si estuviera presente."
    ],
    "mechanisms": [
      "Los recientes del Explorador y las listas de salto pueden mostrar referencias a documentos y programas usados. Otros historiales pertenecen a aplicaciones o servicios externos. Los datos en la nube de una cuenta no se deducen observando una carpeta local. El almacenamiento y retención dependen de cada producto.",
      "En dispositivos Copilot+ compatibles, Recall permite búsquedas sobre instantáneas locales si el usuario acepta activar su guardado; la protección incorpora autenticación Windows Hello y cifrado según requisitos. En dispositivos administrados hay políticas adicionales y puede estar deshabilitado o eliminado. La disponibilidad varía con hardware, edición, región y versión."
    ],
    "traps": [
      "No equipares 'Recall instalado' con 'capturas activadas'. Tampoco confundas una línea temporal de archivos recientes con una copia de cada documento. La privacidad se discute según qué dato se guarda, dónde, por cuánto tiempo, quién puede acceder y bajo qué configuración.",
      "Los tutoriales que recomiendan borrar carpetas no documentadas para eliminar historial pueden romper perfiles o hacer perder pruebas relevantes. La vía segura usa controles oficiales y gestiona por separado las preferencias de cada función."
    ],
    "protocol": [
      "En Configuración > Privacidad y seguridad, revisá opciones disponibles de actividad, historial de búsquedas y Recall si la máquina es compatible. Anotá 'no disponible' si no aparece; nunca presupongas que se ejecuta. Separá elementos locales, sincronizados y opciones de privacidad de terceros.",
      "Elegí un archivo propio de prueba: abrilo, cerralo y observá si aparece en recientes. Esto demuestra un mecanismo acotado, no que Windows capture universalmente el contenido. Si Recall está habilitado voluntariamente, explorá sus controles oficiales sin copiar pantallas sensibles al expediente."
    ],
    "interpretation": [
      "En Recall, Microsoft afirma que las instantáneas y su análisis se mantienen localmente y no son enviadas al proveedor como parte de esa función; esto no transforma en locales las comunicaciones de otras apps que aparezcan en pantalla. Un análisis correcto conserva esas fronteras.",
      "Que no encuentres un historial en una herramienta no demuestra que no haya otros registros: hay políticas de retención, cuentas, cachés y productos distintos. Limitá las conclusiones a las fuentes revisadas."
    ],
    "conclusion": [
      "La tesis editorial es clara: 'Windows recuerda todo' no es un diagnóstico. El inventario de superficies de memoria —recientes, aplicaciones, nube, Recall opcional— da al usuario control verificable y una comprensión que resiste cambios de marketing.",
      "Un lector informado sabe preguntar por disponibilidad, consentimiento, almacenamiento, retención y acceso antes de llamar espionaje a una función o confiar en ella ciegamente."
    ],
    "lab": {
      "title": "LAB 012 · HISTORIALES DISPONIBLES",
      "why": "Inventariá características y edición sin leer archivos personales ni capturar instantáneas.",
      "code": "Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber\nGet-CimInstance Win32_ComputerSystem | Select-Object Model,Manufacturer,TotalPhysicalMemory\nGet-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -ErrorAction SilentlyContinue | Select-Object Start_TrackDocs,Start_TrackProgs",
      "readout": "Los valores del Registro son pistas de ciertas preferencias del shell, no auditoría de Recall. Confirmá disponibilidad y consentimiento desde Configuración oficial."
    },
    "insight": "Recall es opt-in en hardware compatible; recientes y datos de cuenta son mecanismos diferentes.",
    "challenge": "Clasificá cinco historiales observables según origen local/nube, control y retención, sin extraer datos sensibles.",
    "video": "¿Windows recuerda todo? La respuesta depende de QUÉ función y QUÉ consentimiento.",
    "sources": [
      {
        "name": "Administración de Recall — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/client-management/manage-recall"
      },
      {
        "name": "Recall y privacidad — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/ai/cards/recall-application-card"
      },
      {
        "name": "Get-ItemProperty — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-itemproperty"
      }
    ]
  },
  {
    "number": 13,
    "premise": [
      "Una máquina conectada realiza consultas de DNS, tiempo, actualizaciones, certificados, notificaciones y sincronización sin una ventana visible. Ver paquetes salientes no basta para atribuir espionaje ni siquiera para identificar una aplicación concreta. La pregunta interesante es quién originó la conexión, qué protocolo utiliza y en qué circunstancias aparece.",
      "Este expediente aplica el método EVO: primero un inventario y un período de observación, después una hipótesis sobre una función específica, y finalmente una contrastación. Prohibido convertir una tabla de IP remotas en una lista de culpables."
    ],
    "mechanisms": [
      "Una conexión TCP muestra extremos y estado; el PID del socket permite acercarse al proceso que la abrió. UDP y QUIC no se reconstruyen con la misma consulta, y TLS impide observar el contenido útil sin autorización y técnicas especiales. Las IP pueden pertenecer a CDN compartidas.",
      "Servicios de Windows y aplicaciones de terceros pueden compartir componentes, cuentas o resoluciones DNS. Una conexión de svchost.exe puede requerir mapear servicios asociados, pero una tabla de sockets no asigna siempre el tráfico a un servicio concreto alojado en un host compartido."
    ],
    "traps": [
      "La geolocalización de una IP no confirma qué organización recibió un documento. ESTABLISHED significa sesión TCP, no transferencia de datos sensibles. Tampoco una sola captura sin tráfico permite asegurar que el sistema nunca se conecta: las aplicaciones operan por eventos y reintentos.",
      "Bloquear indiscriminadamente dominios puede interrumpir servicios esenciales, actualizaciones y verificación de certificados. Si el objetivo es privacidad, la atribución debe preceder a una política de bloqueo reversible y documentada."
    ],
    "protocol": [
      "Capturá una instantánea de conexiones TCP y procesos. Esperá cinco minutos sin abrir apps nuevas, tomá otra y compará destinos. Después activá voluntariamente una función específica propia, como sincronizar un archivo de prueba, para establecer qué cambia respecto del control.",
      "Anotá hora, conexión, PID, ruta, función activa, protocolo y cobertura del instrumento. Si vas a usar Wireshark, delimitá la captura a tu equipo, protegé PCAP y anonimizá datos; nada de inspeccionar redes ajenas."
    ],
    "interpretation": [
      "Un PID puede desaparecer durante la consulta y ser reutilizado. Las diferencias de tabla no equivalen automáticamente a bytes enviados. Para saber cuánto tráfico pasó, necesitás contadores o captura con método definido; para saber el contenido, otra clase de evidencia y autorización.",
      "Un proceso puede abrir sockets por componentes de sistema, aplicaciones auxiliares o librerías. Revisá comando de inicio y origen del ejecutable sin atribuir a la empresa que figura en el DNS todo el intercambio observado."
    ],
    "conclusion": [
      "El aporte real para la privacidad es aprender el mapa del tráfico: aplicación, socket, destino, tiempo, método y grado de certeza. Así una afirmación sobre conexiones puede ser auditada por cualquiera sin caer en capturas interpretadas arbitrariamente.",
      "El usuario sabe cuándo la red prueba una conversación y cuándo no prueba el contenido. Esa distinción permite debatir privacidad sin vender miedo ni soluciones destructivas."
    ],
    "lab": {
      "title": "LAB 013 · DOS FOTOGRAFÍAS DE LA RED",
      "why": "Consulta sockets propios. No inspecciona contenido ni cambia firewall o DNS.",
      "code": "$one=Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Select-Object OwningProcess,RemoteAddress,RemotePort\nStart-Sleep -Seconds 5\n$two=Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Select-Object OwningProcess,RemoteAddress,RemotePort\n$two | Select-Object -First 20",
      "readout": "El ejemplo enseña a tomar dos observaciones; no calcula diferencia de tráfico. Relacioná los PID con procesos y documentá conexiones transitorias."
    },
    "insight": "La presencia de conexiones es normal; la atribución y el contenido exigen pruebas de distintas clases.",
    "challenge": "Analizá un socket propio y redactá tres afirmaciones que la tabla sí respalda y tres que no respalda.",
    "video": "Tu PC habla sola a Internet. Identificá su PID antes de acusarla.",
    "sources": [
      {
        "name": "Get-NetTCPConnection — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection"
      },
      {
        "name": "Datos requeridos de servicios conectados — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/privacy/required-service-data"
      },
      {
        "name": "Process Explorer — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      }
    ]
  },
  {
    "number": 14,
    "premise": [
      "Escena realista: copiás una contraseña para pegarla en una aplicación. Cerrás esa aplicación, comprobás que el historial Win+V está desactivado y suponés que la contraseña quedó fuera del alcance de cualquier otro programa. Esa conclusión puede ser equivocada. El dato que acabás de copiar está en un mecanismo de intercambio del sistema operativo, no necesariamente protegido por la ventana de origen.",
      "El misterio no es si Windows guarda un historial visible. Es si una aplicación local, ejecutándose en un contexto con acceso al portapapeles, puede obtener el texto actual sin que vos presiones pegar dentro de esa aplicación. Windows ofrece funciones de lectura del portapapeles y mecanismos para detectar sus cambios. Esa capacidad es legítima para editores, portapapeles extendidos y accesibilidad; también es una superficie de exposición si ejecutás software no confiable.",
      "Vamos a demostrar ese límite mediante un observador temporal que solo reconoce una frase inventada. La prueba NO busca contraseñas, NO registra otros contenidos, NO usa Internet y NO se instala ni permanece activo. Después investigaremos por separado el historial Win+V, elementos fijados, sincronización con otros equipos, acceso remoto y administradores de portapapeles de terceros.",
      "El premio para el lector es un mapa de amenazas que permite decidir qué controlar y qué no creer: un historial vacío no garantiza confidencialidad; un programa con acceso local no equivale a un sitio web; y un elemento sincronizado no se comporta necesariamente como una simple copia local."
    ],
    "mechanisms": [
      "CAPA 1 — El portapapeles actual. Cuando presionás Ctrl+C, la aplicación ofrece datos al sistema mediante formatos como texto Unicode, HTML o mapa de bits. La aplicación que pega pide un formato compatible. En la API Win32 se usan operaciones como OpenClipboard y GetClipboardData. Que el dato pueda cambiar de propietario o formato no significa que quede asociado exclusivamente al programa que lo copió. También existen mecanismos de renderizado diferido: la aplicación original puede generar algunos formatos solo cuando otro programa los solicita.",
      "CAPA 2 — Notificación de cambios. Windows expone GetClipboardSequenceNumber, que cambia cuando cambia el portapapeles bajo las condiciones documentadas, y AddClipboardFormatListener, que envía WM_CLIPBOARDUPDATE a ventanas registradas. Por lo tanto, una aplicación puede enterarse de que hubo un nuevo contenido sin esperar a que el usuario pegue en ella. Recibir la notificación y leer el dato son acciones diferentes, y los permisos y el contexto de ejecución importan.",
      "CAPA 3 — Historial Win+V. Es una función opcional de Windows que permite recuperar entradas anteriores. Según la documentación de Microsoft, su capacidad está limitada a 25 elementos, admite texto/HTML/bitmap con un máximo de 4 MB por elemento y descarta los más antiguos salvo que estén fijados. El historial normalmente se limpia al reiniciar, excepto los elementos fijados. Estos límites corresponden al HISTORIAL, no a un supuesto límite universal de todas las aplicaciones que utilizan el portapapeles actual.",
      "CAPA 4 — Sincronización. El historial puede ofrecer sincronización entre dispositivos cuando la edición, la cuenta y la configuración lo permiten. La opción de sincronizar automáticamente no equivale a compartir cada acción con todas las cuentas de la red. Si está desactivada, eso tampoco demuestra que ninguna otra aplicación tenga su propia nube. Una auditoría precisa distingue las funciones de Windows de OneDrive, gestores independientes y portapapeles integrados en aplicaciones.",
      "CAPA 5 — Acceso remoto. Algunas sesiones de Escritorio remoto permiten redirigir el portapapeles entre el equipo local y el remoto. Microsoft documenta políticas para permitir, bloquear o restringir esa redirección. La exposición potencial existe cuando la función está habilitada y la sesión está establecida; la mera instalación de un cliente remoto no demuestra que haya transferido un secreto.",
      "CAPA 6 — Navegadores. Una página web no dispone automáticamente de las mismas capacidades de una aplicación nativa. La API web Clipboard.readText se limita a contextos seguros y los navegadores implementan permisos, interacciones o avisos específicos. Firefox y navegadores Chromium no resuelven todas las solicitudes de lectura de la misma forma. No confundas una aplicación instalada con cualquier pestaña que visitás.",
      "CAPA 7 — Límites de la observación. Ni Get-Clipboard ni Win+V permiten reconstruir quién leyó antes un valor, saber si una aplicación guardó una copia privada o certificar que una contraseña nunca abandonó la máquina. Son instrumentos de observación de estado; una atribución de acceso malicioso necesitaría telemetría adicional, contexto del proceso y posiblemente análisis forense especializado."
    ],
    "traps": [
      "MITO 1: 'Si apago Win+V, nadie puede leer lo que copio'. Falso. Apagar una función de historial no elimina la API de intercambio de datos necesaria para Ctrl+C y Ctrl+V. Un programa que puede leer el portapapeles actual sigue pudiendo hacerlo bajo su contexto de seguridad. Nuestra prueba mostrará precisamente esa diferencia.",
      "MITO 2: 'El historial vacío demuestra que mi secreto fue borrado'. Falso. El historial visible solo muestra lo que esa función conserva en ese momento; no audita copias hechas por gestores de terceros, procesos que ya leyeron el dato ni sesiones remotas anteriores. Ausencia de entradas visibles no es evidencia universal de eliminación.",
      "MITO 3: 'Windows almacena absolutamente todo para siempre'. Tampoco. Win+V tiene límites de cantidad y tamaño y reglas de retención; aplicaciones pueden no publicar ciertos contenidos y existen programas que los limpian deliberadamente. Un inventario verdadero distingue retención actual, historial, fijados, nube y almacenamiento de terceros.",
      "MITO 4: 'Toda página web puede espiarme sin permiso'. La API web tiene restricciones de contexto y activación/permiso que difieren por navegador. Un sitio que intenta leer el portapapeles y una aplicación de escritorio con acceso local no son amenazas equivalentes. A la inversa, confiar en un sitio porque usa HTTPS no convierte el texto copiado en privado si se lo pegás voluntariamente.",
      "MITO 5: 'Borrar el historial recupera la seguridad de una contraseña ya expuesta'. Si un tercero obtuvo una copia, limpiar el portapapeles no revoca esa copia. La medida apropiada puede ser cambiar credenciales y revisar la aplicación o el dispositivo involucrado; borrar solo modifica el estado disponible en ese momento."
    ],
    "protocol": [
      "FASE A — Preparación segura. Cerrá gestores de portapapeles de terceros si pueden interferir, o anotá expresamente que estaban activos. Abrí Bloc de notas y dos terminales PowerShell locales bajo tu propia sesión. No utilices ninguna contraseña, correo, ruta privada ni información personal. Elegí el texto ficticio EVO-CLIP-LAB-014 y conservá ese mismo marcador para que el resultado sea comparable.",
      "FASE B — Demostración del secreto técnico. En la primera terminal poné en marcha el observador temporal del laboratorio principal. En el Bloc de notas escribí y copiá SOLO el marcador. Si la terminal informa 'DETECTADO', acabás de comprobar que otro proceso local leyó el contenido actual sin que presionaras pegar en su ventana. Que el proceso sea TU observador voluntario importa: demuestra una capacidad técnica, NO que una aplicación desconocida haya leído algo.",
      "FASE C — Diferencia entre presente e historial. Con el marcador aún en el portapapeles, presioná Win+V. Si el historial está activado, buscá el marcador. Si está desactivado, registrá ese estado; no hace falta habilitarlo. Repetí en la segunda terminal una consulta de igualdad con el marcador y comprobá que el portapapeles actual puede seguir accesible aunque Win+V no muestre historial. No cambies configuraciones solo para conseguir un resultado llamativo.",
      "FASE D — Sustitución. Copiá un segundo texto ficticio, EVO-CLIP-OTRO-015. Comprobá con la misma consulta que el valor actual cambió. Si el historial está activado, revisá si el primer marcador sigue en Win+V. Esta es la experiencia clave: sustituir el contenido ACTUAL no implica necesariamente eliminar las entradas del HISTORIAL.",
      "FASE E — Superficies adicionales sin exponer datos. En Configuración > Sistema > Portapapeles registrá si existen las opciones de historial y sincronización; no actives sincronización para experimentar. Si usás Escritorio remoto, consultá si la sesión autorizada tiene redirección de portapapeles. Si usás un gestor de terceros, anotá nombre, versión, retención y si sincroniza; no pegues ni exportes su contenido real.",
      "FASE F — Cierre. Detené el observador (se cierra automáticamente a los 20 segundos). Registrá solo respuestas Sí/No y las condiciones de la prueba. Reemplazá el marcador por otro valor ficticio si no querés dejarlo como contenido actual. Tené presente que reemplazar el contenido no borra necesariamente el historial ni las copias que pudiera haber realizado otra aplicación."
    ],
    "interpretation": [
      "RESULTADO A: el observador detecta el marcador y Win+V está desactivado. Conclusión válida: un proceso de TU sesión pudo leer el portapapeles actual sin que la función de historial estuviera activa. Conclusión inválida: 'Windows transmitió ese texto a Internet' o 'tengo malware'. No hubo ninguna lectura remota ni comunicación en la prueba.",
      "RESULTADO B: el observador no lo detecta. Posibles causas: expiró antes de que copiaras, el texto no coincidió exactamente, otra aplicación reemplazó el contenido, la sesión/ventana no era la esperada, o una lectura temporal falló. No sirve para demostrar que la lectura por otros procesos sea imposible. Repetí con más control antes de concluir.",
      "RESULTADO C: copiás un segundo marcador y el primero permanece en Win+V. Demuestra retención en el historial visible bajo esa configuración concreta. Si no permanece, no demuestra que ninguna aplicación lo haya conservado por otro medio. Documentá si la entrada estaba fijada; no deduzcas políticas de retención a partir de una sola captura.",
      "RESULTADO D: descubrís la sincronización habilitada. Eso identifica una posible vía adicional de circulación, no demuestra que un texto concreto se haya transmitido ni a qué dispositivo llegó. Para una atribución real necesitás configuración de cuenta, tipo de sincronización y, cuando sea legal y posible, observación de la acción o registros de servicio.",
      "RESULTADO E: encontrás redirección de portapapeles permitida en RDP. 'Permitida' y 'utilizada' son condiciones distintas. Sin sesión remota activa y sin transferencias observadas no podés concluir que hubo exposición. En entornos corporativos también pueden aplicar restricciones por dirección y tipo de contenido.",
      "RESULTADO F: desactivás historial o borrás entradas después de copiar un secreto real. La medida puede reducir retención visible futura, pero no protege retroactivamente una copia exfiltrada. La respuesta depende del riesgo: revisar extensiones y aplicaciones con privilegios, reducir gestores innecesarios, usar funciones de autocompletado del gestor de contraseñas y cambiar credenciales ante una exposición fundamentada."
    ],
    "conclusion": [
      "VEREDICTO EVO: el portapapeles es un canal de intercambio, no una caja fuerte. Windows necesita permitir que otra aplicación autorizada reciba lo copiado; precisamente por eso hay una frontera de confianza al depositar datos sensibles allí. El historial Win+V añade una segunda capa de conservación; sincronización y redirección pueden ampliar la superficie según su configuración; software de terceros añade políticas propias.",
      "El descubrimiento central es práctico: podés tener el historial apagado y aun así permitir, por diseño, que otra aplicación local lea el valor actual. El laboratorio te hace verificarlo con un marcador falso. Por sí solo no detecta espías ni audita accesos históricos, pero destruye una falsa sensación de protección.",
      "¿Qué se lleva el lector? Un protocolo repetible y seguro, un inventario de las cuatro superficies que debe revisar (actual, historial, sincronización/redirección y gestores), una tabla de qué evidencia sirve para cada afirmación y criterios para actuar sin instalar limpiadores dudosos ni introducir contraseñas reales en herramientas de diagnóstico.",
      "Regla para recordar: no copies al portapapeles aquello que no aceptarías compartir temporalmente con aplicaciones de tu sesión. Preferí el autocompletado integrado de un gestor confiable cuando esté disponible, comprobá las capacidades de borrado automático y nunca confundas vaciar la interfaz de Win+V con revocar accesos que ya ocurrieron. Lo que no podés medir, no lo presentes como certeza."
    ],
    "lab": {
      "title": "LAB 014 · ¿PUEDE OTRA VENTANA LEER LO QUE COPIASTE?",
      "why": "PRUEBA REAL CON MARCADOR FICTICIO. Abrí PowerShell en una ventana y Bloc de notas en otra. Ejecutá este observador; durante los 20 segundos siguientes, copiá exactamente EVO-CLIP-LAB-014 desde Bloc de notas. Solo informa coincidencia; jamás muestra contenidos ajenos, no guarda archivos ni transmite nada.",
      "code": "# SOLO PARA TU PC: detector temporal de un marcador FICTICIO.\n# No ejecuta cambios de Windows ni guarda el contenido copiado.\n$marker = 'EVO-CLIP-LAB-014'\n$detectado = $false\n$fin = (Get-Date).AddSeconds(20)\nWrite-Host 'Tenes 20 segundos para copiar el marcador desde Bloc de notas.'\nwhile ((Get-Date) -lt $fin) {\n  try {\n    $valor = Get-Clipboard -Raw -ErrorAction Stop\n    if ($valor -eq $marker) {\n      $detectado = $true\n      break\n    }\n  } catch {\n    # Una aplicacion puede tener el portapapeles ocupado brevemente.\n  }\n  Start-Sleep -Milliseconds 250\n}\nif ($detectado) {\n  Write-Host 'DETECTADO: esta ventana leyo el marcador sin pegarlo aqui.'\n} else {\n  Write-Host 'NO DETECTADO: repetí verificando tiempo y coincidencia.'\n}\nRemove-Variable valor -ErrorAction SilentlyContinue",
      "readout": "Si aparece DETECTADO, un proceso local controlado por vos leyó el texto actual. No probaste que haya malware, espionaje ni subida a la nube. NO DETECTADO no demuestra seguridad: puede ser un falso negativo por momento, contexto o formato. Get-Clipboard solo se usa con un marcador ficticio; nunca pegues valores personales."
    },
    "insight": "La desactivación de Win+V NO impide que programas locales autorizados lean el contenido ACTUAL del portapapeles. Historial, sincronización, RDP y gestores son superficies de exposición diferentes.",
    "challenge": "Repetí A: historial desactivado, B: historial activado solo si ya lo usás, C: segundo marcador. Entregá una tabla de Sí/No que distinga lectura local, retención visible y configuraciones de sincronización; no anotes contenidos sensibles.",
    "video": "Tu historial está apagado... ¿igual se puede leer lo que copiaste? Mirá este experimento: dos ventanas, un código inventado y una sorpresa que no aparece en Win+V.",
    "sources": [
      {
        "name": "Windows: usar el portapapeles, historial, 25 entradas y límites — Microsoft Support",
        "url": "https://support.microsoft.com/en-us/windows/apps/using-the-clipboard"
      },
      {
        "name": "Cómo funciona la API de lectura/escritura del portapapeles — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/win32/dataxchg/clipboard-operations"
      },
      {
        "name": "Notificaciones de cambios y GetClipboardSequenceNumber — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/win32/dataxchg/using-the-clipboard"
      },
      {
        "name": "Get-Clipboard PowerShell 5.1 — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-clipboard?view=powershell-5.1"
      },
      {
        "name": "Políticas de redirección del portapapeles RDP — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-admx-terminalserver"
      },
      {
        "name": "Permisos del portapapeles en navegadores — MDN",
        "url": "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API"
      }
    ],
    "caseStudy": {
      "title": "EL FALSO ALIVIO DE WIN+V DESACTIVADO",
      "classification": "SIMULACIÓN DIDÁCTICA · TODOS LOS PERSONAJES, HORARIOS Y RESULTADOS SON FICTICIOS",
      "scenario": "A las 11:02 una persona copia el texto ficticio EVO-CLIP-LAB-014 desde Bloc de notas. Win+V está desactivado. A las 11:03 otra aplicación local de prueba consulta el portapapeles y reconoce ese texto. A las 11:04 el usuario copia otro marcador; el anterior ya no es el contenido actual. Nadie inició sesión remotamente y la prueba no produjo tráfico de red.",
      "evidence": "Observación 1: la aplicación de prueba reconoce el marcador. Observación 2: no había historial Win+V habilitado. Observación 3: el portapapeles actual cambia al copiar otro texto. La evidencia ilustra lectura local del valor actual; no registra qué hicieron otras aplicaciones durante ese período.",
      "verdict": "La conclusión defendible es que Win+V desactivado no bloquea la lectura del portapapeles actual por el programa de prueba. No se puede concluir que hubo robo de credenciales ni que Windows envió el texto a Microsoft. Si el marcador hubiera sido una contraseña real, el problema habría sido la exposición temporal a software local no confiable."
    },
    "extraLabs": [
      {
        "title": "LAB 014.B · ¿HISTORIAL VACÍO SIGNIFICA CONTENIDO INACCESIBLE?",
        "goal": "Probar manualmente que Win+V y el portapapeles ACTUAL no son lo mismo, sin alterar preferencias para fabricar un resultado.",
        "steps": [
          "Dejá el marcador inventado como contenido actual copiándolo desde Bloc de notas.",
          "Abrí Win+V. Registrá si el historial está desactivado, vacío o si contiene el marcador. No actives ni desactives funciones solo por esta prueba.",
          "En otra terminal local ejecutá la comparación de igualdad que aparece debajo. El programa solo escribe VERIFICADO o NO COINCIDE.",
          "Copiá EVO-CLIP-OTRO-015. Volvé a comparar y, si el historial está disponible, observá si el primer marcador continúa visible."
        ],
        "code": "# Ejecutar SOLO después de copiar el marcador ficticio.\n$marker = 'EVO-CLIP-LAB-014'\n$actual = Get-Clipboard -Raw\nif ($actual -eq $marker) {\n  'VERIFICADO: el contenido actual coincide'\n} else {\n  'NO COINCIDE: contenido distinto, vacío o formato diferente'\n}\nRemove-Variable actual -ErrorAction SilentlyContinue",
        "expected": "Podés comprobar coincidencia incluso cuando Win+V está desactivado. Al copiar otro marcador, el contenido actual cambia; el historial, si existe, puede retener entradas anteriores.",
        "limitation": "Esta consulta puntual no informa sobre lecturas previas, otros procesos, datos sincronizados ni persistencia fuera de Win+V."
      },
      {
        "title": "LAB 014.C · AUDITORÍA DE SUPERFICIES SIN LEER SECRETOS",
        "goal": "Identificar configuraciones que agrandan o reducen el ámbito de exposición, sin extraer el contenido de ningún portapapeles.",
        "steps": [
          "Abrí Configuración > Sistema > Portapapeles y anotá el estado de historial y sincronización si esas opciones existen.",
          "Anotá si utilizás aplicaciones que conservan fragmentos copiados o sincronizan el portapapeles; buscá sus propias preferencias de retención.",
          "Si utilizás Escritorio remoto por necesidad real, comprobá en esa sesión autorizada si está habilitada la redirección del portapapeles; no crees conexiones nuevas.",
          "Marcá cada casillero como SÍ, NO o DESCONOCIDO. No copies ni fotografíes contenido real y no exportes el historial."
        ],
        "code": "",
        "expected": "Una matriz de riesgos por función. Una opción habilitada representa capacidad, no prueba de transferencia; una opción desactivada no bloquea necesariamente accesos por otras capas.",
        "limitation": "Revisión de configuración, no análisis de tráfico ni prueba de que un secreto se haya filtrado."
      }
    ],
    "evidenceMatrix": [
      {
        "question": "¿Puede mi proceso de prueba leer el contenido actual?",
        "proof": "Observador de marcador ficticio + ventana y momento",
        "limit": "No demuestra lecturas por desconocidos"
      },
      {
        "question": "¿El historial Win+V conserva el marcador?",
        "proof": "Visualización manual con Win+V, solo datos ficticios",
        "limit": "No representa gestores de terceros"
      },
      {
        "question": "¿Está permitida la sincronización?",
        "proof": "Configuración > Sistema > Portapapeles",
        "limit": "Habilitación no demuestra transferencia"
      },
      {
        "question": "¿El portapapeles puede pasar a una sesión RDP?",
        "proof": "Configuración/política y prueba autorizada con texto inventado",
        "limit": "Redirección permitida no implica utilizada"
      },
      {
        "question": "¿Se copió alguna vez una contraseña real?",
        "proof": "No hay prueba general posible con Win+V ni Get-Clipboard",
        "limit": "No inventar atribuciones ni reconstrucciones retrospectivas"
      }
    ],
    "deliverables": [
      "Tabla completa de cinco hipótesis con evidencia y limitación, apta para compartir sin divulgar datos.",
      "Diferenciación comprobada entre estado actual, historial, sincronización, RDP y software de terceros.",
      "Una demostración reproducible de lectura por otra ventana dentro de la propia sesión.",
      "Recomendaciones concretas basadas en contexto de uso, no promesas de limpieza total.",
      "Guion para video: mostrar Win+V desactivado y el detector que reconoce únicamente un marcador ficticio."
    ]
  },
  {
    "number": 15,
    "premise": [
      "Encontrás en Privacidad una opción para desactivar datos diagnósticos opcionales. Al hacerlo, algunos tutoriales aseguran que Windows deja de transmitir información; otros sostienen que la opción no cambia nada. Ambos extremos confunden conjuntos de datos distintos. Windows documenta categorías de información diagnóstica y datos requeridos para experiencias conectadas.",
      "El objetivo no es fabricar 'cero telemetría', sino comprender qué control cambia, cómo verificar su estado y qué comunicaciones podrían continuar legítimamente por las funciones que decidiste mantener habilitadas."
    ],
    "mechanisms": [
      "Microsoft distingue datos diagnósticos requeridos y opcionales; en varias ediciones Windows mantiene un mínimo necesario para seguridad y confiabilidad. También documenta datos de servicio asociados con experiencias conectadas como licencias o sincronizaciones. Estas categorías tienen objetivos y reglas distintas y pueden coexistir.",
      "Las políticas administrativas de organización pueden imponer opciones o bloquear la interfaz de usuario. La configuración y su interpretación deben vincularse a la versión y edición exactas. Un sistema desconectado de Internet puede dejar de enviar datos durante la prueba sin que eso signifique que cambió la política de diagnóstico."
    ],
    "traps": [
      "Una caída en el número de sockets después de cambiar un control no demuestra qué categorías de datos dejaron de enviarse. Las conexiones cambian de forma episódica y comparten proveedores. Tampoco un firewall restrictivo confirma que el sistema dejó de generar eventos diagnósticos localmente.",
      "Eliminar servicios relacionados con diagnóstico mediante scripts ajenos modifica el experimento, puede romper funciones y vuelve difícil atribuir consecuencias. Primero documentá el comportamiento de las opciones oficiales y sus efectos esperados."
    ],
    "protocol": [
      "Registrá edición y build. Revisá el estado de datos diagnósticos en Configuración > Privacidad y seguridad > Diagnóstico y comentarios; anotá los controles presentes y si alguna política los administra. No modifiques valores del Registro para representar un estado que la interfaz y directivas podrían contradecir.",
      "Compará documentación oficial de datos requeridos, opcionales y servicio conectado. Si analizás red, delimitá un período y medí por aplicación y función, no por cantidad global de paquetes. Separá los tres tipos de datos en el informe."
    ],
    "interpretation": [
      "Un equipo que continúa consultando servicios Microsoft con datos opcionales desactivados no prueba que la opción sea ficticia; puede ejecutar funciones que requieren servicio. La pregunta técnica es qué categoría y necesidad corresponden a cada comunicación.",
      "Las opciones pueden cambiar entre compilaciones y políticas empresariales. Es preferible un registro de configuración con fecha y edición que una captura viral sin contexto."
    ],
    "conclusion": [
      "El lector aprende a evaluar una afirmación de privacidad como una hipótesis específica: control → categoría de datos → función → observación. La respuesta puede ser incómoda o matizada, pero es verificable y no depende del temor.",
      "Lo que distingue a EVO LABS es reconocer un límite: observar una conexión no revela por sí solo el contenido diagnóstico transmitido. Una auditoría honesta debe decirlo."
    ],
    "lab": {
      "title": "LAB 015 · ESTADO DE DIAGNÓSTICO",
      "why": "Consulta una directiva clásica y datos de versión; no fuerza niveles ni deshabilita servicios.",
      "code": "Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber\nGet-ItemProperty 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection' -ErrorAction SilentlyContinue | Select-Object AllowTelemetry",
      "readout": "AllowTelemetry puede estar ausente, administrado o interpretarse distinto según edición. Nunca deduzcas el nivel final de solo ese valor: contrastá con Configuración y políticas."
    },
    "insight": "Datos opcionales, requeridos y de servicios conectados son categorías distintas con controles distintos.",
    "challenge": "Clasificá tres comunicaciones hipotéticas por categoría y verificá qué controla realmente la opción visible.",
    "video": "¿Desactivar telemetría significa cero conexiones? La documentación cuenta otra historia.",
    "sources": [
      {
        "name": "Diagnóstico opcional de Windows — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/privacy/optional-diagnostic-data"
      },
      {
        "name": "Datos requeridos de servicios conectados — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/privacy/required-service-data"
      },
      {
        "name": "Get-ItemProperty — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-itemproperty"
      }
    ]
  },
  {
    "number": 16,
    "premise": [
      "Una auditoría de privacidad falla cuando mezcla micrófono, historial de navegador, permisos de cámara, diagnósticos, cuentas y red en una única barra titulada 'índice de espionaje'. No existe una métrica universal de ese tipo. Sí existe un inventario auditable de superficies, funciones, permisos, datos y destinatarios potenciales.",
      "El trabajo final de este bloque ofrece un método para que cualquier lector revise su instalación sin depender de scripts desconocidos. No se trata de prometer anonimato absoluto sino de producir un mapa de riesgos y controles verificables."
    ],
    "mechanisms": [
      "Windows trata permisos de dispositivos, cuentas de usuario, aplicaciones empaquetadas, historial, diagnósticos y experiencias conectadas mediante componentes diferentes. Cada superficie tiene una vía de configuración, una fuente de observación y un límite. El tráfico de red no equivale a acceso físico a micrófono, y los eventos locales no prueban que se enviaran a Internet.",
      "La privacidad puede depender de una cuenta Microsoft, políticas organizativas, apps de terceros, navegador y hardware. El reporte debe registrar contexto y edición antes de comparar equipos distintos. Una opción no disponible puede ser legítima en ese dispositivo."
    ],
    "traps": [
      "'Desactivar todo' parece una conclusión contundente, pero confunde función con fuga y puede impedir seguridad o compatibilidad. También es erróneo asumir que una interfaz de Configuración enumera todas las formas de acceso posibles. Por eso no hay una sola captura que cierre el caso.",
      "Un riesgo se evalúa mediante probabilidad, impacto, exposición y control. Las listas virales de '100 servicios a desactivar' suelen eludir la pregunta de qué dato circulaba realmente."
    ],
    "protocol": [
      "Prepará una matriz con cinco columnas: superficie, función, permiso/política, observación y límite de certeza. Incluí micrófono, cámara, historial, diagnóstico, servicios conectados, red y apps de terceros. Cada fila debe enlazar con su configuración y una prueba segura.",
      "Tomá línea de base, registrá fecha, versión y estado. Contrastá una función a la vez: por ejemplo permiso de una app propia o uso de una opción opcional. Evitá alterar múltiples controles juntos porque perderías atribución. Si se ejecutan comandos, son solo consultivos."
    ],
    "interpretation": [
      "La matriz no etiqueta automáticamente algo como peligroso. Una app autorizada puede ser necesaria; una función opcional sin uso puede representar una superficie que preferís apagar mediante la interfaz oficial. Las conclusiones surgen de prioridades del usuario y evidencia, no de un número de sockets.",
      "Si aparece un acceso inesperado, documentá identidad, hora y contexto antes de adoptar una medida. En entornos empresariales, separá preferencias personales de políticas administradas; las responsabilidades son distintas."
    ],
    "conclusion": [
      "El resultado es una ficha de privacidad reutilizable: sabés qué se comunica, qué no se puede inferir, qué controles oficiales existen y qué riesgos aceptás. Es un producto práctico que vale más que una 'optimización extrema' imposible de auditar.",
      "El vídeo final de este bloque no enseña a cortar conexiones sin saber: enseña a construir una prueba que cualquier otra persona pueda repetir en su propia computadora."
    ],
    "lab": {
      "title": "LAB 016 · MATRIZ DE PRIVACIDAD",
      "why": "Crea un inventario manual basado en controles. Estos comandos solo muestran contexto y sockets.",
      "code": "Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber\nGet-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Select-Object -First 12 OwningProcess,RemoteAddress,RemotePort",
      "readout": "El inventario no expone contenido de red ni diagnostica acceso a cámara/micrófono. Documentá controles en Configuración para completar la matriz."
    },
    "insight": "El riesgo se describe por dato, función, permiso y evidencia; no existe un contador universal de 'espionaje'.",
    "challenge": "Construí una matriz de siete superficies y calificá para cada una qué sabés, qué ignorás y qué cambiarías desde controles oficiales.",
    "video": "El secreto de la privacidad no es apagar 100 servicios: es saber qué dato puede salir y por qué.",
    "sources": [
      {
        "name": "Datos requeridos de servicios conectados — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/privacy/required-service-data"
      },
      {
        "name": "Diagnóstico opcional de Windows — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/privacy/optional-diagnostic-data"
      },
      {
        "name": "Administración de Recall — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/client-management/manage-recall"
      },
      {
        "name": "Get-NetTCPConnection — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection"
      }
    ]
  },
  {
    "number": 17,
    "premise": [
      "¿Hay alguien dentro de tu PC? Es un título potente, pero un proceso raro, un ventilador activo o una conexión remota no prueban una intrusión. Un acceso no autorizado es una hipótesis de seguridad que necesita reconstruir identidad, autenticación, sesión, actividad y tiempo. La investigación comienza preservando evidencia, no desconectando componentes arbitrariamente.",
      "Muchos incidentes reales producen señales ambiguas: una cuenta que no reconocés, una app de asistencia remota, un inicio de sesión fuera de horario o una tarea persistente. Cada señal por separado admite explicaciones legítimas y requiere corroboración."
    ],
    "mechanisms": [
      "Windows autentica identidades y crea sesiones interactivas, de red, remotas o de servicio. Los eventos de seguridad registran distintas etapas y tipos de inicio de sesión cuando la auditoría está habilitada. Una conexión TCP y un inicio de sesión son hechos diferentes, que pueden o no estar relacionados.",
      "Las herramientas de asistencia remota y administración pueden instalar servicios y reglas de firewall legítimas. El contexto —quién autorizó, qué software, qué cuenta, desde dónde y a qué hora— determina si se trató de una operación esperada o una desviación."
    ],
    "traps": [
      "No uses el número de procesos como detector de espionaje. Una entrada de logon tipo 3 no prueba que un atacante abrió tu escritorio; puede representar autenticación de recursos de red. Los eventos 4624 y 4625 deben leerse junto a tipo de inicio, cuenta, paquete de autenticación y sistema origen cuando el registro contiene esos datos.",
      "Ante una sospecha real de intrusión, evitar modificaciones preserva rastros, pero también importa el riesgo inmediato. Si hay peligro activo, buscar ayuda profesional, aislar de forma consciente y documentar acciones tiene prioridad. No ejecutes herramientas desconocidas descargadas de foros."
    ],
    "protocol": [
      "Registrá hora aproximada de la anomalía. Consultá eventos de seguridad recientes si tus permisos lo permiten, enfocando la ventana temporal. Revisá usuarios locales y miembros de Administradores. Identificá sesiones y servicios remotos existentes sin habilitarlos.",
      "Correlacioná eventos de autenticación con cambios de cuentas, procesos y programas de asistencia remota. Registrá qué logs faltan por política o retención. Conservá copias protegidas del expediente y nunca publiques identificadores personales ni IP privadas completas."
    ],
    "interpretation": [
      "Una credencial válida que inicia sesión puede corresponder a una tarea, a un servicio o a un usuario. La etiqueta 'éxito' indica autenticación registrada, no legitimidad. Que no aparezcan eventos tampoco demuestra que no hubo acceso si la auditoría estaba deshabilitada.",
      "El nivel de certeza crece con evidencia independiente: cuenta, tipo de sesión, equipo origen, proceso relacionado y acción realizada. Si solo tenés un ventilador encendido, el resultado honesto es 'no probado'."
    ],
    "conclusion": [
      "El valor del expediente reside en aprender a distinguir indicio, corroboración y respuesta. Un acceso sospechoso no se diagnostica por dramatismo visual; se documenta con una línea de tiempo y evidencias contrastadas.",
      "El lector sale con un plan de cinco minutos para observar y otro de preservación para incidentes reales, sin acciones destructivas disfrazadas de 'limpieza'."
    ],
    "lab": {
      "title": "LAB 017 · PRIMERA MIRADA FORENSE",
      "why": "Consulta cuentas y eventos. El log Seguridad suele requerir permisos adecuados.",
      "code": "Get-LocalUser | Select-Object Name,Enabled,LastLogon\nGet-LocalGroupMember Administrators -ErrorAction SilentlyContinue | Select-Object Name,ObjectClass,PrincipalSource\nGet-WinEvent -FilterHashtable @{LogName='Security';Id=4624,4625;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 25 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,Message",
      "readout": "Interpretá el campo LogonType dentro de cada evento; ni 4624 ni 4625 bastan para concluir intrusión. Nunca publiques nombres reales o datos del origen sin anonimizar."
    },
    "insight": "Un inicio de sesión inesperado necesita tipo de sesión, cuenta y actividad asociada antes de hablar de atacante.",
    "challenge": "Identificá un evento real de autenticación o reconocé ausencia de datos y redactá qué pruebas adicionales solicitarías.",
    "video": "¿Hay alguien en tu PC? Buscá evidencia de sesión, no sombras detrás del escritorio.",
    "sources": [
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      },
      {
        "name": "Process Explorer — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      }
    ]
  }
];
