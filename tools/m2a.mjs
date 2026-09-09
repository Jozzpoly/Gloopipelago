import fs from 'node:fs';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { Simulation } from '../src/core/v1-mirror.mjs';
import {
  loadOracle, PROFILES, FIXED_DT, BROWSER_CONFIG,
  causalState, exactFingerprint, firstDiff
} from './m0/lib.mjs';

const cmd = process.argv[2] ?? 'help';
const args = process.argv.slice(3);
const SPECIMENS_PATH = new URL('../evidence/m0/process-specimens.json', import.meta.url);

function applyIntervention(sim,it){
  if(it.type==='resize') sim.setSize(it.width,it.height);
  else if(it.type==='food-point') sim.addFood(it.count ?? 1,false,{x:it.x,y:it.y});
  else if(it.type==='food-burst') sim.addFood(it.count ?? 1);
  else if(it.type==='catastrophe') sim.catastrophe();
  else throw new Error(`Unknown intervention ${it.type}`);
}

function modeSink(mode, collector){
  if(mode==='off') return null;
  if(mode==='collector') return record => collector.push(record);
  if(mode==='no-retain') return () => {};
  if(mode==='throwing') return () => { throw new Error('intentional witness failure'); };
  if(mode==='mutating') return record => {
    record.kind='tampered';
    record.id=-999;
    record.time=-123;
    if('parentId' in record) record.parentId=-777;
    if(record.genome){
      for(const k of Object.keys(record.genome)) record.genome[k]=999999;
      record.genome.injected=true;
    }
    record.injected={bad:true};
  };
  throw new Error(`Unknown mode ${mode}`);
}

function profilePair(profile, mode){
  const {Simulation:Oracle}=loadOracle();
  const cfg={seed:profile.seed,width:profile.width,height:profile.height,...profile.config};
  const events=[];
  const oracle=new Oracle(cfg);
  const candidate=new Simulation(cfg,{lifecycleWitness:modeSink(mode,events)});
  return {oracle,candidate,events};
}

function assertPair(a,b,id,tick){
  const sa=causalState(a), sb=causalState(b);
  const fa=exactFingerprint(sa).sha256, fb=exactFingerprint(sb).sha256;
  if(fa!==fb){
    const d=firstDiff(sa,sb);
    throw new Error(`${id} divergence tick=${tick} path=${d?.path} oracle=${JSON.stringify(d?.a)} candidate=${JSON.stringify(d?.b)}`);
  }
  return fa;
}

function runProfile(profile, mode, dense=false){
  const {oracle,candidate,events}=profilePair(profile,mode);
  const interventions=new Map();
  for(const it of profile.interventions??[]){
    if(!interventions.has(it.boundary)) interventions.set(it.boundary,[]);
    interventions.get(it.boundary).push(it);
  }
  let oracleCalls=0,candidateCalls=0;
  const oracleRng=oracle.rng,candidateRng=candidate.rng;
  oracle.rng=()=>{oracleCalls++;return oracleRng();};
  candidate.rng=()=>{candidateCalls++;return candidateRng();};
  const max=Math.max(...profile.checkpoints);
  assertPair(oracle,candidate,profile.id,0);
  for(let tick=0;tick<max;tick++){
    if(interventions.has(tick)) for(const it of interventions.get(tick)){
      applyIntervention(oracle,it); applyIntervention(candidate,it);
    }
    oracle.step(FIXED_DT); candidate.step(FIXED_DT);
    if(dense) assertPair(oracle,candidate,profile.id,tick+1);
  }
  assertPair(oracle,candidate,profile.id,max);
  assert.equal(candidateCalls,oracleCalls,`${profile.id}/${mode} RNG call count`);
  const birthEvents=events.filter(e=>e.kind==='birth').length;
  const deathEvents=events.filter(e=>e.kind==='death').length;
  if(mode==='collector'){
    assert.equal(birthEvents,candidate.births,`${profile.id} birth accounting`);
    assert.equal(deathEvents,candidate.deaths,`${profile.id} death accounting`);
  }
  return {
    id:profile.id, mode, ticks:max, rngCalls:candidateCalls,
    final:exactFingerprint(causalState(candidate)).sha256,
    events:events.length,birthEvents,deathEvents
  };
}

function parity(mode, ids=[]){
  const selected=ids.length?ids.map(id=>{const p=PROFILES.find(x=>x.id===id);assert(p,`Unknown profile ${id}`);return p;}):PROFILES;
  const out=[];
  for(const p of selected){
    const r=runProfile(p,mode,false); out.push(r);
    console.log(`PASS ${mode} ${r.id} ticks=${r.ticks} events=${r.events}`);
  }
  return out;
}

