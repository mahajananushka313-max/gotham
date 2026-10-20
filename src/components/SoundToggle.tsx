import {useEffect,useState} from 'react';
import {isOn,musicOn,setMusic,setSound,sfx,startRain,startScore} from '../game/sound';
export function SoundToggle(){const [on,setOn]=useState(isOn);const [mu,setMu]=useState(musicOn);
useEffect(()=>{const h=(e:MouseEvent)=>{startScore();if(isOn()&&(e.target as HTMLElement).closest?.('button')){startRain();sfx.click()}};document.addEventListener('click',h);return()=>document.removeEventListener('click',h)},[]);
return <><button className="ghost" aria-pressed={on} onClick={()=>{const v=!on;setOn(v);setSound(v)}}>SFX: {on?'ON':'OFF'}</button>
<button className="ghost" aria-pressed={mu} onClick={()=>{const v=!mu;setMu(v);setMusic(v)}}>MUSIC: {mu?'ON':'OFF'}</button></>}
