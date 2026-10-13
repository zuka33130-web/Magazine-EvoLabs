// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 10: POWERSHELL REAL // SINTAXIS, OBJETOS Y PIPELINE

export type RiskLevelSector10 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector10Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  cmdletName: string;
  commandName: string;
  riskLevel: RiskLevelSector10;
  descubri: {
    hook: string;
    mythVsTruth: {
      mentira: string;
      verdad: string;
      comprobalo: string;
    };
  };
  entende: {
    queEs: string;
    paraQueSirve: string;
    quePasaSiFalta: string;
  };
  interactua: {
    psExample: string;
    cmdExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    objectTypeReturned: string;
  };
  alertaEVO: {
    reversibilityRule: string;
    safetyWarning: string;
  };
  evidenceBadge: {
    code: string;
    label: string;
  };
}

export interface Sector10MiniCase {
  id: string;
  code: string;
  title: string;
  scenario: string;
  userStatement: string;
  initialMistake: string;
  diagnosticQuestion: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  technicalVerdict: string;
  lessonLearned: string;
}

export interface Sector10TestQuestion {
  id: string;
  questionNumber: number;
  category: 'SINTAXIS_PIPELINE' | 'OBJETOS_NET' | 'CMDLETS_SISTEMA' | 'SCRIPTING_AUTOMATIZACION';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_10_INVESTIGATIONS: Sector10Investigation[] = [
  {
    id: 'sec-10-01',
    code: '10.01',
    title: 'CMD vs PowerShell',
    subtitle: 'Texto plano vs objetos estructurados en memoria',
    cmdletName: 'Get-Process',
    commandName: 'Get-Process | Get-Member',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'CMD pasa strings sin estructura que debes parsear con findstr. PowerShell pasa objetos .NET vivos con métodos y propiedades tipadas.',
      mythVsTruth: {
        mentira: 'PowerShell es solo un CMD con nombres más largos y colores.',
        verdad: 'PowerShell es un entorno de automatización basado en .NET CLR donde cada instrucción produce y consume objetos.',
        comprobalo: 'Ejecutá Get-Process en PS y tasklist en CMD. En PS podés hacer (Get-Process svchost)[0].CPU para leer números exactos.',
      },
    },
    entende: {
      queEs: 'El paradigma fundamental que separa la shell heredada de MS-DOS de una shell de objetos moderna.',
      paraQueSirve: 'Para entender por qué no necesitas regex ni split para filtrar procesos, discos o servicios en Windows.',
      quePasaSiFalta: 'Seguirás intentando parsear texto frágil que se rompe cuando cambia el idioma o formato del sistema.',
    },
    interactua: {
      psExample: 'Get-Process | Select-Object -First 1 | Get-Member',
      cmdExample: 'Get-Process | Select-Object -First 1 | Get-Member',
      syntaxBreakdown: 'Obtiene el primer proceso activo y lista sus miembros (Property, System.Diagnostics.Process Method, ScriptProperty).',
      whatToLookFor: 'Observá la columna TypeName: System.Diagnostics.Process. No es texto, es una instancia de clase de .NET.',
      objectTypeReturned: 'System.Diagnostics.Process',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura pura de tipos de objetos .NET. 100% Inofensivo.',
      safetyWarning: 'Comprender la diferencia evita errores al intentar invocar métodos directamente en producción.',
    },
    evidenceBadge: {
      code: 'PS-OBJ-01',
      label: 'OBJECT PARADIGM CONFIRMED',
    },
  },
  {
    id: 'sec-10-02',
    code: '10.02',
    title: 'Verbos y Sustantivos',
    subtitle: 'Estructura estándar Verb-Noun de cmdlets',
    cmdletName: 'Get-Verb',
    commandName: 'Get-Command -Verb Get',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La convención Verbo-Sustantivo elimina la necesidad de memorizar cientos de nombres arbitrarios de comandos.',
      mythVsTruth: {
        mentira: 'PowerShell tiene nombres de comandos impredecibles y difíciles de adivinar.',
        verdad: 'Todos los cmdlets oficiales usan verbos aprobados (Get, Set, New, Remove, Start, Stop) seguidos de un sustantivo en singular.',
        comprobalo: 'Probá Get-Verb para ver los verbos estándar aprobados por Microsoft.',
      },
    },
    entende: {
      queEs: 'La regla de nomenclatura estándar de PowerShell que garantiza predictibilidad en toda la API del sistema.',
      paraQueSirve: 'Para deducir comandos sin consultar documentación: si Get-Service lee servicios, New-Service los crea y Stop-Service los detiene.',
      quePasaSiFalta: 'Si los desarrolladores usan nombres arbitrarios, se pierde la consistencia del ecosistema.',
    },
    interactua: {
      psExample: 'Get-Verb | Where-Object Group -eq "Lifecycle"',
      cmdExample: 'Get-Verb | Where-Object Group -eq "Lifecycle"',
      syntaxBreakdown: 'Muestra los verbos aprobados para el ciclo de vida de recursos.',
      whatToLookFor: 'Verbos como Start, Stop, Restart, Suspend, Resume.',
      objectTypeReturned: 'System.Management.Automation.VerbInfo',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de la metabase de verbos. Sin impacto en sistema.',
      safetyWarning: 'Respeta la convención Verb-Noun al escribir tus propios scripts y funciones.',
    },
    evidenceBadge: {
      code: 'PS-NAMING-02',
      label: 'VERB-NOUN STANDARD VERIFIED',
    },
  },
  {
    id: 'sec-10-03',
    code: '10.03',
    title: 'Get-Command',
    subtitle: 'El motor de descubrimiento de comandos y cmdlets',
    cmdletName: 'Get-Command',
    commandName: 'Get-Command *service*',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Get-Command te permite encontrar cualquier cmdlet, función, alias o ejecutable disponible en el sistema.',
      mythVsTruth: {
        mentira: 'Buscás comandos en Google cuando no sabés cuál usar en PowerShell.',
        verdad: 'Get-Command inspecciona todos los módulos cargados y del PATH en tiempo real.',
        comprobalo: 'Ejecutá Get-Command -Noun Process para ver todas las operaciones posibles sobre procesos.',
      },
    },
    entende: {
      queEs: 'El buscador interno del intérprete de PowerShell.',
      paraQueSirve: 'Para localizar cmdlets por verbo, sustantivo, módulo o comodín.',
      quePasaSiFalta: 'Sin él dependerías de memoria visual o motores de búsqueda externos.',
    },
    interactua: {
      psExample: 'Get-Command -Module NetTCPIP',
      cmdExample: 'Get-Command -Module NetTCPIP',
      syntaxBreakdown: 'Lista todos los cmdlets de red del módulo NetTCPIP.',
      whatToLookFor: 'Comandos como Get-NetIPAddress, Get-NetRoute, etc.',
      objectTypeReturned: 'System.Management.Automation.CmdletInfo',
    },
    alertaEVO: {
      reversibilityRule: 'Operación de inspección en memoria.',
      safetyWarning: 'Útil antes de ejecutar comandos desconocidos para verificar su origen.',
    },
    evidenceBadge: {
      code: 'PS-DISCO-03',
      label: 'COMMAND DISCOVERY READY',
    },
  },
  {
    id: 'sec-10-04',
    code: '10.04',
    title: 'Get-Help',
    subtitle: 'Documentación viva y ejemplos interactivos',
    cmdletName: 'Get-Help',
    commandName: 'Get-Help Get-Process -Full',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Get-Help con -Examples muestra casos reales listos para copiar, modificar y ejecutar.',
      mythVsTruth: {
        mentira: 'La ayuda local de PowerShell está obsoleta e incompleta.',
        verdad: 'Update-Help descarga la documentación oficial actualizada firmada por Microsoft.',
        comprobalo: 'Ejecutá Get-Help Get-Service -Examples para ver fragmentos de código listos para uso.',
      },
    },
    entende: {
      queEs: 'El sistema de asistencia técnica integrado en el runtime de PowerShell.',
      paraQueSirve: 'Para comprender sintaxis, parámetros obligatorios, tipos de datos esperados y ejemplos.',
      quePasaSiFalta: 'Sin ayuda actualizada podés pasar parámetros incorrectos y causar efectos no deseados.',
    },
    interactua: {
      psExample: 'Get-Help Stop-Process -Parameter Force',
      cmdExample: 'Get-Help Stop-Process -Parameter Force',
      syntaxBreakdown: 'Inspecciona en detalle el parámetro -Force del cmdlet Stop-Process.',
      whatToLookFor: 'Atributos: Required? False. Position? Named. Accept pipeline input? False.',
      objectTypeReturned: 'System.Management.Automation.MshHelpInfo',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de archivos XML de ayuda local.',
      safetyWarning: 'Revisá siempre el apartado -Detailed o -Examples antes de usar -Force.',
    },
    evidenceBadge: {
      code: 'PS-HELP-04',
      label: 'HELP SYSTEM AUDITED',
    },
  },
  {
    id: 'sec-10-05',
    code: '10.05',
    title: 'Get-Member',
    subtitle: 'Inspección profunda de tipos, propiedades y métodos',
    cmdletName: 'Get-Member',
    commandName: 'Get-Service | Get-Member',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Get-Member es la radiografía de cualquier objeto: revela qué datos contiene y qué acciones podés ejecutar.',
      mythVsTruth: {
        mentira: 'Solo podés usar las propiedades que se muestran en la pantalla al ejecutar un comando.',
        verdad: 'PowerShell oculta por defecto muchas propiedades en vistas predeterminadas (format.ps1xml). Get-Member las muestra todas.',
        comprobalo: 'Ejecutá Get-Process | Get-Member -MemberType Property para ver datos ocultos como Handles, Path o StartTime.',
      },
    },
    entende: {
      queEs: 'La herramienta de reflexión de objetos en PowerShell.',
      paraQueSirve: 'Para descubrir nombres exactos de propiedades que querés usar en filtros Where-Object o exportaciones.',
      quePasaSiFalta: 'Intentarás adivinar nombres de propiedades y obtendrás valores $null.',
    },
    interactua: {
      psExample: 'Get-Date | Get-Member -MemberType Method',
      cmdExample: 'Get-Date | Get-Member -MemberType Method',
      syntaxBreakdown: 'Lista los métodos invocables en un objeto de fecha (AddDays, AddHours, ToUniversalTime).',
      whatToLookFor: 'Podés invocar directamente (Get-Date).AddDays(7) para calcular fechas futuras.',
      objectTypeReturned: 'Microsoft.PowerShell.Commands.MemberDefinition',
    },
    alertaEVO: {
      reversibilityRule: 'Inspección puramente reflexiva de metadatos de tipos.',
      safetyWarning: 'Invocaciones de métodos tipo Kill() en objetos de proceso ejecutan acciones destructivas inmediatas.',
    },
    evidenceBadge: {
      code: 'PS-MEMB-05',
      label: 'REFLECTION INSPECTED',
    },
  },
  {
    id: 'sec-10-06',
    code: '10.06',
    title: 'Objetos vs Texto',
    subtitle: 'Por qué el pipeline de PowerShell destruye al de CMD',
    cmdletName: 'Select-Object',
    commandName: '(Get-Process -Name svchost).WorkingSet64',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En CMD tenés que cortar cadenas con tokens e delimitadores. En PowerShell accedés directamente al miembro miembro.propiedad.',
      mythVsTruth: {
        mentira: 'Trabajar con texto es más rápido y compatible que con objetos.',
        verdad: 'El texto requiere parsing propenso a errores de idioma o formato. Los objetos preservan tipos numéricos y booleans.',
        comprobalo: 'Compará (Get-Date).Year + 1 con el parsing necesario en CMD de la variable %DATE%.',
      },
    },
    entende: {
      queEs: 'La ventaja estructural de transportar instancias Fuertemente Tipadas por el pipeline.',
      paraQueSirve: 'Para realizar comparaciones matemáticas directas (> < -eq) sin conversión de string a int.',
      quePasaSiFalta: 'La comparación "100" > "20" en texto falla o da resultados lexicográficos erróneos.',
    },
    interactua: {
      psExample: 'Get-Process | Where-Object WorkingSet64 -gt 100MB',
      cmdExample: 'Get-Process | Where-Object WorkingSet64 -gt 100MB',
      syntaxBreakdown: 'Filtra procesos cuyo uso de RAM supere el literal binario 100MB.',
      whatToLookFor: 'PowerShell entiende sufijos como KB, MB, GB, TB automáticamente.',
      objectTypeReturned: 'System.Diagnostics.Process',
    },
    alertaEVO: {
      reversibilityRule: 'Operación en memoria sobre objetos devueltos.',
      safetyWarning: 'Asegurate de usar sufijos de tamaño (MB, GB) para comparaciones limpias.',
    },
    evidenceBadge: {
      code: 'PS-TYPED-06',
      label: 'STRONG TYPING PROVEN',
    },
  },
  {
    id: 'sec-10-07',
    code: '10.07',
    title: 'Pipeline de objetos',
    subtitle: 'El flujo continuo de instancias de datos',
    cmdletName: 'Where-Object',
    commandName: 'Get-Service | Where-Object Status -eq Running | Select-Object -First 5',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El pipeline de PowerShell (|) no pasa stream de caracteres ASCII, pasa objetos vivos elemento por elemento.',
      mythVsTruth: {
        mentira: 'El pipeline acumula todo en memoria antes de pasarlo al siguiente comando.',
        verdad: 'PowerShell procesa objetos uno a uno de forma streaming a medida que se emiten (begin, process, end).',
        comprobalo: 'Usá ForEach-Object con un Start-Sleep dentro para ver cómo la salida aparece progresivamente.',
      },
    },
    entende: {
      queEs: 'El mecanismo de transporte inter-cmdlet en el runtime .NET.',
      paraQueSirve: 'Para encadenar comandos de recolección, filtrado, transformación y exportación en una sola línea.',
      quePasaSiFalta: 'Tendrías que crear variables temporales en cada paso del proceso.',
    },
    interactua: {
      psExample: 'Get-ChildItem -Path C:\\Windows\\System32 -File | Measure-Object -Property Length -Sum -Average',
      cmdExample: 'Get-ChildItem -Path C:\\Windows\\System32 -File | Measure-Object -Property Length -Sum -Average',
      syntaxBreakdown: 'Envía archivos al calculador estadístico para obtener suma y promedio de bytes.',
      whatToLookFor: 'Count, Sum, Average calculados dinámicamente sin loops explícitos.',
      objectTypeReturned: 'Microsoft.PowerShell.Commands.GenericMeasureInfo',
    },
    alertaEVO: {
      reversibilityRule: 'Procesamiento streaming en memoria.',
      safetyWarning: 'Tené cuidado si el cmdlet receptor ejecuta acciones de modificación sin filtro previo.',
    },
    evidenceBadge: {
      code: 'PS-PIPE-07',
      label: 'STREAMING PIPELINE ACTIVE',
    },
  },
  {
    id: 'sec-10-08',
    code: '10.08',
    title: 'Where-Object',
    subtitle: 'Filtrado de datos en el pipeline por condiciones',
    cmdletName: 'Where-Object',
    commandName: 'Get-Service | Where-Object {$_.Status -eq "Stopped" -and $_.StartType -eq "Automatic"}',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Where-Object permite aislar exactamente los elementos que cumplen criterios lógicos complejos.',
      mythVsTruth: {
        mentira: 'Where-Object es siempre la forma más eficiente de filtrar datos.',
        verdad: 'Filtrar a la izquierda (en el parámetro del propio cmdlet ejecutor) es mucho más rápido que filtrar en la derecha con Where-Object.',
        comprobalo: 'Compará Measure-Command { Get-Service -Name wuauserv } contra Measure-Command { Get-Service | Where Name -eq wuauserv }.',
      },
    },
    entende: {
      queEs: 'El cmdlet estándar para filtrado condicional de colecciones de objetos.',
      paraQueSirve: 'Para descartar objetos indeseados basándote en comparaciones numéricas, de cadena o booleanas.',
      quePasaSiFalta: 'Inundarías los pasos posteriores con miles de objetos irrelevantes.',
    },
    interactua: {
      psExample: 'Get-Process | Where-Object CPU -gt 10',
      cmdExample: 'Get-Process | Where-Object CPU -gt 10',
      syntaxBreakdown: 'Filtra procesos que hayan consumido más de 10 segundos acumulados de CPU.',
      whatToLookFor: 'Uso de la sintaxis simplificada Where-Object Propiedad -operador Valor.',
      objectTypeReturned: 'System.Diagnostics.Process',
    },
    alertaEVO: {
      reversibilityRule: 'Filtrado en memoria pura.',
      safetyWarning: 'Recordá siempre "Filter Left": filtra en la fuente si el cmdlet lo soporta.',
    },
    evidenceBadge: {
      code: 'PS-WHERE-08',
      label: 'FILTERING PIPELINE READY',
    },
  },
  {
    id: 'sec-10-09',
    code: '10.09',
    title: 'Select-Object',
    subtitle: 'Selección de propiedades y proyección de objetos',
    cmdletName: 'Select-Object',
    commandName: 'Get-Process | Select-Object -Property Name, Id, WorkingSet64 -First 10',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Select-Object remodela los objetos, extrayendo solo las propiedades relevantes o limitando la cantidad de registros.',
      mythVsTruth: {
        mentira: 'Select-Object solo sirve para recortar la tabla visual en la consola.',
        verdad: 'Select-Object crea un nuevo PSCustomObject con solo los miembros seleccionados o calculados.',
        comprobalo: '(Get-Process | Select-Object Name -First 1) | Get-Member revela un tipo PSCustomObject optimizado.',
      },
    },
    entende: {
      queEs: 'El proyector de propiedades y limitador de colecciones.',
      paraQueSirve: 'Para generar reportes limpios y livianos seleccionando solo datos de interés.',
      quePasaSiFalta: 'Exportarías objetos masivos con decenas de propiedades innecesarias.',
    },
    interactua: {
      psExample: 'Get-Process | Select-Object Name, @{Name="RAM_MB"; Expression={[math]::Round($_.WorkingSet64/1MB, 2)}}',
      cmdExample: 'Get-Process | Select-Object Name, @{Name="RAM_MB"; Expression={[math]::Round($_.WorkingSet64/1MB, 2)}}',
      syntaxBreakdown: 'Usa una Calculated Property hashtable para añadir una columna calculada de RAM en MB.',
      whatToLookFor: 'Creación de columnas calculadas dinámicas sobre la marcha.',
      objectTypeReturned: 'System.Management.Automation.PSCustomObject',
    },
    alertaEVO: {
      reversibilityRule: 'Transformación de esquema en memoria.',
      safetyWarning: 'Al recortar propiedades, perdés los métodos del objeto original.',
    },
    evidenceBadge: {
      code: 'PS-SELECT-09',
      label: 'PROJECTION COMPLETED',
    },
  },
  {
    id: 'sec-10-10',
    code: '10.10',
    title: 'Sort-Object',
    subtitle: 'Ordenamiento ascendente y descendente de registros',
    cmdletName: 'Sort-Object',
    commandName: 'Get-Process | Sort-Object -Property WorkingSet64 -Descending | Select-Object -First 5',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Sort-Object ordena elementos según cualquier propiedad numérica, alfabética o de fecha.',
      mythVsTruth: {
        mentira: 'Sort-Object no soporta múltiples criterios de ordenamiento.',
        verdad: 'Podés pasar un array de propiedades: Sort-Object Status, Name ordena por estado y luego por nombre.',
        comprobalo: 'Ejecutá Get-Service | Sort-Object Status, DisplayName para ver agrupamiento natural.',
      },
    },
    entende: {
      queEs: 'El ordenador universal de colecciones en el pipeline.',
      paraQueSirve: 'Para identificar rápidamente los top consumidos de RAM, CPU o uso de disco.',
      quePasaSiFalta: 'Los datos aparecerán en el orden arbitrario emitido por el sistema operativo.',
    },
    interactua: {
      psExample: 'Get-ChildItem C:\\Windows -File | Sort-Object Length -Descending | Select-Object -First 5 Name, Length',
      cmdExample: 'Get-ChildItem C:\\Windows -File | Sort-Object Length -Descending | Select-Object -First 5 Name, Length',
      syntaxBreakdown: 'Muestra los 5 archivos más pesados en el directorio de Windows.',
      whatToLookFor: 'Archivos ordenados strictly de mayor a menor tamaño en bytes.',
      objectTypeReturned: 'System.IO.FileInfo',
    },
    alertaEVO: {
      reversibilityRule: 'Ordenamiento en buffer en memoria.',
      safetyWarning: 'Sort-Object requiere acumular toda la colección en memoria antes de emitir la lista ordenada.',
    },
    evidenceBadge: {
      code: 'PS-SORT-10',
      label: 'COLLECTION SORTED',
    },
  },
  {
    id: 'sec-10-11',
    code: '10.11',
    title: 'Group-Object',
    subtitle: 'Agrupamiento y agregación analítica de datos',
    cmdletName: 'Group-Object',
    commandName: 'Get-Service | Group-Object -Property Status',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Group-Object clasifica colecciones en grupos basados en valores compartidos de propiedades.',
      mythVsTruth: {
        mentira: 'Group-Object solo muestra el conteo de elementos.',
        verdad: 'Cada grupo retiene la lista completa de objetos originales dentro de su propiedad Group.',
        comprobalo: '(Get-Service | Group-Object Status)[0].Group contiene los objetos ServiceController completos.',
      },
    },
    entende: {
      queEs: 'La herramienta de agregación y análisis categórico.',
      paraQueSirve: 'Para resumenes ejecutivos: cuántos servicios corren, cuántos procesos corresponden a cada usuario, etc.',
      quePasaSiFalta: 'Tendrías que implementar contadores y loops manuales.',
    },
    interactua: {
      psExample: 'Get-Process | Group-Object Company -NoElement | Sort-Object Count -Descending',
      cmdExample: 'Get-Process | Group-Object Company -NoElement | Sort-Object Count -Descending',
      syntaxBreakdown: 'Cuenta cuántos procesos tiene cada fabricante de software en ejecución.',
      whatToLookFor: 'Count, Name. Ejemplo: Microsoft Corporation 120.',
      objectTypeReturned: 'Microsoft.PowerShell.Commands.GroupInfo',
    },
    alertaEVO: {
      reversibilityRule: 'Agregación relacional en memoria.',
      safetyWarning: 'Útil para auditorías rápidas de inventario de procesos.',
    },
    evidenceBadge: {
      code: 'PS-GROUP-11',
      label: 'AGGREGATION VERIFIED',
    },
  },
  {
    id: 'sec-10-12',
    code: '10.12',
    title: 'ForEach-Object',
    subtitle: 'Iteración de elementos en el pipeline',
    cmdletName: 'ForEach-Object',
    commandName: 'Get-Service -Name wuauserv | ForEach-Object { $_.Name + " is " + $_.Status }',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'ForEach-Object ejecuta un bloque de script por cada elemento que fluye por el pipeline utilizando la variable $_.',
      mythVsTruth: {
        mentira: 'ForEach-Object y el statement foreach () son exactamente lo mismo.',
        verdad: 'foreach () es una estructura de control del lenguaje que requiere cargar la colección entera en memoria. ForEach-Object procesa en streaming.',
        comprobalo: 'Mantené presionado Ctrl+C en un ForEach-Object gigante: verás que ya procesó los primeros elementos sin esperar al final.',
      },
    },
    entende: {
      queEs: 'El iterador funcional de colecciones en el pipeline.',
      paraQueSirve: 'Para aplicar transformaciones, invocaciones de métodos o formateo personalizado a cada elemento.',
      quePasaSiFalta: 'Sin iteración no podrías ejecutar lógica personalizada por objeto.',
    },
    interactua: {
      psExample: '1..5 | ForEach-Object { $_ * 2 }',
      cmdExample: '1..5 | ForEach-Object { $_ * 2 }',
      syntaxBreakdown: 'Toma los números del 1 al 5 y multiplica cada uno por 2.',
      whatToLookFor: 'Salida streaming: 2, 4, 6, 8, 10.',
      objectTypeReturned: 'System.Int32',
    },
    alertaEVO: {
      reversibilityRule: 'Iteración funcional configurable.',
      safetyWarning: 'Evitá invocar comandos modificadores dentro de ForEach sin usar primero -WhatIf.',
    },
    evidenceBadge: {
      code: 'PS-FOREACH-12',
      label: 'PIPELINE ITERATOR READY',
    },
  },
  {
    id: 'sec-10-13',
    code: '10.13',
    title: 'Variables y tipos',
    subtitle: 'Variables con prefijo $, fuertemente tipadas',
    cmdletName: 'Set-Variable',
    commandName: '$totalRAM = (Get-CimInstance Win32_PhysicalMemory | Measure-Object Capacity -Sum).Sum / 1GB',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En PowerShell las variables inician con $ y conservan el tipo .NET implícito o explícito [int], [string], [datetime], [array].',
      mythVsTruth: {
        mentira: 'PowerShell es un lenguaje no tipado donde todo es texto.',
        verdad: 'Podés forzar tipos estrictos como [int]$puerto = "80" o definir tipos Nullable.',
        comprobalo: '$a = 10; $a.GetType().FullName revela System.Int32.',
      },
    },
    entende: {
      queEs: 'El contenedor de estado en memoria para scripts y sesiones de PowerShell.',
      paraQueSirve: 'Para almacenar resultados de cmdlets, parámetros de configuración y contadores.',
      quePasaSiFalta: 'No podrías reutilizar valores ni construir algoritmos complejos.',
    },
    interactua: {
      psExample: '[datetime]$fecha = "2026-10-07"; $fecha.DayOfWeek',
      cmdExample: '[datetime]$fecha = "2026-10-07"; $fecha.DayOfWeek',
      syntaxBreakdown: 'Convierte un string a objeto DateTime y consulta el día de la semana.',
      whatToLookFor: 'Resultado: Wednesday.',
      objectTypeReturned: 'System.DayOfWeek',
    },
    alertaEVO: {
      reversibilityRule: 'Asignación de espacio en la tabla de símbolos de la sesión.',
      safetyWarning: 'Limpiá variables sensibles de credenciales usando $null o SecureString.',
    },
    evidenceBadge: {
      code: 'PS-VARS-13',
      label: 'TYPED VARIABLES OPERATIONAL',
    },
  },
  {
    id: 'sec-10-14',
    code: '10.14',
    title: 'Custom objects',
    subtitle: 'Creación de estructuras PSCustomObject personalizadas',
    cmdletName: 'PSCustomObject',
    commandName: '[PSCustomObject]@{ Computer = $env:COMPUTERNAME; OS = "Windows"; Status = "OK" }',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'PSCustomObject te permite empaquetar datos heterogéneos en un objeto estructurado perfecto para exportar.',
      mythVsTruth: {
        mentira: 'Para devolver datos estructurados tenés que escribir una clase C# e importarla.',
        verdad: 'La sintaxis literal [PSCustomObject]@{...} crea objetos tipados en una sola línea.',
        comprobalo: 'Creá un objeto y pasalo a Export-Csv o ConvertTo-Json: mantendrá todos sus campos limpios.',
      },
    },
    entende: {
      queEs: 'La entidad base de datos sintéticos en PowerShell.',
      paraQueSirve: 'Para consolidar información de múltiples cmdlets en una sola fila estructurada.',
      quePasaSiFalta: 'Devolverías tablas desalineadas o strings inconexos.',
    },
    interactua: {
      psExample: '$report = [PSCustomObject]@{ Time = Get-Date; RAM = (Get-Process -Name explorer).WorkingSet64 }; $report | ConvertTo-Json',
      cmdExample: '$report = [PSCustomObject]@{ Time = Get-Date; RAM = (Get-Process -Name explorer).WorkingSet64 }; $report | ConvertTo-Json',
      syntaxBreakdown: 'Empaqueta fecha y uso de memoria de Explorer y lo serializa a JSON.',
      whatToLookFor: 'Un objeto JSON perfectamente formateado.',
      objectTypeReturned: 'System.Management.Automation.PSCustomObject',
    },
    alertaEVO: {
      reversibilityRule: 'Creación de objetos en memoria heap de la sesión.',
      safetyWarning: 'Ideal para construir payloads de monitoreo para APIs REST.',
    },
    evidenceBadge: {
      code: 'PS-CUSTOM-14',
      label: 'CUSTOM OBJECT SYNTAX VALID',
    },
  },
  {
    id: 'sec-10-15',
    code: '10.15',
    title: 'Array y Hashtables',
    subtitle: 'Colecciones indexadas @() y tablas clave-valor @{}',
    cmdletName: 'Hashtable',
    commandName: '$hashtable = @{ Server = "SRV-01"; IP = "192.168.1.50" }; $hashtable["IP"]',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Arrays @() almacenan listas ordenadas indexadas por posición. Hashtables @{} almacenan pares clave-valor de acceso ultrarrápido.',
      mythVsTruth: {
        mentira: 'Agregar elementos a un array con += en un loop es eficiente.',
        verdad: 'Los arrays en .NET son de tamaño fijo. += destruye y recrea el array en cada iteración. Usá System.Collections.Generic.List[object].',
        comprobalo: 'Medí 10.000 += en array vs List.Add(): la diferencia es de segundos contra milisegundos.',
      },
    },
    entende: {
      queEs: 'Las dos estructuras de datos universales en scripts de PowerShell.',
      paraQueSirve: 'Arrays para iterar listas. Hashtables para mapas de configuración, diccionarios y lookup rápido.',
      quePasaSiFalta: 'No podrías organizar datos ni realizar búsquedas por clave.',
    },
    interactua: {
      psExample: '$dict = @{"0"="OK"; "1"="ERROR"}; $dict["0"]',
      cmdExample: '$dict = @{"0"="OK"; "1"="ERROR"}; $dict["0"]',
      syntaxBreakdown: 'Accede al valor de la clave "0" en la hashtable.',
      whatToLookFor: 'Respuesta inmediata: OK.',
      objectTypeReturned: 'System.Collections.Hashtable',
    },
    alertaEVO: {
      reversibilityRule: 'Estructuras de datos en memoria.',
      safetyWarning: 'Usa la colección adecuada para evitar cuellos de botella en loops masivos.',
    },
    evidenceBadge: {
      code: 'PS-DATASTRUCT-15',
      label: 'DATA STRUCTURES OPTIMIZED',
    },
  },
  {
    id: 'sec-10-16',
    code: '10.16',
    title: 'IF / SWITCH',
    subtitle: 'Bifurcaciones condicionales y evaluación de patrones',
    cmdletName: 'Switch',
    commandName: 'if ($env:PROCESSOR_ARCHITECTURE -eq "AMD64") { "64-bit" } else { "32-bit" }',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'PowerShell soporta condicionales IF clásicos y la sentencia SWITCH potente con regex y evaluación de colecciones.',
      mythVsTruth: {
        mentira: 'SWITCH solo sirve para comparar valores enteros estáticos.',
        verdad: 'SWITCH en PowerShell puede evaluar expresiones regulares, comodines, archivos enteros y colecciones.',
        comprobalo: 'Probá switch -regex ("test123") { "\d+" { "Tiene números" } }.',
      },
    },
    entende: {
      queEs: 'El motor de toma de decisiones del lenguaje.',
      paraQueSirve: 'Para ejecutar lógica diferenciada según estado del sistema, código de retorno o tipo de SO.',
      quePasaSiFalta: 'Tus scripts ejecutarían el mismo código a ciegas sin adaptarse al contexto.',
    },
    interactua: {
      psExample: 'switch (10) { {$_ -lt 5} {"Bajo"}; {$_ -ge 5} {"Alto"} }',
      cmdExample: 'switch (10) { {$_ -lt 5} {"Bajo"}; {$_ -ge 5} {"Alto"} }',
      syntaxBreakdown: 'Evalúa expresiones lógicas dentro de las ramas del switch.',
      whatToLookFor: 'Resultado: Alto.',
      objectTypeReturned: 'System.String',
    },
    alertaEVO: {
      reversibilityRule: 'Evaluación lógica de flujo de control.',
      safetyWarning: 'Asegurate de incluir casos de fallback (default) en estructuras SWITCH.',
    },
    evidenceBadge: {
      code: 'PS-FLOW-16',
      label: 'BRANCHING LOGIC READY',
    },
  },
  {
    id: 'sec-10-17',
    code: '10.17',
    title: 'FOREACH / WHILE',
    subtitle: 'Estructuras de repetición y loops de control',
    cmdletName: 'While',
    commandName: '$i=0; while ($i -lt 3) { $i++; Write-Host "Intento $i" }',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Los loops foreach, while, do-while y do-until controlan la repetición de operaciones automatizadas.',
      mythVsTruth: {
        mentira: 'Un loop while ($true) bloquea la sesión para siempre de forma irrecuperable.',
        verdad: 'Podés presionar Ctrl+C o agregar condiciones de timeout / break condicional.',
        comprobalo: 'Escribí un loop de retry con un contador máximo de intentos para reconexiones.',
      },
    },
    entende: {
      queEs: 'Las estructuras de iteración imperativa del lenguaje.',
      paraQueSirve: 'Para reintentar tareas, esperar a que un servicio se inicie o procesar lotes de datos.',
      quePasaSiFalta: 'Tendrías que duplicar código manualmente para cada repetición.',
    },
    interactua: {
      psExample: 'foreach ($s in Get-Service wuauserv, bits) { Write-Output "$($s.Name): $($s.Status)" }',
      cmdExample: 'foreach ($s in Get-Service wuauserv, bits) { Write-Output "$($s.Name): $($s.Status)" }',
      syntaxBreakdown: 'Itera sobre los dos servicios especificados e imprime su estado.',
      whatToLookFor: 'Impresión limpia de cada elemento de la colección.',
      objectTypeReturned: 'System.String',
    },
    alertaEVO: {
      reversibilityRule: 'Bucle en memoria.',
      safetyWarning: 'Asegurate de que las condiciones de salida en bucles WHILE se alcancen siempre.',
    },
    evidenceBadge: {
      code: 'PS-LOOPS-17',
      label: 'ITERATIVE LOGIC VERIFIED',
    },
  },
  {
    id: 'sec-10-18',
    code: '10.18',
    title: 'Funciones',
    subtitle: 'Encapsulamiento de código reutilizable',
    cmdletName: 'Function',
    commandName: 'function Get-EVOStatus { param($Name) Get-Service -Name $Name }; Get-EVOStatus -Name wuauserv',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Las funciones convierten bloques de código en herramientas nombradas reutilizables con alcance propio (scope).',
      mythVsTruth: {
        mentira: 'Las funciones de PowerShell no pueden recibir entrada por el pipeline.',
        verdad: 'Agregando la anotación [CmdletBinding()] y param([Parameter(ValueFromPipeline=$true)]) aceptan pipeline de forma idéntica a cmdlets nativos.',
        comprobalo: 'Creá una función avanzada (Advanced Function) y observá cómo hereda parámetros comunes como -Verbose y -Debug.',
      },
    },
    entende: {
      queEs: 'La unidad fundamental de modularización y reusabilidad en PowerShell.',
      paraQueSirve: 'Para evitar código duplicado y crear tus propios comandos con soporte de pipeline.',
      quePasaSiFalta: 'Escribirías scripts monolíticos difíciles de mantener y depurar.',
    },
    interactua: {
      psExample: 'function Test-Port { param($IP, $Port) (Test-NetConnection -ComputerName $IP -Port $Port).TcpTestSucceeded }',
      cmdExample: 'function Test-Port { param($IP, $Port) (Test-NetConnection -ComputerName $IP -Port $Port).TcpTestSucceeded }',
      syntaxBreakdown: 'Define una función liviana para probar conectividad TCP a un puerto.',
      whatToLookFor: 'Retorna $true o $false al invocar Test-Port 127.0.0.1 80.',
      objectTypeReturned: 'System.Boolean',
    },
    alertaEVO: {
      reversibilityRule: 'Carga de definición en el scope de la sesión.',
      safetyWarning: 'Probá siempre el comportamiento de parámetros obligatorios.',
    },
    evidenceBadge: {
      code: 'PS-FUNC-18',
      label: 'FUNCTION ENGINE READY',
    },
  },
  {
    id: 'sec-10-19',
    code: '10.19',
    title: 'Parámetros y ValidateSet',
    subtitle: 'Validación estricta de argumentos de entrada',
    cmdletName: 'ValidateSet',
    commandName: 'function Set-EVOEnv { param([ValidateSet("Dev","Prod")]$Env) $Env }; Set-EVOEnv -Env Dev',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'ValidateSet restringe los valores aceptados por un parámetro a una lista blanca de opciones permitidas con Autocompletado (TAB).',
      mythVsTruth: {
        mentira: 'El usuario puede ingresar cualquier texto en un parámetro si es de tipo string.',
        verdad: 'Los atributos de validación ([ValidateNotNullOrEmpty()], [ValidateRange()], [ValidatePattern()]) rechazan entradas inválidas antes de ejecutar la función.',
        comprobalo: 'Intentá pasar -Env "Test" a la función anterior: PowerShell arrojará un error de validación inmediato.',
      },
    },
    entende: {
      queEs: 'El guardia de seguridad sintáctico para argumentos de funciones y scripts.',
      paraQueSirve: 'Para prevenir la inyección de valores erróneos o potencialmente peligrosos.',
      quePasaSiFalta: 'Tu script podría fallar a mitad de ejecución al recibir un parámetro mal formateado.',
    },
    interactua: {
      psExample: 'function Ping-EVO { param([ValidateRange(1,10)][int]$Count=1) $Count }; Ping-EVO -Count 5',
      cmdExample: 'function Ping-EVO { param([ValidateRange(1,10)][int]$Count=1) $Count }; Ping-EVO -Count 5',
      syntaxBreakdown: 'Valida que el número de pings esté estrictamente entre 1 y 10.',
      whatToLookFor: 'Valores fuera de rango son bloqueados antes del bloque process.',
      objectTypeReturned: 'System.Int32',
    },
    alertaEVO: {
      reversibilityRule: 'Validación previa en el parser de PowerShell.',
      safetyWarning: 'Invalidable por el usuario, protege la integridad de scripts automatizados.',
    },
    evidenceBadge: {
      code: 'PS-PARAM-19',
      label: 'INPUT VALIDATION ACTIVE',
    },
  },
  {
    id: 'sec-10-20',
    code: '10.20',
    title: 'Manejo de errores (Try/Catch)',
    subtitle: 'Captura de excepciones y tratamiento de errores no terminantes',
    cmdletName: 'Try/Catch',
    commandName: 'try { Get-Process -Name "ProcesoInexistente" -ErrorAction Stop } catch { "Capturado: " + $_.Exception.Message }',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'PowerShell distingue entre Non-Terminating Errors y Terminating Errors. Con -ErrorAction Stop forzás la captura con Try/Catch.',
      mythVsTruth: {
        mentira: 'Try/Catch captura cualquier error de PowerShell automáticamente.',
        verdad: 'Por defecto, la mayoría de los cmdlets producen errores no terminantes que se saltean el bloque catch a menos que uses $ErrorActionPreference = "Stop" o -ErrorAction Stop.',
        comprobalo: 'Probá Get-Item "Inexistente" en un try/catch con y sin -ErrorAction Stop.',
      },
    },
    entende: {
      queEs: 'El mecanismo robusto de control de excepciones en scripts de grado empresarial.',
      paraQueSirve: 'Para evitar que un fallo menor detenga toda la automatización y registrar logs ordenados.',
      quePasaSiFalta: 'Los scripts abortarán de forma impredecible o continuarán ejecutándose con datos corruptos.',
    },
    interactua: {
      psExample: 'try { 1/0 } catch [DivideByZeroException] { "División por cero rechazada" }',
      cmdExample: 'try { 1/0 } catch [DivideByZeroException] { "División por cero rechazada" }',
      syntaxBreakdown: 'Captura explícitamente el tipo de excepción de división por cero.',
      whatToLookFor: 'Manejo granular de excepciones según la clase .NET.',
      objectTypeReturned: 'System.String',
    },
    alertaEVO: {
      reversibilityRule: 'Interceptación de flujo de excepciones.',
      safetyWarning: 'Usa siempre Try/Catch al trabajar con operaciones I/O, red o modificadoras de sistema.',
    },
    evidenceBadge: {
      code: 'PS-TRYCATCH-20',
      label: 'EXCEPTION HANDLING AUDITED',
    },
  },
  {
    id: 'sec-10-21',
    code: '10.21',
    title: 'Get-Process y Stop-Process',
    subtitle: 'Administración de procesos y terminación limpia o forzada',
    cmdletName: 'Stop-Process',
    commandName: 'Get-Process notepad -ErrorAction SilentlyContinue | Stop-Process -Force',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Get-Process inspecciona subprocesos, módulos cargados y uso de recursos. Stop-Process los termina con seguridad.',
      mythVsTruth: {
        mentira: 'Stop-Process es igual a taskkill /F de CMD sin diferencias.',
        verdad: 'Stop-Process soporta -WhatIf para previsualizar exactamente qué procesos se cerrarían antes de ejecutar el corte.',
        comprobalo: 'Ejecutá Get-Process chrome | Stop-Process -WhatIf para ver la simulación en pantalla.',
      },
    },
    entende: {
      queEs: 'El dúo de cmdlets para el ciclo de vida de procesos en Windows.',
      paraQueSirve: 'Para monitorear procesos colgados, verificar firmas de módulos y matar tareas rebeldes.',
      quePasaSiFalta: 'Dependerías de interfaces gráficas o herramientas sin simulación.',
    },
    interactua: {
      psExample: 'Get-Process | Where-Object Responding -eq $false',
      cmdExample: 'Get-Process | Where-Object Responding -eq $false',
      syntaxBreakdown: 'Encuentra todos los procesos que estén en estado "No responde".',
      whatToLookFor: 'Procesos congelados listos para ser terminados.',
      objectTypeReturned: 'System.Diagnostics.Process',
    },
    alertaEVO: {
      reversibilityRule: 'Terminación de proceso irrevocable.',
      safetyWarning: 'Usá siempre -WhatIf antes de combinar Get-Process con Stop-Process en lote.',
    },
    evidenceBadge: {
      code: 'PS-PROC-21',
      label: 'PROCESS MGMT VERIFIED',
    },
  },
  {
    id: 'sec-10-22',
    code: '10.22',
    title: 'Get-Service, Start-Service, Stop-Service',
    subtitle: 'Gestión completa de servicios del sistema operativo',
    cmdletName: 'Get-Service',
    commandName: 'Get-Service -Name wuauserv | Select-Object Name, Status, StartType',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La suite de cmdlets *-Service gestiona estados, tipos de inicio y dependencias de servicios de Windows.',
      mythVsTruth: {
        mentira: 'Para ver las dependencias de un servicio hay que ir a services.msc obligatoriamente.',
        verdad: 'Get-Service expone las propiedades DependentServices y RequiredServices directamente.',
        comprobalo: '(Get-Service lanmanworkstation).RequiredServices muestra los servicios requeridos para red local.',
      },
    },
    entende: {
      queEs: 'La API de control de servicios del Service Control Manager (SCM).',
      paraQueSirve: 'Para verificar, arrancar, detener y reiniciar servicios críticos del sistema de forma limpia.',
      quePasaSiFalta: 'No podrías auditar servicios deshabilitados o dependencias rotas.',
    },
    interactua: {
      psExample: 'Get-Service | Where-Object {$_.Status -eq "Running" -and $_.DependentServices.Count -gt 3}',
      cmdExample: 'Get-Service | Where-Object {$_.Status -eq "Running" -and $_.DependentServices.Count -gt 3}',
      syntaxBreakdown: 'Encuentra servicios activos que tienen más de 3 servicios dependientes conectados.',
      whatToLookFor: 'Servicios de infraestructura crítica como RPCSS o Dnscache.',
      objectTypeReturned: 'System.ServiceProcess.ServiceController',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura de estado de SCM.',
      safetyWarning: 'Detener servicios de infraestructura como RPCSS provoca BSOD o reinicio inmediato.',
    },
    evidenceBadge: {
      code: 'PS-SVC-22',
      label: 'SERVICE CONTROLLER VERIFIED',
    },
  },
  {
    id: 'sec-10-23',
    code: '10.23',
    title: 'Get-EventLog y Get-WinEvent',
    subtitle: 'Extracción de registros de eventos de Windows (ETW)',
    cmdletName: 'Get-WinEvent',
    commandName: 'Get-WinEvent -ListLog System, Application | Select-Object LogName, RecordCount',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Get-WinEvent es el lector ultra-rápido de eventos basado en consultas XPath sobre logs de Windows (EVTX).',
      mythVsTruth: {
        mentira: 'Get-EventLog y Get-WinEvent son idénticos y se pueden usar indistintamente.',
        verdad: 'Get-EventLog es un cmdlet heredado que solo lee logs clásicos. Get-WinEvent lee todos los proveedores ETW y logs de aplicaciones modernas.',
        comprobalo: 'Ejecutá Get-WinEvent -FilterHashtable @{LogName="System"; Level=2; MaxEvents=5} para extraer errores del sistema en milisegundos.',
      },
    },
    entende: {
      queEs: 'El motor forense y de auditoría de eventos de Windows.',
      paraQueSirve: 'Para investigar apagados inesperados (Event ID 41/1074), errores de drivers o intentos de inicio de sesión.',
      quePasaSiFalta: 'Estarías ciego ante fallos pasados o incidentes de seguridad.',
    },
    interactua: {
      psExample: 'Get-WinEvent -FilterHashtable @{LogName="System"; Id=1074} -MaxEvents 3 | Select-Object TimeCreated, Message',
      cmdExample: 'Get-WinEvent -FilterHashtable @{LogName="System"; Id=1074} -MaxEvents 3 | Select-Object TimeCreated, Message',
      syntaxBreakdown: 'Obtiene los últimos 3 eventos de reinicio/apagado del sistema con su causa registrada.',
      whatToLookFor: 'Hora y proceso/usuario que solicitó el apagado del equipo.',
      objectTypeReturned: 'System.Diagnostics.Eventing.Reader.EventLogRecord',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura indexada de archivos .evtx.',
      safetyWarning: 'Usa siempre -FilterHashtable en lugar de filtrar con Where-Object para evitar cargar gigabytes de eventos en RAM.',
    },
    evidenceBadge: {
      code: 'PS-EVENTS-23',
      label: 'EVENT LOG FORENSICS ACTIVE',
    },
  },
  {
    id: 'sec-10-24',
    code: '10.24',
    title: 'Get-CimInstance / WMI',
    subtitle: 'La interfaz moderna WMI/MI para inventario del sistema',
    cmdletName: 'Get-CimInstance',
    commandName: 'Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object Caption, Version, LastBootUpTime',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Get-CimInstance reemplaza al antiguo Get-WmiObject, utilizando la API moderna de infraestructura de administración de Windows (MI) sobre WS-Man/WS-Management.',
      mythVsTruth: {
        mentira: 'Get-WmiObject sigue siendo la norma recomendada en PowerShell.',
        verdad: 'Get-WmiObject usaba DCOM (obsoleto) y fue eliminado en PowerShell 7+. Get-CimInstance es el estándar moderno y rápido.',
        comprobalo: 'Ejecutá Get-CimInstance Win32_BIOS para obtener número de serie y versión del BIOS sin requerir elevación de DCOM.',
      },
    },
    entende: {
      queEs: 'La puerta de entrada a la base de datos de administración WMI/CIM de Windows.',
      paraQueSirve: 'Para consultar hardware, motherboard, procesador, estado de discos, licencias y parches de seguridad.',
      quePasaSiFalta: 'No podrías consultar el inventario físico y lógico profundo del sistema.',
    },
    interactua: {
      psExample: 'Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, @{N="Free_GB";E={[math]::Round($_.FreeSpace/1GB, 2)}}',
      cmdExample: 'Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, @{N="Free_GB";E={[math]::Round($_.FreeSpace/1GB, 2)}}',
      syntaxBreakdown: 'Consulta el espacio libre de cada disco lógico mediante la clase Win32_LogicalDisk.',
      whatToLookFor: 'C:, D: con sus gigabytes libres calculados.',
      objectTypeReturned: 'Microsoft.Management.Infrastructure.CimInstance',
    },
    alertaEVO: {
      reversibilityRule: 'Consultas CIM de solo lectura.',
      safetyWarning: 'Invocaciones de métodos CIM como Invoke-CimMethod pueden alterar el estado de hardware o SO.',
    },
    evidenceBadge: {
      code: 'PS-CIM-24',
      label: 'CIM INFRASTRUCTURE VERIFIED',
    },
  },
  {
    id: 'sec-10-25',
    code: '10.25',
    title: 'Archivos y PSDrives',
    subtitle: 'Navegación unificada por sistema de archivos, registro y certificados',
    cmdletName: 'Get-PSDrive',
    commandName: 'Get-PSDrive',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'PowerShell trata el Registro (HKLM:, HKCU:), Certificados (Cert:) y variables (Env:) como unidades de disco asignadas (PSDrives).',
      mythVsTruth: {
        mentira: 'Get-ChildItem solo sirve para listar archivos en carpetas del disco duro.',
        verdad: 'Podés hacer cd HKCU:\\Software y ejecutar Get-ChildItem para explorar las claves del Registro como si fueran carpetas.',
        comprobalo: 'Ejecutá Get-ChildItem Cert:\\LocalMachine\\My para ver los certificados digitales instalados en el equipo.',
      },
    },
    entende: {
      queEs: 'La abstracción jerárquica de proveedores de datos (PSProviders).',
      paraQueSirve: 'Para usar los mismos cmdlets (Get-Item, New-Item, Remove-Item) en archivos, registro, env vars y certificados.',
      quePasaSiFalta: 'Tendrías que aprender un conjunto de comandos diferente para cada subsistema de almacenamiento.',
    },
    interactua: {
      psExample: 'Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" -Name ProductName',
      cmdExample: 'Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" -Name ProductName',
      syntaxBreakdown: 'Lee una propiedad del Registro usando la sintaxis de rutas de PSDrive.',
      whatToLookFor: 'ProductName: Windows 11 Pro.',
      objectTypeReturned: 'System.Management.Automation.PSCustomObject',
    },
    alertaEVO: {
      reversibilityRule: 'Navegación de proveedores de datos.',
      safetyWarning: 'Tene cuidado al usar Remove-Item en PSDrives de Registro (HKLM:); no hay papelera de reciclaje.',
    },
    evidenceBadge: {
      code: 'PS-PSDRIVE-25',
      label: 'PSPROVIDER ABSTRACTION OK',
    },
  },
  {
    id: 'sec-10-26',
    code: '10.26',
    title: 'Execution Policies',
    subtitle: 'Mecanismo de seguridad y firma de scripts',
    cmdletName: 'Get-ExecutionPolicy',
    commandName: 'Get-ExecutionPolicy -List',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'ExecutionPolicy no es una frontera de seguridad de malware, es una regla de protección contra ejecuciones accidentales.',
      mythVsTruth: {
        mentira: 'Set-ExecutionPolicy Unrestricted destruye la seguridad del sistema operativo.',
        verdad: 'La política de ejecución solo previene que usuarios hagan doble clic sin saber qué ejecutan. Se bypass de forma trivial con powershell -ExecutionPolicy Bypass.',
        comprobalo: 'Ejecutá Get-ExecutionPolicy para ver la directiva activa del ámbito actual.',
      },
    },
    entende: {
      queEs: 'La directiva de control de firmas de scripts en la sesión de usuario.',
      paraQueSirve: 'Para configurar políticas como RemoteSigned que exigen firma digital a scripts descargados de Internet.',
      quePasaSiFalta: 'Windows rechazaría la ejecución de tus propios scripts .ps1 de diagnóstico.',
    },
    interactua: {
      psExample: 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force',
      cmdExample: 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force',
      syntaxBreakdown: 'Establece la política RemoteSigned solo para el usuario actual sin afectar a todo el sistema.',
      whatToLookFor: 'Permite ejecutar scripts creados localmente sin firmar, pero exige firma para scripts remotos.',
      objectTypeReturned: 'Microsoft.PowerShell.ExecutionPolicy',
    },
    alertaEVO: {
      reversibilityRule: 'Modificación de clave de registro de usuario o equipo.',
      safetyWarning: 'Usá RemoteSigned en desarrollo y firma tus scripts con un certificado interno en producción.',
    },
    evidenceBadge: {
      code: 'PS-EXECPOL-26',
      label: 'EXECUTION POLICY AUDITED',
    },
  },
  {
    id: 'sec-10-27',
    code: '10.27',
    title: 'Módulos',
    subtitle: 'Importación y gestión de librerías de cmdlets',
    cmdletName: 'Get-Module',
    commandName: 'Get-Module -ListAvailable | Select-Object -First 10 Name, Version',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Los módulos son paquetes (.psd1 / .psm1 / .dll) que extienden las capacidades de PowerShell con nuevos cmdlets y tipos.',
      mythVsTruth: {
        mentira: 'Tenés que hacer Import-Module de cada librería manualmente antes de usar sus comandos.',
        verdad: 'PowerShell 3.0+ incluye auto-loading: al invocar un cmdlet de un módulo disponible, se importa automáticamente.',
        comprobalo: 'Ejecutá Get-NetIPAddress sin hacer Import-Module previo: funcionará gracias al auto-loading.',
      },
    },
    entende: {
      queEs: 'El sistema de empaquetado y distribución de bibliotecas en PowerShell.',
      paraQueSirve: 'Para organizar conjuntos de herramientas relacionadas (Red, Active Directory, Azure, Diagnóstico EVO).',
      quePasaSiFalta: 'Cargarías miles de comandos en memoria ralentizando el inicio de la shell.',
    },
    interactua: {
      psExample: 'Get-Command -Module PSScriptAnalyzer',
      cmdExample: 'Get-Command -Module PSScriptAnalyzer',
      syntaxBreakdown: 'Verifica si el linter estático oficial de PowerShell está disponible en el equipo.',
      whatToLookFor: 'Invoke-ScriptAnalyzer y cmdlets de análisis sintáctico.',
      objectTypeReturned: 'System.Management.Automation.PSModuleInfo',
    },
    alertaEVO: {
      reversibilityRule: 'Gestión de módulos en el PSModulePath.',
      safetyWarning: 'Instalá solo módulos provenientes del repositorio oficial PowerShell Gallery (PSGallery).',
    },
    evidenceBadge: {
      code: 'PS-MODULES-27',
      label: 'MODULE ECOSYSTEM READY',
    },
  },
  {
    id: 'sec-10-28',
    code: '10.28',
    title: 'Scripts .ps1 de diagnóstico',
    subtitle: 'Automatización de recolección forense en archivos de script',
    cmdletName: 'Get-ChildItem',
    commandName: 'Get-ChildItem -Path . -Filter "*.ps1"',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Un script .ps1 agrupa cmdlets, funciones y control de errores para ejecutar diagnósticos reproducibles en múltiples máquinas.',
      mythVsTruth: {
        mentira: 'Un script .ps1 requiere compiled binaries para ser rápido.',
        verdad: 'El motor JIT de PowerShell compila los scripts a código intermedio en tiempo de ejecución garantizando alta velocidad.',
        comprobalo: 'Escribí un script sencillo de recolección de Uptime y RAM y ejecutalo con Measure-Command.',
      },
    },
    entende: {
      queEs: 'El archivo de código ejecutable estándar de PowerShell.',
      paraQueSirve: 'Para crear asistentes, scripts de mantenimiento preventivo y auditorías de configuración.',
      quePasaSiFalta: 'Tendrías que tipear comandos manualmente en la consola en cada intervención técnica.',
    },
    interactua: {
      psExample: 'Get-Content -Path .\\Diag.ps1 -Head 10',
      cmdExample: 'Get-Content -Path .\\Diag.ps1 -Head 10',
      syntaxBreakdown: 'Muestra las primeras 10 líneas del archivo de script de diagnóstico.',
      whatToLookFor: 'Estructura de parámetros y encabezados de documentación de ayuda basada en comentarios.',
      objectTypeReturned: 'System.IO.FileInfo',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura de scripts en disco.',
      safetyWarning: 'Revisá el código fuente de cualquier script .ps1 antes de ejecutarlo con privilegios de Administrador.',
    },
    evidenceBadge: {
      code: 'PS-SCRIPTS-28',
      label: 'DIAGNOSTIC SCRIPT READY',
    },
  },
  {
    id: 'sec-10-29',
    code: '10.29',
    title: 'Remoting',
    subtitle: 'Administración remota con WinRM y PSSession',
    cmdletName: 'Invoke-Command',
    commandName: 'Test-WSMan -ComputerName localhost',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'PowerShell Remoting (PSRemoting) te permite ejecutar cmdlets en equipos remotos a través del protocolo seguro WS-Management (WinRM).',
      mythVsTruth: {
        mentira: 'PSRemoting es tan inseguro como Telnet y envía contraseñas en texto claro.',
        verdad: 'PSRemoting encripta todo el tráfico por defecto usando Kerberos o SSL y requiere autenticación explícita.',
        comprobalo: 'Test-WSMan verifica la disponibilidad del listener local de administración remota.',
      },
    },
    entende: {
      queEs: 'El protocolo de ejecución remota de comandos de Windows.',
      paraQueSirve: 'Para administrar servidores o puestos de trabajo sin necesidad de abrir escritorios remotos (RDP).',
      quePasaSiFalta: 'Tendrías que conectarte por RDP a decenas de máquinas una por una.',
    },
    interactua: {
      psExample: 'Invoke-Command -ScriptBlock { Get-Service wuauserv } -ComputerName localhost',
      cmdExample: 'Invoke-Command -ScriptBlock { Get-Service wuauserv } -ComputerName localhost',
      syntaxBreakdown: 'Ejecuta un bloque de código localmente a través del motor remoting de la sesión.',
      whatToLookFor: 'Resultado con la propiedad adicional PSComputerName agregada al objeto.',
      objectTypeReturned: 'System.Management.Automation.Runspaces.PSSession',
    },
    alertaEVO: {
      reversibilityRule: 'Prueba de protocolo de comunicación WinRM.',
      safetyWarning: 'Asegurate de que el firewall permita el puerto TCP 5985 (HTTP) o 5986 (HTTPS).',
    },
    evidenceBadge: {
      code: 'PS-REMOTING-29',
      label: 'WINRM REMOTING VERIFIED',
    },
  },
  {
    id: 'sec-10-30',
    code: '10.30',
    title: 'Crear suite EVO de automatización en PS',
    subtitle: 'Consolidación de herramientas de diagnóstico en un módulo unificado',
    cmdletName: 'New-Module',
    commandName: 'Get-Command -Module EVOAutomation',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La culminación del Sector 10: empaquetar todas las funciones de diagnóstico en una suite profesional de automatización en PowerShell.',
      mythVsTruth: {
        mentira: 'Construir una suite requiere herramientas complejas de compilación externa.',
        verdad: 'Crear un manifiesto .psd1 y un script de módulo .psm1 requiere solo PowerShell nativo y buenas prácticas de código.',
        comprobalo: 'Creá una función de resumen ejecutivo que consolide CPU, RAM, Discos y Eventos en un reporte HTML.',
      },
    },
    entende: {
      queEs: 'La arquitectura del módulo personalizado EVO LABS para gestión de sistemas.',
      paraQueSirve: 'Para dotar al técnico de un arsenal unificado de diagnósticos en un solo comando.',
      quePasaSiFalta: 'Tus herramientas quedarían dispersas en scripts sueltos sin control de versiones ni exportación limpia.',
    },
    interactua: {
      psExample: 'Get-CimInstance Win32_OperatingSystem | Select-Object Caption, OSArchitecture, @{N="RAM_GB";E={[math]::Round($_.TotalVisibleMemorySize/1MB, 2)}}',
      cmdExample: 'Get-CimInstance Win32_OperatingSystem | Select-Object Caption, OSArchitecture, @{N="RAM_GB";E={[math]::Round($_.TotalVisibleMemorySize/1MB, 2)}}',
      syntaxBreakdown: 'Consolida nombre del SO, arquitectura y memoria RAM en una estructura lista para la suite EVO.',
      whatToLookFor: 'Resumen completo del sistema de nivel técnico en una sola llamada.',
      objectTypeReturned: 'System.Management.Automation.PSCustomObject',
    },
    alertaEVO: {
      reversibilityRule: 'Arquitectura modular en memoria.',
      safetyWarning: 'Mantener la suite probada y validada en entorno de pruebas antes de su distribución.',
    },
    evidenceBadge: {
      code: 'PS-SUITE-30',
      label: 'EVO AUTOMATION SUITE MASTERED',
    },
  },
];

