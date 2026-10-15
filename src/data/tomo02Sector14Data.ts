// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 14: RECUPERACIÓN DE ARCHIVOS // ¿EL ARCHIVO DESAPARECIÓ O TODAVÍA EXISTE?

export type RiskLevelSector14 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector14Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector14;
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

export interface Sector14MiniCase {
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

export interface Sector14TestQuestion {
  id: string;
  questionNumber: number;
  category: 'NTFS_MFT_Y_METADATOS' | 'PAPELERA_Y_BORRADO_LOGICO' | 'TRIM_SSD_VS_HDD' | 'HERRAMIENTAS_Y_PROTOCOLOS';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_14_INVESTIGATIONS: Sector14Investigation[] = [
  {
    id: 'sec-14-01',
    code: '14.01',
    title: 'Delete',
    subtitle: 'Eliminación lógica standard en Explorer: desvinculación de punteros y marcado de espacio',
    targetMechanism: 'NTFS File Deletion Protocol / IRP_MJ_SET_INFORMATION (FileDispositionInformation)',
    targetComponent: 'File System Driver (Ntfs.sys)',
    commandName: 'del / Erase / Remove-Item',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Al presionar "Suprimir" en un archivo en Windows, no se borra ni un solo byte de su contenido: únicamente se envía una solicitud para mover el puntero o marcar los clusters como reutilizables.',
      mythVsTruth: {
        mentira: 'Cuando Windows "borra" un archivo, sobreescribe sus datos con ceros o los destruye físicamente de la unidad.',
        verdad: 'Windows simplemente altera los metadatos del sistema de archivos. Los sectores físicos retienen intacta la carga útil (payload) hasta que otra operación de escritura los reclame.',
        comprobalo: 'Eliminá un archivo de 500 MB en una partición secundaria: notarás que la operación tarda 2 milisegundos porque no hay I/O masivo, solo una edición en la tabla de asignación.',
      },
    },
    entende: {
      queEs: 'La operación primitiva de borrado en sistemas operativos modernos. Consiste en alterar los atributos del archivo indicando que ya no forma parte del árbol de directorios visible.',
      paraQueSirve: 'Permitir al usuario o aplicaciones liberar espacio lógico sin incurrir en el costo computacional masivo de reescribir sectores en almacenamiento masivo.',
      quePasaSiFalta: 'Si los archivos exigieran borrado físico destructivo inmediato, cada eliminación tomaría segundos o minutos y degradaría prematuramente las celdas de silicio en unidades SSD.',
    },
    interactua: {
      cliExample: 'del /f /q C:\\Temp\\dummy_report.log',
      psExample: 'Remove-Item -Path "C:\\Temp\\dummy_report.log" -Force',
      syntaxBreakdown: 'del ejecuta una llamada a NtSetInformationFile pasando la estructura FILE_DISPOSITION_INFORMATION con DeleteFile = TRUE.',
      whatToLookFor: 'Verificar en Process Monitor el evento IRP_MJ_SET_INFORMATION con resultado SUCCESS sobre el FileObject de destino.',
      technicalMetrics: 'Latencia típica: < 0.8 ms en NVMe / < 4 ms en HDD SATA.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible mientras los clusters de datos no sean sobreescritos por nuevas escrituras del sistema operativo o aplicaciones.',
      safetyWarning: 'En unidades mecánicas la probabilidad de recuperación es altísima; en SSDs modernos con TRIM activo puede desplomarse a 0% en minutos.',
    },
    evidenceBadge: {
      code: 'DEL-LOGIC',
      label: 'BORRADO LÓGICO',
    },
  },
  {
    id: 'sec-14-02',
    code: '14.02',
    title: 'Recycle Bin',
    subtitle: 'La estructura forense de $Recycle.Bin: subcarpetas por SID y el par de archivos $I y $R',
    targetMechanism: 'Shell Recycle Bin Handler / $Recycle.Bin Metadata Container',
    targetComponent: 'C:\\$Recycle.Bin\\<User-SID>',
    commandName: 'dir /a /s C:\\$Recycle.Bin',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La Papelera de Reciclaje no es una papelera mágica: es una carpeta oculta del sistema en la raíz de cada volumen donde cada archivo es renombrado con el prefijo $R y sus metadatos guardados en un archivo $I.',
      mythVsTruth: {
        mentira: 'La papelera de reciclaje mueve físicamente todos los archivos a una sola carpeta común en el disco C:.',
        verdad: 'Cada volumen posee su propio directorio C:\\$Recycle.Bin o D:\\$Recycle.Bin. Mover a la papelera dentro del mismo volumen es un simple MOVE de metadatos, sin transferencia física entre discos.',
        comprobalo: 'Ejecutá "dir /a C:\\$Recycle.Bin" desde una consola con privilegios elevados para observar las carpetas que corresponden a los identificadores de seguridad (SID) de cada usuario.',
      },
    },
    entende: {
      queEs: 'Un búfer de contención de seguridad implementado a nivel de Shell de Windows para prevenir la pérdida involuntaria de archivos en unidades locales.',
      paraQueSirve: 'Guardar la ruta original, fecha de eliminación y tamaño del archivo en una estructura indexada ($I), asociándola al contenido real renombrado ($R).',
      quePasaSiFalta: 'Cualquier error humano al pulsar "Suprimir" desvincularía el archivo de forma irreversible para usuarios comunes sin herramientas forenses.',
    },
    interactua: {
      cliExample: 'dir /a /s C:\\$Recycle.Bin\\S-1-5-21-*',
      psExample: 'Get-ChildItem -Path "C:\\$Recycle.Bin" -Force -Recurse | Select-Object Name, Length, LastWriteTime',
      syntaxBreakdown: 'Cada archivo eliminado genera dos artefactos: $R<random_chars>.<ext> (contenido íntegro) y $I<random_chars>.<ext> (cabecera con ruta original y timestamp de 64 bits Windows FILETIME).',
      whatToLookFor: 'Archivos $I de 544 bytes (Windows 10/11) que contienen la ruta absoluta previa a la eliminación en Unicode UTF-16LE.',
      technicalMetrics: 'Estructura $I10/11: Offset 0x08 = Tamaño original (Int64), Offset 0x10 = Timestamp WinFileTime, Offset 0x18 = Longitud de cadena de ruta original.',
    },
    alertaEVO: {
      reversibilityRule: 'Completamente reversible mediante la acción "Restaurar" del explorador o renombrando manualmente $R a la ruta original recuperada de $I.',
      safetyWarning: 'Vaciar la papelera de reciclaje destruye los pares $I/$R y marca los clusters y registros MFT como libres.',
    },
    evidenceBadge: {
      code: 'RECYCLE-BIN',
      label: '$RECYCLE.BIN / SID',
    },
  },
  {
    id: 'sec-14-03',
    code: '14.03',
    title: 'Shift+Delete',
    subtitle: 'Bypass total de la papelera: desreferenciación directa en MFT y desasignación en $Bitmap',
    targetMechanism: 'Permanent Deletion Bypass / Fast Directory Unlink',
    targetComponent: 'Windows Shell / Ntfs.sys Record Deallocator',
    commandName: 'Shift + Supr / IRP_MJ_SET_INFORMATION',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Presionar Shift+Supr no borra con algoritmos militares: simplemente le indica al Shell que omita el movimiento a $Recycle.Bin y desasigne el registro de inmediato.',
      mythVsTruth: {
        mentira: 'Shift+Supr destruye los archivos de manera que nadie puede volver a verlos.',
        verdad: 'Shift+Supr solo saltea la papelera de reciclaje. Los datos continúan en el disco magnético o SSD en el instante exacto del borrado, accesibles para cualquier analizador de registros MFT.',
        comprobalo: 'Eliminá un archivo con Shift+Supr e inmediatamente ejecutá una lectura de MFT con WinFR o FTK Imager: el registro aparecerá marcado como "InUse = 0" pero con sus punteros intactos.',
      },
    },
    entende: {
      queEs: 'Un atajo del Shell que instruye al sistema operativo a desvincular inmediatamente el nombre del archivo de la jerarquía de directorios.',
      paraQueSirve: 'Eliminar elementos masivos o confidenciales sin ocupar la cuota máxima permitida de almacenamiento asignada a la papelera de reciclaje.',
      quePasaSiFalta: 'Archivos gigantes (ej. imágenes ISO de 40 GB) saturarían la papelera o requerirían confirmaciones continuas de saturación de cuota.',
    },
    interactua: {
      cliExample: 'rem Shift+Delete se ejecuta desde la interfaz gráfica o vía del /f sin papelera',
      psExample: 'Remove-Item -Path "D:\\Work\\project_draft.zip" -Force # Bypass nativo de papelera',
      syntaxBreakdown: 'El Shell invoca SHFileOperation con el flag FOF_ALLOWUNDO omitido, procediendo al borrado atómico en el driver de sistema de archivos.',
      whatToLookFor: 'En el registro MFT correspondiente al archivo, el bit 0x01 del campo Flags (Offset 0x16) cambia de 1 (En uso) a 0 (Libre).',
      technicalMetrics: 'Tiempo de retención de datos en clusters: Depende de la tasa de I/O de escritura del sistema y de la ejecución del comando TRIM.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible únicamente mediante software de recuperación que inspeccione registros MFT marcados como inactivos o talla de archivos (carving).',
      safetyWarning: 'Cualquier nueva descarga, actualización de Windows o archivo temporal puede sobreescribir los clusters liberados.',
    },
    evidenceBadge: {
      code: 'SHIFT-DEL',
      label: 'BYPASS PAPELERA',
    },
  },
  {
    id: 'sec-14-04',
    code: '14.04',
    title: 'Quick Format',
    subtitle: 'Formato rápido: recreación de estructuras básicas sin sobreescritura de sectores de datos',
    targetMechanism: 'Volume Initialization / VBR & MFT Skeleton Recreation',
    targetComponent: 'Format.com / Vds.exe / Ntfs.sys',
    commandName: 'format X: /fs:NTFS /q',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'Un formato rápido en un disco de 4 Terabytes tarda 4 segundos porque no borra los 4 TB: solo crea una nueva tabla MFT en blanco y limpia el mapa de bits.',
      mythVsTruth: {
        mentira: 'Un formateo rápido borra por completo el contenido del disco y deja los sectores en blanco.',
        verdad: 'Un formato rápido solo inicializa las estructuras maestras ($MFT, $Bitmap, $Volume). El 99.9% de los sectores de datos de los archivos anteriores siguen físicamente en los platos o celdas.',
        comprobalo: 'Formateá un pendrive en modo rápido con archivos previos y ejecutá PhotoRec o TestDisk: recuperarás el 100% de los datos porque los sectores no fueron tocados.',
      },
    },
    entende: {
      queEs: 'El proceso de preparar un volumen para su uso mediante la escritura de los metadatos esenciales del sistema de archivos, omitiendo la verificación de sectores defectuosos y la sobreescritura.',
      paraQueSirve: 'Reutilizar o cambiar el sistema de archivos de un volumen de forma casi instantánea.',
      quePasaSiFalta: 'Si todo formateo fuera completo, preparar un disco moderno tardaría entre 4 y 12 horas de I/O secuencial intensivo.',
    },
    interactua: {
      cliExample: 'format E: /fs:NTFS /q /y',
      psExample: 'Format-Volume -DriveLetter E -FileSystem NTFS -Full:$false',
      syntaxBreakdown: '/q indica Quick Format. Se escribe un nuevo Volume Boot Record (VBR), una $MFT inicial con los primeros 16 registros del sistema y se limpia $Bitmap.',
      whatToLookFor: 'Espacio utilizado inicial: 50-100 MB ocupados por estructuras de metadatos NTFS en una partición de gran tamaño.',
      technicalMetrics: 'Formato Rápido: escribe ~0.01% de la capacidad. Formato Completo (sin /q): sobreescribe cada sector con ceros a partir de Windows Vista.',
    },
    alertaEVO: {
      reversibilityRule: 'Altamente recuperable en discos mecánicos o pendrives mediante software de talla de datos (carving) o escaneo profundo de la MFT anterior huérfana.',
      safetyWarning: 'En unidades SSD SATA o NVMe, Windows puede emitir un comando TRIM a toda la partición durante el formato, haciendo la recuperación casi imposible.',
    },
    evidenceBadge: {
      code: 'QUICK-FMT',
      label: 'FORMATO RÁPIDO',
    },
  },
  {
    id: 'sec-14-05',
    code: '14.05',
    title: 'MFT',
    subtitle: 'Master File Table: registros de 1024 bytes, atributos residentes vs no residentes y secuencia',
    targetMechanism: 'NTFS Core Database / Inode Equivalent Architecture',
    targetComponent: '$MFT (Registro maestro de archivos NTFS)',
    commandName: 'fsutil file layout / nfi.exe',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En NTFS, absolutamente TODO es un archivo, incluso el registro maestro: la $MFT es un archivo especial donde cada elemento del disco tiene una entrada asignada de exactamente 1024 bytes.',
      mythVsTruth: {
        mentira: 'Los datos de un archivo siempre se guardan en sectores separados de la tabla del sistema de archivos.',
        verdad: 'Si un archivo mide menos de ~700 bytes, NTFS lo almacena directamente DENTRO del registro de 1024 bytes de la MFT como atributo $DATA residente, sin gastar ningún cluster externo.',
        comprobalo: 'Creá un archivo de texto de 50 bytes y ejecutá "fsutil file layout" sobre él: verás el flag "Resident: Yes".',
      },
    },
    entende: {
      queEs: 'La base de datos relacional interna del sistema de archivos NTFS donde se catalogan todos los archivos, carpetas, permisos de seguridad, marcas de tiempo y punteros a clusters.',
      paraQueSirve: 'Localizar cualquier archivo en microsegundos y permitir transaccionalidad mediante journaling con $LogFile para evitar corrupciones ante apagones repentinos.',
      quePasaSiFalta: 'Si la $MFT se corrompe por completo y su copia espejo ($MFTMirr) falla, el volumen se vuelve inaccesible y Windows lo muestra como formato RAW.',
    },
    interactua: {
      cliExample: 'fsutil file layout C:\\Windows\\notepad.exe',
      psExample: 'Get-Item C:\\Windows\\notepad.exe | Format-List *',
      syntaxBreakdown: 'fsutil file layout extrae los rangos LCN (Logical Cluster Number), VCN (Virtual Cluster Number), atributos $STANDARD_INFORMATION (0x10), $FILE_NAME (0x30) y $DATA (0x80).',
      whatToLookFor: 'Cabecera de registro "FILE" (bytes 0x46, 0x49, 0x4C, 0x45). Número de secuencia en offset 0x10. Atributo $DATA con lista de data runs.',
      technicalMetrics: 'Tamaño estándar de registro MFT: 1024 bytes (1 KB). Primeros 16 registros reservados para el sistema ($MFT, $MFTMirr, $LogFile, $Volume, $AttrDef, ., $Bitmap, $Boot, $BadClus, etc.).',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura segura. Permite diagnosticar exactamente qué sectores contenían el archivo antes del borrado.',
      safetyWarning: 'La sobreescritura del número de registro en la MFT hace que las herramientas pierdan el nombre original, obligando a usar file carving.',
    },
    evidenceBadge: {
      code: 'MFT-CORE',
      label: 'MFT MASTER TABLE',
    },
  },
  {
    id: 'sec-14-06',
    code: '14.06',
    title: 'Free space',
    subtitle: 'Espacio no asignado (Unallocated Space): mapa de bits $Bitmap y fragmentación de clusters',
    targetMechanism: 'Cluster Allocation Tracking / $Bitmap System Stream',
    targetComponent: '$Bitmap (NTFS Allocation Bitmask)',
    commandName: 'fsutil volume filelayout / defrag /u',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Para Windows, el "espacio libre" es solo un array gigantesco de bits en un archivo oculto llamado $Bitmap: un bit en 1 significa cluster ocupado; un bit en 0 significa cluster libre.',
      mythVsTruth: {
        mentira: 'El espacio libre de un disco está vacío y limpio de cualquier rastro informático.',
        verdad: 'El espacio no asignado (unallocated space) está saturado de fragmentos de archivos eliminados, historiales de navegación, contraseñas en memoria de intercambio y fotos borradas.',
        comprobalo: 'Inspeccioná el espacio libre con un visor hexadecimal en crudo: verás miles de bloques de texto legible que pertenecieron a archivos eliminados semanas atrás.',
      },
    },
    entende: {
      queEs: 'El conjunto de clusters en una partición que no están asociados actualmente a ninguna entrada activa de la MFT.',
      paraQueSirve: 'Indicar al driver del sistema de archivos dónde tiene permitido escribir nuevos datos sin colisionar con archivos existentes.',
      quePasaSiFalta: 'Sin el archivo $Bitmap, Windows tendría que recorrer la MFT completa en cada operación de escritura para averiguar qué clusters están ocupados, ralentizando el sistema al extremo.',
    },
    interactua: {
      cliExample: 'fsutil volume allocationreport C:',
      psExample: 'Get-Volume -DriveLetter C | Select-Object Size, SizeRemaining, AllocationUnitSize',
      syntaxBreakdown: 'fsutil volume allocationreport desglosa el porcentaje de clusters libres, ocupados por archivos de usuario y reservados para metadatos del sistema.',
      whatToLookFor: 'Cluster size típico: 4096 bytes (4 KB). Cada byte del archivo $Bitmap controla el estado de 8 clusters (32 KB de disco).',
      technicalMetrics: 'En un disco de 1 TB (244 millones de clusters), el archivo $Bitmap mide apenas ~30.5 MB en total.',
    },
    alertaEVO: {
      reversibilityRule: 'La recuperación es posible mientras el bit en $Bitmap siga siendo 0 o los clusters no hayan sido reutilizados por nuevos datos.',
      safetyWarning: 'Cualquier proceso en segundo plano (caché de navegador, updates) solicita clusters libres constantemente.',
    },
    evidenceBadge: {
      code: 'UNALLOCATED',
      label: 'ESPACIO NO ASIGNADO',
    },
  },
  {
    id: 'sec-14-07',
    code: '14.07',
    title: 'Overwrite',
    subtitle: 'Sobreescritura de sectores: por qué escribir nuevos datos destruye matemáticamente la recuperación',
    targetMechanism: 'Physical Data Overwrite / Entropic Obliteration',
    targetComponent: 'Storage Controller / Magnetic & NAND Media',
    commandName: 'cipher /w:C: / fsutil file createnew',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'No existe ningún software en el planeta capaz de recuperar un archivo cuyos sectores fueron físicamente sobreescritos con nuevos bits: la física cuántica y las tolerancias modernas lo impiden.',
      mythVsTruth: {
        mentira: 'Los laboratorios de espionaje o forenses pueden recuperar datos sobreescritos 7 o 35 veces leyendo el magnetismo residual en los bordes de la pista.',
        verdad: 'En discos modernos con densidades de terabytes por pulgada cuadrada (PMR/SMR) y en SSDs con celdas 3D NAND, una única sobreescritura destruye irrecuperablemente el contenido anterior.',
        comprobalo: 'Escribí un bloque de ceros en un sector físico con dd o un editor hexadecimal: ninguna herramienta comercial ni pericial podrá reconstruir el contenido previo.',
      },
    },
    entende: {
      queEs: 'El proceso físico por el cual un nuevo flujo de electrones o polarización magnética reemplaza el estado cuántico previo de una celda de almacenamiento.',
      paraQueSirve: 'Reutilizar el medio de almacenamiento para nuevos archivos sin necesidad de comprar unidades infinitas.',
      quePasaSiFalta: 'Si los sectores no pudieran sobreescribirse, los discos serían de solo un uso (Write Once Read Many - WORM).',
    },
    interactua: {
      cliExample: 'cipher /w:C:\\Temp # Sobreescribe espacio libre con 0x00, 0xFF y números aleatorios',
      psExample: '# Precaución: la sobreescritura con cipher consume alto I/O y ciclos de escritura en SSDs',
      syntaxBreakdown: 'cipher /w recorre el espacio no asignado asignando clusters temporales y escribiendo 3 pasadas: primero 0x00, luego 0xFF, luego datos pseudoaleatorios criptográficos.',
      whatToLookFor: 'Monitoreo de I/O en Resource Monitor mostrando saturación de escritura al 100% mientras cipher ejecuta.',
      technicalMetrics: '1 pasada de sobreescritura = 0% de probabilidad de recuperación empírica verificada por estándares NIST SP 800-88 Rev 1.',
    },
    alertaEVO: {
      reversibilityRule: 'TOTALMENTE IRREVERSIBLE. Una vez que un cluster es sobreescrito, la información anterior desaparece para siempre.',
      safetyWarning: 'Nunca instales un software de recuperación en el mismo disco de donde intentás rescatar archivos: la instalación sobreescribe los clusters que buscás salvar.',
    },
    evidenceBadge: {
      code: 'OVERWRITE-DEAD',
      label: 'SOBREESCRITURA TOTAL',
    },
  },
  {
    id: 'sec-14-08',
    code: '14.08',
    title: 'SSD + TRIM',
    subtitle: 'Comando TRIM / Deallocate: el recolector de basura de la FTL y el borrado determinístico',
    targetMechanism: 'ATA Data Set Management (TRIM) / NVMe Dataset Management (Deallocate)',
    targetComponent: 'Flash Translation Layer (FTL) / SSD Controller',
    commandName: 'fsutil behavior query DisableDeleteNotify',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En un SSD, cuando borrás un archivo con Shift+Supr, Windows envía el comando TRIM al controlador. Segundos después, si intentás leer esos sectores, el controlador devuelve ceros de inmediato.',
      mythVsTruth: {
        mentira: 'Los programas de recuperación de archivos funcionan igual de bien en un SSD que en un disco mecánico tradicional.',
        verdad: 'En un SSD con TRIM activo, el FTL invalida el mapeo LBA-a-PBA en cuestión de segundos. El controlador devuelve ceros limpios por hardware (DZAT: Deterministic Zeroes After TRIM).',
        comprobalo: 'Ejecutá "fsutil behavior query DisableDeleteNotify": si el resultado es 0, TRIM está habilitado y tus archivos borrados se esfuman del mapa LBA casi al instante.',
      },
    },
    entende: {
      queEs: 'Una instrucción a nivel de bus de almacenamiento que le comunica al SSD qué bloques lógicos (LBA) ya no contienen datos válidos del sistema de archivos.',
      paraQueSirve: 'Permitir al recolector de basura (Garbage Collection) del SSD borrar bloques NAND en segundo plano para mantener la velocidad de escritura sin penalizaciones de lectura-modificación-escritura.',
      quePasaSiFalta: 'Sin TRIM, el rendimiento de escritura del SSD cae drásticamente con el tiempo y la amplificación de escritura (Write Amplification Factor) agota prematuramente la vida útil de las celdas.',
    },
    interactua: {
      cliExample: 'fsutil behavior query DisableDeleteNotify',
      psExample: 'Get-PhysicalDisk | Select FriendlyName, MediaType, BusType | Format-Table',
      syntaxBreakdown: 'DisableDeleteNotify = 0 indica que TRIM está ACTIVADO (la deshabilitación está en falso). DisableDeleteNotify = 1 indica que TRIM está apagado.',
      whatToLookFor: 'En NVMe: DisableDeleteNotify(NVMe) = 0. En SATA: DisableDeleteNotify(SATA) = 0.',
      technicalMetrics: 'Tiempo de respuesta tras TRIM: entre 1 y 120 segundos para que el controlador ponga los LBAs en estado de lectura ceros determinísticos.',
    },
    alertaEVO: {
      reversibilityRule: 'Prácticamente CERO una vez que el comando TRIM fue procesado por el controlador del SSD.',
      safetyWarning: 'Si borraste un archivo crítico por error en un SSD, desconectá la alimentación del equipo inmediatamente para evitar que el SSD ejecute la recolección de basura.',
    },
    evidenceBadge: {
      code: 'TRIM-ZERO',
      label: 'TRIM / FTL PURGE',
    },
  },
  {
    id: 'sec-14-09',
    code: '14.09',
    title: 'HDD recovery',
    subtitle: 'Recuperación en platos magnéticos: persistencia en sectores huérfanos y técnica de file carving',
    targetMechanism: 'Magnetic Remanence Persistence / Raw File Carving via Magic Numbers',
    targetComponent: 'Mechanical Hard Drive (HDD) Platter Geometry',
    commandName: 'photorec / testdisk / dd',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'En un disco duro mecánico tradicional (HDD), no existe el comando TRIM: podés recuperar un archivo meses después de haberlo borrado si el disco tuvo poca actividad de escritura.',
      mythVsTruth: {
        mentira: 'Si se dañó la partición o la MFT en un HDD, los archivos se destruyeron irreversiblemente.',
        verdad: 'Aunque la tabla de particiones o la MFT desaparezcan por completo, los datos crudos siguen físicamente grabados en los platos magnéticos y pueden extraerse por "file carving" reconociendo firmas binarias.',
        comprobalo: 'Inspeccioná un sector huérfano de un HDD: las cabeceras JPEG (FF D8 FF E0), PNG (89 50 4E 47) o ZIP (50 4B 03 04) permiten reconstruir el archivo completo sin nombres de archivo.',
      },
    },
    entende: {
      queEs: 'El proceso forense de escanear la superficie magnética de un disco duro para identificar estructuras de datos preservadas tras la desvinculación lógica.',
      paraQueSirve: 'Recuperar información valiosa en discos mecánicos tras formateos accidentales, corrupción de partición o borrados accidentales masivos.',
      quePasaSiFalta: 'Dependeríamos exclusivamente de backups externos; el HDD perdería una de sus mayores ventajas forenses frente al silicio NAND.',
    },
    interactua: {
      cliExample: 'rem Uso de herramientas de talla como PhotoRec o ddrescue en consola',
      psExample: '# En PowerShell podemos inspeccionar volúmenes en crudo mediante streams de bajo nivel',
      syntaxBreakdown: 'File Carving analiza la secuencia de bytes buscando firmas de inicio (Magic Bytes Header) y firmas de fin (Footer/EOF) para extraer el stream completo.',
      whatToLookFor: 'Tasa de fragmentación: si el archivo estaba contiguo en el plato, la recuperación por carving es del 100%; si estaba muy fragmentado, se recuperará solo el primer trozo.',
      technicalMetrics: 'Firmas estándar: PDF = %PDF (0x25 0x50 0x44 0x46), MP4 = ftyp (0x66 0x74 0x79 0x70), DOCX/XLSX = PK (0x50 0x4B 0x03 0x04).',
    },
    alertaEVO: {
      reversibilityRule: 'Muy alta en discos mecánicos siempre que no se realicen nuevas escrituras sobre el volumen.',
      safetyWarning: 'Si el disco mecánico emite clics repetitivos (Click of Death), el problema es mecánico en los cabezales; encenderlo destruirá físicamente el plato magnético.',
    },
    evidenceBadge: {
      code: 'HDD-CARVE',
      label: 'CARVING MAGNÉTICO',
    },
  },
  {
    id: 'sec-14-10',
    code: '14.10',
    title: 'Windows File Recovery',
    subtitle: 'La herramienta nativa winfr.exe de Microsoft: modos Regular, Extensive, Segment y Signature',
    targetMechanism: 'Microsoft CLI Recovery Engine / MFT Record Parsing & File Carving',
    targetComponent: 'winfr.exe (Windows File Recovery)',
    commandName: 'winfr C: D:\\Recovery /regular /n *.docx',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Microsoft creó su propia herramienta forense de línea de comandos oficial llamada winfr.exe, capaz de analizar la MFT y ejecutar file carving sin instalar software sospechoso de terceros.',
      mythVsTruth: {
        mentira: 'Windows no incluye ninguna herramienta oficial de recuperación de archivos y hay que pagar por programas de terceros dudosos.',
        verdad: 'Windows File Recovery (winfr.exe) es un ejecutable oficial desarrollado por Microsoft para Windows 10 y 11 con soporte para modos Regular (análisis MFT rápido) y Extensive (escaneo profundo por bloques).',
        comprobalo: 'Instalá Windows File Recovery desde la tienda oficial o ejecútalo en consola: winfr /? te mostrará su potente sintaxis forense nativa.',
      },
    },
    entende: {
      queEs: 'Una utilidad oficial de consola desarrollada por los ingenieros del sistema de archivos de Microsoft para escanear y reconstruir archivos eliminados.',
      paraQueSirve: 'Recuperar documentos, fotos, videos y archivos comprimidos desde discos duros, SSDs, tarjetas SD y unidades USB formateadas en NTFS, FAT32 o exFAT.',
      quePasaSiFalta: 'Los usuarios deben recurrir a software de terceros con publicidad, instaladores potencialmente no deseados (PUPs) o versiones de prueba engañosas.',
    },
    interactua: {
      cliExample: 'winfr C: E:\\RecoveryOutput /regular /n Users\\Admin\\Documents\\*.pdf',
      psExample: 'winfr D: E:\\RecoveredPhotos /extensive /n *.jpg /n *.png',
      syntaxBreakdown: 'El primer argumento es el volumen de ORIGEN (donde se perdió el archivo); el segundo es el volumen de DESTINO (OBLIGATORIAMENTE un disco diferente para no sobreescribir).',
      whatToLookFor: 'Archivos generados en la carpeta de destino: informe de auditoría "Recovery_<timestamp>.log" con lista de clusters recuperados y hashes.',
      technicalMetrics: 'Modo Regular: consulta la MFT en busca de entradas con bit InUse=0. Modo Extensive: combina análisis de descriptores de segmento y carving por firmas.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro siempre y cuando la carpeta de destino esté ubicada en una unidad de almacenamiento FÍSICAMENTE DISTINTA a la unidad analizada.',
      safetyWarning: 'NUNCA ejecutes winfr guardando el resultado en la misma letra de unidad que estás intentando recuperar, o destruirás los datos.',
    },
    evidenceBadge: {
      code: 'WINFR-CLI',
      label: 'WINFR.EXE OFICIAL',
    },
  },
  {
    id: 'sec-14-11',
    code: '14.11',
    title: 'File History',
    subtitle: 'Historial de archivos de Windows: copias versionadas automáticas a disco externo o red',
    targetMechanism: 'Continuous Data Protection / NTFS USN Journal Monitoring',
    targetComponent: 'FileHistory.exe / C:\\Users\\<User>\\AppData\\Local\\Microsoft\\Windows\\FileHistory',
    commandName: 'FhManagew.exe -backupnow',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'File History no hace backups estúpidos cada 24 horas: lee el diario de números de secuencia de actualización (USN Journal) de NTFS para detectar cambios en milisegundos y versionar solo los deltas.',
      mythVsTruth: {
        mentira: 'El Historial de Archivos hace una copia completa de todo el disco C: consumiendo terabytes en minutos.',
        verdad: 'File History monitorea exclusivamente las bibliotecas de usuario (Documentos, Imágenes, Escritorio, etc.) y guarda copias fechadas con sufijos cronológicos (UTC timestamp) en una unidad secundaria.',
        comprobalo: 'Inspeccioná la carpeta de destino de File History: verás tus archivos guardados con nombres como "Balance (2026_10_14 02_15_00 UTC).xlsx", permitiéndote viajar en el tiempo.',
      },
    },
    entende: {
      queEs: 'El sistema nativo de protección continua de datos personales de Windows introducido para sustituir el viejo backup de Windows 7.',
      paraQueSirve: 'Restaurar versiones anteriores de un archivo de trabajo que fue modificado accidentalmente, corrompido o borrado durante la jornada laboral.',
      quePasaSiFalta: 'Si modificás y guardás un documento de Excel arruinando fórmulas complejas, no tendrías forma de retroceder al estado de hace dos horas.',
    },
    interactua: {
      cliExample: 'FhManagew.exe -backupnow',
      psExample: 'Get-Service -Name "fhsvc" | Select-Object Status, StartType',
      syntaxBreakdown: 'El servicio fhsvc (File History Service) corre bajo la cuenta local del sistema y se activa periódicamente según la política configurada (por defecto cada 1 hora).',
      whatToLookFor: 'Catálogo Configuration.xml en el directorio raíz del almacenamiento del historial, donde se indexan los hashes y rutas relativas.',
      technicalMetrics: 'Frecuencia configurable: desde cada 10 minutos hasta diario. Retención de versiones: desde 1 mes hasta "Para siempre".',
    },
    alertaEVO: {
      reversibilityRule: '100% reversible y no destructivo para los archivos locales.',
      safetyWarning: 'Requiere que la unidad externa de backup esté conectada regularmente o que exista un recurso compartido SMB en red accesible.',
    },
    evidenceBadge: {
      code: 'FILE-HISTORY',
      label: 'HISTORIAL VERSIONES',
    },
  },
  {
    id: 'sec-14-12',
    code: '14.12',
    title: 'Previous Versions',
    subtitle: 'Instantáneas de volumen VSS (Shadow Copies): montaje de snapshots en tiempo real',
    targetMechanism: 'Volume Shadow Copy Service (VSS) / Copy-on-Write Snapshots',
    targetComponent: 'volsnap.sys / VSS Provider',
    commandName: 'vssadmin list shadows / shadowexplorer',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Hacé clic derecho en cualquier carpeta en Windows, seleccioná "Propiedades" y andá a la pestaña "Versiones anteriores": podés abrir la carpeta tal cual existía hace 3 días sin instalar nada.',
      mythVsTruth: {
        mentira: 'Las "Versiones anteriores" son backups completos duplicados que ocupan el doble de espacio en disco.',
        verdad: 'Utilizan snapshots Copy-on-Write (CoW) del driver volsnap.sys: solo se guardan los bloques que sufrieron modificaciones desde la toma de la instantánea, ocupando una fracción minúscula de espacio.',
        comprobalo: 'Ejecutá "vssadmin list shadows" en CMD como administrador: verás el listado de todos los puntos de restauración e instantáneas montables con su ID global de instantánea.',
      },
    },
    entende: {
      queEs: 'La interfaz gráfica de usuario del Explorador de Windows que expone directamente los snapshots creados por el servicio Volume Shadow Copy (VSS).',
      paraQueSirve: 'Recuperar archivos individuales o directorios enteros sin necesidad de restaurar todo el sistema operativo con un punto de restauración completo.',
      quePasaSiFalta: 'Si VSS está deshabilitado o el espacio asignado a shadow copies es 0, la pestaña "Versiones anteriores" siempre mostrará "No hay versiones anteriores disponibles".',
    },
    interactua: {
      cliExample: 'vssadmin list shadows /for=C:',
      psExample: 'Get-CimInstance -ClassName Win32_ShadowCopy | Select-Object ID, DeviceObject, InstallDate',
      syntaxBreakdown: 'Cada instantánea expone una ruta de dispositivo de kernel como \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1 que puede ser montada como enlace simbólico.',
      whatToLookFor: 'Espacio de almacenamiento de instantáneas: vssadmin list shadowstorage muestra el espacio asignado y máximo reservado (típicamente 5-10% del disco).',
      technicalMetrics: 'Tecnología Copy-on-Write: cuando un cluster se va a sobreescribir, volsnap.sys copia el bloque viejo al área de diferencias antes de permitir la nueva escritura.',
    },
    alertaEVO: {
      reversibilityRule: 'Extracción 100% segura en modo de solo lectura.',
      safetyWarning: 'Si el espacio en disco baja peligrosamente (< 5% libre), Windows purga automáticamente las instantáneas VSS más antiguas para liberar espacio.',
    },
    evidenceBadge: {
      code: 'VSS-PREV-VER',
      label: 'VERSIONES ANTERIORES',
    },
  },
  {
    id: 'sec-14-13',
    code: '14.13',
    title: 'OneDrive versions',
    subtitle: 'Control de versiones en nube: sincronización diferencial y papelera de segundo nivel',
    targetMechanism: 'Cloud Object Storage Versioning / Differential Delta Sync',
    targetComponent: 'OneDrive.exe / Graph API Storage Backend',
    commandName: 'Historial de versiones en OneDrive Web / Atributos Reparse Point',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Si un ransomware cifra tus documentos locales sincronizados con OneDrive, no pagues el rescate: la nube almacena hasta 500 versiones previas de cada archivo y una papelera de reciclaje remota.',
      mythVsTruth: {
        mentira: 'Si borrás un archivo local en la carpeta OneDrive, el archivo se borra definitivamente de los servidores de Microsoft de inmediato.',
        verdad: 'OneDrive conserva una Papelera de Reciclaje web durante 30 días (cuentas personales) o 93 días (cuentas empresariales), además de un historial inmutable de versiones delta para cada guardado.',
        comprobalo: 'Hacé clic derecho en cualquier archivo sincronizado con OneDrive y elegí "Historial de versiones": verás una lista temporal con fecha, usuario y opción de restauración instantánea.',
      },
    },
    entende: {
      queEs: 'El subsistema de versionado distribuido en la nube integrado en el Shell de Windows mediante archivos bajo demanda (Cloud Filter API / Reparse Points).',
      paraQueSirve: 'Blindar los datos de usuario contra errores humanos, sobreescrituras catastróficas y ataques masivos de ransomware criptográfico.',
      quePasaSiFalta: 'Cualquier modificación o borrado se propagaría de manera definitiva a la copia local sin un historial de retroceso externo.',
    },
    interactua: {
      cliExample: 'rem En OneDrive web: Settings -> Restore your OneDrive (Restaurar tu OneDrive completo a un día previo)',
      psExample: 'Get-Item "C:\\Users\\$env:USERNAME\\OneDrive\\Documento.docx" | Select-Object -ExpandProperty Attributes',
      syntaxBreakdown: 'Los archivos bajo demanda tienen el atributo ReparsePoint (L) y Offline (O) o Archive (A).',
      whatToLookFor: 'Función "Restaurar tu OneDrive": permite revertir masivamente toda la biblioteca a un punto temporal exacto de los últimos 30 días.',
      technicalMetrics: 'Límite de versiones: hasta 500 versiones principales por archivo en OneDrive personal y de Microsoft 365.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible desde la interfaz web de OneDrive incluso si la PC local fue formateada o destruida.',
      safetyWarning: 'Si vacías voluntariamente la papelera de reciclaje web de OneDrive en el navegador, la recuperación solo será posible en cuentas corporativas mediante la papelera de segundo nivel del administrador.',
    },
    evidenceBadge: {
      code: 'CLOUD-VERSIONS',
      label: 'VERSIONADO CLOUD',
    },
  },
  {
    id: 'sec-14-14',
    code: '14.14',
    title: 'Cuándo dejar de usar inmediatamente el disco',
    subtitle: 'Protocolo de congelamiento forense: apagado de emergencia y clonación bit a bit',
    targetMechanism: 'Forensic Freezing Protocol / Physical Power Cutoff',
    targetComponent: 'Hardware Power State / Direct I/O Interruption',
    commandName: 'Hard Power Off (Desconexión directa sin apagado suave de Windows)',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'Si borraste accidentalmente la base de datos o fotos familiares más importantes de tu vida, NO hagas "Inicio -> Apagar": desenchufá la computadora de la pared en ese milisegundo exacto.',
      mythVsTruth: {
        mentira: 'Lo mejor es apagar Windows ordenadamente para que el sistema cierre los programas antes de intentar recuperar archivos.',
        verdad: 'Al hacer un apagado normal, Windows escribe megabytes de logs en el visor de eventos, actualiza el registro, vacía la caché de disco y puede enviar comandos TRIM, destruyendo los datos borrados.',
        comprobalo: 'Analizá con Process Monitor las escrituras durante el apagado: Windows escribe en decenas de archivos temporales y registra transacciones en NTFS.',
      },
    },
    entende: {
      queEs: 'El protocolo pericial de respuesta inmediata ante incidentes de pérdida de datos críticos para evitar la sobreescritura involuntaria por parte del sistema operativo.',
      paraQueSirve: 'Detener de inmediato cualquier operación de escritura en segundo plano, ejecución de TRIM, defragmentación automática o paginación de memoria virtual.',
      quePasaSiFalta: 'Cada minuto que la PC sigue encendida y navegando en internet, el navegador descarga cientos de imágenes en la caché sobreescribiendo los clusters del archivo borrado.',
    },
    interactua: {
      cliExample: 'rem En computadoras portátiles: mantener presionado el botón de encendido 10 segundos o desconectar batería',
      psExample: '# NO usar Stop-Computer: aplicar corte físico de alimentación para congelar el estado del medio',
      syntaxBreakdown: 'El congelamiento forense exige remover el disco de la máquina afectada y conectarlo como dispositivo SECUNDARIO con un bloqueador de escritura (Write Blocker) de hardware.',
      whatToLookFor: 'Clonación bit a bit: generar una imagen cruda (RAW .img / .dd / .e01) del disco completo antes de ejecutar cualquier herramienta de recuperación sobre la copia.',
      technicalMetrics: 'Tasa de degradación: el 80% de los archivos recuperables se destruyen en los primeros 30 minutos de uso continuo del equipo post-borrado.',
    },
    alertaEVO: {
      reversibilityRule: 'Crucial para maximizar la probabilidad de rescate.',
      safetyWarning: 'Nunca continúes descargando instaladores de recuperación en el mismo disco afectado: hacelo desde otra computadora y ejecutá herramientas desde un pendrive booteable WinPE.',
    },
    evidenceBadge: {
      code: 'FREEZE-DISK',
      label: 'CONGELAMIENTO FORENSE',
    },
  },
  {
    id: 'sec-14-15',
    code: '14.15',
    title: 'Qué recuperación NO se puede garantizar',
    subtitle: 'Límites de la física y criptografía: ceros reales, TRIM ejecutado, BitLocker sin clave y daño físico',
    targetMechanism: 'Thermodynamic & Cryptographic Impossibility Thresholds',
    targetComponent: 'NAND Silicon / AES-256 Crypto Engine / Mechanical Spindle',
    commandName: 'Análisis de viabilidad forense / Triage de irrecuperabilidad',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Hay 4 situaciones en las que ni la NASA, ni el FBI, ni el mejor laboratorio de recuperación del mundo pueden recuperar un archivo: la física y las matemáticas no se pueden hackear.',
      mythVsTruth: {
        mentira: 'Cualquier disco roto o archivo borrado se puede recuperar si pagás lo suficiente en un laboratorio especializado.',
        verdad: 'Si una celda SSD fue vaciada por TRIM, si un sector fue sobreescrito con ceros, si el volumen BitLocker no tiene clave o si los platos magnéticos fueron rayados por un cabezal caído, los datos dejaron de existir físicamente.',
        comprobalo: 'Cifrá un archivo con AES-256, borrá la clave de 256 bits y tratá de adivinarla: requeriría más energía que la que emite el Sol durante millones de años para probar todas las combinaciones.',
      },
    },
    entende: {
      queEs: 'La frontera infranqueable entre la pérdida lógica recuperable y la aniquilación definitiva de la información.',
      paraQueSirve: 'Evitar estafas comerciales de empresas fraudulentas que prometen milagros técnicos imposibles y enfocar los esfuerzos en la prevención mediante backups 3-2-1.',
      quePasaSiFalta: 'Se malgastan presupuestos astronómicos intentando restaurar datos que la termodinámica y la teoría de la información de Shannon determinan como irrecuperables.',
    },
    interactua: {
      cliExample: 'rem Casos de irrecuperabilidad absoluta: 1. TRIM completado; 2. Sobreescritura NIST; 3. BitLocker sin TPM/clave; 4. Daño de sustrato magnético',
      psExample: '# Validación de BitLocker: Get-BitLockerVolume C: | Select-Object VolumeStatus, EncryptionPercentage, KeyProtector',
      syntaxBreakdown: 'Si el volumen está cifrado con BitLocker (AES-XTS 128/256) y se perdió la contraseña o clave numérica de 48 dígitos de recuperación, los sectores son indistinguibles de ruido blanco puro.',
      whatToLookFor: 'Entropía de Shannon de los sectores: un valor de 7.999 indica cifrado fuerte o compresión aleatoria; sin la clave criptográfica, la información es matemáticamente irrecuperable.',
      technicalMetrics: 'Regla 3-2-1: 3 copias de los datos, 2 medios diferentes, 1 copia fuera del sitio (offsite o cloud). Es la única garantía 100% real ante la pérdida de datos.',
    },
    alertaEVO: {
      reversibilityRule: '0% de posibilidad de recuperación. Límite criptográfico y físico absoluto.',
      safetyWarning: 'La única defensa infalible contra la pérdida catastrófica es la arquitectura de copias de seguridad automatizadas y verificadas periódicamente.',
    },
    evidenceBadge: {
      code: 'LIMITS-ABSOLUTE',
      label: 'LÍMITES FORENSES',
    },
  },
];

