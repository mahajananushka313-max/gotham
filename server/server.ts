import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import Database from 'better-sqlite3';
import {clean,empty,merge,type Progress} from '../src/shared/progress';

const scrypt=promisify(crypto.scrypt) as (pw:string,salt:string,len:number)=>Promise<Buffer>;
const here=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT)||8787;
const HOST=process.env.HOST??(process.env.PORT?'0.0.0.0':'127.0.0.1');
const DAY=864e5;

const db=new Database(process.env.DB_PATH??path.join(here,'gotham.db'));
db.pragma('journal_mode = WAL');db.pragma('foreign_keys = ON');
db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,username TEXT UNIQUE NOT NULL COLLATE NOCASE,salt TEXT NOT NULL,hash TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS progress(user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,data TEXT NOT NULL,updated_at INTEGER NOT NULL);`);
db.prepare('DELETE FROM sessions WHERE expires_at<?').run(Date.now());

class BadRequest extends Error{}
const sha=(s:string)=>crypto.createHash('sha256').update(s).digest('hex');
const json=(res:http.ServerResponse,code:number,body:unknown,extra:Record<string,string>={})=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra});res.end(JSON.stringify(body))};
const readBody=(req:http.IncomingMessage)=>new Promise<any>((ok,bad)=>{let n=0;const parts:Buffer[]=[];
req.on('data',(c:Buffer)=>{n+=c.length;if(n>65536){bad(new BadRequest('Request too large'));req.destroy()}else parts.push(c)});
req.on('end',()=>{try{ok(JSON.parse(Buffer.concat(parts).toString()||'{}'))}catch{bad(new BadRequest('Invalid JSON'))}});req.on('error',bad)});
const secure=(req:http.IncomingMessage)=>req.headers['x-forwarded-proto']==='https'||process.env.COOKIE_SECURE==='1';
const cookieHeader=(req:http.IncomingMessage,token:string,maxAge:number)=>`gsid=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure(req)?'; Secure':''}`;
const userFrom=(req:http.IncomingMessage)=>{const t=/(?:^|;\s*)gsid=([a-f0-9]{64})/.exec(req.headers.cookie??'')?.[1];if(!t)return null;
return (db.prepare('SELECT u.id,u.username FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').get(sha(t),Date.now()) as {id:number;username:string}|undefined)??null};
const newSession=(uid:number)=>{const token=crypto.randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(sha(token),uid,Date.now()+30*DAY);return token};
const hits=new Map<string,{n:number;reset:number}>();
const limited=(req:http.IncomingMessage)=>{const ip=req.socket.remoteAddress??'?',now=Date.now(),h=hits.get(ip);if(!h||h.reset<now){hits.set(ip,{n:1,reset:now+10*60e3});return false}return ++h.n>20};
const stored=(uid:number):Progress=>{const r=db.prepare('SELECT data FROM progress WHERE user_id=?').get(uid) as {data:string}|undefined;try{return r?clean(JSON.parse(r.data)):empty()}catch{return empty()}};

async function api(req:http.IncomingMessage,res:http.ServerResponse,p:string){
const m=req.method??'GET';
if(m!=='GET'&&m!=='DELETE'&&!(req.headers['content-type']??'').includes('application/json'))throw new BadRequest('JSON required');
if(p==='/api/me'&&m==='GET')return json(res,200,{user:userFrom(req)?.username??null});
if((p==='/api/register'||p==='/api/login')&&m==='POST'){
if(limited(req))return json(res,429,{error:'Too many attempts. Try again in a few minutes.'});
const b=await readBody(req);const name=typeof b.username==='string'?b.username.trim():'',pw=typeof b.password==='string'?b.password:'';
if(p==='/api/register'){
if(!/^[A-Za-z0-9_]{3,24}$/.test(name))return json(res,400,{error:'Username must be 3-24 letters, numbers or underscores.'});
if(pw.length<8||pw.length>128)return json(res,400,{error:'Password must be 8-128 characters.'});
const salt=crypto.randomBytes(16).toString('hex'),hash=(await scrypt(pw,salt,64)).toString('hex');
try{const r=db.prepare('INSERT INTO users(username,salt,hash,created_at) VALUES (?,?,?,?)').run(name,salt,hash,Date.now());
return json(res,200,{user:name},{'Set-Cookie':cookieHeader(req,newSession(Number(r.lastInsertRowid)),30*86400)})}
catch(e){if(String((e as {code?:string}).code).startsWith('SQLITE_CONSTRAINT'))return json(res,409,{error:'That username is taken.'});throw e}}
const row=db.prepare('SELECT id,username,salt,hash FROM users WHERE username=?').get(name) as {id:number;username:string;salt:string;hash:string}|undefined;
const got=await scrypt(pw,row?.salt??'0'.repeat(32),64);
if(!row||!crypto.timingSafeEqual(got,Buffer.from(row.hash,'hex')))return json(res,401,{error:'Invalid username or password.'});
return json(res,200,{user:row.username},{'Set-Cookie':cookieHeader(req,newSession(row.id),30*86400)})}
if(p==='/api/logout'&&m==='POST'){const t=/(?:^|;\s*)gsid=([a-f0-9]{64})/.exec(req.headers.cookie??'')?.[1];if(t)db.prepare('DELETE FROM sessions WHERE token_hash=?').run(sha(t));
return json(res,200,{ok:true},{'Set-Cookie':cookieHeader(req,'',0)})}
if(p==='/api/progress'){const u=userFrom(req);if(!u)return json(res,401,{error:'Not signed in.'});
if(m==='GET')return json(res,200,{progress:stored(u.id)});
if(m==='PUT'){const merged=merge(stored(u.id),clean((await readBody(req)).progress));
db.prepare('INSERT INTO progress(user_id,data,updated_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at').run(u.id,JSON.stringify(merged),Date.now());
return json(res,200,{progress:merged})}
if(m==='DELETE'){db.prepare('DELETE FROM progress WHERE user_id=?').run(u.id);return json(res,200,{progress:empty()})}}
return json(res,404,{error:'Not found.'})}

const MIME:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json'};
function serveStatic(res:http.ServerResponse,p:string){
const dist=path.resolve(here,'..','dist');
if(!fs.existsSync(dist))return json(res,404,{error:'No build found. Run "npm run build" first, or use "npm run dev:full" while developing.'});
let f=path.resolve(dist,'.'+decodeURIComponent(p));
if(!f.startsWith(dist))return json(res,403,{error:'Forbidden'});
if(!fs.existsSync(f)||fs.statSync(f).isDirectory())f=path.join(dist,'index.html');
res.writeHead(200,{'Content-Type':MIME[path.extname(f)]??'application/octet-stream','X-Content-Type-Options':'nosniff'});fs.createReadStream(f).pipe(res)}

http.createServer(async(req,res)=>{try{
const url=new URL(req.url??'/','http://x');
if(url.pathname.startsWith('/api/'))await api(req,res,url.pathname);else serveStatic(res,url.pathname)}
catch(e){if(e instanceof BadRequest)json(res,400,{error:e.message});else{console.error(e);json(res,500,{error:'Server error.'})}}
}).listen(PORT,HOST,()=>console.log(`Gotham server on http://${HOST}:${PORT}`));