export const SECTOR_10_MINICASES: Sector10MiniCase[] = [
  {
    id: 'case-10-01',
    code: 'CASE-10-01',
    title: 'Procesos Fantasma y Fuga de Memoria',
    scenario: 'El cliente reporta un servidor con 95% de consumo de RAM sin que ninguna aplicación gráfica muestre un culpable claro.',
    userStatement: '"El Administrador de tareas no me muestra qué proceso se está comiendo toda la memoria RAM."',
    initialMistake: 'Reiniciar el servidor de inmediato sin identificar la instancia de proceso ni guardar volcado forense.',
    diagnosticQuestion: '¿Cómo aislarías los 5 procesos con mayor consumo de memoria física utilizando el pipeline de objetos de PowerShell?',
    options: [
      {
        id: 'opt-a',
        text: 'Ejecutar tasklist en CMD y copiar la tabla a Excel.',
        isCorrect: false,
        explanation: 'tasklist devuelve texto plano desalineado sin soporte de ordenamiento numérico fuerte.',
      },
      {
        id: 'opt-b',
        text: 'Ejecutar Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, @{N="RAM_MB";E={[math]::Round($_.WorkingSet64/1MB, 2)}}',
        isCorrect: true,
        explanation: 'Aísla numéricamente las instancias .NET por WorkingSet64 y proyecta el valor exacto en MB.',
      },
      {
        id: 'opt-c',
        text: 'Borrar los archivos de C:\\Windows\\Temp.',
        isCorrect: false,
        explanation: 'Borrar archivos de disco no libera RAM asignada en memoria física activa.',
      },
    ],
    technicalVerdict: 'Con Get-Process se aísla de inmediato el proceso exacto con fuga de memoria acumulada.',
    lessonLearned: 'Usar objetos fuertemente tipados evita depender de formateos gráficos de GUI.',
  },
  {
    id: 'case-10-02',
    code: 'CASE-10-02',
    title: 'Servicios en Estado Inconsistente',
    scenario: 'Múltiples servicios de infraestructura configurados en "Automatic" permanecen detenidos tras el inicio del sistema.',
    userStatement: '"Los servicios no arrancaron solos y la red interna no funciona."',
    initialMistake: 'Hacer clic manual en "Iniciar" en services.msc para cada uno sin revisar el Service Control Manager.',
    diagnosticQuestion: '¿Qué combinación de cmdlets filtra servicios automáticos que están atascados en estado Stopped?',
    options: [
      {
        id: 'opt-a',
        text: 'Get-Service | Where-Object { $_.StartType -eq "Automatic" -and $_.Status -eq "Stopped" }',
        isCorrect: true,
        explanation: 'Where-Object realiza la evaluación lógica en paralelo sobre las propiedades fuertemente tipadas de ServiceController.',
      },
      {
        id: 'opt-b',
        text: 'sc query type= service',
        isCorrect: false,
        explanation: 'sc query devuelve texto desestructurado que requiere análisis manual.',
      },
      {
        id: 'opt-c',
        text: 'Restart-Computer -Force',
        isCorrect: false,
        explanation: 'Reiniciar no resuelve el problema de dependencias rotas o credenciales expiradas.',
      },
    ],
    technicalVerdict: 'Identificación instantánea de servicios atascados para diagnóstico de dependencias.',
    lessonLearned: 'Where-Object permite filtrar por múltiples condiciones sobre objetos .NET.',
  },
  {
    id: 'case-10-03',
    code: 'CASE-10-03',
    title: 'Auditoría Forense de Errores Críticos',
    scenario: 'Un equipo crítico sufrió un reinicio no planificado a la madrugada sin mensaje visible de error.',
    userStatement: '"La PC se apagó sola anoche y no sabemos por qué."',
    initialMistake: 'Abrir el Visor de Eventos GUI y desplazarse manualmente entre miles de registros.',
    diagnosticQuestion: '¿Cómo extraerías rápidamente los eventos de reinicio/apagado del log de Sistema?',
    options: [
      {
        id: 'opt-a',
        text: 'Get-WinEvent -FilterHashtable @{LogName="System"; Id=1074} -MaxEvents 5',
        isCorrect: true,
        explanation: 'Get-WinEvent con FilterHashtable consulta directamente los índices .evtx en el kernel a alta velocidad.',
      },
      {
        id: 'opt-b',
        text: 'Get-Content C:\\Windows\\System32\\winevt\\Logs\\System.evtx',
        isCorrect: false,
        explanation: 'Get-Content intenta leer el archivo binario EVTX como si fuera texto plano, produciendo caracteres corruptos.',
      },
      {
        id: 'opt-c',
        text: 'systeminfo | findstr "Boot"',
        isCorrect: false,
        explanation: 'systeminfo solo muestra el último tiempo de arranque, no los motivos pasados.',
      },
    ],
    technicalVerdict: 'Obtención del evento exacto ID 1074 con causa raíz y usuario que solicitó el apagado.',
    lessonLearned: 'FilterHashtable con Get-WinEvent es el estándar de oro para recolección forense.',
  },
  {
    id: 'case-10-04',
    code: 'CASE-10-04',
    title: 'Exportación de Inventario de Discos a JSON',
    scenario: 'El equipo de SOC solicita un reporte estandarizado en formato JSON con el espacio libre de los discos de almacenamiento.',
    userStatement: '"Necesitamos los datos de discos en formato JSON limpio para ingresarlos al dashboard."',
    initialMistake: 'Crear un archivo .txt con la salida de wmic logicaldisk list brief.',
    diagnosticQuestion: '¿Qué secuencia de cmdlets obtiene los discos lógicos fijos, calcula su espacio en GB y emite un JSON válido?',
    options: [
      {
        id: 'opt-a',
        text: 'Get-CimInstance Win32_LogicalDisk | Where-Object DriveType -eq 3 | Select-Object DeviceID, @{N="FreeGB";E={[math]::Round($_.FreeSpace/1GB, 2)}} | ConvertTo-Json',
        isCorrect: true,
        explanation: 'Combina consulta CIM, filtro de discos fijos, cálculo proyectado y serialización nativa a JSON.',
      },
      {
        id: 'opt-b',
        text: 'fsutil volume diskfree c: > report.json',
        isCorrect: false,
        explanation: 'fsutil genera texto plano, no una estructura sintáctica JSON.',
      },
      {
        id: 'opt-c',
        text: 'Get-Disk | Out-File report.json',
        isCorrect: false,
        explanation: 'Out-File vuelca la representación visual de la consola en texto, no serializa a JSON.',
      },
    ],
    technicalVerdict: 'Payload JSON limpio y estandarizado listo para ingestión en dashboards.',
    lessonLearned: 'ConvertTo-Json transforma cualquier colección de objetos .NET en JSON estructurado.',
  },
];