function dense(mode='collector', ids=[]){
  ids=ids.length?ids:['P-NOMINAL-S1','P-RESIZE','P-INTERVENTION'];
  for(const id of ids){
    const p=PROFILES.find(x=>x.id===id); assert(p,`Unknown profile ${id}`);
    const r=runProfile(p,mode,true); console.log(`PASS dense ${mode} ${id} ticks=${r.ticks}`);
  }
}

const G={hue:180,speed:.9,sense:68,size:5,eff:.96,wander:.7,diet:0};
function blank(seed=1,opts={},sink=null){
  const events=[];
  const lifecycleWitness=sink ?? (r=>events.push(r));
  const s=new Simulation({seed,width:900,height:700,...BROWSER_CONFIG,...opts},{lifecycleWitness});
  events.length=0;
  s.blobs=[];s.foods=[];s.births=0;s.deaths=0;s.extinctions=0;s.nextId=1;
  return {s,events};
}
function blob(s,{x=450,y=350,energy=70,age=0,g=G,generation=0,id=null}={}){
  const b=s.spawnBlob(x,y,{...g},generation,energy,false);
  if(id!=null)b.id=id;
  b.vx=0;b.vy=0;b.a=0;b.age=age;b.reproCooldown=0;
  return b;
}

function semanticSpecimens(){
  const out={format:'gloopipelago-m2a-lifecycle-specimens',schema:1,specimens:{}};

  {
    const events=[];
    const s=new Simulation({seed:123,width:900,height:700,...BROWSER_CONFIG},{lifecycleWitness:r=>events.push(r)});
    assert.equal(events.length,34);
    assert.deepEqual(events.map(e=>e.id),Array.from({length:34},(_,i)=>i+1));
    assert(events.every(e=>e.kind==='founder'&&e.origin==='initial'&&e.generation===0&&Object.is(e.time,0)));
    assert(events.every(e=>Object.keys(e.genome).sort().join(',')==='diet,eff,hue,sense,size,speed,wander'));
    out.specimens.initial={count:events.length,ids:[events[0].id,events.at(-1).id],time:events[0].time,nextId:s.nextId};

    events.length=0; s.reset(321);
    assert.equal(events.length,34); assert(events.every(e=>e.origin==='reset'&&e.kind==='founder'));
    out.specimens.reset={count:events.length,ids:[events[0].id,events.at(-1).id],time:events[0].time};
  }

  {
    const {s,events}=blank(7,{mutationScale:0,foodRate:0});
    blob(s,{energy:1000});
    assert.equal(events.length,0,'direct spawnBlob is outside lifecycle witness contract');
    s.step(FIXED_DT);
    const births=events.filter(e=>e.kind==='birth');
    assert.equal(births.length,3);
    assert.deepEqual(births.map(e=>[e.parentId,e.id,e.generation]),[[1,2,1],[2,3,2],[3,4,3]]);
    out.specimens.birthCascade={pairs:births.map(e=>[e.parentId,e.id,e.generation]),births:s.births};
  }

  {
    const {s,events}=blank(17,{mutationScale:0,foodRate:0,autoReseed:false});
    blob(s,{energy:-1,age:171});
    s.step(FIXED_DT);
    const deaths=events.filter(e=>e.kind==='death');
    assert.equal(deaths.length,1);
    assert.equal(deaths[0].mechanism,'natural-sweep');
    assert.equal(deaths[0].energyDepleted,true); assert.equal(deaths[0].ageExceeded,true);
    out.specimens.naturalBoth={id:deaths[0].id,energyDepleted:true,ageExceeded:true,deaths:s.deaths};
  }

  {
    const {s,events}=blank(29,{mutationScale:0,foodRate:0,autoReseed:false});
    blob(s,{id:1});blob(s,{id:2,energy:-1,age:171});blob(s,{id:3});s.nextId=4;
    s.foods=[{x:1,y:1,e:9,rich:true,kind:-1,expiresAt:100}];
    s.rng=()=>0;
    s.catastrophe();
    const deaths=events.filter(e=>e.kind==='death');
    assert.equal(deaths.length,3); assert(deaths.every(e=>e.mechanism==='catastrophe'));
    assert.equal(s.foods.length,1,'catastrophe death must not create corpse food');
    const flagged=deaths.find(e=>e.id===2); assert(flagged.energyDepleted&&flagged.ageExceeded);
    out.specimens.catastrophe={ids:deaths.map(e=>e.id),foods:s.foods.length,deaths:s.deaths,flagged:[flagged.energyDepleted,flagged.ageExceeded]};
  }

  {
    const {s,events}=blank(41,{mutationScale:0,foodRate:0,autoReseed:true});
    s.step(FIXED_DT);
    const founders=events.filter(e=>e.kind==='founder');
    assert.equal(s.extinctions,1); assert.equal(founders.length,12);
    assert(founders.every(e=>e.origin==='auto-reseed'&&e.generation===0));
    assert.deepEqual(founders.map(e=>e.id),Array.from({length:12},(_,i)=>i+1));
    out.specimens.autoReseed={extinctions:s.extinctions,count:founders.length,ids:[founders[0].id,founders.at(-1).id]};
  }

  {
    const records=[];
    const s=new Simulation({seed:99,width:900,height:700,...BROWSER_CONFIG},{lifecycleWitness:r=>records.push(r)});
    const before=structuredClone(s.blobs[0]);
    records[0].id=-1; records[0].x=-1; records[0].genome.speed=99999; records[0].genome.injected=true;
    assert.deepEqual(s.blobs[0],before);
    assert(!Object.hasOwn(s.blobs[0],'parentId'));
    assert(!Object.hasOwn(s.blobs[0].g,'injected'));
    out.specimens.detached={blobId:s.blobs[0].id,genomeSpeed:s.blobs[0].g.speed,parentIdInBlob:Object.hasOwn(s.blobs[0],'parentId')};
  }

  {
    const s=new Simulation({seed:101,width:900,height:700,...BROWSER_CONFIG,mutationScale:0,foodRate:0});
    const arrayKeys=Object.entries(s).filter(([,v])=>Array.isArray(v)).map(([k])=>k).sort();
    assert.deepEqual(arrayKeys,['blobs','foods']);
    s._emitFounder=()=>{throw new Error('OFF path called founder helper');};
    s._emitBirth=()=>{throw new Error('OFF path called birth helper');};
    s._emitDeath=()=>{throw new Error('OFF path called death helper');};
    s.reset(101);
    s.blobs[0].energy=1000; s.step(FIXED_DT);
    s.blobs[0].energy=-1; s.blobs[0].age=171; s.step(FIXED_DT);
    out.specimens.offFastPath={arrayKeys,hasWitnessCollection:Object.keys(s).some(k=>/event|record|history/i.test(k)&&Array.isArray(s[k]))};
    assert.equal(out.specimens.offFastPath.hasWitnessCollection,false);
  }

  {
    const holder={sim:null,observed:[]};
    const sink=r=>{if(holder.sim) holder.observed.push({kind:r.kind,births:holder.sim.births,deaths:holder.sim.deaths,pop:holder.sim.blobs.length});};
    const {s}=blank(55,{mutationScale:0,foodRate:0},sink); holder.sim=s;
    blob(s,{energy:1000}); s.step(FIXED_DT);
    const birthObs=holder.observed.filter(x=>x.kind==='birth');
    assert(birthObs.length>0); assert(birthObs.every((x,i)=>x.births===i+1));
    holder.observed=[];
    s.blobs=[blob(s,{energy:-1,age:171,id:100})];s.nextId=101;s.births=0;s.deaths=0;s.foods=[];
    s.step(FIXED_DT);
    const deathObs=holder.observed.find(x=>x.kind==='death'); assert.equal(deathObs.deaths,1); assert.equal(deathObs.pop,0);
    out.specimens.transitionCommitted={birthObservations:birthObs,deathObservation:deathObs};
  }

  return out;
}

