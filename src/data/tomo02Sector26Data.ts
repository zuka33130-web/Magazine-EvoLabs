// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 26: COMPATIBILIDAD
// "Programas que Windows “ya no quiere”"

export type RiskLevelSector26 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector26Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector26;
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
    cliExample: string;
    psExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    technicalMetrics: string;
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

export interface Sector26MiniCase {
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

export interface Sector26TestQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_26_INVESTIGATIONS: Sector26Investigation[] = [
  {
    id: "inv-26-01",
    code: "26.01",
    title: "32-bit",
    subtitle: "La arquitectura legacy x86 y el límite físico de direccionamiento de 4 GB de memoria",
    targetMechanism: "x86 Architecture & Virtual Memory Address Space",
    targetComponent: "32-Bit Execution Context",
    commandName: "wmic os get OSArchitecture",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que los procesos de 32 bits en Windows tienen un límite virtual infranqueable de 2 GB de RAM asignable (o 3 GB con la bandera /3GB en el PE Header)?",
      mythVsTruth: {
        mentira: "Si le ponés 64 GB de RAM a tu PC, un juego antiguo de 32 bits va a poder usar toda esa memoria.",
        verdad: "Un ejecutable de 32 bits colapsará con error 'Out of Memory' al superar los 2 GB o 3 GB independientemente de la RAM física instalada.",
        comprobalo: "Verificá la arquitectura del sistema operativo y los procesos activos en el Administrador de Tareas."
      }
    },
    entende: {
      queEs: "La arquitectura de procesamiento basada en registros de 32 bits que dominó la informática desde Windows 95 hasta Windows 7.",
      paraQueSirve: "Permite ejecutar software histórico que no ha sido recompilado para x64.",
      quePasaSiFalta: "Windows 11 de 64 bits eliminó la versión x86 nativa del S.O., pero conserva compatibilidad para ejecutar apps x86 a través de WOW64."
    },
    interactua: {
      cliExample: "wmic os get OSArchitecture",
      psExample: "[Environment]::Is64BitProcess",
      syntaxBreakdown: "[Environment]::Is64BitProcess devuelve `True` si la sesión activa de PowerShell es x64, o `False` si es un proceso x86.",
      whatToLookFor: "Procesos con '*32' en el Administrador de Tareas en Windows 10/11.",
      technicalMetrics: "Límite de espacio de direcciones de usuario de 32 bits: 2.147.483.648 bytes (2 GB)."
    },
    alertaEVO: {
      reversibilityRule: "Consultar la arquitectura del proceso es seguro e inofensivo.",
      safetyWarning: "No obligues a ejecutables de 32 bits a usar parches LAA (Large Address Aware) no probados sin realizar respaldos."
    },
    evidenceBadge: {
      code: "X86_ARCH_AUDIT",
      label: "Entorno 32-bit Inspeccionado"
    }
  },
  {
    id: "inv-26-02",
    code: "26.02",
    title: "64-bit",
    subtitle: "La arquitectura x64 moderna y el espacio de memoria masivo de hasta 128 Terabytes",
    targetMechanism: "x64 (AMD64 / EM64T) Processing Pipeline",
    targetComponent: "64-Bit Native Kernel & Memory Management",
    commandName: "Get-[#00A4EF] | Get-CimInstance Win32_OperatingSystem",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "En 64 bits, el espacio de direcciones virtuales alcanza los 128 TB en Windows Client y hasta 24 TB de RAM física en Windows Server, haciendo virtualmente imposibles los desbordamientos de memoria por falta de punteros.",
      mythVsTruth: {
        mentira: "Las aplicaciones de 64 bits son el doble de rápidas que las de 32 bits simplemente por llamarse 64 bits.",
        verdad: "La ganancia principal radica en el acceso directo a más de 4 GB de RAM y el uso de 16 registros de CPU de propósito general (vs 8 en x86), optimizando operaciones pesadas.",
        comprobalo: "Verificá la arquitectura nativa del S.O. con `Get-CimInstance Win32_OperatingSystem`."
      }
    },
    entende: {
      queEs: "El estándar moderno de 64 bits para procesadores x86-64 y sistemas operativos de alto rendimiento.",
      paraQueSirve: "Permite ejecutar software profesional pesado, motores de juegos modernos, bases de datos y máquinas virtuales.",
      quePasaSiFalta: "Los sistemas de 32 bits no pueden ejecutar ningún software recompilado exclusivamente para x64."
    },
    interactua: {
      cliExample: "systeminfo | findstr /B /C:\"System Type\"",
      psExample: "[Environment]::Is64BitOperatingSystem",
      syntaxBreakdown: "[Environment]::Is64BitOperatingSystem devuelve `True` en cualquier instalación moderna de Windows 10/11 x64.",
      whatToLookFor: "System Type: x64-based PC.",
      technicalMetrics: "Direccionamiento x64: Hasta 18.4 exabytes teóricos. Registros adicionales: R8 a R15."
    },
    alertaEVO: {
      reversibilityRule: "Comprobar el tipo de sistema operativo es una operación de lectura.",
      safetyWarning: "No intentes instalar drivers de 32 bits en un Windows de 64 bits; el Kernel los rechazará inmediatamente."
    },
    evidenceBadge: {
      code: "X64_NATIVE_KERNEL",
      label: "Arquitectura 64-bit Confirmada"
    }
  },
  {
    id: "inv-26-03",
    code: "26.03",
    title: "WOW64",
    subtitle: "El subsistema Windows 32-bit on Windows 64-bit que traduce llamadas al Kernel",
    targetMechanism: "WOW64 Subsystem (wow64.dll, wow64win.dll, wow64cpu.dll)",
    targetComponent: "System32 vs SysWOW64 Redirection",
    commandName: "dir C:\\Windows\\SysWOW64\\cmd.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Paradójicamente, en Windows 64 bits la carpeta `C:\\Windows\\System32` contiene las DLLs de 64 bits, mientras que `C:\\Windows\\SysWOW64` contiene las DLLs de 32 bits.",
      mythVsTruth: {
        mentira: "La carpeta SysWOW64 contiene los archivos de 64 bits porque dice '64' en el nombre.",
        verdad: "'WOW64' significa 'Windows 32-bit ON Windows 64-bit'. SysWOW64 contiene las bibliotecas de 32 bits para que las apps x86 no rompan por rutas hardcodeadas a System32.",
        comprobalo: "Comprobá las dos carpetas de sistema y su redirección transparente con `dir C:\\Windows\\SysWOW64`."
      }
    },
    entende: {
      queEs: "Una capa de emulación ultraeficiente integrada en el Kernel de 64 bits que permite ejecutar binarios de 32 bits sin pérdida apreciable de rendimiento.",
      paraQueSirve: "Redirige transparente llamadas de archivos y claves del Registro (`HKLM\\Software\\WOW6432Node`) cuando un proceso de 32 bits se ejecuta en x64.",
      quePasaSiFalta: "Sin WOW64, miles de programas legados, juegos clásicos y utilidades de 32 bits dejarían de funcionar en Windows 10/11."
    },
    interactua: {
      cliExample: "reg query HKLM\\Software\\WOW6432Node",
      psExample: "Get-ChildItem -Path HKLM:\\Software\\WOW6432Node | Select-Object Name -First 5",
      syntaxBreakdown: "Muestra la rama del Registro donde el subsistema WOW64 aísla la configuración de programas de 32 bits.",
      whatToLookFor: "Existencia de software de 32 bits instalado en el sistema operativo de 64 bits.",
      technicalMetrics: "Mapeo de archivos: C:\\Windows\\System32 redirigido dinámicamente a SysWOW64 para procesos x86."
    },
    alertaEVO: {
      reversibilityRule: "Inspeccionar las carpetas SysWOW64 y la rama WOW6432Node no altera el sistema.",
      safetyWarning: "NUNCA borres archivos de la carpeta SysWOW64 pensando que son innecesarios; romperás todas las aplicaciones de 32 bits."
    },
    evidenceBadge: {
      code: "WOW64_SUBSYSTEM_OK",
      label: "Subsistema WOW64 Validado"
    }
  },
  {
    id: "inv-26-04",
    code: "26.04",
    title: "Compatibility Mode",
    subtitle: "Inyección de Shims en el ejecutable para engañar a programas legados",
    targetMechanism: "Application Compatibility Database (sysmain.sdb & Shim Engine)",
    targetComponent: "AppCompatFlags & AppHelp Subsystem",
    commandName: "reg query \"HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers\"",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "El Modo de Compatibilidad no simula un sistema operativo diferente; intercepta las llamadas API (ej. GetVersionEx) en tiempo de ejecución y le responde al programa que está corriendo en Windows XP o Windows 7.",
      mythVsTruth: {
        mentira: "Poner un programa en Modo de Compatibilidad Windows XP hace que la PC gaste más CPU emulando todo el hardware.",
        verdad: "Es una técnica ligera basada en 'Shims' (parches de API). Simplemente modifica los valores retornados por ciertas funciones del S.O.",
        comprobalo: "Inspeccioná las claves de compatibilidad activas en el Registro."
      }
    },
    entende: {
      queEs: "El mecanismo de Windows que permite cambiar el comportamiento reportado por el sistema operativo para ejecutables específicos.",
      paraQueSirve: "Resuelve problemas con programas o juegos antiguos que fallan porque verifican la versión de Windows de forma estricta.",
      quePasaSiFalta: "Aplicaciones desarrolladas para Windows 98, XP o 7 podrían cerrarse inmediatamente con errores de versión incompatible."
    },
    interactua: {
      cliExample: "reg query \"HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers\"",
      psExample: "Get-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers'",
      syntaxBreakdown: "Lista los ejecutables que tienen asignadas banderas de compatibilidad (ej. `~ WINXPSP3`).",
      whatToLookFor: "Ruta del ejecutable asociada con cadenas como `~ WIN7RTM` o `~ WINXPSP3`.",
      technicalMetrics: "Motor de Shims: Kernel32/User32 Hooking via `Apphelp.dll`."
    },
    alertaEVO: {
      reversibilityRule: "Las banderas de compatibilidad se pueden quitar desde las Propiedades del archivo o borrando la clave en el Registro.",
      safetyWarning: "No uses Modo de Compatibilidad para antivirus, drivers o herramientas de mantenimiento del sistema."
    },
    evidenceBadge: {
      code: "SHIM_ENGINE_VERIFIED",
      label: "Motor de Shims Auditado"
    }
  },
  {
    id: "inv-26-05",
    code: "26.05",
    title: "Run as Administrator",
    subtitle: "Elevación de privilegios UAC y banderas RUNASADMIN para programas antiguos",
    targetMechanism: "User Account Control (UAC) & Token Elevation",
    targetComponent: "UAC Security Subsystem",
    commandName: "powershell -Command \"Start-Process cmd.exe -Verb RunAs\"",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "Muchos programas antiguos (creados para Windows XP) intentan escribir archivos de configuración en `C:\\Program Files` o en `HKLM` en el Registro, requiriendo privilegios de Administrador para no fallar de forma silenciosa.",
      mythVsTruth: {
        mentira: "Si mi usuario es Administrador de la PC, todas mis aplicaciones ya corren automáticamente con permisos totales de Administrador.",
        verdad: "Desde Windows Vista con UAC, incluso las cuentas de Administrador ejecutan las aplicaciones con un token de usuario limitado a menos que se eleven explícitamente.",
        comprobalo: "Verificá la bandera `~ RUNASADMIN` en las claves de AppCompatFlags."
      }
    },
    entende: {
      queEs: "La solicitud de elevación de token de seguridad para otorgar permisos de escritura completa en el sistema.",
      paraQueSirve: "Permite a software antiguo modificar archivos o configuraciones del sistema sin sufrir bloqueos de permisos NTFS.",
      quePasaSiFalta: "El programa legado puede fallar sin guardar configuraciones, mostrar errores de 'Acceso denegado' o cerrarse inesperadamente."
    },
    interactua: {
      cliExample: "reg add \"HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers\" /v \"C:\\ProgramaAntiguo\\app.exe\" /t REG_SZ /d \"~ RUNASADMIN\" /f",
      psExample: "Start-Process -FilePath \"C:\\Windows\\System32\\notepad.exe\" -Verb RunAs",
      syntaxBreakdown: "-Verb RunAs le indica al S.O. que desencadene el diálogo del UAC para elevar el proceso.",
      whatToLookFor: "Diálogo emergente azul/amarillo del UAC pidiendo confirmación de elevación.",
      technicalMetrics: "Tokens de seguridad: Filtered Token (Medium Integrity) vs Elevated Token (High Integrity Level)."
    },
    alertaEVO: {
      reversibilityRule: "La elevación de privilegios se solicita por proceso y finaliza al cerrar la aplicación.",
      safetyWarning: "No ejecutes como Administrador programas o juegos descargados de fuentes no confiables."
    },
    evidenceBadge: {
      code: "UAC_ELEVATION_AUDIT",
      label: "Mecanismo UAC RunAs Verificado"
    }
  },
  {
    id: "inv-26-06",
    code: "26.06",
    title: "DPI",
    subtitle: "Ajustes de escalado en pantallas 4K para evitar texto borroso o interfaces diminutas",
    targetMechanism: "GDI Scaling & High DPI Awareness Flags (PerMonitorV2)",
    targetComponent: "Display Subsystem & User32 DPI Scaling",
    commandName: "reg query \"HKCU\\Control Panel\\Desktop\" /v LogPixels",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Las aplicaciones antiguas no entienden pantallas 4K con escalado del 150% o 200%, por lo que Windows estira sus píxeles haciéndolas ver borrosas o miniaturiza sus ventanas.",
      mythVsTruth: {
        mentira: "Si una aplicación se ve borrosa en mi monitor 4K, la culpa es de la placa de video.",
        verdad: "La causa es que la aplicación fue compilada como 'DPI Unaware'. Windows escala la interfaz mediante bitmaps borrosos para evitar que se vea microscópica.",
        comprobalo: "Cambiá el ajuste de 'Escalado de DPI alto' a 'Sistema (mejorado)' en las propiedades de compatibilidad del programa."
      }
    },
    entende: {
      queEs: "La gestión de la densidad de píxeles por pulgada (DPI) en el renderizado de la interfaz gráfica.",
      paraQueSirve: "Permite corregir aplicaciones con texto borroso o controles fuera de posición en pantallas de alta resolución.",
      quePasaSiFalta: "Interfaces ilegibles, textos cortados o imágenes borrosas en monitores modernos."
    },
    interactua: {
      cliExample: "reg query \"HKCU\\Control Panel\\Desktop\" /v Win8DpiScaling",
      psExample: "Get-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop' -Name LogPixels -ErrorAction SilentlyContinue",
      syntaxBreakdown: "Consulta los valores de configuración de escalado global de pantalla almacenados en el perfil de usuario.",
      whatToLookFor: "LogPixels = 96 (100% normal), 120 (125%), 144 (150%), 192 (200%).",
      technicalMetrics: "Niveles DPI: Unaware, System DPI Aware, Per-Monitor DPI Aware V2."
    },
    alertaEVO: {
      reversibilityRule: "Los ajustes de DPI se pueden revertir seleccionando 'Rendimiento determinado por la aplicación'.",
      safetyWarning: "Forzar escalado GDI en software de diseño gráfico puede distorsionar coordenadas y herramientas de dibujo."
    },
    evidenceBadge: {
      code: "HIGH_DPI_SCALING_OK",
      label: "Escalado DPI de Pantalla Auditado"
    }
  },
  {
    id: "inv-26-07",
    code: "26.07",
    title: "Fullscreen",
    subtitle: "Deshabilitar optimizaciones de pantalla completa para juegos y programas DirectX legados",
    targetMechanism: "Direct3D Fullscreen Exclusive (FSE) vs Desktop Window Manager (DWM) Flip Model",
    targetComponent: "DWM & DirectX Graphics Pipeline",
    commandName: "reg query \"HKCU\\System\\GameConfigStore\" /v GameDVR_FSEBehavior",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Las 'Optimizaciones de pantalla completa' de Windows 10/11 fuerzan a los juegos antiguos a correr en un modo de ventana bordeles especial que a veces causa tartamudeo (stuttering) o pantalla negra.",
      mythVsTruth: {
        mentira: "Deshabilitar las optimizaciones de pantalla completa siempre baja los FPS del juego.",
        verdad: "En títulos antiguos con motores Direct3D 9 u 11, deshabilitar esta opción devuelve el control exclusivo (FSE) a la GPU, eliminando la latencia del DWM.",
        comprobalo: "Verificá la bandera `DISABLEDXMAXIMIZEDWINDOWEDMODE` en la configuración de compatibilidad del juego."
      }
    },
    entende: {
      queEs: "El modo de renderizado híbrido de Windows que combina las ventajas de la pantalla completa con la velocidad de superposición del DWM.",
      paraQueSirve: "Mejora el cambio rápido con Alt+Tab y las superposiciones (overlays), pero puede causar incompatibilidad en títulos retro.",
      quePasaSiFalta: "Juegos clásicos pueden congelarse al presionar Alt+Tab o presentar fluctuaciones severas en el tiempo de cuadro (Frame Time)."
    },
    interactua: {
      cliExample: "reg query \"HKCU\\System\\GameConfigStore\" /v GameDVR_DXGIHonorFSEMode",
      psExample: "Get-ItemProperty -Path 'HKCU:\\System\\GameConfigStore' -Name GameDVR_FSEBehavior",
      syntaxBreakdown: "Consulta la configuración global del sistema respecto al comportamiento de Pantalla Completa Exclusiva (FSE).",
      whatToLookFor: "GameDVR_FSEBehavior = 2 indica anulación de optimizaciones por el usuario.",
      technicalMetrics: "Pipeline de renderizado: Direct3D Exclusive vs Flip Presentation Model."
    },
    alertaEVO: {
      reversibilityRule: "La casilla 'Deshabilitar optimizaciones de pantalla completa' se activa/desactiva sin riesgo.",
      safetyWarning: "En juegos modernos DX12, mantener las optimizaciones de pantalla completa activas es recomendado."
    },
    evidenceBadge: {
      code: "FULLSCREEN_OPT_CHECK",
      label: "Pipeline de Renderizado Auditado"
    }
  },
  {
    id: "inv-26-08",
    code: "26.08",
    title: "Legacy software",
    subtitle: "Runtimes imprescindibles: Visual C++ Redistributables, .NET 3.5 y DirectX 9",
    targetMechanism: "Side-by-Side (SxS) Assemblies & Windows Features on Demand",
    targetComponent: "C:\\Windows\\WinSxS & Component Store",
    commandName: "dism /online /get-features | findstr /i \"NetFx3\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Más del 80% de las fallas al abrir programas legados no son incompatibilidad de Windows, sino la falta de los paquetes Visual C++ Redistributables (2005 a 2022) o de .NET Framework 3.5.",
      mythVsTruth: {
        mentira: "Si ya tengo instalado Visual C++ 2022, no necesito instalar las versiones de 2008, 2010 ni 2012.",
        verdad: "Cada versión de Visual C++ proporciona DLLs con nombres de versión específicos (ej. msvcr100.dll, msvcp140.dll) que no son retrocompatibles.",
        comprobalo: "Consulta el estado de la característica .NET 3.5 con DISM."
      }
    },
    entende: {
      queEs: "Las bibliotecas de soporte y paquetes de ejecución (Runtimes) que las aplicaciones necesitan para funcionar.",
      paraQueSirve: "Proporcionar código prediseñado para manejo de memoria, gráficos, matemáticas y conexión a bases de datos.",
      quePasaSiFalta: "Aparecerán errores emergentes solicitando bibliotecas DLL específicas o códigos de error como 0xc000007b."
    },
    interactua: {
      cliExample: "dism /online /get-featureinfo /featurename:NetFx3",
      psExample: "Get-WindowsCapability -Online -Name \"NetFX3~~~~\"",
      syntaxBreakdown: "Comprueba si la característica .NET Framework 3.5 (que incluye .NET 2.0 y 3.0) está instalada en el sistema.",
      whatToLookFor: "State : Enabled.",
      technicalMetrics: "Carpetas de componentes: C:\\Windows\\WinSxS. Runtimes VC++ x86 y x64 simultáneos."
    },
    alertaEVO: {
      reversibilityRule: "Habilitar .NET 3.5 mediante DISM es una operación nativa y segura.",
      safetyWarning: "Descargá siempre los Redistributables directamente desde los servidores oficiales de Microsoft."
    },
    evidenceBadge: {
      code: "LEGACY_RUNTIMES_AUDIT",
      label: "Estado de Runtimes VCRedist y .NET Verificado"
    }
  },
  {
    id: "inv-26-09",
    code: "26.09",
    title: "DLL missing",
    subtitle: "Diagnóstico pericial de bibliotecas faltantes y el error catastrófico 0xc000007b",
    targetMechanism: "Dynamic Link Library Search Order (SafeDllSearchMode) & Dependency Walker",
    targetComponent: "PE Loader / System32 & SysWOW64 DLLs",
    commandName: "sfc /scannow",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El código de error '0xc000007b' significa literalmente STATUS_INVALID_IMAGE_FORMAT: ocurre cuando una aplicación de 32 bits intenta cargar accidentalmente una DLL de 64 bits o viceversa.",
      mythVsTruth: {
        mentira: "La solución cuando falta una DLL es descargar la DLL suelta de un sitio web rancio y pegarla en System32.",
        verdad: "Pegar DLLs sueltas de Internet es peligrosísimo (pueden contener malware) y no resuelve el problema subyacente. La solución es reinstalar el paquete Redistributable oficial.",
        comprobalo: "Usa el comando `sfc /scannow` para verificar que la integridad de las DLLs nativas del sistema esté intacta."
      }
    },
    entende: {
      queEs: "El error ocasionado cuando el cargador de ejecutables de Windows (PE Loader) no encuentra una dependencia requerida en las rutas de búsqueda del sistema.",
      paraQueSirve: "Permite identificar qué paquete de software falta para restaurar la ejecutabilidad del programa.",
      quePasaSiFalta: "El programa muestra una ventana emergente de error de sistema y se cierra sin abrir."
    },
    interactua: {
      cliExample: "sfc /scannow",
      psExample: "Get-ChildItem -Path C:\\Windows\\System32 -Filter \"msvcp*.dll\" | Select-Object Name -First 5",
      syntaxBreakdown: "Lista las bibliotecas C++ de tiempo de ejecución presentes en la carpeta principal del sistema.",
      whatToLookFor: "Presencia de msvcp100.dll, msvcp120.dll, msvcp140.dll.",
      technicalMetrics: "Orden de búsqueda de DLLs: 1. Directorio del ejecutable, 2. System32, 3. SysWOW64, 4. Directorio de Windows, 5. Variables PATH."
    },
    alertaEVO: {
      reversibilityRule: "Escanear con SFC es una verificación de integridad totalmente segura.",
      safetyWarning: "NUNCA descargues archivos .dll sueltos desde buscadores; siempre reinstalá el paquete instalador completo."
    },
    evidenceBadge: {
      code: "DLL_DEPENDENCY_AUDIT",
      label: "Integridad de Bibliotecas DLL Verificada"
    }
  },
  {
    id: "inv-26-10",
    code: "26.10",
    title: "Programa antiguo que no abre",
    subtitle: "Metodología pericial de diagnóstico paso a paso: Event Viewer, ProcMon y Shims",
    targetMechanism: "Application Crash Logs (Event ID 1000) & Process Monitor I/O Tracing",
    targetComponent: "Application Event Log & Windows Error Reporting (WER)",
    commandName: "Get-WinEvent -LogName Application -FilterXPath \"*[System[EventID=1000]]\" -MaxEvents 5",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Cuando un programa antiguo se cierra inmediatamente sin mostrar ningún mensaje en pantalla, el sistema SIEMPRE registra el nombre del módulo fallido (`Faulting module name`) en el Visor de Eventos.",
      mythVsTruth: {
        mentira: "Si un programa hace click y no abre nada, es porque Windows 11 rompió la compatibilidad y no hay forma de arreglarlo.",
        verdad: "Casi siempre hay un registro en el Visor de Eventos (Event ID 1000) indicando qué DLL o permiso específico causó el cierre prematuro.",
        comprobalo: "Consultá el Registro de Aplicación buscando eventos de Application Error (ID 1000)."
      }
    },
    entende: {
      queEs: "El protocolo sistemático de resolución de problemas para aplicaciones legadas bloqueadas.",
      paraQueSirve: "Diagnosticar con precisión la causa raíz (falta de permisos, crash de DLL, falta de runtime o incompatibilidad de gráficos).",
      quePasaSiFalta: "Sin esta metodología, la única opción del usuario es reinstalar el S.O. a ciegas sin resolver el problema."
    },
    interactua: {
      cliExample: "wevtutil qe Application /q:\"*[System[EventID=1000]]\" /c:3 /f:text",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='Application';Id=1000} -MaxEvents 3 | Select-Object TimeCreated, Message",
      syntaxBreakdown: "Obtiene los últimos 3 eventos de cierre inesperado de aplicaciones con el módulo y la dirección de memoria exacta del fallo.",
      whatToLookFor: "Líneas con `Faulting application name` y `Faulting module name`.",
      technicalMetrics: "Event ID 1000: Application Error. Event ID 1001: Windows Error Reporting."
    },
    alertaEVO: {
      reversibilityRule: "Consultar logs del Visor de Eventos es puramente de lectura.",
      safetyWarning: "Analizá siempre el 'Faulting module name' antes de aplicar cambios a ciegas."
    },
    evidenceBadge: {
      code: "APP_CRASH_DIAGNOSTIC",
      label: "Diagnóstico de Cierre Inesperado Completado"
    }
  },
  {
    id: "inv-26-11",
    code: "26.11",
    title: "Compatibility Troubleshooter",
    subtitle: "El Asistente de compatibilidad de programas nativo (msdt.exe)",
    targetMechanism: "Program Compatibility Assistant (PCA) & msdt.exe PCWDiagnostic",
    targetComponent: "pcasvc Service & Diagnostic Engine",
    commandName: "msdt.exe /id PCWDiagnostic",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "El Solucionador de problemas de compatibilidad prueba combinaciones automáticas de Shims, permisos y modos de pantalla hasta encontrar la combinación exacta en la que la aplicación responde.",
      mythVsTruth: {
        mentira: "Los solucionadores de problemas de Windows nunca sirven para nada.",
        verdad: "El Solucionador de Compatibilidad (`PCWDiagnostic`) es uno de los más efectivos de Windows, probando configuraciones de Shims en tiempo real.",
        comprobalo: "Ejecutá `msdt.exe /id PCWDiagnostic` desde la ventana Ejecutar o consola."
      }
    },
    entende: {
      queEs: "El motor de diagnóstico guiado nativo de Windows diseñado para solucionar problemas de compatibilidad de aplicaciones.",
      paraQueSirve: "Automatizar la selección de Shims de compatibilidad, permisos de administrador y configuraciones de pantalla para usuarios no técnicos.",
      quePasaSiFalta: "El usuario debe configurar manualmente cada parámetro en la pestaña Compatibilidad."
    },
    interactua: {
      cliExample: "msdt.exe /id PCWDiagnostic",
      psExample: "Start-Process msdt.exe -ArgumentList '/id PCWDiagnostic'",
      syntaxBreakdown: "Inicia el Asistente de Compatibilidad de Programas en la interfaz gráfica.",
      whatToLookFor: "Ventana del solucionador permitiendo elegir el programa problemático de una lista.",
      technicalMetrics: "Servicio subyacente: pcasvc (Program Compatibility Assistant Service)."
    },
    alertaEVO: {
      reversibilityRule: "Las soluciones sugeridas por el solucionador se pueden guardar o descartar.",
      safetyWarning: "Si el solucionador resuelve el problema, seleccioná 'Guardar esta configuración para el programa'."
    },
    evidenceBadge: {
      code: "COMPAT_TROUBLESHOOTER_OK",
      label: "Asistente de Compatibilidad Verificado"
    }
  }
];

