import type { EvoWindowsResearch } from './tomo02Magazine40CorpusTypes';
/** Control, Registro, reparación, seguridad y auditoría final · 034–040. */
export const EVO_WINDOWS40_CORPUS_E: EvoWindowsResearch[] = [
  {
    "number": 34,
    "premise": [
      "En Internet circulan valores del Registro que prometen bajar el ping, ganar FPS o acelerar el mouse. Muchos se repiten durante años aunque Windows, hardware y controladores hayan cambiado. Para evaluar un supuesto 'ajuste secreto' hay que identificar quién lee ese valor, cuándo lo interpreta y qué variable de rendimiento podría modificar.",
      "Este expediente ofrece un criterio para desarmar recomendaciones virales sin escribir ninguna clave nueva. No basta con que una entrada exista en un tutorial y cambie el resultado de un benchmark una vez."
    ],
    "mechanisms": [
      "El Registro es un almacén de preferencias y políticas; sus entradas no se ejecutan por sí solas. Un componente debe abrir la clave, interpretar el tipo y aplicar el comportamiento. Algunas políticas están documentadas por Microsoft y determinadas por versión; otras son restos históricos o nombres inventados por herramientas.",
      "Las configuraciones de red y temporización atraviesan controladores, pila TCP/IP, políticas de energía y scheduler. Un DWORD con nombre sugerente no equivale a un algoritmo mágico. La validación debe rastrear el consumidor real de la clave y su documentación técnica."
    ],
    "traps": [
      "Un artículo que muestra capturas de Regedit y promete '20 % menos input lag' sin medir extremo a extremo no prueba nada. Un cambio que coincide con reiniciar la PC se mezcla con cachés, actualizaciones, temperatura y variación de carga.",
      "Importar archivos .reg desconocidos puede cambiar permisos, seguridad o política de red de manera masiva. No uses la exportación como garantía de retorno si no sabés qué clave se aplicó, si había valores ausentes y qué dependencias resultaron afectadas."
    ],
    "protocol": [
      "Elegí una afirmación pública sobre una clave no crítica. Identificá nombre, ruta, tipo, documentación de la versión y componente consumidor. Antes de cualquier intervención, exigí hipótesis y una métrica específica con al menos tres repeticiones A/B/A bajo misma carga.",
      "Si no existe documentación que demuestre que el componente la lee en la versión analizada, el estado razonable es 'sin fundamento demostrado'. Ese resultado ya es una conclusión valiosa y evita cambios inútiles."
    ],
    "interpretation": [
      "La mejora debe superar la variabilidad natural y no introducir regresiones de seguridad, estabilidad o mantenimiento. Eliminar un valor después de una prueba no necesariamente restaura el estado: hay que distinguir clave que no existía de clave que tenía otro dato.",
      "Muchos 'tweaks' alteran el aspecto del sistema sin mejorar el comportamiento que prometen. Medir uso de CPU no reemplaza medir latencia de entrada; cada hipótesis necesita su instrumento."
    ],
    "conclusion": [
      "La regla EVO es pedir pruebas antes de cambiar el Registro. El conocimiento que recibe el lector permite reconocer marketing técnico cuando falta consumidor documentado, línea de base o retorno seguro.",
      "Un valor hexadecimal no es una mejora por el hecho de parecer avanzado. El resultado sólido puede ser demostrar que Windows ignora la configuración recomendada."
    ],
    "lab": {
      "title": "LAB 034 · AUDITAR UN TWEAK SIN APLICARLO",
      "why": "Documentá versión y un valor actual no sensible; investigá el origen antes de modificar.",
      "code": "Get-ComputerInfo | Select-Object WindowsProductName,OsBuildNumber\nGet-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -ErrorAction SilentlyContinue | Select-Object Hidden,HideFileExt\n# No importar archivos .reg descargados ni crear DWORD durante la auditoría.",
      "readout": "Encontrar una clave no prueba que Windows la use. Identificá componente consumidor y documentación antes de atribuir efectos."
    },
    "insight": "Una configuración solo tiene efecto si un componente real la lee e interpreta en esa versión.",
    "challenge": "Elegí un ajuste viral y exigile ruta, consumidor, métricas, control de variables y posibilidad de retorno.",
    "video": "¿Un DWORD para duplicar FPS? Pedile al vendedor que muestre quién lo lee.",
    "sources": [
      {
        "name": "Get-ItemProperty — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-itemproperty"
      },
      {
        "name": "Process Monitor — Microsoft Sysinternals",
        "url": "https://learn.microsoft.com/en-us/sysinternals/downloads/procmon"
      }
    ]
  },
  {
    "number": 35,
    "premise": [
      "Un juego empieza a cerrarse, las actualizaciones fallan y alguien recomienda 'pasá DISM y SFC'. Son herramientas auténticas, pero no solucionan cualquier avería. Si el origen es un módulo de memoria defectuoso, un controlador o una app dañada, reparar componentes de Windows puede no modificar el síntoma.",
      "Este expediente enseña qué verifica cada herramienta, en qué orden conviene interpretar la evidencia y cuándo pasar de diagnóstico a reparación con respaldo y fuente correcta. Primero vamos a observar, no reparar a ciegas."
    ],
    "mechanisms": [
      "SFC comprueba la integridad de archivos de sistema protegidos y puede intentar restaurarlos mediante los mecanismos de Windows Resource Protection. DISM examina o repara la imagen y su almacén de componentes, utilizado para mantenimiento de paquetes. Las operaciones son distintas y complementarias según la falla.",
      "DISM /CheckHealth consulta el estado marcado de corrupción; /ScanHealth ejecuta una búsqueda más exhaustiva; /RestoreHealth sí realiza reparación y puede necesitar fuente válida, como Windows Update o una imagen compatible. SFC /verifyonly verifica sin pedir reparación. SFC /scannow modifica archivos si detecta problemas."
    ],
    "traps": [
      "Confundir /ScanHealth con /RestoreHealth puede llevar a creer que se solucionó algo que solo se examinó. Un progreso detenido en un porcentaje durante minutos no prueba bloqueo; algunas fases consumen tiempo y recursos. No interrumpas operaciones reparadoras a mitad de escritura sin evaluar consecuencias.",
      "La salida 'no se encontraron violaciones' no demuestra que una aplicación o disco esté sano. Y errores por fuente de reparación faltante no se resuelven repitiendo infinitamente el mismo comando."
    ],
    "protocol": [
      "Antes de tocar el sistema registrá versión, espacio libre, síntomas, eventos y existencia de copias de seguridad. Ejecutá verificaciones consultivas y guardá su salida. Si hay corrupción confirmada, consultá documentación para conseguir una fuente compatible y determiná un plan de recuperación.",
      "Solo después, y con consentimiento informado del propietario, se puede plantear /RestoreHealth y luego /scannow según indicaciones oficiales. Esas operaciones son reparadoras y no forman parte del laboratorio de lectura inicial."
    ],
    "interpretation": [
      "Un resultado /CheckHealth reparable requiere decidir reparación; no basta con declarar que la PC está 'enferma' por un mensaje. Si /ScanHealth informa ausencia de corrupción, el problema podría estar fuera del almacén de componentes.",
      "La evidencia debe incluir código de salida, logs apropiados, build del sistema y síntomas antes/después. Sin eso, 'ejecuté DISM y mejoró' sigue siendo una coincidencia."
    ],
    "conclusion": [
      "El lector termina sabiendo qué capa de Windows examina cada comando, qué significa su respuesta y cuándo una reparación está justificada. Es un protocolo que evita formateos innecesarios y también evita creer que todo se cura con dos órdenes.",
      "Reparación profesional significa diagnóstico, copia de seguridad, intervención y verificación. El comando no reemplaza ese método."
    ],
    "lab": {
      "title": "LAB 035 · INTEGRIDAD SOLO LECTURA",
      "why": "Diagnostica integridad sin intentar reparar; puede requerir consola elevada.",
      "code": "DISM /Online /Cleanup-Image /CheckHealth\n# Para análisis más profundo, si disponés de tiempo y permisos:\nDISM /Online /Cleanup-Image /ScanHealth\nsfc /verifyonly",
      "readout": "CheckHealth/ScanHealth y verifyonly no solicitan reparación. RestoreHealth y scannow sí pueden modificar archivos: se reservan para una etapa posterior con respaldo."
    },
    "insight": "DISM mira el almacén de componentes; SFC mira archivos protegidos. Ninguno cura toda falla de Windows.",
    "challenge": "Tomá un diagnóstico no destructivo y redactá qué repararías solo si hubiera evidencia concreta.",
    "video": "¿DISM arregla cualquier problema? Primero distinguí detectar corrupción de repararla.",
    "sources": [
      {
        "name": "Repair a Windows Image — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image"
      },
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      }
    ]
  },
  {
    "number": 36,
    "premise": [
      "La carpeta WinSxS parece ocupar una cantidad descomunal de espacio. Muchos limpiadores la presentan como una reserva 'sobrante' lista para borrar. En realidad es el almacén de componentes usado para mantenimiento, actualizaciones, características y reparación. Su tamaño aparente en Explorador puede sobreestimar ocupación por vínculos entre archivos.",
      "La investigación aporta una habilidad que evita un desastre clásico: distinguir tamaño mostrado por directorio, tamaño real del almacén y espacio potencialmente recuperable mediante mecanismos oficiales. El laboratorio no elimina absolutamente nada."
    ],
    "mechanisms": [
      "Windows utiliza enlaces físicos (hard links) y estructuras de componentes que hacen que múltiples rutas apunten al mismo contenido en disco. Por ello sumar tamaños de archivos dentro de WinSxS como si todo fuese independiente puede contar datos varias veces. DISM ofrece un análisis de tamaño real, cachés, versiones y recomendación de limpieza.",
      "El sistema puede conservar versiones reemplazadas para permitir reversión de ciertas actualizaciones. La tarea de mantenimiento de componentes gestiona esa retención bajo políticas y tiempos. Limpiar componentes de manera soportada no equivale a borrar la carpeta en el Explorador."
    ],
    "traps": [
      "La promesa 'borrá WinSxS y liberá 20 GB' puede dejar el sistema incapaz de arrancar, actualizarse o repararse. Microsoft advierte explícitamente contra el borrado manual. Tampoco la opción /ResetBase es inocua: limita capacidad de desinstalar actualizaciones existentes después de su uso.",
      "Un valor 'X GB' para todos los equipos carece de fundamento. La cantidad recuperable depende de historial de actualizaciones, features instaladas y estado del almacén. Primero hay que analizar."
    ],
    "protocol": [
      "Consultá DISM /AnalyzeComponentStore y registrá tamaño declarado, uso compartido por Windows, cachés y si recomienda limpieza. Interpretá la lectura junto al espacio libre real del volumen. No te guíes por la cifra que muestra el Explorador al seleccionar una carpeta con enlaces.",
      "Si existe una recomendación de limpieza, documentá por qué sería conveniente, cuál es la ventana de mantenimiento y qué reversión necesita el equipo. El laboratorio no ejecuta StartComponentCleanup ni ResetBase."
    ],
    "interpretation": [
      "Una diferencia entre tamaño aparente y tamaño real es esperable por hard links. Un almacén grande puede ser normal y no justificar intervenir. Una limpieza automática que se realiza más adelante tampoco significa que la carpeta estuviera dañada.",
      "Si una herramienta afirma liberar más espacio del que realmente ocupa el volumen, revisá cómo calcula su suma. Una cifra contable no se convierte automáticamente en capacidad recuperable."
    ],
    "conclusion": [
      "La ganancia real de este capítulo es preservar un elemento crítico del sistema mientras aprendés a medirlo correctamente. El lector ya no verá WinSxS como basura sino como parte de la arquitectura de reparación y mantenimiento.",
      "Una optimización legítima debe ser soportada, justificada por el informe de DISM y compatible con necesidades de rollback. Borrar manualmente es incompatible con ese criterio."
    ],
    "lab": {
      "title": "LAB 036 · TAMAÑO REAL DE WINSXS",
      "why": "Solo genera un análisis. No realiza limpieza de componentes.",
      "code": "DISM /Online /Cleanup-Image /AnalyzeComponentStore\nGet-Volume -ErrorAction SilentlyContinue | Where-Object DriveLetter -eq 'C' | Select-Object DriveLetter,Size,SizeRemaining",
      "readout": "Buscá Component Store Cleanup Recommended y tamaños reales en la salida. No uses /StartComponentCleanup /ResetBase ni borres la carpeta para completar este laboratorio."
    },
    "insight": "WinSxS sostiene el mantenimiento. Su tamaño aparente no equivale a espacio recuperable.",
    "challenge": "Compará tamaño del Explorador, análisis DISM y tamaño libre sin borrar ningún archivo.",
    "video": "¿WinSxS ocupa gigas? La cifra del Explorador puede estar contándolos dos veces.",
    "sources": [
      {
        "name": "WinSxS Cleanup — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/clean-up-the-winsxs-folder"
      },
      {
        "name": "Determinar tamaño de WinSxS — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/determine-the-actual-size-of-the-winsxs-folder"
      }
    ]
  },
  {
    "number": 37,
    "premise": [
      "Al encender una PC moderna se establece confianza antes de que aparezca el escritorio. TPM y Secure Boot suelen nombrarse juntos, pero cumplen funciones distintas: uno proporciona capacidades criptográficas y mediciones protegidas según plataforma; el otro aplica una política de verificación de firmas durante ciertas fases del arranque UEFI. Ninguno garantiza que la PC sea invulnerable.",
      "El expediente permite identificar el estado actual de esas protecciones sin cambiar firmware, limpiar TPM o tocar claves de recuperación. Es especialmente útil antes de instalar otro sistema, actualizar BIOS o diagnosticar BitLocker."
    ],
    "mechanisms": [
      "Secure Boot confía en firmas de componentes del arranque conforme a políticas y bases de confianza del firmware. TPM puede respaldar claves, mediciones y mecanismos de sellado utilizados por cifrado y autenticación. BitLocker puede vincular protectores a condiciones de plataforma; cambios de firmware o arranque pueden desencadenar solicitud de recuperación.",
      "La presencia física de TPM no implica que el volumen esté cifrado, y Secure Boot habilitado no equivale a TPM preparado. En Windows, las APIs y cmdlets exponen estados diferentes. La relevancia depende de firmware UEFI, edición, hardware y configuración organizativa."
    ],
    "traps": [
      "Clear-Tpm destruye material de TPM administrado según el contexto y no debe ejecutarse para 'hacerlo andar'. Deshabilitar Secure Boot sin revisar protectores de recuperación puede provocar pérdida temporal de acceso al volumen. Compartir claves de BitLocker públicamente constituye una exposición de seguridad grave.",
      "La advertencia 'TPM deshabilitado = PC infectada' es falsa. Hay configuraciones heredadas, equipos sin soporte o políticas diferentes. Se reporta capacidad y estado; después se evalúa riesgo según propósito."
    ],
    "protocol": [
      "Consultá Get-Tpm para capacidad y preparación; Confirm-SecureBootUEFI para estado de arranque confiable cuando el firmware y permisos lo permitan. Consultá estado general de cifrado de unidades sin exportar protectores ni secretos. Registrá edición, build y tipo de firmware.",
      "Si planeás actualizar firmware o tocar arranque, verificá primero que exista un método de recuperación válido y que el propietario lo conserve de forma segura. En este laboratorio no se cambian ajustes UEFI ni se suspenden protecciones."
    ],
    "interpretation": [
      "Un resultado False en Confirm-SecureBootUEFI significa deshabilitado en plataforma compatible, no automáticamente un fallo. El comando puede devolver error por BIOS heredada o permisos insuficientes. Get-Tpm informa varias propiedades que no deben confundirse con la protección de cada volumen.",
      "El estado de BitLocker y protectores debe manejarse con confidencialidad. El informe publica 'cifrado activo/inactivo' y cumplimiento de la política, jamás secretos o identificadores de recuperación."
    ],
    "conclusion": [
      "El lector comprende una cadena de confianza en vez de repetir siglas. Puede explicar cómo firmware, firmas, mediciones, TPM y cifrado se relacionan sin reemplazar una cosa por otra.",
      "El mayor aprendizaje práctico es saber qué comprobar antes de una modificación que afecte el arranque; esas precauciones pueden salvar el acceso a los datos."
    ],
    "lab": {
      "title": "LAB 037 · CADENA DE CONFIANZA",
      "why": "Consulta estado de TPM, Secure Boot y cifrado sin alterar claves ni firmware.",
      "code": "Get-Tpm | Select-Object TpmPresent,TpmReady,TpmEnabled,TpmActivated\nConfirm-SecureBootUEFI\nGet-BitLockerVolume | Select-Object MountPoint,VolumeStatus,ProtectionStatus,EncryptionPercentage",
      "readout": "Secure Boot puede requerir consola elevada y UEFI. No incluyas KeyProtector ni claves de recuperación en capturas públicas. Nunca uses Clear-Tpm ni cambies UEFI durante este laboratorio."
    },
    "insight": "TPM, Secure Boot y BitLocker son capas distintas; verificarlas no implica modificarlas.",
    "challenge": "Documentá estados de cada capa y explicá qué significaría perder una clave de recuperación antes de actualizar firmware.",
    "video": "Tu seguridad empieza antes de Windows. ¿Sabés qué protege el TPM y qué protege Secure Boot?",
    "sources": [
      {
        "name": "Get-Tpm — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/trustedplatformmodule/get-tpm"
      },
      {
        "name": "Confirm-SecureBootUEFI — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/secureboot/confirm-securebootuefi"
      },
      {
        "name": "Get-BitLockerVolume — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/bitlocker/get-bitlockervolume"
      }
    ]
  },
  {
    "number": 38,
    "premise": [
      "Muchos scripts que prometen 'diagnóstico completo' simplemente enumeran cien propiedades sin explicar qué significa ninguna. Un informe profesional es diferente: define alcance, recoge solo las métricas necesarias, registra versión y hora, explica unidades y preserva resultados para comparar. PowerShell puede producir ese expediente con herramientas nativas.",
      "Esta investigación no vende un script mágico. Te enseña a diseñar una función repetible, segura y legible que respete datos personales, no eleve privilegios sin motivo y no cambie servicios. La salida debe servir para tomar una decisión."
    ],
    "mechanisms": [
      "PowerShell trabaja con objetos, no solo líneas de texto. Get-CimInstance y Get-Process devuelven propiedades tipadas; Select-Object define un contrato de salida; Export-Csv guarda series para análisis posterior. La versión de PowerShell y módulos disponibles afectan qué datos se pueden consultar.",
      "Un buen script separa adquisición de datos, validación, transformación y presentación. Los errores no deben ocultarse indiscriminadamente, porque 'sin salida' no equivale a 'sin problema'. Tampoco se debe guardar información sensible más allá del alcance acordado."
    ],
    "traps": [
      "Un reporte que suma Working Sets como si fueran RAM total produce cifras engañosas. Una tabla que llama CPU% a segundos acumulados sin muestreo está mal diseñada. Los informes deben incluir unidad, intervalo, proveedor y método de cálculo.",
      "Ejecutar un script que modifica el sistema con permisos de administrador y luego llamarlo 'auditoría' es una contradicción. Primero se construye el módulo de lectura; cualquier ajuste forma parte de otra fase con aprobación explícita y rollback."
    ],
    "protocol": [
      "Definí un contrato pequeño: nombre del equipo anonimizado en el informe público, versión, última hora de inicio, memoria total disponible y los cinco procesos principales por memoria privada. Validá que las propiedades existan; incorporá mensajes si una consulta no está disponible.",
      "Antes de generar archivos, imprimí el resultado en consola y revisá si expone nombres personales, rutas de usuario o IDs. Luego, voluntariamente, exportalo a una carpeta local que controles y registrá fecha y versión del script. No subas los datos crudos a internet."
    ],
    "interpretation": [
      "Si el resultado cambia tras reiniciar, distinguí efectos de caché, procesos transitorios y carga de usuario. Las métricas solo son comparables si comparten intervalo y unidades. Registrá además qué consultas fallaron por permisos.",
      "El código debe ser autoexplicativo: si un tercero no puede saber qué mide y cómo repetirlo, aún no es un laboratorio terminado. No ocultes errores mediante try/catch vacío."
    ],
    "conclusion": [
      "El lector se lleva una plantilla de expediente ejecutable, no una colección de hacks. PowerShell permite observar, transformar y guardar evidencia con controles de privacidad y sin tocar funciones críticas de Windows.",
      "La etapa siguiente será ampliar con métricas temporales de CPU, red y DPC; primero debe quedar probado que la arquitectura de datos es correcta."
    ],
    "lab": {
      "title": "LAB 038 · PRIMER INFORME OBJETUAL",
      "why": "Imprime datos en memoria; no crea archivos ni cambia configuración.",
      "code": "$os=Get-CimInstance Win32_OperatingSystem\n[pscustomobject]@{Fecha=Get-Date;Windows=$os.Caption;Build=$os.BuildNumber;RAM_Total_GB=[math]::Round($os.TotalVisibleMemorySize/1MB,2);RAM_Libre_GB=[math]::Round($os.FreePhysicalMemory/1MB,2)} | Format-List\nGet-Process | Sort-Object PrivateMemorySize64 -Descending | Select-Object -First 5 Name,Id,@{N='PrivateMB';E={[math]::Round($_.PrivateMemorySize64/1MB,1)}} | Format-Table -AutoSize",
      "readout": "Win32_OperatingSystem expresa TotalVisibleMemorySize y FreePhysicalMemory en KiB, por eso 1MB en PowerShell (1.048.576) convierte a GiB. PrivateMB proviene de bytes /1MB."
    },
    "insight": "Un informe debe incluir fuente, unidad y límites; no basta con imprimir muchos números.",
    "challenge": "Agregá al informe una definición por métrica y una decisión que podría justificar sin exponer datos privados.",
    "video": "¿PowerShell puede diagnosticar profesionalmente tu PC? Sí, cuando sabés exactamente qué estás midiendo.",
    "sources": [
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
    "number": 39,
    "premise": [
      "Windows no arranca y aparecen mensajes de recuperación. En ese momento lo más importante no es encontrar un 'comando de rescate universal', sino determinar qué datos no podés perder, si la unidad está cifrada, qué clase de fallo ocurrió y qué herramientas de recuperación tenés disponibles. Improvisar modificaciones de particiones puede transformar un incidente reparable en una pérdida definitiva.",
      "Este expediente construye un plan de preparación antes de la emergencia y un árbol de decisiones para cuando el equipo no inicie. El laboratorio solo consulta el estado del entorno de recuperación en una máquina que funciona."
    ],
    "mechanisms": [
      "Windows Recovery Environment (WinRE) ofrece herramientas de recuperación, reparación de inicio, restauración y acceso a opciones avanzadas. Su disponibilidad depende de particiones, configuración y estado de la imagen. La cadena UEFI/BCD/Winload/Kernel permite localizar distintas fases, pero los síntomas de fallo pueden superponerse.",
      "BitLocker o cifrado de dispositivo puede exigir una clave de recuperación al cambiar componentes, firmware o condiciones de arranque. La clave debe permanecer en un lugar seguro que el propietario controle. Un equipo sin copia de seguridad ni clave no debe someterse a experimentos destructivos."
    ],
    "traps": [
      "Ejecutar bootrec, bcdboot, formatear EFI o reconstruir particiones a ciegas puede alterar el sistema equivocado, especialmente con varios discos o volúmenes. El primer paso no es escribir BCD nuevo; es preservar datos y determinar la topología.",
      "Que aparezca 'reparación automática' no prueba que una reparación de inicio vaya a resolver corrupción de disco o falla física. Tampoco insistir en reinicios continuos arregla hardware. Los métodos de recuperación tienen riesgos y límites distintos."
    ],
    "protocol": [
      "En un equipo sano, verificá estado de WinRE, tipo de firmware, volúmenes y protección de cifrado sin revelar claves. Confirmá que tenés copia reciente y probada de archivos relevantes. Prepará un medio oficial de recuperación cuando corresponda y conocé cómo acceder a firmware/menú de arranque.",
      "Si ocurre un fallo real, registrá mensaje exacto, cambios recientes, código de error y si el firmware detecta la unidad. Priorizá preservar datos. Solo después seleccioná restauración, reparación o reinstalación conforme a evidencia y soporte."
    ],
    "interpretation": [
      "WinRE deshabilitado aumenta la dificultad de recuperación pero no significa que el equipo esté averiado hoy. Un disco visible en firmware no garantiza integridad del sistema de archivos; un inicio fallido tras update no prueba que el update sea la única causa.",
      "Cuando hay sospecha de falla física de almacenamiento, ejecutar repetidamente verificaciones intensivas o escrituras puede agravar el riesgo. Primero evaluá respaldo y salud de la unidad."
    ],
    "conclusion": [
      "El lector termina con un checklist preventivo: copias, cifrado, claves, WinRE, soporte oficial, datos críticos y guía de primeros pasos. Su utilidad se descubre antes del desastre, no después.",
      "Un procedimiento profesional de recuperación comienza por proteger la posibilidad de volver atrás. Un Windows que no arranca se diagnostica; no se castiga con comandos al azar."
    ],
    "lab": {
      "title": "LAB 039 · PREPARAR ANTES DEL FALLO",
      "why": "Inspecciona WinRE y estado general; no escribe BCD, EFI ni particiones.",
      "code": "reagentc /info\nGet-ComputerInfo | Select-Object WindowsProductName,OsBuildNumber,BiosFirmwareType\nGet-BitLockerVolume | Select-Object MountPoint,ProtectionStatus,VolumeStatus",
      "readout": "reagentc /info consulta configuración. No muestres claves de recuperación y no ejecutes /disable ni /enable durante este laboratorio de inventario."
    },
    "insight": "La recuperación empieza antes de la avería: respaldos, cifrado, WinRE y comprensión del fallo.",
    "challenge": "Comprobá que sabrías restaurar un archivo propio y dónde está tu recuperación, sin publicar secretos.",
    "video": "El día que Windows no arranque, la herramienta más valiosa será el plan que hiciste hoy.",
    "sources": [
      {
        "name": "Windows Recovery Environment — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/windows-recovery-environment--windows-re--technical-reference"
      },
      {
        "name": "REAgentC command-line options — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/reagentc-command-line-options"
      },
      {
        "name": "Get-BitLockerVolume — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/bitlocker/get-bitlockervolume"
      }
    ]
  },
  {
    "number": 40,
    "premise": [
      "El último gran misterio no es un servicio oculto: es descubrir si sabés auditar tu Windows con rigor. Tras 39 investigaciones, el lector tiene las piezas del método: inventario, procesos, permisos, redes, memoria, eventos, integridad, seguridad y recuperación. Un informe digno de una revista premium debe conectarlas sin mezclar números inconmensurables.",
      "Esta auditoría final convierte las lecciones en un expediente reproducible que cualquier técnico o usuario informado pueda revisar. No promete curar nada automáticamente; pretende mostrar qué se puede afirmar con evidencia y qué continúa siendo hipótesis."
    ],
    "mechanisms": [
      "Una auditoría de Windows es una recolección de observaciones con alcance definido. Las capas incluyen hardware/firmware, kernel/servicios, aplicaciones, cuentas y red. Cada una produce datos con unidades, permisos y períodos diferentes. Integrarlas no significa unir todo en una tabla de 'salud 100 %', sino documentar relaciones y límites.",
      "Los logs registran eventos, Get-Process describe procesos y contadores, CIM muestra inventarios y Get-NetTCPConnection proporciona sockets actuales. Ninguna fuente cubre todo el ciclo de un equipo. La composición profesional implica identificar huecos y evitar llamar 'completo' a lo que no capturaste."
    ],
    "traps": [
      "El sesgo de confirmación es el error más caro: empezar por una sospecha y seleccionar solo las observaciones que la sostienen. Un script que dice 'virus' porque vio CPU alta o una conexión de Microsoft incumple criterios forenses básicos.",
      "También sería incorrecto concluir 'Windows optimizado al máximo' porque el equipo usa menos RAM en reposo. Un expediente final se evalúa por trazabilidad, comparabilidad y decisiones justificadas, no por colores de un panel."
    ],
    "protocol": [
      "Definí un alcance público y seguro: versión/build, hora, RAM visible/disponible, principales procesos por memoria privada, estado de algunos servicios, tareas de inicio, diez eventos recientes del sistema y sockets establecidos. Tomá una fotografía base y guardá el plan para repetir el mismo protocolo tras un cambio legítimo.",
      "Creá una tabla por hallazgo: observación, instrumento, instante, evidencia, hipótesis, contraejemplo, nivel de confianza, riesgo, próxima prueba y decisión. Priorizá problemas que el usuario realmente sufre; un hallazgo menor sin impacto puede registrarse sin intervenir."
    ],
    "interpretation": [
      "Un informe valioso no debe publicar nombres de cuenta, rutas privadas, hashes sensibles, direcciones internas completas ni identificadores persistentes. La anonimización forma parte del método. Si una fuente requiere privilegios, anotá si no pudo ejecutarse en vez de inventar valores.",
      "Cuando dos fuentes no coinciden, comprobá si miden igual denominador, intervalo y definición. Una auditoría que descarta datos incómodos para obtener una conclusión firme no merece confianza."
    ],
    "conclusion": [
      "El último veredicto de EVO LABS puede ser 'el sistema funciona dentro de los objetivos y no se recomienda modificarlo'. Esa decisión está tan justificada como reparar un error medido; evita cambios que podrían degradar algo estable.",
      "El objetivo final es que cualquier lector sea capaz de decir 'esto sé, esto medí, esto desconozco y esta es mi próxima prueba'. Esa competencia, no el secreto de un Registro, diferencia conocimiento técnico de promesa publicitaria."
    ],
    "lab": {
      "title": "LAB 040 · EXPEDIENTE DE ESTADO",
      "why": "Produce un resumen informativo en consola. No exporta automáticamente datos sensibles ni modifica Windows.",
      "code": "$os=Get-CimInstance Win32_OperatingSystem\n[pscustomobject]@{Fecha=Get-Date;Windows=$os.Caption;Build=$os.BuildNumber;RAM_Visible_GiB=[math]::Round($os.TotalVisibleMemorySize/1MB,2)}\nGet-Process | Sort-Object PrivateMemorySize64 -Descending | Select-Object -First 10 Name,Id,PrivateMemorySize64\nGet-Service | Group-Object Status | Select-Object Name,Count\nGet-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Measure-Object | Select-Object Count",
      "readout": "La cantidad de sockets no prueba telemetría ni filtración. No hay una puntuación universal; interpretá cada tabla con método, unidades y contexto."
    },
    "insight": "La auditoría definitiva no destruye ni optimiza sola: vincula hechos, hipótesis, decisiones y límites.",
    "challenge": "Escribí tu expediente EVO con diez hallazgos, tres hipótesis refutables y cinco decisiones; justificalos sin ejecutar un solo cambio automático.",
    "video": "¿Qué hace Windows realmente? Terminaste el recorrido: ahora podés demostrarlo.",
    "sources": [
      {
        "name": "Get-CimInstance — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance"
      },
      {
        "name": "Get-WinEvent — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent"
      },
      {
        "name": "Get-ScheduledTask — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/get-scheduledtask"
      },
      {
        "name": "Get-NetTCPConnection — Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection"
      }
    ]
  }
];