export const SECTOR_14_MINICASES: Sector14MiniCase[] = [
  {
    id: 'case-14-01',
    code: 'CASE-14.01',
    title: 'El Shift+Delete fatal del contador en un SSD NVMe',
    scenario: 'Un analista contable eliminó por error una carpeta con 200 declaraciones juradas en formato PDF usando Shift+Supr en su laptop equipada con un SSD NVMe de alta velocidad. Desesperado, se puso a navegar en Google, descargó tres programas de prueba de internet y pasó 3 horas escaneando la unidad sin encontrar nada.',
    userStatement: 'Los programas de recuperación que bajé dicen que encuentran 0 archivos. ¿Por qué en mi vieja PC con disco mecánico sí podía recuperar cosas borradas con Shift+Supr y acá no aparece nada?',
    initialMistake: 'Haber mantenido la laptop encendida descargando programas en el mismo SSD y no comprender el impacto del comando TRIM en medios de estado sólido.',
    diagnosticQuestion: '¿Por qué fallaron por completo los intentos de recuperación en esta unidad NVMe?',
    options: [
      {
        id: 'opt-a',
        text: 'Porque los archivos PDF están cifrados por el visor Adobe Acrobat y no pueden ser leídos por software estándar.',
        isCorrect: false,
        explanation: 'Falso. El formato PDF no bloquea la detección de firmas en la MFT ni el escaneo de cabeceras binarias.',
      },
      {
        id: 'opt-b',
        text: 'Porque al usar Shift+Supr en un SSD con TRIM activo, Windows emitió la instrucción Deallocate al controlador; la FTL invalidó los bloques LBA en minutos y las descargas sobreescribieron la MFT.',
        isCorrect: true,
        explanation: '¡Exacto! El comando TRIM/Deallocate le ordenó al controlador del SSD descartar el mapeo de bloques físicos, devolviendo ceros inmediatos. Además, descargar programas en el mismo disco sobreescribió los metadatos.',
      },
      {
        id: 'opt-c',
        text: 'Porque Shift+Supr en Windows 11 envía automáticamente los archivos a un buzón temporal oculto en OneDrive.',
        isCorrect: false,
        explanation: 'Totalmente falso. Shift+Supr desvincula directamente los registros de la MFT sin interactuar con OneDrive a menos que la carpeta estuviera sincronizada.',
      },
    ],
    technicalVerdict: 'TRIM y la actividad de escritura post-incidente destruyeron el 100% de la información. El procedimiento correcto hubiera sido apagar el equipo por corte directo en el segundo 1 y clonar la unidad.',
    lessonLearned: 'En unidades SSD modernas con TRIM, el tiempo de respuesta no se mide en días ni horas, sino en segundos: congelar la alimentación de inmediato es la única opción.',
  },
  {
    id: 'case-14-02',
    code: 'CASE-14.02',
    title: 'El formateo rápido accidental del disco de edición de video',
    scenario: 'Un editor de video conectó su disco duro mecánico externo de 8 TB con proyectos de clientes y, al notar un mensaje de Windows que decía "Debe formatear el disco", presionó "Formato rápido (NTFS)" por error. El proceso tardó 5 segundos. El cliente está al borde de un juicio si no recupera los archivos de video brutos.',
    userStatement: 'Formateé el disco por error en 5 segundos. ¿Se borraron los 6 Terabytes de grabaciones de cámara que tenía adentro?',
    initialMistake: 'Creer que un formato rápido de 5 segundos tiene la capacidad física de destruir 6 TB de datos magnéticos.',
    diagnosticQuestion: '¿Cuál es el estado técnico real de los 6 TB de videos y qué acción debe tomar el técnico EVO?',
    options: [
      {
        id: 'opt-a',
        text: 'Los videos siguen físicamente grabados en los platos magnéticos; el formato rápido solo escribió un nuevo VBR y una MFT en blanco. Con una herramienta de carving o lectura profunda de MFT huérfana se recuperan casi al 100%.',
        isCorrect: true,
        explanation: '¡Correcto! En un HDD mecánico, un formato rápido solo toca las primeras decenas de megabytes de metadatos. Los sectores de los archivos de video están intactos en los platos.',
      },
      {
        id: 'opt-b',
        text: 'Los datos están destruidos porque el comando format en Windows siempre sobreescribe los sectores con ceros criptográficos de forma predeterminada.',
        isCorrect: false,
        explanation: 'Falso. Solo el formato completo (sin el modificador /q) realiza sobreescritura de sectores. El formato rápido jamás toca los sectores de datos.',
      },
      {
        id: 'opt-c',
        text: 'Los videos solo se pueden recuperar si el usuario recuerda el nombre exacto de cada archivo para escribirlos en la consola de comandos.',
        isCorrect: false,
        explanation: 'Falso. La técnica de file carving reconstruye archivos leyendo sus magic numbers (cabeceras MP4/MOV) sin requerir el nombre original.',
      },
    ],
    technicalVerdict: 'Al no tratarse de un SSD con TRIM y ser un formato rápido, los 6 TB de datos permanecen en los sectores. Se desconecta la unidad, se monta en modo solo lectura y se ejecuta una reconstrucción pericial.',
    lessonLearned: 'Un formato rápido en disco mecánico es una de las fallas más benignas y con mayor tasa de éxito de recuperación completa.',
  },
  {
    id: 'case-14-03',
    code: 'CASE-14.03',
    title: 'El documento de Word sobreescrito y salvado por Versiones Anteriores (VSS)',
    scenario: 'Un abogado reemplazó accidentalmente el contenido de un contrato de fusión de 80 páginas pegando encima un texto de prueba y guardó los cambios (Ctrl+G), cerrando Word. El archivo no fue borrado, sino sobreescrito a nivel de aplicación. En la papelera de reciclaje no hay nada porque el archivo nunca se eliminó.',
    userStatement: 'No lo borré, lo guardé encima con otro contenido y cerré Word. El historial de deshacer (Ctrl+Z) ya no funciona. ¿Lo perdí para siempre?',
    initialMistake: 'Buscar el archivo en la Papelera de Reciclaje o creer que el software de recuperación tipo Recuva solucionará una sobreescritura lógica de contenido.',
    diagnosticQuestion: '¿Qué mecanismo nativo de Windows permite rescatar el contrato tal como estaba esa mañana sin software externo?',
    options: [
      {
        id: 'opt-a',
        text: 'Hacer clic derecho en el archivo o en la carpeta contenedora, seleccionar "Propiedades" e ingresar a la pestaña "Versiones anteriores" para abrir la instantánea Copy-on-Write generada por VSS.',
        isCorrect: true,
        explanation: '¡Excelente! Si la Protección del Sistema o las instantáneas de volumen VSS están activas, Windows conserva los bloques previos mediante Copy-on-Write y expone las versiones del archivo intactas.',
      },
      {
        id: 'opt-b',
        text: 'Ejecutar chkdsk /f C: para obligar a Word a reconstruir el documento desde la memoria RAM del sistema.',
        isCorrect: false,
        explanation: 'Falso. chkdsk verifica la integridad de la estructura del sistema de archivos, no recupera versiones lógicas de documentos editados.',
      },
      {
        id: 'opt-c',
        text: 'Formatear la partición en modo rápido para que el archivo vuelva a su estado inicial.',
        isCorrect: false,
        explanation: 'Absurdo y destructivo. Formatear la partición destruiría la instalación de Windows y los datos.',
      },
    ],
    technicalVerdict: 'El snapshot VSS de las 07:00 AM contenía la versión completa de 80 páginas. Se extrajo en 10 segundos desde la pestaña Versiones Anteriores.',
    lessonLearned: 'Para archivos sobreescritos o modificados por error, VSS (Volume Shadow Copy) y File History son infinitamente superiores a cualquier software de recuperación de archivos borrados.',
  },
  {
    id: 'case-14-04',
    code: 'CASE-14.04',
    title: 'El rescate oficial con Windows File Recovery (winfr.exe)',
    scenario: 'En un servidor de archivos sin conexión a internet ni permisos para instalar software no autorizado de terceros, un administrador borró accidentalmente una carpeta con scripts de automatización .ps1 y .py en la unidad D:. El departamento de seguridad informática prohíbe descargar ejecutables desconocidos de la web.',
    userStatement: 'La política corporativa me prohíbe instalar programas de recuperación bajados de internet. ¿Tengo alguna herramienta legítima firmada por Microsoft que pueda ejecutar desde la consola?',
    initialMistake: 'Creer que solo se pueden recuperar datos utilizando software privativo de dudosa procedencia.',
    diagnosticQuestion: '¿Cuál es la sintaxis correcta usando la utilidad oficial winfr de Microsoft para recuperar los scripts en la unidad externa E:?',
    options: [
      {
        id: 'opt-a',
        text: 'winfr D: E:\\RecoveredScripts /regular /n *.ps1 /n *.py',
        isCorrect: true,
        explanation: '¡Exacto! winfr es la herramienta oficial de Microsoft. El primer parámetro es el origen (D:), el segundo el destino en otro disco (E:) y el modo /regular analiza rápidamente las entradas desasignadas en la MFT.',
      },
      {
        id: 'opt-b',
        text: 'format D: /winfr:recover /target:E:',
        isCorrect: false,
        explanation: 'Falso. El comando format formatea unidades, no tiene parámetros de recuperación.',
      },
      {
        id: 'opt-c',
        text: 'winfr D: D:\\Recovery /all',
        isCorrect: false,
        explanation: 'Falso y sumamente peligroso: winfr bloquea por seguridad intentar recuperar en la misma unidad de origen (D: a D:) para evitar sobreescribir los datos que intenta salvar.',
      },
    ],
    technicalVerdict: 'winfr.exe recuperó el 100% de los scripts en menos de 2 minutos cumpliendo con todas las normas de cumplimiento y seguridad informática corporativa.',
    lessonLearned: 'Windows File Recovery es la opción forense nativa, gratuita, limpia y homologada por Microsoft para rescates en entornos productivos.',
  },
];

