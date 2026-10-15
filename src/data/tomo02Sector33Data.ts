// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 33: NTFS POR DENTRO
// "¿Qué es realmente un archivo?"

export type RiskLevelSector33 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector33Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector33;
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

export interface Sector33MiniCase {
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

export interface Sector33TestQuestion {
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

export const SECTOR_33_INVESTIGATIONS: Sector33Investigation[] = [
  {
    id: "inv-33-01",
    code: "33.01",
    title: "MFT",
    subtitle: "$MFT - Master File Table: arquitectura de registros de 1024 bytes y metadatos",
    targetMechanism: "NTFS Master File Table Indexing",
    targetComponent: "ntfs.sys / $MFT",
    commandName: "fsutil.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que en NTFS absolutamente todo es un archivo, incluso la propia tabla donde se anotan los archivos se llama $MFT y es un archivo más?",
      mythVsTruth: {
        mentira: "El nombre y tamaño de un archivo se guardan dentro del propio archivo.",
        verdad: "Se guardan en el registro de 1024 bytes de la MFT; si el archivo mide menos de 700 bytes, el contenido completo vive dentro de la propia MFT sin ocupar clusters en disco.",
        comprobalo: "Crea un archivo de 100 bytes: verás que 'Tamaño en disco' reporta 0 bytes porque es un archivo 'Residente'."
      }
    },
    entende: {
      queEs: "La base de datos relacional central del sistema de archivos NTFS donde cada archivo y carpeta tiene al menos un registro de tamaño fijo de 1 KB.",
      paraQueSirve: "Localizar instantáneamente los punteros a clusters en disco, almacenar atributos de seguridad, fechas y nombres sin recorrer todo el volumen.",
      quePasaSiFalta: "El volumen queda completamente ilegible y se reporta como partición sin formato 'RAW'."
    },
    interactua: {
      cliExample: "fsutil fsinfo ntfsinfo C:",
      psExample: "Get-Volume -DriveLetter C | Select-Object FileSystemType, AllocationUnitSize, SizeRemaining",
      syntaxBreakdown: "Muestra las métricas internas de la MFT: tamaño de registros, clusters de inicio y zona reservada de MFT.",
      whatToLookFor: "Valores 'Bytes por sector físico', 'Bytes por cluster' (típicamente 4096) y 'Tamaño de registro MFT' (1024).",
      technicalMetrics: "Registro MFT: 1024 bytes con firma 'FILE' y tabla de offset de atributos."
    },
    alertaEVO: {
      reversibilityRule: "fsinfo es un comando de solo lectura seguro.",
      safetyWarning: "Nunca intentes desfragmentar la MFT con software no certificado; podrías corromper la tabla de asignación."
    },
    evidenceBadge: {
      code: "MFT-INDEX",
      label: "MFT Master Record"
    }
  },
  {
    id: "inv-33-02",
    code: "33.02",
    title: "Clusters",
    subtitle: "Asignación en Logical Cluster Numbers LCN, Virtual Cluster Numbers VCN y holgura",
    targetMechanism: "Allocation Unit Geometry & Cluster Runs",
    targetComponent: "NTFS Storage Allocator",
    commandName: "fsutil.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué un archivo de texto de 10 caracteres ocupa 4096 bytes en tu disco? Por el tamaño mínimo de asignación del cluster (Slack Space).",
      mythVsTruth: {
        mentira: "El disco rígido puede guardar archivos en cualquier byte exacto que esté libre.",
        verdad: "NTFS solo asigna espacio en bloques atómicos de clusters (usualmente 4 KB = 8 sectores de 512 bytes). El espacio sobrante se desperdicia.",
        comprobalo: "Mira las propiedades de un archivo pequeño: compara 'Tamaño' (ej. 12 bytes) con 'Tamaño en disco' (4.096 bytes)."
      }
    },
    entende: {
      queEs: "La unidad mínima direccionable que NTFS utiliza para reservar espacio para el contenido de los archivos.",
      paraQueSirve: "Reducir el tamaño de las tablas de asignación agrupando múltiples sectores físicos en una sola dirección lógica (LCN).",
      quePasaSiFalta: "Un sistema de archivos con asignación por sector necesitaría tablas de mapeo 8 veces más grandes, colapsando la memoria RAM."
    },
    interactua: {
      cliExample: "fsutil file layout C:\\Windows\\notepad.exe",
      psExample: "Get-Item C:\\Windows\\notepad.exe | Select-Object Name, Length",
      syntaxBreakdown: "Vuelca el mapa completo de asignación de clusters (Data Runs) y atributos del archivo notepad.exe.",
      whatToLookFor: "Secuencias LCN (Logical Cluster Number) contiguas vs fragmentadas.",
      technicalMetrics: "Cluster estándar en volúmenes de sistema: 4096 bytes (4 KB). Soportado hasta 2 MB en volúmenes masivos."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura e inspección de geometría.",
      safetyWarning: "Cambiar el tamaño de cluster requiere reformatear la partición por completo."
    },
    evidenceBadge: {
      code: "ALLOC-LCN",
      label: "Cluster Geometry Mapped"
    }
  },
  {
    id: "inv-33-03",
    code: "33.03",
    title: "File Records",
    subtitle: "Estructura de cabecera FILE y atributos residentes vs no residentes",
    targetMechanism: "MFT Record Attribute Packaging",
    targetComponent: "NTFS Record Descriptors",
    commandName: "fsutil.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que si un archivo cabe dentro de su ficha de 1024 bytes en la MFT, NTFS ni siquiera va a buscarlo al disco? Lo lee directamente de la tabla en un solo acceso.",
      mythVsTruth: {
        mentira: "Todos los archivos tienen clusters asignados en el disco.",
        verdad: "Los archivos muy pequeños son 'Residentes': viven íntegramente dentro de su entrada MFT. Solo cuando crecen se convierten en 'No residentes' y piden clusters.",
        comprobalo: "Inspecciona con fsutil file layout: verás la etiqueta 'Atributo residente: Sí' en archivos diminutos."
      }
    },
    entende: {
      queEs: "La estructura binaria de 1 KB en la MFT compuesta por una cabecera 'FILE' seguida de una lista encadenada de atributos ($STANDARD_INFORMATION, $FILE_NAME, $DATA).",
      paraQueSirve: "Optimizar el rendimiento I/O al evitar operaciones de lectura secundarias para archivos pequeños y metadatos frecuentes.",
      quePasaSiFalta: "Cada lectura de un archivo de 20 bytes requeriría dos búsquedas de cabezal o lecturas de bloques separadas."
    },
    interactua: {
      cliExample: "fsutil file layout C:\\Windows\\win.ini",
      psExample: "Get-Content C:\\Windows\\win.ini -Head 5",
      syntaxBreakdown: "Analiza si el archivo win.ini almacena su flujo $DATA de manera residente en la MFT.",
      whatToLookFor: "Presencia del atributo 0x80 ($DATA) y si figura como Resident o Non-Resident.",
      technicalMetrics: "Cabecera FILE de 48 bytes, Magic Number 'FILE' (0x454C4946), número de secuencia para validar consistencia."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "No uses editores hexadecimales de disco en vivo sobre la MFT sin desmontar el volumen."
    },
    evidenceBadge: {
      code: "REC-RESIDENT",
      label: "File Record Architecture"
    }
  },
  {
    id: "inv-33-04",
    code: "33.04",
    title: "Metadata",
    subtitle: "Archivos metafísicos del sistema: $MFT, $LogFile, $Volume, $Bitmap y $BadClust",
    targetMechanism: "NTFS Internal Metadata Files",
    targetComponent: "NTFS System Inode Table",
    commandName: "fsutil.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué en NTFS no se puede crear un archivo que empiece con signo de dólar como $MFT? Porque los primeros 16 registros de la MFT están reservados para los órganos vitales del sistema.",
      mythVsTruth: {
        mentira: "Los archivos que empiezan con $ son archivos temporales de Word o virus.",
        verdad: "Son los archivos del sistema operativo que definen el mapa de clusters libres ($Bitmap), el log de transacciones ($LogFile) y los sectores dañados ($BadClust).",
        comprobalo: "Ejecuta fsutil fsinfo ntfsinfo: verás los números de cluster de $MFT y $MFTMirr."
      }
    },
    entende: {
      queEs: "El conjunto de archivos especiales invisibles en el Explorador que NTFS utiliza para administrarse a sí mismo como si fuera un volumen de base de datos.",
      paraQueSirve: "Garantizar transaccionalidad ($LogFile registra cada cambio antes de aplicarlo para que un corte de luz nunca rompa la consistencia).",
      quePasaSiFalta: "Cualquier apagón repentino requeriría horas de chkdsk para reconstruir la integridad del disco."
    },
    interactua: {
      cliExample: "fsutil dirty query C:",
      psExample: "Get-CimInstance Win32_Volume -Filter \"DriveLetter='C:'\" | Select-Object Dirty",
      syntaxBreakdown: "Verifica si el volumen C: tiene encendido el 'Dirty Bit', indicando que el $LogFile detectó un desmontaje sucio pendiente de verificación.",
      whatToLookFor: "El volumen no está sucio (Volume is clean).",
      technicalMetrics: "Registro 0: $MFT, Registro 1: $MFTMirr, Registro 2: $LogFile, Registro 6: $Bitmap, Registro 8: $BadClust."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "El comando fsutil dirty set C: forzará un análisis chkdsk obligatorio en el próximo arranque."
    },
    evidenceBadge: {
      code: "NTFS-META",
      label: "System Metadata Inodes"
    }
  },
  {
    id: "inv-33-05",
    code: "33.05",
    title: "ACL",
    subtitle: "Access Control Lists: DACL de permisos y SACL de auditoría en $SECURITY_DESCRIPTOR",
    targetMechanism: "Discretionary & System Access Control Lists",
    targetComponent: "Se* / icacls.exe / $Secure",
    commandName: "icacls.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Qué significa (OI)(CI)(F) cuando miras los permisos de una carpeta con icacls? Es la codificación de herencia de objetos y control total en la DACL.",
      mythVsTruth: {
        mentira: "Si le das permiso a un usuario en una carpeta, sus archivos heredan el permiso automáticamente por defecto siempre.",
        verdad: "La herencia depende de los flags (OI) Object Inherit y (CI) Container Inherit; si se rompe la cadena de herencia, los archivos quedan inaccesibles.",
        comprobalo: "Usa icacls C:\\Windows para ver la jerarquía de descriptores de seguridad heredados."
      }
    },
    entende: {
      queEs: "La estructura binaria almacenada en el atributo $SECURITY_DESCRIPTOR que lista quién puede acceder al archivo (DACL) y qué eventos deben registrarse en la bitácora de seguridad (SACL).",
      paraQueSirve: "Imponer permisos granulares (lectura, escritura, ejecución, borrado, cambio de permisos) por usuario o grupo.",
      quePasaSiFalta: "Cualquier usuario de la red podría leer o sobreescribir los documentos confidenciales de cualquier otro usuario."
    },
    interactua: {
      cliExample: "icacls C:\\Windows\\System32\\calc.exe",
      psExample: "Get-Acl C:\\Windows\\System32\\calc.exe | Select-Object -ExpandProperty AccessToString",
      syntaxBreakdown: "Lista las ACEs (Access Control Entries) que componen la DACL de la calculadora de Windows.",
      whatToLookFor: "Permisos de 'NT SERVICE\\TrustedInstaller:F' (Control total) y 'BUILTIN\\Users:RX' (Solo lectura y ejecución).",
      technicalMetrics: "Identificadores de seguridad SID mapeados a máscaras de bits ACCESS_MASK de 32 bits."
    },
    alertaEVO: {
      reversibilityRule: "icacls /save C:\\backup.acl /restore permite respaldar y restaurar la totalidad de permisos de un árbol de carpetas.",
      safetyWarning: "No ejecutes icacls /reset en C:\\Windows; eliminará permisos de servicio críticos inutilizando el sistema."
    },
    evidenceBadge: {
      code: "SEC-DACL",
      label: "Access Control List Verified"
    }
  },
  {
    id: "inv-33-06",
    code: "33.06",
    title: "SID",
    subtitle: "Security Identifiers: S-1-5-21-..., identificadores únicos inmutables de cuentas y grupos",
    targetMechanism: "NT Security Principals & SID Architecture",
    targetComponent: "LSA / SAM / Active Directory",
    commandName: "whoami.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué cuando borras un usuario y creas otro con exactamente el mismo nombre, Windows no le da acceso a los archivos del anterior? Porque Windows no sabe tu nombre: solo conoce tu SID.",
      mythVsTruth: {
        mentira: "Windows guarda el nombre 'Juan' en los permisos de los archivos.",
        verdad: "Windows solo guarda cadenas numéricas de 128 bits como S-1-5-21-3979...; si borras a Juan, su SID desaparece para siempre.",
        comprobalo: "Mira carpetas viejas tras reinstalar Windows: verás permisos asignados a 'Cuenta desconocida (S-1-5-21...)'."
      }
    },
    entende: {
      queEs: "Un valor binario de longitud variable que identifica de manera única a un usuario, grupo o equipo en todo el mundo y a lo largo del tiempo.",
      paraQueSirve: "Prevenir que una cuenta nueva herede accidentalmente los permisos de una cuenta eliminada que tenía el mismo nombre.",
      quePasaSiFalta: "Un atacante podría renombrar su cuenta para usurpar automáticamente los accesos de un administrador."
    },
    interactua: {
      cliExample: "whoami /user",
      psExample: "Get-LocalUser | Select-Object Name, SID, Enabled",
      syntaxBreakdown: "Muestra el nombre de usuario de la sesión actual y su identificador de seguridad SID inmutable.",
      whatToLookFor: "Prefijo de revisión (S-1), autoridad (5 = NT Authority) y el RID final (ej. 500 = Administrador integrado; >= 1000 = usuarios creados).",
      technicalMetrics: "Estructura SID: Revision (8b) + SubAuthorityCount (8b) + IdentifierAuthority (48b) + SubAuthorities (32b cada una)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "No intentes modificar SIDs en el Registro; los SIDs son generados criptográficamente por la LSA y no pueden editarse."
    },
    evidenceBadge: {
      code: "SEC-SID",
      label: "Security Principal SID"
    }
  },
  {
    id: "inv-33-07",
    code: "33.07",
    title: "Owner",
    subtitle: "Propietario del objeto NTFS y el privilegio especial SeTakeOwnershipPrivilege",
    targetMechanism: "Object Ownership & Security Descriptors",
    targetComponent: "takeown.exe / icacls.exe",
    commandName: "takeown.exe",
    riskLevel: "MODIFIES_STATE",
    descubri: {
      hook: "¿Puede una carpeta quitarle todos los permisos al Administrador para que no pueda entrar? Sí. Pero el Administrador tiene un superpoder de kernel: tomar posesión (Take Ownership).",
      mythVsTruth: {
        mentira: "Si una carpeta dice 'Acceso denegado', ningún usuario en esa máquina puede abrirla jamás.",
        verdad: "Quien tiene el privilegio SeTakeOwnershipPrivilege puede declararse dueño del objeto y reescribir la DACL a su voluntad.",
        comprobalo: "Usa takeown /f carpeta para cambiar el propietario del archivo a tu cuenta de usuario."
      }
    },
    entende: {
      queEs: "El campo dentro del descriptor de seguridad de NTFS que define qué usuario es el 'dueño' legítimo del recurso.",
      paraQueSirve: "Garantizar que siempre exista una vía legal de recuperación administrativa para objetos cuyos permisos hayan quedado rotos o huérfanos.",
      quePasaSiFalta: "Un error de configuración de permisos bloquearía carpetas para siempre obligando a formatear el disco."
    },
    interactua: {
      cliExample: "takeown /f C:\\Temp\\archivo_bloqueado.txt",
      psExample: "Get-Acl C:\\Windows\\System32\\notepad.exe | Select-Object Owner",
      syntaxBreakdown: "Asigna la propiedad del archivo al usuario que ejecuta el comando o consulta el dueño actual.",
      whatToLookFor: "Propietarios legítimos del sistema como 'NT SERVICE\\TrustedInstaller' vs cuentas locales.",
      technicalMetrics: "Campo Owner SID de 32 bits dentro del Security Descriptor del atributo 0x50 en la MFT."
    },
    alertaEVO: {
      reversibilityRule: "Tomar propiedad cambia el metadato permanentemente. Se debe restaurar a TrustedInstaller si se modifica un archivo del sistema.",
      safetyWarning: "Quitarle la propiedad a TrustedInstaller en archivos del sistema desactiva las actualizaciones automáticas de Windows Update sobre ese binario."
    },
    evidenceBadge: {
      code: "SEC-OWNER",
      label: "Object Ownership Control"
    }
  },
  {
    id: "inv-33-08",
    code: "33.08",
    title: "Alternate Data Streams",
    subtitle: "ADS - Atributos $DATA nombrados, marcas de Zona y flujos secundarios",
    targetMechanism: "Named $DATA Attributes in NTFS",
    targetComponent: "streams.exe / dir /R",
    commandName: "dir /R",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Sabías que puedes escribir un mensaje secreto dentro de un archivo de texto sin cambiar su tamaño en bytes ni su contenido original usando `archivo.txt:secreto.txt`?",
      mythVsTruth: {
        mentira: "El comando dir normal te muestra todo lo que hay dentro de una carpeta.",
        verdad: "dir oculta los flujos alternativos; solo el parámetro dir /R revela los flujos secundarios adjuntos a cada archivo.",
        comprobalo: "Abre CMD y escribe dir /R en tu carpeta de Descargas: verás :Zone.Identifier:$DATA en cada archivo bajado de la web."
      }
    },
    entende: {
      queEs: "La capacidad de NTFS de almacenar más de un flujo de datos dentro de un único registro de archivo, separándolos con dos puntos (archivo:flujo).",
      paraQueSirve: "Almacenar metadatos del navegador (ZoneId=3), miniaturas de imágenes y compatibilidad con bifurcaciones de recursos de macOS (Resource Forks).",
      quePasaSiFalta: "Windows no podría recordar qué ejecutables descargaste de Internet para mostrar la advertencia de seguridad de SmartScreen."
    },
    interactua: {
      cliExample: "dir /R C:\\Users\\Public\\Downloads",
      psExample: "Get-Item * -Stream * | Select-Object Filename, Stream, Length",
      syntaxBreakdown: "Lista todos los flujos de datos primarios y alternativos con su longitud en bytes.",
      whatToLookFor: "Flujos :Zone.Identifier:$DATA con tamaño de 26 a 120 bytes.",
      technicalMetrics: "Atributos tipo 0x80 ($DATA) con AttributeNameLength > 0 en el registro MFT."
    },
    alertaEVO: {
      reversibilityRule: "Copiar un archivo a una partición FAT32 o exFAT destruye automáticamente todos los flujos alternativos (ADS).",
      safetyWarning: "Malware avanzado utiliza ADS para ocultar código ejecutable que muchos antivirus básicos no analizan."
    },
    evidenceBadge: {
      code: "ADS-STREAM",
      label: "Alternate Data Streams"
    }
  },
  {
    id: "inv-33-09",
    code: "33.09",
    title: "Junctions",
    subtitle: "Puntos de unión NTFS a directorios locales mediante reparse points",
    targetMechanism: "NTFS Directory Junctions (IO_REPARSE_TAG_MOUNT_POINT)",
    targetComponent: "mklink.exe /J",
    commandName: "mklink /J",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Por qué programas antiguos de Windows XP que buscan 'C:\\Documents and Settings' siguen funcionando en Windows 11? Porque esa carpeta es un Junction hacia 'C:\\Users'.",
      mythVsTruth: {
        mentira: "C:\\Documents and Settings es una carpeta real duplicada que gasta espacio.",
        verdad: "Es un punto de unión invisible de 0 bytes que redirige instantáneamente al kernel hacia C:\\Users sin duplicar ningún dato.",
        comprobalo: "Ejecuta dir /AL C:\\: verás que Documents and Settings figura como <JUNCTION> [C:\\Users]."
      }
    },
    entende: {
      queEs: "Un objeto de directorio especial que contiene un Reparse Point que le indica al subsistema de archivos que redirija las solicitudes a otro directorio local.",
      paraQueSirve: "Mantener compatibilidad con software legado y mover carpetas pesadas a discos secundarios sin romper la configuración de los programas.",
      quePasaSiFalta: "Mover los juegos o carpetas de usuario a otro disco requeriría reinstalar los programas o rompería sus accesos directos."
    },
    interactua: {
      cliExample: "dir /AL C:\\",
      psExample: "Get-ChildItem C:\\ -Force | Where-Object { $_.LinkType -eq 'Junction' } | Select-Object Name, Target",
      syntaxBreakdown: "Lista todos los puntos de unión (Junctions) en la raíz del sistema y sus destinos reales.",
      whatToLookFor: "Junctions clásicas de compatibilidad como 'Archivos de programa' o 'Documents and Settings'.",
      technicalMetrics: "Tag de reanálisis 0xA0000003 (IO_REPARSE_TAG_MOUNT_POINT) con buffer REPARSE_DATA_BUFFER."
    },
    alertaEVO: {
      reversibilityRule: "Eliminar un Junction con rmdir no borra los archivos de la carpeta destino.",
      safetyWarning: "No uses herramientas de borrado recursivo agresivas de terceros; algunas podrían seguir el enlace y borrar el contenido real."
    },
    evidenceBadge: {
      code: "NTFS-JUNCT",
      label: "Directory Junction Active"
    }
  },
  {
    id: "inv-33-10",
    code: "33.10",
    title: "Symbolic Links",
    subtitle: "Enlaces simbólicos relativos/absolutos con flag symlink y compatibilidad POSIX",
    targetMechanism: "NTFS Symbolic Links (IO_REPARSE_TAG_SYMLINK)",
    targetComponent: "mklink /D",
    commandName: "mklink",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Cuál es la diferencia entre un acceso directo (.lnk) y un enlace simbólico? Un acceso directo es solo un archivo que el Explorador entiende; un Symlink engaña al propio kernel.",
      mythVsTruth: {
        mentira: "Un archivo .lnk y un Symlink son la misma cosa.",
        verdad: "Un Symlink es transparente a nivel de API de bajo nivel: scripts de PowerShell, Python o juegos creen que están leyendo el archivo original en esa ruta.",
        comprobalo: "Abre un Symlink desde consola: funciona como el archivo real, mientras que un .lnk solo muestra su texto binario."
      }
    },
    entende: {
      queEs: "Un archivo o directorio especial de NTFS que contiene una referencia textual a otra ruta en el sistema de archivos (local o remota vía red SMB).",
      paraQueSirve: "Estructurar dependencias complejas de software, librerías compartidas y desarrollo multiplataforma compatible con Linux/POSIX.",
      quePasaSiFalta: "Los entornos de desarrollo modernos como Node.js o Git no podrían gestionar módulos compartidos sin duplicar gigabytes de librerías."
    },
    interactua: {
      cliExample: "mklink /D C:\\Enlace C:\\Destino",
      psExample: "Get-ChildItem -Path C:\\ -Attributes ReparsePoint | Select-Object Name, LinkType, Target",
      syntaxBreakdown: "Crea un enlace simbólico de directorio o lista los puntos de enlace existentes.",
      whatToLookFor: "Enlaces relativos vs absolutos y si apuntan a rutas de red UNC.",
      technicalMetrics: "Tag de reanálisis 0xA000000C (IO_REPARSE_TAG_SYMLINK)."
    },
    alertaEVO: {
      reversibilityRule: "Borrar el enlace con del o rmdir solo destruye el puntero, no el destino.",
      safetyWarning: "Crear enlaces simbólicos requiere privilegios de Administrador o el 'Modo Desarrollador' de Windows activo."
    },
    evidenceBadge: {
      code: "NTFS-SYMLINK",
      label: "Symbolic Link Engine"
    }
  },
  {
    id: "inv-33-11",
    code: "33.11",
    title: "Hard Links",
    subtitle: "Múltiples entradas de directorio que apuntan al mismo registro $MFT sin duplicar datos",
    targetMechanism: "Hard Link Directory Entries ($FILE_NAME Attributes)",
    targetComponent: "mklink /H / fsutil hardlink",
    commandName: "fsutil hardlink",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué la carpeta C:\\Windows\\WinSxS parece ocupar 20 GB pero si la borras no liberas casi nada de espacio? Porque sus archivos son Hard Links compartidos con System32.",
      mythVsTruth: {
        mentira: "Dos archivos con nombres distintos siempre ocupan el doble de espacio en disco.",
        verdad: "Dos Hard Links son dos nombres para exactamente el mismo registro MFT y los mismos clusters físicos; ocupan exactamente 0 bytes adicionales.",
        comprobalo: "Usa fsutil hardlink list C:\\Windows\\System32\\notepad.exe: verás que existe en múltiples rutas a la vez."
      }
    },
    entende: {
      queEs: "Una entrada de directorio adicional que referencia un registro de archivo ya existente en la MFT del mismo volumen.",
      paraQueSirve: "Permitir que el almacén de componentes de Windows (WinSxS) conserve versiones de respaldo de drivers y DLLs sin duplicar el consumo en el SSD.",
      quePasaSiFalta: "Windows ocuparía más de 60 GB de disco solo para mantener el almacén de componentes y actualizaciones."
    },
    interactua: {
      cliExample: "fsutil hardlink list C:\\Windows\\System32\\notepad.exe",
      psExample: "(Get-Item C:\\Windows\\System32\\notepad.exe).LinkType",
      syntaxBreakdown: "Lista todas las rutas de archivo que comparten el mismo registro MFT en el volumen.",
      whatToLookFor: "Múltiples apariciones en C:\\Windows\\System32 y C:\\Windows\\WinSxS.",
      technicalMetrics: "Campo ReferenceCount en la cabecera del registro MFT; el archivo solo se borra físicamente cuando ReferenceCount = 0."
    },
    alertaEVO: {
      reversibilityRule: "Modificar un Hard Link modifica el contenido en todas sus rutas compartidas inmediatamente.",
      safetyWarning: "No intentes 'limpiar' WinSxS borrando archivos a mano; destruirás los enlaces duros de System32."
    },
    evidenceBadge: {
      code: "NTFS-HARDLNK",
      label: "Hard Link Shared Record"
    }
  },
  {
    id: "inv-33-12",
    code: "33.12",
    title: "Reparse Points",
    subtitle: "Puntos de reanálisis: OneDrive Files On-Demand, puntos de montaje y WIMBoot",
    targetMechanism: "NTFS Reparse Point Architecture",
    targetComponent: "IO_REPARSE_TAG Subsystem / Cloud Filter API",
    commandName: "fsutil reparsepoint",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo hace OneDrive para mostrarte 1 TB de archivos con el icono de la nubecita ocupando solo 10 MB en tu disco local? Gracias a los Reparse Points de NTFS.",
      mythVsTruth: {
        mentira: "Los archivos de la nube en OneDrive son accesos directos de Internet comunes.",
        verdad: "Son archivos NTFS reales con un Reparse Point de Cloud Filter (cldflt.sys); cuando una app los abre, el driver pausa el IRP y descarga el bloque en tiempo real.",
        comprobalo: "Ejecuta fsutil reparsepoint query sobre un archivo de OneDrive que esté en estado 'Solo en línea'."
      }
    },
    entende: {
      queEs: "Un bloque de datos definidos por el usuario de hasta 16 KB adjunto a un archivo que hace que el sistema de archivos dispare un controlador de filtro específico (Filter Driver) al abrirlo.",
      paraQueSirve: "Implementar almacenamiento en la nube transparente (Files On-Demand), desduplicación de datos de Windows Server y puntos de montaje de volúmenes.",
      quePasaSiFalta: "Para abrir un archivo de la nube tendrías que ir manualmente a un navegador web y descargarlo antes de poder usarlo."
    },
    interactua: {
      cliExample: "fsutil reparsepoint query C:\\Users",
      psExample: "Get-ChildItem C:\\Users -Force | Where-Object { $_.Attributes -match 'ReparsePoint' } | Select-Object Name",
      syntaxBreakdown: "Consulta el identificador de etiqueta GUID del punto de reanálisis del archivo.",
      whatToLookFor: "Etiquetas como IO_REPARSE_TAG_CLOUD o IO_REPARSE_TAG_DEDUP.",
      technicalMetrics: "Estructura REPARSE_GUID_DATA_BUFFER con ReparseTag de 32 bits único registrado ante Microsoft."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Eliminar un punto de reanálisis con fsutil reparsepoint delete rompe la sincronización con el proveedor de la nube."
    },
    evidenceBadge: {
      code: "REPARSE-PT",
      label: "Reparse Point Filter"
    }
  },
  {
    id: "inv-33-13",
    code: "33.13",
    title: "Por qué un archivo puede “estar” sin aparecer en Explorer",
    subtitle: "Atributos ocultos, flujos secundarios, permisos denegados y nombres reservados de dispositivo",
    targetMechanism: "File Concealment & Explorer Namespace Filtering",
    targetComponent: "Shell32 / Win32 Namespace Filtering",
    commandName: "dir /A /R",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Puede existir un archivo que el Explorador no muestre, que el antivirus no vea y que no se pueda borrar? Sí, si su nombre viola las reglas de la API de Win32.",
      mythVsTruth: {
        mentira: "Si el Explorador de Windows con 'Mostrar archivos ocultos' está activo, ves todo lo que hay en el disco.",
        verdad: "El Explorador filtra nombres reservados (CON, NUL, AUX), flujos alternativos (ADS) y archivos donde tu usuario no tenga permiso de listar directorio (Read Extended Attributes).",
        comprobalo: "Usa la sintaxis de kernel \\\\?\\C:\\ para acceder a archivos con nombres reservados que el Explorador rechaza."
      }
    },
    entende: {
      queEs: "El conjunto de discrepancias entre lo que la interfaz gráfica de usuario muestra y lo que el motor de bajo nivel de NTFS realmente tiene almacenado en su MFT.",
      paraQueSirve: "Proteger archivos críticos del sistema contra borrado accidental por usuarios domésticos y mantener la compatibilidad con nombres DOS de hace 40 años.",
      quePasaSiFalta: "Un usuario inexperto podría borrar archivos de paginación o bases de datos de seguridad pensando que son basura."
    },
    interactua: {
      cliExample: "dir /A /R /S C:\\Users\\Public",
      psExample: "Get-ChildItem -Path C:\\Users\\Public -Force -Recurse | Select-Object FullName, Attributes",
      syntaxBreakdown: "Lista forzosamente todos los archivos ocultos, de sistema y sus flujos alternativos en una ruta.",
      whatToLookFor: "Archivos con atributos System + Hidden (Super-Hidden) o nombres con espacios al final creados por scripts.",
      technicalMetrics: "Diferencia de API: capa Win32 (MAX_PATH = 260) vs capa nativa de NT (Unicode con hasta 32.767 caracteres con prefijo \\\\?\\)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "No intentes renombrar archivos del sistema con nombres reservados; podrías bloquear el arranque de servicios."
    },
    evidenceBadge: {
      code: "NTFS-STEALTH",
      label: "Filesystem Stealth Audit"
    }
  }
];

