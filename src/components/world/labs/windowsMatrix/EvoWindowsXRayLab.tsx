import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  HardDrive,
  Info,
  Layers,
  Lock,
  Monitor,
  Play,
  Power,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  AgentLiveTelemetry,
  AgentServiceExperimentResponse,
  AgentWindowsService,
  EvoAgentClient,
} from '../../../evoLabCore/services/evoAgentClient';

type LabMode = 'BOOT' | 'FAILURES' | 'INSTALL' | 'SERVICES';
type DepthMode = 'ENTENDER' | 'PROFUNDIZAR' | 'HACER';
type ServiceMode = 'SIMULATED' | 'REAL';

interface BootStep {
  id: string;
  stage: string;
  layer: string;
  title: string;
  userView: string;
  simple: string;
  deep: string;
  component: string;
  input: string;
  output: string;
  check: string;
  failure: string;
  branches?: string[];
}

interface FailureCase {
  id: string;
  title: string;
  symptom: string;
  layer: string;
  hiddenCause: string;
  hypotheses: string[];
  tests: { label: string; evidence: string }[];
  repair: string;
  verify: string;
}

interface InstallStep {
  id: string;
  title: string;
  screen: string;
  simple: string;
  deep: string;
  action: string;
  warning?: string;
  diskMode?: 'EMPTY' | 'LEGACY' | 'GPT_READY' | 'WINDOWS' | 'COMPLETE';
}

interface ServiceProfile {
  name: string;
  displayName: string;
  classification: 'FEATURE_DEPENDENT' | 'OPTIONAL_MICROSOFT' | 'SYSTEM_DEPENDENCY';
  simple: string;
  deep: string;
  gain: string;
  loss: string;
  functionalTest: string;
  realExperimentAllowed: boolean;
  simulatedRamDeltaMb: number;
  simulatedCpuDeltaPct: number;
}

