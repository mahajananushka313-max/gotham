/** Progress shape shared by the browser and the server, with validation and merging. */
export interface Run{score:number;time:number;hints?:number;wrong?:number;traces?:number}
export interface Progress{completed:Record<string,Run>;solved:string[]}
export const empty=():Progress=>({completed:{},solved:[]});
const num=(x:unknown,max:number):x is number=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=max;
export function clean(d:unknown):Progress{
const out=empty();if(!d||typeof d!=='object')return out;const o=d as {completed?:unknown;solved?:unknown};
if(o.completed&&typeof o.completed==='object')for(const [k,v] of Object.entries(o.completed as Record<string,any>).slice(0,20)){
if(!/^m\d{1,3}$/.test(k)||!v||!num(v.score,100000)||!num(v.time,1e6))continue;
const r:Run={score:v.score,time:v.time};for(const f of ['hints','wrong','traces'] as const)if(num(v[f],1000))r[f]=v[f];out.completed[k]=r}
if(Array.isArray(o.solved))out.solved=[...new Set(o.solved.filter((x):x is string=>typeof x==='string'&&/^d\d{1,3}$/.test(x)))].slice(0,50).sort();
return out}
/** Union of both sides: best score per mission (ties: faster time), all deductions. */
export function merge(a:Progress,b:Progress):Progress{
const completed={...a.completed};
for(const [k,r] of Object.entries(b.completed)){const p=completed[k];if(!p||r.score>p.score||(r.score===p.score&&r.time<p.time))completed[k]=r}
return {completed,solved:[...new Set([...a.solved,...b.solved])].sort()}}
const norm=(p:Progress)=>JSON.stringify([Object.keys(p.completed).sort().map(k=>{const r=p.completed[k];return [k,r.score,r.time,r.hints??null,r.wrong??null,r.traces??null]}),[...p.solved].sort()]);
export const same=(a:Progress,b:Progress)=>norm(a)===norm(b);
