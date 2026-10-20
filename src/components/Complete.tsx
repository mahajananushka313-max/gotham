import type {Mission,State} from '../game/types';
import {score} from '../game/mission';
import {fmt} from './Investigate';
export function Complete({m,s,onAgain,onHome,onBC,onNext}:{m:Mission;s:State;onAgain:()=>void;onHome:()=>void;onBC:()=>void;onNext?:()=>void}){
return <main className="panel done"><p className="meta">MISSION {m.number} · COMPLETE</p><h2>THE NEXT STRIKE:<br/><em>{m.cipher.answer}</em></h2>
<dl className="stats"><dt>Score</dt><dd>{score(s)}</dd><dt>Time</dt><dd>{fmt(s.elapsed)}</dd><dt>Hints / Misses</dt><dd>{s.hints} / {s.wrong}</dd><dt>Traces</dt><dd>{s.traces.length}/{m.traces.length}</dd></dl>
<ul className="ev">{s.found.map(id=><li key={id}>{m.evidence.find(e=>e.id===id)!.title}</li>)}</ul>
<div className="row"><button className="cta small" onClick={onAgain}>PLAY AGAIN</button>{onNext&&<button className="cta small" onClick={onNext}>NEXT MISSION</button>}<button className="ghost" onClick={onBC}>OPEN BATCOMPUTER</button><button className="ghost" onClick={onHome}>RETURN TO GOTHAM</button></div></main>}
