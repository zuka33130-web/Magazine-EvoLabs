// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 12: DISCOS Y PARTICIONES // DE "C:" A ENTENDER REALMENTE EL ALMACENAMIENTO

export type RiskLevelSector12 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector12Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetComponent: string;
  commandName: string;
  riskLevel: RiskLevelSector12;
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

export interface Sector12MiniCase {
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

export interface Sector12TestQuestion {
  id: string;
  questionNumber: number;
  category: 'TOPOLOGIA_FISICA_LOGICA' | 'GPT_VS_MBR' | 'SISTEMAS_ARCHIVOS' | 'DISKPART_Y_OPERACIONES';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_12_INVESTIGATIONS: Sector12Investigation[] = [
  {
    id: 'sec-12-01',
    code: '12.01',
    title: 'Disco físico',
    subtitle: 'El hardware subyacente: NVMe, SATA, buses y abstracción de bloques LBA',
    targetComponent: '\\Device\\Harddisk0\\DR0 (PhysicalDrive0)',
    commandName: 'wmic diskdrive list / Get-PhysicalDisk',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows no interactúa directamente con los chips NAND ni con los platos magnéticos: delega en el bus PCIe/SATA la entrega de una secuencia lineal de Logical Block Addressing (LBA).',
      mythVsTruth: {
        mentira: 'Windows "sabe" dónde cae físicamente cada celda o sector en el silicio o plato del disco.',
        verdad: 'El firmware del controlador de la unidad expone una abstracción matemática de bloques lógicos LBA (0 a N-1). En NVMe o SSD, el FTL (Flash Translation Layer) traduce dinámicamente cada LBA a bloques físicos de silicio.',
        comprobalo: 'Ejecutá Get-PhysicalDisk | Select DeviceId, FriendlyName, MediaType, BusType para ver la topología exacta reconocida por el kernel.',
      },
    },
    entende: {
      queEs: 'La entidad física de almacenamiento montada por el subsistema storport.sys o spaceport.sys conectada mediante protocolos NVMe, AHCI o SAS.',
      paraQueSirve: 'Es el contenedor base sobre el cual se escribe la tabla de particionado (GPT o MBR). Sin disco físico inicializado no existen particiones ni volúmenes.',
      quePasaSiFalta: 'Si un disco físico experimenta fallas en el bus PCIe o en el cable SATA, el sistema arroja errores I/O Event ID 153/129 en el visor de eventos y la unidad desaparece del árbol de dispositivos.',
    },
    interactua: {
      cliExample: 'wmic diskdrive get DeviceID,Model,InterfaceType,Partitions,Size,Status',
      psExample: 'Get-PhysicalDisk | Select DeviceId, FriendlyName, MediaType, BusType, OperationalStatus, HealthStatus',
      syntaxBreakdown: 'wmic diskdrive consulta WMI clase Win32_DiskDrive mientras Get-PhysicalDisk invoca directamente las APIs del Storage Management Module de PowerShell.',
      whatToLookFor: 'OperationalStatus = "OK" y HealthStatus = "Healthy". Verificá si BusType es NVMe o SATA.',
      technicalMetrics: 'LBA sector size: 512e (emulado) o 4Kn (nativo de 4096 bytes).',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura inofensiva. La enumeración física no altera las tablas de descriptores.',
      safetyWarning: 'Confundir el índice PhysicalDriveX en utilidades de bajo nivel como dd o diskpart destruye el disco equivocado en segundos.',
    },
    evidenceBadge: {
      code: 'PHYSICAL_TOPOLOGY_01',
      label: 'STORAGE TOPOLOGY'
    }
  },
  {
    id: 'sec-12-02',
    code: '12.02',
    title: 'Partición',
    subtitle: 'Segmentación lineal contigua de sectores LBA con límites rígidos',
    targetComponent: '\\Device\\Harddisk0\\Partition1',
    commandName: 'Get-Partition / diskpart list part',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Una partición no almacena archivos por sí misma: es simplemente un rango numérico de LBA inicial a LBA final delimitado en una cabecera de disco.',
      mythVsTruth: {
        mentira: 'Una partición y un volumen son la misma cosa con diferente nombre.',
        verdad: 'La partición es la división geométrica del contenedor físico. El volumen es la entidad formateable montable en el espacio de nombres del sistema de archivos de Windows.',
        comprobalo: 'En diskpart ejecutá "list partition" y comparalo con "list volume": una partición MSR o EFI existe sin ser un volumen asignable.',
      },
    },
    entende: {
      queEs: 'Un subconjunto contiguo de bloques LBA dentro de un disco físico, identificado por un índice numérico y un GUID o ID de tipo.',
      paraQueSirve: 'Permite aislar diferentes subsistemas en el mismo disco: el bootloader UEFI (ESP), la reserva técnica del kernel (MSR), el sistema operativo (C:) y el entorno de rescate (Recovery).',
      quePasaSiFalta: 'Sin una partición válida, el espacio es tratado como espacio sin asignar (Unallocated Space) y ningún sistema de archivos puede montarse.',
    },
    interactua: {
      cliExample: 'diskpart -> select disk 0 -> list partition',
      psExample: 'Get-Partition -DiskNumber 0 | Select DiskNumber, PartitionNumber, DriveLetter, Size, Type, Offset',
      syntaxBreakdown: 'Offset especifica la distancia exacta en bytes desde LBA 0. En discos modernos siempre debe ser múltiplo de 1048576 bytes (1 MB) para garantizar alineación 4K.',
      whatToLookFor: 'Valores de Offset múltiplos exactos de 1 MB (1048576) para evitar el temido desalineamiento de clústeres.',
      technicalMetrics: 'Alignment check: Offset % 4096 === 0.',
    },
    alertaEVO: {
      reversibilityRule: 'La inspección de particiones es no destructiva.',
      safetyWarning: 'Modificar manualmente el LBA de inicio de una partición con herramientas no oficiales destruye la cabecera del boot sector del volumen subyacente.',
    },
    evidenceBadge: {
      code: 'PARTITION_BOUNDS_02',
      label: 'LBA BOUNDARIES'
    }
  },
  {
    id: 'sec-12-03',
    code: '12.03',
    title: 'Volumen',
    subtitle: 'La capa lógica formateable gestionada por el Volume Manager de Windows',
    targetComponent: '\\Device\\HarddiskVolumeX',
    commandName: 'Get-Volume / diskpart list volume',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Un volumen puede residir en una sola partición básica o abarcar múltiples particiones distribuidas en diferentes discos físicos mediante volúmenes dinámicos o Storage Spaces.',
      mythVsTruth: {
        mentira: 'Todo volumen corresponde 1 a 1 a una partición contigua de un disco físico.',
        verdad: 'En configuraciones dinámicas (Spanned, Striped RAID-0, Mirrored RAID-1) o Storage Spaces, un único volumen lógico \\Device\\HarddiskVolumeX agrega bloques de múltiples discos.',
        comprobalo: 'Ejecutá Get-Volume | Select DriveLetter, FileSystem, Size, SizeRemaining, HealthStatus.',
      },
    },
    entende: {
      queEs: 'La abstracción lógica de más alto nivel de almacenamiento de bloques, expuesta como una unidad de montaje formateada con NTFS, FAT32, exFAT o ReFS.',
      paraQueSirve: 'Provee al kernel de Windows y a las aplicaciones de usuario un espacio direccionable por archivos, directorios y permisos de seguridad.',
      quePasaSiFalta: 'Si un volumen pierde su firma o formato (mostrándose como RAW), Windows impide el acceso con el mensaje "El volumen no contiene un sistema de archivos reconocido".',
    },
    interactua: {
      cliExample: 'diskpart -> list volume',
      psExample: 'Get-Volume | Format-Table DriveLetter, FileSystemLabel, FileSystem, DriveType, HealthStatus, SizeRemaining',
      syntaxBreakdown: 'Get-Volume interactúa con el WMI Storage Provider (root/Microsoft/Windows/Storage) para obtener el estado de salud y ocupación de los volúmenes del sistema.',
      whatToLookFor: 'FileSystem debe mostrar NTFS o FAT32 (nunca RAW). HealthStatus debe ser "Healthy".',
      technicalMetrics: 'Cluster Size (Allocation Unit Size): típicamente 4096 bytes en NTFS estándar.',
    },
    alertaEVO: {
      reversibilityRule: 'Operación de solo lectura diagnóstica.',
      safetyWarning: 'Intentar formatear un volumen sin verificar su DriveLetter o FileSystemLabel borra inmediatamente la tabla de archivos maestros MFT.',
    },
    evidenceBadge: {
      code: 'VOLUME_ABSTRACTION_03',
      label: 'FS LOGICAL VOLUME'
    }
  },
  {
    id: 'sec-12-04',
    code: '12.04',
    title: 'Drive Letter',
    subtitle: 'El mapa de DOS Devices: cómo Windows asigna C:, D: y resuelve Volume GUIDs',
    targetComponent: '\\GLOBAL??\\C: -> \\Device\\HarddiskVolumeX',
    commandName: 'mountvol / Get-Volume',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Las letras C:, D: o E: no existen en el kernel NT: son únicamente enlaces simbólicos de compatibilidad DOS administrados en el Object Manager bajo \\DosDevices o \\GLOBAL??.',
      mythVsTruth: {
        mentira: 'Windows necesita obligatoriamente una letra de unidad para poder usar un disco o partición.',
        verdad: 'Una partición puede montarse perfectamente sin letra mediante una ruta GUID universal (\\\\?\\Volume{GUID}\\) o en una carpeta vacía de otra partición NTFS mediante un punto de montaje (Junction).',
        comprobalo: 'Ejecutá "mountvol" en CMD para ver la lista de todos los volúmenes montados con y sin letra asignada.',
      },
    },
    entende: {
      queEs: 'Un puntero alfabético histórico del subsistema Win32 asignado por el Mount Manager (mountmgr.sys) y persistido en el Registro bajo HKLM\\SYSTEM\\MountedDevices.',
      paraQueSirve: 'Mantiene la compatibilidad hacia atrás con el direccionamiento clásico de DOS y facilita la navegación del usuario común.',
      quePasaSiFalta: 'Si se le quita la letra a una partición de datos (por ejemplo D:), el volumen sigue existiendo íntegro pero desaparece del explorador "Este equipo".',
    },
    interactua: {
      cliExample: 'mountvol',
      psExample: 'Get-Partition | Where-Object DriveLetter -ne 0 | Select DriveLetter, DiskNumber, PartitionNumber, AccessPaths',
      syntaxBreakdown: 'mountvol muestra el mapeo entre letras de unidad, puntos de montaje en directorios y los identificadores únicos globales (Volume GUIDs).',
      whatToLookFor: 'Identificar volúmenes sin letra (como EFI y Recovery) que poseen paths \\\\?\\Volume{...}\\.',
      technicalMetrics: 'Registro canónico de persistencia: HKLM\\SYSTEM\\MountedDevices\\DosDevices\\C:.',
    },
    alertaEVO: {
      reversibilityRule: 'Comando de diagnóstico pasivo.',
      safetyWarning: 'Nunca elimines la letra C: de la partición de sistema en ejecución, provocaría fallas inmediatas en los punteros de rutas absolutas del kernel.',
    },
    evidenceBadge: {
      code: 'DRIVE_LETTER_MAP_04',
      label: 'DOS SYM LINK'
    }
  },
  {
    id: 'sec-12-05',
    code: '12.05',
    title: 'GPT',
    subtitle: 'GUID Partition Table: cabeceras redundantes, 128 particiones y soporte > 2.2 TB',
    targetComponent: 'LBA 1 (Primary GPT) & LBA -1 (Backup GPT Header)',
    commandName: 'diskpart -> detail disk / Get-Disk',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'GPT no solo permite discos de hasta 9.4 Zettabytes y 128 particiones: guarda una copia idéntica de toda la tabla de particiones en el último sector físico del disco para auto-reparación.',
      mythVsTruth: {
        mentira: 'Si la cabecera GPT se corrompe por un corte eléctrico o virus, el disco pierde sus particiones para siempre.',
        verdad: 'El firmware UEFI y Windows detectan la discrepancia de CRC32 en LBA 1 y restauran automáticamente la tabla primaria leyendo la cabecera secundaria (Backup GPT) alojada al final de la unidad.',
        comprobalo: 'Ejecutá Get-Disk | Select Number, FriendlyName, PartitionStyle, TotalSize para confirmar que PartitionStyle sea GPT.',
      },
    },
    entende: {
      queEs: 'El estándar de arquitectura de tablas de partición del consorcio UEFI que reemplazó al MBR tradicional de la era IBM PC.',
      paraQueSirve: 'Identifica cada partición con un GUID único a nivel global de 128 bits, incluye suma de comprobación CRC32 de integridad y elimina el límite de 4 particiones primarias.',
      quePasaSiFalta: 'Windows 11 exige obligatoriamente UEFI y GPT. Un disco inicializado en MBR no puede arrancar Windows 11 en modo nativo seguro (Secure Boot).',
    },
    interactua: {
      cliExample: 'powershell "Get-Disk | Format-Table Number, FriendlyName, PartitionStyle, OperationalStatus"',
      psExample: 'Get-Disk | Select Number, PartitionStyle, @{N="IsGPT";E={$_.PartitionStyle -eq "GPT"}}, NumberOfPartitions',
      syntaxBreakdown: 'PartitionStyle = "GPT" indica que los primeros sectores contienen Protective MBR (LBA 0) y GPT Header (LBA 1).',
      whatToLookFor: 'Confirmar que PartitionStyle sea estrictamente "GPT" en el disco de arranque principal.',
      technicalMetrics: 'GPT Header CRC32 offset: bytes 16 a 19 en LBA 1.',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de solo lectura.',
      safetyWarning: 'Convertir un disco de MBR a GPT sin mbr2gpt.exe o formateando desde diskpart destruye todas las particiones existentes.',
    },
    evidenceBadge: {
      code: 'GPT_SPEC_HEADER_05',
      label: 'UEFI GPT STANDARD'
    }
  },
  {
    id: 'sec-12-06',
    code: '12.06',
    title: 'MBR',
    subtitle: 'Master Boot Record: arquitectura legacy de 1983, límite de 2.2 TB y 4 particiones',
    targetComponent: 'LBA 0 (Offset 0x0000 a 0x01FF - 512 bytes)',
    commandName: 'wmic partition get Type / Get-Disk',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El MBR almacena el código de arranque original del BIOS en 446 bytes y solo tiene 64 bytes para su tabla de particiones: 4 entradas de 16 bytes exactos.',
      mythVsTruth: {
        mentira: 'El límite de 2.2 Terabytes en MBR es un capricho comercial de Microsoft.',
        verdad: 'Es una limitación matemática dura: MBR usa enteros de 32 bits para el conteo de sectores LBA. Con sectores de 512 bytes: 2^32 * 512 = 2.199.023.255.552 bytes (2.19 TB exactos).',
        comprobalo: 'Inspeccioná la firma de arranque 0x55AA al final del primer sector de 512 bytes en cualquier disco MBR tradicional.',
      },
    },
    entende: {
      queEs: 'El primer sector físico (LBA 0) de un medio de almacenamiento formateado según la especificación clásica de arranque de PC.',
      paraQueSirve: 'Servía para que el BIOS cargara la rutina de bootstrap inicial e identificara la partición activa con el flag 0x80 para transferirle el control.',
      quePasaSiFalta: 'Si la firma 0x55AA se altera en un disco MBR, el BIOS reporta "Operating System Not Found" o "Missing Operating System".',
    },
    interactua: {
      cliExample: 'diskpart -> select disk 0 -> detail disk',
      psExample: 'Get-Disk | Where-Object PartitionStyle -eq "MBR" | Select Number, FriendlyName, TotalSize',
      syntaxBreakdown: 'En discos modernos con GPT, LBA 0 contiene un "Protective MBR" que abarca todo el disco como tipo 0xEE para evitar que utilidades antiguas sobrescriban la tabla GPT.',
      whatToLookFor: 'Presencia de Protective MBR o discos secundarios de backup formateados en modo MBR legacy.',
      technicalMetrics: 'MBR Boot Code: 446 bytes. Partition Table: 64 bytes (4x16B). Magic Signature: 2 bytes (0x55AA).',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta sin riesgos.',
      safetyWarning: 'Escribir directamente en LBA 0 de un disco GPT con utilidades MBR corrompe el Protective MBR y arruina la cadena de booteo.',
    },
    evidenceBadge: {
      code: 'MBR_LEGACY_SPEC_06',
      label: 'LEGACY MBR'
    }
  },
  {
    id: 'sec-12-07',
    code: '12.07',
    title: 'EFI',
    subtitle: 'EFI System Partition (ESP): la partición FAT32 que arranca Windows moderno',
    targetComponent: '\\Device\\HarddiskVolume1 (GUID c12a7328-f81f-11d2-ba4b-00a0c93ec93b)',
    commandName: 'bcdedit /enum {bootmgr} / diskpart list part',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La partición EFI no tiene letra de unidad en Windows por razones de seguridad, pero es un volumen FAT32 estándar que contiene el ejecutable bootmgfw.efi y la base de datos BCD.',
      mythVsTruth: {
        mentira: 'Windows arranca leyendo archivos directamente desde C:\\Windows.',
        verdad: 'El microcódigo UEFI de la placa madre no entiende NTFS: solo lee FAT32. Carga primero \\EFI\\Microsoft\\Boot\\bootmgfw.efi desde la partición ESP, el cual recién monta el driver NTFS para leer C:.',
        comprobalo: 'Asigná una letra temporal en diskpart a la partición EFI con "assign letter=S" y hacé "dir S:\\EFI" en CMD administrador.',
      },
    },
    entende: {
      queEs: 'Una partición obligatoria en discos GPT formateada en FAT32 (usualmente entre 100 MB y 260 MB) identificada por un GUID universal reservado por la especificación UEFI.',
      paraQueSirve: 'Aloja los cargadores de arranque (.efi), drivers previos al kernel y los almacenes de configuración de arranque (BCD).',
      quePasaSiFalta: 'Si la partición EFI es eliminada o formateada por error, la computadora arrojará una pantalla azul o negra indicando "No Bootable Device Found" (error 0xc000000e).',
    },
    interactua: {
      cliExample: 'diskpart -> select disk 0 -> list partition (identificar tipo System de ~100MB)',
      psExample: 'Get-Partition -DiskNumber 0 | Where-Object GptType -eq "{c12a7328-f81f-11d2-ba4b-00a0c93ec93b}" | Select PartitionNumber, Size, GptType',
      syntaxBreakdown: 'GptType c12a7328-f81f-11d2-ba4b-00a0c93ec93b es el identificador oficial mundial de EFI System Partition.',
      whatToLookFor: 'Tamaño entre 100 MB y 500 MB, sistema de archivos FAT32, tipo "System".',
      technicalMetrics: 'Ruta canónica: \\EFI\\Microsoft\\Boot\\BCD.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura no invasiva.',
      safetyWarning: 'Nunca borres archivos dentro de \\EFI\\Microsoft\\Boot\\ a menos que estés reconstruyendo deliberadamente el BCD con bcdboot S:\\Windows /s S: /f UEFI.',
    },
    evidenceBadge: {
      code: 'EFI_ESP_PARTITION_07',
      label: 'UEFI SYSTEM PART'
    }
  },
  {
    id: 'sec-12-08',
    code: '12.08',
    title: 'MSR',
    subtitle: 'Microsoft Reserved Partition: los 16 MB ocultos del subsistema de storage',
    targetComponent: 'Partition Type GUID e3c9e310-0b5c-450a-9f5e-49dc47410617',
    commandName: 'diskpart list part / Get-Partition',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La partición MSR no tiene sistema de archivos alguno: son 16 MB de sectores crudos reservados para que los controladores de Windows puedan almacenar metadatos de reconfiguración.',
      mythVsTruth: {
        mentira: 'La partición MSR está vacía y se puede borrar para ganar 16 megabytes.',
        verdad: 'MSR es el amortiguador de particionamiento de Windows. Si se convierte un disco básico a dinámico o se opera con BitLocker, Windows utiliza estos sectores sin alterar las otras particiones.',
        comprobalo: 'En diskpart ejecutá "list partition" en cualquier disco GPT de Windows 10/11 y verás la partición "Reservado" de 16 MB.',
      },
    },
    entende: {
      queEs: 'Una partición técnica obligatoria en el esquema de particionado estándar de Microsoft para discos GPT.',
      paraQueSirve: 'Reserva espacio contiguo antes de las particiones de datos para operaciones críticas de LDM (Logical Disk Manager) y metadatos de seguridad.',
      quePasaSiFalta: 'Si falta MSR, Windows puede seguir arrancando, pero fallarán conversiones de discos, particionados avanzados o ciertas actualizaciones mayores acumulativas de versión.',
    },
    interactua: {
      cliExample: 'diskpart -> select disk 0 -> list partition (buscar Tipo: Reservado)',
      psExample: 'Get-Partition -DiskNumber 0 | Where-Object GptType -eq "{e3c9e310-0b5c-450a-9f5e-49dc47410617}" | Select PartitionNumber, Size, GptType',
      syntaxBreakdown: 'El GUID e3c9e310-0b5c-450a-9f5e-49dc47410617 es exclusivo de Microsoft Corporation para la partición MSR.',
      whatToLookFor: 'Tamaño exacto de 16 MB (16777216 bytes) o 128 MB en instalaciones muy antiguas de Windows 7/8.',
      technicalMetrics: 'Sin FileSystem (RAW), flag hidden/system implícito en el kernel.',
    },
    alertaEVO: {
      reversibilityRule: 'Seguro en lectura.',
      safetyWarning: 'No intentes asignarle letra ni formatearla: destruirá los metadatos internos del administrador de almacenamiento.',
    },
    evidenceBadge: {
      code: 'MSR_RESERVED_08',
      label: 'MS RESERVED 16MB'
    }
  },
  {
    id: 'sec-12-09',
    code: '12.09',
    title: 'Recovery',
    subtitle: 'Partición de recuperación: el contenedor seguro de WinRE y winre.wim',
    targetComponent: 'Partition Type GUID de94bba4-06d1-4d40-a16a-bfd50179d6ac',
    commandName: 'reagentc /info / Get-Partition',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La partición Recovery contiene una imagen completa de Windows PE comprimida (winre.wim) capaz de rescatar el sistema operativo cuando el kernel principal queda inoperable.',
      mythVsTruth: {
        mentira: 'La partición de recuperación es solo basura del fabricante que se puede borrar sin consecuencias.',
        verdad: 'Sin esta partición, la función "Reparación de inicio", "Restablecer este equipo" y la consola de recuperación avanzada F8/Shift quedan completamente deshabilitadas.',
        comprobalo: 'Ejecutá "reagentc /info" en CMD administrador para ver la ruta exacta del archivo winre.wim en la partición Recovery.',
      },
    },
    entende: {
      queEs: 'Una partición NTFS con atributos especiales GPT (0x8000000000000001: no-drive-letter, hidden) ubicada generalmente al final del disco de sistema.',
      paraQueSirve: 'Permite que Windows inicie un mini-entorno autónomo con herramientas de diagnóstico cuando el kernel detecta fallas consecutivas de booteo.',
      quePasaSiFalta: 'reagentc /info mostrará "Windows RE status: Disabled", dejando al usuario sin opciones de rescate local ante una pantalla azul crítica.',
    },
    interactua: {
      cliExample: 'reagentc /info',
      psExample: 'Get-Partition -DiskNumber 0 | Where-Object GptType -eq "{de94bba4-06d1-4d40-a16a-bfd50179d6ac}" | Select PartitionNumber, Size, Offset',
      syntaxBreakdown: 'reagentc consulta el archivo ReAgent.xml en C:\\Windows\\System32\\Recovery para obtener el BCD identifier y LBA target de WinRE.',
      whatToLookFor: 'Windows RE status: Enabled y ubicación de WinRE apuntando a partitionX.',
      technicalMetrics: 'Tamaño estándar: 500 MB a 900 MB (puede requerir ampliación con actualizaciones acumulativas de parches KB5034441).',
    },
    alertaEVO: {
      reversibilityRule: 'Verificación de estado inofensiva.',
      safetyWarning: 'Eliminar la partición Recovery sin mover winre.wim a C:\\ desactiva instantáneamente la protección WinRE.',
    },
    evidenceBadge: {
      code: 'RECOVERY_WINRE_09',
      label: 'RECOVERY ENVIRONMENT'
    }
  },
  {
    id: 'sec-12-10',
    code: '12.10',
    title: 'NTFS',
    subtitle: 'New Technology File System: $MFT, $LogFile, USN Journal y seguridad ACL',
    targetComponent: 'NTFS Volume Structure ($MFT & Metadata Files)',
    commandName: 'fsutil fsinfo ntfsinfo C:',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En NTFS, absolutamente todo es un archivo: incluso la estructura que define dónde están los archivos es un archivo oculto llamado $MFT (Master File Table).',
      mythVsTruth: {
        mentira: 'NTFS es solo una lista de nombres de archivos con carpetas.',
        verdad: 'NTFS es una base de datos relacional transaccional completa con journaling ($LogFile) que garantiza que un corte de energía no corrompa el árbol de datos.',
        comprobalo: 'Ejecutá "fsutil fsinfo ntfsinfo C:" en CMD administrador para ver la posición exacta del cluster inicial de la $MFT y el tamaño de sectores.',
      },
    },
    entende: {
      queEs: 'El sistema de archivos moderno principal de Windows desde Windows NT 3.1, con soporte para compresión, cifrado EFS, cuotas y permisos de seguridad DACL.',
      paraQueSirve: 'Almacena archivos de hasta 16 Exabytes con transacciones atómicas garantizadas y registro de cambios instantáneo (USN Change Journal).',
      quePasaSiFalta: 'Windows 10/11 no puede instalarse en un sistema de archivos que no sea NTFS en su volumen C: raíz.',
    },
    interactua: {
      cliExample: 'fsutil fsinfo ntfsinfo C:',
      psExample: 'Get-Volume -DriveLetter C | Select DriveLetter, FileSystem, AllocationUnitSize, Size, SizeRemaining',
      syntaxBreakdown: 'fsutil ntfsinfo expone los metadatos internos del controlador ntfs.sys: clúster de $MFT, número de sectores y tamaño de registro de archivo (1024 bytes).',
      whatToLookFor: 'Bytes Per Cluster: 4096 (4KB) y estado de salud limpio.',
      technicalMetrics: '$MFT Record Size: 1024 bytes. Journal file: $LogFile.',
    },
    alertaEVO: {
      reversibilityRule: 'Comando de solo lectura.',
      safetyWarning: 'Modificar atributos de sistema en archivos de metadatos NTFS ($Volume, $MFT) con editores hexadecimales destruye la consistencia del volumen.',
    },
    evidenceBadge: {
      code: 'NTFS_MFT_ENGINE_10',
      label: 'NTFS METADATA'
    }
  },
  {
    id: 'sec-12-11',
    code: '12.11',
    title: 'FAT32',
    subtitle: 'File Allocation Table 32: compatibilidad universal y el límite de 4 GB por archivo',
    targetComponent: 'FAT32 Boot Sector & File Allocation Table',
    commandName: 'fsutil fsinfo volumeinfo <drive> / Get-Volume',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'FAT32 es un diseño de 1996 que sigue gobernando el mundo moderno porque es el único sistema de archivos que el estándar UEFI exige implementar a todos los fabricantes de motherboards.',
      mythVsTruth: {
        mentira: 'Windows no puede formatear memorias USB mayores a 32 GB en FAT32 porque el protocolo FAT32 no lo soporta.',
        verdad: 'FAT32 soporta volúmenes teóricos de hasta 2 TB o incluso 16 TB. La limitación a 32 GB en la interfaz gráfica de Windows fue impuesta artificialmente por Dave Plummer en 1994 para forzar la adopción de NTFS.',
        comprobalo: 'Intentá copiar un archivo ISO de 4.5 GB a un pendrive FAT32: Windows arrojará "El archivo es demasiado grande para el sistema de archivos de destino".',
      },
    },
    entende: {
      queEs: 'Un sistema de archivos simple basado en tablas de asignación encadenadas de 32 bits (de los cuales se usan 28 bits).',
      paraQueSirve: 'Ideal para la partición EFI del sistema, pendrives de instalación y tarjetas de memoria que requieran máxima compatibilidad con routers, consolas y autos.',
      quePasaSiFalta: 'Si la partición EFI se formatea en NTFS en lugar de FAT32, la motherboard UEFI no podrá detectarla ni iniciar Windows.',
    },
    interactua: {
      cliExample: 'cmd /c format /? | findstr /i "FAT32"',
      psExample: 'Get-Volume | Where-Object FileSystem -eq "FAT32" | Select DriveLetter, FileSystemLabel, Size, AllocationUnitSize',
      syntaxBreakdown: 'FAT32 no soporta permisos NTFS (ACLs), journaling ni compresión de archivos nativa.',
      whatToLookFor: 'Límite máximo por archivo individual: 4.294.967.295 bytes (4 GB - 1 byte).',
      technicalMetrics: 'Max file size: 4 GB - 1B. Table entry: 28-bit addressed.',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de solo lectura.',
      safetyWarning: 'Convertir un pendrive con instaladores WIM mayores a 4 GB a FAT32 corrompe el archivo install.wim a menos que se divida en fragmentos .swm.',
    },
    evidenceBadge: {
      code: 'FAT32_COMPAT_11',
      label: 'FAT32 4GB LIMIT'
    }
  },
  {
    id: 'sec-12-12',
    code: '12.12',
    title: 'exFAT',
    subtitle: 'Extended FAT: alta capacidad y sin límite de 4 GB para memorias flash externas',
    targetComponent: 'exFAT Superblock & VBR',
    commandName: 'Get-Volume / format <drive> /FS:exFAT',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'exFAT fue creado por Microsoft específicamente para eliminar el límite de 4 GB de FAT32 sin la sobrecarga ni el desgaste de escrituras frecuentes que causa el journaling de NTFS en memorias Flash/SD.',
      mythVsTruth: {
        mentira: 'exFAT es tan robusto y seguro ante cortes de energía repentinos como NTFS.',
        verdad: 'exFAT carece de Journal transaccional ($LogFile). Si se desconecta un pendrive exFAT en plena escritura sin "Quitar con seguridad", la tabla de asignación de clústeres puede quedar rota.',
        comprobalo: 'Observá las opciones de formato al conectar un pendrive de 64 GB o disco externo: exFAT aparece como el estándar predeterminado de Windows.',
      },
    },
    entende: {
      queEs: 'Un sistema de archivos de 64 bits optimizado para medios de almacenamiento extraíbles flash de alta capacidad (SDXC, unidades USB).',
      paraQueSirve: 'Permite transferir archivos masivos de video 4K (>100 GB) entre Windows, macOS y Linux sin limitaciones de tamaño de archivo.',
      quePasaSiFalta: 'Sin soporte exFAT, los discos externos compartidos entre Windows y Mac se ven forzados a usar FAT32 (fragmentando archivos grandes) o NTFS (solo lectura en macOS).',
    },
    interactua: {
      cliExample: 'fsutil fsinfo volumeinfo E: (en unidad exFAT)',
      psExample: 'Get-Volume | Where-Object FileSystem -eq "exFAT" | Select DriveLetter, FileSystem, AllocationUnitSize, Size',
      syntaxBreakdown: 'exFAT utiliza bitmaps de asignación contigua para optimizar el rendimiento de escritura secuencial masiva.',
      whatToLookFor: 'FileSystem = "exFAT", cluster size de 128 KB predeterminado para grandes capacidades.',
      technicalMetrics: 'Límite de archivo teórico: 16 Exabytes. Sin Journal transaccional.',
    },
    alertaEVO: {
      reversibilityRule: 'Comando no invasivo.',
      safetyWarning: 'Nunca uses exFAT para instalar Windows o alojar bases de datos críticas; carece de permisos de seguridad por usuario y mecanismos de rollback transaccional.',
    },
    evidenceBadge: {
      code: 'EXFAT_FLASH_OPTIM_12',
      label: 'EXFAT EXTERNAL'
    }
  },
  {
    id: 'sec-12-13',
    code: '12.13',
    title: 'Disk Management',
    subtitle: 'La consola diskmgmt.msc y la arquitectura del Virtual Disk Service (vds.exe)',
    targetComponent: 'Virtual Disk Service (vds.exe) & diskmgmt.msc',
    commandName: 'diskmgmt.msc / Get-Service vds',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La interfaz gráfica de Administración de Discos no toca directamente el hardware: se comunica mediante RPC con el servicio "vds" (Virtual Disk Service) de Windows.',
      mythVsTruth: {
        mentira: 'Si una partición no se puede extender o mover en diskmgmt.msc, el disco tiene un daño físico irreparable.',
        verdad: 'diskmgmt.msc tiene una regla estricta: solo puede extender una partición hacia espacio no asignado que esté inmediata y físicamente contiguo a la DERECHA.',
        comprobalo: 'Abrí "diskmgmt.msc" y observá que el botón "Extender volumen" aparece en gris si hay una partición de rescate intermedia entre C: y el espacio libre.',
      },
    },
    entende: {
      queEs: 'El complemento MMC oficial para la gestión visual del almacenamiento local y el subsistema VDS subyacente.',
      paraQueSirve: 'Permite inicializar discos (MBR/GPT), crear volúmenes simples, formatear, asignar letras y visualizar la topología de particiones.',
      quePasaSiFalta: 'Si el servicio vds.exe está deshabilitado o colgado, diskmgmt.msc se queda eternamente en "Cargando información de configuración del disco...".',
    },
    interactua: {
      cliExample: 'sc query vds',
      psExample: 'Get-Service vds | Select Name, DisplayName, Status, StartType',
      syntaxBreakdown: 'El servicio Virtual Disk (vds) se inicia bajo demanda (Manual) y se apaga automáticamente tras cerrar las herramientas de administración.',
      whatToLookFor: 'Status: Running al abrir diskmgmt.msc o invocar diskpart.',
      technicalMetrics: 'Servicio RPC: Virtual Disk Service (vds.exe).',
    },
    alertaEVO: {
      reversibilityRule: 'Solo lectura e inspección de servicios.',
      safetyWarning: 'No fuerces el cierre de vds.exe mientras se realiza una operación de redimensionamiento de partición.',
    },
    evidenceBadge: {
      code: 'DISKMGMT_VDS_13',
      label: 'VDS ARCHITECTURE'
    }
  },
  {
    id: 'sec-12-14',
    code: '12.14',
    title: 'Reducir',
    subtitle: 'Shrink volume: archivos inamovibles, $MFT Mirror, pagefile y límites de contracción',
    targetComponent: 'NTFS Filesystem Allocation & Unmovable Files',
    commandName: 'diskpart -> shrink querymax / Resize-Partition',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '¿Por qué Windows te dice que solo podés reducir 20 GB de un disco que tiene 300 GB libres? La culpa es de los "archivos no reubicables" fijados al final del volumen.',
      mythVsTruth: {
        mentira: 'Windows puede compactar y mover libremente cualquier archivo hacia el inicio del disco al reducir.',
        verdad: 'Archivos críticos como pagefile.sys, hiberfil.sys, System Volume Information (puntos de restauración) y el $MFT Mirror no pueden moverse en caliente por el controlador NTFS.',
        comprobalo: 'Ejecutá en diskpart: "select volume C" y luego "shrink querymax" para ver el número exacto de megabytes que Windows permite reducir en este instante.',
      },
    },
    entende: {
      queEs: 'La operación de truncamiento del límite final de sectores LBA asignados a un sistema de archivos NTFS para liberar espacio al final de la partición.',
      paraQueSirve: 'Genera espacio sin asignar para poder crear una nueva partición (por ejemplo, para separar documentos en D: o instalar Linux en dual-boot).',
      quePasaSiFalta: 'Si no se deshabilitan temporalmente la hibernación y la memoria virtual, el espacio reducible puede ser irrisorio aun con un disco casi vacío.',
    },
    interactua: {
      cliExample: 'diskpart -> select volume C -> shrink querymax',
      psExample: 'Get-PartitionSupportedSize -DriveLetter C | Select SizeMin, SizeMax',
      syntaxBreakdown: 'shrink querymax interroga al driver NTFS por el LBA del archivo inamovible más alejado de la cabecera.',
      whatToLookFor: 'La diferencia entre SizeMax y SizeMin en Get-PartitionSupportedSize indica el espacio reducible máximo actual.',
      technicalMetrics: 'Evento diagnóstico en Event Viewer: Event ID 259 (defrag/shrink diagnostics).',
    },
    alertaEVO: {
      reversibilityRule: 'querymax es completamente pasivo y seguro.',
      safetyWarning: 'Para maximizar el shrink: desactivá hiberfil (powercfg -h off), pagefile temporalmente y ejecutá defrag C: /X.',
    },
    evidenceBadge: {
      code: 'SHRINK_UNMOVABLE_14',
      label: 'SHRINK ALLOCATION'
    }
  },
  {
    id: 'sec-12-15',
    code: '12.15',
    title: 'Ampliar',
    subtitle: 'Extend volume: el requisito de contigüidad física a la derecha y el truco de diskpart',
    targetComponent: 'Partition Table LBA Range Extension',
    commandName: 'diskpart -> extend / Resize-Partition',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Para extender una partición básica sin convertir el disco en dinámico, el espacio libre debe estar físicamente pegado al final de la misma, sin particiones intermedias.',
      mythVsTruth: {
        mentira: 'Podés comprar un disco nuevo y "sumárselo" a C: en dos clics sin riesgos.',
        verdad: 'Si sumás espacio de otro disco físico, Windows se ve forzado a convertir el disco a "Dinámico" o "Spanned", rompiendo la compatibilidad de booteo de UEFI.',
        comprobalo: 'Revisá la posición de las particiones en "list partition": si entre C: y el espacio libre se interpone la partición de recuperación, extender estará bloqueado.',
      },
    },
    entende: {
      queEs: 'La modificación de la cabecera GPT para mover el LBA final de la partición y la subsecuente expansión de la estructura interna del sistema de archivos NTFS.',
      paraQueSirve: 'Permite agrandar el volumen del sistema o de datos aprovechando espacio liberado tras borrar una partición adyacente o clonar a un SSD mayor.',
      quePasaSiFalta: 'Si se amplía la partición en la tabla GPT pero falla la extensión de NTFS, el volumen seguirá reportando su tamaño antiguo en el Explorador.',
    },
    interactua: {
      cliExample: 'diskpart -> select volume C -> extend',
      psExample: 'Resize-Partition -DiskNumber 0 -PartitionNumber 3 -Size (500GB)',
      syntaxBreakdown: 'extend sin parámetros utiliza todo el espacio no asignado contiguo inmediatamente disponible a la derecha del volumen seleccionado.',
      whatToLookFor: 'Mensaje de DiskPart: "DiskPart ha extendido el volumen correctamente".',
      technicalMetrics: 'Requisito: Espacio contiguo no asignado en el mismo PhysicalDrive.',
    },
    alertaEVO: {
      reversibilityRule: 'Operación que altera la tabla de particiones pero preserva los datos existentes si hay espacio contiguo.',
      safetyWarning: 'Nunca conviertas el disco a "Dinámico" por accidente al intentar extender sobre otro disco físico.',
    },
    evidenceBadge: {
      code: 'EXTEND_CONTIGUOUS_15',
      label: 'EXTEND VOLUME'
    }
  },
  {
    id: 'sec-12-16',
    code: '12.16',
    title: 'Crear',
    subtitle: 'Particionamiento seguro: delimitación de tamaño, offsets y alineación 4K',
    targetComponent: 'New Partition Allocation Table Entry',
    commandName: 'diskpart -> create partition primary / New-Partition',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Cuando creás una partición con New-Partition o DiskPart, Windows calcula un offset alineado a 1 MB (LBA 2048) para evitar que una lectura lógica requiera dos lecturas físicas en el SSD.',
      mythVsTruth: {
        mentira: 'Cualquier offset numérico donde comience una partición da exactamente el mismo rendimiento.',
        verdad: 'Si una partición arranca desalineada con respecto a los bloques físicos de 4096 bytes del SSD (Advanced Format), cada lectura de 4K cruzará dos sectores físicos, degradando la velocidad hasta un 50%.',
        comprobalo: 'Inspeccioná el StartingOffset con wmic: debe ser divisible por 4096 sin resto (múltiplo de 1048576).',
      },
    },
    entende: {
      queEs: 'La reserva formal de una entrada en la tabla GPT/MBR asignando un LBA de inicio y un LBA de fin dentro del espacio libre del disco.',
      paraQueSirve: 'Segmentar el disco para alojar un nuevo sistema de archivos o aislar proyectos y respaldos del sistema operativo.',
      quePasaSiFalta: 'Si no se crea una partición, el espacio libre queda inaccesible para los subsistemas de archivos de Windows.',
    },
    interactua: {
      cliExample: 'diskpart -> select disk 0 -> create partition primary size=51200',
      psExample: 'New-Partition -DiskNumber 0 -Size 50GB -AssignDriveLetter',
      syntaxBreakdown: 'create partition primary size=51200 reserva exactamente 50 GB (51200 MB) calculando la alineación automática.',
      whatToLookFor: 'Creación exitosa y retorno del número de partición asignado.',
      technicalMetrics: 'Default sector alignment: 1048576 bytes (1 MB offset = LBA 2048).',
    },
    alertaEVO: {
      reversibilityRule: 'La creación sobre espacio no asignado no destruye datos existentes.',
      safetyWarning: 'Asegurate de tener seleccionado el disco físico correcto antes de ejecutar cualquier comando de creación.',
    },
    evidenceBadge: {
      code: 'CREATE_PARTITION_16',
      label: '4K ALIGNMENT'
    }
  },
  {
    id: 'sec-12-17',
    code: '12.17',
    title: 'Eliminar',
    subtitle: 'Destrucción de particiones: flags de protección del sistema y el parámetro override',
    targetComponent: 'Partition Table Descriptor Entry Erasure',
    commandName: 'diskpart -> delete partition override / Remove-Partition',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'Windows impide por defecto borrar particiones de recuperación o del sistema en la interfaz gráfica. En DiskPart es necesario el parámetro explícito "override" para forzar la eliminación.',
      mythVsTruth: {
        mentira: 'Eliminar una partición borra físicamente todos los ceros y unos de los archivos dentro del disco.',
        verdad: 'Solo se borra la entrada de 128 bytes en la tabla de particiones GPT. Los datos del sistema de archivos quedan intactos en los sectores físicos hasta que sean sobrescritos.',
        comprobalo: 'Herramientas forenses como TestDisk pueden reconstruir una partición borrada en 2 segundos si no se escribió encima.',
      },
    },
    entende: {
      queEs: 'La eliminación del registro descriptor en la tabla GPT/MBR, marcando esos sectores LBA como disponibles (Unallocated Space).',
      paraQueSirve: 'Limpiar esquemas de discos residuales, eliminar particiones de rescate antiguas de instalaciones previas o consolidar espacio contiguo.',
      quePasaSiFalta: 'Si se borra por error la partición EFI o la partición del sistema, Windows no volverá a iniciar tras el próximo apagado.',
    },
    interactua: {
      cliExample: 'diskpart -> select partition 4 -> delete partition override',
      psExample: 'Remove-Partition -DiskNumber 0 -PartitionNumber 4 -Confirm:$false',
      syntaxBreakdown: 'override indica a DiskPart que ignore los flags de protección GPT (ej. GPT_ATTRIBUTE_PLATFORM_REQUIRED o hidden).',
      whatToLookFor: 'DiskPart ha eliminado satisfactoriamente la partición seleccionada.',
      technicalMetrics: 'GPT Attribute Flag: 0x0000000000000001 (Required by system).',
    },
    alertaEVO: {
      reversibilityRule: 'Irreversible desde herramientas nativas básicas de Windows (requiere software de rescate de particiones como TestDisk).',
      safetyWarning: 'PELIGRO CRÍTICO: Verificar tres veces el número de disco y de partición antes de emitir "delete partition override".',
    },
    evidenceBadge: {
      code: 'DELETE_OVERRIDE_17',
      label: 'PARTITION PURGE'
    }
  },
  {
    id: 'sec-12-18',
    code: '12.18',
    title: 'Formatear',
    subtitle: 'Formato rápido vs completo: escritura de metadatos vs comprobación de sectores',
    targetComponent: 'Filesystem Boot Sector, Allocation Tables & Data Clusters',
    commandName: 'format <drive> /FS:NTFS /Q / Format-Volume',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'El formato rápido (/Q) tarda 3 segundos porque solo escribe las tablas maestras vacías. El formato completo de Windows desde Vista escribe ceros reales en cada sector LBA del volumen.',
      mythVsTruth: {
        mentira: 'El formato rápido es "inseguro" y deja fragmentos dañados en el disco.',
        verdad: 'En unidades SSD modernas, el formato rápido es el recomendado por los fabricantes: el formato completo desgasta los ciclos de escritura de la memoria NAND innecesariamente.',
        comprobalo: 'Ejecutá "format /?" y observá que el modificador /Q especifica "Realiza un formato rápido". Sin /Q, Windows sobrescribe todos los sectores con 0x00.',
      },
    },
    entende: {
      queEs: 'La inicialización de las estructuras de control del sistema de archivos (superbloque, bitmap de clústeres, directorio raíz y archivos de metadatos como $MFT).',
      paraQueSirve: 'Prepara una partición virgen o reciclada para que Windows pueda almacenar archivos bajo una arquitectura de asignación específica.',
      quePasaSiFalta: 'Una partición sin formatear permanece en estado "RAW", inaccesible para cualquier llamada Win32 CreateFile.',
    },
    interactua: {
      cliExample: 'format D: /FS:NTFS /V:DATOS /Q',
      psExample: 'Format-Volume -DriveLetter D -FileSystem NTFS -NewFileSystemLabel "DATOS" -AllocationUnitSize 4096',
      syntaxBreakdown: '/FS:NTFS especifica el sistema, /V:DATOS la etiqueta de volumen y /Q omite el escaneo físico y zero-fill de sectores.',
      whatToLookFor: 'Verificar el Allocation Unit Size (4096 para uso general, 64K para almacenamiento exclusivo de bases de datos o video pesado).',
      technicalMetrics: 'Quick format write size: ~100-300 MB de metadatos iniciales.',
    },
    alertaEVO: {
      reversibilityRule: 'Un formato completo (zero-fill) destruye irrevocablemente los datos. Un formato rápido permite recuperación forense parcial si no se escribieron datos nuevos.',
      safetyWarning: 'Asegurate de que la letra seleccionada (D:) no corresponda a un disco externo con backups personales.',
    },
    evidenceBadge: {
      code: 'FORMAT_STRUCTURES_18',
      label: 'FS ZERO & METADATA'
    }
  },
  {
    id: 'sec-12-19',
    code: '12.19',
    title: 'Asignar letra',
    subtitle: 'El Mount Manager: sincronización en HKLM\\SYSTEM\\MountedDevices',
    targetComponent: 'HKLM\\SYSTEM\\MountedDevices & MountMgr.sys',
    commandName: 'diskpart -> assign letter=X / Set-Partition',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Cuando conectás un pendrive que usaste hace un año y vuelve a aparecer con la letra F:, no es magia: Windows guardó el GUID de su volumen en el Registro bajo MountedDevices.',
      mythVsTruth: {
        mentira: 'Las letras de unidad se asignan al azar en cada reinicio de la máquina.',
        verdad: 'El Mount Manager mantiene un registro histórico permanente de cada firma de disco y Volume GUID asociado a su letra preferida.',
        comprobalo: 'Abrí regedit y navegá a HKLM\\SYSTEM\\MountedDevices: verás los valores binarios \\DosDevices\\C:, \\DosDevices\\D:, etc.',
      },
    },
    entende: {
      queEs: 'El proceso mediante el cual el sistema operativo vincula una ruta alfabética del espacio de nombres de DOS a un identificador de volumen interno de NT.',
      paraQueSirve: 'Permite al usuario interactuar visualmente con el volumen desde el Explorador de Archivos y aplicaciones convencionales.',
      quePasaSiFalta: 'Si el servicio Automount está deshabilitado, los discos externos recién conectados no recibirán letra y parecerán "invisibles" hasta que se les asigne manualmente.',
    },
    interactua: {
      cliExample: 'diskpart -> select volume 2 -> assign letter=E',
      psExample: 'Set-Partition -DiskNumber 0 -PartitionNumber 3 -NewDriveLetter E',
      syntaxBreakdown: 'diskpart assign letter=X registra la nueva asociación en el MountMgr de forma inmediata.',
      whatToLookFor: 'Aparición instantánea de la unidad E: en el explorador de Windows.',
      technicalMetrics: 'Clave de persistencia: HKLM\\SYSTEM\\MountedDevices.',
    },
    alertaEVO: {
      reversibilityRule: 'Totalmente reversible cambiando o retirando la letra (remove letter=E).',
      safetyWarning: 'Cambiar la letra de una unidad donde hay programas o juegos instalados romperá los accesos directos y rutas del Registro asociadas.',
    },
    evidenceBadge: {
      code: 'ASSIGN_LETTER_19',
      label: 'MOUNT MANAGER'
    }
  },
  {
    id: 'sec-12-20',
    code: '12.20',
    title: 'DiskPart',
    subtitle: 'La consola de bajo nivel: sintaxis declarativa, scripting y manipulación directa',
    targetComponent: 'diskpart.exe & IOCTL_DISK Architecture',
    commandName: 'diskpart /s script.txt',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'DiskPart es una de las herramientas más poderosas y temidas de Windows: opera en modo de contexto enfocado (Select Disk -> Select Partition -> Action).',
      mythVsTruth: {
        mentira: 'DiskPart es solo una versión en texto de diskmgmt.msc.',
        verdad: 'DiskPart accede a niveles de bajo nivel que la interfaz gráfica oculta por seguridad: permite cambiar GUIDs de partición, modificar atributos de booteo y automatizar tareas por scripts con /s.',
        comprobalo: 'Ejecutá diskpart y escribí "help": verás comandos que no existen en la interfaz visual, como "attributes volume set readonly" o "convert gpt".',
      },
    },
    entende: {
      queEs: 'El intérprete de comandos nativo de modo texto de Microsoft para la administración de objetos de almacenamiento (discos, particiones, volúmenes, vdisks).',
      paraQueSirve: 'Scripting de despliegues desatendidos, rescate de discos en WinPE/WinRE y solución de problemas cuando la interfaz gráfica falla.',
      quePasaSiFalta: 'En entornos de recuperación donde el Explorador y MMC no arrancan, diskpart.exe es la única vía para inspeccionar el estado del almacenamiento.',
    },
    interactua: {
      cliExample: 'diskpart /s my_script.txt',
      psExample: 'Get-Command diskpart | Select Source, Version',
      syntaxBreakdown: 'DiskPart mantiene un cursor de selección: cada comando actúa exclusivamente sobre el objeto que tenga el asterisco (*) en "list".',
      whatToLookFor: 'Comprobar siempre con "list disk" qué disco tiene el asterisco antes de cualquier comando destructivo.',
      technicalMetrics: 'Binario: C:\\Windows\\System32\\diskpart.exe.',
    },
    alertaEVO: {
      reversibilityRule: 'Abrir y consultar DiskPart es seguro.',
      safetyWarning: 'Nunca ejecutes scripts de DiskPart descargados de internet sin auditar cada línea con lupa técnica.',
    },
    evidenceBadge: {
      code: 'DISKPART_CORE_20',
      label: 'DISKPART CONSOLE'
    }
  },
  {
    id: 'sec-12-21',
    code: '12.21',
    title: 'Qué hace clean y por qué es peligroso',
    subtitle: 'Clean vs Clean All: aniquilación de metadatos de partición vs sobreescritura de sectores',
    targetComponent: 'LBA 0 to LBA 2047 & Backup GPT LBA Ranges',
    commandName: 'diskpart -> clean / clean all',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'El comando "clean" no borra tus archivos: borra las primeras y últimas páginas del libro donde dice en qué página está cada capítulo.',
      mythVsTruth: {
        mentira: '"clean" borra todo el disco de forma segura para que nadie pueda recuperar mis datos confidenciales.',
        verdad: '"clean" solo escribe ceros en LBA 0 (MBR), cabecera GPT primaria y cabecera GPT secundaria. Los datos del disco siguen ahí. Para sanitizar de verdad se requiere "clean all".',
        comprobalo: 'Un "clean" tarda 0.5 segundos en un disco de 2 TB. Un "clean all" tarda varias horas porque escribe ceros en cada uno de los sectores.',
      },
    },
    entende: {
      queEs: 'Un comando de DiskPart que elimina la información de partición o de formato de volumen del disco enfocado actualmente.',
      paraQueSirve: 'Devolver un disco corrupto, bloqueado o con configuraciones erróneas a un estado virgen (Uninitialized) para volver a configurarlo desde cero.',
      quePasaSiFalta: 'Si se ejecuta "clean" sobre el disco equivocado (ej: Disk 0 en lugar de la memoria USB Disk 1), el sistema entero queda destruido en menos de un segundo.',
    },
    interactua: {
      cliExample: 'diskpart -> select disk 1 -> detail disk -> clean',
      psExample: 'Clear-Disk -Number 1 -RemoveData -RemoveOEM -Confirm:$true',
      syntaxBreakdown: 'clean borra sectores de metadatos MBR/GPT. clean all escribe ceros (0x00) en la totalidad de la capacidad física del medio.',
      whatToLookFor: 'Asegurarse de que el tamaño en "detail disk" coincida con la unidad USB y no con el disco NVMe principal.',
      technicalMetrics: 'Clean execution time: < 1 segundo. Clean All: velocidad limitada por el bus de escritura (~150-500 MB/s).',
    },
    alertaEVO: {
      reversibilityRule: 'Clean puede recuperarse con reconstructores de particiones si no se creó nada nuevo. Clean All es absolutamente IRREVERSIBLE.',
      safetyWarning: 'REGLA DE ORO DE EVO: Jamás ejecutes "clean" sin antes haber tirado "detail disk" para leer el nombre exacto del modelo.',
    },
    evidenceBadge: {
      code: 'CLEAN_DESTRUCTION_21',
      label: 'ZERO ERASE SPECS'
    }
  },
  {
    id: 'sec-12-22',
    code: '12.22',
    title: 'Storage Spaces',
    subtitle: 'Espacios de almacenamiento: pools, resiliencia (Mirror/Parity) y el subsistema Spaceport',
    targetComponent: 'Storage Pools & Spaceport.sys Virtual Disks',
    commandName: 'Get-StoragePool / Get-VirtualDisk',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows incluye su propio motor de software RAID empresarial llamado Storage Spaces, capaz de fusionar discos de diferentes marcas y tamaños en un solo pool resiliente.',
      mythVsTruth: {
        mentira: 'Para tener RAID 1 de espejado en Windows se requiere una controladora de hardware cara en la placa madre.',
        verdad: 'Storage Spaces crea volúmenes con resiliencia bidireccional (Two-way Mirror) o tridireccional gestionados transparentemente por el driver spaceport.sys del kernel.',
        comprobalo: 'Buscá "Administrar espacios de almacenamiento" en el Panel de Control o ejecutá Get-StoragePool en PowerShell.',
      },
    },
    entende: {
      queEs: 'Una tecnología de virtualización de almacenamiento integrada en Windows que agrupa discos físicos en uno o más Grupos de Almacenamiento (Storage Pools).',
      paraQueSirve: 'Proteger datos contra fallas de disco (espejado) y permitir aprovisionamiento fino (Thin Provisioning) creando discos virtuales mayores que la capacidad física real disponible.',
      quePasaSiFalta: 'Si un disco de un pool con resiliencia falla, el sistema continúa funcionando y alerta al usuario para reemplazar la unidad dañada sin pérdida de datos.',
    },
    interactua: {
      cliExample: 'powershell "Get-StoragePool | Format-Table FriendlyName, OperationalStatus, HealthStatus, IsPrimordial"',
      psExample: 'Get-StoragePool -IsPrimordial $false | Get-VirtualDisk | Select FriendlyName, ResiliencySettingName, OperationalStatus',
      syntaxBreakdown: 'IsPrimordial = $true representa los discos libres no agrupados; $false representa los pools administrados creados por el usuario.',
      whatToLookFor: 'OperationalStatus: OK y HealthStatus: Healthy en todos los Virtual Disks del pool.',
      technicalMetrics: 'Resiliencia admitida: Simple (sin paridad), Mirror (2 o 3 copias) y Parity.',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta pasiva sin modificación.',
      safetyWarning: 'Eliminar un Storage Pool destruye todos los discos virtuales y volúmenes alojados en él simultáneamente.',
    },
    evidenceBadge: {
      code: 'STORAGE_SPACES_22',
      label: 'STORAGE POOLS'
    }
  },
  {
    id: 'sec-12-23',
    code: '12.23',
    title: 'TRIM',
    subtitle: 'El comando de recolección de basura NAND: fsutil y optimización de desgaste SSD',
    targetComponent: 'SATA TRIM / NVMe Deallocate Command Handler',
    commandName: 'fsutil behavior query DisableDeleteNotify',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En un disco magnético, borrar un archivo solo cambia un bit. En un SSD, la celda debe borrarse físicamente en bloques enteros antes de reescribirse: sin TRIM, el SSD se vuelve progresivamente lento.',
      mythVsTruth: {
        mentira: 'Desfragmentar un SSD periódicamente mejora su velocidad como en los discos duros mecánicos.',
        verdad: 'Desfragmentar un SSD desgasta inútilmente las celdas NAND sin ganancia de velocidad. Lo que necesita un SSD es el comando TRIM (Optimización / Retrim) para que el controlador limpie los bloques liberados.',
        comprobalo: 'Ejecutá "fsutil behavior query DisableDeleteNotify": si devuelve 0, el comando TRIM está plenamente activo y funcionando.',
      },
    },
    entende: {
      queEs: 'Una instrucción del bus de almacenamiento (ATA TRIM o NVMe Dataset Management Deallocate) mediante la cual el sistema operativo informa al SSD qué sectores LBA ya no contienen datos válidos.',
      paraQueSirve: 'Permite al controlador del SSD realizar la recolección de basura (Garbage Collection) en segundo plano, maximizando la velocidad de escritura y la vida útil del disco.',
      quePasaSiFalta: 'Si DisableDeleteNotify está en 1 (desactivado), el SSD sufrirá amplificación de escritura severa y caídas abruptas de rendimiento en escrituras sostenidas.',
    },
    interactua: {
      cliExample: 'fsutil behavior query DisableDeleteNotify',
      psExample: 'Optimize-Volume -DriveLetter C -ReTrim -Verbose',
      syntaxBreakdown: 'DisableDeleteNotify = 0 significa que la notificación de borrado (TRIM) está ACTIVADA. 1 significa deshabilitada.',
      whatToLookFor: 'NTFS DisableDeleteNotify = 0 y ReFS DisableDeleteNotify = 0.',
      technicalMetrics: 'Comando de optimización periódica: defrag.exe /O (Retrim en SSDs).',
    },
    alertaEVO: {
      reversibilityRule: 'Diagnóstico pasivo inofensivo.',
      safetyWarning: 'Nunca deshabilites DisableDeleteNotify a menos que estés realizando un análisis forense de recuperación de emergencia.',
    },
    evidenceBadge: {
      code: 'TRIM_OPTIM_NAND_23',
      label: 'NAND TRIM STATUS'
    }
  },
  {
    id: 'sec-12-24',
    code: '12.24',
    title: 'SMART',
    subtitle: 'Self-Monitoring Analysis and Reporting Technology: telemetría predictiva de fallos',
    targetComponent: 'Drive Firmware SMART Telemetry Registers',
    commandName: 'wmic diskdrive get status / Get-StorageReliabilityCounter',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Los discos no mueren por sorpresa: avisan semanas antes acumulando "Reallocated Sectors", errores CRC de interfaz o caídas en el porcentaje de vida restante.',
      mythVsTruth: {
        mentira: 'Si Windows inicia y no muestra ningún cartel de error, el disco está al 100% de salud física.',
        verdad: 'Windows solo avisa cuando el umbral SMART crítico fue sobrepasado por completo (falla inminente). Millones de sectores reasignados pueden pasar desapercibidos antes del colapso.',
        comprobalo: 'Ejecutá Get-PhysicalDisk | Get-StorageReliabilityCounter en PowerShell para consultar temperatura, sectores defectuosos y desgaste porcentual.',
      },
    },
    entende: {
      queEs: 'Un sistema de monitoreo interno embebido en el firmware de discos duros y unidades de estado sólido.',
      paraQueSirve: 'Registra parámetros mecánicos y de silicio: ciclos de encendido, sectores reasignados (ID 05), errores de lectura no corregibles (ID BB) y porcentaje de vida útil consumido.',
      quePasaSiFalta: 'Sin monitoreo SMART preventivo, una falla súbita de cabezales o degradación de celdas de silicio destruye información sensible sin oportunidad de backup previo.',
    },
    interactua: {
      cliExample: 'wmic diskdrive get Model,Status',
      psExample: 'Get-PhysicalDisk | Get-StorageReliabilityCounter | Select DeviceId, Temperature, ReadErrorsTotal, Wear, PowerOnHours',
      syntaxBreakdown: 'Get-StorageReliabilityCounter extrae los registros SMART directos normalizados por el subsistema de almacenamiento de Windows 10/11.',
      whatToLookFor: 'ReadErrorsTotal en 0, Wear cercano a 0 (desgaste) y Temperature inferior a 55°C.',
      technicalMetrics: 'Atributos críticos: Reallocated Sector Count (0x05), Current Pending Sector (0xC5).',
    },
    alertaEVO: {
      reversibilityRule: 'Completamente seguro y pasivo.',
      safetyWarning: 'Si un disco presenta sectores reasignados en aumento, clonalo de inmediato; someterlo a pruebas de estrés puede rematarlo.',
    },
    evidenceBadge: {
      code: 'SMART_DIAG_HEALTH_24',
      label: 'SMART TELEMETRY'
    }
  },
  {
    id: 'sec-12-25',
    code: '12.25',
    title: 'BitLocker',
    subtitle: 'Cifrado completo de volumen: TPM 2.0, PCRs, llaves FVEK/VMK y recuperación',
    targetComponent: 'Full Volume Encryption (FVE) & TPM Endorsement Key',
    commandName: 'manage-bde -status / Get-BitLockerVolume',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Si alguien saca tu SSD de la laptop y lo conecta a otra máquina, puede leer todos tus archivos... a menos que BitLocker esté activo cifrando cada sector con XTS-AES de 128 o 256 bits.',
      mythVsTruth: {
        mentira: 'BitLocker ralentiza los juegos y destruye el rendimiento del procesador de forma notable.',
        verdad: 'Los procesadores modernos cuentan con aceleración de hardware AES-NI en silicio: la penalización de rendimiento en lectura/escritura diaria es inferior al 1-2%.',
        comprobalo: 'Ejecutá "manage-bde -status C:" en CMD administrador para comprobar el estado de cifrado, la versión de BitLocker y el método de protección (TPM).',
      },
    },
    entende: {
      queEs: 'La tecnología de cifrado integral de disco nativa de las ediciones Windows Pro, Enterprise y Education.',
      paraQueSirve: 'Protege la confidencialidad de los datos contra robo del equipo físico o manipulación de arranque offline mediante validación de los registros PCR del chip TPM 2.0.',
      quePasaSiFalta: 'Si se cambia la motherboard o se desactiva el Secure Boot en BIOS con BitLocker activo, Windows solicitará la clave de recuperación de 48 dígitos para desbloquear la unidad.',
    },
    interactua: {
      cliExample: 'manage-bde -status C:',
      psExample: 'Get-BitLockerVolume -MountPoint C: | Select MountPoint, VolumeStatus, EncryptionMethod, ProtectionStatus, KeyProtector',
      syntaxBreakdown: 'manage-bde -status reporta el porcentaje de cifrado, método (XTS-AES 128/256) y los protectores de clave activos (TPM, PIN, Recovery Password).',
      whatToLookFor: 'Protection Status: Protection On y Conversion Status: Fully Encrypted.',
      technicalMetrics: 'Clave de recuperación: 48 dígitos numéricos divididos en 8 grupos de 6.',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de solo lectura.',
      safetyWarning: 'Guardá SIEMPRE tu clave de recuperación de 48 dígitos en un lugar externo seguro antes de actualizar el firmware UEFI/BIOS de tu motherboard.',
    },
    evidenceBadge: {
      code: 'BITLOCKER_FVE_25',
      label: 'BITLOCKER XTS-AES'
    }
  }
];

