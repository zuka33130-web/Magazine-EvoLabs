import React, { useState } from 'react';
import pcbDetailImg from '../../assets/images/pcb_traces_detail_1789530447414.jpg';
import {
  Zap,
  Search,
  Power,
  Terminal,
  Cpu,
  Wrench,
  Boxes,
  Activity,
  Globe,
  Shield,
  Code,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Layers,
  FileCheck,
  Target,
  FlaskConical,
  Monitor,
  Server,
  HardDrive,
  Sliders,
  Compass,
  Flame,
} from 'lucide-react';
import { EVO_MASTER_TOOLS_CATALOG } from '../../data/evoToolsData';

export interface EvoPublicLabsCatalogProps {
  onOpenHotSwapLab: (subPanel?: 'sandbox' | 'hardware' | 'software' | 'telemetry' | 'all') => void;
  onOpenWindowsMatrixLab: (scenario?: string) => void;
  onOpenWindowsXRayLab?: (scenario?: string) => void;
  onOpenBootLab: () => void;
  onOpenLabCore?: (phase?: 'SELECT_PC' | 'BUILD_PC' | 'LAB_ACTIVE') => void;
  onOpenCampusLab?: (labId: string) => void;
  onOpenCaseResolver?: () => void;
  onOpenDigitalTwin?: () => void;
  onOpenTransferChallenge?: () => void;
  onOpenTomo?: (tomoNumber: string) => void;
  onOpenPerfMetrology?: () => void;
  onOpenNetForensics?: () => void;
  onOpenDefensiveSec?: () => void;
  onOpenCodeEng?: () => void;
  onOpenAiSystems?: () => void;
  onOpenGameForge?: () => void;
}

export type LabStatus = 'DISPONIBLE' | 'EN DESARROLLO';

export interface CanonicalPublicLabItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  problemQuestion: string;
  labCategory: string;
  level: string;
  status: LabStatus;
  problema: string;
  accion: string;
  resultado: string;
  evidencia: string;
  associatedToolId?: string;
  associatedToolName: string;
  icon: React.ElementType;
  action: () => void;
}

export interface CanonicalSimulatorItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tomoRelated: string;
  category: string;
  description: string;
  capabilities: string[];
  status: LabStatus;
  icon: React.ElementType;
  action: () => void;
}

export interface CanonicalCampusZoneCard {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  specialty: string;
  status: LabStatus;
  icon: React.ElementType;
  action: () => void;
}

export interface LabVisualConfig {
  accent: string;
  bgGradient: string;
  label: string;
}

export const LAB_VISUAL_MAP: Record<string, LabVisualConfig> = {
  'lab-boot-seq': { accent: '#F59E0B', bgGradient: 'from-amber-950/80 via-zinc-950 to-black', label: 'BOOT & POST' },
  'lab-windows-matrix': { accent: '#00D2FF', bgGradient: 'from-cyan-950/80 via-zinc-950 to-black', label: 'NT MATRIX' },
  'lab-hardware-hotswap': { accent: '#10B981', bgGradient: 'from-emerald-950/80 via-zinc-950 to-black', label: 'HW HOT-SWAP' },
  'lab-core-workbench': { accent: '#EF4444', bgGradient: 'from-rose-950/80 via-zinc-950 to-black', label: 'CORE WORKBENCH' },
  'lab-perf-metrology': { accent: '#EC4899', bgGradient: 'from-pink-950/80 via-zinc-950 to-black', label: 'METROLOGY' },
  'lab-cases-resolver': { accent: '#A855F7', bgGradient: 'from-purple-950/80 via-zinc-950 to-black', label: 'CASE RESOLVER' },
  'lab-digital-twin': { accent: '#00D2FF', bgGradient: 'from-cyan-950/80 via-zinc-950 to-black', label: 'DIGITAL TWIN' },
  'lab-net-forensics': { accent: '#38BDF8', bgGradient: 'from-sky-950/80 via-zinc-950 to-black', label: 'NET FORENSICS' },
  'lab-defensive-sec': { accent: '#EF4444', bgGradient: 'from-rose-950/80 via-zinc-950 to-black', label: 'DEFENSIVE SEC' },
  'lab-code-eng': { accent: '#10B981', bgGradient: 'from-emerald-950/80 via-zinc-950 to-black', label: 'CODE ENG' },
  'lab-ai-systems': { accent: '#A855F7', bgGradient: 'from-purple-950/80 via-zinc-950 to-black', label: 'AI SYSTEMS' },
  'lab-game-forge': { accent: '#F59E0B', bgGradient: 'from-amber-950/80 via-zinc-950 to-black', label: 'GAME FORGE' },
  'lab-eval-transfer': { accent: '#10B981', bgGradient: 'from-emerald-950/80 via-zinc-950 to-black', label: 'EVALUATION' },
  'lab-notebook-power': { accent: '#EAB308', bgGradient: 'from-yellow-950/80 via-zinc-950 to-black', label: 'POWER RAILS' },
};

export const SIMULATOR_VISUAL_MAP: Record<string, LabVisualConfig> = {
  'sim-boot-seq': { accent: '#F59E0B', bgGradient: 'from-amber-950/80 via-zinc-950 to-black', label: '35 POST STATES' },
  'sim-windows-xray': { accent: '#00D2FF', bgGradient: 'from-cyan-950/80 via-zinc-950 to-black', label: 'X-RAY KERNEL' },
  'sim-uefi-boot': { accent: '#38BDF8', bgGradient: 'from-sky-950/80 via-zinc-950 to-black', label: 'UEFI & BCD' },
  'sim-hw-hotswap': { accent: '#10B981', bgGradient: 'from-emerald-950/80 via-zinc-950 to-black', label: 'HW NANOSECONDS' },
  'sim-sw-hotswap': { accent: '#38BDF8', bgGradient: 'from-sky-950/80 via-zinc-950 to-black', label: 'DPC & DRIVERS' },
  'sim-ultimate-sandbox': { accent: '#A855F7', bgGradient: 'from-purple-950/80 via-zinc-950 to-black', label: 'ULTIMATE SANDBOX' },
  'sim-thermal-telemetry': { accent: '#EF4444', bgGradient: 'from-rose-950/80 via-zinc-950 to-black', label: 'THERMAL TJMAX' },
  'sim-pc-builder': { accent: '#EAB308', bgGradient: 'from-yellow-950/80 via-zinc-950 to-black', label: 'PC BUILDER' },
  'sim-clean-install': { accent: '#00D2FF', bgGradient: 'from-cyan-950/80 via-zinc-950 to-black', label: 'CLEAN INSTALL GPT' },
  'sim-windows-repair': { accent: '#A855F7', bgGradient: 'from-purple-950/80 via-zinc-950 to-black', label: 'REPAIR SFC/DISM' },
};

export const CAMPUS_ZONE_VISUAL_MAP: Record<string, LabVisualConfig> = {
  'campus-zone-01': { accent: '#EF4444', bgGradient: 'from-rose-950/80 via-zinc-950 to-black', label: 'ZONA 01 // TRIAGE' },
  'campus-zone-02': { accent: '#F59E0B', bgGradient: 'from-amber-950/80 via-zinc-950 to-black', label: 'ZONA 02 // TALLER' },
  'campus-zone-03': { accent: '#38BDF8', bgGradient: 'from-sky-950/80 via-zinc-950 to-black', label: 'ZONA 03 // ARCHIVO' },
  'campus-zone-04': { accent: '#10B981', bgGradient: 'from-emerald-950/80 via-zinc-950 to-black', label: 'ZONA 04 // CÁMARA' },
  'campus-zone-05': { accent: '#00D2FF', bgGradient: 'from-cyan-950/80 via-zinc-950 to-black', label: 'ZONA 05 // MÁQUINAS' },
  'campus-zone-06': { accent: '#EF4444', bgGradient: 'from-rose-950/80 via-zinc-950 to-black', label: 'ZONA 06 // RESTRICTED' },
  'campus-zone-07': { accent: '#A855F7', bgGradient: 'from-purple-950/80 via-zinc-950 to-black', label: 'ZONA 07 // MI LAB' },
  'campus-zone-08': { accent: '#10B981', bgGradient: 'from-emerald-950/80 via-zinc-950 to-black', label: 'ZONA 08 // COMUNIDAD' },
};

