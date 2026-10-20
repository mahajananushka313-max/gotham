import type {Save,State} from './types';
import {missions} from './mission';
const KEY='gotham.save.v1';const empty=():Save=>({completed:{}});
export function load():Save{try{const r=JSON.parse(localStorage.getItem(KEY)??'null');if(!r||typeof r.completed!=='object'||r.completed===null)return empty();
const completed:Save['completed']={};for(const [k,v] of Object.entries<any>(r.completed))if(v&&Number.isFinite(v.score)&&Number.isFinite(v.time))completed[k]={score:v.score,time:v.time,...(Number.isFinite(v.hints)?{hints:v.hints}:{}),...(Number.isFinite(v.wrong)?{wrong:v.wrong}:{}),...(Number.isFinite(v.traces)?{traces:v.traces}:{})};return {completed}}catch{return empty()}}
const changed=()=>{try{dispatchEvent(new Event('gotham:changed'))}catch{/* no window */}};
export function save(s:Save,notify=true){try{localStorage.setItem(KEY,JSON.stringify(s))}catch{/* storage unavailable: progress simply isn't persisted */}if(notify)changed()}
import {deductions} from './casefile';
const CKEY='gotham.case.v1';
export function loadCase():string[]{try{const r=JSON.parse(localStorage.getItem(CKEY)??'null');return Array.isArray(r)?r.filter((x):x is string=>typeof x==='string'&&deductions.some(d=>d.id===x)):[]}catch{return []}}
export function saveCase(a:string[],notify=true){try{localStorage.setItem(CKEY,JSON.stringify(a))}catch{/* ignore */}if(notify)changed()}
export function clearAll(){try{localStorage.removeItem(KEY);localStorage.removeItem(CKEY);localStorage.removeItem(RKEY)}catch{/* ignore */}}
const RKEY='gotham.run.v1';
export const saveRun=(s:State)=>{try{localStorage.setItem(RKEY,JSON.stringify(s))}catch{/* ignore */}};
export const clearRun=()=>{try{localStorage.removeItem(RKEY)}catch{/* ignore */}};
export function loadRun():State|null{try{const r=JSON.parse(localStorage.getItem(RKEY)??'null');if(!r||!['investigate','cipher'].includes(r.screen)||!missions.some(m=>m.id===r.missionId))return null;
const strs=(a:unknown)=>Array.isArray(a)&&a.every(x=>typeof x==='string');const n=(x:unknown)=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
if(!strs(r.found)||!strs(r.traces)||![r.hints,r.wrong,r.elapsed].every(n))return null;
return {missionId:r.missionId,screen:r.screen,found:r.found,traces:r.traces,hints:r.hints,wrong:r.wrong,elapsed:r.elapsed,paused:false,feedback:'none'}}catch{return null}}
