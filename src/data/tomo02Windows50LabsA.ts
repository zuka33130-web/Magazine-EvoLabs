import type { EvoWindowsFieldLab } from './tomo02Windows50LabTypes';
export const EVO_W50_LABS_A: EvoWindowsFieldLab[] = [
  {
    "number": 1,
    "discovery": "Incluso con el escritorio quieto hay trabajo legítimo de servicios, tareas y mantenimiento. Lo inesperado es la correlación: muchos procesos aparecen, pero sólo algunos acumulan CPU durante la ventana observada.",
    "mechanism": "Un hilo puede pasar de espera a ejecutable cuando ocurre un evento; Get-Process.CPU devuelve segundos acumulados desde el inicio, no porcentaje instantáneo. El Programador de tareas puede iniciar procesos por horario, inicio de sesión o condición. Un pico observado después del hecho no prueba qué lo originó.",
    "preparation": "Reiniciá si es conveniente, esperá diez minutos, anotá hora y programas abiertos. No modifiques servicios ni tareas. Medí tres intervalos de cinco segundos.",
    "experiment": [
      "Registrá el consumo de CPU al inicio y al final del mismo intervalo por PID.",
      "Repetí la medición en reposo y con una aplicación abierta.",
      "Si un PID destaca repetidamente, cruzalo con ruta, firma y tareas del mismo período."
    ],
    "command": "$a=@{}; Get-Process | ? {$null -ne $_.CPU} | % {$a[$_.Id]=$_.CPU}\n$n=[Environment]::ProcessorCount; $t=[Diagnostics.Stopwatch]::StartNew()\nStart-Sleep 5; $t.Stop()\nGet-Process | ? {$a.ContainsKey($_.Id) -and $null -ne $_.CPU} |\n % { [pscustomobject]@{PID=$_.Id;Nombre=$_.Name;\n UsoMedioPct=[math]::Round(100*($_.CPU-$a[$_.Id])/$t.Elapsed.TotalSeconds/$n,2)} } |\n sort UsoMedioPct -Descending | select -First 12",
    "evidence": "El porcentaje es una estimación media del total de procesadores lógicos en esos cinco segundos. Anotá PID, hora y si el nombre se repite en nuevas muestras.",
    "pitfall": "Un proceso puede terminar o cambiar de PID entre muestras; un servicio dentro de svchost no se atribuye individualmente por esta salida. La muestra no mide actividad anterior.",
    "action": "Investigá sólo procesos persistentemente activos relacionados con un síntoma, no el número total de servicios.",
    "recovery": "Solo lectura: no requiere revertir cambios.",
    "challenge": "Conseguí dos capturas: antes y después de abrir una app. ¿Qué cambió y qué permaneció inactivo?",
    "references": [
      {
        "name": "Get-Process",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      },
      {
        "name": "Process Explorer",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 2,
    "discovery": "Cien procesos no implican cien programas consumiendo CPU: el aislamiento multiproceso crea ayudantes y servicios ociosos que apenas trabajan.",
    "mechanism": "Los procesos encapsulan memoria virtual, identificadores y hilos. Un único navegador puede tener renderizadores, decodificadores y extensiones separados. El Working Set puede incluir páginas compartidas, por lo que su suma no representa la RAM global.",
    "preparation": "Abrí Administrador de tareas y Process Explorer si está instalado; no cierres procesos. Capturá los totales antes de iniciar una aplicación conocida.",
    "experiment": [
      "Contá procesos por nombre y compará grupos antes/después de abrir Firefox o una app con pestañas.",
      "Seleccioná un PID con mayor memoria privada y anotá su ruta y hora de creación.",
      "Explicá si el nuevo número supone consumo persistente o sólo arquitectura de aislamiento."
    ],
    "command": "Get-Process | Group-Object ProcessName |\n sort Count -Descending | select -First 20 Name,Count\nGet-Process | sort PrivateMemorySize64 -Descending |\n select -First 12 Name,Id,@{N='PrivateMB';E={[math]::Round($_.PrivateMemorySize64/1MB,1)}}",
    "evidence": "Una familia de procesos crece al abrir pestañas y cambia al cerrarlas. Eso demuestra relación con la aplicación, no un problema de Windows.",
    "pitfall": "PrivateMemorySize64 no equivale a RAM física; no sumes Working Sets para obtener el uso total del sistema.",
    "action": "Optimiza la aplicación responsable sólo si hay presión de memoria o CPU demostrable y repetible.",
    "recovery": "Solo lectura. Cerrá la app de prueba normalmente.",
    "challenge": "Construí el árbol de cinco procesos de una sola aplicación y explicá por qué existen.",
    "references": [
      {
        "name": "Get-Process",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      },
      {
        "name": "Process Explorer",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 3,
    "discovery": "Que haya muchos svchost.exe puede ser normal: cada uno hospeda uno o varios servicios, pero su nombre no cuenta qué servicio hizo el trabajo.",
    "mechanism": "El Service Control Manager administra inicio, dependencias y estado. El agrupamiento de servicios varía por versión y recursos del equipo. Para detectar un ejecutable impostor hace falta correlacionar ruta, firma, PID y cuenta.",
    "preparation": "Abrí terminal normal y, si hay información restringida, repetí como administrador sólo para leer. No deshabilites ningún svchost.",
    "experiment": [
      "Listá el mapa servicios↔PID; localizá uno con más de un servicio.",
      "Consultá la ruta ejecutable del PID concreto y contrastala con una firma válida.",
      "Si hay consumo, medí actividad por intervalos antes de atribuir responsabilidad al host."
    ],
    "command": "Get-CimInstance Win32_Service | ? {$_.ProcessId -gt 0} |\n select Name,DisplayName,State,StartMode,ProcessId | sort ProcessId\nGet-CimInstance Win32_Process -Filter \"Name='svchost.exe'\" |\n select ProcessId,ExecutablePath,CommandLine",
    "evidence": "Dos servicios pueden compartir PID y varias instancias pueden coexistir. El mapa es contextual, no un detector de malware.",
    "pitfall": "Un nombre de archivo y una ruta esperada no garantizan legitimidad; verificar firma digital y origen agrega confianza, no certeza total.",
    "action": "Investigá sólo una ruta, firma o patrón discordante; documentá antes de actuar.",
    "recovery": "No se modifican servicios.",
    "challenge": "Encontrá tres svchost legítimos y anotá qué servicios contiene cada uno sin cerrar nada.",
    "references": [
      {
        "name": "Windows services",
        "url": "https://learn.microsoft.com/en-us/windows/win32/services/services"
      },
      {
        "name": "Autoruns",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 4,
    "discovery": "Una tarea programada puede ejecutarse sin ventana y explicar un pico que parecía misterioso, pero la definición de una tarea no demuestra que se ejecutó.",
    "mechanism": "Desencadenadores como logon, idle, evento y tiempo pueden activar tareas. Get-ScheduledTask describe configuración; Get-ScheduledTaskInfo expone últimas ejecuciones y resultados, que dependen de permisos e historial.",
    "preparation": "No habilites historial ni cambies disparadores para construir un caso. Anotá período de interés y estado de mantenimiento.",
    "experiment": [
      "Identificá tres tareas con desencadenadores distintos.",
      "Cruzá última ejecución y último resultado; verificá que la hora coincide con el síntoma.",
      "Si no hay historial, marcá la conclusión como no determinada."
    ],
    "command": "Get-ScheduledTask | ? {$_.State -ne 'Disabled'} | select -First 12 |\n % { $info=$null;try{$info=$_|Get-ScheduledTaskInfo}catch{}\n [pscustomobject]@{Tarea=$_.TaskPath+$_.TaskName;Estado=$_.State;\n Ultima=$info.LastRunTime;Resultado=$info.LastTaskResult} }",
    "evidence": "Una tarea con último inicio registrado dentro del intervalo es una pista temporal; no identifica por sí sola bytes escritos ni CPU consumida.",
    "pitfall": "El código de último resultado no indica automáticamente error grave; algunas tareas no reportan datos útiles en todas las versiones.",
    "action": "Si una tarea aparece ligada a lentitud, inspeccioná acción y desencadenador, y repetí medición antes de cambiar nada.",
    "recovery": "Solo lectura.",
    "challenge": "Elegí una tarea de mantenimiento y reconstruí su línea de tiempo sin ejecutarla.",
    "references": [
      {
        "name": "Get-ScheduledTaskInfo",
        "url": "https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/get-scheduledtaskinfo"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 5,
    "discovery": "El arranque de Windows tiene etapas invisibles antes del escritorio: firmware, Boot Manager, kernel, servicios y shell; medir sólo el tiempo hasta el logo engaña.",
    "mechanism": "El firmware inicializa hardware y entrega control al gestor de arranque; posteriormente Windows prepara drivers, kernel y sesión. Fast Startup y reinicio completo pueden producir cronologías diferentes.",
    "preparation": "Anotá si medís arranque en frío, reinicio o reanudación; verificá que el canal Diagnostics-Performance exista y que haya eventos recientes.",
    "experiment": [
      "Consultá eventos del registro Diagnostics-Performance y observá BootTime y MainPathBootTime cuando estén presentes.",
      "Compará al menos tres reinicios bajo igual condición.",
      "No atribuyas toda la demora al SSD sólo porque Windows tarda en mostrar el escritorio."
    ],
    "command": "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Diagnostics-Performance/Operational';Id=100} -MaxEvents 5 -ErrorAction SilentlyContinue |\n select TimeCreated,Id,@{N='Texto';E={$_.Message.Substring(0,[Math]::Min(450,$_.Message.Length))}}",
    "evidence": "Los eventos 100 pueden contener duraciones por fase; una captura sin eventos también es resultado válido, dependiendo de auditoría y versión.",
    "pitfall": "EventId 100 no mide el firmware UEFI completo ni cada aplicación de inicio; BootTime no equivale a cronometrar físicamente desde el botón.",
    "action": "Si el tiempo de arranque está alterado, examiná inicio automático y errores antes de instalar 'aceleradores'.",
    "recovery": "Solo lectura.",
    "challenge": "Separá el tiempo hasta pantalla de inicio del tiempo hasta equipo realmente utilizable.",
    "references": [
      {
        "name": "Windows Performance Toolkit",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 6,
    "discovery": "Explorer.exe administra el shell pero Windows puede seguir ejecutando procesos cuando se cierra; perder la barra de tareas no es perder el sistema.",
    "mechanism": "El shell interactivo suele ser explorer.exe, distinto de procesos del kernel y del administrador de sesiones. Reiniciarlo puede restaurar componentes visuales sin reiniciar toda la máquina, pero cerrar el shell no debe confundirse con una solución general.",
    "preparation": "Usá sólo consulta de estado; NO mates explorer ni servicios durante este laboratorio. Anotá tareas abiertas.",
    "experiment": [
      "Consultá Explorer y otros procesos del sistema.",
      "Verificá que el escritorio depende del shell y las aplicaciones poseen PID independientes.",
      "Si Explorer falla por sí solo, guardá hora, registro de Application y mensaje de error antes de reiniciarlo desde Administrador de tareas."
    ],
    "command": "Get-Process explorer,dwm,winlogon,csrss -ErrorAction SilentlyContinue |\n select Name,Id,StartTime,Responding\nGet-WinEvent -FilterHashtable @{LogName='Application';Level=2;StartTime=(Get-Date).AddDays(-3)} -MaxEvents 20 -ErrorAction SilentlyContinue |\n ? {$_.Message -match 'explorer.exe'} | select TimeCreated,ProviderName,Id",
    "evidence": "Explorer y DWM tienen procesos separados, con funciones diferentes. Un fallo de UI puede ocurrir sin caída del kernel.",
    "pitfall": "No todos los procesos del sistema exponen StartTime o Responding; la ausencia de un dato no justifica matarlos.",
    "action": "Revisá extensiones de shell y errores específicos si Explorer se reinicia con frecuencia.",
    "recovery": "No se altera el shell.",
    "challenge": "Dibujá el mapa shell/DWM/aplicación y explicá por qué reiniciar Explorer no equivale a reiniciar Windows.",
    "references": [
      {
        "name": "Autoruns",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 7,
    "discovery": "El escritorio y el kernel tienen responsabilidades diferentes: una interfaz lenta puede deberse al compositor, al shell, a la app o a un bloqueo de E/S.",
    "mechanism": "Aplicaciones corren en modo usuario, mientras drivers y componentes del kernel gestionan recursos privilegiados. DWM compone ventanas y puede tener consumo legítimo, por lo que comparar CPU sin fijar condiciones puede atribuir el problema al componente incorrecto.",
    "preparation": "Elegí un síntoma visible reproducible: por ejemplo, lentitud al abrir una ventana. Evitá modificar GPU o controladores.",
    "experiment": [
      "Tomá dos ventanas de CPU para DWM, Explorer y la aplicación.",
      "Observá si sólo una app tarda o si la interfaz completa se detiene.",
      "Documentá si el bloqueo coincide con disco, CPU o memoria comprometida."
    ],
    "command": "$targets='dwm','explorer'\nGet-Process -ErrorAction SilentlyContinue | ? {$targets -contains $_.Name} |\n select Name,Id,CPU,PrivateMemorySize64,Handles\nGet-CimInstance Win32_OperatingSystem |\n select FreePhysicalMemory,TotalVisibleMemorySize",
    "evidence": "Un proceso puede consumir memoria sin usar CPU en el instante. Si todas las ventanas se detienen, investigá bloqueo común y no necesariamente DWM.",
    "pitfall": "No confundir tiempo acumulado CPU de DWM con porcentaje ni forzar hacks del compositor.",
    "action": "Recogé evidencia ETW si la UI completa sufre microparadas repetibles; primero descartá presión de memoria y disco.",
    "recovery": "Solo lectura, gráficos y drivers intactos.",
    "challenge": "Diferenciá un freeze de aplicación de un freeze del escritorio registrando tres síntomas observables.",
    "references": [
      {
        "name": "Windows Performance Recorder",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-recorder"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 8,
    "discovery": "Windows registra fallas que no abren ningún cuadro en pantalla. Un error repetido en el Visor de eventos puede conectar un síntoma con su origen, pero no todos los errores son preocupantes.",
    "mechanism": "Los proveedores escriben eventos con Id, canal, nivel y mensaje; un ID sólo tiene significado junto al proveedor. Un error antiguo no es causa automática de una lentitud actual.",
    "preparation": "Anotá síntomas y horas; mantené la ventana temporal acotada para no concluir por miles de entradas antiguas.",
    "experiment": [
      "Consultá sólo eventos críticos y errores recientes de System y Application.",
      "Agrupá por proveedor y EventId, no por color rojo.",
      "Elegí uno que coincida en hora con un síntoma y buscá causas alternativas."
    ],
    "command": "$start=(Get-Date).AddDays(-2)\n'System','Application' | % {\n $log=$_\n Get-WinEvent -FilterHashtable @{LogName=$log;StartTime=$start;Level=1,2} -MaxEvents 100 -ErrorAction SilentlyContinue |\n Group-Object ProviderName,Id | Sort-Object Count -Descending |\n Select-Object -First 8 @{N='Log';E={$log}},Name,Count\n}",
    "evidence": "Agrupar repeticiones ayuda a priorizar. Un único mensaje sin impacto puede ser inocuo.",
    "pitfall": "No borres registros como supuesto truco de optimización; perderías cronología de diagnóstico.",
    "action": "Correlacioná el evento con hora, software instalado y operación concreta antes de reparar.",
    "recovery": "Solo lectura.",
    "challenge": "Seleccioná un error recurrente y explicá por qué no es suficiente para diagnosticar un fallo.",
    "references": [
      {
        "name": "Get-WinEvent",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 9,
    "discovery": "Conexiones de Windows existen sin abrir un navegador. Eso no prueba espionaje: necesitamos PID, destino, intervalo y una explicación del proceso.",
    "mechanism": "Get-NetTCPConnection lista sesiones TCP en un instante. No revela contenido cifrado ni todo UDP; algunas IP representan CDN y servidores compartidos.",
    "preparation": "Usá sólo tu equipo o infraestructura autorizada; no captures ni publiques datos de terceros. El resultado puede incluir IPs privadas.",
    "experiment": [
      "Tomá lista TCP con PID.",
      "Cruzá un PID con nombre y ruta local.",
      "Repetí antes y después de abrir una app confiable. Anotá diferencias; no declares 'espionaje' por IP desconocida."
    ],
    "command": "Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue |\n select -First 25 OwningProcess,RemoteAddress,RemotePort |\n % { $p=Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue\n [pscustomobject]@{PID=$_.OwningProcess;Proceso=$p.Name;\n Remoto=$_.RemoteAddress;Puerto=$_.RemotePort} }",
    "evidence": "Las conexiones visibles cambian con actividad. La atribución a PID es una relación local y temporal.",
    "pitfall": "La geolocalización de una IP no identifica la empresa ni demuestra extracción; muchas conexiones fugaces no aparecen en una instantánea.",
    "action": "Profundizá sólo cuando haya motivo: ejecutable desconocido, persistencia o tráfico repetido con contexto sospechoso.",
    "recovery": "Solo lectura, red sin cambios.",
    "challenge": "Clasificá cinco conexiones como identificadas, plausibles o por investigar, sin acusar.",
    "references": [
      {
        "name": "Get-NetTCPConnection",
        "url": "https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 10,
    "discovery": "El icono del micrófono no alcanza para auditar privacidad; los permisos de aplicaciones empaquetadas y de escritorio pueden administrarse de forma distinta.",
    "mechanism": "Windows diferencia acceso por dispositivo, apps de Store y aplicaciones de escritorio. Revisar permiso no prueba uso real y una lista de uso reciente puede ser incompleta.",
    "preparation": "No grabes conversaciones. Anotá la versión de Windows y las apps que deberían utilizar micrófono.",
    "experiment": [
      "Abrí Configuración > Privacidad y seguridad > Micrófono.",
      "Revisá permiso general, apps enumeradas y permiso para aplicaciones de escritorio.",
      "Probá con una grabación ficticia autorizada en una app elegida y observá qué indicador o historial cambia."
    ],
    "command": "Start-Process 'ms-settings:privacy-microphone'\nGet-PnpDevice -Class AudioEndpoint -ErrorAction SilentlyContinue |\n select FriendlyName,Status,InstanceId",
    "evidence": "La prueba demuestra el uso autorizado del dispositivo por la app elegida, no si otra app capturó audio previamente.",
    "pitfall": "Ausencia de indicador no garantiza que no hubo acceso pasado; permisos no distinguen claramente todas las vías de audio.",
    "action": "Revocá únicamente apps que no necesitan micrófono y comprobá que no afectás videollamadas/accesibilidad.",
    "recovery": "Si cambiás permisos manualmente, registrá valor previo para restaurarlo; el script es consultivo.",
    "challenge": "Auditá tres aplicaciones: cuáles tienen permiso y cuáles justifican necesitarlo.",
    "references": [
      {
        "name": "Windows Privacy",
        "url": "https://support.microsoft.com/en-us/windows/windows-privacy-settings"
      }
    ],
    "reviewStatus": "lab-verificable"
  }
];
