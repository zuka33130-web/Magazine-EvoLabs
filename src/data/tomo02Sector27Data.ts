// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 27: DIAGNÓSTICO Y REPARACIÓN
// "Protocolo de descarte y reparación"

export type RiskLevelSector27 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector27Investigation {
  code: string;
  title: string;
  category: 'PROTOCOLO' | 'HERRAMIENTAS' | 'ENTORNO_RECUPERACION' | 'FORENSE_LOGS';
  summary: string;
  riskLevel: RiskLevelSector27;
  technicalDepth: string;
  contentMarkdown: string;
  cmdExample?: string;
  psExample?: string;
  registryKey?: string;
}

export const SECTOR_27_INVESTIGATIONS: Sector27Investigation[] = [
  {
    code: '27.01',
    title: 'Identificación de Síntomas Periciales',
    category: 'PROTOCOLO',
    summary: 'Aislamiento metrológico del comportamiento anómalo antes de ejecutar cambios en el sistema.',
    riskLevel: 'SAFE_READONLY',
    technicalDepth: 'Primer paso del método pericial: registrar BSOD, congelamientos, errores de I/O o fallos de arranque con precisión de timestamp.',
    contentMarkdown: `### Metodología de Aislamiento de Síntomas
En el diagnóstico informático pericial, un síntoma nunca debe confundirse con la causa raíz. 

#### Categorización Estándar de Fallas en Windows:
1. **Falla Crítica del Kernel (BSOD / Bugcheck)**: Detención del sistema por violación de memoria en Ring 0 (ej. \`PAGE_FAULT_IN_NONPAGED_AREA\`).
2. **Congelamiento de Bus / Interrupción (Hang)**: El procesador queda atrapado en un ciclo infinito de Wait Spinlock o interrupción irresoluble.
3. **Corrupción de Archivos de Sistema (I/O Error)**: Lectura defectuosa de binarios protegidos (\`ntoskrnl.exe\`, \`winlogon.exe\`, DLLs de WinSxS).
4. **Degradación de Performance (Bottleneck)**: Saturación de cola de disco (\`Disk Queue Length > 2\`) o sobrecarga de interrupciones de hardware (DPC / ISR).`,
    cmdExample: 'systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Boot Time"',
    psExample: 'Get-WinEvent -ListLog * | Where-Object {$_.RecordCount -gt 0} | Select-Object LogName, RecordCount',
  },
  {
    code: '27.02',
    title: 'Formulación de Hipótesis Diagnóstica',
    category: 'PROTOCOLO',
    summary: 'Árbol de decisión lógica para jerarquizar posibles orígenes de falla (Hardware vs Kernel vs Userland).',
    riskLevel: 'SAFE_READONLY',
    technicalDepth: 'Construcción del vector de prueba aplicando la regla del descarte inverso sin alterar evidencia en disco.',
    contentMarkdown: `### Construcción del Árbol Diagnóstico
La formulación de hipótesis exige dividir el problema en 3 capas fundamentales:

1. **Capa Hardware / Silicio**: RAM dañada (MemTest), corrupción en controlador NVMe, fluctuación de voltaje VRM, temperatura límite (Thermal Throttling).
2. **Capa Kernel / Drivers**: Módulos SYS de terceros corruptos (\`Kernel-Power 41\`), incompatibilidad de controladores tras Windows Update.
3. **Capa Servidor / Userland**: Servicios de Windows bloqueados, archivos corruptos en WinSxS, perfil de usuario dañado.`,
    cmdExample: 'wmic recoveros get AutoReboot, DebugInfoType, CrashDumpFile',
    psExample: 'Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object LastBootUpTime, AutomaticManagedPagefile',
  },
  {
    code: '27.03',
    title: 'Recolección de Evidencia Pericial',
    category: 'FORENSE_LOGS',
    summary: 'Extracción segura de minidumps, registros CBS.log, SrtTrail.txt y trazas de ETW.',
    riskLevel: 'SAFE_READONLY',
    technicalDepth: 'Localización e inspección de volcados de memoria (%SystemRoot%\\Minidump) y bitácoras de reparación.',
    contentMarkdown: `### Repositorios Fundamentales de Evidencia en Windows
- **Volcados de Memoria**: \`C:\\Windows\\Minidump\\*.dmp\` (Minidump 256KB) y \`C:\\Windows\\MEMORY.DMP\` (Volcado Completo).
- **Bitácora de CBS / SFC**: \`C:\\Windows\\Logs\\CBS\\CBS.log\`
- **Bitácora de Reparación de Arranque WinRE**: \`C:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt\`
- **Bitácoras de Servidores y Componentes**: \`C:\\Windows\\Logs\\DISM\\dism.log\``,
    cmdExample: 'dir /a C:\\Windows\\Minidump',
    psExample: 'Get-ChildItem -Path C:\\Windows\\Minidump -Filter *.dmp | Select-Object Name, Length, LastWriteTime',
  },
  {
    code: '27.04',
    title: 'Pruebas Sintéticas y Carga Metrológica',
    category: 'HERRAMIENTAS',
    summary: 'Sometimiento controlado del sistema a estrés de bus, subsistema de RAM y procesador.',
    riskLevel: 'LOW_RISK',
    technicalDepth: 'Verificación de estabilidad bajo estrés térmico y eléctrico sin comprometer integridad de datos.',
    contentMarkdown: `### Estrés Controlado y Medición
El objetivo de las pruebas sintéticas es forzar la aparición del síntoma en un entorno controlado:
- **Estrés de Procesador y Cache L1/L2/L3**: Cálculo masivo de FFTs.
- **Estrés de Subsistema de Memoria**: Verificación de patrones bit a bit para detectar celdas DRAM defectuosas.
- **Estrés de Almacenamiento**: Medición de latencia de escritura en bloques aleatorios de 4K (\`Random 4K Deep Queue\`).`,
    cmdExample: 'winsat formal -v',
    psExample: 'Get-Wmiobject Win32_PerfFormattedData_PerfOS_System | Select-Object ProcessorQueueLength, SystemCodeTotalBytes',
  },
  {
    code: '27.05',
    title: 'Metodología de Descarte Sistemático',
    category: 'PROTOCOLO',
    summary: 'Técnica de eliminación de variables periféricas y arranque con servicios mínimos.',
    riskLevel: 'SAFE_READONLY',
    technicalDepth: 'Proceso paso a paso para descartar conflictos de hardware de terceros o módulos no esenciales.',
    contentMarkdown: `### El Algoritmo del Descarte
1. **Desconexión Periférica Completa**: Retirar dispositivos USB/PCIe no esenciales.
2. **Modo Mínimo de Kernel**: Ejecución con controladores genéricos cargados por MS-DOS / WinPE.
3. **Desactivación de Servicios de Terceros**: Aislar arranque mediante selección estricta de controladores firmados por Microsoft.`,
    cmdExample: 'driverquery /FO TABLE /v | findstr /i "Running"',
    psExample: 'Get-Service | Where-Object {$_.Status -eq "Running" -and $_.StartType -eq "Automatic"}',
  },
  {
    code: '27.06',
    title: 'Procedimientos de Reparación y Parcheo',
    category: 'PROTOCOLO',
    summary: 'Matriz de decisión para aplicar parches, sustitución de binarios y reconstrucción de almacenes.',
    riskLevel: 'MODIFIES_STATE',
    technicalDepth: 'Secuencia jerárquica de reparación: desde SFC y DISM hasta la reparación In-Place Upgrade de Windows.',
    contentMarkdown: `### Jerarquía de Invasión en la Reparación
Nunca aplique una reinstalación limpia sin agotar las etapas de conservación de estado:
1. **Paso 1 (Cero Invasión)**: Reparación de archivos con SFC (\`sfc /scannow\`).
2. **Paso 2 (Reparación de Almacén Componentes)**: DISM online con origen Windows Update o ISO local.
3. **Paso 3 (Reconstrucción BCD / MBR)**: Comandos de reparación de arranque en WinRE.
4. **Paso 4 (In-Place Upgrade / Conservar Datos)**: Reinstalación del Kernel preservando perfiles, registros y aplicaciones.`,
    cmdExample: 'sfc /verifyonly',
    psExample: 'Repair-WindowsImage -Online -CheckHealth',
  },
  {
    code: '27.07',
    title: 'Post-Validation y Pruebas de Estabilidad',
    category: 'PROTOCOLO',
    summary: 'Auditoría pericial tras reparación para confirmar ausencia de regresiones.',
    riskLevel: 'SAFE_READONLY',
    technicalDepth: 'Verificación de checksums SHA-256 en binarios reparados y monitor de integridad de contadores de rendimiento.',
    contentMarkdown: `### Protocolo de Certificación de Reparación
Una reparación se considera oficialmente completada cuando:
- El registro de CBS.log confirma \`Hashes for component member match\`.
- Se completa un ciclo entero de \`perfmon /rel\` sin eventos críticos en un lapso de prueba.
- Los contadores de \`Kernel-Power\` e \`Interrupts/sec\` operan dentro de los márgenes nominales del hardware.`,
    cmdExample: 'perfmon /report',
    psExample: 'Get-ReliabilityReport | Select-Object -First 10',
  },
  {
    code: '27.08',
    title: 'System File Checker (sfc /scannow)',
    category: 'HERRAMIENTAS',
    summary: 'Análisis e integridad de archivos protegidos por WRP (Windows Resource Protection).',
    riskLevel: 'MODIFIES_STATE',
    technicalDepth: 'Verificación de firmas digitales y hashes de DLLs y EXEs contra el almacén protegido %WinDir%\\WinSxS.',
    contentMarkdown: `### Funcionamiento Interno de SFC
SFC (System File Checker) escanea todos los archivos de sistema protegidos y reemplaza las versiones dañadas con una copia guardada en caché en una carpeta comprimida en **%WinDir%\\System32\\dllcache** o **WinSxS**.

#### Sintaxis Oficial Pericial:
\`\`\`cmd
sfc /scannow
\`\`\`

#### Escaneo Fuera de Línea (Offline Repair desde WinPE/WinRE):
\`\`\`cmd
sfc /scannow /offbootdir=C:\ /offwindir=C:\Windows
\`\`\``,
    cmdExample: 'sfc /scannow',
    psExample: 'Start-Process cmd.exe -ArgumentList "/c sfc /scannow" -Verb RunAs',
  },
  {
    code: '27.09',
    title: 'Deployment Image Servicing and Management (DISM)',
    category: 'HERRAMIENTAS',
    summary: 'Reparación del almacén de componentes de Windows (WinSxS Component Store).',
    riskLevel: 'HIGH_RISK',
    technicalDepth: 'Comandos CheckHealth, ScanHealth y RestoreHealth utilizando fuentes de reparación locales o remotas.',
    contentMarkdown: `### Reparación de la Imagen de Windows con DISM
Cuando SFC falla al indicar que \`Windows Resource Protection found corrupt files but was unable to fix some of them\`, la causa es que la copia de respaldo en WinSxS también está dañada. DISM repara ese almacén base.

#### Secuencia de Reparación DISM:
1. **Comprobar Estado**: \`DISM /Online /Cleanup-Image /CheckHealth\`
2. **Escanear Integridad**: \`DISM /Online /Cleanup-Image /ScanHealth\`
3. **Restaurar Almacén**: \`DISM /Online /Cleanup-Image /RestoreHealth\`

#### Reparación Offline usando ISO / install.wim como fuente:
\`\`\`cmd
DISM /Online /Cleanup-Image /RestoreHealth /Source:WIM:D:\Sources\install.wim:1 /LimitAccess
\`\`\``,
    cmdExample: 'DISM /Online /Cleanup-Image /RestoreHealth',
    psExample: 'Repair-WindowsImage -Online -RestoreHealth',
  },
  {
    code: '27.10',
    title: 'Check Disk Metrológico (chkdsk /f /r /x)',
    category: 'HERRAMIENTAS',
    summary: 'Auditoría y reparación de la estructura de metadatos NTFS / ReFS y clusters de disco.',
    riskLevel: 'HIGH_RISK',
    technicalDepth: 'Análisis de Master File Table (MFT), descriptores de seguridad y recuperación de sectores defectuosos.',
    contentMarkdown: `### Etapas del Escaneo CHKDSK en NTFS
1. **Etapa 1**: Verificación de estructura de archivos y registros MFT.
2. **Etapa 2**: Verificación de índices y nombres de archivos.
3. **Etapa 3**: Verificación de descriptores de seguridad y ACLs.
4. **Etapa 4 (Parámetro /r)**: Escaneo de datos en sectores físicos y reubicación de sectores defectuosos.
5. **Etapa 5**: Verificación del espacio libre y mapeo de clusters.`,
    cmdExample: 'chkdsk C: /f /r /x',
    psExample: 'Repair-Volume -DriveLetter C -Scan',
  },
  {
    code: '27.11',
    title: 'Windows Recovery Environment (WinRE & bcdedit)',
    category: 'ENTORNO_RECUPERACION',
    summary: 'Entorno de arranque aislado para mantenimiento y reparación del almacén BCD.',
    riskLevel: 'HIGH_RISK',
    technicalDepth: 'Configuración de WinRE, comandos bootrec (/fixmbr, /fixboot, /rebuildbcd) y reparación de BCD UEFI.',
    contentMarkdown: `### Comandos Clave en WinRE para Reparar Arranque UEFI/Legacy:
\`\`\`cmd
reagentc /info
bootrec /fixmbr
bootrec /fixboot
bootrec /scanos
bootrec /rebuildbcd
\`\`\`

#### Reconstrucción de la partición EFI (NVRAM / BCD):
\`\`\`cmd
diskpart
select disk 0
list partition
select partition X (Partición FAT32 EFI)
assign letter=S:
exit
bcdboot C:\Windows /s S: /f UEFI
\`\`\``,
    cmdExample: 'reagentc /info',
    psExample: 'Get-BcdStore',
  },
  {
    code: '27.12',
    title: 'Modo Seguro & Clean Boot (msconfig & Autoruns)',
    category: 'ENTORNO_RECUPERACION',
    summary: 'Aislamiento de controladores de terceros e inicio mínimo sin carga de DLLs adicionales.',
    riskLevel: 'MODIFIES_STATE',
    technicalDepth: 'Configuración de opciones de arranque bcdedit /set {current} safeboot minimal e inspección de claves Run/RunOnce.',
    contentMarkdown: `### Forzar Modo Seguro vía BCD:
\`\`\`cmd
bcdedit /set {current} safeboot minimal
\`\`\`

#### Retornar al Arranque Normal:
\`\`\`cmd
bcdedit /deletevalue {current} safeboot
\`\`\``,
    cmdExample: 'bcdedit /enum {current}',
    psExample: 'Get-CimInstance -ClassName Win32_StartupCommand',
  },
  {
    code: '27.13',
    title: 'Puntos de Restauración y Shadow Copies (vssadmin)',
    category: 'ENTORNO_RECUPERACION',
    summary: 'Gestión de instantáneas de volumen VSS (Volume Shadow Copy Service) para revertir cambios.',
    riskLevel: 'MODIFIES_STATE',
    technicalDepth: 'Listado, creación y restauración de instantáneas de registro y sistema con vssadmin y rstrui.exe.',
    contentMarkdown: `### Comandos Periciales de VSS:
\`\`\`cmd
vssadmin list shadows
vssadmin list shadowstorage
rstrui.exe
\`\`\``,
    cmdExample: 'vssadmin list shadows',
    psExample: 'Get-ComputerRestorePoint',
  },
  {
    code: '27.14',
    title: 'Análisis Forense con Visor de Eventos (eventvwr)',
    category: 'FORENSE_LOGS',
    summary: 'Filtro pericial de registros de EventLog (System, Application, Security) mediante consultas XPath.',
    riskLevel: 'SAFE_READONLY',
    technicalDepth: 'Análisis de IDs críticos: 41 (Kernel-Power), 1001 (BugCheck), 7001 (Service Control Manager), 55 (NTFS Error).',
    contentMarkdown: `### IDs de Evento Fundamentales en Diagnóstico:
- **Event ID 41 (Kernel-Power)**: El sistema se reinició sin apagar limpia y previamente.
- **Event ID 1001 (BugCheck)**: Registro del volcado BSOD con parámetros de error y dirección de instrucción.
- **Event ID 7000/7001 (Service Control Manager)**: Fallo de inicio de servicio del Kernel.
- **Event ID 55 (NTFS)**: La estructura del sistema de archivos en el disco está corrupta e inutilizable.`,
    cmdExample: 'wevtutil qe System /q:"*[System[(EventID=41 or EventID=1001)]]" /c:5 /rd:true /f:text',
    psExample: 'Get-WinEvent -FilterHashtable @{LogName="System"; Id=41,1001} -MaxEvents 10',
  },
  {
    code: '27.15',
    title: 'Monitor de Confiabilidad (perfmon /rel)',
    category: 'FORENSE_LOGS',
    summary: 'Línea de tiempo cronológica del índice de estabilidad del sistema (RACAgent).',
    riskLevel: 'SAFE_READONLY',
    technicalDepth: 'Visualización del historial de fallos de aplicaciones, fallos de Windows, advertencias e instalaciones de parches.',
    contentMarkdown: `### El Índice RAC (Reliability Analysis Component)
Windows asigna una puntuación de estabilidad de 1 a 10 basada en la frecuencia de fallas de aplicaciones y del sistema. 

Podés invocar el monitor gráfico directamente desde la consola:
\`\`\`cmd
perfmon /rel
\`\`\``,
    cmdExample: 'perfmon /rel',
    psExample: 'Get-CimInstance -ClassName Win32_ReliabilityStabilityMetrics | Select-Object SystemStabilityIndex, TimeGenerated -First 10',
  },
  {
    code: '27.16',
    title: 'Banco Pericial de Reparación (Windows Repair Bench)',
    category: 'HERRAMIENTAS',
    summary: 'Consola unificada con script maestro de auditoría, descarte y reparación en un solo flujo.',
    riskLevel: 'HIGH_RISK',
    technicalDepth: 'Ejecución secuencial automatizada con validación de checksum y logs consolidados en C:\\EvoRepairLogs.',
    contentMarkdown: `### Windows Repair Bench — Flujo Maestro
El banco de trabajo automatiza la secuencia pericial estándar:
1. Comprobar espacio libre y salud S.M.A.R.T. de discos.
2. Ejecutar DISM RestoreHealth.
3. Ejecutar SFC Scannow.
4. Generar reporte consolidado de salud de componentes.`,
    cmdExample: 'cmd /c "DISM /Online /Cleanup-Image /RestoreHealth && sfc /scannow"',
    psExample: 'Write-Host "Iniciando Banco de Reparación..." -ForegroundColor Cyan; Repair-WindowsImage -Online -RestoreHealth; sfc /scannow',
  },
];