function adversarialDetached(){
  const cfg={seed:0x12345678,width:900,height:700,...BROWSER_CONFIG};
  const control=new Simulation(cfg);
  const mutant=new Simulation(cfg,{lifecycleWitness:modeSink('mutating',[])});
  assert.equal(exactFingerprint(causalState(control)).sha256,exactFingerprint(causalState(mutant)).sha256);
  for(let i=0;i<5000;i++){control.step(FIXED_DT);mutant.step(FIXED_DT);if(i%250===0)assertPair(control,mutant,'adversarial-mutating',i+1);}
  assertPair(control,mutant,'adversarial-mutating',5000);
  return {ticks:5000,final:exactFingerprint(causalState(control)).sha256};
}

function verifyM0SpecimensCandidate(){
  const expected=JSON.parse(fs.readFileSync(SPECIMENS_PATH,'utf8'));
  // Existing M1.1 harness already exercises candidate-only protected specimens.
  return {expectedSha:exactFingerprint(expected).sha256};
}

async function throughput(){
  const baselinePath=process.env.M2A_BASELINE_MODULE;
  assert(baselinePath,'Set M2A_BASELINE_MODULE to the pre-M2a native core module');
  const {Simulation:Baseline}=await import(pathToFileURL(path.resolve(baselinePath)).href+`?t=${Date.now()}`);
  const profiles=['P-NOMINAL-S1','P-COMPACT'];
  const reps=5; const ticks=6000;
  const rows=[];
  function run(Sim,p,mode){
    const cfg={seed:p.seed,width:p.width,height:p.height,...p.config};
    const events=[]; const sink=mode==='off'?null:mode==='no-retain'?()=>{}:r=>events.push(r);
    if(global.gc) global.gc();
    const heapBefore=process.memoryUsage().heapUsed;
    const s=mode==='baseline'?new Sim(cfg):new Sim(cfg,{lifecycleWitness:sink});
    const t0=performance.now(); for(let i=0;i<ticks;i++)s.step(FIXED_DT); const ms=performance.now()-t0;
    const heapAfter=process.memoryUsage().heapUsed;
    return {ms,tps:ticks/(ms/1000),events:events.length,births:s.births,deaths:s.deaths,heapDelta:heapAfter-heapBefore};
  }
  for(const id of profiles){
    const p=PROFILES.find(x=>x.id===id);
    // Warmup all execution shapes once.
    run(Baseline,p,'baseline');run(Simulation,p,'off');run(Simulation,p,'no-retain');run(Simulation,p,'collector');
    for(let rep=0;rep<reps;rep++){
      const order=rep%2===0?['baseline','off','no-retain','collector']:['collector','no-retain','off','baseline'];
      for(const mode of order){
        const r=mode==='baseline'?run(Baseline,p,'baseline'):run(Simulation,p,mode);
        rows.push({id,rep,mode,...r});
      }
    }
  }
  function median(xs){const a=[...xs].sort((a,b)=>a-b);return a[Math.floor(a.length/2)];}
  const summary={};
  for(const id of profiles){
    const rr=rows.filter(r=>r.id===id);
    const med={}; for(const mode of ['baseline','off','no-retain','collector']) med[mode]=median(rr.filter(r=>r.mode===mode).map(r=>r.tps));
    const byRep=new Map();
    for(const r of rr){if(!byRep.has(r.rep))byRep.set(r.rep,{});byRep.get(r.rep)[r.mode]=r;}
    const paired={offVsBaseline:[],noRetainVsOff:[],collectorVsOff:[]};
    for(const d of byRep.values()){
      paired.offVsBaseline.push(d.off.tps/d.baseline.tps);
      paired.noRetainVsOff.push(d['no-retain'].tps/d.off.tps);
      paired.collectorVsOff.push(d.collector.tps/d.off.tps);
    }
    const heap={}; for(const mode of ['baseline','off','no-retain','collector']) heap[mode]=median(rr.filter(r=>r.mode===mode).map(r=>r.heapDelta));
    summary[id]={medianTps:med,pairedMedianRatios:Object.fromEntries(Object.entries(paired).map(([k,v])=>[k,median(v)])),pairedRatios:paired,medianHeapDelta:heap,eventsMedian:median(rr.filter(r=>r.mode==='collector').map(r=>r.events))};
  }
  return {format:'gloopipelago-m2a-throughput',schema:1,ticks,reps,profiles,summary,rows};
}

if(cmd==='parity'){
  const mode=args[0]??'collector'; console.log(JSON.stringify(parity(mode,args.slice(1)),null,2));
}else if(cmd==='dense') dense(args[0]??'collector',args.slice(1));
else if(cmd==='specimens') console.log(JSON.stringify(semanticSpecimens(),null,2));
else if(cmd==='adversarial') console.log(JSON.stringify(adversarialDetached(),null,2));
else if(cmd==='throughput') console.log(JSON.stringify(await throughput(),null,2));
else if(cmd==='m0-specimens') console.log(JSON.stringify(verifyM0SpecimensCandidate(),null,2));
else console.log('Usage: node tools/m2a.mjs <parity [off|collector|no-retain|throwing|mutating]|dense [mode]|specimens|adversarial|throughput>');