const BOOT_STEPS: BootStep[] = [
  {
    id: 'power',
    stage: '01',
    layer: 'ENERGÍA / FIRMWARE',
    title: 'POWER + UEFI',
    userView: 'Pantalla negra. La PC acaba de encender.',
    simple: 'La computadora recibe energía y el firmware empieza a comprobar que el hardware básico responde.',
    deep: 'UEFI inicializa plataforma, memoria y dispositivos esenciales antes de buscar una entrada de arranque válida.',
    component: 'UEFI firmware',
    input: 'Energía + configuración NVRAM',
    output: 'Hardware mínimo inicializado',
    check: 'msinfo32',
    failure: 'Sin POST, códigos LED/beep o ausencia total de video.',
  },
  {
    id: 'post',
    stage: '02',
    layer: 'FIRMWARE',
    title: 'POST + DETECCIÓN',
    userView: 'Logo del fabricante o información de firmware.',
    simple: 'UEFI revisa memoria, CPU, almacenamiento y dispositivos para poder continuar.',
    deep: 'El firmware enumera buses y controladores, valida memoria entrenada y localiza dispositivos de almacenamiento arrancables.',
    component: 'POST / DXE',
    input: 'CPU + RAM + buses',
    output: 'Dispositivos enumerados',
    check: 'Administrador de firmware / información UEFI',
    failure: 'Memoria no entrenada, unidad no detectada, dispositivo PCIe problemático.',
  },
  {
    id: 'storage',
    stage: '03',
    layer: 'FIRMWARE / STORAGE',
    title: 'BUSCAR DISCO DE ARRANQUE',
    userView: 'Todavía no aparece Windows.',
    simple: 'El firmware busca en qué unidad está instalado Windows.',
    deep: 'UEFI consulta BootOrder/Boot#### en NVRAM y resuelve una ruta hacia la partición de sistema EFI.',
    component: 'NVRAM Boot Manager',
    input: 'BootOrder',
    output: 'Dispositivo de arranque seleccionado',
    check: 'bcdedit /enum firmware',
    failure: 'Orden de arranque incorrecto o unidad ausente.',
  },
  {
    id: 'esp',
    stage: '04',
    layer: 'BOOT',
    title: 'EFI SYSTEM PARTITION',
    userView: 'Windows todavía no es visible.',
    simple: 'Windows guarda sus archivos de arranque en una pequeña partición especial del disco.',
    deep: 'La ESP, normalmente FAT32 en discos GPT/UEFI, contiene los cargadores EFI necesarios para transferir control al Boot Manager.',
    component: 'ESP (FAT32)',
    input: 'Entrada UEFI',
    output: 'bootmgfw.efi localizado',
    check: 'Get-Partition | Format-Table DiskNumber,PartitionNumber,Type,Size',
    failure: 'ESP ausente, dañada o entrada UEFI perdida.',
  },
  {
    id: 'bootmgr',
    stage: '05',
    layer: 'BOOT',
    title: 'WINDOWS BOOT MANAGER',
    userView: 'Puede aparecer selección de sistema operativo o recuperación.',
    simple: 'Este componente decide qué instalación de Windows debe arrancar.',
    deep: 'bootmgfw.efi abre el almacén BCD y resuelve el objeto de cargador que debe ejecutarse.',
    component: 'bootmgfw.efi',
    input: 'ESP + BCD',
    output: 'Entrada de Windows seleccionada',
    check: 'bcdedit /enum',
    failure: 'BCD corrupto, entrada faltante o ruta incorrecta.',
  },
  {
    id: 'bcd',
    stage: '06',
    layer: 'BOOT',
    title: 'BCD',
    userView: 'Si falla, puede aparecer Recovery o error de configuración de arranque.',
    simple: 'BCD es la libreta donde Windows guarda cómo debe arrancar.',
    deep: 'El Boot Configuration Data Store contiene objetos, identificadores y parámetros consumidos por Boot Manager y Winload.',
    component: 'BCD Store',
    input: 'Configuración de arranque',
    output: 'Parámetros para Winload',
    check: 'bcdedit /enum {current}',
    failure: '0xc000000f / Recovery / entrada inválida.',
  },
  {
    id: 'winload',
    stage: '07',
    layer: 'BOOT → KERNEL',
    title: 'WINLOAD.EFI',
    userView: 'Logo de Windows y animación de carga.',
    simple: 'Winload prepara en memoria las piezas que Windows necesita para empezar de verdad.',
    deep: 'winload.efi carga kernel, HAL, hives esenciales y controladores marcados para arranque antes de transferir control.',
    component: 'winload.efi',
    input: 'BCD + volumen de Windows',
    output: 'Kernel y drivers de arranque en memoria',
    check: 'reagentc /info',
    failure: 'Archivo de sistema ausente, volumen inaccesible o driver boot-start defectuoso.',
  },
  {
    id: 'kernel',
    stage: '08',
    layer: 'KERNEL',
    title: 'NTOSKRNL + HAL',
    userView: 'El logo sigue visible; todavía no hay escritorio.',
    simple: 'Ahora arranca el núcleo de Windows: la parte que coordina CPU, memoria, drivers y procesos.',
    deep: 'ntoskrnl.exe inicializa Executive, Memory Manager, scheduler, I/O Manager, Object Manager y subsistemas de seguridad junto a HAL.',
    component: 'ntoskrnl.exe + HAL',
    input: 'Memoria + drivers de arranque',
    output: 'Kernel operativo',
    check: 'systeminfo',
    failure: 'BugCheck temprano, driver incompatible o corrupción crítica.',
  },
  {
    id: 'boot-drivers',
    stage: '09',
    layer: 'KERNEL / DRIVERS',
    title: 'BOOT DRIVERS + SYSTEM HIVE',
    userView: 'Windows continúa cargando sin interacción del usuario.',
    simple: 'Windows activa los controladores que necesita para acceder a disco, hardware y configuración.',
    deep: 'El kernel usa SYSTEM hive para construir grupos de servicios/controladores y arrancar los elementos BOOT_START/SYSTEM_START necesarios.',
    component: 'Drivers + HKLM\\SYSTEM',
    input: 'SYSTEM hive',
    output: 'Hardware crítico disponible',
    check: 'driverquery',
    failure: 'Driver defectuoso, SYSTEM hive dañado o dispositivo esencial inaccesible.',
  },
  {
    id: 'smss',
    stage: '10',
    layer: 'WINDOWS',
    title: 'SESSION MANAGER',
    userView: 'Todavía no aparece el escritorio.',
    simple: 'Windows crea sus primeras sesiones internas.',
    deep: 'smss.exe prepara sesiones, variables y procesos del subsistema Win32 necesarios antes del inicio de sesión.',
    component: 'smss.exe',
    input: 'Kernel operativo',
    output: 'Sesiones del sistema creadas',
    check: 'Get-Process smss',
    failure: 'Fallo grave de inicialización de sesión.',
  },
  {
    id: 'wininit',
    stage: '11',
    layer: 'WINDOWS',
    title: 'WININIT + CSRSS',
    userView: 'Transición hacia los servicios y el inicio de sesión.',
    simple: 'Windows crea procesos internos indispensables para trabajar.',
    deep: 'wininit.exe participa en la creación de services.exe y lsass.exe, mientras csrss.exe soporta partes del entorno de usuario Win32.',
    component: 'wininit.exe / csrss.exe',
    input: 'Sesión del sistema',
    output: 'Infraestructura Win32 base',
    check: 'Get-Process wininit,csrss',
    failure: 'Reinicio, pantalla negra o error crítico de subsistema.',
  },
  {
    id: 'services',
    stage: '12',
    layer: 'SERVICIOS / SEGURIDAD',
    title: 'SERVICES + LSASS',
    userView: 'El sistema prepara red, audio, seguridad y otras funciones.',
    simple: 'Empiezan a trabajar programas invisibles que Windows necesita aunque vos no los abras.',
    deep: 'Service Control Manager arranca servicios según dependencias y grupos; LSASS gestiona autenticación y políticas de seguridad.',
    component: 'services.exe / lsass.exe',
    input: 'Service database',
    output: 'Servicios automáticos inicializados',
    check: 'Get-Service | Where-Object Status -eq Running',
    failure: 'Función específica ausente, dependencia rota o inicio muy lento.',
    branches: ['Audio', 'Red', 'Seguridad', 'Update', 'Drivers auxiliares'],
  },
  {
    id: 'logon',
    stage: '13',
    layer: 'SESIÓN',
    title: 'WINLOGON + LOGONUI',
    userView: 'Aparece la pantalla de inicio de sesión.',
    simple: 'Windows ya puede pedir tus credenciales y abrir tu sesión.',
    deep: 'Winlogon coordina el inicio interactivo y LogonUI presenta el proveedor de credenciales.',
    component: 'winlogon.exe / LogonUI.exe',
    input: 'Servicios de seguridad',
    output: 'Sesión autenticada',
    check: 'Get-Process winlogon -ErrorAction SilentlyContinue',
    failure: 'Pantalla de login ausente, credenciales o proveedor de inicio problemático.',
  },
  {
    id: 'profile',
    stage: '14',
    layer: 'SESIÓN',
    title: 'PERFIL + NTUSER.DAT',
    userView: '“Preparando Windows” o carga del perfil.',
    simple: 'Windows abre tus preferencias, escritorio y configuración personal.',
    deep: 'Se carga el hive de usuario NTUSER.DAT y se materializa HKCU para la sesión autenticada.',
    component: 'User Profile Service',
    input: 'Perfil + NTUSER.DAT',
    output: 'HKCU y entorno del usuario',
    check: '$env:USERPROFILE; Get-ItemProperty HKCU:\\Environment',
    failure: 'Perfil temporal, error de servicio de perfil o hive corrupto.',
  },
  {
    id: 'explorer',
    stage: '15',
    layer: 'SHELL',
    title: 'EXPLORER + DWM',
    userView: 'Aparece escritorio, barra de tareas y ventanas.',
    simple: 'Ya ves Windows, pero todavía puede seguir trabajando en segundo plano.',
    deep: 'Explorer crea el shell interactivo mientras DWM compone las superficies visuales aceleradas por GPU.',
    component: 'explorer.exe / dwm.exe',
    input: 'Sesión de usuario',
    output: 'Escritorio visible',
    check: 'Get-Process explorer,dwm',
    failure: 'Pantalla negra con cursor, shell ausente o composición gráfica anómala.',
    branches: ['Shell', 'DWM', 'Tray', 'Extensiones de Explorer'],
  },
  {
    id: 'startup',
    stage: '16',
    layer: 'POST-LOGIN',
    title: 'STARTUP APPS',
    userView: 'Empiezan a aparecer iconos, launchers y aplicaciones.',
    simple: 'Programas configurados para iniciar con tu cuenta empiezan a cargarse.',
    deep: 'Run/RunOnce, Startup folders y mecanismos de aplicaciones registradas disparan procesos de usuario.',
    component: 'Startup Apps',
    input: 'HKCU/HKLM Run + Startup',
    output: 'Aplicaciones de inicio',
    check: 'Get-CimInstance Win32_StartupCommand',
    failure: 'Inicio saturado, aplicación bloqueada o consumo excesivo.',
  },
  {
    id: 'tasks',
    stage: '17',
    layer: 'POST-LOGIN',
    title: 'TAREAS + SERVICIOS RETRASADOS',
    userView: 'El escritorio responde, pero disco/CPU todavía pueden estar ocupados.',
    simple: 'Windows y otros programas ejecutan trabajos que esperan hasta después del login.',
    deep: 'Scheduled Tasks y Automatic (Delayed Start) agregan actividad en paralelo una vez disponible la sesión.',
    component: 'Task Scheduler + delayed services',
    input: 'Triggers de login/startup',
    output: 'Trabajo de fondo',
    check: 'Get-ScheduledTask | Where-Object State -ne Disabled',
    failure: 'Pico de I/O/CPU después del escritorio o tarea defectuosa.',
    branches: ['Tareas Microsoft', 'OEM', 'Updaters', 'Apps del usuario'],
  },
  {
    id: 'background',
    stage: '18',
    layer: 'ESTABILIZACIÓN',
    title: 'DEFENDER + SEARCH + UPDATE',
    userView: 'La PC puede sentirse pesada aunque ya veas el escritorio.',
    simple: 'Windows todavía puede analizar archivos, indexar, actualizar y completar tareas.',
    deep: 'Defender, Search Indexer, Update/BITS y componentes de mantenimiento pueden coincidir temporalmente y generar CPU/I/O.',
    component: 'Background maintenance',
    input: 'Colas de mantenimiento',
    output: 'Sistema convergiendo a reposo',
    check: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10',
    failure: 'Actividad prolongada, disco 100%, update atascado o indexación problemática.',
    branches: ['Defender', 'WSearch', 'BITS/Update', 'OEM/terceros'],
  },
  {
    id: 'stable',
    stage: '19',
    layer: 'ESTABLE',
    title: 'SYSTEM STABLE',
    userView: 'Escritorio listo y actividad de fondo reducida.',
    simple: 'Windows terminó su arranque principal y la máquina llegó a un estado estable de trabajo.',
    deep: 'No significa cero actividad: significa que las colas iniciales disminuyeron y las métricas se acercan a un baseline reproducible.',
    component: 'Windows operativo',
    input: 'Tareas iniciales completadas',
    output: 'Baseline posible',
    check: 'Get-Date; Get-Process | Measure-Object',
    failure: 'Si nunca estabiliza, hay que identificar qué componente mantiene carga persistente.',
  },
];

