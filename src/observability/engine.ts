import { EOE_LIMITS, EOE_SCHEMA_VERSION, safeInterval } from '../../evo-agent/src/observabilityProtocol';
import { BoundedSeries, missingFrame, normalizeFrame, exportCsv, type RecordedFrame } from './series';
export interface EngineSnapshot {
  phase: 'idle' | 'running' | 'paused' | 'disconnected' | 'complete';
  running: boolean; sessionId: string | null; startedAtUtc: string | null; error: string | null;
  frames: RecordedFrame[]; retainedBytes: number; evictedFrames: number; captureIntervalMs: number; renderIntervalMs: number;
  pollWorkMs: number | null;
}
export type TelemetryTransport = (signal: AbortSignal) => Promise<unknown>;
/** One collection owner; consumers subscribe to the same bounded, ephemeral recording. */
export class ObservabilityEngine {
  private series = new BoundedSeries();
  private listeners = new Set<() => void>();
  private controller: AbortController | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private renderTimer: ReturnType<typeof setTimeout> | null = null;
  private generation = 0;
  private lastAgentId: string | null = null;
  private lastSequence = 0;
  private lastCaptureAt: number | null = null;
  private state: EngineSnapshot = { phase: 'idle', running: false, sessionId: null, startedAtUtc: null, error: null, frames: [], retainedBytes: 0, evictedFrames: 0, captureIntervalMs: EOE_LIMITS.defaultIntervalMs, renderIntervalMs: 1000, pollWorkMs: null };
  constructor(private transport: TelemetryTransport) {}
  snapshot = (): EngineSnapshot => this.state;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); if (!this.listeners.size) this.pause('VIEW_CLOSED'); };
  };
  private publish(immediate = false): void {
    const emit = () => { this.renderTimer = null; this.state = { ...this.state, frames: this.series.frames(), retainedBytes: this.series.bytes, evictedFrames: this.series.evicted }; this.listeners.forEach(f => f()); };
    if (immediate) { if (this.renderTimer) clearTimeout(this.renderTimer); emit(); }
    else if (!this.renderTimer) this.renderTimer = setTimeout(emit, this.state.renderIntervalMs);
  }
  configure(captureMs: number, renderMs: number): void {
    const wasRunning = this.state.running;
    this.cancel();
    this.state = { ...this.state, captureIntervalMs: safeInterval(captureMs), renderIntervalMs: Number.isFinite(renderMs) ? Math.max(500, Math.min(5000, Math.round(renderMs))) : 1000 };
    this.publish(true);
    if (wasRunning) void this.poll(this.generation);
  }
  start(): void {
    this.cancel(); this.series.clear(); this.lastAgentId = null; this.lastSequence = 0; this.lastCaptureAt = null;
    this.state = { ...this.state, sessionId: crypto.randomUUID(), startedAtUtc: new Date().toISOString(), phase: 'running', running: true, error: null, pollWorkMs: null };
    this.publish(true); void this.poll(this.generation);
  }
  resume(): void {
    if (!this.state.sessionId) { this.start(); return; }
    this.cancel(); this.lastCaptureAt = null; this.state = { ...this.state, running: true, phase: 'running', error: null };
    this.publish(true); void this.poll(this.generation);
  }
  pause(reason: string | null = null): void {
    this.cancel();
    if (!this.state.sessionId) return;
    this.state = { ...this.state, running: false, phase: this.state.phase === 'complete' ? 'complete' : 'paused', error: reason };
    this.publish(true);
  }
  end(): void { this.pause(); this.state = { ...this.state, phase: 'complete' }; this.publish(true); }
  clear(): void {
    this.cancel(); this.series.clear(); this.lastAgentId = null; this.lastSequence = 0; this.lastCaptureAt = null;
    this.state = { ...this.state, running: false, phase: 'idle', sessionId: null, startedAtUtc: null, error: null };
    this.publish(true);
  }
  private cancel(): void {
    this.generation++; this.controller?.abort(); this.controller = null;
    if (this.timer) clearTimeout(this.timer); this.timer = null;
    if (this.renderTimer) clearTimeout(this.renderTimer); this.renderTimer = null;
  }
  private async poll(generation: number): Promise<void> {
    if (!this.state.running || generation !== this.generation || !this.state.sessionId) return;
    const controller = new AbortController(); this.controller = controller;
    const started = performance.now();
    let nextDelay = this.state.captureIntervalMs;
    try {
      const raw = await this.transport(controller.signal);
      if (controller.signal.aborted || generation !== this.generation) return;
      const workStart = performance.now();
      const frame = normalizeFrame(raw, this.state.sessionId, this.state.captureIntervalMs);
      if (frame.agentSessionId !== this.lastAgentId) { this.lastAgentId = frame.agentSessionId; this.lastSequence = 0; this.lastCaptureAt = null; }
      if (frame.sequence > this.lastSequence) {
        const captureAt = Date.parse(frame.timestampUtc);
        // A shared collector may advance its sequence for other readers; that alone is not lost data.
        if (this.lastCaptureAt !== null && captureAt <= this.lastCaptureAt) throw new Error('OUT_OF_ORDER_CAPTURE_TIMESTAMP');
        if (this.lastCaptureAt !== null && captureAt - this.lastCaptureAt > this.state.captureIntervalMs * 1.5) {
          this.series.append(missingFrame(this.state.sessionId, 'CAPTURE_INTERVAL_GAP', this.state.captureIntervalMs, this.lastCaptureAt + this.state.captureIntervalMs));
          frame.samples.forEach(s => { s.late = true; });
        }
        this.lastCaptureAt = captureAt;
        this.series.append(frame); this.lastSequence = frame.sequence;
      } else if (frame.sequence < this.lastSequence) throw new Error('OUT_OF_ORDER_FRAME');
      this.state = { ...this.state, phase: 'running', error: null, pollWorkMs: performance.now() - workStart };
    } catch (error) {
      if (controller.signal.aborted || generation !== this.generation) return;
      const message = error instanceof Error ? error.message : 'CAPTURE_FAILED';
      this.series.append(missingFrame(this.state.sessionId!, message, this.state.captureIntervalMs));
      this.lastCaptureAt = null; // The explicit error record already marks this discontinuity.
      const mustPair = /PAIRING_REQUIRED|AGENT_UPDATE_REQUIRED|PLATFORM_NOT_SUPPORTED/.test(message);
      this.state = { ...this.state, phase: mustPair ? 'paused' : 'disconnected', running: !mustPair, error: message };
      nextDelay = Math.min(10000, Math.max(3000, this.state.captureIntervalMs * 2));
    } finally {
      if (generation === this.generation) {
        this.controller = null; this.publish();
        if (this.state.running) {
          const elapsed = performance.now() - started;
          // Leave a recovery interval after a slow capture; never queue or hammer a failing provider.
          this.timer = setTimeout(() => void this.poll(generation), Math.max(250, nextDelay - elapsed, Math.min(elapsed, 5000)));
        }
      }
    }
  }
  export(format: 'json' | 'csv'): string {
    const frames = this.series.frames();
    return format === 'csv' ? exportCsv(frames) : JSON.stringify({ schemaVersion: EOE_SCHEMA_VERSION, sessionId: this.state.sessionId, startedAtUtc: this.state.startedAtUtc, exportedAtUtc: new Date().toISOString(), retention: { maxFrames: EOE_LIMITS.maxFrames, maxBytes: EOE_LIMITS.maxBytes, maxAgeMs: EOE_LIMITS.retentionMs, evictedFrames: this.series.evicted }, frames }, null, 2);
  }
}
