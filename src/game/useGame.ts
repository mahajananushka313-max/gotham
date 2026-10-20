import {useEffect,useReducer} from 'react';
import type {Screen,State} from './types';
import {check,getMission,score} from './mission';
import {clearRun,load,save,saveRun} from './storage';
const init:State={traces:[],missionId:'m1',screen:'home',found:[],hints:0,wrong:0,elapsed:0,paused:false,feedback:'none'};
export type A={t:'go';s:Screen}|{t:'select';id:string}|{t:'trace';id:string}|{t:'resume';s:State}|{t:'begin'}|{t:'found';id:string}|{t:'hint'}|{t:'guess';g:string}|{t:'pause'}|{t:'tick'}|{t:'reset'};
function reduce(s:State,a:A):State{switch(a.t){
case 'go':return {...s,screen:a.s,paused:false};
case 'select':return {...init,missionId:a.id,screen:'briefing'};
case 'trace':return s.traces.includes(a.id)?s:{...s,traces:[...s.traces,a.id]};
case 'resume':return a.s;
case 'begin':return {...init,missionId:s.missionId,screen:'investigate'};
case 'found':return s.found.includes(a.id)?s:{...s,found:[...s.found,a.id]};
case 'hint':return s.hints<getMission(s.missionId).cipher.hints.length?{...s,hints:s.hints+1}:s;
case 'guess':{const m=getMission(s.missionId);if(s.found.length<m.evidence.length)return s;return check(m,a.g)?{...s,feedback:'right'}:{...s,wrong:s.wrong+1,feedback:'wrong'}}
case 'pause':return {...s,paused:!s.paused};
case 'tick':return s.paused?s:{...s,elapsed:s.elapsed+1};
case 'reset':return init}}
export function useGame(){
const [state,dispatch]=useReducer(reduce,init);
const playing=state.screen==='investigate'||state.screen==='cipher';
useEffect(()=>{if(!playing||state.paused)return;const id=setInterval(()=>dispatch({t:'tick'}),1000);return()=>clearInterval(id)},[playing,state.paused]);
useEffect(()=>{if(state.feedback!=='right'||state.screen==='complete')return;const id=setTimeout(()=>{const s=load(),k=getMission(state.missionId).id,sc=score(state),p=s.completed[k];if(!p||sc>p.score)s.completed[k]={score:sc,time:state.elapsed,hints:state.hints,wrong:state.wrong,traces:state.traces.length};save(s);dispatch({t:'go',s:'complete'})},1400);return()=>clearTimeout(id)},[state]);
useEffect(()=>{if(playing&&state.feedback!=='right')saveRun(state);else if(state.screen==='complete')clearRun()},[state,playing]);
return {state,dispatch}}
