import {useEffect,useState,type FormEvent} from 'react';
import type {Account} from '../game/useAccount';
export function AccountPanel({a}:{a:Account}){
const [open,setOpen]=useState(false);const [mode,setMode]=useState<'login'|'register'>('login');
const [u,setU]=useState('');const [pw,setPw]=useState('');const [err,setErr]=useState('');const [busy,setBusy]=useState(false);const [warn,setWarn]=useState(false);
useEffect(()=>{if(!open)return;const k=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[open]);
const submit=async(e:FormEvent)=>{e.preventDefault();setBusy(true);setErr('');
try{await (mode==='login'?a.login:a.register)(u.trim(),pw);setPw('');setU('')}catch(x){const m=(x as Error).message;setErr(m==='offline'?'The account server is not reachable.':m)}finally{setBusy(false)}};
const out=async()=>{if(!warn&&!(await a.sync())){setWarn(true);return}await a.logout();setWarn(false);setOpen(false)};
return <><button className="ghost" onClick={()=>setOpen(true)}>{a.user?`ACCOUNT: ${a.user.toUpperCase()}`:'ACCOUNT'}</button>
{open&&<div className="modal" onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="dlg" role="dialog" aria-modal="true" aria-labelledby="acct-h">
<h3 id="acct-h">{a.user?'ACCOUNT':mode==='login'?'LOG IN':'CREATE ACCOUNT'}</h3>
{a.status==='checking'&&<p className="dim">Checking account…</p>}
{a.status==='offline'&&<p>The account server is not reachable, so progress is saved on this device only. Start it with <code>npm run dev:full</code> (or <code>npm start</code>).</p>}
{a.status==='out'&&<form onSubmit={submit}>
<p className="dim">Sign in to keep your progress on any device. Your progress is stored on this game's server.</p>
<label htmlFor="au">USERNAME</label><input id="au" value={u} onChange={e=>setU(e.target.value)} autoComplete="username" autoFocus required minLength={3} maxLength={24}/>
<label htmlFor="ap">PASSWORD (8+ characters)</label><input id="ap" type="password" value={pw} onChange={e=>setPw(e.target.value)} autoComplete={mode==='login'?'current-password':'new-password'} required minLength={mode==='register'?8:1} maxLength={128}/>
{err&&<p className="err" role="alert">{err}</p>}
<button className="cta small" disabled={busy}>{busy?'WORKING…':mode==='login'?'LOG IN':'CREATE ACCOUNT'}</button>
<button type="button" className="link" onClick={()=>{setMode(mode==='login'?'register':'login');setErr('')}}>{mode==='login'?'NEW HERE? CREATE AN ACCOUNT':'HAVE AN ACCOUNT? LOG IN'}</button></form>}
{a.status==='in'&&<div><p>Signed in as <b>{a.user}</b>.</p><p className="ok-msg" role="status">{a.msg||'Connected'}</p>
<div className="row"><button className="cta small" onClick={()=>void a.sync()}>SYNC NOW</button><button className="ghost" onClick={()=>void out()}>{warn?'LOG OUT ANYWAY':'LOG OUT'}</button></div>
{warn&&<p className="err" role="alert">Your latest progress could not be synced. Logging out clears this device's copy.</p>}
<p className="dim">Logging out clears progress on this device. It stays on your account.</p></div>}
<button className="ghost" onClick={()=>setOpen(false)}>CLOSE</button></div></div>}</>}
