import {useState} from 'react';
import {clues,deductions,suspects} from '../../game/casefile';
import {evaluate,type Verdict} from '../../game/deduce';
import {missions} from '../../game/mission';
import {sfx} from '../../game/sound';
export function Board({solved,done,onSolve}:{solved:string[];done:Record<string,unknown>;onSolve:(id:string)=>void}){
const [sel,setSel]=useState<string|null>(null);const [v,setV]=useState<Verdict|null>(null);
const nodes=[...clues.map(c=>({id:c.id,label:c.title,x:c.x,y:c.y,sus:false,mission:c.mission,locked:!done[c.mission]})),...suspects.map(s=>({id:s.id,label:s.name,x:s.x,y:s.y,sus:true,mission:'',locked:false}))];
const at=(id:string)=>nodes.find(n=>n.id===id)!;
const linked=new Set(deductions.filter(d=>solved.includes(d.id)).flatMap(d=>[d.a,d.b]));
const pick=(id:string)=>{if(!sel){setSel(id);setV(null);return}if(sel===id){setSel(null);return}const r=evaluate(sel,id,solved);setV(r);setSel(null);r.ok?sfx.good():sfx.bad();if(r.ok&&r.id)onSolve(r.id)};
const any=nodes.some(n=>!n.sus&&!n.locked);
return <div onKeyDown={e=>{if(e.key==='Escape')setSel(null)}}>
<p className="dim">{sel?`Selected: ${at(sel).label}. Now choose a second item to connect (Esc to cancel).`:'Select a clue, then a suspect or another clue, to test a connection.'}</p>
<div className="board"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{deductions.filter(d=>solved.includes(d.id)).map(d=><line key={d.id} className="ln" x1={at(d.a).x} y1={at(d.a).y} x2={at(d.b).x} y2={at(d.b).y} vectorEffect="non-scaling-stroke"/>)}</svg>
{!any&&<p className="empty dim">No evidence on the board yet. Complete a mission to collect clues.</p>}
{nodes.map(n=><button key={n.id} disabled={n.locked} title={n.locked?`Complete Mission ${missions.find(m=>m.id===n.mission)?.number}`:undefined} aria-pressed={sel===n.id} className={`node${n.sus?' sus':''}${sel===n.id?' sel':''}${linked.has(n.id)?' linked':''}`} style={{left:`${n.x}%`,top:`${n.y}%`}} onClick={()=>pick(n.id)}>{n.sus?'SUSPECT · ':'CLUE · '}{n.label}</button>)}</div>
<p role="status" className={`verdict ${v?(v.ok?'ok':'no'):''}`}>{v?v.msg:`Deductions established: ${solved.length}/${deductions.length}`}</p></div>}
