import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { Simulation as MirrorSimulation } from '../src/core/v1-mirror.mjs';
import {
  ROOT, extractOracle, loadOracle, PROFILES, FIXED_DT, BROWSER_CONFIG,
  causalState, exactFingerprint, firstDiff
} from './m0/lib.mjs';

const MIRROR_PATH = path.join(ROOT, 'src/core/v1-mirror.mjs');
const GOLDEN_PATH = path.join(ROOT, 'evidence/m0/golden-fingerprints.json');
const SPECIMENS_PATH = path.join(ROOT, 'evidence/m0/process-specimens.json');
const cmd = process.argv[2] ?? 'help';
const args = process.argv.slice(3);
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');

function mirrorBodyReceipt() {
  const text = fs.readFileSync(MIRROR_PATH, 'utf8');
  const start = text.indexOf('function mulberry32(seed) {');
  const end = text.indexOf('\n\nexport { Simulation, mulberry32 };', start);
  if (start < 0 || end < 0) throw new Error('Mirror body anchors not found');
  const body = text.slice(start, end).trimEnd() + '\n';
  const oracle = extractOracle();
  return {
    mirrorPath: 'src/core/v1-mirror.mjs',
    mirrorFileSha256: sha256(Buffer.from(text)),
    mirrorFileBytes: Buffer.byteLength(text),
    mirrorBodySha256: sha256(Buffer.from(body)),
    mirrorBodyBytes: Buffer.byteLength(body),
    oracleBodySha256: oracle.receipt.oracleSha256,
    exactLiteralBodyMatch: body === oracle.core,
  };
}

function applyIntervention(sim, it) {
  if (it.type === 'resize') sim.setSize(it.width, it.height);
  else if (it.type === 'food-point') sim.addFood(it.count ?? 1, false, { x:it.x, y:it.y });
  else if (it.type === 'food-burst') sim.addFood(it.count ?? 1);
  else if (it.type === 'catastrophe') sim.catastrophe();
  else throw new Error(`Unknown intervention ${it.type}`);
}

function makePair(profile) {
  const { Simulation: OracleSimulation } = loadOracle();
  const config = { seed:profile.seed, width:profile.width, height:profile.height, ...profile.config };
  return { oracle:new OracleSimulation(config), mirror:new MirrorSimulation(config) };
}

function assertPairState(oracle, mirror, profileId, tick) {
  const a = causalState(oracle), b = causalState(mirror);
  const fa = exactFingerprint(a).sha256, fb = exactFingerprint(b).sha256;
  if (fa !== fb) {
    const d = firstDiff(a,b);
    const err = new Error(`${profileId} divergence at tick ${tick}: ${d?.path ?? 'unknown'}; oracle=${JSON.stringify(d?.a)} mirror=${JSON.stringify(d?.b)}`);
    err.diff = d; err.tick = tick; throw err;
  }
  return fa;
}

function profileGolden(profileId) {
  const set = JSON.parse(fs.readFileSync(GOLDEN_PATH,'utf8'));
  const row = set.profiles.find(x => x.profile.id === profileId);
  if (!row) throw new Error(`Missing M0 golden ${profileId}`);
  return row;
}

function verifyProfile(profile) {
  const golden = profileGolden(profile.id);
  const expectedByTick = new Map(golden.observations.map(row => [row[0], row[1]]));
  const checkpoints = new Set(profile.checkpoints);
  const interventions = new Map();
  for (const it of profile.interventions ?? []) {
    if (!interventions.has(it.boundary)) interventions.set(it.boundary, []);
    interventions.get(it.boundary).push(it);
  }
  const {oracle, mirror} = makePair(profile);
  if (checkpoints.has(0)) {
    const fp = assertPairState(oracle,mirror,profile.id,0);
    assert.equal(fp, expectedByTick.get(0), `${profile.id} Oracle no longer matches M0 tick 0`);
  }
  const maxTick = Math.max(...profile.checkpoints);
  for (let tick=0; tick<maxTick; tick++) {
    if (interventions.has(tick)) {
      for (const it of interventions.get(tick)) { applyIntervention(oracle,it); applyIntervention(mirror,it); }
    }
    oracle.step(FIXED_DT); mirror.step(FIXED_DT);
    const done=tick+1;
    if (checkpoints.has(done)) {
      const fp=assertPairState(oracle,mirror,profile.id,done);
      assert.equal(fp, expectedByTick.get(done), `${profile.id} Oracle no longer matches M0 tick ${done}`);
    }
  }
  return { id:profile.id, checkpoints:profile.checkpoints.length, finalFingerprint:expectedByTick.get(maxTick) };
}