export const SECTOR_33_MINICASES: Sector33MiniCase[] = [
  {
    id: "case-33-01",
    code: "MC-33.1",
    title: "El disco que decía tener 0 bytes libres pero la suma de archivos ocupaba la mitad",
    scenario: "Un disco SSD de 500 GB mostraba la barra en rojo con '0 bytes libres de 476 GB'. El usuario seleccionó todos los archivos de C:\\ (incluyendo ocultos y de sistema) y las propiedades sumaban apenas 220 GB. Faltaban más de 250 GB de espacio invisible.",
    userStatement: "El disco está lleno pero mis archivos no ocupan ni la mitad. ¿Tengo un virus que me roba espacio?",
    initialMistake: "Pasar un desinstalador de aplicaciones o culpar a malware.",
    diagnosticQuestion: "¿Qué estructura de NTFS o servicio de Windows está reteniendo ese espacio invisible?",
    options: [
      {
        id: "opt-1",
        text: "Copias de sombra de volumen (VSS / Shadow Copies) y la carpeta protegida 'System Volume Information' con cuota desbordada.",
        isCorrect: true,
        explanation: "¡Exacto! El servicio Volume Snapshot Service (VSS) almacena puntos de restauración y copias de sombra en 'System Volume Information'. El Explorador no tiene permisos para leer esa carpeta y reporta 0 bytes. Con 'vssadmin list shadowstorage' se descubrió que VSS tenía asignados 250 GB de límite máximo."
      },
      {
        id: "opt-2",
        text: "Los clusters del SSD se magnetizaron por calor.",
        isCorrect: false,
        explanation: "Los SSDs usan celdas de memoria flash NAND, no magnetismo, y los fallos de celdas no ocultan espacio visible en el sistema de archivos."
      },
      {
        id: "opt-3",
        text: "La papelera de reciclaje tiene un límite de 10 MB.",
        isCorrect: false,
        explanation: "La papelera de reciclaje muestra su tamaño en las propiedades de la unidad y no oculta 250 GB sin reportarlo."
      }
    ],
    technicalVerdict: "Se ejecutó 'vssadmin resize shadowstorage /for=C: /on=C: /maxsize=20GB' y se liberaron 230 GB en 3 segundos.",
    lessonLearned: "El espacio fantasma en NTFS casi siempre reside en System Volume Information (VSS) o en la zona reservada de la MFT."
  },
  {
    id: "case-33-02",
    code: "MC-33.2",
    title: "El script descargado de GitHub que fallaba con 'Archivo bloqueado'",
    scenario: "Un administrador descargó un conjunto de scripts .ps1 y DLLs corporativas desde un repositorio web. Al ejecutarlos en PowerShell, recibía: 'No se puede cargar el archivo porque la ejecución de scripts está deshabilitada o el archivo proviene de una ubicación no confiable'.",
    userStatement: "Tengo la política de PowerShell en Unrestricted y sigo sin poder ejecutar los scripts descargados.",
    initialMistake: "Desactivar el antivirus o ejecutar PowerShell como Administrador sin resolver la marca del archivo.",
    diagnosticQuestion: "¿Qué metadato de NTFS está bloqueando la ejecución?",
    options: [
      {
        id: "opt-1",
        text: "El flujo alternativo (ADS) :Zone.Identifier:$DATA con ZoneId=3 adjunto por el navegador web al descargar el archivo.",
        isCorrect: true,
        explanation: "¡Perfecto! NTFS guarda la procedencia en un Alternate Data Stream. Al ejecutar 'Unblock-File *' o 'streams -d', se elimina el stream :Zone.Identifier y PowerShell permite la ejecución sin tocar las políticas de seguridad del equipo."
      },
      {
        id: "opt-2",
        text: "El archivo tiene atributos de compresión NTFS activos.",
        isCorrect: false,
        explanation: "La compresión NTFS es transparente para el software y no bloquea la ejecución de scripts."
      },
      {
        id: "opt-3",
        text: "El disco tiene errores de tabla de partición GPT.",
        isCorrect: false,
        explanation: "Los errores de tabla GPT impedirían el arranque del sistema, no la ejecución de un archivo específico."
      }
    ],
    technicalVerdict: "Flujo alternativo Zone.Identifier eliminado recursivamente con Unblock-File.",
    lessonLearned: "La seguridad web de Windows no vive en el registro: viaja dentro de los Alternate Data Streams de NTFS."
  },
  {
    id: "case-33-03",
    code: "MC-33.3",
    title: "El intento de borrado de la carpeta WinSxS que destruyó Windows",
    scenario: "Un usuario notó que C:\\Windows\\WinSxS pesaba 18 GB. Decidió tomar posesión con takeown y borrarla a la fuerza para ahorrar espacio en su disco SSD pequeño. Al reiniciar, el sistema arrojó INACCESSIBLE_BOOT_DEVICE y no volvió a arrancar.",
    userStatement: "Borré una carpeta de respaldo que ocupaba 18 GB y ahora Windows no inicia.",
    initialMistake: "Creer que WinSxS es una copia duplicada descartable en vez del almacén canónico de Hard Links.",
    diagnosticQuestion: "¿Por qué el borrado manual de WinSxS destruye Windows?",
    options: [
      {
        id: "opt-1",
        text: "Porque los archivos en C:\\Windows\\System32 son en realidad Hard Links hacia WinSxS; al borrar WinSxS se eliminaron físicamente las DLLs y drivers esenciales del sistema operativo.",
        isCorrect: true,
        explanation: "¡Exacto! En la arquitectura de Windows moderno, WinSxS es el ÚNICO lugar donde residen físicamente los binarios; lo que ves en System32 son solo enlaces duros (Hard Links) que apuntan al mismo registro MFT. Borrar WinSxS deja a System32 vacío de contenido real."
      },
      {
        id: "opt-2",
        text: "Porque WinSxS contiene la contraseña de la BIOS de la computadora.",
        isCorrect: false,
        explanation: "La BIOS reside en un chip NVRAM de la placa madre y no tiene ninguna relación con el filesystem."
      },
      {
        id: "opt-3",
        text: "Porque el SSD se bloquea automáticamente al borrar más de 10 GB de golpe.",
        isCorrect: false,
        explanation: "Los discos no bloquean el arranque por volumen de borrado de archivos."
      }
    ],
    technicalVerdict: "Corrupción total de enlaces duros de System32 que requirió restauración desde imagen de backup.",
    lessonLearned: "WinSxS nunca se borra a mano: solo se optimiza con DISM /Online /Cleanup-Image /StartComponentCleanup."
  }
];

