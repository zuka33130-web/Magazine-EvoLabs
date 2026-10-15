// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 34: WINSXS Y COMPONENT STORE
// "La carpeta de 20 GB que quizás no ocupe 20 GB"

export type RiskLevelSector34 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector34Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector34;
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
    paraQueSilve?: string;
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

export interface Sector34MiniCase {
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

export interface Sector34TestQuestion {
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
}

export const SECTOR_34_INVESTIGATIONS: Sector34Investigation[] = [
  {
    id: "inv-34-01",
    code: "34.01",
    title: "Component Store",
    subtitle: "C:\\Windows\\WinSxS: El repositorio inmutable de componentes de Windows",
    targetMechanism: "Windows Component Store Repository",
    targetComponent: "WinSxS / TrustedInstaller",
    commandName: "dism.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que Windows no instala archivos en System32 directamente, sino que todo el sistema operativo vive en WinSxS y se proyecta mediante enlaces?",
      mythVsTruth: {
        mentira: "WinSxS es una carpeta de archivos temporales de actualización que Windows olvidó borrar.",
        verdad: "Es la única copia real de los binarios del sistema operativo; si la borras, destruyes el núcleo de mantenimiento de Windows.",
        comprobalo: "Usa fsutil para ver que un DLL en System32 comparte el mismo File ID exacto que el archivo en WinSxS."
      }
    },
    entende: {
      queEs: "El almacén atómico de componentes donde cada versión de cada archivo del sistema (DLLs, drivers, ejecutables) se almacena con manifiestos criptográficos.",
      paraQueSirve: "Permitir actualizaciones acumulativas sin sobreescribir archivos a ciegas, revertir parches y habilitar roles o características opcionales sin pedir DVD o ISO.",
      quePasaSiFalta: "Windows Update, SFC y DISM quedan completamente inoperativos y el sistema entra en bucle de arranque 0xc000021a."
    },
    interactua: {
      cliExample: "dism /online /cleanup-image /analyzecomponentstore",
      psExample: "Get-ChildItem -Path C:\\Windows\\WinSxS -Directory | Measure-Object | Select-Object Count",
      syntaxBreakdown: "Analiza el almacén de componentes en línea, distinguiendo entre archivos reales, copias de seguridad de parches y punteros hardlink.",
      whatToLookFor: "Valores 'Tamaño real del almacén de componentes', 'Paquetes reemplazados' y 'Se recomienda la limpieza del almacén de componentes'.",
      technicalMetrics: "WinSxS típicamente contiene entre 50.000 y 80.000 carpetas de componentes individuales protegidos por ACLs de TrustedInstaller."
    },
    alertaEVO: {
      reversibilityRule: "La inspección con DISM /AnalyzeComponentStore es 100% de solo lectura.",
      safetyWarning: "Jamás intentes cambiar el propietario de la carpeta WinSxS de TrustedInstaller a Administradores."
    },
    evidenceBadge: {
      code: "S34-WINSXS-01",
      label: "STORE-INSPECTED"
    }
  },
  {
    id: "inv-34-02",
    code: "34.02",
    title: "CBS",
    subtitle: "Component-Based Servicing: El motor de mantenimiento atómico",
    targetMechanism: "Component-Based Servicing (CBS Engine)",
    targetComponent: "TiWorker.exe / TrustedInstaller.exe",
    commandName: "CBS.log",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué el proceso TiWorker.exe a veces consume el 100% de un núcleo de CPU sin que haya ninguna descarga aparente de Windows Update?",
      mythVsTruth: {
        mentira: "TiWorker.exe es telemetría innecesaria o un virus disfrazado de proceso del sistema.",
        verdad: "Es el motor CBS calculando grafos de dependencia de componentes y compactando manifiestos del Component Store en segundo plano.",
        comprobalo: "Abre C:\\Windows\\Logs\\CBS\\CBS.log y verás las transacciones atómicas verificando hashes SHA256 de cada paquete."
      }
    },
    entende: {
      queEs: "La arquitectura de transacciones atómicas que introdujo Windows Vista para reemplazar el viejo instalador INF/Update.exe de Windows XP.",
      paraQueSirve: "Garantizar que una actualización se aplique al 100% o se revierta completamente sin dejar archivos a medio reemplazar ni estados inconsistentes.",
      quePasaSiFalta: "Sin CBS, cualquier corte de energía durante una actualización corrompería irreversibles librerías del kernel."
    },
    interactua: {
      cliExample: "type C:\\Windows\\Logs\\CBS\\CBS.log | findstr /i \"failed error\"",
      psExample: "Get-Content C:\\Windows\\Logs\\CBS\\CBS.log -Tail 50 | Select-String -Pattern 'CBS|TiWorker'",
      syntaxBreakdown: "Filtra errores críticos de transacciones de manifiestos en el registro en tiempo real de CBS.",
      whatToLookFor: "Códigos como STATUS_SXS_ASSEMBLY_NOT_FOUND o STATUS_TRANSACTION_ABORTED.",
      technicalMetrics: "CBS utiliza archivos de registro CLFS (Common Log File System) para rollback automático ante fallas de hardware."
    },
    alertaEVO: {
      reversibilityRule: "La lectura del CBS.log no altera el estado del sistema.",
      safetyWarning: "No termines el proceso TiWorker.exe desde el Administrador de Tareas mientras escribe en WinSxS."
    },
    evidenceBadge: {
      code: "S34-CBS-02",
      label: "CBS-TRANSACT"
    }
  },
  {
    id: "inv-34-03",
    code: "34.03",
    title: "Side-by-Side",
    subtitle: "Manifiestos y la erradicación del histórico 'DLL Hell'",
    targetMechanism: "Side-by-Side (SxS) Assembly Isolation",
    targetComponent: "sxs.dll / Manifiestos .manifest",
    commandName: "sxstrace.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Por qué dos aplicaciones pueden requerir versiones totalmente incompatibles de MSVCRT o MFC y ejecutarse a la vez en Windows sin estrellarse?",
      mythVsTruth: {
        mentira: "Windows copia la DLL en la carpeta del programa para aislarla.",
        verdad: "Windows utiliza manifiestos XML Side-by-Side que apuntan a carpetas con hashes de versión únicos dentro de WinSxS.",
        comprobalo: "Usa sxstrace.exe para rastrear la resolución de dependencias de un binario que arroja el error 'La aplicación no se pudo iniciar porque su configuración en paralelo es incorrecta'."
      }
    },
    entende: {
      queEs: "El subsistema que permite la coexistencia simultánea de múltiples versiones de la misma librería DLL sin colisiones de nombres.",
      paraQueSirve: "Erradicar el histórico problema de Windows 98/2000 donde instalar una aplicación sobreescribía la DLL compartida y rompía diez programas más.",
      quePasaSiFalta: "Aparece el temido error 0x000036B1 (ERROR_SXS_CANT_GEN_ACTCTX) y la aplicación se niega a iniciar."
    },
    interactua: {
      cliExample: "sxstrace.exe trace -logfile:sxs.etl",
      psExample: "sxstrace.exe parse -logfile:sxs.etl -outfile:sxs_report.txt ; Get-Content sxs_report.txt",
      syntaxBreakdown: "Inicia una sesión de ETW para registrar qué manifiesto SxS está buscando un ejecutable y dónde falló la resolución.",
      whatToLookFor: "Líneas 'INFO: Resolving Reference' y 'ERROR: Activation Context generation failed'.",
      technicalMetrics: "Los nombres de carpetas SxS codifican arquitectura (amd64/x86), token de clave pública y número de versión build exacto."
    },
    alertaEVO: {
      reversibilityRule: "El comando sxstrace solo genera un log de telemetría ETW descartable.",
      safetyWarning: "Si una app falla por SxS, instala el paquete redistribuible oficial de Visual C++ correspondiente en vez de copiar DLLs a mano."
    },
    evidenceBadge: {
      code: "S34-SXS-03",
      label: "SXS-ISOLATION"
    }
  },
  {
    id: "inv-34-04",
    code: "34.04",
    title: "Hard links",
    subtitle: "La arquitectura física de punteros que conecta WinSxS con System32",
    targetMechanism: "NTFS Hard Link Junctions to MFT Records",
    targetComponent: "ntfs.sys / File Reference Numbers",
    commandName: "fsutil hardlink",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Crees que 'kernel32.dll' en System32 y 'kernel32.dll' en WinSxS son dos copias distintas que ocupan el doble de espacio?",
      mythVsTruth: {
        mentira: "Windows tiene dos o tres copias idénticas del mismo archivo de 5 MB en diferentes carpetas del disco.",
        verdad: "Ambas rutas son 'Hard links' que apuntan exactamente al mismo número de registro MFT físico en el disco.",
        comprobalo: "Ejecuta 'fsutil hardlink list C:\\Windows\\System32\\notepad.exe' y verás que devuelve al menos dos rutas hacia el mismo inode."
      }
    },
    entende: {
      queEs: "Una característica de NTFS que permite que múltiples rutas en el árbol de directorios compartan el mismo registro de archivo en la MFT.",
      paraQueSirve: "Proyectar los archivos del Component Store hacia System32, SysWOW64 y carpetas de drivers sin duplicar un solo byte físico en el almacenamiento.",
      quePasaSiFalta: "Windows requeriría el triple de espacio en disco (más de 60 GB solo para la carpeta Windows base)."
    },
    interactua: {
      cliExample: "fsutil hardlink list C:\\Windows\\System32\\ntdll.dll",
      psExample: "(Get-Item C:\\Windows\\System32\\ntdll.dll).Target",
      syntaxBreakdown: "Lista todos los nombres de archivo y rutas en el volumen que comparten el mismo registro MFT físico.",
      whatToLookFor: "Rutas como '\\Windows\\System32\\ntdll.dll' y '\\Windows\\WinSxS\\amd64_microsoft-windows-ntdll_...\\ntdll.dll'.",
      technicalMetrics: "El contador de hardlinks en el registro MFT de ntdll.dll es >= 2; el archivo solo se borrará físicamente si todos los enlaces se eliminan."
    },
    alertaEVO: {
      reversibilityRule: "fsutil hardlink list es una consulta de solo lectura.",
      safetyWarning: "Modificar o parchar un archivo en System32 sin desvincular el hardlink alterará de inmediato la copia en WinSxS."
    },
    evidenceBadge: {
      code: "S34-HLINK-04",
      label: "HARDLINK-SHARED"
    }
  },
  {
    id: "inv-34-05",
    code: "34.05",
    title: "Tamaño aparente vs real",
    subtitle: "Por qué el Explorador de Windows miente al calcular el tamaño de WinSxS",
    targetMechanism: "Explorer File Size Recursion vs Physical Cluster Allocation",
    targetComponent: "explorer.exe / MFT Cluster Accounting",
    commandName: "dism /analyzecomponentstore",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Si das clic derecho en WinSxS y ves '22 GB', ¿por qué tu disco C: solo tiene 30 GB ocupados en total si Windows supuestamente pesa 35 GB?",
      mythVsTruth: {
        mentira: "WinSxS está devorando 20 GB de tu unidad de estado sólido.",
        verdad: "El Explorador de Windows no comprende hard links: suma el tamaño de cada archivo tantas veces como enlaces existan.",
        comprobalo: "Compara el reporte de Explorer (20+ GB) con el tamaño reportado por DISM /AnalyzeComponentStore (típicamente 6 a 8 GB)."
      }
    },
    entende: {
      queEs: "La discrepancia matemática entre el cálculo ingenuo por árbol de directorios y la asignación real en el mapa de bits de clusters NTFS ($Bitmap).",
      paraQueSirve: "Comprender la verdad física antes de entrar en pánico y pasar herramientas de 'limpieza' destructivas.",
      quePasaSiFalta: "Los usuarios borran archivos creyendo que recuperarán 20 GB y terminan con un pantallazo azul irreparable."
    },
    interactua: {
      cliExample: "dism /online /cleanup-image /analyzecomponentstore",
      psExample: "$dismOut = dism /online /cleanup-image /analyzecomponentstore; $dismOut | Select-String -Pattern 'Tamaño|Size|Recomiend'",
      syntaxBreakdown: "Ejecuta la auditoría interna del CBS que consulta los hardlinks reales y descuenta los archivos proyectados en System32.",
      whatToLookFor: "Diferencia entre 'Tamaño del almacén de componentes según el Explorador' y 'Tamaño real del almacén de componentes'.",
      technicalMetrics: "En promedio, el tamaño real del Component Store representa entre el 30% y el 40% del valor reportado por el Explorador."
    },
    alertaEVO: {
      reversibilityRule: "Operación de auditoría 100% inocua.",
      safetyWarning: "No uses herramientas como TreeSize o WinDirStat para tomar decisiones en carpetas del sistema sin activar el modo de detección de hardlinks."
    },
    evidenceBadge: {
      code: "S34-SIZE-05",
      label: "SIZE-AUDITED"
    }
  },
  {
    id: "inv-34-06",
    code: "34.06",
    title: "AnalyzeComponentStore",
    subtitle: "Auditoría forense de paquetes reemplazados y estado de salud",
    targetMechanism: "DISM Component Store Analysis Engine",
    targetComponent: "DismCore.dll / CBS Engine",
    commandName: "dism /analyzecomponentstore",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo sabe Windows si realmente vale la pena ejecutar una limpieza de parches o si todo lo que hay es estrictamente necesario?",
      mythVsTruth: {
        mentira: "Siempre conviene correr comandos de limpieza después de cada actualización.",
        verdad: "DISM evalúa el balance entre componentes reemplazados (superseded) y tiempo de retención de desinstalación de parches antes de aconsejar limpieza.",
        comprobalo: "Observa la última línea del análisis: dirá 'Se recomienda la limpieza del almacén de componentes : Sí' o 'No'."
      }
    },
    entende: {
      queEs: "El comando pericial nativo de Windows para inspeccionar la salud y fragmentación de versiones del Component Store.",
      paraQueSirve: "Saber con precisión matemática cuántos megabytes reales se pueden liberar eliminando versiones antiguas de parches acumulativos.",
      quePasaSiFalta: "Se ejecutan tareas de mantenimiento a ciegas, desgastando innecesariamente la memoria NAND del SSD."
    },
    interactua: {
      cliExample: "dism.exe /Online /Cleanup-Image /AnalyzeComponentStore",
      psExample: "Get-WindowsPackage -Online | Where-Object { $_.PackageState -eq 'Superseded' } | Measure-Object",
      syntaxBreakdown: "Invoca el despachador de DISM para leer los manifiestos de paquetes y contar cuántos están en estado 'Superseded'.",
      whatToLookFor: "Línea 'Paquetes reemplazados' mayor a 0 y 'Copias de seguridad y funciones deshabilitadas'.",
      technicalMetrics: "Tasa típica de paquetes obsoletos tras 6 meses sin mantenimiento: entre 1.5 GB y 4.0 GB recuperables."
    },
    alertaEVO: {
      reversibilityRule: "Comando de solo lectura.",
      safetyWarning: "Este comando puede demorar 2 a 5 minutos en CPUs modestas ya que analiza miles de manifiestos criptográficos."
    },
    evidenceBadge: {
      code: "S34-DISMANAL-06",
      label: "DISM-ANALYZED"
    }
  },
  {
    id: "inv-34-07",
    code: "34.07",
    title: "Cleanup",
    subtitle: "Limpieza profesional con StartComponentCleanup y ResetBase",
    targetMechanism: "CBS Superseded Component Scavenging",
    targetComponent: "dism.exe / TiWorker.exe",
    commandName: "dism /startcomponentcleanup",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "¿Sabías que existe un modificador secreto de DISM llamado /ResetBase que elimina la capacidad de desinstalar parches pero compacta el almacén al mínimo absoluto?",
      mythVsTruth: {
        mentira: "El Liberador de Espacio en Disco (cleanmgr) limpia todo lo que hay en WinSxS.",
        verdad: "Cleanmgr solo ejecuta tareas superficiales; DISM con /StartComponentCleanup y /ResetBase elimina físicamente las versiones obsoletas no revertibles.",
        comprobalo: "Ejecuta /AnalyzeComponentStore antes y después de /StartComponentCleanup: el tamaño real bajará sustancialmente."
      }
    },
    entende: {
      queEs: "El proceso oficial y seguro de recolección de basura del Component Store de Windows.",
      paraQueSirve: "Purgar binarios de actualizaciones previas que ya no son requeridas porque fueron superadas por parches acumulativos más recientes.",
      quePasaSiFalta: "El disco acumula gigabytes de versiones históricas de archivos del sistema que jamás volverán a ejecutarse."
    },
    interactua: {
      cliExample: "dism.exe /Online /Cleanup-Image /StartComponentCleanup",
      psExample: "dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase",
      syntaxBreakdown: "/StartComponentCleanup purga versiones viejas manteniendo capacidad de rollback; agregar /ResetBase quema las versiones actuales como nueva línea base inmutable.",
      whatToLookFor: "Mensaje 'La operación se completó correctamente' con código de salida 0 (ERROR_SUCCESS).",
      technicalMetrics: "Elimina hardlinks de versiones anteriores y permite que NTFS libere clusters del mapa de bits físico."
    },
    alertaEVO: {
      reversibilityRule: "/StartComponentCleanup es seguro; /ResetBase es IRREVERSIBLE (no podrás desinstalar las actualizaciones acumulativas actuales).",
      safetyWarning: "No uses /ResetBase si instalaste una actualización acumulativa hace menos de 7 días y aún estás testeando estabilidad."
    },
    evidenceBadge: {
      code: "S34-CLEANUP-07",
      label: "CLEANUP-APPLIED"
    }
  },
  {
    id: "inv-34-08",
    code: "34.08",
    title: "Por qué jamás borrar manualmente WinSxS",
    subtitle: "La autopsia técnica de un sistema destruido por 'limpieza manual'",
    targetMechanism: "TrustedInstaller ACL Security Descriptor & System Integrity",
    targetComponent: "TrustedInstaller / Manifiestos .mum / .cat",
    commandName: "sfc.exe /scannow",
    riskLevel: "HIGH_RISK",
    descubri: {
      hook: "¿Qué pasa en el microsegundo exacto en que un usuario novato fuerza 'takeown /f C:\\Windows\\WinSxS' y presiona Shift+Delete?",
      mythVsTruth: {
        mentira: "Si borras WinSxS, Windows seguirá funcionando porque los archivos están en System32.",
        verdad: "Destruyes los punteros hardlink de System32, eliminas los manifiestos de seguridad y provocas la caída inmediata de servicios del kernel.",
        comprobalo: "Prueba en una máquina virtual: tras reiniciar después de tocar WinSxS a mano, Windows arroja BCD 0xc000021a o INACCESSIBLE_BOOT_DEVICE."
      }
    },
    entende: {
      queEs: "La comprensión de por qué la carpeta WinSxS está deliberadamente bloqueada y protegida bajo el SID exclusivo de NT SERVICE\\TrustedInstaller.",
      paraQueSirve: "Impedir que administradores o software de terceros corrompan la integridad criptográfica de los manifiestos de componentes.",
      quePasaSiFalta: "Pérdida total del sistema operativo: ni SFC ni DISM podrán reparar el equipo porque ambos leen sus plantillas de reparación de WinSxS."
    },
    interactua: {
      cliExample: "icacls C:\\Windows\\WinSxS",
      psExample: "(Get-Acl C:\\Windows\\WinSxS).Access | Select-Object IdentityReference, FileSystemRights",
      syntaxBreakdown: "Verifica las listas de control de acceso (DACL) de WinSxS: verás que TrustedInstaller tiene Control Total, mientras que Administrators solo tiene Lectura y Ejecución.",
      whatToLookFor: "Identidad 'NT SERVICE\\TrustedInstaller' como propietario absoluto (Owner).",
      technicalMetrics: "Los permisos nativos de WinSxS impiden 'Write' y 'Delete' incluso para la cuenta SYSTEM."
    },
    alertaEVO: {
      reversibilityRule: "La inspección de permisos con icacls es inocua.",
      safetyWarning: "Si un software o tutorial en internet te pide tomar posesión (takeown) de WinSxS, descártalo de inmediato: es un destructor de sistemas."
    },
    evidenceBadge: {
      code: "S34-NOKILL-08",
      label: "INTEGRITY-SHIELD"
    }
  }
];

