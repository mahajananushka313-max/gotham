import {useEffect,useRef} from 'react';
export function Rain(){const r=useRef<HTMLCanvasElement>(null);
useEffect(()=>{const c=r.current!,x=c.getContext('2d')!;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
let w=0,h=0,id=0;const d=Array.from({length:140},()=>({x:Math.random(),y:Math.random(),s:.6+Math.random()}));
const fit=()=>{w=c.width=innerWidth;h=c.height=innerHeight};fit();addEventListener('resize',fit);
const t=()=>{x.clearRect(0,0,w,h);x.strokeStyle='rgba(200,210,220,.2)';x.beginPath();
for(const p of d){const px=p.x*w,py=p.y*h;x.moveTo(px,py);x.lineTo(px-4*p.s,py+18*p.s);p.y+=.02*p.s;p.x-=.002*p.s;if(p.y>1){p.y=-.05;p.x=Math.random()*1.1}}
x.stroke();id=requestAnimationFrame(t)};t();return()=>{cancelAnimationFrame(id);removeEventListener('resize',fit)}},[]);
return <canvas ref={r} className="rain" aria-hidden="true"/>}
