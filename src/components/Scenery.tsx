const W=1400,H=320;
const rnd=(i:number)=>{const x=Math.sin(i*127.1)*43758.5453;return x-Math.floor(x)};
interface B{x:number;w:number;h:number;win:number[]}
const mk=(seed:number,lo:number,hi:number):B[]=>{const out:B[]=[];let x=-20,i=seed;
while(x<W){const w=60+rnd(i++)*80,h=lo+rnd(i++)*(hi-lo),n=Math.floor(rnd(i++)*5);out.push({x,w,h,win:Array.from({length:n},(_,k)=>12+k*((w-24)/5))});x+=w+rnd(i++)*10}return out};
const back=mk(1,120,230),front=mk(40,50,130);
export function Skyline(){return <svg className="skyline" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
{back.map((b,i)=><g key={i}><rect x={b.x} y={H-b.h} width={b.w} height={b.h} fill="#161b1c"/>{b.win.map((wx,k)=><rect key={k} x={b.x+wx} y={H-b.h+14} width="3" height={30+rnd(i*9+k)*30} fill="rgba(232,220,58,.2)"/>)}{i%5===0&&<><path d={`M${b.x+b.w/2} ${H-b.h}v-26`} stroke="#2a3032"/><circle cx={b.x+b.w/2} cy={H-b.h-26} r="1.6" fill="#a8453a"/></>}</g>)}
{front.map((b,i)=><g key={i}><rect x={b.x} y={H-b.h} width={b.w} height={b.h} fill="#0b0d0d"/><path d={`M${b.x} ${H-b.h}h${b.w}`} stroke="#252b2c" strokeWidth="1"/></g>)}</svg>}
export const Guardian=()=><svg className="guardian" viewBox="0 0 170 350" aria-hidden="true"><path d="M62 24 68 2 82 20h18l14-18 4 24 4 22-8 14 44 128 4 140-155-8L0 220l56-98-4-62-8-20Z" fill="#090a0a" stroke="#e8dc3a" strokeWidth="1.5" strokeLinejoin="round"/><path d="M71 40l12 3M110 40l-12 3" stroke="#e8dc3a" strokeWidth="4" strokeLinecap="round"/></svg>;
