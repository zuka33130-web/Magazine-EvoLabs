// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — PSU STRESS & POWER MODEL
// Rigorous DC Load & Transient Headroom Model with Age Risk Weighting
// Principle: "LA EDAD ES UN FACTOR DE RIESGO COADYUVANTE, NO UNA FALLA CONFIRMADA."
// ============================================================================

import { Machine } from '../../types';

export interface PsuStressAnalysis {
  estimatedSystemLoadW: number;
  psuRatedPowerW: number;
  powerHeadroomW: number;
  powerHeadroomPct: number;
  efficiencyPct: number;
  wallAcPowerDrawW: number;
  transientSpikeHeadroomW: number;
  ageYears?: number;
  ageRiskFactor: 'NONE' | 'LOW' | 'MODERATE' | 'ELEVATED';
  stressState: 'OPTIMAL' | 'MODERATE' | 'HEAVY' | 'CRITICAL_HEADROOM';
  summaryRationaleEs: string;
}

export class PSUStressModel {
  /**
   * Calculates total system DC draw and evaluates PSU margin against transient spikes and operational age.
   */
  static evaluate(
    machine: Machine,
    cpuLoadPct: number,
    gpuLoadPct: number,
    userEnteredAgeYears?: number
  ): PsuStressAnalysis {
    const psuRatedW = Math.max(300, machine.psu.wattageW || 650);

    // 1. CPU DC Power
    const cpuTdp = machine.cpu.tdpW || 65;
    const cpuPeak = cpuTdp > 65 ? cpuTdp * 1.8 : 120;
    const cpuWatts = 15 + (cpuPeak - 15) * Math.pow(cpuLoadPct / 100, 1.25);

    // 2. GPU DC Power
    const isDedicated = machine.gpu.isDedicated;
    const gpuTgp = isDedicated ? (machine.gpu.powerW || 200) : 15;
    const gpuWatts = isDedicated
      ? 14 + (gpuTgp - 14) * Math.pow(gpuLoadPct / 100, 1.3)
      : 8 + 15 * (gpuLoadPct / 100);

    // 3. Motherboard, RAM, Storage, Fans, RGB DC Power
    const ramSticksCount = machine.ram.channels || 2;
    const ramWatts = ramSticksCount * 4.5;
    const nvmeWatts = machine.storage.type === 'NVMe M.2' ? 7.5 : 3.5;
    const chipsetAndBoardWatts = 30.0;
    const fansWatts = (machine.fans?.count || 2) * 3.0;

    const totalDCLoadW = Math.round(
      cpuWatts + gpuWatts + ramWatts + nvmeWatts + chipsetAndBoardWatts + fansWatts
    );

    // 4. Power Headroom
    const headroomW = psuRatedW - totalDCLoadW;
    const headroomPct = Math.round((headroomW / psuRatedW) * 100);

    // 5. Transient Spike Margin (ATX 3.1 200% spike tolerance vs older ATX 2.4)
    const expectedGpuTransientW = isDedicated ? gpuTgp * 1.5 : 0;
    const transientSpikeHeadroomW = Math.round(psuRatedW - (totalDCLoadW + expectedGpuTransientW * 0.5));

    // 6. Age Risk Factor (Without diagnosing premature failure)
    const ageYears = userEnteredAgeYears !== undefined ? userEnteredAgeYears : undefined;
    let ageRiskFactor: 'NONE' | 'LOW' | 'MODERATE' | 'ELEVATED' = 'NONE';
    if (ageYears !== undefined) {
      if (ageYears >= 8) ageRiskFactor = 'ELEVATED';
      else if (ageYears >= 5) ageRiskFactor = 'MODERATE';
      else if (ageYears >= 3) ageRiskFactor = 'LOW';
    }

    // 7. Stress State
    let stressState: 'OPTIMAL' | 'MODERATE' | 'HEAVY' | 'CRITICAL_HEADROOM' = 'OPTIMAL';
    if (headroomW < 50 || headroomPct < 10) {
      stressState = 'CRITICAL_HEADROOM';
    } else if (headroomPct < 22) {
      stressState = 'HEAVY';
    } else if (headroomPct < 40) {
      stressState = 'MODERATE';
    }

    // 8. Efficiency (80 PLUS Gold/Platinum typical ~90%)
    const efficiencyPct = 90.0;
    const wallAcPowerDrawW = Math.round(totalDCLoadW / (efficiencyPct / 100));

    let summaryRationaleEs = `Carga continua estimada de ~${totalDCLoadW}W frente a ${psuRatedW}W nominales (margen disponible: ${headroomW}W / ${headroomPct}%).`;
    if (stressState === 'CRITICAL_HEADROOM' || stressState === 'HEAVY') {
      summaryRationaleEs += ` El margen ante picos transitorios es estrecho.`;
    }
    if (ageRiskFactor === 'MODERATE' || ageRiskFactor === 'ELEVATED') {
      summaryRationaleEs += ` Con ${ageYears} años de uso declarados, se recomienda verificar estabilidad de voltajes en raíles de 12V bajo carga pesada.`;
    }

    return {
      estimatedSystemLoadW: totalDCLoadW,
      psuRatedPowerW: psuRatedW,
      powerHeadroomW: headroomW,
      powerHeadroomPct: headroomPct,
      efficiencyPct,
      wallAcPowerDrawW,
      transientSpikeHeadroomW,
      ageYears,
      ageRiskFactor,
      stressState,
      summaryRationaleEs,
    };
  }
}