const FAILURE_CASES: FailureCase[] = [
  {
    id: 'bcd',
    title: 'Windows no arranca después de tocar particiones',
    symptom: 'La PC llega al firmware y muestra Recovery / error de boot.',
    layer: 'BOOT',
    hiddenCause: 'Entrada BCD inválida o partición EFI no accesible.',
    hypotheses: ['SSD muerto', 'BCD incorrecto', 'RAM defectuosa', 'perfil de usuario roto'],
    tests: [
      { label: '¿UEFI detecta la unidad?', evidence: 'La unidad aparece. El hardware de almacenamiento no queda descartado al 100%, pero el camino de boot existe.' },
      { label: 'Revisar WinRE / particiones', evidence: 'La ESP existe y el volumen Windows está presente.' },
      { label: 'Inspeccionar BCD', evidence: 'La entrada de cargador apunta a una configuración que no coincide con el volumen esperado.' },
    ],
    repair: 'Reconstruir/corregir el camino de arranque sólo después de identificar ESP, volumen Windows y BCD. En el laboratorio la reparación es simulada.',
    verify: 'Repetir el arranque desde UEFI hasta Winload y confirmar que el kernel recibe control.',
  },
  {
    id: 'slow-desktop',
    title: 'El escritorio aparece pero la PC tarda mucho en responder',
    symptom: 'Login rápido; después hay 60–120 segundos de disco y CPU altos.',
    layer: 'POST-LOGIN',
    hiddenCause: 'Aplicaciones de inicio + tarea programada + mantenimiento coinciden.',
    hypotheses: ['SSD lento', 'apps de inicio', 'servicio de audio', 'DNS'],
    tests: [
      { label: 'Revisar Startup', evidence: 'Hay varias aplicaciones configuradas para iniciar con el usuario.' },
      { label: 'Revisar tareas recientes', evidence: 'Una tarea de actualización se dispara en el logon.' },
      { label: 'Comparar actividad después de 2 min', evidence: 'La carga cae cuando terminan los trabajos iniciales: el cuello está en la etapa post-login.' },
    ],
    repair: 'Reducir sólo los elementos de inicio no necesarios y probar A/B. No deshabilitar servicios críticos para “acelerar”.',
    verify: 'Medir tiempo hasta SYSTEM STABLE antes y después con la misma carga.',
  },
  {
    id: 'audio',
    title: 'Windows tiene video pero no reproduce sonido',
    symptom: 'Icono de audio presente; las aplicaciones no logran reproducir correctamente.',
    layer: 'SERVICIOS / DRIVER',
    hiddenCause: 'Windows Audio o AudioEndpointBuilder detenido / dependencia rota.',
    hypotheses: ['Parlante roto', 'servicio de audio', 'DNS', 'pagefile'],
    tests: [
      { label: 'Comprobar dispositivo', evidence: 'El dispositivo de audio aparece en Windows.' },
      { label: 'Comprobar servicios', evidence: 'Una pieza de la cadena de audio está detenida.' },
      { label: 'Reiniciar cadena en simulación', evidence: 'Al restaurar el servicio, la prueba funcional vuelve a pasar.' },
    ],
    repair: 'Restaurar el servicio/dependencia correcta y luego revisar driver si la prueba funcional sigue fallando.',
    verify: 'Reproducir audio de prueba y confirmar que el endpoint permanece activo.',
  },
  {
    id: 'update',
    title: 'Windows Update queda atascado',
    symptom: 'La descarga o instalación no progresa y se repite el intento.',
    layer: 'SERVICING',
    hiddenCause: 'Cola/estado de servicing inconsistente; requiere diagnóstico antes de resetear componentes.',
    hypotheses: ['BITS', 'CBS/Component Store', 'internet', 'GPU'],
    tests: [
      { label: 'Comprobar conectividad', evidence: 'La red funciona para otros destinos.' },
      { label: 'Comprobar servicios de update', evidence: 'Los servicios necesarios existen y su estado puede inspeccionarse.' },
      { label: 'DISM /ScanHealth', evidence: 'La salud del Component Store debe evaluarse antes de aplicar reparación.' },
    ],
    repair: 'Seguir escalera de diagnóstico: estado, logs, DISM/SFC y sólo después acciones de reparación controladas.',
    verify: 'La actualización completa una búsqueda/instalación nueva sin repetir el mismo error.',
  },
  {
    id: 'ram',
    title: '16 GB instalados pero Windows se queda sin memoria',
    symptom: 'Apps se cierran o el sistema pagina intensamente con RAM muy alta.',
    layer: 'MEMORIA',
    hiddenCause: 'Commit elevado por conjunto de procesos; no necesariamente “falta RAM física” aislada.',
    hypotheses: ['Memory leak', 'pagefile', 'muchas apps', 'servicio DHCP'],
    tests: [
      { label: 'Ver procesos por memoria', evidence: 'Se identifica qué procesos concentran Working Set.' },
      { label: 'Comparar RAM vs Commit', evidence: 'El límite de compromiso permite distinguir presión virtual de simple caché física.' },
      { label: 'Cerrar carga controlada', evidence: 'Si el commit cae, la presión estaba asociada a esa carga.' },
    ],
    repair: 'Corregir el proceso/carga responsable o dimensionar memoria/pagefile según evidencia; no vaciar cachés a ciegas.',
    verify: 'Repetir la misma carga y observar RAM, commit y pagefile.',
  },
  {
    id: 'dpc',
    title: 'FPS correctos pero hay microcortes o audio cruje',
    symptom: 'Promedio de FPS aceptable con interrupciones breves perceptibles.',
    layer: 'KERNEL / DRIVERS',
    hiddenCause: 'Latencia de driver / DPC elevada en un escenario simulado.',
    hypotheses: ['GPU al 100%', 'DPC/ISR', 'DNS', 'fuente tipográfica'],
    tests: [
      { label: 'Revisar frametime', evidence: 'Los picos muestran que el promedio de FPS no describe toda la experiencia.' },
      { label: 'Captura DPC/ISR', evidence: 'El laboratorio SIMULATED muestra un driver con picos de latencia.' },
      { label: 'Aislar dispositivo/driver', evidence: 'Cambiar una sola variable permite comparar la distribución de picos.' },
    ],
    repair: 'Actualizar/aislar el controlador sospechoso y repetir exactamente la misma prueba. No declarar culpable sin evidencia suficiente.',
    verify: 'Comparar frametime/DPC antes y después; si no hay señal suficiente, resultado INCONCLUSIVE.',
  },
];

