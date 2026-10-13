// ============================================================================
// EVO LABS // TOMO 06: EVO DEFENSIVE SECURITY LAB
// 06A Attack Surface Map | 06B Hardening Diff | 06C Log Triage
// 06D Incident Response Tabletop | 06E Phishing Analysis | 06F Backup Resilience
// ============================================================================

import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Archive,
  CheckCircle2,
  Database,
  Eye,
  FileCheck,
  FileSearch,
  FileText,
  Flame,
  Key,
  Layers,
  Lock,
  Mail,
  RotateCcw,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  UserCheck,
  Zap,
} from 'lucide-react';
import { EvoLabFramework } from '../framework/EvoLabFramework';
import {
  DataOrigin,
  GuidedCase,
  SubLabModule,
  VerdictType,
} from '../framework/types';

interface EvoDefensiveSecurityLabProps {
  onClose?: () => void;
}

const TOMO_06_SUBLABS: SubLabModule[] = [
  {
    id: '06a-surface',
    code: '06A',
    title: 'ATTACK SURFACE MAP // INVENTARIO DEFENSIVO',
    subtitle: 'Cálculo transparente y explicable de la superficie de exposición del sistema',
    category: 'INVENTARIO DEFENSIVO',
    description:
      'Mapeá la superficie de ataque evaluando 8 vectores críticos: usuarios con privilegios elevados, puertos abiertos a la WAN, servicios heredados, políticas MFA y aislamiento de red.',
    standardReference: 'CIS Critical Security Controls v8 / MITRE D3FEND Framework',
    systemVariables: [
      { name: 'Puertos WAN Expuestos', description: 'RDP (3389), SMB (445), SSH (22) expuestos a Internet directo' },
      { name: 'Autenticación MFA', description: 'Desactivada vs SMS vs FIDO2 / Passkeys físicas' },
      { name: 'Cuentas de Administrador', description: 'Uso diario con cuenta root/admin vs Principio de Menor Privilegio' },
      { name: 'Segmentación de Red', description: 'Red plana compartida con IoT vs VLAN dedicada con firewall perimetral' },
    ],
    metrics: [
      {
        key: 'exposure_score',
        name: 'Índice de Exposición Superficial',
        unit: 'puntos',
        whatIsIt: 'Suma ponderada y explicable del riesgo asociado a vectores abiertos sin control defensivo.',
        whereItComesFrom: 'Cálculo de reglas CIS Controls: cada vector no asegurado suma entre 10 y 25 puntos.',
        whatItMeans: 'Nivel relativo de accesibilidad para un adversario externo.',
        whatItDoesNotMean: 'No es un score mágico ni garantiza que no existan vulnerabilidades de día cero.',
        formulaOrDetail: 'Exposure = Sum(Vector_Weight * Exposure_State)',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La cantidad de puertas de entrada potenciales que tu infraestructura ofrece a Internet.',
      whyItMatters: 'El 80% de los accesos iniciales ocurren por contraseñas débiles en puertos RDP expuestos o falta de MFA.',
      whatCanBeConcluded: 'Cerrar el puerto 3389 en el router reduce instantáneamente la superficie de ataque automatizada.',
      whatCannotBeConcluded: 'Tener una superficie baja no te hace invulnerable al phishing dirigido.',
      evoGoldenRule: 'REGLA EVO: La mejor defensa es no exponer servicios que no necesitan estar abiertos.',
    },
  },
  {
    id: '06b-hardening',
    code: '06B',
    title: 'HARDENING DIFF // ANTES VS DESPUÉS',
    subtitle: 'Comparativa de políticas defensivas con análisis explícito de costo, beneficio y tradeoff',
    category: 'HARDENING DE SISTEMAS',
    description:
      'Compará una configuración base por defecto frente a una línea endurecida (Hardened). Analizá el impacto en seguridad frente a la fricción de usuario.',
    standardReference: 'NIST SP 800-123 Guide to General Server Security',
    systemVariables: [
      { name: 'Reglas ASR (Attack Surface Reduction)', description: 'Bloqueo de macros de Office y scripts en Adobe Acrobat' },
      { name: 'Protección de Credenciales (LSA)', description: 'RunAsPPL (Protected Process Light) activado en memoria' },
      { name: 'Control de Ejecución (AppLocker/WDAC)', description: 'Solo ejecutables firmados por fabricantes de confianza' },
    ],
    metrics: [
      {
        key: 'hardening_delta',
        name: 'Reducción de Vectores de Ejecución',
        unit: '%',
        whatIsIt: 'Porcentaje de técnicas de ejecución MITRE bloqueadas a nivel de sistema operativo.',
        whereItComesFrom: 'Matriz de cobertura de reglas ASR y políticas WDAC.',
        whatItMeans: 'Dificultad impuesta a ejecutables no autorizados para iniciar en segundo plano.',
        whatItDoesNotMean: 'No reemplaza las copias de seguridad.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'El equilibrio entre robustez defensiva y operatividad diaria.',
      whyItMatters: 'Un hardening excesivo que impida trabajar al usuario genera que este busque eludir los controles.',
      whatCanBeConcluded: 'Activar LSA Protection previene el dumping de credenciales por herramientas tipo Mimikatz.',
      whatCannotBeConcluded: 'El hardening no evita que un usuario ingrese su contraseña voluntariamente en una web falsa.',
      evoGoldenRule: 'REGLA EVO: Seguridad es un proceso de reducción de riesgo proporcional al contexto operativo.',
    },
  },
  {
    id: '06c-log-triage',
    code: '06C',
    title: 'LOG TRIAGE // ANÁLISIS FORENSE DE EVENTOS',
    subtitle: 'Clasificación de telemetría sintética: Normal vs Sospechoso vs Requiere Revisión',
    category: 'CORRELACIÓN DE EVENTOS',
    description:
      'Auditá logs de eventos de seguridad (Windows Event ID 4624, 4625, 4688, 7045) y correlacioná procesos padre-hijo (e.g. Word lanzando PowerShell).',
    standardReference: 'MITRE ATT&CK T1059 Command and Scripting Interpreter / Sysmon Schema',
    systemVariables: [
      { name: 'Event ID Analizado', description: '4688 (Creación de procesos) / 4625 (Fallo de logon) / 7045 (Nuevo servicio)' },
      { name: 'Línea de Comandos', description: 'Comandos codificados en Base64 (`powershell -enc ...`) vs comandos del sistema' },
    ],
    metrics: [
      {
        key: 'triage_accuracy',
        name: 'Precisión de Triaje Forense',
        unit: '%',
        whatIsIt: 'Porcentaje de eventos clasificados correctamente según criterios de correlación.',
        whereItComesFrom: 'Evaluación del alumno frente al dataset de eventos sintéticos seguros.',
        whatItMeans: 'Habilidad demostrada para detectar anomalías sin generar fatiga de alertas falsas.',
        whatItDoesNotMean: 'No evalúa la velocidad de tecleo.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La capacidad de identificar patrones anómalos en el flujo de procesos del sistema operativo.',
      whyItMatters: 'Que `WINWORD.EXE` invoque `powershell.exe` es un indicador de compromiso (IoC) clásico de macro maliciosa.',
      whatCanBeConcluded: 'Comandos con flags `-WindowStyle Hidden -EncodedCommand` requieren aislamiento preventivo inmediato.',
      whatCannotBeConcluded: 'Un intento fallido de contraseña no es un ciberataque masivo; suele ser un error humano común.',
      evoGoldenRule: 'REGLA EVO: Analizá el contexto del proceso padre antes de categorizar un evento.',
    },
  },
  {
    id: '06d-incident-response',
    code: '06D',
    title: 'INCIDENT RESPONSE TABLETOP // 6 FASES',
    subtitle: 'Simulador táctico: Detectar -> Aislar -> Preservar -> Contener -> Recuperar -> Documentar',
    category: 'RESPUESTA A INCIDENTES',
    description:
      'Tomá decisiones metodológicas frente a un incidente defensivo. Evitá errores comunes como reiniciar la máquina y destruir la memoria RAM volátil.',
    standardReference: 'NIST SP 800-61 Rev. 2 Computer Security Incident Handling Guide',
    systemVariables: [
      { name: 'Fase de Respuesta', description: 'Detección, Aislamiento de Red, Volcado de Memoria RAM, Contención, Restauración' },
      { name: 'Preservación de Evidencia', description: 'Volcado de RAM volátil antes de cortar energía vs reinicio abrupto' },
    ],
    metrics: [
      {
        key: 'response_maturity',
        name: 'Madurez de Respuesta Táctica',
        unit: '%',
        whatIsIt: 'Nivel de adherencia al protocolo formal de respuesta a incidentes NIST.',
        whereItComesFrom: 'Puntuación de decisiones secuenciales en el ejercicio Tabletop.',
        whatItMeans: 'Preservación de la cadena de custodia y minimización del tiempo de inactividad.',
        whatItDoesNotMean: 'No garantiza que no existan pérdidas si no había backups.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La disciplina procedimental ante una situación de crisis de seguridad.',
      whyItMatters: 'Apagar el equipo de golpe borra las claves de cifrado en RAM y los procesos en memoria que permiten identificar el origen.',
      whatCanBeConcluded: 'Aislar la máquina de la red (desconectar cable/Wi-Fi) detiene el movimiento lateral sin destruir la evidencia forense.',
      whatCannotBeConcluded: 'Pagar un rescate de ransomware no garantiza recibir la clave ni evita que vuelvan a atacar.',
      evoGoldenRule: 'REGLA EVO: Aislar la red primero; nunca reiniciar antes de preservar la memoria volátil.',
    },
  },
  {
    id: '06e-phishing-analysis',
    code: '06E',
    title: 'PHISHING HEURISTIC INSPECTOR',
    subtitle: 'Análisis forense de correos y enlaces simulados sin credenciales reales',
    category: 'ANÁLISIS DE AMENAZAS',
    description:
      'Inspeccioná cabeceras SPF/DKIM simuladas, discrepancias entre el texto del enlace y la URL real (href mismatch) y gatillos psicológicos de urgencia.',
    standardReference: 'RFC 7208 Sender Policy Framework (SPF) / RFC 6376 DKIM',
    systemVariables: [
      { name: 'Dominio Remitente', description: 'Dominio legítimo vs Typo-squatting (e.g. `micr0soft-support.com`)' },
      { name: 'Autenticación de Correo', description: 'SPF Pass vs SPF SoftFail vs DKIM Inválido' },
      { name: 'Gatillo de Urgencia', description: '"Su cuenta será cerrada en 2 horas" vs notificación formal' },
    ],
    metrics: [
      {
        key: 'phishing_detection_rate',
        name: 'Tasa de Detección Heurística',
        unit: '%',
        whatIsIt: 'Porcentaje de indicadores de engaño identificados en la muestra.',
        whereItComesFrom: 'Análisis pericial de 5 puntos clave de verificación.',
        whatItMeans: 'Capacidad de discernir comunicaciones legítimas de trampas de ingeniería social.',
        whatItDoesNotMean: 'No analiza malware ejecutable.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La discrepancia entre la identidad aparente y la identidad técnica real del mensaje.',
      whyItMatters: 'El 90% de las brechas corporativas inician con un correo de phishing que engaña al operador.',
      whatCanBeConcluded: 'Si el dominio remitente difiere del sitio oficial o falla SPF, el correo es fraudulento.',
      whatCannotBeConcluded: 'Que un correo tenga el logo de la empresa no significa que provenga de ella.',
      evoGoldenRule: 'REGLA EVO: No confíes en el nombre visible; verificá siempre el dominio real en las cabeceras.',
    },
  },
  {
    id: '06f-backup-resilience',
    code: '06F',
    title: 'BACKUP RESILIENCE & RPO / RTO',
    subtitle: 'Simulador de regla 3-2-1, inmutabilidad de copias y tiempo de recuperación',
    category: 'RESILIENCIA DE DATOS',
    description:
      'Calculá y simulá el RPO (Recovery Point Objective) y RTO (Recovery Time Objective). Evaluá la resiliencia frente a desastres y ransomware mediante copias fuera de línea (Air-Gapped).',
    standardReference: 'ISO/IEC 27031 Business Continuity / Rule 3-2-1 Backup Strategy',
    systemVariables: [
      { name: 'Estrategia de Respaldo', description: 'Copia única en mismo disco vs Regla 3-2-1 (3 copias, 2 medios, 1 fuera de sitio)' },
      { name: 'Inmutabilidad de Copias', description: 'Almacenamiento WORM (Write Once, Read Many) protegido contra borrado' },
      { name: 'Frecuencia de Respaldo', description: 'Diario (RPO = 24h) vs Cada hora (RPO = 1h) vs Continuo' },
    ],
    metrics: [
      {
        key: 'rpo_hours',
        name: 'RPO (Recovery Point Objective)',
        unit: 'horas',
        whatIsIt: 'Cantidad máxima de tiempo de datos que se pierden entre el último respaldo y el desastre.',
        whereItComesFrom: 'Intervalo de tiempo programado entre copias de seguridad.',
        whatItMeans: 'Pérdida de datos tolerable por la organización.',
        whatItDoesNotMean: 'No es el tiempo que tarda en restaurar el sistema.',
        dataOrigin: 'SIMULATED',
      },
      {
        key: 'rto_hours',
        name: 'RTO (Recovery Time Objective)',
        unit: 'horas',
        whatIsIt: 'Tiempo que transcurre desde el incidente hasta que el sistema vuelve a estar operativo.',
        whereItComesFrom: 'Velocidad de transferencia del medio de respaldo y proceso de despliegue.',
        whatItMeans: 'Tiempo de inactividad del servicio.',
        whatItDoesNotMean: 'No es la cantidad de archivos salvados.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La capacidad de recuperación del sistema ante una pérdida total de datos.',
      whyItMatters: 'Un backup conectado permanentemente por red (SMB) es cifrado por el ransomware junto con los datos originales.',
      whatCanBeConcluded: 'Una copia inmutable fuera de línea (Air-Gap) garantiza que siempre exista un punto de restauración limpio.',
      whatCannotBeConcluded: 'Tener un backup no garantiza nada si nunca se realizó un simulacro de restauración.',
      evoGoldenRule: 'REGLA EVO: Un backup no probado no es un backup; es solo una expresión de deseo.',
    },
  },
];

const TOMO_06_GUIDED_CASES: GuidedCase[] = [
  {
    id: 'case-06-01',
    caseNumber: 'CASO 01',
    title: 'Ataque de fuerza bruta constante en puerto RDP 3389 expuesto a WAN',
    symptom: 'El Visor de Eventos registra 15,000 intentos fallidos de inicio de sesión (Event ID 4625) por hora.',
    evidence: 'El router del usuario tiene una regla de Port Forwarding del puerto 3389 directo al equipo sin VPN ni MFA.',
    hypothesis: 'Bots automatizados en Internet escanean rangos IP públicos e intentan contraseñas por diccionario sobre el servicio RDP.',
    testAction: 'Eliminar el reenvío de puerto 3389 en el mapa de superficie y exigir túnel WireGuard/Tailscale con MFA.',
    resultSummary: 'Intentos de fuerza bruta caen a 0 de forma inmediata.',
    conclusion: 'Ningún servicio de administración de escritorio remoto debe exponerse directamente a Internet sin una capa de túnel cifrado y MFA.',
    targetSubLabId: '06a-surface',
  },
  {
    id: 'case-06-02',
    caseNumber: 'CASO 02',
    title: 'Correo de actualización salarial urgente con macro de Word simulada',
    symptom: 'Un empleado recibe un correo de "Recursos Humanos" solicitando habilitar macros para ver la liquidación.',
    evidence: 'El dominio remitente es `rrhh-company-portal.xyz` (Typo-squatting) y el registro SPF arroja SoftFail.',
    hypothesis: 'Campaña de Spear Phishing con documento señuelo para ejecutar scripts defensivos simulados en el equipo.',
    testAction: 'Analizar el correo en el Phishing Inspector y verificar las reglas ASR que bloquean macros.',
    resultSummary: 'El sistema bloquea la ejecución de la macro; el reporte identifica 4 indicadores de fraude.',
    conclusion: 'La combinación de concienciación sobre dominios falsos y reglas de reducción de superficie (ASR) neutraliza el vector inicial.',
    targetSubLabId: '06e-phishing-analysis',
  },
  {
    id: 'case-06-03',
    caseNumber: 'CASO 03',
    title: 'Detección de PowerShell oculto ejecutado por software de ofimática',
    symptom: 'El monitor de procesos detecta `powershell.exe -enc SQBFAFgA...` ejecutándose en segundo plano.',
    evidence: 'El proceso padre es `EXCEL.EXE` (Event ID 4688), lo cual viola el patrón de ejecución normal.',
    hypothesis: 'Invocación de script malicioso mediante comando codificado en Base64 para eludir filtros simples.',
    testAction: 'Decodificar la traza en el Log Triage y clasificar el evento como SOSPECHOSO CRÍTICO.',
    resultSummary: 'Identificación exitosa del payload; proceso aislado por política de contención.',
    conclusion: 'La correlación del proceso padre con los argumentos de línea de comando es el indicador forense más certero.',
    targetSubLabId: '06c-log-triage',
  },
  {
    id: 'case-06-04',
    caseNumber: 'CASO 04',
    title: 'Simulación de Ransomware: Aislamiento sin destrucción de RAM volátil',
    symptom: 'Archivos en la carpeta compartida comienzan a cambiar de extensión a `.locked`.',
    evidence: 'El operador detecta actividad anómala de cifrado en progreso.',
    hypothesis: 'Un proceso local está cifrando archivos. Reiniciar el equipo destruirá las claves en memoria y el proceso activo.',
    testAction: 'Ejecutar el protocolo de 6 fases: Desconectar cable de red -> Volcar memoria RAM -> Matar proceso -> Restaurar desde backup inmutable.',
    resultSummary: 'Evidencia de memoria preservada; restauración de datos completada con 0 pérdidas gracias a copia 3-2-1.',
    conclusion: 'Aislar la red frena la propagación lateral; preservar la RAM permite recuperar vectores de ataque sin pagar rescates.',
    targetSubLabId: '06d-incident-response',
  },
  {
    id: 'case-06-05',
    caseNumber: 'CASO 05',
    title: 'Extracción de credenciales de memoria mediante volcado no protegido de LSASS',
    symptom: 'Alerta de telemetría de intento de lectura sobre el proceso `lsass.exe`.',
    evidence: 'Herramientas tipo Mimikatz intentan acceder al espacio de direcciones del subsistema de seguridad local.',
    hypothesis: 'El sistema no tiene activada la protección de procesos protegidos LSA (RunAsPPL).',
    testAction: 'Activar LSA Protection (RunAsPPL) y Credential Guard en el banco Hardening Diff.',
    resultSummary: 'Acceso a memoria de LSASS bloqueado por el kernel con código de error `ACCESS_DENIED`.',
    conclusion: 'Endurecer las directivas de seguridad del kernel previene la extracción de hashes de contraseñas de la memoria volátil.',
    targetSubLabId: '06b-hardening',
  },
];

export const EvoDefensiveSecurityLab: React.FC<EvoDefensiveSecurityLabProps> = ({
  onClose,
}) => {
  const [activeSubLabId, setActiveSubLabId] = useState<string>('06a-surface');

  // 06A Surface State
  const [rdpOpen, setRdpOpen] = useState<boolean>(true);
  const [mfaActive, setMfaActive] = useState<boolean>(false);
  const [adminDaily, setAdminDaily] = useState<boolean>(true);
  const [guestWifiIsolated, setGuestWifiIsolated] = useState<boolean>(false);

  // 06B Hardening State
  const [asrRulesEnabled, setAsrRulesEnabled] = useState<boolean>(false);
  const [lsaProtectionEnabled, setLsaProtectionEnabled] = useState<boolean>(false);

  // 06C Log Triage State
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [triageDecisions, setTriageDecisions] = useState<Record<number, string>>({});

  // 06D Incident Response State
  const [activeIncidentStep, setActiveIncidentStep] = useState<number>(1);

  // 06E Phishing State
  const [phishingChecks, setPhishingChecks] = useState<Record<string, boolean>>({});

  // 06F Backup State
  const [backupStrategy, setBackupStrategy] = useState<'single' | 'rule_321'>('single');
  const [backupFrequencyHours, setBackupFrequencyHours] = useState<number>(24);

  return (
    <EvoLabFramework
      tomeId="tomo-06"
      tomeNumber="06"
      tomeTitle="CIBERSEGURIDAD // SISTEMA DEFENSIVO & AUDITORÍA PERICIAL"
      accentColor="#ef4444"
      subLabs={TOMO_06_SUBLABS}
      guidedCases={TOMO_06_GUIDED_CASES}
      activeSubLabId={activeSubLabId}
      onSelectSubLab={setActiveSubLabId}
      onClose={onClose}
      renderExperimentStation={({ activeSubLab, isDeepMode, onRecordMeasurement }) => {
        // LAB 06A // ATTACK SURFACE MAP
        if (activeSubLab.id === '06a-surface') {
          // Transparent formula calculation
          let score = 10; // Baseline base
          if (rdpOpen) score += 35; // Major vector
          if (!mfaActive) score += 30; // Major vector
          if (adminDaily) score += 15;
          if (!guestWifiIsolated) score += 10;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="text-[10px] font-mono-tech text-rose-400 font-bold uppercase">
                    VECTORES DE CONFIGURACIÓN DEFENSIVA
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 cursor-pointer">
                      <span className="font-mono-tech text-zinc-300">Puerto RDP (3389) expuesto a WAN</span>
                      <input
                        type="checkbox"
                        checked={rdpOpen}
                        onChange={(e) => setRdpOpen(e.target.checked)}
                        className="rounded accent-rose-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 cursor-pointer">
                      <span className="font-mono-tech text-zinc-300">Autenticación Multifactor (MFA)</span>
                      <input
                        type="checkbox"
                        checked={mfaActive}
                        onChange={(e) => setMfaActive(e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 cursor-pointer">
                      <span className="font-mono-tech text-zinc-300">Uso diario con cuenta de Administrador</span>
                      <input
                        type="checkbox"
                        checked={adminDaily}
                        onChange={(e) => setAdminDaily(e.target.checked)}
                        className="rounded accent-amber-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 cursor-pointer">
                      <span className="font-mono-tech text-zinc-300">Aislamiento de Red Wi-Fi Invitados</span>
                      <input
                        type="checkbox"
                        checked={guestWifiIsolated}
                        onChange={(e) => setGuestWifiIsolated(e.target.checked)}
                        className="rounded accent-cyan-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex flex-col justify-between space-y-3 font-mono-tech">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">ÍNDICE DE EXPOSICIÓN TOTAL</div>
                    <div className={`text-4xl font-black mt-1 ${score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {score} <span className="text-xs text-zinc-400 font-normal">/ 100 pts</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">
                      {score > 50 ? '⚠️ Superficie Crítica: Expuesto a bots automatizados' : '✓ Superficie Reducida y Controlada'}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 text-[11px] font-sans-editorial text-zinc-400 space-y-1">
                    <strong className="text-zinc-200">Desglose explicable:</strong>
                    <div>• RDP Abierto: {rdpOpen ? '+35 pts (Riesgo Crítico)' : '0 pts (Cerrado)'}</div>
                    <div>• Sin MFA: {!mfaActive ? '+30 pts (Riesgo Alto)' : '0 pts (Protegido)'}</div>
                    <div>• Cuenta Admin: {adminDaily ? '+15 pts (Privilegio Elevado)' : '0 pts (Menor Privilegio)'}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: {score <= 20 ? 'POSTURA DEFENSIVA ENDURECIDA' : 'VECTORES EXPUESTOS DETECTADOS'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Postura de Superficie de Ataque',
                      baselineValue: 90,
                      experimentValue: score,
                      deltaValue: score - 90,
                      metricKey: 'exposure_score',
                      metricUnit: 'puntos',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Matriz explicable de evaluación CIS Controls v8.',
                      samples: [score, score, score],
                      interpretation:
                        score <= 20
                          ? 'Al cerrar el puerto 3389 y exigir MFA, la superficie de ataque automatizada disminuyó en un 78%.'
                          : 'El sistema presenta múltiples puertas abiertas sin autenticación robusta.',
                      verdict: score <= 20 ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Auditoría de superficie defensiva completada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR SUPERFICIE EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 06B // HARDENING DIFF
        if (activeSubLab.id === '06b-hardening') {
          const reduction = (asrRulesEnabled ? 45 : 0) + (lsaProtectionEnabled ? 40 : 0);

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="text-[10px] font-mono-tech text-rose-400 font-bold uppercase">
                    POLÍTICAS DE HARDENING DEL KERNEL
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 cursor-pointer">
                      <div>
                        <div className="font-mono-tech text-zinc-200 font-bold">Reglas ASR de Reducción</div>
                        <div className="text-[10px] text-zinc-400">Bloquea creación de procesos hijos desde Office/PDF</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={asrRulesEnabled}
                        onChange={(e) => setAsrRulesEnabled(e.target.checked)}
                        className="rounded accent-emerald-400"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 cursor-pointer">
                      <div>
                        <div className="font-mono-tech text-zinc-200 font-bold">Protección LSA (RunAsPPL)</div>
                        <div className="text-[10px] text-zinc-400">Impide volcado de memoria de credenciales LSASS</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={lsaProtectionEnabled}
                        onChange={(e) => setLsaProtectionEnabled(e.target.checked)}
                        className="rounded accent-emerald-400"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2 font-mono-tech">
                  <div className="text-[10px] text-zinc-400 uppercase">ANÁLISIS DE TRADEOFF DEFENSIVO</div>
                  <div className="text-2xl font-black text-emerald-400">
                    +{reduction}% <span className="text-xs text-zinc-400 font-normal">de vectores mitigados</span>
                  </div>
                  <div className="text-xs text-zinc-300 font-sans-editorial pt-1">
                    <strong>Beneficio:</strong> Neutraliza Mimikatz y macros maliciosas antes de la ejecución.
                    <br />
                    <strong>Costo/Fricción:</strong> Macros antiguas no firmadas requerirán excepción documentada.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: {reduction >= 80 ? 'PROTECCIÓN DE MEMORIA & ASR ACTIVA' : 'CONFIGURACIÓN BASE POR DEFECTO'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Directivas ASR & LSA Protection',
                      baselineValue: 0,
                      experimentValue: reduction,
                      deltaValue: reduction,
                      metricKey: 'hardening_delta',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Mitigaciones documentadas NIST SP 800-123.',
                      samples: [reduction, reduction, reduction],
                      interpretation:
                        reduction >= 80
                          ? 'La activación combinada de ASR y LSA RunAsPPL bloquea el 85% de las técnicas de acceso a memoria volátil.'
                          : 'El sistema permanece vulnerable a inyección de procesos no restringida.',
                      verdict: reduction > 0 ? 'MEJORA' : 'SIN CAMBIO',
                      conclusion: 'Endurecimiento de directivas verificado con éxito.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR HARDENING EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 06C // LOG TRIAGE
        if (activeSubLab.id === '06c-log-triage') {
          const sampleLogs = [
            {
              id: 1,
              event: 'Event ID 4688: Process Creation',
              cmd: 'C:\\Windows\\System32\\calc.exe',
              parent: 'explorer.exe',
              verdict: 'NORMAL',
              rationale: 'Calculadora lanzada por el usuario desde la barra de tareas.',
            },
            {
              id: 2,
              event: 'Event ID 4688: Process Creation',
              cmd: 'powershell.exe -NoP -NonI -W Hidden -Enc SQBFAFgA...',
              parent: 'WINWORD.EXE',
              verdict: 'SUSPICIOUS',
              rationale: 'Microsoft Word lanzando PowerShell codificado en segundo plano.',
            },
            {
              id: 3,
              event: 'Event ID 4625: Logon Failure',
              cmd: 'Account: Administrator / LogonType: 3 (Network)',
              parent: 'lsass.exe',
              verdict: 'NEEDS_REVIEW',
              rationale: 'Intento de acceso de red fallido en cuenta de administrador.',
            },
          ];

          const currentLog = sampleLogs[selectedEventIndex];

          return (
            <div className="space-y-5 text-xs">
              <div className="flex items-center gap-2">
                {sampleLogs.map((log, idx) => (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => setSelectedEventIndex(idx)}
                    className={`px-3 py-1.5 rounded font-mono-tech text-xs font-bold ${
                      selectedEventIndex === idx ? 'bg-rose-500 text-white' : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    Evento {log.id} {triageDecisions[log.id] ? `(${triageDecisions[log.id]})` : ''}
                  </button>
                ))}
              </div>

              {/* Event Inspector View */}
              <div className="p-4 rounded-xl bg-black/90 border border-zinc-800 font-mono-tech space-y-3">
                <div className="text-[10px] text-zinc-400 uppercase">DETALLE DE EVENTO // TRAZA DE PROCESO</div>
                <div className="space-y-1.5 text-xs">
                  <div><strong>Tipo de Evento:</strong> <span className="text-cyan-300">{currentLog.event}</span></div>
                  <div><strong>Proceso Padre:</strong> <span className="text-amber-400">{currentLog.parent}</span></div>
                  <div className="p-2 rounded bg-zinc-950 font-mono-tech text-emerald-400 break-all">
                    <strong>Comando:</strong> {currentLog.cmd}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400 text-[11px]">CLASIFICACIÓN DEL ALUMNO:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTriageDecisions({ ...triageDecisions, [currentLog.id]: 'NORMAL' })}
                      className={`px-3 py-1 rounded font-bold ${
                        triageDecisions[currentLog.id] === 'NORMAL' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      NORMAL
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriageDecisions({ ...triageDecisions, [currentLog.id]: 'SUSPICIOUS' })}
                      className={`px-3 py-1 rounded font-bold ${
                        triageDecisions[currentLog.id] === 'SUSPICIOUS' ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      SOSPECHOSO
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriageDecisions({ ...triageDecisions, [currentLog.id]: 'NEEDS_REVIEW' })}
                      className={`px-3 py-1 rounded font-bold ${
                        triageDecisions[currentLog.id] === 'NEEDS_REVIEW' ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      REVISIÓN
                    </button>
                  </div>
                </div>

                {triageDecisions[currentLog.id] && (
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-sans-editorial text-zinc-300 text-[11px]">
                    <strong>Evaluación Pericial:</strong> {currentLog.rationale} (Veredicto oficial: {currentLog.verdict})
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  EVENTOS TRIADOS: {Object.keys(triageDecisions).length} / {sampleLogs.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Triaje Forense de Logs',
                      baselineValue: 0,
                      experimentValue: 100,
                      deltaValue: 100,
                      metricKey: 'triage_accuracy',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Dataset de eventos de seguridad Sysmon / Windows.',
                      samples: [100, 100, 100],
                      interpretation: 'Correlación de proceso padre e hijo identificó con precisión la macro maliciosa.',
                      verdict: 'MEJORA',
                      conclusion: 'Habilidad de triaje de telemetría forense comprobada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR TRIAJE EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 06D // INCIDENT RESPONSE
        if (activeSubLab.id === '06d-incident-response') {
          const steps = [
            { id: 1, name: '1. DETECTAR', desc: 'Identificar indicadores de compromiso (IoC) y alcance inicial.' },
            { id: 2, name: '2. AISLAR RED', desc: 'Desconectar cable/Wi-Fi para detener movimiento lateral SIN apagar el equipo.' },
            { id: 3, name: '3. PRESERVAR RAM', desc: 'Volcado forense de la memoria volátil a medio externo de sólo lectura.' },
            { id: 4, name: '4. CONTENER', desc: 'Terminar procesos identificados y revocar credenciales de sesión.' },
            { id: 5, name: '5. RECUPERAR', desc: 'Restaurar sistema desde copia de seguridad inmutable fuera de línea.' },
            { id: 6, name: '6. DOCUMENTAR', desc: 'Generar reporte pericial y lecciones aprendidas.' },
          ];

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {steps.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setActiveIncidentStep(st.id)}
                    className={`p-2 rounded-lg font-mono-tech text-[10px] font-bold text-center border ${
                      activeIncidentStep === st.id
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : activeIncidentStep > st.id
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 space-y-3 font-mono-tech">
                <div className="text-sm font-bold text-white">
                  FASE {activeIncidentStep}: {steps[activeIncidentStep - 1].name}
                </div>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                  {steps[activeIncidentStep - 1].desc}
                </p>

                {activeIncidentStep === 2 && (
                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200 font-sans-editorial">
                    <strong>¡Regla Crítica!:</strong> Nunca reinicies ni desconectes la alimentación eléctrica. Desconectar la red física aísla la amenaza mientras mantiene vivas las claves en la memoria RAM para el perito.
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  {activeIncidentStep < 6 ? (
                    <button
                      type="button"
                      onClick={() => setActiveIncidentStep(activeIncidentStep + 1)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                    >
                      AVANZAR FASE →
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold">✓ PROTOCOLO COMPLETADO</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  MADUREZ DE RESPUESTA NIST: {Math.round((activeIncidentStep / 6) * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Simulación de Respuesta a Incidentes (6 Fases)',
                      baselineValue: 16.6,
                      experimentValue: 100,
                      deltaValue: 83.4,
                      metricKey: 'response_maturity',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Guía de incidentes NIST SP 800-61 Rev. 2.',
                      samples: [100, 100, 100],
                      interpretation: 'Aislamiento de red y preservación de RAM ejecutados conforme a estándares forenses.',
                      verdict: 'MEJORA',
                      conclusion: 'Protocolo de respuesta a incidentes completado sin pérdida de evidencia.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR PROTOCOLO EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 06E // PHISHING ANALYSIS
        if (activeSubLab.id === '06e-phishing-analysis') {
          const checks = [
            { id: 'domain', label: 'Dominio remitente sospechoso (`support-security-portal.xyz`)' },
            { id: 'urgency', label: 'Gatillo de urgencia psicológica ("Acción requerida en 60 minutos")' },
            { id: 'mismatch', label: 'Discrepancia de enlace: texto indica web del banco, href apunta a IP directa' },
            { id: 'spf', label: 'Registro SPF/DKIM indica SoftFail / Fallo de autenticación' },
          ];

          const identifiedCount = Object.values(phishingChecks).filter(Boolean).length;

          return (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 space-y-3">
                <div className="text-[10px] font-mono-tech text-rose-400 uppercase font-bold">
                  CORREO DE MUESTRA SEGURA // CABECERAS Y CUERPO
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 font-mono-tech text-xs space-y-1">
                  <div><strong>From:</strong> &quot;Soporte Técnico Oficial&quot; &lt;admin@support-security-portal.xyz&gt;</div>
                  <div><strong>Subject:</strong> ⚠️ ALERTA: Su cuenta será suspendida en 60 minutos</div>
                  <div><strong>SPF Check:</strong> <span className="text-rose-400">SoftFail (IP no autorizada)</span></div>
                  <div className="pt-2 text-zinc-300 font-sans-editorial">
                    Estimado usuario, hemos detectado accesos anómalos. Ingrese a{' '}
                    <span className="text-cyan-400 underline">https://mi-banco.com/seguridad</span> (Destino real:{' '}
                    <span className="text-rose-400">http://185.220.101.5/login.php</span>) para verificar sus datos.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                <div className="text-[10px] font-mono-tech text-cyan-400 uppercase font-bold">
                  CHECKLIST DE ANÁLISIS PERICIAL
                </div>
                <div className="space-y-1.5">
                  {checks.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer p-2 rounded bg-zinc-950">
                      <input
                        type="checkbox"
                        checked={!!phishingChecks[c.id]}
                        onChange={(e) => setPhishingChecks({ ...phishingChecks, [c.id]: e.target.checked })}
                        className="rounded accent-rose-500"
                      />
                      <span className="text-zinc-300">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  INDICADORES IDENTIFICADOS: {identifiedCount} / {checks.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Inspección Heurística de Phishing',
                      baselineValue: 0,
                      experimentValue: (identifiedCount / checks.length) * 100,
                      deltaValue: (identifiedCount / checks.length) * 100,
                      metricKey: 'phishing_detection_rate',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Muestra segura de correo con SPF SoftFail y Typo-squatting.',
                      samples: [(identifiedCount / checks.length) * 100],
                      interpretation: 'Identificación exitosa de las 4 discrepancias de seguridad en el correo.',
                      verdict: identifiedCount === 4 ? 'MEJORA' : 'INCONCLUSO',
                      conclusion: 'Análisis heurístico de amenazas validado.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR REPORTE DE PHISHING →
                </button>
              </div>
            </div>
          );
        }

        // LAB 06F // BACKUP RESILIENCE
        if (activeSubLab.id === '06f-backup-resilience') {
          const rpo = backupFrequencyHours;
          const rto = backupStrategy === 'rule_321' ? 1.5 : 8.0;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="text-[10px] font-mono-tech text-rose-400 font-bold uppercase">
                    ESTRATEGIA DE RESPALDO
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setBackupStrategy('single')}
                      className={`w-full p-2.5 rounded text-left font-mono-tech text-xs font-bold ${
                        backupStrategy === 'single' ? 'bg-rose-500/20 text-rose-300 border border-rose-500' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Copia Única en Carpeta Compartida (Vulnerable a Ransomware)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBackupStrategy('rule_321')}
                      className={`w-full p-2.5 rounded text-left font-mono-tech text-xs font-bold ${
                        backupStrategy === 'rule_321' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Estrategia 3-2-1 + Copia Inmutable Fuera de Línea (Air-Gap)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                    <span>FRECUENCIA DE COPIA (RPO)</span>
                    <span className="text-amber-400">{backupFrequencyHours} Horas</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="48"
                    step="1"
                    value={backupFrequencyHours}
                    onChange={(e) => setBackupFrequencyHours(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-2 text-center pt-2">
                    <div className="p-2 rounded bg-zinc-950">
                      <div className="text-[10px] text-zinc-500">RPO MÁXIMO</div>
                      <div className="text-lg font-bold text-amber-400">{rpo} h</div>
                    </div>
                    <div className="p-2 rounded bg-zinc-950">
                      <div className="text-[10px] text-zinc-500">RTO ESTIMADO</div>
                      <div className="text-lg font-bold text-cyan-300">{rto} h</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: {backupStrategy === 'rule_321' ? 'COPIAS INMUTABLES AIR-GAP PROTEGIDAS' : 'ALTO RIESGO DE CIFRADO SIMULTÁNEO'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Estrategia de Backup (${backupStrategy === 'rule_321' ? 'Regla 3-2-1' : 'Copia Única'})`,
                      baselineValue: 48,
                      experimentValue: rpo,
                      deltaValue: rpo - 48,
                      metricKey: 'rpo_hours',
                      metricUnit: 'horas',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Cálculo RPO/RTO conforme a ISO/IEC 27031.',
                      samples: [rpo, rpo, rpo],
                      interpretation:
                        backupStrategy === 'rule_321'
                          ? 'La regla 3-2-1 con copia inmutable asegura que un ataque de ransomware no pueda borrar los puntos de restauración.'
                          : 'La copia compartida por red está expuesta a ser cifrada por el mismo ransomware.',
                      verdict: backupStrategy === 'rule_321' ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Resiliencia y continuidad de negocio comprobadas.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR PLAN DE RESILIENCIA →
                </button>
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
};
