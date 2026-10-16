import { useEffect, useMemo, useState } from 'react';
import type { SetStateAction } from 'react';

export type LegacySectorStatus = 'not_started' | 'in_progress' | 'completed';
export interface LegacySectorSnapshot {
  schema: 1;
  completed: string[];
  mission: boolean;
  testScore: number | null;
}
const keyFor = (sector: string) => `evo_tomo02_legacy_sector_${sector}_v1`;
const empty = (): LegacySectorSnapshot => ({ schema: 1, completed: [], mission: false, testScore: null });

function restore(sector: string, ids: string[]): LegacySectorSnapshot {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(keyFor(sector)) || 'null');
    if (!parsed || typeof parsed !== 'object') return empty();
    const raw = parsed as Partial<LegacySectorSnapshot>;
    if (raw.schema !== 1) return empty();
    const allowed = new Set(ids);
    const completed = Array.isArray(raw.completed)
      ? [...new Set(raw.completed.filter((id): id is string => typeof id === 'string' && allowed.has(id)))]
      : [];
    const score = raw.testScore;
    return {
      schema: 1,
      completed,
      mission: raw.mission === true,
      testScore: typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 100 ? score : null,
    };
  } catch {
    return empty();
  }
}

/**
 * Persists the established 00-10 learning contract.
 * 'completed' means all investigations, the actual learning mission,
 * and a passing test; it is NOT a claim of hardware telemetry verification.
 * Historical volatile state cannot be reconstructed and is never fabricated.
 */
export function useTomo02LegacySectorProgress(
  sector: string,
  validCodes: readonly string[],
  passingPercent: number,
  onProgress?: (id: string, status: LegacySectorStatus) => void,
) {
  const idsKey = validCodes.join('|');
  const valid = useMemo(() => new Set(validCodes), [idsKey]);
  const [record, setRecord] = useState<LegacySectorSnapshot>(() => restore(sector, [...validCodes]));
  const completed = useMemo(() => record.completed.filter(id => valid.has(id)), [record.completed, valid]);
  const complete = valid.size > 0 && completed.length === valid.size && record.mission &&
    record.testScore !== null && record.testScore >= passingPercent;
  const started = completed.length > 0 || record.mission || record.testScore !== null;
  const status: LegacySectorStatus = complete ? 'completed' : started ? 'in_progress' : 'not_started';

  useEffect(() => {
    try { localStorage.setItem(keyFor(sector), JSON.stringify({ ...record, completed })); }
    catch { /* Storage may be disabled; this is not a successful persisted write. */ }
    onProgress?.(`sector-${sector}`, status);
  }, [sector, record, completed, onProgress, status]);

  const setCompletedCodes = (update: SetStateAction<string[]>) => setRecord(previous => {
    const before = previous.completed.filter(code => valid.has(code));
    const after = typeof update === 'function' ? update(before) : update;
    return { ...previous, completed: [...new Set(after.filter(code => valid.has(code)))] };
  });
  const setCompletedRecords = (update: SetStateAction<Record<string, boolean>>) => setRecord(previous => {
    const before: Record<string, boolean> = Object.fromEntries(previous.completed.map(id => [id, true]));
    const after = typeof update === 'function' ? update(before) : update;
    return { ...previous, completed: Object.keys(after).filter(id => after[id] === true && valid.has(id)) };
  });
  const setMissionPassed = (mission: boolean) => setRecord(previous => ({ ...previous, mission }));
  const setTestScore = (testScore: number) => setRecord(previous => ({
    ...previous,
    testScore: Number.isFinite(testScore) && testScore >= 0 && testScore <= 100 ? testScore : previous.testScore,
  }));

  return {
    completedCodes: completed,
    completedRecords: useMemo(() => Object.fromEntries(completed.map(id => [id, true])) as Record<string, boolean>, [completed]),
    setCompletedCodes, setCompletedRecords,
    missionPassed: record.mission, setMissionPassed,
    testScore: record.testScore, setTestScore,
    status,
  };
}
