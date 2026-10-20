import {useState} from 'react';
import {districts,reports,suspects} from '../../game/casefile';
export function IntelMap({solved}:{solved:string[]}){
const [dist,setDist]=useState<string|null>(null);const [rep,setRep]=useState<string|null>(null);
const open=reports.filter(r=>!r.unlock||solved.includes(r.unlock));
const d=districts.find(x=>x.id===dist);const r=open.find(x=>x.id===rep);
const inD=open.filter(x=>x.district===dist);
return <div className="split"><div className="dmap" aria-label="Gotham intelligence map">
<svg viewBox="0 0 100 100">{districts.map(x=><g key={x.id} className={`dist${dist===x.id?' on':''}`} role="button" tabIndex={0} aria-pressed={dist===x.id} aria-label={x.name}
onClick={()=>{setDist(x.id);setRep(null)}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setDist(x.id);setRep(null)}}}>
<rect x={x.x} y={x.y} width={x.w} height={x.h}/><text x={x.x+2} y={x.y+5}>{x.name.toUpperCase()}</text></g>)}</svg>
{open.map(m=><button key={m.id} className={`mk${rep===m.id?' on':''}`} style={{left:`${m.x}%`,top:`${m.y}%`}} aria-label={`Crime report: ${m.title}`} onClick={()=>{setDist(m.district);setRep(m.id)}}/>)}</div>
<aside className="side"><section aria-label="District intel"><h3>{d?d.name.toUpperCase():'DISTRICT INTEL'}</h3>
{!d?<p className="dim">Select a district or a crime marker.</p>:<><p>{d.blurb}</p>
<h3>PERSONS OF INTEREST</h3>{suspects.filter(s=>s.district===d.id).map(s=><p key={s.id}><b>{s.name}</b> <span className="dim">{s.role}</span></p>)}{!suspects.some(s=>s.district===d.id)&&<p className="dim">None on file.</p>}
<h3>REPORTS</h3>{inD.length===0?<p className="dim">No incidents on file. New leads appear here as you make deductions.</p>:inD.map(x=><button key={x.id} className="ghost wide" onClick={()=>setRep(x.id)}>{x.title}</button>)}</>}</section>
{r&&<section className="cardx" aria-live="polite"><b>{r.title}</b><small className="dim"> {r.date}</small><p>{r.text}</p></section>}</aside></div>}