const INSTALL_STEPS: InstallStep[] = [
  {
    id: 'no-os',
    title: 'PC SIN SISTEMA',
    screen: 'NO BOOTABLE DEVICE',
    simple: 'La PC funciona, pero no encuentra un sistema operativo arrancable.',
    deep: 'UEFI no resuelve una entrada válida hacia un cargador en la ESP.',
    action: 'Conectar USB de instalación virtual.',
    diskMode: 'EMPTY',
  },
  {
    id: 'boot-menu',
    title: 'BOOT MENU UEFI',
    screen: 'UEFI BOOT MENU',
    simple: 'Elegimos arrancar desde el instalador, no desde el disco vacío.',
    deep: 'Seleccionamos la entrada UEFI del medio de instalación para conservar el flujo GPT/UEFI.',
    action: 'Seleccionar UEFI: EVO WINDOWS INSTALLER.',
    diskMode: 'EMPTY',
  },
  {
    id: 'setup',
    title: 'WINDOWS SETUP',
    screen: 'Idioma · Región · Teclado',
    simple: 'El instalador empieza y pide los datos básicos.',
    deep: 'Todavía no modifica el disco hasta que llegamos a la selección de destino.',
    action: 'Continuar al tipo de instalación.',
    diskMode: 'EMPTY',
  },
  {
    id: 'custom',
    title: 'TIPO DE INSTALACIÓN',
    screen: 'Upgrade / Personalizada',
    simple: 'Para una instalación limpia elegimos Personalizada.',
    deep: 'La ruta Custom permite seleccionar y preparar explícitamente el disco de destino.',
    action: 'Elegir instalación personalizada.',
    diskMode: 'LEGACY',
  },
  {
    id: 'disk',
    title: 'GESTOR DE DISCOS',
    screen: 'DISCO 0 · 953 GB · ESP / MSR / WINDOWS / RECOVERY',
    simple: 'Este es el punto donde más cuidado hay que tener: elegir mal puede borrar datos.',
    deep: 'En el simulador practicamos GPT y las particiones que Windows necesita sin tocar un disco real.',
    action: 'Preparar esquema GPT simulado.',
    warning: 'SIMULACIÓN: jamás se ejecuta DiskPart ni Format sobre tu PC real.',
    diskMode: 'LEGACY',
  },
  {
    id: 'gpt',
    title: 'PARTICIONES WINDOWS',
    screen: 'ESP · MSR · WINDOWS · RECOVERY',
    simple: 'Windows necesita más de una partición aunque vos después veas principalmente C:.',
    deep: 'ESP aloja boot EFI; MSR reserva espacio de administración; Windows contiene el OS; Recovery soporta WinRE.',
    action: 'Seleccionar partición WINDOWS como destino.',
    diskMode: 'GPT_READY',
  },
  {
    id: 'copy',
    title: 'COPIA E INSTALACIÓN',
    screen: 'Copying files · Getting files ready · Installing features',
    simple: 'El instalador copia y prepara Windows en el nuevo volumen.',
    deep: 'Se aplican imágenes, características y configuración de servicing antes del primer boot.',
    action: 'Esperar finalización simulada.',
    diskMode: 'WINDOWS',
  },
  {
    id: 'first-boot',
    title: 'PRIMER ARRANQUE',
    screen: 'Windows logo · Preparing devices',
    simple: 'Ahora Windows intenta arrancar desde el disco recién preparado.',
    deep: 'Boot Manager y Winload usan la nueva ESP/BCD para iniciar kernel y detectar hardware.',
    action: 'Continuar a OOBE.',
    diskMode: 'WINDOWS',
  },
  {
    id: 'oobe',
    title: 'OOBE',
    screen: 'Región · Cuenta · Privacidad',
    simple: 'Windows termina de configurar la experiencia del usuario.',
    deep: 'Se crean identidad de usuario, políticas iniciales y preferencias de la sesión.',
    action: 'Completar configuración simulada.',
    diskMode: 'WINDOWS',
  },
  {
    id: 'drivers',
    title: 'DRIVERS',
    screen: 'Device Manager',
    simple: 'El escritorio no significa que todos los dispositivos tengan el controlador correcto.',
    deep: 'Comprobamos chipset, GPU, audio, red y dispositivos desconocidos antes de optimizar.',
    action: 'Auditar controladores.',
    diskMode: 'COMPLETE',
  },
  {
    id: 'update',
    title: 'WINDOWS UPDATE + HEALTH',
    screen: 'Update · SFC/DISM · Restore Point',
    simple: 'Primero dejamos Windows sano y actualizado. Después recién medimos rendimiento.',
    deep: 'La instalación se lleva a un estado reproducible antes de cualquier experimento EVO.',
    action: 'Crear baseline inicial.',
    diskMode: 'COMPLETE',
  },
  {
    id: 'stable',
    title: 'WINDOWS ESTABLE',
    screen: 'EVO BASELINE READY',
    simple: 'Ya tenemos una instalación lista para comparar cambios sin adivinar.',
    deep: 'Build, drivers, servicios, uso de memoria y estado del sistema quedan registrados como baseline.',
    action: 'Guardar expediente de instalación.',
    diskMode: 'COMPLETE',
  },
];

