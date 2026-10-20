import {useState} from 'react';
import {clues,deductions,interviews,reports,suspects} from '../../game/casefile';
import {missions} from '../../game/mission';
const rnd=(i:number)=>{const x=Math.sin(i*127.1)*43758.5453;return x-Math.floor(x)};
function Photo({id,caption}:{id:string;caption:string}){const s=[...id].reduce((a,c)=>a+c.charCodeAt(0),0);
return <figure className="photo"><svg viewBox="0 0 160 100" role="img" aria-label={`Photograph: ${caption}`}><rect width="160" height="100" fill="#1b2122"/>
{Array.from({length:7},(_,i)=><rect key={i} x={rnd(s+i+3)*130} y={100-(20+rnd(s+i+9)*60)} width={14+rnd(s+i)*30} height={20+rnd(s+i+9)*60} fill="#0c0e0e" stroke="#2c3233"/>)}
<circle cx={20+rnd(s)*120} cy="20" r="4" fill="#e8dc3a" opacity=".7"/></svg><figcaption>FIG. {caption.toUpperCase()}</figcaption></figure>}
type Sub='suspects'|'evidence'|'reports';
export function CaseFile({solved,done}:{solved:string[];done:Record<string,unknown>}){
const [sub,setSub]=useState<Sub>('evidence');const [ans,setAns]=useState<Record<string,number>>({});
const got=clues.filter(c=>done[c.mission]);
return <div><div className="tabs" role="group" aria-label="Case file sections">{(['suspects','evidence','reports'] as Sub[]).map(k=><button key={k} className="tab" aria-pressed={sub===k} onClick={()=>setSub(k)}>{k.toUpperCase()}</button>)}</div>
<div className="cards">
{sub==='suspects'&&suspects.map(s=>{const links=deductions.filter(d=>solved.includes(d.id)&&(d.a===s.id||d.b===s.id));return <article key={s.id} className="cardx"><b>{s.name}</b> <span className="y">"{s.alias}"</span><small className="dim">{s.role}</small><p>{s.profile}</p>
<h3>LINKED EVIDENCE</h3>{links.length===0?<p className="dim">Nothing established yet. Use the detective board.</p>:<ul>{links.map(d=><li key={d.id}>{clues.find(c=>c.id===(d.a===s.id?d.b:d.a))?.title}</li>)}</ul>}<h3>INTERVIEW</h3>{(interviews[s.id]??[]).map((iq,i)=>{const lock=!!iq.needs&&!solved.includes(iq.needs);return <button key={i} className="ghost wide" disabled={lock} onClick={()=>setAns(a=>({...a,[s.id]:i}))}>{iq.q}{lock?' (needs stronger evidence)':''}</button>})}{ans[s.id]!==undefined&&<p className="quote" aria-live="polite">{interviews[s.id][ans[s.id]].a}</p>}</article>})}
{sub==='evidence'&&(got.length===0&&<p className="dim empty">No evidence collected yet. Complete a mission to fill the case file.</p>)}
{sub==='evidence'&&clues.map(c=>done[c.mission]?<article key={c.id} className="cardx"><Photo id={c.id} caption={c.photo}/><b>{c.title}</b><p>{c.text}</p></article>:<article key={c.id} className="cardx locked"><b>LOCKED</b><p className="dim">Complete Mission {missions.find(m=>m.id===c.mission)?.number} to recover this evidence.</p></article>)}
{sub==='reports'&&reports.map(r=>!r.unlock||solved.includes(r.unlock)?<article key={r.id} className="cardx"><b>{r.title}</b><small className="dim">{r.date}</small><p>{r.text}</p></article>:<article key={r.id} className="cardx locked"><b>SEALED LEAD</b><p className="dim">Make the right deduction on the board to open this report.</p></article>)}
</div></div>}
