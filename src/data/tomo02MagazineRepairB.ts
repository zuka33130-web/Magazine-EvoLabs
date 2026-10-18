import type { EvoMagazineArticle } from './tomo02MagazineFirstBatch';
/** EVO LABS · Reparación y rescate II · 188–200. Diagnóstico, mantenimiento y expediente final. */
export const EVO_MAGAZINE_REPAIR_B: EvoMagazineArticle[] = [
  {
    "id": 188,
    "goal": "Distinguir fallas del SSD de problemas de sistema operativo, cable o controlador.",
    "basics": "Un SSD puede seguir apareciendo en Windows aunque registre errores, y un sistema lento puede funcionar sobre un SSD sano. Hay que separar indicadores de salud, errores de E/S, espacio libre y rendimiento, manteniendo copias verificadas.",
    "steps": [
      {
        "title": "Identificá el dispositivo",
        "why": "Win32_DiskDrive muestra modelo, capacidad y un estado genérico.",
        "code": "Get-CimInstance Win32_DiskDrive | Select-Object Model,Status,Size,InterfaceType",
        "expect": "Status no sustituye contadores de vida útil del fabricante."
      },
      {
        "title": "Consultá estado de almacenamiento",
        "why": "Get-PhysicalDisk puede ofrecer una evaluación limitada según controlador.",
        "code": "Get-PhysicalDisk | Select-Object FriendlyName,MediaType,HealthStatus,OperationalStatus",
        "expect": "Un estado Healthy no garantiza ausencia de fallas ni recuperabilidad de datos."
      },
      {
        "title": "Relacioná con eventos del sistema",
        "why": "Revisá la actividad reciente y buscá eventos de disco en el Visor de eventos.",
        "code": "Get-WinEvent -FilterHashtable @{LogName='System';StartTime=(Get-Date).AddDays(-3)} -MaxEvents 40 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Podrías observar errores de distintas fuentes; investigá origen y contexto antes de atribuirlos al SSD."
      }
    ],
    "tip": "Truco EVO: compará datos SMART oficiales, cableado y eventos de almacenamiento; el síntoma no siempre identifica al componente.",
    "warning": "No ejecutes pruebas intensivas ni reparaciones sobre una unidad de la que necesitás recuperar archivos.",
    "challenge": "Definí qué evidencia distinguiría error de lectura físico, poco espacio y problema de Windows."
  },
  {
    "id": 189,
    "goal": "Construir un rescate ordenado de una PC lenta antes de comprar componentes o formatear.",
    "basics": "Lentitud es un síntoma y puede tener múltiples causas: almacenamiento lleno, programas de inicio, aplicaciones residentes, CPU saturada, RAM insuficiente o temperatura. La metodología compara una línea base con hallazgos reproducibles.",
    "steps": [
      {
        "title": "Anotá memoria y arranque",
        "why": "La memoria libre y el último inicio son datos de contexto, no un benchmark.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object LastBootUpTime,TotalVisibleMemorySize,FreePhysicalMemory",
        "expect": "Los valores están en KiB y pueden variar naturalmente."
      },
      {
        "title": "Identificá procesos residentes",
        "why": "Observá los procesos que más memoria física residente ocupan.",
        "code": "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 12 Name,Id,WorkingSet64",
        "expect": "Un proceso grande no siempre es innecesario."
      },
      {
        "title": "Consultá estado del disco",
        "why": "Buscá unidades llenas y registrá los datos para comparar con otro día.",
        "code": "Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter,SizeRemaining,Size",
        "expect": "Puede haber muchas unidades; enfocá el diagnóstico en la usada por Windows."
      }
    ],
    "tip": "Truco EVO: si un síntoma apareció repentinamente, buscá instalaciones, actualizaciones o cambios coincidentes antes de limpiar.",
    "warning": "No uses debloat agresivo ni desactives antivirus para maquillar cifras de reposo.",
    "challenge": "Prepará una tabla síntoma/hipótesis/prueba/resultado/reversión para al menos cinco posibles causas."
  },
  {
    "id": 190,
    "goal": "Preparar respaldos de configuraciones importantes sin suponer que una copia parcial salva todo Windows.",
    "basics": "Se pueden documentar drivers, inventario y preferencias, pero migrar una instalación completa exige otras herramientas. Una exportación del Registro no incluye todos los archivos, secretos ni permisos necesarios para restauración integral.",
    "steps": [
      {
        "title": "Guardá un inventario en pantalla",
        "why": "Construí una ficha de hardware y Windows antes de planear respaldos.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory; Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber",
        "expect": "La salida identifica equipo y versión sin modificar la instalación."
      },
      {
        "title": "Consultá drivers instalados",
        "why": "El inventario PnP expone información útil para buscar instaladores oficiales.",
        "code": "Get-CimInstance Win32_PnPSignedDriver | Select-Object -First 15 DeviceName,DriverVersion,DriverProviderName",
        "expect": "Las versiones pueden variar por dispositivo y configuración."
      },
      {
        "title": "Revisá opciones de recuperación",
        "why": "Consultá puntos existentes sin crearlos ni borrarlos.",
        "code": "Get-ComputerRestorePoint -ErrorAction SilentlyContinue | Select-Object -First 8 Description,CreationTime",
        "expect": "Puede aparecer una lista o ninguna. Los puntos no respaldan todos los documentos."
      }
    ],
    "tip": "Truco EVO: probá restaurar una copia de un documento ficticio; un respaldo no verificado es una esperanza, no una garantía.",
    "warning": "No compartas respaldos que incluyan datos personales, claves o tokens; guardalos en ubicación protegida.",
    "challenge": "Diseñá un plan que distinga documentos, aplicaciones, preferencias, drivers y sistema completo."
  },
  {
    "id": 191,
    "goal": "Dominar comandos de consulta que todo técnico puede explicar antes de usarlos.",
    "basics": "PowerShell devuelve objetos estructurados y permite investigar sin instalar suites de mantenimiento. Aprender comandos seguros permite pensar antes de ejecutar recetas destructivas de Internet.",
    "steps": [
      {
        "title": "Reconocé comandos y su sintaxis",
        "why": "Get-Command muestra cómo PowerShell localiza herramientas disponibles.",
        "code": "Get-Command Get-Process,Get-Service,Get-CimInstance | Select-Object Name,CommandType,Source",
        "expect": "Verás nombres, tipos y procedencia de comandos."
      },
      {
        "title": "Combiná filtros y ordenación",
        "why": "Mostrá los diez procesos con mayor memoria física residente.",
        "code": "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name,Id,WorkingSet64",
        "expect": "Los valores son bytes de WorkingSet, no memoria privada."
      },
      {
        "title": "Construí un resumen reutilizable",
        "why": "Un objeto representa resultados y se puede exportar más adelante si decidís hacerlo.",
        "code": "[pscustomobject]@{Fecha=Get-Date;Procesos=(Get-Process | Measure-Object).Count;Servicios=(Get-Service | Measure-Object).Count}",
        "expect": "Aparece una ficha con número de procesos y servicios en ese instante."
      }
    ],
    "tip": "Truco EVO: aprendé Get-Help, Get-Member y Select-Object antes de copiar un script de optimización completo.",
    "warning": "No ejecutes scripts con -ExecutionPolicy Bypass de fuentes que no comprendas ni deshabilites controles de seguridad.",
    "challenge": "Explicá cada tramo del último comando y cambiá una propiedad sin modificar Windows."
  },
  {
    "id": 192,
    "goal": "Crear el primer auditor automatizado que genera observaciones sin cambiar el equipo.",
    "basics": "Un auditor inicial puede leer CPU, RAM, procesos, discos y red y agruparlos en un objeto PowerShell. Un informe útil debe mencionar qué no pudo verificar, en lugar de inventar resultados y declarar 'todo perfecto'.",
    "steps": [
      {
        "title": "Obtené información del sistema",
        "why": "Trabajá con objetos CIM de solo lectura.",
        "code": "$os=Get-CimInstance Win32_OperatingSystem; $cpu=Get-CimInstance Win32_Processor | Select-Object -First 1; $os | Select-Object Caption,Version,BuildNumber",
        "expect": "Se muestran datos y se crean dos variables de la sesión, sin modificar archivos."
      },
      {
        "title": "Construí la ficha de auditoría",
        "why": "Cada expresión consulta una fuente y conserva el resultado en un objeto.",
        "code": "[pscustomobject]@{Hora=Get-Date;OS=$os.Caption;CPU=$cpu.Name;RAM_GiB=[math]::Round($os.TotalVisibleMemorySize/1MB,2);Procesos=(Get-Process | Measure-Object).Count}",
        "expect": "Aparece una ficha verificable. Algunos campos pueden faltar si el proveedor CIM no responde."
      },
      {
        "title": "Contrastá una fuente alternativa",
        "why": "Compará lo obtenido con el Administrador de tareas.",
        "code": "Start-Process taskmgr.exe",
        "expect": "Podrás ver RAM y CPU desde otra interfaz, recordando que los métodos calculan algunas métricas de forma distinta."
      }
    ],
    "tip": "Truco EVO: agregá una columna de procedencia (CIM, proceso, interfaz) y otra de error de consulta a tus informes.",
    "warning": "No afirmes que el auditor detecta virus o cuellos de botella solo porque muestra un contador alto.",
    "challenge": "Añadí a tu ficha el nombre de la interfaz de red activa y explicá el origen de cada propiedad."
  },
  {
    "id": 193,
    "goal": "Aprender a comparar estados de Windows entre dos días sin culpar cualquier cambio a una infección.",
    "basics": "Windows se modifica por actualizaciones, nuevas aplicaciones y tareas programadas. Una comparación útil necesita inventarios del mismo tipo y hora aproximada; diferencias de PID y consumo transitorio no siempre son significativas.",
    "steps": [
      {
        "title": "Creá una muestra del estado actual",
        "why": "Recopilá fecha, versión, procesos y memoria libre en pantalla.",
        "code": "$os=Get-CimInstance Win32_OperatingSystem; [pscustomobject]@{Fecha=Get-Date;Build=$os.BuildNumber;Procesos=(Get-Process|Measure-Object).Count;RAMLibreKiB=$os.FreePhysicalMemory}",
        "expect": "Aparecen cuatro datos que podés copiar a tu cuaderno local."
      },
      {
        "title": "Identificá aplicaciones de inicio",
        "why": "Los cambios persistentes podrían surgir de una instalación reciente.",
        "code": "Get-CimInstance Win32_StartupCommand | Select-Object Name,Location",
        "expect": "Esto es un inventario parcial, no una prueba de persistencia maliciosa."
      },
      {
        "title": "Investigá eventos recientes",
        "why": "Observá instalaciones y errores como contexto antes de interpretar variaciones.",
        "code": "Get-WinEvent -LogName System -MaxEvents 12 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Los eventos pueden explicar parte de los cambios, pero no garantizan causalidad."
      }
    ],
    "tip": "Truco EVO: compará versión, cantidad de procesos, servicios, programas de inicio y espacio libre; los PID nunca son claves estables entre arranques.",
    "warning": "No borres programas recién instalados sin identificar su función ni diagnosticar el origen del cambio.",
    "challenge": "Escribí qué propiedades son comparables entre días y cuáles dependen del momento exacto."
  },
  {
    "id": 194,
    "goal": "Medir Windows recién instalado como referencia sin idealizar cifras mínimas de RAM.",
    "basics": "Una instalación limpia puede necesitar actualizaciones, indexación, controladores y sincronización inicial. Comparar cinco minutos después de la instalación con una máquina estabilizada puede producir conclusiones engañosas.",
    "steps": [
      {
        "title": "Identificá el entorno base",
        "why": "Registrá edición, build y última hora de inicio.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber,LastBootUpTime",
        "expect": "Obtendrás contexto para repetir la prueba."
      },
      {
        "title": "Medí servicios y procesos",
        "why": "Consultá cantidades sin afirmar que menos significa mejor.",
        "code": "[pscustomobject]@{Procesos=(Get-Process|Measure-Object).Count;ServiciosActivos=(Get-Service|Where-Object Status -eq 'Running'|Measure-Object).Count}",
        "expect": "Los conteos pueden variar por tareas de instalación y actualización."
      },
      {
        "title": "Tomá lectura de memoria física",
        "why": "Medí total y libre, anotando también la caché desde Administrador de tareas.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize,FreePhysicalMemory",
        "expect": "Valores en KiB; no sustituyen rendimiento de aplicaciones ni tiempo de arranque."
      }
    ],
    "tip": "Truco EVO: esperá a que termine configuración inicial y repetí mediciones de reposo en intervalos iguales.",
    "warning": "No deshabilites actualizaciones ni Defender para publicar un récord de consumo que otras personas no podrán reproducir.",
    "challenge": "Diseñá una ficha de referencia con versión, drivers, tiempo desde inicio, red, apps y tres lecturas."
  },
  {
    "id": 195,
    "goal": "Elegir Windows según compatibilidad, soporte, rendimiento y licenciamiento reales.",
    "basics": "La edición más liviana no siempre conviene: un hardware puede necesitar drivers, seguridad, software y un ciclo de actualizaciones específico. Windows Home, Pro y Enterprise LTSC tienen propósitos y condiciones distintas.",
    "steps": [
      {
        "title": "Identificá tu equipo",
        "why": "Registrá fabricante y modelo para consultar soporte oficial.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model",
        "expect": "Aparecerá el modelo de referencia, útil para buscar controladores compatibles."
      },
      {
        "title": "Consultá edición y arquitectura",
        "why": "La plataforma determina requisitos de programas y drivers.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,OSArchitecture,BuildNumber",
        "expect": "La salida no permite evaluar por sí sola el ciclo de soporte de cada edición."
      },
      {
        "title": "Revisá dispositivos importantes",
        "why": "Comprobá audio, red y gráficos sin modificar su controlador.",
        "code": "Get-PnpDevice -Class Net -ErrorAction SilentlyContinue | Select-Object -First 10 FriendlyName,Status",
        "expect": "Verás dispositivos de red; completá con otros desde Administrador de dispositivos."
      }
    ],
    "tip": "Truco EVO: elegí por matriz ponderada de drivers, soporte, apps, recursos, licencia y facilidad de mantenimiento.",
    "warning": "No uses ISOs modificadas sin procedencia ni versiones LTSC sin verificar derecho de uso y soporte.",
    "challenge": "Compará tres opciones de Windows con el hardware de tu PC y justificá tu elección."
  },
  {
    "id": 196,
    "goal": "Diseñar un autodiagnóstico periódico sin convertir cada aviso en una falsa alarma.",
    "basics": "Un sistema puede revisar recursos, almacenamiento, procesos y eventos periódicamente. Una regla de alerta necesita umbral, duración y contexto; una muestra puntual alta no certifica fallas.",
    "steps": [
      {
        "title": "Revisá volumen y espacio",
        "why": "Elegí un umbral razonable para alertas de almacenamiento.",
        "code": "Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter,Size,SizeRemaining",
        "expect": "Se mostrarán volúmenes; debes interpretar unidades y particiones especiales."
      },
      {
        "title": "Construí una advertencia local ilustrativa",
        "why": "El ejemplo evalúa la unidad C y sólo presenta texto, no crea una tarea automática.",
        "code": "$v=Get-Volume -DriveLetter C -ErrorAction SilentlyContinue; if($v -and $v.Size -gt 0){[pscustomobject]@{LibrePorcentaje=[math]::Round(100*$v.SizeRemaining/$v.Size,1);Aviso=($v.SizeRemaining/$v.Size -lt .10)}}",
        "expect": "Obtendrás porcentaje libre y True/False para menos de 10% libre; no implica disco averiado."
      },
      {
        "title": "Contrastá con errores del sistema",
        "why": "Un diagnóstico serio incorpora registros además de umbrales.",
        "code": "Get-WinEvent -LogName System -MaxEvents 10 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName",
        "expect": "Los eventos necesitan contexto para evaluar riesgos reales."
      }
    ],
    "tip": "Truco EVO: comprobá si un problema se mantiene durante varias muestras antes de generar un aviso persistente.",
    "warning": "No programes tareas con privilegios elevados ni procesos de borrado automático en la primera versión del auditor.",
    "challenge": "Diseñá una alerta reproducible para espacio libre y otra para un evento concreto con un criterio de duración."
  },
  {
    "id": 197,
    "goal": "Crear un expediente técnico que ayude a recuperar Windows en lugar de adivinar configuraciones.",
    "basics": "Antes de reparar o reinstalar, un inventario documenta edición, drivers, discos, red, energía y programas necesarios. La ficha no sustituye un respaldo, pero reduce incertidumbre si cambia el sistema.",
    "steps": [
      {
        "title": "Generá un pasaporte de hardware",
        "why": "Registrá sistema y CPU con consultas de solo lectura.",
        "code": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory; Get-CimInstance Win32_Processor | Select-Object Name",
        "expect": "Se muestran identificadores generales y memoria reportada."
      },
      {
        "title": "Inventariá los discos",
        "why": "Una instalación futura requiere distinguir unidades por modelo y capacidad.",
        "code": "Get-Disk | Select-Object Number,FriendlyName,PartitionStyle,Size",
        "expect": "No modifica particiones ni su orden."
      },
      {
        "title": "Registrá red y energía",
        "why": "La configuración puede influir en diagnóstico posterior.",
        "code": "Get-NetAdapter | Select-Object Name,InterfaceDescription,Status; powercfg /getactivescheme",
        "expect": "Se obtiene información básica de periféricos y plan activo."
      }
    ],
    "tip": "Truco EVO: asociá fecha, origen de información y foto de configuración con respaldos que puedas restaurar.",
    "warning": "No publiques nombres de equipo, claves de red, seriales, tokens o rutas privadas incluidas en tu expediente.",
    "challenge": "Creá una portada de expediente con diez elementos de configuración y cinco acciones de recuperación."
  },
  {
    "id": 198,
    "goal": "Construir una rutina de mantenimiento sin suites milagrosas ni cambios destructivos.",
    "basics": "Un plan preventivo comprueba copias, actualizaciones, espacio, fiabilidad, salud de discos y permisos sin instalar 'limpiadores' que prometen velocidad. La constancia y una línea base sirven más que ejecutar cien ajustes.",
    "steps": [
      {
        "title": "Revisá capacidad disponible",
        "why": "La saturación de almacenamiento puede afectar actualizaciones y aplicaciones.",
        "code": "Get-Volume | Where-Object DriveLetter | Select-Object DriveLetter,SizeRemaining,Size",
        "expect": "Registrá la proporción disponible y su tendencia mensual."
      },
      {
        "title": "Consultá actualizaciones reportadas",
        "why": "Get-HotFix informa parte de las actualizaciones instaladas.",
        "code": "Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 8 HotFixID,InstalledOn",
        "expect": "La lista puede ser parcial; completala con Windows Update."
      },
      {
        "title": "Abrí historial de confiabilidad",
        "why": "Observá si los errores se concentran después de cambios concretos.",
        "code": "Start-Process perfmon.exe -ArgumentList '/rel'",
        "expect": "Se mostrará un historial si la característica está disponible."
      }
    ],
    "tip": "Truco EVO: programá revisión mensual de respaldos, espacio y eventos críticos, anotando variación respecto del mes anterior.",
    "warning": "No borres la caché del sistema compulsivamente ni desactives servicios esenciales como mantenimiento.",
    "challenge": "Escribí un checklist mensual de ocho puntos y explicá cómo verificarías que un respaldo sirve."
  },
  {
    "id": 199,
    "goal": "Diseñar una optimización minimalista que pueda superarse con pruebas A/B y retorno seguro.",
    "basics": "Windows minimalista no es una colección de servicios deshabilitados sino un perfil de trabajo sin recursos innecesarios para tu uso. Se debe medir consumo, capacidad de recuperación, seguridad y aplicación real antes de aceptar ajustes.",
    "steps": [
      {
        "title": "Medí el estado inicial",
        "why": "Tomá RAM física, procesos y plan de energía sin cambiar Windows.",
        "code": "$os=Get-CimInstance Win32_OperatingSystem; [pscustomobject]@{RAMLibreGiB=[math]::Round($os.FreePhysicalMemory/1MB,2);Procesos=(Get-Process|Measure-Object).Count}; powercfg /getactivescheme",
        "expect": "Es un punto de partida, no un objetivo de consumo universal."
      },
      {
        "title": "Comprobá servicios básicos",
        "why": "Las funciones esenciales deben seguir presentes tras cualquier optimización futura.",
        "code": "Get-Service EventLog,Dhcp,AudioSrv -ErrorAction SilentlyContinue | Select-Object Name,Status,StartType",
        "expect": "Un servicio detenido no significa necesariamente fallo, según entorno."
      },
      {
        "title": "Verificá seguridad y recuperación",
        "why": "Registra controles importantes para que ningún ahorro los debilite.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled; reagentc /info",
        "expect": "Mostrará perfiles del firewall y, si se permite, WinRE."
      }
    ],
    "tip": "Truco EVO: declarale éxito solo a una mejora que se repite tres veces y conserva funciones indispensables.",
    "warning": "No persigas el menor número de procesos desactivando updates, seguridad, componentes de arranque o drivers.",
    "challenge": "Creá un protocolo con línea base, prueba aislada, reversión, tres repeticiones y decisión final."
  },
  {
    "id": 200,
    "goal": "Construir tu expediente maestro EVO LABS para entender realmente tu computadora.",
    "basics": "La meta final integra Windows, hardware, red, seguridad, almacenamiento y rendimiento en un proceso de observación, medición, explicación y decisión. El usuario debe poder justificar cada intervención y rechazar conclusiones sin evidencia.",
    "steps": [
      {
        "title": "Identificá sistema y equipo",
        "why": "Generá una ficha de plataforma sin registrar datos secretos.",
        "code": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,BuildNumber,OSArchitecture; Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory",
        "expect": "Tendrás edición, arquitectura y hardware principal como contexto."
      },
      {
        "title": "Consultá recursos y conectividad",
        "why": "Medí procesos, RAM física y adaptadores de red.",
        "code": "$os=Get-CimInstance Win32_OperatingSystem; [pscustomobject]@{Procesos=(Get-Process|Measure-Object).Count;RAMLibreGiB=[math]::Round($os.FreePhysicalMemory/1MB,2)}; Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name,LinkSpeed",
        "expect": "Son observaciones parciales y no certifican salud global."
      },
      {
        "title": "Comprueba las protecciones esenciales",
        "why": "Verificá perfiles de firewall, WinRE y estado de actualizaciones reportadas.",
        "code": "Get-NetFirewallProfile | Select-Object Name,Enabled; Get-HotFix | Select-Object -First 5 HotFixID,InstalledOn",
        "expect": "Faltaría confirmar respaldo y estado real de actualizaciones desde las interfaces correspondientes."
      }
    ],
    "tip": "Truco EVO: archivá hallazgos como VERIFICADO, HIPÓTESIS o NO COMPROBADO. Cada conclusión debe incluir evidencia, fecha, versión y método.",
    "warning": "No ejecutes automatizaciones destructivas para 'aprobar' el laboratorio; protegé datos, drivers, seguridad y recuperación.",
    "challenge": "Entrega final: un informe con 1 hardware, 2 versión Windows, 3 cuentas y permisos, 4 procesos, 5 servicios, 6 RAM, 7 CPU, 8 almacenamiento, 9 red, 10 puertos, 11 firewall, 12 privacidad, 13 actualizaciones, 14 recuperación, 15 gaming (si aplica), 16 hipótesis, 17 intervenciones reversibles, 18 pruebas, 19 resultados y 20 lecciones aprendidas."
  }
];