export interface Sector27MiniCase {
  id: string;
  title: string;
  scenario: string;
  symptom: string;
  investigationCode: string;
  correctAction: string;
  explanation: string;
}

export const SECTOR_27_MINICASES: Sector27MiniCase[] = [
  {
    id: 'mc-27-01',
    title: 'Caso Pericial #2701: Bucle de Reinicio tras Update Defectuoso',
    scenario: 'Un equipo con Windows 11 entra en BSOD "INACCESSIBLE_BOOT_DEVICE" tras instalar una actualización acumulativa.',
    symptom: 'WinRE se activa automáticamente tras 2 fallos consecutivos de arranque.',
    investigationCode: '27.11',
    correctAction: 'Iniciar símbolo de sistema en WinRE, desinstalar el último paquete LCU con DISM /ScratchDir y reconstruir BCD con bcdboot.',
    explanation: 'El parche modificó el driver de almacenamiento sin actualizar la entrada BCD. La reconstrucción de BCD y restauración de drivers limpios restaura el arranque de inmediato.',
  },
  {
    id: 'mc-27-02',
    title: 'Caso Pericial #2702: SFC reporta corrupción irreparable',
    scenario: 'SFC /scannow indica "Windows Resource Protection found corrupt files but was unable to fix some of them".',
    symptom: 'El archivo CBS.log muestra que la copia de respaldo en WinSxS tiene un hash hash-mismatch.',
    investigationCode: '27.09',
    correctAction: 'Ejecutar DISM /Online /Cleanup-Image /RestoreHealth para reparar el almacén WinSxS desde Windows Update y re-ejecutar SFC.',
    explanation: 'SFC falla si el almacén fuente (WinSxS) está dañado. DISM repara primero la fuente, permitiendo que SFC repare exitosamente el sistema operativo.',
  },
  {
    id: 'mc-27-03',
    title: 'Caso Pericial #2703: Congelamientos aleatorios de I/O en disco',
    scenario: 'El Administrador de Tareas muestra uso de disco al 100% constante con tiempo de respuesta de 3000ms sin procesos consumiendo ancho de banda evidente.',
    symptom: 'Event ID 55 "ntfs" en el Visor de Eventos.',
    investigationCode: '27.10',
    correctAction: 'Programar un chkdsk C: /f /r /x al reiniciar para reparar descriptores MFT y clusters dañados.',
    explanation: 'La corrupción en los descriptores MFT de NTFS provoca reintentos infinitos del controlador NTFS, congelando la cola de I/O hasta que CHKDSK reordene la estructura.',
  },
];

