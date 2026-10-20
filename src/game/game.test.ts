import {describe,expect,it} from 'vitest';
const store:Record<string,string>={};
Object.assign(globalThis,{localStorage:{getItem:(k:string)=>k in store?store[k]:null,setItem:(k:string,v:string)=>{store[k]=v},removeItem:(k:string)=>{delete store[k]}}});
import {badgesFor,caesar,check,encoded,missions,rank,score,toMorse} from './mission';
import {evaluate} from './deduce';
import {clues,deductions,ending,reports,suspects} from './casefile';
import {load,loadCase,loadRun} from './storage';
describe('puzzles',()=>{
it('caesar missions round-trip',()=>{for(const m of missions.filter(x=>x.cipher.kind!=='morse'))expect(caesar(encoded(m),-m.cipher.shift)).toBe(m.cipher.answer)});
it('morse encodes',()=>{expect(toMorse('FAB')).toBe('..-. .- -...');expect(toMorse('A B')).toBe('.- / -...')});
it('answers ignore case and spacing',()=>{const m=missions[0];expect(check(m,' harbor  station ')).toBe(true);expect(check(m,'nope')).toBe(false)});
it('traces add bonus',()=>{expect(score({hints:0,wrong:0,elapsed:0,traces:[]})).toBe(1000);expect(score({hints:1,wrong:2,elapsed:0,traces:['t']})).toBe(800)})});
describe('deductions',()=>{
it('gates dependent deductions',()=>{expect(evaluate('c-ledger','s1',[]).ok).toBe(false);expect(evaluate('c-solder','c-relay',[]).ok).toBe(false)});
it('full chain solves',()=>{const s:string[]=[];for(const [a,b] of [['c-relay','s1'],['s3','c-ticket'],['c-relay','c-solder'],['c-manifest','s4'],['s1','c-ledger']]){const r=evaluate(a,b,s);expect(r.ok).toBe(true);s.push(r.id!)}expect(s.length).toBe(deductions.length);expect(ending(s).t).toBe('CASE CLOSED')});
it('red herring explains itself',()=>{expect(evaluate('c-keycard','s2',[]).msg).toContain('Dead end')});
it('data is consistent',()=>{const ids=new Set([...clues.map(c=>c.id),...suspects.map(x=>x.id)]);expect(deductions.every(d=>ids.has(d.a)&&ids.has(d.b))).toBe(true);expect(reports.filter(r=>r.unlock).every(r=>deductions.some(d=>d.id===r.unlock))).toBe(true)})});
describe('storage',()=>{
it('survives malformed data',()=>{store['gotham.save.v1']='{bad';expect(load().completed).toEqual({});store['gotham.save.v1']=JSON.stringify({completed:{m1:{score:5,time:9},m2:'x'}});expect(Object.keys(load().completed)).toEqual(['m1'])});
it('filters unknown deductions',()=>{store['gotham.case.v1']=JSON.stringify(['d1','zzz',4]);expect(loadCase()).toEqual(['d1'])});
it('rejects bad saved runs',()=>{store['gotham.run.v1']='{"screen":"home"}';expect(loadRun()).toBeNull()})});
describe('progress',()=>{it('badges and ranks',()=>{expect(badgesFor({time:100,hints:0,wrong:0})).toEqual(['No Hints','Speed Run','Flawless']);expect(rank(0)).toBe('Unranked');expect(rank(3000)).toBe('Chief of Detectives')})});
import {clean as cleanP,merge,same} from '../shared/progress';
describe('sync merge',()=>{
it('keeps best score and unions deductions',()=>{const m=merge({completed:{m1:{score:900,time:100}},solved:['d1']},{completed:{m1:{score:500,time:10},m2:{score:300,time:50}},solved:['d2','d1']});
expect(m.completed.m1.score).toBe(900);expect(Object.keys(m.completed)).toEqual(['m1','m2']);expect(m.solved).toEqual(['d1','d2'])});
it('breaks score ties by faster time',()=>{expect(merge({completed:{m1:{score:5,time:90}},solved:[]},{completed:{m1:{score:5,time:60}},solved:[]}).completed.m1.time).toBe(60)});
it('is order independent',()=>{const a={completed:{m1:{score:9,time:5}},solved:['d1']},b={completed:{m2:{score:7,time:3}},solved:['d3']};expect(same(merge(a,b),merge(b,a))).toBe(true)});
it('rejects junk from the network',()=>{const c=cleanP({completed:{m1:{score:10,time:1,hints:'x'},bad:{score:1,time:1},m2:{score:-1,time:1}},solved:['d1','<x>',7]});expect(c.completed).toEqual({m1:{score:10,time:1}});expect(c.solved).toEqual(['d1']);expect(cleanP(null)).toEqual({completed:{},solved:[]})})});
