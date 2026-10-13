import { ExamBank } from '../types';
import { TOMO_01_EXAM_BANK } from './tomo01ExamData';
import { TOMO_02_EXAM_BANK } from './tomo02ExamData';
import { TOMO_03_EXAM_BANK } from './tomo03ExamData';
import { TOMO_04_EXAM_BANK } from './tomo04ExamData';
import { TOMO_05_EXAM_BANK } from './tomo05ExamData';
import { TOMO_06_EXAM_BANK } from './tomo06ExamData';
import { TOMO_07_EXAM_BANK } from './tomo07ExamData';
import { TOMO_08_EXAM_BANK } from './tomo08ExamData';
import { TOMO_09_EXAM_BANK } from './tomo09ExamData';
import { TOMO_10_EXAM_BANK } from './tomo10ExamData';
import { TOMO_11_EXAM_BANK } from './tomo11ExamData';
import { TOMO_12_EXAM_BANK } from './tomo12ExamData';

export const ALL_EXAM_BANKS: Record<string, ExamBank> = {
  'tomo-01': TOMO_01_EXAM_BANK,
  '01': TOMO_01_EXAM_BANK,
  'tomo-02': TOMO_02_EXAM_BANK,
  '02': TOMO_02_EXAM_BANK,
  'tomo-03': TOMO_03_EXAM_BANK,
  '03': TOMO_03_EXAM_BANK,
  'tomo-04': TOMO_04_EXAM_BANK,
  '04': TOMO_04_EXAM_BANK,
  'tomo-05': TOMO_05_EXAM_BANK,
  '05': TOMO_05_EXAM_BANK,
  'tomo-06': TOMO_06_EXAM_BANK,
  '06': TOMO_06_EXAM_BANK,
  'tomo-07': TOMO_07_EXAM_BANK,
  '07': TOMO_07_EXAM_BANK,
  'tomo-08': TOMO_08_EXAM_BANK,
  '08': TOMO_08_EXAM_BANK,
  'tomo-09': TOMO_09_EXAM_BANK,
  '09': TOMO_09_EXAM_BANK,
  'tomo-10': TOMO_10_EXAM_BANK,
  '10': TOMO_10_EXAM_BANK,
  'tomo-11': TOMO_11_EXAM_BANK,
  '11': TOMO_11_EXAM_BANK,
  'tomo-12': TOMO_12_EXAM_BANK,
  '12': TOMO_12_EXAM_BANK,
};

export function getExamBankForTomo(tomoId: string): ExamBank | null {
  const cleanId = tomoId.toLowerCase().replace('tomo-', '');
  return ALL_EXAM_BANKS[tomoId] || ALL_EXAM_BANKS[cleanId] || null;
}

