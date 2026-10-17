import type {TechnicalChoice,TechnicalQuestion} from './tomo03ProfessionalTypes';
export const answer=(id:string,label:string,feedback:string):TechnicalChoice=>({id,label,feedback});
export const question=(id:string,prompt:string,labels:[string,string,string],correct:string,reason:string):TechnicalQuestion=>({id,prompt,correct,choices:labels.map((label,index)=>({id:String(index),label,feedback:`${String(index)===correct?'Correcto.':'Revisá la inferencia.'} ${reason}`}))});
