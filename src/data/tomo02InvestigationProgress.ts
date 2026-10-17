import type { WindowsInvestigation } from './tomo02Investigations';
export interface InvestigationEvidence {
  check: number | null; challenge: string | null; note: string;
  provenance: 'SIMULATED' | 'USER_DECLARED';
}
export const missionFields = ['context','hypothesis','baseline','test','result','rollback'] as const;
export type MissionRecord = Record<typeof missionFields[number],string>;
export const emptyMissionRecord = (): MissionRecord => ({context:'',hypothesis:'',baseline:'',test:'',result:'',rollback:''});
export function missionRecordComplete(record: MissionRecord): boolean {
  return missionFields.every(field=>record[field].trim().length>=10);
}
export interface InvestigationReaderProgress {
  activeId: string; tab: 'reader' | 'mission' | 'test';
  evidence: Record<string, InvestigationEvidence>;
  testAnswers: Record<number, number>; testSubmitted: boolean; mission: MissionRecord;
}
export const emptyInvestigationEvidence = (): InvestigationEvidence => ({check:null,challenge:null,note:'',provenance:'SIMULATED'});
export function investigationComplete(inv: WindowsInvestigation, evidence?: InvestigationEvidence): boolean {
  return !!evidence && inv.check.choices[evidence.check ?? -1]?.correct === true &&
    inv.microdesafio.options?.find(option => option.id === evidence.challenge)?.isCorrect === true && evidence.note.trim().length >= 20;
}
export function parseReaderProgress(raw: string | null, investigations: WindowsInvestigation[]): InvestigationReaderProgress {
  let saved: Partial<InvestigationReaderProgress> = {};
  try { saved = JSON.parse(raw || '{}') || {}; } catch { /* New schema never overwrites legacy evidence. */ }
  const evidence: Record<string, InvestigationEvidence> = {};
  for(const inv of investigations) {
    const item=saved.evidence?.[inv.id];
    if(item && typeof item==='object') evidence[inv.id]={
      check:Number.isInteger(item.check) && inv.check.choices[item.check!] ? item.check : null,
      challenge:inv.microdesafio.options?.some(option=>option.id===item.challenge) ? item.challenge : null,
      note:typeof item.note==='string' ? item.note : '', provenance:item.provenance==='USER_DECLARED' ? 'USER_DECLARED':'SIMULATED',
    };
  }
  const mission=emptyMissionRecord();
  for(const field of missionFields) if(typeof saved.mission?.[field]==='string')mission[field]=saved.mission[field];
  return {mission,activeId:investigations.some(inv=>inv.id===saved.activeId) ? saved.activeId! : investigations[0].id,
    tab:saved.tab==='mission'||saved.tab==='test' ? saved.tab:'reader',evidence,
    testAnswers:saved.testAnswers && typeof saved.testAnswers==='object' ? saved.testAnswers:{}, testSubmitted:saved.testSubmitted===true};
}
