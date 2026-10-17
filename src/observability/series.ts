import { EOE_SCHEMA_VERSION, EOE_LIMITS, METRICS, averageTimerMs, type ObservabilityFrame, type TelemetrySample, type MetricUnit } from '../../evo-agent/src/observabilityProtocol';
export type { TelemetrySample, MetricUnit } from '../../evo-agent/src/observabilityProtocol';
export interface RecordedFrame extends ObservabilityFrame { agentSessionId: string; receivedAtUtc: string; timestampKind: 'CAPTURE' | 'CAPTURE_ATTEMPT' }
const utcTime = (value: unknown): number | null => typeof value === 'string' && /Z$/.test(value) && Number.isFinite(Date.parse(value)) ? Date.parse(value) : null;
function definition(id: string) {
  return (Object.hasOwn(METRICS, id) ? METRICS[id] : null) || (/^cpu\.logical\.(0|[1-9]\d{0,2})$/.test(id) && Number(id.split('.').at(-1)) < 256 ? { label: `CPU lógico ${id.split('.').at(-1)}`, unit: '%' as MetricUnit, source: 'node:os.cpus/windows-logical-times-delta' } : null);
}
export function normalizeFrame(input: unknown, sessionId: string, expectedIntervalMs: number, receivedAt = Date.now()): RecordedFrame {
  const raw = (input as any)?.observability;
  if (!raw || raw.schemaVersion !== EOE_SCHEMA_VERSION) throw new Error('AGENT_UPDATE_REQUIRED: esquema EOE 1.0 ausente o incompatible.');
  if (raw.platform !== 'win32') throw new Error('PLATFORM_NOT_SUPPORTED: la captura del PC requiere un agente Windows nativo.');
  if (typeof raw.agentVersion !== 'string' || raw.agentVersion.length > 32 || typeof raw.sessionId !== 'string' || !raw.sessionId || raw.sessionId.length > 100 || !Number.isSafeInteger(raw.sequence) || raw.sequence < 1) throw new Error('INVALID_FRAME_IDENTITY');
  const stamp = utcTime(raw.timestampUtc);
  if (stamp === null || stamp - receivedAt > 120000) throw new Error('INVALID_FRAME_TIMESTAMP_OR_CLOCK_SKEW');
  if (!Array.isArray(raw.samples) || raw.samples.length > EOE_LIMITS.maxReadings) throw new Error('INVALID_FRAME_SAMPLE_LIMIT');
  const stale = receivedAt - stamp > Math.max(10000, expectedIntervalMs * 3);
  const seen = new Set<string>();
  const samples: TelemetrySample[] = raw.samples.map((s: any) => {
    if (!s || typeof s.metricId !== 'string' || seen.has(s.metricId)) throw new Error('DUPLICATE_OR_INVALID_METRIC');
    const d = definition(s.metricId);
    if (!d) throw new Error('UNREGISTERED_METRIC');
    seen.add(s.metricId);
    const sampleAt = utcTime(s.timestampUtc);
    let error: string | null = typeof s.captureError === 'string' ? s.captureError.slice(0, 240) : null;
    if (s.unit !== d.unit) error = 'UNIT_MISMATCH';
    else if (s.source !== d.source) error = 'UNVERIFIED_SOURCE';
    else if (sampleAt === null || sampleAt > stamp + 1000 || stamp - sampleAt > 10000) error = 'INVALID_SAMPLE_TIMESTAMP';
    else if (!Number.isFinite(s.sampleIntervalMs) || s.sampleIntervalMs <= 0) error = 'INVALID_SAMPLE_INTERVAL';
    else if (s.schemaVersion !== raw.schemaVersion || s.agentVersion !== raw.agentVersion || s.sessionId !== raw.sessionId) error = 'SAMPLE_IDENTITY_MISMATCH';
    const finite = typeof s.value === 'number' && Number.isFinite(s.value) && s.value >= 0 && (d.unit !== '%' || s.metricId === 'agent.cpu' || s.value <= 100);
    if (s.value !== null && !finite) error = 'INVALID_METRIC_VALUE';
    let evidence: TelemetrySample['counterEvidence'];
    if (['disk.readLatency', 'disk.writeLatency'].includes(s.metricId) && s.value !== null) {
      const e = s.counterEvidence;
      if (e && ['startTicks', 'endTicks', 'startBase', 'endBase', 'frequencyHz'].every(k => typeof e[k] === 'string' && /^\d{1,24}$/.test(e[k]))) {
        const recomputed = averageTimerMs(e.endTicks, e.endBase, e.startTicks, e.startBase, e.frequencyHz);
        if (recomputed !== null && Number.isFinite(s.value) && Math.abs(recomputed - s.value) <= Math.max(1e-9, Math.abs(recomputed) * 1e-6)) evidence = { startTicks: e.startTicks, endTicks: e.endTicks, startBase: e.startBase, endBase: e.endBase, frequencyHz: e.frequencyHz };
        else error = 'LATENCY_EVIDENCE_MISMATCH';
      } else error = 'LATENCY_EVIDENCE_MISSING';
    }
    if (stale) error = 'STALE_CAPTURE';
    const valid = s.validity === 'VALID' && finite && !error && s.lost === false;
    return {
      ...(evidence ? { counterEvidence: evidence } : {}), sessionId, metricId: s.metricId, timestampUtc: sampleAt === null ? new Date(stamp).toISOString() : new Date(sampleAt).toISOString(),
      value: valid ? s.value : null, unit: d.unit, source: error === 'UNVERIFIED_SOURCE' ? 'UNKNOWN' : d.source,
      sampleIntervalMs: Number.isFinite(s.sampleIntervalMs) && s.sampleIntervalMs > 0 ? s.sampleIntervalMs : expectedIntervalMs,
      validity: valid ? 'VALID' : s.validity === 'WARMUP' && !stale ? 'WARMUP' : error ? 'ERROR' : 'UNKNOWN',
      captureError: valid ? null : error || 'COUNTER_UNAVAILABLE', lost: s.lost === true || stale,
      late: s.late === true || stale || receivedAt - (sampleAt ?? stamp) > expectedIntervalMs * 1.5,
      agentVersion: raw.agentVersion, schemaVersion: EOE_SCHEMA_VERSION,
    };
  });
  for (const [metricId, d] of Object.entries(METRICS)) if (!seen.has(metricId)) samples.push({ sessionId, metricId, timestampUtc: new Date(stamp).toISOString(), value: null, unit: d.unit, source: 'UNKNOWN', sampleIntervalMs: expectedIntervalMs, validity: 'UNKNOWN', captureError: 'METRIC_NOT_PROVIDED', lost: false, late: stale, agentVersion: raw.agentVersion, schemaVersion: EOE_SCHEMA_VERSION });
  const validProcesses = !stale && Array.isArray(raw.processes) ? raw.processes.slice(0, 10).filter((p: any) => Number.isInteger(p?.pid) && p.pid > 0 && typeof p.name === 'string').map((p: any) => ({ pid: p.pid, name: p.name.slice(0, 120), cpuPercent: typeof p.cpuPercent === 'number' && Number.isFinite(p.cpuPercent) && p.cpuPercent >= 0 ? p.cpuPercent : null, workingSetBytes: typeof p.workingSetBytes === 'number' && Number.isFinite(p.workingSetBytes) && p.workingSetBytes >= 0 ? p.workingSetBytes : null })) : [];
  return { schemaVersion: EOE_SCHEMA_VERSION, agentVersion: raw.agentVersion, agentSessionId: raw.sessionId, timestampKind: 'CAPTURE', sessionId, sequence: raw.sequence, timestampUtc: new Date(stamp).toISOString(), receivedAtUtc: new Date(receivedAt).toISOString(), platform: raw.platform, samples, processes: validProcesses, processError: stale ? 'STALE_CAPTURE' : typeof raw.processError === 'string' ? raw.processError.slice(0, 240) : validProcesses.length ? null : 'PROCESS_COUNTER_UNAVAILABLE' };
}
export function missingFrame(sessionId: string, error: string, intervalMs: number, at = Date.now()): RecordedFrame {
  const stamp = new Date(at).toISOString();
  return { schemaVersion: EOE_SCHEMA_VERSION, agentVersion: 'UNKNOWN', sessionId, agentSessionId: 'UNKNOWN', timestampKind: 'CAPTURE_ATTEMPT', sequence: 0, timestampUtc: stamp, receivedAtUtc: stamp, platform: 'UNKNOWN', processes: [], processError: error,
    samples: Object.entries(METRICS).map(([metricId, d]) => ({ sessionId, metricId, timestampUtc: stamp, value: null, unit: d.unit, source: 'UNKNOWN', sampleIntervalMs: intervalMs, validity: 'ERROR', captureError: error, lost: true, late: false, agentVersion: 'UNKNOWN', schemaVersion: EOE_SCHEMA_VERSION })) };
}
export function statistics(samples: TelemetrySample[]) {
  const values = samples.filter(s => s.validity === 'VALID' && !s.lost && s.value !== null && Number.isFinite(s.value)).map(s => s.value!).sort((a, b) => a - b);
  const n = values.length;
  const percentile = (p: number) => n ? values[Math.max(0, Math.ceil(p * n) - 1)] : null;
  return { count: n, missing: samples.length - n, min: n ? values[0] : null, max: n ? values[n - 1] : null, mean: n ? values.reduce((mean, value, index) => mean + (value - mean) / (index + 1), 0) : null, p50: percentile(.5), p95: percentile(.95) };
}
export class BoundedSeries {
  private items: { frame: RecordedFrame; bytes: number }[] = [];
  bytes = 0; evicted = 0;
  append(frame: RecordedFrame): void {
    const bytes = new TextEncoder().encode(JSON.stringify(frame)).byteLength;
    if (bytes > EOE_LIMITS.maxBytes) throw new Error('FRAME_BYTE_LIMIT');
    this.items.push({ frame, bytes }); this.bytes += bytes;
    const cutoff = Date.parse(frame.receivedAtUtc) - EOE_LIMITS.retentionMs;
    while (this.items.length > EOE_LIMITS.maxFrames || this.bytes > EOE_LIMITS.maxBytes || (this.items[0] && Date.parse(this.items[0].frame.receivedAtUtc) < cutoff)) {
      this.bytes -= this.items.shift()!.bytes; this.evicted++;
    }
  }
  frames(): RecordedFrame[] { return this.items.map(i => i.frame); }
  clear(): void { this.items = []; this.bytes = 0; this.evicted = 0; }
}
/** CSV uses explicit columns and guards spreadsheet formulas in every string field. */
export function exportCsv(frames: RecordedFrame[]): string {
  const columns: (keyof TelemetrySample)[] = ['sessionId', 'metricId', 'timestampUtc', 'value', 'unit', 'source', 'sampleIntervalMs', 'validity', 'captureError', 'lost', 'late', 'agentVersion', 'schemaVersion', 'counterEvidence'];
  const cell = (v: unknown) => { const text = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return '"' + (/^[\s]*[=+\-@]/.test(text) ? "'" : '') + text.replace(/"/g, '""') + '"'; };
  return [columns.join(','), ...frames.flatMap(f => f.samples.map(s => columns.map(k => cell(s[k])).join(',')))].join('\r\n');
}
