import os from 'node:os';
import { randomUUID } from 'node:crypto';
import { AgentTelemetryMetrics } from './types.js';
import { EOE_AGENT_VERSION, EOE_SCHEMA_VERSION, METRICS, safeInterval, type TelemetrySample, type ObservabilityFrame } from './observabilityProtocol.js';
import { readWindowsCounters, averageTimerMs, type WindowsCounterResult } from './windowsTelemetry.js';

export class AgentTelemetryManager {
  private isSamplingActive = false;
  private samplingInterval: NodeJS.Timeout | null = null;
  private lastCpus: ReturnType<typeof os.cpus> | null = null;
  private lastAt: number | null = null;
  private lastProcessCpu: NodeJS.CpuUsage | null = null;
  private previousDisk: WindowsCounterResult['disk'];
  private inFlight: Promise<AgentTelemetryMetrics> | null = null;
  private cached: AgentTelemetryMetrics | null = null;
  private cacheAt = -Infinity;
  private sessionId = randomUUID();
  private sequence = 0;
  private intervalMs = 2000;
  private lastRequestAt = performance.now();

  /** One coalesced capture for every consumer, including the legacy sampler. */
  public getLiveMetrics(): Promise<AgentTelemetryMetrics> {
    this.lastRequestAt = performance.now();
    if (this.inFlight) return this.inFlight;
    if (this.cached && performance.now() - this.cacheAt < 1000) return Promise.resolve(this.cached);
    this.inFlight = this.capture().then(frame => { this.cached = frame; this.cacheAt = performance.now(); return frame; }).finally(() => { this.inFlight = null; });
    return this.inFlight;
  }

