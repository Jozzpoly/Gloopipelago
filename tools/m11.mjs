import fs from 'node:fs';
import assert from 'node:assert/strict';
import { Simulation, Mulberry32Stream, mulberry32 } from '../src/core/v1-mirror.mjs';
import {
  loadOracle, PROFILES, FIXED_DT, BROWSER_CONFIG,
  causalState, exactFingerprint, firstDiff
} from './m0/lib.mjs';

const GOLDEN_PATH = new URL('../evidence/m0/golden-fingerprints.json', import.meta.url);
const SPECIMENS_PATH = new URL('../evidence/m0/process-specimens.json', import.meta.url);
const cmd = process.argv[2] ?? 'help';
const args = process.argv.slice(3);

function applyIntervention(sim,it){
  if(it.type==='resize') sim.setSize(it.width,it.height);
  else if(it.type==='food-point') sim.addFood(it.count ?? 1,false,{x:it.x,y:it.y});
  else if(it.type==='food-burst') sim.addFood(it.count ?? 1);
  else if(it.type==='catastrophe') sim.catastrophe();
  else throw new Error(`Unknown intervention ${it.type}`);
}
function profileGolden(id){const set=JSON.parse(fs.readFileSync(GOLDEN_PATH,'utf8'));const row=set.profiles.find(x=>x.profile.id===id);if(!row)throw new Error(`Missing golden ${id}`);return row;}
function pair(profile){const {Simulation:Oracle}=loadOracle();const cfg={seed:profile.seed,width:profile.width,height:profile.height,...profile.config};return {oracle:new Oracle(cfg),candidate:new Simulation(cfg)};}
function assertPair(a,b,id,tick){const sa=causalState(a),sb=causalState(b);const fa=exactFingerprint(sa).sha256,fb=exactFingerprint(sb).sha256;if(fa!==fb){const d=firstDiff(sa,sb);throw new Error(`${id} divergence tick=${tick} path=${d?.path} oracle=${JSON.stringify(d?.a)} candidate=${JSON.stringify(d?.b)}`)}return fa;}

function verifyProfile(profile,dense=false){
  const golden=profileGolden(profile.id), expected=new Map(golden.observations.map(r=>[r[0],r[1]]));
  const checkpoints=new Set(profile.checkpoints), interventions=new Map();
  for(const it of profile.interventions??[]){if(!interventions.has(it.boundary))interventions.set(it.boundary,[]);interventions.get(it.boundary).push(it);}
  const {oracle,candidate}=pair(profile); const max=Math.max(...profile.checkpoints);
  if(checkpoints.has(0)){const fp=assertPair(oracle,candidate,profile.id,0);assert.equal(fp,expected.get(0));}
  for(let tick=0;tick<max;tick++){
    if(interventions.has(tick))for(const it of interventions.get(tick)){applyIntervention(oracle,it);applyIntervention(candidate,it);}
    oracle.step(FIXED_DT);candidate.step(FIXED_DT);const done=tick+1;
    if(dense||checkpoints.has(done)){const fp=assertPair(oracle,candidate,profile.id,done);if(checkpoints.has(done))assert.equal(fp,expected.get(done));}
  }
  return {id:profile.id,ticks:max,final:exactFingerprint(causalState(candidate)).sha256};
}

function rngSequence(){
  const {mulberry32:legacy}=loadOracle();
  const seeds=[0,1,0x12345678,0x7fffffff,0x80000000,0xffffffff,0x9e3779b9,0xdeadbeef];
  const draws=250000;
  for(const seed of seeds){const a=legacy(seed),b=new Mulberry32Stream(seed),compat=mulberry32(seed);for(let i=0;i<draws;i++){const expected=a();assert.equal(b.next(),expected,`stream seed=${seed} draw=${i}`);assert.equal(compat(),expected,`compat seed=${seed} draw=${i}`);}}
  const offsets=[0,1,2,3,17,1024,65535,100000];
  for(const seed of seeds)for(const offset of offsets){const s=new Mulberry32Stream(seed);for(let i=0;i<offset;i++)s.next();const state=s.snapshot();const a=Array.from({length:4096},()=>s.next());s.restore(state);const b=Array.from({length:4096},()=>s.next());assert.deepEqual(b,a);}
  return {seeds,draws,totalDraws:seeds.length*draws,restoreCases:seeds.length*offsets.length,continuationDraws:4096};
}

