import type { EvoWindowsFieldLab } from './tomo02Windows50LabTypes';
export const EVO_W50_LABS_D: EvoWindowsFieldLab[] = [
  {
    "number": 31,
    "discovery": "Muchos 'programas de fábrica' no consumen CPU al estar cerrados; otros dejan servicios y tareas residentes. El truco es localizar persistencia antes de desinstalar.",
    "mechanism": "Hay aplicaciones UWP/MSIX y Win32, entradas de inicio, tareas, extensiones y servicios. El recuento de programas instalados no mide trabajo efectivo.",
    "preparation": "No desinstales nada durante el laboratorio. Elegí dos apps supuestamente inútiles y anotá sus funciones reales.",
    "experiment": [
      "Identificá aplicaciones de inicio y servicios asociados.",
      "Buscá sus PIDs y uso durante cinco minutos sin abrirlas.",
      "Distingí consumo persistente de espacio instalado sin procesos activos."
    ],
    "command": "Get-CimInstance Win32_StartupCommand | select Name,Location,User | sort Name\nGet-Process | Group-Object ProcessName | sort Count -Descending | select -First 15 Name,Count\nGet-ScheduledTask | ? {$_.TaskName -match 'update|assistant'} | select -First 25 TaskName,TaskPath,State",
    "evidence": "Una app instalada puede no tener procesos; una tarea configurada puede no haberse ejecutado. Faltan tiempo de actividad y origen para decidir.",
    "pitfall": "Los paquetes de Windows pueden compartir componentes; eliminar por nombre visual puede romper integraciones necesarias.",
    "action": "Si una app opcional mantiene procesos y no la utilizás, desinstalala mediante su desinstalador oficial, revisando antes licencia/datos.",
    "recovery": "Consulta sin cambios.",
    "challenge": "Separá 'ocupa disco', 'se inicia sola' y 'consume recursos ahora' para dos apps.",
    "references": [
      {
        "name": "Autoruns",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 32,
    "discovery": "Un Windows 'minimalista' no es el que tiene menos servicios: es el que conserva funciones necesarias con carga justificada y cambios reversibles.",
    "mechanism": "Inicio bajo demanda, dependencias y triggers permiten que un servicio aparezca en estado Manual sin coste constante. Un servicio compartido en svchost no permite atribuirle toda la RAM del host.",
    "preparation": "Creá un inventario antes de cualquier intervención. No deshabilites GPU, red, audio, seguridad, Windows Update ni servicios del sistema por recetas universales.",
    "experiment": [
      "Registrá servicios activos, modo de inicio y dependencias de uno opcional.",
      "Relacioná el servicio con funciones que realmente utilizás.",
      "Si es de software de terceros prescindible, desinstalá el programa tras backup y medí A/B; no cambies 20 servicios juntos."
    ],
    "command": "Get-CimInstance Win32_Service |\n select Name,DisplayName,StartMode,State,ProcessId,PathName |\n sort DisplayName | select -First 80\nGet-Service | ? {$_.Status -eq 'Running'} | measure",
    "evidence": "El conteo de servicios se interpreta junto a actividad real; que existan 200 servicios no demuestra consumo de 200 procesos.",
    "pitfall": "Desactivar servicios por listas de Internet puede bloquear inicio, red, impresión, audio y actualizaciones, sin mejora medible.",
    "action": "Priorizar desinstalar componentes de terceros que instalaste y no usás, validando antes/después; nunca perseguir 'RAM libre' a costa de estabilidad.",
    "recovery": "El laboratorio no cambia valores; cualquier intervención posterior exige exportar configuración y rollback probado.",
    "challenge": "Encontrá tres servicios Manual que funcionan por demanda y explicá por qué no deben deshabilitarse.",
    "references": [
      {
        "name": "Services",
        "url": "https://learn.microsoft.com/en-us/windows/win32/services/services"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 33,
    "discovery": "El Registro contiene un mapa de preferencias y políticas, pero una clave aparentemente 'oculta' no funciona como código mágico: el programa correspondiente debe leerla.",
    "mechanism": "HKLM aplica a máquina, HKCU a usuario y la vista de 32/64 bits puede diferir. Cambios de política, caché y reinicio determinan si el consumidor aplica un valor.",
    "preparation": "No escribas ni importes .reg de Internet. Elegí configuraciones visibles para comprobar correspondencia con entradas documentadas.",
    "experiment": [
      "Consultá rutas de inicio Run por usuario y por máquina.",
      "Compará HKCU y HKLM para comprender alcance.",
      "Mostrá el tipo del dato y la documentación del componente; si no existe, declaralo indeterminado."
    ],
    "command": "$paths=@('HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',\n'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',\n'HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run')\nforeach($p in $paths){Write-Output ('=== '+$p);Get-ItemProperty -Path $p -ErrorAction SilentlyContinue |\n Format-List}",
    "evidence": "Podés descubrir entradas de inicio que difieren por ámbito. Esto solo cubre tres ubicaciones: Autoruns encuentra muchas otras.",
    "pitfall": "No supongas que una clave vacía significa cero persistencia; hay RunOnce, tareas, servicios, shell extensions y políticas.",
    "action": "Para cambiar una entrada documentada, respaldá clave e identificá software propietario; evitá reglas universales.",
    "recovery": "Consultas sin modificación.",
    "challenge": "Explicá por qué un arranque persistente puede existir sin entradas en HKCU Run.",
    "references": [
      {
        "name": "Autoruns",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 34,
    "discovery": "El ajuste de Registro que promete 30 FPS extra suele carecer de documentación, mecanismo o efecto reproducible; la forma de desmontarlo es analizar quién lo lee.",
    "mechanism": "Una clave no altera rendimiento por existir. Necesitás versión Windows, componente consumidor y prueba que aisle una sola variable. Algunos ajustes históricos son ignorados en builds actuales.",
    "preparation": "Elegí un 'tweak milagroso' de un tutorial, sin aplicarlo. Anotá texto exacto, hive y tipo esperado.",
    "experiment": [
      "Comprueba si la ruta existe y su valor sin crearlo.",
      "Busca documentación oficial que describa el consumidor.",
      "Diseñá un ensayo con métrica reproducible; si no hay mecanismo, no realices el cambio."
    ],
    "command": "$ruta=Read-Host 'Ruta de Registro a AUDITAR (p.ej. HKCU:\\Control Panel\\Mouse)'\nif(Test-Path -LiteralPath $ruta) {\n Get-ItemProperty -LiteralPath $ruta | Format-List\n} else { 'La ruta no existe en esta instalación' }\nGet-ComputerInfo | select WindowsVersion,OsBuildNumber",
    "evidence": "Existencia/ausencia de una entrada no demuestra eficacia. Sin referencia y medición, la afirmación de ganancia es marketing.",
    "pitfall": "No ejecutes 'optimizadores de Registro' ni cambies prioridades globales de red/audio por rumores.",
    "action": "Priorizá una opción de interfaz soportada y comprobable; documentá valores de Registro sólo como evidencia de configuración.",
    "recovery": "Script consultivo; no escribe claves.",
    "challenge": "Auditá un valor popular e identificá la falta de mecanismo o documentación.",
    "references": [
      {
        "name": "Registry",
        "url": "https://learn.microsoft.com/en-us/windows/win32/sysinfo/registry"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 35,
    "discovery": "SFC y DISM resuelven clases diferentes de corrupción. Ejecutarlos por rutina ante cualquier FPS bajo no arregla un cuello de botella y confunde el diagnóstico.",
    "mechanism": "DISM /ScanHealth comprueba corrupción de la imagen de componentes; SFC /scannow verifica archivos de sistema protegidos y puede repararlos. /RestoreHealth puede necesitar Windows Update o fuente local válida.",
    "preparation": "Primero anotá el síntoma, últimos eventos y estado de backup. Diferenciá consultas de reparaciones.",
    "experiment": [
      "Ejecutá consultas de estado DISM y SFC sin cambios.",
      "Anotá si se detectaron componentes corruptos.",
      "Si aparece corrupción, consultá documentación antes de una reparación que modifica archivos y puede requerir reinicio."
    ],
    "command": "DISM.exe /Online /Cleanup-Image /CheckHealth\nDISM.exe /Online /Cleanup-Image /ScanHealth\nsfc.exe /verifyonly",
    "evidence": "Mensajes de corrupción o integridad son pruebas del almacén y archivos protegidos; resultado limpio no explica todos los problemas del PC.",
    "pitfall": "No interrumpas un DISM de reparación a ciegas ni interpretes un /RestoreHealth exitoso como optimización de gaming.",
    "action": "Ante corrupción confirmada y con copia de seguridad, reparar con herramientas oficiales y verificar nuevamente; no usar instaladores de 'DLL fixes'.",
    "recovery": "Comandos mostrados sólo verifican; no incluyen /RestoreHealth ni /scannow.",
    "challenge": "Explicá la diferencia de responsabilidades entre almacén de componentes y archivos protegidos.",
    "references": [
      {
        "name": "Repair Windows image",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 36,
    "discovery": "La carpeta WinSxS puede verse gigante porque Explorer cuenta vínculos duros varias veces. El tamaño reclamable no se adivina mirando propiedades.",
    "mechanism": "El almacén de componentes usa referencias y versiones del sistema. DISM /AnalyzeComponentStore informa tamaño real y si recomienda limpieza; /ResetBase elimina la capacidad de desinstalar actualizaciones previas.",
    "preparation": "No borres archivos de WinSxS manualmente ni uses scripts de eliminación de DLL; registrá espacio libre.",
    "experiment": [
      "Consultá espacio libre real del volumen.",
      "Ejecutá DISM /AnalyzeComponentStore sin realizar limpieza.",
      "Leé la bandera 'Component Store Cleanup Recommended' y tamaño de backup/caché; no confundas tamaño de Explorer con recuperable."
    ],
    "command": "Get-PSDrive -Name C | select Name,Used,Free\nDISM.exe /Online /Cleanup-Image /AnalyzeComponentStore",
    "evidence": "Podrás distinguir 'explorer size', tamaño real y recomendación del sistema. Una recomendación positiva tampoco implica necesariamente gigabytes.",
    "pitfall": "No ejecutes /ResetBase como limpieza normal: impide desinstalar actualizaciones existentes.",
    "action": "Si DISM recomienda limpieza y hay necesidad, considerar /StartComponentCleanup por vía oficial tras validar que el rollback de actualizaciones no sea necesario.",
    "recovery": "Los comandos de consulta no cambian el almacén.",
    "challenge": "Explicá por qué WinSxS aparece más grande en Explorer y qué medirías antes de limpiar.",
    "references": [
      {
        "name": "Clean Up the WinSxS Folder",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/clean-up-the-winsxs-folder"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 37,
    "discovery": "TPM y Secure Boot no son 'adornos de BIOS': pueden aportar integridad de arranque y protección de claves, pero requieren configuración correcta y recuperación planificada.",
    "mechanism": "TPM resguarda claves y mediciones; Secure Boot verifica la cadena de arranque según firmas/autoridades configuradas. No evitan por sí solos toda ejecución maliciosa.",
    "preparation": "NO cambies firmware, claves Secure Boot ni cifrado durante el laboratorio. Asegurá clave de recuperación antes de tocar configuración de arranque.",
    "experiment": [
      "Consultá presencia y estado TPM.",
      "Consultá Secure Boot si UEFI y permisos lo permiten.",
      "Anotá edición, modo UEFI y si hay cifrado de dispositivo/BitLocker antes de pensar en cambios."
    ],
    "command": "Get-Tpm -ErrorAction SilentlyContinue |\n select TpmPresent,TpmReady,TpmEnabled,TpmActivated\nConfirm-SecureBootUEFI -ErrorAction SilentlyContinue\nGet-ComputerInfo | select BiosFirmwareType",
    "evidence": "TPM listo y Secure Boot habilitado son capacidades observadas; no demuestran que nunca haya ocurrido ataque.",
    "pitfall": "No borres TPM ni cambies arranque para 'ganar FPS'; podrías perder acceso a datos cifrados.",
    "action": "Si falta protección, revisar requisitos oficiales y backups antes de actuar con especialista; mantener drivers/firmware sin cambios durante este diagnóstico.",
    "recovery": "Consulta sin mutación.",
    "challenge": "Diferenciá firma de arranque y cifrado del disco en dos frases.",
    "references": [
      {
        "name": "TPM",
        "url": "https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/trusted-platform-module-overview"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 38,
    "discovery": "Un diagnóstico serio puede unificar CPU, memoria, discos, servicios y eventos sin instalar una utilidad milagrosa ni tocar la configuración.",
    "mechanism": "PowerShell expone CIM, procesos y servicios. La clave es registrar contexto y limitaciones: fecha, versión, unidad, períodos y datos sensibles a ocultar antes de compartir.",
    "preparation": "Creá una carpeta de resultados a tu elección; la vista de auditoría que sigue muestra resumen en consola y no sube nada a Internet.",
    "experiment": [
      "Corré el snapshot en reposo y guardá salida voluntariamente si querés.",
      "Repetilo durante un síntoma real con las mismas variables.",
      "Compara métricas elegidas; no interpretes cambios de PID como rendimiento."
    ],
    "command": "$sys=Get-CimInstance Win32_OperatingSystem\n[pscustomobject]@{\n Hora=Get-Date\n Windows=$sys.Caption\n Version=$sys.Version\n RAMTotalGB=[math]::Round($sys.TotalVisibleMemorySize/1MB,2)\n RAMLibreGB=[math]::Round($sys.FreePhysicalMemory/1MB,2)\n Procesos=(Get-Process).Count\n ServiciosActivos=(Get-Service|?{$_.Status -eq 'Running'}).Count\n}\nGet-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' |\n select DeviceID,@{N='LibreGB';E={[math]::Round($_.FreeSpace/1GB,1)}}",
    "evidence": "Obtendrás métricas de estado, no un puntaje automático ni un diagnóstico de malware.",
    "pitfall": "Un snapshot no ve actividad entre muestras. No compartas exportaciones sin remover nombre de equipo, usuarios y rutas.",
    "action": "Usar este reporte como línea de base para un laboratorio específico; no ejecutar limpiezas automáticas.",
    "recovery": "Solo lectura.",
    "challenge": "Construí una comparación de dos días y elegí una diferencia que merezca investigar.",
    "references": [
      {
        "name": "Get-CimInstance",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 39,
    "discovery": "Cuando Windows no arranca, el tiempo valioso se pierde intentando trucos peligrosos sin un plan de recuperación. El primer paso es preparar evidencia y acceso antes del fallo.",
    "mechanism": "WinRE, inicio avanzado y medios de recuperación dependen de partición, BCD y estado de cifrado. Un error de arranque puede deberse a hardware, almacenamiento, drivers o actualizaciones.",
    "preparation": "No manipules BCD ni particiones. Verificá en un Windows que sí arranca la existencia de WinRE y la preparación de respaldo.",
    "experiment": [
      "Consultá estado de Windows RE.",
      "Comprobá si tu unidad contiene backups verificados y si hay cifrado activado.",
      "Documentá medios de instalación oficiales y dónde se guarda la clave de recuperación, sin copiarla a un informe compartido."
    ],
    "command": "reagentc /info\nGet-Volume | select DriveLetter,FileSystem,HealthStatus,SizeRemaining,Size\nGet-CimInstance Win32_OperatingSystem | select Caption,Version,LastBootUpTime",
    "evidence": "El estado WinRE habilitado es capacidad de recuperación, no garantía de que una reparación será exitosa.",
    "pitfall": "Nunca uses bcdedit /delete, formateos ni limpiezas de partición como receta de primer intento.",
    "action": "Crear y probar respaldo real; ante falla posterior, seguir recuperación oficial sin borrar archivos apresuradamente.",
    "recovery": "Consultas sin cambios.",
    "challenge": "Diseñá un plan de 5 pasos para entrar a WinRE sin arriesgar datos.",
    "references": [
      {
        "name": "Windows RE",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-recovery-environment--windows-re--technical-reference"
      }
    ],
    "reviewStatus": "lab-verificable"
  },
  {
    "number": 40,
    "discovery": "La auditoría definitiva no es un script con 200 interruptores: es una matriz de hipótesis y evidencias, empezando por CPU, memoria, almacenamiento, eventos e inicio.",
    "mechanism": "Cada sistema de medición tiene escala, ventana temporal y sesgos: un contador instantáneo, registro acumulado y una captura ETW no responden la misma pregunta.",
    "preparation": "Definí un síntoma reproducible y duración. No alteres variables hasta registrar estado previo.",
    "experiment": [
      "Registrá versión, uptime, memoria, discos, procesos activos y eventos recientes.",
      "Asigná a cada síntoma una métrica específica, no un tweak.",
      "Diseñá una comparación A/B con una sola intervención reversible si hay causa probada."
    ],
    "command": "Get-ComputerInfo | select WindowsProductName,OsBuildNumber\nGet-CimInstance Win32_OperatingSystem | select LastBootUpTime,FreePhysicalMemory\nGet-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' | select DeviceID,FreeSpace,Size\nGet-Process | sort PrivateMemorySize64 -Descending | select -First 8 Name,Id,PrivateMemorySize64\nGet-WinEvent -FilterHashtable @{LogName='System';Level=2;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 10 -ErrorAction SilentlyContinue | select TimeCreated,ProviderName,Id",
    "evidence": "Un expediente reproducible con contexto y observaciones. Puede contener datos privados; no compartir salida sin revisión.",
    "pitfall": "No comparar equipos o builds diferentes sin control; no prometer mejoras por número de procesos o cantidad de archivos eliminados.",
    "action": "Elegí una sola causa probable y comprobá intervención/reversión bajo mismo protocolo.",
    "recovery": "Solo lectura.",
    "challenge": "Con la matriz completa, escribí un diagnóstico que indique también qué NO se pudo concluir.",
    "references": [
      {
        "name": "Windows Performance Toolkit",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/test/wpt/"
      }
    ],
    "reviewStatus": "lab-verificable"
  }
];
