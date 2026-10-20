import {useEffect,useState,type CSSProperties} from 'react';
import {motion} from 'motion/react';
import {Bat} from './Bat';
import {Guardian,Skyline} from './Scenery';
export function Home({onStart,onBC,onResume,best}:{onStart:()=>void;onBC:()=>void;onResume?:()=>void;best?:number}){
const [p,setP]=useState({x:0,y:0});const [t,setT]=useState(0);
useEffect(()=>{const id=setInterval(()=>setT(v=>v+1),1500);return()=>clearInterval(id)},[]);
const move=(e:React.MouseEvent)=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;setP({x:e.clientX/innerWidth-.5,y:e.clientY/innerHeight-.5})};
const lat=(41.8781+Math.sin(t)*.0004).toFixed(4),brg=(87.4+Math.cos(t)*.6).toFixed(1);
const ease={duration:.8,ease:[.2,.7,.2,1]} as const;
return <main className="home" onMouseMove={move} style={{'--mx':`${(p.x+.5)*100}%`,'--my':`${(p.y+.5)*100}%`} as CSSProperties}>
<div className="signal" style={{transform:`translate(${p.x*-24}px,${p.y*-16}px)`}}><div className="beam"/><div className="moon"/><div className="disc"><Bat className="disc-bat"/></div></div>
<Bat className="fly" /><Bat className="fly f2"/><Bat className="fly f3"/>
<Skyline/><Guardian/><div className="fog" aria-hidden="true"/>
<aside className="hud" aria-label="Transmission status"><b><i className="ico">+</i>GCPD / SIGNAL 01</b>
<dl><dt>Status</dt><dd>Transmitting</dd><dt>Position</dt><dd>{lat}° N</dd><dt>Bearing</dt><dd>{brg.padStart(5,'0')}° NE</dd></dl><i className="bar"/></aside>
<section className="copy"><p className="meta">GOTHAM CITY <span/> 02:17 AM</p>
<motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={ease}><span>THE NIGHT IS</span><em>LISTENING.</em></motion.h1>
<p className="sub">When the city falls silent, a symbol rises.<br/>Move through the darkness. Call the guardian.</p>
<motion.button className="cta" onClick={onStart} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{...ease,delay:.35}} whileHover={{x:4}}><span className="cta-ico"><Bat/></span><span className="cta-txt">KILL THE SIGNAL</span><span aria-hidden="true">↗</span></motion.button>
{onResume&&<button className="link" onClick={onResume}>RESUME INVESTIGATION ↗</button>}
<button className="link" onClick={onBC}>OPEN BATCOMPUTER ↗</button>
{best!==undefined&&<p className="best">Best case score: {best}</p>}</section>
<footer><span>MOVE YOUR CURSOR TO SEARCH THE SKY</span><span className="y">{lat}° N / 87.6298° W</span></footer></main>}
