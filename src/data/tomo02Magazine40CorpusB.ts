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
      "Copiás una contraseña, una dirección o un párrafo y lo pegás después. Ese mecanismo práctico puede representar una superficie de exposición si compartís equipo, habilitás historial o sincronización, o dejás información sensible en el portapapeles. Pero afirmar que Windows conserva indefinidamente todo lo copiado es falso: el comportamiento cambia según configuración y tipo de contenido.",
      "El experimento enseña a diferenciar portapapeles actual, historial opcional, sincronización entre dispositivos y gestores de terceros. Se realizará con texto ficticio, porque una auditoría de privacidad no debe multiplicar secretos reales."
    ],
    "mechanisms": [
      "La API del portapapeles permite a aplicaciones intercambiar texto e imágenes en el contexto de usuario. Windows puede ofrecer historial accesible por Win+V y sincronización, si están disponibles y habilitados. Los gestores de portapapeles de terceros pueden aplicar reglas y retenciones diferentes.",
      "Algunas aplicaciones limpian el portapapeles tras copiar contraseñas, otras no. La protección de contenido depende de la propia aplicación, la sesión, controles empresariales y el gestor seleccionado; no se resuelve mirando si una configuración está marcada como activada."
    ],
    "traps": [
      "Que Win+V muestre entradas no implica que todo lo que alguna vez copiaste esté allí. Que aparezca vacío tampoco garantiza que nunca existiera dato sensible en memoria de otros procesos o gestores. El alcance de la prueba es la interfaz de historial disponible.",
      "Copiar contraseñas reales para probar el historial es un mal diseño experimental. Nunca pegues ni exportes tu portapapeles a una herramienta de terceros durante una revisión de seguridad; la prueba usa un marcador ficticio sin valor personal."
    ],
    "protocol": [
      "Usá un texto inventado, por ejemplo 'EVO-PRUEBA-CLIP-001', copialo y pegalo en un editor local. Presioná Win+V y observá si el historial está disponible y habilitado. Documentá qué aparece y cómo cambian los resultados si el historial está desactivado, sin modificar funciones innecesariamente.",
      "Revisá Configuración > Sistema > Portapapeles. Registrá el estado de historial y sincronización si existe en tu edición. Comprobá también si hay gestores de portapapeles instalados; cada uno tiene políticas de persistencia independientes."
    ],
    "interpretation": [
      "El portapapeles actual y el historial tienen comportamientos distintos. Una entrada visible confirma retención en ese contexto; una entrada no visible no es prueba universal de eliminación segura. La sincronización exige analizar la configuración de cuenta y la función asociada.",
      "Un resultado útil incluye versión de Windows, estado de la función, texto de prueba, hora, observación y limitación. Los secretos y datos reales quedan fuera del experimento."
    ],
    "conclusion": [
      "Ahora el lector entiende por qué copiar algo sensible merece precaución, especialmente en un equipo compartido. Puede gestionar la superficie de exposición desde controles explícitos en lugar de recurrir a 'limpiadores de privacidad' sin transparencia.",
      "La lección aplicable es sencilla: no uses el portapapeles como almacén de secretos, comprobá si hay historial y respetá el contexto de sincronización."
    ],
    "lab": {
      "title": "LAB 014 · PORTAPAPELES CON DATOS FICTICIOS",
      "why": "Experimento manual con marcador inventado. No extrae ni publica contenidos personales.",
      "code": "# El experimento principal se hace con Win+V y Configuración > Sistema > Portapapeles.\n# Solo consultamos contexto del sistema:\nGet-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber",
      "readout": "No uses Get-Clipboard ni capturas del historial si contiene secretos: ese dato puede terminar en una transcripción o screenshot."
    },
    "insight": "El historial opcional no equivale al portapapeles actual ni a los gestores de terceros.",
    "challenge": "Copiá una frase ficticia, comprobá Win+V y dejá registrado si la función está habilitada.",
    "video": "Copiás una contraseña... ¿quién la puede pegar después? Probalo con texto falso.",
    "sources": [
      {
        "name": "Get-ItemProperty — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-itemproperty"
      },
      {
        "name": "Datos requeridos de servicios conectados — Microsoft",
        "url": "https://learn.microsoft.com/en-us/windows/privacy/required-service-data"
      }
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
