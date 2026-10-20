import {useCallback,useEffect,useRef,useState} from 'react';
import {authenticate,push,signOut,syncNow,whoAmI} from './account';
export type Status='checking'|'out'|'in'|'offline';
export function useAccount(onChanged:()=>void){
const [user,setUser]=useState<string|null>(null);const [status,setStatus]=useState<Status>('checking');const [msg,setMsg]=useState('');
const userRef=useRef<string|null>(null);const last=useRef(0);userRef.current=user;
const sync=useCallback(async()=>{if(!userRef.current)return false;setMsg('Syncing…');
try{const {changed}=await syncNow();last.current=Date.now();setMsg('Synced just now');if(changed)onChanged();return true}catch(e){setMsg(`Sync failed: ${(e as Error).message==='offline'?'server not reachable':(e as Error).message}`);return false}},[onChanged]);
useEffect(()=>{whoAmI().then(u=>{setUser(u);userRef.current=u;if(u){setStatus('in');void sync()}else setStatus('out')}).catch(()=>setStatus('offline'))},[sync]);
useEffect(()=>{let t=0;
const changed=()=>{if(!userRef.current)return;clearTimeout(t);t=window.setTimeout(()=>{push().then(()=>setMsg('Synced just now')).catch(()=>setMsg('Sync failed. It will retry on your next change.'))},1000)};
const visible=()=>{if(document.visibilityState==='visible'&&userRef.current&&Date.now()-last.current>30000)void sync()};
addEventListener('gotham:changed',changed);document.addEventListener('visibilitychange',visible);
return()=>{clearTimeout(t);removeEventListener('gotham:changed',changed);document.removeEventListener('visibilitychange',visible)}},[sync]);
const enter=async(kind:'login'|'register',name:string,pw:string)=>{const u=await authenticate(kind,name,pw);userRef.current=u;setUser(u);setStatus('in');await sync()};
const login=(n:string,p:string)=>enter('login',n,p),register=(n:string,p:string)=>enter('register',n,p);
const logout=async()=>{await signOut();userRef.current=null;setUser(null);setStatus('out');setMsg('');onChanged()};
return {user,status,msg,login,register,logout,sync}}
export type Account=ReturnType<typeof useAccount>;
