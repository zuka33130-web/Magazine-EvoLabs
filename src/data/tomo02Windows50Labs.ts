import { EVO_W50_LABS_A } from './tomo02Windows50LabsA';
import { EVO_W50_LABS_B } from './tomo02Windows50LabsB';
import { EVO_W50_LABS_C } from './tomo02Windows50LabsC';
import { EVO_W50_LABS_D } from './tomo02Windows50LabsD';
import { EVO_W50_LABS_E } from './tomo02Windows50LabsE';
import { EVO_WINDOWS_50_HEADLINES } from './tomo02Windows50';
import type { EvoWindowsFieldLab } from './tomo02Windows50LabTypes';

/**
 * Laboratorios en secuencia canónica 001–050.
 * No se ejecuta PowerShell ni se captura información del dispositivo del lector.
 */
export const EVO_WINDOWS_50_LABS: readonly EvoWindowsFieldLab[] = [
  ...EVO_W50_LABS_A,...EVO_W50_LABS_B,...EVO_W50_LABS_C,
  ...EVO_W50_LABS_D,...EVO_W50_LABS_E
];
if (EVO_WINDOWS_50_LABS.length !== 50 ||
  !EVO_WINDOWS_50_LABS.every((l,i) =>
    l.number === i + 1 &&
    Boolean(EVO_WINDOWS_50_HEADLINES[i]) &&
    l.discovery.length >= 80 && l.mechanism.length >= 80 &&
    l.experiment.length >= 3 && l.command.length >= 60 &&
    l.evidence.length >= 80 && l.pitfall.length >= 60 &&
    l.action.length >= 50 && l.recovery.length >= 10 &&
    l.references.length > 0 && l.reviewStatus === 'lab-verificable')) {
  throw new Error('EVO LABS: faltan laboratorios o garantías editoriales en 001–050');
}
