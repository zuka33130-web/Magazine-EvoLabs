import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { EOE_LIMITS, METRICS } from '../../../evo-agent/src/observabilityProtocol';
import { localObservabilityEngine as engine } from '../../observability/localEngine';
import { statistics, type TelemetrySample, type MetricUnit } from '../../observability/series';
import { EvoAgentClient } from '../evoLabCore/services/evoAgentClient';
import { useEvoAccess } from '../../auth/EvoAccessContext';
import { useTutorEvo } from '../tutor/TutorEvoContext';
import './observability.css';

function formatted(value: number | null | undefined, unit: MetricUnit = '%'): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return 'UNKNOWN';
  if (unit === 'bytes' || unit === 'bytes/s') {
    const exponent = Math.min(3, Math.max(0, Math.floor(Math.log2(Math.max(value, 1)) / 10)));
    return `${(value / 1024 ** exponent).toLocaleString('es-AR', { maximumFractionDigits: 2 })} ${['B', 'KiB', 'MiB', 'GiB'][exponent]}${unit === 'bytes/s' ? '/s' : ''}`;
  }
  return `${value.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ${unit}`;
}
const labelFor = (id: string) => METRICS[id]?.label || `Procesador lógico ${id.split('.').at(-1)}`;

function MetricChart({ samples, unit, intervalMs }: { samples: TelemetrySample[]; unit: MetricUnit; intervalMs: number }) {
  const [windowSeconds, setWindowSeconds] = useState(60);
  const [inspected, setInspected] = useState<number | null>(null);
  const end = samples.length ? Date.parse(samples.at(-1)!.timestampUtc) : Date.now();
  const points = samples.filter(s => Date.parse(s.timestampUtc) >= end - windowSeconds * 1000);
  const valid = points.filter(s => s.value !== null && s.validity === 'VALID');
  const max = unit === '%' ? Math.max(100, ...valid.map(s => s.value!)) : Math.max(1, ...valid.map(s => s.value!)) * 1.1;
  const left = 45, top = 16, width = 900, height = 200;
  const x = (s: TelemetrySample) => left + (Date.parse(s.timestampUtc) - (end - windowSeconds * 1000)) / (windowSeconds * 1000) * width;
  const y = (value: number) => top + height - value / max * height;
  let path = '', previous: TelemetrySample | null = null;
  for (const s of points) {
    if (s.value === null || s.validity !== 'VALID' || s.lost) { previous = null; continue; }
    const gap = previous && Date.parse(s.timestampUtc) - Date.parse(previous.timestampUtc) > Math.max(intervalMs, s.sampleIntervalMs) * 1.5;
    path += `${previous && !gap ? 'L' : 'M'}${x(s).toFixed(2)},${y(s.value).toFixed(2)} `;
    previous = s;
  }
  const selected = inspected === null ? points.at(-1) : points[Math.min(inspected, points.length - 1)];
  return <div className="eoe-chart">
    <div className="eoe-row"><span className="eoe-eyebrow">SERIE TEMPORAL · {unit}</span><label>Ventana <select aria-label="Ventana del gráfico" value={windowSeconds} onChange={e => { setWindowSeconds(Number(e.target.value)); setInspected(null); }}><option value={30}>30 s</option><option value={60}>60 s</option><option value={300}>5 min</option></select></label></div>
    <svg viewBox="0 0 970 250" role="img" aria-label={`Serie temporal en ${unit}; los huecos representan datos ausentes`} onPointerMove={e => {
      if (!points.length) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const at = end - windowSeconds * 1000 + ((e.clientX - rect.left) / rect.width * 970 - left) / width * windowSeconds * 1000;
      let nearest = 0; points.forEach((s, i) => { if (Math.abs(Date.parse(s.timestampUtc) - at) < Math.abs(Date.parse(points[nearest].timestampUtc) - at)) nearest = i; });
      setInspected(nearest);
    }}>
      {[0, .5, 1].map(r => <g key={r}><line x1={left} x2={left + width} y1={top + height * r} y2={top + height * r} stroke="#303b47" strokeDasharray="3 5" /><text x="4" y={top + height * r + 4} fill="#aab7c6" fontSize="11">{(max * (1 - r)).toFixed(0)}</text></g>)}
      <path d={path} fill="none" stroke="#9ab8d1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {valid.map(s => <circle key={s.timestampUtc} cx={x(s)} cy={y(s.value!)} r="2.2" fill="#9ab8d1"><title>{s.timestampUtc} · {s.value} {s.unit}</title></circle>)}
      {selected?.value !== null && selected?.value !== undefined && <circle cx={x(selected)} cy={y(selected.value)} r="4" fill="#d7b878" />}
      <text x={left} y="242" fill="#aab7c6" fontSize="11">−{windowSeconds} s</text><text x="900" y="242" fill="#aab7c6" fontSize="11">UTC</text>
    </svg>
    {!valid.length && <p className="eoe-muted">Sin muestras válidas en esta ventana. No se dibujan valores de ejemplo.</p>}
    {points.length > 0 && <input aria-label="Inspeccionar muestra" type="range" min={0} max={Math.max(0, points.length - 1)} value={inspected === null ? Math.max(0, points.length - 1) : Math.min(inspected, points.length - 1)} onChange={e => setInspected(Number(e.target.value))} />}
    <output className="eoe-inspection">{selected ? `${selected.timestampUtc} · ${selected.value === null ? 'UNKNOWN' : `${selected.value} ${selected.unit}`} · ${selected.validity}${selected.late ? ' · ATRASADA' : ''}${selected.captureError ? ` · ${selected.captureError}` : ''}` : 'Esperando una captura auténtica del agente local.'}</output>
  </div>;
}

