import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileDiff,
  History,
  KeyRound,
  RotateCcw,
  Search,
  Server,
  ShieldAlert,
  Terminal,
  Wrench,
} from 'lucide-react';

type Provenance = 'SIMULATED' | 'SYSTEM_REPORTED' | 'DERIVED' | 'ESTIMATED' | 'UNKNOWN';

const ProvenanceBadge: React.FC<{ value?: Provenance }> = ({ value = 'SIMULATED' }) => (
  <span className="inline-flex items-center rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 text-[9px] font-bold tracking-wider text-cyan-300">
    {value}
  </span>
);

const LabFrame: React.FC<{
  title: string;
  mission: string;
  children: React.ReactNode;
}> = ({ title, mission, children }) => (
  <section className="space-y-4 rounded-2xl border border-cyan-900/70 bg-[#05080d] p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cyan-950 pb-3">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          EVO LAB // TOMO 02
        </div>
        <h3 className="mt-1 text-lg font-black uppercase tracking-tight text-white">{title}</h3>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-zinc-400">{mission}</p>
      </div>
      <ProvenanceBadge />
    </div>
    {children}
  </section>
);

const EvidenceRail: React.FC<{ step: number }> = ({ step }) => {
  const labels = ['OBSERVACIÓN', 'PRUEBA', 'RESULTADO', 'CONCLUSIÓN'];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {labels.map((label, idx) => (
        <div
          key={label}
          className={`rounded-lg border px-2.5 py-2 text-center text-[10px] font-bold ${
            idx <= step
              ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200'
              : 'border-zinc-800 bg-zinc-950 text-zinc-600'
          }`}
        >
          {idx + 1}. {label}
        </div>
      ))}
    </div>
  );
};

type CommandDef = {
  mode: 'CMD' | 'POWERSHELL';
  command: string;
  output: string[];
  meaning: string;
  admin: boolean;
  risk: 'BAJO' | 'MEDIO';
  modifies: boolean;
  reversible: string;
  prompt: string;
};

const COMMANDS: CommandDef[] = [
  {
    mode: 'CMD',
    command: 'whoami',
    output: ['evo-lab\\operador'],
    meaning: 'Identifica el contexto de usuario actual.',
    admin: false,
    risk: 'BAJO',
    modifies: false,
    reversible: 'NO APLICA',
    prompt: '¿Qué dato te confirma esta salida? El usuario efectivo de la sesión.',
  },
  {
    mode: 'CMD',
    command: 'systeminfo',
    output: ['OS Name: Microsoft Windows 11 Pro', 'OS Version: 10.0.26100', 'System Type: x64-based PC'],
    meaning: 'Resume versión del sistema y arquitectura.',
    admin: false,
    risk: 'BAJO',
    modifies: false,
    reversible: 'NO APLICA',
    prompt: '¿Qué verificarías antes de comparar dos PCs? Build y arquitectura.',
  },
  {
    mode: 'CMD',
    command: 'ipconfig',
    output: ['IPv4 Address . . . : 192.168.1.24', 'Default Gateway . . : 192.168.1.1'],
    meaning: 'Muestra configuración IP local reportada por Windows.',
    admin: false,
    risk: 'BAJO',
    modifies: false,
    reversible: 'NO APLICA',
    prompt: '¿Hay gateway configurado? Sí: 192.168.1.1.',
  },
  {
    mode: 'CMD',
    command: 'tasklist',
    output: ['explorer.exe      4120   182,344 K', 'MsMpEng.exe       1788   221,080 K', 'steam.exe         5512   403,020 K'],
    meaning: 'Lista procesos y memoria aproximada.',
    admin: false,
    risk: 'BAJO',
    modifies: false,
    reversible: 'NO APLICA',
    prompt: '¿Cuál investigarías primero por RAM? steam.exe, sin concluir que sea un problema.',
  },
  {
    mode: 'CMD',
    command: 'driverquery',
    output: ['Module Name  Display Name                 State', 'ndis         Network Driver Interface     Running', 'stornvme     Microsoft NVMe Storport       Running'],
    meaning: 'Enumera controladores cargados.',
    admin: false,
    risk: 'BAJO',
    modifies: false,
    reversible: 'NO APLICA',
    prompt: '¿Esto prueba que un driver está sano? No; sólo prueba que está cargado.',
  },
  {
    mode: 'POWERSHELL',
    command: 'Get-Process',
    output: ['Name        Id   CPU    WorkingSet', 'explorer   4120  18.2   186 MB', 'steam      5512  94.8   403 MB', 'MsMpEng    1788  41.1   221 MB'],
    meaning: 'Devuelve objetos de proceso con propiedades consultables.',
    admin: false,
    risk: 'BAJO',
    modifies: false,
    reversible: 'NO APLICA',
    prompt: '¿Qué investigarías: CPU acumulada o WorkingSet? Depende del síntoma; no son equivalentes.',
  },
  {
    mode: 'POWERSHELL',
    command: 'Get-Service',
    output: ['Status   Name       DisplayName', 'Running  BITS       Background Intelligent Transfer Service', 'Running  WSearch    Windows Search', 'Stopped  SysMain    SysMain'],
    meaning: 'Consulta estado de servicios.',
    admin: false,
    risk: 'BAJO',
    modifies: false,
    reversible: 'NO APLICA',
    prompt: '¿Servicio detenido = falla? No necesariamente; puede ser Manual o estar detenido por diseño.',
  },
  {
    mode: 'POWERSHELL',
    command: 'Get-WinEvent',
    output: ['LevelDisplayName  Id    ProviderName', 'Warning           10016 Microsoft-Windows-DistributedCOM', 'Error             7000  Service Control Manager'],
    meaning: 'Consulta eventos estructurados del sistema.',
    admin: false,
    risk: 'BAJO',
    modifies: false,
    reversible: 'NO APLICA',
    prompt: '¿Un evento Error demuestra causa raíz? No: debe correlacionarse con síntoma y tiempo.',
  },
];

