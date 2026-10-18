import type { EvoWindowsFieldLab } from './tomo02Windows50LabTypes';
export const EVO_W50_LABS_E: EvoWindowsFieldLab[] = [
  {
    "number": 41,
    "discovery": "God Mode es la vista de tareas del Panel de control, no una elevación oculta: reúne accesos clásicos cuya existencia suele pasar inadvertida.",
    "mechanism": "El shell de Windows soporta carpetas virtuales mediante CLSID. ED7BA470-8E54-465E-825C-99712043E01C apunta a All Tasks; las funciones visibles dependen de edición y build. No evita UAC ni desbloquea configuraciones protegidas.",
    "preparation": "Anotá edición/build y abrilo con una cuenta corriente. No cambies Registro ni crees una cuenta nueva.",
    "experiment": [
      "Abrí la carpeta All Tasks mediante Explorer; si no existe en tu compilación, anotá el comportamiento.",
      "Encontrá tres herramientas clásicas que no ubicaste en Configuración moderna.",
      "Probá una consulta no destructiva y verificá que respeta los permisos de tu cuenta.",
      "Guardá una captura REAL de las categorías, ocultando información personal."
    ],
    "command": "Start-Process explorer.exe -ArgumentList 'shell:::{ED7BA470-8E54-465E-825C-99712043E01C}'\nwhoami /groups\nGet-ComputerInfo | Select-Object WindowsProductName,OsBuildNumber",
    "evidence": "Una vista con tareas demuestra un acceso alternativo a herramientas existentes. No hay número universal de elementos; varía por instalación.",
    "pitfall": "'200 secretos desbloqueados' es marketing si no se verifican. God Mode no otorga privilegios extras.",
    "action": "Usalo como índice técnico; documentá accesos que realmente ahorran tiempo.",
    "recovery": "Cerrar Explorer; no deja ajustes cambiados.",
    "challenge": "Encontrá tres paneles útiles, su ruta y qué autorización necesita cada uno.",
    "references": [
      {
        "name": "Windows Shell namespace",
        "url": "https://learn.microsoft.com/en-us/windows/win32/shell/shell-namespace"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 42,
    "discovery": "Autoruns encuentra persistencia fuera de la pestaña Inicio del Administrador de tareas: RunOnce, tareas, extensiones del shell, servicios y más.",
    "mechanism": "Windows permite autoinicio desde varias ubicaciones de Registro y sistema de archivos. Una entrada registrada no prueba que esté ejecutándose ni que sea malware. Autoruns v14.3 (2026) muestra muchas ubicaciones y permite filtrar firmantes.",
    "preparation": "Usá Autoruns oficial de Sysinternals. Primero inventario, después hipótesis; no deshabilites entradas ni ocultes Microsoft para declarar todo lo restante malicioso.",
    "experiment": [
      "Revisá pestañas Logon, Scheduled Tasks, Services y Everything; anotá 3 entradas que no aparecen en Task Manager.",
      "Identificá ruta, editor y archivo destino. En un elemento 'File not found', verificá antes si quedó de una desinstalación.",
      "Cruzá una entrada con tarea o clave del Registro; registrá evidencia de ejecución real por separado.",
      "Si considerás retirarla, respaldá la entrada y usá el desinstalador del software dueño."
    ],
    "command": "$keys=@('HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',\n'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',\n'HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run')\nforeach($key in $keys){ Write-Output ('=== '+$key)\n Get-ItemProperty -Path $key -ErrorAction SilentlyContinue | Format-List }\nGet-CimInstance Win32_StartupCommand | Select Name,Location,User",
    "evidence": "Descubrir una entrada oculta para Task Manager demuestra una ruta de persistencia, no consumo actual. Autoinicio y ejecución deben comprobarse por separado.",
    "pitfall": "No manipules Winlogon, drivers de arranque, AppInit, servicios de seguridad ni componentes críticos.",
    "action": "Si una app de terceros es prescindible y tiene persistencia, desinstalala oficialmente y medí cambios antes/después.",
    "recovery": "Consultas sin cambios. Deshabilitaciones posteriores requieren guardar estado y volver a habilitar si hay regresión.",
    "challenge": "Documentá dos ubicaciones de persistencia y su propietario verificado.",
    "references": [
      {
        "name": "Autoruns — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 43,
    "discovery": "No existe una lista universal de servicios seguros para apagar y ganar 1GB: muchos están en espera; otros comparten PID y memoria.",
    "mechanism": "Service Control Manager administra servicios automáticos, manuales y por triggers. Atribuir toda la RAM de svchost a un servicio individual es incorrecto cuando comparte host.",
    "preparation": "No tocar drivers GPU, audio, red, Defender, Update, cifrado o servicios críticos. Inventariá antes de actuar y elegí sólo una aplicación de terceros realmente prescindible.",
    "experiment": [
      "Listá servicios, estado, modo de inicio, ejecutable y PID.",
      "Identificá cuáles comparten PID y por qué ese dato impide atribuir memoria individual.",
      "Observá 10 segundos de actividad del proceso de una aplicación propia; compará con su función.",
      "Si es prescindible, considerá desinstalarla por canal oficial; repetí la medición bajo la misma carga."
    ],
    "command": "$s=Get-CimInstance Win32_Service\n$s | Select Name,StartMode,State,ProcessId,PathName | Sort Name\n$s | Where-Object {$_.ProcessId -gt 0} |\n Group-Object ProcessId | Where-Object {$_.Count -gt 1} |\n Select Name,Count",
    "evidence": "La lectura identifica servicios compartidos y funciones instaladas. Sin captura del consumo en dos momentos no hay ganancia demostrada.",
    "pitfall": "'Manual' no significa inútil y 'Automático' no implica CPU constante. Deshabilitar servicios en masa puede impedir login, audio, red o recuperación.",
    "action": "Retirá software de terceros que no utilizás y verificá efecto; la reducción de servicios no es objetivo por sí misma.",
    "recovery": "El laboratorio no cambia nada; cualquier futura intervención debe tener copia de inicio/estado y restauración.",
    "challenge": "Comprobá si la promesa '500MB por servicio apagado' está confundiendo memoria compartida.",
    "references": [
      {
        "name": "Windows Services",
        "url": "https://learn.microsoft.com/en-us/windows/win32/services/services"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 44,
    "discovery": "Un SSD puede contener gigabytes de componentes y cachés legítimos. La pregunta real es cuánto espacio se puede recuperar de forma segura, no cuánto parece ocupar WinSxS.",
    "mechanism": "WinSxS usa vínculos duros y el Explorador puede mostrar tamaños aparentes engañosos. DISM /AnalyzeComponentStore estima tamaño real y recomienda limpieza; Storage Sense distingue archivos temporales, papelera y otras categorías.",
    "preparation": "Anotá libre en C:, hacé backup de datos valiosos y NO borres WinSxS, DriverStore, perfiles ni Descargas con scripts.",
    "experiment": [
      "Abrí Recomendaciones de limpieza de Windows y anotá tamaños sugeridos sin aceptarlos aún.",
      "Corré DISM /AnalyzeComponentStore y registrá tamaño de backup/caché y Cleanup Recommended.",
      "Compará categorías con tus datos reales. Evaluá por separado si te conviene limpiar papelera/temporales.",
      "Si limpiás selectivamente mediante interfaz oficial, medí C: antes/después y anotá todo lo eliminado."
    ],
    "command": "Get-CimInstance Win32_LogicalDisk -Filter \"DeviceID='C:'\" |\n Select DeviceID,@{N='LibreGB';E={[math]::Round($_.FreeSpace/1GB,2)}}\nDISM.exe /Online /Cleanup-Image /AnalyzeComponentStore\nStart-Process 'ms-settings:storagesense'",
    "evidence": "Un resultado de 'Cleanup Recommended: No' significa que no hay razón clara para forzar limpieza de componentes. Recuperación de 0GB es un resultado válido.",
    "pitfall": "No usar DISM /ResetBase a la ligera: elimina posibilidad de desinstalar actualizaciones existentes. Prohibido borrar manualmente WinSxS.",
    "action": "Revisá primero temporales selectivos, papeleras y recomendaciones oficiales. Mantener el backup y las opciones de recuperación.",
    "recovery": "El script sólo consulta. La limpieza manual posterior puede ser irreversible; cada categoría exige confirmación.",
    "challenge": "Calculá ahorro potencial real e identificá qué archivos NO tocarías aunque parezcan enormes.",
    "references": [
      {
        "name": "Free up space",
        "url": "https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows"
      },
      {
        "name": "Clean up WinSxS",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/clean-up-the-winsxs-folder"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 45,
    "discovery": "Defender integrado suele ser suficiente para uso doméstico si está activo y actualizado. Otro antivirus no garantiza más protección y dos motores activos pueden generar incompatibilidades.",
    "mechanism": "Windows Security es la interfaz; Microsoft Defender Antivirus es el motor. Windows tiene protección en tiempo real, reputación y servicios complementarios. Antivirus de terceros puede modificar el estado del motor Microsoft.",
    "preparation": "No deshabilites protección para comparar FPS. Nunca descargues malware real ni copies datos privados al informe.",
    "experiment": [
      "Consultá antivirus activo, protección tiempo real, actualizaciones y antimanipulación.",
      "Revisá los proveedores instalados desde Seguridad de Windows.",
      "Audita SmartScreen, firewall y respaldos: un antivirus no cubre phishing ni pérdida de datos por sí solo.",
      "Si deseás probar un detector, usá únicamente la prueba benigna EICAR desde su fuente oficial con conocimiento de sus límites."
    ],
    "command": "Get-MpComputerStatus -ErrorAction SilentlyContinue |\n Select AntivirusEnabled,RealTimeProtectionEnabled,AntivirusSignatureVersion,\n AntivirusSignatureLastUpdated,AMServiceEnabled,IsTamperProtected\nStart-Process 'windowsdefender:'",
    "evidence": "Un estado 'True' confirma configuración; no certifica que no exista malware. EICAR sólo prueba respuesta a ese archivo de prueba.",
    "pitfall": "Desactivar Windows Security Service, Defender o Update para 'optimizar' puede disminuir la protección y ocultar estados reales.",
    "action": "Mantener Defender y navegador seguros para uso normal; comprar suite de terceros sólo por requisitos adicionales evaluados.",
    "recovery": "Consulta sin cambios.",
    "challenge": "Diseñá cuatro capas de seguridad: prevención, antivirus, recuperación y educación de usuario.",
    "references": [
      {
        "name": "Defender Antivirus",
        "url": "https://learn.microsoft.com/en-us/defender-endpoint/microsoft-defender-antivirus-windows"
      },
      {
        "name": "Windows Security",
        "url": "https://learn.microsoft.com/windows/security/operating-system-security/system-security/windows-defender-security-center/windows-defender-security-center"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 46,
    "discovery": "FPS promedio alto puede ocultar microtirones: el objetivo para Windows 11 es estabilidad de frametime y baja variabilidad, no un ajuste mágico de FPS.",
    "mechanism": "A 60FPS cada cuadro ocupa en promedio 16,67ms, a 120FPS 8,33ms. Un pequeño número de cuadros extremadamente largos empeora experiencia sin hundir el promedio. Juego, CPU, memoria y presentación deben medirse por separado.",
    "preparation": "Mismo juego, mapa, recorrido y duración, resolución y cap, temperatura y apps en reposo. Mantener driver y ajustes GPU sin tocar.",
    "experiment": [
      "Registrá tres capturas reales de frametimes con PresentMon o herramienta equivalente.",
      "Calculá media, percentil 99 de frametime y 1% low según metodología documentada.",
      "Evaluá un solo cambio soportado en Windows, por ejemplo Game Mode, y repetí tres capturas.",
      "Si el cambio es menor que el ruido entre sesiones, el veredicto es 'sin mejora demostrada'."
    ],
    "command": "Get-ComputerInfo | Select OsBuildNumber,WindowsVersion\nGet-Process | Sort PrivateMemorySize64 -Descending |\n Select -First 12 Name,Id,@{N='PrivadoGB';E={[math]::Round($_.PrivateMemorySize64/1GB,2)}}\nStart-Process 'ms-settings:gaming-gamemode'\n# Capturá frametimes del juego con PresentMon; el script no inventa FPS.",
    "evidence": "Una comparación A/B de varias sesiones reales permite detectar si mejoró la cola de frametimes. Promedio solo es insuficiente.",
    "pitfall": "Comparar mapas/resoluciones/caps distintos invalida el ensayo. No prometas boosts universales de HAGS, HPET o prioridad de Registro.",
    "action": "Conservar cambios de Windows sólo con ganancia medible y estabilidad conservada; hardware/driver intactos.",
    "recovery": "Anotar el valor de Game Mode y restaurarlo si el ensayo no ayuda.",
    "challenge": "Encontrá dos sesiones con FPS similar pero cola de frametime distinta y explicá qué siente el jugador.",
    "references": [
      {
        "name": "PresentMon",
        "url": "https://github.com/GameTechDev/PresentMon"
      },
      {
        "name": "Windows Performance Toolkit",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 47,
    "discovery": "Input lag no es una sola métrica: intervienen mouse, cola del juego, CPU, GPU, presentación y monitor. Afirmar que un valor de Registro lo elimina es engañoso.",
    "mechanism": "El intervalo nominal entre refrescos a 200Hz es 5ms, pero eso NO equivale a latencia clic-fotón. FPS, frametime y latencia extremo a extremo no son sinónimos.",
    "preparation": "Anotá sensibilidad, aceleración, polling y frecuencia real desde Windows/OSD; no cambies drivers de GPU.",
    "experiment": [
      "Registrá preferencias de mouse y modo de pantalla actuales.",
      "Reproducí el síntoma en escritorio y juego para identificar su alcance.",
      "Medí frametime tres veces: sirve como indicador indirecto, no como latencia clic-fotón.",
      "Para latencia real extremo a extremo requerís medición óptica o hardware especializado y ensayos repetidos."
    ],
    "command": "Get-ItemProperty 'HKCU:\\Control Panel\\Mouse' |\n Select MouseSpeed,MouseThreshold1,MouseThreshold2,MouseSensitivity\nGet-CimInstance Win32_VideoController |\n Select Name,CurrentHorizontalResolution,CurrentVerticalResolution,CurrentRefreshRate\nStart-Process 'ms-settings:display-advanced'",
    "evidence": "Valor WMI de Hz puede no coincidir con refresco activo en todos los equipos; corroborar pantalla y OSD. Frametime no mide por sí solo input lag.",
    "pitfall": "No deshabilites HPET, Dynamic Tick, seguridad ni controladores con scripts 'zero latency'. Puede empeorar estabilidad.",
    "action": "Corregir configuraciones incoherentes respaldadas por medición; no confundir respuesta subjetiva con evidencia.",
    "recovery": "Script solo lee. Cualquier cambio de UI posterior requiere guardar estado inicial.",
    "challenge": "Dibujá cadena clic → píxel y marcá qué herramienta puede medir cada tramo.",
    "references": [
      {
        "name": "Windows Performance Recorder",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/windows-performance-recorder"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 48,
    "discovery": "El mejor script maestro es el que produce un expediente de Windows en un minuto sin deshabilitar nada: muestra memoria, disco, versión, procesos y servicios en vez de aplicar tweaks en masa.",
    "mechanism": "PowerShell integra CIM, Get-Process, Get-Service y contadores. Un snapshot es una observación temporal; para concluir hace falta comparar intervalos y contexto.",
    "preparation": "No requiere administrador para información básica. El script se ejecuta localmente y no sube datos a Internet.",
    "experiment": [
      "Corré el informe en reposo y guardá sus números en un registro propio.",
      "Repetí durante un síntoma con la misma duración.",
      "Elegí el laboratorio específico para la anomalía detectada, en lugar de lanzar 'optimización total'.",
      "Evitá compartir rutas, usuarios o eventos sin anonimizar."
    ],
    "command": "$os=Get-CimInstance Win32_OperatingSystem\n[pscustomobject]@{Hora=Get-Date;Windows=$os.Caption;Build=$os.BuildNumber;\n TotalRAM_GB=[math]::Round($os.TotalVisibleMemorySize/1MB,2);\n LibreRAM_GB=[math]::Round($os.FreePhysicalMemory/1MB,2);\n Procesos=(Get-Process).Count;\n ServiciosActivos=(Get-Service|?{$_.Status -eq 'Running'}).Count} | Format-List\nGet-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' |\n Select DeviceID,@{N='LibreGB';E={[math]::Round($_.FreeSpace/1GB,2)}}\nGet-Process|Sort PrivateMemorySize64 -Descending|\n Select -First 10 Name,Id,@{N='PrivadoMB';E={[math]::Round($_.PrivateMemorySize64/1MB,1)}}",
    "evidence": "La línea de base documenta qué había al medir; no es una puntuación de 'salud' universal y no determina malware.",
    "pitfall": "No equivale a auditoría ETW profunda ni al cómputo correcto de RAM mediante suma de procesos.",
    "action": "Priorizar causa concreta y un único experimento A/B antes de modificar el sistema.",
    "recovery": "Solo lectura, sin archivo ni modificación.",
    "challenge": "Compará dos snapshots y justificá un siguiente experimento sin decidir todavía un tweak.",
    "references": [
      {
        "name": "Get-CimInstance",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 49,
    "discovery": "AppData y cachés pueden ocupar gigabytes, pero muchas carpetas grandes guardan datos personales o aceleran aplicaciones: hay que encontrar dueño y medir sin borrar.",
    "mechanism": "Datos de perfiles, temporales, cachés, bases de datos y puntos de reanálisis se contabilizan distinto. Un escaneo recursivo puede omitir archivos por permisos o contar enlaces.",
    "preparation": "Empezá sólo por tu perfil; no recorras rutas de otros usuarios. La prueba no borra ni comprime nada.",
    "experiment": [
      "Medí carpetas Descargas, Temp y Packages localmente y anotá qué aplicaciones las usan.",
      "Compará con ocupación de C: desde Windows.",
      "Revisá caché de una aplicación conocida para ver si su tamaño tiene explicación.",
      "No borres a ciegas; elegí limpieza mediante interfaz oficial cuando sea realmente temporal."
    ],
    "command": "$dirs=@(\"$env:USERPROFILE\\Downloads\",\"$env:LOCALAPPDATA\\Temp\",\n \"$env:LOCALAPPDATA\\Packages\")\nforeach($dir in $dirs){if(Test-Path -LiteralPath $dir){\n $total=(Get-ChildItem -LiteralPath $dir -File -Recurse -Force -ErrorAction SilentlyContinue|\n Measure-Object Length -Sum).Sum\n [pscustomobject]@{Carpeta=$dir;GB=[math]::Round($total/1GB,2)}}}\n# SOLO LECTURA: no elimina archivos.",
    "evidence": "Tamaño estimado por carpeta; algunas carpetas protegidas pueden omitirse. Un cambio de tamaño no prueba que los datos sean basura.",
    "pitfall": "Nunca borrar Packages, OneDrive, Drivers, WinSxS, perfiles o credenciales sin comprender contenido y respaldo.",
    "action": "Utilizar Almacenamiento de Windows y desinstaladores para recuperaciones con menor riesgo; medir después.",
    "recovery": "Solo consulta.",
    "challenge": "Encontrá tres carpetas grandes y clasificá datos personales, caché y sistema sin eliminarlas.",
    "references": [
      {
        "name": "Free up drive space",
        "url": "https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 50,
    "discovery": "Windows limpio no equivale a Windows vacío: una optimización profesional mejora una métrica y mantiene seguridad, restauración, audio, red y funciones necesarias.",
    "mechanism": "Inicio, memoria, disco y latencia requieren métricas distintas. Un 'mega script' que altera veinte cosas pierde causalidad y a menudo rompe mantenimiento y recuperación.",
    "preparation": "Elegí objetivo cuantificable, como liberar espacio o reducir inicio de apps de terceros. Respaldo comprobado y valores actuales antes de modificar.",
    "experiment": [
      "Realizá inventario de espacio, memoria, inicio y estado de servicios.",
      "Inspeccioná recomendaciones oficiales de limpieza y propietario de una app opcional.",
      "Aplicá manualmente UNA intervención respaldada, reversible cuando corresponda.",
      "Repetí mediciones bajo condiciones iguales y anotá ganancias, regresiones y resultado neutral."
    ],
    "command": "Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' |\n Select DeviceID,@{N='LibreGB';E={[math]::Round($_.FreeSpace/1GB,2)}}\nGet-CimInstance Win32_OperatingSystem |\n Select @{N='RAMLibreGB';E={[math]::Round($_.FreePhysicalMemory/1MB,2)}}\nGet-CimInstance Win32_StartupCommand | Select Name,Location\nStart-Process 'ms-settings:storagesense'",
    "evidence": "Una medición A/B bajo condiciones iguales respalda cambios específicos, sin números inventados. Un resultado neutro ahorra tiempo y riesgos.",
    "pitfall": "Evitar desactivar Defender, Windows Update, audio, red, drivers o borrar Windows/AppData/WinSxS a ciegas.",
    "action": "Mantener sólo cambios validados y seguros, documentando rollback; rechazar 'one-click optimizer' sin trazabilidad.",
    "recovery": "El comando sólo consulta; si realizás limpieza manual, entendé antes qué archivos no se pueden restaurar.",
    "challenge": "Publicá un caso con línea de base, UNA intervención, tres mediciones, conclusión y eventual reversión.",
    "references": [
      {
        "name": "Storage Sense",
        "url": "https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/manage-drive-space-with-storage-sense"
      }
    ],
    "reviewStatus": "lab-verificable"
  }
];
