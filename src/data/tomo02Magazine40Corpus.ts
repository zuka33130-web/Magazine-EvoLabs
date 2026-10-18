import { EVO_WINDOWS40_CORPUS_A } from './tomo02Magazine40CorpusA';
import { EVO_WINDOWS40_CORPUS_B } from './tomo02Magazine40CorpusB';
import { EVO_WINDOWS40_CORPUS_C } from './tomo02Magazine40CorpusC';
import { EVO_WINDOWS40_CORPUS_D } from './tomo02Magazine40CorpusD';
import { EVO_WINDOWS40_CORPUS_E } from './tomo02Magazine40CorpusE';
import type { EvoWindowsResearch } from './tomo02Magazine40CorpusTypes';

/** Biblioteca editorial 002–040. Investigación 001 mantiene manuscrito propio. */
export const EVO_WINDOWS40_RESEARCH: readonly EvoWindowsResearch[] = [
  ...EVO_WINDOWS40_CORPUS_A,
  ...EVO_WINDOWS40_CORPUS_B,
  ...EVO_WINDOWS40_CORPUS_C,
  ...EVO_WINDOWS40_CORPUS_D,
  ...EVO_WINDOWS40_CORPUS_E,
];

if (
  EVO_WINDOWS40_RESEARCH.length !== 39 ||
  !EVO_WINDOWS40_RESEARCH.every((article,index) =>
    article.number === index+2 &&
    article.premise.length >= 2 &&
    article.mechanisms.length >= 2 &&
    article.traps.length >= 2 &&
    article.protocol.length >= 2 &&
    article.interpretation.length >= 2 &&
    article.conclusion.length >= 2 &&
    article.lab.code.trim().length >= 80 &&
    article.sources.length >= 2)
) {
  throw new Error('EVO LABS: integridad editorial incompleta. No publicar una edición parcial.');
}
