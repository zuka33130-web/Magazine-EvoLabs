import { AdvancedSectorContent, SectorLearningEvidence } from './tomo02AdvancedTypes';
export function isSectorEvidenceComplete(content: AdvancedSectorContent, evidence: SectorLearningEvidence): boolean {
  return evidence.decision !== null && content.decisions[evidence.decision]?.correct === true &&
    content.questions.every((question, index) => question.choices[evidence.answers[index]]?.correct === true) &&
    evidence.note.trim().length >= 20 && (content.number !== '39' || evidence.finalExperiment === true);
}
export function summarizeSeries(values: number[]) {
  if (values.length < 3 || values.some((value) => !Number.isFinite(value) || value < 0)) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return { median: sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2,
    min: sorted[0], max: sorted[sorted.length - 1], count: sorted.length };
}
export function compareSeries(before: number[], after: number[]) {
  const baseline = summarizeSeries(before), result = summarizeSeries(after);
  if (!baseline || !result || baseline.count !== result.count) return null;
  const delta = result.median - baseline.median;
  return { baseline, result, delta, percent: baseline.median === 0 ? null : delta / baseline.median * 100 };
}