export const SECTOR_12_MINICASES: Sector12MiniCase[] = [
  {
    id: 'case-12-01',
    code: 'CASE-12.01',
    title: 'El misterio de "Extender volumen" deshabilitado',
    scenario: 'Un usuario clonó su SSD de 500 GB a uno nuevo de 2 TB. Al iniciar Windows, ve 1.5 TB como espacio no asignado (Unallocated). Sin embargo, al hacer clic derecho en C: dentro de Administración de Discos, la opción "Extender volumen" aparece en gris deshabilitada.',
    userStatement: '"El SSD de 2TB vino fallado de fábrica o Windows tiene un bug con los discos grandes."',
    initialMistake: 'Pensar que la limitación es de hardware o de capacidad máxima de NTFS.',
    diagnosticQuestion: '¿Por qué Administración de Discos tiene bloqueado el botón de extender?',
    options: [
      {
        id: 'opt-a',
        text: 'Porque entre la partición C: y el espacio no asignado se encuentra la partición de recuperación (Recovery) de 500 MB.',
        isCorrect: true,
        explanation: 'Exacto. diskmgmt.msc exige estrictamente contigüidad física hacia la derecha. La partición de recuperación intermedia impide extender C: sin moverla o usar herramientas de particionado que muevan los límites LBA.'
      },
      {
        id: 'opt-b',
        text: 'Porque el disco está en formato GPT y solo los discos MBR permiten extender volúmenes.',
        isCorrect: false,
        explanation: 'Falso. GPT soporta perfectamente la extensión de volúmenes; la limitación es la contigüidad de bloques LBA.'
      },
      {
        id: 'opt-c',
        text: 'Porque Windows requiere formatear el disco completo en exFAT antes de agrandar.',
        isCorrect: false,
        explanation: 'Absurdo. Windows no puede ejecutarse sobre exFAT.'
      }
    ],
    technicalVerdict: 'La presencia de una partición de rescate (Recovery) bloqueando el espacio contiguo impide la extensión directa en la herramienta gráfica nativa.',
    lessonLearned: 'Para extender C: con herramientas nativas, el espacio libre debe ser inmediatamente adyacente a la derecha de C:.'
  },
  {
    id: 'case-12-02',
    code: 'CASE-12.02',
    title: 'El pendrive de 64 GB que no acepta una ISO de 5 GB',
    scenario: 'Un técnico tiene un pendrive de 64 GB con 58 GB libres. Intenta copiar una imagen de instalación de Windows 11 modificada que pesa 5.2 GB. Windows arroja de inmediato el error: "El archivo es demasiado grande para el sistema de archivos de destino".',
    userStatement: '"El archivo está corrupto o el pendrive es trucho y no tiene 64 GB reales."',
    initialMistake: 'Sospechar del archivo ISO o de la capacidad física del pendrive sin revisar el sistema de archivos.',
    diagnosticQuestion: '¿Cuál es la causa técnica exacta del fallo de copia?',
    options: [
      {
        id: 'opt-a',
        text: 'El pendrive está formateado en FAT32, cuya arquitectura impone un límite matemático duro de 4 GB por archivo individual.',
        isCorrect: true,
        explanation: 'Correcto. FAT32 usa descriptores de tamaño de archivo de 32 bits, lo que limita el tamaño máximo de un único archivo a 4.294.967.295 bytes (~4 GB).'
      },
      {
        id: 'opt-b',
        text: 'El servicio Windows Update bloqueó la copia por falta de firma digital.',
        isCorrect: false,
        explanation: 'Falso. El explorador de archivos no valida firmas de ISOs al copiar.'
      },
      {
        id: 'opt-c',
        text: 'Los sectores del pendrive están invertidos en LBA.',
        isCorrect: false,
        explanation: 'Incoherente.'
      }
    ],
    technicalVerdict: 'Límite de arquitectura de FAT32. La solución es formatear en exFAT o NTFS, o dividir el archivo WIM con DISM /Split-Image.',
    lessonLearned: 'No importa cuánto espacio libre tenga un volumen FAT32: ningún archivo individual puede superar los 4 GB.'
  },
  {
    id: 'case-12-03',
    code: 'CASE-12.03',
    title: 'El comando clean catastrófico',
    scenario: 'Un operador quería limpiar un pendrive que figuraba como Disco 2. Abrió DiskPart, ejecutó "clean" y a los 5 segundos la pantalla de su PC se congeló con un pantallazo azul y al reiniciar apareció "No boot device found".',
    userStatement: '"El pendrive tenía un cortocircuito que quemó la placa madre."',
    initialMistake: 'Asumir una falla eléctrica cuando en realidad se ejecutó clean sobre el disco equivocado.',
    diagnosticQuestion: '¿Qué ocurrió a nivel de almacenamiento?',
    options: [
      {
        id: 'opt-a',
        text: 'El operador no verificó con "list disk" qué disco tenía el asterisco (*) y ejecutó clean sobre Disk 0, borrando las cabeceras de partición del sistema.',
        isCorrect: true,
        explanation: 'Exacto. DiskPart opera bajo selección persistente. Si estaba seleccionado el Disco 0 (el SSD del sistema), "clean" borra LBA 0 y las cabeceras GPT en medio segundo.'
      },
      {
        id: 'opt-b',
        text: 'El comando clean activa una señal de voltaje que apaga el bus PCIe.',
        isCorrect: false,
        explanation: 'Falso. Clean es un comando puramente lógico de modificación de sectores de disco.'
      },
      {
        id: 'opt-c',
        text: 'El antivirus detectó DiskPart y corrompió el registro.',
        isCorrect: false,
        explanation: 'Incierto.'
      }
    ],
    technicalVerdict: 'Falta de verificación del contexto de selección en DiskPart antes de una acción destructiva de bajo nivel.',
    lessonLearned: 'Regla de oro de EVO: siempre ejecutar "detail disk" antes de "clean" para validar el modelo y la capacidad física de la unidad enfocada.'
  }
];

