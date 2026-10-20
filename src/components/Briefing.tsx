import type {Mission} from '../game/types';
export function Briefing({m,onBegin,onBack}:{m:Mission;onBegin:()=>void;onBack:()=>void}){
return <main className="panel brief"><p className="meta">CASE FILE · MISSION {String(m.number).padStart(2,'0')} · CLASSIFIED</p>
<h2>{m.title}</h2><div className="file" role="region" aria-label="Case file">{m.briefing.map((l,i)=><p key={i} style={{animationDelay:`${i*.7}s`}}>{l}</p>)}</div>
<div className="row"><button className="cta small" onClick={onBegin}>BEGIN INVESTIGATION</button><button className="ghost" onClick={onBack}>RETURN TO GOTHAM</button></div></main>}
