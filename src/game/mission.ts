import type {Mission,State} from './types';
export const mission1:Mission={id:'m1',number:1,traces:[{id:'t1',x:48,y:46,text:'A fresh work-boot print by the relay, steel toe, telecom-issue tread.'}],title:'The Night Is Listening',
briefing:['02:17 AM. A looping transmission is bleeding across every GCPD band.','No voice. Only a pattern of letters, repeating.','Trace the source, gather three pieces of evidence, decode the message. Find where the next strike lands.'],
evidence:[
{id:'relay',title:'Radio Relay',place:'Pier 9',x:22,y:62,body:'A pirate relay, still warm. The transmission is a simple letter-shift cipher, the same shift on every letter.',clue:'Cipher type: every letter shifted by a fixed amount.'},
{id:'clock',title:'Stopped Clock',place:'Old Courthouse Tower',x:62,y:26,body:'The tower clock froze at three o\'clock. Someone scratched "THE HOUR IS THE KEY" beneath it.',clue:'The key is the hour the clock stopped.'},
{id:'ticket',title:'Torn Ticket',place:'Maroni St. Platform',x:78,y:70,body:'A ferry ticket stub with a dock number circled. Whatever the message names, it is somewhere you can board a boat.',clue:'The target is a place tied to the water.'}],
cipher:{shift:3,answer:'HARBOR STATION',hints:['Shifted letters can be shifted back. Which direction undoes the shift?','Look at your clue log for the shift amount.','Move each letter back three places: K becomes H.']}};
export const caesar=(s:string,k:number)=>s.replace(/[A-Za-z]/g,c=>{const b=c<='Z'?65:97;return String.fromCharCode(((c.charCodeAt(0)-b+k)%26+26)%26+b)});
export const normalize=(s:string)=>s.toUpperCase().replace(/[^A-Z]/g,'');
const MC:Record<string,string>={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
export const toMorse=(s:string)=>s.toUpperCase().split(' ').map(w=>[...w].map(c=>MC[c]??'').join(' ')).join(' / ');
export const encoded=(m:Mission)=>m.cipher.kind==='morse'?toMorse(m.cipher.answer):caesar(m.cipher.answer,m.cipher.shift);
export const check=(m:Mission,guess:string)=>normalize(guess)===normalize(m.cipher.answer);
export const score=(s:Pick<State,'hints'|'wrong'|'elapsed'|'traces'>)=>Math.max(100,1000-s.hints*150-s.wrong*50-Math.floor(s.elapsed/3))+50*s.traces.length;
export const mission2:Mission={id:'m2',number:2,traces:[{id:'t2',x:22,y:34,text:'A hooked-tip soldering iron left cooling on a rag.'}],title:'The Hour Hand',
briefing:['03:00 AM. The courthouse tower door was forced from the inside, and the clock hands were set by hand.','Whoever is behind the signal built their equipment somewhere with a workbench and a lot of solder.','Follow the hardware. Find the next transmission site.'],
evidence:[
{id:'door',title:'Tower Roof Door',place:'Courthouse Tower',x:60,y:24,body:'The latch was broken from the inside. No keycard swipe was logged, so whoever came up never needed one.',clue:'The intruder did not use a keycard.'},
{id:'bench',title:'Workshop Bench',place:'Foundry Flats',x:40,y:64,body:'A bench full of relay boards. The solder joints repeat in short and long blobs, like tapping a key. Tidy, practiced work.',clue:'The joints are short and long: dots and dashes.'},
{id:'phone',title:'Payphone Log',place:'Ashgrove',x:80,y:60,body:'A payphone dialed the same number nightly. The call ends with a rhythm of short and long beeps.',clue:'The final message is Morse code.'}],
cipher:{shift:0,kind:'morse',answer:'FOUNDRY GATE',hints:['Dots are short, dashes are long. Letters are separated by spaces, words by a slash.','Press PLAY SIGNAL to hear it, or read the symbols one letter at a time.','The first letter is ..-. which is F.']}};
export const mission3:Mission={id:'m3',number:3,traces:[{id:'t3',x:52,y:40,text:'A rain-smudged receipt for a post box rental at Cobalt Heights.'}],title:'Last Ferry',
briefing:['04:40 AM. Parts, payments and ferry tickets all point at the harbor and the money behind it.','Follow the paper trail to the building where the signal ends.','One last message. One last location.'],
evidence:[
{id:'manifest',title:'Freight Manifest',place:'Foundry Flats Office',x:30,y:56,body:'A crate of transmitter parts, signed for by a broker who never opened it. Delivery was paid in cash.',clue:'The broker only moved the crate.'},
{id:'ledger',title:'Shell Company Ledger',place:'Cobalt Heights Records',x:72,y:28,body:'Granite Lane Holdings pays every bill on the seventh of the month. The company address is a post box.',clue:'The key is seven.'},
{id:'logbook',title:'Ferry Logbook',place:'Harbor Row',x:20,y:76,body:'The 02:00 ferry carried one passenger, who got off at Berth 4 and walked toward the tall glass tower.',clue:'The target is a tower.'}],
cipher:{shift:7,answer:'COBALT TOWER',hints:['A final letter shift. Reread the ledger for the key.','Every payment lands on the same day of the month.','Move each letter back seven places: J becomes C.']}};
export const missions:Mission[]=[mission1,mission2,mission3];
export const getMission=(id:string)=>missions.find(x=>x.id===id)??mission1;
export const badgesFor=(r:{time:number;hints?:number;wrong?:number;traces?:number})=>[r.hints===0&&'No Hints',r.time<180&&'Speed Run',r.hints===0&&r.wrong===0&&'Flawless',(r.traces??0)>0&&'Tracker'].filter(Boolean) as string[];
export const rank=(total:number)=>total>=2500?'Chief of Detectives':total>=1500?'Detective':total>0?'Rookie':'Unranked';
