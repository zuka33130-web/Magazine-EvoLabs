import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Windows extremo I · Investigaciones 101, 103–112. Sin cambios destructivos. */
export const EVO_MAGAZINE_WINDOWS_A: EvoMagazineArticle[] = [
  {
    "id": 101,
    "goal": "Distinguir componentes opcionales del sistema de software esencial y medir su presencia.",
    "basics": "Una instalación normal incluye funciones que tal vez nunca uses: impresión, virtualización, idiomas, clientes de sincronización y utilidades. Que no los uses no significa que consuman RAM constantemente ni que sea seguro eliminarlos.",
    "steps": [
      {
        "title": "Descubrí las características opcionales",
        "why": "Get-WindowsOptionalFeature consulta paquetes de la imagen instalada; puede requerir PowerShell elevado.",
        "code": "Get-WindowsOptionalFeature -Online | Select-Object -First 15 FeatureName,State",
        "expect": "Verás características habilitadas, deshabilitadas o pendientes; si falla por permisos, registrá ese dato."
      },
      {
        "title": "Buscá capacidades de Windows",
        "why": "Las capacidades pueden representar lenguajes, herramientas o componentes instalados.",
        "code": "Get-WindowsCapability -Online | Select-Object -First 12 Name,State",
        "expect": "Puede requerir permisos; listado no es prueba de consumo de recursos."
      },
      {
        "title": "Compará con software instalado",
        "why": "Consultá una de las claves oficiales de desinstalación sin iniciar reparaciones MSI.",
        "code": "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' -ErrorAction SilentlyContinue | Select-Object -First 15 DisplayName,Publisher",
        "expect": "La lista es parcial y no implica que cada producto ejecute un proceso."
      }
    ],
    "tip": "Truco EVO: clasificá cada componente por uso real, espacio en disco, dependencias y riesgo de quitarlo antes de decidir.",
    "warning": "No desinstales características como .NET, Hyper-V o impresión sin comprobar si tus aplicaciones las requieren.",
    "challenge": "Elegí cinco componentes, explicá si ocupan disco, RAM o ambos y cuál sería la evidencia para confirmar su impacto."
  },
  {
    "id": 103,
    "goal": "Diseñar un Windows minimalista que mantenga funcionando lo importante.",
    "basics": "Minimalista significa reducir complejidad innecesaria con mediciones, no perseguir el número más bajo de procesos. La caché y los servicios bajo demanda pueden mejorar la experiencia sin estar siempre activos.",
    "steps": [
      {
        "title": "Registrá los procesos antes de optimizar",
        "why": "Tomá una línea base repetible en una sesión estable.",
        "code": "Get-Process | Measure-Object | Select-Object Count",
        "expect": "El número cambia naturalmente y no representa por sí mismo velocidad."
      },
      {
        "title": "Consultá servicios activos y automáticos",
        "why": "La categoría de inicio ayuda a investigar candidatos pero no justifica deshabilitarlos.",
        "code": "Get-Service | Where-Object {$_.Status -eq 'Running'} | Measure-Object | Select-Object Count",
        "expect": "Obtenés la cantidad de servicios ejecutándose ahora."
      },
      {
        "title": "Observá memoria y arranque",
        "why": "Anotá memoria física disponible y fecha de arranque para mantener contexto.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory,TotalVisibleMemorySize,LastBootUpTime",
        "expect": "Valores en KiB, junto con una fecha; no es un benchmark de FPS."
      }
    ],
    "tip": "Truco EVO: definí antes un contrato de funcionalidad: sonido, red, drivers, actualizaciones, respaldos y aplicaciones necesarias.",
    "warning": "No elimines a ciegas servicios de seguridad o controladores; una cifra menor puede ocultar pérdida de funciones.",
    "challenge": "Escribí tu objetivo: tres mejoras medibles, cinco funciones que deben seguir operativas y cómo revertirías cambios."
  },
  {
    "id": 104,
    "goal": "Investigar cuántos servicios hay realmente y cómo se diferencian sus estados.",
    "basics": "El Administrador de servicios mantiene servicios instalados, activos, detenidos y configurados para iniciar según demanda. Dos Windows con igual cantidad pueden consumir recursos muy distintos.",
    "steps": [
      {
        "title": "Contá servicios registrados",
        "why": "Get-Service devuelve todos los servicios disponibles que puede enumerar tu sesión.",
        "code": "Get-Service | Measure-Object | Select-Object Count",
        "expect": "Obtendrás un total que depende de la edición, drivers y aplicaciones."
      },
      {
        "title": "Separá servicios activos de detenidos",
        "why": "El estado refleja un instante, no una obligación de deshabilitar.",
        "code": "Get-Service | Group-Object Status | Select-Object Name,Count",
        "expect": "Aparecen grupos como Running y Stopped."
      },
      {
        "title": "Observá inicio automático",
        "why": "Enumerá algunos servicios cuyo arranque está configurado como automático.",
        "code": "Get-Service | Where-Object {$_.StartType -eq 'Automatic'} | Select-Object -First 15 Name,Status,StartType",
        "expect": "Puede haber automáticos detenidos; esto no implica necesariamente error."
      }
    ],
    "tip": "Truco EVO: compará por finalidad (seguridad, red, multimedia, terceros) en vez de usar 'menos servicios' como puntaje.",
    "warning": "No cambies estado de servicios compartidos sin revisar qué depende de ellos.",
    "challenge": "Elegí tres servicios y explicá diferencia entre su tipo de inicio y su estado actual."
  },
  {
    "id": 105,
    "goal": "Examinar 20 controles de Windows y distinguir ajustes útiles de mitos virales.",
    "basics": "Ajustes de visualización, almacenamiento, accesibilidad, inicio y privacidad pueden mejorar comodidad, pero los efectos sobre FPS y RAM dependen del caso. La meta es aprender a evaluar ajustes reales, uno por uno.",
    "steps": [
      {
        "title": "Abrí las áreas de configuración",
        "why": "Revisá Sistema, Aplicaciones, Personalización, Privacidad y seguridad, Accesibilidad y Windows Update.",
        "code": "Start-Process 'ms-settings:'",
        "expect": "Verás el centro de Configuración, sin modificar opciones."
      },
      {
        "title": "Revisá programa de inicio y almacenamiento",
        "why": "Identificá cuánto software inicia con la sesión y qué ocupa espacio.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object -First 10 Name,Location",
        "expect": "Es un inventario parcial, no un diagnóstico automático."
      },
      {
        "title": "Identificá tu plan de energía actual",
        "why": "Registrá la configuración antes de experimentar.",
        "code": "powercfg /getactivescheme",
        "expect": "Obtendrás el identificador y nombre del plan activo."
      }
    ],
    "tip": "Truco EVO: los 20 controles a estudiar son: 1 inicio, 2 almacenamiento, 3 notificaciones, 4 apps en segundo plano, 5 permisos cámara, 6 micrófono, 7 ubicación, 8 anuncios, 9 diagnósticos, 10 sincronización, 11 actualizaciones, 12 restauración, 13 firewall, 14 navegador predeterminado, 15 búsqueda, 16 energía, 17 pantalla/Hz, 18 accesibilidad, 19 extensiones y 20 copias de seguridad.",
    "warning": "No apliques veinte cambios juntos: nunca sabrías cuál mejoró o empeoró el sistema.",
    "challenge": "Elegí dos controles, formulá una métrica y explicá cómo harías una comparación reversible."
  },
  {
    "id": 106,
    "goal": "Aprender Regedit desde cero y reconocer el efecto real de una configuración.",
    "basics": "El Registro almacena claves y valores con tipos concretos. Un DWORD que circula por Internet no necesariamente existe en todas las versiones; modificarlo sin conocer su consumidor puede no producir ningún efecto.",
    "steps": [
      {
        "title": "Abrí Regedit y reconocé las ramas",
        "why": "Explorá HKCU y HKLM sin entrar a claves protegidas.",
        "code": "Start-Process regedit.exe",
        "expect": "Se abre el editor si está disponible; no importes archivos .reg."
      },
      {
        "title": "Consultá un valor del usuario",
        "why": "Leé una preferencia del Explorador sin modificarla.",
        "code": "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -ErrorAction SilentlyContinue | Select-Object HideFileExt,Hidden",
        "expect": "Verás números u opciones vacías según compilación y perfil."
      },
      {
        "title": "Investigá nombre, dato y tipo",
        "why": "Get-Item usa el proveedor del Registro para consultar información de una clave.",
        "code": "Get-Item 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -ErrorAction SilentlyContinue | Select-Object Name,Property",
        "expect": "Podés ver nombres de valores almacenados. El resultado no implica mejora del sistema."
      }
    ],
    "tip": "Truco EVO: copiá ruta exacta, nombre, tipo y valor inicial antes de planear cualquier cambio.",
    "warning": "Nunca importes regedits virales que desactivan seguridad, limpieza de perfiles o parámetros de arranque.",
    "challenge": "Explicá qué significa HKCU y por qué un valor DWORD necesita documentación y una prueba medible."
  },
  {
    "id": 107,
    "goal": "Investigar cómo directivas, aplicaciones y preferencias gobiernan Windows.",
    "basics": "Una preferencia en Configuración puede provenir de una política, del perfil de usuario o de un servicio. Modificar la misma opción desde Regedit puede ser inútil si una directiva administrada vuelve a aplicarla.",
    "steps": [
      {
        "title": "Consultá versión y edición",
        "why": "Las políticas disponibles varían entre Home, Pro y Enterprise.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber",
        "expect": "Vas a obtener información contextual de tu instalación."
      },
      {
        "title": "Abrí las herramientas de directivas",
        "why": "En las ediciones que lo incorporan, gpedit.msc permite explorar políticas locales.",
        "code": "Get-Command gpedit.msc -ErrorAction SilentlyContinue | Select-Object Name,Source",
        "expect": "Puede devolver un comando o ninguna fila si la edición no incluye el editor."
      },
      {
        "title": "Consultá políticas efectivas",
        "why": "gpresult muestra información resultante para la sesión actual y puede requerir permisos.",
        "code": "gpresult /r",
        "expect": "Podés ver políticas de usuario/equipo o avisos de acceso insuficiente."
      }
    ],
    "tip": "Truco EVO: cuando un ajuste 'vuelve solo', investigá el origen de la política antes de repetir cambios.",
    "warning": "No modifiques políticas administradas por una empresa, escuela u organización.",
    "challenge": "Explicá por qué tener permiso para escribir en una clave no asegura que Windows mantenga el valor."
  },
  {
    "id": 108,
    "goal": "Diagnosticar por qué un equipo parece perder rendimiento con el tiempo.",
    "basics": "La lentitud puede venir de desgaste o llenado del disco, memoria insuficiente, aplicaciones residentes, malware, temperatura o configuraciones. Una PC antigua no se 'ensucia' de CPU por usarla: hay que medir la causa.",
    "steps": [
      {
        "title": "Tomá una línea base de memoria",
        "why": "CIM muestra valores físicos reportados por Windows.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize,FreePhysicalMemory",
        "expect": "Podés comparar con resultados de otro día en el mismo escenario."
      },
      {
        "title": "Revisá ocupación del almacenamiento",
        "why": "Un volumen muy lleno puede limitar tareas, actualizaciones y archivos temporales.",
        "code": "Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter,Size,SizeRemaining",
        "expect": "Los valores son bytes; examiná la proporción libre."
      },
      {
        "title": "Consultá historial de estabilidad",
        "why": "Abrí el Monitor de confiabilidad para ubicar el comienzo de las fallas.",
        "code": "Start-Process perfmon.exe -ArgumentList '/rel'",
        "expect": "Verás eventos de confiabilidad si la función está disponible."
      }
    ],
    "tip": "Truco EVO: buscá primero qué cambió desde el último día en que el equipo funcionaba bien.",
    "warning": "No reinstales Windows o elimines drivers antes de separar problemas de hardware y software.",
    "challenge": "Proponé una prueba distinta para cada hipótesis: almacenamiento, RAM, errores de aplicación y carga de CPU."
  },
  {
    "id": 109,
    "goal": "Comprobar cuánto consume Windows recién iniciado con un protocolo repetible.",
    "basics": "Un escritorio vacío todavía ejecuta drivers, servicios y tareas. La RAM usada incluye caché y memoria del sistema; medir apenas aparece el escritorio no es comparable con medir quince minutos después.",
    "steps": [
      {
        "title": "Registrá el tiempo desde el inicio",
        "why": "LastBootUpTime sirve para documentar cuánto lleva activo Windows.",
        "code": "(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime",
        "expect": "Obtendrás tiempo activo; Inicio rápido puede afectar la interpretación."
      },
      {
        "title": "Contá procesos y servicios",
        "why": "Usá medidas simples para describir el escenario sin calificarlas como buenas o malas.",
        "code": "[pscustomobject]@{Procesos=(Get-Process | Measure-Object).Count; Servicios=(Get-Service | Where-Object Status -eq 'Running' | Measure-Object).Count}",
        "expect": "Los resultados pueden variar entre capturas."
      },
      {
        "title": "Calculá una fracción de RAM física libre",
        "why": "Consultá total y libre; no equivale exactamente a 'En uso' del Administrador de tareas.",
        "code": "$os=Get-CimInstance Win32_OperatingSystem; [math]::Round(100*$os.FreePhysicalMemory/$os.TotalVisibleMemorySize,1)",
        "expect": "Verás porcentaje físico libre aproximado, no una medida de rendimiento."
      }
    ],
    "tip": "Truco EVO: repetí tres veces en arranque comparable, misma espera, red, aplicaciones y plan de energía; informá media y rango.",
    "warning": "No uses '11% de RAM' como promesa universal: depende de edición, hardware, tiempo de reposo y funciones activas.",
    "challenge": "Diseñá una hoja con hora, proceso total, RAM, servicios, arranque, seguridad y observaciones."
  },
  {
    "id": 110,
    "goal": "Comprender qué papel desempeña explorer.exe y qué pasaría si no estuviera.",
    "basics": "Explorer.exe es normalmente el shell que muestra escritorio, barra de tareas y explorador de archivos. Windows puede seguir ejecutando servicios sin él, pero cerrar el shell por prueba puede dificultar la navegación y perder trabajo.",
    "steps": [
      {
        "title": "Identificá Explorer",
        "why": "Consultá instancias y rutas, sin finalizar el proceso.",
        "code": "Get-Process explorer -ErrorAction SilentlyContinue | Select-Object Name,Id,Path",
        "expect": "Podés ver explorer.exe o ninguna fila en otros shells."
      },
      {
        "title": "Observá las aplicaciones que no dependen de él",
        "why": "Notepad o PowerShell son procesos distintos al shell.",
        "code": "Get-Process | Where-Object ProcessName -match 'explorer|notepad|powershell' | Select-Object Name,Id",
        "expect": "Aparecen instancias abiertas, sin que se cierre ninguna."
      },
      {
        "title": "Investigá la configuración del shell",
        "why": "Consultá la clave de Winlogon en solo lectura, que puede requerir permisos.",
        "code": "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon' -Name Shell -ErrorAction SilentlyContinue | Select-Object Shell",
        "expect": "Normalmente aparece explorer.exe, pero entornos administrados pueden usar otro shell."
      }
    ],
    "tip": "Truco EVO: describí qué función pertenece al shell y cuál pertenece al kernel antes de diagnosticar una pantalla negra.",
    "warning": "No mates explorer.exe ni cambies Winlogon\\Shell durante el laboratorio.",
    "challenge": "Explicá por qué el cierre del shell no significa que el kernel de Windows se haya detenido."
  },
  {
    "id": 111,
    "goal": "Reconocer las etapas ocultas que funcionan antes de iniciar sesión.",
    "basics": "El firmware y Boot Manager anteceden al inicio del kernel; después aparecen el administrador de sesión, servicios, controladores y proceso de autenticación. La experiencia visible del usuario muestra solo el tramo final.",
    "steps": [
      {
        "title": "Leé el último arranque reportado",
        "why": "Consultá hora de inicio en Windows.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object LastBootUpTime,Caption",
        "expect": "La fecha no contiene la duración de cada etapa de arranque."
      },
      {
        "title": "Consultá los primeros procesos conocidos",
        "why": "Los procesos centrales suelen ejecutarse desde fases tempranas y algunos son protegidos.",
        "code": "Get-Process | Where-Object ProcessName -match 'smss|csrss|wininit|services|winlogon' | Select-Object Name,Id",
        "expect": "Podés ver procesos de sesión y servicios sin obtener todos sus detalles."
      },
      {
        "title": "Revisá eventos de arranque",
        "why": "Los registros pueden contener marcas temporales relacionadas con inicio.",
        "code": "Get-WinEvent -LogName System -MaxEvents 25 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Se muestran eventos diversos, no una reconstrucción completa del firmware."
      }
    ],
    "tip": "Truco EVO: dibujá una línea temporal de firmware → Boot Manager → kernel → servicios → sesión → Explorer.",
    "warning": "No modifiques particiones EFI, BCD o controladores de arranque para estudiar su secuencia.",
    "challenge": "Explicá en qué etapa se encuentra cada uno: TPM, winload.efi, servicios y escritorio."
  },
  {
    "id": 112,
    "goal": "Distinguir la carpeta System32, SysWOW64 y los directorios compartidos de Windows.",
    "basics": "En Windows de 64 bits, System32 almacena típicamente binarios nativos de 64 bits, mientras SysWOW64 aloja compatibilidad de 32 bits. Los nombres históricos parecen invertidos y son una fuente frecuente de errores.",
    "steps": [
      {
        "title": "Consultá el directorio de Windows",
        "why": "La variable de entorno permite localizar la instalación real.",
        "code": "$env:windir",
        "expect": "Debería mostrar la carpeta raíz de Windows, sin asumir siempre C:\\Windows."
      },
      {
        "title": "Comprobá ambas rutas",
        "why": "Test-Path consulta existencia y no abre ni modifica archivos.",
        "code": "[pscustomobject]@{System32=(Test-Path (Join-Path $env:windir 'System32'));SysWOW64=(Test-Path (Join-Path $env:windir 'SysWOW64'))}",
        "expect": "En Windows x64 habitual ambas carpetas existen."
      },
      {
        "title": "Identificá un binario seguro",
        "why": "Get-Item muestra metadatos de notepad.exe sin ejecutarlo.",
        "code": "Get-Item (Join-Path $env:windir 'System32\\notepad.exe') | Select-Object FullName,Length,LastWriteTime",
        "expect": "Vas a obtener ruta y tamaño; el nombre System32 no indica arquitectura del proceso que lo llama."
      }
    ],
    "tip": "Truco EVO: aplicaciones de 32 bits pueden observar redirecciones WOW64 al acceder a rutas del sistema.",
    "warning": "No borres archivos ni renombres System32 o SysWOW64; son componentes esenciales de compatibilidad.",
    "challenge": "Explicá por qué SysWOW64 no es un directorio de binarios de 64 bits por el número de su nombre."
  }
];
