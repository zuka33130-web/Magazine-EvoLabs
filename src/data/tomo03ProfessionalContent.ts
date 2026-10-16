import type {ProfessionalModule} from './tomo03ProfessionalTypes';
import {TOMO03_BLOCK_A} from './tomo03RepairBlockA';
import {TOMO03_BLOCK_B} from './tomo03RepairBlockB';
export const TOMO03_PROFESSIONAL_MODULES:ProfessionalModule[]=[...TOMO03_BLOCK_A,...TOMO03_BLOCK_B];
export const getProfessionalModule=(number:string)=>TOMO03_PROFESSIONAL_MODULES.find(m=>m.number===number);
