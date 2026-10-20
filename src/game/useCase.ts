import {useCallback,useState} from 'react';
import {clearAll,load,loadCase,saveCase} from './storage';
export function useCase(){
const [solved,setSolved]=useState<string[]>(loadCase);
const [completed,setCompleted]=useState(()=>load().completed);
const solve=useCallback((id:string)=>setSolved(s=>{if(s.includes(id))return s;const n=[...s,id];saveCase(n);return n}),[]);
const reset=useCallback(()=>{clearAll();setSolved([]);setCompleted({})},[]);
return {solved,completed,solve,reset}}
