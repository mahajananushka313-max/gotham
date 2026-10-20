import {deductions,herrings} from './casefile';
export interface Verdict{ok:boolean;msg:string;id?:string}
export function evaluate(a:string,b:string,solved:string[]):Verdict{
if(a===b)return {ok:false,msg:'Select two different items.'};
const d=deductions.find(d=>(d.a===a&&d.b===b)||(d.a===b&&d.b===a));
if(d){if(solved.includes(d.id))return {ok:false,msg:'Already established. Look for another thread.'};
if(d.needs?.some(n=>!solved.includes(n)))return {ok:false,msg:'Plausible, but the file cannot support it yet. Something earlier in the case has to be established first.'};
return {ok:true,id:d.id,msg:d.success}}
return {ok:false,msg:herrings[[a,b].sort().join('|')]??'Nothing in the file ties these two together. Try a different pairing.'}}
