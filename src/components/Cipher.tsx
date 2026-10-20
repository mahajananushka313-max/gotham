import {useEffect,useState} from 'react';
import type {Mission,State} from '../game/types';
import {encoded} from '../game/mission';
import {morse,sfx} from '../game/sound';
export function Cipher({m,s,onGuess,onHint,onBack}:{m:Mission;s:State;onGuess:(g:string)=>void;onHint:()=>void;onBack:()=>void}){
const [g,setG]=useState('');const done=s.feedback==='right';
useEffect(()=>{if(s.feedback==='right')sfx.good();if(s.feedback==='wrong')sfx.bad()},[s.feedback,s.wrong]);
return <main className="panel cipher"><p className="meta">INTERCEPTED TRANSMISSION</p><div className={`code${m.cipher.kind==='morse'?' morse':''}`} aria-label="Encrypted message">{encoded(m)}</div>
{m.cipher.kind==='morse'&&<button type="button" className="ghost" onClick={()=>morse(encoded(m))}>▶ PLAY SIGNAL</button>}
<form onSubmit={e=>{e.preventDefault();if(g.trim())onGuess(g)}}><label htmlFor="ans">DECODED LOCATION</label>
<input id="ans" value={g} onChange={e=>setG(e.target.value)} disabled={done} autoComplete="off" autoFocus/>
<button className="cta small" disabled={done||!g.trim()}>SUBMIT</button></form>
<p role="status" className={`fb ${s.feedback}`}>{s.feedback==='wrong'&&'SIGNAL MISMATCH. That is not the message. Try again.'}{s.feedback==='right'&&'SIGNAL LOCKED. Location confirmed.'}</p>
{s.hints>0&&<ol className="hints">{m.cipher.hints.slice(0,s.hints).map((h,i)=><li key={i}>{h}</li>)}</ol>}
<div className="row"><button className="ghost" onClick={onHint} disabled={done||s.hints>=m.cipher.hints.length}>HINT ({s.hints}/{m.cipher.hints.length}) −150 pts</button><button className="ghost" onClick={onBack} disabled={done}>BACK TO EVIDENCE</button></div></main>}
