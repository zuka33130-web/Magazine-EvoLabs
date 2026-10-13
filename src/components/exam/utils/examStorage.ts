import { ExamAttemptRecord } from '../types';

const STORAGE_KEY_EXAM_HISTORY_PREFIX = 'evo_labs_exam_history_';
const STORAGE_KEY_GLOBAL_RECORDS = 'evo_labs_exam_records_v1';
const STORAGE_KEY_PASSED_TOMO_PREFIX = 'evo_labs_tomo_theory_verified_';

export function getExamHistory(tomoId: string): ExamAttemptRecord[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_EXAM_HISTORY_PREFIX}${tomoId}`);
    if (!raw) return [];
    return JSON.parse(raw) as ExamAttemptRecord[];
  } catch (err) {
    console.error(`Error loading exam history for ${tomoId}:`, err);
    return [];
  }
}

export function saveExamAttempt(attempt: ExamAttemptRecord): void {
  try {
    const existing = getExamHistory(attempt.tomoId);
    const updated = [attempt, ...existing];
    localStorage.setItem(
      `${STORAGE_KEY_EXAM_HISTORY_PREFIX}${attempt.tomoId}`,
      JSON.stringify(updated)
    );

    // If passed, mark theory verified
    if (attempt.passed) {
      localStorage.setItem(`${STORAGE_KEY_PASSED_TOMO_PREFIX}${attempt.tomoId}`, 'true');
      localStorage.setItem(`evo_theory_verified_${attempt.tomoNumber}`, 'true');
    }

    // Also update global summary list
    const globalRaw = localStorage.getItem(STORAGE_KEY_GLOBAL_RECORDS);
    const globalRecords: Record<string, ExamAttemptRecord> = globalRaw ? JSON.parse(globalRaw) : {};
    
    // Keep the best attempt or latest passed attempt in global records
    const previousBest = globalRecords[attempt.tomoId];
    if (!previousBest || attempt.score >= previousBest.score) {
      globalRecords[attempt.tomoId] = attempt;
      localStorage.setItem(STORAGE_KEY_GLOBAL_RECORDS, JSON.stringify(globalRecords));
    }
  } catch (err) {
    console.error('Error saving exam attempt:', err);
  }
}

export function isTomoTheoryVerified(tomoId: string, tomoNumber?: string): boolean {
  try {
    const byId = localStorage.getItem(`${STORAGE_KEY_PASSED_TOMO_PREFIX}${tomoId}`) === 'true';
    if (byId) return true;
    if (tomoNumber) {
      return localStorage.getItem(`evo_theory_verified_${tomoNumber}`) === 'true';
    }
    return false;
  } catch {
    return false;
  }
}

export function getLatestAttempt(tomoId: string): ExamAttemptRecord | null {
  const history = getExamHistory(tomoId);
  return history.length > 0 ? history[0] : null;
}

export function getBestAttempt(tomoId: string): ExamAttemptRecord | null {
  const history = getExamHistory(tomoId);
  if (history.length === 0) return null;
  return history.reduce((best, curr) => (curr.percentage > best.percentage ? curr : best), history[0]);
}