export default function EvoObservabilityCenter({ onBack }: { onBack: () => void }) {
  const state = useSyncExternalStore(engine.subscribe, engine.snapshot);
  const { updateLocation, openTutorWithTab } = useTutorEvo();
  const { canAccess, openUpgradeModal } = useEvoAccess();
  const [level, setLevel] = useState<'quick' | 'technical' | 'expert'>('quick');
  const [code, setCode] = useState('');
  const [connection, setConnection] = useState('Sin comprobar');
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState('cpu.total');
  const latest = state.frames.at(-1);
  const current = (id: string) => latest?.samples.find(s => s.metricId === id);
  const selectedSamples = useMemo(() => state.frames.map(f => f.samples.find(s => s.metricId === selectedId) || { ...f.samples[0], metricId: selectedId, value: null, unit: METRICS[selectedId]?.unit || '%' as MetricUnit, source: 'UNKNOWN', validity: 'UNKNOWN' as const, captureError: 'METRIC_NOT_PROVIDED' }), [state.frames, selectedId]);
  const stats = useMemo(() => statistics(selectedSamples), [selectedSamples]);
  const unit = METRICS[selectedId]?.unit || '%';
  const metricIds = useMemo(() => {
    const ids = new Set([...Object.keys(METRICS), selectedId]);
    state.frames.forEach(f => f.samples.forEach(s => ids.add(s.metricId)));
    return [...ids];
  }, [state.frames, selectedId]);
  useEffect(() => {
    const pauseHidden = () => { if (document.hidden && engine.snapshot().running) engine.pause('DOCUMENT_HIDDEN: captura pausada para reducir consumo.'); };
    const pageHide = () => engine.pause('PAGE_CLOSED');
    document.addEventListener('visibilitychange', pauseHidden); window.addEventListener('pagehide', pageHide);
    return () => { document.removeEventListener('visibilitychange', pauseHidden); window.removeEventListener('pagehide', pageHide); };
  }, []);
  const pair = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await EvoAgentClient.pair(code); setCode(''); setConnection('Emparejado con este origen · credencial solo en memoria'); }
    catch (error) { setConnection(error instanceof Error ? error.message : 'PAIRING_FAILED'); }
    finally { setBusy(false); }
  };
  const inspectAgent = async () => {
    setBusy(true);
    try {
      const health = await EvoAgentClient.pingAgent();
      setConnection(!health ? 'AGENT_NOT_CONNECTED: iniciá START-EVO-AGENT.cmd en Windows.' : health.pairingRequired === undefined ? 'AGENT_UPDATE_REQUIRED: instalá la versión 1.1.0.' : `Agente ${health.version} · ${health.platform} · ${health.pairingRequired ? 'ingresá el código local' : 'emparejado'}`);
    } finally { setBusy(false); }
  };
  const download = (format: 'json' | 'csv') => {
    if (!canAccess({ type: 'telemetry_download' }).allowed) { openUpgradeModal('Exportación de telemetría'); return; }
    const blob = new Blob([engine.export(format)], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = `evo-observability-${state.sessionId}.${format}`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const explain = () => {
    const sample = current(selectedId);
    updateLocation({ academySection: 'ANALIZAR MI PC', activityTitle: 'EVO Live Telemetry PRO', activityType: 'diagnostico',
      whatIs: `Observación ${labelFor(selectedId)}: ${formatted(sample?.value, unit)}. ${sample?.timestampUtc || 'Sin captura UTC'}.`,
      whatFor: `Fuente: ${sample?.source || 'UNKNOWN'}. Estado: ${sample?.validity || 'UNKNOWN'}. ${sample?.captureError || ''}`,
      currentAction: 'Examiná las muestras y su intervalo antes de plantear una hipótesis.', whatToLookFor: `${stats.count} muestras válidas de esta métrica en el registro retenido.`,
      whyItMatters: 'Una observación de utilización no demuestra una falla ni causalidad.', nextStep: 'Registrá condiciones y carga de trabajo. La comparación experimental persistente corresponde a la próxima entrega.' });
    openTutorWithTab('explain');
  };
  const phase = { idle: 'SIN SESIÓN', running: 'CAPTURANDO', paused: 'PAUSADA', disconnected: 'DESCONECTADO · REINTENTO ACOTADO', complete: 'FINALIZADA' }[state.phase];
  return <section className="eoe-center" aria-labelledby="eoe-title" data-eoe-center>
    <header className="eoe-heading">
      <div><span className="eoe-eyebrow">ANALIZAR MI PC / OBSERVABILITY ENGINE 1.0</span><h2 id="eoe-title">EVO Live Telemetry PRO</h2><p>Observá tu equipo. Conservá la fuente. Comprobá la evidencia.</p></div>
      <button onClick={() => { engine.pause(); onBack(); }}>Volver a diagnóstico</button>
    </header>
    <div className="eoe-notice"><strong>LECTURA LOCAL</strong><span>Windows · 127.0.0.1:43921 · sin cambios de servicios, drivers o configuración. La captura empieza al solicitarla; no se envía telemetría a servicios externos.</span></div>
    <div className="eoe-connection">
      <div><h3>Conexión segura al agente</h3><p>Iniciá el agente actualizado e ingresá el código de seis dígitos que aparece en su consola. Vence a los cinco minutos y se usa una sola vez.</p><output aria-live="polite" data-eoe-connection>{connection}</output></div>
      <form onSubmit={pair}><label>Código local<input aria-label="Código local del agente" type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} minLength={6} required autoComplete="off" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} /></label><button disabled={busy} type="submit">Emparejar</button></form>
      <div className="eoe-stack"><button disabled={busy} onClick={inspectAgent}>Comprobar agente</button><button onClick={async () => { engine.pause('DISCONNECTED_BY_USER'); await EvoAgentClient.disconnect(); setConnection('Desconectado; credencial revocada u olvidada localmente.'); }}>Desconectar</button></div>
    </div>
    <nav className="eoe-tabs" aria-label="Nivel de consulta">
      {([['quick', 'Vista rápida'], ['technical', 'Análisis técnico'], ['expert', 'Laboratorio experto']] as const).map(([id, label]) => <button key={id} aria-pressed={level === id} onClick={() => setLevel(id)}>{label}</button>)}
    </nav>
    <div className="eoe-toolbar">
      <div className="eoe-actions"><button className="eoe-primary" disabled={state.running} onClick={() => state.sessionId && state.phase !== 'complete' ? engine.resume() : engine.start()}>{state.sessionId && state.phase !== 'complete' ? 'Reanudar captura' : 'Iniciar sesión'}</button><button disabled={!state.running} onClick={() => engine.pause()}>Pausar</button><button disabled={!state.sessionId || state.phase === 'complete'} onClick={() => engine.end()}>Finalizar</button></div>
      <label>Captura<select aria-label="Intervalo de captura" value={state.captureIntervalMs} onChange={e => engine.configure(Number(e.target.value), state.renderIntervalMs)}>{[1000, 2000, 5000, 10000].map(ms => <option key={ms} value={ms}>{ms / 1000} s</option>)}</select></label>
      <label>Interfaz<select aria-label="Intervalo de interfaz" value={state.renderIntervalMs} onChange={e => engine.configure(state.captureIntervalMs, Number(e.target.value))}>{[500, 1000, 2000, 5000].map(ms => <option key={ms} value={ms}>{ms / 1000} s</option>)}</select></label>
      <button onClick={() => engine.configure(EOE_LIMITS.gamingIntervalMs, 2000)}>Perfil ligero / juegos</button>
    </div>
    <div className="eoe-session" role="status"><strong>{phase}</strong><span>{state.frames.length} registros retenidos · {(state.retainedBytes / 1024).toFixed(1)} KiB de datos</span><span>{latest ? `${latest.timestampKind === 'CAPTURE_ATTEMPT' ? 'Intento UTC' : 'Captura UTC'}: ${latest.timestampUtc}` : 'Sin medición UTC'}</span></div>
    {state.error && <p className="eoe-error" role="alert">{state.error}</p>}
    <dl className="eoe-overview">{['cpu.total', 'memory.pressure', 'disk.activity', 'network.receive'].map(id => <div key={id}><dt>{labelFor(id)}</dt><dd>{formatted(current(id)?.value, METRICS[id].unit)}</dd><small>{current(id)?.validity || 'Sin muestras'}</small></div>)}</dl>
    <div className="eoe-row"><label className="eoe-metric-select">Métrica<select aria-label="Métrica del gráfico" value={selectedId} onChange={e => setSelectedId(e.target.value)}>{metricIds.map(id => <option key={id} value={id}>{labelFor(id)}</option>)}</select></label><button onClick={explain}>Examinar evidencia con Tutor EVO</button></div>
    <MetricChart samples={selectedSamples} unit={unit} intervalMs={state.captureIntervalMs} />
    <dl className="eoe-stats">{([['Mínimo', stats.min], ['Máximo', stats.max], ['Promedio', stats.mean], ['P50', stats.p50], ['P95', stats.p95]] as const).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{formatted(value, unit)}</dd></div>)}</dl>
    <p className="eoe-muted">Ventana estadística: registro retenido completo · {stats.count} válidas / {selectedSamples.length} muestras · {stats.missing} ausentes o inválidas · percentiles por rango más próximo, sin interpolar huecos.</p>
    {level !== 'quick' && <>
      <h3>Registro técnico y procedencia</h3>
      <div className="eoe-table-wrap"><table><caption>Último registro · los valores ausentes conservan su causa</caption><thead><tr><th>Métrica</th><th>Valor</th><th>Integridad</th><th>Fuente / UTC / intervalo real</th></tr></thead><tbody>{metricIds.map(id => {
        const s = current(id);
        return <tr key={id}><th scope="row">{labelFor(id)}</th><td>{formatted(s?.value, METRICS[id]?.unit || '%')}</td><td>{s?.validity || 'UNKNOWN'}{s?.late && ' · ATRASADA'}{s?.lost && ' · PERDIDA'}<small>{s?.captureError || (!s ? 'Sin captura' : '')}</small></td><td><code>{s?.source || 'UNKNOWN'}</code><small>{s?.timestampUtc || 'Sin UTC'} · {s ? `${s.sampleIntervalMs.toFixed(0)} ms` : 'intervalo desconocido'}</small>{level === 'expert' && s?.counterEvidence && <small>Ticks {s.counterEvidence.startTicks} → {s.counterEvidence.endTicks}; base {s.counterEvidence.startBase} → {s.counterEvidence.endBase}; frecuencia {s.counterEvidence.frequencyHz} Hz. Evidencia incluida en la exportación.</small>}</td></tr>;
      })}</tbody></table></div>
      <h3>Procesos relevantes · mayor CPU y memoria</h3><p className="eoe-muted">Hasta cinco por CPU y cinco por memoria privada, unión sin duplicados. CPU de procesos: 100% equivale a un procesador lógico; puede superar 100%. Red: suma de interfaces del proveedor, puede incluir tráfico virtual o duplicado.</p>
      {latest?.processes.length ? <div className="eoe-table-wrap"><table><thead><tr><th>Proceso</th><th>PID</th><th>CPU</th><th>Working set privado</th></tr></thead><tbody>{latest.processes.map(p => <tr key={p.pid}><th scope="row">{p.name}</th><td>{p.pid}</td><td>{formatted(p.cpuPercent)}</td><td>{formatted(p.workingSetBytes, 'bytes')}</td></tr>)}</tbody></table></div> : <p className="eoe-muted">UNKNOWN · {latest?.processError || 'Sin captura de procesos'}</p>}
    </>}
    <details className="eoe-cost" open={level === 'expert'}><summary>Costo de observación y límites</summary>
      <p>Agente: CPU {formatted(current('agent.cpu')?.value)} · RAM {formatted(current('agent.rss')?.value, 'bytes')}. CPU del agente excluye su proceso hijo PowerShell.</p>
      <p>Consulta CIM: {formatted(current('collector.duration')?.value, 'ms')} · CPU de PowerShell {formatted(current('collector.cpuTime')?.value, 'ms')} · RAM al consultar {formatted(current('collector.rss')?.value, 'bytes')} (no es un pico).</p>
      <p>Normalización e inserción de la última respuesta: {state.pollWorkMs === null ? 'UNKNOWN' : `${state.pollWorkMs.toFixed(2)} ms`}. Este tiempo no mide CPU total de la interfaz, GC ni pintura del navegador.</p>
      <p>Máximo {EOE_LIMITS.maxFrames} capturas, {EOE_LIMITS.maxBytes / 1024 / 1024} MiB de JSON UTF-8 y {EOE_LIMITS.retentionMs / 60000} minutos; {state.evictedFrames} capturas retiradas. La ventana temporal se recorta al recibir registros nuevos; una sesión pausada conserva su registro hasta descartarlo. La memoria del heap puede ser mayor. Registro volátil: exportá antes de cerrar o iniciar otra sesión. Sin almacenamiento persistente automático.</p>
      <p>Las consultas CIM se serializan, tienen timeout de 4 s y no se acumulan. El período configurado es un mínimo: se deja descanso después de consultas lentas y se informa el intervalo real. La captura se pausa al ocultar o abandonar esta vista. Memoria «presión» indica ocupación física, no fallas de página ni PSI. Latencia requiere dos contadores válidos y operaciones completadas.</p>
    </details>
    {level === 'expert' && <div className="eoe-notice"><strong>EVIDENCIA, NO DIAGNÓSTICO</strong><span>Esta entrega registra observaciones. Alertas, anomalías, eventos de Windows y comparación A/B persistente corresponden a entregas posteriores. No se deduce una falla de un porcentaje aislado.</span></div>}
    <footer className="eoe-footer"><div className="eoe-actions"><button disabled={!state.frames.length} onClick={() => download('json')}>Exportar JSON</button><button disabled={!state.frames.length} onClick={() => download('csv')}>Exportar CSV</button><button disabled={!state.sessionId} onClick={() => engine.clear()}>Descartar registro local</button></div><small>Exportación local sujeta a los permisos de tu plan. JSON puede incluir nombres de procesos. Sin códigos ni tokens.</small></footer>
  </section>;
}
