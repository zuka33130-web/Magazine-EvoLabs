import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Windows extremo II · Investigaciones 113–125. Consultas, hipótesis y medición reproducible. */
export const EVO_MAGAZINE_WINDOWS_B: EvoMagazineArticle[] = [
  {
    "id": 113,
    "goal": "Comprender por qué algunos procesos no permiten terminarse o inspeccionarse.",
    "basics": "Windows protege componentes de sesión, autenticación y kernel para mantener estabilidad y seguridad. Que se rechace el acceso no implica virus; algunas aplicaciones también funcionan con otro usuario o nivel de privilegio.",
    "steps": [
      {
        "title": "Identificá procesos fundamentales",
        "why": "Consultá algunos nombres comunes, sin intentar detenerlos.",
        "code": "Get-Process | Where-Object ProcessName -match 'csrss|smss|lsass|wininit|services' | Select-Object Name,Id",
        "expect": "Podés encontrar varios procesos de sesión; su cantidad varía con Windows."
      },
      {
        "title": "Consultá propietarios cuando esté permitido",
        "why": "CIM expone una lista de procesos sin revelar siempre rutas protegidas.",
        "code": "Get-CimInstance Win32_Process | Select-Object -First 20 Name,ProcessId,ExecutablePath",
        "expect": "Las propiedades vacías pueden deberse a restricciones legítimas."
      },
      {
        "title": "Revisá tu identidad actual",
        "why": "El token decide qué acciones y consultas tenés permitidas.",
        "code": "whoami /groups",
        "expect": "Vas a ver grupos y atributos de tu cuenta, no permisos absolutos sobre todos los procesos."
      }
    ],
    "tip": "Truco EVO: antes de ejecutar PowerShell como administrador preguntate si realmente necesitás más privilegios para la prueba.",
    "warning": "No intentes finalizar lsass.exe, csrss.exe o wininit.exe; podrías provocar pérdida de sesión o un fallo crítico.",
    "challenge": "Explicá con un ejemplo la diferencia entre proceso protegido, permisos insuficientes y archivo malicioso."
  },
  {
    "id": 114,
    "goal": "Aprender cinco técnicas de PowerShell que ahorran tiempo sin instalar aplicaciones.",
    "basics": "PowerShell trabaja con objetos; el operador de canalización transmite objetos completos y permite filtrar propiedades, medir, agrupar y ordenar. Eso evita leer largas salidas de texto y copiar datos a mano.",
    "steps": [
      {
        "title": "Filtrá por condición",
        "why": "Where-Object selecciona elementos que cumplen una regla lógica.",
        "code": "Get-Process | Where-Object {$_.WorkingSet64 -gt 100MB} | Select-Object -First 10 Name,Id",
        "expect": "Verás hasta diez procesos con memoria residente superior al umbral en ese instante."
      },
      {
        "title": "Ordená y agrupá",
        "why": "Sort-Object organiza el resultado, Group-Object resume tipos o estados.",
        "code": "Get-Service | Group-Object Status | Select-Object Name,Count",
        "expect": "Aparece un resumen de servicios en ejecución y detenidos."
      },
      {
        "title": "Construí un informe reutilizable en pantalla",
        "why": "[pscustomobject] combina varias consultas sin alterar el host.",
        "code": "[pscustomobject]@{Hora=Get-Date; Procesos=(Get-Process | Measure-Object).Count; Usuario=$env:USERNAME}",
        "expect": "Se muestra una ficha con valores en el instante de ejecución."
      }
    ],
    "tip": "Truco EVO: aprendé Get-Help, Get-Member, Where-Object, Sort-Object y Measure-Object; son cinco recursos que sirven en casi cualquier laboratorio.",
    "warning": "Antes de copiar un comando desconocido, leé cada segmento y comprobá que no use acciones de eliminación o escritura.",
    "challenge": "Cambiá el informe para agregar el número de servicios activos y explicá el operador de canalización."
  },
  {
    "id": 115,
    "goal": "Identificar aplicaciones innecesarias sin confundir instalación con consumo.",
    "basics": "Un programa instalado ocupa espacio, pero puede no ejecutar nada al iniciar Windows. La decisión de desinstalar debe basarse en uso, dependencias, integraciones y respaldo de datos, no solo en el tamaño del instalador.",
    "steps": [
      {
        "title": "Enumerá aplicaciones de desinstalación conocidas",
        "why": "Leemos el registro de aplicaciones sin disparar reparaciones MSI.",
        "code": "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' -ErrorAction SilentlyContinue | Where-Object DisplayName | Select-Object -First 20 DisplayName,Publisher,DisplayVersion",
        "expect": "El inventario puede ser parcial; apps del usuario y Store pueden almacenarse de otra manera."
      },
      {
        "title": "Consultá el listado de aplicaciones de Windows",
        "why": "Get-AppxPackage solo enumera paquetes para el usuario actual.",
        "code": "Get-AppxPackage | Select-Object -First 15 Name,Version",
        "expect": "Podés ver paquetes que no aparecen en Aplicaciones instaladas."
      },
      {
        "title": "Observá lo que inicia con la sesión",
        "why": "Un programa instalado no tiene por qué aparecer aquí.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object -First 15 Name,Location",
        "expect": "La lista de inicios es parcial y no mide consumo sostenido."
      }
    ],
    "tip": "Truco EVO: antes de desinstalar, anotá datos guardados, instalador oficial y forma de regresar a la versión anterior.",
    "warning": "No elimines paquetes UWP ni componentes de Microsoft por scripts masivos de debloat que no entendés.",
    "challenge": "Clasificá cinco programas en instalado, activo, iniciado automáticamente y prescindible; explicá la diferencia."
  },
  {
    "id": 116,
    "goal": "Descubrir cómo el Registro conserva configuraciones entre sesiones.",
    "basics": "El Registro se organiza en colmenas (hives) persistentes y vistas de usuario o máquina. Las escrituras se guardan y vuelven a leerse; un archivo .reg exportado no es una imagen total del sistema ni garantiza restauración de permisos.",
    "steps": [
      {
        "title": "Reconocé las ramas principales",
        "why": "Get-PSDrive del proveedor Registry permite identificar las unidades conocidas.",
        "code": "Get-PSDrive -PSProvider Registry | Select-Object Name,Root",
        "expect": "Habitualmente aparecerán HKCU y HKLM como unidades de PowerShell."
      },
      {
        "title": "Consultá una preferencia persistente",
        "why": "Leé un valor del Explorador sin modificarlo.",
        "code": "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -Name HideFileExt -ErrorAction SilentlyContinue | Select-Object HideFileExt",
        "expect": "Puede verse 0, 1 o nada, según política y perfil."
      },
      {
        "title": "Investigá la visión del sistema",
        "why": "La misma clave puede existir por usuario o máquina y resultar distinta.",
        "code": "Test-Path 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer'",
        "expect": "Se informa si existe la ruta de máquina, sin tocar la de usuario."
      }
    ],
    "tip": "Truco EVO: distinguí respaldo de una rama .reg, punto de restauración e imagen del sistema: no son intercambiables.",
    "warning": "No edites colmenas SAM, SECURITY o SYSTEM para aprender persistencia; pueden contener secretos y configuración crítica.",
    "challenge": "Explicá qué significa hive, por qué HKCU es distinto de HKLM y qué limitación tiene una exportación .reg."
  },
  {
    "id": 117,
    "goal": "Entender cómo Windows reparte tiempo de CPU entre procesos e hilos.",
    "basics": "El planificador decide qué hilos pueden ejecutarse según prioridad, disponibilidad y políticas. Ni el orden en el Administrador de tareas ni un PID grande determinan quién se ejecuta primero.",
    "steps": [
      {
        "title": "Contá los núcleos y procesadores lógicos",
        "why": "Distinguir núcleos físicos de hilos lógicos ayuda a entender paralelismo.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors",
        "expect": "En algunos procesadores hay más procesadores lógicos que núcleos; esto no equivale a velocidad doble."
      },
      {
        "title": "Consultá prioridad de algunos procesos",
        "why": "PriorityClass describe una clase de prioridad, no la prioridad momentánea de cada hilo.",
        "code": "Get-Process | Select-Object -First 15 Name,Id,PriorityClass",
        "expect": "La consulta puede mostrar prioridades o errores de acceso en instancias protegidas."
      },
      {
        "title": "Contá los hilos por proceso",
        "why": "El número de hilos cambia con la carga.",
        "code": "Get-Process | Select-Object -First 10 Name,Id,@{N='Hilos';E={$_.Threads.Count}}",
        "expect": "Podés ver más hilos que núcleos; no todos se ejecutan al mismo tiempo."
      }
    ],
    "tip": "Truco EVO: un juego limitado por GPU no necesariamente acelera al cambiar la prioridad de sus hilos.",
    "warning": "Nunca utilices prioridad Tiempo real para intentar acelerar un juego; podés bloquear la respuesta del sistema.",
    "challenge": "Explicá por qué un proceso con 80 hilos puede ejecutarse en una CPU de 12 procesadores lógicos."
  },
  {
    "id": 118,
    "goal": "Distinguir la interfaz visible del sistema de sus capas internas.",
    "basics": "El escritorio y sus ventanas son aplicaciones que interactúan con servicios, controladores y el kernel NT. Aunque el escritorio deje de responder, la red y algunos servicios pueden seguir operativos.",
    "steps": [
      {
        "title": "Identificá la interfaz del usuario",
        "why": "Explorer suele mostrar escritorio y barra de tareas.",
        "code": "Get-Process explorer -ErrorAction SilentlyContinue | Select-Object Name,Id,Path",
        "expect": "Normalmente encontrarás el shell del usuario."
      },
      {
        "title": "Consultá servicios independientes",
        "why": "Windows administra servicios sin depender de que abras una ventana.",
        "code": "Get-Service | Where-Object {$_.Status -eq 'Running'} | Select-Object -First 12 Name,Status",
        "expect": "Aparecen servicios en ejecución y no necesariamente asociados a Explorer."
      },
      {
        "title": "Reconocé el kernel como parte de Windows",
        "why": "Información de sistema permite ubicar la arquitectura instalada.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,OSArchitecture,Version",
        "expect": "Obtendrás la edición y arquitectura que dan contexto al laboratorio."
      }
    ],
    "tip": "Truco EVO: separá síntoma de interfaz (pantalla congelada) de un fallo de sistema completo antes de reiniciar.",
    "warning": "No cambies el shell del registro Winlogon ni fuerces el cierre de Explorer para probar la teoría.",
    "challenge": "Dibujá cómo una aplicación solicita un archivo a través de Windows y cómo interviene un driver."
  },
  {
    "id": 119,
    "goal": "Averiguar qué significa ver un proceso suspendido y cuándo es normal.",
    "basics": "Windows puede suspender ciertas aplicaciones para ahorrar CPU y batería cuando no se usan. Un proceso suspendido continúa ocupando algunos recursos; no significa que esté infectado ni que Windows lo haya eliminado.",
    "steps": [
      {
        "title": "Enumerá procesos en reposo",
        "why": "Get-Process lista procesos, pero no ofrece un indicador universal de suspensión de aplicaciones.",
        "code": "Get-Process | Select-Object -First 20 Name,Id,CPU,WorkingSet64",
        "expect": "Verás consumo acumulado y memoria residente; no prueba suspensión."
      },
      {
        "title": "Consultá el tiempo de actividad del equipo",
        "why": "Un proceso puede permanecer sin CPU mientras el sistema sigue funcionando.",
        "code": "(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime",
        "expect": "Una fecha de inicio no informa el estado de suspensión de cada aplicación."
      },
      {
        "title": "Observá aplicaciones con Administrador de tareas",
        "why": "Abrí la pestaña Procesos y fijate si la interfaz presenta un estado como Suspendido.",
        "code": "Start-Process taskmgr.exe",
        "expect": "La columna Estado depende de vista y versión; puede faltar."
      }
    ],
    "tip": "Truco EVO: no confundas suspendido, detenido, inactivo, minimizado y en segundo plano: son conceptos distintos.",
    "warning": "No intentes reanudar o terminar procesos protegidos ni interpretes todo proceso suspendido como desperdicio.",
    "challenge": "Describí por qué una app suspendida puede seguir consumiendo algo de RAM sin CPU."
  },
  {
    "id": 120,
    "goal": "Aprender a investigar un servicio detenido sin poner en riesgo el sistema.",
    "basics": "Un servicio puede detenerse por diseño cuando no hace falta o fallar por una dependencia. Lo correcto es identificar su nombre, disparadores y consumidores antes de decidir si cambiar su inicio.",
    "steps": [
      {
        "title": "Observá el estado de un servicio elegido",
        "why": "Usamos Spooler solo como ejemplo de consulta; puede no existir en sistemas personalizados.",
        "code": "Get-Service Spooler -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType",
        "expect": "Stopped puede ser normal si no imprimís; Running también."
      },
      {
        "title": "Consultá dependencias",
        "why": "Los componentes que requiere el servicio ayudan a entender su función.",
        "code": "Get-Service Spooler -ErrorAction SilentlyContinue | Select-Object -ExpandProperty RequiredServices",
        "expect": "Aparecerá una lista de dependencias o ninguna, según disponibilidad."
      },
      {
        "title": "Buscá errores relacionados",
        "why": "Una falla real suele necesitar evento, fecha y contexto.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='System';StartTime=(Get-Date).AddDays(-1)} -MaxEvents 25 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Podés buscar el evento correspondiente; una muestra limitada quizá no lo incluya."
      }
    ],
    "tip": "Truco EVO: si un servicio deja de funcionar, identificá primero el síntoma visible del usuario y comprobá cómo restaurarlo.",
    "warning": "No detengas servicios críticos ni deshabilites Spooler, red o audio en una PC de trabajo para experimentar.",
    "challenge": "Planteá una hipótesis para 'no puedo imprimir' y una comprobación de solo lectura que la refutaría."
  },
  {
    "id": 121,
    "goal": "Aprender a medir cien procesos sin crear ni cerrar ninguno.",
    "basics": "Cien procesos no es un objetivo bueno ni malo: refleja aplicaciones, aislamiento y servicios. El experimento compara el consumo de los procesos que existen, sin lanzar cien ejecutables ni sumar incorrectamente memoria compartida.",
    "steps": [
      {
        "title": "Contá todos los procesos",
        "why": "Obtené el tamaño de la muestra real.",
        "code": "Get-Process | Measure-Object | Select-Object Count",
        "expect": "Puede haber menos o más de cien procesos. El número depende de qué esté abierto."
      },
      {
        "title": "Tomá hasta cien procesos para una tabla",
        "why": "Registrá nombre, PID y memoria residente aproximada, sin modificar ejecución.",
        "code": "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 100 Name,Id,@{N='MiB';E={[math]::Round($_.WorkingSet64/1MB,1)}}",
        "expect": "Se mostrarán hasta cien filas, ordenadas por memoria residente."
      },
      {
        "title": "Compará con CPU acumulada",
        "why": "No confundas segundos de CPU con porcentaje en tiempo real.",
        "code": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 Name,Id,CPU",
        "expect": "Los más antiguos pueden acumular más segundos aunque ahora estén ociosos."
      }
    ],
    "tip": "Truco EVO: no sumes el Working Set para afirmar 'RAM total consumida'; los procesos comparten páginas y Windows mantiene otras reservas.",
    "warning": "No ejecutes scripts que creen o finalicen 100 procesos a modo de estrés en una PC de producción.",
    "challenge": "Calculá cuánto cambia el conteo al abrir tres aplicaciones conocidas y argumentá si fue una mejora o solo una diferencia."
  },
  {
    "id": 122,
    "goal": "Descubrir herramientas avanzadas oficiales que no aparecen en la portada de Configuración.",
    "basics": "Windows incluye consolas de administración y diagnóstico como Información del sistema, Visor de eventos, Monitor de recursos y herramientas de directivas. La presencia de una herramienta no obliga a modificar ajustes.",
    "steps": [
      {
        "title": "Abrí información del sistema",
        "why": "msinfo32 resume hardware y configuración de Windows.",
        "code": "Start-Process msinfo32.exe",
        "expect": "Aparecerá un inventario del equipo para consulta."
      },
      {
        "title": "Consultá energía disponible",
        "why": "powercfg /a informa estados admitidos y por qué otros no están disponibles.",
        "code": "powercfg /a",
        "expect": "Verás suspensión, hibernación o estados no disponibles según hardware."
      },
      {
        "title": "Examiná herramientas y versiones de Windows",
        "why": "Get-ComputerInfo ofrece un inventario amplio; no altera nada.",
        "code": "Get-ComputerInfo | Select-Object WindowsProductName,OsArchitecture,OsBuildNumber",
        "expect": "Podés obtener denominación, arquitectura y compilación reportadas."
      }
    ],
    "tip": "Truco EVO: creá una carpeta de notas con nombres de consolas: msinfo32, eventvwr, resmon, perfmon, services.msc y taskschd.msc.",
    "warning": "No cambies directivas, opciones de arranque ni configuración del hardware mientras estás aprendiendo a navegar.",
    "challenge": "Elegí dos consolas, contá para qué sirven y qué resultado puede aportar cada una a una auditoría."
  },
  {
    "id": 123,
    "goal": "Elegir la edición de Windows según software, hardware, administración y soporte.",
    "basics": "Home, Pro, Enterprise y LTSC atienden necesidades y modelos de licencia diferentes. LTSC de Windows Enterprise está dirigido a casos de uso específicos: no es una versión mágica para gaming, y las ediciones IoT/LTSC no tienen idénticas condiciones de soporte.",
    "steps": [
      {
        "title": "Identificá tu edición y compilación",
        "why": "La compatibilidad debe empezar por los datos reales del equipo.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,OSArchitecture",
        "expect": "Verás nombre de edición y arquitectura."
      },
      {
        "title": "Consultá capacidad de CPU y RAM",
        "why": "El procesador y memoria instalados condicionan compatibilidad, sin determinar qué edición conviene por sí solos.",
        "code": "Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors; Get-CimInstance Win32_ComputerSystem | Select-Object TotalPhysicalMemory",
        "expect": "Obtendrás hardware básico, no una certificación de compatibilidad del fabricante."
      },
      {
        "title": "Prepará tu matriz de elección",
        "why": "Anotá cinco columnas: drivers, apps, requisitos de administración, ciclo de soporte y licencia válida.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model",
        "expect": "El modelo exacto permite consultar requisitos y descargas oficiales."
      }
    ],
    "tip": "Truco EVO: Microsoft publica fechas de soporte diferentes para Enterprise LTSC y IoT Enterprise LTSC; verificá la edición precisa antes de elegir.",
    "warning": "No instales ISOs modificadas o licencias destinadas a dispositivos específicos sin revisar su autorización legal y compatibilidad.",
    "challenge": "Compará Home, Pro y Enterprise LTSC en una tabla para tu propia PC y justificá la decisión sin usar 'consume menos RAM' como único criterio."
  },
  {
    "id": 124,
    "goal": "Construir perfiles de uso diferentes sin reinstalar Windows para cada tarea.",
    "basics": "Una máquina puede priorizar silencio y autonomía para oficina, multitarea para diseño, herramientas de desarrollo para programar o estabilidad de FPS para juegos. La configuración correcta depende de la tarea y sus métricas.",
    "steps": [
      {
        "title": "Identificá el plan de energía activo",
        "why": "Un plan es solo una dimensión del perfil de trabajo.",
        "code": "powercfg /getactivescheme",
        "expect": "Aparece un identificador y nombre de plan sin aplicar cambios."
      },
      {
        "title": "Inventariá aplicaciones que inician",
        "why": "Revisá qué carga tu sesión antes de abrir juegos o herramientas de diseño.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object -First 15 Name,Location",
        "expect": "La lista representa algunas ubicaciones de inicio; no todas."
      },
      {
        "title": "Registrá el contexto gráfico y CPU",
        "why": "Los drivers y el hardware condicionan las opciones de cada perfil.",
        "code": "Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion; Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores",
        "expect": "Aparecerán dispositivos reportados, no una optimización automática."
      }
    ],
    "tip": "Truco EVO: definí cuatro perfiles escritos (juegos, diseño, programación y uso diario) y medí las mismas variables antes de personalizarlos.",
    "warning": "No alteres servicios Intel, drivers de video ni protecciones para obtener supuestas mejoras de FPS.",
    "challenge": "Elegí tu perfil preferido y definí tres métricas que deben mejorar y tres funciones que nunca deben fallar."
  },
  {
    "id": 125,
    "goal": "Diseñar una auditoría completa para que Windows responda a tus necesidades y puedas demostrarlo.",
    "basics": "La meta final no es un porcentaje espectacular sino un sistema confiable. El laboratorio mide estado inicial, define objetivos, registra pruebas y exige restauración ante efectos secundarios.",
    "steps": [
      {
        "title": "Creá un expediente sin tocar configuraciones",
        "why": "Tomá la línea base de Windows, inicio y RAM.",
        "code": "$os=Get-CimInstance Win32_OperatingSystem; [pscustomobject]@{Windows=$os.Caption; Build=$os.BuildNumber; Inicio=$os.LastBootUpTime; RAM_Libre_GiB=[math]::Round($os.FreePhysicalMemory/1MB,2)}",
        "expect": "Tendrás una ficha de la instalación con memoria libre aproximada."
      },
      {
        "title": "Medí procesos, servicios y plan activo",
        "why": "Las cifras sólo sirven si anotás escenario y momento.",
        "code": "[pscustomobject]@{Procesos=(Get-Process | Measure-Object).Count; ServiciosActivos=(Get-Service | Where-Object Status -eq 'Running' | Measure-Object).Count}; powercfg /getactivescheme",
        "expect": "Se muestran conteos y plan activo, sin modificar el equipo."
      },
      {
        "title": "Verificá conectividad y seguridad antes de optimizar",
        "why": "Los controles esenciales deben seguir funcionando después de cualquier mejora futura.",
        "code": "Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name,LinkSpeed; Get-NetFirewallProfile | Select-Object Name,Enabled",
        "expect": "Se comprueban interfaces y perfiles de firewall; el resultado no certifica Internet ni seguridad total."
      }
    ],
    "tip": "Truco EVO: el caso de referencia de una mini PC con 11% de RAM en reposo debe documentar qué significa esa cifra, en qué condiciones se midió y qué funciones siguen operativas; no extrapolarla.",
    "warning": "No sacrifiques seguridad, actualizaciones, recuperación, drivers ni estabilidad por conseguir el mínimo de procesos o RAM.",
    "challenge": "Construí tu plan personal con: objetivo, medición base, una variable por intervención, tres repeticiones, resultado, posibles efectos secundarios y procedimiento de reversión."
  }
];
