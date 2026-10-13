import { EvoCase, Machine } from '../types';

const STORAGE_KEY_CASES = 'evo_lab_core_cases_v1';
const STORAGE_KEY_ACTIVE_MACHINE = 'evo_lab_core_active_machine_v1';

export class EvoCaseRepository {
  /**
   * Retrieves all registered cases
   */
  static getAllCases(): EvoCase[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CASES);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('[EvoCaseRepository] Failed to read cases:', err);
      return [];
    }
  }

  /**
   * Retrieves a case by ID
   */
  static getCaseById(caseId: string): EvoCase | null {
    const cases = this.getAllCases();
    return cases.find((c) => c.id === caseId) || null;
  }

  /**
   * Saves or updates an EvoCase
   */
  static saveCase(evoCase: EvoCase): void {
    try {
      const cases = this.getAllCases();
      const existingIndex = cases.findIndex((c) => c.id === evoCase.id);
      const updatedCase: EvoCase = {
        ...evoCase,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        cases[existingIndex] = updatedCase;
      } else {
        cases.unshift(updatedCase);
      }

      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
    } catch (err) {
      console.warn('[EvoCaseRepository] Failed to save case:', err);
    }
  }

  /**
   * Gets the currently active machine in the lab
   */
  static getActiveMachine(): Machine | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_MACHINE);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.warn('[EvoCaseRepository] Failed to read active machine:', err);
      return null;
    }
  }

  /**
   * Sets the active machine in the lab
   */
  static setActiveMachine(machine: Machine): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_MACHINE, JSON.stringify(machine));
    } catch (err) {
      console.warn('[EvoCaseRepository] Failed to save active machine:', err);
    }
  }
}