const CommandLab: React.FC = () => {
  const [mode, setMode] = useState<'CMD' | 'POWERSHELL'>('CMD');
  const [input, setInput] = useState('whoami');
  const [result, setResult] = useState<CommandDef | null>(COMMANDS[0]);
  const visible = COMMANDS.filter((c) => c.mode === mode);

  const run = () => {
    const normalized = input.trim().toLowerCase();
    const match = visible.find((c) => c.command.toLowerCase() === normalized);
    setResult(match || null);
  };

  return (
    <LabFrame
      title="EVO COMMAND LAB"
      mission="Practicá CMD y PowerShell sin ejecutar acciones sobre tu PC. La salida es simulada, coherente y exige interpretación."
    >
      <div className="flex gap-2">
        {(['CMD', 'POWERSHELL'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              const first = COMMANDS.find((c) => c.mode === m)!;
              setInput(first.command);
              setResult(first);
            }}
            className={`rounded-lg border px-3 py-2 text-[11px] font-bold ${
              mode === m ? 'border-cyan-400 bg-cyan-950 text-cyan-200' : 'border-zinc-800 bg-zinc-950 text-zinc-500'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-black p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] text-zinc-500">
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          TERMINAL EDUCATIVA // NO EJECUTA COMANDOS REALES
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-cyan-200 outline-none focus:border-cyan-500"
          />
          <button onClick={run} className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-black text-black">
            EJECUTAR
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {visible.map((c) => (
          <button
            key={c.command}
            onClick={() => {
              setInput(c.command);
              setResult(c);
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-left hover:border-cyan-700"
          >
            <code className="text-xs text-cyan-300">{c.command}</code>
            <p className="mt-1 text-[10px] text-zinc-500">{c.meaning}</p>
          </button>
        ))}
      </div>

      {result ? (
        <div className="space-y-3 rounded-xl border border-cyan-900/60 bg-zinc-950/70 p-3">
          <pre className="overflow-x-auto rounded-lg bg-black p-3 text-[11px] leading-relaxed text-zinc-300">
            {result.output.join('\n')}
          </pre>
          <div className="grid gap-2 text-[10px] sm:grid-cols-4">
            <span className="rounded bg-black p-2 text-zinc-400">ADMIN: <b className="text-white">{result.admin ? 'SÍ' : 'NO'}</b></span>
            <span className="rounded bg-black p-2 text-zinc-400">RIESGO: <b className="text-emerald-400">{result.risk}</b></span>
            <span className="rounded bg-black p-2 text-zinc-400">MODIFICA: <b className="text-white">{result.modifies ? 'SÍ' : 'NO'}</b></span>
            <span className="rounded bg-black p-2 text-zinc-400">REVERSIBLE: <b className="text-white">{result.reversible}</b></span>
          </div>
          <div className="rounded-lg border border-amber-800/50 bg-amber-950/20 p-3 text-xs text-amber-200">
            <b>INTERPRETÁ:</b> {result.prompt}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-rose-800/50 bg-rose-950/20 p-3 text-xs text-rose-300">
          Comando no incluido en este sandbox. No se ejecutó nada.
        </div>
      )}
    </LabFrame>
  );
};

type RegistryValue = { path: string; name: string; type: string; value: string };
const REGISTRY_BASELINE: RegistryValue[] = [
  { path: 'HKCU\\Control Panel\\Desktop', name: 'MenuShowDelay', type: 'REG_SZ', value: '400' },
  { path: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', name: 'DemoUpdater', type: 'REG_SZ', value: 'C:\\Demo\\updater.exe' },
  { path: 'HKLM\\SOFTWARE\\EVO-LAB', name: 'DiagnosticMode', type: 'REG_DWORD', value: '0' },
];

const RegistrySandbox: React.FC = () => {
  const [values, setValues] = useState<RegistryValue[]>(REGISTRY_BASELINE);
  const [snapshot, setSnapshot] = useState<RegistryValue[] | null>(null);

  const editFirst = () => {
    if (!snapshot) setSnapshot(values.map((v) => ({ ...v })));
    setValues((prev) => prev.map((v, i) => (i === 0 ? { ...v, value: v.value === '400' ? '50' : '400' } : v)));
  };

  const restore = () => {
    if (snapshot) setValues(snapshot.map((v) => ({ ...v })));
    setSnapshot(null);
  };

  return (
    <LabFrame
      title="EVO REGISTRY SANDBOX"
      mission="Editá un Registro simulado, generá snapshot, observá el diff y revertí. Ninguna clave real de Windows es modificada."
    >
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSnapshot(values.map((v) => ({ ...v })))} className="rounded-lg border border-cyan-700 bg-cyan-950/40 px-3 py-2 text-[11px] font-bold text-cyan-200">
          EXPORTAR SNAPSHOT
        </button>
        <button onClick={editFirst} className="rounded-lg border border-amber-700 bg-amber-950/30 px-3 py-2 text-[11px] font-bold text-amber-200">
          MODIFICAR VALOR SIMULADO
        </button>
        <button onClick={restore} disabled={!snapshot} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] font-bold text-zinc-300 disabled:opacity-40">
          RESTAURAR
        </button>
      </div>

      <div className="space-y-2">
        {values.map((v, idx) => {
          const before = snapshot?.[idx];
          const changed = before && before.value !== v.value;
          return (
            <div key={v.path + v.name} className={`rounded-xl border p-3 ${
              changed ? 'border-amber-600/60 bg-amber-950/15' : 'border-zinc-800 bg-zinc-950'
            }`}>
              <div className="flex flex-wrap justify-between gap-2">
                <code className="text-[11px] text-cyan-300">{v.path}\\{v.name}</code>
                <span className="text-[10px] text-zinc-500">{v.type}</span>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="rounded bg-black p-2 text-[10px] text-zinc-400">ANTES: <b className="text-white">{before?.value ?? v.value}</b></div>
                <div className="rounded bg-black p-2 text-[10px] text-zinc-400">DESPUÉS: <b className={changed ? 'text-amber-300' : 'text-white'}>{v.value}</b></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-xs text-zinc-300">
        <b className="text-rose-300">REGLA EVO:</b> antes de modificar Registro real, respaldá la rama exacta y documentá valor anterior, motivo y reversión.
      </div>
    </LabFrame>
  );
};

type ServiceRow = {
  name: string;
  display: string;
  state: 'RUNNING' | 'STOPPED';
  startup: 'AUTO' | 'MANUAL' | 'DISABLED';
  dependency: string;
  impact: string;
};

const SERVICE_BASELINE: ServiceRow[] = [
  { name: 'BITS', display: 'Background Intelligent Transfer Service', state: 'RUNNING', startup: 'MANUAL', dependency: 'RPCSS', impact: 'Transferencias en segundo plano y componentes de Update.' },
  { name: 'WSearch', display: 'Windows Search', state: 'RUNNING', startup: 'AUTO', dependency: 'RPCSS', impact: 'Indexación y búsqueda acelerada.' },
  { name: 'SysMain', display: 'SysMain', state: 'RUNNING', startup: 'AUTO', dependency: 'RPCSS', impact: 'Precarga y optimización de acceso frecuente.' },
];

const ServiceLab: React.FC = () => {
  const [rows, setRows] = useState<ServiceRow[]>(SERVICE_BASELINE);
  const [snapshot, setSnapshot] = useState<ServiceRow[] | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const toggle = (idx: number) => {
    if (!snapshot) setSnapshot(rows.map((r) => ({ ...r })));
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        const next = r.state === 'RUNNING' ? 'STOPPED' : 'RUNNING';
        setLog((l) => [...l, `${r.name}: ${r.state} → ${next}`]);
        return { ...r, state: next };
      })
    );
  };

  const restore = () => {
    if (snapshot) {
      setRows(snapshot.map((r) => ({ ...r })));
      setLog((l) => [...l, 'ROLLBACK: estado inicial restaurado']);
      setSnapshot(null);
    }
  };

  return (
    <LabFrame
      title="EVO SERVICE LAB"
      mission="Probá START/STOP sobre servicios simulados, observá dependencias y comprobá si el cambio tiene justificación."
    >
      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div key={r.name} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white">{r.name} // {r.display}</div>
                <div className="mt-1 text-[10px] text-zinc-500">DEPENDE DE: {r.dependency} · STARTUP: {r.startup}</div>
                <div className="mt-1 text-[11px] text-zinc-400">{r.impact}</div>
              </div>
              <button
                onClick={() => toggle(idx)}
                className={`rounded-lg border px-3 py-2 text-[10px] font-black ${
                  r.state === 'RUNNING'
                    ? 'border-emerald-700 bg-emerald-950/30 text-emerald-300'
                    : 'border-rose-700 bg-rose-950/30 text-rose-300'
                }`}
              >
                {r.state}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={restore} disabled={!snapshot} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] text-zinc-300 disabled:opacity-40">
          <RotateCcw className="mr-1 inline h-3.5 w-3.5" /> REVERTIR
        </button>
        <span className="text-[10px] text-zinc-500">¿MEJORÓ? ¿ROMPIÓ ALGO? ¿ERA NECESARIO?</span>
      </div>
      {log.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-black p-3">
          <div className="mb-1 text-[10px] font-bold text-cyan-400">EVO CHANGELOG</div>
          {log.slice(-5).map((entry, i) => <div key={i} className="text-[10px] text-zinc-400">PASO {String(i + 1).padStart(2, '0')} // {entry}</div>)}
        </div>
      )}
    </LabFrame>
  );
};

const StartupDnaLab: React.FC = () => {
  const items = [
    { source: 'STARTUP APP', entry: 'Steam', chain: 'Startup Apps → steam.exe → sesión de usuario', effect: 'Inicio más lento si carga biblioteca y updater.' },
    { source: 'REGISTRY RUN', entry: 'DemoUpdater', chain: 'HKCU Run → updater.exe → red', effect: 'Proceso persistente al iniciar sesión.' },
    { source: 'SCHEDULED TASK', entry: 'Vendor Update', chain: 'Task Scheduler → vendorUpdate.exe → servicio', effect: 'Puede ejecutarse minutos después del login.' },
    { source: 'SERVICE', entry: 'WSearch', chain: 'SCM → WSearch → SearchIndexer.exe', effect: 'Indexación del contenido configurado.' },
    { source: 'DRIVER', entry: 'stornvme', chain: 'Kernel → stornvme.sys → controlador NVMe', effect: 'Control de almacenamiento; no es un startup app común.' },
  ];
  const [selected, setSelected] = useState(0);
  const item = items[selected];
  return (
    <LabFrame title="WINDOWS STARTUP DNA" mission="Seguí el origen real de lo que aparece al iniciar Windows. Fuente, cadena y efecto antes de deshabilitar.">
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((x, i) => (
          <button key={x.entry} onClick={() => setSelected(i)} className={`rounded-lg border p-3 text-left ${
            selected === i ? 'border-cyan-500 bg-cyan-950/30' : 'border-zinc-800 bg-zinc-950'
          }`}>
            <span className="text-[9px] font-bold text-cyan-400">{x.source}</span>
            <div className="text-xs font-bold text-white">{x.entry}</div>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-cyan-900/60 bg-black p-4">
        <div className="text-[10px] font-bold text-cyan-400">CADENA</div>
        <div className="mt-2 text-xs text-zinc-200">{item.chain}</div>
        <div className="mt-3 text-[10px] font-bold text-amber-400">POSIBLE EFECTO</div>
        <div className="mt-1 text-xs text-zinc-400">{item.effect}</div>
      </div>
    </LabFrame>
  );
};

type FailureCase = {
  id: string;
  title: string;
  symptom: string;
  evidence: string[];
  cause: string;
  actions: string[];
  correctAction: number;
};

const FAILURE_CASES: FailureCase[] = [
  { id: 'f01', title: 'Servicio crítico detenido', symptom: 'Una función de Windows dejó de responder tras un cambio de servicios.', evidence: ['SCM registra servicio detenido.', 'La dependencia aparece STOPPED.', 'El problema comenzó inmediatamente después del cambio.'], cause: 'Servicio requerido detenido.', actions: ['Reiniciar el servicio y comprobar dependencia.', 'Formatear Windows.', 'Deshabilitar más servicios.'], correctAction: 0 },
  { id: 'f02', title: 'Inicio excesivo', symptom: 'El escritorio tarda mucho en quedar utilizable.', evidence: ['Startup Apps muestra 8 entradas.', 'Tres updaters arrancan al login.', 'CPU y disco caen después de 90 s.'], cause: 'Carga excesiva de autoarranque.', actions: ['Medir impacto y deshabilitar sólo entradas no necesarias.', 'Borrar System32.', 'Desactivar todos los servicios Microsoft.'], correctAction: 0 },
  { id: 'f03', title: 'Driver con DPC alto', symptom: 'FPS altos pero audio y juego tienen microcortes.', evidence: ['Picos DPC coinciden con tirones.', 'ndis.sys aparece en la ruta de red.', 'Al desactivar temporalmente Wi-Fi, el síntoma desaparece.'], cause: 'Ruta de driver/adaptador de red con latencia DPC.', actions: ['Revisar driver y configuración de energía del adaptador.', 'Subir prioridad del juego a tiempo real.', 'Borrar el pagefile.'], correctAction: 0 },
  { id: 'f04', title: 'Disco saturado', symptom: 'Disco al 100% y aplicaciones tardan en abrir.', evidence: ['Queue Length elevada.', 'SearchIndexer genera I/O constante.', 'SMART no muestra alerta en este escenario.'], cause: 'I/O sostenido por indexación.', actions: ['Aislar origen de I/O y corregir índice.', 'Ejecutar chkdsk /r diez veces.', 'Cambiar DNS.'], correctAction: 0 },
  { id: 'f05', title: 'RAM bajo presión', symptom: 'RAM al 93% con pausas al cambiar de aplicación.', evidence: ['Commit cerca del límite.', 'Working Set alto en una app.', 'Pagefile activo con hard faults frecuentes.'], cause: 'Presión de memoria por aplicación.', actions: ['Identificar proceso y patrón de memoria antes de cerrar o ampliar RAM.', 'Vaciar standby cada minuto.', 'Desactivar Defender.'], correctAction: 0 },
  { id: 'f06', title: 'Windows Update activo', symptom: 'PC lenta durante algunos minutos después de iniciar.', evidence: ['TiWorker activo.', 'BITS transfiere datos.', 'Historial muestra instalación pendiente.'], cause: 'Mantenimiento/Update legítimo en segundo plano.', actions: ['Esperar/confirmar actualización y medir luego.', 'Eliminar SoftwareDistribution a ciegas.', 'Desactivar Update permanentemente.'], correctAction: 0 },
  { id: 'f07', title: 'DNS incorrecto', symptom: 'Hay enlace de red pero los nombres no resuelven.', evidence: ['Gateway responde a ping.', '8.8.8.8 responde.', 'nslookup falla con DNS configurado.'], cause: 'Resolución DNS defectuosa.', actions: ['Corregir DNS y volver a probar resolución.', 'Reinstalar Windows.', 'Cambiar plan de energía.'], correctAction: 0 },
  { id: 'f08', title: 'Archivo de sistema dañado', symptom: 'Una función integrada de Windows falla al abrir.', evidence: ['SFC detecta corrupción.', 'DISM reporta almacén reparable.', 'No hay evidencia de fallo de disco en este caso.'], cause: 'Componente del sistema dañado.', actions: ['Reparar imagen y luego validar archivos protegidos.', 'Formatear directamente.', 'Borrar WinSxS.'], correctAction: 0 },
  { id: 'f09', title: 'Regresión de driver', symptom: 'El problema empezó justo tras actualizar un controlador.', evidence: ['Historial confirma nueva versión.', 'Versión anterior no mostraba el síntoma.', 'Rollback de prueba revierte el fallo.'], cause: 'Regresión de controlador.', actions: ['Conservar rollback y documentar versión estable.', 'Actualizar todos los drivers con una suite genérica.', 'Deshabilitar UAC.'], correctAction: 0 },
  { id: 'f10', title: 'Tarea programada pesada', symptom: 'Cada día a la misma hora hay un pico de CPU.', evidence: ['Task Scheduler registra ejecución coincidente.', 'Proceso hijo consume CPU durante 4 min.', 'Fuera de esa ventana el sistema es estable.'], cause: 'Tarea programada periódica.', actions: ['Ajustar o deshabilitar sólo la tarea confirmada y medir.', 'Eliminar todas las tareas.', 'Vaciar el Registro.'], correctAction: 0 },
];

const FailureInjectionLab: React.FC = () => {
  const [caseIndex, setCaseIndex] = useState(0);
  const [evidenceCount, setEvidenceCount] = useState(1);
  const [choice, setChoice] = useState<number | null>(null);
  const [wrong, setWrong] = useState(0);
  const current = FAILURE_CASES[caseIndex];
  const solved = choice === current.correctAction;
  const score = Math.max(0, 100 - (evidenceCount - 1) * 5 - wrong * 15);

  const select = (idx: number) => {
    setChoice(idx);
    if (idx !== current.correctAction) setWrong((v) => v + 1);
  };

  const changeCase = (idx: number) => {
    setCaseIndex(idx);
    setEvidenceCount(1);
    setChoice(null);
    setWrong(0);
  };

  return (
    <LabFrame
      title="EVO FAILURE INJECTION"
      mission="Recibís síntomas y evidencia parcial. La causa queda oculta hasta que investigás y elegís una acción justificable."
    >
      <EvidenceRail step={solved ? 3 : evidenceCount > 1 ? 2 : 0} />
      <div className="flex flex-wrap gap-1.5">
        {FAILURE_CASES.map((c, idx) => (
          <button key={c.id} onClick={() => changeCase(idx)} className={`rounded-md border px-2 py-1 text-[9px] font-bold ${
            idx === caseIndex ? 'border-violet-400 bg-violet-950/40 text-violet-200' : 'border-zinc-800 bg-zinc-950 text-zinc-500'
          }`}>{String(idx + 1).padStart(2, '0')}</button>
        ))}
      </div>

      <div className="rounded-xl border border-violet-800/60 bg-violet-950/15 p-4">
        <div className="text-[10px] font-bold text-violet-300">SÍNTOMA</div>
        <h4 className="mt-1 text-sm font-black text-white">{current.title}</h4>
        <p className="mt-2 text-xs text-zinc-300">{current.symptom}</p>
      </div>

      <div className="space-y-2">
        {current.evidence.slice(0, evidenceCount).map((ev, i) => (
          <div key={i} className="rounded-lg border border-cyan-900/50 bg-black p-3 text-xs text-zinc-300">
            <b className="mr-2 text-cyan-400">EVIDENCIA {i + 1}</b>{ev}
          </div>
        ))}
        {evidenceCount < current.evidence.length && (
          <button onClick={() => setEvidenceCount((v) => Math.min(current.evidence.length, v + 1))} className="rounded-lg border border-cyan-700 bg-cyan-950/30 px-3 py-2 text-[11px] font-bold text-cyan-200">
            OBTENER SIGUIENTE EVIDENCIA
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-[10px] font-bold uppercase text-amber-400">¿QUÉ HARÍAS AHORA?</div>
        {current.actions.map((action, idx) => (
          <button
            key={action}
            onClick={() => select(idx)}
            className={`w-full rounded-lg border p-3 text-left text-xs ${
              choice === idx
                ? idx === current.correctAction
                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                  : 'border-rose-500 bg-rose-950/30 text-rose-200'
                : 'border-zinc-800 bg-zinc-950 text-zinc-300'
            }`}
          >
            {action}
          </button>
        ))}
      </div>

      {solved && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-700/50 bg-emerald-950/20 p-3 text-xs text-emerald-200">
            <b>CAUSA CONFIRMADA:</b> {current.cause}
          </div>
          <div className="rounded-lg border border-cyan-700/50 bg-cyan-950/20 p-3 text-xs text-cyan-200">
            <b>SCORE:</b> {score}/100 · Cambios innecesarios: {wrong}
          </div>
        </div>
      )}
    </LabFrame>
  );
};

const RecoveryDrill: React.FC = () => {
  const scenarios = [
    { symptom: 'Windows inicia, pero el fallo comenzó justo después de instalar un driver.', correct: 'ROLLBACK DRIVER', options: ['ROLLBACK DRIVER', 'CHKDSK /R', 'FORMATEAR'] },
    { symptom: 'Windows no inicia después de una actualización acumulativa.', correct: 'WINRE / DESINSTALAR ACTUALIZACIÓN', options: ['WINRE / DESINSTALAR ACTUALIZACIÓN', 'BORRAR SYSTEM32', 'CAMBIAR DNS'] },
    { symptom: 'SFC reporta archivos protegidos dañados y el almacén de componentes también tiene corrupción.', correct: 'DISM Y LUEGO SFC', options: ['DISM Y LUEGO SFC', 'DESACTIVAR PAGEFILE', 'RESET DE RED'] },
    { symptom: 'La estructura NTFS presenta errores lógicos confirmados, sin indicios de daño físico en este escenario.', correct: 'CHKDSK CON CRITERIO', options: ['CHKDSK CON CRITERIO', 'REGEDIT CLEANER', 'DESHABILITAR UPDATE'] },
  ];
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const s = scenarios[idx];
  return (
    <LabFrame title="EVO RECOVERY DRILL" mission="Elegí la herramienta de recuperación adecuada. No se premia probar todo: se premia el orden lógico.">
      <div className="flex gap-1.5">{scenarios.map((_, i) => <button key={i} onClick={() => { setIdx(i); setAnswer(null); }} className={`rounded border px-2 py-1 text-[10px] ${idx===i?'border-cyan-400 text-cyan-200':'border-zinc-800 text-zinc-500'}`}>CASO {i+1}</button>)}</div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300">{s.symptom}</div>
      <div className="grid gap-2 sm:grid-cols-3">
        {s.options.map((o) => <button key={o} onClick={() => setAnswer(o)} className={`rounded-lg border p-3 text-xs font-bold ${answer===o?(o===s.correct?'border-emerald-500 bg-emerald-950/30 text-emerald-200':'border-rose-500 bg-rose-950/30 text-rose-200'):'border-zinc-800 bg-zinc-950 text-zinc-300'}`}>{o}</button>)}
      </div>
      {answer && <div className="text-xs text-zinc-300">{answer===s.correct ? 'Correcto: elegiste la intervención mínima coherente con la evidencia.' : 'No es la primera intervención justificada por la evidencia disponible.'}</div>}
    </LabFrame>
  );
};

const MITOS = [
  { myth: 'Más RAM libre = PC más rápida.', before: 'RAM usada 10.8 GB / 16 GB', after: 'RAM libre forzada +3 GB, más fallos de página', conclusion: 'RAM libre por sí sola no prueba mejora; cache y standby cumplen una función.' },
  { myth: 'Deshabilitar todos los servicios da más FPS.', before: 'Juego estable + servicios base', after: 'Ahorro mínimo, funciones perdidas', conclusion: 'El beneficio debe medirse servicio por servicio; deshabilitar indiscriminadamente no es optimización.' },
  { myth: 'Prioridad alta mejora cualquier juego.', before: 'Prioridad Normal', after: 'Alta: más contención con tareas del sistema', conclusion: 'Puede no mejorar frametime y puede perjudicar otros hilos críticos.' },
  { myth: 'Limpiar Registro acelera Windows.', before: 'Claves huérfanas sin impacto medible', after: 'Claves eliminadas, riesgo de romper asociación', conclusion: 'Eliminar claves no implica una mejora medible de CPU, RAM o I/O.' },
  { myth: 'Máximo rendimiento siempre es mejor.', before: 'Equilibrado', after: 'Frecuencias más sostenidas y mayor consumo/temperatura', conclusion: 'El plan correcto depende de carga, plataforma y objetivo medido.' },
  { myth: 'Todo Error del Event Viewer es grave.', before: 'Eventos Error aislados sin síntoma', after: 'Sin correlación temporal ni fallo reproducible', conclusion: 'Un evento es evidencia contextual, no diagnóstico por sí solo.' },
];

const MitoLab: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const m = MITOS[idx];
  return (
    <LabFrame title="EVO MITO LAB" mission="Transformá consejos populares en experimentos: hipótesis, estado base, cambio, resultado y conclusión.">
      <div className="flex flex-wrap gap-1.5">{MITOS.map((_,i)=><button key={i} onClick={()=>setIdx(i)} className={`rounded border px-2 py-1 text-[9px] font-bold ${idx===i?'border-amber-400 bg-amber-950/30 text-amber-200':'border-zinc-800 text-zinc-500'}`}>MITO {i+1}</button>)}</div>
      <div className="rounded-xl border border-amber-700/50 bg-amber-950/15 p-4">
        <div className="text-[10px] font-bold text-amber-400">HIPÓTESIS</div>
        <div className="mt-1 text-sm font-bold text-white">“{m.myth}”</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-black p-3 text-xs text-zinc-300"><b className="text-cyan-400">ANTES</b><div className="mt-1">{m.before}</div></div>
        <div className="rounded-xl border border-zinc-800 bg-black p-3 text-xs text-zinc-300"><b className="text-amber-400">DESPUÉS</b><div className="mt-1">{m.after}</div></div>
      </div>
      <div className="rounded-xl border border-emerald-700/50 bg-emerald-950/20 p-3 text-xs text-emerald-200"><b>CONCLUSIÓN:</b> {m.conclusion}</div>
    </LabFrame>
  );
};

const FormatDecisionLab: React.FC = () => {
  const [checked, setChecked] = useState<string[]>([]);
  const checks = ['Backup verificado', 'Estado del disco revisado', 'RAM descartada', 'Drivers revisados', 'Eventos correlacionados', 'Inicio y servicios medidos'];
  const ready = checked.length >= 5;
  return (
    <LabFrame title="FORMATEAR NO ES DIAGNOSTICAR" mission="Antes de reinstalar, documentá qué descartaste. Formatear puede ser válido, pero no reemplaza la búsqueda de causa raíz.">
      <div className="grid gap-2 sm:grid-cols-2">
        {checks.map((c) => {
          const active = checked.includes(c);
          return <button key={c} onClick={()=>setChecked((p)=>active?p.filter(x=>x!==c):[...p,c])} className={`rounded-lg border p-3 text-left text-xs ${active?'border-emerald-600 bg-emerald-950/20 text-emerald-200':'border-zinc-800 bg-zinc-950 text-zinc-400'}`}>{active?'✓ ':'○ '}{c}</button>;
        })}
      </div>
      <div className={`rounded-xl border p-4 text-xs ${ready?'border-cyan-600 bg-cyan-950/20 text-cyan-200':'border-amber-700 bg-amber-950/20 text-amber-200'}`}>
        {ready
          ? 'Ya existe evidencia suficiente para justificar una decisión informada. Si reinstalás, registrá motivo, backup y validación posterior.'
          : 'Todavía faltan comprobaciones. Formatear ahora sería una intervención prematura.'}
      </div>
    </LabFrame>
  );
};

const DpcBridge: React.FC = () => (
  <LabFrame title="PUENTE A WINDOWS MATRIX LAB" mission="Este capítulo se comprueba en el laboratorio central de Scheduler, ISR y DPC ya existente.">
    <div className="grid gap-2 sm:grid-cols-3">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300"><b className="text-cyan-400">OBSERVÁ</b><div className="mt-1">Prioridades, hilos y picos DPC simulados.</div></div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300"><b className="text-amber-400">CAMBIÁ</b><div className="mt-1">Una variable por vez.</div></div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300"><b className="text-emerald-400">COMPROBÁ</b><div className="mt-1">Compará estado base y resultado.</div></div>
    </div>
  </LabFrame>
);

export const Tomo02PracticeLab: React.FC<{ moduleId: string }> = ({ moduleId }) => {
  switch (moduleId) {
    case 'm02':
      return <FormatDecisionLab />;
    case 'm07':
      return <MitoLab />;
    case 'm08':
      return <DpcBridge />;
    case 'm10':
    case 'm14':
      return <CommandLab />;
    case 'm11':
      return <StartupDnaLab />;
    case 'm12':
      return <ServiceLab />;
    case 'm15':
      return <RegistrySandbox />;
    case 'm19':
      return <RecoveryDrill />;
    case 'm20':
      return <MitoLab />;
    case 'm23':
      return <FailureInjectionLab />;
    default:
      return null;
  }
};

export const TOMO02_PHASE15B_INVENTORY = {
  commandLab: true,
  registrySandbox: true,
  serviceLab: true,
  startupDna: true,
  failureInjectionCases: FAILURE_CASES.length,
  recoveryDrill: true,
  mitoLabExperiments: MITOS.length,
  provenance: 'SIMULATED' as Provenance,
};
