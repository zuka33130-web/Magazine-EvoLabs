/**
 * EVO LABS / TOMO 02 / MAGAZINE ESTRELLA
 * Primer bloque de 20 investigaciones orientadas al principiante.
 * Cada guía tiene procedimientos comprobables y no destructivos.
 * La Biblia Virtual mantiene su índice y contenido canónicos.
 */
export type EvoMagazineStep = { title: string; why: string; code?: string; expect: string };
export type EvoMagazineArticle = {
  id: number; goal: string; basics: string; steps: EvoMagazineStep[];
  tip: string; warning: string; challenge: string;
};

export const EVO_MAGAZINE_FIRST_BATCH: EvoMagazineArticle[] = [
  {
    "id": 1,
    "goal": "Leer el Administrador de tareas y detectar qué recursos consumen los programas.",
    "basics": "Windows reparte el trabajo entre procesos. Un proceso tiene un identificador (PID); puede utilizar CPU, RAM, disco y red. El porcentaje global de CPU no equivale a la columna CPU del comando Get-Process, que registra tiempo acumulado.",
    "steps": [
      {
        "title": "Abrí el Administrador de tareas",
        "why": "Presioná Ctrl+Shift+Esc. En Procesos, observá las columnas CPU y Memoria; esos valores fluctúan mientras trabajás.",
        "expect": "Se muestran aplicaciones y procesos en segundo plano."
      },
      {
        "title": "Compará con PowerShell",
        "why": "Get-Process enumera procesos; Select-Object elige nombre, PID y RAM aproximada del working set.",
        "code": "Get-Process | Select-Object -First 15 Name,Id,@{N='RAM_MiB';E={[math]::Round($_.WorkingSet64/1MB,1)}}",
        "expect": "Aparecen hasta 15 procesos con sus PID y memoria física residente aproximada."
      },
      {
        "title": "Aprendé a ordenar resultados",
        "why": "Sort-Object -Descending ordena de mayor a menor; el resultado es una instantánea.",
        "code": "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name,Id",
        "expect": "Encontrarás procesos grandes; eso no demuestra que sean innecesarios."
      }
    ],
    "tip": "Truco: hacé clic en las columnas del Administrador de tareas para ordenar. Confirmá siempre con dos vistas.",
    "warning": "No termines un proceso solo por su consumo. Puede pertenecer a un controlador o al sistema.",
    "challenge": "Anotá tres PID, distinguí CPU acumulada de CPU instantánea y explicá por qué una lista no permite decidir qué borrar."
  },
  {
    "id": 2,
    "goal": "Distinguir servicios imprescindibles, opcionales y dependencias.",
    "basics": "Un servicio es un componente administrado por Service Control Manager. Puede iniciarse automáticamente, a demanda o quedar deshabilitado. Que figure detenido puede ser completamente normal.",
    "steps": [
      {
        "title": "Descubrí qué es un servicio",
        "why": "Abrí services.msc. La columna Tipo de inicio no indica necesariamente cuánto consume.",
        "code": "Start-Process services.msc",
        "expect": "Vas a ver servicios, estados y modos de inicio."
      },
      {
        "title": "Listá algunos en PowerShell",
        "why": "Get-Service consulta el controlador de servicios; no cambia su estado.",
        "code": "Get-Service | Select-Object -First 20 Name,Status,StartType",
        "expect": "Aparecen servicios en ejecución o detenidos, con su tipo de inicio."
      },
      {
        "title": "Investigá una dependencia",
        "why": "Revisá qué necesita el servicio Registro de eventos.",
        "code": "Get-Service EventLog | Select-Object -ExpandProperty RequiredServices",
        "expect": "Verás servicios requeridos, o una lista vacía según la configuración."
      }
    ],
    "tip": "Antes de evaluar un servicio, comprobá nombre real, dependencia, ejecutable, uso y posibilidad de revertir.",
    "warning": "Deshabilitar servicios críticos puede impedir inicio de sesión, red, audio o recuperación. No lo hacemos aquí.",
    "challenge": "Elegí un servicio detenido y explicá por qué 'detenido' no significa 'desactivable'."
  },
  {
    "id": 3,
    "goal": "Saber por qué existen varios svchost.exe y qué alojan.",
    "basics": "svchost.exe aloja servicios de Windows. Varios procesos con ese nombre son esperables; Windows puede separarlos para mejorar aislamiento y administración. El nombre por sí solo no prueba legitimidad.",
    "steps": [
      {
        "title": "Observá los procesos anfitriones",
        "why": "En el Administrador de tareas, expandí 'Procesos de Windows' si está disponible.",
        "expect": "Podés encontrar varias instancias de 'Host de servicio'."
      },
      {
        "title": "Relacioná servicios y PID",
        "why": "Win32_Service expone el PID del proceso de cada servicio activo.",
        "code": "Get-CimInstance Win32_Service | Where-Object {$_.ProcessId -gt 0} | Select-Object -First 25 Name,State,ProcessId",
        "expect": "Diferentes servicios pueden compartir PID."
      },
      {
        "title": "Filtrá un PID para saber qué aloja",
        "why": "Sustituí 1234 por un PID de la salida anterior.",
        "code": "Get-CimInstance Win32_Service | Where-Object {$_.ProcessId -eq 1234} | Select-Object Name,DisplayName,State",
        "expect": "Aparece la lista de servicios de ese PID; puede estar vacía si terminó."
      }
    ],
    "tip": "La correlación PID-servicio vale más que contar instancias de svchost.",
    "warning": "No finalices svchost.exe al azar: podrías interrumpir componentes esenciales.",
    "challenge": "Buscá dos servicios que compartan PID o explicá por qué en tu equipo pueden estar separados."
  },
  {
    "id": 4,
    "goal": "Diferenciar arranque, inicio de sesión y tiempo desde el último inicio.",
    "basics": "UEFI inicializa hardware, Windows Boot Manager carga el sistema y más tarde el usuario inicia sesión. Reiniciar, encender desde apagado y reanudar suspensión pueden medir fenómenos distintos.",
    "steps": [
      {
        "title": "Identificá la última hora de inicio del sistema",
        "why": "Consultá la fecha informada por Windows.",
        "code": "(Get-CimInstance Win32_OperatingSystem).LastBootUpTime",
        "expect": "Verás la marca temporal de inicio informada por el sistema."
      },
      {
        "title": "Comprobá el tiempo activo",
        "why": "Restá la fecha de inicio al momento actual.",
        "code": "(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime",
        "expect": "Obtendrás días, horas, minutos y segundos desde ese inicio."
      },
      {
        "title": "Investigá el Inicio rápido",
        "why": "Abrí Opciones de energía para consultar cómo está configurado el apagado.",
        "code": "Start-Process control.exe -ArgumentList '/name Microsoft.PowerOptions'",
        "expect": "Se abrirá el panel si está disponible; no cambies ninguna opción por ahora."
      }
    ],
    "tip": "Cuando alguien afirma 'Windows inicia en dos segundos', anotá desde qué evento hasta qué evento se midió.",
    "warning": "No modifiques BCD, particiones o UEFI para acortar arranque durante este laboratorio.",
    "challenge": "Definí tres cronómetros distintos: firmware, inicio de Windows y tiempo hasta escritorio utilizable."
  },
  {
    "id": 5,
    "goal": "Comprender qué hace el indexador y medir si trabaja realmente.",
    "basics": "El índice de búsqueda mantiene información para encontrar archivos y contenidos más rápido. Su trabajo puede aumentar tras cambios grandes; desactivarlo indiscriminadamente degrada búsquedas.",
    "steps": [
      {
        "title": "Buscá Windows Search",
        "why": "Esta consulta muestra cómo está configurado el servicio.",
        "code": "Get-Service WSearch -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType",
        "expect": "Verás el estado o ninguna fila si el servicio no está instalado."
      },
      {
        "title": "Buscá el proceso relacionado",
        "why": "Un proceso puede no existir mientras el indexador está inactivo.",
        "code": "Get-Process SearchIndexer -ErrorAction SilentlyContinue | Select-Object Name,Id,CPU",
        "expect": "Puede aparecer SearchIndexer o ningún resultado."
      },
      {
        "title": "Investigá las ubicaciones",
        "why": "Abrí las opciones de indexación y revisá las carpetas incluidas.",
        "code": "Start-Process control.exe -ArgumentList '/name Microsoft.IndexingOptions'",
        "expect": "Si el panel existe en tu edición, podrás revisar ubicaciones sin modificarlas."
      }
    ],
    "tip": "Compará uso de disco antes y después de una reconstrucción planificada del índice, no solo mientras el sistema acaba de arrancar.",
    "warning": "No borres bases del índice ni apagues servicios por intuición.",
    "challenge": "Anotá cuántas ubicaciones indexa tu equipo y qué perderías si la búsqueda dejara de funcionar."
  },
  {
    "id": 6,
    "goal": "Investigar Windows Update sin confundir mantenimiento con actividad maliciosa.",
    "basics": "Las actualizaciones pueden descargar, validar y preparar archivos en segundo plano. Varios servicios colaboran; observar uno solo no explica toda la actividad.",
    "steps": [
      {
        "title": "Identificá los servicios involucrados",
        "why": "Consultá Windows Update y Background Intelligent Transfer Service.",
        "code": "Get-Service wuauserv,BITS -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType",
        "expect": "Los servicios pueden estar detenidos aunque Windows Update funcione a demanda."
      },
      {
        "title": "Consultá actualizaciones instaladas",
        "why": "Este comando muestra revisiones reportadas por el sistema; no todas las instalaciones aparecen aquí.",
        "code": "Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 8 HotFixID,InstalledOn,Description",
        "expect": "Lista de actualizaciones donde haya datos disponibles."
      },
      {
        "title": "Contrastá con el historial visual",
        "why": "Abrí Configuración > Windows Update > Historial de actualizaciones.",
        "code": "Start-Process 'ms-settings:windowsupdate-history'",
        "expect": "Aparece el historial de la interfaz."
      }
    ],
    "tip": "Antes de culpar a Windows Update por un pico de CPU, anotá qué proceso trabajó y durante cuánto tiempo.",
    "warning": "No deshabilites permanentemente actualizaciones para ahorrar RAM: perdés correcciones de seguridad y soporte.",
    "challenge": "Explicá por qué un servicio detenido no prueba que Windows no pueda actualizarse."
  },
  {
    "id": 7,
    "goal": "Medir el estado de seguridad sin desactivar protecciones.",
    "basics": "Microsoft Defender incluye componentes que realizan análisis y protección. Su consumo depende de la tarea y las exclusiones; un proceso activo no significa que esté fallando.",
    "steps": [
      {
        "title": "Abrí Seguridad de Windows",
        "why": "Revisá Protección contra virus y amenazas y el último resultado del sistema.",
        "code": "Start-Process 'windowsdefender:'",
        "expect": "Se abre la interfaz si está disponible y registrada."
      },
      {
        "title": "Verificá si tenés el comando de consulta",
        "why": "Algunas instalaciones personalizadas o políticas eliminan cmdlets; no inventes datos si faltan.",
        "code": "Get-Command Get-MpComputerStatus -ErrorAction SilentlyContinue | Select-Object Name,Source",
        "expect": "Aparece el cmdlet o ninguna fila."
      },
      {
        "title": "Consultá el estado, si está disponible",
        "why": "Ejecutalo solo si el paso anterior encontró el comando.",
        "code": "Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled",
        "expect": "Informará estados; no modifica la protección."
      }
    ],
    "tip": "Una reducción de consumo solo vale si la seguridad y las aplicaciones necesarias siguen funcionando.",
    "warning": "No desactives antivirus, firewall ni análisis en tiempo real por una comparación de memoria.",
    "challenge": "Anotá una función de protección y explicá qué riesgo asumirías si la desactivaras."
  },
  {
    "id": 8,
    "goal": "Revisar qué tareas puede ejecutar Windows sin intervención.",
    "basics": "El Programador de tareas ejecuta acciones bajo condiciones: inicio de sesión, hora o eventos. Una tarea registrada puede no haberse ejecutado jamás; una tarea deshabilitada no es sospechosa.",
    "steps": [
      {
        "title": "Abrí el Programador de tareas",
        "why": "Explorá la Biblioteca del Programador de tareas.",
        "code": "Start-Process taskschd.msc",
        "expect": "Aparece la consola si está disponible."
      },
      {
        "title": "Listá tareas registradas",
        "why": "Get-ScheduledTask consulta las definiciones sin ejecutarlas.",
        "code": "Get-ScheduledTask | Select-Object -First 20 TaskName,TaskPath,State",
        "expect": "Podés encontrar tareas listas, en ejecución o deshabilitadas."
      },
      {
        "title": "Investigá una tarea concreta",
        "why": "Filtrá por nombre de una tarea que veas en tu listado.",
        "code": "Get-ScheduledTask | Where-Object {$_.TaskName -like '*Update*'} | Select-Object -First 10 TaskName,State,TaskPath",
        "expect": "Podés obtener varias, una o ninguna, según el equipo."
      }
    ],
    "tip": "Revisá también desencadenadores, acción ejecutable y última ejecución, no solo el nombre.",
    "warning": "No borres ni deshabilites tareas del sistema como método de optimización.",
    "challenge": "Elegí una tarea legítima y explicá qué evento la activa."
  },
  {
    "id": 9,
    "goal": "Distinguir procesos residentes, servicios y programas iniciados por el usuario.",
    "basics": "Un proceso residente puede esperar trabajo sin consumir CPU. Algunos componentes arrancan con la sesión, otros con el sistema y otros solo al solicitarlos.",
    "steps": [
      {
        "title": "Listá procesos actuales",
        "why": "Observá estado y consumo acumulado.",
        "code": "Get-Process | Sort-Object ProcessName | Select-Object -First 20 ProcessName,Id,CPU",
        "expect": "Cada nombre puede repetirse con varios PID."
      },
      {
        "title": "Consultá programas configurados al iniciar sesión",
        "why": "Win32_StartupCommand muestra algunas entradas de inicio, no todas.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object Name,Location,Command",
        "expect": "Aparecen entradas conocidas, o ninguna según configuración."
      },
      {
        "title": "Compará con Configuración",
        "why": "Abrí Aplicaciones de inicio para revisar el listado visual.",
        "code": "Start-Process 'ms-settings:startupapps'",
        "expect": "El listado puede diferir porque las fuentes no son idénticas."
      }
    ],
    "tip": "Para una auditoría completa también se consideran tareas, servicios y ubicaciones Run/RunOnce.",
    "warning": "No quites elementos de inicio hasta saber si controlan audio, periféricos, respaldo o seguridad.",
    "challenge": "Buscá un mismo programa en ambos listados y explicá por qué podría aparecer solo en uno."
  },
  {
    "id": 10,
    "goal": "Encontrar la actividad que consume CPU, RAM, disco o red.",
    "basics": "El Monitor de recursos muestra actividad por proceso. 'Mucho uso' tiene significado distinto según la métrica; conviene observar durante un intervalo y en contexto.",
    "steps": [
      {
        "title": "Abrí el Monitor de recursos",
        "why": "Es una herramienta integrada en Windows.",
        "code": "Start-Process resmon.exe",
        "expect": "Verás pestañas de CPU, Memoria, Disco y Red."
      },
      {
        "title": "Estudiá el disco",
        "why": "En la pestaña Disco, ordená por bytes por segundo y anotá el proceso más activo.",
        "expect": "La actividad suele cambiar rápidamente, por lo que una sola observación no basta."
      },
      {
        "title": "Comprobá los procesos por CPU acumulada",
        "why": "No confundas segundos de CPU con porcentaje.",
        "code": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name,Id,CPU",
        "expect": "Verás los procesos que más tiempo de CPU acumularon."
      }
    ],
    "tip": "Si investigás microcortes, registrá en qué segundo aparecen y qué proceso estaba haciendo E/S.",
    "warning": "No asignes causalidad a un proceso solo porque coincide una vez con la lentitud.",
    "challenge": "Detectá un proceso con actividad de disco y explicá qué dato adicional comprobarías."
  },
  {
    "id": 11,
    "goal": "Diferenciar RAM física, disponible, compromiso y caché.",
    "basics": "La RAM es almacenamiento temporal rápido. 'Disponible' puede incluir caché recuperable; la memoria comprometida representa una promesa de respaldo, no solo páginas residentes.",
    "steps": [
      {
        "title": "Anotá la memoria desde Windows",
        "why": "El total visible y la libre son valores aproximados del sistema.",
        "code": "$os=Get-CimInstance Win32_OperatingSystem; [pscustomobject]@{TotalGiB=[math]::Round($os.TotalVisibleMemorySize/1MB,2);LibreGiB=[math]::Round($os.FreePhysicalMemory/1MB,2)}",
        "expect": "Aparecerán valores de RAM en GiB."
      },
      {
        "title": "Abrí el detalle gráfico",
        "why": "Administrador de tareas > Rendimiento > Memoria.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Compará las cifras En uso, Disponible y Confirmada."
      },
      {
        "title": "Investigá las aplicaciones",
        "why": "Ordená por WorkingSet; la suma de procesos no equivale a la RAM total porque hay páginas compartidas.",
        "code": "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 8 Name,@{N='MB';E={[math]::Round($_.WorkingSet64/1MB)}}",
        "expect": "Aparecerán residentes principales; no deduzcas memoria perdida sumando filas."
      }
    ],
    "tip": "Medí RAM después de esperar unos minutos con las mismas aplicaciones, no justo después de entrar a Windows.",
    "warning": "Liberar caché manualmente suele empeorar rendimiento al obligar al sistema a reconstruirla.",
    "challenge": "Explicá con un ejemplo por qué 2 GB de RAM en caché no implican que Windows esté 'gastando' 2 GB."
  },
  {
    "id": 12,
    "goal": "Comprender qué es compresión de memoria y por qué existe.",
    "basics": "Cuando hay presión de RAM, Windows puede comprimir páginas antes de recurrir al almacenamiento. Consume algo de CPU para evitar ciertas lecturas y escrituras lentas.",
    "steps": [
      {
        "title": "Buscá memoria comprimida en la interfaz",
        "why": "Administrador de tareas > Rendimiento > Memoria suele mostrar el dato entre paréntesis en 'En uso (comprimida)'.",
        "expect": "Puede ser cero, pequeño o variar según las aplicaciones."
      },
      {
        "title": "Consultá la característica desde PowerShell",
        "why": "Get-MMAgent muestra opciones de administración de memoria. Puede requerir permisos o no estar disponible.",
        "code": "Get-MMAgent | Select-Object MemoryCompression",
        "expect": "Verás un booleano o un mensaje de error. Ninguna salida es una orden de cambiarlo."
      },
      {
        "title": "Tomá mediciones comparables",
        "why": "Compará la memoria libre y total desde CIM antes y después de una carga habitual; son valores físicos y no expresan por sí solos la cantidad comprimida.",
        "expect": "Podrás ver cifras en KiB que cambian con el uso. La compresión se observa en Administrador de tareas.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory,TotalVisibleMemorySize"
      }
    ],
    "tip": "Compresión no es 'memoria gratis': intercambia cierta actividad de CPU por menor presión física.",
    "warning": "No desactives la compresión para perseguir unos megabytes sin comparar un escenario real.",
    "challenge": "Explicá una situación donde comprimir RAM podría ayudar y otra donde no sería relevante."
  },
  {
    "id": 13,
    "goal": "Entender para qué sirve pagefile.sys y cuándo interviene.",
    "basics": "El archivo de paginación respalda parte de la memoria comprometida y ayuda en escenarios de presión de memoria y volcado de errores. Desactivarlo puede provocar fallas aun con RAM libre aparente.",
    "steps": [
      {
        "title": "Consultá el uso del archivo de paginación",
        "why": "La clase Win32_PageFileUsage informa instancias que Windows utiliza.",
        "code": "Get-CimInstance Win32_PageFileUsage | Select-Object Name,AllocatedBaseSize,CurrentUsage,PeakUsage",
        "expect": "Tamaños en MB, o ninguna fila según la configuración."
      },
      {
        "title": "Revisá la política configurada",
        "why": "La clase de configuración puede no mostrar un archivo gestionado automáticamente.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object AutomaticManagedPagefile",
        "expect": "Verás True/False para la administración automática."
      },
      {
        "title": "Aprendé a reconocer la memoria comprometida",
        "why": "En Administrador de tareas > Rendimiento > Memoria, revisá 'Confirmada'.",
        "expect": "Se muestran dos cifras: compromiso actual y límite. No son equivalentes a RAM instalada."
      }
    ],
    "tip": "Si aparece un error de memoria con aplicaciones exigentes, investigá compromiso y límite antes de modificar nada.",
    "warning": "No borres pagefile.sys ni desactives memoria virtual durante esta lección.",
    "challenge": "Explicá por qué tener RAM libre no demuestra que el archivo de paginación sea inútil."
  },
  {
    "id": 14,
    "goal": "Reconocer una fuga de memoria sin confundirla con carga normal.",
    "basics": "Una fuga aparece cuando un programa conserva recursos que ya no necesita. Para detectarla se observa la evolución, no un valor aislado.",
    "steps": [
      {
        "title": "Elegí una aplicación abierta",
        "why": "Identificá su nombre de proceso desde el Administrador de tareas.",
        "expect": "Anotá nombre y PID para observar la misma instancia."
      },
      {
        "title": "Registrá una serie corta",
        "why": "Sustituí 'notepad' por el nombre de un programa que tengas abierto. El muestreo es solo lectura.",
        "code": "1..6 | ForEach-Object { Get-Process notepad -ErrorAction SilentlyContinue | Select-Object Name,Id,@{N='MB';E={[math]::Round($_.WorkingSet64/1MB,1)}}; Start-Sleep -Seconds 5 }",
        "expect": "Verás hasta seis muestras durante 30 segundos, o ninguna si no está abierto."
      },
      {
        "title": "Comprobá el comportamiento",
        "why": "Registrá la memoria libre general junto con la medida del proceso; esto ayuda a contextualizar los cambios, pero no demuestra por sí solo una fuga.",
        "expect": "Obtendrás una cifra del sistema en KiB que puede variar sin que exista una fuga.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory"
      }
    ],
    "tip": "Una investigación más seria controla Private Bytes, handles, tareas realizadas y si el uso baja después de cerrarlas.",
    "warning": "No fuerces cierres durante un trabajo sin guardar; podrían perderse datos.",
    "challenge": "Explicá qué patrón temporal te haría sospechar una fuga y qué otras hipótesis descartarías."
  },
  {
    "id": 15,
    "goal": "Diagnosticar picos de CPU con datos verificables.",
    "basics": "El porcentaje de CPU indica capacidad utilizada durante un intervalo. La propiedad CPU de Get-Process expresa segundos acumulados y no sirve sola para saber quién está al 100% ahora.",
    "steps": [
      {
        "title": "Observá porcentajes actuales",
        "why": "Abrí Administrador de tareas y ordená la columna CPU.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Los procesos cambian de posición al variar el uso."
      },
      {
        "title": "Obtené tiempos acumulados",
        "why": "Es una consulta de solo lectura.",
        "code": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 12 Name,Id,CPU",
        "expect": "Los mayores valores suelen corresponder a procesos de larga vida."
      },
      {
        "title": "Revisá el tiempo activo del sistema",
        "why": "Un proceso que arrancó hace días pudo acumular mucho CPU aunque ahora esté ocioso.",
        "code": "(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime",
        "expect": "Verás cuánto tiempo lleva activo Windows."
      }
    ],
    "tip": "Para estudiar picos breves, usá un registro de muestras con fecha y hora en lugar de capturar una única pantalla.",
    "warning": "No atribuyas toda la carga a procesos de usuario: también existen interrupciones y trabajo de controladores.",
    "challenge": "Encontrá un proceso con mucho CPU acumulado y comprobá si realmente ocupa CPU instantánea."
  },
  {
    "id": 16,
    "goal": "Comprender prioridades, afinidad y por qué no son aceleradores mágicos.",
    "basics": "Windows distribuye tiempo de procesador entre hilos. Prioridad y afinidad cambian decisiones de planificación, pero no agregan núcleos ni ciclos disponibles.",
    "steps": [
      {
        "title": "Identificá cuántos procesadores lógicos tiene Windows",
        "why": "Consultá la vista que expone CIM.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors",
        "expect": "Podés ver más procesadores lógicos que núcleos físicos."
      },
      {
        "title": "Revisá prioridad de procesos propios",
        "why": "No cambies nada; consultá aplicaciones de la sesión.",
        "code": "Get-Process | Select-Object -First 12 Name,Id,PriorityClass",
        "expect": "La prioridad puede variar y algunos procesos pueden restringir la consulta."
      },
      {
        "title": "Contrastá con el Administrador de tareas",
        "why": "En Detalles, observá el menú contextual de prioridad, pero no lo apliques.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Las opciones dependen de permisos y del proceso."
      }
    ],
    "tip": "Un juego limitado por GPU no se acelera elevando la prioridad de su proceso.",
    "warning": "Nunca selecciones Tiempo real para procesos normales: puede perjudicar la respuesta del sistema.",
    "challenge": "Explicá por qué forzar afinidad a dos núcleos puede empeorar un programa multihilo."
  },
  {
    "id": 17,
    "goal": "Aprender a leer el Registro sin modificar Windows.",
    "basics": "El Registro es una base jerárquica de configuración. HKCU se refiere al usuario actual; HKLM afecta al equipo. Leer una clave no es lo mismo que cambiarla.",
    "steps": [
      {
        "title": "Abrí el editor",
        "why": "Ejecutá regedit y observá las ramas principales.",
        "code": "Start-Process regedit.exe",
        "expect": "Puede aparecer una solicitud del sistema según permisos. No aceptes cambios ajenos a la lección."
      },
      {
        "title": "Consultá preferencias del Explorador",
        "why": "Get-ItemProperty lee valores si la clave existe.",
        "code": "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -ErrorAction SilentlyContinue | Select-Object Hidden,HideFileExt",
        "expect": "Verás valores DWORD o ninguna fila. No asumas qué significan sin leer documentación."
      },
      {
        "title": "Explorá una clave de prueba inexistente",
        "why": "Test-Path no crea ni elimina entradas.",
        "code": "Test-Path 'HKCU:\\Software\\EVO-LABS-PRUEBA'",
        "expect": "Normalmente devuelve False salvo que exista esa clave."
      }
    ],
    "tip": "Antes de cambiar cualquier valor, anotá clave completa, tipo, dato original, motivo y cómo restaurarlo.",
    "warning": "Nunca edites HKLM, SAM, SECURITY o servicios críticos como experimento de iniciación.",
    "challenge": "Explicá diferencia entre clave, valor y dato, y qué significa HKCU."
  },
  {
    "id": 18,
    "goal": "Separar tweaks de Registro documentados de promesas sin pruebas.",
    "basics": "Circulan ajustes que prometen duplicar FPS o liberar RAM. Para aceptar una mejora hay que proponer un mecanismo, medirla y repetirla en condiciones comparables.",
    "steps": [
      {
        "title": "Registrá la versión de Windows",
        "why": "Un ajuste puede aplicar a una compilación y no a otra.",
        "code": "Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber",
        "expect": "Aparecerán datos reportados por el sistema."
      },
      {
        "title": "Elegí una métrica antes de tocar nada",
        "why": "Tomá una línea base de procesos y memoria sin cambios.",
        "code": "Get-Process | Measure-Object | Select-Object Count",
        "expect": "Verás la cantidad de procesos en ese instante; menos procesos no demuestra más FPS."
      },
      {
        "title": "Diseñá un experimento A/B",
        "why": "Escribí qué ajuste revisarías, por qué debería funcionar y qué indicador medirías.",
        "expect": "Una hipótesis es distinta de una conclusión; aún no realizaste ningún cambio."
      }
    ],
    "tip": "En una prueba real compará al menos tres repeticiones por condición y registrá variabilidad, temperatura, versión y aplicaciones abiertas.",
    "warning": "No apliques archivos .reg encontrados en Internet sin inspeccionar cada línea, hacer respaldo y conocer su reversión.",
    "challenge": "Proponé una supuesta mejora viral y explicá cómo podrías demostrar que es falsa."
  },
  {
    "id": 19,
    "goal": "Saber para qué sirve gpedit.msc y qué diferencias existen con Regedit.",
    "basics": "Las Directivas de grupo administran configuraciones organizadas. En algunas ediciones de Windows Home el editor local no está disponible; eso no significa que todas las políticas dejen de existir.",
    "steps": [
      {
        "title": "Verificá la edición de Windows",
        "why": "Consultá información del sistema.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber",
        "expect": "Verás una denominación de edición y compilación."
      },
      {
        "title": "Abrí el editor de directivas si existe",
        "why": "Probá ejecutar gpedit.msc desde Inicio. Si no está disponible, anotá ese dato.",
        "code": "Start-Process gpedit.msc",
        "expect": "Podría abrirse el editor o fallar con un mensaje de archivo no encontrado."
      },
      {
        "title": "Comprendé el alcance de las políticas",
        "why": "Observá las ramas de configuración del equipo y del usuario, sin modificar opciones.",
        "expect": "Las políticas pueden variar según dominio, edición y controles administrativos."
      }
    ],
    "tip": "Una directiva administrada puede volver a aplicar valores aunque alguien los cambie manualmente en Regedit.",
    "warning": "No fuerces instalaciones no oficiales de gpedit ni alteres políticas de seguridad por estética.",
    "challenge": "Explicá por qué una política puede prevalecer sobre una preferencia configurada por el usuario."
  },
  {
    "id": 20,
    "goal": "Entender cómo Windows encuentra ejecutables y para qué sirve PATH.",
    "basics": "PATH es una lista de carpetas de búsqueda para comandos. Si se altera, un programa puede dejar de encontrarse o resolverse hacia otro ejecutable.",
    "steps": [
      {
        "title": "Mostrá PATH de tu sesión",
        "why": "Esta consulta solo muestra texto; cada carpeta está separada por punto y coma.",
        "code": "$env:Path -split ';' | Select-Object -First 15",
        "expect": "Aparecerán rutas de sistema y de aplicaciones instaladas."
      },
      {
        "title": "Comprobá dónde vive un ejecutable",
        "why": "Get-Command resuelve un comando según el contexto actual.",
        "code": "Get-Command notepad.exe | Select-Object Name,Source,CommandType",
        "expect": "Obtendrás una ruta o datos de resolución según la instalación."
      },
      {
        "title": "Compará con una variable propia de la sesión",
        "why": "Definí una variable local de ejemplo; no modifica las variables permanentes del sistema.",
        "code": "$EVO_Ejemplo = 'laboratorio'; $EVO_Ejemplo",
        "expect": "Verás 'laboratorio'. La variable deja de existir al cerrar esta sesión."
      }
    ],
    "tip": "Si un comando no funciona, usá Get-Command antes de reinstalar un programa.",
    "warning": "No reemplaces PATH del equipo por una lista descargada: podrías dejar inaccesibles herramientas esenciales.",
    "challenge": "Explicá para qué sirve el punto y coma en PATH y por qué el orden de las rutas importa."
  }
];