export interface Sector27TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SECTOR_27_TEST_BANK: Sector27TestQuestion[] = [
  {
    id: 'q-27-01',
    question: '¿Qué comando debe ejecutarse PRIMERO cuando SFC /scannow indica que no puede reparar archivos corruptos porque el almacén de componentes está dañado?',
    options: [
      'chkdsk /f /r',
      'DISM /Online /Cleanup-Image /RestoreHealth',
      'bootrec /rebuildbcd',
      'vssadmin delete shadows',
    ],
    correctIndex: 1,
    explanation: 'DISM /RestoreHealth repara el almacén de componentes WinSxS desde donde SFC toma las copias de respaldo limpias.',
  },
  {
    id: 'q-27-02',
    question: '¿Qué ID de Evento en el Visor de Eventos indica que el sistema se apagó intempestivamente o sufrió una pérdida crítica de energía/BSOD?',
    options: ['Event ID 1001', 'Event ID 41', 'Event ID 7001', 'Event ID 55'],
    correctIndex: 1,
    explanation: 'El Event ID 41 (Kernel-Power) registra los reinicios intempestivos sin un proceso de shutdown previo limpio.',
  },
  {
    id: 'q-27-03',
    question: '¿Qué herramienta gráfica de Windows permite visualizar la línea de tiempo de fallos de aplicaciones e índice de estabilidad del sistema?',
    options: ['perfmon /rel (Monitor de Confiabilidad)', 'eventvwr.msc', 'msconfig', 'taskmgr'],
    correctIndex: 0,
    explanation: 'perfmon /rel (Reliability Monitor) muestra una escala de estabilidad de 1 a 10 e historial cronológico de fallas.',
  },
];
