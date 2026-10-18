import type { EvoWindowsFieldLab } from './tomo02Windows50LabTypes';
export const EVO_W50_LABS_C: EvoWindowsFieldLab[] = [
  {
    "number": 21,
    "discovery": "Windows puede tener componentes de acceso remoto disponibles sin que exista una conexión entrante activa; 'habilitado' y 'utilizado' son hechos distintos.",
    "mechanism": "RDP escucha según edición y configuración; firewall, permisos y políticas determinan si una conexión es posible. Ayuda remota, herramientas comerciales y RDP tienen arquitecturas distintas.",
    "preparation": "No cambies firewall ni servicios. Analizá solo tu propio equipo y no publiques datos de red.",
    "experiment": [
      "Consultá la opción de permitir RDP en el Registro.",
      "Observá si hay sockets TCP locales en escucha en puertos relevantes.",
      "Relacioná habilitación con edición y reglas, sin atribuir uso a un puerto abierto."
    ],
    "command": "Get-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server' -Name fDenyTSConnections -ErrorAction SilentlyContinue |\n select fDenyTSConnections\nGet-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |\n ? {$_.LocalPort -eq 3389} | select LocalAddress,LocalPort,OwningProcess\nGet-ComputerInfo | select WindowsProductName,OsBuildNumber",
    "evidence": "fDenyTSConnections=0 permite RDP a nivel de esa configuración, pero políticas y firewall pueden impedir conexiones. Listening no equivale a cliente conectado.",
    "pitfall": "RDP no es la única modalidad de acceso remoto y el puerto 3389 puede cambiar; no deduzcas ausencia de acceso remoto por un solo resultado.",
    "action": "Deshabilitá funciones de acceso remoto que no usás desde configuraciones oficiales, verificando que no las necesita soporte legítimo.",
    "recovery": "Script consultivo; un cambio manual puede revertirse desde Configuración > Sistema > Escritorio remoto.",
    "challenge": "Distinguí tres columnas: configuración, escucha activa y sesión real.",
    "references": [
      {
        "name": "Remote Desktop",
        "url": "https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 22,
    "discovery": "Un ejecutable llamado como un proceso de Windows puede estar ubicado en una carpeta equivocada. El nombre por sí solo es una prueba casi nula.",
    "mechanism": "La identidad se determina con ruta, firma, proceso iniciador y comandos de creación. Authenticode valida firma de un archivo si está disponible, pero firmado tampoco implica inocuo.",
    "preparation": "No ejecutes ni termines el sospechoso. Consultá primero una lista sin publicar rutas privadas.",
    "experiment": [
      "Elegí un proceso que despierte dudas y anotá PID.",
      "Consultá ExecutablePath y CommandLine mediante CIM.",
      "Verificá firma del archivo sin ejecutarlo; si no es posible, registra 'sin datos'."
    ],
    "command": "$id=Read-Host 'PID a investigar'\n$p=Get-CimInstance Win32_Process -Filter \"ProcessId=$id\" -ErrorAction SilentlyContinue\n$p | select Name,ProcessId,ParentProcessId,ExecutablePath,CommandLine\nif($p.ExecutablePath -and (Test-Path -LiteralPath $p.ExecutablePath)){\n Get-AuthenticodeSignature -LiteralPath $p.ExecutablePath |\n select Status,StatusMessage,@{N='Firmante';E={$_.SignerCertificate.Subject}}\n}",
    "evidence": "Ruta, firma y padre son tres pistas independientes. Un binario fuera de System32 no es necesariamente malware: puede ser legítimo o imitar otro nombre.",
    "pitfall": "PIDs se reutilizan; un parent PID sin hora de creación puede referirse a proceso ya reemplazado. Firma válida no prueba comportamiento benigno.",
    "action": "Ante evidencia sospechosa, priorizá aislamiento, copia de registros y protección activa antes de eliminar archivos.",
    "recovery": "Solo lectura.",
    "challenge": "Compará el mismo nombre de ejecutable en dos rutas y explicá qué información falta para emitir un veredicto.",
    "references": [
      {
        "name": "Get-AuthenticodeSignature",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-authenticodesignature"
      },
      {
        "name": "Process Explorer",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 23,
    "discovery": "Un intento de inicio fallido y un inicio exitoso a la misma hora no prueban la misma historia. La correlación por LogonType y cuenta cambia el significado.",
    "mechanism": "Eventos 4624/4625 describen autenticaciones registradas según auditoría. 4688, cuando está configurado, informa creación de procesos; sin esa política, la ausencia de 4688 no dice nada.",
    "preparation": "No borres registros ni habilites una auditoría masiva para provocar datos. Registra la zona horaria.",
    "experiment": [
      "Consultá 4624 y 4625 en una ventana de 24 horas.",
      "Leé tipo de inicio y nombre de cuenta sólo en tu PC.",
      "Comprobá si la secuencia coincide con sesión humana o tarea conocida."
    ],
    "command": "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4624,4625;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 70 -ErrorAction SilentlyContinue |\n % { $e=[xml]$_.ToXml()\n $t=$e.Event.EventData.Data|?{$_.Name -eq 'LogonType'}\n [pscustomobject]@{Hora=$_.TimeCreated;Evento=$_.Id;Tipo=$t.'#text'} }",
    "evidence": "Secuencia de marcas de tiempo y tipos de inicio, no identificación automática de atacante.",
    "pitfall": "Una cuenta de servicio y una sesión RDP difieren. 4625 no significa que la contraseña de un usuario real haya sido robada.",
    "action": "Si un 10 remoto interactivo es inesperado, verificá configuración RDP, sesiones y credenciales con un procedimiento de respuesta a incidentes.",
    "recovery": "Solo lectura.",
    "challenge": "Escribí dos historias compatibles con un 4624 nocturno y qué prueba las distinguiría.",
    "references": [
      {
        "name": "Audit logon events",
        "url": "https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/basic-audit-logon-events"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 24,
    "discovery": "Un instalador con icono conocido puede contener ejecutables sin firma o con firma válida pero procedencia no confiable; hay que comprobar más de una propiedad.",
    "mechanism": "Las firmas Authenticode permiten verificar integridad y firmante del archivo firmado. SmartScreen y reputación son capas diferentes, no un sello mágico de seguridad.",
    "preparation": "DESCARGÁ SOLO archivos de proveedores oficiales; no abras ejecutables sospechosos para probarlos.",
    "experiment": [
      "Elegí un instalador que todavía no ejecutaste y guardá origen oficial.",
      "Calculá SHA-256 y firma Authenticode.",
      "Compará hash oficial si el proveedor lo publica; si no existe, anota ese límite."
    ],
    "command": "$path=Read-Host 'Ruta local del instalador (no lo ejecutes)'\nif(Test-Path -LiteralPath $path -PathType Leaf){\n Get-FileHash -LiteralPath $path -Algorithm SHA256\n Get-AuthenticodeSignature -LiteralPath $path |\n select Status,StatusMessage,@{N='Firmante';E={$_.SignerCertificate.Subject}}\n}",
    "evidence": "Hash e identidad de firmante constituyen evidencias de archivo. Sin hash publicado por el proveedor no se prueba correspondencia con la descarga oficial.",
    "pitfall": "Un malware puede tener firma válida robada o abusada. No subas archivos privados a analizadores públicos sin revisar licencias y privacidad.",
    "action": "Si procedencia o firma fallan, no instales; descargá desde canal verificable.",
    "recovery": "Laboratorio no ejecuta el instalador.",
    "challenge": "Verificá dos instaladores legítimos y explicá qué confirma el hash y qué no.",
    "references": [
      {
        "name": "Get-AuthenticodeSignature",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-authenticodesignature"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 25,
    "discovery": "CPU al 100% puede deberse a varios procesos simultáneos o a uno solo sobrecargando el sistema; la columna acumulada de PowerShell NO mide ese porcentaje.",
    "mechanism": "Uso medio por proceso requiere dos muestras de tiempos de CPU y dividir por duración y procesadores lógicos. Carga total y cola de procesador son indicadores distintos.",
    "preparation": "Elegí un período de lentitud reproducible, sin forzar tests de estrés ni cerrar procesos ajenos.",
    "experiment": [
      "Anotá CPU total en Administrador de tareas durante el síntoma.",
      "Calculá uso medio por PID en dos intervalos; anotá los tres primeros.",
      "Repetí durante un período normal para distinguir condición de fallo."
    ],
    "command": "$n=[Environment]::ProcessorCount;$a=@{};Get-Process|?{$null -ne $_.CPU}|%{$a[$_.Id]=$_.CPU}\n$sw=[Diagnostics.Stopwatch]::StartNew();Start-Sleep 8;$sw.Stop()\nGet-Process|?{$a.ContainsKey($_.Id)-and $null -ne $_.CPU}|\n % {[pscustomobject]@{Nombre=$_.Name;PID=$_.Id;\n CPU_TotalPct=[math]::Round(100*($_.CPU-$a[$_.Id])/$sw.Elapsed.TotalSeconds/$n,1)}}|\n sort CPU_TotalPct -Descending|select -First 10",
    "evidence": "El resultado identifica consumidores sostenidos durante ocho segundos, no picos subsegundo ni actividad de todos los drivers.",
    "pitfall": "Sumas de promedios con procesos que nacen/mueren son aproximadas; latencia puede existir sin CPU global alta.",
    "action": "Si domina una app, tratá esa app; si domina sistema o interrupciones, capturá ETW con método específico.",
    "recovery": "Solo lectura.",
    "challenge": "Identificá un consumidor de CPU sin cambiar prioridad ni afinidad y describí la causa plausible.",
    "references": [
      {
        "name": "Get-Process",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 26,
    "discovery": "La RAM 'ocupada' puede ser caché reutilizable y no un problema. Lo que importa es la presión real, el compromiso y el paginado sostenido.",
    "mechanism": "Working Set es memoria residente por proceso, Commit representa memoria comprometida y Standby suele ser reutilizable. Bytes compartidos pueden contarse en varios procesos.",
    "preparation": "Anotá memoria total, disponible y uso al reposo y con una app pesada; evitá 'RAM cleaners'.",
    "experiment": [
      "Consultá memoria física disponible, total y páginas comprometidas.",
      "Compará con datos de Administrador de tareas > Memoria.",
      "Repetí con una app conocida y al cerrarla; verificá presión antes de considerar ampliación."
    ],
    "command": "Get-CimInstance Win32_OperatingSystem | select @{N='TotalGB';E={[math]::Round($_.TotalVisibleMemorySize/1MB,2)}},@{N='LibreGB';E={[math]::Round($_.FreePhysicalMemory/1MB,2)}}\nGet-Counter '\\Memory\\Committed Bytes','\\Memory\\Commit Limit','\\Memory\\Available MBytes' -ErrorAction SilentlyContinue |\n select -ExpandProperty CounterSamples | select Path,CookedValue",
    "evidence": "Si Committed Bytes se acerca a Commit Limit y hay paginación bajo carga, aparece un problema más convincente que 'RAM al 50%'.",
    "pitfall": "Los nombres de contadores pueden localizarse; no concluyas falla si Get-Counter no encuentra una traducción o si contadores fueron deshabilitados.",
    "action": "Cerrá programas realmente consumidores o ampliá RAM si las métricas muestran presión sostenida; no desactives servicios críticos para perseguir 'MB libres'.",
    "recovery": "Ningún cambio.",
    "challenge": "Explicá por qué un equipo con mucha caché puede responder más rápido que uno artificialmente 'limpio'.",
    "references": [
      {
        "name": "Windows Memory",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/drivers/gettingstarted/virtual-address-spaces"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 27,
    "discovery": "Desactivar pagefile puede reducir capacidad de compromiso y provocar errores de memoria aun cuando haya RAM físicamente disponible.",
    "mechanism": "Windows utiliza archivo de paginación para respaldar compromiso y ciertos volcados; tamaño y gestión automática varían según carga. El límite de compromiso se relaciona con RAM y almacenamiento asignado al pagefile.",
    "preparation": "No elimines pagefile ni cambies su configuración. Registra capacidad física y carga de trabajo.",
    "experiment": [
      "Consultá archivo(s) de paginación y uso actual.",
      "Anotá compromiso máximo/actual desde Administrador de tareas.",
      "Compará con presión de memoria durante una aplicación real antes de recomendar ajustes."
    ],
    "command": "Get-CimInstance Win32_PageFileUsage |\n select Name,AllocatedBaseSize,CurrentUsage,PeakUsage\nGet-CimInstance Win32_ComputerSystem | select AutomaticManagedPagefile\nGet-CimInstance Win32_OperatingSystem | select TotalVirtualMemorySize,FreeVirtualMemory",
    "evidence": "Un pagefile poco utilizado en reposo no significa que deba quitarse: es una capacidad de reserva frente a picos y volcados.",
    "pitfall": "CurrentUsage no representa todo el uso de memoria virtual de apps; no confundas swap con 'RAM lenta' en todos los casos.",
    "action": "Mantené administración automática como punto de partida salvo diagnóstico específico que justifique otra configuración.",
    "recovery": "Solo lectura; no se altera pagefile.",
    "challenge": "Explicá por qué 16GB RAM no garantiza que el límite de compromiso sea siempre 16GB.",
    "references": [
      {
        "name": "Page file sizing",
        "url": "https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 28,
    "discovery": "Una fuga de memoria no es simplemente un proceso grande; es crecimiento injustificado y sostenido bajo carga comparable.",
    "mechanism": "Private Bytes, Working Set y objetos Handles se comportan de manera distinta. Un navegador puede aumentar caché y devolverla bajo presión sin tener fuga; observar tendencia y recuperación requiere varias muestras.",
    "preparation": "Elegí una aplicación conocida y una acción repetible; anotá inicio, ventanas abiertas y duración.",
    "experiment": [
      "Tomá cinco muestras separadas del mismo PID.",
      "Graficá privado y handles frente al tiempo, idealmente tras reproducir la misma acción.",
      "Cerrá sólo la app de prueba si corresponde y verificá liberación normal de su proceso."
    ],
    "command": "$pidElegido=[int](Read-Host 'PID de tu aplicación')\n1..5 | % { $p=Get-Process -Id $pidElegido -ErrorAction SilentlyContinue\n if($p){[pscustomobject]@{Hora=Get-Date;PID=$p.Id;\n PrivateMB=[math]::Round($p.PrivateMemorySize64/1MB,1);Handles=$p.Handles}}\n Start-Sleep 5 }",
    "evidence": "Una pendiente ascendente persistente bajo estado estable merece estudio, pero cinco puntos solos no prueban fuga.",
    "pitfall": "Cachés, JIT, carga progresiva y memoria compartida generan crecimiento legítimo. No fuerces una limpieza de RAM para 'confirmar'.",
    "action": "Investiga el proceso y versión concreta, complementá con contadores/ETW y prueba de reproducción.",
    "recovery": "Solo lectura.",
    "challenge": "Diferenciá acumulación de caché y posible fuga con una serie temporal simple.",
    "references": [
      {
        "name": "Get-Process",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 29,
    "discovery": "Un juego puede mostrar FPS promedio alto y sufrir tirones si algún driver retiene CPU con ISR o DPC en momentos críticos.",
    "mechanism": "Las interrupciones atienden hardware; DPC permite diferir trabajo de controladores. Los tiempos máximos e intervalos importan más que un promedio aislado. WPR registra ETW y WPA puede correlacionar CPU, DPC/ISR y procesos.",
    "preparation": "No toques drivers de GPU. Si falta WPR/WPA, instalá Windows Performance Toolkit oficial; anotá hora exacta de los tirones.",
    "experiment": [
      "Reproducí dos minutos de microtirones bajo condiciones constantes.",
      "Capturá una traza CPU/DPC apropiada con WPR y detenela tras el episodio.",
      "En WPA mirá DPC/ISR duration por módulo y marcas de tiempo; no atribuyas causalidad sólo por ranking."
    ],
    "command": "# WPR sólo si está instalado; ejecutá como administrador si lo requiere.\nwpr -profiles\n# Seleccioná en la interfaz WPR un perfil CPU/Interrupts apropiado.\n# Detené la captura inmediatamente después del problema.\n# Archivo ETL: contiene datos del sistema; no compartir sin revisarlo.",
    "evidence": "Una traza que coincide temporalmente con el tirón y un módulo repetido constituye pista; puede requerir más ensayos y stacks.",
    "pitfall": "LatencyMon es diagnóstico orientativo; picos DPC no son equivalentes a input lag medido extremo a extremo. Datos ETL pueden incluir identificadores privados.",
    "action": "Investigá subsistema señalado sin deshabilitar aleatoriamente controladores ni red/audio.",
    "recovery": "Detener la sesión ETW; no se cambian drivers.",
    "challenge": "Explicá diferencia entre frametime de 35ms y duración de un DPC detectado en la misma ventana.",
    "references": [
      {
        "name": "Windows Performance Recorder",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-recorder"
      },
      {
        "name": "Windows Performance Analyzer",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-analyzer"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 30,
    "discovery": "Windows no se 'degrada' por una maldición: acumulación de inicio automático, espacio bajo, programas nuevos y errores pueden explicar un cambio medible.",
    "mechanism": "Las aplicaciones persistentes elevan carga al inicio; actualizaciones o controladores pueden modificar tiempos; presión de disco y memoria generan tirones. Un antes/después necesita línea de base y hardware/versión comparables.",
    "preparation": "Documentá fecha del síntoma, cambios recientes y cantidad de procesos; no instales boosters.",
    "experiment": [
      "Anotá espacio libre, arranque y aplicaciones iniciadas.",
      "Revisá historial de cambios y nuevas aplicaciones.",
      "Compará recursos en reposo con carga conocida, en ventanas iguales."
    ],
    "command": "Get-CimInstance Win32_OperatingSystem |\n select Caption,BuildNumber,LastBootUpTime,FreePhysicalMemory\nGet-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' |\n select DeviceID,FreeSpace,Size\nGet-CimInstance Win32_StartupCommand |\n select Name,Location,Command | select -First 25",
    "evidence": "La comparación identifica correlaciones como poca capacidad libre o más apps de inicio; no certifica que Windows sea 'viejo'.",
    "pitfall": "No borrar cachés a ciegas; muchas aceleran cargas siguientes. Coincidencia temporal con update tampoco prueba causa.",
    "action": "Revertí de manera individual sólo cambios relacionados y medidos; registrá resultados A/B.",
    "recovery": "Script consultivo.",
    "challenge": "Reconstruí la cronología de la lentitud sin instalar nada.",
    "references": [
      {
        "name": "Autoruns",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      }
    ],
    "reviewStatus": "lab-verificable"
  }
];
