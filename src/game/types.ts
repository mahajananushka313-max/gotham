export type Screen='home'|'briefing'|'investigate'|'cipher'|'complete'|'batcomputer';
export interface Evidence{id:string;title:string;place:string;x:number;y:number;body:string;clue:string}
export interface Trace{id:string;x:number;y:number;text:string}
export interface Mission{traces:Trace[];id:string;number:number;title:string;briefing:string[];evidence:Evidence[];cipher:{shift:number;kind?:'caesar'|'morse';answer:string;hints:string[]}}
export interface State{traces:string[];missionId:string;screen:Screen;found:string[];hints:number;wrong:number;elapsed:number;paused:boolean;feedback:'none'|'wrong'|'right'}
export interface Save{completed:Record<string,{score:number;time:number;hints?:number;wrong?:number;traces?:number}>}
