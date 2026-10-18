import type { EvoWindowsResearch } from './tomo02Magazine40CorpusTypes';
/** Bloque I y primer expediente de privacidad · 002–009. */
export const EVO_WINDOWS40_CORPUS_A: EvoWindowsResearch[] = [
  {
    "number": 2,
    "premise": [
      "Abrís el Administrador de tareas y encontrás más de cien procesos. El número parece desproporcionado frente a las tres aplicaciones que tenés abiertas. Sin embargo, ese contador mezcla aplicaciones visibles, servicios, auxiliares de navegadores, procesos protegidos, controladores de interfaces y tareas aisladas por seguridad. La cantidad es un inventario; el consumo real es una medición de recursos en el tiempo.",
      "En Windows moderno una misma aplicación puede distribuir interfaz, red, decodificación, extensiones y renderizado en procesos diferentes. Ese aislamiento permite que una falla no derribe todo el programa. El desafío no es conseguir diez procesos, sino identificar cuáles hacen trabajo sostenido, cuáles están esperando y quién es propietario de cada ejecución."
    ],
    "mechanisms": [
      "Un proceso posee un espacio de direcciones virtuales, tablas de identificadores, token de seguridad y uno o varios hilos. El planificador ejecuta hilos, no 'ventanas'. Un proceso puede tener memoria residente, cero uso observable de CPU y varios hilos bloqueados esperando eventos. Los recuentos de hilos, identificadores y conexiones dan pistas distintas.",
      "El árbol padre-hijo ayuda a reconstruir qué aplicación lanzó a otra, pero el proceso padre puede haber terminado y un PID puede reciclarse. Para vincular procesos con precisión se combina nombre, PID, hora de creación, ruta, firmante y contexto. Los servicios pueden aparecer como procesos independientes o alojados en svchost; el comportamiento depende de versión, recursos y configuración."
    ],
    "traps": [
      "La columna CPU de Get-Process contiene segundos acumulados desde el inicio; ordenar por ese dato no revela quién está consumiendo más CPU justo ahora. Y sumar Working Sets de procesos no calcula la RAM física del sistema: las páginas compartidas pueden contarse repetidas veces. 'Muchos procesos' y 'poca memoria libre' no son diagnósticos.",
      "Que un proceso tenga nombre familiar no acredita su legitimidad. Tampoco la ausencia de un icono implica clandestinidad. El sistema aísla componentes con nombres genéricos, y un atacante puede imitar un ejecutable conocido. Una conclusión exige consultar ruta, firma, parentesco y actividad en un intervalo definido."
    ],
    "protocol": [
      "Tomá primero una línea de base tras iniciar sesión y esperar que termine el trabajo de arranque. Anotá cantidad de procesos, diez principales consumidores de memoria privada y servicios activos. Repetí diez minutos después en las mismas condiciones, sin modificar nada. Lo interesante es el cambio, no competir por el número mínimo.",
      "Separá inventario y actividad: una lista de procesos muestra presencia, mientras dos muestras de CPU por PID permiten estimar uso medio. Si hallás uno persistente, inspeccioná ruta y hora de creación con Win32_Process. Para atribuir actividad fina de archivos o registro a un proceso, Process Monitor ofrece eventos con filtros; documentá la captura para no confundir ruido con causalidad."
    ],
    "interpretation": [
      "Si el número aumenta al abrir un navegador y retorna al cerrarlo, puede tratarse de arquitectura multiproceso normal. Si persiste una carga elevada, correlacioná el PID con tiempo de CPU creciente, disco, red y tareas. Si cambia el PID entre muestras, el cálculo debe descartarse; la identidad temporal importa.",
      "Un servicio dentro de svchost no necesariamente consume todos los recursos de ese proceso. Diferenciar carga del contenedor y del servicio puede requerir trazas o instrumentación adicional. Hay conclusiones que el Administrador de tareas por sí solo no puede justificar."
    ],
    "conclusion": [
      "La pregunta profesional deja de ser '¿cuántos procesos sobran?' y pasa a ser '¿qué ejecutable consume qué recurso, durante cuánto tiempo y por qué?'. Un proceso ocioso puede tener coste de memoria; eliminar uno activo puede interrumpir audio, entrada, seguridad o impresión. La optimización empieza con una atribución comprobable.",
      "Este expediente permite crear un mapa propio: nombre, PID, ruta, memoria privada, tiempo de CPU, servicio asociado y origen de inicio. Es más valioso que cualquier cifra universal de 'procesos ideales', porque se adapta a las funciones que realmente utilizás."
    ],
    "lab": {
      "title": "LAB 002 · INVENTARIO SIN CERRAR PROCESOS",
      "why": "Crea una instantánea consultiva y distingue procesos de servicios. Ejecutalo en PowerShell; no se modifica el sistema.",
      "code": "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 15 Name,Id,CPU,Handles,@{N='WS_MB';E={[math]::Round($_.WorkingSet64/1MB,1)}}\nGet-CimInstance Win32_Service | Where-Object ProcessId -gt 0 | Select-Object Name,State,ProcessId | Sort-Object ProcessId",
      "readout": "La CPU es acumulada y el Working Set incluye compartidos. Cruzá ProcessId de servicio con Id de proceso; no deduzcas consumo individual del servicio."
    },
    "insight": "El número de procesos mide arquitectura y aislamiento; el problema se demuestra mediante actividad y efecto verificable.",
    "challenge": "Compará el inventario antes y después de abrir una aplicación multiproceso. Explicá cada nueva familia de procesos sin suspender ninguno.",
    "video": "¿Tenés cien procesos? No desinstales nada: mostrá qué hace uno y vas a entender diez más.",
    "sources": [
      {
        "name": "Process Explorer — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      },
      {
        "name": "Get-Process — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      }
    ]
  },
  {
    "number": 3,
    "premise": [
      "Varias instancias de svchost.exe aparecen aunque solo tengas una aplicación abierta. En redes sociales ese nombre suele presentarse como 'los servicios que te espían'. En realidad, Service Host es un contenedor para servicios implementados con bibliotecas u otros componentes del sistema. La coincidencia de nombre no describe el trabajo ni la procedencia.",
      "La investigación útil consiste en identificar qué servicio corresponde a cada PID, qué cuenta lo ejecuta, cuál es su binario y si la actividad coincide con el síntoma. El lector debe aprender a distinguir una instancia legítima de un nombre copiado con mala intención, sin deshabilitar servicios al azar."
    ],
    "mechanisms": [
      "El Service Control Manager administra la configuración, arranque, dependencias y estado de servicios. Algunos ejecutan su propio proceso; otros se alojan en grupos o instancias svchost. Windows ha ido separando servicios para mejorar el aislamiento en equipos con determinados recursos: no hay un número de svchost correcto para todas las instalaciones.",
      "Un mismo PID de svchost puede albergar uno o varios servicios. El nombre del proceso describe al host, no necesariamente al servicio responsable de cada operación. Para atribución fina, hay que correlacionar nombre del servicio, módulo, eventos y recursos observados en el período de interés."
    ],
    "traps": [
      "No confundas 'Automático' con 'consumo constante'. Un servicio puede arrancar y quedar esperando un evento. Del mismo modo 'Manual' no significa inútil: Windows puede iniciarlo por desencadenadores específicos. Desactivar algo porque tiene un nombre extraño no demuestra una mejora y puede degradar funciones que ni siquiera asociás con ese servicio.",
      "Un malware puede usar un ejecutable llamado svchost.exe fuera de la ruta esperada, pero una ruta aparentemente legítima no basta como prueba de seguridad. Mirá firma digital, comando de inicio, cuenta de ejecución y persistencia. No ejecutés ni borres sospechosos durante la auditoría inicial."
    ],
    "protocol": [
      "Registrá todas las instancias de svchost y los servicios asociados; en cada fila anotá PID, ruta completa, estado y nombre de servicio. Repetí el inventario después de abrir una función que sabés que requiere servicios, como impresión o conectividad. Documentá si aparece una instancia nueva sin asumir que sea anómala.",
      "Si el problema es CPU o disco, encontrá el PID que exhibe carga durante varios intervalos. Después mapeá los servicios hospedados allí, pero reconocé el límite: un host compartido puede ejecutar varios servicios. Para localizar el causante exacto, cruzá eventos y capturas específicas."
    ],
    "interpretation": [
      "La salida de tasklist /svc o Win32_Service puede revelar uno o muchos servicios por PID. No es un detector de malware. La hora de inicio, cuenta, ubicación y firma contextualizan la identidad; la carga se prueba con una ventana de medición.",
      "Un host sin servicios visibles en una consulta puntual requiere revisión, no sentencia inmediata: hay procesos que cambian, herramientas con permisos distintos y servicios que terminan mientras consultás."
    ],
    "conclusion": [
      "A partir de ahora svchost.exe deja de ser un enemigo misterioso: es una pista de arquitectura. El diagnóstico pregunta qué servicio o módulo se ejecuta, quién lo autorizó, cuándo trabaja y qué recurso utiliza. Con esos datos podés separar mantenimiento legítimo, configuración inadecuada y comportamiento realmente inexplicable.",
      "Un Windows estable importa más que una lista 'limpia' de servicios. Si no sabés qué dependencia rompería un cambio, todavía no hay fundamento para hacerlo."
    ],
    "lab": {
      "title": "LAB 003 · IDENTIDAD DEL HOST",
      "why": "Inventariá la correspondencia host-servicio sin detener ningún servicio.",
      "code": "Get-CimInstance Win32_Process -Filter \"Name='svchost.exe'\" | Select-Object ProcessId,ParentProcessId,ExecutablePath,CommandLine\nGet-CimInstance Win32_Service | Where-Object { $_.ProcessId -gt 0 } | Sort-Object ProcessId | Select-Object ProcessId,Name,DisplayName,State,StartMode",
      "readout": "Relacioná ProcessId entre ambas consultas. Un host puede alojar múltiples servicios; la correspondencia no asigna uso individual de CPU."
    },
    "insight": "svchost es un contenedor. Su presencia no prueba riesgo, y un PID aislado no revela todo lo que ejecuta.",
    "challenge": "Encontrá una instancia svchost real, verificá servicios asociados y explicá si el modo de inicio demuestra actividad actual.",
    "video": "Muchos svchost no significan espionaje. Mostrá la tabla PID-servicio antes de tocar nada.",
    "sources": [
      {
        "name": "Get-Service — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-service"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      },
      {
        "name": "Process Explorer — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      }
    ]
  },
  {
    "number": 4,
    "premise": [
      "Apagás la pantalla, volvés después de comer y la máquina lleva varios minutos escribiendo en disco. Parece que el equipo 'decidió hacer cosas solo'. Muchas de esas operaciones provienen de tareas programadas: comprobaciones, mantenimiento, sincronizaciones o actualizaciones de componentes. Otras proceden de servicios bajo demanda; no todo trabajo de fondo está en el Programador.",
      "La investigación no persigue una lista de tareas para borrar. Busca responder tres preguntas: qué tarea está definida, qué desencadenó su ejecución y qué actividad verificable produjo. La cronología sirve mucho más que el nombre alarmante de una entrada."
    ],
    "mechanisms": [
      "El Programador de tareas maneja desencadenadores por horario, inicio de sesión, evento, arranque o estado de inactividad y condiciones de red y energía. Una tarea puede retrasarse, perder una ejecución o arrancar solo cuando determinadas condiciones se cumplen. El código de resultado es información contextual, no una traducción automática a 'peligro'.",
      "Algunas tareas corren con cuentas de servicio y con privilegios diferentes del usuario interactivo. Pueden ejecutar procesos breves que desaparecen antes de abrir el Administrador de tareas. Para observarlos se combinan historial del Programador, registro de eventos, hora de inicio y mediciones de recursos."
    ],
    "traps": [
      "Una tarea 'Ready' significa preparada, no que se ejecutó ahora. 'Última ejecución' puede reflejar una operación antigua y el historial puede estar deshabilitado. Tampoco un pico de disco simultáneo demuestra que la tarea lo provocó: podría existir una actualización o una aplicación ajena en el mismo instante.",
      "Eliminar tareas para 'acelerar' Windows rompe la trazabilidad de la prueba y puede impedir mantenimiento o restauración. Antes de cambiar una tarea, se requiere comprender su origen, dependencias, efecto esperado y método de retorno seguro."
    ],
    "protocol": [
      "Elegí tres tareas visibles: una de mantenimiento, una ligada a una aplicación y una creada por el propio sistema si está presente. Anotá nombre completo y ruta, estado, desencadenadores y datos de ejecución. Guardá los resultados con fecha y zona horaria. En la segunda muestra, observá qué registros variaron y si cambió la actividad de CPU o disco.",
      "Para una causa específica, buscá el historial operacional de TaskScheduler junto con un intervalo de medición. La evidencia se fortalece cuando coinciden tarea, hora, proceso lanzado y operación, no cuando aparece solo una coincidencia temporal."
    ],
    "interpretation": [
      "Si no hay eventos de historial, anotá 'sin evidencia disponible', no 'nunca se ejecutó'. Un resultado de tarea exitoso tampoco demuestra que realizó el mantenimiento que imaginabas: solo describe el resultado informado al servicio de programación.",
      "Una tarea que aparece en una tabla y otra que efectivamente produjo CPU son dos hechos distintos. La secuencia de eventos, bajo el mismo reloj y condiciones, permite acercarte a causalidad."
    ],
    "conclusion": [
      "El lector termina con un pequeño expediente cronológico: definición → desencadenador → estado → ejecución → resultado → recurso. Ese orden evita buena parte de los mitos sobre actividad nocturna y permite presentar un hallazgo sin inventar comportamientos secretos.",
      "Si la tarea cambia por actualizaciones o por políticas del equipo, conservá ambas versiones del inventario. La comparación forma parte de la documentación, no un error."
    ],
    "lab": {
      "title": "LAB 004 · HISTORIAL DE TAREAS",
      "why": "Consulta definiciones y últimas ejecuciones en modo lectura.",
      "code": "Get-ScheduledTask | Select-Object -First 20 TaskPath,TaskName,State\n$task = Get-ScheduledTask | Select-Object -First 1\nif ($task) { $task | Get-ScheduledTaskInfo | Select-Object LastRunTime,LastTaskResult,NextRunTime }",
      "readout": "Que una tarea exista no garantiza que se ejecutó. Las fechas y estados requieren contexto y el historial operacional puede estar deshabilitado."
    },
    "insight": "El problema no es que Windows trabaje sin ventanas; es concluir un origen sin reconstruir el desencadenador.",
    "challenge": "Elegí una tarea, documentá su historial y relacioná —o descartá— una ventana concreta de actividad; no cambies su configuración.",
    "video": "Tu PC trabaja cuando dormís, pero ¿podés demostrar qué tarea lo despertó?",
    "sources": [
      {
        "name": "Get-ScheduledTask — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/get-scheduledtask"
      },
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      },
      {
        "name": "Process Monitor — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon"
      }
    ]
  },
  {
    "number": 5,
    "premise": [
      "Antes de que aparezca el fondo de pantalla, Windows ya ejecutó una cadena delicada de decisiones de firmware, disco, arranque y kernel. Ver el logotipo de Windows no significa que todo el arranque esté bajo control de Windows; parte ocurrió antes de que el sistema operativo tome el control. Esta distinción explica por qué algunos errores exigen herramientas de firmware y otros corresponden al sistema.",
      "El objetivo del expediente es hacer visible la secuencia sin intervenir particiones ni modificar BCD. La curiosidad debe terminar en un mapa verificable de fases de arranque y en un protocolo para ubicar un retraso por segmento."
    ],
    "mechanisms": [
      "En un arranque UEFI común, el firmware inicializa hardware y busca una entrada de arranque. Windows Boot Manager, normalmente bootmgfw.efi, emplea el almacén BCD para elegir la configuración; Winload.efi prepara la carga del kernel y controladores necesarios. Después aparecen inicialización del sistema, sesiones, servicios y logon. La estructura exacta puede variar según plataforma y protección.",
      "Fast Startup puede combinar cierre de sesión con hibernación de kernel, por lo que apagar y encender no siempre equivale a reiniciar. Los tiempos observados dependen también del firmware, unidad de almacenamiento, controladores, servicios y aplicaciones de inicio, no solo del 'peso' de Windows."
    ],
    "traps": [
      "Ver una partición EFI pequeña no significa que sea basura. Borrarla o formatearla puede dejar el equipo sin ruta de arranque. Ejecutar bcdedit sin parámetros consulta configuración; modificar entradas sin copia y plan de recuperación es otra clase de operación, fuera de este laboratorio.",
      "Una mejora de 'inicio' informada por una app puede excluir POST del firmware o medir hasta la pantalla de inicio en vez de hasta escritorio utilizable. Sin definir hitos temporales, dos cifras no son comparables."
    ],
    "protocol": [
      "Leé información del firmware y los eventos de diagnóstico de arranque si el canal está disponible. Registrá si el inicio fue reinicio completo, encendido tras apagado, reanudación o inicio híbrido. Medí varias repeticiones del mismo tipo, sin deshabilitar servicios.",
      "Si los tiempos cambian, primero detectá la fase: antes del logo puede implicar firmware; después del gestor de arranque puede involucrar kernel, controlador o servicio; después del inicio de sesión aparecen aplicaciones del usuario. Esta es una clasificación orientativa, no diagnóstico definitivo."
    ],
    "interpretation": [
      "Un evento de inicio lento no especifica por sí solo qué archivo es culpable. Los proveedores de diagnóstico pueden estar deshabilitados y los IDs variar entre versiones. Reconocé esa ausencia y complementá con Visor de eventos o una traza de arranque controlada.",
      "Si el firmware tarda más que el sistema, una limpieza de servicios Windows no puede solucionar esa porción. Si la espera aparece tras iniciar sesión, optimizar el BCD suele ser una respuesta equivocada."
    ],
    "conclusion": [
      "Ahora podés explicar qué ocurre entre el botón de encendido y el escritorio, sin reducir todo a 'Windows está lento'. Separar POST, gestor, cargador, kernel, sesión y aplicaciones guía la siguiente prueba y protege datos de ajustes innecesarios.",
      "Un buen laboratorio de arranque no modifica particiones ni recomienda segundos mágicos: conserva evidencia, repite condiciones y respeta las fronteras entre firmware y sistema operativo."
    ],
    "lab": {
      "title": "LAB 005 · AUDITORÍA DEL ARRANQUE",
      "why": "Inspección exclusivamente de lectura; no cambia BCD ni el firmware.",
      "code": "Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber,BiosFirmwareType\nbcdedit /enum {current}\nGet-WinEvent -ListLog 'Microsoft-Windows-Diagnostics-Performance/Operational' -ErrorAction SilentlyContinue | Select-Object LogName,IsEnabled,RecordCount",
      "readout": "bcdedit /enum consulta la entrada vigente. No uses /set, /delete ni alteres particiones EFI. Algunos canales diagnósticos pueden faltar."
    },
    "insight": "El arranque no es una caja negra única: cada fase pertenece a un componente distinto y exige pruebas diferentes.",
    "challenge": "Comprobá el tipo de firmware y documentá tres arranques equivalentes. Ubicá la fase sin cambiar configuración.",
    "video": "Hay un Windows antes del escritorio. ¿Sabés qué parte todavía no es Windows?",
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
    "number": 6,
    "premise": [
      "El escritorio desaparece, la barra de tareas no responde y pensás que Windows murió. A veces el responsable es explorer.exe: un proceso de interfaz importante, pero no el núcleo del sistema. Su función es presentar el shell —entre otros elementos— y gestionar parte de la experiencia de archivos. Un fallo de Explorer puede parecer dramático sin comprometer el kernel.",
      "Esta investigación separa lo visible de lo operativo, como corresponde a un peritaje: ¿se congeló solo la interfaz?, ¿respondía el sistema a otros eventos?, ¿se cerró sesión?, ¿se reinició el equipo?, ¿hay registros de error? Sin esas respuestas, 'se cayó Windows' es un diagnóstico demasiado amplio."
    ],
    "mechanisms": [
      "Windows mantiene subsistemas independientes: gestión de sesiones, procesos de usuario, servicios, kernel y controladores. Explorer suele actuar como shell interactivo, pero su presencia no es requisito universal para ejecutar todos los procesos. Administrador de tareas o un entorno de recuperación pueden operar aunque el explorador no esté presente.",
      "Las aplicaciones pueden depender de componentes del shell y algunas funciones de interfaz pierden respuesta cuando Explorer falla. Esto no debe interpretarse como garantía de que todo el sistema sigue sano: una avería de GPU o un bloqueo profundo también puede manifestarse visualmente."
    ],
    "traps": [
      "Un escritorio negro no identifica una causa única. Sesión bloqueada, inicio de shell fallido, monitor desconectado, controladores gráficos o perfil de usuario dañado pueden parecer similares. Y reiniciar Explorer sin registrar el error destruye pistas temporales que permiten distinguir escenarios.",
      "Que explorer.exe use memoria o CPU no implica que convenga deshabilitarlo. Es un componente esencial de la experiencia del usuario y algunas configuraciones dependen de su funcionalidad. Este laboratorio no fuerza cierres."
    ],
    "protocol": [
      "En una sesión normal, identificá Explorer, su ruta y hora de inicio. Consultá eventos recientes de Application Error o Windows Error Reporting si el registro está habilitado. Registrá un incidente solo si ocurre realmente; no provoques un cierre para generar datos.",
      "Si sufriste pantalla negra, documentá primero si hubo señal de vídeo, si aparecía pantalla de seguridad y si persistía red. Esas observaciones diferencian falla del shell, sesión y sistema sin asumir una causa ni ejecutar cambios destructivos."
    ],
    "interpretation": [
      "Si ves un evento de error de Explorer a la misma hora, la correlación es fuerte pero no explica automáticamente el origen. Repetí con análisis de módulos, versiones y aplicaciones que integran extensiones al shell. Una sola excepción no demuestra corrupción del sistema.",
      "Si una sesión sigue respondiendo al iniciar otra aplicación, el kernel y el gestor de sesiones probablemente siguen activos; no significa que no existan problemas más profundos. Un diagnóstico responsable distingue evidencia directa y conclusión probable."
    ],
    "conclusion": [
      "Una pantalla y un sistema operativo no son lo mismo. Separar Explorer del núcleo evita soluciones exageradas como formatear por un problema que puede estar localizado en el shell o sus extensiones.",
      "Las medidas reparadoras vienen después de registrar contexto, consultar eventos y verificar integridad; no después de contar cuántas veces 'parpadeó' la barra."
    ],
    "lab": {
      "title": "LAB 006 · OBSERVAR EL SHELL",
      "why": "Consulta ruta, sesiones y eventos. No mata ni reinicia Explorer.",
      "code": "Get-Process explorer -ErrorAction SilentlyContinue | Select-Object Name,Id,StartTime,Path\nGet-WinEvent -FilterHashtable @{LogName='Application';StartTime=(Get-Date).AddDays(-3)} -MaxEvents 40 -ErrorAction SilentlyContinue | Where-Object {$_.ProviderName -match 'Application Error|Windows Error Reporting'} | Select-Object TimeCreated,ProviderName,Id,Message",
      "readout": "La ausencia de eventos no prueba salud perfecta: puede haber otro canal o retención insuficiente. No atribuyas toda pantalla negra a Explorer."
    },
    "insight": "Explorer presenta la experiencia visual; no es sinónimo de Windows completo.",
    "challenge": "Ante un incidente real, compará hora del fallo con eventos y respuesta de otros componentes; no lo reproduzcas deliberadamente.",
    "video": "¿Se fue el escritorio? Quizás se cayó un proceso, no el sistema operativo.",
    "sources": [
      {
        "name": "Get-Process — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      },
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      },
      {
        "name": "Process Explorer — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      }
    ]
  },
  {
    "number": 7,
    "premise": [
      "Todos conocemos el Windows de la pantalla de inicio y las ventanas. Hay otro Windows hecho de hilos del kernel, controladores, servicios, objetos de sincronización, caché de memoria y planificación de operaciones. No son dos sistemas instalados: son dos caras de una misma arquitectura con responsabilidades y privilegios diferentes.",
      "Este título plantea una distinción que sirve para diagnosticar casi todo: una interfaz fluida puede ocultar tareas pesadas, y una interfaz congelada no prueba que todos los componentes estén detenidos. Aprender a separar planos evita buscar soluciones donde no está el problema."
    ],
    "mechanisms": [
      "En el espacio de usuario se ejecutan aplicaciones y muchos servicios, normalmente con privilegios limitados. El kernel administra memoria, procesos, planificación, E/S y mecanismos de seguridad apoyándose en controladores. Las transiciones entre modos se producen mediante interfaces de sistema, interrupciones y eventos; la separación ayuda a contener fallos y aplicar restricciones.",
      "El Administrador de tareas muestra procesos de usuario y algunas estadísticas del sistema, pero no equivale a una vista completa de cada rutina del núcleo. Para examinar latencias de controlador o actividad detallada se requieren proveedores de eventos ETW y herramientas adecuadas a la versión."
    ],
    "traps": [
      "'Kernel' no significa malware y 'user mode' no significa ausencia de privilegios. Una aplicación elevada continúa siendo principalmente código de usuario; la elevación no la convierte en controlador Ring 0. Tampoco toda interrupción indica una falla de hardware.",
      "Los nombres comerciales 'acelerador del kernel' confunden capas: cambiar servicios del usuario no modifica la arquitectura del planificador. Antes de aceptar una mejora, identificá qué métrica cambió y cómo se aisló el componente."
    ],
    "protocol": [
      "Construí dos mapas. El primero enumera procesos y servicios con PID y estado. El segundo registra tiempo total de CPU del sistema, interrupciones disponibles y controladores firmados mediante herramientas nativas. Marcá claramente qué datos son observables con comandos y cuáles requieren un trazado específico.",
      "Elegí una acción simple, por ejemplo copiar un archivo pequeño propio. Explicá la ruta conceptual: app solicita E/S, el kernel valida y despacha, el controlador opera con almacenamiento y la aplicación recibe resultado. No atribuyas el tiempo exacto de cada etapa sin medición instrumentada."
    ],
    "interpretation": [
      "Una variación de CPU del proceso puede reflejar trabajo de usuario, mientras parte de la actividad de E/S aparece en un componente distinto. No repartas arbitrariamente porcentajes entre capas. La atribución de latencia click-to-photon o DPC requiere herramientas y método diseñados para ello.",
      "Cuando dos contadores difieren, verificá alcance: procesos visibles, contadores de sistema, controladores y dispositivos no comparten unidad ni periodicidad. Un valor agregado no reconstruye automáticamente cada causa interna."
    ],
    "conclusion": [
      "El lector se lleva un mapa conceptual útil para cualquier problema: interfaz → proceso → llamada al sistema → kernel/controlador → hardware → evento de retorno. Su utilidad no reside en memorizar siglas, sino en localizar qué etapa debe investigarse.",
      "El mito se desarma solo: nunca hubo 'dos Windows' que compiten. Hay capas diferentes que cooperan y generan síntomas aparentemente contradictorios."
    ],
    "lab": {
      "title": "LAB 007 · DOS CAPAS, DOS OBSERVACIONES",
      "why": "Inspección de procesos de usuario y carga global sin cambiar privilegios.",
      "code": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 12 Name,Id,CPU,Threads\nGet-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,LastBootUpTime\nGet-Counter '\\Processor(_Total)\\% Processor Time' -SampleInterval 1 -MaxSamples 3 -ErrorAction SilentlyContinue",
      "readout": "Los contadores pueden faltar en sistemas personalizados. No sumes CPU acumulada de procesos como si fuera porcentaje instantáneo."
    },
    "insight": "La vista gráfica, los procesos y el kernel se relacionan, pero observan y miden cosas distintas.",
    "challenge": "Explicá la ruta de una operación de archivo desde una app hasta el almacenamiento sin asumir tiempos que no mediste.",
    "video": "Windows tiene capas invisibles. Saber dónde mirar vale más que 'optimizar' a ciegas.",
    "sources": [
      {
        "name": "Get-Process — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      },
      {
        "name": "Process Monitor — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon"
      }
    ]
  },
  {
    "number": 8,
    "premise": [
      "Windows suele registrar problemas que el usuario no llegó a ver: intentos fallidos de iniciar servicios, operaciones que se reintentan, errores de aplicaciones recuperadas o controladores que tardaron. No todo evento clasificado como error produce una falla visible. La pregunta no es '¿cómo dejar el Visor sin rojo?', sino '¿qué evento coincide con el síntoma y qué dependencia explica?'.",
      "Una auditoría seria usa cronología, proveedor, ID y versión del evento, nivel y datos del contexto. Evita tomar una captura aislada de un mensaje alarmante como diagnóstico final. La repetición y el impacto distinguen ruido de incidentes."
    ],
    "mechanisms": [
      "Windows Event Log almacena registros de sistema, seguridad, aplicaciones y numerosos canales operacionales. Un Event ID no es universal: un mismo número puede describir fenómenos diferentes según proveedor y canal. Los detalles del registro, los datos estructurados y los eventos vecinos ofrecen el contexto que el número por sí solo no aporta.",
      "Reliability Monitor reúne fallos y cambios con una vista temporal útil, pero tampoco es un detector de causa raíz. ETW registra proveedores de eventos con resolución y nivel de detalle que pueden superar los registros tradicionales; requiere captura diseñada para un propósito concreto."
    ],
    "traps": [
      "Buscar 'Event ID 1000 solución definitiva' suele mezclar Windows distintos, proveedores distintos y síntomas distintos. Borrar el registro para que el contador marque cero destruye evidencia y no repara la condición subyacente. El error no debe perseguirse por color, sino por su relación causal con una falla.",
      "Hay eventos legítimos de arranque, servicios opcionales o dispositivos ausentes; también hay fallos graves sin un evento claramente escrito. La ausencia de una entrada no acredita que el equipo esté sano. La cobertura depende de configuración, permisos y retención."
    ],
    "protocol": [
      "Anotá hora exacta del síntoma y consultá registros dentro de una ventana estrecha, primero System y Application. Ordená por proveedor y Event ID sin fusionarlos. Si un evento reaparece, compará hora, dispositivo afectado y lo que ocurría en ese momento.",
      "Documentá tres hipótesis: falla propia de una aplicación, dependencia de servicio/controlador y evento incidental. Para cada una buscá un dato que la refute. Repetí observación después de reproducir normalmente el problema, sin inducir daños."
    ],
    "interpretation": [
      "Un mismo evento repetido cada arranque puede ser habitual pero merece seguimiento si coincide con síntomas. Un fallo aislado no justifica un formateo. Mirá código, ruta del módulo, actualización reciente y cambios simultáneos antes de atribuirlo al núcleo.",
      "Un registro incompleto obliga a declarar incertidumbre. Incorporá información del Monitor de confiabilidad, documentación del proveedor y, cuando corresponda, un volcado de fallo administrado de manera segura."
    ],
    "conclusion": [
      "El conocimiento útil es una cadena: síntoma → instante → proveedor/ID → datos del evento → hipótesis → comprobación → resultado. No es una receta para eliminar errores de pantalla, sino un método para leer qué cambió y cuándo.",
      "Una publicación responsable cita la documentación del evento específico y conserva la redacción de la hipótesis separada de lo observado. En EVO LABS no fabricamos causas para que una captura parezca interesante."
    ],
    "lab": {
      "title": "LAB 008 · LECTURA CRONOLÓGICA",
      "why": "Consulta eventos de los últimos dos días sin limpiar ningún registro.",
      "code": "$from=(Get-Date).AddDays(-2)\nGet-WinEvent -FilterHashtable @{LogName='System';StartTime=$from;Level=2,3} -MaxEvents 40 -ErrorAction SilentlyContinue | Select-Object TimeCreated,ProviderName,Id,LevelDisplayName,Message\nGet-WinEvent -FilterHashtable @{LogName='Application';StartTime=$from;Level=2,3} -MaxEvents 30 -ErrorAction SilentlyContinue | Select-Object TimeCreated,ProviderName,Id,Message",
      "readout": "El filtro recupera errores y advertencias; no es un diagnóstico. Interpretá proveedor + ID + hora + síntomas, nunca solo ID."
    },
    "insight": "El evento rojo no es el enemigo: es una anotación que cobra sentido únicamente al relacionarla con una falla real.",
    "challenge": "Seleccioná un evento, verificá su proveedor y contexto y redactá dos explicaciones alternativas sin borrar registros.",
    "video": "Tu Windows puede tener errores invisibles. No te preocupes por el rojo: aprendé a leerlo.",
    "sources": [
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      },
      {
        "name": "Process Monitor — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon"
      }
    ]
  },
  {
    "number": 9,
    "premise": [
      "Abrís el monitor de red y ves conexiones de Windows con servidores de Microsoft. ¿Eso prueba que el sistema está enviando tus documentos? No. Una conexión demuestra comunicación, no el contenido ni la finalidad de cada paquete. También es incorrecto concluir lo contrario: que toda conexión es inocua por usar un dominio conocido.",
      "La privacidad exige distinguir datos diagnósticos obligatorios u opcionales, datos necesarios para experiencias conectadas, sincronización de cuenta, licencias y tráfico de terceros. La pregunta publicable es qué función genera cada flujo, bajo qué consentimiento y con qué límites de observación."
    ],
    "mechanisms": [
      "Windows incluye componentes que consultan conectividad, sincronización de hora, actualizaciones, reputación, licencias y servicios asociados a experiencias conectadas. Microsoft documenta categorías de datos diagnósticos y datos necesarios de servicio; no son idénticos. La configuración puede depender de edición, políticas organizativas y servicios habilitados.",
      "En una captura, un proceso se vincula con IP y puerto, pero TLS cifra gran parte del contenido. DNS, SNI cuando está disponible o certificados pueden aportar contexto, aunque CDN, proxies, QUIC y cachés impiden atribuciones triviales. Una IP compartida no identifica por sí sola al destinatario final."
    ],
    "traps": [
      "El nombre 'telemetría' no implica que se estén enviando archivos personales y marcar 'datos opcionales desactivados' no significa que no exista comunicación necesaria para servicios habilitados. Del mismo modo, un antivirus o una app de terceros puede generar tráfico no atribuible a Windows por el mero hecho de usar una biblioteca común.",
      "Los bloqueos agresivos de destinos pueden romper actualizaciones, revocación de certificados, licencias o servicios conectados. El objetivo educativo aquí es atribuir y documentar, no producir un sistema desconectado por fuerza."
    ],
    "protocol": [
      "Registrá edición de Windows, estado de configuración de privacidad, hora y conexiones TCP por PID. Cerrá aplicaciones que no intervengan en el ensayo, documentando cuáles cerraste. Repetí cuando una función concreta, como sincronización o actualización, esté operativa; las diferencias ayudan a atribuir el origen.",
      "En un entorno propio y autorizado podés completar el análisis con una captura de paquetes, pero solo después de preparar filtros, período corto, destino de almacenamiento seguro y plan para ocultar identificadores privados. No publiques PCAP sin revisar credenciales y datos de terceros."
    ],
    "interpretation": [
      "Un cambio en número de conexiones no equivale a cambio en volumen de información transmitida. TCP establecido tampoco indica transferencia en ese momento. Para inferir categorías de datos hace falta documentación de protocolos, captura y posiblemente análisis de aplicaciones, dentro de los límites del cifrado.",
      "La falta de paquetes en una captura de cinco minutos no prueba que una función jamás se comunique. Etiquetá siempre el intervalo y la técnica. Un informe útil dice qué observó, qué quedó fuera y qué política concreta estaba activa."
    ],
    "conclusion": [
      "La conclusión es más fuerte que el escándalo: la privacidad de Windows se evalúa por funciones, consentimiento, categorías y tráfico atribuible. Una IP, sola, es una pista técnica, nunca un veredicto moral.",
      "El lector termina sabiendo pedir las pruebas correctas: identidad del proceso, ruta, hora, destinatario, contexto y datos que verdaderamente se pueden observar. Eso vale más que cualquier lista secreta de dominios para bloquear."
    ],
    "lab": {
      "title": "LAB 009 · CONEXIONES Y CONTEXTO",
      "why": "Muestra conexiones actuales y la identidad del proceso. No intercepta contenidos.",
      "code": "Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Select-Object -First 25 LocalAddress,LocalPort,RemoteAddress,RemotePort,OwningProcess\n# Usá un PID observado en OwningProcess\nGet-Process -Id 1234 -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,Path",
      "readout": "Reemplazá 1234 por un PID propio. TCP no refleja toda la actividad UDP/QUIC ni revela el contenido cifrado. No atribuyas una empresa a partir de geolocalización IP."
    },
    "insight": "Conexión no es filtración demostrada; consentimiento, categoría de datos, ruta del proceso y contexto separan suposiciones de hallazgos.",
    "challenge": "Relacioná una conexión real con un proceso y registrá qué no podés saber a partir de la tabla; investigá fuentes oficiales sobre categorías diagnósticas.",
    "video": "Windows habla con Internet. La pregunta correcta no es si habla: es qué evidencia revela de esa conversación.",
    "sources": [
      {
        "name": "Get-NetTCPConnection — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection"
      },
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      },
      {
        "name": "Process Monitor — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon"
      }
    ]
  }
];