export const SECTOR_14_TEST_BANK: Sector14TestQuestion[] = [
  {
    id: 'q14-01',
    questionNumber: 1,
    category: 'PAPELERA_Y_BORRADO_LOGICO',
    question: '¿Qué ocurre físicamente en el almacenamiento cuando se envía un archivo de 2 GB a la Papelera de Reciclaje dentro del mismo volumen?',
    options: [
      { id: 'a', text: 'Se copian los 2 GB a una carpeta especial en el disco C: y luego se eliminan del volumen original.' },
      { id: 'b', text: 'No se mueven datos de clusters: se renombran los metadatos en la MFT con el prefijo $R y se genera un archivo de índice $I con la ruta y timestamp originales.' },
      { id: 'c', text: 'Los 2 GB se comprimen con algoritmo NTFS LZNT1 para que no ocupen espacio.' },
      { id: 'd', text: 'El controlador del disco aplica el comando TRIM de inmediato en segundo plano.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'La Papelera de Reciclaje en el mismo volumen es una simple operación de renombrado de metadatos en la MFT. El contenido real pasa a llamarse $Rxxxxxx y la información original se guarda en $Ixxxxxx.',
    relatedInvestigationCode: '14.02',
  },
  {
    id: 'q14-02',
    questionNumber: 2,
    category: 'TRIM_SSD_VS_HDD',
    question: '¿Cuál es la función principal del comando TRIM / Deallocate en unidades SSD?',
    options: [
      { id: 'a', text: 'Desfragmentar los archivos de Windows para que el cabezal lea más rápido.' },
      { id: 'b', text: 'Comunicar al controlador del SSD qué bloques LBA ya no contienen datos válidos para que el Garbage Collector pueda borrarlos y optimizar escrituras futuras.' },
      { id: 'c', text: 'Cifrar los archivos eliminados para que no puedan ser recuperados por malware.' },
      { id: 'd', text: 'Reducir el voltaje de la memoria DRAM del controlador para ahorrar energía en laptops.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Las celdas NAND deben borrarse en bloques enteros antes de volver a programarse en páginas. TRIM avisa al firmware qué bloques están libres para que los borre de forma anticipada, evitando caídas brutales de rendimiento.',
    relatedInvestigationCode: '14.08',
  },
  {
    id: 'q14-03',
    questionNumber: 3,
    category: 'NTFS_MFT_Y_METADATOS',
    question: 'En el sistema de archivos NTFS, ¿dónde se guardan los datos de un archivo que pesa menos de ~700 bytes?',
    options: [
      { id: 'a', text: 'En la memoria RAM no volátil de la placa madre (NVRAM).' },
      { id: 'b', text: 'Directamente dentro del propio registro de 1024 bytes de la MFT como un atributo $DATA residente.' },
      { id: 'c', text: 'En el sector de arranque de la partición (VBR).' },
      { id: 'd', text: 'Obligatoriamente en un cluster de 4 KB reservado en el archivo $Bitmap.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'NTFS optimiza el espacio: si la carga útil del archivo cabe dentro del espacio remanente del registro MFT de 1024 bytes, se almacena como atributo $DATA residente, sin consumir clusters en el disco.',
    relatedInvestigationCode: '14.05',
  },
  {
    id: 'q14-04',
    questionNumber: 4,
    category: 'HERRAMIENTAS_Y_PROTOCOLOS',
    question: '¿Por qué NUNCA se debe guardar la salida de un software de recuperación en la misma unidad que se está analizando?',
    options: [
      { id: 'a', text: 'Porque el software de recuperación se bloquearía por un bucle infinito en el registro de Windows.' },
      { id: 'b', text: 'Porque las nuevas escrituras del archivo rescatado se grabarán en los clusters libres, sobreescribiendo irreversiblemente los demás archivos que se intentan recuperar.' },
      { id: 'c', text: 'Porque Windows no permite crear carpetas mientras la MFT está abierta en modo lectura.' },
      { id: 'd', text: 'Porque se invalidaría automáticamente la licencia comercial del software forense.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Al guardar archivos recuperados en la misma unidad de origen, el sistema operativo asigna clusters del espacio no asignado, los cuales muy probablemente corresponden a los archivos que aún no se terminaron de escanear.',
    relatedInvestigationCode: '14.07',
  },
  {
    id: 'q14-05',
    questionNumber: 5,
    category: 'TRIM_SSD_VS_HDD',
    question: '¿Qué significa el término forense "DZAT" en el contexto de unidades de estado sólido?',
    options: [
      { id: 'a', text: 'Dynamic Zone Allocation Table: tabla dinámica de zonas de particionado.' },
      { id: 'b', text: 'Deterministic Zeroes After TRIM: el controlador devuelve ceros de inmediato ante cualquier lectura de un LBA sobre el cual se ejecutó TRIM.' },
      { id: 'c', text: 'Data Zero Access Technology: protocolo de hibernación ultra rápida de Windows.' },
      { id: 'd', text: 'Direct Zip Archiving Tool: compresión nativa de archivos del sistema operativo.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'DZAT es una especificación estándar donde el controlador SSD garantiza que cualquier lectura sobre un sector al que se le aplicó TRIM devolverá ceros inmediatos, anulando la recuperación lógica convencional.',
    relatedInvestigationCode: '14.08',
  },
  {
    id: 'q14-06',
    questionNumber: 6,
    category: 'PAPELERA_Y_BORRADO_LOGICO',
    question: '¿Qué comando de PowerShell permite verificar si el soporte de TRIM está habilitado en Windows?',
    options: [
      { id: 'a', text: 'Get-Service -Name "TrimSvc"' },
      { id: 'b', text: 'fsutil behavior query DisableDeleteNotify' },
      { id: 'c', text: 'Optimize-Volume -DriveLetter C -DefragOnly' },
      { id: 'd', text: 'Test-DiskDrive -CheckTrim' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El comando "fsutil behavior query DisableDeleteNotify" devuelve 0 si TRIM está activo para NTFS/ReFS tanto en unidades SATA como NVMe.',
    relatedInvestigationCode: '14.08',
  },
  {
    id: 'q14-07',
    questionNumber: 7,
    category: 'HERRAMIENTAS_Y_PROTOCOLOS',
    question: 'En la herramienta oficial Windows File Recovery (winfr.exe), ¿cuál es la diferencia fundamental entre el modo /regular y el modo /extensive?',
    options: [
      { id: 'a', text: '/regular recupera archivos de menos de 10 MB y /extensive recupera archivos de más de 10 GB.' },
      { id: 'b', text: '/regular analiza la MFT buscando registros no sobreescritos; /extensive realiza escaneo por sectores y talla de archivos (file carving) buscando cabeceras binarias conocidas.' },
      { id: 'c', text: '/regular funciona en SSDs y /extensive funciona exclusivamente en disquetes antiguos.' },
      { id: 'd', text: '/regular no requiere privilegios de administrador y /extensive requiere clave de BitLocker.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El modo /regular es un análisis rápido de la base de datos MFT. El modo /extensive realiza una lectura profunda de todo el volumen independientemente de la MFT, identificando firmas binarias de archivos (carving).',
    relatedInvestigationCode: '14.10',
  },
  {
    id: 'q14-08',
    questionNumber: 8,
    category: 'HERRAMIENTAS_Y_PROTOCOLOS',
    question: '¿Qué tecnología utiliza Windows para habilitar la pestaña "Versiones anteriores" en las propiedades de una carpeta?',
    options: [
      { id: 'a', text: 'Copias de seguridad automáticas en el registro de Windows.' },
      { id: 'b', text: 'Volume Shadow Copy Service (VSS) mediante snapshots Copy-on-Write gestionados por el driver volsnap.sys.' },
      { id: 'c', text: 'Un archivo ZIP oculto en la carpeta C:\\Windows\\Temp.' },
      { id: 'd', text: 'Subidas silenciosas de todos los documentos al caché de Microsoft Edge.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Las Versiones Anteriores se alimentan de las instantáneas VSS generadas por puntos de restauración o File History, gestionadas a bajo nivel por volsnap.sys con arquitectura Copy-on-Write.',
    relatedInvestigationCode: '14.12',
  },
  {
    id: 'q14-09',
    questionNumber: 9,
    category: 'HERRAMIENTAS_Y_PROTOCOLOS',
    question: 'Ante un incidente de borrado accidental grave en un disco local, ¿cuál es el primer paso del protocolo de congelamiento pericial?',
    options: [
      { id: 'a', text: 'Reiniciar el equipo en Modo Seguro con funciones de red para descargar antivirus.' },
      { id: 'b', text: 'Detener inmediatamente cualquier actividad de escritura (apagado directo o corte de energía si es un disco del sistema) para evitar sobreescrituras y TRIM.' },
      { id: 'c', text: 'Ejecutar de inmediato chkdsk C: /f /r para reparar los sectores perdidos.' },
      { id: 'd', text: 'Copiar archivos pesados a la unidad para comprobar si el disco responde con buena velocidad.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El congelamiento pericial exige el cese inmediato de escrituras para evitar que el sistema operativo o aplicaciones sobreescriban los clusters libres o el SSD despache comandos TRIM destructivos.',
    relatedInvestigationCode: '14.14',
  },
  {
    id: 'q14-10',
    questionNumber: 10,
    category: 'NTFS_MFT_Y_METADATOS',
    question: 'Si una partición está cifrada con BitLocker (AES-256) y se perdió la contraseña y la clave de recuperación de 48 dígitos, ¿qué probabilidad existe de recuperar los archivos mediante software pericial?',
    options: [
      { id: 'a', text: '95%, porque el software forense puede descifrar claves AES en unos minutos mediante fuerza bruta.' },
      { id: 'b', text: '50%, dependiendo de si el disco es mecánico o de estado sólido.' },
      { id: 'c', text: '0%, debido a que los datos cifrados sin la clave son indistinguibles de ruido blanco aleatorio con máxima entropía de Shannon.' },
      { id: 'd', text: '100%, contactando al soporte técnico de Microsoft con la factura de compra de la PC.' },
    ],
    correctOptionId: 'c',
    technicalExplanation: 'AES-256 es matemáticamente invulnerable a ataques por fuerza bruta con la tecnología actual. Sin la clave ni el TPM accesible, los datos son irrecuperables.',
    relatedInvestigationCode: '14.15',
  },
];