export const SECTOR_33_TEST_BANK: Sector33TestQuestion[] = [
  {
    id: "q33-01",
    questionNumber: 1,
    category: "Arquitectura NTFS y MFT",
    question: "En el sistema de archivos NTFS, ¿cuál es el tamaño fijo estándar de cada registro de archivo en la Master File Table ($MFT)?",
    options: [
      { id: "A", text: "512 bytes" },
      { id: "B", text: "1024 bytes (1 KB)" },
      { id: "C", text: "4096 bytes (4 KB)" },
      { id: "D", text: "64 KB" }
    ],
    correctOptionId: "B",
    technicalExplanation: "Cada entrada de la MFT tiene un tamaño exacto y predeterminado de 1024 bytes (1 KB), comenzando con la firma binaria 'FILE' y empaquetando cabecera y atributos residentes."
  },
  {
    id: "q33-02",
    questionNumber: 2,
    category: "Archivos Residentes",
    question: "¿Qué condición debe cumplirse para que un archivo en NTFS sea clasificado como 'Residente'?",
    options: [
      { id: "A", text: "El archivo debe tener el atributo de Solo Lectura activado." },
      { id: "B", text: "El tamaño del archivo y sus metadatos deben caber completamente dentro del espacio disponible del registro de 1024 bytes en la MFT, sin requerir clusters externos." },
      { id: "C", text: "El archivo debe haber sido creado hace más de 30 días." },
      { id: "D", text: "El archivo debe estar ubicado exclusivamente en la raíz C:\\." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Si los datos del flujo $DATA caben en el espacio sobrante del registro MFT de 1 KB (generalmente menos de 700 bytes), se guardan de forma 'Residente', lo que acelera enormemente la lectura."
  },
  {
    id: "q33-03",
    questionNumber: 3,
    category: "Alternate Data Streams",
    question: "¿Qué comando nativo de la consola de Windows (CMD) permite listar todos los flujos alternativos (ADS) de los archivos en un directorio?",
    options: [
      { id: "A", text: "dir /W" },
      { id: "B", text: "dir /R" },
      { id: "C", text: "attrib /S" },
      { id: "D", text: "tree /F" }
    ],
    correctOptionId: "B",
    technicalExplanation: "El parámetro /R del comando `dir` le indica a la consola que enumere y muestre todos los flujos de datos alternativos (ej. archivo.exe:Zone.Identifier:$DATA) junto con su tamaño."
  },
  {
    id: "q33-04",
    questionNumber: 4,
    category: "Hard Links vs Symlinks",
    question: "¿Cuál es una limitación fundamental de los Hard Links (enlaces duros) en NTFS comparados con los Symbolic Links (enlaces simbólicos)?",
    options: [
      { id: "A", text: "Los Hard Links solo pueden crearse entre archivos ubicados dentro del mismo volumen o partición NTFS; no pueden cruzar unidades ni crearse hacia carpetas." },
      { id: "B", text: "Los Hard Links requieren que la computadora tenga conexión a Internet activa." },
      { id: "C", text: "Los Hard Links se borran solos al reiniciar la máquina." },
      { id: "D", text: "Los Hard Links no pueden contener ejecutables .exe." }
    ],
    correctOptionId: "A",
    technicalExplanation: "Dado que un Hard Link es simplemente otra entrada de directorio que apunta al mismo número de registro MFT del volumen local, no puede apuntar a otra partición ni aplicarse a directorios."
  },
  {
    id: "q33-05",
    questionNumber: 5,
    category: "Reparse Points",
    question: "¿Cómo utiliza OneDrive la tecnología de Reparse Points de NTFS para su función 'Files On-Demand' (Archivos a petición)?",
    options: [
      { id: "A", text: "Crea archivos .zip temporales para cada archivo." },
      { id: "B", text: "Asigna una etiqueta de reanálisis (IO_REPARSE_TAG_CLOUD) al archivo con tamaño 0 en disco; cuando un programa lo abre, el filtro cldflt.sys intercepta la llamada y descarga el bloque de datos en tiempo real." },
      { id: "C", text: "Mueve todos los archivos a la papelera de reciclaje hasta que se necesitan." },
      { id: "D", text: "Desactiva la indexación de búsqueda de Windows." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Los archivos en la nube son Reparse Points gobernados por el Cloud Filter API. El archivo existe en la MFT con sus metadatos reales, pero su contenido se recupera bajo demanda sin consumir espacio local previo."
  }
];
