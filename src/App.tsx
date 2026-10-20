import {useCallback,useEffect,useRef,useState} from 'react';
import {AnimatePresence,MotionConfig,motion} from 'motion/react';
import type {Screen} from './game/types';
import {useGame} from './game/useGame';
import {getMission,missions} from './game/mission';
import {clearRun,load,loadRun} from './game/storage';
import {Rain} from './components/Rain';
import {Home} from './components/Home';
import {Briefing} from './components/Briefing';
import {Investigate} from './components/Investigate';
import {Cipher} from './components/Cipher';
import {Complete} from './components/Complete';
import {SoundToggle} from './components/SoundToggle';
import {AccountPanel} from './components/AccountPanel';
import {useAccount} from './game/useAccount';
import {wipeRemote} from './game/account';
import {Batcomputer} from './components/batcomputer/Batcomputer';
const nav=(h:string)=>{try{history.pushState(null,'',h)}catch{/* ignore */}};
export default function App(){
const {state:s,dispatch:d}=useGame();const [,bump]=useState(0);const [rev,setRev]=useState(0);
const acct=useAccount(useCallback(()=>setRev(r=>r+1),[]));
const scr=useRef(s.screen);scr.current=s.screen;
useEffect(()=>{const sync=()=>{if(location.hash.startsWith('#/batcomputer'))d({t:'go',s:'batcomputer'});else if(scr.current==='batcomputer')d({t:'go',s:'home'})};
sync();addEventListener('popstate',sync);addEventListener('hashchange',sync);return()=>{removeEventListener('popstate',sync);removeEventListener('hashchange',sync)}},[d]);
const m=getMission(s.missionId);const done=load().completed;const run=s.screen==='home'?loadRun():null;
const scores=Object.values(done).map(c=>c.score);const best=scores.length?Math.max(...scores):undefined;
const go=(x:Screen)=>d({t:'go',s:x});
const openBC=()=>{nav('#/batcomputer/map');go('batcomputer')};
const next=missions[missions.findIndex(x=>x.id===m.id)+1];
return <MotionConfig reducedMotion="user"><div className="app"><Rain/><div className="scan" aria-hidden="true"/><div className="audio"><SoundToggle/><AccountPanel a={acct}/></div>
<AnimatePresence mode="wait"><motion.div key={`${s.screen}-${rev}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.22}}>
{s.screen==='home'&&<Home best={best} onStart={()=>d({t:'select',id:(missions.find(x=>!done[x.id])??missions[0]).id})} onBC={openBC} onResume={run?()=>d({t:'resume',s:run}):undefined}/>}
{s.screen==='briefing'&&<Briefing m={m} onBegin={()=>d({t:'begin'})} onBack={()=>go('home')}/>}
{s.screen==='investigate'&&<Investigate key={m.id} m={m} s={s} onFound={id=>d({t:'found',id})} onTrace={id=>d({t:'trace',id})} onCipher={()=>go('cipher')} onPause={()=>d({t:'pause'})} onBack={()=>go('briefing')}/>}
{s.screen==='cipher'&&<Cipher key={m.id} m={m} s={s} onGuess={g=>d({t:'guess',g})} onHint={()=>d({t:'hint'})} onBack={()=>go('investigate')}/>}
{s.screen==='complete'&&<Complete m={m} s={s} onAgain={()=>d({t:'begin'})} onBC={openBC} onNext={next?()=>d({t:'select',id:next.id}):undefined} onHome={()=>{d({t:'reset'});bump(n=>n+1)}}/>}
{s.screen==='batcomputer'&&<Batcomputer onExit={()=>{nav('#/');go('home')}} onPlay={id=>{nav('#/');d({t:'select',id})}} onReset={()=>{void wipeRemote();bump(n=>n+1)}}/>}
</motion.div></AnimatePresence>
{s.paused&&<div className="pause" role="dialog" aria-modal="true" aria-label="Paused"><h2>PAUSED</h2><button className="cta small" autoFocus onClick={()=>d({t:'pause'})}>RESUME</button><button className="ghost" onClick={()=>{clearRun();d({t:'reset'})}}>ABANDON CASE</button></div>}
</div></MotionConfig>}
