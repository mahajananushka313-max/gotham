import {useEffect,useState} from 'react';
import {AnimatePresence,motion} from 'motion/react';
import {deductions,ending} from '../../game/casefile';
import {badgesFor,missions,rank} from '../../game/mission';
import {useCase} from '../../game/useCase';
import {currentUser} from '../../game/account';
import {fmt} from '../Investigate';
import {Board} from './Board';
import {CaseFile} from './CaseFile';
import {IntelMap} from './IntelMap';
type Tab='missions'|'map'|'case'|'board';
const TABS:[Tab,string][]=[['map','INTEL MAP'],['case','CASE FILE'],['board','DETECTIVE BOARD'],['missions','MISSIONS']];
export function Batcomputer({onExit,onPlay,onReset}:{onExit:()=>void;onPlay:(id:string)=>void;onReset:()=>void}){
const c=useCase();const [ready,setReady]=useState(false);const [tab,setTab]=useState<Tab>(()=>{const h=location.hash.split('/')[2] as Tab;return TABS.some(([k])=>k===h)?h:'map'});const [confirm,setConfirm]=useState(false);
useEffect(()=>{const id=setTimeout(()=>setReady(true),matchMedia('(prefers-reduced-motion: reduce)').matches?0:900);return()=>clearTimeout(id)},[]);
const doneN=missions.filter(m=>c.completed[m.id]).length;const pct=Math.round((doneN+c.solved.length)/(missions.length+deductions.length)*100);
const total=Object.values(c.completed).reduce((a,r)=>a+r.score,0);const end=ending(c.solved);
const go=(k:Tab)=>{setTab(k);try{history.replaceState(null,'','#/batcomputer/'+k)}catch{/* ignore */}};
if(!ready)return <main className="panel bc boot" role="status" aria-live="polite"><p className="meta">BATCOMPUTER</p><p>AUTHENTICATING…</p><p>DECRYPTING CASE FILES…</p><p>LINKING GCPD FEEDS…</p><i className="bar"/></main>;
return <main className="panel bc"><header className="bc-head"><div><p className="meta">BATCOMPUTER // DETECTIVE MODE</p><h2>CASE FILE: THE SIGNAL</h2></div>
<div className="row"><button className="ghost" onClick={onExit}>RETURN TO GOTHAM</button>
{confirm?<><button className="ghost warn" onClick={()=>{c.reset();onReset();setConfirm(false)}}>CONFIRM: ERASE ALL PROGRESS{currentUser()?' + ACCOUNT':''}</button><button className="ghost" onClick={()=>setConfirm(false)}>CANCEL</button></>:<button className="ghost" onClick={()=>setConfirm(true)}>RESET PROGRESS</button>}</div></header>
<div className="bc-prog" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Case progress"><i style={{width:`${pct}%`}}/></div>
<p className="meta">CASE PROGRESS {pct}% · MISSIONS {doneN}/{missions.length} · DEDUCTIONS {c.solved.length}/{deductions.length} · RANK {rank(total).toUpperCase()}</p>
<div className="tabs" role="tablist">{TABS.map(([k,l])=><button key={k} role="tab" aria-selected={tab===k} className="tab" onClick={()=>go(k)}>{l}</button>)}</div>
<div className="bc-body"><AnimatePresence mode="wait"><motion.div key={tab} role="tabpanel" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.18}}>
{tab==='map'&&<IntelMap solved={c.solved}/>}
{tab==='case'&&<CaseFile solved={c.solved} done={c.completed}/>}
{tab==='board'&&<Board solved={c.solved} done={c.completed} onSolve={c.solve}/>}
{tab==='missions'&&<><section className="cardx status"><h3>CASE STATUS: {end.t}</h3><p>{end.x}</p></section><ul className="mlist">{missions.map(m=>{const r=c.completed[m.id];return <li key={m.id} className="cardx"><b>MISSION {m.number}: {m.title}</b>{r?<><p className="y">COMPLETE · Score {r.score} · {fmt(r.time)}</p><p>{badgesFor(r).map(x=><span key={x} className="badge">{x}</span>)}</p></>:<p className="dim">Not completed. Finishing it adds evidence to the case file.</p>}<button className="cta small" onClick={()=>onPlay(m.id)}>{r?'REPLAY':'START'}</button></li>})}</ul></>}
</motion.div></AnimatePresence></div></main>}