function blank(Simulation, seed=1, opts={}) {
  const s=new Simulation({seed,width:900,height:700,...BROWSER_CONFIG,...opts});
  s.blobs=[]; s.foods=[]; s.births=0; s.deaths=0; s.extinctions=0; s.nextId=1; return s;
}
const G={hue:180,speed:.9,sense:68,size:5,eff:.96,wander:.7,diet:0};
function blob(s,{x=450,y=350,energy=70,age=0,g=G,generation=0,id=null}={}) {
  s.spawnBlob(x,y,{...g},generation,energy,false); const b=s.blobs.at(-1);
  if(id!=null)b.id=id; b.vx=0;b.vy=0;b.a=0;b.age=age;b.reproCooldown=0;return b;
}

function runSpecimens(Simulation) {
  const results={format:'gloopipelago-m0-process-specimens',schema:1,specimens:{}};
  {const s=blank(Simulation,7,{mutationScale:0,foodRate:0});blob(s,{energy:1000});s.step(FIXED_DT);const gens=s.blobs.map(x=>x.generation);results.specimens['S-LIVE-APPEND']={births:s.births,generations:gens,fingerprint:exactFingerprint(causalState(s)).sha256}}
  function contested(reverse){const s=blank(Simulation,11,{mutationScale:0,foodRate:0});blob(s,{id:1});blob(s,{id:2});s.nextId=3;if(reverse)s.blobs.reverse();s.foods=[{x:450,y:350,e:10,rich:true,kind:-1,expiresAt:100}];s.step(FIXED_DT);const winner=s.blobs.slice().sort((x,y)=>x.id-y.id).map(x=>[x.id,x.energy]).sort((x,y)=>y[1]-x[1])[0][0];return{winner,state:s}}
  {const n=contested(false),r=contested(true);results.specimens['S-CONTENDED-FOOD']={normalWinner:n.winner,reversedWinner:r.winner,normalFingerprint:exactFingerprint(causalState(n.state)).sha256,reversedFingerprint:exactFingerprint(causalState(r.state)).sha256}}
  {const s=blank(Simulation,13,{mutationScale:0,foodRate:0});for(let i=0;i<259;i++)blob(s,{x:10+(i%30)*20,y:10+Math.floor(i/30)*20,energy:i<2?200:1,id:i+1});s.nextId=260;s.step(FIXED_DT);results.specimens['S-POP-CAP']={population:s.blobs.length,births:s.births,firstCooldown:s.blobs.find(x=>x.id===1).reproCooldown,secondCooldown:s.blobs.find(x=>x.id===2).reproCooldown,fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(Simulation,17,{mutationScale:0,foodRate:0});blob(s,{energy:200,age:170});s.step(FIXED_DT);results.specimens['S-AGE-REPRO']={births:s.births,deaths:s.deaths,survivorGenerations:s.blobs.map(x=>x.generation),fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(Simulation,19,{mutationScale:0,foodRate:0});blob(s);s.foods=[{x:450,y:350,e:5,rich:true,kind:-1,expiresAt:100},{x:450,y:350,e:15,rich:true,kind:-1,expiresAt:100}];s.step(FIXED_DT);results.specimens['S-FOOD-ORDER']={remainingEnergy:s.foods.map(f=>f.e),fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(Simulation,23,{mutationScale:0,foodRate:0});const survivor=blob(s,{energy:70,id:1});blob(s,{energy:-1,id:2});s.nextId=3;let seq=[1,0,.5];s.rng=()=>seq.length?seq.shift():.5;s.step(FIXED_DT);const afterFirst={foods:s.foods.length,survivorEnergy:survivor.energy,deaths:s.deaths};const before=survivor.energy;s.step(FIXED_DT);results.specimens['S-CORPSE-PHASE']={afterFirst,afterSecond:{foods:s.foods.length,survivorEnergy:survivor.energy,deaths:s.deaths},fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(Simulation,29,{mutationScale:0,foodRate:0});s.foods=Array.from({length:10},(_,i)=>({x:i,y:0,e:i+1,rich:false,kind:0,expiresAt:100}));s.blobs=[];s.catastrophe();results.specimens['S-CATASTROPHE']={remaining:s.foods.map(f=>f.e),fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(Simulation,31,{mutationScale:0,foodRate:0});blob(s,{energy:1e9});for(let i=0;i<2040;i++)s.step(FIXED_DT);const t=s.simTime,se=s.season;s.step(FIXED_DT);results.specimens['S-FLOAT-TIME']={tick2040:{simTime:t,season:se},tick2041:{simTime:s.simTime,season:s.season},fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(Simulation,37,{mutationScale:0,foodRate:0,autoReseed:false});s.step(FIXED_DT);const afterFirst={population:s.blobs.length,extinctions:s.extinctions};s.step(FIXED_DT);const afterSecond={population:s.blobs.length,extinctions:s.extinctions};results.specimens['S-EMPTY-NORESEED']={afterFirst,afterSecond,fingerprint:exactFingerprint(causalState(s)).sha256}}
  {const s=blank(Simulation,41,{mutationScale:0,foodRate:0,autoReseed:true});s.step(FIXED_DT);const afterFirst={population:s.blobs.length,extinctions:s.extinctions,nextId:s.nextId};results.specimens['S-EMPTY-AUTORESEED']={afterFirst,generations:s.blobs.map(b=>b.generation),fingerprint:exactFingerprint(causalState(s)).sha256}}
  return results;
}

function verifySpecimens() {
  const expectedText=fs.readFileSync(SPECIMENS_PATH,'utf8');
  const expected=JSON.parse(expectedText);
  const mirror=runSpecimens(MirrorSimulation);
  assert.deepEqual(mirror, expected);
  const mirrorText=JSON.stringify(mirror,null,2)+'\n';
  assert.equal(sha256(mirrorText),sha256(expectedText));
  return sha256(mirrorText);
}


function denseVerifyProfile(profile) {
  const interventions = new Map();
  for (const it of profile.interventions ?? []) {
    if (!interventions.has(it.boundary)) interventions.set(it.boundary, []);
    interventions.get(it.boundary).push(it);
  }
  const {oracle, mirror} = makePair(profile);
  assertPairState(oracle, mirror, profile.id, 0);
  const maxTick = Math.max(...profile.checkpoints);
  for (let tick=0; tick<maxTick; tick++) {
    if (interventions.has(tick)) for (const it of interventions.get(tick)) { applyIntervention(oracle,it); applyIntervention(mirror,it); }
    oracle.step(FIXED_DT); mirror.step(FIXED_DT);
    const a=causalState(oracle), b=causalState(mirror);
    const d=firstDiff(a,b);
    if (d) throw new Error(`${profile.id} dense divergence at tick ${tick+1}: ${d.path}`);
  }
  return {id:profile.id,ticks:maxTick,finalFingerprint:exactFingerprint(causalState(oracle)).sha256};
}

function pairedThroughput(iterations=4,ticks=6000) {
  const { Simulation: OracleSimulation }=loadOracle();
  const rows=[];
  for(let i=0;i<iterations;i++){
    const seed=[1,0x12345678,0x9E3779B9,0xDEADBEEF][i%4];
    const order=i%2===0?['oracle','mirror']:['mirror','oracle'];
    const result={seed,order};
    for(const name of order){
      const S=name==='oracle'?OracleSimulation:MirrorSimulation;
      const s=new S({seed,width:900,height:700,...BROWSER_CONFIG});
      for(let w=0;w<300;w++)s.step(FIXED_DT);
      const t0=performance.now(); for(let t=0;t<ticks;t++)s.step(FIXED_DT); const ms=performance.now()-t0;
      result[name]={ms,ticksPerSecond:ticks/(ms/1000)};
    }
    result.ratio=result.mirror.ticksPerSecond/result.oracle.ticksPerSecond; rows.push(result);
  }
  const ratios=rows.map(r=>r.ratio).sort((a,b)=>a-b);
  const median=(ratios[Math.floor((ratios.length-1)/2)]+ratios[Math.ceil((ratios.length-1)/2)])/2;
  return {format:'gloopipelago-m1-paired-throughput',schema:1,rows,medianMirrorOverOracle:median,note:'Characterization only; product/browser throughput remains a separate gate.'};
}

if(cmd==='source'){
  const r=mirrorBodyReceipt(); assert.equal(r.exactLiteralBodyMatch,true); console.log(JSON.stringify(r,null,2));
}else if(cmd==='verify'){
  const r=mirrorBodyReceipt(); assert.equal(r.exactLiteralBodyMatch,true,'Mirror source body is not literal oracle body');
  const chosen=args.length?PROFILES.filter(p=>args.includes(p.id)):PROFILES;
  for(const p of chosen){const x=verifyProfile(p);console.log(`PASS ${x.id} checkpoints=${x.checkpoints} final=${x.finalFingerprint}`)}
  const specimenSha=verifySpecimens(); console.log(`PASS process-specimens sha256=${specimenSha}`);
}else if(cmd==='specimens'){
  console.log(JSON.stringify(runSpecimens(MirrorSimulation),null,2));
}else if(cmd==='dense'){
  const defaults=['P-NOMINAL-S1','P-RESIZE','P-INTERVENTION'];
  const ids=args.length?args:defaults;
  for (const id of ids) { const p=PROFILES.find(x=>x.id===id); if(!p) throw new Error(`Unknown profile ${id}`); const r=denseVerifyProfile(p); console.log(`PASS dense ${r.id} ticks=${r.ticks} final=${r.finalFingerprint}`); }
}else if(cmd==='throughput'){
  console.log(JSON.stringify(pairedThroughput(),null,2));
}else{
  console.log('Usage: node tools/m1.mjs <source|verify|dense|specimens|throughput> [profile ids...]');
}