export const SECTOR_26_MINICASES: Sector26MiniCase[] = [
  {
    id: "case-26-01",
    code: "CASO-26-A",
    title: "El desastre del error 0xc000007b al intentar abrir un juego retro",
    scenario: "Un usuario instaló un juego clásico de PC en Windows 11. Al hacer doble click sobre el ejecutable, aparece una pequeña ventana de error titulada 'Error de la aplicación' con el mensaje: 'La aplicación no se pudo iniciar correctamente (0xc000007b). Haga clic en Aceptar para cerrarla.'",
    userStatement: "Busqué en Internet y me dijeron que descargara un archivo msvcp100.dll de un foro y lo pegara en System32, pero ahora me da más errores.",
    initialMistake: "Reemplazar DLLs de sistema manualmente con archivos sueltos no validados descargados de la web.",
    diagnosticQuestion: "¿Qué indica técnicamente el código de error 0xc000007b y cuál es su solución pericial?",
    options: [
      {
        id: "a",
        text: "Indica un conflicto de arquitectura (DLL de 32 bits intentando ser cargada por proceso de 64 bits o viceversa, provocado por pegar DLLs incorrectas). La solución es reinstalar los paquetes oficiales Visual C++ Redistributables x86 y x64.",
        isCorrect: true,
        explanation: "Correcto. 0xc000007b significa STATUS_INVALID_IMAGE_FORMAT. Reinstalar los instaladores oficiales de Visual C++ Redistributable restaura las DLLs correctas para cada arquitectura."
      },
      {
        id: "b",
        text: "Indica que la placa de video está rota y requiere un cambio físico de hardware.",
        isCorrect: false,
        explanation: "Incorrecto. 0xc000007b es un error de formato de imagen PE del cargador de ejecutables de Windows, no una falla de hardware gráfico."
      },
      {
        id: "c",
        text: "Indica que el disco duro tiene sectores defectuosos en la partición C:.",
        isCorrect: false,
        explanation: "Incorrecto. Es un error estrictamente de software/compatibilidad de DLLs."
      }
    ],
    technicalVerdict: "DIAGNOSTICO CONFIRMADO: Corrupción de arquitectura de DLLs por copia manual. REMEDIACIÓN: Limpieza de DLLs sueltas y reinstalación de Visual C++ Redistributables de 2005 a 2022 (x86 y x64).",
    lessonLearned: "Nunca se deben pegar DLLs sueltas descargadas de Internet. Siempre se deben utilizar los instaladores de Runtimes oficiales."
  },
  {
    id: "case-26-02",
    code: "CASO-26-B",
    title: "Software de gestión contable que no guarda datos en Windows 11",
    scenario: "Una empresa utiliza un sistema contable antiguo desarrollado en 2005. El programa abre correctamente, pero cuando el usuario intenta guardar una factura o actualizar la base de datos, el programa no guarda nada o se cierra sin aviso.",
    userStatement: "El programa abre bien, pero las facturas no quedan guardadas. Probamos en una PC vieja con Windows XP y ahí sí funciona.",
    initialMistake: "Asumir que el programa no es compatible con Windows 11 sin revisar los permisos de escritura en la carpeta de instalación.",
    diagnosticQuestion: "¿Por qué el programa no puede guardar datos en Windows 11 y cómo se corrige?",
    options: [
      {
        id: "a",
        text: "El programa intenta escribir en C:\\Archivos de programa, lo cual está bloqueado por la protección de permisos de UAC en Windows moderno. Se corrige configurando 'Ejecutar como administrador' o moviendo la base de datos a C:\\Datos.",
        isCorrect: true,
        explanation: "Exacto. En Windows XP las cuentas tenían acceso de escritura libre a Program Files. En Windows 10/11, UAC bloquea la escritura no elevada en esas rutas."
      },
      {
        id: "b",
        text: "Windows 11 borra automáticamente los archivos creados por programas de más de 10 años.",
        isCorrect: false,
        explanation: "Incorrecto. Windows no borra archivos por antigüedad."
      },
      {
        id: "c",
        text: "El programa requiere cambiar el monitor a resolución 800x600.",
        isCorrect: false,
        explanation: "Incorrecto. La resolución de pantalla no afecta el almacenamiento de archivos o bases de datos."
      }
    ],
    technicalVerdict: "SOLUCIÓN APLICADA: Configuración de la bandera ~ RUNASADMIN en la pestaña Compatibilidad y reubicación del directorio de trabajo a un volumen con permisos de usuario.",
    lessonLearned: "La seguridad UAC de Windows protege los directorios de sistema. Las aplicaciones legadas que escriben en su propio directorio requieren elevación o reubicación."
  }
];

