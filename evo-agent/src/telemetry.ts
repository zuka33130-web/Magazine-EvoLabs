// ============================================================================
// EVO LOCAL AGENT — REAL-TIME TELEMETRY SAMPLER
// Protocol: EVO_LOCAL_AGENT_V1
// Principle: "LA COMPUTADORA SE MIDE EN VIVO. SIN FALLBACKS FICTICIOS."
// ============================================================================

import os from 'os';
import { AgentTelemetryMetrics } from './types.js';

export class AgentTelemetryManager {
  private isSamplingActive: boolean = false;
  private samplingInterval: NodeJS.Timeout | null = null;
  private lastCpuMeasure: { idle: number; total: number } | null = null;
  private currentCpuUtilization: number = 0;

  constructor() {
    this.takeCpuSnapshot();
  }

  /**
   * Samples current telemetry metrics without inventing data
   */
  public getLiveMetrics(): AgentTelemetryMetrics {
    const timestamp = new Date().toISOString();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = Math.max(0, totalMem - freeMem);
    const memUtilization = totalMem > 0 ? Number(((usedMem / totalMem) * 100).toFixed(1)) : 0;

    // Update CPU calculation
    this.updateCpuUtilization();

    const memUsage = process.memoryUsage();

    return {
      timestamp,
      cpu: {
        utilizationPercent: this.currentCpuUtilization,
        clockSpeedMhz: os.cpus()[0]?.speed || undefined,
        provenance: 'DERIVED',
      },
      memory: {
        totalBytes: totalMem,
        usedBytes: usedMem,
        freeBytes: freeMem,
        utilizationPercent: memUtilization,
        provenance: 'SYSTEM_REPORTED',
      },
      process: {
        agentRssBytes: memUsage.rss,
        agentHeapUsedBytes: memUsage.heapUsed,
        agentUptimeSeconds: Math.floor(process.uptime()),
      },
      isSamplingActive: this.isSamplingActive,
    };
  }

  public startSampling(intervalMs: number = 1000): { status: string; intervalMs: number } {
    if (this.isSamplingActive && this.samplingInterval) {
      return { status: 'ALREADY_ACTIVE', intervalMs };
    }

    this.isSamplingActive = true;
    this.samplingInterval = setInterval(() => {
      this.updateCpuUtilization();
    }, Math.max(500, intervalMs));

    return { status: 'STARTED', intervalMs };
  }

  public stopSampling(): { status: string } {
    if (this.samplingInterval) {
      clearInterval(this.samplingInterval);
      this.samplingInterval = null;
    }
    this.isSamplingActive = false;
    return { status: 'STOPPED' };
  }

  private takeCpuSnapshot(): { idle: number; total: number } {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }
      totalIdle += cpu.times.idle;
    }

    return { idle: totalIdle, total: totalTick };
  }

  private updateCpuUtilization(): void {
    const current = this.takeCpuSnapshot();
    if (!this.lastCpuMeasure) {
      this.lastCpuMeasure = current;
      this.currentCpuUtilization = 0;
      return;
    }

    const idleDifference = current.idle - this.lastCpuMeasure.idle;
    const totalDifference = current.total - this.lastCpuMeasure.total;

    if (totalDifference > 0) {
      const percentage = 100 - (100 * idleDifference) / totalDifference;
      this.currentCpuUtilization = Number(Math.max(0, Math.min(100, percentage)).toFixed(1));
    }

    this.lastCpuMeasure = current;
  }
}
