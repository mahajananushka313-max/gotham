import {useState,type CSSProperties} from 'react';
import type {Mission,State,Trace} from '../game/types';
export const fmt=(s:number)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
export function Investigate({m,s,onFound,onTrace,onCipher,onPause,onBack}:{m:Mission;s:State;onFound:(id:string)=>void;onTrace:(id:string)=>void;onCipher:()=>void;onPause:()=>void;onBack:()=>void}){
const [sel,setSel]=useState<string|null>(null);const [note,setNote]=useState<string|null>(null);const [scan,setScan]=useState(false);const [pt,setPt]=useState({x:-100,y:-100});
const ev=m.evidence.find(e=>e.id===sel);const all=s.found.length===m.evidence.length;
const pick=(id:string)=>{setSel(id);setNote(null);onFound(id)};
const trace=(t:Trace)=>{onTrace(t.id);setNote(t.text);setSel(null)};
const move=(e:React.PointerEvent<HTMLElement>)=>{const r=e.currentTarget.getBoundingClientRect();setPt({x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100})};
return <main className="panel invest"><header className="bar-top"><span className="meta">MISSION {m.number} · {fmt(s.elapsed)}</span>
<span className="obj" role="status">OBJECTIVE: {all?'Evidence secured. Decode the transmission.':`Collect evidence ${s.found.length}/${m.evidence.length}`}</span>
<span><button className="ghost" aria-pressed={scan} onClick={()=>setScan(v=>!v)}>SCANNER {scan?'ON':'OFF'}</button> <button className="ghost" onClick={onPause}>PAUSE</button> <button className="ghost" onClick={onBack}>BRIEFING</button></span></header>
<div className="grid"><section className={`map${scan?' scan-on':''}`} aria-label="Gotham district map" onPointerMove={move} style={{'--sx':`${pt.x}%`,'--sy':`${pt.y}%`} as CSSProperties}><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40H100M0 75H100M30 0V100M70 0V100M0 0 100 100" /><path className="river" d="M0 90Q30 80 60 92T100 86"/></svg>
{m.evidence.map(e=><button key={e.id} className={`pin${s.found.includes(e.id)?' got':''}${sel===e.id?' on':''}`} style={{left:`${e.x}%`,top:`${e.y}%`}} onClick={()=>pick(e.id)} aria-label={`${e.title}, ${e.place}`}><span>{e.place}</span></button>)}
{m.traces.map(t=><button key={t.id} className={`trace${(scan&&Math.hypot(t.x-pt.x,t.y-pt.y)<12)||s.traces.includes(t.id)?' vis':''}`} style={{left:`${t.x}%`,top:`${t.y}%`}} onClick={()=>trace(t)} aria-label="Hidden trace, bonus evidence"/>)}</section>
<aside className="side"><section aria-label="Evidence"><h3>EVIDENCE</h3>{note?<div className="card"><b>Trace found (+50)</b><p>{note}</p></div>:ev?<div className="card"><b>{ev.title}</b><small>{ev.place}</small><p>{ev.body}</p></div>:<p className="dim">Select a location on the map. Turn on the scanner to sweep for hidden traces.</p>}</section>
<section aria-label="Clue log"><h3>CLUE LOG</h3>{s.found.length+s.traces.length===0?<p className="dim">No clues yet.</p>:<ol aria-live="polite">{s.found.map(id=><li key={id}>{m.evidence.find(e=>e.id===id)!.clue}</li>)}{s.traces.map(id=><li key={id}>{m.traces.find(t=>t.id===id)?.text}</li>)}</ol>}</section>
<button className="cta small" disabled={!all} onClick={onCipher}>{all?'DECODE TRANSMISSION':'EVIDENCE INCOMPLETE'}</button></aside></div></main>}
