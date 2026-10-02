import { ExamBank } from '../types';
import { TOMO_01_EXAM_BANK } from './tomo01ExamData';
import { TOMO_02_EXAM_BANK } from './tomo02ExamData';
import { TOMO_03_EXAM_BANK } from './tomo03ExamData';
import { TOMO_04_EXAM_BANK } from './tomo04ExamData';
import { TOMO_08_EXAM_BANK } from './tomo08ExamData';

export const TOMO_05_EXAM_BANK_PLACEHOLDER: ExamBank = {
  tomoId: 'tomo-05',
  tomoNumber: '05',
  tomoTitle: 'REDES',
  tomoTagline: 'Entendé cómo se comunica tu PC y cómo viaja Internet.',
  accentColor: '#06B6D4',
  secondaryColor: '#0891B2',
  passingScorePercent: 70,
  questionsPerAttempt: 15,
  isUnderDevelopment: true,
  developmentNote:
    'El banco de preguntas técnicas para el Tomo 05 (Pila OSI/TCP-IP, Wireshark, enrutamiento, subredes CIDR y auditoría de paquetes) se encuentra actualmente en fase de redacción pericial y validación de laboratorio.',
  questions: [],
};

export const TOMO_06_EXAM_BANK_PLACEHOLDER: ExamBank = {
  tomoId: 'tomo-06',
  tomoNumber: '06',
  tomoTitle: 'CIBERSEGURIDAD',
  tomoTagline: 'Desde cero hasta dominar tu red.',
  accentColor: '#EF4444',
  secondaryColor: '#DC2626',
  passingScorePercent: 70,
  questionsPerAttempt: 15,
  isUnderDevelopment: true,
  developmentNote:
    'El banco de preguntas periciales para el Tomo 06 (Análisis de vectores de ataque, hardening de sistemas, criptografía aplicada y defensa en profundidad) se habilitará junto con la publicación de los módulos interactivos correspondientes.',
  questions: [],
};

export const TOMO_07_EXAM_BANK_PLACEHOLDER: ExamBank = {
  tomoId: 'tomo-07',
  tomoNumber: '07',
  tomoTitle: 'GAMING PRO',
  tomoTagline: 'Optimizamos de verdad. Sin secretos.',
  accentColor: '#F59E0B',
  secondaryColor: '#D97706',
  passingScorePercent: 70,
  questionsPerAttempt: 15,
  isUnderDevelopment: true,
  developmentNote:
    'El banco de evaluación para el Tomo 07 (Metrología de frametimes, percentiles 0.1% low, latencia de render y optimización competitiva) está en desarrollo.',
  questions: [],
};

export const TOMO_09_EXAM_BANK_PLACEHOLDER: ExamBank = {
  tomoId: 'tomo-09',
  tomoNumber: '09',
  tomoTitle: 'SISTEMAS Y KERNEL',
  tomoTagline: 'Entendé qué pasa debajo del sistema operativo.',
  accentColor: '#38BDF8',
  secondaryColor: '#0284C7',
  passingScorePercent: 70,
  questionsPerAttempt: 15,
  isUnderDevelopment: true,
  developmentNote:
    'El banco de preguntas avanzadas para el Tomo 09 (Arquitectura de kernels monolíticos vs híbridos, eBPF, cgroups, virtualización y gestión de memoria virtual) se encuentra en desarrollo editorial.',
  questions: [],
};

export const TOMO_10_EXAM_BANK_PLACEHOLDER: ExamBank = {
  tomoId: 'tomo-10',
  tomoNumber: '10',
  tomoTitle: 'FORENSE E INGENIERÍA INVERSA',
  tomoTagline: 'No mires sólo el resultado. Reconstruí lo que pasó.',
  accentColor: '#A855F7',
  secondaryColor: '#7C3AED',
  passingScorePercent: 70,
  questionsPerAttempt: 15,
  isUnderDevelopment: true,
  developmentNote:
    'El banco de evaluación forense para el Tomo 10 (Desensamblado x86/x64, análisis de binarios PE/ELF, adquisición de memoria volátil y trazabilidad de artefactos) está en preparación pericial.',
  questions: [],
};

export const ALL_EXAM_BANKS: Record<string, ExamBank> = {
  'tomo-01': TOMO_01_EXAM_BANK,
  '01': TOMO_01_EXAM_BANK,
  'tomo-02': TOMO_02_EXAM_BANK,
  '02': TOMO_02_EXAM_BANK,
  'tomo-03': TOMO_03_EXAM_BANK,
  '03': TOMO_03_EXAM_BANK,
  'tomo-04': TOMO_04_EXAM_BANK,
  '04': TOMO_04_EXAM_BANK,
  'tomo-05': TOMO_05_EXAM_BANK_PLACEHOLDER,
  '05': TOMO_05_EXAM_BANK_PLACEHOLDER,
  'tomo-06': TOMO_06_EXAM_BANK_PLACEHOLDER,
  '06': TOMO_06_EXAM_BANK_PLACEHOLDER,
  'tomo-07': TOMO_07_EXAM_BANK_PLACEHOLDER,
  '07': TOMO_07_EXAM_BANK_PLACEHOLDER,
  'tomo-08': TOMO_08_EXAM_BANK,
  '08': TOMO_08_EXAM_BANK,
  'tomo-09': TOMO_09_EXAM_BANK_PLACEHOLDER,
  '09': TOMO_09_EXAM_BANK_PLACEHOLDER,
  'tomo-10': TOMO_10_EXAM_BANK_PLACEHOLDER,
  '10': TOMO_10_EXAM_BANK_PLACEHOLDER,
};

export function getExamBankForTomo(tomoId: string): ExamBank | null {
  const cleanId = tomoId.toLowerCase().replace('tomo-', '');
  return ALL_EXAM_BANKS[tomoId] || ALL_EXAM_BANKS[cleanId] || null;
}