function blank(seed=1,opts={}){const s=new Simulation({seed,width:900,height:700,...BROWSER_CONFIG,...opts});s.blobs=[];s.foods=[];s.births=0;s.deaths=0;s.extinctions=0;s.nextId=1;return s;}
const G={hue:180,speed:.9,sense:68,size:5,eff:.96,wander:.7,diet:0};
function blob(s,{x=450,y=350,energy=70,age=0,g=G,generation=0,id=null}={}){s.spawnBlob(x,y,{...g},generation,energy,false);const b=s.blobs.at(-1);if(id!=null)b.id=id;b.vx=0;b.vy=0;b.a=0;b.age=age;b.reproCooldown=0;return b;}
function runSpecimens(){
  const results={format:'gloopipelago-m0-process-specimens',schema:1,specimens:{}};
  {const s=blank(7,{mutationScale:0,foodRate:0});blob(s,{energy:1000});s.step(FIXED_DT);results.specimens['S-LIVE-APPEND']={births:s.births,generations:s.blobs.map(x=>x.generation),fingerprint:exactFingerprint(causalState(s)).sha256}}
  function contested(reverse){const s=blank(11,{mutationScale:0,foodRate:0});blob(s,{id:1});blob(s,{id:2});s.nextId=3;if(reverse)s.blobs.reverse();s.foods=[{x:450,y:350,e:10,rich:true,kind:-1,expiresAt:100}];s.step(FIXED_DT);const winner=s.blobs.slice().sort((x,y)=>x.id-y.id).map(x=>[x.id,x.energy]).sort((x,y)=>y[1]-x[1])[0][0];return{winner,state:s}}
  {const n=contested(false),r=contested(true);results.specimens['S-CONTENDED-FOOD']={normalWinner:n.winner,reversedWinner:r.winner,normalFingerprint:exactFingerprint(causalState(n.state)).sha256,reversedFingerprint:exactFingerprint(causalState(r.state)).sha256}}
  {const s=blank(13,{mutationScale:0,foodRate:0});for(let i=0;i<259;i++)blob(s,{x:10+(i%30)*20,y:10+Math.floor(i/30)*20,energy:i<2?200:1,id:i+1});s.nextId=260;s.step(FIXED_DT);results.specimens['S-POP-CAP']={population:s.blobs.length,births:s.births,firstCooldown:s.blobs.find(x=>x.id===1).reproCooldown,secondCooldown:s.blobs.find(x=>x.id===2).reproCooldown,fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(17,{mutationScale:0,foodRate:0});blob(s,{energy:200,age:170});s.step(FIXED_DT);results.specimens['S-AGE-REPRO']={births:s.births,deaths:s.deaths,survivorGenerations:s.blobs.map(x=>x.generation),fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(19,{mutationScale:0,foodRate:0});blob(s);s.foods=[{x:450,y:350,e:5,rich:true,kind:-1,expiresAt:100},{x:450,y:350,e:15,rich:true,kind:-1,expiresAt:100}];s.step(FIXED_DT);results.specimens['S-FOOD-ORDER']={remainingEnergy:s.foods.map(f=>f.e),fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(23,{mutationScale:0,foodRate:0});const survivor=blob(s,{energy:70,id:1});blob(s,{energy:-1,id:2});s.nextId=3;let seq=[1,0,.5];s.rng=()=>seq.length?seq.shift():.5;s.step(FIXED_DT);const afterFirst={foods:s.foods.length,survivorEnergy:survivor.energy,deaths:s.deaths};s.step(FIXED_DT);results.specimens['S-CORPSE-PHASE']={afterFirst,afterSecond:{foods:s.foods.length,survivorEnergy:survivor.energy,deaths:s.deaths},fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(29,{mutationScale:0,foodRate:0});s.foods=Array.from({length:10},(_,i)=>({x:i,y:0,e:i+1,rich:false,kind:0,expiresAt:100}));s.blobs=[];s.catastrophe();results.specimens['S-CATASTROPHE']={remaining:s.foods.map(f=>f.e),fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(31,{mutationScale:0,foodRate:0});blob(s,{energy:1e9});for(let i=0;i<2040;i++)s.step(FIXED_DT);const t=s.simTime,se=s.season;s.step(FIXED_DT);results.specimens['S-FLOAT-TIME']={tick2040:{simTime:t,season:se},tick2041:{simTime:s.simTime,season:s.season},fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(37,{mutationScale:0,foodRate:0,autoReseed:false});s.step(FIXED_DT);const afterFirst={population:s.blobs.length,extinctions:s.extinctions};s.step(FIXED_DT);const afterSecond={population:s.blobs.length,extinctions:s.extinctions};results.specimens['S-EMPTY-NORESEED']={afterFirst,afterSecond,fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(41,{mutationScale:0,foodRate:0,autoReseed:true});s.step(FIXED_DT);results.specimens['S-EMPTY-AUTORESEED']={afterFirst:{population:s.blobs.length,extinctions:s.extinctions,nextId:s.nextId},generations:s.blobs.map(b=>b.generation),fingerprint:exactFingerprint(causalState(s)).sha256}}
  return results;
}
function verifySpecimens(){const expected=JSON.parse(fs.readFileSync(SPECIMENS_PATH,'utf8'));assert.deepEqual(runSpecimens(),expected);return true;}

function capture(sim){return {state:structuredClone(causalState(sim)),rngState:sim.rngStream.snapshot()};}
function restore(cap){
  const s0=cap.state,cfg={seed:s0.seed,...s0.config};const sim=new Simulation(cfg);
  sim.seed=s0.seed;sim.simTime=s0.simTime;sim.season=s0.season;sim.nextId=s0.nextId;sim.births=s0.births;sim.deaths=s0.deaths;sim.extinctions=s0.extinctions;
  sim.blobs=structuredClone(s0.blobs);sim.foods=structuredClone(s0.foods);sim.rngStream.restore(cap.rngState);
  return sim;
}
function restoreCases(){
  const cases=[
    {id:'nominal-777',profile:'P-NOMINAL-S1',at:777,after:3000},
    {id:'nominal-post-season',profile:'P-NOMINAL-S12345678',at:2100,after:2500},
    {id:'resize-post-first',profile:'P-RESIZE',at:800,after:1200},
    {id:'intervention-post-catastrophe',profile:'P-INTERVENTION',at:1000,after:500},
  ];
  const out=[];
  for(const c of cases){const p=PROFILES.find(x=>x.id===c.profile);const cfg={seed:p.seed,width:p.width,height:p.height,...p.config};const a=new Simulation(cfg);const its=new Map();for(const it of p.interventions??[]){if(!its.has(it.boundary))its.set(it.boundary,[]);its.get(it.boundary).push(it);}
    for(let t=0;t<c.at;t++){if(its.has(t))for(const it of its.get(t))applyIntervention(a,it);a.step(FIXED_DT);}const cap=capture(a);const b=restore(cap);assert.equal(exactFingerprint(causalState(a)).sha256,exactFingerprint(causalState(b)).sha256);assert.equal(a.rngStream.snapshot(),b.rngStream.snapshot());
    for(let k=0;k<c.after;k++){const global=c.at+k;if(its.has(global))for(const it of its.get(global)){applyIntervention(a,it);applyIntervention(b,it);}a.step(FIXED_DT);b.step(FIXED_DT);const d=firstDiff(causalState(a),causalState(b));if(d)throw new Error(`${c.id} restore divergence k=${k+1} path=${d.path}`);assert.equal(a.rngStream.snapshot(),b.rngStream.snapshot());}
    out.push({...c,rngState:cap.rngState,final:exactFingerprint(causalState(a)).sha256});
  }
  return out;
}

function rngCallCounts(){
  const out=[];
  for(const p of PROFILES){
    const {oracle,candidate}=pair(p);
    const startState=candidate.rngStream.snapshot();
    let oracleCalls=0,candidateCalls=0;
    const oracleRng=oracle.rng,candidateRng=candidate.rng;
    oracle.rng=()=>{oracleCalls++;return oracleRng();};
    candidate.rng=()=>{candidateCalls++;return candidateRng();};
    const interventions=new Map();
    for(const it of p.interventions??[]){if(!interventions.has(it.boundary))interventions.set(it.boundary,[]);interventions.get(it.boundary).push(it);}
    const max=Math.max(...p.checkpoints);
    for(let tick=0;tick<max;tick++){if(interventions.has(tick))for(const it of interventions.get(tick)){applyIntervention(oracle,it);applyIntervention(candidate,it);}oracle.step(FIXED_DT);candidate.step(FIXED_DT);}
    assert.equal(candidateCalls,oracleCalls,`${p.id} RNG call count`);
    assertPair(oracle,candidate,p.id,max);
    const endState=candidate.rngStream.snapshot();
    const expectedEnd=Number((BigInt(startState)+BigInt(candidateCalls)*0x6D2B79F5n)&0xffffffffn);
    assert.equal(endState,expectedEnd,`${p.id} explicit state arithmetic`);
    out.push({id:p.id,ticks:max,calls:oracleCalls,startState,endState,expectedEnd});
  }
  return out;
}

if(cmd==='rng'){console.log(JSON.stringify(rngSequence(),null,2));}
else if(cmd==='verify'){for(const p of PROFILES){const r=verifyProfile(p,false);console.log(`PASS ${r.id} ticks=${r.ticks} final=${r.final}`)}verifySpecimens();console.log('PASS process-specimens');}
else if(cmd==='dense'){for(const id of (args.length?args:['P-NOMINAL-S1','P-RESIZE','P-INTERVENTION'])){const p=PROFILES.find(x=>x.id===id);const r=verifyProfile(p,true);console.log(`PASS dense ${r.id} ticks=${r.ticks}`)}}
else if(cmd==='restore'){console.log(JSON.stringify(restoreCases(),null,2));}
else if(cmd==='counts'){console.log(JSON.stringify(rngCallCounts(),null,2));}
else console.log('Usage: node tools/m11.mjs <rng|verify|dense|restore|counts>');