export const SECTOR_34_MINICASES: Sector34MiniCase[] = [
  {
    id: "case-34-01",
    code: "MC-34.01",
    title: "El pánico del disco lleno por TreeSize",
    scenario: "Un técnico novato escanea una laptop con un SSD de 128 GB usando TreeSize en modo estándar. Ve que C:\\Windows\\WinSxS ocupa 21 GB y C:\\Windows\\System32 ocupa 18 GB. Decide tomar posesión de WinSxS con takeown para borrar los archivos con fechas de 2021 creyendo que son basura vieja.",
    userStatement: "WinSxS me está comiendo un quinto de mi disco. Si los archivos están en System32, ¿por qué los tengo dos veces?",
    initialMistake: "Asumir que WinSxS y System32 almacenan archivos duplicados físicamente en lugar de comprender los hard links de NTFS.",
    diagnosticQuestion: "¿Cuál es el diagnóstico pericial exacto y qué procedimiento debe realizarse?",
    options: [
      {
        id: "opt-1",
        text: "Borrar las carpetas que contengan la palabra 'backup' y reiniciar para que Windows regenere los archivos.",
        isCorrect: false,
        explanation: "No existen carpetas de backup descartables; borrar componentes a mano corrompe las firmas de CBS y causa pantallazo azul."
      },
      {
        id: "opt-2",
        text: "Ejecutar DISM /Online /Cleanup-Image /AnalyzeComponentStore para conocer el tamaño real y /StartComponentCleanup /ResetBase de forma segura.",
        isCorrect: true,
        explanation: "DISM analiza los hardlinks reales y purga de forma atómica y certificada los componentes reemplazados sin romper la integridad del sistema."
      },
      {
        id: "opt-3",
        text: "Mover la carpeta WinSxS a una unidad USB secundaria y crear un enlace simbólico con mklink.",
        isCorrect: false,
        explanation: "WinSxS debe residir en el mismo volumen NTFS que System32 porque los hard links no pueden cruzar volúmenes distintos."
      }
    ],
    technicalVerdict: "El 70% del tamaño aparente de WinSxS en TreeSize corresponde a hardlinks que apuntan a los mismos clusters de System32. La limpieza manual destruye los enlaces MFT.",
    lessonLearned: "El Explorador y herramientas que no contemplan hardlinks informan espacio ficticio. La única herramienta autorizada para modificar WinSxS es el motor CBS vía DISM."
  },
  {
    id: "case-34-02",
    code: "MC-34.02",
    title: "TiWorker.exe consumiendo 100% de CPU tras un reinicio",
    scenario: "Una computadora de oficina fue reiniciada a la fuerza mientras Windows Update decía 'Actualizando el equipo 45%'. Al iniciar sesión, el ventilador está al máximo y el Administrador de Tareas muestra 'TiWorker.exe' y 'TrustedInstaller.exe' al 100% de CPU.",
    userStatement: "Tengo un troyano que se llama TiWorker, me está minando criptomonedas porque no para de usar mi procesador.",
    initialMistake: "Matar el proceso TiWorker.exe desde el Administrador de Tareas y deshabilitar el servicio Windows Update.",
    diagnosticQuestion: "¿Qué está ocurriendo a nivel de arquitectura y qué se debe hacer?",
    options: [
      {
        id: "opt-1",
        text: "El motor CBS está resolviendo la transacción pendiente abortada en el log CLFS para revertir o finalizar el estado de los manifiestos de WinSxS.",
        isCorrect: true,
        explanation: "CBS es un motor transaccional. Tras un corte abrupto, TiWorker debe recorrer los manifiestos para garantizar que ningún componente quede a medio instalar."
      },
      {
        id: "opt-2",
        text: "Es un virus real que inyectó código en TiWorker. Hay que eliminar el ejecutable desde Modo Seguro.",
        isCorrect: false,
        explanation: "TiWorker es el worker oficial de TrustedInstaller. Destruirlo deja a Windows incapacitado para recibir mantenimiento."
      },
      {
        id: "opt-3",
        text: "Se debe borrar la carpeta SoftwareDistribution inmediatamente para detener el proceso.",
        isCorrect: false,
        explanation: "SoftwareDistribution almacena paquetes descargados, pero TiWorker está operando sobre los componentes ya copiados en WinSxS."
      }
    ],
    technicalVerdict: "TiWorker estaba ejecutando la rutina de rollback transaccional de CBS para devolver el sistema a un estado estable y coherente.",
    lessonLearned: "Nunca interrumpir TiWorker.exe. Monitorear su actividad en tiempo real leyendo C:\\Windows\\Logs\\CBS\\CBS.log con PowerShell."
  },
  {
    id: "case-34-03",
    code: "MC-34.03",
    title: "Error 0x80073712 'Component Store is corrupted'",
    scenario: "Un usuario no puede instalar ninguna actualización acumulativa nueva. El asistente de actualización falla con el error 0x80073712 (ERROR_SXS_COMPONENT_STORE_CORRUPT). SFC /scannow arroja que 'Encontró archivos dañados pero no pudo reparar algunos de ellos'.",
    userStatement: "Windows Update no funciona y SFC no puede arreglarlo. Dicen en foros que tengo que formatear de cero.",
    initialMistake: "Asumir que SFC puede reparar el sistema cuando el propio repositorio local de plantillas (WinSxS) tiene manifiestos corruptos.",
    diagnosticQuestion: "¿Cuál es el protocolo de recuperación pericial sin formatear el equipo?",
    options: [
      {
        id: "opt-1",
        text: "Usar un optimizador con un botón de 'reparación con un clic' para limpiar el registro.",
        isCorrect: false,
        explanation: "Los optimizadores no tienen capacidad de regenerar manifiestos binarios con firmas SHA256 de Microsoft."
      },
      {
        id: "opt-2",
        text: "Ejecutar DISM /Online /Cleanup-Image /RestoreHealth especificando una fuente sana (WIM o ISO oficial montada) para restaurar el Component Store primero.",
        isCorrect: true,
        explanation: "DISM restaura los componentes corruptos de WinSxS usando la imagen oficial como fuente limpia; una vez sano WinSxS, SFC podrá reparar System32."
      },
      {
        id: "opt-3",
        text: "Copiar la carpeta WinSxS de otra computadora con Windows diferente.",
        isCorrect: false,
        explanation: "Los manifiestos SxS son específicos de la compilación y parche acumulativo exacto; mezclar carpetas causa colapso total."
      }
    ],
    technicalVerdict: "SFC falla porque su fuente de reparación es el almacén de componentes local. Al reparar primero WinSxS mediante DISM /RestoreHealth, la cadena de integridad se restaura.",
    lessonLearned: "DISM repara a SFC; SFC repara a Windows. La jerarquía de mantenimiento exige sanar primero el Component Store."
  }
];

