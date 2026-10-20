export interface District{id:string;name:string;x:number;y:number;w:number;h:number;blurb:string}
export interface Suspect{id:string;name:string;alias:string;role:string;district:string;profile:string;x:number;y:number}
export interface Clue{id:string;mission:string;title:string;text:string;photo:string;x:number;y:number}
export interface Report{id:string;district:string;title:string;date:string;text:string;x:number;y:number;unlock?:string}
export interface Deduction{id:string;a:string;b:string;needs?:string[];success:string}
export const districts:District[]=[
{id:'narrows',name:'The Narrows',x:4,y:6,w:30,h:32,blurb:'Cramped tenements and old storage lockers. Few cameras.'},
{id:'courthouse',name:'Courthouse Square',x:36,y:6,w:26,h:30,blurb:'Civic buildings, the old tower clock, heavy foot traffic by day.'},
{id:'cobalt',name:'Cobalt Heights',x:64,y:6,w:32,h:34,blurb:'Glass towers and holding companies. Money lives here.'},
{id:'foundry',name:'Foundry Flats',x:36,y:40,w:30,h:28,blurb:'Workshops, freight offices and cheap rent.'},
{id:'ashgrove',name:'Ashgrove',x:68,y:44,w:28,h:48,blurb:'Residential blocks with a few surviving payphones.'},
{id:'harbor',name:'Harbor Row',x:4,y:56,w:30,h:36,blurb:'Ferry berths, dispatch offices and the old pier relay.'}];
export const suspects:Suspect[]=[
{id:'s1',name:'Vera Lindqvist',alias:'Static',role:'Former signals engineer, Gotham Telecom',district:'narrows',x:84,y:16,profile:'Dismissed in March after an internal dispute. Knows broadcast hardware better than anyone on the payroll.'},
{id:'s2',name:'Dominic Harrow',alias:'Tick',role:'Clock maintenance contractor',district:'courthouse',x:84,y:38,profile:'Services the courthouse tower twice a year. Cooperative, nervous, keeps meticulous logs.'},
{id:'s3',name:'Calloway Reed',alias:'The Dispatcher',role:'Ferry line dispatcher',district:'harbor',x:84,y:60,profile:'Controls berth assignments and ticket sales on Harbor Row. Remembers every face.'},
{id:'s4',name:'Mara Quill',alias:'Broker',role:'Freight broker',district:'foundry',x:84,y:82,profile:'Moves crates for anyone who pays, and asks no questions. Paperwork is always in order.'}];
export const clues:Clue[]=[
{id:'c-relay',mission:'m1',title:'Pirate relay firmware',text:'The relay runs signal firmware stamped with a Gotham Telecom build tag. The tag was retired two years ago.',photo:'Relay board, build tag visible',x:14,y:12},
{id:'c-clock',mission:'m1',title:'Stopped courthouse clock',text:'Hands set to three o\'clock by hand. A message scratched beneath: "THE HOUR IS THE KEY".',photo:'Clock face, tower interior',x:14,y:32},
{id:'c-ticket',mission:'m1',title:'Torn ferry stub',text:'One-way stub for the 02:00 sailing, Berth 4. Berth 4 is the only berth the dispatch office stamps by hand.',photo:'Ticket stub under UV lamp',x:14,y:52},
{id:'c-ledger',mission:'m3',title:'Shell company ledger',text:'Granite Lane Holdings pays every bill on the 7th. Its post box key was registered to the same locker Lindqvist cleared out.',photo:'Ledger page, payment column',x:14,y:72},
{id:'c-solder',mission:'m2',title:'Workshop solder joints',text:'Five-joint rows with a distinctive hooked finish, the same technique as the boards inside the pirate relay.',photo:'Macro shot of solder joints',x:44,y:18},
{id:'c-keycard',mission:'m2',title:'Tower access log',text:'No swipe was logged. The roof door latch was forced from the inside at 02:58.',photo:'Roof door latch, forced',x:44,y:42},
{id:'c-manifest',mission:'m3',title:'Freight manifest',text:'Crate of transmitter parts delivered to Foundry Flats, signed for by the broker, paid in cash.',photo:'Manifest, signature line',x:44,y:66}];
export const reports:Report[]=[
{id:'r1',district:'harbor',title:'Unregistered transmission',date:'Oct 12, 02:17',text:'GCPD radio logged a looping letter pattern with no voice, originating near the Pier 9 relay.',x:16,y:70},
{id:'r2',district:'courthouse',title:'Tower clock tampered',date:'Oct 12, 03:00',text:'The tower clock was stopped at three o\'clock. Roof door forced from the inside.',x:48,y:22},
{id:'r-d1',district:'narrows',title:'Locker 114 opened',date:'Lead',text:'Storage locker rented to a former Telecom engineer. Inside: firmware disks and a retired badge.',x:18,y:26,unlock:'d1'},
{id:'r-d2',district:'harbor',title:'Dispatcher statement',date:'Lead',text:'Reed recalls a woman in a Telecom jacket buying the one-way 02:00 ticket for Berth 4.',x:24,y:82,unlock:'d2'},
{id:'r-d3',district:'foundry',title:'Workshop warrant',date:'Lead',text:'Warrant issued for the Foundry Flats workshop. The bench is still warm, and a half-built array sits under a tarp.',x:50,y:58,unlock:'d3'},
{id:'r-d5',district:'ashgrove',title:'Broker testimony',date:'Lead',text:'Quill cooperates: the parts were collected in person by a woman who paid cash and never gave a name.',x:82,y:72,unlock:'d5'},
{id:'r-d4',district:'cobalt',title:'Cobalt Tower, 40th floor',date:'FINAL LEAD',text:'Granite Lane Holdings leases the top floor. A beam array is mounted on the roof. The signal ends here.',x:78,y:24,unlock:'d4'}];
export const deductions:Deduction[]=[
{id:'d1',a:'c-relay',b:'s1',success:'The retired Telecom build tag narrows the field to former signals staff. Lindqvist was dismissed in March. New lead: Locker 114.'},
{id:'d2',a:'c-ticket',b:'s3',success:'Berth 4 tickets are stamped by hand, and Reed dispatches that berth. He saw who bought it. New lead: dispatcher statement.'},
{id:'d3',a:'c-solder',b:'c-relay',needs:['d1'],success:'Same hooked solder finish on the workshop boards and inside the relay: one builder. With Lindqvist in the frame, the workshop is hers. New lead: warrant.'},
{id:'d5',a:'c-manifest',b:'s4',needs:['d2'],success:'Quill signed for the crate but only brokered it, and the buyer matches the woman Reed described. New lead: broker testimony.'},
{id:'d4',a:'c-ledger',b:'s1',needs:['d1','d3'],success:'The ledger\'s post box traces to Lindqvist\'s locker, and the builder of the relay controls the money. The signal ends at Cobalt Tower. Case lead complete.'}];
export const herrings:Record<string,string>={
'c-keycard|s2':'Tempting, since Harrow services the tower. But no keycard was used, so his access log proves nothing. Dead end.',
'c-clock|s2':'Harrow maintains the clock, but this was set by hand to leave a message, not a repair gone wrong. Not enough to name him.',
'c-manifest|s1':'The manifest carries Quill\'s signature, not Lindqvist\'s. Establish who handled the crate first.',
'c-ticket|s4':'A ferry stub says nothing about freight. Think about who controls the berth.'};
export const interviews:Record<string,{q:string;a:string;needs?:string}[]>={
s1:[{q:'Where were you the night of the 12th?',a:'"Home, alone. My landlord saw the lights on. Check your sources."'},{q:'Explain the Gotham Telecom build tag.',needs:'d1',a:'"Fine, I wrote that firmware. Everyone who left kept a copy. That proves nothing."'}],
s2:[{q:'Did you service the tower recently?',a:'"Last in August. I log everything, check the book. I never touch the hands."'},{q:'Who has a key to the roof?',a:'"Only me and the building office. But that latch is old. A hard shove from inside would do it."'}],
s3:[{q:'Do you stamp tickets by hand?',a:'"Berth 4 only. The machine jams. Keeps me honest."'},{q:'Who bought the 02:00 ticket?',needs:'d2',a:'"Tall woman, telecom jacket, paid cash. Asked for Berth 4 by name."'}],
s4:[{q:'What was in the crate?',a:'"Electronics. I never open crates, that is how I stay in business."'},{q:'Who collected it?',needs:'d5',a:'"A woman. Cash. A jacket with a faded logo. Telecom, maybe."'}]};
export function ending(solved:string[]){
if(solved.includes('d4'))return solved.length===deductions.length?{t:'CASE CLOSED',x:'Lindqvist is in custody, the broker is cleared, and the dispatcher\'s statement holds in court. Every thread tied together.'}:{t:'SOLVED, LOOSE ENDS',x:'The signal is traced to Cobalt Tower and Lindqvist is arrested, but gaps in the supporting evidence may weaken the prosecution.'};
if(solved.length>=2)return {t:'LEADS OPEN',x:'You have a name and a direction, but nothing that holds up yet. Keep connecting the evidence.'};
return {t:'COLD TRAIL',x:'The signal is still broadcasting. Complete missions and make deductions to track it.'}}