export const SECTOR_12_TEST_BANK: Sector12TestQuestion[] = [
  {
    id: 't12-q01',
    questionNumber: 1,
    category: 'TOPOLOGIA_FISICA_LOGICA',
    question: '¿Cuál es la diferencia fundamental entre una partición y un volumen en la arquitectura de almacenamiento de Windows?',
    options: [
      { id: 'a', text: 'Una partición es una delimitación geométrica de sectores LBA en un disco físico; un volumen es la estructura lógica formateada montada en el sistema de archivos.' },
      { id: 'b', text: 'La partición siempre tiene letra de unidad y el volumen nunca la tiene.' },
      { id: 'c', text: 'No hay ninguna diferencia; son términos sinónimos en el kernel de Windows.' },
      { id: 'd', text: 'El volumen es el hardware físico y la partición es la memoria virtual.' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'La partición delimita rangos de bloques LBA contiguos en la tabla de particiones. El volumen es la entidad abstracta (creada sobre una o más particiones) que aloja un sistema de archivos reconocible por el OS.',
    relatedInvestigationCode: '12.02'
  },
  {
    id: 't12-q02',
    questionNumber: 2,
    category: 'GPT_VS_MBR',
    question: '¿Por qué la arquitectura MBR clásica no puede direccionar discos de más de 2.2 Terabytes con sectores estándar de 512 bytes?',
    options: [
      { id: 'a', text: 'Porque el campo de cantidad de sectores LBA en su tabla de particiones es de 32 bits enteros (2^32 * 512 bytes = 2.19 TB).' },
      { id: 'b', text: 'Porque el BIOS solo soporta procesadores de 16 bits.' },
      { id: 'c', text: 'Porque Microsoft limitó MBR en el código fuente para vender licencias de Windows Server.' },
      { id: 'd', text: 'Porque el cable SATA no puede transmitir números mayores a 2 millones.' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'Con direccionamiento de 32 bits, el valor máximo de bloques LBA es 4.294.967.295. Al multiplicarlo por el tamaño de sector de 512 bytes, el límite matemático absoluto es de 2.19 TB.',
    relatedInvestigationCode: '12.06'
  },
  {
    id: 't12-q03',
    questionNumber: 3,
    category: 'SISTEMAS_ARCHIVOS',
    question: '¿Qué ventaja crítica provee el Journal transaccional ($LogFile) en NTFS frente a FAT32 o exFAT?',
    options: [
      { id: 'a', text: 'Permite deshacer o rehacer transacciones de metadatos ante un corte eléctrico repentino, evitando la corrupción de la estructura del volumen.' },
      { id: 'b', text: 'Aumenta los FPS en los videojuegos instalados en esa partición.' },
      { id: 'c', text: 'Comprime automáticamente todas las imágenes para ahorrar espacio en el SSD.' },
      { id: 'd', text: 'Impide que los virus ejecuten archivos ejecutables sin permiso de administrador.' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'El journaling de NTFS registra las intenciones de modificación de metadatos antes de confirmarlas. Si el sistema se apaga intempestivamente, el driver analiza el $LogFile al reiniciar y restaura el estado consistente.',
    relatedInvestigationCode: '12.10'
  },
  {
    id: 't12-q04',
    questionNumber: 4,
    category: 'DISKPART_Y_OPERACIONES',
    question: '¿Qué acción concreta realiza el comando "clean all" en DiskPart a diferencia de "clean"?',
    options: [
      { id: 'a', text: '"clean" solo borra los sectores de metadatos de las particiones (LBA inicial y final); "clean all" escribe ceros (0x00) en todos los sectores físicos de la unidad.' },
      { id: 'b', text: '"clean all" desinstala Windows y apaga el equipo.' },
      { id: 'c', text: '"clean all" borra los datos pero deja las particiones creadas vacías.' },
      { id: 'd', text: 'Ambos comandos hacen exactamente lo mismo; "all" es solo un alias estético.' }
    ],
    correctOptionId: 'a',
    technicalExplanation: '"clean" destruye los punteros de arranque y tablas GPT en un instante sin alterar los datos del medio. "clean all" realiza un zero-fill completo y destructivo en la totalidad de la capacidad.',
    relatedInvestigationCode: '12.21'
  },
  {
    id: 't12-q05',
    questionNumber: 5,
    category: 'TOPOLOGIA_FISICA_LOGICA',
    question: '¿Cuál es el valor esperado de "DisableDeleteNotify" al consultar fsutil para certificar que el comando TRIM está activo en un SSD?',
    options: [
      { id: 'a', text: '0 (indicando que la desactivación de notificación de borrado es Falsa, es decir, TRIM está habilitado).' },
      { id: 'b', text: '1 (indicando que TRIM está activado al 100%).' },
      { id: 'c', text: '100.' },
      { id: 'd', text: 'TRUE.' }
    ],
    correctOptionId: 'a',
    technicalExplanation: 'La clave se llama "DisableDeleteNotify". Un valor de 0 significa que la acción de deshabilitar está apagada, por lo que las notificaciones TRIM fluyen con normalidad hacia el controlador.',
    relatedInvestigationCode: '12.23'
  }
];

export const SECTOR_12_DATA = {
  sectorId: 'sector-12',
  sectorNumber: '12',
  title: 'DISCOS Y PARTICIONES',
  subtitle: 'De “C:” a entender realmente el almacenamiento',
  level: 'NIVEL II',
  levelTitle: 'ADMINISTRAR WINDOWS',
  investigationsCount: 25,
  artefactOrLab: 'Lab: Virtual Disk Lab & DiskPart Sandbox',
  investigations: SECTOR_12_INVESTIGATIONS,
  miniCases: SECTOR_12_MINICASES,
  testBank: SECTOR_12_TEST_BANK,
};