export const SECTOR_34_TEST_BANK: Sector34TestQuestion[] = [
  {
    id: "test-34-01",
    questionNumber: 1,
    category: "Arquitectura WinSxS",
    question: "¿Cuál es la relación física real entre un archivo en C:\\Windows\\System32 y su correspondiente en C:\\Windows\\WinSxS?",
    options: [
      { id: "a", text: "Son dos archivos independientes con contenido duplicado en clusters separados." },
      { id: "b", text: "Son enlaces simbólicos (symlinks) que redirigen el tráfico de red local." },
      { id: "c", text: "Son hard links de NTFS que apuntan exactamente al mismo número de registro MFT físico en disco." },
      { id: "d", text: "El archivo en System32 es una copia comprimida en ZIP del archivo en WinSxS." }
    ],
    correctOptionId: "c",
    technicalExplanation: "En NTFS, un hard link es una entrada de directorio adicional para el mismo registro MFT. Ambos nombres comparten los mismos clusters físicos de almacenamiento sin ocupar espacio adicional."
  },
  {
    id: "test-34-02",
    questionNumber: 2,
    category: "Métricas de Almacenamiento",
    question: "¿Por qué el Explorador de Windows suele reportar que WinSxS pesa más de 20 GB cuando el tamaño real es de 6 a 8 GB?",
    options: [
      { id: "a", text: "Porque el Explorador cuenta los hardlinks como archivos independientes de tamaño completo en cada carpeta donde aparecen." },
      { id: "b", text: "Porque WinSxS tiene habilitada la compresión transparente LZX que confunde al Explorador." },
      { id: "c", text: "Porque incluye el archivo hiberfil.sys y pagefile.sys dentro de su cálculo oculto." },
      { id: "d", text: "Porque Windows multiplica el tamaño por el número de procesadores lógicos del equipo." }
    ],
    correctOptionId: "a",
    technicalExplanation: "El cálculo recursivo tradicional del Explorador suma el tamaño lógico declarado en cada registro de directorio sin verificar si el cluster ya fue contabilizado a través de otro enlace duro."
  },
  {
    id: "test-34-03",
    questionNumber: 3,
    category: "Mantenimiento con DISM",
    question: "¿Qué efecto crítico produce agregar el modificador /ResetBase al comando DISM /Online /Cleanup-Image /StartComponentCleanup?",
    options: [
      { id: "a", text: "Restablece el sistema a los valores de fábrica borrando todas las cuentas de usuario." },
      { id: "b", text: "Elimina todas las versiones anteriores de componentes obsoletos, haciendo que las actualizaciones instaladas sean irreversibles." },
      { id: "c", text: "Descarga nuevamente todos los parches desde los servidores de Windows Update." },
      { id: "d", text: "Convierte el disco duro de MBR a GPT de manera transparente." }
    ],
    correctOptionId: "b",
    technicalExplanation: "/ResetBase purga los componentes 'superseded' y establece el estado actual como la nueva línea base inmutable, impidiendo desinstalar los parches acumulativos vigentes pero liberando el máximo espacio real."
  },
  {
    id: "test-34-04",
    questionNumber: 4,
    category: "Seguridad y Permisos",
    question: "¿Quién es el propietario oficial (Owner) con permisos de Control Total sobre la carpeta C:\\Windows\\WinSxS?",
    options: [
      { id: "a", text: "NT AUTHORITY\\SYSTEM" },
      { id: "b", text: "BUILTIN\\Administrators" },
      { id: "c", text: "NT SERVICE\\TrustedInstaller" },
      { id: "d", text: "La cuenta de usuario que instaló Windows por primera vez" }
    ],
    correctOptionId: "c",
    technicalExplanation: "TrustedInstaller es la identidad de servicio de seguridad que administra el ciclo de vida de los componentes en Windows. Incluso los administradores locales solo tienen permisos de lectura por defecto."
  },
  {
    id: "test-34-05",
    questionNumber: 5,
    category: "Resolución Side-by-Side",
    question: "¿Qué herramienta nativa de diagnóstico se utiliza para rastrear fallas de generación de contexto de activación cuando una aplicación arroja un error Side-by-Side (SxS)?",
    options: [
      { id: "a", text: "sxstrace.exe" },
      { id: "b", text: "chkdsk.exe" },
      { id: "c", text: "diskpart.exe" },
      { id: "d", text: "dxdiag.exe" }
    ],
    correctOptionId: "a",
    technicalExplanation: "sxstrace.exe habilita el rastreo de eventos ETW para capturar qué manifiesto SxS está consultando la aplicación y en qué carpeta de WinSxS falló la búsqueda de la librería requerida."
  }
];