export const EvoPublicLabsCatalog: React.FC<EvoPublicLabsCatalogProps> = ({
  onOpenHotSwapLab,
  onOpenWindowsMatrixLab,
  onOpenWindowsXRayLab,
  onOpenBootLab,
  onOpenLabCore,
  onOpenCampusLab,
  onOpenCaseResolver,
  onOpenDigitalTwin,
  onOpenTransferChallenge,
  onOpenTomo,
  onOpenPerfMetrology,
  onOpenNetForensics,
  onOpenDefensiveSec,
  onOpenCodeEng,
  onOpenAiSystems,
  onOpenGameForge,
}) => {
  const [experienceType, setExperienceType] = useState<'ALL' | 'LABS' | 'SIMS' | 'ZONES'>('ALL');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SISTEMAS' | 'HARDWARE' | 'TALLER' | 'METROLOGIA' | 'REDES_SEGURIDAD'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLabIds, setExpandedLabIds] = useState<Record<string, boolean>>({});

  const toggleLabExpand = (labId: string) => {
    setExpandedLabIds((prev) => ({
      ...prev,
      [labId]: !prev[labId],
    }));
  };

  // Canonical Laboratories: independent functional experiences with commercial titles and exact engine triggers
  const canonicalLabs: CanonicalPublicLabItem[] = [
    {
      id: 'lab-boot-seq',
      number: 'LAB 01',
      title: 'Simulador de Secuencia de Boot y 35 Estados POST',
      subtitle: 'Cronología de encendido, señales ATX y firmware UEFI',
      problemQuestion: '¿Tu PC no enciende, no da video o se apaga inmediatamente?',
      labCategory: 'ARRANQUE & FIRMWARE',
      level: 'INTERMEDIO',
      status: 'DISPONIBLE',
      problema: 'Equipos que no dan video, quedan atrapados en bucle de reinicio o arrojan errores de arranque sin saber si la causa es eléctrica, de firmware o de disco.',
      accion: 'Recorrerás los 35 estados de inicio desde el riel standby hasta el kernel, midiendo voltajes virtuales e inyectando fallas deliberadas.',
      resultado: 'Aprenderás a identificar el punto exacto donde se interrumpe el arranque sin adivinar ni desarmar a ciegas.',
      evidencia: 'Código de estado POST verificado, registro de señal POWER_GOOD y validación del árbol BCD.',
      associatedToolId: 'diag-boot-seq',
      associatedToolName: 'DIAGNÓSTICO DE ARRANQUE Y 35 ESTADOS POST',
      icon: Power,
      action: () => onOpenBootLab(),
    },
    {
      id: 'lab-windows-services',
      number: 'LAB 02',
      title: 'Optimizador Forense de Procesos y Servicios Windows',
      subtitle: 'Auditoría de svchost, SysMain, Ring 0 y procesos parásitos',
      problemQuestion: '¿Windows funciona lento, da tirones o consume 100% de CPU/Disco?',
      labCategory: 'KERNEL & SISTEMAS',
      level: 'AVANZADO',
      status: 'DISPONIBLE',
      problema: 'Degradación de respuesta, congelamientos por procesos descontrolados y acumulaciones de servicios parásitos en segundo plano.',
      accion: 'Inspeccionarás la matriz de procesos svchost, aislarás hilos de consumo anormal y deshabilitarás telemetría sin romper la estabilidad del SO.',
      resultado: 'Aprenderás a depurar el sistema operativo a nivel kernel eliminando procesos parásitos con criterio técnico.',
      evidencia: 'Árbol de procesos depurado, consumo de RAM/CPU normalizado y log de servicios activos.',
      associatedToolId: 'opt-nt-services',
      associatedToolName: 'AUDITOR DE SERVICIOS NT & PROCESOS DE FONDO',
      icon: Terminal,
      action: () => onOpenWindowsMatrixLab('services'),
    },
    {
      id: 'lab-windows-bsod',
      number: 'LAB 03',
      title: 'Diagnóstico y Reparación de Pantallas Azules (BSOD)',
      subtitle: 'Análisis de volcados Minidump, Kernel NT y excepciones Bugcheck',
      problemQuestion: '¿Tu equipo sufre reinicios inesperados o pantallas azules?',
      labCategory: 'KERNEL & SISTEMAS',
      level: 'AVANZADO',
      status: 'DISPONIBLE',
      problema: 'Reinicios intempestivos provocados por controladores defectuosos, corrupción de memoria RAM o colisiones en Ring 0.',
      accion: 'Decodificarás códigos Bugcheck hexadecimales, interpretarás volcados minidump e identificarás el driver culpable en la pila de llamadas.',
      resultado: 'Aprenderás a diagnosticar la causa raíz de un fallo crítico de kernel sin recurrir a formateos innecesarios.',
      evidencia: 'Informe de análisis de Minidump, identificación de módulo .sys defectuoso y recomendación técnica.',
      associatedToolId: 'diag-bsod-decoder',
      associatedToolName: 'DECODIFICADOR DE PANTALLAZOS AZULES (BSOD DUMP LOG)',
      icon: Shield,
      action: () => {
        if (onOpenWindowsXRayLab) onOpenWindowsXRayLab('crash-repair');
        else onOpenWindowsMatrixLab('crash-repair');
      },
    },
    {
      id: 'lab-uefi-bcd',
      number: 'LAB 04',
      title: 'Restaurador de Arranque UEFI y Partición BCD',
      subtitle: 'Verificación de partición ESP, Secure Boot y cadena de inicio NT',
      problemQuestion: '¿Windows no inicia y muestra errores 0xc000000e o BCD dañado?',
      labCategory: 'SISTEMAS OPERATIVOS',
      level: 'INTERMEDIO',
      status: 'DISPONIBLE',
      problema: 'Sistemas inoperativos por corrupción del Boot Configuration Data (BCD) o desconfiguración de Secure Boot y la partición ESP.',
      accion: 'Simularás la reconstrucción del árbol BCD con bcdboot, reasignarás firmas EFI y verificarás la cadena criptográfica de arranque.',
      resultado: 'Aprenderás a recuperar la secuencia de boot en placas UEFI modernas sin perder datos del usuario.',
      evidencia: 'Árbol BCD reconstruido, estado de Secure Boot verificado y log de ejecución bcdboot.',
      associatedToolName: 'REPARADOR DE ARRANQUE BCD & CADENA EFI',
      icon: HardDrive,
      action: () => onOpenWindowsMatrixLab('boot'),
    },
    {
      id: 'lab-clean-install',
      number: 'LAB 05',
      title: 'Simulador de Instalación Limpia de Windows',
      subtitle: 'Particionado Diskpart GPT, eliminación de bloatware y preparación base',
      problemQuestion: '¿Querés formatear e instalar Windows desde cero con estándares profesionales?',
      labCategory: 'SISTEMAS OPERATIVOS',
      level: 'INICIAL',
      status: 'DISPONIBLE',
      problema: 'Instalaciones deficientes con particionados MBR obsoletos, presencia de bloatware de fabricante y configuraciones inseguras.',
      accion: 'Ejecutarás un formateo profesional en particionado GPT, aislarás cuentas locales y aplicarás plantillas de optimización inicial.',
      resultado: 'Aprenderás a desplegar sistemas operativos limpios, rápidos y seguros de acuerdo a las mejores prácticas.',
      evidencia: 'Esquema de partición GPT verificado, log de depuración de paquetes y checklist de despliegue.',
      associatedToolName: 'INSTALADOR Y CONFIGURADOR DE WINDOWS LIMPIO',
      icon: HardDrive,
      action: () => onOpenWindowsMatrixLab('install'),
    },
    {
      id: 'lab-windows-repair',
      number: 'LAB 06',
      title: 'Reparador de Corrupción de Archivos del Sistema',
      subtitle: 'Protocolo pericial con SFC /scannow, DISM y almacén WinSxS',
      problemQuestion: '¿Tenés errores de sistema por archivos corruptos o System32 dañado?',
      labCategory: 'SISTEMAS OPERATIVOS',
      level: 'INTERMEDIO',
      status: 'DISPONIBLE',
      problema: 'Inestabilidad general, errores de librerías DLL ausentes y fallas en actualizaciones causadas por corrupción en System32.',
      accion: 'Ejecutarás la secuencia de restauración SFC /scannow y DISM /RestoreHealth sobre la imagen del almacén WinSxS.',
      resultado: 'Aprenderás a reparar la integridad del sistema operativo en minutos utilizando comandos de recuperación oficiales.',
      evidencia: 'Registro CBS.log limpio, verificación de hash de almacén WinSxS e informe de SFC.',
      associatedToolName: 'REPARADOR DE INTEGRIDAD DE ARCHIVOS SFC & DISM',
      icon: FileCheck,
      action: () => onOpenWindowsMatrixLab('repair'),
    },
    {
      id: 'lab-hardware-latency',
      number: 'LAB 07',
      title: 'Analizador de Latencias y Cuellos de Botella de Hardware',
      subtitle: 'Cálculo en nanosegundos (tCL/frecuencia) y topología de buses PCIe',
      problemQuestion: '¿No sabés qué componente está frenando el rendimiento de tu PC?',
      labCategory: 'HARDWARE & SILICIO',
      level: 'AVANZADO',
      status: 'DISPONIBLE',
      problema: 'Rendimiento deficiente en tareas exigentes debido a desequilibrios de hardware o latencias de memoria desajustadas.',
      accion: 'Intercambiarás módulos RAM, procesadores y tarjetas de video en caliente calculando la latencia real en nanosegundos.',
      resultado: 'Aprenderás a calcular matemáticamente cuellos de botella y seleccionar hardware equilibrado.',
      evidencia: 'Latencia absoluta en nanosegundos (ns), ancho de banda en GB/s y tasa de ocupación PCIe.',
      associatedToolId: 'med-latency-calc',
      associatedToolName: 'CALCULADOR DE LATENCIAS DE SILICIO EN NANOSEGUNDOS',
      icon: Cpu,
      action: () => onOpenHotSwapLab('hardware'),
    },
    {
      id: 'lab-software-dpc',
      number: 'LAB 08',
      title: 'Diagnóstico de Controladores y Latencia DPC/ISR',
      subtitle: 'Aislamiento de microtirones de software e inyección de fallas de drivers',
      problemQuestion: '¿Experimentás micro-stuttering o lag en audio/video sin causa aparente?',
      labCategory: 'HARDWARE & SILICIO',
      level: 'AVANZADO',
      status: 'DISPONIBLE',
      problema: 'Lags breves e interrupciones en la reproducción causados por controladores de red o gráficos que saturan las colas de interrupción.',
      accion: 'Inyectarás fallas de latencia en controladores virtuales y medirás las colas DPC/ISR en microsegundos (µs).',
      resultado: 'Aprenderás a identificar el driver responsable de los microtirones de sistema.',
      evidencia: 'Gráfico de dispersión DPC/ISR en µs, identificación de driver offending y tiempo de respuesta.',
      associatedToolName: 'ANALIZADOR DE INTERRUPCIONES DPC/ISR EN MICROSEGUNDOS',
      icon: Sliders,
      action: () => onOpenHotSwapLab('software'),
    },
    {
      id: 'lab-cpu-architecture',
      number: 'LAB 09',
      title: 'Explorador de Microarquitectura y Caché del Procesador',
      subtitle: 'Jerarquía de caché L1/L2/L3, registros CPU y bus IMC',
      problemQuestion: '¿Querés entender cómo viajan los datos dentro del silicio del procesador?',
      labCategory: 'HARDWARE & SILICIO',
      level: 'EXPERTO',
      status: 'DISPONIBLE',
      problema: 'Incapacidad de visualizar cómo interactúan los registros internos, la memoria caché y el controlador de memoria principal.',
      accion: 'Explorarás el mapa interactivo de la CPU observando el paso de instrucciones por los niveles de caché y buses de datos.',
      resultado: 'Aprenderás la arquitectura física interna que determina la velocidad de un procesador moderno.',
      evidencia: 'Tasa de hit/miss de caché L1/L2/L3, estados de registros y flujo de instrucciones.',
      associatedToolName: 'EXPLORADOR DE MICROARQUITECTURA DE SILICIO',
      icon: Layers,
      action: () => onOpenHotSwapLab('sandbox'),
    },
    {
      id: 'lab-thermal-telemetry',
      number: 'LAB 10',
      title: 'Laboratorio de Estrés Térmico y Telemetría de Temperatura',
      subtitle: 'Curvas de TjMax, Throttling térmico y metrología de disipación',
      problemQuestion: '¿Tu procesador o GPU recalienta y pierde frecuencia en cargas pesadas?',
      labCategory: 'METROLOGÍA & RENDIMIENTO',
      level: 'INTERMEDIO',
      status: 'DISPONIBLE',
      problema: 'Pérdida de rendimiento por thermal throttling y apagados de protección por temperaturas elevadas.',
      accion: 'Someterás el sistema a pruebas de estrés continuo monitoreando sensores de juntura (TjMax) y curvas de disipación.',
      resultado: 'Aprenderás a diagnosticar deficiencias en sistemas de refrigeración y límites de energía.',
      evidencia: 'Curva térmica tiempo/frecuencia, margen Delta T sobre ambiente y punto de throttling.',
      associatedToolName: 'SIMULADOR DE TELEMETRÍA TÉRMICA Y ESTRÉS',
      icon: Flame,
      action: () => {
        if (onOpenPerfMetrology) onOpenPerfMetrology();
        else onOpenHotSwapLab('telemetry');
      },
    },
    {
      id: 'lab-power-atx',
      number: 'LAB 11',
      title: 'Banco de Pruebas y Descarte Eléctrico ATX',
      subtitle: 'Medición de rieles +12V/+5V/+3.3V y diagnóstico de fuentes en banco',
      problemQuestion: '¿Cómo probar una PC en banco para aislar fallas de energía o chasis?',
      labCategory: 'BANCO DE TALLER',
      level: 'INTERMEDIO',
      status: 'DISPONIBLE',
      problema: 'Equipos que no encienden o sufren apagados aleatorios por fuentes de poder defectuosas o cortos en rieles primarios.',
      accion: 'Montarás la PC en el banco universal, probarás la fuente con carga simulada y medirás tolerancia en rieles ATX.',
      resultado: 'Aprenderás a descartar problemas eléctricos con instrumental sin dañar componentes probando al azar.',
      evidencia: 'Lectura de voltajes bajo norma ATX (±5%), prueba de cortocircuito y dictamen de fuente.',
      associatedToolId: 'diag-atx-power-bench',
      associatedToolName: 'BANCO DE DESCARTE DE LÍNEAS DE PODER ATX',
      icon: Wrench,
      action: () => {
        if (onOpenLabCore) onOpenLabCore('SELECT_PC');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'lab-pc-builder',
      number: 'LAB 12',
      title: 'Simulador de Armado y Compatibilidad de PC',
      subtitle: 'Verificación de sockets, balance de consumo Watts y espacio físico',
      problemQuestion: '¿Dudas si las piezas que elegiste son 100% compatibles entre sí?',
      labCategory: 'BANCO DE TALLER',
      level: 'INICIAL',
      status: 'DISPONIBLE',
      problema: 'Incompatibilidades mecánicas o eléctricas al ensamblar una PC (sockets erróneos, fuentes insuficientes, chasis reducido).',
      accion: 'Ensamblarás configuraciones personalizadas comprobando dimensiones, consumo energético e interconexiones de placa.',
      resultado: 'Aprenderás a planificar presupuestos y presupuestar equipos sin errores de compatibilidad.',
      evidencia: 'Matriz de compatibilidad aprobada, consumo total en Watts y certificado de ensamblaje.',
      associatedToolName: 'CONSTRUCTOR Y VALIDADOR DE COMPATIBILIDAD DE PC',
      icon: Wrench,
      action: () => {
        if (onOpenLabCore) onOpenLabCore('BUILD_PC');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'lab-case-resolver',
      number: 'LAB 13',
      title: 'Central Pericial de Casos y Diagnóstico Deductivo',
      subtitle: 'Resolución de fallas de clientes con árbol de decisiones pericial',
      problemQuestion: '¿Cómo resolver casos de taller complejos usando el método científico?',
      labCategory: 'BANCO DE TALLER',
      level: 'AVANZADO',
      status: 'DISPONIBLE',
      problema: 'Fallas intermitentes y reportes confusos de clientes que provocan demoras y diagnósticos erróneos en taller.',
      accion: 'Analizarás casos reales con múltiples síntomas, formularás hipótesis técnicas y emitirás el expediente pericial.',
      resultado: 'Aprenderás a estructurar un diagnóstico metodológico profesional respaldado por evidencias.',
      evidencia: 'Expediente pericial firmado con hash de integridad y árbol de descarte validado.',
      associatedToolId: 'diag-case-resolver',
      associatedToolName: 'RESOLUTOR DE CASOS PERICIALES CON ÁRBOL DE DECISIÓN',
      icon: FileCheck,
      action: () => {
        if (onOpenCaseResolver) onOpenCaseResolver();
        else onOpenWindowsMatrixLab('crash-repair');
      },
    },
    {
      id: 'lab-digital-twin',
      number: 'LAB 14',
      title: 'Gemelo Digital e Inspección de Silicio en Tiempo Real',
      subtitle: 'Réplica digital determinista de 12 subsistemas de placa madre',
      problemQuestion: '¿Cómo interactúan la GPU, RAM, VRM y chipset simultáneamente?',
      labCategory: 'HARDWARE & SILICIO',
      level: 'AVANZADO',
      status: 'DISPONIBLE',
      problema: 'Imposibilidad de observar el flujo de datos y energía en tiempo real a través de los componentes de la placa madre.',
      accion: 'Interactuarás con el modelo 3D/2D del gemelo digital inyectando variaciones de carga en los 12 subsistemas.',
      resultado: 'Aprenderás a visualizar la arquitectura sistémica de la PC de manera integral.',
      evidencia: 'Telemetría de 12 subsistemas sincronizados y mapa de interconexión eléctrica.',
      associatedToolId: 'inv-digital-twin',
      associatedToolName: 'DIGITAL TWIN (GEMELO DIGITAL INTERACTIVO)',
      icon: Boxes,
      action: () => {
        if (onOpenDigitalTwin) onOpenDigitalTwin();
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'lab-transfer-challenge',
      number: 'LAB 15',
      title: 'Examen de Competencia y Diagnóstico en Vivo',
      subtitle: 'Desafío de transferencia práctica con calificación metrológica',
      problemQuestion: '¿Podés diagnosticar y reparar una PC con fallas múltiples bajo presión?',
      labCategory: 'BANCO DE TALLER',
      level: 'EXPERTO',
      status: 'DISPONIBLE',
      problema: 'Necesidad de validar si los conocimientos teóricos se traducen en capacidad real de resolución de fallas en taller.',
      accion: 'Enfrentarás un caso cronometrado con averías superpuestas en hardware y sistema operativo sin asistencia.',
      resultado: 'Obtendrás la certificación práctica de tu capacidad técnica basada en métricas de resolución.',
      evidencia: 'Certificado de transferencia con puntuación metrológica y registro de decisiones.',
      associatedToolId: 'doc-transfer-challenge',
      associatedToolName: 'BANCO DE DESAFÍOS DE TRANSFERENCIA Y EVALUACIÓN',
      icon: CheckCircle2,
      action: () => {
        if (onOpenTransferChallenge) onOpenTransferChallenge();
        else onOpenWindowsMatrixLab('services');
      },
    },
    {
      id: 'lab-net-forensics',
      number: 'LAB 16',
      title: 'Diagnóstico de Redes e Inspección de Tráfico',
      subtitle: 'Análisis de latencia, bufferbloat y cabeceras TCP/IP',
      problemQuestion: '¿Tenés microcortes, pérdidas de paquetes o picos de ping en red?',
      labCategory: 'REDES & SEGURIDAD',
      level: 'INTERMEDIO',
      status: 'EN DESARROLLO',
      problema: 'Inestabilidad de conexión sin claridad sobre si la causa es local, del router o del proveedor ISP.',
      accion: 'Próximamente: captura de tráfico, medición de colas bufferbloat y trazado de rutas de red.',
      resultado: 'Diagnóstico del tramo afectado en conexiones Ethernet y Wi-Fi.',
      evidencia: 'Registro de pérdida de paquetes (loss %) y tiempos de respuesta DNS.',
      associatedToolName: 'Sin herramienta específica asociada',
      icon: Globe,
      action: () => {},
    },
    {
      id: 'lab-defensive-sec',
      number: 'LAB 17',
      title: 'Bastionado de Seguridad Defensiva y Hardening NT',
      subtitle: 'Políticas GPO, mitigación de exploits e integridad de Ring 0',
      problemQuestion: '¿Querés blindar un sistema Windows contra amenazas de bajo nivel?',
      labCategory: 'REDES & SEGURIDAD',
      level: 'AVANZADO',
      status: 'EN DESARROLLO',
      problema: 'Vulnerabilidades en servicios activos y permisos excesivos que exponen el equipo a ataques.',
      accion: 'Próximamente: configuración de políticas de grupo, contención de procesos y auditoría de privilegios.',
      resultado: 'Endurecimiento perimetral del sistema operativo bajo estándares defensivos.',
      evidencia: 'Puntuación de hardening e informe de auditoría de seguridad.',
      associatedToolName: 'Sin herramienta específica asociada',
      icon: Shield,
      action: () => {},
    },
    {
      id: 'lab-notebook-power',
      number: 'LAB 18',
      title: 'Microelectrónica y Líneas de Poder en Notebooks',
      subtitle: 'Seguimiento de esquemáticos móviles, rieles eDP y convertidores DC-DC',
      problemQuestion: '¿Tu notebook no enciende o no carga la batería?',
      labCategory: 'BANCO DE TALLER',
      level: 'EXPERTO',
      status: 'EN DESARROLLO',
      problema: 'Fallas de encendido en placas madre compactas por cortocircuitos o fusibles quemados en rieles primarios.',
      accion: 'Próximamente: lectura de esquemáticos e inspección de señales de habilitación en circuitos de carga.',
      resultado: 'Aislamiento de averías en placas lógicas de computadoras portátiles.',
      evidencia: 'Mapeo esquemático de voltajes y señales de habilitación.',
      associatedToolName: 'Sin herramienta específica asociada',
      icon: FlaskConical,
      action: () => {},
    },
  ];

  // 10 Simuladores Interactivos Autónomos de Silicio, Kernel y Hardware
  const canonicalSimulators: CanonicalSimulatorItem[] = [
    {
      id: 'sim-boot-seq',
      number: 'SIM 01',
      title: 'Simulador de Secuencia de Boot y 35 Estados POST',
      subtitle: 'Cronología eléctrica de inicio, firmware UEFI y multímetro virtual',
      tomoRelated: 'TOMO 08 — ARRANQUE Y DIAGNÓSTICO',
      category: 'HARDWARE & FIRMWARE',
      description: 'Recorrido paso a paso de los 9 hitos de inicio desde el botón de encendido hasta winload.efi, con inyección de 35 fallas reales.',
      capabilities: ['35 Estados POST', 'Medición Rieles ATX', 'Reconstrucción BCD', 'UEFI NVRAM'],
      status: 'DISPONIBLE',
      icon: Power,
      action: () => onOpenBootLab(),
    },
    {
      id: 'sim-windows-xray',
      number: 'SIM 02',
      title: 'Simulador Windows X-Ray Kernel & NT Internals',
      subtitle: 'Inspección radiológica del núcleo de Windows, Ring 0 y despacho de hilos',
      tomoRelated: 'TOMO 02 — LA BIBLIA NEGRA DE WINDOWS',
      category: 'KERNEL & SISTEMAS',
      description: 'Diagnóstico de colisiones de kernel, análisis de volcados BSOD en vivo, auditoría de llamadas de sistema e inspección de drivers.',
      capabilities: ['Kernel X-Ray', 'Decodificador BSOD', 'Auditoría DPC/ISR', 'Agente Live Telemetría'],
      status: 'DISPONIBLE',
      icon: Terminal,
      action: () => {
        if (onOpenWindowsXRayLab) onOpenWindowsXRayLab('xray');
        else onOpenWindowsMatrixLab('xray');
      },
    },
    {
      id: 'sim-uefi-boot',
      number: 'SIM 03',
      title: 'Simulador de Arranque Windows Boot Manager & BCD',
      subtitle: 'Cadena de ejecución de bootmgfw.efi a ntoskrnl.exe',
      tomoRelated: 'TOMO 02 / TOMO 08',
      category: 'SISTEMAS OPERATIVOS',
      description: 'Simulación profunda de la partición ESP, Secure Boot, lectura del BCD e inicialización del núcleo NT de 64 bits.',
      capabilities: ['Cadena EFI', 'Firma Criptográfica', 'Validación TPM 2.0', 'Modo Largo 64-bit'],
      status: 'DISPONIBLE',
      icon: HardDrive,
      action: () => onOpenWindowsMatrixLab('boot'),
    },
    {
      id: 'sim-hw-hotswap',
      number: 'SIM 04',
      title: 'Simulador Hot-Swap de Hardware (Nanosegundos & Silicio)',
      subtitle: 'Intercambio en caliente de procesadores, RAM y topología PCIe',
      tomoRelated: 'TOMO 01 — CONOCÉ TU PC',
      category: 'HARDWARE & SILICIO',
      description: 'Banco dinámico para intercambiar piezas y medir el impacto directo en latencia absoluta, frecuencia y saturación de carriles.',
      capabilities: ['Intercambio en Caliente', 'Latencia ns (tCL/Freq)', 'Topología PCIe 4.0/5.0', 'Descarte de Cuello de Botella'],
      status: 'DISPONIBLE',
      icon: Cpu,
      action: () => onOpenHotSwapLab('hardware'),
    },
    {
      id: 'sim-sw-hotswap',
      number: 'SIM 05',
      title: 'Simulador Hot-Swap de Software & Drivers NT',
      subtitle: 'Aislamiento de microtirones, servicios parásitos y colas DPC',
      tomoRelated: 'TOMO 03 — REPARACIÓN DE PC',
      category: 'SISTEMAS & DRIVERS',
      description: 'Inyección de fallas de controladores gráficos y de red para medir la latencia del sistema sin arriesgar la PC física.',
      capabilities: ['Aislamiento DPC/ISR', 'Pruebas sin Modificar PC', 'Curva de Latencia µs', 'Descarte de Servicios'],
      status: 'DISPONIBLE',
      icon: Sliders,
      action: () => onOpenHotSwapLab('software'),
    },
    {
      id: 'sim-ultimate-sandbox',
      number: 'SIM 06',
      title: 'EVO Ultimate Sandbox (Microarquitectura & Buses)',
      subtitle: 'Explorador interactivo de jerarquía de caché, IMC y VRM',
      tomoRelated: 'TOMO 01 / TOMO 07',
      category: 'ARQUITECTURA DE SILICIO',
      description: 'Entorno de simulación de bajo nivel para visualizar el flujo de instrucciones por los registros, el IMC y la distribución de energía.',
      capabilities: ['Registros CPU', 'Caché L1/L2/L3', 'VRM & Power Delivery', 'Buses de Datos'],
      status: 'DISPONIBLE',
      icon: Layers,
      action: () => onOpenHotSwapLab('sandbox'),
    },
    {
      id: 'sim-thermal-telemetry',
      number: 'SIM 07',
      title: 'Simulador de Telemetría Térmica & Throttling',
      subtitle: 'Curvas de temperatura de juntura TjMax, disipación y perfiles de carga',
      tomoRelated: 'TOMO 01 / TOMO 05',
      category: 'METROLOGÍA & ENERGÍA',
      description: 'Simulación de pruebas de tortura y estrés térmico para analizar throttling por temperatura y degradación por voltaje.',
      capabilities: ['Historial Térmico', 'Curvas TjMax', 'Simulación de Tortura', 'Delta Ambiente/Die'],
      status: 'DISPONIBLE',
      icon: Flame,
      action: () => onOpenHotSwapLab('telemetry'),
    },
    {
      id: 'sim-pc-builder',
      number: 'SIM 08',
      title: 'Universal PC Builder & Simulador de Armado',
      subtitle: 'Matriz de compatibilidad física, presupuestos y validación de componentes',
      tomoRelated: 'TOMO 03 — REPARACIÓN DE PC',
      category: 'BANCO DE TALLER',
      description: 'Construcción de equipos en banco virtual comprobando compatibilidad de sockets, consumo energético de fuente y clearance de chasis.',
      capabilities: ['Grafo de Compatibilidad', 'Cálculo de Consumo W', 'Balance Presupuestario', 'Armado Guiado'],
      status: 'DISPONIBLE',
      icon: Wrench,
      action: () => {
        if (onOpenLabCore) onOpenLabCore('BUILD_PC');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'sim-clean-install',
      number: 'SIM 09',
      title: 'Simulador de Instalación Limpia de Windows',
      subtitle: 'Particionado GPT, particiones de recuperación y optimización base',
      tomoRelated: 'TOMO 02 — LA BIBLIA NEGRA DE WINDOWS',
      category: 'SISTEMAS OPERATIVOS',
      description: 'Entorno paso a paso para dominar el particionado limpio, descarte de bloatware de fabricante y configuración sin telemetría.',
      capabilities: ['Particionado diskpart GPT', 'Descarte de Bloatware', 'Aislamiento de Cuentas', 'Plantillas ISO'],
      status: 'DISPONIBLE',
      icon: HardDrive,
      action: () => onOpenWindowsMatrixLab('install'),
    },
    {
      id: 'sim-windows-repair',
      number: 'SIM 10',
      title: 'Simulador de Reparación de Fallas de Windows',
      subtitle: 'Resolución de corrupción en System32, WinRE y almacén WinSxS',
      tomoRelated: 'TOMO 02 — LA BIBLIA NEGRA DE WINDOWS',
      category: 'REPARACIÓN & KERNEL',
      description: 'Protocolos de rescate con SFC /scannow, DISM RestoreHealth y reconstrucción de perfiles de usuario dañados.',
      capabilities: ['Integridad SFC/DISM', 'Entorno WinRE', 'Reparación de BCD', 'Análisis de Volcados'],
      status: 'DISPONIBLE',
      icon: Shield,
      action: () => onOpenWindowsMatrixLab('repair'),
    },
  ];

  // 8 Estaciones Oficiales del Campus EVO
  const campusZonesList: CanonicalCampusZoneCard[] = [
    {
      id: 'campus-zone-01',
      number: 'ZONA 01',
      title: 'Lab 01: Central de Incidentes',
      subtitle: 'Mesa pericial de triage, recepción de casos y fallas críticas',
      category: 'DIAGNÓSTICO & INCIDENTES',
      description: 'Estación central donde ingresan los incidentes técnicos de alta complejidad para su clasificación y asignación a bancos.',
      specialty: 'Triage, registro forense y priorización de emergencias.',
      status: 'DISPONIBLE',
      icon: Activity,
      action: () => {
        if (onOpenCampusLab) onOpenCampusLab('zona-1');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'campus-zone-02',
      number: 'ZONA 02',
      title: 'Lab 02: Taller de Rendimiento',
      subtitle: 'Metrología avanzada, latencias DPC y análisis de frametimes',
      category: 'METROLOGÍA DE RENDIMIENTO',
      description: 'Puesto especializado en instrumental de telemetría de alta resolución, osciloscopios virtuales y descarte de microtirones.',
      specialty: 'Percentiles 1% low, latencia en nanosegundos y optimización de render.',
      status: 'DISPONIBLE',
      icon: Zap,
      action: () => {
        if (onOpenCampusLab) onOpenCampusLab('zona-2');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'campus-zone-03',
      number: 'ZONA 03',
      title: 'Lab 03: Archivo EVO',
      subtitle: 'Bóveda de expedientes técnicos, esquemas y manuales de arquitectura',
      category: 'DOCUMENTACIÓN & INVESTIGACIÓN',
      description: 'Repositorio canónico de diagramas de placa, manuales de servicio pericial y biblioteca técnica de los 12 Tomos.',
      specialty: 'Esquemas de PCB, pinouts ATX y base de conocimiento.',
      status: 'DISPONIBLE',
      icon: Layers,
      action: () => {
        if (onOpenCampusLab) onOpenCampusLab('zona-3');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'campus-zone-04',
      number: 'ZONA 04',
      title: 'Lab 04: Cámara de Experimentos',
      subtitle: 'Cámara de tortura, pruebas de estrés y estabilidad extrema',
      category: 'ESTRÉS & ESTABILIDAD',
      description: 'Espacio de validación técnica donde se someten componentes a cargas de estrés térmico y eléctrico prolongadas.',
      specialty: 'Validación de overclock/undervolt, curvas de temperatura y peritaje de estabilidad.',
      status: 'DISPONIBLE',
      icon: Flame,
      action: () => {
        if (onOpenCampusLab) onOpenCampusLab('zona-4');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'campus-zone-05',
      number: 'ZONA 05',
      title: 'Lab 05: Sala de Máquinas',
      subtitle: 'Infraestructura de energía, distribución ATX y rieles de poder',
      category: 'ENERGÍA & BANCO DE TALLER',
      description: 'Taller de diagnóstico eléctrico enfocado en fuentes de poder, etapas VRM y comportamiento de rieles de alimentación.',
      specialty: 'Rieles +12V/+5V/+3.3V, transitorios de carga y protección OCP/OVP.',
      status: 'DISPONIBLE',
      icon: Server,
      action: () => {
        if (onOpenCampusLab) onOpenCampusLab('zona-5');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'campus-zone-06',
      number: 'ZONA 06',
      title: 'Lab 06: Zona Restringida',
      subtitle: 'Arquitectura de Kernel NT, Ring 0 y desensamblado de código',
      category: 'BAJO NIVEL & KERNEL',
      description: 'Laboratorio de acceso restringido para ingeniería inversa, aislamiento de llamadas de sistema e investigación de seguridad.',
      specialty: 'Sysinternals, arquitectura de Ring 0 y análisis de microcódigo.',
      status: 'DISPONIBLE',
      icon: Shield,
      action: () => {
        if (onOpenCampusLab) onOpenCampusLab('zona-6');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'campus-zone-07',
      number: 'ZONA 07',
      title: 'Lab 07: Mi Laboratorio',
      subtitle: 'Puesto personalizado del técnico, gemelo digital y herramientas activas',
      category: 'PASAPORTE TÉCNICO & IDENTIDAD',
      description: 'Entorno individual donde cada usuario gestiona su pasaporte de hardware, expedientes resueltos y gemelo digital activo.',
      specialty: 'Perfil pericial, gemelo digital y progreso de certificación.',
      status: 'DISPONIBLE',
      icon: Compass,
      action: () => {
        if (onOpenCampusLab) onOpenCampusLab('zona-7');
        else onOpenHotSwapLab('all');
      },
    },
    {
      id: 'campus-zone-08',
      number: 'ZONA 08',
      title: 'Lab 08: Comunidad EVO',
      subtitle: 'Mesa redonda pericial, intercambio de casos reales y debates de taller',
      category: 'COMUNIDAD & TRANSFERENCIA',
      description: 'Espacio colegiado donde la comunidad de técnicos y especialistas somete diagnósticos a revisión y debate metodológico.',
      specialty: 'Resolución colectiva de casos raros y transferencia de habilidades.',
      status: 'DISPONIBLE',
      icon: Globe,
      action: () => {
        if (onOpenCampusLab) onOpenCampusLab('zona-8');
        else onOpenHotSwapLab('all');
      },
    },
  ];

  const categoryFilterMap: Record<string, string[]> = {
    SISTEMAS: ['lab-boot-seq', 'lab-windows-services', 'lab-windows-bsod', 'lab-uefi-bcd', 'lab-clean-install', 'lab-windows-repair'],
    HARDWARE: ['lab-hardware-latency', 'lab-software-dpc', 'lab-cpu-architecture', 'lab-digital-twin'],
    TALLER: ['lab-power-atx', 'lab-pc-builder', 'lab-case-resolver', 'lab-transfer-challenge', 'lab-notebook-power'],
    METROLOGIA: ['lab-thermal-telemetry', 'lab-hardware-latency'],
    REDES_SEGURIDAD: ['lab-net-forensics', 'lab-defensive-sec'],
  };

  const filteredLabs = canonicalLabs.filter((lab) => {
    if (lab.id === 'lab-boot-seq') return false; // LAB 01 is showcased as the primary featured hero card at the top

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lab.title.toLowerCase().includes(q) ||
      lab.subtitle.toLowerCase().includes(q) ||
      lab.problemQuestion.toLowerCase().includes(q) ||
      lab.problema.toLowerCase().includes(q) ||
      lab.accion.toLowerCase().includes(q) ||
      lab.resultado.toLowerCase().includes(q) ||
      lab.labCategory.toLowerCase().includes(q) ||
      lab.associatedToolName.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (selectedFilter === 'ALL') return true;
    const allowed = categoryFilterMap[selectedFilter] || [];
    return allowed.includes(lab.id);
  });

  const filteredSimulators = canonicalSimulators.filter((sim) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      sim.title.toLowerCase().includes(q) ||
      sim.subtitle.toLowerCase().includes(q) ||
      sim.description.toLowerCase().includes(q) ||
      sim.tomoRelated.toLowerCase().includes(q) ||
      sim.category.toLowerCase().includes(q) ||
      sim.capabilities.some((c) => c.toLowerCase().includes(q))
    );
  });

  const filteredCampusZones = campusZonesList.filter((zone) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      zone.title.toLowerCase().includes(q) ||
      zone.subtitle.toLowerCase().includes(q) ||
      zone.description.toLowerCase().includes(q) ||
      zone.category.toLowerCase().includes(q) ||
      zone.specialty.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative w-full min-h-screen text-zinc-100 select-none overflow-x-hidden">
      <div className="relative z-10 max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 space-y-10 font-mono-tech">
      
      {/* 1. HEADER DE IDENTIDAD PEDAGÓGICA EVO */}
      <div className="space-y-4 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-xs tracking-widest text-amber-400 uppercase font-black">
            LABORATORIOS // SUITE EXPERIMENTAL DE INVESTIGACIÓN ({canonicalLabs.length} LABORATORIOS)
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-display font-black uppercase tracking-tight leading-[1.05] bg-gradient-to-r from-white via-cyan-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(34,211,238,0.2)]">
            LABORATORIOS EVO LABS
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial max-w-3xl leading-relaxed">
            El laboratorio debe sentirse como una investigación, no como una demo decorativa. Cada práctica parte de una falla real y culmina en evidencia contrastada.
          </p>
        </div>
      </div>

      {/* 2. SELECTOR PRINCIPAL DE TIPO DE EXPERIENCIA */}
      <div className="flex items-center justify-center overflow-x-auto pb-2 scrollbar-none border-b border-zinc-850/80">
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1 flex-wrap sm:flex-nowrap">
          {[
            { id: 'ALL', label: 'TODAS LAS EXPERIENCIAS', count: canonicalLabs.length + canonicalSimulators.length + campusZonesList.length },
            { id: 'LABS', label: 'LABORATORIOS PERICIALES', count: canonicalLabs.length },
            { id: 'SIMS', label: 'SIMULADORES INTERACTIVOS', count: canonicalSimulators.length },
            { id: 'ZONES', label: 'ZONAS DEL CAMPUS', count: campusZonesList.length },
          ].map((tab) => {
            const isSelected = experienceType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setExperienceType(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono-tech uppercase transition-all whitespace-nowrap cursor-pointer border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-zinc-800 text-amber-300/90 border-amber-500/40 shadow-sm font-semibold'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900 font-medium'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/20' : 'bg-zinc-800/70 text-zinc-400 border border-zinc-700/50'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BARRA DE FILTROS Y BÚSQUEDA ORIENTADA POR PROBLEMAS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por pregunta, problema, falla o herramienta..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-850 text-xs font-mono-tech text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {(experienceType === 'ALL' || experienceType === 'LABS') && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono-tech text-[11px] custom-scrollbar">
            {([
              { id: 'ALL', label: 'TODOS (14)' },
              { id: 'SISTEMAS', label: 'SISTEMAS & KERNEL' },
              { id: 'HARDWARE', label: 'HARDWARE & SILICIO' },
              { id: 'TALLER', label: 'TALLER & BANCO' },
              { id: 'METROLOGIA', label: 'METROLOGÍA' },
              { id: 'REDES_SEGURIDAD', label: 'REDES & SEGURIDAD' },
            ] as const).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg uppercase transition-all whitespace-nowrap cursor-pointer border ${
                  selectedFilter === cat.id
                    ? 'bg-zinc-800 text-amber-300/90 border-amber-500/40 shadow-sm font-semibold'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 font-medium'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. SECCIÓN DE LABORATORIOS CANÓNICOS CON ESTRUCTURA OBLIGATORIA */}
      {(experienceType === 'ALL' || experienceType === 'LABS') && (
        <div className="space-y-6">
          {experienceType === 'ALL' && (
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  LABORATORIOS GUIADOS DE INVESTIGACIÓN (14 CANÓNICOS)
                </h2>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono-tech uppercase">
                ESTRUCTURA METROLÓGICA COMPLETA
              </span>
            </div>
          )}

          {/* HERO COMPACTO PREMIUM: LABORATORIO DE ARRANQUE Y POST */}
          <div
            style={{ background: 'transparent' }}
            className="p-5 sm:p-6 rounded-2xl bg-transparent border border-zinc-800/60 shadow-lg space-y-4 relative group"
          >
            {/* Header / Meta Bar (Sobria y elegante) */}
            <div className="flex items-center justify-between gap-3 border-b border-zinc-800/40 pb-3 relative z-10 flex-wrap">
              <div className="flex items-center gap-2 font-mono-tech text-xs text-zinc-400">
                <span className="font-bold text-zinc-300">
                  LAB 01 · DESTACADO CANÓNICO
                </span>
                <span className="text-zinc-600">·</span>
                <span className="uppercase text-zinc-400">
                  TOMO 08 — ARRANQUE Y DIAGNÓSTICO
                </span>
              </div>

              <span className="text-[10px] font-mono-tech font-bold uppercase flex items-center gap-1.5 text-emerald-400/90">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DISPONIBLE
              </span>
            </div>

            {/* Two-Column Split Layout (Compact 25% height reduction) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              
              {/* Left Column: Título Protagonista, Descripción Breve e Indicadores Compactos */}
              <div className="lg:col-span-7 space-y-3.5">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono-tech font-bold tracking-widest text-cyan-400 uppercase block">
                    SECUENCIA DE INICIO & DIAGNÓSTICO DE PLACA MADRE
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight leading-snug">
                    ¿Qué sucede desde que apretás POWER hasta que inicia Windows?
                  </h2>
                </div>

                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed max-w-xl">
                  Explorá los <strong className="text-cyan-300 font-mono">35 estados del arranque</strong> en tiempo real, observá la topología de una placa ATX virtual, provocá fallas inducidas en hardware o firmware y aprendé a diagnosticarlas con instrumental metrológico.
                </p>

                {/* Indicadores Compactos (Sin bordes llamativos ni cajas gigantes) */}
                <div className="flex items-center gap-4 text-xs font-mono-tech text-zinc-300 flex-wrap py-1">
                  <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    Placa Interactiva
                  </span>
                  <span className="text-zinc-600" aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    35 Estados POST
                  </span>
                  <span className="text-zinc-600" aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                    <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    Diagnóstico Guiado
                  </span>
                </div>

                {/* CTA Principal (Amarillo exclusivo para la acción) */}
                <div className="pt-1 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={onOpenBootLab}
                    className="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                  >
                    <span>EXPLORAR EL ARRANQUE PASO A PASO</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <span className="text-[11px] text-zinc-400 font-mono-tech">
                    Acceso directo al simulador
                  </span>
                </div>
              </div>

              {/* Right Column: Fotografía Realista de Placa Madre en Primer Plano */}
              <div className="lg:col-span-5 relative group/img">
                <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950/60 shadow-xl">
                  <img
                    src={pcbDetailImg}
                    alt="Primer plano técnico de placa madre ATX"
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500 brightness-95 contrast-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Gradient Scrim Overlay for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Minimalist Badge Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono-tech px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-zinc-800/80 text-zinc-300">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      PLACA MADRE ATX VIRTUAL
                    </span>
                    <span className="text-emerald-400 font-bold">● V-Z790 POST READY</span>
                  </div>
                </div>
              </div>

            </div>

            {/* MODOS DE TRABAJO Y DETALLES SECUNDARIOS EN DESPLEGABLE LIGERO */}
            <div className="pt-3 border-t border-zinc-800/40 relative z-10">
              <details className="group/details">
                <summary className="text-xs font-mono-tech font-bold text-zinc-400 hover:text-white uppercase tracking-wider flex items-center justify-between cursor-pointer py-1 select-none">
                  <span className="flex items-center gap-1.5 text-cyan-400/90">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    VER EXPERIENCIAS Y MODOS DE APRENDIZAJE (FALLA SIMULADA, CASO EVO, PC MISTERIOSA)
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-open/details:rotate-180 transition-transform" />
                </summary>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
                  {/* Cartilla 1: FALLA SIMULADA */}
                  <div
                    style={{ background: 'transparent' }}
                    className="p-3.5 rounded-xl bg-transparent hover:bg-transparent border border-zinc-800/50 hover:border-cyan-500/35 hover:shadow-[0_0_12px_rgba(6,182,212,0.1)] transition-all space-y-2 cursor-default"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        FALLA SIMULADA
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-transparent text-zinc-400 border border-zinc-800/70 font-bold uppercase">
                        INYECCIÓN DE ERRORES
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans-editorial text-[11px] text-zinc-300 leading-snug">
                      <p className="bg-transparent p-2 rounded-lg border border-zinc-850">
                        <strong className="text-cyan-300 font-mono-tech text-[10px] uppercase font-bold block mb-0.5">
                          Qué investigás:
                        </strong>
                        Provocación en vivo de fallas eléctricas de VRM, corrupción BCD y firmas UEFI defectuosas.
                      </p>
                      <p className="bg-transparent p-2 rounded-lg border border-zinc-850">
                        <strong className="text-emerald-400 font-mono-tech text-[10px] uppercase font-bold block mb-0.5">
                          Qué aprendés:
                        </strong>
                        A rastrear la etapa exacta de congelamiento mediante código POST e instrumental de medición.
                      </p>
                    </div>
                  </div>

                  {/* Cartilla 2: CASO EVO */}
                  <div
                    style={{ background: 'transparent' }}
                    className="p-3.5 rounded-xl bg-transparent hover:bg-transparent border border-zinc-800/50 hover:border-amber-500/35 hover:shadow-[0_0_12px_rgba(245,158,11,0.1)] transition-all space-y-2 cursor-default"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                        CASO EVO
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-transparent text-zinc-400 border border-zinc-800/70 font-bold uppercase">
                        DIAGNÓSTICO GUIADO
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans-editorial text-[11px] text-zinc-300 leading-snug">
                      <p className="bg-transparent p-2 rounded-lg border border-zinc-850">
                        <strong className="text-amber-300 font-mono-tech text-[10px] uppercase font-bold block mb-0.5">
                          Qué investigás:
                        </strong>
                        Casos reales de clientes ingresados a taller con reportes de falla ambiguos ("No da video").
                      </p>
                      <p className="bg-transparent p-2 rounded-lg border border-zinc-850">
                        <strong className="text-emerald-400 font-mono-tech text-[10px] uppercase font-bold block mb-0.5">
                          Qué aprendés:
                        </strong>
                        A aplicar el árbol de descarte metrológico, validar señales y firmar el informe pericial.
                      </p>
                    </div>
                  </div>

                  {/* Cartilla 3: PC MISTERIOSA */}
                  <div
                    style={{ background: 'transparent' }}
                    className="p-3.5 rounded-xl bg-transparent hover:bg-transparent border border-zinc-800/50 hover:border-purple-500/35 hover:shadow-[0_0_12px_rgba(168,85,247,0.1)] transition-all space-y-2 cursor-default"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                        <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                        PC MISTERIOSA
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-transparent text-zinc-400 border border-zinc-800/70 font-bold uppercase">
                        AUDITORÍA A CIEGAS
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans-editorial text-[11px] text-zinc-300 leading-snug">
                      <p className="bg-transparent p-2 rounded-lg border border-zinc-850">
                        <strong className="text-purple-300 font-mono-tech text-[10px] uppercase font-bold block mb-0.5">
                          Qué investigás:
                        </strong>
                        Equipos no funcionales con múltiples fallas ocultas combinadas y sin ninguna pista previa.
                      </p>
                      <p className="bg-transparent p-2 rounded-lg border border-zinc-850">
                        <strong className="text-emerald-400 font-mono-tech text-[10px] uppercase font-bold block mb-0.5">
                          Qué aprendés:
                        </strong>
                        A contrastar hipótesis metrológicamente con sondas virtuales sin adivinar ni arriesgar piezas.
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8">
            {filteredLabs.map((lab) => {
              const IconComp = lab.icon;
              const isAvailable = lab.status === 'DISPONIBLE';
              const isExpanded = !!expandedLabIds[lab.id];

              return (
                <div
                  key={lab.id}
                  style={{ background: 'transparent' }}
                  className={`p-5 sm:p-5.5 rounded-2xl bg-transparent border transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                    isExpanded ? 'border-amber-400/35 ring-1 ring-amber-400/10' : 'border-zinc-800/50 hover:border-zinc-700/70'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header limpio y sobrio: ID, Categoría y Estado discreto */}
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-800/40 pb-2.5 text-xs">
                      <div className="flex items-center gap-2 text-zinc-400 font-mono-tech text-[11px]">
                        <span className="font-bold text-zinc-300">
                          LAB {lab.number}
                        </span>
                        <span className="text-zinc-600" aria-hidden="true">·</span>
                        <span className="uppercase text-zinc-400 tracking-wider">
                          {lab.labCategory}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono-tech font-bold uppercase flex items-center gap-1.5 ${
                          isAvailable
                            ? 'text-emerald-400/90'
                            : 'text-zinc-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                        {lab.status}
                      </span>
                    </div>

                    {/* Título Protagonista y Beneficio Principal Resumido en una Frase */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-transparent border border-zinc-800/60 text-cyan-400 shrink-0 mt-0.5">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors leading-tight">
                            {lab.title}
                          </h3>
                          <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                            “{lab.problemQuestion}”
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PROFUNDIDAD PROGRESIVA: Información completa organizada en VER DETALLE */}
                    {isExpanded && (
                      <div className="space-y-3 pt-3 border-t border-zinc-800/50 font-sans-editorial text-xs animate-fadeIn">
                        {/* Los 3 recuadros informativos: 100% transparentes, bordes tenues, hover individual sutil */}
                        <div className="space-y-2">
                          {/* 1. Qué problema resuelve */}
                          <div
                            style={{ background: 'transparent' }}
                            className="group/box bg-transparent hover:bg-transparent p-3 rounded-xl border border-zinc-800/50 hover:border-cyan-500/35 hover:shadow-[0_0_12px_rgba(6,182,212,0.1)] transition-all duration-200 space-y-1 cursor-default"
                          >
                            <span className="text-cyan-400 group-hover/box:text-cyan-300 font-mono-tech text-[10px] uppercase font-bold block transition-colors">
                              ● PROBLEMA QUE RESUELVE:
                            </span>
                            <p className="text-zinc-300 group-hover/box:text-zinc-200 text-xs leading-relaxed transition-colors">
                              {lab.problema}
                            </p>
                          </div>

                          {/* 2. Qué vas a experimentar */}
                          <div
                            style={{ background: 'transparent' }}
                            className="group/box bg-transparent hover:bg-transparent p-3 rounded-xl border border-zinc-800/50 hover:border-amber-500/35 hover:shadow-[0_0_12px_rgba(245,158,11,0.1)] transition-all duration-200 space-y-1 cursor-default"
                          >
                            <span className="text-amber-400 group-hover/box:text-amber-300 font-mono-tech text-[10px] uppercase font-bold block transition-colors">
                              ● QUÉ VAS A EXPERIMENTAR:
                            </span>
                            <p className="text-zinc-300 group-hover/box:text-zinc-200 text-xs leading-relaxed transition-colors">
                              {lab.accion}
                            </p>
                          </div>

                          {/* 3. Qué vas a aprender */}
                          <div
                            style={{ background: 'transparent' }}
                            className="group/box bg-transparent hover:bg-transparent p-3 rounded-xl border border-zinc-800/50 hover:border-emerald-500/35 hover:shadow-[0_0_12px_rgba(16,185,129,0.1)] transition-all duration-200 space-y-1 cursor-default"
                          >
                            <span className="text-emerald-400 group-hover/box:text-emerald-300 font-mono-tech text-[10px] uppercase font-bold block transition-colors">
                              ● QUÉ VAS A APRENDER:
                            </span>
                            <p className="text-zinc-300 group-hover/box:text-zinc-200 text-xs leading-relaxed transition-colors">
                              {lab.resultado}
                            </p>
                          </div>
                        </div>

                        {/* Detalle metrológico, instrumental y evidencia */}
                        <div className="space-y-2.5 pt-2 border-t border-zinc-850 font-mono-tech text-xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/90 flex items-center justify-between">
                            <span>DETALLE METROLÓGICO E INSTRUMENTAL</span>
                            <span className="text-zinc-500 font-normal">SOPORTE TÉCNICO EVO</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2.5 rounded-lg bg-transparent border border-zinc-800/50 space-y-0.5">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold block">SUBTÍTULO TÉCNICO:</span>
                              <span className="text-zinc-300">{lab.subtitle}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-transparent border border-zinc-800/50 space-y-0.5">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold block">NIVEL OPERATIVO:</span>
                              <span className="text-zinc-300 font-bold">{lab.level}</span>
                            </div>
                          </div>

                          {/* EVIDENCIA GENERADA */}
                          <div
                            style={{ background: 'transparent' }}
                            className="p-3 rounded-xl bg-transparent hover:bg-transparent border border-emerald-500/30 hover:border-emerald-500/50 transition-colors space-y-1"
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>EVIDENCIA GENERADA</span>
                            </div>
                            <p className="font-sans-editorial text-xs text-emerald-200/90 leading-relaxed">
                              {lab.evidencia}
                            </p>
                          </div>

                          {/* Herramienta EVO Relacionada */}
                          <div
                            style={{ background: 'transparent' }}
                            className="p-2.5 rounded-xl bg-transparent hover:bg-transparent border border-zinc-800/50 hover:border-zinc-700/60 transition-colors flex items-center justify-between text-xs"
                          >
                            <span className="text-[10px] font-mono-tech text-zinc-400 uppercase font-bold">
                              HERRAMIENTA EVO:
                            </span>
                            {lab.associatedToolName !== 'Sin herramienta específica asociada' ? (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-transparent text-amber-300 border border-amber-400/25 font-bold uppercase truncate max-w-[260px]">
                                {lab.associatedToolName}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-500 italic">
                                Sin herramienta específica asociada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones unificadas abajo: CTA EXPLORAR LABORATORIO + VER DETALLE */}
                  <div className="pt-3.5 border-t border-zinc-800/40 flex items-center gap-2">
                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={lab.action}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                      >
                        <span>EXPLORAR LABORATORIO</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </button>
                    ) : (
                      <div className="flex-1 py-2.5 px-4 rounded-xl bg-transparent text-zinc-500 text-xs font-bold uppercase tracking-wider text-center border border-zinc-800/50 select-none">
                        EN DESARROLLO
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleLabExpand(lab.id)}
                      className="px-3.5 py-2.5 rounded-xl bg-transparent hover:bg-zinc-900/40 text-zinc-300 hover:text-white border border-zinc-800/60 hover:border-amber-400/40 text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <span>{isExpanded ? 'OCULTAR' : 'VER DETALLE'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SECCIÓN DE SIMULADORES INTERACTIVOS */}
      {(experienceType === 'ALL' || experienceType === 'SIMS') && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                SIMULADORES INTERACTIVOS DE HARDWARE & KERNEL ({filteredSimulators.length})
              </h2>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono-tech uppercase">
              MODELOS INTERACTIVOS AUTÓNOMOS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8">
            {filteredSimulators.map((sim) => {
              const SimIcon = sim.icon;
              return (
                <div
                  key={sim.id}
                  style={{ background: 'transparent' }}
                  className="p-5 sm:p-5.5 rounded-2xl bg-transparent border border-cyan-900/40 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-900/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-black uppercase font-mono-tech bg-transparent text-cyan-300 border border-cyan-500/30">
                          {sim.number}
                        </span>
                        <span className="text-zinc-600">/</span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">
                          {sim.category}
                        </span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded font-mono-tech font-black uppercase bg-transparent text-emerald-400 border border-emerald-500/30">
                        ● {sim.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-transparent border border-cyan-800/50 text-cyan-400 shrink-0 mt-0.5">
                        <SimIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-lg text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                          {sim.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-sans-editorial mt-0.5">
                          {sim.subtitle}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{ background: 'transparent' }}
                      className="text-xs text-zinc-300 font-sans-editorial leading-relaxed bg-transparent hover:bg-transparent p-3 rounded-xl border border-zinc-800/50 hover:border-cyan-500/30 transition-colors"
                    >
                      {sim.description}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1 font-mono-tech text-[10px]">
                      {sim.capabilities.map((cap, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-transparent text-cyan-300 border border-cyan-900/40">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono-tech text-zinc-500 truncate">
                      {sim.tomoRelated}
                    </span>
                    <button
                      type="button"
                      onClick={sim.action}
                      className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 group-hover:scale-[1.01] shrink-0"
                    >
                      <span>INICIAR SIMULADOR</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. SECCIÓN DE ZONAS DEL CAMPUS EVO */}
      {(experienceType === 'ALL' || experienceType === 'ZONES') && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                ESTACIONES DEL CAMPUS EVO ({filteredCampusZones.length})
              </h2>
            </div>
            <span className="text-[10px] text-purple-400 font-mono-tech uppercase">
              8 ZONAS OFICIALES DE TRABAJO
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8">
            {filteredCampusZones.map((zone) => {
              const ZoneIcon = zone.icon;
              return (
                <div
                  key={zone.id}
                  style={{ background: 'transparent' }}
                  className="p-5 sm:p-5.5 rounded-2xl bg-transparent border border-purple-900/40 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-900/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-black uppercase font-mono-tech bg-transparent text-purple-300 border border-purple-500/30">
                          {zone.number}
                        </span>
                        <span className="text-zinc-600">/</span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">
                          {zone.category}
                        </span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded font-mono-tech font-black uppercase bg-transparent text-emerald-400 border border-emerald-500/30">
                        ● {zone.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-transparent border border-purple-800/50 text-purple-400 shrink-0 mt-0.5">
                        <ZoneIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-lg text-white uppercase tracking-tight group-hover:text-purple-300 transition-colors">
                          {zone.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-sans-editorial mt-0.5">
                          {zone.subtitle}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{ background: 'transparent' }}
                      className="text-xs text-zinc-300 font-sans-editorial leading-relaxed bg-transparent hover:bg-transparent p-3 rounded-xl border border-zinc-800/50 hover:border-purple-500/30 transition-colors"
                    >
                      {zone.description}
                    </p>

                    <div
                      style={{ background: 'transparent' }}
                      className="text-[11px] font-sans-editorial text-purple-200/90 bg-transparent p-2.5 rounded-lg border border-purple-900/40"
                    >
                      <span className="text-[9px] text-purple-400 uppercase font-bold block font-mono-tech mb-0.5">
                        ESPECIALIDAD DEL PUESTO
                      </span>
                      <span>{zone.specialty}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={zone.action}
                      className="py-2.5 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center gap-2 group-hover:scale-[1.01]"
                    >
                      <span>EXPLORAR ZONA</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