export const SECTOR_26_TEST_BANK: Sector26TestQuestion[] = [
  {
    id: "test-26-01",
    questionNumber: 1,
    category: "Process Architecture",
    question: "¿Cuál es el límite máximo de memoria virtual direccionable para un proceso estándar de 32 bits en Windows?",
    options: [
      { id: "a", text: "512 MB" },
      { id: "b", text: "2 GB (o 3 GB con bandera Large Address Aware)" },
      { id: "c", text: "16 GB" },
      { id: "d", text: "Ilimitado" }
    ],
    correctOptionId: "b",
    technicalExplanation: "En arquitectura x86 de 32 bits, el espacio de direcciones virtuales de modo usuario está limitado por defecto a 2 GB (extensible a 3 GB con LAA).",
    relatedInvestigationCode: "26.01"
  },
  {
    id: "test-26-02",
    questionNumber: 2,
    category: "Subsystem Emulation",
    question: "¿Qué función cumple la carpeta `C:\\Windows\\SysWOW64` en un sistema operativo Windows de 64 bits?",
    options: [
      { id: "a", text: "Guardar los archivos y bibliotecas DLL de 64 bits nativas." },
      { id: "b", text: "Albergar las bibliotecas DLL de 32 bits necesarias para la ejecución de procesos x86 bajo el subsistema WOW64." },
      { id: "c", text: "Guardar las copias de seguridad de las actualizaciones de Windows Update." },
      { id: "d", text: "Almacenar los archivos temporales de los navegadores." }
    ],
    correctOptionId: "b",
    technicalExplanation: "'SysWOW64' significa 'System Windows 32-bit On Windows 64-bit' y almacena las bibliotecas de 32 bits para mantener compatibilidad.",
    relatedInvestigationCode: "26.03"
  },
  {
    id: "test-26-03",
    questionNumber: 3,
    category: "Error Diagnosis",
    question: "¿Qué significa técnicamente el código de error `0xc000007b` al intentar ejecutar una aplicación?",
    options: [
      { id: "a", text: "STATUS_INVALID_IMAGE_FORMAT: Un proceso intentó cargar una DLL de una arquitectura diferente (ej. x86 cargando x64)." },
      { id: "b", text: "Falta de espacio en el disco rígido." },
      { id: "c", text: "Contraseña de usuario incorrecta." },
      { id: "d", text: "Tarjeta de red desconectada." }
    ],
    correctOptionId: "a",
    technicalExplanation: "0xc000007b representa una incompatibilidad de formato PE/imagen entre la arquitectura del proceso principal y las DLLs que intenta vincular.",
    relatedInvestigationCode: "26.09"
  },
  {
    id: "test-26-04",
    questionNumber: 4,
    category: "Legacy Runtimes",
    question: "¿Qué paquete de características de Windows se requiere comúnmente para ejecutar software o juegos legados basados en .NET Framework 2.0 / 3.0?",
    options: [
      { id: "a", text: "DirectX 12 Ultimate" },
      { id: "b", text: ".NET Framework 3.5 (incluye .NET 2.0 y 3.0)" },
      { id: "c", text: "Java Runtime Environment 8" },
      { id: "d", text: "Python 3.11" }
    ],
    correctOptionId: "b",
    technicalExplanation: "La característica opcional .NET Framework 3.5 engloba los runtimes de .NET 2.0, 3.0 y 3.5 requeridos por miles de aplicaciones clásicas.",
    relatedInvestigationCode: "26.08"
  },
  {
    id: "test-26-05",
    questionNumber: 5,
    category: "High DPI Scaling",
    question: "Si una aplicación antigua muestra texto borroso en un monitor de alta resolución (4K), ¿cuál es el ajuste de compatibilidad recomendado?",
    options: [
      { id: "a", text: "Bajar la frecuencia de actualización del monitor a 30 Hz." },
      { id: "b", text: "Cambiar la configuración de 'Escalado de DPI alto' a 'Sistema (Mejorado)' o 'Aplicación' en las propiedades de compatibilidad." },
      { id: "c", text: "Desactivar la placa de video dedicada." },
      { id: "d", text: "Eliminar el archivo ejecutable." }
    ],
    correctOptionId: "b",
    technicalExplanation: "Anular el comportamiento de escalado de DPI alto permite que Windows o la propia aplicación gestionen la densidad de píxeles adecuadamente sin emborronar fuentes.",
    relatedInvestigationCode: "26.06"
  }
];
