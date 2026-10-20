const KEY='gotham.sound';
const pref=()=>{try{return localStorage.getItem(KEY)==='1'}catch{return false}};
let ctx:AudioContext|null=null,on=pref(),rain:AudioBufferSourceNode|null=null;
export const isOn=()=>on;
function ac(){if(!ctx){const C=window.AudioContext||(window as any).webkitAudioContext;if(!C)return null;ctx=new C()}if(ctx.state==='suspended')void ctx.resume();return ctx}
function tone(f:number,d:number,type:OscillatorType='sine',v=.08,at=0,force=false){const c=ac();if(!c||(!on&&!force))return;const o=c.createOscillator(),g=c.createGain(),s=c.currentTime+at;
o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(g).connect(c.destination);o.start(s);o.stop(s+d)}
export const sfx={click:()=>tone(520,.06,'square',.03),good:()=>{tone(440,.15,'triangle',.1);tone(660,.2,'triangle',.1,.12);tone(880,.3,'triangle',.1,.26)},bad:()=>tone(150,.3,'sawtooth',.07)};
export function morse(code:string){let t=0;const u=.09;for(const ch of code){if(ch==='.'){tone(700,u,'sine',.1,t,true);t+=u*2}else if(ch==='-'){tone(700,u*3,'sine',.1,t,true);t+=u*4}else if(ch===' ')t+=u*2;else t+=u*4}}
export function startRain(){const c=ac();if(!c||rain||!on)return;const len=c.sampleRate*2,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;f.Q.value=.4;const g=c.createGain();g.gain.value=.05;s.connect(f).connect(g).connect(c.destination);s.start();rain=s}
export function setSound(v:boolean){on=v;try{localStorage.setItem(KEY,v?'1':'0')}catch{/* ignore */}if(v)startRain();else{rain?.stop();rain=null}}
/* Original generative noir score: drone, heartbeat thump, sparse bells, slow brass swells. */
const MKEY='gotham.music';
const mpref=()=>{try{return localStorage.getItem(MKEY)==='1'}catch{return false}};
let music=mpref(),bgm:{stop:()=>void}|null=null;
export const musicOn=()=>music;
export function startScore(){const c=ac();if(!c||bgm||!music)return;
const master=c.createGain();master.gain.value=0;master.gain.linearRampToValueAtTime(.5,c.currentTime+3);master.connect(c.destination);
const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=420;lp.Q.value=2;lp.connect(master);
const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.07;lg.gain.value=180;lfo.connect(lg).connect(lp.frequency);lfo.start();
const drones:[number,OscillatorType,number][]=[[55,'sawtooth',.06],[55.4,'sawtooth',.05],[82.4,'triangle',.05],[41.2,'sine',.09]];
const oscs=drones.map(([f,t,v])=>{const o=c.createOscillator(),g=c.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;o.connect(g).connect(lp);o.start();return o});
const dl=c.createDelay(1.5);dl.delayTime.value=.6;const fb=c.createGain();fb.gain.value=.45;dl.connect(fb).connect(dl);dl.connect(master);
const note=(f:number,type:OscillatorType,dur:number,vol:number,dest:AudioNode,rise=.05)=>{const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+rise);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(dest);o.start(t);o.stop(t+dur+.1)};
const thump=()=>{const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(40,t+.25);g.gain.setValueAtTime(.3,t);g.gain.exponentialRampToValueAtTime(.001,t+.4);o.connect(g).connect(master);o.start(t);o.stop(t+.45)};
const scale=[110,130.8,146.8,164.8,196,220,261.6,329.6],roots=[110,98,87.3,98];let k=0;
const timers=[window.setInterval(()=>{thump();window.setTimeout(thump,420)},3200),
window.setInterval(()=>note(scale[Math.floor(Math.random()*scale.length)]*(Math.random()<.4?2:1),'triangle',2.5,.05,dl),2600),
window.setInterval(()=>{const r=roots[k++%roots.length];note(r,'sawtooth',6,.08,lp,3);note(r*1.5,'sawtooth',6,.04,lp,3)},12000)];
bgm={stop:()=>{timers.forEach(clearInterval);master.gain.cancelScheduledValues(c.currentTime);master.gain.setTargetAtTime(0,c.currentTime,.4);window.setTimeout(()=>{oscs.forEach(o=>o.stop());lfo.stop();master.disconnect()},1800);bgm=null}}}
export function setMusic(v:boolean){music=v;try{localStorage.setItem(MKEY,v?'1':'0')}catch{/* ignore */}if(v)startScore();else bgm?.stop()}