export const SECTOR_10_TEST_BANK: Sector10TestQuestion[] = [
  {
    id: 'test-10-01',
    questionNumber: 1,
    category: 'SINTAXIS_PIPELINE',
    question: '¿Cuál es la diferencia fundamental entre el pipeline de CMD (|) y el pipeline de PowerShell (|)?',
    options: [
      { id: 'a', text: 'CMD pasa objetos .NET y PowerShell pasa cadenas de caracteres ASCII.' },
      { id: 'b', text: 'CMD pasa texto plano como stream de caracteres, mientras que PowerShell pasa objetos vivos fuertemente tipados.' },
      { id: 'c', text: 'PowerShell no tiene pipeline y solo usa variables globales.' },
      { id: 'd', text: 'No hay diferencia, ambos ejecutan los comandos de forma idéntica.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'PowerShell transporta instancias de objetos .NET a través del pipeline, lo que permite acceder a métodos y propiedades sin necesidad de parsear cadenas de texto.',
    relatedInvestigationCode: '10.01',
  },
  {
    id: 'test-10-02',
    questionNumber: 2,
    category: 'CMDLETS_SISTEMA',
    question: '¿Por qué es preferible usar Get-CimInstance en lugar del cmdlet obsoleto Get-WmiObject?',
    options: [
      { id: 'a', text: 'Get-WmiObject requiere instalar Python.' },
      { id: 'b', text: 'Get-CimInstance utiliza la infraestructura de administración moderna (MI) sobre WS-Man y es compatible con PowerShell 7+, mientras que Get-WmiObject dependía de DCOM.' },
      { id: 'c', text: 'Get-CimInstance solo funciona en Linux.' },
      { id: 'd', text: 'Get-WmiObject no puede consultar discos duros.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Get-CimInstance reemplazó a Get-WmiObject porque utiliza estándares modernos y evita las limitaciones y vulnerabilidades del protocolo DCOM heredado.',
    relatedInvestigationCode: '10.24',
  },
  {
    id: 'test-10-03',
    questionNumber: 3,
    category: 'SINTAXIS_PIPELINE',
    question: 'En un cmdlet con pipeline, ¿qué técnica se conoce como "Filter Left" (Filtrar a la izquierda)?',
    options: [
      { id: 'a', text: 'Colocar siempre los comentarios al lado izquierdo del script.' },
      { id: 'b', text: 'Usar parámetros de filtrado propios del cmdlet emisor (como -Name o -FilterHashtable) antes de enviar objetos a Where-Object.' },
      { id: 'c', text: 'Convertir todos los objetos a texto plano antes de filtrar.' },
      { id: 'd', text: 'Usar solo expresiones regulares para cualquier filtro.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Filtrar en la fuente (a la izquierda) reduce drásticamente la memoria y CPU requeridas, al evitar cargar miles de objetos innecesarios en el pipeline.',
    relatedInvestigationCode: '10.08',
  },
  {
    id: 'test-10-04',
    questionNumber: 4,
    category: 'OBJETOS_NET',
    question: '¿Qué hace la notación [PSCustomObject]@{...} en PowerShell?',
    options: [
      { id: 'a', text: 'Elimina un archivo del disco duro.' },
      { id: 'b', text: 'Crea una nueva estructura de objeto personalizada con propiedades nombradas y tipadas.' },
      { id: 'c', text: 'Abre una ventana de diálogo en Windows Forms.' },
      { id: 'd', text: 'Reinicia el servicio de PowerShell.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: '[PSCustomObject] es la sintaxis literal para instanciar objetos estructurados sintéticos con pares propiedad-valor.',
    relatedInvestigationCode: '10.14',
  },
  {
    id: 'test-10-05',
    questionNumber: 5,
    category: 'SCRIPTING_AUTOMATIZACION',
    question: '¿Para qué sirve el modificador -ErrorAction Stop al invocar un cmdlet dentro de un bloque try { } catch { }?',
    options: [
      { id: 'a', text: 'Para pausar la máquina virtual durante 10 segundos.' },
      { id: 'b', text: 'Para convertir errores no terminantes en errores terminantes que puedan ser capturados por el bloque catch.' },
      { id: 'c', text: 'Para deshabilitar el registro de eventos de Windows.' },
      { id: 'd', text: 'Para forzar el cierre de la ventana de PowerShell.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Por defecto, muchos cmdlets emiten errores no terminantes que no activan el bloque catch. -ErrorAction Stop fuerza la elevación del error a una excepción capturable.',
    relatedInvestigationCode: '10.20',
  },
];
