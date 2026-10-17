export interface TechnicalChoice {id:string;label:string;feedback:string}
export interface TechnicalQuestion {id:string;prompt:string;choices:TechnicalChoice[];correct:string}
export interface DiagnosticNode {id:string;question:string;yes:string;no:string;stop:string}
export interface RepairObservation {id:string;label:string;instrument:string;result:string;requires?:string[];unsafe?:boolean}
export interface RepairScenario {
  id:string;equipment:string;symptom:string;safety:string;
  tests:RepairObservation[];required:string[];
  hypotheses:TechnicalChoice[];cause:string;repairs:TechnicalChoice[];repair:string;
  before:string;after:string;limits:string;
}
export interface ProfessionalModule {
  number:string;title:string;
  levels:[string,string,string];diagram:string[];diagramCaption:string;
  symptoms:string[];procedure:string[];
  measurement:{instrument:string;conditions:string;reference:string;uncertainty:string;interpretation:string};
  trick:{technique:string;when:string;avoid:string;verify:string};
  mistakes:string[];tree:DiagnosticNode[];quiz:TechnicalQuestion[];
  scenario:RepairScenario;tool:string;references:{label:string;url:string}[];
}
export interface ProfessionalState {
  tree:Record<string,'yes'|'no'|'unknown'>;quiz:Record<string,string>;
  observations:string[];hypothesis:string|null;repair:string|null;verified:boolean;
  log:string[];
}
export const emptyProfessionalState=():ProfessionalState=>({tree:{},quiz:{},observations:[],hypothesis:null,repair:null,verified:false,log:[]});
export const TOMO03_TOOL_LABELS:Record<string,string>={
 'power-checklist':'Checklist de encendido','atx-uncertainty':'Intérprete ATX e incertidumbre',
 connectors:'Identificador de conectores','before-after':'Comparador antes/después',
 'ram-matrix':'Matriz RAM módulo/ranura','post-sequence':'Secuencia POST didáctica',
 'firmware-decision':'Plan de firmware y recuperación','cpu-compatibility':'Compatibilidad CPU/motherboard',
 'thermal-profile':'Perfil térmico y margen al límite'
};