  private async capture(): Promise<AgentTelemetryMetrics> {
    const at = performance.now();
    const timestamp = new Date().toISOString();
    if (this.lastAt !== null && at - this.lastAt > 15000) { this.lastCpus = null; this.lastProcessCpu = null; this.lastAt = null; this.previousDisk = undefined; }
    const sampleIntervalMs = this.lastAt === null ? this.intervalMs : at - this.lastAt;
    const cpus = os.cpus();
    const ownCpu = process.cpuUsage();
    const native = process.platform === 'win32';
    const latencyEvidence = new Map<string, NonNullable<TelemetrySample['counterEvidence']>>();
    const values = new Map<string, { value: number | null; error: string | null; timestamp: string; interval: number }>();
    const number = (v: unknown): number | null => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
    const put = (id: string, value: unknown, error: string | null = null, stamp = timestamp) => values.set(id, { value: number(value), error, timestamp: stamp, interval: sampleIntervalMs });
    const utilization = (previous: typeof cpus[number]['times'] | undefined, current: typeof cpus[number]['times']): number | null => {
      if (!previous) return null;
      const total = Object.values(current).reduce((a, b) => a + b, 0) - Object.values(previous).reduce((a, b) => a + b, 0);
      const idle = current.idle - previous.idle;
      return total > 0 && idle >= 0 && idle <= total ? (total - idle) / total * 100 : null;
    };
    const sum = (data: typeof cpus) => data.reduce((a, c) => ({ user: a.user + c.times.user, nice: a.nice + c.times.nice, sys: a.sys + c.times.sys, idle: a.idle + c.times.idle, irq: a.irq + c.times.irq }), { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 });
    const totalCpu = cpus.length && (!this.lastCpus || cpus.length === this.lastCpus.length) ? utilization(this.lastCpus ? sum(this.lastCpus) : undefined, sum(cpus)) : null;
    put('cpu.total', totalCpu, totalCpu === null ? 'CPU_DELTA_WARMUP_OR_COUNTER_RESET' : null);
    cpus.slice(0, 256).forEach((cpu, i) => {
      const value = utilization(this.lastCpus?.[i]?.times, cpu.times);
      put(`cpu.logical.${i}`, value, value === null ? 'CPU_DELTA_WARMUP_OR_COUNTER_RESET' : null);
    });
    const total = os.totalmem(), free = os.freemem(), used = total - free;
    put('memory.physical', total); put('memory.available', free); put('memory.used', used);
    put('memory.pressure', total > 0 && used >= 0 ? used / total * 100 : null);
    put('agent.cpu', this.lastProcessCpu && this.lastAt !== null && sampleIntervalMs > 0 ? ((ownCpu.user - this.lastProcessCpu.user) + (ownCpu.system - this.lastProcessCpu.system)) / (sampleIntervalMs * 1000) * 100 : null, this.lastProcessCpu ? null : 'CPU_DELTA_WARMUP');
    put('agent.rss', process.memoryUsage().rss);
    this.lastAt = at; this.lastCpus = cpus; this.lastProcessCpu = ownCpu;

    const counterStart = performance.now();
    const windows = await readWindowsCounters();
    const counterEnd = new Date().toISOString();
    const counterTimestamp = windows.timestampUtc && Number.isFinite(Date.parse(windows.timestampUtc)) ? new Date(windows.timestampUtc).toISOString() : counterEnd;
    const captured = (id: string, value: unknown, error?: string) => put(id, value, windows.error || error || (number(value) === null ? 'COUNTER_UNAVAILABLE' : null), counterTimestamp);
    captured('memory.committed', windows.memory?.committed, windows.memoryError);
    captured('memory.commitLimit', windows.memory?.limit, windows.memoryError);
    const idle = number(windows.disk?.idle);
    captured('disk.activity', idle !== null && idle <= 100 ? 100 - idle : null, windows.diskError);
    captured('disk.read', windows.disk?.read, windows.diskError);
    captured('disk.write', windows.disk?.write, windows.diskError);
    for (const direction of ['read', 'write'] as const) {
      const ticks = direction === 'read' ? 'readTicks' : 'writeTicks', base = direction === 'read' ? 'readBase' : 'writeBase';
      const latency = windows.disk && this.previousDisk && windows.disk.frequency === this.previousDisk.frequency ? averageTimerMs(windows.disk[ticks], windows.disk[base], this.previousDisk[ticks], this.previousDisk[base], windows.disk.frequency) : null;
      if (latency !== null && windows.disk && this.previousDisk) latencyEvidence.set(`disk.${direction}Latency`, { startTicks: String(this.previousDisk[ticks]), endTicks: String(windows.disk[ticks]), startBase: String(this.previousDisk[base]), endBase: String(windows.disk[base]), frequencyHz: String(windows.disk.frequency) });
      captured(`disk.${direction}Latency`, latency, windows.diskError || (latency === null ? 'LATENCY_REQUIRES_TWO_VALID_COUNTERS_AND_COMPLETED_IO' : undefined));
    }
    this.previousDisk = windows.disk;
    for (const [direction, field] of [['receive', 'receive'], ['send', 'send']] as const) {
      const interfaces = windows.network;
      const rates = interfaces?.map(n => number(n[field]));
      const valid = !windows.networkError && rates && rates.length > 0 && rates.every(v => v !== null);
      captured(`network.${direction}`, valid ? rates.reduce((sum, v) => sum + v!, 0) : null, windows.networkError || (!valid ? 'NO_VALID_NETWORK_INTERFACES' : undefined));
    }
    put('collector.duration', performance.now() - counterStart, null, counterEnd);
    captured('collector.cpuTime', windows.collector?.cpuTimeMs);
    captured('collector.rss', windows.collector?.rss);

    const samples: TelemetrySample[] = [...values.entries()].map(([metricId, reading]) => {
      const definition = METRICS[metricId] || { unit: '%' as const, source: 'node:os.cpus/windows-logical-times-delta' };
      const unavailable = !native ? 'PLATFORM_NOT_SUPPORTED: se requiere Windows nativo' : reading.error;
      const value = unavailable ? null : reading.value;
      return { ...(value !== null && latencyEvidence.has(metricId) ? { counterEvidence: latencyEvidence.get(metricId) } : {}), sessionId: this.sessionId, metricId, timestampUtc: reading.timestamp, value, unit: definition.unit, source: definition.source, sampleIntervalMs: reading.interval, validity: value !== null ? 'VALID' : unavailable?.includes('WARMUP') ? 'WARMUP' : 'UNKNOWN', captureError: unavailable || (value === null ? 'COUNTER_UNAVAILABLE' : null), lost: false, late: this.isSamplingActive && sampleIntervalMs > this.intervalMs * 1.5, agentVersion: EOE_AGENT_VERSION, schemaVersion: EOE_SCHEMA_VERSION };
    });
    const observability: ObservabilityFrame = {
      schemaVersion: EOE_SCHEMA_VERSION, agentVersion: EOE_AGENT_VERSION, sessionId: this.sessionId, sequence: ++this.sequence,
      timestampUtc: counterEnd, platform: process.platform, samples,
      processes: native ? (windows.processes || []).slice(0, 10).filter(p => Number.isInteger(p.pid) && p.pid > 0 && typeof p.name === 'string').map(p => ({ pid: p.pid, name: p.name.slice(0, 120), cpuPercent: number(p.cpuPercent), workingSetBytes: number(p.workingSetBytes) })) : [],
      processError: windows.error || windows.processError || (!windows.processes?.length ? 'PROCESS_COUNTER_UNAVAILABLE' : null),
    };
    return {
      timestamp, cpu: { utilizationPercent: totalCpu, clockSpeedMhz: cpus[0]?.speed || undefined, provenance: totalCpu === null ? 'UNKNOWN' : 'DERIVED' },
      memory: { totalBytes: total, usedBytes: used, freeBytes: free, utilizationPercent: total > 0 ? used / total * 100 : 0, provenance: 'SYSTEM_REPORTED' },
      process: { agentRssBytes: process.memoryUsage().rss, agentHeapUsedBytes: process.memoryUsage().heapUsed, agentUptimeSeconds: Math.floor(process.uptime()) },
      isSamplingActive: this.isSamplingActive, observability,
    };
  }

  public startSampling(intervalMs = 2000): { status: string; intervalMs: number } {
    this.intervalMs = safeInterval(intervalMs);
    this.lastRequestAt = performance.now();
    if (this.samplingInterval) clearInterval(this.samplingInterval);
    this.isSamplingActive = true;
    this.samplingInterval = setInterval(() => {
      if (performance.now() - this.lastRequestAt > 15000) { this.stopSampling(); return; }
      const requestedAt = this.lastRequestAt;
      void this.getLiveMetrics().catch(() => undefined);
      this.lastRequestAt = requestedAt; // Background captures must not renew the consumer lease.
    }, this.intervalMs);
    this.samplingInterval.unref();
    return { status: 'STARTED', intervalMs: this.intervalMs };
  }
  public stopSampling(): { status: string } {
    if (this.samplingInterval) clearInterval(this.samplingInterval);
    this.samplingInterval = null; this.isSamplingActive = false;
    return { status: 'STOPPED' };
  }
}
