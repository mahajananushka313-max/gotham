import {clean,empty,merge,same,type Progress} from '../shared/progress';
import {clearAll,load,loadCase,save,saveCase} from './storage';
let user:string|null=null;
export const currentUser=()=>user;
async function api(path:string,method='GET',body?:unknown){
const r=await fetch(path,{method,credentials:'same-origin',headers:body!==undefined?{'Content-Type':'application/json'}:undefined,body:body!==undefined?JSON.stringify(body):undefined});
if(!(r.headers.get('content-type')??'').includes('application/json'))throw new Error('offline');
const data=await r.json();return {ok:r.ok,data}}
export const localProgress=():Progress=>({completed:load().completed,solved:loadCase()});
const writeLocal=(p:Progress)=>{save({completed:p.completed},false);saveCase(p.solved,false)};
/** Pull the account's progress, merge with this device, store the union locally and push it back if the server was behind. */
export async function syncNow(){
const r=await api('/api/progress');if(!r.ok)throw new Error(String(r.data?.error??'Sync failed'));
const remote=clean(r.data.progress),local=localProgress(),merged=merge(remote,local),changed=!same(merged,local);
if(changed)writeLocal(merged);
if(!same(merged,remote)){const p=await api('/api/progress','PUT',{progress:merged});if(!p.ok)throw new Error(String(p.data?.error??'Sync failed'))}
return {changed}}
export async function push(){const r=await api('/api/progress','PUT',{progress:localProgress()});if(!r.ok)throw new Error(String(r.data?.error??'Sync failed'))}
export async function whoAmI(){const r=await api('/api/me');user=typeof r.data.user==='string'?r.data.user:null;return user}
export async function authenticate(kind:'login'|'register',username:string,password:string){
const r=await api('/api/'+kind,'POST',{username,password});if(!r.ok)throw new Error(String(r.data?.error??'Failed'));user=String(r.data.user);return user}
export async function signOut(){try{await api('/api/logout','POST',{})}finally{user=null;clearAll()}}
export async function wipeRemote(){if(!user)return;try{await api('/api/progress','DELETE')}catch{/* offline: local reset still applies */}}
export {empty};