const SERVICE_PROFILES: ServiceProfile[] = [
  {
    name: 'SysMain',
    displayName: 'SysMain',
    classification: 'FEATURE_DEPENDENT',
    simple: 'Ayuda a Windows a anticipar aplicaciones y patrones de uso.',
    deep: 'Mantiene mecanismos de precarga/caching adaptativo. Su beneficio depende del almacenamiento, memoria y patrón de trabajo.',
    gain: 'Podría reducir actividad asociada a precarga en algunos escenarios.',
    loss: 'Puede perderse parte del comportamiento de precarga adaptativa.',
    functionalTest: 'Repetir apertura de apps y observar I/O/tiempo de respuesta.',
    realExperimentAllowed: true,
    simulatedRamDeltaMb: -24,
    simulatedCpuDeltaPct: -0.2,
  },
  {
    name: 'WSearch',
    displayName: 'Windows Search',
    classification: 'FEATURE_DEPENDENT',
    simple: 'Indexa contenido para acelerar búsquedas.',
    deep: 'Windows Search mantiene un índice y procesa cambios del sistema de archivos en segundo plano.',
    gain: 'Menos actividad de indexación durante el experimento.',
    loss: 'Las búsquedas pueden ser más lentas o incompletas mientras está detenido.',
    functionalTest: 'Buscar un archivo conocido desde Inicio/Explorer.',
    realExperimentAllowed: true,
    simulatedRamDeltaMb: -36,
    simulatedCpuDeltaPct: -0.3,
  },
  {
    name: 'Spooler',
    displayName: 'Print Spooler',
    classification: 'FEATURE_DEPENDENT',
    simple: 'Administra trabajos de impresión.',
    deep: 'Spooler coordina colas, drivers y entrega de trabajos a impresoras.',
    gain: 'Ganancia de recursos normalmente pequeña si estaba ocioso.',
    loss: 'No se puede imprimir mientras esté detenido.',
    functionalTest: 'Abrir cola de impresión / enviar trabajo de prueba.',
    realExperimentAllowed: true,
    simulatedRamDeltaMb: -12,
    simulatedCpuDeltaPct: -0.1,
  },
  {
    name: 'DiagTrack',
    displayName: 'Connected User Experiences and Telemetry',
    classification: 'OPTIONAL_MICROSOFT',
    simple: 'Participa en experiencias conectadas y recopilación de diagnóstico.',
    deep: 'El impacto depende de versión, configuración y actividad; no se debe prometer una mejora de rendimiento por detenerlo.',
    gain: 'Puede reducir actividad asociada al propio servicio durante la prueba.',
    loss: 'Algunas funciones de diagnóstico/experiencia conectada pueden dejar de operar durante el experimento.',
    functionalTest: 'Comprobar estado del servicio y eventos relacionados; no asumir ganancia de FPS.',
    realExperimentAllowed: true,
    simulatedRamDeltaMb: -18,
    simulatedCpuDeltaPct: -0.1,
  },
  {
    name: 'Audiosrv',
    displayName: 'Windows Audio',
    classification: 'SYSTEM_DEPENDENCY',
    simple: 'Hace posible que las aplicaciones reproduzcan y capturen audio.',
    deep: 'Forma parte de una cadena con AudioEndpointBuilder y endpoints/controladores.',
    gain: 'El ahorro de recursos no justifica perder una función central.',
    loss: 'Audio del sistema y aplicaciones deja de funcionar.',
    functionalTest: 'Reproducción de audio.',
    realExperimentAllowed: false,
    simulatedRamDeltaMb: -16,
    simulatedCpuDeltaPct: -0.1,
  },
  {
    name: 'Dnscache',
    displayName: 'DNS Client',
    classification: 'SYSTEM_DEPENDENCY',
    simple: 'Ayuda a Windows a resolver nombres como sitios web a direcciones de red.',
    deep: 'Participa en resolución/caché DNS y su interacción con componentes de red.',
    gain: 'No se considera una optimización rutinaria.',
    loss: 'Puede afectar resolución de nombres y comportamiento de red.',
    functionalTest: 'nslookup + navegación por nombre.',
    realExperimentAllowed: false,
    simulatedRamDeltaMb: -8,
    simulatedCpuDeltaPct: 0,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface EvoWindowsXRayLabProps {
  initialScenario?: string;
}

export const EvoWindowsXRayLab: React.FC<EvoWindowsXRayLabProps> = ({ initialScenario }) => {
  const initialMode: LabMode =
    initialScenario === 'windows-install'
      ? 'INSTALL'
      : initialScenario === 'services-baseline'
      ? 'SERVICES'
      : initialScenario === 'repair'
      ? 'FAILURES'
      : 'BOOT';

  const [mode, setMode] = useState<LabMode>(initialMode);
  const [depth, setDepth] = useState<DepthMode>('ENTENDER');
  const [xrayEnabled, setXrayEnabled] = useState(true);
  const [bootIndex, setBootIndex] = useState(0);
  const [failureIndex, setFailureIndex] = useState(0);
  const [failureTestCount, setFailureTestCount] = useState(0);
  const [installIndex, setInstallIndex] = useState(0);
  const [serviceMode, setServiceMode] = useState<ServiceMode>('SIMULATED');
  const [selectedServiceName, setSelectedServiceName] = useState(SERVICE_PROFILES[0].name);
  const [simServiceRunning, setSimServiceRunning] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SERVICE_PROFILES.map((service) => [service.name, true]))
  );
  const [agentConnected, setAgentConnected] = useState(false);
  const [agentTelemetry, setAgentTelemetry] = useState<AgentLiveTelemetry | null>(null);
  const [realServices, setRealServices] = useState<AgentWindowsService[]>([]);
  const [isRefreshingAgent, setIsRefreshingAgent] = useState(false);
  const [pendingRealAction, setPendingRealAction] = useState<'STOP' | 'START' | null>(null);
  const [realExperimentBusy, setRealExperimentBusy] = useState(false);
  const [realExperiment, setRealExperiment] = useState<{
    action: 'STOP' | 'START';
    serviceName: string;
    response: AgentServiceExperimentResponse;
    beforeTelemetry: AgentLiveTelemetry | null;
    afterTelemetry: AgentLiveTelemetry | null;
  } | null>(null);

  const bootStep = BOOT_STEPS[bootIndex];
  const failureCase = FAILURE_CASES[failureIndex];
  const installStep = INSTALL_STEPS[installIndex];
  const selectedProfile =
    SERVICE_PROFILES.find((service) => service.name === selectedServiceName) || SERVICE_PROFILES[0];
  const selectedRealService = realServices.find(
    (service) => service.name.toLowerCase() === selectedProfile.name.toLowerCase()
  );

  const refreshAgent = async () => {
    setIsRefreshingAgent(true);
    try {
      const health = await EvoAgentClient.pingAgent(1600);
      const connected = Boolean(health && health.status === 'OK' && health.isWindows);
      setAgentConnected(connected);

      if (!connected) {
        setAgentTelemetry(null);
        setRealServices([]);
        return;
      }

      await EvoAgentClient.startTelemetrySampling();
      await delay(650);
      const [telemetry, servicesResponse] = await Promise.all([
        EvoAgentClient.fetchLiveTelemetry(),
        EvoAgentClient.fetchWindowsServices(),
      ]);
      setAgentTelemetry(telemetry);
      setRealServices(servicesResponse?.services || []);
    } finally {
      setIsRefreshingAgent(false);
    }
  };

  useEffect(() => {
    void refreshAgent();
  }, []);

  useEffect(() => {
    if (!agentConnected) return;
    const timer = window.setInterval(async () => {
      const telemetry = await EvoAgentClient.fetchLiveTelemetry();
      if (telemetry) setAgentTelemetry(telemetry);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [agentConnected]);

  const monitorState = useMemo(() => {
    if (mode === 'BOOT') return bootStep.userView;
    if (mode === 'INSTALL') return installStep.screen;
    if (mode === 'FAILURES') return failureCase.symptom;
    const running =
      serviceMode === 'REAL'
        ? selectedRealService?.state === 'Running'
        : simServiceRunning[selectedProfile.name];
    return running
      ? `${selectedProfile.displayName}: RUNNING`
      : `${selectedProfile.displayName}: STOPPED`;
  }, [
    mode,
    bootStep,
    installStep,
    failureCase,
    serviceMode,
    selectedRealService,
    simServiceRunning,
    selectedProfile,
  ]);

  const applyRealServiceExperiment = async () => {
    if (!pendingRealAction || !agentConnected || !selectedProfile.realExperimentAllowed) return;
    setRealExperimentBusy(true);
    try {
      const beforeTelemetry = await EvoAgentClient.fetchLiveTelemetry();
      const response = await EvoAgentClient.applyServiceExperiment(
        selectedProfile.name,
        pendingRealAction
      );
      if (!response) return;
      await delay(1800);
      const afterTelemetry = await EvoAgentClient.fetchLiveTelemetry();
      const servicesResponse = await EvoAgentClient.fetchWindowsServices();
      setRealServices(servicesResponse?.services || []);
      setAgentTelemetry(afterTelemetry);
      setRealExperiment({
        action: pendingRealAction,
        serviceName: selectedProfile.name,
        response,
        beforeTelemetry,
        afterTelemetry,
      });
      setPendingRealAction(null);
    } finally {
      setRealExperimentBusy(false);
    }
  };

  const renderProvenanceBadge = (label: string, tone = 'cyan') => {
    const classes =
      tone === 'emerald'
        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
        : tone === 'amber'
        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
        : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300';
    return (
      <span className={`px-2 py-0.5 rounded border text-[9px] font-black tracking-wider ${classes}`}>
        {label}
      </span>
    );
  };

  const renderDisk = () => {
    const mode = installStep.diskMode || 'EMPTY';
    if (mode === 'EMPTY') {
      return (
        <div className="h-16 rounded-lg border border-dashed border-zinc-700 bg-black/40 flex items-center justify-center text-[10px] text-zinc-500">
          DISCO 0 // 953 GB // SIN SISTEMA ARRANCABLE
        </div>
      );
    }

    if (mode === 'LEGACY') {
      return (
        <div className="h-16 rounded-lg overflow-hidden border border-zinc-700 flex text-[9px] font-bold">
          <div className="w-[12%] bg-amber-500/20 border-r border-zinc-700 flex items-center justify-center text-amber-300">OLD</div>
          <div className="flex-1 bg-zinc-900 flex items-center justify-center text-zinc-400">ESPACIO / PARTICIONES A REVISAR</div>
        </div>
      );
    }

    return (
      <div className="h-16 rounded-lg overflow-hidden border border-zinc-700 flex text-[9px] font-bold">
        <div className="w-[8%] bg-cyan-500/20 border-r border-cyan-500/30 flex items-center justify-center text-cyan-300">ESP</div>
        <div className="w-[5%] bg-zinc-800 border-r border-zinc-700 flex items-center justify-center text-zinc-400">MSR</div>
        <div className="flex-1 bg-blue-500/10 border-r border-blue-500/30 flex items-center justify-center text-blue-200">WINDOWS</div>
        <div className="w-[12%] bg-emerald-500/10 flex items-center justify-center text-emerald-300">RECOVERY</div>
      </div>
    );
  };

  const tabs: { id: LabMode; label: string; icon: React.ReactNode }[] = [
    { id: 'BOOT', label: 'ARRANQUE', icon: <Power className="w-3.5 h-3.5" /> },
    { id: 'FAILURES', label: 'FALLAS', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'INSTALL', label: 'FORMATEO / INSTALACIÓN', icon: <HardDrive className="w-3.5 h-3.5" /> },
    { id: 'SERVICES', label: 'SERVICIOS A/B', icon: <Server className="w-3.5 h-3.5" /> },
  ];

  return (
    <section className="rounded-2xl border border-cyan-500/30 bg-[#07090d] shadow-[0_0_45px_rgba(0,0,0,0.55)] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-cyan-500/10 via-transparent to-amber-500/5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {renderProvenanceBadge('EVO WINDOWS X-RAY')}
              {renderProvenanceBadge('SIMULATION ENGINE', 'amber')}
              {agentConnected
                ? renderProvenanceBadge('REAL PC CONNECTED', 'emerald')
                : renderProvenanceBadge('REAL PC OFFLINE', 'amber')}
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
              Windows por fuera. Windows por dentro.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial max-w-4xl mt-1">
              Aprendé viendo qué ocurre, provocá fallas sin arriesgar tu PC y, cuando EVO Agent esté conectado,
              contrastá la simulación con datos reales del sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refreshAgent()}
            disabled={isRefreshingAgent}
            className="self-start xl:self-center px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-900 hover:border-cyan-500/50 text-zinc-200 text-[10px] font-black flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingAgent ? 'animate-spin' : ''}`} />
            {agentConnected ? 'ACTUALIZAR PC REAL' : 'BUSCAR EVO AGENT'}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-black flex items-center gap-1.5 transition-all ${
                mode === tab.id
                  ? 'bg-cyan-400 text-black border-cyan-300'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-4 rounded-2xl border border-zinc-800 bg-black overflow-hidden min-h-[360px] flex flex-col">
          <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between text-[10px]">
            <span className="font-black text-zinc-300 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              MONITOR // VISTA DEL USUARIO
            </span>
            <span className="text-zinc-600">EVO DISPLAY 01</span>
          </div>

          <div className="flex-1 relative p-5 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.7),#020305_72%)]">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[9px] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              DISPLAY ACTIVE
            </div>

            <div className="max-w-sm w-full text-center">
              {mode === 'BOOT' && bootIndex < 4 && <div className="text-cyan-400 text-4xl mb-4">EVO</div>}
              {mode === 'BOOT' && bootIndex >= 4 && bootIndex < 15 && (
                <div className="mx-auto w-12 h-12 rounded-xl border border-cyan-400/50 flex items-center justify-center mb-4 text-cyan-300 font-black">
                  W
                </div>
              )}
              {mode === 'INSTALL' && (
                <div className="mx-auto w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/40 flex items-center justify-center mb-4 text-blue-300 font-black">
                  W
                </div>
              )}
              {mode === 'FAILURES' && <AlertTriangle className="w-12 h-12 mx-auto text-amber-400 mb-4" />}
              {mode === 'SERVICES' && <Activity className="w-12 h-12 mx-auto text-cyan-400 mb-4" />}

              <div className="font-display font-black text-lg text-white uppercase tracking-tight">
                {mode === 'BOOT'
                  ? bootStep.title
                  : mode === 'INSTALL'
                  ? installStep.title
                  : mode === 'FAILURES'
                  ? failureCase.title
                  : selectedProfile.displayName}
              </div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{monitorState}</p>

              {mode === 'BOOT' && bootIndex === BOOT_STEPS.length - 1 && (
                <div className="mt-5 px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[10px] font-black">
                  SYSTEM STABLE // BASELINE POSIBLE
                </div>
              )}

              {mode === 'INSTALL' && installStep.warning && (
                <div className="mt-4 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                  {installStep.warning}
                </div>
              )}
            </div>
          </div>

          <div className="px-3 py-2 border-t border-zinc-800 bg-zinc-950 text-[9px] text-zinc-500 flex items-center justify-between">
            <span>VISIBLE PARA EL USUARIO</span>
            <span>{mode}</span>
          </div>
        </div>

        <div className="xl:col-span-4 rounded-2xl border border-zinc-800 bg-[#090c12] min-h-[360px] flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              RAYOS X // WINDOWS INTERNO
            </span>
            <button
              type="button"
              onClick={() => setXrayEnabled((value) => !value)}
              className={`px-2 py-1 rounded border text-[9px] font-black flex items-center gap-1 ${
                xrayEnabled
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-500'
              }`}
            >
              <Eye className="w-3 h-3" />
              {xrayEnabled ? 'ACTIVO' : 'OCULTO'}
            </button>
          </div>

          <div className="flex-1 p-4">
            {!xrayEnabled ? (
              <div className="h-full flex items-center justify-center text-center text-xs text-zinc-500">
                Activá RAYOS X para ver qué ocurre detrás de la interfaz.
              </div>
            ) : mode === 'BOOT' ? (
              <div className="space-y-3">
                <div className="text-[9px] text-zinc-500 uppercase">Flujo activo</div>
                {['UEFI', 'BOOT', 'KERNEL', 'SERVICIOS', 'SESIÓN', 'POST-LOGIN', 'ESTABLE'].map((layer) => {
                  const layerOrder = ['ENERGÍA / FIRMWARE', 'FIRMWARE', 'FIRMWARE / STORAGE', 'BOOT', 'BOOT → KERNEL', 'KERNEL', 'KERNEL / DRIVERS', 'WINDOWS', 'SERVICIOS / SEGURIDAD', 'SESIÓN', 'SHELL', 'POST-LOGIN', 'ESTABILIZACIÓN', 'ESTABLE'];
                  const currentPos = layerOrder.indexOf(bootStep.layer);
                  const targets: Record<string, number> = {
                    UEFI: 0,
                    BOOT: 3,
                    KERNEL: 5,
                    SERVICIOS: 8,
                    SESIÓN: 9,
                    'POST-LOGIN': 11,
                    ESTABLE: 13,
                  };
                  const active = currentPos >= targets[layer];
                  return (
                    <div key={layer} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full border ${active ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'bg-zinc-900 border-zinc-700'}`} />
                      <div className={`flex-1 px-2 py-1.5 rounded border text-[10px] font-bold ${active ? 'border-cyan-500/30 bg-cyan-500/5 text-zinc-200' : 'border-zinc-800 text-zinc-600'}`}>
                        {layer}
                      </div>
                    </div>
                  );
                })}

                <div className="mt-4 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
                  <div className="text-[9px] text-amber-300 font-black mb-1">AHORA ACTIVO</div>
                  <div className="text-sm text-white font-black">{bootStep.component}</div>
                  <div className="mt-2 grid grid-cols-[72px_1fr] gap-1 text-[9px]">
                    <span className="text-zinc-500">ENTRADA</span>
                    <span className="text-zinc-300">{bootStep.input}</span>
                    <span className="text-zinc-500">SALIDA</span>
                    <span className="text-zinc-300">{bootStep.output}</span>
                  </div>
                  {bootStep.branches && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {bootStep.branches.map((branch) => (
                        <span key={branch} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[8px] text-zinc-400">
                          {branch}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : mode === 'INSTALL' ? (
              <div className="space-y-4">
                <div className="text-[9px] text-zinc-500">DISCO VIRTUAL // SIMULATED</div>
                {renderDisk()}
                <div className="space-y-1.5 text-[10px]">
                  {['UEFI', 'GPT', 'ESP', 'WINDOWS', 'WINRE', 'DRIVERS', 'BASELINE'].map((node, index) => {
                    const progress = Math.floor((installIndex / Math.max(1, INSTALL_STEPS.length - 1)) * 6);
                    const active = index <= progress;
                    return (
                      <div key={node} className={`p-2 rounded border flex items-center justify-between ${active ? 'border-blue-500/30 bg-blue-500/5 text-zinc-200' : 'border-zinc-800 text-zinc-600'}`}>
                        <span>{node}</span>
                        {active ? <CheckCircle2 className="w-3 h-3 text-blue-300" /> : <Lock className="w-3 h-3" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : mode === 'FAILURES' ? (
              <div className="space-y-3">
                <div className="px-3 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 text-[10px] font-black">
                  FALLA INYECTADA // {failureCase.layer}
                </div>
                <div className="space-y-2">
                  {failureCase.tests.map((test, index) => {
                    const executed = index < failureTestCount;
                    return (
                      <div key={test.label} className={`p-2.5 rounded-lg border ${executed ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-zinc-800 bg-black/30'}`}>
                        <div className="text-[10px] font-bold text-zinc-200">{test.label}</div>
                        {executed && <div className="text-[9px] text-zinc-400 mt-1">{test.evidence}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-[9px] text-zinc-500 uppercase">
                  CADENA FUNCIONAL // {serviceMode}
                </div>
                <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                  <div className="text-xs font-black text-white">{selectedProfile.displayName}</div>
                  <div className="text-[9px] text-zinc-400 mt-1">{selectedProfile.classification}</div>
                </div>
                <div className="flex justify-center text-zinc-600">↓</div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-black/40 text-[10px] text-zinc-300">
                  DEPENDENCIAS / PROCESOS
                </div>
                <div className="flex justify-center text-zinc-600">↓</div>
                <div className={`p-3 rounded-xl border text-[10px] ${
                  (serviceMode === 'REAL'
                    ? selectedRealService?.state === 'Running'
                    : simServiceRunning[selectedProfile.name])
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/5 text-rose-300'
                }`}>
                  FUNCIÓN: {selectedProfile.functionalTest}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 rounded-2xl border border-zinc-800 bg-[#0b0e14] min-h-[360px] flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-zinc-800 flex items-center gap-1.5 text-[10px] font-black text-zinc-300">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            EVO EXPLICA
          </div>

          <div className="px-3 pt-3 flex gap-1.5">
            {(['ENTENDER', 'PROFUNDIZAR', 'HACER'] as DepthMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDepth(item)}
                className={`flex-1 px-2 py-1.5 rounded border text-[9px] font-black ${
                  depth === item
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="p-3 flex-1">
            {mode === 'BOOT' && (
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] text-cyan-400 font-black">ETAPA {bootStep.stage} // {bootStep.layer}</div>
                  <h3 className="text-lg font-display font-black text-white mt-1">{bootStep.title}</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {depth === 'ENTENDER' ? bootStep.simple : depth === 'PROFUNDIZAR' ? bootStep.deep : `COMPROBÁ EN TU PC: ${bootStep.check}`}
                </p>
                <div className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5">
                  <div className="text-[9px] text-rose-300 font-black">SI FALLA ACÁ</div>
                  <div className="text-[10px] text-zinc-400 mt-1">{bootStep.failure}</div>
                </div>
              </div>
            )}

            {mode === 'INSTALL' && (
              <div className="space-y-3">
                {renderProvenanceBadge('SIMULATED', 'amber')}
                <h3 className="text-lg font-display font-black text-white">{installStep.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {depth === 'ENTENDER' ? installStep.simple : depth === 'PROFUNDIZAR' ? installStep.deep : installStep.action}
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] text-cyan-300 font-mono">
                  ACCIÓN → {installStep.action}
                </div>
              </div>
            )}

            {mode === 'FAILURES' && (
              <div className="space-y-3">
                {renderProvenanceBadge('SIMULATED FAILURE', 'amber')}
                <h3 className="text-lg font-display font-black text-white">{failureCase.title}</h3>
                <div className="text-[10px] text-zinc-400">
                  No asumas la causa. Primero reuní evidencia.
                </div>
                <div className="space-y-1">
                  {failureCase.hypotheses.map((hypothesis) => (
                    <div key={hypothesis} className="px-2 py-1.5 rounded border border-zinc-800 bg-black/30 text-[10px] text-zinc-300">
                      □ {hypothesis}
                    </div>
                  ))}
                </div>
                {failureTestCount >= failureCase.tests.length && (
                  <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                    <div className="text-[9px] text-emerald-300 font-black">CAUSA DEL CASO SIMULADO</div>
                    <div className="text-[10px] text-zinc-300 mt-1">{failureCase.hiddenCause}</div>
                    <div className="text-[9px] text-zinc-500 mt-2">REPARACIÓN GUIADA</div>
                    <div className="text-[10px] text-zinc-300">{failureCase.repair}</div>
                    <div className="text-[9px] text-zinc-500 mt-2">COMPROBAR</div>
                    <div className="text-[10px] text-zinc-300">{failureCase.verify}</div>
                  </div>
                )}
              </div>
            )}

            {mode === 'SERVICES' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {serviceMode === 'REAL'
                    ? renderProvenanceBadge(agentConnected ? 'SYSTEM_REPORTED' : 'REAL PC OFFLINE', agentConnected ? 'emerald' : 'amber')
                    : renderProvenanceBadge('SIMULATED', 'amber')}
                </div>
                <h3 className="text-lg font-display font-black text-white">{selectedProfile.displayName}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {depth === 'ENTENDER'
                    ? selectedProfile.simple
                    : depth === 'PROFUNDIZAR'
                    ? selectedProfile.deep
                    : selectedProfile.functionalTest}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                    <div className="text-[8px] text-emerald-300 font-black">QUÉ PODRÍAS GANAR</div>
                    <div className="text-[9px] text-zinc-400 mt-1">{selectedProfile.gain}</div>
                  </div>
                  <div className="p-2 rounded-lg border border-rose-500/20 bg-rose-500/5">
                    <div className="text-[8px] text-rose-300 font-black">QUÉ PODRÍAS PERDER</div>
                    <div className="text-[9px] text-zinc-400 mt-1">{selectedProfile.loss}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-5">
        {mode === 'BOOT' && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-[9px] text-zinc-500">TIMELINE DE ARRANQUE</div>
              <div className="text-xs text-zinc-300 mt-1">
                {bootIndex + 1} / {BOOT_STEPS.length} · {bootStep.title}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={bootIndex === 0}
                onClick={() => setBootIndex((index) => Math.max(0, index - 1))}
                className="px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 disabled:opacity-30 flex items-center gap-1 text-[10px] font-black"
              >
                <ChevronLeft className="w-3 h-3" /> ANTERIOR
              </button>
              <button
                type="button"
                onClick={() =>
                  bootIndex === BOOT_STEPS.length - 1
                    ? setBootIndex(0)
                    : setBootIndex((index) => Math.min(BOOT_STEPS.length - 1, index + 1))
                }
                className="px-3 py-2 rounded-lg bg-cyan-400 text-black flex items-center gap-1 text-[10px] font-black"
              >
                {bootIndex === BOOT_STEPS.length - 1 ? <RotateCcw className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {bootIndex === BOOT_STEPS.length - 1 ? 'REINICIAR' : 'SIGUIENTE PASO'}
              </button>
            </div>
          </div>
        )}

        {mode === 'FAILURES' && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 space-y-3">
            <div className="flex flex-wrap gap-2">
              {FAILURE_CASES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFailureIndex(index);
                    setFailureTestCount(0);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-bold ${
                    failureIndex === index
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[10px] text-zinc-400">
                PRUEBAS: {failureTestCount}/{failureCase.tests.length}
              </div>
              <button
                type="button"
                onClick={() =>
                  setFailureTestCount((count) =>
                    count >= failureCase.tests.length ? 0 : count + 1
                  )
                }
                className="px-3 py-2 rounded-lg bg-amber-400 text-black text-[10px] font-black flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                {failureTestCount >= failureCase.tests.length ? 'REINICIAR CASO' : 'EJECUTAR SIGUIENTE PRUEBA'}
              </button>
            </div>
          </div>
        )}

        {mode === 'INSTALL' && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-[9px] text-zinc-500">INSTALACIÓN SIMULADA</div>
              <div className="text-xs text-zinc-300 mt-1">
                {installIndex + 1} / {INSTALL_STEPS.length} · {installStep.title}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={installIndex === 0}
                onClick={() => setInstallIndex((index) => Math.max(0, index - 1))}
                className="px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 disabled:opacity-30 flex items-center gap-1 text-[10px] font-black"
              >
                <ChevronLeft className="w-3 h-3" /> ANTERIOR
              </button>
              <button
                type="button"
                onClick={() =>
                  installIndex === INSTALL_STEPS.length - 1
                    ? setInstallIndex(0)
                    : setInstallIndex((index) => Math.min(INSTALL_STEPS.length - 1, index + 1))
                }
                className="px-3 py-2 rounded-lg bg-blue-400 text-black flex items-center gap-1 text-[10px] font-black"
              >
                {installIndex === INSTALL_STEPS.length - 1 ? <RotateCcw className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                {installIndex === INSTALL_STEPS.length - 1 ? 'REINICIAR INSTALACIÓN' : 'CONTINUAR'}
              </button>
            </div>
          </div>
        )}

        {mode === 'SERVICES' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceMode('SIMULATED')}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-black ${
                      serviceMode === 'SIMULATED'
                        ? 'bg-amber-400 text-black border-amber-300'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    SIMULATED
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceMode('REAL')}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-black ${
                      serviceMode === 'REAL'
                        ? 'bg-emerald-400 text-black border-emerald-300'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    MI PC REAL
                  </button>
                </div>

                {serviceMode === 'REAL' && agentTelemetry && (
                  <div className="flex flex-wrap gap-3 text-[9px]">
                    <span className="text-zinc-400">
                      CPU <strong className="text-white">{agentTelemetry.cpu.utilizationPercent}%</strong>{' '}
                      <em className="text-zinc-600">{agentTelemetry.cpu.provenance}</em>
                    </span>
                    <span className="text-zinc-400">
                      RAM <strong className="text-white">{agentTelemetry.memory.utilizationPercent}%</strong>{' '}
                      <em className="text-zinc-600">{agentTelemetry.memory.provenance}</em>
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
                {SERVICE_PROFILES.map((service) => {
                  const realState = realServices.find(
                    (item) => item.name.toLowerCase() === service.name.toLowerCase()
                  )?.state;
                  const running =
                    serviceMode === 'REAL' ? realState === 'Running' : simServiceRunning[service.name];
                  return (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => {
                        setSelectedServiceName(service.name);
                        setPendingRealAction(null);
                        setRealExperiment(null);
                      }}
                      className={`p-2 rounded-lg border text-left ${
                        selectedServiceName === service.name
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-zinc-800 bg-black/30'
                      }`}
                    >
                      <div className="text-[10px] font-black text-zinc-200 truncate">{service.displayName}</div>
                      <div className={`text-[8px] mt-1 ${running ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {serviceMode === 'REAL' && !realState ? 'NO INFORMADO' : running ? 'RUNNING' : 'STOPPED'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {serviceMode === 'SIMULATED' ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="text-[10px] text-zinc-300">
                  Resultado modelado: RAM {selectedProfile.simulatedRamDeltaMb} MB · CPU idle {selectedProfile.simulatedCpuDeltaPct} pp.
                  <strong className="text-amber-300"> SIMULATED — no es una medición de tu PC.</strong>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSimServiceRunning((state) => ({
                      ...state,
                      [selectedProfile.name]: !state[selectedProfile.name],
                    }))
                  }
                  className="px-3 py-2 rounded-lg bg-amber-400 text-black text-[10px] font-black flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {simServiceRunning[selectedProfile.name] ? 'SIMULAR STOP' : 'REVERTIR SIMULACIÓN'}
                </button>
              </div>
            ) : !agentConnected ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-[10px] text-zinc-300">
                <strong className="text-amber-300">EVO Agent no está conectado.</strong> El modo REAL nunca usa datos simulados como reemplazo.
              </div>
            ) : !selectedProfile.realExperimentAllowed ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 text-[10px] text-zinc-300 flex items-start gap-2">
                <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                EVO permite estudiar este servicio pero bloquea su modificación real desde el laboratorio porque pertenece a una dependencia sensible.
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="text-[10px] text-zinc-300">
                    Estado real:{' '}
                    <strong className="text-white">{selectedRealService?.state || 'UNKNOWN'}</strong>
                    {' · '}Inicio: <strong className="text-white">{selectedRealService?.startMode || 'UNKNOWN'}</strong>
                    {' · '}PID: <strong className="text-white">{selectedRealService?.processId || 0}</strong>
                    {' · '}Working Set: <strong className="text-white">{selectedRealService?.workingSetMb || 0} MB</strong>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedRealService || realExperimentBusy}
                    onClick={() =>
                      setPendingRealAction(selectedRealService?.state === 'Running' ? 'STOP' : 'START')
                    }
                    className="px-3 py-2 rounded-lg bg-emerald-400 text-black text-[10px] font-black disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    {selectedRealService?.state === 'Running' ? 'PREPARAR EXPERIMENTO STOP' : 'PREPARAR START'}
                  </button>
                </div>

                {pendingRealAction && (
                  <div className="p-3 rounded-xl border border-amber-400/40 bg-black/40">
                    <div className="text-[10px] font-black text-amber-300">
                      CONFIRMACIÓN EXPLÍCITA // {pendingRealAction} {selectedProfile.name}
                    </div>
                    <p className="text-[9px] text-zinc-400 mt-1">
                      EVO tomará telemetría antes/después y ejecutará únicamente una acción allowlisted.
                      No cambia StartupType. STOP es temporal y puede afectar: {selectedProfile.loss}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPendingRealAction(null)}
                        className="px-2.5 py-1.5 rounded border border-zinc-700 text-zinc-400 text-[9px] font-black"
                      >
                        CANCELAR
                      </button>
                      <button
                        type="button"
                        disabled={realExperimentBusy}
                        onClick={() => void applyRealServiceExperiment()}
                        className="px-2.5 py-1.5 rounded bg-amber-400 text-black text-[9px] font-black disabled:opacity-50"
                      >
                        {realExperimentBusy ? 'MIDIENDO…' : 'CONFIRMAR EXPERIMENTO'}
                      </button>
                    </div>
                  </div>
                )}

                {realExperiment && (
                  <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                      <span className="text-[10px] font-black text-cyan-300">A/B REAL OBSERVADO</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[9px]">
                      <div className="p-2 rounded bg-black/30">
                        <div className="text-zinc-500">ANTES RAM</div>
                        <div className="text-white font-bold">{realExperiment.beforeTelemetry?.memory.utilizationPercent ?? '—'}%</div>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <div className="text-zinc-500">DESPUÉS RAM</div>
                        <div className="text-white font-bold">{realExperiment.afterTelemetry?.memory.utilizationPercent ?? '—'}%</div>
                      </div>
                      <div className="p-2 rounded bg-black/30">
                        <div className="text-zinc-500">PROCEDENCIA</div>
                        <div className="text-emerald-300 font-bold">SYSTEM_REPORTED</div>
                      </div>
                    </div>
                    <p className="text-[9px] text-zinc-500 mt-2">
                      Una sola muestra before/after no demuestra causalidad. EVO registra el delta observado y exige repetir la prueba para concluir.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 sm:px-5 py-3 border-t border-zinc-800 bg-black/30 flex flex-col md:flex-row md:items-center justify-between gap-2 text-[9px]">
        <div className="flex items-center gap-2 text-zinc-500">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          SIMULATED nunca se presenta como MEASURED. Modo REAL requiere EVO Agent y acción allowlisted.
        </div>
        <div className="text-zinc-600 font-black tracking-wider">
          NO LO CREAS. COMPROBALO.
        </div>
      </div>
    </section>
  );
};
