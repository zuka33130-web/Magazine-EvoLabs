import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Magazine Estrella · Privacidad II: investigaciones 065–075. Nunca se ejecuta código automáticamente. */
export const EVO_MAGAZINE_PRIVACY_B: EvoMagazineArticle[] = [
  {
    "id": 65,
    "goal": "Descubrir el historial del portapapeles sin exponer secretos personales.",
    "basics": "El portapapeles transporta datos entre programas. El historial puede conservar varias entradas cuando se habilita; copiar contraseñas, códigos o documentos sensibles requiere especial cuidado.",
    "steps": [
      {
        "title": "Abrí las opciones oficiales",
        "why": "Revisá si el historial y la sincronización están activados.",
        "code": "Start-Process 'ms-settings:clipboard'",
        "expect": "Se abrirá Configuración > Sistema > Portapapeles, si tu edición soporta la URI."
      },
      {
        "title": "Consultá una preferencia almacenada",
        "why": "El Registro puede incluir EnabledClipboardHistory según compilación y perfil; ausencia no significa que el portapapeles esté roto.",
        "code": "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Clipboard' -Name EnableClipboardHistory -ErrorAction SilentlyContinue | Select-Object EnableClipboardHistory",
        "expect": "Podés ver 0, 1 o ninguna fila. Priorizar el estado de Configuración."
      },
      {
        "title": "Hacé una prueba inocua",
        "why": "Copiá únicamente una frase inventada, presioná Win+V y observá el resultado sin capturar otros contenidos.",
        "code": "[pscustomobject]@{ Ejemplo='EVO LABS - solo prueba'; Hora=Get-Date }",
        "expect": "PowerShell solo muestra texto ficticio; no lee ni altera el portapapeles."
      }
    ],
    "tip": "Truco EVO: antes de compartir pantalla, revisá si Win+V revela contenido de otras aplicaciones.",
    "warning": "No ejecutes Get-Clipboard durante una auditoría pública: podrías exponer contraseñas o datos médicos.",
    "challenge": "Explicá qué diferencia existe entre copiar un texto, mantener historial y sincronizarlo entre equipos."
  },
  {
    "id": 66,
    "goal": "Separar funciones de escritura, diagnósticos y posibles capturas indebidas.",
    "basics": "La pregunta del título no presupone que Windows transmita cada pulsación. Algunas opciones de escritura y diagnóstico pueden enviar información opcional de entrada; eso no equivale a un keylogger universal.",
    "steps": [
      {
        "title": "Revisá diagnóstico y comentarios",
        "why": "Abrí los controles donde Windows explica datos necesarios y opcionales.",
        "code": "Start-Process 'ms-settings:privacy-feedback'",
        "expect": "Si la URI funciona en tu versión, aparecerán los controles de diagnósticos y comentarios."
      },
      {
        "title": "Identificá procesos de entrada",
        "why": "Los procesos de entrada de texto pueden existir incluso si no escribís.",
        "code": "Get-Process TextInputHost -ErrorAction SilentlyContinue | Select-Object Name,Id,CPU",
        "expect": "Puede haber uno, varios o ninguno. No demuestra que registre lo que escribís."
      },
      {
        "title": "Documentá ajustes de privacidad",
        "why": "Antes de cambiar nada, anotá qué opciones de personalización de escritura y entrada están disponibles.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber",
        "expect": "La edición importa porque los nombres y controles cambian entre versiones."
      }
    ],
    "tip": "Truco EVO: diferenciá la existencia de una función de dictado/corrección de la evidencia de transmisión de texto.",
    "warning": "Nunca escribas contraseñas reales ni datos sensibles durante pruebas de diagnóstico de entrada.",
    "challenge": "Escribí una afirmación que la configuración demuestre y otra que requiera analizar tráfico para confirmarse."
  },
  {
    "id": 67,
    "goal": "Investigar conexiones activas durante el reposo y cuándo pueden indicar acceso remoto.",
    "basics": "Una conexión TCP establecida puede haberse iniciado local o remotamente; el comando por sí solo no revela dirección de inicio. Lo correcto es observar también puertos a la escucha, servicios y autenticación.",
    "steps": [
      {
        "title": "Tomá una foto de conexiones",
        "why": "Consultá sesiones en curso antes de dejar el equipo en reposo.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 25 LocalAddress,LocalPort,RemoteAddress,RemotePort,OwningProcess",
        "expect": "Podés observar servicios, navegador y aplicaciones que sincronizan."
      },
      {
        "title": "Detectá servicios que escuchan",
        "why": "Un puerto en escucha requiere evaluar firewall e interfaz para conocer su exposición.",
        "code": "Get-NetTCPConnection -State Listen | Select-Object -First 20 LocalAddress,LocalPort,OwningProcess",
        "expect": "Verás puertos locales, no una prueba de acceso externo."
      },
      {
        "title": "Relacioná un PID con su proceso",
        "why": "Reemplazá 1234 por un identificador observado.",
        "code": "Get-Process -Id 1234 -ErrorAction SilentlyContinue | Select-Object Name,Id,Path",
        "expect": "Si el proceso ya terminó no aparecerá; documentá el instante de la consulta."
      }
    ],
    "tip": "Truco EVO: si sospechás un acceso real, correlacioná conexiones con eventos de autenticación y sesiones remotas.",
    "warning": "No desconectes componentes de seguridad ni compartas IPs de tus conexiones en capturas públicas.",
    "challenge": "¿Qué evidencia adicional distinguiría una conexión de actualización de una sesión remota no autorizada?"
  },
  {
    "id": 68,
    "goal": "Comprender la sincronización de archivos y qué depende de servicios en la nube.",
    "basics": "Sincronizar crea o actualiza copias en otros dispositivos o servidores según configuración. Un programa de sincronización activo no demuestra automáticamente que transfiera todos tus archivos.",
    "steps": [
      {
        "title": "Comprobá clientes de sincronización",
        "why": "Verificá si OneDrive está en ejecución; podés repetir para otro cliente que utilices.",
        "code": "Get-Process OneDrive -ErrorAction SilentlyContinue | Select-Object Name,Id,WorkingSet64",
        "expect": "La ausencia de proceso no demuestra que nunca haya sincronizado."
      },
      {
        "title": "Revisá carpetas conocidas",
        "why": "Comprobá si existe una ubicación local habitual de OneDrive.",
        "code": "Test-Path (Join-Path $env:USERPROFILE 'OneDrive')",
        "expect": "True o False; el nombre puede variar o depender de una organización."
      },
      {
        "title": "Consultá conexiones actuales",
        "why": "Enumerá las sesiones TCP del equipo antes de atribuirlas a un servicio.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 12 OwningProcess,RemoteAddress,RemotePort",
        "expect": "Sin correlacionar PID, usuario y configuración, no se sabe qué cliente las utiliza."
      }
    ],
    "tip": "Truco EVO: verificá selectivamente qué carpetas están incluidas en sincronización y su política de respaldo.",
    "warning": "No borres una carpeta sincronizada sin entender que el cambio podría propagarse a otros equipos.",
    "challenge": "Explicá la diferencia entre tener OneDrive instalado, iniciado, sincronizando y conservar copias en la nube."
  },
  {
    "id": 69,
    "goal": "Entender qué información del equipo puede conocer una aplicación autorizada.",
    "basics": "Las aplicaciones pueden consultar versión de sistema, hardware y algunos permisos según tecnología y privilegios. Conocer la información que Windows expone no demuestra que una aplicación la haya recopilado.",
    "steps": [
      {
        "title": "Inventariá datos del equipo",
        "why": "Estos datos son accesibles para el propio usuario y pueden exponerse a algunas apps.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory",
        "expect": "Verás fabricante, modelo y memoria total."
      },
      {
        "title": "Consultá Windows y compilación",
        "why": "El sistema expone información de compatibilidad que usan muchas aplicaciones.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber",
        "expect": "Obtendrás edición y versión reportadas."
      },
      {
        "title": "Revisá permisos de aplicaciones",
        "why": "Abrí la sección general de privacidad y explorá cámara, micrófono, ubicación y contactos según tu versión.",
        "code": "Start-Process 'ms-settings:privacy'",
        "expect": "Puede abrir el centro de privacidad, pero los controles concretos varían."
      }
    ],
    "tip": "Truco EVO: diferenciá dato disponible para el sistema, permiso concedido y evidencia real de recopilación.",
    "warning": "Nunca compartas números de serie, nombres de usuario o identificadores de dispositivo en una captura pública.",
    "challenge": "Clasificá tres datos del equipo según si requieren permiso especial o si el usuario puede consultarlos normalmente."
  },
  {
    "id": 70,
    "goal": "Examinar identificadores publicitarios y personalización sin prometer anonimato.",
    "basics": "Windows puede ofrecer una opción de identificador publicitario para experiencias de apps compatibles; otras aplicaciones y sitios tienen sus propios mecanismos de medición y seguimiento.",
    "steps": [
      {
        "title": "Abrí las opciones generales de privacidad",
        "why": "Revisá las opciones de publicidad y personalización disponibles.",
        "code": "Start-Process 'ms-settings:privacy-general'",
        "expect": "Si está disponible, aparecerán las opciones correspondientes."
      },
      {
        "title": "Consultá la configuración del usuario",
        "why": "La ubicación y nombre de la preferencia pueden variar según compilación.",
        "code": "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo' -ErrorAction SilentlyContinue | Select-Object Enabled",
        "expect": "Obtendrás un valor o ninguna fila; no confundas ausencia con anonimato."
      },
      {
        "title": "Anotá versión antes de comparar",
        "why": "Diferentes ediciones presentan controles distintos.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber",
        "expect": "La comparación solo es válida con contexto de edición y compilación."
      }
    ],
    "tip": "Truco EVO: desactivar una preferencia publicitaria no borra cookies de sitios ni elimina identificadores de otras plataformas.",
    "warning": "No descargues limpiadores de 'identidad digital' que afirman borrar todos los rastreadores con un clic.",
    "challenge": "Explicá por qué desactivar el identificador de Windows no significa volverte invisible en Internet."
  },
  {
    "id": 71,
    "goal": "Medir qué cambia al limitar diagnósticos opcionales de Windows.",
    "basics": "Windows distingue datos diagnósticos requeridos y opcionales; según documentación, los requeridos siguen existiendo en instalaciones convencionales. Tener un servicio detenido no prueba que ningún dato se transmita.",
    "steps": [
      {
        "title": "Revisá diagnósticos desde Windows",
        "why": "Abrí opciones oficiales de Diagnósticos y comentarios.",
        "code": "Start-Process 'ms-settings:privacy-feedback'",
        "expect": "Vas a encontrar controles y textos explicativos; algunas opciones pueden estar administradas."
      },
      {
        "title": "Consultá un servicio asociado",
        "why": "El servicio DiagTrack puede estar en ejecución, detenido o ausente.",
        "code": "Get-Service DiagTrack -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType",
        "expect": "Estado de servicio, no volumen ni contenido de diagnósticos."
      },
      {
        "title": "Contá conexiones activas como referencia",
        "why": "Es una línea base imperfecta; no mide bytes de telemetría.",
        "code": "Get-NetTCPConnection -State Established | Measure-Object | Select-Object Count",
        "expect": "Una cifra puede cambiar por múltiples razones ajenas a diagnósticos."
      }
    ],
    "tip": "Truco EVO: al comparar opciones, registrá cuál fue modificada, reinicios, fecha, edición y qué evidencia necesitás para confirmar su efecto.",
    "warning": "No deshabilites seguridad ni actualizaciones para perseguir una supuesta telemetría cero.",
    "challenge": "Explicá por qué medir menos conexiones no demuestra necesariamente que Windows envió menos datos diagnósticos."
  },
  {
    "id": 72,
    "goal": "Investigar qué conserva Windows cuando una aplicación se cierra inesperadamente.",
    "basics": "Windows Error Reporting puede recopilar información técnica para diagnosticar fallas. Según configuración y permisos, ciertos informes y volcados pueden contener fragmentos de estado del proceso.",
    "steps": [
      {
        "title": "Consultá carpetas de informes",
        "why": "Solo verificá si existe la ubicación habitual.",
        "code": "Test-Path (Join-Path $env:ProgramData 'Microsoft\\Windows\\WER')",
        "expect": "True o False, sin acceder a contenido sensible."
      },
      {
        "title": "Buscá cierres recientes de aplicaciones",
        "why": "Los eventos de aplicación son pistas, no pruebas concluyentes de la causa.",
        "code": "Get-WinEvent -LogName Application -MaxEvents 20 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,LevelDisplayName,ProviderName",
        "expect": "Podés ver eventos recientes, no necesariamente de cierre inesperado."
      },
      {
        "title": "Revisá diagnósticos opcionales",
        "why": "Leé la descripción de tipos de informes que Windows puede recopilar.",
        "code": "Start-Process 'ms-settings:privacy-feedback'",
        "expect": "La configuración explica opciones dependientes de la edición y el usuario."
      }
    ],
    "tip": "Truco EVO: para un caso de falla, anotá nombre del proceso, versión, hora y mensaje antes de revisar los informes.",
    "warning": "Los volcados pueden contener datos privados; nunca los publiques completos sin autorización y revisión.",
    "challenge": "Explicá la diferencia entre una falla registrada localmente y un informe enviado a un servicio remoto."
  },
  {
    "id": 73,
    "goal": "Comprender por qué eliminar un archivo no equivale siempre a destruir todos sus rastros.",
    "basics": "La Papelera guarda algunos archivos borrados; copias de respaldo, sincronización y metadatos pueden conservar información. En SSD con TRIM la recuperación puede ser imposible incluso poco después.",
    "steps": [
      {
        "title": "Abrí la Papelera",
        "why": "Inspeccioná archivos de prueba propios sin eliminarlos permanentemente.",
        "code": "Start-Process explorer.exe -ArgumentList 'shell:RecycleBinFolder'",
        "expect": "Se abre la Papelera si la URI funciona en tu versión de Windows."
      },
      {
        "title": "Consultá el tipo de almacenamiento",
        "why": "Detectá los discos sin ejecutar operaciones de borrado.",
        "code": "Get-PhysicalDisk | Select-Object FriendlyName,MediaType,HealthStatus",
        "expect": "Puede informarse SSD, HDD o Unspecified según controlador."
      },
      {
        "title": "Identificá copias disponibles",
        "why": "Revisá volúmenes, sin modificar protección ni ejecutar herramientas de recuperación invasivas.",
        "code": "Get-Volume | Select-Object DriveLetter,FileSystem,SizeRemaining",
        "expect": "Verás unidades disponibles; no demuestra qué copias de seguridad contienen tus archivos."
      }
    ],
    "tip": "Truco EVO: para una prueba de recuperación, trabajá sobre un archivo ficticio y una copia en un medio de pruebas, no sobre datos valiosos.",
    "warning": "No ejecutes borrado seguro, formateo ni escritura masiva sobre un disco del que necesitás recuperar archivos.",
    "challenge": "Explicá cómo se diferencian eliminar, mover a Papelera, restaurar desde copia y recuperación forense."
  },
  {
    "id": 74,
    "goal": "Crear una configuración de Windows más privada sin perder seguridad ni funcionalidad.",
    "basics": "La privacidad es un equilibrio entre permisos, cuentas, sincronización, diagnósticos y software. No existe un único botón para desactivar toda recopilación ni se mejora la seguridad desactivando protecciones.",
    "steps": [
      {
        "title": "Revisá controles de privacidad",
        "why": "Explorá Ubicación, Diagnósticos, Micrófono y Cámara, sin cambiar todo de golpe.",
        "code": "Start-Process 'ms-settings:privacy'",
        "expect": "Se abrirá la sección disponible en tu versión; registrá qué opciones existen."
      },
      {
        "title": "Consultá estado del firewall",
        "why": "Anotá si están habilitados sus perfiles.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction",
        "expect": "El firewall debería permanecer habilitado en las redes que utilices."
      },
      {
        "title": "Investigá inicios automáticos",
        "why": "Identificá programas opcionales antes de deshabilitar alguno.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object Name,Location,Command",
        "expect": "Aparecerá un inventario parcial, que no reemplaza revisar tareas o servicios."
      }
    ],
    "tip": "Truco EVO: priorizá revocar permisos innecesarios de apps, revisar cuentas y respaldos antes que desactivar servicios del sistema.",
    "warning": "Nunca debilites actualizaciones o protección antimalware para conseguir una cifra menor de consumo.",
    "challenge": "Diseñá un perfil de privacidad donde expliques cada preferencia, qué mejora y qué función podría perderse."
  },
  {
    "id": 75,
    "goal": "Construir un expediente de privacidad de Windows con evidencias y límites claros.",
    "basics": "Una auditoría seria no empieza preguntando '¿me espían?' sino documentando qué opciones, procesos y comunicaciones existen. Las conclusiones deben distinguir observación, hipótesis y prueba.",
    "steps": [
      {
        "title": "Construí un inventario inicial",
        "why": "Recopilá edición, fecha y configuración general.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,LastBootUpTime",
        "expect": "Tendrás información contextual para interpretar otros resultados."
      },
      {
        "title": "Revisá componentes de seguridad y comunicaciones",
        "why": "Registrá perfiles de firewall sin cambiarlos.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction",
        "expect": "Son políticas generales, no un certificado de invulnerabilidad."
      },
      {
        "title": "Documentá actividad de red actual",
        "why": "Tomá un registro temporal de los destinos y procesos TCP de tu equipo.",
        "code": "Get-NetTCPConnection -State Established | Select-Object -First 20 OwningProcess,RemoteAddress,RemotePort",
        "expect": "La lista puede cambiar rápidamente y no permite atribuir contenido por sí sola."
      }
    ],
    "tip": "Truco EVO: clasificá cada hallazgo en VERIFICADO, POSIBLE o SIN EVIDENCIA. Documentá fecha y método.",
    "warning": "Guardá los informes localmente y ocultá datos privados antes de compartirlos; no intentes inspeccionar dispositivos ajenos.",
    "challenge": "Prepará un mini expediente con cinco observaciones reales, tres dudas y dos acciones de privacidad reversibles."
  }
];
